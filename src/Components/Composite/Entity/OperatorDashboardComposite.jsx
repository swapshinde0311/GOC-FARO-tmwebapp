import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { OperatorDashboardSummaryComposite } from "../Summary/OperatorDashboardSummaryComposite";
import OperatorDashboardDetailsComposite from "../Details/OperatorDashboardDetailsComposite";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestApis from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";

class OperatorDashboardComposite extends Component {
  state = {
    operationsVisibilty: {},
    selectedShareholder: "",
    statesCount: {},
    DashboardConfig: { RefreshRate: 60000 },
  };

  componentDidMount() {
    this.setState({
      selectedShareholder:
        this.props.userDetails.EntityResult.PrimaryShareholder,
    });
    this.getDashboardOrderStatesCount();
  }

  getDashboardOrderStatesCount() {
    const { DashboardConfig } = this.state;
    const keyCode = [
      {
        key: KeyCodes.transportationType,
        value: this.props.activeItem.itemProps.transportationType.toUpperCase(),
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetDashboardOrderStatesCount,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        const statesCount = {};
        if (result.IsSuccess === true) {
          const countList = result.EntityResult;
          countList.forEach((countData) => {
            statesCount[countData.Code] = countData.Count.toLocaleString();
          });
          this.setState({ statesCount });
        } else {
          console.log(
            "Error in getDashboardOrderStatesCount:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting getDashboardOrderStatesCount:", error);
      });
    this.refreshTransactionsSummaryTimer = setTimeout(
      () => this.getDashboardOrderStatesCount(),
      parseInt(DashboardConfig.RefreshRate)
    );
  }

  componentWillUnmount() {
    if (this.refreshTransactionsSummaryTimer)
      clearTimeout(this.refreshTransactionsSummaryTimer);
  }

  onDelete = () => {};
  onShareholderChange = () => {};
  onAdd = () => {};

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.onShareholderChange}
            onDelete={this.onDelete}
            onAdd={this.onAdd}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>

        <ErrorBoundary>
          <OperatorDashboardSummaryComposite
            statesCount={this.state.statesCount}
          ></OperatorDashboardSummaryComposite>
          <OperatorDashboardDetailsComposite
            transportationType={this.props.activeItem.itemProps.transportationType.toUpperCase()}
          ></OperatorDashboardDetailsComposite>
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

export default connect(mapStateToProps)(OperatorDashboardComposite);

OperatorDashboardComposite.propTypes = {
  activeItem: PropTypes.object,
};
