import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { EmailConfigurationDetails } from "../../UIBase/Details/EmailConfigurationDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyEmailConfiguration } from "../../../JS/DefaultEntities";
import { emailConfigurationValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import {
  functionGroups,
  fnEmailConfiguration,
} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class EmailConfigurationDetailsComposite extends Component {
  state = {
    emailConfig: lodash.cloneDeep(emptyEmailConfiguration),
    modEmailConfig: {},
    validationErrors: Utilities.getInitialValidationErrors(
      emailConfigurationValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    EmailEntityTypeRecipientOptions: {},
    EntityTypeOptions: [],
    showAuthenticationLayout: false,
    tempEmailConfig: {},
  };

  componentDidMount() {
    try {
      this.GetEmailEntityTypeList();
      this.getEmailConfiguration(this.props.selectedRow);
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  GetEmailEntityTypeList() {
    try {
      axios(
        RestAPIs.GetEmailEntityTypeRecipientList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let EntityTypeOptions = this.state.EntityTypeOptions;
              EntityTypeOptions = Utilities.transferListtoOptions(
                Object.keys(result.EntityResult)
              );
              this.setState({
                EmailEntityTypeRecipientOptions: result.EntityResult,
                EntityTypeOptions,
              });
            }
          } else {
            console.log("Error in GetEmailEntityTypeList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting GetEmailEntityTypeList:", error);
        });
    } catch (err) {
      console.log("Error in GetEmailEntityTypeList",err)
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.emailConfig.EmailMessageCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getEmailConfiguration(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getEmailConfiguration(mailConfigurationRow) {
    try {
      emptyEmailConfiguration.Priority = 2;
      if (mailConfigurationRow.Common_Code === undefined) {
        this.setState({
          emailConfig: lodash.cloneDeep(emptyEmailConfiguration),
          modEmailConfig: lodash.cloneDeep(emptyEmailConfiguration),
          isReadyToRender: true,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnEmailConfiguration
          ),
        });
        return;
      }

      var keyCode = [
        {
          key: KeyCodes.EmailConfigurationCode,
          value: mailConfigurationRow.Common_Code,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.EmailConfigurationCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetEmailConfiguration,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState(
              {
                isReadyToRender: true,
                emailConfig: lodash.cloneDeep(result.EntityResult),
                modEmailConfig: lodash.cloneDeep(result.EntityResult),
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnEmailConfiguration
                ),
              },
              () => this.bindRecipientList(result.EntityResult.EmailSMSEntityType)
            );
          } else {
            this.setState({
              emailConfig: lodash.cloneDeep(emptyEmailConfiguration),
              modEmailConfig: lodash.cloneDeep(emptyEmailConfiguration),
              isReadyToRender: true,
            });
            console.log("Error in getEmailConfiguration:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting EmailConfiguration:",
            error,
            mailConfigurationRow
          );
        });
    } catch (err) {
      console.log("Error in getEmailConfiguration",err)
    }
  }

  handleChange = (propertyName, data) => {
    try {
      const modEmailConfig = lodash.cloneDeep(this.state.modEmailConfig);
      modEmailConfig[propertyName] = data;
      this.setState({ modEmailConfig });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (emailConfigurationValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          emailConfigurationValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleEntityTypeChange = (data) => {
    try {
      const modEmailConfig = lodash.cloneDeep(this.state.modEmailConfig);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modEmailConfig.EmailSMSEntityType = data;

      validationErrors.EmailSMSEntityType = "";
      this.setState({ modEmailConfig, validationErrors }, () =>
        this.bindRecipientList(data)
      );
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on handleEntityTypeChange",
        error
      );
    }
  };

  bindRecipientList(EntityType) {
    try {
      const modEmailConfig = lodash.cloneDeep(this.state.modEmailConfig);
      const EmailEntityTypeRecipientOptions = lodash.cloneDeep(
        this.state.EmailEntityTypeRecipientOptions
      );
      modEmailConfig.Recipients = [];
      EmailEntityTypeRecipientOptions[EntityType].Value.forEach((item) => {
        let newRecipient = {
          Recipient: item,
          To: modEmailConfig.RecipientListTo.indexOf(item) >= 0 ? true : false,
          CC: modEmailConfig.RecipientListCC.indexOf(item) >= 0 ? true : false,
          BCC:
            modEmailConfig.RecipientListBCC.indexOf(item) >= 0 ? true : false,
          None:
            modEmailConfig.RecipientListTo.indexOf(item) >= 0 ||
            modEmailConfig.RecipientListCC.indexOf(item) >= 0 ||
            modEmailConfig.RecipientListBCC.indexOf(item) >= 0
              ? false
              : true,
        };
        modEmailConfig.Recipients.push(newRecipient);
      });
      this.setState({ modEmailConfig });
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on bindRecipientList",
        error
      );
    }
  }

  handleCellDataEdit = (cellData) => {
    try {
      const modEmailConfig = lodash.cloneDeep(this.state.modEmailConfig);

      Object.keys(modEmailConfig.Recipients[cellData.rowIndex]).forEach(function (
        key
      ) {
        if (key !== "Recipient" && key !== cellData.field) {
          modEmailConfig.Recipients[cellData.rowIndex][key] = false;
        }
      });
      modEmailConfig.Recipients[cellData.rowIndex][cellData.field] = true;

      this.setState({ modEmailConfig });
    } catch (err) {
      console.log("Error in handlecelldataedit",err)
    }
  };

  handleActiveStatusChange = (data) => {
    try {
      const modEmailConfig = lodash.cloneDeep(this.state.modEmailConfig);

      modEmailConfig.Active = data;
      if (modEmailConfig.Active !== this.state.emailConfig.Active)
        modEmailConfig.Remarks = "";

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (modEmailConfig.Active === this.state.emailConfig.Active) {
        if (modEmailConfig.Remarks === null || modEmailConfig.Remarks === "") {
          validationErrors.Remarks = "";
        }
      }

      this.setState({ modEmailConfig, validationErrors });
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const emailConfig = lodash.cloneDeep(this.state.emailConfig);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modEmailConfig: { ...emailConfig },
          selectedCompRow: [],
          validationErrors,
        },
        () => this.bindRecipientList(emailConfig.EmailSMSEntityType)
      );
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  saveEmailConfig = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempEmailConfig = lodash.cloneDeep(this.state.tempEmailConfig);
      this.state.emailConfig.EmailMessageCode === ""
        ? this.createEmailConfiguration(tempEmailConfig)
        : this.updateEmailConfiguration(tempEmailConfig);
    } catch (error) {
      console.log("EmailConfigDetailsComposite : Error in saveEmailConfig");
    }
  };
  handleSave = () => {
    try {
      let modEmailConfig = this.fillRecipientDetails();
      // this.setState({ saveEnabled: false });
      if (this.validateSave(modEmailConfig)) {
        let tempEmailConfig = lodash.cloneDeep(modEmailConfig);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout, tempEmailConfig }, () => {
          if (showAuthenticationLayout === false) {
            this.saveEmailConfig();
          }
        });
      } else this.setState({ saveEnabled: true });
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave(modEmailConfig) {
    try {
      const validationErrors = { ...this.state.validationErrors };
      Object.keys(emailConfigurationValidationDef).forEach(function (key) {
        if (modEmailConfig[key] !== undefined)
          validationErrors[key] = Utilities.validateField(
            emailConfigurationValidationDef[key],
            modEmailConfig[key]
          );
      });

      if (modEmailConfig.Active !== this.state.emailConfig.Active) {
        if (modEmailConfig.Remarks === null || modEmailConfig.Remarks === "") {
          validationErrors["Remarks"] = "Vehicle_RemarksRequired";
        }
      }

      let notification = {
        messageType: "critical",
        message: "EmailConfiguration_AddUpdateSuccessMsg",
        messageResultDetails: [],
      };

      let ToRecipient = modEmailConfig.Recipients.filter((x) => x.To === true);

      if (ToRecipient.length <= 0) {
        notification.messageResultDetails.push({
          keyFields: ["EmailConfiguration_Code"],
          keyValues: [modEmailConfig.EmailMessageCode],
          isSuccess: false,
          errorMessage: "EMAILMESSAGE_RECIPIENTTO_EMPTY_X",
        });
      }

      this.setState({ validationErrors });
      let returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
      if (notification.messageResultDetails.length > 0) {
        this.props.onSaved(this.state.modEmailConfig, "update", notification);
        return false;
      }
      return returnValue;
    } catch (error) {
      console.log("Error is validatesave",error)
    }
  }

  fillRecipientDetails() {
    try {
      let modEmailConfig = lodash.cloneDeep(this.state.modEmailConfig);

      modEmailConfig.RecipientListTo = "";
      modEmailConfig.RecipientListCC = "";
      modEmailConfig.RecipientListBCC = "";

      modEmailConfig.Recipients.forEach((item) => {
        if (item.To === true) {
          modEmailConfig.RecipientListTo =
            modEmailConfig.RecipientListTo + item.Recipient + ",";
        } else if (item.CC === true) {
          modEmailConfig.RecipientListCC =
            modEmailConfig.RecipientListCC + item.Recipient + ",";
        } else if (item.BCC === true) {
          modEmailConfig.RecipientListBCC =
            modEmailConfig.RecipientListBCC + item.Recipient + ",";
        }
      });

      modEmailConfig.RecipientListTo = modEmailConfig.RecipientListTo.slice(
        0,
        -1
      );
      modEmailConfig.RecipientListCC = modEmailConfig.RecipientListCC.slice(
        0,
        -1
      );
      modEmailConfig.RecipientListBCC = modEmailConfig.RecipientListBCC.slice(
        0,
        -1
      );
      return modEmailConfig;
    } catch (error) {
      console.log(
        "EmailConfigurationDetailsComposite:Error occured on fillRecipientDetails",
        error
      );
    }
  }

  createEmailConfiguration(modEmailConfig) {
    try {
      let keyCode = [
        {
          key: KeyCodes.EmailConfigurationCode,
          value: modEmailConfig.EmailMessageCode,
        },
      ];
      let obj = {
        keyDataCode: KeyCodes.EmailConfigurationCode,
        KeyCodes: keyCode,
        Entity: modEmailConfig,
      };

      let notification = {
        messageType: "critical",
        message: "EmailConfiguration_AddUpdateSuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["EmailConfiguration_Code"],
            keyValues: [modEmailConfig.EmailMessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.CreateEmailConfiguration,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnEmailConfiguration
                ),
                showAuthenticationLayout: false,

              },
              () =>
                this.getEmailConfiguration({
                  Common_Code: modEmailConfig.EmailMessageCode,
                })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnEmailConfiguration
              ),
              showAuthenticationLayout: false,

            });
            console.log("Error in createEmailConfiguration:", result.ErrorList);
          }
          this.props.onSaved(this.state.modEmailConfig, "add", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnEmailConfiguration
            ),
            showAuthenticationLayout: false,

          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.modEmailConfig, "add", notification);
        });
    } catch (error) {
      console.log("Error in create emailconfiguration",error)
    }
  }

  updateEmailConfiguration(modEmailConfig) {
    try {
      let keyCode = [
        {
          key: KeyCodes.EmailConfigurationCode,
          value: modEmailConfig.EmailMessageCode,
        },
      ];
      let obj = {
        keyDataCode: KeyCodes.EmailConfigurationCode,
        KeyCodes: keyCode,
        Entity: modEmailConfig,
      };

      let notification = {
        messageType: "critical",
        message: "EmailConfiguration_AddUpdateSuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["EmailConfiguration_Code"],
            keyValues: [modEmailConfig.EmailMessageCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateEmailConfiguration,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnEmailConfiguration
                ),
                showAuthenticationLayout: false,

              },
              () =>
                this.getEmailConfiguration({
                  Common_Code: modEmailConfig.EmailMessageCode,
                })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnEmailConfiguration
              ),
              showAuthenticationLayout: false,

            });
            console.log("Error in createEmailConfiguration:", result.ErrorList);
          }
          this.props.onSaved(this.state.modEmailConfig, "update", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnEmailConfiguration
            ),
            showAuthenticationLayout: false,

          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.modEmailConfig, "modify", notification);
        });
    } catch (error) {
      console.log("Error in updateemailConfiguration",error)
    }
  }
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      priority: Constants.EmailPriority,
      EntityTypeOptions: this.state.EntityTypeOptions,
    };
    const popUpContents = [
      {
        fieldName: "EmailConfiguration_LastUpDt",
        fieldValue:
          new Date(
            this.state.modEmailConfig.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modEmailConfig.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "EmailConfiguration_LastActiveTime",
        fieldValue:
          this.state.modEmailConfig.LastActiveTime !== undefined &&
          this.state.modEmailConfig.LastActiveTime !== null
            ? new Date(
                this.state.modEmailConfig.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modEmailConfig.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "EmailConfiguration_CreateDt",
        fieldValue:
          new Date(this.state.modEmailConfig.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modEmailConfig.CreatedTime).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.emailConfig.EmailMessageCode}
            newEntityName="EmailConfiguration_lHeader"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <EmailConfigurationDetails
            emailConfig={this.state.emailConfig}
            modEmailConfig={this.state.modEmailConfig}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            onEntityTypeChange={this.handleEntityTypeChange}
            handleCellDataEdit={this.handleCellDataEdit}
            onActiveStatusChange={this.handleActiveStatusChange}
          ></EmailConfigurationDetails>
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
              this.state.emailConfig.EmailMessageCode === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnEmailConfiguration}
            handleOperation={this.saveEmailConfig}
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

export default connect(mapStateToProps)(EmailConfigurationDetailsComposite);

EmailConfigurationDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
