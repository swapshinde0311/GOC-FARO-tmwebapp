import React, { Component } from "react";
import { CarrierDetails } from "../../UIBase/Details/CarrierDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { carrierValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyCarrier } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCarrierCompany, fnKPIInformation } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { carrierAttributeEntity } from "../../../JS/AttributeEntity";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiCarrierDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class CarrierDetailsComposite extends Component {
  state = {
    carrier: lodash.cloneDeep(emptyCarrier),
    modCarrier: {},
    validationErrors:
      Utilities.getInitialValidationErrors(carrierValidationDef),
    isReadyToRender: false,
    listOptions: { shareholders: this.getShareholders(), terminalCodes: [] },
    saveEnabled: false,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    carrierCompanyKPIList: [],
    showAuthenticationLayout: false,
    tempCarrier: {},
  };

  handleChange = (propertyName, data) => {
    try {
      const modCarrier = lodash.cloneDeep(this.state.modCarrier);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCarrier[propertyName] = data;
      this.setState({ modCarrier });
      if (carrierValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          carrierValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "CarrierCompanyComposite:Error occured on componentWillReceiveProps",
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
      var modCarrier = lodash.cloneDeep(this.state.modCarrier);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.carriercompany.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modCarrier.Attributes.find(
                (carriercompanyAttribute) => {
                  return carriercompanyAttribute.TerminalCode === terminal;
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
        "CarrierDetailsComposite:Error occured on terminalSelectionChange",
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
        Array.isArray(attributeMetaDataList.carriercompany) &&
        attributeMetaDataList.carriercompany.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.carriercompany[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "CarrierDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.carrier.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCarrierCompany(nextProps);
      }
    } catch (error) {
      console.log(
        "CarrierDetailyComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props);
    } catch (error) {
      console.log(
        "CarrierCompanyComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(props) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [carrierAttributeEntity],
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
                  result.EntityResult.carriercompany
                ),
            },
            () => this.getCarrierCompany(props)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }
  getCarrierCompany(props) {
    var transportationType = this.getTransportationType();
    let selectedRow = props.selectedRow;
    emptyCarrier.TransportationType = transportationType;
    var listOptions = lodash.cloneDeep(this.state.listOptions);
    if (selectedRow.Common_Code === undefined) {
      listOptions.terminalCodes = [];
      this.setState(
        {
          carrier: lodash.cloneDeep(emptyCarrier),
          modCarrier: lodash.cloneDeep(emptyCarrier),
          listOptions,
          modAttributeMetaDataList: [],
          carrierCompanyKPIList:[],
          isReadyToRender: true,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCarrierCompany
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.carrierCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      ShareHolderCode: selectedRow.Common_Shareholder,
      keyDataCode: KeyCodes.carrierCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetCarrier,
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
              carrier: lodash.cloneDeep(result.EntityResult),
              modCarrier: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCarrierCompany
              ),
            },
            () => {
              this.getKPIList(result.EntityResult.ShareholderCode, result.EntityResult.Code);
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
              this.getTerminalsList(
                transportationType === Constants.TransportationType.ROAD
                  ? [result.EntityResult.ShareholderCode]
                  : result.EntityResult.ShareholderCodes
              );
            }
          );
        } else {
          this.setState({
            carrier: lodash.cloneDeep(emptyCarrier),
            modCarrier: lodash.cloneDeep(emptyCarrier),
            isReadyToRender: true,
          });
          console.log("Error in GetCarrier:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier:", error, props);
      });
  }

  getTerminalsList(shareholderList) {
    try {
      if (
        shareholderList !== null &&
        shareholderList.length > 0 &&
        shareholderList[0] !== undefined &&
        shareholderList[0] !== ""
      ) {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(
            shareholderList,
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            var listOptions = lodash.cloneDeep(this.state.listOptions);
            var carrier = lodash.cloneDeep(this.state.carrier);
            var modCarrier = lodash.cloneDeep(this.state.modCarrier);
            listOptions.terminalCodes = response.data.EntityResult;
            this.setState({ listOptions });
            if (
              carrier.Code === undefined ||
              carrier.Code === "" ||
              carrier.Code === null
            ) {
              if (listOptions.terminalCodes.length === 1) {
                modCarrier.TerminalCodes = [...listOptions.terminalCodes];
              } else {
                modCarrier.TerminalCodes = [];
              }
            }
            if (Array.isArray(modCarrier.TerminalCodes)) {
              modCarrier.TerminalCodes = listOptions.terminalCodes.filter((x) =>
                modCarrier.TerminalCodes.includes(x)
              );
            }
            this.setState(modCarrier);
          }
        });
      } else {
        var listOptions = lodash.cloneDeep(this.state.listOptions);
        var modCarrier = lodash.cloneDeep(this.state.modCarrier);
        modCarrier.TerminalCodes = [];
        listOptions.terminalCodes = [];
        this.setState({ modCarrier, listOptions });
      }
    } catch (error) {
      console.log(
        "CarrierDetailyComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  handleshareholderChange = (shareholderList, fieldName) => {
    var modCarrier = lodash.cloneDeep(this.state.modCarrier);
    try {
      if (fieldName === "ShareholderCodes") {
        modCarrier[fieldName] = shareholderList;
      } else {
        if (shareholderList.length > 0)
          modCarrier[fieldName] = shareholderList[0];
      }
      this.setState({ modCarrier }, this.getTerminalsList(shareholderList));
    } catch (error) {
      console.log(
        "CarrierDetailyComposite:Error occured on handleshareholderChange",
        error
      );
    }
  };

  getTransportationType() {
    var transportationType = Constants.TransportationType.ROAD;
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transportationType = genericProps.transportationType;
    }
    return transportationType;
  }

  validateSave(modCarrier, attributeList) {
    var transportationType = this.getTransportationType();
    //const { modCarrier } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(carrierValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        carrierValidationDef[key],
        modCarrier[key]
      );
    });
    if (modCarrier.Status !== this.state.carrier.Status) {
      if (modCarrier.Remarks === null || modCarrier.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }
    //Permit Expiry validations
    // if (validationErrors["PermitExpiryDate"] === "") {
    //   if (
    //     Date.parse(modCarrier.PermitExpiryDate) <
    //     new Date().setHours(0, 0, 0, 0)
    //   ) {
    //     validationErrors["PermitExpiryDate"] =
    //       "CarrierDetails_regexpPermitExpiryDate2";
    //   }
    // }
    //Shareholder validations
    if (transportationType === Constants.TransportationType.ROAD) {
      if (
        modCarrier.ShareholderCode === null ||
        modCarrier.ShareholderCode.trim() === ""
      )
        validationErrors["ShareholderCode"] =
          "MarineReceipt_MandatoryShareholder";
    } else {
      if (
        modCarrier.ShareholderCodes === null ||
        modCarrier.ShareholderCodes.length === 0
      )
        validationErrors["ShareholderCodes"] =
          "MarineReceipt_MandatoryShareholder";
    }
    //Carrier Identity Validations
    const expressionValidator = "^[0-9]+$";
    const identityNumber = modCarrier["IdentityNumber"];
    if (
      identityNumber !== undefined &&
      identityNumber !== "" &&
      identityNumber !== null
    ) {
      const value = identityNumber.substring(0, identityNumber.length - 1);
      if (value.length > 9) {
        validationErrors["IdentityNumber"] = "CarrierDetails_MaxLengthExceeded";
      } else if (!value.match(expressionValidator)) {
        validationErrors["IdentityNumber"] = "CarrierDetails_regMobile";
      } else validationErrors["IdentityNumber"] = "";
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
  }
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  saveCarrier= () => {
    try {
      this.setState({ saveEnabled: false });
      let tempCarrier = lodash.cloneDeep(this.state.tempCarrier);

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      tempCarrier.Attributes = Utilities.fillAttributeDetails(attributeList);
      tempCarrier = Utilities.convertDatesToString(
        DateFieldsInEntities.DatesInEntity.CarrierCompany,
        tempCarrier
      );
      this.state.carrier.Code === ""
        ? this.createCarrier(tempCarrier)
        : this.updateCarrier(tempCarrier);
     
    } catch (error) {
      console.log("CarrierDetailsComposite : Error in saveBaseProduct");
    }
  };
  handleSave = () => {
    try {
      // this.setState({ saveEnabled: false });
      let modCarrier = lodash.cloneDeep(this.state.modCarrier);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      if (this.validateSave(modCarrier, attributeList)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempCarrier = lodash.cloneDeep(modCarrier);
        this.setState({ showAuthenticationLayout, tempCarrier }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCarrier();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("CarrierDetailyComposite:Error occured on handleSave", error);
    }
  };
 

  createCarrier(modCarrier) {
    var keyCode = [
      {
        key: KeyCodes.carrierCode,
        value: modCarrier.Code,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.carrierCode,
      KeyCodes: keyCode,
      Entity: modCarrier,
    };
    // obj.Entity.ShareholderCode = this.state.modCarrier.ShareholderCode;
    // obj.Entity.TransportationType = "ROAD";
    var notification = {
      messageType: "critical",
      message: "CarrierDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["CarrierDetails_CarrierCode"],
          keyValues: [this.state.modCarrier.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    //console.log(JSON.stringify(obj));
    axios(
      RestAPIs.CreateCarrier,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
      //   {
      //   method: "POST",
      //   withCredentials: true,
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   data: obj,
      // }
    )
      .then((response) => {
        var result = response.data;
        //console.log(result);
        //console.log("IsSuccess-", result.IsSuccess);
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            carrier: lodash.cloneDeep(this.state.modCarrier),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCarrierCompany
            ),
            showAuthenticationLayout: false,

            //shareholderDisabled: true,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCarrierCompany
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in CreateCarrier:", result.ErrorList);
        }
        this.props.onSaved(this.state.modCarrier, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCarrierCompany
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modCarrier, "add", notification);
      });
  }

  updateCarrier(modCarrier) {
    var keyCode = [
      {
        key: KeyCodes.carrierCode,
        value: modCarrier.Code,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.carrierCode,
      KeyCodes: keyCode,
      Entity: modCarrier,
    };
    var notification = {
      messageType: "critical",
      message: "CarrierDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["CarrierDetails_CarrierCode"],
          keyValues: [this.state.modCarrier.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    //console.log(JSON.stringify(obj));
    axios(
      RestAPIs.UpdateCarrier,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        // console.log(result);
        // console.log("IsSuccess-", result.IsSuccess);
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            // carrier: lodash.cloneDeep(this.state.modCarrier),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCarrierCompany
            ),
            showAuthenticationLayout: false,

          });
          this.getCarrierCompany({
            selectedRow: {
              Common_Code: this.state.modCarrier.Code,
              Common_Shareholder: this.state.modCarrier.ShareholderCode,
            },
          });
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCarrierCompany
            ),
            showAuthenticationLayout: false,

          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateCarrier:", result.ErrorList);
        }

        this.props.onSaved(this.state.modCarrier, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modCarrier, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnCarrierCompany
          ),
          showAuthenticationLayout: false,

        });
      });
  }

  handleReset = () => {
    try {
      var modCarrier = lodash.cloneDeep(this.state.carrier);
      const validationErrors = { ...this.state.validationErrors };
      const carrier = lodash.cloneDeep(this.state.carrier);
      var transportationType = this.getTransportationType();

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modCarrier: { ...carrier },
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modCarrier.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
          this.getTerminalsList(
            transportationType === Constants.TransportationType.ROAD
              ? [carrier.ShareholderCode]
              : carrier.ShareholderCodes
          );
        }
      );
    } catch (error) {
      console.log(
        "CarrierDetailyComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = { ...this.state.validationErrors };
      var modCarrier = lodash.cloneDeep(this.state.modCarrier);

      validationErrors[propertyName] = error;
      modCarrier[propertyName] = value;
      this.setState({ validationErrors, modCarrier });
    } catch (error) {
      console.log(
        "CarrierDetailyComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };
  handleCarrierIdentityChange = (propertyName, propertyType, value) => {
    try {
      var validationErrors = { ...this.state.validationErrors };
      var modCarrier = lodash.cloneDeep(this.state.modCarrier);
      const defaultValue = "000000000U";
      const expressionValidator = "^[0-9]+$";
      var oldValue = modCarrier[propertyName];
      if (oldValue === undefined || oldValue === "" || oldValue === null) {
        oldValue = defaultValue;
      }
      var updatedValue = "";
      if (propertyType === "identifier") {
        if (value === "U") {
          updatedValue = defaultValue;
          validationErrors[propertyName] = "";
        } else
          updatedValue = oldValue.substring(0, oldValue.length - 1) + value;
      } else {
        if (value.length > 9) {
          validationErrors[propertyName] = "CarrierDetails_MaxLengthExceeded";
        } else if (!value.match(expressionValidator)) {
          validationErrors[propertyName] = "CarrierDetails_regMobile";
        } else validationErrors[propertyName] = "";
        updatedValue = value + oldValue[oldValue.length - 1];
      }
      modCarrier[propertyName] = updatedValue;
      this.setState({ modCarrier, validationErrors });
    } catch (error) {
      console.log(
        "CarrierDetailyComposite:Error occured on handleCarrierIdentityChange",
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
            attributeMetaDataList.carriercompany
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
      var listOptions = { ...this.state.listOptions };
      var modCarrier = lodash.cloneDeep(this.state.modCarrier);
      if (checked) modCarrier.TerminalCodes = [...listOptions.terminalCodes];
      else modCarrier.TerminalCodes = [];
      this.setState({ modCarrier });
      this.terminalSelectionChange(modCarrier.TerminalCodes);
    } catch (error) {
      console.log(
        "CarrierDetailyComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };
  handleActiveStatusChange = (value) => {
    try {
      let modCarrier = lodash.cloneDeep(this.state.modCarrier);
      modCarrier.Status = value;
      if (modCarrier.Status !== this.state.carrier.Active)
        modCarrier.Remarks = "";
      this.setState({ modCarrier });
    } catch (error) {
      console.log(error);
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
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "CarrierDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };
  getKPIList(shareholder, carrierCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      
      var transportationType = this.getTransportationType();
      let Parameters = transportationType === Constants.TransportationType.ROAD ? [{ key: "ShareholderCode", value: shareholder }, {
        key: "CarrierCode", value: carrierCode
      }] : [{
        key: "CarrierCode", value: carrierCode
      }];
      let objKPIRequestData = {
        PageName: kpiCarrierDetail,
        TransportationType: transportationType,
        InputParameters: Parameters,
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
              carrierCompanyKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ carrierCompanyKPIList: [] });
            console.log("Error in vehicle KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Vehicle KPIList:", error);
        });
    }
  }
  render() {
    const popUpContents = [
      {
        fieldName: "CarrierDetails_LastUpdatedDateTime",
        fieldValue:
          new Date(this.state.modCarrier.LastUpdatedDate).toLocaleDateString() +
          " " +
          new Date(this.state.modCarrier.LastUpdatedDate).toLocaleTimeString(),
      },
      {
        fieldName: "AccessCardInfo_LastActive",
        fieldValue:
          new Date(this.state.modCarrier.LastActiveDate).toLocaleDateString() +
          " " +
          new Date(this.state.modCarrier.LastActiveDate).toLocaleTimeString(),
      },
      {
        fieldName: "CarrierDetails_CreatedDateTime",
        fieldValue:
          new Date(this.state.modCarrier.CreatedDate).toLocaleDateString() +
          " " +
          new Date(this.state.modCarrier.CreatedDate).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.carrier.Code}
            newEntityName="CarrierDetails_CarrierHeader"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.carrierCompanyKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <CarrierDetails
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            carrier={this.state.carrier}
            modCarrier={this.state.modCarrier}
            validationErrors={this.state.validationErrors}
            attributeValidationErrors={this.state.attributeValidationErrors}
            listOptions={this.state.listOptions}
            genericProps={this.props.genericProps}
            onFieldChange={this.handleChange}
            onDateTextChange={this.handleDateTextChange}
            onCarrierIdentifierChange={this.handleCarrierIdentityChange}
            onShareholderChange={this.handleshareholderChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            onAttributeDataChange={this.handleAttributeDataChange} 
          ></CarrierDetails>
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
              this.state.carrier.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnCarrierCompany}
            handleOperation={this.saveCarrier}
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

export default connect(mapStateToProps)(CarrierDetailsComposite);

CarrierDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
