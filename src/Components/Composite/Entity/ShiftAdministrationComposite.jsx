import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUIInstallType } from "../../../JS/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { ShiftConfigurationSummaryComposite } from "../Summary/ShiftConfigurationSummaryComposite";
import ShiftConfigurationDetailsComposite from "../Details/ShiftConfigurationDetailsComposite";

import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import NotifyEvent from "../../../JS/NotifyEvent";
import { functionGroups, fnShiftConfig } from "../../../JS/FunctionGroups";
import ShowAuthenticationLayout from "../Common/UserAuthentication";

class ShiftAdministrationComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    showAuthenticationLayout: false

  };
  componentName = "ShiftConfigurationComposite";

  
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShiftConfig
      );
      this.setState({
        operationsVisibilty,
      });
      this.GetShiftList();
      
    } catch (error) {
      console.log(
        "ShiftConfigurationComposite:Error occured on componentDidMount",
        error
      );
    }
    // clear session storage on page refresh
    window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }
  componentWillUnmount = () => {
    // clear session storage
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }
  GetShiftList() {
    try {
      axios(
        RestAPIs.GetShiftList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let data = result.EntityResult;
              this.setState({ data, isReadyToRender: true });
            
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in GetShiftList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting GetShiftList:", error);
        });
    } catch (error) {
      console.log("Error while getting GetShiftList:", error);
    }
  }
  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        data: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("ShiftconfigurationComposite:Error occured on handleAdd", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnShiftConfig
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnShiftConfig
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            ID: data.ID,
            ShiftName: data.ShiftName,
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
      console.log("ShiftconfigurationComposite:Error occured on savedEvent", error);
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShiftConfig
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.GetShiftList();
    } catch (error) {
      console.log("ShiftconfigurationComposite:Error occured on Back click", error);
    }
  };
  handleDelete = () => {
    
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteshiftconfigurationKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var ShiftConfigID = this.state.selectedItems[i]["ID"];
        var ShiftName = this.state.selectedItems[i]["ShiftName"];
        var keyData = {
          KeyCodes: [{ Key: KeyCodes.ShiftID, Value: ShiftConfigID },
          {Key: KeyCodes.ShiftName, Value: ShiftName}],
        };
        deleteshiftconfigurationKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteShift,
        Utilities.getAuthenticationObjectforPost(
          deleteshiftconfigurationKeys,
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
            "ShiftConfig_DeleteSuccess_Msg",
            ["ShiftName"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.GetShiftList();
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              showAuthenticationLayout: false,

            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty,
              showAuthenticationLayout: false,
             });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "ShiftInfo_ShiftName";
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
      console.log("ShiftconfigurationComposite:Error occured on handleDelete", error);
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
          fnShiftConfig
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "ShiftconfigurationComposite:Error occured on handleSelection",
        error
      );
    }
  };
  handleRowClick = (item) => {
    
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShiftConfig
      );
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.delete = false;
      } else {
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnShiftConfig
        );
      }
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("ShiftconfigurationComposite:Error occured on Row click", error);
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
      console.log("ShareholderComposite : Error in authenticateDelete");
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
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <ShiftConfigurationDetailsComposite
              key="ShiftConfigurationDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></ShiftConfigurationDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <ErrorBoundary>
            <ShiftConfigurationSummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              exportRequired={true}
              exportFileName="ShiftConfigurationlist"
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
            ></ShiftConfigurationSummaryComposite>
          </ErrorBoundary>
        ) : (
          <>
              <LoadingPage message="Loading"></LoadingPage>
          </>
        )}
        {this.state.showAuthenticationLayout ? (
          <ShowAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnShiftConfig}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></ShowAuthenticationLayout>
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

export default connect(mapStateToProps)(ShiftAdministrationComposite);

ShiftAdministrationComposite.propTypes = {
  activeItem: PropTypes.object,
};
