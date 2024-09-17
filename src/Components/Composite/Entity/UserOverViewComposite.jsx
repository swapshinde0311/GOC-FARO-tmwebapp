import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import { TranslationConsumer } from "@scuf/localization";
import { kpiDriverPortal } from "../../../JS/KPIPageName";
import axios from "axios";
import "@grapecity/wijmo.styles/wijmo.css";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { Notification } from "@scuf/common";
import RoadSummaryComposite from "./RoadSummaryComposite";
import CommonMessageModal from "../../UIBase/Common/CommonMessageModal";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";

class UserOverViewComposite extends Component {
  state = {
    terminalMessageList: [],
    toastMessages: [],
    isShowToastMessage: false,
    showSummaryPage: false,
    isShipment: true,
    pendingShipmentCount: 0,
    pendingReceiptCount: 0,
    terminalMsgRefreshInterval: 30,
    bayQueueInfoRefreshInterval: 60,
    kpiList: [],
    showTipModal: false,
    tipSuccess: false,
    tipMessage: "",
    isKPILoading: true
  };

  componentDidMount() {
    try {
      this.getPendingTransactionCount();

      this.getTerminalMessage();
      this.getMobileLookupData();

      this.getKPIs();
    } catch (error) {
      console.log("Error occured in UserOverViewComposite ComponentDidMount", error);
    }
  }

  componentWillUnmount() {
    this.stopTerminalMessageTimer();
  }

  success(msg) {
    this.showMessage(true, true, msg);
  }

  failed(msg) {
    this.showMessage(true, false, msg);
  }

  showMessage(isShowTip, isSuccess, message) {
    this.setState({
      showTipModal: isShowTip,
      tipSuccess: isSuccess,
      tipMessage: message
    });
  }

  getPendingTransactionCount() {
    let json = {

    };

    axios(RestAPIs.GetPendingTransactionCount, Utilities.getAuthenticationObjectforPost(json, this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;
      if (result.IsSuccess === true) {
        this.setState({
          pendingShipmentCount: result.EntityResult.Table[0].PendingShipmentCount,
          pendingReceiptCount: result.EntityResult.Table[0].PendingReceiptCount
        });
      } else {
        this.failed(result.ErrorList[0]);
        console.log("Failed in RoadSummaryComposite getTransactionList:", result.ErrorList);
      }
    }).catch((error) => {
      this.failed("error");
      console.log("Error in RoadSummaryComposite getTransactionList:", error);
    });
  }

  startTerminalMessageTimer() {
    let time = parseInt(this.state.terminalMsgRefreshInterval);
    this.terminalMessageTimer = setInterval(() => {
      this.getTerminalMessage();
    }, time * 1000);
  }

  stopTerminalMessageTimer() {
    if (this.terminalMessageTimer != null) {
      clearInterval(this.terminalMessageTimer);
      this.terminalMessageTimer = null;
    }
  }

