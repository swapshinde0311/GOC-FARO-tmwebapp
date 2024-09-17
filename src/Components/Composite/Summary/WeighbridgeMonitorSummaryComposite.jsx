import React from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import { Icon, Input,  Button, Checkbox } from "@scuf/common";
import PropTypes from "prop-types";
WeighbridgeMonitorSummaryPageComposite.propTypes = {
    tableData: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    modWeighbridgeData: PropTypes.object.isRequired,
    WeightStabledata: PropTypes.object.isRequired,
    isDetails: PropTypes.bool.isRequired,
    AllowEnableButton: PropTypes.bool.isRequired,
    manualEntryWeight: PropTypes.bool.isRequired,
    handleAllowclick: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    saveEnabled: PropTypes.bool.isRequired,
    locationCode: PropTypes.string.isRequired,
};
export function WeighbridgeMonitorSummaryPageComposite({
    tableData,
    pageSize,
    onRowClick,
    modWeighbridgeData,
    handleSave,
    onFieldChange,
    handleRefresh,
    validationErrors,
    WeightStabledata,
    AllowEnableButton,
    manualEntryWeight,
    handleAllowclick,
    saveEnabled,
    locationCode


}) {
    const [t] = useTranslation();
    function displayValues(cellData) {
        const { value, field } = cellData;
        if (typeof value === "boolean" || field === "Active") {
            if (value) return <Icon name="check" size="small" color="green" />;
            else return <Icon name="close" size="small" color="red" />;
        } else if (value === "" || value === null || value === undefined) {
            return value;
        }
    }
    console.log(locationCode)
    return (
        <div>
        <div className="row marginRightZero tableScroll">
            <div className="col-12 detailsTable" >
                <DataTable
                    data={tableData}
                    search={true}
                    onCellClick={(data) =>
                        onRowClick !== undefined ? onRowClick(data) : {}
                    }
                >
                    <DataTable.ActionBar />
                    <DataTable.Column
                        className="compColHeight colminWidth "
                        key="code"
                        field="code"
                        sortable={true}
                        header={t("WB_Code")}
                    ></DataTable.Column>

                    <DataTable.Column
                        className="compColHeight colminWidth"
                        key="WeightUOM"
                        field="WeightUOM"
                        header={t("WB_UOM")}
                    ></DataTable.Column>
                    <DataTable.Column
                        className="compColHeight colminWidth"
                        key="Locationcode"
                        field="Locationcode"
                        header={t("WB_LocationCode")}
                    ></DataTable.Column>
                    <DataTable.Column
                        className="compColHeight colminWidth "
                        key="Active"
                        field="Active"
                        header={t("NotificationGroup_Status")}
                        renderer={(cellData) => displayValues(cellData)}
                    ></DataTable.Column>
                    {Array.isArray(tableData) && tableData.length > pageSize ? (
                        <DataTable.Pagination />
                    ) : (
                        ""
                    )}
                </DataTable>
            </div>
            </div>
        <div className="detailsContainer" style={{ marginTop: "1rem" }}>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                        value={modWeighbridgeData.Code}
                        label={t("WB_Code")}
                        disabled={true}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                            value={locationCode}
                        label={t("WB_LocationCode")}
                        disabled={true}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                            value={modWeighbridgeData.WeightUOM}
                            label={t("WB_UOM")}
                            disabled={true}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                            value={WeightStabledata.WeightValue}
                            label={t("WB_Value")}
                            disabled={true}
                        reserveSpace={false}
                    />
                </div>
               
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                         value={modWeighbridgeData.Active}
                        label={t("Fp_Status")}
                        disabled={true}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                            value={modWeighbridgeData.LastUpdatedTime}
                            label={t("Loadingarm_LastUpDt")}
                            disabled={true}
                            reserveSpace={false}
                    />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4" >
                        <Input
                            fluid
                            value={modWeighbridgeData.Weight}
                            indicator="required"
                            onChange={(data) => onFieldChange("Weight", data)}
                            label={t("WB_ManualEntry")}
                            disabled={!manualEntryWeight}
                            error={t(validationErrors.Weight)}
                            reserveSpace={false}
                        />
                    </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div
                                className="ui single-input fluid disabled"
                                style={{ width: "30%", float: "left" }}
                            >
                                <div class="ui input-label">
                                    <span className="input-label-message">
                                    {t("WeighBridge_IsAuto")}
                                    </span>
                                </div>
                                <div className="input-wrap">
                                    <Checkbox
                                    onChange={(data) => onFieldChange("IsAuto", data)}
                                    checked={modWeighbridgeData.IsAuto}
                                    disabled={true}
                                    />
                                </div>
                                </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <div
                            className="ui single-input fluid disabled"
                            style={{ width: "30%", float: "left" }}
                        >
                            <div class="ui input-label">
                                <span className="input-label-message">
                                    {t("WB_WtStable")}
                                </span>
                            </div>
                            <div className="input-wrap">
                                <Checkbox
                                    onChange={(data) => onFieldChange("WeightStable", data)}
                                    checked={WeightStabledata.WeightStable==="True"}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-12 col-md-3 col-lg-4">
                        <Button
                            onClick={handleRefresh}
                            disabled={!AllowEnableButton}
                            content={t("WB_Refresh")}
                        ></Button>
                    </div>
                    <div className="col-12 col-md-9 col-lg-8">
                        <div style={{ float: "right" }}>
                            <Button
                                content={t("SARecordWeight_AllowManualEntry")}
                                disabled={!AllowEnableButton}
                                onClick={handleAllowclick}
                            ></Button>
                            <Button
                                content={t("WeighBridge_Save")}
                                disabled={!saveEnabled}
                                onClick={handleSave}
                            ></Button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    );
}
