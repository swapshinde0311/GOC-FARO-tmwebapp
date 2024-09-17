import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnProductAllocation,
} from "../../../JS/FunctionGroups";
import { ShareholderAllocationsSummaryPageComposite } from "../Summary/ShareholderAllocationsSummaryPageComposite";
import ShareholderAllocationDetailsComposite from "../Details/ShareholderAllocationDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import Error from "../../Error";
import UserAuthenticationLayout from "../Common/UserAuthentication";


class ProductAllocationComposite extends Component {

  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    data: {},
    isEnable: true,
    allocationType: "",
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
        this.props.selectedShareholder === null ||
        this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
      
        showAuthenticationLayout: false,

  };

  componentDidMount() {
    try {

      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLookUpData();

    } catch (error) {
      console.log("ProductAllocationComposite:Error occured on ComponentDidMount", error);
    }
  }


  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=ProductAllocation",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isEnable = true;
          let allocationType = result.EntityResult.AllocationEntity.toUpperCase();

          if (result.EntityResult.AllocationEntity.toUpperCase() === Constants.AllocationEntityType.CUSTOMER_AND_SHAREHOLDER)
            allocationType = Constants.AllocationEntityType.CUSTOMER
          else
            allocationType = result.EntityResult.AllocationEntity.toUpperCase();

          if (result.EntityResult.AllocationEntity.toUpperCase() === Constants.AllocationEntityType.SHAREHOLDER) {
            isEnable = false;
          }
          if (isEnable && result.EntityResult.EnableProductAllocation.toUpperCase() === "FALSE") {
            isEnable = false;
          }

          this.setState({ lookUpData: result.EntityResult, isEnable });

          if (isEnable) {
            var { operationsVisibilty } = { ...this.state };
            operationsVisibilty.add = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnProductAllocation
            );
            this.setState({
              operationsVisibilty,
              allocationType: allocationType
            }, () => {
              this.getProductAllocationList(
                this.state.selectedShareholder,
                allocationType
              );
            });

          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ShareholderAllocationComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getProductAllocationList(shareholder, allocationType) {
    try {

      axios(
        RestAPIs.GetShareholderAllocationList + "?ShareholderCode="
        + shareholder + "&allocationType=" + allocationType,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {

          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getProductAllocationList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting product allocation List:", error);
        });
    } catch (error) {
      console.log("Error while getting product allocation List:", error);
    }
  }

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;

      this.setState({
        isDetails: "true",
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("ProductAllocationComposite:Error occured on handleAdd", error);
    }
  };

  authenticateDelete = () => {
    try {
      let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showAuthenticationLayout });
      if (showAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("Product Allocation Composite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };


  handleDelete = () => {
    try {
      this.handleAuthenticationClose();
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deleteProductAllocationKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var shCode = this.state.selectedShareholder;
        var entityCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{
            Key: KeyCodes.entityType,
            Value: this.state.allocationType
          },
          {
            Key: KeyCodes.entityCode,
            Value: entityCode
          }],
        };
        deleteProductAllocationKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteShareholderAllocation,
        Utilities.getAuthenticationObjectforPost(
          deleteProductAllocationKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          console.log(response.data);
          var result = response.data;
          var isRefreshDataRequire = result.isSuccess;

          if (
            result.ResultDataList !== null &&
            result.ResultDataList !== undefined
          ) {
            var failedResultsCount = result.ResultDataList.filter(function (
              res
            ) {
              return !res.IsSuccess;
            }).length;

            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else isRefreshDataRequire = true;
          }

          var notification = Utilities.convertResultsDatatoNotification(
            result,
            "ProductAllocation_DeletionStatus",
            ["EntityCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getProductAllocationList(
              this.state.selectedShareholder,
              this.state.allocationType);
            // this.getKPIList(this.state.selectedShareholder);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = this.state.allocationType
                === Constants.AllocationEntityType.CUSTOMER ?
                "ShipmentCompDetail_CustomerCode" : "RailDispatchManualEntry_CarrierCode";
          });

          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.log("ProductAllocationComposite:Error occured on handleDelete", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnProductAllocation
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnProductAllocation
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("ProductAllocationComposite:Error occured on handleRowClick", error);
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
          fnProductAllocation
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("ProductAllocationComposite:Error occured on handleSelection", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification === null) {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnProductAllocation
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnProductAllocation
        );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      else {

        if (notification.messageType === "success") {
          operationsVisibilty.add = true;
          operationsVisibilty.delete = true;
          this.setState({ isDetailsModified: "true", operationsVisibilty });
        }
        if (notification.messageType === "success" && saveType === "add") {
          var selectedItems = [
            {
              Common_Code: data.EntityCode,
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
      }
    } catch (error) {
      console.log("ProductAllocationComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnProductAllocation
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getProductAllocationList(
        this.state.selectedShareholder,
        this.state.allocationType);
      // this.getKPIList();
    } catch (error) {
      console.log("ProductAllocationComposite:Error occured on Back click", error);
    }
  };

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
      });
      this.getProductAllocationList(
        shareholder,
        this.state.allocationType);
    } catch (error) {
      console.log(
        "ProductAllocationComposite:Error occured on handleShareholderSelectionChange",
        error
      );
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
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <ShareholderAllocationDetailsComposite
              key="ShareholderAllocationDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              allocationType={this.state.allocationType}
              selectedShareholder={this.state.selectedShareholder}
            ></ShareholderAllocationDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <ShareholderAllocationsSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="ShareholderAllocationList"
                columnPickerRequired={true}
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectionRequired={true}
                columnGroupingRequired={true}
                selectedItems={this.state.selectedItems}
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
                parentComponent={this.componentName}
              ></ShareholderAllocationsSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) :
          (
            <>
              {this.state.isEnable ? (
                <LoadingPage message="Loading"></LoadingPage>
              ) : (
                <Error errorMessage="ProductAllocation_Enable"></Error>
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

        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnProductAllocation}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></UserAuthenticationLayout>
        ) : null}

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

export default connect(mapStateToProps)(ProductAllocationComposite);

ProductAllocationComposite.propTypes = {
  activeItem: PropTypes.object,
};
