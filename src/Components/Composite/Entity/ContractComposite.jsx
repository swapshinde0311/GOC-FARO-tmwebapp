import React, { Component } from "react";
import {
  functionGroups,
  fnContract,
  fnKPIInformation,
  fnSBC,
  fnSBP,
  fnRailDispatch,
} from "../../../JS/FunctionGroups";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import { ContractSummaryPageComposite } from "../Summary/ContractSummaryComposite";
import ContractDetailsComposite from "../Details/ContractDetailsComposite";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiContractList } from "../../../JS/KPIPageName";
import * as KeyCodes from "../../../JS/KeyCodes";
import TransactionSourceSummaryOperations from "../Common/TransactionSourceSummaryOperations";
import TruckShipmentComposite from "./TruckShipmentComposite";
import RailDispatchComposite from "./RailDispatchComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ContractComposite extends Component {
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
    contractKPIList: [],
    isLoadShipment: false,
    shipmentType: "",
    terminalCodes: [],
    isLoadRailDispatch: false,
    selectedContractCode: [],
    isShowRightPane: false,
    isSBCEnable: false,
    isSBPEnable: false,
    isRailDispatchEnable: false,
    showDeleteAuthenticationLayout: false,
  };

  componentName = "ContractComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnContract
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
      this.getContractList(
        this.props.userDetails.EntityResult.PrimaryShareholder,
        fromDate,
        toDate
      );
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
      this.getTerminalsList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getlookupValues();
    } catch (error) {
      console.log(
        "ContractComposite:Error occured on ComponentDidMount",
        error
      );
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

  handleDelete = () => {
   this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteContractKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var shCode = this.state.selectedShareholder;
        var ContractCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.contractCode, Value: ContractCode }],
        };
        deleteContractKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteContract,
        Utilities.getAuthenticationObjectforPost(
          deleteContractKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
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
            "ContractList_ContractDelSuccess",
            ["ContractCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getContractList(
              this.state.selectedShareholder,
              this.state.fromDate.toISOString(),
              this.state.toDate.toISOString()
            );
            this.getKPIList(this.state.selectedShareholder);
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
              messageResult.keyFields[0] = "ContractInfo_ContractCode";
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
          console.log("Error occured while deleting:" + error);
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({ operationsVisibilty });
        });
    } catch (error) {
      console.log("ContractComposite:Error occured on handleDelete", error);
    }
  };

  getTransportationType() {
    let transportationType = Constants.TransportationType.ROAD;
    if (
      this.props.activeItem !== undefined &&
      this.props.activeItem.itemProps !== undefined &&
      this.props.activeItem.itemProps.transportationType !== undefined
    )
      transportationType = this.props.activeItem.itemProps.transportationType;

    return transportationType;
  }
  getContractList(shareholder, startRange, endRange) {
    this.setState({ isReadyToRender: false });
    let transportationType = this.getTransportationType();
    let fromDate = new Date(startRange);
    let toDate = new Date(endRange);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);

    let obj = {
      ShareholderCode: shareholder,
      TransportationType: transportationType,
      startRange: fromDate,
      endRange: toDate,
    };
    // let url =
    //   RestAPIs.GetContractListForRole +
    //   "?ShareholderCode=" +
    //   shareholder +
    //   "&TransportationType=" +
    //   transportationType +
    //   "&startRange=" +
    //   startRange +
    //   "&endRange=" +
    //   endRange;

    axios(
      RestAPIs.GetContractListForRole,
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
          console.log("Error in ContractListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: {}, isReadyToRender: true });
        console.log("Error while getting Contract List:", error);
      });
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      // let { operationsVisibilty } = { ...this.state };
      //operationsVisibilty.delete = false;
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
        // operationsVisibilty,
      });
      this.getContractList(
        shareholder,
        this.state.fromDate.toISOString(),
        this.state.toDate.toISOString()
      );
      this.getKPIList(shareholder);
      this.getTerminalsList(shareholder);
    } catch (error) {
      console.log(
        "ContractComposite:Error occured on handleShareholderSelectionChange",
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
        isLoadShipment: false,
        isLoadRailDispatch: false,
      });
    } catch (error) {
      console.log("ContractComposite:Error occured on handleAdd", error);
    }
  };

  handleRowClick = (item) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnContract
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnContract
      );
      //operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
        isLoadShipment: false,
        isLoadRailDispatch: false,
      });
    } catch (error) {
      console.log("ContractComposite:Error occured on Row click", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnContract
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnContract
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        let selectedItems = [
          {
            Common_Code: data.ContractCode,
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
      console.log("ContractComposite:Error occured on savedEvent", error);
    }
  };

  //Get KPI for contract
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
        PageName: kpiContractList,
        TransportationType: this.props.activeItem.itemProps.transportationType,
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
            this.setState({
              contractKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ contractKPIList: [] });
            console.log("Error in contract KPIList:", result.ErrorList);
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
          console.log("Error while getting Contract KPIList:", error);
        });
    }
  }
  handleBack = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnContract
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isLoadShipment: false,
        isLoadRailDispatch: false,
        isReadyToRender: false,
      });
      this.getContractList(
        this.state.selectedShareholder,
        this.state.fromDate.toISOString(),
        this.state.toDate.toISOString()
      );
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("ContractComposite:Error occured on Back click", error);
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
  handleSelection = (items) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      let isCreated =
        items.findIndex(
          (x) =>
            Constants.contractStatus[x.ShipmentGridContract_Status] ===
            Constants.contractStatus.CREATED
        ) >= 0
          ? true
          : false;
      operationsVisibilty.delete =
        items.length > 0 &&
        isCreated &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnContract
        );
      let isReady = true;
      isReady = Object.values(items).every(function (x) {
        if (
          x.ShipmentGridContract_Status.toUpperCase() === "CLOSED" ||
          x.ShipmentGridContract_Status.toUpperCase() === "EXPIRED"
        )
          return false;
        else return true;
      });
      if (isReady) this.setState({ isShowRightPane: true });
      else this.setState({ isShowRightPane: false });

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("ContractComposite:Error occured on handleSelection", error);
    }
  };

  handleLoadContracts = () => {
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getContractList(
        this.state.selectedShareholder,
        this.state.fromDate.toISOString(),
        this.state.toDate.toISOString()
      );
    }
  };

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
        "DestinationComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  handleDispatchPageClick = () => {
    let contractCodes = [];
    var { operationsVisibilty } = { ...this.state };
    operationsVisibilty.delete = false;
    for (var i = 0; i < this.state.selectedItems.length; i++) {
      var ContractCode = this.state.selectedItems[i]["Common_Code"];
      contractCodes.push(ContractCode);
    }
    this.setState({
      isLoadRailDispatch: true,
      selectedContractCode: contractCodes,
      operationsVisibilty,
    });
  };

  handleShipmentByProductPageClick = () => {
    let contractCodes = [];
    var { operationsVisibilty } = { ...this.state };
    operationsVisibilty.delete = false;
    for (var i = 0; i < this.state.selectedItems.length; i++) {
      var ContractCode = this.state.selectedItems[i]["Common_Code"];
      contractCodes.push(ContractCode);
    }
    this.setState({
      isLoadShipment: true,
      shipmentType: "ShipmentByProduct",
      selectedContractCode: contractCodes,
      operationsVisibilty,
    });
  };

  handleShipmentByCompartmentPageClick = () => {
    let contractCodes = [];
    var { operationsVisibilty } = { ...this.state };
    operationsVisibilty.delete = false;
    for (var i = 0; i < this.state.selectedItems.length; i++) {
      var ContractCode = this.state.selectedItems[i]["Common_Code"];
      contractCodes.push(ContractCode);
    }
    this.setState({
      isLoadShipment: true,
      shipmentType: "ShipmentByCompartment",
      selectedContractCode: contractCodes,
      operationsVisibilty,
    });
  };

  handleOperationVisibility = (status) => {
    let operationsVisibilty = { ...this.state.operationsVisibilty };
    if (status === true) {
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnContract
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnContract
      );
      operationsVisibilty.shareholder = false;
    } else {
      operationsVisibilty.add = status;
      operationsVisibilty.delete = status;
      operationsVisibilty.shareholder = status;
    }

    this.setState({ operationsVisibilty });
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
      let railDispatchAdd = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailDispatch
      );
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Contract",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let isContractEnable =
            result.EntityResult["EnableContract"] === "0" ? false : true;

          if (isContractEnable) {
            if (sbcAdd) this.setState({ isSBCEnable: true });
            if (sbpAdd) this.setState({ isSBPEnable: true });
            if (railDispatchAdd) this.setState({ isRailDispatchEnable: true });
          }
        }
      });
    } catch (error) {
      console.log("ContractComposite:Error occured on getLookUpData", error);
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
    if(this.state.showDeleteAuthenticationLayout )
      return fnContract
   };

   getDeleteorEditMode() {
    if(this.state.showDeleteAuthenticationLayout)
      return functionGroups.remove;
    else
      return functionGroups.modify;
   };

   handleOperation()  {
  
    if(this.state.showDeleteAuthenticationLayout)
      return this.handleDelete
    
 };

  

  render() {
    let contractSelected =
      this.state.selectedItems.length > 0 && this.state.isShowRightPane;
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
            <ContractDetailsComposite
              key="ContractDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              transportationType={this.getTransportationType()}
              selectedShareholder={this.state.selectedShareholder}
              handleOperationVisibility={this.handleOperationVisibility}
            ></ContractDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isLoadShipment && this.state.shipmentType ? (
          <ErrorBoundary>
            <TruckShipmentComposite
              shipmentSource={Constants.shipmentFrom.Contract}
              selectedSourceCode={this.state.selectedContractCode}
              shipmentType={this.state.shipmentType}
              shipmentSourceFromSummary={true}
              selectedShareholder={this.state.selectedShareholder}
              activeItem={this.props.activeItem}
            ></TruckShipmentComposite>
          </ErrorBoundary>
        ) : this.state.isLoadRailDispatch ? (
          <RailDispatchComposite
            selectedShareholder={this.state.selectedShareholder}
            shipmentSource={Constants.shipmentFrom.Contract}
            selectedSourceCode={this.state.selectedContractCode}
            shipmentType={this.state.shipmentType}
            shipmentSourceFromSummary={true}
            userDetails={this.props.userDetails}
            activeItem={this.props.activeItem}
          ></RailDispatchComposite>
        ) : (
          <>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.contractKPIList}
                  pageName="Contract"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            {this.state.isReadyToRender ? (
              <div
                className={
                  contractSelected ? "showShipmentStatusRightPane" : ""
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
                    handleLoadOrders={this.handleLoadContracts}
                    filterText="LoadContracts"
                  ></TMTransactionFilters>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="compositeTransactionList">
                    <ContractSummaryPageComposite
                      tableData={this.state.data.Table}
                      columnDetails={this.state.data.Column}
                      pageSize={
                        this.props.userDetails.EntityResult.PageAttibutes
                          .WebPortalListPageSize
                      }
                      exportRequired={true}
                      exportFileName="ContractList"
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
                    ></ContractSummaryPageComposite>
                  </div>
                </ErrorBoundary>
              </div>
            ) : (
              <LoadingPage message="Loading"></LoadingPage>
            )}
            {contractSelected ? (
              <div>
                <TransactionSourceSummaryOperations
                  transportationType={
                    this.props.activeItem.itemProps.transportationType
                  }
                  handleShipmentByCompartmentPageClick={
                    this.handleShipmentByCompartmentPageClick
                  }
                  handleShipmentByProductPageClick={
                    this.handleShipmentByProductPageClick
                  }
                  handleDispatchPageClick={this.handleDispatchPageClick}
                  isSBCEnable={this.state.isSBCEnable}
                  isSBPEnable={this.state.isSBPEnable}
                  isRailDispatchEnable={this.state.isRailDispatchEnable}
                ></TransactionSourceSummaryOperations>
              </div>
            ) : (
              ""
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

ContractComposite.propTypes = {
  activeItem: PropTypes.object,
  shipmentSource: PropTypes.number,
};

export default connect(mapStateToProps)(ContractComposite);
