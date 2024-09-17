import React from "react";
import {
  functionGroups,
  fnPrimeMover,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import axios from "axios";
import { Icon, Button } from "@scuf/common";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import "react-toastify/dist/ReactToastify.css";
import { PrimeMoverSummaryPageComposite } from "../Summary/PrimeMoverSummaryComposite";
import PrimeMoverDetailsComposite from "../Details/PrimeMoverDetailsComposite";
import { TranslationConsumer } from "@scuf/localization";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiPrimeMoverList } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PrimeMoverComposite extends React.PureComponent {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    data: {},
    primeMoverKPIList: [],
    showAuthenticationLayout: false,
  };

  componentName = "PrimeMoverComponent";

  handleAdd = () => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("PrimeMoverComposite:Error occured on handleAdd", error);
    }
  };
  handleShareholderSelectionChange = (shareholder) => {
    try {
      let { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
        operationsVisibilty,
      });
      this.getPrimeMoverList(shareholder);
      if (
        this.props.tractorWithTrailer === undefined ||
        this.props.tractorWithTrailer === false
      )
        this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "PrimeMoverComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  handleRowClick = (item) => {
    try {
      if (this.props.tractorWithTrailer === undefined) {
        const operationsVisibilty = { ...this.state.operationsVisibilty };
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnPrimeMover
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPrimeMover
        );
        operationsVisibilty.shareholder = false;
        this.setState({
          isDetails: true,
          selectedRow: item,
          selectedItems: [item],
          operationsVisibilty,
        });
      }
    } catch (error) {
      console.log("PrimeMoverComposite:Error occured on Row click", error);
    }
  };
  handleSelection = (items) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };

      operationsVisibilty.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPrimeMover
        );

      this.setState({ selectedItems: items, operationsVisibilty }, () => {
        if (this.props.tractorWithTrailer === true) {
          this.props.handleSelectClick(
            "primeMover",
            this.state.selectedItems,
            this.state.data.Column
          );
        }
      });
    } catch (error) {
      console.log(
        "PrimeMoverComposite:Error occured on handleSelection",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deletePrimeMoverKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        let shCode = this.state.selectedShareholder;
        let primeMoverCode = this.state.selectedItems[i]["Common_Code"];
        let carrierCode =
          this.state.selectedItems[i]["PrimeMover_CarrierCompany"];
        let keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [
            { Key: KeyCodes.primeMoverCode, Value: primeMoverCode },
            { key: KeyCodes.carrierCode, Value: carrierCode },
          ],
        };
        deletePrimeMoverKeys.push(keyData);
      }

      axios(
        RestAPIs.DeletePrimeMover,
        Utilities.getAuthenticationObjectforPost(
          deletePrimeMoverKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          // console.log(response.data);
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

          let notification = Utilities.convertResultsDatatoNotification(
            result,
            "PrimeMover_DeletionStatus",
            ["PrimeMoverCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false, showAuthenticationLayout: false, });
            this.getPrimeMoverList(this.state.selectedShareholder);
            if (
              this.props.tractorWithTrailer === undefined ||
              this.props.tractorWithTrailer === false
            )
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
            this.setState({
               operationsVisibilty,
               showAuthenticationLayout: false,
             });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "PrimeMover_Code";
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
      console.log("PrimeMoverComposite:Error occured on handleDelete", error);
    }
  };

  //Get KPI for Prime Mover
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
        PageName: kpiPrimeMoverList,
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
              primeMoverKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ primeMoverKPIList: [] });
            console.log("Error in Prime Mover KPIList:", result.ErrorList);
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
          console.log("Error while getting Prime Mover KPIList:", error);
        });
    }
  }

  getPrimeMoverList(shareholder) {
    let transportationType = Constants.TransportationType.ROAD;

    axios(
      RestAPIs.GetPrimeMoverListForRole +
      "?ShareholderCode=" +
      shareholder +
      "&Transportationtype=" +
      transportationType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            data: { ...result.EntityResult },
            isReadyToRender: true,
          });
          if (
            this.props.tractorWithTrailer === true &&
            this.props.tractorSelection.length > 0
          ) {
            let primeMovers = this.props.tractorSelection;
            if (primeMovers.length > 0) {
              let tractorSelection = [];
              primeMovers.forEach((primeMover) => {
                let row = result.EntityResult.Table.find(
                  (row) => row.Common_Code === primeMover.PrimeMover.Code
                );
                if (row !== undefined) tractorSelection.push(row);
              });
              this.setState({ selectedItems: tractorSelection });
              this.props.getTractorList(
                tractorSelection,
                result.EntityResult.Column
              );
            }
          }
        } else {
          this.setState({ data: {}, isReadyToRender: true });
          console.log("Error in GetPrimeMoverListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: {}, isReadyToRender: true });
        console.log("Error while getting PrimeMover List:", error);
      });
  }

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnPrimeMover
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPrimeMover
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            //TransportationType: data.TransportationType,
            Common_Status: data.Active,
            PrimeMover_CarrierCompany: data.CarrierCompanyCode,
            // Common_Shareholder: data.ShareholderCode,
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
      console.log("PrimeMoverComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPrimeMover
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getPrimeMoverList(this.state.selectedShareholder);
      if (
        this.props.tractorWithTrailer === undefined ||
        this.props.tractorWithTrailer === false
      )
        this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("PrimeMoverComposite:Error occured on Back click", error);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.tractorWithTrailer === true &&
      nextProps.tractorSelection.length > 0
    ) {
      let primeMovers = nextProps.tractorSelection;
      if (primeMovers.length > 0) {
        let tractorSelection = [];
        primeMovers.forEach((primeMover) => {
          let row = this.state.data.Table.find(
            (row) => row.Common_Code === primeMover.PrimeMover.Code
          );
          if (row !== undefined) tractorSelection.push(row);
        });
        this.setState({ selectedItems: tractorSelection });
        this.props.getTractorList(tractorSelection, this.state.data.Column);
      }
    } else if (
      nextProps.tractorWithTrailer === true &&
      nextProps.tractorSelection.length === 0
    ) {
      this.setState({ selectedItems: [] });
    }
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPrimeMover
      );

      let shareholder = this.props.userDetails.EntityResult.PrimaryShareholder;
      if (this.props.tractorWithTrailer === true) {
        shareholder = this.props.tractorShareholder;
      }
      this.setState({
        operationsVisibilty,
        selectedShareholder: shareholder,
      });
      this.getPrimeMoverList(shareholder);
      if (
        this.props.tractorWithTrailer === undefined ||
        this.props.tractorWithTrailer === false
      )
        this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "PrimeMoverComposite:Error occured on ComponentDidMount",
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

  handleNextClick = () => {
    this.props.handleNextClick(
      "primeMover",
      this.state.selectedItems,
      this.state.data.Column
    );
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
      console.log("PrimeMoverComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    let selectionMode = "multiple";
    let fillPage = true;
    let loadingClass = "globalLoader";
    if (this.props.tractorWithTrailer === true) {
      selectionMode = "single";
      fillPage = false;
      loadingClass = "nestedList";
    }

    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              {this.props.tractorWithTrailer === undefined ? (
                <TMUserActionsComposite
                  operationsVisibilty={this.state.operationsVisibilty}
                  breadcrumbItem={this.props.activeItem}
                  shareholders={
                    this.props.userDetails.EntityResult.ShareholderList
                  }
                  selectedShareholder={this.state.selectedShareholder}
                  onShareholderChange={this.handleShareholderSelectionChange}
                  onDelete={this.authenticateDelete}
                  onAdd={this.handleAdd}
                  handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                ></TMUserActionsComposite>
              ) : (
                <>
                  {this.state.isDetails ? (
                    ""
                  ) : (
                    <div className="vehicleDataTableHeading">
                      <div className="col col-lg-10 dataTableHeadingPadding">
                        <h5>{t("Select_Tractors")}</h5>
                      </div>
                      <div className="col col-lg-1 vehicleDataTableIcon">
                        <div
                          className={
                            (this.state.operationsVisibilty.add
                              ? "iconCircle "
                              : "iconCircleDisable ") + "iconblock"
                          }
                              onClick={() => {if(this.state.operationsVisibilty.add){this.handleAdd()}}}
                        >
                          <Icon
                            root="common"
                            name="badge-plus"
                            size="small"
                            color="white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </ErrorBoundary>
            {this.state.isDetails ? (
              <ErrorBoundary>
                <PrimeMoverDetailsComposite
                  key="PrimeMoverDetails"
                  selectedRow={this.state.selectedRow}
                  onBack={this.handleBack}
                  onSaved={this.savedEvent}
                  selectedShareholder={this.state.selectedShareholder}
                ></PrimeMoverDetailsComposite>
              </ErrorBoundary>
            ) : this.state.isReadyToRender ? (
              <div>
                {this.props.tractorWithTrailer === true ? (
                  ""
                ) : (
                  <ErrorBoundary>
                    <div className="kpiSummaryContainer">
                      <KPIDashboardLayout
                        kpiList={this.state.primeMoverKPIList}
                        pageName="PrimeMover"
                      ></KPIDashboardLayout>
                    </div>
                  </ErrorBoundary>
                )}
                <ErrorBoundary>
                  <PrimeMoverSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    exportFileName="PrimeMoverList"
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
                  ></PrimeMoverSummaryPageComposite>
                  {this.props.tractorWithTrailer === true ? (
                    <div className="vehicleNextButton">
                      <Button onClick={this.handleNextClick}>
                        {t("Common_Next")}
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </ErrorBoundary>
              </div>
            ) : (
              <LoadingPage
                loadingClass={loadingClass}
                message="Loading"
              ></LoadingPage>
            )}
              {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnPrimeMover}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></UserAuthenticationLayout>
        ) : null}
            {this.props.tractorWithTrailer === true ? (
              ""
            ) : (
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
            )}
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(PrimeMoverComposite);

PrimeMoverComposite.propTypes = {
  activeItem: PropTypes.object,
  tractorWithTrailer: PropTypes.bool,
  tractorSelection: PropTypes.array,
  getTractorList: PropTypes.func,
  handleNextClick: PropTypes.func,
  handleSelectClick: PropTypes.func,
};
