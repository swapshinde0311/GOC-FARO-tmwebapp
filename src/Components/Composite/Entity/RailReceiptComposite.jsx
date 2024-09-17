import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { RailReceiptSummaryPageComposite } from "../Summary/RailReceiptSummaryComposite";
import RailReceiptDetailsComposite from "../Details/RailReceiptDetailsComposite";
import RailReceiptManualEntryComposite from "../Details/RailReceiptManualEntryComposite";
import RailReceiptViewAuditTrailDetailsComposite from "../Details/RailReceiptViewAuditTrailDetailsComposite";
import RailReceiptRecordWeightDetailsComposite from "../Details/RailReceiptRecordWeightDetailsComposite";
import RailReceiptLoadSpotAssignComposite from "../Details/RailReceiptLoadSpotAssignComposite";
import { RailReceiptUnLoadingDetails } from "../../UIBase/Details/RailReceiptUnLoadingDetails";
import axios from "axios";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import lodash from "lodash";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnRailReceipt,
  fnKPIInformation,
  fnCloseRailReceipt,
  fnPrintRailBOD,
  fnPrintRailRAN, 
  fnViewRailReceipt,
} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Input, Modal } from "@scuf/common";
import { railReceiptValidationDef } from "../../../JS/ValidationDef";
import { emptyRailReceipt } from "../../../JS/DefaultEntities";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
//import TransactionSummaryOperationsMarine from "../Common/TransactionSummaryOperationsMarine";
import { kpiRailReceiptList } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RailReceiptComposite extends Component {
  state = {
    railReceipt: lodash.cloneDeep(emptyRailReceipt),
    receiptItem: {},
    isShowRightPanel: false,
    isDetails: "false",
    isRecordWeight: "false",
    isViewAuditTrail: "false",
    isViewUnloadingDetails: "false",
    isMunalEntry: "false",
    isLoadSpotAssign: false,
    ViewUnloadingData: [],
    ViewUnloadingHideFields: [],
    isReadyToRender: false,
    isOperation: false,
    reason: "",
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    loadingDetails: [],
    loadingDetailsHideFields: [],
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    terminalCodes: [],
    openReceipt: false,
    railReceiptBtnCloseOK: false,
    NextOperations: [],
    currentStatuses: [],
    lastStatus: "",
    railReceiptType: "",
    modWeight: {},
    viewTab: 0,
    validationErrors: Utilities.getInitialValidationErrors(
      railReceiptValidationDef
    ),
    enableHSEInspection: true,
    attributeRailReceiptDataList: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],
    saveEnabled: false,
    tabActiveIndex: 0,
    railLookUpData: {},
    showReport: false,
    drawerStatus: false,
    currentAccess: {},
    railReceiptKPIList: [],
    railReceiptDeleteStates: [],
    activityInfo: [],
    showDeleteAuthenticationLayout: false,
    showAuthorizeToUnLoadAuthenticationLayout: false,
    showCloseReceiptAuthenticationLayout: false,
    showViewBODAuthenticationLayout: false,
    showPrintBODAuthenticationLayout:false,
    showRANAuthenticationLayout: false,
  };

  componentName = "RailReceiptComponent";

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: {},
        operationsVisibilty,
        viewTab: 0,
        isShowRightPanel: false,
        drawerStatus: false,
      });
    } catch (error) {
      console.log("RailDisatchComposite:Error occured on handleAdd");
    }
  };

  

  handleDelete = () => {
    this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteRailReceiptKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var RailReceiptCode = this.state.selectedItems[i]["Common_Code"];
        var shCode = this.state.selectedShareholder;
        var KeyData = {
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.railReceiptCode, Value: RailReceiptCode }],
        };
        deleteRailReceiptKeys.push(KeyData);
      }

      axios(
        RestAPIs.DeleteRailReceipt,
        Utilities.getAuthenticationObjectforPost(
          deleteRailReceiptKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.IsSuccess;
          if (
            response.data.ResultDataList !== null &&
            result.ResultDataList !== undefined
          ) {
            var failedResultsCount = result.ResultDataList.filter(function (
              res
            ) {
              return !res.IsSuccess;
            }).length;
            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else isRefreshDataRequire = true;
          }
          var notification = Utilities.convertResultsDatatoNotification(
            result,
            "RailReceipt_DeletionStatus",
            ["RailReceiptCode"]
          );

          if (
            result.ErrorList !== null &&
            result.ErrorList !== undefined &&
            result.ErrorList.length > 0 &&
            notification.messageResultDetails.length === 0
          ) {
            notification.message =
              result.ErrorList[0] === "ERRMSG_EXCEPTION_IN_WEBAPI"
                ? "CannotDeleteRailTransaction"
                : result.ErrorList[0];
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical"; //TODO:Localize
          }

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getRailReceiptList(shCode);
            this.getKPIList();
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              isShowRightPanel: false,
              operationsVisibilty,
              selectedRow: {},
            });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0) {
              messageResult.keyFields[0] = "RailReceipt_Code";
            }
          });
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
      console.log("RailReceiptComposite:Error occured on handleDelete");
    }
  };
  handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
  };
  handleDateTextChange = (value, error) => {
    if (value === "")
      this.setState({ dateError: "", toDate: "", fromDate: "" });
    if (error !== null && error !== "")
      this.setState({
        dateError: "Common_InvalidDate",
        toDate: "",
        fromDate: "",
      });
    else {
      this.setState({ dateError: "", toDate: value.to, fromDate: value.from });
    }
  };
  handleLoadOrders = () => {
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getRailReceiptList(this.state.selectedShareholder);
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailReceipt
      );
      let selectedRow = lodash.cloneDeep(this.state.selectedRow);
      operationsVisibilty.delete = selectedRow.ReceiptStatus === "READY";
      operationsVisibilty.shareholder = true;
      let isRecordWeight = lodash.cloneDeep(this.state.isRecordWeight);
      let isDetails = lodash.cloneDeep(this.state.isDetails);
      let isViewAuditTrail = lodash.cloneDeep(this.state.isViewAuditTrail);
      let isViewUnloadingDetails = lodash.cloneDeep(
        this.state.isViewUnloadingDetails
      );
      let isMunalEntry = lodash.cloneDeep(this.state.isMunalEntry);
      let isLoadSpotAssign = lodash.cloneDeep(this.state.isLoadSpotAssign);
      this.getKPIList();
      if (isDetails === "true") {
        if (
          isMunalEntry === "true" ||
          isRecordWeight === "true" ||
          isViewAuditTrail === "true" ||
          isViewUnloadingDetails === "true" ||
          isLoadSpotAssign
        ) {
          this.setState({
            isReadyToRender: false,
            isShowRightPanel: true,
            isDetails: "true",
            isRecordWeight: "false",
            isViewAuditTrail: "false",
            isViewUnloadingDetails: "false",
            isMunalEntry: "false",
            isLoadSpotAssign: false,
            operationsVisibilty,
            drawerStatus: false,
          });
        } else {
          operationsVisibilty.delete = false;
          this.setState({
            isReadyToRender: false,
            isShowRightPanel: false,
            isDetails: "false",
            isRecordWeight: "false",
            isViewAuditTrail: "false",
            isViewUnloadingDetails: "false",
            isMunalEntry: "false",
            isLoadSpotAssign: false,
            selectedRow: {},
            selectedItems: [],
            operationsVisibilty,
            drawerStatus: false,
          });

          this.getRailReceiptList(this.state.selectedShareholder);
        }
      } else {
        this.setState({
          isReadyToRender: false,
          isDetails: "false",
          isRecordWeight: "false",
          isViewAuditTrail: "false",
          isViewUnloadingDetails: "false",
          isMunalEntry: "false",
          isLoadSpotAssign: false,
          operationsVisibilty,
          isShowRightPanel: false,
          selectedRow: {},
          selectedItems: [],
          drawerStatus: false,
        });
        this.getRailReceiptList(this.state.selectedShareholder);
      }
    } catch (error) {
      console.log("RailReceiptComposite:Error occured on Back click", error);
    }
  };
  handleRowClick = (item) => {
    try {
      var { operationsVisibilty, activityInfo } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailReceipt
      );

      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ReceiptActivityInfo.RAIL_RECEIPT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var receiptDeleteStates = [];

      if (
        receiptDeleteInfo !== undefined &&
        receiptDeleteInfo.length > 0
      )
        receiptDeleteStates =
          receiptDeleteInfo[0].ReceiptStates;

      operationsVisibilty.delete = this.props.userDetails
        .EntityResult.IsWebPortalUser
        ? false
        : receiptDeleteStates.indexOf(
          item.ReceiptStatus.toUpperCase()
        ) > -1 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnRailReceipt
        );

      // const isReady = Utilities.isInFunction(
      //   this.props.userDetails.EntityResult.FunctionsList,
      //   functionGroups.remove,
      //   fnRailReceipt
      // );
      // operationsVisibilty.delete = item["ReceiptStatus"] === "READY" && isReady;
      operationsVisibilty.shareholder = false;
      this.getRailReceiptOperations(item);
      this.getRailReceiptAllChangeStatus(item);
      this.setState({
        isDetails: "true",
        saveEnabled: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
        isShowRightPanel: true,
        viewTab: 0,
        detailEnable: true,
        drawerStatus: false,
      });
    } catch (error) {
      console.log(
        "RailReceiptComposite:Error occured on handleRowClick",
        error
      );
    }
  };
  handleSelection = (items) => {
    try {
      const operationsVisibilty = lodash.cloneDeep(
        this.state.operationsVisibilty
      );

      var { drawerStatus, activityInfo } = { ...this.state };

      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ReceiptActivityInfo.RAIL_RECEIPT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var receiptDeleteStates = [];

      if (
        receiptDeleteInfo !== undefined &&
        receiptDeleteInfo.length > 0
      )
        receiptDeleteStates =
          receiptDeleteInfo[0].ReceiptStates;

      let isReady =
        items.findIndex(
          (x) =>
            receiptDeleteStates.indexOf(
              x.ReceiptStatus.toUpperCase()
            ) < 0
        ) >= 0
          ? false
          : true;

      operationsVisibilty.delete = this.props.userDetails.EntityResult
        .IsWebPortalUser
        ? false
        : isReady &&
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnRailReceipt
        );

      // let railReceiptDeleteStates = lodash.cloneDeep(
      //   this.state.railReceiptDeleteStates
      // );

      // const isReady =
      //   items.findIndex(
      //     (x) =>
      //       railReceiptDeleteStates.indexOf(x.ReceiptStatus.toUpperCase()) < 0
      //   ) >= 0
      //     ? false
      //     : true;

      // operationsVisibilty.delete =
      //   isReady &&
      //   items.length > 0 &&
      //   Utilities.isInFunction(
      //     this.props.userDetails.EntityResult.FunctionsList,
      //     functionGroups.remove,
      //     fnRailReceipt
      //   );

      operationsVisibilty.shareholder = false;

      if (items.length !== 1) {
        drawerStatus = true;
      } else {
        drawerStatus = false;
      }

      this.setState({
        isShowRightPanel: true,
        selectedItems: items,
        operationsVisibilty,
        isOperation: false,
        drawerStatus,
      });

      if (items.length === 1) {
        this.getRailReceiptOperations(items[0]);
        this.getRailReceiptAllChangeStatus(items[0]);
        this.setState({ isOperation: true });
      } else {
        this.setState({
          isShowRightPanel: false,
          selectedItems: items,
          operationsVisibilty,
          isOperation: false,
        });
      }
    } catch (error) {
      console.log(
        "RailReceiptSComposite: Error occurred on handleSelection",
        error
      );
    }
  };
  handleUpdateStatusOperation = (railReceipt) => {
    const item = {
      Common_Code: railReceipt.ReceiptCode,
      ReceiptStatus: railReceipt.ReceiptStatus,
      AssociatedTerminals: railReceipt.TerminalCodes,
      AcutalTerminalCode: railReceipt.ActualTerminalCode,
    };
    this.setState(
      {
        selectedItems: [item],
        selectedRow: item,
      },
      () => {
        this.getRailReceiptOperations(item);
        this.getRailReceiptAllChangeStatus(item);
      }
    );

    this.setState({ isOperation: true });
  };
  getRailReceiptOperations = (items) => {
    var localTerminalCode = items.AcutalTerminalCode;
    if (localTerminalCode === null || localTerminalCode === undefined) {
      if (this.state.selectedItems.length === 1) {
        localTerminalCode = this.state.selectedItems[0].AcutalTerminalCode;
      }
    }
    var obj = {
      Reason: "",
      ReceiptCode: items.Common_Code,
      ReceiptStatus: items.ReceiptStatus,
    };
    try {
      axios(
        RestAPIs.GetRailReceiptOperations,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          const currentAccess = {
            ViewRailReceipt_Delete: false,
            ViewRailReceipt_Update: false,
          };
          const operationOrder = [
            "ViewRailReceipt_Update",
            "ViewRailReceipt_Delete",
            "ViewRailReceipt_AuthorizeToUnLoad",
            "ViewRailReceipt_PrintRAN",
            "ViewRailReceipt_RecordWeight",
            "ViewRailReceipt_LoadSpotAssign",
            "ViewRailReceipt_ManualEntry",
            "ViewRailReceipt_ViewLoadingDetails",
            "ViewRailReceipt_ViewAuditTrail",
            "ViewRailReceipt_CloseReceipt",
            "ViewRailReceipt_ViewBOD",
            "ViewRailReceipt_PrintBOD",
            "ViewRailReceipt_BSIOutbound",
          ];
          const NextOperations = [];
          for (let operation of operationOrder) {
            if (
              operation === "ViewRailReceipt_Update" ||
              operation === "ViewRailReceipt_Delete"
            ) {
              let operationsVisibilty = this.state.operationsVisibilty;
              if (operation === "ViewRailReceipt_Update") {
                //operationsVisibility.modify=true;
                currentAccess.ViewRailReceipt_Update =
                  result.EntityResult[operation];
              }
              if (operation === "ViewRailReceipt_Delete") {
                currentAccess.ViewRailReceipt_Delete =
                  result.EntityResult[operation];
                operationsVisibilty.delete = result.EntityResult[operation];
              }
              this.setState({ operationsVisibilty });
              continue;
            }

            if (
              operation === "ViewRailReceipt_PrintRAN" &&
              result.EntityResult[operation] === true
            ) {
              if (!this.props.userDetails.EntityResult.IsWebPortalUser) {
                NextOperations.push(operation);
              }
              //NextOperations.push("ViewRailReceipt_ViewRAN");
              continue;
            } else if (
              operation === "ViewRailReceipt_PrintBOD" &&
              result.EntityResult[operation] === true
            ) {
              if (!this.props.userDetails.EntityResult.IsWebPortalUser) {
                NextOperations.push(operation);
              }
              NextOperations.push("ViewRailReceipt_ViewBOD");
              continue;
            } else if (operation === "ViewRailReceipt_LoadSpotAssign") {
              if (
                !this.props.userDetails.EntityResult.IsEnterpriseNode &&
                items.ReceiptStatus !== "READY" &&
                localTerminalCode === null
              ) {
                continue;
              } else if (result.EntityResult[operation] === true) {
                NextOperations.push(operation);
              }
            } else if (result.EntityResult[operation] === true) {
              if (
                operation === "ViewRailReceipt_CloseReceipt" ||
                operation === "ViewRailReceipt_RecordWeight" ||
                operation === "ViewRailReceipt_ManualEntry"
              ) {
                if (
                  !this.props.userDetails.EntityResult.IsEnterpriseNode &&
                  localTerminalCode !==
                  this.props.userDetails.EntityResult.TerminalCode
                ) {
                  continue;
                }
              }

              NextOperations.push(operation);
            }
          }
          if (
            items.ReceiptStatus === Constants.Receipt_Status.CLOSED &&
            this.props.userDetails.EntityResult.IsBSIEnabledLicense &&
            !this.props.userDetails.EntityResult.IsArchived &&
            !this.props.userDetails.EntityResult.IsWebPortalUser
          )
            NextOperations.push("ViewRailReceipt_BSIOutbound");
          this.setState({ NextOperations, currentAccess });
        } else {
          console.log("Error in getRailReceiptOperations:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("Error while getting RailReceipt Operations List:", error);
    }
  };
  getRailReceiptAllChangeStatus(items) {
    var obj = {
      Reason: "",
      ReceiptCode: items.Common_Code,
      ReceiptStatus: items.ReceiptStatus,
    };
    try {
      axios(
        RestAPIs.GetRailReceiptAllChangeStatus,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              currentStatuses: result.EntityResult,
              //lastStatus: result.EntityResult,
            });
          } else {
            console.log(
              "Error in getRailReceiptAllChangeStatus: ",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log("Error while getRailReceiptAllChangeStatus:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty, activityInfo } = { ...this.state };

      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ReceiptActivityInfo.RAIL_RECEIPT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var receiptDeleteStates = [];

      if (
        receiptDeleteInfo !== undefined &&
        receiptDeleteInfo.length > 0
      )
        receiptDeleteStates =
          receiptDeleteInfo[0].ReceiptStates;

      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnRailReceipt
        );
        operationsVisibilty.delete = this.props.userDetails
          .EntityResult.IsWebPortalUser
          ? false
          : receiptDeleteStates.indexOf(
            data.ReceiptStatus.toUpperCase()
          ) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnRailReceipt
          );

        // operationsVisibilty.delete = Utilities.isInFunction(
        //   this.props.userDetails.EntityResult.FunctionsList,
        //   functionGroups.remove,
        //   fnRailReceipt
        // );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            RailReceiptCode: data.ReceiptCode,
            Common_Shareholder: data.ShareholderCode,
          },
        ];
        this.setState({ selectedItems, isShowRightPanel: true });
      }
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log("RailReceiptComposite:Error occured on savedEvent", error);
    }
  };
  getRailReceiptList(shareholder) {
    try {
      this.setState({ isReadyToRender: false });
      let fromDate = new Date(this.state.fromDate);
      let toDate = new Date(this.state.toDate);
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);
      let obj = {
        startRange: fromDate,
        endRange: toDate,
        TransportationType: Constants.TransportationType.RAIL,
        ShareHolderCode: shareholder,
      };
      axios(
        RestAPIs.GetRailReceiptListForRole,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess === true) {
            this.setState(
              { data: result.EntityResult, isReadyToRender: true },
              () => {
                if (this.state.selectedItems.length === 1) {
                  const selectedItem = this.state.selectedItems[0];
                  const updatedSelectedItem = result.EntityResult.Table.filter(
                    (item) => {
                      return item.Common_Code === selectedItem.Common_Code;
                    }
                  );

                  let { operationsVisibilty, activityInfo } = { ...this.state }

                  let receiptDeleteInfo = activityInfo.filter((item) => {
                    return (
                      item.ActivityCode ===
                      Constants.ReceiptActivityInfo.RAIL_RECEIPT_ENABLE_DELETE &&
                      item.ActionTypeCode === Constants.ActionTypeCode.CHECK
                    );
                  });

                  var receiptDeleteStates = [];

                  if (
                    receiptDeleteInfo !== undefined &&
                    receiptDeleteInfo.length > 0
                  )
                    receiptDeleteStates =
                      receiptDeleteInfo[0].ReceiptStates;

                  operationsVisibilty.delete = this.props.userDetails
                    .EntityResult.IsWebPortalUser
                    ? false
                    : receiptDeleteStates.indexOf(
                      updatedSelectedItem[0].ReceiptStatus.toUpperCase()
                    ) > -1 &&
                    Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.remove,
                      fnRailReceipt
                    );

                  if (this.state.isDetails === "true") {
                    this.setState({
                      selectedItems: updatedSelectedItem,
                      selectedRow: updatedSelectedItem[0],
                      operationsVisibilty
                    });
                  } else {
                    this.getRailReceiptOperations(updatedSelectedItem[0]);
                    this.getRailReceiptAllChangeStatus(updatedSelectedItem[0]);
                    this.setState({
                      selectedItems: updatedSelectedItem,
                      operationsVisibilty
                    });
                  }
                }
              }
            );
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log(
              "Error in GetRailReceiptListForRole:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while geting RailReceipt List:", error);
        });
    } catch (error) {
      this.setState({ isReadyToRender: true });
      console.log(error);
    }
  }

  getLookUpData = (lookUpTypeCode, callback) => {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=" + lookUpTypeCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callback(result.EntityResult);
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "RailReceiptComposite: Error occurred on getLookUpData",
          error
        );
      });
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailReceipt
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      // this.CheckRailReceiptDeleteAllowed();
      this.getLookUpData("HSEInspection", (entityResult) => {
        this.setState({
          enableHSEInspection: entityResult.EnableRail === "True",
        });
      });
      this.getLookUpData("Rail", (entityResult) => {
        this.setState({ railLookUpData: entityResult });
      });
      this.getTerminalsList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getRailReceiptList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList();
      this.GetReceiptActivityInfo();
    } catch (error) {
      console.log(
        "RailReceiptComposite:Error occured on componentDidMount",
        error
      );
    }
    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage)
  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage)
  }

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  }


  GetReceiptActivityInfo() {
    try {
      axios(
        RestAPIs.GetReceiptActivityInfo,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ activityInfo: response.data.EntityResult });
          }
        })
        .catch((error) => {
          console.log("Error while getting receipt activityInfo:", error);
        });
    } catch (error) {
      console.log("Error in GetReceiptActivityInfo:", error);
    }
  }

  getTerminalsList(shareholder) {
    try {
      if (shareholder !== null && shareholder !== "") {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(
            [shareholder],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ terminalCodes: response.data.EntityResult });
          }
        });
      } else {
        this.setState({ terminalCodes: [] });
      }
    } catch (error) {
      console.log(
        "DestinationComposite:Error occured on getTerminalsList",
        error
      );
    }
  }
  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({ selectedShareholder: shareholder });
      this.getRailReceiptList(shareholder);
    } catch (error) {
      console.log(
        "RailReceiptComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  getTransportationType() {
    var transportationType = Constants.TransportationType.RAIL;
    const { itemProps } = this.props.activeItem;
    if (itemProps !== undefined && itemProps.transportationType !== undefined) {
      transportationType = itemProps.transportationType;
    }
    return transportationType;
  }
  handleOperationClick = (operation) => {
    //this.setState({ railReceiptBtnStatus: true });
    let modWeight = lodash.cloneDeep(this.state.modWeight);
    var { operationsVisibilty } = { ...this.state };
    // if (this.state.isDetails === "true") {
    //   this.setState(
    //     {
    //       isDetails: "false",
    //       isShowRightPanel: false,
    //     },
    //     () => {
    //       this.setState({
    //         isDetails: "true",
    //         isShowRightPanel: true,
    //       });
    //     }
    //   );
    // }
    // setTimeout(() => {
    //   this.setState({ railReceiptBtnStatus: false });
    // }, 2000);
    if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_AuthorizeToUnload
    ) {
      this.authorizeToUnLoadClick();
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_RecordWeight
    ) {
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;
      this.handleRecordWeight(modWeight);
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_CloseReceipt
    ) {
      this.setState({ openReceipt: true });
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_ViewAuditTrail
    ) {
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;
      this.handleViewAuditTrail();
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_ViewLoadingDetails
    ) {
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;
      this.handleViewUnLoadingDetails();
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_PrintRAN
    ) {
      this.printRANClick();
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_ViewBOD
    ) {
      operationsVisibilty.add = false;
      this.viewBODClick();
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_PrintBOD
    ) {
      this.printBODClick();
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_BISOutbound
    ) {
      this.handleBSIOutbound(this.state.selectedItems[0].Common_Code);
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_ManualEntry
    ) {
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;
      this.handleRailReceiptManualEntry();
    } else if (
      operation ===
      Constants.ViewAllRailReceiptOperations.ViewRailReceipt_LoadSpotAssign
    ) {
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;
      this.handleLoadSpotAssign();
    }
    this.setState({ operationsVisibilty });
  };

  handleNotify(notification) {
    try {
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log(
        "RailDispatchComposite: Error occurred on handleNotify",
        error
      );
    }
  }

  onFieldChange(propertyName, data) {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      this.setState({ reason: data });
      if (railReceiptValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          railReceiptValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
        if (
          validationErrors.Reason === "" ||
          validationErrors.Reason === undefined
        ) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log(
        "railReceiptDetailsComposite:Error occured on handleChange",
        error
      );
    }
  }

  authorizeToUnLoadClick = () => {
    let showAuthorizeToUnLoadAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showAuthorizeToUnLoadAuthenticationLayout, }, () => {
      if (showAuthorizeToUnLoadAuthenticationLayout === false) {
        this.handleAuthorizeToLoad();
      }})
    }

  handleAuthorizeToUnload = () => {
    this.handleAuthenticationClose();

    let ReceiptCode= this.state.selectedItems[0].Common_Code;
    let ReceiptStatus= this.state.selectedItems[0].ReceiptStatus;

    var shCode = this.state.selectedShareholder;
    let keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: ReceiptCode,
      },
    ];
    const cobj = {
      ShareHolderCode: shCode,
      KeyCodes: keyCode,
    };
    let obj = {
      ReceiptCode: ReceiptCode,
      ReceiptStatus: ReceiptStatus,
      TmWebApiRequest: cobj,
    };
    var notification = {
      messageType: "success",
      message: "ViewRailReceipt_AuthorizeLoad_status",
      messageResultDetails: [
        {
          keyFields: ["Receipt_Code"],
          keyValues: [ReceiptCode],
          isSuccess: true,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailReceiptAuthorizeToUnLoad,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          const selectedRow = lodash.cloneDeep(this.state.selectedRow);
          if (this.state.isDetails === "true") {
            selectedRow.ReceiptStatus = Constants.Shipment_Status.CHECKED_IN;
          } else {
            this.getRailReceiptList(shCode);
          }
          this.setState({ selectedRow }, () => {
            this.savedEvent(selectedRow, "", notification)
          });
        } else {
          notification.messageType = "critical";
          notification.messageResultDetails[0].isSuccess = false;
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.savedEvent("", "", notification);
          console.log("Error in AuthorizeToUnLoad:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while AuthorizeToUnLoad:", error);
      });
  };
  handleRecordWeight() {
    this.setState({ isRecordWeight: "true" });
  }

  handleCloseReceipt= () =>
{
  let showCloseReceiptAuthenticationLayout =
  this.props.userDetails.EntityResult.IsWebPortalUser !== true
    ? true
    : false;

  this.setState({ showCloseReceiptAuthenticationLayout, }, () => {
    if (showCloseReceiptAuthenticationLayout === false) {
      this.closeRailDispatch();
    }})
};


