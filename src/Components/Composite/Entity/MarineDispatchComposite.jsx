import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { MarineDispatchSummaryPageComposite } from "../Summary/MarineDispatchSummaryComposite";
import MarineDispatchDetailsComposite from "../Details/MarineDispatchDetailsComposite";
import MarineLoadingDetails from "../../UIBase/Details/MarineLoadingDetails";
import { TranslationConsumer } from "@scuf/localization";
import axios from "axios";
import { Button, Modal, Input } from "@scuf/common";
import * as RestApis from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { MARINEDISPATCHSTATUSTIME } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import {
  functionGroups,
  fnMarineShipmentByCompartment,
  fnPrintMarineFAN,
  fnPrintMarineBOL,
  fnViewMarineLoadingDetails,
  fnViewMarineShipmentAuditTrail,
  fnCloseMarineShipment,
  fnKPIInformation,
  fnMarineDispatch
} from "../../../JS/FunctionGroups";
import { marineDispatchValidationDef } from "../../../JS/ValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import lodash from "lodash";
import { MarineShipmentViewAuditTrailDetails } from "../../UIBase/Details/MarineShipmentViewAuditTrailDetails";
import MarineDispatchManualEntryDetailsComposite from "../Details/MarineDispatchManualEntryDetailsComposite";
import { emptyMarineDispatch } from "../../../JS/DefaultEntities";
import * as Constants from "../../../JS/Constants";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
//import TransactionSummaryOperationsMarine from "../Common/TransactionSummaryOperationsMarine";
import { kpiMarineShipmentList } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";

class MarineDispatchComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: [],
    loadingDetails: [],
    productAllocationDetails: [],
    terminalCodes: [],
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    shipmentNextOperations: [],
    currentShipmentStatuses: [],
    loadingDetailsHideFields: [],
    lastStatus: "",
    reason: "",
    isError: false,
    isOperation: false,
    isViewDetails: false,
    isCloseShipment: false,
    isViewAuditTrail: false,
    isViewProductAllocation: false,
    isViewLoadingDetails: false,
    isManualEntry: false,
    isCloseShipmentBtn: false,
    auditTrailList: [],
    auditAttributeMetaDataList: [],
    modAuditTrailList: [],
    auditExpandedRows: [],
    validationErrors: Utilities.getInitialValidationErrors(
      marineDispatchValidationDef
    ),
    viewTab: 0,
    modMarineDispatch: {},
    isShowPanle: false,
    marineDispatchBtnStatus: false,
    drawerStatus: false,
    showReport: false,
    marineShipmentKPIList: [],
    deleteEnableForConfigure: [],
    activityInfo: [],
    showDeleteAuthenticationLayout: false,
    showAuthorizeToLoadAuthenticationLayout: false,
    showCloseShipmentAuthenticationLayout: false,
    showViewBOLAuthenticationLayout: false,
    showPrintBOLAuthenticationLayout:false,
    showFANAuthenticationLayout: false,
  };

  componentName = "MarineDispatchComponent";

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState(
        {
          drawerStatus: false,
          isDetails: false,
        },
        () => {
          this.setState({
            viewTab: 0,
            isDetails: true,
            isShowPanle: false,
            selectedRow: {},
            operationsVisibilty,
          });
        }
      );
    } catch (error) {
      console.log(error);
      console.log("MarineDisatchComposite:Error occured on handleAdd");
    }
  };

  getAttributes() {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [MARINEDISPATCHSTATUSTIME],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          this.setState({
            auditAttributeMetaDataList:
              result.EntityResult.MARINEDISPATCHSTATUSTIME,
          });
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  handleDelete = () => {
    this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty, deleteEnableForConfigure: [] });
      var deleteMarineDispatchKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var MarineDispatchCode = this.state.selectedItems[i]["Common_Code"];
        var KeyData = {
          KeyCodes: [
            { Key: KeyCodes.marineDispatchCode, Value: MarineDispatchCode },
          ],
        };
        deleteMarineDispatchKeys.push(KeyData);
      }

      axios(
        RestApis.DeleteMarineDispatch,
        Utilities.getAuthenticationObjectforPost(
          deleteMarineDispatchKeys,
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
          //     return !res.isSuccess;
          //   }).length;
          //   if (failedResultsCount === result.ResultDataList.length) {
          //     isRefreshDataRequire = false;
          //   } else isRefreshDataRequire = true;
          // }
          var notification = Utilities.convertResultsDatatoNotification(
            result,
            "Shipment_DeletionStatus",
            ["MarineDispatchCode"]
          );
          // if (isRefreshDataRequire) {
          this.getMarineDispatchList();
          this.getKPIList();
          operationsVisibilty.delete = false;
          this.setState(
            {
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              isDetails: false,
              deleteEnableForConfigure: [],
            },
            () => {
              if (this.state.isShowPanle) {
                this.setState({
                  isDetails: true,
                  isShowPanle: false,
                  isReadyToRender: false,
                });
              }
            }
          );
          // }
          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0) {
              messageResult.keyFields[0] = "ViewShipmentStatus_ShipmentCode";
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
      console.log("MarineDisatchComposite:Error occured on handleDelete");
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnMarineShipmentByCompartment
      );
      operationsVisibilty.delete = false;
      this.getMarineDispatchList();
      this.getKPIList();
      if (
        this.state.isDetails &&
        (this.state.isViewAuditTrail ||
          this.state.isViewLoadingDetails ||
          this.state.isManualEntry ||
          this.state.isViewProductAllocation)
      ) {
        // this.componentDidMount();
        var selectItem = {
          DispatchCode: this.state.selectedItems[0].Common_Code,
        };
        this.handleClickRefresh(selectItem);
        this.setState(
          {
            isDetails: false,
            isViewDetails: false,
            isViewAuditTrail: false,
            isViewLoadingDetails: false,
            isManualEntry: false,
            isShowPanle: false,
            isViewProductAllocation: false,
            drawerStatus: false,
            deleteEnableForConfigure: [],
          },
          () => {
            this.setState({
              isDetails: true,
              isShowPanle: true,
            });
          }
        );
      } else {
        this.setState({
          isDetails: false,
          isViewDetails: false,
          isShowPanle: false,
          isViewAuditTrail: false,
          isViewProductAllocation: false,
          isViewLoadingDetails: false,
          isManualEntry: false,
          selectedRow: {},
          selectedItems: [],
          operationsVisibilty,
          drawerStatus: false,
          deleteEnableForConfigure: [],
          isReadyToRender: false,
        });
      }
    } catch (error) {
      console.log("MarineDispatchComposite:Error occured on Back click", error);
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
      this.getMarineDispatchList();
    }
  };

  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/MarineBOL";
    } else {
      path = "TM/" + Constants.TMReports + "/MarineBOL";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      //ShareholderCode: this.state.selectedShareholder,
      DispatchCode:
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


  CloseShipment= () => {
     
    this.setState({ isCloseShipmentBtn: true });
    setTimeout(() => {
      this.setState({ isCloseShipmentBtn: false });
    }, 1500);
    var reason = lodash.cloneDeep(this.state.reason);
    if (!this.onFieldChange("Reason", reason)) {
      this.setState({ isError: true });
    } else {
     

      let showCloseShipmentAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;
    
      this.setState({ showCloseShipmentAuthenticationLayout, }, () => {
        if (showCloseShipmentAuthenticationLayout === false) {
          this.handleShipmentClose();
        }})

    }
  }

  handleShipmentClose= () => {
    this.handleAuthenticationClose();
    var reason = lodash.cloneDeep(this.state.reason);
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: item.Common_Code,
      },
      {
        key: KeyCodes.marineDispatchReason,
        value: reason,
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
          keyValues: [item.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineDispatchCloseShipment,
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
          this.setState({ isCloseShipment: false, reason: "" });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + "";
          console.log("Error in CloseShipment:", result.ErrorList);
        }
        this.savedEvent(item, "CloseShipment", notification);
        if (this.state.isDetails === true) {
          var selectItem = {
            DispatchCode: this.state.selectedItems[0].Common_Code,
          };
          this.handleClickRefresh(selectItem);
        } else {
          this.componentDidMount();
        }
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(item, "CloseShipment", notification);
        console.log("Error while CloseShipment:", error);
      });
  }

  viewBOLClick= () => {
    let showViewBOLAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showViewBOLAuthenticationLayout, }, () => {
      if (showViewBOLAuthenticationLayout === false) {
        this.handleViewBOL();
      }})
     
    }

  handleViewBOL = () => {
    this.handleAuthenticationClose();
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
    this.setState({
      marineDispatchBtnStatus: true,
    });
    setTimeout(() => {
      this.setState({ marineDispatchBtnStatus: false });
    }, 800);
    if (
      operation ===
      Constants.ViewAllMarineShipmentOperations
        .ViewMarineShipmentList_AuthorizeToLoad
    ) {
      this.authorizeToLoadOnClick();
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations
        .ViewMarineShipmentList_CloseMarineShipment
    ) {
      this.setState({ isCloseShipment: true });
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations
        .ViewMarineShipmentList_ViewAuditTrail
    ) {
      this.getAuditTrailList(this.state.selectedItems[0]);
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations
        .ViewMarineShipmentList_ViewTransactions
    ) {
      this.getMarineDispatchLoadingDetail();
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations.ViewMarineShipmentList_PrintFAN
    ) {
      this.printFANClick();
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations.ViewMarineShipmentList_ViewBOL
    ) {
      this.viewBOLClick();
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations.ViewMarineShipmentList_PrintBOL
    ) {
      this.printBOLClick();
        
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations
        .ViewMarineShipmentList_BSIOutbound
    ) {
      this.BSIOutbound();
    } else if (
      operation ===
      Constants.ViewAllMarineShipmentOperations
        .ViewMarineShipmentList_ManualEntry
    ) {
      this.getMarineDispatch(this.state.selectedItems[0]);
    }
  };

  handleRowClick = (item) => {
    try {
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnMarineShipmentByCompartment
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "ShipmentCompDetail_Permission",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "BSI_SHIPMENTSECURITYERROR",
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
        fnMarineShipmentByCompartment
      );

      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.MARINE_SHIPMENT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var dispatchDeleteStates = [];

      if (
        dispatchDeleteInfo !== undefined &&
        dispatchDeleteInfo.length > 0
      )
        dispatchDeleteStates =
          dispatchDeleteInfo[0].ShipmentStates;

      operationsVisibilty.delete = this.props.userDetails
        .EntityResult.IsWebPortalUser
        ? false
        : dispatchDeleteStates.indexOf(
          item.MarineShipmentByCompartmentList_ShipmentStatus.toUpperCase()
        ) > -1 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnMarineShipmentByCompartment
        );

      operationsVisibilty.shareholder = false;
      this.GetShipmentStatusOperations([item]);
      // this.GetViewAllMarineDispatchCustomData(item, true);
      this.GetShipmentStatuses([item]);
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectItems: [item],
        selectedItems: [item],
        isShowPanle: true,
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "MarineDispatchComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  handleGoDetails = (item) => {
    try {
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnMarineShipmentByCompartment
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "ShipmentCompDetail_Permission",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "BSI_SHIPMENTSECURITYERROR",
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
      //   fnMarineShipmentByCompartment
      // );
      operationsVisibilty.shareholder = false;
      if (item.MarineShipmentByCompartmentList_ShipmentStatus !== undefined) {
        this.GetShipmentStatusOperations([item]);
        // this.GetViewAllMarineDispatchCustomData(item, true);
      }
      this.GetShipmentStatuses([item]);
      this.setState({
        isDetails: true,
        isShowPanle: true,
        selectedRow: item,
        viewTab: 2,
        // selectItems: [item],
        operationsVisibilty,
      });
      this.setState({ isOperation: true });
    } catch (error) {
      console.log(
        "MarineDispatchComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  handleSelection = (items) => {
    try {
      var { operationsVisibilty, drawerStatus, activityInfo } = { ...this.state };
      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.MARINE_SHIPMENT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });
      var dispatchDeleteStates = [];
      if (dispatchDeleteInfo !== undefined && dispatchDeleteInfo.length > 0)
        dispatchDeleteStates = dispatchDeleteInfo[0].ShipmentStates;

      let isReady =
        items.findIndex(
          (x) =>
            dispatchDeleteStates.indexOf(
              x.MarineShipmentByCompartmentList_ShipmentStatus.toUpperCase()
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
          fnMarineShipmentByCompartment
        );

      drawerStatus = false;
      this.setState({
        selectedItems: items,
        operationsVisibilty,
        isOperation: false,
        deleteEnableForConfigure: [],
        drawerStatus,
      });
      // for (let i = 0; i < items.length; i++) {
      //   this.GetViewAllMarineDispatchCustomData(items[i], false);
      // }
      if (items.length === 1) {
        this.GetShipmentStatusOperations(items);
        this.GetShipmentStatuses(items);
        this.setState({ isOperation: true });
      }
    } catch (error) {
      console.log(
        "MarineDispatchComposite:Error occured on handleSelection",
        error
      );
    }
  };

  GetShipmentStatusOperations(items) {
    try {
      axios(
        RestApis.GetMarineDispatchOperations +
        "?DispatchStatus=" +
        items[0].MarineShipmentByCompartmentList_ShipmentStatus,
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
                Constants.ViewAllMarineShipmentOperations
                  .ViewMarineShipmentList_PrintFAN &&
                item !==
                Constants.ViewAllMarineShipmentOperations
                  .ViewMarineShipmentList_PrintBOL
              );
            });
            nextOperations = filteredOptions;
          }
          if (
            this.props.userDetails.EntityResult.IsArchived ||
            this.props.userDetails.EntityResult.IsWebPortalUser
          ) {
            let filteredOptions = nextOperations.filter(function (item) {
              return (
                item ===
                Constants.ViewAllMarineShipmentOperations
                  .ViewMarineShipmentList_ViewAuditTrail ||
                item ===
                Constants.ViewAllMarineShipmentOperations
                  .ViewMarineShipmentList_ViewBOL ||
                item ===
                Constants.ViewAllMarineShipmentOperations
                  .ViewMarineShipmentList_ViewTransactions
              );
            });
            nextOperations = filteredOptions;
          }
          let results = nextOperations.filter((item) => {
            if (
              item ===
              Constants.ViewAllMarineShipmentOperations
                .ViewMarineShipmentList_ViewTransactions
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnViewMarineLoadingDetails
                )
              ) {
                return true;
              } else {
                return false;
              }
            }
            if (
              item ===
              Constants.ViewAllMarineShipmentOperations
                .ViewMarineShipmentList_ViewAuditTrail
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnViewMarineShipmentAuditTrail
                )
              ) {
                return true;
              } else {
                return false;
              }
            }
            if (
              item ===
              Constants.ViewAllMarineShipmentOperations
                .ViewMarineShipmentList_CloseMarineShipment
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnCloseMarineShipment
                )
              ) {
                return true;
              } else {
                return false;
              }
            }
            if (
              item ===
              Constants.ViewAllMarineShipmentOperations
                .ViewMarineShipmentList_PrintFAN
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnPrintMarineFAN
                )
              ) {
                return true;
              } else {
                return false;
              }
            }
            if (
              item ===
              Constants.ViewAllMarineShipmentOperations
                .ViewMarineShipmentList_ViewBOL
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnPrintMarineBOL
                )
              ) {
                return true;
              } else {
                return false;
              }
            }
            if (
              item ===
              Constants.ViewAllMarineShipmentOperations
                .ViewMarineShipmentList_PrintBOL
            ) {
              if (
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.view,
                  fnPrintMarineBOL
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
          this.setState({ shipmentNextOperations: results });
        })
        .catch((error) => {
          console.log(
            "Error while getting GetShipmentStatusOperations:",
            error
          );
        });
    } catch (error) {
      console.log(error);
    }
  }

  GetShipmentStatuses(items) {
    try {
      axios(
        RestApis.GetMarineDispatchAllStatuses +
        "?MarineDispatchCode=" +
        items[0].Common_Code +
        "&ShipmentType=COMPARTMENT",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          this.setState({
            currentShipmentStatuses: result.EntityResult,
          });
          if (result.IsSuccess === true) {
          } else {
          }
        })
        .catch((error) => {
          console.log("Error while getting GetShipmentStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
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
        "MarineDispatchComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty, activityInfo } = { ...this.state };

      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.MARINE_SHIPMENT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var dispatchDeleteStates = [];
      if (dispatchDeleteInfo !== undefined && dispatchDeleteInfo.length > 0)
        dispatchDeleteStates = dispatchDeleteInfo[0].ShipmentStates;

        let dispatchStatus= (data.MarineShipmentByCompartmentList_ShipmentStatus===undefined || data.MarineShipmentByCompartmentList_ShipmentStatus===null ) ? data.DispatchStatus: data.MarineShipmentByCompartmentList_ShipmentStatus;
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnMarineShipmentByCompartment
        );
        operationsVisibilty.delete = this.props.userDetails.EntityResult.IsWebPortalUser?false:dispatchDeleteStates.indexOf(dispatchStatus.toUpperCase()) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnMarineShipmentByCompartment
          );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      
    
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            MarineDispatchCode: data.DispatchCode,
            Common_Shareholder: data.ShareholderCode,
            Common_Code: data.DispatchCode,
            MarineShipmentByCompartmentList_ShipmentStatus: dispatchStatus,
          },
        ];
        this.setState({
          selectedItems,
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
    } catch (error) {
      console.log("MarineDispatchComposite:Error occured on savedEvent", error);
    }
  };

  handleClickRefresh(item) {
    var transportationType = this.getTransportationType();
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: item.DispatchCode,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
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
          let dataItem = {
            Common_Code: result.EntityResult.DispatchCode,
            MarineShipmentByCompartmentList_ShipmentStatus:
              result.EntityResult.DispatchStatus,
          };
          this.setState(
            {
              isDetails: false,
              isShowPanle: false,
            },
            () => {
              this.setState({
                selectedItems: [dataItem],
              });
              this.handleRowClick(dataItem);
              this.GetShipmentStatusOperations([dataItem]);
              // this.GetViewAllMarineDispatchCustomData(dataItem, true);
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting marineDispatch:", error);
      });
  }

  handlePageAdd = (item) => {
    var transportationType = this.getTransportationType();
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: item.DispatchCode,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
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
          let dataItem = {
            Common_Code: result.EntityResult.DispatchCode,
            MarineShipmentByCompartmentList_ShipmentStatus:
              result.EntityResult.DispatchStatus,
          };
          this.setState(
            {
              isDetails: false,
              isShowPanle: false,
            },
            () => {
              this.setState({
                isDetails: true,
                isShowPanle: true,
                selectedItems: [dataItem],
              });
              this.handleRowClick(dataItem);
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting marineDispatch:", error);
      });
  };

  getMarineDispatchList() {
    this.setState({ isReadyToRender: false });
    let fromDate = new Date(this.state.fromDate);
    let toDate = new Date(this.state.toDate);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);

    let obj = {
      startRange: fromDate,
      endRange: toDate,
      TransportationType: "MARINE",
    };

    axios(
      RestApis.GetMarineDispatchListForRole,
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
              data: result.EntityResult,
              isReadyToRender: true,
            },
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
                let dispatchDeleteInfo = activityInfo.filter((item) => {
                  return (
                    item.ActivityCode ===
                    Constants.ShipmentActivityInfo.MARINE_SHIPMENT_ENABLE_DELETE &&
                    item.ActionTypeCode === Constants.ActionTypeCode.CHECK
                  );
                });

                var dispatchDeleteStates = [];

                if (
                  dispatchDeleteInfo !== undefined &&
                  dispatchDeleteInfo.length > 0
                )
                  dispatchDeleteStates =
                    dispatchDeleteInfo[0].ShipmentStates;

                operationsVisibilty.delete = this.props.userDetails
                  .EntityResult.IsWebPortalUser
                  ? false
                  : dispatchDeleteStates.indexOf(
                    updatedselectedItem[0].MarineShipmentByCompartmentList_ShipmentStatus.toUpperCase()
                  ) > -1 &&
                  Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.remove,
                    fnMarineShipmentByCompartment
                  );


                this.setState({ selectedItems: updatedselectedItem, operationsVisibilty });
                this.GetShipmentStatusOperations(updatedselectedItem);
                this.GetShipmentStatuses(updatedselectedItem);
              }
            }
          );
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error in GetMarineDispatchListForRole:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while geting MarineDispatch List:", error);
      });
  }

  authorizeToLoadOnClick= () => {
    let showAuthorizeToLoadAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showAuthorizeToLoadAuthenticationLayout, }, () => {
      if (showAuthorizeToLoadAuthenticationLayout === false) {
        this.authorizeToLoad();
      }})
    }

    authorizeToLoad= () => {
    this.handleAuthenticationClose();
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: item.Common_Code,
      },
      {
        key: KeyCodes.dispatchStatus,
        value: item.MarineShipmentByCompartmentList_ShipmentStatus,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    var notification = {
      messageType: "critical",
      message: "ViewMarineDispatch_AuthorizeLoad_status",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineDispatchAuthorizeToLoad,
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
          var selectRow = { Common_Code: item.Common_Code };
          this.setState(
            {
              selectedRow: selectRow,
              isOperation: true,
            },
            () => {
              if (this.state.isDetails === true) {
                var selectItem = {
                  DispatchCode: this.state.selectedItems[0].Common_Code,
                };
                this.handleClickRefresh(selectItem);
              } else {
                this.componentDidMount();
              }
            }
          );
          if (this.state.isDetails === true) {
            this.setState(
              {
                isDetails: false,
                isShowPanle: false,
              },
              () => {
                this.setState({
                  isDetails: true,
                  isShowPanle: true,
                });
              }
            );
          }
        } else {
          console.log("Error in AuthorizeToLoad:", result.ErrorList);
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + "";
        }
        this.savedEvent(item, "AuthorizeToLoad", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(item, "AuthorizeToLoad", notification);
        console.log("Error while AuthorizeToLoad:", error);
      });
  }

  printFANClick= () => {
    let showFANAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showFANAuthenticationLayout, }, () => {
      if (showFANAuthenticationLayout === false) {
        this.printFAN();
      }})
     
    }
    
  printFAN= () =>  {
    this.handleAuthenticationClose();
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: item.Common_Code,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    var notification = {
      messageType: "critical",
      message: "MarineDispatchDetail_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineDispatchPrintFAN,
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
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + "";
          console.log("Error in printFAN:", result.ErrorList);
        }
        this.savedEvent(item, "printFAN", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(item, "printFAN", notification);
        console.log("Error while printFAN:", error);
      });
  }

  printBOLClick= () => {
    let showPrintBOLAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showPrintBOLAuthenticationLayout, }, () => {
      if (showPrintBOLAuthenticationLayout === false) {
        this.printBOL();
      }})
     
    }

  printBOL= () => {
    this.handleAuthenticationClose();
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: item.Common_Code,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    var notification = {
      messageType: "critical",
      message: "MarineDispatchDetail_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineDispatchPrintBOL,
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
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0] + Constants.delimiter + "";
          console.log("Error in printBOL:", result.ErrorList);
        }
        this.savedEvent(item, "printBOL", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(item, "printBOL", notification);
        console.log("Error while printBOL:", error);
      });
  }

  BSIOutbound() {
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: item.Common_Code,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    var notification = {
      messageType: "critical",
      message: "ViewMarineDispatch_BSIOutbound_status",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.MarineDispatchBSIOutbound,
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
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in BSIOutbound:", result.ErrorList);
        }
        this.savedEvent(item, "BSIOutbound", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(item, "BSIOutbound", notification);
        console.log("Error while BSIOutbound:", error);
      });
  }

  getMarineDispatch(selectedRow) {
    emptyMarineDispatch.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.QuantityUOM;
    emptyMarineDispatch.TerminalCodes =
      this.state.terminalCodes.length === 1
        ? [...this.state.terminalCodes]
        : [];

    var transportationType = this.getTransportationType();
    emptyMarineDispatch.TransportationType = transportationType;

    if (selectedRow.Common_Code === undefined) {
      this.setState({
        modMarineDispatch: lodash.cloneDeep(emptyMarineDispatch),
        isManualEntry: true,
      });
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    var notification = {
      messageType: "critical",
      message: "ViewMarineDispatchManualEntry_status",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [selectedRow.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
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
        let { operationsVisibilty } = this.state;
        if (result.IsSuccess === true) {
          operationsVisibilty.delete = false;
          operationsVisibilty.add = false;
          this.setState({
            modMarineDispatch: lodash.cloneDeep(result.EntityResult),
            isManualEntry: true,
            operationsVisibilty,
            deleteEnableForConfigure: [],
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.savedEvent(selectedRow, "CloseShipment", notification);
          console.log("Error in GetMarineDispatch:", result.ErrorList);
        }
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(selectedRow, "CloseShipment", notification);
        console.log("Error while getting marineDispatch:", error);
        //throw error;
      });
  }

  

  onFieldChange(propertyName, data) {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      this.setState({ reason: data });
      if (marineDispatchValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          marineDispatchValidationDef[propertyName],
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

  getMarineDispatchLoadingDetail() {
    var item = lodash.cloneDeep(this.state.selectedItems[0]);
    var notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Marine_ShipmentCompDetail_ShipmentNumber"],
          keyValues: [item.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.GetMarineLoadingDetails +
      "?MarineDispatchCode=" +
      item.Common_Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({ loadingDetails: result.EntityResult });
        } else {
          this.setState({ loadingDetails: [] });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({ data: [], isReadyToRender: true });
          this.savedEvent(item, "MarineDispatchLoadingDetail", notification);
        }
      })
      .catch((error) => {
        this.setState({ loadingDetails: [] });
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(item, "MarineDispatchLoadingDetail", notification);
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting MarineDispatchLoadingDetail:", error);
      });

    axios(
      RestApis.GetMarineLoadingDetailConfigFields +
      "?MarineDispatchCode=" +
      item.Common_Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        var { operationsVisibilty } = { ...this.state };
        operationsVisibilty.delete = false;
        operationsVisibilty.add = false;
        operationsVisibilty.shareholder = false;
        if (result.IsSuccess === true) {
          this.setState({
            loadingDetailsHideFields: result.EntityResult,
            isReadyToRender: true,
            isViewLoadingDetails: true,
            operationsVisibilty,
          });
        } else {
          this.setState({
            loadingDetailsHideFields: [],
            isReadyToRender: true,
            isViewLoadingDetails: true,
            operationsVisibilty,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.savedEvent(item, "MarineDispatchLoadingDetail", notification);
        }
      })
      .catch((error) => {
        this.setState({
          loadingDetailsHideFields: [],
          isReadyToRender: true,
          isViewLoadingDetails: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.savedEvent(item, "MarineDispatchLoadingDetail", notification);
        console.log("Error while getting MarineDispatchLoadingDetail:", error);
      });
  }

  setValid = (fptransactionid, ProductCategoryType) => {
    var keyCode = [
      {
        key: KeyCodes.marineDispatchCode,
        value: this.state.selectedItems[0].Common_Code,
      },
      {
        key: KeyCodes.FPTransactionID,
        value: fptransactionid,
      },
      {
        key: KeyCodes.ProductCategoryType,
        value: ProductCategoryType,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.marineDispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.MarineDispatchSetValid,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          this.getMarineDispatchLoadingDetail();
        }
      })
      .catch((error) => {
        console.log("MarineDisatchComposite:Error occured on setValid", error);
      });
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnMarineShipmentByCompartment
      );
      this.getAttributes();
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getTerminalsList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getMarineDispatchList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList();
      this.GetShipmentActivityInfo();
    } catch (error) {
      console.log(
        "MarineDispatchComposite:Error occured on componentDidMount",
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

  GetShipmentActivityInfo() {
    try {
      axios(
        RestApis.GetShipmentActivityInfo,
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
          console.log("Error while getting shipment activityInfo:", error);
        });
    } catch (error) {
      console.log("Error in GetShipmentActivityInfo:", error);
    }
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({ selectedShareholder: shareholder });
      this.getMarineDispatchList();
      this.getTerminalsList(shareholder);
    } catch (error) {
      console.log(
        "MarineDispatchComposite:Error occured on handleShareholderSelectionChange",
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

  getAuditTrailList(selectItem) {
    var { operationsVisibilty } = { ...this.state };
    operationsVisibilty.add = false;
    operationsVisibilty.delete = false;

    axios(
      RestApis.GetMarineDispatchAuditTrailList +
      "?MarineDispatchCode=" +
      selectItem.Common_Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var modAuditTrailList = lodash.cloneDeep(result.EntityResult);
          var auditTrailList = lodash.cloneDeep(result.EntityResult);
          for (let i = 0; i < modAuditTrailList.length; i++) {
            let dispatchStatus = modAuditTrailList[i].DispatchStatus;
            if (dispatchStatus === Constants.ViewDispatch_Status.AUTO_LOADED) {
              dispatchStatus = Constants.ViewDispatchStatus.AUTO_LOADED;
            } else if (
              dispatchStatus === Constants.ViewDispatch_Status.CLOSED
            ) {
              dispatchStatus = Constants.ViewDispatchStatus.CLOSED;
            } else if (
              dispatchStatus === Constants.ViewDispatch_Status.INTERRUPTED
            ) {
              dispatchStatus = Constants.ViewDispatchStatus.INTERRUPTED;
            } else if (
              dispatchStatus === Constants.ViewDispatch_Status.LOADING
            ) {
              dispatchStatus = Constants.ViewDispatchStatus.LOADING;
            } else if (
              dispatchStatus === Constants.ViewDispatch_Status.MANUALLY_LOADED
            ) {
              dispatchStatus = Constants.ViewDispatchStatus.MANUALLY_LOADED;
            } else if (
              dispatchStatus === Constants.ViewDispatch_Status.PARTIALLY_LOADED
            ) {
              dispatchStatus = Constants.ViewDispatchStatus.PARTIALLY_LOADED;
            } else if (
              dispatchStatus === Constants.ViewDispatch_Status.QUEUED
            ) {
              dispatchStatus = Constants.ViewDispatchStatus.QUEUED;
            } else if (dispatchStatus === Constants.ViewDispatch_Status.READY) {
              dispatchStatus = Constants.ViewDispatchStatus.READY;
            }
            modAuditTrailList[i].DispatchStatus = dispatchStatus;
            modAuditTrailList[i].UpdatedTime =
              new Date(modAuditTrailList[i].UpdatedTime).toLocaleDateString() +
              " " +
              new Date(modAuditTrailList[i].UpdatedTime).toLocaleTimeString();
            auditTrailList[i].index = i;
          }
          this.setState(
            {
              operationsVisibilty,
              auditTrailList,
              modAuditTrailList,
              isViewAuditTrail: true,
              deleteEnableForConfigure: [],
            },
            () => {
              let auditAttributeMetaDataList = lodash.cloneDeep(
                this.state.auditAttributeMetaDataList
              );
              for (let i = 0; i < auditTrailList.length; i++) {
                auditTrailList[i].AttributesforUI =
                  this.formReadonlyCompAttributes(
                    auditTrailList[i].Attributes,
                    auditAttributeMetaDataList
                  );
              }
            }
          );
        } else {
          console.log("Error in getAuditTrailList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getAuditTrailList:", error);
      });
  }

  formAuditAttributes = (selectedTerminal) => {
    try {
      let attributes = lodash.cloneDeep(this.state.auditAttributeMetaDataList);
      attributes = attributes.filter(function (attTerminal) {
        return attTerminal.TerminalCode === selectedTerminal;
      });
      let auditTrailList = lodash.cloneDeep(this.state.auditTrailList);
      let auditAttributes = [];
      attributes.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          auditAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName,
            AttributeValue: attribute.DefaultValue,
            TerminalCode: attribute.TerminalCode,
            IsMandatory: attribute.IsMandatory,
            DataType: attribute.DataType,
            IsReadonly: attribute.IsReadonly,
            auditSequenceNo: "",
          });
        });
      });

      let attributesforNewAudit = lodash.cloneDeep(auditAttributes);
      auditTrailList.forEach((audit) => {
        if (
          audit.index === null &&
          (audit.AttributesforUI === null ||
            audit.AttributesforUI === undefined)
        ) {
          audit.AttributesforUI = [];
          attributesforNewAudit.forEach((assignedAttributes) => {
            assignedAttributes.auditSequenceNo = audit.index;
            audit.AttributesforUI.push(assignedAttributes);
          });
        } else {
          if (
            audit.AttributesforUI !== null &&
            audit.AttributesforUI !== undefined
          ) {
            audit.AttributesforUI = audit.AttributesforUI.filter(function (
              attTerminal
            ) {
              return attTerminal.TerminalCode === selectedTerminal;
            });
            auditAttributes = auditAttributes.filter(function (attTerminal) {
              return !audit.AttributesforUI.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal.TerminalCode;
              });
            });
          } else {
            audit.AttributesforUI = [];
          }
          let tempAuditAttributes = lodash.cloneDeep(auditAttributes);
          if (
            Array.isArray(audit.Attributes) &&
            audit.Attributes !== null &&
            audit.Attributes !== undefined &&
            audit.Attributes.length > 0
          ) {
            let selectedTerminalAttributes = audit.Attributes.filter(function (
              attTerminal
            ) {
              return attTerminal.TerminalCode === selectedTerminal;
            });
            selectedTerminalAttributes.forEach((att) => {
              att.ListOfAttributeData.forEach((attData) => {
                let tempAttIndex = tempAuditAttributes.findIndex(
                  (item) =>
                    item.TerminalCode === att.TerminalCode &&
                    item.AttributeCode === attData.AttributeCode
                );
                if (tempAttIndex >= 0)
                  tempAuditAttributes[tempAttIndex].AttributeValue =
                    attData.AttributeValue;
              });
            });
            tempAuditAttributes.forEach((assignedAttributes) => {
              assignedAttributes.auditSequenceNo = audit.index;
              audit.AttributesforUI.push(assignedAttributes);
            });
          } else {
            let temp = lodash.cloneDeep(auditAttributes);
            temp.forEach((assignedAttributes) => {
              assignedAttributes.auditSequenceNo = audit.index;
              audit.AttributesforUI.push(assignedAttributes);
            });
          }
        }
      });
      this.setState({ auditTrailList });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  };

  formReadonlyCompAttributes(attributes, auditAttributeMetaDataList) {
    let compAttributes = [];
    if (
      auditAttributeMetaDataList !== null &&
      auditAttributeMetaDataList !== undefined &&
      auditAttributeMetaDataList.length > 0
    ) {
      auditAttributeMetaDataList.forEach((att) => {
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

  //Get KPI for Marine Shipment
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
        PageName: kpiMarineShipmentList,
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
              marineShipmentKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ marineShipmentKPIList: [] });
            console.log("Error in Marine Shipment KPIList:", result.ErrorList);
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
          console.log("Error while getting Marine Shipment KPIList:", error);
        });
    }
  }
  // GetViewAllMarineDispatchCustomData(item, GoDetails) {
  //   let keyCode = [
  //     {
  //       key: KeyCodes.dispatchStatus,
  //       value: item.MarineShipmentByCompartmentList_ShipmentStatus,
  //     },
  //   ];
  //   let obj = {
  //     KeyCodes: keyCode,
  //   };
  //   axios(
  //     RestApis.GetViewAllMarineDispatchCustomData,
  //     Utilities.getAuthenticationObjectforPost(
  //       obj,
  //       this.props.tokenDetails.tokenInfo
  //     )
  //   )
  //     .then((response) => {
  //       const result = response.data;
  //       let { deleteEnableForConfigure, operationsVisibilty } = this.state;
  //       if (result.IsSuccess) {
  //         if (result.EntityResult.MarineShipmentUpdateAllow === "TRUE") {
  //           this.setState({
  //             updateEnableForConfigure: true,
  //           });
  //         } else {
  //           this.setState({
  //             updateEnableForConfigure: false,
  //           });
  //         }
  //         if (result.EntityResult.MarineShipmentDeleteAllow === "TRUE") {
  //           deleteEnableForConfigure.push(true);
  //         } else {
  //           deleteEnableForConfigure.push(false);
  //         }
  //         operationsVisibilty.add = Utilities.isInFunction(
  //           this.props.userDetails.EntityResult.FunctionsList,
  //           functionGroups.add,
  //           fnMarineShipmentByCompartment
  //         );
  //         if (GoDetails) {
  //           operationsVisibilty.delete =
  //             deleteEnableForConfigure[deleteEnableForConfigure.length - 1] &&
  //             Utilities.isInFunction(
  //               this.props.userDetails.EntityResult.FunctionsList,
  //               functionGroups.remove,
  //               fnMarineShipmentByCompartment
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
  //               fnMarineShipmentByCompartment
  //             );
  //         }
  //         this.setState({ deleteEnableForConfigure, operationsVisibilty });
  //       } else {
  //         console.log("error in GetViewAllMarineDispatchCustomData");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error in GetViewAllMarineDispatchCustomData", error);
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
      showAuthorizeToLoadAuthenticationLayout: false,
      showCloseShipmentAuthenticationLayout: false,
      showViewBOLAuthenticationLayout: false,
      showPrintBOLAuthenticationLayout:false,
      showFANAuthenticationLayout: false,
    });
  };

  
  getFunctionGroupName() {
    if(this.state.showDeleteAuthenticationLayout )
      return fnMarineShipmentByCompartment
    else if(this.state.showCloseShipmentAuthenticationLayout)
      return fnCloseMarineShipment
    else if(this.state.showAuthorizeToLoadAuthenticationLayout)
      return fnMarineDispatch
    else if(this.state.showViewBOLAuthenticationLayout || this.state.showPrintBOLAuthenticationLayout)
      return fnPrintMarineBOL
      else if(this.state.showFANAuthenticationLayout)
      return fnPrintMarineFAN
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
    else if(this.state.showAuthorizeToLoadAuthenticationLayout)
      return this.authorizeToLoad
    else if(this.state.showCloseShipmentAuthenticationLayout)
      return this.handleShipmentClose
    else if(this.state.showFANAuthenticationLayout)
      return this.printFAN
    else if(this.state.showViewBOLAuthenticationLayout)
      return this.handleViewBOL;
      else if(this.state.showPrintBOLAuthenticationLayout)
      return this.printBOL;
 };

  render() {
    let shipmentSelected = this.state.selectedItems.length === 1;
    let fillPage = true;
    if (
      this.props.shipmentSource !== undefined &&
      this.props.shipmentSource !== "" &&
      this.props.shipmentSource !== null
    ) {
      fillPage = false;
    }
    let updateEnableForConfigure = true;

    if (shipmentSelected && this.state.selectedRow.Common_Code !== undefined) {
      let dispatchUpdateInfo = this.state.activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.MARINE_SHIPMENT_ENABLE_UPDATE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      let dispatchUpdateStates = []

      if (dispatchUpdateInfo !== undefined &&
        dispatchUpdateInfo.length > 0)
        dispatchUpdateStates = dispatchUpdateInfo[0].ShipmentStates;

      updateEnableForConfigure = dispatchUpdateStates.indexOf(
        this.state.selectedItems[0].MarineShipmentByCompartmentList_ShipmentStatus.toUpperCase()
      ) > -1
    }
    return (
      <div>
        <TranslationConsumer>
          {(t) => (
            <Modal
              className="popup-theme-wrap"
              closeIcon={true}
              onClose={() =>
                this.setState({ isCloseShipment: false, reason: "" })
              }
              open={this.state.isCloseShipment}
              closeOnDimmerClick={false}
              closeOnDocumentClick={false}
              size="small"
            >
              <Modal.Header>{t("ViewMarineShipment_CloseHeader")}</Modal.Header>
              <Modal.Content>
                <Input
                  fluid
                  value={this.state.reason}
                  indicator="required"
                  onChange={(data) => this.onFieldChange("Reason", data)}
                  label={t("ViewMarineShipmentList_Reason")}
                  error={t(this.state.validationErrors.Reason)}
                />
              </Modal.Content>
              <Modal.Footer>
                <Button
                  type="secondary"
                  size="small"
                  content={t("ViewMarineShipmentList_Cancel")}
                  onClick={() =>
                    this.setState({
                      isCloseShipment: false,
                      reason: "",
                      validationErrors: [],
                    })
                  }
                />
                <Button
                  type="primary"
                  size="small"
                  disabled={this.state.isCloseShipmentBtn}
                  content={t("ViewMarineShipmentList_Active")}
                  onClick={() => this.CloseShipment()}
                />
              </Modal.Footer>
            </Modal>
          )}
        </TranslationConsumer>
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
        {this.state.isViewLoadingDetails ? (
          <ErrorBoundary>
            <MarineLoadingDetails
              tableData={this.state.loadingDetails.Table}
              loadingDetailsHideFields={this.state.loadingDetailsHideFields}
              setValid={this.setValid}
              handleBack={this.handleBack}
              onSaved={this.savedEvent}
              userDetails={this.props.userDetails}
              status={
                this.state.selectedItems[0]
                  .MarineShipmentByCompartmentList_ShipmentStatus
              }
              isWebPortalUser={
                this.props.userDetails.EntityResult.IsWebPortalUser
              }
            ></MarineLoadingDetails>
          </ErrorBoundary>
        ) : this.state.isViewAuditTrail ? (
          <ErrorBoundary>
            <MarineShipmentViewAuditTrailDetails
              DispatchCode={this.state.selectedItems[0].Common_Code}
              auditTrailList={this.state.auditTrailList}
              modAuditTrailList={this.state.modAuditTrailList}
              handleBack={this.handleBack}
              auditExpandedRows={this.state.auditExpandedRows}
              auditToggleExpand={this.auditToggleExpand}
              IsEnterpriseNode={this.props.IsEnterpriseNode}
              isWebPortalUser={
                this.props.userDetails.EntityResult.IsWebPortalUser
              }
              Attributes={
                this.state.auditTrailList !== undefined &&
                  this.state.auditTrailList.length > 0
                  ? this.state.auditTrailList[0].AttributesforUI !== undefined
                    ? this.state.auditTrailList[0].AttributesforUI
                    : []
                  : []
              }
            ></MarineShipmentViewAuditTrailDetails>
          </ErrorBoundary>
        ) : this.state.isManualEntry ? (
          <div>
            <ErrorBoundary>
              <MarineDispatchManualEntryDetailsComposite
                dispatchCode={this.state.modMarineDispatch.DispatchCode}
                handleBack={this.handleBack}
                IsBonded={this.state.modMarineDispatch.IsBonded}
                DispatchStatus={this.state.modMarineDispatch.DispatchStatus}
                QuantityUOM={this.state.modMarineDispatch.QuantityUOM}
                ActualTerminalCode={this.state.modMarineDispatch.ActualTerminalCode}
              ></MarineDispatchManualEntryDetailsComposite>
            </ErrorBoundary>
          </div>
        ) : this.state.isDetails === true ? (
          <div>
            <div
              className={
                this.state.isShowPanle
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <MarineDispatchDetailsComposite
                  selectedRow={this.state.selectedRow}
                  selectedShareholder={this.state.selectedShareholder}
                  terminalCodes={this.state.terminalCodes}
                  onBack={this.handleBack}
                  onSaved={this.savedEvent}
                  genericProps={this.props.activeItem.itemProps}
                  viewTab={this.state.viewTab}
                  onTabChange={this.onTabChange}
                  handlePageAdd={this.handlePageAdd}
                  updateEnableForConfigure={updateEnableForConfigure}
                ></MarineDispatchDetailsComposite>
              </ErrorBoundary>
            </div>
            {this.state.isShowPanle ? (
              <div
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                <ErrorBoundary>
                  <TransactionSummaryOperations
                    selectedItem={[
                      { Common_Code: this.state.selectedItems[0].Common_Code },
                    ]}
                    shipmentNextOperations={this.state.shipmentNextOperations}
                    handleDetailsPageClick={this.handleGoDetails}
                    handleOperationButtonClick={this.handleOperationClick}
                    currentStatuses={this.state.currentShipmentStatuses}
                    isDetails={true}
                    isEnterpriseNode={
                      this.props.userDetails.EntityResult.IsEnterpriseNode
                    }
                    isWebPortalUser={
                      this.props.userDetails.EntityResult.IsWebPortalUser
                    }
                    handleDrawer={this.handleDrawer}
                    title={"ViewAllShipment_Details"}
                    unAllowedOperations={[
                      "ViewMarineShipmentList_AuthorizeToLoad",
                      "ViewMarineShipmentList_CloseMarineShipment",
                      "ViewMarineShipmentList_PrintFAN",
                      "ViewMarineShipmentList_PrintBOL",
                      "ViewMarineShipmentList_ManualEntry",
                    ]}
                    webPortalAllowedOperations={[
                      "ViewMarineShipmentList_ViewTransactions",
                      "ViewMarineShipmentList_ViewBOL",
                      "ViewMarineShipmentList_ViewAuditTrail",
                    ]}
                  />
                  {/*<TransactionSummaryOperationsMarine
                    selectedItem={[
                      { Common_Code: this.state.selectedItems[0].Common_Code },
                    ]}
                    shipmentNextOperations={this.state.shipmentNextOperations}
                    handleDetailsPageClick={this.handleGoDetails}
                    handleOperationButtonClick={this.handleOperationClick}
                    currentStatuses={this.state.currentShipmentStatuses}
                    isDetails={true}
                    isEnterpriseNode={
                      this.props.userDetails.EntityResult.IsEnterpriseNode
                    }
                    unAllowedOperations={[]}
                    handleDrawer={this.handleDrawer}
                  />*/}
                </ErrorBoundary>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.marineShipmentKPIList}
                  pageName="MarineDispatch"
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
                  filterText="LoadShipments"
                ></TMTransactionFilters>
              </ErrorBoundary>
              <ErrorBoundary>
                <div
                  className={
                    fillPage === true ? "compositeTransactionList" : ""
                  }
                >
                  <MarineDispatchSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    exportFileName="MarineDispatchList"
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
                  ></MarineDispatchSummaryPageComposite>
                </div>
              </ErrorBoundary>
            </div>
            {shipmentSelected ? (
              <div
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                <ErrorBoundary>
                  <TransactionSummaryOperations
                    selectedItem={[
                      { Common_Code: this.state.selectedItems[0].Common_Code },
                    ]}
                    shipmentNextOperations={this.state.shipmentNextOperations}
                    handleDetailsPageClick={this.handleGoDetails}
                    handleOperationButtonClick={this.handleOperationClick}
                    currentStatuses={this.state.currentShipmentStatuses}
                    isDetails={false}
                    isEnterpriseNode={
                      this.props.userDetails.EntityResult.IsEnterpriseNode
                    }
                    isWebPortalUser={
                      this.props.userDetails.EntityResult.IsWebPortalUser
                    }
                    handleDrawer={this.handleDrawer}
                    title={"ViewAllShipment_Details"}
                    unAllowedOperations={[
                      "ViewMarineShipmentList_AuthorizeToLoad",
                      "ViewMarineShipmentList_CloseMarineShipment",
                      "ViewMarineShipmentList_PrintFAN",
                      "ViewMarineShipmentList_PrintBOL",
                      "ViewMarineShipmentList_ManualEntry",
                    ]}
                    webPortalAllowedOperations={[
                      "ViewMarineShipmentList_ViewTransactions",
                      "ViewMarineShipmentList_ViewBOL",
                      "ViewMarineShipmentList_ViewAuditTrail",
                    ]}
                  />
                  {/*
                  <TransactionSummaryOperationsMarine
                    selectedItem={[
                      { Common_Code: this.state.selectedItems[0].Common_Code },
                    ]}
                    shipmentNextOperations={this.state.shipmentNextOperations}
                    handleDetailsPageClick={this.handleGoDetails}
                    handleOperationButtonClick={this.handleOperationClick}
                    currentStatuses={this.state.currentShipmentStatuses}
                    isDetails={false}
                    isEnterpriseNode={
                      this.props.userDetails.EntityResult.IsEnterpriseNode
                    }
                    unAllowedOperations={[]}
                    handleDrawer={this.handleDrawer}
                  />*/}
                </ErrorBoundary>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {Object.keys(this.state.selectedRow).length > 0 ||
          this.state.selectedItems.length === 1
          ? this.renderModal()
          : ""}

        {this.state.showDeleteAuthenticationLayout  ||
           this.state.showAuthorizeToLoadAuthenticationLayout ||
           this.state.showCloseShipmentAuthenticationLayout ||
           this.state.showViewBOLAuthenticationLayout ||
           this.state.showPrintBOLAuthenticationLayout ||
           this.state.showFANAuthenticationLayout 
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

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarineDispatchComposite);

MarineDispatchComposite.propTypes = {
  activeItem: PropTypes.object,
};
