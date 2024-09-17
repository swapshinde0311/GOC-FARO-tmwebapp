import React, { Component } from "react";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import ErrorBoundary from "../../ErrorBoundary";
import SupplierDetails from "../../UIBase/Details/SupplierDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { supplierValidationDef, dchAttributeValidationDef } from "../../../JS/ValidationDef";
import lodash from "lodash";
import { functionGroups, fnSupplier,fnKPIInformation } from "../../../JS/FunctionGroups";
import { emptySupplier } from "../../../JS/DefaultEntities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import PropTypes from "prop-types";
import { supplierOriginTerminalValidationDef } from "../../../JS/DetailsTableValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { supplierAttributeEntity } from "../../../JS/AttributeEntity";
import * as Constants from "../../../JS/Constants";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { kpiSupplierDetail } from "../../../JS/KPIPageName";
class SupplierDetailsComposite extends Component {
  state = {
    supplier: {},
    modSupplier: {},
    modAssociations: [],
    validationErrors: Utilities.getInitialValidationErrors(
      supplierValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    selectedAssociations: [],
    customerOptions: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    isDCHEnabled: false,
    modDCHAttributes: [],
    dchAttribute: [],
    dchAttributeValidationErrors: {},
    supplierKPIList: [],
    tempSupplier: {},
    showAuthenticationLayout: false,

  };
  handleChange = (propertyName, data) => {
    try {
      const modSupplier = lodash.cloneDeep(this.state.modSupplier);
      modSupplier[propertyName] = data;
      this.setState({ modSupplier });
      if (supplierValidationDef[propertyName] !== undefined) {
        var validationErrors = { ...this.state.validationErrors };
        validationErrors[propertyName] = Utilities.validateField(
          supplierValidationDef[propertyName],
          data
        );

        this.setState({ validationErrors });
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };


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
      let modSupplier = lodash.cloneDeep(this.state.modSupplier);
      let dcAttributeConfig = {
        Shareholdercode: this.props.selectedShareholder,
        EntityCode: modSupplier.Code,
        EntityType: Constants.ExtendEntity.SUPPLIER
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
      var modSupplier = lodash.cloneDeep(this.state.modSupplier);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.supplier.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modSupplier.Attributes.find(
                (supplierAttribute) => {
                  return supplierAttribute.TerminalCode === terminal;
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
        "SupplierDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.supplier) && attributeMetaDataList.supplier.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.supplier[0].TerminalCode,
        ]);
      }
     
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    modAssociations[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ modAssociations });
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
        "CustomerDetailsComposite:Error occured on handleCellDataEdit",
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
        "SupplierDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      //console.log(nextProps);

      if (
        this.state.supplier.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        //console.log(nextProps);
        this.getSupplier(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on componentWillReceiveProps",
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
        attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
          attributeMetaDataList.supplier
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

  saveSupplier = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempSupplier = lodash.cloneDeep(this.state.tempSupplier);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      tempSupplier = this.fillAttributeDetails(tempSupplier, attributeList);
      this.state.supplier.Code === ""
        ? this.createSupplier(tempSupplier)
        : this.updateSupplier(tempSupplier);
    } catch (error) {
      console.log("SupplierDetailsComposite : Error in saveSupplier");
    }
  };
  handleSave = () => {
    try {
      let modSupplier = lodash.cloneDeep(this.state.modSupplier);
      let modAssociations = lodash.cloneDeep(this.state.modAssociations);
      modAssociations.forEach(
        (association) => (association.SupplierCode = modSupplier.Code)
      );
      modSupplier.SupplierOriginTerminals = Utilities.removeSeqNumberFromListObject(
        modAssociations
      );
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      // this.setState({ saveEnabled: false });

      if (this.validateSave(modSupplier, attributeList)) {
        modSupplier = this.fillAttributeDetails(modSupplier, attributeList);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempSupplier = lodash.cloneDeep(modSupplier);
        this.setState({ showAuthenticationLayout, tempSupplier }, () => {
          if (showAuthenticationLayout === false) {
            this.saveSupplier();
          }
        })
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillAttributeDetails(modSupplier, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modSupplier.Attributes = Utilities.fillAttributeDetails(attributeList);

      if (this.state.isDCHEnabled) {
        let modDCHAttributes = lodash.cloneDeep(this.state.modDCHAttributes)
        modSupplier.IsDCHEnabled = true;
        if (modDCHAttributes !== null && modDCHAttributes !== undefined && modDCHAttributes.length > 0) {
          let dchAttributeInfo = {
            EntityCode: modSupplier.Code,
            EntityType: Constants.ExtendEntity.SUPPLIER,
            Shareholdercode: this.props.selectedShareholder,
            TabAttributeDataList: []
          }

          modDCHAttributes.forEach((attribute) => {
            dchAttributeInfo.TabAttributeDataList.push(attribute)
          })
          modSupplier.DCHAttribute = dchAttributeInfo;
        }
      }
      else {
        modSupplier.IsDCHEnabled = false;
        modSupplier.DCHAttribute = null;
      }
      return modSupplier;
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  validateSave(modSupplier, attributeList) {
    // const { modTrailer } = this.state;
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(supplierValidationDef).forEach(function (key) {
      if (modSupplier[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          supplierValidationDef[key],
          modSupplier[key]
        );
    });
    if (modSupplier.Status !== this.state.supplier.Status) {
      if (modSupplier.Remarks === null || modSupplier.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }
    if (
      modSupplier.TransportationTypes === null ||
      modSupplier.TransportationTypes.length === 0
    )
      validationErrors["TransportationTypes"] = "Vehicle_MandatoryTrasType";

    let notification = {
      messageType: "critical",
      message: "Supplier_SavedStatus",
      messageResultDetails: [],
    };

    let uniqueRecords = [
      ...new Set(
        modSupplier.SupplierOriginTerminals.map((a) => a.OriginTerminalCode)
      ),
    ];
    if (uniqueRecords.length !== modSupplier.SupplierOriginTerminals.length) {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "Duplicate_Associated_Origins",
      });
      this.props.onSaved(this.state.modSupplier, "update", notification);
      return false;
    }
    if (
      Array.isArray(modSupplier.SupplierOriginTerminals) &&
      modSupplier.SupplierOriginTerminals.length > 0
    ) {
      modSupplier.SupplierOriginTerminals.forEach((association) => {
        supplierOriginTerminalValidationDef.forEach((col) => {
          let err = "";

          if (col.validator !== undefined) {
            err = Utilities.validateField(
              col.validator,
              association[col.field]
            );
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: ["OriginTerminal_Code", col.displayName],
              keyValues: [
                association.OriginTerminalCode,
                association[col.field],
              ],
              isSuccess: false,
              errorMessage: err,
            });
          }
        });
      });
    } else {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "Supplier_OriginTerminal_Association_Require",
      });
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
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modSupplier, "update", notification);
      return false;
    }
    return returnValue;
  }
  updateSupplier(modSupplier) {
    let keyCode = [
      {
        key: KeyCodes.supplierCode,
        value: modSupplier.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.supplierCode,
      KeyCodes: keyCode,
      Entity: modSupplier,
    };

    let notification = {
      messageType: "critical",
      message: "Supplier_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Supplier_Code"],
          keyValues: [modSupplier.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateSupplier,
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
                fnSupplier
              ),
              showAuthenticationLayout: false,

            },
            () => this.getSupplier({ Common_Code: modSupplier.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnSupplier
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in UpdateSupplier:", result.ErrorList);
        }
        // console.log(notification);
        this.props.onSaved(modSupplier, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnSupplier
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modSupplier, "add", notification);
      });
  }

