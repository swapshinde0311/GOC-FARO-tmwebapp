import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { connect } from "react-redux";
import axios from "axios";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import lodash from "lodash";
import SiteTreeView from "../Common/SiteTreeViewFolder/SiteTreeView";
import { SiteTreeViewUserActionsComposite } from "../Common/SiteTreeViewUserActionsComposite";

class SiteViewComposite extends Component {
  state = {
    operationsVisibilty: { terminal: true },
    terminalOptions: [],
    terminalList: [],
    selectedTerminal: "",
    isReadyToRender: false,
    terminalChange: false,
    activeTab: 0,
    transportationType: "",
  };

  componentDidMount() {
    try {
      this.setState({
        selectedTerminal: this.state.terminalOptions[0],
      });
      this.getTerminalList();
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.setState({ operationsVisibilty: { terminal: true } });
      } else {
        this.setState({ operationsVisibilty: { terminal: false } });
      }
    } catch (error) {
      console.log(
        "SiteViewComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }

  getTerminalList() {
    try {
      axios(
        RestAPIs.GetTerminals,
        Utilities.getAuthenticationObjectforPost(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          )
            this.setState({
              terminalOptions: result.EntityResult,
              isReadyToRender: true,
              activeTab: 0,
            });
          this.setState({ selectedTerminal: this.state.terminalOptions[0] });
          this.getSiteTreeView(this.state.selectedTerminal);
        }
      });
    } catch (err) {
      console.log("SiteViewComposite:Error occured on getTerminalsList", err);
    }
  }

  getSiteTreeView(selectedTerminal) {
    var transportationType = "";
    if (this.props.activeItem.itemProps !== undefined) {
      if (this.props.activeItem.itemProps.transportationType !== undefined) {
        transportationType = this.props.activeItem.itemProps.transportationType;
      }
    }
    var transportationtype = "";
    if (transportationType === "MARINE") {
      transportationtype = Constants.siteViewType.MARINE_SITEVIEW;
    }
    if (transportationType === "ROAD") {
      transportationtype = Constants.siteViewType.ROAD_SITEVIEW;
    }
    if (transportationType === "RAIL") {
      transportationtype = Constants.siteViewType.RAIL_SITEVIEW;
    }
    try {
      var keyCode = [
        {
          key: KeyCodes.siteViewType,
          value: transportationtype,
        },
        {
          key: KeyCodes.terminalCode,
          value: selectedTerminal,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.siteViewType,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetSiteViewTree,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        this.setState({ terminalList: [], isReadyToRender: true });
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            terminalList: lodash.cloneDeep(result.EntityResult),
            isReadyToRender: true,
            transportationtype: transportationType,
          });
        } else {
          this.setState({
            isReadyToRender: false,
            terminalList: [],
          });
        }
      });
    } catch (error) {
      console.log("SiteViewComposite:Error occured in getSiteTreeView", error);
    }
  }
  handleTabChange = (activeIndex) => {
    try {
      this.setState({ activeTab: activeIndex });
    } catch (error) {
      console.log(
        "SiteViewComposite: Error occurred on handleTabChange",
        error
      );
    }
  };
  handleTerminalSelectionChange = (terminal) => {
    try {
      this.setState({
        selectedTerminal: terminal,
        isReadyToRender: true,
        terminalChange: true,
        activeTab: 0,
      });
      this.getSiteTreeView(terminal);
    } catch (error) {
      console.log(
        "SiteViewComposite:Error occured on handleTerminalSelectionChange",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        this.setState({ operationsVisibilty });
      }
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );

      this.getSiteTreeView(this.state.selectedTerminal);
    } catch (error) {
      console.log("SiteViewComposite:Error occured on savedEvent", error);
    }
  };

  deleteEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        this.setState({ operationsVisibilty });
      }
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );

      this.getSiteTreeView(this.state.selectedTerminal);
    } catch (error) {
      console.log("SiteViewComposite:Error occured on deleteEvent", error);
    }
  };

  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <SiteTreeViewUserActionsComposite
            breadcrumbItem={this.props.activeItem}
            operationsVisibilty={this.state.operationsVisibilty}
            terminals={this.state.terminalOptions}
            selectedTerminal={this.state.selectedTerminal}
            onTerminalChange={this.handleTerminalSelectionChange}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></SiteTreeViewUserActionsComposite>
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="projectMasterList">
            <SiteTreeView
              terminalList={this.state.terminalList}
              selectedTerminal={this.state.selectedTerminal}
              onSaved={this.savedEvent}
              onDelete={this.deleteEvent}
              activeTab={this.state.activeTab}
              onTabChange={this.handleTabChange}
              transportationtype={this.state.transportationtype}
            ></SiteTreeView>
          </div>
        </ErrorBoundary>
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

SiteViewComposite.propTypes = {
  activeItem: PropTypes.object,
};

export default connect(mapStateToProps)(SiteViewComposite);
