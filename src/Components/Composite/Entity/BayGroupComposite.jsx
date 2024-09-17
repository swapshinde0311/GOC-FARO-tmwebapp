import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { functionGroups, fnBayGroup, fnKPIInformation } from "../../../JS/FunctionGroups";
import NotifyEvent from "../../../JS/NotifyEvent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { BayGroupSummaryComposite } from "../Summary/BayGroupSummaryComposite";
import BayGroupDetailsComposite from "../Details/BayGroupDetailsComposite";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { KpiBayGroupList } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class BayGroupComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: true, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    selectedBays: [],
    data: {},
    lookUpData: null,
    isEnable: true,
    expandedRows: [],
    bayList: [],
    bayGroupKPIList: [],
    showAuthenticationLayout: false,
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetBayGroupList();
      this.getKPIList();
    } catch (error) {
      console.log(
        "BayGroupComposite:Error occured on componentDidMount",
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
        data: {},
        operationsVisibilty,
        selectedBays: [],
        selectedItems: [],
      });
    } catch (error) {
      console.log("BayGroupComposite:Error occured on handleAdd", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnBayGroup
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnBayGroup
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            GroupName: data.GroupName,
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
        "BayGroupDetailsComposite:Error occured on savedEvent",
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
        fnBayGroup
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
        expandedRows: [],
      });
      this.GetBayGroupList();
    } catch (error) {
      console.log("baygroupComposite:Error occured on Back click", error);
    }
  };
  GetBayGroupList() {
    try {
      axios(
        RestAPIs.GetBayGroupList,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let modBayGroup = result.EntityResult;
            for (let i = 0; i < modBayGroup.length; i++) {
              modBayGroup[i].CreatedTime =
                new Date(modBayGroup[i].CreatedTime).toLocaleDateString() +
                " " +
                new Date(modBayGroup[i].CreatedTime).toLocaleTimeString();
              modBayGroup[i].LastUpdatedTime =
                new Date(modBayGroup[i].LastUpdatedTime).toLocaleDateString() +
                " " +
                new Date(modBayGroup[i].LastUpdatedTime).toLocaleTimeString();
            }
            var { operationsVisibilty } = { ...this.state };
            operationsVisibilty.add = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnBayGroup
            );
            this.setState({
              data: result.EntityResult,
              isReadyToRender: true,
              operationsVisibilty,
              modBayGroup: modBayGroup,
            });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getbaygroupList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting getbaygroupList:", error);
        });
    } catch (error) {
      console.log("Error in getbaygroupList ", error);
    }
  }
  handleDelete = () => {
    this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteBayKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var GroupName = this.state.selectedItems[i];
        deleteBayKeys.push(GroupName);
      }
      let obj = {
        Entity: deleteBayKeys,
      };
      axios(
        RestAPIs.DeleteBayGroup,
        Utilities.getAuthenticationObjectforPost(
          obj,
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
            "BayGroup_DeleteSuccess",
            ["BayGroupName"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.GetBayGroupList();
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              selectedBays: [],
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length >= 0)
              messageResult.keyFields[0] = "BayGroupList_Name";
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
      console.log("BayGroupComposite:Error occured on handleDelete", error);
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
          fnBayGroup
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("BayGroupComposite:Error occured on handleSelection", error);
    }
  };
  handleRowClick = (item) => {
    try {
      if (item.field !== undefined) {
        var { operationsVisibilty } = { ...this.state };
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnBayGroup
        );
        if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
          operationsVisibilty.delete = false;
        } else {
          operationsVisibilty.delete = Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnBayGroup
          );
        }
        operationsVisibilty.shareholder = false;
        this.setState({
          isDetails: true,
          selectedRow: item.rowData,
          selectedItems: [item.rowData],
          operationsVisibilty,
        });
      }
    } catch (error) {
      console.log("BayGroupComposite:Error occured on Row click", error);
    }
  };
  toggleExpand = (data, open) => {
    try {
      let expandedRows = this.state.expandedRows;
      let expandedRowIndex = expandedRows.findIndex(
        (item) => item.GroupName === data.GroupName
      );
      if (open) {
        expandedRows.splice(expandedRowIndex, 1);
      } else {
        expandedRows.push(data);
      }
      this.setState({ expandedRows });
    } catch (error) {
      console.log("Error in ToggleExpand", error);
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
        PageName: KpiBayGroupList,
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
              bayGroupKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ bayGroupKPIList: [] });
            console.log("Error in baygroup KPIList:", result.ErrorList);
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
          console.log("Error while getting Captain KPIList:", error);
        });
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
      console.log("BayGroupComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  render() {
    // const user = this.props.userDetails.EntityResult;
    // let tmuiInstallType=TMUIInstallType.LIVE;

    // if(user.IsArchived)
    // tmuiInstallType=TMUIInstallType.ARCHIVE;

    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            onAdd={this.handleAdd}
            onDelete={this.authenticateDelete}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <BayGroupDetailsComposite
              key="BayGroupDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></BayGroupDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <KPIDashboardLayout
                kpiList={this.state.bayGroupKPIList}
                pageName="BayGroup"
              ></KPIDashboardLayout>
            </ErrorBoundary>
            <ErrorBoundary>
              <BayGroupSummaryComposite
                tableData={this.state.data}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectedItems={this.state.selectedItems}
                selectedBays={this.state.selectedBays}
                expandedRows={this.state.expandedRows}
                toggleExpand={this.toggleExpand}
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
              ></BayGroupSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <>
            <LoadingPage message="Loading"></LoadingPage>
          </>
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
        {/* <ErrorBoundary>
          <div className="detailsContainer">
            <object
              className="tmuiPlaceHolder"
              type="text/html"
              width="100%"
              height="880px"
              //data="http://localhost/tmui/BayGroupList_x.aspx"
              data={"/"+ tmuiInstallType +"/BayGroupList_x.aspx"}
            ></object>
          </div>
        </ErrorBoundary> */}
          {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnBayGroup}
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
BayGroupComposite.propTypes = {
  activeItem: PropTypes.object,
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string,
};
export default connect(mapStateToProps)(BayGroupComposite);
