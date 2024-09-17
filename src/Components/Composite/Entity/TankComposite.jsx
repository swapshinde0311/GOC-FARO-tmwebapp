import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import TankDetailsComposite from "../Details/TankDetailsComposite";
import { TankSummaryComposite } from "../Summary/TankSummaryComposite";
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
import { kpiTankList } from "../../../JS/KPIPageName";
import {
  functionGroups,
  fnTank,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import ATGInterfaceConfigurationDetailsComposite from "../Details/ATGInterfaceConfigurationDetailsComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class TankComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    data: {},
    isComminglingEnable: false,
    shareholderVisible: false,
    selectedShareholder: "",
    tankKPIList: [],
    isLoadATGConfigurationDetails: false,
    tankObj: {},
    showAuthenticationLayout: false,
  };

  componentName = "TankComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTank
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getLookUpData();
      this.getTankList(this.props.userDetails.EntityResult.PrimaryShareholder);
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log("TankComposite:Error occured on componentDidMount", error);
    }
    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage);
  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage);
  };

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  };

  getTankList(shareholder) {
    axios(
      RestAPIs.GetTankListForRole + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getTank List:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting Tank List:", error);
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
      console.log("TankComposite:Error occured on handleAdd", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTank
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnTank
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            TerminalCode: data.TerminalCode,
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
      console.log("TankComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTank
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getTankList(this.state.selectedShareholder);
      this.getKPIList();
    } catch (error) {
      console.log("TankComposite:Error occured on Back click", error);
    }
  };

  handleATGBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTank
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnTank
      );
      operationsVisibilty.shareholder = false;
      // let item = {
      //   Common_Code: tankObj.Code,
      //   TerminalCode:tankObj.TerminalCode
      // }
      this.setState({
        isLoadATGConfigurationDetails: false,
        isDetails: true,
        selectedRow: this.state.selectedRow,
        selectedItems: [this.state.selectedRow],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("TankComposite:Error occured on Row click", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTank
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnTank
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("TankComposite:Error occured on Row click", error);
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
          fnTank
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("TankComposite:Error occured on handleSelection", error);
    }
  };

  //Get KPI for Tanks
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
        PageName: kpiTankList,
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
            this.setState({ tankKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ tankKPIList: [] });
            console.log("Error in tank KPIList:", result.ErrorList);
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
          console.log("Error while getting Tank KPIList:", error);
        });
    }
  }

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
      console.log("TankComposite : Error in authenticateDelete");
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteTankKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var TankCode = this.state.selectedItems[i]["Common_Code"];
        var TerminalCode = this.state.selectedItems[i]["TerminalCode"];
        var keyData = {
          KeyCodes: [
            { Key: KeyCodes.tankCode, Value: TankCode },
            {
              Key: KeyCodes.terminalCode,
              Value: TerminalCode !== "" ? TerminalCode : null,
            },
          ],
        };
        deleteTankKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteTank,
        Utilities.getAuthenticationObjectforPost(
          deleteTankKeys,
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
            "TankInfo_DeletionStatus",
            ["TankCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getTankList(this.state.selectedShareholder);
            this.getKPIList();
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
              messageResult.keyFields[0] = "TankTransaction_TankCode";
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
          this.setState({ operationsVisibilty, showAuthenticationLayout: false });
        });
    } catch (error) {
      console.log("TankComposite:Error occured on handleDelet", error);
    }
  };

  getLookUpData() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Commingling",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isComminglingEnable:
              result.EntityResult["EnableCommingling"] === "True"
                ? true
                : false,
            shareholderVisible:
              result.EntityResult["EnableCommingling"] === "True"
                ? true
                : false,
          });
        }
      });
    } catch (error) {
      console.log("TankComposite:Error occured on getLookUpData", error);
    }
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      let { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState(
        {
          selectedShareholder: shareholder,
          isReadyToRender: false,
          selectedItems: [],
          operationsVisibilty,
        },
        () => {
          this.getTankList(shareholder);
          this.getKPIList();
        }
      );
    } catch (error) {
      console.log(
        "TankComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  handleATGConfiguration = (data, selectedItem) => {
    let { operationsVisibilty } = { ...this.state };
    operationsVisibilty.delete = false;
    operationsVisibilty.add = false;
    this.setState({
      isLoadATGConfigurationDetails: true,
      tankObj: data,
      selectedRow: selectedItem,
      operationsVisibilty,
    });
    window.scrollTo(0, 0); //component to scroll from top while switching
  };

  render() {
    return (
      <div>
        {this.state.isLoadATGConfigurationDetails ? (
          <TranslationConsumer>
            {(t) => (
              <div>
                <ErrorBoundary>
                  <TMUserActionsComposite
                    operationsVisibilty={this.state.operationsVisibilty}
                    breadcrumbItem={this.props.activeItem}
                    shareholders={
                      this.props.userDetails.EntityResult.ShareholderList
                    }
                    shrVisible={false}
                    handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                  ></TMUserActionsComposite>
                </ErrorBoundary>
                <ErrorBoundary>
                  {/* <div
                      className="section"
                      style={{ cursor: "pointer" }}
                      onClick={() => this.handleATGBack}
                    >
                      <Icon
                        root="common"
                        name="caret-left"
                        color="black"
                      ></Icon>{"Back"}
                    </div> */}
                  {/* <div className="detailsContainer">
                    <object
                      style={{ position: "relative", top: "-160px" }}
                      type="text/html"
                      width="100%"
                      height="800px"
                      data={"http://localhost/tmui/AtgConfigurationDetails.aspx?tnkCode=" + this.state.tankObj.Code + "&tankGrpCode=" + this.state.tankObj.TankGroupCode}
                      // data={
                      //   "/TMUI/AtgConfigurationDetails.aspx?tnkCode=" +
                      //   this.state.tankObj.Code +
                      //   "&tankGrpCode=" +
                      //   this.state.tankObj.TankGroupCode
                      // }
                    ></object>
                  </div> */}
                  <ATGInterfaceConfigurationDetailsComposite
                    selectedRow={this.state.selectedRow}
                    onBack={this.handleATGBack}
                    onSaved={this.savedEvent}
                    tankObj={this.state.tankObj}
                  ></ATGInterfaceConfigurationDetailsComposite>
                  {/* <Button
                    className="backButton"
                    onClick={this.handleATGBack}
                    content={t("Back")}
                  ></Button> */}
                </ErrorBoundary>
              </div>
            )}
          </TranslationConsumer>
        ) : (
          <div>
            <ErrorBoundary>
              <TMUserActionsComposite
                operationsVisibilty={this.state.operationsVisibilty}
                breadcrumbItem={this.props.activeItem}
                shareholders={
                  this.props.userDetails.EntityResult.ShareholderList
                }
                onDelete={this.authenticateDelete}
                onAdd={this.handleAdd}
                shrVisible={this.state.shareholderVisible}
                onShareholderChange={this.handleShareholderSelectionChange}
                selectedShareholder={this.state.selectedShareholder}
                handleBreadCrumbClick={this.props.handleBreadCrumbClick}
              ></TMUserActionsComposite>
            </ErrorBoundary>
            {this.state.isDetails === true ? (
              <ErrorBoundary>
                <TankDetailsComposite
                  key="TankGroupDetails"
                  selectedRow={this.state.selectedRow}
                  onBack={this.handleBack}
                  onSaved={this.savedEvent}
                  selectedShareholder={this.state.selectedShareholder}
                  handleATGConfiguration={this.handleATGConfiguration}
                ></TankDetailsComposite>
              </ErrorBoundary>
            ) : this.state.isReadyToRender ? (
              <div>
                <ErrorBoundary>
                  <div className="kpiSummaryContainer">
                    <KPIDashboardLayout
                      kpiList={this.state.tankKPIList}
                      pageName="Tank"
                    ></KPIDashboardLayout>
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <TankSummaryComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    exportFileName="TankList"
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
                  ></TankSummaryComposite>
                </ErrorBoundary>
              </div>
            ) : (
              <LoadingPage message="Loading"></LoadingPage>
            )}
            {this.state.showAuthenticationLayout ? (
              <UserAuthenticationLayout
                Username={this.props.userDetails.EntityResult.UserName}
                functionName={functionGroups.remove}
                functionGroup={fnTank}
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
        )}
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

export default connect(mapStateToProps)(TankComposite);

TankComposite.propTypes = {
  activeItem: PropTypes.object,
};
