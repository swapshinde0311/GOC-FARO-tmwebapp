import React, { Component } from "react";
import { CustomerDetails } from "../../UIBase/Details/CustomerDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { customerValidationDef, dchAttributeValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyCustomer } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCustomer,fnKPIInformation } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { customerAttributeEntity } from "../../../JS/AttributeEntity";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiCustomerDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class CustomerDetailsComposite extends Component {
  state = {
    customer: lodash.cloneDeep(emptyCustomer), //{ ...emptyCustomer },
    modCustomer: {},
    validationErrors: Utilities.getInitialValidationErrors(
      customerValidationDef
    ),
    isReadyToRender: false,
    languageOptions: [],
    //listOptions: { languageOptions: [], terminalCodes: this.getTerminalList(), transportTypes: this.props.userDetails.EntityResult.TransportationTypes },
    saveEnabled: false,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    isDCHEnabled: false,
    modDCHAttributes: [],
    dchAttribute: [],
    dchAttributeValidationErrors: {},
    customerKPIList: [],
    showAuthenticationLayout: false,
    tempCustomer: {},
  };

  getTerminalList() {
    return this.props.terminalList;
  }

  handleChange = (propertyName, data) => {
    try {
      const modCustomer = lodash.cloneDeep(this.state.modCustomer);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCustomer[propertyName] = data;
      this.setState({ modCustomer });
      if (customerValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          customerValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleChange",
        error
      );
    }
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
      var modCustomer = lodash.cloneDeep(this.state.modCustomer);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.customer.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modCustomer.Attributes.find(
                (customerAttribute) => {
                  return customerAttribute.TerminalCode === terminal;
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
        "CustomerDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  getShareholderDetail(shareHolder) {
    //console.log("DCH", this.props.userDetails.EntityResult.IsDCHEnabled);
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shareHolder,
      },
    ];
    var obj = {
      ShareHolderCode: shareHolder,
      keyDataCode: KeyCodes.shareholderCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetShareholder,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isDCHEnabled:
              result.EntityResult.ExternalSystemCode > 1 ? true : false,
          }, () => {
            if (this.state.isDCHEnabled)
              this.GetDCHAttributeInfoList()
          });
        } else {
          this.setState({
            isDCHEnabled: false,
          });
          console.log("Error in getShareholderDetail:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting Shareholder detail:",
          error,
          shareHolder
        );
      });
    //console.log("Shareholder state : ", this.state.isValidShareholderSysExtCode)
  }

  GetDCHAttributeInfoList() {
    try {
      let modCustomer = lodash.cloneDeep(this.state.modCustomer);
      let dcAttributeConfig = {
        Shareholdercode: this.props.selectedShareholder,
        EntityCode: modCustomer.Code,
        EntityType: Constants.ExtendEntity.CUSTOMER
      }
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shareholderCode,
        Entity: dcAttributeConfig
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
            this.setState({ modDCHAttributes: result.EntityResult, dchAttribute: result.EntityResult })

          } else {

            console.log("Error in GetDCHAttributeInfoList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting DCHAttributeInfoList:",
            error
          );
        });
    } catch (error) {
      console.log(
        "Error while getting DCHAttributeInfoList:",
        error
      );
    }

  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (attributeMetaDataList !== null && attributeMetaDataList !== undefined &&
        Array.isArray(attributeMetaDataList.customer) && attributeMetaDataList.customer.length > 0)
        this.terminalSelectionChange([
          attributeMetaDataList.customer[0].TerminalCode,
        ]);
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.customer.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAttributes(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLanguages();
      this.getAttributes(this.props.selectedRow);
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(customerRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [customerAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.customer
              ),
            },
            () => this.getCustomer(customerRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getLanguages() {
    axios(
      RestAPIs.GetLanguageList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          console.log(result);
          let languageOptions = [];
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult).forEach((key) =>
              languageOptions.push({
                text: result.EntityResult[key],
                value: key,
              })
            );
            this.setState({ languageOptions });
          } else {
            console.log("No languages identified.");
          }
        } else {
          console.log("Error in GetLanguage:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Language List:", error);
      });
  }

  getCustomer(selectedRow) {
    //let selectedRow = props.selectedRow;
    emptyCustomer.TransportationTypes = [];
    emptyCustomer.ShareholderCode = this.props.selectedShareholder;
    emptyCustomer.LanguageCode = this.props.userDetails.EntityResult.UICulture;
    emptyCustomer.TransportationTypes = this.props.userDetails.EntityResult.TransportationTypes;
    if (this.props.terminalList.length === 1) {
      emptyCustomer.TerminalCodes = [...this.props.terminalList];
    }

    //var listOptions = lodash.cloneDeep(this.state.listOptions);

    if (selectedRow.Common_Code === undefined) {
      this.setState(
        {
          customer: lodash.cloneDeep(emptyCustomer),
          modCustomer: lodash.cloneDeep(emptyCustomer),
          modAttributeMetaDataList: [],
          //listOptions,
          isReadyToRender: true,
          customerKPIList:[],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCustomer
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsDCHEnabled)
            this.getShareholderDetail(this.props.selectedShareholder);
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.customerCode,
        value: selectedRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.customerCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetCustomer,
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
              customer: lodash.cloneDeep(result.EntityResult),
              modCustomer: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCustomer
              ),
            },
            () => {
              this.getKPIList(this.props.selectedShareholder,result.EntityResult.Code)
              if (this.props.userDetails.EntityResult.IsDCHEnabled)
                this.getShareholderDetail(this.props.selectedShareholder);
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            customer: lodash.cloneDeep(emptyCustomer),
            modCustomer: lodash.cloneDeep(emptyCustomer),
            isReadyToRender: true,
          }, () => {
            if (this.props.userDetails.EntityResult.IsDCHEnabled)
              this.getShareholderDetail(this.props.selectedShareholder);
          });
          console.log("Error in GetCustomer:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Customer:", error, selectedRow);
      });
  }

  validateSave(attributeList) {
    const { modCustomer } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(customerValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        customerValidationDef[key],
        modCustomer[key]
      );
    });
    if (
      modCustomer.ShareholderCode === null ||
      modCustomer.ShareholderCode.trim() === ""
    )
      validationErrors["ShareholderCode"] =
        "MarineReceipt_MandatoryShareholder";

    if (modCustomer.Status !== this.state.customer.Status) {
      if (modCustomer.Remarks === null || modCustomer.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
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

    let dchAttributeValidationErrors = lodash.cloneDeep(
      this.state.dchAttributeValidationErrors
    );

    let modDCHAttributes = lodash.cloneDeep(
      this.state.modDCHAttributes
    );

    //dchAttributeValidationErrors = getDCHAttributeErrors(modDCHAttributes, dchAttributeValidationDef);
    modDCHAttributes.forEach((attributes) => {
      dchAttributeValidationErrors[attributes.ID] = Utilities.validateField(
        dchAttributeValidationDef["attribute"],
        attributes.Value
      );
    })

    this.setState({ dchAttributeValidationErrors });

    if (returnValue)
      returnValue = Object.values(dchAttributeValidationErrors).every(function (value) {
        return value === "";
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

  saveCustomer = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempCustomer = lodash.cloneDeep(this.state.tempCustomer);

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      tempCustomer = this.fillAttributeDetails(tempCustomer, attributeList);


      this.state.customer.Code === ""
        ? this.createCustomer(tempCustomer)
        : this.updateCustomer(tempCustomer);
    } catch (error) {
      console.log("CustomerDetailsComposite : Error in saveCustomer");
    }
  };
  handleSave = () => {
    try {
      let modCustomer = lodash.cloneDeep(this.state.modCustomer);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      // this.setState({ saveEnabled: false });
      if (this.validateSave(attributeList)) {
        modCustomer = this.fillAttributeDetails(modCustomer, attributeList);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempCustomer = lodash.cloneDeep(modCustomer);
        this.setState({ showAuthenticationLayout, tempCustomer }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCustomer();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillAttributeDetails(modCustomer, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modCustomer.Attributes = Utilities.fillAttributeDetails(attributeList);

      if (this.state.isDCHEnabled) {
        let modDCHAttributes = lodash.cloneDeep(this.state.modDCHAttributes)
        modCustomer.IsDCHEnabled = true;
        if (modDCHAttributes !== null && modDCHAttributes !== undefined && modDCHAttributes.length > 0) {
          let dchAttributeInfo = {
            EntityCode: modCustomer.Code,
            EntityType: Constants.ExtendEntity.CUSTOMER,
            Shareholdercode: this.props.selectedShareholder,
            TabAttributeDataList: []
          }

          modDCHAttributes.forEach((attribute) => {
            dchAttributeInfo.TabAttributeDataList.push(attribute)
          })
          modCustomer.DCHAttribute = dchAttributeInfo;
        }
      }
      else {
        modCustomer.IsDCHEnabled = false;
        modCustomer.DCHAttribute = null;
      }
      return modCustomer;
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  createCustomer(modCustomer) {
    var keyCode = [
      {
        key: KeyCodes.customerCode,
        value: modCustomer.Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.customerCode,
      KeyCodes: keyCode,
      Entity: modCustomer,
    };
    var notification = {
      messageType: "critical",
      message: "CustomerDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Cust_Code"],
          keyValues: [modCustomer.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateCustomer,
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
              //customer: lodash.cloneDeep(this.state.modCustomer),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCustomer
              ),
              showAuthenticationLayout: false,

            },
            () => this.getCustomer({ Common_Code: modCustomer.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCustomer
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in CreateCustomer:", result.ErrorList);
        }
        this.props.onSaved(modCustomer, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCustomer
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCustomer, "add", notification);
      });
  }

  updateCustomer(modCustomer) {
    let keyCode = [
      {
        key: KeyCodes.customerCode,
        value: modCustomer.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.customerCode,
      KeyCodes: keyCode,
      Entity: modCustomer,
    };

    let notification = {
      messageType: "critical",
      message: "CustomerDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Customer_Code"],
          keyValues: [modCustomer.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateCustomer,
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
              // customer: { ...this.state.modCustomer },
              //customer: lodash.cloneDeep(this.state.modCustomer),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCustomer
              ),
              showAuthenticationLayout: false,

            },
            () => this.getCustomer({ Common_Code: modCustomer.Code })
          );
          // this.getCustomer(this.props);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCustomer
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in UpdateCustomer:", result.ErrorList);
        }
        this.props.onSaved(modCustomer, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCustomer, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnCustomer
          ),
          showAuthenticationLayout: false,

        });
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const customer = lodash.cloneDeep(this.state.customer);

      var modCustomer = lodash.cloneDeep(this.state.customer);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modCustomer: { ...customer },
          validationErrors,
          modAttributeMetaDataList: [],
          dchAttributeValidationErrors: {},
          modDCHAttributes: lodash.cloneDeep(this.state.dchAttribute)
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modCustomer.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.customer.Code === "") {
        var terminalCodes = [...this.state.terminalCodes];
        terminalCodes = [];
        this.setState({ terminalCodes });
      }
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

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
          attributeValidation.attributeValidationErrors[
            attribute.Code
          ] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleDCHCellDataEdit = (attribute, value) => {
    try {
      attribute.Value = value;
      this.setState({
        attribute: attribute,
      });
      const dchAttributeValidationErrors = lodash.cloneDeep(
        this.state.dchAttributeValidationErrors
      );

      dchAttributeValidationErrors[attribute.ID.toString()] = Utilities.validateField(
        dchAttributeValidationDef["attribute"],
        value
      );
      this.setState({ dchAttributeValidationErrors });

    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleDCHCellDataEdit",
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
        attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
          attributeMetaDataList.customer
        ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleAllTerminalsChange = (checked) => {
    try {
      //var listOptions = { ...this.state.listOptions };
      var modCustomer = lodash.cloneDeep(this.state.modCustomer);
      let terminalOptions = this.props.terminalList;
      if (checked) modCustomer.TerminalCodes = terminalOptions;
      else modCustomer.TerminalCodes = [];
      this.setState({ modCustomer });
      this.terminalSelectionChange(modCustomer.TerminalCodes);
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleAllTerminalsChange",
        error
      );
    }
  };
  handleActiveStatusChange = (value) => {
    try {
      let modCustomer = lodash.cloneDeep(this.state.modCustomer);
      modCustomer.Status = value;
      if (modCustomer.Status !== this.state.customer.Status)
        modCustomer.Remarks = "";
      this.setState({ modCustomer });
    } catch (error) {
      console.log(error);
    }
  };
  //Get KPI for Customers
  getKPIList(shareholder, customerCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      
      var transportationType = "";
      if (this.props.genericProps !== undefined) {
        if (this.props.genericProps.transportationType !== undefined) {
          transportationType = this.props.genericProps.transportationType;
        }
      }
      let objKPIRequestData = {
        PageName: kpiCustomerDetail,
        TransportationType: transportationType,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "CustomerCode", value: customerCode }],
      };
      axios(
        RestAPIs.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              customerKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ customerKPIList: [] });
            console.log("Error in customer KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Customer KPIList:", error);
        });
    }
  }
  render() {
    const listOptions = {
      terminalCodes: this.getTerminalList(),
      transportTypes: this.props.userDetails.EntityResult.TransportationTypes,
      languageOptions: this.state.languageOptions,
    };

    const popUpContents = [
      {
        fieldName: "Cust_LastUpDt",
        fieldValue:
          new Date(
            this.state.modCustomer.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modCustomer.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "Cust_LastActiveTime",
        fieldValue:
          this.state.modCustomer.LastActiveTime !== undefined &&
            this.state.modCustomer.LastActiveTime !== null
            ? new Date(
              this.state.modCustomer.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modCustomer.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "Cust_CreateDt",
        fieldValue:
          new Date(this.state.modCustomer.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modCustomer.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.customer.Code}
            newEntityName="CustInfo_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.customerKPIList}> </TMDetailsKPILayout>

        <ErrorBoundary>
          <CustomerDetails
            customer={this.state.customer}
            modCustomer={this.state.modCustomer}
            modDCHAttributes={this.state.modDCHAttributes}
            genericProps={this.props.genericProps}
            validationErrors={this.state.validationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            //listOptions={this.state.listOptions}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            onAttributeDataChange={this.handleAttributeDataChange} 
            isDCHEnabled={this.state.isDCHEnabled}
            dchAttributeValidationErrors={this.state.dchAttributeValidationErrors}
            handleDCHCellDataEdit={this.handleDCHCellDataEdit}
          ></CustomerDetails>
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
              this.state.customer.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnCustomer}
            handleOperation={this.saveCustomer}
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

export default connect(mapStateToProps)(CustomerDetailsComposite);

CustomerDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
