import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { ShareholderSummaryComposite } from "../Summary/ShareholderSummaryComposite";
import ShareholderDetailsComposite from "../Details/ShareholderDetailsComposite";
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
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiShareholderList } from "../../../JS/KPIPageName";
import {
  functionGroups,
  fnShareholder,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ShareholderComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    terminalCodes: [],
    shareholderKPIList: [],
    showAuthenticationLayout: false,

  };

  componentName = "ShareholderComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShareholder
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getShareholderList();
      this.getKPIList();

      if (this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.getAllTerminals();
    } catch (error) {
      console.log(
        "ShareholderComposite:Error occured on componentDidMount",
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


  getShareholderList() {
    axios(
      RestAPIs.GetShareholderListForRole,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getShareholderList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting ShareholderList:", error);
      });
  }

  getAllTerminals() {
    try {
      axios(
        // RestAPIs.GetTerminals,
        RestAPIs.GetAllTerminals,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        if (response.data.IsSuccess) {
          if (response.data.EntityResult !== null)
            this.setState({ terminalCodes: response.data.EntityResult });
        } else {
          this.setState({ terminalCodes: [] });
        }
      });
    } catch (error) {
      this.setState({ terminalCodes: [] });
      console.log(
        "ShareholderComposite:Error occured on getAllTerminalsList",
        error
      );
    }
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
      console.log("ShareholderComposite:Error occured on handleAdd", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnShareholder
        );
        if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
          operationsVisibilty.delete = false;
        } else {
          operationsVisibilty.delete = Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnShareholder
          );
        }
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.ShareholderCode,
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
      console.log("ShareholderComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShareholder
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getShareholderList();
      this.getKPIList();
    } catch (error) {
      console.log("ShareholderComposite:Error occured on Back click", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShareholder
      );
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.delete = false;
      } else {
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnShareholder
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
      console.log("ShareholderComposite:Error occured on Row click", error);
    }
  };

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
            fnShareholder
          );
      }
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "ShareholderComposite:Error occured on handleSelection",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteShareholderKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var ShareholderCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          ShareHolderCode: ShareholderCode,
          KeyCodes: [{ Key: KeyCodes.shareholderCode, Value: ShareholderCode }],
        };
        deleteShareholderKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteShareholder,
        Utilities.getAuthenticationObjectforPost(
          deleteShareholderKeys,
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
            "ShareholderDetails_DeletionStatus",
            ["ShareHolderCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getShareholderList();
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
            this.setState({
              operationsVisibilty,
              showAuthenticationLayout: false,
            });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "ShareholderDetails_Code";
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
      console.log("ShareholderComposite:Error occured on handleDelet", error);
    }
  };

  //Get KPI for Shareholder
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
        PageName: kpiShareholderList,
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
              shareholderKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ shareholderKPIList: [] });
            console.log("Error in shareholder KPIList:", result.ErrorList);
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
          console.log("Error while getting Shareholder KPIList:", error);
        });
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
            deleteVisible={!this.props.userDetails.EntityResult.IsEnterpriseNode}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <ShareholderDetailsComposite
              key="ShareholderDetails"
              selectedRow={this.state.selectedRow}
              terminalCodes={this.state.terminalCodes}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></ShareholderDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.shareholderKPIList}
                  pageName="Shareholder"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <ShareholderSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="ShareholderList"
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
              ></ShareholderSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnShareholder}
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

export default connect(mapStateToProps)(ShareholderComposite);

ShareholderComposite.propTypes = {
  activeItem: PropTypes.object,
};
