import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { TerminalSummaryComposite } from "../Summary/TerminalSummaryComposite";
import TerminalDetailsComposite from "../Details/TerminalDetailsComposite";
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
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { functionGroups, fnTerminal } from "../../../JS/FunctionGroups";

class TerminalComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: {
      add: false,
      delete: false,
      shareholder: false,
    },
    selectedRow: {},
    selectedItems: [],
    data: {},
    terminalCodes: [],
  };

  componentName = "TerminalComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTerminal
      );
      operationsVisibilty.add = this.props.userDetails.EntityResult
        .IsEnterpriseNode
        ? true
        : false;
      this.setState({
        operationsVisibilty,
      });
      this.getTerminalList();
    } catch (error) {
      console.log(
        "TerminalComposite:Error occured on componentDidMount",
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

  getTerminalList() {
    axios(
      RestAPIs.GetTerminalListForRole,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting Terminal List:", error);
      });
  }

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("TerminalComposite:Error occured on handleAdd", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
           operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTerminal
        );
        }
        operationsVisibilty.delete = false;
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            Common_Status: data.Active,
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
      console.log("TerminalComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTerminal
        );
      }

      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getTerminalList();
    } catch (error) {
      console.log("TerminalComposite:Error occured on Back click", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTerminal
        );
      }

      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("TerminalComposite:Error occured on Row click", error);
    }
  };

  handleSelection = (items) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("TerminalComposite:Error occured on handleSelection", error);
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
            onDelete=""
            onAdd={this.handleAdd}
            shrVisible={false}
            addVisible={this.props.userDetails.EntityResult.IsEnterpriseNode}
            deleteVisible={this.props.userDetails.EntityResult.IsEnterpriseNode}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <TerminalDetailsComposite
              key="TerminalDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></TerminalDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <ErrorBoundary>
            <TerminalSummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              exportRequired={true}
              exportFileName="TerminalList"
              columnPickerRequired={true}

              selectionRequired={true}
              columnGroupingRequired={true}
              onSelectionChange={this.handleSelection}
              onRowClick={this.handleRowClick}
              parentComponent={this.componentName}
            ></TerminalSummaryComposite>
          </ErrorBoundary>
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

export default connect(mapStateToProps)(TerminalComposite);

TerminalComposite.propTypes = {
  activeItem: PropTypes.object,
};
