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
import {
  functionGroups,
  fnReportConfiguration,
} from "../../../JS/FunctionGroups";
import { ReportScheduleSummaryPageComposite } from "../Summary/ReportScheduleSummaryComposite";
import ReportScheduleDetailsComposite from "../Details/ReportScheduleDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { emptyReportSchedule } from "../../../JS/DefaultEntities";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ReportSchedule extends Component {
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
  };

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
      console.log("ReportSchedule:Error occured on handleAdd", error);
    }
  };
  handleDelete = () => {
    this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteReportScheduleData = [];
      var reportNamesDeleted = [];
      var reportKeyFields = [];
      var reportnames = "";
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var reportScheduleData = lodash.cloneDeep(emptyReportSchedule);
        reportScheduleData.ShareholderCode = this.state.selectedShareholder;
        reportScheduleData.ReportName =
          this.state.selectedItems[i]["ReportSchedules_ReportName"];
        reportnames =
          reportnames +
          this.state.selectedItems[i]["ReportSchedules_ReportName"] +
          "-";
        deleteReportScheduleData.push(reportScheduleData);
        reportKeyFields.push("ReportSchedule_Title");
        reportNamesDeleted.push(
          this.state.selectedItems[i]["ReportSchedules_ReportName"]
        );
      }
      var notification = {
        messageType: "critical",
        message: "ReportSchedule_DeletionStatus",
        messageResultDetails: [],
      };
      axios(
        RestAPIs.DeleteReportSchedule,
        Utilities.getAuthenticationObjectforPost(
          deleteReportScheduleData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.IsSuccess;

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getreportScheduleList(this.state.selectedShareholder);
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

          notification.messageType = result.IsSuccess ? "success" : "critical";
          var msgobj = {
            keyFields: reportKeyFields,
            keyValues: reportNamesDeleted,
            isSuccess: true,
            errorMessage: "",
          };
          notification.messageResultDetails.push(msgobj);
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
      console.log(
        "ReportScheduleComposite:Error occured on handleDelet",
        error
      );
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnReportConfiguration
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
      this.getreportScheduleList(this.state.selectedShareholder);
      //this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("ReportSchedule:Error occured on Back click", error);
    }
  };
  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnReportConfiguration
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnReportConfiguration
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("ReportSchedule:Error occured on handleRowClick", error);
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
          fnReportConfiguration
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("ReportSchedule:Error occured on handleSelection", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnReportConfiguration
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnReportConfiguration
        );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            ReportSchedules_ReportName: data.ReportName,
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
      console.log("ReportSchedule:Error occured on savedEvent", error);
    }
  };

  getreportScheduleList(shareholder) {
    axios(
      RestAPIs.GetReportsScheduledList + "?Shareholder=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error in GetReportScheduleListForRole:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting ReportSchedule List:", error);
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
      this.getreportScheduleList(shareholder);
    } catch (error) {
      console.log(
        "ReportSchedule:Error occured on handleShareholderSelectionChange",
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
        fnReportConfiguration
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getreportScheduleList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
    } catch (error) {
      console.log("ReportSchedule:Error occured on ComponentDidMount", error);
    }
  }

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
      console.log("Report Schedule Composite : Error in authenticateDelete");
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
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <ReportScheduleDetailsComposite
              key="ReportScheduleDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              //selectedItems={this.state.selectedItems}
            ></ReportScheduleDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <ReportScheduleSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectedItems={this.state.selectedItems}
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
              ></ReportScheduleSummaryPageComposite>
            </ErrorBoundary>
          </div>
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
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnReportConfiguration}
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

export default connect(mapStateToProps)(ReportSchedule);

ReportSchedule.propTypes = {
  activeItem: PropTypes.object,
};
