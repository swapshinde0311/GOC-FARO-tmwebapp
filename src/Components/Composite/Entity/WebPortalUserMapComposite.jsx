import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import * as Utilities from "../../../JS/Utilities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { functionGroups, fnWebPortalUserMap } from "../../../JS/FunctionGroups";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { WebPortalUserMapSummaryComposite } from "../Summary/WebPortalUserMapSummaryComposite";
import WebPortalUserMapDetailsComposite from "../Details/WebPortalUserMapDetailsComposite";
import NotifyEvent from "../../../JS/NotifyEvent";

class WebPortalUserMapComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    expandedRows: [],
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnWebPortalUserMap
      );
      this.setState({
        operationsVisibilty,
      });
      this.getWebportalUserList();
    } catch (error) {
      console.log(
        "WebPortalUserMapComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getWebportalUserList() {
    axios(
      RestAPIs.GetAllWebPortalUser,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult.Table !== undefined &&
            result.EntityResult.Table2 !== undefined &&
            result.EntityResult.Table !== null &&
            result.EntityResult.Table2 !== null &&
            Array.isArray(result.EntityResult.Table) &&
            Array.isArray(result.EntityResult.Table2)
          ) {
            let entityList = result.EntityResult.Table2;
            result.EntityResult.Table.forEach((items) => {
              let entityitem = entityList.filter((entity) => {
                return entity.UserName === items.WebPortal_UserName;
              });
              items["EntityList"] = entityitem;
            });
          }

          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getWebportalUserList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getWebportalUserList List:", error);
      });
  }

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
      console.log(
        "WebPortalUserMapComposite:Error occured on handleAdd",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnWebPortalUserMap
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnWebPortalUserMap
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            WebPortal_UserName: data.UserName,
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
      console.log(
        "WebPortalUserMapComposite:Error occured on savedEvent",
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
        fnWebPortalUserMap
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        expandedRows: [],
        isReadyToRender: false,
      });
      this.getWebportalUserList();
    } catch (error) {
      console.log(
        "WebPortalUserMapComposite:Error occured on Back click",
        error
      );
    }
  };

  handleRowClick = (item) => {
    try {
      if (item.field !== undefined) {
        var { operationsVisibilty } = { ...this.state };
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnWebPortalUserMap
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnWebPortalUserMap
        );
        this.setState({
          isDetails: true,
          selectedRow: item.rowData,
          selectedItems: [item.rowData],
          operationsVisibilty,
        });
      }
    } catch (error) {
      console.log(
        "WebPortalUserMapComposite:Error occured on Row click",
        error
      );
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
          fnWebPortalUserMap
        );
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "WebPortalUserMapComposite:Error occured on handleSelection",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteUsers = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var userName = this.state.selectedItems[i]["WebPortal_UserName"];
        deleteUsers.push(userName);
      }
      let obj = {
        Entity: deleteUsers,
      };
      axios(
        RestAPIs.DeleteWebPortalUser,
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
            "WebPortaUserMap_DeletionStatus",
            ["ShareHolderCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getWebportalUserList();
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
              messageResult.keyFields[0] = "WebPortal_UserName";
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
      console.log(
        "WebPortalUserMapComposite:Error occured on handleDelet",
        error
      );
    }
  };

  toggleExpand = (data, open) => {
    try {
      let expandedRows = this.state.expandedRows;
      let expandedRowIndex = expandedRows.findIndex(
        (item) => item.WebPortal_UserName === data.WebPortal_UserName
      );
      if (open) {
        expandedRows.splice(expandedRowIndex, 1);
      } else {
        expandedRows.push(data);
      }
      this.setState({ expandedRows });
    } catch (error) {
      console.log(
        "WebPortalUserMapComposite:Error occured on toggleExpand",
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
            onDelete={this.handleDelete}
            onAdd={this.handleAdd}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <WebPortalUserMapDetailsComposite
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></WebPortalUserMapDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <WebPortalUserMapSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                selectedItems={this.state.selectedItems}
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
                expandedRows={this.state.expandedRows}
                toggleExpand={this.toggleExpand}
              ></WebPortalUserMapSummaryComposite>
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

export default connect(mapStateToProps)(WebPortalUserMapComposite);

WebPortalUserMapComposite.propTypes = {
  activeItem: PropTypes.object,
};
