import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { RoleSummaryComposite } from "../Summary/RoleSummaryComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import { ToastContainer, toast } from "react-toastify";
import { functionGroups, fnRoleAdmin } from "../../../JS/FunctionGroups";
import RoleDetailsComposite from "../Details/RoleDetailsComposite";
import { COREADMIN } from "../../../JS/Constants";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RolesComposite extends Component {
  state = {
    data: {},
    isDetails: "false",
    isReadyToRender: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    showAuthenticationLayout: false,
  };

  componentName = "RoleComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRoleAdmin
      );
      this.setState({
        operationsVisibilty,
      });
      this.getSecurityRoleList();
    } catch (error) {
      console.log("RolesComposite:Error occured on ComponentDidMount", error);
    }
  }

  getSecurityRoleList() {
    axios(
      RestAPIs.GetSecurityRolesList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getSecurityRoleList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getSecurityRoleList:", error);
      });
  }

  handleAdd = () => {
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
      console.log("RolesComposite:Error occured on handleAdd", error);
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
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
      console.log("RolesComposite : Error in authenticateDelete");
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deleteRoleKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var RoleName = this.state.selectedItems[i]["RoleAdmin_RoleName"];
        deleteRoleKeys.push(RoleName);
      }
      let obj = {
        Entity: deleteRoleKeys,
      };
      axios(
        RestAPIs.DeleteSecurityRole,
        Utilities.getAuthenticationObjectforPost(
          obj,
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
            "RoleAdmin_DeletionStatus",
            ["Role"]
          );
          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getSecurityRoleList();
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty, showAuthenticationLayout: false });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "RoleAdmin_RoleName";
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
          console.log("RolesComposite:Error occured on handleDelete", error);
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({ operationsVisibilty, showAuthenticationLayout: false });
        });
    } catch (error) {
      console.log("RolesComposite:Error occured on handleDelete", error);
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRoleAdmin
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getSecurityRoleList();
    } catch (error) {
      console.log("RolesComposite:Error occured on Back click", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnRoleAdmin
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnRoleAdmin
      );
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("RolesComposite:Error occured on handleRowClick", error);
    }
  };

  handleSelection = (items) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      let isCoreAdmin =
        items.findIndex(
          (x) => x.RoleAdmin_RoleName.toUpperCase() === COREADMIN
        ) >= 0
          ? true
          : false;
      let isReadonly =
        items.findIndex((x) => x.LookUpData_ReadOnly === true) >= 0
          ? true
          : false;

      operationsVisibilty.delete =
        items.length > 0 && !isCoreAdmin && !isReadonly;
      Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnRoleAdmin
      );
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("RolesComposite:Error occured on handleSelection", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnRoleAdmin
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnRoleAdmin
        );
        this.setState({ operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            RoleAdmin_RoleName: data.RoleName,
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
      console.log("RolesComposite:Error occured on savedEvent", error);
    }
  };

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();
    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage);
  };

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
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
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            shrVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <RoleDetailsComposite
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></RoleDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <RoleSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="RoleList"
                columnPickerRequired={true}
                selectionRequired={true}
                columnGroupingRequired={true}
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
                parentComponent={this.componentName}
              ></RoleSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnRoleAdmin}
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

export default connect(mapStateToProps)(RolesComposite);

RolesComposite.propTypes = {
  activeItem: PropTypes.object,
};
