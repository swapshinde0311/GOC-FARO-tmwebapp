import React, { Component } from "react";
import { COACustomerDetails } from "../../UIBase/Details/COACustomerDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { coacustomerValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyCOACustomer } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCOACustomer } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { coaCustomerAttributeEntity } from "../../../JS/AttributeEntity";
import { TranslationConsumer } from "@scuf/localization";

class COACustomerDetailsComposite extends Component {
  state = {
    coaCustomer: lodash.cloneDeep(emptyCOACustomer),
    modCOACustomer: {},
    validationErrors: Utilities.getInitialValidationErrors(
      coacustomerValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    showAuthenticationLayout: false,
    tempCOACustomer: {},
    initavailableCustomerParameters: [],
    availableCustomerParameters: [],
    selectedAvailableCustomerParameters: [],
    associatedCustomerParameters: [],
    selectedAssociatedCustomerParameters: [],
    customerCodes: [],
    finishedProductCodes: [],
    baseProductCodes: [],
    templateCodes: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    allCustomerParameters: [],
    allFinishedProducts: [],
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
      var modCOACustomer = lodash.cloneDeep(this.state.modCOACustomer);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.COACUSTOMER.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modCOACustomer.Attributes.find(
                (coaCustomerAttribute) => {
                  return coaCustomerAttribute.TerminalCode === terminal;
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
        "coaCustomerDetailsComposite:Error occured on terminalSelectionChange",
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
        Array.isArray(attributeMetaDataList.COACUSTOMER) &&
        attributeMetaDataList.COACUSTOMER.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.COACUSTOMER[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "COACustomerDetailsComposite:Error occured on localNodeAttribute",
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
            attributeMetaDataList.COACUSTOMER
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }
  getAllFinishedProducts() {
    try {
      axios(
        RestAPIs.GetAllFinishedProducts +
          "?ShareholderCode=" +
          this.props.selectedShareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (Array.isArray(result.EntityResult)) {
              let shareholderCustomers = result.EntityResult.filter(
                (shareholderCust) =>
                  shareholderCust.ShareholderCode ===
                  this.props.selectedShareholder //shareholder
              );
              if (shareholderCustomers.length > 0) {
                let allFinishedProducts =
                  shareholderCustomers[0].FinishedProductBaseProductsList;
                let finishedProductCodes = Object.keys(allFinishedProducts);
                finishedProductCodes =
                  Utilities.transferListtoOptions(finishedProductCodes);
                this.setState(
                  {
                    allFinishedProducts,
                    finishedProductCodes: finishedProductCodes,
                  },
                  () => this.getAllParameters()
                );
              } else {
                console.log("no finishedProduct identified for shareholder");
              }
            } else {
              console.log("finishedProduct not identified for shareholder");
            }
          } else {
            this.setState({ customerCodes: [] });
            console.log("Error in getAllFinishedProducts:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ customerCodes: [] });
          console.log("Error while getAllFinishedProducts List:", error);
        });
    } catch (error) {
      console.log("Error while getCOACustomerCode List:", error);
    }
  }

  GetTemplateofBaseProduct(baseProductCode) {
    try {
      axios(
        RestAPIs.GetTemplateofBaseProduct +
          "?BaseProductCode=" +
          baseProductCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var list = result.EntityResult;
            var tempTemplateCodes = [];
            list.forEach((item) => {
              tempTemplateCodes.push(item.Code);
            });
            this.setState({
              templateCodes: Utilities.transferListtoOptions(tempTemplateCodes),
              isReadyToRender: true,
            });
          } else {
            this.setState({ templateCodes: [], isReadyToRender: true });
            console.log("Error in GetTemplateofBaseProduct:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ templateCodes: [], isReadyToRender: true });
          console.log("Error while GetTemplateofBaseProduct:", error);
        });
    } catch (error) {
      console.log("Error while GetTemplateofBaseProduct:", error);
    }
  }

  getAllParameters = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.coaTemplateCode,
          value: "",
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
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
            var rightParameters = [];
            details.forEach((obj) => {
              var tempObj = {
                ParameterName: obj.ParameterName,
                Specification: obj.Specification,
                Method: obj.Method,
                SortIndex: obj.SortIndex,
              };
              rightParameters.push(tempObj);
            });
            this.setState(
              {
                allCustomerParameters: rightParameters,
              },
              () => {
                this.getAttributes(this.props.selectedRow);
              }
            );
          } else {
            this.setState(
              {
                allCustomerParameters: [],
              },
              () => {}
            );
            console.log("Error in getAllParameters:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getAllParameters:", error);
        });
    } catch (error) {
      console.log("Error while getAllParameters:", error);
    }
  };

