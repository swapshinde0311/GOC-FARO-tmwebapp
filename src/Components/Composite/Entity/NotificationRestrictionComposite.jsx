import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ErrorBoundary from "../../ErrorBoundary";
import { NotificationRestrictionSummaryPageComposite } from "../Summary/NotificationRestrictionSummaryComposite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import lodash from "lodash";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { functionGroups, fnNotificationRestriction } from "../../../JS/FunctionGroups";
import { emptyNotificationRestriction } from "../../../JS/DefaultEntities";
import { notificationRestrictionValidationDef } from "../../../JS/ValidationDef";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as KeyCodes from "../../../JS/KeyCodes";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class NotificationRestrictionComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    data: [],
    notificationData: lodash.cloneDeep(emptyNotificationRestriction),
    validationErrors: Utilities.getInitialValidationErrors(notificationRestrictionValidationDef),
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
        fnNotificationRestriction
      );
      this.setState({
        operationsVisibilty,
      });
      this.getNotificationRestrictionList();
    } catch (error) {
      console.log(
        "NotificationGroupComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  handleAdd = () => {
    
    try {
      var { operationsVisibilty} = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        operationsVisibilty,
      })
      this.setDefaultValues();
    } catch (error) {
      console.log("NotificationRestrictionComposite:Error occured on handleAdd", error);
    }
  };
  setDefaultValues() {
    this.setState({
      modNotificationData: lodash.cloneDeep(emptyNotificationRestriction),
      notificationData: lodash.cloneDeep(emptyNotificationRestriction)
    })
  }
  handleRowClick = (item) => {

    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnNotificationRestriction
      );
      operationsVisibilty.delete = true;
      this.setState({
        isDetails: true,
        notificationData: item.rowData,
        modNotificationData:item.rowData,
        operationsVisibilty,
      })
    } catch (error) {
      console.log("NotificationRestrictionComposite:Error occured on Row click", error);
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
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(notificationRestrictionValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          notificationRestrictionValidationDef[key],
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
    } catch (error) {
      console.log("Error in Validatesave",error)
    }
  }
  handleChange = (propertyName, data) => {

    try {
      const modNotificationData = lodash.cloneDeep(this.state.modNotificationData);
      modNotificationData[propertyName] = data;
      this.setState({ modNotificationData });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (notificationRestrictionValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          notificationRestrictionValidationDef[propertyName],
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
      let modNotificationData = lodash.cloneDeep(this.state.modNotificationData)
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var MessageCode = modNotificationData.MessageCode
      let keyCode = [
        {
          key: KeyCodes.NotificationResMsgCode,
          value: modNotificationData.MessageCode,
        },

        {
          key: KeyCodes.NotificationResSource,
          value: modNotificationData.MessageSource,
        },
      ]
      let obj = {
        keyDataCode: KeyCodes.NotificationResMsgCode,
        KeyCodes: keyCode,
      };
      let notification = {
        messageType: "critical",
        message: "NotificationRestriction_DeleteMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationGroup_GroupCode"],
            keyValues: [MessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.DeleteNotificationRestriction,
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
              this.getNotificationRestrictionList();
              this.setDefaultValues();
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

  addUpdateNotificationRestriction = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ saveEnabled: false });
      let tempNotificationData = lodash.cloneDeep(this.state.tempNotificationData);
     
      this.state.notificationData.MessageSource === ""
          ? this.CreateNotificationRestriction(tempNotificationData)
          : this.updateNotificationRestriction(tempNotificationData);

    } catch (error) {
      console.log("Restrict Notification Details Composite : Error in addUpdateNotificationRestriction");
    }
  };

  handleSave = () => {
    try {
      let modNotificationData = lodash.cloneDeep(this.state.modNotificationData);
     // this.setState({ saveEnabled: false });
      if (this.validateSave(modNotificationData)) {

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempNotificationData = lodash.cloneDeep(modNotificationData);
      this.setState({ showAuthenticationLayout, tempNotificationData }, () => {
        if (showAuthenticationLayout === false) {
          this.addUpdateNotificationRestriction();
        }
    });

         
      
      
        } else this.setState({ saveEnabled: true });
    }
    catch (error) {
      console.log("NotificationGroupComposite:Error occured on handleSave", error);
    }
  };
  CreateNotificationRestriction(modNotificationData) {
    try {
      let keyCode = [
        {
          key: KeyCodes.NotificationResMsgCode,
          value: modNotificationData.MessageCode,
        },
      
        {
          key: KeyCodes.NotificationResSource,
          value: modNotificationData.MessageSource,
        },
      ];
      let obj = {
        keyDataCode: KeyCodes.NotificationResMsgCode,
        KeyCodes: keyCode,
        // Entity: modNotificationData,
      };

      let notification = {
        messageType: "critical",
        message: "NotificationRestriction_SuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationRestriction_MessageCode"],
            keyValues: [modNotificationData.MessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.CreateNotificationRestriction,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {

        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        console.log(result)
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnNotificationRestriction
              ),
            },
            () => {
              this.getNotificationRestrictionList();
              this.setDefaultValues();
            }
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnNotificationRestriction
            ),
          });
          console.log("Error in NotificationGroup:", result.ErrorList);
        }
        const operationsVisibilty = { ...this.state.operationsVisibilty };
        if (notification.messageType === "success") {
          operationsVisibilty.add = true;
          operationsVisibilty.delete = false;
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
              fnNotificationRestriction
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
      console.log("Error in getnotificationrestriction",error)
    }
  }
  updateNotificationRestriction(modNotificationData) {
    try {
      let notificationData = lodash.cloneDeep(this.state.notificationData)
      let keyCode = [
        {
          key: KeyCodes.NotificationResMsgCode,
          value: modNotificationData.MessageCode,
        },

        {
          key: KeyCodes.NotificationResSource,
          value: modNotificationData.MessageSource,
        },
        {
          key: KeyCodes.NotificationOrigResMsgCode,
          value: notificationData.MessageCode,
        },

        {
          key: KeyCodes.NotificationOrigResSource,
          value: notificationData.MessageSource,
        },
      ];
      let obj = {
        keyDataCode: KeyCodes.NotificationResMsgCode,
        KeyCodes: keyCode,
        // Entity: modNotificationData,
      };

      let notification = {
        messageType: "critical",
        message: "NotificationRestriction_SuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationRestriction_MessageCode"],
            keyValues: [modNotificationData.MessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateNotificationRestriction,
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
                fnNotificationRestriction
              ),
            },
            () => {
              this.getNotificationRestrictionList();
              this.setDefaultValues();
            }
          );

          const operationsVisibilty = { ...this.state.operationsVisibilty };
          if (notification.messageType === "success") {
            operationsVisibilty.add = true;
            operationsVisibilty.delete = false;
            this.setState({ isDetails: true, operationsVisibilty });
          }

        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnNotificationRestriction
            ),
          });
        }
        console.log("Error in update NotificationGroup:", result.ErrorList);
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
              fnNotificationRestriction
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
      console.log("Error in update NotificationGroup",error)
    }
  }
  getNotificationRestrictionList() {
    try {
      axios(
        RestAPIs.GetNotificationRestriction,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
        
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              data: result.EntityResult, isReadyToRender: true, saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnNotificationRestriction
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
      console.log("Error in getNotificationRestriction",error)
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
      this.state.notificationData.MessageSource === ""
      ? functionGroups.add
      : functionGroups.modify
     )
 }

 getOperation() {
  if (this.state.showDeleteAuthenticationLayout)
    return this.handleDelete;
  else if (this.state.showAuthenticationLayout)
    return this.addUpdateNotificationRestriction;
  
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
      console.log("NotificationResctriction Delete : Error in authenticateDelete");
    }
  };

    render() {
    // const user = this.props.userDetails.EntityResult;
    // let tmuiInstallType=TMUIInstallType.LIVE;
    // if(user.IsArchived)
    // tmuiInstallType=TMUIInstallType.ARCHIVE;
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
                <NotificationRestrictionSummaryPageComposite
                  tableData={this.state.data.Table}
                  pageSize={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize
                  }
                  terminalsToShow={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .NoOfTerminalsToShow
                  }
                  selectedRow={this.state.selectedRow}
                  onRowClick={this.handleRowClick}
                  modNotificationData={this.state.modNotificationData}
                  isDetails={this.state.isDetails}
                  handleSave={this.handleSave}
                  onFieldChange={this.handleChange}
                  handleReset={this.handleReset}
                  validationErrors={this.state.validationErrors}
                  saveEnabled={this.state.saveEnabled}
                ></NotificationRestrictionSummaryPageComposite>
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
            functionGroup={fnNotificationRestriction}
            handleOperation={this.getOperation()}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}

        </div>
        
        // {/* <ErrorBoundary>
        //   <div className="detailsContainer">
        //     <object
        //       className="tmuiPlaceHolder"
        //       type="text/html"
        //       width="100%"
        //       height="880px"
        //       //data="http://localhost/tmui/NotificationRestriction.aspx"
        //       data={"/"+ tmuiInstallType +"/NotificationRestriction.aspx"}
        //     ></object>
        //   </div>
        // </ErrorBoundary> */}
        )
    }
}

const mapStateToProps = (state) => {
    return {
      userDetails: state.getUserDetails.userDetails,
      tokenDetails: state.getUserDetails.TokenAuth,
    };
  };
  
  export default connect(mapStateToProps)(NotificationRestrictionComposite);
  
  NotificationRestrictionComposite.propTypes = {
    activeItem: PropTypes.object,
  };
