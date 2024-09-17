import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ProcessConfigDetails } from "../../UIBase/Details/ProcessConfigDetails";
import { emptyProcessConfigInfo } from "../../../JS/DefaultEntities";
import { processConfigValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import { connect } from "react-redux";
import * as KeyCodes from "../../../JS/KeyCodes";
import PropTypes from "prop-types";
import lodash from "lodash";
import { functionGroups, fnProcessConfiguration } from "../../../JS/FunctionGroups";
import * as Constants from "../../../JS/Constants";
import { processConfigAttributeEntity } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ProcessConfigDetailsComposite extends Component {
  state = {
    processConfig: lodash.cloneDeep(emptyProcessConfigInfo),
    modProcessConfig: {},
    validationErrors: Utilities.getInitialValidationErrors(
      processConfigValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    workFlowTypeOptions: [],
    deviceTypeOptions: [],
    deviceCodeOptions: [],
    availableDevices: [],
    associatedDevices: [],
    selectedAvailableDevices: [],
    selectedAssociatedDevices: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    isMultidrop: false,
    tempProcessConfig: {},
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
      this.getWorkFlowType();
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.processConfig.ProcessName !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAttributes(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getProcessConfig(processConfigRow) {
    if (processConfigRow.ProcessConfig_ProcessName === undefined) {
      this.setState({
        processConfig: lodash.cloneDeep(emptyProcessConfigInfo),
        modProcessConfig: lodash.cloneDeep(emptyProcessConfigInfo),
        isReadyToRender: true,
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnProcessConfiguration
        ),
        availableDevices: [],
        associatedDevices: [],
        selectedAvailableDevices: [],
        selectedAssociatedDevices: [],
        modAttributeMetaDataList: [],
      }, () => {
        this.localNodeAttribute();
      })
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.ProcessName,
        value: processConfigRow.ProcessConfig_ProcessName,
      }];
    var obj = {
      keyDataCode: KeyCodes.ProcessName,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetProcessConfiguration,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          result.EntityResult.PrimaryDeviceType = Object.keys(Constants.deviceTypeCode).find(
            (key) => Constants.deviceTypeCode[key] === result.EntityResult.PrimaryDeviceType
          );
          this.setState(
            {
              isReadyToRender: true,
              processConfig: lodash.cloneDeep(result.EntityResult),
              modProcessConfig: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnProcessConfiguration
              )
            }, () => {
              this.getProcessConfigDeviceType(result.EntityResult.WorkFlowType);
              this.getProcessConfigDeviceCodes(result.EntityResult.WorkFlowType, result.EntityResult.PrimaryDeviceType);
              this.getMultiDropDevices(result.EntityResult.PrimaryDeviceType, result.EntityResult.PrimaryDeviceCode);
              this.localNodeAttribute();
            });
        } else {
          this.setState({
            processConfig: lodash.cloneDeep(emptyProcessConfigInfo),
            modProcessConfig: lodash.cloneDeep(emptyProcessConfigInfo),
            isReadyToRender: true,
          });
          console.log("Error in getProcessConfig:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getProcessConfig:", error, processConfigRow);
      });
  }

  getAttributes(processConfigRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [processConfigAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.PROCESSCONFIG
              ),
            },
            () => this.getProcessConfig(processConfigRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.PROCESSCONFIG) && attributeMetaDataList.PROCESSCONFIG.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.PROCESSCONFIG[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on localNodeAttribute", error);
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var modAttributeMetaDataList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        modAttributeMetaDataList = lodash.cloneDeep(
          this.state.modAttributeMetaDataList
        );
        const attributeValidationErrors = lodash.cloneDeep(
          this.state.attributeValidationErrors
        );
        var modProcessConfig = lodash.cloneDeep(this.state.modProcessConfig);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.PROCESSCONFIG.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                if (modProcessConfig.Attributes !== null) {
                  var Attributevalue = modProcessConfig.Attributes.find(
                    (baseproductAttribute) => {
                      return baseproductAttribute.TerminalCode === terminal;
                    }
                  );
                }
                if (Attributevalue !== undefined) {
                  attributeMetaData.attributeMetaDataList.forEach(function (
                    attributeMetaData
                  ) {
                    var valueAttribute = Attributevalue.ListOfAttributeData.find(
                      (x) => {
                        return x.AttributeCode === attributeMetaData.Code;
                      }
                    );
                    if (valueAttribute !== undefined)
                      attributeMetaData.DefaultValue =
                        valueAttribute.AttributeValue;
                  });
                }
                attributesTerminalsList.push(attributeMetaData);
              }
            });
          } else {
            attributesTerminalsList.push(existitem);
          }
        });
        modAttributeMetaDataList = [];
        modAttributeMetaDataList = attributesTerminalsList;
        modAttributeMetaDataList = Utilities.attributesConvertoDecimal(
          modAttributeMetaDataList
        );
        attributeValidationErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(attributeValidation.attributeValidationErrors).forEach(
              (key) => (attributeValidation.attributeValidationErrors[key] = "")
            );
          }
        });
        this.setState({ modAttributeMetaDataList, attributeValidationErrors });
      }
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  getWorkFlowType() {
    axios(
      RestAPIs.GetWorkflowTypes,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let workFlowTypeOptions = [];
          if (result.EntityResult !== null && result.EntityResult.Table !== null && Array.isArray(result.EntityResult.Table)) {
            result.EntityResult.Table.forEach((element) => {
              workFlowTypeOptions.push({
                text: element.WorkflowCode,
                value: element.WorkflowCode,
              });
            });
            this.setState({ workFlowTypeOptions });
          }
        } else {
          console.log("Error in getWorkFlowType:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getWorkFlowType:", error);
      });
  }

  getProcessConfigDeviceType(workFlowType) {
    axios(
      RestAPIs.GetProcessConfigDeviceType +
      "?workflowTypeCode=" + workFlowType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let deviceTypeOptions = [];
          if (result.EntityResult !== null && result.EntityResult.Table !== null && Array.isArray(result.EntityResult.Table)) {
            result.EntityResult.Table.forEach((element) => {
              deviceTypeOptions.push({
                text: element.Code,
                value: element.Code,
              });
            });
            this.setState({ deviceTypeOptions });
          }
        } else {
          console.log("Error in getProcessConfigDeviceType:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getProcessConfigDeviceType:", error);
      });
  }

  getProcessConfigDeviceCodes(workFlowType, deviceType) {
    axios(
      RestAPIs.GetProcessConfigDeviceCodes +
      "?workflowType=" + workFlowType + "&deviceType=" + deviceType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null && Array.isArray(result.EntityResult)) {
            let deviceCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ deviceCodeOptions });
          }
        } else {
          console.log("Error in getProcessConfigDeviceCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getProcessConfigDeviceCodes:", error);
      });
  }

  getMultiDropDevices(deviceType, deviceCode) {
    const modProcessConfig = lodash.cloneDeep(this.state.modProcessConfig);
    const processConfig = lodash.cloneDeep(this.state.processConfig);
    axios(
      RestAPIs.GetMultiDropDevices +
      "?deviceType=" + deviceType + "&deviceCode=" + deviceCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let availableDevices = [];
          let associatedDevices = [];
          var isMultidrop = false;
          if (result.EntityResult !== null) {
            if((this.state.modProcessConfig.WorkFlowType === "EntryGate"
              || this.state.modProcessConfig.WorkFlowType === "ExitGate")
              && deviceType === "CARD_READER") {
               availableDevices = result.EntityResult.Table1;
              associatedDevices = [];
              }
            else if (processConfig.ProcessName !== "" && result.EntityResult.Table2[0].IsMultiDrop === "1"){
              let AllDevices = result.EntityResult.Table;
              AllDevices.forEach((obj) => {
                let matchedDevices = modProcessConfig.AssociatedDevices.filter((modDevice) => { return (modDevice.DeviceCode === obj.DeviceCode); });
                if (matchedDevices.length > 0) {
                  associatedDevices.push(obj);
                }
                else {
                  availableDevices.push(obj);
                }
              })
            }
            else {
               availableDevices = result.EntityResult.Table1;
                associatedDevices = result.EntityResult.Table;
            }
             isMultidrop = result.EntityResult.Table2[0].IsMultiDrop === "1" ? true : false;
            this.setState({ availableDevices, associatedDevices, isMultidrop });
          }
        } else {
          console.log("Error in getMultiDropDevices:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getMultiDropDevices:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modProcessConfig = lodash.cloneDeep(this.state.modProcessConfig);
      modProcessConfig[propertyName] = data;
      this.setState({ modProcessConfig }, () => {
        if (propertyName === "WorkFlowType") {
          this.handleWorkFlowTypeChange(data);
        }
        else if (propertyName === "PrimaryDeviceType") {
          this.handePrimaryDeviceTypeChanges(modProcessConfig.WorkFlowType, data);
        }
        else if (propertyName === "PrimaryDeviceCode") {
          this.getMultiDropDevices(modProcessConfig.PrimaryDeviceType, data);
        }
      });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (processConfigValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          processConfigValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleWorkFlowTypeChange(workFlowType) {
    try {
      const modProcessConfig = lodash.cloneDeep(this.state.modProcessConfig);
      modProcessConfig["PrimaryDeviceType"] = "";
      modProcessConfig["PrimaryDeviceCode"] = "";
      this.setState({ modProcessConfig, deviceCodeOptions: [], availableDevices: [], associatedDevices: [] });
      this.getProcessConfigDeviceType(workFlowType);
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on handleWorkFlowTypeChange", error);
    }
  }

  handePrimaryDeviceTypeChanges(workFlowType, deviceType) {
    try {
      const modProcessConfig = lodash.cloneDeep(this.state.modProcessConfig);
      modProcessConfig["PrimaryDeviceCode"] = "";
      this.setState({ modProcessConfig, availableDevices: [], associatedDevices: [] });
      this.getProcessConfigDeviceCodes(workFlowType, deviceType,);
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on handePrimaryDeviceTypeChanges", error);
    }
  }

  handleActiveStatusChange = (value) => {
    try {
      let modProcessConfig = lodash.cloneDeep(this.state.modProcessConfig);
      modProcessConfig.Active = value;
      if (modProcessConfig.Active !== this.state.processConfig.Active)
        modProcessConfig.Remarks = "";
      this.setState({ modProcessConfig });
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on handleActiveStatusChange", error);
    }
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const processConfig = lodash.cloneDeep(this.state.processConfig);

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modProcessConfig: { ...processConfig },
          selectedCompRow: [],
          validationErrors,
          availableDevices: [],
          associatedDevices: [],
          selectedAvailableDevices: [],
          selectedAssociatedDevices: [],
          modAttributeMetaDataList: [],
        }, () => {
          this.localNodeAttribute();
          this.handleResetAttributeValidationError();
        });
      if (processConfig.ProcessName === "") {
        this.setState({ deviceCodeOptions: [], deviceTypeOptions: [] })
      }
      else {
        this.getProcessConfigDeviceType(processConfig.WorkFlowType);
        this.getProcessConfigDeviceCodes(processConfig.WorkFlowType, processConfig.PrimaryDeviceType,);
        this.getMultiDropDevices(processConfig.PrimaryDeviceType, processConfig.PrimaryDeviceCode);
      }
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on handleReset", error);
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
          attributeMetaDataList.PROCESSCONFIG
        ),
      });
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  saveProcessConfig = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempProcessConfig = lodash.cloneDeep(this.state.tempProcessConfig);

      this.state.processConfig.ProcessName === ""
          ? this.createProcessConfig(tempProcessConfig)
          : this.updateProcessConfig(tempProcessConfig);

    } catch (error) {
      console.log("SaveProcessConfig Composite : Error in saveProcessConfig");
    }
  };

  handleSave = () => {
    try {
      
      let modProcessConfig = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(this.state.modAttributeMetaDataList);
      if (this.validateSave(modProcessConfig, attributeList)) {
        attributeList = Utilities.attributesDatatypeConversion(attributeList);
        modProcessConfig.Attributes = Utilities.fillAttributeDetails(attributeList);
     

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempProcessConfig = lodash.cloneDeep(modProcessConfig);
      this.setState({ showAuthenticationLayout, tempProcessConfig }, () => {
        if (showAuthenticationLayout === false) {
          this.saveProcessConfig();
        }
    });


      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on handleSave", error);
    }
  }

  fillDetails() {
    try {
      let modProcessConfig = lodash.cloneDeep(this.state.modProcessConfig);
      let associatedDevices = lodash.cloneDeep(this.state.associatedDevices);
      modProcessConfig.AssociatedDevices = [];
      associatedDevices.forEach((obj) => {
        var devices = {
          DeviceCode: obj.DeviceCode,
          DeviceType: modProcessConfig.PrimaryDeviceType
        }
        modProcessConfig.AssociatedDevices.push(devices);
      })
      return modProcessConfig;
    }
    catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on fillDetails", error);
    }
  }

  validateSave(modProcessConfig, attributeList) {
    try {
      const validationErrors = { ...this.state.validationErrors };
      Object.keys(processConfigValidationDef).forEach(function (key) {
        if (modProcessConfig[key] !== undefined)
          validationErrors[key] = Utilities.validateField(
            processConfigValidationDef[key],
            modProcessConfig[key]
          );
      });

      if (modProcessConfig.Active !== this.state.processConfig.Active) {
        if (modProcessConfig.Remarks === null || modProcessConfig.Remarks === "") {
          validationErrors["Remarks"] = "BaseProductInfo_EnterRemarks";
        }
      }

      var attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );
      attributeList.forEach((attribute) => {
        attributeValidationErrors.forEach((attributeValidation) => {
          if (attributeValidation.TerminalCode === attribute.TerminalCode) {
            attribute.attributeMetaDataList.forEach((attributeMetaData) => {
              attributeValidation.attributeValidationErrors[
                attributeMetaData.Code
              ] = Utilities.valiateAttributeField(
                attributeMetaData,
                attributeMetaData.DefaultValue
              );
            });
          }
        });
      });

      this.setState({ validationErrors, attributeValidationErrors });

      var returnValue = true;
      attributeValidationErrors.forEach((x) => {
        if (returnValue) {
          returnValue = Object.values(x.attributeValidationErrors).every(
            function (value) {
              return value === "";
            }
          );
        } else {
          return returnValue;
        }
      });

      if (returnValue)
        returnValue = Object.values(validationErrors).every(function (value) {
          return value === "";
        });

      return returnValue;
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on validateSave", error);
    }
  }

  createProcessConfig(modProcessConfig) {
    this.handleAuthenticationClose();
    let keyCode = [
      {
        key: KeyCodes.ProcessName,
        value: modProcessConfig.ProcessName,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.ProcessName,
      KeyCodes: keyCode,
      Entity: modProcessConfig,
    };

    let notification = {
      messageType: "critical",
      message: "ExeConfiguration_AddUpdateStatus",
      messageResultDetails: [
        {
          keyFields: ["ExeConfiguration_ExeName"],
          keyValues: [modProcessConfig.ProcessName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateProcessConfiguration,
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
                fnProcessConfiguration
              ),
            },
            () => this.getProcessConfig({ ProcessConfig_ProcessName: modProcessConfig.ProcessName })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnProcessConfiguration
            ),
          });
          console.log("Error in create ProcessConfig:", result.ErrorList);
        }
        this.props.onSaved(this.state.modProcessConfig, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnProcessConfiguration
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modProcessConfig, "add", notification);
      });
  }

  updateProcessConfig(modProcessConfig) {
    this.handleAuthenticationClose();
    let keyCode = [
      {
        key: KeyCodes.ProcessName,
        value: modProcessConfig.ProcessName,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.ProcessName,
      KeyCodes: keyCode,
      Entity: modProcessConfig,
    };

    let notification = {
      messageType: "critical",
      message: "ExeConfiguration_AddUpdateStatus",
      messageResultDetails: [
        {
          keyFields: ["ExeConfiguration_ExeName"],
          keyValues: [modProcessConfig.ProcessName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateProcessConfiguration,
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
                fnProcessConfiguration
              ),
            },
            () => this.getProcessConfig({ ProcessConfig_ProcessName: modProcessConfig.ProcessName })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnProcessConfiguration
            ),
          });
          console.log("Error in update ProcessConfig:", result.ErrorList);
        }
        this.props.onSaved(this.state.modProcessConfig, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnProcessConfiguration
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modProcessConfig, "modify", notification);
      });
  }

  handleAvailableDeviceSelection = (e) => {
    this.setState({ selectedAvailableDevices: e });
  }

  handleAssociatedDeviceSelection = (e) => {
    this.setState({ selectedAssociatedDevices: e });
  }

  handleDeviceAssociation = () => {
    try {
      this.setState({ isReadyToRender: false }, () => {
        const selectedAvailableDevices = lodash.cloneDeep(this.state.selectedAvailableDevices);
        let availableDevices = lodash.cloneDeep(this.state.availableDevices);
        let associatedDevices = lodash.cloneDeep(this.state.associatedDevices);
        selectedAvailableDevices.forEach((obj) => {
          associatedDevices.push(obj);
          availableDevices = availableDevices.filter(
            (com) => {
              return (com.DeviceCode !== obj.DeviceCode);
            });
        })
        this.setState({ associatedDevices, selectedAvailableDevices: [], availableDevices, isReadyToRender: true })
      })
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on handleDeviceAssociation", error);
    }
  }

  handleDeviceDisassociation = () => {
    try {
      this.setState({ isReadyToRender: false }, () => {
        const selectedAssociatedDevices = lodash.cloneDeep(this.state.selectedAssociatedDevices);
        let availableDevices = lodash.cloneDeep(this.state.availableDevices);
        let associatedDevices = lodash.cloneDeep(this.state.associatedDevices);
        selectedAssociatedDevices.forEach((obj) => {
          availableDevices.push(obj);
          associatedDevices = associatedDevices.filter(
            (com) => {
              return (com.DeviceCode !== obj.DeviceCode);
            });
        })
        this.setState({ associatedDevices, selectedAssociatedDevices: [], availableDevices, isReadyToRender: true })
      })
    } catch (error) {
      console.log("ProcessConfigDetailsComposite:Error occured on handleDeviceAssociation", error);
    }
  }


  handleAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modAttributeMetaDataList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );
      let matchedAttributesList = modAttributeMetaDataList.filter(
        (modattribute) => modattribute.TerminalCode === attribute.TerminalCode
      );
      if (
        matchedAttributesList.length > 0 &&
        Array.isArray(matchedAttributesList[0].attributeMetaDataList)
      ) {
        matchedAttributes =
          matchedAttributesList[0].attributeMetaDataList.filter(
            (modattribute) => modattribute.Code === attribute.Code
          );
      }
      if (matchedAttributes.length > 0) {
        matchedAttributes[0].DefaultValue = value;
      }
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on handleAttributeDataChange",
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
    const listOptions = {
      workFlowTypeOptions: this.state.workFlowTypeOptions,
      deviceTypeOptions: this.state.deviceTypeOptions,
      deviceCodeOptions: this.state.deviceCodeOptions,
      availableDevices: this.state.availableDevices,
      associatedDevices: this.state.associatedDevices,
      selectedAvailableDevices: this.state.selectedAvailableDevices,
      selectedAssociatedDevices: this.state.selectedAssociatedDevices
    }
    const popUpContents = [
      {
        fieldName: "ProcessConfig_LastUpdatedTime",
        fieldValue:
          new Date(
            this.state.modProcessConfig.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modProcessConfig.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "ProcessConfig_CreatedTime",
        fieldValue:
          new Date(this.state.modProcessConfig.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modProcessConfig.CreatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "ProcessConfig_LastActiveTime",
        fieldValue: this.state.modProcessConfig.LastActiveTime !== undefined &&
          this.state.modProcessConfig.LastActiveTime !== null
          ?
          new Date(this.state.modProcessConfig.LastActiveTime).toLocaleDateString() +
          " " +
          new Date(this.state.modProcessConfig.LastActiveTime).toLocaleTimeString() : "",
      }
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.processConfig.ProcessName}
            newEntityName={"ExeConfiguration_Title"}
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>

        <ErrorBoundary>
          <ProcessConfigDetails
            processConfig={this.state.processConfig}
            modProcessConfig={this.state.modProcessConfig}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            pageSize={this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize}
            onAvailableDeviceSelection={this.handleAvailableDeviceSelection}
            onAssociatedDeviceSelection={this.handleAssociatedDeviceSelection}
            onDeviceAssociation={this.handleDeviceAssociation}
            onDeviceDisassociation={this.handleDeviceDisassociation}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
            isMultidrop={this.state.isMultidrop}
          >
          </ProcessConfigDetails>
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
              this.state.processConfig.ProcessName === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnProcessConfiguration}
            handleOperation={this.saveProcessConfig}
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

export default connect(mapStateToProps)(ProcessConfigDetailsComposite);

ProcessConfigDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};