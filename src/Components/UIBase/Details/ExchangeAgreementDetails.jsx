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
import * as Constants from "../../../JS/Constants";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import { getCurrentDateFormat, handleIsRequiredCompartmentCell } from "../../../JS/functionalUtilities";

ExchangeAgreementDetails.propTypes = {
    selectedShareholder: PropTypes.array.isRequired,
    isBonded: PropTypes.bool.isRequired,
    modExchangeAgrement: PropTypes.object.isRequired,
    modExchangeAgreementItems: PropTypes.array.isRequired,
    exchangeAgreement: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    selectedAssociations: PropTypes.array.isRequired,
    handleAssociationSelectionChange:PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        shareholders: PropTypes.array,
        baseProductOptions: PropTypes.array,
        UOMOptions: PropTypes.array,
        currentShareholderAgreementStatusList:PropTypes.array
    }).isRequired,
    onDateTextChange: PropTypes.func.isRequired,
    handleViewAuditTrail: PropTypes.func.isRequired,
    GetExchangeAgreementShipmentItemDetails: PropTypes.func.isRequired,
    UpdateExchangeAgreementStatus: PropTypes.func.isRequired,
    selectedAttributeList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    handleCellAttrinuteDataEdit: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    btnCreatePTAgreement: PropTypes.bool.isRequired,
    btnFroceClose: PropTypes.bool.isRequired,
}

