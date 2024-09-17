import React, { useState } from "react";
import {
    Select,
    Icon,
    Input,
    DatePicker,
    Tab,
    Checkbox,
    Accordion,
    Button,
    Modal,
} from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { constant, truncate } from "lodash";
import * as Constants from "../../../JS/Constants";
import { AttributeDetails } from "../Details/AttributeDetails";
import { getCurrentDateFormat, handleIsRequiredCompartmentCell } from "../../../JS/functionalUtilities";
ProductTransferAgreementDetails.propTypes = {
    selectedShareholder: PropTypes.array.isRequired,
    isBonded: PropTypes.bool.isRequired,
    modExchangeAgrement: PropTypes.object.isRequired,
    exchangeAgreement:PropTypes.object.isRequired,
    modProductAgreementItem: PropTypes.array.isRequired,
    listOptions: PropTypes.shape({
        shareholders: PropTypes.array,
        baseProductOptions: PropTypes.array,
        UOMOptions: PropTypes.array,
        tankCodeOptions: PropTypes.array,
        currentShareholderAgreementStatusList:PropTypes.array
    }).isRequired,
    handleViewAuditTrail: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    UpdateProductTransferAgreementStatus: PropTypes.func.isRequired,
    handleCreateAgrement:PropTypes.func.isRequired,
 selectedAttributeList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    handleCellAttrinuteDataEdit: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    btnCreatePTAgreement: PropTypes.bool.isRequired,
    btnFroceClose: PropTypes.bool.isRequired,
    btncompltAgreement: PropTypes.bool.isRequired,
    tankShareholderDetails: PropTypes.object.isRequired,
    handleAssociationSelectionChange: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    selectedAssociations: PropTypes.array.isRequired,
    isfieldEnable: PropTypes.bool.isRequired,
}
ProductTransferAgreementDetails.defaultProps = {
    listOptions: {
        shareholders: [],
        UOMOptions: [],
        tankCodeOptions: [],
        currentShareholderAgreementStatusList:[]

    },
    isEnterpriseNode: false
}
export default function ProductTransferAgreementDetails({
    isBonded,
    modProductAgreementItem,
    modExchangeAgrement,
    onFieldChange,
    listOptions,
    validationErrors,
    handleViewAuditTrail,
    exchangeAgreement,
    UpdateProductTransferAgreementStatus,
    selectedAttributeList,
    attributeValidationErrors,
    handleCellAttrinuteDataEdit,
    isEnterpriseNode,
    selectedShareholder,
    btnCreatePTAgreement,
    tankShareholderDetails,
    handleAssociationSelectionChange,
    selectedAssociations,
    btnFroceClose,
    btncompltAgreement,
    isfieldEnable,
    handleCreateAgrement
 }) {
    const [t] = useTranslation();
    console.log(tankShareholderDetails)
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }
    return (
    <div className="detailsContainer">
        <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
                <Input
                    fluid
                        label={t("ProductTransferAgreementDetails_RequestCode")}
                        value={modExchangeAgrement.RequestCode !== "" ? modExchangeAgrement.RequestCode : ""}
                        indicator="required"
                        onChange={(data) => onFieldChange("RequestCode", data)}
                        disabled={exchangeAgreement.RequestCode !== ""}
                        reserveSpace={false}
                        error={t(validationErrors.RequestCode)}
                />
                </div>
                {modExchangeAgrement.LenderShareholderCode === selectedShareholder || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.OFFER_REJECTED? <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modExchangeAgrement.RequestStatus == null ? "" : modExchangeAgrement.RequestStatus}
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("ProductTransferAgreementDetails_Status")}
                        options={listOptions.currentShareholderAgreementStatusList}
                        onChange={(data) => onFieldChange("RequestStatus", data)}
                        indicator="required"   >
                        </Select>
                </div>:<div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        // placeholder={t("FinishedProductInfo_Select")}
                        value={modExchangeAgrement.RequestStatus == null ? "" : modExchangeAgrement.RequestStatus}
                        label={t("ProductTransferAgreementDetails_Status")}
                        disabled={true}
                    />
                </div>}
           
                
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        // placeholder={t("FinishedProductInfo_Select")}
                        value={modExchangeAgrement.RequestType === "" ? Constants.AgrementType.PRODUCT_TRANSFER_AGREEMENT : modExchangeAgrement.RequestType}
                        label={t("ProductTransferAgreementDetails_RequestType")}
                        disabled={true}
                        
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modExchangeAgrement.LenderShareholderCode}
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("ProductTransferAgreementDetails_PreferredShareHolder")}
                        options={listOptions.shareholders}
                        onChange={(data) => onFieldChange("LenderShareholderCode", data)}
                        indicator="required" 
                        disabled={exchangeAgreement.RequestCode !== ""}


                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modProductAgreementItem.RequestorTankCode}
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("ProductTransferAgreementDetails_RequestorTankcode")}
                        options={listOptions.tankCodeOptions}
                        onChange={(data) => onFieldChange("RequestorTankCode", data)}
                        indicator="required"
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modProductAgreementItem.TankBaseProductCode}
                        label={t("ProductTransferAgreementDetails_ProductCode")}
                        reserveSpace={false}
                        disabled={true}

                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modProductAgreementItem.RequestedQuantity}
                        label={t("ProductTransferAgreementDetails_RequestedQuantity")}
                        indicator="required"
                        reserveSpace={false}
                        onChange={(data) => onFieldChange("RequestedQuantity", data)}

                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modProductAgreementItem.QuantityUOM}
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("ProductTransferAgreementDetails_ProductQuantityUOM")}
                        options={listOptions.UOMOptions}
                        onChange={(data) => onFieldChange("QuantityUOM", data)}
                        indicator="required"
                        error={t(validationErrors.QuantityUOM)}

                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4 planneddate">
                    <DatePicker
                        fluid
                        value={new Date(modProductAgreementItem.RequestedCutOff_Date)}
                        initialWidth="160px"
                        label={t("ProductTransferAgreementDetails_Cut-offDate")}
                        displayFormat={getCurrentDateFormat()}
                        type="date"
                        showYearSelector="true"
                        indicator="required"
                        // minuteStep={1}
                        onChange={(data) => onFieldChange("RequestedCutOff_Date", data)}
                        reserveSpace={false}

                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modExchangeAgrement.Remarks}
                        label={t("ExchangeAgreementDetails_Comments")}
                        reserveSpace={false}
                        onChange={(data) => onFieldChange("Remarks", data)}
                        indicator={exchangeAgreement.RequestCode !== "" ? "required" : ""}
                        error={t(validationErrors.Remarks)}

                    />
                </div>
                {isBonded ? (
                    <div className="col-12 col-md-6 col-lg-4 ddlSelectAll">
                        <Checkbox
                            label={t("TankInfo_Bonded")}
                        checked={modExchangeAgrement.IsBonded ? true : false}
                        onChange={(data) => onFieldChange("IsBonded", data)}
                        />
                    </div>
                ) : ("")}
                {modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.ACCEPTED || 
                    modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.REQUEST_REJECTED && modExchangeAgrement.LenderShareholderCode === selectedShareholder?
                      <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                            value={modProductAgreementItem.AcceptedQuantity}
                            label={t("ProductTransferAgreementDetails_AcceptedQuantity")}
                        indicator="required"
                        reserveSpace={false}
                            onChange={(data) => onFieldChange("AcceptedQuantity", data)}
                            error={t(validationErrors.AcceptedQuantity)}


                    />
                </div>
                    : ""}
                {modExchangeAgrement.LenderShareholderCode === selectedShareholder&&modProductAgreementItem.AcceptedQuantity !== 0 && modProductAgreementItem.AcceptedQuantity !== null && 
                    modProductAgreementItem.AcceptedQuantity !== undefined || modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Input
                            fluid
                            value={modProductAgreementItem.LenderTankCode}
                            label={t("ProductTransferAgreementDetails_LenderTankcode")}
                            indicator="required"
                            reserveSpace={false}
                            disabled={true}
                        />
                    </div> : ""}
                {isfieldEnable?
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modProductAgreementItem.ReceivedGrossQty}
                        label={t("ProductTransferAgreementDetails_ReceivedGrossQuantity")}
                        indicator="required"
                        reserveSpace={false}
                        onChange={(data) => onFieldChange("ReceivedGrossQty", data)}
                        disabled={modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED ? true : false}
                        error={t(validationErrors.ReceivedGrossQty)}

                    />
                </div>:""}
                 {isfieldEnable?
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modProductAgreementItem.ReceivedNetQty}
                        label={t("ProductTransferAgreementDetails_ReceivedNetQuantity")}
                        indicator="required"
                        reserveSpace={false}
                        onChange={(data) => onFieldChange("ReceivedNetQty", data)}
                        disabled={modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED?true:false}
                        error={t(validationErrors.ReceivedNetQty)}

                    />
                </div>:""}
                     {isfieldEnable?
                    <div className="col-12 col-md-6 col-lg-4 planneddate">
                        <DatePicker
                            fluid
                            value={new Date(modProductAgreementItem.ReceivedDate)}
                            initialWidth="160px"
                            label={t("ProductTransferAgreementDetails_CompletedDate")}
                            displayFormat={getCurrentDateFormat()}
                            type="date"
                            showYearSelector="true"
                            indicator="required"
                            // minuteStep={1}
                            onChange={(data) => onFieldChange("ReceivedDate", data)}
                            reserveSpace={false}
                            disabled={modExchangeAgrement.RequestStatus === Constants.ShareholderAgreementStatus.COMPLETED ? true : false}
                            error={t(validationErrors.ReceivedDate)}

                        />
                    </div>: ""}
                {modExchangeAgrement.LenderShareholderCode === selectedShareholder && modExchangeAgrement.RequestStatus==="ACCEPTED"?
                <div className="row col-12 detailsTable">
                        <h5>{t("ProductTransferAgreementDetails_TankShDetails")}</h5>
                        <DataTable
                            data={tankShareholderDetails}
                            selectionMode="multiple"
                            onSelectionChange={handleAssociationSelectionChange}
                            selection={selectedAssociations}
                            scrollable={true}
                            scrollHeight="320px"
                        >
                        <DataTable.Column
                            className="compColHeight"
                            key="TankCode"
                            field="TankCode"
                            header={t("AtgConfigure_TankCode")}
                            initialWidth='120px'
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="CalculatedGrossVolume"
                            field="CalculatedGrossVolume"
                            header={t("TankShareholderAssn_CalculatedGrossQuantity")}

                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="CalculatedNetVolume"
                            field="CalculatedNetVolume"
                            header={t("TankShareholderAssn_CalculatedNetQuantity")}

                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="VolumeUOM"
                            field="VolumeUOM"
                            header={t("ViewShipmentStatus_QuantityUOM")}
                            initialWidth='80px'
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="IsBonded"
                            field="IsBonded"
                            header={t("ViewShipmentStatus_ShipmentBond")}

                        ></DataTable.Column>
                        
                        
                        </DataTable>
                    </div> : ""}
                {
                    selectedAttributeList.length > 0 ?
                        selectedAttributeList.map((attribute) =>
                            <ErrorBoundary>
                                <Accordion >
                                    <Accordion.Content
                                        className="attributeAccordian"
                                        title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                    >
                                        <AttributeDetails
                                            selectedAttributeList={attribute.attributeMetaDataList}
                                            handleCellDataEdit={handleCellAttrinuteDataEdit}
                                            attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attribute.TerminalCode)}
                                        ></AttributeDetails>
                                    </Accordion.Content>
                                </Accordion>
                            </ErrorBoundary>
                        ) : null
                }
            </div>
            
            <div className="row">
                <div
                    className="col col-md-8 col-lg-9 col col-xl-12"
                    style={{ textAlign: "right" }}
                >
                    <Button
                        content={t("SharholderAgreement_ViewAuditTrail")}
                        onClick={handleViewAuditTrail}
                        disabled={exchangeAgreement.RequestCode === ""}


                    ></Button>
                    <Button
                        content={t("ProductTransferAgreementDetails_btnCompletePTA")}
                        disabled={!btncompltAgreement}
                        onClick={() => UpdateProductTransferAgreementStatus(modExchangeAgrement,"COMPLETEPTA")}
                    ></Button>
                    <Button
                        type="primary"
                        onClick={() => handleCreateAgrement("CREATEPTA")}
                        // disabled={exchangeAgreement.RequestCode === "" || exchangeAgreement.RequestStatus === "FORCE_CLOSED" || modExchangeAgrement.RequestStatus !=="ACCEPTED"&&modExchangeAgrement.LenderShareholderCode!==selectedShareholder}
                        disabled={!btnCreatePTAgreement}
                        content={t("ExchangeAgreementDetails_btnCreateAgreement")}
                    ></Button>
                    <Button
                        content={t("ExchangeAgreementDetails_btnForceClose")}
                        disabled={!btnFroceClose}
                        onClick={() => UpdateProductTransferAgreementStatus(modExchangeAgrement,"FORCECLOSED")}
                    ></Button>
                </div>
            </div>
            </div>
            );
}