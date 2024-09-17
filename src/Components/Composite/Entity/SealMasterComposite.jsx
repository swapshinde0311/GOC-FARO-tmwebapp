import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ErrorBoundary from "../../ErrorBoundary";
import { SealMasterSummaryComposite } from "../Summary/SealMasterSummaryComposite";
import SealMasterDetailsComposite from "../Details/SealMasterDetailsComposite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { functionGroups, fnSealMaster } from "../../../JS/FunctionGroups";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as KeyCodes from "../../../JS/KeyCodes";
import Error from "../../Error";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class SealMasterComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    lookUpData: null,
    isEnable: true,
    showAuthenticationLayout: false,

  };

  componentName = "SealMasterComponent";

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        data: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("SealMasterComposite:Error occured on handleAdd", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnSealMaster
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnSealMaster
        );
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
      console.log("SealMasterComposite:Error occured on savedEvent", error);
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnSealMaster
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.GetSealMastersList();
    } catch (error) {
      console.log("SealMasterComposite:Error occured on Back click", error);
    }
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnSealMaster
      );
      this.setState({
        operationsVisibilty,
        selectedSealMaster:
          this.props.userDetails.EntityResult.PrimarySealmaster,
      });
      // this.GetSealMastersList();
      this.getLookUpData();
      if (this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.GetSealMastersList();
    } catch (error) {
      console.log(
        "SealMasterComposite:Error occured on componentDidMount",
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

  handleSelection = (items) => {
    try {
      var { operationsVisibilty } = { ...this.state };

      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.delete = false;
      } else {
        operationsVisibilty.delete =
          items.length > 0 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnSealMaster
          );
      }
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "SealMasterComposite:Error occured on handleSelection",
        error
      );
    }
  };
  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Sealing",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        console.log(result);

        if (result.IsSuccess === true) {
          let isEnable = true;
          if (result.EntityResult.RoadEnable === "False") {
            isEnable = false;
          }
          this.setState({ lookUpData: result.EntityResult, isEnable });
          if (isEnable) {
            this.GetSealMastersList();
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "SealMasterDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }
  GetSealMastersList() {
    axios(
      RestAPIs.GetSealMastersList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getsealmasterList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting sealmasterList:", error);
      });
  }
  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteSealMasterKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var SealMasterCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          SealMasterCode: SealMasterCode,
          KeyCodes: [{ Key: KeyCodes.sealMasterCode, Value: SealMasterCode }],
        };
        deleteSealMasterKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteSealMaster,
        Utilities.getAuthenticationObjectforPost(
          deleteSealMasterKeys,
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
            "SealMaster_DeleteSuccess_Msg",
            ["SealMasterCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.GetSealMastersList();
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
              messageResult.keyFields[0] = "SealMasterDetails_Code";
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
      console.log("SealMasterComposite:Error occured on handleDelete", error);
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
          fnSealMaster
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "SealMasterComposite:Error occured on handleSelection",
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
        fnSealMaster
      );
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.delete = false;
      } else {
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnSealMaster
        );
      }
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("SealMasterComposite:Error occured on Row click", error);
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
      console.log("SealmasterComposite : Error in authenticateDelete");
    }
  };
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  render() {
    console.log(this.props);
    return (
      <div>
        {this.state.isEnable ? (
         <ErrorBoundary>
         <TMUserActionsComposite
           operationsVisibilty={this.state.operationsVisibilty}
           breadcrumbItem={this.props.activeItem}
           shareholders={this.props.userDetails.EntityResult.ShareholderList}
              onDelete={this.authenticateDelete}
           onAdd={this.handleAdd}
           shrVisible={false}
           handleBreadCrumbClick={this.props.handleBreadCrumbClick}
         ></TMUserActionsComposite>
       </ErrorBoundary>):""
        }
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <SealMasterDetailsComposite
              key="SealMasterDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></SealMasterDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <ErrorBoundary>
            <SealMasterSummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              exportRequired={true}
              exportFileName="SealMasterList"
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
            ></SealMasterSummaryComposite>
          </ErrorBoundary>
        ) : (
          <>
            {this.state.isEnable ? (
              <LoadingPage message="Loading"></LoadingPage>
            ) : (
              <Error errorMessage="SealMasterFeatureNotEnabled"></Error>
            )}
          </>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnSealMaster}
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

export default connect(mapStateToProps)(SealMasterComposite);

SealMasterComposite.propTypes = {
  activeItem: PropTypes.object,
};
