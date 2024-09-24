import React, { Component } from "react";
import {
  functionGroups,
  fnOrder,
  fnKPIInformation,
  fnSBC,
  fnSBP,
} from "../../../JS/FunctionGroups";
import * as RestAPIs from "../../../JS/RestApis";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import "react-toastify/dist/ReactToastify.css";
import { OrderSummaryPageComposite } from "../Summary/OrderSummaryComposite";
import OrderDetailsComposite from "../Details/OrderDetailsComposite";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiOrderList } from "../../../JS/KPIPageName";
import * as Constants from "../../../JS/Constants";
import TruckShipmentComposite from "./TruckShipmentComposite";
import TransactionSourceSummaryOperations from "../Common/TransactionSourceSummaryOperations";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class OrderComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    toDate: "",
    fromDate: "",
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    data: {},
    dateError: "",
    orderKPIList: [],
    None: [],
    isLoadShipment: false,
    shipmentType: "",
    selectedCodes: [],
    isSBCEnable: false,
    isSBPEnable: false,
    showDeleteAuthenticationLayout: false,
  };

  componentName = "OrderComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnOrder
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
      this.getOrderList(
        this.props.userDetails.EntityResult.PrimaryShareholder,
        fromDate,
        toDate
      );
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
      this.getlookupValues();
    } catch (error) {
      console.log("OrderComposite:Error occured on ComponentDidMount", error);
    }
    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage)
  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage)
  }

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  }

  //Get KPI for order
  getKPIList(shareholder) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      var notification = {
        message: "",
        messageType: "critical",
        messageResultDetails: [],
      };
      let objKPIRequestData = {
        PageName: kpiOrderList,
        TransportationType: Constants.TransportationType.ROAD,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }],
      };
      axios(
        RestAPIs.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ orderKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ orderKPIList: [] });
            console.log("Error in order KPIList:", result.ErrorList);
            notification.messageResultDetails.push({
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: result.ErrorList[0],
            });
          }
          if (notification.messageResultDetails.length > 0) {
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting Order KPIList:", error);
        });
    }
  }
  handleDelete = () => {
    this.handleAuthenticationClose();
    //console.log("Clicked Delete", this.state.selectedItems);
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      let deleteOrderKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        let shCode = this.state.selectedShareholder;
        let OrderCode = this.state.selectedItems[i]["Common_Code"];
        let keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.orderCode, Value: OrderCode }],
        };
        deleteOrderKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteOrder,
        Utilities.getAuthenticationObjectforPost(
          deleteOrderKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          let isRefreshDataRequire = result.isSuccess;

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

          let notification = Utilities.convertResultsDatatoNotification(
            result,
            "OrderInfo_DeletionStatus",
            ["OrderCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getOrderList(
              this.state.selectedShareholder,
              this.state.fromDate.toISOString(),
              this.state.toDate.toISOString()
            );
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
              messageResult.keyFields[0] = "ShipmentOrdertList_OrderCode";
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
      console.log("OrderComposite:Error occured on handleDelet", error);
    }
  };

  getOrderList(shareholder, startRange, endRange) {
    this.setState({ isReadyToRender: false });
    let fromDate = new Date(startRange);
    let toDate = new Date(endRange);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);

    let obj = {
      ShareholderCode: shareholder,
      startRange: fromDate,
      endRange: toDate,
    };

    axios(
      RestAPIs.GetOrderListForRole,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: {}, isReadyToRender: true });
          console.log("Error in OrderListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: {}, isReadyToRender: true });
        console.log("Error while getting Order List:", error);
      });
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
      this.getOrderList(
        shareholder,
        this.state.fromDate.toISOString(),
        this.state.toDate.toISOString()
      );
      this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "OrderComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  handleAdd = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;

      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("OrderComposite:Error occured on handleAdd", error);
    }
  };

  handleRowClick = (item) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnOrder
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnOrder
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("OrderComposite:Error occured on Row click", error);
    }
  };

  handleSelection = (items) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };

      let isReady =
        items.findIndex(
          (x) =>
            Constants.orderStatus[x.ShipmentGridOrder_Status] !==
            Constants.orderStatus.NOT_SCHEDULED
        ) >= 0
          ? false
          : true;

      operationsVisibilty.delete =
        items.length > 0 &&
        isReady &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnOrder
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("OrderComposite:Error occured on handleSelection", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnOrder
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnOrder
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        let selectedItems = [
          {
            Common_Code: data.OrderCode,
            Common_Status: data.Active,
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
      console.log("OrderComposite:Error occured on savedEvent", error);
    }
  };

  handleOperationVisibility = (status) => {
    let operationsVisibilty = { ...this.state.operationsVisibilty };
    if (status === true) {
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnOrder
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnOrder
      );
      operationsVisibilty.shareholder = false;
    } else {
      operationsVisibilty.add = status;
      operationsVisibilty.delete = status;
      operationsVisibilty.shareholder = status;
    }

    this.setState({ operationsVisibilty });
  };

  handleBack = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnOrder
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getOrderList(
        this.state.selectedShareholder,
        this.state.fromDate.toISOString(),
        this.state.toDate.toISOString()
      );
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("OrderComposite:Error occured on Back click", error);
    }
  };

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
      this.setState({
        dateError: "",
        toDate: value.to,
        fromDate: value.from,
      });
    }
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
      this.getOrderList(
        this.state.selectedShareholder,
        this.state.fromDate.toISOString(),
        this.state.toDate.toISOString()
      );
    }
  };

  handleShipmentByProductPageClick = () => {
    let orderCodes = [];
    for (var i = 0; i < this.state.selectedItems.length; i++) {
      var OrderCode = this.state.selectedItems[i]["Common_Code"];
      orderCodes.push(OrderCode);
    }
    this.setState({
      isLoadShipment: true,
      shipmentType: "ShipmentByProduct",
      selectedCodes: orderCodes,
    });
  };

  handleShipmentByCompartmentPageClick = () => {
    let orderCodes = [];
    for (var i = 0; i < this.state.selectedItems.length; i++) {
      var OrderCode = this.state.selectedItems[i]["Common_Code"];
      orderCodes.push(OrderCode);
    }
    this.setState({
      isLoadShipment: true,
      shipmentType: "ShipmentByCompartment",
      selectedCodes: orderCodes,
    });
  };

  getlookupValues() {
    try {
      let sbcAdd = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnSBC
      );
      let sbpAdd = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnSBP
      );
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Order",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let isOrderEnable =
            result.EntityResult["EnableOrder"] === "0" ? false : true;
          if (isOrderEnable) {
            if (sbcAdd) this.setState({ isSBCEnable: true });
            if (sbpAdd) this.setState({ isSBPEnable: true });
          }
        }
      });
    } catch (error) {
      console.log("OrderComposite:Error occured on getLookUpData", error);
    }
  }


  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("Order Composite : Error in authenticateDelete");
    }
  };



  handleAuthenticationClose = () => {

    this.setState({
      showDeleteAuthenticationLayout: false,
    });
  };


  getFunctionGroupName() {
    if (this.state.showDeleteAuthenticationLayout)
      return fnOrder
  };

  getDeleteorEditMode() {
    if (this.state.showDeleteAuthenticationLayout)
      return functionGroups.remove;
    else
      return functionGroups.modify;
  };

  handleOperation() {

    if (this.state.showDeleteAuthenticationLayout)
      return this.handleDelete

  };

  render() {
    let isOrdersSelected = this.state.selectedItems.length > 0;
    return (
      <div>
        {this.props.shipmentSource === undefined ||
          this.props.shipmentSource === "" ||
          this.props.shipmentSource === null ? (
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
        ) : (
          ""
        )}

        {this.state.isDetails ? (
          <ErrorBoundary>
            <OrderDetailsComposite
              key="OrderDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              selectedShareholder={this.state.selectedShareholder}
              handleOperationVisibility={this.handleOperationVisibility}
            ></OrderDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isLoadShipment && this.state.shipmentType ? (
          <ErrorBoundary>
            <TruckShipmentComposite
              shipmentSource={Constants.shipmentFrom.Order}
              selectedSourceCode={this.state.selectedCodes}
              shipmentType={this.state.shipmentType}
              shipmentSourceFromSummary={true}
              selectedShareholder={this.state.selectedShareholder}
            ></TruckShipmentComposite>
          </ErrorBoundary>
        ) : (
          <>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.orderKPIList}
                  pageName="Orders"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            {this.state.isReadyToRender ? (
              <div
                className={
                  isOrdersSelected ? "showShipmentStatusRightPane" : ""
                }
              >
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
                    filterText="LoadOrders"
                  ></TMTransactionFilters>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="compositeTransactionList">
                    <OrderSummaryPageComposite
                      tableData={this.state.data.Table}
                      columnDetails={this.state.data.Column}
                      pageSize={
                        this.props.userDetails.EntityResult.PageAttibutes
                          .WebPortalListPageSize
                      }
                      exportRequired={true}
                      exportFileName="OrderList"
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
                    ></OrderSummaryPageComposite>
                  </div>
                </ErrorBoundary>
              </div>
            ) : (
              <LoadingPage message="Loading"></LoadingPage>
            )}
            {isOrdersSelected ? (
              <div>
                <TransactionSourceSummaryOperations
                  transportationType={Constants.TransportationType.ROAD}
                  handleShipmentByCompartmentPageClick={
                    this.handleShipmentByCompartmentPageClick
                  }
                  handleShipmentByProductPageClick={
                    this.handleShipmentByProductPageClick
                  }
                  isSBCEnable={this.state.isSBCEnable}
                  isSBPEnable={this.state.isSBPEnable}
                ></TransactionSourceSummaryOperations>
              </div>
            ) : (
              ""
            )}
          </>
        )}
        
        {this.state.showDeleteAuthenticationLayout
          ? (
            <UserAuthenticationLayout
              Username={this.props.userDetails.EntityResult.UserName}
              functionName={this.getDeleteorEditMode()}
              functionGroup={this.getFunctionGroupName()}
              handleClose={this.handleAuthenticationClose}
              handleOperation={this.handleOperation()}
            ></UserAuthenticationLayout>
          ) : null}

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

OrderComposite.propTypes = {
  activeItem: PropTypes.object,
};

export default connect(mapStateToProps)(OrderComposite);
