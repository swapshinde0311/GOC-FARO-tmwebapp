import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import * as Constants from "../../../JS/Constants";
import { MasterDeviceConfigurationSummaryComposite } from "../Summary/MasterDeviceConfigurationSummaryComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { ToastContainer, toast } from "react-toastify";
import lodash from "lodash";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import { functionGroups, fnMasterDeviceConfiguration } from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class MasterDeviceConfigurationComposite extends Component {
  state = {
    locationDeviceData: [],
    deviceModelData: [],
    transportationTypeOptions: [],
    selectedTransportationType: Constants.TransportationType.ROAD,
    allLocationDeviceData: {},
    saveEnabled: false,
    showAuthenticationLayout: false,
  }
  componentDidMount() {
    this.getTransportationTypeOptions();
    this.getLocationTypesandDeviceList(this.state.selectedTransportationType);
    // this.getDeviceTypesandModels(this.state.selectedTransportationType);
  }

  getTransportationTypeOptions() {
    const transportationTypeList = [];
    for (let key in Constants.TransportationType) {
      transportationTypeList.push(key);
    }
    this.setState({
      transportationTypeOptions: Utilities.transferListtoOptions(
        transportationTypeList
      ),
    });
  }

  getLocationTypesandDeviceList(transportationType) {
    try {
      axios(
        RestAPIs.GetLocationTypesandDeviceList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {

          var result = response.data;
          if (result.IsSuccess === true) {

            Object.keys(result.EntityResult).forEach((transType) => {
              result.EntityResult[transType] = Utilities.addSeqNumberToListObject(
                result.EntityResult[transType])
            })

            let locationDeviceData = result.EntityResult[transportationType]

            this.setState({
              locationDeviceData: locationDeviceData,
              allLocationDeviceData: result.EntityResult,
              isReadyToRender: true
            }, () => this.getDeviceTypesandModels(transportationType)
            );
          } else {
            this.setState({ locationDeviceData: [], isReadyToRender: true });
            console.log("Error in getLocationTypesandDeviceList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ locationDeviceData: [], isReadyToRender: true });
          console.log("Error while getting location and device List:", error);
        });
    } catch (error) {
      console.log("Error while getting location and respective List:", error);
    }
  }

  getDeviceTypesandModels(transportationType) {
    try {
      axios(
        RestAPIs.GetDeviceTypesandModels + "?transportationType=" + transportationType,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {

          var result = response.data;
          if (result.IsSuccess === true) {
            let deviceModelData = [];
            Object.keys(result.EntityResult).map((key) => (
              deviceModelData.push({ type: key, models: result.EntityResult[key], disableAllModels: false })
            ));

            deviceModelData = Utilities.addSeqNumberToListObject(
              deviceModelData
            )

            this.setState({
              deviceModelData: deviceModelData,
              isReadyToRender: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnMasterDeviceConfiguration
              )
            });
          } else {
            this.setState({ deviceModelData: [], isReadyToRender: true });
            console.log("Error in getDeviceTypesandModels:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ deviceModelData: [], isReadyToRender: true });
          console.log("Error while getting Device Types and Models List:", error);
        });
    } catch (error) {
      console.log("Error while getting Device types and Models:", error);
    }
  }
  handleSave = () => {
    try {
      this.setState({ saveEnabled: false });
      let deviceModelData = lodash.cloneDeep(this.state.deviceModelData);
      let index = deviceModelData.findIndex((item) => { return item.type === "BCU" })
      if (index >= 0) {
        let checkedList = deviceModelData[index].models.filter((model) => {
          return model.Value === true
        })
        if (checkedList !== undefined && checkedList !== null && checkedList.length === 0) {
          let notification = {
            messageType: "critical",
            message: "MasterDeviceConfig_SavedStatus",
            messageResultDetails: [
              {
                keyFields: [],
                keyValues: [],
                isSuccess: false,
                errorMessage: "MasterDeviceConfig_Models",
              }
            ],
          };

          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
          this.setState({ saveEnabled: true })
        }
        else {
          let tempModelList = {}
          deviceModelData.forEach((item) => {
            tempModelList[item.type] = item.models
          })
          this.UpdateDeviceConfiguration(this.state.locationDeviceData, tempModelList)
        }
      }
    } catch (error) {
      console.log("Error in handle save:", error);
    }
  }

  saveDeviceConfig = () => {
      let showAuthenticationLayout =
     
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

      this.setState({ showAuthenticationLayout, }, () => {
        if (showAuthenticationLayout === false) {
          this.handleSave();
        }
    });
    
  };

  UpdateDeviceConfiguration(locationConfig, deviceTypeConfig) {
    let config =
    {
      transportationType: this.state.selectedTransportationType,
      locationDeviceTypesDetails: locationConfig,
      deviceModelsDetails: deviceTypeConfig
    }

    let obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: "",
      KeyCodes: [],
      Entity: config,
    };

    let notification = {
      messageType: "critical",
      message: "MasterDeviceConfig_SavedStatus",
      messageResultDetails: [
        {
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "MasterDeviceConfig_Models",
        }
      ],
    };
    try {
      axios(
        RestAPIs.SaveDeviceConfig,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnMasterDeviceConfiguration
                ),
                showAuthenticationLayout: false,
              },
              () => this.getLocationTypesandDeviceList(this.state.selectedTransportationType)
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnMasterDeviceConfiguration
              ),
              showAuthenticationLayout: false,
            });
            console.log("Error in UpdateDeviceConfig:", result.ErrorList);
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
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnMasterDeviceConfiguration
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage = error;
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
        });
    }
    catch (error) {
      console.log("Error while updating device configuration:", error)
    }
  }

  handleChange = (data, property, type = "") => {
    try {
      if (property === "TransportationType") {
        let allLocationDeviceData = lodash.cloneDeep(this.state.allLocationDeviceData)
        let locationDeviceData = this.state.locationDeviceData;
        locationDeviceData = allLocationDeviceData[data]

        this.setState({
          selectedTransportationType: data,
          locationDeviceData
        }, () => {
          this.getDeviceTypesandModels(data)
        })
      }
      else if (type === "LocationType") {
        let locationDeviceData = this.state.locationDeviceData
        let index = locationDeviceData.findIndex((item) => {
          return item.SeqNumber === property.SeqNumber
        })
        if (index >= 0) {
          locationDeviceData[index].isActive = data;
          if (!data) {
            Object.keys(locationDeviceData[index].deviceDetails)
              .forEach((key) => {
                locationDeviceData[index].deviceDetails[key] = data
              })
          }
        }
        this.setState({ locationDeviceData })
      }
      else if (property.gridType === "Models") {
        let deviceModelData = lodash.cloneDeep(this.state.deviceModelData)
        let index = deviceModelData.findIndex((item) => {
          return item.SeqNumber === property.SeqNumber
        })

        if (index >= 0) {
          let modelIndex = deviceModelData[index].models.findIndex((model) => {
            return model.Key === type
          })
          if (modelIndex >= 0) {
            deviceModelData[index].models[modelIndex].Value = data
          }
        }
        this.setState({ deviceModelData })
      }
      else {
        let locationData = this.state.locationDeviceData
        let deviceData = this.state.deviceModelData

        let locationTypeIndex = locationData.findIndex((item) => {
          return item.SeqNumber === property.SeqNumber
        })
        if (locationTypeIndex >= 0) {
          locationData[locationTypeIndex].deviceDetails[type] = data;
        }

        if (!data) {
          let disable = true;

          locationData.forEach((item) => {
            if (item.deviceDetails[type])
              disable = false
          })

          if (disable) {
            let modelIndex = deviceData.findIndex((model) => {
              return model.type === type
            })
            if (modelIndex >= 0) {
              deviceData[modelIndex].models.forEach((model) => {
                model.Value = false
              })
            }
          }
        }
        this.setState({ locationDeviceData: locationData, deviceModelData: deviceData })
      }
    }
    catch (error) {
      console.log(
        "MasterDeviceConfigurationComposite:Error occured on handleChange",
        error
      );
    }
  }
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
            breadcrumbItem={this.props.activeItem}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            deleteVisible={false}
            addVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <ErrorBoundary>
            <MasterDeviceConfigurationSummaryComposite
              locationDeviceData={this.state.locationDeviceData}
              deviceModelData={this.state.deviceModelData}
              onSaveClick={this.saveDeviceConfig}
              transportationTypeOptions={this.state.transportationTypeOptions}
              selectedTransportationType={this.state.selectedTransportationType}
              onFieldChange={this.handleChange}
              saveEnabled={this.state.saveEnabled}
            ></MasterDeviceConfigurationSummaryComposite>
          </ErrorBoundary>
        ) : (
          <>
            <LoadingPage message="Loading"></LoadingPage>
          </>
        )}
          {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnMasterDeviceConfiguration}
            handleOperation={this.handleSave}
            handleClose={this.handleAuthenticationClose}
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

export default connect(mapStateToProps)(MasterDeviceConfigurationComposite);

MasterDeviceConfigurationComposite.propTypes = {
  activeItem: PropTypes.object,
};
