import React, { Component } from "react";
import { connect } from "react-redux";
import {
  functionGroups,
  fnTruckReceipt,
  fnKPIInformation,
  fnCloseReceipt,
  fnViewReceiptStatus,
  fnPrintBOD,
  fnPrintRAN,
} from "../../../JS/FunctionGroups";
import * as Utilities from "../../../JS/Utilities";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import NotifyEvent from "../../../JS/NotifyEvent";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { TruckReceiptSummaryPageComposite } from "../Summary/TruckReceiptSummaryComposite";
import TruckReceiptDetailsComposite from "../Details/TruckReceiptDetailsComposite";
import TruckReceiptSealDetailsComposite from "../Details/TruckReceiptSealDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import PropTypes from "prop-types";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import * as KeyCodes from "../../../JS/KeyCodes";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import * as Constants from "../../../JS/Constants";
import lodash from "lodash";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import { TranslationConsumer } from "@scuf/localization";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import TruckReceiptManualEntryDetailsComposite from "../Details/TruckReceiptManualEntryDetailsComposite";
import { TruckReceiptViewAuditTrailDetails } from "../../UIBase/Details/TruckReceiptViewAuditTrailsDetails";
import { TruckReceiptViewUnLoadingDetails } from "../../UIBase/Details/TruckReceiptViewUnLoadingDetails";
import { Modal, Button, Select, Checkbox, Input } from "@scuf/common";
import { kpiTruckReceiptList } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { DataTable } from "@scuf/datatable";

class TruckReceiptComposite extends Component {
  state = {
    receipt: {},
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: true, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
      this.props.selectedShareholder === null ||
      this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    data: {},
    terminalCodes: [],
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    currentReceiptStatus: [],
    shipmentNextOperations: [],
    receiptType: "",
    isManualEntry: false,
    isViewAuditTrail: false,
    modAuditTrailList: [],
    auditTrailList: [],
    isViewUnloading: false,
    ModViewUnloadDetails: [],
    isRecordWeight: false,
    recordWeightList: [],
    weighBridgeCode: "",
    scadaValue: "",
    allowOutofRangeTW: false,
    expandedRows: [],
    showReport: false,
    truckReceiptKPIList: [],
    drawerStatus: false,
    isCloseReceipt: false,
    reasonForClosure: "",
    activityInfo: [],
    isSealCompartments: false,
    sealCompartments: [],
    showDeleteAuthenticationLayout: false,
    showAuthorizeToUnLoadAuthenticationLayout: false,
    showAllowToUnLoadAuthenticationLayout: false,
    showCloseReceiptAuthenticationLayout: false,
    showViewBODAuthenticationLayout: false,
    showPrintBODAuthenticationLayout: false,
    showRANAuthenticationLayout: false,
    isAllocateBay: false,
    bayData: [],
    selectBay: [],
    isDeAllocateBay: false,
    ReceiptBay: "",
  };

