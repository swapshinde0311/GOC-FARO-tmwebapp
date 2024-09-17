import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { RailTransloadingSummaryPageComposite } from "../Summary/RailTransloadingSummaryComposite";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { functionGroups, fnMarineReceipt } from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import RailTransloadingDetailsComposite from "../Details/RailTransloadingDetailsComposite";
import Error from "../../Error";

class RailTransloadingComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    terminalCodes: [],
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    isEnable: true,
  };

  componentName = "RailTransloadingComponent";

  handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
  };

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

  handleLoadOrders = () => {
    var { operationsVisibilty } = { ...this.state };
    operationsVisibilty.delete = false;
    operationsVisibilty.shareholder = false;
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({
        dateError: "",
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
      });
      this.getRailReceipTransloadingtList(this.state.selectedShareholder);
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getMarineReceipTransloadingtList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "RailTransloadingComposite:Error occured on Back click",
        error
      );
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "RailTransloadingComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  handleSelection = (items) => {
    try {
      var { operationsVisibilty } = { ...this.state };

      operationsVisibilty.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnMarineReceipt
        );
      operationsVisibilty.delete = false;
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "RailTransloadingComposite:Error occured on handleSelection",
        error
      );
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
        operationsVisibilty.add = false;
        operationsVisibilty.delete = false;
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            MarineReceiptCode: data.Code,
            Common_Shareholder: data.ShareholderCode,
          },
        ];
        this.setState({ selectedItems });
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
        "RailTransloadingComposite:Error occured on savedEvent",
        error
      );
    }
  };

  getRailReceipTransloadingtList(shareholder) {
    let fromDate = new Date(this.state.fromDate);
    let toDate = new Date(this.state.toDate);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);
    let obj = {
      ShareholderCode: shareholder,
      startRange: fromDate,
      endRange: toDate,
      TransportationType: Constants.TransportationType.RAIL,
    };
    axios(
      RestAPIs.GetRailTransloadingForRole,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult != null &&
            result.EntityResult.Table != null
          ) {
            for (
              let index = 0;
              index < result.EntityResult.Table.length;
              index++
            ) {
              const element = result.EntityResult.Table[index];

              if (parseInt(element.NoOfUnloadingWagons.toString()) > 0) {
                element.ReceiptStatus = "UNLOADING";
              }
            }
          }
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error in getRailReceipTransloadingtListForRole:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getRailReceipTransloadingtList:", error);
      });
  }

  getTerminalsList(shareholder) {
    try {
      if (shareholder !== null && shareholder !== "") {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(
            [shareholder],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ terminalCodes: response.data.EntityResult });
          }
        });
      } else {
        this.setState({ terminalCodes: [] });
      }
    } catch (error) {
      console.log(
        "RailDispatchComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });

      this.getTransloading();
    } catch (error) {
      console.log(
        "RailTransloadingComposite:Error occured on componentDidMount",
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

  getTransloading() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Transloading",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        let isEnable = false;
        if (result.IsSuccess === true) {
          // let isTransloading = false;
          if (result.EntityResult.RAILEnable === "True") {
            isEnable = true;
          }
          this.setState({ isEnable });

          if (isEnable) {
            this.getTerminalsList(
              this.props.userDetails.EntityResult.PrimaryShareholder
            );
            this.getRailReceipTransloadingtList(
              this.props.userDetails.EntityResult.PrimaryShareholder
            );
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "MarineReceiptDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({ selectedShareholder: shareholder });
      this.getRailReceipTransloadingtList(shareholder);
      this.getTerminalsList(shareholder);
    } catch (error) {
      console.log(
        "RailTransloadingComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  render() {
    let loadingClass = "globalLoader";
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
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>

        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <RailTransloadingDetailsComposite
              Key="RailTransloadingDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              terminalCodes={this.state.terminalCodes}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              genericProps={this.props.activeItem.itemProps}
            ></RailTransloadingDetailsComposite>
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
                filterText="LoadTransloading"
              ></TMTransactionFilters>
            </ErrorBoundary>
            <ErrorBoundary>
              <RailTransloadingSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="RailTransloadingList"
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
              ></RailTransloadingSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <>
            {this.state.isEnable ? (
              <LoadingPage
                loadingClass={loadingClass}
                message="Loading"
              ></LoadingPage>
            ) : (
              <Error errorMessage="RailTransloadingDisabled"></Error>
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

export default connect(mapStateToProps)(RailTransloadingComposite);

RailTransloadingComposite.propTypes = {
  activeItem: PropTypes.object,
  selectedShareholder: PropTypes.string,
};
