import React, { Component } from "react";
import { connect } from "react-redux";
import TruckReceiptDetails from "../../UIBase/Details/TruckReceiptDetails";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import * as Utilities from "../../../JS/Utilities";
import { receiptValidationDef } from "../../../JS/ValidationDef";
import { receiptCompartmentValidationDef } from "../../../JS/DetailsTableValidationDef";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import {
  functionGroups,
  fnTruckReceipt,
  fnKPIInformation,
  fnCloseReceipt,
  fnViewReceiptStatus,
  fnPrintBOD,
  fnPrintRAN,
} from "../../../JS/FunctionGroups";
import { emptyReceipt } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import { TranslationConsumer } from "@scuf/localization";
import TruckReceiptManualEntryDetailsComposite from "../Details/TruckReceiptManualEntryDetailsComposite";
import { TruckReceiptViewAuditTrailDetails } from "../../UIBase/Details/TruckReceiptViewAuditTrailsDetails";
import { TruckReceiptViewUnLoadingDetails } from "../../UIBase/Details/TruckReceiptViewUnLoadingDetails";
import {
  receiptAttributeEntity,
  receiptOriginTerminalCompartment,
} from "../../../JS/AttributeEntity";
import { Modal, Button, Select, Input, Checkbox } from "@scuf/common";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiTruckReceiptDetail } from "../../../JS/KPIPageName";
import TruckReceiptSealDetailsComposite from "../Details/TruckReceiptSealDetailsComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { DataTable } from "@scuf/datatable";

