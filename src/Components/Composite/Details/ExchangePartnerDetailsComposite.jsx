import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyExchangePartner } from "../../../JS/DefaultEntities";
import { exchangePartnerValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnShareholder } from "../../../JS/FunctionGroups";
import { ExchangePartnerDetails } from "../../UIBase/Details/ExchangePartnerDetails";
import ShowAuthenticationLayout from "../Common/UserAuthentication";

class ExchangePartnerDetailsComposite extends Component {
    state = {
        exchangepartner: lodash.cloneDeep(emptyExchangePartner),
        modExchangePartner: {},
        validationErrors: Utilities.getInitialValidationErrors(exchangePartnerValidationDef),
        isReadyToRender: false,
        saveEnabled: false,
        lookUpData: null,
        isEnable: true,
        shareHolderList: [],
        sharholderSerchOptions: [],
        sellerSharholder: [],
        ShareholderOptions: [],
        showAuthenticationLayout: false,
        tempExchangePartner: {},
    }

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.getExchangePartner(this.props.selectedRow);
            this.getSellerSharholder();
        } catch (error) {
            console.log(
                "ExchangePartnerDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }
    componentWillReceiveProps(nextProps) {
        try {
            if (
                this.state.exchangepartner.exchangePartnerName !== "" &&
                nextProps.selectedRow.Name === undefined &&
                this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
            ) {
                this.getExchangePartner(nextProps.selectedRow);
                let validationErrors = { ...this.state.validationErrors };
                Object.keys(validationErrors).forEach((key) => {
                    validationErrors[key] = "";
                });
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "ExchangePartnerDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }
    getExchangePartner(exchangePartnerRow) {
        try {
            // this.state.modExchangePartner.SellerId = exchangePartnerRow.SellerId;
            if (exchangePartnerRow.Name === undefined) {
                this.setState({
                    exchangepartner: lodash.cloneDeep(emptyExchangePartner),
                    modExchangePartner: lodash.cloneDeep(emptyExchangePartner),
                    isReadyToRender: true,
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnShareholder
                    ),
                });
                return;
            }
            var keyCode = [
                {
                    key: KeyCodes.shareholderCode,
                    value: exchangePartnerRow.Name,
                }
            ];
            var obj = {
                ShareHolderCode: exchangePartnerRow.Name,
                keyDataCode: KeyCodes.exchangePartnerName,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetExchangePartner,
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
                            exchangepartner: lodash.cloneDeep(result.EntityResult),
                            modExchangePartner: lodash.cloneDeep(result.EntityResult),
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShareholder
                            ),
                        }
                    );
                } else {
                    this.setState({
                        exchangepartner: lodash.cloneDeep(emptyExchangePartner),
                        modExchangePartner: lodash.cloneDeep(emptyExchangePartner),
                        isReadyToRender: true,
                    });
                    console.log("Error in getexchangePartner:", result.ErrorList);
                }
            })
                .catch((error) => {
                    console.log("Error while getexchangePartner:", error, exchangePartnerRow);
                });
        } catch (error) {
            console.log("Error in get ExchangePartner",error)
        }
    }
    handleChange = (propertyName, data) => {
        try {
            const modExchangePartner = lodash.cloneDeep(this.state.modExchangePartner);
            modExchangePartner[propertyName] = data;
            this.setState({ modExchangePartner });

            const validationErrors = lodash.cloneDeep(this.state.validationErrors);
            if (exchangePartnerValidationDef[propertyName] !== undefined) {
                validationErrors[propertyName] = Utilities.validateField(
                    exchangePartnerValidationDef[propertyName],
                    data
                );
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "ExchangePartnerDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };
    // handleShareHolderChange = (ShareholderCode) => {
    //     try {
    //         this.getSellerSharholder(ShareholderCode, true);
    //         let validationErrors = lodash.cloneDeep(this.state.validationErrors);
    //         validationErrors["ShareholderCode"] = "";
    //         this.setState({ validationErrors });
    //     } catch (error) {
    //         console.log(
    //             "TruckReceiptDetailsComposite::Error occured on handleShareHolderChange",
    //             error
    //         );
    //     }
    // };
    handleReset = () => {
        try {
            const { validationErrors } = { ...this.state };
            const exchangepartner = lodash.cloneDeep(this.state.exchangepartner);
            Object.keys(validationErrors).forEach(function (key) {
                validationErrors[key] = "";
            });
            this.setState({
                modExchangePartner: { ...exchangepartner },
                validationErrors,
            });
        } catch (error) {
            console.log("exchangepartnerDetailsComposite:Error occured on handleReset", error);
        }
    };
    saveExchagePartner = () => {
        try {
            this.setState({ saveEnabled: false });
            let tempExchangePartner = lodash.cloneDeep(this.state.tempExchangePartner);
            
            
            this.state.exchangepartner.ExchangePartnerName === ""
                ? this.CreateExchagePartner(tempExchangePartner)
                : this.UpdateExchagePartner(tempExchangePartner);
        } catch (error) {
            console.log("ExchangePartnerDetailsComposite : Error in ExchangePartner")
        }
    }
    handleSave = () => {
        try {
            let returnValue = Object.values(this.state.validationErrors).every(
                function (value) {
                    return value === "";
                }
            );
            if (returnValue) {
                // this.setState({ saveEnabled: false });
                let modExchangePartner = this.fillDetails();
                if (this.validateSave(modExchangePartner)) {
                    let tempExchangePartner = lodash.cloneDeep(modExchangePartner);
                    let showAuthenticationLayout =
                        this.props.userDetails.EntityResult.IsWebPortalUser !== true
                            ? true
                            : false;
                    this.setState({ showAuthenticationLayout, tempExchangePartner }, () => {
                        if (showAuthenticationLayout === false) {
                            this.saveExchagePartner();
                        }
                    });
                } else this.setState({ saveEnabled: true });
            }
        }
        catch (error) {
            console.log("ExchangePartnerDetailsComposite:Error occured on handleSave", error);
        }
    };
    fillDetails() {
        try {
            let modExchangePartner = lodash.cloneDeep(this.state.modExchangePartner);
            console.log(this.state.ShareholderOptions)
            if (this.state.ShareholderOptions.length >= 0 && modExchangePartner.SellerId!==""&&modExchangePartner.FinalShipperID!=="") {
                let selleridValue = this.state.ShareholderOptions.findIndex(item => { return item.value === modExchangePartner.SellerId })
                modExchangePartner.SellerId = this.state.ShareholderOptions[selleridValue].text;
                let finalShipperidValue = this.state.ShareholderOptions.findIndex(item => { return item.value === modExchangePartner.FinalShipperID })
                modExchangePartner.FinalShipperID = this.state.ShareholderOptions[finalShipperidValue].text;
                this.setState({ modExchangePartner });
            }
            this.setState({ modExchangePartner });
                return modExchangePartner;

        } catch (error) {
            console.log("ExchangePartnerDetailsComposite:Error occured on fillAttributeDetails", error);
        }
    }
    validateSave(modExchangePartner) {
        try {
            var validationErrors = lodash.cloneDeep(this.state.validationErrors);
            Object.keys(exchangePartnerValidationDef).forEach(function (key) {
                validationErrors[key] = Utilities.validateField(
                    exchangePartnerValidationDef[key],
                    modExchangePartner[key]
                );
            });
            let notification = {
                messageType: "critical",
                message: ["ExchangePartnerList_SavedSuccess"],
                messageResultDetails: [],
            };
            if (modExchangePartner.SellerId === modExchangePartner.FinalShipperID && modExchangePartner.SellerId !== "" && modExchangePartner.FinalShipperID !== "") {
                notification.messageResultDetails.push({
                    keyFields: ["ExchangePartnerName"],
                    keyValues: [modExchangePartner.ExchangePartnerName],
                    isSuccess: false,
                    errorMessage: "Exchange_Partner_Seller_FinalShipper_Different",
                });
            }
            this.setState({ validationErrors });
            var returnValue = true;
            if (returnValue)
                returnValue = Object.values(validationErrors).every(function (value) {
                    return value === "";
                });
            if (notification.messageResultDetails.length > 0) {
                this.props.onSaved(this.state.modExchangePartner, "update", notification);
                return false;
            }

            return returnValue;
        } catch(error){
            console.log("error in validate save",error)
        }
    }
    CreateExchagePartner(modExchangePartner) {
        try {
            let keyCode = [
                {
                    key: KeyCodes.shareholderCode,
                    value: modExchangePartner.ExchangePartnerName,
                },
            ];
            let obj = {
                keyDataCode: KeyCodes.exchangePartnerName,
                ShareHolderCode: modExchangePartner.ExchangePartnerName,
                KeyCodes: keyCode,
                Entity: modExchangePartner,
            };

            let notification = {
                messageType: "critical",
                message: "ExchangePartnerList_SavedSuccess",
                messageResultDetails: [
                    {
                        keyFields: ["Exchange_Partner_Name"],
                        keyValues: [modExchangePartner.ExchangePartnerName],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };

            axios(
                RestAPIs.CreateExchangePartner,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                let result = response.data;
                notification.messageType = result.IsSuccess ? "success" : "critical";
                console.log(result)
                notification.messageResultDetails[0].isSuccess = result.IsSuccess;
                if (result.IsSuccess === true) {
                    this.setState(
                        {
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShareholder
                            ),
                            showAuthenticationLayout: false,

                        },
                        () => this.getExchangePartner({ Name: modExchangePartner.ExchangePartnerName })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShareholder
                        ),
                        showAuthenticationLayout: false,

                    });
                    console.log("Error in ExchangePartner:", result.ErrorList);
                }
                this.props.onSaved(this.state.modExchangePartner, "add", notification);
            })
                .catch((error) => {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShareholder
                        ),
                        showAuthenticationLayout: false,

                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(this.state.modExchangePartner, "add", notification);
                });
        } catch (error) {
            console.log("error in create ExchangePartner",error)
        }
    }
    UpdateExchagePartner(modExchangePartner) {
        try {
            let keyCode = [
                {
                    key: KeyCodes.shareholderCode,
                    value: modExchangePartner.ExchangePartnerName,
                },
            ];
            let obj = {
                keyDataCode: KeyCodes.shareholderCode,
                KeyCodes: keyCode,
                Entity: modExchangePartner,
            };

            let notification = {
                messageType: "critical",
                message: "ExchangePartnerList_SavedSuccess",
                messageResultDetails: [
                    {
                        keyFields: ["Exchange_Partner_Name"],
                        keyValues: [modExchangePartner.ExchangePartnerName],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };

            axios(
                RestAPIs.UpdateExchangePartner,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                let result = response.data;
                notification.messageType = result.IsSuccess ? "success" : "critical";
                notification.messageResultDetails[0].isSuccess = result.IsSuccess;
                if (result.IsSuccess === true) {
                    this.setState(
                        {
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShareholder
                            ),
                            showAuthenticationLayout: false,

                        },
                        () => this.getExchangePartner({ Name: modExchangePartner.ExchangePartnerName })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnShareholder
                        ),
                        showAuthenticationLayout: false,

                    });
                    console.log("Error in update ExchangePartner:", result.ErrorList);
                }
                this.props.onSaved(this.state.modExchangePartner, "update", notification);
            })
                .catch((error) => {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnShareholder
                        ),
                        showAuthenticationLayout: false,

                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(this.state.modExchangePartner, "update", notification);
                });
        } catch (error) {
            console.log("Error in update exchange Partner",error)
        }
    }
    // getShareholders() {
    //     try {
    //         return Utilities.transferListtoOptions(
    //             this.props.userDetails.EntityResult.ShareholderList
    //         );
    //     } catch (error) {
    //         console.log("ExchangeDetailsComposite:Error occured on getShareholders", error);
    //     }
    // }
    handleShareholderSearchChange = (vehicleCode) => {
        try {
            let shareholderSearchOptions = this.state.shareholderOptions.filter((item) =>
                item.value.toLowerCase().includes(vehicleCode.toLowerCase())
            );
            if (shareholderSearchOptions.length > Constants.filteredOptionsCount) {
                shareholderSearchOptions = shareholderSearchOptions.slice(
                    0,
                    Constants.filteredOptionsCount
                );
            }

            this.setState({
                shareholderSearchOptions,
            });
        } catch (error) {
            console.log(
                ":Error occured on handleVehicleSearchChange",
                error
            );
        }
    };
    getSellerSharholder() {
        try {
            axios(
                RestAPIs.GetShareholdersList,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        let ShareholderOptions = [];
                        
                        if (
                            result.EntityResult !== null
                        ) {
                            Object.keys(result.EntityResult).forEach((element) => {
                                ShareholderOptions.push({ text: result.EntityResult[element], value: element });
                            });
                        
                            this.setState({ ShareholderOptions, isReadyToRender: true });
                        }
                    } else {
                        this.setState({ ShareholderOptions: [], isReadyToRender: true });
                        console.log("Error in getShareholderList:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({ ShareholderOptions: [], isReadyToRender: true });
                    console.log("Error while getting ShareholderList:", error);
                });
        } catch(error) {
            console.log("error while getting Shareholder",error)
        }
    
    }
    handleAuthenticationClose = () => {
        this.setState({
            showAuthenticationLayout: false,
        });
    };
    render() {
        // const listOptions = {
        //     shareholders: this.getShareholders(),
        //     ShareholderOptions: this.getSellerSharholder()
        // }
        return this.state.isReadyToRender ? (
            <div>
                <ErrorBoundary>
                    <TMDetailsHeader
                        entityCode={this.state.exchangepartner.ExchangePartnerName}
                        newEntityName="Exchange_Partner_NewDetail"
                    ></TMDetailsHeader>
                </ErrorBoundary>
                <ErrorBoundary>
                    <ExchangePartnerDetails
                        exchangepartner={this.state.exchangepartner}
                        modExchangePartner={this.state.modExchangePartner}
                        validationErrors={this.state.validationErrors}
                        onFieldChange={this.handleChange}
                        isEnterpriseNode={this.props.userDetails.EntityResult.IsEnterpriseNode}
                        // ShareholderOptions={this.state.ShareholderOptions}
                        onShareholderChange={this.handleShareHolderChange}
                        listOptions={{
                            ShareholderOptions: this.state.ShareholderOptions
                            }}
                    >
                    </ExchangePartnerDetails>
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
                            this.state.exchangepartner.ExchangePartnerName === ""
                                ? functionGroups.add
                                : functionGroups.modify
                        }
                        functionGroup={fnShareholder}
                        handleOperation={this.saveExchagePartner}
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

export default connect(mapStateToProps)(ExchangePartnerDetailsComposite);

ExchangePartnerDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    selectedShareholder: PropTypes.string.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};

