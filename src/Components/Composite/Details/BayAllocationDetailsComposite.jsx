import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import {
  Icon,
  Button,
  Input,
  VerticalMenu,
  Modal,
  Tooltip,
} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import * as Constants from "../../../JS/Constants";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { Loader } from "@scuf/common";
import BayQueueComposite from "../Common/BayQueueComposite";

class BayAllocationDetailsComposite extends Component {
  state = {
    bayData: [],
    unAllocatedData: [],
    selectedUnallocatedData: "",
    selectedUnallocatedDataType: "",
    selectedUnallocatedShareholder: "",
    selectedShipmentReceiptItem: {},
    selectedShipmentReceiptBay: "",
    isSuggestBayModal: false,
    suggestBays: [],
    isManualMode: true,
    isSwitchBayTypeModal: false,
    isAutoAllocateModal: false,
    searchUnAllocatedDataResult: "",
    searchUnAllocatedReceiptResult: "",
    isReadyToRender: false,
    pageIndex: 1,
    lastUpdatedTime: "",
    pageSize: 1,
  };

  componentDidMount() {
    try {
      this.getUnallocatedShipmentsandReceipts();
      this.getBayAllocationType();
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }

  getBays = () => {
    axios(
      RestAPIs.GetBays,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let updatedtime =
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString();
        var result = response.data;
        if (result.IsSuccess === true) {
          let bayAllocation = [];
          if (Array.isArray(result.EntityResult.BayData.Table)) {
            result.EntityResult.BayData.Table.forEach((bay) => {
              bay.ShipmentReceiptItem = [];
              let allocatedList = [];
              if (Array.isArray(result.EntityResult.lstBayAllocationQueue)) {
                allocatedList =
                  result.EntityResult.lstBayAllocationQueue.filter(
                    (bayItem) => bayItem.BayCode === bay.BayCode
                  );
              }
              if (allocatedList.length > 0) {
                allocatedList[0].AllocationItems.sort((a, b) =>
                  a.QueueNumber > b.QueueNumber ? 1 : -1
                ).forEach((allocatedItem) => {
                  let shipmentReceiptItem =
                    result.EntityResult.BayData.Table2.filter(
                      (shipment) =>
                        (allocatedItem.ShipmentCode !== null &&
                          allocatedItem.ShipmentCode ===
                            shipment.ShipmentCode) ||
                        (allocatedItem.ReceiptCode !== null &&
                          allocatedItem.ReceiptCode === shipment.Code)
                    );
                  bay.ShipmentReceiptItem.push(shipmentReceiptItem[0]);
                });
              }
              bayAllocation.push(bay);
            });
          }
          this.setState({
            bayData: bayAllocation,
            isReadyToRender: true,
            selectedUnallocatedData: "",
            selectedUnallocatedDataType: "",
            selectedShipmentReceiptItem: {},
            selectedShipmentReceiptBay: "",
            lastUpdatedTime: updatedtime,
            selectedUnallocatedShareholder: "",
          });
        } else {
          this.setState({
            bayData: [],
            isReadyToRender: true,
            lastUpdatedTime: updatedtime,
          });
          console.log("Error in getBays:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ bayData: [], isReadyToRender: true });
        console.log("Error while getBays:", error);
      });
  };

  getUnallocatedShipmentsandReceipts() {
    axios(
      RestAPIs.GetUnallocatedShipmentsandReceipts,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ unAllocatedData: result.EntityResult.Table1 }, () => {
            this.getBays();
          });
        } else {
          this.setState({ unAllocatedData: [], isReadyToRender: true });
          console.log(
            "Error in getUnallocatedShipmentsandReceipts:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ unAllocatedData: [], isReadyToRender: true });
        console.log("Error while getUnallocatedShipmentsandReceipts:", error);
      });
  }