  createSupplier(modSupplier) {
    let keyCode = [
      {
        key: KeyCodes.supplierCode,
        value: modSupplier.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.supplierCode,
      KeyCodes: keyCode,
      Entity: modSupplier,
    };

    let notification = {
      messageType: "critical",
      message: "Supplier_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Supplier_Code"],
          keyValues: [modSupplier.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateSupplier,
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
                fnSupplier
              ),
              showAuthenticationLayout: false,

            },
            () => this.getSupplier({ Common_Code: modSupplier.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnSupplier
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in CreateSupplier:", result.ErrorList);
        }
        // console.log(notification);
        this.props.onSaved(modSupplier, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnSupplier
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modSupplier, "add", notification);
      });
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      // this.getSupplier(this.props.selectedRow);
      this.getAttributes(this.props.selectedRow);
      this.getOriginTerminalList(this.props.selectedShareholder);
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(supplierRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [supplierAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.supplier
              ),
            },
            () => this.getSupplier(supplierRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getSupplier(supplierRow) {
    // let driver = props.selectedRow;
    emptySupplier.ShareholderCode = this.props.selectedShareholder;
    emptySupplier.TransportationTypes = this.props.userDetails.EntityResult.TransportationTypes;
    emptySupplier.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    //    var terminalCodes = [...this.state.terminalCodes];
    if (supplierRow.Common_Code === undefined) {
      // terminalCodes = [];
      this.setState(
        {
          supplier: lodash.cloneDeep(emptySupplier),
          modSupplier: lodash.cloneDeep(emptySupplier),
          modAttributeMetaDataList: [],
          isReadyToRender: true,
          modAssociations: [],
          supplierKPIList:[],
          // terminalCodes,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnSupplier
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
        key: KeyCodes.supplierCode,
        value: supplierRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.supplierCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetSupplier,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        // console.log(result);
        if (result.IsSuccess === true) {
          // this.getTerminalsForCarrier(result.EntityResult.CarrierCode);
          this.setState(
            {
              isReadyToRender: true,
              supplier: result.EntityResult,
              modSupplier: lodash.cloneDeep(result.EntityResult),
              modAssociations: Array.isArray(
                result.EntityResult.SupplierOriginTerminals
              )
                ? Utilities.addSeqNumberToListObject(
                  lodash.cloneDeep(
                    result.EntityResult.SupplierOriginTerminals
                  )
                )
                : [],
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnSupplier
              ),

            },
            () => {
              this.getKPIList(this.props.selectedShareholder,result.EntityResult.Code)
              if (this.props.userDetails.EntityResult.IsDCHEnabled)
                this.getShareholderDetail(this.props.selectedShareholder);
              // this.getTerminalsForCarrier(result.EntityResult.CarrierCode)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            modSupplier: lodash.cloneDeep(emptySupplier),
            supplier: lodash.cloneDeep(emptySupplier),
            modAssociations: [],
            isReadyToRender: true,
          }, () => {
            if (this.props.userDetails.EntityResult.IsDCHEnabled)
              this.getShareholderDetail(this.props.selectedShareholder);
          });
          console.log("Error in GetSupplier:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Supplier:", error, supplierRow);
      });
  }

  handleReset = () => {
    var modSupplier = lodash.cloneDeep(this.state.supplier);
    try {
      this.setState(
        {
          modSupplier: lodash.cloneDeep(this.state.supplier),
          validationErrors: [],
          modAttributeMetaDataList: [],
          modAssociations: Array.isArray(
            this.state.supplier.SupplierOriginTerminals
          )
            ? Utilities.addSeqNumberToListObject(
              lodash.cloneDeep(this.state.supplier.SupplierOriginTerminals)
            )
            : [],
          dchAttributeValidationErrors: {},
          modDCHAttributes: lodash.cloneDeep(this.state.dchAttribute)
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modSupplier.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.supplier.Code === "") {
        var terminalCodes = [...this.state.terminalCodes];
        terminalCodes = [];
        this.setState({ terminalCodes });
      }
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.props.terminalCodes];
      var modSupplier = lodash.cloneDeep(this.state.modSupplier);

      if (checked) modSupplier.TerminalCodes = [...terminalCodes];
      else modSupplier.TerminalCodes = [];
      this.setState({ modSupplier: modSupplier });
      this.terminalSelectionChange(modSupplier.TerminalCodes);
    } catch (error) {
      console.log(
        "SupplierDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };
  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.modAssociations.length < this.state.customerOptions.length
        ) {
          let modAssociations = lodash.cloneDeep(this.state.modAssociations);
          let newAssociation = {
            SeqNumber: null,
            OriginTerminalCode: null,
            SupplierCode: null,
            ContactPerson: null,
            Email: null,
            Mobile: null,
            Phone: null,
            ShareholderCode: this.props.selectedShareholder,
          };
          newAssociation.SeqNumber = Utilities.getMaxSeqNumberfromListObject(
            modAssociations
          );

          if (this.state.customerOptions.length === 1) {
            newAssociation.OriginTerminalCode = this.state.customerOptions[0].value;
          }

          modAssociations.push(newAssociation);

          this.setState({
            modAssociations,
            selectedAssociations: [],
          });
        }
      } catch (error) {
        console.log(
          "SupplierDetailsComposite:Error occured on handleAddAssociation",
          error
        );
      }
    }
  };
  handleDeleteAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedAssociations != null &&
          this.state.selectedAssociations.length > 0
        ) {
          if (this.state.modAssociations.length > 0) {
            let modAssociations = lodash.cloneDeep(this.state.modAssociations);

            this.state.selectedAssociations.forEach((obj, index) => {
              modAssociations = modAssociations.filter(
                (association, cindex) => {
                  return association.SeqNumber !== obj.SeqNumber;
                }
              );
            });

            this.setState({ modAssociations, selectedAssociations: [] });
          }
        }
      } catch (error) {
        console.log(
          "SupplierDetailsComposite:Error occured on handleDeleteAssociation",
          error
        );
      }
    }
  };
  handleAssociationSelectionChange = (associations) => {
    this.setState({ selectedAssociations: associations });
  };

  getOriginTerminalList(shareholder) {
    axios(
      RestAPIs.GetOriginTerminalsList +
      "?ShareholderCode=" +
      shareholder +
      "&TransportationType=",

      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        // console.log(response);

        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let customerOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ customerOptions });
          } else {
            console.log("supplierOrigins not identified for shareholder");
          }
        }
      })
      .catch((error) => {
        console.log("Error while getting OriginTerminal List:", error);
      });
  }

  handleActiveStatusChange = (value) => {
    try {
      let modSupplier = lodash.cloneDeep(this.state.modSupplier);
      modSupplier.Status = value;
      if (modSupplier.Status !== this.state.supplier.Status)
        modSupplier.Remarks = "";
      this.setState({ modSupplier });
    } catch (error) {
      console.log(error);
    }
  };
  //Get KPI for Supplier
  getKPIList(shareholder,supplierCode) {
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
        PageName: kpiSupplierDetail,
        TransportationType: transportationType,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "SupplierCode", value: supplierCode }],
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
              supplierKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ supplierKPIList: [] });
            console.log("Error in supplier KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Supplier KPIList:", error);
        });
    }
  }
  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modSupplier.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modSupplier.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modSupplier.LastActiveTime !== undefined &&
            this.state.modSupplier.LastActiveTime !== null
            ? new Date(
              this.state.modSupplier.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modSupplier.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modSupplier.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modSupplier.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.supplier.Code}
            newEntityName="SupplierInfo_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.supplierKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <SupplierDetails
            supplier={this.state.supplier}
            modSupplier={this.state.modSupplier}
            modAssociations={this.state.modAssociations}
            modDCHAttributes={this.state.modDCHAttributes}
            validationErrors={this.state.validationErrors}
            listOptions={{
              transportationTypes: Utilities.transferListtoOptions(
                this.props.userDetails.EntityResult.TransportationTypes
              ),
              terminalCodes: this.props.terminalCodes,
              customerOptions: this.state.customerOptions,
            }}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            selectedAssociations={this.state.selectedAssociations}
            handleRowSelectionChange={this.handleAssociationSelectionChange}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            handleAddAssociation={this.handleAddAssociation}
            handleDeleteAssociation={this.handleDeleteAssociation}
            handleCellDataEdit={this.handleCellDataEdit}
            onAttributeDataChange={this.handleAttributeDataChange} 
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            isDCHEnabled={this.state.isDCHEnabled}
            dchAttributeValidationErrors={this.state.dchAttributeValidationErrors}
            handleDCHCellDataEdit={this.handleDCHCellDataEdit}
          ></SupplierDetails>
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
              this.state.supplier.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnSupplier}
            handleOperation={this.saveSupplier}
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

export default connect(mapStateToProps)(SupplierDetailsComposite);

SupplierDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
