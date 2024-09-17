import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import { PipelineMeterSiteViewSummaryComposite } from "../Summary/PipelineMeterSiteViewSummaryComposite";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as Constants from "../../../JS/Constants";
import MeterDetailsComposite from "../Details/MeterDetailsComposite";
import {
  functionGroups,
  fnPipelineMeterSiteView,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiMeterList } from "../../../JS/KPIPageName";
import NotifyEvent from "../../../JS/NotifyEvent";
import { SiteTreeViewUserActionsComposite } from "../Common/SiteTreeViewUserActionsComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PipelineMeterSiteViewComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    operationsVisibilty: {
      add: false,
      delete: false,
      shareholder: false,
      terminal: false,
    },
    selectedRow: {},
    selectedItems: [],
    data: {},
    isEnable: true,
    selectedTerminal: "",
    terminalOptions: [],
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
      this.props.selectedShareholder === null ||
      this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    meterKPIList: [],
    showAuthenticationLayout: false,
  };

  componentName = "PipelineMeterComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineMeterSiteView
      );
      this.getTerminalList();
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.terminal = true;
      } else {
        operationsVisibilty.terminal = false;
      }
      this.setState({
        operationsVisibilty,
      });
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log(
        "TruckReceiptComposite:Error occured on ComponentDidMount",
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

  //Get KPI for order
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
        PageName: kpiMeterList,
        TransportationType: Constants.TransportationType.PIPELINE,
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
            this.setState({ meterKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ meterKPIList: [] });
            console.log("Error in meter KPIList:", result.ErrorList);
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
          console.log("Error while getting Meter KPIList:", error);
        });
    }
  }

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
                selectedTerminal: result.EntityResult[0],
                terminalOptions: result.EntityResult,
              },
              () => this.getPipelineMeterList(this.state.terminalOptions[0])
            );
        }
      });
    } catch (err) {
      console.log("SiteViewComposite:Error occured on getTerminalsList", err);
    }
  }

  getPipelineMeterList = (terminal) => {
    try {
      axios(
        RestAPIs.GetPipelineMeterList + "?TerminalCode=" + terminal,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in GetPipelineMeterList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting PipelineMeterList:", error);
        });
    } catch (error) {
      console.log("PipelineMeterSiteViewComposite:Error in get Pipeline List");
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
          fnPipelineMeterSiteView
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "PipelineMeterSiteViewComposite:Error occured on handleSelection",
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
        fnPipelineMeterSiteView
      );
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.delete = false;
      } else {
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPipelineMeterSiteView
        );
      }
      operationsVisibilty.terminal = false;
      // operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "PipelineMeterSiteViewComposite:Error occured on Row click",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      let notification = {};

      var deletePipelineMeters = [];

      for (var i = 0; i < this.state.selectedItems.length; i++) {
        let keyData = {
          keyDataCode: 0,
          ShareHolderCode: "",
          KeyCodes: [
            {
              Key: KeyCodes.meterCode,
              Value: this.state.selectedItems[i]["Common_Code"],
            },
          ],
        };
        deletePipelineMeters.push(keyData);
      }

      axios(
        RestAPIs.DeletePipelineMeter,
        Utilities.getAuthenticationObjectforPost(
          deletePipelineMeters,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          let isRefreshDataRequire = result.IsSuccess;

          if (
            result.ResultDataList !== null &&
            result.ResultDataList !== undefined
          ) {
            let failedResultsCount = result.ResultDataList.filter(function (
              res
            ) {
              return !res.IsSuccess;
            }).length;

            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else isRefreshDataRequire = true;
          }

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false, showAuthenticationLayout: false, });
            this.getPipelineMeterList(this.state.selectedTerminal);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty, showAuthenticationLayout: false, });
          }
          notification = Utilities.convertResultsDatatoNotification(
            result,
            "PipelineMeterDeleteStatus",
            ["MeterCode"]
          );

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "MeterCode";
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
      console.log(
        "PipelineMeterSiteViewComposite:Error occured on handleDelete",
        error
      );
    }
  };

  handleTerminalSelectionChange = (terminal) => {
    try {
      this.setState({
        selectedTerminal: terminal,
        isReadyToRender: true,
      });
      this.getPipelineMeterList(terminal);
    } catch (error) {
      console.log(
        "SiteViewComposite:Error occured on handleTerminalSelectionChange",
        error
      );
    }
  };

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
      console.log(
        "PipelineMeterSiteViewComposite:Error occured on handleAdd",
        error
      );
    }
  };

  handleBack = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineMeterSiteView
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.terminal = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getPipelineMeterList(this.state.selectedTerminal);
    } catch (error) {
      console.log(
        "PipelineMeterSiteViewComposite:Error occured on Back click",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnPipelineMeterSiteView
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPipelineMeterSiteView
        );
        operationsVisibilty.terminal = false;
        this.setState({ operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        let selectedItems = [
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
      // this.getPipelineMeterList(this.state.selectedTerminal);
    } catch (error) {
      console.log("SiteViewComposite:Error occured on savedEvent", error);
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
      console.log("pipelinemeter : Error in authenticateDelete");
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

        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <MeterDetailsComposite
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              selectedRow={this.state.selectedRow}
              source={"PipelineSiteView"}
              selectedTerminal={this.state.selectedTerminal}
            />
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.meterKPIList}
                  pageName="PipelineMeterSiteView"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <PipelineMeterSiteViewSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="PipelineMeterList"
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
              ></PipelineMeterSiteViewSummaryComposite>
            </ErrorBoundary>
          </>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
          {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnPipelineMeterSiteView}
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

export default connect(mapStateToProps)(PipelineMeterSiteViewComposite);

PipelineMeterSiteViewComposite.propTypes = {
  activeItem: PropTypes.object,
};
