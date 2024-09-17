import React, { Component } from "react";
import { COATemplateDetails } from "../../UIBase/Details/COATemplateDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { coatemplateValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyCOATemplate } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCOATemplate } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { coaTemplateAttributeEntity } from "../../../JS/AttributeEntity";

class COATemplateDetailsComposite extends Component {
  state = {
    coaTemplate: lodash.cloneDeep(emptyCOATemplate),
    modCOATemplate: {},
    validationErrors: Utilities.getInitialValidationErrors(
      coatemplateValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    showAuthenticationLayout: false,
    tempCOATemplate: {},
    templateTankCodes: [],
    templateBaseProductCodes: [],
    templateUseType: ["ALL", "TANK", "CUSTOMER"],
    templateFromTemplate: [],
    initavailableTemplates: [],
    availableTemplates: [],
    selectedAvailableTemplates: [],
    associatedTemplates: [],
    selectedAssociatedTemplates: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    allParameters: [],
  };

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList.COATEMPLATE) &&
        attributeMetaDataList.COATEMPLATE.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.COATEMPLATE[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "COATEMPLATEDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

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
      var modCOATemplate = lodash.cloneDeep(this.state.modCOATemplate);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.COATEMPLATE.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modCOATemplate.Attributes.find(
                (coaTemplateAttribute) => {
                  return coaTemplateAttribute.TerminalCode === terminal;
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
        "coaTemplateDetailsComposite:Error occured on terminalSelectionChange",
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
        attributeValidation.attributeValidationErrors[attribute.Code] =
          Utilities.valiateAttributeField(attribute, value);
      });
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "DetailsComposite:Error occured on handleAttributeDataChange",
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
            attributeMetaDataList.coaTemplate
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  GetTemplateFromTemplate() {
    try {
      axios(
        RestAPIs.GetTemplateFromTemplate,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var list = result.EntityResult;
            var cloneAssociated = lodash.cloneDeep(
              this.state.associatedTemplates
            );
            var tempTemplateCodes = [];
            list.forEach((item) => {
              tempTemplateCodes.push(item.Code);
            });
            this.setState({
              templateFromTemplate: tempTemplateCodes,
              associatedTemplates: cloneAssociated,
            });
          } else {
            console.log("Error in gettemplateFromTemplate:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Template FromTemplate List:", error);
        });
    } catch (error) {
      console.log("Error while getting Template FromTemplate List:", error);
    }
  }