ExchangeAgreementDetails.defaultProps = {
    listOptions: {
        shareholders: [],
        // baseProductOptions: [],
        UOMOptions: [],
        currentShareholderAgreementStatusList:[]

    },
    isEnterpriseNode: false,
    isBonded: false,

}
export  function ExchangeAgreementDetails({ 
    isBonded,
    modExchangeAgrement,
    exchangeAgreement,
    modExchangeAgreementItems,
    listOptions,
    onFieldChange,
    selectedAssociations,
    handleAssociationSelectionChange,
    handleCellDataEdit,
    handleAddAssociation,
    handleDeleteAssociation,
    onDateTextChange,
    validationErrors,
    handleViewAuditTrail,
    GetExchangeAgreementShipmentItemDetails,
    UpdateExchangeAgreementStatus,
    selectedAttributeList,
    attributeValidationErrors,
    handleCellAttrinuteDataEdit,
    isEnterpriseNode,
    selectedShareholder,
    btnCreatePTAgreement,
    btnFroceClose,

}) {
    const handleCustomEditDateSelect = (cellData) => {
        return (
            <DatePicker
                fluid
                value={modExchangeAgreementItems[cellData.rowIndex][cellData.field] === null ?
                    "" : new Date(modExchangeAgreementItems[cellData.rowIndex][cellData.field])}
                type="date"
                displayFormat={getCurrentDateFormat()}
                indicator="required"
                onChange={(value) => handleCellDataEdit(value, cellData)}
                onTextChange={(value, error) => {
                    onDateTextChange(cellData, value, error);
                }}
                reserveSpace={false}
            ></DatePicker>
        );
    }
    const handleCustomEditDropDown = (cellData, listOptions) => {
        return (
            <Select
                className="selectDropwdown"
                value={modExchangeAgreementItems[cellData.rowIndex][cellData.field]}
                fluid
                options={listOptions}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                indicator="required"
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
            />
        );
    };

    const handleCustomEditTextBox = (cellData) => {
        return (
            <Input
                fluid
                value={modExchangeAgreementItems[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    const dateDisplayValues = (cellData) => {
        const { value } = cellData;
        return value !== null ? new Date(value).toLocaleDateString() : ""
    }
    const decimalDisplayValues = (cellData) => {
        const { value } = cellData;
        if (typeof value === "number") {
            return value.toLocaleString();
        } else {
            return value;
        }
    };
    const handleDropdownEdit = (cellData) => {
        
        let dropDownOptions = [];
        if (cellData.field === "QuantityUOM") {
            dropDownOptions = [
                ...listOptions.UOMOptions,
            ];
        }
        return (
            <Select
                className="selectDropwdown"
                placeholder={t("Common_Select")}
                value={modExchangeAgreementItems[cellData.rowIndex][cellData.field]}
                fluid
                options={dropDownOptions}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                // indicator="required"
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
            />
        );
    }
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }
    const [t] = useTranslation();
    return (
        // <TranslationConsumer>
        //   {(t) => (
        <div className="detailsContainer">
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modExchangeAgrement.RequestCode !== "" ? modExchangeAgrement.RequestCode:""}
                        label={t("ExchangeAgreementDetails_RequestCode")}
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
                </div> : <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        // placeholder={t("FinishedProductInfo_Select")}
                        value={modExchangeAgrement.RequestStatus == null ? "" : modExchangeAgrement.RequestStatus}
                        label={t("ExchangeAgreementDetails_Status")}
                        disabled={true}
                    />
                </div>}
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modExchangeAgrement.LenderShareholderCode}
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("ExchangeAgreementDetails_lenderShareHolder")}
                        options={listOptions.shareholders}
                        onChange={(data) => onFieldChange("LenderShareholderCode", data)}
                        indicator="required"
                        disabled={exchangeAgreement.RequestCode !== ""}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4 planneddate">
                    <DatePicker
                        fluid
                        value={modExchangeAgrement.StartDate}
                        initialWidth="160px"
                        label={t("ExchangeAgreementDetails_StartDate")}
                        displayFormat={getCurrentDateFormat()}
                        type="date"
                        showYearSelector="true"
                        indicator="required"
                        // minuteStep={1}
                        onChange={(data) => onFieldChange("StartDate", data)}
                        // onTextChange={(value, error) => {
                        //     onDateTextChange("StartDate", value, error);
                        // }}
                        reserveSpace={false}
                        error={t(validationErrors.StartDate)}

                        
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4 planneddate">
                    <DatePicker
                        fluid
                        value={modExchangeAgrement.EndDate}
                        initialWidth="160px"
                        label={t("ExchangeAgreementDetailsItem_EndDate")}
                        displayFormat={getCurrentDateFormat()}
                        type="date"
                        showYearSelector="true"
                        indicator="required"
                        // minuteStep={1}
                        onChange={(data) => onFieldChange("EndDate", data)}
                        // onTextChange={(value, error) => {
                        //     onDateTextChange("EndDate", value, error);
                        // }}
                        reserveSpace={false}
                        error={t(validationErrors.EndDate)}


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
                            checked={modExchangeAgrement.IsBonded }
                            onChange={(data) => onFieldChange("IsBonded", data)}
                        />
                    </div>
                ) : ("")}
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
               
                   
            <div className="row compartmentRow">
                <h3>{t("ExchangeAgreementDetails_ExchangeAgreementItem")} </h3>
                            <div className="col">
                                <div className="compartmentIconContainer">
                                    <div
                                        onClick={handleAddAssociation}
                                        className="compartmentIcon"
                                    >
                                        <div>
                                            <Icon root="common" name="badge-plus" size="medium" />
                                        </div>
                                        <div className="margin_l10">
                                            <h5 className="font14">{t("TrailerInfo_Add")}</h5>
                                        </div>
                                    </div>

                                    <div
                                        onClick={handleDeleteAssociation}
                                        className="compartmentIcon margin_l30"
                                    >
                                        <div>
                                            <Icon root="common" name="delete" size="medium" />
                                        </div>
                                        <div className="margin_l10">
                                            <h5 className="font14">{t("TrailerInfo_Delete")}</h5>
                                        </div>
                                    </div>
                    </div>
                  
                            </div>
                        <div className="row marginRightZero tableScroll">
                            <div className="col-12 detailsTable">
                                <DataTable
                                    data={modExchangeAgreementItems}
                                    selectionMode="multiple"
                                    selection={selectedAssociations}
                                    onSelectionChange={handleAssociationSelectionChange}
                                    scrollable={true}
                                    scrollHeight="320px"
                                    // expandedRows={expandedRows}
                                    // rowExpansionTemplate={rowExpansionAtributeTemplate}
                                >
                                    <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="BaseProductCode"
                                        field="BaseProductCode"
                                        header={handleIsRequiredCompartmentCell(t("ExchangeAgreementDetailsItem_Product"))}
                                        editFieldType="text"
                                        editable={true}
                                        renderer={(cellData) => decimalDisplayValues(cellData)}
                                        customEditRenderer={(celldata) =>
                                            handleCustomEditDropDown(
                                                celldata,
                                                listOptions.baseProductOptions
                                            )
                                        }
                                        
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="StartDate"
                                        field="StartDate"
                                        header={handleIsRequiredCompartmentCell(t("ExchangeAgreementDetailsItem_StartDate"))}
                                        editable={true}
                                        editFieldType="text"
                                        renderer={(cellData) => dateDisplayValues(cellData)}
                                        customEditRenderer={(cellData) => handleCustomEditDateSelect(cellData)}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="EndDate"
                                        field="EndDate"
                                        header={handleIsRequiredCompartmentCell(t("ExchangeAgreementDetailsItem_EndDate"))}
                                        editFieldType="text"
                                        editable={true}
                                        renderer={(cellData) => dateDisplayValues(cellData)}
                                        customEditRenderer={(cellData) => handleCustomEditDateSelect(cellData)}
                                    ></DataTable.Column>
                                    
                                    <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="Quantity"
                                        field="Quantity"
                                        header={t("ExchangeAgreementDetailsItem_Qty")}
                                        editable={true}
                                        editFieldType="text"
                                        renderer={(cellData) => decimalDisplayValues(cellData)}
                                        customEditRenderer={handleCustomEditTextBox}
                                    ></DataTable.Column>
                                     <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="AcceptQuantity"
                                        field="AcceptQuantity"
                                        header={t("ExchangeAgreementDetailsItem_AcceptQty")}
                                        editable={false}
                                    ></DataTable.Column>
                                     <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="QuantityUOM"
                                        field="QuantityUOM"
                                        header={handleIsRequiredCompartmentCell(t("ExchangeAgreementDetailsItem_UOM"))}
                                        //rowHeader={true}
                                        editable={true}
                                        editFieldType="text"
                                        customEditRenderer={handleDropdownEdit}
                                    ></DataTable.Column>
                                     <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="ConsumedQuantity"
                                        field="ConsumedQuantity"
                                        header={t("ExchangeAgreementDetailsItem_ConsumedQty")}
                                        editable={false}
                                    ></DataTable.Column>
                                     <DataTable.Column
                                        className="compColHeight colminWidth"
                                        key="RemainingQuantity"
                                        field="RemainingQuantity"
                                        header={t("ExchangeAgreementDetailsItem_RemainQty")}
                                        editable={false}
                                    ></DataTable.Column>
                                </DataTable>
                            </div>
                        </div>
               
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
                        content={t("ExchangeAgreementDetails_ViewExagShipmentDetails")}
                        onClick={GetExchangeAgreementShipmentItemDetails}
                        disabled={exchangeAgreement.RequestCode === ""}
                    ></Button>
                    <Button
                        type="primary"
                        onClick={() => UpdateExchangeAgreementStatus("FORCECLOSED")}
                        disabled={!btnFroceClose}
                        content={t("ShipmentOrder_BtnForceClose")}
                    ></Button>
                    <Button
                        content={t("ExchangeAgreementDetails_btnCreateAgreement")}
                        onClick={() => UpdateExchangeAgreementStatus("CREATEEA") }
                        disabled={!btnCreatePTAgreement}
                    ></Button>
                </div>
            </div>
        </div>
    );
}