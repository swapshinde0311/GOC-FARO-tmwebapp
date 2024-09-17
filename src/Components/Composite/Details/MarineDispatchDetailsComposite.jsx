import React, { Component } from "react";
import { MarineDispatchDetails } from "../../UIBase/Details/MarineDispatchDetails";
import { marineDispatchValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import {
  emptyMarineDispatch,
  emptyDispatchCompartmentPlan,
  emptyDispatchCompartmentTanks,
} from "../../../JS/DefaultEntities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnMarineShipmentByCompartment,
  fnMarineDispatch,
  fnKPIInformation
} from "../../../JS/FunctionGroups";
import { marineDispatchCompartDef } from "../../../JS/DetailsTableValidationDef";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import MarineDispatchManualEntryDetailsComposite from "./MarineDispatchManualEntryDetailsComposite";
import {
  marineDispatchAttributeEntity,
  marineDispatchCompAttributeEntity,
} from "../../../JS/AttributeEntity";
import * as RestApis from "../../../JS/RestApis";
import { Shipment_Status } from "../../../JS/Constants";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiMarineShipmentDetails } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class MarineDispatchDetailsComposite extends Component {
  state = {
    marineDispatch: lodash.cloneDeep(emptyMarineDispatch),
    modMarineDispatch: {},
    baseProductDetails: {},
    additiveDetails: {},
    modAssociations: [],
    modTankAssociations: [],
    tempModTankAssociations: [],
    modTankPlanAssociations: [],
    vehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    modVehicleDetails: { carrierCode: "", vehicleCompartments: [] },
    validationErrors: Utilities.getInitialValidationErrors(
      marineDispatchValidationDef
    ),
    isReadyToRender: false,
    isCompartmentDetails: false,
    shareholders: this.getShareholders(),
    terminalCodes: this.props.terminalCodes,
    shipmentUOM: [],
    Captains: [],
    vessels: [],
    vesselSearchOptions: [],
    FinishedProducts: {},
    customerDestinationOptions: {},
    compSeqOptions: [],
    shareholderCustomers: [],
    tankCodeOptions: [],
    associatedCompartments: [],
    saveEnabled: false,
    selectedAssociations: [],
    selectedTankAssociations: [],
    marineShipmentPlan: [],
    marineCompartmentDetails: [],
    modMarineCompartmentDetails: [],
    attributeMetaDataList: [],
    attributeValidationErrors: [],
    compartmentAttributeMetaDataList: [],
    selectedAttributeList: [],
    attribute: [],
    terminalOptions: [],
    expandedRows: [],
    operationsVisibilty: {
      forceCompleteIsDisable: false,
      adjustPlanIsDisable: false,
    },
    finishedProductItems: [],
    length: 0,
    isManualEntry: false,
    expandedCellRows: [],
    carrierOptions: [],
    carrierShareholderMap: {},
    carrierSearchOptions: [],
    isHSEInspectionEnable: false,
    isBondShow: false,
    isNewDispatch: false,
    productAllocationDetails: [],
    marineDispatchKPIList: [],
    showAuthenticationLayout: false,
    tempMarineDispatch: {},
  };

  handleChange = (propertyName, data) => {
    try {
      const modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (propertyName === "TerminalCodes") {
        if (data === null) {
          modMarineDispatch[propertyName] = [];
        } else {
          modMarineDispatch[propertyName][0] = data;
        }
        this.terminalSelectionChange([data]);
        this.getTankListForRole(data);
      } else {
        modMarineDispatch[propertyName] = data;
      }
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
      if (propertyName === "Active") {
        if (modMarineDispatch.Active !== this.state.marineDispatch.Active)
          modMarineDispatch.Remarks = "";
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "DispatchCode") {
        modMarineDispatch.DispatchCode = data;
        if (this.state.modTankAssociations.length !== 0) {
          this.state.modTankAssociations.forEach((modMarineDispatch) => {
            modMarineDispatch.DispatchCode = data;
          });
        }
      }
      if (propertyName === "BondNumber") {
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "ScheduledDate") {
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "DispatchStatus") {
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "QuantityUOM") {
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "Description") {
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "Active") {
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "Remarks") {
        modMarineDispatch[propertyName] = data;
      }
      if (propertyName === "Bonded") {
        validationErrors["BondNumber"] =
          "BONDED_NO_CANT_BE_EMPTY_FOR_BONDED_MARINE_DISPATCH_X";
      }
      this.setState({ modMarineDispatch });
      if (marineDispatchValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          marineDispatchValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.modAssociations.length <
          this.state.modVehicleDetails.vehicleCompartments.length
        ) {
          let modAssociations = lodash.cloneDeep(this.state.modAssociations);
          let newAssociation = {
            DispatchCode: null,
            ShareholderCode: this.props.selectedShareholder,
            CustomerCode: null,
            DestinationCode: null,
            FinishedProductCode: null,
            CompartmentCode: null,
            CarrierCompanyCode: null,
            TrailerCode: null,
            Quantity: null,
            QuantityUOM: null,
            SequenceNo: 0,
            CompartmentSeqNoInVehicle: "",
            AssociatedOrderItems: null,
            AssociatedContractItems: null,
            Attributes: [],
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
          newAssociation.QuantityUOM = this.state.modMarineDispatch.QuantityUOM;
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
                if (attributeMetaDataList.length > 0) {
                  this.formCompartmentAttributes([
                    attributeMetaDataList[0].TerminalCode,
                  ]);
                }
              } else {
                this.formCompartmentAttributes(
                  this.state.modMarineDispatch.TerminalCodes
                );
              }
            }
          );
        }
      } catch (error) {
        console.log(
          "MarineDispatchDetailsComposite:Error occured on handleAddAssociation",
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
        let newTankAssociation = lodash.cloneDeep(emptyDispatchCompartmentPlan);
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
          this.state.modMarineDispatch.QuantityUOM;
        modTankAssociations.push(newTankAssociation);
        this.setState({
          modTankPlanAssociations: modTankAssociations,
          modTankAssociations,
          selectedTankAssociations: [],
        });
      } catch (error) {
        console.log(
          "MarineDispatchDetailsComposite:Error occured on handleAddAssociation",
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

            this.state.selectedAssociations.forEach((obj) => {
              modAssociations = modAssociations.filter((association) => {
                return association.SequenceNo !== obj.SequenceNo;
              });
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
          "MarineDispatchDetailsComposite:Error occured on handleDeleteAssociation",
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
      } catch (error) {
        console.log(
          "MarineDispatchDetailsComposite:Error occured on handleDeleteTankAssociation",
          error
        );
      }
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modAssociations = lodash.cloneDeep(this.state.modAssociations);
      modAssociations[cellData.rowIndex][cellData.field] = newVal;
      if (cellData.field === "Quantity") {
        modAssociations[cellData.rowIndex]["Quantity"] =
          newVal.toLocaleString();
      }
      if (
        cellData.field === "CustomerCode" ||
        cellData.field === "FinishedProductCode" ||
        cellData.field === "DestinationCode"
      ) {
        this.getFinishedProduct(modAssociations, cellData);
      }
      if (cellData.field === "ShareholderCode") {
        modAssociations[cellData.rowIndex]["CustomerCode"] = "";
        modAssociations[cellData.rowIndex]["FinishedProductCode"] = "";
        modAssociations[cellData.rowIndex]["DestinationCode"] = "";
        let customers = this.state.shareholderCustomers.filter(
          (shareholderCust) => shareholderCust.ShareholderCode === newVal
        );
        if (customers.length > 0) {
          var customerDestinationOptions;
          customerDestinationOptions = customers[0].CustomerDestinationsList;
          this.setState({ customerDestinationOptions });
        } else {
          console.log("no customers identified for shareholder");
        }
      } else if (cellData.field === "CustomerCode") {
        let shareholderCustomer = this.state.shareholderCustomers.filter(
          (shareholderCust) =>
            shareholderCust.ShareholderCode === cellData.rowData.ShareholderCode
        );
        let customerDestinationOptions =
          shareholderCustomer[0].CustomerDestinationsList;
        if (
          customerDestinationOptions !== undefined &&
          customerDestinationOptions !== null
        ) {
          if (
            customerDestinationOptions[newVal] !== undefined &&
            Array.isArray(customerDestinationOptions[newVal]) &&
            customerDestinationOptions[newVal].length === 1
          ) {
            modAssociations[cellData.rowIndex]["DestinationCode"] =
              customerDestinationOptions[newVal][0];
            this.getFinishedProduct(modAssociations, cellData);
          } else {
            modAssociations[cellData.rowIndex]["DestinationCode"] = "";
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
      }
      this.setState({
        modAssociations,
      });
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };

  getFinishedProduct(modAssociations, cellData) {
    var modTankPlanAssociations = lodash.cloneDeep(
      this.state.modTankPlanAssociations
    );
    if (
      modAssociations[cellData.rowIndex]["CustomerCode"] !== null &&
      modAssociations[cellData.rowIndex]["FinishedProductCode"] !== null &&
      modAssociations[cellData.rowIndex]["DestinationCode"] !== null &&
      modAssociations[cellData.rowIndex]["Quantity"] !== null
    ) {
      modTankPlanAssociations = modTankPlanAssociations.filter(
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
      )
        .then((response) => {
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
                  emptyDispatchCompartmentPlan
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
                tankAssociation.DispatchCode =
                  this.state.modMarineDispatch.DispatchCode;
                modTankPlanAssociations.push(tankAssociation);
              }
              this.setState({
                length: this.state.length + finishedProductItems.length,
              });
            }
          }
        })
        .catch((error) => {
          console.log("error in getting finishedProduct", error);
        });
    }
    this.setState({
      modTankPlanAssociations,
    });
  }

  handleTankCellDataEdit = (newVal, cellData) => {
    try {
      let modTankAssociations = lodash.cloneDeep(
        this.state.modTankAssociations
      );
      modTankAssociations[cellData.rowIndex][cellData.field] = newVal;
      if (cellData.field === "ShareholderCode") {
        modTankAssociations[cellData.rowIndex]["FinishedProductCode"] = "";
        modTankAssociations[cellData.rowIndex]["BaseProductCode"] = "";
        modTankAssociations[cellData.rowIndex]["DestinationCode"] = "";
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
        var dispatchCompartmentTanks = [];
        var dispatchCompartmentTank = lodash.cloneDeep(
          emptyDispatchCompartmentTanks
        );
        dispatchCompartmentTank.CompartmentCode =
          modTankAssociations[cellData.rowIndex].CompartmentCode;
        dispatchCompartmentTank.CompartmentSeqNoInVehicle =
          modTankAssociations[cellData.rowIndex].CompartmentSeqNoInVehicle;
        dispatchCompartmentTank.PlannedQuantity =
          Utilities.convertStringtoDecimal(
            modTankAssociations[cellData.rowIndex].PlannedQuantity
          );
        dispatchCompartmentTank.PlanQuantityUOM =
          modTankAssociations[cellData.rowIndex].PlanQuantityUOM;
        dispatchCompartmentTank.DispatchCode =
          modTankAssociations[cellData.rowIndex].DispatchCode;
        dispatchCompartmentTank.TankCode =
          modTankAssociations[cellData.rowIndex].TankCode;
        dispatchCompartmentTanks.push(dispatchCompartmentTank);
        modTankAssociations[cellData.rowIndex]["DispatchCompartmentTanks"] =
          dispatchCompartmentTanks;
      } else if (cellData.field === "PlannedQuantity") {
        if (
          modTankAssociations[cellData.rowIndex]["DispatchCompartmentTanks"] !==
          null &&
          modTankAssociations[cellData.rowIndex]["DispatchCompartmentTanks"] !==
          "" &&
          modTankAssociations[cellData.rowIndex]["DispatchCompartmentTanks"]
            .length !== 0
        ) {
          modTankAssociations[cellData.rowIndex][
            "DispatchCompartmentTanks"
          ][0].PlannedQuantity = Utilities.convertStringtoDecimal(
            modTankAssociations[cellData.rowIndex].PlannedQuantity
          );
        }
      }
      this.setState({
        modTankAssociations,
        modTankPlanAssociations: modTankAssociations,
      });
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on handleTankCellDataEdit",
        error
      );
    }
  };

  handleAssociationSelectionChange = (e) => {
    this.setState({ selectedAssociations: e });
  };

  handleTankAssociationSelectionChange = (e) => {
    this.setState({ selectedTankAssociations: e });
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.marineDispatch.DispatchCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getMarineDispatch(nextProps.selectedRow.Common_Code, true);
      }
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on componentWillReceiveProps",
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
            var shipmentUOM = lodash.cloneDeep(this.state.shipmentUOM);
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
    let modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
    let modVehicleDetails = lodash.cloneDeep(this.state.modVehicleDetails);
    modMarineDispatch.VesselCode = vehicleCode;
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: vehicleCode,
      },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.MARINE,
      },
      {
        key: KeyCodes.carrierCode,
        value: modMarineDispatch.CarrierCode,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
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
        let result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            // modMarineDispatch.CarrierCode =
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
                this.state.modMarineDispatch.QuantityUOM != null &&
                this.state.modMarineDispatch.QuantityUOM !== ""
              ) {
                modAssociations.forEach((modAssociation) => {
                  modAssociation.QuantityUOM =
                    this.state.modMarineDispatch.QuantityUOM;
                });
              }
              if (
                this.state.modMarineDispatch.DispatchCode !== null &&
                this.state.modMarineDispatch.DispatchCode !== ""
              ) {
                modAssociations.forEach((modAssociation) => {
                  modAssociation.DispatchCode =
                    this.state.modMarineDispatch.DispatchCode;
                });
              }
              this.setState({ modAssociations }, () => {
                var terminalCodes = lodash.cloneDeep(
                  this.state.modMarineDispatch.TerminalCodes
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
              modMarineDispatch,
              modVehicleDetails,
              compSeqOptions,
            });

            if (
              this.state.marineDispatch.VehicleCode ===
              modMarineDispatch.VehicleCode
            ) {
              let vehicleDetails = lodash.cloneDeep(modVehicleDetails);
              this.setState({ vehicleDetails });
            }
          }
        } else {
          this.setState({ modMarineDispatch });
          console.log("Error in GetVehicle:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getVessel:", error);
      });
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
            DestinationCode: null,
            DispatchCode: null,
            FinishedProductCode: null,
            Quantity:
              vehicleCompartment.SFL !== null && vehicleCompartment.SFL !== ""
                ? vehicleCompartment.SFL.toLocaleString()
                : null,
            QuantityUOM: vehicleCompartment.UOM,
            SequenceNo: vehicleCompartment.trailerCompSeq,
            ShareholderCode: this.props.selectedShareholder,
            TrailerCode: vehicleCompartment.trailerCode,
            attributesForUI: this.state.modAssociations.attributesForUI,
            TerminalCodes: this.state.modMarineDispatch.TerminalCodes,
          };
          shipmentCompartments.push(shipmentCompartment);
        }
      }
    } catch (error) {
      console.log(
        "error in getShipmentCompartmentFromVehicleCompartment",
        error
      );
    }

    return shipmentCompartments;
  }

  getVehicleCodes() {
    axios(
      RestApis.GetVehicleCodes +
      "?Transportationtype=" +
      Constants.TransportationType.MARINE,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var vessels = lodash.cloneDeep(this.state.vessels);
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
          console.log("Error in getVehicleCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Vessel List:", error);
      });
  }

  // GetCarrierCodes(shareholder) {
  //   axios(
  //     RestApis.GetCarrierCodes +
  //       "?ShareholderCode=" +
  //       shareholder +
  //       "&Transportationtype=" +
  //       Constants.TransportationType.MARINE,
  //     Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
  //   )
  //     .then((response) => {
  //       var result = response.data;
  //       if (result.IsSuccess === true) {
  //         if (
  //           result.EntityResult !== null &&
  //           Array.isArray(result.EntityResult)
  //         ) {
  //           var carrierCompany = lodash.cloneDeep(this.state.carrierCompany);
  //           result.EntityResult.forEach((carrier) => {
  //             carrierCompany.push({
  //               text: carrier,
  //               value: carrier,
  //             });
  //           });
  //           this.setState({ carrierCompany });
  //         }
  //       } else {
  //         console.log("Error in GetCarrierListForRole:", result.ErrorList);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error while getting Carrier List:", error);
  //     });
  // }

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
              var FinishedProducts = lodash.cloneDeep(
                this.state.FinishedProducts
              );
              FinishedProducts = result.EntityResult;

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
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            if (code === "") {
              // for (let i = 0; i < tanks.length; i++) {
              //   if (tankCodeOptions.hasOwnProperty(tanks[i].TankList_BaseProduct)) {
              //     tankCodeOptions[tanks[i].TankList_BaseProduct].push(
              //       tanks[i].Common_Code
              //     );
              //   } else {
              //     var tankCodeOption = [];
              //     tankCodeOption.push(tanks[i].Common_Code);
              //     tankCodeOptions[tanks[i].TankList_BaseProduct] = tankCodeOption;
              //   }
              // }
              for (let i = 0; i < tanks.length; i++) {
                tankCodeOptions.push(tanks[i].Common_Code);
              }
            } else {
              tanks = tanks.filter((tank) => {
                return tank.TerminalCode === code;
              });
              // for (let i = 0; i < tanks.length; i++) {
              //   if (tanks[i].TerminalCode === code) {
              //     if (tankCodeOptions.hasOwnProperty(tanks[i].TankList_BaseProduct)) {
              //       tankCodeOptions[tanks[i].TankList_BaseProduct].push(
              //         tanks[i].Common_Code
              //       );
              //     } else {
              //       var tankCodeOption = [];
              //       tankCodeOption.push(tanks[i].Common_Code);
              //       tankCodeOptions[tanks[i].TankList_BaseProduct] = tankCodeOption;
              //     }
              //   }
              // }
              for (let i = 0; i < tanks.length; i++) {
                tankCodeOptions.push(tanks[i].Common_Code);
              }
            }
          } else {
            for (let i = 0; i < tanks.length; i++) {
              tankCodeOptions.push(tanks[i].Common_Code);
            }
            // for (let i = 0; i < tanks.length; i++) {
            //   if (tankCodeOptions.hasOwnProperty(tanks[i].TankList_BaseProduct)) {
            //     tankCodeOptions[tanks[i].TankList_BaseProduct].push(
            //       tanks[i].Common_Code
            //     );
            //   } else {
            //     var tankCodeOption1 = [];
            //     tankCodeOption1.push(tanks[i].Common_Code);
            //     tankCodeOptions[tanks[i].TankList_BaseProduct] = tankCodeOption1;
            //   }
            // }
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

  getCustomerDestinations(shareholder) {
    axios(
      RestApis.GetCustomerDestinations +
      "?ShareholderCode=" +
      shareholder +
      "&TransportationType=" +
      Constants.TransportationType.MARINE,

      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let shareholderCustomers = result.EntityResult;
            if (shareholderCustomers.length > 0) {
              this.setState({ shareholderCustomers: result.EntityResult });
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

  getMarineDispatchProductAllocationDetails(selectedItems) {
    var item = lodash.cloneDeep(selectedItems);
    axios(
      RestApis.GetMarineProductAllocationDetails +
      "?ShipmentCode=" +
      item.Common_Code +
      "&TransportationType=MARINE",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult === null) {
            this.setState({
              productAllocationDetails: [],
              // isViewProductAllocation: true,
            });
          } else {
            this.setState({
              productAllocationDetails: result.EntityResult.Table,
              // isViewProductAllocation: true,
            });
          }
        } else {
          this.setState({ productAllocationDetails: [] });
          // this.setState({ data: [], isReadyToRender: true });
        }
      })
      .catch((error) => {
        this.setState({ productAllocationDetails: [] });
        // this.setState({ data: [], isReadyToRender: true });
        console.log(
          "Error while getting MarineDispatchProductAllocationDetails:",
          error
        );
      });
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getUoms();
      //this.getVehicleCodes("");
      this.getFinishedProductCodes("");
      this.getCustomerDestinations("");
      this.getBaseProductList();
      this.getAdditivesList();
      // this.getTankCode();
      // this.getMarineDispatch(this.props.selectedRow);
      this.getLookUpData();
      this.getMarineShipmentPlan(this.props.selectedRow);
      this.getMarineCompartmentDetails(this.props.selectedRow);
      this.ButtonIsAvailable(this.props.selectedRow, "FORCE_COMPLETE");
      this.ButtonIsAvailable(this.props.selectedRow, "ADJUST_PLAN");
      this.getCarrierList();
      this.getCarrierShareholder();
      this.getBond();
      this.getMarineDispatchProductAllocationDetails(this.props.selectedRow);
      let isNewShipment = false;
      if (this.props.selectedRow.Common_Code === undefined)
        isNewShipment = true;
      this.getAttributes(isNewShipment);
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getBond() {
    axios(
      RestApis.GetBondLookUpSetting +
      "?ShareHolderCode=" +
      this.props.selectedShareholder,
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
          "MarineDispatchDetailsComposite: Error occurred on getLookUpData",
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
          "MarineDispatchDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getAttributes(isNewShipment) {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [marineDispatchAttributeEntity, marineDispatchCompAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult.marineDispatch === undefined) {
            result.EntityResult.marineDispatch = [];
          }
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.MARINEDISPATCH
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.MARINEDISPATCH
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.MARINEDISPATCHCOMPARTMENTDETAIL
              ),
            },
            () => {
              this.getMarineDispatch(
                this.props.selectedRow.Common_Code,
                isNewShipment
              );
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

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  getMarineDispatch(CommonCode, isNewTrailer) {
    emptyMarineDispatch.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.MARINE;
    emptyMarineDispatch.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];

    var transportationType = this.getTransportationType();
    emptyMarineDispatch.TransportationType = transportationType;

    if (isNewTrailer) {
      if (
        emptyMarineDispatch.TerminalCodes !== undefined &&
        emptyMarineDispatch.TerminalCodes !== null &&
        emptyMarineDispatch.TerminalCodes.length !== 0
      ) {
        this.getTankListForRole(emptyMarineDispatch.TerminalCodes[0]);
      } else {
        this.getTankListForRole("");
      }
      let terminalOptions = [];
      this.handleResetAttributeValidationError();
      this.setState(
        {
          marineDispatch: lodash.cloneDeep(emptyMarineDispatch),
          modMarineDispatch: lodash.cloneDeep(emptyMarineDispatch),
          modAssociations: [],
          modTankAssociations: [],
          isReadyToRender: true,
          terminalOptions,
          isNewDispatch: true,
          selectedAttributeList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnMarineShipmentByCompartment
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
        key: KeyCodes.marineDispatchCode,
        value: CommonCode,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetMarineDispatch,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var modTankPlanAssociations = [];
          for (
            let i = 0;
            i < result.EntityResult.DispatchCompartmentPlanList.length;
            i++
          ) {
            var keyCode = [
              {
                key: KeyCodes.finishedProductCode,
                value:
                  result.EntityResult.DispatchCompartmentPlanList[i]
                    .FinishedProductCode,
              },
            ];
            var obj = {
              ShareHolderCode:
                result.EntityResult.DispatchCompartmentPlanList[i]
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
                for (
                  let j = 0;
                  j < result1.EntityResult.FinishedProductItems.length;
                  j++
                ) {
                  var tankAssociation = lodash.cloneDeep(
                    emptyDispatchCompartmentPlan
                  );
                  tankAssociation.DispatchCode =
                    result.EntityResult.DispatchCode;
                  tankAssociation.ShareholderCode =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].ShareholderCode;
                  tankAssociation.CompartmentSeqNoInVehicle =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].CompartmentSeqNoInVehicle;
                  tankAssociation.FinishedProductCode =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].FinishedProductCode;
                  tankAssociation.BaseProductCode =
                    finishedProductItems[j].AdditiveCode === null
                      ? finishedProductItems[j].BaseProductCode
                      : finishedProductItems[j].AdditiveCode;
                  tankAssociation.PlanQuantityUOM =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].PlanQuantityUOM;
                  tankAssociation.CompartmentCode =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].CompartmentCode;
                  tankAssociation.TankCode =
                    result.EntityResult.DispatchCompartmentPlanList[i]
                      .DispatchCompartmentTanks !== null &&
                      result.EntityResult.DispatchCompartmentPlanList[i]
                        .DispatchCompartmentTanks.length !== 0
                      ? result.EntityResult.DispatchCompartmentPlanList[i]
                        .DispatchCompartmentTanks[j].TankCode
                      : "";
                  tankAssociation.PlannedQuantity =
                    result.EntityResult.DispatchCompartmentPlanList[i]
                      .DispatchCompartmentTanks !== null &&
                      result.EntityResult.DispatchCompartmentPlanList[i]
                        .DispatchCompartmentTanks !== "" &&
                      result.EntityResult.DispatchCompartmentPlanList[i]
                        .DispatchCompartmentTanks.length !== 0
                      ? result.EntityResult.DispatchCompartmentPlanList[
                        i
                      ].DispatchCompartmentTanks[
                        j
                      ].PlannedQuantity.toLocaleString()
                      : (
                        result.EntityResult.DispatchCompartmentPlanList[i]
                          .PlannedQuantity *
                        (finishedProductItems[j].Quantity / totalQuantity)
                      ).toLocaleString();
                  // result.EntityResult.DispatchCompartmentDetailPlanList[i]
                  //   .Quantity !== "" &&
                  // result.EntityResult.DispatchCompartmentDetailPlanList[i]
                  //   .Quantity !== null
                  //   ? (
                  //       result.EntityResult.DispatchCompartmentDetailPlanList[
                  //         i
                  //       ].Quantity *
                  //       (finishedProductItems[j].Quantity / totalQuantity)
                  //     ).toLocaleString()
                  //   : "";
                  tankAssociation.SequenceNo = this.state.length + j + 1;
                  var dispatchCompartmentTanks = [];
                  var dispatchCompartmentTank = lodash.cloneDeep(
                    emptyDispatchCompartmentTanks
                  );
                  dispatchCompartmentTank.CompartmentCode =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].CompartmentCode;
                  dispatchCompartmentTank.CompartmentSeqNoInVehicle =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].CompartmentSeqNoInVehicle;
                  dispatchCompartmentTank.PlannedQuantity =
                    result.EntityResult.DispatchCompartmentPlanList[i]
                      .DispatchCompartmentTanks !== null &&
                      result.EntityResult.DispatchCompartmentPlanList[i]
                        .DispatchCompartmentTanks !== "" &&
                      result.EntityResult.DispatchCompartmentPlanList[i]
                        .DispatchCompartmentTanks.length !== 0
                      ? result.EntityResult.DispatchCompartmentPlanList[
                        i
                      ].DispatchCompartmentTanks[
                        j
                      ].PlannedQuantity.toLocaleString()
                      : result.EntityResult.DispatchCompartmentDetailPlanList[i]
                        .Quantity *
                      (finishedProductItems[j].Quantity / totalQuantity);
                  // dispatchCompartmentTank.PlannedQuantity =
                  //   result.EntityResult.DispatchCompartmentDetailPlanList[i]
                  //     .Quantity !== "" &&
                  //   result.EntityResult.DispatchCompartmentDetailPlanList[i]
                  //     .Quantity !== null
                  //     ? result.EntityResult.DispatchCompartmentDetailPlanList[i]
                  //         .Quantity *
                  //       (finishedProductItems[j].Quantity / totalQuantity)
                  //     : "";
                  dispatchCompartmentTank.PlanQuantityUOM =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].PlanQuantityUOM;
                  dispatchCompartmentTank.DispatchCode =
                    result.EntityResult.DispatchCompartmentPlanList[
                      i
                    ].DispatchCode;
                  dispatchCompartmentTank.TankCode =
                    result.EntityResult.DispatchCompartmentPlanList[i]
                      .DispatchCompartmentTanks.length === 0
                      ? ""
                      : result.EntityResult.DispatchCompartmentPlanList[i]
                        .DispatchCompartmentTanks[j].TankCode;
                  dispatchCompartmentTanks.push(dispatchCompartmentTank);
                  tankAssociation.DispatchCompartmentTanks =
                    dispatchCompartmentTanks;
                  modTankPlanAssociations.push(tankAssociation);
                }
                this.setState(
                  {
                    length: this.state.length + finishedProductItems.length,
                  },
                  () => {
                    if (
                      i ===
                      result.EntityResult.DispatchCompartmentPlanList.length - 1
                    ) {
                      let marineDispatch = lodash.cloneDeep(
                        result.EntityResult
                      );
                      marineDispatch.HSEInspectionStatus =
                        Utilities.getKeyByValue(
                          Constants.HSEInpectionStatus,
                          marineDispatch.HSEInspectionStatus
                        );
                      this.setState(
                        {
                          isReadyToRender: true,
                          marineDispatch: marineDispatch,
                          isNewDispatch: false,
                          modMarineDispatch: lodash.cloneDeep(marineDispatch),
                          modAssociations: this.getAssociationsFromDispatch(
                            result.EntityResult
                          ),
                          modTankAssociations: modTankPlanAssociations,
                          modTankPlanAssociations,
                          tempModTankAssociations: modTankPlanAssociations,
                          saveEnabled:
                            Utilities.isInFunction(
                              this.props.userDetails.EntityResult.FunctionsList,
                              functionGroups.modify,
                              fnMarineShipmentByCompartment
                            ) && this.props.updateEnableForConfigure, //&& result.EntityResult.DispatchStatus === "READY",
                        },
                        () => {
                          if (
                            marineDispatch.TerminalCodes !== undefined &&
                            marineDispatch.TerminalCodes !== null &&
                            marineDispatch.TerminalCodes.length !== 0
                          ) {
                            this.getTankListForRole(
                              marineDispatch.TerminalCodes[0]
                            );
                          } else {
                            this.getTankListForRole("");
                          }
                          this.getVesselsByCarrier(
                            this.props.selectedShareholder
                          );
                          this.getVessel(result.EntityResult.VesselCode, false);
                          // this.getTerminalsForCarrier(
                          //   result.EntityResult.CarrierCompanyCode
                          // );
                          this.getKPIList(result.EntityResult.DispatchCode)
                          if (
                            this.props.userDetails.EntityResult.IsEnterpriseNode
                          ) {
                            this.terminalSelectionChange(
                              result.EntityResult.TerminalCodes
                            );
                          } else {
                            this.localNodeAttribute();
                          }
                        }
                      );
                    }
                    if (i === this.state.modAssociations.length - 1) {
                      this.setState({
                        length: 0,
                      });
                    }
                  }
                );
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
        } else {
          this.setState({
            isNewDispatch: false,
            marineDispatch: lodash.cloneDeep(emptyMarineDispatch),
            modMarineDispatch: lodash.cloneDeep(emptyMarineDispatch),
            isReadyToRender: true,
          });
          console.log("Error in GetMarineDispatch:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting marineDispatch:", error);
        //throw error;
      });
  }

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
        "TrailerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

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
        var modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
        if (selectedTerminals !== null) {
          selectedTerminals.forEach((terminal) => {
            var existitem = selectedAttributeList.find((selectedAttribute) => {
              return selectedAttribute.TerminalCode === terminal;
            });

            if (existitem === undefined) {
              attributeMetaDataList.forEach(function (attributeMetaData) {
                if (attributeMetaData.TerminalCode === terminal) {
                  var Attributevalue = modMarineDispatch.Attributes.find(
                    (marineDispatchAttribute) => {
                      return marineDispatchAttribute.TerminalCode === terminal;
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
        }

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
        if (selectedTerminals !== "" && selectedAttributeList !== undefined) {
          this.formCompartmentAttributes(selectedTerminals);
        }

        this.setState(
          { selectedAttributeList, attributeValidationErrors },
          () => { }
        );
      }
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on terminalSelectionChange",
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
            assignedAttributes.compSequenceNo = comp.CompartmentSeqNoInVehicle;
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
          } else {
            comp.AttributesforUI = [];
          }
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
            // let result = temp.map((assignedAttributes) => {
            //   assignedAttributes.compSequenceNo =
            //     comp.CompartmentSeqNoInVehicle;
            //   return assignedAttributes;
            // });
            // comp.AttributesforUI = result;
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
        "TrailerDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }

  getTerminalsForCarrier(carrier) {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      const modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
      let terminalCodes = [...this.state.terminalCodes];
      modMarineDispatch.CarrierCode = carrier;
      modMarineDispatch.VesselCode = "";
      modMarineDispatch.modAssociations = [];

      try {
        if (carrier === undefined) {
          terminalCodes = [];
          modMarineDispatch.TerminalCodes = [];
          this.setState(
            { terminalCodes, modMarineDispatch }
            // , () =>
            // this.formCompartmentAttributes([])
          );
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
              this.setState({ terminalCodes });
            } else {
              terminalCodes = [];
              this.setState({ terminalCodes });
            }
            let modMarineDispatch = { ...this.state.modMarineDispatch };
            if (
              modMarineDispatch.ReceiptCode === undefined ||
              modMarineDispatch.ReceiptCode === "" ||
              modMarineDispatch.ReceiptCode === null
            ) {
              if (terminalCodes.length === 1) {
                modMarineDispatch.TerminalCodes = [...terminalCodes];
                //this.terminalSelectionChange(modMarineReceipt.TerminalCodes);
              } else {
                modMarineDispatch.TerminalCodes = [];
                //this.terminalSelectionChange([]);
              }
            }
            if (Array.isArray(modMarineDispatch.TerminalCodes)) {
              modMarineDispatch.TerminalCodes = terminalCodes.filter((x) =>
                modMarineDispatch.TerminalCodes.includes(x)
              );
            }
            this.setState({ modMarineDispatch }, () =>
              //this.formCompartmentAttributes());
              this.terminalSelectionChange(modMarineDispatch.TerminalCodes)
            );
          })
          .catch((error) => {
            terminalCodes = [];
            modMarineDispatch.TerminalCodes = [];
            this.setState({ terminalCodes, modMarineDispatch }, () =>
              this.formCompartmentAttributes([])
            );
            console.log("Error while getting Carrier:", error, carrier);
            //throw error;
          });
      } catch (error) {
        terminalCodes = [];
        modMarineDispatch.TerminalCodes = [];
        this.setState({ terminalCodes, modMarineDispatch }, () =>
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

  fillAttributeDetails(modMarineDispatch) {
    try {
      let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);
      modMarineDispatch.Attributes = [];
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
        modMarineDispatch.Attributes.push(attribute);
      });

      // For Compartment Attributes
      modMarineDispatch.DispatchCompartmentDetailPlanList.forEach((comp) => {
        let selectedTerminals = [];
        if (this.props.userDetails.EntityResult.IsEnterpriseNode)
          selectedTerminals = lodash.cloneDeep(modMarineDispatch.TerminalCodes);
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
            ) {
              terminalAttributes = comp.AttributesforUI.filter(function (
                attTerminal
              ) {
                return attTerminal.TerminalCode === terminal;
              });
            }
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
            });
            if (
              attribute.ListOfAttributeData !== null &&
              attribute.ListOfAttributeData !== undefined &&
              attribute.ListOfAttributeData.length > 0
            )
              comp.Attributes.push(attribute);
          });
        }
      });
      this.setState({ modMarineDispatch });
      return modMarineDispatch;
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
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

  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    if (
      compAttribute.rowData.DataType === Constants.AttributeTypes.INT ||
      compAttribute.rowData.DataType === Constants.AttributeTypes.LONG ||
      compAttribute.rowData.DataType === Constants.AttributeTypes.FLOAT ||
      compAttribute.rowData.DataType === Constants.AttributeTypes.DOUBLE
    ) {
      value = Utilities.convertStringtoDecimal(value);
    }
    let compIndex = modAssociations.findIndex(
      (item) =>
        item.CompartmentSeqNoInVehicle === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0) {
      if (compAttribute.rowData.DataType === "Bool") {
        if (compAttribute.rowData.AttributeValue === "true") {
          modAssociations[compIndex].AttributesforUI[
            //compAttribute.rowIndex
            compAttribute.rowData.SeqNumber - 1
          ].AttributeValue = "false";
        } else {
          modAssociations[compIndex].AttributesforUI[
            //compAttribute.rowIndex
            compAttribute.rowData.SeqNumber - 1
          ].AttributeValue = "true";
        }
      } else {
        modAssociations[compIndex].AttributesforUI[
          //compAttribute.rowIndex
          compAttribute.rowData.SeqNumber - 1
        ].AttributeValue = value;
      }
    }
    this.setState({ modAssociations });
    if (compIndex >= 0)
      this.toggleExpand(modAssociations[compIndex], true, true);
  };

  handleActiveStatusChange = (value) => {
    try {
      let modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
      modMarineDispatch.Active = value;
      if (modMarineDispatch.Active !== this.state.marineDispatch.Active)
        modMarineDispatch.Remarks = "";
      this.setState({ modMarineDispatch });
    } catch (error) {
      console.log(error);
    }
  };

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

  validateSave(modMarineDispatch) {
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(marineDispatchValidationDef).forEach(function (key) {
      if (modMarineDispatch[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          marineDispatchValidationDef[key],
          modMarineDispatch[key]
        );
      }
    });
    if (modMarineDispatch.Active !== this.state.marineDispatch.Active) {
      if (
        modMarineDispatch.Remarks === null ||
        modMarineDispatch.Remarks === ""
      ) {
        validationErrors["Remarks"] =
          "Marine_ShipmentCompDetail_RemarksRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [],
    };

    if (
      Array.isArray(modMarineDispatch.DispatchCompartmentDetailPlanList) &&
      modMarineDispatch.DispatchCompartmentDetailPlanList.length > 0
    ) {
      modMarineDispatch.DispatchCompartmentDetailPlanList.forEach((compart) => {
        marineDispatchCompartDef.forEach((col) => {
          let err = "";
          if (col.validator !== undefined) {
            err = Utilities.validateField(col.validator, compart[col.field]);
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: [
                "Marine_ShipmentCompDetail_ShipmentNumber",
                col.displayName,
              ],
              keyValues: [modMarineDispatch.DispatchCode, compart[col.field]],
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
        errorMessage: "ERRMSG_MARINESHIPMENT_COMP_DETAIL_PLAN_LIST_EMPTY",
      });
    }
    let uniqueRecords = [
      ...new Set(
        modMarineDispatch.DispatchCompartmentDetailPlanList.map((a) =>
          a.CompartmentSeqNoInVehicle.toString()
        )
      ),
    ];
    if (
      uniqueRecords.length !==
      modMarineDispatch.DispatchCompartmentDetailPlanList.length
    ) {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_RAILDISPATCH_ITEMPLAN_DUPLICATE",
      });
      this.props.onSaved(this.state.modMarineDispatch, "update", notification);
      return false;
    }
    // this.setState({ validationErrors });

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
    else return returnValue;

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modMarineDispatch, "update", notification);
      return false;
    }
    return returnValue;
  }

  handleSave = () => {
    let { saveEnabled } = this.state;
    if (saveEnabled) {
      try {
        var modTankAssociations = lodash.cloneDeep(
          this.state.modTankAssociations
        );
        var tempTankAssociations = modTankAssociations.filter(
          (modTankAssociation) => {
            return modTankAssociation.DispatchCompartmentTanks.length !== 0;
          }
        );
        tempTankAssociations = tempTankAssociations.filter(
          (tankAssociation) => {
            return tankAssociation.DispatchCompartmentTanks[0].TankCode !== "";
          }
        );
        if (tempTankAssociations.length === 0) {
          var tankAssociations = [];
          this.saveMarineDispatch(tankAssociations);
        } else {
          this.saveMarineDispatch(modTankAssociations);
        }
      } catch (error) {
        console.log(
          "MarineDispatchDetailsComposite:Error occured on handleSave",
          error
        );
      }
    } else {
      this.compartmentDetailsSave();
    }
  };


  addUpdateMarineDispatch = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempMarineDispatch = lodash.cloneDeep(this.state.tempMarineDispatch);

      this.state.marineDispatch.DispatchCode === ""
      ? this.createMarineDispatch(tempMarineDispatch)
      : this.updateMarineDispatch(tempMarineDispatch);
    } catch (error) {
      console.log("MarineShipComposite : Error in addUpdateMarineDispatch");
    }
  };

  saveMarineDispatch(tankAssociations) {
    let modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
    modMarineDispatch.DispatchCompartmentDetailPlanList =
      this.getCompartmentFromAssociations(this.state.modAssociations);
  //  this.setState({ saveEnabled: false });
    let modMarineDispatchs = this.fillAttributeDetails(modMarineDispatch);
    if (this.validateSave(modMarineDispatchs)) {
      modMarineDispatch.DispatchCompartmentDetailPlanList =
        modMarineDispatch.DispatchCompartmentDetailPlanList.map(
          (detailPlan) => {
            detailPlan.Quantity = Utilities.convertStringtoDecimal(
              detailPlan.Quantity
            );
            return detailPlan;
          }
        );
      modMarineDispatch.DispatchCompartmentPlanList =
        this.getTankPlanFromTankAssociations(tankAssociations);
     
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempMarineDispatch = lodash.cloneDeep(modMarineDispatch);
      this.setState({ showAuthenticationLayout, tempMarineDispatch }, () => {
        if (showAuthenticationLayout === false) {
          this.addUpdateMarineDispatch();
        }
    });


    } else {
      this.setState({ saveEnabled: true });
    }
  }

  createMarineDispatch(modMarineDispatch) {
    this.handleAuthenticationClose();
    modMarineDispatch.DispatchCompartmentDetailPlanList.forEach((item) => {
      item.QuantityUOM = modMarineDispatch.QuantityUOM;
    });
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: modMarineDispatch.DispatchCode,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
      Entity: modMarineDispatch,
    };
    var notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modMarineDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.CreateMarineDispatch,
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
          this.props.handlePageAdd(modMarineDispatch);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
          console.log("Error in CreateMarineDispatch:", result.ErrorList);
        }
        this.props.onSaved(modMarineDispatch, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modMarineDispatch, "add", notification);
      });
  }

  updateMarineDispatch(modMarineDispatch) {
    this.handleAuthenticationClose();
    modMarineDispatch.DispatchCompartmentDetailPlanList.forEach((item) => {
      item.QuantityUOM = modMarineDispatch.QuantityUOM;
    });

    if (Array.isArray(modMarineDispatch.DispatchItemPlanList)) {
      modMarineDispatch.DispatchItemPlanList.forEach(item => {
        item.QuantityUOM = modMarineDispatch.QuantityUOM;
      });
    }

    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: modMarineDispatch.DispatchCode,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
      Entity: modMarineDispatch,
    };
    var notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [modMarineDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestApis.UpdateMarineDispatch,
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
          this.props.handlePageAdd(modMarineDispatch);
        } else {
          this.setState({
            saveEnabled: true,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateMarineDispatch:", result.ErrorList);
        }
        this.props.onSaved(modMarineDispatch, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modMarineDispatch, "modify", notification);
        this.setState({
          saveEnabled: true,
        });
      });
  }

  handleReset = () => {
    try {
      let vehicleDetails = lodash.cloneDeep(this.state.vehicleDetails);
      let modAssociations = [];
      let modTankAssociations = [];
      let modTankPlanAssociations = [];
      let compSeqOptions = [];
      if (this.state.marineDispatch.DispatchCode === "") {
        modAssociations = [];
        compSeqOptions = [];
      } else {
        modAssociations = this.getAssociationsFromDispatch(
          this.state.marineDispatch
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
      this.setState(
        {
          modMarineDispatch: lodash.cloneDeep(this.state.marineDispatch),
          validationErrors: [],
          modVehicleDetails: lodash.cloneDeep(this.state.vehicleDetails),
          modAssociations,
          modTankAssociations,
          modTankPlanAssociations,
          selectedAttributeList: [],
          selectedAssociations: [],
          selectedTankAssociations: [],
          vesselSearchOptions: [],
          terminalCodes: this.props.terminalCodes,
          compSeqOptions,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modAssociations.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      var modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
      validationErrors[propertyName] = error;
      modMarineDispatch[propertyName] = value;
      this.setState({ validationErrors, modMarineDispatch });
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.props.terminalCodes];
      var modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
      if (checked) modMarineDispatch.TerminalCodes = [...terminalCodes];
      else modMarineDispatch.TerminalCodes = [];
      this.setState({ modMarineDispatch });
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on handleAllTerminalsChange",
        error
      );
    }
  };

  getAssociationsFromDispatch(dispatch) {
    dispatch.DispatchCompartmentDetailPlanList.sort((a, b) => {
      if (a.CompartmentSeqNoInVehicle > b.CompartmentSeqNoInVehicle) {
        return 1;
      } else if (a.CompartmentSeqNoInVehicle < b.CompartmentSeqNoInVehicle) {
        return -1;
      } else {
        return 0;
      }
    });
    let associations = [];
    try {
      if (Array.isArray(dispatch.DispatchCompartmentDetailPlanList)) {
        dispatch.DispatchCompartmentDetailPlanList.forEach(
          (dispatchCompartment) =>
            associations.push({
              AssociatedContractItems:
                dispatchCompartment.AssociatedContractItems,
              AssociatedOrderItems: dispatchCompartment.AssociatedOrderItems,
              Attributes: dispatchCompartment.Attributes,
              CarrierCompanyCode: dispatchCompartment.CarrierCompanyCode,
              CompartmentCode: dispatchCompartment.CompartmentCode,
              CompartmentSeqNoInVehicle:
                dispatchCompartment.CompartmentSeqNoInVehicle,
              CustomerCode: dispatchCompartment.CustomerCode,
              DestinationCode: dispatchCompartment.DestinationCode,
              DispatchCode: dispatchCompartment.DispatchCode,
              FinishedProductCode: dispatchCompartment.FinishedProductCode,
              Quantity:
                dispatchCompartment.Quantity !== null &&
                  dispatchCompartment.Quantity !== ""
                  ? dispatchCompartment.Quantity.toLocaleString()
                  : null,
              QuantityUOM: dispatchCompartment.QuantityUOM,
              SequenceNo: dispatchCompartment.CompartmentSeqNoInVehicle,
              ShareholderCode: dispatchCompartment.ShareholderCode,
              TrailerCode: dispatchCompartment.TrailerCode,
            })
        );
      }
    } catch (error) {
      console.log("error in getAssociationsFromDispatch", error);
    }

    return associations;
  }

  onCarrierCompanyChange = (data) => {
    try {
      const modMarineDispatch = lodash.cloneDeep(this.state.modMarineDispatch);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modMarineDispatch.CarrierCode = data;
      modMarineDispatch.VesselCode = "";
      this.setState(
        {
          modMarineDispatch,
          modAssociations: [],
          modTankAssociations: [],
          modTankPlanAssociations: [],
        },
        () => this.getVesselsByCarrier(this.props.selectedShareholder)
      );
      if (this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.getTerminalsForCarrier(data);
      validationErrors.CarrierCode = "";
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on onCarrierCompanyChange",
        error
      );
    }
  };

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
            modAssociation.CustomerCode === null ||
            modAssociation.CustomerCode === ""
          ) ||
          !(
            modAssociation.DestinationCode === null ||
            modAssociation.DestinationCode === ""
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
            DestinationCode: modAssociation.DestinationCode,
            DispatchCode: this.state.modMarineDispatch.DispatchCode,
            FinishedProductCode: modAssociation.FinishedProductCode,
            Quantity: modAssociation.Quantity,
            QuantityUOM: modAssociation.QuantityUOM,
            SequenceNo: modAssociation.SequenceNo,
            ShareholderCode: modAssociation.ShareholderCode,
            TrailerCode: modAssociation.TrailerCode,
          });
        }
      });
    }
    return compartment;
  }

  getTankPlanFromTankAssociations(modTankAssociations) {
    if (Array.isArray(modTankAssociations)) {
      modTankAssociations.forEach((modTankAssociation) => {
        if (
          modTankAssociation.PlannedQuantity !== null &&
          modTankAssociation.PlannedQuantity !== ""
        ) {
          modTankAssociation.PlannedQuantity = Utilities.convertStringtoDecimal(
            modTankAssociation.PlannedQuantity
          );
        }
        if (
          modTankAssociation.DispatchCompartmentTanks !== null &&
          modTankAssociation.DispatchCompartmentTanks !== "" &&
          modTankAssociation.DispatchCompartmentTanks.length !== 0
        ) {
          modTankAssociation.DispatchCompartmentTanks[0].PlannedQuantity =
            Utilities.convertStringtoDecimal(
              modTankAssociation.DispatchCompartmentTanks[0].PlannedQuantity
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
        "MarineDispatchDetailsComposite:Error occured on handleVesselSearchChange",
        error
      );
    }
  };

  getVesselSearchOptions() {
    let vesselSearchOptions = lodash.cloneDeep(this.state.vesselSearchOptions);
    let modVesselCode = this.state.modMarineDispatch.VesselCode;
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

  handleInputDataEdit = (newVal, rowData) => {
    var modMarineCompartmentDetails = lodash.cloneDeep(
      this.state.modMarineCompartmentDetails
    );
    modMarineCompartmentDetails.forEach((modMarineCompartmentDetail) => {
      if (
        modMarineCompartmentDetail.CompartmentSeqNoInVehicle ===
        rowData.CompartmentSeqNoInVehicle
      ) {
        modMarineCompartmentDetail.AdjustmentToPlannedQuantity = newVal;
      }
    });

    this.setState({
      modMarineCompartmentDetails: modMarineCompartmentDetails,
    });
  };

  compartmentDetailsSave = () => {
    var saveCompartmentDetailsKeys = [];

    var notification = {
      messageType: "critical",
      message: "ViewMarineShipmentList_CompartmentDetailsStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [this.state.modMarineDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    for (var i = 0; i < this.state.modMarineCompartmentDetails.length; i++) {
      var MarineDispatchCode = this.state.modMarineDispatch.DispatchCode;
      var adjustPlan =
        this.state.modMarineCompartmentDetails[i][
        "AdjustmentToPlannedQuantity"
        ];
      if (adjustPlan !== null) {
        adjustPlan = Utilities.convertStringtoDecimal(adjustPlan);
      }
      var KeyData = {
        keyDataCode:
          this.state.modMarineCompartmentDetails[i][
          "CompartmentSeqNoInVehicle"
          ],
        KeyCodes: [
          {
            Key: KeyCodes.marineDispatchCode,
            Value: MarineDispatchCode,
          },
          {
            key: KeyCodes.compartmentSeqNoInVehicle,
            value:
              this.state.modMarineCompartmentDetails[i][
              "CompartmentSeqNoInVehicle"
              ],
          },
          {
            key: KeyCodes.adjustedPlanQuantity,
            value: adjustPlan,
          },
          {
            key: KeyCodes.forceComplete,
            value: this.state.modMarineCompartmentDetails[i]["forceComplete"],
          },
        ],
      };
      saveCompartmentDetailsKeys.push(KeyData);
    }

    axios(
      RestApis.MarineDispatchCompartmentDetailsSave,
      Utilities.getAuthenticationObjectforPost(
        saveCompartmentDetailsKeys,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          notification.messageType = "success";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          this.getMarineCompartmentDetails(this.props.selectedRow);
          this.props.onSaved(
            this.state.modMarineDispatch,
            "UpdateCompartmentDetails",
            notification
          );
          this.props.handlePageAdd(this.state.marineDispatch);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.props.onSaved(
            this.state.modMarineDispatch,
            "UpdateCompartmentDetails",
            notification
          );
        }
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

    this.setState({
      marineCompartmentDetails: this.state.modMarineCompartmentDetails,
      expandedCellRows: [],
    });
  };

  onBack = () => {
    if (this.state.isCompartmentDetails) {
      this.setState({
        isCompartmentDetails: false,
      });
    } else if (this.state.isManualEntry) {
      this.setState({
        isManualEntry: false,
        isCompartmentDetails: true,
      });
    }

    this.componentDidMount();
  };

  ButtonIsAvailable = (selectedRow, buttonName) => {
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.OperationName,
        value: buttonName,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetMarineDispatchCompartmentDetailsOperations,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var { operationsVisibilty } = { ...this.state };
        if (buttonName === "FORCE_COMPLETE") {
          operationsVisibilty.forceCompleteIsDisable = !(
            response.data.IsSuccess ||
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnMarineDispatch
            ) === false
          );
          this.setState({
            operationsVisibilty,
          });
        } else if (buttonName === "ADJUST_PLAN") {
          operationsVisibilty.adjustPlanIsDisable = !(
            response.data.IsSuccess ||
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnMarineDispatch
            ) === false
          );
          this.setState({
            operationsVisibilty,
          });
        }
      })
      .catch((error) => {
        console.log(
          "Error in get marine dispatch compartment details operations:",
          error
        );
      });
  };

  handleCellCheck = (cellData) => {
    let modMarineCompartmentDetails = lodash.cloneDeep(
      this.state.modMarineCompartmentDetails
    );

    modMarineCompartmentDetails.forEach((modMarineCompartmentDetail) => {
      if (
        modMarineCompartmentDetail.CompartmentSeqNoInVehicle ===
        cellData.rowData.CompartmentSeqNoInVehicle
      )
        modMarineCompartmentDetail["forceComplete"] =
          !modMarineCompartmentDetail["forceComplete"];
    });

    this.setState({
      modMarineCompartmentDetails,
    });
  };

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
  getVesselsByCarrier(shareholder) {
    if (
      this.state.modMarineDispatch.CarrierCode !== undefined &&
      this.state.modMarineDispatch.CarrierCode !== null &&
      shareholder !== undefined &&
      shareholder !== null
    ) {
      let { carrierShareholderMap } = this.state;
      axios(
        RestApis.GetVehicleCodesByCarrier +
        "?ShareholderCode=" +
        carrierShareholderMap.get(this.state.modMarineDispatch.CarrierCode) +
        "&Transportationtype=" +
        Constants.TransportationType.MARINE +
        "&CarrierCode=" +
        this.state.modMarineDispatch.CarrierCode,
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
        "MarineDispatchDetailsComposite:Error occured on handleCarrierSearchChange",
        error
      );
    }
  };

  getCarrierSearchOptions() {
    let carrierSearchOptions = lodash.cloneDeep(
      this.state.carrierSearchOptions
    );
    let modCarrierCode = this.state.modMarineDispatch.CarrierCode;
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

  handleSaveCompartmentDetailsEnabled = () => {
    const abledRow =
      this.state.marineCompartmentDetails.findIndex(
        (item) =>
          item.DispatchCompartmentStatus !== 1 &&
          item.DispatchCompartmentStatus !== 3 &&
          item.DispatchCompartmentStatus !== 4 &&
          item.DispatchCompartmentStatus !== 5
      ) === -1;

    const { modMarineDispatch } = this.state;
    const { operationsVisibilty } = this.state;
    let saveCompartmentDetailsEnabled =
      (modMarineDispatch.DispatchStatus !== Shipment_Status.QUEUED &&
        modMarineDispatch.DispatchStatus !== Shipment_Status.PARTIALLY_LOADED &&
        modMarineDispatch.DispatchStatus !== Shipment_Status.AUTO_LOADED &&
        modMarineDispatch.DispatchStatus !== Shipment_Status.INTERRUPTED &&
        modMarineDispatch.DispatchStatus !== Shipment_Status.MANUALLY_LOADED &&
        operationsVisibilty.forceCompleteIsDisable &&
        operationsVisibilty.adjustPlanIsDisable) ||
      this.props.userDetails.EntityResult.IsEnterpriseNode ||
      abledRow;
    return !saveCompartmentDetailsEnabled;
  };

  getSaveEnabled() {
    var saveCompartmentDetailsEnabled =
      this.handleSaveCompartmentDetailsEnabled();
    var saveAbled = lodash.cloneDeep(this.state.saveEnabled);
    var viewTab = lodash.cloneDeep(this.props.viewTab);
    if (viewTab === 2) {
      return (
        saveCompartmentDetailsEnabled &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.modify,
          fnMarineShipmentByCompartment
        )
      );
    } else if (viewTab === 3) {
      return false;
    } else {
      return saveAbled;
    }
  }
  getKPIList(marineDispatchCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    )
    if (KPIView === true) {

      let objKPIRequestData = {
        PageName: kpiMarineShipmentDetails,
        TransportationType: Constants.TransportationType.MARINE,
        InputParameters: [{ key: "ShipmentCode", value: marineDispatchCode }],
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
            this.setState({ marineDispatchKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ marineDispatchKPIList: [] });
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
    const saveEnabled = this.getSaveEnabled();
    let popUpContents = [];
    try {
      popUpContents = [
        {
          fieldName: "Marine_ShipmentCompDetail_LastUpdated",
          fieldValue:
            new Date(
              this.state.modMarineDispatch.UpdatedTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modMarineDispatch.UpdatedTime
            ).toLocaleTimeString(),
        },
        {
          fieldName: "Marine_ShipmentCompDetail_CreatedTime",
          fieldValue:
            new Date(
              this.state.modMarineDispatch.CreatedTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modMarineDispatch.CreatedTime
            ).toLocaleTimeString(),
        },
        {
          fieldName: "Terminal_ActiveTime",
          fieldValue:
            this.state.modMarineDispatch.LastActiveTime !== undefined &&
              this.state.modMarineDispatch.LastActiveTime !== null
              ? new Date(
                this.state.modMarineDispatch.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modMarineDispatch.LastActiveTime
              ).toLocaleTimeString()
              : "",
        },
      ];
    } catch (error) {
      console.log("error in get popUpContents", error);
      popUpContents = [
        {
          fieldName: "Marine_ShipmentCompDetail_LastUpdated",
          fieldValue:
            new Date(this.state.modMarineDispatch.UpdatedTime) +
            " " +
            new Date(this.state.modMarineDispatch.UpdatedTime),
        },
        {
          fieldName: "Marine_ShipmentCompDetail_CreatedTime",
          fieldValue:
            new Date(this.state.modMarineDispatch.CreatedTime) +
            " " +
            new Date(this.state.modMarineDispatch.CreatedTime),
        },
        {
          fieldName: "Terminal_ActiveTime",
          fieldValue:
            this.state.modMarineDispatch.LastActiveTime !== undefined &&
              this.state.modMarineDispatch.LastActiveTime !== null
              ? new Date(this.state.modMarineDispatch.LastActiveTime) +
              " " +
              new Date(this.state.modMarineDispatch.LastActiveTime)
              : "",
        },
      ];
    }

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.marineDispatch.DispatchCode}
            newEntityName="Marine_ShipmentCompDetail_NewShipmentByCompartment"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        {this.state.isManualEntry ? (
          <div>
            <ErrorBoundary>
              <MarineDispatchManualEntryDetailsComposite
                dispatchCode={this.state.modMarineDispatch.DispatchCode}
                handleBack={this.onBack}
                IsBonded={this.state.modMarineDispatch.IsBonded}
                DispatchStatus={this.state.modMarineDispatch.DispatchStatus}
                QuantityUOM={this.state.modMarineDispatch.QuantityUOM}
                ActualTerminalCode={this.state.modMarineDispatch.ActualTerminalCode}
              ></MarineDispatchManualEntryDetailsComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <div>
            <TMDetailsKPILayout KPIList={this.state.marineDispatchKPIList}> </TMDetailsKPILayout>
            <ErrorBoundary>
              <MarineDispatchDetails
                selectedRow={this.props.selectedRow}
                marineDispatch={this.state.marineDispatch}
                modMarineDispatch={this.state.modMarineDispatch}
                modAssociations={this.state.modAssociations}
                modTankAssociations={this.state.modTankAssociations}
                validationErrors={this.state.validationErrors}
                selectedAssociations={this.state.selectedAssociations}
                selectedTankAssociations={this.state.selectedTankAssociations}
                listOptions={{
                  shareholders: this.state.shareholders,
                  terminalCodes: this.state.terminalCodes,
                  shipmentUOM: this.state.shipmentUOM,
                  carrierCompany: this.getCarrierSearchOptions(),
                  compSeqOptions: this.state.compSeqOptions,
                  vessels: this.getVesselSearchOptions(),
                  FinishedProducts: this.state.FinishedProducts,
                  customerDestinationOptions:
                    this.state.customerDestinationOptions,
                  shareholderCustomers: this.state.shareholderCustomers,
                  baseProductDetails: this.state.baseProductDetails,
                  tankCodeOptions: this.state.tankCodeOptions,
                  additiveDetails: this.state.additiveDetails,
                }}
                shareholderCustomers={this.state.shareholderCustomers}
                onFieldChange={this.handleChange}
                onDateTextChange={this.handleDateTextChange}
                // onAllTerminalsChange={this.handleAllTerminalsChange}
                handleAssociationSelectionChange={
                  this.handleAssociationSelectionChange
                }
                handleTankAssociationSelectionChange={
                  this.handleTankAssociationSelectionChange
                }
                handleCellDataEdit={this.handleCellDataEdit}
                handleTankCellDataEdit={this.handleTankCellDataEdit}
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
                marineShipmentPlan={this.state.marineShipmentPlan}
                marineCompartmentDetails={this.state.marineCompartmentDetails}
                handleInputDataEdit={this.handleInputDataEdit}
                compartmentDetailsSave={this.compartmentDetailsSave}
                operationsVisibilty={this.state.operationsVisibilty}
                handleCellCheck={this.handleCellCheck}
                viewTab={this.props.viewTab}
                onTabChange={this.onTabChange}
                handleAttributeCellDataEdit={this.handleAttributeCellDataEdit}
                selectedAttributeList={this.state.selectedAttributeList}
                attributeValidationErrors={this.state.attributeValidationErrors}
                onCarrierCompanyChange={this.onCarrierCompanyChange}
                expandedRows={this.state.expandedRows}
                toggleExpand={this.toggleExpand}
                handleCompAttributeCellDataEdit={
                  this.handleCompAttributeCellDataEdit
                }
                expandedCellRows={this.state.expandedCellRows}
                modMarineCompartmentDetails={
                  this.state.modMarineCompartmentDetails
                }
                onCarrierSearchChange={this.handleCarrierSearchChange}
                isHSEInspectionEnable={this.state.isHSEInspectionEnable}
                isBondShow={this.state.isBondShow}
                compartmentDetailsPageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                compDetailsTab={this.state.isNewDispatch ? [] : [""]}
                allocationTab={
                  this.state.isNewDispatch === false &&
                    this.props.userDetails.EntityResult.IsEnterpriseNode === false
                    ? [""]
                    : []
                }
                allocationDetails={this.state.productAllocationDetails}
                updateEnableForConfigure={this.props.updateEnableForConfigure}
              ></MarineDispatchDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              {/* <TranslationConsumer>
                {(t) => (
                  <div className="row">
                    <div className="col col-lg-8">
                      <Button
                        className="backButton"
                        onClick={this.props.onBack}
                        content={t("Back")}
                      ></Button>
                    </div>
                    <div
                      className="col col-lg-4"
                      style={{ textAlign: "right" }}
                    >
                      <Button
                        content={t("LookUpData_btnReset")}
                        className="cancelButton"
                        onClick={this.handleReset}
                      ></Button>
                      <Button
                        content={t("Save")}
                        disabled={!saveEnabled}
                        onClick={this.handleSave}
                      ></Button>
                    </div>
                  </div>
                )}
              </TranslationConsumer> */}

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
              this.state.marineDispatch.DispatchCode  === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnMarineShipmentByCompartment}
            handleOperation={this.addUpdateMarineDispatch}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
          </div>
        )}
      </div>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }

  onTabChange = (activeIndex) => {
    if (activeIndex === 1) {
      this.setState({
        modTankAssociations: this.state.modTankPlanAssociations,
      });
    }
    this.props.onTabChange(activeIndex);
  };

  getMarineShipmentPlan(selectedRow) {
    if (selectedRow.Common_Code === undefined) {
      this.setState({
        marineShipmentPlan: [],
      });
      return;
    }
    axios(
      RestApis.GetMarineDispatchPlan +
      "?MarineDispatchCode=" +
      selectedRow.Common_Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ marineShipmentPlan: result.EntityResult });
        } else {
          console.log("Error in getMarineShipmentPlan:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting MarineShipmentPlan:", error);
      });
  }

  getMarineCompartmentDetails(selectedRow) {
    if (selectedRow.Common_Code === undefined) {
      this.setState({
        marineCompartmentDetails: [],
      });
      return;
    }

    axios(
      RestApis.GetMarineDispatchCompartmentDetails +
      "?MarineDispatchCode=" +
      selectedRow.Common_Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          for (var i = 0; i < result.EntityResult.length; i++) {
            result.EntityResult[i] = {
              ...result.EntityResult[i],
              forceComplete: false,
              AdjustmentToPlannedQuantity: "",
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
            result.EntityResult[i].ReturnQuantity =
              result.EntityResult[i].ReturnQuantity !== "" &&
                result.EntityResult[i].ReturnQuantity !== null
                ? result.EntityResult[i].ReturnQuantity.toLocaleString()
                : "";
            result.EntityResult[i].LoadedQuantity =
              result.EntityResult[i].LoadedQuantity !== "" &&
                result.EntityResult[i].LoadedQuantity !== null
                ? result.EntityResult[i].LoadedQuantity.toLocaleString()
                : "";
          }
          this.setState({
            marineCompartmentDetails: result.EntityResult,
            modMarineCompartmentDetails: result.EntityResult,
          });
        } else {
          console.log(
            "Error in getMarineCompartmentDetails:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting MarineCompartmentDetails:", error);
      });
  }

  getTankCode() {
    axios(
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
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarineDispatchDetailsComposite);

MarineDispatchDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  viewTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  handlePageAdd: PropTypes.func.isRequired,
  updateEnableForConfigure: PropTypes.bool.isRequired,
};
