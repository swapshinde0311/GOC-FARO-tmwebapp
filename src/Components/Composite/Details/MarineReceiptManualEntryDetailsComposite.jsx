import React, { Component } from "react";

import * as Utilities from "../../../JS/Utilities";
import * as Constants from "../../../JS/Constants";
import * as RestApis from "../../../JS/RestApis";
import * as KeyCodes from "../../../JS/KeyCodes";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { TranslationConsumer } from "@scuf/localization";
import { MarineReceiptManualEntryDetails } from "../../UIBase/Details/MarineReceiptManualEntryDetails";
import { MarineReceiptManualEntryFPTransactionsDetails } from "../../UIBase/Details/MarineReceiptManualEntryFPTransactionsDetails";
import { MarineReceiptManualEntryBaseProductDetails } from "../../UIBase/Details/MarineReceiptManualEntryBaseProductDetails";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { Tab } from "@scuf/common";
import {
  emptyRailMarineTransactionBPInfo,
  emptyMarineRailTransactionCommonInfo,
} from "../../../JS/DefaultEntities";
import {
  marineReceiptManualEntryValidationDef,
  marineReceiptManualEntryBPValidationDef,
} from "../../../JS/ValidationDef";
import ErrorBoundary from "../../ErrorBoundary";
import NotifyEvent from "../../../JS/NotifyEvent";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import lodash from "lodash";
import axios from "axios";
import PropTypes from "prop-types";
import {
  marineUnloadingSFPAttributeEntity,
  marineUnloadingSBPAttributeEntity,
} from "../../../JS/AttributeEntity";
import { ReceiptCompartmentStatus } from "../../../JS/Constants";
import {functionGroups,fnMarineReceiptByCompartment,fnViewMarineUnloadingDetails} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class MarineReceiptManualEntryDetailsComposite extends Component {
  state = {
    railMarineTransactionCommonInfo: lodash.cloneDeep(
      emptyMarineRailTransactionCommonInfo
    ),
    validationErrors: Utilities.getInitialValidationErrors(
      marineReceiptManualEntryValidationDef
    ),
    railMarineTransactionBPInfo: {},
    validationBPErrors: {},
    isReadyToRender: false,
    saveEnabled: true,
    selectedCompartment: {},
    compartmentSeqNoInVehicleList: [],
    receiptCompartmentDetails: [],
    productList: [],
    berthList: [],
    bcuCodeList: [],
    unLoadingArmList: [],
    quantityUOMList: [],
    temperatureUOMList: [],
    densityUOMList: [],
    meterCodeList: [],
    massUOMList: [],
    pressureUOMList: [],
    calculatedValueUOMList: [],
    tankList: {},
    activeIndex: 0,
    attribute: [],
    selectedAttributeFPList: [],
    selectedAttributeBPList: {},
    attributeUnloadingDetailsFPDataList: [],
    attributeUnloadingDetailsBPDataList: [],
    attributeValidationBPErrors: {},
    attributeValidationFPErrors: [],
    marineReceiptManualEntryEnabled: false,
    showAuthenticationLayout: false,

  };

  getMarineReceiptManualEntryEnabled(selectedCompartment) {
    let ReceiptCompartmentStatusKeys = Object.keys(ReceiptCompartmentStatus);
    let MarineReceiptCompartmentStatus = "";
    for (const key of ReceiptCompartmentStatusKeys) {
      if (
        ReceiptCompartmentStatus[key] ===
        selectedCompartment.ReceiptCompartmentStatus
      ) {
        MarineReceiptCompartmentStatus = key;
        break;
      }
    }
    axios(
      RestApis.GetMarineReceiptManualEntryEnabled +
      "?ShareholderCode=" +
      selectedCompartment.ShareholderCode +
      "&ReceiptStatus=" +
      this.props.ReceiptStatus +
      "&ReceiptCompartmentStatus=" +
      MarineReceiptCompartmentStatus,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let { marineReceiptManualEntryEnabled } = this.state;
          if (result.EntityResult === "TRUE") {
            marineReceiptManualEntryEnabled = true;
          } else {
            marineReceiptManualEntryEnabled = false;
          }
          this.setState({ marineReceiptManualEntryEnabled });
        } else {
          this.setState({ marineReceiptManualEntryEnabled: false });
          console.log(
            "Error in getMarineReceiptManualEntryEnabled:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting Marine Receipt ManualEntry Enabled:",
          error
        );
      });
  }

  getBerthList() {
    axios(
      RestApis.GetMarineBerthList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var berthList = [];
          list.forEach((item) => {
            berthList.push(item.Code);
          });
          this.setState({
            berthList: Utilities.transferListtoOptions(berthList),
          });
        } else {
          console.log("Error in GetMarineUOMListByType:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetMarineUOMListByType:", error);
      });
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
        RestApis.GetBCUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let bcu = result.EntityResult;

          let railMarineTransactionCommonInfo = lodash.cloneDeep(this.state.railMarineTransactionCommonInfo);
          railMarineTransactionCommonInfo.TemperatureUOM = bcu.TemperatureUOM;
          railMarineTransactionCommonInfo.ProductDensityUOM = bcu.DensityUOM;
          let railMarineTransactionBPInfo = lodash.cloneDeep(this.state.railMarineTransactionBPInfo)
          if (railMarineTransactionBPInfo != null) {
            Object.keys(railMarineTransactionBPInfo).forEach((bpInfo) => {
              railMarineTransactionBPInfo[bpInfo]['TemperatureUOM'] = bcu.TemperatureUOM;
              railMarineTransactionBPInfo[bpInfo]['ProductDensityUOM'] = bcu.DensityUOM;
            })
          }

          this.setState({
            railMarineTransactionCommonInfo, railMarineTransactionBPInfo
          });

        }
      });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite:Error while getting getBCUDeviceDetails"
      );
    }
  }


  GetMetersForLA() {

    const railMarineTransactionCommonInfo = lodash.cloneDeep(
      this.state.railMarineTransactionCommonInfo
    );
    let bcuCode = '';
    let loadingArmCode = ''
    bcuCode = railMarineTransactionCommonInfo.BCUCode;
    loadingArmCode = railMarineTransactionCommonInfo.UnLoadingArm;
    if (bcuCode === '' || loadingArmCode === '')
      return;

    try {
      var keyCode = [
        {
          key: KeyCodes.siteViewType,
          value: Constants.siteViewType.MARINE_BCUVIEW,
        },
        {
          key: KeyCodes.bcuCode,
          value: bcuCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.ActualTerminalCode,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.siteViewType,
        KeyCodes: keyCode,
      };
      axios(
        RestApis.GetBCUViewTree,
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

              mainLineMeters = loadingArm.AssociatedMeterList.find(meter => meter.MeterLineType === "MAINLINE");

              let bpMeterCode = '';
              let meterCodeList = [];
              if (mainLineMeters !== null && mainLineMeters !== "") {
                mainLineMeters.MeterList.forEach(element => {
                  meterCodeList.push(element.Code);
                });
                this.setState({
                  meterCodeList: Utilities.transferListtoOptions(meterCodeList),
                });

                if (mainLineMeters.MeterList.length === 1) {
                  bpMeterCode = mainLineMeters.MeterList[0].Code;
                }
              }

              if (bpMeterCode !== '') {
                let railMarineTransactionCommonInfo = lodash.cloneDeep(this.state.railMarineTransactionCommonInfo);
                railMarineTransactionCommonInfo.MeterCode = bpMeterCode;
                let railMarineTransactionBPInfo = lodash.cloneDeep(this.state.railMarineTransactionBPInfo)
                if (railMarineTransactionBPInfo != null) {
                  Object.keys(railMarineTransactionBPInfo).forEach((bpInfo) => {
                    railMarineTransactionBPInfo[bpInfo]['MeterCode'] = bpMeterCode;
                  })
                }

                this.setState({
                  railMarineTransactionBPInfo, railMarineTransactionCommonInfo
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


  getQuantityUOMList() {
    axios(
      RestApis.GetMarineUOMListByType +
      "?TypeName=" +
      Constants.UOM.QuantityUOM,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var quantityUOMList = [];
          list.forEach((item) => {
            quantityUOMList.push(item.Code);
          });
          this.setState({
            quantityUOMList: Utilities.transferListtoOptions(quantityUOMList),
          });
        } else {
          console.log("Error in getQuantityUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getQuantityUOMList:", error);
      });
  }

  getTemperatureUOMList() {
    axios(
      RestApis.GetMarineUOMListByType +
      "?TypeName=" +
      Constants.UOM.TemperatureUOM,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var temperatureUOMList = [];
          list.forEach((item) => {
            temperatureUOMList.push(item.Code);
          });
          this.setState({
            temperatureUOMList:
              Utilities.transferListtoOptions(temperatureUOMList),
          });
        } else {
          console.log("Error in getTemperatureUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getTemperatureUOMList:", error);
      });
  }

  getDensityUOMList() {
    axios(
      RestApis.GetMarineUOMListByType + "?TypeName=" + Constants.UOM.DensityUOM,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var densityUOMList = [];
          list.forEach((item) => {
            densityUOMList.push(item.Code);
          });
          this.setState({
            densityUOMList: Utilities.transferListtoOptions(densityUOMList),
          });
        } else {
          console.log("Error in getDensityUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getDensityUOMList:", error);
      });
  }

  getMeterCodeList() {
    axios(
      RestApis.GetMarineMeterList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var meterCodeList = [];
          list.forEach((item) => {
            meterCodeList.push(item.Code);
          });
          this.setState({
            meterCodeList: Utilities.transferListtoOptions(meterCodeList),
          });
        } else {
          console.log("Error in GetMarineMeterList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetMarineMeterList:", error);
      });
  }

  getMassUOMList() {
    axios(
      RestApis.GetMarineUOMListByType + "?TypeName=" + Constants.UOM.MassUOM,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var massUOMList = [];
          list.forEach((item) => {
            massUOMList.push(item.Code);
          });
          this.setState({
            massUOMList: Utilities.transferListtoOptions(massUOMList),
          });
        } else {
          console.log("Error in getMassUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getMassUOMList:", error);
      });
  }

  getPressureUOMList() {
    axios(
      RestApis.GetMarineUOMListByType +
      "?TypeName=" +
      Constants.UOM.PressureUOM,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var pressureUOMList = [];
          list.forEach((item) => {
            pressureUOMList.push(item.Code);
          });
          this.setState({
            pressureUOMList: Utilities.transferListtoOptions(pressureUOMList),
          });
        } else {
          console.log("Error in getPressureUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getPressureUOMList:", error);
      });
  }

  getCalculatedValueUOMList() {
    axios(
      RestApis.GetMarineUOMListByType +
      "?TypeName=" +
      Constants.UOM.CalculatedValueUOM,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var calculatedValueUOMList = [];
          list.forEach((item) => {
            calculatedValueUOMList.push(item.Code);
          });
          this.setState({
            calculatedValueUOMList: calculatedValueUOMList,
          });
        } else {
          console.log("Error in getCalculatedValueUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getCalculatedValueUOMList:", error);
      });
  }

  getBCUListByBerth(BayCode) {
    axios(
      RestApis.GetMarineBCUListByBerth + "?Berth=" + BayCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult;
          var bcuCodeList = [];
          list.forEach((item) => {
            bcuCodeList.push(item.DeviceCode);
          });
          this.setState({
            bcuCodeList: Utilities.transferListtoOptions(bcuCodeList),
          });

          if (bcuCodeList.length === 1) {
            let railMarineTransactionCommonInfo = lodash.cloneDeep(
              this.state.railMarineTransactionCommonInfo
            );
            railMarineTransactionCommonInfo.BCUCode = bcuCodeList[0];
            this.setState({
              railMarineTransactionCommonInfo
            });
            this.getBCUDetails(bcuCodeList[0]);
            this.GetUnloadingArmListByBCU(bcuCodeList[0])
          }

        } else {
          console.log("Error in GetMarineBCUListByBerth:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetMarineBCUListByBerth:", error);
      });
  }



  GetUnloadingArmListByBCU(BCUCode) {
    let railMarineTransactionCommonInfo = lodash.cloneDeep(
      this.state.railMarineTransactionCommonInfo
    );

    axios(
      RestApis.GetMarineLoadingArmListByBCU + "?BCUCode=" + BCUCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var unLoadingArmList = [];
          list.forEach((item) => {
            unLoadingArmList.push(item.LoadingArmCode);
          });
          this.setState({
            unLoadingArmList: Utilities.transferListtoOptions(unLoadingArmList),
          });

          if (unLoadingArmList.length === 1) {
            railMarineTransactionCommonInfo.UnLoadingArm = unLoadingArmList[0];

            this.setState({
              railMarineTransactionCommonInfo
            });

            this.GetMetersForLA();
          }


        } else {
          console.log(
            "Error in GetMarineLoadingArmListByBCU:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while GetMarineLoadingArmListByBCU:", error);
      });
  }

  getTankList(item, index) {
    var additiveCode = "";
    axios(
      RestApis.GetMarineTankList +
      "?AdditiveCode=" +
      additiveCode +
      "&BaseProductCode=" +
      item.code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var tankList = this.state.tankList;
          tankList[index] = [];
          list.forEach((item) => {
            tankList[index].push(item.Code);
          });
          tankList[index] = Utilities.transferListtoOptions(tankList[index]);
          this.setState({ tankList });
        } else {
          console.log("Error in GetMarineTankList:  " + result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetMarineTankList:" + error);
      });
  }

  getPartialMarineReceiptData() {
    var keyCode = [
      {
        key: "MarineReceiptCode",
        value: this.props.ReceiptCode,
      },
      {
        key: "CompartmentSeqNoInVehicle",
        value: this.state.selectedCompartment.CompartmentSeqNoInVehicle,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedCompartment.ShareholderCode,
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetPartialMarineReceiptData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        this.setState({
          productList: response.data.EntityResult.Table,
        });
        this.state.productList.forEach((item, index) => {
          this.getTankList(item, index);
          this.handleProductDetail(item);
        });
        this.initializePartialAttribute();
        this.getAttributes();
      })
      .catch((error) => {
        console.log("Error while getPartialMarineReceiptData:", error);
      });
  }

  handleProductDetail(item) {
    const { railMarineTransactionBPInfo, validationBPErrors } = this.state;
    railMarineTransactionBPInfo[item.code] = lodash.cloneDeep(
      emptyRailMarineTransactionBPInfo
    );
    validationBPErrors[item.code] = Utilities.getInitialValidationErrors(
      marineReceiptManualEntryBPValidationDef
    );
    this.setState({
      railMarineTransactionBPInfo,
      validationBPErrors,
    });
  }

  getReceiptCompartmentDetails() {
    const { ReceiptCode } = this.props;
    if (ReceiptCode === undefined) {
      this.setState({
        receiptCompartmentDetails: [],
      });
      return;
    }
    axios(
      RestApis.GetMarineReceiptCompartmentDetails +
      "?MarineReceiptCode=" +
      ReceiptCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            receiptCompartmentDetails: result.EntityResult,
          });
          this.getCompartmentSeqNoInVehicleList();
        } else {
          this.setState({
            receiptCompartmentDetails: [],
          });
          console.log(
            "Error in getReceiptCompartmentDetails:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting receipt compartment details:", error);
      });
  }

  getCompartmentSeqNoInVehicleList() {
    let compartmentSeqNoInVehicleList = [];
    this.state.receiptCompartmentDetails.forEach((item) => {
      compartmentSeqNoInVehicleList.push(item.CompartmentSeqNoInVehicle);
    });
    this.setState({
      compartmentSeqNoInVehicleList: Utilities.transferListtoOptions(
        compartmentSeqNoInVehicleList
      ),
    });
  }

  getselectedCompartment(selectedCompartmentCompartmentSeqNoInVehicle) {
    let selectedCompartment = this.state.receiptCompartmentDetails.find(
      (item) => {
        return (
          item.CompartmentSeqNoInVehicle ===
          +selectedCompartmentCompartmentSeqNoInVehicle
        );
      }
    );
    this.setState(
      {
        selectedCompartment,
        activeIndex: 0,
        railMarineTransactionBPInfo: {},
        validationBPErrors: {},
      },
      () => {
        this.handleChange(
          "FinishedProductCode",
          this.state.selectedCompartment.FinishedProductCode
        );
        this.getMarineReceiptManualEntryEnabled(selectedCompartment);
        this.getPartialMarineReceiptData();
      }
    );
  }

  componentDidMount() {
    this.setDefaultValues();
    this.getReceiptCompartmentDetails();
    this.getBerthList();
    this.getQuantityUOMList();
    this.getTemperatureUOMList();
    this.getDensityUOMList();
    this.getMeterCodeList();
    this.getMassUOMList();
    this.getPressureUOMList();
    this.getCalculatedValueUOMList();
    this.setState({
      isReadyToRender: true,
    });
  }

  setDefaultValues() {
    let railMarineTransactionCommonInfo = lodash.cloneDeep(this.state.railMarineTransactionCommonInfo);
    railMarineTransactionCommonInfo.StartTime = new Date();
    railMarineTransactionCommonInfo.EndTime = new Date();
    railMarineTransactionCommonInfo.QuantityUOM = this.props.QuantityUOM; // to display Ship Qty UOM, in place MOT UOM
    this.setState({ railMarineTransactionCommonInfo });

  }

  initializePartialAttribute() {
    let BPCode = Object.keys(this.state.railMarineTransactionBPInfo);
    let { selectedAttributeBPList } = this.state;
    BPCode.forEach((code) => {
      selectedAttributeBPList[code] = [];
    });
    this.setState({
      selectedAttributeBPList,
      selectedAttributeFPList: [],
      attribute: [],
    });
  }

  getAttributes() {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [
            marineUnloadingSFPAttributeEntity,
            marineUnloadingSBPAttributeEntity,
          ],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let BPCode = Object.keys(this.state.railMarineTransactionBPInfo);
          let { attributeValidationBPErrors } = this.state;
          BPCode.forEach((code) => {
            attributeValidationBPErrors[code] =
              Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.marineUnloadingDetailsBP
              );
          });
          this.setState(
            {
              attributeUnloadingDetailsFPDataList: lodash.cloneDeep(
                result.EntityResult.marineUnloadingDetailsFP
              ),
              attributeValidationFPErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.marineUnloadingDetailsFP
                ),
              attributeUnloadingDetailsBPDataList: lodash.cloneDeep(
                result.EntityResult.marineUnloadingDetailsBP
              ),
              attributeValidationBPErrors,
            },
            () => {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                if (this.state.attributeUnloadingDetailsBPDataList.length > 0) {
                  this.terminalSelectionChangeBP([
                    this.state.attributeUnloadingDetailsBPDataList[0]
                      .TerminalCode,
                  ]);
                }
                if (this.state.attributeUnloadingDetailsFPDataList.length > 0) {
                  this.terminalSelectionChangeFP([
                    this.state.attributeUnloadingDetailsFPDataList[0]
                      .TerminalCode,
                  ]);
                }
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  localNodeAttribute() {
    try {
      var attributeUnloadingDetailsBPDataList = lodash.cloneDeep(
        this.state.attributeUnloadingDetailsBPDataList
      );
      var attributeUnloadingDetailsFPDataList = lodash.cloneDeep(
        this.state.attributeUnloadingDetailsFPDataList
      );
      if (Array.isArray(attributeUnloadingDetailsBPDataList) && attributeUnloadingDetailsBPDataList.length > 0) {
        this.terminalSelectionChangeBP([
          attributeUnloadingDetailsBPDataList[0].TerminalCode,
        ]);
      }
      if (Array.isArray(attributeUnloadingDetailsFPDataList) && attributeUnloadingDetailsFPDataList.length > 0) {
        this.terminalSelectionChangeFP([
          attributeUnloadingDetailsFPDataList[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on localNodeAttribute",
        error
      );
    }
  }

  terminalSelectionChangeFP(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeUnloadingDetailsFPDataList = [];
      var selectedAttributeFPList = [];
      attributeUnloadingDetailsFPDataList = lodash.cloneDeep(
        this.state.attributeUnloadingDetailsFPDataList
      );
      selectedAttributeFPList = lodash.cloneDeep(
        this.state.selectedAttributeFPList
      );
      const attributeValidationFPErrors = lodash.cloneDeep(
        this.state.attributeValidationFPErrors
      );
      var railMarineTransactionFPInfo = lodash.cloneDeep(
        emptyMarineRailTransactionCommonInfo
      );
      selectedTerminals.forEach((terminal) => {
        var existitem = selectedAttributeFPList.find((selectedAttributeFP) => {
          return selectedAttributeFP.TerminalCode === terminal;
        });
        if (existitem === undefined) {
          attributeUnloadingDetailsFPDataList.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = railMarineTransactionFPInfo.Attributes.find(
                (FPAttribute) => {
                  return FPAttribute.TerminalCode === terminal;
                }
              );
              if (Attributevalue !== undefined) {
                attributeMetaData.attributeUnloadingDetailsFPDataList.forEach(
                  function (attributeMetaData) {
                    var valueAttribute =
                      Attributevalue.ListOfAttributeData.find((x) => {
                        return x.AttributeCode === attributeMetaData.Code;
                      });
                    if (valueAttribute !== undefined)
                      attributeMetaData.DefaultValue =
                        valueAttribute.AttributeValue;
                  }
                );
              }
              attributesTerminalsList.push(attributeMetaData);
            }
          });
        } else {
          attributesTerminalsList.push(existitem);
        }
      });
      selectedAttributeFPList = [];
      selectedAttributeFPList = attributesTerminalsList;
      attributeValidationFPErrors.forEach((attributeValidation) => {
        var existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationFPErrors).forEach(
            (key) => (attributeValidation.attributeValidationFPErrors[key] = "")
          );
        }
      });
      this.setState({ selectedAttributeFPList, attributeValidationFPErrors });
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on terminalSelectionChangeFP",
        error
      );
    }
  }

  terminalSelectionChangeBP(selectedTerminals) {
    let BPCode = Object.keys(this.state.railMarineTransactionBPInfo);
    BPCode.forEach((code) => {
      try {
        let attributesTerminalsList = [];
        var attributeUnloadingDetailsBPDataList = [];
        var selectedAttributeBPList = [];
        attributeUnloadingDetailsBPDataList = lodash.cloneDeep(
          this.state.attributeUnloadingDetailsBPDataList
        );
        selectedAttributeBPList = lodash.cloneDeep(
          this.state.selectedAttributeBPList[code]
        );
        const attributeValidationBPErrors = lodash.cloneDeep(
          this.state.attributeValidationBPErrors[code]
        );
        var railMarineTransactionBPInfo = lodash.cloneDeep(
          this.state.railMarineTransactionBPInfo[code]
        );
        selectedTerminals.forEach((terminal) => {
          var existitem = selectedAttributeBPList.find(
            (selectedAttributeBP) => {
              return selectedAttributeBP.TerminalCode === terminal;
            }
          );
          if (existitem === undefined) {
            attributeUnloadingDetailsBPDataList.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue =
                  railMarineTransactionBPInfo.Attributes.find((BPAttribute) => {
                    return BPAttribute.TerminalCode === terminal;
                  });
                if (Attributevalue !== undefined) {
                  attributeMetaData.attributeUnloadingDetailsBPDataList.forEach(
                    function (attributeMetaData) {
                      var valueAttribute =
                        Attributevalue.ListOfAttributeData.find((x) => {
                          return x.AttributeCode === attributeMetaData.Code;
                        });
                      if (valueAttribute !== undefined)
                        attributeMetaData.DefaultValue =
                          valueAttribute.AttributeValue;
                    }
                  );
                }
                attributesTerminalsList.push(attributeMetaData);
              }
            });
          } else {
            attributesTerminalsList.push(existitem);
          }
        });
        selectedAttributeBPList = [];
        selectedAttributeBPList = attributesTerminalsList;
        attributeValidationBPErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(
              attributeValidation.attributeValidationBPErrors
            ).forEach(
              (key) =>
                (attributeValidation.attributeValidationBPErrors[key] = "")
            );
          }
        });
        let newSelectedAttributeBPList = this.state.selectedAttributeBPList;
        let newAttributeValidationBPErrors =
          this.state.attributeValidationBPErrors;
        newSelectedAttributeBPList[code] = selectedAttributeBPList;
        newAttributeValidationBPErrors[code] = attributeValidationBPErrors;
        this.setState({
          selectedAttributeBPList: newSelectedAttributeBPList,
          attributeValidationBPErrors: newAttributeValidationBPErrors,
        });
      } catch (error) {
        console.log(
          "MarineReceiptManualEntryDetails:Error occured on terminalSelectionChangeBP",
          error
        );
      }
    });
  }

  handleChange = (propertyName, data) => {
    try {
      let railMarineTransactionCommonInfo = lodash.cloneDeep(
        this.state.railMarineTransactionCommonInfo
      );
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      railMarineTransactionCommonInfo[propertyName] = data;
      this.setState({ railMarineTransactionCommonInfo });
      if (marineReceiptManualEntryValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          marineReceiptManualEntryValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      if (propertyName === "CompartmentSeqNoInVehicle") {
        this.getselectedCompartment(data);
        let railMarineTransactionCommonInfo = lodash.cloneDeep(
          emptyMarineRailTransactionCommonInfo
        );
        if (data !== "") {
          railMarineTransactionCommonInfo.CompartmentSeqNoInVehicle = data;
          railMarineTransactionCommonInfo.QuantityUOM = this.props.QuantityUOM;
          railMarineTransactionCommonInfo.StartTime = new Date();
          railMarineTransactionCommonInfo.EndTime = new Date();
        }
        const validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach(function (key) {
          validationErrors[key] = "";
        });
        this.setState({
          railMarineTransactionCommonInfo,
          validationErrors,
          bcuCodeList: [],
          unLoadingArmList: [],
          saveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnMarineReceiptByCompartment),
        });
      }
      if (propertyName === "BayCode") {
        if (data === null) {
          this.setState({ bcuCodeList: [] });
        } else {
          this.getBCUListByBerth(data);
        }
      }
      else if (propertyName === "BCUCode") {
        this.GetUnloadingArmListByBCU(data);
      }
      else if (propertyName === "UnLoadingArm") {
        this.setState({ railMarineTransactionCommonInfo }, () => {
          this.GetMetersForLA();
        });
      }

    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on handleChange",
        error
      );
    }
  };

  handleBPChange = (propertyName, data, code) => {
    try {
      const railMarineTransactionBPInfo = lodash.cloneDeep(
        this.state.railMarineTransactionBPInfo
      );
      const validationBPErrors = lodash.cloneDeep(
        this.state.validationBPErrors
      );
      railMarineTransactionBPInfo[code][propertyName] = data;
      this.setState({ railMarineTransactionBPInfo });
      if (marineReceiptManualEntryBPValidationDef[propertyName] !== undefined) {
        validationBPErrors[code][propertyName] = Utilities.validateField(
          marineReceiptManualEntryBPValidationDef[propertyName],
          data
        );
        this.setState({ validationBPErrors });
      }
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on handleChange",
        error
      );
    }
  };

  handleFPAttributeCellDataEdit = (attribute, value) => {
    try {
      const attributeValidationFPErrors = lodash.cloneDeep(
        this.state.attributeValidationFPErrors
      );
      attributeValidationFPErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationFPErrors });
      if (
        attribute.DataType === Constants.AttributeTypes.INT ||
        attribute.DataType === Constants.AttributeTypes.LONG ||
        attribute.DataType === Constants.AttributeTypes.FLOAT ||
        attribute.DataType === Constants.AttributeTypes.DOUBLE
      ) {
        value = Utilities.convertStringtoDecimal(value);
      }
      attribute.DefaultValue = value;
      this.setState({
        attribute: attribute,
      });
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on handleFPAttributeCellDataEdit",
        error
      );
    }
  };

  handleBPAttributeCellDataEdit = (attribute, value, code) => {
    try {
      const attributeValidationBPErrors = lodash.cloneDeep(
        this.state.attributeValidationBPErrors
      );
      attributeValidationBPErrors[code].forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationBPErrors });

      if (
        attribute.DataType === Constants.AttributeTypes.INT ||
        attribute.DataType === Constants.AttributeTypes.LONG ||
        attribute.DataType === Constants.AttributeTypes.FLOAT ||
        attribute.DataType === Constants.AttributeTypes.DOUBLE
      ) {
        value = Utilities.convertStringtoDecimal(value);
      }
      attribute.DefaultValue = value;
      this.setState({
        attribute: attribute,
      });
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on handleBPAttributeCellDataEdit",
        error
      );
    }
  };

  addLoadingDetails = () => {
    try {
      this.setState({ saveEnabled: false, marineReceiptManualEntryEnabled: false });
      this.createManualEntry();
    } catch (error) {
      console.log("Marine Loading DetailsComposite : Error in save Marine Loading details");
    }
  };

  handleSave = () => {
    try {
      if (this.validateSave()) {
       
        this.fillFPAttributeDetails(this.state.railMarineTransactionCommonInfo);
        this.fillBPAttributeDetails(this.state.railMarineTransactionBPInfo);
        
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      
      this.setState({ showAuthenticationLayout }, () => {
        if (showAuthenticationLayout === false) {
          this.addLoadingDetails();
          }
        });

      } else {
        this.setState({  saveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnMarineReceiptByCompartment), });
      }
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave() {
    const { railMarineTransactionBPInfo, railMarineTransactionCommonInfo } =
      this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    var validationBPErrors = lodash.cloneDeep(this.state.validationBPErrors);
    let BPCode = Object.keys(validationBPErrors);

    Object.keys(marineReceiptManualEntryValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        marineReceiptManualEntryValidationDef[key],
        railMarineTransactionCommonInfo[key]
      );
    });
    if (
      railMarineTransactionCommonInfo.StartTime >=
      railMarineTransactionCommonInfo.EndTime
    ) {
      validationErrors.StartTime = "MarineReceiptManualEntry_ErrorUnloadTime";
    }
    this.setState({ validationErrors });
    let returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    if (!returnValue) {
      this.setState({ activeIndex: 0 });
    }
    if (railMarineTransactionCommonInfo.CompartmentSeqNoInVehicle === "") {
      return returnValue;
    }

    BPCode.forEach((code) => {
      Object.keys(marineReceiptManualEntryBPValidationDef).forEach(function (
        key
      ) {
        validationBPErrors[code][key] = Utilities.validateField(
          marineReceiptManualEntryBPValidationDef[key],
          railMarineTransactionBPInfo[code][key]
        );
      });
    });
    this.setState({ validationBPErrors });
    let BPValueList = BPCode.map((code) => {
      var BPValue = Object.values(validationBPErrors[code]).every(function (
        value
      ) {
        return value === "";
      });
      return BPValue;
    });
    let errorIndex = BPValueList.findIndex((item) => {
      return item !== true;
    });
    if (errorIndex !== -1) {
      this.setState({ activeIndex: errorIndex + 1 });
    }
    let returnBPValue = BPValueList.every(function (value) {
      return value === true;
    });

    var attributeValidationFPErrors = lodash.cloneDeep(
      this.state.attributeValidationFPErrors
    );
    let attributeFPList = lodash.cloneDeep(this.state.selectedAttributeFPList);
    attributeFPList.forEach((attribute) => {
      attributeValidationFPErrors.forEach((attributeValidation) => {
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
    this.setState({ attributeValidationFPErrors });
    let returnAttributeFPValue = true;
    attributeValidationFPErrors.forEach((x) => {
      returnAttributeFPValue = Object.values(x.attributeValidationErrors).every(
        function (value) {
          return value === "";
        }
      );
    });
    if (!returnAttributeFPValue) {
      this.setState({ activeIndex: 0 });
    }

    let attributeValidationBPErrors = lodash.cloneDeep(
      this.state.attributeValidationBPErrors
    );
    let attributeBPList = lodash.cloneDeep(this.state.selectedAttributeBPList);
    BPCode.forEach((code) => {
      attributeBPList[code].forEach((attribute) => {
        attributeValidationBPErrors[code].forEach((attributeValidation) => {
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
    });
    this.setState({ attributeValidationBPErrors });
    let attributeBPValueList = BPCode.map((code) => {
      let attributeBPValue = true;
      attributeValidationBPErrors[code].forEach((x) => {
        attributeBPValue = Object.values(x.attributeValidationErrors).every(
          function (value) {
            return value === "";
          }
        );
      });
      return attributeBPValue;
    });
    let attributeErrorIndex = attributeBPValueList.findIndex((item) => {
      return item !== true;
    });
    if (attributeErrorIndex !== -1) {
      this.setState({ activeIndex: attributeErrorIndex + 1 });
    }
    let returnAttributeBPValue = attributeBPValueList.every(function (value) {
      return value === true;
    });

    return (
      returnValue &&
      returnBPValue &&
      returnAttributeFPValue &&
      returnAttributeBPValue
    );
  }

  createManualEntry() {
    this.handleAuthenticationClose();
    let railMarineTransactionCommonInfo = lodash.cloneDeep(
      this.state.railMarineTransactionCommonInfo
    );
    let railMarineTransactionBPInfo = lodash.cloneDeep(
      this.state.railMarineTransactionBPInfo
    );
    Object.keys(railMarineTransactionCommonInfo).forEach((key) => {
      if (
        !(
          key.includes("UOM") ||
          key === "BayCode" ||
          key === "BCUCode" ||
          key === "UnLoadingArm" ||
          key === "StartTime" ||
          key === "EndTime" ||
          key === "FinishedProductCode" ||
          key === "Remarks" ||
          key === "MeterCode" ||
          key === "Attributes"
        )
      ) {
        railMarineTransactionCommonInfo[key] = Utilities.convertStringtoDecimal(
          railMarineTransactionCommonInfo[key]
        );
      }
    });
    let BPCode = Object.keys(railMarineTransactionBPInfo);
    BPCode.forEach((code) => {
      Object.keys(railMarineTransactionBPInfo[code]).forEach((key) => {
        if (
          !(
            key.includes("UOM") ||
            key === "MeterCode" ||
            key === "Attributes" ||
            key === "TankCode"
          )
        ) {
          railMarineTransactionBPInfo[code][key] =
            Utilities.convertStringtoDecimal(
              railMarineTransactionBPInfo[code][key]
            );
        }
      });
    });
    var keyCode = [
      {
        key: "MarineReceiptCode",
        value: this.props.ReceiptCode,
      },
      {
        key: "CompartmentSeqNoInVehicle",
        value: this.state.selectedCompartment.CompartmentSeqNoInVehicle,
      },
      {
        key: "FinishedProductCode",
        value: this.state.selectedCompartment.FinishedProductCode,
      },
    ];

    var notification = {
      messageType: "critical",
      message: "MarineReceiptManualEntry_SavedSuccess",
      messageResultDetails: [
        {
          keyFields: ["MarineReceiptManualEntry_CompSeqNo"],
          keyValues: [this.state.selectedCompartment.CompartmentSeqNoInVehicle],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    let arrTransactionBP = [];
    BPCode.forEach((code) => {
      arrTransactionBP.push({
        BaseProductCode: code,
        TankCode: railMarineTransactionBPInfo[code].TankCode,
        TankStartSnapShot: {
          MassUOM: railMarineTransactionBPInfo[code].MassUOM,
          GrossVolume: railMarineTransactionBPInfo[code].TankStartGrossQuantity,
          NetVolume: railMarineTransactionBPInfo[code].TankStartNetQuantity,
          GrossMass: railMarineTransactionBPInfo[code].TankStartGrossMass,
          Pressure: railMarineTransactionBPInfo[code].TankStartPressure,
        },
        TankEndSnapShot: {
          MassUOM: railMarineTransactionBPInfo[code].MassUOM,
          GrossVolume: railMarineTransactionBPInfo[code].TankEndGrossQuantity,
          NetVolume: railMarineTransactionBPInfo[code].TankEndNetQuantity,
          GrossMass: railMarineTransactionBPInfo[code].TankEndGrossMass,
          Pressure: railMarineTransactionBPInfo[code].TankEndPressure,
        },
        QuantityUOM: railMarineTransactionCommonInfo.QuantityUOM,
        StartTime: railMarineTransactionCommonInfo.StartTime,
        EndTime: railMarineTransactionCommonInfo.EndTime,
        TransactionID: railMarineTransactionCommonInfo.TransactionID,
        Remarks: railMarineTransactionCommonInfo.Remarks,
        GrossQuantity: railMarineTransactionBPInfo[code].GrossQuantity,
        NetQuantity: railMarineTransactionBPInfo[code].NetQuantity,
        Temperature: railMarineTransactionBPInfo[code].Temperature,
        TemperatureUOM: railMarineTransactionBPInfo[code].TemperatureUOM,
        ProductDensity: railMarineTransactionBPInfo[code].ProductDensity,
        ProductDensityUOM: railMarineTransactionBPInfo[code].ProductDensityUOM,
        StartTotalizer: railMarineTransactionBPInfo[code].StartTotalizer,
        EndTotalizer: railMarineTransactionBPInfo[code].EndTotalizer,
        NetStartTotalizer: railMarineTransactionBPInfo[code].NetStartTotalizer,
        NetEndTotalizer: railMarineTransactionBPInfo[code].NetEndTotalizer,
        MeterCode: railMarineTransactionBPInfo[code].MeterCode,
        GrossMass: railMarineTransactionBPInfo[code].GrossMass,
        MassUOM: railMarineTransactionBPInfo[code].MassUOM,
        Pressure: railMarineTransactionBPInfo[code].Pressure,
        PressureUOM: railMarineTransactionBPInfo[code].PressureUOM,
        CalculatedGross: railMarineTransactionBPInfo[code].CalculatedGross,
        CalculatedNet: railMarineTransactionBPInfo[code].CalculatedNet,
        CalculatedValueUOM:
          railMarineTransactionBPInfo[code].CalculatedValueUOM,
        Attributes: railMarineTransactionBPInfo[code].Attributes,
      });
    });

    var entity = {
      CommonInfo: {
        BayCode: railMarineTransactionCommonInfo.BayCode,
        BCUCode: railMarineTransactionCommonInfo.BCUCode,
        UnLoadingArm: railMarineTransactionCommonInfo.UnLoadingArm,
      },
      TransactionFPinfo: {
        QuantityUOM: railMarineTransactionCommonInfo.QuantityUOM,
        StartTime: railMarineTransactionCommonInfo.StartTime,
        EndTime: railMarineTransactionCommonInfo.EndTime,
        TransactionID: railMarineTransactionCommonInfo.TransactionID,
        Remarks: railMarineTransactionCommonInfo.Remarks,
        GrossQuantity: railMarineTransactionCommonInfo.GrossQuantity,
        NetQuantity: railMarineTransactionCommonInfo.NetQuantity,
        Temperature: railMarineTransactionCommonInfo.Temperature,
        TemperatureUOM: railMarineTransactionCommonInfo.TemperatureUOM,
        ProductDensity: railMarineTransactionCommonInfo.ProductDensity,
        ProductDensityUOM: railMarineTransactionCommonInfo.ProductDensityUOM,
        StartTotalizer: railMarineTransactionCommonInfo.StartTotalizer,
        EndTotalizer: railMarineTransactionCommonInfo.EndTotalizer,
        NetStartTotalizer: railMarineTransactionCommonInfo.NetStartTotalizer,
        NetEndTotalizer: railMarineTransactionCommonInfo.NetEndTotalizer,
        MeterCode: railMarineTransactionCommonInfo.MeterCode,
        GrossMass: railMarineTransactionCommonInfo.GrossMass,
        MassUOM: railMarineTransactionCommonInfo.MassUOM,
        Pressure: railMarineTransactionCommonInfo.Pressure,
        PressureUOM: railMarineTransactionCommonInfo.PressureUOM,
        TankStartSnapShot: {
          MassUOM: railMarineTransactionCommonInfo.MassUOM,
        },
        TankEndSnapShot: {
          MassUOM: railMarineTransactionCommonInfo.MassUOM,
        },
        CalculatedGross: railMarineTransactionCommonInfo.CalculatedGross,
        CalculatedNet: railMarineTransactionCommonInfo.CalculatedNet,
        CalculatedValueUOM: railMarineTransactionCommonInfo.CalculatedValueUOM,
        Attributes: railMarineTransactionCommonInfo.Attributes,
      },
      ArrTransactionBP: arrTransactionBP,
      ArrTransactionAdditive: null,
    };
    var obj = {
      ShareHolderCode: this.state.selectedCompartment.ShareHolderCode,
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
      Entity: entity,
    };
    axios(
      RestApis.MarineReceiptManualEntrySave,
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
          //this.handleReset();
          this.setState({  saveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnMarineReceiptByCompartment), }, () => {
            this.getMarineReceiptManualEntryEnabled(this.state.selectedCompartment);
          });
        } else {
          notification.message = "MarineReceiptManualEntry_SaveFailure";
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({  saveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
            fnMarineReceiptByCompartment),
            marineReceiptManualEntryEnabled: false
          });
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
        notification.messageResultDetails[0].errorMessage = error;
        console.log("Error while handleSave:", error);
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const railMarineTransactionCommonInfo = lodash.cloneDeep(
        emptyMarineRailTransactionCommonInfo
      );

      railMarineTransactionCommonInfo.StartTime = new Date();
      railMarineTransactionCommonInfo.EndTime = new Date();
      railMarineTransactionCommonInfo.QuantityUOM = this.props.QuantityUOM;

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        validationErrors,
        activeIndex: 0,
        bcuCodeList: [],
        unLoadingArmList: [],
        railMarineTransactionCommonInfo,
        selectedAttributeFPList: [],
        selectedAttributeBPList: {},
        attributeUnloadingDetailsFPDataList: [],
        attributeUnloadingDetailsBPDataList: [],
        attributeValidationBPErrors: {},
        attributeValidationFPErrors: [],
         saveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnMarineReceiptByCompartment),
        marineReceiptManualEntryEnabled: false
      });
      this.handleResetForCompartmentSeqNoInVehicle();
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on handleChange",
        error
      );
    }
  };

  handleResetForCompartmentSeqNoInVehicle() {
    this.setState({
      selectedCompartment: {},
      productList: [],
      tankList: {},
      railMarineTransactionBPInfo: {},
      validationBPErrors: {},
      activeIndex: 0,
    });
  }

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      var railMarineTransactionCommonInfo = lodash.cloneDeep(
        this.state.railMarineTransactionCommonInfo
      );
      validationErrors[propertyName] = error;
      railMarineTransactionCommonInfo[propertyName] = value;
      this.setState({ validationErrors, railMarineTransactionCommonInfo });
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleTabChange(index) {
    this.setState({ activeIndex: index });
  }

  fillFPAttributeDetails(railMarineTransactionCommonInfo) {
    try {
      let attributeList = lodash.cloneDeep(this.state.selectedAttributeFPList);
      railMarineTransactionCommonInfo.Attributes = [];
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
        railMarineTransactionCommonInfo.Attributes.push(attribute);
      });
      this.setState({ railMarineTransactionCommonInfo });
      return railMarineTransactionCommonInfo;
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on fillFPAttributeDetails",
        error
      );
    }
  }

  fillBPAttributeDetails(railMarineTransactionBPInfo) {
    let BPCode = Object.keys(railMarineTransactionBPInfo);
    BPCode.forEach((code) => {
      try {
        let attributeList = lodash.cloneDeep(
          this.state.selectedAttributeBPList[code]
        );
        railMarineTransactionBPInfo[code].Attributes = [];
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
          railMarineTransactionBPInfo[code].Attributes.push(attribute);
        });
        this.setState({ railMarineTransactionBPInfo });
        return railMarineTransactionBPInfo;
      } catch (error) {
        console.log(
          "MarineReceiptManualEntryDetails:Error occured on fillFPAttributeDetails",
          error
        );
      }
    });
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      compartmentSeqNoInVehicleList: this.state.compartmentSeqNoInVehicleList,
      bcuCodeList: this.state.bcuCodeList,
      unLoadingArmList: this.state.unLoadingArmList,
      berthList: this.state.berthList,
      quantityUOMList: this.state.quantityUOMList,
      temperatureUOMList: this.state.temperatureUOMList,
      densityUOMList: this.state.densityUOMList,
      meterCodeList: this.state.meterCodeList,
      massUOMList: this.state.massUOMList,
      pressureUOMList: this.state.pressureUOMList,
      calculatedValueUOMList: this.state.calculatedValueUOMList,
      tankList: this.state.tankList,
    };
    const { selectedCompartment, saveEnabled, marineReceiptManualEntryEnabled } = this.state;

    return this.state.isReadyToRender ? (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              <TMDetailsHeader newEntityName="MarineReceiptManualEntry_PageTitle"></TMDetailsHeader>
            </ErrorBoundary>
            <ErrorBoundary>
              <MarineReceiptManualEntryDetails
                selectedCompartment={selectedCompartment}
                listOptions={listOptions}
                validationErrors={this.state.validationErrors}
                onFieldChange={this.handleChange}
                railMarineTransactionCommonInfo={
                  this.state.railMarineTransactionCommonInfo
                }
                onDateTextChange={this.handleDateTextChange}
                marineReceiptManualEntryEnabled={marineReceiptManualEntryEnabled}
              ></MarineReceiptManualEntryDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              <Tab
                onTabChange={(index) => this.handleTabChange(index)}
                activeIndex={this.state.activeIndex}
              >
                <Tab.Pane title={this.state.railMarineTransactionCommonInfo.FinishedProductCode === '' ? t("FinishedProduct") : t("FinishedProduct") + "-" + this.state.railMarineTransactionCommonInfo.FinishedProductCode}>
                  <MarineReceiptManualEntryFPTransactionsDetails
                    validationErrors={this.state.validationErrors}
                    listOptions={listOptions}
                    onFieldChange={this.handleChange}
                    railMarineTransactionCommonInfo={
                      this.state.railMarineTransactionCommonInfo
                    }
                    selectedAttributeList={this.state.selectedAttributeFPList}
                    attributeValidationErrors={
                      this.state.attributeValidationFPErrors
                    }
                    handleAttributeCellDataEdit={
                      this.handleFPAttributeCellDataEdit
                    }
                    isEnterpriseNode={
                      this.props.userDetails.EntityResult.IsEnterpriseNode
                    }
                  ></MarineReceiptManualEntryFPTransactionsDetails>
                </Tab.Pane>
                {this.state.productList.map((item, index) => {
                  return (
                    <Tab.Pane
                      key={index}
                      title={
                        item.ProductTYPE === "baseproduct"
                          ? t("MarineReceipt_BaseProduct") + "-" + item.code
                          : t("MarineReceipt_BaseProduct")
                      }
                    >
                      <MarineReceiptManualEntryBaseProductDetails
                        validationErrors={
                          this.state.validationBPErrors[item.code]
                        }
                        listOptions={listOptions}
                        index={index}
                        code={item.code}
                        onFieldChange={this.handleBPChange}
                        railMarineTransactionBPInfo={
                          this.state.railMarineTransactionBPInfo[item.code]
                        }
                        selectedAttributeList={
                          this.state.selectedAttributeBPList[item.code]
                        }
                        attributeValidationErrors={
                          this.state.attributeValidationBPErrors[item.code]
                        }
                        handleAttributeCellDataEdit={
                          this.handleBPAttributeCellDataEdit
                        }
                      ></MarineReceiptManualEntryBaseProductDetails>
                    </Tab.Pane>
                  );
                })}
              </Tab>
            </ErrorBoundary>
            <ErrorBoundary>
              <TMDetailsUserActions
                handleBack={this.props.handleBack}
                handleSave={this.handleSave}
                handleReset={this.handleReset}
                saveEnabled={
                  saveEnabled && marineReceiptManualEntryEnabled
                  // selectedCompartment.ReceiptCompartmentStatus === null
                  //   ? saveEnabled
                  //   : selectedCompartment.ReceiptCompartmentStatus === 2
                  //   ? false
                  //   : saveEnabled
                }
              ></TMDetailsUserActions>
            </ErrorBoundary>
            {this.state.showAuthenticationLayout ? (
                    <UserAuthenticationLayout
                        Username={this.props.userDetails.EntityResult.UserName}
                        functionName={functionGroups.add}
                        functionGroup={fnViewMarineUnloadingDetails}
                        handleOperation={this.addLoadingDetails}
                        handleClose={this.handleAuthenticationClose}
                    ></UserAuthenticationLayout>
                    ) : null}
          </div>
        )}
      </TranslationConsumer>
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

export default connect(mapStateToProps)(
  MarineReceiptManualEntryDetailsComposite
);

MarineReceiptManualEntryDetailsComposite.propTypes = {
  handleBack: PropTypes.func.isRequired,
  ReceiptCode: PropTypes.string.isRequired,
  ReceiptStatus: PropTypes.string.isRequired,
  QuantityUOM: PropTypes.string.isRequired,
  ActualTerminalCode: PropTypes.string.isRequired,
};
