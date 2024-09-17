import React, { Component } from "react";
import { MapTransactionsDetail } from "../../UIBase/Details/MapTransactionsDetail";
import * as Utilities from "../../../JS/Utilities";
import { emptyMapTransactions } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { mapTransactionsValidationDef } from "../../../JS/ValidationDef";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import { Button,Input,Modal } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import {  toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";

class MapTransactionsDetailComposite extends Component {
  state = {
    modMapTransactions: lodash.cloneDeep(emptyMapTransactions),
    validationErrors: Utilities.getInitialValidationErrors(
      mapTransactionsValidationDef
    ),
    otherData: {
      ScheduledDate: "",
      Status: "",
      IsValidStatus: true,
      DriverCode: "",
      VehicleCode: "",
      ProductCode: "",
      LocalTranInfoForUI: [],
      BatchInfoForUI: [],
      DispatchReceiptInfoForUI: [],
    },
    isReadyToRender: true,
    transportationTypeOptions: [],
    transactionTypeOptions: [],
    shareholderCodeOptions: [],
    dispatchReceiptCodeOptions: [],
    transactionCodeOptions: [],
    transactionCodeSearchOptions: [],
    tankCodeOptions: [],
    selectedCompRow: [],
    selectLocalTransactionRow: [],
    receiptCodeOptions: [],
    receiptCodeSearchOptions: [],
    railWagonCodeOptions: [],
    latestMeterCode: "",
    closeRailShipment: "ViewRailDispatchList_CloseRailShipment",
    printBOL: "ViewRailDispatchList_PrintBOL",
    isCloseEnabled: false,
    isPrintEnabled: false,
    reasonForClosure:"",
    launchPopup: false,
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getTransactionTypes();
      this.getShareholders();
    } catch (error) {
      console.log("MapTransactionsDetail:Error occurred on ", error);
    }
  }

  getTransactionTypes() {
    const data = {
      shipment: "DISPATCH",
      receipt: "RECEIPT",
    };
    // this.props.transportationType === Constants.TransportationType.ROAD
    //   ? {
    //       shipment: "DISPATCH",
    //       receipt: "RECEIPT",
    //     }
    //   : {
    //       shipment: "DISPATCH",
    //       receipt: "RECEIPT",
    //     };
    const transactionTypeOptions = [];
    for (let key in data) {
      transactionTypeOptions.push({ text: data[key], value: data[key] });
    }
    this.setState({ transactionTypeOptions });
  }

  getShareholders() {
    const shareholderCodeOptions = Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
    const modMapTransactions = lodash.cloneDeep(this.state.modMapTransactions);
    modMapTransactions.ShareholderCode = this.props.selectedShareholder;
    modMapTransactions.TransportationType = this.props.transportationType;
    this.getTransactionCodes(modMapTransactions);
    this.setState({ modMapTransactions, shareholderCodeOptions });
  }

  getTransactionCodes(mapTransactions) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [mapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const obj = {
        TransportationType: this.props.transportationType,
        TransactionType: mapTransactions.TransactionType,
        ShareholderCode: mapTransactions.ShareholderCode,
      };
      axios(
        RestAPIs.GetDispatchOrReceiptCodes,
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
            if (result.EntityResult === null) {
              console.log(
                "Error in GetDispatchOrReceiptCodes:",
                result.ErrorList
              );
            } else if (Array.isArray(result.EntityResult.Table)) {
              const transactionCodeList = [];
              for (let item of result.EntityResult.Table) {
                transactionCodeList.push(item.Code);
              }
              const transactionCodeOptions =
                Utilities.transferListtoOptions(transactionCodeList);
              let transactionCodeSearchOptions = lodash.cloneDeep(
                transactionCodeOptions
              );
              if (
                transactionCodeOptions.length > Constants.filteredOptionsCount
              ) {
                transactionCodeSearchOptions =
                  transactionCodeSearchOptions.slice(
                    0,
                    Constants.filteredOptionsCount
                  );
              }
              this.setState({
                transactionCodeOptions,
                transactionCodeSearchOptions,
              });
            }
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in getTransactionCodes:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting getTransactionCodes:", error);
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getTransactionCodes",
        error
      );
    }
  }

  getRoadDispatch(modMapTransactions, otherData) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const keyCode = [
        {
          key: KeyCodes.shipmentCode,
          value: modMapTransactions.TransactionCode,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
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
          const result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.getShipmentStatusOperations(result.EntityResult);
            
            modMapTransactions.TransLoadSource =
              result.EntityResult.TransloadSourceType;
            otherData.ScheduledDate = result.EntityResult.ScheduledDate;
            otherData.Status = result.EntityResult.Status;
            otherData.DriverCode = result.EntityResult.DriverCode;
            otherData.VehicleCode = result.EntityResult.VehicleCode;
            otherData.DispatchReceiptInfoForUI = [];
            if (
              result.EntityResult.ShipmentCompartments != null &&
              result.EntityResult.ShipmentCompartments.length > 0
            ) {
              const compartments =
                result.EntityResult.ShipmentCompartments.sort(
                  (item1, item2) => {
                    if (
                      item1.CompartmentSeqNoInVehicle <
                      item2.CompartmentSeqNoInVehicle
                    ) {
                      return -1;
                    } else if (
                      item1.CompartmentSeqNoInVehicle >
                      item2.CompartmentSeqNoInVehicle
                    ) {
                      return 1;
                    } else {
                      return 0;
                    }
                  }
                );
              compartments.forEach((element) => {
                const compartmentInfo = {
                  ID: "",
                  ShareholderCode: element.ShareholderCode,
                  CarrierCompanyCode: result.EntityResult.CarrierCode,
                  TrailerCode: element.TrailerCode,
                  CompartmentCode: element.CompartmentCode,
                  CompartmentSeqNoInVehicle: element.CompartmentSeqNoInVehicle,
                  FinishedProductCode: element.FinishedProductCode,
                  CustomerOrSupplierCode: "",
                  DestinationOrOriginTerminalCode: "",
                  PlannedQuantity:
                    element.Quantity === null
                      ? "0 " + element.QuantityUOM
                      : element.Quantity.toLocaleString() +
                        " " +
                        element.QuantityUOM,
                  ActualQuantity:
                    element.LoadedQuantity === null
                      ? "0 " + element.QuantityUOM
                      : element.LoadedQuantity.toLocaleString() +
                        " " +
                        element.QuantityUOM,
                  Status: element.ShipmentCompartmentStatus,
                };
                result.EntityResult.ShipmentDestinationCompartmentsInfo.forEach(
                  (element) => {
                    if (
                      element.CompartmentCode ===
                      compartmentInfo.CompartmentCode
                    ) {
                      compartmentInfo.CustomerOrSupplierCode =
                        element.CustomerCode;
                      compartmentInfo.DestinationOrOriginTerminalCode =
                        element.DestinationCode;
                    }
                  }
                );
                otherData.DispatchReceiptInfoForUI.push(compartmentInfo);
              });
              if (
                otherData.Status !== "INTERRUPTED" &&
                otherData.Status !== "PARTIALLY_LOADED" &&
                otherData.Status !== "QUEUED"
              ) {
                notification.messageType = "critical";
                notification.messageResultDetails[0].isSuccess = false;
                notification.messageResultDetails[0].errorMessage =
                  "MapTransactions_TransactionNotInValidState";
                this.props.onNotice(notification);
                otherData.IsValidStatus = false;
              } else {
                otherData.IsValidStatus = true;
              }
              this.setState({
                modMapTransactions,
                otherData,
              });
            } else {
              notification.messageType = "critical";
              notification.messageResultDetails[0].isSuccess = false;
              notification.messageResultDetails[0].errorMessage =
                "LocalTransaction_CompartmentPlanNotAvailable";
              this.props.onNotice(notification);
            }
          } else {
            console.log("Error in getRoadDispatch: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting getRoadDispatch: ",
            error,
            modMapTransactions.TransactionCode
          );
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getRoadDispatch",
        error
      );
    }
  }

  getCloseModalPopupText()
  {
    
    //default label values
    var popupVariables= {
    popupHeaderLabel:  "ViewShipment_CloseHeader",
    msgStatusHeader : "ViewAllShipment_ShipmentClose",
    errorMsg: "Enter_ReasonForCloseure",
    keyField : "ShipmentCompDetail_ShipmentNumber",
    }

    if((this.state.modMapTransactions.TransactionType === "DISPATCH" || this.state.modMapTransactions.TransactionType === "SHIPMENT") && (this.state.modMapTransactions.TransportationType==="MARINE" || this.state.modMapTransactions.TransportationType==="RAIL"))
    {
      popupVariables.popupHeaderLabel= "ViewRailDispatchList_ForceCloseHeader";
      popupVariables.msgStatusHeader="RailDispatch_CloseDispatchStatus";
      popupVariables.errorMsg="ViewRailDispatchList_ReasonForCloseure";
      popupVariables.keyField="ViewRailDispatchDetails_DispatchCode";
  }
  else if(this.state.modMapTransactions.TransactionType === "RECEIPT" )
    {
      popupVariables.popupHeaderLabel= "Receipt_ForceCloseHeader";
      popupVariables.msgStatusHeader= "ViewReceipt_CloseStatus";
      popupVariables.errorMsg= "Enter_Receipt_ReasonForCloseure";
      popupVariables.keyField= "Receipt_Code";
    }
  return popupVariables;
  }

  getRoadReceipt(modMapTransactions, otherData) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const keyCode = [
        {
          key: KeyCodes.receiptCode,
          value: modMapTransactions.TransactionCode,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
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
          const result = response.data;
          if (result.IsSuccess === true) {

            this.getReciptsStatusOperations(result.EntityResult.ReceiptStatus,result.EntityResult.IsVolumeBased);

            modMapTransactions.TransLoadSource =
              result.EntityResult.TransloadSourceType;
            otherData.ScheduledDate = result.EntityResult.ScheduledDate;
            otherData.Status = result.EntityResult.ReceiptStatus;
            otherData.DriverCode = result.EntityResult.DriverCode;
            otherData.VehicleCode = result.EntityResult.VehicleCode;
            otherData.DispatchReceiptInfoForUI = [];
            if (
              result.EntityResult.ReceiptCompartmentsInfo !== null &&
              result.EntityResult.ReceiptCompartmentsInfo.length > 0
            ) {
              const compartments =
                result.EntityResult.ReceiptCompartmentsInfo.sort(
                  (item1, item2) => {
                    if (
                      item1.CompartmentSeqNoInVehicle <
                      item2.CompartmentSeqNoInVehicle
                    ) {
                      return -1;
                    } else if (
                      item1.CompartmentSeqNoInVehicle >
                      item2.CompartmentSeqNoInVehicle
                    ) {
                      return 1;
                    } else {
                      return 0;
                    }
                  }
                );
              compartments.forEach((element) => {
                const compartmentInfo = {
                  ID: "",
                  ShareholderCode: element.ShareholderCode,
                  CarrierCompanyCode: result.EntityResult.CarrierCode,
                  TrailerCode: element.TrailerCode,
                  CompartmentCode: element.CompartmentCode,
                  CompartmentSeqNoInVehicle: element.CompartmentSeqNoInVehicle,
                  FinishedProductCode: element.FinishedProductCode,
                  CustomerOrSupplierCode: "",
                  DestinationOrOriginTerminalCode: "",
                  PlannedQuantity:
                    element.Quantity === null
                      ? "0 " + element.QuantityUOM
                      : element.Quantity.toLocaleString() +
                        " " +
                        element.QuantityUOM,
                  ActualQuantity:
                    element.UnLoadedQuantity === null
                      ? "0 " + element.QuantityUOM
                      : element.UnLoadedQuantity.toLocaleString() +
                        " " +
                        element.UnLoadedQuantityUOM,
                  Status: element.ReceiptCompartmentStatus,
                  UnLoadedQuantity: 0,
                };
                result.EntityResult.ReceiptOriginTerminalCompartmentsInfo.forEach(
                  (element) => {
                    if (
                      element.CompartmentCode ===
                      compartmentInfo.CompartmentCode
                    ) {
                      compartmentInfo.CustomerOrSupplierCode =
                        element.SupplierCode;
                      compartmentInfo.DestinationOrOriginTerminalCode =
                        element.OriginTerminalCode;
                    }
                  }
                );
                otherData.DispatchReceiptInfoForUI.push(compartmentInfo);
              });
              if (
                otherData.Status !== "INTERRUPTED" &&
                otherData.Status !== "PARTIALLY_UNLOADED" &&
                otherData.Status !== "QUEUED"
              ) {
                notification.messageType = "critical";
                notification.messageResultDetails[0].isSuccess = false;
                notification.messageResultDetails[0].errorMessage =
                  "MapTransactions_TransactionNotInValidState";
                this.props.onNotice(notification);
                otherData.IsValidStatus = false;
              } else {
                otherData.IsValidStatus = true;
              }
              this.setState({
                modMapTransactions,
                otherData,
              });
            } else {
              notification.messageType = "critical";
              notification.messageResultDetails[0].isSuccess = false;
              notification.messageResultDetails[0].errorMessage =
                "LocalTransaction_CompartmentPlanNotAvailable";
              this.props.onNotice(notification);
            }
          } else {
            console.log("Error in getRoadReceipt:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting getRoadReceipt:",
            error,
            modMapTransactions.TransactionCode
          );
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on GetRoadReceipt",
        error
      );
    }
  }

  getRailDispatch(modMapTransactions, otherData) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const keyCode = [
        {
          key: KeyCodes.railDispatchCode,
          value: modMapTransactions.TransactionCode,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
        keyDataCode: KeyCodes.railDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetRailDispatch,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {

            this.GetRailDispatchOperations(result.EntityResult.DispatchStatus);

            modMapTransactions.TransLoadSource = null;
            otherData.ScheduledDate = result.EntityResult.ScheduledDate;
            otherData.Status = result.EntityResult.DispatchStatus;
            otherData.DispatchReceiptInfoForUI = [];
            if (
              result.EntityResult.DispatchCompartmentPlanList !== null &&
              result.EntityResult.DispatchCompartmentPlanList.length > 0
            ) {
              let ID = 1;
              result.EntityResult.DispatchCompartmentPlanList.forEach(
                (element) => {
                  const compartmentInfo = {
                    ID: ID++,
                    ShareholderCode: element.ShareholderCode,
                    CarrierCompanyCode: element.CarrierCompanyCode,
                    TrailerCode: element.TrailerCode,
                    CompartmentCode: element.CompartmentCode,
                    CompartmentSeqNoInVehicle: element.SequenceNo,
                    FinishedProductCode: element.FinishedProductCode,
                    CustomerOrSupplierCode: "",
                    DestinationOrOriginTerminalCode: "",
                    PlannedQuantity:
                      element.PlannedQuantity === null ||
                      element.PlanQuantityUOM === null
                        ? ""
                        : element.PlannedQuantity.toLocaleString() +
                          " " +
                          element.PlanQuantityUOM,
                    ActualQuantity:
                      element.LoadedQuantity === null ||
                      element.PlanQuantityUOM === null
                        ? ""
                        : element.LoadedQuantity.toLocaleString() +
                          " " +
                          element.LoadedQuantityUOM,
                    Status: element.DispatchCompartmentStatus,
                  };
                  result.EntityResult.DispatchCompartmentDetailPlanList.forEach(
                    (element) => {
                      if (
                        element.CompartmentCode ===
                        compartmentInfo.CompartmentCode
                      ) {
                        compartmentInfo.CustomerOrSupplierCode =
                          element.CustomerCode;
                        compartmentInfo.DestinationOrOriginTerminalCode =
                          element.DestinationCode;
                      }
                    }
                  );
                  otherData.DispatchReceiptInfoForUI.push(compartmentInfo);
                }
              );
              this.setState({
                modMapTransactions,
                otherData,
              });
            } else {
              notification.messageType = "critical";
              notification.messageResultDetails[0].isSuccess = false;
              notification.messageResultDetails[0].errorMessage =
                "MapTransactions_WagonPlanningInDispatchNotAvailable";
              this.props.onNotice(notification);
            }
          } else {
            console.log("Error in getRailDispatch:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting getRailDispatch:",
            error,
            modMapTransactions.TransactionCode
          );
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getRailDispatch",
        error
      );
    }
  }

  getRailReceipt(modMapTransactions, otherData) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const keyCode = [
        {
          key: KeyCodes.railReceiptCode,
          value: modMapTransactions.TransactionCode,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
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
          const result = response.data;
          if (result.IsSuccess === true) {
            this.GetRailReceiptOperations(result.EntityResult.ReceiptStatus);
            modMapTransactions.TransLoadSource = null;
            otherData.ScheduledDate = result.EntityResult.ScheduledDate;
            otherData.Status = result.EntityResult.ReceiptStatus;
            otherData.DispatchReceiptInfoForUI = [];
            if (
              result.EntityResult.RailMarineReceiptCompartmentPlanList !==
                null &&
              result.EntityResult.RailMarineReceiptCompartmentPlanList.length >
                0
            ) {
              result.EntityResult.RailMarineReceiptCompartmentPlanList.forEach(
                (element) => {
                  const compartmentInfo = {
                    ID: "",
                    ShareholderCode: element.ShareholderCode,
                    CarrierCompanyCode: element.CarrierCompanyCode,
                    TrailerCode: element.TrailerCode,
                    CompartmentCode: element.CompartmentCode,
                    CompartmentSeqNoInVehicle: element.SequenceNo,
                    FinishedProductCode: element.FinishedProductCode,
                    CustomerOrSupplierCode: "",
                    DestinationOrOriginTerminalCode: "",
                    PlannedQuantity:
                      element.PlannedQuantity === null ||
                      element.PlanQuantityUOM === null
                        ? ""
                        : element.PlannedQuantity.toLocaleString() +
                          " " +
                          element.PlanQuantityUOM,
                    ActualQuantity:
                      element.UnloadedQuantity === null ||
                      element.UnloadedQuantityUOM === null
                        ? ""
                        : element.UnloadedQuantity.toLocaleString() +
                          " " +
                          element.UnloadedQuantityUOM,
                    Status: element.ReceiptCompartmentStatus,
                  };
                  result.EntityResult.RailMarineReceiptCompartmentDetailPlanList.forEach(
                    (element) => {
                      if (
                        element.CompartmentCode ===
                        compartmentInfo.CompartmentCode
                      ) {
                        compartmentInfo.CustomerOrSupplierCode =
                          element.SupplierCode;
                        compartmentInfo.DestinationOrOriginTerminalCode =
                          element.OriginTerminalCode;
                      }
                    }
                  );
                  otherData.DispatchReceiptInfoForUI.push(compartmentInfo);
                }
              );
              this.setState({
                modMapTransactions,
                otherData,
              });
            } else {
              notification.messageType = "critical";
              notification.messageResultDetails[0].isSuccess = false;
              notification.messageResultDetails[0].errorMessage =
                "MapTransactions_WagonPlanningInDispatchNotAvailable";
              this.props.onNotice(notification);
            }
          } else {
            console.log("Error in getRailReceipt:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting getRailReceipt:",
            error,
            modMapTransactions.TransactionCode
          );
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getRailReceipt",
        error
      );
    }
  }

  handleShipmentReceiptClose()
  {
    try {
      if(this.props.transportationType==="ROAD")
      {
      if(this.state.modMapTransactions.TransactionType==="SHIPMENT" || this.state.modMapTransactions.TransactionType==="DISPATCH")
      {
        this.handleTruckShipmentClose();
      }
      else
      {
        this.handleTruckReceiptClose();
      }
    }
    else
    if(this.props.transportationType==="MARINE")
      {
      if(this.state.modMapTransactions.TransactionType==="SHIPMENT" || this.state.modMapTransactions.TransactionType==="DISPATCH")
      {
        this.handleMarineShipmentClose();
      }
      else
      {
        this.handleMarineReceiptClose();
      }
    }
    if(this.props.transportationType==="RAIL")
      {
      if(this.state.modMapTransactions.TransactionType==="SHIPMENT" || this.state.modMapTransactions.TransactionType==="DISPATCH")
      {
        this.handleRailShipmentClose();
      }
      else
      {
        this.handleRailReceiptClose();
      }
    }
    }
    catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on handleShipmentReceiptClose",
        error
      );
    }
  }


  handleTruckShipmentClose() {
    try {
      let notification = {
        messageType: "critical",
        message: "ViewAllShipment_ShipmentClose",
        messageResultDetails: [
          {
            keyFields: [this.state.keyField],
            keyValues: [this.state.modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      let entity = this.formCloseShipmentRequest();
      var keyCode = [
        {
          key: KeyCodes.shareholderCode,
          value: this.state.selectedShareholder,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.modMapTransactions.TransactionCode,
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
            const otherData = lodash.cloneDeep(this.state.otherData);
            otherData.Status=Constants.Shipment_Status.CLOSED ;
            this.setState({
              isPrintEnabled:true,otherData:otherData,})
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
          console.log("Error while shipment close:", error);
        });
    } catch (error) {
      console.log("Error while closing the shipment:", error);
    }
  }

  handleTruckReceiptClose() {
    try {
      let notification = {
        messageType: "critical",
        message: "ViewReceipt_CloseSuccess",
        messageResultDetails: [
          {
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.modMapTransactions.TransactionCode],
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
          value: this.state.otherData.Status,
        },
        {
          key: KeyCodes.receiptCode,
          value: this.state.modMapTransactions.TransactionCode,
        },
        {
          key: KeyCodes.driverCode,
          value: this.state.otherData.DriverCoderiverCode,
        },
        {
          key: KeyCodes.forceClosureReason,
          value: this.state.reasonForClosure
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.receiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.ReceiptClose,
        Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            const otherData = lodash.cloneDeep(this.state.otherData);
            otherData.Status=Constants.Shipment_Status.CLOSED ;
            this.setState({
              isPrintEnabled:true,otherData:otherData,})
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
          console.log("Error while shipment close:", error);
        });
    } catch (error) {
      console.log("Error while closing the shipment:", error);
    }
  }

  handleMarineShipmentClose() {
    try {
 
      var keyCode = [
        {
          key: KeyCodes.marineDispatchCode,
          value: this.state.modMapTransactions.TransactionCode,
        },
        {
          key: KeyCodes.marineDispatchReason,
          value: this.state.reasonForClosure,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.marineDispatchCode,
        KeyCodes: keyCode,
      };
      var notification = {
        messageType: "critical",
        message: "ViewMarineDispatch_CloseShipment_status",
        messageResultDetails: [
          {
            keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.MarineDispatchCloseShipment,
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
            const otherData = lodash.cloneDeep(this.state.otherData);
            otherData.Status=Constants.Shipment_Status.CLOSED ;
            this.setState({
              isPrintEnabled:true,otherData:otherData,})
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
          console.log("Error while Marine shipment close:", error);
        });
    } catch (error) {
      console.log("Error while closing the Marine shipment:", error);
    }
  }

  handleMarineReceiptClose() {
    try {
 
      var keyCode = [
        {
          key: KeyCodes.marineReceiptCode,
          value: this.state.modMapTransactions.TransactionCode,
        },
        {
          key: KeyCodes.marineReason,
          value: this.state.reasonForClosure,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.marineReceiptCode,
        KeyCodes: keyCode,
      };
       
      var notification = {
        messageType: "success",
        message: "ViewMarineReceipt_CloseReceipt_status",
        messageResultDetails: [
          {
            keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
            keyValues: [this.state.modMapTransactions.TransactionCode],
            isSuccess: true,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.MarineReceiptCloseReceipt,
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
            const otherData = lodash.cloneDeep(this.state.otherData);
            otherData.Status=Constants.Shipment_Status.CLOSED ;
            this.setState({
              isPrintEnabled:true,otherData:otherData,})
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
          console.log("Error while Marine Receipt close:", error);
        });
    } catch (error) {
      console.log("Error while closing the Marine Receipt:", error);
    }
  }

  handleRailShipmentClose() {
    try {
 
      
      const obj = {
        ShareHolderCode: this.props.selectedShareholder,
        KeyCodes: [
          {
            key: "RailDispatchCode",
            value: this.state.modMapTransactions.TransactionCode,
          },
        ],
        Entity: {
          Reason: this.state.reasonForClosure,
          DispatchCode: this.state.modMapTransactions.TransactionCode,
          DispatchStatus: this.state.otherData.Status,
        },
      };

      const notification = {
        messageType: "critical",
        message: "ViewRailDispatch_CloseDispatch_status",
        messageResultDetails: [
          {
            keyFields: ["RailDispatchPlanDetail_DispatchCode"],
            keyValues: [this.state.modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.ForceCloseRailDispatch,
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
            const otherData = lodash.cloneDeep(this.state.otherData);
            otherData.Status=Constants.Shipment_Status.CLOSED ;
            this.setState({
              isPrintEnabled:true,otherData:otherData,})
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
          console.log("Error while Rail shipment close:", error);
        });
    } catch (error) {
      console.log("Error while closing the Rail shipment:", error);
    }
  }

  handleRailReceiptClose() {
    try {
 
      let keyCode = [
        {
          key: KeyCodes.railReceiptCode,
          value: this.state.modMapTransactions.TransactionCode,
        },
      ];

      let entity = {
        Reason: this.state.reasonForClosure,
        ReceiptCode: this.state.modMapTransactions.TransactionCode,
        ReceiptStatus: this.state.otherData.Status,
      };
      const obj = {
        ShareHolderCode: this.props.selectedShareholder,
        KeyCodes: keyCode,
        Entity: entity,
      };
      var notification = {
        messageType: "success",
        message: "ViewRailReceipt_CloseReceipt_status",
        messageResultDetails: [
          {
            keyFields: ["Receipt_Code"],
            keyValues: [this.state.modMapTransactions.TransactionCode],
            isSuccess: true,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.ForceCloseRailReceipt,
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
            const otherData = lodash.cloneDeep(this.state.otherData);
            otherData.Status=Constants.Shipment_Status.CLOSED ;
            this.setState({
              isPrintEnabled:true,otherData:otherData,})
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
          console.log("Error while Rail Receipt close:", error);
        });
    } catch (error) {
      console.log("Error while closing the Rail Receipt:", error);
    }
  }

  formCloseShipmentRequest() {
    try {
      //let loadingDetails = lodash.cloneDeep(this.state.staticLoadingDetails)
      let ViewAllTruckShipmentLoadingDetails = {
        topUpDecantApprovalStatus: "",
        topUpDecantEnabled: "",
        Remarks: "",
        listShipmentCompartmentInfo: [],
        listShipmentLoadingCompData: [],
      };
       
      ViewAllTruckShipmentLoadingDetails.Remarks = this.state.reasonForClosure;

      return ViewAllTruckShipmentLoadingDetails;
    } catch (error) {
      console.log(
        "Error while forming request for closing the shipment:",
        error
      );
    }
  }

  getMarineDispatch(modMapTransactions, otherData) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const keyCode = [
        {
          key: KeyCodes.marineDispatchCode,
          value: modMapTransactions.TransactionCode,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
        keyDataCode: KeyCodes.marineDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetMarineDispatch,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            this.getMarineShipmentStatusOperations(result.EntityResult.DispatchStatus);
            notification.messageType = result.IsSuccess ? "success" : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            modMapTransactions.TransLoadSource = null;
            otherData.ScheduledDate = result.EntityResult.ScheduledDate;
            otherData.Status = result.EntityResult.DispatchStatus;
            otherData.VehicleCode=  result.EntityResult.VesselCode;
            otherData.DispatchReceiptInfoForUI = [];
            if (
              result.EntityResult.DispatchCompartmentPlanList !== null &&
              result.EntityResult.DispatchCompartmentPlanList.length > 0
            ) {
              let ID = 1;
              result.EntityResult.DispatchCompartmentPlanList.forEach(
                (element) => {
                  const compartmentInfo = {
                    ID: ID++,
                    ShareholderCode: element.ShareholderCode,
                    CarrierCompanyCode: element.CarrierCompanyCode,
                    TrailerCode: element.TrailerCode,
                    CompartmentCode: element.CompartmentCode,
                    CompartmentSeqNoInVehicle: element.CompartmentSeqNoInVehicle,
                    FinishedProductCode: element.FinishedProductCode,
                    CustomerOrSupplierCode: "",
                    DestinationOrOriginTerminalCode: "",
                    PlannedQuantity:
                      element.PlannedQuantity === null ||
                      element.PlanQuantityUOM === null
                        ? ""
                        : element.PlannedQuantity.toLocaleString() +
                          " " +
                          element.PlanQuantityUOM,
                    ActualQuantity:
                      element.LoadedQuantity === null ||
                      element.PlanQuantityUOM === null
                        ? ""
                        : element.LoadedQuantity.toLocaleString() +
                          " " +
                          element.LoadedQuantityUOM,
                    Status: element.DispatchCompartmentStatus,
                  };
                  result.EntityResult.DispatchCompartmentDetailPlanList.forEach(
                    (element) => {
                      if (
                        element.CompartmentCode ===
                        compartmentInfo.CompartmentCode
                      ) {
                        compartmentInfo.CustomerOrSupplierCode =
                          element.CustomerCode;
                        compartmentInfo.DestinationOrOriginTerminalCode =
                          element.DestinationCode;
                      }
                    }
                  );
                  otherData.DispatchReceiptInfoForUI.push(compartmentInfo);
                }
              );
              if (
                otherData.Status !== "INTERRUPTED" &&
                otherData.Status !== "PARTIALLY_LOADED" &&
                otherData.Status !== "QUEUED"
              ) {
                notification.messageType = "critical";
                notification.messageResultDetails[0].isSuccess = false;
                notification.messageResultDetails[0].errorMessage =
                  "MapTransactions_TransactionNotInValidState";
                this.props.onNotice(notification);
                otherData.IsValidStatus = false;
              } else {
                otherData.IsValidStatus = true;
              }
              this.setState({
                modMapTransactions,
                otherData,
              });
            } else {
              notification.messageType = "critical";
              notification.messageResultDetails[0].isSuccess = false;
              notification.messageResultDetails[0].errorMessage =
                "MapTransactions_WagonPlanningInDispatchNotAvailable";
              this.props.onNotice(notification);
            }
          } else {
            console.log("Error in getMarineDispatch:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting getMarineDispatch:",
            error,
            modMapTransactions.TransactionCode
          );
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getMarineDispatch",
        error
      );
    }
  }

  getMarineReceipt(modMapTransactions, otherData) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const keyCode = [
        {
          key: KeyCodes.marineReceiptCode,
          value: modMapTransactions.TransactionCode,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
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
          const result = response.data;
          if (result.IsSuccess === true) {
            this.getMarineReceiptStatusOperations(result.EntityResult.ReceiptStatus);
            modMapTransactions.TransLoadSource = null;
            otherData.ScheduledDate = result.EntityResult.ScheduledDate;
            otherData.Status = result.EntityResult.ReceiptStatus;
            otherData.VehicleCode=  result.EntityResult.VesselCode;
            otherData.DispatchReceiptInfoForUI = [];
            if (
              result.EntityResult.RailMarineReceiptCompartmentPlanList !==
                null &&
              result.EntityResult.RailMarineReceiptCompartmentPlanList.length >
                0
            ) {
              result.EntityResult.RailMarineReceiptCompartmentPlanList.forEach(
                (element) => {
                  const compartmentInfo = {
                    ID: "",
                    ShareholderCode: element.ShareholderCode,
                    CarrierCompanyCode: element.CarrierCompanyCode,
                    TrailerCode: element.TrailerCode,
                    CompartmentCode: element.CompartmentCode,
                    CompartmentSeqNoInVehicle: element.CompartmentSeqNoInVehicle,
                    FinishedProductCode: element.FinishedProductCode,
                    CustomerOrSupplierCode: "",
                    DestinationOrOriginTerminalCode: "",
                    PlannedQuantity:
                      element.PlannedQuantity === null ||
                      element.PlanQuantityUOM === null
                        ? ""
                        : element.PlannedQuantity.toLocaleString() +
                          " " +
                          element.PlanQuantityUOM,
                    ActualQuantity:
                      element.UnloadedQuantity === null ||
                      element.UnloadedQuantityUOM === null
                        ? ""
                        : element.UnloadedQuantity.toLocaleString() +
                          " " +
                          element.UnloadedQuantityUOM,
                    Status: element.ReceiptCompartmentStatus,
                  };
                  result.EntityResult.RailMarineReceiptCompartmentDetailPlanList.forEach(
                    (element) => {
                      if (
                        element.CompartmentCode ===
                        compartmentInfo.CompartmentCode
                      ) {
                        compartmentInfo.CustomerOrSupplierCode =
                          element.SupplierCode;
                        compartmentInfo.DestinationOrOriginTerminalCode =
                          element.OriginTerminalCode;
                      }
                    }
                  );
                  otherData.DispatchReceiptInfoForUI.push(compartmentInfo);
                }
              );
              if (
                otherData.Status !== "INTERRUPTED" &&
                otherData.Status !== "PARTIALLY_UNLOADED" &&
                otherData.Status !== "QUEUED"
              ) {
                notification.messageType = "critical";
                notification.messageResultDetails[0].isSuccess = false;
                notification.messageResultDetails[0].errorMessage =
                  "MapTransactions_TransactionNotInValidState";
                this.props.onNotice(notification);
                otherData.IsValidStatus = false;
              } else {
                otherData.IsValidStatus = true;
              }
              
              this.setState({
                modMapTransactions,
                otherData,
              });
            } else {
              notification.messageType = "critical";
              notification.messageResultDetails[0].isSuccess = false;
              notification.messageResultDetails[0].errorMessage =
                "MapTransactions_WagonPlanningInDispatchNotAvailable";
              this.props.onNotice(notification);
            }
          } else {
            console.log("Error in getMarineReceipt:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting getMarineReceipt:",
            error,
            modMapTransactions.TransactionCode
          );
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getMarineReceipt",
        error
      );
    }
  }

  getLocalTransactions(otherData, compartmentStatus) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [this.state.modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const obj = {
        TransactionType: this.state.modMapTransactions.TransactionType,
        TransportationType: this.props.transportationType,
        ProductCode: otherData.ProductCode,
        ShareholderCode: this.state.modMapTransactions.ShareholderCode,
        LocationCode: "",
        DispatchReceiptStatus: otherData.Status,
        CompartmentStatus: compartmentStatus,
      };

      axios(
        RestAPIs.GetLocalTransactions,
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
            otherData.LocalTranInfoForUI = result.EntityResult.Table;
            this.setState({ otherData });
            if (result.EntityResult.Table.length === 0) {
              notification.messageType = "critical";
              notification.messageResultDetails[0].isSuccess = false;
              notification.messageResultDetails[0].errorMessage =
                "MapTransactions_NoLocalTransactions";
              this.props.onNotice(notification);
            }
          } else {
            otherData.LocalTranInfoForUI = [];
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({ otherData });
            this.props.onNotice(notification);
            console.log("Error in getLocalTransactions:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while get LocalTransactions:", error);
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getLocalTransactions",
        error
      );
    }
  }

  getBatchDetails(transaction) {
    try {
      const modMapTransactions = lodash.cloneDeep(
        this.state.modMapTransactions
      );
      const otherData = lodash.cloneDeep(this.state.otherData);
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: transaction.BCUCode,
        },
        {
          key: KeyCodes.TransactionNumber,
          value: transaction.TransactionID,
        },
        {
          key: KeyCodes.BatchNumber,
          value: transaction.BatchID,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetBatchDetails,
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
            // if (
            //   modMapTransactions.TransportationType ===
            //   Constants.TransportationType.RAIL
            // ) {
            //   modMapTransactions.LoadingDetails = result.EntityResult;
            // } else {
            //   modMapTransactions.LoadingDetails = result.EntityResult;
            // }
            modMapTransactions.LoadingDetails = result.EntityResult;
            otherData.BatchInfoForUI = this.getBatchDetailsForUI(
              result.EntityResult
            );
            this.setState({ modMapTransactions, otherData });
          } else {
            otherData.BatchInfoForUI = [];
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({ modMapTransactions, otherData });
            this.props.onNotice(notification);
            console.log("Error in GetLocalTransactions:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting GetLocalTransactions:", error);
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getBatchDetails",
        error
      );
    }
  }

  getBatchDetailsForUI(loadingInfoList) {
    let detailList = [];
    try {
      let recordID = 1;
      loadingInfoList.forEach((loadingInfo) => {
        detailList.push(
          this.getBatchInfoFromLoadingDetails(
            loadingInfo.LoadingDetailFPinfo,
            0 /*ProductTypeForUI.FinishedProduct*/,
            recordID++
          )
        );
        if (
          loadingInfo.ArrLoadingDetailBP !== null &&
          loadingInfo.ArrLoadingDetailBP !== undefined &&
          Array.isArray(loadingInfo.ArrLoadingDetailBP)
        ) {
          loadingInfo.ArrLoadingDetailBP.forEach((baseProductInfo) => {
            detailList.push(
              this.getBatchInfoFromLoadingDetails(
                baseProductInfo,
                1 /*ProductTypeForUI.BaseProduct*/,
                recordID++
              )
            );
          });
        }
        if (
          loadingInfo.ArrLoadingDetailAdditive !== null &&
          loadingInfo.ArrLoadingDetailAdditive !== undefined &&
          Array.isArray(loadingInfo.ArrLoadingDetailAdditive)
        ) {
          loadingInfo.ArrLoadingDetailAdditive.forEach((additiveInfo) => {
            detailList.push(
              this.getBatchInfoFromLoadingDetails(
                additiveInfo,
                2 /*ProductTypeForUI.Additive*/,
                recordID++
              )
            );
          });
        }
      });
    } catch (error) {
      console.log("Error while getting GetBatchDetailsForUI:", error);
    }
    return detailList;
  }

  getBatchInfoFromLoadingDetails(loading, productType, recordID) {
    const batchInfo = {
      ID: recordID,
      ProductCode: "",
      ProductType: "",
      TankCode: "",
      MeterCode: loading.MeterCode,
      GrossQuantity:
        loading.GrossQuantity === null
          ? "0 " + loading.QuantityUOM
          : loading.GrossQuantity.toLocaleString() + " " + loading.QuantityUOM,
      NetQuantity:
        loading.NetQuantity === null
          ? "0 " + loading.QuantityUOM
          : loading.NetQuantity.toLocaleString() + " " + loading.QuantityUOM,
      StartTotalizer:
        loading.StartTotalizer === null
          ? ""
          : loading.StartTotalizer.toLocaleString(),
      EndTotalizer:
        loading.EndTotalizer === null
          ? ""
          : loading.EndTotalizer.toLocaleString(),
      Density:
        loading.ProductDensity === null
          ? ""
          : loading.ProductDensity.toLocaleString() +
            " " +
            loading.ProductDensityUOM,
      Pressure:
        loading.Pressure === null
          ? ""
          : loading.Pressure.toLocaleString() + " " + loading.PressureUOM,
      Temperature:
        loading.Temperature === null
          ? ""
          : loading.Temperature.toLocaleString() + " " + loading.TemperatureUOM,
      StartTime: loading.StartTime,
      EndTime: loading.EndTime,
    };
    switch (productType) {
      case 0: //ProductTypeForUI.FinishedProduct:
        batchInfo.ProductCode = loading.FinishedProductCode;
        batchInfo.ProductType = "RailDispatchManualEntry_FinishedProduct";
        break;

      case 1: //ProductTypeForUI.BaseProduct:
        batchInfo.ProductCode = loading.BaseProductCode;
        batchInfo.ProductType = "Report_BaseProduct";
        break;

      case 2: //ProductTypeForUI.Additive:
        batchInfo.ProductCode = loading.AdditiveProductCode;
        batchInfo.ProductType = "ViewShipment_Additive";
        break;

      default:
        break;
    }
    return batchInfo;
  }

  getBCUDeviceDetails(deviceCode) {
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
          const modMapTransactions = lodash.cloneDeep(
            this.state.modMapTransactions
          );
          if (result.EntityResult.IsTransloading === true) {
            modMapTransactions.TransLoadBcu = true;
            this.getReceiptCodes(modMapTransactions);
          } else {
            modMapTransactions.TransLoadBcu = false;
          }
          this.setState({ modMapTransactions });
        }
      });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsComposite: Error while getting getBCUDeviceDetails",
        error
      );
    }
  }

  getReceiptCodes(mapTransactions) {
    try {
      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [mapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      const obj = {
        TransportationType: this.props.transportationType,
        TransactionType: "RECEIPT",
        ShareholderCode: mapTransactions.ShareholderCode,
      };
      axios(
        RestAPIs.GetDispatchOrReceiptCodes,
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
            if (result.EntityResult === null) {
              console.log("Error in getReceiptCodes:", result.ErrorList);
            } else if (Array.isArray(result.EntityResult.Table)) {
              const receiptCodeOptions = [];
              result.EntityResult.Table.forEach((item) => {
                receiptCodeOptions.push({
                  text: item.Code,
                  value: item.Code,
                });
              });
              let receiptCodeSearchOptions =
                lodash.cloneDeep(receiptCodeOptions);
              if (receiptCodeOptions.length > Constants.filteredOptionsCount) {
                receiptCodeSearchOptions = receiptCodeSearchOptions.slice(
                  0,
                  Constants.filteredOptionsCount
                );
              }
              this.setState({
                receiptCodeOptions,
                receiptCodeSearchOptions,
              });
            }
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in getReceiptCodes:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting getReceiptCodes:", error);
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getReceiptCodes",
        error
      );
    }
  }

  handleReceiptCodeSearchChange = (receiptCode) => {
    try {
      let receiptCodeSearchOptions = this.state.receiptCodeOptions.filter(
        (item) => item.value.toLowerCase().includes(receiptCode.toLowerCase())
      );

      if (receiptCodeSearchOptions.length > Constants.filteredOptionsCount) {
        receiptCodeSearchOptions = receiptCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        receiptCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "MapTransactionDetailComposite: Error occurred on handleReceiptCodeSearchChange",
        error
      );
    }
  };

  getReceiptCodeSearchOptions() {
    let receiptCodeSearchOptions = lodash.cloneDeep(
      this.state.receiptCodeSearchOptions
    );
    let modReceiptCode = this.state.modMapTransactions.EntityCode;
    if (
      modReceiptCode !== null &&
      modReceiptCode !== "" &&
      modReceiptCode !== undefined
    ) {
      let selectedReceiptCode = receiptCodeSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modReceiptCode.toLowerCase()
      );
      if (selectedReceiptCode === undefined) {
        receiptCodeSearchOptions.push({
          text: modReceiptCode,
          value: modReceiptCode,
        });
      }
    }
    return receiptCodeSearchOptions;
  }

  getWagonCodes(modMapTransactions) {
    try {
      const keyCode = [
        {
          key: KeyCodes.railReceiptCode,
          value: modMapTransactions.EntityCode,
        },
      ];
      const obj = {
        ShareHolderCode: modMapTransactions.ShareholderCode,
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
          const result = response.data;
          if (result.IsSuccess === true) {
            const wagonCodeList = [];
            if (
              Array.isArray(
                result.EntityResult.RailMarineReceiptCompartmentPlanList
              )
            ) {
              for (let item of result.EntityResult
                .RailMarineReceiptCompartmentPlanList) {
                if (!wagonCodeList.includes(item.TrailerCode)) {
                  wagonCodeList.push(item.TrailerCode);
                }
              }
            }
            this.setState({
              railWagonCodeOptions:
                Utilities.transferListtoOptions(wagonCodeList),
            });
          } else {
            console.log("Error in getRailReceipt:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting getRailReceipt:",
            error,
            modMapTransactions.TransactionCode
          );
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on getWagonCodes",
        error
      );
    }
  }

  handleGetTanksForMeter = (meterCode) => {
    try {
      if (meterCode === this.state.latestMeterCode) {
        return;
      } else {
        this.setState({ latestMeterCode: meterCode });
      }
      axios(
        RestAPIs.GetTanksForMeter + "?meterCode=" + meterCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (Array.isArray(result.EntityResult)) {
              this.setState({
                tankCodeOptions: Utilities.transferListtoOptions(
                  result.EntityResult
                ),
              });
            }
          }
        })
        .catch((error) => {
          console.log("Error while getting TanksForMeter:", error);
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on TanksForMeter",
        error
      );
    }
  };

  onTransactionCodeClear = (data) => {
    const modMapTransactions = lodash.cloneDeep(this.state.modMapTransactions);
    modMapTransactions.TransactionCode = "";
    this.setState({ modMapTransactions, isReadyToRender: true });
  };

  handleComRowSelectionChange = (selection) => {
    try {
      if (this.state.otherData.IsValidStatus !== true) {
        return;
      }
      const row = selection[0];
      const modMapTransactions = lodash.cloneDeep(
        this.state.modMapTransactions
      );
      const otherData = lodash.cloneDeep(this.state.otherData);
      if (row !== undefined) {
        otherData.ProductCode = row.FinishedProductCode;
        this.getLocalTransactions(otherData, row.Status);
      } else {
        otherData.LocalTranInfoForUI = [];
        otherData.BatchInfoForUI = [];
        modMapTransactions.LoadingDetails = [];
        modMapTransactions.RailMarineTransactions = [];
        modMapTransactions.TransLoadBcu = false;
      }
      this.setState({
        modMapTransactions,
        otherData,
        selectLocalTransactionRow: [],
        selectedCompRow: selection,
      });
    } catch (error) {
      console.log(
        "MapTransactionDetailComposite: Error occurred on handleComRowSelectionChange",
        error
      );
    }
  };

  handleComRowClick = (row) => {
    try {
      if (this.state.otherData.IsValidStatus !== true) {
        return;
      }
      const otherData = lodash.cloneDeep(this.state.otherData);
      otherData.ProductCode = row.FinishedProductCode;
      this.setState({
        selectedCompRow: [row],
        otherData,
      });
      this.getLocalTransactions(otherData, row.Status);
    } catch (error) {
      console.log(
        "MapTransactionDetailComposite: Error occurred on handleComRowClick",
        error
      );
    }
  };

  handleLocalTranRowSelectionChange = (selection) => {
    try {
      const row = selection[0];
      const modMapTransactions = lodash.cloneDeep(
        this.state.modMapTransactions
      );
      const otherData = lodash.cloneDeep(this.state.otherData);
      if (row !== undefined) {
        this.getBCUDeviceDetails(row.BCUCode);
        this.getBatchDetails(row);
      } else {
        otherData.BatchInfoForUI = [];
        modMapTransactions.LoadingDetails = [];
        modMapTransactions.RailMarineTransactions = [];
        modMapTransactions.TransLoadBcu = false;
      }
      this.setState({
        modMapTransactions,
        otherData,
        selectLocalTransactionRow: selection,
      });
    } catch (error) {
      console.log(
        "MapTransactionDetailComposite: Error occurred on handleLocalTranRowSelectionChange",
        error
      );
    }
  };

  handleLocalTranRowClick = (row) => {
    try {
      this.getBCUDeviceDetails(row.BCUCode);
      this.getBatchDetails(row);
      this.setState({
        selectLocalTransactionRow: [row],
      });
    } catch (error) {
      console.log(
        "MapTransactionDetailComposite: Error occurred on handleLocalTranRowClick",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    try {
      if (
        propertyName === "TransactionType" &&
        (data === "DISPATCH" || data === "SHIPMENT")
      ) {
        
        var closeRailShipment="ViewShipment_CloseShipment";
        
        if(data === "DISPATCH")
        {
        closeRailShipment="ViewRailDispatchList_CloseRailShipment";
        }
        this.setState({
          closeRailShipment: closeRailShipment,
          printBOL: "ViewRailDispatchList_PrintBOL",
          isCloseEnabled: false,isPrintEnabled:false
        });
      } else if (propertyName === "TransactionType" && data === "RECEIPT") {
        this.setState({
          closeRailShipment: "ViewMarineReceiptList_CloseReceipt",
          printBOL: "ViewRailReceipt_PrintBOD",
          isCloseEnabled: false,isPrintEnabled:false
        });
      }

      const modMapTransactions = lodash.cloneDeep(
        this.state.modMapTransactions
      );
      const otherData = lodash.cloneDeep(this.state.otherData);
      modMapTransactions[propertyName] = data;

      if (
        (propertyName === "TransactionType" ||
          propertyName === "ShareholderCode") &&
        modMapTransactions.TransportationType !== "" &&
        modMapTransactions.TransactionType !== "" &&
        modMapTransactions.ShareholderCode !== ""
      ) {
        this.getTransactionCodes(modMapTransactions);
        modMapTransactions.TransactionCode = "";
        otherData.ScheduledDate = "";
        otherData.Status = "";
        otherData.DriverCode = "";
        otherData.VehicleCode = "";
      }

      if (propertyName === "TransactionCode")
      this.setState({isCloseEnabled: false,isPrintEnabled:false,launchPopup:false});

      if (propertyName === "TransactionCode" && data !== null && data !== "") {
        if (
          modMapTransactions.TransportationType ===
          Constants.TransportationType.ROAD
        ) {
          if (
            modMapTransactions.TransactionType === "DISPATCH" ||
            modMapTransactions.TransactionType === "SHIPMENT"
          ) {
            this.getRoadDispatch(modMapTransactions, otherData);
          } else if (modMapTransactions.TransactionType === "RECEIPT") {
            this.getRoadReceipt(modMapTransactions, otherData);
          }
        } else if (
          modMapTransactions.TransportationType ===
          Constants.TransportationType.RAIL
        ) {
          if (modMapTransactions.TransactionType === "DISPATCH") {
            this.getRailDispatch(modMapTransactions, otherData);
          } else if (modMapTransactions.TransactionType === "RECEIPT") {
            this.getRailReceipt(modMapTransactions, otherData);
          }
        }
        else if (
          modMapTransactions.TransportationType ===
          Constants.TransportationType.MARINE
        ) {
          if (modMapTransactions.TransactionType === "DISPATCH") {
            this.getMarineDispatch(modMapTransactions, otherData);
          } else if (modMapTransactions.TransactionType === "RECEIPT") {
            this.getMarineReceipt(modMapTransactions, otherData);
          }
        }
      } else {
        modMapTransactions.TransactionCode = "";
        otherData.ScheduledDate = "";
        otherData.Status = "";
        otherData.DriverCode = "";
        otherData.VehicleCode = "";
      }

      if (propertyName === "WagonCode") {
        this.getWagonCodes(modMapTransactions);
      }

      otherData.LocalTranInfoForUI = [];
      otherData.BatchInfoForUI = [];
      otherData.DispatchReceiptInfoForUI = [];
      modMapTransactions.LoadingDetails = [];
      modMapTransactions.RailMarineTransactions = [];
      modMapTransactions.BatchDetailsList = [];
      this.setState({
        modMapTransactions,
        otherData,
        selectLocalTransactionRow: [],
        selectedCompRow: [],
      });
    } catch (error) {
      console.log(
        "MapTransactionDetailComposite: Error occurred on handleChange",
        error
      );
    }
  };

  GetRailDispatchOperations(transactionStatus) {
    try {
      
      const obj = {
        ShareHolderCode: this.props.selectedShareholder,
        KeyCodes: [
          {
            key: "RailDispatchStatus",
            value: transactionStatus,
          },
          {
            key: "DispatchCode",
            value: this.state.modMapTransactions.TransactionCode,
          },
        ],
      };
      axios(
        RestAPIs.GetRailDispatchOperations,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
      .then((response) => {
        var result = response.data;
       var isCloseEnabled= false;
       var isPrintEnabled= false;

        if(result.EntityResult!==null)
        {
          if(result.EntityResult["ViewRailDispatch_CloseDispatch"]===true)
          {
            isCloseEnabled= true;
          }

          if(result.EntityResult["ViewRailDispatch_PrintBOL"]===true)
          {
            isPrintEnabled= true;
          }
        }
          
        this.setState({ isCloseEnabled: isCloseEnabled,isPrintEnabled:isPrintEnabled, });
      })
        .catch((error) => {
          console.log("Error while getting getRailReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  GetRailReceiptOperations(transactionStatus) {
    try {
      
      var obj = {
        Reason: this.state.reasonForClosure,
        ReceiptCode: this.state.modMapTransactions.TransactionCode,
        ReceiptStatus: transactionStatus,
      };
      axios(
        RestAPIs.GetRailReceiptOperations,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
      .then((response) => {
        var result = response.data;
       var isCloseEnabled= false;
       var isPrintEnabled= false;

        if(result.EntityResult!==null)
        {
          if(result.EntityResult["ViewRailReceipt_CloseReceipt"]===true)
          {
            isCloseEnabled= true;
          }

          if(result.EntityResult["ViewRailReceipt_PrintBOD"]===true)
          {
            isPrintEnabled= true;
          }
        }
          
        this.setState({ isCloseEnabled: isCloseEnabled,isPrintEnabled:isPrintEnabled, });
      })
        .catch((error) => {
          console.log("Error while getting getRailReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getMarineReceiptStatusOperations(transactionStatus) {
    try {
      
      axios(
        RestAPIs.GetMarineReceiptOperations +
        "?MarineReceiptStatus=" +
        transactionStatus,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
      .then((response) => {
        var result = response.data;
       var isCloseEnabled= false;
       var isPrintEnabled= false;

        if(result.EntityResult!==null)
        {
          if(result.EntityResult["ViewMarineReceiptList_CloseReceipt"]===true)
          {
            isCloseEnabled= true;
          }

          if(result.EntityResult["ViewMarineReceiptList_PrintBOD"]===true)
          {
            isPrintEnabled= true;
          }
        }
          
        this.setState({ isCloseEnabled: isCloseEnabled,isPrintEnabled:isPrintEnabled, });
      })
        .catch((error) => {
          console.log("Error while getting getMarineShipmentStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getMarineShipmentStatusOperations(transactionStatus) {
    try {
      
      axios(
        RestAPIs.GetMarineDispatchOperations +
        "?DispatchStatus=" +
        transactionStatus,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
      .then((response) => {
        var result = response.data;
       var isCloseEnabled= false;
       var isPrintEnabled= false;

        if(result.EntityResult!==null)
        {
          if(result.EntityResult["ViewMarineShipmentList_CloseMarineShipment"]===true)
          {
            isCloseEnabled= true;
          }

          if(result.EntityResult["ViewMarineShipmentList_PrintBOL"]===true)
          {
            isPrintEnabled= true;
          }
        }
          
        this.setState({ isCloseEnabled: isCloseEnabled,isPrintEnabled:isPrintEnabled, });
      })
        .catch((error) => {
          console.log("Error while getting getMarineReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getReciptsStatusOperations(receiptStatus,isVolumneBased) {
    try {
      
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
        var result = response.data;
       var isCloseEnabled= false;
       var isPrintEnabled= false;

        if(result.EntityResult!==null)
        {
          if(result.EntityResult["ViewReceipt_CloseReceipt"]===true)
          {
            isCloseEnabled= true;
          }

          if(result.EntityResult["ViewReceipt_PrintBOD"]===true)
          {
            isPrintEnabled= true;
          }
        }
          
        this.setState({ isCloseEnabled: isCloseEnabled,isPrintEnabled:isPrintEnabled, });
      })
        .catch((error) => {
          console.log("Error while getting getReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

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
         var isCloseEnabled= false;
         var isPrintEnabled= false;

          if(result.EntityResult!==null)
          {
            if(result.EntityResult["ViewShipment_CloseShipment"]===true)
            {
              isCloseEnabled= true;
            }

            if(result.EntityResult["ViewShipmentStatus_PrintBOL"]===true)
            {
              isPrintEnabled= true;
            }
          }
            
          this.setState({ isCloseEnabled: isCloseEnabled,isPrintEnabled:isPrintEnabled, });
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
  
  handleCellDataEdit = (newVal, cellData) => {
    const otherData = lodash.cloneDeep(this.state.otherData);
    otherData.BatchInfoForUI[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ otherData });
  };

  handleTransactionCodeSearchChange = (transactionCode) => {
    try {
      this.setState({ isCloseEnabled: false,isPrintEnabled:false, launchPopup:false});
      let transactionCodeSearchOptions =
        this.state.transactionCodeOptions.filter((item) =>
          item.value.toLowerCase().includes(transactionCode.toLowerCase())
        );

      if (
        transactionCodeSearchOptions.length > Constants.filteredOptionsCount
      ) {
        transactionCodeSearchOptions = transactionCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        transactionCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "MapTransactionDetailComposite: Error occurred on handleTransactionCodeSearchChange",
        error
      );
    }
  };

  getTransactionCodeSearchOptions() {
    let transactionCodeSearchOptions = lodash.cloneDeep(
      this.state.transactionCodeSearchOptions
    );
    let modTransactionCode = this.state.modMapTransactions.TransactionCode;
    if (
      modTransactionCode !== null &&
      modTransactionCode !== "" &&
      modTransactionCode !== undefined
    ) {
      let selectedTransactionCode = transactionCodeSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modTransactionCode.toLowerCase()
      );
      if (selectedTransactionCode === undefined) {
        transactionCodeSearchOptions.push({
          text: modTransactionCode,
          value: modTransactionCode,
        });
      }
    }
    return transactionCodeSearchOptions;
  }

  

  handlePrint = () => {
    try {
      if(this.props.transportationType==="ROAD")
      {
      if(this.state.modMapTransactions.TransactionType==="SHIPMENT" || this.state.modMapTransactions.TransactionType==="DISPATCH")
      {
        this.handleTruckShipmentPrintBOL();
      }
      else
      {
        this.handleTruckReceiptPrintBOD();
      }
    }
    else if(this.props.transportationType==="MARINE")
      {
      if(this.state.modMapTransactions.TransactionType==="SHIPMENT" || this.state.modMapTransactions.TransactionType==="DISPATCH")
      {
        this.handleMarineShipmentPrintBOL();
      }
      else
      {
        this.handleMarineReceiptPrintBOD();
      }
    }
    else if(this.props.transportationType==="RAIL")
      {
      if(this.state.modMapTransactions.TransactionType==="SHIPMENT" || this.state.modMapTransactions.TransactionType==="DISPATCH")
      {
        this.handleRailShipmentPrintBOL();
      }
      else
      {
        this.handleRailReceiptPrintBOD();
      }
    }
    }
    catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on handlePrint",
        error
      );
    }
  }
  matchMapTransactions = () => {
    try {
      const otherData = lodash.cloneDeep(this.state.otherData);
      const modMapTransactions = lodash.cloneDeep(
        this.state.modMapTransactions
      );
      modMapTransactions.TransportationType = this.props.transportationType;
      modMapTransactions.BatchDetailsList = lodash.cloneDeep(
        this.state.otherData.BatchInfoForUI
      );
      [modMapTransactions.ActualQuantity, modMapTransactions.QuantityUOM] =
        this.state.selectedCompRow[0].ActualQuantity.split(" ");

      modMapTransactions.LoadingDetails[0].CommonInfo.TrailerCode =
        this.state.selectedCompRow[0].TrailerCode;
      modMapTransactions.LoadingDetails[0].CommonInfo.CarrierCode =
        this.state.selectedCompRow[0].CarrierCompanyCode;
      modMapTransactions.LoadingDetails[0].CommonInfo.ShareHolderCode =
        modMapTransactions.ShareholderCode;
      modMapTransactions.LoadingDetails[0].CommonInfo.CompartmentSeqNoInVehicle =
        this.state.selectedCompRow[0].CompartmentSeqNoInVehicle;
      modMapTransactions.LoadingDetails[0].IsLocalLoaded = false;
      modMapTransactions.LoadingDetails[0].CommonInfo.TransactionType =
        modMapTransactions.TransactionType;
      modMapTransactions.LoadingDetails[0].CommonInfo.TransportationType =
        modMapTransactions.TransportationType;
      if (
        modMapTransactions.TransportationType ===
        Constants.TransportationType.ROAD
      ) {
        modMapTransactions.LoadingDetails[0].CommonInfo.VehicleCode =
          otherData.VehicleCode;
      }
      if (modMapTransactions.TransactionType === "DISPATCH") {
        modMapTransactions.LoadingDetails[0].CommonInfo.ShipmentCode =
          modMapTransactions.TransactionCode;
        modMapTransactions.LoadingDetails[0].CommonInfo.ReceiptCode = "";
      } else {
        modMapTransactions.LoadingDetails[0].CommonInfo.ReceiptCode =
          modMapTransactions.TransactionCode;
        modMapTransactions.LoadingDetails[0].CommonInfo.ShipmentCode = "";
      }
      for (let batchDetail of modMapTransactions.BatchDetailsList) {
        if (
          batchDetail.TankCode !== undefined &&
          batchDetail.TankCode !== null &&
          batchDetail.TankCode !== ""
        ) {
          modMapTransactions.LoadingDetails[0].ArrLoadingDetailBP.forEach(
            (bp) => {
              if (bp.BaseProductCode === batchDetail.ProductCode) {
                bp.TankCode = batchDetail.TankCode;
              }
            }
          );
          modMapTransactions.LoadingDetails[0].ArrLoadingDetailAdditive.forEach(
            (adv) => {
              if (adv.AdditiveProductCode === batchDetail.ProductCode) {
                adv.TankCode = batchDetail.TankCode;
              }
            }
          );
        }
      }

      if (
        modMapTransactions.TransportationType ===
        Constants.TransportationType.RAIL
      ) {
        modMapTransactions.RailMarineTransactions =
          this.ConvertLoadingDetailsFromRoadToRail(
            modMapTransactions.LoadingDetails
          );
      }

      if (
        modMapTransactions.TransportationType ===
        Constants.TransportationType.MARINE
      ) {
        modMapTransactions.RailMarineTransactions =
          this.ConvertLoadingDetailsFromRoadToMarine(
            modMapTransactions.LoadingDetails
          );
      }

      modMapTransactions.FinishedProductCode =
        this.state.selectedCompRow[0].FinishedProductCode;
      modMapTransactions.CompartmentCode =
        this.state.selectedCompRow[0].CompartmentCode;
      modMapTransactions.CompartmentSeqNoInVehicle =
        this.state.selectedCompRow[0].CompartmentSeqNoInVehicle;

      modMapTransactions.BcuCode =
        this.state.selectLocalTransactionRow[0].BCUCode;
      modMapTransactions.BatchID =
        this.state.selectLocalTransactionRow[0].BatchID;
      modMapTransactions.TransactionID =
        this.state.selectLocalTransactionRow[0].TransactionID;

      if (!this.validateMatch(modMapTransactions)) {
        return;
      }

      const notification = {
        messageType: "critical",
        message: "LocalTransaction_MatchTransaction",
        messageResultDetails: [
          {
            keyFields: ["Common_TransactionCode"],
            keyValues: [modMapTransactions.TransactionCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.MatchMapTransactions,
        Utilities.getAuthenticationObjectforPost(
          modMapTransactions,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            const otherData = lodash.cloneDeep(this.state.otherData);
            otherData.LocalTranInfoForUI = [];
            otherData.BatchInfoForUI = [];
            this.setState({
              selectedCompRow: [],
              selectLocalTransactionRow: [],
            });
            if (
              modMapTransactions.TransportationType ===
              Constants.TransportationType.ROAD
            ) {
              if (modMapTransactions.TransactionType === "DISPATCH") {
                this.getRoadDispatch(modMapTransactions, otherData);
              } else if (modMapTransactions.TransactionType === "RECEIPT") {
                this.getRoadReceipt(modMapTransactions, otherData);
              }
            } else if (
              modMapTransactions.TransportationType ===
              Constants.TransportationType.RAIL
            ) {
              if (modMapTransactions.TransactionType === "DISPATCH") {
                this.getRailDispatch(modMapTransactions, otherData);
              } else if (modMapTransactions.TransactionType === "RECEIPT") {
                this.getRailReceipt(modMapTransactions, otherData);
              }
            }
            else if (
              modMapTransactions.TransportationType ===
              Constants.TransportationType.MARINE
            ) {
              if (modMapTransactions.TransactionType === "DISPATCH") {
                this.getMarineDispatch(modMapTransactions, otherData);
              } else if (modMapTransactions.TransactionType === "RECEIPT") {
                this.getMarineReceipt(modMapTransactions, otherData);
              }
            }
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in matchMapTransactions:", result.ErrorList);
          }
          this.props.onNotice(notification);
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onNotice(notification);
        });
    } catch (error) {
      console.log(
        "MapTransactionsDetailsConposite:Error occured on matchMapTransactions",
        error
      );
    }
  };

  ConvertLoadingDetailsFromRoadToRail(roadLoadingDetails) {
    let railLoadingDetails = [];
    try {
      for (let ldInfo of roadLoadingDetails) {
        let railLDInfo = {
          IsLocalLoaded: false,
          CommonInfo: {},
          TransactionFPinfo: {},
          ArrTransactionBP: [],
          ArrTransactionAdditive: [],
        };

        railLDInfo.CommonInfo.BayCode = ldInfo.CommonInfo.BayCode;
        railLDInfo.CommonInfo.BCUCode = ldInfo.CommonInfo.BCUCode;

        railLDInfo.CommonInfo.CarrierCode = ldInfo.CommonInfo.CarrierCode;
        railLDInfo.CommonInfo.CompartmentCode =
          ldInfo.CommonInfo.CompartmentCode;
        railLDInfo.CommonInfo.CompartmentSeqNoInTrailer =
          ldInfo.CommonInfo.CompartmentSeqNoInTrailer;
        railLDInfo.CommonInfo.CompartmentSeqNoInVehicle =
          ldInfo.CommonInfo.CompartmentSeqNoInVehicle;

        railLDInfo.CommonInfo.DispatchCode = ldInfo.CommonInfo.ShipmentCode;
        railLDInfo.CommonInfo.GeneralTMUserCode = ldInfo.CommonInfo.DriverCode;
        railLDInfo.CommonInfo.LoadingType =
          ldInfo.CommonInfo.LoadingDetailsType;
        railLDInfo.CommonInfo.OfficerName = ldInfo.CommonInfo.DriverCode;

        railLDInfo.CommonInfo.ReceiptCode = ldInfo.CommonInfo.ReceiptCode;
        railLDInfo.CommonInfo.TrailerCode = ldInfo.CommonInfo.TrailerCode;
        railLDInfo.CommonInfo.TransactionType =
          ldInfo.CommonInfo.TransactionType;
        railLDInfo.CommonInfo.TransportationType =
          ldInfo.CommonInfo.TransportationType;
        railLDInfo.CommonInfo.VehicleCode = ldInfo.CommonInfo.VehicleCode;

        //FP

        railLDInfo.TransactionFPinfo = this.CopyAttributes(
          ldInfo.LoadingDetailFPinfo
        );

        //end FP

        for (let ldbpInfo of ldInfo.ArrLoadingDetailBP) {
          let RailMarineTransactionProductInfo = {};
          RailMarineTransactionProductInfo = this.CopyAttributes(ldbpInfo);
          RailMarineTransactionProductInfo.ShareHolderCode =
            ldInfo.CommonInfo.ShareHolderCode;
          railLDInfo.ArrTransactionBP.push(RailMarineTransactionProductInfo);
        }

        for (let ldbpInfo of ldInfo.ArrLoadingDetailAdditive) {
          let RailMarineTransactionProductInfo = {};
          RailMarineTransactionProductInfo = this.CopyAttributes(ldbpInfo);
          RailMarineTransactionProductInfo.ShareHolderCode =
            ldInfo.CommonInfo.ShareHolderCode;
          railLDInfo.ArrTransactionAdditive.push(
            RailMarineTransactionProductInfo
          );
        }

        railLoadingDetails.push(railLDInfo);
      }
    } catch (ex) {
      return null;
    }

    return railLoadingDetails;
  }


  ConvertLoadingDetailsFromRoadToMarine(roadLoadingDetails) {
    let marineLoadingDetails = [];
    try {
      for (let ldInfo of roadLoadingDetails) {
        let marineLDInfo = {
          IsLocalLoaded: false,
          CommonInfo: {},
          TransactionFPinfo: {},
          ArrTransactionBP: [],
          ArrTransactionAdditive: [],
        };

        marineLDInfo.CommonInfo.BayCode = ldInfo.CommonInfo.BayCode;
        marineLDInfo.CommonInfo.BCUCode = ldInfo.CommonInfo.BCUCode;

        marineLDInfo.CommonInfo.CarrierCode = ldInfo.CommonInfo.CarrierCode;
        marineLDInfo.CommonInfo.CompartmentCode =
          ldInfo.CommonInfo.CompartmentCode;
          marineLDInfo.CommonInfo.CompartmentSeqNoInTrailer =
          ldInfo.CommonInfo.CompartmentSeqNoInTrailer;
          marineLDInfo.CommonInfo.CompartmentSeqNoInVehicle =
          ldInfo.CommonInfo.CompartmentSeqNoInVehicle;

          marineLDInfo.CommonInfo.DispatchCode = ldInfo.CommonInfo.ShipmentCode;
          marineLDInfo.CommonInfo.GeneralTMUserCode = ldInfo.CommonInfo.DriverCode;
          marineLDInfo.CommonInfo.LoadingType =
          ldInfo.CommonInfo.LoadingDetailsType;
          marineLDInfo.CommonInfo.OfficerName = ldInfo.CommonInfo.DriverCode;

          marineLDInfo.CommonInfo.ReceiptCode = ldInfo.CommonInfo.ReceiptCode;
          marineLDInfo.CommonInfo.TrailerCode = ldInfo.CommonInfo.TrailerCode;
          marineLDInfo.CommonInfo.TransactionType =
          ldInfo.CommonInfo.TransactionType;
          marineLDInfo.CommonInfo.TransportationType =
          ldInfo.CommonInfo.TransportationType;
          marineLDInfo.CommonInfo.VehicleCode = ldInfo.CommonInfo.VehicleCode;

        //FP

        marineLDInfo.TransactionFPinfo = this.CopyAttributes(
          ldInfo.LoadingDetailFPinfo
        );

        //end FP

        for (let ldbpInfo of ldInfo.ArrLoadingDetailBP) {
          let RailMarineTransactionProductInfo = {};
          RailMarineTransactionProductInfo = this.CopyAttributes(ldbpInfo);
          RailMarineTransactionProductInfo.ShareHolderCode =
            ldInfo.CommonInfo.ShareHolderCode;
          marineLDInfo.ArrTransactionBP.push(RailMarineTransactionProductInfo);
        }

        for (let ldbpInfo of ldInfo.ArrLoadingDetailAdditive) {
          let RailMarineTransactionProductInfo = {};
          RailMarineTransactionProductInfo = this.CopyAttributes(ldbpInfo);
          RailMarineTransactionProductInfo.ShareHolderCode =
            ldInfo.CommonInfo.ShareHolderCode;
          marineLDInfo.ArrTransactionAdditive.push(
            RailMarineTransactionProductInfo
          );
        }

        marineLoadingDetails.push(marineLDInfo);
      }
    } catch (ex) {
      return null;
    }

    return marineLoadingDetails;
  }

  CopyAttributes(roadLoadingDetailsInfo) {
    let railLoadingDetailsInfo = {};
    railLoadingDetailsInfo.AdditiveProductCode =
      roadLoadingDetailsInfo.AdditiveProductCode;
    railLoadingDetailsInfo.ArmCode = roadLoadingDetailsInfo.LoadingArmCode;
    railLoadingDetailsInfo.Attributes = roadLoadingDetailsInfo.Attributes;
    railLoadingDetailsInfo.BaseProductCode =
      roadLoadingDetailsInfo.BaseProductCode;

    railLoadingDetailsInfo.CalculatedGross =
      roadLoadingDetailsInfo.CalculatedGross;
    railLoadingDetailsInfo.CalculatedNet = roadLoadingDetailsInfo.CalculatedNet;
    railLoadingDetailsInfo.CalculatedValue =
      roadLoadingDetailsInfo.CalculatedValue;
    railLoadingDetailsInfo.CalculatedValueUOM =
      roadLoadingDetailsInfo.CalculatedValueUOM;

    railLoadingDetailsInfo.EndTime = roadLoadingDetailsInfo.EndTime;
    railLoadingDetailsInfo.EndTotalizer = roadLoadingDetailsInfo.EndTotalizer;

    railLoadingDetailsInfo.FinishedProductCode =
      roadLoadingDetailsInfo.FinishedProductCode;
    railLoadingDetailsInfo.FlangeNumber = roadLoadingDetailsInfo.FlangeNumber;
    railLoadingDetailsInfo.FlowRate = roadLoadingDetailsInfo.FlowRate;
    railLoadingDetailsInfo.FlowRateUOM = roadLoadingDetailsInfo.FlowRateUOM;

    railLoadingDetailsInfo.GrossMass = roadLoadingDetailsInfo.WeightInVaccum;
    railLoadingDetailsInfo.GrossQuantity = roadLoadingDetailsInfo.GrossQuantity;

    railLoadingDetailsInfo.InjectorPosition =
      roadLoadingDetailsInfo.InjectorPosition;
    railLoadingDetailsInfo.IsInOffSpec = roadLoadingDetailsInfo.IsInOffSpec;

    railLoadingDetailsInfo.KFactorCurrent =
      roadLoadingDetailsInfo.KFactorCurrent;
    railLoadingDetailsInfo.KFactorProved = roadLoadingDetailsInfo.KFactorProved;
    railLoadingDetailsInfo.LeakageTotalizer =
      roadLoadingDetailsInfo.LeakageTotalizer;

    railLoadingDetailsInfo.MassUOM = roadLoadingDetailsInfo.WeightInVaccumUOM;
    railLoadingDetailsInfo.MeterCode = roadLoadingDetailsInfo.MeterCode;

    railLoadingDetailsInfo.NetEndTotalizer =
      roadLoadingDetailsInfo.NetEndTotalizer;
    railLoadingDetailsInfo.NetQuantity = roadLoadingDetailsInfo.NetQuantity;

    railLoadingDetailsInfo.PresetQuantity =
      roadLoadingDetailsInfo.PresetQuantity;
    railLoadingDetailsInfo.Pressure = roadLoadingDetailsInfo.Pressure;
    railLoadingDetailsInfo.PressureUOM = roadLoadingDetailsInfo.PressureUOM;
    railLoadingDetailsInfo.ProductDensity =
      roadLoadingDetailsInfo.ProductDensity;
    railLoadingDetailsInfo.ProductDensityUOM =
      roadLoadingDetailsInfo.ProductDensityUOM;

    railLoadingDetailsInfo.QuantityUOM = roadLoadingDetailsInfo.QuantityUOM;

    railLoadingDetailsInfo.ReferenceDensity =
      roadLoadingDetailsInfo.ProductDensity;
    railLoadingDetailsInfo.Remarks = roadLoadingDetailsInfo.Remarks;
    railLoadingDetailsInfo.ResetQuantity = roadLoadingDetailsInfo.ResetQuantity;

    railLoadingDetailsInfo.StartTime = roadLoadingDetailsInfo.StartTime;
    railLoadingDetailsInfo.StartTotalizer =
      roadLoadingDetailsInfo.StartTotalizer;

    railLoadingDetailsInfo.TankCode = roadLoadingDetailsInfo.TankCode;
    railLoadingDetailsInfo.Temperature = roadLoadingDetailsInfo.Temperature;
    railLoadingDetailsInfo.TemperatureUOM =
      roadLoadingDetailsInfo.TemperatureUOM;
    railLoadingDetailsInfo.TransactionID = roadLoadingDetailsInfo.TransactionID;

    railLoadingDetailsInfo.UnitPrice = roadLoadingDetailsInfo.UnitPrice;
    railLoadingDetailsInfo.VapourGrossQuantity =
      roadLoadingDetailsInfo.VapourGrossQuantity;
    railLoadingDetailsInfo.VapourNetQuantity =
      roadLoadingDetailsInfo.VapourNetQuantity;
    railLoadingDetailsInfo.VapourUOM = roadLoadingDetailsInfo.VapourUOM;
    railLoadingDetailsInfo.VCF = roadLoadingDetailsInfo.VCF;

    railLoadingDetailsInfo.WeightInAir = roadLoadingDetailsInfo.WeightInAir;
    railLoadingDetailsInfo.WeightInAirUOM =
      roadLoadingDetailsInfo.WeightInAirUOM;
    railLoadingDetailsInfo.WeightInVaccum =
      roadLoadingDetailsInfo.WeightInVaccum;
    railLoadingDetailsInfo.WeightInVaccumUOM =
      roadLoadingDetailsInfo.WeightInVaccumUOM;
    return railLoadingDetailsInfo;
  }

  validateMatch(modMapTransactions) {
    const validationErrors = lodash.cloneDeep(this.state.validationErrors);
    const validateField = [];
    const notification = {
      messageType: "critical",
      message: "LocalTransaction_MatchTransaction",
      messageResultDetails: [
        {
          keyFields: ["Common_TransactionCode"],
          keyValues: [modMapTransactions.TransactionCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    if (modMapTransactions.TransLoadBcu === true) {
      if (
        modMapTransactions.TransLoadSource === Constants.TransportationType.RAIL
      ) {
        validateField.push("EntityCode");
        validateField.push("WagonCode");
      } else if (
        modMapTransactions.TransLoadSource ===
        Constants.TransportationType.MARINE
      ) {
        validateField.push("EntityCode");
      } else {
        return true;
      }
    } else {
      for (let batch of this.state.otherData.BatchInfoForUI) {
        if (
          batch.ProductType === "Report_BaseProduct" &&
          (batch.TankCode === "" ||
            batch.TankCode === undefined ||
            batch.TankCode === null)
        ) {
          notification.messageResultDetails[0].errorMessage =
            "ERRMSG_TANK_CODE_EMPTY";
          this.props.onNotice(notification);
          return false;
        }
      }
      return true;
    }
    validateField.forEach((key) => {
      if (modMapTransactions[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          mapTransactionsValidationDef[key],
          modMapTransactions[key]
        );
      }
    });
    this.setState({ validationErrors });
    let returnValue = Object.values(validationErrors).every((value) => {
      return value === "";
    });
    return returnValue;
  }
  

  handleTruckShipmentPrintBOL( ) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: this.props.selectedShareholder,
      },
      {
        key: KeyCodes.shipmentCode,
        value: this.state.modMapTransactions.TransactionCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.PrintBOL,
      Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        this.notifyMsg(result);
      })
      .catch((error) => {
        console.log("Error while handleTruckShipmentPrintBOL:", error);
      });
  }

  handleTruckReceiptPrintBOD( ) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: this.props.selectedShareholder,
      },
      {
        key: KeyCodes.receiptStatus,
        value: this.state.otherData.Status,
      },
      {
        key: KeyCodes.receiptCode,
        value:  this.state.modMapTransactions.TransactionCode,
      },
      {
        key: KeyCodes.driverCode,
        value: this.state.otherData.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ReceiptPrintBOD,
      Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        this.notifyMsg(result);
      })
      .catch((error) => {
        console.log("Error while handleTruckShipmentPrintBOD:", error);
      });
  }

  handleMarineShipmentPrintBOL( ) {
     
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: this.state.modMapTransactions.TransactionCode,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
     
    axios(
      RestAPIs.MarineDispatchPrintBOL,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        this.notifyMsg(result);
      })
      .catch((error) => {
        console.log("Error while handleMarineShipmentPrintBOL:", error);
      });
  }

  handleMarineReceiptPrintBOD( ) {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: this.state.modMapTransactions.TransactionCode,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };

     
    axios(
      RestAPIs.MarineReceiptPrintBOD,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        this.notifyMsg(result);
      })
      .catch((error) => {
        console.log("Error while handleTruckShipmentPrintBOD:", error);
      });
  }

  
  handleRailShipmentPrintBOL( ) {
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: [
        {
          key: "RailDispatchCode",
          value: this.state.modMapTransactions.TransactionCode,
        },
      ],
    };
   
    axios(
      RestAPIs.RailDispatchPrintBOL,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        this.notifyMsg(result);
      })
      .catch((error) => {
        console.log("Error while handleTruckShipmentPrintBOD:", error);
      });
  }

  handleRailReceiptPrintBOD( ) {
     
    var shCode = this.state.selectedShareholder;
    let keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: this.state.modMapTransactions.TransactionCode,
      },
    ];
    const obj = {
      ShareHolderCode: shCode,
      KeyCodes: keyCode,
    };

   
    axios(
      RestAPIs.RailReceiptPrintBOD,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        this.notifyMsg(result);
      })
      .catch((error) => {
        console.log("Error while handleMarineShipmentPrintBOL:", error);
      });
  }


notifyMsg(result)
{
var msgCodes=  this.getCloseModalPopupText()

 var msgCode="PrintBOL_status";
 if(this.state.modMapTransactions.TransactionType==="RECEIPT")
 {
  msgCode="PrintBOD_status";
 }
  

  let notification = {
    messageType: "critical",
    message: msgCode,
    messageResultDetails: [
      {
        keyFields: [msgCodes.keyField],
        keyValues: [this.state.modMapTransactions.TransactionCode],
        isSuccess: false,
        errorMessage: "",
      },
    ],
  };

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


  handleCloseTransaction()
   {
    this.setState({
      launchPopup: true,
      reasonForClosure: "",
    });
   }

  handleCloseShipmentReceiptModal = () => {
    var modalvariables= this.getCloseModalPopupText();
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isCloseEnabled} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t(modalvariables.popupHeaderLabel) +
                    " : " +
                    this.state.modMapTransactions.TransactionCode}
                </h3>
              </div>
             
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.reasonForClosure}
                    label={t("ViewShipment_Reason")}
                    disbaled={false}
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
                      message: modalvariables.msgStatusHeader,
                      messageResultDetails: [
                        {
                          keyFields: [modalvariables.keyField],
                          keyValues: [this.state.modMapTransactions.TransactionCode],
                          isSuccess: false,
                          errorMessage:modalvariables.errorMsg,
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
                    this.setState({ isCloseEnabled: false }, () => {
                      this.handleShipmentReceiptClose();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    reasonForClosure: "",
                    launchPopup: false,
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader newEntityName="LocalTransactionsMapping_lblPageTitle"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <MapTransactionsDetail
            modMapTransactions={this.state.modMapTransactions}
            validationErrors={this.state.validationErrors}
            otherData={this.state.otherData}
            listOptions={{
              transportationTypes: this.state.transportationTypeOptions,
              transactionTypes: this.state.transactionTypeOptions,
              shareholderCodes: this.state.shareholderCodeOptions,
              dispatchReceiptCodes: this.state.dispatchReceiptCodeOptions,
              transactionCodes: this.getTransactionCodeSearchOptions(),
              tankCodes: this.state.tankCodeOptions,
              receiptCodes: this.getReceiptCodeSearchOptions(),
              railWagonCodes: this.state.railWagonCodeOptions,
            }}
            transportationType={this.props.transportationType}
            onTransactionSearchChange={this.handleTransactionCodeSearchChange}
            onReceiptSearchChange={this.handleReceiptCodeSearchChange}
            selectedCompRow={this.state.selectedCompRow}
            handleComRowSelectionChange={this.handleComRowSelectionChange}
            handleComRowClick={this.handleComRowClick}
            selectLocalTransactionRow={this.state.selectLocalTransactionRow}
            handleLocalTranRowSelectionChange={
              this.handleLocalTranRowSelectionChange
            }
            handleLocalTranRowClick={this.handleLocalTranRowClick}
            onFieldChange={this.handleChange}
            handleGetTanksForMeter={this.handleGetTanksForMeter}
            handleCellDataEdit={this.handleCellDataEdit}
          ></MapTransactionsDetail>
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row">
                <div className="col" style={{ textAlign: "right" }}>
                  <Button
                    content={t("LocalTransaction_MatchTransaction")}
                    disabled={this.state.otherData.BatchInfoForUI.length === 0}
                    onClick={() => this.matchMapTransactions()}
                  ></Button>
                  <Button
                    content={t(this.state.closeRailShipment)}
                    className={false ? "cancelButton" : ""}
                    disabled={!this.state.isCloseEnabled}
                    onClick={() => this.handleCloseTransaction()}
                  ></Button>
                  <Button
                    content={t(this.state.printBOL)}
                    disabled={!this.state.isPrintEnabled}
                    onClick={() => this.handlePrint()}
                  ></Button>
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        {this.state.launchPopup ? this.handleCloseShipmentReceiptModal() : null}
      </div>
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
)(MapTransactionsDetailComposite);

MapTransactionsDetailComposite.propTypes = {
  onNotice: PropTypes.func.isRequired,
};
