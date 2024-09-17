import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { ShareholderAllocationDetails } from "../../UIBase/Details/ShareholderAllocationDetails";
import { ShareholderAllocationItemDetails } from "../../UIBase/Details/ShareholderAllocationItemDetails";
import { ShareholderAllocationShipmentDetails } from "../../UIBase/Details/ShareholderAllocationShipmentDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyProductAllocation } from "../../../JS/DefaultEntities";
import { productAllocationEntityDef } from "../../../JS/ValidationDef";
import { productAllocationEntityItemsDef } from "../../../JS/DetailsTableValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnShareholderAllocation, fnProductAllocation } from "../../../JS/FunctionGroups";
import * as Constants from "../../../JS/Constants";
import {
    productAllocationItemAttributeEntity
} from "../../../JS/AttributeEntity";
import dayjs from "dayjs";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ShareholderAllocationDetailsComposite extends Component {
    state = {
        allocation: lodash.cloneDeep(emptyProductAllocation),
        modAllocation: {},
        validationErrors: Utilities.getInitialValidationErrors(
            productAllocationEntityDef
        ),
        allocationItemsvalidationErrors: Utilities.getInitialValidationErrors(
            productAllocationEntityItemsDef
        ),
        isReadyToRender: false,
        saveEnabled: false,
        allocationItemsList: [],
        allocationShipmentItemsList: [],
        selectedAssociations: [],
        modAllocationItems: [],
        finishedProductOptions: [],
        UOMOptions: [],
        allocationTypeandFrequencies: {},
        showAllocationItems: false,
        showAllocationShipments: false,
        noOfSignificantDigits: "3",
        expandedRows: [],
        customerOptions: [],
        CarrierCompanyOptions: [],
        showAuthenticationLayout: false,
        tempAllocation: {},
    };

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.GetUOMList();
            this.getProductAllocationTypesandFrequencies();
            this.getAttributes(this.props.selectedRow);
            if (this.props.allocationType === Constants.AllocationEntityType.CUSTOMER)
                this.getCustomerList()

            if (this.props.allocationType === Constants.AllocationEntityType.CARRIERCOMPANY)
                this.getCarrierCompanies()

            if (this.props.allocationType !== Constants.AllocationEntityType.SHAREHOLDER)
                this.getFinishedProductCodes(this.props.selectedShareholder)

        } catch (error) {
            console.log(
                "ShareholderDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }

    getCustomerList() {
        axios(
            RestAPIs.GetCustomerDestinations +
            "?TransportationType=" +
            " " +
            "&ShareholderCode=" +
            this.props.selectedShareholder,
            Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
        ).then((response) => {
            var result = response.data;
            if (result.IsSuccess === true) {
                if (Array.isArray(result.EntityResult)) {
                    let shareholderCustomers = result.EntityResult.filter(
                        (shareholderCust) =>
                            shareholderCust.ShareholderCode === this.props.selectedShareholder
                    );
                    if (shareholderCustomers.length > 0) {
                        let customerDestinationOptions =
                            shareholderCustomers[0].CustomerDestinationsList;
                        let customerOptions = [];
                        if (customerDestinationOptions !== null) {
                            customerOptions = Object.keys(customerDestinationOptions);
                            customerOptions =
                                Utilities.transferListtoOptions(customerOptions);
                        }
                        this.setState({ customerOptions });
                    } else {
                        console.log(
                            "ShareholderAllocationDetailsComposite:no customers identified for shareholder"
                        );
                    }
                } else {
                    console.log(
                        "ShareholderAllocationDetailsComposite:customerdestinations not identified for shareholder"
                    );
                }
            }
        });
    }

    getCarrierCompanies() {
        axios(
            RestAPIs.GetAllCarrierListForRole +
            "?ShareholderCode=" +
            this.props.selectedShareholder,
            Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
        )
            .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    var list = result.EntityResult.Table2;
                    var CarrierCompanies = [];
                    list.forEach((item) => {
                        CarrierCompanies.push(item.Code);
                    });
                    this.setState({
                        CarrierCompanyOptions: CarrierCompanies,
                    });
                } else {
                    console.log("Error in GetCarrierListForRole:", result.ErrorList);
                }
            })
            .catch((error) => {
                console.log("Error while getting Carrier List:", error);
            });
    }

    getAttributes(shareholderRow) {
        try {
            axios(
                RestAPIs.GetAttributesMetaData,
                Utilities.getAuthenticationObjectforPost(
                    [productAllocationItemAttributeEntity],
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    this.setState(
                        {
                            compartmentAttributeMetaDataList: lodash.cloneDeep(
                                result.EntityResult.PRODUCTALLOCATIONITEM
                            ),
                        },
                        () => this.getShareholderAllocation(shareholderRow)
                    );
                } else {
                    console.log("Failed to get Attributes");
                }
            });
        } catch (error) {
            console.log("Error while getting Attributes:", error);
        }
    }

    formCompartmentAttributes(selectedTerminals) {
        try {
            let attributes = lodash.cloneDeep(
                this.state.compartmentAttributeMetaDataList
            );

            attributes = attributes.filter(function (attTerminal) {
                return selectedTerminals.some(function (selTerminal) {
                    return attTerminal.TerminalCode === selTerminal;
                });
            });
            let modAllocationItems = lodash.cloneDeep(this.state.modAllocationItems);

            modAllocationItems.forEach((comp) => {
                let compAttributes = [];
                attributes.forEach((att) => {
                    att.attributeMetaDataList.forEach((attribute) => {
                        compAttributes.push({
                            AttributeCode: attribute.Code,
                            AttributeName: attribute.DisplayName,
                            AttributeValue: attribute.DefaultValue,
                            TerminalCode: attribute.TerminalCode,
                            IsMandatory: attribute.IsMandatory,
                            DataType: attribute.DataType,
                            IsReadonly: attribute.IsReadonly,
                            MinValue: attribute.MinValue,
                            MaxValue: attribute.MaxValue,
                            ValidationFormat: attribute.ValidationFormat,
                            compSequenceNo: "",
                        });
                    });
                });
                let attributesforNewComp = lodash.cloneDeep(compAttributes);

                if (
                    comp.Code === null &&
                    (comp.AttributesforUI === null || comp.AttributesforUI === undefined)
                ) {
                    comp.AttributesforUI = [];
                    attributesforNewComp.forEach((assignedAttributes) => {
                        assignedAttributes.compSequenceNo = comp.CompartmentSeqNoInTrailer;
                        comp.AttributesforUI.push(assignedAttributes);
                    });
                } else {
                    if (
                        comp.AttributesforUI !== null &&
                        comp.AttributesforUI !== undefined
                    ) {
                        comp.AttributesforUI = comp.AttributesforUI.filter(function (
                            attTerminal
                        ) {
                            return selectedTerminals.some(function (selTerminal) {
                                return attTerminal.TerminalCode === selTerminal;
                            });
                        });

                        compAttributes = compAttributes.filter(function (attTerminal) {
                            return !comp.AttributesforUI.some(function (selTerminal) {
                                return attTerminal.TerminalCode === selTerminal.TerminalCode;
                            });
                        });
                    } else comp.AttributesforUI = [];

                    let tempCompAttributes = lodash.cloneDeep(compAttributes);
                    if (
                        Array.isArray(comp.Attributes) &&
                        comp.Attributes !== null &&
                        comp.Attributes !== undefined &&
                        comp.Attributes.length > 0
                    ) {
                        let selectedTerminalAttributes = comp.Attributes.filter(function (
                            attTerminal
                        ) {
                            return selectedTerminals.some(function (selTerminal) {
                                return attTerminal.TerminalCode === selTerminal;
                            });
                        });
                        selectedTerminalAttributes.forEach((att) => {
                            att.ListOfAttributeData.forEach((attData) => {
                                let tempAttIndex = tempCompAttributes.findIndex(
                                    (item) =>
                                        item.TerminalCode === att.TerminalCode &&
                                        item.AttributeCode === attData.AttributeCode
                                );
                                if (tempAttIndex >= 0)
                                    tempCompAttributes[tempAttIndex].AttributeValue =
                                        attData.AttributeValue;
                            });
                        });
                        tempCompAttributes.forEach((assignedAttributes) => {
                            assignedAttributes.compSequenceNo =
                                comp.SeqNumber;
                            comp.AttributesforUI.push(assignedAttributes);
                        });
                    } else {
                        compAttributes.forEach((assignedAttributes) => {
                            assignedAttributes.compSequenceNo =
                                comp.SeqNumber;
                            comp.AttributesforUI.push(assignedAttributes);
                        });
                    }
                }
                this.toggleExpand(comp, true, true);
                if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
                    comp.AttributesforUI = Utilities.compartmentAttributesConvertoDecimal(
                        comp.AttributesforUI
                    );
                comp.AttributesforUI = Utilities.addSeqNumberToListObject(comp.AttributesforUI);
            });
            this.setState({ modAllocationItems });
        } catch (error) {
            console.log(
                "ShareholderAllocationDetailsComposite:Error in forming Compartment Attributes",
                error
            );
        }
    }

    fillAttributeDetails(modAllocation) {
        try {
            // For Compartment Attributes
            modAllocation.ProductAllocationEntityItems.forEach((comp) => {
                if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
                    comp.AttributesforUI =
                        Utilities.compartmentAttributesDatatypeConversion(
                            comp.AttributesforUI
                        );
                let selectedTerminals = [];

                var compAttributeMetaDataList = lodash.cloneDeep(
                    this.state.compartmentAttributeMetaDataList
                );
                if (compAttributeMetaDataList.length > 0)
                    selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];

                let terminalAttributes = [];
                comp.Attributes = [];
                selectedTerminals.forEach((terminal) => {
                    if (
                        comp.AttributesforUI !== null &&
                        comp.AttributesforUI !== undefined
                    )
                        terminalAttributes = comp.AttributesforUI.filter(function (
                            attTerminal
                        ) {
                            return attTerminal.TerminalCode === terminal;
                        });

                    let attribute = {
                        ListOfAttributeData: [],
                    };

                    attribute.TerminalCode = terminal;
                    terminalAttributes.forEach((termAtt) => {
                        if (termAtt.AttributeValue !== "" || termAtt.IsMandatory === true)
                            attribute.ListOfAttributeData.push({
                                AttributeCode: termAtt.AttributeCode,
                                AttributeValue: termAtt.AttributeValue,
                            });
                        //})
                        //comp.Attributes.push(attribute);
                    });
                    if (
                        attribute.ListOfAttributeData !== null &&
                        attribute.ListOfAttributeData !== undefined &&
                        attribute.ListOfAttributeData.length > 0
                    )
                        comp.Attributes.push(attribute);
                });
            });
            return modAllocation;
        } catch (error) {
            console.log(
                "ShareholderAllocationDetailsComposite:Error occured on fillAttributeDetails",
                error
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            if (
                this.state.allocation.ShareholderCode !== "" &&
                nextProps.selectedRow.Common_Code === undefined
            ) {
                this.getShareholderAllocation(nextProps.selectedRow);
                let validationErrors = { ...this.state.validationErrors };
                Object.keys(validationErrors).forEach((key) => {
                    validationErrors[key] = "";
                });
                let allocationItemsvalidationErrors = { ...this.state.allocationItemsvalidationErrors }
                Object.keys(allocationItemsvalidationErrors).forEach((key) => {
                    allocationItemsvalidationErrors[key] = "";
                });
                this.setState({
                    validationErrors,
                    allocationItemsvalidationErrors
                });
                // this.getPipelineDispatch(nextProps.selectedRow);
            }

        } catch (error) {
            console.log(
                "PipelineDispatchDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }

    getProductAllocationTypesandFrequencies() {
        axios(
            RestAPIs.GetAllocationTypes,
            Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
        )
            .then((response) => {
                var result = response.data;

                if (result.IsSuccess === true) {
                    if (result.EntityResult !== null) {
                        let allocationTypeandFrequencies = {}
                        if (Array.isArray(result.EntityResult.Table) &&
                            Array.isArray(result.EntityResult.Table1)) {
                            result.EntityResult.Table.forEach((key) => {
                                allocationTypeandFrequencies[key.Code] =
                                    result.EntityResult.Table1.filter((item) => {
                                        return item.AllocationType === key.Code
                                    })
                            })
                        }

                        this.setState({ allocationTypeandFrequencies })
                    }
                } else {
                    console.log("Error in GetUOMList:", result.ErrorList);
                }
            })
            .catch((error) => {
                console.log("Error while getting GetUOMList:", error);
            });
    }

    GetUOMList() {
        axios(
            RestAPIs.GetUOMList,
            Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
        )
            .then((response) => {
                var result = response.data;

                if (result.IsSuccess === true) {
                    if (result.EntityResult !== null) {
                        let UOMOptions = [];
                        if (Array.isArray(result.EntityResult.VOLUME)) {
                            UOMOptions = Utilities.transferListtoOptions(
                                result.EntityResult.VOLUME
                            );
                        }
                        if (Array.isArray(result.EntityResult.MASS)) {
                            let massUOMOptions = Utilities.transferListtoOptions(
                                result.EntityResult.MASS
                            );
                            massUOMOptions.forEach((massUOM) =>
                                UOMOptions.push(massUOM)
                            );
                        }

                        this.setState({ UOMOptions });
                    }
                } else {
                    console.log("Error in GetUOMList:", result.ErrorList);
                }
            })
            .catch((error) => {
                console.log("Error while getting GetUOMList:", error);
            });
    }

    handleChange = (propertyName, data) => {
        try {

            const modAllocation = lodash.cloneDeep(this.state.modAllocation);
            modAllocation[propertyName] = data;
            this.setState({ modAllocation });
            if (productAllocationEntityDef[propertyName] !== undefined) {
                var validationErrors = { ...this.state.validationErrors };
                validationErrors[propertyName] = Utilities.validateField(
                    productAllocationEntityDef[propertyName],
                    data
                );
                this.setState({ validationErrors });
            }
            if (propertyName === "ShareholderCode") {
                this.getFinishedProductCodes(data)
                this.getShareholderAllocation({ Common_Code: data })
            }

        } catch (error) {
            console.log(
                "ShareholderAllocationDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };

    handleReset = () => {
        try {
            let modAllocationItems = []
            if (Array.isArray(
                this.state.allocation.ProductAllocationEntityItems
            )) {
                modAllocationItems = Utilities.addSeqNumberToListObject(
                    lodash.cloneDeep(this.state.allocation.ProductAllocationEntityItems)
                )
                modAllocationItems.forEach((item) => {
                    item.Active = item.Active === true ? "Active" : "Inactive"
                })
            }

            this.setState(
                {
                    modAllocation: lodash.cloneDeep(this.state.allocation),
                    modAllocationItems: modAllocationItems,
                    validationErrors: Utilities.getInitialValidationErrors(
                        productAllocationEntityDef
                    ),
                    allocationItemsvalidationErrors: Utilities.getInitialValidationErrors(
                        productAllocationEntityItemsDef
                    ),
                }
            );
        } catch (error) {
            console.log(
                "ShareholderAllocationDetailsComposite:Error occured on handleReset",
                error
            );
        }
    };

    validateSave(modAllocation) {
        const validationErrors = { ...this.state.validationErrors };
        Object.keys(productAllocationEntityDef).forEach(function (key) {
            if (modAllocation[key] !== undefined)
                validationErrors[key] = Utilities.validateField(
                    productAllocationEntityDef[key],
                    modAllocation[key]
                );
        });

        let notification = {
            messageType: "critical",
            message: "ShareholderAllocation_SavedStatus",
            messageResultDetails: [],
        };

        var returnValue = true;
        if (returnValue)
            returnValue = Object.values(validationErrors).every(function (value) {
                return value === "";
            });

        this.setState({
            validationErrors
        })

        if (
            Array.isArray(modAllocation.ProductAllocationEntityItems) &&
            modAllocation.ProductAllocationEntityItems.length > 0
        ) {
            let isUnique = true;

            modAllocation.ProductAllocationEntityItems.forEach((association) => {
                if (isUnique) {
                    let year = new Date(association.StartDate).getFullYear()
                    if (year.toString().length !== 4) {
                        isUnique = false;
                        notification.messageResultDetails.push({
                            keyFields: ["ContractInfo_Product", "ExchangeAgreementDetails_StartDate"],
                            keyValues: [association.FinishedProductCode, association.StartDate],
                            isSuccess: false,
                            errorMessage: "Common_InvalidDate",
                        });
                    }

                    year = new Date(association.EndDate).getFullYear()
                    if (year.toString().length !== 4) {
                        isUnique = false;
                        notification.messageResultDetails.push({
                            keyFields: ["ContractInfo_Product", "ContractInfo_EndDate"],
                            keyValues: [association.FinishedProductCode, association.EndDate],
                            isSuccess: false,
                            errorMessage: "Common_InvalidDate",
                        });
                    }
                }

                if (isUnique) {

                    let itemList = modAllocation.ProductAllocationEntityItems.filter((item) => {
                        return item.SeqNumber !== association.SeqNumber &&
                            item.FinishedProductCode === association.FinishedProductCode
                    })

                    if (itemList.length > 0) {
                        itemList.forEach((item) => {
                            if ((association.StartDate >= item.StartDate && association.StartDate <= item.EndDate) ||
                                (association.EndDate >= item.StartDate && association.EndDate <= item.EndDate)) {
                                isUnique = false;
                                notification.messageResultDetails.push({
                                    keyFields: [],
                                    keyValues: [],
                                    isSuccess: false,
                                    errorMessage: "ErrMsg_PAItem_SameItem_DateOverLap",
                                });
                            }
                        })
                    }

                    if (isUnique) {



                        productAllocationEntityItemsDef.forEach((col) => {
                            let err = "";

                            if (col.validator !== undefined) {
                                err = Utilities.validateField(
                                    col.validator,
                                    association[col.field]
                                );
                            }
                            if (err !== "") {
                                notification.messageResultDetails.push({
                                    keyFields: ["ContractInfo_Product", col.displayName],
                                    keyValues: [
                                        association.FinishedProductCode,
                                        association[col.field],
                                    ],
                                    isSuccess: false,
                                    errorMessage: err,
                                });
                            }
                        });

                        if (association.AttributesforUI !== null
                            && association.AttributesforUI !== undefined) {
                            association.AttributesforUI.forEach((item) => {
                                let errMsg = Utilities.valiateAttributeField(
                                    item,
                                    item.AttributeValue
                                );
                                if (errMsg !== "") {
                                    notification.messageResultDetails.push({
                                        keyFields: [item.AttributeName],
                                        keyValues: [item.AttributeValue],
                                        isSuccess: false,
                                        errorMessage: errMsg,
                                    });
                                }
                            });
                        }
                    }
                }
                this.toggleExpand(association, true, true);
            });
        } else {
            notification.messageResultDetails.push({
                keyFields: ["Report_Shareholder"],
                keyValues: [modAllocation.ShareholderCode],
                isSuccess: false,
                errorMessage: "ERRMSG_PA_NOITEMS",
            });
        }
        if (notification.messageResultDetails.length > 0) {
            this.props.onSaved(this.state.modAllocation, "update", notification);
            return false;
        }
        return returnValue;
    }

    fillDetails(modAllocation, modAllocationItems) {
        try {
            modAllocation.EntityCode =
                this.props.allocationType !== Constants.AllocationEntityType.SHAREHOLDER
                    ? modAllocation.EntityCode : modAllocation.ShareholderCode;
            modAllocation.ShareholderCode =
                this.props.allocationType !== Constants.AllocationEntityType.SHAREHOLDER
                    ? this.props.selectedShareholder
                    : modAllocation.ShareholderCode;
            modAllocation.EntityType = this.props.allocationType
            modAllocation.Source = "TM_UI"

            let allocationItems = []
            if (Array.isArray(modAllocationItems) && modAllocationItems.length > 0) {
                modAllocationItems.forEach((paItem) => {
                    let selectedAssociations = lodash.cloneDeep(this.state.selectedAssociations)
                    let index = selectedAssociations.findIndex((item) => {
                        return item.SeqNumber === paItem.SeqNumber
                    })
                    if ((paItem.FinishedProductCode !== null
                        && paItem.FinishedProductCode !== undefined
                        && paItem.FinishedProductCode !== "") || index >= 0) {
                        paItem.ShareholderCode = modAllocation.ShareholderCode

                        //Get start date and end date
                        paItem.StartDate = dayjs(paItem.StartDate).format("YYYY-MM-DD");
                        paItem.EndDate = dayjs(paItem.EndDate).format("YYYY-MM-DD");

                        paItem.Quantity = paItem.Quantity !== null &&
                            paItem.Quantity !== ""
                            ? Utilities.convertStringtoDecimal(paItem.Quantity)
                            : null

                        //Get the Deviation
                        paItem.DeviationPercentOfQty = paItem.DeviationPercentOfQty !== null &&
                            paItem.DeviationPercentOfQty !== ""
                            ? Utilities.convertStringtoDecimal(paItem.DeviationPercentOfQty)
                            : null

                        //Get the Minimum quantity
                        paItem.MinimumQuantity = paItem.MinimumQuantity !== null &&
                            paItem.MinimumQuantity !== ""
                            ? Utilities.convertStringtoDecimal(paItem.MinimumQuantity)
                            : null

                        paItem.Active = paItem.Active === null || paItem.Active === "Active" ? true : false

                        if (
                            paItem.AttributesforUI !== undefined &&
                            paItem.AttributesforUI != null
                        )
                            paItem.AttributesforUI =
                                Utilities.compartmentAttributesConverttoLocaleString(
                                    paItem.AttributesforUI
                                );

                        allocationItems.push(paItem);

                    }
                })
            }

            modAllocation.ProductAllocationEntityItems = allocationItems

            return modAllocation;
        }
        catch (error) {
            console.log("Error in fillDetails", error)
            return modAllocation;
        }
    }

    createAllocation(modAllocation) {
        this.handleAuthenticationClose();
        let keyCode = [
            {
                key: KeyCodes.entityCode,
                value: this.props.allocationType
                    === Constants.AllocationEntityType.SHAREHOLDER ?
                    modAllocation.ShareholderCode
                    : modAllocation.EntityCode,
            },
        ];

        let obj = {
            keyDataCode: KeyCodes.entityCode,
            KeyCodes: keyCode,
            Entity: modAllocation,
        };

        let notification = {
            messageType: "critical",
            message: this.props.allocationType === Constants.AllocationEntityType.SHAREHOLDER ?
                "ShareholderAllocation_SavedStatus" : "ProductAllocation_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: [this.props.allocationType
                        === Constants.AllocationEntityType.SHAREHOLDER ?
                        "Report_Shareholder" :
                        this.props.allocationType
                            === Constants.AllocationEntityType.CUSTOMER ?
                            "ContractInfo_Customer" : "productAllocation_Carrier"],
                    keyValues: [modAllocation.EntityCode],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };
        axios(
            RestAPIs.CreateShareholderAllocation,
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
                                fnShareholderAllocation
                            ),
                        },
                        () => this.getShareholderAllocation({
                            Common_Code: modAllocation.EntityCode
                        })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShareholderAllocation
                        ),
                    });
                    console.log("Error in CreateShareholderAllocation:", result.ErrorList);
                }
                // console.log(notification);
                this.props.onSaved(modAllocation, "add", notification);
            })
            .catch((error) => {
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnShareholderAllocation
                    ),
                });
                notification.messageResultDetails[0].errorMessage = error;
                this.props.onSaved(modAllocation, "add", notification);
            });
    }

    updateAllocation(modAllocation) {
        this.handleAuthenticationClose();
        let keyCode = [
            {
                key: KeyCodes.entityCode,
                value: modAllocation.EntityCode,
            },
        ];

        let obj = {
            keyDataCode: KeyCodes.entityCode,
            KeyCodes: keyCode,
            Entity: modAllocation,
        };

        let notification = {
            messageType: "critical",
            message: this.props.allocationType === Constants.AllocationEntityType.SHAREHOLDER ?
                "ShareholderAllocation_SavedStatus" : "ProductAllocation_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: [this.props.allocationType
                        === Constants.AllocationEntityType.SHAREHOLDER ?
                        "Report_Shareholder" :
                        this.props.allocationType
                            === Constants.AllocationEntityType.CUSTOMER ?
                            "ContractInfo_Customer" : "productAllocation_Carrier"],
                    keyValues: [modAllocation.EntityCode],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };
        axios(
            RestAPIs.UpdateShareholderAllocation,
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
                                fnShareholderAllocation
                            ),
                        },
                        () => this.getShareholderAllocation({ Common_Code: modAllocation.EntityCode })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShareholderAllocation
                        ),
                    });
                    console.log("Error in UpdateShareholderAllocation:", result.ErrorList);
                }
                // console.log(notification);
                this.props.onSaved(modAllocation, "add", notification);
            })
            .catch((error) => {
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnShareholderAllocation
                    ),
                });
                notification.messageResultDetails[0].errorMessage = error;
                this.props.onSaved(modAllocation, "update", notification);
            });
    }

    saveAllocation = () => {
        try {
          this.setState({ saveEnabled: false });
          let tempAllocation = lodash.cloneDeep(this.state.tempAllocation);
    
          this.state.allocation.ShareholderCode === ""
                    ? this.createAllocation(tempAllocation)
                    : this.updateAllocation(tempAllocation);
    
        } catch (error) {
          console.log("Save Allocation  Composite : Error in save Allocation");
        }
      };

    handleSave = () => {
        try {
            let modAllocation = lodash.cloneDeep(this.state.modAllocation);
            let modAllocationItems = lodash.cloneDeep(this.state.modAllocationItems);

            modAllocation = this.fillDetails(modAllocation, modAllocationItems)

          //  this.setState({ saveEnabled: false });

            if (this.validateSave(modAllocation)) {
                modAllocation = this.fillAttributeDetails(modAllocation);
                
                let showAuthenticationLayout =
                this.props.userDetails.EntityResult.IsWebPortalUser !== true
                  ? true
                  : false;
              let tempAllocation = lodash.cloneDeep(modAllocation);
              this.setState({ showAuthenticationLayout, tempAllocation }, () => {
                if (showAuthenticationLayout === false) {
                  this.saveAllocation();
                }
            });


            } else {
                this.setState({ saveEnabled: true });
            }
        } catch (error) {
            console.log(
                "ShareholderAllocationDetailsComposite:Error occured on handleSave",
                error
            );
        }
    };

    getShareholderAllocation(shareholderRow) {

        if (shareholderRow.Common_Code === undefined) {
            this.setState(
                {
                    allocation: lodash.cloneDeep(emptyProductAllocation),
                    modAllocation: lodash.cloneDeep(emptyProductAllocation),
                    modAllocationItems: [],
                    isReadyToRender: true,
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnShareholderAllocation
                    )
                }, () => {
                    var compAttributeMetaDataList = lodash.cloneDeep(
                        this.state.compartmentAttributeMetaDataList
                    );
                    if (Array.isArray(compAttributeMetaDataList) && compAttributeMetaDataList.length > 0)
                        this.formCompartmentAttributes([
                            compAttributeMetaDataList[0].TerminalCode,
                        ]);
                }
            );
            return;
        }

        var keyCode = [
            {
                key: KeyCodes.entityCode,
                value: shareholderRow.Common_Code,
            },
            {
                key: KeyCodes.entityType,
                value: this.props.allocationType,
            },
        ];
        var obj = {
            ShareHolderCode: this.props.allocationType
                === Constants.AllocationEntityType.SHAREHOLDER ?
                shareholderRow.Common_Code : this.props.selectedShareholder,
            keyDataCode: KeyCodes.shareholderCode,
            KeyCodes: keyCode,
        };
        axios(
            RestAPIs.GetShareholderAllocation,
            Utilities.getAuthenticationObjectforPost(
                obj,
                this.props.tokenDetails.tokenInfo
            )
        )
            .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    let modAllocationItems = lodash.cloneDeep(result.EntityResult.ProductAllocationEntityItems)

                    modAllocationItems = Utilities.addSeqNumberToListObject(modAllocationItems);

                    modAllocationItems.forEach((item) => {
                        item.Active = item.Active === true ? "Active" : "Inactive"
                    })

                    this.setState(
                        {
                            isReadyToRender: true,
                            allocation: lodash.cloneDeep(result.EntityResult),
                            modAllocation: lodash.cloneDeep(result.EntityResult),
                            modAllocationItems: modAllocationItems,
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShareholderAllocation
                            ),
                        }, () => {
                            var compAttributeMetaDataList = lodash.cloneDeep(
                                this.state.compartmentAttributeMetaDataList
                            );
                            if (Array.isArray(compAttributeMetaDataList) && compAttributeMetaDataList.length > 0)
                                this.formCompartmentAttributes([
                                    compAttributeMetaDataList[0].TerminalCode,
                                ]);
                            this.getFinishedProductCodes(result.EntityResult.ShareholderCode)
                        }
                    );
                    this.props.onSaved(result.EntityResult, "add", null);
                } else {
                    this.setState({
                        isReadyToRender: true,
                        allocation: lodash.cloneDeep(emptyProductAllocation),
                        modAllocationItems: [],
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShareholderAllocation
                        )
                    }, () => {
                        var compAttributeMetaDataList = lodash.cloneDeep(
                            this.state.compartmentAttributeMetaDataList
                        );
                        if (Array.isArray(compAttributeMetaDataList) && compAttributeMetaDataList.length > 0)
                            this.formCompartmentAttributes([
                                compAttributeMetaDataList[0].TerminalCode,
                            ]);
                    });
                    console.log("Error in getShareholder:", result.ErrorList);
                }
            })
            .catch((error) => {
                console.log("Error while getShareholder:", error, shareholderRow);
            });
    }

    handleAddAssociation = () => {
        if (
            !this.props.userDetails.EntityResult.IsArchived
        ) {
            try {

                let modAllocationItems = lodash.cloneDeep(this.state.modAllocationItems);
                let newComp = {
                    CreatedTime: null,
                    LastActiveTime: null,
                    Remarks: "",
                    Active: null,
                    DeviationPercentOfQty: null,
                    QuantityUOM: null,
                    LoadedQuantity: null,
                    MinimumQuantity: null,
                    BlockedQuantity: null,
                    Quantity: null,
                    EndDate: new Date(),
                    StartDate: new Date(),
                    AllocationPeriod: "",
                    AllocationType: null,
                    FinishedProductCode: null,
                    ShareholderCode: "",
                    LastUpdatedTime: new Date(),
                    Attributes: [],
                    NewlyAdded: true
                };
                newComp.SeqNumber =
                    Utilities.getMaxSeqNumberfromListObject(modAllocationItems);
                modAllocationItems.push(newComp);
                this.setState(
                    {
                        modAllocationItems,
                        selectedAssociations: [],
                    }, () => {
                        var attributeMetaDataList = lodash.cloneDeep(
                            this.state.compartmentAttributeMetaDataList
                        );
                        if (attributeMetaDataList.length > 0)
                            this.formCompartmentAttributes([
                                attributeMetaDataList[0].TerminalCode,
                            ]);
                    }
                );
            } catch (error) {
                console.log(
                    "TruckReceiptDetailsComposite:Error occured on handleAddCompartment",
                    error
                );
            }
        }
    };

    toggleExpand = (data, open, isTerminalAdded = false) => {
        //console.log("Data in Toggle", data)
        let expandedRows = this.state.expandedRows;
        let expandedRowIndex = expandedRows.findIndex(
            (item) => item.SeqNumber === data.SeqNumber
        );
        if (open) {
            if (isTerminalAdded && expandedRowIndex >= 0) {
                expandedRows.splice(expandedRowIndex, 1);
                expandedRows.push(data);
            } else if (expandedRowIndex >= 0) {
                expandedRows.splice(expandedRowIndex, 1);
            }
        } else {
            if (expandedRowIndex >= 0) {
                expandedRows = expandedRows.filter(
                    (x) => x.Code !== data.Code && x.SeqNumber !== data.SeqNumber
                );
            } else expandedRows.push(data);
        }
        this.setState({ expandedRows });
    };

    handleDeleteAssociation = () => {
        if (!this.props.userDetails.EntityResult.IsArchived) {
            try {
                if (
                    this.state.selectedAssociations != null &&
                    this.state.selectedAssociations.length > 0
                ) {
                    if (this.state.modAllocationItems.length > 0) {
                        let modAllocationItems = lodash.cloneDeep(this.state.modAllocationItems);
                        this.state.selectedAssociations.forEach((obj, index) => {
                            modAllocationItems = modAllocationItems.filter((com, cindex) => {
                                return com.SeqNumber !== obj.SeqNumber;
                            });
                        });
                        this.setState({ modAllocationItems, selectedAssociations: [] });
                    }
                }

                // this.setState({ selectedAssociations: [] });
            } catch (error) {
                console.log(
                    "RigidtruckDetailsComposite:Error occured on handleDeleteCompartment",
                    error
                );
            }
        }
    };

    getSignificantDigits() {
        try {
            axios(
                RestAPIs.GetLookUpData + "?LookUpTypeCode=Common",
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    const result = response.data;
                    if (result.IsSuccess === true) {
                        if (result.EntityResult.NumberOfSignificantDigits !== undefined &&
                            result.EntityResult.NumberOfSignificantDigits !== null) {
                            this.setState({
                                noOfSignificantDigits: result.EntityResult.NumberOfSignificantDigits,
                            });
                        }

                    } else {
                        console.log("Error in getSignificantDigits: ", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log(
                        "PipelineDispatchDetailsComposite: Error occurred on getSignificantDigits",
                        error
                    );
                });
        }
        catch (error) {
            console.log(
                "PipelineDispatchDetailsComposite:Error occured on geting RefrenceSourceLookUp Value",
                error
            );
        }
    }

    getAllocationItems = () => {
        try {

            if ((this.state.allocation.ShareholderCode !== null
                && this.state.allocation.ShareholderCode !== ""
                && this.state.allocation.ShareholderCode !== undefined)
                || (this.state.allocation.EntityCode !== null
                    && this.state.allocation.EntityCode !== ""
                    && this.state.allocation.EntityCode !== undefined)) {
                var keyCode = [
                    {
                        key: KeyCodes.entityCode,
                        value: this.props.allocationType
                            === Constants.AllocationEntityType.SHAREHOLDER ?
                            this.state.modAllocation.ShareholderCode : this.state.modAllocation.EntityCode,
                    },
                    {
                        key: KeyCodes.entityType,
                        // value: Constants.AllocationEntityType.SHAREHOLDER,
                        value: this.props.allocationType
                    },
                ];
                var obj = {
                    ShareHolderCode: this.props.allocationType
                        === Constants.AllocationEntityType.SHAREHOLDER ?
                        this.state.modAllocation.ShareholderCode : this.props.selectedShareholder,
                    keyDataCode: KeyCodes.shareholderCode,
                    KeyCodes: keyCode,
                };
                axios(
                    RestAPIs.GetAllocationItemDetails,
                    Utilities.getAuthenticationObjectforPost(
                        obj,
                        this.props.tokenDetails.tokenInfo
                    )
                )
                    .then((response) => {

                        var result = response.data;
                        if (result.IsSuccess === true) {
                            let list = result.EntityResult;
                            let allocationItemsList = lodash.cloneDeep(list.Table)
                            let noOfSignificantDigits = lodash.clone(this.state.noOfSignificantDigits)

                            allocationItemsList.forEach((item) => {
                                item.allocatedqty = item.allocatedqty !== null ?
                                    Math.round(
                                        item.allocatedqty,
                                        noOfSignificantDigits
                                    ).toString() + " " + item.uom : "0 " + item.uom
                                item.blockedqty = item.blockedqty !== null ?
                                    Math.round(
                                        item.blockedqty,
                                        noOfSignificantDigits
                                    ).toString() + " " + item.uom : "0 " + item.uom
                                item.loadedqty = item.loadedqty !== null ?
                                    Math.round(
                                        item.loadedqty,
                                        noOfSignificantDigits
                                    ).toString() + " " + item.uom : "0 " + item.uom
                                item.startdate = new Date(
                                    item.startdate
                                ).toLocaleDateString();
                                item.enddate = new Date(
                                    item.enddate
                                ).toLocaleDateString();
                            })

                            this.setState(
                                {
                                    allocationItemsList: allocationItemsList,
                                    showAllocationItems: true
                                }
                            );
                        } else {
                            this.setState({
                                allocationItemsList: [],
                                showAllocationItems: false
                            });
                            console.log("Error in getShareholder:", result.ErrorList);
                        }
                    })
                    .catch((error) => {
                        console.log("Error while getShareholder:", error);
                    });
            }
        }
        catch (error) {
            console.log("Error in getting allocation items", error)
        }
    }
    getAllocationShipments = () => {
        try {
            if ((this.state.allocation.ShareholderCode !== null
                && this.state.allocation.ShareholderCode !== ""
                && this.state.allocation.ShareholderCode !== undefined)
                || (this.state.allocation.EntityCode !== null
                    && this.state.allocation.EntityCode !== ""
                    && this.state.allocation.EntityCode !== undefined)) {
                var keyCode = [
                    {
                        key: KeyCodes.entityCode,
                        value: this.props.allocationType
                            === Constants.AllocationEntityType.SHAREHOLDER ?
                            this.state.modAllocation.ShareholderCode : this.state.modAllocation.EntityCode,
                    },
                    {
                        key: KeyCodes.entityType,
                        // value: Constants.AllocationEntityType.SHAREHOLDER,
                        value: this.props.allocationType
                    },
                ];
                var obj = {
                    ShareHolderCode: this.props.allocationType
                        === Constants.AllocationEntityType.SHAREHOLDER ?
                        this.state.modAllocation.ShareholderCode : this.props.selectedShareholder,
                    keyDataCode: KeyCodes.shareholderCode,
                    KeyCodes: keyCode,
                };
                axios(
                    RestAPIs.GetShipmentAllocationDetails,
                    Utilities.getAuthenticationObjectforPost(
                        obj,
                        this.props.tokenDetails.tokenInfo
                    )
                )
                    .then((response) => {
                        var result = response.data;
                        if (result.IsSuccess === true) {
                            let list = result.EntityResult;
                            let allocationShipmentItemsList = lodash.cloneDeep(list.Table)

                            let noOfSignificantDigits = lodash.cloneDeep(this.state.noOfSignificantDigits)
                            allocationShipmentItemsList.forEach((item) => {
                                item.allocatedqty = item.allocatedqty !== null ?
                                    Math.round(
                                        item.allocatedqty,
                                        noOfSignificantDigits
                                    ).toString() + " " + item.uom : "0 " + item.uom
                                item.blockedqty = item.blockedqty !== null ?
                                    Math.round(
                                        item.blockedqty,
                                        noOfSignificantDigits
                                    ).toString() + " " + item.uom : "0 " + item.uom
                                item.loadedqty = item.loadedqty !== null ?
                                    Math.round(
                                        item.loadedqty,
                                        noOfSignificantDigits
                                    ).toString() + " " + item.uom : "0 " + item.uom
                                item.startdate = new Date(
                                    item.startdate
                                ).toLocaleDateString();
                                item.enddate = new Date(
                                    item.enddate
                                ).toLocaleDateString();
                            })
                            this.setState(
                                {
                                    allocationShipmentItemsList: allocationShipmentItemsList,
                                    showAllocationShipments: true
                                });
                        } else {
                            this.setState(
                                {
                                    allocationShipmentItemsList: [],
                                    showAllocationShipments: false
                                });
                            console.log("Error in getShareholder:", result.ErrorList);
                        }
                    })
                    .catch((error) => {
                        console.log("Error while getShareholder:", error);
                    });
            }
        }
        catch (error) {
            console.log("Error in getting allocation shipment items", error)
        }
    }

    getFinishedProductCodes(shareholder) {
        axios(
            RestAPIs.GetFinishedProductCodes + "?ShareholderCode=" + shareholder,
            Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
        )
            .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    if (
                        result.EntityResult !== null &&
                        Array.isArray(result.EntityResult)
                    ) {

                        let finishedProductOptions = Utilities.transferListtoOptions(
                            result.EntityResult
                        );
                        this.setState({ finishedProductOptions });
                    }
                } else {
                    console.log("Error in getFinishedProductCodes:", result.ErrorList);
                }
            })
            .catch((error) => {
                console.log("Error while getting getFinishedProductCodes:", error);
            });
    }

    handleAssociationSelectionChange = (associations) => {
        this.setState({ selectedAssociations: associations });
    };

    handleCellDataEdit = (newVal, cellData) => {
        let modAllocationItems = lodash.cloneDeep(this.state.modAllocationItems);

        modAllocationItems[cellData.rowIndex][cellData.field] = newVal;
        if (cellData.field === "AllocationType")
            modAllocationItems[cellData.rowIndex].AllocationPeriod = null;
        this.setState({ modAllocationItems });
    };

    handleDateTextChange = (cellData, value, error) => {
        try {
            // var validationErrors = { ...this.state.validationErrors };
            var modAllocationItems = lodash.cloneDeep(this.state.modAllocationItems);
            // validationErrors[propertyName] = error;
            let index = modAllocationItems.findIndex((item) => {
                return item.SeqNumber === cellData.rowData.SeqNumber
            }
            )
            if (index >= 0) {
                if (value === "")
                    modAllocationItems[index][cellData.field] = null;
                else
                    modAllocationItems[index][cellData.field] = value;
                this.setState({ modAllocationItems });
            }
        } catch (error) {
            console.log(
                "Error in DateTextChange : Error occured on handleDateTextChange",
                error
            );
        }
    };

    BackEvent = () => {
        try {
            this.setState({
                showAllocationShipments: false,
                showAllocationItems: false
            }, () => {
                this.props.allocationType
                    === Constants.AllocationEntityType.SHAREHOLDER ?
                    this.getShareholderAllocation({ Common_Code: this.state.allocation.ShareholderCode }) :
                    this.getShareholderAllocation({ Common_Code: this.state.allocation.EntityCode });
            })
        }
        catch (error) {
            console.log("Error in BackEvent", error)
        }
    }

    handleCompAttributeCellDataEdit = (compAttribute, value) => {
        let modAllocationItems = lodash.cloneDeep(this.state.modAllocationItems);
        let compIndex = modAllocationItems.findIndex(
            (item) => item.SeqNumber === compAttribute.rowData.compSequenceNo
        );
        if (compIndex >= 0)
            modAllocationItems[compIndex].AttributesforUI[
                //compAttribute.rowIndex
                compAttribute.rowData.SeqNumber - 1
            ].AttributeValue = value;
        this.setState({ modAllocationItems });
        if (compIndex >= 0) this.toggleExpand(modAllocationItems[compIndex], true, true);
    };

    handleAuthenticationClose = () => {
        this.setState({
          showAuthenticationLayout: false,
        });
      };

      getFunctionGroupName() {
        return this.props.allocationType === Constants.AllocationEntityType.SHAREHOLDER? fnShareholderAllocation: fnProductAllocation;
       };

       
      

    render() {
        const listOptions = {
            ShareholderList: this.props.userDetails.EntityResult.ShareholderList,
            finishedProductOptions: this.state.finishedProductOptions,
            allocationTypeandFrequencies: this.state.allocationTypeandFrequencies,
            UOMOptions: this.state.UOMOptions,
            customerOptions: this.state.customerOptions,
            CarrierCompanyOptions: this.state.CarrierCompanyOptions

        };

        const popUpContents = [
            {
                fieldName: "ShareholderDetails_LastUpdated",
                fieldValue:
                    new Date(
                        this.state.modAllocation.LastUpdatedTime
                    ).toLocaleDateString() +
                    " " +
                    new Date(
                        this.state.modAllocation.LastUpdatedTime
                    ).toLocaleTimeString(),
            },
            {
                fieldName: "ShareholderDetails_CreatedDate",
                fieldValue:
                    new Date(this.state.modAllocation.CreatedTime).toLocaleDateString() +
                    " " +
                    new Date(this.state.modAllocation.CreatedTime).toLocaleTimeString(),
            },
        ];

        return this.state.isReadyToRender ? (
            <div>
                <ErrorBoundary>
                    <TMDetailsHeader
                        entityCode={this.state.allocation.EntityCode}
                        newEntityName={this.props.allocationType
                            === Constants.AllocationEntityType.SHAREHOLDER ? "ProductAllocationItemInfo_AddShareholder"
                            : this.props.allocationType === Constants.AllocationEntityType.CUSTOMER ?
                                "ProductAllocationItemInfo_AddCustomer" :
                                "ProductAllocationItemInfo_AddCarrier"
                        }

                        popUpContents={popUpContents}
                    ></TMDetailsHeader>
                </ErrorBoundary>
                {
                    this.state.showAllocationItems ? (
                        <ErrorBoundary>
                            <ShareholderAllocationItemDetails
                                allocationItemList={this.state.allocationItemsList}
                                handleBack={this.BackEvent}
                                pageSize={this.props.userDetails.EntityResult.PageAttibutes
                                    .WebPortalListPageSize}
                                allocationType={this.props.allocationType}
                            >
                            </ShareholderAllocationItemDetails>
                        </ErrorBoundary>
                    ) :
                        this.state.showAllocationShipments ? (
                            <ErrorBoundary>
                                <ShareholderAllocationShipmentDetails
                                    allocationShipmentList={this.state.allocationShipmentItemsList}
                                    handleBack={this.BackEvent}
                                    pageSize={this.props.userDetails.EntityResult.PageAttibutes
                                        .WebPortalListPageSize}
                                    allocationType={this.props.allocationType}
                                >
                                </ShareholderAllocationShipmentDetails>
                            </ErrorBoundary>
                        ) : (
                            <div>
                                <ErrorBoundary>
                                    <ShareholderAllocationDetails
                                        allocation={this.state.allocation}
                                        modAllocation={this.state.modAllocation}
                                        modAllocationItems={this.state.modAllocationItems}
                                        validationErrors={this.state.validationErrors}
                                        onFieldChange={this.handleChange}
                                        listOptions={listOptions}
                                        isEnterpriseNode={
                                            this.props.userDetails.EntityResult.IsEnterpriseNode
                                        }
                                        handleViewItems={this.getAllocationItems}
                                        handleViewShipments={this.getAllocationShipments}
                                        selectedAssociations={this.state.selectedAssociations}
                                        handleRowSelectionChange={
                                            this.handleAssociationSelectionChange
                                        }
                                        handleCellDataEdit={this.handleCellDataEdit}
                                        onDateTextChange={this.handleDateTextChange}
                                        handleAddAssociation={this.handleAddAssociation}
                                        handleDeleteAssociation={this.handleDeleteAssociation}
                                        toggleExpand={this.toggleExpand}
                                        expandedRows={this.state.expandedRows}
                                        compartmentDetailsPageSize={
                                            this.props.userDetails.EntityResult.PageAttibutes
                                                .WebPortalListPageSize
                                        }
                                        handleCompAttributeCellDataEdit={
                                            this.handleCompAttributeCellDataEdit
                                        }
                                        allocationType={this.props.allocationType}
                                    ></ShareholderAllocationDetails>
                                </ErrorBoundary >
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
                                            this.state.allocation.ShareholderCode === ""
                                            ? functionGroups.add
                                            : functionGroups.modify
                                        }
                                        functionGroup={this.getFunctionGroupName()}
                                        handleOperation={this.saveAllocation}
                                        handleClose={this.handleAuthenticationClose}
                                    ></UserAuthenticationLayout>
                                    ) : null}

                            </div>
                        )
                }
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

export default connect(mapStateToProps)(ShareholderAllocationDetailsComposite);

ShareholderAllocationDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};