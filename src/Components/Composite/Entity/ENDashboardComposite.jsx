import React, { Component } from "react";
import ENDashboardSummaryComposite from "../Summary/ENDashboardSummaryComposite";
import { connect } from "react-redux";
import axios from "axios";
import * as Utilities from "../../../JS/Utilities";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import "../../../CSS/styles.css";
import ENDashboardDetailsComposite from "../Details/ENDashboardDetailsComposite";
import "bootstrap/dist/css/bootstrap-grid.css";
import { ToastContainer } from "react-toastify";
import ENDashboardOverviewComposite from "./ENDashboardOverviewComposite";

const mapOptions = window["runConfig"].mapOptions;

class ENDashboardComposite extends Component {
  refreshTimer = null;
  state = {
    terminals: [],
    tpiList: [],
    //isDetails: false,
    screenType: 1, //1:Summary(TPI Map),2:TPI Details;3:Dashboard
    selectedTerminal: "",
  };

  componentDidMount() {
    try {
      this.getTerminalsInfo();
      this.getTPIInfo();
      this.startRefreshTimer();
    } catch (error) {
      console.log(
        "ENDashboardComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  componentWillUnmount() {
    this.stopRefreshTimer();
  }
  startRefreshTimer = () => {
    let refreshInterval = 5;
    if (
      mapOptions.refreshMinutes !== undefined &&
      mapOptions.refreshMinutes > 0
    ) {
      refreshInterval = mapOptions.refreshMinutes;
    }
    this.refreshTimer = setInterval(() => {
      console.log("Summary Refreshing started " + refreshInterval + new Date()); //TODO:Remove after testing
      this.getTerminalsInfo();
      this.getTPIInfo();
    }, refreshInterval * 60 * 1000);
  };
  stopRefreshTimer = () => {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      console.log("Summary Refreshing stopped " + new Date()); //TODO:Remove after testing
    }
  };
  getTerminalsInfo() {
    axios(
      RestAPIs.GetEnTerminalsData,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        // console.log("TerminalInfo", response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult.Table) &&
            result.EntityResult.Table.length > 0
          ) {
            this.setState({ terminals: result.EntityResult.Table });
          } else {
            console.log("Error while getting Terminal List:", result);
          }
        } else {
          console.log("Error while getting Terminal List:", result);
        }
      })
      .catch((error) => {
        console.log("Error while getting Terminal List:", error);
      });
  }

  getTPIInfo() {
    axios(
      RestAPIs.GetTPIInfo,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        // console.log("TPIInfo", response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            this.setState({ tpiList: result.EntityResult });
          } else {
            console.log("Error while getting TPIInfo:", result);
          }
        } else {
          console.log("Error while getting TPIInfo:", result);
        }
      })
      .catch((error) => {
        console.log("Error while getting TPIInfo:", error);
      });
  }
  handleDetailsClick = (terminal, screenType) => {
    this.setState({ selectedTerminal: terminal, screenType: screenType });
  };
  handleDashboardClick = (terminal, screenType) => {
    this.setState({ selectedTerminal: terminal, screenType: screenType });
  };
  handleBackClick = (screenType) => {
    this.setState({ screenType: screenType });
  };

  getScreen() {
    if (this.state.screenType === 1) {
      return (
        <ErrorBoundary>
          <ENDashboardSummaryComposite
            terminals={this.state.terminals}
            tpiList={this.state.tpiList}
            onDetailsClick={this.handleDetailsClick}
            onDashboardClick={this.handleDashboardClick}
          ></ENDashboardSummaryComposite>
        </ErrorBoundary>
      );
    } else if (this.state.screenType === 2) {
      return (
        <ErrorBoundary>
          <ENDashboardDetailsComposite
            //terminals={this.state.terminals}
            tpiList={this.state.tpiList}
            selectedTerminal={this.state.selectedTerminal}
            onBackClick={this.handleBackClick}
          ></ENDashboardDetailsComposite>
        </ErrorBoundary>
      );
    } else if (this.state.screenType === 3) {
      return (
        <ErrorBoundary>
          <ENDashboardOverviewComposite
            //terminals={this.state.terminals}
            //tpiList={this.state.tpiList}
            selectedTerminal={this.state.selectedTerminal}
            onBackClick={this.handleBackClick}
          ></ENDashboardOverviewComposite>
        </ErrorBoundary>
      );
    } else {
      return "";
    }
  }

  render() {
    return (
      <div>
        {this.getScreen()}
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

export default connect(mapStateToProps)(ENDashboardComposite);
