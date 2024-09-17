import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as RestApis from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import lodash from "lodash";
import { emptyEodAdminInfo } from "../../../JS/DefaultEntities";
import { EODAdminInfoCompositeValidationDef } from "../../../JS/ValidationDef";
import { EODAdministrationDetails } from "../../UIBase/Details/EODAdministrationDetails";
import { EODAdministrationSummaryComposite } from "../Summary/EODAdministrationSummaryComposite";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { fnEODAdmin, functionGroups } from "../../../JS/FunctionGroups";
import * as KeyCodes from "../../../JS/KeyCodes";
import { TerminalWorkingTimeErrors } from "../../../JS/Constants";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class EODAdminInfoComposite extends Component {
  state = {
    operationsVisibilty: {},
    selectedShareholder: "",
    minutesError: "",
    eodAdminDetails: {},
    modEodAdminDetails: {},
    eodSummary: [],
    modEodSumary: [],
    isTerminalEntryTimeValid: "",
    isNextWorkingDay: false,
    validationErrors: Utilities.getInitialValidationErrors(
      EODAdminInfoCompositeValidationDef
    ),
    isReadyToRender: false,
    isSummaryReadyToRender: false,
    ScheduleDayOfMonth: "",
    Enabled: false,
    OpenDayEnabled: false,
    CloseDayEnabled: false,
    SaveEnabled: false,
    Save: false,
    close: false,
    isCurrentTime: false,
    saveClick: true,
    showAuthenticationLayout: false,
    tempEodAdminDetails: {},
  };

  onFieldChange = (propertyName, data) => {
    try {
      var modEodAdminDetails = this.state.modEodAdminDetails;
      modEodAdminDetails[propertyName] = data;
      this.setState({
        modEodAdminDetails,
      });
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (propertyName === "DenyEntryTime" || propertyName === "DenyLoadTime") {
        if (
          Utilities.convertStringtoDecimal(modEodAdminDetails.DenyEntryTime) <
          Utilities.convertStringtoDecimal(modEodAdminDetails.DenyLoadTime)
        ) {
          this.setState({
            minutesError: "EODAdministration_DenyLoadTimeExceeded",
            saveClick: false,
          });
        } else {
          this.setState({
            minutesError: "",
            saveClick: true,
          });
        }
      }
      if (EODAdminInfoCompositeValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          EODAdminInfoCompositeValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "EODAdminInfoComposite:Error occured on onFieldChange",
        error
      );
    }
  };

  showClosetime(closeTime) {
    try {
      var newCloseTime = closeTime;
      newCloseTime = new Date().getUTCFullYear() + closeTime.slice(4);
      return newCloseTime;
    } catch (error) {
      console.log(
        "EODAdministrationDetails:Error occured on showClosetime",
        error
      );
    }
  }

  GetEODAdminDetails() {
    try {
      var obj = {
        ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      };
      axios(
        RestApis.GetEODAdminDetails,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (
          result.IsSuccess === true &&
          result.EntityResult.CloseTime !== undefined
        ) {
          result.EntityResult.CloseTime = result.EntityResult.CloseTime.slice(0, 19);
          this.setState(
            {
              eodAdminDetails: lodash.cloneDeep(result.EntityResult),
              modEodAdminDetails: lodash.cloneDeep(result.EntityResult),
              isReadyToRender: true,
            },
            () => {
              this.GetEODSummary();
            }
          );
          var closeTime = this.showClosetime(
            this.state.modEodAdminDetails.CloseTime
          );
          var modEodAdminDetails = this.state.modEodAdminDetails;
          modEodAdminDetails.CloseTime = closeTime;
          this.setState({ modEodAdminDetails });
        } else {
          this.setState(
            {
              eodAdminDetails: lodash.cloneDeep(emptyEodAdminInfo),
              modEodAdminDetails: lodash.cloneDeep(emptyEodAdminInfo),
            },
            () => {
              this.GetEODSummary();
            }
          );
          console.log("Error in GetEODAdminDetails", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("Error while getEODAdminDetails:", error);
    }
  }

  GetEODSummary() {
    try {
      var obj = {
        ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      };
      axios(
        RestApis.GetEODSummary,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        var promises = [];
        var _self = this;
        if (
          result.IsSuccess === true &&
          result.EntityResult.Table1 !== undefined &&
          result.EntityResult.Table1.length > 0 &&
          result.EntityResult.Table1[0].CloseTime !== undefined &&
          result.EntityResult.Table1[0].CloseTime !== ""
        ) {
          this.setState(
            {
              eodSummary: lodash.cloneDeep(result.EntityResult.Table1),
              modEodSumary: lodash.cloneDeep(result.EntityResult.Table1),
              isSummaryReadyToRender: true,
            },
            () => {
              if (
                this.state.modEodSumary[0] !== null &&
                this.state.modEodSumary[0] !== undefined
              ) {
                var promise = new Promise(function (resolve, reject) {
                  _self.OpenTimeIsEqualNow(resolve);
                });
                promises.push(promise);
              }
            }
          );
        } else {
          let eodSummary = [];
          let modEodSumary = [];
          this.setState(
            {
              eodSummary: eodSummary,
              modEodSumary: modEodSumary,
              isSummaryReadyToRender: true,
            },
            () => {
              if (
                this.state.modEodSumary[0] !== null &&
                this.state.modEodSumary[0] !== undefined
              ) {
                var promise = new Promise(function (resolve, reject) {
                  _self.OpenTimeIsEqualNow(resolve);
                });
                promises.push(promise);
              }
            }
          );
        }
        var notification = {
          messageType: "critical",
          message: "",
          messageResultDetails: [],
        };
        if (this.state.eodAdminDetails.ID !== emptyEodAdminInfo.ID) {
          this.setState({
            OpenDayEnabled: false,
            CloseDayEnabled: this.state.Enabled,
            SaveEnabled: this.state.Enabled,
          });
        } else {
          Promise.all(promises).then(() => {
            if (this.state.eodSummary.length > 0) {
              if (this.state.isCurrentTime) {
                if (!this.state.close) {
                  notification.messageType = "success";
                  notification.message = "EODAdminInfo_OpenOnce";
                  this.OpenDayEnent(notification);
                }
                this.setState({
                  OpenDayEnabled: false,
                });
              } else {
                this.setState({
                  OpenDayEnabled: true,
                });
              }
            } else {
              this.setState({
                OpenDayEnabled: this.state.modEodAdminDetails.DenyOpen
                  ? false
                  : this.state.Enabled,
              });
            }
            this.setState({
              CloseDayEnabled: false,
              SaveEnabled: this.state.Enabled,
            });
            if (
              this.state.isTerminalEntryTimeValid ===
                TerminalWorkingTimeErrors.WeekEndTime &&
              this.state.isNextWorkingDay === false
            ) {
              notification.messageType = "success";
              notification.message = "EODAdminInfo_Weekend";
              this.OpenDayEnent(notification);
              this.setState({
                OpenDayEnabled: false,
              });
            } else if (
              this.state.isTerminalEntryTimeValid ===
                TerminalWorkingTimeErrors.HolidayTime &&
              this.state.isNextWorkingDay === false
            ) {
              notification.messageType = "success";
              notification.message = "EODAdminInfo_Holiday";
              this.OpenDayEnent(notification);
              this.setState({
                OpenDayEnabled: false,
              });
            }
          });
        }
        if (this.state.isNextWorkingDay) {
          notification.messageType = "success";
          notification.message = "EODAdminInfo_NextWorkingDay";
          this.OpenDayEnent(notification);
          this.setState({
            OpenDayEnabled: false,
            CloseDayEnabled: false,
          });
        }
      });
    } catch (error) {
      console.log("Error while getEODSummary:", error);
    }
  }

  IsTerminalEntryTimeValid() {
    try {
      var obj = {
        ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      };
      axios(
        RestApis.IsTerminalEntryTimeValid,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              isTerminalEntryTimeValid: result.EntityResult,
            },
            () => {
              this.GetEODAdminDetails();
            }
          );
        } else {
          this.setState(() => {
            this.GetEODAdminDetails();
          });
          console.log("Error in IsTerminalEntryTimeValid", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("Error while getIsTerminalEntryTimeValid:", error);
    }
  }

  IsNextWorkingDay() {
    try {
      var obj = {
        ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      };
      axios(
        RestApis.IsNextWorkingDay,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.EntityResult !== null) {
          var nextWorkingDay = result.EntityResult.toLowerCase();
        } else {
          this.setState({
            isNextWorkingDay: false,
          });
        }
        if (result.IsSuccess === true) {
          this.setState(
            {
              isNextWorkingDay: nextWorkingDay === "true",
            },
            () => {
              this.IsTerminalEntryTimeValid();
            }
          );
        } else {
          this.setState(() => {
            this.IsTerminalEntryTimeValid();
          });
          console.log("Error while IsNextWorkingDay:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("Error while IsNextWorkingDay:", error);
    }
  }

  OpenDayEnent = (notification) => {
    try {
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log(
        "EODAdministrationComposite: Error occured on OpenDayEnent",
        error
      );
    }
  };

  handEODOpenDay = () => {
    try {
      this.setState({ OpenDayEnabled: false });
      var modEodAdminDetails = lodash.cloneDeep(this.state.modEodAdminDetails);
      var notification = {
        messageType: "critical",
        message: "",
        messageResultDetails: [],
      };
      var keyCode = [
        {
          key: KeyCodes.EODTimePrev,
          value: modEodAdminDetails.CloseTime,
        },
      ];
      var obj = {
        ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        KeyCodes: keyCode,
      };
      axios(
        RestApis.EODOpenDay,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        if (result.IsSuccess === true) {
          notification.message = "EODAdminInfo_OpenSuccess";
          this.IsNextWorkingDay();
          this.getLookUpData();
        } else {
          notification.message = result.ErrorList[0];
        }
        this.OpenDayEnent(notification);
        this.GetEODAdminDetails();
      });
    } catch (error) {
      this.OpenDayEnent(notification);
      this.setState({ OpenDayEnabled: true });
      console.log("Error while handEODOpenDay:", error);
    }
  };

  handEODCloseDay = () => {
    try {
      this.setState({ CloseDayEnabled: false });
      var notification = {
        messageType: "critical",
        message: "",
        messageResultDetails: [],
      };
      var keyCodes = [
        {
          key: KeyCodes.ActionID,
          value: this.state.modEodAdminDetails.ID,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyCodes: keyCodes,
      };
      axios(
        RestApis.EODCloseDay,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        if (result.IsSuccess === true) {
          notification.message = "EODAdminInfo_CloseSuccess";
          this.setState({ close: true });
        } else {
          notification.message = result.ErrorList[0];
          this.setState({ close: false });
        }
        this.OpenDayEnent(notification);
        this.IsNextWorkingDay();
        this.getLookUpData();
      });
    } catch (error) {
      this.OpenDayEnent(notification);
      this.setState({ CloseDayEnabled: true });
      console.log("Error while handEODCloseDay:", error);
    }
  };

  handleSaveClick = () => {
    try {
      var saveClick = this.state.saveClick;
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      var notification = {
        messageType: "critical",
        message: "",
        messageResultDetails: [],
      };
      Object.keys(validationErrors).forEach((key) => {
        if (validationErrors[key] !== "") {
          saveClick = false;
        }
      });
      if (validationErrors["CloseTime"] !== "") {
        notification.messageType = "critical";
        notification.message = "EOD_EnterEODTime";
        this.OpenDayEnent(notification);
      }
      if (saveClick === true) {
        this.handleSave();
      }
    } catch (error) {
      console.log("Error while handleSaveClick:", error);
    }
  };

  handleUpdate = () => {
    this.handleAuthenticationClose();
    try {
      this.setState({ SaveEnabled: false });
      var notification = {
        messageType: "critical",
        message: "",
        messageResultDetails: [
          {
            keyFields: ["EODAdminInfo_Saving"],
            keyValues: ["Save"],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      var modEodAdminDetails = lodash.cloneDeep(this.state.modEodAdminDetails);
      modEodAdminDetails.CloseTime =
        this.state.eodAdminDetails.CloseTime.slice(0, 4) +
        modEodAdminDetails.CloseTime.slice(4);
      var keyCodes = [
        {
          key: KeyCodes.EODTimePrev,
          value: modEodAdminDetails.CloseTime,
        },
        {
          key: KeyCodes.TerminalAction,
          value:
            modEodAdminDetails.CurrentAction === null
              ? "NOTSTARTED"
              : modEodAdminDetails.CurrentAction,
        },
        {
          key: KeyCodes.ActionID,
          value: modEodAdminDetails.ID,
        },
        {
          key: KeyCodes.EODTime,
          value: modEodAdminDetails.CloseTime,
        },
        {
          key: KeyCodes.MonthStartDay,
          value: this.state.ScheduleDayOfMonth,
        },
      ];
      var entity = {
        CurrentAction:
          modEodAdminDetails.CurrentAction === null
            ? "NOTSTARTED"
            : modEodAdminDetails.CurrentAction,
        IsOpenAutomatic: modEodAdminDetails.IsOpenAutomatic,
        IsCloseAutomatic: modEodAdminDetails.IsCloseAutomatic,
        DenyEntryTime: modEodAdminDetails.DenyEntryTime,
        DenyLoadTime: modEodAdminDetails.DenyLoadTime,
        Remarks: modEodAdminDetails.Remarks,
      };
      var obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyCodes: keyCodes,
        entity: entity,
      };
      axios(
        RestApis.EODSave,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        if (result.IsSuccess === true) {
          if (
            (this.state.modEodAdminDetails.CloseTime.slice(4) !==
              this.state.eodAdminDetails.CloseTime.slice(4) &&
              this.state.CloseDayEnabled === true) ||
            (this.state.modEodAdminDetails.CloseTime.slice(4) !==
              this.state.eodAdminDetails.CloseTime.slice(4) &&
              this.state.OpenDayEnabled === true)
          ) {
            notification.messageResultDetails[0].isSuccess = true;
            notification.message = "EODAdminInfo_SavingClosetime";
          } else {
            notification.messageResultDetails[0].isSuccess = true;
          }
          this.OpenDayEnent(notification);
          this.setState(
            {
              eodAdminDetails: modEodAdminDetails,
            },
            () => {
              this.GetEODAdminDetails();
            }
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            "EODAdminInfo_CannotChangeEODTime";
          this.OpenDayEnent(notification);
        }
      });
      this.setState({ SaveEnabled: true });
    } catch (error) {
      this.setState({ SaveEnabled: true });
      console.log("Error while EODSaveDay:", error);
    }
  };

  handleSave = () => {
    let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
    
    this.setState({ showAuthenticationLayout }, () => {
      if (showAuthenticationLayout === false) {
        this.handleUpdate();
      }
  });

  };

  handleReset = () => {
    try {
      var modEodAdminDetails = lodash.cloneDeep(this.state.eodAdminDetails);
      this.setState(
        {
          modEodAdminDetails,
          validationErrors: [],
        },
        () => {
          this.handleResetValidationError();
          if (
            Utilities.convertStringtoDecimal(modEodAdminDetails.DenyEntryTime) <
            Utilities.convertStringtoDecimal(modEodAdminDetails.DenyLoadTime)
          ) {
            this.setState({
              minutesError: "EODAdministration_DenyLoadTimeExceeded",
              saveClick: false,
            });
          } else {
            this.setState({
              minutesError: "",
            });
          }
        }
      );
    } catch (error) {
      console.log(
        "EODAdministrationComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleResetValidationError() {
    try {
      this.setState({
        validationErrors: Utilities.getInitialValidationErrors(
          EODAdminInfoCompositeValidationDef
        ),
      });
    } catch (error) {
      console.log(
        "EODAdministrationComposite:Error occured on handleResetValidationError",
        error
      );
    }
  }

  getLookUpData() {
    try {
      axios(
        RestApis.GetLookUpData + "?LookUpTypeCode=EODConfiguration",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let ScheduleDayOfMonth = result.EntityResult.ScheduleDayOfMonth;
          this.setState({ ScheduleDayOfMonth });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      });
    } catch (error) {
      console.log(
        "EODAdministrationComposite: Error occurred on getLookUpData",
        error
      );
    }
  }

  OpenTimeIsEqualNow = (resolve) => {
    try {
      var modEodSumary = this.state.modEodSumary;
      var keyCodes = [
        {
          key: KeyCodes.EODTimePrev,
          value: modEodSumary[0].OpenTime,
        },
      ];
      var obj = {
        ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyCodes: keyCodes,
      };
      axios(
        RestApis.OpenTimeIsEqualNow,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          var currentTime = result.EntityResult.toLowerCase();
          this.setState({
            isCurrentTime: currentTime !== "false",
          });
          resolve();
        } else {
          console.log(
            "EODAdministrationComposite: Error occurred on OpenTimeIsEqualNow"
          );
        }
      });
    } catch (error) {
      console.log(
        "EODAdministrationComposite: Error occurred on OpenTimeIsEqualNow",
        error
      );
    }
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnEODAdmin
        )
      ) {
        var notification = {
          messageType: "critical",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "BSI_EODAdministrationSecurityError",
            },
          ],
        };
        this.OpenDayEnent(notification);
        return;
      }
      this.setState(
        {
          Enabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnEODAdmin
          ),
        },
        () => {
          this.IsNextWorkingDay();
          this.getLookUpData();
        }
      );
    } catch (error) {
      console.log(
        "EODAdminInfoComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  onShareholderChange = () => {};

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };


  render() {
    let loadingClass = "globalLoader";
    return (
      <div>
        {this.state.isReadyToRender && this.state.isSummaryReadyToRender ? (
          <div>
            <ErrorBoundary>
              <TMUserActionsComposite
                operationsVisibilty={this.state.operationsVisibilty}
                breadcrumbItem={this.props.activeItem}
                shareholders={
                  this.props.userDetails.EntityResult.ShareholderList
                }
                selectedShareholder={this.state.selectedShareholder}
                onShareholderChange={this.onShareholderChange}
                addVisible={false}
                deleteVisible={false}
                shrVisible={false}
                handleBreadCrumbClick={this.props.handleBreadCrumbClick}
              ></TMUserActionsComposite>
            </ErrorBoundary>
            <ErrorBoundary>
              <EODAdministrationDetails
                modEodAdminDetails={this.state.modEodAdminDetails}
                onFieldChange={this.onFieldChange}
                validationErrors={this.state.validationErrors}
                minutesError={this.state.minutesError}
                handleSave={this.handleSaveClick}
                handCloseDay={this.handEODCloseDay}
                handOpenDay={this.handEODOpenDay}
                handReset={this.handleReset}
                OpenDayEnabled={this.state.OpenDayEnabled}
                CloseDayEnabled={this.state.CloseDayEnabled}
                saveEnabled={this.state.SaveEnabled}
              ></EODAdministrationDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              <EODAdministrationSummaryComposite
                modEodSumary={this.state.modEodSumary}
              ></EODAdministrationSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage loadingClass={loadingClass} message=""></LoadingPage>
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

        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnEODAdmin}
            handleOperation={this.handleUpdate}
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

export default connect(mapStateToProps)(EODAdminInfoComposite);

EODAdminInfoComposite.propTypes = {
  activeItem: PropTypes.object,
};
