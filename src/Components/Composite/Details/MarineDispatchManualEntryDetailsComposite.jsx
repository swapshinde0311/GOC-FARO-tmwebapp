import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import NotifyEvent from "../../../JS/NotifyEvent";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { toast } from "react-toastify";
import { MarineShipmentManualBaseDetails } from "../../UIBase/Details/MarineShipmentManualBaseDetails";
import { Accordion, Tab } from "@scuf/common";
import { MarineShipmentManualTransactionsDetails } from "../../UIBase/Details/MarineShipmentManualTransactionsDetails";
import { MarineShipmentManualBaseProductDetails } from "../../UIBase/Details/MarineShipmentManualBaseProductDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import lodash from "lodash";
import {
  emptyMarineDispatchTransactionCommonInfo,
  emptyRailMarineTransactionBPInfo,
} from "../../../JS/DefaultEntities";
import * as Utilities from "../../../JS/Utilities";
import {
  marineShipmentManualEntryBPValidationDef,
  marineShipmentManualEntryValidationDef,
} from "../../../JS/ValidationDef";
import * as KeyCodes from "../../../JS/KeyCodes";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import PropTypes from "prop-types";
import * as RestApis from "../../../JS/RestApis";
import {
  marineLoadingDetailsAdditiveAttributeEntity,
  marineLoadingDetailsBPAttributeEntity,
  marineManualEntryFPAttributeEntity,
} from "../../../JS/AttributeEntity";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import { TranslationConsumer } from "@scuf/localization";
import { MarineDispatchCompartmentStatus } from "../../../JS/Constants";
import { functionGroups, fnMarineShipmentByCompartment, fnViewMarineLoadingDetails } from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class MarineDispatchManualEntryDetailsComposite extends Component {
  state = {
    railMarineFinishedProductInfo: lodash.cloneDeep(
      emptyMarineDispatchTransactionCommonInfo
    ),
    railMarineBaseProductInfo: [],
    validationErrors: Utilities.getInitialValidationErrors(
      marineShipmentManualEntryValidationDef
    ),
    validationErrorsForBP: [],
    selectedCompartment: {},
    compartmentSeqNoInVehicleList: [],
    marineCompartmentDetails: [],
    berthList: [],
    bcuCodeList: [],
    loadingArmList: [],
    quantityUOMList: [],
    densityUOMList: [],
    temperatureUOMList: [],
    massUOMList: [],
    pressureUOMList: [],
    calculatedValueUOMList: [],
    meterCodeList: [],
    tankList: [],
    productList: [],
    activeIndex: 0,
    manualEntrySaveEnable: false,
    attributeMetaDataList: [],
    attributeValidationErrors: [],
    BPattributeValidationErrors: [],
    compartmentAttributeMetaDataList: [],
    baseProductAttributeMetaDataList: [],
    selectedAttributeList: [],
    BPselectedAttributeList: [],
    attribute: [],
    marineDispatchManualEntryEnabled: false,

    showAuthenticationLayout: false,
    tempLoadingDetails: {},

  };

  componentDidMount() {
    this.setDefaultValues();
    this.getMarineCompartmentDetails();
    this.getBerthList();
    this.getQuantityUOMList();
    this.getDensityUOMList();
    this.getTemperatureUOMList();
    this.getMassUOMList();
    this.getPressureUOMList();
    this.getCalculatedValueUOMList();
    this.GetMeterList();
    this.setState({
      manualEntrySaveEnable: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnMarineShipmentByCompartment)
    })
  }

  setDefaultValues() {
    emptyMarineDispatchTransactionCommonInfo.StartTime = new Date();
    emptyMarineDispatchTransactionCommonInfo.EndTime = new Date();
    emptyMarineDispatchTransactionCommonInfo.QuantityUOM = this.props.QuantityUOM; // to display Ship Qty UOM, in place MOT UOM
    this.setState({ railMarineFinishedProductInfo: lodash.cloneDeep(emptyMarineDispatchTransactionCommonInfo) });

  }

  getMarineDispatchManualEntryEnabled(selectedCompartment) {
    let DispatchCompartmentStatusKeys = Object.keys(
      MarineDispatchCompartmentStatus
    );
    let DispatchCompartmentStatus = "";
    for (const key of DispatchCompartmentStatusKeys) {
      if (
        MarineDispatchCompartmentStatus[key] ===
        selectedCompartment.DispatchCompartmentStatus
      ) {
        DispatchCompartmentStatus = key;
        break;
      }
    }
    axios(
      RestApis.GetMarineDispatchManualEntryEnabled +
      "?ShareholderCode=" +
      selectedCompartment.ShareholderCode +
      "&DispatchStatus=" +
      this.props.DispatchStatus +
      "&DispatchCompartmentStatus=" +
      DispatchCompartmentStatus,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let { marineDispatchManualEntryEnabled } = this.state;
          if (result.EntityResult === "TRUE") {
            marineDispatchManualEntryEnabled = true;
          }
          else {
            marineDispatchManualEntryEnabled = false;
          }
          this.setState({ marineDispatchManualEntryEnabled });
        } else {
          this.setState({ marineDispatchManualEntryEnabled: false });
          console.log(
            "Error in getMarineDispatchManualEntryEnabled:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting Marine Dispatch ManualEntry Enabled:",
          error
        );
      });
  }

  initializeAttributeForBP() {
    let BPCode = Object.keys(this.state.railMarineBaseProductInfo);
    let { BPselectedAttributeList } = this.state;
    BPCode.forEach((code) => {
      BPselectedAttributeList[code] = [];
    });
    this.setState({ BPselectedAttributeList });
  }

  getAttributes() {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [
            marineManualEntryFPAttributeEntity,
            marineLoadingDetailsAdditiveAttributeEntity,
            marineLoadingDetailsBPAttributeEntity,
          ],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let { BPattributeValidationErrors } = this.state;
          let BPCode = Object.keys(this.state.railMarineBaseProductInfo);
          BPCode.forEach((code) => {
            BPattributeValidationErrors[code] =
              Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.marineLoadingDetailsBP
              );
          });
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.marineLoadingDetailsFP
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.marineLoadingDetailsFP
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.marineLoadingDetailsAdditive
              ),
              baseProductAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.marineLoadingDetailsBP
              ),
              BPattributeValidationErrors,
            },
            () => {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                if (this.state.baseProductAttributeMetaDataList.length > 0) {
                  this.baseProductSelectionChange([
                    this.state.baseProductAttributeMetaDataList[0].TerminalCode,
                  ]);
                }
                if (this.state.attributeMetaDataList.length > 0) {
                  this.terminalSelectionChange([
                    this.state.attributeMetaDataList[0].TerminalCode,
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
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      var baseProductAttributeMetaDataList = lodash.cloneDeep(
        this.state.baseProductAttributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList) && attributeMetaDataList.length > 0) {
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      }
      if (Array.isArray(baseProductAttributeMetaDataList) && baseProductAttributeMetaDataList.length > 0) {
        this.baseProductSelectionChange([
          baseProductAttributeMetaDataList[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
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
      var railMarineFinishedProductInfo = lodash.cloneDeep(
        this.state.railMarineFinishedProductInfo
      );
      selectedTerminals.forEach((terminal) => {
        var existitem = selectedAttributeList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue =
                railMarineFinishedProductInfo.Attributes.find(
                  (marineDispatchAttribute) => {
                    return marineDispatchAttribute.TerminalCode === terminal;
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
      selectedAttributeList = [];
      selectedAttributeList = attributesTerminalsList;

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
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  baseProductSelectionChange(selectedTerminals) {
    let BPCode = Object.keys(this.state.railMarineBaseProductInfo);
    BPCode.forEach((code) => {
      try {
        let attributesTerminalsList = [];
        var baseProductAttributeMetaDataList = [];
        var BPselectedAttributeList = [];
        baseProductAttributeMetaDataList = lodash.cloneDeep(
          this.state.baseProductAttributeMetaDataList
        );
        BPselectedAttributeList = lodash.cloneDeep(
          this.state.BPselectedAttributeList[code]
        );
        const BPattributeValidationErrors = lodash.cloneDeep(
          this.state.BPattributeValidationErrors[code]
        );
        var railMarineBaseProductInfo = lodash.cloneDeep(
          this.state.railMarineBaseProductInfo[code]
        );
        selectedTerminals.forEach((terminal) => {
          var existitem = BPselectedAttributeList.find(
            (selectedAttributeBP) => {
              return selectedAttributeBP.TerminalCode === terminal;
            }
          );
          if (existitem === undefined) {
            baseProductAttributeMetaDataList.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = railMarineBaseProductInfo.Attributes.find(
                  (BPAttribute) => {
                    return BPAttribute.TerminalCode === terminal;
                  }
                );
                if (Attributevalue !== undefined) {
                  attributeMetaData.baseProductAttributeMetaDataList.forEach(
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
        BPselectedAttributeList = [];
        BPselectedAttributeList = attributesTerminalsList;
        BPattributeValidationErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(
              attributeValidation.BPattributeValidationErrors
            ).forEach(
              (key) =>
                (attributeValidation.BPattributeValidationErrors[key] = "")
            );
          }
        });
        let newSelectedAttributeBPList = this.state.BPselectedAttributeList;
        let newAttributeValidationBPErrors =
          this.state.BPattributeValidationErrors;
        newSelectedAttributeBPList[code] = BPselectedAttributeList;
        newAttributeValidationBPErrors[code] = BPattributeValidationErrors;
        this.setState({
          BPselectedAttributeList: newSelectedAttributeBPList,
          BPattributeValidationErrors: newAttributeValidationBPErrors,
        });
      } catch (error) {
        console.log(
          "MarineReceiptManualEntryDetails:Error occured on terminalSelectionChangeBP",
          error
        );
      }
    });
  }

  handleAttributeCellDataEdit = (attribute, value) => {
    try {
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
        "TrailerDetailsComposite:Error occured on handleAttributeCellDataEdit",
        error
      );
    }
  };

  handleBPAttributeCellDataEdit = (attribute, value, code) => {
    try {
      const BPattributeValidationErrors = lodash.cloneDeep(
        this.state.BPattributeValidationErrors
      );

      BPattributeValidationErrors[code].forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ BPattributeValidationErrors });

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

  handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };

  fillAttributeDetails() {
    try {
      let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);
      let railMarineFinishedProductInfo = lodash.cloneDeep(
        this.state.railMarineFinishedProductInfo
      );
      railMarineFinishedProductInfo.Attributes = [];
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
        railMarineFinishedProductInfo.Attributes.push(attribute);
      });

      this.setState({ railMarineFinishedProductInfo });
      return railMarineFinishedProductInfo;
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  fillBPAttributeDetails(railMarineBaseProductInfo) {
    let BPCode = Object.keys(railMarineBaseProductInfo);
    BPCode.forEach((code) => {
      try {
        let attributeList = lodash.cloneDeep(
          this.state.BPselectedAttributeList[code]
        );
        railMarineBaseProductInfo[code].Attributes = [];
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
          railMarineBaseProductInfo[code].Attributes.push(attribute);
        });
        this.setState({ railMarineBaseProductInfo });
        return railMarineBaseProductInfo;
      } catch (error) {
        console.log(
          "MarineReceiptManualEntryDetails:Error occured on fillFPAttributeDetails",
          error
        );
      }
    });
  }

  getPartialMarineDispatchData() {
    var keyCode = [
      {
        key: "MarineDispatchCode",
        value: this.props.dispatchCode,
      },
      {
        key: "CompartmentSeqNoInVehicle",
        value: this.state.selectedCompartment.CompartmentSeqNoInVehicle,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedCompartment.ShareholderCode,
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetPartialMarineDispatchData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var productList = [];
          var validationErrorsForBPList = [];
          var railMarineBaseProductInfoList = [];
          list.forEach(
            (item) => {
              productList.push(item);
              validationErrorsForBPList.push(
                Utilities.getInitialValidationErrors(
                  marineShipmentManualEntryBPValidationDef
                )
              );
              railMarineBaseProductInfoList.push(
                lodash.cloneDeep(emptyRailMarineTransactionBPInfo)
              );
            },
            () => { }
          );
          this.setState(
            {
              productList,
              validationErrorsForBP: validationErrorsForBPList,
              railMarineBaseProductInfo: railMarineBaseProductInfoList,
            },
            () => {
              this.initializeAttributeForBP();
              this.getAttributes();
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getPartialMarineDispatchData:", error);
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
            berthList: berthList,
          });
        } else {
          console.log("Error in getBerthList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getBerthList:", error);
      });
  }

  getBCUListByBerth() {
    const railMarineFinishedProductInfo = lodash.cloneDeep(
      this.state.railMarineFinishedProductInfo
    );
    axios(
      RestApis.GetMarineBCUListByBerth +
      "?Berth=" +
      railMarineFinishedProductInfo.BayCode,
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
            bcuCodeList: bcuCodeList,
          });
          if (bcuCodeList.length === 1) {
            railMarineFinishedProductInfo.BCUCode = bcuCodeList[0];
            this.setState({
              railMarineFinishedProductInfo
            });
            this.getBCUDetails(bcuCodeList[0]);
            this.GetLoadingArmListByBCU()
          }
        } else {
          console.log("Error in getBCUListByBerth:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getBCUListByBerth:", error);
      });
  }

  GetLoadingArmListByBCU() {
    const railMarineFinishedProductInfo = lodash.cloneDeep(
      this.state.railMarineFinishedProductInfo
    );
    axios(
      RestApis.GetMarineLoadingArmListByBCU +
      "?BCUCode=" +
      railMarineFinishedProductInfo.BCUCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var loadingArmList = [];
          list.forEach((item) => {
            loadingArmList.push(item.LoadingArmCode);
          });
          this.setState({
            loadingArmList: loadingArmList,
          });
          if (loadingArmList.length === 1) {
            railMarineFinishedProductInfo.LoadingArm = loadingArmList[0];
            this.setState({
              railMarineFinishedProductInfo
            });

            this.GetMetersForLA();
          }
        } else {
          console.log("Error in GetLoadingArmListByBCU:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetLoadingArmListByBCU:", error);
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

          let railMarineFinishedProductInfo = lodash.cloneDeep(this.state.railMarineFinishedProductInfo);
          railMarineFinishedProductInfo.TemperatureUOM = bcu.TemperatureUOM;
          railMarineFinishedProductInfo.ProductDensityUOM = bcu.DensityUOM;

          let railMarineBaseProductInfo = lodash.cloneDeep(this.state.railMarineBaseProductInfo);
          railMarineBaseProductInfo.map(item => { item.TemperatureUOM = bcu.TemperatureUOM; item.ProductDensityUOM = bcu.DensityUOM; })


          this.setState({
            railMarineFinishedProductInfo, railMarineBaseProductInfo
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

    const railMarineFinishedProductInfo = lodash.cloneDeep(
      this.state.railMarineFinishedProductInfo
    );
    let bcuCode = '';
    let loadingArmCode = ''
    bcuCode = railMarineFinishedProductInfo.BCUCode;
    loadingArmCode = railMarineFinishedProductInfo.LoadingArm;
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
              if (mainLineMeters !== null && mainLineMeters !== "") {
                let meterCodeList = [];
                mainLineMeters.MeterList.forEach(element => {
                  meterCodeList.push(element.Code);
                });
                this.setState({
                  meterCodeList: meterCodeList,
                });

                if (mainLineMeters.MeterList.length === 1) {
                  bpMeterCode = mainLineMeters.MeterList[0].Code;
                }
              }

              if (bpMeterCode !== '') {
                let railMarineFinishedProductInfo = lodash.cloneDeep(this.state.railMarineFinishedProductInfo);
                railMarineFinishedProductInfo.MeterCode = bpMeterCode;
                let railMarineBaseProductInfo = lodash.cloneDeep(this.state.railMarineBaseProductInfo);
                railMarineBaseProductInfo.map(item => { item.MeterCode = bpMeterCode; })
                this.setState({
                  railMarineBaseProductInfo, railMarineFinishedProductInfo
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
            quantityUOMList: quantityUOMList,
          });
        } else {
          console.log("Error in getQuantityUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getQuantityUOMList:", error);
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
            densityUOMList: densityUOMList,
          });
        } else {
          console.log("Error in getDensityUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getDensityUOMList:", error);
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
            temperatureUOMList: temperatureUOMList,
          });
        } else {
          console.log("Error in getTemperatureUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getTemperatureUOMList:", error);
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
            massUOMList: massUOMList,
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
            pressureUOMList: pressureUOMList,
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

  GetMeterList() {
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
            meterCodeList: meterCodeList,
          });
        } else {
          console.log("Error in GetMeterList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetMeterList:", error);
      });
  }

  GetTankList(index) {
    if (index === 0) {
      return;
    }
    if (this.state.productList.length === 0) {
      return;
    }
    const BPCode = this.state.productList[index - 1].code;
    axios(
      RestApis.GetMarineTankList +
      "?BaseProductCode=" +
      BPCode +
      "&AdditiveCode=",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table;
          var tankList = [];
          list.forEach((item) => {
            tankList.push(item.Code);
          });
          this.setState({
            tankList: tankList,
          });
        } else {
          console.log("Error in GetTankList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetTankList:", error);
      });
  }

  getMarineCompartmentDetails() {
    const { dispatchCode } = this.props;
    if (dispatchCode === undefined) {
      this.setState({
        marineCompartmentDetails: [],
      });
      return;
    }
    axios(
      RestApis.GetMarineDispatchCompartmentDetails +
      "?MarineDispatchCode=" +
      dispatchCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            marineCompartmentDetails: result.EntityResult,
          });
          this.getCompartmentSeqNoInVehicleList();
        } else {
          this.setState({
            marineCompartmentDetails: [],
          });
          console.log(
            "Error in getMarineCompartmentDetails:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting marine compartment details:", error);
      });
  }

  getCompartmentSeqNoInVehicleList() {
    let compartmentSeqNoInVehicleList = [];
    this.state.marineCompartmentDetails.forEach((item) => {
      compartmentSeqNoInVehicleList.push(item.CompartmentSeqNoInVehicle);
    });
    this.setState({
      compartmentSeqNoInVehicleList,
    });
  }

  getSelectedCompartment(selectedCompartmentCompartmentSeqNoInVehicle) {
    let selectedCompartment = this.state.marineCompartmentDetails.find(
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
        railMarineBaseProductInfo: [],
        validationErrorsForBP: [],
      },
      () => {
        this.handleChange(
          "FP",
          "FinishedProductCode",
          this.state.selectedCompartment.FinishedProductCode
        );
        this.getMarineDispatchManualEntryEnabled(selectedCompartment);
        this.getPartialMarineDispatchData();
      }
    );
  }



  handleChange = (type, propertyName, data) => {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      const validationErrorsForBP = lodash.cloneDeep(
        this.state.validationErrorsForBP
      );
      if (type === "FP") {
        const railMarineFinishedProductInfo = lodash.cloneDeep(
          this.state.railMarineFinishedProductInfo
        );
        railMarineFinishedProductInfo[propertyName] = data;
        if (
          marineShipmentManualEntryValidationDef[propertyName] !== undefined
        ) {
          validationErrors[propertyName] = Utilities.validateField(
            marineShipmentManualEntryValidationDef[propertyName],
            data
          );
        }
        this.setState({
          railMarineFinishedProductInfo,
          validationErrors,
        });
        if (propertyName === "CompartmentSeqNoInVehicle") {
          this.getSelectedCompartment(data);
          let railMarineFinishedProductInfo = lodash.cloneDeep(
            emptyMarineDispatchTransactionCommonInfo
          );
          if (data !== "") {
            railMarineFinishedProductInfo.CompartmentSeqNoInVehicle = data;
            railMarineFinishedProductInfo.QuantityUOM = this.props.QuantityUOM;
          }
          const validationErrors = { ...this.state.validationErrors };
          Object.keys(validationErrors).forEach(function (key) {
            validationErrors[key] = "";
          });
          this.setState({
            railMarineFinishedProductInfo,
            validationErrors,
            bcuCodeList: [],
            loadingArmList: [],
            manualEntrySaveEnable: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnMarineShipmentByCompartment)
          });
        }
        if (propertyName === "BayCode") {
          this.setState({ railMarineFinishedProductInfo }, () => {
            this.getBCUListByBerth();
          });
        } else if (propertyName === "BCUCode") {
          this.setState({ railMarineFinishedProductInfo }, () => {
            this.GetLoadingArmListByBCU();
          });
        }
        else if (propertyName === "LoadingArm") {
          this.setState({ railMarineFinishedProductInfo }, () => {
            this.GetMetersForLA();
          });
        }
      }
      else if (type === "BaseProduct") {
        const railMarineBaseProductInfo = lodash.cloneDeep(
          this.state.railMarineBaseProductInfo
        );
        railMarineBaseProductInfo[this.state.activeIndex - 1][propertyName] =
          data;
        if (
          marineShipmentManualEntryBPValidationDef[propertyName] !== undefined
        ) {
          validationErrorsForBP[this.state.activeIndex - 1][propertyName] =
            Utilities.validateField(
              marineShipmentManualEntryBPValidationDef[propertyName],
              data
            );
        }
        this.setState({
          railMarineBaseProductInfo,
          validationErrorsForBP,
        });
      }
    } catch (error) {
      console.log(
        "MarineDispatchManualEntryComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      var railMarineFinishedProductInfo = lodash.cloneDeep(
        this.state.railMarineFinishedProductInfo
      );
      validationErrors[propertyName] = error;
      railMarineFinishedProductInfo[propertyName] = value;
      this.setState({ validationErrors, railMarineFinishedProductInfo });
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleTabChange = (index) => {
    this.GetTankList(index);
    this.setState({
      activeIndex: index,
    });
  };

  validateSave() {
    const { railMarineFinishedProductInfo, railMarineBaseProductInfo } =
      this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    var validationErrorsForBP = lodash.cloneDeep(
      this.state.validationErrorsForBP
    );
    let BPCode = Object.keys(validationErrorsForBP);

    Object.keys(marineShipmentManualEntryValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        marineShipmentManualEntryValidationDef[key],
        railMarineFinishedProductInfo[key]
      );
    });
    this.state.productList.forEach((item, index) => {
      Object.keys(marineShipmentManualEntryBPValidationDef).forEach(function (
        key
      ) {
        validationErrorsForBP[index][key] = Utilities.validateField(
          marineShipmentManualEntryBPValidationDef[key],
          railMarineBaseProductInfo[index][key]
        );
      });
    });
    if (
      railMarineFinishedProductInfo.StartTime >=
      railMarineFinishedProductInfo.EndTime
    ) {
      validationErrors.StartTime = "MarineDispatchManualEntry_ErrorLoadTime";
    }

    this.setState({ validationErrors, validationErrorsForBP });
    var returnValueBase = Object.values(validationErrors).every(function (
      value
    ) {
      return value === "";
    });
    var returnValueAddition = true;
    var times = 0;
    this.state.productList.forEach((item, index) => {
      returnValueAddition =
        returnValueAddition &&
        Object.values(validationErrorsForBP[index]).every(function (value) {
          return value === "";
        });
      if (!returnValueAddition && times === 0) {
        times++;
        this.setState({
          activeIndex: index + 1,
        });
      }
    });
    if (!returnValueBase) {
      this.setState({
        activeIndex: 0,
      });
    }

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
    let returnAttributeFPValue = true;
    attributeValidationErrors.forEach((x) => {
      returnAttributeFPValue = Object.values(x.attributeValidationErrors).every(
        function (value) {
          return value === "";
        }
      );
    });
    if (!returnAttributeFPValue) {
      this.setState({ activeIndex: 0 });
    }

    let BPattributeValidationErrors = lodash.cloneDeep(
      this.state.BPattributeValidationErrors
    );
    let BPselectedAttributeList = lodash.cloneDeep(
      this.state.BPselectedAttributeList
    );
    BPCode.forEach((code) => {
      BPselectedAttributeList[code].forEach((attribute) => {
        BPattributeValidationErrors[code].forEach((attributeValidation) => {
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
    this.setState({ BPattributeValidationErrors });
    let attributeBPValueList = BPCode.map((code) => {
      let attributeBPValue = true;
      BPattributeValidationErrors[code].forEach((x) => {
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
      returnValueBase &&
      returnValueAddition &&
      returnAttributeFPValue &&
      returnAttributeBPValue
    );
  }

  addLoadingDetails = () => {
    try {
      this.setState({ manualEntrySaveEnable: false, marineDispatchManualEntryEnabled: false });
      let tempLoadingDetails = lodash.cloneDeep(this.state.tempLoadingDetails);
      this.manualEntrySave(tempLoadingDetails);
    } catch (error) {
      console.log("Marine Loading DetailsComposite : Error in save Marine Loading details");
    }
  };
  
  handleSave = () => {
    try {
      
      let railMarineFinishedProductInfo = this.fillAttributeDetails();
      this.fillBPAttributeDetails(this.state.railMarineBaseProductInfo);
      if (this.validateSave()) {
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
          
      let tempLoadingDetails = lodash.cloneDeep(railMarineFinishedProductInfo);
      this.setState({ showAuthenticationLayout, tempLoadingDetails }, () => {
        if (showAuthenticationLayout === false) {
          this.addLoadingDetails();
          }
        });

       
      } else {
        this.setState({
          manualEntrySaveEnable: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnMarineShipmentByCompartment),
          marineDispatchManualEntryEnabled: true, showAuthenticationLayout: false,
        });
      }
    } catch (error) {
      console.log(
        "MarineShipmentDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  manualEntrySave(railMarineFinishedProductInfo) {
    const { railMarineBaseProductInfo, productList } = this.state;
    Object.keys(railMarineFinishedProductInfo).forEach((key) => {
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
        railMarineFinishedProductInfo[key] = Utilities.convertStringtoDecimal(
          railMarineFinishedProductInfo[key]
        );
      }
    });
    let BPCode = Object.keys(railMarineBaseProductInfo);
    BPCode.forEach((code) => {
      Object.keys(railMarineBaseProductInfo[code]).forEach((key) => {
        if (
          !(
            key.includes("UOM") ||
            key === "MeterCode" ||
            key === "Attributes" ||
            key === "TankCode"
          )
        ) {
          railMarineBaseProductInfo[code][key] =
            Utilities.convertStringtoDecimal(
              railMarineBaseProductInfo[code][key]
            );
        }
      });
    });
    var keyCode = [
      {
        key: "MarineDispatchCode",
        value: this.props.dispatchCode,
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
      message: "MarineDispatchManualEntry_SavedSuccess",
      messageResultDetails: [
        {
          keyFields: ["MarineDispatchManualEntry_CompSeqNo"],
          keyValues: [this.state.selectedCompartment.CompartmentSeqNoInVehicle],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    var entity = {
      CommonInfo: {
        BayCode: railMarineFinishedProductInfo.BayCode,
        BCUCode: railMarineFinishedProductInfo.BCUCode,
        LoadingArm: railMarineFinishedProductInfo.LoadingArm,
        IsBonded: this.props.IsBonded,
      },
      TransactionFPinfo: {
        QuantityUOM: railMarineFinishedProductInfo.QuantityUOM,
        StartTime: railMarineFinishedProductInfo.StartTime,
        EndTime: railMarineFinishedProductInfo.EndTime,
        TransactionID: railMarineFinishedProductInfo.TransactionID,
        Remarks: railMarineFinishedProductInfo.Remarks,
        GrossQuantity: railMarineFinishedProductInfo.GrossQuantity,
        NetQuantity: railMarineFinishedProductInfo.NetQuantity,
        Temperature: railMarineFinishedProductInfo.Temperature,
        TemperatureUOM: railMarineFinishedProductInfo.TemperatureUOM,
        ProductDensity: railMarineFinishedProductInfo.ProductDensity,
        ProductDensityUOM: railMarineFinishedProductInfo.ProductDensityUOM,
        StartTotalizer: railMarineFinishedProductInfo.StartTotalizer,
        EndTotalizer: railMarineFinishedProductInfo.EndTotalizer,
        NetStartTotalizer: railMarineFinishedProductInfo.NetStartTotalizer,
        NetEndTotalizer: railMarineFinishedProductInfo.NetEndTotalizer,
        MeterCode: railMarineFinishedProductInfo.MeterCode,
        GrossMass: railMarineFinishedProductInfo.GrossMass,
        MassUOM: railMarineFinishedProductInfo.MassUOM,
        Pressure: railMarineFinishedProductInfo.Pressure,
        PressureUOM: railMarineFinishedProductInfo.PressureUOM,
        TankStartSnapShot: {
          MassUOM: railMarineFinishedProductInfo.MassUOM,
        },
        TankEndSnapShot: {
          MassUOM: railMarineFinishedProductInfo.MassUOM,
        },
        CalculatedGross: railMarineFinishedProductInfo.CalculatedGross,
        CalculatedNet: railMarineFinishedProductInfo.CalculatedNet,
        CalculatedValueUOM: railMarineFinishedProductInfo.CalculatedValueUOM,
        Attributes: railMarineFinishedProductInfo.Attributes,
      },
      ArrTransactionBP: [],
      ArrTransactionAdditive: null,
    };
    BPCode.forEach((index) => {
      var baseProduct = {
        BaseProductCode: productList[index].code,
        TankCode: railMarineBaseProductInfo[index].TankCode,
        TankStartSnapShot: {
          MassUOM: railMarineBaseProductInfo[index].MassUOM,
          GrossVolume: railMarineBaseProductInfo[index].TankStartGrossQuantity,
          NetVolume: railMarineBaseProductInfo[index].TankStartNetQuantity,
          GrossMass: railMarineBaseProductInfo[index].TankStartGrossMass,
          Pressure: railMarineBaseProductInfo[index].TankStartPressure,
        },
        TankEndSnapShot: {
          MassUOM: railMarineBaseProductInfo[index].MassUOM,
          GrossVolume: railMarineBaseProductInfo[index].TankEndGrossQuantity,
          NetVolume: railMarineBaseProductInfo[index].TankEndNetQuantity,
          GrossMass: railMarineBaseProductInfo[index].TankEndGrossMass,
          Pressure: railMarineBaseProductInfo[index].TankEndPressure,
        },
        QuantityUOM: railMarineBaseProductInfo[index].QuantityUOM,
        StartTime: railMarineBaseProductInfo[index].StartTime,
        EndTime: railMarineBaseProductInfo[index].EndTime,
        TransactionID: railMarineBaseProductInfo[index].TransactionID,
        Remarks: railMarineBaseProductInfo[index].Remarks,
        GrossQuantity: railMarineBaseProductInfo[index].GrossQuantity,
        NetQuantity: railMarineBaseProductInfo[index].NetQuantity,
        Temperature: railMarineBaseProductInfo[index].Temperature,
        TemperatureUOM: railMarineBaseProductInfo[index].TemperatureUOM,
        ProductDensity: railMarineBaseProductInfo[index].ProductDensity,
        ProductDensityUOM: railMarineBaseProductInfo[index].ProductDensityUOM,
        StartTotalizer: railMarineBaseProductInfo[index].StartTotalizer,
        EndTotalizer: railMarineBaseProductInfo[index].EndTotalizer,
        NetStartTotalizer: railMarineBaseProductInfo[index].NetStartTotalizer,
        NetEndTotalizer: railMarineBaseProductInfo[index].NetEndTotalizer,
        MeterCode: railMarineBaseProductInfo[index].MeterCode,
        GrossMass: railMarineBaseProductInfo[index].GrossMass,
        MassUOM: railMarineBaseProductInfo[index].MassUOM,
        Pressure: railMarineBaseProductInfo[index].Pressure,
        PressureUOM: railMarineBaseProductInfo[index].PressureUOM,
        CalculatedGross: railMarineBaseProductInfo[index].CalculatedGross,
        CalculatedNet: railMarineBaseProductInfo[index].CalculatedNet,
        CalculatedValueUOM: railMarineBaseProductInfo[index].CalculatedValueUOM,
        Attributes: railMarineBaseProductInfo[index].Attributes,
      };
      entity.ArrTransactionBP.push(baseProduct);
    });
    var obj = {
      ShareHolderCode: this.state.selectedCompartment.ShareHolderCode,
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
      Entity: entity,
    };
    axios(
      RestApis.MarineDispatchManualEntrySave,
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
            manualEntrySaveEnable: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnMarineShipmentByCompartment),showAuthenticationLayout:false,
          }, () => {
            this.getMarineDispatchManualEntryEnabled(this.state.selectedCompartment)
          });
        } else {
          notification.message = "MarineDispatchManualEntry_SaveFailure";
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            manualEntrySaveEnable: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnMarineShipmentByCompartment),
            marineDispatchManualEntryEnabled: false,
            showAuthenticationLayout:false,
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
        this.setState({ showAuthenticationLayout:false });
        notification.messageResultDetails[0].errorMessage = error;
        console.log("Error while handleSave:", error);
      });
  }

  handleReset = () => {
    try {
      const {
        validationErrors,
        validationErrorsForBP,
        railMarineBaseProductInfo,
      } = this.state;
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      validationErrorsForBP.forEach((item, index) => {
        Object.keys(validationErrorsForBP[index]).forEach(function (key) {
          validationErrorsForBP[index][key] = "";
        });
      });

      var railMarineFinishedProductInfo = lodash.cloneDeep(
        emptyMarineDispatchTransactionCommonInfo
      );

      railMarineFinishedProductInfo.StartTime = new Date();
      railMarineFinishedProductInfo.EndTime = new Date();
      railMarineFinishedProductInfo.QuantityUOM = this.props.QuantityUOM; // to displ

      railMarineBaseProductInfo.forEach((item, index) => {
        railMarineBaseProductInfo[index] = lodash.cloneDeep(
          emptyRailMarineTransactionBPInfo
        );
      });

      this.setState({
        validationErrors,
        validationErrorsForBP,
        railMarineFinishedProductInfo: railMarineFinishedProductInfo,
        railMarineBaseProductInfo,
        bcuCodeList: [],
        loadingArmList: [],
        productList: [],
        activeIndex: 0,
        selectedCompartment: {},
        selectedAttributeList: [],
        BPselectedAttributeList: [],
        manualEntrySaveEnable: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.modify,
          fnMarineShipmentByCompartment),
        marineDispatchManualEntryEnabled: false,
      });
    } catch (error) {
      console.log(
        "MarineReceiptManualEntryDetails:Error occured on handleChange",
        error
      );
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      compartmentSeqNoInVehicleList: this.state.compartmentSeqNoInVehicleList,
      berthList: this.state.berthList,
      bcuCodeList: this.state.bcuCodeList,
      loadingArmList: this.state.loadingArmList,
      quantityUOMList: this.state.quantityUOMList,
      temperatureUOMs: this.state.temperatureUOMList,
      densityUOMs: this.state.densityUOMList,
      meterCodes: this.state.meterCodeList,
      massUOMs: this.state.massUOMList,
      pressureUOMs: this.state.pressureUOMList,
      calculatedValueUOMs: this.state.calculatedValueUOMList,
      tankList: this.state.tankList,
    };
    const {
      selectedCompartment,
      manualEntrySaveEnable,
      marineDispatchManualEntryEnabled,
    } = this.state;

    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              <TMDetailsHeader newEntityName="MarineDispatchManualEntry_PageTitle"></TMDetailsHeader>
            </ErrorBoundary>
            <ErrorBoundary>
              <MarineShipmentManualBaseDetails
                railMarineFinishedProductInfo={
                  this.state.railMarineFinishedProductInfo
                }
                onFieldChange={this.handleChange}
                validationErrors={this.state.validationErrors}
                listOptions={listOptions}
                onDateTextChange={this.handleDateTextChange}
                selectedCompartment={selectedCompartment}
                marineDispatchManualEntryEnabled={
                  this.state.marineDispatchManualEntryEnabled
                }
              ></MarineShipmentManualBaseDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              <Tab
                activeIndex={this.state.activeIndex}
                onTabChange={(index) => this.handleTabChange(index)}
              >
                <Tab.Pane title={this.state.railMarineFinishedProductInfo.FinishedProductCode === '' ? t("FinishedProduct") : t("FinishedProduct") + "-" + this.state.railMarineFinishedProductInfo.FinishedProductCode}>
                  <MarineShipmentManualTransactionsDetails
                    railMarineFinishedProductInfo={
                      this.state.railMarineFinishedProductInfo
                    }
                    onFieldChange={this.handleChange}
                    validationErrors={this.state.validationErrors}
                    listOptions={listOptions}
                  ></MarineShipmentManualTransactionsDetails>
                  {this.state.selectedAttributeList.length > 0
                    ? this.state.selectedAttributeList.map((attire) => (
                      <ErrorBoundary>
                        <Accordion>
                          <Accordion.Content
                            className="attributeAccordian"
                            title={
                              this.props.userDetails.EntityResult
                                .IsEnterpriseNode
                                ? attire.TerminalCode +
                                " - " +
                                t("Attributes_Header")
                                : t("Attributes_Header")
                            }
                          >
                            <AttributeDetails
                              selectedAttributeList={
                                attire.attributeMetaDataList
                              }
                              handleCellDataEdit={
                                this.handleAttributeCellDataEdit
                              }
                              attributeValidationErrors={this.handleValidationErrorFilter(
                                this.state.attributeValidationErrors,
                                attire.TerminalCode
                              )}
                            ></AttributeDetails>
                          </Accordion.Content>
                        </Accordion>
                      </ErrorBoundary>
                    ))
                    : null}
                </Tab.Pane>
                {this.state.productList.map((item, index) => {
                  return (
                    <Tab.Pane
                      key={index}
                      title={
                        t(item.ProductTYPE === "baseproduct" ? "MarineDispatch_BaseProduct" : item.ProductType) + item.SequenceNumber + "-" + item.code
                      }
                    >
                      <MarineShipmentManualBaseProductDetails
                        railMarineBaseProductInfo={
                          this.state.railMarineBaseProductInfo[index]
                        }
                        onFieldChange={this.handleChange}
                        validationErrors={
                          this.state.validationErrorsForBP[index]
                        }
                        listOptions={listOptions}
                        selectedAttributeList={
                          this.state.BPselectedAttributeList[index]
                        }
                        attributeValidationErrors={
                          this.state.BPattributeValidationErrors[index]
                        }
                        handleAttributeCellDataEdit={
                          this.handleBPAttributeCellDataEdit
                        }
                        isEnterpriseNode={
                          this.props.userDetails.EntityResult.IsEnterpriseNode
                        }
                        code={index}
                      ></MarineShipmentManualBaseProductDetails>
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
                  manualEntrySaveEnable && marineDispatchManualEntryEnabled
                  // selectedCompartment.DispatchCompartmentStatus === null
                  //   ? manualEntrySaveEnable
                  //   : selectedCompartment.DispatchCompartmentStatus === 4
                  //   ? false
                  //   : manualEntrySaveEnable
                }
              ></TMDetailsUserActions>
            </ErrorBoundary>
            {this.state.showAuthenticationLayout ? (
                    <UserAuthenticationLayout
                        Username={this.props.userDetails.EntityResult.UserName}
                        functionName={functionGroups.add}
                        functionGroup={fnViewMarineLoadingDetails}
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
  MarineDispatchManualEntryDetailsComposite
);

MarineDispatchManualEntryDetailsComposite.propTypes = {
  handleBack: PropTypes.func.isRequired,
  dispatchCode: PropTypes.string.isRequired,
  IsBonded: PropTypes.bool.isRequired,
  DispatchStatus: PropTypes.string.isRequired,
  QuantityUOM: PropTypes.string.isRequired,
  ActualTerminalCode: PropTypes.string.isRequired,
};