  getMobileLookupData() {
    axios(RestAPIs.GetLookUpData + "?LookUpTypeCode=Mobile", Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;
      let time = 30;
      let time2 = 60;
      if (result.IsSuccess === true) {
        time = parseInt(result.EntityResult.TerminalMessageRefreshInterval);
        time2 = parseInt(result.EntityResult.UserBayQueueInfoRefreshInterval);
      }

      this.setState({
        terminalMsgRefreshInterval: time,
        bayQueueInfoRefreshInterval: time2
      }, () => this.startTerminalMessageTimer());
    });
  } catch(error) {
    console.log("BayAllocationDetailsComposite:Error occured on getTerminalMessageRefreshInterval", error);
  }

  getTerminalMessage() {
    try {
      let messageList = [];

      axios(RestAPIs.GetLookUpData + "?LookUpTypeCode=TerminalMessage", Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          messageList.push(result.EntityResult.Message1);
          messageList.push(result.EntityResult.Message2);
          messageList.push(result.EntityResult.Message3);
          messageList.push(result.EntityResult.Message4);
          messageList.push(result.EntityResult.Message5);
        }

        messageList = messageList.filter(msg => msg.replace(/(^s*)|(s*$)/g, "").length !== 0);
        this.setState({
          terminalMessageList: messageList,
          isShowToastMessage: messageList.length > 0
        }, () => this.generateToastMessages());
      });
    } catch (error) {
      console.log("BayAllocationDetailsComposite:Error occured on getTerminalMessage", error);
    }
  }

  generateToastMessages() {
    let toastMessages = this.state.terminalMessageList.map(msg => {
      return <TranslationConsumer>
        {t => (
          <Notification severity="important" hasIcon={false}>
            {t(msg)}
          </Notification>
        )}
      </TranslationConsumer>
    });

    this.setState({ toastMessages: toastMessages });
  }

  gotoRoadSummaryPage(isShipment) {
    this.setState({
      showSummaryPage: true,
      isShipment: isShipment
    }, () => this.stopTerminalMessageTimer());
  }

  backFromSummaryPage() {
    this.setState({
      showSummaryPage: false
    }, () => this.startTerminalMessageTimer());
  }

  getKPIs = () => {
    let objKPIRequestData = {
      PageName: kpiDriverPortal,
      TransportationType: "ROAD",
      InputParameters: []
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
        // console.log(result);
        if (result.IsSuccess === true) {
          ;
          this.setState({ kpiList: result.EntityResult.ListKPIDetails, isKPILoading: false });
        } else {
          this.setState({ kpiList: [], isKPILoading: false });
          console.log("Error in Dashboard KPIList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ kpiList: [], isKPILoading: false });
        console.log("Error while getting Dashboard KPIList:", error);
      });
  }

  render() {
    const user = this.props.userDetails.EntityResult;

    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div>
              {this.state.showSummaryPage ? (
                <RoadSummaryComposite isShipment={this.state.isShipment} bayQueueInfoRefreshInterval={this.state.bayQueueInfoRefreshInterval}
                  backToHomePage={() => this.backFromSummaryPage()}></RoadSummaryComposite>
              ) : ""}

              {this.state.showSummaryPage ? "" : (
                <div className="mobile-margin-top-10">
                  <ErrorBoundary>
                    <div className="ui pl-1 mobile-align-items-start">
                      <div className="section mt-sm-2 mt-lg-0 mobile-padding-0-20">
                        <span className="icon-Driver mobile-margin-right-10"></span>
                        <span>
                          {t("Header_Welcome") + " " + user.Firstname}
                        </span>
                      </div>
                    </div>
                    <div className="mobile-pending-transaction">
                      <div className="mobile-pending-shipment-card" onClick={() => this.gotoRoadSummaryPage(true)}>
                        <div className="mobile-pending-transaction-text">
                          {t("TruckShipment")}
                        </div>
                        <div className="mobile-pending-transaction-number">
                          {this.state.pendingShipmentCount} {t("Pending")}
                        </div>
                      </div>
                      <div className="mobile-pending-receipt-card" onClick={() => this.gotoRoadSummaryPage(false)}>
                        <div className="mobile-pending-transaction-text">
                          {t("TruckReceipt")}
                        </div>
                        <div className="mobile-pending-transaction-number">
                          {this.state.pendingReceiptCount} {t("Pending")}
                        </div>
                      </div>
                    </div>
                    <div className="mobile-terminal-message">
                      {
                        this.state.isShowToastMessage ? this.state.toastMessages : ""
                      }
                    </div>
                    <div className="mb-3" style={{ paddingLeft: "20px", paddingRight: "15px" }}>
                      <ErrorBoundary>
                        {
                          this.state.isKPILoading ?
                            <LoadingPage message={"Loading"} /> :
                            <KPIDashboardLayout
                              kpiList={this.state.kpiList}
                              pageName={"DriverPortal"}
                              isChartExport={false}
                              isChartFullscreen={false}
                            />
                        }
                      </ErrorBoundary>
                    </div>
                  </ErrorBoundary>
                </div>
              )}

              <CommonMessageModal isSuccess={this.state.tipSuccess} isOpen={this.state.showTipModal} message={this.state.tipMessage}
                handleClose={() => { this.setState({ showTipModal: false }) }}></CommonMessageModal>
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(UserOverViewComposite);