import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import BayAllocationDetailsComposite from "../Details/BayAllocationDetailsComposite";

class ManualBayAllocationComposite extends Component {
  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            shrVisible={false}
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
          <ErrorBoundary>
            <BayAllocationDetailsComposite>
          </BayAllocationDetailsComposite>
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
    )
    }
}

const mapStateToProps = (state) => {
    return {
      userDetails: state.getUserDetails.userDetails,
      tokenDetails: state.getUserDetails.TokenAuth,
    };
  };
  
  export default connect(mapStateToProps)(ManualBayAllocationComposite);
  
  ManualBayAllocationComposite.propTypes = {
    activeItem: PropTypes.object,
  };
