import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ErrorBoundary from "../../ErrorBoundary";
import { NotificationMessageSummaryPageComposite } from "../Summary/NotificationMessageSummaryComposite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import lodash from "lodash";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { functionGroups, fnNotificationConfig } from "../../../JS/FunctionGroups";
import { emptyNotificationMessage } from "../../../JS/DefaultEntities";
import { notificationMessageValidationDef } from "../../../JS/ValidationDef";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class NotificationMessageComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: [],
    data: [],
    notificationGroup: [],
    notificationPriority:[],
    notificationMessage: lodash.cloneDeep(emptyNotificationMessage),
    validationErrors: Utilities.getInitialValidationErrors(notificationMessageValidationDef),
    modNotificationMessage: {},
    groupSearchOptions: [],
    saveEnabled: false,

    showAuthenticationLayout: false,
    showDeleteAuthenticationLayout : false,
    tempNotificationMessage: {},

  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnNotificationConfig
      );
      this.setState({
        operationsVisibilty,
      });
      this.GetNotificationMessageList();
      this.GetNotificationGroupForDropdown();
    } catch (error) {
      console.log(
        "NotificationMessageComposite:Error occured on componentDidMount",
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
      console.log("NotificationMessageComposite:Error occured on handleAdd", error);
    }
  };
  handleRowClick = (item) => {

    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnNotificationConfig
      );
      operationsVisibilty.delete = true;
      this.setState({
        isDetails: true,
        notificationMessage: item.rowData,
        modNotificationMessage: item.rowData,
        operationsVisibilty,
        
      }, () => this.GetPriorityForNotification(item.rowData.NotificationType))
    } catch (error) {
      console.log("NotificationMessageComposite:Error occured on Row click", error);
    }
  };
  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const notificationMessage = lodash.cloneDeep(this.state.notificationMessage);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modNotificationMessage: { ...notificationMessage },
        validationErrors,
      });
    } catch (error) {
      console.log("NotificationMessageComposite:Error occured on handleReset", error);
    }
  };
  validateSave(modNotificationMessage) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(notificationMessageValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          notificationMessageValidationDef[key],
          modNotificationMessage[key]
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
    }catch(error){
      console.log("Error in validate save",error)
    }
  }
  handleChange = (propertyName, data) => {
    
    try {
      const modNotificationMessage = lodash.cloneDeep(this.state.modNotificationMessage);
      modNotificationMessage[propertyName] = data;
      
      if (propertyName === "NotificationType") {
        this.GetPriorityForNotification(data);
      }
      if (propertyName === "NotificationLocation")
      {
        modNotificationMessage[propertyName] = Constants.NotificationMessage[data];
      }
      this.setState({ modNotificationMessage });
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (notificationMessageValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          notificationMessageValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "NotificationMessageComposite:Error occured on handleChange",
        error
      );
    }
  };
  handleDelete = () => {

    try {
      this.handleAuthenticationClose();
      let modNotificationMessage = lodash.cloneDeep(this.state.modNotificationMessage)
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var MessageCode = modNotificationMessage.MessageCode
      let keyCode = [
        {
          key: KeyCodes.NotificationMessageCode,
          value: MessageCode,
        },
      ]
      let obj = {
        keyDataCode: KeyCodes.NotificationMessageCode,
        KeyCodes: keyCode,
      };
      let notification = {
        messageType: "critical",
        message: "NotificationMessage_DeleteMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationConfig_MessageCode"],
            keyValues: [MessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.DeleteNotification,
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
              this.GetNotificationMessageList();
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
      console.log("NotificationMessageComposite:Error occured on handleDelete", error);
    }
  };

  addUpdateNotificationMessage = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ saveEnabled: false });
      let tempNotificationMessage = lodash.cloneDeep(this.state.tempNotificationMessage);
     
      this.state.notificationMessage.MessageCode === ""
      ? this.createNotificationMessage(tempNotificationMessage)
      : this.updateNotificationMessage(tempNotificationMessage);

    } catch (error) {
      console.log("Config Notification Details Composite : Error in addUpdateNotificationRestriction");
    }
  };

  handleSave = () => {

    try {
      let NotificationData = lodash.cloneDeep(this.state.modNotificationMessage);
     // this.setState({ saveEnabled: false });
      if (this.validateSave(NotificationData)) {
       
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempNotificationMessage = lodash.cloneDeep(NotificationData);
      this.setState({ showAuthenticationLayout, tempNotificationMessage }, () => {
        if (showAuthenticationLayout === false) {
          this.addUpdateNotificationMessage();
        }
    });

      } else this.setState({ saveEnabled: true });
    }
    catch (error) {
      console.log("NotificationMessageComposite:Error occured on handleSave", error);
    }
  };
  setDefaultValues() {
    this.setState({
      modNotificationMessage: lodash.cloneDeep(emptyNotificationMessage),
      notificationMessage: lodash.cloneDeep(emptyNotificationMessage)
    })
  }

  createNotificationMessage(NotificationData) {
    
    try {
      let obj = {
        Entity: NotificationData,
      };
      let notification = {
        messageType: "critical",
        message: "NotificationMessage_SuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationConfig_MessageCode"],
            keyValues: [NotificationData.MessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.CreateNotification,
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
                fnNotificationConfig
              ),
              notificationMessage: NotificationData
            },
            () => {
              this.GetNotificationMessageList();
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
              fnNotificationConfig
            ),
          });
          console.log("Error in NotificationMessage:", result.ErrorList);
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
              fnNotificationConfig
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
      console.log("Error in createNotificationMessage", error)
    }
  }
  updateNotificationMessage(NotificationData) {
    try {
      let obj = {
        Entity: NotificationData,
      };

      let notification = {
        messageType: "critical",
        message: "NotificationMessage_SuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["NotificationConfig_MessageCode"],
            keyValues: [NotificationData.MessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateNotification,
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
                fnNotificationConfig
              ),
            },
            () => {
              this.GetNotificationMessageList();
            }
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnNotificationConfig
            ),
          });
        }
        console.log("Error in update NotificationMessage:", result.ErrorList);
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
              fnNotificationConfig
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
      console.log("Error  while updatenotificatiomessage", error)
    }
  }
  GetNotificationGroupForDropdown() {
    
    try {
      axios(
        RestAPIs.GetNotificationGroupForDropdown,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.EntityResult !== null &&
            Array.isArray(result.EntityResult)) {
            
            let notificationGroup = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let groupSearchOptions = lodash.cloneDeep(notificationGroup);
            if (groupSearchOptions.length > Constants.filteredOptionsCount) {
              groupSearchOptions = groupSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ notificationGroup, groupSearchOptions });
          
          } else {
            this.setState({ notificationGroup: [], isReadyToRender: true });
            console.log("Error in getNotificationGroupList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting getNotificationGroupList:", error);
        });
    } catch (error) {
      console.log("Error while getnotificationlist", error)
    }
  }
  GetNotificationMessageList() {
    
    try {
      axios(
        RestAPIs.GetNotification,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              data: result.EntityResult, isReadyToRender: true, saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnNotificationConfig
              ),
});
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
      console.log("Error while getnotificationlist", error)
    }
  }
  GetPriorityForNotification(notificationType) {
    
    try {
      axios(
        RestAPIs.GetPriorityForNotification +
        "?notificationType=" +
        notificationType ,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          
          var result = response.data;
          if (result.IsSuccess === true) {
            let notificationPriority = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ notificationPriority });
          } else {
            this.setState({ notificationPriority: [], isReadyToRender: true });
            console.log("Error in getNotificationPriorityList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting getNotificationPriorityList:", error);
        });
    } catch (error) {
      console.log("Error while getnotificationlist", error)
    }
  }
  handleGroupSearchChange = (groupCode) => {
    try {
      let groupSearchOptions = this.state.notificationGroup.filter((item) =>
        item.value.toLowerCase().includes(groupCode.toLowerCase())
      );
      if (groupSearchOptions.length > Constants.filteredOptionsCount) {
        groupSearchOptions = groupSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        groupSearchOptions,
      });
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleVehicleSearchChange",
        error
      );
    }
  };
  getGroupSearchOptions() {
    let groupSearchOptions = lodash.cloneDeep(
      this.state.groupSearchOptions
    );
    let notificationGroup = this.state.modNotificationMessage.GroupCode;
    if (
      notificationGroup !== null &&
      notificationGroup !== "" &&
      notificationGroup !== undefined
    ) {
      let selectedVehicleCode = groupSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === notificationGroup.toLowerCase()
      );
      if (selectedVehicleCode === undefined) {
        groupSearchOptions.push({
          text: notificationGroup,
          value: notificationGroup,
        });
      }
    }
    return groupSearchOptions;
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
      this.state.notificationMessage.MessageCode === ""
      ? functionGroups.add
      : functionGroups.modify
     )
 }

 getOperation() {
  if (this.state.showDeleteAuthenticationLayout)
    return this.handleDelete;
  else if (this.state.showAuthenticationLayout)
    return this.addUpdateNotificationMessage;
  
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
      console.log("NotificationMessage Delete : Error in authenticateDelete");
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
            <NotificationMessageSummaryPageComposite
              tableData={this.state.data.Table}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              onRowClick={this.handleRowClick}
              modNotificationMessage={this.state.modNotificationMessage}
              notificationMessage={this.state.notificationMessage}
              notificationGroup={this.state.notificationGroup}
              listOptions={{
                notificationGroup: this.getGroupSearchOptions(),
                notificationPriority: this.state.notificationPriority
              }}
              onGroupSearchOption={this.handleGroupSearchChange}
              isDetails={this.state.isDetails}
              handleSave={this.handleSave}
              onFieldChange={this.handleChange}
              handleReset={this.handleReset}
              validationErrors={this.state.validationErrors}
              saveEnabled={this.state.saveEnabled}
            ></NotificationMessageSummaryPageComposite>
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
            functionGroup={fnNotificationConfig}
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

export default connect(mapStateToProps)(NotificationMessageComposite);

NotificationMessageComposite.propTypes = {
  activeItem: PropTypes.object,
};
