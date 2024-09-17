import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import NotifyEvent from "../../../JS/NotifyEvent";
//import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { toast } from "react-toastify";
import { TruckShipmentManualEntryDetails } from "../../UIBase/Details/TruckShipmentManualEntryDetails";
//import { Accordion, Tab } from "@scuf/common";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import lodash from "lodash";
import {
    emptyRailMarineTransactionCommonInfo,
    emptyRailMarineFinishedProductInfoInfo,
    emptyTruckManualEntryLoadingDetailsCommonInfo,
    emptyTruckManualEntryLoadingProductInfo
} from "../../../JS/DefaultEntities";
import * as Utilities from "../../../JS/Utilities";
import {
    truckShipmentManualEntryProdValidationDef,
    truckShipmentManualEntryCommonValidationDef,
} from "../../../JS/ValidationDef";
import * as KeyCodes from "../../../JS/KeyCodes";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import PropTypes from "prop-types";
import * as RestAPIs from "../../../JS/RestApis";
import {
    shipmentLoadingDetailsFPAttributeEntity,
    shipmentLoadingDetailsBPAttributeEntity,
    shipmentLoadingDetailsAdvAttributeEntity
} from "../../../JS/AttributeEntity";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Button } from "@scuf/common";
import {functionGroups,fnSBC, fnLoadingDetails} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class TruckShipmentManualEntryDetailsComposite extends Component {

    state = {
        modRailMarineTransactionCommonInfo: lodash.cloneDeep(emptyRailMarineTransactionCommonInfo),
        modRailMarineFinishedProductInfoInfo: lodash.cloneDeep(emptyRailMarineFinishedProductInfoInfo),
        modTruckManualEntryLoadingDetailsCommonInfo: lodash.cloneDeep(emptyTruckManualEntryLoadingDetailsCommonInfo),
        modTruckManualEntryLoadingFPInfo: lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo),
        modTruckManualEntryLoadingBPInfo: [],
        modTruckManualEntryLoadingAdvInfo: [],
        quantityUOMOptions: [],
        densityUOMS: [],
        temperatureUOMs: [],
        calcValueUOM: [],
        compartmentSeqNoInVehicleList: [],
        Bays: [],
        LoadingArms: [],
        BCUs: [],
        BaysandBCUs: [],
        productList: [],
        activeIndex: 0,
        meterCodes: [],
        tankCodes: [],
        validationErrors: Utilities.getInitialValidationErrors(
            truckShipmentManualEntryCommonValidationDef
        ),
        validationErrorsForFP: Utilities.getInitialValidationErrors(
            truckShipmentManualEntryProdValidationDef
        ),
        attributeMetaDataList: [],
        validationErrorsForBP: [],
        selectedAttributeList: [],
        attributeValidationErrors: [],
        selectedAttributeBPList: {},
        bpAttributeValidationErrors: {},
        selectedAttributeAdvList: {},
        advAttributeValidationErrors: {},
        manualEntrySaveEnable: false,
        isBCUTransload: false,
        transloadSource: "",
        currentCompTopUpReq: {},
        updatedCompSeqNo: [],
        railReceipt: [],
        marineReceipt: [],
        wagonCodes: [],
        receiptCodes: [],
        marineReceiptCompCodes: [],
        carrierCode: "",
        isComminglingAlert: false,

        showAuthenticationLayout: false,
        tempLoadingDetails: {},
    };

    componentDidMount() {
        try {
            this.setDefaultValues();
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.getAttributes();
            this.getCompartmentSeqNo();
            this.getmeterCodes();
            this.getTankCodes();
            this.GetUOMList();
            this.GetBaysandBCUs();
            this.setState({manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnSBC)})
        } catch (error) {
            console.log(
                this.props.ShipmentType + ":Error occured on componentDidMount",
                error
            );
        }
    }

    setDefaultValues() {
        emptyTruckManualEntryLoadingProductInfo.StartTime = new Date();
        emptyTruckManualEntryLoadingProductInfo.EndTime = new Date();
        emptyTruckManualEntryLoadingProductInfo.QuantityUOM = this.props.shipment.ShipmentQuantityUOM; // to display Ship Qty UOM, in place MOT UOM
        this.setState({
            modTruckManualEntryLoadingFPInfo: lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo),
            modRailMarineTransactionCommonInfo: lodash.cloneDeep(emptyRailMarineTransactionCommonInfo),
            modRailMarineFinishedProductInfoInfo: lodash.cloneDeep(emptyRailMarineFinishedProductInfoInfo),
            modTruckManualEntryLoadingDetailsCommonInfo: lodash.cloneDeep(emptyTruckManualEntryLoadingDetailsCommonInfo),
            modTruckManualEntryLoadingBPInfo: [],
            modTruckManualEntryLoadingAdvInfo: [],
            productList: [],
        });
    }
    getAttributes() {
        try {
            axios(
                RestAPIs.GetAttributesMetaData,
                Utilities.getAuthenticationObjectforPost(
                    [shipmentLoadingDetailsFPAttributeEntity, shipmentLoadingDetailsBPAttributeEntity, shipmentLoadingDetailsAdvAttributeEntity],
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        this.setState({
                            attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
                            attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(result.EntityResult.LOADINGDETAILSFP),
                        })
                    } else {
                        console.log("Failed to get Attributes");
                    }
                })
        } catch (error) {
            console.log("Error while getting Attributes:", error);
        }
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
                        let quantityUOMOptions = [];
                        let densityUOMS = [];
                        let temperatureUOMs = [];
                        let calcValueUOM = [];

                        if (Array.isArray(result.EntityResult.VOLUME)) {
                            calcValueUOM = Utilities.transferListtoOptions(
                                result.EntityResult.VOLUME
                            );
                            quantityUOMOptions = Utilities.transferListtoOptions(
                                result.EntityResult.VOLUME
                            );
                        }
                        if (Array.isArray(result.EntityResult.MASS)) {
                            let massUOMOptions = Utilities.transferListtoOptions(
                                result.EntityResult.MASS
                            );
                            massUOMOptions.forEach((massUOM) => {
                                quantityUOMOptions.push(massUOM);
                                calcValueUOM.push(massUOM)
                            }

                            );
                        }
                        if (Array.isArray(result.EntityResult.DENSITY)) {
                            densityUOMS = Utilities.transferListtoOptions(
                                result.EntityResult.DENSITY
                            );
                        }
                        if (Array.isArray(result.EntityResult.TEMPERATURE)) {
                            temperatureUOMs = Utilities.transferListtoOptions(
                                result.EntityResult.TEMPERATURE
                            );
                        }

                        this.setState({ quantityUOMOptions, densityUOMS, calcValueUOM, temperatureUOMs });

                    }
                } else {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error in GetUOMList:", result.ErrorList);
                }
            })
            .catch((error) => {
                console.log("TruckShipmentManualEntryDetailsComposite: Error while getting GetUOMList:", error);
            });
    }

    handleReset = () => {
        try {

            let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo)
            modTruckManualEntryLoadingFPInfo.StartTime = new Date();
            modTruckManualEntryLoadingFPInfo.EndTime = new Date();
            modTruckManualEntryLoadingFPInfo.QuantityUOM = this.props.shipment.ShipmentQuantityUOM;

            this.setState({
                modRailMarineTransactionCommonInfo: lodash.cloneDeep(emptyRailMarineTransactionCommonInfo),
                modRailMarineFinishedProductInfoInfo: lodash.cloneDeep(emptyRailMarineFinishedProductInfoInfo),
                modTruckManualEntryLoadingDetailsCommonInfo: lodash.cloneDeep(emptyTruckManualEntryLoadingDetailsCommonInfo),
                modTruckManualEntryLoadingFPInfo,
                modTruckManualEntryLoadingBPInfo: [],
                modTruckManualEntryLoadingAdvInfo: [],
                LoadingArms: [],
                BCUs: [],
                productList: [],
                activeIndex: 0,
                validationErrors: Utilities.getInitialValidationErrors(
                    truckShipmentManualEntryCommonValidationDef
                ),
                validationErrorsForFP: Utilities.getInitialValidationErrors(
                    truckShipmentManualEntryProdValidationDef
                ),
                attributeMetaDataList: lodash.cloneDeep(this.state.attributeMetaDataList),
                attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(this.state.attributeMetaDataList.LOADINGDETAILSFP),
                validationErrorsForBP: [],
                selectedAttributeList: [],
                selectedAttributeBPList: {},
                selectedAttributeAdvList: {},
                bpAttributeValidationErrors: {},
                advAttributeValidationErrors: {},
                manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnSBC),
                isBCUTransload: false,
                transloadSource: "",
                currentCompTopUpReq: {},
            });
        } catch (error) {
            console.log(
                "TruckShipmentManualEntryDetailsComposite:Error occured on handleReset",
                error
            );
        }
    };

    getCompartmentSeqNo(isAfterCreate = false) {
        try {
            var keyCode = [
                {
                    key: KeyCodes.shipmentCode,
                    value: this.props.shipment.ShipmentCode,
                }
            ];
            var obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.shipmentCode,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.getCompartmentSeqNo,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    var result = response.data;

                    if (result.IsSuccess === true) {
                        if (isAfterCreate)
                            this.setState({ updatedCompSeqNo: result.EntityResult }, () => {
                                this.setDefaultValues();
                            })
                        else
                            this.setState({ compartmentSeqNoInVehicleList: result.EntityResult, updatedCompSeqNo: result.EntityResult }, () => {
                                this.setDefaultValues();
                            })

                        // if (this.state.modTruckManualEntryLoadingDetailsCommonInfo &&
                        //     this.state.modTruckManualEntryLoadingDetailsCommonInfo.CompartmentSeqNoInVehicle !== ""
                        // ) {
                        //     if (this.state.updatedCompSeqNo.includes(this.state.modTruckManualEntryLoadingDetailsCommonInfo.CompartmentSeqNoInVehicle.toString()))
                        //         this.setState({ manualEntrySaveEnable: true });
                        //     else
                        //         this.setState({ manualEntrySaveEnable: false });
                        // }
                    } else {
                        console.log("TruckShipmentManualEntryDetailsComposite: Error in getCompartmentSeqNo:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error while getting getCompartmentSeqNo:", error);
                });
        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite:Error occured in getCompartmentSeqNo", error);
        }

    }

    getTopUpRequestsofShipment(compSeqNo) {
        try {
            var keyCode = [
                {
                    key: KeyCodes.shipmentCode,
                    value: this.props.shipment.ShipmentCode,
                }
            ];
            var obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.shipmentCode,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetTopUpRequestsOfShipment,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    var result = response.data;

                    if (result.IsSuccess === true) {

                        if (Array.isArray(result.EntityResult.Table)) {
                            let index = result.EntityResult.Table.findIndex((item) => {
                                return item.COMPARTMENTSeqNoInVehicle.toString() === compSeqNo
                            });

                            this.setState({ currentCompTopUpReq: result.EntityResult.Table[index] })

                        } else {
                            console.log("TruckShipmentManualEntryDetailsComposite: Error in getTopUpRequestsofShipment:", result.ErrorList);
                        }
                    }
                })
                .catch((error) => {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error while getting getTopUpRequestsofShipment:", error);
                });
        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite:Error occured in getTopUpRequestsofShipment", error);
        }

    }

    GetBaysandBCUs() {
        try {
            axios(
                RestAPIs.GetBaysandBCUs,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (result.EntityResult !== null) {
                            let Bays = []
                            let BaysandBCUs = result.EntityResult;
                            if (Array.isArray(Object.keys(BaysandBCUs))) {
                                Object.keys(BaysandBCUs).forEach(element => {
                                    Bays.push(element)
                                });
                            }
                            this.setState({ Bays, BaysandBCUs });
                        }
                    } else {
                        console.log("TruckShipmentManualEntryDetailsComposite: Error in GetBaysandBCUs:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error while getting GetBaysandBCUs:", error);
                });
        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite: Error in GetBaysandBCUs:", error);
        }

    }


    getmeterCodes() {
        try {
            axios(
                RestAPIs.GetMeters,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (result.EntityResult !== null) {
                            let meterCodes = []
                            meterCodes = result.EntityResult
                            this.setState({ meterCodes });
                        }
                    } else {
                        console.log("TruckShipmentManualEntryDetailsComposite: Error in getmeterCodes:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error while getting getmeterCodes:", error);
                });
        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite: Error in getmeterCodes:", error);
        }
    }

    getTankCodes() {
        try {
            axios(
                RestAPIs.GetTanks + "?ShareholderCode=" + this.props.selectedShareholder,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (result.EntityResult !== null) {
                            let tankCodes = []
                            tankCodes = result.EntityResult
                            this.setState({ tankCodes });
                        }
                    } else {
                        console.log("TruckShipmentManualEntryDetailsComposite: Error in getTankCodes:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error while getting getTankCodes:", error);
                });
        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite: Error in getTankCodes:", error);
        }
    }

    GetLoadingArms(BCUCode) {

        let LoadingArmsForBCU = []

        try {
            let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingFPInfo)

            axios(
                RestAPIs.GetLoadingArms + "?bcuCode=" + BCUCode,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (result.EntityResult !== null) {
                            LoadingArmsForBCU = result.EntityResult;

                            if (Array.isArray(LoadingArmsForBCU) && LoadingArmsForBCU.length === 1) {

                                modTruckManualEntryLoadingFPInfo.LoadingArmCode = LoadingArmsForBCU[0];

                                this.GetMetersForLA(BCUCode, LoadingArmsForBCU[0]);
                            }
                            this.setState({ LoadingArms: result.EntityResult, modTruckManualEntryLoadingFPInfo });
                        }
                    } else {
                        console.log("TruckShipmentManualEntryDetailsComposite: Error in GetLoadingArms:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error while getting GetLoadingArms:", error);
                });
        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite: Error while getting GetLoadingArms:", error);
        }

    }

    GetMetersForLA(bcuCode, loadingArmCode) {


        try {
            var keyCode = [
                {
                    key: KeyCodes.siteViewType,
                    value: Constants.siteViewType.ROAD_BCUVIEW,
                },
                {
                    key: KeyCodes.bcuCode,
                    value: bcuCode,
                },
                {
                    key: KeyCodes.terminalCode,
                    value: this.props.shipment.ActualTerminalCode,
                },
            ];
            var obj = {
                ShareHolderCode: "",
                keyDataCode: KeyCodes.siteViewType,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetBCUViewTree,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    if (
                        Array.isArray(result.EntityResult) &&
                        result.EntityResult.length > 0
                    ) {

                        let loadingArm = result.EntityResult[0].AssociatedArmsList.find(larm => larm.Code === loadingArmCode);
                        if (loadingArm !== null) {
                            let mainLineMeters = [];
                            let additiveMeters = [];
                            mainLineMeters = loadingArm.AssociatedMeterList.find(meter => meter.MeterLineType === "MAINLINE");
                            additiveMeters = loadingArm.AssociatedMeterList.find(meter => meter.MeterLineType === "ADDITIVE");
                            let bpMeterCode = '';
                            let additiveMeterCode = '';
                            if (mainLineMeters.MeterList.length === 1) {
                                bpMeterCode = mainLineMeters.MeterList[0].Code;
                            }
                            if (additiveMeters.MeterList.length === 1) {
                                additiveMeterCode = additiveMeters.MeterList[0].Code;
                            }


                            if (bpMeterCode !== '') {
                                let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingBPInfo);
                                modTruckManualEntryLoadingBPInfo.forEach(item => { item.MeterCode = bpMeterCode; })
                                this.setState({
                                    modTruckManualEntryLoadingBPInfo
                                });
                            }

                            if (additiveMeterCode !== '') {
                                let modTruckManualEntryLoadingAdvInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingAdvInfo);
                                modTruckManualEntryLoadingAdvInfo.forEach(item => { item.MeterCode = additiveMeterCode; })
                                this.setState({
                                    modTruckManualEntryLoadingAdvInfo
                                });
                            }
                        }

                    }
                }
            });
        } catch (error) {
            console.log("SiteTreeView:Error occured in GetMetersForLA", error);
        }
    }

    getBCUs(BayCode) {
        let BCUs = []
        try {
            let BaysandBCUs = lodash.cloneDeep(this.state.BaysandBCUs)

            if (Object.keys(BaysandBCUs).length > 0) {
                BCUs = BaysandBCUs[BayCode]
            }

            this.setState({ BCUs });
        } catch (
        error
        ) {
            console.log("TruckShipmentManualEntryDetailsComposite: Error in getBCUs:", error);
        }
        return BCUs;
    }

    getFPReceipeDetails(compSequenceNo) {
        try {
            let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingFPInfo)
            let finishedProd = this.props.shipment.ShipmentDestinationCompartmentsInfo.find((comp) => {
                return comp.CompartmentSeqNoInVehicle.toString() === compSequenceNo;
            }).FinishedProductCode;
            modTruckManualEntryLoadingFPInfo.FinishedProductCode = finishedProd

            let validationErrorsForFP = lodash.cloneDeep(this.state.validationErrorsForFP)
            validationErrorsForFP.FinishedProductCode = ""
            this.setState({ modTruckManualEntryLoadingFPInfo, validationErrorsForFP })

            axios(
                RestAPIs.getFPReceipeDetails + "?finishedProduct=" + finishedProd + "&shCode=" + this.props.selectedShareholder,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (result.EntityResult !== null) {
                            let productList = []
                            let validationErrorsForBP = []
                            let modTruckManualEntryLoadingBPInfo = []
                            let modTruckManualEntryLoadingAdvInfo = []
                            if (Array.isArray(result.EntityResult.Table)) {

                                result.EntityResult.Table.forEach(
                                    (item) => {
                                        emptyTruckManualEntryLoadingProductInfo.AdditiveProductCode = null
                                        emptyTruckManualEntryLoadingProductInfo.BaseProductCode = item.code
                                        emptyTruckManualEntryLoadingProductInfo.QuantityUOM = this.props.shipment.ShipmentQuantityUOM
                                        emptyTruckManualEntryLoadingProductInfo.CalculatedValueUOM = this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.MassUOM
                                        productList.push({
                                            code: item.code,
                                            productType: item.ProductTYPE,
                                            baseProductCode: null
                                        });
                                        validationErrorsForBP.push(
                                            Utilities.getInitialValidationErrors(
                                                truckShipmentManualEntryProdValidationDef
                                            ))
                                        modTruckManualEntryLoadingBPInfo.push(
                                            lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo)
                                        )
                                    }
                                );
                            }

                            //let validationErrorsForAdditive = lodash.cloneDeep(this.state.validationErrorsForAdditive)
                            if (Array.isArray(result.EntityResult.Table2)) {

                                result.EntityResult.Table2.forEach(
                                    (item) => {
                                        emptyTruckManualEntryLoadingProductInfo.BaseProductCode = item.BaseProductCode
                                        emptyTruckManualEntryLoadingProductInfo.AdditiveProductCode = item.AdditiveCode
                                        productList.push({
                                            code: item.AdditiveCode,
                                            productType: item.producttype,
                                            baseProductCode: item.BaseProductCode
                                        });
                                        validationErrorsForBP.push(
                                            Utilities.getInitialValidationErrors(
                                                truckShipmentManualEntryProdValidationDef
                                            ))
                                        modTruckManualEntryLoadingAdvInfo.push(
                                            lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo)
                                        )
                                    }
                                );
                            }
                            this.setState({
                                productList, validationErrorsForBP, //validationErrorsForAdditive,
                                modTruckManualEntryLoadingFPInfo, modTruckManualEntryLoadingAdvInfo, modTruckManualEntryLoadingBPInfo
                            }, () => {
                                this.handleAttributes()
                            });
                        }
                    } else {
                        console.log("TruckShipmentManualEntryDetailsComposite: Error in getFPReceiptDetails:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("TruckShipmentManualEntryDetailsComposite: Error while getting FPReceiptDetails:", error);
                });
        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite: Error while getting getFPReceiptDetails:", error);
        }

    }

    handleAttributes() {
        let attributeMetaDataList = lodash.cloneDeep(this.state.attributeMetaDataList.LOADINGDETAILSFP);
        let bpAttributeMetaDataList = lodash.cloneDeep(this.state.attributeMetaDataList.LOADINGDETAILSBP);
        let advAttributeMetaDataList = lodash.cloneDeep(this.state.attributeMetaDataList.LOADINGDETAILSADDITIVE);
        let selectedAttributeList = lodash.cloneDeep(this.state.selectedAttributeList)
        let selectedAttributeBPList = lodash.cloneDeep(this.state.selectedAttributeBPList)
        let selectedAttributeAdvList = lodash.cloneDeep(this.state.selectedAttributeAdvList)

        if (attributeMetaDataList.length > 0) {
            selectedAttributeList = this.formAttributesforEachTab(attributeMetaDataList)
            this.setState({
                selectedAttributeList
            })
            let attributeValidationErrors = lodash.cloneDeep(this.state.attributeValidationErrors)
            attributeValidationErrors.forEach((attributeValidation) => {
                Object.keys(attributeValidation.attributeValidationErrors).forEach((key) => (attributeValidation.attributeValidationErrors[key] = ""))
            });
        }

        let bpAttributeValidationErrors = {}
        let advAttributeValidationErrors = {}

        if (bpAttributeMetaDataList.length > 0) {
            let bpCode = Object.keys(lodash.cloneDeep(this.state.modTruckManualEntryLoadingBPInfo))
            bpCode.forEach((code) => {
                selectedAttributeBPList[code] = this.formAttributesforEachTab(bpAttributeMetaDataList)
                if (Array.isArray(selectedAttributeBPList[code]))
                    selectedAttributeBPList[code][0].attributeMetaDataList.forEach((item) => {
                        let index = lodash.cloneDeep(code)
                        item.index = index
                    })
                bpAttributeValidationErrors[code] = Utilities.getAttributeInitialValidationErrors(this.state.attributeMetaDataList.LOADINGDETAILSBP)
            });
            this.setState({ selectedAttributeBPList, bpAttributeValidationErrors })

        }
        if (advAttributeMetaDataList.length > 0) {
            let advCode = Object.keys(lodash.cloneDeep(this.state.modTruckManualEntryLoadingAdvInfo))
            advCode.forEach((code) => {
                selectedAttributeAdvList[code] = this.formAttributesforEachTab(advAttributeMetaDataList)
                advAttributeValidationErrors[code] = Utilities.getAttributeInitialValidationErrors(this.state.attributeMetaDataList.LOADINGDETAILSADDITIVE)
            });
            this.setState({ selectedAttributeAdvList, advAttributeValidationErrors })
        }
    }

    formAttributesforEachTab(attributeMetaDataList) {
        let selectedTerminals = attributeMetaDataList[0].TerminalCode

        var selectedAttributeList = [];

        attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === selectedTerminals) {
                selectedAttributeList.push(attributeMetaData);
            }
        })

        return selectedAttributeList
    }

    getBCUDetails(deviceCode) {
        try {
            var keyCode = [
                {
                    key: KeyCodes.bcuCode,
                    value: deviceCode,
                }
            ];
            var obj = {
                ShareHolderCode: "",
                keyDataCode: KeyCodes.bcuCode,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetBCUDevice,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                let result = response.data;
                if (result.IsSuccess === true) {
                    let bcu = result.EntityResult

                    let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingFPInfo);
                    let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingBPInfo);
                    modTruckManualEntryLoadingFPInfo.TemperatureUOM = bcu.TemperatureUOM;
                    modTruckManualEntryLoadingFPInfo.ProductDensityUOM = bcu.DensityUOM;

                    modTruckManualEntryLoadingBPInfo.forEach((BPInfo) => {
                        BPInfo.TemperatureUOM = bcu.TemperatureUOM;
                        BPInfo.ProductDensityUOM = bcu.DensityUOM;
                    })

                    this.setState({ modTruckManualEntryLoadingFPInfo, modTruckManualEntryLoadingBPInfo })

                    if (bcu.ReceiptSource === Constants.TransportationType.RAIL) {
                        this.setState({ isBCUTransload: true, transloadSource: Constants.TransportationType.RAIL }, () => {
                            this.GetRailTransloadableReceipts()
                        })
                    }
                    else if (bcu.ReceiptSource === Constants.TransportationType.MARINE) {
                        this.setState({ isBCUTransload: true, transloadSource: Constants.TransportationType.MARINE }, () => {
                            this.getMarineTransloadableReceipts()
                        })
                    }
                    else
                        this.setState({ isBCUTransload: false, transloadSource: "" })
                }
            });
        } catch (error) {
            console.log(
                "TruckShipmentManualEntryDetailsComposite:Error while getting getBCUDeviceDetails"
            );
        }
    }

    handleChange = (type, propertyName, data, additiveCode = null) => {
        try {
            let validationErrors = lodash.cloneDeep(this.state.validationErrors)
            let validationErrorsForFP = lodash.cloneDeep(this.state.validationErrorsForFP)
            let validationErrorsForBP = lodash.cloneDeep(this.state.validationErrorsForBP)

            if (type === Constants.ViewAllShipmentFields.Common) {
                let modTruckManualEntryLoadingDetailsCommonInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingDetailsCommonInfo)
                modTruckManualEntryLoadingDetailsCommonInfo[propertyName] = data

                if (propertyName === Constants.ViewAllShipmentFields.CompartmentSeqNoInVehicle) {
                    modTruckManualEntryLoadingDetailsCommonInfo = lodash.cloneDeep(emptyTruckManualEntryLoadingDetailsCommonInfo)
                    modTruckManualEntryLoadingDetailsCommonInfo[propertyName] = data

                    if (this.state.modTruckManualEntryLoadingDetailsCommonInfo
                        //&& this.state.modTruckManualEntryLoadingDetailsCommonInfo.CompartmentSeqNoInVehicle !== ""
                    ) {
                        if (this.state.updatedCompSeqNo.includes(data.toString()))
                            this.setState({ manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnSBC) });
                        else
                            this.setState({ manualEntrySaveEnable: false });
                    }

                    emptyTruckManualEntryLoadingProductInfo.QuantityUOM = this.props.shipment.ShipmentQuantityUOM;
                    emptyTruckManualEntryLoadingProductInfo.CalculatedValueUOM = this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.MassUOM;
                    // emptyTruckManualEntryLoadingProductInfo.StartTime = new Date();
                    // emptyTruckManualEntryLoadingProductInfo.EndTime = new Date();
                    this.setState({
                        modRailMarineTransactionCommonInfo: lodash.cloneDeep(emptyRailMarineTransactionCommonInfo),
                        modRailMarineFinishedProductInfoInfo: lodash.cloneDeep(emptyRailMarineFinishedProductInfoInfo),
                        modTruckManualEntryLoadingDetailsCommonInfo,
                        modTruckManualEntryLoadingFPInfo: lodash.cloneDeep(emptyTruckManualEntryLoadingProductInfo),
                        modTruckManualEntryLoadingBPInfo: [],
                        modTruckManualEntryLoadingAdvInfo: [],
                        LoadingArms: [],
                        BCUs: [],
                        productList: [],
                        activeIndex: 0,
                        validationErrors: Utilities.getInitialValidationErrors(
                            truckShipmentManualEntryCommonValidationDef
                        ),
                        validationErrorsForFP: Utilities.getInitialValidationErrors(
                            truckShipmentManualEntryProdValidationDef
                        ),
                        attributeMetaDataList: lodash.cloneDeep(this.state.attributeMetaDataList),
                        attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(this.state.attributeMetaDataList.LOADINGDETAILSFP),
                        validationErrorsForBP: [],
                        selectedAttributeList: [],
                        selectedAttributeBPList: {},
                        selectedAttributeAdvList: {},
                        bpAttributeValidationErrors: {},
                        advAttributeValidationErrors: {},
                        isBCUTransload: false,
                        transloadSource: "",
                        currentCompTopUpReq: {}
                    }, () => {
                        this.getTopUpRequestsofShipment(data)
                        this.getFPReceipeDetails(data)
                    })
                }
                else {
                    if (propertyName === Constants.ViewAllShipmentFields.BAY) {

                        let BCUs = this.getBCUs(data);

                        if (BCUs.length > 0 && BCUs.length === 1) {
                            modTruckManualEntryLoadingDetailsCommonInfo.BCUCode = BCUs[0];

                            this.GetLoadingArms(BCUs[0]);

                            this.getBCUDetails(BCUs[0])
                        }



                    }
                    if (propertyName === Constants.ViewAllShipmentFields.BCU) {
                        this.GetLoadingArms(data)
                        this.getBCUDetails(data)
                    }

                    if (
                        truckShipmentManualEntryCommonValidationDef[propertyName] !== undefined
                    ) {
                        validationErrors[
                            propertyName
                        ] = Utilities.validateField(
                            truckShipmentManualEntryCommonValidationDef[propertyName],
                            data
                        );
                    }

                    this.setState({ modTruckManualEntryLoadingDetailsCommonInfo, validationErrors })
                }
            }
            if (type === Constants.ViewAllShipmentFields.FP) {
                let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingFPInfo)
                modTruckManualEntryLoadingFPInfo[propertyName] = data


                if (propertyName === Constants.ViewAllShipmentFields.LOADINGARM) {

                    let modTruckManualEntryLoadingDetailsCommonInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingDetailsCommonInfo)
                    this.GetMetersForLA(modTruckManualEntryLoadingDetailsCommonInfo.BCUCode, data);
                }

                if (
                    truckShipmentManualEntryProdValidationDef[propertyName] !== undefined
                ) {
                    validationErrorsForFP[
                        propertyName
                    ] = Utilities.validateField(
                        truckShipmentManualEntryProdValidationDef[propertyName],
                        data
                    );
                }

                this.setState({ modTruckManualEntryLoadingFPInfo, validationErrorsForFP })
            }
            if (type === Constants.ViewAllShipmentFields.BP) {
                let index = this.state.activeIndex - 1
                let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingBPInfo)
                modTruckManualEntryLoadingBPInfo[index][propertyName] = data

                if (
                    truckShipmentManualEntryProdValidationDef[propertyName] !== undefined
                ) {
                    validationErrorsForBP[this.state.activeIndex - 1][
                        propertyName
                    ] = Utilities.validateField(
                        truckShipmentManualEntryProdValidationDef[propertyName],
                        data
                    );
                }

                this.setState({ modTruckManualEntryLoadingBPInfo, validationErrorsForBP })
            }
            if (type === Constants.ViewAllShipmentFields.Adv) {
                //let index = this.state.activeIndex - 1
                let modTruckManualEntryLoadingAdvInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingAdvInfo)
                let advIndex = modTruckManualEntryLoadingAdvInfo.findIndex(
                    (item) =>
                        item.AdditiveProductCode === additiveCode
                );
                modTruckManualEntryLoadingAdvInfo[advIndex][propertyName] = data

                if (
                    truckShipmentManualEntryProdValidationDef[propertyName] !== undefined
                ) {
                    validationErrorsForBP[this.state.activeIndex - 1][
                        propertyName
                    ] = Utilities.validateField(
                        truckShipmentManualEntryProdValidationDef[propertyName],
                        data
                    );
                }

                this.setState({ modTruckManualEntryLoadingAdvInfo, validationErrorsForBP })
            }
            if (type === Constants.ViewAllShipmentFields.RailTransload) {

                let modRailMarineTransactionCommonInfo = lodash.cloneDeep(this.state.modRailMarineTransactionCommonInfo)
                modRailMarineTransactionCommonInfo[propertyName] = data

                this.setState({ modRailMarineTransactionCommonInfo }, () => {
                    if (propertyName === "ReceiptCode")
                        this.getRailReceipt(data)
                })
            }
            if (type === Constants.ViewAllShipmentFields.MarineTransload) {

                let modRailMarineTransactionCommonInfo = lodash.cloneDeep(this.state.modRailMarineTransactionCommonInfo)
                modRailMarineTransactionCommonInfo[propertyName] = data

                this.setState({ modRailMarineTransactionCommonInfo }, () => {
                    if (propertyName === "ReceiptCode")
                        this.getMarineReceipt(data)
                })
            }

        } catch (error) {
            console.log(
                this.props.ShipmentType + "TruckShipmentManualEntryDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };

    getRailReceipt(commonCode) {
        try {
            const keyCode = [
                {
                    key: KeyCodes.railReceiptCode,
                    value: commonCode,
                },
            ];
            const obj = {
                ShareHolderCode: this.props.selectedShareholder,
                keyDataCode: KeyCodes.railReceiptCode,
                KeyCodes: keyCode,
            };
            axios(
                RestAPIs.GetRailReceipt,
                Utilities.getAuthenticationObjectforPost(
                    obj,
                    this.props.tokenDetails.tokenInfo
                )
            )
                .then((response) => {
                    const result = response.data;
                    if (result.IsSuccess === true) {
                        if (result.EntityResult !== null && result.EntityResult !== undefined) {
                            let wagonCodes = []
                            if (result.EntityResult.RailMarineReceiptCompartmentDetailPlanList !== undefined &&
                                result.EntityResult.RailMarineReceiptCompartmentDetailPlanList !== null) {
                                result.EntityResult.RailMarineReceiptCompartmentDetailPlanList.forEach((item) => {
                                    if (item.IsTransloading === true)
                                        wagonCodes.push(item.TrailerCode)
                                })
                            }

                            let modRailMarineTransactionCommonInfo = lodash.cloneDeep(this.state.modRailMarineTransactionCommonInfo);
                            if (wagonCodes.length === 1) {
                                modRailMarineTransactionCommonInfo.TrailerCode = wagonCodes[0];
                            }

                            this.setState({ wagonCodes: Utilities.transferListtoOptions(wagonCodes), railReceipt: result.EntityResult, modRailMarineTransactionCommonInfo })
                        }
                        else {
                            this.setState({ wagonCodes: [], railReceipt: {} })
                        }
                    } else {
                        this.setState({ wagonCodes: [], railReceipt: {} })
                        console.log("Error in getRailReceipt:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log(
                        "Error while getting getRailReceipt:",
                        error
                    );
                });
        } catch (error) {
            console.log(
                "MapTransactionsDetailsConposite:Error occured on getRailReceipt",
                error
            );
        }
    }

    getMarineReceipt(commonCode) {
        var keyCode = [
            {
                key: KeyCodes.marineReceiptCode,
                value: commonCode,
            },
            {
                key: KeyCodes.transportationType,
                value: Constants.TransportationType.MARINE,
            },
        ];
        var obj = {
            ShareHolderCode: this.props.selectedShareholder,
            keyDataCode: KeyCodes.marineReceiptCode,
            KeyCodes: keyCode,
        };
        axios(
            RestAPIs.GetMarineReceipt,
            Utilities.getAuthenticationObjectforPost(
                obj,
                this.props.tokenDetails.tokenInfo
            )
        )
            .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    if (result.EntityResult !== null && result.EntityResult !== undefined) {
                        let compCodes = []
                        if (result.EntityResult.RailMarineReceiptCompartmentDetailPlanList !== undefined &&
                            result.EntityResult.RailMarineReceiptCompartmentDetailPlanList !== null) {
                            result.EntityResult.RailMarineReceiptCompartmentDetailPlanList.forEach((item) => {
                                if (item.IsTransloading === true)
                                    compCodes.push(item.CompartmentSeqNoInVehicle)
                            })
                        }
                        let modRailMarineTransactionCommonInfo = lodash.cloneDeep(this.state.modRailMarineTransactionCommonInfo);

                        modRailMarineTransactionCommonInfo.CompartmentSeqNoInVehicle = '';
                        if (compCodes.length === 1) {
                            modRailMarineTransactionCommonInfo.CompartmentSeqNoInVehicle = compCodes[0];
                        }
                        this.setState({ marineReceiptCompCodes: Utilities.transferListtoOptions(compCodes), marineReceipt: result.EntityResult, modRailMarineTransactionCommonInfo })
                    }
                    else {
                        this.setState({ marineReceiptCompCodes: [], marineReceipt: {} })
                    }
                }
                else {
                    this.setState({ marineReceiptCompCodes: [], marineReceipt: {} })
                }
            })
            .catch((error) => {
                console.log("Error while getting marineReceipt:", error);
            });
    }

    fillAttributeDetails() {
        try {
            let attributeList = lodash.cloneDeep(this.state.selectedAttributeList);
            let modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(
                this.state.modTruckManualEntryLoadingFPInfo
            );
            let modTruckManualEntryLoadingBPInfo = lodash.cloneDeep(this.state.modTruckManualEntryLoadingBPInfo)
            modTruckManualEntryLoadingFPInfo.Attributes = [];
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
                modTruckManualEntryLoadingFPInfo.Attributes.push(attribute);
            });
            modTruckManualEntryLoadingBPInfo.forEach((baseProduct) => {

            })

            this.setState({ modTruckManualEntryLoadingFPInfo });
            return modTruckManualEntryLoadingFPInfo;
        } catch (error) {
            console.log(
                "TrailerDetailsComposite:Error occured on fillAttributeDetails",
                error
            );
        }
    }

    fillBPAttributeDetails(modTruckManualEntryLoadingBPInfo) {
        // let BPCode = Object.keys(railMarineBaseProductInfo);
        // BPCode.forEach((code) => {
        //     try {
        //         let attributeList = lodash.cloneDeep(
        //             this.state.BPselectedAttributeList[code]
        //         );
        //         railMarineBaseProductInfo[code].Attributes = [];
        //         attributeList.forEach((comp) => {
        //             let attribute = {
        //                 ListOfAttributeData: [],
        //             };
        //             attribute.TerminalCode = comp.TerminalCode;
        //             comp.attributeMetaDataList.forEach((det) => {
        //                 attribute.ListOfAttributeData.push({
        //                     AttributeCode: det.Code,
        //                     AttributeValue: det.DefaultValue,
        //                 });
        //             });
        //             railMarineBaseProductInfo[code].Attributes.push(attribute);
        //         });
        //         this.setState({ railMarineBaseProductInfo });
        //         return railMarineBaseProductInfo;
        //     } catch (error) {
        //         console.log(
        //             "MarineReceiptManualEntryDetails:Error occured on fillFPAttributeDetails",
        //             error
        //         );
        //     }
        // });
    }

    GetRailTransloadableReceipts() {
        axios(
            RestAPIs.GetRailTransloadableReceipts,
            Utilities.getAuthenticationObjectforGet(
                this.props.tokenDetails.tokenInfo
            )
        )
            .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    this.setState({ receiptCodes: Utilities.transferListtoOptions(result.EntityResult) });
                } else {
                    this.setState({ receiptCodes: [] });
                    console.log(
                        "Error in GetRailTransloadableReceipts:",
                        result.ErrorList
                    );
                }
            })
            .catch((error) => {
                this.setState({ receiptCodes: [] });
                console.log("Error while GetRailTransloadableReceipts:", error);
            });
    }

    getMarineTransloadableReceipts() {
        axios(
            RestAPIs.GetMarineTransloadableReceipts,
            Utilities.getAuthenticationObjectforGet(
                this.props.tokenDetails.tokenInfo
            )
        )
            .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    this.setState(
                        { receiptCodes: Utilities.transferListtoOptions(result.EntityResult) }
                    );
                } else {
                    this.setState({ receiptCodes: [] })
                    console.log(
                        "Error in GetMarineTransloadableReceipts:",
                        result.ErrorList
                    );
                }
            })
            .catch((error) => {
                console.log("Error while geting GetMarineTransloadableReceipts:", error);
            });
    }

    addLoadingDetails = () => {
        try {
          this.setState({ manualEntrySaveEnable: false });
          let tempLoadingDetails = lodash.cloneDeep(this.state.tempLoadingDetails);
          this.CreateManualEntry(tempLoadingDetails);
        } catch (error) {
          console.log("Truck Loading DetailsComposite : Error in saveVessel");
        }
      };

    handleSave = () => {
        try {
          //  this.setState({ manualEntrySaveEnable: false });
            let modTruckManualEntryLoadingFPInfo = this.fillAttributeDetails();
            //this.fillBPAttributeDetails(this.state.railMarineBaseProductInfo);
            let LoadingDetailsInfoDetails = this.fillManualEntryDetails(modTruckManualEntryLoadingFPInfo)
            if (this.validateSave()) {
                
                
                let showAuthenticationLayout =
                this.props.userDetails.EntityResult.IsWebPortalUser !== true
                  ? true
                  : false;
              let tempLoadingDetails = lodash.cloneDeep(LoadingDetailsInfoDetails);
              this.setState({ showAuthenticationLayout, tempLoadingDetails }, () => {
                if (showAuthenticationLayout === false) {
                  this.addLoadingDetails();
                }
            });


            } else {
                this.setState({ manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnSBC), showAuthenticationLayout:false,  });
            }
        } catch (error) {
            console.log(
                "MarineShipmentDetailsComposite:Error occured on handleSave",
                error
            );
        }
    };

    validateSave() {
        try {
            const {
                modTruckManualEntryLoadingDetailsCommonInfo,
                modTruckManualEntryLoadingFPInfo,
                modTruckManualEntryLoadingBPInfo,
                modTruckManualEntryLoadingAdvInfo,
                currentCompTopUpReq,
                modRailMarineTransactionCommonInfo
            } = this.state;

            const validationErrors = lodash.cloneDeep(this.state.validationErrors);
            const validationErrorsForFP = lodash.cloneDeep(this.state.validationErrorsForFP);
            const validationErrorsForBP = lodash.cloneDeep(
                this.state.validationErrorsForBP
            );

            let BPCode = Object.keys(modTruckManualEntryLoadingBPInfo);
            let AdvCode = Object.keys(modTruckManualEntryLoadingAdvInfo);

            let isWeightBased = currentCompTopUpReq !== undefined && currentCompTopUpReq.IsWeightBased !== "0" ? true : false;



            Object.keys(truckShipmentManualEntryProdValidationDef).forEach(function (key) {
                validationErrorsForFP[key] = Utilities.validateField(
                    truckShipmentManualEntryProdValidationDef[key],
                    modTruckManualEntryLoadingFPInfo[key]
                );
            });

            if (isWeightBased) {
                if (modTruckManualEntryLoadingFPInfo && modTruckManualEntryLoadingFPInfo.ProductDensity === "") {
                    validationErrorsForFP["ProductDensity"] = "LoadingDetailsEntry_MandatoryDensity";
                }
                if (modTruckManualEntryLoadingFPInfo && modTruckManualEntryLoadingFPInfo.ProductDensityUOM === "") {
                    validationErrorsForFP["ProductDensityUOM"] = "LoadingDetailsEntry_MandatoryDensityUOM";
                }
            }

            Object.keys(truckShipmentManualEntryCommonValidationDef).forEach(function (key) {
                validationErrors[key] = Utilities.validateField(
                    truckShipmentManualEntryCommonValidationDef[key],
                    modTruckManualEntryLoadingDetailsCommonInfo[key]
                );
            });

            let bcuTransload = this.state.isBCUTransload;
            let transloadSource = this.state.transloadSource;

            Object.keys(truckShipmentManualEntryCommonValidationDef).forEach(function (key) {
                if (key === "ReceiptCode" || key === "MarineReceiptCompCode" || key === "TrailerCode") {
                    validationErrors[key] = "";

                    if (bcuTransload) {
                        if (transloadSource === "RAIL") {
                            if (key === "ReceiptCode" && modRailMarineTransactionCommonInfo[key] === "")
                                validationErrors[key] = "Rail_Receipt_SelectReceipt"
                            if (key === "TrailerCode" && modRailMarineTransactionCommonInfo[key] === "")
                                validationErrors[key] = "RailDispatchWagonAssignment_RailWagonEmpty"
                        }
                        if (transloadSource === "MARINE") {
                            if (key === "ReceiptCode" && modRailMarineTransactionCommonInfo[key] === "")
                                validationErrors[key] = "MARINE_RECEIPT_EMPTY_X"
                            if (key === "MarineReceiptCompCode" && modRailMarineTransactionCommonInfo.CompartmentSeqNoInVehicle === "")
                                validationErrors[key] = "MarineReceiptManualEntry_MandatoryCompartmentSeqno"
                        }
                    }
                }
            });

            this.state.productList.map((item, index) => {
                Object.keys(truckShipmentManualEntryProdValidationDef).forEach(function (
                    key
                ) {

                    if (item.baseProductCode) {

                        let advIndex = modTruckManualEntryLoadingAdvInfo.findIndex(
                            (adv) =>
                                adv.AdditiveProductCode === item.code
                        )

                        validationErrorsForBP[index][key] = Utilities.validateField(
                            truckShipmentManualEntryProdValidationDef[key],
                            modTruckManualEntryLoadingAdvInfo[advIndex][key]
                        );

                        if (isWeightBased) {
                            if (modTruckManualEntryLoadingAdvInfo && modTruckManualEntryLoadingAdvInfo[advIndex].ProductDensity === "") {
                                validationErrorsForBP[index]["ProductDensity"] = "LoadingDetailsEntry_MandatoryDensity";
                            }
                            if (modTruckManualEntryLoadingAdvInfo && modTruckManualEntryLoadingAdvInfo[advIndex].ProductDensityUOM === "") {
                                validationErrorsForBP[index]["ProductDensityUOM"] = "LoadingDetailsEntry_MandatoryDensityUOM";
                            }
                        }

                        if (modTruckManualEntryLoadingAdvInfo && modTruckManualEntryLoadingAdvInfo[advIndex].MeterCode === "") {
                            validationErrorsForBP[index]["MeterCode"] = "MeterCode_MandFiled";
                        }

                    }
                    else {

                        validationErrorsForBP[index][key] = Utilities.validateField(
                            truckShipmentManualEntryProdValidationDef[key],
                            modTruckManualEntryLoadingBPInfo[index][key]
                        );


                        if (isWeightBased) {
                            if (modTruckManualEntryLoadingBPInfo && modTruckManualEntryLoadingBPInfo[index].ProductDensity === "") {
                                validationErrorsForBP[index]["ProductDensity"] = "LoadingDetailsEntry_MandatoryDensity";
                            }
                            if (modTruckManualEntryLoadingBPInfo && modTruckManualEntryLoadingBPInfo[index].ProductDensityUOM === "") {
                                validationErrorsForBP[index]["ProductDensityUOM"] = "LoadingDetailsEntry_MandatoryDensityUOM";
                            }
                        }

                        if (modTruckManualEntryLoadingBPInfo && modTruckManualEntryLoadingBPInfo[index].MeterCode === "") {
                            validationErrorsForBP[index]["MeterCode"] = "MeterCode_MandFiled";
                        }
                    }

                });
            });


            if (
                modTruckManualEntryLoadingFPInfo.StartTime >=
                modTruckManualEntryLoadingFPInfo.EndTime
            ) {
                validationErrorsForFP["StartTime"] =
                    "MarineDispatchManualEntry_ErrorLoadTime";
            }

            this.setState({ validationErrors, validationErrorsForFP, validationErrorsForBP });

            var returnValueBase = Object.values(validationErrors).every(function (
                value
            ) {
                return value === "";
            });

            var returnValueFP = Object.values(validationErrorsForFP).every(function (
                value
            ) {
                return value === "";
            });
            var returnValueAddition = true;
            var times = 0;
            this.state.productList.map((item, index) => {
                returnValueAddition =
                    returnValueAddition &&
                    Object.values(validationErrorsForBP[index]).every(function (value) {
                        return value === "";
                    });
                if (!returnValueAddition && times === 0) {
                    times++;
                    this.setState({
                        activeIndex: index + 1,
                    });
                }
            });
            if (!returnValueFP) {
                this.setState({
                    activeIndex: 0,
                });
            }
            var attributeValidationErrors = lodash.cloneDeep(
                this.state.attributeValidationErrors
            );
            let selectedAttributeList = lodash.cloneDeep(
                this.state.selectedAttributeList
            );

            selectedAttributeList.forEach((attribute) => {
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
            this.setState({ attributeValidationErrors });

            let returnAttributeFPValue = true;
            attributeValidationErrors.forEach((x) => {
                returnAttributeFPValue = Object.values(x.attributeValidationErrors).every(
                    function (value) {
                        return value === "";
                    }
                );
            });


            if (!returnAttributeFPValue) {
                this.setState({ activeIndex: 0 });
            }

            let bpAttributeValidationErrors = lodash.cloneDeep(
                this.state.bpAttributeValidationErrors
            );
            let selectedAttributeBPList = lodash.cloneDeep(
                this.state.selectedAttributeBPList
            );

            BPCode.forEach((code) => {

                if (Array.isArray(selectedAttributeBPList) && selectedAttributeBPList.length > 0) {
                    selectedAttributeBPList[code].forEach((attribute) => {
                        bpAttributeValidationErrors[code].forEach((attributeValidation) => {

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
                }

            });

            this.setState({ bpAttributeValidationErrors });

            let attributeBPValueList = BPCode.map((code) => {
                let attributeBPValue = true;
                if (Array.isArray(bpAttributeValidationErrors) && bpAttributeValidationErrors.length > 0)
                    bpAttributeValidationErrors[code].forEach((x) => {
                        attributeBPValue = Object.values(x.attributeValidationErrors).every(
                            function (value) {
                                return value === "";
                            }
                        );
                    });
                return attributeBPValue;
            });

            let attributeErrorIndex = attributeBPValueList.findIndex((item) => {
                return item !== true;
            });

            if (attributeErrorIndex !== -1) {
                this.setState({ activeIndex: attributeErrorIndex + 1 });
            }
            let returnAttributeBPValue = attributeBPValueList.every(function (value) {
                return value === true;
            });

            let advAttributeValidationErrors = lodash.cloneDeep(
                this.state.advAttributeValidationErrors
            );
            let selectedAttributeAdvList = lodash.cloneDeep(
                this.state.selectedAttributeAdvList
            );

            AdvCode.forEach((code) => {
                if (Array.isArray(selectedAttributeAdvList) && selectedAttributeAdvList.length > 0)
                    selectedAttributeAdvList[code].forEach((attribute) => {
                        advAttributeValidationErrors[code].forEach((attributeValidation) => {
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
            });

            this.setState({ advAttributeValidationErrors });

            let attributeAdvValueList = AdvCode.map((code) => {
                let attributeBPValue = true;
                if (Array.isArray(advAttributeValidationErrors) && advAttributeValidationErrors.length > 0)
                    advAttributeValidationErrors[code].forEach((x) => {
                        attributeBPValue = Object.values(x.attributeValidationErrors).every(
                            function (value) {
                                return value === "";
                            }
                        );
                    });
                return attributeBPValue;
            });

            attributeErrorIndex = attributeAdvValueList.findIndex((item) => {
                return item !== true;
            });

            if (attributeErrorIndex !== -1) {
                this.setState({ activeIndex: attributeErrorIndex + 1 });
            }


            let returnAttributeAdvValue = attributeAdvValueList.every(function (value) {
                return value === true;
            });
            return (
                returnValueBase &&
                returnValueFP &&
                returnValueAddition &&
                returnAttributeFPValue &&
                returnAttributeBPValue &&
                returnAttributeAdvValue
            );
        }
        catch (error) {
            var notification = {
                messageType: "critical",
                message: "TruckShipment_ManualEntryCreateStatus",
                messageResultDetails: [
                    {
                        keyFields: ["MarineDispatchManualEntry_CompSeqNo"],
                        keyValues: [this.state.modTruckManualEntryLoadingDetailsCommonInfo.CompartmentSeqNoInVehicle],
                        isSuccess: false,
                        errorMessage: "ERRMSG_MANUALENTRY_CREATE",
                    },
                ],
            };

            toast(
                <ErrorBoundary>
                    <NotifyEvent notificationMessage={notification}></NotifyEvent>
                </ErrorBoundary>,
                {
                    autoClose: notification.messageType === "success" ? 10000 : false,
                }
            );
            console.log("Error in Manual Entry", error)
            return false;
        }
    }

    fillManualEntryDetails(modTruckManualEntryLoadingFPInfo) {

        let LoadingDetailsInfoDetails = {
            LoadingDetailsInfos: [],
            RailMarineUnloadingDataList: [],
            IsShipmentBonded: this.props.shipment.IsBonded,
            IsBCUTransload: this.state.isBCUTransload,
            TransloadSource: this.state.transloadSource
        }
        try {

            let LoadingDetailsInfo = {
                CommonInfo: {},
                LoadingDetailFPinfo: {},
                ArrLoadingDetailAdditive: [],
                ArrLoadingDetailBP: [],
                IsLocalLoaded: false,
                TerminalCodes: []
            }
            let { modTruckManualEntryLoadingDetailsCommonInfo,
                modTruckManualEntryLoadingBPInfo, modTruckManualEntryLoadingAdvInfo } = this.state;

            //Filling Common Info :            
            // if (modTruckManualEntryLoadingFPInfo.GrossQuantity > 0)
            //     modTruckManualEntryLoadingDetailsCommonInfo.LoadingDetailsType = Constants.LoadingDetailsType.TOPUP.toString()
            // else
            //     modTruckManualEntryLoadingDetailsCommonInfo.LoadingDetailsType = Constants.LoadingDetailsType.DECANT.toString()

            modTruckManualEntryLoadingDetailsCommonInfo.LoadingDetailsType = "MANUAL"//Constants.LoadingDetailsType.MANUAL
            modTruckManualEntryLoadingDetailsCommonInfo.ShipmentCode = this.props.shipment.ShipmentCode
            modTruckManualEntryLoadingDetailsCommonInfo.ShareHolderCode = this.props.selectedShareholder

            //Copy Common INfo from FP to BP :
            modTruckManualEntryLoadingBPInfo.forEach((BPInfo) => {
                BPInfo.StartTime = modTruckManualEntryLoadingFPInfo.StartTime;
                BPInfo.EndTime = modTruckManualEntryLoadingFPInfo.EndTime;
                BPInfo.LoadingArmCode = modTruckManualEntryLoadingFPInfo.LoadingArmCode;
                BPInfo.QuantityUOM = modTruckManualEntryLoadingFPInfo.QuantityUOM;
                if (modTruckManualEntryLoadingFPInfo.TransactionID !== "")
                    BPInfo.TransactionID = Utilities.convertStringtoDecimal(modTruckManualEntryLoadingFPInfo.TransactionID);
                BPInfo.FinishedProductCode = modTruckManualEntryLoadingFPInfo.FinishedProductCode;
            })

            //Copy Common INfo from FP to Additive :
            modTruckManualEntryLoadingAdvInfo.forEach((AdvInfo) => {
                AdvInfo.StartTime = modTruckManualEntryLoadingFPInfo.StartTime;
                AdvInfo.EndTime = modTruckManualEntryLoadingFPInfo.EndTime;
                AdvInfo.LoadingArmCode = modTruckManualEntryLoadingFPInfo.LoadingArmCode;
                AdvInfo.QuantityUOM = modTruckManualEntryLoadingFPInfo.QuantityUOM;
                if (modTruckManualEntryLoadingFPInfo.TransactionID !== "")
                    AdvInfo.TransactionID = Utilities.convertStringtoDecimal(modTruckManualEntryLoadingFPInfo.TransactionID);
                // AdvInfo.TransactionID = modTruckManualEntryLoadingFPInfo.TransactionID;
                AdvInfo.FinishedProductCode = modTruckManualEntryLoadingFPInfo.FinishedProductCode;
            })

            LoadingDetailsInfo.CommonInfo = lodash.cloneDeep(modTruckManualEntryLoadingDetailsCommonInfo);
            LoadingDetailsInfo.LoadingDetailFPinfo = lodash.cloneDeep(modTruckManualEntryLoadingFPInfo);
            LoadingDetailsInfo.ArrLoadingDetailAdditive = lodash.cloneDeep(modTruckManualEntryLoadingAdvInfo);
            LoadingDetailsInfo.ArrLoadingDetailBP = lodash.cloneDeep(modTruckManualEntryLoadingBPInfo);

            Object.keys(LoadingDetailsInfo.LoadingDetailFPinfo).forEach((key) => {
                if (
                    !(
                        key.includes("UOM") ||
                        key === "LoadingArmCode" ||
                        key === "StartTime" ||
                        key === "EndTime" ||
                        key === "FinishedProductCode" ||
                        key === "MeterCode" ||
                        key === "TankCode" ||
                        key === "Attributes" ||
                        key === "BaseProductCode" ||
                        key === "AdditiveProductCode"
                    )
                ) {
                    LoadingDetailsInfo.LoadingDetailFPinfo[key] = Utilities.convertStringtoDecimal(
                        LoadingDetailsInfo.LoadingDetailFPinfo[key]
                    );
                }
            });

            LoadingDetailsInfo.CommonInfo["CompartmentSeqNoInVehicle"] = Utilities.convertStringtoDecimal(
                LoadingDetailsInfo.CommonInfo["CompartmentSeqNoInVehicle"])

            LoadingDetailsInfo.ArrLoadingDetailBP.forEach((baseproduct) => {
                Object.keys(baseproduct).forEach((key) => {
                    if (
                        !(
                            key.includes("UOM") ||
                            key === "LoadingArmCode" ||
                            key === "StartTime" ||
                            key === "EndTime" ||
                            key === "FinishedProductCode" ||
                            key === "MeterCode" ||
                            key === "TankCode" ||
                            key === "Attributes" ||
                            key === "BaseProductCode" ||
                            key === "AdditiveProductCode"
                        )
                    ) {
                        baseproduct[
                            key
                        ] = Utilities.convertStringtoDecimal(
                            baseproduct[key]
                        );
                    }
                });
            });

            LoadingDetailsInfo.ArrLoadingDetailAdditive.forEach((advproduct) => {
                Object.keys(advproduct).forEach((key) => {
                    if (
                        !(
                            key.includes("UOM") ||
                            key === "LoadingArmCode" ||
                            key === "StartTime" ||
                            key === "EndTime" ||
                            key === "FinishedProductCode" ||
                            key === "MeterCode" ||
                            key === "TankCode" ||
                            key === "Attributes" ||
                            key === "BaseProductCode" ||
                            key === "AdditiveProductCode"
                        )
                    ) {
                        advproduct[
                            key
                        ] = Utilities.convertStringtoDecimal(
                            advproduct[key]
                        );
                    }
                });
            });
            LoadingDetailsInfoDetails.LoadingDetailsInfos.push(LoadingDetailsInfo)
            if (this.state.isBCUTransload)
                LoadingDetailsInfoDetails.RailMarineUnloadingDataList = this.formTransloadInfo(LoadingDetailsInfo);
            else
                LoadingDetailsInfoDetails.RailMarineUnloadingDataList = [];

        } catch (error) {
            console.log("TruckShipmentManualEntryDetailsComposite:Error in creating request for Manual Entry", error)
        }

        return LoadingDetailsInfoDetails;
    }

    formTransloadInfo(loadingInfo) {
        let railMarineLoadingDataList = []
        try {
            let receiptDetail = this.state.transloadSource === "RAIL" ? lodash.cloneDeep(this.state.railReceipt) : lodash.cloneDeep(this.state.marineReceipt)

            let finishedProduct = this.state.transloadSource === "RAIL" ?
                receiptDetail.RailMarineReceiptCompartmentPlanList.filter(m => { return m.TrailerCode === this.state.modRailMarineTransactionCommonInfo.TrailerCode })[0].FinishedProductCode :
                receiptDetail.RailMarineReceiptCompartmentPlanList.filter(m => { return m.CompartmentSeqNoInVehicle === this.state.modRailMarineTransactionCommonInfo.CompartmentSeqNoInVehicle })[0].FinishedProductCode;

            let carrierCompanyCode = this.state.transloadSource === "RAIL" ?
                receiptDetail.RailMarineReceiptCompartmentPlanList.filter(m => { return m.TrailerCode === this.state.modRailMarineTransactionCommonInfo.TrailerCode })[0].CarrierCompanyCode :
                receiptDetail.RailMarineReceiptCompartmentPlanList.filter(m => { return m.CompartmentSeqNoInVehicle === this.state.modRailMarineTransactionCommonInfo.CompartmentSeqNoInVehicle })[0].CarrierCompanyCode;

            this.setState({ carrierCode: carrierCompanyCode })
            let RailMarineTransactionInfo = {
                CommonInfo: {},
                TransactionFPinfo: {},
                ArrTransactionBP: [],
                ArrTransactionAdditive: [],
                IsLocalLoaded: false
            }

            // List < RailMarineTransactionInfo > loadingDataList = new List < RailMarineTransactionInfo > ();
            // RailMarineTransactionInfo transactionInfo = new RailMarineTransactionInfo();
            // RailMarineTransactionInfo.TransactionFPinfo = new RailMarineTransactionProductInfo();
            RailMarineTransactionInfo.TransactionFPinfo.GrossQuantity = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.GrossQuantity);
            RailMarineTransactionInfo.TransactionFPinfo.BaseProductCode = loadingInfo.LoadingDetailFPinfo.BaseProductCode;
            RailMarineTransactionInfo.TransactionFPinfo.NetQuantity = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.NetQuantity);
            RailMarineTransactionInfo.TransactionFPinfo.ProductDensity = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.ProductDensity);
            RailMarineTransactionInfo.TransactionFPinfo.StartTotalizer = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.StartTotalizer);
            RailMarineTransactionInfo.TransactionFPinfo.EndTotalizer = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.EndTotalizer);
            RailMarineTransactionInfo.TransactionFPinfo.NetStartTotalizer = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.NetStartTotalizer);
            RailMarineTransactionInfo.TransactionFPinfo.NetEndTotalizer = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.NetEndTotalizer);
            RailMarineTransactionInfo.TransactionFPinfo.Temperature = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.Temperature);
            RailMarineTransactionInfo.TransactionFPinfo.TemperatureUOM = loadingInfo.LoadingDetailFPinfo.TemperatureUOM;
            RailMarineTransactionInfo.TransactionFPinfo.ProductDensityUOM = loadingInfo.LoadingDetailFPinfo.TemperatureUOM;
            RailMarineTransactionInfo.TransactionFPinfo.MeterCode = loadingInfo.LoadingDetailFPinfo.MeterCode;
            RailMarineTransactionInfo.TransactionFPinfo.CalculatedGross = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.CalculatedGross);
            RailMarineTransactionInfo.TransactionFPinfo.CalculatedNet = Utilities.convertStringtoDecimal(loadingInfo.LoadingDetailFPinfo.CalculatedNet);
            RailMarineTransactionInfo.TransactionFPinfo.CalculatedValueUOM = loadingInfo.LoadingDetailFPinfo.CalculatedValueUOM;
            RailMarineTransactionInfo.TransactionFPinfo.FinishedProductCode = finishedProduct;
            RailMarineTransactionInfo.TransactionFPinfo.QuantityUOM = loadingInfo.LoadingDetailFPinfo.QuantityUOM;
            RailMarineTransactionInfo.TransactionFPinfo.StartTime = loadingInfo.LoadingDetailFPinfo.StartTime;
            RailMarineTransactionInfo.TransactionFPinfo.EndTime = loadingInfo.LoadingDetailFPinfo.EndTime;

            //loadingDataList.Add(transactionInfo);

            // RailMarineTransactionProductInfo ldpdinfo = new RailMarineTransactionProductInfo();
            RailMarineTransactionInfo.ArrTransactionBP.push(
                {
                    GrossQuantity: loadingInfo.ArrLoadingDetailBP[0].GrossQuantity,
                    BaseProductCode: loadingInfo.ArrLoadingDetailBP[0].BaseProductCode,
                    NetQuantity: loadingInfo.ArrLoadingDetailBP[0].NetQuantity,
                    ProductDensity: loadingInfo.ArrLoadingDetailBP[0].ProductDensity,
                    StartTotalizer: loadingInfo.ArrLoadingDetailBP[0].StartTotalizer,
                    EndTotalizer: loadingInfo.ArrLoadingDetailBP[0].EndTotalizer,
                    NetStartTotalizer: loadingInfo.ArrLoadingDetailBP[0].NetStartTotalizer,
                    NetEndTotalizer: loadingInfo.ArrLoadingDetailBP[0].NetEndTotalizer,
                    Temperature: loadingInfo.ArrLoadingDetailBP[0].Temperature,
                    TemperatureUOM: loadingInfo.ArrLoadingDetailBP[0].TemperatureUOM,
                    ProductDensityUOM: loadingInfo.ArrLoadingDetailBP[0].TemperatureUOM,
                    MeterCode: loadingInfo.ArrLoadingDetailBP[0].MeterCode,
                    CalculatedGross: loadingInfo.ArrLoadingDetailBP[0].CalculatedGross,
                    CalculatedNet: loadingInfo.ArrLoadingDetailBP[0].CalculatedNet,
                    CalculatedValueUOM: loadingInfo.ArrLoadingDetailBP[0].CalculatedValueUOM,
                    StartTime: loadingInfo.LoadingDetailFPinfo.StartTime,
                    EndTime: loadingInfo.LoadingDetailFPinfo.EndTime,
                    ArmCode: loadingInfo.LoadingDetailFPinfo.LoadingArmCode,
                    QuantityUOM: loadingInfo.LoadingDetailFPinfo.QuantityUOM,
                    TransactionID: loadingInfo.LoadingDetailFPinfo.TransactionID,
                    FinishedProductCode: finishedProduct,
                    // transactionInfo.ArrTransactionBP = new List < RailMarineTransactionProductInfo > ();

                    // transactionInfo.ArrTransactionBP.Add(ldpdinfo);
                })

            RailMarineTransactionInfo.ArrTransactionBP.forEach((BpProd) => {
                Object.keys(BpProd).forEach((key) => {
                    if (
                        !(
                            key.includes("UOM") ||
                            key === "ArmCode" ||
                            key === "StartTime" ||
                            key === "EndTime" ||
                            key === "FinishedProductCode" ||
                            key === "MeterCode" ||
                            key === "TankCode" ||
                            key === "Attributes" ||
                            key === "BaseProductCode" ||
                            key === "AdditiveProductCode"
                        )
                    ) {
                        BpProd[
                            key
                        ] = Utilities.convertStringtoDecimal(
                            BpProd[key]
                        );
                    }
                });
            });

            // RailMarineTransactionInfo.CommonInfo = new RailMarineTransactionCommonInfo();
            // transactionInfo.IsLocalLoaded = false;

            RailMarineTransactionInfo.CommonInfo = this.state.modRailMarineTransactionCommonInfo

            RailMarineTransactionInfo.CommonInfo.LoadingType = "MANUAL";
            RailMarineTransactionInfo.CommonInfo.TransactionType = "RECEIPT";
            RailMarineTransactionInfo.CommonInfo.TransportationType = this.state.transloadSource === "RAIL" ? Constants.TransportationType.RAIL.toString() : Constants.TransportationType.MARINE.toString();
            RailMarineTransactionInfo.CommonInfo.BayCode = loadingInfo.CommonInfo.BayCode
            RailMarineTransactionInfo.CommonInfo.BCUCode = loadingInfo.CommonInfo.BCUCode
            //RailMarineTransactionInfo.CommonInfo.ReceiptCode = txtRailRecipt.Text;
            //RailMarineTransactionInfo.CommonInfo.TrailerCode = ddlWagonCode.SelectedItem.Text;
            // if (txtTransactionNumber.Text.Trim().Length > 0)
            RailMarineTransactionInfo.TransactionFPinfo.TransactionID = loadingInfo.LoadingDetailFPinfo.TransactionID
            RailMarineTransactionInfo.TransactionFPinfo.Remarks = loadingInfo.LoadingDetailFPinfo.Remarks;
            RailMarineTransactionInfo.CommonInfo.CarrierCode = carrierCompanyCode;
            RailMarineTransactionInfo.TransactionFPinfo.ArmCode = loadingInfo.LoadingDetailFPinfo.LoadingArmCode;

            railMarineLoadingDataList.push(RailMarineTransactionInfo);
        }
        catch (error) {
            console.log("Error in forming transloadingInfo", error)
        }
        return railMarineLoadingDataList;
    }

    CreateManualEntry(LoadingDetailsInfoDetails) {
        var keyCode = [
            {
                key: KeyCodes.shipmentCode,
                value: this.props.shipment.ShipmentCode,
            },
            {
                key: KeyCodes.finishedProductCode,
                value: this.state.modTruckManualEntryLoadingFPInfo.FinishedProductCode,
            },
            {
                key: KeyCodes.compartmentSeqNoInVehicle,
                value: this.state.modTruckManualEntryLoadingDetailsCommonInfo.CompartmentSeqNoInVehicle,
            },
            {
                key: KeyCodes.shareholderCode,
                value: this.props.selectedShareholder,
            },
        ];

        if (this.state.isBCUTransload)
            if (this.state.transloadSource === "MARINE") {
                keyCode.push({
                    key: KeyCodes.marineReceiptCode,
                    value: this.state.modRailMarineTransactionCommonInfo.ReceiptCode,
                })
                keyCode.push({
                    key: KeyCodes.compartmentCode,
                    value: this.state.modRailMarineTransactionCommonInfo.CompartmentSeqNoInVehicle,
                })
            }
            else {
                keyCode.push({
                    key: KeyCodes.railReceiptCode,
                    value: this.state.modRailMarineTransactionCommonInfo.ReceiptCode,
                })
                keyCode.push({
                    key: KeyCodes.wagonCode,
                    value: this.state.modRailMarineTransactionCommonInfo.TrailerCode,
                })
                keyCode.push({
                    key: KeyCodes.carrierCode,
                    value: this.state.carrierCode,
                })
            }

        var notification = {
            messageType: "critical",
            message: "TruckShipment_ManualEntryCreateStatus",
            messageResultDetails: [
                {
                    keyFields: ["MarineDispatchManualEntry_CompSeqNo"],
                    keyValues: [this.state.modTruckManualEntryLoadingDetailsCommonInfo.CompartmentSeqNoInVehicle],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };
        var obj = {
            ShareHolderCode: this.props.selectedShareholder,
            keyDataCode: KeyCodes.shipmentCode,
            KeyCodes: keyCode,
            Entity: LoadingDetailsInfoDetails,
        };
        axios(
            RestAPIs.TruckCreateManualEntry,
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
                    if (result.ErrorList.length > 0 && result.ErrorList[0] !== "")
                        this.setState({ manualEntrySaveEnable: false, isComminglingAlert: true,showAuthenticationLayout:false }, () => this.getCompartmentSeqNo(true));
                    else
                        this.setState({ manualEntrySaveEnable: false,showAuthenticationLayout:false }, () => this.getCompartmentSeqNo(true));
                } else {
                    notification.message = "MarineDispatchManualEntry_SaveFailure";
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({ manualEntrySaveEnable : Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnSBC), showAuthenticationLayout:false, });
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
                this.setState({ showAuthenticationLayout:false });
                notification.messageResultDetails[0].errorMessage = error;
                console.log("TruckShipmentManualEntryDetailsComposite: Error while creating Manual Entry:", error);
            });
    }

    handleTabChange = (index) => {
        this.setState({
            activeIndex: index
        });
    };

    handleDateTextChange = (propertyName, value, error) => {
        try {
            var validationErrorsForFP = lodash.cloneDeep(this.state.validationErrors);
            var modTruckManualEntryLoadingFPInfo = lodash.cloneDeep(
                this.state.modTruckManualEntryLoadingFPInfo
            );
            validationErrorsForFP[propertyName] = error;
            modTruckManualEntryLoadingFPInfo[propertyName] = value;
            this.setState({ validationErrorsForFP, modTruckManualEntryLoadingFPInfo });
        } catch (error) {
            console.log(
                "TruckShipmentManualEntryDetailsComposite:Error occured on handleDateTextChange",
                error
            );
        }
    };

    handleAttributeCellDataEditFP = (attribute, value) => {
        try {
            attribute.DefaultValue = value;
            this.setState({
                attribute: attribute
            })
            const attributeValidationErrors = lodash.cloneDeep(this.state.attributeValidationErrors);

            attributeValidationErrors.forEach((attributeValidation) => {
                if (attributeValidation.TerminalCode === attribute.TerminalCode) {
                    attributeValidation.attributeValidationErrors[attribute.Code] = Utilities.valiateAttributeField(attribute, value);
                }
            })
            this.setState({ attributeValidationErrors });

        }
        catch (error) {
            console.log(
                "TruckShipmentManualEntryDetailsComposite:Error occured on handleAttributeCellDataEditFP",
                error
            );
        }
    }

    ComminglingAlert = () => {
        return (
            <TranslationConsumer>
                {(t) => (
                    <Modal open={this.state.isComminglingAlert} size="small">
                        <Modal.Content>
                            <div className="col col-lg-12">
                                <h5>{t("LoadingDetailsEntry_ComminglingError").replace("{0}", this.props.selectedShareholder).replace("{1}", this.state.modTruckManualEntryLoadingFPInfo.TankCode)}</h5>
                            </div>
                        </Modal.Content>
                        <Modal.Footer>
                            <Button
                                type="primary"
                                content={t("AccessCardInfo_Ok")}
                                onClick={() => {
                                    this.setState({ isComminglingAlert: false });
                                }}
                            />
                        </Modal.Footer>
                    </Modal>
                )}
            </TranslationConsumer>
        );
    };


    handleAttributeCellDataEditBPandAdditive = (attribute, value) => {
        try {
            attribute.DefaultValue = value;
            this.setState({
                attribute: attribute
            })
            const attributeValidationErrors = lodash.cloneDeep(this.state.attributeValidationErrors);

            attributeValidationErrors.forEach((attributeValidation) => {
                if (attributeValidation.TerminalCode === attribute.TerminalCode) {
                    attributeValidation.attributeValidationErrors[attribute.Code] = Utilities.valiateAttributeField(attribute, value);
                }
            })
            this.setState({ attributeValidationErrors });

        }
        catch (error) {
            console.log(
                "TruckShipmentManualEntryDetailsComposite:Error occured on handleAttributeCellDataEditFP",
                error
            );
        }
    }

    handleAuthenticationClose = () => {
        this.setState({
          showAuthenticationLayout: false,
        });
      };

    render() {
        const listOptions = {
            compartmentSeqNoInVehicleList: this.state.compartmentSeqNoInVehicleList,
            quantityUOMOptions: this.state.quantityUOMOptions,
            densityUOMS: this.state.densityUOMS,
            temperatureUOMs: this.state.temperatureUOMs,
            calcValueUOM: this.state.calcValueUOM,
            LoadingArms: this.state.LoadingArms,
            Bays: this.state.Bays,
            BCUs: this.state.BCUs,
            meterCodes: this.state.meterCodes,
            tankCodes: this.state.tankCodes,
            wagonCodes: this.state.wagonCodes,
            receiptCodes: this.state.receiptCodes,
            marineReceiptCompCodes: this.state.marineReceiptCompCodes
        };
        return (
            <div>
                <ErrorBoundary>
                    <TruckShipmentManualEntryDetails
                        onFieldChange={this.handleChange}
                        onTabChange={this.handleTabChange}
                        listOptions={listOptions}
                        productList={this.state.productList}
                        modTruckManualEntryLoadingDetailsCommonInfo={this.state.modTruckManualEntryLoadingDetailsCommonInfo}
                        modTruckManualEntryLoadingFPInfo={this.state.modTruckManualEntryLoadingFPInfo}
                        modTruckManualEntryLoadingBPInfo={this.state.modTruckManualEntryLoadingBPInfo}
                        modTruckManualEntryLoadingAdvInfo={this.state.modTruckManualEntryLoadingAdvInfo}
                        modRailMarineTransactionCommonInfo={this.state.modRailMarineTransactionCommonInfo}
                        validationErrors={this.state.validationErrors}
                        validationErrorsForFP={this.state.validationErrorsForFP}
                        validationErrorsForBP={this.state.validationErrorsForBP}
                        selectedAttributeList={this.state.selectedAttributeList}
                        attributeValidationErrors={this.state.attributeValidationErrors}
                        selectedAttributeBPList={this.state.selectedAttributeBPList}
                        bpAttributeValidationErrors={this.state.bpAttributeValidationErrors}
                        selectedAttributeAdvList={this.state.selectedAttributeAdvList}
                        advAttributeValidationErrors={this.state.advAttributeValidationErrors}
                        onDateTextChange={this.handleDateTextChange}
                        currentCompTopUpReq={this.state.currentCompTopUpReq}
                        handleAttributeCellDataEdit={this.handleAttributeCellDataEditFP}
                        handleAttributeCellDataEditBPandAdditive={this.handleAttributeCellDataEditBPandAdditive}
                        activeIndex={this.state.activeIndex}
                        isBCUTransload={this.state.isBCUTransload}
                        transloadSource={this.state.transloadSource}
                        QuantityUOM={this.props.shipment.ShipmentQuantityUOM}
                    // railReceipts={this.state.railReceipts}
                    // marineReceipts={this.state.marineReceipts}
                    // defaultUOMS={this.props.userDetails.EntityResult.PageAttibutes}
                    ></TruckShipmentManualEntryDetails>
                </ErrorBoundary>
                <ErrorBoundary>
                    <TMDetailsUserActions
                        handleBack={this.props.handleBack}
                        handleSave={this.handleSave}
                        handleReset={this.handleReset}
                        saveEnabled={this.state.manualEntrySaveEnable}
                    ></TMDetailsUserActions>
                </ErrorBoundary>
                {this.state.isComminglingAlert ? this.ComminglingAlert() : null}
                {this.state.showAuthenticationLayout ? (
                    <UserAuthenticationLayout
                        Username={this.props.userDetails.EntityResult.UserName}
                        functionName={functionGroups.add}
                        functionGroup={fnLoadingDetails}
                        handleOperation={this.addLoadingDetails}
                        handleClose={this.handleAuthenticationClose}
                    ></UserAuthenticationLayout>
                    ) : null}
            </div>);
    }
}



const mapStateToProps = (state) => {
    return {
        userDetails: state.getUserDetails.userDetails,
        tokenDetails: state.getUserDetails.TokenAuth,
    };
};

export default connect(mapStateToProps)(
    TruckShipmentManualEntryDetailsComposite
);

TruckShipmentManualEntryDetailsComposite.propTypes = {
    handleBack: PropTypes.func.isRequired,
    shipment: PropTypes.object.isRequired,
    selectedShareholder: PropTypes.string.isRequired,
};


