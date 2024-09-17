import React, { Component } from "react";
import { SlotHeaderUserActionsComposite } from "../Common/SlotBook/SlotHeaderUserActionsComposite";
import ErrorBoundary from "../../ErrorBoundary";
import NotifyEvent from "../../../JS/NotifyEvent";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import ProductDemandForecastingDetailsComposite from "../Details/ProductDemandForecastingDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";

class ProductDemandForecastComposite extends Component {
    state = {
        terminals: [],
        selectedTerminal: { Key: { Code: "" }, Value: [] },
        baseProducts: [],
        selectedBaseProduct: "",
        selectedDate: "",
        operationsVisibilty: {
            terminal: true,
        },
        productForecastDetails: [],
        validationErrors: {
            BaseProduct: "",
            EndDate: "",
            Tanks: ""
        },
        isReadyToRender: false,
        tanksInfo: [],
        selectedTanks: [],
        config: {
            uoms: { Mass: '', Volume: '' },
            maxDuration: 30,
            tolerance: { Mass: 10000, Volume: 10000 }
        },
        isLoading: false,
        isChartDataReady: false,
        isVolume: true,
        isSlotEnabled: false,
        errorMessage: null
    };

    componentDidMount() {
        try {
            this.getInitialConfigurations();
        } catch (error) {
            console.log(
                "ProductDemandForecastComposite:Error occured on componentDidMount",
                error
            );
        }
    }

    getInitialConfigurations() {
        this.getTerminals();
    }

