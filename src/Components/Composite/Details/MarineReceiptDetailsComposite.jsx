import React, { Component } from "react";
import { MarineReceiptDetails } from "../../UIBase/Details/MarineReceiptDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { marineReceiptValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import {
  emptyMarineReceipt,
  emptyReceiptCompartmentPlan,
  emptyReceiptCompartmentTanks,
} from "../../../JS/DefaultEntities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestApis from "../../../JS/RestApis";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnMarineReceipt, fnKPIInformation, fnMarineReceiptByCompartment } from "../../../JS/FunctionGroups";
import { marineReceiptCompartDef } from "../../../JS/DetailsTableValidationDef";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import MarineReceiptManualEntryDetailsComposite from "./MarineReceiptManualEntryDetailsComposite";
import MarineReceiptViewAuditTrailComposite from "./MarineReceiptViewAuditTrailDetailsComposite";
import MarineReceiptLoadingDetails from "../../UIBase/Details/MarineReceiptLoadingDetails";
import {
  marineReceiptAttributeEntity,
  marineReceiptCompAttributeEntity,
} from "../../../JS/AttributeEntity";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiMarineReceiptDetails } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class MarineReceiptDetailsComposite extends Component {
  state = {
    marineReceipt: lodash.cloneDeep(emptyMarineReceipt),
    modMarineReceipt: {},
    modAssociations: [],
    modTankAssociations: [],
    modTankPlanAssociations: [],
    tempModTankAssociations: [],
    modTankPlan: [],
    vehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    modVehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    validationErrors: Utilities.getInitialValidationErrors(
      marineReceiptValidationDef
    ),
    isReadyToRender: false,
    shareholders: this.getShareholders(),
    terminalCodes: this.props.terminalCodes,
    shipmentUOM: [],
    Captains: [],
    vessels: [],
    vesselSearchOptions: [],
    FinishedProducts: {},
    baseProductDetails: {},
    tankCodeOptions: [],
    supplierDestinationOptions: {},
    compSeqOptions: [],
    shareholderSuppliers: [],
    associatedCompartments: [],
    saveEnabled: false,
    selectedTankAssociations: [],
    selectedAll: false,
    receiptCompartmentDetails: [],
    modReceiptCompartment: [],
    ViewUnloadingData: [],
    ViewUnloadingHideFields: [],
    isManualEntry: false,
    viewAuditTrail: false,
    isViewUnloading: false,
    isNewReceipt: false,
    clickRow: [],
    operationsVisibilty: {
      save: false,
      authorizeToLoad: false,
      closeReceipt: false,
      viewAuditTrail: false,
      viewUnloadingDetails: false,
      printRAN: false,
      viewBOD: false,
      printBOD: false,
      bSIOutbound: false,
      adjustPlan: false,
      forceComplete: false,
      manualEntry: false,
    },
    finishedProductItems: [],
    attribute: [],
    attributeMetaDataList: [],
    compartmentAttributeMetaDataList: [],
    selectedAttributeList: [],
    selectedAssociations: [],
    attributeValidationErrors: [],
    expandedRows: [],
    expandedCompDetailRows: [],
    additiveDetails: [],
    length: 0,
    carrierCompany: [],
    carrierOptions: [],
    carrierSearchOptions: [],
    isHSEInspectionEnable: false,
    isBondShow: false,
    isTransloading: false,
    carrierShareholderMap: {},
    marineReceiptKPIList: [],
    showAuthenticationLayout: false,
    tempMarineReceipt: {},
  };

  handleChange = (propertyName, data) => {
    try {
      if (propertyName === "VesselCode") {
        if (data === null) {
          this.setState({
            modAssociations: [],
            modTankAssociations: [],
            modTankPlanAssociations: [],
          });
        } else {
          this.getVessel(data, true);
        }
      }
      const modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (propertyName === "TerminalCodes") {
        if (modMarineReceipt[propertyName] === null) {
          modMarineReceipt[propertyName] = [];
        }
        modMarineReceipt[propertyName][0] = data;
        this.terminalSelectionChange([data]);
        this.getTankListForRole(data);
      } else {
        modMarineReceipt[propertyName] = data;
      }
      if (propertyName === "Active") {
        if (modMarineReceipt.Active !== this.state.marineReceipt.Active)
          modMarineReceipt.Remarks = "";
      }
      if (propertyName === "Bonded") {
        validationErrors["BondNumber"] =
          "BONDED_NO_CANT_BE_EMPTY_FOR_BONDED_RECEIPT_X";
      }
      if (propertyName === "ReceiptCode") {
        if (
          this.state.modTankAssociations !== undefined &&
          this.state.modTankAssociations !== null &&
          this.state.modTankAssociations.length !== 0
        ) {
          this.state.modTankAssociations.forEach((modTankPlan) => {
            modTankPlan.ReceiptCode = data;
          });
        }
      }
      if (propertyName === "BondNumber") {
        modMarineReceipt[propertyName] = data;
      }
      this.setState({ modMarineReceipt });
      if (marineReceiptValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          marineReceiptValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  generateCompartmentCode(compartments) {
    try {
      var maxnumber = 0;
      if (
        compartments === null ||
        compartments.length === 0 ||
        compartments === undefined
      )
        return 1;
      compartments.forEach((comp) => {
        var compCode = comp.CompartmentCode;
        if (compCode !== null || compCode !== "") {
          if (!isNaN(parseInt(compCode))) {
            let val = parseInt(compCode);

            if (val > maxnumber) maxnumber = val;
          }
        }
      });

      return maxnumber + 1;
    } catch (error) {
      return maxnumber;
    }
  }

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.modAssociations.length <
          this.state.modVehicleDetails.vehicleCompartments.length
        ) {
          let modAssociations = lodash.cloneDeep(this.state.modAssociations);
          let newAssociation = {
            AssociatedContractItems: null,
            AssociatedOrderItems: null,
            Attributes: [],
            CarrierCompanyCode: null,
            CompartmentCode: null,
            CompartmentSeqNoInVehicle: "",
            FinishedProductCode: null,
            OriginTerminalCode: null,
            Quantity: null,
            QuantityUOM: null,
            ReceiptCode: null,
            SequenceNo: 0,
            ShareholderCode: this.props.selectedShareholder,
            SupplierCode: null,
            TrailerCode: null,
          };

          var maxnumber = 1;
          modAssociations.forEach((object) => {
            var seqNumber = object.SequenceNo;
            if (
              seqNumber !== null &&
              seqNumber !== "" &&
              seqNumber !== undefined
            ) {
              if (!isNaN(parseInt(seqNumber))) {
                let val = parseInt(seqNumber);

                if (val >= maxnumber) maxnumber = val + 1;
              }
            }
          });
          newAssociation.SequenceNo = maxnumber;
          newAssociation.QuantityUOM = this.state.modMarineReceipt.QuantityUOM;
          modAssociations.push(newAssociation);
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
              } else
                this.formCompartmentAttributes(
                  this.state.modMarineReceipt.TerminalCodes
                );
            }
          );
        }
      } catch (error) {
        console.log(
          "MarineReceiptDetailsComposite:Error occured on handleAddAssociation",
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
            let modTankPlanAssociations = lodash.cloneDeep(
              this.state.modTankPlanAssociations
            );
            this.state.selectedAssociations.forEach((obj, index) => {
              modAssociations = modAssociations.filter(
                (association, cindex) => {
                  return association.SequenceNo !== obj.SequenceNo;
                }
              );
              modTankPlanAssociations = modTankPlanAssociations.filter(
                (tankAssociation) => {
                  return (
                    tankAssociation.CompartmentSeqNoInVehicle !==
                    obj.CompartmentSeqNoInVehicle
                  );
                }
              );
            });
            this.setState({
              modAssociations,
              modTankPlanAssociations,
              modTankAssociations: modTankPlanAssociations,
              selectedAssociations: [],
            });
          }
        }
      } catch (error) {
        console.log(
          "MarineReceiptDetailsComposite:Error occured on handleDeleteAssociation",
          error
        );
      }
    }
  };

  handleDeleteTankAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedTankAssociations != null &&
          this.state.selectedTankAssociations.length > 0
        ) {
          if (this.state.modTankAssociations.length > 0) {
            let modTankAssociations = lodash.cloneDeep(
              this.state.modTankAssociations
            );

            this.state.selectedTankAssociations.forEach((obj, index) => {
              modTankAssociations = modTankAssociations.filter(
                (tankAssociation, cindex) => {
                  return tankAssociation.SequenceNo !== obj.SequenceNo;
                }
              );
            });
            this.setState({
              modTankPlanAssociations: modTankAssociations,
              modTankAssociations,
              selectedTankAssociations: [],
            });
          }
        }
        this.setState({ selectedTankAssociations: [] });
      } catch (error) {
        console.log(
          "MarineReceiptDetailsComposite:Error occured on handleDeleteTankAssociation",
          error
        );
      }
    }
  };

  handleAddTankAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        let modTankAssociations = lodash.cloneDeep(
          this.state.modTankAssociations
        );
        let newTankAssociation = lodash.cloneDeep(emptyReceiptCompartmentPlan);
        var maxnumber = 1;
        modTankAssociations.forEach((object) => {
          var seqNumber = object.SequenceNo;
          if (
            seqNumber !== null &&
            seqNumber !== "" &&
            seqNumber !== undefined
          ) {
            if (!isNaN(parseInt(seqNumber))) {
              let val = parseInt(seqNumber);

              if (val >= maxnumber) maxnumber = val + 1;
            }
          }
        });
        newTankAssociation.SequenceNo = maxnumber;
        newTankAssociation.PlanQuantityUOM =
          this.state.modMarineReceipt.QuantityUOM;
        modTankAssociations.push(newTankAssociation);
        this.setState({
          modTankPlanAssociations: modTankAssociations,
          modTankAssociations,
          selectedTankAssociations: [],
        });
      } catch (error) {
        console.log(
          "MarineReceiptDetailsComposite:Error occured on handleAddAssociation",
          error
        );
      }
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var { validationErrors } = { ...this.state.validationErrors };
      var modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
      validationErrors[propertyName] = error;
      modMarineReceipt[propertyName] = value;
      this.setState({ validationErrors, modMarineReceipt });
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modAssociations = lodash.cloneDeep(this.state.modAssociations);
      let modReceiptCompartment = lodash.cloneDeep(
        this.state.modReceiptCompartment
      );
      modAssociations[cellData.rowIndex][cellData.field] = newVal;
      if (
        cellData.field === "SupplierCode" ||
        cellData.field === "OriginTerminalCode" ||
        cellData.field === "FinishedProductCode"
      ) {
        this.getFinishedProduct(modAssociations, cellData);
      }
      if (cellData.field === "ShareholderCode") {
        modAssociations[cellData.rowIndex]["SupplierCode"] = "";
        modAssociations[cellData.rowIndex]["OriginTerminalCode"] = "";
        modAssociations[cellData.rowIndex]["FinishedProductCode"] = "";
        let suppliers = this.state.shareholderSuppliers.filter(
          (shareholderCust) => shareholderCust.ShareholderCode === newVal
        );
        if (suppliers.length > 0) {
          var supplierDestinationOptions;
          supplierDestinationOptions = suppliers[0].SupplierOriginTerminalsList;

          this.setState({ supplierDestinationOptions });
        } else {
          console.log("no suppliers identified for shareholder");
        }
      } else if (cellData.field === "SupplierCode") {
        let shareholderSupplier = this.state.shareholderSuppliers.filter(
          (shareholderCust) =>
            shareholderCust.ShareholderCode === cellData.rowData.ShareholderCode
        );
        let supplierDestinationOptions =
          shareholderSupplier[0].SupplierOriginTerminalsList;
        if (
          supplierDestinationOptions !== undefined &&
          supplierDestinationOptions !== null
        ) {
          if (
            supplierDestinationOptions[newVal] !== undefined &&
            Array.isArray(supplierDestinationOptions[newVal]) &&
            supplierDestinationOptions[newVal].length === 1
          ) {
            modAssociations[cellData.rowIndex]["OriginTerminalCode"] =
              supplierDestinationOptions[newVal][0];
            this.getFinishedProduct(modAssociations, cellData);
          } else {
            modAssociations[cellData.rowIndex]["OriginTerminalCode"] = "";
          }
        }
      } else if (cellData.field === "CompartmentSeqNoInVehicle") {
        let vehicleDetails = this.state.modVehicleDetails;
        let vehicleCompartments = vehicleDetails.vehicleCompartments.filter(
          (vc) => vc.vehCompSeq.toString() === newVal.toString()
        );
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
        }
      } else if (cellData.field === "AdjustPlan") {
        let rowIndex = modReceiptCompartment.findIndex(
          (item) =>
            item.CompartmentSeqNoInVehicle ===
            cellData.rowData.CompartmentSeqNoInVehicle
        );
        modReceiptCompartment[rowIndex][cellData.field] = newVal;
      } else if (cellData.field === "ForceComplete") {
        let rowIndex = modReceiptCompartment.findIndex(
          (item) =>
            item.CompartmentSeqNoInVehicle ===
            cellData.rowData.CompartmentSeqNoInVehicle
        );
        modReceiptCompartment[rowIndex][cellData.field] =
          !modReceiptCompartment[rowIndex][cellData.field];
      }
      this.toggleExpand(modAssociations[cellData.rowIndex], true, true);
      this.setState({
        modReceiptCompartment,
        modAssociations,
      });
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };

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
        "MarineReceiptDetailsComposite:Error occured on handleAttributeCellDataEdit",
        error
      );
    }
  };

  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    let compIndex = modAssociations.findIndex(
      (item) => item.SequenceNo === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0) {
      if (compAttribute.rowData.DataType === "Bool") {
        if (compAttribute.rowData.AttributeValue === "true") {
          modAssociations[compIndex].AttributesforUI[
            // compAttribute.rowIndex
            compAttribute.rowData.SeqNumber - 1
          ].AttributeValue = "false";
        } else {
          modAssociations[compIndex].AttributesforUI[
            // compAttribute.rowIndex
            compAttribute.rowData.SeqNumber - 1
          ].AttributeValue = "true";
        }
      } else {
        modAssociations[compIndex].AttributesforUI[
          // compAttribute.rowIndex
          compAttribute.rowData.SeqNumber - 1
        ].AttributeValue = value;
      }
    }

    this.setState({ modAssociations });
    if (compIndex >= 0)
      this.toggleExpand(modAssociations[compIndex], true, true);
  };

  handleTankCellDataEdit = (newVal, cellData) => {
    try {
      let modTankAssociations = lodash.cloneDeep(
        this.state.modTankAssociations
      );
      modTankAssociations[cellData.rowIndex][cellData.field] = newVal;
      if (cellData.field === "ShareholderCode") {
        modTankAssociations[cellData.rowIndex]["FinishedProductCode"] = "";
        modTankAssociations[cellData.rowIndex]["BaseProductCode"] = "";
        modTankAssociations[cellData.rowIndex]["SupplierCode"] = "";
      } else if (cellData.field === "CompartmentSeqNoInVehicle") {
        let vehicleDetails = this.state.modVehicleDetails;
        let vehicleCompartments = vehicleDetails.vehicleCompartments.filter(
          (vc) => vc.vehCompSeq.toString() === newVal.toString()
        );
        if (vehicleCompartments.length > 0) {
          modTankAssociations[cellData.rowIndex]["PlannedQuantity"] =
            vehicleCompartments[0].SFL !== null &&
              vehicleCompartments[0].SFL !== ""
              ? vehicleCompartments[0].SFL.toLocaleString()
              : null;
          modTankAssociations[cellData.rowIndex]["TrailerCode"] =
            vehicleCompartments[0].trailerCode;
          modTankAssociations[cellData.rowIndex]["CompartmentCode"] =
            vehicleCompartments[0].compCode;
        }
      } else if (cellData.field === "FinishedProductCode") {
        if (modTankAssociations[cellData.rowIndex][cellData.field] === "") {
          modTankAssociations[cellData.rowIndex]["BaseProductCode"] = "";
          modTankAssociations[cellData.rowIndex]["TankCode"] = "";
        }
      } else if (cellData.field === "BaseProductCode") {
        let BPCodeTankCodeList = this.state.tankCodeOptions;
        if (BPCodeTankCodeList !== undefined && BPCodeTankCodeList !== null) {
          if (
            BPCodeTankCodeList[newVal] !== undefined &&
            Array.isArray(BPCodeTankCodeList[newVal]) &&
            BPCodeTankCodeList[newVal].length === 1
          ) {
            modTankAssociations[cellData.rowIndex]["tankCode"] =
              BPCodeTankCodeList[newVal][0];
          } else {
            modTankAssociations[cellData.rowIndex]["tankCode"] = "";
          }
        }
      } else if (cellData.field === "TankCode") {
        var receiptCompartmentTanks = [];
        var receiptCompartmentTank = lodash.cloneDeep(
          emptyReceiptCompartmentTanks
        );
        receiptCompartmentTank.CompartmentCode =
          modTankAssociations[cellData.rowIndex].CompartmentCode;
        receiptCompartmentTank.CompartmentSeqNoInVehicle =
          modTankAssociations[cellData.rowIndex].CompartmentSeqNoInVehicle;
        receiptCompartmentTank.PlannedQuantity =
          Utilities.convertStringtoDecimal(
            modTankAssociations[cellData.rowIndex].PlannedQuantity
          );
        receiptCompartmentTank.PlanQuantityUOM =
          modTankAssociations[cellData.rowIndex].PlanQuantityUOM;
        receiptCompartmentTank.ReceiptCode =
          modTankAssociations[cellData.rowIndex].ReceiptCode;
        receiptCompartmentTank.TankCode =
          modTankAssociations[cellData.rowIndex].TankCode;
        receiptCompartmentTanks.push(receiptCompartmentTank);
        modTankAssociations[cellData.rowIndex]["ReceiptCompartmentTanks"] =
          receiptCompartmentTanks;
      } else if (cellData.field === "PlannedQuantity") {
        if (
          modTankAssociations[cellData.rowIndex]["ReceiptCompartmentTanks"] !==
          null &&
          modTankAssociations[cellData.rowIndex]["ReceiptCompartmentTanks"] !==
          "" &&
          modTankAssociations[cellData.rowIndex]["ReceiptCompartmentTanks"]
            .length !== 0
        ) {
          modTankAssociations[cellData.rowIndex][
            "ReceiptCompartmentTanks"
          ][0].PlannedQuantity = Utilities.convertStringtoDecimal(
            modTankAssociations[cellData.rowIndex].PlannedQuantity
          );
        }
      }
      this.setState({
        modTankPlanAssociations: modTankAssociations,
        modTankAssociations,
      });
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleTankCellDataEdit",
        error
      );
    }
  };

  onTabChange = (activeIndex) => {
    if (activeIndex === 1) {
      this.setState({
        modTankAssociations: this.state.modTankPlanAssociations,
      });
    }
    this.props.onTabChange(activeIndex);
  };

  handleTankAssociationSelectionChange = (e) => {
    this.setState({ selectedTankAssociations: e });
  };

  handleAssociationSelectionChange = (e) => {
    this.setState({ selectedAssociations: e });
  };

  handleManualEntry = () => {
    this.setState({ isManualEntry: true, isReadyToRender: false });
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.marineReceipt.ReceiptCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getMarineReceipt(true, nextProps.selectedRow.Common_Code);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getUoms() {
    axios(
      RestApis.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;

        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            //let quantityUOMOptions = [];
            let shipmentUOM = lodash.cloneDeep(this.state.shipmentUOM);
            if (Array.isArray(result.EntityResult.VOLUME)) {
              shipmentUOM = Utilities.transferListtoOptions(
                result.EntityResult.VOLUME
              );
            }
            if (Array.isArray(result.EntityResult.MASS)) {
              let massUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.MASS
              );
              massUOMOptions.forEach((massUOM) => shipmentUOM.push(massUOM));
            }

            this.setState({ shipmentUOM });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetUOMList:", error);
      });
  }

  getVessel(vehicleCode, vesselChanged) {
    let modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
    let modVehicleDetails = lodash.cloneDeep(this.state.modVehicleDetails);
    modMarineReceipt.VesselCode = vehicleCode;
    var keyCode = [
      {
        key: "VehicleCode",
        value: vehicleCode,
      },
      {
        key: KeyCodes.transportationType,
        value: "MARINE",
      },
      {
        key: KeyCodes.carrierCode,
        value: modMarineReceipt.CarrierCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: "VehicleCode",
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetVessel,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            // modMarineReceipt.CarrierCode =
            //   result.EntityResult.CarrierCompanyCode;
            modVehicleDetails.carrierCode =
              result.EntityResult.CarrierCompanyCode;
            modVehicleDetails.vehicleCompartments =
              this.getCompartmentDetailsFromVehicle(result.EntityResult);
            let compSeqOptions = [];
            modVehicleDetails.vehicleCompartments.forEach(
              (vehicleCompartment) =>
                compSeqOptions.push({
                  text: vehicleCompartment.vehCompSeq.toString(),
                  value: vehicleCompartment.vehCompSeq.toString(),
                })
            );

            if (vesselChanged) {
              this.setState({
                modTankAssociations: [],
              });
              let modAssociations =
                this.getShipmentCompartmentFromVehicleCompartment(
                  modVehicleDetails.vehicleCompartments
                );
              if (
                this.state.modMarineReceipt.QuantityUOM != null &&
                this.state.modMarineReceipt.QuantityUOM !== ""
              ) {
                modAssociations.forEach((modAssociation) => {
                  modAssociation.QuantityUOM =
                    this.state.modMarineReceipt.QuantityUOM;
                });
              }
              if (
                this.state.modMarineReceipt.ReceiptCode !== null &&
                this.state.modMarineReceipt.ReceiptCode !== ""
              ) {
                modAssociations.forEach((modAssociation) => {
                  modAssociation.ReceiptCode =
                    this.state.modMarineReceipt.ReceiptCode;
                });
              }
              this.setState({ modAssociations }, () => {
                var terminalCodes = lodash.cloneDeep(
                  this.state.modMarineReceipt.TerminalCodes
                );
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
                } else {
                  if (terminalCodes !== undefined && terminalCodes !== null) {
                    this.formCompartmentAttributes(terminalCodes);
                  }
                }
              });
            }

            this.setState({
              modMarineReceipt,
              modVehicleDetails,
              compSeqOptions,
            });

            if (
              this.state.marineReceipt.VehicleCode ===
              modMarineReceipt.VehicleCode
            ) {
              let vehicleDetails = lodash.cloneDeep(modVehicleDetails);
              this.setState({ vehicleDetails });
            }
          }
        } else {
          console.log("Error in getVessel:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getVessel:", error);
      });
  }

  getFinishedProduct(modAssociations, cellData) {
    var modTankAssociations = lodash.cloneDeep(
      this.state.modTankPlanAssociations
    );
    try {
      if (
        modAssociations[cellData.rowIndex]["SupplierCode"] !== null &&
        modAssociations[cellData.rowIndex]["FinishedProductCode"] !== null &&
        modAssociations[cellData.rowIndex]["OriginTerminalCode"] !== null &&
        modAssociations[cellData.rowIndex]["Quantity"] !== null
      ) {
        modTankAssociations = modTankAssociations.filter(
          (modTankPlanAssociation) => {
            return (
              modTankPlanAssociation.CompartmentSeqNoInVehicle !==
              modAssociations[cellData.rowIndex].CompartmentSeqNoInVehicle
            );
          }
        );
        var keyCode = [
          {
            key: KeyCodes.finishedProductCode,
            value: modAssociations[cellData.rowIndex].FinishedProductCode,
          },
        ];
        var obj = {
          ShareHolderCode: cellData.rowData.ShareholderCode,
          keyDataCode: KeyCodes.finishedProductCode,
          KeyCodes: keyCode,
        };
        axios(
          RestApis.GetFinishedProduct,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.FinishedProductItems.length !== 0) {
              var finishedProductItems =
                result.EntityResult.FinishedProductItems;
              var totalQuantity = 0;
              for (let k = 0; k < finishedProductItems.length; k++) {
                totalQuantity += finishedProductItems[k].Quantity;
              }
              for (let j = 0; j < finishedProductItems.length; j++) {
                var tankAssociation = lodash.cloneDeep(
                  emptyReceiptCompartmentPlan
                );
                var finishedProductCode = finishedProductItems[j];
                tankAssociation.SequenceNo = this.state.length + j + 1;
                tankAssociation.ShareholderCode =
                  modAssociations[cellData.rowIndex].ShareholderCode;
                tankAssociation.CompartmentCode =
                  modAssociations[cellData.rowIndex].CompartmentCode;
                tankAssociation.CompartmentSeqNoInVehicle =
                  modAssociations[cellData.rowIndex].CompartmentSeqNoInVehicle;
                tankAssociation.FinishedProductCode =
                  modAssociations[cellData.rowIndex].FinishedProductCode;
                tankAssociation.BaseProductCode =
                  finishedProductCode.AdditiveCode === null
                    ? finishedProductCode.BaseProductCode
                    : finishedProductCode.AdditiveCode;
                tankAssociation.PlannedQuantity = (
                  (Utilities.convertStringtoDecimal(
                    modAssociations[cellData.rowIndex].Quantity
                  ) *
                    finishedProductCode.Quantity) /
                  totalQuantity
                ).toLocaleString();
                tankAssociation.PlanQuantityUOM =
                  modAssociations[cellData.rowIndex].QuantityUOM;
                tankAssociation.ReceiptCode =
                  this.state.modMarineReceipt.ReceiptCode;
                modTankAssociations.push(tankAssociation);
              }
              this.setState({
                length: this.state.length + finishedProductItems.length,
              });
            }
          }
        });
      }
      this.setState({
        modTankPlanAssociations: modTankAssociations,
      });
    } catch (error) {
      console.log(error);
    }
  }

  getCompartmentDetailsFromVehicle(vehicleInfo) {
    let vehicleCompartments = [];
    let seqNum = 1;

    vehicleInfo.VehicleTrailers.forEach((vehicleTrailer) => {
      if (Array.isArray(vehicleTrailer.Trailer.Compartments)) {
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

  getShipmentCompartmentFromVehicleCompartment(vehicleCompartments) {
    let shipmentCompartments = [];
    try {
      if (Array.isArray(vehicleCompartments)) {
        for (let i = 0; i < vehicleCompartments.length; i++) {
          let vehicleCompartment = vehicleCompartments[i];
          let shipmentCompartment = {
            AssociatedContractItems: null,
            AssociatedOrderItems: null,
            Attributes: [],
            CarrierCompanyCode: null,
            CompartmentCode: vehicleCompartment.compCode,
            CompartmentSeqNoInVehicle: vehicleCompartment.vehCompSeq,
            CustomerCode: null,
            FinishedProductCode: null,
            OriginTerminalCode: null,
            Quantity:
              vehicleCompartment.SFL !== null && vehicleCompartment.SFL !== ""
                ? vehicleCompartment.SFL.toLocaleString()
                : null,
            QuantityUOM: vehicleCompartment.UOM,
            ReceiptCode: null,
            SequenceNo: vehicleCompartment.trailerCompSeq,
            ShareholderCode: this.props.selectedShareholder,
            SupplierCode: null,
            TrailerCode: vehicleCompartment.trailerCode,
            attributesForUI: this.state.modAssociations.attributesForUI,
          };
          shipmentCompartments.push(shipmentCompartment);
        }
      }
      return shipmentCompartments;
    } catch (error) {
      return "";
    }
  }

  getVesselCodeByCarrier(shareholder) {
    if (
      this.state.modMarineReceipt.CarrierCode !== undefined &&
      this.state.modMarineReceipt.CarrierCode !== null &&
      shareholder !== undefined &&
      shareholder !== null
    ) {
      let { carrierShareholderMap } = this.state;
      axios(
        RestApis.GetVehicleCodesByCarrier +
        "?ShareholderCode=" +
        carrierShareholderMap.get(this.state.modMarineReceipt.CarrierCode) +
        "&Transportationtype=" +
        Constants.TransportationType.MARINE +
        "&CarrierCode=" +
        this.state.modMarineReceipt.CarrierCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult)
            ) {
              var vessels = [];
              result.EntityResult.forEach((vessel) => {
                vessels.push({
                  text: vessel,
                  value: vessel,
                });
              });
              let vesselSearchOptions = lodash.cloneDeep(vessels);
              if (vesselSearchOptions.length > Constants.filteredOptionsCount) {
                vesselSearchOptions = vesselSearchOptions.slice(
                  0,
                  Constants.filteredOptionsCount
                );
              }
              this.setState({ vessels, vesselSearchOptions });
            }
          } else {
            console.log("Error in getVesselCodeByCarrier:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Vessel List:", error);
        });
    }
  }

  getFinishedProductCodes(shareholder) {
    try {
      axios(
        RestApis.GetFinishedProductListForShareholder +
        "?ShareholderCode=" +
        shareholder +
        "&Transportationtype=" +
        Constants.TransportationType.MARINE,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              var FinishedProducts = result.EntityResult;
              this.setState({ FinishedProducts });
            }
          } else {
            console.log("Error in GetFinishedProductCodes:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while GetFinishedProductCodes List:", error);
        });
    } catch (error) {
      console.log(
        "GetFinishedProductCodes:Error occured on GetFinishedProductCodes",
        error
      );
    }
  }

  getSupplierOriginTerminals(shareholder) {
    axios(
      RestApis.GetSupplierOriginTerminals +
      "?ShareholderCode=" +
      shareholder +
      "&Transportationtype=" +
      Constants.TransportationType.MARINE,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;

        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let shareholderSuppliers = result.EntityResult;
            if (shareholderSuppliers.length > 0) {
              this.setState({ shareholderSuppliers: shareholderSuppliers });
            } else {
              console.log("no customers identified for shareholder");
            }
          } else {
            console.log("customerdestinations not identified for shareholder");
          }
        } else {
          console.log("Error in getOriginTerminals:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getOriginTerminals List:", error);
      });
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getUoms();
      this.getBaseProductList();
      this.getAdditivesList();
      this.getFinishedProductCodes("");
      this.getSupplierOriginTerminals("");
      this.getLookUpData();
      this.GetReceiptStatusOperations(this.props.selectedRow);
      this.getReceiptCompartmentDetails(this.props.selectedRow);
      this.getAdjustPlanPermission(this.props.selectedRow);
      this.getForceCompletenPermission(this.props.selectedRow);
      let isNewMarineReceipt = false;
      if (this.props.selectedRow.Common_Code === undefined)
        isNewMarineReceipt = true;
      this.getAttributes(isNewMarineReceipt);
      this.getCarrierList();
      this.getCarrierShareholder();
      this.getTransloading();
      this.getBond();
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getBond() {
    axios(
      RestApis.GetBondLookUpSetting,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isBondShow = false;
          if (result.EntityResult === "True") {
            isBondShow = true;
          }
          this.setState({ isBondShow });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "MarineReceiptDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getTransloading() {
    axios(
      RestApis.GetLookUpData + "?LookUpTypeCode=Transloading",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isTransloading = false;
          if (result.EntityResult.MarineEnable === "True") {
            isTransloading = true;
          }
          this.setState({ isTransloading });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "MarineReceiptDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getLookUpData() {
    axios(
      RestApis.GetLookUpData + "?LookUpTypeCode=HSEInspection",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isHSEInspectionEnable = false;
          if (result.EntityResult.EnableMarine === "True") {
            isHSEInspectionEnable = true;
          }
          this.setState({ isHSEInspectionEnable });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "MarineReceiptDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getAttributes(isNewMarineReceipt) {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [marineReceiptAttributeEntity, marineReceiptCompAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.marineReceipt === null ||
            result.EntityResult.marineReceipt === undefined
          ) {
            result.EntityResult.marineReceipt = [];
          }
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.marineReceipt
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.marineReceipt
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.marineReceiptCompartmentDetail
              ),
            },
            () =>
              this.getMarineReceipt(
                isNewMarineReceipt,
                this.props.selectedRow.Common_Code
              )
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  GetReceiptStatusOperations(selectedRow) {
    try {
      axios(
        RestApis.GetMarineReceiptOperations +
        "?MarineReceiptStatus=" +
        selectedRow.MarineReceiptByCompartmentList_ReceiptStatus,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          let nextOperations = [];
          Object.keys(result.EntityResult).forEach((operation) => {
            if (result.EntityResult[operation]) nextOperations.push(operation);
          });
          this.operationPermissionControl(nextOperations);
        })
        .catch((error) => {
          console.log("Error while getting GetReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  getMarineReceipt(isNewMarineReceipt, commonCode) {
    try {
      var transportationType = this.getTransportationType();
      emptyMarineReceipt.TransportationType = transportationType;
      emptyMarineReceipt.Active = true;
      emptyMarineReceipt.QuantityUOM =
        this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.MARINE;
      emptyMarineReceipt.TerminalCodes =
        this.props.terminalCodes.length === 1
          ? [...this.props.terminalCodes]
          : [];
      if (isNewMarineReceipt) {
        if (
          emptyMarineReceipt.TerminalCodes !== undefined &&
          emptyMarineReceipt.TerminalCodes !== null &&
          emptyMarineReceipt.TerminalCodes.length !== 0
        ) {
          this.getTankListForRole(emptyMarineReceipt.TerminalCodes[0]);
        } else {
          this.getTankListForRole("");
        }
        this.setState(
          {
            marineReceipt: { ...emptyMarineReceipt },
            modMarineReceipt: { ...emptyMarineReceipt },
            modAssociations: [],
            isReadyToRender: true,
            selectedAttributeList: [],
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnMarineReceiptByCompartment
            ),
            isNewReceipt: true,
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
          key: KeyCodes.marineReceiptCode,
          value: commonCode,
        },
        {
          key: KeyCodes.transportationType,
          value: transportationType,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.marineReceiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestApis.GetMarineReceipt,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var modTankAssociations = [];
            for (
              let i = 0;
              i <
              result.EntityResult.RailMarineReceiptCompartmentPlanList.length;
              i++
            ) {
              var keyCode = [
                {
                  key: KeyCodes.finishedProductCode,
                  value:
                    result.EntityResult.RailMarineReceiptCompartmentPlanList[i]
                      .FinishedProductCode,
                },
              ];
              var obj = {
                ShareHolderCode:
                  result.EntityResult.RailMarineReceiptCompartmentPlanList[i]
                    .ShareholderCode,
                keyDataCode: KeyCodes.finishedProductCode,
                KeyCodes: keyCode,
              };
              axios(
                RestApis.GetFinishedProduct,
                Utilities.getAuthenticationObjectforPost(
                  obj,
                  this.props.tokenDetails.tokenInfo
                )
              ).then((response) => {
                var result1 = response.data;
                if (result1.IsSuccess === true) {
                  // if (result1.EntityResult.FinishedProductItems.length !== 0) {
                  var finishedProductItems =
                    result1.EntityResult.FinishedProductItems;
                  var totalQuantity = 0;
                  for (
                    let k = 0;
                    k < result1.EntityResult.FinishedProductItems.length;
                    k++
                  ) {
                    totalQuantity +=
                      result1.EntityResult.FinishedProductItems[k].Quantity;
                  }
                  for (let j = 0; j < finishedProductItems.length; j++) {
                    var tankAssociation = lodash.cloneDeep(
                      emptyReceiptCompartmentPlan
                    );
                    tankAssociation.SequenceNo = this.state.length + j + 1;
                    tankAssociation.ShareholderCode =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].ShareholderCode;
                    tankAssociation.CompartmentSeqNoInVehicle =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].CompartmentSeqNoInVehicle;
                    tankAssociation.FinishedProductCode =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].FinishedProductCode;
                    tankAssociation.BaseProductCode =
                      finishedProductItems[j].AdditiveCode === null
                        ? finishedProductItems[j].BaseProductCode
                        : finishedProductItems[j].AdditiveCode;
                    tankAssociation.PlanQuantityUOM =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].PlanQuantityUOM;
                    tankAssociation.CompartmentCode =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].CompartmentCode;
                    tankAssociation.TankCode =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].ReceiptCompartmentTanks !== null &&
                        result.EntityResult.RailMarineReceiptCompartmentPlanList[
                          i
                        ].ReceiptCompartmentTanks.length !== 0
                        ? result.EntityResult
                          .RailMarineReceiptCompartmentPlanList[i]
                          .ReceiptCompartmentTanks[j].TankCode
                        : "";
                    tankAssociation.PlannedQuantity =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].ReceiptCompartmentTanks !== null &&
                        result.EntityResult.RailMarineReceiptCompartmentPlanList[
                          i
                        ].ReceiptCompartmentTanks !== "" &&
                        result.EntityResult.RailMarineReceiptCompartmentPlanList[
                          i
                        ].ReceiptCompartmentTanks.length !== 0
                        ? result.EntityResult.RailMarineReceiptCompartmentPlanList[
                          i
                        ].ReceiptCompartmentTanks[
                          j
                        ].PlannedQuantity.toLocaleString()
                        : (
                          result.EntityResult
                            .RailMarineReceiptCompartmentDetailPlanList[i]
                            .Quantity *
                          (finishedProductItems[j].Quantity / totalQuantity)
                        ).toLocaleString();
                    // result.EntityResult
                    //   .RailMarineReceiptCompartmentDetailPlanList[i]
                    //   .Quantity !== "" &&
                    // result.EntityResult
                    //   .RailMarineReceiptCompartmentDetailPlanList[i]
                    //   .Quantity !== null
                    //   ? (
                    //       result.EntityResult
                    //         .RailMarineReceiptCompartmentDetailPlanList[i]
                    //         .Quantity *
                    //       (finishedProductItems[j].Quantity / totalQuantity)
                    //     ).toLocaleString()
                    //   : "";

                    var receiptCompartmentTanks = [];
                    var receiptCompartmentTank = lodash.cloneDeep(
                      emptyReceiptCompartmentTanks
                    );
                    receiptCompartmentTank.CompartmentCode =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].CompartmentCode;
                    receiptCompartmentTank.CompartmentSeqNoInVehicle =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].CompartmentSeqNoInVehicle;
                    receiptCompartmentTank.PlannedQuantity =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].ReceiptCompartmentTanks !== null &&
                        result.EntityResult.RailMarineReceiptCompartmentPlanList[
                          i
                        ].ReceiptCompartmentTanks !== "" &&
                        result.EntityResult.RailMarineReceiptCompartmentPlanList[
                          i
                        ].ReceiptCompartmentTanks.length !== 0
                        ? result.EntityResult.RailMarineReceiptCompartmentPlanList[
                          i
                        ].ReceiptCompartmentTanks[
                          j
                        ].PlannedQuantity.toLocaleString()
                        : result.EntityResult
                          .RailMarineReceiptCompartmentPlanList[i]
                          .PlannedQuantity *
                        (finishedProductItems[j].Quantity / totalQuantity);
                    // result.EntityResult
                    //   .RailMarineReceiptCompartmentDetailPlanList[i]
                    //   .Quantity !== "" &&
                    // result.EntityResult
                    //   .RailMarineReceiptCompartmentDetailPlanList[i]
                    //   .Quantity !== null
                    //   ? result.EntityResult
                    //       .RailMarineReceiptCompartmentDetailPlanList[i]
                    //       .Quantity *
                    //     (finishedProductItems[j].Quantity / totalQuantity)
                    //   : "";
                    receiptCompartmentTank.PlanQuantityUOM =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].PlanQuantityUOM;
                    receiptCompartmentTank.TankCode =
                      result.EntityResult.RailMarineReceiptCompartmentPlanList[
                        i
                      ].ReceiptCompartmentTanks.length === 0
                        ? ""
                        : result.EntityResult
                          .RailMarineReceiptCompartmentPlanList[i]
                          .ReceiptCompartmentTanks[j].TankCode;
                    receiptCompartmentTanks.push(receiptCompartmentTank);
                    tankAssociation.ReceiptCompartmentTanks =
                      receiptCompartmentTanks;
                    modTankAssociations.push(tankAssociation);
                  }
                  this.setState({
                    length: this.state.length + finishedProductItems.length,
                  });
                  // } else {
                  //   this.setState({
                  //     finishedProductItems: [],
                  //   });
                  // }
                } else {
                  this.setState({
                    finishedProductItems: [],
                  });
                }
              });
            }
            let marineReceipt = lodash.cloneDeep(result.EntityResult);
            marineReceipt.HSEInspectionStatus = Utilities.getKeyByValue(
              Constants.HSEInpectionStatus,
              marineReceipt.HSEInspectionStatus
            );
            this.setState(
              {
                isNewReceipt: false,
                isReadyToRender: true,
                marineReceipt: marineReceipt,
                modMarineReceipt: marineReceipt,
                modAssociations: this.getAssociationsFromReceipt(
                  result.EntityResult
                ),
                modTankAssociations: modTankAssociations,
                modTankPlanAssociations: modTankAssociations,
                tempModTankAssociations: modTankAssociations,
                saveEnabled:
                  Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.modify,
                    fnMarineReceiptByCompartment
                  ) && this.props.updateEnableForConfigure //result.EntityResult.ReceiptStatus === "READY",
              },
              () => {
                if (
                  marineReceipt.TerminalCodes !== undefined &&
                  marineReceipt.TerminalCodes !== null &&
                  marineReceipt.TerminalCodes.length !== 0
                ) {
                  // this.getTerminalsForCarrier(result.EntityResult.CarrierCode);
                  this.getTankListForRole(marineReceipt.TerminalCodes[0]);
                } else {
                  this.getTankListForRole("");
                }
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  this.terminalSelectionChange(
                    result.EntityResult.TerminalCodes
                  );
                } else {
                  this.localNodeAttribute();
                }
              }
            );
            this.getVesselCodeByCarrier(this.props.selectedShareholder);
            this.getVessel(result.EntityResult.VesselCode, false);
            this.getKPIList(result.EntityResult.ReceiptCode)
          } else {
            this.setState({
              isNewReceipt: false,
              marineReceipt: lodash.cloneDeep(emptyMarineReceipt),
              modMarineReceipt: lodash.cloneDeep(emptyMarineReceipt),
              isReadyToRender: true,
            });
            console.log("Error in getMarineReceipt:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting marineReceipt:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getTerminalsForCarrier(carrier) {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      const modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
      let terminalCodes = [...this.state.terminalCodes];
      modMarineReceipt.CarrierCode = carrier;
      modMarineReceipt.VesselCode = "";
      modMarineReceipt.modAssociations = [];

      try {
        if (carrier === undefined) {
          terminalCodes = [];
          modMarineReceipt.TerminalCodes = [];
          this.setState({ terminalCodes, modMarineReceipt });
          return;
        }
        let keyCode = [
          {
            key: KeyCodes.carrierCode,
            value: carrier,
          },
          {
            key: KeyCodes.transportationType,
            value: Constants.TransportationType.MARINE,
          },
        ];
        let obj = {
          ShareHolderCode: this.props.selectedShareholder,
          keyDataCode: KeyCodes.carrierCode,
          KeyCodes: keyCode,
        };
        axios(
          RestApis.GetCarrier,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            let result = response.data;
            if (
              result.IsSuccess === true &&
              result.EntityResult !== null &&
              result.EntityResult.TerminalCodes !== null
            ) {
              terminalCodes = [...result.EntityResult.TerminalCodes];
              this.setState({ terminalCodes }, () => { });
            } else {
              terminalCodes = [];
              this.setState({ terminalCodes });
            }
            let marineReceipt = { ...this.state.marineReceipt };
            if (
              marineReceipt.ReceiptCode === undefined ||
              marineReceipt.ReceiptCode === "" ||
              marineReceipt.ReceiptCode === null
            ) {
              if (terminalCodes.length === 1) {
                modMarineReceipt.TerminalCodes = [...terminalCodes];
                //this.terminalSelectionChange(modMarineReceipt.TerminalCodes);
              } else {
                modMarineReceipt.TerminalCodes = [];
                //this.terminalSelectionChange([]);
              }
            }
            if (Array.isArray(modMarineReceipt.TerminalCodes)) {
              modMarineReceipt.TerminalCodes = terminalCodes.filter((x) =>
                modMarineReceipt.TerminalCodes.includes(x)
              );
            }
            this.setState({ modMarineReceipt }, () =>
              //this.formCompartmentAttributes());
              this.terminalSelectionChange(modMarineReceipt.TerminalCodes)
            );
          })
          .catch((error) => {
            terminalCodes = [];
            modMarineReceipt.TerminalCodes = [];
            this.setState({ terminalCodes, modMarineReceipt }, () =>
              this.formCompartmentAttributes([])
            );
            console.log("Error while getting Carrier:", error, carrier);
            //throw error;
          });
      } catch (error) {
        terminalCodes = [];
        modMarineReceipt.TerminalCodes = [];
        this.setState({ terminalCodes, modMarineReceipt }, () =>
          this.formCompartmentAttributes([])
        );
        console.log(
          "TrailerDetailsComposite:Error occured on handleCarrierChange",
          error
        );
      }
    } else {
      this.formCompartmentAttributes([]);
    }
  }

  getTransportationType() {
    var transportationType = Constants.TransportationType.MARINE;
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transportationType = genericProps.transportationType;
    }
    return transportationType;
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList) && attributeMetaDataList.length > 0) {
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      } else {
        var compAttributeMetaDataList = lodash.cloneDeep(
          this.state.compartmentAttributeMetaDataList
        );
        if (Array.isArray(compAttributeMetaDataList) && compAttributeMetaDataList.length > 0)
          this.formCompartmentAttributes([
            compAttributeMetaDataList[0].TerminalCode,
          ]);
      }
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  validateSave(modMarineReceipt) {
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);

    Object.keys(marineReceiptValidationDef).forEach(function (key) {
      if (modMarineReceipt[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          marineReceiptValidationDef[key],
          modMarineReceipt[key]
        );
      }
    });
    if (modMarineReceipt.Active !== this.state.marineReceipt.Active) {
      if (
        modMarineReceipt.Remarks === null ||
        modMarineReceipt.Remarks === ""
      ) {
        validationErrors["Remarks"] =
          "Marine_ShipmentCompDetail_RemarksRequired";
      }
    }
    let notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [],
    };
    if (
      Array.isArray(
        modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList
      ) &&
      modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.length > 0
    ) {
      modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
        (compart) => {
          marineReceiptCompartDef.forEach((col) => {
            let err = "";

            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, compart[col.field]);
            }
            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: [
                  "Marine_ReceiptCompDetail_ShipmentNumber",
                  col.displayName,
                ],
                keyValues: [modMarineReceipt.ReceiptCode, compart[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });

          let updatedAttributes = [];
          if (
            compart.AttributesforUI !== null &&
            compart.AttributesforUI !== undefined
          )
            updatedAttributes = compart.AttributesforUI.filter(function (
              uIAttributes
            ) {
              return compart.Attributes.some(function (selAttribute) {
                let isPresent =
                  selAttribute.ListOfAttributeData.findIndex(
                    (item) => item.AttributeCode === uIAttributes.AttributeCode
                  ) >= 0
                    ? true
                    : false;
                return (
                  uIAttributes.TerminalCode === selAttribute.TerminalCode &&
                  isPresent
                );
              });
            });

          updatedAttributes.forEach((item) => {
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
                    compart.Code,
                    item.TerminalCode,
                    item.AttributeValue,
                  ],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              } else {
                notification.messageResultDetails.push({
                  keyFields: ["CompAttributeComp", item.AttributeName],
                  keyValues: [compart.Code, item.AttributeValue],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              }
            }
          });
          this.toggleExpand(compart, true, true);
        }
      );
    } else {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_MARINERECEIPT_COMP_DETAIL_PLAN_LIST_EMPTY",
      });
    }
    let uniqueRecords = [
      ...new Set(
        modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.map((a) =>
          a.CompartmentSeqNoInVehicle.toString()
        )
      ),
    ];
    if (
      uniqueRecords.length !==
      modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.length
    ) {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_RAILReceipt_ITEMPLAN_DUPLICATE",
      });
      this.props.onSaved(this.state.modMarineReceipt, "update", notification);
      return false;
    }
    this.setState({ validationErrors });

    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);
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
    else return returnValue;

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modMarineReceipt, "update", notification);
      return false;
    }
    return returnValue;
  }

  handleSave = () => {
    try {
      if (this.state.saveEnabled) {
        var modTankAssociations = lodash.cloneDeep(
          this.state.modTankAssociations
        );
        var tempTankAssociations = modTankAssociations.filter(
          (modTankAssociation) => {
            return modTankAssociation.ReceiptCompartmentTanks.length !== 0;
          }
        );
        tempTankAssociations = tempTankAssociations.filter(
          (tankAssociation) => {
            return tankAssociation.ReceiptCompartmentTanks[0].TankCode !== "";
          }
        );
        if (tempTankAssociations.length === 0) {
          var tankAssociations = [];
          this.saveMarineReceipt(tankAssociations);
        } else {
          this.saveMarineReceipt(modTankAssociations);
        }
        return;
      }
      const saveCompartmentDetails = this.handleSaveCompartmentDetailsEnabled();
      if (
        this.state.marineReceipt.ReceiptCode !== "" &&
        saveCompartmentDetails
      ) {
        this.handleCompartmentDetailsSave();
      }
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  addUpdateMarineDispatch = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempMarineReceipt = lodash.cloneDeep(this.state.tempMarineReceipt);

      this.state.marineReceipt.ReceiptCode === ""
        ? this.createMarineReceipt(tempMarineReceipt)
        : this.updateMarineReceipt(tempMarineReceipt);
    } catch (error) {
      console.log("MarineShipComposite : Error in addUpdateMarineDispatch");
    }
  };

  saveMarineReceipt(tankAssociations) {
    let modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
    modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList =
      this.getCompartmentFromAssociations(this.state.modAssociations);

    // this.setState({ saveEnabled: false });
    let modMarineReceipts = this.fillAttributeDetails(modMarineReceipt);
    if (this.validateSave(modMarineReceipts)) {
      modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList =
        modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.map(
          (detailPlan) => {
            detailPlan.Quantity = Utilities.convertStringtoDecimal(
              detailPlan.Quantity
            );
            return detailPlan;
          }
        );
      modMarineReceipt.RailMarineReceiptCompartmentPlanList =
        this.getTankPlanFromTankAssociations(tankAssociations);


      let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempMarineReceipt = lodash.cloneDeep(modMarineReceipt);
      this.setState({ showAuthenticationLayout, tempMarineReceipt }, () => {
        if (showAuthenticationLayout === false) {
          this.addUpdateMarineDispatch();
        }
      });

    } else {
      this.setState({ saveEnabled: true });
    }
  }

  fillAttributeDetails(modMarineReceipt) {
    try {
      let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);
      modMarineReceipt.Attributes = [];
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
        modMarineReceipt.Attributes.push(attribute);
      });

      // For Compartment Attributes
      modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
        (comp) => {
          let selectedTerminals = [];
          if (this.props.userDetails.EntityResult.IsEnterpriseNode)
            selectedTerminals = lodash.cloneDeep(
              modMarineReceipt.TerminalCodes
            );
          else {
            var compAttributeMetaDataList = lodash.cloneDeep(
              this.state.compartmentAttributeMetaDataList
            );
            if (compAttributeMetaDataList.length > 0)
              selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
          }
          let terminalAttributes = [];
          comp.Attributes = [];
          if (selectedTerminals !== undefined && selectedTerminals !== null) {
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
                comp.Attributes.push(attribute);
            });
          }
        }
      );
      this.setState({ modMarineReceipt });
      return modMarineReceipt;
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  createMarineReceipt(modMarineReceipt) {
    this.handleAuthenticationClose();
    modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach((item) => {
      item.QuantityUOM = modMarineReceipt.QuantityUOM;
    })
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: modMarineReceipt.ReceiptCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
      Entity: modMarineReceipt,
    };
    var notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
          keyValues: [modMarineReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestApis.CreateMarineReceipt,
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
          //   saveEnabled: Utilities.isInFunction(
          //     this.props.userDetails.EntityResult.FunctionsList,
          //     functionGroups.add,
          //     fnMarineReceipt
          //   ),
          // });
          // this.getMarineReceipt(false, modMarineReceipt.ReceiptCode);
          this.props.handlePageAdd(modMarineReceipt);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
          console.log("Error in CreateMarineReceipt:", result.ErrorList);
        }
        this.props.onSaved(modMarineReceipt, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modMarineReceipt, "add", notification);
      });
  }

  updateMarineReceipt(modMarineReceipt) {
    this.handleAuthenticationClose();
    modMarineReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach((item) => {
      item.QuantityUOM = modMarineReceipt.QuantityUOM;
    })
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: modMarineReceipt.ReceiptCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
      Entity: modMarineReceipt,
    };
    var notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
          keyValues: [modMarineReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.UpdateMarineReceipt,
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
          //   saveEnabled: Utilities.isInFunction(
          //     this.props.userDetails.EntityResult.FunctionsList,
          //     functionGroups.modify,
          //     fnMarineReceipt
          //   ),
          // });
          this.props.handlePageAdd(modMarineReceipt);
        } else {
          this.setState({
            saveEnabled: true,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateMarineReceipt:", result.ErrorList);
        }
        this.props.onSaved(modMarineReceipt, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modMarineReceipt, "modify", notification);
        this.setState({
          saveEnabled: true,
        });
      });
  }

  handleReset = () => {
    try {
      let vehicleDetails = lodash.cloneDeep(this.state.vehicleDetails);
      let modAssociations;
      let compSeqOptions = [];
      let modTankAssociations = [];
      let modTankPlanAssociations = [];
      if (this.state.marineReceipt.ReceiptCode === "") {
        modAssociations = [];
        compSeqOptions = [];
      } else {
        modAssociations = this.getAssociationsFromReceipt(
          this.state.marineReceipt
        );
        modTankAssociations = lodash.cloneDeep(
          this.state.tempModTankAssociations
        );
        modTankPlanAssociations = lodash.cloneDeep(
          this.state.tempModTankAssociations
        );
        vehicleDetails.vehicleCompartments.forEach((vehicleCompartment) =>
          compSeqOptions.push({
            text: vehicleCompartment.vehCompSeq.toString(),
            value: vehicleCompartment.vehCompSeq.toString(),
          })
        );
      }
      var modMarineReceipt = lodash.cloneDeep(this.state.marineReceipt);
      this.setState(
        {
          modTankAssociations,
          modTankPlanAssociations,
          modMarineReceipt,
          validationErrors: [],
          modVehicleDetails: lodash.cloneDeep(this.state.vehicleDetails),
          modAssociations,
          compSeqOptions,
          selectedAttributeList: [],
          selectedAssociations: [],
          selectedTankAssociations: [],
          vesselSearchOptions: [],
          terminalCodes: this.props.terminalCodes,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modMarineReceipt.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleReset",
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
        "MarineReceiptDetailsComposite:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      var modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
      validationErrors[propertyName] = error;
      modMarineReceipt[propertyName] = value;
      this.setState({ validationErrors, modMarineReceipt });
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== null && selectedTerminals !== undefined) {
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

        var modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
        selectedTerminals.forEach((terminal) => {
          var existitem = selectedAttributeList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });
          if (existitem === undefined) {
            attributeMetaDataList.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modMarineReceipt.Attributes.find(
                  (marineReceiptAttribute) => {
                    return marineReceiptAttribute.TerminalCode === terminal;
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
        this.formCompartmentAttributes(selectedTerminals);
        this.setState({ selectedAttributeList, attributeValidationErrors });
      }
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on terminalSelectionChange",
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
            compSequenceNo: "",
          });
        });
      });
      let attributesforNewComp = lodash.cloneDeep(compAttributes);
      modAssociations.forEach((comp) => {
        if (
          comp.CompartmentCode === null &&
          (comp.AttributesforUI === null || comp.AttributesforUI === undefined)
        ) {
          comp.AttributesforUI = [];
          attributesforNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.SequenceNo;
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
              assignedAttributes.compSequenceNo =
                comp.CompartmentSeqNoInVehicle;
              comp.AttributesforUI.push(assignedAttributes);
            });
          } else {
            let temp = lodash.cloneDeep(compAttributes);
            temp.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo =
                comp.CompartmentSeqNoInVehicle;
              comp.AttributesforUI.push(assignedAttributes);
            });
          }
        }
        this.toggleExpand(comp, true, true);
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modAssociations });
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }

  getAssociationsFromReceipt(receipt) {
    try {
      let associations = [];
      if (Array.isArray(receipt.RailMarineReceiptCompartmentDetailPlanList)) {
        receipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
          (receiptCompartment) =>
            associations.push({
              AssociatedContractItems:
                receiptCompartment.AssociatedContractItems,
              AssociatedOrderItems: receiptCompartment.AssociatedOrderItems,
              Attributes: receiptCompartment.Attributes,
              CarrierCompanyCode: receiptCompartment.CarrierCompanyCode,
              CompartmentCode: receiptCompartment.CompartmentCode,
              CompartmentSeqNoInVehicle:
                receiptCompartment.CompartmentSeqNoInVehicle,
              FinishedProductCode: receiptCompartment.FinishedProductCode,
              OriginTerminalCode: receiptCompartment.OriginTerminalCode,
              Quantity:
                receiptCompartment.Quantity !== null &&
                  receiptCompartment.Quantity !== ""
                  ? receiptCompartment.Quantity.toLocaleString()
                  : null,
              QuantityUOM: receiptCompartment.QuantityUOM,
              ReceiptCode: receiptCompartment.ReceiptCode,
              SequenceNo: receiptCompartment.CompartmentSeqNoInVehicle,
              ShareholderCode: receiptCompartment.ShareholderCode,
              SupplierCode: receiptCompartment.SupplierCode,
              TrailerCode: receiptCompartment.TrailerCode,
              IsTransloading: receiptCompartment.IsTransloading,
            })
        );
      }
      return associations;
    } catch (error) {
      return [];
    }
  }

  getCompartmentFromAssociations(modAssociations) {
    let compartment = [];
    if (Array.isArray(modAssociations)) {
      modAssociations.forEach((modAssociation) => {
        if (
          !(
            modAssociation.FinishedProductCode === null ||
            modAssociation.FinishedProductCode === ""
          ) ||
          !(
            modAssociation.SupplierCode === null ||
            modAssociation.SupplierCode === ""
          ) ||
          !(
            modAssociation.OriginTerminalCode === null ||
            modAssociation.OriginTerminalCode === ""
          )
        ) {
          compartment.push({
            AssociatedContractItems: modAssociation.AssociatedContractItems,
            AssociatedOrderItems: modAssociation.AssociatedOrderItems,
            Attributes: modAssociation.Attributes,
            AttributesforUI: modAssociation.AttributesforUI,
            CarrierCompanyCode: modAssociation.CarrierCompanyCode,
            CompartmentCode: modAssociation.CompartmentCode,
            CompartmentSeqNoInVehicle: modAssociation.CompartmentSeqNoInVehicle,
            CustomerCode: modAssociation.CustomerCode,
            FinishedProductCode: modAssociation.FinishedProductCode,
            OriginTerminalCode: modAssociation.OriginTerminalCode,
            Quantity: modAssociation.Quantity,
            QuantityUOM: modAssociation.QuantityUOM,
            ReceiptCode: this.state.modMarineReceipt.ReceiptCode,
            SequenceNo: modAssociation.SequenceNo,
            ShareholderCode: modAssociation.ShareholderCode,
            SupplierCode: modAssociation.SupplierCode,
            TrailerCode: modAssociation.TrailerCode,
            IsTransloading: modAssociation.IsTransloading,
          });
        }
      });
    }
    return compartment;
  }

  getTankPlanFromTankAssociations(modTankAssociations) {
    if (Array.isArray(modTankAssociations)) {
      modTankAssociations.forEach((modTankAssociation) => {
        if (modTankAssociation.PlannedQuantity !== null) {
          modTankAssociation.PlannedQuantity = Utilities.convertStringtoDecimal(
            modTankAssociation.PlannedQuantity
          );
        }
        if (
          modTankAssociation.ReceiptCompartmentTanks !== null &&
          modTankAssociation.ReceiptCompartmentTanks !== "" &&
          modTankAssociation.ReceiptCompartmentTanks.length !== 0
        ) {
          modTankAssociation.ReceiptCompartmentTanks[0].PlannedQuantity =
            Utilities.convertStringtoDecimal(
              modTankAssociation.ReceiptCompartmentTanks[0].PlannedQuantity
            );
        }
      });
    }
    return modTankAssociations;
  }

  handleVesselSearchChange = (vesselCode) => {
    try {
      let vesselSearchOptions = this.state.vessels.filter((item) =>
        item.value.toLowerCase().includes(vesselCode.toLowerCase())
      );

      if (vesselSearchOptions.length > Constants.filteredOptionsCount) {
        vesselSearchOptions = vesselSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }
      this.setState({
        vesselSearchOptions,
      });
    } catch (error) {
      console.log(
        "MarinReceiptDetailsComposite:Error occured on handleVesselSearchChange",
        error
      );
    }
  };

  getVesselSearchOptions() {
    let vesselSearchOptions = lodash.cloneDeep(this.state.vesselSearchOptions);
    let modVesselCode = this.state.modMarineReceipt.VesselCode;
    if (
      modVesselCode !== null &&
      modVesselCode !== "" &&
      modVesselCode !== undefined
    ) {
      let selectedVesselCode = vesselSearchOptions.find(
        (element) => element.value.toLowerCase() === modVesselCode.toLowerCase()
      );
      if (selectedVesselCode === undefined) {
        vesselSearchOptions.push({
          text: modVesselCode,
          value: modVesselCode,
        });
      }
    }
    return vesselSearchOptions;
  }

  getCarrierList() {
    axios(
      RestApis.GetCarrierCodes +
      "?ShareholderCode=" +
      "&Transportationtype=" +
      Constants.TransportationType.MARINE,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let carrierOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let carrierSearchOptions = lodash.cloneDeep(carrierOptions);
            if (carrierSearchOptions.length > Constants.filteredOptionsCount) {
              carrierSearchOptions = carrierSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ carrierOptions, carrierSearchOptions });
          }
        } else {
          console.log("Error in GetCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }
  getCarrierShareholder() {
    axios(
      RestApis.GetCarrierListForRole +
      "?ShareholderCode=&Transportationtype=" +
      Constants.TransportationType.MARINE,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let carrierShareholderMap = new Map();
          let carriers = result.EntityResult.Table;
          carriers.forEach((carrier) => {
            carrierShareholderMap.set(
              carrier.Common_Code,
              carrier.Common_Shareholder
            );
          });
          this.setState({ carrierShareholderMap });
        } else {
          console.log("Error in getCarrierShareholder:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting CarrierShareholder:", error);
      });
  }

  getCarrierSearchOptions() {
    let carrierSearchOptions = lodash.cloneDeep(
      this.state.carrierSearchOptions
    );
    let modCarrierCode = this.state.modMarineReceipt.CarrierCode;
    if (
      modCarrierCode !== null &&
      modCarrierCode !== "" &&
      modCarrierCode !== undefined
    ) {
      let selectedCarrierCode = carrierSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modCarrierCode.toLowerCase()
      );
      if (selectedCarrierCode === undefined) {
        carrierSearchOptions.push({
          text: modCarrierCode,
          value: modCarrierCode,
        });
      }
    }
    return carrierSearchOptions;
  }

  onCarrierCompanyChange = (data) => {
    try {
      const modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modMarineReceipt.CarrierCode = data;
      modMarineReceipt.VesselCode = "";
      this.setState(
        {
          modMarineReceipt,
          modAssociations: [],
          modTankAssociations: [],
          modTankPlanAssociations: [],
        },
        () => this.getVesselCodeByCarrier(this.props.selectedShareholder)
      );
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getTerminalsForCarrier(data);
        // this.terminalSelectionChange([
        //   this.state.modMarineReceipt.TerminalCodes[0],
        // ]);
      }
      validationErrors.CarrierCode = "";
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on onCarrierCompanyChange",
        error
      );
    }
  };

  handleCarrierSearchChange = (carrierCode) => {
    try {
      let carrierSearchOptions = this.state.carrierOptions.filter((item) =>
        item.value.toLowerCase().includes(carrierCode.toLowerCase())
      );
      if (carrierSearchOptions.length > Constants.filteredOptionsCount) {
        carrierSearchOptions = carrierSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        carrierSearchOptions,
      });
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on handleCarrierSearchChange",
        error
      );
    }
  };

  getReceiptCompartmentDetails(selectedRow) {
    try {
      if (selectedRow.Common_Code === undefined) {
        this.setState({
          receiptCompartmentDetails: [],
        });
        return;
      }
      axios(
        RestApis.GetMarineReceiptCompartmentDetails +
        "?ShareholderCode=" +
        this.props.selectedShareholder +
        "&MarineReceiptCode=" +
        selectedRow.Common_Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            for (var i = 0; i < result.EntityResult.length; i++) {
              result.EntityResult[i] = {
                ...result.EntityResult[i],
                ForceComplete: false,
                AdjustPlan: null,
              };
              result.EntityResult[i].AdjustedPlanQuantity =
                result.EntityResult[i].AdjustedPlanQuantity !== "" &&
                  result.EntityResult[i].AdjustedPlanQuantity !== null
                  ? result.EntityResult[i].AdjustedPlanQuantity.toLocaleString()
                  : "";
              result.EntityResult[i].PlannedQuantity =
                result.EntityResult[i].PlannedQuantity !== "" &&
                  result.EntityResult[i].PlannedQuantity !== null
                  ? result.EntityResult[i].PlannedQuantity.toLocaleString()
                  : "";
              result.EntityResult[i].UnloadedQuantity =
                result.EntityResult[i].UnloadedQuantity !== "" &&
                  result.EntityResult[i].UnloadedQuantity !== null
                  ? result.EntityResult[i].UnloadedQuantity.toLocaleString()
                  : "";
            }
            let modReceiptCompartment = lodash.cloneDeep(result.EntityResult);
            this.setState({
              modReceiptCompartment,
              receiptCompartmentDetails: result.EntityResult,
            });
          } else {
            this.setState({
              modReceiptCompartment: [],
              receiptCompartmentDetails: [],
            });
            console.log(
              "Error in getReceiptCompartmentDetails:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting receipt compartment details:",
            error
          );
        });
    } catch (error) {
      console.log(error);
    }
  }

  handleBack = () => {
    try {
      this.setState({
        isReadyToRender: true,
        viewAuditTrail: false,
        isViewUnloading: false,
        isManualEntry: false,
      });
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on handleBack",
        error
      );
    }
  };

  getAdjustPlanPermission(selectedRow) {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: selectedRow.Common_Code,
      },
      {
        key: "OperationName",
        value: "ADJUST_PLAN",
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetMarineReceiptCompartmentDetailsOperations,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        var { operationsVisibilty } = { ...this.state };
        if (result.IsSuccess === true) {
          operationsVisibilty.adjustPlan =
            response.data.IsSuccess &&
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnMarineReceipt
            );
          this.setState({
            operationsVisibilty,
          });
        } else {
          operationsVisibilty.adjustPlan = false;
          this.setState({
            operationsVisibilty,
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting operation permission:", error);
      });
  }

  getForceCompletenPermission(selectedRow) {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: selectedRow.Common_Code,
      },
      {
        key: "OperationName",
        value: "FORCE_COMPLETE",
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetMarineReceiptCompartmentDetailsOperations,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        var { operationsVisibilty } = { ...this.state };
        if (result.IsSuccess === true) {
          operationsVisibilty.forceComplete =
            response.data.IsSuccess &&
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnMarineReceipt
            );
          this.setState({
            operationsVisibilty,
          });
        } else {
          operationsVisibilty.forceComplete = false;
          this.setState({
            operationsVisibilty,
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting operation permission:", error);
      });
  }

  operationPermissionControl = (receiptOperations) => {
    var { operationsVisibilty } = { ...this.state };
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_AuthorizeToUnload
      ) > -1
    ) {
      operationsVisibilty.authorizeToLoad = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_CloseReceipt
      ) > -1
    ) {
      operationsVisibilty.closeReceipt = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_ManualEntry
      ) > -1
    ) {
      operationsVisibilty.manualEntry = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_ViewAuditTrail
      ) > -1
    ) {
      operationsVisibilty.viewAuditTrail = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_ViewTransactions
      ) > -1
    ) {
      operationsVisibilty.viewUnloadingDetails = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_PrintRAN
      ) > -1
    ) {
      operationsVisibilty.printRAN = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_ViewBOD
      ) > -1
    ) {
      operationsVisibilty.viewBOD = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_PrintBOD
      ) > -1
    ) {
      operationsVisibilty.printBOD = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllReceiptOperations.ViewReceipt_BISOutbound
      ) > -1
    ) {
      operationsVisibilty.bSIOutbound = true;
    }
    this.setState({ operationsVisibilty });
  };

  handleCompartmentDetailsSave = () => {
    try {
      let modReceiptCompartment = lodash.cloneDeep(
        this.state.modReceiptCompartment
      );
      var saveMarineReceiptKeys = [];
      for (var i = 0; i < modReceiptCompartment.length; i++) {
        var MarineReceiptCode = modReceiptCompartment[i]["ReceiptCode"];
        var CompartmentSeqNoInVehicle =
          modReceiptCompartment[i]["CompartmentSeqNoInVehicle"];
        var adjustPlan = modReceiptCompartment[i]["AdjustPlan"];
        if (adjustPlan !== null) {
          adjustPlan = Utilities.convertStringtoDecimal(adjustPlan);
        }
        // var adjustPlan = parseFloat(modReceiptCompartment[i]["AdjustPlan"]);
        var ForceComplete = modReceiptCompartment[i]["ForceComplete"];
        var shCode = this.props.selectedShareholder;
        var KeyData = {
          ShareHolderCode: shCode,
          keyDataCode: CompartmentSeqNoInVehicle,
          KeyCodes: [
            { Key: KeyCodes.marineReceiptCode, Value: MarineReceiptCode },
            {
              Key: "CompartmentSeqNoInVehicle",
              Value: CompartmentSeqNoInVehicle,
            },
            { Key: "AdjustedPlanQuantity", Value: adjustPlan },
            { Key: "ForceComplete", Value: ForceComplete },
          ],
        };
        saveMarineReceiptKeys.push(KeyData);
      }
      var notification = {
        messageType: "critical",
        message: "Receipt_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
            keyValues: [this.props.selectedRow.Common_Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestApis.MarineReceiptCompartmentDetailsSave,
        Utilities.getAuthenticationObjectforPost(
          saveMarineReceiptKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.getReceiptCompartmentDetails(this.props.selectedRow);
            // operationsVisibilty.save = true;
            for (var i = 0; i < modReceiptCompartment.length; i++) {
              if (modReceiptCompartment[i]["AdjustPlan"] !== null) {
                modReceiptCompartment[i]["AdjustPlan"] = null;
              }
            }
            this.setState({
              // operationsVisibilty,
              modReceiptCompartment,
            });
            this.props.handlePageAdd(this.state.marineReceipt);
          } else {
            if (result.ErrorList !== null && result.ErrorList !== undefined) {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
            // operationsVisibilty.save = false;
            // this.setState({
            //   operationsVisibilty,
            // });
            console.log("Error in Save Compartment Details:", result.ErrorList);
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
          throw error;
        });
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on handleSave"
      );
    }
  };

  handleSaveCompartmentDetailsEnabled = () => {
    const { modMarineReceipt } = this.state;
    const { operationsVisibilty } = this.state;
    let abledRow = this.state.modReceiptCompartment.findIndex(
      (item) =>
        item.ReceiptCompartmentStatus !== 0 &&
        item.ReceiptCompartmentStatus !== 2 &&
        item.ReceiptCompartmentStatus !== 4 &&
        item.ReceiptCompartmentStatus !== 7
    );

    const saveCompartmentDetailsEnabled =
      (modMarineReceipt.ReceiptStatus ===
        Constants.Receipt_Status.PARTIALLY_UNLOADED ||
        modMarineReceipt.ReceiptStatus ===
        Constants.Receipt_Status.INTERRUPTED ||
        modMarineReceipt.ReceiptStatus ===
        Constants.Receipt_Status.MANUALLY_UNLOADED ||
        modMarineReceipt.ReceiptStatus ===
        Constants.Receipt_Status.AUTO_UNLOADED ||
        modMarineReceipt.ReceiptStatus === Constants.Receipt_Status.QUEUED) &&
      abledRow !== -1 &&
      operationsVisibilty.forceComplete &&
      operationsVisibilty.adjustPlan &&
      !this.props.userDetails.EntityResult.IsEnterpriseNode;
    return saveCompartmentDetailsEnabled;
  };

  handleViewAuditTrail = () => {
    try {
      this.setState({
        viewAuditTrail: true,
        isReadyToRender: false,
      });
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on handleViewAuditTrail",
        error
      );
    }
  };

  handleViewUnloading = () => {
    try {
      this.getMarineUnLoadingDetails(this.props.selectedRow);
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on handleViewUnloading",
        error
      );
    }
  };

  getMarineUnLoadingDetails(item) {
    try {
      axios(
        RestApis.GetMarineReceiptUnLoadingDetails +
        "?ShareholderCode=" +
        this.props.selectedShareholder +
        "&MarineReceiptCode=" +
        item["Common_Code"],
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ ViewUnloadingData: result.EntityResult });
            var { operationsVisibilty } = { ...this.state };
            operationsVisibilty.add = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnMarineReceipt
            );
            operationsVisibilty.delete = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              fnMarineReceipt
            );
            operationsVisibilty.delete = false;
            operationsVisibilty.add = false;
            operationsVisibilty.shareholder = false;
            this.setState({
              isViewUnloading: true,
              isReadyToRender: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      axios(
        RestApis.GetMarineUnLoadingDetailConfigFields +
        "?MarineReceiptCode=" +
        item["Common_Code"],
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ ViewUnloadingHideFields: result.EntityResult });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getBaseProductList() {
    axios(
      RestApis.GetBaseProducts,
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

  getTankCode() {
    var Shareholder = this.props.userDetails.EntityResult.PrimaryShareholder;
    axios(
      RestApis.GetTanks + "?ShareholderCode=" + Shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const tankCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({
              tankCodeOptions,
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

  toggleExpand = (data, open, isTerminalAdded = false) => {
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
      (item) =>
        item.CompartmentSeqNoInVehicle === data.CompartmentSeqNoInVehicle
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
          (x) =>
            x.Code !== data.Code &&
            x.CompartmentSeqNoInVehicle !== data.CompartmentSeqNoInVehicle
        );
      } else expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };

  getTankListForRole(code) {
    var Shareholder = this.props.userDetails.EntityResult.PrimaryShareholder;
    axios(
      RestApis.GetTankListForRole + "?ShareholderCode=" + Shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var tankCodeOptions = [];
          var tanks = result.EntityResult.Table;
          // if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
          //   for (let i = 0; i < tanks.length; i++) {
          //     if (
          //       tanks[i].TerminalCode ===
          //       this.state.modMarineReceipt.TerminalCodes[0]
          //     ) {
          //       if (
          //         tankCodeOptions.hasOwnProperty(tanks[i].TankList_BaseProduct)
          //       ) {
          //         tankCodeOptions[tanks[i].TankList_BaseProduct].push(
          //           tanks[i].Common_Code
          //         );
          //       } else {
          //         var tankCodeOption = [];
          //         tankCodeOption.push(tanks[i].Common_Code);
          //         tankCodeOptions[
          //           tanks[i].TankList_BaseProduct
          //         ] = tankCodeOption;
          //       }
          //     }
          //   }
          // } else {
          //   for (let i = 0; i < tanks.length; i++) {
          //     if (
          //       tankCodeOptions.hasOwnProperty(tanks[i].TankList_BaseProduct)
          //     ) {
          //       tankCodeOptions[tanks[i].TankList_BaseProduct].push(
          //         tanks[i].Common_Code
          //       );
          //     } else {
          //       var tankCodeOption1 = [];
          //       tankCodeOption1.push(tanks[i].Common_Code);
          //       tankCodeOptions[
          //         tanks[i].TankList_BaseProduct
          //       ] = tankCodeOption1;
          //     }
          //   }
          // }
          // this.setState({ tankCodeOptions });
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            if (code === "") {
              for (let i = 0; i < tanks.length; i++) {
                tankCodeOptions.push(tanks[i].Common_Code);
              }
            } else {
              tanks = tanks.filter((tank) => {
                return tank.TerminalCode === code;
              });
              for (let i = 0; i < tanks.length; i++) {
                tankCodeOptions.push(tanks[i].Common_Code);
              }
            }
          } else {
            for (let i = 0; i < tanks.length; i++) {
              tankCodeOptions.push(tanks[i].Common_Code);
            }
          }
          tankCodeOptions = Utilities.transferListtoOptions(tankCodeOptions);
          this.setState({ tankCodeOptions });
        } else {
          this.setState({ tankCodeOptions: [] });
          console.log("Error in getTankListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ tankCodeOptions: [] });
        console.log("Error while getting TankListForRole:", error);
      });
  }

  getAdditivesList() {
    axios(
      RestApis.GetAdditives,
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

  getSaveEnabled() {
    var saveCompartmentDetailsEnabled =
      this.handleSaveCompartmentDetailsEnabled();
    var saveAbled = lodash.cloneDeep(this.state.saveEnabled);
    var viewTab = lodash.cloneDeep(this.props.viewTab);
    if (viewTab === 2) {
      return saveCompartmentDetailsEnabled;
    } else {
      return saveAbled;
    }
  }
  getKPIList(marineReceiptCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    )
    if (KPIView === true) {

      let objKPIRequestData = {
        PageName: kpiMarineReceiptDetails,
        TransportationType: Constants.TransportationType.MARINE,
        InputParameters: [{ key: "ReceiptCode", value: marineReceiptCode }],
      };
      axios(
        RestApis.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ marineReceiptKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ marineReceiptKPIList: [] });
            console.log("Error in pipeline KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting PipelineDispatch KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    var modMarineReceipt = lodash.cloneDeep(this.state.modMarineReceipt);
    const saveEnabled =
      this.getSaveEnabled();
    const popUpContents = [
      {
        fieldName: "Marine_ReceiptCompDetail_LastUpdated",
        fieldValue:
          new Date(modMarineReceipt.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(modMarineReceipt.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "Marine_ReceiptCompDetail_CreatedTime",
        fieldValue:
          new Date(modMarineReceipt.CreatedTime).toLocaleDateString() +
          " " +
          new Date(modMarineReceipt.CreatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "Terminal_ActiveTime",
        fieldValue:
          modMarineReceipt.LastActiveTime !== undefined &&
            modMarineReceipt.LastActiveTime !== null
            ? new Date(modMarineReceipt.LastActiveTime).toLocaleDateString() +
            " " +
            new Date(modMarineReceipt.LastActiveTime).toLocaleTimeString()
            : "",
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.marineReceipt.ReceiptCode}
            newEntityName="Marine_ReceiptCompDetail_NewShipmentByCompartment"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.marineReceiptKPIList}> </TMDetailsKPILayout>

        <ErrorBoundary>
          <MarineReceiptDetails
            marineReceipt={this.state.marineReceipt}
            modMarineReceipt={this.state.modMarineReceipt}
            modAssociations={this.state.modAssociations}
            modTankAssociations={this.state.modTankAssociations}
            validationErrors={this.state.validationErrors}
            attributeValidationErrors={this.state.attributeValidationErrors}
            selectedAssociations={this.state.selectedAssociations}
            listOptions={{
              shareholders: this.state.shareholders,
              terminalCodes: this.state.terminalCodes,
              shipmentUOM: this.state.shipmentUOM,
              compSeqOptions: this.state.compSeqOptions,
              vessels: this.getVesselSearchOptions(),
              FinishedProducts: this.state.FinishedProducts,
              supplierDestinationOptions: this.state.supplierDestinationOptions,
              shareholderSuppliers: this.state.shareholderSuppliers,
              baseProductDetails: this.state.baseProductDetails,
              tankCodeOptions: this.state.tankCodeOptions,
              additiveDetails: this.state.additiveDetails,
              carriers: this.getCarrierSearchOptions(),
            }}
            onCarrierCompanyChange={this.onCarrierCompanyChange}
            onFieldChange={this.handleChange}
            onDateTextChange={this.handleDateTextChange}
            handleRowSelectionChange={this.handleAssociationSelectionChange}
            handleCellDataEdit={this.handleCellDataEdit}
            handleAttributeCellDataEdit={this.handleAttributeCellDataEdit}
            handleAddAssociation={this.handleAddAssociation}
            handleAddTankAssociation={this.handleAddTankAssociation}
            handleDeleteAssociation={this.handleDeleteAssociation}
            handleDeleteTankAssociation={this.handleDeleteTankAssociation}
            onVesselSearchChange={this.handleVesselSearchChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            isSlotbookinginUI={
              this.props.userDetails.EntityResult.ShowSlotBookedInUI
            }
            operationsVisibilty={this.state.operationsVisibilty}
            modReceiptCompartment={this.state.modReceiptCompartment}
            receiptCompartmentDetails={this.state.receiptCompartmentDetails}
            handleOperationButtonClick={this.props.handleOperationClick}
            viewTab={this.props.viewTab}
            onViewAuditTrailClick={this.handleViewAuditTrail}
            onViewUnloading={this.handleViewUnloading}
            onManualEntry={this.handleManualEntry}
            onTabChange={this.onTabChange}
            handleTankAssociationSelectionChange={
              this.handleTankAssociationSelectionChange
            }
            selectedTankAssociations={this.state.selectedTankAssociations}
            handleTankCellDataEdit={this.handleTankCellDataEdit}
            selectedAttributeList={this.state.selectedAttributeList}
            toggleExpand={this.toggleExpand}
            expandedRows={this.state.expandedRows}
            expandedCompDetailRows={this.state.expandedCompDetailRows}
            handleCompAttributeCellDataEdit={
              this.handleCompAttributeCellDataEdit
            }
            compartmentDetailsPageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            isHSEInspectionEnable={this.state.isHSEInspectionEnable}
            isBondShow={this.state.isBondShow}
            onCarrierSearchChange={this.handleCarrierSearchChange}
            isTransloading={this.state.isTransloading}
            compDetailsTab={this.state.isNewReceipt ? [] : [""]}
            updateEnableForConfigure={this.props.updateEnableForConfigure}
          ></MarineReceiptDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.marineReceipt.ReceiptCode === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnMarineReceiptByCompartment}
            handleOperation={this.addUpdateMarineDispatch}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
      </div>
    ) : this.state.isManualEntry === true ? (
      <ErrorBoundary>
        <MarineReceiptManualEntryDetailsComposite
          handleBack={this.handleBack}
          ReceiptCode={this.state.modMarineReceipt.ReceiptCode}
          ReceiptStatus={this.state.modMarineReceipt.ReceiptStatus}
          QuantityUOM={this.state.modMarineReceipt.QuantityUOM}
          ActualTerminalCode={this.state.modMarineReceipt.ActualTerminalCode}
        ></MarineReceiptManualEntryDetailsComposite>
      </ErrorBoundary>
    ) : this.state.viewAuditTrail === true ? (
      <ErrorBoundary>
        <MarineReceiptViewAuditTrailComposite
          receiptCode={this.props.selectedRow.Common_Code}
          selectedShareholder={this.state.selectedShareholder}
          handleBack={this.handleBack}
        ></MarineReceiptViewAuditTrailComposite>
      </ErrorBoundary>
    ) : this.state.isViewUnloading === true ? (
      <ErrorBoundary>
        <MarineReceiptLoadingDetails
          tableData={this.state.ViewUnloadingData.Table}
          loadingDetailsHideFields={this.state.ViewUnloadingHideFields}
          setValid={this.props.setValid}
          handleBack={this.handleBack}
          isWebPortalUser={this.props.userDetails.EntityResult.IsWebPortalUser}
        ></MarineReceiptLoadingDetails>
      </ErrorBoundary>
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

const mapReceiptToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapReceiptToProps
)(MarineReceiptDetailsComposite);

MarineReceiptDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  handleOperationClick: PropTypes.func.isRequired,
  viewTab: PropTypes.number.isRequired,
  handlePageAdd: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  updateEnableForConfigure: PropTypes.bool.isRequired,
};
