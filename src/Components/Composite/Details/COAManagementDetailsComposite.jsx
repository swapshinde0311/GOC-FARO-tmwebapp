import React, { Component } from "react";
import { COAManagementDetails } from "../../UIBase/Details/COAManagementDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { coamanagementValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyCOATankManagement } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCOAManagement } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { coaManagementAttributeEntity } from "../../../JS/AttributeEntity";
import { Button, Modal, FileDrop } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import * as Constants from "../../../JS/Constants";
import ReportDetails from "../../UIBase/Details/ReportDetails";

class COAManagementDetailsComposite extends Component {
  state = {
    coaManagement: lodash.cloneDeep(emptyCOATankManagement),
    modCOAManagement: lodash.cloneDeep(emptyCOATankManagement),
    validationErrors: Utilities.getInitialValidationErrors(
      coamanagementValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    showAuthenticationLayout: false,
    tempCOAManagement: {},
    managementTankCodes: [],
    managementTemplateCodes: [],
    initialTemplateParameters: [],
    templateParameters: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    showReport: false,
  };
  terminalSelectionChange(selectedTerminals) {
    try {
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
      var modCOAManagement = lodash.cloneDeep(this.state.modCOAManagement);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.COAMANAGEMENT.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modCOAManagement.Attributes.find(
                (coaManagementAttribute) => {
                  return coaManagementAttribute.TerminalCode === terminal;
                }
              );
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
    } catch (error) {
      console.log(
        "coaManagementDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList.COAMANAGEMENT) &&
        attributeMetaDataList.COAMANAGEMENT.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.COAMANAGEMENT[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "COAMANAGEMENTDetailsComposite:Error occured on localNodeAttribute",
        error
      );
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
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleAttributeDataChange",
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
            attributeMetaDataList.COAMANAGEMENT
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  GetTemplateFromTank() {
    try {
      axios(
        RestAPIs.GetTemplateFromTank,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var list = result.EntityResult;
            var tempManagementCodes = [];
            list.forEach((item) => {
              tempManagementCodes.push(item.Code);
            });
            this.setState({
              managementFromManagement: tempManagementCodes,
            });
          } else {
            console.log(
              "Error in getmanagementFromManagement:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting Management FromManagement List:",
            error
          );
        });
    } catch (error) {
      console.log("Error while getting Management FromManagement List:", error);
    }
  }

  getManagementTankCodes() {
    try {
      axios(
        RestAPIs.GetTanks + "?ShareholderCode=",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult)
            ) {
              var list = result.EntityResult;
              var tempTankCodes = [];
              list.forEach((item) => {
                tempTankCodes.push(item);
              });
              this.setState({
                managementTankCodes: tempTankCodes,
              });
            }
          } else {
            console.log("Error in getManagementTankCodes:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Management TankCode List:", error);
        });
    } catch (error) {
      console.log("Error while getting Management TankCode List:", error);
    }
  }

  handleTankCodeChange = (data) => {
    try {
      const modCOAManagement = lodash.cloneDeep(this.state.modCOAManagement);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOAManagement["TankCode"] = data;
      this.setState({ modCOAManagement });
      if (coamanagementValidationDef["TankCode"] !== undefined) {
        validationErrors["TankCode"] = Utilities.validateField(
          coamanagementValidationDef["TankCode"],
          data
        );
        this.setState({ validationErrors });
      }

      if (validationErrors["TankCode"] != "") {
        return;
      }

      axios(
        RestAPIs.GetCOAManagementInfoFromTank + "?TankCode=" + data,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var entity = result.EntityResult;
            modCOAManagement.BaseProductCode = entity.BaseProductCode;
            modCOAManagement.BaseProductName = entity.BaseProductName;
            var tempTemplateCodes = entity.COATemplateCodes;
            this.setState({
              modCOAManagement,
              managementTemplateCodes: tempTemplateCodes,
            });
          } else {
            console.log(
              "Error in GetCOAManagementInfoFromTank:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log("Error while GetCOAManagementInfoFromTank:", error);
        });
    } catch (error) {
      console.log("Error while handleTankCodeChange:", error);
    }
  };

