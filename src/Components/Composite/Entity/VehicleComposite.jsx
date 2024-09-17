import React from "react";
import { VehicleSummaryPageComposite } from "../Summary/VehicleSummaryComposite";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { Icon, Button } from "@scuf/common";
import axios from "axios";
import {
  functionGroups,
  fnVehicle,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import "react-toastify/dist/ReactToastify.css";
import { TranslationConsumer } from "@scuf/localization";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { kpiVehicleList } from "../../../JS/KPIPageName";
import * as KeyCodes from "../../../JS/KeyCodes";
import UserAuthenticationLayout from "../Common/UserAuthentication";

let DetailsComponent = null;
class VehicleComposite extends React.PureComponent {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    DetailsComponent: null,
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    data: {},
    vehicleKPIList: [],
  };

  componentName = (this.props.rigidTruckWithTrailer ? "rigidTruckWithTrailer" : "") + "VehicleList";

  handleAdd = (itemName) => {
    try {
      if (itemName !== null) {
        DetailsComponent = React.lazy(() =>
          import(`../Details/${itemName}DetailsComposite`)
        );
      }

      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
        DetailsComponent: DetailsComponent,
      });
    } catch (error) {
      console.log("VehicleComposite:Error occured on handleAdd", error);
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
      this.getVehicleList(shareholder);
      if (
        this.props.rigidTruckWithTrailer === undefined ||
        this.props.rigidTruckWithTrailer === false
      )
        this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "VehicleComposite:Error occured on handleShareholderSelectionChange",
        error
      );
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
          fnVehicle
        );

      this.setState({ selectedItems: items, operationsVisibilty }, () => {
        if (this.props.rigidTruckWithTrailer === true) {
          this.props.handleSelectClick(
            "rigidTruck",
            this.state.selectedItems,
            this.state.data.Column
          );
        }
      });
    } catch (error) {
      console.log("VehicleComposite:Error occured on handleSelection", error);
    }
  };

  getVehicleList(shareholder) {
    let vehicleTypes = [
      Constants.VehicleType.RigidTruck,
      Constants.VehicleType.TractorWithTrailer,
      Constants.VehicleType.RigidTruckWithTrailer,
      Constants.VehicleType.NonFillingVehicle,
    ];
    if (this.props.rigidTruckWithTrailer === true) {
      vehicleTypes = [Constants.VehicleType.RigidTruck];
    }

    let vehicleListFilterInfo = {
      ShareholderCode: shareholder,
      VehicleTypes: vehicleTypes,
    };
    axios(
      RestAPIs.GetVehicleListForRole,
      Utilities.getAuthenticationObjectforPost(
        vehicleListFilterInfo,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;

        if (result.IsSuccess === true) {
          // if (this.props.rigidTruckWithTrailer === true)
          //   result.EntityResult.Table = result.EntityResult.Table.filter(
          //     (row) => row.Vehicle_Type === Constants.VehicleType.RigidTruck
          //   );
          this.setState({ data: result.EntityResult, isReadyToRender: true });
          if (
            this.props.rigidTruckWithTrailer !== undefined &&
            this.props.rigidTruckSelection.length > 0
          ) {
            let trailers = this.props.rigidTruckSelection;
            if (trailers.length > 0) {
              let rigidTruckSelection = [];
              trailers.forEach((trailer) => {
                let row = result.EntityResult.Table.find(
                  (row) => row.Common_Code === trailer.Trailer.Code
                  //  &&
                  // row.Vehicle_Type === Constants.VehicleType.RigidTruck
                );
                if (row !== undefined) rigidTruckSelection.push(row);
              });
              this.setState({
                selectedItems: rigidTruckSelection,
              });
              this.props.getRigidTruckList(
                rigidTruckSelection,
                result.EntityResult.Column
              );
            }
          } else {
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          }
        } else {
          this.setState({ data: {}, isReadyToRender: true });
          console.log("Error in GetVehicleListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: {}, isReadyToRender: true });
        console.log("Error while getting Vehicle List:", error);
      });
  }
  handleRowClick = (item) => {
    try {
      if (this.props.rigidTruckWithTrailer === undefined) {
        let operationsVisibilty = { ...this.state.operationsVisibilty };
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnVehicle
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnVehicle
        );

        if (item.Vehicle_Type === Constants.VehicleType.RigidTruck)
          DetailsComponent = React.lazy(() =>
            import(`../Details/RigidTruckDetailsComposite`)
          );
        if (item.Vehicle_Type === Constants.VehicleType.TractorWithTrailer)
          DetailsComponent = React.lazy(() =>
            import(`../Details/TractorWithTrailerDetailsComposite`)
          );
        if (item.Vehicle_Type === Constants.VehicleType.RigidTruckWithTrailer)
          DetailsComponent = React.lazy(() =>
            import(`../Details/RigidTruckWithTrailerDetailsComposite`)
          );
        if (item.Vehicle_Type === Constants.VehicleType.NonFillingVehicle)
          DetailsComponent = React.lazy(() =>
            import(`../Details/NonFillingVehicleDetailsComposite`)
          );
        operationsVisibilty.shareholder = false;

        this.setState({
          isDetails: true,
          selectedRow: item,
          selectedItems: [item],
          operationsVisibilty,
          DetailsComponent: DetailsComponent,
        });
      }
    } catch (error) {
      console.log("VehicleComposite:Error occured on Row click", error);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.rigidTruckWithTrailer !== undefined &&
      nextProps.rigidTruckSelection.length > 0
    ) {
      let trailers = nextProps.rigidTruckSelection;
      if (trailers.length > 0) {
        let rigidTruckSelection = [];
        trailers.forEach((trailer) => {
          let row = this.state.data.Table.find(
            (row) => row.Common_Code === trailer.Trailer.Code
            // &&
            // row.Vehicle_Type === Constants.VehicleType.RigidTruck
          );
          if (row !== undefined) rigidTruckSelection.push(row);
        });
        this.setState({
          selectedItems: rigidTruckSelection,
        });
        this.props.getRigidTruckList(
          rigidTruckSelection,
          this.state.data.Column
        );
      }
    } else if (
      nextProps.rigidTruckWithTrailer !== undefined &&
      nextProps.rigidTruckSelection.length === 0
    ) {
      this.setState({ selectedItems: [] });
    }
  }

  componentDidMount() {
    // clear session storage on page refresh
    window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));

    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnVehicle
      );
      let shareholder = this.props.userDetails.EntityResult.PrimaryShareholder;
      if (this.props.rigidTruckWithTrailer === true) {
        shareholder = this.props.rigidTruckShareholder;
      }
      this.setState({
        operationsVisibilty,
        selectedShareholder: shareholder,
      });
      this.getVehicleList(shareholder);
      if (
        this.props.rigidTruckWithTrailer === undefined ||
        this.props.rigidTruckWithTrailer === false
      )
        this.getKPIList(shareholder);
    } catch (error) {
      console.log("VehicleComposite:Error occured on ComponentDidMount", error);
    }
  }

  componentWillUnmount = () => {
    // clear session storage
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnVehicle
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnVehicle
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            //TransportationType: data.TransportationType,
            Vehicle_CarrierCompany: data.CarrierCompanyCode,
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
      console.log("VehicleComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnVehicle
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

      // DetailsComponent = null;
      this.getVehicleList(this.state.selectedShareholder);
      if (
        this.props.rigidTruckWithTrailer === undefined ||
        this.props.rigidTruckWithTrailer === false
      )
        this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("VehicleComposite:Error occured on Back click", error);
    }
  };

  handleDelete = () => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deleteVehicleKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        let shCode = this.state.selectedShareholder;
        let vehicleCode = this.state.selectedItems[i]["Common_Code"];
        let carrierCode = this.state.selectedItems[i]["Vehicle_CarrierCompany"];
        let keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [
            { Key: KeyCodes.vehicleCode, Value: vehicleCode },
            {
              key: KeyCodes.carrierCode,
              Value: carrierCode,
            },
          ],
        };
        deleteVehicleKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteVehicle,
        Utilities.getAuthenticationObjectforPost(
          deleteVehicleKeys,
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

          let notification = Utilities.convertResultsDatatoNotification(
            result,
            "VehicleDetails_DeleteStatus",
            ["VehicleCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ 
              isReadyToRender: false,
              showAuthenticationLayout: false,
             });
            this.getVehicleList(this.state.selectedShareholder);
            if (
              this.props.rigidTruckWithTrailer === undefined ||
              this.props.rigidTruckWithTrailer === false
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
              messageResult.keyFields[0] = "Vehicle_Code";
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
      console.log("VehicleComposite:Error occured on handleDelete", error);
    }
  };

  //Get KPI List for Vehicle Composite
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
        PageName: kpiVehicleList,
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
              vehicleKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ vehicleKPIList: [] });
            console.log("Error in vehicle KPIList:", result.ErrorList);
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
          console.log("Error while getting Vehicle KPIList:", error);
        });
    }
  }
  handleNextClick = () => {
    this.props.handleNextClick(
      "rigidTruck",
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
      console.log("VehicleComposite : Error in authenticateDelete");
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
    if (this.props.rigidTruckWithTrailer === true) {
      selectionMode = "single";
      fillPage = false;
      loadingClass = "nestedList";
    }

    const popUpContent = [
      {
        fieldName: "RigidTruck",
        fieldValue: "Vehicle_RigidTruck",
      },
      {
        fieldName: "RigidTruckWithTrailer",
        fieldValue: "Vehicle_RigidTruck_with_Trailer",
      },
      {
        fieldName: "TractorWithTrailer",
        fieldValue: "Vehicle_Tractor_with_Trailer",
      },
      {
        fieldName: "NonFillingVehicle",
        fieldValue: "Vehicle_Non_Filling",
      },
    ];
    DetailsComponent = this.state.DetailsComponent;
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              {this.props.rigidTruckWithTrailer === undefined ? (
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
                  popUpContent={popUpContent}
                  handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                ></TMUserActionsComposite>
              ) : (
                <>
                  {this.state.isDetails ? (
                    ""
                  ) : (
                    <div className="vehicleDataTableHeading">
                      <div className="col col-lg-10 dataTableHeadingPadding">
                        <h5>{t("Select_RigidTrucks")}</h5>
                      </div>
                      <div className="col col-lg-1 vehicleDataTableIcon">
                        <div
                          className={
                            (this.state.operationsVisibilty.add
                              ? "iconCircle "
                              : "iconCircleDisable ") + "iconblock"
                          }
                          onClick={() => {if(this.state.operationsVisibilty.add){this.handleAdd("RigidTruck")}}}
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
                {DetailsComponent !== null ? (
                  <React.Suspense
                    fallback={<LoadingPage message=""></LoadingPage>}
                  >
                    <DetailsComponent
                      key="VehicleDetails"
                      selectedRow={this.state.selectedRow}
                      onBack={this.handleBack}
                      onSaved={this.savedEvent}
                      selectedShareholder={this.state.selectedShareholder}
                    ></DetailsComponent>
                  </React.Suspense>
                ) : (
                  ""
                )}
              </ErrorBoundary>
            ) : this.state.isReadyToRender ? (
              <div>
                {this.props.rigidTruckWithTrailer === true ? (
                  ""
                ) : (
                  <ErrorBoundary>
                    <div className="kpiSummaryContainer">
                      <KPIDashboardLayout
                        kpiList={this.state.vehicleKPIList}
                        pageName="Vehicle"
                      ></KPIDashboardLayout>
                    </div>
                  </ErrorBoundary>
                )}
                <ErrorBoundary>
                  <VehicleSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={!this.props.rigidTruckWithTrailer}
                    exportFileName="VehicleList.xlsx"
                    columnPickerRequired={!this.props.rigidTruckWithTrailer}
                    columnGroupingRequired={!this.props.rigidTruckWithTrailer}
                    selectedItems={this.state.selectedItems}
                    selectionRequired={true}
                    terminalsToShow={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .NoOfTerminalsToShow
                    }
                    onRowClick={this.handleRowClick}
                    onSelectionChange={this.handleSelection}
                    selectionMode={selectionMode}
                    fillPage={fillPage}
                    parentComponent={this.componentName}
                  ></VehicleSummaryPageComposite>
                  {this.props.rigidTruckWithTrailer === true ? (
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
            functionGroup={fnVehicle}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></UserAuthenticationLayout>
        ) : null}
            {this.props.rigidTruckWithTrailer === true ? (
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

export default connect(mapStateToProps)(VehicleComposite);

VehicleComposite.propTypes = {
  activeItem: PropTypes.object,
  rigidTruckWithTrailer: PropTypes.bool,
  rigidTruckSelection: PropTypes.array,
  getRigidTruckList: PropTypes.func,
  handleNextClick: PropTypes.func,
  handleSelectClick: PropTypes.func,
};
