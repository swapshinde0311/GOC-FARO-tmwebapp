import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { UnAccountedTransactionMeterSummaryComposite } from "../Summary/UnAccountedTransactionMeterSummaryComposite";
import UnAccountedTransactionMeterDetailsComposite from "../Details/UnAccountedTransactionMeterDetailsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import {
  functionGroups,
  fnUnAccountedTransactionMeter,
} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";

class UnAccountedTransactionMeterComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: true,
    isDetailsModified: false,
    operationsVisibilty: { add: true, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
  };

  componentName = "UnAccountedTransactionMeterComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      this.GetUnAccountedTransactionMeterList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnUnAccountedTransactionMeter
      );
      let toDate = new Date();
      toDate.setHours(23, 59, 59);
      let fromDate = new Date();
      fromDate.setHours(0, 0, 0);
      this.setState({ fromDate: fromDate, toDate: toDate });
      toDate = toDate.toISOString();
      fromDate = fromDate.toISOString();
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
    } catch (error) {
      console.log(
        "UnaccountedTransactionMeterComposite:Error occured on ComponentDidMount",
        error
      );
    }
    // clear session storage on window refresh event
    window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }

  componentWillUnmount = () => {
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      let { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
        operationsVisibilty,
      });
      this.GetUnAccountedTransactionMeterList(shareholder);
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  GetUnAccountedTransactionMeterList(shareholder) {
    let fromDate = new Date(this.state.fromDate);
    let toDate = new Date(this.state.toDate);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);
    let obj = {
      ShareholderCode: shareholder,
      startRange: fromDate,
      endRange: toDate,
    };
    if (shareholder !== undefined && shareholder !== "") {
      axios(
        RestAPIs.GetUnAccountedTransactionMeterList,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              data: this.fillDetails(result.EntityResult),
              isReadyToRender: true,
            });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log(
              "Error in GetUnAccountedTransactionMeterList:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error while getting UnAccountedTransactionMeter List:",
            error
          );
        });
    }
  }

  fillDetails(data) {
    try {
      data.Table.forEach((p) => {
        if (
          p.MeterUnaccountedTransaction_UnAccountedGrossQuantity !== null &&
          p.MeterUnaccountedTransaction_UnAccountedGrossQuantity !== ""
        )
          p.MeterUnaccountedTransaction_UnAccountedGrossQuantity =
            p.MeterUnaccountedTransaction_UnAccountedGrossQuantity.toLocaleString();
        if (
          p.MeterUnaccountedTransaction_UnAccountedNetQuantity !== null &&
          p.MeterUnaccountedTransaction_UnAccountedNetQuantity !== ""
        )
          p.MeterUnaccountedTransaction_UnAccountedNetQuantity =
            p.MeterUnaccountedTransaction_UnAccountedNetQuantity.toLocaleString();
      });
      this.setState({ data });
      return data;
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
  };
  handleLoadOrders = () => {
    //debugger;
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.GetUnAccountedTransactionMeterList(this.state.selectedShareholder);
    }
  };
  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;

      this.setState({
        isDetails: true,
        operationsVisibilty,
      });
      this.child.ReSetData();
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterComposite:Error occured on handleAdd"
      );
    }
  };
  onRef = (ref) => {
    this.child = ref;
  };
  handleBack = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnUnAccountedTransactionMeter
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        //selectedRow: {},
        //selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.GetUnAccountedTransactionMeterList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "UnAccountedTransactionMeterComposite:Error occured on Back click",
        error
      );
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnUnAccountedTransactionMeter
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnUnAccountedTransactionMeter
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
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
      console.log(
        "UnAccountedTransactionMeterComposite:Error occured on savedEvent",
        error
      );
    }
  };
  handleSelection = (items) => {
    try {
    } catch (error) {
      console.log("handleSelection:Error occured on handleSelection", error);
    }
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            onAdd={this.handleAdd}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails ? (
          <ErrorBoundary>
            <UnAccountedTransactionMeterDetailsComposite
              key="UnaccountedTransactionMeterDetails"
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              validationErrors={this.state.validationErrors}
              genericProps={this.props.activeItem.itemProps}
              onRef={this.onRef}
            ></UnAccountedTransactionMeterDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <TMTransactionFilters
                dateRange={{ from: this.state.fromDate, to: this.state.toDate }}
                dateError={this.state.dateError}
                handleRangeSelect={this.handleRangeSelect}
                handleLoadOrders={this.handleLoadOrders}
                filterText="LoadTransactionMeter"
              ></TMTransactionFilters>
            </ErrorBoundary>
            {this.state.data.Table ?
              <ErrorBoundary>
                <UnAccountedTransactionMeterSummaryComposite
                  tableData={this.state.data.Table}
                  columnDetails={this.state.data.Column}
                  pageSize={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize
                  }
                  exportRequired={true}
                  exportFileName="UnAccountedTransactionMeterList"
                  columnPickerRequired={true}

                  terminalsToShow={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .NoOfTerminalsToShow
                  }
                  selectionRequired={true}
                  columnGroupingRequired={true}
                  onSelectionChange={this.handleSelection}
                  onRowClick={this.handleRowClick}
                  parentComponent={this.componentName}
                ></UnAccountedTransactionMeterSummaryComposite>
              </ErrorBoundary> : (
                <LoadingPage message="Loading"></LoadingPage>
              )}
          </div>
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

export default connect(mapStateToProps)(UnAccountedTransactionMeterComposite);

UnAccountedTransactionMeterComposite.propTypes = {
  activeItem: PropTypes.object,
};
