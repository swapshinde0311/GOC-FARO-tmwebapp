import React, { Component } from "react";
import { HSEConfigurationDetails } from "../../UIBase/Details/HSEConfigurationDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { HSEConfigurationValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyHSEConfiguration } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "./../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import { functionGroups, fnHSEConfiguration, fnRoadHSEConfiguration, fnRailHSEConfiguration, fnMarineHSEConfiguration, fnPipelineHSEConfiguration } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class HSEConfigurationDetailsComposite extends Component {
  state = {
    HSEConfiguration: lodash.cloneDeep(emptyHSEConfiguration),
    modHSEConfiguration: {},
    modAssociations: [],
    validationErrors: Utilities.getInitialValidationErrors(
      HSEConfigurationValidationDef
    ),
    isReadyToRender: false,
    shareholders: this.getShareholders(),
    transactionTypeOptions: [],
    transportationUnitObject: {},
    transportationUnitOptions: [],
    transportationUnitTypeOptions: [],
    locationTypeOptions: [],
    saveEnabled: false,
    isNewHSEConfiguration: true,
    fileSelectorValue: "",
    showAuthenticationLayout: false,
    tempHSEConfiguration: {},
  };

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  handleChange = (propertyName, data) => {
    try {
      const modHSEConfiguration = lodash.cloneDeep(
        this.state.modHSEConfiguration
      );
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      modHSEConfiguration[propertyName] = data;
      if (propertyName === "TransportationUnit") {
        const transportationUnitTypeList = this.state.transportationUnitObject[
          data
        ];
        if (transportationUnitTypeList.length === 1) {
          modHSEConfiguration.TransportationUnitType =
            transportationUnitTypeList[0];
        }
        this.setState({
          transportationUnitTypeOptions: Utilities.transferListtoOptions(
            transportationUnitTypeList
          ),
        });
      }
      this.setState({ modHSEConfiguration });
      if (HSEConfigurationValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          HSEConfigurationValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "HSEConfigurationDetailsComposite: Error occurred on handleChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.HSEConfiguration.TransactionType !== null &&
        nextProps.selectedRow.PipelineEntry_TransactionType === undefined
      ) {
        this.getHSEConfiguration(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "HSEConfigurationDetailsComposite: Error occurred on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      this.getTransactionTypes();
      this.getHSEConfigurationCommonData();
    } catch (error) {
      console.log(
        "HSEConfigurationDetailsComposite: Error occurred on componentDidMount",
        error
      );
    }
  }

  getTransactionTypes() {
    const data =
      this.props.transportationType === Constants.TransportationType.ROAD
        ? {
            shipment: "SHIPMENT",
            receipt: "RECEIPT",
          }
        : {
            shipment: "DISPATCH",
            receipt: "RECEIPT",
          };
    const transactionTypeOptions = [];
    for (let key in data) {
      transactionTypeOptions.push({ text: key, value: data[key] });
    }
    this.setState({ transactionTypeOptions });
  }

  getHSEConfigurationCommonData() {
    const keyCode = [
      {
        key: "TransportationType",
        value: this.props.transportationType,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.HSEConfigurationCommonData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          const transportationUnitObject = {};
          const transportationUnitList = [];
          if (Array.isArray(result.EntityResult.Table)) {
            result.EntityResult.Table.forEach((item) => {
              if (transportationUnitObject[item.Unit] === undefined) {
                transportationUnitObject[item.Unit] = [];
                transportationUnitList.push(item.Unit);
              }
              transportationUnitObject[item.Unit].push(item.UnitType);
            });
          }
          const locationTypeList = [];
          if (Array.isArray(result.EntityResult.Table1)) {
            result.EntityResult.Table1.forEach((item) => {
              locationTypeList.push(item.LocationTypeCode);
            });
          }
          this.setState({
            transportationUnitObject,
            transportationUnitOptions: Utilities.transferListtoOptions(
              transportationUnitList
            ),
            locationTypeOptions: Utilities.transferListtoOptions(
              locationTypeList
            ),
          });
          this.getHSEConfiguration(this.props.selectedRow);
        } else {
          console.log(
            "Error in getHSEConfigurationCommonData:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "getHSEConfigurationCommonData: Error occurred on getHSEConfigurationCommonData",
          error
        );
      });
  }

  getHSEConfiguration(selectedRow) {
    emptyHSEConfiguration.TransportationType = this.props.transportationType;

    if (selectedRow.PipelineEntry_TransactionType === undefined) {
      this.setState({
        HSEConfiguration: { ...emptyHSEConfiguration },
        modHSEConfiguration: { ...emptyHSEConfiguration },
        modAssociations: [],
        isReadyToRender: true,
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          this.props.transportationType + fnHSEConfiguration
        ),
        isNewHSEConfiguration: true,
        fileSelectorValue: "",
      });
      return;
    }

    const keyCode = [
      {
        key: "TransportationType",
        value: this.props.transportationType,
      },
      {
        key: "TransactionType",
        value: selectedRow.PipelineEntry_TransactionType,
      },
      {
        key: "LocationType",
        value: selectedRow.LocationInfo_LocationType,
      },
      {
        key: "TransportationUnit",
        value: selectedRow.HSE_TransportationUnit,
      },
      {
        key: "TransportationUnitType",
        value: selectedRow.HSE_TransportationUnitType,
      },
      {
        key: "TerminalCode",
        value: this.props.selectedTerminal,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetHSEConfiguration,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          const transportationUnitTypeList = this.state
            .transportationUnitObject[result.EntityResult.TransportationUnit];
          this.setState({
            isReadyToRender: true,
            HSEConfiguration: lodash.cloneDeep(result.EntityResult),
            modHSEConfiguration: lodash.cloneDeep(result.EntityResult),
            modAssociations: this.getAssociationsFromXMLString(
              result.EntityResult.Questions
            ),
            transportationUnitTypeOptions: Utilities.transferListtoOptions(
              transportationUnitTypeList
            ),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              this.props.transportationType + fnHSEConfiguration
            ),
            isNewHSEConfiguration: false,
            fileSelectorValue: "",
          });
        } else {
          this.setState({
            HSEConfiguration: lodash.cloneDeep(emptyHSEConfiguration),
            modHSEConfiguration: lodash.cloneDeep(emptyHSEConfiguration),
            isReadyToRender: true,
            isNewHSEConfiguration: true,
          });
          console.log("Error in getHSEConfiguration:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "HSEConfigurationDetailsComposite: Error occurred on getHSEConfiguration",
          error
        );
      });
  }

  getAssociationsFromXMLString(xmlString) {
    let questionsDoc = null;
    let isTransferSuccess = true;
    let notification = {
      messageType: "critical",
      message: "HSE_Configuration_ValidateUploadQuestions",
      messageResultDetails: [
        {
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "HSE_Configuration_ValidateUploadQuestions_Error",
        },
      ],
    };
    if (!!xmlString) {
      try {
        if (window.ActiveXObject) {
          const xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = false;
          xmlDoc.loadXML(xmlString);
          questionsDoc = xmlDoc;
        } else {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, "text/xml");
          questionsDoc = xmlDoc.getElementsByTagName("Questions")[0];
        }
      } catch (error) {
        console.log(
          "HSEConfigurationDetailsComposite: Error occurred on getAssociationsFromXMLString",
          error
        );
        isTransferSuccess = false;
      }
    } else {
      isTransferSuccess = false;
    }
    if (isTransferSuccess) {
      const associations = [];
      if (this.validateAndTransferQuestionsDoc(questionsDoc, associations)) {
        return associations;
      }
    }
    toast(
      <ErrorBoundary>
        <NotifyEvent notificationMessage={notification}></NotifyEvent>
      </ErrorBoundary>,
      {
        autoClose: notification.messageType === "success" ? 10000 : false,
      }
    );
    return [];
  }

  validateAndTransferQuestionsDoc(questionsDoc, questionList) {
    const questionNodeList = [];
    for (let question of questionsDoc.childNodes) {
      if (question.nodeName === "Question") {
        questionNodeList.push(question);
      }
    }
    if (questionNodeList.length === 0) {
      return false;
    }
    for (let questionNode of questionNodeList) {
      const itemCheck = {
        Severity: false,
        EnglishText: false,
        LocalizedText: false,
      };
      let itemNumber = 0;
      const question = {};
      for (let item of questionNode.childNodes) {
        if (
          item.nodeName !== "Severity" &&
          item.nodeName !== "EnglishText" &&
          item.nodeName !== "LocalizedText" &&
          item.nodeName !== "#text" &&
          item.nodeName !== "#comment"
        ) {
          return false;
        } else if (item.nodeName === "Severity") {
          if (item.textContent !== "0" && item.textContent !== "1") {
            return false;
          }
          itemNumber += 1;
          question[item.nodeName] = item.textContent;
        } else if (
          item.nodeName === "EnglishText" ||
          item.nodeName === "LocalizedText"
        ) {
          if (item.textContent === "") {
            return false;
          }
          itemNumber += 1;
          question[item.nodeName] = item.textContent;
        }
        itemCheck[item.nodeName] = true;
      }
      if (
        itemCheck.Severity === false ||
        itemCheck.EnglishText === false ||
        itemCheck.LocalizedText === false
      ) {
        return false;
      } else if (itemNumber !== 3) {
        return false;
      }
      questionList.push(question);
    }
    return true;
  }

  getXMLStringFromAssociations(modAssociations) {
    let xmlString = "<Questions>";
    for (let question of modAssociations) {
      xmlString += "<Question>";
      for (let key in question) {
        xmlString += `<${key}>${question[key]}</${key}>`;
      }
      xmlString += "</Question>";
    }
    xmlString += "</Questions>";
    return xmlString;
  }

  downloadTemplate = (xmlString) => {
    if (xmlString === null) {
      this.getHSEQuestionsTemplate(this.downloadTemplateCallback);
    } else {
      this.downloadTemplateCallback('<?xml version="1.0"?>' + xmlString);
    }
  };

  downloadTemplateCallback = (xmlString) => {
    const exportBlob = new Blob([this.formatXML(xmlString)]);
    const filename = "HSEConfigTemplate.xml";
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(exportBlob, filename);
    } else {
      const saveLink = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      const urlObject = window.URL || window.webkitURL || window;
      saveLink.href = urlObject.createObjectURL(exportBlob);
      saveLink.download = filename;
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      saveLink.dispatchEvent(event);
    }
  };

  getHSEQuestionsTemplate(callback) {
    axios(
      RestAPIs.DownloadHSEQuestion,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          callback(result.EntityResult);
        } else {
          console.log("Error in getHSEQuestionsTemplate:", result.ErrorList);
          return null;
        }
      })
      .catch((error) => {
        console.log(
          "HSEConfigurationDetailsComposite: Error occurred on getHSEQuestionsTemplate",
          error
        );
        return null;
      });
  }

  formatXML(xmlString, tab) {
    let formatted = "",
      indent = "";
    tab = tab || "    ";
    const xmlArray = xmlString.split(/>\s*</);
    for (let i = 0; i < xmlArray.length; i++) {
      let node = xmlArray[i];
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      if (node.substring(0, 1) !== "!") {
        formatted += indent;
      }
      formatted += "<" + node + ">";
      if (i < xmlArray.length - 1 && xmlArray[i + 1].substring(0, 1) !== "!") {
        formatted += "\r\n";
      }
      if (node.match(/^<?\w[^>]*[^/]$/)) {
        indent += tab;
      }
    }
    return formatted.substring(1, formatted.length - 1);
  }

  uploadToPreview = (xmlString) => {
    const modAssociations = this.getAssociationsFromXMLString(xmlString);
    this.setState({ modAssociations });
  };

  saveHSEConfig = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempHSEConfiguration = lodash.cloneDeep(this.state.tempHSEConfiguration);

      this.state.isNewHSEConfiguration === true
          ? this.createHSEConfiguration(tempHSEConfiguration)
          : this.updateHSEConfiguration(tempHSEConfiguration);
    } catch (error) {
      console.log("PrimeMoversComposite : Error in savePrimeMover");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      const modHSEConfiguration = lodash.cloneDeep(
        this.state.modHSEConfiguration
      );
      modHSEConfiguration.TerminalCode= this.props.selectedTerminal;
      modHSEConfiguration.Questions = this.getXMLStringFromAssociations(
        this.state.modAssociations
      );
      if (this.validateSave(modHSEConfiguration)) {
       
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempHSEConfiguration = lodash.cloneDeep(modHSEConfiguration);
      this.setState({ showAuthenticationLayout, tempHSEConfiguration }, () => {
        if (showAuthenticationLayout === false) {
          this.saveHSEConfig();
        }
    });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "HSEConfigurationDetailsComposite: Error occurred on handleSave",
        error
      );
    }
  };

  validateSave(modHSEConfiguration) {
    const validationErrors = lodash.cloneDeep(this.state.validationErrors);

    Object.keys(HSEConfigurationValidationDef).forEach((key) => {
      if (modHSEConfiguration[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          HSEConfigurationValidationDef[key],
          modHSEConfiguration[key]
        );
      }
    });

    let notification = {
      messageType: "critical",
      message: "HSE_Configuration_SavedStatus",
      messageResultDetails: [],
    };

    if (modHSEConfiguration.Questions === "<Questions></Questions>") {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "HSE_Questions_MandatoryCode",
      });
    }

    this.setState({ validationErrors });
    const returnValue = Object.values(validationErrors).every((value) => {
      return value === "";
    });
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(
        this.state.modHSEConfiguration,
        "update",
        notification
      );
      return false;
    }
    return returnValue;
  }

  createHSEConfiguration(modHSEConfiguration) {
    const keyCode = [
      {
        key: "TransportationType",
        value: modHSEConfiguration.TransportationType,
      },
      {
        key: "TransactionType",
        value: modHSEConfiguration.TransactionType,
      },
      {
        key: "LocationType",
        value: modHSEConfiguration.LocationTypeCode,
      },
      {
        key: "TransportationUnit",
        value: modHSEConfiguration.TransportationUnit,
      },
      {
        key: "TransportationUnitType",
        value: modHSEConfiguration.TransportationUnitType,
      },
      {
        key: "TerminalCode",
        value: modHSEConfiguration.TerminalCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      // keyDataCode: KeyCodes.HSEConfiguration,
      KeyCodes: keyCode,
      Entity: modHSEConfiguration,
    };
    var notification = {
      messageType: "critical",
      message: "HSE_Configuration_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["HSE_Configuration"],
          keyValues: [this.props.transportationType],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateHSEConfiguration,
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
          this.setState({ showAuthenticationLayout: false, });

          this.getHSEConfiguration({
            HSE_TransportationUnit: modHSEConfiguration.TransportationUnit,
            HSE_TransportationUnitType:
              modHSEConfiguration.TransportationUnitType,
            LocationInfo_LocationType: modHSEConfiguration.LocationTypeCode,
            PipelineEntry_TransactionType: modHSEConfiguration.TransactionType,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({ saveEnabled: true,showAuthenticationLayout: false, });
          console.log("Error in createHSEConfiguration:", result.ErrorList);
        }
        this.props.onSaved(this.state.modHSEConfiguration, "add", notification);
      })
      .catch((error) => {
        this.setState({ saveEnabled: true, showAuthenticationLayout: false, });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modHSEConfiguration, "add", notification);
      });
  }

  updateHSEConfiguration(modHSEConfiguration) {
    const keyCode = [
      {
        key: "TransportationType",
        value: modHSEConfiguration.TransportationType,
      },
      {
        key: "TransactionType",
        value: modHSEConfiguration.TransactionType,
      },
      {
        key: "LocationType",
        value: modHSEConfiguration.LocationTypeCode,
      },
      {
        key: "TransportationUnit",
        value: modHSEConfiguration.TransportationUnit,
      },
      {
        key: "TransportationUnitType",
        value: modHSEConfiguration.TransportationUnitType,
      },
      {
        key: "TerminalCode",
        value: modHSEConfiguration.TerminalCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      // keyDataCode: KeyCodes.HSEConfiguration,
      KeyCodes: keyCode,
      Entity: modHSEConfiguration,
    };
    var notification = {
      messageType: "critical",
      message: "HSE_Configuration_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["HSE_Configuration"],
          keyValues: [this.props.transportationType],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateHSEConfiguration,
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
          this.setState({ showAuthenticationLayout: false, });
          this.getHSEConfiguration({
            HSE_TransportationUnit: modHSEConfiguration.TransportationUnit,
            HSE_TransportationUnitType:
              modHSEConfiguration.TransportationUnitType,
            LocationInfo_LocationType: modHSEConfiguration.LocationTypeCode,
            PipelineEntry_TransactionType: modHSEConfiguration.TransactionType,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({ saveEnabled: true,showAuthenticationLayout: false, });
          console.log("Error in updateHSEConfiguration:", result.ErrorList);
        }
        this.props.onSaved(
          this.state.modHSEConfiguration,
          "update",
          notification
        );
      })
      .catch((error) => {
        this.setState({ saveEnabled: true,showAuthenticationLayout: false, });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(
          this.state.modHSEConfiguration,
          "modify",
          notification
        );
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const HSEConfiguration = lodash.cloneDeep(this.state.HSEConfiguration);
      Object.keys(validationErrors).forEach((key) => {
        validationErrors[key] = "";
      });
      this.setState({
        modHSEConfiguration: HSEConfiguration,
        modAssociations: HSEConfiguration.Questions
          ? this.getAssociationsFromXMLString(HSEConfiguration.Questions)
          : [],
        validationErrors,
        fileSelectorValue: "",
      });
    } catch (error) {
      console.log(
        "HSEConfigurationDetailsComposite: Error occurred on handleSave",
        error
      );
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    if(this.props.transportationType === Constants.TransportationType.RAIL)
      return fnRailHSEConfiguration;                   
    else  if(this.props.transportationType === Constants.TransportationType.MARINE)
      return fnMarineHSEConfiguration;
    else  if(this.props.transportationType === Constants.TransportationType.PIPELINE)
      return fnPipelineHSEConfiguration
    else  
      return fnRoadHSEConfiguration;
   };
   
  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            newEntityName={"HSE_Configuration_" + this.props.transportationType}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <HSEConfigurationDetails
            HSEConfiguration={this.state.HSEConfiguration}
            modHSEConfiguration={this.state.modHSEConfiguration}
            modAssociations={this.state.modAssociations}
            validationErrors={this.state.validationErrors}
            listOptions={{
              TransactionType: this.state.transactionTypeOptions,
              TransportationUnit: this.state.transportationUnitOptions,
              TransportationUnitType: this.state.transportationUnitTypeOptions,
              LocationTypeCode: this.state.locationTypeOptions,
            }}
            downloadTemplate={this.downloadTemplate}
            uploadToPreview={this.uploadToPreview}
            onFieldChange={this.handleChange}
            isNewHSEConfiguration={this.state.isNewHSEConfiguration}
            transportationType={this.props.transportationType}
            fileSelectorValue={this.state.fileSelectorValue}
          ></HSEConfigurationDetails>
        </ErrorBoundary>

        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>

        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.isNewHSEConfiguration === true
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={this.getFunctionGroupName()}
            handleOperation={this.saveHSEConfig}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
        </ErrorBoundary>
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

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HSEConfigurationDetailsComposite);

HSEConfigurationDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  selectedTerminal: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
