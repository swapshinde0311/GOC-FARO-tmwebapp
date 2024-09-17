import React from "react";
import { Select, Input, Checkbox, Icon, DatePicker } from "@scuf/common";
import PropTypes from "prop-types";
// import ErrorBoundary from "../../ErrorBoundary";
import * as Utilities from "../../../JS/Utilities";
import { DataTable } from "@scuf/datatable";
import {
    getCurrentDateFormat,
    handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
import { useTranslation } from "@scuf/localization";
import * as Constants from "../../../JS/Constants";

ShareholderAllocationDetails.propTypes = {
    allocation: PropTypes.object.isRequired,
    modAllocation: PropTypes.object.isRequired,
    modAllocationItems: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        ShareholderList: PropTypes.array,
        finishedProductOptions: PropTypes.array,
        allocationTypeandFrequencies: PropTypes.object,
        UOMOptions: PropTypes.array,
        customerOptions: PropTypes.array,
        CarrierCompanyOptions: PropTypes.array
    }).isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    handleCellDataEdit: PropTypes.func.isRequired,
    handleAddAssociation: PropTypes.func.isRequired,
    handleDeleteAssociation: PropTypes.func.isRequired,
    handleViewItems: PropTypes.func.isRequired,
    handleViewShipments: PropTypes.func.isRequired,
    selectedAssociations: PropTypes.array.isRequired,
    handleRowSelectionChange: PropTypes.func.isRequired,
    onDateTextChange: PropTypes.func.isRequired,
    handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
    compartmentDetailsPageSize: PropTypes.number.isRequired,
    expandedRows: PropTypes.array.isRequired,
    toggleExpand: PropTypes.func.isRequired,
    allocationType: PropTypes.string.isRequired
}

ShareholderAllocationDetails.defaultProps = {
    listOptions: {
        ShareholderList: [],
        finishedProductOptions: [],
        allocationTypeandFrequencies: {},
        UOMOptions: []
    }
}

