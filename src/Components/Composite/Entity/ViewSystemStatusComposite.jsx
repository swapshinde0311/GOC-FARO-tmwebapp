import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TranslationConsumer } from "@scuf/localization";
import NotifyEvent from "../../../JS/NotifyEvent";
import lodash from "lodash";
import { ViewSystemStatusDetails } from "../../UIBase/Details/ViewSystemStatusDetails";

class ViewSystemStatusComposite extends Component {
  refreshTimer = null;
  state = {
    isReadyToRender: false,
    deviceCommunicationStatusData: [],
    isArchiveEnable: false,
    isDCHEnable: false,
    isTWICEnable: false,
    externalSystemStatusData: [],
    lastArchivedTime: null,
    twicRuntimeValue: null,
    serverStatus: [],
    lastUpdatedTime: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    terminalCommunicationStatusData: [],
    storageStatus: []
  };

  componentDidMount() {
    try {
      if (this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.getTerminalCommunicationStatus();
      else this.getDeviceCommunicationStatusList();
      this.getServerStatus();
      this.getStorageStatus();
      if (!this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.getLookUpData();
      this.getTWICEnable();
    } catch (error) {
      console.log(
        "ViewSystemStatusComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillUnmount() {
    this.stopRefreshTimer();
  }

  startRefreshTimer = () => {
    this.refreshTimer = setInterval(() => {
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getTerminalCommunicationStatus();
      } else {
        this.getDeviceCommunicationStatusList();
      }
      this.getServerStatus();
      this.getStorageStatus();
    }, 30000);
  };

  stopRefreshTimer = () => {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
    }
  };

  getDeviceCommunicationStatusList() {
    try {
      axios(
        RestAPIs.GetSystemDeviceStatus,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        this.stopRefreshTimer();
        if (result.IsSuccess === true) {
          var currrentDatetime =
            new Date().toLocaleDateString() +
            " " +
            new Date().toLocaleTimeString();
          this.setState({
            deviceCommunicationStatusData: result.EntityResult.Table,
            isReadyToRender: true,
            lastUpdatedTime: currrentDatetime,
          });
        } else {
          this.setState({
            deviceCommunicationStatusData: [],
            isReadyToRender: true,
          });
          console.log(
            "Error in getDeviceCommunicationStatusList:",
            result.ErrorList
          );
        }
        this.startRefreshTimer();
      });
    } catch (error) {
      console.log(
        "ViewSystemStatusComposite:Error occured on getDeviceCommunicationStatusList",
        error
      );
    }
  }

  getTerminalCommunicationStatus() {
    try {
      axios(
        RestAPIs.GetTerminalCommunicationStatus,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        this.stopRefreshTimer();
        if (result.IsSuccess === true) {
          var currrentDatetime =
            new Date().toLocaleDateString() +
            " " +
            new Date().toLocaleTimeString();
          this.setState({
            terminalCommunicationStatusData: result.EntityResult.Table,
            isReadyToRender: true,
            lastUpdatedTime: currrentDatetime,
          });
        } else {
          this.setState({
            terminalCommunicationStatusData: [],
            isReadyToRender: true,
          });
          console.log(
            "Error in getTerminalCommunicationStatus:",
            result.ErrorList
          );
        }
        this.startRefreshTimer();
      });
    } catch (error) {
      console.log(
        "ViewSystemStatusComposite:Error occured on getTerminalCommunicationStatus",
        error
      );
    }
  }

