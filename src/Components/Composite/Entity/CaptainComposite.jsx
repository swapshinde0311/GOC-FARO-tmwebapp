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
import { CaptainSummaryComposite } from "../Summary/CaptainSummaryComposite";
import CaptainDetailsComposite from "../Details/CaptainDetailsComposite";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiCaptainList, kpiStaffVisitorList } from "../../../JS/KPIPageName";
import { connect } from "react-redux";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import {
  functionGroups,
  fnCaptain,
  fnKPIInformation,
  fnStaffVisitor,
} from "../../../JS/FunctionGroups";
import * as Constants from "../../../JS/Constants";
import lodash from "lodash";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class CaptainComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
      this.props.selectedShareholder === null ||
      this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    data: {},
    captainKPIList: [],
    terminalCodes: [],
    userType: Constants.GeneralTMUserType.Captain,
    showAuthenticationLayout: false,
  };

  componentName = "CaptainComponent";

  componentDidMount() {
    try {
      this.getUsertType();
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      // var { operationsVisibilty } = { ...this.state };
      // operationsVisibilty.add =
      //   Utilities.isInFunction(
      //     this.props.userDetails.EntityResult.FunctionsList,
      //     functionGroups.add,
      //     this.state.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
      //   );
      // this.setState({
      //   operationsVisibilty,
      // });

      if (this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.getTerminalsList(
          this.props.userDetails.EntityResult.PrimaryShareholder
        );
    } catch (error) {
      console.log("CaptainComposite:Error occured on componentDidMount", error);
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

  getUsertType() {
    try {
      var userType = lodash.cloneDeep(this.state.userType);
      if (
        this.props.activeItem !== undefined &&
        this.props.activeItem.itemProps !== undefined &&
        this.props.activeItem.itemProps.userType !== undefined
      ) {
        userType = this.props.activeItem.itemProps.userType;
      }
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add =
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
        );
      this.setState({ userType, operationsVisibilty
}, () => {
        this.getCaptainList();
        this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
      });
    } catch (error) {
      console.log("CaptainComposite:Error occured on getUsertType", error);
    }
  }

  getCaptainList() {
    if (this.state.userType === Constants.GeneralTMUserType.Captain) {
      axios(
        RestAPIs.GetCaptainList,
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
            console.log("Error in getCaptainList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting Captain List:", error);
        });
    } else {
      axios(
        RestAPIs.GetAllStaffVisitor,
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
            console.log("Error in getCaptainList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting Captain List:", error);
        });
    }
  }

  getTerminalsList(shareholder) {
    try {
      if (shareholder !== null && shareholder !== "") {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(
            [shareholder],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ terminalCodes: response.data.EntityResult });
          }
        });
      } else {
        this.setState({ terminalCodes: [] });
      }
    } catch (error) {
      console.log("CaptainComposite:Error occured on getTerminalsList", error);
    }
  }

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add =
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            this.state.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
          );
        operationsVisibilty.delete = 
          Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
            this.state.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
          ) ;
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            Common_Status: data.Active,
            StaffVisitor_User_Type: data.UserType,
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
      console.log("CaptainComposite:Error occured on savedEvent", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = 
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          this.state.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
        );
      operationsVisibilty.delete = 
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          this.state.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
        );
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("CaptainComposite:Error occured on Row click", error);
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
            this.state.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
          );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("CaptainComposite:Error occured on handleSelection", error);
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteCaptainKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var CaptainCode = this.state.selectedItems[i]["Common_Code"];
        var UserType = this.state.selectedItems[i]["StaffVisitor_User_Type"];
        var keyData = {
          // ShareHolderCode : this.state.selectedShareholder,
          KeyCodes: [
            {
              Key: KeyCodes.generalTMUserCode,
              Value: CaptainCode,
            },
            {
              key: KeyCodes.userType,
              value:
                this.state.userType === Constants.GeneralTMUserType.Captain
                  ? Constants.GeneralTMUserType.Captain
                  : UserType,
            },
          ],
        };
        deleteCaptainKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteTMUsers,
        Utilities.getAuthenticationObjectforPost(
          deleteCaptainKeys,
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
            this.state.userType === Constants.GeneralTMUserType.Captain
              ? "CaptainInfo_DeleteSuccessMsg"
              : "StaffOrVisitorList_DeleteStatus",
            ["GeneralTMUserCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false, showAuthenticationLayout: false, });
            this.getCaptainList();
            this.getKPIList(this.state.selectedShareholder);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              showAuthenticationLayout: false,
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty, showAuthenticationLayout: false, });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] =
                this.state.userType === Constants.GeneralTMUserType.Captain
                  ? "CaptainInfo_Code"
                  : "StaffOrVisitor_Code";
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
      console.log("CaptainComposite:Error occured on handleDelete", error);
    }
  };

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
        PageName:
          this.state.userType === Constants.GeneralTMUserType.Captain
            ? kpiCaptainList
            : kpiStaffVisitorList,
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
            this.setState({
              captainKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ captainKPIList: [] });
            console.log("Error in captain KPIList:", result.ErrorList);
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
  }

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        this.state.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getCaptainList();
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log("CaptainComposite:Error occured on Back click", error);
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
        operationsVisibilty,
      });
    } catch (error) {
      console.log("CaptainComposite:Error occured on handleAdd", error);
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
      console.log("CaptainComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    return this.state.userType===Constants.GeneralTMUserType.Captain? fnCaptain: fnStaffVisitor
   };

  render() {
    return (
      <div>
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
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <CaptainDetailsComposite
              key="CaptainDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              terminalCodes={this.state.terminalCodes}
              userType={this.state.userType}
            ></CaptainDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.captainKPIList}
                  pageName="Captain"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <CaptainSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="CaptainList"
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
              ></CaptainSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
          {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={this.getFunctionGroupName()}
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

export default connect(mapStateToProps)(CaptainComposite);

CaptainComposite.propTypes = {
  activeItem: PropTypes.object,
};
