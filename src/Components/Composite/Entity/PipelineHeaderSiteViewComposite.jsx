import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { PipelineHeaderSiteViewSummaryComposite } from "../Summary/PipelineHeaderSiteViewSummaryComposite";
import PipelineHeaderSiteViewDetailsComposite from "../Details/PipelineHeaderSiteViewDetailsComposite";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { connect } from "react-redux";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import {
  functionGroups,
  fnPipelineHeaderSiteView,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiPipelineHeaderSiteViewList } from "../../../JS/KPIPageName";
import { SiteTreeViewUserActionsComposite } from "../Common/SiteTreeViewUserActionsComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PipelineHeaderSiteViewComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: {
      add: false,
      delete: false,
      shareholder: false,
      terminal: true,
    },
    selectedRow: {},
    selectedItems: [],
    data: {},
    terminalOptions: [],
    pipelineHeaderSiteViewKPIList: [],
    selectedTerminal: "",
    showAuthenticationLayout: false,
  };

  componentName = "PipelineHeaderComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getTerminalList();
      } else {
        this.getPipelineHeaderList(this.state.selectedTerminal);
      }
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineHeaderSiteView
      );
      this.setState({
        operationsVisibilty,
      });
      this.getKPIList();
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on componentDidMount",
        error
      );
    }

    // clear session storage on window refresh event
    window.addEventListener("beforeunload", () =>
      Utilities.clearSessionStorage(this.componentName + "GridState")
    );
  }

  componentWillUnmount = () => {
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () =>
      Utilities.clearSessionStorage(this.componentName + "GridState")
    );
  };

  getTerminalList() {
    try {
      axios(
        RestAPIs.GetTerminals,
        Utilities.getAuthenticationObjectforPost(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          )
            this.setState(
              {
                terminalOptions: result.EntityResult,
                selectedTerminal: result.EntityResult[0],
              },
              () => {
                this.getPipelineHeaderList(this.state.selectedTerminal);
              }
            );
        }
      });
    } catch (err) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on getTerminalsList",
        err
      );
    }
  }

  getPipelineHeaderList(terminal) {
    axios(
      RestAPIs.GetPipelineHeaderList + "?TerminalCode=" + terminal,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getPipelineHeaderList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getPipelineHeaderList:", error);
      });
  }

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.terminal = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on handleAdd",
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
        fnPipelineHeaderSiteView
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.terminal = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getPipelineHeaderList(this.state.selectedTerminal);
      this.getKPIList();
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on Back click",
        error
      );
    }
  };

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
        PageName: kpiPipelineHeaderSiteViewList,
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
              pipelineHeaderSiteViewKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ pipelineHeaderSiteViewKPIList: [] });
            console.log(
              "Error in pipelineHeaderSiteView KPIList:",
              result.ErrorList
            );
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
          console.log(
            "Error while getting PipelineHeaderSiteView KPIList:",
            error
          );
        });
    }
  }

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineHeaderSiteView
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnPipelineHeaderSiteView
      );
      operationsVisibilty.terminal = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on Row click",
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
          fnPipelineHeaderSiteView
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on handleSelection",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deletePipelineHeaderKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var headerCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          KeyCodes: [
            {
              Key: KeyCodes.pipelineHeaderCode,
              Value: headerCode,
            },
          ],
        };
        deletePipelineHeaderKeys.push(keyData);
      }
      axios(
        RestAPIs.DeletePipelineHeader,
        Utilities.getAuthenticationObjectforPost(
          deletePipelineHeaderKeys,
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
            "PipeLineHeaderInfo_DeleteStatus",
            ["PipelineHeaderCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false,showAuthenticationLayout: false, });
            this.getPipelineHeaderList(this.state.selectedTerminal);
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
            this.setState({ operationsVisibilty });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "PipeLineHeaderInfo_Code";
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
          this.setState({ operationsVisibilty, showAuthenticationLayout: false, });
        });
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on handleDelete",
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
          fnPipelineHeaderSiteView
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPipelineHeaderSiteView
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
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
        "PipelineHeaderSiteViewComposite:Error occured on savedEvent",
        error
      );
    }
  };

  handleTerminalSelectionChange = (terminal) => {
    try {
      this.setState({
        selectedTerminal: terminal,
        isReadyToRender: false,
      });
      this.getPipelineHeaderList(terminal);
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewComposite:Error occured on handleTerminalSelectionChange",
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
      console.log("pipelineHeaderComposite : Error in authenticateDelete");
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
          {this.props.userDetails.EntityResult.IsEnterpriseNode ? (
            <SiteTreeViewUserActionsComposite
              breadcrumbItem={this.props.activeItem}
              operationsVisibilty={this.state.operationsVisibilty}
              terminals={this.state.terminalOptions}
              selectedTerminal={this.state.selectedTerminal}
              onTerminalChange={this.handleTerminalSelectionChange}
              handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            ></SiteTreeViewUserActionsComposite>
          ) : (
            <TMUserActionsComposite
              operationsVisibilty={this.state.operationsVisibilty}
              breadcrumbItem={this.props.activeItem}
              onDelete={this.authenticateDelete}
              onAdd={this.handleAdd}
              shrVisible={false}
              handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            ></TMUserActionsComposite>
          )}
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <PipelineHeaderSiteViewDetailsComposite
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              selectedTerminal={this.state.selectedTerminal}
              terminalCodes={this.state.terminalCodes}
            ></PipelineHeaderSiteViewDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.pipelineHeaderSiteViewKPIList}
                  pageName="PipelineHeaderSiteView"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <PipelineHeaderSiteViewSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="PipelineHeaderList"
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
              ></PipelineHeaderSiteViewSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
         {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnPipelineHeaderSiteView}
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

export default connect(mapStateToProps)(PipelineHeaderSiteViewComposite);

PipelineHeaderSiteViewComposite.propTypes = {
  activeItem: PropTypes.object,
};
