import React from "react";
import { Input, Select, Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import {
    handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import * as Utilities from "../../../JS/Utilities";
ATGMasterConfigurationSummaryComposite.propTypes = {
    modATGMaster: PropTypes.object.isRequired,
    AtgConfigurations: PropTypes.object.isRequired,
    listOptions: PropTypes.shape({
        dataTypesOptions: PropTypes.array,
    }).isRequired,
    uomOptionList:PropTypes.array,
    onFieldChange: PropTypes.func.isRequired,
    selectedTanks: PropTypes.array.isRequired,
    handleCellPointDataEdit: PropTypes.func.isRequired,
    generateButton: PropTypes.func.isRequired,
    handleBaySelectionChange: PropTypes.func.isRequired,
    checkedTanks: PropTypes.bool.isRequired,
    updateATGMasterConfiguration: PropTypes.func.isRequired,
    AtgMasterValidationError: PropTypes.object.isRequired,
    isATGEnabled: PropTypes.bool.isRequired,
    handleReset: PropTypes.func.isRequired,
}
ATGMasterConfigurationSummaryComposite.defaultProps = {
    isEnterpriseNode: false,
    listOptions: {
        dataTypesOptions: [],
    },

}
export default function ATGMasterConfigurationSummaryComposite({
    modATGMaster,
    AtgConfigurations,
    listOptions,
    onFieldChange,
    selectedTanks,
    generateButton,
    handleCellPointDataEdit,
    handleCellDataEdit,
    handleBaySelectionChange,
    checkedTanks,
    updateATGMasterConfiguration,
    AtgMasterValidationError,
    isATGEnabled,
    handleReset,
    uomOptionList

}) {
    const handleEditTextBox = (cellData) => {
        return (
            <Input
                fluid
                value={modATGMaster.AtgMasterConfigurations[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    const handleCellEditTextBox = (cellData) => {
        return (
            <Input
                fluid
                value={AtgConfigurations[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellPointDataEdit(value, cellData)}
                reserveSpace={false}
                indicator="required"
            />
        );
    };
    const decimalDisplayValues = (cellData) => {
        try {
            const value = cellData;
            if (typeof value === "number") {
                return value.toLocaleString();
            } else {
                return value;
            }
        } catch (error) {
            console.log("Error in displayvalues");
        }
    };
    
    const handleCustomEditDropDown = (cellData, dropDownoptions) => {
        return (
            <Select
                className="selectDropwdown"
                value={
                    modATGMaster.AtgMasterConfigurations[cellData.rowIndex][
                    cellData.field
                    ]
                }
                fluid
                options={dropDownoptions}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                indicator="required"
                reserveSpace={false}
                search={true}
            />
        );
    };
    console.log(uomOptionList)
    const UOMOptionList = (UOMType, dropDownoptions) => {
        switch (UOMType) {
            case  "VOLUME":
                return Utilities.transferListtoOptions(dropDownoptions.VOLUME);
            case "DENSITY":
                return Utilities.transferListtoOptions(dropDownoptions.DENSITY);
            case  "PRESSURE":
                return Utilities.transferListtoOptions(dropDownoptions.PRESSURE);
            case  "TEMPERATURE":
                return Utilities.transferListtoOptions(dropDownoptions.TEMPERATURE);
            case "MASS":
                return Utilities.transferListtoOptions(dropDownoptions.MASS);
            case  "LENGTH":
                return Utilities.transferListtoOptions(dropDownoptions.LENGTH);
            default:
                return [];
        }
    }
    const handleCustomUOMEditDropDown = (cellData, dropDownoptions) => {
        return (
            <Select
                className="selectDropwdown"
                placeholder="Select"
                value={
                    modATGMaster.AtgMasterConfigurations[cellData.rowIndex][
                    cellData.field
                    ]
                }
                fluid
                options={UOMOptionList(cellData.rowData.UOMType, uomOptionList)}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                indicator="required"
                reserveSpace={false}
                disabled={cellData.rowData.UOMType === null ? true : false}
                search={true}
            />
        );
    };
    return (
        <TranslationConsumer>
            {(t, index) => (
                <div className="detailsContainer">
                    <ErrorBoundary>
                    <div className="row marginRightZero tableScroll">
                        <div className="col-12 detailsTable tankcode">
                            <span style={{ "fontWeight": "bold" }}>{t("AtgCommonConfigure_TankCode_Point")}</span>
                            <div style={{ marginBottom: "20px" }}></div>
                            <DataTable
                                data={AtgConfigurations}
                                selectionMode="multiple"
                                scrollable={true}
                                scrollHeight="320px"
                                selection={selectedTanks}
                                onSelectionChange={handleBaySelectionChange}
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="TankCode"
                                    field="TankCode"
                                    header={t("AtgConfigure_TankCode")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="TankName"
                                    field="TankName"
                                    header={t("AtgConfigure_TankName")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="PointName"
                                    field="PointName"
                                    customEditRenderer={(cellData) => decimalDisplayValues(cellData.rowData.PointName)}
                                    renderer={handleCellEditTextBox}
                                    header={handleIsRequiredCompartmentCell(t("AtgConfigure_PointName"))}
                                ></DataTable.Column>
                            </DataTable>
                        </div>
                        </div>
                    </ErrorBoundary>
                    <div className="row" style={{ marginBottom: "10px", marginTop: "10px" }}>
                        <div
                            className="col col-md-8 col-lg-9 col col-xl-12"
                            style={{ textAlign: "right" }}
                        >
                            <Button
                                type="primary"
                                onClick={generateButton}
                                content={t("BaySCADA_Generate")}
                                disabled={checkedTanks && isATGEnabled ? false : true}
                            ></Button>
                        </div></div>

                    <span style={{ "fontWeight": "bold" }}>{t("AtgCommonConfigure_Data_Parameter")}</span>
                    <div style={{ marginBottom: "10px" }}></div>
                    <div className="row atgmasterinput">
                        <div className="col-12 col-md-6 col-lg-4 ">
                            <Input
                                fluid
                                value={modATGMaster.AtgScanPeriod}
                                indicator="required"
                                label={t("AtgCommonConfigure_MonitoringRate")}
                                reserveSpace={false}
                                onChange={(data) => onFieldChange("AtgScanPeriod", data)}
                                error={t(AtgMasterValidationError.AtgScanPeriod)}
                            />
                        </div>
                    </div>
                    <ErrorBoundary>
                    <div className="row marginRightZero tableScroll">
                        <div className="col-12 detailsTable">
                            <DataTable
                                data={modATGMaster.AtgMasterConfigurations}
                                scrollable={true}
                                scrollHeight="250px"
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="Description"
                                    field="Description"
                                    header={t("AtgConfigure_Atg_Data_Description")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="ATGValueDataType"
                                    field="ATGValueDataType"
                                    renderer={(celldata) => handleCustomEditDropDown(celldata, listOptions.dataTypesOptions)}
                                    header={t("AtgConfigure_DataType")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="UOM"
                                    field="UOM"
                                    header={t("AtgConfigure_UOM")}
                                    renderer={(celldata) =>
                                        handleCustomUOMEditDropDown(celldata, listOptions)
                                    }
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
                        </div>
                    </ErrorBoundary>
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                            <div style={{ float: "right" }}>
                                <Button
                                    content={t("LookUpData_btnReset")}
                                    className={isATGEnabled ? "cancelButton" : "disablereset"}
                                    // disabled={!isATGEnabled?true:false}
                                    onClick={handleReset}
                                ></Button>
                                <Button
                                    content={t("Save")}
                                    disabled={!isATGEnabled ? true : false}
                                    onClick={updateATGMasterConfiguration}
                                ></Button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </TranslationConsumer>
    )
}

