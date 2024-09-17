import React from 'react';
import { toast } from 'react-toastify';
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import NotifyEvent from '../../../JS/NotifyEvent';
import axios from 'axios';
import ErrorBoundary from '../../ErrorBoundary';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TMDetailsHeader from '../../UIBase/Common/TMDetailsHeader';
import ProductForecastConfigurationDetail from '../../UIBase/Details/ProductForecastConfigurationDetail';
import { Button } from '@scuf/common';
import { TranslationConsumer } from '@scuf/localization';
import { productForecastParameterValidationDef } from '../../../JS/ValidationDef';
import { LoadingPage } from '../../UIBase/Common/LoadingPage';
import {
    fnProductForecastConfiguration,
    functionGroups,
} from "../../../JS/FunctionGroups";

class ProductForecastConfigurationDetailComposite extends React.Component {
    state = {
        terminalCode: null,
        productForecastConfig: {},
        modProductForecastConfig: {},
        isNew: false,
        validationErrors: Utilities.getInitialValidationErrors(
            productForecastParameterValidationDef
        ),
        controlParameters: {},
        isReadyToRender: false,
        saveEnabled: false
    }

    componentDidMount() {
        // get terminals
        this.getTerminals()
            .then(terminalCode => {
                this.setState({
                    terminalCode: terminalCode
                }, () => {
                    // fetch product forecast configuration when terminal code is available
                    if (terminalCode !== "")
                        this.getProductForecastConfiguration();
                })
            })
            .catch(error => console.log(error));
    }

    // populate default values for parameters list object
    populateDefaultValuesForCreate = (pfConfig) => {
        try {
            if (Array.isArray(pfConfig)) {
                // return parameters list object with default value populated in 'Value' property
                return pfConfig.map(param => {
                    return {
                        ...param,
                        Value: (param.Value === "" ? param.DefaultValue : param.Value)
                    }
                })
            }

            return pfConfig;
        }
        catch (error) {
            console.log("Error in populateDefaultValuesForCreate(): ", error);
            return pfConfig;
        }
    }

