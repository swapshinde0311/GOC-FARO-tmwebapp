import React, { Component } from "react";
import { emptyFinishedProduct } from "../../../JS/DefaultEntities";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import lodash from "lodash";
import axios from "axios";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import FinishedProductDetails from "../../UIBase/Details/FinishedProductDetails";
import { functionGroups, fnFinishedProduct,fnKPIInformation } from "../../../JS/FunctionGroups";
import { finishedProductValidationDef } from "../../../JS/ValidationDef";
import { fPAssociationInfoValidationDef } from "../../../JS/DetailsTableValidationDef";
import { finishedProductAttributeEntity } from "../../../JS/AttributeEntity";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiFinishedProductDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class FinishedProductDetailsComposite extends Component {
  state = {
    finishedProduct: {},
    baseProductDetails: {},
    additiveDetails: {},
    modFinishedProduct: {},
    appliedColor: "",
    selColor: "",
    modAssociations: [],
    validationErrors: Utilities.getInitialValidationErrors(
      finishedProductValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    showColorPicker: false,
    isValidHex: true,
    productTypeOptions: [],
    densityUOMOptions: [],
    volumeUOMOptions: [],
    expandedRows: [],
    selectedAssociationRows: [],
    prodFamilyOptions: [],
    isValidShareholderSysExtCode: false,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    finishedProductKPIList: [],
    hazardousEnabled: false,
    hazardousProductCategoryOptions: [],
    showAuthenticationLayout: false,
    tempFinishedProduct: {},
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.finishedProduct.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getFinishedProduct(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on componentWillReceiveProps",
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
        Array.isArray(attributeMetaDataList.finishedproduct) &&
        attributeMetaDataList.finishedproduct.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.finishedproduct[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }
  getAttributes(finishedProductRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [finishedProductAttributeEntity],
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
                  result.EntityResult.finishedproduct
                ),
            },
            () => this.getFinishedProduct(finishedProductRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (this.props.userDetails.EntityResult.IsDCHEnabled) {
        this.GetProdFamilyList();
        this.getShareholderDetail(this.props.selectedShareholder);
      }
      this.getHazardousLookup();
      this.getBaseProductList();
      this.getAdditivesList();
      // this.getFinishedProduct(this.props.selectedRow);
      this.getAttributes(this.props.selectedRow);
      this.getProductTypes();
      this.GetUOMList();
      // this.getHazardousCategories();
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on componentDidMount",
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
      var modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.finishedproduct.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modFinishedProduct.Attributes.find(
                (finishedProcductAttribute) => {
                  return finishedProcductAttribute.TerminalCode === terminal;
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
        "FinishedProductDetailsComposite:Error occured on terminalSelectionChange",
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
            isValidShareholderSysExtCode:
              result.EntityResult.ExternalSystemCode > 1 ? true : false,
          });
        } else {
          this.setState({
            isValidShareholderSysExtCode: false,
          });
          console.log("Error in GetDestination:", result.ErrorList);
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

  createFinishedProduct(modFinishedProduct) {
    let keyCode = [
      {
        key: KeyCodes.finishedProductCode,
        value: modFinishedProduct.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.finishedProductCode,
      KeyCodes: keyCode,
      Entity: modFinishedProduct,
    };

    let notification = {
      messageType: "critical",
      message: "FinishedProduct_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["FinishedProductList_Code"],
          keyValues: [modFinishedProduct.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateFinishedProduct,
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
                fnFinishedProduct
              ),
              expandedRows: [],
              showAuthenticationLayout: false,
            },
            () =>
              this.getFinishedProduct({ Common_Code: modFinishedProduct.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          modFinishedProduct.Color = "#" + modFinishedProduct.Color;
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnFinishedProduct,
              modFinishedProduct
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateFinishedProduct:", result.ErrorList);
        }
        this.props.onSaved(modFinishedProduct, "add", notification);
      })
      .catch((error) => {
        modFinishedProduct.Color = "#" + modFinishedProduct.Color;
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnFinishedProduct,
            modFinishedProduct
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modFinishedProduct, "add", notification);
      });
  }

  fillDetails(modAssociations) {
    let AssociationDetails = [];
    try {
      if (Array.isArray(modAssociations)) {
        modAssociations.forEach((association) => {
          if (
            !(
              association.BaseProductCode === null ||
              association.BaseProductCode === ""
            ) ||
            !(association.Quantity === null || association.Quantity === "")
          ) {
            AssociationDetails.push({
              AdditiveCode: association.AdditiveCode,
              BaseProductCode: association.BaseProductCode,
              FinishedProductCode: this.state.modFinishedProduct.Code,
              Quantity: association.Quantity,
              SequenceNumber: association.SeqNumber,
              Version: association.Version,
            });
          }

          if (Array.isArray(association.addtiveAssociations)) {
            association.addtiveAssociations.forEach((addv) => {
              if (
                !(addv.AdditiveCode === null || addv.AdditiveCode === "") ||
                !(addv.Quantity === null || addv.Quantity === "")
              ) {
                AssociationDetails.push({
                  AdditiveCode: addv.AdditiveCode,
                  BaseProductCode: addv.BaseProductCode,
                  FinishedProductCode: this.state.modFinishedProduct.Code,
                  Quantity: addv.Quantity,
                  SequenceNumber: addv.SequenceNumber,
                  Version: addv.Version,
                });
              }
            });
          }
        });
      }
    } catch (error) {
      console.log("Error while making Finished Product body:", error);
    }
    return AssociationDetails;
  }

  handleChange = (propertyName, data) => {
    try {
      const modFinishedProduct = lodash.cloneDeep(
        this.state.modFinishedProduct
      );
      if (propertyName === "WeighBridgeWeighingRequired" && data === true)
        modFinishedProduct.WeighingRequired = true;
      modFinishedProduct[propertyName] = data;

      if (propertyName === "ProductType") {
        this.handleProductTypeChange(data);
      }

      const validationErrors = { ...this.state.validationErrors };
      if (finishedProductValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          finishedProductValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modFinishedProduct });

      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleProductTypeChange = (prodType) => {
    try {
      var modAssociations = lodash.cloneDeep(this.state.modAssociations);
      const baseProductDetails = lodash.cloneDeep(
        this.state.baseProductDetails
      );
      if (prodType !== "ALLPROD") {
        if (baseProductDetails !== undefined && baseProductDetails !== null) {
          var bpList = baseProductDetails[prodType];
          if (bpList === undefined || bpList === null) bpList = [];
          (baseProductDetails["ALLPROD"] || []).forEach((bp) => {
            bpList.push(bp);
          });

          modAssociations = modAssociations.filter(
            (x) => bpList.indexOf(x.BaseProductCode) >= 0
          );
        }
      }
      this.setState({ modAssociations });
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite : Error in handleProductTypeChange"
      );
    }
  };

  handleReset = () => {
    try {
      let modAssociations = [];
      if (this.state.finishedProduct.Code === "") {
        modAssociations = [];
      } else {
        modAssociations = this.getFinishedProductAssociations(
          this.state.finishedProduct.FinishedProductItems
        );
      }
      var modFinishedProduct = lodash.cloneDeep(this.state.finishedProduct);
      let color = "";
      if (
        this.state.finishedProduct.Color !== null &&
        this.state.finishedProduct.Color !== ""
      ) {
        color = "#" + this.state.finishedProduct.Color;
      }
      modFinishedProduct.Color = color;

      this.setState(
        {
          modFinishedProduct,
          validationErrors: [],
          modAssociations,
          modAttributeMetaDataList: [],
          selColor: color,
          appliedColor: color,
          showColorPicker: false,
          isValidHex: true,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modFinishedProduct.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.finishedProduct.Code === "") {
        var terminalCodes = [...this.state.terminalCodes];
        terminalCodes = [];
        this.setState({ terminalCodes });
      }
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  saveFinishProduct = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempFinishedProduct = lodash.cloneDeep(this.state.tempFinishedProduct);

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      tempFinishedProduct = this.convertStringtoDecimal(
        tempFinishedProduct,
        attributeList
      );
      this.state.finishedProduct.Code === ""
        ? this.createFinishedProduct(tempFinishedProduct)
        : this.updateFinishedProduct(tempFinishedProduct);
    } catch (error) {
      console.log("BaseProductDetailsComposite : Error in saveFinishProduct");
    }
  };
  handleSave = () => {
    try {
      let modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
      let color = "";
      //
      modFinishedProduct.FinishedProductItems = this.fillDetails(
        this.state.modAssociations
      );
      // this.setState({ saveEnabled: false });
      if (
        modFinishedProduct.Color !== null &&
        modFinishedProduct.Color !== ""
      ) {
        color = lodash.cloneDeep(modFinishedProduct.Color);
        modFinishedProduct.Color = modFinishedProduct.Color.substring(1);
        //modFinishedProduct.Color = color.length == 2 ? color[1] : color[0]
      } else modFinishedProduct.Color = "";
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(modFinishedProduct, attributeList)) {
        modFinishedProduct = this.convertStringtoDecimal(
          modFinishedProduct,
          attributeList
        );
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempFinishedProduct = lodash.cloneDeep(modFinishedProduct);
        this.setState({ showAuthenticationLayout, tempFinishedProduct }, () => {
          if (showAuthenticationLayout === false) {
            this.saveFinishProduct();
          }
      });

        
      } else {
        if (
          modFinishedProduct.Color !== null &&
          modFinishedProduct.Color !== ""
        ) {
          modFinishedProduct.Color = color;
        } else modFinishedProduct.Color = "";
        this.setState({ modFinishedProduct });
      }
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  convertStringtoDecimal(modFinishedProduct, attributeList) {
    try {
      if (
        modFinishedProduct.Density !== null &&
        modFinishedProduct.Density !== ""
      ) {
        modFinishedProduct.Density = Utilities.convertStringtoDecimal(
          modFinishedProduct.Density
        );
      }
      if (
        modFinishedProduct.ToleranceQuantity !== null &&
        modFinishedProduct.ToleranceQuantity !== ""
      ) {
        modFinishedProduct.ToleranceQuantity = Utilities.convertStringtoDecimal(
          modFinishedProduct.ToleranceQuantity
        );
      }
      if (
        modFinishedProduct.ToleranceQuantityForMarine !== null &&
        modFinishedProduct.ToleranceQuantityForMarine !== ""
      ) {
        modFinishedProduct.ToleranceQuantityForMarine =
          Utilities.convertStringtoDecimal(
            modFinishedProduct.ToleranceQuantityForMarine
          );
      }
      if (
        modFinishedProduct.ToleranceQuantityForPipeline !== null &&
        modFinishedProduct.ToleranceQuantityForPipeline !== ""
      ) {
        modFinishedProduct.ToleranceQuantityForPipeline =
          Utilities.convertStringtoDecimal(
            modFinishedProduct.ToleranceQuantityForPipeline
          );
      }
      if (
        modFinishedProduct.ToleranceQuantityForRail !== null &&
        modFinishedProduct.ToleranceQuantityForRail !== ""
      ) {
        modFinishedProduct.ToleranceQuantityForRail =
          Utilities.convertStringtoDecimal(
            modFinishedProduct.ToleranceQuantityForRail
          );
      }

      if (this.state.hazardousEnabled) {
        if (
          modFinishedProduct.SFLPercent !== null &&
          modFinishedProduct.SFLPercent !== ""
        ) {
          modFinishedProduct.SFLPercent = Utilities.convertStringtoDecimal(
            modFinishedProduct.SFLPercent
          );
        }
      }
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modFinishedProduct.Attributes =
        Utilities.fillAttributeDetails(attributeList);
      return modFinishedProduct;
    } catch (err) {
      console.log("convertStringtoDecimal error finishedProduct details", err);
    }
  }

  getProductTypes() {
    axios(
      RestAPIs.GetProductType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var productTypeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ productTypeOptions });
          }
        } else {
          console.log("Error in getProductTypes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getProductTypes:", error);
      });
  }

  updateFinishedProduct(modFinishedProduct) {
    let keyCode = [
      {
        key: KeyCodes.finishedProductCode,
        value: modFinishedProduct.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.finishedProductCode,
      KeyCodes: keyCode,
      Entity: modFinishedProduct,
    };

    let notification = {
      messageType: "critical",
      message: "FinishedProduct_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["FinishedProductList_Code"],
          keyValues: [modFinishedProduct.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateFinishedProduct,
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
                fnFinishedProduct
              ),
              showAuthenticationLayout: false,
              expandedRows: [],
            },
            () =>
              this.getFinishedProduct({ Common_Code: modFinishedProduct.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          modFinishedProduct.Color = "#" + modFinishedProduct.Color;
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnFinishedProduct,
              modFinishedProduct
            ),
            showAuthenticationLayout: false,
          });
          console.log(
            "Error in UpdateFinishedProduct Update:",
            result.ErrorList
          );
        }
        this.props.onSaved(modFinishedProduct, "add", notification);
      })
      .catch((error) => {
        modFinishedProduct.Color = "#" + modFinishedProduct.Color;
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnFinishedProduct,
            modFinishedProduct
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modFinishedProduct, "add", notification);
      });
  }

  validateSave(modFinishedProduct, attributeList) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(finishedProductValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          finishedProductValidationDef[key],
          modFinishedProduct[key]
        );
      });
      if (modFinishedProduct.Active !== this.state.finishedProduct.Active) {
        if (
          modFinishedProduct.Remarks === null ||
          modFinishedProduct.Remarks === ""
        ) {
          validationErrors["Remarks"] = "Receipt_RemarksRequired";
        }
      }
      if (this.state.hazardousEnabled) {
        if (
          modFinishedProduct.HazardousCategory !== null &&
          modFinishedProduct.HazardousCategory !== ""
        ) {
          if (
            modFinishedProduct.SFLPercent === "" ||
            modFinishedProduct.SFLPercent === null
          ) {
            validationErrors["SFLPercent"] = "Common_InvalidValue";
          }
        }
      }

      if (
        (modFinishedProduct.ToleranceQuantity !== "" &&
          modFinishedProduct.ToleranceQuantity !== null) ||
        (modFinishedProduct.ToleranceQuantityForMarine !== "" &&
          modFinishedProduct.ToleranceQuantityForMarine !== null) ||
        (modFinishedProduct.ToleranceQuantityForPipeline !== "" &&
          modFinishedProduct.ToleranceQuantityForPipeline !== null) ||
        (modFinishedProduct.ToleranceQuantityForRail !== "" &&
          modFinishedProduct.ToleranceQuantityForRail !== null)
      ) {
        if (
          modFinishedProduct.ToleranceQuantityUOM === null ||
          modFinishedProduct.ToleranceQuantityUOM === ""
        ) {
          validationErrors["ToleranceQuantityUOM"] =
            "ERRMSG_FP_TOLERANCEQTYUOM_REQUIRED";
        }
      }

      if (modFinishedProduct.ExportGrade) {
        if (
          modFinishedProduct.Density === null ||
          modFinishedProduct.Density === ""
        ) {
          validationErrors["Density"] = "DENSITY_EMPTY_X";
        }
        if (
          modFinishedProduct.DensityUOM === null ||
          modFinishedProduct.DensityUOM === ""
        ) {
          validationErrors["DensityUOM"] =
            "BSI_PRODUCTDENSITY_DENSITYUOM_MANDATORY_FOR_EXPORTGRADE_FP";
        }
      }

      if (
        this.state.isValidShareholderSysExtCode &&
        this.props.userDetails.EntityResult.IsDCHEnabled
      ) {
        if (
          modFinishedProduct.ProductFamilyCode === null ||
          modFinishedProduct.ProductFamilyCode === ""
        )
          validationErrors["ProductFamilyCode"] = "FP_ProdFamily_required";
      }

      let notification = {
        messageType: "critical",
        message: "FinishedProduct_SavedStatus",
        messageResultDetails: [],
      };

      let uniqueBPRecords = [
        ...new Set(
          modFinishedProduct.FinishedProductItems.map((a) => a.BaseProductCode)
        ),
      ];

      if (
        uniqueBPRecords.length !==
        modFinishedProduct.FinishedProductItems.filter(
          (d) => d.AdditiveCode === null
        ).length
      ) {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "Duplicate_FP_BP_Details",
        });
        this.props.onSaved(
          this.state.modFinishedProduct,
          "update",
          notification
        );
        return false;
      }

      let uniqueAddvRecords = [];
      modFinishedProduct.FinishedProductItems.forEach((e) => {
        if (e.AdditiveCode !== null && e.AdditiveCode !== "") {
          let uinqueAdvIndex = uniqueAddvRecords.findIndex(
            (data) =>
              e.AdditiveCode === data.Code && e.BaseProductCode === data.BCode
          );
          if (uinqueAdvIndex < 0) {
            uniqueAddvRecords.push({
              Code: e.AdditiveCode,
              BCode: e.BaseProductCode,
            });
          }
        }
      });

      if (
        uniqueAddvRecords.length !==
        modFinishedProduct.FinishedProductItems.filter(
          (d) => d.AdditiveCode !== null && d.AdditiveCode !== ""
        ).length
      ) {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "Duplicate_FP_Addv_Details",
        });
        this.props.onSaved(
          this.state.modFinishedProduct,
          "update",
          notification
        );
        return false;
      }

      if (
        Array.isArray(modFinishedProduct.FinishedProductItems) &&
        modFinishedProduct.FinishedProductItems.length > 0
      ) {
        modFinishedProduct.FinishedProductItems.forEach((fpAssociation) => {
          fPAssociationInfoValidationDef.forEach((col) => {
            let err = "";

            if (col.validator !== undefined) {
              err = Utilities.validateField(
                col.validator,
                fpAssociation[col.field]
              );
            }
            if (
              err !== "" &&
              col.field === "AdditiveCode" &&
              fpAssociation[col.field] === null
            )
              err = "";
            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields:
                  fpAssociation.AdditiveCode === null
                    ? ["FinishedProductInfo_BaseProduct", col.displayName]
                    : [
                        "FinishedProductInfo_BaseProduct",
                        "UnmatchedLocalTrans_Additive",
                        col.displayName,
                      ],
                keyValues:
                  fpAssociation.AdditiveCode === null
                    ? [fpAssociation.BaseProductCode, fpAssociation[col.field]]
                    : [
                        fpAssociation.BaseProductCode,
                        fpAssociation.AdditiveCode,
                        fpAssociation[col.field],
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
          errorMessage: "BP_Associtaion_Required",
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

      if (returnValue)
        returnValue = Object.values(validationErrors).every(function (value) {
          return value === "";
        });

      if (notification.messageResultDetails.length > 0) {
        this.props.onSaved(
          this.state.modFinishedProduct,
          "update",
          notification
        );
        return false;
      }

      return returnValue;
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on ValidateSave",
        error
      );
    }
  }

  handleActiveStatusChange = (value) => {
    try {
      let modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
      modFinishedProduct.Active = value;
      if (modFinishedProduct.Active !== this.state.finishedProduct.Active)
        modFinishedProduct.Remarks = "";
      this.setState({ modFinishedProduct });
    } catch (error) {
      console.log(error);
    }
  };

  handleHexValueChange = (value) => {
    try {
      let modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modFinishedProduct.Color = value;
      this.setState({ modFinishedProduct });
      var regex = /^#[0-9A-Fa-f]{6}$/;
      let isValidHex = regex.test(value);

      if (isValidHex) {
        this.setState({
          selColor: value,
        });
      } else {
        if (
          (value !== undefined || value !== "") &&
          (modFinishedProduct.Color !== "" ||
            modFinishedProduct.Color !== undefined)
        )
          validationErrors["Color"] = "FP_Color_hex";
        this.setState({
          selColor: "#ffffff",
        });
      }
      this.setState({ validationErrors, isValidHex });
    } catch (error) {
      console.log(error);
    }
  };

  GetProdFamilyList() {
    axios(
      RestAPIs.GetProdFamily + this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        //console.log(response);
        var result = response.data;

        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let prodFamilyOptions = [];
            if (
              result.EntityResult !== undefined &&
              result.EntityResult !== null
            ) {
              prodFamilyOptions = Utilities.transferDictionarytoOptions(
                result.EntityResult
              );
            }

            this.setState({ prodFamilyOptions });
          }
        } else {
          console.log("Error in GetProdFamilyList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetProdFamilyList:", error);
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
            let densityUOMOptions = [];
            let volumeUOMOptions = [];
            if (Array.isArray(result.EntityResult.DENSITY)) {
              densityUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.DENSITY
              );
            }
            if (Array.isArray(result.EntityResult.VOLUME)) {
              volumeUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.VOLUME
              );
            }
            if (Array.isArray(result.EntityResult.MASS)) {
              let massUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.MASS
              );
              massUOMOptions.forEach((massUOM) =>
                volumeUOMOptions.push(massUOM)
              );
            }

            this.setState({ volumeUOMOptions, densityUOMOptions });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetUOMList:", error);
      });
  }

  getFinishedProductAssociations(rawAssociations) {
    if (Array.isArray(rawAssociations) && rawAssociations.length > 0) {
      //Get Only Base Products
      let baseProducts = rawAssociations.filter(
        (association) => association.AdditiveCode === null
      );
      //Add unique number to each base product
      baseProducts = Utilities.addSeqNumberToListObject(
        lodash.cloneDeep(baseProducts)
      );

      baseProducts.sort((a, b) => {
        if (a.SequenceNumber > b.SequenceNumber) return 1;
        else if (a.SequenceNumber < b.SequenceNumber) return -1;
        else return 0;
      });
      //Get Additives for each base product
      baseProducts.forEach((baseProduct) => {
        baseProduct.addtiveAssociations = rawAssociations.filter(
          (association) =>
            association.BaseProductCode === baseProduct.BaseProductCode &&
            association.AdditiveCode !== null
        );
        //get unique number for each additive in base product
        baseProduct.addtiveAssociations = Utilities.addSeqNumberToListObject(
          lodash.cloneDeep(baseProduct.addtiveAssociations)
        );

        baseProduct.addtiveAssociations.sort((a, b) => {
          if (a.SeqNumber > b.SeqNumber) return 1;
          else if (a.SeqNumber < b.SeqNumber) return -1;
          else return 0;
        });

        //assign reference of base product to each additive
        baseProduct.addtiveAssociations.forEach(
          (additive) => (additive.baseSeqNumber = baseProduct.SeqNumber)
        );
      });
      return baseProducts;
    } else {
      return [];
    }
  }
  getHazardousLookup() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=HazardousMaterial",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult["RoadEnabled"] &&
            result.EntityResult["RoadEnabled"].toLowerCase() === "true"
          ) {
            this.setState({ hazardousEnabled: true });
            this.getHazardousCategories();
          }
        }
      });
    } catch (error) {
      console.log(
        "FInishedProductDetailsComposite:Error occured on getHazardousLookup",
        error
      );
    }
  }
  getHazardousCategories() {
    axios(
      RestAPIs.GetHazardousProductCategories,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    ).then((response) => {
      var result = response.data;
      if (result.IsSuccess === true) {
        if (
          result.EntityResult !== null &&
          Array.isArray(result.EntityResult)
        ) {
          let categoryOptions = Utilities.transferListtoOptions(
            result.EntityResult
          );
          this.setState({ hazardousProductCategoryOptions: categoryOptions });
        }
      } else {
        console.log("Error in getHazardousCategories:", result.ErrorList);
      }
    });
  }
  catch(error) {
    console.log(
      "FInishedProductDetailsComposite:Error occured on getHazardousCategories",
      error
    );
  }

  getFinishedProduct(finishedProductRow) {
    emptyFinishedProduct.Shareholdercode = this.props.selectedShareholder;
    emptyFinishedProduct.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    if (finishedProductRow.Common_Code === undefined) {
      this.setState(
        {
          finishedProduct: lodash.cloneDeep(emptyFinishedProduct),
          modFinishedProduct: lodash.cloneDeep(emptyFinishedProduct),
          modAttributeMetaDataList: [],
          isReadyToRender: true,
          modAssociations: [],
          finishedProductKPIList:[],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnFinishedProduct
          ),
          selColor: "",
          appliedColor: "",
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
        key: KeyCodes.finishedProductCode,
        value: finishedProductRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.finishedProductCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetFinishedProduct,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        // console.log(result);
        if (result.IsSuccess === true) {
          this.setState(
            {
              isReadyToRender: true,
              finishedProduct: lodash.cloneDeep(result.EntityResult),
              modFinishedProduct: lodash.cloneDeep(result.EntityResult),
              modAssociations: this.getFinishedProductAssociations(
                result.EntityResult.FinishedProductItems
              ),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnFinishedProduct
              ),
            },
            () => {
              // this.getTerminalsForCarrier(result.EntityResult.CarrierCode)
              this.getKPIList(this.props.selectedShareholder, result.EntityResult.Code)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );

          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            //this.hexToRGB(result.EntityResult.Color)
            this.assignColor(result.EntityResult.Color);
            //this.bindBaseProducts(result.EntityResult.ProductType)
          }
        } else {
          this.setState({
            finishedProduct: lodash.cloneDeep(emptyFinishedProduct),
            modFinishedProduct: lodash.cloneDeep(emptyFinishedProduct),
            modAssociations: [],
            isReadyToRender: true,
            selColor: "",
          });
          console.log("Error in GetFinishedProduct:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting Finished Product:",
          error,
          finishedProductRow
        );
      });
  }

  // hexToRGB = (hex) => {
  //   if (hex !== null && hex !== "") {
  //     let hex1 = '0x' + hex
  //     let r = hex1 >> 16 & 0xFF
  //     let g = hex1 >> 8 & 0xFF
  //     let b = hex1 & 0xFF

  //     var selColor = {
  //       "rgb": `rgb(${r}, ${g}, ${b})`,
  //       "hex": '#' + hex
  //     }
  //     var modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
  //     modFinishedProduct.Color = '#' + hex;
  //     this.setState({
  //       selColor,
  //       modFinishedProduct,
  //       appliedColor: selColor
  //     })
  //   }
  //   else {
  //     this.setState({
  //       selColor: {},
  //       appliedColor: selColor
  //     })
  //   }

  // }

  assignColor = (hex) => {
    if (hex !== null && hex !== "") {
      var selColor = "#" + hex;
      var modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
      modFinishedProduct.Color = selColor;
      this.setState({
        selColor,
        modFinishedProduct,
        appliedColor: selColor,
      });
    } else {
      this.setState({
        selColor: "",
        appliedColor: selColor,
      });
    }
  };

  handleRowSelectionChange = (associationRow) => {
    this.setState({ selectedAssociationRows: associationRow });
  };

  handleColorPicker = () => {
    try {
      this.setState({
        showColorPicker: true,
        isValidHex: true,
      });
    } catch (error) {
      console.log(
        "FinishedProductDetailsProject:Error occured on handleColorPicker",
        error
      );
    }
  };

  handleColorPickerClose = () => {
    var modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
    try {
      modFinishedProduct.Color =
        this.state.appliedColor !== undefined ? this.state.appliedColor : "";

      this.setState({
        showColorPicker: false,
        selColor:
          this.state.appliedColor !== undefined ? this.state.appliedColor : "",
        modFinishedProduct,
        isValidHex: true,
      });
    } catch (error) {
      console.log(
        "FinishedProductDetailsProject:Error occured on handleColorPickerClose",
        error
      );
    }
  };

  handleApplyColor = (color) => {
    let isValidHex = this.state.isValidHex;
    if (isValidHex) {
      var modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
      modFinishedProduct.Color = color.hex;
      this.setState({
        appliedColor: color.hex,
        showColorPicker: false,
        selColor: color.hex,
        modFinishedProduct,
      });
    }
  };

  handleOnColorChange = (color) => {
    var modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);
    modFinishedProduct.Color = color.hex;
    this.setState({
      selColor: color.hex,
      modFinishedProduct,
      isValidHex: true,
    });
  };

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      let addEnabled = this.state.saveEnabled;
      if (addEnabled && this.state.modFinishedProduct.ProductType !== null) {
        try {
          let modAssociations = lodash.cloneDeep(this.state.modAssociations);
          let newAssociation = {
            AdditiveCode: null,
            BaseProductCode: null,
            FinishedProductCode: this.state.modFinishedProduct.Code,
            Quantity: "1",
            SequenceNumber: null,
            Version: "1",
            addtiveAssociations: [],
          };

          newAssociation.SeqNumber =
            Utilities.getMaxSeqNumberfromListObject(modAssociations);
          modAssociations.push(newAssociation);
          this.setState({
            modAssociations,
            selectedAssociationRows: [],
          });
        } catch (error) {
          console.log(
            "FinishedProductDetailsComposite:Error occured on handleAddAssociation",
            error
          );
        }
      }
    }
  };

  handleDeleteAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      let deleteEnabled = this.state.saveEnabled;
      if (deleteEnabled) {
        try {
          if (
            this.state.selectedAssociationRows != null &&
            this.state.selectedAssociationRows.length > 0
          ) {
            if (this.state.modAssociations.length > 0) {
              let modAssociations = lodash.cloneDeep(
                this.state.modAssociations
              );

              this.state.selectedAssociationRows.forEach((obj) => {
                modAssociations = modAssociations.filter((association) => {
                  return association.SeqNumber !== obj.SeqNumber;
                });
              });

              modAssociations =
                Utilities.removeSeqNumberFromListObject(modAssociations);
              modAssociations =
                Utilities.addSeqNumberToListObject(modAssociations);

              modAssociations.forEach((association) => {
                association.addtiveAssociations.forEach((addv) => {
                  addv.baseSeqNumber = association.SeqNumber;
                });
              });

              this.setState({ modAssociations });
            }
          }

          this.setState({ selectedAssociationRows: [] });
        } catch (error) {
          console.log(
            "FinishedProductDetailsComposite:Error occured on handleDeleteAssociation",
            error
          );
        }
      }
    }
  };

  handleAddAdditive = (data) => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        let addEnabled = lodash.cloneDeep(this.state.saveEnabled);
        if (addEnabled) {
          let newAdditiveAssociation = {
            AdditiveCode: "",
            BaseProductCode: data.BaseProductCode,
            FinishedProductCode: data.FinishedProductCode,
            Quantity: "1",
            SequenceNumber: "0",
            Version: "0",
          };

          let modAssociations = lodash.cloneDeep(this.state.modAssociations);

          let associationIndex = modAssociations.findIndex(
            (item) =>
              item.BaseProductCode === data.BaseProductCode &&
              item.SeqNumber === data.SeqNumber
          );

          if (
            associationIndex >= 0 &&
            modAssociations[associationIndex].BaseProductCode !== null &&
            modAssociations[associationIndex].BaseProductCode !== "" &&
            modAssociations[associationIndex].BaseProductCode !== undefined
          ) {
            newAdditiveAssociation.baseSeqNumber =
              modAssociations[associationIndex].SeqNumber;
            newAdditiveAssociation.SeqNumber =
              Utilities.getMaxSeqNumberfromListObject(
                modAssociations[associationIndex].addtiveAssociations
              );
            modAssociations[associationIndex].addtiveAssociations.push(
              newAdditiveAssociation
            );
            this.toggleExpand(modAssociations[associationIndex], true, true);
          }
          this.setState({
            modAssociations,
            selectedAssociationRows: [],
          });
        }
      } catch (error) {
        console.log(
          "FinishedProductDetailsComposite:Error occured on handleAddAdditive",
          error
        );
      }
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.props.terminalCodes];
      var modFinishedProduct = lodash.cloneDeep(this.state.modFinishedProduct);

      if (checked) modFinishedProduct.TerminalCodes = [...terminalCodes];
      else modFinishedProduct.TerminalCodes = [];
      this.setState({ modFinishedProduct });
      this.terminalSelectionChange(modFinishedProduct.TerminalCodes);
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleDeleteAdditive = (rowData) => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      let deleteEnabled = this.state.saveEnabled;
      if (deleteEnabled) {
        try {
          let modAssociations = lodash.cloneDeep(this.state.modAssociations);

          let associationIndex = modAssociations.findIndex(
            (item) =>
              item.BaseProductCode === rowData.BaseProductCode &&
              item.SeqNumber === rowData.baseSeqNumber
          );

          if (associationIndex >= 0) {
            modAssociations[associationIndex].addtiveAssociations =
              modAssociations[associationIndex].addtiveAssociations.filter(
                (additive) => {
                  return additive.SeqNumber !== rowData.SeqNumber;
                }
              );
            this.toggleExpand(modAssociations[associationIndex], true, true);
          }
          this.setState({ modAssociations });
        } catch (error) {
          console.log(
            "FinishedProductDetailsComposite:Error occured on handleDeleteAdditive",
            error
          );
        }
      }
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    let data = {};
    if (
      cellData.field === "AdditiveCode" ||
      cellData.rowData.AdditiveCode !== null
    ) {
      let bpIndex = modAssociations.findIndex(
        (item) =>
          item.BaseProductCode === cellData.rowData.BaseProductCode &&
          item.SeqNumber === cellData.rowData.baseSeqNumber
      );

      modAssociations[bpIndex].addtiveAssociations[cellData.rowIndex][
        cellData.field
      ] = newVal;
      data = modAssociations[bpIndex];
    } else {
      modAssociations[cellData.rowIndex][cellData.field] = newVal;
      if (cellData.field === "BaseProductCode")
        modAssociations[cellData.rowIndex].addtiveAssociations = [];
      data = modAssociations[cellData.rowIndex];
    }
    this.setState({ modAssociations });
    //this.toggleExpand(cellData.rowData, true)
    this.toggleExpand(data, true, true);
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
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "FinishedProductDetailsComposite:Error occured on handleAttributeDataChange",
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
            attributeMetaDataList.finishedproduct
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  getBaseProductList() {
    axios(
      RestAPIs.GetBaseProducts,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            let baseProductDetails = result.EntityResult;
            this.setState({ baseProductDetails });
          }
        } else {
          console.log("Error in getBaseProductList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Base Product List:", error);
      });
  }

  getAdditivesList() {
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
            let additiveDetails = result.EntityResult;
            this.setState({ additiveDetails });
          }
        } else {
          console.log("Error in getAdditivesList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Additives List:", error);
      });
  }

  toggleExpand = (data, open, isAdditiveAdded = false) => {
    let expandedRows = lodash.cloneDeep(this.state.expandedRows);
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.SeqNumber === data.SeqNumber
    );
    if (open) {
      if (isAdditiveAdded && expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
        expandedRows.push(data);
      } else {
        expandedRows.splice(expandedRowIndex, 1);
      }
    } else {
      if (expandedRowIndex >= 0) {
        expandedRows = expandedRows.filter(
          (x) =>
            x.BaseProductCode !== data.BaseProductCode &&
            x.SeqNumber !== data.SeqNumber
        );
      } else expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };
  //Get KPI for Finished Product
  getKPIList(shareholder, finishProductCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiFinishedProductDetail,
        InputParameters: [{ key: "ShareholderCode", value: shareholder },{ key: "FinishedProductCode", value: finishProductCode }],
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
              finishedProductKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ finishedProductKPIList: [] });
            console.log(
              "Error in finished products KPIList:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting Finished Products KPIList:", error);
        });
    }
  }
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modFinishedProduct.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modFinishedProduct.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modFinishedProduct.LastActiveTime !== undefined &&
          this.state.modFinishedProduct.LastActiveTime !== null
            ? new Date(
                this.state.modFinishedProduct.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modFinishedProduct.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(
            this.state.modFinishedProduct.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modFinishedProduct.CreatedTime
          ).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.finishedProduct.Code}
            newEntityName="FinishedProductInfo_NewProduct"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.finishedProductKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <FinishedProductDetails
            finishedProduct={this.state.finishedProduct}
            modFinishedProduct={this.state.modFinishedProduct}
            validationErrors={this.state.validationErrors}
            additiveDetails={this.state.additiveDetails}
            baseProductDetails={this.state.baseProductDetails}
            selectedColor={this.state.selColor}
            listOptions={{
              productTypeOptions: this.state.productTypeOptions,
              densityUOMOptions: this.state.densityUOMOptions,
              volumeUOMOptions: this.state.volumeUOMOptions,
              terminalCodes: this.props.terminalCodes,
              prodFamilyOptions: this.state.prodFamilyOptions,
              hazardousProductCategoryOptions:
                this.state.hazardousProductCategoryOptions,
            }}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            modAssociations={this.state.modAssociations}
            expandedRows={this.state.expandedRows}
            selectedAssociationRows={this.state.selectedAssociationRows}
            onAttributeDataChange={this.handleAttributeDataChange}
            onColorPickerChange={this.handleColorPicker}
            onColorPickerClose={this.handleColorPickerClose}
            onApplyColor={this.handleApplyColor}
            onChangeColor={this.handleOnColorChange}
            toggleExpand={this.toggleExpand}
            handleAddAdditive={this.handleAddAdditive}
            handleAddAssociation={this.handleAddAssociation}
            handleDeleteAssociation={this.handleDeleteAssociation}
            handleDeleteAdditive={this.handleDeleteAdditive}
            handleRowSelectionChange={this.handleRowSelectionChange}
            handleCellDataEdit={this.handleCellDataEdit}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            onHexValueChange={this.handleHexValueChange}
            colorPickerState={this.state.showColorPicker}
            isValidHex={this.state.isValidHex}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            isDCHEnabled={this.props.userDetails.EntityResult.IsDCHEnabled}
            isValidShareholderSysExtCode={
              this.state.isValidShareholderSysExtCode
            }
            hazardousEnabled={this.state.hazardousEnabled}
          ></FinishedProductDetails>
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
              this.state.finishedProduct.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnFinishedProduct}
            handleOperation={this.saveFinishProduct}
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

export default connect(mapStateToProps)(FinishedProductDetailsComposite);

FinishedProductDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
