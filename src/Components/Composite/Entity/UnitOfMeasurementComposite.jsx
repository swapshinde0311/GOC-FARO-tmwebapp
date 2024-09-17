import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { UnitOfMeasurementSummaryComposite } from "../Summary/UnitOfMeasurementSummaryComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";

class UnitOfMeasurementComposite extends Component {
  state = {
    data: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      this.setState({
        operationsVisibilty,
      });
      this.getUOMDetailsList();
    } catch (error) {
      console.log(
        "UnitOfMeasurementComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getUOMDetailsList() {
    axios(
      RestAPIs.GetUOMDetailsList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getUOMDetailsList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting UOMDetailsList:", error);
      });
  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shrVisible={false}
            addVisible={false}
            deleteVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <ErrorBoundary>
            <UnitOfMeasurementSummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
            ></UnitOfMeasurementSummaryComposite>
          </ErrorBoundary>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
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

export default connect(mapStateToProps)(UnitOfMeasurementComposite);

UnitOfMeasurementComposite.propTypes = {
  activeItem: PropTypes.object,
};