  getServerStatus() {
    axios(
      RestAPIs.GetServerStatus,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          result.EntityResult.forEach((serverData) => {
            let serviceName = [];
            let serviceStaus = [];
            Object.keys(serverData.ServiceStatusList).forEach((key) => {
              serviceName.push({ ServiceName: key });
              serviceStaus.push({
                ServiceStaus: serverData.ServiceStatusList[key],
              });
            });
            serverData.ServiceName = serviceName;
            serverData.ServiceStaus = serviceStaus;
          });
          this.setState({ serverStatus: result.EntityResult });
        } else {
          console.log("Error in getServerStatus: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ViewSystemStatusComposite: Error occurred on getServerStatus",
          error
        );
      });
  }

  getStorageStatus = () => {
    try {
      axios(RestAPIs.GetServerStorageStatus,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        ))
        .then((response) => {
          let storageStatus = [];
          if (response.data.IsSuccess && Array.isArray(response.data.EntityResult)) {
            response.data.EntityResult.forEach((val) => {
              storageStatus.push({
                ServerName: val.Key,
                StorageDetails: val.Value
              });
            });

            this.setState({ storageStatus: storageStatus });
          }
          else {
            console.log("Error in fetching storage details");
          }
        })
        .catch((error) => {
          console.log("Error in fetching storage details: ", error);
        })
    }
    catch (error) {
      console.log("Error in getStorageStatus: ", error);
    }
  }

  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=DCHSystems",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult.DCHSystemsEnabled === "True") {
            this.setState({ isDCHEnable: true }, () => {
              this.GetExternalSystemStatusList();
            });
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ViewSystemStatusComposite: Error occurred on getLookUpData",
          error
        );
      });

    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=ArchiveSystemConfiguration",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult.ArchiveEnabled === "True") {
            this.setState({ isArchiveEnable: true }, () => {
              this.GetArchiveSystemStatus();
            });
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ViewSystemStatusComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getTWICEnable() {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=TWIC",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.EnableTWICFeature === "TRUE") {
              this.setState({ isTWICEnable: true }, () => {
                this.GetTwicServiceStatus();
              });
            }
          } else {
            console.log("Error in getLookUpData: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "ViewSystemStatusComposite: Error occurred on getLookUpData",
            error
          );
        });
    } else {
      axios(
        RestAPIs.IsTWICEnabled,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult === "true") {
              this.setState({ isTWICEnable: true }, () => {
                this.GetTwicServiceStatus();
              });
            }
          } else {
            console.log("Error in getTWICEnable: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "ViewSystemStatusComposite: Error occurred on getTWICEnable",
            error
          );
        });
    }
  }

  GetExternalSystemStatusList() {
    axios(
      RestAPIs.GetExternalSystemStatusList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            externalSystemStatusData: result.EntityResult,
          });
        } else {
          console.log(
            "Error in GetExternalSystemStatusList: ",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "ViewSystemStatusComposite: Error occurred on GetExternalSystemStatusList",
          error
        );
      });
  }

  GetArchiveSystemStatus() {
    axios(
      RestAPIs.GetArchiveSystemStatus,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            lastArchivedTime: result.EntityResult,
          });
        } else {
          console.log("Error in GetArchiveSystemStatus: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ViewSystemStatusComposite: Error occurred on GetArchiveSystemStatus",
          error
        );
      });
  }

  GetTwicServiceStatus() {
    axios(
      RestAPIs.GetTwicServiceStatus,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            twicRuntimeValue: result.EntityResult,
          });
        } else {
          console.log("Error in GetTwicServiceStatus: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ViewSystemStatusComposite: Error occurred on GetTwicServiceStatus",
          error
        );
      });
  }

  checkDeviceStatus = (data) => {
    let deviceCommunicationStatusData = lodash.cloneDeep(
      this.state.deviceCommunicationStatusData
    );
    let notification = {
      messageType: "critical",
      message: "CommStatus_Title",
      messageResultDetails: [
        {
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CheckDeviceStaus +
      "?srNo=" +
      data.SlNo +
      "&deviceCode=" +
      data.DeviceCode +
      "&deviceType=" +
      data.DeviceType +
      "&deviceModel=" +
      data.DeviceModel,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          deviceCommunicationStatusData[
            data.SlNo - 1
          ].CommStatus_Visible = true;
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            var commStatus =
              result.EntityResult.CommStatus === "true" ? true : false;
            deviceCommunicationStatusData[data.SlNo - 1].CommStatus =
              commStatus;
            deviceCommunicationStatusData[data.SlNo - 1].CommStatus_Tooltip =
              result.EntityResult.CommStatus_Tooltip;
            this.setState({ deviceCommunicationStatusData });
          }
        } else {
          deviceCommunicationStatusData[
            data.SlNo - 1
          ].CommStatus_Visible = true;
          deviceCommunicationStatusData[data.SlNo - 1].CommStatus = false;
          this.setState({ deviceCommunicationStatusData });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
        }
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
        console.log(
          "ViewSystemStatusComposite: Error occurred on getTWICEnable",
          error
        );
      });
  };

  render() {
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              <TMUserActionsComposite
                breadcrumbItem={this.props.activeItem}
                shrVisible={false}
                handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                addVisible={false}
                deleteVisible={false}
              ></TMUserActionsComposite>
            </ErrorBoundary>
            {this.state.isReadyToRender ? (
              <div>
                <ViewSystemStatusDetails
                  lastUpdatedTime={this.state.lastUpdatedTime}
                  deviceCommunicationStatusData={
                    this.state.deviceCommunicationStatusData
                  }
                  pageSize={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize
                  }
                  serverStatus={this.state.serverStatus}
                  isDCHEnable={this.state.isDCHEnable}
                  externalSystemStatusData={this.state.externalSystemStatusData}
                  isArchiveEnable={this.state.isArchiveEnable}
                  lastArchivedTime={this.state.lastArchivedTime}
                  isTWICEnable={this.state.isTWICEnable}
                  twicRuntimeValue={this.state.twicRuntimeValue}
                  checkDeviceStatus={this.checkDeviceStatus}
                  terminalCommunicationStatusData={
                    this.state.terminalCommunicationStatusData
                  }
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  serverStorageStatus={this.state.storageStatus}
                ></ViewSystemStatusDetails>
              </div>
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

export default connect(mapStateToProps)(ViewSystemStatusComposite);

ViewSystemStatusComposite.propTypes = {
  activeItem: PropTypes.object,
};