closeRailDispatch = () => {
    this.handleAuthenticationClose();
    try {
      var shCode = this.state.selectedShareholder;
      this.setState({ railReceiptBtnCloseOK: true });
      setTimeout(() => {
        this.setState({ railReceiptBtnCloseOK: false });
      }, 3600);
      var items = lodash.cloneDeep(this.state.selectedItems[0]);
      let keyCode = [
        {
          key: KeyCodes.railReceiptCode,
          value: items.Common_Code,
        },
      ];

      let entity = {
        Reason: this.state.reason,
        ReceiptCode: items.Common_Code,
        ReceiptStatus: items.ReceiptStatus,
      };
      const obj = {
        ShareHolderCode: shCode,
        KeyCodes: keyCode,
        Entity: entity,
      };
      var notification = {
        messageType: "success",
        message: "ViewRailReceipt_CloseReceipt_status",
        messageResultDetails: [
          {
            keyFields: ["Receipt_Code"],
            keyValues: [items.Common_Code],
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
      ).then((response) => {
        if (response.data.IsSuccess) {
          const selectedRow = lodash.cloneDeep(this.state.selectedRow);
          if (this.state.isDetails === "true") {
            selectedRow.ReceiptStatus = Constants.Shipment_Status.CLOSED;
            // this.setState({ selectedRow });
          } else {
            this.getRailReceiptList(shCode);
          }
          this.setState({ openReceipt: false, selectedRow }, () => this.savedEvent(selectedRow, "", notification));

        } else {
          notification.messageType = "critical";
          notification.messageResultDetails[0].isSuccess = false;
          notification.messageResultDetails[0].errorMessage =
            response.data.ErrorList[0];
          this.savedEvent("", "", notification);
        }
      });
    } catch (error) { }
  };
  handleViewAuditTrail() {
    var { operationsVisibilty } = { ...this.state };
    operationsVisibilty.add = false;
    this.setState({
      isViewAuditTrail: "true",
      saveEnabled: false,
      operationsVisibilty,
    });
  }
  handleViewUnLoadingDetails() {
    var shCode = this.state.selectedShareholder;
    var items = lodash.cloneDeep(this.state.selectedItems[0]);
    let keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: items.Common_Code,
      },
    ];
    const cobj = {
      ShareHolderCode: shCode,
      KeyCodes: keyCode,
    };
    let obj = {
      Reason: this.state.reason,
      ReceiptCode: items.Common_Code,
      ReceiptStatus: items.ReceiptStatus,
      TmWebApiRequest: cobj,
    };
    axios(
      RestAPIs.GetRailReceiptUnLoadingDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isViewUnloadingDetails: "true",
            ViewUnloadingData: result.EntityResult,
          });
        } else {
          console.log("Error in viewUnLoadingDetails:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while viewUnLoadingDetails:", error);
      });
  }

  printRANClick= () => {
    let showRANAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showRANAuthenticationLayout, }, () => {
      if (showRANAuthenticationLayout === false) {
        this.handlePrintRAN();
      }})
     
    }

  handlePrintRAN= () => {
    this.handleAuthenticationClose();
    var shCode = this.state.selectedShareholder;
    let ReceiptCode= this.state.selectedItems[0].Common_Code;
    let keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: ReceiptCode,
      },
    ];
    const obj = {
      ShareHolderCode: shCode,
      KeyCodes: keyCode,
    };

    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["Receipt_Code"],
          keyValues: [ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailReceiptPrintRAN,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess !== true) {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in handlePrintRAN: ", result.ErrorList);
        }
        this.handleNotify(notification);
      })
      .catch((error) => {
        console.log("Error while handlePrintRAN: ", error);
      });
  }

  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderReportModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/RailBOD";
    } else {
      path = "TM/" + Constants.TMReports + "/RailBOD";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      ShareholderCode: this.state.selectedShareholder,
      RailReceiptCode:
        this.state.selectedItems.length === 1
          ? this.state.selectedItems[0].Common_Code
          : this.state.selectedRow.Common_Code,
    };

    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleModalBack}
        handleModalClose={this.handleModalBack}
        // proxyServerHost="http://epksr5115dit:3625/TMWebAPI/"
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }

  viewBODClick= () => {
    let showViewBODAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showViewBODAuthenticationLayout, }, () => {
      if (showViewBODAuthenticationLayout === false) {
        this.handleViewBOD();
      }})
     
    }

  handleViewBOD = () => {
    this.handleAuthenticationClose();
    if (this.reportServiceURI === undefined) {
      axios(
        RestAPIs.GetReportServiceURI,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        if (response.data.IsSuccess) {
          this.reportServiceURI = response.data.EntityResult;
          this.setState({ showReport: true });
        }
      });
    } else {
      this.setState({ showReport: true });
    }
  };

    printBODClick= () => {
    let showPrintBODAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showPrintBODAuthenticationLayout, }, () => {
      if (showPrintBODAuthenticationLayout === false) {
        this.handlePrintBOD();
      }})
     
    }


  handlePrintBOD= () => {
    this.handleAuthenticationClose();
    var shCode = this.state.selectedShareholder;
    let ReceiptCode= this.state.selectedItems[0].Common_Code;
    let keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: ReceiptCode,
      },
    ];
    const obj = {
      ShareHolderCode: shCode,
      KeyCodes: keyCode,
    };

    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["Receipt_Code"],
          keyValues: [ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailReceiptPrintBOD,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess !== true) {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in handlePrintBOD: ", result.ErrorList);
        }
        this.handleNotify(notification);
      })
      .catch((error) => {
        console.log("Error while handlePrintBOD: ", error);
      });
  }
  handleBSIOutbound(ReceiptCode) {
    var shCode = this.state.selectedShareholder;
    let keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: ReceiptCode,
      },
    ];
    const obj = {
      ShareHolderCode: shCode,
      KeyCodes: keyCode,
    };

    const notification = {
      messageType: "critical",
      message: "ViewRailReceipt_BSIOutbound_status",
      messageResultDetails: [
        {
          keyFields: ["Receipt_Code"],
          keyValues: [ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailReceiptBSIOutbound,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess !== true) {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in handleBSIOutbound: ", result.ErrorList);
        }
        this.handleNotify(notification);
      })
      .catch((error) => {
        console.log("Error while handleBSIOutbound: ", error);
      });
  }
  handleRailReceiptManualEntry() {
    this.setState({
      isMunalEntry: "true",
    });
  }
  handleLoadSpotAssign() {
    this.setState({
      isLoadSpotAssign: true,
    });
  }

  renderModal() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal
            onClose={() => this.setState({ openReceipt: false })}
            size="mini"
            open={this.state.openReceipt}
            closeOnDimmerClick={false}
          >
            <Modal.Content>
              <div className="ViewMarineReceiptCloseHeader">
                <b> {t("Receipt_ForceCloseHeader")}</b>
              </div>
              <div>
                <Input
                  fluid
                  value={this.state.reason}
                  indicator="required"
                  onChange={(data) => this.onFieldChange("Reason", data)}
                  label={t("Receipt_ForceCloseHeader")}
                  error={t(this.state.validationErrors.Reason)}
                />
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                size="small"
                content={t("ViewMarineReceiptList_Ok")}
                onClick={() => {
                  this.handleCloseReceipt();
                }}
                disabled={this.state.railReceiptBtnCloseOK}
              />
              <Button
                type="primary"
                size="small"
                content={t("ViewMarineReceiptList_Cancel")}
                onClick={() => this.setState({ openReceipt: false })}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }
  handleManualEntryTabChange = (activeIndex) => {
    try {
      this.setState({ manualEntryTabActiveIndex: activeIndex });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleManualEntryTabChange",
        error
      );
    }
  };

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

  //Get KPI for Rail Receipt
  getKPIList() {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      var notification = {
        message: "",
        messageType: "critical",
        messageResultDetails: [],
      };
      let objKPIRequestData = {
        PageName: kpiRailReceiptList,
        InputParameters: [],
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
              railReceiptKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ railReceiptKPIList: [] });
            console.log("Error in Rail Receipt KPIList:", result.ErrorList);
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
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting Rail Receipt KPIList:", error);
        });
    }
  }

  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("Marine Shipment Composite : Error in authenticateDelete");
    }
  };

 

  handleAuthenticationClose = () => {
    
    this.setState({
      showDeleteAuthenticationLayout: false,
      showAuthorizeToUnLoadAuthenticationLayout: false,
      showCloseReceiptAuthenticationLayout: false,
      showViewBODAuthenticationLayout: false,
      showPrintBODAuthenticationLayout:false,
      showRANAuthenticationLayout: false,
    });
  };

  
  getFunctionGroupName() {
    if(this.state.showDeleteAuthenticationLayout )
      return fnRailReceipt
    else if(this.state.showCloseReceiptAuthenticationLayout)
      return fnCloseRailReceipt
    else if(this.state.showAuthorizeToUnLoadAuthenticationLayout)
      return fnViewRailReceipt
    else if(this.state.showViewBODAuthenticationLayout || this.state.showPrintBODAuthenticationLayout)
      return fnPrintRailBOD
      else if(this.state.showRANAuthenticationLayout)
      return fnPrintRailRAN
   };

   getDeleteorEditMode() {
    if(this.state.showDeleteAuthenticationLayout)
      return functionGroups.remove;
    else
      return functionGroups.modify;
   };

   handleOperation()  {
  
    if(this.state.showDeleteAuthenticationLayout)
      return this.handleDelete
    else if(this.state.showAuthorizeToUnLoadAuthenticationLayout)
      return this.handleAuthorizeToUnload
    else if(this.state.showCloseReceiptAuthenticationLayout)
      return this.closeRailDispatch
    else if(this.state.showRANAuthenticationLayout)
      return this.handlePrintRAN
    else if(this.state.showViewBODAuthenticationLayout)
      return this.handleViewBOD;
      else if(this.state.showPrintBODAuthenticationLayout)
      return this.handlePrintBOD;
 };

  render() {
    let loadingClass = "globalLoader";
    return (
      <div>
        {this.renderModal()}
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            onAdd={this.handleAdd}
            onDelete={this.authenticateDelete}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isRecordWeight === "true" ? (
          <ErrorBoundary>
            <RailReceiptRecordWeightDetailsComposite
              Key="RailReceiptRecordWeightDetails"
              selectedRow={this.state.selectedItems[0]}
              shareholderCode={this.state.selectedShareholder}
              handleBack={this.handleBack}
              onSaved={this.savedEvent}
            ></RailReceiptRecordWeightDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isViewAuditTrail === "true" ? (
          <ErrorBoundary>
            <RailReceiptViewAuditTrailDetailsComposite
              Key="RailReceiptViewAuditTrailDetails"
              selectedRow={this.state.selectedItems[0]}
              shareholderCode={this.state.selectedShareholder}
              handleBack={this.handleBack}
              onSaved={this.savedEvent}
            ></RailReceiptViewAuditTrailDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isViewUnloadingDetails === "true" ? (
          <div>
            <ErrorBoundary>
              <TranslationConsumer>
                {(t) => (
                  <TMDetailsHeader
                    newEntityName={t("ViewRailReceiptUnloading_Title")}
                  />
                )}
              </TranslationConsumer>
            </ErrorBoundary>
            <ErrorBoundary>
              <RailReceiptUnLoadingDetails
                tableData={this.state.ViewUnloadingData.Table}
              ></RailReceiptUnLoadingDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              <TranslationConsumer>
                {(t) => (
                  <div className="row">
                    <div className="col" style={{ textAlign: "left" }}>
                      <Button
                        className="backButton"
                        onClick={() => this.handleBack()}
                        content={t("Back")}
                      ></Button>
                    </div>
                  </div>
                )}
              </TranslationConsumer>
            </ErrorBoundary>
          </div>
        ) : this.state.isLoadSpotAssign ? (
          <div>
            <ErrorBoundary>
              <RailReceiptLoadSpotAssignComposite
                onSaved={this.savedEvent}
                selectedRow={this.state.selectedItems[0]}
                selectedShareholder={this.state.selectedShareholder}
                onBack={this.handleBack}
              />
            </ErrorBoundary>
          </div>
        ) : this.state.isMunalEntry === "true" ? (
          <div>
            <ErrorBoundary>
              {
                <RailReceiptManualEntryComposite
                  onSaved={this.savedEvent}
                  selectedRow={this.state.selectedItems[0]}
                  selectedShareholder={this.state.selectedShareholder}
                  onBack={this.handleBack}
                ></RailReceiptManualEntryComposite>
              }
            </ErrorBoundary>
          </div>
        ) : this.state.isDetails === "true" ? (
          <div>
            {/* <div
              className={
                this.state.isShowRightPanel ? "showShipmentStatusRightPane" : ""
              }
            > */}
            <div
              className={
                this.state.isShowRightPanel
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <RailReceiptDetailsComposite
                  Key="RailReceiptDetails"
                  selectedRow={this.state.selectedRow}
                  selectedShareholder={this.state.selectedShareholder}
                  onBack={this.handleBack}
                  onSaved={this.savedEvent}
                  enableHSEInspection={this.state.enableHSEInspection}
                  handleOperationClick={this.handleOperationClick}
                  onUpdateStatusOperation={this.handleUpdateStatusOperation}
                  terminalCodes={this.state.terminalCodes}
                  genericProps={this.props.activeItem.itemProps}
                  railLookUpData={this.state.railLookUpData}
                  currentAccess={this.state.currentAccess}
                ></RailReceiptDetailsComposite>
              </ErrorBoundary>
            </div>
            {this.state.isShowRightPanel ? (
              // <div className="showShipmentStatusLeftPane">
              <div
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                {/* <RailReceiptSummaryOperations
                  selectedItem={this.state.selectedItems}
                  NextOperations={this.state.NextOperations}
                  handleDetailsPageClick={this.handleRowClick}
                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentStatuses}
                  lastStatus={this.state.lastStatus}
                  pageStatus={false}
                  railReceiptBtnStatus={this.state.railReceiptBtnStatus}
                /> */}
                <TransactionSummaryOperations
                  selectedItem={this.state.selectedItems}
                  shipmentNextOperations={this.state.NextOperations}
                  handleDetailsPageClick={this.handleRowClick}
                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentStatuses}
                  isDetails={this.state.isDetails}
                  handleDrawer={this.handleDrawer}
                  isWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  title={"ViewAllShipment_Details"}
                  unAllowedOperations={[]}
                  webPortalAllowedOperations={[
                    "ViewRailReceipt_ViewLoadingDetails",
                    "ViewRailReceipt_ViewAuditTrail",
                    "ViewRailReceipt_ViewBOD",
                  ]}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.railReceiptKPIList}
                  pageName="RailReceipt"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            {/* <div
              className={
                this.state.isShowRightPanel ? "showShipmentStatusRightPane" : ""
              }
            > */}
            <div
              className={
                this.state.isShowRightPanel
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <TMTransactionFilters
                  dateRange={{
                    from: this.state.fromDate,
                    to: this.state.toDate,
                  }}
                  dateError={this.state.dateError}
                  handleDateTextChange={this.handleDateTextChange}
                  handleRangeSelect={this.handleRangeSelect}
                  handleLoadOrders={this.handleLoadOrders}
                  filterText="LoadReceipts"
                ></TMTransactionFilters>
              </ErrorBoundary>
              {this.state.isReadyToRender ? (
                <ErrorBoundary>
                  <RailReceiptSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    exportFileName="RailReceiptList"
                    columnPickerRequired={true}
                    terminalsToShow={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .NoOfTerminalsToShow
                    }
                    selectionRequired={true}
                    columnGroupingRequired={true}
                    onSelectionChange={this.handleSelection}
                    onRowClick={this.handleRowClick}
                    parentComponent={this.componentName}
                  ></RailReceiptSummaryPageComposite>
                </ErrorBoundary>
              ) : (
                <LoadingPage
                  loadingClass={loadingClass}
                  message="Loading"
                ></LoadingPage>
              )}
            </div>
            {this.state.isShowRightPanel ? (
              // <div className="showShipmentStatusLeftPane">
              <div
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                
                <TransactionSummaryOperations
                  selectedItem={this.state.selectedItems}
                  shipmentNextOperations={this.state.NextOperations}
                  handleDetailsPageClick={this.handleRowClick}
                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentStatuses}
                  isDetails={this.state.isDetails}
                  handleDrawer={this.handleDrawer}
                  isWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  title={"ViewAllReceipt_Details"}
                  unAllowedOperations={[]}
                  webPortalAllowedOperations={[
                    "ViewRailReceipt_ViewLoadingDetails",
                    "ViewRailReceipt_ViewAuditTrail",
                    "ViewRailReceipt_ViewBOD",
                  ]}
                />
              </div>
            ) : null}
          </div>
        )}

        {Object.keys(this.state.selectedRow).length > 0 ||
          this.state.selectedItems.length === 1
          ? this.renderReportModal()
          : ""}
        <ErrorBoundary>
          <ToastContainer
            hideProgressBar={true}
            closeOnClick={false}
            closeButton={true}
            newestOnTop={true}
            position="bottom-right"
            toastClassName="toast-notification-wrap"
          />
        </ErrorBoundary>

        {this.state.showDeleteAuthenticationLayout  ||
           this.state.showAuthorizeToUnLoadAuthenticationLayout ||
           this.state.showCloseReceiptAuthenticationLayout ||
           this.state.showViewBODAuthenticationLayout ||
           this.state.showPrintBODAuthenticationLayout ||
           this.state.showRANAuthenticationLayout 
          ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getDeleteorEditMode()}
            functionGroup={this.getFunctionGroupName()}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleOperation()}
          ></UserAuthenticationLayout>
        ) : null}
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

export default connect(mapStateToProps)(RailReceiptComposite);
RailReceiptComposite.propTypes = {
  activeItem: PropTypes.object,
  selectedShareholder: PropTypes.string,
};
