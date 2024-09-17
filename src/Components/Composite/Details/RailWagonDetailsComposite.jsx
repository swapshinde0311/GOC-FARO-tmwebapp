import React, { Component } from "react";
import { RailWagonDetails } from "../../UIBase/Details/RailWagonDetails";

import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { railWagonValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyRailWagon } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "./../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "./../../../JS/KeyCodes";
import { functionGroups, fnRailWagon, fnKPIInformation } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { railWagonAttributeEntity } from "../../../JS/AttributeEntity";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiRailWagonDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RailWagonDetailsComposite extends Component {
  state = {
    railWagon: lodash.cloneDeep(emptyRailWagon),
    modRailWagon: {},
    validationErrors: Utilities.getInitialValidationErrors(
      railWagonValidationDef
    ),
    isReadyToRender: false,
    shareholders: this.getShareholders(),
    carrierCompanyOptions: [],
    railWagonCategoryOptions: [],
    productTypeOptions: [],
    loadingTypeOptiongs: [],
    volumeUOMOptions: [],
    weightUOMOptions: [],
    saveEnabled: false,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    railWagonKPIList: [],
    showAuthenticationLayout: false,
    tempRailWagon: {},
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.railWagon.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined
      )
        this.getRailWagon(nextProps.selectedRow);
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLookUpData();
      this.getCarrierCompany();
      this.getRailWagonCategory();
      this.getLoadingTypes();
      this.getProductTypes();
      this.getUoms();
      this.getAttributes(this.props.selectedRow);
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getCarrierCompany() {
    axios(
      RestAPIs.GetCarrierCodes +
      "?ShareholderCode=" +
      "&Transportationtype=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            let carrierCompanyOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ carrierCompanyOptions });
          }
        } else {
          console.log("Error in GetCarrierList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getRailWagonCategory() {
    axios(
      RestAPIs.GetRailWagonCategory,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let railWagonCategoryOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ railWagonCategoryOptions });
          }
        } else {
          console.log("Error in getRailWagonCategory:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getRailWagonCategory:", error);
      });
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

  getLoadingTypes() {
    axios(
      RestAPIs.GetLoadingType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let loadingTypeOptiongs = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ loadingTypeOptiongs });
          }
        } else {
          console.log("Error in getLoadingTypes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getLoadingTypes:", error);
      });
  }

  getUoms() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let volumeUOMOptions = Utilities.transferListtoOptions(
              result.EntityResult.VOLUME
            );
            let weightUOMOptions = Utilities.transferListtoOptions(
              result.EntityResult.MASS
            );
            this.setState({ volumeUOMOptions, weightUOMOptions });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in GetUOMList:", error);
      });
  }

  getAttributes(selectedRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [railWagonAttributeEntity],
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
                  result.EntityResult.railwagon
                ),
            },
            () => this.getRailWagon(selectedRow)
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
        var modRailWagon = lodash.cloneDeep(this.state.modRailWagon);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.railwagon.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modRailWagon.Attributes.find(
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
        "RailWagonDetailsComposite:Error occured on terminalSelectionChange",
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
        Array.isArray(attributeMetaDataList.railwagon) &&
        attributeMetaDataList.railwagon.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.railwagon[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Rail",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result !== undefined &&
          result !== null &&
          result.IsSuccess === true) {
          if (
            result.EntityResult !== undefined &&
            result.EntityResult !== null
          ) {
            emptyRailWagon.VolumeUOM = result.EntityResult.VolumeUOM;
            emptyRailWagon.WeightUOM = result.EntityResult.WeightUOM;
            this.setState({
              railWagon: lodash.cloneDeep(emptyRailWagon),
            });
          }
        } else {
          console.log("Error in getLookUpData: ", result ? result.ErrorList : "error");
        }
      })
      .catch((error) => {
        console.log(
          "RailWagonDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getRailWagon(selectedRow) {
    var transportationType = this.getTransportationType();
    emptyRailWagon.TransportationType = transportationType;
    emptyRailWagon.ShareholderCode =
      this.props.userDetails.EntityResult.PrimaryShareholder;
    emptyRailWagon.TrailerType = Constants.TrailerType.RAILWAGON;
    // emptyRailWagon.VolumeUOM =
    //   this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.QuantityUOM;
    // emptyRailWagon.WeightUOM =
    //   this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.MassUOM;
    emptyRailWagon.TareWeight = 0;
    emptyRailWagon.MaxLoadableVolume = 0;
    emptyRailWagon.MaxLoadableWeight = 0;

    if (selectedRow.Common_Code === undefined) {
      this.setState(
        {
          railWagon: { ...emptyRailWagon },
          modRailWagon: { ...emptyRailWagon },
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          railWagonKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRailWagon
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
        key: KeyCodes.trailerCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
      {
        key: KeyCodes.carrierCode,
        value: selectedRow.Vehicle_CarrierCompany,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailWagon,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          // this.getTerminalsList(
          //     transportationType === Constants.TransportationType.RAIL
          //         ? [result.EntityResult.ShareholderCode]
          //         : result.EntityResult.ShareholderCodes
          // );
          result.EntityResult.TareWeight =
            result.EntityResult.TareWeight.toLocaleString();
          result.EntityResult.MaxLoadableVolume =
            result.EntityResult.MaxLoadableVolume.toLocaleString();
          result.EntityResult.MaxLoadableWeight =
            result.EntityResult.MaxLoadableWeight.toLocaleString();
          this.setState(
            {
              isReadyToRender: true,
              railWagon: lodash.cloneDeep(result.EntityResult),
              modRailWagon: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnRailWagon
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
        } else {
          this.setState({
            railWagon: lodash.cloneDeep(emptyRailWagon),
            modRailWagon: lodash.cloneDeep(emptyRailWagon),
            isReadyToRender: true,
          });
          console.log("Error in GetRailWagon:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railWagon:", error);
      });
  }

  getRailWagonCategoryDetails(railWagonCategoryCode, productType) {
    axios(
      RestAPIs.GetRailWagonCategoryDetails +
      "?RailWagonCategoryCode=" +
      railWagonCategoryCode +
      "&ProductType=" +
      productType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let modRailWagon = lodash.cloneDeep(this.state.modRailWagon);
            modRailWagon.MaxLoadableVolume = Utilities.convertStringtoDecimal(
              result.EntityResult.MaxLoadableVolume
            ).toLocaleString();
            modRailWagon.MaxLoadableWeight = Utilities.convertStringtoDecimal(
              result.EntityResult.MaxLoadableWeight
            ).toLocaleString();
            this.setState({ modRailWagon });
          }
        } else {
          console.log("Error in getRailWagonCategory:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getRailWagonCategory:", error);
      });
  }

  getTransportationType() {
    var transportationType = Constants.TransportationType.RAIL;
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transportationType = genericProps.transportationType;
    }
    return transportationType;
  }

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  handleChange = (propertyName, data) => {
    try {
      const modRailWagon = lodash.cloneDeep(this.state.modRailWagon);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      if (propertyName === "Active") {
        if (data !== this.state.railWagon.Active) modRailWagon.Remarks = "";
      }
      modRailWagon[propertyName] = data;
      this.setState({ modRailWagon });
      if (
        (propertyName === "RailWagonCategory" ||
          propertyName === "ProductType") &&
        modRailWagon.RailWagonCategory !== "" &&
        modRailWagon.ProductType !== ""
      ) {
        this.getRailWagonCategoryDetails(
          modRailWagon.RailWagonCategory,
          modRailWagon.ProductType
        );
      }
      if (railWagonValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          railWagonValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleCheckChange = (propertyName, checked) => {
    try {
      let modRailWagon = lodash.cloneDeep(this.state.modRailWagon);
      if (propertyName === "Crippled") {
        if (modRailWagon.Crippled !== this.state.railWagon.Crippled)
          modRailWagon.RemarksForCripple = "";
      }
      modRailWagon[propertyName] = checked;
      this.setState({ modRailWagon });
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on handleCheckChange",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var { validationErrors } = { ...this.state.validationErrors };
      var modRailWagon = lodash.cloneDeep(this.state.modRailWagon);
      validationErrors[propertyName] = error;
      modRailWagon[propertyName] = value;
      this.setState({ validationErrors, modRailWagon: modRailWagon });
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleshareholderChange = (shareholderList) => {
    try {
      this.getTerminalsList(shareholderList);
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on handleshareholderChange",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      let modRailWagon = lodash.cloneDeep(this.state.modRailWagon);
      if (checked) modRailWagon.TerminalCodes = [...this.props.terminalCodes];
      else modRailWagon.TerminalCodes = [];
      this.setState({ modRailWagon: modRailWagon });
      this.terminalSelectionChange(modRailWagon.TerminalCodes);
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const railWagon = lodash.cloneDeep(this.state.railWagon);
      //var transportationType = this.getTransportationType();

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modRailWagon: { ...railWagon },
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(railWagon.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on handleReset",
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
            attributeMetaDataList.railwagon
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  saveRailWagon = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempRailWagon = lodash.cloneDeep(this.state.tempRailWagon);

      this.state.railWagon.Code === ""
      ? this.createRailWagon(tempRailWagon)
      : this.updateRailWagon(tempRailWagon);
    } catch (error) {
      console.log("RailWagonsComposite : Error in saveRailWagon");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      let modRailWagon = lodash.cloneDeep(this.state.modRailWagon);
      modRailWagon.TareWeight = Utilities.convertStringtoDecimal(
        modRailWagon.TareWeight
      );
      modRailWagon.MaxLoadableVolume = Utilities.convertStringtoDecimal(
        modRailWagon.MaxLoadableVolume
      );
      modRailWagon.MaxLoadableWeight = Utilities.convertStringtoDecimal(
        modRailWagon.MaxLoadableWeight
      );
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      if (this.validateSave(modRailWagon, attributeList)) {
        modRailWagon = this.convertStringtoDecimal(modRailWagon, attributeList);
        modRailWagon = Utilities.convertDatesToString(
          DateFieldsInEntities.DatesInEntity.Wagon,
          modRailWagon
        );

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempRailWagon = lodash.cloneDeep(modRailWagon);
      this.setState({ showAuthenticationLayout, tempRailWagon }, () => {
        if (showAuthenticationLayout === false) {
          this.saveRailWagon();
        }
    });
         
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailWagonDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave(modRailWagon, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(railWagonValidationDef).forEach(function (key) {
      if (modRailWagon[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          railWagonValidationDef[key],
          modRailWagon[key]
        );
    });

    if (modRailWagon.Crippled) {
      if (modRailWagon.RemarksForCripple === "") {
        validationErrors["RemarksForCripple"] =
          "RailWagonConfigurationDetails_MandatoryRemarksForCripple";
      }
    }
    if (modRailWagon.TareWeight >= modRailWagon.MaxLoadableWeight) {
      validationErrors["TareWeight"] = "TrailerInfo_MaxWtLesser";
    }
    if (modRailWagon.Active !== this.state.railWagon.Active) {
      if (modRailWagon.Remarks === "") {
        validationErrors["Remarks"] =
          "RailWagonConfigurationDetails_RemarkRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "RailWagonDetails_SavedStatus",
      messageResultDetails: [],
    };

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
      this.props.onSaved(this.state.modRailWagon, "update", notification);
      return false;
    }
    return returnValue;
  }

  convertStringtoDecimal(modRailWagon, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modRailWagon.Attributes = Utilities.fillAttributeDetails(attributeList);
      return modRailWagon;
    } catch (err) {
      console.log(
        "convertStringtoDecimal error RailWagonDetailsComposite",
        err
      );
    }
  }

  createRailWagonCompartments(modRailWagon) {
    modRailWagon.Compartments = [];
    let newComp = {
      Attributes: [],
      Capacity: modRailWagon.MaxLoadableVolume,
      CarrierCompanyCode: modRailWagon.CarrierCompanyCode,
      Code: "1",
      CompartmentSeqNoInTrailer: 1,
      CreatedTime: modRailWagon.CreatedTime,
      Description: modRailWagon.Description,
      FRUOM: modRailWagon.VolumeUOM,
      FinishedProductCode: null,
      FlangeNo: null,
      LastUpdatedTime: modRailWagon.LastUpdatedTime,
      LogicMasterCode: null,
      MaxFR: null,
      Name: "",
      NoOfSeals: modRailWagon.NoOfSeals,
      ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      TrailerCode: modRailWagon.Code,
      UOM: modRailWagon.VolumeUOM,
    };
    modRailWagon.Compartments.push(newComp);
    return modRailWagon;
  }

  createRailWagon(modRailWagon) {
    var keyCode = [
      { key: KeyCodes.trailerCode, value: modRailWagon.Code },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.RAIL,
      },
      { key: KeyCodes.carrierCode, value: this.state.selectedCarrierCompany },
    ];

    modRailWagon = this.createRailWagonCompartments(modRailWagon);
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: keyCode,
      Entity: modRailWagon,
    };
    var notification = {
      messageType: "critical",
      message: "RailWagonDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailWagonConfigurationDetails_RailWagonCode"],
          keyValues: [modRailWagon.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateRailWagon,
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
          // this.setState({
          //     railWagon: lodash.cloneDeep(modRailWagon),
          //     modRailWagon: lodash.cloneDeep(modRailWagon),
          //     saveEnabled: Utilities.isInFunction(
          //         this.props.userDetails.EntityResult.FunctionsList,
          //         functionGroups.modify,
          //         fnRailWagon
          //     ),
          // });

          this.setState({
            showAuthenticationLayout: false,
          });

          this.getRailWagon({
            Common_Code: modRailWagon.Code,
            Vehicle_CarrierCompany: modRailWagon.CarrierCompanyCode,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateRailWagon:", result.ErrorList);
        }
        this.props.onSaved(modRailWagon, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRailWagon
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailWagon, "add", notification);
      });
  }

  updateRailWagon(modRailWagon) {
    var keyCode = [
      { key: KeyCodes.trailerCode, value: modRailWagon.Code },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.RAIL,
      },
      { key: KeyCodes.carrierCode, value: this.state.selectedCarrierCompany },
    ];

    modRailWagon.Compartments[0].CarrierCompanyCode =
      modRailWagon.CarrierCompanyCode;

    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: keyCode,
      Entity: modRailWagon,
    };
    var notification = {
      messageType: "critical",
      message: "RailWagonDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailWagonConfigurationDetails_RailWagonCode"],
          keyValues: [modRailWagon.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateRailWagon,
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
            showAuthenticationLayout: false,
          });
          this.getRailWagon({
            Common_Code: modRailWagon.Code,
            Vehicle_CarrierCompany: modRailWagon.CarrierCompanyCode,
          });
        } else {
          this.setState({
            saveEnabled: true,
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateRailWagon:", result.ErrorList);
        }
        this.props.onSaved(modRailWagon, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailWagon, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnRailWagon
          ),
          showAuthenticationLayout: false,
        });
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
        "RailWagonDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };
  //Get KPI for Rail Wagon
  getKPIList(railWagonCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiRailWagonDetail,
        InputParameters: [{ key: "WagonCode", value: railWagonCode }],
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
              railWagonKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ railWagonKPIList: [] });
            console.log("Error in rail wagon KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Rail Wagon KPIList:", error);
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
        fieldName: "RailWagonConfigurationDetails_LastUpdatedTime",
        fieldValue:
          new Date(
            this.state.modRailWagon.LastUpdateTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modRailWagon.LastUpdateTime).toLocaleTimeString(),
      },
      {
        fieldName: "RailWagonConfigurationDetails_LastActiveTime",
        fieldValue:
          this.state.modRailWagon.LastActiveTime !== undefined &&
            this.state.modRailWagon.LastActiveTime !== null
            ? new Date(
              this.state.modRailWagon.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modRailWagon.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "RailWagonConfigurationDetails_CreatedTime",
        fieldValue:
          new Date(this.state.modRailWagon.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modRailWagon.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.railWagon.Code}
            newEntityName="RailWagonConfigurationDetails_NewRailWagon"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.railWagonKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <RailWagonDetails
            railWagon={this.state.railWagon}
            modRailWagon={this.state.modRailWagon}
            validationErrors={this.state.validationErrors}
            listOptions={{
              shareholders: this.state.shareholders,
              terminalCodes: this.props.terminalCodes,
              carrierCompanyOptions: this.state.carrierCompanyOptions,
              railWagonCategoryOptions: this.state.railWagonCategoryOptions,
              productTypeOptions: this.state.productTypeOptions,
              loadingTypeOptiongs: this.state.loadingTypeOptiongs,
              volumeUOMOptions: this.state.volumeUOMOptions,
              weightUOMOptions: this.state.weightUOMOptions,
            }}
            onFieldChange={this.handleChange}
            onCheckChange={this.handleCheckChange}
            onDateTextChange={this.handleDateTextChange}
            onShareholderChange={this.handleshareholderChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
          ></RailWagonDetails>
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
              this.state.railWagon.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnRailWagon}
            handleOperation={this.saveRailWagon}
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

const mapWagonToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapWagonToProps
)(RailWagonDetailsComposite);

RailWagonDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
