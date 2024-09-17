import React, { Component } from "react";
import { emptyWeekendHolidays } from "../../../JS/DefaultEntities";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { WeekendHolidayConfigDetails } from "../../UIBase/Details/WeekendHolidayConfigDetails";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as RestApis from "../../../JS/RestApis";
import Axios from "axios";
import * as Utilities from "../../../JS/Utilities";
import NotifyEvent from "../../../JS/NotifyEvent";
import lodash from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as KeyCodes from "../../../JS/KeyCodes";
import { fnWeekendConfig, functionGroups } from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class WeekendAndHolidayComposite extends Component {
  state = {
    modWeekendHolidays: lodash.cloneDeep(emptyWeekendHolidays),
    WeekendHolidays: lodash.cloneDeep(emptyWeekendHolidays),
    weekendHolidaysLoaded: false,
    holidaysListLoaded: false,
    isReadyToRender: false,
    saveEnabled: false,
    addEnabled: false,
    removeEnabled: false,
    holidaysList: [],
    tempHolidaysList: [],
    addHolidaysList: [],
    removeHolidaysList: [],
    selectItems: [],
    newHoliday: 1,
    holidaysSaveEnabled: false,
    operationsVisibilty: {},
    showWeekendAuthenticationLayout: false,
    showHolidayAuthenticationLayout:false,
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { saveEnabled, addEnabled, removeEnabled, holidaysSaveEnabled } = {
        ...this.state,
      };
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnWeekendConfig
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "BSI_WeekendHolidayConfigSecurityError",
          messageResultDetails: [],
        };
        this.savedEvent(notification);
        return;
      }
      saveEnabled = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnWeekendConfig
      );
      addEnabled = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnWeekendConfig
      );
      removeEnabled = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnWeekendConfig
      );
      holidaysSaveEnabled = removeEnabled || addEnabled;
      this.setState({
        saveEnabled,
        addEnabled,
        removeEnabled,
        holidaysSaveEnabled,
      });
      this.GetWeekEnds();
      this.GetHolidays();
    } catch (error) {
      console.log(
        "WeekendAndHolidayComposite:Error occurred on componentDidMount",
        error
      );
    }
  }

  onSelectChange = (e) => {
    try {
      var { removeEnabled, holidaysSaveEnabled, addEnabled } = {
        ...this.state,
      };
      removeEnabled =
        e.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnWeekendConfig
        );
      holidaysSaveEnabled = addEnabled || removeEnabled;

      this.setState({
        selectItems: e,
        removeEnabled,
        holidaysSaveEnabled,
      });
    } catch (error) {
      console.log(
        "WeekendAndHolidayComposite:Error occurred on onSelectChange",
        error
      );
    }
  };

  GetWeekEnds() {
    try {
      var shCode = this.props.userDetails.EntityResult.PrimaryShareholder;
      var keyCode = [];
      var obj = {
        ShareholderCode: shCode,
        KeyCodes: keyCode,
      };
      Axios(
        RestApis.GetWeekEnds,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          this.setState({
            modWeekendHolidays: result.EntityResult,
            weekendHolidays: result.EntityResult,
            weekendHolidaysLoaded: true,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnWeekendConfig
            ),
          });
        } else {
          this.setState({
            modWeekendHolidays: [],
            weekendHolidays: [],
            weekendHolidaysLoaded: true,
            saveEnabled: false,
          });
          console.log("Error in GetWeekEnds:", result.ErrorList);
        }
        this.checkReadyToRender();
      });
    } catch (error) {
      this.setState({
        modWeekendHolidays: [],
        weekendHolidays: [],
        weekendHolidaysLoaded: true,
        saveEnabled: true,
      });
      console.log(
        "WeekendAndHolidayComposite:Error occurred on GetWeekEnds",
        error
      );
      this.checkReadyToRender();
    }
  }

  GetHolidays() {
    try {
      var shCode = this.props.userDetails.EntityResult.PrimaryShareholder;
      var keyCode = [];
      var obj = {
        ShareholderCode: shCode,
        KeyCodes: keyCode,
      };
      Axios(
        RestApis.GetHolidays,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          var holidaysList = [];
          var row = 0;
          var tempHolidaysList = result.EntityResult;
          tempHolidaysList.forEach((holiday) => {
            holidaysList.push({ holiday: new Date(holiday), row: row });
            row++;
          });
          this.setState({
            holidaysListLoaded: true,
            holidaysSaveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnWeekendConfig
            ),
            holidaysList,
            tempHolidaysList: holidaysList,
          });
        } else {
          this.setState({
            holidaysListLoaded: true,
            holidaysSaveEnabled: false,
            holidaysList: [],
            tempHolidaysList: [],
          });
        }
        this.checkReadyToRender();
      });
    } catch (error) {
      this.setState({
        holidaysListLoaded: false,
        holidaysSaveEnabled: true,
        holidaysList: [],
        tempHolidaysList: [],
      });
      console.log(
        "WeekendAndHolidayComposite:Error occurred on GetHolidays",
        error
      );
      this.checkReadyToRender();
    }
  }

  checkReadyToRender() {
    try {
      if (this.state.holidaysListLoaded && this.state.weekendHolidaysLoaded) {
        this.setState({ isReadyToRender: true });
      }
    } catch (error) {
      console.log(
        "WeekendAndHolidayComposite:Error occurred on checkReadyToRender",
        error
      );
    }
  }

  handleAdd = () => {
    try {
      var holidaysList = lodash.cloneDeep(this.state.holidaysList);
      var newHoliday = lodash.cloneDeep(this.state.newHoliday);
      var row = 1;
      holidaysList.forEach((object) => {
        var seqNumber = object.row;
        if (seqNumber !== null && seqNumber !== "" && seqNumber !== undefined) {
          if (!isNaN(parseInt(seqNumber))) {
            let val = parseInt(seqNumber);
            if (val >= row) row = val + 1;
          }
        }
      });
      holidaysList.unshift({
        holiday: "",
        new: newHoliday,
        row: row,
      });
      this.setState({
        holidaysList,
        newHoliday: newHoliday + 1,
      });
    } catch (error) {
      console.log(
        "WeekendAndHolidayComposite:Error occurred on onSelectChange",
        error
      );
    }
  };

  savedEvent = (notification) => {
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
        "WeekendAndHolidayComposite: Error occured on savedEvent",
        error
      );
    }
  };

  handleReset = () => {
    try {
      var weekendHolidays = lodash.cloneDeep(this.state.WeekendHolidays);
      this.setState({
        modWeekendHolidays: weekendHolidays,
      });
    } catch (error) {
      console.log("WeekendAndHolidayComposite:Error occured on handleCancel");
    }
  };

  handleHolidayReset = () => {
    try {
      var tempHolidaysList = lodash.cloneDeep(this.state.tempHolidaysList);
      this.setState({
        holidaysList: tempHolidaysList,
        selectItems: [],
      });
    } catch (error) {
      console.log("WeekendAndHolidayComposite:Error occured on handleCancel");
    }
  };


  saveWeekendConfig = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ saveEnabled: false });
      var weekendHolidays = lodash.cloneDeep(this.state.modWeekendHolidays);
      var shCode = this.props.userDetails.EntityResult.PrimaryShareholder;
      var notification = {
        messageType: "critical",
        message: "WeekendHolidayConfig_status",
        messageResultDetails: [],
      };
      var keyCode = [];
      var obj = {
        ShareholderCode: shCode,
        Entity: weekendHolidays,
        KeyCodes: keyCode,
      };
      Axios(
        RestApis.SaveConfigureWeekend,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        if (result.IsSuccess) {
          notification.message = "TerminalHolidays_WeekendUpdated";
          this.GetWeekEnds();
        } else {
          notification.message = result.ErrorList[0];
          this.setState({ saveEnabled: true });
        }
        this.savedEvent(notification);
      });
    } catch (error) {
      this.savedEvent(notification);
      this.setState({ saveEnabled: true });
      console.log("weekendHoliday Composite : Error in saveWeekendHoliday");
    }
  };

  handleSaveWeekendConfig = () => {
    try {
      this.setState({ saveEnabled: false });
      this.saveWeekendConfig();
    } catch (error) {
      console.log("weekend holiday Composite : Error in handleSaveWeekendConfig");
    }
  };


  handleSave = () => {
    try {
      this.handleAuthenticationClose();
      let showWeekendAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;
    
    this.setState({ showWeekendAuthenticationLayout }, () => {
      if (showWeekendAuthenticationLayout === false) {
        this.handleSaveWeekendConfig();
      }
  });
     
 } catch (error) {
      
      this.setState({ saveEnabled: true });
      console.log("WeekendAndHolidayComposite:Error occurred on handleSave");
    }
  };

  

   saveHolidays = () => {
    try {
      this.handleAuthenticationClose();
      var holidaysList = lodash.cloneDeep(this.state.holidaysList);
      var removeHolidaysList = lodash.cloneDeep(this.state.removeHolidaysList);
      var addHolidaysList = lodash.cloneDeep(this.state.addHolidaysList);
      var shCode = this.props.userDetails.EntityResult.PrimaryShareholder;
      var notification = {
        messageType: "critical",
        message: "WeekendHolidayConfig_status",
        messageResultDetails: [],
      };
      var flag = false;
      holidaysList.forEach((obj) => {
        if (obj.new !== undefined) {
          if (obj.holiday === "") {
            notification.messageResultDetails.push({
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: "WeekendHolidayAddExistEmpty",
            });
            flag = true;
          } else {
            addHolidaysList.push(
              new Date(obj.holiday).getFullYear() +
                "/" +
                (new Date(obj.holiday).getMonth() + 1) +
                "/" +
                new Date(obj.holiday).getDate()
            );
          }
        }
      });
      if (flag) {
        this.savedEvent(notification);
        return;
      }
      if (removeHolidaysList.length === 0 && addHolidaysList.length === 0) {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "WeekendHolidayNoOperation",
        });
        this.savedEvent(notification);
        return;
      }
      this.setState({ holidaysSaveEnabled: false });
      var type = false;
      var promises = [];
      addHolidaysList.forEach((addHoliday) => {
        var keyCode = [
          {
            Key: KeyCodes.HolidayDate,
            value: addHoliday,
          },
        ];
        var obj = {
          ShareholderCode: shCode,
          KeyCodes: keyCode,
        };
        var _self = this;
        var promise = new Promise(function (resolve, reject) {
          Axios(
            RestApis.AddHoliday,
            Utilities.getAuthenticationObjectforPost(
              obj,
              _self.props.userDetails.tokenInfo
            )
          ).then((response) => {
            var result = response.data;
            type = type || result.IsSuccess;
            resolve();
            if (result.IsSuccess) {
              notification.messageResultDetails.push({
                keyFields: ["TerminalHolidays_HolidayAddSuccess"],
                keyValues: [addHoliday],
                isSuccess: result.IsSuccess,
                errorMessage: "",
              });
            } else {
              notification.messageResultDetails.push({
                keyFields: [],
                keyValues: [],
                isSuccess: result.IsSuccess,
                errorMessage: result.ErrorList[0],
              });
            }
          });
        });
        promises.push(promise);
      });

      removeHolidaysList.forEach((removeHoliday) => {
        var keyCode = [
          {
            Key: KeyCodes.HolidayDate,
            value:
              new Date(removeHoliday).getFullYear() +
              "/" +
              (new Date(removeHoliday).getMonth() + 1) +
              "/" +
              new Date(removeHoliday).getDate(),
          },
        ];
        var obj = {
          ShareholderCode: shCode,
          KeyCodes: keyCode,
        };
        var _self = this;
        var promise = new Promise(function (resolve, reject) {
          Axios(
            RestApis.DeleteHoliday,
            Utilities.getAuthenticationObjectforPost(
              obj,
              _self.props.userDetails.tokenInfo
            )
          ).then((response) => {
            var result = response.data;
            type = type || result.IsSuccess;
            resolve();
            if (result.IsSuccess) {
              notification.messageResultDetails.push({
                keyFields: ["TerminalHolidays_HolidayCancelSuccess"],
                keyValues: [
                  new Date(removeHoliday).getFullYear() +
                    "/" +
                    (new Date(removeHoliday).getMonth() + 1) +
                    "/" +
                    new Date(removeHoliday).getDate(),
                ],
                isSuccess: result.IsSuccess,
                errorMessage: "",
              });
            } else {
              notification.messageResultDetails.push({
                keyFields: [],
                keyValues: [],
                isSuccess: result.IsSuccess,
                errorMessage: result.ErrorList[0],
              });
            }
          });
        });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        notification.messageType = type ? "success" : "critical";
        this.savedEvent(notification);
        this.setState({
          removeHolidaysList: [],
          addHolidaysList: [],
        });
        this.GetHolidays();
      });
    } catch (error) {
      this.setState({ holidaysSaveEnabled: true });
      console.log(
        "WeekendAndHolidayComposite:Error occurred on handleHolidaySave"
      );
    }
  };


  handleHolidaySaveConfig = () => {
    try {
      this.setState({ holidaysSaveEnabled: false });
      this.saveHolidays();
    } catch (error) {
      console.log("weekend holiday Composite : Error in handleHolidaySaveConfig");
    }
  };

  handleHolidaySave = () => {
    try {
      this.handleAuthenticationClose();
      let showHolidayAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;
    
    this.setState({ showHolidayAuthenticationLayout }, () => {
      if (showHolidayAuthenticationLayout === false) {
        this.handleHolidaySaveConfig();
      }
  });

    } catch (error) {
      console.log(
        "WeekendAndHolidayComposite:Error occurred on handleHolidaySave"
      );
    }
  };

  handleRemove = () => {
    try {
      var selectItems = lodash.cloneDeep(this.state.selectItems);
      var holidaysList = lodash.cloneDeep(this.state.holidaysList);
      var removeHolidaysList = lodash.cloneDeep(this.state.removeHolidaysList);
      selectItems.forEach((item) => {
        holidaysList = holidaysList.filter((holiday) => {
          return holiday.row !== item.row;
        });
        if (item.new === undefined) {
          removeHolidaysList.push(item.holiday);
        }
      });
      this.setState({
        holidaysList,
        removeHolidaysList,
        selectItems: [],
      });
    } catch {
      console.log("WeekendAndHolidayComposite:Error occurred on handleRemove");
    }
  };

  onDateChange = (cellData, data) => {
    try {
      var holidaysList = lodash.cloneDeep(this.state.holidaysList);
      holidaysList[cellData.rowIndex].holiday = data;
      this.setState({ holidaysList });
    } catch (error) {
      console.log(
        "WeekendAndHolidayComposite:Error occurred on onDateChange",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    try {
      const modWeekendHolidays = lodash.cloneDeep(
        this.state.modWeekendHolidays
      );
      modWeekendHolidays[propertyName] = data;
      this.setState({ modWeekendHolidays });
    } catch (error) {
      console.log(
        "WeekendAndHolidayComposite:Error occurred on handleChange",
        error
      );
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showHolidayAuthenticationLayout: false,
      showWeekendAuthenticationLayout: false,
    });
  };

  
  handleOperation= () => {
    if (this.state.showWeekendAuthenticationLayout)
    return this.handleSaveWeekendConfig;
  else if (this.state.showHolidayAuthenticationLayout)
    return this.handleHolidaySaveConfig;
    
  }

  onShareholderChange = () => {};
  
  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.onShareholderChange}
            addVisible={false}
            deleteVisible={false}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <ErrorBoundary>
            <WeekendHolidayConfigDetails
              modWeekendHolidays={this.state.modWeekendHolidays}
              holidaysList={this.state.holidaysList}
              handleAdd={this.handleAdd}
              handleSave={this.handleSave}
              handleReset={this.handleReset}
              handleHolidayReset={this.handleHolidayReset}
              handleRemove={this.handleRemove}
              onFieldChange={this.handleChange}
              onDateChange={this.onDateChange}
              onSelectChange={this.onSelectChange}
              saveEnabled={this.state.saveEnabled}
              selectItems={this.state.selectItems}
              handleHolidaySave={this.handleHolidaySave}
              holidaysSaveEnabled={this.state.holidaysSaveEnabled}
              addEnabled={this.state.addEnabled}
              removeEnabled={this.state.removeEnabled}
            ></WeekendHolidayConfigDetails>
          </ErrorBoundary>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
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

        {this.state.showHolidayAuthenticationLayout || this.state.showWeekendAuthenticationLayout? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnWeekendConfig}
            handleOperation={this.handleOperation()}
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

export default connect(mapStateToProps)(WeekendAndHolidayComposite);

WeekendAndHolidayComposite.propTypes = {
  activeItem: PropTypes.object,
};
