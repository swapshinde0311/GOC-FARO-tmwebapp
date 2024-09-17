import React, { Component } from "react";
import { UnAccountedTransactionTankDetails } from "../../UIBase/Details/UnAccountedTransactionTankDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import { UnAccountedTransactionTankValidationDef } from "../../../JS/ValidationDef";
import {
  functionGroups,
  fnUnAccountedTransactionTank,
} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { emptyAccountedTransaction } from "../../../JS/DefaultEntities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { unAccountedTankTransaction } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class UnAccountedTransactionTankDetailsComposite extends Component {
  state = {
    AccountedTransaction: lodash.cloneDeep(emptyAccountedTransaction), //{ ...emptyCustomer },
    modAccountedTransaction: lodash.cloneDeep(emptyAccountedTransaction),
    //isDetails:false,
    isReadyToRender: true,
    saveEnabled: false,
    tankCodeOptions: [],
    transactionTypeOptions: [],
    baseProdcutOptions: [],
    quantityUOMOptions: [],
    transportationTypeOptions: [],
    customerOptions: [],
    densityUOMOptions: [],
    customerSearchOptions: [],
    attributeMetaDataList: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],
    validationErrors: Utilities.getInitialValidationErrors(
      UnAccountedTransactionTankValidationDef
    ),
    showAuthenticationLayout: false,
    tempAccountedTransaction: {},
  };

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const AccountedTransaction = lodash.cloneDeep(
        this.state.AccountedTransaction
      );
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modAccountedTransaction: { ...AccountedTransaction },
          validationErrors,
          selectedAttributeList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange([]);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  GetUOMList() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        //console.log(response);
        var result = response.data;

        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let quantityUOMOptions = [];
            let densityUOMOptions = [];
            if (Array.isArray(result.EntityResult.VOLUME)) {
              quantityUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.VOLUME
              );
            }
            // debugger;
            if (Array.isArray(result.EntityResult.MASS)) {
              let massUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.MASS
              );
              massUOMOptions.forEach((massUOM) =>
                quantityUOMOptions.push(massUOM)
              );
            }
            if (Array.isArray(result.EntityResult.DENSITY)) {
              densityUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.DENSITY
              );
            }
            this.setState({ quantityUOMOptions, densityUOMOptions });

            // this.setState({ quantityUOMOptions, quantityUOMfilteredOptions });
          }
        } else {
          console.log(
            "UnAccountedTransactionTankDetailsComposite:Error in GetUOMList:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "UnAccountedTransactionTankDetailsComposite:Error while getting GetUOMList:",
          error
        );
      });
  }
  componentWillReceiveProps = (nextProps) => {
    try {
      if (
        this.state.AccountedTransaction.TankCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.setState(
          {
            modAccountedTransaction: emptyAccountedTransaction,
            AccountedTransaction: emptyAccountedTransaction,
            saveEnabled: true,
            selectedAttributeList: [],
          },
          () => {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.terminalSelectionChange([]);
              this.handleResetAttributeValidationError();
            } else {
              this.localNodeAttribute();
              this.handleResetAttributeValidationError();
            }
          }
        );
      }
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes();
      this.GetUOMList();
      this.GetTankList();
      this.GetBaseProductsList();
      this.GetUnAccountedTransactionTypeList();
      this.GetCustomerList();
      this.GetTransportationTypeOptions();
      let modAccountedTransaction = lodash.cloneDeep(
        this.state.modAccountedTransaction
      );
      modAccountedTransaction.ShareholderCode = this.props.selectedShareholder;
      this.setState({
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnUnAccountedTransactionTank
        ),
        modAccountedTransaction: modAccountedTransaction,
      });
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  GetCustomerList() {
    let modAccountedTransaction = lodash.cloneDeep(
      this.state.modAccountedTransaction
    );
    axios(
      RestAPIs.GetCustomerDestinations +
        "?TransportationType=" +
        modAccountedTransaction.TransportationType +
        "&ShareholderCode=" +
        this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    ).then((response) => {
      var result = response.data;
      if (result.IsSuccess === true) {
        if (Array.isArray(result.EntityResult)) {
          let shareholderCustomers = result.EntityResult.filter(
            (shareholderCust) =>
              shareholderCust.ShareholderCode === this.props.selectedShareholder
          );
          if (shareholderCustomers.length > 0) {
            let customerDestinationOptions =
              shareholderCustomers[0].CustomerDestinationsList;
            let customerOptions = [];
            if (customerDestinationOptions !== null) {
              customerOptions = Object.keys(customerDestinationOptions);
              customerOptions =
                Utilities.transferListtoOptions(customerOptions);
            }
            this.setState({ customerOptions });
          } else {
            console.log(
              "UnAccountedTransactionTankDetailsComposite:no customers identified for shareholder"
            );
          }
        } else {
          console.log(
            "UnAccountedTransactionTankDetailsComposite:customerdestinations not identified for shareholder"
          );
        }
      }
    });
  }
  GetTransportationTypeOptions() {
    const transportationTypeList = [];
    for (let key in Constants.TransportationType) {
      if (key !== Constants.TransportationType.PIPELINE) {
        transportationTypeList.push(key);
      }
    }
    this.setState({
      transportationTypeOptions: Utilities.transferListtoOptions(
        transportationTypeList
      ),
    });
  }
  GetTankList() {
    axios(
      RestAPIs.GetTanks + "?ShareholderCode=" + this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        //console.log(response);
        var result = response.data;
        if (result.IsSuccess === true) {
          let tankCodeOptions = [];
          if (result.EntityResult !== null) {
            tankCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
          }
          this.setState({ tankCodeOptions });
        } else {
          console.log(
            "UnAccountedTransactionTankDetailsComposite:Error in GetTankList:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "UnAccountedTransactionTankDetailsComposite:Error while getting GetTankList:",
          error
        );
      });
  }
  GetUnAccountedTransactionTypeList() {
    axios(
      RestAPIs.GetUnAccountedTransactionTypes,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        //console.log(response);
        var result = response.data;

        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            var transactionTypeOptionList = result.EntityResult.Tank;
            let transactionOptions = [];
            transactionTypeOptionList.forEach((TankType) => {
              transactionOptions.push({
                text: TankType,
                value: TankType,
              });
            });
            this.setState({
              transactionTypeOptions: transactionOptions,
            });
          }
        } else {
          console.log(
            "UnAccountedTransactionTankDetailsComposite:Error in GetUnAccountedTransactionTypeList:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "UnAccountedTransactionTankDetailsComposite:Error while getting GetUnAccountedTransactionTypeList:",
          error
        );
      });
  }
  GetBaseProductsList() {
    axios(
      RestAPIs.GetBaseProducts,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        //console.log(response);
        var result = response.data;
        let baseProdcutOptions = [];
        let TankWhiteOptions = [];
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult).forEach((prodType) => {
              if (
                result.EntityResult[prodType] !== undefined &&
                Array.isArray(result.EntityResult[prodType])
              ) {
                baseProdcutOptions = baseProdcutOptions.concat(
                  Utilities.transferListtoOptions(result.EntityResult[prodType])
                );
              }
            });

            // if (Array.isArray(result.EntityResult.ALLPROD)) {
            //   baseProdcutOptions = Utilities.transferListtoOptions(
            //     result.EntityResult.ALLPROD
            //   );
            // }
            // if (Array.isArray(result.EntityResult.WHITE)) {
            //   TankWhiteOptions = Utilities.transferListtoOptions(
            //     result.EntityResult.WHITE
            //   );
            //   TankWhiteOptions.forEach((TankWhite) =>
            //     baseProdcutOptions.push(TankWhite)
            //   );
            // }
          }
          this.setState({ baseProdcutOptions });
        } else {
          console.log(
            "UnAccountedTransactionTankDetailsComposite:Error in GetBaseProductsList:",
            result.ErrorList
          );
        }
        this.getAdditivesList(baseProdcutOptions);
      })
      .catch((error) => {
        console.log(
          "UnAccountedTransactionTankDetailsComposite:Error while getting GetBaseProductsList:",
          error
        );
      });
  }
  getAdditivesList(baseProdcutOptions) {
    axios(
      RestAPIs.GetAdditives,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            let additiveDetails = Utilities.transferListtoOptions(
              result.EntityResult.ALLPROD
            );
            additiveDetails.forEach((additive) =>
              baseProdcutOptions.push(additive)
            );
            this.setState({ baseProdcutOptions });
          }
        } else {
          console.log("Error in getAdditivesList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Additives List:", error);
      });
  }
  handleCustomerSearchChange = (CustomerCode) => {
    try {
      let customerSearchOptions = this.state.customerOptions.filter((item) =>
        item.value.toLowerCase().includes(CustomerCode.toLowerCase())
      );
      if (customerSearchOptions.length > Constants.filteredOptionsCount) {
        customerSearchOptions = customerSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        customerSearchOptions,
      });
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on handleDriverSearchChange",
        error
      );
    }
  };

  validateSave(attributeList) {
    const { modAccountedTransaction } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(UnAccountedTransactionTankValidationDef).forEach(function (
      key
    ) {
      validationErrors[key] = Utilities.validateField(
        UnAccountedTransactionTankValidationDef[key],
        modAccountedTransaction[key]
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
  createAccountedTransaction(modAccountedTransaction) {
    this.handleAuthenticationClose();
    this.setState({ saveEnabled: false });
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      Entity: modAccountedTransaction,
    };
    var notification = {
      messageType: "critical",
      message: "UnAccountedTransactionTank_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["tankCodeOptions"],
          keyValues: [modAccountedTransaction.TankCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateUnAccountedTankTransaction,
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
          this.setState({
            saveEnabled: false,
            AccountedTransaction: modAccountedTransaction,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnUnAccountedTransactionTank
            ),
          });
          console.log(
            "UnAccountedTransactionTankDetailsComposite:Error in createAccountedTransaction:",
            result.ErrorList
          );
        }
        this.props.onSaved(modAccountedTransaction, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnUnAccountedTransactionTank
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modAccountedTransaction, "add", notification);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modAccountedTransaction = lodash.cloneDeep(
        this.state.modAccountedTransaction
      );
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modAccountedTransaction[propertyName] = data;
      this.setState({ modAccountedTransaction });
      if (UnAccountedTransactionTankValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          UnAccountedTransactionTankValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleAddTransaction = () => {
    let tempAccountedTransaction = lodash.cloneDeep(this.state.tempAccountedTransaction);
    this.createAccountedTransaction(tempAccountedTransaction);
  };


  
  handleSave = () => {
    try {
      let modAccountedTransaction = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.selectedAttributeList
      );
    //  this.setState({ saveEnabled: false });
      if (this.validateSave(attributeList)) {
        modAccountedTransaction = this.convertStringtoDecimal(
          modAccountedTransaction,
          attributeList
        );

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempAccountedTransaction = lodash.cloneDeep(modAccountedTransaction);
      this.setState({ showAuthenticationLayout, tempAccountedTransaction }, () => {
        if (showAuthenticationLayout === false) {
          this.handleAddTransaction();
        }
    });

       
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };
  fillDetails() {
    try {
      let modAccountedTransaction = lodash.cloneDeep(
        this.state.modAccountedTransaction
      );
      //let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);

      modAccountedTransaction.ShareholderCode = this.props.selectedShareholder;
      if (
        modAccountedTransaction.Density !== null &&
        modAccountedTransaction.Density !== ""
      )
        modAccountedTransaction.Density =
          modAccountedTransaction.Density.toLocaleString();
      if (
        modAccountedTransaction.UnAccountedNetQuantity !== null &&
        modAccountedTransaction.UnAccountedNetQuantity !== ""
      )
        modAccountedTransaction.UnAccountedNetQuantity =
          modAccountedTransaction.UnAccountedNetQuantity.toLocaleString();
      if (
        modAccountedTransaction.UnAccountedGrossQuantity !== null &&
        modAccountedTransaction.UnAccountedGrossQuantity !== ""
      )
        this.setState({ modAccountedTransaction });
      return modAccountedTransaction;
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }
  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [unAccountedTankTransaction],
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
                  result.EntityResult.UNACCOUNTEDTANKTRANSACTION
                ),
            },
            () => {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange([]);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          console.log(
            "UnAccountedTransactionTankDetailsComposite:Error in getAttributes:"
          );
        }
      });
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error while getAttributes:",
        error
      );
    }
  }
  convertStringtoDecimal(modAccountedMeterTransaction, attributeList) {
    try {
      if (
        modAccountedMeterTransaction.UnAccountedGrossQuantity !== null &&
        modAccountedMeterTransaction.UnAccountedGrossQuantity !== ""
      ) {
        modAccountedMeterTransaction.UnAccountedGrossQuantity =
          Utilities.convertStringtoDecimal(
            modAccountedMeterTransaction.UnAccountedGrossQuantity
          );
      }
      if (
        modAccountedMeterTransaction.UnAccountedNetQuantity !== null &&
        modAccountedMeterTransaction.UnAccountedNetQuantity !== ""
      ) {
        modAccountedMeterTransaction.UnAccountedNetQuantity =
          Utilities.convertStringtoDecimal(
            modAccountedMeterTransaction.UnAccountedNetQuantity
          );
      }
      if (
        modAccountedMeterTransaction.Density !== null &&
        modAccountedMeterTransaction.Density !== ""
      ) {
        modAccountedMeterTransaction.Density = Utilities.convertStringtoDecimal(
          modAccountedMeterTransaction.Density
        );
      }
      modAccountedMeterTransaction = this.fillAttributeDetails(
        modAccountedMeterTransaction,
        attributeList
      );
      return modAccountedMeterTransaction;
    } catch (err) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:convertStringtoDecimal error modAccountedMeterTransaction Details",
        err
      );
    }
  }

  fillAttributeDetails(modAccountedMeterTransaction, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modAccountedMeterTransaction.Attributes = [];
      attributeList.forEach((comp) => {
        let attribute = {
          ListOfAttributeData: [],
        };
        attribute.TerminalCode = comp.TerminalCode;
        comp.attributeMetaDataList.forEach((det) => {
          attribute.ListOfAttributeData.push({
            AttributeCode: det.Code,
            AttributeValue: det.DefaultValue,
          });
        });
        modAccountedMeterTransaction.Attributes.push(attribute);
      });
      this.setState({ modAccountedMeterTransaction });
      return modAccountedMeterTransaction;
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }
  handleCellDataEdit = (attribute, value) => {
    try {
      attribute.DefaultValue = value;
      this.setState({
        attribute: attribute,
      });
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors });
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };
  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var selectedAttributeList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        selectedAttributeList = lodash.cloneDeep(
          this.state.selectedAttributeList
        );
        const attributeValidationErrors = lodash.cloneDeep(
          this.state.attributeValidationErrors
        );
        var modTank = lodash.cloneDeep(this.state.modAccountedTransaction);

        selectedTerminals.forEach((terminal) => {
          var existitem = selectedAttributeList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.UNACCOUNTEDTANKTRANSACTION.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modTank.Attributes.find(
                  (baseproductAttribute) => {
                    return baseproductAttribute.TerminalCode === terminal;
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
        selectedAttributeList = [];
        selectedAttributeList = attributesTerminalsList;
        selectedAttributeList = Utilities.attributesConvertoDecimal(
          selectedAttributeList
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
        this.setState({ selectedAttributeList, attributeValidationErrors });
      }
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }
  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.UNACCOUNTEDTANKTRANSACTION) && attributeMetaDataList.UNACCOUNTEDTANKTRANSACTION.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.UNACCOUNTEDTANKTRANSACTION[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.UNACCOUNTEDTANKTRANSACTION
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader newEntityName="TankUnaccountedTransaction_Header"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <UnAccountedTransactionTankDetails
            modAccountedTransaction={this.state.modAccountedTransaction}
            listOptions={{
              quantityUOMOptions: this.state.quantityUOMOptions,
              densityUOMOptions: this.state.densityUOMOptions,
              tankCodeOptions: this.state.tankCodeOptions,
              transactionTypeOptions: this.state.transactionTypeOptions,
              baseProdcutOptions: this.state.baseProdcutOptions,
              customerOptions: this.state.customerOptions,
              customerSearchOptions: this.state.customerSearchOptions,
              transportationTypeOptions: this.state.transportationTypeOptions,
            }}
            onFieldChange={this.handleChange}
            validationErrors={this.state.validationErrors}
            onCustomerSearchChange={this.handleCustomerSearchChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            selectedAttributeList={this.state.selectedAttributeList}
            handleCellDataEdit={this.handleCellDataEdit}
          ></UnAccountedTransactionTankDetails>
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
            functionName={functionGroups.add}
            functionGroup={fnUnAccountedTransactionTank}
            handleOperation={this.handleAddTransaction}
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
const mapReceiptToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapReceiptToProps
)(UnAccountedTransactionTankDetailsComposite);
UnAccountedTransactionTankDetailsComposite.propTypes = {
  selectedShareholder: PropTypes.string.isRequired,
  selectedRow: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