  handleFinishedProductCodeChange = (data) => {
    try {
      const modCOACustomer = lodash.cloneDeep(this.state.modCOACustomer);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOACustomer["FinishedProductCode"] = data;
      modCOACustomer.BaseProductCode = "";
      modCOACustomer.TemplateCode = "";
      this.setState(
        {
          modCOACustomer,
          templateCodes: [],
          availableCustomerParameters: [],
          selectedAvailableCustomerParameters: [],
          associatedCustomerParameters: lodash.cloneDeep(
            this.state.allCustomerParameters
          ),
          isReadyToRender: false,
        },
        () => {
          this.setState({ isReadyToRender: true });
        }
      );
      if (coacustomerValidationDef["FinishedProductCode"] !== undefined) {
        validationErrors["FinishedProductCode"] = Utilities.validateField(
          coacustomerValidationDef["FinishedProductCode"],
          data
        );
        this.setState({ validationErrors });
      }

      if (validationErrors["FinishedProductCode"] !== "") {
        return;
      }
      let allFinishedProducts = this.state.allFinishedProducts;
      if (allFinishedProducts !== undefined && allFinishedProducts !== null) {
        if (
          allFinishedProducts[data] !== undefined &&
          allFinishedProducts[data] !== null
        ) {
          this.setState({
            baseProductCodes: Utilities.transferListtoOptions(
              allFinishedProducts[data]
            ),
          });
        }
      }
    } catch (error) {
      console.log("Error in handleFinishedProductCodeChange:", error);
    }
  };

  handleBaseProductCodeChange = (data) => {
    try {
      const modCOACustomer = lodash.cloneDeep(this.state.modCOACustomer);
      modCOACustomer["BaseProductCode"] = data;
      this.setState({ modCOACustomer, isReadyToRender: false }, () => {
        if (data == null) {
          modCOACustomer.TemplateCode = "";
          this.setState({
            templateCodes: [],
            availableCustomerParameters: [],
            associatedCustomerParameters: lodash.cloneDeep(
              this.state.allCustomerParameters
            ),
            isReadyToRender: true,
          });
          return;
        }
        this.GetTemplateofBaseProduct(data);
      });
    } catch (error) {
      console.log("Error in handleBaseProductCodeChange:", error);
    }
  };

