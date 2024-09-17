import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { ProductReconciliationSummaryComposite } from "../Summary/ProductReconciliationSummaryComposite";
import ProductReconciliationReportDetailsComposite from "../Details/ProductReconciliationReportDetailsComposite";
import ProductReconciliationScheduleDetailsComposite from "../Details/ProductReconciliationScheduleDetailsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import lodash from "lodash";
import "../../../CSS/styles.css";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import NotifyEvent from "../../../JS/NotifyEvent";
import PropTypes from "prop-types";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import * as Constants from "../../../JS/Constants";
import { Button } from "@scuf/common";
import { functionGroups, fnProductReconciliationReports } from "../../../JS/FunctionGroups";
import { emptyReconciliationScheduleInfo, emptyReconciliationInfo } from "../../../JS/DefaultEntities";
import * as KeyCodes from "../../../JS/KeyCodes";
import { TranslationConsumer } from "@scuf/localization";
import dayjs from "dayjs";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ProductReconciliationReportComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    selectedRow: {},
    selectedItems: [],
    data: {},
    showReport: false,
    reportType: "",
    selectedScheduleInfo: {},
    refreshScheduleUI: false,
    showSchedule: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    reonciliationReportNames: { tank: '', meter: '', compareFolio: '' },
    addSchedule: false,
    shareholderCode: "",
    showAuthenticationLayout: false
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLookUpData();
      this.setState(
        {
          selectedScheduleInfo: lodash.cloneDeep(emptyReconciliationScheduleInfo),shareholderCode:this.props.userDetails.EntityResult.PrimaryShareholder,
        });
      this.getProductReconciliationList();


    } catch (error) {
      console.log(
        "ProductReconciliationReportComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getProductReconciliationList() {
    axios(
      RestAPIs.GetProductReconciliationListForRole,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {

          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getProductReconciliationList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting getProductReconciliationList:", error);
      });
  }


  handleBack = () => {
    try {

      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = false;
      operationsVisibilty.delete = false;


      this.setState({
        isDetails: false,
        showSchedule: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
        operationsVisibilty,
        addSchedule:false,
      });
      this.getProductReconciliationList();

    } catch (error) {
      console.log("ProductReconciliationReportComposite:Error occured on Back click", error);
    }
  };


  setSelectedSchedule = (selscheduleInfo) => {
    try {

      var { operationsVisibilty } = { ...this.state };

      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnProductReconciliationReports
      );
      this.setState({
        operationsVisibilty, selectedScheduleInfo: selscheduleInfo, addSchedule: false, refreshScheduleUI:false,
      });
    } catch (error) {
      console.log("ProductReconciliationReportComposite:Error occured on setSelectedSchedule", error);
    }
  };


  unSetSelectedSchedule = () => {
    try {

      var { operationsVisibilty } = { ...this.state };

      operationsVisibilty.delete =  false;
      this.setState({
        operationsVisibilty, selectedScheduleInfo: {}, addSchedule: false,
      });
    } catch (error) {
      console.log("ProductReconciliationReportComposite:Error occured on unSetSelectedSchedule", error);
    }
  };

  handleRowClick = (item) => {
    try {

      this.setState({

        selectedRow: item.rowData,
        selectedItems: [item.rowData],

      });
      if (item.field !== undefined && item.field === 'ReconciliationReportDetail_btnViewReconcile') {
        this.handleViewReport();
      }
      else {
        this.setState({
          isDetails: true,
          showSchedule: false,
        });
      }
    } catch (error) {
      console.log("ProductReconciliationReportComposite:Error occured on Row click", error);
    }
  };



  handleReportSchedule = () => {
    try {

      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;

      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnProductReconciliationReports
      );
      this.setState({
        isDetails: false,
        showSchedule: true,
        operationsVisibilty
      });
    } catch (error) {
      console.log("ProductReconciliationReportComposite:Error occured on schedule List click", error);
    }
  };

  handleSelection = (items) => {
    try {
      this.setState({ selectedItems: items });
    } catch (error) {
      console.log(
        "ProductReconciliationReportComposite:Error occured on handleSelection",
        error
      );
    }
  };

  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=ReportConfig",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          var { reonciliationReportNames } = { ...this.state };
          reonciliationReportNames.tank = result.EntityResult.TankFolio;
          reonciliationReportNames.meter = result.EntityResult.MeterReconciliation;
          reonciliationReportNames.compareFolio = result.EntityResult.TankFolioCompare;

          this.setState({ reonciliationReportNames });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ProductReconciliationReportComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  handleModalBack = () => {
    this.setState({ showReport: false, reportType: "" });
  };

  renderModal() {
    let reportType = this.state.reportType;
    var { reonciliationReportNames } = { ...this.state };

    if(reportType==="")
      return;

    let path = null;
    let reportName = '';
    if (reportType === "entity") {
      if (this.state.selectedRow.Reconcillation_Type === "Meter")
        reportName = reonciliationReportNames.meter
      else
        reportName = reonciliationReportNames.tank
    }
    else {
      reportName = reonciliationReportNames.compareFolio
    }
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/" + reportName;
    } else {
      path = "TM/" + Constants.TMReports + "/" + reportName;
    }
    let paramValues = {};

    if (reportType === "entity") {
      paramValues = {
        Culture: this.props.userDetails.EntityResult.UICulture,
        ReconciliationCode:
          this.state.selectedItems.length === 1
            ? this.state.selectedItems[0].Common_Code
            : this.state.selectedRow.Common_Code,
        readonly: 1
      };
    }
    else {
      let minStartDate= this.state.selectedItems[0].ReconciliationReportDetail_StartDate;
      this.state.selectedItems.forEach(function (entry) {
        if (entry.ReconciliationReportDetail_StartDate < minStartDate) {
          minStartDate = entry.ReconciliationReportDetail_StartDate;
      }
    });

    let maxEndDate= this.state.selectedItems[0].ReconciliationReportDetail_EndDate;
    this.state.selectedItems.forEach(function (entry) {
      if (entry.ReconciliationReportDetail_EndDate > maxEndDate) {
        maxEndDate = entry.ReconciliationReportDetail_EndDate;
    }
  });
  
      paramValues = {
        Culture: this.props.userDetails.EntityResult.UICulture,
        StartDate:dayjs(minStartDate).format("DD-MMM-YYYY HH:mm:ss").toString(),
        EndDate:dayjs(maxEndDate).format("DD-MMM-YYYY HH:mm:ss").toString(),
          readonly: 1
    };
    }
    return (
      <ErrorBoundary>
        <ReportDetails
          showReport={this.state.showReport}
          handleBack={this.handleModalBack}
          handleModalClose={this.handleModalBack}
          proxyServerHost={RestAPIs.WebAPIURL}
          reportServiceHost={this.reportServiceURI}
          filePath={path}
          parameters={paramValues}
        />
      </ErrorBoundary>
    );
  }




  handleViewReport = () => {
    try {
      if (this.reportServiceURI === undefined) {
        axios(
          RestAPIs.GetReportServiceURI,
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.reportServiceURI = response.data.EntityResult;
            this.setState({ showReport: true, reportType: 'entity' });
          }
        });
      } else {
        this.setState({ showReport: true, reportType: 'entity' });
      }
    }
    catch (error) {
      console.log(
        "ProductReconciliationReportComposite:Error occured on handleView Report",
        error
      );
    }
  };

  handleFolioCompare = () => {
    try {
      if (this.reportServiceURI === undefined) {
        axios(
          RestAPIs.GetReportServiceURI,
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.reportServiceURI = response.data.EntityResult;
            this.setState({ showReport: true, reportType: 'folioCompare' });
          }
        });
      } else {
        this.setState({ showReport: true, reportType: 'folioCompare' });
      }
    }
    catch (error) {
      console.log(
        "ProductReconciliationReportComposite:Error occured on handleView Report",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {

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
        "FinishedProductComposite:Error occured on savedEvent",
        error
      );
    }
  };

  deleteEvent = (notification) => {
    try {
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );

    } catch (error) {
      console.log("SiteTreeView:Error occured on deleteEvent", error);
    }
  };

  handleDelete = () => {
    this.handleAuthenticationClose();
    try {

      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;

      this.setState({
        operationsVisibilty,
      });
      let selectedScheduleInfo = this.state.selectedScheduleInfo;
      if (selectedScheduleInfo.IsRecurrent === false) {
        let modReconRepInfo = this.prepareReconciliationReportDetails(selectedScheduleInfo);
        modReconRepInfo.Status = Constants.ProductReconciliationReportStatus.Cancelled;
        this.disableOneTimeReconciliationSchedule(modReconRepInfo);
      }
      else {
        selectedScheduleInfo.Active = true;
        this.DisableRecurrenceSchedule(selectedScheduleInfo);
      }

    } catch (error) {
      console.log("Product Reconciliation composite:Error occured on handleDelete", error);
    }
  };

  DisableRecurrenceSchedule(modReportSchedule) {

    let keyCode = [
      {
        key: KeyCodes.reconciliationCode,
        value: modReportSchedule.ScheduleName,
      },
    ];

    let obj = {
      keyDataCode: KeyCodes.reconciliationCode,
      KeyCodes: keyCode,
      Entity: modReportSchedule,
    };

    let notification = {
      messageType: "critical",
      message: "ReconciliationSchedule_DisabledSuccess",
      messageResultDetails: [
        {
          keyFields: ["ReconciliationReportDetail_RcCode"],
          keyValues: [modReportSchedule.ScheduleName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };


    axios(
      RestAPIs.DisableRecurrenceSchedule,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    ).then((response) => {
      let result = response.data;
      notification.messageType = result.IsSuccess ? "success" : "critical";
      notification.messageResultDetails[0].isSuccess = result.IsSuccess;
      if (result.IsSuccess === true) {
        this.setState(
          {
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnProductReconciliationReports
            ),
            refreshScheduleUI: true,
          },

        );
      } else {
        notification.messageResultDetails[0].errorMessage =
          result.ErrorList[0];
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnProductReconciliationReports
          ),
        });
        console.log("Error in DisableRecurrenceSchedule:", result.ErrorList);
      }
      this.deleteEvent(notification);
    })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnProductReconciliationReports
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.deleteEvent(notification);
      });
  }

  prepareReconciliationReportDetails = (schedInfo) => {
    let modReconRepInfo = lodash.cloneDeep(emptyReconciliationInfo);
    try {

      modReconRepInfo.ReconciliationCode = schedInfo.ScheduleName;
      modReconRepInfo.EntityTypeCode = schedInfo.EntityTypeCode;
      modReconRepInfo.StartDate = schedInfo.StartDateTime;
      modReconRepInfo.EndDate = schedInfo.EndDateTime;
      modReconRepInfo.LastUpdatedTime = new Date();
      modReconRepInfo.LastUpdatedBy = this.props.userDetails.EntityResult.Firstname + " " + this.props.userDetails.EntityResult.LastName;

    } catch (error) {
      console.log("ProductReconciliationReportComposite:Error occured on prepareReconciliationReportDetails", error);
    }
    return modReconRepInfo;
  };

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnProductReconciliationReports
      );
      this.setState({
        operationsVisibilty,
        addSchedule: true,
      });
    } catch (error) {
      console.log("Product Reconciliation composite:Error occured on handleAdd", error);
    }
  };


  disableOneTimeReconciliationSchedule(modReconciliationInfo) {

    let keyCode = [
      {
        key: KeyCodes.reconciliationCode,
        value: modReconciliationInfo.Code,
      },
    ];

    let obj = {
      keyDataCode: KeyCodes.reconciliationCode,
      KeyCodes: keyCode,
      Entity: modReconciliationInfo,
    };

    let notification = {
      messageType: "critical",
      message: "ReconciliationSchedule_DisabledSuccess",
      messageResultDetails: [
        {
          keyFields: ["ReconciliationReportDetail_RcCode"],
          keyValues: [modReconciliationInfo.ReconciliationCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };


    axios(
      RestAPIs.UpdateReconciliationReport,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    ).then((response) => {
      let result = response.data;
      notification.messageType = result.IsSuccess ? "success" : "critical";
      notification.messageResultDetails[0].isSuccess = result.IsSuccess;
      if (result.IsSuccess === true) {
        this.setState(
          {
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnProductReconciliationReports
            ),
            refreshScheduleUI: true,
          },

        );
      } else {
        notification.messageResultDetails[0].errorMessage =
          result.ErrorList[0];
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnProductReconciliationReports
          ),
        });
        console.log("Error in update ReconciliationReport:", result.ErrorList);
      }
      this.deleteEvent(notification);
    })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnProductReconciliationReports
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.deleteEvent(notification);
      });
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
      console.log("Product Reconciliation Report : Error in authenticateDelete");
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
            shrVisible={false}
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true || this.state.showSchedule === true ? (
          <ErrorBoundary>
            {this.state.isDetails === true ? (
              <ProductReconciliationReportDetailsComposite
                key="ProductReconciliationReportDetails"
                selectedRow={this.state.selectedRow}
                onBack={this.handleBack}
                onSaved={this.savedEvent}
                shareholerCode= {this.state.shareholderCode}
              ></ProductReconciliationReportDetailsComposite>
            ) : (
              <ErrorBoundary>
                <ProductReconciliationScheduleDetailsComposite
                  key="ProductReconciliationScheduleDetails"
                  onBack={this.handleBack}
                  onSaved={this.savedEvent}
                  onScheduleSelect={this.setSelectedSchedule}
                  onUnScheduleSelect={this.unSetSelectedSchedule}
                  refreshScheduleUIRequired={this.state.refreshScheduleUI}
                  addSchedule={this.state.addSchedule}
                ></ProductReconciliationScheduleDetailsComposite>
              </ErrorBoundary>
            )}
          </ErrorBoundary>
        ) : this.state.isReadyToRender && !this.state.showReport ? (
          <ErrorBoundary>

            <ProductReconciliationSummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              selectedItems={this.state.selectedItems}
              onRowClick={this.handleRowClick}
              onSelectionChange={this.handleSelection}
            ></ProductReconciliationSummaryComposite>

            <TranslationConsumer>
              {(t) => (
                <div className="row userActionPosition">
                  <div className="col-12 col-md-3 col-lg-4">
                    <Button
                      type="primary"
                      disabled={this.state.showSchedule || this.state.selectedItems.length === 0 || this.state.selectedItems.length === 1}
                      content={t("ProductReconciliation_CompareFolio")}
                      onClick={this.handleFolioCompare}
                    ></Button>
                  </div>
                  <div className="col-12 col-md-9 col-lg-8">
                    <div style={{ float: "right" }}>
                      <Button
                        type="primary"
                        disabled={this.state.showSchedule}
                        content={t("ReportSchedules_ReportSchedule")}
                        onClick={this.handleReportSchedule}
                      ></Button>
                    </div>
                  </div>

                </div>)}
            </TranslationConsumer>
          </ErrorBoundary>
        ) : (
          <LoadingPage message=""></LoadingPage>
        )}

        {
          

        Object.keys(this.state.selectedRow).length > 0 &&
          this.state.selectedItems.length === 1 && this.state.reportType === 'entity'
          ? this.renderModal()
          : ""}

        { this.state.selectedItems.length > 1 && this.state.reportType === 'folioCompare'
          ? this.renderModal()
          : ""}

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
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnProductReconciliationReports}
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

export default connect(mapStateToProps)(ProductReconciliationReportComposite);

ProductReconciliationReportComposite.propTypes = {
  activeItem: PropTypes.object,
};
