import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ErrorBoundary from "../../ErrorBoundary";
import { NotificationGroupSummaryPageComposite } from "../Summary/NotificationGroupSummaryComposite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import lodash from "lodash";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { functionGroups, fnNotificationGroup } from "../../../JS/FunctionGroups";
import { emptyNotificationGroup } from "../../../JS/DefaultEntities";
import { notificationGroupValidationDef } from "../../../JS/ValidationDef";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as KeyCodes from "../../../JS/KeyCodes";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class NotificationGroupComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: [],
    data: [],
    notificationData: lodash.cloneDeep(emptyNotificationGroup),
    validationErrors: Utilities.getInitialValidationErrors(notificationGroupValidationDef),
    modNotificationData: {},
    saveEnabled: false,
    showAuthenticationLayout: false,
    showDeleteAuthenticationLayout : false,
    tempNotificationData: {},
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnNotificationGroup
      );
      this.setState({
        operationsVisibilty,
      });
      this.getNotificationGroupList();
    } catch (error) {
      console.log(
        "NotificationGroupComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        operationsVisibilty,
      })
      this.setDefaultValues();
    } catch (error) {
      console.log("NotificationGroupComposite:Error occured on handleAdd", error);
    }
  };
  handleRowClick = (item) => {
    
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnNotificationGroup
      );
      operationsVisibilty.delete = true;
      this.setState({
        isDetails: true,
        notificationData: item.rowData,
        modNotificationData: item.rowData,
        operationsVisibilty,
      })
    } catch (error) {
      console.log("NotificationGroupComposite:Error occured on Row click", error);
    }
  };
  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const notificationData = lodash.cloneDeep(this.state.notificationData);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modNotificationData: { ...notificationData },
        validationErrors,
      });
    } catch (error) {
      console.log("NotificationGroupDetailsComposite:Error occured on handleReset", error);
    }
  };
  validateSave(modNotificationData) {
    
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(notificationGroupValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        notificationGroupValidationDef[key],
        modNotificationData[key]
      );
    });
    this.setState({
      validationErrors
    })
    var returnValue = true;
    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });


    return returnValue;
  }
  handleChange = (propertyName, data) => {
    
    try {
      const modNotificationData = lodash.cloneDeep(this.state.modNotificationData);
      modNotificationData[propertyName] = data;
      
      this.setState({ modNotificationData });
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (notificationGroupValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          notificationGroupValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "NotificationGroupDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };
  handleDelete = () => {
    
    try {
      this.handleAuthenticationClose();
      let modNotificationData=lodash.cloneDeep(this.state.modNotificationData)
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var GroupCode = modNotificationData.GroupCode
      let keyCode = [
        {
          key: KeyCodes.NotificationGroupCode,
          value: GroupCode,
        },
      ]
      let obj = {
        keyDataCode: KeyCodes.NotificationGroupCode,
        KeyCodes: keyCode,
      };
      let notification = {
        messageType: "critical",
        message: "NotificationGroup_DeleteMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationGroup_GroupCode"],
            keyValues: [GroupCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.DeleteNotificationGroup,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess
          if (result.IsSuccess === true) {
            operationsVisibilty.delete = false;
            this.setState({ isReadyToRender: false, operationsVisibilty }, () => {
              this.getNotificationGroupList();
              this.setDefaultValues()
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              "Notification_DelFailure";
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty });
          }

          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );

          
        })
        .catch((error) => {
          console.log("Error occured while deleting:" + error);
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({ operationsVisibilty });
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        });
    } catch (error) {
      console.log("NotificationgroupComposite:Error occured on handleDelete", error);
    }
  };

  addUpdateNotificationGroup = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ saveEnabled: false });
      let tempNotificationData = lodash.cloneDeep(this.state.tempNotificationData);
     
      this.state.notificationData.GroupCode === ""
          ? this.CreateNotificationGroup(tempNotificationData)
          : this.updateNotificationGroup(tempNotificationData);

    } catch (error) {
      console.log("Notificatioon Details Composite : Error in addUpdateNotificationGroup");
    }
  };

  handleSave = () => {
    try {
      // let modNotificationData = this.fillDetails();
      let modNotificationData = lodash.cloneDeep(this.state.modNotificationData);
      //this.setState({ saveEnabled: false });
      if (this.validateSave(modNotificationData)){
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempNotificationData = lodash.cloneDeep(modNotificationData);
      this.setState({ showAuthenticationLayout, tempNotificationData }, () => {
        if (showAuthenticationLayout === false) {
          this.addUpdateNotificationGroup();
        }
    });
      } else this.setState({ saveEnabled: true });
    }
    catch (error) {
      console.log("NotificationGroupComposite:Error occured on handleSave", error);
    }
  };
  setDefaultValues() {
    this.setState({
      modNotificationData: lodash.cloneDeep(emptyNotificationGroup),
      notificationData: lodash.cloneDeep(emptyNotificationGroup)
    })
  }
  CreateNotificationGroup(modNotificationData) {
    try {

      modNotificationData.Active=modNotificationData.Active === "" || modNotificationData.Active === undefined ? true : modNotificationData.Active;
      let keyCode = [
        {
          key: KeyCodes.NotificationGroupCode,
          value: modNotificationData.GroupCode,
        },
        {
          key: KeyCodes.NotificationGroupStatus,
          value: modNotificationData.Active,
        },
        {
          key: KeyCodes.NotificationGroupDesc,
          value: modNotificationData.Description,
        },
      ];
      let obj = {
        keyDataCode: KeyCodes.NotificationGroupCode,
        KeyCodes: keyCode,
        // Entity: modNotificationData,
      };
      let notification = {
        messageType: "critical",
        message: "NotificationGroup_SuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationGroup_GroupCode"],
            keyValues: [modNotificationData.GroupCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.CreateNotificationGroup,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
      
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnNotificationGroup
              ),
              notificationData: modNotificationData,
              modNotificationData: modNotificationData
            },
            () => {
              this.getNotificationGroupList();
              // this.setDefaultValues();
            }
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnNotificationGroup
            ),
          });
          console.log("Error in NotificationGroup:", result.ErrorList);
        }
        const operationsVisibilty = { ...this.state.operationsVisibilty };
        if (notification.messageType === "success") {
          operationsVisibilty.add = true;
          operationsVisibilty.delete = true;
          this.setState({ isDetails: true, operationsVisibilty });
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnNotificationGroup
            ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        });
    } catch (error) {
      console.log("Error in Createnotificationgroup",error)
    }
  }
  updateNotificationGroup(modNotificationData) {
    try {
      let keyCode = [
        {
          key: KeyCodes.NotificationGroupCode,
          value: modNotificationData.GroupCode,
        },
        {
          key: KeyCodes.NotificationGroupStatus,
          value: modNotificationData.Active,
        },
        {
          key: KeyCodes.NotificationGroupDesc,
          value: modNotificationData.Description,
        },
      ];
      let obj = {
        keyDataCode: KeyCodes.NotificationGroupCode,
        KeyCodes: keyCode,
        // Entity: modNotificationData,
      };

      let notification = {
        messageType: "critical",
        message: "NotificationGroup_SuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationGroup_GroupCode"],
            keyValues: [modNotificationData.GroupCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateNotificationGroup,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
      
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnNotificationGroup
              ),
            },
            () => {
              this.getNotificationGroupList();
              // this.setDefaultValues();
            }
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnNotificationGroup
            ),
          });
        }
        
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      
      })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnNotificationGroup
            ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        });
    } catch (error) {
      console.log("Error  while updatenotificatiogroup",error)
    }
  }
  getNotificationGroupList() {
    
    try {
      axios(
        RestAPIs.GetNotificationGroup,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              data: result.EntityResult, isReadyToRender: true, saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnNotificationGroup
              ), });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getNotificationGroupList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting getNotificationGroupList:", error);
        });
    } catch (error) {
      console.log("Error while getnotificationlist",error)
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false, showDeleteAuthenticationLayout: false,
    });
  };

  
  getActionType() {
    if (this.state.showDeleteAuthenticationLayout)
     return functionGroups.remove;
   else if (this.state.showAuthenticationLayout)
     return (
      this.state.notificationData.GroupCode === ""
      ? functionGroups.add
      : functionGroups.modify
     )
 }

 getOperation () {
  if (this.state.showDeleteAuthenticationLayout)
    return this.handleDelete;
  else if (this.state.showAuthenticationLayout)
    return this.addUpdateNotificationGroup;
  
}

  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("NotificationGroup Delete : Error in authenticateDelete");
    }
  };

  render() {
    return (
      <div className="buttonstyle">
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            shrVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
          {this.state.isReadyToRender ? (
            <ErrorBoundary>
              <NotificationGroupSummaryPageComposite
              tableData={this.state.data.Table}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              terminalsToShow={
                this.props.userDetails.EntityResult.PageAttibutes
                  .NoOfTerminalsToShow
              }
              onRowClick={this.handleRowClick}
              modNotificationData={this.state.modNotificationData}
              notificationData={this.state.notificationData}
               isDetails={this.state.isDetails}
              handleSave={this.handleSave}
              onFieldChange={this.handleChange}
              handleReset={this.handleReset}
              validationErrors={this.state.validationErrors}
              saveEnabled={this.state.saveEnabled}
              ></NotificationGroupSummaryPageComposite>
          </ErrorBoundary>
        ) : (
          <>
              <LoadingPage message="Loading"></LoadingPage>
          </>
        )}
        <ErrorBoundary>
          <ToastContainer
            hideProgressBar={true}
            closeOnClick={false}
            closeButton={true}
            newestOnTop={true}
            position="bottom-right"
            toastClassName="toast-notification-wrap"
          />
        </ErrorBoundary>
        {this.state.showAuthenticationLayout || this.state.showDeleteAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getActionType()}
            functionGroup={fnNotificationGroup}
            handleOperation={this.getOperation()}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
      </div>
    );
  }
}
    


const mapStateToProps = (state) => {
    return {
      userDetails: state.getUserDetails.userDetails,
      tokenDetails: state.getUserDetails.TokenAuth,
    };
  };
  
  export default connect(mapStateToProps)(NotificationGroupComposite);
  
  NotificationGroupComposite.propTypes = {
    activeItem: PropTypes.object,
  };
