import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import lodash from "lodash";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import { emptyMasterConfigurationInfo, emptyScadaBayList} from "../../../JS/DefaultEntities";
import {
    BayAllocationScadaValidationDef,
} from "../../../JS/ValidationDef";
import { fnbaySCADAConfiguration, functionGroups } from "../../../JS/FunctionGroups";
import { BayAllocationScadaPointTableValidation, BayAllocationScadaParameterValidation} from "../../../JS/DetailsTableValidationDef";
import BayAllocationSCADAConfigurationDetails from "../../UIBase/Details/BayAllocationSCADAConfigurationDetails";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class BayAllocationSCADAConfigurationDetailsComposite extends Component {
    state = {
        bayAllocationQueueData: [],
        bayAllocationMonitoringData: [],
        bayAllocationPointName: [],
        isReadyToRender: false,
        saveEnabled: true,
        IsEnabled: "",
        selectedbays: [],
        bayAllocationValidationErrors: Utilities.getInitialValidationErrors(
            BayAllocationScadaValidationDef
        ),
        showAuthenticationLayout: false,
        tempScadaBayMasterConfig:{}
    }

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnbaySCADAConfiguration
                    )
})
            this.getBayAllocationQueueDataConfigurations();
            this.getBayAllocationPointNameConfigurations();
        } catch (error) {
            console.log("SlotConfigurationDetail:Error occurred on ", error);
        }
    }
    getBayAllocationQueueDataConfigurations() {
        
        try {
            axios(
                RestAPIs.GetSCADAParameterMapping,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                
                var result = response.data;
                if (result.IsSuccess) {
                    if (
                        result.EntityResult !== null
                    ) {
                        let bayAllocationQueueData = lodash.cloneDeep(emptyMasterConfigurationInfo)
                         bayAllocationQueueData =
                             result.EntityResult.AtgParameterConfiguration
                        let bayAllocationMonitoringData = result.EntityResult.Table1
                        if (bayAllocationMonitoringData !== null) {
                            bayAllocationMonitoringData.forEach((Monitoring) => {
                                Monitoring.MonitoringRate = Monitoring.MonitoringRate === 0 ? "" : Number.isInteger(Monitoring.MonitoringRate) ? Math.round(Monitoring.MonitoringRate) : Monitoring.MonitoringRate
                            })
                        }
                        console.log("bayAllocationQueueData", bayAllocationQueueData)
                        this.setState({
                            isReadyToRender: true, bayAllocationQueueData,
                            bayAllocationMonitoringData,
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.add,
                                fnbaySCADAConfiguration
                            )
                        });
                    }
                } else {
                    console.log("Error in getBayAllocationQueueDataConfigurations:", result.ErrorList);
                }
            });
        } catch (error) {
            console.log(
                "getBayAllocationQueueDataConfigurations:Error occured on getBayAllocationQueueDataConfigurationsList",
                error
            );
        }
    }
    getBayAllocationPointNameConfigurations() {
        try {
            axios(
                RestAPIs.GetPointConfig,    
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                
                var result = response.data;
                if (result.IsSuccess) {
                    if (
                        result.EntityResult !== null && result.IsSuccess === true) {
                        let bayAllocationPointName = lodash.cloneDeep(emptyScadaBayList)
                        bayAllocationPointName = lodash.cloneDeep(result.EntityResult.Table);
                        let  test = lodash.cloneDeep(result.EntityResult.Table);
                        let selectedbays = lodash.cloneDeep(this.state.selectedbays)
                        let checkedList = [];
                            var selectBay = test.filter(
                                (allBay) => {
                                    return allBay.PointName !== ""
                                });
                                checkedList.push(selectBay)
                        this.setState({
                            isReadyToRender: true,
                            bayAllocationPointName,
                            selectedbays: checkedList[0],
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.add,
                                fnbaySCADAConfiguration
                            )
                        });
                    }
                } else {
                    this.setState({
                        bayAllocationPointName: lodash.cloneDeep(emptyScadaBayList),
                        selectedbays:lodash.cloneDeep(this.state.selectedbays)
                    })
                    console.log("Error in bayAllocationPointNameConfigurations:", result.ErrorList);
                }
            });
        } catch (error) {
            console.log(
                "bayAllocationPointNameConfigurations:Error occured on getBayAllocationQueueDataConfigurationsList",
                error
            );
        }
    }
    handleCellParameterDataEdit = (newVal, cellData) => {
        
        try {
            let bayAllocationQueueData = lodash.cloneDeep(
                this.state.bayAllocationQueueData
            );
            bayAllocationQueueData[cellData.rowIndex][cellData.field] = newVal;
            this.setState({ bayAllocationQueueData });
        } catch (error) {
            console.log(
                "BayDetailsComposite:Error occured on handleCellDataEdit",
                error
            );
        }
    };
    handleCellPointDataEdit = (newVal, cellData) => {
        try {
            let bayAllocationPointName = lodash.cloneDeep(this.state.bayAllocationPointName)
            let selectedbays = this.state.selectedbays;
            let Bays = selectedbays.find(value => { return value.BayCode === cellData.rowData.BayCode })
            if (selectedbays.length > 0 && Bays !==undefined) {
                Bays.PointName = newVal;
            }
                bayAllocationPointName[cellData.rowIndex][cellData.field] = newVal;
                this.setState({ bayAllocationPointName });

        } catch (error) {
            console.log(
                "BayDetailsComposite:Error occured on handleCellDataEdit",
                error
            );
        }
    };
    handleBaySelectionChange = (bays) => {
                this.setState({ selectedbays: bays });
    };
    handleChange = (propertyName, data) => {
        try {
            const bayAllocationMonitoringData = lodash.cloneDeep(this.state.bayAllocationMonitoringData);
            bayAllocationMonitoringData[0][propertyName] = data;
            this.setState({ bayAllocationMonitoringData });
        } catch (error) {
            console.log(
                "TruckReceiptDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };
    fillDetails() {
        
        let ScadaBayMasterConfig = {
            IsEnabled:"",
            MasterConfigurationInfo: [],
            ScadaBayList: [],
            ScanPeriod:""
        }
        try {
            
            let MasterConfiguration = [];
            let bayAllocationQueueData = lodash.cloneDeep(this.state.bayAllocationQueueData);
            let bayAllocationMonitoringData = lodash.cloneDeep(this.state.bayAllocationMonitoringData);
            let bayAllocationPointName = lodash.cloneDeep(this.state.bayAllocationPointName)
            ScadaBayMasterConfig.IsEnabled = bayAllocationMonitoringData[0].IsEnabled;
            ScadaBayMasterConfig.ScanPeriod = bayAllocationMonitoringData[0].MonitoringRate ;
            let BayList = [];
            if (bayAllocationQueueData.length > 0
                && Array.isArray(bayAllocationQueueData)
            ) {
                bayAllocationQueueData.forEach((attribute) => {
                    MasterConfiguration.push(
                        {
                            AttributeName: attribute.AttributeName,
                            ParameterName: attribute.ParameterName
                        }
                    )
                })
            }
            if (bayAllocationPointName.length > 0
                && Array.isArray(bayAllocationPointName) 
            ) {
                bayAllocationPointName.forEach((bays) => {
                    let selectedbays = lodash.cloneDeep(this.state.selectedbays)
                    let Bays = selectedbays.find(value => { return value.BayCode === bays.BayCode })
                    if (bays.PointName !== "" && Bays !== undefined) {

                        BayList.push(
                            {
                                Code: bays.BayCode,
                                PointName: bays.PointName
                            }
                        )
                    }
                    else {
                        BayList.push(
                            {
                                Code: bays.BayCode,
                                PointName: ""
                            }
                        )
                    }
                })
            }
            
            ScadaBayMasterConfig.ScadaBayList = BayList;
            ScadaBayMasterConfig.MasterConfigurationInfo = MasterConfiguration;

        } catch (error) {
            console.log("ATGInterfaceDetailsComposite:Error occured on fillAttributeDetails", error);
        }
        return ScadaBayMasterConfig;
    }
    validateSave() {
        try {
            var bayAllocationValidationErrors = lodash.cloneDeep(this.state.bayAllocationValidationErrors);
            let bayAllocationMonitoringData = lodash.cloneDeep(this.state.bayAllocationMonitoringData)
            let bayAllocationPointName = lodash.cloneDeep(this.state.bayAllocationPointName)
            let bayAllocationQueueData = lodash.cloneDeep(this.state.bayAllocationQueueData)
            let selectedbays = lodash.cloneDeep(this.state.selectedbays)
            let notification = {
                messageType: "critical",
                message: "BayAllocation_FailurStatus",
                messageResultDetails: [],
            };
            Object.keys(BayAllocationScadaValidationDef).forEach(function (key) {
                bayAllocationValidationErrors[key] = Utilities.validateField(
                    BayAllocationScadaValidationDef[key],
                    bayAllocationMonitoringData[0][key]
                );
            });
            // Object.keys(BayAllocationScadaValidationDef).forEach(function (key) {
            //     bayAllocationValidationErrors[key] = Utilities.validateField(
            //         BayAllocationScadaValidationDef[key],
            //         bayAllocationPointName[key]
            //     );
            // });
            if ((bayAllocationMonitoringData[0].MonitoringRate === "" ||
                bayAllocationMonitoringData[0].MonitoringRate === null ||
                bayAllocationMonitoringData[0].MonitoringRate=== undefined))
                bayAllocationValidationErrors["MonitoringRate"] = "Bay_SCADA_InvalidMonitoringRate";
            if (bayAllocationQueueData.length > 0 ) {
                bayAllocationQueueData.forEach((com) => {
                    BayAllocationScadaParameterValidation.forEach((col) => {
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
            
            if (bayAllocationPointName.length > 0  ) {
                bayAllocationPointName.forEach((com) => {
                    BayAllocationScadaPointTableValidation.forEach((col) => {
                        let err = "";

                        if (col.validator !== undefined) {
                            err = Utilities.validateField(col.validator, com[col.field]);
                        }

                        if (err !== "" ) {
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
            selectedbays.map((value) =>  {
                if (value.PointName === "") {
                            notification.messageResultDetails.push({
                                keyFields: ["selectedbays"],
                                keyValues: [value.BayCode],
                                isSuccess: false,
                                errorMessage:
                                    "DeviceInfo_PointNameRequired",
                            });
                    }
                })
            this.setState({ bayAllocationValidationErrors });
            var returnValue = true;
            if (returnValue)
                returnValue = Object.values(bayAllocationValidationErrors).every(function (value) {
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
    
    saveScadaConfig = () => {
        try {
          this.setState({ saveEnabled: false });
         
          let tempScadaBayMasterConfig = lodash.cloneDeep(this.state.tempScadaBayMasterConfig);
          this.createGenerateConfig(tempScadaBayMasterConfig);

        } catch (error) {
          console.log("Save Scada Config Composite : Error in saveScadaConfig");
        }
      };

    handleSave = () => {
        this.handleAuthenticationClose();
        try {
            let tempScadaBayMasterConfig = this.fillDetails()
            if (this.validateSave()) {
              let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
                this.setState({ showAuthenticationLayout,tempScadaBayMasterConfig }, () => {
                    if (showAuthenticationLayout === false) {
                      this.saveScadaConfig();
                    }
                });
            } else {
                this.setState({ saveEnabled: true });

            }
        } catch (error) {
            console.log(
                "BayallocationscadaDetailsComposite:Error occured on handleSave",
                error
            );
        }
    }
    
    createGenerateConfig = (ScadaBayMasterConfig) => {
        this.handleAuthenticationClose();
        let bayAllocationQueueData = lodash.cloneDeep(this.state.bayAllocationQueueData);
        let bayAllocationMonitoringData = lodash.cloneDeep(this.state.bayAllocationMonitoringData)
        let bayAllocationPointName = lodash.cloneDeep(this.state.bayAllocationPointName)
        
        var notification = {
            messageType: "critical",
            message: "BayAllocation_SavedStatus",
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
            Entity: ScadaBayMasterConfig,
        };
        axios(
            RestAPIs.CreateConfig,
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
                    this.setState({ bayAllocationQueueData, bayAllocationMonitoringData, bayAllocationPointName, }, () => {
                        this.getBayAllocationPointNameConfigurations();
                        this.getBayAllocationQueueDataConfigurations();
                    });
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnbaySCADAConfiguration
                        )
                    });
                    console.log("Error in updatePipelineReceipt:", result.ErrorList);
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


        this.setState({
            bayAllocationQueueData: this.state.bayAllocationQueueData,
        });
    }

    handleAuthenticationClose = () => {
        this.setState({
          showAuthenticationLayout: false,
        });
      };

    render() {
        return this.state.isReadyToRender ? (
            <div>
                <ErrorBoundary>
                    <BayAllocationSCADAConfigurationDetails
                        bayAllocationQueueData={this.state.bayAllocationQueueData}
                        bayAllocationPointName={this.state.bayAllocationPointName}
                        bayAllocationMonitoringData={this.state.bayAllocationMonitoringData}
                        handleCellParameterDataEdit={this.handleCellParameterDataEdit}
                        handleCellPointDataEdit={this.handleCellPointDataEdit}
                        createGenerateConfig={this.handleSave}
                        handleBaySelectionChange={this.handleBaySelectionChange}
                        selectedbays={this.state.selectedbays}
                        onFieldChange={this.handleChange}
                        bayAllocationValidationErrors={this.state.bayAllocationValidationErrors}
                        saveEnabled={this.state.saveEnabled}
                    >
                    </BayAllocationSCADAConfigurationDetails>
                </ErrorBoundary>
                {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.add}
            functionGroup={fnbaySCADAConfiguration}
            handleOperation={this.saveScadaConfig}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
            </div>
        ) : (
            <LoadingPage message="Loading"></LoadingPage>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        userDetails: state.getUserDetails.userDetails,
        tokenDetails: state.getUserDetails.TokenAuth,
    };
};
BayAllocationSCADAConfigurationDetailsComposite.propTypes = {
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
    refreshScheduleUIRequired: PropTypes.func.isRequired,
    addSchedule: PropTypes.func.isRequired,
};
export default connect(mapStateToProps)(BayAllocationSCADAConfigurationDetailsComposite);