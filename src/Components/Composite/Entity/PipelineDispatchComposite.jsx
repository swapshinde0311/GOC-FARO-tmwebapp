import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { PipelineDispatchSummaryPageComposite } from "../Summary/PipelineDispatchSummaryComposite";
import PipelineDispatchDetailsComposite from "../Details/PipelineDispatchDetailsComposite";
import axios from "axios";
import * as Constants from "./../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
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
import { functionGroups, fnPipelineDispatch, fnKPIInformation  } from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiPipelineDispatchList } from "../../../JS/KPIPageName";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import lodash from "lodash";
import PipelineDispatchManualEntryDetailsComposite from "../Details/PipelineDispatchManualEntryDetailsComposite";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Input, Button } from "@scuf/common";
import { pipelineDispatchStatusTimeAttributeEntity } from "../../../JS/AttributeEntity";
import { PipelineDispatchViewAuditTrailDetails } from "../../UIBase/Details/PipelineDispatchViewAuditTrailDetails";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PipelineDispatchComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
        this.props.selectedShareholder === null ||
        this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    data: {},
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    terminalCodes: [],
    pipelineDispatchKPIList: [],
    drawerStatus: false,
    pipelineDispatch: {},
    currentDispatchStatus: {},
    shipmentNextOperations: [],
    activityInfo: [],
    isManualEntry: false,
    UOMS: {},
    isMeterRequired: false,
    isTankRequired: true,
    commentsPopUp: false,
    remarks: "",
    attributeMetaDataList: [],
    auditTrailList: [],
    modAuditTrailList: [],
    isViewAuditTrail: false,
    showReport: false,
    isBonding: false,
    pipelineHeaderMeterOptions: [],

    showDeleteAuthenticationLayout: false,
     
  };

  componentName = "PipelineDispatchComponent";

  componentDidMount() {
    try {

      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineDispatch
      );
      this.getBondingInfo();
      let toDate = new Date();
      toDate.setHours(23, 59, 59);
      let fromDate = new Date();
      fromDate.setHours(0, 0, 0);
      this.setState({ fromDate: fromDate, toDate: toDate });
      toDate = toDate.toISOString();
      fromDate = fromDate.toISOString();

      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
        isViewAuditTrail: false,
      });
      this.getTerminalsList(this.state.selectedShareholder);
      this.getPipelineDispatchList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.GetShipmentActivityInfo();
    } catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on componentDidMount",
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

  //Get KPI for PipelineDispatchList
  getKPIList(shareholder) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    )
    if (KPIView === true) {
      var notification = {
        message: "",
        messageType: "critical",
        messageResultDetails: [],
      };
      let objKPIRequestData = {
        PageName: kpiPipelineDispatchList,
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
            this.setState({ pipelineDispatchKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ pipelineDispatchKPIList: [] });
            console.log("Error in pipeline KPIList:", result.ErrorList);
            notification.messageResultDetails.push({
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: result.ErrorList[0],
            });
          }
        })
        .catch((error) => {
          console.log("Error while getting PipelineDispatch KPIList:", error);
        });
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
        "PipelineDispatchComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  getPipelineDispatchList(shareholder) {
    try {
      this.setState({ isReadyToRender: false });
      let fromDate = new Date(this.state.fromDate);
      let toDate = new Date(this.state.toDate);
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);
      let obj = {
        startRange: fromDate,
        endRange: toDate,
        TransportationType: Constants.TransportationType.PIPELINE,
        ShareHolderCode: shareholder,
      };
      axios(
        RestAPIs.GetPipelineDispatchListForRole,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              data: result.EntityResult,
              isReadyToRender: true
            }, () => {
              if (
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
                    Constants.ShipmentActivityInfo.PIPELINE_DISPATCH_ENABLE_DELETE &&
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
                    updatedselectedItem[0].Common_Status.toUpperCase()
                  ) > -1 &&
                  Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.remove,
                    fnPipelineDispatch
                  );

                this.setState({
                  selectedItems: updatedselectedItem,
                  operationsVisibilty,
                });
                this.getPipelineDispatch(updatedselectedItem[0]);
              }
            }
            );
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log(
              "Error in GetPipelineRouteListForRole:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while GetPipelineRouteListForRole:", error);
        });
    }
    catch (error) {
      console.log("Error while GetPipelineRouteListForRole:", error);
    }
  }

  handleViewAuditTrail(dispatchCode, shCode, token, callback) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: dispatchCode
        },
        {
          key: KeyCodes.shareholderCode,
          value: shCode
        }
      ]
      var obj = {
        ShareHolderCode: shCode,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetPipelineDispatchtViewAuditTrailList,
        Utilities.getAuthenticationObjectforPost(
          obj,
          token
        )
      )
        .then((response) => {
          var result = response.data;
          callback(result);
        })
        .catch((error) => {
          console.log("Error while getting handleViewAuditTrail:", error);
        });
    } catch (error) {

    }
  }

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
        isManualEntry: false,
        isViewAuditTrail: false,
      });
    } catch (error) {
      console.log("PipelineDispatchComposite:Error occured on handleAdd");
    }
  };

  handleDelete = () => {
    
    this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deletePipelineDispatchKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var PipelineDispatchCode = this.state.selectedItems[i]["Common_Code"];
        var shCode = this.state.selectedShareholder;
        var KeyData = {
          ShareHolderCode: shCode,
          KeyCodes: [
            { Key: KeyCodes.pipelineDispatchCode, Value: PipelineDispatchCode },
          ],
        };
        deletePipelineDispatchKeys.push(KeyData);
      }


      axios(
        RestAPIs.DeletePipelineDispatch,
        Utilities.getAuthenticationObjectforPost(
          deletePipelineDispatchKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.IsSuccess;

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
            "PipelineDispatchList_ModalHeader",
            ["PipelineDispatchCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getPipelineDispatchList(shCode);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty });
          }
          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0) {
              messageResult.keyFields[0] = "PipelineDispatch_DispatchCode";
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
          console.log("Error occured while deleting:" + error);
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({ operationsVisibilty });
        });
    } catch (error) {
      console.log("PipelineDispatchComposite:Error occured on handleDelete");
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineDispatch
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
        isManualEntry: false,
        isViewAuditTrail: false,
      });
      this.getPipelineDispatchList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on Back click",
        error
      );
    }
  };

  onBack = () => {
    let operationsVisibilty = { ...this.state.operationsVisibilty };
    operationsVisibilty.add = true;
    operationsVisibilty.shareholder = true;
    this.setState({
      isManualEntry: false,
      isViewAuditTrail: false,
      isDetails: false,
      operationsVisibilty,
      isReadyToRender: false,
    });
    this.getPipelineDispatchList(this.state.selectedShareholder);
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty, activityInfo } = { ...this.state };

      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.PIPELINE_DISPATCH_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var dispatchDeleteStates = [];
      if (dispatchDeleteInfo !== undefined && dispatchDeleteInfo.length > 0)
        dispatchDeleteStates = dispatchDeleteInfo[0].ShipmentStates;


      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnPipelineDispatch
        );
        operationsVisibilty.delete = this.props.userDetails.EntityResult.IsWebPortalUser
          ? false
          : dispatchDeleteStates.indexOf(data.PipelineDispatchStatus.toUpperCase()) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnPipelineDispatch
          );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.PipelineDispatchCode,
            PipelineDispatchCode: data.PipelineDispatchCode,
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
      console.log(
        "PipelineDispatchComposite:Error occured on savedEvent",
        error
      );
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
      this.getPipelineDispatchList(this.state.selectedShareholder);
    }
  };

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
      });
      this.getPipelineDispatchList(shareholder);
      this.getTerminalsList(shareholder);
      //this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  handleAuthorizeToManualEntry(dispatchCode, shCode, token, callback) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: dispatchCode,
        }
      ];
      var obj = {
        ShareHolderCode: shCode,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.AuthorizePipelineDispatchManualEntry,
        Utilities.getAuthenticationObjectforPost(
          obj,
          token
        )
      )
        .then((response) => {
          var result = response.data;
          callback(result);
        })
        .catch((error) => {
          console.log("Error while AuthorizeToManualEntry:", error);
        });
    }
    catch (error) {
      console.log("Error in Authorise to manual Entry")
    }
  }

  handleAuthorizeToScadaUpdate(dispatchCode, shCode, token, callback) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: dispatchCode,
        }
      ];
      var obj = {
        ShareHolderCode: shCode,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.AuthorizeUpadatePipelineDispatchScada,
        Utilities.getAuthenticationObjectforPost(
          obj,
          token
        )
      )
        .then((response) => {
          var result = response.data;
          callback(result);
        })
        .catch((error) => {
          console.log("Error while AuthorizeToScadaUpdate:", error);
        });
    }
    catch (error) {
      console.log("Error in Authorise to Scada Update", error)
    }
  }

  handleOperationClick = (operation) => {
    let dispatch = lodash.cloneDeep(this.state.pipelineDispatch);

    let notification = {
      messageType: "critical",
      message: operation + "_status",
      messageResultDetails: [
        {
          keyFields: ["PipelineDispatch_DispatchCode"],
          keyValues: [dispatch.PipelineDispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    switch (operation) {
      case Constants.ViewAllPipelineDispatchOperations.Authorize_ManualEntry_Update:

        this.handleAuthorizeToManualEntry(
          dispatch.PipelineDispatchCode,
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineDispatchList(this.state.selectedShareholder);
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
      case Constants.ViewAllPipelineDispatchOperations.Authorize_Scada_Update:
        this.handleAuthorizeToScadaUpdate(
          dispatch.PipelineDispatchCode,
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineDispatchList(this.state.selectedShareholder);
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
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnTransactionReport:
        this.handlePrintTransaction(
          lodash.cloneDeep(this.state.pipelineDispatch),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineDispatchList(this.state.selectedShareholder);
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
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnViewTransactionReport:
        this.handleViewTransaction();
        break;

      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnAuditTrail:
        this.handleViewAuditTrail(
          dispatch.PipelineDispatchCode,
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              let modAuditTrailList = lodash.cloneDeep(result.EntityResult);
              let attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList.PIPELINEDISPATCHSTATUSTIME
              );

              for (let i = 0; i < modAuditTrailList.length; i++) {
                let dispatchStatus = modAuditTrailList[i].PipelineDispatchStatus.toUpperCase();
                if (dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.CLOSED) {
                  dispatchStatus = Constants.PipelineDispatchStatus.CLOSED;
                } else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.AUTHORIZED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.AUTHORIZED;
                } else if (dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.READY) {
                  dispatchStatus = Constants.PipelineDispatchStatus.READY;
                } else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.INPROGRESS
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.INPROGRESS;
                } else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.MANUALLY_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.MANUALLY_COMPLETED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.INITIATED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.INITIATED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.INTERRUPTED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.INTERRUPTED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.AUTO_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.AUTO_COMPLETED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.PARTIALLY_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.PARTIALLY_COMPLETED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.EXCESSIVELY_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.EXCESSIVELY_COMPLETED;
                }

                modAuditTrailList[i].PipelineDispatchStatus = dispatchStatus;

                modAuditTrailList[i].UpdatedTime =
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
              }

              let auditTrailList = lodash.cloneDeep(result.EntityResult);
              for (let i = 0; i < auditTrailList.length; i++) {
                auditTrailList[i].UpdatedTime =
                  new Date(
                    auditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    auditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
                if (
                  auditTrailList[i].PipelineDispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.AUTHORIZED
                )
                  auditTrailList[i].PipelineDispatchStatus = Constants.Pipeline_Dispatch_Status.AUTHORIZED
                auditTrailList[i].AttributesforUI =
                  this.formReadonlyCompAttributes(
                    auditTrailList[i].Attributes,
                    attributeMetaDataList
                  );
              }

              var { operationsVisibilty } = { ...this.state };
              operationsVisibilty.add = false;
              operationsVisibilty.delete = false;
              this.setState({
                operationsVisibilty,
                auditTrailList: auditTrailList,
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
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnManualEntry:
        this.getUoms();
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnClosed:
        this.setState({ commentsPopUp: true, })
        break;
      default:
        return;
    }
  };

  getPipelineMeter() {
    let dispatch = this.state.pipelineDispatch;
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineHeaderCode,
          value: dispatch.PipelineHeaderCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.userDetails.EntityResult.IsEnterpriseNode ?
            dispatch.TerminalCodes[0] : null,
        }
      ];
      var obj = {
        keyDataCode: KeyCodes.pipelineHeaderCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.GetPipelineHeader,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          let pipelineHeaderMeterOptions = [];
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null &&
              result.EntityResult.AssociatedMeterCodes !== null &&
              Array.isArray(result.EntityResult.AssociatedMeterCodes)) {
              pipelineHeaderMeterOptions = result.EntityResult.AssociatedMeterCodes;
            }
          }
          this.setState({ pipelineHeaderMeterOptions });
        })
        .catch((error) => {
          console.log("Error while getPipelineMeter:", error);
        });

    } catch (error) {
      console.log("Error while getPipelineMeter:", error);
    }
  }

  getBondingInfo() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Bonding",
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult["EnableBondingNon-Bonding"] !== undefined &&
              result.EntityResult["EnableBondingNon-Bonding"] !== null) {
              this.setState({
                isBonding: result.EntityResult["EnableBondingNon-Bonding"] === "TRUE" ? true : false,
              });
            }
          } else {
            console.log("Error in getBondingInfo: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "PipelineDispatchComposite: Error occurred on getBondingInfo",
            error
          );
        });
    }
    catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on geting Bonding Info Value",
        error
      );
    }
  }

  handlePrintTransaction = (dispatch, shCode, token, callback) => {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },

      {
        key: KeyCodes.pipelinePlanCode,
        value: dispatch.PipelineDispatchCode,
      },

      {
        key: KeyCodes.pipelinePlanType,
        value: Constants.PipeLineType.DISPATCH,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.pipelineDispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.PipelinePrintBOLReport,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while Print BOL Report:", error);
      });
  };


  handleViewTransaction = () => {
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
  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/PipelineDispatch";
    } else {
      path = "TM/" + Constants.TMReports + "/PipelineDispatch";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      ShareholderCode: this.state.selectedShareholder,
      PipelinePlanCode:
        this.state.selectedItems.length === 1
          ? this.state.selectedItems[0].Common_Code
          : this.state.selectedRow.Common_Code,
      TransactionType: Constants.PipeLineType.DISPATCH,
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

  formReadonlyCompAttributes(attributes, attributeMetaDataList) {
    let compAttributes = [];
    if (
      attributeMetaDataList !== null &&
      attributeMetaDataList !== undefined &&
      attributeMetaDataList.length > 0
    ) {
      attributeMetaDataList.forEach((att) => {
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

  getRefrenceSource() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=PipelineDispatch",
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.CustodyTransferReferenceSource === "0") {
              this.setState({
                isMeterRequired: true,
                isTankRequired: false,
                isManualEntry: true,
                isDetails: false
              });
            }
            else {
              this.setState({
                isMeterRequired: false,
                isTankRequired: true,
                isManualEntry: true,
                isDetails: false
              });
            }

          } else {
            console.log("Error in getLookUpData: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "PipelineDispatchComposite: Error occurred on getLookUpData",
            error
          );
        });
    }
    catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on geting RefrenceSourceLookUp Value",
        error
      );
    }
  }

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty, activityInfo } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineDispatch
      );
      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.PIPELINE_DISPATCH_ENABLE_DELETE &&
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
          item.Common_Status.toUpperCase()
        ) > -1 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPipelineDispatch
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
        "PipelineDispatchComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  getPipelineDispatch(selectedRow) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: selectedRow.Common_Code,
        },
        {
          key: KeyCodes.transportationType,
          value: Constants.TransportationType.PIPELINE
        },
      ];
      var obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetPipelineDispatch,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {

            this.setState({
              pipelineDispatch: result.EntityResult,
            },
              () => {
                this.getAttributes();
                this.getDispatchStatuses(selectedRow);
                this.getDispatchOperations();
                this.getPipelineMeter();
              });
          }
        })
        .catch((error) => {
          console.log("Error while getting pipelineDispatch:", error);
        });
    }
    catch (error) {
      console.log("PipelineDispatchComposite : Error in getting pipeline dispatch")
    }
  }

  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [pipelineDispatchStatusTimeAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
          });
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  getDispatchOperations() {
    try {
      const dispatch = lodash.cloneDeep(this.state.pipelineDispatch);
      let shipmentNextOperations = [];
      let updateEnable = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnPipelineDispatch
      );
      if (
        (dispatch.PipelineDispatchStatus.toUpperCase() ===
          Constants.PipelineDispatchStatuses.READY ||
          dispatch.PipelineDispatchStatus.toUpperCase() ===
            Constants.PipelineDispatchStatuses.PARTIALLY_COMPLETED) &&
        updateEnable
      ) {
        shipmentNextOperations.push("Authorize_ManualEntry_Update");
        shipmentNextOperations.push("Authorize_Scada_Update");
      }
      if (
        dispatch.PipelineDispatchStatus.toUpperCase() !==
          Constants.PipelineDispatchStatuses.CLOSED &&
        dispatch.PipelineDispatchStatus.toUpperCase() !==
          Constants.PipelineDispatchStatuses.READY &&
        updateEnable
      ) {
        shipmentNextOperations.push("PipelineDispatch_BtnManualEntry");
        shipmentNextOperations.push("PipelineDispatch_BtnClosed");
        // shipmentNextOperations.push("PipelineDispatch_BtnSubmit");
      }
      if (
        dispatch.PipelineDispatchStatus.toUpperCase() ===
        Constants.PipelineDispatchStatuses.CLOSED
      ) {
        shipmentNextOperations.push(
          "PipelineDispatchList_btnTransactionReport"
        );
        shipmentNextOperations.push(
          "PipelineDispatchList_btnViewTransactionReport"
        );
      }
      shipmentNextOperations.push("PipelineDispatch_BtnAuditTrail");

      this.setState({ shipmentNextOperations });
    } catch (error) {
      console.log("Error in getting Dispatch Current Operations");
    }
  }

  CloseDispatch() {
    try {
      var notification = {
        messageType: "critical",
        message: "PipelineTransaction_SavedMessage",
        messageResultDetails: [
          {
            keyFields: ["PipelineDispatch_DispatchCode"],
            keyValues: [this.state.pipelineDispatch.PipelineDispatchCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      let keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: this.state.pipelineDispatch.PipelineDispatchCode,
        },
        {
          key: "Remarks",
          value: this.state.remarks,
        },

      ];
      let obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.ClosePipelineDispatch , 
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
            this.getPipelineDispatchList(this.state.selectedShareholder);
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
          console.log("Error in closing the dispatch", error)
        });
    }
    catch (error) {
      console.log("PipelineDispatchDetails : Error in closing the dispatch", error)
    }
  }

  handleCommentsModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.commentsPopUp} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewPipelineDispatch_CloseHeader") +
                    " : " +
                    this.state.pipelineDispatch.PipelineDispatchCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.remarks}
                    // label={t("ViewShipment_Reason")}
                    reserveSpace={false}
                    onChange={(value) => {
                      this.setState({ remarks: value });
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
                  if (this.state.remarks === "") {
                    let notification = {
                      messageType: "critical",
                      message: "ViewPipelineDispatch_ShipmentClose",
                      messageResultDetails: [
                        {
                          keyFields: ["PipelineDispatch_DispatchCode"],
                          keyValues: [this.state.pipelineDispatch.PipelineDispatchCode],
                          isSuccess: false,
                          errorMessage: "AdditiveInjectorInfo_RemarkRequired",
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
                    this.setState({ commentsPopUp: false }, () => {
                      this.CloseDispatch();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    commentsPopUp: false,
                    remarks: lodash.cloneDeep(this.state.remarks),
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  getDispatchStatuses(selectedRow) {
    try {
      axios(
        RestAPIs.GetPipelineDispatchAllStatuses +
        "?shareholderCode=" +
        this.state.selectedShareholder +
        "&pipelineDispatchCode=" +
        selectedRow.Common_Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;

          this.setState({
            currentDispatchStatus: result.EntityResult,
          });
        })
        .catch((error) => {
          console.log("Error while getting getDispatchStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  handleSelection = (items) => {
    try {
      var { operationsVisibilty, drawerStatus, activityInfo } = { ...this.state };

      let dispatchDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.PIPELINE_DISPATCH_ENABLE_DELETE &&
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
              x.Common_Status.toUpperCase()
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
          fnPipelineDispatch
        );

      if (
        items.length === 1) {
        this.getPipelineDispatch(items[0]);
        if (items.length !== 1) {
          drawerStatus = true;
        } else {
          drawerStatus = false;
        }
        this.setState({ drawerStatus });
      }
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on handleSelection",
        error
      );
    }
  };

  getUoms() {
    try {
      axios(
        RestAPIs.GetUOMList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult.VOLUME)
            ) {
              this.setState({ UOMS: result.EntityResult }, () => {
                this.getRefrenceSource();
              });
            }
          } else {
            console.log("Error in GetUOMList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error in GetUOMList:", error);
        });
    }
    catch (error) {
      console.log("Error in GetUOMList", error)
    }
  }

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };


  handleAuthenticationClose = () => {
    
    this.setState({
      showDeleteAuthenticationLayout: false,
    });
  };

  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("Pipeline Dispatch Composite : Error in authenticateDelete");
    }
  };


  
  getFunctionGroupName() {
    if(this.state.showDeleteAuthenticationLayout )
      return fnPipelineDispatch
    
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
    
 };

  render() {
    let dispatchSelected = this.state.selectedItems.length === 1;
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>

        {this.state.isDetails ? (
          <ErrorBoundary>
            <PipelineDispatchDetailsComposite
              Key="PipelineDispatchDetails_PageTitle"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              terminalCodes={this.state.terminalCodes}
              selectedShareholder={this.state.selectedShareholder}
              handleAuthorizeToManualEntry={this.handleAuthorizeToManualEntry}
              handleAuthorizeToScadaUpdate={this.handleAuthorizeToScadaUpdate}
              handleViewAuditTrail={this.handleViewAuditTrail}
              handlePrintTransaction={this.handlePrintTransaction}
              handleViewTransaction={this.handleViewTransaction}
              activityInfo={this.state.activityInfo}
              isBonding={this.state.isBonding}
            ></PipelineDispatchDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isViewAuditTrail ? (
          <ErrorBoundary>
            <PipelineDispatchViewAuditTrailDetails
              DispatchCode={this.state.selectedItems[0].Common_Code}
              auditTrailList={this.state.auditTrailList}
              modAuditTrailList={this.state.modAuditTrailList}
              Attributes={
                this.state.auditTrailList !== undefined &&
                  this.state.auditTrailList.length > 0
                  ? this.state.auditTrailList[0].AttributesforUI
                  : []
              }
              handleBack={this.onBack}
            ></PipelineDispatchViewAuditTrailDetails>
          </ErrorBoundary>
        ) : this.state.isManualEntry ? (
          <ErrorBoundary>
            <TranslationConsumer>
              {(t) => (
                <TMDetailsHeader
                  entityCode={
                    this.state.pipelineDispatch.PipelineDispatchCode +
                    " - " +
                    t("LoadingDetailsEntry_Title")
                  }
                ></TMDetailsHeader>
              )}
            </TranslationConsumer>
            <PipelineDispatchManualEntryDetailsComposite
              handleBack={this.onBack}
              pipelineDispatch={this.state.pipelineDispatch}
              selectedShareholder={this.state.selectedShareholder}
              UOMS={this.state.UOMS}
              isMeterRequired={this.state.isMeterRequired}
              isTankRequired={this.state.isTankRequired}
              pipelineHeaderMeterOptions={this.state.pipelineHeaderMeterOptions}
            ></PipelineDispatchManualEntryDetailsComposite>
          </ErrorBoundary>
        ) : (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.pipelineDispatchKPIList}
                  pageName="PipelineDispatch"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <div className={
              dispatchSelected
                ? !this.state.drawerStatus
                  ? "showShipmentStatusRightPane"
                  : "drawerClose"
                : ""
            }>
              <ErrorBoundary>
                <TMTransactionFilters
                  dateRange={{ from: this.state.fromDate, to: this.state.toDate }}
                  dateError={this.state.dateError}
                  handleDateTextChange={this.handleDateTextChange}
                  handleRangeSelect={this.handleRangeSelect}
                  handleLoadOrders={this.handleLoadOrders}
                  filterText="LoadShipments"
                ></TMTransactionFilters>
              </ErrorBoundary>
              {this.state.isReadyToRender ? (
                <ErrorBoundary>
                  <PipelineDispatchSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    exportFileName="PipelineDispatchList"
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
                  ></PipelineDispatchSummaryPageComposite>
                </ErrorBoundary>
              ) : (
                <LoadingPage message="Loading"></LoadingPage>
              )}
            </div>
            {dispatchSelected ? (
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
                  currentStatuses={this.state.currentDispatchStatus}
                  handleDrawer={this.handleDrawer}
                  isDetails={false}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  webPortalAllowedOperations={[
                    "PipelineDispatchList_btnViewTransactionReport",
                    "PipelineDispatch_BtnAuditTrail"
                  ]}
                  isWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  unAllowedOperations={[
                    "Authorize_ManualEntry_Update",
                    "Authorize_Scada_Update",
                    "PipelineDispatch_BtnManualEntry",
                    "PipelineDispatch_BtnClosed",
                    "PipelineDispatch_BtnSubmit"
                  ]}
                  title={"ViewAllPipeline_Details"}
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
        <ErrorBoundary>

        {this.state.showDeleteAuthenticationLayout  ||
           this.state.showAuthorizeToLoadAuthenticationLayout  
          ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getDeleteorEditMode()}
            functionGroup={this.getFunctionGroupName()}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleOperation()}
          ></UserAuthenticationLayout>
        ) : null}

          <ToastContainer
            hideProgressBar={true}
            closeOnClick={false}
            closeButton={true}
            newestOnTop={true}
            position="bottom-right"
            toastClassName="toast-notification-wrap"
          />
        </ErrorBoundary>
        {this.state.commentsPopUp ? this.handleCommentsModal() : null}
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
)(PipelineDispatchComposite);

PipelineDispatchComposite.propTypes = {
  activeItem: PropTypes.object,
};
