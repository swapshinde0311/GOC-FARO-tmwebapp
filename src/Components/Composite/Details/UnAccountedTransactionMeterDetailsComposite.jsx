import React, { Component } from "react";
import { UnAccountedTransactionMeterDetails } from "../../UIBase/Details/UnAccountedTransactionMeterDetails";
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
import { UnAccountedTransactionMeterValidationDef } from "../../../JS/ValidationDef";
import {
  functionGroups,
  fnUnAccountedTransactionMeter,
} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { emptyAccountedMeterTransaction } from "../../../JS/DefaultEntities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { unAccountedMeterTransaction } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class UnAccountedTransactionMeterDetailsComposite extends Component {
  state = {
    AccountedMeterTransaction: lodash.cloneDeep(emptyAccountedMeterTransaction), //{ ...emptyCustomer },
    modAccountedMeterTransaction: lodash.cloneDeep(
      emptyAccountedMeterTransaction
    ),
    emptyAccountedMeterTransaction: lodash.cloneDeep(
      emptyAccountedMeterTransaction
    ), //{ ...emptyCustomer },

    //isDetails:false,
    isReadyToRender: true,
    saveEnabled: false,
    meterCodeOptions: [],
    meterCodeSearchOptions: [],
    transactionTypeOptions: [],
    baseProdcutOptions: [],
    quantityUOMOptions: [],
    densityUOMOptions: [],
    tankCodeOptions: [],
    transportationTypeOptions: [],
    attributeMetaDataList: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],
    validationErrors: Utilities.getInitialValidationErrors(
      UnAccountedTransactionMeterValidationDef
    ),
    showAuthenticationLayout: false,
    tempAccountedMeterTransaction: {},
  };

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const AccountedMeterTransaction = lodash.cloneDeep(
        this.state.AccountedMeterTransaction
      );
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modAccountedMeterTransaction: { ...AccountedMeterTransaction },
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
        "UnAccountedTransactionMeterDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  componentWillReceiveProps = (nextProps) => {
    try {
      if (
        this.state.AccountedMeterTransaction.MeterCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.setState(
          {
            modAccountedMeterTransaction: emptyAccountedMeterTransaction,
            AccountedMeterTransaction: emptyAccountedMeterTransaction,
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
        "UnAccountedTransactionMeterDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  };
  componentDidMount() {
    try {
      this.props.onRef(this);
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes();
      this.GetUOMList();
      this.GetMeterCode();
      this.GetBaseProductsList();
      this.GetUnAccountedTransactionTypeList();
      this.GetTransportationTypeOptions();
      this.GetTankList();
      let modAccountedMeterTransaction = lodash.cloneDeep(
        this.state.emptyAccountedMeterTransaction
      );
      modAccountedMeterTransaction.ShareholderCode =
        this.props.selectedShareholder;
      this.setState({
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnUnAccountedTransactionMeter
        ),
        modAccountedMeterTransaction: modAccountedMeterTransaction,
      });
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  ReSetData() {
    this.setState({
      modAccountedMeterTransaction: lodash.cloneDeep(
        emptyAccountedMeterTransaction
      ),
      saveEnabled: true,
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
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetUOMList:", error);
      });
  }
  GetMeterCode() {
    axios(
      RestAPIs.GetMeters,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const meterCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let meterCodeSearchOptions = lodash.cloneDeep(meterCodeOptions);
            if (
              meterCodeSearchOptions.length > Constants.filteredOptionsCount
            ) {
              meterCodeSearchOptions = meterCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({
              meterCodeOptions,
              meterCodeSearchOptions,
            });
          }
        } else {
          console.log("Error in getMeterCode:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getMeterCode:", error);
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
            var transactionTypeOptionList = result.EntityResult.Meter;
            let transactionOptions = [];
            transactionTypeOptionList.forEach((MeterType) => {
              transactionOptions.push({
                text: MeterType,
                value: MeterType,
              });
            });
            this.setState({
              transactionTypeOptions: transactionOptions,
            });
          }
        } else {
          console.log(
            "Error in GetUnAccountedTransactionTypeList:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting GetUnAccountedTransactionTypeList:",
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
        let MeterWhiteOptions = [];
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
          console.log("Error in GetBaseProductsList:", result.ErrorList);
        }
        this.getAdditivesList(baseProdcutOptions);
      })
      .catch((error) => {
        console.log("Error while getting GetBaseProductsList:", error);
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
  validateSave(attributeList) {
    const { modAccountedMeterTransaction } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(UnAccountedTransactionMeterValidationDef).forEach(function (
      key
    ) {
      validationErrors[key] = Utilities.validateField(
        UnAccountedTransactionMeterValidationDef[key],
        modAccountedMeterTransaction[key]
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

  CreateUnAccountedMeterTransaction(modAccountedMeterTransaction) {
    this.handleAuthenticationClose();
    this.setState({ saveEnabled: false });

    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      Entity: modAccountedMeterTransaction,
    };
    var notification = {
      messageType: "critical",
      message: "UnAccountedTransactionMeter_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["meterCodeOptions"],
          keyValues: [modAccountedMeterTransaction.MeterCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateUnAccountedMeterTransaction,
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
            AccountedMeterTransaction: modAccountedMeterTransaction,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnUnAccountedTransactionMeter
            ),
          });
          console.log(
            "Error in createAccountedMeterTransaction:",
            result.ErrorList
          );
        }
        this.props.onSaved(modAccountedMeterTransaction, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnUnAccountedTransactionMeter
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modAccountedMeterTransaction, "add", notification);
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
          console.log("Error in GetTankList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetTankList:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modAccountedMeterTransaction = lodash.cloneDeep(
        this.state.modAccountedMeterTransaction
      );
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modAccountedMeterTransaction[propertyName] = data;
      this.setState({ modAccountedMeterTransaction });
      if (
        UnAccountedTransactionMeterValidationDef[propertyName] !== undefined
      ) {
        validationErrors[propertyName] = Utilities.validateField(
          UnAccountedTransactionMeterValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };
  fillDetails() {
    try {
      let modAccountedMeterTransaction = lodash.cloneDeep(
        this.state.modAccountedMeterTransaction
      );
      //let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);

      modAccountedMeterTransaction.ShareholderCode =
        this.props.selectedShareholder;

      if (
        modAccountedMeterTransaction.Density !== null &&
        modAccountedMeterTransaction.Density !== ""
      )
        modAccountedMeterTransaction.Density =
          modAccountedMeterTransaction.Density.toLocaleString();
      if (
        modAccountedMeterTransaction.UnAccountedNetQuantity !== null &&
        modAccountedMeterTransaction.UnAccountedNetQuantity !== ""
      )
        modAccountedMeterTransaction.UnAccountedNetQuantity =
          modAccountedMeterTransaction.UnAccountedNetQuantity.toLocaleString();
      if (
        modAccountedMeterTransaction.UnAccountedGrossQuantity !== null &&
        modAccountedMeterTransaction.UnAccountedGrossQuantity !== ""
      )
        modAccountedMeterTransaction.UnAccountedGrossQuantity =
          modAccountedMeterTransaction.UnAccountedGrossQuantity.toLocaleString();
      if (
        modAccountedMeterTransaction.GrossStartTotalizer !== null &&
        modAccountedMeterTransaction.GrossStartTotalizer !== ""
      )
        modAccountedMeterTransaction.GrossStartTotalizer =
          modAccountedMeterTransaction.GrossStartTotalizer.toLocaleString();
      if (
        modAccountedMeterTransaction.GrossEndTotalizer !== null &&
        modAccountedMeterTransaction.GrossEndTotalizer !== ""
      )
        modAccountedMeterTransaction.GrossEndTotalizer =
          modAccountedMeterTransaction.GrossEndTotalizer.toLocaleString();
      if (
        modAccountedMeterTransaction.NetStartTotalizer !== null &&
        modAccountedMeterTransaction.NetStartTotalizer !== ""
      )
        modAccountedMeterTransaction.NetStartTotalizer =
          modAccountedMeterTransaction.NetStartTotalizer.toLocaleString();
      if (
        modAccountedMeterTransaction.NetEndTotalizer !== null &&
        modAccountedMeterTransaction.NetEndTotalizer !== ""
      )
        modAccountedMeterTransaction.NetEndTotalizer =
          modAccountedMeterTransaction.NetEndTotalizer.toLocaleString();
      //attributeList = Utilities.attributesConverttoLocaleString(attributeList);
      this.setState({ modAccountedMeterTransaction });
      return modAccountedMeterTransaction;
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  handleAddTransaction = () => {
    let tempAccountedMeterTransaction = lodash.cloneDeep(this.state.tempAccountedMeterTransaction);
    this.CreateUnAccountedMeterTransaction(tempAccountedMeterTransaction);
  };

  handleSave = () => {
    try {
      let modAccountedMeterTransaction = this.fillDetails();

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.selectedAttributeList
      );
     // this.setState({ saveEnabled: false });
      if (this.validateSave(attributeList)) {
        modAccountedMeterTransaction = this.convertStringtoDecimal(
          modAccountedMeterTransaction,
          attributeList
        );
        
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempAccountedMeterTransaction = lodash.cloneDeep(modAccountedMeterTransaction);
      this.setState({ showAuthenticationLayout, tempAccountedMeterTransaction }, () => {
        if (showAuthenticationLayout === false) {
          this.handleAddTransaction();
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
  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [unAccountedMeterTransaction],
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
                  result.EntityResult.UNACCOUNTEDMETERTRANSACTION
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
            "UnAccountedTransactionMeterDetailsComposite:Error in getAttributes:"
          );
        }
      });
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterDetailsComposite:Error while getAttributes:",
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
      if (
        modAccountedMeterTransaction.GrossStartTotalizer !== null &&
        modAccountedMeterTransaction.GrossStartTotalizer !== ""
      ) {
        modAccountedMeterTransaction.GrossStartTotalizer =
          Utilities.convertStringtoDecimal(
            modAccountedMeterTransaction.GrossStartTotalizer
          );
      }
      if (
        modAccountedMeterTransaction.GrossEndTotalizer !== null &&
        modAccountedMeterTransaction.GrossEndTotalizer !== ""
      ) {
        modAccountedMeterTransaction.GrossEndTotalizer =
          Utilities.convertStringtoDecimal(
            modAccountedMeterTransaction.GrossEndTotalizer
          );
      }
      if (
        modAccountedMeterTransaction.NetStartTotalizer !== null &&
        modAccountedMeterTransaction.NetStartTotalizer !== ""
      ) {
        modAccountedMeterTransaction.NetStartTotalizer =
          Utilities.convertStringtoDecimal(
            modAccountedMeterTransaction.NetStartTotalizer
          );
      }
      if (
        modAccountedMeterTransaction.NetEndTotalizer !== null &&
        modAccountedMeterTransaction.NetEndTotalizer !== ""
      ) {
        modAccountedMeterTransaction.NetEndTotalizer =
          Utilities.convertStringtoDecimal(
            modAccountedMeterTransaction.NetEndTotalizer
          );
      }
      modAccountedMeterTransaction = this.fillAttributeDetails(
        modAccountedMeterTransaction,
        attributeList
      );
      return modAccountedMeterTransaction;
    } catch (err) {
      console.log(
        "UnAccountedTransactionMeterDetailsComposite:convertStringtoDecimal error modAccountedMeterTransaction Details",
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
        "UnAccountedTransactionMeterDetailsComposite:Error occured on fillAttributeDetails",
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
        "UnAccountedTransactionMeterDetailsComposite:Error occured on handleCellDataEdit",
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
        var modTank = lodash.cloneDeep(this.state.modAccountedMeterTransaction);

        selectedTerminals.forEach((terminal) => {
          var existitem = selectedAttributeList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.UNACCOUNTEDMETERTRANSACTION.forEach(function (
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
        "UnAccountedTransactionMeterDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }
  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.UNACCOUNTEDMETERTRANSACTION) && attributeMetaDataList.UNACCOUNTEDMETERTRANSACTION.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.UNACCOUNTEDMETERTRANSACTION[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterDetailsComposite:Error occured on localNodeAttribute",
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
            attributeMetaDataList.UNACCOUNTEDMETERTRANSACTION
          ),
      });
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterDetailsComposite:Error occured on handleReset",
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
          <TMDetailsHeader newEntityName="MeterUnaccountedTransaction_Header"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <UnAccountedTransactionMeterDetails
            modAccountedMeterTransaction={
              this.state.modAccountedMeterTransaction
            }
            listOptions={{
              quantityUOMOptions: this.state.quantityUOMOptions,
              densityUOMOptions: this.state.densityUOMOptions,
              meterCodeOptions: this.state.meterCodeOptions,
              transactionTypeOptions: this.state.transactionTypeOptions,
              baseProdcutOptions: this.state.baseProdcutOptions,
              tankCodeOptions: this.state.tankCodeOptions,
              transportationTypeOptions: this.state.transportationTypeOptions,
            }}
            onFieldChange={this.handleChange}
            validationErrors={this.state.validationErrors}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            selectedAttributeList={this.state.selectedAttributeList}
            handleCellDataEdit={this.handleCellDataEdit}
          ></UnAccountedTransactionMeterDetails>
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
            functionGroup={fnUnAccountedTransactionMeter}
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
)(UnAccountedTransactionMeterDetailsComposite);
UnAccountedTransactionMeterDetailsComposite.propTypes = {
  selectedShareholder: PropTypes.string.isRequired,
  selectedRow: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