  handleTemplateProductCodeChange = (data) => {
    try {
      const modCOACustomer = lodash.cloneDeep(this.state.modCOACustomer);
      modCOACustomer["TemplateCode"] = data;
      this.setState({ modCOACustomer, isReadyToRender: false }, () => {
        if (data == null) {
          this.setState({
            availableCustomerParameters: [],
            associatedCustomerParameters: lodash.cloneDeep(
              this.state.allCustomerParameters
            ),
            isReadyToRender: true,
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
          ShareHolderCode: this.props.selectedShareholder,
          keyDataCode: KeyCodes.coaTemplateCode,
          KeyCodes: keyCode,
        };

        // handle availableCustomerParameters
        axios(
          RestAPIs.GetCOATemplateForCustomer,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            var result = response.data;
            if (result.IsSuccess === true) {
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
              var allCustomerParameters = lodash.cloneDeep(
                this.state.allCustomerParameters
              );
              let remainingParameters = allCustomerParameters.filter(
                (item) =>
                  !showParameters.some(
                    (ele) => ele.ParameterName === item.ParameterName
                  )
              );
              this.setState({
                availableCustomerParameters: showParameters,
                associatedCustomerParameters: remainingParameters,
                isReadyToRender: true,
              });
            } else {
              this.setState({
                availableCustomerParameters: [],
                isReadyToRender: true,
              });
              console.log(
                "Error in GetCOATemplateForCustomer:",
                result.ErrorList
              );
            }
          })
          .catch((error) => {
            console.log("Error while GetCOATemplateForCustomer:", error, data);
          });
      });
    } catch (error) {
      console.log("Error in handleBaseProductCodeChange:", error);
    }
  };

  handleChange = (propertyName, data) => {
    try {
      const modCOACustomer = lodash.cloneDeep(this.state.modCOACustomer);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOACustomer[propertyName] = data;
      this.setState({ modCOACustomer });
      if (coacustomerValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          coacustomerValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "COACustomerDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.coaCustomer.Name !== "" &&
        nextProps.selectedRow.Common_Name === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCOACustomer(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "COACustomerDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAllFinishedProducts();
      this.getCOACustomerCode();
    } catch (error) {
      console.log(
        "COACustomerDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(coaCustomerRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [coaCustomerAttributeEntity],
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
                  result.EntityResult.COACUSTOMER
                ),
            },
            () => this.getCOACustomer(coaCustomerRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getCOACustomerCode() {
    try {
      axios(
        RestAPIs.GetCustomerDestinations +
          "?TransportationType=ROAD" +
          "&ShareholderCode=" +
          this.props.selectedShareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (Array.isArray(result.EntityResult)) {
              let shareholderCustomers = result.EntityResult.filter(
                (shareholderCust) =>
                  shareholderCust.ShareholderCode ===
                  this.props.selectedShareholder
              );
              if (shareholderCustomers.length > 0) {
                let customerDestinationOptions =
                  shareholderCustomers[0].CustomerDestinationsList;
                let customerCodes = [];
                if (customerDestinationOptions !== null) {
                  customerCodes = Object.keys(customerDestinationOptions);
                  customerCodes =
                    Utilities.transferListtoOptions(customerCodes);
                }
                this.setState({ customerCodes });
              } else {
                this.setState({ customerCodes: [] });
                console.log(
                  "COACustomerDetailComposite:no customers identified for shareholder"
                );
              }
            } else {
              this.setState({ customerCodes: [] });
              console.log(
                "COACustomerDetailComposite:customerdestinations not identified for shareholder"
              );
            }
          } else {
            this.setState({ customerCodes: [] });
            console.log("Error in getCOACustomerCode:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ customerCodes: [] });
          console.log("Error while getCOACustomerCode List:", error);
        });
    } catch (error) {
      console.log("Error while getCOACustomerCode List:", error);
    }
  }
  getCOACustomer(selectedRow) {
    emptyCOACustomer.ShareholderCode = this.props.selectedShareholder;
    if (
      selectedRow.CustomerCode === undefined ||
      selectedRow.CustomerCode === ""
    ) {
      this.setState(
        {
          coaCustomer: lodash.cloneDeep(emptyCOACustomer),
          modCOACustomer: lodash.cloneDeep(emptyCOACustomer),
          isReadyToRender: false,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCOACustomer
          ),
          availableCustomerParameters: [],
          modAttributeMetaDataList: [],
          associatedCustomerParameters: lodash.cloneDeep(
            this.state.allCustomerParameters
          ),
        },
        () => {
          this.localNodeAttribute();
          this.setState({ isReadyToRender: true });
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.customerCode,
        value: selectedRow.CustomerCode,
      },
    ];
    keyCode.push({
      key: KeyCodes.finishedProductCode,
      value: selectedRow.FinishedProductCode,
    });
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.customerCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetCOACustomer,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let details = result.EntityResult.COACustomerDetailsList;
          var AvailableCustomerParameters = [];
          details.forEach((obj) => {
            var tempObj = {
              ParameterName: obj.AnalysisParameterName,
              Specification: obj.Specification,
              Method: obj.Method,
              SortIndex: obj.SortIndex,
            };
            AvailableCustomerParameters.push(tempObj);
          });
          var allCustomerParameters = lodash.cloneDeep(
            this.state.allCustomerParameters
          );
          let remainingParameters = allCustomerParameters.filter(
            (item) =>
              !AvailableCustomerParameters.some(
                (ele) => ele.ParameterName === item.ParameterName
              )
          );
          this.setState(
            {
              isReadyToRender: true,
              coaCustomer: lodash.cloneDeep(result.EntityResult),
              modCOACustomer: lodash.cloneDeep(result.EntityResult),
              availableCustomerParameters: AvailableCustomerParameters,
              initavailableCustomerParameters: AvailableCustomerParameters,
              associatedCustomerParameters: remainingParameters,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCOACustomer
              ),
            },
            () => {
              this.localNodeAttribute();
            }
          );
          let finishedProductCode = this.state.coaCustomer.FinishedProductCode;
          let allFinishedProducts = this.state.allFinishedProducts;
          if (
            allFinishedProducts !== undefined &&
            allFinishedProducts !== null
          ) {
            if (
              allFinishedProducts[finishedProductCode] !== undefined &&
              allFinishedProducts[finishedProductCode] !== null
            ) {
              this.setState({
                baseProductCodes: Utilities.transferListtoOptions(
                  allFinishedProducts[finishedProductCode]
                ),
              });
            }
          }
          this.GetTemplateofBaseProduct(this.state.coaCustomer.BaseProductCode);
        } else {
          this.setState(
            {
              coaCustomer: lodash.cloneDeep(emptyCOACustomer),
              modCOACustomer: lodash.cloneDeep(emptyCOACustomer),
              isReadyToRender: true,
            },
            () => {}
          );
          console.log("Error in getCOACustomer:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting coaCustomer:", error, selectedRow);
      });
  }

  handleAvailableCustomerSelection = (e) => {
    this.setState({ selectedAvailableCustomerParameters: e });
  };

  handleAssociatedCustomerSelection = (e) => {
    this.setState({ selectedAssociatedCustomerParameters: e });
  };

  handleCustomerAssociation = () => {
    try {
      const selectedAvailableCustomerParameters = lodash.cloneDeep(
        this.state.selectedAvailableCustomerParameters
      );
      let availableCustomerParameters = lodash.cloneDeep(
        this.state.availableCustomerParameters
      );
      let associatedCustomerParameters = lodash.cloneDeep(
        this.state.associatedCustomerParameters
      );
      selectedAvailableCustomerParameters.forEach((obj) => {
        associatedCustomerParameters.push(obj);
        availableCustomerParameters = availableCustomerParameters.filter(
          (com) => {
            return com.ParameterName !== obj.ParameterName;
          }
        );
      });
      this.setState(
        {
          associatedCustomerParameters,
          selectedAvailableCustomerParameters: [],
          availableCustomerParameters,
          isReadyToRender: false,
        },
        () => {
          this.setState({ isReadyToRender: true });
        }
      );
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on handleCustomerAssociation",
        error
      );
    }
  };

  handleCustomerDisassociation = () => {
    try {
      const selectedAssociatedCustomerParameters = lodash.cloneDeep(
        this.state.selectedAssociatedCustomerParameters
      );
      let availableCustomerParameters = lodash.cloneDeep(
        this.state.availableCustomerParameters
      );
      let associatedCustomerParameters = lodash.cloneDeep(
        this.state.associatedCustomerParameters
      );
      selectedAssociatedCustomerParameters.forEach((obj) => {
        availableCustomerParameters.push(obj);
        associatedCustomerParameters = associatedCustomerParameters.filter(
          (com) => {
            return com.ParameterName !== obj.ParameterName;
          }
        );
      });
      this.setState(
        {
          associatedCustomerParameters,
          selectedAssociatedCustomerParameters: [],
          availableCustomerParameters,
          isReadyToRender: false,
        },
        () => {
          this.setState({ isReadyToRender: true });
        }
      );
    } catch (error) {
      console.log(
        "ProcessConfigDetailsComposite:Error occured on handleCustomerDisassociation",
        error
      );
    }
  };

  validateSave(attributeList) {
    const { modCOACustomer } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(coacustomerValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        coacustomerValidationDef[key],
        modCOACustomer[key]
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

  saveCOACustomer = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempCOACustomer = lodash.cloneDeep(this.state.tempCOACustomer);
      let availableTems = lodash.cloneDeep(
        this.state.availableCustomerParameters
      );

      tempCOACustomer.COACustomerDetailsList = [];
      availableTems.forEach((obj) => {
        let singleCustomer = {
          ParameterName: obj.ParameterName,
          AnalysisParameterName: obj.ParameterName,
          Specification: obj.Specification,
          Method: obj.Method,
          SortIndex: obj.SortIndex,
          IsEnabled: true,
          CreatedTime: new Date(),
          LastUpdatedTime: new Date(),
        };
        tempCOACustomer.COACustomerDetailsList.push(singleCustomer);
      });

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      tempCOACustomer.Attributes =
        Utilities.fillAttributeDetails(attributeList);
      tempCOACustomer.BaseProductCode =
        tempCOACustomer.BaseProductCode === null
          ? ""
          : tempCOACustomer.BaseProductCode;
      tempCOACustomer.TemplateCode =
        tempCOACustomer.TemplateCode === null
          ? ""
          : tempCOACustomer.TemplateCode;
      this.state.coaCustomer.CustomerCode === ""
        ? this.createCOACustomer(tempCOACustomer)
        : this.updateCOACustomer(tempCOACustomer);
    } catch (error) {
      console.log("COACustomerDetailsComposite : Error in saveCOACustomer");
    }
  };
  handleSave = () => {
    try {
      let modCOACustomer = lodash.cloneDeep(this.state.modCOACustomer);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(attributeList)) {
        modCOACustomer = this.fillAttributeDetails(
          modCOACustomer,
          attributeList
        );
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempCOACustomer = lodash.cloneDeep(modCOACustomer);
        this.setState({ showAuthenticationLayout, tempCOACustomer }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCOACustomer();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "COACustomerDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillAttributeDetails(modCOACustomer, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modCOACustomer.Attributes = Utilities.fillAttributeDetails(attributeList);
      return modCOACustomer;
    } catch (error) {
      console.log(
        "COACustomerDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  createCOACustomer(modCOACustomer) {
    var keyCode = [
      {
        key: KeyCodes.customerCode,
        value: modCOACustomer.COACustomerCode,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.customerCode,
      KeyCodes: keyCode,
      Entity: modCOACustomer,
    };
    var notification = {
      messageType: "critical",
      message: "COACustomerDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["COACustomerCode"],
          keyValues: [modCOACustomer.CustomerCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateCOACustomer,
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
                fnCOACustomer
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getCOACustomer({
                CustomerCode: modCOACustomer.CustomerCode,
                FinishedProductCode: modCOACustomer.FinishedProductCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCOACustomer
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createCOACustomer:", result.ErrorList);
        }
        this.props.onSaved(modCOACustomer, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCOACustomer
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCOACustomer, "add", notification);
      });
  }

  updateCOACustomer(modCOACustomer) {
    let keyCode = [
      {
        key: KeyCodes.customerCode,
        value: modCOACustomer.COACustomerCode,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.customerCode,
      KeyCodes: keyCode,
      Entity: modCOACustomer,
    };

    let notification = {
      messageType: "critical",
      message: "COACustomerDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["COACustomerCode"],
          keyValues: [modCOACustomer.CustomerCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateCOACustomer,
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
                fnCOACustomer
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getCOACustomer({
                CustomerCode: modCOACustomer.CustomerCode,
                FinishedProductCode: modCOACustomer.FinishedProductCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCOACustomer
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in updateCOACustomer:", result.ErrorList);
        }
        this.props.onSaved(modCOACustomer, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCOACustomer, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnCOACustomer
          ),
          showAuthenticationLayout: false,
        });
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const coaCustomer = lodash.cloneDeep(this.state.coaCustomer);

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      if (
        coaCustomer.CustomerCode === null ||
        coaCustomer.CustomerCode === ""
      ) {
        this.setState(
          {
            availableCustomerParameters: [],
            associatedCustomerParameters: lodash.cloneDeep(
              this.state.allCustomerParameters
            ),
            selectedAvailableCustomerParameters: [],
            selectedAssociatedCustomerParameters: [],
            modCOACustomer: { ...coaCustomer },
            validationErrors,
            modAttributeMetaDataList: [],
            isReadyToRender: false,
          },
          () => {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
            this.setState({ isReadyToRender: true });
          }
        );
      } else {
        this.setState(
          {
            availableCustomerParameters: lodash.cloneDeep(
              this.state.initavailableCustomerParameters
            ),
            associatedCustomerParameters: lodash.cloneDeep(
              this.state.allCustomerParameters
            ),
            selectedAvailableCustomerParameters: [],
            selectedAssociatedCustomerParameters: [],
            modCOACustomer: { ...coaCustomer },
            validationErrors,
            modAttributeMetaDataList: [],
            isReadyToRender: false,
          },
          () => {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
            this.setState({ isReadyToRender: true });
          }
        );
      }
    } catch (error) {
      console.log(
        "COACustomerDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modeCustomerParameters = lodash.cloneDeep(
        this.state.availableCustomerParameters
      );
      var singleParameter = modeCustomerParameters.find(
        (ele) => ele.ParameterName === cellData.rowData.ParameterName
      );
      singleParameter[cellData.field] = newVal;

      this.setState({ availableCustomerParameters: modeCustomerParameters });
    } catch (error) {
      console.log(":Error occured on handleCellDataEdit", error);
    }
  };

  render() {
    const listOptions = {
      availableCustomerParameters: this.state.availableCustomerParameters,
      selectedAvailableCustomerParameters:
        this.state.selectedAvailableCustomerParameters,
      associatedCustomerParameters: this.state.associatedCustomerParameters,
      selectedAssociatedCustomerParameters:
        this.state.selectedAssociatedCustomerParameters,
      customerCodes: this.state.customerCodes,
      finishedProductCodes: this.state.finishedProductCodes,
      baseProductCodes: this.state.baseProductCodes,
      templateCodes: this.state.templateCodes,
    };
    const popUpContents = [
      {
        fieldName: "COACustomer_LastUpDt",
        fieldValue:
          new Date(
            this.state.modCOACustomer.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modCOACustomer.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "COACustomer_LastUpdatedBy",
        fieldValue: this.state.modCOACustomer.LastUpdatedBy,
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <TranslationConsumer>
          {(t) => (
            <ErrorBoundary>
              <TMDetailsHeader
                entityCode={
                  this.state.coaCustomer.CustomerCode === ""
                    ? ""
                    : t("COACustomer_Headline")
                }
                newEntityName="COACustomer_Title"
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            </ErrorBoundary>
          )}
        </TranslationConsumer>
        <ErrorBoundary>
          <COACustomerDetails
            coaCustomer={this.state.coaCustomer}
            modCOACustomer={this.state.modCOACustomer}
            genericProps={this.props.genericProps}
            validationErrors={this.state.validationErrors}
            //listOptions={this.state.listOptions}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onFinishedProductCodeChange={this.handleFinishedProductCodeChange}
            onBaseProductCodeChange={this.handleBaseProductCodeChange}
            onTemplateProductCodeChange={this.handleTemplateProductCodeChange}
            onAvailableCustomerParameterSelection={
              this.handleAvailableCustomerSelection
            }
            pageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            onCustomerParameterAssociation={this.handleCustomerAssociation}
            onAssociatedCustomerParameterSelection={
              this.handleAssociatedCustomerSelection
            }
            onCustomerParameterDisassociation={
              this.handleCustomerDisassociation
            }
            handleCellDataEdit={this.handleCellDataEdit}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
          ></COACustomerDetails>
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
              this.state.coaCustomer.COACustomerCode === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnCOACustomer}
            handleOperation={this.saveCOACustomer}
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

export default connect(mapStateToProps)(COACustomerDetailsComposite);

COACustomerDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
