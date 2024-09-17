import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import { TruckReceiptManualEntryDetails } from "../../UIBase/Details/TruckReceiptManualEntryDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import lodash from "lodash";
import {
  emptyTruckManualEntryLoadingDetailsCommonInfo,
  emptyTruckManualEntryLoadingProductInfo,
} from "../../../JS/DefaultEntities";
import * as Utilities from "../../../JS/Utilities";
import {
  truckReceiptManualEntryProdValidationDef,
  truckReceiptManualEntryCommonValidationDef,
  truckReceiptManualEntryBaseProdValidationDef,
} from "../../../JS/ValidationDef";
import * as KeyCodes from "../../../JS/KeyCodes";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import PropTypes from "prop-types";
import * as RestAPIs from "../../../JS/RestApis";
import { receiptManualEntryBPAttributeEntity } from "../../../JS/AttributeEntity";
import { TranslationConsumer } from "@scuf/localization";
import {functionGroups,fnTruckReceipt, fnUnloadingDetails} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class TruckReceiptManualEntryDetailsComposite extends Component {
  state = {
    modTruckManualEntryLoadingDetailsCommonInfo: lodash.cloneDeep(
      emptyTruckManualEntryLoadingDetailsCommonInfo
    ),
    modTruckManualEntryLoadingFPInfo: lodash.cloneDeep(
      emptyTruckManualEntryLoadingProductInfo
    ),
    modTruckManualEntryLoadingBPInfo: [],
    modTruckManualEntryLoadingAdvInfo: [],
    quantityUOMOptions: [],
    densityUOMS: [],
    temperatureUOMs: [],
    calcValueUOM: [],
    compartmentSeqNoInVehicleList: [],
    Bays: [],
    LoadingArms: [],
    BCUs: [],
    BaysandBCUs: [],
    productList: [],
    activeIndex: 0,
    meterCodes: [],
    tankCodes: [],
    validationErrors: Utilities.getInitialValidationErrors(
      truckReceiptManualEntryCommonValidationDef
    ),
    validationErrorsForFP: Utilities.getInitialValidationErrors(
      truckReceiptManualEntryProdValidationDef
    ),
    attributeMetaDataList: [],
    validationErrorsForBP: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],
    selectedAttributeBPList: {},
    bpAttributeValidationErrors: {},
    selectedAttributeAdvList: {},
    advAttributeValidationErrors: {},
    manualEntrySaveEnable: false,
    isBCUTransLoad: false,
    transloadSource: "",
    currentCompTopUpReq: {},
    ManualEntryFieldDeatils: [],
    showAuthenticationLayout: false,
    tempUnLoadingDetails: {},
  };

  componentDidMount() {
    try {
      this.setDefaultValues()
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetUOMList();
      this.GetBaysandBCUs();
      this.getCompartmentSeqNo();
      this.getmeterCodes();
      this.getTankCodes();
      this.getAttributes();
       this.setState({manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnTruckReceipt)})
    } catch (error) {
      console.log("Error occured on componentDidMount", error);
    }
  }

  setDefaultValues() {
    // emptyTruckManualEntryLoadingProductInfo.StartTime = new Date();
    // emptyTruckManualEntryLoadingProductInfo.EndTime = new Date();
    emptyTruckManualEntryLoadingProductInfo.QuantityUOM = this.props.receipt.ReceiptQuantityUOM; // to display Receipt Qty UOM, in place of MOT UOM
    this.setState({
      modTruckManualEntryLoadingFPInfo: lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo),
      modTruckManualEntryLoadingDetailsCommonInfo: lodash.cloneDeep(
        emptyTruckManualEntryLoadingDetailsCommonInfo
      ),
      modTruckManualEntryLoadingAdvInfo: [],
      productList: [],
    });
  }
  formAttributesforEachTab(attributeMetaDataList) {
    let selectedTerminals = attributeMetaDataList[0].TerminalCode;

    var selectedAttributeList = [];

    attributeMetaDataList.forEach(function (attributeMetaData) {
      if (attributeMetaData.TerminalCode === selectedTerminals) {
        selectedAttributeList.push(attributeMetaData);
      }
    });

    return selectedAttributeList;
  }
  handleAttributes() {
    let attributeMetaDataList = lodash.cloneDeep(
      this.state.attributeMetaDataList.UNLOADINGTRANSACTIONS
    );
    let selectedAttributeList = lodash.cloneDeep(
      this.state.selectedAttributeList
    );

    if (attributeMetaDataList.length > 0) {
      selectedAttributeList = this.formAttributesforEachTab(
        attributeMetaDataList
      );
      this.setState({
        selectedAttributeList,
      });
      let attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );
      attributeValidationErrors.forEach((attributeValidation) => {
        Object.keys(attributeValidation.attributeValidationErrors).forEach(
          (key) => (attributeValidation.attributeValidationErrors[key] = "")
        );
      });
    }
  }
  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [receiptManualEntryBPAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
            attributeValidationErrors:
              Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.UNLOADINGTRANSACTIONS
              ),
          });
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }
  GetBaysandBCUs() {
    try {
      axios(
        RestAPIs.GetBaysandBCUs,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let Bays = [];
              let BaysandBCUs = result.EntityResult;
              if (Array.isArray(Object.keys(BaysandBCUs))) {
                Object.keys(BaysandBCUs).forEach((element) => {
                  Bays.push(element);
                });
              }
              this.setState({ Bays, BaysandBCUs });
            }
          } else {
            console.log(
              "TruckShipmentManualEntryDetailsComposite: Error in GetBaysandBCUs:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "TruckShipmentManualEntryDetailsComposite: Error while getting GetBaysandBCUs:",
            error
          );
        });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite: Error in GetBaysandBCUs:",
        error
      );
    }
  }
  GetUOMList() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let quantityUOMOptions = [];
            let densityUOMS = [];
            let temperatureUOMs = [];
            let calcValueUOM = [];

            if (Array.isArray(result.EntityResult.VOLUME)) {
              calcValueUOM = Utilities.transferListtoOptions(
                result.EntityResult.VOLUME
              );
              quantityUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.VOLUME
              );
            }
            if (Array.isArray(result.EntityResult.MASS)) {
              let massUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.MASS
              );
              massUOMOptions.forEach((massUOM) => {
                quantityUOMOptions.push(massUOM);
                calcValueUOM.push(massUOM);
              });
            }
            if (Array.isArray(result.EntityResult.DENSITY)) {
              densityUOMS = Utilities.transferListtoOptions(
                result.EntityResult.DENSITY
              );
            }
            if (Array.isArray(result.EntityResult.TEMPERATURE)) {
              temperatureUOMs = Utilities.transferListtoOptions(
                result.EntityResult.TEMPERATURE
              );
            }

            this.setState({
              quantityUOMOptions,
              densityUOMS,
              calcValueUOM,
              temperatureUOMs,
            });
          }
        } else {
          console.log(
            "TruckShipmentManualEntryDetailsComposite: Error in GetUOMList:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "TruckShipmentManualEntryDetailsComposite: Error while getting GetUOMList:",
          error
        );
      });
  }

  handleReset = () => {
    try {

      let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo);
      modTruckManualEntryLoadingFPInfo.StartTime = new Date();
      modTruckManualEntryLoadingFPInfo.EndTime = new Date();
      modTruckManualEntryLoadingFPInfo.QuantityUOM = this.props.receipt.ReceiptQuantityUOM;

      this.setState({
        modTruckManualEntryLoadingDetailsCommonInfo: lodash.cloneDeep(
          emptyTruckManualEntryLoadingDetailsCommonInfo
        ),
        modTruckManualEntryLoadingFPInfo,
        modTruckManualEntryLoadingBPInfo: [],
        modTruckManualEntryLoadingAdvInfo: [],
        LoadingArms: [],
        BCUs: [],
        productList: [],
        activeIndex: 0,
        validationErrorsForBP: [],
        manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnTruckReceipt),
        isBCUTransLoad: false,
        transloadSource: "",
        currentCompTopUpReq: {},
      });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  GetLoadingArms(BCUCode) {
    let LoadingArmsForBCU = []

    try {
      let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingFPInfo)
      axios(
        RestAPIs.GetLoadingArms + "?bcuCode=" + BCUCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {

          var result = response.data;

          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {

              LoadingArmsForBCU = result.EntityResult;
              if (Array.isArray(LoadingArmsForBCU) && LoadingArmsForBCU.length === 1) {
                modTruckManualEntryLoadingFPInfo.LoadingArmCode = LoadingArmsForBCU[0];
                this.GetMetersForLA(BCUCode, LoadingArmsForBCU[0]);
              }
              else {
                modTruckManualEntryLoadingFPInfo.LoadingArmCode = '';
              }
              this.setState({ LoadingArms: result.EntityResult, modTruckManualEntryLoadingFPInfo });
            }
          } else {
            console.log(
              "TruckReceiptManualEntryDetailsComposite: Error in GetLoadingArms:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "TruckReceiptManualEntryDetailsComposite: Error while getting GetLoadingArms:",
            error
          );
        });
    } catch (error) {
      console.log(
        "TruckReceiptManualEntryDetailsComposite: Error while getting GetLoadingArms:",
        error
      );
    }
  }
  getBCUs(BayCode) {
    let BCUs = [];
    try {
      let BaysandBCUs = lodash.cloneDeep(this.state.BaysandBCUs);

      if (Object.keys(BaysandBCUs).length > 0) {
        BCUs = BaysandBCUs[BayCode];
      }

      this.setState({ BCUs });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite: Error in getBCUs:",
        error
      );
    }
    return BCUs;
  }
  getBCUDetails(deviceCode) {
    try {
      var keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: deviceCode,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bcuCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetBCUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let bcu = result.EntityResult;


          let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingBPInfo);
          modTruckManualEntryLoadingBPInfo.map(item => { item.TemperatureUOM = bcu.TemperatureUOM; item.ProductDensityUOM = bcu.DensityUOM; })

          let modTruckManualEntryLoadingAdvInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingAdvInfo);
          modTruckManualEntryLoadingAdvInfo.map(item => { item.TemperatureUOM = bcu.TemperatureUOM; item.ProductDensityUOM = bcu.DensityUOM; })

          this.setState({
            modTruckManualEntryLoadingBPInfo, modTruckManualEntryLoadingAdvInfo
          });


          if (bcu.ReceiptSource === Constants.TransportationType.RAIL) {
            this.setState({
              isBCUTransLoad: true,
              transloadSource: Constants.TransportationType.RAIL,
            });
          } else if (
            bcu.ReceiptSource === Constants.TransportationType.MARINE
          ) {
            this.setState({
              isBCUTransLoad: true,
              transloadSource: Constants.TransportationType.MARINE,
            });
          }
        }
      });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite:Error while getting getBCUDeviceDetails"
      );
    }
  }

  GetMetersForLA(bcuCode, loadingArmCode) {


    try {
      var keyCode = [
        {
          key: KeyCodes.siteViewType,
          value: Constants.siteViewType.ROAD_BCUVIEW,
        },
        {
          key: KeyCodes.bcuCode,
          value: bcuCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.receipt.ActualTerminalCode,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.siteViewType,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetBCUViewTree,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {

            let loadingArm = result.EntityResult[0].AssociatedArmsList.find(larm => larm.Code === loadingArmCode);
            if (loadingArm !== null) {
              let mainLineMeters = [];
              let additiveMeters = [];
              mainLineMeters = loadingArm.AssociatedMeterList.find(meter => meter.MeterLineType === "MAINLINE");
              additiveMeters = loadingArm.AssociatedMeterList.find(meter => meter.MeterLineType === "ADDITIVE");
              let bpMeterCode = '';
              let additiveMeterCode = '';
              if (mainLineMeters.MeterList.length === 1) {
                bpMeterCode = mainLineMeters.MeterList[0].Code;
              }
              if (additiveMeters.MeterList.length === 1) {
                additiveMeterCode = additiveMeters.MeterList[0].Code;
              }


              if (bpMeterCode !== '') {
                let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingBPInfo);
                modTruckManualEntryLoadingBPInfo.map(item => { item.MeterCode = bpMeterCode; })
                this.setState({
                  modTruckManualEntryLoadingBPInfo
                });
              }

              if (additiveMeterCode !== '') {
                let modTruckManualEntryLoadingAdvInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingAdvInfo);
                modTruckManualEntryLoadingAdvInfo.map(item => { item.MeterCode = additiveMeterCode; })
                this.setState({
                  modTruckManualEntryLoadingAdvInfo
                });
              }
            }

          }
        }
      });
    } catch (error) {
      console.log("SiteTreeView:Error occured in GetMetersForLA", error);
    }
  }
  getFPReceipeDetails(compSequenceNo) {
    try {
      let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(
        this.state.modTruckManualEntryLoadingFPInfo
      );
      let finishedProd =
        this.props.receipt.ReceiptOriginTerminalCompartmentsInfo.find(
          (comp) => {
            return comp.CompartmentSeqNoInVehicle.toString() === compSequenceNo;
          }
        ).FinishedProductCode;
      modTruckManualEntryLoadingFPInfo.FinishedProductCode = finishedProd;

      let validationErrorsForFP = lodash.cloneDeep(
        this.state.validationErrorsForFP
      );
      validationErrorsForFP.FinishedProductCode = "";
      this.setState({ modTruckManualEntryLoadingFPInfo });

      axios(
        RestAPIs.getFPReceipeDetails +
        "?finishedProduct=" +
        finishedProd +
        "&shCode=" +
        this.props.selectedShareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let productList = [];
              let validationErrorsForBP = [];
              let modTruckManualEntryLoadingBPInfo = [];
              if (Array.isArray(result.EntityResult.Table)) {
                result.EntityResult.Table.forEach((item) => {
                  emptyTruckManualEntryLoadingProductInfo.BaseProductCode =
                    item.code;
                  productList.push({
                    code: item.code,
                    productType: item.ProductTYPE,
                    // baseProductCode: null
                  });
                  validationErrorsForBP.push(
                    Utilities.getInitialValidationErrors(
                      truckReceiptManualEntryBaseProdValidationDef
                    )
                  );
                  modTruckManualEntryLoadingBPInfo.push(
                    lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo)
                  );
                });
              }
              this.setState(
                {
                  productList,
                  validationErrorsForBP, //validationErrorsForAdditive,
                  modTruckManualEntryLoadingFPInfo,
                  modTruckManualEntryLoadingBPInfo,
                  manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnTruckReceipt)
                },
                () => {
                  this.handleAttributes();
                }
              );
            }
          } else {
            console.log(
              "TruckShipmentManualEntryDetailsComposite: Error in getFPReceiptDetails:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "TruckShipmentManualEntryDetailsComposite: Error while getting FPReceiptDetails:",
            error
          );
        });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite: Error while getting getFPReceiptDetails:",
        error
      );
    }
  }
  handleChange = (type, propertyName, data, additiveCode = null) => {
    try {
      let validationErrors = lodash.cloneDeep(this.state.validationErrors);
      let validationErrorsForFP = lodash.cloneDeep(
        this.state.validationErrorsForFP
      );
      let validationErrorsForBP = lodash.cloneDeep(
        this.state.validationErrorsForBP
      );

      if (type === Constants.ViewAllShipmentFields.Common) {
        let modTruckManualEntryLoadingDetailsCommonInfo = lodash.cloneDeep(
          this.state.modTruckManualEntryLoadingDetailsCommonInfo
        );
        modTruckManualEntryLoadingDetailsCommonInfo[propertyName] = data;
        if (propertyName === Constants.ViewAllShipmentFields.BAY) {
          let BCUs = this.getBCUs(data);

          if (BCUs.length > 0 && BCUs.length === 1) {
            modTruckManualEntryLoadingDetailsCommonInfo.BCUCode = BCUs[0];

            this.GetLoadingArms(BCUs[0]);

            this.getBCUDetails(BCUs[0])
          }
        }
        if (propertyName === Constants.ViewAllShipmentFields.BCU) {

          this.GetLoadingArms(data);
          this.getBCUDetails(data);
        }
        if (
          propertyName ===
          Constants.ViewAllShipmentFields.CompartmentSeqNoInVehicle
        ) {

          this.getFPReceipeDetails(data);
          // this.getCompartmentSeqNo();
        }
        if (
          truckReceiptManualEntryCommonValidationDef[propertyName] !== undefined
        ) {
          validationErrors[propertyName] = Utilities.validateField(
            truckReceiptManualEntryCommonValidationDef[propertyName],
            data
          );
        }
        this.setState({
          modTruckManualEntryLoadingDetailsCommonInfo,
          validationErrors,
        });
      }
      if (type === Constants.ViewAllShipmentFields.FP) {
        let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(
          this.state.modTruckManualEntryLoadingFPInfo
        );
        modTruckManualEntryLoadingFPInfo[propertyName] = data;


        if (propertyName === Constants.ViewAllShipmentFields.LOADINGARM) {

          let modTruckManualEntryLoadingDetailsCommonInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingDetailsCommonInfo)
          this.GetMetersForLA(modTruckManualEntryLoadingDetailsCommonInfo.BCUCode, data);
        }

        if (
          truckReceiptManualEntryProdValidationDef[propertyName] !== undefined
        ) {
          validationErrorsForFP[propertyName] = Utilities.validateField(
            truckReceiptManualEntryProdValidationDef[propertyName],
            data
          );
        }
        this.setState({
          modTruckManualEntryLoadingFPInfo,
          validationErrorsForFP,
        });
      }
      if (type === Constants.ViewAllShipmentFields.BP) {
        let index = this.state.activeIndex;
        let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(
          this.state.modTruckManualEntryLoadingBPInfo
        );
        modTruckManualEntryLoadingBPInfo[index][propertyName] = data;
        if (
          truckReceiptManualEntryBaseProdValidationDef[propertyName] !==
          undefined
        ) {
          validationErrorsForBP[propertyName] = Utilities.validateField(
            truckReceiptManualEntryBaseProdValidationDef[propertyName],
            data
          );
        }
        this.setState({
          modTruckManualEntryLoadingBPInfo,
          validationErrorsForBP,
        });
      }
    } catch (error) {
      console.log(
        this.props.ShipmentType +
        "TruckShipmentManualEntryDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };
  fillAttributeDetails() {
    try {
      let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);
      let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(
        this.state.modTruckManualEntryLoadingBPInfo
      );
      modTruckManualEntryLoadingBPInfo[0].Attributes = [];
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
        modTruckManualEntryLoadingBPInfo[0].Attributes.push(attribute);
      });
      this.setState({ modTruckManualEntryLoadingBPInfo });
      return modTruckManualEntryLoadingBPInfo;
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  addLoadingDetails = () => {
    try {
      this.setState({ manualEntrySaveEnable: false });
      let tempUnLoadingDetails = lodash.cloneDeep(this.state.tempUnLoadingDetails);
      this.CreateManualEntry(tempUnLoadingDetails);
    } catch (error) {
      console.log("Truck unLoading DetailsComposite : Error in save Receipt Unloading");
    }
  };

  handleSave = () => {
    try {
      //this.setState({ manualEntrySaveEnable: false });
      let modTruckManualEntryLoadingBPInfo = this.fillAttributeDetails();
      // this.fillAttributeDetails(lodash.cloneDeep(this.state))
      let LoadingDetailsInfos = this.fillManualEntryDetails(
        modTruckManualEntryLoadingBPInfo
      );
      if (this.validateSave()) {
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempUnLoadingDetails = lodash.cloneDeep(LoadingDetailsInfos);
      this.setState({ showAuthenticationLayout, tempUnLoadingDetails }, () => {
        if (showAuthenticationLayout === false) {
          this.addLoadingDetails();
          }
        });
      } else {
        this.setState({ manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnTruckReceipt), showAuthenticationLayout:false, });
      }
    } catch (error) {
      console.log(
        "MarineShipmentDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };
  handleAttributeCellDataEditFP = (attribute, value) => {
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
        "TruckShipmentManualEntryDetailsComposite:Error occured on handleAttributeCellDataEditFP",
        error
      );
    }
  };

  validateSave = () => {
    const {
      modTruckManualEntryLoadingDetailsCommonInfo,
      modTruckManualEntryLoadingFPInfo,
      modTruckManualEntryLoadingBPInfo,
    } = this.state;

    const validationErrors = lodash.cloneDeep(this.state.validationErrors);
    const validationErrorsForFP = lodash.cloneDeep(
      this.state.validationErrorsForFP
    );
    const validationErrorsForBP = lodash.cloneDeep(
      this.state.validationErrorsForBP
    );
    // let isWeightBased =
    //   currentCompTopUpReq !== undefined &&
    //   currentCompTopUpReq.IsWeightBased !== "0"
    //     ? true
    //     : false;
    Object.keys(truckReceiptManualEntryProdValidationDef).forEach(function (
      key
    ) {
      validationErrorsForFP[key] = Utilities.validateField(
        truckReceiptManualEntryProdValidationDef[key],
        modTruckManualEntryLoadingFPInfo[key]
      );
    });

    Object.keys(truckReceiptManualEntryCommonValidationDef).forEach(function (
      key
    ) {
      validationErrors[key] = Utilities.validateField(
        truckReceiptManualEntryCommonValidationDef[key],
        modTruckManualEntryLoadingDetailsCommonInfo[key]
      );
    });

    this.state.productList.map((item, index) => {
      Object.keys(truckReceiptManualEntryBaseProdValidationDef).forEach(
        function (key) {
          validationErrorsForBP[index][key] = Utilities.validateField(
            truckReceiptManualEntryBaseProdValidationDef[key],
            modTruckManualEntryLoadingBPInfo[index][key]
          );
        }
      );
    });

    if (
      modTruckManualEntryLoadingFPInfo.StartTime >=
      modTruckManualEntryLoadingFPInfo.EndTime
    ) {
      validationErrorsForFP["StartTime"] =
        "MarineReceiptManualEntry_ErrorUnloadTime";
    }

    this.setState({
      validationErrors,
      validationErrorsForFP,
      validationErrorsForBP,
    });
    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    let selectedAttributeList = lodash.cloneDeep(
      this.state.selectedAttributeList
    );

    selectedAttributeList.forEach((attribute) => {
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
    this.setState({ attributeValidationErrors });

    var returnValueBase = Object.values(validationErrors).every(function (
      value
    ) {
      return value === "";
    });

    var returnValueFP = Object.values(validationErrorsForFP).every(function (
      value
    ) {
      return value === "";
    });
    var returnValueBP = true;
    this.state.productList.map((item, index) => {
      returnValueBP = Object.values(validationErrorsForBP[index]).every(
        function (value) {
          return value === "";
        }
      );
    });
    console.log("returnValueBP", returnValueBP);
    return returnValueBase && returnValueFP && returnValueBP;
  };

  CreateManualEntry(LoadingDetailsInfos) {
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: this.props.receipt.ReceiptCode,
      },
    ];

    var notification = {
      messageType: "critical",
      message: "TruckReceipt_ManualEntryCreateStatus",
      messageResultDetails: [
        {
          keyFields: ["MarineDispatchManualEntry_CompSeqNo"],
          keyValues: [
            this.state.modTruckManualEntryLoadingDetailsCommonInfo
              .CompartmentSeqNoInVehicle,
          ],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
      Entity: LoadingDetailsInfos,
    };

    axios(
      RestAPIs.ReceiptUnloadingTransactions,
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
          this.setState({ saveEnabled: true,showAuthenticationLayout:false, }, () => {
            this.setDefaultValues()
          });
        } else {
          notification.message = "MarineReceiptManualEntry_SaveFailure";
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({ saveEnabled: true,showAuthenticationLayout:false, });
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      })
      .catch((error) => {
        this.setState({ showAuthenticationLayout:false });
        notification.messageResultDetails[0].errorMessage = error;
        console.log("Error while handleSave:", error);
      });
  }

  fillManualEntryDetails(modTruckManualEntryLoadingBPInfo) {
    let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(
      this.state.modTruckManualEntryLoadingFPInfo
    );
    let LoadingDetailsInfos = [];
    try {
      let LoadingDetailsInfo = {
        CommonInfo: {},
        LoadingDetailFPinfo: {},
        ArrLoadingDetailAdditive: [],
        ArrLoadingDetailBP: [],
        // IsLocalLoaded: false,
        TerminalCodes: [],
      };
      let { modTruckManualEntryLoadingDetailsCommonInfo } = this.state;
      modTruckManualEntryLoadingDetailsCommonInfo.LoadingDetailsType = "MANUAL";
      modTruckManualEntryLoadingDetailsCommonInfo.ReceiptCode =
        this.props.receipt.ReceiptCode;
      modTruckManualEntryLoadingDetailsCommonInfo.ShareHolderCode =
        this.props.selectedShareholder;

      modTruckManualEntryLoadingBPInfo.forEach((BPInfo) => {
        BPInfo.StartTime = modTruckManualEntryLoadingFPInfo.StartTime;
        BPInfo.EndTime = modTruckManualEntryLoadingFPInfo.EndTime;
        BPInfo.LoadingArmCode = modTruckManualEntryLoadingFPInfo.LoadingArmCode;
        BPInfo.QuantityUOM = modTruckManualEntryLoadingFPInfo.QuantityUOM;
        BPInfo.TransactionID = modTruckManualEntryLoadingFPInfo.TransactionID;
        BPInfo.FinishedProductCode =
          modTruckManualEntryLoadingFPInfo.FinishedProductCode;
      });
      LoadingDetailsInfo.CommonInfo = lodash.cloneDeep(
        modTruckManualEntryLoadingDetailsCommonInfo
      );
      LoadingDetailsInfo.LoadingDetailFPinfo = lodash.cloneDeep(
        modTruckManualEntryLoadingFPInfo
      );
      LoadingDetailsInfo.ArrLoadingDetailBP = lodash.cloneDeep(
        modTruckManualEntryLoadingBPInfo
      );
      LoadingDetailsInfo.CommonInfo["CompartmentSeqNoInVehicle"] =
        Utilities.convertStringtoDecimal(
          LoadingDetailsInfo.CommonInfo["CompartmentSeqNoInVehicle"]
        );

      LoadingDetailsInfo.ArrLoadingDetailBP.forEach((baseproduct) => {
        Object.keys(baseproduct).forEach((key) => {
          if (
            !(
              key.includes("UOM") ||
              key === "LoadingArmCode" ||
              key === "StartTime" ||
              key === "EndTime" ||
              key === "FinishedProductCode" ||
              key === "MeterCode" ||
              key === "TankCode" ||
              key === "Attributes" ||
              key === "BaseProductCode" ||
              key === "AdditiveProductCode"
            )
          ) {
            baseproduct[key] = Utilities.convertStringtoDecimal(
              baseproduct[key]
            );
          }
        });
      });

      LoadingDetailsInfos.push(LoadingDetailsInfo);
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite:Error in creating request for Manual Entry",
        error
      );
    }

    return LoadingDetailsInfos;
    // console.log("LoadingDetailsInfos",LoadingDetailsInfos)
  }

  handleTabChange = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrorsForFP = lodash.cloneDeep(this.state.validationErrors);
      var modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(
        this.state.modTruckManualEntryLoadingFPInfo
      );
      validationErrorsForFP[propertyName] = error;
      modTruckManualEntryLoadingFPInfo[propertyName] = value;
      this.setState({
        validationErrorsForFP,
        modTruckManualEntryLoadingFPInfo,
      });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };
  getCompartmentSeqNo() {
    let compartmentSeqNoInVehicleList = lodash.cloneDeep(
      this.state.compartmentSeqNoInVehicleList
    );
    let orderedCompartments = this.props.receipt.ReceiptCompartmentsInfo.sort((a, b) => (a.CompartmentSeqNoInVehicle - b.CompartmentSeqNoInVehicle))
    orderedCompartments.map((item) => {
      compartmentSeqNoInVehicleList.push(item.CompartmentSeqNoInVehicle.toString());
      this.setState({
        compartmentSeqNoInVehicleList: compartmentSeqNoInVehicleList,
      });
    });
  }

  getmeterCodes() {
    try {
      axios(
        RestAPIs.GetMeters,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          console.log("meterCodes", result);
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let meterCodes = [];
              meterCodes = result.EntityResult;
              this.setState({ meterCodes });
            }
          } else {
            console.log(
              "TruckShipmentManualEntryDetailsComposite: Error in getmeterCodes:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "TruckShipmentManualEntryDetailsComposite: Error while getting getmeterCodes:",
            error
          );
        });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite: Error in getmeterCodes:",
        error
      );
    }
  }

  getTankCodes() {
    try {
      axios(
        RestAPIs.GetTanks +
        "?ShareholderCode=" +
        this.props.selectedShareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let tankCodes = [];
              tankCodes = result.EntityResult;
              this.setState({ tankCodes });
            }
          } else {
            console.log(
              "TruckShipmentManualEntryDetailsComposite: Error in getTankCodes:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "TruckShipmentManualEntryDetailsComposite: Error while getting getTankCodes:",
            error
          );
        });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite: Error in getTankCodes:",
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
    const listOptions = {
      compartmentSeqNoInVehicleList: this.state.compartmentSeqNoInVehicleList,
      quantityUOMOptions: this.state.quantityUOMOptions,
      densityUOMS: this.state.densityUOMS,
      temperatureUOMs: this.state.temperatureUOMs,
      calcValueUOM: this.state.calcValueUOM,
      LoadingArms: this.state.LoadingArms,
      Bays: this.state.Bays,
      BCUs: this.state.BCUs,
      meterCodes: this.state.meterCodes,
      tankCodes: this.state.tankCodes,
    };
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              <TruckReceiptManualEntryDetails
                onFieldChange={this.handleChange}
                onTabChange={this.handleTabChange}
                listOptions={listOptions}
                productList={this.state.productList}
                modTruckManualEntryLoadingDetailsCommonInfo={
                  this.state.modTruckManualEntryLoadingDetailsCommonInfo
                }
                modTruckManualEntryLoadingFPInfo={
                  this.state.modTruckManualEntryLoadingFPInfo
                }
                modTruckManualEntryLoadingBPInfo={
                  this.state.modTruckManualEntryLoadingBPInfo
                }
                modTruckManualEntryLoadingAdvInfo={
                  this.state.modTruckManualEntryLoadingAdvInfo
                }
                validationErrors={this.state.validationErrors}
                validationErrorsForFP={this.state.validationErrorsForFP}
                validationErrorsForBP={this.state.validationErrorsForBP}
                selectedAttributeList={this.state.selectedAttributeList}
                attributeValidationErrors={this.state.attributeValidationErrors}
                selectedAttributeBPList={this.state.selectedAttributeBPList}
                bpAttributeValidationErrors={
                  this.state.bpAttributeValidationErrors
                }
                selectedAttributeAdvList={this.state.selectedAttributeAdvList}
                advAttributeValidationErrors={
                  this.state.advAttributeValidationErrors
                }
                onDateTextChange={this.handleDateTextChange}
                currentCompTopUpReq={this.state.currentCompTopUpReq}
                handleAttributeCellDataEdit={this.handleAttributeCellDataEditFP}
              ></TruckReceiptManualEntryDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              <TMDetailsUserActions
                handleBack={this.props.handleBack}
                handleSave={this.handleSave}
                handleReset={this.handleReset}
                saveEnabled={this.state.manualEntrySaveEnable}
              ></TMDetailsUserActions>
            </ErrorBoundary>
            {this.state.showAuthenticationLayout ? (
                    <UserAuthenticationLayout
                        Username={this.props.userDetails.EntityResult.UserName}
                        functionName={functionGroups.add}
                        functionGroup={fnUnloadingDetails}
                        handleOperation={this.addLoadingDetails}
                        handleClose={this.handleAuthenticationClose}
                    ></UserAuthenticationLayout>
                    ) : null}
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(
  TruckReceiptManualEntryDetailsComposite
);

TruckReceiptManualEntryDetailsComposite.propTypes = {
  handleBack: PropTypes.func.isRequired,
  receipt: PropTypes.string.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
};
