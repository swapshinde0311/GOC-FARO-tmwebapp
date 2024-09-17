import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { connect } from "react-redux";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as Utilities from "../../../JS/Utilities";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import LanguagesDetailComposite from "../Details/LanguagesDetailComposite";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";

class LanguagesComposite extends Component {
  state = {
    isReadyToRender: false,
    operationsVisibility: { add: false, delete: false, shareholder: false },
    selectedShareholder: "",
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.setState({
        isReadyToRender: true,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
    } catch (error) {
      console.log(
        "LanguagesComposite:Error occurred on componentDidMount",
        error
      );
    }
  }

  notifyEvent = (notification) => {
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
      console.log("LanguagesComposite: Error occurred on savedEvent", error);
    }
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibility={this.state.operationsVisibility}
            breadcrumbItem={this.props.activeItem}
            shrVisible={false}
            addVisible={false}
            deleteVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          />
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <LanguagesDetailComposite
            Key="Languages"
            onNotice={this.notifyEvent}
            selectedShareholder={this.state.selectedShareholder}
          ></LanguagesDetailComposite>
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

export default connect(mapStateToProps)(LanguagesComposite);

LanguagesComposite.propTypes = {
  activeItem: PropTypes.object,
};
