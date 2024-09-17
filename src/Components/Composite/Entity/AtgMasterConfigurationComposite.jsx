import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import lodash from "lodash";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import {
  AtgMasterValidationDef,
} from "../../../JS/ValidationDef";
import { emptyATGMaster } from "../../../JS/DefaultEntities";
import { ATGMasterPointTableValidation, ATGMasterParameterValidation } from "../../../JS/DetailsTableValidationDef";
import { TranslationConsumer } from "@scuf/localization";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import ATGMasterConfigurationSummaryComposite from "../Summary/ATGMasterConfigurationSummaryComposite";

class AtgMasterConfigurationComposite extends Component {
  state = {
    AtgMasterConfigurations: [],
    AtgConfigurations: [],
    modATGMaster: {},
    atgMaster: lodash.cloneDeep(emptyATGMaster),
    isReadyToRender: true,
    saveEnabled: true,
    AtgEnabled: "",
    dataTypesOptions: [],
    checkedTanks: false,
    isATGEnabled: false,
    AtgMasterValidationError: Utilities.getInitialValidationErrors(
      AtgMasterValidationDef
    ),
    selectedTanks: [],
    uomOptionList:{}
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetATGMasterConfiguration();
      this.getUOMList();
      this.GetAttributeDataTypes();
      this.getLookUpData();
    } catch (error) {
      console.log("ATGMasterConfigurationDetail:Error occurred on ", error);
    }
  }
  notifyEvent = (notification) => {
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
      console.log(
        "AtgMasterSCADAConfigurationComposite: Error occurred on savedEvent",
        error
      );
    }
  };
  getLookUpData() {
    try {


      if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
        axios(
          RestAPIs.GetLookUpData + "?LookUpTypeCode=ATG",
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              isATGEnabled:
                (result.EntityResult["ATGEnabled"]).toLowerCase() === "true"  ? true : false,
            });
          }
        });
      }
    } catch (error) {
      console.log("TankDetailsComposite:Error occured on getLookUpData", error);
    }
  }
  GetATGMasterConfiguration = () => {

    try {

      axios(
        RestAPIs.GetATGMasterConfiguration,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {

        var result = response.data;
        if (result.IsSuccess) {
          if (
            result.EntityResult !== null
          ) {
            let modATGMaster = result.EntityResult;
            this.setState({ isReadyToRender: true, modATGMaster, atgMaster: result.EntityResult,  AtgMasterConfigurations: result.EntityResult.AtgMasterConfigurations });
          }
          if (result.EntityResult.AtgConfigurations !== null) {
            this.setState({ AtgConfigurations: result.EntityResult.AtgConfigurations})
          }
        } else {
          console.log("Error in getatgmasterConfigurations:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log(
        "getatgmasterConfigurations:Error occured on getatgmasterConfigurations",
        error
      );
    }
  }
  getUOMList() {
    try {
      axios(
        RestAPIs.GetUOMList,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            this.setState({
              uomOptionList: result.EntityResult
            });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("ATGMasterDetailsComposite:Error while getting GetUOMList");
    }
  }
  GetAttributeDataTypes() {

    try {
      axios(
        RestAPIs.GetAttributeDataTypes,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {

        var result = response.data;
        if (result.IsSuccess === true) {
          let dataTypesOptions = [];
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult).forEach((key) =>
              dataTypesOptions.push({
                text: result.EntityResult[key],
                value: key,
              })
            );
            this.setState({ dataTypesOptions });
          } else {
            console.log("No datatypes identified.");
          }
        } else {
          console.log("Error in GetDatatypes:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("DeviceDetailsComposite:Error while getting GetUOMList");
    }
  }
  fillDetails() {

    let AtgMasterConfigurationsInfo = {
      AtgScanPeriod: "",
      AtgMasterConfigurations: [],
      AtgConfigurations: [],
      AtgEnabled: ""
    }
    try {

      let MasterConfiguration = [];
      let AtgConfigurations = lodash.cloneDeep(this.state.AtgConfigurations);
      let modATGMaster = lodash.cloneDeep(this.state.modATGMaster)
      let selectedTanks = lodash.cloneDeep(this.state.selectedTanks)
      AtgMasterConfigurationsInfo.AtgEnabled = modATGMaster.AtgEnabled;
      AtgMasterConfigurationsInfo.AtgScanPeriod = modATGMaster.AtgScanPeriod;
      let TankList = [];
      if (modATGMaster.AtgMasterConfigurations.length > 0
        && Array.isArray(modATGMaster.AtgMasterConfigurations)
      ) {
        modATGMaster.AtgMasterConfigurations.forEach((attribute) => {
          MasterConfiguration.push(
            {
              TankAttributeName: attribute.TankAttributeName,
              TankAttributeCode: attribute.TankAttributeCode,
              ParameterName: attribute.ParameterName,
              AttributeDataType: attribute.AttributeDataType,
              ATGValueDataType: attribute.ATGValueDataType,
              Description: attribute.Description,
              UOM: attribute.UOM
            }
          )
        })
      }
      if (this.state.checkedTanks === true) {
        if (selectedTanks.length > 0
          && Array.isArray(selectedTanks)
        ) {
          selectedTanks.forEach((tanks) => {
            TankList.push(
              {
                TankCode: tanks.TankCode,
                PointName: tanks.PointName
              }
            )
          })
        }
      }

      AtgMasterConfigurationsInfo.AtgConfigurations = TankList;
      AtgMasterConfigurationsInfo.AtgMasterConfigurations = MasterConfiguration;

    } catch (error) {
      console.log("ATGInterfaceDetailsComposite:Error occured on fillDetails", error);
    }
    return AtgMasterConfigurationsInfo;
  }
  handleBaySelectionChange = (tanks) => {
    if (tanks.length> 0) {
      this.setState({ selectedTanks: tanks, checkedTanks: true });
    }
    else {
      this.setState({ selectedTanks: tanks, checkedTanks: false });
    }
  };

  handleCellPointDataEdit = (newVal, cellData) => {

    try {
      let AtgConfigurations = lodash.cloneDeep(this.state.AtgConfigurations)
      AtgConfigurations[cellData.rowIndex][cellData.field] = newVal;
      let selectedTanks = this.state.selectedTanks;
      let Tanks = selectedTanks.find(value => { return value.TankCode === cellData.rowData.TankCode })
      if (selectedTanks.length > 0 && Tanks !== undefined) {
        Tanks.PointName = newVal;
      }

      this.setState({ AtgConfigurations });

    } catch (error) {
      console.log(
        "ATGMasterComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };
  handleChange = (propertyName, data) => {

    try {
      const modATGMaster = lodash.cloneDeep(this.state.modATGMaster);
      modATGMaster[propertyName] = data;
      this.setState({ modATGMaster });
    } catch (error) {
      console.log(
        "ATGMasterDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };
  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modATGMaster = lodash.cloneDeep(this.state.modATGMaster);
      modATGMaster.AtgMasterConfigurations[cellData.rowIndex][
        cellData.field
      ] = newVal;
      this.setState({ modATGMaster });
    } catch (error) {
      console.log("Error in handleCellDataEdit", error)
    }
  };
  handleReset = () => {

    try {
      let atgMaster = lodash.cloneDeep(this.state.atgMaster)
      this.setState({
        modATGMaster: { ...atgMaster },
        AtgConfigurations: atgMaster.AtgConfigurations
      });
    } catch (error) {
      console.log("ATGInterfaceDetailsComposite:Error occured on handleReset", error);
    }
  }
  validateSave() {

    try {
      let AtgConfigurations = lodash.cloneDeep(this.state.AtgConfigurations);
      var AtgMasterValidationError = lodash.cloneDeep(this.state.AtgMasterValidationError)
      let selectedTanks = lodash.cloneDeep(this.state.selectedTanks)
      let modATGMaster = lodash.cloneDeep(this.state.modATGMaster)
      let notification = {
        messageType: "critical",
        message: "ATGMaster_FailurStatus",
        messageResultDetails: [],
      };
      Object.keys(AtgMasterValidationDef).forEach(function (key) {
        AtgMasterValidationError[key] = Utilities.validateField(
          AtgMasterValidationDef[key],
          modATGMaster.AtgScanPeriod
        );
      });
      if ((modATGMaster.AtgScanPeriod === "" ||
        modATGMaster.AtgScanPeriod === null ||
        modATGMaster.AtgScanPeriod === undefined))
        AtgMasterValidationError["AtgScanPeriod"] = "Bay_SCADA_InvalidMonitoringRate";
      if (modATGMaster.AtgMasterConfigurations.length > 0) {
        modATGMaster.AtgMasterConfigurations.forEach((com) => {
          ATGMasterParameterValidation.forEach((col) => {
            let err = "";

            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, com[col.field]);
            }

            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: [col.displayName],
                keyValues: [com[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });
        })
      }

      if (AtgConfigurations.length > 0) {
        AtgConfigurations.forEach((com) => {
          ATGMasterPointTableValidation.forEach((col) => {
            let err = "";

            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, com[col.field]);
            }

            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: [col.displayName],
                keyValues: [com[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });
        })
      }
      if (this.state.checkedTanks === true) {
        selectedTanks.map((value) => {
          if (value.PointName == "") {
            notification.messageResultDetails.push({
              keyFields: ["selectedTanks"],
              keyValues: [value.TankCode],
              isSuccess: false,
              errorMessage:
                "DeviceInfo_PointNameRequired",
            });
          }
        })
      }
      this.setState({ AtgMasterValidationError });
      var returnValue = true;
      if (returnValue)
        returnValue = Object.values(AtgMasterValidationError).every(function (value) {
          return value === "";
        });
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
        return false;
      }
      return returnValue;
    } catch (error) {
      console.log("Error while Validate Save", error)
    }
  }
  handleSave = () => {

    try {
      this.setState({ saveEnabled: true });
      let AtgMasterConfigurationsInfo = this.fillDetails()
      if (this.validateSave()) {
        this.updateATGMasterConfiguration(AtgMasterConfigurationsInfo);
      }
    } catch (error) {
      console.log(
        "ATGMasterDetailsComposite:Error occured on handleSave",
        error
      );
    }
  }
  handleGenerate = () => {

    try {
      let AtgMasterConfigurationsInfo = this.fillDetails()
      if (this.validateSave()) {
        this.generateButton(AtgMasterConfigurationsInfo);
      }
    } catch (error) {
      console.log(
        "ATGMasterDetailsComposite:Error occured on handleSave",
        error
      );
    }
  }
  generateButton = (AtgMasterConfigurationsInfo) => {
    var notification = {
      messageType: "critical",
      message: "ATGMaster_SavedStatus",
      messageResultDetails: [
        {
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    var obj = {
      Entity: AtgMasterConfigurationsInfo,
    };
    axios(
      RestAPIs.GenerateATGConfiguration,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {

        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          
          this.GetATGMasterConfiguration();
          this.setState({
            checkedTanks: false
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            checkedTanks: true
          });
          console.log("Error in GenerateATGConfiguration:", result.ErrorList);
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose:
              notification.messageType === "success" ? 10000 : false,
          }
        );
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true
        });
        notification.messageResultDetails[0].errorMessage = error;
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose:
              notification.messageType === "success" ? 10000 : false,
          }
        );
      });
  }
  updateATGMasterConfiguration = (AtgMasterConfigurationsInfo) => {
    var notification = {
      messageType: "critical",
      message: "ATGMaster_SavedStatus",
      messageResultDetails: [
        {
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    var obj = {
      Entity: AtgMasterConfigurationsInfo,
    };
    axios(
      RestAPIs.UpdateATGMasterConfiguration,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {

        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          // this.setState({
          //   AtgMasterConfigurations, AtgConfigurations
          // });
          this.GetATGMasterConfiguration();
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true
          });
          console.log("Error in UpdateATGMasterConfiguration:", result.ErrorList);
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose:
              notification.messageType === "success" ? 10000 : false,
          }
        );
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true
        });
        notification.messageResultDetails[0].errorMessage = error;
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose:
              notification.messageType === "success" ? 10000 : false,
          }
        );
      });
  }
  render() {
    // const user = this.props.userDetails.EntityResult;
    // let tmuiInstallType=TMUIInstallType.LIVE;
    // if(user.IsArchived)
    // tmuiInstallType=TMUIInstallType.ARCHIVE;
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              <TMUserActionsComposite
                breadcrumbItem={this.props.activeItem}
                handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                addVisible={false}
                deleteVisible={false}
                shrVisible={false}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              {this.state.isReadyToRender ? (
                // <ATGMasterConfigurationDetailsComposite
                //   Key="SlotConfigurationDetail"
                //   onNotice={this.notifyEvent}
                //   genericProps={this.props.activeItem.itemProps}
                // ></ATGMasterConfigurationDetailsComposite>
                <ATGMasterConfigurationSummaryComposite
                    AtgMasterConfigurations={this.state.AtgMasterConfigurations}
                    AtgConfigurations={this.state.AtgConfigurations}
                    modATGMaster={this.state.modATGMaster}
                    listOptions={{
                      dataTypesOptions: this.state.dataTypesOptions,
                  }}
                  uomOptionList={this.state.uomOptionList}
                    handleCellPointDataEdit={this.handleCellPointDataEdit}
                    onFieldChange={this.handleChange}
                    handleCellDataEdit={this.handleCellDataEdit}
                    generateButton={this.handleGenerate}
                    handleBaySelectionChange={this.handleBaySelectionChange}
                    selectedTanks={this.state.selectedTanks}
                    checkedTanks={this.state.checkedTanks}
                    isATGEnabled={this.state.isATGEnabled}
                    updateATGMasterConfiguration={this.handleSave}
                    handleReset={this.handleReset}
                    AtgMasterValidationError={this.state.AtgMasterValidationError}
                  >
                </ATGMasterConfigurationSummaryComposite>
              ) : (
                <LoadingPage message="Loading"></LoadingPage>
              )}
            </ErrorBoundary>
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

export default connect(mapStateToProps)(AtgMasterConfigurationComposite);

AtgMasterConfigurationComposite.propTypes = {
  activeItem: PropTypes.object,
};
