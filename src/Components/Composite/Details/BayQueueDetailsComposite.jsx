import React, { Component } from "react";
import { connect } from "react-redux";
import { TranslationConsumer } from "@scuf/localization";
import { Loader } from "@scuf/common";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import BayQueueComposite from "../Common/BayQueueComposite";
import { DragDropContext } from "react-beautiful-dnd";

class BayQueueDetailsComposite extends Component {
  refreshTimer = null;
  state = {
    bayData: [],
    isReadyToRender: false,
    isInitialLoad: true,
    lastUpdatedTime: "",
    isManualMode: true,
    refreshTime: 10000,
    selectedShipmentReceiptItem: {},
  };
  componentDidMount() {
    try {
      this.getBays();
      this.getBayAllocationType();
      this.getLookUpData();
    } catch (error) {
      console.log(
        "BayQueueDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillUnmount() {
    this.stopRefreshTimer();
  }

  startRefreshTimer = () => {
    this.refreshTimer = setInterval(() => {
      this.setState({ isReadyToRender: false }, () => {
        this.getBays();
      });
    }, this.state.refreshTime);
  };

  stopRefreshTimer = () => {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
    }
  };
  getBays() {
    try {
      axios(
        RestAPIs.GetBays,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let updatedtime =
            new Date().toLocaleDateString() +
            " " +
            new Date().toLocaleTimeString();
          var result = response.data;
          this.stopRefreshTimer();
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
                    if (Array.isArray(result.EntityResult.BayData.Table2)) {
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
                    }
                  });
                }
                bayAllocation.push(bay);
              });
            }
            this.setState({
              bayData: bayAllocation,
              isReadyToRender: true,
              isInitialLoad: false,
              lastUpdatedTime: updatedtime,
            });
          } else {
            this.setState({
              bayData: [],
              isReadyToRender: true,
              isInitialLoad: false,
              lastUpdatedTime: updatedtime,
            });
            console.log("Error in getBays:", result.ErrorList);
          }
          this.startRefreshTimer();
        })
        .catch((error) => {
          this.setState({
            bayData: [],
            isReadyToRender: true,
            isInitialLoad: false,
          });
          console.log("Error while getBays:", error);
        });
    } catch (error) {
      console.log("BayQueueDetailsComposite:Error occured on getBays", error);
    }
  }

  getBayAllocationType() {
    try {
      axios(
        RestAPIs.GetBayAllocationType,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isManual = true;
          if (result.IsSuccess === true) {
            if (result.EntityResult.toLowerCase() === "false") isManual = false;
          }
          this.setState({ isManualMode: isManual });
        })
        .catch((error) => {
          console.log("Error while getBayAllocationType:", error);
        });
    } catch (error) {
      console.log(
        "BayQueueDetailsComposite:Error occured on getBayAllocationType",
        error
      );
    }
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
          if (
            !isNaN(
              parseInt(result.EntityResult["BayQueueMonitorRefreshInterval"])
            )
          ) {
            this.setState({
              refreshTime: parseInt(
                result.EntityResult["BayQueueMonitorRefreshInterval"]
              ),
            });
          }
        }
      });
    } catch (error) {
      console.log(
        "BayQueueDetailsComposite:Error occured on getLookUpData",
        error
      );
    }
  }

  handleRefresh = () => {
    this.setState({ isReadyToRender: false }, () => {
      this.getBays();
    });
  };

  render() {
    return !this.state.isInitialLoad ? (
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
            <div className="bayQueueMonitorContainer">
              <DragDropContext>
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
                  isBayAllocation={false}
                ></BayQueueComposite>
              </DragDropContext>
            </div>
          </div>
        )}
      </TranslationConsumer>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(BayQueueDetailsComposite);
