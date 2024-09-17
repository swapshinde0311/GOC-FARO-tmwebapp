import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { UnAccountedTransactionTankSummaryComposite } from "../Summary/UnAccountedTransactionTankSummaryComposite";
import UnAccountedTransactionTankDetailsComposite from "../Details/UnAccountedTransactionTankDetailsComposite";
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
  fnUnAccountedTransactionTank,
} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";

class UnAccountedTransactionTankComposite extends Component {
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

  componentName = "UnAccountedTransactionTankComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      this.getUnAccountedTransactionTankList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnUnAccountedTransactionTank
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
      this.getUnAccountedTransactionTankList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
    } catch (error) {
      console.log(
        "UnaccountedTransactionTankComposite:Error occured on ComponentDidMount",
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
        selectedItems: [],
        operationsVisibilty,
      });
      this.getUnAccountedTransactionTankList(shareholder);
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  fillDetails(data) {
    try {
      data.Table.forEach((p) => {
        if (
          p.TankUnaccountedTransaction_UnAccountedGrossQuantity !== null &&
          p.TankUnaccountedTransaction_UnAccountedGrossQuantity !== ""
        )
          p.TankUnaccountedTransaction_UnAccountedGrossQuantity =
            p.TankUnaccountedTransaction_UnAccountedGrossQuantity.toLocaleString();
        if (
          p.TankUnaccountedTransaction_UnAccountedNetQuantity !== null &&
          p.TankUnaccountedTransaction_UnAccountedNetQuantity !== ""
        )
          p.TankUnaccountedTransaction_UnAccountedNetQuantity =
            p.TankUnaccountedTransaction_UnAccountedNetQuantity.toLocaleString();
        if (
          p.TankUnaccountedTransaction_Density !== null &&
          p.TankUnaccountedTransaction_Density !== ""
        )
          p.TankUnaccountedTransaction_Density =
            p.TankUnaccountedTransaction_Density.toLocaleString();
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
  getUnAccountedTransactionTankList(shareholder) {
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
        RestAPIs.GetUnAccountedTransactionTankList,
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
              "Error in GetUnAccountedTransactionTankList:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error while getting UnAccountedTransactionTank List:",
            error
          );
        });
    }
  }
  handleDateTextChange = (value, error) => {
    if (value === "")
      this.setState({ dateError: "", toDate: "", fromDate: "" });
    if (error !== null && error !== "")
      this.setState({
        dateError: "Common_InvalidDate",
        toDate: "",
        fromDate: "",
      });
    else {
      this.setState({ dateError: "", toDate: value.to, fromDate: value.from });
    }
  };
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
      this.getUnAccountedTransactionTankList(this.state.selectedShareholder);
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
        selectedRow: {},
      });
    } catch (error) {
      console.log(
        "UnAccountedTransactionTankComposite:Error occured on handleAdd"
      );
    }
  };
  handleBack = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnUnAccountedTransactionTank
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
      this.getUnAccountedTransactionTankList(this.state.selectedShareholder);
    } catch (error) {
      console.log("OrderComposite:Error occured on Back click", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnUnAccountedTransactionTank
        );
        operationsVisibilty.delete = false;
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      // if (notification.messageType === "success" && saveType === "add") {
      //   let selectedItems = [
      //     {
      //       Common_Code: data.OrderCode,

      //     },
      //   ];
      //   this.setState({ selectedItems });
      // }
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log("OrderComposite:Error occured on savedEvent", error);
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
            onAdd={this.handleAdd}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails ? (
          <ErrorBoundary>
            <UnAccountedTransactionTankDetailsComposite
              selectedRow={this.state.selectedRow}
              key="UnaccountedTransactionTankDetails"
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              validationErrors={this.state.validationErrors}
              genericProps={this.props.activeItem.itemProps}
            ></UnAccountedTransactionTankDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <TMTransactionFilters
                dateRange={{ from: this.state.fromDate, to: this.state.toDate }}
                dateError={this.state.dateError}
                handleDateTextChange={this.handleDateTextChange}
                handleRangeSelect={this.handleRangeSelect}
                handleLoadOrders={this.handleLoadOrders}
                filterText="LoadTransactionTank"
              ></TMTransactionFilters>
            </ErrorBoundary>
            {this.state.data.Table?
            <ErrorBoundary>
              <UnAccountedTransactionTankSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="UnAccountedTransactionTankList"
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
              ></UnAccountedTransactionTankSummaryComposite>
            </ErrorBoundary>: (
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

export default connect(mapStateToProps)(UnAccountedTransactionTankComposite);

UnAccountedTransactionTankComposite.propTypes = {
  activeItem: PropTypes.object,
};
