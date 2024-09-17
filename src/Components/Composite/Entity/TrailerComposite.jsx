import React from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { TrailerSummaryPageComposite } from "../Summary/TrailerSummaryComposite";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { Icon, Button } from "@scuf/common";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnTrailer,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import TrailerDetailsComposite from "../Details/TrailerDetailsComposite";
import "react-toastify/dist/ReactToastify.css";
import { TranslationConsumer } from "@scuf/localization";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiTrailerList } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class TrailerComposite extends React.PureComponent {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    data: {},
    trailerKPIList: [],
    showAuthenticationLayout: false,
  };

  componentName = (this.props.vehicleWithTrailer ? "vehicleWithTrailer" : "") + "TrailerComponent";

  handleAdd = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("TrailerComposite:Error occured on handleAdd", error);
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
      this.getTrailerList(shareholder);
      if (
        this.props.vehicleWithTrailer === undefined ||
        this.props.vehicleWithTrailer === false
      )
        this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "TrailerComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  handleDelete = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deleteTrailerKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        let shCode = this.state.selectedShareholder;
        let trailerCode = this.state.selectedItems[i]["Common_Code"];
        let carrierCode = this.state.selectedItems[i]["TrailerList_Carrier"];
        let keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [
            { Key: KeyCodes.trailerCode, Value: trailerCode },
            { key: KeyCodes.carrierCode, Value: carrierCode },
          ],
        };
        deleteTrailerKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteTrailer,
        Utilities.getAuthenticationObjectforPost(
          deleteTrailerKeys,
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
            "TrailerDetails_DeleteStatus",
            ["TrailerCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false, showAuthenticationLayout: false, });
            this.getTrailerList(this.state.selectedShareholder);
            if (
              this.props.vehicleWithTrailer === undefined ||
              this.props.vehicleWithTrailer === false
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
            this.setState({ operationsVisibilty, showAuthenticationLayout: false, });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "Trailer_Code";
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
      console.log("TrailerComposite:Error occured on handleDelet", error);
    }
  };

  handleRowClick = (item) => {
    try {
      if (this.props.vehicleWithTrailer === undefined) {
        let operationsVisibilty = { ...this.state.operationsVisibilty };
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTrailer
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnTrailer
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
      console.log("TrailerComposite:Error occured on Row click", error);
    }
  };

  handleSelection = (items) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };

      operationsVisibilty.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnTrailer
        );

      this.setState({ selectedItems: items, operationsVisibilty }, () => {
        if (this.props.vehicleWithTrailer === true) {
          this.props.handleSelectClick(
            "trailer",
            this.state.selectedItems,
            this.state.data.Column
          );
        }
      });
    } catch (error) {
      console.log("TrailerComposite:Error occured on handleSelection", error);
    }
  };

  //Get KPI for Trailer
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
        PageName: kpiTrailerList,
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
              trailerKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ trailerKPIList: [] });
            console.log("Error in Trailer KPIList:", result.ErrorList);
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
          console.log("Error while getting trailer KPIList:", error);
        });
    }
  }

  getTrailerList(shareholder) {
    let transportationType = Constants.TransportationType.ROAD;

    axios(
      RestAPIs.GetTrailerListForRole +
      "?ShareholderCode=" +
      shareholder +
      "&Transportationtype=" +
      transportationType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
          if (
            this.props.vehicleWithTrailer === true &&
            this.props.trailerSelection.length > 0
          ) {
            let trailers = this.props.trailerSelection;
            if (trailers.length > 0) {
              let trailerSelection = [];
              trailers.forEach((trailer) => {
                let row = result.EntityResult.Table.find(
                  (row) => row.Common_Code === trailer.Trailer.Code
                );
                if (row !== undefined) trailerSelection.push(row);
              });
              this.setState({ selectedItems: trailerSelection });
              this.props.getTrailerList(
                trailerSelection,
                result.EntityResult.Column
              );
            }
          }
        } else {
          this.setState({ data: {}, isReadyToRender: true });
          console.log("Error in GetTrailerListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: {}, isReadyToRender: true });
        console.log("Error while getting Trailer List:", error);
      });
  }

  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTrailer
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnTrailer
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            //TransportationType: data.TransportationType,
            TrailerList_Carrier: data.CarrierCompanyCode,
            Common_Status: data.Active,
            Common_Shareholder: data.ShareholderCode,
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
      console.log("TrailerComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTrailer
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
      this.getTrailerList(this.state.selectedShareholder);
      if (
        this.props.vehicleWithTrailer === undefined ||
        this.props.vehicleWithTrailer === false
      )
        this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("TrailerComposite:Error occured on Back click", error);
    }
  };
  componentDidMount() {
    // clear session storage on page refresh
    window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTrailer
      );

      let shareholder = this.props.userDetails.EntityResult.PrimaryShareholder;
      if (this.props.vehicleWithTrailer === true)
        shareholder = this.props.vehicleShareholder;
      this.setState({
        operationsVisibilty,
        selectedShareholder: shareholder,
      });
      this.getTrailerList(shareholder);
      if (
        this.props.vehicleWithTrailer === undefined ||
        this.props.vehicleWithTrailer === false
      )
        this.getKPIList(shareholder);
    } catch (error) {
      console.log("TrailerComposite:Error occured on ComponentDidMount", error);
    }
  }

  componentWillUnmount = () => {
    // clear session storage
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.vehicleWithTrailer === true &&
      nextProps.trailerSelection.length > 0
    ) {
      let trailers = nextProps.trailerSelection;
      if (trailers.length > 0) {
        let trailerSelection = [];
        trailers.forEach((trailer) => {
          let row = this.state.data.Table.find(
            (row) => row.Common_Code === trailer.Trailer.Code
          );
          if (row !== undefined) trailerSelection.push(row);
        });
        this.setState({ selectedItems: trailerSelection });
        this.props.getTrailerList(trailerSelection, this.state.data.Column);
      }
    } else if (
      nextProps.vehicleWithTrailer === true &&
      nextProps.trailerSelection.length === 0
    ) {
      this.setState({ selectedItems: [] });
    }
  }
  handleNextClick = () => {
    this.props.handleNextClick(
      "trailer",
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
      console.log("TrailerComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  
  render() {
    let fillPage = true;
    let loadingClass = "globalLoader";
    if (this.props.vehicleWithTrailer === true) {
      fillPage = false;
      loadingClass = "nestedList";
    }
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              {this.props.vehicleWithTrailer === undefined ? (
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
                        <h5>{t("Select_Trailers")}</h5>
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
                <TrailerDetailsComposite
                  key="TrailerDetails"
                  selectedRow={this.state.selectedRow}
                  onBack={this.handleBack}
                  onSaved={this.savedEvent}
                  selectedShareholder={this.state.selectedShareholder}
                // genericProps={this.props.activeItem.itemProps}
                ></TrailerDetailsComposite>
              </ErrorBoundary>
            ) : this.state.isReadyToRender ? (
              <div>
                {this.props.vehicleWithTrailer === true ? (
                  ""
                ) : (
                  <ErrorBoundary>
                    <div className="kpiSummaryContainer">
                      <KPIDashboardLayout
                        kpiList={this.state.trailerKPIList}
                        pageName="Trailer"
                      ></KPIDashboardLayout>
                    </div>
                  </ErrorBoundary>
                )}
                <ErrorBoundary>
                  <TrailerSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={!this.props.vehicleWithTrailer}
                    exportFileName="TrailerList.xlsx"
                    columnPickerRequired={!this.props.vehicleWithTrailer}
                    columnGroupingRequired={!this.props.vehicleWithTrailer}
                    selectionRequired={true}
                    terminalsToShow={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .NoOfTerminalsToShow
                    }
                    selectedItems={this.state.selectedItems}
                    onRowClick={this.handleRowClick}
                    onSelectionChange={this.handleSelection}
                    fillPage={fillPage}
                    parentComponent={this.componentName}
                  ></TrailerSummaryPageComposite>
                  {this.props.vehicleWithTrailer === true ? (
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
            functionGroup={fnTrailer}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></UserAuthenticationLayout>
        ) : null}
            {this.props.vehicleWithTrailer === true ? (
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

export default connect(mapStateToProps)(TrailerComposite);

TrailerComposite.propTypes = {
  activeItem: PropTypes.object,
  vehicleWithTrailer: PropTypes.bool,
  trailerSelection: PropTypes.array,
  getTrailerList: PropTypes.func,
  handleNextClick: PropTypes.func,
  handleSelectClick: PropTypes.func,
};