  handleTemplateCodeChange = (data) => {
    try {
      const modCOAManagement = lodash.cloneDeep(this.state.modCOAManagement);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOAManagement["TemplateCode"] = data;
      this.setState({ modCOAManagement });
      if (coamanagementValidationDef["TemplateCode"] !== undefined) {
        validationErrors["TemplateCode"] = Utilities.validateField(
          coamanagementValidationDef["TemplateCode"],
          data
        );
        this.setState({ validationErrors });
      }

      if (validationErrors["TemplateCode"] != "") {
        return;
      }

      var keyCode = [
        {
          key: KeyCodes.coaTemplateCode,
          value: data,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.coaTemplateCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.GetCOATemplateForManagement,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ isReadyToRender: false }, () => {
              let details = result.EntityResult.COATemplateDetailsList;
              var showParameters = [];
              details.forEach((obj) => {
                var tempObj = {
                  ParameterName: obj.ParameterName,
                  Specification: obj.Specification,
                  Method: obj.Method,
                  SortIndex: obj.SortIndex,
                };
                showParameters.push(tempObj);
              });
              this.setState({
                templateParameters: showParameters,
                initialTemplateParameters: showParameters,
                isReadyToRender: true,
              });
            });
          } else {
            this.setState(
              {
                templateParameters: [],
                initialTemplateParameters: [],
                isReadyToRender: true,
              },
              () => {}
            );
            console.log(
              "Error in GetCOATemplateForManagement:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log("Error while GetCOATemplateForManagement:", error, data);
        });
    } catch (error) {
      console.log("Error while handleTemplateCodeChange:", error);
    }
  };

  handleChange = (propertyName, data) => {
    try {
      const modCOAManagement = lodash.cloneDeep(this.state.modCOAManagement);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOAManagement[propertyName] = data;
      this.setState({ modCOAManagement });
      if (coamanagementValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          coamanagementValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "COAManagementDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.coaManagement.COACode !== "" &&
        nextProps.selectedRow.COACode === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCOAManagement(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "COAManagementDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
      //this.getCOAManagement(this.props.selectedRow);
      this.getManagementTankCodes();
    } catch (error) {
      console.log(
        "COAManagementDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(coaManagementRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [coaManagementAttributeEntity],
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
                  result.EntityResult.COAMANAGEMENT
                ),
            },
            () => this.getCOAManagement(coaManagementRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getCOAManagement(selectedRow) {
    if (selectedRow.COACode === undefined) {
      this.setState(
        {
          coaManagement: lodash.cloneDeep(emptyCOATankManagement),
          modCOAManagement: lodash.cloneDeep(emptyCOATankManagement),
          templateParameters: [],
          //listOptions,
          isReadyToRender: false,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCOAManagement
          ),
          modAttributeMetaDataList: [],
        },
        () => {
          this.setState({ isReadyToRender: true });
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.coaManagementCode,
        value: selectedRow.COACode,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.coaManagementCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetCOAManagement,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let details =result.EntityResult.COAManagementDetailsList;
          var AvailableManagementParameters = [];
          details.forEach((obj) => {
            var tempObj = {
              ParameterName:
                obj.ParameterName === undefined
                  ? obj.AnalysisParameterName
                  : obj.ParameterName,
              Specification: obj.Specification,
              Method: obj.Method,
              SortIndex: obj.SortIndex,
              Result: obj.Result,
            };
            AvailableManagementParameters.push(tempObj);
          });

          this.setState(
            {
              isReadyToRender: true,
              coaManagement: lodash.cloneDeep(result.EntityResult),
              modCOAManagement: lodash.cloneDeep(result.EntityResult),
              initialTemplateParameters: AvailableManagementParameters,
              templateParameters: AvailableManagementParameters,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCOAManagement
              ),
            },
            () => {
              this.localNodeAttribute();
            }
          );
          //this.InitialAvailibleParameters(this.state.coaManagement.COAManagementCode);
        } else {
          this.setState(
            {
              coaManagement: lodash.cloneDeep(emptyCOATankManagement),
              modCOAManagement: lodash.cloneDeep(emptyCOATankManagement),
              isReadyToRender: true,
            },
            () => {}
          );
          console.log("Error in getCOAManagement:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting coaManagement:", error, selectedRow);
      });
  }

  validateSave(attributeList) {
    const { modCOAManagement } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(coamanagementValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        coamanagementValidationDef[key],
        modCOAManagement[key]
      );
    });

    this.setState({ validationErrors });

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
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  saveCOAManagement = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempCOAManagement = lodash.cloneDeep(this.state.tempCOAManagement);
      let availableTems = lodash.cloneDeep(this.state.templateParameters);

      tempCOAManagement.COAManagementDetailsList = [];
      availableTems.forEach((obj) => {
        var singleManagement = {
          ParameterName: obj.ParameterName,
          Specification: obj.Specification,
          Method: obj.Method,
          SortIndex: obj.SortIndex,
          Result: obj.Result,
          AnalysisParameterName: obj.ParameterName,
        };
        tempCOAManagement.COAManagementDetailsList.push(singleManagement);
      });
      tempCOAManagement.COATypeSortIndex = 1;
      tempCOAManagement.COAType = "GNS";
      tempCOAManagement.MFDTime = new Date();
      if (
        tempCOAManagement.Remarks === null ||
        tempCOAManagement.Remarks === undefined
      ) {
        tempCOAManagement.Remarks = "";
      }
      if (
        tempCOAManagement.TransactionCode === null ||
        tempCOAManagement.TransactionCode === undefined
      ) {
        tempCOAManagement.TransactionCode = "";
      }

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      tempCOAManagement.Attributes =
        Utilities.fillAttributeDetails(attributeList);
      this.state.coaManagement.COACode === ""
        ? this.createCOAManagement(tempCOAManagement)
        : this.updateCOAManagement(tempCOAManagement);
    } catch (error) {
      console.log("COAManagementDetailsComposite : Error in saveCOAManagement");
    }
  };
  handleSave = () => {
    try {
      let modCOAManagement = lodash.cloneDeep(this.state.modCOAManagement);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(attributeList)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempCOAManagement = lodash.cloneDeep(modCOAManagement);
        this.setState({ showAuthenticationLayout, tempCOAManagement }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCOAManagement();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "COAManagementDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  createCOAManagement(modCOAManagement) {
    var keyCode = [
      {
        key: KeyCodes.coaManagementCode,
        value: modCOAManagement.COACode,
      },
    ];
    modCOAManagement.COAManagementDetailsList =
      modCOAManagement.COAManagementDetailsList;
    var obj = {
      keyDataCode: KeyCodes.coaManagementCode,
      KeyCodes: keyCode,
      Entity: modCOAManagement,
    };
    var notification = {
      messageType: "critical",
      message: "COAManagementDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["COACode"],
          keyValues: [modCOAManagement.COACode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateCOAManagement,
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
                fnCOAManagement
              ),
              showAuthenticationLayout: false,
              modCOAManagement,
            },
            () => this.getCOAManagement({ COACode: modCOAManagement.COACode })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCOAManagement
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createCOAManagement:", result.ErrorList);
        }
        this.props.onSaved(modCOAManagement, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCOAManagement
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCOAManagement, "add", notification);
      });
  }

  updateCOAManagement(modCOAManagement) {
    let keyCode = [
      {
        key: KeyCodes.coaManagementCode,
        value: modCOAManagement.COACode,
      },
    ];

    if (modCOAManagement.FinishedProductCode == null) {
      modCOAManagement.FinishedProductCode = "";
    }
    let obj = {
      keyDataCode: KeyCodes.coaManagementCode,
      KeyCodes: keyCode,
      Entity: modCOAManagement,
    };

    let notification = {
      messageType: "critical",
      message: "COAManagementDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["COACode"],
          keyValues: [modCOAManagement.COACode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateCOAManagement,
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
                fnCOAManagement
              ),
              showAuthenticationLayout: false,
            },
            () => this.getCOAManagement({ COACode: modCOAManagement.COACode })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCOAManagement
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in updateCOAManagement:", result.ErrorList);
        }
        this.props.onSaved(modCOAManagement, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCOAManagement, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnCOAManagement
          ),
          showAuthenticationLayout: false,
        });
      });
  }

  handleReset = () => {
    try {
      this.setState({ isReadyToRender: false }, () => {
        const validationErrors = { ...this.state.validationErrors };
        const coaManagement = lodash.cloneDeep(this.state.coaManagement);
        Object.keys(validationErrors).forEach(function (key) {
          validationErrors[key] = "";
        });
        this.setState(
          {
            availableManagements: [],
            associatedManagements: [],
            selectedAvailableManagements: [],
            selectedAssociatedManagements: [],
            modCOAManagement: { ...coaManagement },
            validationErrors,
            modAttributeMetaDataList: [],
            templateParameters:
              coaManagement.TemplateCode !== ""
                ? lodash.cloneDeep(this.state.initialTemplateParameters)
                : [],
            isReadyToRender: true,
          },
          () => {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.handleResetAttributeValidationError();
            } else {
              this.localNodeAttribute();
              this.handleResetAttributeValidationError();
            }
          }
        );
      });
    } catch (error) {
      console.log(
        "COAManagementDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let clonetemplateParameters = lodash.cloneDeep(
        this.state.templateParameters
      );
      var singleParameter = clonetemplateParameters.find(
        (ele) => ele.ParameterName == cellData.rowData.ParameterName
      );
      singleParameter[cellData.field] = newVal;

      this.setState({ templateParameters: clonetemplateParameters });
    } catch (error) {
      console.log(":Error occured on handleCellDataEdit", error);
    }
  };

  handleModalBack = () => {
    this.setState({ showReport: false });
  };

  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/BaseCOAReport";
    } else {
      path = "TM/" + Constants.TMReports + "/BaseCOAReport";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      COACode: this.state.modCOAManagement.COACode,
    };
    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleModalBack}
        handleModalClose={this.handleModalBack}
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }

  handleViewBaseCOAReport = () => {
    if (this.reportServiceURI === undefined) {
      axios(
        RestAPIs.GetReportServiceURI,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        if (response.data.IsSuccess) {
          this.reportServiceURI = response.data.EntityResult;
          this.setState({ showReport: true });
        }
      });
    } else {
      this.setState({ showReport: true });
    }
  };
  handleActiveStatusChange = (value) => {
    try {
      let modCOAManagement = lodash.cloneDeep(this.state.modCOAManagement);
      modCOAManagement.IsActive = value;
      this.setState({ modCOAManagement });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const listOptions = {
      managementTankCodes: this.state.managementTankCodes,
      managementTemplateCodes: this.state.managementTemplateCodes,
      templateParameters: this.state.templateParameters,
    };
    const popUpContents = [
      {
        fieldName: "COAManagement_LastUpDt",
        fieldValue:
          new Date(
            this.state.modCOAManagement.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modCOAManagement.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "COAManagement_LastUpdatedBy",
        fieldValue: this.state.modCOAManagement.LastUpdatedBy,
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.coaManagement.COACode}
            newEntityName="COAManagement_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>

        <ErrorBoundary>
          <COAManagementDetails
            coaManagement={this.state.coaManagement}
            modCOAManagement={this.state.modCOAManagement}
            genericProps={this.props.genericProps}
            validationErrors={this.state.validationErrors}
            //listOptions={this.state.listOptions}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onTankCodeChange={this.handleTankCodeChange}
            onTemplateCodeChange={this.handleTemplateCodeChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            pageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            handleCellDataEdit={this.handleCellDataEdit}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
          ></COAManagementDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row userActionPosition">
                <div className="col col-2">
                  <Button
                    className="backButton"
                    onClick={this.props.onBack}
                    content={t("Back")}
                  ></Button>
                </div>
                <div className="col col-10" style={{ textAlign: "right" }}>
                  {this.state.coaManagement.COACode === "" ? (
                    ""
                  ) : (
                    <Button
                      content={t("COAManagement_ViewBaseCOAReport")}
                      onClick={() => this.handleViewBaseCOAReport()}
                    ></Button>
                  )}
                  <Button
                    content={t("LookUpData_btnReset")}
                    className="cancelButton"
                    onClick={() => this.handleReset()}
                  ></Button>
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
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.coaManagement.COAManagementCode === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnCOAManagement}
            handleOperation={this.saveCOAManagement}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
        {this.renderModal()}
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

export default connect(mapStateToProps)(COAManagementDetailsComposite);

COAManagementDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
