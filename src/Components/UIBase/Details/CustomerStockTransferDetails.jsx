import React from "react";
import { Input, Accordion,Select,Icon } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { useTranslation } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";

CustomerStockTransferDetails.propTypes = {
    modCustomerstockTransfer:PropTypes.object.isRequired,
    CustomerAgreementItems: PropTypes.array.isRequired,
    listOptions: PropTypes.shape({
        shareholders: PropTypes.array,
        RequestercustomerOptions: PropTypes.array,
        LendercustomerOptions: PropTypes.array,
        baseProductOptions: PropTypes.array,
        quantityUOMOptions: PropTypes.array,


    }).isRequired,
    handleCellDataEdit: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    selectedAssociations: PropTypes.array.isRequired,
    handleRowSelectionChange: PropTypes.func.isRequired,
    handleAddAssociation: PropTypes.func.isRequired,
    handleDeleteAssociation: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,

}
CustomerStockTransferDetails.defaultProps = {
    listOptions: {
        quantityUOMOptions: [],
        baseProductOptions:[],
        customerOptions: [],
        LendercustomerOptions:[],
        RequestercustomerOptions: [],
        shareholders:[]
    },
};
export function CustomerStockTransferDetails({
    modCustomerstockTransfer,
    CustomerAgreementItems,
    onFieldChange,
    listOptions,
    handleCellDataEdit,
    handleDeleteAssociation,
    handleAddAssociation,
    handleRowSelectionChange,
    selectedAssociations,
validationErrors
}) {
    const [t] = useTranslation();
    const decimalDisplayValues = (cellData) => {
        const { value } = cellData;
        if (typeof value === "number") {
            return value.toLocaleString();
        } else {
            return value;
        }
    };
    const handleCustomEditDropDown = (cellData, listOptions) => {
        return (
            <Select
                className="selectDropwdown"
                value={CustomerAgreementItems[cellData.rowIndex][cellData.field]}
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
                value={CustomerAgreementItems[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    return (
        <TranslationConsumer>
            {(t, index) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modCustomerstockTransfer.Code}
                                indicator="required"
                                onChange={(data) => onFieldChange("Code", data)}
                                label={t("CustomerAgreement_TransferReferenceCode")}
                                reserveSpace={false}
                                error={t(validationErrors.Code)}

                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select"
                                indicator="required"
                                value={modCustomerstockTransfer.LenderShareholderCode}
                                label={t("ExchangeAgreementDetails_lenderShareHolder")}
                                options={listOptions.shareholders}
                                onChange={(data) => onFieldChange("LenderShareholderCode", data)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.LenderShareholderCode)}

                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                indicator="required"
                                label={t("CustomerAgreement_FromCustomerCode")}
                                value={modCustomerstockTransfer.LenderCustomerCode === null ? "" : modCustomerstockTransfer.LenderCustomerCode }
                                onChange={(data) => onFieldChange("LenderCustomerCode", data)}
                                options={listOptions.LendercustomerOptions}
                                reserveSpace={false}
                                error={t(validationErrors.LenderCustomerCode)}

                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select"
                                value={modCustomerstockTransfer.RequestorShareholderCode}
                                label={t("CustomerAgreement_ToShareholder")}
                                options={listOptions.shareholders}
                                onChange={(data) => onFieldChange("RequestorShareholderCode", data)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                                indicator="required"
                                error={t(validationErrors.RequestorShareholderCode)}

                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                indicator="required"
                                placeholder="Select"
                                label={t("CustomerAgreement_ToCustomer")}
                                value={modCustomerstockTransfer.RequestorCustomerCode === null ? "" : modCustomerstockTransfer.RequestorCustomerCode}
                                onChange={(data) => onFieldChange("RequestorCustomerCode", data)}
                                options={listOptions.RequestercustomerOptions}
                                reserveSpace={false}
                                error={t(validationErrors.RequestorCustomerCode)}

                            />
                        </div>
                    </div>

                        <div className="row compartmentRow">
                        <h3>{t("CustomerAgreement_TransferDetails")} </h3>
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
                                        data={CustomerAgreementItems}
                                        selectionMode="multiple"
                                        selection={selectedAssociations}
                                    onSelectionChange={handleRowSelectionChange}
                                        scrollable={true}
                                        scrollHeight="320px"
                                    >
                                        <DataTable.Column
                                            className="compColHeight colminWidth"
                                            key="BaseProductCode"
                                            field="BaseProductCode"
                                            header={t("ExchangeAgreementDetailsItem_Product")}
                                            editFieldType="text"
                                            editable={true}
                                            customEditRenderer={(celldata) =>
                                                handleCustomEditDropDown(
                                                    celldata,
                                                    listOptions.baseProductOptions
                                                )
                                            }

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
                                            key="QuantityUOM"
                                            field="QuantityUOM"
                                            header={t("ExchangeAgreementDetailsItem_UOM")}
                                            //rowHeader={true}
                                            editable={true}
                                            editFieldType="text"
                                        customEditRenderer={(celldata) =>
                                            handleCustomEditDropDown(
                                                celldata,
                                                listOptions.quantityUOMOptions
                                            )
                                        }
                                        ></DataTable.Column>
                                      
                                    </DataTable>
                                </div>
                            </div>

                        </div>


                        

                       
                        
                       


                </div>

            )}
        </TranslationConsumer>
    )




 }