import React from "react";
import { DataTable } from '@scuf/datatable';
import { DatePicker, Input, Select, Icon, Accordion, Tab, Checkbox } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import { getCurrentDateFormat, handleIsRequiredCompartmentCell } from "../../../JS/functionalUtilities";
import * as Utilities from "../../../JS/Utilities";
import PropTypes from "prop-types";
import { AttributeDetails } from "../Details/AttributeDetails";
PipelineReceiptDetails.propTypes = {
    dropdownOptions: PropTypes.shape({
        pipelineHeaderOptions: PropTypes.array,
        pipelineHeaderMeterOptions: PropTypes.array,
        tankCodeOptions: PropTypes.array,
        terminalCodes: PropTypes.array
    }).isRequired,
    handlePipelineHeaderChange: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    handleTerminalChange: PropTypes.func.isRequired,
    modAttributeMetaDataList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.object.isRequired,
    onAttributeDataChange: PropTypes.func.isRequired,
    onTabChange: PropTypes.func.isRequired,
    activeTab: PropTypes.number.isRequired,
    loadingDetails: PropTypes.object.isRequired,
    loadingDetailsTab: PropTypes.array.isRequired,
    pipelineSnapShotInfo: PropTypes.array.isRequired,
    handleCellCheck: PropTypes.func.isRequired,
    isMeterRequired: PropTypes.bool.isRequired,
    isTankRequired: PropTypes.bool.isRequired,
    onDateTextChange: PropTypes.func.isRequired,
}
PipelineReceiptDetails.defaultProps = {
    dropdownOptions: {
        pipelineHeaderOptions: [],
        pipelineHeaderMeterOptions: [],
        tankCodeOptions: [],
        terminalCodes: []
    },
    isEnterpriseNode: false,
}

