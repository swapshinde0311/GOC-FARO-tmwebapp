
import React, { Component } from "react";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal } from "@scuf/common";
import {
  emptyRailReceipt,
  emptyRailMarineTransactionCommonInfo,
  emptyRailMarineTransactionProductInfo,
} from "../../../JS/DefaultEntities";
import { getKeyByValue } from "../../../JS/Utilities";
import { RailReceiptManualEntryDetails } from "../../UIBase/Details/RailReceiptManualEntryDetails";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { railReceiptCompartmentManualEntryValidationDef } from "../../../JS/ValidationDef";
import {
  railReceiptManualEntryFPAttributeEntity,
  railReceiptManualEntryBPAttributeEntity,
  railReceiptManualEntryAddAttributeEntity,
} from "../../../JS/AttributeEntity";

import {functionGroups,fnViewRailUnLoadingDetails} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RailReceiptManualEntryComposite extends Component {
  state = {
    loadingDataInfo: {},
    modLoadingDataInfo: {},
    tabActiveIndex: 0,
    manualEntryTabActiveIndex: 0,
    SaveEnabled: true,
    railReceipt: {},
    modRailReceipt: {},
    modRailWagon: {},
    modWagonDetails: [],
    modRailReceiptCompartmentPlanList: [],
    isReadyToRender: false,
    shareholders: this.getShareholders(),
    selectedWagonRow: [],
    manualEntryValidationDict: {},
    selectedShareholder: "",
    clusterCodeOptions: [],
    clusterBCUOptions: [],
    BCUCodeOptions: [],
    loadingArmCodeOptions: [],
    loadingArmCodes: [],
    quantityUOMOptions: [],
    densityUOMOptions: [],
    temperatureUOMOptions: [],
    meterCodeOptions: [],
    meterCodeSearchOptions: [],
    tankCodeOptions: [],
    tankCodeSearchOptions: [],
    wagonCodeOptions: [],
    openManualEntryWarn: false,
    IsManEntryEnabled: false,
    isEnterpriseNode: false,
    loadingArmCodeList: [],
    attributeMetaDataList: [],
    attributeFPMetaDataList: [],
    attributeBPMetaDataList: [],
    attributeAddMetaDataList: [],
    selectedFPAttributeList: [],
    selectedBPAttributeList: [],
    selectedAddAttributeList: [],
    attributeAddValidationErrors: [],

    attributeFPValidationErrors: [],

    attributeBPValidationErrors: [],
    showAuthenticationLayout: false,
    tempUnLoadingDetails: {},
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.selectedWagonRow.TrailerCode === undefined)
        this.getRailWagon(nextProps.selectedWagonRow);
      this.getRailReceipt(nextProps.selectedRow);
    } catch (error) {
      console.log(
        "RailReceiptManualEntryComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  getFinishedProductCodes() {
    axios(
      RestAPIs.GetFinishedProductListForShareholder +
      "?ShareholderCode=" +
      "&TransportationType=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            const finishedProductOptions = result.EntityResult;
            this.setState({ finishedProductOptions });
          }
        } else {
          console.log("Error in GetFinishedProductCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetFinishedProductCodes List:", error);
      });
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);

      this.getUOMs();
      this.getTankCode(this.props.selectedShareholder);
      this.getMeterCode();
      this.getRailReceipt(this.props.selectedRow);
      this.getRailBayAndBcuList();
    } catch (error) {
      console.log(
        "RailReceiptManualEntryComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  //TankCodes
  getTankCode(shareholder) {
    axios(
      RestAPIs.GetTanks + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const tankCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let tankCodeSearchOptions = lodash.cloneDeep(tankCodeOptions);
            if (tankCodeSearchOptions.length > Constants.filteredOptionsCount) {
              tankCodeSearchOptions = tankCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({
              tankCodeOptions,
              tankCodeSearchOptions,
            });
          }
        } else {
          console.log("Error in getTankCode:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getTankCode:", error);
      });
  }
  //MeterCodes
  getMeterCode() {
    axios(
      RestAPIs.GetMeters,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
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
  //BCUCodes&ClusterCodes
  getRailBayAndBcuList() {
    axios(
      RestAPIs.GetRailBayAndBcuList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          const clusterBCUOptions = {};
          const clusterCodeList = [];
          if (
            Array.isArray(result.EntityResult.Table) &&
            result.EntityResult.Table.length > 0
          ) {
            for (let cluster of result.EntityResult.Table) {
              clusterBCUOptions[cluster.Code] = [];
              clusterCodeList.push(cluster.Code);
            }
          }
          if (
            Array.isArray(result.EntityResult.Table1) &&
            result.EntityResult.Table1.length > 0
          ) {
            for (let BCU of result.EntityResult.Table1) {
              if(clusterBCUOptions[BCU.locationCode]!==undefined)
              clusterBCUOptions[BCU.locationCode].push(BCU.Code);
            }
          }
          this.setState({
            clusterBCUOptions,
            clusterCodeOptions:
              Utilities.transferListtoOptions(clusterCodeList),
          });
        } else {
          console.log("Error in getRailBayAndBcuList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getRailBayAndBcuList:", error);
      });
  }
  getLoadingArms(BCUCode, callback) {
    axios(
      RestAPIs.GetLoadingArms + "?bcuCode=" + BCUCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callback(result.EntityResult);
        } else {
          console.log("Error in getLoadingArms:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getLoadingArms:", error);
      });
  }
  getRailReceipt(selectedRow) {
    var transportationType = this.getTransportationType();
    emptyRailReceipt.TransportationType = transportationType;
    const emptyLoadingDataInfo = {
      CommonInfo: lodash.cloneDeep(emptyRailMarineTransactionCommonInfo),
      TransactionFPinfo: lodash.cloneDeep(
        emptyRailMarineTransactionProductInfo
      ),
      ArrTransactionBP: [],
      ArrTransactionAdditive: [],
      IsLocalLoaded: false,
    };
    if (selectedRow.Common_Code === undefined) {
      this.setState({
        railReceipt: lodash.cloneDeep(emptyRailReceipt),
        modRailReceipt: lodash.cloneDeep(emptyRailReceipt),
        loadingDataInfo: lodash.cloneDeep(emptyLoadingDataInfo),
        isReadyToRender: true,
        tabActiveIndex: 0,
      });
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          emptyLoadingDataInfo.CommonInfo.LoadingType = Utilities.getKeyByValue(
            Constants.LoadingDetailsType,
            1
          );
          emptyLoadingDataInfo.CommonInfo.TransactionType = "RECEIPT";
          emptyLoadingDataInfo.CommonInfo.TransportationType =
            Constants.TransportationType.RAIL;
          emptyLoadingDataInfo.CommonInfo.ReceiptCode =
            result.EntityResult.ReceiptCode;
          emptyLoadingDataInfo.CommonInfo.IsBonded =
            result.EntityResult.IsBonded;
          const wagonDetails = this.getWagonDetailsFromReceipt(
            result.EntityResult
          );
          this.setState({
            isReadyToRender: false,
            railReceipt: result.EntityResult,
            modRailReceipt: lodash.cloneDeep(result.EntityResult),
            modWagonDetails: wagonDetails,
            loadingDataInfo: lodash.cloneDeep(emptyLoadingDataInfo),
            saveEnabled: true,
          });
          this.handleManualEntry(wagonDetails);
          //this.getAttributes();
        } else {
          this.setState({
            railReceipt: lodash.cloneDeep(emptyRailReceipt),
            modRailReceipt: lodash.cloneDeep(emptyRailReceipt),
            loadingDataInfo: lodash.cloneDeep(emptyLoadingDataInfo),
            isReadyToRender: true,
          });
          console.log("Error in GetCarrier:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting RailReceipt:", error);
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
  checkManualEntryEnabled(wagonDetails) {
    var trailerCode="";
    for (let item of wagonDetails) {
      trailerCode=item.TrailerCode;
      if (
        item.ReceiptCompartmentStatus ===
        Constants.ReceiptCompartmentStatus.UNLOAD_NOTSTARTED ||
        item.ReceiptCompartmentStatus ===
        Constants.ReceiptCompartmentStatus.PART_UNLOADED ||
        item.ReceiptCompartmentStatus ===
        Constants.ReceiptCompartmentStatus.INTERRUPTED
      ) {
        return item.TrailerCode;
      } /*else {
        this.setState({
          openManualEntryWarn: true,
          IsManEntryEnabled: true,
          SaveEnabled: false,
        });
        return item.TrailerCode;
      }*/
    }
    this.setState({
      openManualEntryWarn: true,
      IsManEntryEnabled: true,
      SaveEnabled: false,
    });
    return trailerCode;
  }
  handleshareholderChange = (shareholderList) => {
    try {
      this.getTerminalsList(shareholderList);
    } catch (error) {
      console.log(
        "RailReceiptManualEntryComposite:Error occured on handleshareholderChange",
        error
      );
    }
  };

  getTankCodeSearchOptions() {
    let tankCodeSearchOptions = lodash.cloneDeep(
      this.state.tankCodeSearchOptions
    );
    let modTankCode = ""; //this.state.modLeakageManualEntry.TankCode;
    if (
      modTankCode !== null &&
      modTankCode !== "" &&
      modTankCode !== undefined
    ) {
      let selectedTankCode = tankCodeSearchOptions.find(
        (element) => element.value.toLowerCase() === modTankCode.toLowerCase()
      );
      if (selectedTankCode === undefined) {
        tankCodeSearchOptions.push({
          text: modTankCode,
          value: modTankCode,
        });
      }
    }
    return tankCodeSearchOptions;
  }
  getMeterCodeSearchOptions() {
    let meterCodeSearchOptions = lodash.cloneDeep(
      this.state.meterCodeSearchOptions
    );
    let modMeterCode = ""; //this.state.modLeakageManualEntry.MeterCode;
    if (
      modMeterCode !== null &&
      modMeterCode !== "" &&
      modMeterCode !== undefined
    ) {
      let selectedMeterCode = meterCodeSearchOptions.find(
        (element) => element.value.toLowerCase() === modMeterCode.toLowerCase()
      );
      if (selectedMeterCode === undefined) {
        meterCodeSearchOptions.push({
          text: modMeterCode,
          value: modMeterCode,
        });
      }
    }
    return meterCodeSearchOptions;
  }
  getUOMs() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            if (
              Array.isArray(result.EntityResult.VOLUME) &&
              Array.isArray(result.EntityResult.MASS)
            ) {
              const quantityUOMList = [];
              result.EntityResult.VOLUME.forEach((UOM) => {
                quantityUOMList.push(UOM);
              });
              result.EntityResult.MASS.forEach((UOM) => {
                quantityUOMList.push(UOM);
              });
              this.setState({
                quantityUOMOptions:
                  Utilities.transferListtoOptions(quantityUOMList),
              });
            }
            if (Array.isArray(result.EntityResult.DENSITY)) {
              const densityUOMList = [];
              result.EntityResult.DENSITY.forEach((UOM) => {
                densityUOMList.push(UOM);
              });
              this.setState({
                densityUOMOptions:
                  Utilities.transferListtoOptions(densityUOMList),
              });
            }
            if (Array.isArray(result.EntityResult.TEMPERATURE)) {
              const temperatureUOMList = [];
              result.EntityResult.TEMPERATURE.forEach((UOM) => {
                temperatureUOMList.push(UOM);
              });
              this.setState({
                temperatureUOMOptions:
                  Utilities.transferListtoOptions(temperatureUOMList),
              });
            }
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in GetUOMList:", error);
      });
  }
  getRailReceiptCompartmentPlanListFromReceipt(railReceipt) {
    let ReceiptCompartmentPlanList = [];
    if (Array.isArray(railReceipt.RailMarineReceiptCompartmentPlanList)) {
      railReceipt.RailMarineReceiptCompartmentPlanList.forEach(
        (receiptCompartment) => {
          ReceiptCompartmentPlanList.push({
            ReceiptCode: receiptCompartment.ReceiptCode,
            CarrierCompanyCode: receiptCompartment.CarrierCompanyCode,
            SequenceNo: receiptCompartment.SequenceNo,
            ReceiptCompartmentStatus: getKeyByValue(
              Constants.ReceiptCompartmentStatus,
              receiptCompartment.ReceiptCompartmentStatus
            ),
            AdjustedPlanQuantity: receiptCompartment.AdjustedPlanQuantity,
            NetUnLoadedQuantity: receiptCompartment.NetUnLoadedQuantity,
            UnloadedQuantity: receiptCompartment.UnloadedQuantity,
            UnloadedQuantityUOM: receiptCompartment.UnloadedQuantityUOM,
            PurgingRequired: receiptCompartment.PurgingRequired,
            PurgingCompleted: receiptCompartment.PurgingCompleted,
            AssociatedOrderItems: receiptCompartment.AssociatedOrderItems,
            IsTransloading: receiptCompartment.IsTransloading,
            ShareholderCode: receiptCompartment.ShareholderCode,
            FinishedProductCode: receiptCompartment.FinishedProductCode,
            CompartmentCode: receiptCompartment.CompartmentCode,
            TrailerCode: receiptCompartment.TrailerCode,
            PlannedQuantity: receiptCompartment.PlannedQuantity,
            PlanQuantityUOM: receiptCompartment.PlanQuantityUOM,
            CompartmentSeqNoInVehicle:
              receiptCompartment.CompartmentSeqNoInVehicle,
            Attributes: receiptCompartment.Attributes,
            AssociatedContractItems: receiptCompartment.AssociatedContractItems,
            ReceiptCompartmentTanks: receiptCompartment.ReceiptCompartmentTanks,
          });
        }
      );
    }
    // receiptAssociations = Utilities.addSeqNumberToListObject(
    //     receiptAssociations
    // );
    return ReceiptCompartmentPlanList;
  }
  getWagonDetailsFromReceipt(railReceipt) {
    const wagonDetails = [];
    const wagonCodeList = [];
    if (Array.isArray(railReceipt.RailMarineReceiptCompartmentPlanList)) {
      railReceipt.RailMarineReceiptCompartmentPlanList.forEach((item) => {
        if (
          item.ReceiptCompartmentStatus ===
          Constants.ReceiptCompartmentStatus.EMPTY ||
          item.ReceiptCompartmentStatus ===
          Constants.ReceiptCompartmentStatus.PART_UNLOADED ||
          item.ReceiptCompartmentStatus ===
          Constants.ReceiptCompartmentStatus.INTERRUPTED ||
          item.ReceiptCompartmentStatus ===
          Constants.ReceiptCompartmentStatus.UNLOAD_NOTSTARTED
        ) {
          wagonCodeList.push(item.TrailerCode);
        }
        let wagonDetail = {
          ReceiptCode: item.ReceiptCode,
          TrailerCode: item.TrailerCode,
          CarrierCompanyCode: item.CarrierCompanyCode,
          FinishedProductCode: item.FinishedProductCode,
          ReceiptCompartmentStatus: item.ReceiptCompartmentStatus,
          PlannedQuantity:
            item.PlannedQuantity !== null && item.PlannedQuantity !== ""
              ? item.PlannedQuantity.toLocaleString() +
              (item.PlanQuantityUOM ? " " + item.PlanQuantityUOM : "")
              : "",
          UnloadedQuantity:
            item.UnloadedQuantity !== null && item.UnloadedQuantity !== ""
              ? item.UnloadedQuantity.toLocaleString() +
              (item.UnloadedQuantityUOM ? " " + item.UnloadedQuantityUOM : "")
              : "",
          ForceComplete: false,
        };
        wagonDetails.push(wagonDetail);
      });
    }
    this.setState({
      wagonCodeOptions: Utilities.transferListtoOptions(wagonCodeList),
    });
    return wagonDetails;
  }
  getFinishedProduct(finishedProductCode, shareHolderCode, callback) {
    var keyCode = [
      {
        key: KeyCodes.finishedProductCode,
        value: finishedProductCode,
      },
    ];
    var obj = {
      ShareHolderCode: shareHolderCode,
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
        const result = response.data;
        if (result.IsSuccess) {
          callback(result.EntityResult);
        } else {
          console.log("Error in getFinishedProduct:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Finished Product:", error);
      });
  }

  preprocessManualEntryData(trailerCode, callback = () => { }) {
    let compartmentPlan = null;
    let compartmentDetailPlan = null;
    for (let item of this.state.modRailReceipt
      .RailMarineReceiptCompartmentPlanList) {
      if (item.TrailerCode === trailerCode) {
        compartmentPlan = item;
        break;
      }
    }
    for (let item of this.state.modRailReceipt
      .RailMarineReceiptCompartmentDetailPlanList) {
      if (item.TrailerCode === trailerCode) {
        compartmentDetailPlan = item;
        break;
      }
    }
    if (compartmentPlan !== null && compartmentDetailPlan !== null) {
      if (!compartmentPlan.FinishedProductCode) {
        const notification = {
          messageType: "critical",
          message: "ViewRailReceiptManualEntry_status",
          messageResultDetails: [
            {
              keyFields: ["Rail_Receipt_Wagon"],
              keyValues: [trailerCode],
              isSuccess: false,
              errorMessage: "RailReceiptManualEntry_ProductNotAssigned",
            },
          ],
        };
        this.props.onNotify(notification);
        return;
      }

      const loadingDataInfo = lodash.cloneDeep(this.state.loadingDataInfo);
      loadingDataInfo.CommonInfo.TrailerCode = trailerCode;
      loadingDataInfo.CommonInfo.CarrierCode =
        compartmentPlan.CarrierCompanyCode;
      loadingDataInfo.TransactionFPinfo.FinishedProductCode =
        compartmentPlan.FinishedProductCode;
      loadingDataInfo.TransactionFPinfo.QuantityUOM =
        this.state.modRailReceipt.QuantityUOM;
      loadingDataInfo.TransactionFPinfo.Attributes = [];

      loadingDataInfo.TransactionFPinfo.StartTime = new Date();
      loadingDataInfo.TransactionFPinfo.EndTime = new Date();

      this.getFinishedProduct(
        compartmentPlan.FinishedProductCode,
        compartmentPlan.ShareholderCode,
        (entityResult) => {
          loadingDataInfo.ArrTransactionBP = [];
          loadingDataInfo.ArrTransactionAdditive = [];
          if (
            Array.isArray(entityResult.FinishedProductItems) &&
            entityResult.FinishedProductItems.length > 0
          ) {
            for (let item of entityResult.FinishedProductItems) {
              const productInfo = lodash.cloneDeep(
                emptyRailMarineTransactionProductInfo
              );
              productInfo.FinishedProductCode = item.FinishedProductCode;
              productInfo.BaseProductCode = item.BaseProductCode;
              productInfo.AdditiveProductCode = item.AdditiveCode;
              productInfo.Attributes = [];
              if (item.AdditiveCode !== null && item.AdditiveCode !== "") {
                loadingDataInfo.ArrTransactionAdditive.push(productInfo);
              } else {
                loadingDataInfo.ArrTransactionBP.push(productInfo);
              }
            }
          }

          this.setState(
            {
              loadingDataInfo,
              isReadyToRender: true,
              modLoadingDataInfo: lodash.cloneDeep(loadingDataInfo),
              manualEntryValidationDict:
                this.initialManualEntryValidationErrors(loadingDataInfo),
            },
            () => this.getAttributes()
          );
          callback();
        }
      );
    }
  }

  getDefaultUOMs(bcuCode) {



    let densityUOM = '';
    let temperatureUOM = ''

    if (bcuCode === '' || bcuCode === undefined)
      return;

    try {
      var keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: bcuCode,
        }
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

          let bcu = result.EntityResult

          temperatureUOM = bcu.TemperatureUOM;
          densityUOM = bcu.DensityUOM;

          let modLoadingDataInfo = lodash.cloneDeep(this.state.modLoadingDataInfo);
          modLoadingDataInfo.TransactionFPinfo.TemperatureUOM = temperatureUOM;
          modLoadingDataInfo.TransactionFPinfo.ProductDensityUOM = densityUOM;

          modLoadingDataInfo.ArrTransactionAdditive.map(item => { item.TemperatureUOM = temperatureUOM; item.ProductDensityUOM = densityUOM; })
          modLoadingDataInfo.ArrTransactionBP.map(item => { item.TemperatureUOM = temperatureUOM; item.ProductDensityUOM = densityUOM; })

          this.setState({ modLoadingDataInfo });


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
          value: Constants.siteViewType.RAIL_BCUVIEW,
        },
        {
          key: KeyCodes.bcuCode,
          value: bcuCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.state.modRailReceipt.ActualTerminalCode,
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
              let modLoadingDataInfo = lodash.cloneDeep(this.state.modLoadingDataInfo);

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

                modLoadingDataInfo.ArrTransactionBP.map(item => { item.MeterCode = bpMeterCode; })

              }

              if (additiveMeterCode !== '') {
                modLoadingDataInfo.ArrTransactionAdditive.map(item => { item.MeterCode = additiveMeterCode; })
              }

              this.setState({ modLoadingDataInfo });

            }

          }
        }
      });
    } catch (error) {
      console.log("SiteTreeView:Error occured in GetMetersForLA", error);
    }
  }

  initialManualEntryValidationErrors(loadingDataInfo) {
    const commonValidation = {};
    const productValidation = {};
    for (let key in railReceiptCompartmentManualEntryValidationDef) {
      if (key === "BayCode" || key === "BCUCode" || key === "LoadingArm") {
        continue;
      } else if (
        key === "TransactionID" ||
        key === "StartTime" ||
        key === "EndTime" ||
        key === "Remarks"
      ) {
        commonValidation[key] = "";
      } else {
        productValidation[key] = "";
      }
    }
    const manualEntryValidationDict = {
      bayCode: "",
      BCUCode: "",
      LoadingArm: "",
      common: commonValidation,
      product: [productValidation],
    };
    for (let i = 0; i < loadingDataInfo.ArrTransactionBP.length; i++) {
      manualEntryValidationDict.product.push(
        lodash.cloneDeep(productValidation)
      );
    }
    for (let i = 0; i < loadingDataInfo.ArrTransactionAdditive.length; i++) {
      manualEntryValidationDict.product.push(
        lodash.cloneDeep(productValidation)
      );
    }
    return manualEntryValidationDict;
  }
  handleManualEntry(wagonDetails) {
    try {
      /*else {
        this.setState({
          openManualEntryWarn: true,
          IsManEntryEnabled: true,
          SaveEnabled: false,
        });
        return item.TrailerCode;
      }*/
      if (wagonDetails.length > 0) {
        const trailerCode = this.checkManualEntryEnabled(wagonDetails);
        this.preprocessManualEntryData(trailerCode);
        
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite: Error occurred on handleManualEntry",
        error
      );
    }
  }
  handleCompartmentManualEntryChange = (
    propertyName,
    data,
    dataPosition = {}
  ) => {
    try {
      if (propertyName === "TrailerCode") {
        this.preprocessManualEntryData(data);
        return;
      }
      const modLoadingDataInfo = lodash.cloneDeep(
        this.state.modLoadingDataInfo
      );
      const clusterBCUOptions = lodash.cloneDeep(this.state.clusterBCUOptions);
      if (dataPosition.type !== undefined) {
        if (dataPosition.index !== undefined) {
          modLoadingDataInfo[dataPosition.type][dataPosition.index][
            propertyName
          ] = data;
        } else {
          modLoadingDataInfo[dataPosition.type][propertyName] = data;
        }
      } else {
        modLoadingDataInfo.CommonInfo[propertyName] = data;
      }
      let triggerToGetLoadingArmCode = false;
      if (propertyName === "BayCode") {

        let bcuCodeList = Utilities.transferListtoOptions(
          clusterBCUOptions[data]
        )
        this.setState({
          BCUCodeOptions: Utilities.transferListtoOptions(
            clusterBCUOptions[data]
          ),
        });

        if (bcuCodeList.length === 1) {
          triggerToGetLoadingArmCode = true;
          modLoadingDataInfo.CommonInfo.BCUCode = clusterBCUOptions[data][0];

          this.getDefaultUOMs(modLoadingDataInfo.CommonInfo.BCUCode);
        }

      } else if (propertyName === "BCUCode") {
        triggerToGetLoadingArmCode = true;
        this.getDefaultUOMs(modLoadingDataInfo.CommonInfo.BCUCode);
      }
      this.setState({ modLoadingDataInfo });
      if (triggerToGetLoadingArmCode) {
        this.getLoadingArms(
          modLoadingDataInfo.CommonInfo.BCUCode,
          (entityResult) => {
            const loadingArmCodeList = [];
            if (Array.isArray(entityResult)) {
              for (let item of entityResult) {
                loadingArmCodeList.push(item);
              }
              if (loadingArmCodeList.length === 1) {
                modLoadingDataInfo.TransactionFPinfo.ArmCode =
                  loadingArmCodeList[0];
                this.GetMetersForLA(modLoadingDataInfo.CommonInfo.BCUCode, loadingArmCodeList[0]);
                this.setState({
                  modLoadingDataInfo,
                  loadingArmCodeOptions:
                    Utilities.transferListtoOptions(loadingArmCodeList),
                });
              }
            }
            this.setState({
              loadingArmCodeOptions:
                Utilities.transferListtoOptions(loadingArmCodeList),
            });
          }
        );
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite: Error occurred on handleCompartmentManualEntryChange",
        error
      );
    }
  };
  handleCompartmentManualEntryReset = () => {
    try {
      const loadingDataInfo = lodash.cloneDeep(this.state.loadingDataInfo);
      this.setState({
        modLoadingDataInfo: loadingDataInfo,
        manualEntryValidationDict:
          this.initialManualEntryValidationErrors(loadingDataInfo),
      });
      console.log("handleCompartmentManualEntryReset");
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occurred on handleReset",
        error
      );
    }
  };

  fillDetails() {
    try {
      let modLoadingDataInfo = lodash.cloneDeep(this.state.modLoadingDataInfo);
      //let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);
      if (
        modLoadingDataInfo.TransactionFPinfo.GrossQuantity !== null &&
        modLoadingDataInfo.TransactionFPinfo.GrossQuantity !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.GrossQuantity =
          modLoadingDataInfo.TransactionFPinfo.GrossQuantity.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.NetQuantity !== null &&
        modLoadingDataInfo.TransactionFPinfo.NetQuantity !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.NetQuantity =
          modLoadingDataInfo.TransactionFPinfo.NetQuantity.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.Temperature !== null &&
        modLoadingDataInfo.TransactionFPinfo.Temperature !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.Temperature =
          modLoadingDataInfo.TransactionFPinfo.Temperature.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.ProductDensity !== null &&
        modLoadingDataInfo.TransactionFPinfo.ProductDensity !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.ProductDensity =
          modLoadingDataInfo.TransactionFPinfo.ProductDensity.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer !== null &&
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer =
          modLoadingDataInfo.TransactionFPinfo.StartTotalizer.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.EndTotalizer !== null &&
        modLoadingDataInfo.TransactionFPinfo.EndTotalizer !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.EndTotalizer =
          modLoadingDataInfo.TransactionFPinfo.EndTotalizer.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer !== null &&
        modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer =
          modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer !== null &&
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer =
          modLoadingDataInfo.TransactionFPinfo.StartTotalizer.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer !== null &&
        modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer =
          modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.CalculatedGross !== null &&
        modLoadingDataInfo.TransactionFPinfo.CalculatedGross !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.CalculatedGross =
          modLoadingDataInfo.TransactionFPinfo.CalculatedGross.toLocaleString();
      if (
        modLoadingDataInfo.TransactionFPinfo.CalculatedNet !== null &&
        modLoadingDataInfo.TransactionFPinfo.CalculatedNet !== ""
      )
        modLoadingDataInfo.TransactionFPinfo.CalculatedNet =
          modLoadingDataInfo.TransactionFPinfo.CalculatedNet.toLocaleString();
      let i = 0;
      modLoadingDataInfo.ArrTransactionBP.forEach((e) => {
        if (e.GrossQuantity !== null && e.GrossQuantity !== "")
          modLoadingDataInfo.ArrTransactionBP[i].GrossQuantity =
            e.GrossQuantity.toLocaleString();
        if (e.NetQuantity !== null && e.NetQuantity !== "")
          modLoadingDataInfo.ArrTransactionBP[i].NetQuantity =
            e.NetQuantity.toLocaleString();
        if (e.Temperature !== null && e.Temperature !== "")
          modLoadingDataInfo.ArrTransactionBP[i].Temperature =
            e.Temperature.toLocaleString();
        if (e.ProductDensity !== null && e.ProductDensity !== "")
          modLoadingDataInfo.ArrTransactionBP[i].ProductDensity =
            e.ProductDensity.toLocaleString();
        if (e.StartTotalizer !== null && e.StartTotalizer !== "")
          modLoadingDataInfo.ArrTransactionBP[i].StartTotalizer =
            e.StartTotalizer.toLocaleString();
        if (e.EndTotalizer !== null && e.EndTotalizer !== "")
          modLoadingDataInfo.ArrTransactionBP[i].EndTotalizer =
            e.EndTotalizer.toLocaleString();
        if (e.NetStartTotalizer !== null && e.NetStartTotalizer !== "")
          modLoadingDataInfo.ArrTransactionBP[i].NetStartTotalizer =
            e.NetStartTotalizer.toLocaleString();
        if (e.NetEndTotalizer !== null && e.NetEndTotalizer !== "")
          modLoadingDataInfo.ArrTransactionBP[i].NetEndTotalizer =
            e.NetEndTotalizer.toLocaleString();
        if (e.CalculatedGross !== null && e.CalculatedGross !== "")
          modLoadingDataInfo.ArrTransactionBP[i].CalculatedGross =
            e.CalculatedGross.toLocaleString();
        if (e.CalculatedNet !== null && e.CalculatedNet !== "")
          modLoadingDataInfo.ArrTransactionBP[i].CalculatedNet =
            e.CalculatedNet.toLocaleString();
      });

      //attributeList = Utilities.attributesConverttoLocaleString(attributeList);
      this.setState({ modLoadingDataInfo });
      return modLoadingDataInfo;
    } catch (error) {
      console.log(
        "RailReceiptRecordWeightDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  handleCompartmentManualEntrySave = () => {
    try {
      let modLoadingDataInfo = this.fillDetails();
     

      let attributeFPList = [];
      if (this.state.selectedFPAttributeList.length > 0) {
        attributeFPList = Utilities.attributesConverttoLocaleString(
          this.state.selectedFPAttributeList
        );
      }
      let attributeBPList = [];
      if (this.state.selectedBPAttributeList.length > 0) {
        this.state.selectedBPAttributeList.forEach((element) => {
          element = Utilities.attributesConverttoLocaleString(element);
          attributeBPList.push(element);
        });
      }
      let attributeAddList = [];
      if (this.state.selectedAddAttributeList.length > 0) {
        this.state.selectedAddAttributeList.forEach((element) => {
          element = Utilities.attributesConverttoLocaleString(element);
          attributeAddList.push(element);
        });
      }

      if (
        this.validateManualEntry(
          modLoadingDataInfo,
          attributeFPList,
          attributeBPList,
          attributeAddList
        )
      ) {
        modLoadingDataInfo = this.fillAttributeDetails(
          modLoadingDataInfo,
          attributeFPList,
          attributeBPList,
          attributeAddList
        );
        modLoadingDataInfo.TransactionFPinfo.GrossQuantity =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.GrossQuantity
          );
        modLoadingDataInfo.TransactionFPinfo.NetQuantity =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.NetQuantity
          );
        modLoadingDataInfo.TransactionFPinfo.Temperature =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.Temperature
          );
        modLoadingDataInfo.TransactionFPinfo.ProductDensity =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.ProductDensity
          );
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.StartTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.EndTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.EndTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.CalculatedGross =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.CalculatedGross
          );
        modLoadingDataInfo.TransactionFPinfo.CalculatedNet =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.CalculatedNet
          );
        for (let index in modLoadingDataInfo.ArrTransactionBP) {
          modLoadingDataInfo.ArrTransactionBP[index].StartTime =
            modLoadingDataInfo.TransactionFPinfo.StartTime;
          modLoadingDataInfo.ArrTransactionBP[index].EndTime =
            modLoadingDataInfo.TransactionFPinfo.EndTime;
          modLoadingDataInfo.ArrTransactionBP[index].ArmCode =
            modLoadingDataInfo.TransactionFPinfo.ArmCode;
          modLoadingDataInfo.ArrTransactionBP[index].QuantityUOM =
            modLoadingDataInfo.TransactionFPinfo.QuantityUOM;
          modLoadingDataInfo.ArrTransactionBP[index].TransactionID =
            modLoadingDataInfo.TransactionFPinfo.TransactionID;
          modLoadingDataInfo.ArrTransactionBP[index].FinishedProductCode =
            modLoadingDataInfo.TransactionFPinfo.FinishedProductCode;
          modLoadingDataInfo.ArrTransactionBP[index].GrossQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].GrossQuantity
            );
          modLoadingDataInfo.ArrTransactionBP[index].NetQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].NetQuantity
            );
          modLoadingDataInfo.ArrTransactionBP[index].Temperature =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].Temperature
            );
          modLoadingDataInfo.ArrTransactionBP[index].ProductDensity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].ProductDensity
            );
          modLoadingDataInfo.ArrTransactionBP[index].StartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].StartTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].EndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].EndTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].NetStartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].NetStartTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].NetEndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].NetEndTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].CalculatedGross =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].CalculatedGross
            );
          modLoadingDataInfo.ArrTransactionBP[index].CalculatedNet =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].CalculatedNet
            );
        }
        for (let index in modLoadingDataInfo.ArrTransactionAdditive) {
          modLoadingDataInfo.ArrTransactionAdditive[index].StartTime =
            modLoadingDataInfo.TransactionFPinfo.StartTime;
          modLoadingDataInfo.ArrTransactionAdditive[index].EndTime =
            modLoadingDataInfo.TransactionFPinfo.EndTime;
          modLoadingDataInfo.ArrTransactionAdditive[index].ArmCode =
            modLoadingDataInfo.TransactionFPinfo.ArmCode;
          modLoadingDataInfo.ArrTransactionAdditive[index].QuantityUOM =
            modLoadingDataInfo.TransactionFPinfo.QuantityUOM;
          modLoadingDataInfo.ArrTransactionAdditive[index].TransactionID =
            modLoadingDataInfo.TransactionFPinfo.TransactionID;
          modLoadingDataInfo.ArrTransactionAdditive[index].FinishedProductCode =
            modLoadingDataInfo.TransactionFPinfo.FinishedProductCode;
          modLoadingDataInfo.ArrTransactionAdditive[index].GrossQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].GrossQuantity
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].NetQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].NetQuantity
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].Temperature =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].Temperature
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].ProductDensity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].ProductDensity
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].StartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].StartTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].EndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].EndTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].NetStartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].NetStartTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].NetEndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].NetEndTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedGross =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedGross
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedNet =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedNet
            );
        }

     //  this.saveManualEntry(modLoadingDataInfo);

     let showAuthenticationLayout =
     this.props.userDetails.EntityResult.IsWebPortalUser !== true
       ? true
       : false;
       
   let tempUnLoadingDetails = lodash.cloneDeep(modLoadingDataInfo);
   this.setState({ showAuthenticationLayout, tempUnLoadingDetails }, () => {
     if (showAuthenticationLayout === false) {
       this.saveManualEntry();
       }
     });

      } else {
        this.setState({ SaveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occurred on handleSave",
        error
      );
    }
  };

  saveManualEntry= () => {
    
    this.handleAuthenticationClose();
    this.setState({ SaveEnabled: false });
    let modLoadingDataInfo = lodash.cloneDeep(this.state.tempUnLoadingDetails);

    const keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: modLoadingDataInfo.CommonInfo.ReceiptCode,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: keyCode,
      Entity: [modLoadingDataInfo],
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailReceiptManualEntry_status",
      messageResultDetails: [
        {
          keyFields: ["ViewRailReceiptDetails_ReceiptCode"],
          keyValues: [modLoadingDataInfo.CommonInfo.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.RailReceiptManualEntry,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({ SaveEnabled: true });
        } else {
          this.setState({ SaveEnabled: true });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          //console.log("Error in saveManualEntry: ", result.ErrorList);
        }
        this.props.onSaved(this.state.modRailReceipt, "update", notification);
      })
      .catch((error) => {
        this.setState({ SaveEnabled: true });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modLoadingDataInfo, "modify", notification);
      });
  }
  validateManualEntry(
    modLoadingDataInfo,
    attributeFPList,
    attributeBPList,
    attributeAddList
  ) {
    const manualEntryValidationDict = lodash.cloneDeep(
      this.state.manualEntryValidationDict
    );
    let validateFlag = true;

    manualEntryValidationDict.bayCode = Utilities.validateField(
      railReceiptCompartmentManualEntryValidationDef.BayCode,
      modLoadingDataInfo.CommonInfo.BayCode
    );

    manualEntryValidationDict.BCUCode = Utilities.validateField(
      railReceiptCompartmentManualEntryValidationDef.BCUCode,
      modLoadingDataInfo.CommonInfo.BCUCode
    );

    manualEntryValidationDict.LoadingArm = Utilities.validateField(
      railReceiptCompartmentManualEntryValidationDef.LoadingArm,
      modLoadingDataInfo.TransactionFPinfo.ArmCode
    );

    if (manualEntryValidationDict.bayCode !== "") {
      validateFlag = false;
    }

    if (manualEntryValidationDict.BCUCode !== "") {
      validateFlag = false;
    }

    if (manualEntryValidationDict.LoadingArm !== "") {
      validateFlag = false;
    }

    for (let key in manualEntryValidationDict.common) {
      manualEntryValidationDict.common[key] = Utilities.validateField(
        railReceiptCompartmentManualEntryValidationDef[key],
        modLoadingDataInfo.TransactionFPinfo[key]
      );
      if (manualEntryValidationDict.common[key] !== "") {
        validateFlag = false;
      }
    }

    if (
      modLoadingDataInfo.TransactionFPinfo.StartTime >=
      modLoadingDataInfo.TransactionFPinfo.EndTime
  ) {
    manualEntryValidationDict.common["StartTime"] =
          "MarineReceiptManualEntry_ErrorUnloadTime";

          validateFlag = false;
  }

    let tabIndex;
    let index = 0;
    for (let data in manualEntryValidationDict.product[index]) {
      manualEntryValidationDict.product[index][data] = Utilities.validateField(
        railReceiptCompartmentManualEntryValidationDef[data],
        modLoadingDataInfo.TransactionFPinfo[data]
      );
      if (manualEntryValidationDict.product[index][data] !== "") {
        validateFlag = false;
        if (tabIndex === undefined) {
          tabIndex = index;
        }
      }
    }
    for (let item of modLoadingDataInfo.ArrTransactionBP) {
      index += 1;
      for (let key in manualEntryValidationDict.product[index]) {
        manualEntryValidationDict.product[index][key] = Utilities.validateField(
          railReceiptCompartmentManualEntryValidationDef[key],
          item[key]
        );
        if (manualEntryValidationDict.product[index][key] !== "") {
          validateFlag = false;
          if (tabIndex === undefined) {
            tabIndex = index;
          }
        }
      }
    }
    for (let item of modLoadingDataInfo.ArrTransactionAdditive) {
      index += 1;
      for (let key in manualEntryValidationDict.product[index]) {
        manualEntryValidationDict.product[index][key] = Utilities.validateField(
          railReceiptCompartmentManualEntryValidationDef[key],
          item[key]
        );
        if (manualEntryValidationDict.product[index][key] !== "") {
          validateFlag = false;
          if (tabIndex === undefined) {
            tabIndex = index;
          }
        }
      }
    }

    if (tabIndex !== undefined) {
      this.handleManualEntryTabChange(tabIndex);
    }
    var attributeFPValidationErrors = lodash.cloneDeep(
      this.state.attributeFPValidationErrors
    );

    attributeFPList.forEach((attribute) => {
      attributeFPValidationErrors.forEach((attributeValidation) => {
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
    var attributeBPValidationErrors = lodash.cloneDeep(
      this.state.attributeBPValidationErrors
    );

    attributeBPList.forEach((attribute) => {
      attribute.forEach((att) => {
        attributeBPValidationErrors.forEach((attributeValidation) => {
          if (attributeValidation.TerminalCode === att.TerminalCode) {
            att.attributeMetaDataList.forEach((attributeMetaData) => {
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
    });

    var attributeAddValidationErrors = lodash.cloneDeep(
      this.state.attributeAddValidationErrors
    );

    attributeAddList.forEach((attribute) => {
      attribute.forEach((att) => {
        attributeAddValidationErrors.forEach((attributeValidation) => {
          if (attributeValidation.TerminalCode === att.TerminalCode) {
            att.attributeMetaDataList.forEach((attributeMetaData) => {
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
    });
    this.setState({
      attributeFPValidationErrors,
      attributeBPValidationErrors,
      attributeAddValidationErrors,
    });

    this.setState({ manualEntryValidationDict });

    return validateFlag;
  }

  handleTankSearchChange = (tankCode) => {
    try {
      let tankCodeSearchOptions = this.state.tankCodeOptions.filter((item) =>
        item.value.toLowerCase().includes(tankCode.toLowerCase())
      );

      if (tankCodeSearchOptions.length > Constants.filteredOptionsCount) {
        tankCodeSearchOptions = tankCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        tankCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on handleRouteSearchChange",
        error
      );
    }
  };
  handleMeterSearchChange = (meterCode) => {
    try {
      let meterCodeSearchOptions = this.state.meterCodeOptions.filter((item) =>
        item.value.toLowerCase().includes(meterCode.toLowerCase())
      );

      if (meterCodeSearchOptions.length > Constants.filteredOptionsCount) {
        meterCodeSearchOptions = meterCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        meterCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on handleMeterSearchChange",
        error
      );
    }
  };

  handleManualEntryTabChange = (activeIndex) => {
    try {
      this.setState({ manualEntryTabActiveIndex: activeIndex });
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite: Error occurred on handleManualEntryTabChange",
        error
      );
    }
  };
  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [
            railReceiptManualEntryFPAttributeEntity,
            railReceiptManualEntryBPAttributeEntity,
            railReceiptManualEntryAddAttributeEntity,
          ],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeFPValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.RAILUNLOADINGDETAILSFP
                ),
              attributeBPValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.RAILUNLOADINGDETAILSBP
                ),
              attributeAddValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.RAILUNLOADINGDETAILSADDITIVE
                ),
            },
            () => {
              if (this.props.IsEnterpriseNode) {
                this.terminalFPSelectionChange([]);
                this.terminalBPSelectionChange([]);
                this.terminalAddSelectionChange([]);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }
  fillAttributeDetails(
    modLoadingDataInfo,
    attributeFPList,
    attributeBPList,
    attributeAddList
  ) {
    try {
      attributeFPList = Utilities.attributesDatatypeConversion(attributeFPList);

      if (attributeBPList.length > 0) {
        attributeBPList.forEach((element) => {
          element = Utilities.attributesDatatypeConversion(element);
        });
      }

      if (attributeAddList.length > 0) {
        attributeAddList.forEach((element) => {
          element = Utilities.attributesDatatypeConversion(element);
        });
      }

      modLoadingDataInfo.Attributes = [];
      attributeFPList.forEach((comp) => {
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
        modLoadingDataInfo.TransactionFPinfo.Attributes.push(attribute);
      });
      for (let index = 0; index < attributeBPList.length; index++) {
        let comp = attributeBPList[index];
        comp.forEach((att) => {
          let attribute = {
            ListOfAttributeData: [],
          };
          attribute.TerminalCode = att.TerminalCode;
          att.attributeMetaDataList.forEach((det) => {
            attribute.ListOfAttributeData.push({
              AttributeCode: det.Code,
              AttributeValue: det.DefaultValue,
            });
          });
          modLoadingDataInfo.ArrTransactionBP[index].Attributes.push(attribute);
        });
      }
      for (let index = 0; index < attributeAddList.length; index++) {
        let addComp = attributeAddList[index];
        addComp.forEach((addAtt) => {
          let attribute = {
            ListOfAttributeData: [],
          };
          attribute.TerminalCode = addAtt.TerminalCode;
          addAtt.attributeMetaDataList.forEach((det) => {
            attribute.ListOfAttributeData.push({
              AttributeCode: det.Code,
              AttributeValue: det.DefaultValue,
            });
          });
          modLoadingDataInfo.ArrTransactionAdditive[index].Attributes.push(
            attribute
          );
        });
      }
      this.setState({ modLoadingDataInfo });
      return modLoadingDataInfo;
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  handleAttributeCellDataEdit = (attribute, value, dataPosition = {}) => {
    try {
      attribute.DefaultValue = value;
      if (dataPosition.type === "TransactionFPinfo") {
        const attributeFPValidationErrors = lodash.cloneDeep(
          this.state.attributeFPValidationErrors
        );

        attributeFPValidationErrors.forEach((attributeValidation) => {
          if (attributeValidation.TerminalCode === attribute.TerminalCode) {
            attributeValidation.attributeValidationErrors[attribute.Code] =
              Utilities.valiateAttributeField(attribute, value);
          }
        });
        this.setState({ attributeFPValidationErrors });
      } else if (dataPosition.type === "ArrTransactionBP") {
        const attributeBPValidationErrors = lodash.cloneDeep(
          this.state.attributeBPValidationErrors
        );

        attributeBPValidationErrors.forEach((attributeValidation) => {
          if (attributeValidation.TerminalCode === attribute.TerminalCode) {
            attributeValidation.attributeValidationErrors[attribute.Code] =
              Utilities.valiateAttributeField(attribute, value);
          }
        });
        this.setState({ attributeBPValidationErrors });
      } else {
        const attributeAddValidationErrors = lodash.cloneDeep(
          this.state.attributeAddValidationErrors
        );

        attributeAddValidationErrors.forEach((attributeValidation) => {
          if (attributeValidation.TerminalCode === attribute.TerminalCode) {
            attributeValidation.attributeValidationErrors[attribute.Code] =
              Utilities.valiateAttributeField(attribute, value);
          }
        });
        this.setState({ attributeAddValidationErrors });
      }
    } catch (error) {
      console.log(
        "RailReceiptManualEntryDetailsComposite:Error occured on handleAttributeCellDataEdit",
        error
      );
    }
  };
  terminalFPSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var selectedFPAttributeList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        selectedFPAttributeList = lodash.cloneDeep(
          this.state.selectedFPAttributeList
        );
        const attributeFPValidationErrors = lodash.cloneDeep(
          this.state.attributeFPValidationErrors
        );
        var modLoadingDataInfo = lodash.cloneDeep(
          this.state.modLoadingDataInfo
        );

        selectedTerminals.forEach((terminal) => {
          var existitem = selectedFPAttributeList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.RAILUNLOADINGDETAILSFP.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue =
                  modLoadingDataInfo.TransactionFPinfo.Attributes.find(
                    (Attribute) => {
                      return Attribute.TerminalCode === terminal;
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
        selectedFPAttributeList = [];
        selectedFPAttributeList = attributesTerminalsList;
        selectedFPAttributeList = Utilities.attributesConvertoDecimal(
          selectedFPAttributeList
        );

        attributeFPValidationErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(attributeValidation.attributeValidationErrors).forEach(
              (key) => (attributeValidation.attributeValidationErrors[key] = "")
            );
          }
        });
        this.setState({ selectedFPAttributeList, attributeFPValidationErrors });
      }
    } catch (error) {
      console.log(
        "RailReceiptManualEntryComposite:Error occured on terminalFPSelectionChange",
        error
      );
    }
  }
  terminalBPSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsLists = [];

        var attributeMetaDataList = [];
        var selectedBPAttributeList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        selectedBPAttributeList = lodash.cloneDeep(
          this.state.selectedBPAttributeList
        );
        const attributeBPValidationErrors = lodash.cloneDeep(
          this.state.attributeBPValidationErrors
        );
        var modLoadingDataInfo = lodash.cloneDeep(
          this.state.modLoadingDataInfo
        );

        selectedTerminals.forEach((terminal) => {
          var existitem = selectedBPAttributeList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            for (let bpItem of modLoadingDataInfo.ArrTransactionBP) {
              let attributesTerminalsList = [];
              attributeMetaDataList.RAILUNLOADINGDETAILSBP.forEach(function (
                attributeMetaData
              ) {
                if (attributeMetaData.TerminalCode === terminal) {
                  var Attributevalue = bpItem.Attributes.find((Attribute) => {
                    return Attribute.TerminalCode === terminal;
                  });
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
                  attributesTerminalsList.push(
                    lodash.cloneDeep(attributeMetaData)
                  );
                }
              });
              attributesTerminalsLists.push(attributesTerminalsList);
            }
          } else {
            attributesTerminalsLists.push(existitem);
          }
        });
        selectedBPAttributeList = [];
        selectedBPAttributeList = attributesTerminalsLists;
        attributesTerminalsLists.forEach((item) => {
          item = Utilities.attributesConvertoDecimal(item);
        });

        attributeBPValidationErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(
              attributeValidation.attributeBPValidationErrors
            ).forEach(
              (key) =>
                (attributeValidation.attributeBPValidationErrors[key] = "")
            );
          }
        });
        this.setState({ selectedBPAttributeList, attributeBPValidationErrors });
      }
    } catch (error) {
      console.log(
        "RailReceiptManualEntryComposite:Error occured on terminalBPSelectionChange",
        error
      );
    }
  }
  terminalAddSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsLists = [];
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var selectedAddAttributeList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        selectedAddAttributeList = lodash.cloneDeep(
          this.state.selectedAddAttributeList
        );
        const attributeAddValidationErrors = lodash.cloneDeep(
          this.state.attributeAddValidationErrors
        );
        var modLoadingDataInfo = lodash.cloneDeep(
          this.state.modLoadingDataInfo
        );

        selectedTerminals.forEach((terminal) => {
          var existitem = selectedAddAttributeList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            for (let addItem of modLoadingDataInfo.ArrTransactionAdditive) {
              attributeMetaDataList.RAILUNLOADINGDETAILSADDITIVE.forEach(
                function (attributeMetaData) {
                  if (attributeMetaData.TerminalCode === terminal) {
                    var Attributevalue = addItem.Attributes.find(
                      (Attribute) => {
                        return Attribute.TerminalCode === terminal;
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
                    attributesTerminalsList.push(
                      lodash.cloneDeep(attributeMetaData)
                    );
                  }
                }
              );
              attributesTerminalsLists.push(attributesTerminalsList);
            }
          } else {
            attributesTerminalsList.push(existitem);
          }
        });
        selectedAddAttributeList = [];
        selectedAddAttributeList = attributesTerminalsLists;
        attributesTerminalsLists.forEach((item) => {
          item = Utilities.attributesConvertoDecimal(item);
        });

        attributeAddValidationErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(
              attributeValidation.attributeAddValidationErrors
            ).forEach(
              (key) =>
                (attributeValidation.attributeAddValidationErrors[key] = "")
            );
          }
        });
        this.setState({
          selectedAddAttributeList,
          attributeAddValidationErrors,
        });
      }
    } catch (error) {
      console.log(
        "RailReceiptManualEntryComposite:Error occured on terminalAddSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.RAILUNLOADINGDETAILSFP) && attributeMetaDataList.RAILUNLOADINGDETAILSFP.length > 0) {
        this.terminalFPSelectionChange([
          attributeMetaDataList.RAILUNLOADINGDETAILSFP[0].TerminalCode,
        ]);
      }
      if (Array.isArray(attributeMetaDataList.RAILUNLOADINGDETAILSBP) && attributeMetaDataList.RAILUNLOADINGDETAILSBP.length > 0) {
        this.terminalBPSelectionChange([
          attributeMetaDataList.RAILUNLOADINGDETAILSBP[0].TerminalCode,
        ]);
      }
      if (Array.isArray(attributeMetaDataList.RAILUNLOADINGDETAILSADDITIVE) && attributeMetaDataList.RAILUNLOADINGDETAILSADDITIVE.length > 0) {
        this.terminalAddSelectionChange([
          attributeMetaDataList.RAILUNLOADINGDETAILSADDITIVE[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }
  handleDateTextChange = (propertyName, value, error) => {
    try {
      var manualEntryValidationDict = lodash.cloneDeep(
        this.state.manualEntryValidationDict
      );
      var modLoadingDataInfo = lodash.cloneDeep(this.state.modLoadingDataInfo);
      manualEntryValidationDict.common[propertyName] = error;
      modLoadingDataInfo.TransactionFPinfo[propertyName] = value;
      this.setState({ manualEntryValidationDict, modLoadingDataInfo });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite:Error occured on handleDateTextChange",
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
        attributeFPValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.RAILUNLOADINGDETAILSFP
          ),
        attributeBPValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.RAILUNLOADINGDETAILSBP
          ),
        attributeAddValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.RAILUNLOADINGDETAILSADDITIVE
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }
  renderModal() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal
            onClose={() => this.setState({ openManualEntryWarn: false })}
            size="mini"
            open={this.state.openManualEntryWarn}
            closeOnDimmerClick={false}
          >
            <Modal.Content>
              <div>
                <b>{t("WagonStatusForManualEntryInvalid")}</b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                size="small"
                content={t("ViewMarineReceiptList_Cancel")}
                onClick={() => this.setState({ openManualEntryWarn: false })}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    return this.state.isReadyToRender ? (
      <div>
        {this.renderModal()}
        <ErrorBoundary>
          <RailReceiptManualEntryDetails
            IsManEntryEnabled={this.state.IsManEntryEnabled}
            modLoadingDataInfo={this.state.modLoadingDataInfo}
            validationErrors={this.state.manualEntryValidationDict}
            listOptions={{
              wagonCodes: this.state.wagonCodeOptions,
              clusterCodes: this.state.clusterCodeOptions,
              BCUCodes: this.state.BCUCodeOptions,
              loadingArmCodes: this.state.loadingArmCodeOptions,
              quantityUOMs: this.state.quantityUOMOptions,
              densityUOMs: this.state.densityUOMOptions,
              temperatureUOMs: this.state.temperatureUOMOptions,
              tankCodes: this.getTankCodeSearchOptions(),
              meterCodes: this.getMeterCodeSearchOptions(),
            }}
            onFieldChange={this.handleCompartmentManualEntryChange}
            onTankSearchChange={this.handleTankSearchChange}
            onMeterSearchChange={this.handleMeterSearchChange}
            onTabChange={this.handleManualEntryTabChange}
            tabActiveIndex={this.state.manualEntryTabActiveIndex}
            selectedFPAttributeList={this.state.selectedFPAttributeList}
            selectedBPAttributeList={this.state.selectedBPAttributeList}
            selectedAddAttributeList={this.state.selectedAddAttributeList}
            attributeBPValidationErrors={this.state.attributeBPValidationErrors}
            attributeFPValidationErrors={this.state.attributeFPValidationErrors}
            attributeAddValidationErrors={
              this.state.attributeAddValidationErrors
            }
            onDateTextChange={this.handleDateTextChange}
            handleAttributeCellDataEdit={this.handleAttributeCellDataEdit}
          ></RailReceiptManualEntryDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleCompartmentManualEntrySave}
            handleReset={this.handleCompartmentManualEntryReset}
            saveEnabled={this.state.SaveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
                    <UserAuthenticationLayout
                        Username={this.props.userDetails.EntityResult.UserName}
                        functionName={functionGroups.add}
                        functionGroup={fnViewRailUnLoadingDetails}
                        handleOperation={this.saveManualEntry}
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

const mapWagonToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapWagonToProps
)(RailReceiptManualEntryComposite);

RailReceiptManualEntryComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
