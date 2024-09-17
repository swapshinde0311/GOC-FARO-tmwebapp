import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { emptyCustomerStockTransfer } from "../../../JS/DefaultEntities";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { CustomerStockTransferDetails } from "../../UIBase/Details/CustomerStockTransferDetails";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnCustomerAgreement } from "../../../JS/FunctionGroups";
import { CustomerStockTransferValidationDef } from "../../../JS/ValidationDef";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class CustomerStockTransferDetailsComposite extends Component { 

    state = {
        customerstockTransfer: lodash.cloneDeep(emptyCustomerStockTransfer),
        validationErrors: Utilities.getInitialValidationErrors(CustomerStockTransferValidationDef),
        modCustomerstockTransfer: {},
        CustomerAgreementItems:[],
        isReadyToRender: false,
        saveEnabled: false,
        LendercustomerOptions: [],
        RequestercustomerOptions:[],
        shareholders: this.getShareholders(),
        baseProductOptions: [],
        quantityUOMOptions:[],
        selectedAssociations: [],
        showAuthenticationLayout: false,
        tempCustomerstockTransfer: {}

    }

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.getCustomerStockTransfer(this.props.selectedRow);
            this.getBaseProducts();
            this.GetUOMList();
        } catch (error) {
            console.log(
                "customertransferDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            if (
                this.state.customerstockTransfer.Code !== "" &&
                nextProps.selectedRow.CustomerAgreement_TransferReferenceCode === undefined &&
                this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
            ) {
                this.getCustomerStockTransfer(nextProps.selectedRow);
            }
        } catch (error) {
            console.log(
                "customertransferDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }
    getShareholders() {
        return Utilities.transferListtoOptions(
            this.props.userDetails.EntityResult.ShareholderList
        );
    }
    getCustomerList(shareholders, shareholderType) {
        try {
            if (shareholders !== undefined && shareholders !== "") {
                axios(
                    RestAPIs.GetCustomerDestinations +
                    "?ShareholderCode=" +
                    shareholders +
                    "&TransportationType=" +
                    "",
                    Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
                ).then((response) => {
                
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (Array.isArray(result.EntityResult)) {
                        
                            let shareholderCustomers = result.EntityResult.filter(
                                (shareholderCust) =>
                                    shareholderCust.ShareholderCode === shareholders
                            );
                            if (shareholderType === "RequestorShareholderCode") {
                                if (shareholderCustomers.length > 0) {
                                    let customerDestinationOptions =
                                        shareholderCustomers[0].CustomerDestinationsList;
                                    let RequestercustomerOptions = [];
                                    if (customerDestinationOptions !== null) {
                                        RequestercustomerOptions = Object.keys(customerDestinationOptions);
                                        RequestercustomerOptions =
                                            Utilities.transferListtoOptions(RequestercustomerOptions);
                                    }
                                    this.setState({ RequestercustomerOptions });
                                }
                            } else if (shareholderType === "LenderShareholderCode") {
                                if (shareholderCustomers.length > 0) {
                                    let customerDestinationOptions =
                                        shareholderCustomers[0].CustomerDestinationsList;
                                    let LendercustomerOptions = [];
                                    if (customerDestinationOptions !== null) {
                                        LendercustomerOptions = Object.keys(customerDestinationOptions);
                                        LendercustomerOptions =
                                            Utilities.transferListtoOptions(LendercustomerOptions);
                                    }
                                    this.setState({ LendercustomerOptions });
                                }
                            }
                            else {
                                console.log(
                                    "CustomerStockTransferDetailsComposite:no customers identified for shareholder"
                                );
                            }
                        } else {
                            console.log(
                                "CustomerStockTransferDetailsComposite:customerdestinations not identified for shareholder"
                            );
                        }
                    }
                });
            }
        } catch (err) {
            console.log("error in requestorcustomerlist",err)
        }
    }
    getBaseProducts() {
        try {
            axios(
                RestAPIs.GetAllBaseProduct + "?TerminalCode=",
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (
                            result.EntityResult !== null &&
                            Array.isArray(result.EntityResult)
                        ) {
                            let baseProductOptions = Utilities.transferListtoOptions(
                                result.EntityResult
                            );
                            this.setState({ baseProductOptions });
                        }
                    } else {
                        console.log("Error in getBaseProducts:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("Error while getting BaseProducts:", error);
                });
        } catch (err) {
            console.log("Error while getting BaseProducts:", err); 
        }
    }
    handleChange = (propertyName, data) => {
        
        try {
            const modCustomerstockTransfer = lodash.cloneDeep(this.state.modCustomerstockTransfer);
            modCustomerstockTransfer[propertyName] = data;
            this.setState({ modCustomerstockTransfer });
            if (propertyName === "LenderShareholderCode" ) {
                this.getCustomerList(data,"LenderShareholderCode");
            }  if (propertyName === "RequestorShareholderCode")
            {
                this.getCustomerList(data,"RequestorShareholderCode");
            }

            const validationErrors = lodash.cloneDeep(this.state.validationErrors);
            if (CustomerStockTransferValidationDef[propertyName] !== undefined) {
                validationErrors[propertyName] = Utilities.validateField(
                    CustomerStockTransferValidationDef[propertyName],
                    data
                );
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "CustomerstocktransferDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };
    handleCellDataEdit = (newVal, cellData) => {
        try {
            let CustomerAgreementItems = lodash.cloneDeep(this.state.CustomerAgreementItems);
            CustomerAgreementItems[cellData.rowIndex][cellData.field] = newVal;
            this.setState({ CustomerAgreementItems });
        } catch (err) {
            console.log("errror in handlecelledit",err)
        }
    };
    GetUOMList() {
        try {
            axios(
                RestAPIs.GetUOMList,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;

                    if (result.IsSuccess === true) {
                        if (result.EntityResult !== null) {
                            let quantityUOMOptions = [];
                            if (Array.isArray(result.EntityResult.VOLUME)) {
                                quantityUOMOptions = Utilities.transferListtoOptions(
                                    result.EntityResult.VOLUME
                                );
                            }
                            if (Array.isArray(result.EntityResult.MASS)) {
                                let massUOMOptions = Utilities.transferListtoOptions(
                                    result.EntityResult.MASS
                                );
                                massUOMOptions.forEach((massUOM) =>
                                    quantityUOMOptions.push(massUOM)
                                );
                            }

                            this.setState({ quantityUOMOptions });
                        }
                    } else {
                        console.log("Error in GetUOMList:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("Error while getting GetUOMList:", error);
                });
        } catch (error) {
            console.log("Error while getting GetUOMList:", error);
        }
    }
    getCustomerStockTransfer(CustomerstockTransferRow) {
        try {
            if (CustomerstockTransferRow.CustomerAgreement_TransferReferenceCode === undefined) {
                this.setState({
                    customerstockTransfer: lodash.cloneDeep(emptyCustomerStockTransfer),
                    modCustomerstockTransfer: lodash.cloneDeep(emptyCustomerStockTransfer),
                    isReadyToRender: true,
                    selectedAttributeList: [],
                    CustomerAgreementItems: [],
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnCustomerAgreement
                    ),
                }
                );
                return;
            }
            var keyCode = [
                {
                    key: KeyCodes.TransferReferenceCode,
                    value: CustomerstockTransferRow.CustomerAgreement_TransferReferenceCode,
                }
            ];
            var obj = {
                TransferReferenceCode: CustomerstockTransferRow.CustomerAgreement_TransferReferenceCode,
                keyDataCode: KeyCodes.TransferReferenceCode,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetCustomerStockTransfer,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
            
                var result = response.data;
                if (result.IsSuccess === true) {
                    let modCustomerstockTransfer = lodash.cloneDeep(result.EntityResult)
                    this.setState(
                        {
                            isReadyToRender: true,
                            customerstockTransfer: lodash.cloneDeep(result.EntityResult),
                            modCustomerstockTransfer,
                            CustomerAgreementItems: modCustomerstockTransfer.CustomerAgreementItems,
                            saveEnabled: false
                        }, () => {
                            if (modCustomerstockTransfer.RequestorShareholderCode !== undefined) {
                                this.getCustomerList(modCustomerstockTransfer.RequestorShareholderCode, "RequestorShareholderCode")
                            }
                            if (modCustomerstockTransfer.LenderShareholderCode !== undefined) {
                                this.getCustomerList(modCustomerstockTransfer.LenderShareholderCode, "LenderShareholderCode")
                            }
                        }
                    );
                } else {
                    this.setState({
                        customerstockTransfer: lodash.cloneDeep(emptyCustomerStockTransfer),
                        modCustomerstockTransfer: lodash.cloneDeep(emptyCustomerStockTransfer),
                        isReadyToRender: true,
                    });
                    console.log("Error in getcustomerstock:", result.ErrorList);
                }
            })
                .catch((error) => {
                    console.log("Error while getcustomerstock:", error, CustomerstockTransferRow);
                });
        } catch (err) {
            console.log("Error while getcustomerstock:",err)
        }
    }
    fillDetails(modAssociations) {
        
        let AssociationDetails = [];
        try {
            if (Array.isArray(modAssociations)) {
                modAssociations.forEach((association) => {
                    if (
                        !(
                            association.BaseProductCode === null ||
                            association.BaseProductCode === ""
                        ) ||
                        !(association.Quantity === null || association.Quantity === "")
                    ) {
                        AssociationDetails.push({
                            BaseProductCode: association.BaseProductCode,
                            Quantity: association.Quantity,
                            QuantityUOM: association.QuantityUOM
                        });
                    }
                });
            }
        } catch (error) {
            console.log("Error while making filldetails:", error);
        }
        return AssociationDetails;
    }
    handleAssociationSelectionChange = (associations) => {
        this.setState({ selectedAssociations: associations });
    };
    handleAddAssociation = () => {
        
                try {
                    let CustomerAgreementItems = lodash.cloneDeep(
                        this.state.CustomerAgreementItems
                    );
                    let newComp = {
                        BaseProductCode:"",
                        Quantity: 0,
                        QuantityUOM: "",
                       
                    };
                   CustomerAgreementItems.push(newComp);

                    this.setState({
                        CustomerAgreementItems,
                        selectedAssociations: [],
                    });
                } catch (error) {
                    console.log(
                        "CustomerstockTransferDetailsComposite:Error occured on handleAddAssociation",
                        error
                    );
                }
    };

    handleDeleteAssociation = () => {
        try {
                try {
                    if (
                        this.state.selectedAssociations != null &&
                        this.state.selectedAssociations.length > 0
                    ) {
                        if (
                            this.state.CustomerAgreementItems.length > 0
                        ) {
                            let CustomerAgreementItems = lodash.cloneDeep(
                                this.state.CustomerAgreementItems
                            );

                            this.state.selectedAssociations.forEach((obj, index) => {
                                CustomerAgreementItems =
                                    CustomerAgreementItems.filter(
                                        (com, cindex) => {
                                            return com.BaseProductCode !== obj.BaseProductCode;
                                        }
                                    );
                            });

                            this.setState({ CustomerAgreementItems });
                        }
                    }

                    this.setState({ selectedAssociations: [] });
                } catch (error) {
                    console.log(
                        "customerstocltransferDetailsComposite:Error occured on handleDeleteAssociation",
                        error
                    );
                }
        } catch (error) {
            console.log("error in handle Delete Association", error)
        }
    };
    handleReset = () => {
        try {
            const customerstockTransfer = lodash.cloneDeep(this.state.customerstockTransfer);
            this.setState({
                modCustomerstockTransfer: { ...customerstockTransfer },
            });
        } catch (error) {
            console.log("CustomerStocktransferDetailsComposite:Error occured on handleReset", error);
        }
    };
    validateSave(modCustomerstockTransfer) {
        try {
            var validationErrors = lodash.cloneDeep(this.state.validationErrors);
            Object.keys(CustomerStockTransferValidationDef).forEach(function (key) {
                validationErrors[key] = Utilities.validateField(
                    CustomerStockTransferValidationDef[key],
                    modCustomerstockTransfer[key]
                );
            });
            let notification = {
                messageType: "critical",
                message: ["CustomerStockTransfer_SavedStatus"],
                messageResultDetails: [],
            };
            this.setState({ validationErrors });
            var returnValue = true;
            if (returnValue)
                returnValue = Object.values(validationErrors).every(function (value) {
                    return value === "";
                });
            if (notification.messageResultDetails.length > 0) {
                this.props.onSaved(this.state.modCustomerstockTransfer, "update", notification);
                return false;
            }
            return returnValue;
        } catch (error) {
            console.log("Error while Validate Save", error)
        }
    }
    saveCustomerStockTransfer = () => {
    
        try {
            this.setState({ saveEnabled: false });
            let tempCustomerstockTransfer = lodash.cloneDeep(this.state.tempCustomerstockTransfer);
            tempCustomerstockTransfer.TransferDate = new Date();
            tempCustomerstockTransfer.CustomerAgreementItems = this.fillDetails(this.state.CustomerAgreementItems)
            this.CreateCustomerStockTransfer(tempCustomerstockTransfer)
        } catch (error) {
            console.log("CustomerstockTransferDetailsComposite : Error in saveBaseProduct");
        }
    }
    handleSave = () => {
        
        try {
            let modCustomerstockTransfer = lodash.cloneDeep(this.state.modCustomerstockTransfer);
            modCustomerstockTransfer.TransferDate = new Date();
            modCustomerstockTransfer.CustomerAgreementItems = this.fillDetails(this.state.CustomerAgreementItems)
            this.setState({ saveEnabled: false });
            if (this.validateSave(modCustomerstockTransfer)) {
                let tempCustomerstockTransfer = lodash.cloneDeep(modCustomerstockTransfer);
                tempCustomerstockTransfer.CustomerAgreementItems = this.fillDetails(this.state.CustomerAgreementItems)
                let showAuthenticationLayout =
                    this.props.userDetails.EntityResult.IsWebPortalUser !== true
                        ? true
                        : false;
                this.setState({ showAuthenticationLayout, tempCustomerstockTransfer }, () => {
                    if (showAuthenticationLayout === false) {
                        this.saveCustomerStockTransfer();
                    }
                });

            } else this.setState({ saveEnabled: true });
        } catch (err) {
            console.log("error in handleSave",err)
        }
    }
    CreateCustomerStockTransfer(modCustomerstockTransfer) {
        
        try {
            let obj = {
                Entity: modCustomerstockTransfer,
            };

            let notification = {
                messageType: "critical",
                message: "CustomerStockTransfer_SavedStatus",
                messageResultDetails: [
                    {
                        keyFields: ["CustomerAgreement_TransferReferenceCode"],
                        keyValues: [modCustomerstockTransfer.Code],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };
            axios(
                RestAPIs.CreateCustomerStockTransfer,
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
                        this.setState({
                            saveEnabled:false
                        });
                        this.getCustomerStockTransfer({ CustomerAgreement_TransferReferenceCode: modCustomerstockTransfer.Code })
                    } else {
                        notification.messageResultDetails[0].errorMessage =
                            result.ErrorList[0];
                        this.setState({
                            saveEnabled: true,
                        });
                        console.log("Error in CustomerstockTransfer:", result.ErrorList);
                    }
                    this.props.onSaved(modCustomerstockTransfer, "add", notification);
                })
                .catch((error) => {
                    this.setState({
                        saveEnabled: true,
                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(modCustomerstockTransfer, "add", notification);
                });
        } catch (err) {
            console.log("Error in CustomerstockTransfer:", err);
        }
    }
    handleAuthenticationClose = () => {
        this.setState({
            showAuthenticationLayout: false,
        });
    };

    
    render() {
        const listOptions = {
            shareholders: this.state.shareholders,
            RequestercustomerOptions: this.state.RequestercustomerOptions,
            LendercustomerOptions:this.state.LendercustomerOptions,
            baseProductOptions: this.state.baseProductOptions,
            quantityUOMOptions: this.state.quantityUOMOptions


        };
        return this.state.isReadyToRender ? (
            <div>
                <ErrorBoundary>
                    <TMDetailsHeader
                        entityCode={this.state.customerstockTransfer.Code}
                        newEntityName="CustomerAgreement_DetailsPageTitle"

                    ></TMDetailsHeader>
                </ErrorBoundary>
                <ErrorBoundary>
                    <CustomerStockTransferDetails
                        modCustomerstockTransfer={this.state.modCustomerstockTransfer} 
                        CustomerAgreementItems={this.state.CustomerAgreementItems}
                        listOptions={listOptions}
                        handleCellDataEdit={this.handleCellDataEdit}
                        onFieldChange={this.handleChange}
                        handleAddAssociation={this.handleAddAssociation}
                        handleDeleteAssociation={this.handleDeleteAssociation}
                        selectedAssociations={this.state.selectedAssociations}
                        handleRowSelectionChange={
                            this.handleAssociationSelectionChange
                        }
                        validationErrors={this.state.validationErrors}
                    >
                    </CustomerStockTransferDetails>
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
                    <UserAuthenticationLayout
                        Username={this.props.userDetails.EntityResult.UserName}
                        functionName={
                                 functionGroups.add
                        }
                        functionGroup={fnCustomerAgreement}
                        handleOperation={this.saveCustomerStockTransfer}
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

export default connect(mapStateToProps)(CustomerStockTransferDetailsComposite);

CustomerStockTransferDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};