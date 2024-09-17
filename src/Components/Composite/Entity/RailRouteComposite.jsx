import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { RailRouteSummaryPageComposite } from "../Summary/RailRouteSummaryComposite";
import axios from "axios";
import * as Constants from "./../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnRailRoute,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import RailRouteDetailsComposite from "../Details/RailRouteDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiRailRouteList } from "../../../JS/KPIPageName";
import "react-toastify/dist/ReactToastify.css";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RailRouteComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: true, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    terminalCodes: [],
    railRouteKPIList: [],
    showAuthenticationLayout: false,
  };

  componentName = "RailRouteComponent";

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
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getRailRouteList(this.state.selectedShareholder);
    }
  };

  handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
  };

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("RailRouteComposite:Error occured on handleAdd");
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteRailRouteKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var RailRouteCode = this.state.selectedItems[i]["Common_Code"];
        var shCode = this.state.selectedShareholder;
        var KeyData = {
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.railRouteCode, Value: RailRouteCode }],
        };
      }
      deleteRailRouteKeys.push(KeyData);

      axios(
        RestAPIs.DeleteRailRoute,
        Utilities.getAuthenticationObjectforPost(
          deleteRailRouteKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.IsSuccess;

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
            "RailRoute_DeletionStatus",
            ["RailRouteCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false, showAuthenticationLayout: false,});
            this.getRailRouteList(shCode);
            this.getKPIList();
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              showAuthenticationLayout: false,
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty,showAuthenticationLayout: false, });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0) {
              messageResult.keyFields[0] = "RailRoute_Code";
            }
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
      console.log("RailRouteComposite:Error occured on handleDelete");
    }
  };

  //Get KPI for Rail Route
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
        PageName: kpiRailRouteList,
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
              railRouteKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ railRouteKPIList: [] });
            console.log("Error in rail route KPIList:", result.ErrorList);
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
          console.log("Error while getting Rail Route KPIList:", error);
        });
    }
  }

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailRoute
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
      this.getRailRouteList(this.state.selectedShareholder);
      this.getKPIList();
    } catch (error) {
      console.log("RailRouteComposite:Error occured on Back click", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnRailRoute
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnRailRoute
        );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.RouteCode,
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
      console.log("RailRouteComposite:Error occured on savedEvent", error);
    }
  };

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({ selectedShareholder: shareholder });
      this.getRailRoutetList(shareholder);
      this.getKPIList();
    } catch (error) {
      console.log(
        "RailRouteComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailRoute
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getTerminalsList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getRailRouteList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log(
        "RailRouteComposite:Error occured on componentDidMount",
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

  getRailRouteList(shareholder) {
    axios(
      RestAPIs.GetRailRouteListForRole +
      "?TransportationType=" +
      Constants.TransportationType.RAIL +
      "&ShareholderCode=" +
      shareholder +
      "&startRange=" +
      this.state.fromDate.toLocaleDateString() +
      "&endRange=" +
      this.state.toDate.toLocaleDateString(),
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in GetRailRouteListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while geting Rail Route List:", error);
      });
  }

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRailRoute
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnRailRoute
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("RailRouteComposite:Error occured on handleRowClick", error);
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
          fnRailRoute
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("RailRouteComposite:Error occured on handleSelection", error);
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
      console.log("RailRouteComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
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
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          />
        </ErrorBoundary>
        {this.state.isDetails ? (
          <ErrorBoundary>
            <RailRouteDetailsComposite
              key="RailRouteDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              terminalCodes={this.state.terminalCodes}
              selectedShareholder={this.state.selectedShareholder}
            ></RailRouteDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.railRouteKPIList}
                  pageName="RailRoute"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <RailRouteSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }

                exportRequired={true}
                exportFileName="RailRouteList"
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
              ></RailRouteSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
          {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnRailRoute}
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

export default connect(mapStateToProps)(RailRouteComposite);

RailRouteComposite.propTypes = {
  activeItem: PropTypes.object,
};
