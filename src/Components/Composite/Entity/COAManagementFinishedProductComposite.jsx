import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import COAManagementFinishedProductDetailsComposite from "../Details/COAManagementFinishedProductDetailsComposite";
import { COAManagementFinishedProductSummaryPageComposite } from "../Summary/COAManagementFinishedProductSummaryComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import Error from "../../Error";

class COAManagementFinishedProductComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    showAuthenticationLayout: false,
    isEnable: true,
  };

  componentName = "COAManagementFinishedProductList";

  getcoaManagementFinishedProductList(shareholder) {
    if (shareholder !== undefined && shareholder !== "") {
      axios(
        RestAPIs.GetCOAManagementFinishedProductListForRole +
          "?ShareholderCode=" +
          shareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log(
              "Error in GetCOAManagementFinishedProductListForRole:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error while getting COAManagementFinishedProduct List:",
            error
          );
        });
    }
  }
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getcoaManagementFinishedProductList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "COAManagementFinishedProductComposite:Error occured on Back click",
        error
      );
    }
  };
  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };

      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "COAManagementFinishedProductComposite:Error occured on handleRowClick",
        error
      );
    }
  };
  handleSelection = (items) => {
    try {
      this.setState({ selectedItems: items });
    } catch (error) {
      console.log(
        "COAManagementFinishedProductComposite:Error occured on handleSelection",
        error
      );
    }
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);

      this.getLookUpData();
    } catch (error) {
      console.log(
        "COAManagementComposite:Error occured on ComponentDidMount",
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
      this.getcoaManagementFinishedProductList(shareholder);
    } catch (error) {
      console.log(
        "COAManagementFinishedProductComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
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
            this.getcoaManagementFinishedProductList(
              this.props.userDetails.EntityResult.PrimaryShareholder
            );
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "COAManagementFinishedProductComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

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
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <COAManagementFinishedProductDetailsComposite
              key="COAManagementFinishedProductDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              genericProps={this.props.activeItem.itemProps}
            ></COAManagementFinishedProductDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <COAManagementFinishedProductSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="COAManagementFinishedProductList"
                columnPickerRequired={true}
                columnGroupingRequired={true}
                //selectedItems={this.state.selectedItems}
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
                parentComponent={this.componentName}
              ></COAManagementFinishedProductSummaryPageComposite>
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

export default connect(mapStateToProps)(COAManagementFinishedProductComposite);

COAManagementFinishedProductComposite.propTypes = {
  activeItem: PropTypes.object,
};
