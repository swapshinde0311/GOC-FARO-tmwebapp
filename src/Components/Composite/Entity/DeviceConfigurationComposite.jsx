import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import { DeviceConfigurationSummaryComposite } from "../Summary/DeviceConfigurationSummaryComposite";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import UserAuthenticationLayout from "../Common/UserAuthentication";

// import Error from "../../Error";
import DeviceDetailsComposite from "../Details/DeviceDetailsComposite";
import {
  functionGroups,
  fnDevice,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiDeviceList } from "../../../JS/KPIPageName";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Constants from "../../../JS/Constants";
class DeviceConfigurationComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    isEnable: true,
    // deviceType: "",
    // deviceCode: "",
    deviceKPIList: [],
    //terminalCodes: "",
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
        this.props.selectedShareholder === null ||
        this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    
    showAuthenticationLayout: false,
  };

  componentName = "DeviceConfigurationComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnDevice
      );
      this.setState({
        operationsVisibilty,
      });
      this.getDeviceList();
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
      //this.getTerminalsList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "TruckReceiptComposite:Error occured on ComponentDidMount",
        error
      );
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

  savedEvent = (data, saveType, notification) => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnDevice
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnDevice
        );
        
        this.setState({ operationsVisibilty });
      }

      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            DeviceType: data.DeviceType,
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

      this.getDeviceList();
    } catch (error) {
      console.log("SiteViewComposite:Error occured on savedEvent", error);
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnDevice
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getDeviceList();
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("SealMasterComposite:Error occured on Back click", error);
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
        PageName: kpiDeviceList,
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
              deviceKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ deviceKPIList: [] });
            console.log("Error in device KPIList:", result.ErrorList);
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
          console.log("Error while getting Driver KPIList:", error);
        });
    }
  }

  getDeviceList = () => {
    try {
      axios(
        RestAPIs.GetAllDevices,
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
            console.log("Error in DeviceList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting DeviceList:", error);
        });
    } catch (error) {
      console.log("DeviceConfigurationComposite:Error in get Device List");
    }
  };

  handleSelection = (items) => {
    try {
      var { operationsVisibilty } = { ...this.state };

      // Delete is allowed for same device types
      let isSameDeviceType = true;
      let prevDeviceType = "";
      for (var i = 0; i < items.length; i++) {
        if (i !== 0 && prevDeviceType !== items[i]["DeviceType"])
          isSameDeviceType = false;
        if (isSameDeviceType) prevDeviceType = items[i]["DeviceType"];
        else break;
      }

      operationsVisibilty.delete =
        items.length > 0 &&
        isSameDeviceType &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnDevice
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("DeviceList:Error occured on handleSelection", error);
    }
  };
  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnDevice
      );
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        operationsVisibilty.delete = false;
      } else {
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnDevice
        );
      }
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
        //deviceType: Constants.deviceTypeCode[item.DeviceType],
        //deviceCode: item.Common_Code
      });
    } catch (error) {
      console.log("DeviceconfigComposite:Error occured on Row click", error);
    }
  };

  handleDelete = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      let notification = {};

      var deleteDeviceKeys = [];

      for (var i = 0; i < this.state.selectedItems.length; i++) {
        let keyData = {
          keyDataCode: 0,
          ShareHolderCode: "",
          KeyCodes: [
            {
              Key: KeyCodes.deviceCode,
              Value: this.state.selectedItems[i]["Common_Code"],
            },
            {
              Key: KeyCodes.deviceType,
              Value: this.state.selectedItems[i]["DeviceType"],
            },
          ],
        };
        deleteDeviceKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteDevice,
        Utilities.getAuthenticationObjectforPost(
          deleteDeviceKeys,
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
            this.setState({ isReadyToRender: false,showAuthenticationLayout: false, });
            this.getDeviceList();
            //if (this.props.vehicleWithTrailer === undefined || this.props.vehicleWithTrailer === false)
            this.getKPIList(this.state.selectedShareholder);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              deviceType: "",
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty,showAuthenticationLayout: false, });
          }

          notification = Utilities.convertResultsDatatoNotification(
            result,
            "DeviceDeleteStatus",
            ["DeviceCode"]
          );

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "DeviceCode";
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
        "DeviceConfigurationComposite:Error occured on handleDelete",
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
        deviceType: "",
        deviceCode: "",
      });
    } catch (error) {
      console.log(
        "DeviceConfigurationComposite:Error occured on handleAdd",
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
      console.log("DeviceConfigComposite : Error in authenticateDelete");
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
        <TMUserActionsComposite
          operationsVisibilty={this.state.operationsVisibilty}
          breadcrumbItem={this.props.activeItem}
          onDelete={this.authenticateDelete}
          onAdd={this.handleAdd}
          shrVisible={false}
          handleBreadCrumbClick={this.props.handleBreadCrumbClick}
        ></TMUserActionsComposite>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <DeviceDetailsComposite
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              deviceCode={
                this.state.selectedRow !== {}
                  ? this.state.selectedRow.Common_Code
                  : ""
              }
              deviceType={
                this.state.selectedRow !== {}
                  ? Constants.deviceTypeCode[this.state.selectedRow.DeviceType]
                  : ""
              }
              source={"DeviceComposite"}
              selectedRow={this.state.selectedRow}
            />
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.deviceKPIList}
                  pageName="DeviceConfiguration"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <DeviceConfigurationSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="DeviceConfigurationList"
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
              ></DeviceConfigurationSummaryComposite>
            </ErrorBoundary>
          </>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
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
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnDevice}
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

export default connect(mapStateToProps)(DeviceConfigurationComposite);

DeviceConfigurationComposite.propTypes = {
  activeItem: PropTypes.object,
};