class TruckReceiptDetailsComposite extends Component {
  state = {
    receipt: {},
    modReceipt: {},
    modAssociations: [],
    modCompartments: [],
    modCustomerInventory: [],
    vehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    modVehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    validationErrors:
      Utilities.getInitialValidationErrors(receiptValidationDef),
    isReadyToRender: false,
    saveEnabled: false,
    selectedAssociations: [],
    selectedCustomerInventory: [],
    vehicleOptions: [],
    driverOptions: [],
    quantityUOMOptions: [],
    finishedProductOptions: [],
    baseProductCodeOptions: [],
    compSeqOptions: [],
    supplierOriginTerminalsList: [],
    vehicleSearchOptions: [],
    driverSearchOptions: [],
    isPlanned: false,
    activeTab: 0,
    shipmentNextOperations: [],
    currentReceiptStatus: [],
    isManualEntry: false,
    expandedRows: [],
    customerInventoryTab: false,
    customerptions: [],
    customerInventory: [],
    customerCode: [],
    baseProductOptions: [],
    customerOptions: [],
    compartmentTab: false,
    auditTrailList: [],
    modAuditTrailList: [],
    ModViewUnloadDetails: [],
    attributeMetaDataList: [],
    attributeValidationErrors: [],
    selectedAttributeList: [],
    supplierOptions: [],
    receiptCompartmentDetails: [],
    forceCompleteIsDisable: false,
    IsPastDisable: false,
    SupplierEnable: false,
    isHSEInspectionEnable: false,
    drawerStatus:
      this.props.userDetails.EntityResult.IsWebPortalUser === true
        ? true
        : false,
    compartmentAttributeMetaDataList: [],
    isRecordWeight: false,
    isSealCompartments: false,
    sealCompartments: [],
    recordWeightList: [],
    weighBridgeCode: "",
    scadaValue: "",
    allowOutofRangeTW: false,
    isBonded: false,
    bondExpiryDate: null,
    isVehicleBonded: false,
    vehicleBondPopUp: false,
    vehicleBondExpiryPopUp: false,
    stockProducts: false,
    loadingExpandedRows: [],
    recordweightTab: false,
    customerinventoryChange: false,
    compartmentChange: false,
    modRecordWeight: [],
    isCloseReceipt: false,
    reasonForClosure: "",
    modCustomValues: {},
    truckReceiptKPIList: [],
    showReceiptAuthenticationLayout: false,
    showAuthorizeToUnLoadAuthenticationLayout: false,
    showAllowToUnLoadAuthenticationLayout: false,
    showCloseReceiptAuthenticationLayout: false,
    showViewBODAuthenticationLayout: false,
    showPrintBODAuthenticationLayout: false,
    showRANAuthenticationLayout: false,
    tempReceipt: {},
    isAllocateBay: false,
    bayData: [],
    selectBay: [],
    isDeAllocateBay: false,
    ReceiptBay: "",
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      // this.getReceipt(this.props.selectedRow);
      this.GetUOMList();
      this.getVehicleCodes(this.props.selectedShareholder);
      this.getDriverCodes(this.props.selectedShareholder);
      this.getFinishedProductCodes(this.props.selectedShareholder);
      this.GetSupplierOriginTerminals(this.props.selectedShareholder);
      this.getLookUpData();
      this.getcustomerList(this.props.selectedShareholder);
      this.GetViewAllReceiptCustomData();
      //  this.getReceiptCompartmentDetails(this.props.selectedRow);
      this.getBaseProducts("");
      this.getAttributes(this.props.selectedRow);
      this.getReceiptConfigLookUpTypeName();
      this.getReceiptBYCompartmentLookUpData();
      this.getLookUpHsEInSpectionEnableData();
      this.IsBonded();
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    try {
      let ReceiptCode = this.state.receipt.receiptCode;
      if (
        ReceiptCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.setState({ isPlanned: false, activeTab: 0, isManualEntry: false });
        this.getReceipt(nextProps.selectedRow, 0);
      }
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  updateReceipt(modReceipt) {
    let keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: modReceipt.ReceiptCode,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
      Entity: modReceipt,
    };

    let notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Receipt_Code"],
          keyValues: [modReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        this.handleAuthenticationClose();
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnTruckReceipt
              ),
            },
            () => this.getReceipt({ Common_Code: modReceipt.ReceiptCode })
          );
        } else {
          this.handleAuthenticationClose();
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnTruckReceipt
            ),
          });
          console.log("Error in UpdateReceipt:", result.ErrorList);
        }
        this.props.onSaved(modReceipt, "add", notification);
      })
      .catch((error) => {
        this.handleAuthenticationClose();
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTruckReceipt
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modReceipt, "add", notification);
      });
  }

  createReceipt(modReceipt) {
    let keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: modReceipt.ReceiptCode,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
      Entity: modReceipt,
    };

    let notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Receipt_Code"],
          keyValues: [modReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        this.handleAuthenticationClose();
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              // saveEnabled: Utilities.isInFunction(
              //   this.props.userDetails.EntityResult.FunctionsList,
              //   functionGroups.modify,
              //   fnTruckReceipt
              // ),
            },
            () => this.getReceipt({ Common_Code: modReceipt.ReceiptCode })
          );
        } else {
          this.handleAuthenticationClose();
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
          console.log("Error in CreateReceipt:", result.ErrorList);
        }
        this.props.onSaved(modReceipt, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true,
        });
        this.handleAuthenticationClose();
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modReceipt, "add", notification);
      });
  }

  validateSave(modReceipt, attributeList) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(receiptValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          receiptValidationDef[key],
          modReceipt[key]
        );
      });
      if (modReceipt.Active !== this.state.receipt.Active) {
        if (modReceipt.Remarks === null || modReceipt.Remarks === "") {
          validationErrors["Remarks"] = "Receipt_RemarksRequired";
        }
      }

      // if (validationErrors["VehicleCode"] === "") {
      //   let vehicleIdentified = this.state.vehicleOptions.find(
      //     (element) =>
      //       element.title.toLowerCase() === modReceipt.VehicleCode.toLowerCase()
      //   );
      //   if (vehicleIdentified === undefined) {
      //     validationErrors["VehicleCode"] =
      //       "ShipmentCompDetail_VEHICLECODENULLOREMPTY";
      //   }
      // }
      // if (
      //   modReceipt.DriverCode !== null &&
      //   modReceipt.DriverCode !== "" &&
      //   validationErrors["DriverCode"] === ""
      // ) {
      //   let driverIdentified = this.state.driverOptions.find(
      //     (element) =>
      //       element.title.toLowerCase() === modReceipt.DriverCode.toLowerCase()
      //   );
      //   if (driverIdentified === undefined) {
      //     validationErrors["DriverCode"] = "DriverInfo_DriverNotFound";
      //   }
      // }
      let notification = {
        messageType: "critical",
        message: "Receipt_SavedStatus",
        messageResultDetails: [],
      };

      let uniqueRecords = [
        ...new Set(
          modReceipt.ReceiptOriginTerminalCompartmentsInfo.map(
            (a) => a.CompartmentSeqNoInVehicle
          )
        ),
      ];
      if (
        uniqueRecords.length !==
        modReceipt.ReceiptOriginTerminalCompartmentsInfo.length
      ) {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "Duplicate_Compartment_Details",
        });
        this.props.onSaved(this.state.modReceipt, "update", notification);
        return false;
      }

      if (
        Array.isArray(modReceipt.ReceiptOriginTerminalCompartmentsInfo) &&
        modReceipt.ReceiptOriginTerminalCompartmentsInfo.length > 0
      ) {
        modReceipt.ReceiptOriginTerminalCompartmentsInfo.forEach(
          (receiptCompartment) => {
            receiptCompartmentValidationDef.forEach((col) => {
              let err = "";

              if (col.validator !== undefined) {
                err = Utilities.validateField(
                  col.validator,
                  receiptCompartment[col.field]
                );
              }

              if (err !== "") {
                notification.messageResultDetails.push({
                  keyFields: ["Receipt_CompSeqInVehicle", col.displayName],
                  keyValues: [
                    receiptCompartment.CompartmentSeqNoInVehicle,
                    receiptCompartment[col.field],
                  ],
                  isSuccess: false,
                  errorMessage: err,
                });
              }
            });
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
      if (modReceipt.ReceiptOriginTerminalCompartmentsInfo.length > 0) {
        modReceipt.ReceiptOriginTerminalCompartmentsInfo.forEach((com) => {
          receiptCompartmentValidationDef.forEach((col) => {
            let err = "";

            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, com[col.field]);
            }

            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: [col.displayName],
                keyValues: [com[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });

          if (
            com.AttributesforUI !== null &&
            com.AttributesforUI !== undefined
          ) {
            com.AttributesforUI.forEach((item) => {
              let errMsg = Utilities.valiateAttributeField(
                item,
                item.AttributeValue
              );
              if (errMsg !== "") {
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  notification.messageResultDetails.push({
                    keyFields: ["CompAttributeTerminal", item.AttributeName],
                    keyValues: [
                      com.CompartmentSeqNoInVehicle,
                      item.TerminalCode,
                      item.AttributeValue,
                    ],
                    isSuccess: false,
                    errorMessage: errMsg,
                  });
                } else {
                  notification.messageResultDetails.push({
                    keyFields: [item.AttributeName],
                    keyValues: [
                      com.CompartmentSeqNoInVehicle,
                      item.AttributeValue,
                    ],
                    isSuccess: false,
                    errorMessage: errMsg,
                  });
                }
              }
            });
          }
          this.attributeToggleExpand(com, true, true);
        });
      }
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

      if (notification.messageResultDetails.length > 0) {
        this.props.onSaved(this.state.modReceipt, "update", notification);
        return false;
      }

      return returnValue;
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on ValidateSave",
        error
      );
    }
  }
  convertStringtoDecimal(modReceipt, attributeList) {
    try {
      modReceipt.ReceiptOriginTerminalCompartmentsInfo.forEach((sc) => {
        sc.Quantity = Utilities.convertStringtoDecimal(sc.Quantity);
      });
      modReceipt = this.fillAttributeDetails(modReceipt, attributeList);
      return modReceipt;
    } catch (err) {
      console.log("convertStringtoDecimal on trailer details", err);
    }
  }

  handleSaveReceipt = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempReceipt = lodash.cloneDeep(this.state.tempReceipt);

      this.state.receipt.ReceiptCode === ""
        ? this.createReceipt(tempReceipt)
        : this.updateReceipt(tempReceipt);
    } catch (error) {
      console.log("Receipt Details Composite : Error in handleSaveReceipt");
    }
  };

  saveReceipt = () => {
    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    modReceipt.ReceiptOriginTerminalCompartmentsInfo = this.fillDetails(
      this.state.modAssociations
    );
    modReceipt.CustomerInventoryPlanList = this.fillCustomerInvetoryDetails(
      this.state.modCustomerInventory
    );
    let attributeList = Utilities.attributesConverttoLocaleString(
      this.state.selectedAttributeList
    );
    // this.setState({ saveEnabled: false });

    if (this.validateSave(modReceipt, attributeList)) {
      // modReceipt.ReceiptOriginTerminalCompartmentsInfo.forEach((sc) => {
      //   sc.Quantity = Utilities.convertStringtoDecimal(sc.Quantity);
      // });
      modReceipt = this.convertStringtoDecimal(modReceipt, attributeList);

      let showReceiptAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempReceipt = lodash.cloneDeep(modReceipt);
      this.setState({ showReceiptAuthenticationLayout, tempReceipt }, () => {
        if (showReceiptAuthenticationLayout === false) {
          this.handleSaveReceipt();
        }
      });
    } else {
      this.setState({ saveEnabled: true });
    }
  };
  handleSave = () => {
    try {
      const saveCompartmentDetails = this.handleSaveCompartmentDetailsEnabled();
      let receipt = lodash.cloneDeep(this.state.receipt);
      var viewTab = lodash.cloneDeep(this.state.activeTab);
      if (
        viewTab === 1 &&
        receipt.ReceiptStatus !== Constants.Receipt_Status.READY &&
        receipt.ReceiptCode !== "" &&
        saveCompartmentDetails
      ) {
        this.compartmentDetailsSave();
      } else {
        let modReceipt = lodash.cloneDeep(this.state.modReceipt);
        if (modReceipt.IsBonded) {
          if (!this.state.isVehicleBonded) {
            this.setState({ vehicleBondPopUp: true });
          } else if (
            this.state.bondExpiryDate !== "" &&
            this.state.bondExpiryDate !== null &&
            this.state.bondExpiryDate !== undefined
          ) {
            this.setState({ vehicleBondExpiryPopUp: true });
          }
        } else {
          this.saveReceipt();
        }
      }
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillDetails(modAssociations) {
    let compartmentDetails = [];
    try {
      if (Array.isArray(modAssociations)) {
        let modReceipt = lodash.cloneDeep(this.state.modReceipt);
        modAssociations.forEach((comp) => {
          if (
            !(
              comp.CompartmentSeqNoInVehicle === null ||
              comp.CompartmentSeqNoInVehicle === ""
            ) ||
            !(comp.CompartmentCode === null || comp.CompartmentCode === "") ||
            !(comp.TrailerCode === null || comp.TrailerCode === "") ||
            !(
              comp.FinishedProductCode === null ||
              comp.FinishedProductCode === ""
            ) ||
            !!(comp.Quantity === null || comp.Quantity === "")
          )
            if (
              comp.AttributesforUI !== undefined &&
              comp.AttributesforUI != null
            )
              comp.AttributesforUI =
                Utilities.compartmentAttributesConverttoLocaleString(
                  comp.AttributesforUI
                );
          {
            compartmentDetails.push({
              CompartmentCode: comp.CompartmentCode,
              CompartmentSeqNoInVehicle: comp.CompartmentSeqNoInVehicle,
              TrailerCode: comp.TrailerCode,
              CompartmentSeqNoInTrailer: comp.CompartmentSeqNoInTrailer,
              Quantity: comp.Quantity.toLocaleString(),
              QuantityUOM: this.state.modReceipt.ReceiptQuantityUOM,
              FinishedProductCode: comp.FinishedProductCode,
              OriginTerminalCode: comp.OriginTerminalCode,
              ShareholderCode: this.props.selectedShareholder,
              SupplierCode:
                this.state.SupplierEnable === false
                  ? modReceipt.SupplierCode
                  : comp.SupplierCode,
              ReceiptCode: modReceipt.ReceiptCode,
              AttributesforUI: comp.AttributesforUI,
            });
          }
        });
      }
    } catch (error) {
      console.log("Error while making receipt body:", error);
    }
    return compartmentDetails;
  }
  fillCustomerInvetoryDetails(modCustomerInventory) {
    let customerInventory = lodash.cloneDeep(this.state.customerInventory);
    try {
      if (Array.isArray(modCustomerInventory)) {
        modCustomerInventory.forEach((comp) => {
          if (
            !(comp.CustomerCode === null || comp.CustomerCode === "") ||
            comp.FinishedProductCode === null ||
            comp.FinishedProductCode === "" ||
            !!(comp.PlannedQuantity === null || comp.PlannedQuantity === "")
          ) {
            customerInventory.push({
              CustomerCode: comp.CustomerCode,
              FinishedProductCode: comp.FinishedProductCode,
              BaseProductCode: comp.BaseProductCode,
              PlannedQuantity: comp.PlannedQuantity.toLocaleString(),
              ShareholderCode: this.props.selectedShareholder,
              // ReceiptCode: modReceipt.ReceiptCode,
              QuantityUOM: this.state.modReceipt.ReceiptQuantityUOM,
            });
          }
        });
      }
    } catch (error) {
      console.log("Error while making receipt body:", error);
    }
    return customerInventory;
  }
  fillCompartmentPlanDetails(modCompartmentsdetails) {
    console.log("modLoadingDetails", modCompartmentsdetails);
    let ViewReceiptCompData = [];
    if (Array.isArray(modCompartmentsdetails.Table)) {
      modCompartmentsdetails.Table.forEach((comp) => {
        comp.adjustedquantity = 0;
        ViewReceiptCompData.push({
          TrailerCode: comp.trailercode,
          CompartmentCode: comp.compartmentcode,
          CompartmentStaus: comp.CompartmentStatus,
          FinishedProductCode: comp.finishedproductcode,
          AdjustedQuantity: "",
          Quantity: comp.Quantity !== null ? comp.Quantity.toString() : "",
          revisedplannedquantity:
            comp.revisedplannedquantity - comp.adjustedquantity < 0
              ? comp.revisedplannedquantity
              : (
                  comp.revisedplannedquantity - comp.adjustedquantity
                ).toString() +
                " " +
                comp.compartmentuom,
          UnLoadedQuantity:
            Math.round(comp.loadedquantity) + " " + comp.compartmentuom,
          CompSeqNoInVehicle: comp.compartmentseqnoinvehicle,
          ForceCompleted:
            comp.CompartmentStatus ===
            Constants.ReceiptCompartment_Status.FORCE_COMPLETED
              ? true
              : false,
        });
      });
    }
    ViewReceiptCompData =
      Utilities.addSeqNumberToListObject(ViewReceiptCompData);

    return ViewReceiptCompData;
  }
  fillRecorWeightDetails(modRecordWeightDetails) {
    let ReceiptTrailerWeighbridgeInfo = [];
    if (Array.isArray(modRecordWeightDetails)) {
      modRecordWeightDetails.forEach((comp) => {
        ReceiptTrailerWeighbridgeInfo.push({
          TrailerCode: comp.trailercode,
          WeighbridgeCode: comp.WeighbridgeCode,
          MeasuredWeight: comp.MeasuredWeight + " " + comp.WeightUOM,
          MeasuredWeightTime:
            new Date(comp.MeasuredWeightTime).toLocaleDateString() +
            " " +
            new Date(comp.MeasuredWeightTime).toLocaleTimeString(),
          weight: comp.IsTareWeight === true ? "Tare Weight" : "Laden Weight",
        });
      });
    }
    ReceiptTrailerWeighbridgeInfo = Utilities.addSeqNumberToListObject(
      ReceiptTrailerWeighbridgeInfo
    );

    return ReceiptTrailerWeighbridgeInfo;
  }
  handleDriverChange = (driverCode) => {
    try {
      // this.getVehicle(vehicleCode, true);
      let modReceipt = lodash.cloneDeep(this.state.modReceipt);
      modReceipt.DriverCode = driverCode;
      let validationErrors = lodash.cloneDeep(this.state.validationErrors);
      validationErrors["DriverCode"] = "";
      this.setState({ validationErrors, modReceipt });
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on handleDriverChange",
        error
      );
    }
  };

  handleSealCompartments(receiptCode, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetSealCompartmentsforReceipt,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while handleBSIOutbound:", error);
      });
  }

  handleSealClose = () => {
    this.setState({
      isSealCompartments: false,
      sealCompartments: [],
    });
  };

  handleDriverSearchChange = (driverCode) => {
    let driverOptions = lodash.cloneDeep(this.state.driverOptions);
    try {
      let driverSearchOptions = driverOptions.filter((item) =>
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
      console.log(":Error occured on handleDriverSearchChange", error);
    }
  };
  handleVehicleChange = (vehicleCode) => {
    try {
      this.getVehicle(vehicleCode, true);
      let validationErrors = lodash.cloneDeep(this.state.validationErrors);
      validationErrors["VehicleCode"] = "";
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite::Error occured on handleVehicleChange",
        error
      );
    }
  };
  // handleVehicleSearchChange = (vehicleCode) => {
  //   try {
  //     let validationErrors = lodash.cloneDeep(this.state.validationErrors);
  //     let modReceipt = lodash.cloneDeep(this.state.modReceipt);
  //     modReceipt.VehicleCode = vehicleCode;
  //     let vehicleSearchOptions = this.state.vehicleOptions.filter((item) =>
  //       item.title.toLowerCase().includes(vehicleCode.toLowerCase())
  //     );
  //     if (vehicleSearchOptions.length > 100) {
  //       vehicleSearchOptions = vehicleSearchOptions.slice(0, 100);
  //     }

  //     // this.setState({
  //     //   vehicleSearchOptions,
  //     //   modReceipt,
  //     // });

  //     let vehicleIdentified = this.state.vehicleOptions.find(
  //       (element) => element.title.toLowerCase() === vehicleCode.toLowerCase()
  //     );
  //     // if (vehicleIdentified !== undefined) {
  //     //   this.handleVehicleChange(vehicleCode);
  //     // } else {
  //     modReceipt.CarrierCode = "";
  //     if (vehicleIdentified === undefined) {
  //       validationErrors["VehicleCode"] =
  //         "ShipmentCompDetail_VEHICLECODENULLOREMPTY";
  //     }
  //     this.setState({
  //       vehicleSearchOptions,
  //       validationErrors,
  //       modReceipt,
  //     });
  //   } catch (error) {
  //     console.log(
  //       "TruckReceiptDetailsComposite:Error occured on handleVehicleSearchChange",
  //       error
  //     );
  //   }
  // };

  handleDriverResultsClear = () => {
    try {
      let modReceipt = lodash.cloneDeep(this.state.modReceipt);
      let validationErrors = lodash.cloneDeep(this.state.validationErrors);
      validationErrors["DriverCode"] = "";
      modReceipt.DriverCode = "";
      this.setState({
        validationErrors,
        modReceipt,
      });
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on handleDriverResultsClear",
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

  handleVehicleResultsClear = () => {
    try {
      let modReceipt = lodash.cloneDeep(this.state.modReceipt);
      let validationErrors = lodash.cloneDeep(this.state.validationErrors);
      let modAssociations = [];
      let compSeqOptions = [];
      let modVehicleDetails = { carrierCode: "", vehicleCompartments: [] };
      validationErrors["VehicleCode"] = "ShipmentCompDetail_MandatoryVehicle";
      modReceipt.VehicleCode = null;
      modReceipt.CarrierCode = null;
      this.setState({
        validationErrors,
        modReceipt,
        modAssociations,
        compSeqOptions,
        modVehicleDetails,
      });
    } catch (error) {
      console.log(
        "ShipmentByCompartmentComposite:Error occured on handleVehicleResultsClear",
        error
      );
    }
  };
  getVehicle(vehicleCode, vehicleChanged) {
    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    let modVehicleDetails = lodash.cloneDeep(this.state.modVehicleDetails);
    modReceipt.VehicleCode = vehicleCode;
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
            modReceipt.CarrierCode = result.EntityResult.CarrierCompanyCode;
            modVehicleDetails.carrierCode =
              result.EntityResult.CarrierCompanyCode;
            modVehicleDetails.vehicleCompartments =
              this.getCompartmentDetailsFromVehicle(result.EntityResult);
            let compSeqOptions = [];
            modVehicleDetails.vehicleCompartments.forEach(
              (vehicleCompartment) =>
                compSeqOptions.push({
                  text: vehicleCompartment.vehCompSeq,
                  value: vehicleCompartment.vehCompSeq,
                })
            );
            if (vehicleChanged) {
              let modAssociations =
                this.getReceiptCompartmentFromVehicleCompartment(
                  modVehicleDetails.vehicleCompartments
                );
              modAssociations =
                Utilities.addSeqNumberToListObject(modAssociations);
              this.setState({ modAssociations }, () => {
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  this.terminalSelectionChange(modReceipt.TerminalCodes);
                } else {
                  this.localNodeAttribute();
                }
              });
              if (this.state.receipt.VehicleCode !== vehicleCode) {
                modAssociations =
                  Utilities.addSeqNumberToListObject(modAssociations);
              }
            }
            modReceipt.IsBonded = this.state.isBonded
              ? result.EntityResult.IsBonded
                ? true
                : modReceipt.IsBonded
              : false;
            let bondExpiryDate = result.EntityResult.BondExpiryDate;
            this.setState({
              modReceipt,
              modVehicleDetails,
              compSeqOptions,
              bondExpiryDate: bondExpiryDate,
              isVehicleBonded: result.EntityResult.IsBonded ? true : false,
            });

            if (this.state.receipt.VehicleCode === modReceipt.VehicleCode) {
              let vehicleDetails = lodash.cloneDeep(modVehicleDetails);
              this.setState({ vehicleDetails });
            }
          }
        } else {
          this.setState({ modReceipt });

          console.log(
            "TruckReceiptDetailsComposite:Error in GetVehicle:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ modReceipt });

        console.log(
          "TruckReceiptDetailsComposite:Error while getting Vehicle:",
          error
        );
      });
  }

  getReceiptCompartmentFromVehicleCompartment(vehicleCompartments) {
    let receiptCompartments = [];
    if (Array.isArray(vehicleCompartments)) {
      for (let i = 0; i < vehicleCompartments.length; i++) {
        let vehicleCompartment = vehicleCompartments[i];
        let receiptCompartment = {
          CompartmentCode: vehicleCompartment.compCode,
          CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
          TrailerCode: vehicleCompartment.trailerCode,
          CompartmentSeqNoInTrailer: vehicleCompartment.trailerCompSeq,
          Quantity:
            vehicleCompartment.SFL !== null && vehicleCompartment.SFL !== ""
              ? vehicleCompartment.SFL.toLocaleString()
              : null,
          QuantityUOM: vehicleCompartment.UOM,
          FinishedProductCode: "",
          ShareholderCode: this.props.selectedShareholder,
          SupplierCode: "",
          OriginTerminalCode: "",
          ReceiptCode: "",
        };
        receiptCompartments.push(receiptCompartment);
      }
    }
    return receiptCompartments;
  }

  handleActiveStatusChange = (value) => {
    try {
      let modReceipt = lodash.cloneDeep(this.state.modReceipt);
      modReceipt.Active = value;
      if (modReceipt.Active !== this.state.receipt.Active)
        modReceipt.Remarks = "";
      this.setState({ modReceipt });
    } catch (error) {
      console.log(error);
    }
  };

  handleAddAssociation = () => {
    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    if (
      !this.props.userDetails.EntityResult.IsArchived &&
      modReceipt.ReceiptStatus === "READY"
    ) {
      try {
        if (
          this.state.modAssociations.length <
          this.state.modVehicleDetails.vehicleCompartments.length
        ) {
          let modAssociations = lodash.cloneDeep(this.state.modAssociations);
          let newComp = {
            CompartmentCode: null,
            CompartmentSeqNoInVehicle: null,
            CompartmentSeqNoInTrailer: null,
            Quantity: null,
            QuantityUOM: "",
            FinishedProductCode: "",
            ShareholderCode: this.props.selectedShareholder,
            Attributes: [],
            OriginTerminalCode: "",
            SupplierCode: "",
            TrailerCode: "",
          };
          newComp.SeqNumber =
            Utilities.getMaxSeqNumberfromListObject(modAssociations);
          modAssociations.push(newComp);
          this.setState(
            {
              modAssociations,
              selectedAssociations: [],
            },
            () => {
              if (
                this.props.userDetails.EntityResult.IsEnterpriseNode === false
              ) {
                var attributeMetaDataList = lodash.cloneDeep(
                  this.state.compartmentAttributeMetaDataList
                );
                if (attributeMetaDataList.length > 0)
                  this.formCompartmentAttributes([
                    attributeMetaDataList[0].TerminalCode,
                  ]);
              } else this.formCompartmentAttributes(modReceipt.TerminalCodes);
            }
          );
        }
      } catch (error) {
        console.log(
          "TruckReceiptDetailsComposite:Error occured on handleAddCompartment",
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
              modAssociations = modAssociations.filter((com, cindex) => {
                return com.SeqNumber !== obj.SeqNumber;
              });
              //  modCustomerInventory = modCustomerInventory.filter(
              //   (customer) => {
              //     return (
              //       customer.FinishedProductCode !==
              //       obj.FinishedProductCode
              //     );
              //   }
              // );
            });
            this.setState({ modAssociations, selectedAssociations: [] });
          }
        }

        // this.setState({ selectedAssociations: [] });
      } catch (error) {
        console.log(
          "RigidtruckDetailsComposite:Error occured on handleDeleteCompartment",
          error
        );
      }
    }
  };
  GetViewAllReceiptCustomData(receiptRow, activeTab) {
    try {
      var keyCode = [];
      if (receiptRow !== undefined)
        keyCode = [
          {
            key: KeyCodes.receiptCode,
            value: receiptRow.ReceiptCode,
          },
          {
            key: KeyCodes.receiptStatus,
            value: receiptRow.ReceiptStatus,
          },
          {
            key: KeyCodes.vehicleCode,
            value: receiptRow.VehicleCode,
          },
          {
            key: KeyCodes.actualTerminalCode,
            value: receiptRow.ActualTerminalCode,
          },
        ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.receiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetViewAllReceiptCustomData,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            var result = response.data.EntityResult;
            if (receiptRow !== undefined) {
              this.setState({
                saveEnabled:
                  activeTab === 1
                    ? Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.modify,
                        fnTruckReceipt
                      )
                    : result.ReceiptUpdateAllow === "TRUE" &&
                      Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.modify,
                        fnTruckReceipt
                      )
                    ? true
                    : false,
                // },
                // () => {
                //   if (
                //     response.data.EntityResult.CustomerInventory === "TRUE" &&
                //     receiptRow !== undefined
                //   )
                //     this.getCustomerInventory(receiptRow);
                modCustomValues: response.data.EntityResult,
              });
            } else
              this.setState({
                modCustomValues: response.data.EntityResult,
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnTruckReceipt
                ),
              });
          } else this.setState({ modCustomValues: {}, customerInventory: [] });
        })
        .catch((error) => {
          console.log(
            "Error while getting shipment custom details:",
            error,
            receiptRow
          );
        });
    } catch (error) {
      console.log("Error in Custom Data retrieve", error);
    }
  }
  handleReset = () => {
    try {
      let vehicleDetails = lodash.cloneDeep(this.state.vehicleDetails);
      var modReceipt = lodash.cloneDeep(this.state.receipt);
      let modAssociations = [];
      let compSeqOptions = [];
      let modCustomerInventory = [];
      let modCompartments = [];
      if (this.state.receipt.ReceiptCode === "") {
        modAssociations = [];
        compSeqOptions = [];
        modCustomerInventory = [];
        // modCompartments = [];
      } else {
        modAssociations = this.getReceiptCompartmentFromReceipt(
          this.state.receipt
        );
        modCustomerInventory = this.getReceiptCustomerInventory(
          this.state.receipt
        );
        modCompartments = this.getReceiptCompartmentDetails(this.state.receipt);
        vehicleDetails.vehicleCompartments.forEach((vehicleCompartment) =>
          compSeqOptions.push({
            text: vehicleCompartment.vehCompSeq,
            value: vehicleCompartment.vehCompSeq,
          })
        );
      }
      this.setState(
        {
          modReceipt: lodash.cloneDeep(this.state.receipt),
          validationErrors: [],
          modVehicleDetails: lodash.cloneDeep(this.state.vehicleDetails),
          modAssociations,
          compSeqOptions,
          modCompartments,
          modCustomerInventory,
          // compartmentTab: false,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modReceipt.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on handleReset",
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
      var modReceipt = lodash.cloneDeep(this.state.modReceipt);

      if (checked) modReceipt.TerminalCodes = [...terminalCodes];
      else modReceipt.TerminalCodes = [];
      this.setState({ modReceipt });
      this.terminalSelectionChange(modReceipt.TerminalCodes);
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleAssociationSelectionChange = (associations) => {
    this.setState({ selectedAssociations: associations });
  };

  handleSupplierChange = (supplierCode) => {
    const modReceipt = lodash.cloneDeep(this.state.modReceipt);
    modReceipt.SupplierCode = supplierCode;
    let validationErrors = lodash.cloneDeep(this.state.validationErrors);
    validationErrors["SupplierCode"] = "";
    this.setState({ validationErrors });

    const modAssociations = lodash.cloneDeep(this.state.modAssociations);
    let supplierOriginTerminalsList = this.state.supplierOriginTerminalsList;
    if (
      supplierOriginTerminalsList !== undefined &&
      supplierOriginTerminalsList !== null
    ) {
      if (
        supplierOriginTerminalsList[supplierCode] !== undefined &&
        Array.isArray(supplierOriginTerminalsList[supplierCode]) &&
        supplierOriginTerminalsList[supplierCode].length === 1
      ) {
        modAssociations.forEach((com) => {
          com.OriginTerminalCode = supplierOriginTerminalsList[supplierCode][0];
        });
      } else {
        modAssociations.forEach((com) => {
          com.OriginTerminalCode = "";
        });
      }
    }

    this.setState({ modReceipt, modAssociations });
  };
  UpdateReceiptBondNo = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.receiptCode,
          value: this.state.receipt.ReceiptCode,
        },
        {
          key: KeyCodes.receiptBondNo,
          value: this.state.modReceipt.BondNo,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.receiptCode,
        KeyCodes: keyCode,
      };

      let notification = {
        messageType: "critical",
        message: "ReceiptBondUpdate_Status",
        messageResultDetails: [
          {
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.modReceipt.ReceiptCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateReceiptBond,
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
            this.getReceipt({
              Common_Code: this.state.modReceipt.ReceiptCode,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in UpdateReceipt:", result.ErrorList);
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


  UpdateReceiptDriver = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.receiptCode,
          value: this.state.receipt.ReceiptCode,
        },
        {
          key: KeyCodes.driverCode,
          value: this.state.modReceipt.DriverCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.receiptCode,
        KeyCodes: keyCode,
      };

      let notification = {
        messageType: "critical",
        message: "DriverCode_UpdateStatus",
        messageResultDetails: [
          {
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.receipt.ReceiptCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateReceiptDriver,
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
            this.getReceipt(
              { Common_Code: this.state.receipt.ReceiptCode },
              0,
              notification
            );
          } else {
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
            console.log("Error Receipt Driver Update:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while Receipt Driver Update:", error);
        });
    } catch (error) {
      console.log("Error while Receipt Driver Update:", error);
    }
  };

  handleChange = (propertyName, data) => {
    try {
      const modReceipt = lodash.cloneDeep(this.state.modReceipt);
      modReceipt[propertyName] = data;
      this.setState({ modReceipt });
      if (receiptValidationDef[propertyName] !== undefined) {
        var validationErrors = { ...this.state.validationErrors };
        validationErrors[propertyName] = Utilities.validateField(
          receiptValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      if (propertyName === "IsBonded") {
        modReceipt["BondNo"] = "";
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = { ...this.state.validationErrors };
      var modReceipt = lodash.cloneDeep(this.state.modReceipt);
      validationErrors[propertyName] = error;
      modReceipt[propertyName] = value;
      this.setState({ validationErrors, modReceipt });
    } catch (error) {
      console.log(
        "TruckReceiptDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };
  handleCellCheck = (data, cellData) => {
    let modCompartments = lodash.cloneDeep(this.state.modCompartments);
    let expandedRows = lodash.cloneDeep(this.state.expandedRows);
    const index = modCompartments.findIndex((item) => {
      return item.SeqNumber === data.rowData.SeqNumber;
    });
    if (index > -1) {
      modCompartments[index].ForceCompleted = cellData;
    }
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.SeqNumber === data.rowData.SeqNumber
    );
    if (expandedRowIndex >= 0) {
      expandedRows.splice(expandedRowIndex, 1);
    }
    this.setState({ modCompartments });
    this.toggleExpand(modCompartments[data.rowIndex], false);
  };
  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    modAssociations[cellData.rowIndex][cellData.field] = newVal;
    if (cellData.field === "CompartmentSeqNoInVehicle") {
      let vehicleDetails = this.state.modVehicleDetails;
      let vehicleCompartments = vehicleDetails.vehicleCompartments.filter(
        (vc) => vc.vehCompSeq.toString() === newVal.toString()
      );
      let supplierOriginOptions = lodash.cloneDeep(
        this.state.supplierOriginTerminalsList
      );
      let supplierOptions = lodash.clone(this.state.supplierOptions);
      if (vehicleCompartments.length > 0) {
        modAssociations[cellData.rowIndex]["Quantity"] =
          vehicleCompartments[0].SFL !== null &&
          vehicleCompartments[0].SFL !== ""
            ? vehicleCompartments[0].SFL.toLocaleString()
            : null;
        modAssociations[cellData.rowIndex]["TrailerCode"] =
          vehicleCompartments[0].trailerCode;
        modAssociations[cellData.rowIndex]["CompartmentCode"] =
          vehicleCompartments[0].compCode;
        modAssociations[cellData.rowIndex]["QuantityUOM"] =
          vehicleCompartments[0].UOM;
        modAssociations[cellData.rowIndex]["OriginTerminalCode"] =
          Array.isArray(
            supplierOriginOptions[this.state.modReceipt.SupplierCode]
          ) &&
          supplierOriginOptions[this.state.modReceipt.SupplierCode].length === 1
            ? supplierOriginOptions[this.state.modReceipt.SupplierCode][0]
            : "";
        modAssociations[cellData.rowIndex]["SupplierCode"] =
          Array.isArray(supplierOptions[this.state.modReceipt.SupplierCode]) &&
          supplierOptions[this.state.modReceipt.SupplierCode].length === 1
            ? supplierOptions[this.state.modReceipt.SupplierCode]
            : "";
      }
      this.attributeToggleExpand(
        modAssociations[cellData.rowIndex],
        true,
        true
      );
      // modAssociations[rowIndex][
      //   cellData.field
      // ] = !modAssociations[rowIndex][cellData.field];
    }
    this.setState({ modAssociations });
  };
  handleCellCompartmentDataEdit = (newVal, cellData) => {
    let modCompartments = lodash.cloneDeep(this.state.modCompartments);
    const index = modCompartments.findIndex((item) => {
      return item.SeqNumber === cellData.rowData.SeqNumber;
    });
    if (index > -1) {
      modCompartments[index][cellData.field] = newVal;
      this.setState({ modCompartments });
      let expandedRows = lodash.cloneDeep(this.state.expandedRows);
      let expandedRowIndex = expandedRows.findIndex(
        (item) => item.SeqNumber === cellData.rowData.SeqNumber
      );

      if (expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
        this.setState({ expandedRows });
      }
      this.toggleExpand(modCompartments[index], false);
    }
  };
  getcustomerList(shareholder) {
    axios(
      RestAPIs.GetCustomerDestinations +
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
            let shareholderCustomers = result.EntityResult.filter(
              (shareholderCust) =>
                shareholderCust.ShareholderCode === shareholder
            );
            if (shareholderCustomers.length > 0) {
              let customers = Object.keys(
                shareholderCustomers[0].CustomerDestinationsList
              );
              let customerOptions = Utilities.transferListtoOptions(customers);
              this.setState({ customerOptions });
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
  handleCustomerInventory = (newVal, cellData) => {
    let modCustomerInventory = lodash.cloneDeep(
      this.state.modCustomerInventory
    );
    modCustomerInventory[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ modCustomerInventory });
  };
  handleCustomerSelectionChange = (inventory) => {
    this.setState({ selectedCustomerInventory: inventory });
  };
  handleAddCustomerInventory = () => {
    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    if (
      !this.props.userDetails.EntityResult.IsArchived &&
      modReceipt.ReceiptStatus === "READY"
    ) {
      try {
        if (
          this.state.modCustomerInventory.length <
          this.state.customerOptions.length
        ) {
          let modCustomerInventory = lodash.cloneDeep(
            this.state.modCustomerInventory
          );
          let newComp = {
            ShareholderCode: this.props.selectedShareholder,
            CustomerCode: "",
            FinishedProductCode: "",
            PlannedQuantity: "",
            // GrossActualQuantity:"",
            // NetActualQuantity:null,
          };
          newComp.SeqNumber =
            Utilities.getMaxSeqNumberfromListObject(modCustomerInventory);
          if (this.state.customerOptions.length === 1) {
            newComp.CustomerCode = this.state.customerOptions[0].value;
          }
          // if(this.state.baseProductOptions.length ===1){
          //   newComp.BaseProductCode=this.state.baseProductOptions[0].value
          // }
          modCustomerInventory.push(newComp);
          this.setState({
            modCustomerInventory,
            selectedCustomerInventory: [],
          });
        }
      } catch (error) {
        console.log(
          "TruckReceiptDetailsComposite:Error occured on handleAddCustomerinventory",
          error
        );
      }
    }
  };
  handleDeleteCustomerInventory = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedCustomerInventory != null &&
          this.state.selectedCustomerInventory.length > 0
        ) {
          if (this.state.modCustomerInventory.length > 0) {
            let modCustomerInventory = lodash.cloneDeep(
              this.state.modCustomerInventory
            );
            this.state.selectedCustomerInventory.forEach((obj, index) => {
              modCustomerInventory = modCustomerInventory.filter(
                (com, cindex) => {
                  return com.CustomerCode !== obj.CustomerCode;
                }
              );
            });
            this.setState({
              modCustomerInventory,
              selectedCustomerInventory: [],
            });
          }
        }

        this.setState({ selectedCustomerInventory: [] });
      } catch (error) {
        console.log(
          "TruckReceiptDetailsComposite:Error occured on handleDeleteCCustomerinventory",
          error
        );
      }
    }
  };
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
  getCompartmentFromReceipt(receipt) {
    let CompartmentsDetails = [];
    if (Array.isArray(receipt.ReceiptCompartmentsInfo)) {
      receipt.ReceiptCompartmentsInfo.forEach((comp) =>
        CompartmentsDetails.push({
          ReceiptCode: comp.ReceiptCode,
          CompartmentCode: comp.CompartmentCode,
          CompartmentSeqNoInVehicle: comp.CompartmentSeqNoInVehicle,
          TrailerCode: comp.TrailerCode,
          CompartmentSeqNoInTrailer: comp.trailerCompSeq,
          Quantity:
            comp.Quantity !== null && comp.Quantity !== ""
              ? comp.Quantity.toLocaleString()
              : null,
          QuantityUOM: comp.QuantityUOM,
          SupplierCode: comp.SupplierCode,
          DestinationCode: comp.DestinationCode,
          OriginTerminalCode: comp.OriginTerminalCode,
          ShareholderCode: this.props.selectedShareholder,
          FinishedProductCode: comp.FinishedProductCode,
          CompartmentStaus: comp.ReceiptCompartment_Status,
          Adjust_Plan:
            comp.AdjustedQuantity !== null && comp.AdjustedQuantity !== ""
              ? comp.AdjustedQuantity
              : null,
          ForceCompleted:
            Constants.ReceiptCompartment_Status[comp.CompartmentStaus] ===
            Constants.ReceiptCompartment_Status.FORCE_COMPLETED
              ? true
              : false,
        })
      );
      // this.setState({ compartmentTab: true });
    }
    CompartmentsDetails =
      Utilities.addSeqNumberToListObject(CompartmentsDetails);
    return CompartmentsDetails.sort((a, b) => {
      if (a.CompartmentSeqNoInVehicle > b.CompartmentSeqNoInVehicle) return 1;
      else if (a.CompartmentSeqNoInVehicle < b.CompartmentSeqNoInVehicle)
        return -1;
      else return 0;
    });
  }
  handleSaveCompartmentDetailsEnabled = () => {
    const { modReceipt } = this.state;
    const saveCompartmentDetailsEnabled =
      modReceipt.ReceiptStatus ===
        Constants.Receipt_Status.PARTIALLY_UNLOADED ||
      modReceipt.ReceiptStatus === Constants.Receipt_Status.INTERRUPTED ||
      modReceipt.ReceiptStatus === Constants.Receipt_Status.AUTO_UNLOADED ||
      modReceipt.ReceiptStatus === Constants.Receipt_Status.QUEUED ||
      modReceipt.ReceiptStatus === Constants.Receipt_Status.CHECKED_IN;

    return saveCompartmentDetailsEnabled;
  };
  getSaveEnabled() {
    var saveCompartmentDetailsEnabled =
      this.handleSaveCompartmentDetailsEnabled();
    var saveAbled = lodash.cloneDeep(this.state.saveEnabled);
    var viewTab = lodash.cloneDeep(this.state.activeTab);
    var compartmentTab = lodash.cloneDeep(this.state.compartmentTab);
    if (viewTab === 1 && compartmentTab === true) {
      return saveCompartmentDetailsEnabled;
    } else {
      return saveAbled;
    }
  }
  getReceiptCompartmentDetails(selectedRow) {
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: selectedRow.ReceiptCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetReceiptCompartmentDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        response.data.IsSuccess
          ? this.setState({
              modCompartments: this.fillCompartmentPlanDetails(
                response.data.EntityResult
              ),
              // compartmentTab: true,
            })
          : this.setState({ modCompartments: {} });
      })
      .catch((error) => {
        console.log("Error while getting receipt compartment details:", error);
      });
  }
  compartmentDetailsSave = () => {
    let modCompartments = lodash.cloneDeep(this.state.modCompartments);
    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    let ViewReceiptCompData = lodash.cloneDeep(this.state.modCompartments);
    let expandedRows = lodash.cloneDeep(this.state.expandedRows);
    var notification = {
      messageType: "critical",
      message: "ViewMarineShipmentList_CompartmentDetailsStatus",
      messageResultDetails: [
        {
          keyFields: ["ReceiptByCompartmentList_ReceiptCode"],
          keyValues: [modReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: modReceipt.ReceiptCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
      Entity: ViewReceiptCompData,
    };
    axios(
      RestAPIs.UpdateReceiptCompartmentDetails,
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
          this.setState({ modCompartments }, () => {
            this.getReceipt(
              { Common_Code: modReceipt.ReceiptCode },
              this.state.activeTab
            );
          });
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
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(
          this.state.modMarineDispatch,
          "UpdateCompartmentDetails",
          notification
        );
        console.log("Error while compartmentDetailsSave:", error);
      });
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.SeqNumber === modCompartments.SeqNumber
    );
    if (expandedRowIndex >= 0) {
      expandedRows.splice(expandedRowIndex, 1);
    }
    this.toggleExpand(modCompartments, false);

    this.setState({
      modCompartments: this.state.modCompartments,
    });
  };
  getReceiptCompartmentFromReceipt(receipt) {
    let receiptCompartments = [];
    if (Array.isArray(receipt.ReceiptOriginTerminalCompartmentsInfo)) {
      receipt.ReceiptOriginTerminalCompartmentsInfo.forEach((comp) =>
        receiptCompartments.push({
          ReceiptCode: comp.ReceiptCode,
          CompartmentCode: comp.CompartmentCode,
          CompartmentSeqNoInVehicle: comp.CompartmentSeqNoInVehicle,
          TrailerCode: comp.TrailerCode,
          CompartmentSeqNoInTrailer: comp.trailerCompSeq,
          Quantity:
            comp.Quantity !== null && comp.Quantity !== ""
              ? comp.Quantity.toLocaleString()
              : null,
          QuantityUOM: comp.QuantityUOM,
          SupplierCode: comp.SupplierCode,
          DestinationCode: comp.DestinationCode,
          OriginTerminalCode: comp.OriginTerminalCode,
          ShareholderCode: this.props.selectedShareholder,
          FinishedProductCode: comp.FinishedProductCode,
          CompartmentStaus: comp.ReceiptCompartment_Status,
          Attributes: comp.Attributes,
          //  AttributesforUI: comp.AttributesforUI,
        })
      );
    }
    receiptCompartments =
      Utilities.addSeqNumberToListObject(receiptCompartments);
    return receiptCompartments.sort((a, b) => {
      if (a.CompartmentSeqNoInVehicle > b.CompartmentSeqNoInVehicle) return 1;
      else if (a.CompartmentSeqNoInVehicle < b.CompartmentSeqNoInVehicle)
        return -1;
      else return 0;
    });
  }
  getReceiptCustomerInventory(receipt) {
    let customerinventory = [];
    if (Array.isArray(receipt.CustomerInventoryPlanList)) {
      receipt.CustomerInventoryPlanList.forEach((comp) =>
        customerinventory.push({
          ShareholderCode: this.props.selectedShareholder,
          CustomerCode: comp.CustomerCode,
          BaseProductCode: comp.BaseProductCode,
          FinishedProductCode: comp.FinishedProductCode,
          PlannedQuantity: comp.PlannedQuantity,
          GrossActualQuantity: comp.GrossActualQuantity,
          NetActualQuantity: comp.NetActualQuantity,
        })
      );
    }
    customerinventory = Utilities.addSeqNumberToListObject(customerinventory);
    return customerinventory.sort((a, b) => {
      if (a.CompartmentSeqNoInVehicle > b.CompartmentSeqNoInVehicle) return 1;
      else if (a.CompartmentSeqNoInVehicle < b.CompartmentSeqNoInVehicle)
        return -1;
      else return 0;
    });
  }
  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList) &&
        attributeMetaDataList.length > 0
      )
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      else {
        var compAttributeMetaDataList = lodash.cloneDeep(
          this.state.compartmentAttributeMetaDataList
        );
        if (
          Array.isArray(compAttributeMetaDataList) &&
          compAttributeMetaDataList.length > 0
        )
          this.formCompartmentAttributes([
            compAttributeMetaDataList[0].TerminalCode,
          ]);
      }
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }
  formCompartmentAttributes(selectedTerminals) {
    try {
      let attributes = lodash.cloneDeep(
        this.state.compartmentAttributeMetaDataList
      );

      attributes = attributes.filter(function (attTerminal) {
        return selectedTerminals.some(function (selTerminal) {
          return attTerminal.TerminalCode === selTerminal;
        });
      });
      let modAssociations = lodash.cloneDeep(this.state.modAssociations);

      modAssociations.forEach((comp) => {
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
            compAttributes.forEach((assignedAttributes) => {
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
        console.log("comp.AttributesforUI", comp.AttributesforUI);
      });
      this.setState({ modAssociations });
    } catch (error) {
      console.log(
        "ContractDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }
  fillAttributeDetails(modReceipt, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modReceipt.Attributes = [];
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
        modReceipt.Attributes.push(attribute);
      });
      // For Compartment Attributes
      modReceipt.ReceiptOriginTerminalCompartmentsInfo.forEach((comp) => {
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesDatatypeConversion(
              comp.AttributesforUI
            );
        let selectedTerminals = [];
        if (this.props.userDetails.EntityResult.IsEnterpriseNode)
          selectedTerminals = lodash.cloneDeep(modReceipt.TerminalCodes);
        else {
          var compAttributeMetaDataList = lodash.cloneDeep(
            this.state.compartmentAttributeMetaDataList
          );
          if (compAttributeMetaDataList.length > 0)
            selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
        }
        let terminalAttributes = [];
        comp.Attributes = [];
        selectedTerminals.forEach((terminal) => {
          if (
            comp.AttributesforUI !== null &&
            comp.AttributesforUI !== undefined
          )
            terminalAttributes = comp.AttributesforUI.filter(function (
              attTerminal
            ) {
              return attTerminal.TerminalCode === terminal;
            });

          let attribute = {
            ListOfAttributeData: [],
          };

          attribute.TerminalCode = terminal;
          terminalAttributes.forEach((termAtt) => {
            if (termAtt.AttributeValue !== "" || termAtt.IsMandatory === true)
              attribute.ListOfAttributeData.push({
                AttributeCode: termAtt.AttributeCode,
                AttributeValue: termAtt.AttributeValue,
              });
            //})
            //comp.Attributes.push(attribute);
          });
          if (
            attribute.ListOfAttributeData !== null &&
            attribute.ListOfAttributeData !== undefined &&
            attribute.ListOfAttributeData.length > 0
          )
            comp.Attributes.push(attribute);
        });
      });
      this.setState({ modReceipt });
      return modReceipt;
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }
  getAttributes(receiptRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [receiptAttributeEntity, receiptOriginTerminalCompartment],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RECEIPT
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.RECEIPT
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RECEIPTORIGINTERMINALCOMPARTMENT
              ),
            },
            () => this.getReceipt(receiptRow)
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
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

      var modReceipt = lodash.cloneDeep(this.state.modReceipt);

      selectedTerminals.forEach((terminal) => {
        var existitem = selectedAttributeList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modReceipt.Attributes.find(
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
      selectedAttributeList = Utilities.attributesConvertoDecimal(
        selectedAttributeList
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
      this.formCompartmentAttributes(selectedTerminals);
      this.setState({ selectedAttributeList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }
  handleAttributeCellDataEdit = (attribute, value) => {
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
        "TrailerDetailsComposite:Error occured on handleAttributeCellDataEdit",
        error
      );
    }
  };
  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    let expandedRows = lodash.cloneDeep(this.state.expandedRows);
    let compIndex = modAssociations.findIndex(
      (item) => item.SeqNumber === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0) {
      modAssociations[compIndex].AttributesforUI[
        // compAttribute.rowIndex
        compAttribute.rowData.SeqNumber - 1
      ].AttributeValue = value;
      this.setState({ modAssociations });
      expandedRows.splice(compIndex, 1);
      this.attributeToggleExpand(modAssociations[compIndex], true, true);
    }
  };
  getReceipt(receiptRow, activeTab, notification) {
    let notificationReceipt = null;
    emptyReceipt.ShareholderCode = this.props.selectedShareholder;
    emptyReceipt.ReceiptQuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.ROAD;
    emptyReceipt.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    this.handleResetAttributeValidationError();
    if (receiptRow.Common_Code === undefined) {
      this.setState(
        {
          receipt: lodash.cloneDeep(emptyReceipt),
          modReceipt: lodash.cloneDeep(emptyReceipt),
          isReadyToRender: true,
          modAssociations: [],
          modCustomerInventory: [],
          selectedAttributeList: [],
          // compartmentTab: false,
          isPlanned: false,
          recordweightTab: false,
          modCompartments: [],
          activeTab: activeTab,
          modRecordWeight: [],
          expandedRows: [],
          truckReceiptKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTruckReceipt
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            if (this.props.terminalCodes.length === 1) {
              this.terminalSelectionChange(this.props.terminalCodes);
            } else {
              this.terminalSelectionChange([]);
            }
          } else {
            this.localNodeAttribute([]);
          }
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: receiptRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let modReceipt = result.EntityResult;
          notificationReceipt = result.EntityResult;
          modReceipt.SupplierCode =
            result.EntityResult.ReceiptOriginTerminalCompartmentsInfo[0].SupplierCode;
          let isPlanned = lodash.cloneDeep(this.state.isPlanned);
          isPlanned =
            modReceipt.ReceiptOriginTerminalCompartmentsInfo === null ||
            modReceipt.ReceiptOriginTerminalCompartmentsInfo === undefined ||
            modReceipt.ReceiptOriginTerminalCompartmentsInfo.length === 0
              ? false
              : true;
          modReceipt.HSEInspectionStatus = Utilities.getKeyByValue(
            Constants.HSEInpectionStatus,
            modReceipt.HSEInspectionStatus
          );
          this.setState(
            {
              isReadyToRender: true,
              receipt: result.EntityResult,
              modAssociations: this.getReceiptCompartmentFromReceipt(
                result.EntityResult
              ),
              // modCompartments: this.getReceiptCompartmentDetails(
              // ),
              modCustomerInventory: this.getReceiptCustomerInventory(
                result.EntityResult
              ),
              modReceipt,
              isPlanned: isPlanned,
              // saveEnabled:
              //   activeTab === 1 ?  Utilities.isInFunction(
              //     this.props.userDetails.EntityResult.FunctionsList,
              //     functionGroups.modify,
              //     fnTruckReceipt) :
              //   Utilities.isInFunction(
              //     this.props.userDetails.EntityResult.FunctionsList,
              //     functionGroups.modify,
              //     fnTruckReceipt
              //   ) && this.state.modCustomValues.ReceiptUpdateAllow=="TRUE",
              activeTab: activeTab,
              expandedRows: [],
            },
            () => {
              this.getVehicle(result.EntityResult.VehicleCode, false);
              this.getReciptStatuses(receiptRow);
              this.getReceiptCompartmentDetails(result.EntityResult);
              this.GetViewAllReceiptCustomData(result.EntityResult, activeTab);
              // this.getCustomerInventory(result.EntityResult);
              this.getAllRecordWeight(result.EntityResult);
              this.getKPIList(
                this.props.selectedShareholder,
                result.EntityResult.ReceiptCode
              );
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
              this.GetBayByTrnsaction(
                result.EntityResult.ReceiptCode,
                "RECEIPT",
                result.EntityResult.ShareholderCode,
                () => {
                  this.getReciptsStatusOperations(result.EntityResult);
                }
              );
            }
          );
        } else {
          this.setState({
            modReceipt: lodash.cloneDeep(emptyReceipt),
            receipt: lodash.cloneDeep(emptyReceipt),
            modAssociations: [],
            modCustomerInventory: [],
            isReadyToRender: true,
            isPlanned: false,
            selectedAttributeList: [],
            activeTab:
              this.props.ReceiptType.toLowerCase() === fnTruckReceipt ? 1 : 0,
          });
          console.log("Error in GetReceipt:", result.ErrorList);
        }
        if (
          notification !== undefined &&
          notification !== null &&
          notificationReceipt !== null
        )
          this.props.onSaved(notificationReceipt, "update", notification);
      })
      .catch((error) => {
        console.log("Error while getting Receipt:", error, receiptRow);
      });
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
  getVehicleSearchOptions() {
    let vehicleSearchOptions = lodash.cloneDeep(
      this.state.vehicleSearchOptions
    );
    let modVehicleCode = this.state.modReceipt.VehicleCode;
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
  getDriverSearchOptions() {
    let driverSearchOptions = lodash.cloneDeep(this.state.driverSearchOptions);
    let modDriverCode = this.state.modReceipt.DriverCode;
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
  GetSupplierOriginTerminals(shareholder) {
    axios(
      RestAPIs.GetSupplierOriginTerminals +
        "?Transportationtype=" +
        Constants.TransportationType.ROAD +
        "&ShareholderCode=" +
        shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let shareholderSuppliers = result.EntityResult.filter(
              (shareholderSup) => shareholderSup.ShareholderCode === shareholder
            );
            if (shareholderSuppliers.length > 0) {
              let supplierOriginTerminalsList =
                shareholderSuppliers[0].SupplierOriginTerminalsList;
              let supplier = Object.keys(supplierOriginTerminalsList);
              if (
                supplierOriginTerminalsList !== null ||
                supplierOriginTerminalsList !== undefined
              ) {
                let supplierOptions = Utilities.transferListtoOptions(supplier);
                this.setState({ supplierOptions });
              }
              this.setState({ supplierOriginTerminalsList });
              if (
                supplierOriginTerminalsList === "" ||
                supplierOriginTerminalsList === null
              ) {
                this.setState({ supplierOptions: [] });
              }
            } else {
              console.log(
                "No supplierOriginTerminalList identified for shareholder"
              );
            }
          } else {
            console.log(
              "No supplierOriginTerminalList identified for shareholder"
            );
          }
        }
      })
      .catch((error) => {
        console.log("Error in GetSupplierOriginTerminals: ", error);
      });
  }
  confirmVehicleBond = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.vehicleBondPopUp} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("ReceiptBonded_VehicleNonBonded")}</h5>
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
                <h5>{t("ReceiptBonded_StockProducts")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ stockProducts: false }, () => {
                    this.saveReceipt();
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
                <h5>{t("ReceiptBonded_VehicleBondExpiryDate")}</h5>
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
                  {t("ViewReceipt_RecordWeightReceipt") +
                    " : " +
                    this.state.receipt.ReceiptCode}
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
                onClick={() => this.RecordLadenWeight()}
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

  RecordLadenWeight = () => {
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
          value: this.state.receipt.VehicleCode,
        },
        {
          key: KeyCodes.receiptCode,
          value: this.state.receipt.ReceiptCode,
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
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.receipt.ReceiptCode],
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
        RestAPIs.ReceiptRecordLadenWeight,
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
              this.getReceipt(
                {
                  Common_Code: this.state.modReceipt.ReceiptCode,
                },
                0,
                notification
              );
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              response.data.ErrorList[0];
            this.props.onSaved(this.state.modReceipt, "update", notification);
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
          console.log("Error while recording laden weight:", error);
        });
    } catch (error) {
      console.log("Error in GetScadaValue");
    }
  };

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
          value: this.state.receipt.VehicleCode,
        },
        {
          key: KeyCodes.receiptCode,
          value: this.state.receipt.ReceiptCode,
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
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.receipt.ReceiptCode],
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
        RestAPIs.ReceiptRecordTareWeight,
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
              this.getReceipt(
                {
                  Common_Code: this.state.modReceipt.ReceiptCode,
                },
                0,
                notification
              );
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              response.data.ErrorList[0];
            this.props.onSaved(this.state.modReceipt, "update", notification);
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
                keyFields: ["ReceiptCode"],
                keyValues: [this.state.receipt.ReceiptCode],
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
  getAllRecordWeight = (selectedRow) => {
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: selectedRow.ReceiptCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetReceiptRecordWeight,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        response.data.IsSuccess
          ? this.setState({
              modRecordWeight: this.fillRecorWeightDetails(
                response.data.EntityResult
              ),
              recordweightTab:
                response.data.EntityResult.length > 0 ? true : false,
            })
          : this.setState({ modRecordWeight: {}, recordweightTab: false });
      })
      .catch((error) => {
        console.log("Error while getting receipt compartment details:", error);
      });
  };

  authorizeToUnLoad = () => {
    this.handleAuthenticationClose();

    let receipt = lodash.cloneDeep(this.state.receipt);

    let notification = {
      messageType: "critical",
      message: "ViewReceipt_AuthorizeUnLoad_status",
      messageResultDetails: [
        {
          keyFields: ["ReceiptDetail_ReceiptNumber"],
          keyValues: [receipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    let modReceipt = lodash.cloneDeep(this.state.modReceipt);

    this.props.handleAuthorizeToUnLoad(
      modReceipt,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getReceipt(
            { Common_Code: modReceipt.ReceiptCode },
            1,
            notification
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.props.onSaved(modReceipt, "update", notification);
        }
      }
    );
  };

  allowToUnLoadOnClick = () => {
    let showAllowToUnLoadAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showAllowToUnLoadAuthenticationLayout }, () => {
      if (showAllowToUnLoadAuthenticationLayout === false) {
        this.allowToUnLoad();
      }
    });
  };

  allowToUnLoad = () => {
    this.handleAuthenticationClose();

    let receipt = lodash.cloneDeep(this.state.receipt);

    let notification = {
      messageType: "critical",
      message: "ViewReceipt_AllowUnLoad_status",
      messageResultDetails: [
        {
          keyFields: ["ReceiptDetail_ReceiptNumber"],
          keyValues: [receipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    this.props.handleAllowToLoad(
      modReceipt,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getReceipt(
            { Common_Code: modReceipt.ReceiptCode },
            1,
            notification
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.props.onSaved(modReceipt, "update", notification);
        }
      }
    );
  };

  printRANClick = () => {
    let showRANAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showRANAuthenticationLayout }, () => {
      if (showRANAuthenticationLayout === false) {
        this.printRAN();
      }
    });
  };

  printRAN = () => {
    this.handleAuthenticationClose();

    let receipt = lodash.cloneDeep(this.state.receipt);

    let notification = {
      messageType: "critical",
      message: "ViewReceiptStatus_PrintRAN_status",
      messageResultDetails: [
        {
          keyFields: ["ReceiptDetail_ReceiptNumber"],
          keyValues: [receipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    this.props.handlePrintRAN(
      modReceipt,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getReceipt({ Common_Code: modReceipt.ReceiptCode });
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
      }
    );
  };

  viewBOD = () => {
    this.props.handleViewBOD();
    this.handleAuthenticationClose();
  };

  printBODClick = () => {
    let showPrintBODAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showPrintBODAuthenticationLayout }, () => {
      if (showPrintBODAuthenticationLayout === false) {
        this.printBOD();
      }
    });
  };

  printBOD = () => {
    this.handleAuthenticationClose();
    let receipt = lodash.cloneDeep(this.state.receipt);

    let notification = {
      messageType: "critical",
      message: "ViewReceiptStatus_PrintBOD_status",
      messageResultDetails: [
        {
          keyFields: ["ReceiptDetail_ReceiptNumber"],
          keyValues: [receipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    this.props.handlePrintBOD(
      modReceipt,
      this.props.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getReceipt({ Common_Code: modReceipt.ReceiptCode });
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
      }
    );
  };

  handleOperationClick = (operation) => {
    let receipt = lodash.cloneDeep(this.state.receipt);
    let modReceipt = lodash.cloneDeep(this.state.modReceipt);
    let notification = {
      messageType: "critical",
      message: operation + "_status",
      messageResultDetails: [
        {
          keyFields: ["ReceiptDetail_ReceiptNumber"],
          keyValues: [receipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    switch (operation) {
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_AuthorizeUnLoad:
        let showAuthorizeToUnLoadAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;

        this.setState({ showAuthorizeToUnLoadAuthenticationLayout }, () => {
          if (showAuthorizeToUnLoadAuthenticationLayout === false) {
            this.authorizeToUnLoad();
          }
        });
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_AllowUnLoad:
        this.allowToUnLoadOnClick();
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_ManualEntry:
        this.setState({ isManualEntry: true });
        break;

      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_RecordWeight:
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_CloseReceipt:
        this.setState({ isCloseReceipt: true });

        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_PrintRAN:
        this.printRANClick();
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_ViewUnloading:
        this.props.handleViewUnLoading(
          modReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              let ModViewUnloadDetails = result.EntityResult;
              if (
                ModViewUnloadDetails !== null &&
                ModViewUnloadDetails.Table !== null &&
                ModViewUnloadDetails.Table.length > 0
              ) {
                let count = 0;
                ModViewUnloadDetails.Table.forEach((item) => {
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
                  item.grossquantity = item.grossquantity.split(".").join(".");
                  item.netquantity = item.netquantity.split(".").join(".");
                });
              }
              this.setState({
                ModViewUnloadDetails: result.EntityResult.Table,
                isViewUnloading: true,
              });
              this.getReceipt({ Common_Code: modReceipt.ReceiptCode });
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

      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_ViewBOD:
        let showViewBODAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;

        this.setState({ showViewBODAuthenticationLayout }, () => {
          if (showViewBODAuthenticationLayout === false) {
            this.viewBOD();
          }
        });

        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_ViewAuditTrail:
        this.props.handleViewAuditTrail(
          modReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              let modAuditTrailList = result.EntityResult;
              for (let i = 0; i < modAuditTrailList.length; i++) {
                let receiptStatus = modAuditTrailList[i].ReceiptStatus;
                if (receiptStatus === Constants.Receipt_Status.AUTO_UNLOADED) {
                  receiptStatus = Constants.ReceiptStatus.AUTO_UNLOADED;
                } else if (
                  receiptStatus === Constants.Receipt_Status.CHECKED_IN
                ) {
                  receiptStatus = Constants.ReceiptStatus.CHECKED_IN;
                } else if (receiptStatus === Constants.Receipt_Status.CLOSED) {
                  receiptStatus = Constants.ReceiptStatus.CLOSED;
                } else if (
                  receiptStatus === Constants.Receipt_Status.INTERRUPTED
                ) {
                  receiptStatus = Constants.ReceiptStatus.INTERRUPTED;
                } else if (
                  receiptStatus === Constants.Receipt_Status.UNLOADING
                ) {
                  receiptStatus = Constants.ReceiptStatus.UNLOADING;
                } else if (
                  receiptStatus === Constants.Receipt_Status.MANUALLY_UNLOADED
                ) {
                  receiptStatus = Constants.ReceiptStatus.MANUALLY_UNLOADED;
                } else if (
                  receiptStatus === Constants.Receipt_Status.PARTIALLY_UNLOADED
                ) {
                  receiptStatus = Constants.ReceiptStatus.PARTIALLY_UNLOADED;
                } else if (receiptStatus === Constants.Receipt_Status.QUEUED) {
                  receiptStatus = Constants.ReceiptStatus.QUEUED;
                } else if (receiptStatus === Constants.Receipt_Status.READY) {
                  receiptStatus = Constants.ReceiptStatus.READY;
                } else if (
                  receiptStatus === Constants.Receipt_Status.DE_QUEUED
                ) {
                  receiptStatus = Constants.ReceiptStatus.DE_QUEUED;
                } else if (
                  receiptStatus === Constants.Receipt_Status.WEIGHED_IN
                ) {
                  receiptStatus = Constants.ReceiptStatus.WEIGHED_IN;
                } else if (
                  receiptStatus === Constants.Receipt_Status.WEIGHED_OUT
                ) {
                  receiptStatus = Constants.ReceiptStatus.WEIGHED_OUT;
                } else if (
                  receiptStatus === Constants.Receipt_Status.ASSIGNED
                ) {
                  receiptStatus = Constants.ReceiptStatus.ASSIGNED;
                } else if (
                  receiptStatus === Constants.Receipt_Status.CANCELLED
                ) {
                  receiptStatus = Constants.ReceiptStatus.CANCELLED;
                } else if (receiptStatus === Constants.Receipt_Status.EXPIRED) {
                  receiptStatus = Constants.ReceiptStatus.EXPIRED;
                } else if (
                  receiptStatus === Constants.Receipt_Status.REJECTED
                ) {
                  receiptStatus = Constants.ReceiptStatus.REJECTED;
                } else {
                  receiptStatus = Constants.ReceiptStatus.USER_DEFINED;
                }

                modAuditTrailList[i].Receipt_Status = receiptStatus;
                modAuditTrailList[i].UpdatedTime =
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
              }

              this.setState({
                auditTrailList: result.EntityResult,
                modAuditTrailList: modAuditTrailList,
                isViewAuditTrail: true,
              });
              this.getReceipt({ Common_Code: modReceipt.ReceiptCode });
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
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_RecordWeight:
        this.getRecordWeightList();
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_PrintBOD:
        this.printBODClick();
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_SendBOD:
        this.props.handleSendBOD(
          modReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getReceipt({ Common_Code: modReceipt.ReceiptCode });
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
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
      case Constants.ViewAllTruckReceiptOperations.viewReceipt_BSIOutbound:
        this.props.handleBSIOutbound(
          modReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getReceipt({ Common_Code: modReceipt.ReceiptCode });
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
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
      case Constants.ViewAllTruckReceiptOperations.viewReceipt_SealCompartments:
        this.handleSealCompartments(
          this.state.modReceipt.ReceiptCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
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
    let receipt = lodash.cloneDeep(this.state.receipt);
    let products = [];
    receipt.ReceiptCompartmentsInfo.forEach((element) => {
      products.push(element.FinishedProductCode);
    });

    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: [
        {
          key: "TransactionType",
          value: "RECEIPT",
        },
        {
          key: "TransportationType",
          value: "ROAD",
        },
        {
          key: "TerminalCode",
          value: this.state.receipt.ActualTerminalCode,
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

  handleTabChange = (activeIndex) => {
    try {
      this.setState({ activeTab: activeIndex, expandedRows: [] });
      if (activeIndex === 1) {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnTruckReceipt
          ),
        });
      } else {
        this.setState({
          saveEnabled:
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTruckReceipt
            ) && this.state.modCustomValues.ReceiptUpdateAllow === "TRUE",
        });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleTabChange",
        error
      );
    }
  };
  onBack = () => {
    this.setState({
      isManualEntry: false,
      isPlanned: true,
      saveEnabled: false,
      isViewAuditTrail: false,
      isViewUnloading: false,
      drawerStatus: false,
      expandedRows: [],
      loadingExpandedRows: [],
    });
    this.getReceipt({ Common_Code: this.state.modReceipt.ReceiptCode });
  };
  getReciptStatuses(receiptRow) {
    try {
      axios(
        RestAPIs.GetReceiptAllStatuses +
          "?shareholderCode=" +
          this.props.selectedShareholder +
          "&receiptCode=" +
          receiptRow.Common_Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          console.log("result.EntityResult", result.EntityResult);
          this.setState({
            currentReceiptStatus: result.EntityResult,
          });
        })
        .catch((error) => {
          console.log("Error while getting getReceiptStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  getReciptsStatusOperations(receiptItem) {
    try {
      var receiptStatus = receiptItem.ReceiptStatus;
      var isVolumneBased = receiptItem.IsVolumeBased;
      var selectedShareholder = this.props.selectedShareholder;
      axios(
        RestAPIs.GetReceiptOperations +
          "?receiptStatus=" +
          receiptStatus +
          "&IsVolumneBased=" +
          isVolumneBased +
          "&shareholder=" +
          selectedShareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          console.log(response.data);
          var result = response.data;
          if (
            result.EntityResult.ViewAllocateBay_DeallocateBay === true &&
            this.state.ReceiptBay !== null &&
            this.state.ReceiptBay !== undefined &&
            this.state.ReceiptBay !== ""
          ) {
            result.EntityResult.ViewAllocateBay_DeallocateBay = true;
          } else if (
            result.EntityResult.ViewAllocateBay_DeallocateBay === true &&
            (this.state.ReceiptBay === null ||
              this.state.ReceiptBay === undefined ||
              this.state.ReceiptBay === "")
          ) {
            result.EntityResult.ViewAllocateBay_DeallocateBay = false;
          }
          let nextOperations = [];
          Object.keys(result.EntityResult).forEach((operation) => {
            console.log(operation);
            if (result.EntityResult[operation]) nextOperations.push(operation);
          });

          this.setState({ shipmentNextOperations: nextOperations });
          console.log("Operations of receipt", nextOperations);
        })
        .catch((error) => {
          console.log("Error while getting getReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=CustomerInventory",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        console.log(result);

        if (result.IsSuccess === true) {
          let isEnable = true;
          if (result.EntityResult.Enabled === "False") {
            isEnable = false;
          }
          this.setState({
            lookUpData: result.EntityResult,
            customerInventoryTab: isEnable,
          });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "SealMasterDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }
  getReceiptConfigLookUpTypeName() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=RECEIPTCONFIGURATION",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        console.log(result);

        if (result.IsSuccess === true) {
          let isEnable = false;
          if (result.EntityResult.NoOfDaysBeforeOldReceiptsCreationIsAllowed) {
            isEnable = true;
          }
          this.setState({
            lookUpData: result.EntityResult,
            IsPastDisable: isEnable,
          });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "SealMasterDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }
  getReceiptBYCompartmentLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=ReceiptByCompartment",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        console.log(result);

        if (result.IsSuccess === true) {
          let isEnable = false;
          if (result.EntityResult.ReceiptWithSingleSupplier === "0") {
            isEnable = true;
          }
          this.setState({
            lookUpData: result.EntityResult,
            SupplierEnable: isEnable,
          });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "SealMasterDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }
  getLookUpHsEInSpectionEnableData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=HSEInspection",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        console.log(result);

        if (result.IsSuccess === true) {
          let isHSEInspectionEnable = false;
          if (result.EntityResult.EnableRoad === "True") {
            isHSEInspectionEnable = true;
          }
          this.setState({
            isHSEInspectionEnable,
          });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "SealMasterDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }
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
          "SealMasterDetailsComposite: Error occurred on get IsBonded",
          error
        );
      });
  }
  toggleExpand = (data, open) => {
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.SeqNumber === data.SeqNumber
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
  getBaseProducts(terminalcode) {
    axios(
      RestAPIs.GetAllBaseProduct + "?TerminalCode=" + terminalcode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let baseProductOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ baseProductOptions });
          }
        } else {
          console.log("Error in getBaseProducts:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting BaseProducts:", error);
      });
  }
  getCustomerInventory(receiptRow) {
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: receiptRow.ReceiptCode,
      },
      {
        key: KeyCodes.transportaionType,
        value: Constants.TransportationType.ROAD,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetReceiptCustomerInventoryDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        if (response.data.IsSuccess) {
          let customerInventory = response.data.EntityResult;
          console.log("customerr", customerInventory);
          this.setState({ modCustomerInventory: customerInventory });
        } else this.setState({ modCustomerInventory: [] });
      })
      .catch((error) => {
        console.log("Error while getting shipment custom details:", error);
      });
  }
  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

  closeReceipt = () => {
    let showCloseReceiptAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showCloseReceiptAuthenticationLayout }, () => {
      if (showCloseReceiptAuthenticationLayout === false) {
        this.handleReceiptClose();
      }
    });
  };

  handleReceiptClose = () => {
    this.handleAuthenticationClose();
    try {
      let notification = {
        messageType: "critical",
        message: "ViewReceipt_CloseSuccess",
        messageResultDetails: [
          {
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.receipt.ReceiptCode],
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
          key: KeyCodes.receiptStatus,
          value: this.state.modReceipt.ReceiptStatus,
        },
        {
          key: KeyCodes.receiptCode,
          value: this.state.modReceipt.ReceiptCode,
        },
        {
          key: KeyCodes.driverCode,
          value: this.state.modReceipt.DriverCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.receiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.ReceiptClose,
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
            this.getReceipt(
              { Common_Code: this.state.receipt.ReceiptCode },
              0,
              notification
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.props.onSaved(this.state.modReceipt, "update", notification);
          }
        })
        .catch((error) => {
          console.log("Error while ReceiptClose:", error);
        });
    } catch (error) {
      console.log("Error while closing the shipment:", error);
    }
  };

  handleCloseReceipttModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isCloseReceipt} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("Receipt_ForceCloseHeader") +
                    " : " +
                    this.state.receipt.ReceiptCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.reasonForClosure}
                    label={t("ViewReceipt_Reason")}
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
                      message: "ViewReceipt_CloseSuccess",
                      messageResultDetails: [
                        {
                          keyFields: ["ReceiptCode"],
                          keyValues: [this.state.receipt.ReceiptCode],
                          isSuccess: false,
                          errorMessage: "Enter_Receipt_ReasonForCloseure",
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
                    this.setState({ isCloseReceipt: false }, () => {
                      this.closeReceipt();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    isCloseReceipt: false,
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
                  {this.state.receipt.ReceiptCode}
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
                      this.state.receipt.ReceiptCode,
                      this.state.selectBay[0].BayCode,
                      "RECEIPT"
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

  confirmDeAllocateBay = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isDeAllocateBay} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>
                  {t("ViewAllocateBay_ConfirmDeallocateBay", [
                    this.state.ReceiptBay,
                    "Receipt",
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
                      this.state.receipt.ReceiptCode,
                      "RECEIPT",
                      this.state.ReceiptBay
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

  GetBayByTrnsaction(TrnsactionCode, TrnsactionType, shareholder, CallBack) {
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
          this.setState(
            {
              ReceiptBay: result.EntityResult.BayCode,
            },
            CallBack
          );
        }
      })
      .catch((error) => {
        console.log("Error while GetBayByTrnsaction:", error);
      });
  }

  /**
   *
   * @param {*} shipmentCode
   * @param {*} bayCode
   * @param {*} entityType ：shipment or receipt
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
      keyDataCode: KeyCodes.receiptCode,
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
          this.getReceipt(
            {
              Common_Code: this.state.modReceipt.ReceiptCode,
            },
            0,
            notification
          );
          this.setState({ isAllocateBay: false });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ResultDataList[0].ErrorList[0];
          this.props.onSaved(this.state.modReceipt, "update", notification);
        }
      })
      .catch((error) => {
        console.log("Error while AllocateBay:", error);
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
          this.getReceipt(
            {
              Common_Code: this.state.modReceipt.ReceiptCode,
            },
            0,
            notification
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.props.onSaved(this.state.modReceipt, "update", notification);
        }
      })
      .catch((error) => {
        console.log("Error while DeAllocateBay:", error);
      });
  }

  //Get KPI for Truck Receipt
  getKPIList(shareholder, receiptCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiTruckReceiptDetail,
        TransportationType: Constants.TransportationType.ROAD,
        InputParameters: [
          { key: "ShareholderCode", value: shareholder },
          { key: "ReceiptCode", value: receiptCode },
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
              truckReceiptKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ truckReceiptKPIList: [] });
            console.log("Error in truck Receipt KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting truck Receipt KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showReceiptAuthenticationLayout: false,
      showAuthorizeToUnLoadAuthenticationLayout: false,
      showAllowToUnLoadAuthenticationLayout: false,
      showCloseReceiptAuthenticationLayout: false,
      showViewBODAuthenticationLayout: false,
      showPrintBODAuthenticationLayout: false,
      showRANAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    if (this.state.showReceiptAuthenticationLayout) return fnTruckReceipt;
    else if (this.state.showCloseReceiptAuthenticationLayout)
      return fnCloseReceipt;
    else if (
      this.state.showAllowToUnLoadAuthenticationLayout ||
      this.state.showAuthorizeToUnLoadAuthenticationLayout
    )
      return fnViewReceiptStatus;
    else if (
      this.state.showViewBODAuthenticationLayout ||
      this.state.showPrintBODAuthenticationLayout
    )
      return fnPrintBOD;
    else if (this.state.showRANAuthenticationLayout) return fnPrintRAN;
  }


  getDeleteorEditMode() {
    if (this.state.showReceiptAuthenticationLayout)
      return this.state.receipt.ReceiptCode  === ""? functionGroups.add: functionGroups.modify;
    else 
      return functionGroups.modify; 
   };

  handleOperation() {
    if (this.state.showReceiptAuthenticationLayout)
      return this.handleSaveReceipt;
    else if (this.state.showAuthorizeToUnLoadAuthenticationLayout)
      return this.authorizeToUnLoad;
    else if (this.state.showAllowToUnLoadAuthenticationLayout)
      return this.allowToUnLoad;
    else if (this.state.showCloseReceiptAuthenticationLayout)
      return this.handleReceiptClose;
    else if (this.state.showRANAuthenticationLayout) return this.printRAN;
    else if (this.state.showViewBODAuthenticationLayout) return this.viewBOD;
    else if (this.state.showPrintBODAuthenticationLayout) return this.printBOD;
  }

  render() {
    // const saveEnabled = this.getSaveEnabled();
    const popUpContents = [
      {
        fieldName: "Receipt_LastUpdated",
        fieldValue:
          new Date(this.state.modReceipt.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modReceipt.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "Receipt_LastActiveTime",
        fieldValue:
          this.state.modReceipt.LastActiveTime !== undefined &&
          this.state.modReceipt.LastActiveTime !== null
            ? new Date(
                this.state.modReceipt.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modReceipt.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "Receipt_CreatedTime",
        fieldValue:
          new Date(this.state.modReceipt.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modReceipt.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <TranslationConsumer>
          {(t) => (
            <ErrorBoundary>
              <TMDetailsHeader
                entityCode={
                  this.state.isManualEntry
                    ? this.state.receipt.ReceiptCode +
                      " - " +
                      t("LoadingDetailsEntry_Title")
                    : this.state.receipt.ReceiptCode
                }
                newEntityName="Receipt_NewReceiptByCompartment"
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            </ErrorBoundary>
          )}
        </TranslationConsumer>
        {this.state.isViewUnloading ? (
          <ErrorBoundary>
            <TranslationConsumer>
              {(t) => (
                <TMDetailsHeader
                  newEntityName="ViewReceiptList_ViewTransactions"
                  popUpContents={popUpContents}
                ></TMDetailsHeader>
              )}
            </TranslationConsumer>
            <TruckReceiptViewUnLoadingDetails
              ModViewUnloadDetails={this.state.ModViewUnloadDetails}
              handleBack={this.onBack}
              expandedRows={this.state.loadingExpandedRows}
              toggleExpand={this.loadingToggleExpand}
            ></TruckReceiptViewUnLoadingDetails>
          </ErrorBoundary>
        ) : this.state.isViewAuditTrail ? (
          <ErrorBoundary>
            <TruckReceiptViewAuditTrailDetails
              ReceiptCode={this.state.modReceipt.ReceiptCode}
              selectedRow={this.state.selectedRow}
              auditTrailList={this.state.auditTrailList}
              modAuditTrailList={this.state.modAuditTrailList}
              handleBack={this.onBack}
            ></TruckReceiptViewAuditTrailDetails>
          </ErrorBoundary>
        ) : this.state.isManualEntry ? (
          <div>
            <ErrorBoundary>
              <TruckReceiptManualEntryDetailsComposite
                receipt={this.state.modReceipt}
                handleBack={this.onBack}
                selectedShareholder={this.props.selectedShareholder}
              ></TruckReceiptManualEntryDetailsComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <div>
            <TMDetailsKPILayout KPIList={this.state.truckReceiptKPIList}>
              {" "}
            </TMDetailsKPILayout>
            <div
              className={
                this.state.isPlanned
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <TruckReceiptDetails
                  receipt={this.state.receipt}
                  modReceipt={this.state.modReceipt}
                  modAssociations={this.state.modAssociations}
                  validationErrors={this.state.validationErrors}
                  modCompartments={this.state.modCompartments}
                  modCustomerInventory={this.state.modCustomerInventory}
                  IsPastDisable={this.state.IsPastDisable}
                  SupplierEnable={this.state.SupplierEnable}
                  isBonded={this.state.isBonded}
                  listOptions={{
                    terminalCodes: this.props.terminalCodes,
                    quantityUOMOptions: this.state.quantityUOMOptions,
                    vehicleOptions: this.getVehicleSearchOptions(),
                    driverOptions: this.getDriverSearchOptions(),
                    // driverOptions: this.state.driverOptions,
                    supplierOriginOptions:
                      this.state.supplierOriginTerminalsList,
                    compSeqOptions: this.state.compSeqOptions,
                    finishedProductOptions: this.state.finishedProductOptions,
                    baseProductOptions: this.state.baseProductOptions,
                    customerCode: this.state.customerCode,
                    customerptions: this.state.customerptions,
                    customerOptions: this.state.customerOptions,
                    supplierOptions: this.state.supplierOptions,
                  }}
                  selectedAssociations={this.state.selectedAssociations}
                  searchResults={{
                    vehicleOptions: this.state.vehicleSearchOptions,
                    driverOptions: this.state.driverSearchOptions,
                  }}
                  handleRowSelectionChange={
                    this.handleAssociationSelectionChange
                  }
                  onFieldChange={this.handleChange}
                  onAllTerminalsChange={this.handleAllTerminalsChange}
                  handleAddAssociation={this.handleAddAssociation}
                  handleDeleteAssociation={this.handleDeleteAssociation}
                  handleCellDataEdit={this.handleCellDataEdit}
                  handleCellCompartmentDataEdit={
                    this.handleCellCompartmentDataEdit
                  }
                  isHSEInspectionEnable={this.state.isHSEInspectionEnable}
                  handleCustomerInventory={this.handleCustomerInventory}
                  selectedCustomerInventory={
                    this.state.selectedCustomerInventory
                  }
                  selectedAttributeList={this.state.selectedAttributeList}
                  attributeValidationErrors={
                    this.state.attributeValidationErrors
                  }
                  handleAttributeCellDataEdit={this.handleAttributeCellDataEdit}
                  handleCompAttributeCellDataEdit={
                    this.handleCompAttributeCellDataEdit
                  }
                  handleAddCustomerInventory={this.handleAddCustomerInventory}
                  handleDeleteCustomerInventory={
                    this.handleDeleteCustomerInventory
                  }
                  handleCustomerSelectionChange={
                    this.handleCustomerSelectionChange
                  }
                  onDateTextChange={this.handleDateTextChange}
                  onActiveStatusChange={this.handleActiveStatusChange}
                  onVehicleChange={this.handleVehicleChange}
                  onSupplierChange={this.handleSupplierChange}
                  onVehicleSearchChange={this.handleVehicleSearchChange}
                  onDriverChange={this.handleDriverChange}
                  onDriverSearchChange={this.handleDriverSearchChange}
                  onDriverResultsClear={this.handleDriverResultsClear}
                  onVehicleResultsClear={this.handleVehicleResultsClear}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  IsWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  isSlotbookinginUI={
                    this.props.userDetails.EntityResult.ShowSlotBookedInUI
                  }
                  compartmentDetailsPageSize={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize
                  }
                  customerInventoryTab={this.state.customerInventoryTab}
                  compartmentTab={this.state.isPlanned === false ? false : true}
                  recordweightTab={this.state.recordweightTab}
                  expandedRows={this.state.expandedRows}
                  toggleExpand={this.toggleExpand}
                  attributeToggleExpand={this.attributeToggleExpand}
                  compartmentDetailsSave={this.compartmentDetailsSave}
                  handleCellCheck={this.handleCellCheck}
                  activeTab={this.state.activeTab}
                  onTabChange={this.handleTabChange}
                  UpdateReceiptBondNo={this.UpdateReceiptBondNo}
                  modRecordWeight={this.state.modRecordWeight}
                  modCustomValues={this.state.modCustomValues}
                  ReceiptBay={this.state.ReceiptBay}
                  UpdateReceiptDriver={this.UpdateReceiptDriver}
                  isWebportalCarrierRoleUser={this.props.userDetails.EntityResult.RoleName.toLowerCase() === "carriercompany" && this.props.userDetails.EntityResult.IsWebPortalUser}
                ></TruckReceiptDetails>
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

            <div>
              {this.state.isPlanned ? (
                <div
                  className={
                    this.state.drawerStatus ? "marineStatusLeftPane" : ""
                  }
                >
                  <TranslationConsumer>
                    {(t) => (
                      <TransactionSummaryOperations
                        selectedItem={[
                          { Common_Code: this.state.modReceipt.ReceiptCode },
                        ]}
                        shipmentNextOperations={
                          this.state.shipmentNextOperations
                        }
                        handleDetailsPageClick={this.handleRowClick}
                        handleOperationButtonClick={this.handleOperationClick}
                        currentStatuses={this.state.currentReceiptStatus}
                        isDetails={true}
                        isWebPortalUser={
                          this.props.userDetails.EntityResult.IsWebPortalUser
                        }
                        webPortalAllowedOperations={[
                          "ViewReceipt_ViewUnloading",
                          "ViewReceipt_ViewBOD",
                          "ViewReceipt_ViewAuditTrail",
                        ]}
                        handleDrawer={this.handleDrawer}
                        isEnterpriseNode={
                          this.props.userDetails.EntityResult.IsEnterpriseNode
                        }
                        unAllowedOperations={[
                          "ViewReceipt_ManualEntry",
                          "ViewReceipt_AuthorizeUnLoad",
                          "ViewReceipt_AllowUnLoad",
                          "ViewAllocateBay_AllocateBay",
                          "ViewAllocateBay_DeallocateBay",
                          "ViewReceipt_PrintRAN",
                          "ViewReceipt_RecordWeight",
                          "ViewReceipt_PrintBOD",
                          "ViewReceipt_SendBOD",
                        ]}
                      />
                    )}
                  </TranslationConsumer>
                </div>
              ) : (
                ""
              )}

              {this.state.showReceiptAuthenticationLayout ||
              this.state.showAllowToUnLoadAuthenticationLayout ||
              this.state.showAuthorizeToUnLoadAuthenticationLayout ||
              this.state.showCloseReceiptAuthenticationLayout ||
              this.state.showViewBODAuthenticationLayout ||
              this.state.showPrintBODAuthenticationLayout ||
              this.state.showRANAuthenticationLayout ? (
                <UserAuthenticationLayout
                  Username={this.props.userDetails.EntityResult.UserName}
                  functionName={this.getDeleteorEditMode()}
                  functionGroup={this.getFunctionGroupName()}
                  handleClose={this.handleAuthenticationClose}
                  handleOperation={this.handleOperation()}
                ></UserAuthenticationLayout>
              ) : null}
            </div>
          </div>
        )}
        {this.state.isRecordWeight ? this.handleRecordWeight() : null}
        {this.state.vehicleBondPopUp ? this.confirmVehicleBond() : null}
        {this.state.vehicleBondExpiryPopUp
          ? this.confirmVehicleBondExpiryDate()
          : null}
        {this.state.isSealCompartments ? (
          <ErrorBoundary>
            <TruckReceiptSealDetailsComposite
              transactionCode={this.state.receipt.ReceiptCode}
              selectedShareholder={this.props.selectedShareholder}
              sealCompartments={this.state.sealCompartments}
              handleSealClose={this.handleSealClose}
            ></TruckReceiptSealDetailsComposite>
          </ErrorBoundary>
        ) : null}
        {this.state.stockProducts ? this.confirmBondedStockProducts() : null}
        {this.state.isCloseReceipt ? this.handleCloseReceipttModal() : null}
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

export default connect(mapStateToProps)(TruckReceiptDetailsComposite);

TruckReceiptDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