  componentName = "TruckReceiptComponent";

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = false;

      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
        isViewAuditTrail: false,
      });
    } catch (error) {
      console.log("TruckReceiptComposite:Error occured on handleAdd", error);
    }
  };

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

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTruckReceipt
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isManualEntry: false,
        drawerStatus: false,
        isReadyToRender: false,
      });
      this.getTruckReceiptList(this.state.selectedShareholder);
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("TruckReceiptComposite:Error occured on Back click", error);
    }
  };
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
  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteReceiptKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var shCode = this.state.selectedShareholder;
        var ReceiptCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.receiptCode, Value: ReceiptCode }],
        };
        deleteReceiptKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteReceipt,
        Utilities.getAuthenticationObjectforPost(
          deleteReceiptKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.isSuccess;

          if (
            result.ResultDataList !== null &&
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
            "Receipt_DeletionStatus",
            ["ReceiptCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.handleAuthenticationClose();
            this.getTruckReceiptList(this.state.selectedShareholder);
            this.getKPIList(this.state.selectedShareholder);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty });
            this.handleAuthenticationClose();
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "Receipt_Code";
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
          console.log("Error occured while deleting:" + error);
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({ operationsVisibilty });
          this.handleAuthenticationClose();
        });
    } catch (error) {
      console.log("TankComposite:Error occured on handleDelet", error);
    }
  };
  handleRowClick = (item) => {
    try {
      let { operationsVisibilty, activityInfo } = { ...this.state };
      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
            Constants.ReceiptActivityInfo.RECEIPT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      if (receiptDeleteInfo === undefined || receiptDeleteInfo.length === 0)
        var receiptDeleteStates = [];
      else receiptDeleteStates = receiptDeleteInfo[0].ReceiptStates;

      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTruckReceipt
      );
      operationsVisibilty.delete = this.props.userDetails.EntityResult
        .IsWebPortalUser
        ? false
        : receiptDeleteStates.indexOf(item.Common_Status.toUpperCase()) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnTruckReceipt
          );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "TruckReceiptComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  getReceipt(receiptRow) {
    var keyCode = [
      {
        key: KeyCodes.receiptCode,
        value: receiptRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedShareholder,
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
          this.setState(
            {
              receipt: result.EntityResult,
            },
            () => {
              this.getReciptStatuses(receiptRow);
              // this.GetViewAllReceiptCustomData(receiptRow)
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
        }
      })
      .catch((error) => {
        console.log("Error while getting receipt:", error, receiptRow);
      });
  }
  handleSelection = (items) => {
    try {
      var { operationsVisibilty, drawerStatus, activityInfo } = {
        ...this.state,
      };
      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
            Constants.ReceiptActivityInfo.RECEIPT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      if (receiptDeleteInfo === undefined || receiptDeleteInfo.length === 0)
        var receiptDeleteStates = [];
      else receiptDeleteStates = receiptDeleteInfo[0].ReceiptStates;

      let isReady =
        items.findIndex(
          (x) => receiptDeleteStates.indexOf(x.Common_Status.toUpperCase()) < 0
        ) >= 0
          ? false
          : true;
      operationsVisibilty.delete =
        isReady &&
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnTruckReceipt
        );
      if (
        items.length === 1
        // this.props.userDetails.EntityResult.IsEnterpriseNode === false
      ) {
        this.getReceipt(items[0]);
        if (items.length !== 1) {
          drawerStatus = true;
        } else {
          drawerStatus = false;
        }
        this.setState({ isOperation: true, drawerStatus });
      }
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "TruckReceiptComposite:Error occured on handleSelection",
        error
      );
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      let { operationsVisibilty, activityInfo } = { ...this.state };
      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
            Constants.ReceiptActivityInfo.RECEIPT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      if (receiptDeleteInfo === undefined || receiptDeleteInfo.length === 0)
        var receiptDeleteStates = [];
      else receiptDeleteStates = receiptDeleteInfo[0].ReceiptStates;

      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTruckReceipt
        );
        operationsVisibilty.delete = this.props.userDetails.EntityResult
          .IsWebPortalUser
          ? false
          : receiptDeleteStates.indexOf(data.ReceiptStatus.toUpperCase()) >
              -1 &&
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              fnTruckReceipt
            );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.ReceiptCode,
            Common_Shareholder: data.ShareholderCode,
          },
        ];
        this.setState({ selectedItems });
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
      console.log("TruckReceiptComposite:Error occured on savedEvent", error);
    }
  };

  getTruckReceiptList(shareholder) {
    this.setState({ isReadyToRender: false });
    let fromDate = new Date(this.state.fromDate);
    let toDate = new Date(this.state.toDate);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);

    let obj = {
      ShareholderCode: shareholder,
      startRange: fromDate,
      endRange: toDate,
    };
    // axios(
    //     RestAPIs.GetReceiptListForRole + shareholder
    //     + "&startRange=" + fromDate.toLocaleString()
    //     + "&endRange=" + toDate.toLocaleString(),
    //     Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    // )
    axios(
      RestAPIs.GetReceiptListForRole,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            { data: result.EntityResult, isReadyToRender: true },
            () => {
              if (
                this.state.isOperation === true &&
                this.state.selectedItems.length === 1
              ) {
                let selectedItem = this.state.selectedItems[0];
                var updatedselectedItem = result.EntityResult.Table.filter(
                  function (item) {
                    return item.Common_Code === selectedItem.Common_Code;
                  }
                );

                let { operationsVisibilty, activityInfo } = { ...this.state };
                let receiptDeleteInfo = activityInfo.filter((item) => {
                  return (
                    item.ActivityCode ===
                      Constants.ReceiptActivityInfo.RECEIPT_ENABLE_DELETE &&
                    item.ActionTypeCode === Constants.ActionTypeCode.CHECK
                  );
                });

                if (
                  receiptDeleteInfo === undefined ||
                  receiptDeleteInfo.length === 0
                )
                  var receiptDeleteStates = [];
                else receiptDeleteStates = receiptDeleteInfo[0].ReceiptStates;

                operationsVisibilty.delete = this.props.userDetails.EntityResult
                  .IsWebPortalUser
                  ? false
                  : receiptDeleteStates.indexOf(
                      updatedselectedItem[0].Common_Status.toUpperCase()
                    ) > -1 &&
                    Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.remove,
                      fnTruckReceipt
                    );
                this.setState({
                  selectedItems: updatedselectedItem,
                  operationsVisibilty,
                });
                this.getReceipt(updatedselectedItem[0]);
              }
            }
          );
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in GetReceiptListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting Truck Receipt List:", error);
      });
  }
  handleShareholderSelectionChange = (shareholder) => {
    try {
      //let { operationsVisibilty } = { ...this.state };
      // operationsVisibilty.delete = false;
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
        //operationsVisibilty,
      });
      this.getTruckReceiptList(shareholder);
      this.getTerminalsList(shareholder);
      this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "TruckReceiptComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  getReciptsStatusOperations(receiptItem) {
    try {
      var receiptStatus = receiptItem.ReceiptStatus;
      var isVolumneBased = receiptItem.IsVolumeBased;
      var selectedShareholder = this.state.selectedShareholder;
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
            if (result.EntityResult[operation]) nextOperations.push(operation);
          });

          this.setState({ shipmentNextOperations: nextOperations });
        })
        .catch((error) => {
          console.log("Error while getting getReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetReceiptActivityInfo();
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTruckReceipt
      );
      this.setState({
        operationsVisibilty,
      });
      this.getTruckReceiptList(this.state.selectedShareholder);
      this.getTerminalsList(this.state.selectedShareholder);
      this.getKPIList(this.state.selectedShareholder);
      // this.GetViewAllReceiptCustomData();
      // this.CheckReceiptDeleteAllowed();
    } catch (error) {
      console.log(
        "TruckReceiptComposite:Error occured on ComponentDidMount",
        error
      );
    }
    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage);
  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage);
  };

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  };

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
        "TruckReceiptComposite:Error occured on getTerminalsList",
        error
      );
    }
  }
  //Get KPI for Truck Receipt
  getKPIList(shareholder) {
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
        PageName: kpiTruckReceiptList,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }],
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
          console.log("Error while getting truck Receipt KPIList:", error);
        });
    }
  }
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
  handleLoadReceipts = () => {
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getTruckReceiptList(this.state.selectedShareholder);
    }
  };
  onBack = () => {
    let operationsVisibilty = { ...this.state.operationsVisibilty };
    this.setState({
      isManualEntry: false,
      isViewAuditTrail: false,
      isDetails: false,
      operationsVisibilty,
      isViewUnloading: false,
      isReadyToRender: false,
    });
    this.getTruckReceiptList(this.state.selectedShareholder);
  };
  getReciptStatuses(receiptRow) {
    try {
      axios(
        RestAPIs.GetReceiptAllStatuses +
          "?shareholderCode=" +
          this.state.selectedShareholder +
          "&receiptCode=" +
          receiptRow.Common_Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
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
  handleAuthorizeToUnLoad(receiptItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
      {
        key: KeyCodes.vehicleCode,
        value: receiptItem.VehicleCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ReceiptAuthorizeToUnload,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AuthorizeToLoad:", error);
      });
  }
  handleAllowToLoad(receiptItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ReceiptAllowToUnLoad,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  }
  handleViewAuditTrail(receiptItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetTruckReceiptAuditTrailList,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while getting handleViewAuditTrail:", error);
      });
  }
  handleViewUnLoading(receiptItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ViewReceiptUnloading,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  }
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
          value: this.state.selectedShareholder,
        },
        {
          key: KeyCodes.receiptStatus,
          value: this.state.receipt.ReceiptStatus,
        },
        {
          key: KeyCodes.receiptCode,
          value: this.state.receipt.ReceiptCode,
        },
        {
          key: KeyCodes.driverCode,
          value: this.state.receipt.DriverCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.state.selectedShareholder,
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
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.getTruckReceiptList(this.state.selectedShareholder);
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
          console.log("Error while ReceiptClose:", error);
        });
    } catch (error) {
      console.log("Error while closing the Receipt:", error);
    }
  };
  getRecordWeight = (receiptItem, shCode, token, callback) => {
    axios(
      RestAPIs.GetWeighBridgeForReceipt,
      Utilities.getAuthenticationObjectforGet(token)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isRecordWeight: true,
            recordWeightList: result.EntityResult,
          });
        }
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  };

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
        message: "ViewReceiptList_RecordWeight",
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
        ShareHolderCode: this.state.selectedShareholder,
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
              this.getTruckReceiptList(this.state.selectedShareholder);
            });
          }
          notification.messageResultDetails[0].errorMessage =
            response.data.ErrorList[0];

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
      ];
      let notification = {
        messageType: "critical",
        message: "ViewReceiptList_RecordWeight",
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
        ShareHolderCode: this.state.selectedShareholder,
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
              this.getTruckReceiptList(this.state.selectedShareholder);
            });
          }
          notification.messageResultDetails[0].errorMessage =
            response.data.ErrorList[0];

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
  handleAllowOutOfRangeTW = (cellData) => {
    this.setState({ allowOutofRangeTW: cellData });
  };
  setWeighBridgeValue = (cellData) => {
    this.setState({ weighBridgeCode: cellData });
  };

  handleSealNoInput = (data) => {
    let cellInfo = data.rowData;
    return (
      <Input
        fluid
        value={cellInfo.SealNo}
        disabled={false}
        onChange={(celldata) => {
          let sealCompartments = lodash.cloneDeep(this.state.sealCompartments);

          let index = sealCompartments.findIndex((comp) => {
            return (
              comp.CompartmentSeqNoInVehicle ===
              cellInfo.CompartmentSeqNoInVehicle
            );
          });

          if (index >= 0) {
            sealCompartments[index].SealNo = celldata;
          }

          this.setState({ sealCompartments });
        }}
        reserveSpace={false}
      />
    );
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
        console.log("Error while GetSealCompartmentsforReceipt:", error);
      });
  }

  handleSealClose = () => {
    this.setState({
      isSealCompartments: false,
      sealCompartments: [],
    });
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
                    placeholder={t("ViewReceipt_WBMandatory")}
                    label={t("ViewReceipt_WeighBridgeCode")}
                    value={this.state.weighBridgeCode}
                    options={Utilities.transferListtoOptions(
                      this.state.recordWeightList
                    )}
                    //onChange={(cellData) => this.setWeighBridgeValue(cellData)}
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
                    content={t("ViewReceipt_ReadWeight")}
                    className="shipmentRecordWeightButton"
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
                    label={t("ViewReceipt_Weight")}
                    reserveSpace={false}
                    disabled={true}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Checkbox
                    className="LabelEnabled"
                    label={t("ViewReceipt_AllowOutOfTolerance")}
                    checked={this.state.allowOutofRangeTW}
                    onChange={(cellData) =>
                      this.handleAllowOutOfRangeTW(cellData)
                    }
                    disabled={false}
                  />
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("ViewReceipt_RecordTareWeight")}
                className="shipmentRecordWeightOtherbuttons"
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
                content={t("ViewReceipt_RecordLadenWeight")}
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
                  this.setState({ isRecordWeight: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };
  handlePrintRAN = (receiptItem, shCode, token, callback) => {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ReceiptPrintRAN,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  };
  handlePrintBOD = (receiptItem, shCode, token, callback) => {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ReceiptPrintBOD,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  };
  handleSendBOD = (receiptItem, shCode, token, callback) => {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ReceiptSendBOD,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  };
  handleBSIOutbound = (receiptItem, shCode, token, callback) => {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.receiptStatus,
        value: receiptItem.ReceiptStatus,
      },
      {
        key: KeyCodes.receiptCode,
        value: receiptItem.ReceiptCode,
      },
      {
        key: KeyCodes.driverCode,
        value: receiptItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.ReceiptBSIOutboundRegenerate,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  };

  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/" + "TMBOD";
    } else {
      path = "TM/" + Constants.TMReports + "/" + "TMBOD";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      Shareholder: this.state.selectedShareholder,
      ReceiptCode:
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

  authorizeToUnLoadOnClick = () => {
    let showAuthorizeToUnLoadAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showAuthorizeToUnLoadAuthenticationLayout }, () => {
      if (showAuthorizeToUnLoadAuthenticationLayout === false) {
        this.authorizeToUnLoad();
      }
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

    this.handleAuthorizeToUnLoad(
      lodash.cloneDeep(this.state.receipt),
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getTruckReceiptList(this.state.selectedShareholder);
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

    this.handleAllowToLoad(
      lodash.cloneDeep(this.state.receipt),
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getTruckReceiptList(this.state.selectedShareholder);
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

    this.handlePrintRAN(
      lodash.cloneDeep(this.state.receipt),
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getTruckReceiptList(this.state.selectedShareholder);
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
    this.handleViewBOD();
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

    this.handlePrintBOD(
      lodash.cloneDeep(this.state.receipt),
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getTruckReceiptList(this.state.selectedShareholder);
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
        this.authorizeToUnLoadOnClick();
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_AllowUnLoad:
        this.allowToUnLoadOnClick();
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_ManualEntry:
        this.setState({ isManualEntry: true });
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_RecordWeight:
        this.getRecordWeight(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.handleRecordWeight();
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
        //  this.setState({isRecordWeight:true}, this.handleRecordWeight);
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_CloseReceipt:
        this.setState({ isCloseReceipt: true });

        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_PrintRAN:
        this.printRANClick();
        break;
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_ViewUnloading:
        this.handleViewUnLoading(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
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
              var { operationsVisibilty } = { ...this.state };
              operationsVisibilty.add = false;
              operationsVisibilty.delete = false;
              this.setState({
                operationsVisibilty,
                ModViewUnloadDetails: result.EntityResult.Table,
                isViewUnloading: true,
              });
              console.log("viewunloading", this.state.ModViewUnloadDetails);
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
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_PrintBOD:
        this.printBODClick();
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
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_SendBOD:
        this.handleSendBOD(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getTruckReceiptList(this.state.selectedShareholder);
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
      case Constants.ViewAllTruckReceiptOperations.ViewReceipt_ViewAuditTrail:
        this.handleViewAuditTrail(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
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
              var { operationsVisibilty } = { ...this.state };
              operationsVisibilty.add = false;
              operationsVisibilty.delete = false;
              this.setState({
                operationsVisibilty,
                auditTrailList: result.EntityResult,
                modAuditTrailList: modAuditTrailList,
                isViewAuditTrail: true,
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
      case Constants.ViewAllTruckReceiptOperations.viewReceipt_BSIOutbound:
        this.handleBSIOutbound(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getTruckReceiptList(this.state.selectedShareholder);
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
          this.state.receipt.ReceiptCode,
          this.state.selectedShareholder,
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
      ShareHolderCode: this.state.selectedShareholder,
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

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

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
      console.log("Receipt Composite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showDeleteAuthenticationLayout: false,
      showAuthorizeToUnLoadAuthenticationLayout: false,
      showAllowToUnLoadAuthenticationLayout: false,
      showCloseReceiptAuthenticationLayout: false,
      showViewBODAuthenticationLayout: false,
      showPrintBODAuthenticationLayout: false,
      showRANAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    if (this.state.showDeleteAuthenticationLayout) return fnTruckReceipt;
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
    if (this.state.showDeleteAuthenticationLayout) return functionGroups.remove;
    else return functionGroups.modify;
  }

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
      ShareHolderCode: this.state.selectedShareholder,
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
          this.getTruckReceiptList(this.state.selectedShareholder);
          this.setState({ isAllocateBay: false });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ResultDataList[0].ErrorList[0];
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
      ShareHolderCode: this.state.selectedShareholder,
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
          this.getTruckReceiptList(this.state.selectedShareholder);
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
        console.log("Error while DeAllocateBay:", error);
      });
  }

  handleOperation() {
    if (this.state.showDeleteAuthenticationLayout) return this.handleDelete;
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
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(this.state.receipt.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.receipt.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.receipt.LastActiveTime !== undefined &&
          this.state.receipt.LastActiveTime !== null
            ? new Date(this.state.receipt.LastActiveTime).toLocaleDateString() +
              " " +
              new Date(this.state.receipt.LastActiveTime).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.receipt.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.receipt.CreatedTime).toLocaleTimeString(),
      },
    ];
    let fillPage = true;
    let reciptSelected = this.state.selectedItems.length === 1;

    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            onAdd={this.handleAdd}
            onDelete={this.authenticateDelete}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails ? (
          <ErrorBoundary>
            <TruckReceiptDetailsComposite
              key="TruckReceiptDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              terminalCodes={this.state.terminalCodes}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              ReceiptType={this.state.receiptType}
              handleAuthorizeToUnLoad={this.handleAuthorizeToUnLoad}
              handleAllowToLoad={this.handleAllowToLoad}
              handleViewAuditTrail={this.handleViewAuditTrail}
              handleViewUnLoading={this.handleViewUnLoading}
              handleReceiptClose={this.handleReceiptClose}
              handleRecordWeight={this.handleRecordWeight}
              getRecordWeight={this.getRecordWeight}
              handlePrintRAN={this.handlePrintRAN}
              handlePrintBOD={this.handlePrintBOD}
              handleBSIOutbound={this.handleBSIOutbound}
              handleSendBOD={this.handleSendBOD}
              handleViewBOD={this.handleViewBOD}
            ></TruckReceiptDetailsComposite>
          </ErrorBoundary>
        ) : (
          <div>
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
                  expandedRows={this.state.expandedRows}
                  toggleExpand={this.toggleExpand}
                ></TruckReceiptViewUnLoadingDetails>
              </ErrorBoundary>
            ) : this.state.isViewAuditTrail ? (
              <ErrorBoundary>
                <TruckReceiptViewAuditTrailDetails
                  ReceiptCode={this.state.selectedItems[0].Common_Code}
                  selectedRow={this.state.selectedRow}
                  auditTrailList={this.state.auditTrailList}
                  modAuditTrailList={this.state.modAuditTrailList}
                  handleBack={this.onBack}
                ></TruckReceiptViewAuditTrailDetails>
              </ErrorBoundary>
            ) : this.state.isManualEntry ? (
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
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
                  )}
                </TranslationConsumer>
                <TruckReceiptManualEntryDetailsComposite
                  receipt={this.state.receipt}
                  handleBack={this.onBack}
                  selectedShareholder={this.state.selectedShareholder}
                ></TruckReceiptManualEntryDetailsComposite>
              </ErrorBoundary>
            ) : (
              <div>
                <ErrorBoundary>
                  <div className="kpiSummaryContainer">
                    <KPIDashboardLayout
                      kpiList={this.state.truckReceiptKPIList}
                      pageName="TruckReceipt"
                    ></KPIDashboardLayout>
                  </div>
                </ErrorBoundary>
                <div
                  className={
                    reciptSelected
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
                      handleLoadOrders={this.handleLoadReceipts}
                      filterText="LoadReceipts"
                    ></TMTransactionFilters>
                  </ErrorBoundary>
                  {this.state.isReadyToRender ? (
                    <ErrorBoundary>
                      <div
                        className={
                          fillPage === true ? "compositeTransactionList" : ""
                        }
                      >
                        <TruckReceiptSummaryPageComposite
                          tableData={this.state.data.Table}
                          columnDetails={this.state.data.Column}
                          pageSize={
                            this.props.userDetails.EntityResult.PageAttibutes
                              .WebPortalListPageSize
                          }
                          exportRequired={true}
                          exportFileName="TruckReceiptList"
                          columnPickerRequired={true}
                          terminalsToShow={
                            this.props.userDetails.EntityResult.PageAttibutes
                              .NoOfTerminalsToShow
                          }
                          selectedItems={this.state.selectedItems}
                          selectionRequired={true}
                          columnGroupingRequired={true}
                          onSelectionChange={this.handleSelection}
                          onRowClick={this.handleRowClick}
                          parentComponent={this.componentName}
                        ></TruckReceiptSummaryPageComposite>
                      </div>
                    </ErrorBoundary>
                  ) : (
                    <LoadingPage message="Loading"></LoadingPage>
                  )}
                </div>
                {reciptSelected ? (
                  <div
                    className={
                      this.state.drawerStatus ? "marineStatusLeftPane" : ""
                    }
                  >
                    <TransactionSummaryOperations
                      selectedItem={this.state.selectedItems}
                      shipmentNextOperations={this.state.shipmentNextOperations}
                      handleDetailsPageClick={this.handleRowClick}
                      handleOperationButtonClick={this.handleOperationClick}
                      currentStatuses={this.state.currentReceiptStatus}
                      handleDrawer={this.handleDrawer}
                      isDetails={false}
                      isEnterpriseNode={
                        this.props.userDetails.EntityResult.IsEnterpriseNode
                      }
                      webPortalAllowedOperations={[
                        "ViewReceipt_ViewUnloading",
                        "ViewReceipt_ViewBOD",
                        "ViewReceipt_ViewAuditTrail",
                      ]}
                      isWebPortalUser={
                        this.props.userDetails.EntityResult.IsWebPortalUser
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
                      title={"ViewAllReceipt_Details"}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        )}
        {Object.keys(this.state.selectedRow).length > 0 ||
        this.state.selectedItems.length === 1
          ? this.renderModal()
          : ""}
        {this.state.showDeleteAuthenticationLayout ||
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
        {this.props.shipmentSource === undefined ? (
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
        ) : (
          ""
        )}
        {this.state.isSealCompartments ? (
          <ErrorBoundary>
            <TruckReceiptSealDetailsComposite
              transactionCode={this.state.receipt.ReceiptCode}
              selectedShareholder={this.state.selectedShareholder}
              sealCompartments={this.state.sealCompartments}
              handleSealClose={this.handleSealClose}
            ></TruckReceiptSealDetailsComposite>
          </ErrorBoundary>
        ) : null}
        {this.state.isRecordWeight ? this.handleRecordWeight() : null}
        {this.state.isCloseReceipt ? this.handleCloseReceipttModal() : null}
        {this.state.isAllocateBay ? this.confirmAllocateBay() : null}
        {this.state.isDeAllocateBay ? this.confirmDeAllocateBay() : null}
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
TruckReceiptComposite.propTypes = {
  activeItem: PropTypes.object,
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string,
};
export default connect(mapStateToProps)(TruckReceiptComposite);