    // fetch product forecast configuration
    getProductForecastConfiguration = () => {
        try {
            let notification = {
                messageType: "critical",
                message: "ProductForecastConfigurationsEmpty",
                messageResultDetails: [],
            };

            axios(
                RestAPIs.GetProductForecastConfiguration + "?TerminalCode=" + this.state.terminalCode + "&GetIfEmpty=true",
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            ).then(response => {
                let result = response.data;
                if (result.IsSuccess) {
                    let isNew = false;
                    if (Array.isArray(result.EntityResult.ProductForecastParams) &&
                        result.EntityResult.ProductForecastParams.length > 0 &&
                        result.EntityResult.ProductForecastParams[0].Value === "") {
                        isNew = true;
                        notification = {
                            messageType: "critical",
                            message: "ProductForecastConfiguration_New",
                            messageResultDetails: [],
                        };
                        toast(
                            <ErrorBoundary>
                                <NotifyEvent
                                    notificationMessage={notification}
                                ></NotifyEvent>
                            </ErrorBoundary>,
                            {
                                autoClose:
                                    notification.messageType === "success"
                                        ? 10000
                                        : false,
                            }
                        );
                    }

                    this.setState({
                        productForecastConfig: { ...result.EntityResult },
                        modProductForecastConfig: {
                            ...result.EntityResult,
                            ProductForecastParams: this.populateDefaultValuesForCreate(result.EntityResult.ProductForecastParams)
                        },
                        isNew: isNew,
                        // saveEnabled: true
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            isNew
                                ? functionGroups.add
                                : functionGroups.modify,
                            fnProductForecastConfiguration
                        )
                    }, () => {
                        // fetch parameters for the controls once state is updated
                        this.getControlParameters();
                        this.setState({
                            isReadyToRender: true
                        });
                    });
                }
                else {
                    toast(
                        <ErrorBoundary>
                            <NotifyEvent
                                notificationMessage={notification}
                            ></NotifyEvent>
                        </ErrorBoundary>,
                        {
                            autoClose:
                                notification.messageType === "success"
                                    ? 10000
                                    : false,
                        }
                    );
                    console.log(
                        "Error while getting getProductForecastConfigurations:",
                        result
                    );
                    this.setState({
                        isReadyToRender: true
                    });
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    isReadyToRender: true
                });
            });
        }
        catch (error) {
            console.log("Error in getProductForecastConfiguration(): ", error);
            this.setState({
                isReadyToRender: true
            });
        }
    }

    // get parameters for dropdown controls
    getControlParameters = () => {
        try {
            this.state.productForecastConfig.ProductForecastParams.forEach(param => {
                // if API is available, fetch data and populate for respective control
                if (param.API) {
                    axios(
                        RestAPIs.WebAPIURL + param.API,
                        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
                    ).then(response => {
                        if (response.data.IsSuccess) {
                            let data = response.data.EntityResult;
                            this.setState({
                                controlParameters: {
                                    ...this.state.controlParameters,
                                    [param.Name]: data
                                }
                            });
                        }
                        else {
                            this.setState({
                                controlParameters: {
                                    ...this.state.controlParameters,
                                    [param.Name]: null
                                }
                            });
                        }
                    }).catch(error => {
                        console.log("Error in fetching control parameters for ProductForecastConfiguration", error);
                        this.setState({
                            controlParameters: {
                                ...this.state.controlParameters,
                                [param.Name]: null
                            }
                        });
                    });
                }
            })
        }
        catch (error) {
            console.log("Error in getControlParameters(): ", error);
        }
    }

    // fetch terminal list asynchronously
    async getTerminals() {
        let notification = {
            messageType: "critical",
            message: "TerminalList_NotAvailable",
            messageResultDetails: [],
        };

        // return axios promise
        return await axios(
            RestAPIs.GetTerminalDetailsForUser,
            Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
        )
            .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    if (
                        Array.isArray(result.EntityResult) &&
                        result.EntityResult.length > 0
                    ) {
                        return result.EntityResult[0].Key.Code;
                    } else {
                        console.log("Error while getting Terminal List:", result);
                        toast(
                            <ErrorBoundary>
                                <NotifyEvent notificationMessage={notification}></NotifyEvent>
                            </ErrorBoundary>,
                            {
                                autoClose:
                                    notification.messageType === "success" ? 10000 : false,
                            }
                        );

                        return "";
                    }
                } else {
                    console.log("Error while getting Terminal List:", result);
                    toast(
                        <ErrorBoundary>
                            <NotifyEvent notificationMessage={notification}></NotifyEvent>
                        </ErrorBoundary>,
                        {
                            autoClose: notification.messageType === "success" ? 10000 : false,
                        }
                    );

                    return "";
                }
            })
            .catch((error) => {
                toast(
                    <ErrorBoundary>
                        <NotifyEvent notificationMessage={notification}></NotifyEvent>
                    </ErrorBoundary>,
                    {
                        autoClose: notification.messageType === "success" ? 10000 : false,
                    }
                );
                console.log("Error while getting Terminal List:", error);

                return "";
            });
    }

    // handle change in value of controls
    handleChange = (propertyName, value) => {
        try {
            // update state based on control key (propertyName)
            const updatedProductForecastConfig = {
                ...this.state.modProductForecastConfig,
                ProductForecastParams: this.state.modProductForecastConfig.ProductForecastParams.map(param => {
                    if (param.Name === propertyName) {
                        return {
                            ...param,
                            Value: value
                        };
                    }

                    return param;
                })
            };

            this.setState({
                modProductForecastConfig: updatedProductForecastConfig
            }, () => {
                // check validations
                if (Object.keys(this.state.validationErrors).includes(propertyName)) {
                    let validations = Utilities.validateField(
                        productForecastParameterValidationDef[propertyName],
                        value
                    );

                    this.setState({
                        validationErrors: {
                            ...this.state.validationErrors,
                            [propertyName]: validations
                        }
                    });
                }
            });
        }
        catch (error) {
            console.log("Error updating values: " + error);
        }
    }

    // validate all the control values
    validate = () => {
        const validations = {};
        const validationDefKeys = Object.keys(productForecastParameterValidationDef);
        this.state.modProductForecastConfig.ProductForecastParams.forEach(param => {
            if (validationDefKeys.includes(param.Name)) {
                validations[param.Name] = Utilities.validateField(
                    productForecastParameterValidationDef[param.Name],
                    param.Value
                );
            }
        });

        this.setState({
            validationErrors: validations
        });

        return !Object.values(validations).filter(value => value !== "").length > 0;
    }

    // save button click event handler, redirects to create/update
    handleSave = () => {
        try {
            if (this.validate()) {
                this.setState({ saveEnabled: false }, () => {
                    const requestObj = {
                        Entity: { ...this.state.modProductForecastConfig }
                    }

                    // if configuration does not exist, create configuration, else update configuration
                    if (this.state.isNew) {
                        this.createConfiguration(requestObj);
                    }
                    else {
                        this.updateConfiguration(requestObj);
                    }
                });
            }
        }
        catch (error) {
            console.log("Error saving product forecast configuration: ", error);
        }
    }

    // create product forecast configuration
    createConfiguration = (obj) => {
        let notification = {
            messageType: "critical",
            message: "ProductForecastConfiguration_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: ["TerminalCode"],
                    keyValues: [this.state.terminalCode],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };

        axios(
            RestAPIs.CreateProductForecastConfiguration,
            Utilities.getAuthenticationObjectforPost(
                obj,
                this.props.tokenDetails.tokenInfo
            )
        ).then(response => {
            let result = response.data;
            notification.messageType = result.IsSuccess ? "success" : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (!result.IsSuccess) {
                notification.messageResultDetails[0].errorMessage =
                    result.ErrorList[0];
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnProductForecastConfiguration
                    )
                });
            }
            else {
                this.getProductForecastConfiguration();
            }

            this.props.onNotice(notification);
        }).catch(error => {
            this.setState({
                saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.add,
                    fnProductForecastConfiguration
                )
            });
            notification.messageResultDetails[0].errorMessage = error;
            console.log("Error creating product forecast configuration: ", error);
            this.props.onNotice(notification);
        })
    }

    // update product forecasting confguration
    updateConfiguration = (obj) => {
        let notification = {
            messageType: "critical",
            message: "ProductForecastConfiguration_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: ["TerminalCode"],
                    keyValues: [this.state.terminalCode],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };

        axios(
            RestAPIs.UpdateProductForecastConfiguration,
            Utilities.getAuthenticationObjectforPost(
                obj,
                this.props.tokenDetails.tokenInfo
            )
        ).then(response => {
            let result = response.data;
            notification.messageType = result.IsSuccess ? "success" : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (!result.IsSuccess) {
                notification.messageResultDetails[0].errorMessage =
                    result.ErrorList[0];
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.modify,
                        fnProductForecastConfiguration
                    )
                });
            }
            else {
                this.getProductForecastConfiguration();
            }

            this.props.onNotice(notification);
        }).catch(error => {
            this.setState({
                saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.modify,
                    fnProductForecastConfiguration
                )
            });
            notification.messageResultDetails[0].errorMessage = error;
            console.log("Error updating product forecast configuration: ", error);
            this.props.onNotice(notification);
        })
    }

    // handle check/un-check for multi-select dropdown
    handleMultiSelectCheckAll = (checked, key) => {
        try {
            let updatedProductForecastConfig = {}
            if (checked) {
                if (Object.keys(this.state.controlParameters).includes(key) &&
                    Array.isArray(this.state.controlParameters[key])) {
                    let selectedValues = this.state.controlParameters[key].join();

                    // update multi-select dropdown control state values
                    updatedProductForecastConfig = {
                        ...this.state.modProductForecastConfig,
                        ProductForecastParams: this.state.modProductForecastConfig.ProductForecastParams.map(param => {
                            if (param.Name === key) {
                                return {
                                    ...param,
                                    Value: selectedValues
                                }
                            }

                            return param;
                        })
                    }
                }
            }
            else {
                // update multi-select dropdown control state values
                updatedProductForecastConfig = {
                    ...this.state.modProductForecastConfig,
                    ProductForecastParams: this.state.modProductForecastConfig.ProductForecastParams.map(param => {
                        if (param.Name === key) {
                            return {
                                ...param,
                                Value: ""
                            }
                        }

                        return param;
                    })
                }
            }

            this.setState({
                modProductForecastConfig: updatedProductForecastConfig
            });
        }
        catch (error) {
            console.log("Error in handleMultiSelectCheckAll(): ", error);
        }
    }

    render() {
        return (
            <ErrorBoundary>
                {
                    this.state.isReadyToRender ?
                        <div>
                            <ErrorBoundary>
                                <TMDetailsHeader newEntityName="ProductForecastConfiguration_pgTitle" />
                            </ErrorBoundary>

                            <TranslationConsumer>
                                {
                                    (t) => (
                                        Array.isArray(this.state.modProductForecastConfig.ProductForecastParams) && this.state.modProductForecastConfig.ProductForecastParams ? (
                                            <>
                                                <ProductForecastConfigurationDetail
                                                    modProductForecastConfiguration={this.state.modProductForecastConfig}
                                                    controlParameters={this.state.controlParameters}
                                                    onChange={this.handleChange}
                                                    validationErrors={this.state.validationErrors}
                                                    onCheckAllChange={this.handleMultiSelectCheckAll}
                                                />
                                                <div className="row mt-3">
                                                    <div className="col col-12" style={{ textAlign: "right" }}>
                                                        <Button
                                                            content={t("Save")}
                                                            disabled={!this.state.saveEnabled}
                                                            onClick={() => this.handleSave()}
                                                        ></Button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : <h5>{t("ProductForecastConfiguration_Parameters_Unavailable")}</h5>)
                                }
                            </TranslationConsumer>
                        </div> : <LoadingPage message="Loading" />
                }
            </ErrorBoundary >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userDetails: state.getUserDetails.userDetails,
        tokenDetails: state.getUserDetails.TokenAuth,
    }
}

ProductForecastConfigurationDetailComposite.propTypes = {
    tokenDetails: PropTypes.object.isRequired,
    onNotice: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(ProductForecastConfigurationDetailComposite);