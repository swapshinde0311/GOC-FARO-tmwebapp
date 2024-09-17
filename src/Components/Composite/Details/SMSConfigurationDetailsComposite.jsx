import React, { Component } from "react";
import { emptySMSConfiguration } from "../../../JS/DefaultEntities";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import lodash from "lodash";
import axios from "axios";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import SMSConfigurationDetails from "../../UIBase/Details/SMSConfigurationDetails";
import { functionGroups, fnSMSConfiguration } from "../../../JS/FunctionGroups";
import { smsConfigurationValidationDef } from "../../../JS/ValidationDef";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class SMSConfigurationDetailsComposite extends Component {
  state = {
    smsConfiguration: {},
    modSMSConfiguration: {},
    entityDetails: {},
    validationErrors: Utilities.getInitialValidationErrors(
      smsConfigurationValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    entityTypeOptions: [],
    entityParamTypeOptions: [],
    entityParamFieldOptions: [],
    RecipientDetails: [],
    showAuthenticationLayout: false,
    tempSMSConfiguration: {},
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.smsConfiguration.SMSMessageCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getSMSConfiguration(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "SMSConfigurationDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getSMSConfiguration(smsConfigRow) {
    try {
      if (smsConfigRow.Common_Code === undefined) {
        this.setState({
          smsConfiguration: lodash.cloneDeep(emptySMSConfiguration),
          modSMSConfiguration: lodash.cloneDeep(emptySMSConfiguration),
          isReadyToRender: true,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnSMSConfiguration
          ),
          entityParamTypeOptions: [],
          entityParamFieldOptions: [],
          RecipientDetails: [],
        });
        return;
      }
      var keyCode = [
        {
          key: KeyCodes.smsConfigurationCode,
          value: smsConfigRow.Common_Code,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.smsConfigurationCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetSMSConfiguration,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              isReadyToRender: true,
              smsConfiguration: result.EntityResult,
              modSMSConfiguration: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnSMSConfiguration
              ),
            });
            this.getEntityParameterType(result.EntityResult.EmailSMSEntityType);
            this.getRecipientList(result.EntityResult.EmailSMSEntityType);
          } else {
            this.setState({
              smsConfiguration: lodash.cloneDeep(emptySMSConfiguration),
              modSMSConfiguration: lodash.cloneDeep(emptySMSConfiguration),
              isReadyToRender: true,
              selColor: "",
            });
            console.log("Error in getSMSConfiguration:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting SMS Configuration:",
            error,
            smsConfigRow
          );
        });
    } catch (error) {
      console.log(
        "Error while getting SMS Configuration:",
        error)
    }
  }

  componentDidMount() {
    try {
      this.getEntityDetails();
      this.getSMSConfiguration(this.props.selectedRow);
    } catch (error) {
      console.log(
        "SMSConfigurationDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getEntityDetails() {
    try {
      axios(
        RestAPIs.GetEntityTypeRecipientList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              result.EntityResult !== undefined
            ) {
              let entityTypeOptions = this.state.entityTypeOptions;
              entityTypeOptions = Utilities.transferListtoOptions(
                Object.keys(result.EntityResult)
              );
              this.setState({
                entityDetails: result.EntityResult,
                entityTypeOptions,
              });
            }
          } else {
            console.log("Error in getEntityDetails:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Entity Details:", error);
        });
    } catch (error) {
      console.log("Error while getting Entity Details:", error);
    }
  }

  getEntityParameterType(entityType) {
    try {
      const entityDetails = lodash.cloneDeep(this.state.entityDetails);
      let entityParamTypeOptions = this.state.entityParamTypeOptions;
      entityParamTypeOptions = [];
      entityParamTypeOptions = Utilities.transferListtoOptions([
        entityDetails[entityType].Key,
      ]);
      this.setState({
        entityParamTypeOptions,
      });
    } catch (error) {
      console.log(
        "SMSConfigurationDetailsComposite:Error occured on getEntityParameterType",
        error
      );
    }
  }

  handleChange = (propertyName, data) => {
    try {
      let modSMSConfiguration = lodash.cloneDeep(
        this.state.modSMSConfiguration
      );
      modSMSConfiguration[propertyName] = data;
      if (propertyName === "EmailSMSEntityType") {
        this.getEntityParameterType(data);
        this.getRecipientList(data);
      }

      if (propertyName === "EntityParamType") this.getEntityParamFields(data);

      let RecipientDetails = this.state.RecipientDetails;
      if (propertyName === "To") {
        RecipientDetails.forEach((x) => {
          if (x.Recipient === data) {
            x.To = true;
            x.None = false;
          }
        });
        this.setState({ RecipientDetails });
      }
      if (propertyName === "None") {
        RecipientDetails.forEach((x) => {
          if (x.Recipient === data) {
            x.To = false;
            x.None = true;
          }
        });
        this.setState({ RecipientDetails });
      }

      const validationErrors = { ...this.state.validationErrors };
      if (smsConfigurationValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          smsConfigurationValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modSMSConfiguration });
    } catch (error) {
      console.log(
        "SMSConfigurationDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleParamField = (selectedParamField) => {
    var modSMSConfiguration = lodash.cloneDeep(this.state.modSMSConfiguration);
    modSMSConfiguration.SelectedParamField = selectedParamField;

    this.setState({
      modSMSConfiguration,
    });
  };

  handleAddParamterClick = () => {
    try {
      var modSMSConfiguration = lodash.cloneDeep(this.state.modSMSConfiguration);
      let strParamField =
        " [" +
        modSMSConfiguration.EntityParamType +
        "_" +
        modSMSConfiguration.SelectedParamField +
        "] ";
      modSMSConfiguration.MessageText =
        modSMSConfiguration.MessageText + strParamField;

      this.setState({ modSMSConfiguration });
    } catch (err) {
      console.log("Error in handleAddParameterClick",err)
    }
  };

  getEntityParamFields(paramType) {
    try {
      axios(
        RestAPIs.GetEntityParamFields + paramType,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              result.EntityResult !== undefined
            ) {
              let entityParamFieldOptions = this.state.entityParamFieldOptions;
              entityParamFieldOptions = Utilities.transferListtoOptions(
                result.EntityResult
              );
              this.setState({
                entityParamFieldOptions,
              });
            }
          } else {
            console.log("Error in getEntityParamFields:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Entity Param Fields:", error);
        });
    } catch (error) {
      console.log("Error while getting Entity Param Fields:", error);
    }
  }

  getRecipientList(entityType) {
    try {
      let RecipientDetails = lodash.cloneDeep(this.state.RecipientDetails);
      const modSMSConfiguration = lodash.cloneDeep(
        this.state.modSMSConfiguration
      );
      let entityDetails = lodash.cloneDeep(this.state.entityDetails);
      RecipientDetails = [];
      entityDetails[entityType].Value.forEach((recipient) => {
        let recipientRow = {
          Recipient: recipient,
          To:
            modSMSConfiguration.RecipientList.indexOf(recipient) >= 0
              ? true
              : false,
          None:
            modSMSConfiguration.RecipientList.indexOf(recipient) >= 0
              ? false
              : true,
        };
        RecipientDetails.push(recipientRow);
      });
      this.setState({
        RecipientDetails,
      });
    } catch (error) {
      console.log(
        "SMSConfigurationDetailsComposite:Error occured on getRecipientList",
        error
      );
    }
  }
  saveSMSConfiguration = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempSMSConfiguration = lodash.cloneDeep(this.state.tempSMSConfiguration);
      this.state.smsConfiguration.SMSMessageCode === ""
        ? this.createSMSConfiguration(tempSMSConfiguration)
        : this.updateSMSConfiguration(tempSMSConfiguration);
    } catch (error) {
      console.log("SMSConfigurationgDetailsComposite : Error in saveSMSConfiguration");
    }
  };
  handleSave = () => {
    try {
      let modSMSConfiguration = lodash.cloneDeep(
        this.state.modSMSConfiguration
      );
      const RecipientDetails = lodash.cloneDeep(this.state.RecipientDetails);
      modSMSConfiguration.RecipientList = this.formRecipientList(
        RecipientDetails
      );
      // this.setState({ saveEnabled: false });
      if (this.validateSave(modSMSConfiguration)) {
        let tempSMSConfiguration = lodash.cloneDeep(modSMSConfiguration);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout, tempSMSConfiguration }, () => {
          if (showAuthenticationLayout === false) {
            this.saveSMSConfiguration();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "SMSConfigurationDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  formRecipientList(recipientDetails) {
    let recipientList = "";
    try {
      if (Array.isArray(recipientDetails)) {
        recipientDetails.forEach((recipient) => {
          if (recipient.To === true) recipientList += recipient.Recipient + ",";
        });
        if (recipientList !== "" && recipientList !== undefined)
          recipientList = recipientList.slice(0, -1);
      }
    } catch (error) {}
    return recipientList;
  }

  validateSave(modSMSConfiguration) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(smsConfigurationValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          smsConfigurationValidationDef[key],
          modSMSConfiguration[key]
        );
      });

      let recipientListError = "";
      let notification = {
        messageType: "critical",
        message: "SMSConfig_SavedStatus",
        messageResultDetails: [],
      };

      if (modSMSConfiguration.Active !== this.state.smsConfiguration.Active) {
        if (
          modSMSConfiguration.Remarks === null ||
          modSMSConfiguration.Remarks === ""
        ) {
          validationErrors["Remarks"] = "Receipt_RemarksRequired";
        }
      }
      if (
        modSMSConfiguration.RecipientList === "" ||
        modSMSConfiguration.RecipientList === null ||
        modSMSConfiguration.RecipientList === undefined
      ) {
        recipientListError = "SMSConfiguration_RecipientListEmptyError";

        if (recipientListError !== "") {
          notification.messageResultDetails.push({
            keyFields: ["SMSConfiguration_RecipientList"],
            keyValues: [modSMSConfiguration.RecipientList],
            isSuccess: false,
            errorMessage: recipientListError,
          });
        }
        if (
          modSMSConfiguration.SMSMessageCode !== "" &&
          modSMSConfiguration.EmailSMSEntityType !== ""
        ) {
          this.props.onSaved(modSMSConfiguration, "update", notification);
          return false;
        }
      }

      this.setState({ validationErrors });
      var returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
      return returnValue;
    } catch (error) {
      console.log("Error in validate save",error)
    }
  }

  handleActiveStatusChange = (value) => {
    try {
      let modSMSConfiguration = lodash.cloneDeep(
        this.state.modSMSConfiguration
      );
      modSMSConfiguration.Active = value;
      if (modSMSConfiguration.Active !== this.state.smsConfiguration.Active)
        modSMSConfiguration.Remarks = "";
      this.setState({ modSMSConfiguration });
    } catch (error) {
      console.log(error);
    }
  };

  createSMSConfiguration(modSMSConfiguration) {
    try {
      var keyCode = [
        {
          key: KeyCodes.smsConfigurationCode,
          value: modSMSConfiguration.SMSMessageCode,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.smsConfigurationCode,
        KeyCodes: keyCode,
        Entity: modSMSConfiguration,
      };
      var notification = {
        messageType: "critical",
        message: "SMSConfig_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["SMSConfiguration_Code"],
            keyValues: [modSMSConfiguration.SMSMessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateSMSConfiguration,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnSMSConfiguration
                ),
              },
              () =>
                this.getSMSConfiguration({
                  Common_Code: modSMSConfiguration.SMSMessageCode,
                })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnSMSConfiguration
              ),
            });
            console.log("Error in createSMSConfiguration:", result.ErrorList);
          }
          this.props.onSaved(modSMSConfiguration, "add", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnSMSConfiguration
            ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modSMSConfiguration, "add", notification);
        });
    } catch (error) {
      console.log("Error in createSMSConfiguration",error)
    }
  }

  updateSMSConfiguration(modSMSConfiguration) {
    try {
      let keyCode = [
        {
          key: KeyCodes.smsConfigurationCode,
          value: modSMSConfiguration.SMSMessageCode,
        },
      ];

      let obj = {
        keyDataCode: KeyCodes.smsConfigurationCode,
        KeyCodes: keyCode,
        Entity: modSMSConfiguration,
      };

      let notification = {
        messageType: "critical",
        message: "SMSConfig_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["SMSConfiguration_Code"],
            keyValues: [modSMSConfiguration.SMSMessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateSMSConfiguration,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnSMSConfiguration
                ),
              },
              () =>
                this.getSMSConfiguration({
                  Common_Code: modSMSConfiguration.SMSMessageCode,
                })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnSMSConfiguration
              ),
            });
            console.log("Error in updateSMSConfiguration:", result.ErrorList);
          }
          this.props.onSaved(modSMSConfiguration, "update", notification);
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modSMSConfiguration, "modify", notification);
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnSMSConfiguration
            ),
          });
        });
    } catch (error) {
      console.log("Error in updateSMSConfiguration:",error)
    }
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      let modSMSConfiguration = lodash.cloneDeep(this.state.smsConfiguration);
      modSMSConfiguration.EntityParamType = "";
      this.setState({
        modSMSConfiguration,
        validationErrors,
        entityParamFieldOptions: [],
      });

      this.getEntityParameterType(
        this.state.smsConfiguration.EmailSMSEntityType
      );
      this.getRecipientList(this.state.smsConfiguration.EmailSMSEntityType);
    } catch (error) {
      console.log(
        "SMSConfigurationDetailsComposite:Error occured on handleReset",
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
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modSMSConfiguration.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modSMSConfiguration.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modSMSConfiguration.LastActiveTime !== undefined &&
          this.state.modSMSConfiguration.LastActiveTime !== null
            ? new Date(
                this.state.modSMSConfiguration.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modSMSConfiguration.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(
            this.state.modSMSConfiguration.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modSMSConfiguration.CreatedTime
          ).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.smsConfiguration.SMSMessageCode}
            newEntityName="SMSConfigurationDetails_PageTitle"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <SMSConfigurationDetails
            smsConfiguration={this.state.smsConfiguration}
            modSMSConfiguration={this.state.modSMSConfiguration}
            validationErrors={this.state.validationErrors}
            listOptions={{
              entityTypeOptions: this.state.entityTypeOptions,
              entityParamTypeOptions: this.state.entityParamTypeOptions,
              entityParamFieldOptions: this.state.entityParamFieldOptions,
            }}
            RecipientDetails={this.state.RecipientDetails}
            onFieldChange={this.handleChange}
            handleParamField={this.handleParamField}
            onActiveStatusChange={this.handleActiveStatusChange}
            onAddParamClick={this.handleAddParamterClick}
          ></SMSConfigurationDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.smsConfiguration.SMSMessageCode === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnSMSConfiguration}
            handleOperation={this.saveSMSConfiguration}
            handleClose={this.handleAuthenticationClose}
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

export default connect(mapStateToProps)(SMSConfigurationDetailsComposite);

SMSConfigurationDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  //selectedShareholder: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
