import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ErrorBoundary from "../../ErrorBoundary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { CustomerStockTransferSummaryComposite } from "../Summary/CustomerStockTransferSummaryComposite";
import CustomerStockTransferDetailsComposite from "../Details/CustomerStockTransferDetailsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as KeyCodes from "../../../JS/KeyCodes";
import Error from "../../Error";
import { functionGroups, fnCustomerAgreement } from "../../../JS/FunctionGroups";


class CustomerStockTransferComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    data: {},
    isEnable: true,

  };
  componentName = "CustomerStockTransferComponent";
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCustomerAgreement
      );
      this.setState({
        operationsVisibilty,
        selectedSealMaster:
          this.props.userDetails.EntityResult.PrimarySealmaster,
      });
      this.getLookUpData();
    } catch (error) {
      console.log(
        "CustomerStockTransferComposite:Error occured on componentDidMount",
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
  getLookUpData() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=CustomerInventory",
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            let isEnable = true;
            if (result.EntityResult.Enabled === "False") {
              isEnable = false;
            }
            this.setState({ isEnable });
            if (isEnable) {
              this.GetCustomerStockTransferList(this.props.userDetails.EntityResult.PrimaryShareholder);
            }
          } else {
            console.log("Error in getLookUpData: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("CustomerInventoryComposite: Error occurred on getLookUpData", error);
        });
    } catch (error) {
      console.log("CustomerInventoryComposite: Error occurred on getLookUpData", error);
    }
  }

  GetCustomerStockTransferList() {
    
    try {
      axios(
        RestAPIs.GetCustomerStockTransferList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let data = result.EntityResult
            if (Array.isArray(data.Table)) {
              data.Table.forEach(function (customerstock) {
                customerstock.CustomerAgreement_ToCustomerShareholderCode = customerstock.CustomerAgreement_ToCustomerShareholderCode + "( " + customerstock.RequestorShareHolderCode+")";
                customerstock.CustomerAgreement_FromCustomerShareholderCode = customerstock.CustomerAgreement_FromCustomerShareholderCode + "(" + customerstock.LendorShareHolderCode+")";
              })
              this.setState({ data, isReadyToRender: true });
            }
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in GetCustomerStockTransferList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting CustomerStockTransferList:", error);
        });
    } catch (err) {
      console.log("Error while getting CustomerStockTransferList:", err)
    }
  }
  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        data: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("customertransferComposite:Error occured on handleAdd", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnCustomerAgreement
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            CustomerAgreement_TransferReferenceCode: data.Code,
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
      console.log("customertransferComposite:Error occured on savedEvent", error);
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCustomerAgreement
      );
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.GetCustomerStockTransferList();
    } catch (error) {
      console.log("customertransferComposite:Error occured on Back click", error);
    }
  };
  handleRowClick = (item) => {
    
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCustomerAgreement
      );
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("customertransferComposite:Error occured on Row click", error);
    }
  };
  render() {
    return (
      <div>
        {this.state.isEnable ? (
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
        ) : ""
        }
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <CustomerStockTransferDetailsComposite
              key="SealMasterDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            >

            </CustomerStockTransferDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <ErrorBoundary>
              <CustomerStockTransferSummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              exportRequired={true}
              exportFileName="SealMasterList"
              columnPickerRequired={true}

              terminalsToShow={
                this.props.userDetails.EntityResult.PageAttibutes
                  .NoOfTerminalsToShow
              }
              columnGroupingRequired={true}
              onRowClick={this.handleRowClick}
              parentComponent={this.componentName}
              ></CustomerStockTransferSummaryComposite>
          </ErrorBoundary>
        ) : (
              <>
                {this.state.isEnable ? (
                  <LoadingPage message="Loading"></LoadingPage>
                ) : (
                  <Error errorMessage="CustomerInventoryFeatureNotEnabled"></Error>
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

export default connect(mapStateToProps)(CustomerStockTransferComposite);

CustomerStockTransferComposite.propTypes = {
  activeItem: PropTypes.object,
};
