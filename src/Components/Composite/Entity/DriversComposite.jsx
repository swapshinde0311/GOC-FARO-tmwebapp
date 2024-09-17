import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
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
  fnDriver,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { DriversSummaryPageComposite } from "../Summary/DriversSummaryComposite";
import DriverDetailsComposite from "../Details/DriverDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiDriverList } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class DriversComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    driverKPIList: [],
    showAuthenticationLayout: false,

  };

  componentName = "DriversList";

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
      console.log("DriversComposite:Error occured on handleAdd", error);
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
      console.log("DriversComponentComposite : Error in authenticateDelete");
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
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deleteDriverKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var shCode = this.state.selectedShareholder;
        var DriverCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.driverCode, Value: DriverCode }],
        };
        deleteDriverKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteDriver,
        Utilities.getAuthenticationObjectforPost(
          deleteDriverKeys,
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
            "DriverInfo_DeletionStatus",
            ["DriverCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getdriverList(this.state.selectedShareholder);
            this.getKPIList(this.state.selectedShareholder);
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
              messageResult.keyFields[0] = "DriverInfo_Code";
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
      console.log("DriversComposite:Error occured on handleDelet", error);
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnDriver
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getdriverList(this.state.selectedShareholder);
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("DriversComposite:Error occured on Back click", error);
    }
  };
  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnDriver
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnDriver
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("DriversComposite:Error occured on handleRowClick", error);
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
          fnDriver
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("DriversComposite:Error occured on handleSelection", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnDriver
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnDriver
        );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
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
      console.log("DriversComposite:Error occured on savedEvent", error);
    }
  };

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
        PageName: kpiDriverList,
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
              driverKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ driverKPIList: [] });
            console.log("Error in driver KPIList:", result.ErrorList);
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
          console.log("Error while getting Driver KPIList:", error);
        });
    }
  }

  getdriverList(shareholder) {
    axios(
      RestAPIs.GetDriverListForRole + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in GetDriverListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting Driver List:", error);
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
      this.getdriverList(shareholder);
      this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "DriversComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  componentDidMount() {
    // clear session storage on page refresh
    window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));

    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnDriver
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getdriverList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log("DriversComposite:Error occured on ComponentDidMount", error);
    }
  }

  componentWillUnmount = () => {
    // clear session storage
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
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
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <DriverDetailsComposite
              key="DriverDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></DriverDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.driverKPIList}
                  pageName="Drivers"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <DriversSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                exportRequired={true}
                exportFileName="DriversList.xlsx"
                columnPickerRequired={true}
                columnGroupingRequired={true}
                selectionRequired={true}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
                parentComponent={this.componentName}
              ></DriversSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnDriver}
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

export default connect(mapStateToProps)(DriversComposite);

DriversComposite.propTypes = {
  activeItem: PropTypes.object,
};
