import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { CarrierSummaryPageComposite } from "../Summary/CarrierSummaryComposite";
import CarrierDetailsComposite from "../Details/CarrierDetailsComposite";
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
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnCarrierCompany,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { kpiCarrierList } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class CarrierCompanyComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    carrierCompanyKPIList: [],
    showAuthenticationLayout: false,

  };

  componentName = "CarrierComponent";

  handleAdd = () => {
    //console.log("Clicked Add");
    // state = { isDetails: "false" };
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: "true",
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("CarrierCompanyComposite:Error occured on handleAdd", error);
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
      console.log("CarrierComponentComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  handleDelete = () => {
    //console.log("Clicked Delete", this.state.selectedItems);
    try {
      var transportationType = this.getTransportationType();
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteCarrierKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var CarrierCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          ShareHolderCode: "",

          KeyCodes: [{ Key: KeyCodes.carrierCode, Value: CarrierCode }],
        };
        if (transportationType !== Constants.TransportationType.ROAD) {
          keyData.KeyCodes.push({
            Key: KeyCodes.transportationType,
            Value: transportationType,
          });
          //console.log(this.props.userDetails.userDetails.EntityResult);
          keyData.KeyCodes.push({
            Key: KeyCodes.shareholderCode,
            Value: this.props.userDetails.EntityResult.PrimaryShareholder,
          });
        } else {
          var shCode = this.state.selectedItems[i]["Common_Shareholder"];
          keyData.ShareHolderCode =
            this.state.selectedItems[i]["Common_Shareholder"];
          keyData.KeyCodes.push({
            Key: KeyCodes.shareholderCode,
            Value: shCode,
          });
        }
        deleteCarrierKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteCarrier,
        Utilities.getAuthenticationObjectforPost(
          deleteCarrierKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          //console.log(response.data);
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
            "CarrierDetails_DeletionStatus",
            ["CarrierCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getCarrierList();
            this.getKPIList();
            // var { operationsVisibilty } = { ...this.state };
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              showAuthenticationLayout: false,

            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({
              operationsVisibilty,
              showAuthenticationLayout: false,
            });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "CarrierDetails_CarrierCode";
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
          this.setState({
            operationsVisibilty,
            showAuthenticationLayout: false,
          });
        });
    } catch (error) {
      console.log(
        "CarrierCompanyComposite:Error occured on handleDelet",
        error
      );
    }
  };
  handleBack = () => {
    //console.log("Clicked Back");
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCarrierCompany
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getCarrierList();
      this.getKPIList();
    } catch (error) {
      console.log("CarrierCompanyComposite:Error occured on Back click", error);
    }
  };
  handleRowClick = (item) => {
    //console.log("CellClicked", item);
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCarrierCompany
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnCarrierCompany
      );
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("CarrierCompanyComposite:Error occured on Row click", error);
    }
  };
  handleSelection = (items) => {
    // console.log("SelectionChanged", items);
    try {
      var { operationsVisibilty } = { ...this.state };

      operationsVisibilty.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnCarrierCompany
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "CarrierCompanyComposite:Error occured on handleSelection",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnCarrierCompany
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnCarrierCompany
        );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            //TransportationType: data.TransportationType,
            Common_Status: data.Status,
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
      console.log("CarrierCompanyComposite:Error occured on savedEvent", error);
    }
  };

  //Get KPI for carrier companies
  getKPIList() {
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
        PageName: kpiCarrierList,
        TransportationType: this.props.activeItem.itemProps.transportationType,
        InputParameters: [],
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
              carrierCompanyKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ carrierCompanyKPIList: [] });
            console.log("Error in CarrierCompany KPIList:", result.ErrorList);
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
          console.log("Error while getting CarrierCompany KPIList:", error);
        });
    }
  }
  getCarrierList() {
    var transportationType = "";
    if (this.props.activeItem.itemProps !== undefined) {
      if (this.props.activeItem.itemProps.transportationType !== undefined) {
        transportationType = this.props.activeItem.itemProps.transportationType;
      }
    }

    axios(
      RestAPIs.GetCarrierListForRole +
      "?ShareholderCode=&Transportationtype=" +
      transportationType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in GetCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting Carrier List:", error);
      });
  }
  handleShareholderSelectionChange = (shareholder) => { };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCarrierCompany
      );
      this.setState({ operationsVisibilty });
      this.getCarrierList();
      this.getKPIList();
    } catch (error) {
      console.log(
        "CarrierCompanyComposite:Error occured on componentDidMount",
        error
      );
    }

    // clear session storage on window refresh event
    window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.getTransportationType() + this.componentName + "GridState"))
  }

  componentWillUnmount = () => {
    // clear session storage
    Utilities.clearSessionStorage(this.getTransportationType() + this.componentName + "GridState");

    // remove event listener
    window.removeEventListener("beforeunload",
      () => Utilities.clearSessionStorage(this.getTransportationType() + this.componentName + "GridState"));
  }

  getTransportationType() {
    var transportationType = Constants.TransportationType.ROAD;
    const { itemProps } = this.props.activeItem;
    if (itemProps !== undefined && itemProps.transportationType !== undefined) {
      transportationType = itemProps.transportationType;
    }
    return transportationType;
  }
  render() {
    //console.log(this.props.userDetails.EntityResult);
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={
              this.props.userDetails.EntityResult.PrimaryShareholder
            }
            onShareholderChange={this.handleShareholderSelectionChange}
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <CarrierDetailsComposite
              key="CarrierDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              genericProps={this.props.activeItem.itemProps}
            ></CarrierDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.carrierCompanyKPIList}
                  pageName="CarrierCompany"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <CarrierSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize}
                exportRequired={true}
                exportFileName="CarrierList.xlsx"
                columnPickerRequired={true}
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectionRequired={true}
                columnGroupingRequired={true}
                onSelectionChange={this.handleSelection}
                onRowClick={this.handleRowClick}
                parentComponent={this.getTransportationType() + this.componentName}>
              </CarrierSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnCarrierCompany}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
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

export default connect(mapStateToProps)(CarrierCompanyComposite);

CarrierCompanyComposite.propTypes = {
  activeItem: PropTypes.object,
};
