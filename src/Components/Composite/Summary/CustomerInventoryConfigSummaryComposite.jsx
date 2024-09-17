import React, { useState } from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import {
    Icon, Input,Radio, Select,Button
} from "@scuf/common";
CustomerInventoryConfigSummaryComposite.propTypes = {
    onFieldChange: PropTypes.func.isRequired,
    customerCode: PropTypes.bool.isRequired,
    baseproductCode: PropTypes.bool.isRequired,
    modCustomerconfig:PropTypes.object.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    listOptions:PropTypes.shape({
        baseProduct: PropTypes.array,
        customerCode: PropTypes.array,
        densityUOMOptions: PropTypes.array,

    }).isRequired, 
    handleCellDataEdit: PropTypes.func.isRequired,
    CreateInitialInventory: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    saveEnabled: PropTypes.bool.isRequired
}
export default function CustomerInventoryConfigSummaryComposite({ 
    onFieldChange,
    customerCode,
    baseproductCode,
    modCustomerconfig,
    listOptions,
    handleCellDataEdit,
    CreateInitialInventory,
    handleReset,
    saveEnabled

}) {
    const handleDropdownEdit = (cellData) => {
        let dropDownOptions = [
            ...listOptions.densityUOMOptions,
        ];
        return (
            <Select
                className="selectDropwdown"
                placeholder={t("Common_Select")}
                value={modCustomerconfig[cellData.rowIndex][cellData.field]}
                fluid
                options={dropDownOptions}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                indicator="required"
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
            />
        );
    };
    const handleTextEdit = (cellData) => {
        let val = modCustomerconfig[cellData.rowIndex][cellData.field];
        if (cellData.field === "GrossAvailableQuantity" && val !== null && val !== "")
            val = val.toLocaleString();
        return (
            <Input
                fluid
                value={val}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    const [t] = useTranslation();
    return (
        <div className=" detailsContainer">
            <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
                <p>{t("SetCustInv_ConfigureBy")}</p>
                <Radio
                    label={t("CustomerDestFilterType_CustomerCode")}
                    checked={!customerCode ? false : true}
                    onChange={(data) => onFieldChange("CustomerCode", true) }
                />
                <Radio
                    label={t("BaseProductCode")}
                    checked={!baseproductCode ? false : true}
                    onChange={(data) => onFieldChange("BaseProductCode", true)}

                />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
                <Select type="text" 
                    placeholder="Select"
                        search={true}
                        indicator="required"
                        value={customerCode === true ? modCustomerconfig.CustomerCode : modCustomerconfig.BaseProductCode}
                    label={customerCode === true ? t("CustomerDestFilterType_CustomerCode") : t("BaseProductCode")}
                    options={customerCode === true ? listOptions.customerCode:listOptions.baseProduct}
                    onChange={customerCode === true ? (data) => onFieldChange("CustomerCode", data) : (data) => onFieldChange("BaseProductCode", data) }
                />
                </div>
            </div>
            <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable">
            <DataTable
                data={modCustomerconfig}
            selectionMode={false}
            scrollHeight="320px"
                >
            <DataTable.ActionBar />
                {customerCode === true ? <DataTable.Column
                    className="compColHeight Lookupdatacode"
                    key="BaseProductCode"
                    field="BaseProductCode"
                    sortable={true}
                    header={t("baseproduct")}
                ></DataTable.Column> : <DataTable.Column
                    className="compColHeight Lookupdatacode"
                        key="CustomerCode"
                        field="CustomerCode"
                    sortable={true}
                        header={t("CustomerDestFilterType_CustomerCode")}
                ></DataTable.Column>}
            <DataTable.Column
                className="compColHeight colminWidth"
                    key="GrossAvailableQuantity"
                    field="GrossAvailableQuantity"
                            header={t("ExchangeAgreementDetailsItem_Qty")}
                    editable={true}
                    editFieldType="text"
                    renderer={(cellData) =>
                        cellData.value === null ? "" : cellData.value.toLocaleString()
                    }
                    customEditRenderer={handleTextEdit}
            ></DataTable.Column>
            <DataTable.Column
                className="compColHeight colminWidth"
                    key="QuantityUOM"
                    field="QuantityUOM"
                    header={t("ExchangeAgreementDetailsItem_UOM")}
                    editable={true}
                    editFieldType="text"
                     customEditRenderer={handleDropdownEdit}
                ></DataTable.Column>
                    </DataTable>
                </div>
            </div>
            <div className="row userActionPosition">
                <div className="col-12 col-md-12 col-lg-12">
                    <div style={{ float: "right" }}>
                        <Button
                            content={t("LookUpData_btnReset")}
                            onClick={handleReset}
                            className={saveEnabled ? "cancelButton" : "disablereset"}

                        ></Button>
                        <Button
                            content={t("Save")}
                            disabled={!saveEnabled ? true : false}
                            onClick={CreateInitialInventory}
                        ></Button>
                    </div>
                </div>
            </div>
       </div>
   ) 
}