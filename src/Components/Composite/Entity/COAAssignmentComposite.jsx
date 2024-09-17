import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import COAAssignmentDetailsComposite from "../Details/COAAssignmentDetailsComposite";
import { COAAssignmentSummaryPageComposite } from "../Summary/COAAssignmentSummaryComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import NotifyEvent from "../../../JS/NotifyEvent";
import axios from "axios";
import Error from "../../Error";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";

class COAAssignmentComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    selectedRow: {},
    selectedShareholder: "",
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    data: {},
    isEnable: true,
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
  };

  componentName = "COAAssignmentList";

  getcoaAssignmentList(shareholder) {
    if (shareholder !== undefined && shareholder !== "") {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.shareholder = true;
      let fromDate = new Date(this.state.fromDate);
      let toDate = new Date(this.state.toDate);
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);

      let obj = {
        ShareholderCode: shareholder,
        StartRange: fromDate,
        EndRange: toDate,
      };

      axios(
        RestAPIs.GetCOAAssignmentListForRole,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              data: result.EntityResult,
              isReadyToRender: true,
              operationsVisibilty,
            });
          } else {
            this.setState({
              data: [],
              isReadyToRender: true,
              operationsVisibilty,
            });
            console.log(
              "Error in GetCOAAssignmentListForRole:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({
            data: [],
            isReadyToRender: true,
            operationsVisibilty,
          });
          console.log("Error while getting COAAssignment List:", error);
        });
    }
  }

  handleBack = () => {
    try {
      this.setState({
        isDetails: "false",
        selectedRow: {},
        isReadyToRender: false,
      });
      this.getcoaAssignmentList(this.state.selectedShareholder);
    } catch (error) {
      console.log("COAAssignmentComposite:Error occured on Back click", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.shareholder = false;
      this.setState({
        operationsVisibilty,
        isDetails: "true",
        selectedRow: item,
      });
    } catch (error) {
      console.log(
        "COAAssignmentComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
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
      console.log("COAAssignmentComposite:Error occured on savedEvent", error);
    }
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLookUpData();
    } catch (error) {
      console.log(
        "COAAssignmentComposite:Error occured on ComponentDidMount",
        error
      );
    }

    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage);
  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage);
  };

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  };

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
      });
      this.getcoaAssignmentList(shareholder);
    } catch (error) {
      console.log(
        "COAAssignmentComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=COA",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isEnable = result.EntityResult.COAEnable.toUpperCase() === "TRUE";

          this.setState({ lookUpData: result.EntityResult, isEnable });
          if (isEnable) {
            this.setState({
              selectedShareholder:
                this.props.userDetails.EntityResult.PrimaryShareholder,
            });
            this.getcoaAssignmentList(
              this.props.userDetails.EntityResult.PrimaryShareholder
            );
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "COAAssignmentComposite: Error occurred on getLookUpData",
          error
        );
      });
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
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "", isReadyToRender: false });
      this.getcoaAssignmentList(this.state.selectedShareholder);
    }
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <COAAssignmentDetailsComposite
              key="COAAssignmentDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              genericProps={this.props.activeItem.itemProps}
            ></COAAssignmentDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <TMTransactionFilters
                dateRange={{
                  from: this.state.fromDate,
                  to: this.state.toDate,
                }}
                dateError={this.state.dateError}
                handleDateTextChange={this.handleDateTextChange}
                handleRangeSelect={this.handleRangeSelect}
                handleLoadOrders={this.handleLoadOrders}
                filterText="LoadShipments"
              ></TMTransactionFilters>
              <COAAssignmentSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="COAAssignmentList"
                columnPickerRequired={true}
                selectionRequired={false}
                columnGroupingRequired={true}
                onRowClick={this.handleRowClick}
                parentComponent={this.componentName}
              ></COAAssignmentSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <>
            {this.state.isEnable ? (
              <LoadingPage loadingClass="Loading"></LoadingPage>
            ) : (
              <Error errorMessage="COADisabled"></Error>
            )}
          </>
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

export default connect(mapStateToProps)(COAAssignmentComposite);

COAAssignmentComposite.propTypes = {
  activeItem: PropTypes.object,
};
