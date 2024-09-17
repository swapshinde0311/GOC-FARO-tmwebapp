import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import BayQueueDetailsComposite from "../Details/BayQueueDetailsComposite";


class BayQueueMonitorComposite extends Component {
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
            <BayQueueDetailsComposite>

            </BayQueueDetailsComposite>
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
  
  export default connect(mapStateToProps)(BayQueueMonitorComposite);
  
  BayQueueMonitorComposite.propTypes = {
    activeItem: PropTypes.object,
  };
