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
import {ExchangeAgreementDetails} from "../../UIBase/Details/ExchangeAgreementDetails"
import ProductTransferAgreementDetails from "../../UIBase/Details/ProductTransferAgreementDetails"
import lodash from "lodash";
import { functionGroups, fnShareholderAgreement, fnCustomerAgreement } from "../../../JS/FunctionGroups";
import * as Constants from "./../../../JS/Constants";
import { exchangeAgreementValidationDef } from "../../../JS/ValidationDef";
import { ExchangeAgreementItemsPlanValidation } from "../../../JS/DetailsTableValidationDef";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import { emptyShareHolderAgreement } from "../../../JS/DefaultEntities";
import { ShareholderAgreementViewAuditTrailDetails } from "../../UIBase/Details/ShareholderAgreementViewAuditTrailsDetails"
import { Modal, Button, Select, Input, Checkbox } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { ExchangeAgreementShipmentDetails } from "../../UIBase/Details/ExchangeAgreementShipmentDetails"
import UserAuthenticationLayout from "../Common/UserAuthentication";

import {
    shareholderAgrementEnity
} from "../../../JS/AttributeEntity";
class ShareholderAgreementDetailsComposite extends Component {
    state = {
        isReadyToRender: true,
        validationErrors: Utilities.getInitialValidationErrors(
            exchangeAgreementValidationDef
        ),
        modExchangeAgrement: {},
        saveEnabled: false,
        exchangeAgreement: { ...emptyShareHolderAgreement },
        modExchangeAgreementItems: [],
        modProductAgreementItem:{},
        selectedAssociations: [],
        baseProductOptions: [],
        UOMOptions: [],
        isViewAuditTrail: false,
        modViewAuditTrail: [],
        auditTrailList: [],
        modEAShipmentDetails: [],
        isViewShipmentDetails: false,
        tankOptions: [],
        isBonded: false,
        isCloseReceipt: true,
        attributeMetaDataList: [],
        attributeValidationErrors: [],
        selectedAttributeList: [],
        tankShareholderDetails: [],
        shareholderStatus: [],
        btnCreatePTAgreement: false,
        btnFroceClose: false,
        btncompltAgreement: false,
        isfieldEnable: false,
        currentShareholderAgreementStatusList : [],
        showAuthenticationLayout: false,
        tempShareholderAgreementInfo: {},
    }
    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.getAttributes(this.props.selectedRow);
            this.IsBonded();
            this.getTank("")
            this.getBaseProducts();
            this.getUOMList();
            this.GetShareholderAgreementStatus();
        } catch (error) {
            console.log(
                "ShareholderAgreementDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }
    componentWillReceiveProps(nextProps) {
        try {
            if (
                nextProps.selectedRow.Common_Code === undefined &&
                this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo && this.props.selectedRow.ShareholderAgreement_RequestType && this.props.agreementType === Constants.AgrementType.EXCHANGE_AGREEMENT
            ) {
                this.GetExchangeAgreement(nextProps.selectedRow);
                let validationErrors = { ...this.state.validationErrors };
                Object.keys(validationErrors).forEach((key) => {
                    validationErrors[key] = "";
                });
                this.setState({ validationErrors });
            } else 
                this.GetProductTransferAgreement(nextProps.selectedRow)
        } catch (error) {
            console.log(
                "ShareholderAgreementDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }
    getAttributes(selectedRow) {
        
        try {
            axios(
                RestAPIs.GetAttributesMetaData,
                Utilities.getAuthenticationObjectforPost(
                    [shareholderAgrementEnity],
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                
                var result = response.data;
                if (result.IsSuccess === true) {
                    this.setState(
                        {
                            attributeMetaDataList: lodash.cloneDeep(
                                result.EntityResult
                            ),
                            attributeValidationErrors:
                                Utilities.getAttributeInitialValidationErrors(
                                    result.EntityResult.SHAREHOLDERAGREEMENT
                                ),
                            
                        },
                        () => {
                            if (this.props.selectedRow.ShareholderAgreement_RequestType && this.props.agreementType === Constants.AgrementType.EXCHANGE_AGREEMENT) {
                                this.GetExchangeAgreement(selectedRow);
                            }
                            else {
                                this.GetProductTransferAgreement(selectedRow);
                            }
                        }
                    );
                } else {
                    console.log("Failed to get Attributes");
                }
            });
        } catch (error) {
            console.log("Error while getting Attributes:", error);
        }
    }
    localNodeAttribute() {
        
        try {
            var attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList
            );
            if (Array.isArray(attributeMetaDataList.SHAREHOLDERAGREEMENT) && attributeMetaDataList.SHAREHOLDERAGREEMENT.length > 0) {
                this.terminalSelectionChange([
                    attributeMetaDataList.SHAREHOLDERAGREEMENT[0].TerminalCode,
                ]);
            }

        } catch (error) {
            console.log(
                "ShareholderAgrementDetailsComposite:Error occured on localNodeAttribute",
                error
            );
        }
    }

    terminalSelectionChange(selectedTerminals) {
        try {
            if (selectedTerminals !== undefined && selectedTerminals !== null) {
                let attributesTerminalsList = [];
                var attributeMetaDataList = [];
                var selectedAttributeList = [];
                attributeMetaDataList = lodash.cloneDeep(
                    this.state.attributeMetaDataList
                );
                selectedAttributeList = lodash.cloneDeep(
                    this.state.selectedAttributeList
                );
                const attributeValidationErrors = lodash.cloneDeep(
                    this.state.attributeValidationErrors
                );
                var modExchangeAgrement = lodash.cloneDeep(this.state.modExchangeAgrement);

                selectedTerminals.forEach((terminal) => {
                    var existitem = selectedAttributeList.find((selectedAttribute) => {
                        return selectedAttribute.TerminalCode === terminal;
                    });

                    if (existitem === undefined) {
                        attributeMetaDataList.SHAREHOLDERAGREEMENT.forEach(function (
                            attributeMetaData
                        ) {
                            if (attributeMetaData.TerminalCode === terminal) {
                                var Attributevalue = modExchangeAgrement.Attributes.find(
                                    (ShareholderAttribute) => {
                                        return ShareholderAttribute.TerminalCode === terminal;
                                    }
                                );
                                if (Attributevalue !== undefined) {
                                    attributeMetaData.attributeMetaDataList.forEach(function (
                                        attributeMetaData
                                    ) {
                                        var valueAttribute = Attributevalue.ListOfAttributeData.find(
                                            (x) => {
                                                return x.AttributeCode === attributeMetaData.Code;
                                            }
                                        );
                                        if (valueAttribute !== undefined)
                                            attributeMetaData.DefaultValue =
                                                valueAttribute.AttributeValue;
                                    });
                                }
                                attributesTerminalsList.push(attributeMetaData);
                            }
                        });
                    } else {
                        attributesTerminalsList.push(existitem);
                    }
                });
                selectedAttributeList = [];
                selectedAttributeList = attributesTerminalsList;
                selectedAttributeList = Utilities.attributesConvertoDecimal(
                    selectedAttributeList
                );
                attributeValidationErrors.forEach((attributeValidation) => {
                    var existTerminal = selectedTerminals.find((selectedTerminals) => {
                        return attributeValidation.TerminalCode === selectedTerminals;
                    });
                    if (existTerminal === undefined) {
                        Object.keys(attributeValidation.attributeValidationErrors).forEach(
                            (key) => (attributeValidation.attributeValidationErrors[key] = "")
                        );
                    }
                });
                this.setState({ selectedAttributeList, attributeValidationErrors });
            }
        } catch (error) {
            console.log(
                "ShareholderAgreeemntDetailsComposite:Error occured on terminalSelectionChange",
                error
            );
        }
    }
    handleCellAttrinuteDataEdit = (attribute, value) => {
        try {
            attribute.DefaultValue = value;
            this.setState({
                attribute: attribute,
            });
            const attributeValidationErrors = lodash.cloneDeep(
                this.state.attributeValidationErrors
            );

            attributeValidationErrors.forEach((attributeValidation) => {
                if (attributeValidation.TerminalCode === attribute.TerminalCode) {
                    attributeValidation.attributeValidationErrors[
                        attribute.Code
                    ] = Utilities.valiateAttributeField(attribute, value);
                }
            });
            this.setState({ attributeValidationErrors });
        } catch (error) {
            console.log(
                "ShareholderAgrementDetailsComposite:Error occured on handleCellDataEdit",
                error
            );
        }
    };
    IsBonded() {
        try {
            axios(
                RestAPIs.GetLookUpData + "?LookUpTypeCode=Bonding",
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    const result = response.data;
                    if (result.IsSuccess === true) {
                        let bonded = result.EntityResult["EnableBondingNon-Bonding"];
                        this.setState({
                            isBonded: bonded.toUpperCase() === "TRUE" ? true : false,
                        });
                    } else {
                        this.setState({
                            isBonded: false,
                        });
                        console.log("Error in get IsBonded: ", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({
                        isBonded: false,
                    });
                    console.log(
                        "ShareholderAgreementDetailsComposite: Error occurred on get IsBonded",
                        error
                    );
                });
        } catch (error) {
            console.log("error is getting isbonded",error)
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
                        let UOMOptions = [];
                        let uomOptions = [];
                        if ((Array.isArray(result.EntityResult.VOLUME)) && (Array.isArray(result.EntityResult.MASS))) {
                            uomOptions = result.EntityResult.VOLUME.concat(result.EntityResult.MASS);
                        }
                        uomOptions.forEach((uomOptions) => {
                            UOMOptions.push({
                                text: uomOptions,
                                value: uomOptions,
                            })
                        })
                       
                        this.setState({ UOMOptions });
                    }
                } else {
                    console.log("Error in GetUOMList:", result.ErrorList);
                }
            });
        } catch (error) {
            console.log("LoadingArmDetailsComposite:Error while getting GetUOMList");
        }
    }
    getBaseProducts() {
        axios(
            RestAPIs.GetAllBaseProduct + "?TerminalCode=" ,
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
    }
    GetExchangeAgreement(ExchangeAgrementRow) {
        try {
            if (ExchangeAgrementRow.Common_Code === undefined) {
                emptyShareHolderAgreement.StartDate = new Date();
                emptyShareHolderAgreement.EndDate = new Date();
                emptyShareHolderAgreement.RequestorShareholderCode=this.props.selectedShareholder
                this.setState({
                    exchangeAgreement: lodash.cloneDeep(emptyShareHolderAgreement),
                    modExchangeAgrement: { ...emptyShareHolderAgreement },
                    modExchangeAgreementItems: [],
                    isReadyToRender: true,
                    selectedAttributeList: [],
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnShareholderAgreement
                    ),
                },
                    () => {
                        this.localNodeAttribute();
                    }
                );
                return;
            }
            axios(
                RestAPIs.GetExchangeAgreement +
                "?shareholderCode=" +
                this.props.selectedShareholder +
                "&exchangeAgreementCode=" +
                ExchangeAgrementRow.Common_Code,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
            
                var result = response.data;
                if (result.IsSuccess === true) {
                    
                    if (
                        result.EntityResult !== null 
                    ) {
                        let modExchangeAgrement = result.EntityResult;
                        if (modExchangeAgrement.LenderShareholderCode === this.props.selectedShareholder) {
                            this.setState({ saveEnabled: false })
                        }
                        else {
                            this.setState({
                                saveEnabled: modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.FORCE_CLOSED? false : Utilities.isInFunction(
                                    this.props.userDetails.EntityResult.FunctionsList,
                                    functionGroups.modify,
                                    fnShareholderAgreement
                                ),
                            })
                        }
                        modExchangeAgrement.StartDate = modExchangeAgrement.StartDate === "" || modExchangeAgrement.StartDate === null ? new Date() :
                            new Date(
                                modExchangeAgrement.StartDate
                            ).toLocaleDateString()
                        modExchangeAgrement.EndDate = modExchangeAgrement.EndDate === "" || modExchangeAgrement.EndDate === null ? new Date() :
                            new Date(
                                modExchangeAgrement.EndDate
                            ).toLocaleDateString()
                        if (Array.isArray(modExchangeAgrement.ExchangeAgreementItems)) {
                            for (let i = 0; i < modExchangeAgrement.ExchangeAgreementItems.length; i++) {
                                modExchangeAgrement.ExchangeAgreementItems[i].StartDate =
                                    new Date(
                                        modExchangeAgrement.ExchangeAgreementItems[i].StartDate
                                    ).toLocaleDateString()
                                modExchangeAgrement.ExchangeAgreementItems[i].EndDate =
                                    new Date(
                                        modExchangeAgrement.ExchangeAgreementItems[i].EndDate
                                    ).toLocaleDateString()
                   
                            }
                        }
                        let currentShareholderAgreementStatusList  =[]
                        if (modExchangeAgrement.LenderShareholderCode === this.props.selectedShareholder) {
                            let shareholderStatus = lodash.cloneDeep(this.state.shareholderStatus)
                            shareholderStatus.forEach((item) => {
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.SUBMITTED ) {
                                    if (item.value === Constants.ShareholderAgreementStatus.SUBMITTED || item.value === Constants.ShareholderAgreementStatus.ACCEPTED
                                        || item.value === Constants.ShareholderAgreementStatus.REQUEST_REJECTED
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED) {
                                    if ( item.value === Constants.ShareholderAgreementStatus.ACCEPTED
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.COMPLETED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.REQUEST_REJECTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.REQUEST_REJECTED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.IN_PROGRESS || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.SUSPENDED) {

                                    if (item.value === Constants.ShareholderAgreementStatus.IN_PROGRESS || item.value === Constants.ShareholderAgreementStatus.SUSPENDED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.FORCE_CLOSED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.FORCE_CLOSED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.OFFER_REJECTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.OFFER_REJECTED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.DEACTIVATED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.DEACTIVATED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                
                            })
                        }
                        if (modExchangeAgrement.RequestorShareholderCode === this.props.selectedShareholder) {
                            let shareholderStatus = lodash.cloneDeep(this.state.shareholderStatus)
                            shareholderStatus.forEach((item) => {
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.ACCEPTED
                                        || item.value === Constants.ShareholderAgreementStatus.OFFER_REJECTED
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.OFFER_REJECTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.OFFER_REJECTED
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.REQUEST_REJECTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.REQUEST_REJECTED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                            })
                        }
                        this.setState(
                            {
                                isReadyToRender: true,
                                exchangeAgreement: lodash.cloneDeep(result.EntityResult),
                                modExchangeAgrement,
                                modExchangeAgreementItems: modExchangeAgrement.ExchangeAgreementItems,
                                currentShareholderAgreementStatusList
                            }, () => {
                                this.localNodeAttribute();
                                // this.GetShareholderAgreementStatus()
                                this.controlerForRequestorShareholder(modExchangeAgrement)

                            }
                        );
                    }
                } else {
                    this.setState({
                        exchangeAgreement: lodash.cloneDeep(emptyShareHolderAgreement),
                        modExchangeAgrement: {},
                        isReadyToRender: true,
                    });
                    console.log("Error in getExchangeAgrement:", result.ErrorList);
                }
            })
                .catch((error) => {
                    console.log("Error while getExchangeAgrement:", error, ExchangeAgrementRow);
                });
        } catch (err) {
            console.log("error while getting getexchange agreement",err)
        }
    }
    handleChange = (propertyName, data) => {
        
        try {
            const modExchangeAgrement = lodash.cloneDeep(
                this.state.modExchangeAgrement)
            modExchangeAgrement[propertyName] = data;
            const modProductAgreementItem = this.state.modProductAgreementItem;
            modProductAgreementItem[propertyName] = data;
            this.setState({
                modExchangeAgrement, modProductAgreementItem
            });
           
            // if (modExchangeAgrement.LenderShareholderCode == this.props.selectedShareholder) {
                if (propertyName === "RequestStatus") {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnShareholderAgreement
                        ), })
                // }
            }
            const validationErrors = lodash.cloneDeep(this.state.validationErrors);
            if (exchangeAgreementValidationDef[propertyName] !== undefined) {
                validationErrors[propertyName] = Utilities.validateField(
                    exchangeAgreementValidationDef[propertyName],
                    data
                );
                this.setState({ validationErrors });
            };
           

        }
        catch (error) {
            console.log(
                "ExchnageAgrementDetailsComposite:Error occured on handleChange",
                error
            );
        }
    }
    fillDetails() {
        let { modExchangeAgrement,modExchangeAgreementItems,modProductAgreementItem,exchangeAgreement } = { ...this.state };
        try {
            // modExchangeAgrement.RequestorShareholderCode = this.props.selectedShareholder;
            modExchangeAgrement.RequestType = this.props.selectedRow.ShareholderAgreement_RequestType === Constants.AgrementType.EXCHANGE_AGREEMENT || this.props.agreementType === Constants.AgrementType.EXCHANGE_AGREEMENT ? Constants.AgrementType.EXCHANGE_AGREEMENT : Constants.AgrementType.PRODUCT_TRANSFER_AGREEMENT;
            if (modExchangeAgrement.RequestorShareholderCode === this.props.selectedShareholder && exchangeAgreement.RequestCode === "") {
                modExchangeAgrement.RequestStatus = Constants.ShareholderAgreementStatus.SUBMITTED;
                modExchangeAgrement.RequestorShareholderCode = this.props.selectedShareholder;
                this.setState({ modExchangeAgrement })
            }
            else if (modExchangeAgrement.LenderShareholderCode === this.props.selectedShareholder) {
                this.setState({ modExchangeAgrement })
            }
            else {
                // modExchangeAgrement.RequestorShareholderCode = this.props.selectedShareholder;
                this.setState({ modExchangeAgrement })

            }
            let exchangeAgrementComps = [];
            if (Array.isArray(modExchangeAgreementItems)) {
                modExchangeAgreementItems.forEach((item) => {
                    if (!(item.BaseProductCode === null || item.BaseProductCode === "")
                        || !(item.Quantity === null || item.Quantity === "")) {
                        // item.QuantityUOM =
                        //     modExchangeAgreementItems.QuantityUOM;
                        item.Quantity =
                            Utilities.convertStringtoDecimal(
                                item.Quantity
                            );
                        item.StartDate = item.StartDate === null ?
                            modExchangeAgrement.StartDate : item.StartDate
                        item.EndDate = item.EndDate === null ?
                            modExchangeAgrement.EndDate : item.EndDate
                        exchangeAgrementComps.push(item);
                    }
                })
            }
            let productAgreementComp = {
                "QuantityUOM": modProductAgreementItem.QuantityUOM,
                "RequestedQuantity": modProductAgreementItem.RequestedQuantity,
                "LenderShareholderCode": modProductAgreementItem.LenderShareholderCode,
                "AcceptedQuantity": modProductAgreementItem.AcceptedQuantity,
                "RequestorTankCode": modProductAgreementItem.RequestorTankCode,
                "RequestedCutOff_Date": new Date(
                    modProductAgreementItem.RequestedCutOff_Date
                ).toLocaleDateString(),
                "ReceivedGrossQty": modProductAgreementItem.ReceivedGrossQty,
                "ReceivedNetQty": modProductAgreementItem.ReceivedNetQty,
                "ReceivedDate": modProductAgreementItem.ReceivedDate,
                "LenderTankCode": modProductAgreementItem.RequestorTankCode
            };
            modExchangeAgrement.ExchangeAgreementItems = exchangeAgrementComps;
            modExchangeAgrement.ProductTransferAgreement = productAgreementComp;
        } catch (error) {
            console.log("Error in fillDetails", error)
        }
        return modExchangeAgrement;
    }
    handleDateTextChange = (cellData, value, error) => {
        
        try {
            // var validationErrors = { ...this.state.validationErrors };
            var modExchangeAgreementItems = lodash.cloneDeep(this.state.modExchangeAgreementItems);
            // validationErrors[propertyName] = error;
            let index = modExchangeAgreementItems.findIndex((item) => {
                return item.sequenceNo === cellData.rowData.sequenceNo
            }
            )
            
            if (index >= 0) {
                if (value === "")
                    modExchangeAgreementItems[index][cellData.field] = null;
                else
                    modExchangeAgreementItems[index][cellData.field] = value;
                this.setState({ modExchangeAgreementItems });
            }
            
        } catch (error) {
            console.log(
                "Error in DateTextChange : Error occured on handleDateTextChange",
                error
            );
        }
    };
    handleAssociationSelectionChange = (e) => {
        
        try {
            this.setState({ selectedAssociations: e });
        } catch (error) {
            console.log("error in handlAssociationselectionchange", error)
        }
    };
    handleCellDataEdit = (newVal, cellData) => {
        
        try {
            let modExchangeAgrement = lodash.cloneDeep(this.state.modExchangeAgrement);
            let modExchangeAgreementItems=lodash.cloneDeep(this.state.modExchangeAgreementItems)
            modExchangeAgreementItems[cellData.rowIndex][
                cellData.field
            ] = newVal;
            this.setState({ modExchangeAgrement, modExchangeAgreementItems });
        } catch (error) {
            console.log("Error in handleCellDataEdit", error)
        }
    };
    handleAddAssociation = () => {
        
        try {
            if (!this.props.userDetails.EntityResult.IsArchived) {
                try {
                    let modExchangeAgreementItems = lodash.cloneDeep(
                        this.state.modExchangeAgreementItems
                    );
                    let newComp = {
                        BaseProductCode: "",
                        Quantity: 0,
                        QuantityUOM: "",
                        StartDate: null,
                        EndDate: null,
                        AcceptQuantity: null,
                        RemainingQuantity: null,
                        ConsumedQuantity:null,
                    };
                    modExchangeAgreementItems.push(newComp);
                    this.setState({
                        modExchangeAgreementItems,
                        selectedAssociations: [],
                    });
                } catch (error) {
                    console.log(
                        "ExchnageAgrementDetailsComposite:Error occured on handleAddAssociation",
                        error
                    );
                }
            }
        } catch (error) {
            console.log("ExchnageAgrementDetailsComposite: Error occured on handleAddAssociation",
                error)
        }
    };

    handleDeleteAssociation = () => {
        try {
            if (!this.props.userDetails.EntityResult.IsArchived) {
                try {
                    if (
                        this.state.selectedAssociations != null &&
                        this.state.selectedAssociations.length > 0
                    ) {
                        if (
                            this.state.modExchangeAgreementItems.length > 0
                        ) {
                            let modExchangeAgreementItems = lodash.cloneDeep(
                                this.state.modExchangeAgreementItems
                            );

                            this.state.selectedAssociations.forEach((obj, index) => {
                                modExchangeAgreementItems =
                                    modExchangeAgreementItems.filter(
                                        (com, cindex) => {
                                            return com.BaseProductCode !== obj.BaseProductCode;
                                        }
                                    );
                            });

                            this.setState({ modExchangeAgreementItems });
                        }
                    }

                    this.setState({ selectedAssociations: [] });
                } catch (error) {
                    console.log(
                        "ExchnageAgrementDetailsComposite:Error occured on handleDeleteAssociation",
                        error
                    );
                }
            }
        } catch (error) {
            console.log("error in handle Delete Association", error)
        }
    };
    validateSave(modExchangeAgrement, attributeList) {
        let modProductAgreementItem = lodash.cloneDeep(this.state.modProductAgreementItem)
        let tankShareholderDetails = lodash.cloneDeep(this.state.tankShareholderDetails)
        let selectedAssociations=lodash.cloneDeep(this.state.selectedAssociations)
        try {
            let notification = {
                messageType: "critical",
                message: "ExchangeAgreement_savedSucess",
                messageResultDetails: [],
            };
            var validationErrors = lodash.cloneDeep(this.state.validationErrors);
            Object.keys(exchangeAgreementValidationDef).forEach(function (key) {
                validationErrors[key] = Utilities.validateField(
                    exchangeAgreementValidationDef[key],
                    modExchangeAgrement[key]
                );
            });
            if (this.state.exchangeAgreement.RequestCode !== "") {
                if (modExchangeAgrement.Remarks === null || modExchangeAgrement.Remarks === "") {
                    validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
                }
                // if (modExchangeAgrement.RequestorShareholderCode === modExchangeAgrement.LenderShareholderCode) {
                //     validationErrors["Shareholder"] ="ERRMSG_EXCHANGEAGREEMENTINFO_LENDER_SHAREHOLDER_AND_REQUESTORSHAREHOLDER_SHOULD_NOT_BE_SAME"
                // }
            }
            if (this.state.exchangeAgreement.RequestType === Constants.AgrementType.EXCHANGE_AGREEMENT) {
                if (modExchangeAgrement.StartDate == null || modExchangeAgrement.StartDate === "") {
                    validationErrors["StartDate"] = "ExchangeAgreement_StartDateRequired"
                }
                if (modExchangeAgrement.EndDate == null || modExchangeAgrement.EndDate === "") {
                    validationErrors["EndDate"] = "ExchangeAgreement_EndDateRequired"
                }
            }
            if (this.state.exchangeAgreement.RequestType === Constants.AgrementType.PRODUCT_TRANSFER_AGREEMENT || this.props.agreementType === Constants.AgrementType.PRODUCT_TRANSFER_AGREEMENT) {
                if (modProductAgreementItem.QuantityUOM === null || modProductAgreementItem.QuantityUOM === "" || modProductAgreementItem.QuantityUOM === undefined) {
                    validationErrors["QuantityUOM"] = "MarineReceiptManualEntry_MandatoryQuantityUOM"

                }
            }
            if (this.state.modExchangeAgrement.LenderShareholderCode === this.props.selectedShareholder && this.state.modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED && this.state.exchangeAgreement.RequestType === Constants.AgrementType.PRODUCT_TRANSFER_AGREEMENT) {
               
                if (modProductAgreementItem.AcceptedQuantity === "" || modProductAgreementItem.AcceptedQuantity === null || modProductAgreementItem.AcceptedQuantity === 0) {
                    validationErrors["AcceptedQuantity"] = "ProductTranferAgreementDetails_AcceptedQtyError";
                }
                if (
                    Array.isArray(tankShareholderDetails) &&
                    tankShareholderDetails.length > 0
                ) {
                    if (selectedAssociations.length < 0) {
                        notification.messageResultDetails.push({
                            keyFields: ["selectedAssociations"],
                            // keyValues: [value.BayCode],
                            isSuccess: false,
                            errorMessage:
                                "ProductTranferAgreementDetails_LenderTankError",
                        });
                    }
                }
            } if (this.state.modExchangeAgrement.LenderShareholderCode !== this.props.selectedShareholder && this.state.modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED ) {
                if (modProductAgreementItem.ReceivedGrossQty === "" || modProductAgreementItem.ReceivedGrossQty === null  ) {
                    validationErrors["ReceivedGrossQty"] = "ProductTranferAgreementDetails_EnterReceivedQty";
                }
                if (modProductAgreementItem.ReceivedNetQty === "" || modProductAgreementItem.ReceivedNetQty === null) {
                    validationErrors["ReceivedNetQty"] = "ProductTranferAgreementDetails_EnterReceivedQty"
                }
                if (modProductAgreementItem.ReceivedGrossQty <= 0 ) {
                    validationErrors["ReceivedGrossQty"] = "ProductTranferAgreementDetails_ReceivedQtyError";
                }
                if ( modProductAgreementItem.ReceivedNetQty <= 0) {
                    validationErrors["ReceivedNetQty"] = "ProductTranferAgreementDetails_ReceivedQtyError";
                }
                if (modProductAgreementItem.ReceivedDate === null || modProductAgreementItem.ReceivedDate === undefined) {
                    validationErrors["ReceivedDate"] = "ProductTranferAgreementDetails_ReceivedDateNeeded"
                }
                if (new Date(modProductAgreementItem.ReceivedDate).getDate() > new Date(modProductAgreementItem.RequestedCutOff_Date).getDate()) {
                    validationErrors["ReceivedDate"] = "ProductTranferAgreementDetails_ReceivedDateCutOffError"
                }
              
            }

              
            var attributeValidationErrors = lodash.cloneDeep(
                this.state.attributeValidationErrors
            );

            attributeList.forEach((attribute) => {
                attributeValidationErrors.forEach((attributeValidation) => {
                    if (attributeValidation.TerminalCode === attribute.TerminalCode) {
                        attribute.attributeMetaDataList.forEach((attributeMetaData) => {
                            attributeValidation.attributeValidationErrors[
                                attributeMetaData.Code
                            ] = Utilities.valiateAttributeField(
                                attributeMetaData,
                                attributeMetaData.DefaultValue
                            );
                        });
                    }
                });
            });
            this.setState({ validationErrors, attributeValidationErrors });
            let returnValue = true;
            if (returnValue) {
                returnValue = Object.values(validationErrors).every(function (value) {
                    return value === "";
                });
            }
            if (returnValue)
                
            if (this.state.exchangeAgreement.RequestType === Constants.AgrementType.EXCHANGE_AGREEMENT || this.props.selectedRow.ShareholderAgreement_RequestType  === Constants.AgrementType.EXCHANGE_AGREEMENT) {
                if (
                    Array.isArray(modExchangeAgrement.ExchangeAgreementItems) &&
                    modExchangeAgrement.ExchangeAgreementItems.length > 0
                ) {
                    modExchangeAgrement.ExchangeAgreementItems.forEach(
                        (AgreementItems) => {
                            ExchangeAgreementItemsPlanValidation.forEach((col) => {
                                let err = "";

                                if (col.validator !== undefined) {
                                    err = Utilities.validateField(
                                        col.validator,
                                        AgreementItems[col.field]
                                    );
                                }

                                if (err !== "") {
                                    notification.messageResultDetails.push({
                                        keyFields: ["ExchangeAgreementDetailsItem_Product", col.displayName],
                                        keyValues: [
                                            AgreementItems.BaseProductCode,
                                            AgreementItems[col.field],
                                        ],
                                        isSuccess: false,
                                        errorMessage: err,
                                    });
                                }
                            });
                        }
                    );
                } else {
                    notification.messageResultDetails.push({
                        keyFields: [],
                        keyValues: [],
                        isSuccess: false,
                        errorMessage: "Shipment_Compartment_Association_Require",
                    });
                }
            } 
            else return returnValue;
                
                if (notification.messageResultDetails.length > 0) {
                    this.props.onSaved(modExchangeAgrement, "update", notification);
                    return false;
                }
            
            return returnValue;
        } catch (error) {
            console.log("error in validate save", error)
        }
    }
    fillAttributeDetails(ShareholderAgreementInfo, attributeList) {
        try {
            attributeList = Utilities.attributesDatatypeConversion(attributeList);

            ShareholderAgreementInfo.Attributes = [];
            attributeList.forEach((comp) => {
                let attribute = {
                    ListOfAttributeData: [],
                };
                attribute.TerminalCode = comp.TerminalCode;
                comp.attributeMetaDataList.forEach((det) => {
                    attribute.ListOfAttributeData.push({
                        AttributeCode: det.Code,
                        AttributeValue: det.DefaultValue,
                    });
                });
                ShareholderAgreementInfo.Attributes.push(attribute);
            });
            this.setState({ ShareholderAgreementInfo });
            return ShareholderAgreementInfo;
        } catch (error) {
            console.log(
                "ShareholderAgrementDetailsComposite:Error occured on fillAttributeDetails",
                error
            );
        }
    }
    convertStringtoDecimal(ShareholderAgreementInfo, attributeList) {
        try {

            ShareholderAgreementInfo = this.fillAttributeDetails(ShareholderAgreementInfo, attributeList);
            return ShareholderAgreementInfo;
        } catch (err) {
            console.log("convertStringtoDecimal error ShareholderAgrement Details", err);
        }
    }
  
    addUpdateShareholderAgreement = () => {
        try {
          this.setState({ saveEnabled: false });
          let tempShareholderAgreementInfo = lodash.cloneDeep(this.state.tempShareholderAgreementInfo);
         
         this.state.exchangeAgreement.RequestCode === ""
         ?  this.props.agreementType === Constants.AgrementType.EXCHANGE_AGREEMENT ? this.CreateExchangeAgreement(tempShareholderAgreementInfo) : this.CreateProductTransferAgreement(tempShareholderAgreementInfo)
         : this.props.selectedRow.ShareholderAgreement_RequestType === Constants.AgrementType.EXCHANGE_AGREEMENT ? this.UpdateExchangeAgreement(tempShareholderAgreementInfo) : this.UpdateProductTransferAgreement(tempShareholderAgreementInfo);
    
        } catch (error) {
          console.log("Shareholder agreement Details Composite : Error in addUpdateShareholderAgreement");
        }
      };
      
    handleSave = () => {
        
        try {
         //   this.setState({ saveEnabled: false });
            let ShareholderAgreementInfo = this.fillDetails();
            let attributeList = Utilities.attributesConverttoLocaleString(
                this.state.selectedAttributeList
            );
            if (this.validateSave(ShareholderAgreementInfo, attributeList)) {
                ShareholderAgreementInfo = this.convertStringtoDecimal(
                    ShareholderAgreementInfo,
                    attributeList
                )
             
                let showAuthenticationLayout =
                this.props.userDetails.EntityResult.IsWebPortalUser !== true
                  ? true
                  : false;
              let tempShareholderAgreementInfo = lodash.cloneDeep(ShareholderAgreementInfo);
              this.setState({ showAuthenticationLayout, tempShareholderAgreementInfo }, () => {
                if (showAuthenticationLayout === false) {
                  this.addUpdateShareholderAgreement();
                }
            });
        

        } 
            else {
                this.setState({ saveEnabled: true });
            }
        } catch (error) {
            console.log(
                "shareholderAgreementDetailsComposite:Error occured on handleSave",
                error
            );
        }
    };
    CreateExchangeAgreement(modExchangeAgrement) {
        try {
            this.handleAuthenticationClose();
            let keyCode = [
                {
                    key: KeyCodes.exchangeAgreementCode,
                    value: modExchangeAgrement.RequestCode,
                },
            ];

            let obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.exchangeAgreementCode,
                KeyCodes: keyCode,
                Entity: modExchangeAgrement,
            };

            let notification = {
                messageType: "critical",
                message: "ExchangeAgreement_savedSucess",
                messageResultDetails: [
                    {
                        keyFields: ["ExchangeAgreementDetails_RequestCode"],
                        keyValues: [modExchangeAgrement.RequestCode],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };
            axios(
                RestAPIs.CreateExchangeAgreement,
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
                                // saveEnabled: Utilities.isInFunction(
                                //   this.props.userDetails.EntityResult.FunctionsList,
                                //   functionGroups.modify,
                                //   fnTruckReceipt
                                // ),
                            },
                            () => this.GetExchangeAgreement({ Common_Code: modExchangeAgrement.RequestCode })
                        );
                    } else {
                        notification.messageResultDetails[0].errorMessage =
                            result.ErrorList[0];
                        this.setState({
                            saveEnabled: true,
                        });
                        console.log("Error in ExchangeAgrement:", result.ErrorList);
                    }
                    this.props.onSaved(modExchangeAgrement, "add", notification);
                })
                .catch((error) => {
                    this.setState({
                        saveEnabled: true,
                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(modExchangeAgrement, "add", notification);
                });
        } catch (error) {
            console.log("Error in ExchangeAgrement:", error);
        }
    }
    UpdateExchangeAgreement(modExchangeAgrement) {
        
        try {
            this.handleAuthenticationClose();
            let keyCode = [
                {
                    key: KeyCodes.exchangeAgreementCode,
                    value: modExchangeAgrement.RequestCode
                },
            ];
            let obj = {
                keyDataCode: KeyCodes.exchangeAgreementCode,
                KeyCodes: keyCode,
                Entity: modExchangeAgrement,
            };

            let notification = {
                messageType: "critical",
                message: "ExchangeAgreement_savedSucess",
                messageResultDetails: [
                    {
                        keyFields: ["ExchangeAgreementDetails_RequestCode"],
                        keyValues: [modExchangeAgrement.RequestCode],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };

            axios(
                RestAPIs.UpdateExchangeAgreement,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                
                let result = response.data;
                notification.messageType = result.IsSuccess ? "success" : "critical";
                notification.messageResultDetails[0].isSuccess = result.IsSuccess;
                if (result.IsSuccess === true) {
                    this.GetExchangeAgreement({ Common_Code: modExchangeAgrement.RequestCode })
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnShareholderAgreement
                        ),
                    });
                    console.log("Error in update exchangeagreement:", result.ErrorList);
                }
                this.props.onSaved(this.state.modExchangeAgrement, "update", notification);
            })
                .catch((error) => {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnShareholderAgreement
                        ),
                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(this.state.modExchangeAgrement, "modify", notification);
                });
        } catch (error) {
            console.log("Error while UpdateExchangeAgreement", error)
        }
    }
    getTank(terminal) {
        try {
            var Shareholder = this.props.selectedShareholder;
            axios(
                RestAPIs.GetTankListForRole + "?ShareholderCode=" + Shareholder,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        var tankCodeOptions = [];
                        var tanks = result.EntityResult.Table;
                        if (tanks !== null && Array.isArray(tanks)) {
                            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                                tanks = tanks.filter((tank) => {
                                    return tank.TerminalCode === terminal;
                                });
                                for (let i = 0; i < tanks.length; i++) {
                                    tankCodeOptions.push(tanks[i].Common_Code);
                                }
                            }
                            else {
                                for (let i = 0; i < tanks.length; i++) {
                                    tankCodeOptions.push(tanks[i].Common_Code);
                                }
                            }
                        }

                        if (tankCodeOptions !== null && Array.isArray(tankCodeOptions)) {
                            let tankOptions = Utilities.transferListtoOptions(
                                tankCodeOptions
                            );
                            this.setState({ tankOptions });
                        }
                    } else {
                        console.log("Error in getTankList:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("Error in getTankList:", error);
                });
        } catch (error) {
            console.log("Error in getTankList:", error);
        }
    }
    GetProductTransferAgreement=(ProdAggRow)=> {
        
        try {
            if (ProdAggRow.Common_Code === undefined) {
                let modProductAgreementItem = lodash.cloneDeep(this.state.modProductAgreementItem)
                emptyShareHolderAgreement.RequestorShareholderCode = this.props.selectedShareholder;
                modProductAgreementItem.AcceptedQuantity = '0'
                modProductAgreementItem.LenderTankCode = null
                modProductAgreementItem.QuantityUOM = null
                modProductAgreementItem.RequestedCutOff_Date = new Date()
                modProductAgreementItem.RequestedQuantity = '0'
                modProductAgreementItem.RequestorTankCode = null
                modProductAgreementItem.TankBaseProductCode = ""
                this.setState(
                    {
                        exchangeAgreement: lodash.cloneDeep(emptyShareHolderAgreement),
                        modExchangeAgrement: { ...emptyShareHolderAgreement },
                        modProductAgreementItem,
                        isReadyToRender: true,
                        selectedAttributeList: [],
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnShareholderAgreement
                        ),
                        isReadyToRender: true,
                        btnCreatePTAgreement: false,
                        btnFroceClose: false,
                        btncompltAgreement: false,
                        isfieldEnable: false
                    },()=>this.localNodeAttribute()
                );
                return;
            }
            var keyCode = [
                {
                    key: KeyCodes.ProductTransferAgreementCode,
                    value: ProdAggRow.Common_Code,
                },
            ];
            var obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.ProductTransferAgreementCode,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetProductTransferAgreement,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    var result = response.data;
                    
                    let modExchangeAgrement = result.EntityResult;
                    if (modExchangeAgrement.LenderShareholderCode === this.props.selectedShareholder) {
                        this.setState({ saveEnabled: false })
                    }
                    else {
                        this.setState({
                            saveEnabled: modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.FORCE_CLOSED ? false : Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShareholderAgreement
                            ),
                        })
                    }
                    if (result.IsSuccess === true) {
                        let currentShareholderAgreementStatusList = []
                        if (modExchangeAgrement.LenderShareholderCode === this.props.selectedShareholder) {
                            let shareholderStatus = lodash.cloneDeep(this.state.shareholderStatus)
                            shareholderStatus.forEach((item) => {
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.SUBMITTED ) {
                                    if (item.value === Constants.ShareholderAgreementStatus.SUBMITTED || item.value === Constants.ShareholderAgreementStatus.ACCEPTED
                                        || item.value === Constants.ShareholderAgreementStatus.REQUEST_REJECTED
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.ACCEPTED
                                       
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    } 
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED) {
                               if (item.value === Constants.ShareholderAgreementStatus.COMPLETED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.REQUEST_REJECTED) {
                                if (item.value === Constants.ShareholderAgreementStatus.REQUEST_REJECTED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.IN_PROGRESS) {

                                    if (item.value === Constants.ShareholderAgreementStatus.IN_PROGRESS) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.FORCE_CLOSED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.FORCE_CLOSED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.OFFER_REJECTED) { 
                             if (item.value === Constants.ShareholderAgreementStatus.OFFER_REJECTED) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                            })
                        }
                        if (modExchangeAgrement.RequestorShareholderCode === this.props.selectedShareholder) {
                            let shareholderStatus = lodash.cloneDeep(this.state.shareholderStatus)
                            shareholderStatus.forEach((item) => {
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.ACCEPTED
                                        || item.value === Constants.ShareholderAgreementStatus.OFFER_REJECTED
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                                if (modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.OFFER_REJECTED) {
                                    if (item.value === Constants.ShareholderAgreementStatus.OFFER_REJECTED
                                    ) {
                                        currentShareholderAgreementStatusList.push(item)
                                    }
                                }
                            })
                        }
                        this.setState(
                            {
                                isReadyToRender: true,
                                exchangeAgreement: lodash.cloneDeep(result.EntityResult),
                                modExchangeAgrement,
                                modProductAgreementItem: modExchangeAgrement.ProductTransferAgreement,
                                currentShareholderAgreementStatusList
                               
                            }, () => {
                                this.controlerForRequestorShareholder(modExchangeAgrement)
                                this.localNodeAttribute()
                                // this.GetShareholderAgreementStatus()
                                this.GetTankShareholderAssociation(modExchangeAgrement.ProductTransferAgreement)
                            }
                        );
                    } else {
                        this.setState({
                            exchangeAgreement: lodash.cloneDeep(emptyShareHolderAgreement),
                            modExchangeAgrement: {},
                            isReadyToRender: true,
                        });
                        console.log("Error in Getproductransfer:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("Error while Getproductransfer:", error, ProdAggRow);
                });
        } catch (err) {
            console.log("error while getproductagreement",err)
        }
    }
    CreateProductTransferAgreement(modProdAggrement) {
        try {
            this.handleAuthenticationClose();
            let keyCode = [
                {
                    key: KeyCodes.exchangeAgreementCode,
                    value: modProdAggrement.RequestCode,
                },
            ];

            let obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.exchangeAgreementCode,
                KeyCodes: keyCode,
                Entity: modProdAggrement,
            };

            let notification = {
                messageType: "critical",
                message: "ProductTransferAgreement_savedSucess",
                messageResultDetails: [
                    {
                        keyFields: ["ExchangeAgreementDetails_RequestCode"],
                        keyValues: [modProdAggrement.RequestCode],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };
            axios(
                RestAPIs.CreateProductTransferAgreement,
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
                        this.GetProductTransferAgreement({ Common_Code: modProdAggrement.RequestCode })
                    } else {
                        notification.messageResultDetails[0].errorMessage =
                            result.ErrorList[0];
                        this.setState({
                            saveEnabled: true,
                        });
                        console.log("Error in create ProductTransfer:", result.ErrorList);
                    }
                    this.props.onSaved(modProdAggrement, "add", notification);
                })
                .catch((error) => {
                    this.setState({
                        saveEnabled: true,
                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(modProdAggrement, "add", notification);
                });
        } catch (error) {
            console.log("Error in create ProductTransfer:", error);
        }
    }
    UpdateProductTransferAgreement=(modProdAggrement)=> {
       
        try {
            this.handleAuthenticationClose();
            let keyCode = [
                {
                    key: KeyCodes.exchangeAgreementCode,
                    value: modProdAggrement.RequestCode,
                },
            ];

            let obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.exchangeAgreementCode,
                KeyCodes: keyCode,
                Entity: modProdAggrement,
            };

            let notification = {
                messageType: "critical",
                message: "ProductTransferAgreement_savedSucess",
                messageResultDetails: [
                    {
                        keyFields: ["ExchangeAgreementDetails_RequestCode"],
                        keyValues: [modProdAggrement.RequestCode],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };

            axios(
                RestAPIs.UpdateProductTransferAgreement,
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
                                fnShareholderAgreement
                            ),
                        },
                        () => this.GetProductTransferAgreement({ Common_Code: modProdAggrement.RequestCode })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnShareholderAgreement
                        ),
                    });
                    console.log("Error in update ProductTransfer:", result.ErrorList);
                }
                this.props.onSaved(this.state.modProdAggrement, "update", notification);
            })
                .catch((error) => {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnShareholderAgreement
                        ),
                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(this.state.modExchangeAgrement, "modify", notification);
                });
        } catch (error) {
            console.log("Error while UpdateProductAgreement", error)
        }
    }
    getShareholders() {
        try {
            return Utilities.transferListtoOptions(
                this.props.userDetails.EntityResult.ShareholderList
            );
        } catch (error) {
            console.log("ShareholderagreementDetailsComposite:Error occured on getShareholders", error);
        }
    }
    handleViewAuditTrail=() =>{
        try {
            
            axios(
                RestAPIs.GetEAAuditTrailInfo +
                "?exchangeAgreementCode=" + this.state.modExchangeAgrement.RequestCode
                + "&requestorShareholder=" +
                this.props.selectedShareholder,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                
                var result = response.data;
                let modViewAuditTrail = result.EntityResult;
                for (let i = 0; i < modViewAuditTrail.length; i++) {
                    modViewAuditTrail[i].UpdatedTime =
                        new Date(
                            modViewAuditTrail[i].UpdatedTime
                        ).toLocaleDateString()
                }
                this.setState({ modViewAuditTrail, isViewAuditTrail: true })
            })
                .catch((error) => {
                    console.log("Error while getting handleViewAuditTrail:", error);
                })
        } catch (err) {
            console.log("error in view audittrail",err)
        }
    }
    GetExchangeAgreementShipmentItemDetails = () => {
        try {
            axios(
                RestAPIs.GetExchangeAgreementShipmentItemDetails +
                "?shareholderCode=" +
                this.props.selectedShareholder +
                "&exchangeAgreementCode=" + this.state.modExchangeAgrement.RequestCode,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    this.setState({ modEAShipmentDetails: result.EntityResult, isViewShipmentDetails: true })
                })
                .catch((error) => {
                    console.log("Error while exchnageagreementshipment details:", error);
                });
        } catch (err) {
            console.log("error while getting exchnageagreementshipment details",err)
        }
    }
    UpdateExchangeAgreementStatus = (actionType) => {
        let RequestStatus = actionType
        try {
            let notification = {
                messageType: "critical",
                message: "ExchnageAgreement_StatusSucess",
                messageResultDetails: [
                    {
                        keyFields: ["RequestCode"],
                        keyValues: [this.state.modExchangeAgrement.RequestCode],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };
            var keyCode = [
                {
                    key: KeyCodes.LenderShareholder,
                    value: this.state.modExchangeAgrement.LenderShareholderCode,
                },
                {
                    key: KeyCodes.RequestorShareholder,
                    value: this.props.selectedShareholder,
                },
                {
                    key: KeyCodes.ShareholderAgreementStatus,
                    value: RequestStatus,
                },
                {
                    key: KeyCodes.ProductTransferAgreementCode,
                    value: this.state.modExchangeAgrement.RequestCode,
                },
            ];
            var obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.requestCode,
                KeyCodes: keyCode,

            };
            axios(
                RestAPIs.UpdateExchangeAgreementStatus,
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
                        this.setState({
                            saveEnabled: false
                        }, () => this.GetExchangeAgreement({ Common_Code: this.state.modExchangeAgrement.RequestCode }))
                    } else {
                        notification.messageResultDetails[0].errorMessage =
                            result.ErrorList[0];
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
                    console.log("Error while ReceiptClose:", error);
                });
        } catch (error) {
            console.log("Error while closing the shipment:", error);
        }
    }  
    handleReset = () => {
        try {
            const { validationErrors } = { ...this.state };
            const exchangeAgreement = lodash.cloneDeep(this.state.exchangeAgreement);
            Object.keys(validationErrors).forEach(function (key) {
                validationErrors[key] = "";
            });
            this.setState({
                modExchangeAgrement: { ...exchangeAgreement },
                exchangeAgrementComps: [],
                validationErrors,
            });
        } catch (error) {
            console.log("ExchangeAgrementDetailsComposite:Error occured on handleReset", error);
        }
    };
    onBack = () => {
        this.setState({
            saveEnabled: false,
            isViewAuditTrail: false,
            isViewShipmentDetails:false
            
        });
        this.GetExchangeAgreement({ Common_Code: this.state.modExchangeAgrement.RequestCode });
    };
    handleCreateAgrement = (actionType) => {
        let ShareholderAgreementInfo = this.fillDetails();
        let attributeList = Utilities.attributesConverttoLocaleString(
            this.state.selectedAttributeList
        );
        if (this.validateSave(ShareholderAgreementInfo, attributeList)) {
            ShareholderAgreementInfo = this.convertStringtoDecimal(
                ShareholderAgreementInfo,
                attributeList
            )
            this.UpdateProductTransferAgreementStatus(ShareholderAgreementInfo, actionType)
        }
            else {
                console.log("Error while UpdateProductAgreementstatus")
            }
    }
        UpdateProductTransferAgreementStatus = (ShareholderAgreementInfo,actionType) => {
            let RequestStatus = actionType;
            try {
                let keyCode = [
                    {
                        key: KeyCodes.exchangeAgreementCode,
                        value: ShareholderAgreementInfo.RequestCode,
                    },
                    {
                        key: KeyCodes.ShareholderAgreementStatus,
                        value: RequestStatus,
                    },
                ];

                let obj = {
                    ShareHolderCode: this.props.selectedShareholder,
                    keyDataCode: KeyCodes.exchangeAgreementCode,
                    KeyCodes: keyCode,
                    Entity: ShareholderAgreementInfo,
                };

                let notification = {
                    messageType: "critical",
                    message: "ProductTransferAgreement_StatusSucess",
                    messageResultDetails: [
                        {
                            keyFields: ["ExchangeAgreementDetails_RequestCode"],
                            keyValues: [ShareholderAgreementInfo.RequestCode],
                            isSuccess: false,
                            errorMessage: "",
                        },
                    ],
                };

                axios(
                    RestAPIs.UpdateProductTransferAgreementStatus,
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
                                saveEnabled: false
                            },
                            () => this.GetProductTransferAgreement({ Common_Code: ShareholderAgreementInfo.RequestCode })
                        );
                    } else {
                        notification.messageResultDetails[0].errorMessage =
                            result.ErrorList[0];
                        this.setState({
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShareholderAgreement
                            ),
                        });
                        console.log("Error in update ProductTransfer:", result.ErrorList);
                    }
                    this.props.onSaved(ShareholderAgreementInfo, "update", notification);
                })
                    .catch((error) => {
                        this.setState({
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnShareholderAgreement
                            ),
                        });
                        notification.messageResultDetails[0].errorMessage = error;
                        this.props.onSaved(ShareholderAgreementInfo, "modify", notification);
                    });
            } catch (error) {
                console.log("Error while UpdateProductAgreement", error)
            }
    }
    GetTankShareholderAssociation(modProdAggrement) {
        
        try {
            let keyCode = [
                {
                    key: KeyCodes.tankCode,
                    value: modProdAggrement.RequestorTankCode,
                },
            ];

            let obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.tankCode,
                KeyCodes: keyCode,
                Enity: modProdAggrement
            };
            axios(
                RestAPIs.ComminglingTankShareholderAssociation,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (
                            Array.isArray(result.EntityResult) &&
                            result.EntityResult.length > 0
                        ) {
                            let tankShareholderDetails = lodash.cloneDeep(result.EntityResult)
                       
                            let tankdetails = tankShareholderDetails.filter((b) => { return b.ShareholderCode == this.props.selectedShareholder; })
                            this.setState({
                                tankShareholderDetails: tankdetails,
                                isDetails: true,
                            });
                        }
                    } else {
                        this.setState({
                            tankShareholderDetails: [],
                            isDetails: false,
                            saveEnabled: false
                        });
                        console.log("Error in getTankShareholderAssociationDetails:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({
                        tankShareholderDetails: [],
                        isDetails: false
                    });
                    console.log("Error while getting TankShareholderAssociationDetails:", error);
                });
        }
        catch (error) {
            console.log("TankShareholderAssociationComposite: Error in GetTankShareholderAssociation")
        }
    }
    GetShareholderAgreementStatus = () => {
        
        try {
            
            axios(
                RestAPIs.GetShareholderAgreementStatus ,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        let shareholderStatus = Utilities.transferListtoOptions(
                            result.EntityResult,);
                        
                        this.setState({ shareholderStatus, isReadyToRender: true });
                    } else {
                        this.setState({ shareholderStatus: [], isReadyToRender: true });
                        console.log("Error in getshareholderagreement:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({ shareholderStatus: [], isReadyToRender: true });
                    console.log("Error while getting shareholderagreement:", error);
                });
        } catch (err) {
            console.log("error while getting shareholderagreement", err)
        }
    }
    controlerForRequestorShareholder = (data) => {
        
        if (data.RequestorShareholderCode === this.props.selectedShareholder) {
            if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.SUBMITTED) {
                this.setState({ saveEnabled: true, btnCreatePTAgreement: false, btnFroceClose: true, btncompltAgreement: false ,isfieldEnable:false})
            } 
            else if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.ACCEPTED) {
                this.setState({ saveEnabled: false, btnCreatePTAgreement: true, btnFroceClose: true, btncompltAgreement: false,isfieldEnable:true
})
            }
            else if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.COMPLETED ) {
                this.setState({
                    saveEnabled: false, btnCreatePTAgreement: false, btnFroceClose: false, btncompltAgreement: false, isfieldEnable: true
                })
            }
            else if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.IN_PROGRESS) {
                this.setState({
                    saveEnabled: true, btnCreatePTAgreement: false, btnFroceClose: true, btncompltAgreement: true, isfieldEnable: true
                })
            }
            else if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.OFFER_REJECTED) {
                this.setState({
                    saveEnabled: false, btnCreatePTAgreement: false, btnFroceClose: false, btncompltAgreement: false, isfieldEnable: true
                })
            }
            else if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.FORCE_CLOSED || data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.REQUEST_REJECTED) {
                this.setState({
                    saveEnabled: false, btnCreatePTAgreement: false, btnFroceClose: false, btncompltAgreement: false, isfieldEnable: false
                })
            }
        }
        else if (data.LenderShareholderCode === this.props.selectedShareholder) {
            if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.SUBMITTED || data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.ACCEPTED || data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.OFFER_REJECTED ) {
                this.setState({
                    saveEnabled: false, btnCreatePTAgreement: false, btnFroceClose: false, btncompltAgreement: false, isfieldEnable: false
})
            }
            else if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.COMPLETED ) {
                this.setState({
                    saveEnabled: false, btnCreatePTAgreement: false, btnFroceClose: false, btncompltAgreement: false, isfieldEnable: true
                })  
            }
            else if (data.RequestStatus.toUpperCase() === Constants.ShareholderAgreementStatus.FORCE_CLOSED) {
                this.setState({
                    saveEnabled: false, btnCreatePTAgreement: false, btnFroceClose: false, btncompltAgreement: false, isfieldEnable: false
                })
            }
           
            }
    }
    
    handleAuthenticationClose = () => {
        this.setState({
          showAuthenticationLayout: false,
        });
      };

     

    render() {
        const listOptions = {
            shareholders: this.getShareholders(),
            baseProductOptions: this.state.baseProductOptions,
            UOMOptions: this.state.UOMOptions,
            tankCodeOptions: this.state.tankOptions,
            currentShareholderAgreementStatusList: this.state.currentShareholderAgreementStatusList

        }
      const popUpContents = [
          {
              fieldName: "ExchangeAgreementDetails_CreatedDate",
              fieldValue:
                  new Date(
                      this.state.modExchangeAgrement.CreatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(this.state.modExchangeAgrement.CreatedTime).toLocaleTimeString(),
          },
          {
              fieldName: "ExchangeAgreementDetails_LastUpdatedDate",
              fieldValue:
                  this.state.modExchangeAgrement.LastUpdatedTime !== undefined &&
                      this.state.modExchangeAgrement.LastUpdatedTime !== null
                      ? new Date(
                          this.state.modExchangeAgrement.LastUpdatedTime
                      ).toLocaleDateString() +
                      " " +
                      new Date(
                          this.state.modExchangeAgrement.LastUpdatedTime
                      ).toLocaleTimeString()
                      : "",
          },
          {
              fieldName: "ExchangeAgreementDetails_StatuschangedDate",
              fieldValue:
                  new Date(this.state.modExchangeAgrement.CreatedTime).toLocaleDateString() +
                  " " +
                  new Date(this.state.modExchangeAgrement.CreatedTime).toLocaleTimeString(),
          },
      ];
    return this.state.isReadyToRender ? (
        <div>
            {this.state.isViewAuditTrail ? (
                <ErrorBoundary>
                    <ShareholderAgreementViewAuditTrailDetails
                        modViewAuditTrail={this.state.modViewAuditTrail}
                        handleBack={this.onBack}
                        RequestCode={this.state.modExchangeAgrement.RequestCode}
                    ></ShareholderAgreementViewAuditTrailDetails>
                </ErrorBoundary>
            ) : this.state.isViewShipmentDetails ? (
                    <ErrorBoundary>
                        <ExchangeAgreementShipmentDetails
                            modEAShipmentDetails={this.state.modEAShipmentDetails}
                            handleBack={this.onBack}
                        >
                        </ExchangeAgreementShipmentDetails>
                    </ErrorBoundary>
            ):( 
                    <div>
            <ErrorBoundary>
                <TMDetailsHeader
                    entityCode={this.state.exchangeAgreement.RequestCode}
                    newEntityName={this.props.selectedRow.ShareholderAgreement_RequestType === Constants.AgrementType.EXCHANGE_AGREEMENT||this.props.agreementType === Constants.AgrementType.EXCHANGE_AGREEMENT ? "ExchangeAgreementDetails_Title" : "ProductTransferAgreementDetails_Title"}
                    popUpContents={popUpContents}
                ></TMDetailsHeader>
            </ErrorBoundary>
            
                <ErrorBoundary>
                    {this.props.selectedRow.ShareholderAgreement_RequestType === Constants.AgrementType.EXCHANGE_AGREEMENT || this.props.agreementType === Constants.AgrementType.EXCHANGE_AGREEMENT ?
                        <ExchangeAgreementDetails
                            isBonded={this.state.isBonded}
                            listOptions={listOptions}
                            modExchangeAgrement={this.state.modExchangeAgrement}
                            exchangeAgreement={this.state.exchangeAgreement}
                            modExchangeAgreementItems={this.state.modExchangeAgreementItems}
                            selectedAssociations={this.state.selectedAssociations}
                            handleAssociationSelectionChange={
                                this.handleAssociationSelectionChange
                            }
                            selectedShareholder={this.props.selectedShareholder}
                            handleCellDataEdit={this.handleCellDataEdit}
                            handleAddAssociation={this.handleAddAssociation}
                            handleDeleteAssociation={this.handleDeleteAssociation}
                            onFieldChange={this.handleChange}
                            onDateTextChange={this.handleDateTextChange}
                            validationErrors={this.state.validationErrors}
                            handleViewAuditTrail={this.handleViewAuditTrail}
                            UpdateExchangeAgreementStatus={this.UpdateExchangeAgreementStatus}
                                        GetExchangeAgreementShipmentItemDetails={this.GetExchangeAgreementShipmentItemDetails}
                                        isEnterpriseNode={this.props.userDetails.EntityResult.IsEnterpriseNode}
                                        attributeValidationErrors={this.state.attributeValidationErrors}
                                        selectedAttributeList={this.state.selectedAttributeList}
                                        handleCellAttrinuteDataEdit={this.handleCellAttrinuteDataEdit}
                                        btnCreatePTAgreement={this.state.btnCreatePTAgreement}
                                        btnFroceClose={this.state.btnFroceClose}
                        >
                        </ExchangeAgreementDetails > :
                                    <ProductTransferAgreementDetails
                                        selectedShareholder={this.props.selectedShareholder}
                           isBonded={this.state.isBonded}
                            modExchangeAgrement={this.state.modExchangeAgrement}
                             onFieldChange={this.handleChange}
                            exchangeAgreement={this.state.exchangeAgreement}
                            onDateTextChange={this.handleDateTextChange}
                            listOptions={listOptions}
                            modProductAgreementItem={this.state.modProductAgreementItem}
                             handleViewAuditTrail={this.handleViewAuditTrail}
                                        validationErrors={this.state.validationErrors}
                                        tankShareholderDetails={this.state.tankShareholderDetails}
                                        UpdateProductTransferAgreementStatus={this.UpdateProductTransferAgreementStatus}
                                        handleCreateAgrement={this.handleCreateAgrement}
                                        isEnterpriseNode={this.props.userDetails.EntityResult.IsEnterpriseNode}
                                        attributeValidationErrors={this.state.attributeValidationErrors}
                                        selectedAttributeList={this.state.selectedAttributeList}
                                        handleCellAttrinuteDataEdit={this.handleCellAttrinuteDataEdit}
                                        btnCreatePTAgreement={this.state.btnCreatePTAgreement}
                                        btnFroceClose={this.state.btnFroceClose}
                                        btncompltAgreement={this.state.btncompltAgreement}
                                        handleAssociationSelectionChange={
                                            this.handleAssociationSelectionChange
                                        }
                                        selectedAssociations={this.state.selectedAssociations}
                                        isfieldEnable={this.state.isfieldEnable}
                        ></ProductTransferAgreementDetails >}
                </ErrorBoundary>
            <ErrorBoundary>
                <TMDetailsUserActions
                    handleBack={this.props.onBack}
                    handleSave={this.handleSave}
                    handleReset={this.handleReset}
                    saveEnabled={this.state.saveEnabled}
                ></TMDetailsUserActions>
                    </ErrorBoundary></div>)}
            {/* {this.state.isCloseReceipt ? this.handleCloseReceipttModal() : null} */}
            {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
                this.state.exchangeAgreement.RequestCode === ""
                  ? functionGroups.add
                  : functionGroups.modify
              }
            functionGroup={fnShareholderAgreement}
            handleOperation={this.addUpdateShareholderAgreement}
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

export default connect(mapStateToProps)(ShareholderAgreementDetailsComposite);

ShareholderAgreementDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};