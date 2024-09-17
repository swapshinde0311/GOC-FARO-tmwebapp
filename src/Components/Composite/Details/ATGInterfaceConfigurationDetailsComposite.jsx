import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import lodash from "lodash";
import ErrorBoundary from "../../ErrorBoundary";
import { toast, ToastContainer } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import "react-toastify/dist/ReactToastify.css";
import { emptyATGTank } from "../../../JS/DefaultEntities"
import { ATGInterfaceConfigurationDetails } from "../../UIBase/Details/ATGInterfaceConfigurationDetails";
class ATGInterfaceConfigurationDetailsComposite extends Component {
    state = {
        TankInfo:lodash.cloneDeep(emptyATGTank),
        modATGTankInfo: {},
        AtgAttributeConfigurationData: {},
        saveEnabled: true
    }
    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            console.log(this.props.tankObj)
            this.GetTankATGConfiguration(this.props.tankObj.Code)
        } catch (error) {
            console.log(
                "ATGInterfaceConfigurationDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }
    handleChange = (propertyName, data) => {
        try {
            const modATGTankInfo = lodash.cloneDeep(this.state.modATGTankInfo);
            modATGTankInfo[propertyName] = data;
            this.setState({ modATGTankInfo });
        } catch (error) {
            console.log(
                "TruckReceiptDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };
    GetTankATGConfiguration(TankCode) {
        try {
            axios(
                RestAPIs.GetTankATGConfiguration + "?TankCode=" + TankCode,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        let AtgAttributeConfigurationData = result.EntityResult.AtgAttributeConfigurationData;
                        for (let i = 0; i < AtgAttributeConfigurationData.length; i++) {
                            AtgAttributeConfigurationData[i].Parameter.Parameter = AtgAttributeConfigurationData[i].Parameter.Parameter
                            AtgAttributeConfigurationData[i].Parameter.Point = AtgAttributeConfigurationData[i].Parameter.Point
                        }
                        this.setState({
                            modATGTankInfo: result.EntityResult,
                            TankInfo: result.EntityResult,
                            AtgAttributeConfigurationData
                        });
                    } else {
                        console.log("Error in GetTankATGConfiguration:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("Error while getting GetTankATGConfiguration:", error);
                });
        } catch (error) {
            console.log("Error while getting GetTankATGConfiguration:", error);
        }
    }
    handleCellCheck = (data, cellData) => {
        
        try {
            let AtgAttributeConfigurationData = lodash.cloneDeep(this.state.AtgAttributeConfigurationData);
            AtgAttributeConfigurationData[data.rowIndex].EnableScan = cellData;
            this.setState({ AtgAttributeConfigurationData });
        } catch (error) {
            console.log("Error in handleCellcheck", error)
        }
    };
    fillDetails() {
        try {
            let modATGTankInfo = lodash.cloneDeep(this.state.modATGTankInfo);
            let AtgAttributeConfigurationData = lodash.cloneDeep(this.state.AtgAttributeConfigurationData)
            let tankComps = [];
            if (Array.isArray(AtgAttributeConfigurationData)) {
                AtgAttributeConfigurationData.forEach((item) => {
                   
                        tankComps.push(item);
                    }
                )
            }
            modATGTankInfo.AtgAttributeConfigurationData = tankComps;
            // this.setState({ modATGTankInfo });
            return modATGTankInfo;

        } catch (error) {
            console.log("ATGInterfaceDetailsComposite:Error occured on fillAttributeDetails", error);
        }
    }
    handleSave = () => {
        try {
            this.setState({ saveEnabled: true });
            let AtgConfigurationInfo = this.fillDetails()
            this.UpdateATGConfiguration(AtgConfigurationInfo);
            
        } catch (error) {
            console.log(
                "PipelineReceiptDetailsComposite:Error occured on handleSave",
                error
            );
        }
    }
    handleReset = () => {
        try {
            let TankInfo = lodash.cloneDeep(this.state.TankInfo)
            this.setState({
                modATGTankInfo: TankInfo,
                AtgAttributeConfigurationData: TankInfo.AtgAttributeConfigurationData
            });
        } catch (error) {
            console.log("ATGInterfaceDetailsComposite:Error occured on handleReset", error);
        }
    }
    handleCellDataEdit = (newVal, cellData) => {
        try {
            let AtgAttributeConfigurationData = lodash.cloneDeep(
                this.state.AtgAttributeConfigurationData
            );
                AtgAttributeConfigurationData[cellData.rowIndex][cellData.field].Point = newVal;
            this.setState({ AtgAttributeConfigurationData });
        } catch (error) {
            console.log(
                "BayDetailsComposite:Error occured on handleCellDataEdit",
                error
            );
        }
    };
    handleCellParameterDataEdit = (newVal, cellData) => {
        try {
            let AtgAttributeConfigurationData = lodash.cloneDeep(
                this.state.AtgAttributeConfigurationData
            );
            
            AtgAttributeConfigurationData[cellData.rowIndex][cellData.field].Parameter = newVal;
            this.setState({ AtgAttributeConfigurationData });
        } catch (error) {
            console.log(
                "BayDetailsComposite:Error occured on handleCellDataEdit",
                error
            );
        }
    };
    UpdateATGConfiguration = (AtgConfigurationInfo) => {
        
        let modATGTankInfo = lodash.cloneDeep(this.state.modATGTankInfo);
        var notification = {
            messageType: "critical",
            message: "ATG_Details_Saved_Success",
            messageResultDetails: [
                {
                    keyFields: ["AtgConfigure_TankCode"],
                    keyValues: [modATGTankInfo.TankCode],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };
        var obj = {
            Entity: AtgConfigurationInfo,
        };
        axios(
            RestAPIs.UpdateATGConfiguration,
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
                    this.setState({ modATGTankInfo }, () => {
                        this.GetTankATGConfiguration(
                            { TankCode: modATGTankInfo.TankCode },
                            
                        );
                    });
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled:true
                    });
                    console.log("Error in updatePipelineReceipt:", result.ErrorList);
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
                this.setState({
                    saveEnabled: true
                });
                notification.messageResultDetails[0].errorMessage = error;
                toast(
                    <ErrorBoundary>
                        <NotifyEvent notificationMessage={notification}></NotifyEvent>
                    </ErrorBoundary>,
                    {
                        autoClose: notification.messageType === "success" ? 10000 : false,
                    }
                );
            });
        

        this.setState({
            modATGTankInfo: this.state.modATGTankInfo,
        });
    }
    render() {
        return (
            <div>
                <ATGInterfaceConfigurationDetails
                modATGTankInfo={this.state.modATGTankInfo}
                AtgAttributeConfigurationData={this.state.AtgAttributeConfigurationData}
                tankObj={this.props.tankObj}
                handleCellCheck={this.handleCellCheck}
                handleCellDataEdit={this.handleCellDataEdit}
                handleCellParameterDataEdit={this.handleCellParameterDataEdit}
                onFieldChange={this.handleChange}
            >
            </ATGInterfaceConfigurationDetails>
                <ErrorBoundary>
                    <TMDetailsUserActions
                        handleBack={this.props.onBack}
                        handleSave={this.handleSave}
                        handleReset={this.handleReset}
                        saveEnabled={this.state.saveEnabled}
                    ></TMDetailsUserActions>
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
        )
    }
}
    const mapStateToProps = (state) => {
        return {
            userDetails: state.getUserDetails.userDetails,
            tokenDetails: state.getUserDetails.TokenAuth,
        };
    };

export default connect(mapStateToProps)(ATGInterfaceConfigurationDetailsComposite);

ATGInterfaceConfigurationDetailsComposite.propTypes = {
    tankObj: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    handleATGConfiguration: PropTypes.func.isRequired,
    activeItem: PropTypes.object,
};