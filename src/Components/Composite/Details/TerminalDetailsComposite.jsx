import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TerminalDetails } from "../../UIBase/Details/TerminalDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyTerminal } from "../../../JS/DefaultEntities";
import { terminalValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnTerminal } from "../../../JS/FunctionGroups";
import { terminalAttributeEntity } from "../../../JS/AttributeEntity";
import * as Constants from "../../../JS/Constants";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class TerminalDetailsComposite extends Component {
  state = {
    terminal: lodash.cloneDeep(emptyTerminal),
    modTerminal: {},
    modEnterpriseProcess: [],
    validationErrors: Utilities.getInitialValidationErrors(
      terminalValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    selectedEnterpriseProcess: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    isDCHEnabled: false,
    modDCHAttributes: [],
    dchAttribute: [],
    dchAttributeValidationErrors: {},
    externalSystemList: [],
    dchAttributeMetaDataList: [],
    showAuthenticationLayout: false,
    tempTerminal: {},
  };

  componentDidMount() {
    let terminal = this.props.selectedRow;
    try {
      //this.getEnterpriseProcess();

      terminal.Common_Code === undefined
        ? this.getTerminal(this.props.selectedRow)
        : this.getAttributes(this.props);
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.terminal.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getEnterpriseProcess();
        this.getTerminal(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  GetDCHAttributeInfoList() {
    try {
      let modTerminal = lodash.cloneDeep(this.state.modTerminal);
      let dcAttributeConfig = {
        Shareholdercode: this.props.userDetails.EntityResult.PrimaryShareholder,
        EntityCode: modTerminal.Code,
        EntityType: Constants.ExtendEntity.TERMINAL,
      };
      var obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.shareholderCode,
        Entity: dcAttributeConfig,
      };
      axios(
        RestAPIs.GetDCHAttributeInfoList,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ dchAttribute: result.EntityResult }, () => {
              this.getExternalSystemInfo();
            });
          } else {
            console.log("Error in GetDCHAttributeInfoList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting DCHAttributeInfoList:", error);
        });
    } catch (error) {
      console.log("Error while getting DCHAttributeInfoList:", error);
    }
  }

  getExternalSystemInfo() {
    try {
      axios(
        RestAPIs.GetExternalSystemInfo,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          let externalSystemList = [];
          Object.keys(result.EntityResult).forEach(function (key) {
            if (result.EntityResult[key] !== "NONE") {
              externalSystemList.push(result.EntityResult[key]);
            }
          });
          this.setState({ externalSystemList: externalSystemList }, () => {
            this.buildDCHAttributes();
          });
        } else {
          this.setState({ externalSystemList: [] });
        }
      });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on get ExternalSystemInfo List",
        error
      );
    }
  }

  buildDCHAttributes() {
    try {
      let dchAttributeMetaDataList = [];
      let externalSystemList = lodash.cloneDeep(this.state.externalSystemList);
      let modTerminal = lodash.cloneDeep(this.state.modTerminal);
      if (
        modTerminal.DCHAttributes != null &&
        modTerminal.DCHAttributes.length > 0
      ) {
        externalSystemList.forEach(function (externalSystem) {
          var att1 = {};
          att1.ExternalSystem = externalSystem;
          let existitem = modTerminal.DCHAttributes.filter((data1) => {
            return data1.ExternalSystemName === externalSystem;
          });
          if (existitem !== null && existitem.length > 0) {
            existitem.forEach(function (attribute) {
              att1[attribute.EntityName] = attribute.Value;
            });
          }
          dchAttributeMetaDataList.push(att1);
        });
      } else {
        externalSystemList.forEach(function (externalSystem) {
          dchAttributeMetaDataList.push({ ExternalSystem: externalSystem });
        });
      }
      this.setState({ dchAttributeMetaDataList });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on buildDCHAttributes",
        error
      );
    }
  }

  getAttributes(props) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [terminalAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.terminal
                ),
            },
            () => this.getTerminal(this.props.selectedRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
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
        var modTerminal = lodash.cloneDeep(this.state.modTerminal);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.terminal.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modTerminal.Attributes.find(
                  (terminalAttribute) => {
                    return terminalAttribute.TerminalCode === terminal;
                  }
                );
                if (Attributevalue !== undefined) {
                  attributeMetaData.attributeMetaDataList.forEach(function (
                    attributeMetaData
                  ) {
                    var valueAttribute =
                      Attributevalue.ListOfAttributeData.find((x) => {
                        return x.AttributeCode === attributeMetaData.Code;
                      });
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
        "TerminalDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  getEnterpriseProcess() {
    try {
      let modTerminal = lodash.cloneDeep(this.state.modTerminal);
      axios(
        RestAPIs.GetTerminalEnterpriseProcesses,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isReadyToRender: true,
            modEnterpriseProcess: lodash.cloneDeep(result.EntityResult),
          });
        } else {
          this.setState({
            isReadyToRender: true,
            modEnterpriseProcess: [],
          });
        }

        if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
          if (modTerminal.Code === undefined || modTerminal.Code === "")
            this.setState({
              selectedEnterpriseProcess: lodash.cloneDeep(
                this.state.modEnterpriseProcess
              ),
            });

          if (modTerminal.EnterpriseProcesses.length > 0) {
            let selectedProcessData = [];
            modTerminal.EnterpriseProcesses.forEach((process) => {
              var processObj = this.state.modEnterpriseProcess.find(
                (allProcess) => {
                  return allProcess.ProcessName === process.ProcessName;
                }
              );
              selectedProcessData.push(processObj);
            });
            this.setState({ selectedEnterpriseProcess: selectedProcessData });
          }
        }
      });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error while getting getEnterpriseProcess"
      );
    }
  }
  getTerminal(terminalRow) {
    if (terminalRow.Common_Code === undefined) {
      this.setState(
        {
          terminal: lodash.cloneDeep(emptyTerminal),
          modTerminal: lodash.cloneDeep(emptyTerminal),
          // modEnterpriseProcess: [],
          selectedEnterpriseProcess: [],
          isReadyToRender: true,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTerminal
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsDCHEnabled) {
            this.GetDCHAttributeInfoList();
          }
          this.getEnterpriseProcess();
        }
      );
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.terminalCode,
        value: terminalRow.Common_Code,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.terminalCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetTerminal,
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
              terminal: lodash.cloneDeep(result.EntityResult),
              modTerminal: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnTerminal
              ),
            },
            () => {
              this.getEnterpriseProcess();
              if (this.props.userDetails.EntityResult.IsDCHEnabled)
                this.GetDCHAttributeInfoList();
              this.terminalSelectionChange([result.EntityResult.Code]);
            }
          );
        } else {
          this.setState(
            {
              terminal: lodash.cloneDeep(emptyTerminal),
              modTerminal: lodash.cloneDeep(emptyTerminal),
              isReadyToRender: true,
            },
            () => {
              if (this.props.userDetails.EntityResult.IsDCHEnabled)
                this.GetDCHAttributeInfoList();
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting Terminal:", error, terminalRow);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modTerminal = lodash.cloneDeep(this.state.modTerminal);
      modTerminal[propertyName] = data;
      this.setState({ modTerminal });
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (terminalValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          terminalValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const terminal = lodash.cloneDeep(this.state.terminal);
      const dchAttribute = lodash.cloneDeep(this.state.dchAttribute);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modTerminal: { ...terminal },
          selectedCompRow: [],
          validationErrors,
          dchAttributeValidationErrors: {},
          modDCHAttributes: { ...dchAttribute },
        },
        () => {
          this.terminalSelectionChange(this.state.modTerminal.Code);
          this.handleResetAttributeValidationError();
          if (this.props.userDetails.EntityResult.IsDCHEnabled)
            this.buildDCHAttributes();
        }
      );
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleDCHCellDataEdit = (newVal, cellData) => {
    try {
      let dchAttributeMetaDataList = lodash.cloneDeep(
        this.state.dchAttributeMetaDataList
      );
      dchAttributeMetaDataList[cellData.rowIndex][cellData.field] = newVal;
      this.setState({ dchAttributeMetaDataList });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleDCHCellDataEdit",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.driver
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }
  saveTerminal = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempTerminal = lodash.cloneDeep(this.state.tempTerminal);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      tempTerminal = this.fillAttributeDetails(tempTerminal, attributeList);
      this.state.terminal.Code === ""
        ? this.createTerminal(tempTerminal)
        : this.updateTerminal(tempTerminal);
    } catch (error) {
      console.log("TerminalDetailsComposite : Error in saveShareholder")
    }
  }
  handleSave = () => {
    try {
      // this.setState({ saveEnabled: false });
      let modTerminal = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(modTerminal, attributeList)) {
        let tempTerminal = lodash.cloneDeep(modTerminal);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout, tempTerminal }, () => {
          if (showAuthenticationLayout === false) {
            this.saveTerminal();
          }
        });
      } else this.setState({ saveEnabled: true });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  handleRowSelectionChange = (enterpriseRow) => {
    try {
      const modTerminal = lodash.cloneDeep(this.state.modTerminal);
      if (modTerminal.Code !== "") {
        this.setState({ selectedEnterpriseProcess: [] });
        this.setState({ selectedEnterpriseProcess: enterpriseRow });
      }
    } catch (err) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleRowSelectionChange"
      );
    }
  };

  fillDetails() {
    try {
      let modTerminal = lodash.cloneDeep(this.state.modTerminal);
      let selectedEnterpriseProcess = lodash.cloneDeep(
        this.state.selectedEnterpriseProcess
      );
      modTerminal.EnterpriseProcesses = selectedEnterpriseProcess;

      return modTerminal;
    } catch (err) {
      console.log("TerminalDetailsComposite:Error occured on filldetails", err);
    }
  }

  fillAttributeDetails(modTerminal, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modTerminal.Attributes = Utilities.fillAttributeDetails(attributeList);

      if (this.props.userDetails.EntityResult.IsDCHEnabled) {
        modTerminal.DCHAttributes = [];
        let dchAttributeMetaDataList = lodash.cloneDeep(
          this.state.dchAttributeMetaDataList
        );
        let externalSystemList = lodash.cloneDeep(
          this.state.externalSystemList
        );
        let dchAttribute = lodash.cloneDeep(this.state.dchAttribute);

        externalSystemList.forEach(function (externalSystem) {
          var existitem = dchAttributeMetaDataList.find((metaData) => {
            return metaData.ExternalSystem === externalSystem;
          });
          dchAttribute.forEach(function (attribute) {
            Object.keys(existitem).forEach(function (val) {
              if (val === attribute.EntityName) {
                modTerminal.DCHAttributes.push({
                  ExternalSystemName: externalSystem,
                  EntityName: attribute.EntityName,
                  Value: existitem[val],
                });
              }
            });
          });
        });
      }
      return modTerminal;
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  validateSave(modTerminal, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(terminalValidationDef).forEach(function (key) {
      if (modTerminal[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          terminalValidationDef[key],
          modTerminal[key]
        );
    });

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
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modEnterpriseProcess = lodash.cloneDeep(
        this.state.modEnterpriseProcess
      );
      modEnterpriseProcess[cellData.rowIndex][cellData.field] = newVal;
      this.setState({ modEnterpriseProcess });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };

  createTerminal(modTerminal) {
    let keyCode = [
      {
        key: KeyCodes.terminalCode,
        value: modTerminal.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.terminalCode,
      KeyCodes: keyCode,
      Entity: modTerminal,
    };

    let notification = {
      messageType: "critical",
      message: "Terminal_UpdateSuccess",
      messageResultDetails: [
        {
          keyFields: ["Terminal_Code"],
          keyValues: [modTerminal.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateTerminal,
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
                fnTerminal
              ),
              showAuthenticationLayout: false,
            },
            () => this.getTerminal({ Common_Code: modTerminal.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnTerminal
            ),
            showAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modTerminal, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTerminal
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTerminal, "add", notification);
      });
  }

  updateTerminal(modTerminal) {
    let keyCode = [
      {
        key: KeyCodes.terminalCode,
        value: modTerminal.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.terminalCode,
      KeyCodes: keyCode,
      Entity: modTerminal,
    };

    let notification = {
      messageType: "critical",
      message: "Terminal_UpdateSuccess",
      messageResultDetails: [
        {
          keyFields: ["Terminal_Code"],
          keyValues: [modTerminal.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateTerminal,
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
                fnTerminal
              ),
              showAuthenticationLayout: false,
            },
            () => this.getTerminal({ Common_Code: modTerminal.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTerminal
            ),
            showAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modTerminal, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnTerminal
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTerminal, "modify", notification);
      });
  }
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

 
  render() {
    const popUpContents = [
      {
        fieldName: "BaseProductInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modTerminal.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modTerminal.LastUpdatedTime).toLocaleTimeString(),
      },
      // {
      //     fieldName: "BaseProductInfo_LastActivatedTime",
      //     fieldValue:
      //         this.state.modTerminal.LastActiveTime !== undefined &&
      //             this.state.modTerminal.LastActiveTime !== null
      //             ? new Date(
      //                 this.state.modTerminal.LastActiveTime
      //             ).toLocaleDateString() +
      //             " " +
      //             new Date(this.state.modTerminal.LastActiveTime).toLocaleTimeString()
      //             : "",
      // },
      {
        fieldName: "BaseProductInfo_Created",
        fieldValue:
          new Date(this.state.modTerminal.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modTerminal.CreatedTime).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.terminal.Code}
            newEntityName="TerminalInfo_NewBaseProduct"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <TerminalDetails
            terminal={this.state.terminal}
            modTerminal={this.state.modTerminal}
            modEnterpriseProcess={this.state.modEnterpriseProcess}
            modDCHAttributes={this.state.modDCHAttributes}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            selectedEnterpriseProcess={this.state.selectedEnterpriseProcess}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            attributeMetaDataList={this.state.attributeMetaDataList}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            handleCellDataEdit={this.handleCellDataEdit}
            onAttributeDataChange={this.handleAttributeDataChange} 
            handleRowSelectionChange={this.handleRowSelectionChange}
            isDCHEnabled={this.props.userDetails.EntityResult.IsDCHEnabled}
            dchAttributeValidationErrors={
              this.state.dchAttributeValidationErrors
            }
            handleDCHCellDataEdit={this.handleDCHCellDataEdit}
            dchAttribute={this.state.dchAttribute}
            dchAttributeMetaDataList={this.state.dchAttributeMetaDataList}
          ></TerminalDetails>
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
              this.state.terminal.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnTerminal}
            handleOperation={this.saveTerminal}
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

export default connect(mapStateToProps)(TerminalDetailsComposite);
