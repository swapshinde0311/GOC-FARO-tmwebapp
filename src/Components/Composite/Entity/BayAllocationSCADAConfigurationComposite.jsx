import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as Utilities from "../../../JS/Utilities";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import ErrorBoundary from "../../ErrorBoundary";
import BayAllocationSCADAConfigurationDetailsComposite from "../Details/BayAllocationSCADAConfigurationDetailsComposite";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import { TranslationConsumer } from "@scuf/localization";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
class BayAllocationSCADAConfigurationComposite extends Component {
  state = {
    isReadyToRender: false,
    operationsVisibility: { add: false, delete: false, shareholder: false },
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.setState({
        isReadyToRender: true,
      });
    } catch (error) {
      console.log(
        "BayAllocationSCADAConfigurationComposite:Error occurred on componentDidMount",
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
      console.log(
        "BayAllocationSCADAConfigurationComposite: Error occurred on savedEvent",
        error
      );
    }
  };
    render() {

        return ( 
          <TranslationConsumer>
            {(t) => (
              <div>
                <ErrorBoundary>
                  <TMUserActionsComposite
                    operationsVisibility={this.state.operationsVisibility}
                    breadcrumbItem={this.props.activeItem}
                    handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                    addVisible={false}
                    deleteVisible={false}
                    shrVisible={false}
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  {this.state.isReadyToRender ? (
                    <BayAllocationSCADAConfigurationDetailsComposite
                      Key="SlotConfigurationDetail"
                      onNotice={this.notifyEvent}
                      genericProps={this.props.activeItem.itemProps}
                    ></BayAllocationSCADAConfigurationDetailsComposite>
                  ) : (
                    <LoadingPage message="Loading"></LoadingPage>
                  )}
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
            )}
          </TranslationConsumer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      userDetails: state.getUserDetails.userDetails,
      tokenDetails: state.getUserDetails.TokenAuth,
    };
  };
  
  export default connect(mapStateToProps)(BayAllocationSCADAConfigurationComposite);
  
  BayAllocationSCADAConfigurationComposite.propTypes = {
    activeItem: PropTypes.object,
  };
