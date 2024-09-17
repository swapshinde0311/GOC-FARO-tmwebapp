import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import {
  emptySlotConfiguration,
  emptySlotConfigurationForAPI,
  emptySlotParam,
} from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestApi from "../../../JS/RestApis";
import { mapSlotParameterValidationDef } from "../../../JS/ValidationDef";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import lodash from "lodash";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import {
  functionGroups,
  fnSlotConfiguration,
} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { SlotConfigurationDetail } from "../../UIBase/Details/SlotConfigurationDetail";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class SlotConfigurationDetailComposite extends Component {
  state = {
    validationErrors: Utilities.getInitialValidationErrors(
      mapSlotParameterValidationDef
    ),
    transportationType: "",
    terminalCode: "",
    isReadyToRender: false,
    slotConfiguration: lodash.cloneDeep(emptySlotConfiguration),
    modSlotConfiguration: lodash.cloneDeep(emptySlotConfiguration),
    saveEnabled: false,
    isNew: false,
    showAuthenticationLayout: false,
    tempSlotConfiguration: {},
  };

  componentDidMount() {
    //console.log("Empty slotconfig", this.state.slotConfiguration);
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getSlotConfigurations();
    } catch (error) {
      console.log("SlotConfigurationDetail:Error occurred on ", error);
    }
  }

  getTransportationType() {
    var transpType = "";
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transpType = genericProps.transportationType;
    }
    this.setState({ transportationType: transpType }, () => {
      //console.log("TransportationType from state", this.state.transportationType);
    });

    //console.log("TransportationType transpType:",transpType);
    return transpType;
  }
  getTerminals() {
    var tmCode = "";
    //debugger;

    let notification = {
      messageType: "critical",
      message: "TerminalList_NotAvailable",
      messageResultDetails: [],
    };

    axios(
      RestApi.GetTerminalDetailsForUser,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        //console.log(response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            //debugger;
            tmCode = result.EntityResult[0].Key.Code;
            this.setState(
              {
                isReadyToRender: false,
                //terminals: result.EntityResult,
                terminalCode: result.EntityResult[0].Key.Code,
              },
              () => {
                //console.log("Suchitra:selectedterminal:",this.state.terminalCode)
              }
            );
          } else {
            console.log("Error while getting Terminal List:", result);
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        } else {
          console.log("Error while getting Terminal List:", result);
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        }
      })
      .catch((error) => {
        // this.setState({
        //   isReceiptsRefreshing: false,
        //   isShipmentsRefreshing: false,
        // });
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
        console.log("Error while getting Terminal List:", error);
      });
    return tmCode;
  }
  getSlotConfigurations() {
    //console.log("transportationtype in get slot",this.state.transportationType);
    let transType = this.getTransportationType();
    //console.log("transportationtype in get slot", transType);
    
    let tmCode = this.getTerminals();

    //debugger;
    let notification = {
      messageType: "critical",
      message: "SlotConfigurationsEmpty",
      messageResultDetails: [],
    };
    axios(
      RestApi.GetTerminalDetailsForUser,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        //console.log(response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            //debugger;
            tmCode = result.EntityResult[0].Key.Code;
            this.setState(
              {
                isReadyToRender: false,
                //terminals: result.EntityResult,
                terminalCode: result.EntityResult[0].Key.Code,
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnSlotConfiguration
                ),
              },
              () => {
                axios(
                  RestApi.GetSlotConfiguration +
                    transType +
                    "&TerminalCode=" +
                    tmCode +
                    "&GetIfEmpty=true",
                  Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                  )
                )
                  .then((response) => {
                    var result = response.data;
                    // console.log(response);
                    if (result.IsSuccess === true) {
                      // console.log("Suchitra:Success in getslotconfig",result.EntityResult);
                      // console.log("functions",this.props.userDetails.EntityResult.FunctionsList);
                      // console.log("fnSlotConfiguration",fnSlotConfiguration);

                      if (result.EntityResult.SlotParams[0].Value === "") {
                        this.setState({isnew:true});
                        //this.state.isNew = true;
                        let notification = {
                          messageType: "critical",
                          message: "SlotConfiguration_New",
                          messageResultDetails: [],
                        };
                        toast(
                          <ErrorBoundary>
                            <NotifyEvent
                              notificationMessage={notification}
                            ></NotifyEvent>
                          </ErrorBoundary>,
                          {
                            autoClose:
                              notification.messageType === "success"
                                ? 10000
                                : false,
                          }
                        );
                      }
                      // this.state.slotConfiguration = lodash.cloneDeep(
                      //   result.EntityResult
                      // );
                      this.setState({slotConfiguration:lodash.cloneDeep(
                        result.EntityResult)});

                      let filledSlotConfiguration = this.fillSlotConfigurationForUI(
                        this.state.slotConfiguration
                      );
                      // console.log(
                      //   "FINAL SC FOR UI:",
                      //   this.state.slotConfiguration
                      // );

                      this.setState({
                        isReadyToRender: true,
                        // slotConfiguration: lodash.cloneDeep(
                        //   result.EntityResult
                        // ),
                        // modSlotConfiguration: lodash.cloneDeep(
                        //   result.EntityResult
                        // ),
                        slotConfiguration: filledSlotConfiguration,
                        modSlotConfiguration: filledSlotConfiguration,
                        saveEnabled: Utilities.isInFunction(
                          this.props.userDetails.EntityResult.FunctionsList,
                          functionGroups.add,
                          fnSlotConfiguration
                        ),
                      });
                      // let temp = this.state.modSlotConfiguration;
                      // console.log("temp", temp);
                      // temp.SlotParams.forEach(function (t) {
                      //   console.log("t", t);
                      //   console.log("t value", t.Value);
                      //   if (
                      //     // t.Value === undefined ||
                      //     // t.Value === null ||
                      //     // t.Value.length ||
                      //     t.Value.toString().trim() === ""
                      //   ) {
                      //     console.log("modifying", t.Value);
                      //     t.Value = t.DefaultValue;
                      //     //return (t["Value"] = t["DefaulValue"]);
                      //   }
                      // });
                      // console.log("after mofify temp", temp);
                    } else {
                      console.log("Suchitra:Error in getslotconfig");
                      // this.setState({
                      //   isReceiptsRefreshing: false,
                      //   isShipmentsRefreshing: false,
                      // });
                      toast(
                        <ErrorBoundary>
                          <NotifyEvent
                            notificationMessage={notification}
                          ></NotifyEvent>
                        </ErrorBoundary>,
                        {
                          autoClose:
                            notification.messageType === "success"
                              ? 10000
                              : false,
                        }
                      );
                      console.log(
                        "Error while getting getSlotConfigurations:",
                        result
                      );
                    }
                  })
                  .catch((error) => {
                    this.setState({
                      isReceiptsRefreshing: false,
                      isShipmentsRefreshing: false,
                    });
                    toast(
                      <ErrorBoundary>
                        <NotifyEvent
                          notificationMessage={notification}
                        ></NotifyEvent>
                      </ErrorBoundary>,
                      {
                        autoClose:
                          notification.messageType === "success"
                            ? 10000
                            : false,
                      }
                    );
                    console.log(
                      "Error while getting getSlotConfigurations:",
                      error
                    );
                  });
              }
            );
          } else {
            console.log("Error while getting Terminal List:", result);
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        } else {
          console.log("Error while getting Terminal List:", result);
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        }
      })
      .catch((error) => {
        // this.setState({
        //   isReceiptsRefreshing: false,
        //   isShipmentsRefreshing: false,
        // });
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
        console.log("Error while getting Terminal List:", error);
      });
  }

  saveSlotConfiguration = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempSlotConfiguration = lodash.cloneDeep(this.state.tempSlotConfiguration);
     
      this.updateSlotConfiguration(tempSlotConfiguration);
    
    } catch (error) {
      console.log("RigidTruckDetailsComposite : Error in saveVehicle");
    }
  };

  handleSave = () => {
    try {
      console.log("SlotConfigurationDetailsComposite:inside handleSave");

      let modSlotConfiguration = this.fillSlotConfigurationForAPI(
        this.state.modSlotConfiguration
      );
       

      if (this.validateSave(modSlotConfiguration)) {

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempSlotConfiguration = lodash.cloneDeep(modSlotConfiguration);
      this.setState({ showAuthenticationLayout, tempSlotConfiguration }, () => {
        if (showAuthenticationLayout === false) {
          this.saveSlotConfiguration();
        }
    });

       
        //this.setState({ saveEnabled: true });
        console.log("SlotConfigurationDetailsComposite:Validation passed");
        //this.updateSlotConfiguration(modSlotConfiguration);
      } else {
        this.setState({ saveEnabled: true });
        return;
      }
    } catch (error) {
      console.log(
        "SlotConfigurationDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillSlotConfigurationForAPI(slotConfiguration) {
    var finalSlotConfiguration = lodash.cloneDeep(emptySlotConfigurationForAPI);
    finalSlotConfiguration.TerminalCode = slotConfiguration.TerminalCode;
    finalSlotConfiguration.TransportationType =
      slotConfiguration.TransportationType;
    finalSlotConfiguration.SlotParams = [];
    var param;

    Object.keys(slotConfiguration.SlotParams).forEach(
      (key) => (
        (param = lodash.cloneDeep(emptySlotParam)),
        //console.log("param->",param),
        //console.log("from ui value->",slotConfiguration.SlotParams[key].Value),
        (param.Name = key),
        (param.Value = slotConfiguration.SlotParams[key].Value),
        (param.DefaultValue = slotConfiguration.SlotParams[key].DefaultValue),
        (param.Description = slotConfiguration.SlotParams[key].Description),
        //console.log("param->",param),
        finalSlotConfiguration.SlotParams.push(param)
      )
    );
    //console.log("Modified params for API-",finalSlotConfiguration.SlotParams);

    return finalSlotConfiguration;
  }
  fillSlotConfigurationForUI(slotConfiguration) {
    var finalSlotConfiguration = lodash.cloneDeep(emptySlotConfiguration);
    finalSlotConfiguration.TerminalCode = slotConfiguration.TerminalCode;
    finalSlotConfiguration.TransportationType =
      slotConfiguration.TransportationType;
    Object.keys(finalSlotConfiguration.SlotParams).forEach(
      (key) => (
        //console.log("key-",key),
        //console.log("Value,",finalSlotConfiguration.SlotParams[key].Value),
        (finalSlotConfiguration.SlotParams[key].Value =
          slotConfiguration.SlotParams.filter(
            (slotparam) => slotparam.Name === key
          )[0].Value === "" ||
          slotConfiguration.SlotParams.filter(
            (slotparam) => slotparam.Name === key
          )[0].Value === null
            ? slotConfiguration.SlotParams.filter(
                (slotparam) => slotparam.Name === key
              )[0].DefaultValue
            : slotConfiguration.SlotParams.filter(
                (slotparam) => slotparam.Name === key
              )[0].Value),
        (finalSlotConfiguration.SlotParams[
          key
        ].DefaultValue = slotConfiguration.SlotParams.filter(
          (slotparam) => slotparam.Name === key
        )[0].DefaultValue),
        (finalSlotConfiguration.SlotParams[
          key
        ].Description = slotConfiguration.SlotParams.filter(
          (slotparam) => slotparam.Name === key
        )[0].Description)
      )
    );
    //console.log("Modified params-",finalSlotConfiguration.SlotParams);

    return finalSlotConfiguration;
  }
  validateSave(modSlotConfiguration) {
    //debugger;
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(mapSlotParameterValidationDef).forEach(function (key) {
      if (modSlotConfiguration[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          mapSlotParameterValidationDef[key],
          modSlotConfiguration.SlotParams[key]
        );
    });
    this.setState({ validationErrors });

    var returnValue = true;
    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });

    return returnValue;
  }

  updateSlotConfiguration(modSlotConfiguration) {
    //console.log("inside create", modSlotConfiguration);

    let obj = {
      Entity: modSlotConfiguration,
    };

    let notification = {
      messageType: "critical",
      message: "SlotConfiguration_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["TerminalCode"],
          keyValues: [modSlotConfiguration.TerminalCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApi.CreateSlotConfiguration,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        //console.log("after save", response.data);
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.handleAuthenticationClose();
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnSlotConfiguration
              ),
            }
            //() => this.getTerminal({ Common_Code: modTerminal.Code })
          );
          //this.props.onNotice(notification);
        } else {
          this.handleAuthenticationClose();
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnSlotConfiguration
            ),
          });
        }
        // this.props.onSaved(
        //   this.state.modSlotConfiguration,
        //   "add",
        //   notification
        // );
        this.props.onNotice(notification);
      })
      .catch((error) => {
        this.handleAuthenticationClose();
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnSlotConfiguration
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        // this.props.onSaved(
        //   this.state.modSlotConfiguration,
        //   "add",
        //   notification
        // );
      });
  }

  handleChange = (propertyName, data) => {
    try {
      //debugger;
      const modSlotConfiguration = lodash.cloneDeep(
        this.state.modSlotConfiguration
      );

      modSlotConfiguration.SlotParams[propertyName].Value = data;
      modSlotConfiguration.SlotParams[propertyName].DefaultValue = data;
      this.setState({ modSlotConfiguration });
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (mapSlotParameterValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          mapSlotParameterValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
        //console.log("validationErrors->", validationErrors);
      }
    } catch (error) {
      console.log(
        "SlotConfigurationDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  
  handleAuthenticationClose = () => {
    this.setState({
    showAuthenticationLayout: false,
    });
  };

  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader newEntityName="SlotConfiguration_lblPageTitle"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <SlotConfigurationDetail
            slotConfiguration={this.state.slotConfiguration}
            modSlotConfiguration={this.state.modSlotConfiguration}
            onFieldChange={this.handleChange}
            validationErrors={this.state.validationErrors}
            isNew={this.state.isNew}
          ></SlotConfigurationDetail>
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row">
                <div className="col col-12" style={{ textAlign: "right" }}>
                  <Button
                    content={t("Save")}
                    disabled={!this.state.saveEnabled}
                    onClick={() => this.handleSave()}
                  ></Button>
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout   
            
          ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnSlotConfiguration}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.saveSlotConfiguration}
          ></UserAuthenticationLayout>
        ) : null}
      </div>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(SlotConfigurationDetailComposite);
SlotConfigurationDetailComposite.propTypes = {
  onNotice: PropTypes.func.isRequired,
};
