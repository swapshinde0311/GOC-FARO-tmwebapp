import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import TankManualEntryDetailsComposite from "../Details/TankManualEntryDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap-grid.css";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import "react-toastify/dist/ReactToastify.css";
import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";

class TankManualEntryComposite extends Component {
  state = {
    isReadyToRender: false,
    operationsVisibility: { add: false, delete: false, shareholder: false },
    selectedShareholder: "",
    refreshFlag: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.setState({
        isReadyToRender: true,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
        refreshFlag: {},
      });
    } catch (error) {
      console.log(
        "TankManualEntry: Error occurred on componentDidMount",
        error
      );
    }
  }

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      if (notification.messageType === "success") {
        // operationsVisibility.add = true;
        // operationsVisibility.delete = true;
        this.setState({ operationsVisibility });
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
      console.log("TankManualEntry: Error occurred on savedEvent", error);
    }
  };

  handleAdd = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.add = false;
      this.setState({ operationsVisibility, refreshFlag: {} });
    } catch (error) {
      console.log("TankManualEntry: Error occurred on handleAdd");
    }
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibility}
            breadcrumbItem={this.props.activeItem}
            onAdd={this.handleAdd}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          />
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <TankManualEntryDetailsComposite
            key="TankManualEntryDetails"
            onSaved={this.savedEvent}
            onRefresh={this.state.refreshFlag}
            selectedShareholder={this.state.selectedShareholder}
          />
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
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

export default connect(mapStateToProps)(TankManualEntryComposite);

TankManualEntryComposite.propTypes = {
  activeItem: PropTypes.object,
};
