import React, { Component } from "react";
import { HSEUserActionsComposite } from "../Common/HSEUserActionsComposite";
import { HSEInspectionSummaryPageInspection } from "../Summary/HSEInspectionSummaryComposite";
import HSEInspectionDetailsComposite from "../Details/HSEInspectionDetailsComposite";
import axios from "axios";
import * as Constants from "./../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { functionGroups, fnHSEInspection } from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { Tab } from "@scuf/common";
import lodash from "lodash";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import "../../../CSS/hseInspection.css";
import Error from "../../Error";
import { TranslationConsumer } from "@scuf/localization";

class HSEInspectionComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    operationsVisibility: { add: false, delete: false, terminal: true },
    inprogressList: {},
    scheduledList: {},
    historyList: {},
    inprogressListLoaded: false,
    scheduledListLoaded: false,
    historyListLoaded: false,
    selectedRow: {},
    selectedTerminal:"",
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    tabActiveIndex: 0,
    lookUpData: null,
    isEnable: true,
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getTerminalList();
     

    } catch (error) {
      console.log(
        "HSEInspectionComposite: Error occurred on componentDidMount",
        error
      );
    }
  }

  getTerminalList() {
    try {
     
      let userShareholderList = [];
      let secondaryShareholders=this.props.userDetails.EntityResult.SecondaryShareholders;
  
      userShareholderList.push(this.props.userDetails.EntityResult.PrimaryShareholder);
      
      if (Array.isArray(secondaryShareholders)) {
        secondaryShareholders.forEach((sh) => {
        userShareholderList.push(sh);
      });
    }

      axios(
        RestAPIs.GetTerminals,
        Utilities.getAuthenticationObjectforPost(
          userShareholderList,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          )
            this.setState({ terminalOptions: result.EntityResult });
          this.setState({ selectedTerminal: this.state.terminalOptions[0] });
          this.getLookUpData();
        }
      });
    } catch (err) {
      console.log("SiteViewComposite:Error occured on getTerminalsList", err);
    }
  }

  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=HSEInspection",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isEnable = true;
          switch (this.props.activeItem.itemProps.transportationType) {
            case Constants.TransportationType.ROAD:
              if (result.EntityResult.EnableRoad === "False") {
                isEnable = false;
              }
              break;
            case Constants.TransportationType.MARINE:
              if (result.EntityResult.EnableMarine === "False") {
                isEnable = false;
              }
              break;
            case Constants.TransportationType.RAIL:
              if (result.EntityResult.EnableRail === "False") {
                isEnable = false;
              }
              break;
            case Constants.TransportationType.PIPELINE:
              if (result.EntityResult.EnablePipeline === "False") {
                isEnable = false;
              }
              break;
            default:
              isEnable = true;
          }
          this.setState({ lookUpData: result.EntityResult, isEnable });
          if (isEnable) {
            const operationsVisibility = lodash.cloneDeep(
              this.state.operationsVisibility
            );
            operationsVisibility.add = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              this.props.activeItem.itemProps.transportationType +
                fnHSEInspection
            ) && !this.isNodeEnterpriseOrWebortal();
            this.setState({
              operationsVisibility,
              selectedShareholder:
                this.props.userDetails.EntityResult.PrimaryShareholder,
            });
            this.getInprogressInspectionList();
            this.getTransactionScheduledList();
            this.getInspectionHistoryList();
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  isNodeEnterpriseOrWebortal()
  {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode || this.props.userDetails.EntityResult.IsWebPortalUser) {
     return true;
    } else {
      return false;
    }
  }

  getInprogressInspectionList() {
    axios(
      RestAPIs.GetInprogressInspectionList +
        "?TransportationType=" +
        this.props.activeItem.itemProps.transportationType +  "&TerminalCode=" + this.state.selectedTerminal,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            this.props.activeItem.itemProps.transportationType ===
              Constants.TransportationType.MARINE &&
            Array.isArray(result.EntityResult.Table)
          ) {
            for (let i = 0; i < result.EntityResult.Table.length; i++) {
              result.EntityResult.Table[i].Vessel_Code =
                result.EntityResult.Table[i].VehicleCode;
              result.EntityResult.Table[i].Vessel_Type =
                result.EntityResult.Table[i].VehicleType;
            }
          }
          this.setState({
            inprogressList: result.EntityResult,
            inprogressListLoaded: true,
          });
        } else {
          this.setState({ inprogressList: {}, inprogressListLoaded: true });
          console.log(
            "Error in getInprogressInspectionList:",
            result.ErrorList
          );
        }
        this.checkReadyToRender();
      })
      .catch((error) => {
        this.setState({ inprogressList: {}, inprogressListLoaded: true });
        console.log("Error while getting InprogressInspection:", error);
        this.checkReadyToRender();
      });
  }

  handleTerminalSelectionChange = (terminal) => {
    try {
      this.setState({
        selectedTerminal: terminal,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: true,
      });
      this.getLookUpData();
    } catch (error) {
      console.log(
        "HSEConfigurationComposite:Error occured on handleTerminalSelectionChange",
        error
      );
    }
  };

  getTransactionScheduledList() {
    axios(
      RestAPIs.GetTransactionScheduledList +
        "?TransportationType=" +
        this.props.activeItem.itemProps.transportationType +  "&TerminalCode=" + this.state.selectedTerminal,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            this.props.activeItem.itemProps.transportationType ===
              Constants.TransportationType.MARINE &&
            Array.isArray(result.EntityResult.Table)
          ) {
            for (let i = 0; i < result.EntityResult.Table.length; i++) {
              result.EntityResult.Table[i].Vessel_Code =
                result.EntityResult.Table[i].VehicleCode;
              result.EntityResult.Table[i].Vessel_Type =
                result.EntityResult.Table[i].VehicleType;
            }
          } else if (
            this.props.activeItem.itemProps.transportationType ===
              Constants.TransportationType.RAIL &&
            Array.isArray(result.EntityResult.Table)
          ) {
            for (let i = 0; i < result.EntityResult.Table.length; i++) {
              result.EntityResult.Table[i].HseInspectionStatus =
                result.EntityResult.Table[i].OverAllHSEInspectionStatus;
            }
          } else if (
            this.props.activeItem.itemProps.transportationType ===
              Constants.TransportationType.PIPELINE &&
            Array.isArray(result.EntityResult.Table)
          ) {
            for (let i = 0; i < result.EntityResult.Table.length; i++) {
              result.EntityResult.Table[i].HseInspectionStatus =
                result.EntityResult.Table[i].OverAllHSEInspectionStatus;
            }
          }
          this.setState({
            scheduledList: result.EntityResult,
            scheduledListLoaded: true,
          });
        } else {
          this.setState({ scheduledList: {}, scheduledListLoaded: true });
          console.log(
            "Error in getInprogressInspectionList:",
            result.ErrorList
          );
        }
        this.checkReadyToRender();
      })
      .catch((error) => {
        this.setState({ scheduledList: {}, scheduledListLoaded: true });
        console.log("Error while getting InprogressInspection:", error);
        this.checkReadyToRender();
      });
  }

  getInspectionHistoryList() {
    let fromDate = new Date(this.state.fromDate);
    let toDate = new Date(this.state.toDate);
    fromDate.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);
    let obj = {
      startRange: fromDate,
      endRange: toDate,
      TransportationType: this.props.activeItem.itemProps.transportationType,
      TerminalCode:  this.state.selectedTerminal,
    };
    axios(
      RestAPIs.GetHistoryInspectionList,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            this.props.activeItem.itemProps.transportationType ===
              Constants.TransportationType.MARINE &&
            Array.isArray(result.EntityResult.Table)
          ) {
            for (let i = 0; i < result.EntityResult.Table.length; i++) {
              result.EntityResult.Table[i].Vessel_Code =
                result.EntityResult.Table[i].VehicleCode;
              result.EntityResult.Table[i].Vessel_Type =
                result.EntityResult.Table[i].VehicleType;
            }
          }
          this.setState({
            historyList: result.EntityResult,
            historyListLoaded: true,
          });
        } else {
          this.setState({ historyList: {}, historyListLoaded: true });
          console.log("Error in getInspectionHistoryList:", result.ErrorList);
        }
        this.checkReadyToRender();
      })
      .catch((error) => {
        this.setState({ historyList: {}, historyListLoaded: true });
        console.log("Error while getting InspectionHistoryList:", error);
        this.checkReadyToRender();
      });
  }

  checkReadyToRender() {
    if (
      this.state.inprogressListLoaded &&
      this.state.scheduledListLoaded &&
      this.state.historyListLoaded
    ) {
      this.setState({ isReadyToRender: true });
    }
  }

  handleAdd = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.add = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibility,
      });
    } catch (error) {
      console.log("HSEInspectionComposite: Error occurred on handleAdd", error);
    }
  };

  handleRowClick = (item) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.terminal = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        operationsVisibility,
      });
    } catch (error) {
      console.log("RailRouteComposite:Error occurred on handleRowClick", error);
    }
  };

  handleBack = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.terminal= true;
      operationsVisibility.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        this.props.activeItem.itemProps.transportationType + fnHSEInspection
      ) && !this.isNodeEnterpriseOrWebortal();
      this.setState({
        isDetails: false,
        selectedRow: {},
        operationsVisibility,
        isReadyToRender: false,
      });
      this.getInprogressInspectionList();
      this.getTransactionScheduledList();
      this.getInspectionHistoryList();
    } catch (error) {
      console.log(
        "HSEConfigurationComposite: Error occurred on Back click",
        error
      );
    }
  };

  savedEvent = (notification) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      if (notification.messageType === "success") {
        operationsVisibility.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          this.props.activeItem.itemProps.transportationType +
                fnHSEInspection
        ) && !this.isNodeEnterpriseOrWebortal();
        this.setState({ isDetailsModified: true, operationsVisibility });
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
        "HSEInspectionComposite: Error occurred on savedEvent",
        error
      );
    }
  };

  handleDateTextChange = (value, error) => {
    if (value === "")
      this.setState({ dateError: "", toDate: "", fromDate: "" });
    if (error !== null && error !== "")
      this.setState({
        dateError: "Common_InvalidDate",
        toDate: "",
        fromDate: "",
      });
    else {
      this.setState({ dateError: "", toDate: value.to, fromDate: value.from });
    }
  };

  handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
  };

  handleLoadOrders = () => {
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getInspectionHistoryList();
    }
  };

  handleTabChange = (activeIndex) => {
    try {
      this.setState({ tabActiveIndex: activeIndex });
    } catch (error) {
      console.log(
        "HSEInspectionComposite: Error occurred on handleTabChange",
        error
      );
    }
  };

  render() {
    let fillPage = true;
    let loadingClass = "globalLoader";
    if (
      this.props.shipmentSource !== undefined &&
      this.props.shipmentSource !== "" &&
      this.props.shipmentSource !== null
    ) {
      fillPage = false;
      loadingClass = "nestedList";
    }
    return (
      <div>
        {this.props.shipmentSource === undefined ||
        this.props.shipmentSource === "" ||
        this.props.shipmentSource === null ? (
          <ErrorBoundary>
            <HSEUserActionsComposite
              operationsVisibilty={this.state.operationsVisibility}
              breadcrumbItem={this.props.activeItem}
              onAdd={this.handleAdd}
              // onDelete={this.handleAdd}
              terminalVisible={this.isNodeEnterpriseOrWebortal()}
              terminals={this.state.terminalOptions}
              selectedTerminal={this.state.selectedTerminal}
              onTerminalChange={this.handleTerminalSelectionChange}
              handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            />
          </ErrorBoundary>
        ) : (
          ""
        )}
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <HSEInspectionDetailsComposite
              Key="HSEInspectionDetails"
              transportationType={
                this.props.activeItem.itemProps.transportationType
              }
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              selectedTerminal={this.state.selectedTerminal}
              selectedShareholder={this.state.selectedRow.Shareholder===null? this.state.selectedShareholder:this.state.selectedRow.Shareholder}
              lookUpData={this.state.lookUpData}
            />
          </ErrorBoundary>
        ) : (
          <div>
            {this.state.isReadyToRender ? (
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div
                      className={
                        fillPage === true ? "compositeTransactionList" : ""
                      }
                    >
                      <Tab
                        activeIndex={this.state.tabActiveIndex}
                        onTabChange={this.handleTabChange}
                      >
                        <Tab.Pane title={t("HSE_InProgress")}>
                          <HSEInspectionSummaryPageInspection
                            tableData={this.state.inprogressList.Table}
                            columnDetails={this.state.inprogressList.Column}
                            pageSize={
                              this.props.userDetails.EntityResult.PageAttibutes
                                .WebPortalListPageSize
                            }
                            terminalsToShow={
                              this.props.userDetails.EntityResult.PageAttibutes
                                .NoOfTerminalsToShow
                            }
                            onRowClick={this.handleRowClick}
                            fillPage={fillPage}
                          />
                        </Tab.Pane>
                        <Tab.Pane title={t("HSE_ArriveToday")}>
                          <HSEInspectionSummaryPageInspection
                            tableData={this.state.scheduledList.Table}
                            columnDetails={this.state.scheduledList.Column}
                            pageSize={
                              this.props.userDetails.EntityResult.PageAttibutes
                                .WebPortalListPageSize
                            }
                            terminalsToShow={
                              this.props.userDetails.EntityResult.PageAttibutes
                                .NoOfTerminalsToShow
                            }
                            onRowClick={this.handleRowClick}
                            fillPage={fillPage}
                          />
                        </Tab.Pane>
                        <Tab.Pane title={t("HSE_HistoryList")}>
                          <ErrorBoundary>
                            <TMTransactionFilters
                              dateRange={{
                                from: this.state.fromDate,
                                to: this.state.toDate,
                              }}
                              dateError={this.state.dateError}
                              handleDateTextChange={this.handleDateTextChange}
                              handleRangeSelect={this.handleRangeSelect}
                              handleLoadOrders={this.handleLoadOrders}
                              filterText="LoadInspection"
                            ></TMTransactionFilters>
                          </ErrorBoundary>
                          <HSEInspectionSummaryPageInspection
                            tableData={this.state.historyList.Table}
                            columnDetails={this.state.historyList.Column}
                            pageSize={
                              this.props.userDetails.EntityResult.PageAttibutes
                                .WebPortalListPageSize
                            }
                            terminalsToShow={
                              this.props.userDetails.EntityResult.PageAttibutes
                                .NoOfTerminalsToShow
                            }
                            onRowClick={this.handleRowClick}
                            fillPage={fillPage}
                          />
                        </Tab.Pane>
                      </Tab>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            ) : (
              <>
                {this.state.isEnable ? (
                  <LoadingPage
                    loadingClass={loadingClass}
                    message=""
                  ></LoadingPage>
                ) : (
                  <Error errorMessage="HSEInspectionDisabled"></Error>
                )}
              </>
            )}
          </div>
        )}

        {this.props.shipmentSource === undefined ? (
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

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HSEInspectionComposite);

HSEInspectionComposite.propTypes = {
  activeItem: PropTypes.object,
};
