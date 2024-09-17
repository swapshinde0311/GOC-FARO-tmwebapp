import React, { Component } from "react";
import { connect } from "react-redux";
import TruckShipmentManualEntryDetailsComposite from "../Details/TruckShipmentManualEntryDetailsComposite";
import TruckShipmentDetails from "../../UIBase/Details/TruckShipmentDetails";
import * as Utilities from "../../../JS/Utilities";
import { shipmentValidationDef } from "../../../JS/ValidationDef";
import {
  shipmentProductValidationDef,
  shipmentCompartmentValidationDef,
} from "../../../JS/DetailsTableValidationDef";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import {
  functionGroups,
  fnSBP,
  fnSBC,
  fnOverrideShipmentSeq,
  fnKPIInformation,
  fnCloseShipment,
  fnShipmentStatus,
  fnPrintBOL,
  fnPrintFAN,
} from "../../../JS/FunctionGroups";
import { emptyShipment } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import { TruckShipmentViewAuditTrailDetails } from "../../UIBase/Details/TruckShipmentViewAuditTrailDetails";
import TruckShipmentTrailerDetails from "../../UIBase/Details/TruckShipmentTrailerDetails";
import {
  shipmentAttributeEntity,
  shipmentCompartmentAttributeEntity,
  shipmentDestinationCompartmentAttributeEntity,
  shipmentDetailsAttributeEntity,
  shipmentTrailerWeighBridgeAttributeEntity,
  shipmentTrailerAttributeEntity,
  shipmentStatusTimeAttributeEntity,
} from "../../../JS/AttributeEntity";
import * as RestAPIs from "../../../JS/RestApis";
import { TranslationConsumer } from "@scuf/localization";
import { TruckShipmentViewLoadingDetails } from "../../UIBase/Details/TruckShipmentViewLoadingDetails";
import { Modal, Button, Select, Input, Checkbox } from "@scuf/common";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiTruckShipmentDetail } from "../../../JS/KPIPageName";
import TruckShipmentSealDetailsComposite from "../Details/TruckShipmentSealDetailsComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { DataTable } from "@scuf/datatable";

class TruckShipmentDetailsComposite extends Component {
  state = {
    shipment: {},
    modShipment: {},
    modCustomValues: {},
    modCompartmentPlans: [],
    modProductPlans: [],
    modLoadingDetails: [],
    staticLoadingDetails: [],
    trailerDetails: [],
    vehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    modVehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    validationErrors: Utilities.getInitialValidationErrors(
      shipmentValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    selectedCompartmentPlans: [],
    selectedProductPlans: [],
    vehicleOptions: [],
    driverOptions: [],
    quantityUOMOptions: [],
    finishedProductOptions: [],
    compSeqOptions: [],
    customerDestinationOptions: [],
    vehicleSearchOptions: [],
    driverSearchOptions: [],
    expandedRows: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],
    attributeMetaDataList: [],
    compAttributeMetaDataList: [],
    prodCompAttributeMetaDataList: [],
    trailerCompAttributeMetaDataList: [],
    compAttributeValidationErrors: [],
    prodCompAttributeValidationErrors: [],
    customerInventory: [],
    isPlanned: false,
    shipmentNextOperations: [],
    currentShipmentStatuses: [],
    isValidationPassed: true,
    isManualEntry: false,
    isVolumeBased: false,
    activeTab: this.props.ShipmentType.toLowerCase() === fnSBC ? 1 : 0,
    isDisableSubmitForApproval: true,
    isViewAuditTrail: false,
    isViewTrailerDetails: false,
    auditTrailList: [],
    modAuditTrailList: [],
    productAllocationList: [],
    ProdAllocEntity: "",
    productShareholderAllocationList: [],
    trailers: [],
    selectedShipTrailerAttributeList: [],
    selectedCompAttributes: [],
    isViewLoadingDetails: false,
    modViewLoadingDetails: [],
    loadingExpandedRows: [],
    nonConfigColumns: [],
    isSealCompartments: false,
    sealCompartments: [],
    isRecordWeight: false,
    recordWeightList: [],
    weighBridgeCode: "",
    scadaValue: "",
    allowOutofRangeTW: false,
    isCloseShipment: false,
    isVehicleCrippled: false,
    isNotRevised: false,
    topUpDecantOptions: [
      Constants.TopUpDecantApprovalStatus.NONE,
      Constants.TopUpDecantApprovalStatus.REQUEST_APPROVE,
      Constants.TopUpDecantApprovalStatus.REQUEST_REJECT,
    ],
    ddlTopUpDecantStatus: null,
    contractCodeOptions: [],
    ordertCodeOptions: [],
    isMarineTransLoading: false,
    isRailTransloading: false,
    marineReceiptCodes: [],
    marineReceiptCompCodes: [],
    drawerStatus:
      this.props.userDetails.EntityResult.IsWebPortalUser === true
        ? true
        : false,
    otherSourceData: [],
    isAutoGeneratedShipmentCode: false,
    isEnforcingEnabled: false,
    isBonded: false,
    bondExpiryDate: null,
    isVehicleChanged: false,
    autoGeneratedCode: "",
    isVehicleBonded: false,
    vehicleBondPopUp: false,
    vehicleBondExpiryPopUp: false,
    stockProducts: false,
    isLoadingDetailsChanged: false,
    truckShipmentKPIList: [],
    vehicleForRecordWeight: {},
    isLadenWeightValid: false,
    ladenWeightError: "",

    tempShipment: {},

    showShipmentAuthenticationLayout: false,
    showAuthorizeToLoadAuthenticationLayout: false,
    showAllowToLoadAuthenticationLayout: false,
    showCloseShipmentAuthenticationLayout: false,
    showViewBOLAuthenticationLayout: false,
    showPrintBOLAuthenticationLayout: false,
    showFANAuthenticationLayout: false,
    isAllocateBay: false,
    bayData: [],
    selectBay: [],
    isDeAllocateBay: false,
    ShipmentBay: "",
  };