    showNotification = (notification) => {
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

    // fetch available terminals
    getTerminals() {
        let notification = {
            messageType: "critical",
            message: "TerminalList_NotAvailable",
            messageResultDetails: [],
        };
        try {
            axios(
                RestAPIs.GetTerminalDetailsForFeature + "3",
                // RestAPIs.GetTerminalDetailsForUser,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (
                            Array.isArray(result.EntityResult) &&
                            result.EntityResult.length > 0
                        ) {
                            this.setState(
                                {
                                    terminals: result.EntityResult,
                                    selectedTerminal: result.EntityResult[0],
                                },
                                () => {
                                    this.FetchProductDemandForecastConfiguration();
                                }
                            );
                        } else {
                            console.log("Error while getting Terminal List:", result);
                            this.showNotification(notification);
                            this.setState({ isReadyToRender: true, errorMessage: notification.message });
                        }
                    } else {
                        notification.messageResultDetails = [{
                            keyFields: "",
                            keyValues: [],
                            isSuccess: false,
                            errorMessage: result.ErrorList[0]
                        }];
                        console.log("Error while getting Terminal List:", result);
                        this.showNotification(notification);
                        this.setState({ isReadyToRender: true, errorMessage: notification.message });
                    }
                })
                .catch((error) => {
                    notification.messageResultDetails = [{
                        keyFields: "",
                        keyValues: [this.state.selectedBaseProduct],
                        isSuccess: false,
                        errorMessage: error
                    }];
                    this.showNotification(notification);
                    this.setState({ isReadyToRender: true, errorMessage: notification.message });
                    console.log("Error while getting Terminal List:", error);
                });
        }
        catch (error) {
            notification.messageResultDetails = [{
                keyFields: "",
                keyValues: [this.state.selectedBaseProduct],
                isSuccess: false,
                errorMessage: error
            }];
            console.log("Error in getTerminals(): ", error);
            this.showNotification(notification);
            this.setState({ isReadyToRender: true, errorMessage: notification.message });
        }
    }

    // fetch configuration for product demand forecasting
    FetchProductDemandForecastConfiguration = () => {
        let notification = {
            messageType: "critical",
            message: "ProductForecastConfiguration_NotAvailable",
            messageResultDetails: [],
        };

        try {
            axios(
                RestAPIs.GetProductForecastConfiguration + "?TerminalCode=" + this.state.selectedTerminal.Key.Code + "&GetIfEmpty=true",
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            ).then(response => {
                if (response.data.IsSuccess) {
                    if (Array.isArray(response.data.EntityResult.ProductForecastParams) &&
                        response.data.EntityResult.ProductForecastParams.length > 0) {
                        // if configuration is not available, show notification
                        if (response.data.EntityResult.ProductForecastParams.filter(param => param.Value === "").length > 0) {
                            this.showNotification(notification);
                            this.setState({ isReadyToRender: true, errorMessage: notification.message });
                        }
                        else {
                            // populate state with configuration values
                            this.setState({
                                config: {
                                    ...this.state.config,
                                    uoms: {
                                        Mass: response.data.EntityResult.ProductForecastParams.filter(param => param.Name === "MassUOM")[0].Value,
                                        Volume: response.data.EntityResult.ProductForecastParams.filter(param => param.Name === "VolumeUOM")[0].Value
                                    },
                                    maxDuration: response.data.EntityResult.ProductForecastParams.filter(param => param.Name === "MaxDuration")[0].Value,
                                    tolerance: {
                                        Mass: response.data.EntityResult.ProductForecastParams.filter(param => param.Name === "ToleranceLimitMass")[0].Value,
                                        Volume: response.data.EntityResult.ProductForecastParams.filter(param => param.Name === "ToleranceLimitVolume")[0].Value
                                    }
                                }
                            }, () => {
                                // fetch base products for the terminal
                                this.GetBaseProducts(this.state.selectedTerminal.Key.Code);
                            });
                        }
                    }
                    else {
                        this.showNotification(notification);
                        this.setState({ isReadyToRender: true, errorMessage: notification.message });
                    }
                }
                else {
                    notification.messageResultDetails = [{
                        keyFields: "",
                        keyValues: [this.state.selectedTerminal.Key.Code],
                        isSuccess: false,
                        errorMessage: response.data.ErrorList[0]
                    }];
                    this.showNotification(notification);
                    this.setState({ isReadyToRender: true, errorMessage: "" });
                }
            }).catch(error => {
                notification.messageResultDetails = [{
                    keyFields: "",
                    keyValues: [this.state.selectedBaseProduct],
                    isSuccess: false,
                    errorMessage: error
                }];
                console.log("Error in fetch ProductForecastingConfiguration: ", error);
                this.showNotification(notification);
                this.setState({ isReadyToRender: true, errorMessage: "" });
            });
        }
        catch (error) {
            console.log("Error in FetchProductDemandForecastConfiguration: ", error);
            this.showNotification(notification);
            this.setState({ isReadyToRender: true, errorMessage: "" });
        }
    }

    // get base products for the terminal (excluding additives)
    GetBaseProducts(terminal) {
        let notification = {
            messageType: "critical",
            message: "BaseProductList_NotAvailable",
            messageResultDetails: [],
        };
        if (terminal !== null && terminal !== undefined && terminal !== "") {
            axios(
                RestAPIs.GetBaseProductsForTerminal +
                "?TerminalCode=" +
                terminal +
                "&isAdditiveIncluded=" +
                false,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess) {
                        if (Array.isArray(result.EntityResult)) {
                            // update state
                            this.setState({
                                baseProducts: result.EntityResult.map(bp => ({ text: bp, value: bp })),
                                isReadyToRender: true
                            });
                        }
                        else {
                            this.showNotification(notification);
                        }
                    } else {
                        notification.messageResultDetails = [{
                            keyFields: "",
                            keyValues: [this.state.selectedBaseProduct],
                            isSuccess: false,
                            errorMessage: result.ErrorList[0]
                        }];
                        this.showNotification(notification);
                        console.log("Error in getBaseProductList:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    notification.messageResultDetails = [{
                        keyFields: "",
                        keyValues: [this.state.selectedTerminal.Key.Code],
                        isSuccess: false,
                        errorMessage: error
                    }];
                    this.showNotification(notification);
                    console.log("Error while getting Base Product List:", error);
                });
        }
    }

    // get list of tanks for selected base product
    getTankDetails() {
        let notification = {
            messageType: "critical",
            message: "TankList_NotAvailable",
            messageResultDetails: [],
        };
        try {
            // populate key data with terminal and base product codes
            const keyData = {
                keyDataCode: 0,
                ShareHolderCode: "",
                KeyCodes: [
                    { Key: KeyCodes.terminalCode, Value: this.state.selectedTerminal.Key.Code },
                    { Key: KeyCodes.baseProductCode, Value: this.state.selectedBaseProduct },
                ],
            };

            axios(
                RestAPIs.GetTanksForProductForecast,
                Utilities.getAuthenticationObjectforPost(keyData, this.props.tokenDetails.tokenInfo)
            ).then(response => {
                if (response.data.IsSuccess) {
                    if (Array.isArray(response.data.EntityResult.Table) && response.data.EntityResult.Table.length > 0) {
                        // update state
                        this.setState({
                            tanksInfo: response.data.EntityResult.Table,
                            selectedTanks: response.data.EntityResult.Table,
                            isVolume: response.data.EntityResult.Table[0].IsVolume
                        });
                    }
                    else {
                        this.showNotification(notification);
                    }
                }
                else {
                    notification.messageResultDetails = [{
                        keyFields: "",
                        keyValues: [this.state.selectedBaseProduct],
                        isSuccess: false,
                        errorMessage: response.data.ErrorList[0]
                    }];
                    this.showNotification(notification);
                }
            }).catch(error => {
                notification.messageResultDetails = [{
                    keyFields: "",
                    keyValues: [this.state.selectedBaseProduct],
                    isSuccess: false,
                    errorMessage: error
                }];
                console.log(error);
                this.showNotification(notification);
            });
        }
        catch (error) {
            notification.messageResultDetails = [{
                keyFields: "",
                keyValues: [this.state.selectedBaseProduct],
                isSuccess: false,
                errorMessage: error
            }];
            console.log("Error in getTankDetails(): ", error);
            this.showNotification(notification);
        }
    }

    // get forecast details
    loadForecastDetails = () => {
        if (this.validate()) {
            let notification = {
                messageType: "critical",
                message: "ForecastDetails_NotAvailable",
                messageResultDetails: [],
            };
            try {
                // populate key data with terminal, base product, duration and selected tanks
                const keyData = {
                    keyDataCode: 0,
                    ShareHolderCode: "",
                    KeyCodes: [
                        { Key: KeyCodes.terminalCode, Value: this.state.selectedTerminal.Key.Code },
                        { Key: KeyCodes.baseProductCode, Value: this.state.selectedBaseProduct },
                        { Key: KeyCodes.forecastDate, Value: this.state.selectedDate.toISOString() },
                        { Key: KeyCodes.forecastTanks, Value: JSON.stringify(this.state.selectedTanks.map(tank => tank.Code)) }
                    ],
                };
                this.setState({ isLoading: true }, () => {
                    axios(
                        RestAPIs.GetProductForecastDetails,
                        Utilities.getAuthenticationObjectforPost(keyData, this.props.tokenDetails.tokenInfo)
                    ).then(response => {
                        if (response.data.IsSuccess) {
                            this.setState({
                                productForecastDetails: response.data.EntityResult.Table,
                                isChartDataReady: true,
                                isLoading: false,
                                isSlotEnabled: (Array.isArray(response.data.EntityResult.Table1) ?
                                    response.data.EntityResult.Table1[0].SlotEnabled :
                                    this.state.isSlotEnabled)
                            });
                        }
                        else {
                            notification.messageResultDetails = [{
                                keyFields: "",
                                keyValues: [],
                                isSuccess: false,
                                errorMessage: response.data.ErrorList[0]
                            }];

                            this.setState({ isLoading: false });

                            this.showNotification(notification);
                        }
                    }).catch(error => {
                        notification.messageResultDetails = [{
                            keyFields: "",
                            keyValues: [],
                            isSuccess: false,
                            errorMessage: error
                        }];
                        this.setState({ isLoading: false });
                        console.log(error);
                        this.showNotification(notification);
                    })
                });
            }
            catch (error) {
                this.setState({ isLoading: false });
                notification.messageResultDetails = [{
                    keyFields: "",
                    keyValues: [],
                    isSuccess: false,
                    errorMessage: error
                }];
                console.log("Error in loadForecastDetails(): ", error);
                this.showNotification(notification);
            }
        }
    }

    // handle control changes
    handleChange = (property, value) => {
        if (property === "BaseProduct") {
            // update state
            this.setState({
                selectedBaseProduct: value,
                validationErrors: {
                    ...this.state.validationErrors,
                    BaseProduct: ""
                },
                isChartDataReady: false,
                productForecastDetails: [],
                selectedTanks: [],
                tanksInfo: [],
            }, () => {
                // fetch tank details on selection of base product
                this.getTankDetails();
            });
        }
        else if (property === "EndDate") {
            // check if value is a valid 'Date'
            let errorMsg = this.validateDate(value);
            let endDate = new Date(value);
            if (endDate.toString() === "Invalid Date") {
                endDate = null;
            }

            this.setState({
                selectedDate: endDate,
                validationErrors: {
                    ...this.state.validationErrors,
                    EndDate: errorMsg
                },
                isChartDataReady: false,
                productForecastDetails: []
            });
        }
    }

    // update selected tanks
    onTanksSelection = (tanks) => {
        this.setState({
            selectedTanks: tanks,
            validationErrors: {
                ...this.state.validationErrors,
                Tanks: ""
            },
            isChartDataReady: false,
            productForecastDetails: []
        });
    }

    // validate date
    validateDate = (date) => {
        let selectedDate = new Date(date);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate.toString() === "Invalid Date") {
            return "ProductReconciliationList_ToDateFormatInvalid";
        }
        else if (selectedDate < today) {
            return "ProductReconciliationList_InvalidDateRange";
        }
        else if (Utilities.DateDiffInDays(today, selectedDate) > this.state.config.maxDuration) {
            return "ProductForecast_MaxDurationExceed";
        }

        return "";
    }

    // validate controls before fetching forecast details
    validate = () => {
        try {
            let baseProductError = "", selectedTanksError = "";
            if (this.state.selectedBaseProduct === null ||
                this.state.selectedBaseProduct === undefined ||
                this.state.selectedBaseProduct === "") {
                baseProductError = "ProductDemandForecast_BaseProductMandatory";
            }

            let dateValidationError = this.validateDate(this.state.selectedDate);

            if (!Array.isArray(this.state.selectedTanks) || this.state.selectedTanks.length === 0) {
                selectedTanksError = "ProductDemandForecast_TanksNotSelected";
            }

            this.setState({
                validationErrors: {
                    ...this.state.validationErrors,
                    BaseProduct: baseProductError,
                    EndDate: dateValidationError,
                    Tanks: selectedTanksError
                }
            });

            if (baseProductError === "" &&
                dateValidationError === "" &&
                selectedTanksError === "") {
                return true;
            }

            return false;
        }
        catch (error) {
            console.log("Error in validate(): ", error);
            return false;
        }
    }

    handleTerminalChange = (terminalCode) => {
        try {
            let filteredTerminals = this.state.terminals.filter(terminal => terminal.Key.Code === terminalCode);
            if (filteredTerminals.length > 0) {
                this.setState({
                    selectedTerminal: filteredTerminals[0],
                    selectedBaseProduct: "",
                    selectedTanks: [],
                    selectedDate: "",
                    baseProducts: [],
                    isChartDataReady: false,
                    validationErrors: {},
                    config: {
                        uoms: { Mass: '', Volume: '' },
                        maxDuration: 30,
                        tolerance: { Mass: 10000, Volume: 10000 }
                    },
                    tanksInfo: [],
                    productForecastDetails: [],
                    isLoading: false,
                    isReadyToRender: false
                }, () => {
                    this.FetchProductDemandForecastConfiguration();
                });
            }
            else {
                this.showNotification({
                    messageType: "critical",
                    message: "Invalid_Terminal",
                    messageResultDetails: [],
                });
            }
        }
        catch (error) {
            console.log("Error in handleTerminalChange(): ", error);
        }
    }

    render() {
        return (
            <div>
                <TranslationConsumer>
                    {(t) => (
                        <>
                            <ErrorBoundary>
                                <SlotHeaderUserActionsComposite
                                    operationsVisibilty={this.state.operationsVisibilty}
                                    breadcrumbItem={this.props.activeItem}
                                    terminals={this.state.terminals.map(function (a) {
                                        return a.Key.Code;
                                    })}
                                    selectedTerminal={this.state.selectedTerminal.Key.Code}
                                    onTerminalChange={this.handleTerminalChange}
                                    handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                                ></SlotHeaderUserActionsComposite>
                            </ErrorBoundary>
                            {
                                this.state.isReadyToRender && this.state.config.uoms.Mass !== "" && this.state.config.uoms.Volume !== "" ?
                                    <ErrorBoundary>
                                        <ProductDemandForecastingDetailsComposite
                                            baseProductsList={this.state.baseProducts}
                                            baseProduct={this.state.selectedBaseProduct}
                                            terminal={this.state.selectedTerminal}
                                            endDate={this.state.selectedDate}
                                            tanks={this.state.tanksInfo}
                                            onChange={this.handleChange}
                                            selectedTanks={this.state.selectedTanks}
                                            onTankSelection={this.onTanksSelection}
                                            validationErrors={this.state.validationErrors}
                                            onGoClick={this.loadForecastDetails}
                                            isLoading={this.state.isLoading}
                                            configuration={this.state.config}
                                            forecastDetails={this.state.productForecastDetails}
                                            isChartDataReady={this.state.isChartDataReady}
                                            isVolume={this.state.isVolume}
                                            isSlotEnabled={this.state.isSlotEnabled}
                                        />
                                    </ErrorBoundary> : (
                                        this.state.isReadyToRender && this.state.config.uoms.Mass === "" && this.state.config.uoms.Volume === "" ? <div>{t(this.state.errorMessage)}</div> :
                                            <LoadingPage message="Loading"></LoadingPage>
                                    )
                            }
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
                        </>
                    )}
                </TranslationConsumer>
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

export default connect(mapStateToProps)(ProductDemandForecastComposite);
