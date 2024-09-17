import React, { Component } from "react";
import {
  Button,
  Icon,
  Select,
  Tab,
  Popup,
  Card,
  Pagination,
} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import dayjs from "dayjs";
import * as dayJSBetween from "dayjs/plugin/isBetween";
import axios from "axios";
import * as Utilities from "../../../JS/Utilities";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import {
  functionGroups,
  fnSlotInformation, 
} from "../../../JS/FunctionGroups";
//import * as utc from "dayjs/plugin/utc";
import lodash from "lodash";
import CreateSlotComposite from "../Common/SlotBook/CreateSlotComposite";
import ErrorBoundary from "../../ErrorBoundary";
import ModifySlotComposite from "../Common/SlotBook/ModifySlotComposite";
import {
  kpiSlotDetailsShipmentList,
  kpiSlotDetailsReceiptList,
} from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";

const pageSize = 5;
//let tabIndex = [Constants.slotSource.SHIPMENT, Constants.slotSource.RECEIPT];
class SlotDetailsComposite extends Component {
  refreshTimer = null;

  state = {
    slotRangeList: [],
    selectedSlotRange: {
      slNo: 1,
      fromLTTime: dayjs(),
      fromCurrentTime: dayjs(),
      toLTTime: dayjs(),
      toCurrentTime: dayjs(),
    },
    slotParameters: {
      slotStartTime: dayjs(), //LocalTerminalTime
      slotEndTime: dayjs(), //LocalTerminalTime
      slotDuration: 30,
      timeDifference: 0,
      minSlotMinutesToBook: 30,
      maxSlotDaysToBook: 7,
      minSlotChangeMinutes: 90,
      maxSlots: 1,
      refreshTime: 5,
      terminalCode: this.props.terminal.Key.Code,
    },
    bayList: [], //[{bayCode:"",    active: true, bayType: "LOADING",shareholder:[shCode:Sh1,fpCodes:[]]}]
    shipmentSlotsList: [],
    receiptSlotsList: [],
    selectedDate: this.props.selectedDate,
    isShipmentsRefreshing: true,
    isReceiptsRefreshing: true,
    isCreateSlotOpen: false,
    modalSlotCreateFields: {
      transactionType: "",
      slotTime: dayjs(),
      bayCode: "",
      slotDuration: 0,
      slotSource: "",
      shareholder: "",
      orderCode: "",
      contractCode: "",
      shipmentCode: "",
      receiptCode: "",
      remarks: "",
      attributes: [],
    },
    modalSlotCreateList: {
      orders: [],
      filteredorders: [],
      contracts: [],
      filteredcontracts: [],
      shipments: [],
      filteredshipments: [],
      receipts: [],
      filteredreceipts: [],
    },
    isCreateModalrefreshing: true,
    modalTransactionData: {
      products: [], //{code,quantity,UOM,shCode}
      driver: "",
      carrier: "",
      vehicle: "",
      status: "",
    },
    modalValidationErrors: [],
    modelResultStatus: { modify: false, cancel: false },
    isModifySlotOpen: false,
    isModifyModalrefreshing: true,
    modalSlotModifyFields: {
      // transactionType: "",
      slotTime: dayjs(),
      bayCode: "",
      slotDuration: 0,
      remarks: "",
      shareholder: "",
      transactionCode: "",
      attributes: [],
    },

    selectedSlotInfo: null,
    kpiList: {},
    shipmentPageIndex: 1,
    receiptPageIndex: 1,
    filteredShipmentBayCode: "-1",
    filteredReceiptBayCode: "-1",
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    //currentTabIndex: 0,
    showBookSlotAuthenticationLayout: false,
    showUpdateSlotAuthenticationLayout: false,
    showCancelSlotAuthenticationLayout: false,

    tempSlotInfo: {},
  };
  componentWillUnmount() {
    this.stopRefreshTimer();
  }
  startRefreshTimer = () => {
    this.refreshTimer = setInterval(() => {
      // console.log(
      //   " Details Refreshing started " +
      //     this.state.slotParameters.refreshTime +
      //     dayjs().toDate().toString()
      // ); //TODO:Remove after testing
      if (this.props.operationsVisibilty.shipments) {
        this.getSlotsList(Constants.slotSource.SHIPMENT);
        this.getKPIList(Constants.slotSource.SHIPMENT);
      }
      if (this.props.operationsVisibilty.receipts) {
        this.getSlotsList(Constants.slotSource.RECEIPT);
        this.getKPIList(Constants.slotSource.RECEIPT);
      }
    }, this.state.slotParameters.refreshTime * 60 * 1000);
  };
  stopRefreshTimer = () => {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      // console.log(
      //   " Details Refreshing started " +
      //     this.state.slotParameters.refreshTime +
      //     dayjs().toDate().toString()
      // ); //TODO:Remove after testing
    }
  };
  getConfigurationsAndSlotsList() {
    //debugger;
    try {
      let arrTimeRange = []; //{slNo,fromLTTime,fromCurrentTime,ToLTTime,ToCurrentTime}
      let terminalTimeZone = this.props.terminal.Key.TimeZone;
      let selectedConfigurations = this.props.slotConfigurations.filter(
        (sc) => sc.TerminalCode === this.props.terminal.Key.Code
      );
      let currentDate = new Date();
      let currentTimeZone = currentDate.getTimezoneOffset() * -1;
      let timeDifference = currentTimeZone - terminalTimeZone;
      let slotStartTime = this.state.selectedDate;
      let slotEndTime = this.state.selectedDate;
      let startTime = "00:00";
      let endTime = "23:59";
      let slotDuration = "30";
      let maxNoOfSlots = 1;
      let minSlotMinutesToBook = 30;
      let maxSlotDaysToBook = 7;
      let minSlotChangeMinutes = 90;
      let refreshTime = 5;
      if (selectedConfigurations.length > 0) {
        let operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "SlotStartTime"
        );
        if (operationalParams.length > 0) {
          startTime = operationalParams[0].Value;
        }
        operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "SlotEndTime"
        );
        if (operationalParams.length > 0) {
          endTime = operationalParams[0].Value;
        }
        operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "SlotDuration"
        );
        if (operationalParams.length > 0) {
          slotDuration = operationalParams[0].Value;
        }
        operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "MaxNoOfSlots"
        );
        if (operationalParams.length > 0) {
          maxNoOfSlots = operationalParams[0].Value;
        }
        operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "AdvanceSlotBookMaxDays"
        );
        if (operationalParams.length > 0) {
          maxSlotDaysToBook = operationalParams[0].Value;
        }
        operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "BookAdvSlotMinutes"
        );
        if (operationalParams.length > 0) {
          minSlotMinutesToBook = operationalParams[0].Value;
        }
        operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "ChangeAdvSlotMinutes"
        );
        if (operationalParams.length > 0) {
          minSlotChangeMinutes = operationalParams[0].Value;
        }
        operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "RefreshInterval"
        );
        if (operationalParams.length > 0) {
          refreshTime = operationalParams[0].Value;
        }
      }
      slotStartTime = slotStartTime
        .set("hour", startTime.split(":")[0])
        .set("minute", startTime.split(":")[1]);
      slotEndTime = slotEndTime
        .set("hour", endTime.split(":")[0])
        .set("minute", endTime.split(":")[1]);
      //if (slotEndTime.isBefore(slotStartTime)) {
      if (slotStartTime.diff(slotEndTime, "minute") >= 0) {
        slotEndTime = slotEndTime.add(1, "day");
      }
      let tempslotStartTime = lodash.cloneDeep(slotStartTime);
      let tempslotEndTime = tempslotStartTime.add(7 * slotDuration, "minute");
      let tmpSlNo = 1;
      //while (slotEndTime.diff(tempslotStartTime, "minute") > slotDuration) {
      while (slotEndTime.diff(tempslotEndTime, "minute") >= 0) {
        arrTimeRange.push({
          slNo: tmpSlNo,
          fromLTTime: tempslotStartTime,
          fromCurrentTime: tempslotStartTime.add(timeDifference, "minute"),
          toLTTime: tempslotEndTime, //tempslotStartTime.add(7 * slotDuration, "minute"),
          toCurrentTime: tempslotEndTime
            //.add(7 * slotDuration, "minute")
            .add(timeDifference, "minute"),
        }); //{slNo,fromLTTime,fromCurrentTime,ToLTTime,ToCurrentTime}

        tempslotStartTime = tempslotStartTime.add(slotDuration, "minute");
        tempslotEndTime = tempslotEndTime.add(slotDuration, "minute");
        tmpSlNo += 1;
      }
      let slotParameters = {
        slotStartTime: slotStartTime,
        slotEndTime: slotEndTime,
        slotDuration: slotDuration,
        timeDifference: timeDifference,
        terminalCode: this.props.terminal.Key.Code,
        maxSlots: maxNoOfSlots,
        minSlotChangeMinutes: minSlotChangeMinutes,
        minSlotMinutesToBook: minSlotMinutesToBook,
        maxSlotDaysToBook: maxSlotDaysToBook,
        refreshTime: refreshTime,
      };
      let currentDayjs = dayjs();
      let selectedSlotRanges = arrTimeRange.filter(
        (tr) =>
          tr.fromCurrentTime.diff(currentDayjs, "minute") > slotDuration * -1
      );
      let selectedSlotRange = arrTimeRange[0];
      if (selectedSlotRanges.length > 0)
        selectedSlotRange = selectedSlotRanges[0];
      else if (
        currentDayjs.isBefore(
          arrTimeRange[arrTimeRange.length - 1].toCurrentTime
        )
      )
        selectedSlotRange = arrTimeRange[arrTimeRange.length - 1];

      this.setState(
        {
          slotRangeList: arrTimeRange,
          selectedSlotRange,
          slotParameters,
        },
        () => {
          if (this.props.operationsVisibilty.shipments) {
            this.getSlotsList(Constants.slotSource.SHIPMENT);
            this.getKPIList(Constants.slotSource.SHIPMENT);
          }
          if (this.props.operationsVisibilty.receipts) {
            this.getSlotsList(Constants.slotSource.RECEIPT);
            this.getKPIList(Constants.slotSource.RECEIPT);
          }
          this.startRefreshTimer();
        }
      );
    } catch (error) {
      console.log("error in getConfigurationsAndSlotsList", error);
    }
    //return arrTimeRange; //.slice(0, 7);
  }

  getKPIList(transactionType) {
    var notification = {
      message: "",
      messageType: "critical",
      messageResultDetails: [], //{keyFields: ["DriverInfo_Code"],
      //keyValues: [this.state.modDriver.Code],
      //isSuccess: false,
      //errorMessage: "",}
    };
    let objKPIRequestData = {
      PageName:
        transactionType === Constants.slotSource.SHIPMENT
          ? kpiSlotDetailsShipmentList
          : kpiSlotDetailsReceiptList,
      TransportationType: this.props.transportationType,
      InputParameters: [
        { key: "TerminalCode", value: this.state.slotParameters.terminalCode },
        { key: "Date", value: this.state.selectedDate.format("YYYY-MM-DD") },
        { key: "TransactionType", value: transactionType },
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
        //console.log(result);
        if (result.IsSuccess === true) {
          let kpiList = lodash.cloneDeep(this.state.kpiList);
          kpiList[transactionType] = result.EntityResult.ListKPIDetails;
          this.setState({ kpiList });
          // let errorKPIs = result.EntityResult.ListKPIDetails.filter(
          //   (kpi) => kpi.resultData.IsSuccess === false
          // );
          // errorKPIs.forEach((kpi) =>
          //   notification.messageResultDetails.push({
          //     keyFields: ["kpi_" + kpi.KPIName], //TODO:Localize
          //     keyValues: [""], //TODO:Localize
          //     isSuccess: false,
          //     errorMessage: kpi.resultData.ErrorList[0].ErrorMessage,
          //   })
          // );
        } else {
          this.setState({ driverKPIList: [] });
          console.log("Error in slot details KPIList:", result.ErrorList);
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: result.ErrorList[0],
          });
        }
        if (notification.messageResultDetails.length > 0) {
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting SlotDetails KPIList:", error);
      });
  }

  getSlotsList(transactionType) {
    let slotParams = this.state.slotParameters;
    let slotRequestInfo = {
      TerminalCode: slotParams.terminalCode,
      TransportationType: this.props.transportationType,
      TransactionSource: transactionType,
      FromDate: slotParams.slotStartTime
        .add(slotParams.timeDifference, "minute")
        .toDate(),
      ToDate: slotParams.slotEndTime
        .add(slotParams.timeDifference, "minute")
        .toDate(),
    };
    axios(
      RestAPIs.GetSlotsList,
      Utilities.getAuthenticationObjectforPost(
        slotRequestInfo,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        //debugger;
        //console.log(response);

        let result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            // console.log("shipmentsSummary", result.EntityResult.Table);
            if (
              slotRequestInfo.TransactionSource ===
              Constants.slotSource.SHIPMENT
            ) {
              this.setState({
                shipmentSlotsList: result.EntityResult,
                isShipmentsRefreshing: false,
              });
            } else {
              this.setState({
                receiptSlotsList: result.EntityResult,
                isReceiptsRefreshing: false,
              });
            }
          } else {
            if (
              slotRequestInfo.TransactionSource ===
              Constants.slotSource.SHIPMENT
            ) {
              this.setState({ isShipmentsRefreshing: false });
            } else {
              this.setState({ isReceiptsRefreshing: false });
            }

            console.log("Error while getting getSlotList:", result);
          }
        } else {
          if (
            slotRequestInfo.TransactionSource === Constants.slotSource.SHIPMENT
          ) {
            this.setState({ isShipmentsRefreshing: false });
          } else {
            this.setState({ isReceiptsRefreshing: false });
          }

          console.log("Error while getting getSlotList:", result);
        }
      })
      .catch((error) => {
        if (
          slotRequestInfo.TransactionSource === Constants.slotSource.SHIPMENT
        ) {
          this.setState({ isShipmentsRefreshing: false });
        } else {
          this.setState({ isReceiptsRefreshing: false });
        }

        console.log("Error while getting getSlotList:", error);
      });
  }

  handleDateChanage = (duration) => {
    try {
      let selectedDate = this.state.selectedDate;
      selectedDate = selectedDate.add(duration, "day");
      this.setState(
        {
          selectedDate,
          isShipmentsRefreshing: true,
          isReceiptsRefreshing: true,
        },
        () => this.getConfigurationsAndSlotsList()
      );
      this.props.onDateChange("day", duration);
    } catch (error) {
      console.log("error in handleDateChanage", error);
    }
  };

  handleSlotModifyFieldsChange = (value, fieldName) => {
    //debugger;
    try {
      let modalSlotModifyFields = lodash.cloneDeep(
        this.state.modalSlotModifyFields
      );
      if (
        fieldName === "bayCode" ||
        fieldName === "slotDuration" ||
        fieldName === "remarks"
      ) {
        modalSlotModifyFields[fieldName] = value;
      } else if (fieldName === "Time") {
        let slotTime = modalSlotModifyFields.slotTime;
        let timeSplits = value.split(":");
        modalSlotModifyFields.slotTime = slotTime
          .set("hour", timeSplits[0])
          .set("minute", timeSplits[1]);
      } else if (fieldName === "Date") {
        let modslotTime = dayjs(modalSlotModifyFields.slotTime.toDate());
        modalSlotModifyFields.slotTime = dayjs(value)
          .set("hour", modslotTime.get("hour"))
          .set("minute", modslotTime.get("minute"));
        if (isNaN(modalSlotModifyFields.slotTime.get("hour"))) {
          modalSlotModifyFields.slotTime = dayjs(modslotTime);
        }
      }
      this.setState({ modalSlotModifyFields });
      // else if()
    } catch (error) {
      console.log("error in handleSlotModifyFieldsChange", error);
    }
  };

  handleSlotCreateFieldsChange = (value, fieldName) => {
    try {
      let modalSlotCreateFields = lodash.cloneDeep(
        this.state.modalSlotCreateFields
      );
      if (fieldName === "slotDuration") {
        modalSlotCreateFields["slotDuration"] = value;
        this.setState({ modalSlotCreateFields });
      } else if (fieldName === "Time") {
        let slotTime = modalSlotCreateFields.slotTime;
        let timeSplits = value.split(":");
        modalSlotCreateFields.slotTime = slotTime
          .set("hour", timeSplits[0])
          .set("minute", timeSplits[1]);
        this.setState({ modalSlotCreateFields });
      } else if (fieldName === "remarks") {
        modalSlotCreateFields["remarks"] = value;
        this.setState({ modalSlotCreateFields });
      } else {
        modalSlotCreateFields[fieldName] = value;
        this.prepareKeyDataforAvailableTransactions(
          modalSlotCreateFields,
          fieldName
        );
        this.setState({ isCreateModalrefreshing: true });
      }
    } catch (error) {
      console.log("error in handleSlotCreateFieldsChange", error);
    }
  };
  prepareKeyDataforAvailableTransactions(
    modalSlotCreateFields,
    fieldNameChanged
  ) {
    try {
      let modalSlotCreateList = lodash.cloneDeep(
        this.state.modalSlotCreateList
      );
      let requestTransactionInfoToBookSlot = {
        TerminalCode: this.props.terminal.Key.Code,
        TransportationType: this.props.transportationType,
        TransactionSource: modalSlotCreateFields.slotSource,
        LocationCode: modalSlotCreateFields.bayCode,
        ShareholderCode: modalSlotCreateFields.shareholder,
        CreatedFrom: Constants.shipmentFrom.None,
        TransactionSourceCode: "",
      };
      if (fieldNameChanged === "shareholder") {
        if (modalSlotCreateFields.slotSource === "") {
          this.setState({ modalSlotCreateFields });
          return;
        } else if (
          modalSlotCreateFields.slotSource === Constants.slotSource.SHIPMENT
        ) {
          modalSlotCreateFields.shipmentCode = "";
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "shipments",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        } else if (
          modalSlotCreateFields.slotSource === Constants.slotSource.ORDER
        ) {
          modalSlotCreateFields.shipmentCode = "";
          modalSlotCreateFields.orderCode = "";
          modalSlotCreateList.shipments = [];
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "orders",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        } else if (
          modalSlotCreateFields.slotSource === Constants.slotSource.CONTRACT
        ) {
          modalSlotCreateFields.shipmentCode = "";
          modalSlotCreateFields.contractCode = "";
          modalSlotCreateList.shipments = [];
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "contracts",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        } else if (
          modalSlotCreateFields.slotSource === Constants.slotSource.RECEIPT
        ) {
          modalSlotCreateFields.receiptCode = "";
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "receipts",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        }
      } else if (fieldNameChanged === "slotSource") {
        //TODO set state for slotsource
        if (
          modalSlotCreateFields.slotSource === Constants.slotSource.SHIPMENT
        ) {
          modalSlotCreateFields.shipmentCode = "";
          modalSlotCreateFields.orderCode = "";
          modalSlotCreateFields.contractCode = "";
          modalSlotCreateList.contracts = [];
          modalSlotCreateList.filteredcontracts = [];
          modalSlotCreateList.orders = [];
          modalSlotCreateList.filteredorders = [];
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "shipments",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        } else if (
          modalSlotCreateFields.slotSource === Constants.slotSource.ORDER
        ) {
          modalSlotCreateList.shipments = [];
          modalSlotCreateList.filteredshipments = [];
          modalSlotCreateList.contracts = [];
          modalSlotCreateList.filteredcontracts = [];
          modalSlotCreateFields.shipmentCode = "";
          modalSlotCreateFields.orderCode = "";
          modalSlotCreateFields.contractCode = "";
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "orders",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        } else if (
          modalSlotCreateFields.slotSource === Constants.slotSource.CONTRACT
        ) {
          modalSlotCreateList.shipments = [];
          modalSlotCreateList.filteredshipments = [];
          modalSlotCreateList.orders = [];
          modalSlotCreateList.filteredorders = [];
          modalSlotCreateFields.shipmentCode = "";
          modalSlotCreateFields.ordercode = "";
          modalSlotCreateFields.contractCode = "";
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "contracts",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        } else if (
          modalSlotCreateFields.slotSource === Constants.slotSource.RECEIPT
        ) {
          modalSlotCreateFields.receiptCode = "";
          this.getAvailableTransactionsToBook(
            requestTransactionInfoToBookSlot,
            "receipts",
            modalSlotCreateFields,
            modalSlotCreateList
          );
        }
      } else if (fieldNameChanged === "orderCode") {
        // modalSlotCreateList.shipments = [];
        modalSlotCreateFields.shipmentCode = "";
        requestTransactionInfoToBookSlot.CreatedFrom =
          Constants.shipmentFrom.Order;
        requestTransactionInfoToBookSlot.TransactionSource =
          Constants.slotSource.SHIPMENT;
        requestTransactionInfoToBookSlot.TransactionSourceCode =
          modalSlotCreateFields.orderCode;
        this.getAvailableTransactionsToBook(
          requestTransactionInfoToBookSlot,
          "shipments",
          modalSlotCreateFields,
          modalSlotCreateList
        );
      } else if (fieldNameChanged === "contractCode") {
        // modalSlotCreateList.shipments = [];
        modalSlotCreateFields.shipmentCode = "";
        requestTransactionInfoToBookSlot.CreatedFrom =
          Constants.shipmentFrom.Contract;
        requestTransactionInfoToBookSlot.TransactionSource =
          Constants.slotSource.SHIPMENT;
        requestTransactionInfoToBookSlot.TransactionSourceCode =
          modalSlotCreateFields.contractCode;
        this.getAvailableTransactionsToBook(
          requestTransactionInfoToBookSlot,
          "shipments",
          modalSlotCreateFields,
          modalSlotCreateList
        );
      } else if (fieldNameChanged === "shipmentCode") {
        this.getShipment(modalSlotCreateFields, "create");
      } else if (fieldNameChanged === "receiptCode") {
        this.getReceipt(modalSlotCreateFields, "create");
      }
    } catch (error) {
      console.log("error in prepareKeyDataforAvailableTransactions", error);
    }
  }
  getShipment(modalSlotCreateFields, modalType) {
    if (this.props.transportationType === Constants.TransportationType.ROAD) {
      this.getTruckShipment(modalSlotCreateFields, modalType);
    } else if (
      this.props.transportationType === Constants.TransportationType.MARINE
    ) {
      this.getMarineShipment(modalSlotCreateFields, modalType);
    }
  }
  getReceipt(modalSlotCreateFields, modalType) {
    if (this.props.transportationType === Constants.TransportationType.ROAD) {
      this.getTruckReceipt(modalSlotCreateFields, modalType);
    } else if (
      this.props.transportationType === Constants.TransportationType.MARINE
    ) {
      this.getMarineReceipt(modalSlotCreateFields, modalType);
    }
  }
  getTruckShipment(modalSlotFields, modalType) {
    let modalTransactionData = {
      products: [], //{code,quantity,UOM,shCode}
      driver: "",
      carrier: "",
      vehicle: "",
      status: "",
    };
    let keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value:
          modalType === "create"
            ? modalSlotFields.shipmentCode
            : modalSlotFields.transactionCode,
      },
    ];
    let obj = {
      ShareHolderCode: modalSlotFields.shareholder,
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
        let result = response.data;
        //console.log(result);
        if (result.IsSuccess === true && result.EntityResult != null) {
          let shipment = result.EntityResult;
          modalTransactionData.driver = shipment.DriverCode;
          modalTransactionData.vehicle = shipment.VehicleCode;
          modalTransactionData.carrier = shipment.CarrierCode;
          modalTransactionData.status = shipment.Status;

          if (Array.isArray(shipment.ShipmentDetailsInfo)) {
            shipment.ShipmentDetailsInfo.forEach((sd) => {
              modalTransactionData.products.push({
                code: sd.FinishedProductCode,
                quantity: sd.Quantity,
                UOM: sd.QuantityUOM,
                shCode: sd.ShareholderCode,
              });
            });
          }
        } else {
          console.log("Error in GetShiment:", result);
        }
        // console.log(modalTransactionData);
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            modalTransactionData,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,
            modalTransactionData,
            isModifyModalrefreshing: false,
          });
        }
      })
      .catch((error) => {
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,
            isModifyModalrefreshing: false,
          });
        }
        console.log("Error while getting truck Shipment:", error);
      });
  }
  getTruckReceipt(modalSlotFields, modalType) {
    let modalTransactionData = {
      products: [], //{code,quantity,UOM}
      driver: "",
      carrier: "",
      vehicle: "",
      status: "",
    };
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value:
          modalType === "create"
            ? modalSlotFields.receiptCode
            : modalSlotFields.transactionCode,
      },
    ];
    var obj = {
      ShareHolderCode: modalSlotFields.shareholder,
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
        let result = response.data;
        //console.log(result);
        if (result.IsSuccess === true && result.EntityResult != null) {
          let receipt = result.EntityResult;
          modalTransactionData.driver = receipt.DriverCode;
          modalTransactionData.vehicle = receipt.VehicleCode;
          modalTransactionData.carrier = receipt.CarrierCode;
          modalTransactionData.status = receipt.ReceiptStatus;
          if (Array.isArray(receipt.ReceiptCompartmentsInfo)) {
            receipt.ReceiptCompartmentsInfo.forEach((rc) => {
              let receiptProducts = modalTransactionData.products.filter(
                (product) => rc.FinishedProductCode === product.code
              );
              if (receiptProducts.length === 0) {
                modalTransactionData.products.push({
                  code: rc.FinishedProductCode,
                  quantity: rc.Quantity,
                  UOM: rc.QuantityUOM,
                  shCode: rc.ShareholderCode,
                });
              } else {
                receiptProducts[0].quantity =
                  receiptProducts[0].quantity + rc.Quantity;
              }
            });
          }
        } else {
          console.log("Error in GetReceipt:", result);
        }
        //console.log(modalTransactionData);
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            modalTransactionData,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,
            modalTransactionData,
            isModifyModalrefreshing: false,
          });
        }
      })
      .catch((error) => {
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,
            isModifyModalrefreshing: false,
          });
        }
        console.log("Error while getting Receipt:", error);
      });
  }
  getMarineReceipt(modalSlotFields, modalType) {
    let modalTransactionData = {
      products: [], //{code,quantity,UOM}
      driver: "",
      carrier: "",
      vehicle: "",
      status: "",
    };
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value:
          modalType === "create"
            ? modalSlotFields.receiptCode
            : modalSlotFields.transactionCode,
      },
      {
        key: KeyCodes.transportationType,
        value: this.props.transportationType,
      },
    ];
    var obj = {
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
        let result = response.data;
        //console.log(result);
        if (result.IsSuccess === true && result.EntityResult != null) {
          let receipt = result.EntityResult;
          modalTransactionData.driver = receipt.GeneralTMUser;
          modalTransactionData.vehicle = receipt.VesselCode;
          modalTransactionData.carrier = receipt.CarrierCode;
          modalTransactionData.status = receipt.ReceiptStatus;
          if (
            Array.isArray(receipt.RailMarineReceiptCompartmentDetailPlanList)
          ) {
            receipt.RailMarineReceiptCompartmentDetailPlanList.forEach((rc) => {
              let receiptProducts = modalTransactionData.products.filter(
                (product) =>
                  rc.FinishedProductCode === product.code &&
                  rc.ShareholderCode === product.shCode
              );
              if (receiptProducts.length === 0) {
                modalTransactionData.products.push({
                  code: rc.FinishedProductCode,
                  quantity: rc.Quantity,
                  UOM: rc.QuantityUOM,
                  shCode: rc.ShareholderCode,
                });
              } else {
                receiptProducts[0].quantity =
                  receiptProducts[0].quantity + rc.Quantity;
              }
            });
          }
        } else {
          console.log("Error in GetReceipt:", result);
        }
        //console.log(modalTransactionData);
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            modalTransactionData,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,
            modalTransactionData,
            isModifyModalrefreshing: false,
          });
        }
      })
      .catch((error) => {
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,

            isModifyModalrefreshing: false,
          });
        }
        console.log("Error while getting Receipt:", error);
      });
  }

  getMarineShipment(modalSlotFields, modalType) {
    let modalTransactionData = {
      products: [], //{code,quantity,UOM}
      driver: "",
      carrier: "",
      vehicle: "",
      status: "",
    };
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value:
          modalType === "create"
            ? modalSlotFields.shipmentCode
            : modalSlotFields.transactionCode,
      },
      {
        key: KeyCodes.transportationType,
        value: this.props.transportationType,
      },
    ];
    var obj = {
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
        let result = response.data;
        //console.log(result);
        if (result.IsSuccess === true && result.EntityResult != null) {
          let shipment = result.EntityResult;
          modalTransactionData.driver = shipment.GeneralTMUser;
          modalTransactionData.vehicle = shipment.VesselCode;
          modalTransactionData.carrier = shipment.CarrierCode;
          modalTransactionData.status = shipment.DispatchStatus;
          if (Array.isArray(shipment.DispatchCompartmentDetailPlanList)) {
            shipment.DispatchCompartmentDetailPlanList.forEach((sc) => {
              let shipmentProducts = modalTransactionData.products.filter(
                (product) =>
                  sc.FinishedProductCode === product.code &&
                  sc.ShareholderCode === product.shCode
              );
              if (shipmentProducts.length === 0) {
                modalTransactionData.products.push({
                  code: sc.FinishedProductCode,
                  quantity: sc.Quantity,
                  UOM: sc.QuantityUOM,
                  shCode: sc.ShareholderCode,
                });
              } else {
                shipmentProducts[0].quantity =
                  shipmentProducts[0].quantity + sc.Quantity;
              }
            });
          }
        } else {
          console.log("Error in GetReceipt:", result);
        }
        // console.log(modalTransactionData);
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            modalTransactionData,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,
            modalTransactionData,
            isModifyModalrefreshing: false,
          });
        }
      })
      .catch((error) => {
        if (modalType === "create") {
          this.setState({
            modalSlotCreateFields: modalSlotFields,
            isCreateModalrefreshing: false,
          });
        } else {
          this.setState({
            modalSlotModifyFields: modalSlotFields,
            isModifyModalrefreshing: false,
          });
        }
        console.log("Error while getting Shipment:", error);
      });
  }
  getAvailableTransactionsToBook(
    requestInfo,
    arrayToUpdate,
    modalSlotCreateFields,
    modalSlotCreateList
  ) {
    axios(
      RestAPIs.GetAvailableTransactionsForBooking,
      Utilities.getAuthenticationObjectforPost(
        requestInfo,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        //debugger;
        //console.log(response);

        let result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            modalSlotCreateList[arrayToUpdate] = result.EntityResult;
            if (result.EntityResult.length > Constants.filteredOptionsCount) {
              modalSlotCreateList["filtered" + arrayToUpdate] =
                result.EntityResult.slice(0, Constants.filteredOptionsCount);
            } else {
              modalSlotCreateList["filtered" + arrayToUpdate] =
                result.EntityResult;
            }
          } else {
            modalSlotCreateList[arrayToUpdate] = [];
            modalSlotCreateList["filtered" + arrayToUpdate] = [];
            console.log(
              "Error while getting getAvailableTransactionsToBook:",
              result
            );
          }
        } else {
          modalSlotCreateList[arrayToUpdate] = [];
          modalSlotCreateList["filtered" + arrayToUpdate] = [];

          console.log(
            "Error while getting getAvailableTransactionsToBook:",
            result
          );
        }
        this.setState({
          modalSlotCreateFields,
          modalSlotCreateList,
          isCreateModalrefreshing: false,
        });
      })
      .catch((error) => {
        modalSlotCreateList[arrayToUpdate] = [];
        modalSlotCreateList["filtered" + arrayToUpdate] = [];
        this.setState({
          modalSlotCreateFields,
          modalSlotCreateList,
          isCreateModalrefreshing: false,
        });

        console.log(
          "Error while getting getAvailableTransactionsToBook:",
          error
        );
      });
  }

  getFilteredTimeRangeOptions(isFrom) {
    let options = [];
    // let filteredTimeRanges = this.state.slotRangeList.filter((sr) =>
    //   sr.toLTTime.isBefore(
    //     this.state.slotParameters.slotEndTime.add(1, "minute")
    //   )
    // );
    this.state.slotRangeList.forEach((ft) => {
      options.push({
        value: ft.slNo,
        text: isFrom
          ? ft.fromLTTime.format("HH:mm")
          : ft.toLTTime.format("HH:mm"),
      });
    });
    return options;
  }
  handleTimeRangeChange(slNo) {
    try {
      let slotRangeList = this.state.slotRangeList;
      let selectedRangeList = slotRangeList.filter((sr) => sr.slNo === slNo);
      if (selectedRangeList.length > 0) {
        this.setState({ selectedSlotRange: selectedRangeList[0] });
      } else {
        console.log("no slot Ranges identified");
      }
    } catch (error) {
      console.log("error in handleTimeRangeChange", error);
    }
  }
  moveTimeRange(noOfMoves) {
    let slNo = this.state.selectedSlotRange.slNo;
    slNo = slNo + noOfMoves;
    this.handleTimeRangeChange(slNo);
  }
  filterAttributeMetaData(slotsource, slotInfo) {
    try {
      let attributeMetaDataList = lodash.cloneDeep(
        this.props.attributeMetaDataList
      );
      let modAttributeMetaDataList = [];
      let attributeValidationErrors = [];
      let terminalCode = this.props.terminal.Key.Code;
      let transportationType = this.props.transportationType;
      let attributeType =
        transportationType +
        Utilities.getKeyByValue(Constants.slotSource, slotsource) +
        "SLOTINFO";
      if (Array.isArray(attributeMetaDataList[attributeType])) {
        modAttributeMetaDataList = attributeMetaDataList[attributeType].filter(
          (attribute) => attribute.TerminalCode === terminalCode
        );
      }
      // console.log(modAttributeMetaDataList);

      attributeValidationErrors = Utilities.getAttributeInitialValidationErrors(
        modAttributeMetaDataList
      );
      if (attributeValidationErrors.length > 0) {
        attributeValidationErrors =
          attributeValidationErrors[0].attributeValidationErrors;
      }
      //Fill slot info attribute values to Modified Attribute MetaData
      if (slotInfo !== null && slotInfo !== undefined) {
        let terminaAttributeMetaData = slotInfo.Attributes.find(
          (slotInfoAttribute) => {
            return slotInfoAttribute.TerminalCode === terminalCode;
          }
        );
        if (
          terminaAttributeMetaData !== undefined &&
          modAttributeMetaDataList.length > 0
        ) {
          modAttributeMetaDataList[0].attributeMetaDataList.forEach(
            (attributeMetaData) => {
              let attributeValue =
                terminaAttributeMetaData.ListOfAttributeData.find(
                  (slotInfoAttribute) => {
                    return (
                      slotInfoAttribute.AttributeCode === attributeMetaData.Code
                    );
                  }
                );
              if (attributeValue !== undefined) {
                attributeMetaData.DefaultValue = attributeValue.AttributeValue;
              }
            }
          );
        }
      }
      this.setState({ modAttributeMetaDataList, attributeValidationErrors });
    } catch (error) {
      console.log("filterAttributeMetaData", error);
    }
  }
  getBaysforTerminal() {
    let notification = {
      messageType: "critical",
      message:
        this.props.transportationType === Constants.TransportationType.ROAD
          ? "BaySearch_NoResult"
          : "Berths_Not_found",
      messageResultDetails: [],
    };
    axios(
      RestAPIs.GetBaysOfUser +
      "?TransportationType=" +
      this.props.transportationType +
      "&TerminalCode=" +
      this.props.terminal.Key.Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        // console.log(response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            //[{bayCode:"",Active:false,bayType:Both,shareholder:[shCode:Sh1,fpCodes:[]]}]
            let bayList = [];
            result.EntityResult.forEach((bay) => {
              let bayItem = {
                bayCode: bay.BayCode,
                active: bay.Active,
                bayType: bay.BayType,
                shareholder: [],
              };
              if (Array.isArray(bay.SupportedProducts)) {
                bay.SupportedProducts.forEach((product) => {
                  if (product.Active) {
                    let shareholderArray = bayItem.shareholder.filter(
                      (sh) => sh.shCode === product.Shareholdercode
                    );
                    if (shareholderArray.length > 0) {
                      shareholderArray[0].fpCodes.push(product.Code);
                    } else {
                      bayItem.shareholder.push({
                        shCode: product.Shareholdercode,
                        fpCodes: [product.Code],
                      });
                    }
                  }
                });
              }
              bayList.push(bayItem);
            });
            // console.log(bayList);
            this.setState(
              {
                bayList,
              },
              () => {
                this.getConfigurationsAndSlotsList();
              }
            );
          } else {
            this.setState({
              isReceiptsRefreshing: false,
              isShipmentsRefreshing: false,
            });
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
            console.log("No Bays found:", result);
          }
        } else {
          this.setState({
            isReceiptsRefreshing: false,
            isShipmentsRefreshing: false,
          });
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
          console.log("Error while getting bays:", result);
        }
      })
      .catch((error) => {
        this.setState({
          isReceiptsRefreshing: false,
          isShipmentsRefreshing: false,
        });
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
        console.log("Error while getting getSlotConfigurations:", error);
      });
  }
  componentDidMount() {
    // this.getConfigurationsAndSlotsList();
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getBaysforTerminal();
    } catch (error) {
      console.log("error in Component did mount", error);
    }
  }

  getFPSpans(fpArray, isFullDisplay) {
    let fpSpans = [];
    try {
      for (const [index, value] of fpArray.entries()) {
        if (isFullDisplay) {
          fpSpans.push(<span className="slotDetailssmallSpan">{value},</span>);
        } else {
          if (index < 2) {
            fpSpans.push(
              <span className="slotDetailssmallSpan">{value},</span>
            );
          } else if (index === 2) {
            fpSpans.push(<span className="slotDetailssmallSpan">...</span>);
          }
        }
      }
    } catch (error) {
      console.log("error in getFPSpans", error);
    }
    return fpSpans;
  }
  getbayFinishedProductPopover(shArray) {
    if (Array.isArray(shArray) && shArray.length > 0) {
      return (
        <ErrorBoundary>
          <Popup
            className="popup-theme-wrap"
            position="top left"
            on="click"
            element={this.getShareholderFPElements(shArray, false)}
          >
            <Card>
              <Card.Content>
                {this.getShareholderFPElements(shArray, true)}
              </Card.Content>
            </Card>
          </Popup>
        </ErrorBoundary>
      );
    } else {
      return "";
    }
  }
  //shareholder:[shCode:Sh1,fpCodes:[]]}]
  getShareholderFPElements(shArray, isfullDisplay) {
    //debugger;
    let shareholderElements = [];
    try {
      if (Array.isArray(shArray)) {
        for (const [index, value] of shArray.entries()) {
          if (isfullDisplay) {
            shareholderElements.push(
              <div style={{ display: "flex" }}>
                <span className="slotDetailsSmallBoldSpan">{value.shCode}</span>
                <span>{": "}</span>
                {this.getFPSpans(value.fpCodes, isfullDisplay)}
              </div>
            );
          } else {
            if (index < 2) {
              shareholderElements.push(
                <div>
                  <span className="slotDetailsSmallBoldSpan">
                    {value.shCode}
                  </span>
                  <span>{": "}</span>
                  {this.getFPSpans(value.fpCodes, isfullDisplay)}
                </div>
              );
            } else if (index === 2) {
              shareholderElements.push(<div>...</div>);
            }
          }
        }
        return shareholderElements;
      } else return "";
    } catch (error) {
      console.log("error in getShareholderFPElements", error);
      return "";
    }
  }

  getBookedSlotsLayoutforBay(
    slotSource,
    slotsList,
    minuteWidthPerc,
    locationCode
  ) {
    //debugger;
    let bookedDivs = [];
    let selectedSlotRange = this.state.selectedSlotRange;
    let srCurrentStartTime = selectedSlotRange.fromCurrentTime;
    let srCurrentEndTime = selectedSlotRange.toCurrentTime;

    dayjs.extend(dayJSBetween);
    let filteredSlots = slotsList.filter(
      (si) =>
        si.LocationCode === locationCode &&
        (srCurrentStartTime.isBetween(
          dayjs(si.StartTime),
          dayjs(si.EndTime).subtract(1, "minute"),
          "minute",
          []
        ) ||
          srCurrentEndTime.isBetween(
            dayjs(si.StartTime),
            dayjs(si.EndTime).subtract(1, "minute"),
            "minute",
            []
          ) ||
          dayjs(si.StartTime).isBetween(
            srCurrentStartTime,
            srCurrentEndTime,
            "minute",
            []
          ) ||
          dayjs(si.EndTime)
            .subtract(1, "minute")
            .isBetween(srCurrentStartTime, srCurrentEndTime, null, []))
    );

    filteredSlots.forEach((si) => {
      let bookingclassName = "";
      let bookingclassNameBar = "";
      let leftPerc = 0;
      let widthPerc = 100;
      let slotStartTime = dayjs(si.StartTime);
      let slotEndTime = dayjs(si.EndTime).subtract(1, "minute");
      //if(srCurrentStartTime.isBefore(slotStartTime))
      leftPerc =
        minuteWidthPerc * slotStartTime.diff(srCurrentStartTime, "minute");
      leftPerc = leftPerc < 0 ? 1 : leftPerc + 1;
      // console.log("left perc", leftPerc, si);
      if (window.innerWidth <= 800 && leftPerc <= 20) {
        leftPerc = leftPerc + 18;
      } else {
        leftPerc = leftPerc + 15.5;
      }
      //leftPerc = leftPerc + 15.5;
      if (
        slotStartTime.isBetween(
          srCurrentStartTime,
          srCurrentEndTime,
          null,
          []
        ) &&
        slotEndTime.isBetween(srCurrentStartTime, srCurrentEndTime, null, [])
      ) {
        widthPerc = slotEndTime.diff(slotStartTime, "minute") * minuteWidthPerc;
      } else if (
        slotStartTime.isBefore(srCurrentStartTime) &&
        slotEndTime.isAfter(srCurrentEndTime)
      ) {
        widthPerc = 100;
      } else if (slotStartTime.isBefore(srCurrentStartTime)) {
        widthPerc =
          slotEndTime.diff(srCurrentStartTime, "minute") * minuteWidthPerc;
      } else if (slotEndTime.isAfter(srCurrentStartTime)) {
        widthPerc =
          srCurrentEndTime.diff(slotStartTime, "minute") * minuteWidthPerc;
      }
      widthPerc = widthPerc - 0.5;
      if (!si.IsAuthorized) {
        bookingclassName = "slotDetailsBlockedBooking";
      } else if (si.Status === Constants.slotStatus.COMPLETED) {
        bookingclassName = "slotDetailsCompletedBooking";
        bookingclassNameBar = "slotDetailsCompletedBookingBar";
      } else if (slotEndTime.isBefore(dayjs())) {
        bookingclassName = "slotDetailsPastBooking";
        bookingclassNameBar = "slotDetailsPastBookingBar";
      } else {
        bookingclassName = "slotDetailsFutureBooking";
        bookingclassNameBar = "slotDetailsFutureBookingBar";
      }
      if (leftPerc < 100) {
        bookedDivs.push(
          <TranslationConsumer>
            {(t) => (
              <div
                className={bookingclassName}
                style={{
                  left: leftPerc + "%",
                  width: widthPerc + "%",
                }}
              >
                {si.IsAuthorized ? (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => this.openSlotModifyModal(si)}
                  >
                    <div className={bookingclassNameBar}></div>
                    <div className="slotDetailsTransactionSpan">
                      <span>{si.TransactionCode}</span>
                    </div>
                    <div className="slotDetailsBookingSpan">
                      <span>{si.ReferenceNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="slotDetailsBookingSpan">
                    <span>{t("SlotUnauthorized")}</span>
                  </div>
                )}
              </div>
            )}
          </TranslationConsumer>
        );
      }
    });
    return bookedDivs;
  }
  openSlotModifyModal(slotInfo) {
    //debugger;
    this.stopRefreshTimer();
    this.filterAttributeMetaData(slotInfo.TransactionType.toString(), slotInfo);
    let modalSlotModifyFields = {
      slotTime: dayjs(slotInfo.StartTime).add(
        -1 * this.state.slotParameters.timeDifference,
        "minute"
      ),
      slotDuration: (
        slotInfo.NoOfSlots * this.state.slotParameters.slotDuration
      ).toString(),
      bayCode: slotInfo.LocationCode,
      transactionCode: slotInfo.TransactionCode,
      shareholder: slotInfo.ShareholderCode,
      remarks: slotInfo.Remarks,
    };
    let modelResultStatus = { modify: false, cancel: false };

    this.setState({
      isModifySlotOpen: true,
      isModifyModalrefreshing: true,
      selectedSlotInfo: slotInfo,
      modalValidationErrors: [],
      modelResultStatus,
    });
    if (slotInfo.TransportationType === Constants.TransportationType.ROAD) {
      if (
        slotInfo.TransactionType.toString() === Constants.slotSource.SHIPMENT
      ) {
        this.getTruckShipment(modalSlotModifyFields, "modify");
      } else {
        this.getTruckReceipt(modalSlotModifyFields, "modify");
      }
    } else if (
      slotInfo.TransportationType === Constants.TransportationType.MARINE
    ) {
      if (
        slotInfo.TransactionType.toString() === Constants.slotSource.SHIPMENT
      ) {
        this.getMarineShipment(modalSlotModifyFields, "modify");
      } else {
        this.getMarineReceipt(modalSlotModifyFields, "modify");
      }
    }
  }
  closeSlotModifyModal = () => {
    this.startRefreshTimer();
    let modalSlotModifyFields = {
      // transactionType: "",
      slotTime: dayjs(),
      bayCode: "",
      slotDuration: 0,
      remarks: "",
      shareholder: "",
      transactionCode: "",
      attributes: [],
    };
    let modalTransactionData = {
      products: [], //{Code,Quantity,UOM,shCode}
      driver: "",
      carrier: "",
      vehicle: "",
      status: "",
    };
    let modelResultStatus = { modify: false, cancel: false };

    this.setState({
      isModifySlotOpen: false,
      isModifyModalrefreshing: true,
      selectedSlotInfo: null,
      transactionData: null,
      modalTransactionData,
      modalSlotModifyFields,
      modalValidationErrors: [],
      modelResultStatus,
    });
  };
  openSlotCreateModal(transactionType, slotStartTime, bayCode) {
    this.stopRefreshTimer();
    this.filterAttributeMetaData(transactionType);
    let modalSlotCreateFields = {
      transactionType: transactionType,
      slotTime: slotStartTime,
      bayCode: bayCode,
      slotDuration: this.state.slotParameters.slotDuration,
      slotSource: transactionType,
      shareholder: this.props.userDetails.EntityResult.PrimaryShareholder,
      shipmentCode: "",
      receiptCode: "",
      orderCode: "",
      contractCode: "",
      remarks: "",
    };
    let requestTransactionInfoToBookSlot = {
      TerminalCode: this.props.terminal.Key.Code,
      TransportationType: this.props.transportationType,
      TransactionSource: modalSlotCreateFields.slotSource,
      LocationCode: modalSlotCreateFields.bayCode,
      ShareholderCode: modalSlotCreateFields.shareholder,
      CreatedFrom: Constants.shipmentFrom.None,
      TransactionSourceCode: "",
    };
    let modalSlotCreateList = {
      orders: [],
      filteredOrders: [],
      contracts: [],
      filteredcontracts: [],
      shipments: [],
      filteredshipments: [],
      receipts: [],
      filteredreceipts: [],
    };
    this.setState({
      isCreateSlotOpen: true,
      isCreateModalrefreshing: true,
      selectedSlotInfo: null,
      modalValidationErrors: [],
    });
    this.getAvailableTransactionsToBook(
      requestTransactionInfoToBookSlot,
      transactionType === Constants.slotSource.SHIPMENT
        ? "shipments"
        : "receipts",
      modalSlotCreateFields,
      modalSlotCreateList
    );
  }
  closeSlotCreateModal = () => {
    this.startRefreshTimer();
    let modalSlotCreateFields = {
      transactionType: "",
      slotTime: dayjs(),
      bayCode: "",
      slotDuration: this.state.slotParameters.slotDuration,
      slotSource: "",
      shareholder: this.props.userDetails.EntityResult.PrimaryShareholder,
      shipmentCode: "",
      receiptCode: "",
      orderCode: "",
      contractCode: "",
      remarks: "",
      attributes: [],
    };
    let modalTransactionData = {
      products: [], //{Code,Quantity,UOM,shCode}
      driver: "",
      carrier: "",
      vehicle: "",
      status: "",
    };
    let modalSlotCreateList = {
      orders: [],
      filteredOrders: [],
      contracts: [],
      filteredcontracts: [],
      shipments: [],
      filteredshipments: [],
      receipts: [],
      filteredreceipts: [],
    };
    this.setState({
      isCreateSlotOpen: false,
      isCreateModalrefreshing: true,
      modalSlotCreateFields,
      modalSlotCreateList,
      modalTransactionData,
      selectedSlotInfo: null,
      modalValidationErrors: [],
    });
  };
  handleModelOptionsSearchChange = (query, arrayName) => {
    try {
      let modalSlotCreateList = lodash.cloneDeep(
        this.state.modalSlotCreateList
      );
      let options = modalSlotCreateList[arrayName];
      let filteredOptions = options.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      if (filteredOptions.length > Constants.filteredOptionsCount) {
        filteredOptions = filteredOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }
      modalSlotCreateList["filtered" + arrayName] = filteredOptions;
      this.setState({
        modalSlotCreateList,
      });
    } catch (error) {
      console.log(
        "slotDetailsComposite:Error occured on handleModelOptionsSearchChange",
        error
      );
    }
  };


  cancelBooking = () => {
     
    let validationErrors = this.validateCancelSlot();
    if (validationErrors.length === 0) {
      let slotModifyFields = this.state.modalSlotModifyFields;
      let slotInfo = lodash.cloneDeep(this.state.selectedSlotInfo);
      slotInfo.Remarks = slotModifyFields.remarks;
     
      let showCancelSlotAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    let tempSlotInfo = lodash.cloneDeep(slotInfo);

      this.setState({ showCancelSlotAuthenticationLayout, tempSlotInfo }, () => {
        if (showCancelSlotAuthenticationLayout === false) {
          this.handleCancelBooking();
        }
    });

    } else {
      console.log("Error while Cancel Slot", validationErrors);
    }
     
    }

  handleCancelBooking = () => {
    this.handleAuthenticationClose();
    try {
      
      let tempSlotInfo = lodash.cloneDeep(this.state.tempSlotInfo);
      let modalValidationErrors = lodash.cloneDeep(this.state.modalValidationErrors);

      var obj = {
        ShareHolderCode: "",
        keyDataCode: 0,
        KeyCodes: null,
        Entity: tempSlotInfo,
      };
      this.setState({ isModifyModalrefreshing: true });

      axios(
        RestAPIs.CancelSlot,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          
          let result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let modelResultStatus = { modify: false, cancel: true };

              this.setState(
                {
                  modelResultStatus,
                  isModifyModalrefreshing: false,
                },
                () => {
                  if (this.props.operationsVisibilty.shipments) {
                    this.getSlotsList(Constants.slotSource.SHIPMENT);
                    this.getKPIList(Constants.slotSource.SHIPMENT);
                  }
                  if (this.props.operationsVisibilty.receipts) {
                    this.getSlotsList(Constants.slotSource.RECEIPT);
                    this.getKPIList(Constants.slotSource.RECEIPT);
                  }
                }
              );
            } else {
              modalValidationErrors.push("UnKnown_Error");
              this.setState({
                isModifyModalrefreshing: false,
                modalValidationErrors,
              });

               
              console.log("Error while Cancel Slot:", result);
            }
          } else {
            modalValidationErrors.push(
              result.ErrorList.length > 0
                ? result.ErrorList[0]
                : "UnKnown_Error"
            );

            this.setState({
              isModifyModalrefreshing: false,
              modalValidationErrors,
            });
            console.log("Error while  Cancle Slot:", result);
          }
        })
        .catch((error) => {
          modalValidationErrors.push("UnKnown_Error");
          this.setState({
            isModifyModalrefreshing: false,
            modalValidationErrors,
          });
           
          console.log("Error while  Cancel Slot:", error);
        });
     
    } catch (error) {
      console.log("Error while Cancel Slot", error);
    }
  };

  validateCancelSlot() {
    dayjs.extend(dayJSBetween);
    let validationErrors = [];
    let slotModifyFields = this.state.modalSlotModifyFields;
    let selectedSlotInfo = this.state.selectedSlotInfo;
    let slotParameters = this.state.slotParameters;
    let oldRemarks = selectedSlotInfo.Remarks;
    let newRemarks = slotModifyFields.remarks;
    if (newRemarks === null || newRemarks.length === 0) {
      validationErrors.push("OriginTerminal_RemarksRequired");
    } else if (newRemarks.length > 300) {
      validationErrors.push("Contract_Remarks_Exceeds_MaxLen");
    } else if (newRemarks === oldRemarks) {
      validationErrors.push("Remarks_Change_require");
    } else if (!newRemarks.match(/^[^!%<>?\[\]^`{}|~=]+$/)) {
      validationErrors.push("Remarks_Invalid");
    }
    if (this.props.transportationType === Constants.TransportationType.ROAD) {
      let slotCurrentStartTime = dayjs(selectedSlotInfo.StartTime);
      if (
        dayjs()
          .add(slotParameters.minSlotChangeMinutes, "minute")
          .isBefore(slotCurrentStartTime) === false
      ) {
        validationErrors.push("Slot_Booking_Closed");
      }
    }
    this.setState({ modalValidationErrors: validationErrors });
    return validationErrors;
  }


  updateSlotBooking = () => {
     
    let validationErrors = this.validateUpdateSlot();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      let attributesValidation = this.validateAttributes(attributeList);

      if (validationErrors.length === 0 && attributesValidation) {
        let slotModifyFields = this.state.modalSlotModifyFields;
        let slotParameters = this.state.slotParameters;
        let slotInfo = lodash.cloneDeep(this.state.selectedSlotInfo);
        slotInfo.Remarks = slotModifyFields.remarks;
        slotInfo.StartTime = slotModifyFields.slotTime
          .add(slotParameters.timeDifference, "minute")
          .toDate();
      
        slotInfo.EndTime = this.getSlotLTEndTimeForSave(
          slotModifyFields.slotTime,
          slotModifyFields.slotDuration
        )
          .add(slotParameters.timeDifference, "minute")
          .toDate();
        slotInfo.LocationCode = slotModifyFields.bayCode;
        slotInfo.Attributes = Utilities.fillAttributeDetails(attributeList);
       
        this.setState({ isModifyModalrefreshing: true });

        let showUpdateSlotAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
  
      let tempSlotInfo = lodash.cloneDeep(slotInfo);
        this.setState({ showUpdateSlotAuthenticationLayout, tempSlotInfo }, () => {
          if (showUpdateSlotAuthenticationLayout === false) {
            this.handleUpdateSlotBooking();
          }
      });
       
      } else {
        console.log("Error while Update Slot", validationErrors);
      }
     
    }

  handleUpdateSlotBooking = () => {
    this.handleAuthenticationClose();
    try {
     
      let tempSlotInfo = lodash.cloneDeep(this.state.tempSlotInfo);
      let modalValidationErrors = lodash.cloneDeep(this.state.modalValidationErrors);


      var obj = {
        ShareHolderCode: "",
        keyDataCode: 0,
        KeyCodes: null,
        Entity: tempSlotInfo,
      };

      axios(
        RestAPIs.UpdateSlot,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          // debugger;
          //console.log(response);

          let result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let modelResultStatus = { modify: true, cancel: false };

              this.setState(
                {
                  modelResultStatus,
                  selectedSlotInfo: tempSlotInfo,
                  isModifyModalrefreshing: false,
                },
                () => {
                  if (this.props.operationsVisibilty.shipments) {
                    this.getSlotsList(Constants.slotSource.SHIPMENT);
                    this.getKPIList(Constants.slotSource.SHIPMENT);
                  }
                  if (this.props.operationsVisibilty.receipts) {
                    this.getSlotsList(Constants.slotSource.RECEIPT);
                    this.getKPIList(Constants.slotSource.RECEIPT);
                  }
                }
              );
            } else {
              modalValidationErrors.push("UnKnown_Error");
              this.setState({
                isModifyModalrefreshing: false,
                modalValidationErrors,
              });

              console.log("Error while Update Slot:", result);
            }
          } else {
            modalValidationErrors.push(
              result.ErrorList.length > 0
                ? result.ErrorList[0]
                : "UnKnown_Error"
            );

            this.setState({
              isModifyModalrefreshing: false,
              modalValidationErrors,
            });

            console.log("Error while  Update Slot:", result);
          }
        })
        .catch((error) => {
          modalValidationErrors.push("UnKnown_Error");
          this.setState({
            isModifyModalrefreshing: false,
            modalValidationErrors,
          });

          console.log("Error while  Update Slot:", error);
        });
        
    } catch (error) {
      console.log("Error while Update Slot", error);
    }
  };
  validateUpdateSlot() {
    dayjs.extend(dayJSBetween);

    let validationErrors = [];
    let slotModifyFields = this.state.modalSlotModifyFields;
    let selectedSlotInfo = this.state.selectedSlotInfo;
    let slotParameters = this.state.slotParameters;
    let oldRemarks = selectedSlotInfo.Remarks;
    let newRemarks = slotModifyFields.remarks;
    if (newRemarks === null || newRemarks.length === 0) {
      validationErrors.push("OriginTerminal_RemarksRequired");
    } else if (newRemarks.length > 300) {
      validationErrors.push("Contract_Remarks_Exceeds_MaxLen");
    } else if (newRemarks === oldRemarks) {
      validationErrors.push("Remarks_Change_require");
    } else if (!newRemarks.match(/^[^!%<>?\[\]^`{}|~=]+$/)) {
      validationErrors.push("Remarks_Invalid");
    }
    let slotsList =
      selectedSlotInfo.TransactionType.toString() ===
        Constants.slotSource.SHIPMENT
        ? this.state.shipmentSlotsList
        : this.state.receiptSlotsList;
    let slotLTStartTime = slotModifyFields.slotTime;
    // let slotLTEndTime = slotModifyFields.slotTime.add(
    //   slotModifyFields.slotDuration,
    //   "minute"
    // );
    let slotLTEndTime = this.getSlotLTEndTimeForSave(
      slotModifyFields.slotTime,
      slotModifyFields.slotDuration
    );
    let slotCurrentStartTime = slotLTStartTime.add(
      slotParameters.timeDifference,
      "minute"
    );
    let slotCurrentEndTime = slotLTEndTime.add(
      slotParameters.timeDifference,
      "minute"
    );
    if (
      dayjs()
        .add(slotParameters.minSlotChangeMinutes, "minute")
        .isBefore(slotCurrentStartTime) === false
    ) {
      validationErrors.push("Slot_Booking_Closed");
    }
    //debugger;
    let tempdayLTStartTime = slotParameters.slotStartTime;
    let tempdayLTEndTime = slotParameters.slotEndTime;
    let startDaysDiff = slotLTStartTime.diff(tempdayLTStartTime, "day");
    tempdayLTStartTime = tempdayLTStartTime.add(startDaysDiff, "day");
    tempdayLTEndTime = tempdayLTEndTime.add(startDaysDiff, "day");
    if (
      !slotLTStartTime.isBetween(
        tempdayLTStartTime,
        tempdayLTEndTime,
        "minute",
        "[)"
      )
    ) {
      tempdayLTStartTime = tempdayLTStartTime.add(-1, "day");
      tempdayLTEndTime = tempdayLTEndTime.add(-1, "day");
    }

    let localTime = dayjs()
      .add(-1 * slotParameters.timeDifference, "minute")
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    if (
      tempdayLTStartTime
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .diff(localTime, "day") >= slotParameters.maxSlotDaysToBook
    ) {
      validationErrors.push("Slot_Booking_Closed");
    }
    if (this.props.transportationType === Constants.TransportationType.ROAD) {
      if (slotLTEndTime.isAfter(tempdayLTEndTime)) {
        validationErrors.push("Slot_End_Time_Crossed_Day");
      }
    }
    slotsList.forEach((si) => {
      let startTime = dayjs(si.StartTime);
      let endTime = dayjs(si.EndTime);
      if (
        si.LocationCode === slotModifyFields.bayCode &&
        si.TransactionCode !== selectedSlotInfo.TransactionCode &&
        (startTime.isBetween(
          slotCurrentStartTime,
          slotCurrentEndTime,
          "minute",
          "[)"
        ) ||
          endTime.isBetween(
            slotCurrentStartTime,
            slotCurrentEndTime,
            "minute",
            "(]"
          ) ||
          (startTime.diff(slotCurrentStartTime, "minute") === 0 &&
            endTime.diff(slotCurrentEndTime, "minute") === 0))
      ) {
        validationErrors.push("Selected_Slot_Not_Available");
      }
    });
    this.setState({ modalValidationErrors: validationErrors });
    return validationErrors;
  }


  bookSlot = () => {
     
    let attributeList = Utilities.attributesConverttoLocaleString(
      this.state.modAttributeMetaDataList
    );
    let validationErrors = this.validateBookSlot();
    let attributesValidation = this.validateAttributes(attributeList);
    
    if (validationErrors.length === 0 && attributesValidation) {
      let slotCreateFields = this.state.modalSlotCreateFields;
      let slotParameters = this.state.slotParameters;

      let slotInfo = {
        Remarks: slotCreateFields.remarks,
        TransactionType: slotCreateFields.transactionType,
        TransactionCode:
          slotCreateFields.transactionType === Constants.slotSource.SHIPMENT
            ? slotCreateFields.shipmentCode
            : slotCreateFields.receiptCode,
        Status: Constants.slotStatus.BOOKED,
        StartTime: slotCreateFields.slotTime
          .add(slotParameters.timeDifference, "minute")
          .toDate(),
        EndTime: this.getSlotLTEndTimeForSave(
          slotCreateFields.slotTime,
          slotCreateFields.slotDuration
        )
          .add(slotParameters.timeDifference, "minute")
          .toDate(),
        LocationCode: slotCreateFields.bayCode,
        ShareholderCode: slotCreateFields.shareholder,
        TerminalCode: slotParameters.terminalCode,
        TransportationType: this.props.transportationType,
        Attributes: Utilities.fillAttributeDetails(attributeList),
      };

      let showBookSlotAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    let tempSlotInfo = lodash.cloneDeep(slotInfo);
      this.setState({ showBookSlotAuthenticationLayout, tempSlotInfo }, () => {
        if (showBookSlotAuthenticationLayout === false) {
          this.handleBookSlot();
        }
    });

    } else {
      console.log("Error while Booking Slot", validationErrors);
    } 
    }

    handleBookSlot = () => {
      this.handleAuthenticationClose();
      let tempSlotInfo = lodash.cloneDeep(this.state.tempSlotInfo);
      let modalValidationErrors = lodash.cloneDeep(this.state.modalValidationErrors);
      var obj = {
        ShareHolderCode: "",
        keyDataCode: 0,
        KeyCodes: null,
        Entity: tempSlotInfo,
      };
      this.setState({
        isCreateModalrefreshing: true,
        selectedSlotInfo: null,
      });

    try {
       
      axios(
        RestAPIs.BookSlot,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {

          let result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              this.setState(
                {
                  selectedSlotInfo: result.EntityResult,
                  isCreateModalrefreshing: false,
                },
                () => {
                  if (this.props.operationsVisibilty.shipments) {
                    this.getSlotsList(Constants.slotSource.SHIPMENT);
                    this.getKPIList(Constants.slotSource.SHIPMENT);
                  }
                  if (this.props.operationsVisibilty.receipts) {
                    this.getSlotsList(Constants.slotSource.RECEIPT);
                    this.getKPIList(Constants.slotSource.RECEIPT);
                  }
                }
              );
            } else {
              modalValidationErrors.push("UnKnown_Error");
              this.setState({
                isCreateModalrefreshing: true,
                selectedSlotInfo: null,
                modalValidationErrors: modalValidationErrors,
              });

              console.log("Error while Booking Slot:", result);
            }
          } else {
            modalValidationErrors.push(
              result.ErrorList.length > 0
                ? result.ErrorList[0]
                : "UnKnown_Error"
            );
            this.setState({
              isCreateModalrefreshing: false,
              selectedSlotInfo: null,
              modalValidationErrors,
            });

            console.log("Error while Booking Slot:", result);
          }
        })
        .catch((error) => {
          modalValidationErrors.push("UnKnown_Error");
          this.setState({
            isCreateModalrefreshing: false,
            selectedSlotInfo: null,
            modalValidationErrors,
          });

          console.log("Error while Booking Slot:", error);
        });
     
    } catch (error) {
      console.log("Error while Booking Slot", error);
    }
  };

  validateAttributes(attributeList) {
    let returnValue = true;

    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );

    let matchedAttributesList = attributeList.filter(
      (modattribute) =>
        modattribute.TerminalCode === this.state.slotParameters.terminalCode
    );
    if (
      matchedAttributesList.length > 0 &&
      Array.isArray(matchedAttributesList[0].attributeMetaDataList) &&
      matchedAttributesList[0].attributeMetaDataList.length > 0
    ) {
      matchedAttributesList[0].attributeMetaDataList.forEach((modattribute) => {
        attributeValidationErrors[modattribute.Code] =
          Utilities.valiateAttributeField(
            modattribute,
            modattribute.DefaultValue
          );
      });
      returnValue = Object.values(attributeValidationErrors).every(function (
        value
      ) {
        return value === "";
      });
    }

    this.setState({ attributeValidationErrors });
    return returnValue;
  }

  validateBookSlot() {
    dayjs.extend(dayJSBetween);
    let validationErrors = [];
    let slotCreateFields = this.state.modalSlotCreateFields;
    let slotParameters = this.state.slotParameters;
    let remarks = slotCreateFields.remarks;
    if (remarks === null || remarks.length === 0) {
    } else if (remarks.length > 300) {
      validationErrors.push("Contract_Remarks_Exceeds_MaxLen");
    } else if (!remarks.match(/^[^!%<>?\[\]^`{}|~=]+$/)) {
      validationErrors.push("Remarks_Invalid");
    }
    let slotsList =
      slotCreateFields.transactionType.toString() ===
        Constants.slotSource.SHIPMENT
        ? this.state.shipmentSlotsList
        : this.state.receiptSlotsList;

    let slotLTStartTime = slotCreateFields.slotTime;
    // let slotLTEndTime = slotCreateFields.slotTime.add(
    //   slotCreateFields.slotDuration,
    //   "minute"
    // );
    let slotLTEndTime = this.getSlotLTEndTimeForSave(
      slotCreateFields.slotTime,
      slotCreateFields.slotDuration
    );
    let slotCurrentStartTime = slotLTStartTime.add(
      slotParameters.timeDifference,
      "minute"
    );
    let slotCurrentEndTime = slotLTEndTime.add(
      slotParameters.timeDifference,
      "minute"
    );
    if (
      dayjs()
        .add(slotParameters.minSlotMinutesToBook, "minute")
        .isBefore(slotCurrentStartTime) === false
    ) {
      validationErrors.push("Slot_Booking_Closed");
    }
    if (this.props.transportationType === Constants.TransportationType.ROAD) {
      if (slotLTEndTime.isAfter(slotParameters.slotEndTime)) {
        validationErrors.push("Slot_End_Time_Crossed_Day");
      }
    }
    slotsList.forEach((si) => {
      let startTime = dayjs(si.StartTime);
      let endTime = dayjs(si.EndTime);
      if (
        si.LocationCode === slotCreateFields.bayCode &&
        (startTime.isBetween(
          slotCurrentStartTime,
          slotCurrentEndTime,
          "minute",
          "[)"
        ) ||
          endTime.isBetween(
            slotCurrentStartTime,
            slotCurrentEndTime,
            "minute",
            "(]"
          ) ||
          (startTime.diff(slotCurrentStartTime, "minute") === 0 &&
            endTime.diff(slotCurrentEndTime, "minute") === 0))
      ) {
        validationErrors.push("Selected_Slot_Not_Available");
      }
    });
    this.setState({ modalValidationErrors: validationErrors });
    return validationErrors;
  }
  getSlotLTEndTimeForSave(startLTTime, duration) {
    //debugger;
    dayjs.extend(dayJSBetween);
    let slotParameters = this.state.slotParameters;
    let tempdayLTStartTime = slotParameters.slotStartTime;
    let tempdayLTEndTime = slotParameters.slotEndTime;
    let startDaysDiff = startLTTime.diff(tempdayLTStartTime, "day");
    tempdayLTStartTime = tempdayLTStartTime.add(startDaysDiff, "day");
    tempdayLTEndTime = tempdayLTEndTime.add(startDaysDiff, "day");
    if (
      !startLTTime.isBetween(
        tempdayLTStartTime,
        tempdayLTEndTime,
        "minute",
        "[)"
      )
    ) {
      tempdayLTStartTime = tempdayLTStartTime.add(-1, "day");
      tempdayLTEndTime = tempdayLTEndTime.add(-1, "day");
    }

    let tempDuarion = duration;
    let ltEndTime = startLTTime;
    while (tempDuarion !== 0) {
      if (ltEndTime.add(tempDuarion, "minute").isAfter(tempdayLTEndTime)) {
        tempdayLTStartTime = tempdayLTStartTime.add(1, "day");
        tempDuarion = tempDuarion - tempdayLTEndTime.diff(ltEndTime, "minute");
        tempdayLTEndTime = tempdayLTEndTime.add(1, "day");
        ltEndTime = tempdayLTStartTime;
      } else {
        ltEndTime = ltEndTime.add(tempDuarion, "minute");
        tempDuarion = 0;
      }
    }
    return ltEndTime;
  }

  getBaySelectionControl(bays, slotSource) {
    let bayOptions = [];

    bayOptions.push({ value: "-1", text: "All" });
    bays.forEach((bay) => {
      bayOptions.push({ value: bay.bayCode, text: bay.bayCode });
    });

    return (
      <TranslationConsumer>
        {(t) => (
          <Select
            fluid
            value={
              slotSource === Constants.slotSource.SHIPMENT
                ? this.state.filteredShipmentBayCode
                : this.state.filteredReceiptBayCode
            }
            options={bayOptions}
            onChange={(data) => {
              if (slotSource === Constants.slotSource.SHIPMENT) {
                this.setState({ filteredShipmentBayCode: data });
              } else {
                this.setState({ filteredReceiptBayCode: data });
              }
            }}
            reserveSpace={false}
            search={true}
          />
        )}
      </TranslationConsumer>
    );
  }

  getSlotListLayOut(slotSource, slotsList, isRefreshing) {
    if (isRefreshing) {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    } else {
      // debugger;
      let selectedSlotRange = this.state.selectedSlotRange;
      let slotParams = this.state.slotParameters;
      let slotTimes = []; //{fromLTTime,fromCurrentTime,ToLTTime,ToCurrentTime}
      let tempslotStartTime = selectedSlotRange.fromLTTime;
      let tempslotEndTime = selectedSlotRange.toLTTime;
      let minuteWidthPerc =
        (100 - 16) / tempslotEndTime.diff(tempslotStartTime, "minute");
      let bayList = this.state.bayList;
      let filteredBays = [];
      if (slotSource === Constants.slotSource.SHIPMENT) {
        filteredBays = bayList.filter(
          (bay) => bay.bayType === "BOTH" || bay.bayType === "LOADING"
        );
      } else {
        filteredBays = bayList.filter(
          (bay) => bay.bayType === "BOTH" || bay.bayType === "UNLOADING"
        );
      }
      let paginationBays = [];
      let selectedBay = "";
      if (slotSource === Constants.slotSource.SHIPMENT) {
        selectedBay = this.state.filteredShipmentBayCode;
      } else {
        selectedBay = this.state.filteredReceiptBayCode;
      }
      if (selectedBay === "-1") {
        if (filteredBays.length > 0) {
          let currentPageIndex =
            slotSource === Constants.slotSource.SHIPMENT
              ? this.state.shipmentPageIndex
              : this.state.receiptPageIndex;
          let firstIndexInPage = (currentPageIndex - 1) * pageSize;
          let lastIndexInPage = firstIndexInPage + pageSize;
          if (lastIndexInPage >= filteredBays.length) {
            lastIndexInPage = filteredBays.length;
          }
          paginationBays = filteredBays.slice(
            firstIndexInPage,
            lastIndexInPage
          );
        }
      } else {
        paginationBays = filteredBays.filter(
          (bay) => bay.bayCode === selectedBay
        );
      }
      let currentTime = dayjs();
      let ltCurrentTime = currentTime.add(
        -1 * slotParams.timeDifference,
        "minute"
      );
      let minTimeForBook = currentTime.add(
        slotParams.minSlotMinutesToBook,
        "minute"
      );
      // let maxDaysBeforeBookDate = ltCurrentTime.add(
      //   slotParams.maxSlotDaysToBook,
      //   "day"
      // );
      // let tempSlNo=1
      while (tempslotStartTime.isBefore(tempslotEndTime)) {
        slotTimes.push({
          fromLTTime: tempslotStartTime,
          fromCurrentTime: tempslotStartTime.add(
            slotParams.timeDifference,
            "minute"
          ),
          toLTTime: tempslotStartTime.add(slotParams.slotDuration, "minute"),
          toCurrentTime: tempslotStartTime
            .add(slotParams.slotDuration, "minute")
            .add(slotParams.timeDifference, "minute"),
        });
        tempslotStartTime = tempslotStartTime.add(
          slotParams.slotDuration,
          "minute"
        );
      }
      return (
        <div
          className=" tableScroll tableSlotScroll"
          style={{ overflowY: "hidden" }}
        >
          <div style={{ display: "flex", minWidth: "800px" }}>
            <div className="slotBaySelection">
              {this.getBaySelectionControl(filteredBays, slotSource)}
            </div>
            {slotTimes.map((st) => {
              return (
                <ErrorBoundary>
                  <div
                    style={{
                      width: "12%",
                      textAlign: "center",

                      margin: "auto",
                    }}
                  >
                    <span style={{ paddingTop: "0.438rem" }}>
                      {st.fromLTTime.format("HH:mm")}
                    </span>
                  </div>
                </ErrorBoundary>
              );
            })}
          </div>
          {paginationBays.map((bay) => {
            //debugger;
            return (
              <ErrorBoundary>
                <div className={bay.active ? "" : "slotInActiveBay"}>
                  <div className="slotDetailsBayBar">
                    <div className="slotDetailsBayDiv">
                      <div>
                        <span className="slotDetailsBayFont">
                          {bay.bayCode}
                        </span>
                      </div>

                      <div>
                        {this.getbayFinishedProductPopover(bay.shareholder)}
                      </div>
                    </div>
                    {slotTimes.map((st) => {
                      return (
                        <ErrorBoundary>
                          <div className="slotDetailsSlotsDiv">
                            <div className="slotDetailsAddIconDiv">
                              {minTimeForBook.isBefore(st.fromCurrentTime) &&
                                this.state.selectedDate.diff(
                                  ltCurrentTime,
                                  "day"
                                ) < slotParams.maxSlotDaysToBook &&
                                // maxDaysBeforeBookDate.isAfter(
                                //   st.fromLTTime,
                                //   "day"
                                // ) &&
                                bay.active &&
                                this.props.operationsVisibilty.add ? (
                                <div
                                  // className="iconCircle iconblock"
                                  onClick={() =>
                                    this.openSlotCreateModal(
                                      slotSource,
                                      st.fromLTTime,
                                      bay.bayCode
                                    )
                                  }
                                >
                                  <Icon
                                    style={{ cursor: "pointer" }}
                                    root="common"
                                    name="badge-plus"
                                    exactSize={30}
                                  ></Icon>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </ErrorBoundary>
                      );
                    })}

                    {this.getBookedSlotsLayoutforBay(
                      slotSource,
                      slotsList,
                      minuteWidthPerc,
                      bay.bayCode
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            );
          })}
        </div>
      );
    }
  }

  buildPaging(slotSource) {
    let bayList = this.state.bayList;
    let selectedBay = "-1";
    let filteredBays = [];
    if (slotSource === Constants.slotSource.SHIPMENT) {
      filteredBays = bayList.filter(
        (bay) => bay.bayType === "BOTH" || bay.bayType === "LOADING"
      );
      selectedBay = this.state.filteredShipmentBayCode;
    } else {
      filteredBays = bayList.filter(
        (bay) => bay.bayType === "BOTH" || bay.bayType === "UNLOADING"
      );
      selectedBay = this.state.filteredReceiptBayCode;
    }
    if (filteredBays.length > pageSize && selectedBay === "-1") {
      return (
        <ErrorBoundary>
          <Pagination
            totalItems={filteredBays.length}
            itemsPerPage={pageSize}
            activePage={
              slotSource === Constants.slotSource.SHIPMENT
                ? this.state.shipmentPageIndex
                : this.state.receiptPageIndex
            }
            onPageChange={(page) => {
              if (slotSource === Constants.slotSource.SHIPMENT) {
                this.setState({ shipmentPageIndex: page });
              } else {
                this.setState({ receiptPageIndex: page });
              }
            }}
          ></Pagination>
        </ErrorBoundary>
      );
    } else return "";
  }

  getTabControl() {
    if (
      this.props.operationsVisibilty.shipments &&
      this.props.operationsVisibilty.receipts
    ) {
      return (
        <TranslationConsumer>
          {(t) => (
            <Tab
              activeIndex={this.props.defaultTabIndex}
              onTabChange={(activeIndex) => {
                this.props.onTabChange(activeIndex);
              }}
            >
              <Tab.Pane title={t("Common_Shipments")}>
                <div>
                  <ErrorBoundary>
                    {this.getSlotListLayOut(
                      Constants.slotSource.SHIPMENT,
                      this.state.shipmentSlotsList,
                      this.state.isShipmentsRefreshing
                    )}
                  </ErrorBoundary>
                  {this.buildPaging(Constants.slotSource.SHIPMENT)}
                </div>
              </Tab.Pane>

              <Tab.Pane title={t("Common_Receipts")}>
                <div>
                  <ErrorBoundary>
                    {this.getSlotListLayOut(
                      Constants.slotSource.RECEIPT,
                      this.state.receiptSlotsList,
                      this.state.isReceiptsRefreshing
                    )}
                  </ErrorBoundary>
                  {this.buildPaging(Constants.slotSource.RECEIPT)}
                </div>
              </Tab.Pane>
            </Tab>
          )}
        </TranslationConsumer>
      );
    } else if (this.props.operationsVisibilty.shipments) {
      return (
        <TranslationConsumer>
          {(t) => (
            <Tab
              activeIndex={this.props.defaultTabIndex}
              onTabChange={(activeIndex) => {
                this.props.onTabChange(activeIndex);
              }}
            >
              <Tab.Pane title={t("Common_Shipments")}>
                <div>
                  {" "}
                  <ErrorBoundary>
                    {this.getSlotListLayOut(
                      Constants.slotSource.SHIPMENT,
                      this.state.shipmentSlotsList,
                      this.state.isShipmentsRefreshing
                    )}
                  </ErrorBoundary>
                  {this.buildPaging(Constants.slotSource.SHIPMENT)}
                </div>
              </Tab.Pane>
            </Tab>
          )}
        </TranslationConsumer>
      );
    } else if (this.props.operationsVisibilty.receipts) {
      return (
        <TranslationConsumer>
          {(t) => (
            <Tab
              activeIndex={this.props.defaultTabIndex}
              onTabChange={(activeIndex) => {
                this.props.onTabChange(activeIndex);
              }}
            >
              <Tab.Pane title={t("Common_Receipts")}>
                <div>
                  {" "}
                  <ErrorBoundary>
                    {this.getSlotListLayOut(
                      Constants.slotSource.RECEIPT,
                      this.state.receiptSlotsList,
                      this.state.isReceiptsRefreshing
                    )}
                  </ErrorBoundary>
                  {this.buildPaging(Constants.slotSource.RECEIPT)}
                </div>
              </Tab.Pane>
            </Tab>
          )}
        </TranslationConsumer>
      );
    }
  }

  getSlotKPIsPane() {
    if (
      this.props.operationsVisibilty.shipments &&
      this.props.operationsVisibilty.receipts
    ) {
      if (
        this.props.defaultTabIndex === 0 &&
        Array.isArray(this.state.kpiList[Constants.slotSource.SHIPMENT])
      ) {
        return (
          <ErrorBoundary>
            <KPIDashboardLayout
              kpiList={this.state.kpiList[Constants.slotSource.SHIPMENT]}
              pageName="SlotDetails"
            ></KPIDashboardLayout>
          </ErrorBoundary>
        );
      } else if (
        this.props.defaultTabIndex === 1 &&
        Array.isArray(this.state.kpiList[Constants.slotSource.RECEIPT])
      ) {
        return (
          <ErrorBoundary>
            <KPIDashboardLayout
              kpiList={this.state.kpiList[Constants.slotSource.RECEIPT]}
              pageName="SlotDetails"
            ></KPIDashboardLayout>
          </ErrorBoundary>
        );
      } else {
        return "";
      }
    } else if (this.props.operationsVisibilty.shipments) {
      if (Array.isArray(this.state.kpiList[Constants.slotSource.SHIPMENT])) {
        return (
          <ErrorBoundary>
            <KPIDashboardLayout
              kpiList={this.state.kpiList[Constants.slotSource.SHIPMENT]}
              pageName="SlotDetails"
            ></KPIDashboardLayout>
          </ErrorBoundary>
        );
      } else {
        return "";
      }
    } else if (this.props.operationsVisibilty.receipts) {
      if (Array.isArray(this.state.kpiList[Constants.slotSource.RECEIPT])) {
        return (
          <ErrorBoundary>
            <KPIDashboardLayout
              kpiList={this.state.kpiList[Constants.slotSource.RECEIPT]}
              pageName="SlotDetails"
            ></KPIDashboardLayout>
          </ErrorBoundary>
        );
      } else {
        return "";
      }
    } else {
      return "";
    }
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
      // this.setState({
      //   attribute: attribute,
      // });
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors[attribute.Code] =
        Utilities.valiateAttributeField(attribute, value);

      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "SlotDetailsComposite:Error occured on onAttributeDataChange",
        error
      );
    }
  };


  handleAuthenticationClose = () => {
    this.setState({
    showBookSlotAuthenticationLayout: false,
    showUpdateSlotAuthenticationLayout: false,
    showCancelSlotAuthenticationLayout: false,
    });
  };

 

   getOperationMode() {
    if(this.state.showBookSlotAuthenticationLayout)
       return  functionGroups.add;
    else if (this.state.showUpdateSlotAuthenticationLayout)
      return functionGroups.modify;
      else if (this.state.showCancelSlotAuthenticationLayout)
      return functionGroups.remove;
   };

 
   handleOperation()  {
  
    if(this.state.showBookSlotAuthenticationLayout)
      return this.handleBookSlot
    else if(this.state.showUpdateSlotAuthenticationLayout)
      return this.handleUpdateSlotBooking
    else if(this.state.showCancelSlotAuthenticationLayout)
      return this.handleCancelBooking
     
 };


  render() {
    //console.log(this.state.slotRange);
    let selectedDate = this.state.selectedDate;

    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            {this.getSlotKPIsPane()}

            <div className="slotLayoutOuterPane">
              <div className="slotDetailsPane">
                <div className="row lightBackground">
                  <div className="col-12 col-md-7 col-lg-8 slotDateColHeader">
                    <div className="slotBlocksDispaly">
                      <div>
                        <Icon
                          onClick={() => this.handleDateChanage(-1)}
                          style={{ cursor: "pointer" }}
                          root="common"
                          name="double-caret-left"
                          exactSize={24}
                        ></Icon>
                      </div>
                      <div className="slotDateSpan">
                        <span>{selectedDate.format("DD-MMM-YYYY")}</span>
                      </div>

                      <div>
                        <Icon
                          onClick={() => this.handleDateChanage(1)}
                          style={{ cursor: "pointer" }}
                          root="common"
                          name="double-caret-right"
                          exactSize={24}
                        ></Icon>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-md-5 col-lg-4 "
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <Icon
                        onClick={() => {
                          if (this.state.selectedSlotRange.slNo > 1)
                            this.moveTimeRange(-1);
                        }}
                        style={{ cursor: "pointer" }}
                        root="common"
                        name="double-caret-left"
                        exactSize={16}
                        disabled={true}
                      ></Icon>
                    </div>
                    <div className="slotTimeRangeDDL">
                      <Select
                        fluid
                        value={this.state.selectedSlotRange.slNo}
                        options={this.getFilteredTimeRangeOptions(true)}
                        onChange={(data) => {
                          this.handleTimeRangeChange(data);
                        }}
                        reserveSpace={false}
                      />
                    </div>
                    <div className="slotTimeRangeDDL">
                      <Select
                        fluid
                        value={this.state.selectedSlotRange.slNo}
                        options={this.getFilteredTimeRangeOptions(false)}
                        disabled={true}
                        reserveSpace={false}
                      />
                    </div>
                    <div>
                      <Icon
                        onClick={() => {
                          if (
                            this.state.selectedSlotRange.slNo <
                            this.state.slotRangeList.length
                          )
                            this.moveTimeRange(-1);
                          this.moveTimeRange(1);
                        }}
                        style={{ cursor: "pointer" }}
                        root="common"
                        name="double-caret-right"
                        exactSize={16}
                      ></Icon>
                    </div>
                  </div>
                </div>
                {this.getTabControl()}
                {/* <Tab
                  activeIndex={this.props.defaultTabIndex}
                  onTabChange={(activeIndex) => {
                    this.props.onTabChange(activeIndex);
                  }}
                >
                  <Tab.Pane title={t("Common_Shipments")}>
                    {this.getSlotListLayOut()}
                  </Tab.Pane>
                  <Tab.Pane title={t("Common_Receipts")}>
                    {this.getSlotListLayOut()}
                  </Tab.Pane>
                </Tab> */}
              </div>
            </div>
            <Button
              className="backButton"
              onClick={this.props.onBackClick}
              content={t("Back")}
            ></Button>
            <ErrorBoundary>
              <CreateSlotComposite
                modelOpen={this.state.isCreateSlotOpen}
                slotCreateFields={this.state.modalSlotCreateFields}
                shareholders={Utilities.transferListtoOptions(
                  this.props.terminal.Value
                )}
                slotInfo={this.state.selectedSlotInfo}
                slotCreateOptions={this.state.modalSlotCreateList}
                transactionData={this.state.modalTransactionData}
                isRefreshing={this.state.isCreateModalrefreshing}
                transportationType={this.props.transportationType}
                slotParameters={this.state.slotParameters}
                bayList={this.state.bayList}
                validationErrors={this.state.modalValidationErrors}
                attributeValidationErrors={this.state.attributeValidationErrors}
                attributesList={this.state.modAttributeMetaDataList}
                modelCloseEvent={this.closeSlotCreateModal}
                onChange={this.handleSlotCreateFieldsChange}
                onAttributeDataChange={this.handleAttributeDataChange}
                onSearchChange={this.handleModelOptionsSearchChange}
                onBook={this.bookSlot}
              ></CreateSlotComposite>
            </ErrorBoundary>
            <ErrorBoundary>
              <ModifySlotComposite
                modelOpen={this.state.isModifySlotOpen}
                isRefreshing={this.state.isModifyModalrefreshing}
                slotModifyFields={this.state.modalSlotModifyFields}
                slotInfo={this.state.selectedSlotInfo}
                slotParameters={this.state.slotParameters}
                transactionData={this.state.modalTransactionData}
                bayList={this.state.bayList}
                modifyAccess={this.props.operationsVisibilty.modify}
                cancelAccess={this.props.operationsVisibilty.cancel}
                validationErrors={this.state.modalValidationErrors}
                attributeValidationErrors={this.state.attributeValidationErrors}
                attributesList={this.state.modAttributeMetaDataList}
                resultStatus={this.state.modelResultStatus}
                onChange={this.handleSlotModifyFieldsChange}
                onAttributeDataChange={this.handleAttributeDataChange}
                modelCloseEvent={this.closeSlotModifyModal}
                onModify={this.updateSlotBooking}
                onCancel={this.cancelBooking}
              ></ModifySlotComposite>
            </ErrorBoundary>
            {this.state.showBookSlotAuthenticationLayout||
          this.state.showUpdateSlotAuthenticationLayout ||
          this.state.showCancelSlotAuthenticationLayout   
         ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getOperationMode()}
            functionGroup={fnSlotInformation}
            handleOperation={this.handleOperation()}
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

export default connect(mapStateToProps)(SlotDetailsComposite);

SlotDetailsComposite.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  terminal: PropTypes.object.isRequired,
  slotConfigurations: PropTypes.array.isRequired,
  transportationType: PropTypes.string.isRequired,
  defaultTabIndex: PropTypes.number.isRequired,
  attributeMetaData: PropTypes.object.isRequired,
  operationsVisibilty: PropTypes.shape({
    add: PropTypes.bool,
    shipments: PropTypes.bool,
    receipts: PropTypes.bool,
    terminal: PropTypes.bool,
  }).isRequired,

  onBackClick: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
};
