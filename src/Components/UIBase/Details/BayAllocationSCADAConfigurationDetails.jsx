import React from "react";
import { Input, Icon, Checkbox, Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import {
    handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
BayAllocationSCADAConfigurationDetails.propTypes = {
    bayAllocationQueueData: PropTypes.object.isRequired,
    bayAllocationPointName: PropTypes.object.isRequired,
    bayAllocationMonitoringData: PropTypes.object.isRequired,
    handleCellParameterDataEdit: PropTypes.func.isRequired,
    handleCellPointDataEdit: PropTypes.func.isRequired,
    createGenerateConfig: PropTypes.func.isRequired,
    handleBaySelectionChange: PropTypes.func.isRequired,
    selectedbays: PropTypes.array.isRequired,
    handleCellCheck: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    bayAllocationValidationErrors: PropTypes.object.isRequired,
saveEnabled:PropTypes.bool.isRequired
}
BayAllocationSCADAConfigurationDetails.defaultProps = {
    isEnterpriseNode: false,
}
export default function BayAllocationSCADAConfigurationDetails({
    bayAllocationQueueData,
    bayAllocationPointName,
    bayAllocationMonitoringData,
    handleCellParameterDataEdit,
    createGenerateConfig,
    handleCellPointDataEdit,
    handleBaySelectionChange,
    selectedbays,
    onFieldChange,
    bayAllocationValidationErrors,
    saveEnabled
}) {
    const handleEditTextBox = (cellData) => {
        return (
            <Input
                fluid
                value={bayAllocationQueueData[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellParameterDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    const handleCellEditTextBox = (cellData) => {
        // var data = selectedbays.map((value) => { return value.BayCode }).indexOf(cellData.rowData.BayCode)
        return (
            <Input
                fluid
                value={bayAllocationPointName[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellPointDataEdit(value, cellData)}
                // disabled={data < 0 ? true : false}
                reserveSpace={false}
                indicator="required"
            />
        );
    };
    const decimalDisplayValues = (cellData) => {
        const value = cellData;
        if (typeof value === "number") {
            return value.toLocaleString();
        } else {
            return value;
        }
    };
    return (
        <TranslationConsumer>
            {(t, index) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4 ">
                            <Input
                                fluid
                                value={bayAllocationMonitoringData[0].MonitoringRate}
                                indicator="required"
                                label={t("BaySCADA_MonitoringRate")}
                                reserveSpace={false}
                                onChange={(data) => onFieldChange("MonitoringRate", data)}
                                error={t(bayAllocationValidationErrors.MonitoringRate)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div class="ui input-label"
                                style={{ marginLeft: "14.6rem" }}>
                                <span className="input-label-message">
                                    {t("BaySCADA_Enabled")}
                                </span>
                            </div>
                            <div className="input-wrap " style={{
                                marginLeft: "14.8rem",
                                marginTop: "0.7rem"
                            }}>
                                <Checkbox
                                    key="IsEnabled"
                                    field="IsEnabled"
                                    onChange={(data) => onFieldChange("IsEnabled", data)}
                                    checked={bayAllocationMonitoringData[0].IsEnabled === null ? "" : bayAllocationMonitoringData[0].IsEnabled}
                                />
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-lg-6 pb-0 detailsTable">
                            <span style={{ "fontWeight": "bold" }}>{t("BaySCADA_Data_Parameter")}</span>
                            <div style={{ marginBottom: "10px" }}></div>
                            <DataTable
                                data={bayAllocationQueueData}
                                scrollable={true}
                                scrollHeight="350px"
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="AttributeName"
                                    field="AttributeName"
                                    header={t("CompartmentAttributeName")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="ParameterName"
                                    field="ParameterName"
                                    renderer={(cellData) => decimalDisplayValues(cellData.rowData.ParameterName)}
                                    // editable={true}
                                    renderer={handleEditTextBox}
                                    header={t("AtgConfigure_ParameterName")}
                                ></DataTable.Column>
                            </DataTable>
                        </div>
                        <div className="col-6 col-md-6 col-lg-6 pb-0">
                            <span style={{ "fontWeight": "bold" }}>{t("BaySCADA_Bay_Point")}</span>
                            <div style={{ marginBottom: "10px" }}></div>
                            <DataTable
                                data={bayAllocationPointName}
                                selectionMode="multiple"
                                scrollable={true}
                                scrollHeight="320px"
                                selection={selectedbays}
                                onSelectionChange={handleBaySelectionChange}
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="BayCode"
                                    field="BayCode"
                                    header={t("BaySCADA_BayGV_BayCode")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="BayName"
                                    field="BayName"
                                    header={t("BaySCADA_BayGV_BayName")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="PointName"
                                    field="PointName"
                                    renderer={(cellData) => decimalDisplayValues(cellData.rowData.PointName)}
                                    renderer={handleCellEditTextBox}
                                    header={handleIsRequiredCompartmentCell(t("AtgConfigure_PointName"))}
                                ></DataTable.Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="row">
                        <div
                            className="col col-md-8 col-lg-9 col col-xl-12"
                            style={{ textAlign: "right" }}
                        >
                            <Button
                                type="primary"
                                onClick={createGenerateConfig}
                                disabled={!saveEnabled}
                                content={t("BaySCADA_Generate")}
                            ></Button>
                        </div></div>
                </div>
            )}
        </TranslationConsumer>
    )
}

