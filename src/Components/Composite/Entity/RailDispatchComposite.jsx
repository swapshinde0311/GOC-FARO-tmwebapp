import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { RailDispatchSummaryPageComposite } from "../Summary/RailDispatchSummaryComposite";
import RailDispatchDetailsComposite from "../Details/RailDispatchDetailsComposite";
import axios from "axios";
import * as Constants from "./../../../JS/Constants";
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
  fnRailDispatch,
  fnKPIInformation,
  fnCloseRailDispatch,
  fnPrintRailBOL,
  fnPrintRailFAN,
  fnViewRailDispatch,

} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
//import RailDispatchSummaryOperations from "../Common/ViewAllShipmentFolder/RailDispatchSummaryOperations";
import lodash from "lodash";
import { Button, Modal, Input } from "@scuf/common";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import { TranslationConsumer } from "@scuf/localization";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
//import TransactionSummaryOperationsMarine from "../Common/TransactionSummaryOperationsMarine";
import ContractComposite from "./ContractComposite";
import { kpiRailShipmentList } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RailDispatchComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibility: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    terminalCodes: [],
    nextOperations: [],
    currentStatuses: [],
    currentAccess: {},
    lastStatus: "",
    modalData: {
      closeDispatch: {
        isOpen: false,
        data: {
          reason: "",
          dispatchCode: "",
          dispatchStatus: "",
        },
        validationErrors: {
          reason: "",
        },
      },
    },
    subPageName: "",
    isDirectOpenSubPage: false,
    isDisplayDetails: false,
    isReadyToShowOperation: false,
    isDisplayRightPane: false,
    enableHSEInspection: true,
    railLookUpData: {},
    showReport: false,
    drawerStatus: false,
    isGoBackToSource: false,
    isContractDisable: false,
    railDispatchKPIList: [],
    railDispatchDeleteStates: [],
    activityInfo: [],

    showDeleteAuthenticationLayout: false,
    showAuthorizeToLoadAuthenticationLayout: false,
    showCloseShipmentAuthenticationLayout: false,
    showViewBOLAuthenticationLayout: false,
    showPrintBOLAuthenticationLayout:false,
    showFANAuthenticationLayout: false,
  };

  componentName = "RailDispatchComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (this.props.shipmentSourceFromSummary) {
        const operationsVisibility = lodash.cloneDeep(
          this.state.operationsVisibility
        );
        operationsVisibility.add = false;
        this.setState({
          isDetails: true,
          selectedItems: [],
          selectedRow: {},
          operationsVisibility,
          isDirectOpenSubPage: false,
          isReadyToShowOperation: false,
        });
        this.setRightPaneDisplay(true);
      }
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailDispatch
      );
      this.setState({
        operationsVisibility,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.CheckRailDispatchDeleteAllowed();
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
      this.getRailDispatchList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList();
      this.getContractLookupValues();
      this.GetShipmentActivityInfo();
    } catch (error) {
      console.log(
        "RailDispatchComposite: Error occurred on componentDidMount",
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
        RestAPIs.GetShipmentActivityInfo,
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
          "RailDispatchComposite: Error occurred on getLookUpData",
          error
        );
      });
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
        "RailDispatchComposite: Error occurred on getTerminalsList",
        error
      );
    }
  }

  getRailDispatchList(shareholder) {
    try {
      this.setState({ isReadyToRender: false });
      const obj = {
        ShareHolderCode: shareholder,
        TransportationType: Constants.TransportationType.RAIL,
        ShipmentFrom: null,
        ScheduledFrom: null,
        ScheduledTo: null,
        ShipmentTypeCode: null,
      };
      if (
        !this.props.shipmentSourceFromSummary &&
        this.props.shipmentSource !== undefined
      ) {
        obj.ShipmentFrom = this.props.shipmentSource;
        obj.ShipmentType = Constants.shipmentTypeOptions.All;
        obj.ShipmentTypeCode = this.props.shipmentSourceCode;
      } else {
        const fromDate = new Date(this.state.fromDate);
        const toDate = new Date(this.state.toDate);
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);
        obj.ScheduledFrom = fromDate;
        obj.ScheduledTo = toDate;
        obj.ShipmentType = Constants.shipmentTypeOptions.All;
        obj.ShipmentFrom = Constants.shipmentFrom.All;
      }

      axios(
        RestAPIs.GetRailDispatchListForRole,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
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

                  let { operationsVisibility, activityInfo } = { ...this.state };

                  let dispatchDeleteInfo = activityInfo.filter((item) => {
                    return (
                      item.ActivityCode ===
                      Constants.ShipmentActivityInfo.RAILDISPATCH_ENABLE_DELETEPLAN &&
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

                  operationsVisibility.delete = this.props.userDetails
                    .EntityResult.IsWebPortalUser
                    ? false
                    : dispatchDeleteStates.indexOf(
                      updatedSelectedItem[0].ViewRailDispatchDetails_ShipmentStatus.toUpperCase()
                    ) > -1 &&
                    Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.remove,
                      fnRailDispatch
                    );

                  if (this.state.isDetails) {
                    this.setState({
                      selectedItems: updatedSelectedItem,
                      selectedRow: updatedSelectedItem[0],
                      operationsVisibility
                    });
                  } else {
                    this.getRailDispatchStatusOperation(
                      updatedSelectedItem[0].Common_Code,
                      updatedSelectedItem[0]
                        .ViewRailDispatchDetails_ShipmentStatus,
                      updatedSelectedItem[0]
                    );
                    this.setState({
                      selectedItems: updatedSelectedItem,
                      operationsVisibility
                    });
                  }
                }
              }
            );
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log(
              "Error in GetRailDispatchListForRole: ",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting RailDispatch List: ", error);
        });
    } catch (error) {
      this.setState({ isReadyToRender: true });
      console.log(error);
    }
  }



  handleAdd = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.delete = false;
      operationsVisibility.add = false;
      this.setState({
        isDetails: true,
        selectedItems: [],
        selectedRow: {},
        operationsVisibility,
        isDirectOpenSubPage: false,
        isReadyToShowOperation: false,
        isDisplayRightPane: false,
        drawerStatus: false,
      });
      this.setRightPaneDisplay(true);
      if (this.props.shipmentSource !== undefined)
        this.props.isShowBackButton(false);
    } catch (error) {
      console.log("RailDispatchComposite: Error occurred on handleAdd");
    }
  };

  handleDelete = () => {
    this.handleAuthenticationClose();
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.delete = false;
      this.setState({ operationsVisibility });
      const deleteRailDispatchKeys = [];
      for (let item of this.state.selectedItems) {
        deleteRailDispatchKeys.push({
          ShareHolderCode: this.state.selectedShareholder,
          KeyCodes: [
            { Key: KeyCodes.railDispatchCode, Value: item.Common_Code },
          ],
        });
      }

      axios(
        RestAPIs.DeleteRailDispatch,
        Utilities.getAuthenticationObjectforPost(
          deleteRailDispatchKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          let isRefreshDataRequire = result.IsSuccess;
          if (
            result.ResultDataList !== undefined &&
            result.ResultDataList !== null
          ) {
            const failedResultsCount = result.ResultDataList.filter((res) => {
              return !res.IsSuccess;
            }).length;
            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else {
              isRefreshDataRequire = true;
            }
          }

          const notification = Utilities.convertResultsDatatoNotification(
            result,
            "Shipment_DeletionStatus",
            ["RailDispatchCode"]
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
            this.getRailDispatchList(this.state.selectedShareholder);
            this.getKPIList();
            operationsVisibility.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibility,
              selectedRow: {},
              isReadyToShowOperation: false,
            });
          }
          console.log(notification);
          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0) {
              messageResult.keyFields[0] =
                "RailDispatchPlanDetail_DispatchCode";
            }
          });
          this.handleNotify(notification);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.log("RailDispatchComposite: Error occurred on handleDelete");
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
    const error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getRailDispatchList(this.state.selectedShareholder);
    }
  };

  handleBack = () => {
    try {
      if (
        this.props.shipmentSource !== undefined &&
        this.props.shipmentSourceFromSummary
      ) {
        let operationsVisibility = { ...this.state.operationsVisibility };
        operationsVisibility.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnRailDispatch
        );
        operationsVisibility.shareholder = true;
        this.setState({
          isDetails: false,
          selectedRow: {},
          selectedItems: [],
          operationsVisibility,
          isReadyToShowOperation: false,
          drawerStatus: false,
          isGoBackToSource: true,
          isReadyToRender: false,
        });
      }
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailDispatch
      );
      operationsVisibility.delete = false;
      //operationsVisibility.shareholder = true;
      this.setRightPaneDisplay(false);
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibility,
        isReadyToShowOperation: false,
        drawerStatus: false,
        isReadyToRender: false,
      });
      this.getRailDispatchList(this.state.selectedShareholder);
      this.getKPIList();
      this.props.isShowBackButton(true);
    } catch (error) {
      console.log("RailDispatchComposite: Error occurred on Back click", error);
    }
  };

  handleSubPageBack = () => {
    try {
      this.setRightPaneDisplay(true);
      if (this.state.isDirectOpenSubPage) {
        const operationsVisibility = lodash.cloneDeep(
          this.state.operationsVisibility
        );
        operationsVisibility.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnRailDispatch
        );
        //operationsVisibility.delete = false;
        //operationsVisibility.shareholder = true;
        this.setState({
          isDetails: false,
          selectedRow: {},
          operationsVisibility,
          subPageName: "",
          isDirectOpenSubPage: false,
          isReadyToRender: false,
        });
        this.getRailDispatchList(this.state.selectedShareholder);
        if (this.props.shipmentSource !== undefined)
          this.props.isShowBackButton(true);
      } else {
        this.setState({
          subPageName: "",
        });
        this.handleRowClick(this.state.selectedItems[0]);
      }
    } catch (error) {
      console.log("RailDispatchComposite: Error occurred on Back click", error);
    }
  };

  handleRowClick = (item, isLoadOperaton = true, isDisplayDetails = false) => {
    try {
      var { operationsVisibility, activityInfo } = { ... this.state };

      operationsVisibility.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailDispatch
      );

      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.RAILDISPATCH_ENABLE_DELETEPLAN &&
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

      operationsVisibility.delete = this.props.userDetails
        .EntityResult.IsWebPortalUser
        ? false
        : dispatchDeleteStates.indexOf(
          item.ViewRailDispatchDetails_ShipmentStatus.toUpperCase()
        ) > -1 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnRailDispatch
        );

      // operationsVisibility.delete =
      //   item.ViewRailDispatchDetails_ShipmentStatus ===
      //     Constants.Shipment_Status.READY &&
      //   Utilities.isInFunction(
      //     this.props.userDetails.EntityResult.FunctionsList,
      //     functionGroups.remove,
      //     fnRailDispatch
      //   );
      if (isLoadOperaton) {
        this.getRailDispatchStatusOperation(
          item.Common_Code,
          item.ViewRailDispatchDetails_ShipmentStatus,
          item
        );
      }
      // if (
      //   this.state.selectedItems.length === 1 &&
      //   this.state.selectedItems[0].Common_Code === item.Common_Code &&
      //   this.state.selectedItems[0].ViewRailDispatchDetails_ShipmentStatus ===
      //     item.ViewRailDispatchDetails_ShipmentStatus
      // ) {
      // } else {

      // }
      this.setRightPaneDisplay(true);
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibility,
        isDisplayDetails,
        drawerStatus: false,
      });
      if (this.props.shipmentSource !== undefined)
        this.props.isShowBackButton(false);
    } catch (error) {
      console.log(
        "RailDispatchComposite: Error occurred on handleRowClick",
        error
      );
    }
  };

  handleOperationClick = (operation) => {
    let operationsVisibility = this.state.operationsVisibility;

    switch (operation) {
      case "ViewRailDispatch_AuthorizeToLoad":
        this.authorizeToLoadClick();
        break;
      case "ViewRailDispatch_CloseDispatch":
        this.handleConfirmCloseDispatch(
          this.state.selectedItems[0].Common_Code,
          this.state.selectedItems[0].ViewRailDispatchDetails_ShipmentStatus
        );
        break;
      case "ViewRailDispatch_ManualEntry":
        this.setState({
          subPageName: "RailDispatchCompartmentManualEntryDetails",
        });
        if (!this.state.isDetails) {
          this.handleRowClick(this.state.selectedItems[0], false);
          this.setState({ isDirectOpenSubPage: true });
        }
        operationsVisibility.delete = false;
        operationsVisibility.add = false;
        break;
      case "ViewRailDispatch_PrintBOL":
        this.printBOLClick();
        break;
      case "ViewRailDispatch_PrintFAN":
        this.printFANClick();
        break;
      case "ViewRailDispatch_RecordWeight":
        this.setState({ subPageName: "RailDispatchRecordWeightDetails" });
        if (!this.state.isDetails) {
          this.handleRowClick(this.state.selectedItems[0], false);
          this.setState({ isDirectOpenSubPage: true });
        }
        operationsVisibility.delete = false;
        operationsVisibility.add = false;
        break;
      case "ViewRailDispatch_ViewAuditTrail":
        this.setState({ subPageName: "RailDispatchViewAuditTrailDetails" });
        if (!this.state.isDetails) {
          this.handleRowClick(this.state.selectedItems[0], false);
          this.setState({ isDirectOpenSubPage: true });
        }
        operationsVisibility.delete = false;
        operationsVisibility.add = false;
        break;
      case "ViewRailDispatch_ViewBOL":
        this.viewBOLClick();
        break;
      case "ViewRailDispatch_ViewLoadingDetails":
        this.setState({ subPageName: "RailDispatchViewLoadingDetailsDetails" });
        if (!this.state.isDetails) {
          this.handleRowClick(this.state.selectedItems[0], false);
          this.setState({ isDirectOpenSubPage: true });
        }
        operationsVisibility.delete = false;
        operationsVisibility.add = false;
        break;
      case "ViewRailDispatch_RailWagonAssignment":
        this.setState({
          subPageName: "RailDispatchRailWagonAssignmentDetails",
        });
        if (!this.state.isDetails) {
          this.handleRowClick(this.state.selectedItems[0], false);
          this.setState({ isDirectOpenSubPage: true });
        }
        operationsVisibility.delete = false;
        operationsVisibility.add = false;
        break;
      case "ViewRailDispatch_ProductAssignment":
        this.setState({ subPageName: "RailDispatchProductAssignmentDetails" });
        if (!this.state.isDetails) {
          this.handleRowClick(this.state.selectedItems[0], false);
          this.setState({ isDirectOpenSubPage: true });
        }
        operationsVisibility.delete = false;
        operationsVisibility.add = false;
        break;
      case "ViewRailDispatch_LoadSpotAssignment":
        this.setState({ subPageName: "RailDispatchLoadSpotAssignmentDetails" });
        if (!this.state.isDetails) {
          this.handleRowClick(this.state.selectedItems[0], false);
          this.setState({ isDirectOpenSubPage: true });
        }
        operationsVisibility.delete = false;
        operationsVisibility.add = false;
        break;
      case "ViewRailDispatch_BSIOutbound":
        this.handleBSIOutbound(this.state.selectedItems[0].Common_Code);
        break;
      default:
        return;
    }
    this.setState({ operationsVisibility });
  };

  handleSelection = (items) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );

      var { drawerStatus, activityInfo } = { ...this.state };

      // let railDispatchDeleteStates = lodash.cloneDeep(
      //   this.state.railDispatchDeleteStates
      // );

      // const isReady =
      //   items.findIndex(
      //     (x) =>
      //       railDispatchDeleteStates.indexOf(
      //         x.ViewRailDispatchDetails_ShipmentStatus.toUpperCase()
      //       ) < 0
      //   ) >= 0
      //     ? false
      //     : true;

      // operationsVisibility.delete =
      //   isReady &&
      //   items.length > 0 &&
      //   Utilities.isInFunction(
      //     this.props.userDetails.EntityResult.FunctionsList,
      //     functionGroups.remove,
      //     fnRailDispatch
      //   );

      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.RAILDISPATCH_ENABLE_DELETEPLAN &&
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

      let isReady =
        items.findIndex(
          (x) =>
            dispatchDeleteStates.indexOf(
              x.ViewRailDispatchDetails_ShipmentStatus.toUpperCase()
            ) < 0
        ) >= 0
          ? false
          : true;

      operationsVisibility.delete = this.props.userDetails
        .EntityResult.IsWebPortalUser
        ? false
        : isReady &&
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnRailDispatch
        );

      if (items.length !== 1) {
        drawerStatus = true;
      } else {
        drawerStatus = false;
      }

      this.setState({
        selectedItems: items,
        operationsVisibility,
        drawerStatus,
      });

      if (
        items.length === 1
        // this.props.userDetails.EntityResult.IsEnterpriseNode === false
      ) {
        this.setRightPaneDisplay(true);
        this.getRailDispatchStatusOperation(
          items[0].Common_Code,
          items[0].ViewRailDispatchDetails_ShipmentStatus,
          items[0]
        );
      } else {
        this.setRightPaneDisplay(false);
        this.setState({ isReadyToShowOperation: false });
      }
    } catch (error) {
      console.log(
        "RailDispatchComposite: Error occurred on handleSelection",
        error
      );
    }
  };

  CheckRailDispatchDeleteAllowed() {
    try {
      axios(
        RestAPIs.CheckRailDispatchDeleteAllowed,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            this.setState({
              railDispatchDeleteStates: response.data.EntityResult,
            });
          }
        })
        .catch((error) => {
          console.log("Error while fetching delete states in Rail:", error);
        });
    } catch (error) {
      console.log("Error while fetching delete states in Rail:", error);
    }
  }

  handleUpdateStatusOperation = (railDispatch) => {
    const item = {
      Common_Code: railDispatch.DispatchCode,
      ViewRailDispatchDetails_ShipmentStatus: railDispatch.DispatchStatus,
      RailRouteConfigurationDetails_RailRouteCode: railDispatch.RouteCode,
      ScheduledDate: railDispatch.ScheduledDate,
      ViewRailDispatchList_LoadedDate: railDispatch.LoadEndTime,
      AssociatedTerminals: railDispatch.TerminalCodes,
      AcutalTerminalCode: railDispatch.ActualTerminalCode,
    };
    this.setState({ selectedItems: [item], selectedRow: item }, () => {
      this.getRailDispatchStatusOperation(
        railDispatch.DispatchCode,
        railDispatch.DispatchStatus,
        item
      );
    });
  };

  getRailDispatchStatusOperation(dispatchCode, dispatchStatus, item) {
    this.setState({ isReadyToShowOperation: false });
    this.getRailDispatchOperations(dispatchCode, dispatchStatus, item, () => {
      this.getRailDispatchAllChangeStatus(dispatchCode, () => {
        this.setState({ isReadyToShowOperation: true });
      });
    });
  }

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibility, activityInfo } = { ...this.state };

      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.RAILDISPATCH_ENABLE_DELETEPLAN &&
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

      if (notification.messageType === "success") {
        operationsVisibility.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnRailDispatch
        );
        operationsVisibility.delete = this.props.userDetails
          .EntityResult.IsWebPortalUser
          ? false
          : dispatchDeleteStates.indexOf(
            data.DispatchStatus.toUpperCase()
          ) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnRailDispatch
          );
        this.setState({ isDetailsModified: true, operationsVisibility });
      }
      if (notification.messageType === "success" && saveType === "add") {
        const selectedItems = [
          {
            RailDispatchCode: data.Code,
            Common_Shareholder: data.ShareholderCode,
          },
        ];
        this.setState({
          selectedItems,
        });
      }
      this.handleNotify(notification);
    } catch (error) {
      console.log("RailDispatchComposite: Error occurred on savedEvent", error);
    }
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

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({ selectedShareholder: shareholder });
      this.getRailDispatchList(shareholder);
    } catch (error) {
      console.log(
        "RailDispatchComposite: Error occurred on handleShareholderSelectionChange",
        error
      );
    }
  };

  getTransportationType() {
    let transportationType = Constants.TransportationType.RAIL;
    const { itemProps } = this.props.activeItem;
    if (itemProps !== undefined && itemProps.transportationType !== undefined) {
      transportationType = itemProps.transportationType;
    }
    return transportationType;
  }

  getRailDispatchOperations(dispatchCode, dispatchStatus, item, callBack) {
    var localTerminalCode = item.AcutalTerminalCode;

    if (localTerminalCode === null || localTerminalCode === undefined) {
      if (this.state.selectedItems.length === 1) {
        localTerminalCode = this.state.selectedItems[0].AcutalTerminalCode;
      }
    }
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: "RailDispatchStatus",
          value: dispatchStatus,
        },
        {
          key: "DispatchCode",
          value: dispatchCode,
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
        const result = response.data;
        if (result.IsSuccess === true) {
          const currentAccess = {
            ViewRailDispatch_EditAccess: false,
            ViewRailDispatch_DisableAdjustPlanQty: false,
            ViewRailDispatch_DisableWagonForceClose: false,
            ViewRailDispatch_Delete: false,
            ViewRailDispatch_Update: false,
          };
          for (let key in currentAccess) {
            if (result.EntityResult[key] !== undefined) {
              currentAccess[key] = result.EntityResult[key];
              if (
                key !== "ViewRailDispatch_Update" &&
                key !== "ViewRailDispatch_Delete"
              )
                delete result.EntityResult[key];
            }
          }

          const operationOrder = [
            "ViewRailDispatch_Update",
            "ViewRailDispatch_Delete",
            "ViewRailDispatch_AuthorizeToLoad",
            "ViewRailDispatch_PrintFAN",
            "ViewRailDispatch_RecordWeight",
            "ViewRailDispatch_RailWagonAssignment",
            "ViewRailDispatch_ProductAssignment",
            "ViewRailDispatch_LoadSpotAssignment",
            "ViewRailDispatch_ManualEntry",
            "ViewRailDispatch_ViewLoadingDetails",
            "ViewRailDispatch_ViewAuditTrail",
            "ViewRailDispatch_CloseDispatch",
            "ViewRailDispatch_ViewBOL",
            "ViewRailDispatch_PrintBOL",
          ];
          const nextOperations = [];
          for (let operation of operationOrder) {
            if (
              operation === "ViewRailDispatch_Update" ||
              operation === "ViewRailDispatch_Delete"
            ) {
              let operationsVisibility = this.state.operationsVisibility;
              if (operation === "ViewRailDispatch_Update") {
                //operationsVisibility.modify=true;
                currentAccess.ViewRailDispatch_Update =
                  result.EntityResult[operation];
              }
              if (operation === "ViewRailDispatch_Delete") {
                operationsVisibility.delete = result.EntityResult[operation];
                currentAccess.ViewRailDispatch_Delete =
                  result.EntityResult[operation];
              }
              this.setState({
                operationsVisibility,
              });
              continue;
            }
            if (
              dispatchStatus === Constants.Shipment_Status.CHECKED_IN &&
              operation === "ViewRailDispatch_ProductAssignment"
            ) {
              continue;
            } else if (
              operation === "ViewRailDispatch_RailWagonAssignment" ||
              operation === "ViewRailDispatch_ProductAssignment" ||
              operation === "ViewRailDispatch_LoadSpotAssignment"
            ) {
              if (
                !this.props.userDetails.EntityResult.IsEnterpriseNode &&
                dispatchStatus !== "READY" &&
                localTerminalCode === null
              ) {
                continue;
              } else if (result.EntityResult[operation] === true) {
                nextOperations.push(operation);
              }
            } else if (result.EntityResult[operation] === true) {
              if (
                operation === "ViewRailDispatch_CloseDispatch" ||
                operation === "ViewRailDispatch_RecordWeight" ||
                operation === "ViewRailDispatch_ManualEntry"
              ) {
                if (
                  !this.props.userDetails.EntityResult.IsEnterpriseNode &&
                  localTerminalCode !==
                  this.props.userDetails.EntityResult.TerminalCode
                ) {
                  continue;
                }
              }

              if (
                operation === "ViewRailDispatch_PrintFAN" ||
                operation === "ViewRailDispatch_PrintBOL"
              ) {
                if (this.props.userDetails.EntityResult.IsWebPortalUser) {
                  continue;
                }
              }
              nextOperations.push(operation);
            }
          }
          if (
            dispatchStatus === Constants.Shipment_Status.CLOSED &&
            this.props.userDetails.EntityResult.IsBSIEnabledLicense &&
            !this.props.userDetails.EntityResult.IsArchived &&
            !this.props.userDetails.EntityResult.IsWebPortalUser
          ) {
            nextOperations.push("ViewRailDispatch_BSIOutbound");
          }

          this.setState({ nextOperations, currentAccess });
          callBack();
        } else {
          console.log("Error in getRailDispatchOperations: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getRailDispatchOperations: ", error);
      });
  }

  getRailDispatchAllChangeStatus(dispatchCode, callBack) {
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: "DispatchCode",
          value: dispatchCode,
        },
      ],
    };
    axios(
      RestAPIs.GetRailDispatchAllChangeStatus,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            currentStatuses: result.EntityResult,
            //lastStatus: result.EntityResult.pop(),
          });
          callBack();
        } else {
          console.log(
            "Error in getRailDispatchAllChangeStatus: ",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getRailDispatchAllChangeStatus: ", error);
      });
  }

  authorizeToLoadClick = () => {
    let showAuthorizeToLoadAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showAuthorizeToLoadAuthenticationLayout, }, () => {
      if (showAuthorizeToLoadAuthenticationLayout === false) {
        this.handleAuthorizeToLoad();
      }})
    }
  

    handleAuthorizeToLoad= () =>  {

    this.handleAuthenticationClose();

   let dispatchCode= this.state.selectedItems[0].Common_Code;
   let dispatchStatus= this.state.selectedItems[0].ViewRailDispatchDetails_ShipmentStatus;
   
    const obj = {
      DispatchCode: dispatchCode,
      DispatchStatus: dispatchStatus,
      TMWebApiRequest: {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        KeyCodes: [
          {
            key: "RailDispatchCode",
            value: dispatchCode,
          },
        ],
      },
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_AuthorizeLoad_status",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [dispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailDispatchAuthorizeToLoad,
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
          const operationsVisibility = lodash.cloneDeep(
            this.state.operationsVisibility
          );
          operationsVisibility.delete = false;
          if (this.state.isDetails) {
            const selectedRow = lodash.cloneDeep(this.state.selectedRow);
            selectedRow.ViewRailDispatchDetails_ShipmentStatus =
              Constants.Shipment_Status.CHECKED_IN;
            this.setState({ selectedRow });
          } else {
            this.getRailDispatchList(this.state.selectedShareholder);
          }
          // setTimeout(() => {
          //   this.getRailDispatchStatusOperation(
          //     dispatchCode,
          //     Constants.Shipment_Status.CHECKED_IN
          //   );
          // }, 700);
          this.setState({ operationsVisibility });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in handleAuthorizeToLoad: ", result.ErrorList);
        }
        this.handleNotify(notification);
      })
      .catch((error) => {
        console.log("Error while handleAuthorizeToLoad: ", error);
      });
  }

  handleConfirmCloseDispatch = (dispatchCode, dispatchStatus) => {
    const modalData = this.state.modalData;
    modalData.closeDispatch.isOpen = true;
    modalData.closeDispatch.data.dispatchCode = dispatchCode;
    modalData.closeDispatch.data.dispatchStatus = dispatchStatus;
    this.setState({ modalData });
  };

  handleCloseDispatchReasonChange = (reason) => {
    const modalData = this.state.modalData;
    modalData.closeDispatch.data.reason = reason;
    this.setState({ modalData });
  };

  forceCloseRailDispatch = () => {
    const modalData = lodash.cloneDeep(this.state.modalData);
    if (modalData.closeDispatch.data.reason === "") {
      modalData.closeDispatch.validationErrors.reason =
        "ViewShipment_MandatoryReason";
      this.setState({ modalData });
      return;
    } else {
      modalData.closeDispatch.validationErrors.reason = "";
    }
    
    let showCloseShipmentAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showCloseShipmentAuthenticationLayout, }, () => {
      if (showCloseShipmentAuthenticationLayout === false) {
        this.closeRailDispatch();
      }})
  };

  closeRailDispatch= () =>
  {
    this.handleAuthenticationClose();
     const modalData = lodash.cloneDeep(this.state.modalData);
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: "RailDispatchCode",
          value: modalData.closeDispatch.data.dispatchCode,
        },
      ],
      Entity: {
        Reason: modalData.closeDispatch.data.reason,
        DispatchCode: modalData.closeDispatch.data.dispatchCode,
        DispatchStatus: modalData.closeDispatch.data.dispatchStatus,
      },
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_CloseDispatch_status",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [modalData.closeDispatch.data.dispatchCode],
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
        const result = response.data;
        modalData.closeDispatch.isOpen = false;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          if (this.state.isDetails) {
            const selectedRow = lodash.cloneDeep(this.state.selectedRow);
            selectedRow.ViewRailDispatchDetails_ShipmentStatus =
              Constants.Shipment_Status.CLOSED;
            this.setState({ selectedRow });
          } else {
            this.getRailDispatchList(this.state.selectedShareholder);
          }
          
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in forceCloseRailDispatch: ", result.ErrorList);
        }
        this.setState({ modalData });
        this.handleNotify(notification);
      })
      .catch((error) => {
        console.log("Error while forceCloseRailDispatch: ", error);
      });
  }


  printFANClick= () => {
    let showFANAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showFANAuthenticationLayout, }, () => {
      if (showFANAuthenticationLayout === false) {
        this.handlePrintFAN();
      }})
     
    }

  handlePrintFAN= () =>{
    this.handleAuthenticationClose();
    let dispatchCode= this.state.selectedItems[0].Common_Code;
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: "RailDispatchCode",
          value: dispatchCode,
        },
      ],
    };
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [dispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailDispatchPrintFAN,
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
          console.log("Error in handlePrintFAN: ", result.ErrorList);
        }
        this.handleNotify(notification);
      })
      .catch((error) => {
        console.log("Error while handlePrintFAN: ", error);
      });
  }

  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/RailBOL";
    } else {
      path = "TM/" + Constants.TMReports + "/RailBOL";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      ShareholderCode: this.state.selectedShareholder,
      RailDispatchCode:
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


  printBOLClick= () => {
    let showPrintBOLAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showPrintBOLAuthenticationLayout, }, () => {
      if (showPrintBOLAuthenticationLayout === false) {
        this.handlePrintBOL();
      }})
     
    }


  handlePrintBOL= () => {
    this.handleAuthenticationClose();
    let dispatchCode=this.state.selectedItems[0].Common_Code;
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: "RailDispatchCode",
          value: dispatchCode,
        },
      ],
    };
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_PrintStatus",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [dispatchCode],
          isSuccess: false,
          errorMessage: "",
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
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess !== true) {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in handlePrintBOL: ", result.ErrorList);
        }
        this.handleNotify(notification);
      })
      .catch((error) => {
        console.log("Error while handlePrintBOL: ", error);
      });
  }

  handleBSIOutbound(dispatchCode) {
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: "RailDispatchCode",
          value: dispatchCode,
        },
      ],
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_BSIOutbound_status",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [dispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailDispatchBSIOutbound,
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

  setRightPaneDisplay = (isDisplayRightPane) => {
    this.setState({ isDisplayRightPane });
  };

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

  //Get KPI for Rail Dispatch
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
        PageName: kpiRailShipmentList,
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
              railDispatchKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ railDispatchKPIList: [] });
            console.log("Error in Rail Dispatch KPIList:", result.ErrorList);
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
          console.log("Error while getting Rail Dispatch KPIList:", error);
        });
    }
  }

  getContractLookupValues() {
    try {
      let railDispatchAdd = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailDispatch
      );
      if (railDispatchAdd) {
        this.getLookUpData("Contract", (entityResult) => {
          this.setState({
            isContractDisable:
              entityResult["EnableContract"] === "0" ? false : true,
          });
        });
      }
    } catch (error) {
      console.log("Error while getContractLookupValues: ", error);
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
      showAuthorizeToLoadAuthenticationLayout: false,
      showCloseShipmentAuthenticationLayout: false,
      showViewBOLAuthenticationLayout: false,
      showPrintBOLAuthenticationLayout:false,
      showFANAuthenticationLayout: false,
    });
  };

  
  getFunctionGroupName() {
    if(this.state.showDeleteAuthenticationLayout )
      return fnRailDispatch
    else if(this.state.showCloseShipmentAuthenticationLayout)
      return fnCloseRailDispatch
    else if(this.state.showAuthorizeToLoadAuthenticationLayout)
      return fnViewRailDispatch
    else if(this.state.showViewBOLAuthenticationLayout || this.state.showPrintBOLAuthenticationLayout)
      return fnPrintRailBOL
      else if(this.state.showFANAuthenticationLayout)
      return fnPrintRailFAN
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
      return this.handleAuthorizeToLoad
    else if(this.state.showCloseShipmentAuthenticationLayout)
      return this.closeRailDispatch
    else if(this.state.showFANAuthenticationLayout)
      return this.handlePrintFAN
    else if(this.state.showViewBOLAuthenticationLayout)
      return this.handleViewBOL;
      else if(this.state.showPrintBOLAuthenticationLayout)
      return this.handlePrintBOL;
 };

  render() {
    const modalData = this.state.modalData;
    let fillPage = true;
    const isDisplayRightPane =
      this.state.selectedItems.length === 1 &&
      // this.props.userDetails.EntityResult.IsEnterpriseNode === false &&
      this.state.isDisplayRightPane;
    let loadingClass = "globalLoader";

    return (
      <div>
        {this.props.shipmentSource === undefined ||
          this.props.shipmentSource === "" ||
          this.props.shipmentSource === null ? (
          <ErrorBoundary>
            <TMUserActionsComposite
              operationsVisibilty={this.state.operationsVisibility}
              breadcrumbItem={this.props.activeItem}
              onAdd={this.handleAdd}
              onDelete={this.authenticateDelete}
              shrVisible={false}
              handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            />
          </ErrorBoundary>
        ) : (
          <>
            {this.state.isDetails ? (
              ""
            ) : (
              <>
                {!this.state.isGoBackToSource ? (
                  <TranslationConsumer>
                    {(t) => (
                      <div className="headerContainer">
                        <div className="row headerSpacing">
                          <div className="col paddingHeaderItemLeft">
                            <span
                              style={{ margin: "auto" }}
                              className="headerLabel"
                            >
                              {this.props.shipmentSourceCode +
                                " - " +
                                t("Dispatch_OtherSource")}
                            </span>
                          </div>

                          <div>
                            <div className="headerItemRight">
                              <Button
                                type="primary"
                                content={t("RailDispatchPlanList_AddNew")}
                                disabled={!this.state.isContractDisable}
                                onClick={this.handleAdd}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TranslationConsumer>
                ) : null}
              </>
            )}
          </>
        )}

        {this.state.isGoBackToSource ? (
          <ErrorBoundary>
            <ContractComposite
              shipmentSource={this.props.shipmentSource}
              activeItem={this.props.activeItem}
            ></ContractComposite>
          </ErrorBoundary>
        ) : (
          ""
        )}

        {this.state.isDetails === true ? (
          // <div
          //   className={isDisplayRightPane ? "showShipmentStatusRightPane" : ""}
          // >
          <div
            className={
              isDisplayRightPane
                ? !this.state.drawerStatus
                  ? "showShipmentStatusRightPane"
                  : "drawerClose"
                : ""
            }
          >
            <ErrorBoundary>
              <RailDispatchDetailsComposite
                Key="RailDispatchDetails"
                selectedRow={this.state.selectedRow}
                onBack={this.handleBack}
                onSubPageBack={this.handleSubPageBack}
                onSaved={this.savedEvent}
                terminalCodes={this.state.terminalCodes}
                selectedShareholder={this.state.selectedShareholder}
                getLookUpData={this.getLookUpData}
                onNotify={this.handleNotify}
                onUpdateStatusOperation={this.handleUpdateStatusOperation}
                subPageName={this.state.subPageName}
                isDirectOpenSubPage={this.state.isDirectOpenSubPage}
                isDisplayDetails={this.state.isDisplayDetails}
                currentAccess={this.state.currentAccess}
                onSetRightPaneDisplay={this.setRightPaneDisplay}
                enableHSEInspection={this.state.enableHSEInspection}
                railLookUpData={this.state.railLookUpData}
                shipmentSource={this.props.shipmentSource}
                shipmentSourceCode={this.props.shipmentSourceCode}
                shipmentSourceCompartmentItems={
                  this.props.shipmentSourceCompartmentItems
                }
                shipmentSourceDetails={this.props.shipmentSourceDetails}
                shipmentSourceFromSummary={this.props.shipmentSourceFromSummary}
                selectedSourceCode={this.props.selectedSourceCode}
              />
            </ErrorBoundary>
          </div>
        ) : (
          // {/* <div
          //   className={
          //     isDisplayRightPane ? "showShipmentStatusRightPane" : ""
          //   }
          // > */}
          // <div className={isDisplayRightPane ? "showShipmentStatusRightPane" : ""}>
          <div>
            {this.props.shipmentSource === undefined ||
              this.props.shipmentSource === "" ||
              this.props.shipmentSource === null ? (
              <ErrorBoundary>
                <div className="kpiSummaryContainer">
                  <KPIDashboardLayout
                    kpiList={this.state.railDispatchKPIList}
                    pageName="RailDispatch"
                  ></KPIDashboardLayout>
                </div>
              </ErrorBoundary>
            ) : (
              ""
            )}
            <div
              className={
                isDisplayRightPane
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              {this.props.shipmentSourceFromSummary === undefined ||
                this.props.shipmentSourceFromSummary === "" ||
                this.props.shipmentSourceFromSummary === null ? (
                <div>
                  {this.props.shipmentSource === undefined ? (
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
                      />
                    </ErrorBoundary>
                  ) : null}

                  {this.state.isReadyToRender ? (
                    <ErrorBoundary>
                      <div
                        className={
                          fillPage === true ? "compositeTransactionList" : ""
                        }
                      >
                        <RailDispatchSummaryPageComposite
                          tableData={this.state.data.Table}
                          columnDetails={this.state.data.Column}
                          pageSize={
                            this.props.userDetails.EntityResult.PageAttibutes
                              .WebPortalListPageSize
                          }
                          exportRequired={true}
                          exportFileName="RailDispatchList"
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
                        />
                      </div>
                    </ErrorBoundary>
                  ) : (
                    <LoadingPage
                      loadingClass={loadingClass}
                      message=""
                    ></LoadingPage>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          // {/* </div> */}
        )}

        {isDisplayRightPane ? (
          // <div className="showShipmentStatusLeftPane">
          <div
            className={this.state.drawerStatus ? "marineStatusLeftPane" : ""}
          >
            {/* <RailDispatchSummaryOperations
              selectedItem={this.state.selectedItems}
              nextOperations={this.state.nextOperations}
              handleDetailsPageClick={this.handleRowClick}
              handleOperationButtonClick={this.handleOperationClick}
              currentStatuses={this.state.currentStatuses}
              lastStatus={this.state.lastStatus}
              isDetails={this.state.isDetails}
              isReadyToRender={this.state.isReadyToShowOperation}
            /> */}
            <TransactionSummaryOperations
              selectedItem={this.state.selectedItems}
              shipmentNextOperations={this.state.nextOperations}
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
                "ViewRailDispatch_ViewLoadingDetails",
                "ViewRailDispatch_ViewAuditTrail",
                "ViewRailDispatch_ViewBOL",
              ]}
            />
          </div>
        ) : null}

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
        ) : null}
        {Object.keys(this.state.selectedRow).length > 0 ||
          this.state.selectedItems.length === 1
          ? this.renderModal()
          : ""}

        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <>
                <Modal
                  size="mini"
                  open={this.state.modalData.closeDispatch.isOpen}
                  closeOnDimmerClick={false}
                >
                  <Modal.Content>
                    <Input
                      fluid
                      label={t("ViewRailDispatchList_ForceCloseHeader")}
                      onChange={this.handleCloseDispatchReasonChange}
                      error={t(
                        this.state.modalData.closeDispatch.validationErrors
                          .reason
                      )}
                      reserveSpace={false}
                    />
                  </Modal.Content>
                  <Modal.Footer>
                    <Button
                      content={t("AccessCardInfo_Ok")}
                      onClick={this.forceCloseRailDispatch}
                    />
                    <Button
                      content={t("AccessCardInfo_Cancel")}
                      onClick={() => {
                        modalData.closeDispatch.isOpen = false;
                        modalData.closeDispatch.data.reason = "";
                        modalData.closeDispatch.validationErrors.reason = "";
                        this.setState({ modalData });
                      }}
                    />
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </TranslationConsumer>
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

export default connect(mapStateToProps)(RailDispatchComposite);

RailDispatchComposite.propTypes = {
  activeItem: PropTypes.object,
  shipmentSource: PropTypes.number,
  shipmentSourceCode: PropTypes.string,
  selectedShareholder: PropTypes.string,
  shipmentSourceCompartmentItems: PropTypes.array,
  shipmentSourceDetails: PropTypes.object,
  shipmentSourceFromSummary: PropTypes.bool,
  shipmentType: PropTypes.string,
  selectedSourceCode: PropTypes.array,
};