export function ShareholderAllocationDetails({
    allocation,
    modAllocation,
    modAllocationItems,
    validationErrors,
    onFieldChange,
    listOptions,
    handleCellDataEdit,
    handleAddAssociation,
    handleDeleteAssociation,
    handleViewItems,
    handleViewShipments,
    selectedAssociations,
    handleRowSelectionChange,
    onDateTextChange,
    expandedRows,
    toggleExpand,
    compartmentDetailsPageSize,
    handleCompAttributeCellDataEdit,
    allocationType
}) {
    const [t] = useTranslation();

    const dateDisplayValues = (cellData) => {
        const { value } = cellData;
        return value !== null ? new Date(value).toLocaleDateString() : "";
    };

    const expanderTemplate = (data) => {
        const open =
            expandedRows.findIndex((x) => x.SeqNumber === data.rowData.SeqNumber) >= 0
                ? true
                : false;
        return (
            <div
                onClick={() => toggleExpand(data.rowData, open)}
                className="compartmentIcon gridButtonFontColor"
            >
                <span>{open ? t("Hide_Attributes") : t("View_Attributes")}</span>
                <Icon
                    root="common"
                    name={open ? "caret-up" : "caret-down"}
                    className="margin_l10"
                />
            </div>
        );
    };

    const handleAttributeType = (data) => {
        //;
        const attribute = data.rowData;
        const handleAttributeDateValue = (dateval) => {
            var chars = dateval.split("-");
            return new Date(chars[0], chars[1] - 1, chars[2]);
        };
        const convertAttributeDatetoString = (attribute, value) => {
            var Dateval = new Date(value);
            value =
                Dateval.getFullYear() +
                "-" +
                ("0" + (Dateval.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + Dateval.getDate()).slice(-2);
            handleCompAttributeCellDataEdit(attribute, value);
        };
        try {
            return attribute.DataType.toLowerCase() ===
                Constants.DataType.STRING.toLowerCase() ? (
                <Input
                    fluid
                    value={attribute.AttributeValue}
                    disabled={attribute.IsReadonly}
                    onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
                    reserveSpace={false}
                />
            ) : attribute.DataType.toLowerCase() ===
                Constants.DataType.INT.toLowerCase() ? (
                <Input
                    fluid
                    value={attribute.AttributeValue}
                    disabled={attribute.IsReadonly}
                    onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
                    reserveSpace={false}
                />
            ) : attribute.DataType.toLowerCase() ===
                Constants.DataType.FLOAT.toLowerCase() ||
                attribute.DataType.toLowerCase() ===
                Constants.DataType.LONG.toLowerCase() ||
                attribute.DataType.toLowerCase() ===
                Constants.DataType.DOUBLE.toLowerCase() ? (
                <Input
                    fluid
                    value={
                        attribute.AttributeValue === null ||
                            attribute.AttributeValue === undefined ||
                            attribute.AttributeValue === ""
                            ? ""
                            : attribute.AttributeValue.toLocaleString()
                    }
                    disabled={attribute.IsReadonly}
                    onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
                    reserveSpace={false}
                />
            ) : attribute.DataType.toLowerCase() ===
                Constants.DataType.BOOL.toLowerCase() ? (
                <Checkbox
                    checked={
                        attribute.AttributeValue.toString().toLowerCase() === "true"
                            ? true
                            : false
                    }
                    disabled={attribute.IsReadonly}
                    onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
                ></Checkbox>
            ) : attribute.DataType.toLowerCase() ===
                Constants.DataType.DATETIME.toLowerCase() ? (
                <DatePicker
                    fluid
                    value={
                        attribute.AttributeValue === null ||
                            attribute.AttributeValue === undefined ||
                            attribute.AttributeValue === ""
                            ? ""
                            : handleAttributeDateValue(attribute.AttributeValue)
                    }
                    disabled={attribute.IsReadonly}
                    showYearSelector="true"
                    onChange={(value) => convertAttributeDatetoString(data, value)}
                    onTextChange={(value) => {
                        convertAttributeDatetoString(data, value);
                    }}
                    reserveSpace={false}
                />
            ) : null;
        } catch (error) {
            console.log("ShareholderAllocationDetails:Error occured on handleAttributeType", error);
        }
    };

    const handleIsRequiredCompAttributes = (data) => {
        return data.rowData.IsMandatory ? (
            <div>
                <span>{data.rowData.AttributeName}</span>
                <div class="ui red circular empty label badge  circle-padding" />
            </div>
        ) : (
            <div>
                <span>{data.rowData.AttributeName}</span>
            </div>
        );
    };

    function rowExpansionTemplate(data) {
        return Array.isArray(data.AttributesforUI) &&
            data.AttributesforUI.length > 0 ? (
            <div className="childTable ChildGridViewAllShipmentLoadingDetails">
                <DataTable
                    data={data.AttributesforUI}
                    rows={compartmentDetailsPageSize}
                >
                    <DataTable.Column
                        className="compColHeight"
                        key="AttributeName"
                        header={t("CompartmentAttributeName")}
                        renderer={handleIsRequiredCompAttributes}
                        editable={false}
                    ></DataTable.Column>
                    <DataTable.Column
                        className="compColHeight"
                        header={t("CompartmentAttributeValue")}
                        renderer={handleAttributeType}
                    />
                    {Array.isArray(data.AttributesforUI) &&
                        data.AttributesforUI.length > compartmentDetailsPageSize ? (
                        <DataTable.Pagination />
                    ) : (
                        ""
                    )}
                </DataTable>
            </div>
        ) : (
            <div className="compartmentIcon">
                <div className="gridButtonAlignLeft">
                    {t("CustomerInventory_NoRecordsFound")}
                </div>
            </div>
        );
    }

    const handleCustomEditDateSelect = (cellData) => {
        return (
            <DatePicker
                fluid
                value={
                    modAllocationItems[cellData.rowIndex][
                        cellData.field
                    ] === null
                        ? ""
                        : new Date(
                            modAllocationItems[cellData.rowIndex][
                            cellData.field
                            ]
                        )
                }
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
    };

    const decimalDisplayValues = (cellData) => {
        const { value } = cellData;
        if (typeof value === "number") {
            return value.toLocaleString();
        } else {
            return value;
        }
    };

    const handleAllocationTypesEditDropDown = (cellData) => {

        let allocationTypeOptions = [];
        if (
            listOptions.allocationTypeandFrequencies !== undefined &&
            listOptions.allocationTypeandFrequencies !== null
        ) {
            Object.keys(listOptions.allocationTypeandFrequencies).forEach((allocationType) =>
                allocationTypeOptions.push({ text: allocationType, value: allocationType })
            );
        }
        return handleCustomEditDropDown(cellData, allocationTypeOptions);
    };
    const handleAllocationFreqEditDropDown = (cellData) => {
        let allocationFreqOptions = [];
        if (
            listOptions.allocationTypeandFrequencies !== undefined &&
            listOptions.allocationTypeandFrequencies !== null
        ) {
            if (
                listOptions.allocationTypeandFrequencies[
                cellData.rowData.AllocationType
                ] !== undefined &&
                Array.isArray(
                    listOptions.allocationTypeandFrequencies[cellData.rowData.AllocationType]
                )
            ) {
                listOptions.allocationTypeandFrequencies[
                    cellData.rowData.AllocationType
                ].forEach((frequency) =>
                    allocationFreqOptions.push({
                        text: frequency.Code,
                        value: frequency.Code
                    })
                );
            }
        }
        return handleCustomEditDropDown(cellData, allocationFreqOptions);
    };

    const handleCustomEditDropDown = (cellData, dropDownoptions) => {
        return (
            cellData.field === "Active" && cellData.rowData.NewlyAdded ?
                null :
                <Select
                    className="selectDropwdown"
                    value={modAllocationItems[cellData.rowIndex][cellData.field]}
                    fluid
                    options={dropDownoptions}
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
                value={modAllocationItems[cellData.rowIndex][cellData.field] !== null
                    && modAllocationItems[cellData.rowIndex][cellData.field] !== undefined
                    ? modAllocationItems[cellData.rowIndex][cellData.field].toLocaleString()
                    : modAllocationItems[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
                disabled={cellData.field === "BlockedQuantity" || cellData.field === "LoadedQuantity"}
            />
        );
    };

    return (
        <div className="detailsContainer">
            <div className="row">
                {
                    allocationType === Constants.AllocationEntityType.CUSTOMER ?
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("ShipmentCompDetail_CustomerCode")}
                                value={modAllocation.EntityCode}
                                options={listOptions.customerOptions}
                                indicator="required"
                                disabled={allocation.EntityCode !== ""}
                                onChange={(data) => onFieldChange("EntityCode", data)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.EntityCode)}
                            />
                        </div>
                        : allocationType === Constants.AllocationEntityType.CARRIERCOMPANY ?
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("ShipmentContractList_CarrierCompany")}
                                    value={modAllocation.EntityCode}
                                    options={Utilities.transferListtoOptions(
                                        listOptions.CarrierCompanyOptions
                                    )}
                                    indicator="required"
                                    disabled={allocation.EntityCode !== ""}
                                    onChange={(data) => onFieldChange("EntityCode", data)}
                                    reserveSpace={false}
                                    search={true}
                                    noResultsMessage={t("noResultsMessage")}
                                    error={t(validationErrors.EntityCode)}
                                />
                            </div> :
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("ShipmentContractList_ShareHolder")}
                                    value={modAllocation.ShareholderCode}
                                    options={Utilities.transferListtoOptions(
                                        listOptions.ShareholderList
                                    )}
                                    indicator="required"
                                    disabled={allocation.ShareholderCode !== ""}
                                    onChange={(data) => onFieldChange("ShareholderCode", data)}
                                    reserveSpace={false}
                                    search={true}
                                    noResultsMessage={t("noResultsMessage")}
                                    error={t(validationErrors.ShareholderCode)}
                                />
                            </div>
                }
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={
                            modAllocation.Description === null ? "" : modAllocation.Description
                        }
                        onChange={(data) => onFieldChange("Description", data)}
                        label={t("Supplier_Description")}
                        error={t(validationErrors.Description)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="PAIconContainer">
                        <div onClick={handleViewItems} className="PAIcon">
                            {/* <div style={{ marginLeft: "32%" }}>
                                <Icon root="common" name="adjustments" size="medium" />
                            </div> */}
                            <div>
                                <h5 className="font14">{t("PA_ButViewDetail")}</h5>
                            </div>
                        </div>
                        <div onClick={handleViewShipments} className="PAIcon margin_l30">
                            {/* <div style={{ marginLeft: "32%" }}>
                                <Icon root="common" name="adjustments" size="medium" />
                            </div> */}
                            <div>
                                <h5 className="font14">{t("PA_ButShipmentViewDetail")}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row compartmentRow">
                <div className="col col-md-8 col-lg-9 col col-xl-9">
                    {allocationType === Constants.AllocationEntityType.SHAREHOLDER
                        ?
                        <h4>{t("ShareholderAllocationInfo_Details")}</h4>
                        : <h4>{(t("ProductAllocationInfo_Details"))}</h4>
                    }
                </div>
                <div className="col col-md-4 col-lg-3 col-xl-3">
                    <div className="compartmentIconContainer">
                        <div onClick={handleAddAssociation} className="compartmentIcon">
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
            </div>
            <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable PAItems">
                    <DataTable
                        data={modAllocationItems}
                        scrollable={true}
                        scrollHeight="320px"
                        selectionMode="multiple"
                        selection={selectedAssociations}
                        onSelectionChange={handleRowSelectionChange}
                        rowExpansionTemplate={rowExpansionTemplate}
                        expandedRows={expandedRows}
                    >
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="FinishedProductCode"
                            field="FinishedProductCode"
                            header={handleIsRequiredCompartmentCell(
                                t("ContractInfo_Product"))}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            // renderer={handleCustomEditTextBox}
                            customEditRenderer={(celldata) =>
                                handleCustomEditDropDown(
                                    celldata,
                                    listOptions.finishedProductOptions
                                )
                            }
                        ></DataTable.Column>

                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="AllocationType"
                            field="AllocationType"
                            header={handleIsRequiredCompartmentCell(
                                t("ProductAllocationItemInfo_AllocationType"))}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            // renderer={handleCustomEditTextBox}
                            customEditRenderer={(celldata) =>
                                handleAllocationTypesEditDropDown(
                                    celldata
                                )
                            }
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="AllocationPeriod"
                            field="AllocationPeriod"
                            header={handleIsRequiredCompartmentCell(
                                t("ProductAllocationItemInfo_AllocationFrequency")
                            )} //{t("Trailer_CompCapacity")}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            // renderer={handleCustomEditTextBox}
                            customEditRenderer={(celldata) =>
                                handleAllocationFreqEditDropDown(
                                    celldata
                                )
                            }
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="StartDate"
                            field="StartDate"
                            header={handleIsRequiredCompartmentCell(t("ContractInfo_StartDate"))}
                            editable={true}
                            // rowHeader={true}
                            renderer={(cellData) => dateDisplayValues(cellData)}
                            customEditRenderer={(cellData) =>
                                handleCustomEditDateSelect(cellData)
                            }
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="EndDate"
                            field="EndDate"
                            header={handleIsRequiredCompartmentCell(t("ContractInfo_EndDate"))}
                            editable={true}
                            // rowHeader={true}
                            renderer={(cellData) => dateDisplayValues(cellData)}
                            customEditRenderer={(cellData) =>
                                handleCustomEditDateSelect(cellData)
                            }
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="Quantity"
                            field="Quantity"
                            header={handleIsRequiredCompartmentCell(t("ProductAllocationItemInfo_AllocatedQty"))}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            renderer={(cellData) => decimalDisplayValues(cellData)}
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth disabledCell"
                            key="BlockedQuantity"
                            field="BlockedQuantity"
                            header={t("ProductAllocationItemInfo_BlockedQty")}
                            editable={false}
                            // rowHeader={true}
                            editFieldType="text"
                            renderer={(cellData) => decimalDisplayValues(cellData)}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth disabledCell"
                            key="LoadedQuantity"
                            field="LoadedQuantity"
                            header={t("ProductAllocationItemInfo_LoadedQty")}
                            editable={false}
                            // rowHeader={true}
                            editFieldType="text"
                            renderer={(cellData) => decimalDisplayValues(cellData)}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminPAWidth"
                            key="QuantityUOM"
                            field="QuantityUOM"
                            header={handleIsRequiredCompartmentCell(t("ViewShipment_UOM"))}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            // renderer={handleCustomEditTextBox}
                            customEditRenderer={(celldata) =>
                                handleCustomEditDropDown(
                                    celldata,
                                    listOptions.UOMOptions
                                )
                            }
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminPAWidth"
                            key="Active"
                            field="Active"
                            header={t("ProductAllocationItemInfo_Active")}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            // renderer={handleCustomEditTextBox}
                            customEditRenderer={(celldata) =>
                                handleCustomEditDropDown(
                                    celldata,
                                    Constants.PAActiveStatuses
                                )
                            }
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="DeviationPercentOfQty"
                            field="DeviationPercentOfQty"
                            header={t("ProductAllocationItemInfo_Deviation")}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            renderer={(cellData) => decimalDisplayValues(cellData)}
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="MinimumQuantity"
                            field="MinimumQuantity"
                            header={t("ProductAllocationItemInfo_MinimumQuantity")}
                            editable={true}
                            // rowHeader={true}
                            editFieldType="text"
                            renderer={(cellData) => decimalDisplayValues(cellData)}
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="expandedColumn"
                            initialWidth="150px"
                            renderer={expanderTemplate}
                        />
                    </DataTable>
                </div>
            </div>
        </div >
    )
}