  getTemplateTankCodes() {
    try {
      axios(
        RestAPIs.GetTanks + "?ShareholderCode=",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
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
                templateTankCodes: tempTankCodes,
              });
            }
          } else {
            console.log("Error in getTankCode:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error in getTankCode:", error);
        });
    } catch (error) {
      console.log("Error in getTankCode:", error);
    }
  }

  handleTankCodeChange = (data) => {
    try {
      const modCOATemplate = lodash.cloneDeep(this.state.modCOATemplate);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOATemplate["TankCode"] = data;
      this.setState({ modCOATemplate });
      if (coatemplateValidationDef["TankCode"] !== undefined) {
        validationErrors["TankCode"] = Utilities.validateField(
          coatemplateValidationDef["TankCode"],
          data
        );
        this.setState({ validationErrors });
      }

      if (validationErrors["TankCode"] != "") {
        return;
      }

      var keyCode = [
        {
          key: KeyCodes.tankCode,
          value: data,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.userDetails.EntityResult.TerminalCode,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.tankCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.GetTank,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess) {
            let entity = result.EntityResult;

            modCOATemplate.BaseProductCode = entity.BaseProductCode;
            this.setState({ modCOATemplate });
          }
        })
        .catch((error) => {
          console.log(
            "COATemplateDetails : Error while getting Tank Code",
            error
          );
        });
    } catch (error) {
      console.log(
        "COATemplateDetailsComposite:Error occured on handleTankCodeChange",
        error
      );
    }
  };
  handleFromTemplateChange = (data) => {
    try {
      const modCOATemplate = lodash.cloneDeep(this.state.modCOATemplate);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOATemplate["FromTemplate"] = data;
      this.setState({ modCOATemplate });

      if (data == null) {
        modCOATemplate.FromTemplate = null;
        this.setState({
          availableTemplates: [],
          modCOATemplate,
          validationErrors,
          isReadyToRender: true,
          associatedTemplates: lodash.cloneDeep(this.state.allParameters),
        });
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
        RestAPIs.GetCOATemplate,
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
              var AvailableTemplateParameters = [];
              details.forEach((obj) => {
                var tempObj = {
                  ParameterName: obj.ParameterName,
                  Specification: obj.Specification,
                  Method: obj.Method,
                  SortIndex: obj.SortIndex,
                };
                AvailableTemplateParameters.push(tempObj);
              });
              var allParameters = lodash.cloneDeep(this.state.allParameters);
              let remaingParameters = allParameters.filter(
                (item) =>
                  !AvailableTemplateParameters.some(
                    (ele) => ele.ParameterName === item.ParameterName
                  )
              );
              this.setState({
                availableTemplates: AvailableTemplateParameters,
                initavailableTemplates: AvailableTemplateParameters,
                associatedTemplates: remaingParameters,
                isReadyToRender: true,
              });
            });
          } else {
            this.setState(
              {
                coaTemplate: lodash.cloneDeep(emptyCOATemplate),
                modCOATemplate: lodash.cloneDeep(emptyCOATemplate),
                isReadyToRender: true,
              },
              () => {}
            );
            console.log("Error in getCOATemplate:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting coaTemplate:", error, data);
        });
    } catch (error) {
      console.log(
        "COATemplateDetailsComposite:Error occured on handleFromTemplateChange",
        error
      );
    }
  };
  handleChange = (propertyName, data) => {
    try {
      const modCOATemplate = lodash.cloneDeep(this.state.modCOATemplate);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOATemplate[propertyName] = data;
      this.setState({ modCOATemplate });
      if (coatemplateValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          coatemplateValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "COATemplateDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.coaTemplate.Name !== "" &&
        nextProps.selectedRow.Common_Name === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCOATemplate(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "COATemplateDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAllParameters();
      this.getTemplateTankCodes();
      this.GetTemplateFromTemplate();
      this.getAttributes(this.props.selectedRow);
    } catch (error) {
      console.log(
        "COATemplateDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAllParameters() {
    try {
      var keyCode = [];
      var obj = {
        keyDataCode: KeyCodes.coaTemplateCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.GetAllParameters,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let details = result.EntityResult;
            var tempResult = [];
            details.forEach((obj) => {
              var tempObj = {
                ParameterName: obj.ParameterName,
                Specification: obj.Specification,
                Method: obj.Method,
                SortIndex: obj.SortIndex,
              };
              tempResult.push(tempObj);
            });
            this.setState({ allParameters: tempResult });
          } else {
            this.setState({
              allParameters: [],
            });
            console.log("Error in GetAllParameters:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while GetAllParameters:", error);
        });
    } catch (error) {
      console.log("Error while GetAllParameters:", error);
    }
  }

  getAttributes(coaTemplateRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [coaTemplateAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var cloneAssociated = lodash.cloneDeep(
            this.state.associatedTemplates
          );
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.COATEMPLATE
                ),
              associatedTemplates: cloneAssociated,
            },
            () => this.getCOATemplate(coaTemplateRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getCOATemplate(selectedRow) {
    try {
      if (selectedRow.COATemplateCode === undefined) {
        this.setState({ isReadyToRender: false }, () => {
          this.setState(
            {
              coaTemplate: lodash.cloneDeep(emptyCOATemplate),
              modCOATemplate: lodash.cloneDeep(emptyCOATemplate),
              isReadyToRender: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnCOATemplate
              ),
              availableTemplates: [],
              modAttributeMetaDataList: [],
              associatedTemplates: lodash.cloneDeep(this.state.allParameters),
            },
            () => {
              this.localNodeAttribute();
            }
          );
        });

        return;
      }
      var keyCode = [
        {
          key: KeyCodes.coaTemplateCode,
          value: selectedRow.COATemplateCode,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.coaTemplateCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.GetCOATemplate,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let details = result.EntityResult.COATemplateDetailsList;
            //AvailableTemplateParameters means associated parameters in COATemplate
            var AvailableTemplateParameters = [];
            details.forEach((obj) => {
              var tempObj = {
                ParameterName: obj.ParameterName,
                Specification: obj.Specification,
                Method: obj.Method,
                SortIndex: obj.SortIndex,
              };
              AvailableTemplateParameters.push(tempObj);
            });
            result.EntityResult.COATemplateCode = result.EntityResult.Code;
            var allParameters = lodash.cloneDeep(this.state.allParameters);
            let remaingParameters = allParameters.filter(
              (item) =>
                !AvailableTemplateParameters.some(
                  (ele) => ele.ParameterName === item.ParameterName
                )
            );
            this.setState(
              {
                isReadyToRender: true,
                coaTemplate: lodash.cloneDeep(result.EntityResult),
                modCOATemplate: lodash.cloneDeep(result.EntityResult),
                availableTemplates: AvailableTemplateParameters,
                initavailableTemplates: AvailableTemplateParameters,
                associatedTemplates: remaingParameters,
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnCOATemplate
                ),
              },
              () => {
                this.localNodeAttribute();
              }
            );
          } else {
            this.setState(
              {
                coaTemplate: lodash.cloneDeep(emptyCOATemplate),
                modCOATemplate: lodash.cloneDeep(emptyCOATemplate),
                isReadyToRender: true,
              },
              () => {}
            );
            console.log("Error in getCOATemplate:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting coaTemplate:", error, selectedRow);
        });
    } catch (error) {
      console.log("Error while getting coaTemplate:", error, selectedRow);
    }
  }

  handleAvailableTemplateSelection = (e) => {
    this.setState({ selectedAvailableTemplates: e });
  };

  handleAssociatedTemplateSelection = (e) => {
    this.setState({ selectedAssociatedTemplates: e });
  };

  handleTemplateAssociation = () => {
    try {
      this.setState({ isReadyToRender: false }, () => {
        const selectedAvailableTemplates = lodash.cloneDeep(
          this.state.selectedAvailableTemplates
        );
        let availableTemplates = lodash.cloneDeep(
          this.state.availableTemplates
        );
        let associatedTemplates = lodash.cloneDeep(
          this.state.associatedTemplates
        );
        selectedAvailableTemplates.forEach((obj) => {
          associatedTemplates.push(obj);
          availableTemplates = availableTemplates.filter((com) => {
            return com.ParameterName !== obj.ParameterName;
          });
        });
        this.setState({
          associatedTemplates,
          selectedAvailableTemplates: [],
          availableTemplates,
          isReadyToRender: true,
        });
      });
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on handleTemplateAssociation",
        error
      );
    }
  };

  handleTemplateDisassociation = () => {
    try {
      this.setState({ isReadyToRender: false }, () => {
        const selectedAssociatedTemplates = lodash.cloneDeep(
          this.state.selectedAssociatedTemplates
        );
        let availableTemplates = lodash.cloneDeep(
          this.state.availableTemplates
        );
        let associatedTemplates = lodash.cloneDeep(
          this.state.associatedTemplates
        );
        selectedAssociatedTemplates.forEach((obj) => {
          availableTemplates.push(obj);
          associatedTemplates = associatedTemplates.filter((com) => {
            return com.ParameterName !== obj.ParameterName;
          });
        });
        this.setState({
          associatedTemplates,
          selectedAssociatedTemplates: [],
          availableTemplates,
          isReadyToRender: true,
        });
      });
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on handleTemplateDisassociation",
        error
      );
    }
  };

  validateSave(attributeList) {
    try {
      const { modCOATemplate } = this.state;
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(coatemplateValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          coatemplateValidationDef[key],
          modCOATemplate[key]
        );
      });

      if (modCOATemplate.IsActive !== this.state.coaTemplate.IsActive) {
        if (modCOATemplate.Remarks === null || modCOATemplate.Remarks === "") {
          validationErrors["Remarks"] = "COA_RemarksRequired";
        }
      }

      this.setState({ validationErrors });

      var attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );
      attributeList.forEach((attribute) => {
        attributeValidationErrors.forEach((attributeValidation) => {
          attribute.attributeMetaDataList.forEach((attributeMetaData) => {
            attributeValidation.attributeValidationErrors[
              attributeMetaData.Code
            ] = Utilities.valiateAttributeField(
              attributeMetaData,
              attributeMetaData.DefaultValue
            );
          });
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
      console.log("COATemplateDetailsComposite : Error in validateSave");
    }
  }
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  saveCOATemplate = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempCOATemplate = lodash.cloneDeep(this.state.tempCOATemplate);
      let availableTems = lodash.cloneDeep(this.state.availableTemplates);

      tempCOATemplate.COATemplateDetailsList = [];
      availableTems.forEach((obj) => {
        var singleTemplate = {
          ParameterName: obj.ParameterName,
          Specification: obj.Specification,
          Method: obj.Method,
          SortIndex: obj.SortIndex,
        };
        tempCOATemplate.COATemplateDetailsList.push(singleTemplate);
      });

      tempCOATemplate.Code = tempCOATemplate.COATemplateCode;
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      tempCOATemplate.Attributes =
        Utilities.fillAttributeDetails(attributeList);

      this.state.coaTemplate.COATemplateCode === ""
        ? this.createCOATemplate(tempCOATemplate)
        : this.updateCOATemplate(tempCOATemplate);
    } catch (error) {
      console.log("COATemplateDetailsComposite : Error in saveCOATemplate");
    }
  };
  handleSave = () => {
    try {
      let modCOATemplate = lodash.cloneDeep(this.state.modCOATemplate);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(attributeList)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempCOATemplate = lodash.cloneDeep(modCOATemplate);
        this.setState({ showAuthenticationLayout, tempCOATemplate }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCOATemplate();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "COATemplateDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  createCOATemplate(modCOATemplate) {
    try {
      var keyCode = [
        {
          key: KeyCodes.coaTemplateCode,
          value: modCOATemplate.COATemplateCode,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.coaTemplateCode,
        KeyCodes: keyCode,
        Entity: modCOATemplate,
      };
      var notification = {
        messageType: "critical",
        message: "COATemplateDetails_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["COATemplateCode"],
            keyValues: [modCOATemplate.COATemplateCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateCOATemplate,
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
                  fnCOATemplate
                ),
                showAuthenticationLayout: false,
              },
              () =>
                this.getCOATemplate({
                  COATemplateCode: modCOATemplate.COATemplateCode,
                })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnCOATemplate
              ),
              showAuthenticationLayout: false,
            });
            console.log("Error in createCOATemplate:", result.ErrorList);
          }
          this.props.onSaved(modCOATemplate, "add", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCOATemplate
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modCOATemplate, "add", notification);
        });
    } catch (error) {
      console.log("Error in createCOATemplate");
    }
  }

  updateCOATemplate(modCOATemplate) {
    try {
      let keyCode = [
        {
          key: KeyCodes.coaTemplateCode,
          value: modCOATemplate.COATemplateCode,
        },
      ];

      if (modCOATemplate.CreatedBy == null) {
        modCOATemplate.CreatedBy = "";
      }
      if (modCOATemplate.LastUpdatedBy == null) {
        modCOATemplate.LastUpdatedBy = "";
      }
      let obj = {
        keyDataCode: KeyCodes.coaTemplateCode,
        KeyCodes: keyCode,
        Entity: modCOATemplate,
      };

      let notification = {
        messageType: "critical",
        message: "COATemplateDetails_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["COATemplateCode"],
            keyValues: [modCOATemplate.COATemplateCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateCOATemplate,
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
                  fnCOATemplate
                ),
                showAuthenticationLayout: false,
              },
              () =>
                this.getCOATemplate({
                  COATemplateCode: modCOATemplate.COATemplateCode,
                })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCOATemplate
              ),
              showAuthenticationLayout: false,
            });
            console.log("Error in updateCOATemplate:", result.ErrorList);
          }
          this.props.onSaved(modCOATemplate, "update", notification);
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modCOATemplate, "modify", notification);
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCOATemplate
            ),
            showAuthenticationLayout: false,
          });
        });
    } catch (error) {
      console.log("Error in updateCOATemplate:");
    }
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const coaTemplate = lodash.cloneDeep(this.state.coaTemplate);
      const allAvailableTemplates = lodash.cloneDeep(
        this.state.allParameters
      );
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      if (this.state.coaTemplate.COATemplateCode === "") {
        this.setState(
          {
            availableTemplates: [],
            associatedTemplates: allAvailableTemplates,
            selectedAvailableTemplates: [],
            selectedAssociatedTemplates: [],
            modCOATemplate: { ...coaTemplate },
            validationErrors,
            modAttributeMetaDataList: [],
            isReadyToRender: false,
          },
          () => {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.handleResetAttributeValidationError();
            } else {
              this.localNodeAttribute();
              this.handleResetAttributeValidationError();
            }
            this.setState({ isReadyToRender: true });
          }
        );
      } else {       
        const initAvailableTemplates = lodash.cloneDeep(
          this.state.initavailableTemplates
        );
        let remaingParameters = allAvailableTemplates.filter(
          (item) =>
            !initAvailableTemplates.some(
              (ele) => ele.ParameterName === item.ParameterName
            )
        );
        this.setState(
          {
            selectedAvailableTemplates: [],
            selectedAssociatedTemplates: [],
            modCOATemplate: { ...coaTemplate },
            validationErrors,
            modAttributeMetaDataList: [],
            availableTemplates: initAvailableTemplates,
            associatedTemplates: remaingParameters,
            isReadyToRender: false,
          },
          () => {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.handleResetAttributeValidationError();
            } else {
              this.localNodeAttribute();
              this.handleResetAttributeValidationError();
            }
            this.setState({ isReadyToRender: true });
          }
        );
      }
    } catch (error) {
      console.log(
        "COATemplateDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modeTemplateParameters = lodash.cloneDeep(
        this.state.availableTemplates
      );
      var singleParameter = modeTemplateParameters.find(
        (ele) => ele.ParameterName === cellData.rowData.ParameterName
      );
      singleParameter[cellData.field] = newVal;
      this.setState({ availableTemplates: modeTemplateParameters });
    } catch (error) {
      console.log(":Error occured on handleCellDataEdit", error);
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modCOATemplate = lodash.cloneDeep(this.state.modCOATemplate);
      modCOATemplate.IsActive = value;
      if (modCOATemplate.IsActive !== this.state.coaTemplate.IsActive)
        modCOATemplate.Remarks = "";
      this.setState({ modCOATemplate });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const listOptions = {
      templateTankCodes: this.state.templateTankCodes,
      templateBaseProductCodes: this.state.templateBaseProductCodes,
      templateUseType: this.state.templateUseType,
      templateFromTemplate: this.state.templateFromTemplate,
      availableTemplates: this.state.availableTemplates,
      selectedAvailableTemplates: this.state.selectedAvailableTemplates,
      associatedTemplates: this.state.associatedTemplates,
      selectedAssociatedTemplates: this.state.selectedAssociatedTemplates,
    };
    const popUpContents = [
      {
        fieldName: "COATemplate_LastUpDt",
        fieldValue:
          new Date(
            this.state.modCOATemplate.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modCOATemplate.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "COATemplate_LastUpdatedBy",
        fieldValue: this.state.modCOATemplate.LastUpdatedBy,
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.coaTemplate.COATemplateCode}
            newEntityName="COATemplate_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>

        <ErrorBoundary>
          <COATemplateDetails
            coaTemplate={this.state.coaTemplate}
            modCOATemplate={this.state.modCOATemplate}
            validationErrors={this.state.validationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onTankCodeChange={this.handleTankCodeChange}
            onFromTemplateChange={this.handleFromTemplateChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            onAvailableTemplateSelection={this.handleAvailableTemplateSelection}
            pageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            onTemplateAssociation={this.handleTemplateAssociation}
            onAssociatedTemplateSelection={
              this.handleAssociatedTemplateSelection
            }
            onTemplateDisassociation={this.handleTemplateDisassociation}
            handleCellDataEdit={this.handleCellDataEdit}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
            associatedTemplates={this.state.associatedTemplates}
          ></COATemplateDetails>
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
              this.state.coaTemplate.COATemplateCode === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnCOATemplate}
            handleOperation={this.saveCOATemplate}
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

export default connect(mapStateToProps)(COATemplateDetailsComposite);

COATemplateDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