  getBayAllocationType() {
    axios(
      RestAPIs.GetBayAllocationType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        var isManual = true;
        if (result.IsSuccess === true) {
          if (result.EntityResult === "false") isManual = false;
        }
        this.setState({ isManualMode: isManual });
      })
      .catch((error) => {
        console.log("Error while getBayAllocationType:", error);
      });
  }

  handleSuggestBay() {
    try {
      let notification = {
        messageType: "critical",
        message: "BayAllocation_SuggestStatus",
        messageResultDetails: [],
      };
      if (
        this.state.selectedUnallocatedData !== "" &&
        this.state.selectedUnallocatedData !== null &&
        this.state.selectedUnallocatedShareholder !== ""
      ) {
        this.setState({ isReadyToRender: false });
        var keyCode = [
          {
            key: KeyCodes.shipmentCode,
            value: this.state.selectedUnallocatedData,
          },
          {
            key: KeyCodes.entityType,
            value: this.state.selectedUnallocatedDataType,
          },
        ];
        var obj = {
          ShareHolderCode: this.state.selectedUnallocatedShareholder,
          keyDataCode: KeyCodes.pipelineReceiptCode,
          KeyCodes: keyCode,
        };
        let notification = {
          messageType: "critical",
          message: "BayAllocation_SaveStatus",
          messageResultDetails: [
            {
              isSuccess: false,
              errorMessage: "",
            },
          ],
        };
        axios(
          RestAPIs.SuggestBayForShipment,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState({
              isSuggestBayModal: true,
              suggestBays: result.EntityResult,
              isReadyToRender: true,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ResultDataList[0].ErrorList[0];
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
        });
      } else {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "SuggestBay_UnselectItem",
        });
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleSuggestBay",
        error
      );
    }
  }

  handleSuggestBayModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isSuggestBayModal} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>{t("Suggested_Bays")}</h3>
                {(this.state.selectedUnallocatedDataType ===
                Constants.ExtendEntity.SHIPMENT
                  ? t("BayAllocationShipmentSearch_ShipmentCode")
                  : t("Receipt_Code")) +
                  " : " +
                  this.state.selectedUnallocatedData}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <h4>{t("BayAllocation_SuggestedBayList")}</h4>
                <div className="col col-lg-12">
                  {Array.isArray(this.state.suggestBays)
                    ? this.state.suggestBays.map((item) => (
                        <div>{item.BayCode}</div>
                      ))
                    : ""}
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("ReportConfiguration_btnClose")}
                className="shipmentRecordWeightOtherbuttons"
                onClick={() => {
                  this.setState({ isSuggestBayModal: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  handleAllocate() {
    try {
      let notification = {
        messageType: "critical",
        message: "BayAllocation_SaveStatus",
        messageResultDetails: [],
      };
      if (
        this.state.selectedUnallocatedData !== "" &&
        this.state.selectedUnallocatedData !== null &&
        this.state.selectedUnallocatedShareholder !== ""
      ) {
        let bayData = lodash.cloneDeep(this.state.bayData);
        var selectedBayList = bayData.filter(
          (item) => item.SelectedBay === true
        );
        if (selectedBayList.length !== 1) {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage:
              selectedBayList.length === 0
                ? "BayAllocation_BayUnselect"
                : "BayAllocation_BayMultiselect",
          });
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        } else {
          this.setState({ isReadyToRender: false });
          this.AllocateBay(
            this.state.selectedUnallocatedData,
            selectedBayList[0].BayCode,
            this.state.selectedUnallocatedDataType,
            this.state.selectedUnallocatedShareholder
          );
        }
      } else {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "AllocateBay_UnselectItem",
        });
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleAllocate",
        error
      );
    }
  }
  AllocateBay(shipmentCode, bayCode, entityType, shareholder) {
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
      ShareHolderCode: shareholder, //this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.pipelineReceiptCode,
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
          this.getUnallocatedShipmentsandReceipts();
        } else {
          this.setState({ isReadyToRender: true });
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

  handleDeAllocate() {
    try {
      var selectedData = lodash.cloneDeep(
        this.state.selectedShipmentReceiptItem
      );
      if (Object.keys(selectedData).length === 0) {
        let notification = {
          messageType: "critical",
          message: "BayDeAllocation_SavedStatus",
          messageResultDetails: [],
        };

        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "BayAllocation_DeAllocate_Unselect",
        });

        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      } else {
        var entityType = Constants.ExtendEntity.SHIPMENT;
        if (selectedData.ShipmentCode === null)
          entityType = Constants.ExtendEntity.RECEIPT;

        this.setState({ isReadyToRender: false });
        this.DeAllocateBay(
          selectedData.Code,
          entityType,
          this.state.selectedShipmentReceiptBay,
          selectedData.ShareholderCode
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleDeAllocate",
        error
      );
    }
  }

  DeAllocateBay(shipmentCode, entityType, bayCode, shareholder) {
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
      ShareHolderCode: shareholder, //this.props.userDetails.EntityResult.PrimaryShareholder,
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
          this.getUnallocatedShipmentsandReceipts();
        } else {
          this.setState({ isReadyToRender: true });
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
        console.log("Error while DeAllocateBay:", error);
      });
  }

  handleDragEnd = (data) => {
    try {
      let transaction = this.splitTransactionIdentifier(data.draggableId);
      if (this.state.isManualMode) {
        if (data.source !== null && data.destination !== null) {
          var entityType = Constants.ExtendEntity.SHIPMENT;
          if (
            data.source.droppableId !== "UnAllocatedShipment" &&
            data.destination.droppableId === "UnAllocatedShipment"
          ) {
            this.setState({ isReadyToRender: false });
            let bayData = lodash.cloneDeep(this.state.bayData);
            var deAllocatedList = bayData.filter(
              (item) => item.BayCode === data.source.droppableId
            );
            if (deAllocatedList.length > 0) {
              var deAllocateItem =
                deAllocatedList[0].ShipmentReceiptItem.filter(
                  (item) =>
                    item.Code === transaction.code &&
                    item.ShareholderCode === transaction.shareholder
                );
              if (deAllocateItem.length > 0) {
                if (deAllocateItem[0].ShipmentCode === null)
                  entityType = Constants.ExtendEntity.RECEIPT;
              }
            }
            this.DeAllocateBay(
              transaction.code,
              entityType,
              data.source.droppableId,
              transaction.shareholder
            );
          } else if (
            data.destination.droppableId !== "UnAllocatedShipment" &&
            data.source.droppableId === "UnAllocatedShipment"
          ) {
            this.setState({ isReadyToRender: false });
            let unAllocatedData = lodash.cloneDeep(this.state.unAllocatedData);
            var allocatedList = unAllocatedData.filter(
              (item) =>
                item.Code === transaction.code &&
                item.ShareholderCode === transaction.shareholder
            );
            if (allocatedList.length > 0) {
              if (allocatedList[0].ShipmentCode === null)
                entityType = Constants.ExtendEntity.RECEIPT;
            }
            this.AllocateBay(
              transaction.code,
              data.destination.droppableId,
              entityType,
              transaction.shareholder
            );
          }
        }
      } else {
        let notification = {
          messageType: "critical",
          message: "BayAllocation_SaveStatus",
          messageResultDetails: [
            {
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: "BayAllocation_ManualAllocation_NotAllowed",
            },
          ],
        };
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleDragEnd",
        error
      );
    }
  };

  handleItemClick = (code, shareholder) => {
    try {
      var entityType = Constants.ExtendEntity.SHIPMENT;
      let unAllocatedData = lodash.cloneDeep(this.state.unAllocatedData);
      var allocatedList = unAllocatedData.filter(
        (item) => item.Code === code && item.ShareholderCode === shareholder
      );
      if (allocatedList.length > 0) {
        if (allocatedList[0].ShipmentCode === null)
          entityType = Constants.ExtendEntity.RECEIPT;
      }
      this.setState({
        selectedUnallocatedData: code,
        selectedUnallocatedDataType: entityType,
        selectedUnallocatedShareholder: shareholder,
      });
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleItemClick",
        error
      );
    }
  };

  handleClearBay() {
    try {
      let notification = {
        messageType: "critical",
        message: "BayAllocation_ClearStatus",
        messageResultDetails: [],
      };

      let bayData = lodash.cloneDeep(this.state.bayData);
      var selectedBayList = bayData.filter((item) => item.SelectedBay === true);
      if (selectedBayList.length === 0 || selectedBayList.length > 1) {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage:
            selectedBayList.length === 0
              ? "BayAllocation_ClearBay_BayUnselect"
              : "BayAllocation_ClearBay_BayMultiselect",
        });
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      } else if (selectedBayList.length === 1) {
        if (selectedBayList[0].ShipmentReceiptItem.length > 0) {
          this.setState({ isReadyToRender: false });
          this.clearBay(selectedBayList[0].BayCode);
        } else {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "BayAllocation_ClearBay_EmptyBay",
          });
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        }
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleClearBay",
        error
      );
    }
  }

  clearBay(bayCode) {
    var keyCode = [
      {
        key: KeyCodes.bayCode,
        value: bayCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.pipelineReceiptCode,
      KeyCodes: keyCode,
    };
    let notification = {
      messageType: "critical",
      message: "BayAllocation_ClearStatus",
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
      RestAPIs.ClearBay,
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
          this.getUnallocatedShipmentsandReceipts();
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
        console.log("Error while clearBay:", error);
      });
  }

  handleBaySelect = (bayCode, data) => {
    try {
      let bayData = lodash.cloneDeep(this.state.bayData);
      let matchedBay = bayData.filter((data) => data.BayCode === bayCode);
      if (matchedBay.length > 0) {
        matchedBay[0].SelectedBay = data;
      }
      this.setState({ bayData });
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on onCheckboxChange",
        error
      );
    }
  };

  handleMoveStart() {
    try {
      var selectedData = lodash.cloneDeep(
        this.state.selectedShipmentReceiptItem
      );
      if (Object.keys(selectedData).length === 0) {
        let notification = {
          messageType: "critical",
          message: "BayAllocation_StartOperationStatus",
          messageResultDetails: [],
        };
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "BayAllocation_Select_AllocateShipment",
        });

        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      } else {
        var entityType = Constants.ExtendEntity.SHIPMENT;
        if (selectedData.ShipmentCode === null)
          entityType = Constants.ExtendEntity.RECEIPT;

        this.setState({ isReadyToRender: false });
        this.changeAllocatedItemPosition(
          selectedData.Code,
          this.state.selectedShipmentReceiptBay,
          entityType,
          Constants.BayQueuePositionType.Start,
          selectedData.ShareholderCode
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleMoveStart",
        error
      );
    }
  }

  handleMovePrevious() {
    try {
      var selectedData = lodash.cloneDeep(
        this.state.selectedShipmentReceiptItem
      );
      if (Object.keys(selectedData).length === 0) {
        let notification = {
          messageType: "critical",
          message: "BayAllocation_PreviousOperationStatus",
          messageResultDetails: [],
        };
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "BayAllocation_Select_AllocateShipment",
        });

        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      } else {
        var entityType = Constants.ExtendEntity.SHIPMENT;
        if (selectedData.ShipmentCode === null)
          entityType = Constants.ExtendEntity.RECEIPT;

        this.setState({ isReadyToRender: false });
        this.changeAllocatedItemPosition(
          selectedData.Code,
          this.state.selectedShipmentReceiptBay,
          entityType,
          Constants.BayQueuePositionType.MovePrevious,
          selectedData.ShareholderCode
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleMovePrevious",
        error
      );
    }
  }

  handleMoveNext() {
    try {
      var selectedData = lodash.cloneDeep(
        this.state.selectedShipmentReceiptItem
      );
      if (Object.keys(selectedData).length === 0) {
        let notification = {
          messageType: "critical",
          message: "BayAllocation_NextOperationStatus",
          messageResultDetails: [],
        };
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "BayAllocation_Select_AllocateShipment",
        });

        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      } else {
        var entityType = Constants.ExtendEntity.SHIPMENT;
        if (selectedData.ShipmentCode === null)
          entityType = Constants.ExtendEntity.RECEIPT;

        this.setState({ isReadyToRender: false });
        this.changeAllocatedItemPosition(
          selectedData.Code,
          this.state.selectedShipmentReceiptBay,
          entityType,
          Constants.BayQueuePositionType.MoveNext,
          selectedData.ShareholderCode
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleMoveNext",
        error
      );
    }
  }

  handleMoveEnd() {
    try {
      var selectedData = lodash.cloneDeep(
        this.state.selectedShipmentReceiptItem
      );
      if (Object.keys(selectedData).length === 0) {
        let notification = {
          messageType: "critical",
          message: "BayAllocation_EndOperationStatus",
          messageResultDetails: [],
        };
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "BayAllocation_Select_AllocateShipment",
        });

        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      } else {
        var entityType = Constants.ExtendEntity.SHIPMENT;
        if (selectedData.ShipmentCode === null)
          entityType = Constants.ExtendEntity.RECEIPT;

        this.setState({ isReadyToRender: false });
        this.changeAllocatedItemPosition(
          selectedData.Code,
          this.state.selectedShipmentReceiptBay,
          entityType,
          Constants.BayQueuePositionType.End,
          selectedData.ShareholderCode
        );
      }
    } catch (error) {
      console.log(
        "ManualBayAllocationComposite:Error occured on handleMoveEnd",
        error
      );
    }
  }
  changeAllocatedItemPosition(
    shipmentCode,
    bayCode,
    entityType,
    positionType,
    shareholder
  ) {
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
      {
        key: KeyCodes.positionType,
        value: positionType,
      },
    ];
    var obj = {
      ShareHolderCode: shareholder, //this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: keyCode,
    };
    let notification = {
      messageType: "critical",
      message:
        positionType === Constants.BayQueuePositionType.Start
          ? "BayAllocation_StartOperationStatus"
          : positionType === Constants.BayQueuePositionType.MovePrevious
          ? "BayAllocation_PreviousOperationStatus"
          : positionType === Constants.BayQueuePositionType.MoveNext
          ? "BayAllocation_NextOperationStatus"
          : "BayAllocation_EndOperationStatus",
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
      RestAPIs.ChangePosition,
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
          this.getUnallocatedShipmentsandReceipts();
        } else {
          this.setState({ isReadyToRender: true });
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
        console.log("Error while ChangeAllocatedItemPosition:", error);
      });
  }

  displaySwitchBayTypeModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isSwitchBayTypeModal} size="small">
            <Modal.Content>
              <div>
                <b>
                  {this.state.isManualMode
                    ? t("BayAllocation_AutoMode_Confirmation")
                    : t("BayAllocation_ManualMode_Confirmation")}
                </b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isSwitchBayTypeModal: false });
                }}
              />
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isSwitchBayTypeModal: false });
                  this.switchBayType();
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  handleSwitchMode() {
    this.setState({ isSwitchBayTypeModal: true });
  }

  switchBayType() {
    let notification = {
      messageType: "critical",
      message: "BayAllocation_SwitchedStatus",
      messageResultDetails: [
        {
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.SwitchBayType + "?isManual=" + this.state.isManualMode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getBayAllocationType();
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
        console.log("Error while switchBayType:", error);
      });
  }

  displayAutoAllocateModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isAutoAllocateModal} size="small">
            <Modal.Content>
              <div>
                <b>{t("BayAllocation_AutoAllocation_Confirmation")}</b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isAutoAllocateModal: false });
                }}
              />
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isAutoAllocateModal: false });
                  this.AutoAllocate();
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  handleAutoAllocate() {
    this.setState({ isAutoAllocateModal: true });
  }

  AutoAllocate() {
    this.setState({ isReadyToRender: false });
    let notification = {
      messageType: "critical",
      message: "BayAllocation_AutoAllocation_Status",
      messageResultDetails: [
        {
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.AutoBayAllocate +
        "?associatedShareHolders=" +
        this.props.userDetails.EntityResult.PrimaryShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getUnallocatedShipmentsandReceipts();
        } else {
          this.setState({ isReadyToRender: true });
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
        console.log("Error while handleAutoAllocate:", error);
      });
  }

  onUnAllocatedDataSearchChange = (value) => {
    this.setState({ searchUnAllocatedDataResult: value });
  };

  handleRefresh = () => {
    this.setState({ isReadyToRender: false }, () => {
      this.getUnallocatedShipmentsandReceipts();
    });
  };

  getShipmentTooltip(data) {
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            {data.ShipmentCode === null
              ? t("Receipt_Code")
              : t("ViewShipmentStatus_ShipmentCode")}{" "}
            : {data.Code} {<br></br>}
            {t("Receipt_Shareholder")} : {data.ShareholderCode}
            {<br></br>}
            {t("ViewReceipt_CarrierCompany")} : {data.CarrierCode}
            {<br></br>}
            {t("ViewReceipt_Vehicle")} : {data.VehicleCode}
            {<br></br>}
            {t("DriverInfo_Driver")} : {data.DriverCode}
            {<br></br>}
            {t("ScheduledDate")} :{" "}
            {new Date(data.ScheduledDate).toLocaleDateString()}
          </div>
        )}
      </TranslationConsumer>
    );
  }

  getLookUpData() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=BayAllocation",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (!isNaN(parseInt(result.EntityResult["PageSize"]))) {
            this.setState({
              pageSize: parseInt(result.EntityResult["PageSize"]),
            });
          }
        }
      });
    } catch (error) {
      console.log(
        "BayAllocationDetailsComposite:Error occured on getLookUpData",
        error
      );
    }
  }

  handleCellClick = (index, bayCode) => {
    try {
      let bayData = lodash.cloneDeep(this.state.bayData);
      let matchedBay = bayData.filter((data) => data.BayCode === bayCode);
      if (matchedBay.length > 0) {
        var selectedItem = matchedBay[0].ShipmentReceiptItem[index];
        this.setState({
          selectedShipmentReceiptItem: selectedItem,
          selectedShipmentReceiptBay: bayCode,
        });
      }
    } catch (error) {
      console.log(
        "BayAllocationDetailsComposite:Error occured on handleCellClick",
        error
      );
    }
  };

  getTransactionIdentifier(code, shareholder) {
    //let transaction = { code: code, shareholder: shareholder };
    return code + Constants.delimiter + shareholder;
  }
  splitTransactionIdentifier(transactionIdentifier) {
    try {
      const tran_array = transactionIdentifier.split(Constants.delimiter);
      return { code: tran_array[0], shareholder: tran_array[1] };
    } catch (error) {
      console.log(
        "BayAllocationDetailsComposite:Error occured on splitTransactionIdentifier",
        transactionIdentifier,
        error
      );
    }
  }

  render() {
    let { searchUnAllocatedDataResult, unAllocatedData } = this.state;
    let searchUnAllocatedDataResults = unAllocatedData.filter((values) => {
      return (
        values.Code.toLowerCase().includes(
          searchUnAllocatedDataResult.toLowerCase()
        ) ||
        values.VehicleCode.toLowerCase().includes(
          searchUnAllocatedDataResult.toLowerCase()
        ) ||
        (values.DriverCode !== null
          ? values.DriverCode.toLowerCase().includes(
              searchUnAllocatedDataResult.toLowerCase()
            )
          : "")
      );
    });

    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            {!this.state.isReadyToRender ? (
              <div className={`authLoading parameterLoader`}>
                <Loader
                  text=" "
                  className={`globalLoaderPositionPosition`}
                ></Loader>
              </div>
            ) : (
              ""
            )}
            <div className="bayAllocationContainer">
              <DragDropContext onDragEnd={this.handleDragEnd}>
                <div className="bayAllocationUnAllocatedDiv">
                  <div>
                    <Droppable droppableId={"UnAllocatedShipment"} type="Type1">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className="bayAllocationUnAllocatedDataDiv detailsContainer">
                            <Input
                              className="input-example"
                              placeholder={t("LoadingDetailsView_SearchGrid")}
                              search={true}
                              onChange={(data) =>
                                this.onUnAllocatedDataSearchChange(data)
                              }
                            />
                            <VerticalMenu>
                              {searchUnAllocatedDataResults.length > 0
                                ? searchUnAllocatedDataResults.map(
                                    (item, index) => (
                                      <ErrorBoundary>
                                        <Draggable
                                          draggableId={this.getTransactionIdentifier(
                                            item.Code,
                                            item.ShareholderCode
                                          )}
                                          index={index}
                                          shareholder={item.ShareholderCode}
                                          code={item.Code}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <VerticalMenu.Item
                                                style={{ zIndex: "999" }}
                                                className={
                                                  this.state
                                                    .selectedUnallocatedData ===
                                                  item.Code
                                                    ? "selectedUnalloctedShipment"
                                                    : "box"
                                                }
                                                onClick={() =>
                                                  this.handleItemClick(
                                                    item.Code,
                                                    item.ShareholderCode
                                                  )
                                                }
                                                icon="multiple-devices"
                                              >
                                                <div>
                                                  <div
                                                    style={{
                                                      float: "right",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    <icon
                                                      style={{
                                                        fontSize: "25px",
                                                        marginRight: "4px",
                                                      }}
                                                      className={
                                                        item.ShipmentCode ===
                                                        null
                                                          ? "icon-Unloading"
                                                          : "icon-Loading"
                                                      }
                                                    ></icon>
                                                    {item.Code}
                                                  </div>
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      float: "left",
                                                      paddingLeft: "11rem",
                                                    }}
                                                  >
                                                    <ErrorBoundary>
                                                      <Tooltip
                                                        element={
                                                          <span className="unallocatedShipmentInfoIcon">
                                                            <Icon
                                                              name="badge-info"
                                                              root="common"
                                                            />
                                                          </span>
                                                        }
                                                        content={this.getShipmentTooltip(
                                                          item
                                                        )}
                                                        size="mini"
                                                        position="right center"
                                                      ></Tooltip>
                                                    </ErrorBoundary>
                                                  </div>
                                                </div>
                                              </VerticalMenu.Item>
                                            </div>
                                          )}
                                        </Draggable>
                                      </ErrorBoundary>
                                    )
                                  )
                                : t("BayAllocation_NoDataFound")}
                            </VerticalMenu>
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>

                <div className="bayAllocationDiv">
                  <div bayAllocationDivContainer>
                    <BayQueueComposite
                      bayData={this.state.bayData}
                      onBaySelect={this.handleBaySelect}
                      isManualMode={this.state.isManualMode}
                      onRefresh={this.handleRefresh}
                      updatedTime={this.state.lastUpdatedTime}
                      onCellClick={this.handleCellClick}
                      selectedShipmentReceiptItem={
                        this.state.selectedShipmentReceiptItem
                      }
                      isBayAllocation={true}
                    ></BayQueueComposite>
                  </div>
                </div>
              </DragDropContext>
              {this.state.isSuggestBayModal
                ? this.handleSuggestBayModal()
                : null}
              {this.state.isSwitchBayTypeModal
                ? this.displaySwitchBayTypeModal()
                : null}
              {this.state.isAutoAllocateModal
                ? this.displayAutoAllocateModal()
                : null}
            </div>

            <div className="bayButtonPosition">
              <div className="row bayAllocationButtonRow">
                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 0.5% 0 0.5%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleSuggestBay()}
                >
                  <div>{t("SuggestBay")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 0.5% 0 0.5%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleAllocate()}
                >
                  <div>{t("BayAllocation_btnAllocate")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 0.5% 0 0.5%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleDeAllocate()}
                >
                  <div>{t("BayAllocation_btnDeAllocate")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 1% 0 1%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleClearBay()}
                >
                  <div>{t("ClearBay")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 1% 0 1%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleMoveStart()}
                >
                  <div>{t("BayAllocation_btnMoveToStart")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 0.5% 0 0.5%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleMovePrevious()}
                >
                  <div>{t("BayAllocation_btnMovePrevious")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 1% 0 1%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleMoveNext()}
                >
                  <div>{t("BayAllocation_btnMoveNext")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationButton"
                      : "bayAllocationButtonDisable"
                  }
                  style={{
                    padding: "0 1% 0 1%",
                    height: "22px",
                    border: "1px solid #c5c5c5",
                  }}
                  onClick={() => this.handleMoveEnd()}
                >
                  <div>{t("BayAllocation_btnMoveToEnd")}</div>
                </div>

                <div
                  className={
                    this.state.isManualMode
                      ? "bayAllocationLargeButtonDisable"
                      : "bayAllocationLargeButton"
                  }
                  style={{ height: "22px", border: "1px solid #c5c5c5" }}
                  onClick={() => this.handleAutoAllocate()}
                >
                  <div>{t("BayAllocation_btnAutoBayAllocation")}</div>
                </div>

                <div
                  className="bayAllocationLargeButton"
                  style={{ height: "22px", border: "1px solid #c5c5c5" }}
                  onClick={() => this.handleSwitchMode()}
                >
                  <div>
                    {this.state.isManualMode === true
                      ? t("BayAllocation_btnSwitchToAuto")
                      : t("BayAllocation_btnSwitchToManual")}
                  </div>
                </div>
              </div>
            </div>
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

export default connect(mapStateToProps)(BayAllocationDetailsComposite);
