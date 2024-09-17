import React, { Component } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { PrinterConfigurationSummaryComposite } from "../Summary/PrinterConfigurationSummaryComposite";
import PrinterConfigurationDetailsComposite from "../Details/PrinterConfigurationDetailsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import {
  functionGroups,
  fnPrinterConfiguration
} from "../../../JS/FunctionGroups";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";

class PrinterConfigurationComposite extends Component {

  state = {
    isDetails: false,
    isReadyToRender: false,
    operationsVisibilty: { add: false },
    selectedRow: {},
    selectedItems: [],
    data: {}
  };

  componentName = "PrinterConfigurationComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPrinterConfiguration
      );
      this.setState({
        operationsVisibilty
      });
      this.getPrinterConfigurationList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log("PrinterConfigurationComposite:Error occured on componentDidMount", error);
    }
    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage)
  }

  getPrinterConfigurationList() {
    try {
      axios(
        RestAPIs.GetPrinterConfigurationList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getPrinter List:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting Printer List:", error);
        });
    }
    catch (error) {
      console.log("PrinterConfigurationComposite : Error while getting Printer List:", error);
    }
  }

  componentWillUnmount = () => {

    // clear session storage

    Utilities.clearSessionStorage(this.componentName + "GridState");

    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));

  }

  handleRowClick = (item) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPrinterConfiguration
      );
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });

    } catch (error) {
      console.log("PrimeMoverComposite:Error occured on Row click", error);
    }
  };

  handleBack = () => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPrinterConfiguration
      );
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getPrinterConfigurationList(this.state.selectedShareholder);
    } catch (error) {
      console.log("PrinterConfigurationComposite:Error occured on Back click", error);
    }
  };

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("PrinterConfigurationComposite:Error occured on handleAdd", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnPrinterConfiguration
        );
        this.setState({ operationsVisibilty });
      }

      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            LocationCode: data.locationCode,
            PrinterName: data.printerName,
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
      console.log("PrinterConfigurationComposite:Error occured on savedEvent", error);
    }
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            onAdd={this.handleAdd}
            shrVisible={false}
            deleteVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <PrinterConfigurationDetailsComposite
              key="PrinterConfigurationDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></PrinterConfigurationDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <ErrorBoundary>
            <PrinterConfigurationSummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              exportRequired={true}
              exportFileName="PrinterConfigurationList"
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
            ></PrinterConfigurationSummaryComposite>
          </ErrorBoundary>
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

export default connect(mapStateToProps)(PrinterConfigurationComposite);

PrinterConfigurationComposite.propTypes = {
  activeItem: PropTypes.object,
};
