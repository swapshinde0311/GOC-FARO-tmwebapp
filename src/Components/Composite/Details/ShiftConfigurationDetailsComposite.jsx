import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { emptyShiftConfig } from "../../../JS/DefaultEntities";
import { functionGroups, fnShiftConfig } from "../../../JS/FunctionGroups";
import { ShiftConfigurationDetails } from "../../UIBase/Details/ShiftConfigurationDetails";
import { ShiftconfigurationValidationDef } from "../../../JS/ValidationDef";
import ShowAuthenticationLayout from "../Common/UserAuthentication";


class ShiftConfigurationDetailsComposite extends Component{

    state = {
        shiftConfig: lodash.cloneDeep(emptyShiftConfig),
        modShiftConfig: {},
        validationErrors: Utilities.getInitialValidationErrors(ShiftconfigurationValidationDef),
        isReadyToRender: false,
        saveEnabled: false,
        showAuthenticationLayout: false,
        tempShiftConfiguration:{}
    }

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.GetShift(this.props.selectedRow);
        } catch (error) {
            console.log(
                "ShiftConfigurationDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            if (
                this.state.shiftConfig.ID !== "" &&
                nextProps.selectedRow.ID === undefined &&
                this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
            ) {
                this.GetShift(nextProps.selectedRow);
                let validationErrors = { ...this.state.validationErrors };
                Object.keys(validationErrors).forEach((key) => {
                    validationErrors[key] = "";
                });
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "ShiftConfigurationDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }
    
    GetShift(ShiftConfigRow) {
        try {
            if (ShiftConfigRow.ID === undefined) {
                this.setState({
                    shiftConfig: lodash.cloneDeep(emptyShiftConfig),
                    modShiftConfig: lodash.cloneDeep(emptyShiftConfig),
                    isReadyToRender: true,
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnShiftConfig
                    ),
                }
                );
                return;
            }
            var keyCode = [
                {
                    key: KeyCodes.ShiftID,
                    value: ShiftConfigRow.ID,
                }
            ];
            var obj = {
                ShiftID: ShiftConfigRow.ID,
                keyDataCode: KeyCodes.ShiftID,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetShift,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    this.setState(
                        {
                            isReadyToRender: true,
                            shiftConfig: lodash.cloneDeep(result.EntityResult),
                            modShiftConfig: lodash.cloneDeep(result.EntityResult),
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShiftConfig
                            ),
                        }
                    );
                } else {
                    this.setState({
                        shiftConfig: lodash.cloneDeep(emptyShiftConfig),
                        modShiftConfig: lodash.cloneDeep(emptyShiftConfig),
                        isReadyToRender: true,
                    });
                    console.log("Error in getShiftConfig:", result.ErrorList);
                }
            })
                .catch((error) => {
                    console.log("Error while getShiftConfig:", error, ShiftConfigRow);
                });
        } catch (error) {
            console.log("Error while getShiftConfig:", error)
        }
    }
    handleChange = (propertyName, data) => {
        
        try {
            const modShiftConfig = lodash.cloneDeep(this.state.modShiftConfig);
            modShiftConfig[propertyName] = data;
            this.setState({ modShiftConfig });
            const validationErrors = lodash.cloneDeep(this.state.validationErrors);
            if (ShiftconfigurationValidationDef[propertyName] !== undefined) {
                validationErrors[propertyName] = Utilities.validateField(
                    ShiftconfigurationValidationDef[propertyName],
                    data
                );
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "ShiftConfigurationDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };
    handleReset = () => {
        try {
            const { validationErrors } = { ...this.state };
            const shiftConfig = lodash.cloneDeep(this.state.shiftConfig);
            Object.keys(validationErrors).forEach(function (key) {
                validationErrors[key] = "";
            });
            this.setState({
                modShiftConfig: { ...shiftConfig },
                validationErrors,
            });
        } catch (error) {
            console.log("ShiftConfigurationDetailsComposite:Error occured on handleReset", error);
        }
    };

    validateSave(modShiftConfig) {
        try {
            var validationErrors = lodash.cloneDeep(this.state.validationErrors);
            Object.keys(ShiftconfigurationValidationDef).forEach(function (key) {
                validationErrors[key] = Utilities.validateField(
                    ShiftconfigurationValidationDef[key],
                    modShiftConfig[key]
                );
            });
            let notification = {
                messageType: "critical",
                message: "ShiftConfigurationDetails_SavedStatus",
                messageResultDetails: [],
            };
            this.setState({ validationErrors });
            var returnValue = true;
            if (returnValue)
                returnValue = Object.values(validationErrors).every(function (value) {
                    return value === "";
                });

            if (notification.messageResultDetails.length > 0) {
                this.props.onSaved(this.state.modShiftConfig, "update", notification);
                return false;
            }
            return returnValue;
        } catch (error) {
            console.log("Error in validatesave",error)
        }
    }
    saveShiftConfiguration = () => {
        try {
            this.setState({ saveEnabled: false });
            let tempShiftConfiguration = lodash.cloneDeep(this.state.tempShiftConfiguration);
            this.CreateAndUpdateShiftConfiguration(tempShiftConfiguration)


            
        } catch (error) {
            console.log("ShiftConfigurationDetailsComposite : Error in ShiftConfiguration")
        }
    }
    handleSave = () => {
        
        try {
            let modShiftConfig = lodash.cloneDeep(this.state.modShiftConfig);;
            // this.setState({ saveEnabled: false });
            if (this.validateSave(modShiftConfig)) {
                let tempShiftConfiguration = lodash.cloneDeep(modShiftConfig);
                let showAuthenticationLayout =
                    this.props.userDetails.EntityResult.IsWebPortalUser !== true
                        ? true
                        : false;
                this.setState({ showAuthenticationLayout, tempShiftConfiguration }, () => {
                    if (showAuthenticationLayout === false) {
                        this.saveShiftConfiguration();
                    }
                });
            } else {
                this.setState({ saveEnabled: true });
            }
        }
        catch (error) {
            console.log("ShiftConfigurationDetailsComposite:Error occured on handleSave", error);
        }
    };
    CreateAndUpdateShiftConfiguration(modShiftConfig) {
        try {
            let obj = {
                Entity: modShiftConfig,
            };

            let notification = {
                messageType: "critical",
                message: "ShiftConfigurationDetails_SavedStatus",
                messageResultDetails: [
                    {
                        keyFields: ["ShiftInfo_ShiftName"],
                        keyValues: [modShiftConfig.Name],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };

            axios(
                RestAPIs.AddUpdateShift,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
            
                let result = response.data;
                notification.messageType = result.IsSuccess ? "success" : "critical";
                notification.messageResultDetails[0].isSuccess = result.IsSuccess;
                if (result.IsSuccess === true) {
                
                    let shiftConfiginfo = result.EntityResult
                    this.setState(
                        {
                            modShiftConfig: lodash.cloneDeep(result.EntityResult),
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShiftConfig
                            ),
                            showAuthenticationLayout: false,

                        },
                        () => this.GetShift({ ID: shiftConfiginfo.ID })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShiftConfig
                        ),
                        showAuthenticationLayout: false,

                    });
                    console.log("Error in ShiftCongiguration:", result.ErrorList);
                }
                this.props.onSaved(this.state.modShiftConfig, "add", notification);
            })
                .catch((error) => {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShiftConfig
                        ),
                        showAuthenticationLayout: false,

                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(this.state.modShiftConfig, "add", notification);
                });
        } catch (err) {
            console.log("error while create/update shift configuration",err)
        }
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
                    <TMDetailsHeader
                        entityCode={this.state.shiftConfig.Name}
                        newEntityName="ShiftInfo_NewShift"

                    ></TMDetailsHeader>
                </ErrorBoundary>
                <ErrorBoundary>
                    <ShiftConfigurationDetails
                        shiftConfig={this.state.shiftConfig}
                        modShiftConfig={this.state.modShiftConfig}
                        validationErrors={this.state.validationErrors}
                        onFieldChange={this.handleChange}
                        isEnterpriseNode={this.props.userDetails.EntityResult.IsEnterpriseNode}
                    >
                    </ShiftConfigurationDetails>
                </ErrorBoundary>
                <ErrorBoundary>
                    <TMDetailsUserActions
                        handleBack={this.props.onBack}
                        handleSave={this.handleSave}
                        handleReset={this.handleReset}
                        saveEnabled={this.state.saveEnabled}
                    ></TMDetailsUserActions>
                </ErrorBoundary>
                {this.state.showAuthenticationLayout ? (
                    <ShowAuthenticationLayout
                        Username={this.props.userDetails.EntityResult.UserName}
                        functionName={
                            this.state.shiftConfig.Name === ""
                                ? functionGroups.add
                                : functionGroups.modify
                        }
                        functionGroup={fnShiftConfig}
                        handleOperation={this.saveShiftConfiguration}
                        handleClose={this.handleAuthenticationClose}
                    ></ShowAuthenticationLayout>
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

export default connect(mapStateToProps)(ShiftConfigurationDetailsComposite);

ShiftConfigurationDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};