  handleChange = (propertyName, data) => {
    try {
      const modShipment = lodash.cloneDeep(this.state.modShipment);
      modShipment[propertyName] = data;
      var validationErrors = { ...this.state.validationErrors };
      //this.setState({ modShipment });
      if (shipmentValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          shipmentValidationDef[propertyName],
          data
        );
      }
      if (propertyName === "IsBonded") {
        modShipment["ShipmentBondNo"] = "";
      }

      this.setState({ validationErrors, modShipment }, () => {
        if (propertyName === "TerminalCodes") {
          this.terminalSelectionChange(data);
        }
      });

      if (propertyName === "TransloadSourceType" && data === "MARINE") {
        this.getMarineTransloadableReceipts();
      }

      if (propertyName === "ddlTopUpDecant") {
        this.setState({ ddlTopUpDecantStatus: data });
      }
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleChange",
        error
      );
    }
  };

  getMarineReceipt = (commonCode) => {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: commonCode,
      },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.MARINE,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetMarineReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            let compCodes = [];
            if (
              result.EntityResult.RailMarineReceiptCompartmentDetailPlanList !==
              undefined &&
              result.EntityResult.RailMarineReceiptCompartmentDetailPlanList !==
              null
            ) {
              result.EntityResult.RailMarineReceiptCompartmentDetailPlanList.forEach(
                (item) => {
                  if (item.IsTransloading === true)
                    compCodes.push(item.CompartmentSeqNoInVehicle);
                }
              );
            }
            this.setState({
              marineReceiptCompCodes:
                Utilities.transferListtoOptions(compCodes),
            });
          }
        }
      })
      .catch((error) => {
        console.log("Error while getting marineReceipt:", error);
      });
  };

  handleCompartmentPlanCellDataEdit = (newVal, cellData) => {
    try {
      let modCompartmentPlans = lodash.cloneDeep(
        this.state.modCompartmentPlans
      );
      modCompartmentPlans[cellData.rowIndex][cellData.field] = newVal;
      if (cellData.field === "CustomerCode") {
        let customerDestinationOptions = this.state.customerDestinationOptions;
        if (
          customerDestinationOptions !== undefined &&
          customerDestinationOptions !== null
        ) {
          if (
            customerDestinationOptions[newVal] !== undefined &&
            Array.isArray(customerDestinationOptions[newVal]) &&
            customerDestinationOptions[newVal].length === 1
          ) {
            modCompartmentPlans[cellData.rowIndex]["DestinationCode"] =
              customerDestinationOptions[newVal][0];
          } else {
            modCompartmentPlans[cellData.rowIndex]["DestinationCode"] = "";
          }
        }
      } else if (cellData.field === "CompartmentSeqNoInVehicle") {
        let vehicleDetails = this.state.modVehicleDetails;
        let vehicleCompartments = vehicleDetails.vehicleCompartments.filter(
          (vc) => vc.vehCompSeq.toString() === newVal.toString()
        );
        if (vehicleCompartments.length > 0) {
          modCompartmentPlans[cellData.rowIndex]["Quantity"] =
            vehicleCompartments[0].SFL !== null &&
              vehicleCompartments[0].SFL !== ""
              ? vehicleCompartments[0].SFL.toLocaleString()
              : null;
          modCompartmentPlans[cellData.rowIndex]["TrailerCode"] =
            vehicleCompartments[0].trailerCode;
          modCompartmentPlans[cellData.rowIndex]["CompartmentCode"] =
            vehicleCompartments[0].compCode;
        }
      }
      this.attributeToggleExpand(
        modCompartmentPlans[cellData.rowIndex],
        true,
        true
      );
      this.setState({ modCompartmentPlans });
    } catch (error) {
      console.log(
        this.props.ShipmentType +
        ":Error occured on handleCompartmentPlanCellDataEdit",
        error
      );
    }
  };

  getShipmentStatusOperations(modShipment) {
    try {
      let obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: 0,
        KeyCodes: null,
        Entity: modShipment,
      };

      axios(
        RestAPIs.GetShipmentOperations,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          let nextOperations = [];
          Object.keys(result.EntityResult).forEach((operation) => {
            if (result.EntityResult[operation]) nextOperations.push(operation);
          });
          nextOperations.push("ViewAllShipment_Trailer_Details");
          this.setState({ shipmentNextOperations: nextOperations });
        })
        .catch((error) => {
          console.log(
            "Error while getting getShipmentStatusOperations:",
            error
          );
        });
    } catch (error) {
      console.log(error);
    }
  }

  getShipmentStatuses(shipmentRow) {
    try {
      let shipType =
        this.props.ShipmentType.toLowerCase() === fnSBP
          ? Constants.shipmentType.PRODUCT
          : Constants.shipmentType.COMPARTMENT;
      axios(
        RestAPIs.GetShipmentStatuses +
        "?shCode=" +
        this.props.selectedShareholder +
        "&shipmentCode=" +
        shipmentRow.ShipmentCode +
        "&shipmentType=" +
        shipType,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          //let lastStatus = result.EntityResult[Object.keys(result.EntityResult)[Object.keys(result.EntityResult).length - 1]];
          this.setState({
            currentShipmentStatuses: result.EntityResult,
            //lastStatus: lastStatus,
          });
        })
        .catch((error) => {
          console.log("Error while getting getShipmentStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  handleProductPlanCellDataEdit = (newVal, cellData) => {
    try {
      let modProductPlans = lodash.cloneDeep(this.state.modProductPlans);
      modProductPlans[cellData.rowIndex][cellData.field] = newVal;

      if (cellData.field === "CustomerCode") {
        //let detsinations = [];
        let customerDestinationOptions = this.state.customerDestinationOptions;
        if (
          customerDestinationOptions !== undefined &&
          customerDestinationOptions !== null
        ) {
          if (
            customerDestinationOptions[newVal] !== undefined &&
            Array.isArray(customerDestinationOptions[newVal]) &&
            customerDestinationOptions[newVal].length === 1
          ) {
            modProductPlans[cellData.rowIndex]["DestinationCode"] =
              customerDestinationOptions[newVal][0];
          } else {
            modProductPlans[cellData.rowIndex]["DestinationCode"] = "";
          }
        }
      }
      this.attributeToggleExpand(
        modProductPlans[cellData.rowIndex],
        true,
        true
      );
      this.setState({ modProductPlans });
    } catch (error) {
      console.log(
        this.props.ShipmentType +
        ":Error occured on handleProductPlanCellDataEdit",
        error
      );
    }
  };

  terminalSelectionChange(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeMetaDataList = [];
      var selectedAttributeList = [];

      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList.SHIPMENT
      );
      selectedAttributeList = lodash.cloneDeep(
        this.state.selectedAttributeList
      );

      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      var modShipment = lodash.cloneDeep(this.state.modShipment);

      selectedTerminals.forEach((terminal) => {
        var existitem = selectedAttributeList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modShipment.Attributes.find(
                (trailerAttribute) => {
                  return trailerAttribute.TerminalCode === terminal;
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

      this.formCompartmentPlanAttributes(selectedTerminals);

      if (this.props.ShipmentType.toLowerCase() === fnSBP)
        this.formProductPlanAttributes(selectedTerminals);

      this.setState({ selectedAttributeList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList.SHIPMENT
      );
      if (
        Array.isArray(attributeMetaDataList) &&
        attributeMetaDataList.length > 0
      )
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      else {
        var compAttributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList.SHIPMENTDESTINATIONCOMPARTMENT
        );
        var prodPlanAttributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList.SHIPMENTDETAILS
        );

        if (
          Array.isArray(compAttributeMetaDataList) &&
          compAttributeMetaDataList.length > 0
        )
          this.formCompartmentPlanAttributes([
            compAttributeMetaDataList[0].TerminalCode,
          ]);
        if (
          Array.isArray(prodPlanAttributeMetaDataList) &&
          prodPlanAttributeMetaDataList.length > 0
        )
          this.formCompartmentPlanAttributes([
            prodPlanAttributeMetaDataList[0].TerminalCode,
          ]);
      }
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  formProductPlanAttributes(selectedTerminals) {
    try {
      let attributes = lodash.cloneDeep(this.state.attributeMetaDataList);
      attributes = attributes.SHIPMENTDETAILS.filter(function (attTerminal) {
        return selectedTerminals.some(function (selTerminal) {
          return attTerminal.TerminalCode === selTerminal;
        });
      });
      let modProductPlans = lodash.cloneDeep(this.state.modProductPlans);

      modProductPlans.forEach((comp) => {
        let compAttributes = [];
        attributes.forEach((att) => {
          att.attributeMetaDataList.forEach((attribute) => {
            compAttributes.push({
              AttributeCode: attribute.Code,
              AttributeName: attribute.DisplayName,
              AttributeValue: attribute.DefaultValue,
              TerminalCode: attribute.TerminalCode,
              IsMandatory: attribute.IsMandatory,
              DataType: attribute.DataType,
              IsReadonly: attribute.IsReadonly,
              MinValue: attribute.MinValue,
              MaxValue: attribute.MaxValue,
              ValidationFormat: attribute.ValidationFormat,
              compSequenceNo: "",
              AttributeType: Constants.shipmentType.PRODUCT,
            });
          });
        });
        let attributesforNewComp = lodash.cloneDeep(compAttributes);

        if (
          (comp.FinishedProductCode === null ||
            comp.FinishedProductCode === undefined ||
            comp.FinishedProductCode === "") &&
          (comp.AttributesforUI === null || comp.AttributesforUI === undefined)
        ) {
          comp.AttributesforUI = [];
          attributesforNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.SeqNumber;
            comp.AttributesforUI.push(assignedAttributes);
          });
        } else {
          if (
            comp.AttributesforUI !== null &&
            comp.AttributesforUI !== undefined
          ) {
            comp.AttributesforUI = comp.AttributesforUI.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });

            compAttributes = compAttributes.filter(function (attTerminal) {
              return !comp.AttributesforUI.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal.TerminalCode;
              });
            });
          } else comp.AttributesforUI = [];

          let tempCompAttributes = lodash.cloneDeep(compAttributes);
          if (
            Array.isArray(comp.Attributes) &&
            comp.Attributes !== null &&
            comp.Attributes !== undefined &&
            comp.Attributes.length > 0
          ) {
            let selectedTerminalAttributes = comp.Attributes.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });
            selectedTerminalAttributes.forEach((att) => {
              att.ListOfAttributeData.forEach((attData) => {
                let tempAttIndex = tempCompAttributes.findIndex(
                  (item) =>
                    item.TerminalCode === att.TerminalCode &&
                    item.AttributeCode === attData.AttributeCode
                );
                if (tempAttIndex >= 0)
                  tempCompAttributes[tempAttIndex].AttributeValue =
                    attData.AttributeValue;
              });
            });
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesforUI.push(assignedAttributes);
            });
          } else {
            let tempCompAttributes = lodash.cloneDeep(compAttributes);
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesforUI.push(assignedAttributes);
            });
          }
        }
        this.attributeToggleExpand(comp, true, true);
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI = Utilities.compartmentAttributesConvertoDecimal(
            comp.AttributesforUI
          );
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modProductPlans });
    } catch (error) {
      console.log(
        "TruckShipmentDetailsComposite:Error in forming Product Plan Attributes",
        error
      );
    }
  }

  formCompartmentPlanAttributes(selectedTerminals) {
    try {
      let attributes = lodash.cloneDeep(this.state.attributeMetaDataList);

      attributes = attributes.SHIPMENTDESTINATIONCOMPARTMENT.filter(function (
        attTerminal
      ) {
        return selectedTerminals.some(function (selTerminal) {
          return attTerminal.TerminalCode === selTerminal;
        });
      });
      let modCompartmentPlans = lodash.cloneDeep(
        this.state.modCompartmentPlans
      );

      modCompartmentPlans.forEach((comp) => {
        let compAttributes = [];
        attributes.forEach((att) => {
          att.attributeMetaDataList.forEach((attribute) => {
            compAttributes.push({
              AttributeCode: attribute.Code,
              AttributeName: attribute.DisplayName,
              AttributeValue: attribute.DefaultValue,
              TerminalCode: attribute.TerminalCode,
              IsMandatory: attribute.IsMandatory,
              DataType: attribute.DataType,
              IsReadonly: attribute.IsReadonly,
              MinValue: attribute.MinValue,
              MaxValue: attribute.MaxValue,
              ValidationFormat: attribute.ValidationFormat,
              compSequenceNo: "",
              AttributeType: Constants.shipmentType.COMPARTMENT,
            });
          });
        });

        let attributesforNewComp = lodash.cloneDeep(compAttributes);
        if (
          (comp.FinishedProductCode === null ||
            comp.FinishedProductCode === undefined ||
            comp.FinishedProductCode === "") &&
          (comp.AttributesforUI === null || comp.AttributesforUI === undefined)
        ) {
          comp.AttributesforUI = [];
          attributesforNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.SeqNumber;
            comp.AttributesforUI.push(assignedAttributes);
          });
        } else {
          if (
            comp.AttributesforUI !== null &&
            comp.AttributesforUI !== undefined
          ) {
            comp.AttributesforUI = comp.AttributesforUI.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });

            compAttributes = compAttributes.filter(function (attTerminal) {
              return !comp.AttributesforUI.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal.TerminalCode;
              });
            });
          } else comp.AttributesforUI = [];
          let tempCompAttributes = lodash.cloneDeep(compAttributes);
          if (
            Array.isArray(comp.Attributes) &&
            comp.Attributes !== null &&
            comp.Attributes !== undefined &&
            comp.Attributes.length > 0
          ) {
            let selectedTerminalAttributes = comp.Attributes.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });
            selectedTerminalAttributes.forEach((att) => {
              att.ListOfAttributeData.forEach((attData) => {
                let tempAttIndex = tempCompAttributes.findIndex(
                  (item) =>
                    item.TerminalCode === att.TerminalCode &&
                    item.AttributeCode === attData.AttributeCode
                );
                if (tempAttIndex >= 0)
                  tempCompAttributes[tempAttIndex].AttributeValue =
                    attData.AttributeValue;
              });
            });
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesforUI.push(assignedAttributes);
            });
          } else {
            let tempCompAttributes = lodash.cloneDeep(compAttributes);
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesforUI.push(assignedAttributes);
            });
          }
        }
        this.attributeToggleExpand(comp, true, true);
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI = Utilities.compartmentAttributesConvertoDecimal(
            comp.AttributesforUI
          );
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modCompartmentPlans });
    } catch (error) {
      console.log(
        "TruckShipmentDetailsComposite:Error in forming Compartment Plan Attributes",
        error
      );
    }
  }

  fillAttributeDetails(modShipment, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modShipment.Attributes = [];
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
        modShipment.Attributes.push(attribute);
      });

      // For Compartment Attributes
      modShipment.ShipmentDestinationCompartmentsInfo.forEach(
        (shipmentCompartment) => {
          if (
            shipmentCompartment.AttributesforUI !== undefined &&
            shipmentCompartment.AttributesforUI != null
          )
            shipmentCompartment.AttributesforUI =
              Utilities.compartmentAttributesDatatypeConversion(
                shipmentCompartment.AttributesforUI
              );

          let selectedTerminals = [];
          if (this.props.userDetails.EntityResult.IsEnterpriseNode)
            selectedTerminals = lodash.cloneDeep(modShipment.TerminalCodes);
          else {
            var compAttributeMetaDataList = lodash.cloneDeep(
              this.state.attributeMetaDataList.SHIPMENTDESTINATIONCOMPARTMENT
            );
            if (compAttributeMetaDataList.length > 0)
              selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
          }
          let terminalAttributes = [];
          shipmentCompartment.Attributes = [];
          if (selectedTerminals !== null && selectedTerminals !== undefined)
            selectedTerminals.forEach((terminal) => {
              if (
                shipmentCompartment.AttributesforUI !== null &&
                shipmentCompartment.AttributesforUI !== undefined
              )
                terminalAttributes = shipmentCompartment.AttributesforUI.filter(
                  function (attTerminal) {
                    return attTerminal.TerminalCode === terminal;
                  }
                );

              let attribute = {
                ListOfAttributeData: [],
              };

              attribute.TerminalCode = terminal;
              terminalAttributes.forEach((termAtt) => {
                if (
                  termAtt.AttributeValue !== "" ||
                  termAtt.IsMandatory === true
                )
                  attribute.ListOfAttributeData.push({
                    AttributeCode: termAtt.AttributeCode,
                    AttributeValue: termAtt.AttributeValue,
                  });
              });
              if (
                attribute.ListOfAttributeData !== null &&
                attribute.ListOfAttributeData !== undefined &&
                attribute.ListOfAttributeData.length > 0
              )
                shipmentCompartment.Attributes.push(attribute);
            });
        }
      );

      if (this.props.ShipmentType.toLowerCase() === fnSBP) {
        // For Compartment Attributes
        modShipment.ShipmentDetailsInfo.forEach((shipmentDetail) => {
          if (
            shipmentDetail.AttributesforUI !== undefined &&
            shipmentDetail.AttributesforUI != null
          )
            shipmentDetail.AttributesforUI =
              Utilities.compartmentAttributesDatatypeConversion(
                shipmentDetail.AttributesforUI
              );

          let selectedTerminals = [];
          if (this.props.userDetails.EntityResult.IsEnterpriseNode)
            selectedTerminals = lodash.cloneDeep(modShipment.TerminalCodes);
          else {
            var compAttributeMetaDataList = lodash.cloneDeep(
              this.state.attributeMetaDataList.SHIPMENTDETAILS
            );
            if (compAttributeMetaDataList.length > 0)
              selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
          }
          let terminalAttributes = [];
          shipmentDetail.Attributes = [];
          if (selectedTerminals !== null && selectedTerminals !== undefined)
            selectedTerminals.forEach((terminal) => {
              if (
                shipmentDetail.AttributesforUI !== null &&
                shipmentDetail.AttributesforUI !== undefined
              )
                terminalAttributes = shipmentDetail.AttributesforUI.filter(
                  function (attTerminal) {
                    return attTerminal.TerminalCode === terminal;
                  }
                );

              let attribute = {
                ListOfAttributeData: [],
              };

              attribute.TerminalCode = terminal;
              terminalAttributes.forEach((termAtt) => {
                if (
                  termAtt.AttributeValue !== "" ||
                  termAtt.IsMandatory === true
                )
                  attribute.ListOfAttributeData.push({
                    AttributeCode: termAtt.AttributeCode,
                    AttributeValue: termAtt.AttributeValue,
                  });
              });
              if (
                attribute.ListOfAttributeData !== null &&
                attribute.ListOfAttributeData !== undefined &&
                attribute.ListOfAttributeData.length > 0
              )
                shipmentDetail.Attributes.push(attribute);
            });
        });
      }
    } catch (error) {
      console.log(
        "TruckShipmentDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
    this.setState({ modShipment });
    return modShipment;
  }

  componentWillReceiveProps(nextProps) {
    try {
      this.GetViewAllShipmentCustomData();
      let shipmentCode =
        this.props.ShipmentType.toLowerCase() === fnSBC
          ? this.state.shipment.Code
          : this.state.shipment.ShipmentCode;
      if (
        shipmentCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.setState({ isPlanned: false, isManualEntry: false, activeTab: 0 });
        this.getShipment(nextProps.selectedRow, nextProps.ShipmentType, 0);
      }
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getShipmentDestinationCompartmentsFromModCompartmentPlans(
    modCompartmentPlans
  ) {
    //let modShipment = lodash.cloneDeep(this.state.modShipment)
    let shipmentCompartments = [];

    if (Array.isArray(modCompartmentPlans)) {
      modCompartmentPlans.forEach((shipmentCompartment) => {
        if (
          !(
            shipmentCompartment.OrderCode === null ||
            shipmentCompartment.OrderCode === ""
          ) ||
          !(
            shipmentCompartment.ContractCode === null ||
            shipmentCompartment.ContractCode === ""
          ) ||
          !(
            shipmentCompartment.FinishedProductCode === null ||
            shipmentCompartment.FinishedProductCode === ""
          ) ||
          !(
            shipmentCompartment.CustomerCode === null ||
            shipmentCompartment.CustomerCode === ""
          ) ||
          !(
            shipmentCompartment.DestinationCode === null ||
            shipmentCompartment.DestinationCode === ""
          )
        ) {
          if (
            this.props.ShipmentType.toLowerCase() === fnSBC ||
            (this.props.ShipmentType.toLowerCase() === fnSBP &&
              this.state.shipment.ShipmentCode !== "")
          ) {
            if (
              shipmentCompartment.AttributesforUI !== undefined &&
              shipmentCompartment.AttributesforUI != null
            )
              shipmentCompartment.AttributesforUI =
                Utilities.compartmentAttributesConverttoLocaleString(
                  shipmentCompartment.AttributesforUI
                );

            shipmentCompartments.push({
              AssociatedOrderItems:
                shipmentCompartment.OrderCode === null
                  ? null
                  : [
                    {
                      FinishedProductCode:
                        shipmentCompartment.FinishedProductCode,
                      OrderCode: shipmentCompartment.OrderCode,
                      OrderItemQuantity:
                        shipmentCompartment.Quantity !== null &&
                          shipmentCompartment.Quantity !== ""
                          ? shipmentCompartment.Quantity.toLocaleString()
                          : null,
                      QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
                    },
                  ],
              AssociatedContractItems:
                shipmentCompartment.ContractCode === null
                  ? null
                  : [
                    {
                      FinishedProductCode:
                        shipmentCompartment.FinishedProductCode,
                      ContractCode: shipmentCompartment.ContractCode,
                      ContractItemQuantity:
                        shipmentCompartment.Quantity !== null &&
                          shipmentCompartment.Quantity !== ""
                          ? shipmentCompartment.Quantity.toLocaleString()
                          : null,
                      QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
                    },
                  ],
              CompartmentCode: shipmentCompartment.CompartmentCode,
              CompartmentSeqNoInVehicle:
                shipmentCompartment.CompartmentSeqNoInVehicle,
              TrailerCode: shipmentCompartment.TrailerCode,
              CompartmentSeqNoInTrailer:
                shipmentCompartment.CompartmentSeqNoInTrailer,
              Quantity:
                shipmentCompartment.Quantity !== null &&
                  shipmentCompartment.Quantity !== ""
                  ? shipmentCompartment.Quantity.toLocaleString()
                  : null,
              QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
              CustomerCode: shipmentCompartment.CustomerCode,
              DestinationCode: shipmentCompartment.DestinationCode,
              FinishedProductCode: shipmentCompartment.FinishedProductCode,
              ShareholderCode: this.props.selectedShareholder,
              ShipmentCode: this.state.modShipment.ShipmentCode,
              TerminalCodes: this.state.modShipment.TerminalCodes,
              Attributes: [],
              AttributesforUI: shipmentCompartment.AttributesforUI,
              TransReceiptCode: shipmentCompartment.TransReceiptCode,
              TransCompSequenceNumber:
                shipmentCompartment.TransCompSequenceNumber,
            });
          }
        }
      });
    }
    return shipmentCompartments;
  }

  getShipmentDetailsFromModProductPlans(modProductPlans) {
    let shipmentDetails = [];
    //let modShipment = lodash.cloneDeep(this.state.modShipment)

    if (Array.isArray(modProductPlans)) {
      modProductPlans.forEach((shipmentDetail) => {
        if (
          !(
            shipmentDetail.OrderCode === null || shipmentDetail.OrderCode === ""
          ) ||
          !(
            shipmentDetail.ContractCode === null ||
            shipmentDetail.ContractCode === ""
          ) ||
          !(
            shipmentDetail.FinishedProductCode === null ||
            shipmentDetail.FinishedProductCode === ""
          ) ||
          !(
            shipmentDetail.Quantity === null || shipmentDetail.Quantity === ""
          ) ||
          !(
            shipmentDetail.CustomerCode === null ||
            shipmentDetail.CustomerCode === ""
          ) ||
          !(
            shipmentDetail.DestinationCode === null ||
            shipmentDetail.DestinationCode === ""
          )
        ) {
          if (
            shipmentDetail.AttributesforUI !== undefined &&
            shipmentDetail.AttributesforUI != null
          )
            shipmentDetail.AttributesforUI =
              Utilities.compartmentAttributesConverttoLocaleString(
                shipmentDetail.AttributesforUI
              );

          let shipDetail = {
            AssociatedOrderItems:
              shipmentDetail.OrderCode === null
                ? null
                : [
                  {
                    FinishedProductCode: shipmentDetail.FinishedProductCode,
                    OrderCode: shipmentDetail.OrderCode,
                    OrderItemQuantity:
                      shipmentDetail.Quantity !== null &&
                        shipmentDetail.Quantity !== ""
                        ? shipmentDetail.Quantity.toLocaleString()
                        : null,
                    QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
                  },
                ],
            AssociatedContractItems:
              shipmentDetail.ContractCode === null
                ? null
                : [
                  {
                    FinishedProductCode: shipmentDetail.FinishedProductCode,
                    ContractCode: shipmentDetail.ContractCode,
                    ContractItemQuantity:
                      shipmentDetail.Quantity !== null &&
                        shipmentDetail.Quantity !== ""
                        ? shipmentDetail.Quantity.toLocaleString()
                        : null,
                    QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
                  },
                ],

            Quantity:
              shipmentDetail.Quantity !== null && shipmentDetail.Quantity !== ""
                ? shipmentDetail.Quantity.toLocaleString()
                : null,
            QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
            CustomerCode: shipmentDetail.CustomerCode,
            DestinationCode: shipmentDetail.DestinationCode,
            FinishedProductCode: shipmentDetail.FinishedProductCode,
            ShareholderCode: this.props.selectedShareholder,
            ShipmentCode: this.state.modShipment.ShipmentCode,
            TerminalCodes: this.state.modShipment.TerminalCodes,
            Attributes: [],
            AttributesforUI: shipmentDetail.AttributesforUI,
          };
          let ItemExists = false;
          shipmentDetails.forEach((item) => {
            if (
              item.FinishedProductCode === shipmentDetail.FinishedProductCode &&
              item.DestinationCode === shipmentDetail.DestinationCode &&
              item.CustomerCode === shipmentDetail.CustomerCode
            ) {
              if (
                item.AssociatedOrderItems !== null &&
                item.AssociatedOrderItems.length > 0 &&
                shipmentDetail.OrderCode !== null
              ) {
                for (
                  let iOrderTrack = 0;
                  iOrderTrack < item.AssociatedOrderItems.length &&
                  ItemExists === false;
                  iOrderTrack++
                ) {
                  let asoinfo = item.AssociatedOrderItems[iOrderTrack];
                  if (shipmentDetail.OrderCode !== asoinfo.OrderCode) {
                    ItemExists = true;
                    item.AssociatedOrderItems.push({
                      FinishedProductCode: shipmentDetail.FinishedProductCode,
                      OrderCode: shipmentDetail.OrderCode,
                      OrderItemQuantity:
                        shipmentDetail.Quantity !== null &&
                          shipmentDetail.Quantity !== ""
                          ? shipmentDetail.Quantity.toLocaleString()
                          : null,
                      QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
                    });
                    item.Quantity =
                      shipmentDetail.Quantity !== null &&
                        shipmentDetail.Quantity !== "" &&
                        item.Quantity !== null &&
                        item.Quantity !== ""
                        ? (
                          Utilities.convertStringtoDecimal(item.Quantity) +
                          Utilities.convertStringtoDecimal(
                            shipmentDetail.Quantity
                          )
                        ).toLocaleString()
                        : shipmentDetail.Quantity !== null &&
                          shipmentDetail.Quantity !== "" &&
                          (item.Quantity !== null || item.Quantity !== "")
                          ? shipmentDetail.Quantity.toLocaleString()
                          : (shipmentDetail.Quantity !== null ||
                            shipmentDetail.Quantity !== "") &&
                            item.Quantity !== null &&
                            item.Quantity !== ""
                            ? item.Quantity.toLocaleString()
                            : null;
                  }
                }
              } else if (
                item.AssociatedContractItems !== null &&
                item.AssociatedContractItems.length > 0 &&
                shipmentDetail.ContractCode !== null
              ) {
                for (
                  let iContractTrack = 0;
                  iContractTrack < item.AssociatedContractItems.length &&
                  ItemExists === false;
                  iContractTrack++
                ) {
                  let asoinfo = item.AssociatedContractItems[iContractTrack];
                  if (shipmentDetail.ContractCode !== asoinfo.ContractCode) {
                    ItemExists = true;
                    item.AssociatedContractItems.push({
                      FinishedProductCode: shipmentDetail.FinishedProductCode,
                      ContractCode: shipmentDetail.ContractCode,
                      ContractItemQuantity:
                        shipmentDetail.Quantity !== null &&
                          shipmentDetail.Quantity !== ""
                          ? shipmentDetail.Quantity.toLocaleString()
                          : null,
                      QuantityUOM: this.state.modShipment.ShipmentQuantityUOM,
                    });

                    item.Quantity =
                      shipmentDetail.Quantity !== null &&
                        shipmentDetail.Quantity !== "" &&
                        item.Quantity !== null &&
                        item.Quantity !== ""
                        ? (
                          Utilities.convertStringtoDecimal(item.Quantity) +
                          Utilities.convertStringtoDecimal(
                            shipmentDetail.Quantity
                          )
                        ).toLocaleString()
                        : shipmentDetail.Quantity !== null &&
                          shipmentDetail.Quantity !== "" &&
                          (item.Quantity !== null || item.Quantity !== "")
                          ? shipmentDetail.Quantity.toLocaleString()
                          : (shipmentDetail.Quantity !== null ||
                            shipmentDetail.Quantity !== "") &&
                            item.Quantity !== null &&
                            item.Quantity !== ""
                            ? item.Quantity.toLocaleString()
                            : null;
                  }
                }
              }
            }
          });

          if (ItemExists === false) shipmentDetails.push(shipDetail);
        }
      });
    }
    return shipmentDetails;
  }

  getMarineTransloadableReceipts() {
    axios(
      RestAPIs.GetMarineTransloadableReceipts,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            marineReceiptCodes: Utilities.transferListtoOptions(
              result.EntityResult
            ),
          });
        } else {
          console.log(
            "Error in GetMarineTransloadableReceipts:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "Error while geting GetMarineTransloadableReceipts:",
          error
        );
      });
  }

  getTarnsloadingDetails() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Transloading",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult != null) {
            this.setState({
              isMarineTransLoading:
                result.EntityResult.MarineEnable.toUpperCase() === "TRUE"
                  ? true
                  : false,
              isRailTransloading:
                result.EntityResult.RAILEnable.toUpperCase() === "TRUE"
                  ? true
                  : false,
            });
          } else {
            this.setState({
              isMarineTransLoading: false,
              isRailTransloading: false,
            });
          }
        } else {
          this.setState({
            isMarineTransLoading: false,
            isRailTransloading: false,
          });
          console.log("Error in getTarnsloadingDetails: ", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({
          productAllocationList: [],
          productShareholderAllocationList: [],
          ProdAllocEntity: "",
        });
        console.log(
          "TruckShipmentDetailsComposite: Error occurred on getTarnsloadingDetails",
          error
        );
      });
  }

  getLookUpData(shipmentCode) {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=ProductAllocation",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let allocationEntity = result.EntityResult.AllocationEntity;
          this.setState({ ProdAllocEntity: allocationEntity }, () =>
            this.getProductAllocationDetails(allocationEntity, shipmentCode)
          );
        } else {
          this.setState({
            productAllocationList: [],
            productShareholderAllocationList: [],
            ProdAllocEntity: "",
          });
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({
          productAllocationList: [],
          productShareholderAllocationList: [],
          ProdAllocEntity: "",
        });
        console.log(
          "TruckShipmentDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getSiteConfigurationLookUP = () => {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=SiteConfiguration",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            let siteConfiguration = result.EntityResult;
            this.getWeighBridge(siteConfiguration);
          } else {
            console.log(
              "Error in getSiteConfigurationLookUP: ",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "TruckShipmentDetailsComposite: Error occurred on getSiteConfigurationLookUP",
            error
          );
        });
    } catch (error) {
      console.log(
        "TruckShipmentDetailsComposite: Error occurred on getSiteConfigurationLookUP",
        error
      );
    }
  };

  IsBonded() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Bonding",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let bonded = result.EntityResult["EnableBondingNon-Bonding"];
          this.setState({
            isBonded: bonded.toUpperCase() === "TRUE" ? true : false,
          });
        } else {
          this.setState({
            isBonded: false,
          });
          console.log("Error in get IsBonded: ", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({
          isBonded: false,
        });
        console.log(
          "TruckShipmentDetailsComposite: Error occurred on get IsBonded",
          error
        );
      });
  }

  getProductAllocationDetails(allocationEntity, shipmentCode) {
    try {
      axios(
        RestAPIs.GetProductAllocationDetails +
        "?shCode=" +
        this.props.selectedShareholder +
        "&shipmentCode=" +
        shipmentCode +
        "&transportationType=" +
        Constants.TransportationType.ROAD,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess) {
            let dsProductAllocationItems = result.EntityResult;
            let productAllocationList = [];
            let productShareholderAllocationList = [];
            if (allocationEntity.toUpperCase().includes("SHAREHOLDER")) {
              if (
                dsProductAllocationItems !== null &&
                dsProductAllocationItems.Table1 !== null &&
                dsProductAllocationItems.Table1.length > 0
              ) {
                productShareholderAllocationList =
                  dsProductAllocationItems.Table1;

                productShareholderAllocationList.forEach((prodAlloc) => {
                  prodAlloc.startdate = new Date(
                    prodAlloc.startdate
                  ).toLocaleDateString();
                  prodAlloc.enddate = new Date(
                    prodAlloc.enddate
                  ).toLocaleDateString();
                  prodAlloc.allocatedqty =
                    prodAlloc.allocatedqty.toString() + " " + prodAlloc.uom;
                  prodAlloc.blockedqty =
                    prodAlloc.blockedqty.toString() + " " + prodAlloc.uom;
                  prodAlloc.loadedqty =
                    prodAlloc.loadedqty.toString() + " " + prodAlloc.uom;
                });
              } else if (
                dsProductAllocationItems !== null &&
                dsProductAllocationItems.Table !== null &&
                dsProductAllocationItems.Table.length > 0 &&
                Object.keys(dsProductAllocationItems).length === 1
              ) {
                productShareholderAllocationList =
                  dsProductAllocationItems.Table;

                productShareholderAllocationList.forEach((prodAlloc) => {
                  prodAlloc.startdate = new Date(
                    prodAlloc.startdate
                  ).toLocaleDateString();
                  prodAlloc.enddate = new Date(
                    prodAlloc.enddate
                  ).toLocaleDateString();
                  prodAlloc.allocatedqty =
                    prodAlloc.allocatedqty.toString() + " " + prodAlloc.uom;
                  prodAlloc.blockedqty =
                    prodAlloc.blockedqty.toString() + " " + prodAlloc.uom;
                  prodAlloc.loadedqty =
                    prodAlloc.loadedqty.toString() + " " + prodAlloc.uom;
                });
              }
              this.setState({
                productShareholderAllocationList:
                  productShareholderAllocationList,
              });
            }
            if (allocationEntity.toUpperCase().includes("CUSTOMER")) {
              if (
                dsProductAllocationItems !== null &&
                dsProductAllocationItems.Table !== null &&
                dsProductAllocationItems.Table.length > 0
              ) {
                productAllocationList = dsProductAllocationItems.Table;
                productAllocationList.forEach((prodAlloc) => {
                  prodAlloc.startdate = new Date(
                    prodAlloc.startdate
                  ).toLocaleDateString();
                  prodAlloc.enddate = new Date(
                    prodAlloc.enddate
                  ).toLocaleDateString();
                  prodAlloc.allocatedqty =
                    prodAlloc.allocatedqty.toString() + " " + prodAlloc.uom;
                  prodAlloc.blockedqty =
                    prodAlloc.blockedqty.toString() + " " + prodAlloc.uom;
                  prodAlloc.loadedqty =
                    prodAlloc.loadedqty.toString() + " " + prodAlloc.uom;
                });
              }

              this.setState({ productAllocationList: productAllocationList });
            }
          } else {
            this.setState({
              productAllocationList: [],
              productShareholderAllocationList: [],
              ProdAllocEntity: "",
            });
          }
        })
        .catch((error) => {
          this.setState({
            productAllocationList: [],
            productShareholderAllocationList: [],
            ProdAllocEntity: "",
          });
          console.log("Error while getting product Allocation Details:", error);
        });
    } catch (error) {
      this.setState({
        productAllocationList: [],
        productShareholderAllocationList: [],
        ProdAllocEntity: "",
      });
      console.log("Error in getting product Allocation details", error);
    }
  }

  handleSaveShipment = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempShipment = lodash.cloneDeep(this.state.tempShipment);

      this.state.shipment.ShipmentCode === ""
        ? this.createShipment(tempShipment)
        : this.updateShipment(tempShipment);
    } catch (error) {
      console.log("ShipDetailsComposite : Error in handleSaveShipment");
    }
  };

  saveShipment() {
    let modShipment = lodash.cloneDeep(this.state.modShipment);

    modShipment.ShipmentDestinationCompartmentsInfo =
      this.getShipmentDestinationCompartmentsFromModCompartmentPlans(
        this.state.modCompartmentPlans
      );
    if (this.props.ShipmentType.toLowerCase() === fnSBP) {
      modShipment.ShipmentDetailsInfo =
        this.getShipmentDetailsFromModProductPlans(this.state.modProductPlans);
    } else modShipment.ShipmentDetailsInfo = undefined;

    let attributeList = Utilities.attributesConverttoLocaleString(
      this.state.selectedAttributeList
    );

    this.setState({ saveEnabled: false });
    if (this.validateSave(modShipment, attributeList)) {
      this.setState({ isValidationPassed: true });

      modShipment = this.ConvertstringToDecimal(modShipment, attributeList);

      let showShipmentAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempShipment = lodash.cloneDeep(modShipment);
      this.setState({ showShipmentAuthenticationLayout, tempShipment }, () => {
        if (showShipmentAuthenticationLayout === false) {
          this.handleSaveShipment();
        }
      });
    } else {
      this.setState({ saveEnabled: true });
    }
  }

  handleSave = () => {
    try {
      let enableSave =
        this.state.shipment.ShipmentCode === ""
          ? true
          : this.state.modCustomValues.ShipmentUpdateAllow === "TRUE" &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            this.props.ShipmentType.toLowerCase()
          );

      let modShipment = lodash.cloneDeep(this.state.modShipment);

      if (enableSave) {
        if (modShipment.IsBonded) {
          if (!this.state.isVehicleBonded) {
            this.setState({ vehicleBondPopUp: true });
          } else if (
            this.state.bondExpiryDate !== "" &&
            this.state.bondExpiryDate !== null &&
            this.state.bondExpiryDate !== undefined
          ) {
            this.setState({ vehicleBondExpiryPopUp: true });
          }
        } else this.saveShipment();
      } else {
        if (
          this.props.ShipmentType.toLowerCase() === fnSBP &&
          this.state.activeTab === 2 &&
          this.state.isLoadingDetailsChanged &&
          this.state.modCustomValues.DisableLoadingDetails === "FALSE"
        )
          this.handleTopUpDecantApproval("SaveCompartment");
        else if (
          this.props.ShipmentType.toLowerCase() === fnSBC &&
          this.state.activeTab === 1 &&
          this.state.isLoadingDetailsChanged &&
          this.state.modCustomValues.DisableLoadingDetails === "FALSE"
        )
          this.handleTopUpDecantApproval("SaveCompartment");
      }
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleSave",
        error
      );
    }
  };

  ConvertstringToDecimal(modShipment, attributeList) {
    try {
      if (this.props.ShipmentType.toLowerCase() === fnSBC) {
        modShipment.ShipmentDestinationCompartmentsInfo.forEach((sc) => {
          sc.Quantity = Utilities.convertStringtoDecimal(sc.Quantity);
          if (
            Array.isArray(sc.AssociatedOrderItems) &&
            sc.AssociatedOrderItems.length > 0
          ) {
            sc.AssociatedOrderItems[0].OrderItemQuantity =
              Utilities.convertStringtoDecimal(
                sc.AssociatedOrderItems[0].OrderItemQuantity
              );
          }

          if (
            Array.isArray(sc.AssociatedContractItems) &&
            sc.AssociatedContractItems.length > 0
          ) {
            sc.AssociatedContractItems[0].ContractItemQuantity =
              Utilities.convertStringtoDecimal(
                sc.AssociatedContractItems[0].ContractItemQuantity
              );
          }
        });
      } else {
        if (
          modShipment.ShipmentDestinationCompartmentsInfo !== null &&
          modShipment.ShipmentDestinationCompartmentsInfo !== undefined &&
          modShipment.ShipmentDestinationCompartmentsInfo.length > 0
        )
          modShipment.ShipmentDestinationCompartmentsInfo.forEach((sc) => {
            sc.Quantity = Utilities.convertStringtoDecimal(sc.Quantity);
            if (
              Array.isArray(sc.AssociatedOrderItems) &&
              sc.AssociatedOrderItems.length > 0
            ) {
              sc.AssociatedOrderItems[0].OrderItemQuantity =
                Utilities.convertStringtoDecimal(
                  sc.AssociatedOrderItems[0].OrderItemQuantity
                );
            }

            if (
              Array.isArray(sc.AssociatedContractItems) &&
              sc.AssociatedContractItems.length > 0
            ) {
              sc.AssociatedContractItems[0].ContractItemQuantity =
                Utilities.convertStringtoDecimal(
                  sc.AssociatedContractItems[0].ContractItemQuantity
                );
            }
          });

        modShipment.ShipmentDetailsInfo.forEach((sd) => {
          sd.Quantity = Utilities.convertStringtoDecimal(sd.Quantity);
          if (
            Array.isArray(sd.AssociatedOrderItems) &&
            sd.AssociatedOrderItems.length > 0
          ) {
            sd.AssociatedOrderItems[0].OrderItemQuantity =
              Utilities.convertStringtoDecimal(
                sd.AssociatedOrderItems[0].OrderItemQuantity
              );
          }

          if (
            Array.isArray(sd.AssociatedContractItems) &&
            sd.AssociatedContractItems.length > 0
          ) {
            sd.AssociatedContractItems[0].ContractItemQuantity =
              Utilities.convertStringtoDecimal(
                sd.AssociatedContractItems[0].ContractItemQuantity
              );
          }
        });
      }
      modShipment = this.fillAttributeDetails(modShipment, attributeList);
    } catch (error) {
      console.log("convertStringtoDecimal on truck shipment details", error);
    }
    return modShipment;
  }

  validateSave(modShipment, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(shipmentValidationDef).forEach(function (key) {
      if (modShipment[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          shipmentValidationDef[key],
          modShipment[key]
        );
    });
    if (modShipment.Active !== this.state.shipment.Active) {
      if (modShipment.Remarks === null || modShipment.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [],
    };

    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    //let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);

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
    let returnValue = true;
    if (returnValue) {
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
    }
    // else {
    //   return returnValue;
    // }

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
      if (this.props.ShipmentType.toLowerCase() === fnSBC) {
        let uniqueRecords = [
          ...new Set(
            modShipment.ShipmentDestinationCompartmentsInfo.map(
              (a) => a.CompartmentSeqNoInVehicle
            )
          ),
        ];
        if (
          uniqueRecords.length !==
          modShipment.ShipmentDestinationCompartmentsInfo.length
        ) {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "Duplicate_Associated_Customers",
          });
          this.props.onSaved(this.state.modShipment, "update", notification);
          return false;
        }

        if (
          Array.isArray(modShipment.ShipmentDestinationCompartmentsInfo) &&
          modShipment.ShipmentDestinationCompartmentsInfo.length > 0
        ) {
          modShipment.ShipmentDestinationCompartmentsInfo.forEach(
            (shipmentCompartment) => {
              if (
                modShipment.CreatedFromEntity === Constants.shipmentFrom.Order
              ) {
                let err = "";
                if (
                  Array.isArray(shipmentCompartment.AssociatedOrderItems) &&
                  shipmentCompartment.AssociatedOrderItems.length > 0
                ) {
                  let shipOrder = shipmentCompartment.AssociatedOrderItems[0];
                  if (
                    shipOrder === null ||
                    shipOrder.OrderCode === undefined ||
                    shipOrder.OrderCode === null ||
                    shipOrder.OrderCode === ""
                  ) {
                    err = "ORDER_EMPTY";
                  }
                } else {
                  err = "ORDER_EMPTY";
                }
                if (err !== "") {
                  notification.messageResultDetails.push({
                    keyFields: ["ShipmentCompDetail_CompSeqInVehicle"],
                    keyValues: [shipmentCompartment.CompartmentSeqNoInVehicle],
                    isSuccess: false,
                    errorMessage: err,
                  });
                }
              } else if (
                modShipment.CreatedFromEntity ===
                Constants.shipmentFrom.Contract
              ) {
                let err = "";
                if (
                  Array.isArray(shipmentCompartment.AssociatedContractItems) &&
                  shipmentCompartment.AssociatedContractItems.length > 0
                ) {
                  let shipOrder =
                    shipmentCompartment.AssociatedContractItems[0];
                  if (
                    shipOrder === null ||
                    shipOrder.ContractCode === undefined ||
                    shipOrder.ContractCode === null ||
                    shipOrder.ContractCode === ""
                  ) {
                    err = "Contract_Code_Empty";
                  }
                } else {
                  err = "Contract_Code_Empty";
                }
                if (err !== "") {
                  notification.messageResultDetails.push({
                    keyFields: ["ShipmentCompDetail_CompSeqInVehicle"],
                    keyValues: [shipmentCompartment.CompartmentSeqNoInVehicle],
                    isSuccess: false,
                    errorMessage: err,
                  });
                }
              }

              shipmentCompartmentValidationDef.forEach((col) => {
                let err = "";

                if (col.validator !== undefined) {
                  err = Utilities.validateField(
                    col.validator,
                    shipmentCompartment[col.field]
                  );
                }

                if (err !== "") {
                  notification.messageResultDetails.push({
                    keyFields: [
                      "ShipmentCompDetail_CompSeqInVehicle",
                      col.displayName,
                    ],
                    keyValues: [
                      shipmentCompartment.CompartmentSeqNoInVehicle,
                      shipmentCompartment[col.field],
                    ],
                    isSuccess: false,
                    errorMessage: err,
                  });
                }
              });
              // let updatedAttributes = []
              // if (shipmentCompartment.AttributesforUI !== null && shipmentCompartment.AttributesforUI !== undefined)
              //     updatedAttributes = shipmentCompartment.AttributesforUI.filter(function (uIAttributes) {
              //         return shipmentCompartment.Attributes.some(function (selAttribute) {
              //             let isPresent = (selAttribute.ListOfAttributeData.findIndex((item) => item.AttributeCode === uIAttributes.AttributeCode) >= 0) ? true : false
              //             return uIAttributes.TerminalCode === selAttribute.TerminalCode && isPresent
              //         })
              //     })

              if (
                shipmentCompartment.AttributesforUI !== null &&
                shipmentCompartment.AttributesforUI !== undefined
              )
                shipmentCompartment.AttributesforUI.forEach((item) => {
                  let errMsg = Utilities.valiateAttributeField(
                    item,
                    item.AttributeValue
                  );
                  if (errMsg !== "") {
                    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                      notification.messageResultDetails.push({
                        keyFields: [
                          "CompAttributeComp",
                          "CompAttributeTerminal",
                          item.AttributeName,
                        ],
                        keyValues: [
                          shipmentCompartment.CompartmentSeqNoInVehicle,
                          item.TerminalCode,
                          item.AttributeValue,
                        ],
                        isSuccess: false,
                        errorMessage: errMsg,
                      });
                    } else {
                      notification.messageResultDetails.push({
                        keyFields: ["CompAttributeComp", item.AttributeName],
                        keyValues: [
                          shipmentCompartment.CompartmentSeqNoInVehicle,
                          item.AttributeValue,
                        ],
                        isSuccess: false,
                        errorMessage: errMsg,
                      });
                    }
                  }
                });
              this.attributeToggleExpand(shipmentCompartment, true, true);
            }
          );
        } else {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "Shipment_Compartment_Association_Require",
          });
        }
      } else {
        if (
          Array.isArray(modShipment.ShipmentDetailsInfo) &&
          modShipment.ShipmentDetailsInfo.length > 0
        ) {
          let shipDetailNumber = 1;
          modShipment.ShipmentDetailsInfo.forEach((shipmentDetail) => {
            if (
              modShipment.CreatedFromEntity === Constants.shipmentFrom.Order
            ) {
              let err = "";
              if (
                Array.isArray(shipmentDetail.AssociatedOrderItems) &&
                shipmentDetail.AssociatedOrderItems.length > 0
              ) {
                let shipOrder = shipmentDetail.AssociatedOrderItems[0];
                if (
                  shipOrder === null ||
                  shipOrder.OrderCode === undefined ||
                  shipOrder.OrderCode === null ||
                  shipOrder.OrderCode === ""
                ) {
                  err = "ORDER_EMPTY";
                }
              } else {
                err = "ORDER_EMPTY";
              }
              if (err !== "") {
                this.setState({ isValidationPassed: false });
                notification.messageResultDetails.push({
                  keyFields: ["CompAttributeComp"],
                  keyValues: [shipDetailNumber],
                  isSuccess: false,
                  errorMessage: err,
                });
              }
            } else if (
              modShipment.CreatedFromEntity === Constants.shipmentFrom.Contract
            ) {
              let err = "";
              if (
                Array.isArray(shipmentDetail.AssociatedContractItems) &&
                shipmentDetail.AssociatedContractItems.length > 0
              ) {
                let shipOrder = shipmentDetail.AssociatedContractItems[0];
                if (
                  shipOrder === null ||
                  shipOrder.ContractCode === undefined ||
                  shipOrder.ContractCode === null ||
                  shipOrder.ContractCode === ""
                ) {
                  err = "Contract_Code_Empty";
                }
              } else {
                err = "Contract_Code_Empty";
              }
              if (err !== "") {
                this.setState({ isValidationPassed: false });
                notification.messageResultDetails.push({
                  keyFields: ["CompAttributeComp"],
                  keyValues: [shipDetailNumber],
                  isSuccess: false,
                  errorMessage: err,
                });
              }
            }

            shipmentProductValidationDef.forEach((col) => {
              let err = "";

              if (col.validator !== undefined) {
                err = Utilities.validateField(
                  col.validator,
                  shipmentDetail[col.field]
                );
              }

              if (err !== "") {
                this.setState({ isValidationPassed: false });
                notification.messageResultDetails.push({
                  keyFields: ["CompAttributeComp", col.displayName],
                  keyValues: [shipDetailNumber, shipmentDetail[col.field]],
                  isSuccess: false,
                  errorMessage: err,
                });
              }
            });

            let updatedAttributes = [];
            if (
              shipmentDetail.AttributesforUI !== null &&
              shipmentDetail.AttributesforUI !== undefined
            )
              updatedAttributes = shipmentDetail.AttributesforUI.filter(
                function (uIAttributes) {
                  return shipmentDetail.Attributes.some(function (
                    selAttribute
                  ) {
                    let isPresent =
                      selAttribute.ListOfAttributeData.findIndex(
                        (item) =>
                          item.AttributeCode === uIAttributes.AttributeCode
                      ) >= 0
                        ? true
                        : false;
                    return (
                      uIAttributes.TerminalCode === selAttribute.TerminalCode &&
                      isPresent
                    );
                  });
                }
              );

            updatedAttributes.forEach((item) => {
              let errMsg = Utilities.valiateAttributeField(
                item,
                item.AttributeValue
              );
              if (errMsg !== "") {
                this.setState({ isValidationPassed: false });
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  notification.messageResultDetails.push({
                    keyFields: [
                      "CompAttributeComp",
                      "CompAttributeTerminal",
                      item.AttributeName,
                    ],
                    keyValues: [
                      item.compSequenceNo,
                      item.TerminalCode,
                      item.AttributeValue,
                    ],
                    isSuccess: false,
                    errorMessage: errMsg,
                  });
                } else {
                  notification.messageResultDetails.push({
                    keyFields: ["CompAttributeComp", item.AttributeName],
                    keyValues: [item.compSequenceNo, item.AttributeValue],
                    isSuccess: false,
                    errorMessage: errMsg,
                  });
                }
              }
            });
            this.attributeToggleExpand(shipmentDetail, true, true);
            shipDetailNumber = shipDetailNumber + 1;
          });
        } else {
          this.setState({ isValidationPassed: false });
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "Shipment_Compartment_Association_Require",
          });
        }
      }
    else return returnValue;

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modShipment, "update", notification);
      return false;
    }
    return returnValue;
  }

  updateShipment(modShipment) {
    modShipment.ShipmentCompartments = null;
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: 0,
      KeyCodes: null,
      Entity: modShipment,
    };
    let notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modShipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateShipment,
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
          this.setState({
            saveEnabled: true,
            showShipmentAuthenticationLayout: false,
          });
          if (
            this.props.ShipmentType.toLowerCase() === fnSBP &&
            this.state.activeTab === 2 &&
            this.state.isLoadingDetailsChanged &&
            this.state.modCustomValues.DisableLoadingDetails === "FALSE"
          )
            this.handleTopUpDecantApproval("SaveCompartment");
          else if (
            this.props.ShipmentType.toLowerCase() === fnSBC &&
            this.state.activeTab === 1 &&
            this.state.isLoadingDetailsChanged &&
            this.state.modCustomValues.DisableLoadingDetails === "FALSE"
          )
            this.handleTopUpDecantApproval("SaveCompartment");
          else
            this.getShipment({
              Common_Code: modShipment.ShipmentCode,
              isValidationPassed: true,
            });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
            showShipmentAuthenticationLayout: false,
          });
          console.log("Error in UpdateShipment:", result.ErrorList);
        }
        this.props.onSaved(modShipment, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true,
          showShipmentAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modShipment, "modify", notification);
      });
  }

  createShipment(modShipment) {
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: 0,
      KeyCodes: null,
      Entity: modShipment,
    };

    let notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modShipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateShipment,
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
          this.setState({
            showShipmentAuthenticationLayout: false,
          });
          this.getShipment({
            Common_Code: modShipment.ShipmentCode,
            isValidationPassed: true,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
            showShipmentAuthenticationLayout: false,
          });
          console.log("Error in CreateShipment:", result.ErrorList);
        }
        this.props.onSaved(modShipment, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true,
          showShipmentAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modShipment, "add", notification);
      });
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (this.props.userDetails.EntityResult.IsArchived)
        this.setState({ isDisableSubmitForApproval: true });
      //this.getShipment(this.props.selectedRow);
      this.GetViewAllShipmentCustomData();
      this.IsBonded();
      this.getAttributes(this.props.selectedRow);
      //this.getLoadingDetails(this.props.selectedRow);
      this.GetUOMList();
      this.getVehicleCodes(this.props.selectedShareholder);
      this.getDriverCodes(this.props.selectedShareholder);
      this.getFinishedProductCodes(this.props.selectedShareholder);
      this.getcustomerDestinationList(this.props.selectedShareholder);
      this.getContractCodes(this.props.selectedShareholder);
      this.getOrderCodes(this.props.selectedShareholder);
      this.getTarnsloadingDetails();
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(selectedRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [
            shipmentAttributeEntity,
            shipmentCompartmentAttributeEntity,
            shipmentDestinationCompartmentAttributeEntity,
            shipmentDetailsAttributeEntity,
            shipmentTrailerWeighBridgeAttributeEntity,
            shipmentTrailerAttributeEntity,
            shipmentStatusTimeAttributeEntity,
          ],
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
                  result.EntityResult.SHIPMENT
                ),
              compAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.SHIPMENTDESTINATIONCOMPARTMENT
                ),
              prodCompAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.SHIPMENTDETAILS
                ),
            },
            () => this.getShipment(selectedRow)
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  GetVehicleTrCmptDetailsForShipment(vehicleCode) {
    let modShipment = lodash.cloneDeep(this.state.modShipment);
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: vehicleCode,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetVehicleTrCmptDetailsForShipment,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess) {
          if (result.EntityResult && Array.isArray(result.EntityResult.Table)) {
            let enableEnforcing = result.EntityResult.Table[0].EnforceSequencing
              ? true
              : false;
            modShipment.IsBonded = result.EntityResult.Table[0].IsBonded
              ? true
              : this.state.shipment.IsBonded;
            let bondExpiryDate = result.EntityResult.Table[0].BondExpiryDate;
            this.setState({
              isEnforcingEnabled: enableEnforcing,
              modShipment,
              bondExpiryDate: bondExpiryDate,
              isVehicleBonded: result.EntityResult.Table[0].IsBonded
                ? true
                : false,
            });
          }
        }
      })
      .catch((error) => {
        this.setState({
          isEnforcingEnabled: false,
          modShipment,
          bondExpiryDate: null,
          isVehicleBonded: false,
        });
        console.log("Error while getting VehicleTrailer Comp Details:", error);
      });
  }

  getVehicle(vehicleCode, vehicleChanged) {
    let modShipment = lodash.cloneDeep(this.state.modShipment);
    let modVehicleDetails = lodash.cloneDeep(this.state.modVehicleDetails);
    modShipment.VehicleCode = vehicleCode;
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: vehicleCode,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetVehicle,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            modShipment.CarrierCode = result.EntityResult.CarrierCompanyCode;
            modVehicleDetails.carrierCode =
              result.EntityResult.CarrierCompanyCode;
            modVehicleDetails.vehicleCompartments =
              this.getCompartmentDetailsFromVehicle(result.EntityResult);
            //if (this.props.ShipmentType.toLowerCase() === fnSBC) {
            let compSeqOptions = [];
            modVehicleDetails.vehicleCompartments.forEach(
              (vehicleCompartment) =>
                compSeqOptions.push({
                  text: vehicleCompartment.vehCompSeq.toString(),
                  value: vehicleCompartment.vehCompSeq.toString(),
                })
            );

            if (vehicleChanged) {
              let modCompartmentPlans =
                this.getShipmentCompartmentFromVehicleCompartment(
                  modVehicleDetails.vehicleCompartments
                );
              modCompartmentPlans =
                Utilities.addSeqNumberToListObject(modCompartmentPlans);
              this.setState({ modCompartmentPlans }, () => {
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  this.terminalSelectionChange(modShipment.TerminalCodes);
                } else {
                  this.localNodeAttribute();
                }
              });
            }
            // this.setState({
            //   compSeqOptions,
            // });
            //}

            this.setState(
              {
                isVehicleChanged: vehicleChanged,
                modShipment,
                modVehicleDetails,
                compSeqOptions,
                vehicleForRecordWeight: result.EntityResult,
              },
              () => {
                if (this.state.isBonded)
                  this.GetVehicleTrCmptDetailsForShipment(vehicleCode);
              }
            );

            if (this.state.shipment.VehicleCode === modShipment.VehicleCode) {
              let vehicleDetails = lodash.cloneDeep(modVehicleDetails);
              this.setState({ vehicleDetails });
            }
          }
        } else {
          this.setState({ modShipment });

          console.log("Error in GetVehicle:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ modShipment });
        console.log("Error while getting Vehicle:", error);
      });
  }

  handleVehicleChange = (vehicleCode) => {
    try {
      //this.props.ShipmentType.toLowerCase() === fnSBC ?
      this.getVehicle(vehicleCode, true);
      //: this.getVehicle(vehicleCode, false)

      let validationErrors = lodash.cloneDeep(this.state.validationErrors);
      validationErrors["VehicleCode"] = "";
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleVehicleChange",
        error
      );
    }
  };

  handleDriverSearchChange = (driverCode) => {
    try {
      let driverSearchOptions = this.state.driverOptions.filter((item) =>
        item.value.toLowerCase().includes(driverCode.toLowerCase())
      );
      if (driverSearchOptions.length > Constants.filteredOptionsCount) {
        driverSearchOptions = driverSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        driverSearchOptions,
      });
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleDriverSearchChange",
        error
      );
    }
  };

  handleVehicleSearchChange = (vehicleCode) => {
    try {
      let vehicleSearchOptions = this.state.vehicleOptions.filter((item) =>
        item.value.toLowerCase().includes(vehicleCode.toLowerCase())
      );
      if (vehicleSearchOptions.length > Constants.filteredOptionsCount) {
        vehicleSearchOptions = vehicleSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        vehicleSearchOptions,
      });
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleVehicleSearchChange",
        error
      );
    }
  };

  getShipmentCompartmentFromShipment(shipment) {
    let shipmentCompartments = [];

    if (Array.isArray(shipment.ShipmentDestinationCompartmentsInfo)) {
      shipment.ShipmentDestinationCompartmentsInfo.forEach(
        (shipmentCompartment) =>
          shipmentCompartments.push({
            ShipmentCode: shipment.ShipmentCode,
            CompartmentCode: shipmentCompartment.CompartmentCode,
            CompartmentSeqNoInVehicle:
              shipmentCompartment.CompartmentSeqNoInVehicle,
            TrailerCode: shipmentCompartment.TrailerCode,
            CompartmentSeqNoInTrailer: shipmentCompartment.trailerCompSeq,
            Quantity:
              shipmentCompartment.Quantity !== null &&
                shipmentCompartment.Quantity !== ""
                ? shipmentCompartment.Quantity.toLocaleString()
                : null,
            UOM: shipmentCompartment.QuantityUOM,
            OrderCode:
              shipmentCompartment.AssociatedOrderItems != null
                ? shipmentCompartment.AssociatedOrderItems[0].OrderCode
                : null,
            ContractCode:
              shipmentCompartment.AssociatedContractItems != null
                ? shipmentCompartment.AssociatedContractItems[0].ContractCode
                : null,
            CustomerCode: shipmentCompartment.CustomerCode,
            DestinationCode: shipmentCompartment.DestinationCode,
            FinishedProductCode: shipmentCompartment.FinishedProductCode,
            ShareholderCode: this.props.selectedShareholder,
            Attributes: shipmentCompartment.Attributes,
            TransReceiptCode: shipmentCompartment.TransReceiptCode,
            TransCompSequenceNumber:
              shipmentCompartment.TransCompSequenceNumber,
          })
      );
    }
    shipmentCompartments =
      Utilities.addSeqNumberToListObject(shipmentCompartments);
    return shipmentCompartments.sort((a, b) => {
      if (a.CompartmentSeqNoInVehicle > b.CompartmentSeqNoInVehicle) return 1;
      else if (a.CompartmentSeqNoInVehicle < b.CompartmentSeqNoInVehicle)
        return -1;
      else return 0;
    });
  }

  getShipmentDetailsFromShipment(shipment) {
    let shipmentDetails = [];
    if (Array.isArray(shipment.ShipmentDetailsInfo)) {
      shipment.ShipmentDetailsInfo.forEach((shipmentDetail) => {
        if (
          shipmentDetail.AssociatedOrderItems !== null &&
          shipmentDetail.AssociatedOrderItems.length > 0
        ) {
          shipmentDetail.AssociatedOrderItems.forEach((item) => {
            shipmentDetails.push({
              Quantity:
                item.OrderItemQuantity !== null && item.OrderItemQuantity !== ""
                  ? item.OrderItemQuantity.toLocaleString()
                  : null,
              UOM: shipmentDetail.QuantityUOM,
              OrderCode: item.OrderCode,
              ContractCode: null,
              CustomerCode: shipmentDetail.CustomerCode,
              DestinationCode: shipmentDetail.DestinationCode,
              FinishedProductCode: shipmentDetail.FinishedProductCode,
              ShareholderCode: this.props.selectedShareholder,
              Attributes: shipmentDetail.Attributes,
            });
          });
        } else if (
          shipmentDetail.AssociatedContractItems !== null &&
          shipmentDetail.AssociatedContractItems.length > 0
        ) {
          shipmentDetail.AssociatedContractItems.forEach((item) => {
            shipmentDetails.push({
              Quantity:
                item.ContractItemQuantity !== null &&
                  item.ContractItemQuantity !== ""
                  ? item.ContractItemQuantity.toLocaleString()
                  : null,
              UOM: shipmentDetail.QuantityUOM,
              OrderCode: null,
              ContractCode: item.ContractCode,
              CustomerCode: shipmentDetail.CustomerCode,
              DestinationCode: shipmentDetail.DestinationCode,
              FinishedProductCode: shipmentDetail.FinishedProductCode,
              ShareholderCode: this.props.selectedShareholder,
              Attributes: shipmentDetail.Attributes,
            });
          });
        } else
          shipmentDetails.push({
            Quantity:
              shipmentDetail.Quantity !== null && shipmentDetail.Quantity !== ""
                ? shipmentDetail.Quantity.toLocaleString()
                : null,
            UOM: shipmentDetail.QuantityUOM,
            OrderCode: null,
            ContractCode: null,
            CustomerCode: shipmentDetail.CustomerCode,
            DestinationCode: shipmentDetail.DestinationCode,
            FinishedProductCode: shipmentDetail.FinishedProductCode,
            ShareholderCode: this.props.selectedShareholder,
            Attributes: shipmentDetail.Attributes,
          });
      });
    }
    shipmentDetails = Utilities.addSeqNumberToListObject(shipmentDetails);
    return shipmentDetails.sort((a, b) => {
      if (a.CompartmentSeqNoInVehicle > b.CompartmentSeqNoInVehicle) return 1;
      else if (a.CompartmentSeqNoInVehicle < b.CompartmentSeqNoInVehicle)
        return -1;
      else return 0;
    });
  }

  getShipmentCompartmentFromVehicleCompartment(vehicleCompartments) {
    let shipmentCompartments = [];
    if (
      this.props.shipmentSource !== undefined &&
      !this.props.shipmentSourceFromSummary
    ) {
      let cusCode = this.props.shipmentSourceDetails.CustomerCode;
      if (Array.isArray(this.props.shipmentSourceCompartmentItems)) {
        // let length = 0;
        // if (Array.isArray(vehicleCompartments))
        //   length = vehicleCompartments.length;
        for (
          let i = 0;
          i < this.props.shipmentSourceCompartmentItems.length;
          i++
        ) {
          let shipmentCompartment = {};
          let vehicleCompartment = {};
          let item = this.props.shipmentSourceCompartmentItems[i];
          if (item.RemainingQuantity !== null && item.RemainingQuantity > 0) {
            if (this.props.ShipmentType.toLowerCase() === fnSBC) {
              vehicleCompartment = vehicleCompartments[i];
              if (vehicleCompartment === undefined) break;
            }

            this.props.ShipmentType.toLowerCase() === fnSBC
              ? (shipmentCompartment = {
                ShipmentCode: "",
                CompartmentCode: vehicleCompartment.compCode,
                CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
                TrailerCode: vehicleCompartment.trailerCode,
                CompartmentSeqNoInTrailer: vehicleCompartment.trailerCompSeq,
                Quantity:
                  item.RemainingQuantity !== null &&
                    item.RemainingQuantity !== ""
                    ? item.RemainingQuantity.toLocaleString()
                    : null,
                QuantityUOM: item.QuantityUOM,
                OrderCode:
                  this.props.shipmentSource === Constants.shipmentFrom.Order
                    ? this.props.shipmentSourceDetails.OrderCode
                    : null,
                ContractCode:
                  this.props.shipmentSource ===
                    Constants.shipmentFrom.Contract
                    ? this.props.shipmentSourceDetails.ContractCode
                    : null,
                CustomerCode: cusCode,
                DestinationCode:
                  this.props.shipmentSource ===
                    Constants.shipmentFrom.Contract
                    ? item.DestinationCode
                    : "",
                FinishedProductCode: item.FinishedProductCode,
                ShareholderCode: this.props.selectedShareholder,
                TransCompSequenceNumber: null,
                TransReceiptCode: null,
              })
              : (shipmentCompartment = {
                // CompartmentCode: vehicleCompartment.compCode,
                // CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
                // TrailerCode: vehicleCompartment.trailerCode,
                Quantity:
                  item.RemainingQuantity !== null &&
                    item.RemainingQuantity !== ""
                    ? item.RemainingQuantity.toLocaleString()
                    : null,
                UOM: item.QuantityUOM,
                OrderCode:
                  this.props.shipmentSource === Constants.shipmentFrom.Order
                    ? this.props.shipmentSourceDetails.OrderCode
                    : null,
                ContractCode:
                  this.props.shipmentSource ===
                    Constants.shipmentFrom.Contract
                    ? this.props.shipmentSourceDetails.ContractCode
                    : null,
                CustomerCode: cusCode,
                DestinationCode:
                  this.props.shipmentSource ===
                    Constants.shipmentFrom.Contract
                    ? item.DestinationCode
                    : "",
                FinishedProductCode: item.FinishedProductCode,
                ShareholderCode: this.props.selectedShareholder,
              });

            shipmentCompartments.push(shipmentCompartment);
          }
        }
      }
    } else if (
      this.props.shipmentSource !== undefined &&
      this.props.shipmentSourceFromSummary
    ) {
      //this.props.shipmentSource === Constants.shipmentFrom.Contract
      let otherSourceData = lodash.cloneDeep(this.state.otherSourceData);

      if (Array.isArray(otherSourceData)) {
        // let length = 0;
        // if (Array.isArray(vehicleCompartments))
        //   length = vehicleCompartments.length;
        let j = 0;
        otherSourceData.forEach((data) => {
          let compItems =
            this.props.shipmentSource === Constants.shipmentFrom.Contract
              ? data.ContractItems
              : data.OrderItems;

          let cusCode = data.CustomerCode;
          for (let i = 0; i < compItems.length; i++) {
            let shipmentCompartment = {};
            let vehicleCompartment = {};
            let item = compItems[i];
            if (item.RemainingQuantity !== null && item.RemainingQuantity > 0) {
              if (this.props.ShipmentType.toLowerCase() === fnSBC) {
                vehicleCompartment = vehicleCompartments[j];
                if (vehicleCompartment === undefined) break;
              }
              this.props.ShipmentType.toLowerCase() === fnSBC
                ? (shipmentCompartment = {
                  ShipmentCode: "",
                  CompartmentCode: vehicleCompartment.compCode,
                  CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
                  TrailerCode: vehicleCompartment.trailerCode,
                  CompartmentSeqNoInTrailer:
                    vehicleCompartment.trailerCompSeq,
                  Quantity:
                    item.RemainingQuantity !== null &&
                      item.RemainingQuantity !== ""
                      ? item.RemainingQuantity.toLocaleString()
                      : null,
                  QuantityUOM: item.QuantityUOM,
                  OrderCode:
                    this.props.shipmentSource === Constants.shipmentFrom.Order
                      ? data.OrderCode
                      : null,
                  ContractCode:
                    this.props.shipmentSource ===
                      Constants.shipmentFrom.Contract
                      ? data.ContractCode
                      : null,
                  CustomerCode: cusCode,
                  DestinationCode:
                    this.props.shipmentSource ===
                      Constants.shipmentFrom.Contract
                      ? item.DestinationCode
                      : null,
                  FinishedProductCode: item.FinishedProductCode,
                  ShareholderCode: this.props.selectedShareholder,
                  TransCompSequenceNumber: null,
                  TransReceiptCode: null,
                })
                : (shipmentCompartment = {
                  // CompartmentCode: vehicleCompartment.compCode,
                  // CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
                  // TrailerCode: vehicleCompartment.trailerCode,
                  Quantity:
                    item.RemainingQuantity !== null &&
                      item.RemainingQuantity !== ""
                      ? item.RemainingQuantity.toLocaleString()
                      : null,
                  UOM: item.QuantityUOM,
                  OrderCode:
                    this.props.shipmentSource === Constants.shipmentFrom.Order
                      ? data.OrderCode
                      : null,
                  ContractCode:
                    this.props.shipmentSource ===
                      Constants.shipmentFrom.Contract
                      ? data.ContractCode
                      : null,
                  CustomerCode: cusCode,
                  DestinationCode:
                    this.props.shipmentSource ===
                      Constants.shipmentFrom.Contract
                      ? item.DestinationCode
                      : null,
                  FinishedProductCode: item.FinishedProductCode,
                  ShareholderCode: this.props.selectedShareholder,
                });
              shipmentCompartments.push(shipmentCompartment);
              j++;
            }
          }
        });
      }
      if (this.props.ShipmentType.toLowerCase() === fnSBP)
        this.setState({ modProductPlans: shipmentCompartments });
    } else if (Array.isArray(vehicleCompartments)) {
      for (let i = 0; i < vehicleCompartments.length; i++) {
        let vehicleCompartment = vehicleCompartments[i];

        let shipmentCompartment = {};

        this.props.ShipmentType.toLowerCase() === fnSBC
          ? (shipmentCompartment = {
            ShipmentCode: "",
            CompartmentCode: vehicleCompartment.compCode,
            CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
            TrailerCode: vehicleCompartment.trailerCode,
            CompartmentSeqNoInTrailer: vehicleCompartment.trailerCompSeq,
            Quantity:
              vehicleCompartment.SFL !== null && vehicleCompartment.SFL !== ""
                ? vehicleCompartment.SFL.toLocaleString()
                : null,
            QuantityUOM: vehicleCompartment.UOM,
            OrderCode: null,
            ContractCode: null,
            CustomerCode: null,
            DestinationCode: null,
            FinishedProductCode: null,
            ShareholderCode: this.props.selectedShareholder,
            TransCompSequenceNumber: null,
            TransReceiptCode: null,
          })
          : (shipmentCompartment = {
            CompartmentCode: vehicleCompartment.compCode,
            CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
            TrailerCode: vehicleCompartment.trailerCode,
            Quantity:
              vehicleCompartment.SFL !== null && vehicleCompartment.SFL !== ""
                ? vehicleCompartment.SFL.toLocaleString()
                : null,
            UOM: vehicleCompartment.UOM,
            OrderCode: "",
            ContractCode: "",
            CustomerCode: "",
            DestinationCode: "",
            FinishedProductCode: "",
            ShareholderCode: this.props.selectedShareholder,
          });

        shipmentCompartments.push(shipmentCompartment);
      }
    }
    return shipmentCompartments;
  }

  getCompartmentDetailsFromVehicle(vehicleInfo) {
    let vehicleCompartments = [];
    let seqNum = 1;
    vehicleInfo.VehicleTrailers.sort((a, b) => a.TrailerSeq - b.TrailerSeq);

    vehicleInfo.VehicleTrailers.forEach((vehicleTrailer) => {
      if (Array.isArray(vehicleTrailer.Trailer.Compartments)) {
        vehicleTrailer.Trailer.Compartments.sort(
          (a, b) => a.CompartmentSeqNoInTrailer - b.CompartmentSeqNoInTrailer
        );
        for (let i = 0; i < vehicleTrailer.Trailer.Compartments.length; i++) {
          let trailerCompartment = vehicleTrailer.Trailer.Compartments[i];
          let vehicleCompartment = {
            compCode: trailerCompartment.Code,
            vehCompSeq: seqNum,
            trailerCode: trailerCompartment.TrailerCode,
            trailerCompSeq: trailerCompartment.CompartmentSeqNoInTrailer,
            SFL: trailerCompartment.Capacity,
            UOM: trailerCompartment.UOM,
          };
          vehicleCompartments.push(vehicleCompartment);
          seqNum = seqNum + 1;
        }
      }
    });

    return vehicleCompartments;
  }

  getLoadingDetails(shipmentRow) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentRow.ShipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetTruckShipmentLoadingDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        response.data.IsSuccess
          ? this.setState({
            modLoadingDetails: this.formLoadingCompartments(
              response.data.EntityResult
            ),
            staticLoadingDetails: response.data.EntityResult,
          })
          : this.setState({ modLoadingDetails: [], staticLoadingDetails: [] });
      })
      .catch((error) => {
        console.log(
          "Error while getting Shipment Loading Details:",
          error,
          shipmentRow
        );
      });
  }

  getLadenWeightData(
    RegisteredTareWeight,
    VehicleWeightUOM,
    WeightUOM,
    MaxLoadableWeight,
    Weight,
    siteConfiguration
  ) {
    let trailerWeighData = {};
    try {
      axios(
        RestAPIs.GetLadenWeightData +
        "?shipmentCode=" +
        this.state.modShipment.ShipmentCode +
        "&shCode=" +
        this.props.selectedShareholder +
        "&vehicleTareWeight=" +
        RegisteredTareWeight +
        "&vehicleWeightUOM=" +
        VehicleWeightUOM +
        "&weightUOM=" +
        WeightUOM +
        "&maxLoadableWeight=" +
        MaxLoadableWeight +
        "&weight=" +
        Weight,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            trailerWeighData = response.data.EntityResult;
            this.ValidateLadenWeight(trailerWeighData, siteConfiguration);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting Shipment trailer weigh data Details:",
            error,
            this.state.modShipment
          );
        });
    } catch (error) {
      console.log("Error in getLadenWeightData:", error);
    }
  }

  GetViewAllShipmentCustomData(shipmentRow) {
    try {
      var keyCode = [];
      if (shipmentRow !== undefined)
        keyCode = [
          {
            key: KeyCodes.shipmentCode,
            value: shipmentRow.ShipmentCode,
          },
          {
            key: KeyCodes.shipmentStatus,
            value: shipmentRow.Status,
          },
          {
            key: KeyCodes.vehicleCode,
            value: shipmentRow.VehicleCode,
          },
          {
            key: KeyCodes.actualTerminalCode,
            value: shipmentRow.ActualTerminalCode,
          },
        ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetViewAllShipmentCustomData,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            var result = response.data.EntityResult;
            if (shipmentRow !== undefined) {
              this.setState(
                {
                  saveEnabled:
                    result.IsLocalConnected === "TRUE"
                      ? false
                      : result.ShipmentUpdateAllow === "TRUE" &&
                        Utilities.isInFunction(
                          this.props.userDetails.EntityResult.FunctionsList,
                          functionGroups.modify,
                          this.props.ShipmentType.toLowerCase()
                        )
                        ? true
                        : this.state.isPlanned
                          ? result.DisableLoadingDetails === "TRUE"
                            ? false
                            : true
                          : result.ShipmentUpdateAllow === "TRUE" &&
                          Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            this.props.ShipmentType.toLowerCase()
                          ),
                  modCustomValues: response.data.EntityResult,
                },
                () => {
                  if (
                    response.data.EntityResult.CustomerInventory === "TRUE" &&
                    shipmentRow !== undefined
                  )
                    this.getCustomerInventory(shipmentRow);
                }
              );
            } else
              this.setState(
                {
                  modCustomValues: response.data.EntityResult,
                  saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    this.state.shipment.ShipmentCode === ""
                      ? functionGroups.add
                      : functionGroups.modify,
                    this.props.ShipmentType.toLowerCase()
                  ),
                },
                () => {
                  if (
                    response.data.EntityResult.CustomerInventory === "TRUE" &&
                    shipmentRow !== undefined
                  )
                    this.getCustomerInventory(shipmentRow);
                }
              );
          } else this.setState({ modCustomValues: {}, customerInventory: [] });
          //this.setState({ modLoadingDetails: this.formLoadingCompartments(response.data.EntityResult) })
        })
        .catch((error) => {
          console.log(
            "Error while getting shipment custom details:",
            error,
            shipmentRow
          );
        });
    } catch (error) {
      console.log("Error in Custom Data retrieve", error);
    }
  }

  getCustomerInventory(shipmentRow) {
    var keyCode = [
      {
        key: KeyCodes.dispatchCode,
        value: shipmentRow.ShipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.dispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetCustomerInventory,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        if (response.data.IsSuccess) {
          let customerInventory = response.data.EntityResult;
          if (
            customerInventory &&
            Array.isArray(customerInventory) &&
            customerInventory.length > 0
          ) {
            customerInventory.forEach((cus) => {
              cus.GrossActualQuantity =
                cus.GrossActualQuantity.toString() + " " + cus.QuantityUOM;
              cus.PlannedQuantity =
                cus.PlannedQuantity.toString() + " " + cus.QuantityUOM;
            });
          }
          this.setState({ customerInventory: response.data.EntityResult });
        } else this.setState({ customerInventory: [] });
        //this.setState({ modLoadingDetails: this.formLoadingCompartments(response.data.EntityResult) })
      })
      .catch((error) => {
        console.log(
          "Error while getting shipment custom details:",
          error,
          shipmentRow
        );
      });
  }

  getTrailerDetails(shipment) {
    try {
      var keyCode = [
        {
          key: KeyCodes.shipmentCode,
          value: shipment.ShipmentCode,
        },
        // {
        //     key: KeyCodes.trailerCode,
        //     value: shipment.VehicleCode
        // }
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
        Entity: this.state.trailers,
      };
      axios(
        RestAPIs.GetTrailerLoadingDetails,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let trailerDetails = [];
          if (response.data.IsSuccess) {
            trailerDetails = response.data.EntityResult;
            let shipmentTrailerAttribute = lodash.cloneDeep(
              this.state.attributeMetaDataList.SHIPMENTTRAILER
            );
            let shipmentWBAttribute = lodash.cloneDeep(
              this.state.attributeMetaDataList.SHIPMENTTRAILERWEIGHBRIDGE
            );

            trailerDetails.forEach((item) => {
              this.formReadOnlyAttributes(
                item.shipmentTrailerInfo.Attributes,
                shipmentTrailerAttribute
              );
              if (
                item.shipmentTrailerTWInfoList !== null &&
                item.shipmentTrailerTWInfoList !== undefined &&
                item.shipmentTrailerTWInfoList.length > 0
              )
                item.shipmentTrailerTWInfoList.AttributesforUI =
                  this.formReadonlyCompAttributes(
                    item.shipmentTrailerTWInfoList.Attributes,
                    shipmentWBAttribute
                  );
              else {
                let attribute = this.formReadonlyCompAttributes(
                  [],
                  shipmentWBAttribute
                );
                item.shipmentTrailerTWInfoList = [];
                this.setState({
                  selectedCompAttributes: attribute,
                });
              }

              if (
                item.shipmentTrailerWBInfoList !== null &&
                item.shipmentTrailerWBInfoList !== undefined &&
                item.shipmentTrailerWBInfoList.length > 0
              )
                item.shipmentTrailerWBInfoList.AttributesforUI =
                  this.formReadonlyCompAttributes(
                    item.shipmentTrailerWBInfoList.Attributes,
                    shipmentWBAttribute
                  );
              else item.shipmentTrailerWBInfoList = [];
            });
          }
          this.setState({
            trailerDetails: trailerDetails,
            isViewTrailerDetails: true,
          });
        })
        .catch((error) => {
          console.log("Error while getting Trailer details:", error);
        });
    } catch (error) {
      console.log("Error in get Trailer Details", error);
    }
  }

  formReadOnlyAttributes(attributes, attributeMetaDataList) {
    var selectedShipTrailerAttributeList = [];

    attributeMetaDataList.forEach(function (attributeMetaData) {
      var filledAttribute = attributes.find((trailerAttribute) => {
        return trailerAttribute.TerminalCode === attributeMetaData.TerminalCode;
      });
      if (filledAttribute !== undefined) {
        attributeMetaData.attributeMetaDataList.forEach(function (
          attributeMetaData
        ) {
          var valueAttribute = filledAttribute.ListOfAttributeData.find((x) => {
            return x.AttributeCode === attributeMetaData.Code;
          });
          if (valueAttribute !== undefined)
            attributeMetaData.DefaultValue = valueAttribute.AttributeValue;
        });
      }
      selectedShipTrailerAttributeList.push(attributeMetaData);
    });
    this.setState({
      selectedShipTrailerAttributeList: selectedShipTrailerAttributeList,
    });
  }

  formReadonlyCompAttributes(attributes, attributeMetaDataList) {
    let compAttributes = [];
    if (
      attributeMetaDataList !== null &&
      attributeMetaDataList !== undefined &&
      attributeMetaDataList.length > 0
    ) {
      attributeMetaDataList.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          //if (attribute.TerminalCode)
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName
              ? attribute.DisplayName
              : attribute.Code,
            AttributeValue: attribute.DefaultValue,
            TerminalCode: attribute.TerminalCode,
            IsMandatory: attribute.IsMandatory,
            DataType: attribute.DataType,
            IsReadonly: attribute.IsReadonly,
            MinValue: attribute.MinValue,
            MaxValue: attribute.MaxValue,
            ValidationFormat: attribute.ValidationFormat,
            compSequenceNo: "",
          });
        });
      });
    }

    if (
      attributes !== null &&
      attributes !== undefined &&
      attributes.length > 0
    ) {
      attributes.forEach((att) => {
        compAttributes.forEach((compAtt) => {
          if (compAtt.TerminalCode === att.TerminalCode) {
            att.ListOfAttributeData.forEach((selAtt) => {
              if (compAtt.AttributeCode === selAtt.AttributeCode)
                compAtt.AttributeValue = selAtt.AttributeValue;
            });
          }
        });
      });
    }

    return compAttributes;
  }

  toggleExpand = (data, open) => {
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.SeqNo === data.SeqNo
    );
    if (open) {
      expandedRows.splice(expandedRowIndex, 1);
    } else {
      expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };

  loadingToggleExpand = (data, open) => {
    let loadingExpandedRows = this.state.loadingExpandedRows;
    let expandedRowIndex = loadingExpandedRows.findIndex(
      (item) => item.SeqNumber === data.SeqNumber
    );
    if (open) {
      loadingExpandedRows.splice(expandedRowIndex, 1);
    } else {
      loadingExpandedRows.push(data);
    }
    this.setState({ loadingExpandedRows });
  };

  attributeToggleExpand = (data, open, isTerminalAdded = false) => {
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.SeqNumber === data.SeqNumber
    );
    if (open) {
      if (isTerminalAdded && expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
        expandedRows.push(data);
      } else if (expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
      }
    } else {
      if (expandedRowIndex >= 0) {
        expandedRows = expandedRows.filter(
          (x) => x.Code !== data.Code && x.SeqNumber !== data.SeqNumber
        );
      } else expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };

  formLoadingCompartments(loadingTables) {
    let noOfSignificantDigits = 0;
    let CustomValues = lodash.cloneDeep(this.state.modCustomValues);
    if (
      CustomValues !== null &&
      CustomValues["NumberOfSignificantDigits"] !== null &&
      CustomValues["NumberOfSignificantDigits"] !== undefined &&
      CustomValues["NumberOfSignificantDigits"] !== ""
    )
      noOfSignificantDigits = Utilities.convertStringtoDecimal(
        CustomValues["NumberOfSignificantDigits"]
      );
    let compartmentDetails = [];
    if (Array.isArray(loadingTables.Table1)) {
      loadingTables.Table1.forEach((comp) => {
        comp.TotalQuantity = this.state.isVolumeBased
          ? (comp.loadedquantity + comp.adjustedquantity).toString() +
          " " +
          comp.compartmentuom
          : (comp.loadedquantity + comp.adjustedquantity).toString() +
          " " +
          comp.compartmentuom +
          "\n( " +
          (
            comp.loadedquantity_volume + comp.adjustedquantity_volume
          ).toString() +
          comp.volumeuom +
          " )";
        comp.LeftQuantity =
          comp.revisedplannedquantity -
            (comp.loadedquantity + comp.adjustedquantity) <
            0
            ? "0 " + comp.compartmentuom
            : (
              comp.revisedplannedquantity -
              (comp.loadedquantity + comp.adjustedquantity)
            ).toString() +
            " " +
            comp.compartmentuom;
        comp.plannedquantity =
          (comp.plannedquantity === null
            ? "0"
            : comp.plannedquantity.toString()) +
          " " +
          comp.compartmentuom;
        comp.revisedplannedquantity =
          (comp.revisedplannedquantity === null
            ? "0"
            : comp.revisedplannedquantity.toString()) +
          " " +
          comp.compartmentuom;
        comp.loadedquantity = this.state.isVolumeBased
          ? comp.loadedquantity === null
            ? "0"
            : comp.loadedquantity.toString() + " " + comp.compartmentuom
          : comp.loadedquantity === null
            ? "0"
            : comp.loadedquantity.toString() +
            " " +
            comp.compartmentuom +
            "\n( " +
            comp.loadedquantity_volume +
            comp.volumeuom +
            " )";
        comp.adjustedquantity = this.state.isVolumeBased
          ? comp.adjustedquantity === null
            ? "0"
            : comp.adjustedquantity.toString() + " " + comp.compartmentuom
          : comp.adjustedquantity === null
            ? "0"
            : comp.adjustedquantity.toString() +
            " " +
            comp.compartmentuom +
            "\n( " +
            comp.adjustedquantity_volume +
            comp.volumeuom +
            " )";
      });
    }
    if (Array.isArray(loadingTables.Table2)) {
      loadingTables.Table2.forEach((comp) => {
        comp.TotalQuantity = this.state.isVolumeBased
          ? (comp.loadedquantity + comp.adjustedquantity).toString() +
          " " +
          comp.compartmentuom
          : (comp.loadedquantity + comp.adjustedquantity).toString() +
          " " +
          comp.compartmentuom +
          "\n( " +
          (
            comp.loadedquantity_volume + comp.adjustedquantity_volume
          ).toString() +
          comp.volumeuom +
          " )";
        comp.LeftQuantity =
          comp.revisedplannedquantity -
            (comp.loadedquantity + comp.adjustedquantity) <
            0
            ? "0 " + comp.compartmentuom
            : (
              comp.revisedplannedquantity -
              (comp.loadedquantity + comp.adjustedquantity)
            ).toString() +
            " " +
            comp.compartmentuom;
        comp.plannedquantity =
          comp.plannedquantity === null
            ? "0"
            : comp.plannedquantity.toString() + " " + comp.compartmentuom;
        comp.revisedplannedquantity =
          comp.revisedplannedquantity === null
            ? "0"
            : comp.revisedplannedquantity.toString() +
            " " +
            comp.compartmentuom;
        comp.loadedquantity = this.state.isVolumeBased
          ? comp.loadedquantity === null
            ? "0"
            : comp.loadedquantity.toString() + " " + comp.compartmentuom
          : comp.loadedquantity === null
            ? "0"
            : comp.loadedquantity.toString() +
            " " +
            comp.compartmentuom +
            "\n( " +
            comp.loadedquantity_volume +
            comp.volumeuom +
            " )";
        comp.adjustedquantity = this.state.isVolumeBased
          ? comp.adjustedquantity === null
            ? "0"
            : comp.adjustedquantity.toString() + " " + comp.compartmentuom
          : comp.adjustedquantity === null
            ? "0"
            : comp.adjustedquantity.toString() +
            " " +
            comp.compartmentuom +
            "\n( " +
            comp.adjustedquantity_volume +
            comp.volumeuom +
            " )";
      });
    }
    let trailers = [];
    if (Array.isArray(loadingTables.Table)) {
      loadingTables.Table.forEach((comp) => {
        let baseProductDetails = [];
        if (
          trailers.findIndex((item) => {
            return item === comp.trailercode;
          }) < 0
        )
          trailers.push(comp.trailercode);
        if (Array.isArray(loadingTables.Table1)) {
          let baseList = loadingTables.Table1.filter((baseProduct) => {
            return (
              baseProduct.finishedproductid === comp.FinishedProductID &&
              baseProduct.shipmentcompartmentid === comp.shipmentcompartmentid
            );
          });
          baseList.forEach((item) => {
            item.AdditiveProductDetails = loadingTables.Table2.filter(
              (advProduct) => {
                return (
                  item.baseproductid === advProduct.baseproductid &&
                  item.shipmentcompartmentid ===
                  advProduct.shipmentcompartmentid
                );
              }
            );
          });
          baseProductDetails = baseList;
        }
        compartmentDetails.push({
          Trailer_Code: comp.trailercode,
          Compartment_Code: comp.compartmentcode,
          Compartment_Status: comp.compartmentstatus,
          Finished_Product: comp.finishedproductcode,
          Planned_Quantity:
            (comp.PlannedQuantity === null
              ? "0"
              : comp.PlannedQuantity.toString()) +
            " " +
            comp.compartmentuom,
          Revised_Planned_Quantity:
            (comp.revisedplannedquantity === null
              ? "0"
              : comp.revisedplannedquantity.toString()) +
            " " +
            comp.compartmentuom,
          Loaded_Quantity: this.state.isVolumeBased
            ? Math.round(
              comp.loadedquantity + comp.adjustedquantity,
              noOfSignificantDigits
            ).toString() +
            " " +
            comp.compartmentuom
            : Math.round(
              comp.loadedquantity + comp.adjustedquantity,
              noOfSignificantDigits
            ).toString() +
            " " +
            comp.compartmentuom +
            "\n( " +
            Math.round(
              comp.loadedquantity_volume + comp.adjustedquantity_volume,
              noOfSignificantDigits
            ).toString() +
            comp.volumeuom +
            " )",
          Left_Quantity:
            comp.revisedplannedquantity -
              (comp.loadedquantity + comp.adjustedquantity) <
              0
              ? "0 " + comp.compartmentuom
              : Math.round(
                comp.revisedplannedquantity -
                (comp.loadedquantity + comp.adjustedquantity),
                noOfSignificantDigits
              ).toString() +
              " " +
              comp.compartmentuom,
          Adjust_Plan:
            comp.AdjustmentToPlannedQuantity === null
              ? ""
              : comp.AdjustmentToPlannedQuantity,
          Top_Up_Decant_Quantity:
            comp.TopUpDecantQuantity === null ? "" : comp.TopUpDecantQuantity,
          Top_Up_Decant_Quantity_Status: comp.TopUpDecantStatus,
          Compartment_UOM: comp.compartmentuom,
          Notes: comp.Notes ? "" : comp.Notes,
          BaseProductDetails: baseProductDetails,
          ShipmentID: comp.ShipmentID,
          CompartmentID: comp.CompartmentID,
          FinishedProductID: comp.FinishedProductID,
          ShipmentCompID: comp.shipmentcompartmentid,
          SeqNo: comp.seqno,
          Force_Complete:
            Constants.ShipmentCompartmentStatus[comp.compartmentstatus] ===
              Constants.ShipmentCompartmentStatus.FORCE_COMPLETED
              ? true
              : false,
          BlendState: comp.blendstate,
        });
      });
    }
    this.setState({ trailers: trailers });
    compartmentDetails = Utilities.addSeqNumberToListObject(compartmentDetails);

    return compartmentDetails;
  }

  getRecordWeightList() {
    axios(
      RestAPIs.GetWeighBridgeList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        this.setState({
          isRecordWeight: true,
          recordWeightList: result.EntityResult,
        });
      })
      .catch((error) => {
        console.log("Error while getting RecordWeightList:", error);
      });
  }

  getWeighBridge(siteConfiguration) {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetWeighBridge,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let weighBridge = result.EntityResult;

            this.getLadenWeightData(
              this.state.vehicleForRecordWeight.TareWeight, //RegisteredTareWeight
              this.state.vehicleForRecordWeight.WeightUOM, //VehicleWeightUOM
              weighBridge.WeightUOM,
              this.state.vehicleForRecordWeight.MaxLoadableWeight, // MaxLoadableWeight
              this.state.scadaValue, //Weight
              siteConfiguration
            );
          } else {
            console.log("Error in GetWeighBridge:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while GetWeighBridge:", error);
        });
    } catch (error) {
      console.log("Error in get GetWeighBridge", error);
    }
  }

  ValidateLadenWeight(ladenWeighData, siteConfiguration) {
    let notification = {
      messageType: "critical",
      message: "ViewAllShipment_Record_Weight",
      messageResultDetails: [],
    };

    var returnValue = true;

    try {
      let minLadenWeightTolerance =
        siteConfiguration.MinLadenweightQuantityTolerance;
      let maxLadenWeightTolerance =
        siteConfiguration.MaxLadenweightQuantityTolerance;

      var error = "";
      var minLadenWeightTol = 0;
      var maxLadenWeightTol = 0;

      if (isNaN(parseFloat(this.state.scadaValue))) {
        error = "MesuredWeight_Improper";
        returnValue = false;
      } else if (
        isNaN(parseFloat(ladenWeighData["ConvertedRegisteredTareWeight"]))
      ) {
        error = "Improper_Tare_Weight";
        returnValue = false;
      } else if (
        isNaN(parseFloat(ladenWeighData["ConvertedMaxLoadableWeight"]))
      ) {
        error = "Improper_Max_Weight";
        returnValue = false;
      } else if (
        isNaN(parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]))
      ) {
        error = "TareWeight_Not_Captured";
        returnValue = false;
      }
      if (returnValue === true) {
        minLadenWeightTol =
          ((parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
            parseFloat(ladenWeighData["ConvertedLoadedQty"])) *
            parseFloat(minLadenWeightTolerance)) /
          100;

        maxLadenWeightTol =
          ((parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
            parseFloat(ladenWeighData["ConvertedLoadedQty"])) *
            parseFloat(maxLadenWeightTolerance)) /
          100;

        if (
          (parseFloat(ladenWeighData["ConvertedLoadedQty"]) >
            parseFloat(ladenWeighData["ConvertedMaxLoadableWeight"])) |
          (parseFloat(this.state.scadaValue) >
            parseFloat(ladenWeighData["ConvertedMaxLoadableWeight"]) +
            parseFloat(ladenWeighData["ConvertedRegisteredTareWeight"]))
        ) {
          error = "ShipmentWeight_GreaterThan_MaxLoadableWeight";
        } else if (
          parseFloat(this.state.scadaValue) <
          parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
          parseFloat(ladenWeighData["ConvertedLoadedQty"]) -
          minLadenWeightTol
        ) {
          error = "MeasuredWeight_LessThan_ExpectedLoadedWeight";
        } else if (
          parseFloat(this.state.scadaValue) >
          parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
          parseFloat(ladenWeighData["ConvertedLoadedQty"]) +
          maxLadenWeightTol
        ) {
          error = "MeasuredWeight_MoreThan_ExpectedLoadedWeight";
        }
      } else {
        if (error !== "") {
          notification.messageResultDetails.push({
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: error,
          });
          this.setState({
            isLadenWeightValid: false,
          });
        }
        if (notification.messageResultDetails.length > 0) {
          this.props.onSaved(this.state.modShipment, "update", notification);
          return false;
        }
      }

      if (error !== "") {
        this.setState({
          isLadenWeightValid: true,
          ladenWeightError: error,
        });
      } else this.RecordLadenWeight();
    } catch (error) {
      console.log("Error while validating laden weight : ", error);
    }
    return returnValue;
  }

  RecordLadenWeight() {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
        {
          key: KeyCodes.weight,
          value: this.state.scadaValue,
        },
        {
          key: KeyCodes.vehicleCode,
          value: this.state.shipment.VehicleCode,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.shipment.ShipmentCode,
        },
        {
          key: KeyCodes.outOfToleranceAllowed,
          value: this.state.allowOutofRangeTW,
        },
      ];

      let notification = {
        messageType: "critical",
        message: "ViewAllShipment_Record_Weight",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.RecordShipmentLadenWeight,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          notification.messageType = response.data.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess =
            response.data.IsSuccess;
          if (response.data.IsSuccess) {
            this.setState({ isRecordWeight: false }, () => {
              this.getShipment(
                {
                  Common_Code: this.state.modShipment.ShipmentCode,
                },
                null,
                null,
                notification
              );
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              response.data.ErrorList[0];
            this.props.onSaved(this.state.modShipment, "update", notification);
          }
        })
        .catch((error) => {
          console.log("Error while recording laden weight:", error);
        });
    } catch (error) {
      console.log("Error in GetScadaValue");
    }
  }

  RecordTareWeight = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
        {
          key: KeyCodes.weight,
          value: this.state.scadaValue,
        },
        {
          key: KeyCodes.vehicleCode,
          value: this.state.shipment.VehicleCode,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.shipment.ShipmentCode,
        },
        {
          key: KeyCodes.outOfToleranceAllowed,
          value: this.state.allowOutofRangeTW,
        },
      ];

      let notification = {
        messageType: "critical",
        message: "ViewAllShipment_Record_Weight",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.RecordShipmentTareWeight,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          notification.messageType = response.data.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess =
            response.data.IsSuccess;
          if (response.data.IsSuccess) {
            this.setState({ isRecordWeight: false }, () => {
              this.getShipment(
                {
                  Common_Code: this.state.modShipment.ShipmentCode,
                },
                null,
                null,
                notification
              );
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              response.data.ErrorList[0];
            this.props.onSaved(this.state.modShipment, "update", notification);
          }
          // toast(
          //   <ErrorBoundary>
          //     <NotifyEvent notificationMessage={notification}></NotifyEvent>
          //   </ErrorBoundary>,
          //   {
          //     autoClose: notification.messageType === "success" ? 10000 : false,
          //   }
          // );
        })
        .catch((error) => {
          console.log("Error while recording tare weight:", error);
        });
    } catch (error) {
      console.log("Error in GetScadaValue");
    }
  };

  getScadaValue = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.ReadWBScadaValue,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let notification = {
            messageType: "critical",
            message: "ViewAllShipment_Record_Weight",
            messageResultDetails: [
              {
                keyFields: ["ShipmentCompDetail_ShipmentNumber"],
                keyValues: [this.state.shipment.ShipmentCode],
                isSuccess: false,
                errorMessage: "",
              },
            ],
          };

          notification.messageType = response.data.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess =
            response.data.IsSuccess;

          if (response.data.IsSuccess) {
            this.setState({ scadaValue: response.data.EntityResult });
          } else {
            notification.messageResultDetails[0].errorMessage =
              response.data.ErrorList[0];

            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting weigh brdige Scada value:", error);
        });
    } catch (error) {
      console.log("Error in GetScadaValue");
    }
  };

  printBOL = () => {
    let showPrintBOLAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showPrintBOLAuthenticationLayout }, () => {
      if (showPrintBOLAuthenticationLayout === false) {
        this.handlePrintBOL();
      }
    });
  };

  handlePrintBOL = () => {
    this.handleAuthenticationClose();
    let modShipment = lodash.cloneDeep(this.state.modShipment);

    let notification = {
      messageType: "critical",
      message: "ViewShipmentStatus_PrintBOL_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modShipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    this.props.handlePrintBOL(
      modShipment.ShipmentCode,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        notification.messageResultDetails[0].errorMessage = result.ErrorList[0];
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    );
  };

  printFAN = () => {
    let showFANAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showFANAuthenticationLayout }, () => {
      if (showFANAuthenticationLayout === false) {
        this.handlePrintFAN();
      }
    });
  };

  handlePrintFAN = () => {
    this.handleAuthenticationClose();
    let modShipment = lodash.cloneDeep(this.state.modShipment);

    let notification = {
      messageType: "critical",
      message: "ViewShipmentStatus_PrintFAN_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modShipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    this.props.handlePrintFAN(
      modShipment.ShipmentCode,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        notification.messageResultDetails[0].errorMessage = result.ErrorList[0];
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    );
  };

  allowToLoad = () => {
    let showAllowToLoadAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showAllowToLoadAuthenticationLayout }, () => {
      if (showAllowToLoadAuthenticationLayout === false) {
        this.handleAllowToLoad();
      }
    });
  };

  handleAllowToLoad = () => {
    this.handleAuthenticationClose();

    let modShipment = lodash.cloneDeep(this.state.modShipment);
    let notification = {
      messageType: "critical",
      message: "ViewShipment_AllowToLoad_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modShipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    this.props.handleAllowToLoad(
      modShipment,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getShipment(
            { Common_Code: modShipment.ShipmentCode },
            null,
            null,
            notification
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.props.onSaved(modShipment, "update", notification);
        }
      }
    );
  };

  confirmAllowToLoad = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isNotRevised} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("ViewShipment_ConfirmAllowToLoad")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isNotRevised: false }, () => {
                    this.allowToLoad();
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isNotRevised: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmDeAllocateBay = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isDeAllocateBay} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>
                  {t("ViewAllocateBay_ConfirmDeallocateBay", [
                    this.state.ShipmentBay,
                    "Shipment",
                  ])}
                </h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                className="cancelButton"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isDeAllocateBay: false });
                }}
              />
              <Button
                type="primary"
                content={t("ViewAllocateBay_Deallocate")}
                onClick={() => {
                  this.setState({ isDeAllocateBay: false }, () => {
                    this.DeAllocateBay(
                      this.state.shipment.ShipmentCode,
                      "SHIPMENT",
                      this.state.ShipmentBay
                    );
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmRecordLadenWeight = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isLadenWeightValid} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>
                  {t(this.state.ladenWeightError) +
                    t("ConfirmCaptureLadenWeight")}
                </h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isLadenWeightValid: false }, () => {
                    this.RecordLadenWeight();
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isLadenWeightValid: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmVehicleBond = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.vehicleBondPopUp} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("ShipmentBonded_VehicleNonBonded")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({
                    vehicleBondPopUp: false,
                    stockProducts: true,
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ vehicleBondPopUp: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmBondedStockProducts = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.stockProducts} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("ShipmentBonded_StockProducts")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ stockProducts: false }, () => {
                    this.saveShipment();
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmVehicleBondExpiryDate = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.vehicleBondExpiryPopUp} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("ShipmentBonded_VehicleBondExpiryDate")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({
                    vehicleBondExpiryPopUp: false,
                    stockProducts: true,
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ vehicleBondExpiryPopUp: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  handleRecordWeight = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isRecordWeight} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewAllShipment_RecordWeightShipment") +
                    " : " +
                    this.state.shipment.ShipmentCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-9">
                  <Select
                    fluid
                    placeholder={t("Select_WB")}
                    label={t("ViewShipment_WeighBridgeCode")}
                    value={this.state.weighBridgeCode}
                    options={Utilities.transferListtoOptions(
                      this.state.recordWeightList
                    )}
                    onChange={(cellData) => {
                      this.setState({ weighBridgeCode: cellData }, () =>
                        this.getScadaValue()
                      );
                    }}
                  />
                </div>
                <div className="shipmentRecordWeightButtonDiv">
                  <Button
                    type="primary"
                    size="small"
                    className="shipmentRecordWeightButton"
                    content={t("ViewShipment_ReadWeight")}
                    onClick={() => this.getScadaValue()}
                    disabled={
                      this.state.weighBridgeCode === null ||
                        this.state.weighBridgeCode === "" ||
                        this.state.weighBridgeCode === undefined
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.scadaValue}
                    label={t("ViewShipment_Weight")}
                    reserveSpace={false}
                    disabled={true}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Checkbox
                    className="LabelEnabled"
                    label={t("Allow_Out_of_Tolerance_for_TW")}
                    checked={this.state.allowOutofRangeTW}
                    onChange={(cellData) => {
                      this.setState({ allowOutofRangeTW: cellData });
                    }}
                    disabled={false}
                  />
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                className="shipmentRecordWeightOtherbuttons"
                content={t("ViewShipment_RecordTareWeight")}
                onClick={() => this.RecordTareWeight()}
                disabled={
                  this.state.scadaValue === null ||
                    this.state.scadaValue === "" ||
                    this.state.scadaValue === undefined
                    ? true
                    : false
                }
              />
              <Button
                type="primary"
                content={t("ViewShipment_RecordLadenWeight")}
                className="shipmentRecordWeightOtherbuttons"
                onClick={() => this.getSiteConfigurationLookUP()}
                disabled={
                  this.state.scadaValue === null ||
                    this.state.scadaValue === "" ||
                    this.state.scadaValue === undefined
                    ? true
                    : false
                }
              />
              <Button
                type="primary"
                content={t("Cancel")}
                className="shipmentRecordWeightOtherbuttons"
                onClick={() => {
                  this.setState({
                    isRecordWeight: false,
                    weighBridgeCode: "",
                    scadaValue: "",
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  handleStatus = (e) => {
    if (e === Constants.ShipmentCompartmentStatus.EMPTY) {
      return "EMPTY";
    } else if (e === Constants.ShipmentCompartmentStatus.LOADING) {
      return "LOADING";
    } else if (e === Constants.ShipmentCompartmentStatus.PART_FILLED) {
      return "PART_FILLED";
    } else if (e === Constants.ShipmentCompartmentStatus.OVER_FILLED) {
      return "OVER_FILLED";
    } else if (e === Constants.ShipmentCompartmentStatus.FORCE_COMPLETED) {
      return "FORCE_COMPLETED";
    } else if (e === Constants.ShipmentCompartmentStatus.COMPLETED) {
      return "COMPLETED";
    } else if (e === Constants.ShipmentCompartmentStatus.INTERRUPTED) {
      return "INTERRUPTED";
    } else {
      return "";
    }
  };

  closeShipment = () => {
    let showCloseShipmentAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showCloseShipmentAuthenticationLayout }, () => {
      if (showCloseShipmentAuthenticationLayout === false) {
        this.handleShipmentClose();
      }
    });
  };

  handleShipmentClose = () => {
    this.handleAuthenticationClose();
    try {
      let entity = this.formTopUpDecantRequest(
        Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED,
        "FORCECLOSE"
      );
      let notification = {
        messageType: "critical",
        message: "ViewAllShipment_ShipmentClose",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      var keyCode = [
        {
          key: KeyCodes.shareholderCode,
          value: this.props.selectedShareholder,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.modShipment.ShipmentCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
        Entity: entity,
      };
      axios(
        RestAPIs.CloseShipment,
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
            this.getShipment(
              { Common_Code: this.state.shipment.ShipmentCode },
              null,
              null,
              notification
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.props.onSaved(this.state.modShipment, "update", notification);
          }
          // toast(
          //   <ErrorBoundary>
          //     <NotifyEvent notificationMessage={notification}></NotifyEvent>
          //   </ErrorBoundary>,
          //   {
          //     autoClose: notification.messageType === "success" ? 10000 : false,
          //   }
          // );
        })
        .catch((error) => {
          console.log("Error while CloseShipment:", error);
        });
    } catch (error) {
      console.log("Error while closing the shipment:", error);
    }
  };

  confirmAllocateBay = () => {
    let bayData = lodash.cloneDeep(this.state.bayData);
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isAllocateBay} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewAllocateBay_AllocateBay")} -{" "}
                  {this.state.shipment.ShipmentCode}
                </h3>
              </div>
              <div className="col-12 detailsTable">
                <DataTable
                  className="iconblock"
                  data={bayData}
                  selection={this.state.selectBay}
                  selectionMode="single"
                  showHeader={true}
                  onSelectionChange={(e) => this.setState({ selectBay: e })}
                  rows={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize
                  }
                  resizableColumns={true}
                >
                  {/* <DataTable.ActionBar /> */}
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field={"BayCode"}
                    header={t("ViewAllocateBay_BayCode")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field={"AssociatedProduct"}
                    header={t("ViewAllocateBay_FinishProduct")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field="CurrentQueue"
                    header={t("ViewAllocateBay_CurrentQueue")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field="MaximumQueue"
                    header={t("ViewAllocateBay_MaximumQueue")}
                    editable={false}
                  />
                  {Array.isArray(bayData) &&
                    bayData.length >
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize ? (
                    <DataTable.Pagination />
                  ) : (
                    ""
                  )}
                </DataTable>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("MarineEOD_Close")}
                className="cancelButton"
                onClick={() => this.setState({ isAllocateBay: false })}
              />
              <Button
                type="primary"
                content={t("ViewAllocateBay_Allocate")}
                onClick={() => {
                  if (
                    this.state.selectBay === null ||
                    this.state.selectBay === undefined ||
                    this.state.selectBay.length === 0
                  ) {
                    let notification = {
                      messageType: "critical",
                      message: "ViewAllocateBay_Allocate",
                      messageResultDetails: [
                        {
                          keyFields: ["BayCode"],
                          keyValues: [],
                          isSuccess: false,
                          errorMessage: "ViewAllocateBay_bayrequired",
                        },
                      ],
                    };

                    toast(
                      <ErrorBoundary>
                        <NotifyEvent
                          notificationMessage={notification}
                        ></NotifyEvent>
                      </ErrorBoundary>,
                      {
                        autoClose:
                          notification.messageType === "success"
                            ? 10000
                            : false,
                      }
                    );
                  } else {
                    this.AllocateBay(
                      this.state.shipment.ShipmentCode,
                      this.state.selectBay[0].BayCode,
                      "SHIPMENT"
                    );
                  }
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  /**
   *
   * @param {*} shipmentCode
   * @param {*} bayCode
   * @param {*} entityType:shipment or receipt
   */
  AllocateBay(shipmentCode, bayCode, entityType) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
      {
        key: KeyCodes.bayCode,
        value: bayCode,
      },
      {
        key: KeyCodes.entityType,
        value: entityType,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    let notification = {
      messageType: "critical",
      message: "BayAllocation_SaveStatus",
      messageResultDetails: [
        {
          keyFields: ["BayCode"],
          keyValues: [bayCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.AllocateBay,
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
          this.getShipment(
            { Common_Code: this.state.shipment.ShipmentCode },
            null,
            null,
            notification
          );
          this.setState({ isAllocateBay: false });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ResultDataList[0].ErrorList[0];
          this.props.onSaved(this.state.modShipment, "update", notification);
        }
      })
      .catch((error) => {
        console.log("Error while AllocateBay:", error);
      });
  }

  GetBayByTrnsaction(TrnsactionCode, TrnsactionType, shareholder) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: TrnsactionCode,
      },
      {
        key: KeyCodes.TransactionType,
        value: TrnsactionType,
      },
    ];
    var obj = {
      ShareHolderCode: shareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetBayAllocatedInfoByTransaction,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      ),
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          this.setState({
            ShipmentBay: result.EntityResult.BayCode,
          });
        }
      })
      .catch((error) => {
        console.log("Error while GetBayByTrnsaction:", error);
      });
  }

  DeAllocateBay(shipmentCode, entityType, bayCode) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
      {
        key: KeyCodes.entityType,
        value: entityType,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
    };
    let notification = {
      messageType: "critical",
      message: "BayDeAllocation_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["BayCode"],
          keyValues: [bayCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.DeallocateShipment,
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
          this.getShipment(
            { Common_Code: this.state.shipment.ShipmentCode },
            null,
            null,
            notification
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.props.onSaved(this.state.modShipment, "update", notification);
        }
      })
      .catch((error) => {
        console.log("Error while DeAllocateBay:", error);
      });
  }

  UpdateShipmentCompartmentInfo() {
    let entity = this.formCompartmentDetailsRequest();
    let notification = {
      messageType: "critical",
      message: "ViewAllShipment_ShipmentCompartmentUpdate",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [this.state.shipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: this.props.selectedShareholder,
      },
      {
        key: KeyCodes.shipmentCode,
        value: this.state.modShipment.ShipmentCode,
      },
      {
        key: "ScheduledDate",
        value: this.state.modShipment.ScheduledDate,
      },
      {
        key: "ShipmentUOM",
        value: this.state.modShipment.ShipmentQuantityUOM,
      },
      {
        key: KeyCodes.carrierCode,
        value: this.state.modShipment.CarrierCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
      Entity: entity,
    };
    axios(
      RestAPIs.UpdateShipmentCompartmentDetails,
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
          this.getShipment({ Common_Code: this.state.shipment.ShipmentCode });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
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
        console.log("Error while updating shipment compartments : ", error);
      });
  }

  handleTopUpDecantApproval = (actionName, buttonName) => {
    if (actionName === "SaveCompartment") this.UpdateShipmentCompartmentInfo();
    else if (actionName === "Approve") this.ApproveTopUpDecant(buttonName);
  };

  ApproveTopUpDecant(buttonName) {
    let entity = {
      topUpDecantApprovalStatus: "",
      topUpDecantEnabled: "",
      Remarks: "",
      listShipmentCompartmentInfo: [],
      listShipmentLoadingCompData: [],
    };

    entity.Remarks = buttonName;

    let notification = {
      messageType: "critical",
      message: "ViewAllShipment_ApproveTopUpDecant",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [this.state.shipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    let validateResult = this.ValidateTopUpDecant();
    if (validateResult.isValid) {
      if (buttonName === "ViewShipmentTopUpDecant_SubmitForApproved") {
        let TopUpRequest = this.formTopUpDecantRequest(
          Constants.TopUpDecantApprovalStatus.SUBMITTED,
          null
        );
        entity.listShipmentCompartmentInfo =
          TopUpRequest.listShipmentCompartmentInfo;
      }
      //else if (btnSubmitForApproval.Text.ToUpper().Contains("APPROVE"))
      else if (buttonName === "ViewShipmentTopUpDecant_AutoApproved") {
        let TopUpRequest = this.formTopUpDecantRequest(
          Constants.TopUpDecantApprovalStatus.AUTO_APPROVED,
          null
        );
        entity.listShipmentCompartmentInfo =
          TopUpRequest.listShipmentCompartmentInfo;
      }

      var keyCode = [
        {
          key: KeyCodes.shareholderCode,
          value: this.props.selectedShareholder,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.modShipment.ShipmentCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
        Entity: entity,
      };
      axios(
        RestAPIs.ApproveTopUpDecant,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.getShipment({
              Common_Code: this.state.modShipment.ShipmentCode,
            });
          }
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
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
          console.log("Error while aproving top up decant : ", error);
        });
    } else {
      notification.messageResultDetails[0].isSuccess = false;
      notification.messageResultDetails[0].errorMessage =
        validateResult.errorMessage;
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    }
  }

  ValidateTopUpDecant() {
    let result = {
      isValid: true,
      errorMessage: "",
    };
    let modLoadingDetails = lodash.cloneDeep(this.state.modLoadingDetails);

    let dTopUpQty = 0;
    let dLeftQty = 0;
    let dTotalQty = 0;
    let dMTQ =
      this.state.modCustomValues["TopUpDecantMTQ"] === ""
        ? 0
        : Utilities.convertStringtoDecimal(
          this.state.modCustomValues["TopUpDecantMTQ"]
        );

    modLoadingDetails.forEach((item) => {
      if (
        item.Left_Quantity !== null &&
        item.Left_Quantity !== "" &&
        item.Left_Quantity !== undefined &&
        item.Top_Up_Decant_Quantity !== null &&
        item.Top_Up_Decant_Quantity !== "" &&
        item.Top_Up_Decant_Quantity !== undefined &&
        item.Loaded_Quantity !== null &&
        item.Loaded_Quantity !== "" &&
        item.Loaded_Quantity !== undefined
      ) {
        let sLeftQty = "";
        let sTotalQty = "";
        if (
          item.Left_Quantity !== null &&
          item.Left_Quantity !== "" &&
          item.Left_Quantity !== undefined
        ) {
          sLeftQty = item.Left_Quantity;
          //Seperate Left Quantity value from UOM
          let matchLeft = sLeftQty.split(" ");
          sLeftQty = matchLeft[0].trim();

          dLeftQty = Utilities.convertStringtoDecimal(sLeftQty);
        }
        if (
          item.Loaded_Quantity !== null &&
          item.Loaded_Quantity !== "" &&
          item.Loaded_Quantity !== undefined
        ) {
          sTotalQty = item.Loaded_Quantity;
          //Seperate Total Quantity value from UOM
          let matchTotal = sTotalQty.split(" ");
          sTotalQty = matchTotal[0].trim();

          dTopUpQty = Utilities.convertStringtoDecimal(
            item.Top_Up_Decant_Quantity
          );
          dTotalQty = Utilities.convertStringtoDecimal(sTotalQty);
        }

        if (dTopUpQty > 0) {
          if (Math.round(dTopUpQty, 2) > Math.round(dMTQ, 2)) {
            result.isValid = false;
            result.errorMessage = "ViewShipment_TopUpDecant_GreaterThanMTQ";
            // notification.messageResultDetails[0].errorMessage = "ViewShipment_TopUpDecant_GreaterThanMTQ"
            // toast(
            //   <ErrorBoundary>
            //     <NotifyEvent notificationMessage={notification}></NotifyEvent>
            //   </ErrorBoundary>,
            //   {
            //     autoClose:
            //       notification.messageType === "success" ? 10000 : false,
            //   }
            // );
            // return false;
          } else if (Math.round(dLeftQty, 2) > Math.round(dMTQ, 2)) {
            result.isValid = false;
            result.errorMessage =
              "ViewShipment_TopUpDecant_LessQtyGreaterThanMTQ";
            // notification.messageResultDetails[0].errorMessage = "ViewShipment_TopUpDecant_LessQtyGreaterThanMTQ"
            // toast(
            //   <ErrorBoundary>
            //     <NotifyEvent notificationMessage={notification}></NotifyEvent>
            //   </ErrorBoundary>,
            //   {
            //     autoClose:
            //       notification.messageType === "success" ? 10000 : false,
            //   }
            // );
            // return false;
          }
        } else {
          if (Math.abs(dTopUpQty) > Math.round(dTotalQty, 2)) {
            result.isValid = false;
            result.errorMessage =
              "ViewShipment_TopUpDecant_DecantGreaterThanLoadedQty";

            // notification.messageResultDetails[0].errorMessage = "ViewShipment_TopUpDecant_DecantGreaterThanLoadedQty"
            // toast(
            //   <ErrorBoundary>
            //     <NotifyEvent notificationMessage={notification}></NotifyEvent>
            //   </ErrorBoundary>,
            //   {
            //     autoClose:
            //       notification.messageType === "success" ? 10000 : false,
            //   }
            // );
            // return false;
          }
        }
      }
    });
    return result;
  }

  formCompartmentDetailsRequest() {
    let ViewAllTruckShipmentLoadingDetails = {
      topUpDecantApprovalStatus: "",
      topUpDecantEnabled: "",
      Remarks: "",
      listShipmentCompartmentInfo: [],
      listShipmentLoadingCompData: [],
      ddlTopUpDecantApprovalStatus: null,
      isAdjustedFP: 0,
    };
    try {
      //let loadingDetails = lodash.cloneDeep(this.state.staticLoadingDetails)
      let modLoadingDetails = lodash.cloneDeep(this.state.modLoadingDetails);
      let ddlTopUpDecantStatus = lodash.cloneDeep(
        this.state.ddlTopUpDecantStatus
      );

      ViewAllTruckShipmentLoadingDetails.topUpDecantApprovalStatus =
        this.state.modCustomValues.TopUpDecantStatusText;
      ViewAllTruckShipmentLoadingDetails.topUpDecantEnabled =
        this.state.modCustomValues.EnableTopUpDecant;
      ViewAllTruckShipmentLoadingDetails.Remarks = this.state.reasonForClosure;

      let count = 0;

      if (ddlTopUpDecantStatus === null) {
        let bForceCompChecked = false;
        ViewAllTruckShipmentLoadingDetails.ddlTopUpDecantApprovalStatus = null;
        modLoadingDetails.forEach((comp) => {
          let ShipmentLoadingCmptData = {
            AdjustQuantity: 0,
            ForceCompleted: false,
            TrailerCode: "",
            CompartmentCode: "",
            AdjustmentToPlannedQuantity: 0,
            Density: 0,
            DensityUOM: "",
          };
          let isUpdated = false;
          if (comp.Adjust_Plan !== "") {
            ShipmentLoadingCmptData.AdjustmentToPlannedQuantity =
              Utilities.convertStringtoDecimal(comp.Adjust_Plan);
            count = count + 1;
            isUpdated = true;
          }
          if (comp.Force_Complete) {
            ShipmentLoadingCmptData.ForceCompleted = true;
            isUpdated = true;
            bForceCompChecked = true;
          }
          ShipmentLoadingCmptData.ShipmentCompartmentID = comp.ShipmentCompID;
          ShipmentLoadingCmptData.FinishedProductID = comp.FinishedProductID;
          ShipmentLoadingCmptData.TrailerCode = comp.Trailer_Code;
          ShipmentLoadingCmptData.CompartmentCode = comp.Compartment_Code;

          if (isUpdated)
            ViewAllTruckShipmentLoadingDetails.listShipmentLoadingCompData.push(
              ShipmentLoadingCmptData
            );
        });
        if (count > 0) ViewAllTruckShipmentLoadingDetails.isAdjustedFP = count;

        if (ViewAllTruckShipmentLoadingDetails.topUpDecantEnabled === "TRUE") {
          //Add condition to Force complete for Topup decant
          if (
            bForceCompChecked === true &&
            (ViewAllTruckShipmentLoadingDetails.topUpDecantApprovalStatus !==
              Constants.TopUpDecantApprovalStatus.NONE ||
              ViewAllTruckShipmentLoadingDetails.topUpDecantApprovalStatus !==
              Constants.TopUpDecantApprovalStatus.COMPLETED ||
              ViewAllTruckShipmentLoadingDetails.topUpDecantApprovalStatus !==
              Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED)
          ) {
            let topUpRequest = this.formTopUpDecantRequest(
              Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED,
              Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED
            );
            ViewAllTruckShipmentLoadingDetails.listShipmentCompartmentInfo =
              topUpRequest.listShipmentCompartmentInfo;
          }
        }
      } else {
        if (ViewAllTruckShipmentLoadingDetails.topUpDecantEnabled === "TRUE") {
          let modCustomValues = lodash.cloneDeep(this.state.modCustomValues);
          modCustomValues["TopUpDecantStatusDropDownVisible"] = "FALSE";
          this.setState({ modCustomValues });

          if (
            ddlTopUpDecantStatus ===
            Constants.TopUpDecantApprovalStatus.REQUEST_APPROVE
          ) {
            let topUpRequest = this.formTopUpDecantRequest(
              Constants.TopUpDecantApprovalStatus.APPROVED,
              null
            );
            ViewAllTruckShipmentLoadingDetails.listShipmentCompartmentInfo =
              topUpRequest.listShipmentCompartmentInfo;
            this.setState({ ddlTopUpDecantStatus: null });
          } else if (
            ddlTopUpDecantStatus ===
            Constants.TopUpDecantApprovalStatus.REQUEST_REJECT
          ) {
            let topUpRequest = this.formTopUpDecantRequest(
              Constants.TopUpDecantApprovalStatus.REJECTED,
              null
            );
            ViewAllTruckShipmentLoadingDetails.listShipmentCompartmentInfo =
              topUpRequest.listShipmentCompartmentInfo;
            this.setState({ ddlTopUpDecantStatus: null });
          }
        }
      }
    } catch (error) {
      console.log("Error while forming top up decant details:", error);
    }
    return ViewAllTruckShipmentLoadingDetails;
  }

  formTopUpDecantRequest(strStatus, strSource) {
    let ViewAllTruckShipmentLoadingDetails = {
      topUpDecantApprovalStatus: "",
      topUpDecantEnabled: "",
      Remarks: "",
      listShipmentCompartmentInfo: [],
      listShipmentLoadingCompData: [],
    };
    try {
      let loadingDetails = lodash.cloneDeep(this.state.staticLoadingDetails);
      let modLoadingDetails = lodash.cloneDeep(this.state.modLoadingDetails);

      ViewAllTruckShipmentLoadingDetails.topUpDecantApprovalStatus =
        this.state.modCustomValues.TopUpDecantStatusText;
      ViewAllTruckShipmentLoadingDetails.topUpDecantEnabled =
        this.state.modCustomValues.EnableTopUpDecant;
      ViewAllTruckShipmentLoadingDetails.Remarks = this.state.reasonForClosure;

      //let strStatus = Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED;
      //let strSource = "FORCECLOSE";
      let strLastUpdatedBy =
        this.props.userDetails.EntityResult.Firstname +
        " " +
        this.props.userDetails.EntityResult.LastName;

      modLoadingDetails.forEach((comp) => {
        let submitBtnName =
          this.state.modCustomValues["f_ViewShipTopUpDecantApprovalAccess"] ===
            "TRUE"
            ? "ViewShipmentTopUpDecant_AutoApproved"
            : "ViewShipmentTopUpDecant_SubmitForApproved";

        if (this.state.modCustomValues["TopUpDecantApprovalEnabled"] === "TRUE")
          submitBtnName = "ViewShipmentTopUpDecant_AutoApproved";

        let strTopUpDecCompartmentStatus = "";

        let shcompTopUpDecant = {
          TopUpDecantQuantity: null,
          QuantityUOM: "",
          Comments: "",
          Status: "",
          CreatedBy: "",
          CreatedTime: "",
          LastUpdatedBy: "",
          LastUpdatedTime: "",
        };

        let shipmentCompartmentinfo = {
          TrailerCode: "",
          ShipmentCompartmentStatus: "",
          CompartmentCode: "",
          ShipmentCompartmentTopUpDecantingInfo: "",
        };

        if (
          comp.Top_Up_Decant_Quantity !== null &&
          comp.Top_Up_Decant_Quantity !== undefined &&
          comp.Top_Up_Decant_Quantity !== ""
        ) {
          if (
            comp.Top_Up_Decant_Quantity_Status !== null &&
            comp.Top_Up_Decant_Quantity_Status !== undefined &&
            comp.Top_Up_Decant_Quantity_Status !== ""
          ) {
            strTopUpDecCompartmentStatus = comp.Top_Up_Decant_Quantity_Status;
          } else {
            strTopUpDecCompartmentStatus =
              Constants.TopUpDecantApprovalStatus.NONE;
          }

          if (
            strTopUpDecCompartmentStatus ===
            Constants.TopUpDecantApprovalStatus.NONE &&
            strStatus !== Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED
          ) {
            shcompTopUpDecant.TopUpDecantQuantity =
              Utilities.convertStringtoDecimal(comp.Top_Up_Decant_Quantity);

            //  shcompTopUpDecant.TopUpDecantQuantity = Convert.ToDouble(urTpDRow.Items.FindItemByKey("TopUpDecantQuantity").Value.ToString().Trim());
            shipmentCompartmentinfo.TrailerCode = comp.Trailer_Code;
            shipmentCompartmentinfo.ShipmentCompartmentStatus =
              Constants.ShipmentCompartmentStatus[comp.Compartment_Status];
            shipmentCompartmentinfo.CompartmentCode = comp.Compartment_Code;
            //strCompartmentCode = shipmentCompartmentinfo.CompartmentCode + "&";
            shcompTopUpDecant.Status = strStatus;

            shcompTopUpDecant.QuantityUOM = comp.Compartment_UOM;
            if (
              comp.Notes !== null &&
              comp.Notes !== undefined &&
              comp.Notes !== ""
            ) {
              shcompTopUpDecant.Comments = comp.Notes;
            } else {
              shcompTopUpDecant.Comments = "";
            }
            shcompTopUpDecant.LastUpdatedBy = strLastUpdatedBy;
            shipmentCompartmentinfo.ShipmentCompartmentTopUpDecantingInfo =
              shcompTopUpDecant;
            ViewAllTruckShipmentLoadingDetails.listShipmentCompartmentInfo.push(
              shipmentCompartmentinfo
            );
            //lstShCompartInfo.push(shipmentCompartmentinfo);
          }
          //If status marked was FORCE_COMPLETED
          else if (
            strTopUpDecCompartmentStatus !==
            Constants.TopUpDecantApprovalStatus.NONE &&
            strStatus === Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED
          ) {
            loadingDetails.Table.forEach((item) => {
              if (item.compartmentcode === comp.Compartment_Code) {
                //This if from the button CLOSE SHIPMENT
                if (strSource === "FORCECLOSE") {
                  shcompTopUpDecant.TopUpDecantQuantity =
                    Utilities.convertStringtoDecimal(item.TopUpDecantQuantity);
                  shcompTopUpDecant.Comments = item.Notes;
                  shcompTopUpDecant.Status = strStatus;
                  shcompTopUpDecant.LastUpdatedBy = strLastUpdatedBy;
                  shipmentCompartmentinfo.TrailerCode = item.trailercode;
                  shipmentCompartmentinfo.ShipmentCompartmentStatus =
                    Constants.ShipmentCompartmentStatus[item.compartmentstatus];
                  shipmentCompartmentinfo.CompartmentCode =
                    item.compartmentcode;
                  //strCompartmentCode = shipmentCompartmentinfo.CompartmentCode + "&";
                  shcompTopUpDecant.QuantityUOM = item.compartmentuom;
                  shipmentCompartmentinfo.ShipmentCompartmentTopUpDecantingInfo =
                    shcompTopUpDecant;
                  ViewAllTruckShipmentLoadingDetails.listShipmentCompartmentInfo.push(
                    shipmentCompartmentinfo
                  );
                  //lstShCompartInfo.Add(shipmentCompartmentinfo);
                }
                //This is called from the FORCE_COMPLETE checkbox in a compartment
                else if (
                  strSource ===
                  Constants.TopUpDecantApprovalStatus.FORCE_COMPLETED
                ) {
                  if (comp.Force_Complete) {
                    shcompTopUpDecant.TopUpDecantQuantity =
                      Utilities.convertStringtoDecimal(
                        item.TopUpDecantQuantity
                      );

                    // shcompTopUpDecant.TopUpDecantQuantity = Convert.ToDouble(dr["TopUpDecantQuantity"].ToString());
                    shcompTopUpDecant.Comments = item.Notes;
                    shcompTopUpDecant.Status = strStatus;
                    shcompTopUpDecant.LastUpdatedBy = strLastUpdatedBy;
                    shipmentCompartmentinfo.TrailerCode = item.trailercode;
                    shipmentCompartmentinfo.ShipmentCompartmentStatus =
                      Constants.ShipmentCompartmentStatus[
                      item.compartmentstatus
                      ];
                    shipmentCompartmentinfo.CompartmentCode =
                      item.compartmentcode;
                    //strCompartmentCode = shipmentCompartmentinfo.CompartmentCode + "&";
                    shcompTopUpDecant.QuantityUOM = item.compartmentuom;
                    shipmentCompartmentinfo.ShipmentCompartmentTopUpDecantingInfo =
                      shcompTopUpDecant;
                    ViewAllTruckShipmentLoadingDetails.listShipmentCompartmentInfo.push(
                      shipmentCompartmentinfo
                    );
                  }
                }
              }
            });
          } else {
            let dTopUpDec = 0;
            dTopUpDec = Utilities.convertStringtoDecimal(
              comp.Top_Up_Decant_Quantity
            );

            if (dTopUpDec > 0 || dTopUpDec < 0) {
              let strComments = "";
              if (
                comp.Notes !== null &&
                comp.Notes !== undefined &&
                comp.Notes !== ""
              ) {
                strComments = comp.Notes;
              }
              //Compare each value in grid against the existing dataset
              //This is to verify and update the quantity, notes or status for topup decant request
              loadingDetails.Table.forEach((item) => {
                if (item.compartmentcode === comp.Compartment_Code) {
                  let DecanQty =
                    item.TopUpDecantQuantity !== null &&
                      item.TopUpDecantQuantity !== undefined &&
                      item.TopUpDecantQuantity !== ""
                      ? Utilities.convertStringtoDecimal(
                        item.TopUpDecantQuantity
                      )
                      : 0;
                  //Verify if user had made any changes to quantity or notes
                  if (
                    dTopUpDec !== DecanQty ||
                    ////Verify if user had made any changes to quantity or notes
                    //if ((dTopUpDec != Convert.ToDouble(dr["TopUpDecantQuantity"].ToString().Trim()) ||
                    strComments !== item.Notes ||
                    //btnSubmitForApproval.Text.ToUpper().Contains("APPROVE" )== true)
                    submitBtnName === "ViewShipmentTopUpDecant_AutoApproved"
                  ) {
                    shcompTopUpDecant.TopUpDecantQuantity = dTopUpDec;
                    shipmentCompartmentinfo.TrailerCode = comp.Trailer_Code;
                    shipmentCompartmentinfo.ShipmentCompartmentStatus =
                      Constants.ShipmentCompartmentStatus[
                      comp.Compartment_Status
                      ];
                    shipmentCompartmentinfo.CompartmentCode =
                      comp.Compartment_Code;
                    //strCompartmentCode = shipmentCompartmentinfo.CompartmentCode + "&";
                    shcompTopUpDecant.Status = strStatus;
                    shcompTopUpDecant.QuantityUOM = comp.Compartment_UOM;
                    shcompTopUpDecant.Comments = strComments;
                    shcompTopUpDecant.LastUpdatedBy = strLastUpdatedBy;
                    shipmentCompartmentinfo.ShipmentCompartmentTopUpDecantingInfo =
                      shcompTopUpDecant;
                    ViewAllTruckShipmentLoadingDetails.listShipmentCompartmentInfo.push(
                      shipmentCompartmentinfo
                    );
                    //lstShCompartInfo.Add(shipmentCompartmentinfo);
                  }
                }
              });
            }
          }
        }
      });
    } catch (error) {
      console.log("Error while forming top up decant details:", error);
    }
    return ViewAllTruckShipmentLoadingDetails;
  }

  handleCloseShipmentModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isCloseShipment} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewShipment_CloseHeader") +
                    " : " +
                    this.state.shipment.ShipmentCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-9">
                  <label>{t("CloseShipment_VehicleCrippled")}</label>
                </div>
                <div>
                  <Checkbox
                    checked={this.state.isVehicleCrippled}
                    onChange={(cellData) => {
                      this.setState({ isVehicleCrippled: cellData }, () => {
                        if (cellData)
                          this.setState({ reasonForClosure: "Crippled" });
                        else this.setState({ reasonForClosure: "" });
                      });
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.reasonForClosure}
                    label={t("ViewShipment_Reason")}
                    disbaled={this.state.isVehicleCrippled ? true : false}
                    reserveSpace={false}
                    onChange={(value) => {
                      this.setState({ reasonForClosure: value });
                    }}
                  />
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  if (this.state.reasonForClosure === "") {
                    let notification = {
                      messageType: "critical",
                      message: "ViewAllShipment_ShipmentClose",
                      messageResultDetails: [
                        {
                          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
                          keyValues: [this.state.shipment.ShipmentCode],
                          isSuccess: false,
                          errorMessage: "Enter_ReasonForCloseure",
                        },
                      ],
                    };

                    toast(
                      <ErrorBoundary>
                        <NotifyEvent
                          notificationMessage={notification}
                        ></NotifyEvent>
                      </ErrorBoundary>,
                      {
                        autoClose:
                          notification.messageType === "success"
                            ? 10000
                            : false,
                      }
                    );
                  } else
                    this.setState({ isCloseShipment: false }, () => {
                      this.closeShipment();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    isCloseShipment: false,
                    isVehicleCrippled: false,
                    reasonForClosure: "",
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  authorizeToLoad = () => {
    this.handleAuthenticationClose();

    let modShipment = lodash.cloneDeep(this.state.modShipment);

    let notification = {
      messageType: "critical",
      message: "ViewShipment_AuthorizeLoad_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modShipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    this.props.handleAuthorizeToLoad(
      modShipment,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getShipment(
            { Common_Code: modShipment.ShipmentCode },
            null,
            null,
            notification
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.props.onSaved(modShipment, "update", notification);
        }
      }
    );
  };

  handleOperationClick = (operation) => {
    let modShipment = lodash.cloneDeep(this.state.modShipment);

    let notification = {
      messageType: "critical",
      message: operation + "_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modShipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    switch (operation) {
      case "ViewAllShipment_Trailer_Details":
        this.getTrailerDetails(this.state.shipment);
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_AuthorizeLoad:
        let showAuthorizeToLoadAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;

        this.setState({ showAuthorizeToLoadAuthenticationLayout }, () => {
          if (showAuthorizeToLoadAuthenticationLayout === false) {
            this.authorizeToLoad();
          }
        });
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_AllowToLoad:
        let modLoadingDetails = lodash.cloneDeep(this.state.modLoadingDetails);
        let rows = modLoadingDetails.filter((item) => {
          return item.Planned_Quantity !== item.Revised_Planned_Quantity;
        });
        if (rows.length <= 0) this.setState({ isNotRevised: true });
        else {
          this.handleAllowToLoad();
        }
        break;
      case Constants.ViewAllShipmentOperations.ManualEntry:
        this.setState({ isManualEntry: true });
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_RecordWeight:
        this.getRecordWeightList();
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_CloseShipment:
        this.setState({ isCloseShipment: true });
        break;
      case Constants.ViewAllShipmentOperations.ViewShipmentStatus_PrintFAN:
        this.printFAN();
        break;
      case Constants.ViewAllShipmentOperations.ViewShipmentStatus_PrintBOL:
        this.printBOL();
        break;
      case Constants.ViewAllShipmentOperations.ViewShipmentStatus_ViewBOL:
        let showViewBOLAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;

        this.setState({ showViewBOLAuthenticationLayout }, () => {
          if (showViewBOLAuthenticationLayout === false) {
            this.viewBOL();
          }
        });
        //   this.handleAuthenticationClose();

        break;
      case Constants.ViewAllShipmentOperations.ViewAllShipment_SendBOL:
        this.props.handleSendBOL(
          modShipment.ShipmentCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewAllShipment_BSIOutbound:
        this.props.handleBSIOutbound(
          modShipment.ShipmentCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_ViewAuditTrail:
        let shipType =
          this.props.ShipmentType.toLowerCase() === fnSBP
            ? Constants.shipmentType.PRODUCT
            : Constants.shipmentType.COMPARTMENT;
        this.props.handleViewAuditTrail(
          this.props.selectedShareholder,
          modShipment.ShipmentCode,
          shipType,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              let modAuditTrailList = result.EntityResult;
              let attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList.SHIPMENTSTATUSTIME
              );

              for (let i = 0; i < modAuditTrailList.length; i++) {
                modAuditTrailList[i].UpdatedTime =
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
              }
              let auditTrailList = result.EntityResult;
              for (let i = 0; i < auditTrailList.length; i++) {
                auditTrailList[i].AttributesforUI =
                  this.formReadonlyCompAttributes(
                    auditTrailList[i].Attributes,
                    attributeMetaDataList
                  );
              }
              this.setState({
                isViewAuditTrail: true,
                auditTrailList: auditTrailList,
                modAuditTrailList: modAuditTrailList,
              });
            } else {
              notification.messageType = result.IsSuccess
                ? "success"
                : "critical";
              notification.messageResultDetails[0].isSuccess = result.IsSuccess;
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              toast(
                <ErrorBoundary>
                  <NotifyEvent notificationMessage={notification}></NotifyEvent>
                </ErrorBoundary>,
                {
                  autoClose:
                    notification.messageType === "success" ? 10000 : false,
                }
              );
            }
          }
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_ViewLoadingDetails:
        this.props.handleViewLoadingDetails(
          modShipment.ShipmentCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              let modViewLoadingDetails = result.EntityResult;
              let nonConfigColumns = [];
              if (
                modViewLoadingDetails !== null &&
                modViewLoadingDetails.Table !== null &&
                modViewLoadingDetails.Table.length > 0
              ) {
                let count = 0;
                modViewLoadingDetails.Table.forEach((item) => {
                  item.seqNo = count;
                  item.endtime =
                    new Date(item.endtime).toLocaleDateString() +
                    " " +
                    new Date(item.endtime).toLocaleTimeString();
                  item.starttime =
                    new Date(item.starttime).toLocaleDateString() +
                    " " +
                    new Date(item.starttime).toLocaleTimeString();
                  count++;

                  item.productcode = item.productcode.split("&nbsp;").join(" ");
                  //item.productcode = item.productcode.replace("nbsp;", " ")
                });
              }

              if (
                modViewLoadingDetails !== null &&
                modViewLoadingDetails.Table1 !== null &&
                modViewLoadingDetails.Table1.length > 0
              ) {
                nonConfigColumns =
                  modViewLoadingDetails.Table1[0].NonConfiguredColumns.split(
                    ","
                  );
              }

              this.setState({
                modViewLoadingDetails: modViewLoadingDetails,
                isViewLoadingDetails: true,
                nonConfigColumns: nonConfigColumns,
              });
            } else {
              notification.messageType = result.IsSuccess
                ? "success"
                : "critical";
              notification.messageResultDetails[0].isSuccess = result.IsSuccess;
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              toast(
                <ErrorBoundary>
                  <NotifyEvent notificationMessage={notification}></NotifyEvent>
                </ErrorBoundary>,
                {
                  autoClose:
                    notification.messageType === "success" ? 10000 : false,
                }
              );
            }
          }
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewAllShipment_SealCompartments:
        this.props.handleSealCompartments(
          modShipment.ShipmentCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              //let sealCompartments = []
              this.setState({
                isSealCompartments: true,
                sealCompartments: result.EntityResult,
              });
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              toast(
                <ErrorBoundary>
                  <NotifyEvent notificationMessage={notification}></NotifyEvent>
                </ErrorBoundary>,
                {
                  autoClose:
                    notification.messageType === "success" ? 10000 : false,
                }
              );
            }
          }
        );
        break;
      case "ViewAllocateBay_AllocateBay":
        this.getBays();
        break;
      case "ViewAllocateBay_DeallocateBay":
        this.setState({
          isDeAllocateBay: true,
        });
        break;
      default:
        return;
    }
  };

  getBays = () => {
    let shipment = lodash.cloneDeep(this.state.shipment);
    let products = [];
    shipment.ShipmentCompartments.forEach((element) => {
      products.push(element.FinishedProductCode);
    });

    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: [
        {
          key: "TransactionType",
          value: "SHIPMENT",
        },
        {
          key: "TransportationType",
          value: "ROAD",
        },
        {
          key: "TerminalCode",
          value: this.state.shipment.ActualTerminalCode,
        },
        {
          key: "FinishedProductCode",
          value: products.toString(),
        },
      ],
    };

    axios(
      RestAPIs.GetAllValidBays,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let bayAllocation = result.EntityResult;
          bayAllocation.forEach((element) => {
            element.SupportedProducts.forEach((ele) => {
              if (
                element.AssociatedProduct === "" ||
                element.AssociatedProduct === undefined
              ) {
                element.AssociatedProduct = ele.Code;
              } else {
                element.AssociatedProduct += "," + ele.Code;
              }
            });
          });

          this.setState({
            bayData: bayAllocation,
            isAllocateBay: true,
          });
        } else {
          this.setState({
            bayData: [],
            isAllocateBay: true,
          });
          console.log("Error in getBays:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ bayData: [], isReadyToRender: true });
        console.log("Error while getBays:", error);
      });
  };

  GetAutoGeneratedShipmentCode(shipment) {
    let modShipment = shipment;
    axios(
      RestAPIs.GetAutoGeneratedShipmentCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined &&
            result.EntityResult !== ""
          ) {
            modShipment.ShipmentCode = result.EntityResult;
            this.setState({
              isAutoGeneratedShipmentCode: true,
              autoGeneratedCode: result.EntityResult,
            });
          } else {
            this.setState({
              isAutoGeneratedShipmentCode: false,
              autoGeneratedCode: "",
            });
          }
        }
      })
      .catch((error) => {
        console.log("Error while getting AutoGeneratedShipmentCode:", error);
      });
    return modShipment;
  }

  getShipment(shipmentRow, shipmentType, activeTab, notification) {
    let notificationShipment = null;
    shipmentType =
      shipmentType === undefined || shipmentType === null
        ? this.props.ShipmentType.toLowerCase()
        : shipmentType;
    emptyShipment.ShareholderCode = this.props.selectedShareholder;
    shipmentType && shipmentType.toLowerCase() === fnSBC
      ? (emptyShipment.ShipmentType = 0)
      : (emptyShipment.ShipmentType = 2);
    emptyShipment.ShipmentQuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.ROAD;
    emptyShipment.ScheduledDate = new Date();
    emptyShipment.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    let functionGroup =
      shipmentType && shipmentType.toLowerCase() === fnSBC ? fnSBC : fnSBP;
    this.handleResetAttributeValidationError();
    if (shipmentRow.Common_Code === undefined) {
      if (this.props.shipmentSource !== undefined) {
        emptyShipment.CreatedFromEntity = this.props.shipmentSource;
      } else emptyShipment.CreatedFromEntity = 0;
      let modProductPlans = [];
      if (
        this.props.shipmentSource !== undefined &&
        this.props.ShipmentType.toLowerCase() === fnSBP &&
        !this.props.shipmentSourceFromSummary
      ) {
        modProductPlans = this.getShipmentCompartmentFromVehicleCompartment();
      }
      if (
        this.props.shipmentSource !== undefined &&
        this.props.shipmentSourceFromSummary
      )
        this.getCompartmentFromOtherSource(this.props.selectedSourceCode);

      this.setState(
        {
          shipment: lodash.cloneDeep(emptyShipment),
          modShipment:
            shipmentType && shipmentType.toLowerCase() === fnSBC
              ? this.GetAutoGeneratedShipmentCode(
                lodash.cloneDeep(emptyShipment)
              )
              : lodash.cloneDeep(emptyShipment),
          isReadyToRender: true,
          modLoadingDetails: [],
          staticLoadingDetails: [],
          modCompartmentPlans: [],
          modProductPlans: modProductPlans,
          selectedAttributeList: [],
          isPlanned: false,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            functionGroup
          ),
          activeTab: activeTab,
          isValidationPassed: false,
          isDisableSubmitForApproval: true,
          productAllocationList: [],
          productShareholderAllocationList: [],
          ProdAllocEntity: "",
          expandedRows: [],
          isEnforcingEnabled: false,
          truckShipmentKPIList: [],
        },
        () => {
          //this.GetViewAllShipmentCustomData();
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetShipment,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let data = result.EntityResult;
          notificationShipment = result.EntityResult;
          let isPlanned = lodash.cloneDeep(this.state.isPlanned);
          isPlanned = true;
          //   data.ShipmentDestinationCompartmentsInfo === null ||
          //     data.ShipmentDestinationCompartmentsInfo === undefined ||
          //     data.ShipmentDestinationCompartmentsInfo.length === 0
          //     ? false
          //     : true;
          this.setState(
            {
              isReadyToRender: true,
              shipment: result.EntityResult,
              modShipment: lodash.cloneDeep(result.EntityResult),
              modCompartmentPlans: this.getShipmentCompartmentFromShipment(
                result.EntityResult
              ),
              modProductPlans:
                this.props.ShipmentType.toLowerCase() === fnSBP
                  ? this.getShipmentDetailsFromShipment(result.EntityResult)
                  : [],
              isPlanned: isPlanned,
              isValidationPassed: true,
              isVolumeBased: result.EntityResult.IsVolumeBased,
              activeTab:
                isPlanned && shipmentType.toLowerCase() === fnSBC // && this.props.shipmentSource === undefined
                  ? 1
                  : isPlanned && shipmentType.toLowerCase() === fnSBP // && this.props.shipmentSource === undefined
                    ? data.ShipmentDestinationCompartmentsInfo === null ||
                      data.ShipmentDestinationCompartmentsInfo === undefined ||
                      data.ShipmentDestinationCompartmentsInfo.length === 0
                      ? 1
                      : 2
                    : 0,
              isDisableSubmitForApproval:
                result.EntityResult.Status !==
                  Constants.Shipment_Status.READY && //&& this.props.userDetails.EntityResult.IsEnterpriseNode
                  result.EntityResult.ActualTerminalCode === null
                  ? true
                  : false,
              expandedRows: [],
            },
            () => {
              this.GetViewAllShipmentCustomData(result.EntityResult);
              this.getVehicle(result.EntityResult.VehicleCode, false);
              this.getLoadingDetails(result.EntityResult);
              this.getKPIList(
                this.props.selectedShareholder,
                result.EntityResult.ShipmentCode
              );
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
              this.getShipmentStatusOperations(result.EntityResult);
              this.getShipmentStatuses(result.EntityResult);
              this.getLookUpData(result.EntityResult.ShipmentCode);
              if (
                result.EntityResult.TransloadSourceType !== null &&
                result.EntityResult.TransloadSourceType !== undefined &&
                result.EntityResult.TransloadSourceType === "MARINE"
              )
                this.getMarineTransloadableReceipts();
              //this.getTrailerDetails(result.EntityResult);
              this.GetBayByTrnsaction(
                result.EntityResult.ShipmentCode,
                "SHIPMENT",
                result.EntityResult.ShareholderCode
              );
            }
          );
        } else {
          this.setState({
            shipment: lodash.cloneDeep(emptyShipment),
            modShipment: lodash.cloneDeep(emptyShipment),
            modLoadingDetails: [],
            staticLoadingDetails: [],
            modCustomValues: {},
            modCompartmentPlans: [],
            selectedAttributeList: [],
            modProductPlans: [],
            isReadyToRender: true,
            isPlanned: false,
            activeTab: this.props.ShipmentType.toLowerCase() === fnSBC ? 1 : 0,
            isValidationPassed: false,
            isDisableSubmitForApproval: true,
            productAllocationList: [],
            ProdAllocEntity: "",
            productShareholderAllocationList: [],
          });
          console.log("Error in GetShiment:", result.ErrorList);
        }
        if (
          notification !== undefined &&
          notification !== null &&
          notificationShipment !== null
        )
          this.props.onSaved(notificationShipment, "update", notification);
      })
      .catch((error) => {
        console.log("Error while getting Shipment:", error, shipmentRow);
      });
  }

  handleAttributeDataEdit = (attribute, value) => {
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
        "TruckShipmentDetailsComposite:Error occured on handleAttributeDataEdit",
        error
      );
    }
  };

  getCompartmentFromOtherSource(items) {
    var obj = [];
    var shCode = this.props.selectedShareholder;

    if (this.props.shipmentSource === Constants.shipmentFrom.Contract) {
      items.forEach((code) => {
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.contractCode, Value: code }],
        };
        obj.push(keyData);
      });

      axios(
        RestAPIs.GetContractList,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ otherSourceData: result.EntityResult }, () => {
            if (this.props.ShipmentType.toLowerCase() === fnSBP)
              this.getShipmentCompartmentFromVehicleCompartment();
          });
        } else {
          this.setState({ otherSourceData: [] });
        }
      });
    } else if (this.props.shipmentSource === Constants.shipmentFrom.Order) {
      items.forEach((code) => {
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.orderCode, Value: code }],
        };
        obj.push(keyData);
      });

      axios(
        RestAPIs.GetOrderList,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ otherSourceData: result.EntityResult }, () => {
            if (this.props.ShipmentType.toLowerCase() === fnSBP)
              this.getShipmentCompartmentFromVehicleCompartment();
          });
        } else {
          this.setState({ otherSourceData: [] });
        }
      });
    }
  }

  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modCompartmentPlans = lodash.cloneDeep(this.state.modCompartmentPlans);
    let compIndex = modCompartmentPlans.findIndex(
      (item) => item.SeqNumber === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0)
      modCompartmentPlans[compIndex].AttributesforUI[
        // compAttribute.rowIndex
        compAttribute.rowData.SeqNumber - 1
      ].AttributeValue = value;
    this.setState({ modCompartmentPlans });
    if (compIndex >= 0)
      this.attributeToggleExpand(modCompartmentPlans[compIndex], true, true);
  };

  handleProdPlanAttributeCellDataEdit = (compAttribute, value) => {
    let modProductPlans = lodash.cloneDeep(this.state.modProductPlans);
    let compIndex = modProductPlans.findIndex(
      (item) => item.SeqNumber === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0)
      modProductPlans[compIndex].AttributesforUI[
        // compAttribute.rowIndex
        compAttribute.rowData.SeqNumber - 1
      ].AttributeValue = value;
    this.setState({ modProductPlans });
    if (compIndex >= 0)
      this.attributeToggleExpand(modProductPlans[compIndex], true, true);
  };

  handleTabChange = (activeIndex) => {
    try {
      this.setState({ activeTab: activeIndex, expandedRows: [] });

      if (this.state.isPlanned) {
        if (
          this.props.ShipmentType.toLowerCase() === fnSBP &&
          activeIndex === 2 &&
          this.state.modCustomValues.DisableLoadingDetails === "FALSE"
        )
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              this.props.ShipmentType.toLowerCase()
            ),
          });
        else if (
          this.props.ShipmentType.toLowerCase() === fnSBC &&
          activeIndex === 1 &&
          this.state.modCustomValues.DisableLoadingDetails === "FALSE"
        )
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              this.props.ShipmentType.toLowerCase()
            ),
          });
        else
          this.setState({
            saveEnabled:
              this.state.modCustomValues.ShipmentUpdateAllow === "TRUE" &&
              Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                this.props.ShipmentType.toLowerCase()
              ),
          });
      }
    } catch (error) {
      console.log(
        "TruckShipmentDetailsComposite: Error occurred on handleTabChange",
        error
      );
    }
  };

  handleCellCheck = (data, cellData) => {
    let modLoadingDetails = lodash.cloneDeep(this.state.modLoadingDetails);
    let isLoadingDetailsChanged = lodash.cloneDeep(
      this.state.isLoadingDetailsChanged
    );
    const index = modLoadingDetails.findIndex((item) => {
      return item.SeqNo === data.rowData.SeqNo;
    });
    if (index > -1) {
      modLoadingDetails[index].Force_Complete = cellData;
      isLoadingDetailsChanged = true;
    }

    this.setState({ modLoadingDetails, isLoadingDetailsChanged });
  };

  handleLoadingDetailsChange = (cellData, data) => {
    let modLoadingDetails = lodash.cloneDeep(this.state.modLoadingDetails);

    const index = modLoadingDetails.findIndex((item) => {
      return item.SeqNo === data.rowData.SeqNo;
    });
    if (index > -1) {
      modLoadingDetails[index][data.field] = cellData;
      this.setState({ modLoadingDetails, isLoadingDetailsChanged: true });
      let expandedRows = lodash.cloneDeep(this.state.expandedRows);
      let exIndex = expandedRows.findIndex((item) => item.SeqNo === data.SeqNo);
      if (exIndex >= 0) {
        expandedRows.splice(exIndex, 1);
        this.setState({ expandedRows });
      }

      this.toggleExpand(modLoadingDetails[index], false);
    }
  };

  UpdateShipmentBondNo = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.shipmentCode,
          value: this.state.modShipment.ShipmentCode,
        },
        {
          key: KeyCodes.shipmentBondNo,
          value: this.state.modShipment.ShipmentBondNo,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
      };

      let notification = {
        messageType: "critical",
        message: "ShipmentBondUpdate_Status",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.modShipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateShipmentBond,
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
            this.getShipment({
              Common_Code: this.state.modShipment.ShipmentCode,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in UpdateShipment:", result.ErrorList);
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
          console.log("Error while OverrideShipmentSequence:", error);
        });
    } catch (error) {
      console.log("Error while Updating ShipmentSequence:", error);
    }
  };


  UpdateShipmentDriver = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.shipmentCode,
          value: this.state.modShipment.ShipmentCode,
        },
        {
          key: KeyCodes.driverCode,
          value: this.state.modShipment.DriverCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
      };

      let notification = {
        messageType: "critical",
        message: "DriverCode_UpdateStatus",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.modShipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateShipmentDriver,
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
            this.getShipment({
              Common_Code: this.state.modShipment.ShipmentCode,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error Shipment Driver Update:", result.ErrorList);
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
          console.log("Error while Shipment Driver Update:", error);
        });
    } catch (error) {
      console.log("Error while Shipment Driver Update:", error);
    }
  };

  handleOverrideShipmentSequence = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.shipmentCode,
          value: this.state.modShipment.ShipmentCode,
        },
        {
          key: KeyCodes.isPriority,
          value: this.state.modShipment.IsPriority ? false : true,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
      };

      let notification = {
        messageType: "critical",
        message: "PrioritySet_Status",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.modShipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.OverrideShipmentSequence,
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
            this.getShipment({
              Common_Code: this.state.modShipment.ShipmentCode,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in UpdateShipment:", result.ErrorList);
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
          console.log("Error while OverrideShipmentSequence:", error);
        });
    } catch (error) {
      console.log("Error while Updating ShipmentSequence:", error);
    }
  };

  handleUpdateShipmentTransloading = () => {
    try {
      let compartments =
        this.getShipmentDestinationCompartmentsFromModCompartmentPlans(
          this.state.modCompartmentPlans
        );

      var keyCode = [
        {
          key: KeyCodes.shareholderCode,
          value: this.props.selectedShareholder,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.modShipment.ShipmentCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
        Entity: compartments,
      };

      let notification = {
        messageType: "critical",
        message: "UpdateTruckTransloading_Status",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.modShipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateTransloadingShipmentData,
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
            this.getShipment({
              Common_Code: this.state.modShipment.ShipmentCode,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in UpdateShipment:", result.ErrorList);
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
          console.log("Error while handleUpdateShipmentTransloading:", error);
        });
    } catch (error) {
      console.log("Error while Updating ShipmentTransloading:", error);
    }
  };

  handleReset = () => {
    try {
      let vehicleDetails = lodash.cloneDeep(this.state.vehicleDetails);
      var modShipment = lodash.cloneDeep(this.state.shipment);
      if (
        this.props.ShipmentType &&
        this.props.ShipmentType.toLowerCase() === fnSBC &&
        modShipment.ShipmentCode === ""
      )
        modShipment.ShipmentCode = lodash.cloneDeep(
          this.state.autoGeneratedCode
        );
      //let modAssociations = [];
      let modCompartmentPlans = [];
      let modProductPlans = [];
      let compSeqOptions = [];
      if (this.state.shipment.ShipmentCode === "") {
        //modAssociations = [];
        modCompartmentPlans = [];
        modProductPlans = [];
        compSeqOptions = [];
      } else {
        modCompartmentPlans = this.getShipmentCompartmentFromShipment(
          this.state.shipment
        );
        if (this.props.ShipmentType.toLowerCase() === fnSBP)
          modProductPlans = this.getShipmentDetailsFromShipment(
            this.state.shipment
          );
        vehicleDetails.vehicleCompartments.forEach((vehicleCompartment) =>
          compSeqOptions.push({
            text: vehicleCompartment.vehCompSeq.toString(),
            value: vehicleCompartment.vehCompSeq.toString(),
          })
        );
      }
      this.setState(
        {
          modShipment,
          validationErrors: [],
          modVehicleDetails: lodash.cloneDeep(this.state.vehicleDetails),
          selectedAttributeList: [],
          modCompartmentPlans,
          modProductPlans,
          compSeqOptions,
          isValidationPassed: true,
          isEnforcingEnabled: false,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modShipment.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleReset",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList.SHIPMENT
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(attributeMetaDataList),
      });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.props.terminalCodes];
      var modShipment = lodash.cloneDeep(this.state.modShipment);

      if (checked) modShipment.TerminalCodes = [...terminalCodes];
      else modShipment.TerminalCodes = [];
      //this.setState({ modShipment });
      this.setState({ modShipment }, () =>
        this.terminalSelectionChange(modShipment.TerminalCodes)
      );
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleAddCompartmentPlan = () => {
    let modShipment = lodash.cloneDeep(this.state.modShipment);
    let updateShipmentAllowed =
      this.state.modCustomValues.ShipmentUpdateAllow === "TRUE" &&
      Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        this.props.ShipmentType.toLowerCase()
      );
    if (
      !this.props.userDetails.EntityResult.IsArchived &&
      (this.state.shipment.ShipmentCode === "" ||
        updateShipmentAllowed === true)
    ) {
      try {
        if (
          this.state.modCompartmentPlans.length <
          this.state.modVehicleDetails.vehicleCompartments.length
        ) {
          let modCompartmentPlans = lodash.cloneDeep(
            this.state.modCompartmentPlans
          );
          let newCompartmentPlan = {
            Attributes: [],
            ShipmentCode: "",
            CompartmentCode: null,
            CompartmentSeqNoInVehicle: null,
            TrailerCode: null,
            CompartmentSeqNoInTrailer: null,
            Quantity: null,
            UOM: null,
            OrderCode: null,
            ContractCode: null,
            CustomerCode: null,
            DestinationCode: null,
            FinishedProductCode: null,
            ShareholderCode: this.props.selectedShareholder,
          };

          newCompartmentPlan.SeqNumber =
            Utilities.getMaxSeqNumberfromListObject(modCompartmentPlans);

          modCompartmentPlans.push(newCompartmentPlan);

          this.setState(
            {
              //modAssociations,
              modCompartmentPlans,
              //selectedAssociations: [],
              selectedCompartmentPlans: [],
            },
            () => {
              if (
                this.props.userDetails.EntityResult.IsEnterpriseNode === false
              ) {
                var attributeMetaDataList = lodash.cloneDeep(
                  this.state.attributeMetaDataList
                    .SHIPMENTDESTINATIONCOMPARTMENT
                );
                if (attributeMetaDataList.length > 0)
                  this.formCompartmentPlanAttributes([
                    attributeMetaDataList[0].TerminalCode,
                  ]);
              } else
                this.formCompartmentPlanAttributes(modShipment.TerminalCodes);
            }
          );
        }
      } catch (error) {
        console.log(
          this.props.ShipmentType +
          ":Error occured on handleAddCompartmentPlan",
          error
        );
      }
    }
  };

  handleAddProductPlan = () => {
    let modShipment = lodash.clone(this.state.modShipment);
    let updateShipmentAllowed =
      this.state.modCustomValues.ShipmentUpdateAllow === "TRUE" &&
      Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        this.props.ShipmentType.toLowerCase()
      );
    if (
      !this.props.userDetails.EntityResult.IsArchived &&
      (this.state.shipment.ShipmentCode === "" ||
        updateShipmentAllowed === true)
    ) {
      try {
        let modProductPlans = lodash.cloneDeep(this.state.modProductPlans);
        let newProductPlan = {
          Attributes: [],
          Quantity: null,
          UOM: null,
          OrderCode: null,
          ContractCode: null,
          CustomerCode: null,
          DestinationCode: "",
          FinishedProductCode: "",
          ShareholderCode: this.props.selectedShareholder,
        };

        newProductPlan.SeqNumber =
          Utilities.getMaxSeqNumberfromListObject(modProductPlans);

        modProductPlans.push(newProductPlan);

        this.setState(
          {
            //modAssociations,
            //selectedAssociations: [],
            modProductPlans,
            selectedProductPlans: [],
          },
          () => {
            if (
              this.props.userDetails.EntityResult.IsEnterpriseNode === false
            ) {
              var attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList.SHIPMENTDESTINATIONCOMPARTMENT
              );
              if (attributeMetaDataList.length > 0)
                this.formProductPlanAttributes([
                  attributeMetaDataList[0].TerminalCode,
                ]);
            } else this.formProductPlanAttributes(modShipment.TerminalCodes);
          }
        );
      } catch (error) {
        console.log(
          this.props.ShipmentType + ":Error occured on handleAddProductPlan",
          error
        );
      }
    }
  };

  handleDeleteCompartmentPlan = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedCompartmentPlans != null &&
          this.state.selectedCompartmentPlans.length > 0
        ) {
          if (this.state.modCompartmentPlans.length > 0) {
            let modCompartmentPlans = lodash.cloneDeep(
              this.state.modCompartmentPlans
            );

            this.state.selectedCompartmentPlans.forEach((obj, index) => {
              modCompartmentPlans = modCompartmentPlans.filter(
                (association, cindex) => {
                  return association.SeqNumber !== obj.SeqNumber;
                }
              );
            });

            this.setState({
              modCompartmentPlans,
              selectedCompartmentPlans: [],
            });
          }
        }
      } catch (error) {
        console.log(
          this.props.ShipmentType +
          ":Error occured on handleDeleteCompartmentPlan",
          error
        );
      }
    }
  };

  handleDeleteProductPlan = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedProductPlans != null &&
          this.state.selectedProductPlans.length > 0
        ) {
          if (this.state.modProductPlans.length > 0) {
            let modProductPlans = lodash.cloneDeep(this.state.modProductPlans);

            this.state.selectedProductPlans.forEach((obj) => {
              modProductPlans = modProductPlans.filter((association) => {
                return association.SeqNumber !== obj.SeqNumber;
              });
            });

            this.setState({ modProductPlans, selectedProductPlans: [] });
          }
        }
      } catch (error) {
        console.log(
          this.props.ShipmentType + ":Error occured on handleDeleteProductPlan",
          error
        );
      }
    }
  };

  handleCompartmentPlansSelectionChange = (associations) => {
    this.setState({ selectedCompartmentPlans: associations });
  };

  handleProductPlansSelectionChange = (associations) => {
    this.setState({ selectedProductPlans: associations });
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = { ...this.state.validationErrors };
      var modShipment = lodash.cloneDeep(this.state.modShipment);
      validationErrors[propertyName] = error;
      modShipment[propertyName] = value;
      this.setState({ validationErrors, modShipment });
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleDateTextChange",
        error
      );
    }
  };

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
            if (Array.isArray(result.EntityResult.VOLUME)) {
              quantityUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.VOLUME
              );
            }
            if (Array.isArray(result.EntityResult.MASS)) {
              let massUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.MASS
              );
              massUOMOptions.forEach((massUOM) =>
                quantityUOMOptions.push(massUOM)
              );
            }

            this.setState({ quantityUOMOptions });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetUOMList:", error);
      });
  }

  getVehicleCodes(shareholder) {
    axios(
      RestAPIs.GetVehicleCodes +
      "?Transportationtype=" +
      Constants.TransportationType.ROAD +
      "&ShareholderCode=" +
      shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let vehicleOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );

            let vehicleSearchOptions = lodash.cloneDeep(vehicleOptions);
            if (vehicleSearchOptions.length > Constants.filteredOptionsCount) {
              vehicleSearchOptions = vehicleSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ vehicleOptions, vehicleSearchOptions });
          }
        } else {
          console.log("Error in getVehicleCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getVehicleCodes:", error);
      });
  }

  getFinishedProductCodes(shareholder) {
    axios(
      RestAPIs.GetFinishedProductCodes + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let finishedProductOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ finishedProductOptions });
          }
        } else {
          console.log("Error in getFinishedProductCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getFinishedProductCodes:", error);
      });
  }

  getcustomerDestinationList(shareholder) {
    axios(
      RestAPIs.GetCustomerDestinations +
      "?ShareholderCode=" +
      shareholder +
      "&TransportationType=" +
      Constants.TransportationType.ROAD,

      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;

        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let shareholderCustomers = result.EntityResult.filter(
              (shareholderCust) =>
                shareholderCust.ShareholderCode === shareholder
            );
            if (shareholderCustomers.length > 0) {
              let customerDestinationOptions =
                shareholderCustomers[0].CustomerDestinationsList;
              this.setState({ customerDestinationOptions });
            } else {
              console.log("no customers identified for shareholder");
            }
          } else {
            console.log("customerdestinations not identified for shareholder");
          }
        }
      })
      .catch((error) => {
        console.log("Error while getting Customer List:", error);
      });
  }

  getDriverCodes(shareholder) {
    axios(
      RestAPIs.GetDriverCodes + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let driverOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let driverSearchOptions = lodash.cloneDeep(driverOptions);
            if (driverSearchOptions.length > Constants.filteredOptionsCount) {
              driverSearchOptions = driverSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ driverOptions, driverSearchOptions });
          }
        } else {
          console.log("Error in getDriverCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getDriverCodes:", error);
      });
  }

  handleActiveStatusChange = (value) => {
    try {
      let modShipment = lodash.cloneDeep(this.state.modShipment);
      modShipment.Active = value;
      if (modShipment.Active !== this.state.shipment.Active)
        modShipment.Remarks = "";
      this.setState({ modShipment });
    } catch (error) {
      console.log(error);
    }
  };

  getDriverSearchOptions() {
    let driverSearchOptions = lodash.cloneDeep(this.state.driverSearchOptions);
    let modDriverCode = this.state.modShipment.DriverCode;
    if (
      modDriverCode !== null &&
      modDriverCode !== "" &&
      modDriverCode !== undefined
    ) {
      let selectedDriverCode = driverSearchOptions.find(
        (element) => element.value.toLowerCase() === modDriverCode.toLowerCase()
      );
      if (selectedDriverCode === undefined) {
        driverSearchOptions.push({
          text: modDriverCode,
          value: modDriverCode,
        });
      }
    }
    return driverSearchOptions;
  }

  getContractCodes(shareholder) {
    axios(
      RestAPIs.GetContractCodes +
      "?ShareholderCode=" +
      shareholder +
      "&TransportationType=" +
      Constants.TransportationType.ROAD,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true || Array.isArray(result.EntityResult)) {
          this.setState({
            contractCodeOptions: Utilities.transferListtoOptions(
              result.EntityResult
            ),
          });
        } else {
          console.log("Error in getContractCodes: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getContractCodes: ", error);
      });
  }

  getOrderCodes(shareholder) {
    axios(
      RestAPIs.GetOrderCodes +
      "?ShareholderCode=" +
      shareholder +
      "&TransportationType=" +
      Constants.TransportationType.ROAD,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true || Array.isArray(result.EntityResult)) {
          this.setState({
            orderCodeOptions: Utilities.transferListtoOptions(
              result.EntityResult
            ),
          });
        } else {
          console.log("Error in getOrderCodes: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getOrderCodes: ", error);
      });
  }

  getVehicleSearchOptions() {
    let vehicleSearchOptions = lodash.cloneDeep(
      this.state.vehicleSearchOptions
    );
    let modVehicleCode = this.state.modShipment.VehicleCode;
    if (
      modVehicleCode !== null &&
      modVehicleCode !== "" &&
      modVehicleCode !== undefined
    ) {
      let selectedVehicleCode = vehicleSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modVehicleCode.toLowerCase()
      );
      if (selectedVehicleCode === undefined) {
        vehicleSearchOptions.push({
          text: modVehicleCode,
          value: modVehicleCode,
        });
      }
    }
    return vehicleSearchOptions;
  }

  onBack = () => {
    this.setState({
      isManualEntry: false,
      isViewAuditTrail: false,
      isViewTrailerDetails: false,
      isViewLoadingDetails: false,
      isPlanned: true,
      saveEnabled: false,
      expandedRows: [],
      loadingExpandedRows: [],
      drawerStatus: false,
    });
    this.getShipment({ Common_Code: this.state.modShipment.ShipmentCode });
  };

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

  handleSealClose = () => {
    this.setState({
      isSealCompartments: false,
      sealCompartments: [],
    });
  };

  //Get KPI for Truck Shipment
  getKPIList(shareholder, shipmentCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiTruckShipmentDetail,
        TransportationType: Constants.TransportationType.ROAD,
        InputParameters: [
          { key: "ShareholderCode", value: shareholder },
          { key: "ShipmentCode", value: shipmentCode },
        ],
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
              truckShipmentKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ truckShipmentKPIList: [] });
            console.log("Error in truck shipment KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting truck shipment KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showShipmentAuthenticationLayout: false,
      showAuthorizeToLoadAuthenticationLayout: false,
      showAllowToLoadAuthenticationLayout: false,
      showCloseShipmentAuthenticationLayout: false,
      showViewBOLAuthenticationLayout: false,
      showPrintBOLAuthenticationLayout: false,
      showFANAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    if (
      this.state.showShipmentAuthenticationLayout &&
      this.props.ShipmentType.toLowerCase() === fnSBP
    )
      return fnSBP;
    if (
      this.state.showShipmentAuthenticationLayout &&
      this.props.ShipmentType.toLowerCase() === fnSBC
    )
      return fnSBC;
    else if (this.state.showCloseShipmentAuthenticationLayout)
      return fnCloseShipment;
    else if (
      this.state.showAllowToLoadAuthenticationLayout ||
      this.state.showAuthorizeToLoadAuthenticationLayout
    )
      return fnShipmentStatus;
    else if (
      this.state.showViewBOLAuthenticationLayout ||
      this.state.showPrintBOLAuthenticationLayout
    )
      return fnPrintBOL;
    else if (this.state.showFANAuthenticationLayout) return fnPrintFAN;
  }

  getAddorEditMode() {
    if (this.state.showShipmentAuthenticationLayout)
      return this.state.shipment.ShipmentCode === "" ? functionGroups.add : functionGroups.modify;
    else
      return functionGroups.modify;
  };
  viewBOL = () => {
    this.props.handleViewBOL();
    this.handleAuthenticationClose();
  };
  handleOperation() {
    if (this.state.showShipmentAuthenticationLayout)
      return this.handleSaveShipment;
    else if (this.state.showAuthorizeToLoadAuthenticationLayout)
      return this.authorizeToLoad;
    else if (this.state.showAllowToLoadAuthenticationLayout)
      return this.handleAllowToLoad;
    else if (this.state.showCloseShipmentAuthenticationLayout)
      return this.handleShipmentClose;
    else if (this.state.showFANAuthenticationLayout) return this.handlePrintFAN;
    else if (this.state.showViewBOLAuthenticationLayout) return this.viewBOL;
    else if (this.state.showPrintBOLAuthenticationLayout)
      return this.handlePrintBOL;
  }

  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modShipment.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modShipment.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modShipment.LastActiveTime !== undefined &&
            this.state.modShipment.LastActiveTime !== null
            ? new Date(
              this.state.modShipment.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modShipment.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modShipment.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modShipment.CreatedTime).toLocaleTimeString(),
      },
    ];
    let shipmentFrom = [];
    let customValue = lodash.cloneDeep(this.state.modCustomValues);

    let IsShipmentCreateFromNoneAllowed =
      this.props.ShipmentType.toLowerCase() === fnSBP
        ? customValue["ShipProdCreateShipmentFromNone"]
        : customValue["ShipCompCreateShipmentFromNone"];
    let nOrderExists = customValue["orderEnabled"];
    let nContractExists = customValue["contractEnabled"];

    Object.keys(Constants.shipmentFrom).forEach((element) => {
      if (element !== "All")
        shipmentFrom.push({
          text: element,
          value: Constants.shipmentFrom[element],
        });
    });

    if (nOrderExists === "0") {
      let index = shipmentFrom.findIndex(
        (item) =>
          Constants.shipmentFrom[item.text] === Constants.shipmentFrom.Order
      );
      if (index >= 0) shipmentFrom.splice(index, 1);
    }

    if (nContractExists === "0") {
      let index = shipmentFrom.findIndex(
        (item) =>
          Constants.shipmentFrom[item.text] === Constants.shipmentFrom.Contract
      );
      if (index >= 0) shipmentFrom.splice(index, 1);
      // ddlCreatedFrom.Items.Remove(ddlCreatedFrom.Items.FindByText(CreatedFrom.CONTRACT.ToString()));
    }

    if (
      IsShipmentCreateFromNoneAllowed === "0" &&
      (nOrderExists === "1" || nContractExists === "1")
    ) {
      let index = shipmentFrom.findIndex(
        (item) =>
          Constants.shipmentFrom[item.text] === Constants.shipmentFrom.None
      );
      if (index >= 0) shipmentFrom.splice(index, 1);
      // ddlCreatedFrom.Items.Remove(ddlCreatedFrom.Items.FindByText(CreatedFrom.NONE.ToString()));
    }

    let transloadingOptions = [];
    if (this.state.isMarineTransLoading) transloadingOptions.push("MARINE");
    if (this.state.isRailTransloading) transloadingOptions.push("RAIL");

    return this.state.isReadyToRender ? (
      <div>
        <TranslationConsumer>
          {(t) => (
            <ErrorBoundary>
              <TMDetailsHeader
                entityCode={
                  this.state.isManualEntry
                    ? this.state.shipment.ShipmentCode +
                    " - " +
                    t("LoadingDetailsEntry_Title")
                    : this.state.shipment.ShipmentCode
                }
                newEntityName={
                  this.props.ShipmentType.toLowerCase() === fnSBC
                    ? "ShipmentCompDetail_NewShipmentByCompartment"
                    : "ShipmentProdDetail_NewShipmentByCompartment"
                }
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            </ErrorBoundary>
          )}
        </TranslationConsumer>
        {this.state.isViewAuditTrail ? (
          <ErrorBoundary>
            <TruckShipmentViewAuditTrailDetails
              ShipmentCode={this.state.shipment.ShipmentCode}
              auditTrailList={this.state.auditTrailList}
              modAuditTrailList={this.state.modAuditTrailList}
              Attributes={
                this.state.auditTrailList !== undefined &&
                  this.state.auditTrailList.length > 0
                  ? this.state.auditTrailList[0].AttributesforUI
                  : []
              }
              handleBack={this.onBack}
            ></TruckShipmentViewAuditTrailDetails>
          </ErrorBoundary>
        ) : this.state.isViewLoadingDetails ? (
          <ErrorBoundary>
            <TruckShipmentViewLoadingDetails
              ShipmentCode={this.state.shipment.ShipmentCode}
              modLoadingDetails={this.state.modViewLoadingDetails}
              handleBack={this.onBack}
              expandedRows={this.state.loadingExpandedRows}
              toggleExpand={this.loadingToggleExpand}
              nonConfigColumns={this.state.nonConfigColumns}
            ></TruckShipmentViewLoadingDetails>
          </ErrorBoundary>
        ) : this.state.isViewTrailerDetails ? (
          <ErrorBoundary>
            <TruckShipmentTrailerDetails
              ShipmentCode={this.state.shipment.ShipmentCode}
              trailerDetails={this.state.trailerDetails}
              selectedAttributeList={
                this.state.selectedShipTrailerAttributeList
              }
              handleBack={this.onBack}
              compAttributes={
                this.state.trailerDetails !== undefined &&
                  this.state.trailerDetails.length > 0 &&
                  this.state.trailerDetails[0].shipmentTrailerTWInfoList &&
                  this.state.trailerDetails[0].shipmentTrailerTWInfoList.length >
                  0
                  ? this.state.trailerDetails[0].shipmentTrailerTWInfoList[0]
                    .AttributesforUI
                  : this.state.selectedCompAttributes
              }
            ></TruckShipmentTrailerDetails>
          </ErrorBoundary>
        ) : this.state.isManualEntry ? (
          <div>
            <ErrorBoundary>
              <TruckShipmentManualEntryDetailsComposite
                shipment={this.state.modShipment}
                handleBack={this.onBack}
                selectedShareholder={this.props.selectedShareholder}
              ></TruckShipmentManualEntryDetailsComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <div>
            <TMDetailsKPILayout
              KPIList={this.state.truckShipmentKPIList}
            ></TMDetailsKPILayout>
            <div
              // className={
              //   this.state.isPlanned ? "showShipmentStatusRightPane" : ""
              // }
              className={
                (this.state.isPlanned &&
                  Array.isArray(this.state.shipment.ShipmentCompartments) &&
                  this.state.shipment.ShipmentCompartments.length > 0) //&& this.props.shipmentSource === undefined
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <TruckShipmentDetails
                  shipment={this.state.shipment}
                  modShipment={this.state.modShipment}
                  modCustomValues={this.state.modCustomValues}
                  modCompartmentPlans={this.state.modCompartmentPlans}
                  modProductPlans={this.state.modProductPlans}
                  modLoadingDetails={this.state.modLoadingDetails}
                  loadingDetails={this.state.staticLoadingDetails}
                  validationErrors={this.state.validationErrors}
                  listOptions={{
                    terminalCodes: this.props.terminalCodes,
                    quantityUOMOptions: this.state.quantityUOMOptions,
                    vehicleOptions: this.getVehicleSearchOptions(),
                    driverOptions: this.getDriverSearchOptions(),
                    finishedProductOptions: this.state.finishedProductOptions,
                    contractCodeOptions: this.state.contractCodeOptions,
                    orderCodeOptions: this.state.orderCodeOptions,
                    customerDestinationOptions:
                      this.state.customerDestinationOptions,
                    shipmentFromOptions: shipmentFrom,
                    compSeqOptions: this.state.compSeqOptions,
                    topUpDecantOptions: this.state.topUpDecantOptions,
                    transloadingOptions: transloadingOptions,
                    marineReceiptCodes: this.state.marineReceiptCodes,
                    marineReceiptCompCodes: this.state.marineReceiptCompCodes,
                  }}
                  searchResults={{
                    vehicleOptions: this.state.vehicleSearchOptions,
                    driverOptions: this.state.driverSearchOptions,
                  }}
                  selectedProductPlans={this.state.selectedProductPlans}
                  selectedCompartmentPlans={this.state.selectedCompartmentPlans}
                  handleCompartmentPlansSelectionChange={
                    this.handleCompartmentPlansSelectionChange
                  }
                  handleProductPlansSelectionChange={
                    this.handleProductPlansSelectionChange
                  }
                  onFieldChange={this.handleChange}
                  onAllTerminalsChange={this.handleAllTerminalsChange}
                  handleAddCompartmentPlan={this.handleAddCompartmentPlan}
                  handleDeleteCompartmentPlan={this.handleDeleteCompartmentPlan}
                  handleAddProductPlan={this.handleAddProductPlan}
                  handleDeleteProductPlan={this.handleDeleteProductPlan}
                  handleCompartmentPlanCellDataEdit={
                    this.handleCompartmentPlanCellDataEdit
                  }
                  handleProductPlanCellDataEdit={
                    this.handleProductPlanCellDataEdit
                  }
                  onDateTextChange={this.handleDateTextChange}
                  onActiveStatusChange={this.handleActiveStatusChange}
                  onVehicleChange={this.handleVehicleChange}
                  onVehicleSearchChange={this.handleVehicleSearchChange}
                  onDriverSearchChange={this.handleDriverSearchChange}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  shipmentType={this.props.ShipmentType.toLowerCase()}
                  prodTypeTab={
                    this.props.ShipmentType.toLowerCase() === fnSBP
                      ? [this.props.ShipmentType.toLowerCase()]
                      : []
                  }
                  compTypeTab={
                    this.props.ShipmentType.toLowerCase() === fnSBP &&
                      (this.state.isValidationPassed === false ||
                        this.state.shipment.ShipmentDetailsInfo === null ||
                        this.state.shipment.ShipmentDetailsInfo === undefined ||
                        this.state.shipment.ShipmentDetailsInfo.length === 0)
                      ? []
                      : [this.props.ShipmentType.toLowerCase()]
                  }
                  LoadTypeTab={
                    this.state.isPlanned === false ||
                      //this.props.shipmentSource !== undefined ||
                      this.state.shipment.ShipmentCode === "" ||
                      this.state.shipment.ShipmentCode === undefined ||
                      this.state.shipment.ShipmentCode === null ||
                      this.state.shipment.ShipmentDestinationCompartmentsInfo ===
                      null ||
                      this.state.shipment.ShipmentDestinationCompartmentsInfo ===
                      undefined ||
                      this.state.shipment.ShipmentDestinationCompartmentsInfo
                        .length === 0
                      ? []
                      : [""]
                  }
                  customerInventoryTab={
                    this.state.isPlanned === false ||
                      //this.props.shipmentSource !== undefined ||
                      this.state.shipment.ShipmentCode === "" ||
                      this.state.shipment.ShipmentCode === undefined ||
                      this.state.shipment.ShipmentCode === null ||
                      this.state.modCustomValues.CustomerInventory === "FALSE" ||
                      this.state.modCustomValues.CustomerInventory ===
                      undefined ||
                      this.props.userDetails.EntityResult.isEnterpriseNode
                      ? []
                      : [""]
                  }
                  productAllocationTab={
                    this.props.userDetails.EntityResult.IsEnterpriseNode ||
                      //this.props.shipmentSource !== undefined ||
                      this.state.shipment.ShipmentCode === ""
                      ? []
                      : [""]
                  }
                  //productAllocationShareholderTab={this.state.shipment.ShipmentCode === "" || this.state.productShareholderAllocationList.length === 0 ? [] : [""]}
                  toggleExpand={this.toggleExpand}
                  attributeToggleExpand={this.attributeToggleExpand}
                  expandedRows={this.state.expandedRows}
                  attributeValidationErrors={
                    this.state.attributeValidationErrors
                  }
                  handleAttributeCellDataEdit={this.handleAttributeDataEdit}
                  handleCompAttributeCellDataEdit={
                    this.handleCompAttributeCellDataEdit
                  }
                  handleProdPlanAttributeCellDataEdit={
                    this.handleProdPlanAttributeCellDataEdit
                  }
                  selectedAttributeList={this.state.selectedAttributeList}
                  compartmentDetailsPageSize={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize
                  }
                  customerInventory={this.state.customerInventory}
                  activeTab={this.state.activeTab}
                  onTabChange={this.handleTabChange}
                  IsWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  isDisableSubmitForApproval={
                    this.state.isDisableSubmitForApproval
                  }
                  isSlotbookinginUI={
                    this.props.userDetails.EntityResult.ShowSlotBookedInUI
                  }
                  productAllocationList={this.state.productAllocationList}
                  productShareholderAllocationList={
                    this.state.productShareholderAllocationList
                  }
                  ProdAllocEntity={this.state.ProdAllocEntity}
                  handleCellCheck={this.handleCellCheck}
                  handleLoadingDetailsChange={this.handleLoadingDetailsChange}
                  handleTopUpDecantApproval={this.handleTopUpDecantApproval}
                  ddlTopUpDecantStatus={this.state.ddlTopUpDecantStatus}
                  isMarineTransloading={this.state.isMarineTransLoading}
                  isRailTransloading={this.state.isRailTransloading}
                  isPlanned={this.state.isPlanned}
                  updateTransloadingInfo={this.handleUpdateShipmentTransloading}
                  handleTransLoadCompSeq={this.getMarineReceipt}
                  shipmentSource={this.props.shipmentSource}
                  isAutoGeneratedShipmentCode={
                    this.state.isAutoGeneratedShipmentCode
                  }
                  isEnforcingEnabled={this.state.isEnforcingEnabled}
                  isBonded={this.state.isBonded}
                  overrideSequence={this.handleOverrideShipmentSequence}
                  isOverrideSequenceButtonEnabled={
                    this.props.userDetails.EntityResult.IsArchived
                      ? false
                      : this.state.isVehicleChanged
                        ? false
                        : Utilities.isInFunction(
                          this.props.userDetails.EntityResult.FunctionsList,
                          functionGroups.modify,
                          fnOverrideShipmentSeq
                        )
                  }
                  updateShipmentBondNo={this.UpdateShipmentBondNo}
                  isBondButtonenabled={
                    this.props.userDetails.EntityResult.IsArchived
                      ? false
                      : true
                  }
                  updateShipmentAllowed={
                    this.state.modCustomValues.ShipmentUpdateAllow === "TRUE" &&
                    Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.modify,
                      this.props.ShipmentType.toLowerCase()
                    )
                  }
                  ShipmentBay={this.state.ShipmentBay}
                  UpdateShipmentDriver={this.UpdateShipmentDriver}
                  isWebportalCarrierRoleUser= {this.props.userDetails.EntityResult.RoleName.toLowerCase() === "carriercompany" && this.props.userDetails.EntityResult.IsWebPortalUser}
                ></TruckShipmentDetails>
              </ErrorBoundary>
              <ErrorBoundary>
                <TMDetailsUserActions
                  handleBack={this.props.onBack}
                  handleSave={this.handleSave}
                  handleReset={this.handleReset}
                  saveEnabled={this.state.saveEnabled}
                ></TMDetailsUserActions>
              </ErrorBoundary>
            </div>
            {(this.state.isPlanned &&
              Array.isArray(this.state.shipment.ShipmentCompartments) &&
              this.state.shipment.ShipmentCompartments.length > 0) ? ( //&& this.props.shipmentSource === undefined
              <div
                // className="showShipmentStatusLeftPane"
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                <TransactionSummaryOperations
                  title={"ViewAllShipment_Details"}
                  selectedItem={[
                    { Common_Code: this.state.modShipment.ShipmentCode },
                  ]}
                  shipmentNextOperations={this.state.shipmentNextOperations}
                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentShipmentStatuses}
                  unAllowedOperations={[
                    "ManualEntry",
                    "ViewShipment_AuthorizeLoad",
                    "ViewShipment_AllowToLoad",
                    "ViewShipment_RecordWeight",
                    "ViewAllocateBay_AllocateBay",
                    "ViewAllocateBay_DeallocateBay",
                    "ViewShipment_CloseShipment",
                    "ViewShipmentStatus_PrintFAN",
                    "ViewAllShipment_SendBOL",
                  ]}
                  webPortalAllowedOperations={[
                    "ViewShipment_ViewLoadingDetails",
                    "ViewShipmentStatus_ViewBOL",
                    "ViewShipment_ViewAuditTrail",
                  ]}
                  isDetails={true}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  isWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  handleDrawer={this.handleDrawer}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        {this.state.isRecordWeight ? this.handleRecordWeight() : null}
        {this.state.isCloseShipment ? this.handleCloseShipmentModal() : null}
        {this.state.isSealCompartments ? (
          <ErrorBoundary>
            <TruckShipmentSealDetailsComposite
              transactionCode={this.state.shipment.ShipmentCode}
              selectedShareholder={this.props.selectedShareholder}
              sealCompartments={this.state.sealCompartments}
              handleSealClose={this.handleSealClose}
            ></TruckShipmentSealDetailsComposite>
          </ErrorBoundary>
        ) : null}
        {this.state.isNotRevised ? this.confirmAllowToLoad() : null}

        {this.state.vehicleBondPopUp ? this.confirmVehicleBond() : null}
        {this.state.vehicleBondExpiryPopUp
          ? this.confirmVehicleBondExpiryDate()
          : null}
        {this.state.stockProducts ? this.confirmBondedStockProducts() : null}
        {this.state.isLadenWeightValid ? this.confirmRecordLadenWeight() : null}

        {this.state.showShipmentAuthenticationLayout ||
          this.state.showAllowToLoadAuthenticationLayout ||
          this.state.showAuthorizeToLoadAuthenticationLayout ||
          this.state.showCloseShipmentAuthenticationLayout ||
          this.state.showViewBOLAuthenticationLayout ||
          this.state.showPrintBOLAuthenticationLayout ||
          this.state.showFANAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getAddorEditMode()}
            functionGroup={this.getFunctionGroupName()}
            handleOperation={this.handleOperation()}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}

        {this.state.isAllocateBay ? this.confirmAllocateBay() : null}
        {this.state.isDeAllocateBay ? this.confirmDeAllocateBay() : null}
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

export default connect(mapStateToProps)(TruckShipmentDetailsComposite);

TruckShipmentDetailsComposite.propTypes = {
  activeItem: PropTypes.object,
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  ShipmentType: PropTypes.string.isRequired,
  shipmentSource: PropTypes.number,
  shipmentSourceCode: PropTypes.string,
  shipmentSourceCompartmentItems: PropTypes.array,
  shipmentSourceDetails: PropTypes.object,
};
