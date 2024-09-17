import React, { Component } from "react";
import { SlotHeaderUserActionsComposite } from "../Common/SlotBook/SlotHeaderUserActionsComposite";
import SlotDetailsComposite from "../Details/SlotDetailsComposite";
import SlotSummaryComposite from "../Summary/SlotSummaryComposite";
import axios from "axios";
import * as Utilities from "../../../JS/Utilities";
import "../../../CSS/styles.css";
import dayjs from "dayjs";
import ErrorBoundary from "../../ErrorBoundary";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import lodash from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import {
  functionGroups,
  fnMarineReceipt,
  fnMarineShipmentByCompartment,
  fnSBC,
  fnSlotInformation,
  fnTruckReceipt,
} from "../../../JS/FunctionGroups";
import {
  slotInfoRoadShipment,
  slotInfoRoadReceipt,
  slotInfoMarineShipment,
  slotInfoMarineReceipt,
} from "../../../JS/AttributeEntity";

class SlotBookComposite extends Component {
  refreshTimer = null;

  state = {
    operationsVisibilty: {
      add: false,
      modify: false,
      cancel: false,
      shipments: false,
      receipts: false,
      terminal: true,
    },
    isDetails: false,
    selectedTerminal: { Key: { Code: "" }, Value: [] },
    terminals: [],
    shipmentsSummary: [],
    receiptsSummary: [],
    selectedDate: dayjs()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0), //new Date(),
    currentTabIndex: 0,
    isShipmentsRefreshing: true,
    isReceiptsRefreshing: true,
    slotConfigurations: [],
    attributeMetaDataList: [],
  };
  startRefreshTimer = () => {
    let refreshInterval = 5;
    try {
      let selectedConfigurations = this.state.slotConfigurations.filter(
        (sc) => sc.TerminalCode === this.state.selectedTerminal.Key.Code
      );
      if (
        selectedConfigurations.length > 0 &&
        selectedConfigurations[0].SlotParams.length > 0
      ) {
        let operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "RefreshInterval"
        );
        if (operationalParams.length > 0) {
          refreshInterval = operationalParams[0].Value;
        }
      }
    } catch (error) {
      console.log("Unable to fetch refresh Interval", error);
    }

    this.refreshTimer = setInterval(() => {
      //console.log("Summary Refreshing started " + refreshInterval + new Date()); //TODO:Remove after testing
      this.getTransactionsSummary(Constants.slotSource.SHIPMENT);
      this.getTransactionsSummary(Constants.slotSource.RECEIPT);
    }, refreshInterval * 60 * 1000);
  };
  stopRefreshTimer = () => {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      //console.log("Summary Refreshing stopped " + new Date()); //TODO:Remove after testing
    }
  };

  getAttributesMetaData() {
    try {
      let transportationType = this.getTransportationType();
      let attributeEntities = [];
      if (transportationType === Constants.TransportationType.ROAD) {
        attributeEntities = [slotInfoRoadShipment, slotInfoRoadReceipt];
      } else if (transportationType === Constants.TransportationType.MARINE) {
        attributeEntities = [slotInfoMarineShipment, slotInfoMarineReceipt];
      }
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          attributeEntities,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          //console.log(result.EntityResult);
          this.setState({
            attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
          });
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  handleDateChange = (unit, duration) => {
    // debugger;
    try {
      let selectedDate = this.state.selectedDate;
      let isdetails = this.state.isDetails;
      selectedDate = selectedDate.add(duration, unit);
      if (isdetails === false) {
        this.setState(
          {
            selectedDate,
            isShipmentsRefreshing: true,
            isReceiptsRefreshing: true,
          },
          () => {
            this.stopRefreshTimer();
            this.getTransactionsSummary(Constants.slotSource.SHIPMENT);
            this.getTransactionsSummary(Constants.slotSource.RECEIPT);
            this.startRefreshTimer();
          }
        );
      } else {
        this.setState({ selectedDate });
      }
    } catch (error) {
      console.log("SlotBookComposite:Error occured on handleDateChange", error);
    }
  };
  handleTerminalChange = (terminalCode) => {
    try {
      let terminals = this.state.terminals;
      let filteredTerminals = terminals.filter(
        (t) => t.Key.Code === terminalCode
      );
      let slotConfigurations = this.state.slotConfigurations;
      let selectedSlotConfigurations = slotConfigurations.filter(
        (sc) => sc.TerminalCode === terminalCode
      );
      if (filteredTerminals.length > 0) {
        this.setState(
          {
            selectedTerminal: filteredTerminals[0],
            isShipmentsRefreshing: true,
            isReceiptsRefreshing: true,
          },
          () => {
            this.stopRefreshTimer();
            if (
              selectedSlotConfigurations.length > 0 &&
              selectedSlotConfigurations[0].SlotParams.length > 0
            ) {
              this.getTransactionsSummary(Constants.slotSource.SHIPMENT);
              this.getTransactionsSummary(Constants.slotSource.RECEIPT);
              this.startRefreshTimer();
            } else {
              let notification = {
                messageType: "critical",
                message: "SlotConfigurationsEmpty",
                messageResultDetails: [],
              };

              this.setState({
                isShipmentsRefreshing: false,
                isReceiptsRefreshing: false,
                shipmentsSummary: [],
                receiptsSummary: [],
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
            }
          }
        );
      }
    } catch (error) {
      console.log(
        "SlotBookComposite:Error occured on handleTerminalChange",
        error
      );
    }
  };
  handleSlotBlockClick = (blockDate) => {
    try {
      let operationsVisibilty = lodash.cloneDeep(
        this.state.operationsVisibilty
      );
      operationsVisibilty.terminal = false;
      this.setState({
        selectedDate: blockDate,
        isDetails: true,
        operationsVisibilty,
      });
      this.stopRefreshTimer();
    } catch (error) {
      console.log(
        "SlotBookComposite:Error occured on handleTerminalChange",
        error
      );
    }
  };
  getInitialConfigurations() {
    this.getTerminals();
  }
  getTerminals() {
    let notification = {
      messageType: "critical",
      message: "TerminalList_NotAvailable",
      messageResultDetails: [],
    };
    axios(
      RestAPIs.GetTerminalDetailsForFeature + "0",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        //console.log(response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            this.setState(
              {
                terminals: result.EntityResult,
                selectedTerminal: result.EntityResult[0],
              },
              () => this.getSlotConfigurations()
            );
          } else {
            this.setState({
              isReceiptsRefreshing: false,
              isShipmentsRefreshing: false,
            });
            console.log("Error while getting Terminal List:", result);
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
        } else {
          this.setState({
            isReceiptsRefreshing: false,
            isShipmentsRefreshing: false,
          });
          console.log("Error while getting Terminal List:", result);
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
        console.log("Error while getting Terminal List:", error);
      });
  }
  getTransportationType() {
    var transportationType = Constants.TransportationType.ROAD;
    const { itemProps } = this.props.activeItem;
    if (itemProps !== undefined && itemProps.transportationType !== undefined) {
      transportationType = itemProps.transportationType;
    }
    return transportationType;
  }
  getSlotConfigurations() {
    //debugger;
    let notification = {
      messageType: "critical",
      message: "SlotConfigurationsEmpty",
      messageResultDetails: [],
    };
    axios(
      RestAPIs.GetSlotConfigurations + this.getTransportationType(),
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        // console.log(response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            this.setState(
              {
                slotConfigurations: result.EntityResult,
              },
              () => {
                if (result.EntityResult[0].SlotParams.length > 0) {
                  this.stopRefreshTimer();
                  this.getTransactionsSummary(Constants.slotSource.SHIPMENT);
                  // debugger;
                  this.getTransactionsSummary(Constants.slotSource.RECEIPT);
                  this.startRefreshTimer();
                } else {
                  this.setState({
                    isReceiptsRefreshing: false,
                    isShipmentsRefreshing: false,
                  });
                  toast(
                    <ErrorBoundary>
                      <NotifyEvent
                        notificationMessage={notification}
                      ></NotifyEvent>
                    </ErrorBoundary>,
                    {
                      autoClose:
                        notification.messageType === "success" ? 10000 : false,
                    }
                  );
                }
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
            console.log("Error while getting getSlotConfigurations:", result);
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
          console.log("Error while getting getSlotConfigurations:", result);
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

  getslotSummary(slotRequestInfo) {
    let notification = {
      messageType: "critical",
      message:
        slotRequestInfo.TransactionSource === Constants.slotSource.SHIPMENT
          ? "ShipmentSlotSummaryEmpty"
          : "ReceiptSlotSummaryEmpty",
      messageResultDetails: [],
    };

    axios(
      RestAPIs.GetSlotsSummary,
      Utilities.getAuthenticationObjectforPost(
        slotRequestInfo,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        // debugger;
        // console.log(response);

        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult.Table) &&
            result.EntityResult.Table.length > 0
          ) {
            // console.log("shipmentsSummary", result.EntityResult.Table);
            if (
              slotRequestInfo.TransactionSource ===
              Constants.slotSource.SHIPMENT
            ) {
              this.setState({
                shipmentsSummary: result.EntityResult.Table,
                isShipmentsRefreshing: false,
              });
            } else {
              this.setState({
                receiptsSummary: result.EntityResult.Table,
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
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
            console.log("Error while getting getSlotSummary:", result);
          }
        } else {
          if (
            slotRequestInfo.TransactionSource === Constants.slotSource.SHIPMENT
          ) {
            this.setState({ isShipmentsRefreshing: false });
          } else {
            this.setState({ isReceiptsRefreshing: false });
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
          console.log("Error while getting getSlotSummary:", result);
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
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
        console.log("Error while getting getSlotSummary:", error);
      });
  }

  getTransactionsSummary(transactionType) {
    //debugger;

    let isrequiretoInvoke =
      transactionType === Constants.slotSource.SHIPMENT
        ? this.state.operationsVisibilty.shipments
        : this.state.operationsVisibilty.receipts;
    if (isrequiretoInvoke) {
      let selectedDate = this.state.selectedDate;
      let selectedTerminal = this.state.selectedTerminal.Key.Code;
      let slotConfigurations = this.state.slotConfigurations;
      let selectedSlotConfigurations = slotConfigurations.filter(
        (sc) => sc.TerminalCode === selectedTerminal
      );

      if (selectedSlotConfigurations.length > 0) {
        let slotRequestInfo = {
          TerminalCode: selectedTerminal,
          TransportationType: this.getTransportationType(),
          TransactionSource: transactionType,
          Month: selectedDate.get("month") + 1,
          Year: selectedDate.get("year"),
        };
        this.getslotSummary(slotRequestInfo);
      } else {
        let notification = {
          messageType: "critical",
          message: "SlotConfigurationsEmpty",
          messageResultDetails: [],
        };
        if (transactionType === Constants.slotSource.SHIPMENT) {
          this.setState({ isShipmentsRefreshing: false });
        } else {
          this.setState({ isReceiptsRefreshing: false });
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
        console.log("Slot configurations not available for selected termianl");
      }
    }
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.setinitialAccessLevels();
      this.getAttributesMetaData();
      this.getInitialConfigurations();
    } catch (error) {
      console.log(
        "SlotBookComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  componentWillUnmount() {
    this.stopRefreshTimer();
  }
  setinitialAccessLevels() {
    let transportationType = this.getTransportationType();
    let fnShipment = fnSBC;
    let fnReceipt = fnTruckReceipt;
    let fnSlotView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnSlotInformation
    );

    switch (transportationType) {
      case Constants.TransportationType.ROAD:
        fnShipment = fnSBC;
        fnReceipt = fnTruckReceipt;
        break;
      case Constants.TransportationType.MARINE:
        fnShipment = fnMarineShipmentByCompartment;
        fnReceipt = fnMarineReceipt;
        break;
      default:
        fnShipment = fnSBC;
        fnReceipt = fnTruckReceipt;
        break;
    }

    let operationsVisibilty = lodash.cloneDeep(this.state.operationsVisibilty);
    operationsVisibilty.add = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.add,
      fnSlotInformation
    );
    operationsVisibilty.modify = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnSlotInformation
    );
    operationsVisibilty.cancel = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.remove,
      fnSlotInformation
    );
    operationsVisibilty.shipments =
      Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.view,
        fnShipment
      ) && fnSlotView;
    operationsVisibilty.receipts =
      Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.view,
        fnReceipt
      ) && fnSlotView;
    this.setState({ operationsVisibilty });
  }
  handleBackClick = () => {
    let operationsVisibilty = lodash.cloneDeep(this.state.operationsVisibilty);
    operationsVisibilty.terminal = true;
    this.setState({
      isDetails: false,
      isShipmentsRefreshing: true,
      isReceiptsRefreshing: true,
      operationsVisibilty,
    });
    this.stopRefreshTimer();
    this.getTransactionsSummary(Constants.slotSource.SHIPMENT);
    this.getTransactionsSummary(Constants.slotSource.RECEIPT);
    this.startRefreshTimer();
  };
  handleTabChange = (tabIndex) => {
    this.setState({ currentTabIndex: tabIndex });
  };

  render() {
    //debugger;
    //console.log(new Date("13:34"));
    return (
      <div>
        <ErrorBoundary>
          <SlotHeaderUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            terminals={this.state.terminals.map(function (a) {
              return a.Key.Code;
            })}
            //terminals={[]}
            selectedTerminal={this.state.selectedTerminal.Key.Code}
            onTerminalChange={this.handleTerminalChange}
            //onAdd={() => {}}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></SlotHeaderUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails ? (
          <ErrorBoundary>
            <SlotDetailsComposite
              selectedDate={this.state.selectedDate}
              terminal={this.state.selectedTerminal}
              slotConfigurations={this.state.slotConfigurations}
              //currentTabCode={this.state.currentTabCode}
              transportationType={
                this.props.activeItem.itemProps.transportationType !== undefined
                  ? this.props.activeItem.itemProps.transportationType
                  : Constants.TransportationType.ROAD
              }
              attributeMetaDataList={this.state.attributeMetaDataList}
              defaultTabIndex={this.state.currentTabIndex}
              operationsVisibilty={this.state.operationsVisibilty}
              onBackClick={this.handleBackClick}
              onTabChange={this.handleTabChange}
              onDateChange={this.handleDateChange}
            ></SlotDetailsComposite>
          </ErrorBoundary>
        ) : (
          <div className="slotLayoutOuterPane">
            <ErrorBoundary>
              <SlotSummaryComposite
                terminal={this.state.selectedTerminal.Key}
                transportationType={
                  this.props.activeItem.itemProps.transportationType !==
                  undefined
                    ? this.props.activeItem.itemProps.transportationType
                    : Constants.TransportationType.ROAD
                }
                shipmentsSummary={this.state.shipmentsSummary}
                receiptsSummary={this.state.receiptsSummary}
                selectedDate={this.state.selectedDate}
                operationsVisibilty={this.state.operationsVisibilty}
                isShipmentsRefreshing={this.state.isShipmentsRefreshing}
                isReceiptsRefreshing={this.state.isReceiptsRefreshing}
                slotConfigurations={this.state.slotConfigurations}
                defaultTabIndex={this.state.currentTabIndex}
                onDateChange={this.handleDateChange}
                onslotBlockClik={this.handleSlotBlockClick}
                onTabChange={this.handleTabChange}
              ></SlotSummaryComposite>
            </ErrorBoundary>
          </div>
        )}
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

export default connect(mapStateToProps)(SlotBookComposite);
SlotBookComposite.propTypes = {
  activeItem: PropTypes.object,
};
