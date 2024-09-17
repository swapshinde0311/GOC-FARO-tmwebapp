import React, { Component } from "react";
import { connect } from "react-redux";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { SMSConfigurationSummaryComposite } from "../Summary/SMSConfigurationSummaryComposite";
import SMSConfigurationDetailsComposite from "../Details/SMSConfigurationDetailsComposite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { functionGroups, fnSMSConfiguration } from "../../../JS/FunctionGroups";
import * as KeyCodes from "../../../JS/KeyCodes";
import NotifyEvent from "../../../JS/NotifyEvent";
import PropTypes from "prop-types";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class SMSConfigurationComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: true, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    showAuthenticationLayout: false,

  };
  componentName = "SmsList";

  handleAdd = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: "true",
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "SMSConfigurationComposite:Error occured on handleAdd",
        error
      );
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
      console.log("EmailConfigurationComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteSMSConfigurationsKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var SMSCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          keyDataCode: 0,
          KeyCodes: [{ Key: KeyCodes.smsConfigurationCode, Value: SMSCode }],
        };
        deleteSMSConfigurationsKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteSMSConfiguration,
        Utilities.getAuthenticationObjectforPost(
          deleteSMSConfigurationsKeys,
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
            "SMSConfig_DeletionStatus",
            ["SMSConfigurationCode"]
          );
          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getSMSConfigurationList();
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
              messageResult.keyFields[0] = "SMSConfiguration_Code";
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
          console.log(
            "SMSConfigurationComposite:Error occured on handleDelete",
            error
          );
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({
            operationsVisibilty,
            showAuthenticationLayout: false,
          });
        });
    } catch (error) {
      console.log(
        "SMSConfigurationComposite:Error occured on handleDelete",
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
        fnSMSConfiguration
      );
      //operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getSMSConfigurationList();
    } catch (error) {
      console.log(
        "SMSConfigurationComposite:Error occured on Back click",
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
        fnSMSConfiguration
      );

      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnSMSConfiguration
      );

      //operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "SMSConfigurationComposite:Error occured on handleRowClick",
        error
      );
    }
  };

  getSMSConfigurationList() {
    this.setState({ isReadyToRender: false });
    axios(
      RestAPIs.GetSMSConfigurationList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getSMSConfigurationList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting SMS Configuration List:", error);
      });
  }

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnSMSConfiguration
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnSMSConfiguration
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            Common_Shareholder: data.Shareholdercode,
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
        "SMSConfigurationComposite:Error occured on savedEvent",
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
          fnSMSConfiguration
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "SMSConfigurationComposite:Error occured on handleSelection",
        error
      );
    }
  };

  componentDidMount() {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnSMSConfiguration
      );
      this.setState({
        operationsVisibilty,
      });
      this.getSMSConfigurationList();
    } catch (error) {
      console.log(
        "SMSConfigurationComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }

  render() {
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
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            onDelete={this.authenticateDelete}
            shrVisible={false}
            onAdd={this.handleAdd}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <SMSConfigurationDetailsComposite
              key="SMSConfigurationDetails"
              selectedRow={this.state.selectedRow}
              //selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></SMSConfigurationDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <ErrorBoundary>
            <SMSConfigurationSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="SmsList"
                columnPickerRequired={true}

                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectionRequired={true}
                columnGroupingRequired={true}

                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
                parentComponent={this.componentName}
            ></SMSConfigurationSummaryComposite>
          </ErrorBoundary>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnSMSConfiguration}
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

SMSConfigurationComposite.propTypes = {
  activeItem: PropTypes.object,
};

export default connect(mapStateToProps)(SMSConfigurationComposite);
