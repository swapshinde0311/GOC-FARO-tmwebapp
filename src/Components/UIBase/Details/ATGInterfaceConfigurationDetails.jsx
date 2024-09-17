import React from "react";
import { Select, Input, Checkbox } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";

ATGInterfaceConfigurationDetails.propTypes = {
    AtgAttributeConfigurationData: PropTypes.object.isRequired,
    modATGTankInfo: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    handleCellCheck: PropTypes.func.isRequired,
    tankObj: PropTypes.array,
    handleCellDataEdit: PropTypes.func.isRequired,
    handleCellParameterDataEdit:PropTypes.func.isRequired
}

ATGInterfaceConfigurationDetails.defaultProps = {
    isEnterpriseNode: false,
}
export function ATGInterfaceConfigurationDetails({
    AtgAttributeConfigurationData,
    modATGTankInfo,
    onFieldChange,
    tankObj,
    handleCellCheck,
    handleCellDataEdit,
    handleCellParameterDataEdit
}) {
    console.log(AtgAttributeConfigurationData)
    const handleCustomEditTextBox = (cellData) => {
        console.log(cellData.rowData)
        
        return (
            <Input
                fluid
                value={AtgAttributeConfigurationData[cellData.rowIndex][cellData.field].Point}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    const handleEditTextBox = (cellData) => {
        return (
            <Input
                fluid
                value={AtgAttributeConfigurationData[cellData.rowIndex][cellData.field].Parameter}
                onChange={(value) => handleCellParameterDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    const decimalDisplayValues = (cellData) => {
        const  value  = cellData;
        if (typeof value === "number") {
            return value.toLocaleString();
        } else {
            return value;
        }
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
                        <div className="col-12">
                            <h3>
                                {tankObj.Code +" - "+  t("AtgConfiguration_Title")
                                }
                            </h3>
                        </div>
                    </div>
                    <div className="row marginRightZero tableScroll">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modATGTankInfo.TankCode}
                                indicator="required"
                                disabled={modATGTankInfo.TankCode!== ""}
                                label={t("TankTransaction_TankCode")}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={tankObj.Name}
                                label={t("TankInfo_Name")}
                                disabled={true}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={tankObj.TankGroupCode}
                                label={t("AtgConfigure_TankGroup")}
                                disabled={true}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={tankObj.Description}
                                label={t("TankInfo_Description")}
                               disabled={true}
                               reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={tankObj.BaseProductCode}
                                label={t("AtgConfigure_BaseProduct")}
                                disabled={true}
                                reserveSpace={false}
                            />
                        </div>
                        
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("AtgConfigure_TankStatus")}
                                value={tankObj.Active}
                                options={[
                                    { text: t("ViewShipment_Ok"), value: true },
                                    { text: t("ViewShipmentStatus_Inactive"), value: false },
                                ]}
                                reserveSpace={false}
                                search={true}
                                disabled={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div class="ui input-label">
                                <span className="input-label-message">
                                    {t("AtgConfigure_EnableTankScan")}
                                </span>
                            </div>
                            <div className="input-wrap " style={{marginLeft: "8rem",
                            marginTop: "-1.3rem"}}>
                                <Checkbox
                                    key="EnableTankScan"
                                    field="EnableTankScan"
                                    onChange={(data) => onFieldChange("EnableTankScan", data)}
                                    checked={modATGTankInfo.EnableTankScan === null ? "" : modATGTankInfo.EnableTankScan}
                                />
                            </div>
                        </div>
                        <div>
                            <DataTable
                                data={AtgAttributeConfigurationData}
                                scrollable={true}
                                scrollHeight="320px"
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="TankAttributeDescription"
                                    field="TankAttributeDescription"
                                    header={t("AtgConfigure_Atg_Data_Description")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="TankAttributeUOM"
                                    field="TankAttributeUOM"
                                    header={t("AtgConfigure_UOM")}
                                ></DataTable.Column>
                                
                                <DataTable.Column
                                    className="compColHeight"
                                    key="Parameter"
                                    field="Parameter"
                                    renderer={(cellData)=>decimalDisplayValues(cellData.rowData.Parameter.Point)}
                                    editable={true}
                                    customEditRenderer={handleCustomEditTextBox}
                                    header={t("AtgConfigure_PointName")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="Parameter"
                                    field="Parameter"
                                    renderer={(cellData) => decimalDisplayValues(cellData.rowData.Parameter.Parameter)}
                                    editable={true}
                                    customEditRenderer={handleEditTextBox}
                                    header={t("AtgConfigure_ParameterName")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight colminWidth"
                                    key="EnableScan"
                                    field="EnableScan"
                                    header={t("AtgConfigure_EnableScan")}
                                    renderer={handleCheckBox}
                                ></DataTable.Column>
                            </DataTable>
                            </div> 
                    </div>
                </div>
            )}
        </TranslationConsumer>
    )
}