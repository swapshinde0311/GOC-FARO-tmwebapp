import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { BaseProductDetails } from "../../UIBase/Details/BaseProductDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyBaseProduct } from "../../../JS/DefaultEntities";
import { baseProductValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import {
  functionGroups,
  fnBaseProduct,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { baseProductAttributeEntity } from "../../../JS/AttributeEntity";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiBaseProductDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class BaseProductDetailsComposite extends Component {
  state = {
    baseProduct: lodash.cloneDeep(emptyBaseProduct),
    modBaseProduct: {},
    appliedColor: "",
    selColor: "",
    validationErrors: Utilities.getInitialValidationErrors(
      baseProductValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    showColorPicker: false,
    productTypeOptions: [],
    densityUOMOptions: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    baseProductKPIList: [],
    showAuthenticationLayout: false,
    tempBaseProduct: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      console.log(this.props.userDetails.EntityResult);
      this.getAttributes(this.props.selectedRow);
      this.getProductTypes();
      this.getDensityUOMList();
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.baseProduct.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAttributes(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(baseProductRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [baseProductAttributeEntity],
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
                  result.EntityResult.baseProduct
                ),
            },
            () => this.getBaseProduct(baseProductRow)
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
        var modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.baseProduct.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modBaseProduct.Attributes.find(
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
        "BaseProductDetailsComposite:Error occured on terminalSelectionChange",
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
        Array.isArray(attributeMetaDataList.baseProduct) &&
        attributeMetaDataList.baseProduct.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.baseProduct[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getBaseProduct(baseProductRow) {
    emptyBaseProduct.DensityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.DensityUOM;
    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      emptyBaseProduct.TerminalCodes =
        this.props.terminalCodes.length === 1
          ? [...this.props.terminalCodes]
          : [];
    }

    if (baseProductRow.Common_Code === undefined) {
      this.setState(
        {
          baseProduct: lodash.cloneDeep(emptyBaseProduct),
          modBaseProduct: lodash.cloneDeep(emptyBaseProduct),
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          baseProductKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnBaseProduct
          ),
          selColor: "",
          appliedColor: "",
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            if (this.props.terminalCodes.length === 1) {
              this.terminalSelectionChange(this.props.terminalCodes);
            } else {
              this.terminalSelectionChange([]);
            }
          } else {
            this.localNodeAttribute();
          }
        }
      );
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.baseProductCode,
        value: baseProductRow.Common_Code,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.baseProductCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetBaseProduct,
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
              baseProduct: lodash.cloneDeep(result.EntityResult),
              modBaseProduct: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnBaseProduct
              ),
            },
            () => {
              this.getKPIList(result.EntityResult.Code);
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
            baseProduct: lodash.cloneDeep(emptyBaseProduct),
            modBaseProduct: lodash.cloneDeep(emptyBaseProduct),
            isReadyToRender: true,
            selColor: "",
          });
          console.log("Error in getBaseProduct:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting BaseProduct:", error, baseProductRow);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);

      modBaseProduct[propertyName] = data;
      this.setState({ modBaseProduct });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (baseProductValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          baseProductValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }

      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.props.terminalCodes];
      var modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
      if (checked) modBaseProduct.TerminalCodes = [...terminalCodes];
      else modBaseProduct.TerminalCodes = [];
      this.setState({ modBaseProduct: modBaseProduct });
      this.terminalSelectionChange(modBaseProduct.TerminalCodes);
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  assignColor = (hex) => {
    if (hex !== null && hex !== "") {
      var selColor = hex;
      var modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
      modBaseProduct.Color = selColor;
      this.setState({
        selColor,
        modBaseProduct,
        appliedColor: selColor,
      });
    } else {
      this.setState({
        selColor: "",
        appliedColor: selColor,
      });
    }
  };

  handleColorPicker = () => {
    try {
      this.setState({
        showColorPicker: true,
        isValidHex: true,
      });
    } catch (error) {
      console.log(
        "BaseProductDetailsProject:Error occured on handleColorPicker",
        error
      );
    }
  };

  handleColorPickerClose = () => {
    var modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
    try {
      modBaseProduct.Color =
        this.state.appliedColor !== undefined ? this.state.appliedColor : "";

      this.setState({
        showColorPicker: false,
        selColor:
          this.state.appliedColor !== undefined ? this.state.appliedColor : "",
        modBaseProduct,
        isValidHex: true,
      });
    } catch (error) {
      console.log(
        "baseProductDetailsProject:Error occured on handleColorPickerClose",
        error
      );
    }
  };

  handleApplyColor = (color) => {
    let isValidHex = this.state.isValidHex;
    if (isValidHex) {
      var modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
      modBaseProduct.Color = color.hex;
      this.setState({
        appliedColor: color.hex,
        showColorPicker: false,
        selColor: color.hex,
        modBaseProduct,
      });
    }
  };

  handleOnColorChange = (color) => {
    var modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
    modBaseProduct.Color = color.hex;
    this.setState({
      selColor: color.hex,
      modBaseProduct,
      isValidHex: true,
    });
  };

  handleActiveStatusChange = (value) => {
    try {
      let modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
      modBaseProduct.Active = value;
      if (modBaseProduct.Active !== this.state.baseProduct.Active)
        modBaseProduct.Remarks = "";
      this.setState({ modBaseProduct });
    } catch (error) {
      console.log(error);
    }
  };

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
            let productTypeOptions = Utilities.transferListtoOptions(
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

  getDensityUOMList() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let densityUOMs = result.EntityResult.DENSITY;
            let densityUOMOptions = [];
            densityUOMs.forEach((weightOption) => {
              densityUOMOptions.push({
                text: weightOption,
                value: weightOption,
              });
            });

            this.setState({
              densityUOMOptions,
            });
          }
        } else {
          console.log("Error in getUOM:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getUOM:", error);
      });
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const baseProduct = lodash.cloneDeep(this.state.baseProduct);

      let color = "";
      if (
        this.state.baseProduct.Color !== null &&
        this.state.baseProduct.Color !== ""
      ) {
        color = this.state.baseProduct.Color;
      }
      baseProduct.Color = color;

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modBaseProduct: { ...baseProduct },
          selectedCompRow: [],
          validationErrors,
          modAttributeMetaDataList: [],
          selColor: color,
          appliedColor: color,
          showColorPicker: false,
          isValidHex: true,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(baseProduct.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on handleReset",
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
            attributeMetaDataList.baseProduct
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleSave = () => {
    try {
      let modBaseProduct = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      //this.setState({ saveEnabled: false });
      if (modBaseProduct.Color !== null && modBaseProduct.Color !== "") {
      } else modBaseProduct.Color = "";

      if (this.validateSave(modBaseProduct, attributeList)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempBaseProduct = lodash.cloneDeep(modBaseProduct);
        this.setState({ showAuthenticationLayout, tempBaseProduct }, () => {
          if (showAuthenticationLayout === false) {
            this.saveBaseProduct();
          }
        });
      } 
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  saveBaseProduct = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempBaseProduct = lodash.cloneDeep(this.state.tempBaseProduct);

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      tempBaseProduct = this.convertStringtoDecimal(
        tempBaseProduct,
        attributeList
      );

      this.state.baseProduct.Code === ""
        ? this.createBaseProduct(tempBaseProduct)
        : this.updateBaseProduct(tempBaseProduct);
    } catch (error) {
      console.log("BaseProductDetailsComposite : Error in saveBaseProduct");
    }
  };

  // parentCallBack = () => {
  //   let modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
  //   this.setState({ showAuthenticationLayout: false });
  //   this.saveBaseProduct(modBaseProduct);
  // };

  fillDetails() {
    try {
      let modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
      if (
        modBaseProduct.MinDensity !== null &&
        modBaseProduct.MinDensity !== ""
      )
        modBaseProduct.MinDensity = modBaseProduct.MinDensity.toLocaleString();
      if (
        modBaseProduct.MaxDensity !== null &&
        modBaseProduct.MaxDensity !== ""
      )
        modBaseProduct.MaxDensity = modBaseProduct.MaxDensity.toLocaleString();

      //attributeList = Utilities.attributesConverttoLocaleString(attributeList);
      this.setState({ modBaseProduct });
      return modBaseProduct;
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  validateSave(modBaseProduct, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(baseProductValidationDef).forEach(function (key) {
      if (modBaseProduct[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          baseProductValidationDef[key],
          modBaseProduct[key]
        );
    });

    if (
      modBaseProduct.MinDensity !== null &&
      modBaseProduct.MinDensity !== "" &&
      modBaseProduct.MaxDensity !== null &&
      modBaseProduct.MaxDensity !== ""
    ) {
      if (
        Utilities.convertStringtoDecimal(modBaseProduct.MinDensity) >=
        Utilities.convertStringtoDecimal(modBaseProduct.MaxDensity)
      ) {
        validationErrors["MaxDensity"] = "BaseProductInfo_MaxDensityLesser";
      }
    }

    if (modBaseProduct.Active !== this.state.baseProduct.Active) {
      if (modBaseProduct.Remarks === null || modBaseProduct.Remarks === "") {
        validationErrors["Remarks"] = "BaseProductInfo_EnterRemarks";
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

    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });

    return returnValue;
  }

  handleHexValueChange = (value) => {
    try {
      let modBaseProduct = lodash.cloneDeep(this.state.modBaseProduct);
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modBaseProduct.Color = value;
      this.setState({ modBaseProduct });
      var regex = /^#[0-9A-Fa-f]{6}$/;
      let isValidHex = regex.test(value);

      if (isValidHex) {
        this.setState({
          selColor: value,
        });
      } else {
        if (
          (value !== undefined || value !== "") &&
          (modBaseProduct.Color !== "" || modBaseProduct.Color !== undefined)
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

  convertStringtoDecimal(modBaseProduct, attributeList) {
    try {
      if (
        modBaseProduct.MinDensity !== null &&
        modBaseProduct.MinDensity !== ""
      ) {
        modBaseProduct.MinDensity = Utilities.convertStringtoDecimal(
          modBaseProduct.MinDensity
        );
      }
      if (
        modBaseProduct.MaxDensity !== null &&
        modBaseProduct.MaxDensity !== ""
      ) {
        modBaseProduct.MaxDensity = Utilities.convertStringtoDecimal(
          modBaseProduct.MaxDensity
        );
      }
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modBaseProduct.Attributes = Utilities.fillAttributeDetails(attributeList);
      return modBaseProduct;
    } catch (err) {
      console.log("convertStringtoDecimal error BaseProduct Details", err);
    }
  }

  createBaseProduct(modBaseProduct) {
    let keyCode = [
      {
        key: KeyCodes.baseProductCode,
        value: modBaseProduct.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.baseProductCode,
      KeyCodes: keyCode,
      Entity: modBaseProduct,
    };

    let notification = {
      messageType: "critical",
      message: "BaseProductInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["BaseProductInfo_BaseProdCode"],
          keyValues: [modBaseProduct.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateBaseProduct,
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
                fnBaseProduct
              ),
              showAuthenticationLayout: false,
            },
            () => this.getBaseProduct({ Common_Code: modBaseProduct.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnBaseProduct
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createBaseProduct:", result.ErrorList);
        }
        this.props.onSaved(this.state.modBaseProduct, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnBaseProduct
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modBaseProduct, "add", notification);
      });
  }

  updateBaseProduct(modBaseProduct) {
    let keyCode = [
      {
        key: KeyCodes.baseProductCode,
        value: modBaseProduct.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.baseProductCode,
      KeyCodes: keyCode,
      Entity: modBaseProduct,
    };

    let notification = {
      messageType: "critical",
      message: "BaseProductInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["BaseProductInfo_BaseProdCode"],
          keyValues: [modBaseProduct.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateBaseProduct,
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
                fnBaseProduct
              ),
              showAuthenticationLayout: false,
            },
            () => this.getBaseProduct({ Common_Code: modBaseProduct.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnBaseProduct
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in update BaseProduct:", result.ErrorList);
        }
        this.props.onSaved(this.state.modBaseProduct, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnBaseProduct
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modBaseProduct, "modify", notification);
      });
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
        "BaseProductDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };
  //Get KPI for Base Product
  getKPIList(baseProductCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiBaseProductDetail,
        InputParameters: [{ key: "BaseProductCode", value: baseProductCode }],
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
              baseProductKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ baseProductKPIList: [] });
            console.log("Error in base product KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Base Product KPIList:", error);
        });
    }
  }

  render() {
    const listOptions = {
      productType: this.state.productTypeOptions,
      DensityUOM: this.state.densityUOMOptions,
      terminalCodes: this.props.terminalCodes,
    };
    const popUpContents = [
      {
        fieldName: "BaseProductInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modBaseProduct.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modBaseProduct.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "BaseProductInfo_LastActivatedTime",
        fieldValue:
          this.state.modBaseProduct.LastActiveTime !== undefined &&
          this.state.modBaseProduct.LastActiveTime !== null
            ? new Date(
                this.state.modBaseProduct.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modBaseProduct.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "BaseProductInfo_Created",
        fieldValue:
          new Date(this.state.modBaseProduct.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modBaseProduct.CreatedTime).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.baseProduct.Code}
            newEntityName="BaseProductInfo_NewBaseProduct"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.baseProductKPIList}>
          {" "}
        </TMDetailsKPILayout>
        <ErrorBoundary>
          <BaseProductDetails
            baseProduct={this.state.baseProduct}
            modBaseProduct={this.state.modBaseProduct}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            selectedColor={this.state.selColor}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            onColorPickerChange={this.handleColorPicker}
            onColorPickerClose={this.handleColorPickerClose}
            onApplyColor={this.handleApplyColor}
            onChangeColor={this.handleOnColorChange}
            onHexValueChange={this.handleHexValueChange}
            colorPickerState={this.state.showColorPicker}
            isValidHex={this.state.isValidHex}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
          ></BaseProductDetails>
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
              this.state.baseProduct.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnBaseProduct}
            handleOperation={this.saveBaseProduct}
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

export default connect(mapStateToProps)(BaseProductDetailsComposite);

BaseProductDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  terminalCodes: PropTypes.array.isRequired,
};
