import React from "react";
import { Select, Input, Icon, Checkbox, Tab } from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import * as Utilities from "../../../JS/Utilities";

PrinterConfigurationDetails.propTypes = {
    onTabChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        locationOptions: PropTypes.array,
        printerOptions: PropTypes.array,
        allPrinterOptions: PropTypes.array,
        allAvailableReports: PropTypes.array
    }).isRequired,
    activeTab: PropTypes.number.isRequired,
    modLocationPrinterConfig: PropTypes.array.isRequired,
    modBackUpPrinterConfig: PropTypes.array.isRequired,
    handleAddBackUpConfigComp: PropTypes.func.isRequired,
    handleDeleteBackUpConfigComp: PropTypes.func.isRequired,
    selectedBackupPrinters: PropTypes.array.isRequired,
    handleBackUpPrinterSelectionChange: PropTypes.func.isRequired,
    onRowClick: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    handleCellDataEdit: PropTypes.func.isRequired,
    modReportPrinterConfig: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    selectedReports: PropTypes.array.isRequired,
    handleReportsSelectionChangeChange: PropTypes.func.isRequired,
    tab1_LocationCode: PropTypes.string.isRequired
}

export function PrinterConfigurationDetails({
    listOptions,
    onTabChange,
    activeTab,
    handleAddBackUpConfigComp,
    handleDeleteBackUpConfigComp,
    selectedBackupPrinters,
    handleBackUpPrinterSelectionChange,
    onRowClick,
    onFieldChange,
    handleCellDataEdit,
    modReportPrinterConfig,
    validationErrors,
    selectedReports,
    handleReportsSelectionChange,
    modLocationPrinterConfig,
    modBackUpPrinterConfig,
    tab1_LocationCode
}) {
    const [t] = useTranslation();

    const handleDropdownEdit = (cellData) => {
        return (
            <Select
                className="selectDropwdown"
                placeholder={t("Common_Select")}
                value={modBackUpPrinterConfig[cellData.rowIndex][cellData.field]}
                fluid
                options={Utilities.transferListtoOptions(listOptions.allPrinterOptions)}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                indicator="required"
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
            />
        );
    };
    return (
        <div className="detailsContainer">
            <Tab
                activeIndex={activeTab}
                onTabChange={(activeIndex) => {
                    onTabChange(activeIndex);
                }}
            >
                <Tab.Pane
                    title={t("PrinterConfig_ReportPrinterConfiguration")}
                >
                    <div className="row marginRightZero tableScroll">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("LocationCode")}
                                value={modReportPrinterConfig.locationCode}
                                options={Utilities.transferListtoOptions(
                                    listOptions.locationOptions)}
                                onChange={(data) => {
                                    onFieldChange("report_locationCode", data);
                                }}
                                indicator="required"
                                error={t(validationErrors.LocationCode)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("PrinterConfig_PrinterName")}
                                value={modReportPrinterConfig.printerName}
                                options={Utilities.transferListtoOptions(
                                    listOptions.printerOptions)}
                                onChange={(data) => {
                                    onFieldChange("report_printerName", data);
                                }}
                                indicator="required"
                                error={t(validationErrors.PrinterName)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                    </div>
                    <div className="row marginRightZero tableScroll">
                        <div className="">
                            <DataTable
                                data={listOptions.allAvailableReports}
                                scrollable={true}
                                scrollHeight="320px"
                                selectionMode="multiple"
                                selection={selectedReports}
                                onSelectionChange={handleReportsSelectionChange}
                            >
                                <DataTable.Column
                                    className="compColHeight colminWidth"
                                    key="ReportName"
                                    field="ReportName"
                                    header={t("PrinterList_ReportName")}
                                ></DataTable.Column>
                            </DataTable>
                        </div>
                    </div>
                </Tab.Pane>
                <Tab.Pane
                    title={t("PrinterConfig_LocationPrinterConfiguration")}
                >
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-7">
                            <DataTable
                                data={modLocationPrinterConfig}
                                // rows={compartmentDetailsPageSize}
                                onCellClick={(data) =>
                                    onRowClick !== undefined ? onRowClick(data) : {}
                                }
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="Location"
                                    field="Location"
                                    header={t("LocationCode")}
                                    editable={false}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="Printer"
                                    field="Printer"
                                    header={t("PrinterConfig_Printers")}
                                    editable={false}
                                ></DataTable.Column>
                            </DataTable>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div style={{ marginBottom: "1rem" }}>
                                <Input
                                    fluid
                                    value={tab1_LocationCode}
                                    label={t("LocationCode")}
                                    indicator="required"
                                    error={t(validationErrors.Location)}
                                    reserveSpace={false}
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <div class="ui input-label">
                                    <span className="input-label-message">
                                        {t("PrinterConfig_Printers")}
                                    </span>
                                </div>
                                {listOptions.allPrinterOptions.map((index) => {
                                    return (<div>
                                        <Checkbox
                                            label={index}
                                            checked={listOptions.printerOptions.some(printer => printer === index)}
                                            disabled={false}
                                            onChange={(check) => onFieldChange("locationPrinter", check, index)}
                                        />
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>
                </Tab.Pane>
                <Tab.Pane
                    title={t("PrinterConfig_BackupConfigHeader")}
                >
                    <div className="row compartmentRow">
                        <div className="col col-md-4 col-lg-3 col-xl-12">
                            <div className="compartmentIconContainer">
                                <div onClick={handleAddBackUpConfigComp} className="compartmentIcon">
                                    <div>
                                        <Icon root="common" name="badge-plus" size="medium" />
                                    </div>
                                    <div className="margin_l10">
                                        <h5 className="font14">{t("TrailerInfo_Add")}</h5>
                                    </div>
                                </div>

                                <div
                                    onClick={handleDeleteBackUpConfigComp}
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
                        <DataTable
                            data={modBackUpPrinterConfig}
                            scrollable={true}
                            scrollHeight="320px"
                            selectionMode="multiple"
                            selection={selectedBackupPrinters}
                            onSelectionChange={handleBackUpPrinterSelectionChange}
                        >
                            <DataTable.Column
                                className="compColHeight colminWidth"
                                key="PrimaryPrinter"
                                field="PrimaryPrinter"
                                header={t("PrinterConfig_PrinterName")}
                                editable={true}
                                // rowHeader={true}
                                editFieldType="text"
                                customEditRenderer={handleDropdownEdit}
                            ></DataTable.Column>

                            <DataTable.Column
                                className="compColHeight colminWidth"
                                key="BackupPrinter"
                                field="BackupPrinter"
                                header={t("PrinterConfig_BackupPrinter")}
                                editable={true}
                                // rowHeader={true}
                                editFieldType="text"
                                customEditRenderer={handleDropdownEdit}
                            ></DataTable.Column>
                        </DataTable>
                    </div>
                </Tab.Pane>
            </Tab>
        </div>
    )
}