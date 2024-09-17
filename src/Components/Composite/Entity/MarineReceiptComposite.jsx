import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { MarineReceiptSummaryPageComposite } from "../Summary/MarineReceiptSummaryComposite.jsx";
import MarineReceiptDetailsComposite from "../Details/MarineReceiptDetailsComposite";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestApis from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import {
  functionGroups,
  fnMarineReceipt,
  fnMarineReceiptByCompartment,
  fnPrintMarineRAN,
  fnPrintMarineBOD,
  fnViewMarineUnloadingDetails,
  fnViewMarineReceiptAuditTrail,
  fnCloseMarineReceipt,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import MarineReceiptViewAuditTrailComposite from "../Details/MarineReceiptViewAuditTrailDetailsComposite";
import MarineReceiptLoadingDetails from "../../UIBase/Details/MarineReceiptLoadingDetails";
import { Button, Input, Modal } from "@scuf/common";
import lodash from "lodash";
import { TranslationConsumer } from "@scuf/localization";
import { marineReceiptValidationDef } from "../../../JS/ValidationDef";
import MarineReceiptManualEntryDetailsComposite from "../Details/MarineReceiptManualEntryDetailsComposite";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
//import TransactionSummaryOperationsMarine from "../Common/TransactionSummaryOperationsMarine";
import { kpiMarineReceiptList } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class MarineReceiptComposite extends Component {
  state = {
    receiptItem: {},
    receipt: {},
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    receiptNextOperations: [],
    isViewUnloading: false,
    ViewUnloadingData: [],
    ViewUnloadingHideFields: [],
    isViewAudit: false,
    currentReceiptStatuses: [],
    lastStatus: "",
    selectedShareholder: "",
    data: {},
    terminalCodes: [],
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    isOperation: false,
    marinePanle: false,
    openReceipt: false,
    reason: "",
    validationErrors: Utilities.getInitialValidationErrors(
      marineReceiptValidationDef
    ),
    marineReceiptBtnStatus: false,
    marineReceiptBtnCloseOK: false,
    viewTab: 0,
    isMarinReceiptManualEntry: false,
    drawerStatus: false,
    showReport: false,
    marineReceiptKPIList: [],
    // updateEnableForConfigure: false,
    deleteEnableForConfigure: [],
    activityInfo: [],

    showDeleteAuthenticationLayout: false,
    showAuthorizeToUnLoadAuthenticationLayout: false,
    showCloseReceiptAuthenticationLayout: false,
    showViewBODAuthenticationLayout: false,
    showPrintBODAuthenticationLayout: false,
    showRANAuthenticationLayout: false,
  };

  componentName = "MarineReceiptComponent";

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({ isDetails: "false" }, () => {
        this.setState({
          drawerStatus: false,
          viewTab: 0,
          isDetails: "true",
          marinePanle: false,
          isReadyToRender: false,
          selectedRow: {},
          operationsVisibilty,
          // updateEnableForConfigure: true,
          deleteEnableForConfigure: [],
        });
      });
    } catch (error) {
      console.log("MarineReceiptComposite:Error occured on handleAdd");
    }
  };

  handleDelete = () => {
    this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty, deleteEnableForConfigure: [] });
      var deleteMarineReceiptKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var MarineReceiptCode = this.state.selectedItems[i]["Common_Code"];
        var KeyData = {
          KeyCodes: [
            { Key: KeyCodes.marineReceiptCode, Value: MarineReceiptCode },
          ],
        };
        deleteMarineReceiptKeys.push(KeyData);
      }

      axios(
        RestApis.MarineReceiptDeleteMarineReceipt,
        Utilities.getAuthenticationObjectforPost(
          deleteMarineReceiptKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          // var isRefreshDataRequire = result.isSuccess;
          // if (
          //   response.ResultDataList !== null &&
          //   result.ResultDataList !== undefined
          // ) {
          //   var failedResultsCount = result.ResultDataList.filter(function (
          //     res
          //   ) {
          //     console.info(res)
          //     return !res.isSuccess;
          //   }).length;
          //   if (failedResultsCount === result.ResultDataList.length) {
          //     isRefreshDataRequire = false;
          //   } else isRefreshDataRequire = true;
          // }
          var notification = Utilities.convertResultsDatatoNotification(
            result,
            "Receipt_DeletionStatus",
            ["MarineReceiptCode"]
          );
          // if (isRefreshDataRequire) {
          this.getMarineReceiptList();
          this.getKPIList();
          operationsVisibilty.delete = false;
          this.setState(
            {
              selectedItems: [],
              operationsVisibilty,
              deleteEnableForConfigure: [],
              selectedRow: {},
              isDetails: "false",
            },
            () => {
              if (this.state.marinePanle) {
                this.setState({
                  isDetails: "true",
                  marinePanle: false,
                  isReadyToRender: false,
                });
              }
            }
          );
          // }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0) {
              messageResult.keyFields[0] = "ReceiptCode";
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
      console.log("MarineReceiptComposite:Error occured on handleDelete");
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
      this.getMarineReceiptList();
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnMarineReceiptByCompartment
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: "false",
        marinePanle: false,
        isViewDetails: "false",
        isViewUnloading: "false",
        isViewAudit: "false",
        isMarinReceiptManualEntry: "false",
        selectedRow: {},
        selectedItems: [],
        ViewUnloadingData: [],
        ViewUnloadingHideFields: [],
        operationsVisibilty,
        deleteEnableForConfigure: [],
        drawerStatus: false,
        isReadyToRender: false,
      });
      this.getMarineReceiptList();
      this.getKPIList();
    } catch (error) {
      console.log("MarineReceiptComposite:Error occured on Back click", error);
    }
  };

  handleBackPage = () => {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: this.state.receiptItem.Common_Code,
      },
    ];
    var obj = {
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
          var item = {
            Common_Code: result.EntityResult.ReceiptCode,
            MarineReceiptByCompartmentList_ReceiptStatus:
              result.EntityResult.ReceiptStatus,
          };
          try {
            var { operationsVisibilty } = { ...this.state };
            operationsVisibilty.add = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnMarineReceiptByCompartment
            );
            operationsVisibilty.delete = false;
            this.setState({
              isDetails: "true",
              marinePanle: true,
              isViewDetails: "false",
              isViewUnloading: "false",
              isViewAudit: "false",
              isMarinReceiptManualEntry: "false",
              ViewUnloadingData: [],
              ViewUnloadingHideFields: [],
              operationsVisibilty,
              deleteEnableForConfigure: [],
              isReadyToRender: false,
            });
            this.GetReceiptStatusOperations(item);
            this.GetMarineReceiptAllStatuses(item);
            // this.GetViewAllMarineReceiptCustomData(item, true);
            this.setState({ isOperation: true });
          } catch (error) {
            console.log(
              "MarineReceiptComposite:Error occured on Back click",
              error
            );
          }
        }
      })
      .catch((error) => { });
  };

  handleRowClick = (item) => {
    try {
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnMarineReceiptByCompartment
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "ReceiptCompDetail_Permission",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "ReceiptCompDetail_ViewReceiptPermission",
            },
          ],
        };
        this.savedEvent(item, "Permission", notification);
        return;
      }
      var { operationsVisibilty, activityInfo } = { ... this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnMarineReceiptByCompartment
      );
      // operationsVisibilty.delete = Utilities.isInFunction(
      //   this.props.userDetails.EntityResult.FunctionsList,
      //   functionGroups.remove,
      //   fnMarineReceipt
      // )&&deleteEnableForConfigure;

      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ReceiptActivityInfo.MARINE_RECEIPT_ENABLE_DELETE &&
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
          item.MarineReceiptByCompartmentList_ReceiptStatus.toUpperCase()
        ) > -1 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnMarineReceiptByCompartment
        );

      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        marinePanle: true,
        selectedRow: item,
        receiptItem: item,
        selectedItems: [item],
        operationsVisibilty,
      });
      this.GetReceiptStatusOperations(item);
      this.GetMarineReceiptAllStatuses(item);
      this.getReceipt(item);
      // this.GetViewAllMarineReceiptCustomData(item, true);
      this.setState({ isOperation: true });
    } catch (error) {
      console.log(
        "MarineReceiptComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  handleSelection = (items) => {
    this.setState({ receiptItem: items[0], selectedItems: items, });
    // let isReady =
    //   items.findIndex(
    //     (x) =>
    //       x.MarineReceiptByCompartmentList_ReceiptStatus.toUpperCase() ===
    //       Constants.Shipment_Status.READY
    //   ) >= 0;
    try {
      var { operationsVisibilty, drawerStatus, activityInfo } = { ...this.state };
      if (items.length === 0) {
        operationsVisibilty.delete = false;
      }

      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ReceiptActivityInfo.MARINE_RECEIPT_ENABLE_DELETE &&
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
              x.MarineReceiptByCompartmentList_ReceiptStatus.toUpperCase()
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
          fnMarineReceiptByCompartment
        );

      // operationsVisibilty.delete =
      //   isReady &&
      //   items.length > 0 &&
      //   Utilities.isInFunction(
      //     this.props.userDetails.EntityResult.FunctionsList,
      //     functionGroups.remove,
      //     fnMarineReceipt
      //   );
      drawerStatus = false;
      this.setState({
        operationsVisibilty,
        deleteEnableForConfigure: [],
        isOperation: false,
        marinePanle: false,
        drawerStatus,
      });
      // for (let i = 0; i < items.length; i++) {
      //   this.GetViewAllMarineReceiptCustomData(items[i], false);
      // }
      if (items.length === 1) {
        this.GetReceiptStatusOperations(items[0]);
        this.GetMarineReceiptAllStatuses(items[0]);
        this.getReceipt(items[0]);
        this.setState({ isOperation: true });
      }
    } catch (error) {
      console.log(
        "MarineReceiptComposite:Error occured on handleSelection",
        error
      );
    }
  };

  handleDetailsPageClick = (item) => {
    try {
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnMarineReceiptByCompartment
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "ReceiptCompDetail_Permission",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "ReceiptCompDetail_ViewReceiptPermission",
            },
          ],
        };
        this.savedEvent(item, "Permission", notification);
        return;
      }
      var { operationsVisibilty } = this.state;
      // operationsVisibilty.add = Utilities.isInFunction(
      //   this.props.userDetails.EntityResult.FunctionsList,
      //   functionGroups.add,
      //   fnMarineReceipt
      // );
      // operationsVisibilty.delete = Utilities.isInFunction(
      //   this.props.userDetails.EntityResult.FunctionsList,
      //   functionGroups.remove,
      //   fnMarineReceipt
      // )&&deleteEnableForConfigure;
      operationsVisibilty.shareholder = false;
      if (item.MarineReceiptByCompartmentList_ReceiptStatus !== undefined) {
        this.GetReceiptStatusOperations(item);
      }
      this.GetMarineReceiptAllStatuses(item);
      // this.GetViewAllMarineReceiptCustomData(item, true);
      this.setState(
        {
          isDetails: "true",
          marinePanle: true,
          viewTab: 2,
          selectedRow: item,
          // selectedItems: [item],
          operationsVisibilty,
          receiptItem: item,
        },
        () => {
          this.setState({ isOperation: true });
        }
      );
    } catch (error) {
      console.log(
        "MarineReceiptComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  getReceipt(receiptRow) {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: receiptRow.Common_Code,
      },
    ];
    var obj = {
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
          this.setState({
            receipt: result.EntityResult,
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting Receipt:", error, receiptRow);
      });
  }

  GetReceiptStatusOperations(items) {
    try {
      axios(
        RestApis.GetMarineReceiptOperations +
        "?MarineReceiptStatus=" +
        items.MarineReceiptByCompartmentList_ReceiptStatus,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          let nextOperations = [];
          Object.keys(result.EntityResult).forEach((operation) => {
            if (result.EntityResult[operation]) {
              nextOperations.push(operation);
            }
          });
          if (this.props.userDetails.EntityResult.IsWebPortalUser) {
            let filteredOptions = nextOperations.filter(function (item) {
              return (
                item !==
                Constants.ViewAllReceiptOperations.ViewReceipt_PrintRAN &&
                item !== Constants.ViewAllReceiptOperations.ViewReceipt_PrintBOD
              );
            });
            nextOperations = filteredOptions;
          }
          if (this.props.userDetails.EntityResult.IsArchived) {
            let filteredOptions = nextOperations.filter(function (item) {
              return (
                item ===
                Constants.ViewAllReceiptOperations.ViewReceipt_ViewBOD ||
                item ===
                Constants.ViewAllReceiptOperations
                  .ViewReceipt_ViewTransactions ||
                item ===
                Constants.ViewAllReceiptOperations
                  .ViewReceipt_AuthorizeToUnload
              );
            });
            nextOperations = filteredOptions;
          }
          let results = nextOperations.filter((item) => {
            if (
              item ===
              Constants.ViewAllReceiptOperations.ViewReceipt_ViewTransactions
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnViewMarineUnloadingDetails
                )
              ) {
                return true;
              } else {
                return false;
              }
            }

            if (
              item ===
              Constants.ViewAllReceiptOperations.ViewReceipt_ViewAuditTrail
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnViewMarineReceiptAuditTrail
                )
              ) {
                return true;
              } else {
                return false;
              }
            }

            if (
              item === Constants.ViewAllReceiptOperations.ViewReceipt_PrintRAN
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnPrintMarineRAN
                )
              ) {
                return true;
              } else {
                return false;
              }
            }

            if (
              item ===
              Constants.ViewAllReceiptOperations.ViewReceipt_CloseReceipt
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnCloseMarineReceipt
                )
              ) {
                return true;
              } else {
                return false;
              }
            }

            if (
              item === Constants.ViewAllReceiptOperations.ViewReceipt_PrintBOD
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnPrintMarineBOD
                )
              ) {
                return true;
              } else {
                return false;
              }
            }

            if (
              item === Constants.ViewAllReceiptOperations.ViewReceipt_ViewBOD
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnPrintMarineBOD
                )
              ) {
                return true;
              } else {
                return false;
              }
            }

            return true;
          });
          if (
            !this.props.userDetails.EntityResult.IsEnterpriseNode &&
            items.MarineReceiptByCompartmentList_ReceiptStatus !== "READY" &&
            items.localTerminalCode === null
          ) {
            results = [];
          }
          this.setState({
            receiptNextOperations: results,
          });
        })
        .catch((error) => {
          console.log("Error while getting GetReceiptStatusOperations:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  GetMarineReceiptAllStatuses(item) {
    axios(
      RestApis.GetMarineReceiptAllStatuses +
      "?MarineReceiptCode=" +
      item["Common_Code"] +
      "&ShipmentType=" +
      "COMPARTMENT",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            currentReceiptStatuses: result.EntityResult,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty, activityInfo } = { ...this.state };

      let receiptDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ReceiptActivityInfo.MARINE_RECEIPT_ENABLE_DELETE &&
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
          fnMarineReceiptByCompartment
        );
        // operationsVisibilty.delete = data.ReceiptStatus === "READY";
        if (data !== null && data !== '') {
          operationsVisibilty.delete = this.props.userDetails.EntityResult.IsWebPortalUser ? false
            : receiptDeleteStates.indexOf(data.ReceiptStatus.toUpperCase()) > -1 &&
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              fnMarineReceiptByCompartment
            );
          this.setState({ isDetailsModified: "true", operationsVisibilty });
        }
      }
      if (notification.messageType === "success" && saveType === "add" && data !== null && data !== '') {
        var selectedItems = [
          {
            MarineReceiptCode: data.ReceiptCode,
            Common_Shareholder:
              data.RailMarineReceiptCompartmentDetailPlanList[0]
                .ShareholderCode,
            Common_Code: data.ReceiptCode,
            MarineReceiptByCompartmentList_ReceiptStatus: data.ReceiptStatus,
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
      console.log("MarineReceiptComposite:Error occured on savedEvent", error);
    }
  };

  handleClickRefresh(item) {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: item.ReceiptCode,
      },
    ];
    var obj = {
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
          let dataItem = {
            Common_Code: result.EntityResult.ReceiptCode,
            MarineReceiptByCompartmentList_ReceiptStatus:
              result.EntityResult.ReceiptStatus,
          };
          this.setState(
            {
              isDetails: "false",
              marinePanle: false,
            },
            () => {
              this.setState({
                receiptItem: dataItem,
              });
              this.handleDetailsPageClick(dataItem);
              this.GetReceiptStatusOperations(dataItem);
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting Receipt:", error);
      });
  }

  handlePageAdd = (item) => {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: item.ReceiptCode,
      },
    ];
    var obj = {
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
          let dataItem = {
            Common_Code: result.EntityResult.ReceiptCode,
            MarineReceiptByCompartmentList_ReceiptStatus:
              result.EntityResult.ReceiptStatus,
          };
          this.setState(
            {
              isDetails: "false",
              marinePanle: false,
            },
            () => {
              this.setState({
                isDetails: "true",
                marinePanle: true,
                receiptItem: [dataItem],
              });
              this.handleRowClick(dataItem);
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting Receipt:", error);
      });
  };

  getMarineReceiptList() {
    this.setState({ isReadyToRender: false });
    let fromDate = new Date(this.state.fromDate);
    let toDate = new Date(this.state.toDate);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);
    let obj = {
      startRange: fromDate,
      endRange: toDate,
      TransportationType: Constants.TransportationType.MARINE,
    };
    axios(
      RestApis.GetMarineReceiptListForRole,
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

                let { operationsVisibilty, activityInfo } = { ...this.state }

                let receiptDeleteInfo = activityInfo.filter((item) => {
                  return (
                    item.ActivityCode ===
                    Constants.ReceiptActivityInfo.MARINE_RECEIPT_ENABLE_DELETE &&
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
                    updatedselectedItem[0].MarineReceiptByCompartmentList_ReceiptStatus.toUpperCase()
                  ) > -1 &&
                  Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.remove,
                    fnMarineReceiptByCompartment
                  );

                this.setState({
                  selectedItems: updatedselectedItem,
                  receiptItem: updatedselectedItem[0],
                  operationsVisibilty
                });
                this.GetReceiptStatusOperations(updatedselectedItem[0]);
                this.GetMarineReceiptAllStatuses(updatedselectedItem[0]);
              }
            }
          );
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error in GetMarineReceiptListForRole:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while geting MarineReceipt List:", error);
      });
  }

  getTerminalsList(shareholder) {
    try {
      if (shareholder !== null && shareholder !== "") {
        axios(
          RestApis.GetTerminals,
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
        "MarineReceiptComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnMarineReceiptByCompartment
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getTerminalsList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getMarineReceiptList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList();
      this.GetReceiptActivityInfo();
    } catch (error) {
      console.log(
        "MarineReceiptComposite:Error occured on componentDidMount",
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
        RestApis.GetReceiptActivityInfo,
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

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({ selectedShareholder: shareholder });
      this.getMarineReceiptList(shareholder);
      this.getTerminalsList(shareholder);
    } catch (error) {
      console.log(
        "MarineReceiptComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  getTransportationType() {
    var transportationType = Constants.TransportationType.MARINE;
    const { itemProps } = this.props.activeItem;
    if (itemProps !== undefined && itemProps.transportationType !== undefined) {
      transportationType = itemProps.transportationType;
    }
    return transportationType;
  }

  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/MarineBOD";
    } else {
      path = "TM/" + Constants.TMReports + "/MarineBOD";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      //ShareholderCode: this.state.selectedShareholder,
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
        proxyServerHost={RestApis.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }

  viewBODClick = () => {
    let showViewBODAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showViewBODAuthenticationLayout, }, () => {
      if (showViewBODAuthenticationLayout === false) {
        this.handleViewBOD();
      }
    })

  }

  handleViewBOD = () => {
    if (this.reportServiceURI === undefined) {
      axios(
        RestApis.GetReportServiceURI,
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

  handleOperationClick = (operation) => {
    this.setState({ marineReceiptBtnStatus: true });
    setTimeout(() => {
      this.setState({ marineReceiptBtnStatus: false });
    }, 800);

    if (
      operation ===
      Constants.ViewAllReceiptOperations.ViewReceipt_ViewTransactions
    ) {
      if (
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnViewMarineUnloadingDetails
        )
      ) {
        this.getMarineUnLoadingDetails(this.state.receiptItem);
      }
    } else if (
      operation ===
      Constants.ViewAllReceiptOperations.ViewReceipt_ViewAuditTrail
    ) {
      if (
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnViewMarineReceiptAuditTrail
        )
      ) {
        this.getMarineAuditTrail(this.state.receiptItem);
      }
    } else if (
      operation ===
      Constants.ViewAllReceiptOperations.ViewReceipt_AuthorizeToUnload
    ) {
      this.authorizeToUnloadClick();
    } else if (
      operation === Constants.ViewAllReceiptOperations.ViewReceipt_PrintRAN
    ) {
      if (
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnPrintMarineRAN
        )
      ) {
        this.PrintRANClick();
      }
    } else if (
      operation === Constants.ViewAllReceiptOperations.ViewReceipt_CloseReceipt
    ) {
      if (
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.modify,
          fnCloseMarineReceipt
        )
      ) {
        this.setState({ openReceipt: true });
      }
    } else if (
      operation === Constants.ViewAllReceiptOperations.ViewReceipt_PrintBOD
    ) {
      if (
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnPrintMarineBOD
        )
      ) {
        this.PrintBODClick();
      }
    } else if (
      operation === Constants.ViewAllReceiptOperations.ViewReceipt_BISOutbound
    ) {
      this.getMarineBISOutbound(this.state.receiptItem);
    } else if (
      operation === Constants.ViewAllReceiptOperations.ViewReceipt_ManualEntry
    ) {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;
      this.setState(
        {
          isMarinReceiptManualEntry: "true",
          operationsVisibilty,
          deleteEnableForConfigure: [],
        },
        () => { }
      );
    } else if (
      operation === Constants.ViewAllReceiptOperations.ViewReceipt_ViewBOD
    ) {
      if (
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnPrintMarineBOD
        )
      ) {
        this.viewBODClick();
      }
    }
  };

  onTabChange = (activeIndex) => {
    this.setState({
      viewTab: activeIndex,
    });
  };

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

  getMarineUnLoadingDetails(item) {
    var notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    try {
      axios(
        RestApis.GetMarineReceiptUnLoadingDetails +
        "?MarineReceiptCode=" +
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
            operationsVisibilty.delete = false;
            operationsVisibilty.add = false;
            operationsVisibilty.shareholder = false;
            this.setState({
              isViewUnloading: "true",
              isViewDetails: "false",
              operationsVisibilty,
              deleteEnableForConfigure: [],
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0] + Constants.delimiter + item.Common_Code;
            this.savedEvent("", "", notification);
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
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0] + Constants.delimiter + item.Common_Code;
            this.savedEvent("", "", notification);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getMarineAuditTrail(item) {
    var { operationsVisibilty } = { ...this.state };

    operationsVisibilty.delete = false;
    operationsVisibilty.shareholder = false;
    operationsVisibilty.add = false;
    this.setState({
      isViewAudit: "true",
      isViewDetails: "false",
      operationsVisibilty,
      deleteEnableForConfigure: [],
    });
  }

  authorizeToUnloadClick = () => {
    let showAuthorizeToUnLoadAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showAuthorizeToUnLoadAuthenticationLayout, }, () => {
      if (showAuthorizeToUnLoadAuthenticationLayout === false) {
        this.authorizeToUnload();
      }
    })

  }


  authorizeToUnload = () => {
    this.handleAuthenticationClose();
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: item.Common_Code,
      },
      {
        key: KeyCodes.receiptStatus,
        value: item.MarineReceiptByCompartmentList_ReceiptStatus,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };

    var notification = {
      messageType: "success",
      message: "ViewMarineReceipt_AuthorizeUnLoad_status",
      messageResultDetails: [
        {
          keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: true,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineReceiptAuthorizeToUnLoad,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (this.state.isDetails === "true") {
            // this.componentDidMount();
            var selectItem = {
              ReceiptCode: this.state.selectedItems[0].Common_Code,
            };
            this.handleClickRefresh(selectItem);
            this.setState(
              {
                isDetails: "false",
                marinePanle: false,
              },
              () => {
                this.setState({
                  isDetails: "true",
                  marinePanle: true,
                });
              }
            );
          } else {
            this.getMarineReceiptList();
          }
          this.savedEvent("", "", notification);
        } else {
          notification.messageType = "critical";
          notification.messageResultDetails[0].isSuccess = false;
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + item.Common_Code;
          this.savedEvent("", "", notification);
          console.log("Error in AuthorizeToUnLoad:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while AuthorizeToUnLoad:", error);
      });
  }

  PrintRANClick = () => {
    let showRANAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showRANAuthenticationLayout, }, () => {
      if (showRANAuthenticationLayout === false) {
        this.PrintRAN();
      }
    })

  }

  PrintRAN = () => {
    this.handleAuthenticationClose();
    let item = this.state.receiptItem;
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: item["Common_Code"],
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };

    var notification = {
      messageType: "success",
      message: "Receipt_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
          keyValues: [item["Common_Code"]],
          isSuccess: true,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineReceiptPrintRAN,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (this.state.isDetails === "true") {
            this.componentDidMount();
            this.setState(
              {
                isDetails: "false",
                marinePanle: false,
              },
              () => {
                this.setState({
                  isDetails: "true",
                  marinePanle: true,
                });
              }
            );
          } else {
            this.getMarineReceiptList();
          }
          this.savedEvent("", "", notification);
        } else {
          notification.messageType = "critical";
          notification.messageResultDetails[0].isSuccess = false;
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + item["Common_Code"];
          this.savedEvent("", "", notification);
          console.log("Error in PrintRAN:", result.ErrorList[0]);
        }
      })
      .catch((error) => {
        console.log("Error while PrintRAN:", error);
      });
  }


  PrintBODClick = () => {
    let showPrintBODAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showPrintBODAuthenticationLayout, }, () => {
      if (showPrintBODAuthenticationLayout === false) {
        this.PrintBOD();
      }
    })

  }

  PrintBOD = () => {
    this.handleAuthenticationClose();
    let item = this.state.receiptItem;
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: item["Common_Code"],
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };

    var notification = {
      messageType: "success",
      message: "Receipt_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: true,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineReceiptPrintBOD,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (this.state.isDetails === "true") {
            this.componentDidMount();
            this.setState(
              {
                isDetails: "false",
                marinePanle: false,
              },
              () => {
                this.setState({
                  isDetails: "true",
                  marinePanle: true,
                });
              }
            );
          } else {
            this.getMarineReceiptList();
          }
          this.savedEvent("", "", notification);
        } else {
          notification.messageType = "critical";
          notification.messageResultDetails[0].isSuccess = false;
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + item["Common_Code"];
          this.savedEvent("", "", notification);
          console.log("Error in PrintBOD:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while PrintBOD:", error);
      });
  }

  getMarineBISOutbound(item) {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: item["Common_Code"],
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };

    var notification = {
      messageType: "success",
      message: "ViewMarineReceipt_BSIOutbound_status",
      messageResultDetails: [
        {
          keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
          keyValues: [item["Common_Code"]],
          isSuccess: true,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestApis.MarineReceiptBSIOutboundReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (this.state.isDetails === "true") {
            this.componentDidMount();
            this.setState(
              {
                isDetails: "false",
                marinePanle: false,
              },
              () => {
                this.setState({
                  isDetails: "true",
                  marinePanle: true,
                });
              }
            );
          } else {
            this.getMarineReceiptList();
          }
          this.savedEvent("", "", notification);
        } else {
          notification.messageType = "critical";
          notification.messageResultDetails[0].isSuccess = false;
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + item["Common_Code"];
          this.savedEvent("", "", notification);
          console.log("Error in BISOutbound:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while BISOutbound:", error);
      });
  }

  renderCloseModal() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal
            onClose={() => this.setState({ openReceipt: false })}
            size="small"
            open={this.state.openReceipt}
            closeOnDimmerClick={false}
          >
            <Modal.Content>
              <div className="ViewMarineReceiptCloseHeader">
                <b> {t("ViewMarineReceipt_CloseHeader")}</b>
              </div>
              <div>
                <Input
                  fluid
                  value={this.state.reason}
                  indicator="required"
                  onChange={(data) => this.onFieldChange("Reason", data)}
                  label={t("ViewMarineReceiptList_Reason")}
                  error={t(this.state.validationErrors.Reason)}
                />
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                size="small"
                content={t("ViewMarineReceiptList_Cancel")}
                onClick={() =>
                  this.setState({
                    openReceipt: false,
                    validationErrors: [],
                    reason: "",
                  })
                }
              />
              <Button
                type="primary"
                size="small"
                content={t("ViewMarineReceiptList_Ok")}
                onClick={() => {
                  this.getMarineReason();
                }}
                disabled={this.state.marineReceiptBtnCloseOK}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  onFieldChange(propertyName, data) {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      this.setState({ reason: data });
      if (marineReceiptValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          marineReceiptValidationDef[propertyName],
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
        "MarineReceiptDetailsComposite:Error occured on handleChange",
        error
      );
    }
  }

  getMarineReason = () => {

    this.setState({ marineReceiptBtnCloseOK: true });
    setTimeout(() => {
      this.setState({ marineReceiptBtnCloseOK: false });
    }, 1800);

    if (this.onFieldChange("Reason", this.state.reason)) {

      let showCloseReceiptAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;

      this.setState({ showCloseReceiptAuthenticationLayout, }, () => {
        if (showCloseReceiptAuthenticationLayout === false) {
          this.CloseReceipt();
        }
      })

    }
  }

  CloseReceipt = () => {
    this.handleAuthenticationClose();
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: item.Common_Code,
      },
      {
        key: KeyCodes.marineReason,
        value: this.state.reason,
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
          keyValues: [item.Common_Code],
          isSuccess: true,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineReceiptCloseReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (this.state.isDetails === "true") {
            var selectItem = {
              ReceiptCode: this.state.selectedItems[0].Common_Code,
            };
            this.handleClickRefresh(selectItem);
          } else {
            this.componentDidMount();
          }
          // this.getMarineReceiptList();
          this.setState({ openReceipt: false, reason: "" });
          this.savedEvent("", "", notification);
        } else {
          notification.messageType = "critical";
          notification.messageResultDetails[0].isSuccess = false;
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + item.Common_Code;
          this.savedEvent("", "", notification);
        }
      })
      .catch((error) => {
        console.log("Error while CloseReceipt:", error);
      });
  }

  setValid = (fptransactionid, ProductCategoryType) => {
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: this.state.receiptItem["Common_Code"],
      },
      {
        key: KeyCodes.fptTansactionID,
        value: fptransactionid,
      },
      {
        key: KeyCodes.productCategoryType,
        value: ProductCategoryType,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.MarineReceiptSetValidReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.getMarineUnLoadingDetails(this.state.receiptItem);
        }
      })
      .catch((error) => {
        console.log("MarineDisatchComposite:Error occured on setValid", error);
      });
  };

  //Get KPI for Marine Receipt
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
        PageName: kpiMarineReceiptList,
        InputParameters: [],
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
            this.setState({
              marineReceiptKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ marineReceiptKPIList: [] });
            console.log("Error in marine Receipt KPIList:", result.ErrorList);
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
          console.log("Error while getting marine Receipt KPIList:", error);
        });
    }
  }
  // GetViewAllMarineReceiptCustomData(item, GoDetails) {
  //   let keyCode = [
  //     {
  //       key: KeyCodes.marineReceiptStatus,
  //       value: item.MarineReceiptByCompartmentList_ReceiptStatus,
  //     },
  //   ];
  //   let obj = {
  //     KeyCodes: keyCode,
  //   };
  //   axios(
  //     RestApis.GetViewAllMarineReceiptCustomData,
  //     Utilities.getAuthenticationObjectforPost(
  //       obj,
  //       this.props.tokenDetails.tokenInfo
  //     )
  //   )
  //     .then((response) => {
  //       const result = response.data;
  //       let { deleteEnableForConfigure, operationsVisibilty } = this.state;
  //       if (result.IsSuccess) {
  //         if (result.EntityResult.MarineReceiptUpdateAllow === "TRUE") {
  //           this.setState({
  //             updateEnableForConfigure: true,
  //           });
  //         } else {
  //           this.setState({
  //             updateEnableForConfigure: false,
  //           });
  //         }
  //         if (result.EntityResult.MarineReceiptDeleteAllow === "TRUE") {
  //           deleteEnableForConfigure.push(true);
  //         } else {
  //           deleteEnableForConfigure.push(false);
  //         }
  //         operationsVisibilty.add = Utilities.isInFunction(
  //           this.props.userDetails.EntityResult.FunctionsList,
  //           functionGroups.add,
  //           fnMarineReceipt
  //         );
  //         if (GoDetails) {
  //           operationsVisibilty.delete =
  //             deleteEnableForConfigure[deleteEnableForConfigure.length - 1] &&
  //             Utilities.isInFunction(
  //               this.props.userDetails.EntityResult.FunctionsList,
  //               functionGroups.remove,
  //               fnMarineReceipt
  //             );
  //         } else {
  //           let isAllDeleteEnable = deleteEnableForConfigure.every(
  //             (deleteEnable) => deleteEnable === true
  //           );
  //           operationsVisibilty.delete =
  //             isAllDeleteEnable &&
  //             Utilities.isInFunction(
  //               this.props.userDetails.EntityResult.FunctionsList,
  //               functionGroups.remove,
  //               fnMarineReceipt
  //             );
  //         }
  //         this.setState({ deleteEnableForConfigure, operationsVisibilty });
  //       } else {
  //         console.log("error in GetViewAllMarineReceiptCustomData");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error in GetViewAllMarineReceiptCustomData", error);
  //     });
  // }


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
      showPrintBODAuthenticationLayout: false,
      showRANAuthenticationLayout: false,
    });
  };


  getFunctionGroupName() {
    if (this.state.showDeleteAuthenticationLayout)
      return fnMarineReceiptByCompartment
    else if (this.state.showCloseReceiptAuthenticationLayout)
      return fnCloseMarineReceipt
    else if (this.state.showAuthorizeToUnLoadAuthenticationLayout)
      return fnMarineReceipt
    else if (this.state.showViewBODAuthenticationLayout || this.state.showPrintBODAuthenticationLayout)
      return fnPrintMarineBOD
    else if (this.state.showRANAuthenticationLayout)
      return fnPrintMarineRAN
  };

  getDeleteorEditMode() {
    if (this.state.showDeleteAuthenticationLayout)
      return functionGroups.remove;
    else
      return functionGroups.modify;
  };

  handleOperation() {

    if (this.state.showDeleteAuthenticationLayout)
      return this.handleDelete
    else if (this.state.showAuthorizeToUnLoadAuthenticationLayout)
      return this.authorizeToUnload
    else if (this.state.showCloseReceiptAuthenticationLayout)
      return this.CloseReceipt
    else if (this.state.showRANAuthenticationLayout)
      return this.PrintRAN
    else if (this.state.showViewBODAuthenticationLayout)
      return this.handleViewBOD;
    else if (this.state.showPrintBODAuthenticationLayout)
      return this.PrintBOD;
  };

  render() {
    let fillPage = true;
    let shipmentSelected = this.state.selectedItems.length === 1;
    let loadingClass = "globalLoader";
    if (
      this.props.shipmentSource !== undefined &&
      this.props.shipmentSource !== "" &&
      this.props.shipmentSource !== null
    ) {
      fillPage = false;
      loadingClass = "nestedList";
    }
    // let shipmentSelected =
    //   this.state.selectedItems.length === 1 &&
    //   this.props.userDetails.EntityResult.IsEnterpriseNode === false;

    let updateEnableForConfigure = true;

    if (shipmentSelected && this.state.selectedRow.Common_Code !== undefined) {
      let receiptUpdateInfo = this.state.activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ReceiptActivityInfo.MARINE_RECEIPT_ENABLE_UPDATE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      let receiptUpdateStates = []

      if (receiptUpdateInfo !== undefined &&
        receiptUpdateInfo.length > 0)
        receiptUpdateStates = receiptUpdateInfo[0].ReceiptStates;

      updateEnableForConfigure = receiptUpdateStates.indexOf(
        this.state.selectedItems[0].MarineReceiptByCompartmentList_ReceiptStatus.toUpperCase()
      ) > -1
    }

    return (
      <div>
        {this.renderCloseModal()}
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shrVisible={false}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            onAdd={this.handleAdd}
            onDelete={this.authenticateDelete}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isViewUnloading === "true" ? (
          <ErrorBoundary>
            {this.state.marinePanle ? (
              <MarineReceiptLoadingDetails
                tableData={this.state.ViewUnloadingData.Table}
                loadingDetailsHideFields={this.state.ViewUnloadingHideFields}
                setValid={this.setValid}
                handleBack={this.handleBackPage}
                onSaved={this.savedEvent}
                userDetails={this.props.userDetails}
                status={!this.state.receiptItem.MarineReceiptByCompartmentList_ReceiptStatus ? this.state.selectedItems[0].MarineReceiptByCompartmentList_ReceiptStatus :
                  this.state.receiptItem.MarineReceiptByCompartmentList_ReceiptStatus

                }
                isWebPortalUser={
                  this.props.userDetails.EntityResult.IsWebPortalUser
                }
              ></MarineReceiptLoadingDetails>
            ) : (
              <MarineReceiptLoadingDetails
                tableData={this.state.ViewUnloadingData.Table}
                loadingDetailsHideFields={this.state.ViewUnloadingHideFields}
                setValid={this.setValid}
                handleBack={this.handleBack}
                onSaved={this.savedEvent}
                userDetails={this.props.userDetails}
                status={
                  this.state.selectedItems[0]
                    .MarineReceiptByCompartmentList_ReceiptStatus
                }
                isWebPortalUser={
                  this.props.userDetails.EntityResult.IsWebPortalUser
                }
              ></MarineReceiptLoadingDetails>
            )}
          </ErrorBoundary>
        ) : this.state.isViewAudit === "true" ? (
          <ErrorBoundary>
            {this.state.marinePanle ? (
              <MarineReceiptViewAuditTrailComposite
                receiptCode={this.state.receiptItem["Common_Code"]}
                selectedRow={this.state.selectedRow}
                handleBack={this.handleBackPage}
              ></MarineReceiptViewAuditTrailComposite>
            ) : (
              <MarineReceiptViewAuditTrailComposite
                receiptCode={this.state.receiptItem["Common_Code"]}
                selectedRow={this.state.selectedRow}
                handleBack={this.handleBack}
              ></MarineReceiptViewAuditTrailComposite>
            )}
          </ErrorBoundary>
        ) : this.state.isMarinReceiptManualEntry === "true" ? (
          <ErrorBoundary>
            {this.state.marinePanle ? (
              <MarineReceiptManualEntryDetailsComposite
                ReceiptCode={this.state.receiptItem.Common_Code}
                handleBack={this.handleBackPage}
                ReceiptStatus={
                  this.state.receiptItem
                    .MarineReceiptByCompartmentList_ReceiptStatus
                }
                QuantityUOM={this.state.receipt.QuantityUOM}
                ActualTerminalCode={this.state.receipt.ActualTerminalCode}
              ></MarineReceiptManualEntryDetailsComposite>
            ) : (
              <MarineReceiptManualEntryDetailsComposite
                ReceiptCode={this.state.receiptItem.Common_Code}
                handleBack={this.handleBack}
                ReceiptStatus={
                  this.state.receiptItem
                    .MarineReceiptByCompartmentList_ReceiptStatus
                }
                QuantityUOM={this.state.receipt.QuantityUOM}
                ActualTerminalCode={this.state.receipt.ActualTerminalCode}
              ></MarineReceiptManualEntryDetailsComposite>
            )}
          </ErrorBoundary>
        ) : this.state.isDetails === "true" ? (
          <div>
            <div
              className={
                this.state.marinePanle
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <MarineReceiptDetailsComposite
                  Key="MarineReceiptDetails"
                  selectedRow={this.state.selectedRow}
                  selectedShareholder={this.state.selectedShareholder}
                  terminalCodes={this.state.terminalCodes}
                  onBack={this.handleBack}
                  onSaved={this.savedEvent}
                  genericProps={this.props.activeItem.itemProps}
                  handleOperationClick={this.handleOperationClick}
                  viewTab={this.state.viewTab}
                  handlePageAdd={this.handlePageAdd}
                  onTabChange={this.onTabChange}
                  updateEnableForConfigure={updateEnableForConfigure}
                ></MarineReceiptDetailsComposite>
              </ErrorBoundary>
            </div>
            {this.state.marinePanle ? (
              <div
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                <TransactionSummaryOperations
                  selectedItem={[
                    { Common_Code: this.state.receiptItem.Common_Code },
                  ]}
                  shipmentNextOperations={this.state.receiptNextOperations}
                  handleDetailsPageClick={this.handleDetailsPageClick}
                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentReceiptStatuses}
                  isDetails={true}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  unAllowedOperations={[]}
                  handleDrawer={this.handleDrawer}
                  isWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  title={"ViewAllReceipt_Details"}
                  webPortalAllowedOperations={[
                    "ViewMarineReceiptList_ViewAuditTrail",
                    "ViewMarineReceiptList_ViewTransactions",
                    "ViewMarineReceiptList_ViewBOD",
                  ]}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.marineReceiptKPIList}
                  pageName="MarineReceipt"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <div
              className={
                shipmentSelected
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              {this.state.isReadyToRender ? (
                <div>
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
                  <ErrorBoundary>
                    <div
                      className={
                        fillPage === true ? "compositeTransactionList" : ""
                      }
                    >
                      <MarineReceiptSummaryPageComposite
                        tableData={this.state.data.Table}
                        columnDetails={this.state.data.Column}
                        pageSize={
                          this.props.userDetails.EntityResult.PageAttibutes
                            .WebPortalListPageSize
                        }
                        exportRequired={true}
                        exportFileName="MarineReceiptList"
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
                      ></MarineReceiptSummaryPageComposite>
                    </div>
                  </ErrorBoundary>
                </div>
              ) : (
                <LoadingPage
                  loadingClass={loadingClass}
                  message=""
                ></LoadingPage>
              )}
            </div>
            {shipmentSelected ? (
              <div
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                {/* <TransactionSummaryOperationsMarine
                  selectedItem={[
                    { Common_Code: this.state.receiptItem.Common_Code },
                  ]}
                  shipmentNextOperations={this.state.receiptNextOperations}
                  handleDetailsPageClick={this.handleDetailsPageClick}
                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentReceiptStatuses}
                  isDetails={false}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  unAllowedOperations={[]}
                  handleDrawer={this.handleDrawer}
                />*/}
                <TransactionSummaryOperations
                  selectedItem={[
                    { Common_Code: this.state.receiptItem.Common_Code },
                  ]}
                  shipmentNextOperations={this.state.receiptNextOperations}
                  handleDetailsPageClick={this.handleDetailsPageClick}
                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentReceiptStatuses}
                  isDetails={false}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  unAllowedOperations={[]}
                  handleDrawer={this.handleDrawer}
                  isWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  title={"ViewAllReceipt_Details"}
                  webPortalAllowedOperations={[
                    "ViewMarineReceiptList_ViewAuditTrail",
                    "ViewMarineReceiptList_ViewTransactions",
                    "ViewMarineReceiptList_ViewBOD",
                  ]}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        {Object.keys(this.state.selectedRow).length > 0 ||
          this.state.selectedItems.length === 1
          ? this.renderModal()
          : ""}

        {this.state.showDeleteAuthenticationLayout ||
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
)(MarineReceiptComposite);

MarineReceiptComposite.propTypes = {
  activeItem: PropTypes.object,
};