export function PipelineReceiptDetails({
    pipelineReceipt,
    modPipelineReceipt,
    validationErrors,
    listOptions,
    onFieldChange,
    selectedAssociations,
    handleAssociationSelectionChange,
    handleCellDataEdit,
    handleAddAssociation,
    handleDeleteAssociation,
    dropdownOptions,
    handlePipelineHeaderChange,
    isEnterpriseNode,
    handleTerminalChange,
    onAttributeDataChange,
    modAttributeMetaDataList,
    attributeValidationErrors,
    onTabChange,
    activeTab,
    loadingDetails,
    loadingDetailsTab,
    pipelineSnapShotInfo,
    handleCellCheck,
    isMeterRequired,
    isTankRequired,
    onDateTextChange,
}) {
    const [t] = useTranslation();

    const handleCustomEditDropDown = (cellData, dropDownoptions) => {
        return (
            <Select
                className="selectDropwdown"
                value={modPipelineReceipt.PipelineReceiptTanks[cellData.rowIndex][cellData.field]}
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
                value={modPipelineReceipt.PipelineReceiptTanks[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };

    const handleCustomEditDateSelect = (cellData) => {
        return (
            <DatePicker
                fluid
                value={modPipelineReceipt.PipelineReceiptTanks[cellData.rowIndex][cellData.field] === null ?
                    "" : new Date(modPipelineReceipt.PipelineReceiptTanks[cellData.rowIndex][cellData.field])}
                type="datetime"
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

    const decimalDisplayValues = (cellData) => {
        const { value } = cellData;
        if (typeof value === "number") {
            return value.toLocaleString();
        } else {
            return value;
        }
    };

    const dateDisplayValues = (cellData) => {
        const { value } = cellData;
        return value !== null ? new Date(value).toLocaleDateString() + " " + new Date(value).toLocaleTimeString() : ""
    }
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find(
            (selectedAttribute) => {
                return selectedAttribute.TerminalCode === terminal;
            }
        );
        return attributeValidation.attributeValidationErrors;
    };
    const handleCheckBox = (data) => {
        return (
            <Checkbox
                className="forceCompleteChkBox"
                checked={data.value}
                onChange={(cellData) => {
                    handleCellCheck(data, cellData);
                }}
            />
        );
    };
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineReceipt.PipelineReceiptCode}
                                indicator="required"
                                disabled={pipelineReceipt.PipelineReceiptCode !== ""}
                                onChange={(data) => onFieldChange("PipelineReceiptCode", data)}
                                label={t("PipelineReceiptDetails_ReceiptCode")}
                                error={t(validationErrors.PipelineReceiptCode)}
                                reserveSpace={false}
                            />
                        </div>
                        {isEnterpriseNode ? (
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("TerminalCode")}
                                    value={
                                        modPipelineReceipt.TerminalCodes === null
                                            ? ""
                                            : modPipelineReceipt.TerminalCodes.length === 0
                                                ? ""
                                                : modPipelineReceipt.TerminalCodes[0]
                                    }
                                    disabled={pipelineReceipt.PipelineReceiptCode !== ""}
                                    onChange={(data) => handleTerminalChange(data)}
                                    indicator="required"
                                    error={t(validationErrors.TerminalCodes)}
                                    options={Utilities.transferListtoOptions(dropdownOptions.terminalCodes)}
                                    reserveSpace={false}
                                    noResultsMessage={t("noResultsMessage")}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                indicator="required"
                                label={t("PipelineReceiptDetails_CustomerCode")}
                                value={modPipelineReceipt.SupplierCode}
                                onChange={(data) => onFieldChange("SupplierCode", data)}
                                error={t(validationErrors.SupplierCode)}
                                options={listOptions.suppliers}
                                reserveSpace={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                indicator="required"
                                label={t("PipelineReceiptDetails_Destination")}
                                value={modPipelineReceipt.OriginTerminalCode}
                                onChange={(data) => onFieldChange("OriginTerminalCode", data)}
                                error={t(validationErrors.OriginTerminalCode)}
                                options={listOptions.originTerminals}
                                reserveSpace={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineReceipt.PipelineReceiptStatus === null ? "" : modPipelineReceipt.PipelineReceiptStatus}
                                label={t("PipelineReceiptDetails_ReceiptStatus")}
                                reserveSpace={false}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                indicator="required"
                                label={t("PipelineReceiptDetails_HeaderLineCode")}
                                value={modPipelineReceipt.PipelineHeaderCode}
                                onChange={(data) => handlePipelineHeaderChange(data)}
                                error={t(validationErrors.PipelineHeaderCode)}
                                options={dropdownOptions.pipelineHeaderOptions}
                                reserveSpace={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                label={t("PipelineReceiptDetails_BulkTransactionMeter")}
                                value={modPipelineReceipt.PipelineHeaderMeterCode === null ? "" : modPipelineReceipt.PipelineHeaderMeterCode}
                                onChange={(data) => onFieldChange("PipelineHeaderMeterCode", data)}
                                options={dropdownOptions.pipelineHeaderMeterOptions}
                                // error={t(validationErrors.PipelineHeaderMeterCode)}
                                reserveSpace={false}
                                indicator={isMeterRequired ? "required" : ""}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineReceipt.Quantity === null ? "" : modPipelineReceipt.Quantity}
                                indicator="required"
                                onChange={(data) => onFieldChange("Quantity", data)}
                                label={t("PipelineReceiptDetails_Quantity")}
                                error={t(validationErrors.Quantity)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <ErrorBoundary>
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("PipelineReceiptDetails_UOM")}
                                    value={modPipelineReceipt.QuantityUOM === null
                                        ? ""
                                        : modPipelineReceipt.QuantityUOM}
                                    multiple={false}
                                    indicator="required"
                                    options={listOptions.quantityUOM}
                                    onChange={(data) => onFieldChange("QuantityUOM", data)}
                                    error={t(validationErrors.QuantityUOM)}
                                    disabled={listOptions.quantityUOM.length === 0}
                                    reserveSpace={false}
                                    noResultsMessage={t("noResultsMessage")}
                                />
                            </ErrorBoundary>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                indicator="required"
                                label={t("PipelineReceiptDetails_FinishedProductCode")}
                                value={modPipelineReceipt.FinishedProductCode}
                                onChange={(data) => onFieldChange("FinishedProductCode", data)}
                                error={t(validationErrors.FinishedProductCode)}
                                options={listOptions.finishedProducts}
                                reserveSpace={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 starttime">
                            <DatePicker
                                fluid
                                value={modPipelineReceipt.ScheduledStartTime === null ?
                                    "" : new Date(modPipelineReceipt.ScheduledStartTime)}
                                label={t("PipelineReceiptDetails_ExpectedStartTime")}
                                type="datetime"
                                displayFormat={getCurrentDateFormat()}
                                disablePast={false}
                                indicator="required"
                                onChange={(data) => onFieldChange("ScheduledStartTime", data)}
                                error={t(validationErrors.ScheduledStartTime)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 ">
                            <DatePicker
                                fluid
                                value={modPipelineReceipt.ScheduledEndTime === null ?
                                    "" : new Date(modPipelineReceipt.ScheduledEndTime)}
                                label={t("PipelineReceiptDetails_ExpectedEndTime")}
                                type="datetime"
                                displayFormat={getCurrentDateFormat()}
                                disablePast={false}
                                indicator="required"
                                onChange={(data) => onFieldChange("ScheduledEndTime", data)}
                                error={t(validationErrors.ScheduledEndTime)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineReceipt.Remarks}
                                label={t("Cust_Remarks")}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                error={t(validationErrors.Remarks)}
                                reserveSpace={false}
                            />
                        </div>
                    </div>
                    {modAttributeMetaDataList.length > 0
                        ? modAttributeMetaDataList.map((attire) => (
                            <ErrorBoundary>
                                <Accordion>
                                    <Accordion.Content
                                        className="attributeAccordian"
                                        title={
                                            isEnterpriseNode
                                                ? attire.TerminalCode + " - " + t("Attributes_Header")
                                                : t("Attributes_Header")
                                        }
                                    >
                                        <AttributeDetails
                                            selectedAttributeList={attire.attributeMetaDataList}
                                            handleCellDataEdit={onAttributeDataChange}
                                            attributeValidationErrors={handleValidationErrorFilter(
                                                attributeValidationErrors,
                                                attire.TerminalCode
                                            )}
                                        ></AttributeDetails>
                                    </Accordion.Content>
                                </Accordion>
                            </ErrorBoundary>
                        ))
                        : null}
                    <div className="shipmentTabAlignment">
                        <Tab
                            activeIndex={activeTab}
                            onTabChange={(activeIndex) => {
                                onTabChange(activeIndex);
                            }}
                        >
                            <Tab.Pane title={t("PipelineReceiptDetails_ReceiptTankPlanning")}>
                                <div className="row compartmentRow">
                                    <div className="col">
                                        <div className="compartmentIconContainer">
                                            <div onClick={handleAddAssociation} className="compartmentIcon">
                                                <div>
                                                    <Icon root="common" name="badge-plus" size="medium" />
                                                </div>
                                                <div className="margin_l10">
                                                    <h5 className="font14">{t("FinishedProductInfo_Add")}</h5>
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
                                                    <h5 className="font14">{t("DestAdd_Delete")}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row marginRightZero tableScroll">
                                    <div className="col-12 detailsTable">
                                        <DataTable
                                            data={modPipelineReceipt.PipelineReceiptTanks}
                                            selectionMode="multiple"
                                            selection={selectedAssociations}
                                            onSelectionChange={handleAssociationSelectionChange}
                                        >
                                            <DataTable.Column
                                                className="compColHeight colminWidth"
                                                key="TankCode"
                                                field="TankCode"
                                                header={isTankRequired ? handleIsRequiredCompartmentCell(
                                                    t("PipelineReceipt_TankCode")) : t("PipelineReceipt_TankCode")}
                                                editable={true}
                                                editFieldType="text"
                                                customEditRenderer={(celldata) =>
                                                    handleCustomEditDropDown(
                                                        celldata,
                                                        dropdownOptions.tankCodeOptions
                                                    )
                                                }
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight colminWidth"
                                                key="Quantity"
                                                field="Quantity"
                                                header={t("PipelineReceiptDetails_Quantity")}
                                                editable={true}
                                                editFieldType="text"
                                                renderer={(cellData) => decimalDisplayValues(cellData)}
                                                customEditRenderer={handleCustomEditTextBox}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight colminWidth"
                                                key="PlannedStartTime"
                                                field="PlannedStartTime"
                                                header={t("PipelineReceiptDetails_ExpectedStartTime")}
                                                editable={true}
                                                editFieldType="text"
                                                renderer={(cellData) => dateDisplayValues(cellData)}
                                                customEditRenderer={(cellData) => handleCustomEditDateSelect(cellData)}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight colminWidth"
                                                key="PlannedEndTime"
                                                field="PlannedEndTime"
                                                header={t("PipelineReceiptDetails_ExpectedEndTime")}
                                                editable={true}
                                                editFieldType="text"
                                                renderer={(cellData) => dateDisplayValues(cellData)}
                                                customEditRenderer={(cellData) => handleCustomEditDateSelect(cellData)}
                                            ></DataTable.Column>
                                        </DataTable>
                                    </div>
                                </div>
                            </Tab.Pane>
                            {loadingDetailsTab.map((index) => {
                                return (
                                    <Tab.Pane title={t("ViewReceipt_LoadingDetails")}>
                                        <Accordion>
                                            <Accordion.Content title={t("PipelineDispatchDetails_TransactionSummary")}>
                                                {" "}
                                                <div className="row marginRightZero tableScroll">
                                                    <div className="col-12 detailsTable">
                                                        <DataTable
                                                            data={pipelineSnapShotInfo}
                                                            scrollable={true}
                                                            scrollHeight="320px"
                                                        >
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="ReceivedGrossQuantity"
                                                                field="ReceivedGrossQuantity"
                                                                header={t("PipelineDispatchTransaction_ActualGrossQuantity")}
                                                                editable={false}
                                                                editFieldType="text"
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="ReceivedNetQuantity"
                                                                field="ReceivedNetQuantity"
                                                                header={t("PipelineDispatchTransaction_ActualNetQuantity")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="RationPending"
                                                                field="RationPending"
                                                                header={t("PipelineDispatchTransaction_RationPending")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="ReceivedQuantityUOM"
                                                                field="ReceivedQuantityUOM"
                                                                header={t("PipelineDispatchTransaction_ActualQuantityUOM")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="PlannedStartTime"
                                                                field="PlannedStartTime"
                                                                header={t("PipelineDispatchTransaction_ExpectedStartDateTime")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="PlannedEndTime"
                                                                field="PlannedEndTime"
                                                                header={t("PipelineDispatchTransaction_ExpectedEndDateTime")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="ActualStartTime"
                                                                field="ActualStartTime"
                                                                header={t("PipelineDispatchTransaction_ActualStartDateTime")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight"
                                                                key="ActualEndTime"
                                                                field="ActualEndTime"
                                                                header={t("PipelineDispatchTransaction_ActualEndDateTime")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="IsInvalid"
                                                                field="IsInvalid"
                                                                header={t("PipelineDispatchTransaction_Ignore")}
                                                                renderer={handleCheckBox}
                                                            ></DataTable.Column>
                                                        </DataTable>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col col-lg-4"></div>
                                                </div>
                                            </Accordion.Content>
                                        </Accordion>
                                        <Accordion>
                                            <Accordion.Content title={t("PipelineDispatchDetails_TankTransactionSummary")}>
                                                {" "}
                                                <div className="row marginRightZero tableScroll">
                                                    <div className="col-12 detailsTable">
                                                        <DataTable
                                                            data={loadingDetails.Table2}
                                                            scrollable={true}
                                                            scrollHeight="320px"
                                                        >
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="TankCode"
                                                                field="TankCode"
                                                                header={t("PipelineReceipt_TankCode")}
                                                                editable={false}
                                                                editFieldType="text"
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="StartGrossVolume"
                                                                field="StartGrossVolume"
                                                                header={t("TankTransaction_StartGrossVolume")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="EndGrossVolume"
                                                                field="EndGrossVolume"
                                                                header={t("TankVolume_EndGrossVolume")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="StartNetVolume"
                                                                field="StartNetVolume"
                                                                header={t("TankTransaction_StartNetVolume")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="EndNetVolume"
                                                                field="EndNetVolume"
                                                                header={t("TankVolume_EndNetVolume")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="Density"
                                                                field="Density"
                                                                header={t("PipelineEntry_Density")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="Temperature"
                                                                field="Temperature"
                                                                header={t("PipelineEntry_Temparature")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                        </DataTable>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col col-lg-4"></div>
                                                </div>
                                            </Accordion.Content >
                                        </Accordion>
                                        <Accordion>
                                            <Accordion.Content title={t("PipelineDispatchDetails_MeterTransactionSummary")}>
                                                {" "}
                                                <div className="row marginRightZero tableScroll">
                                                    <div className="col-12 detailsTable">
                                                        <DataTable
                                                            data={loadingDetails.Table1}
                                                            scrollable={true}
                                                            scrollHeight="320px"
                                                        >
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="MeterCode"
                                                                field="MeterCode"
                                                                header={t("LoadingDetails_MeterCode")}
                                                                editable={false}
                                                                editFieldType="text"
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="StartGrossTotalizer"
                                                                field="StartGrossTotalizer"
                                                                header={t("Reconciliation_StartGrossTotalizer")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="EndGrossTotalizer"
                                                                field="EndGrossTotalizer"
                                                                header={t("End Gross Totalizer")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="StartNetTotalizer"
                                                                field="StartNetTotalizer"
                                                                header={t("Start Net Totalizer")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="EndNetTotalizer"
                                                                field="EndNetTotalizer"
                                                                header={t("End Net Totalizer")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="Density"
                                                                field="Density"
                                                                header={t("PipelineEntry_Density")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                            <DataTable.Column
                                                                className="compColHeight colminWidth"
                                                                key="Temperature"
                                                                field="Temperature"
                                                                header={t("PipelineEntry_Temparature")}
                                                                editable={false}
                                                            ></DataTable.Column>
                                                        </DataTable>
                                                    </div>
                                                </div>

                                            </Accordion.Content>
                                        </Accordion>
                                    </Tab.Pane>
                                )
                            })}

                        </Tab>
                    </div>
                </div>
            )}
        </TranslationConsumer>
    );
}