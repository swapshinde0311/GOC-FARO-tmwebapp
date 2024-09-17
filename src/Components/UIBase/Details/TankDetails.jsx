import React from "react";
import { Select, Input, Accordion, Button, Checkbox } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";

TankDetails.propTypes = {
    tank: PropTypes.object.isRequired,
    modTank: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    modAttributeMetaDataList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    onAttributeDataChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        terminalCode: PropTypes.array,
    }).isRequired,
    onTerminalChange: PropTypes.func.isRequired,
    onTankGroupChange: PropTypes.func.isRequired,
    isEnableATGButton: PropTypes.bool.isRequired,
    atgInfoDisable: PropTypes.object.isRequired,
    handleReadATGData: PropTypes.object.isRequired,
    handleSaveATGData: PropTypes.object.isRequired,
    isBondingEnable: PropTypes.bool.isRequired,
    isATGEnabled: PropTypes.bool.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    handleATGConfiguration: PropTypes.func.isRequired,
    isEnableATGConfigButton: PropTypes.bool.isRequired,
}

TankDetails.defaultProps = {
    isEnterpriseNode: false,
    listOptions: {
        terminalCode: [],
        tankMode: [],
        tankGroup: [],
        volumeUOM: [],
        densityUOM: [],
        massUOM: [],
        lengthUOM: [],
        temperatureUOM: [],
        pressureUOM: [],
    },
    isEnableATGButton: false,
    isEnableATGConfigButton:false
}

export function TankDetails({
    tank,
    modTank,
    validationErrors,
    onFieldChange,
    isEnterpriseNode,
    modAttributeMetaDataList,
    attributeValidationErrors,
    onAttributeDataChange,
    listOptions,
    onTerminalChange,
    onTankGroupChange,
    isEnableATGButton,
    atgInfoDisable,
    handleReadATGData,
    handleSaveATGData,
    isBondingEnable,
    isATGEnabled,
    onActiveStatusChange,
    handleATGConfiguration,
    isEnableATGConfigButton
}) {
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Code}
                                indicator="required"
                                disabled={tank.Code !== ""}
                                onChange={(data) => onFieldChange("Code", data)}
                                label={t("TankTransaction_TankCode")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Name}
                                onChange={(data) => onFieldChange("Name", data)}
                                label={t("TankInfo_Name")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Description}
                                label={t("TankInfo_Description")}
                                onChange={(data) => onFieldChange("Description", data)}
                                error={t(validationErrors.Description)}
                                reserveSpace={false}
                            />
                        </div>
                        {isEnterpriseNode ? (
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("TerminalCodes")}
                                    value={modTank.TerminalCode}
                                    options={listOptions.terminalCode}
                                    onChange={(data) => {
                                        onTerminalChange(data);
                                    }}
                                    indicator="required"
                                    error={t(validationErrors.TerminalCode)}
                                    reserveSpace={false}
                                    disabled={tank.Code !== ""}
                                    search={true}
                                    noResultsMessage={t("noResultsMessage")}
                                />
                            </div>
                        ) : ("")
                        }
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_Group")}
                                value={modTank.TankGroupCode}
                                options={listOptions.tankGroup}
                                onChange={(data) => {
                                    onTankGroupChange(data);
                                }}
                                indicator="required"
                                error={t(validationErrors.TankGroupCode)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_Mode")}
                                value={modTank.TankMode}
                                options={getOptionsWithSelect(
                                    listOptions.tankMode,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("TankMode", data);
                                }}
                                error={t(validationErrors.TankMode)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.TankMode}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.BaseProductCode}
                                label={t("TankInfo_BaseProduct")}
                                reserveSpace={false}
                                disabled={true}
                            />
                        </div>
                        
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.BPMinDensity}
                                label={t("TankInfo_BPMinDensity")}
                                reserveSpace={false}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.BPMaxDensity}
                                label={t("TankInfo_BPMaxDensity")}
                                reserveSpace={false}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.BPDensityUOM}
                                label={t("TankInfo_BPDensity")}
                                reserveSpace={false}
                                disabled={true}
                            />
                        </div>
                        {isBondingEnable ? (
                            <div className="col-12 col-md-6 col-lg-4 ddlSelectAll">
                                <Checkbox
                                    label={t("TankInfo_Bonded")}
                                    checked={modTank.IsBonded ? true : false}
                                    onChange={(data) => onFieldChange("IsBonded", data)}
                                />
                            </div>
                        ) : ("")}
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Capacity")}</div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Capacity === null ? "" : modTank.Capacity.toLocaleString()}
                                indicator="required"
                                onChange={(data) => onFieldChange("Capacity", data)}
                                label={t("TankInfo_Capacity")}
                                error={t(validationErrors.Capacity)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_CpctyUOM")}
                                value={modTank.CapacityUOM}
                                options={listOptions.volumeUOM}
                                onChange={(data) => {
                                    onFieldChange("CapacityUOM", data)
                                }}
                                indicator="required"
                                error={t(validationErrors.CapacityUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.AvailableRoom === null ? "" : modTank.AvailableRoom.toLocaleString()}
                                onChange={(data) => onFieldChange("AvailableRoom", data)}
                                label={t("TankInfo_AvRoom")}
                                error={t(validationErrors.AvailableRoom)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.AvailableRoom}
                            />
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Density")}</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Density === null ? "" : modTank.Density.toLocaleString()}
                                indicator="required"
                                onChange={(data) => onFieldChange("Density", data)}
                                label={t("TankInfo_Density")}
                                error={t(validationErrors.Density)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.Density}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_DensityUOM")}
                                value={modTank.DensityUOM}
                                options={listOptions.densityUOM}
                                onChange={(data) => {
                                    onFieldChange("DensityUOM", data)
                                }}
                                indicator="required"
                                error={t(validationErrors.DensityUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.Density}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Mass")}</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.GrossMass === null ? "" : modTank.GrossMass.toLocaleString()}
                                onChange={(data) => onFieldChange("GrossMass", data)}
                                label={t("TankInfo_Mass")}
                                error={t(validationErrors.GrossMass)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.Mass}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_GrossMassUOM")}
                                value={modTank.GrossMassUOM}
                                options={getOptionsWithSelect(
                                    listOptions.massUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("GrossMassUOM", data)
                                }}
                                error={t(validationErrors.GrossMassUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.Mass}
                            //indicator={(modTank.GrossMass !== "" || modTank.GrossMass !== null) ? "required" : ""}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Volume")}</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.GrossVolume === null ? "" : modTank.GrossVolume.toLocaleString()}
                                onChange={(data) => onFieldChange("GrossVolume", data)}
                                label={t("TankInfo_GrossVol")}
                                error={t(validationErrors.GrossVolume)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.GrossVolume}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_GrossVolUOM")}
                                value={modTank.GrossVolumeUOM}
                                options={getOptionsWithSelect(
                                    listOptions.volumeUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("GrossVolumeUOM", data)
                                }}
                                error={t(validationErrors.GrossVolumeUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.GrossVolume}
                            //indicator={modTank.GrossVolume !== "" ? "required" : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.NetVolume === null ? "" : modTank.NetVolume.toLocaleString()}
                                onChange={(data) => onFieldChange("NetVolume", data)}
                                label={t("TankInfo_NetVol")}
                                error={t(validationErrors.NetVolume)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.NetVolume}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_NetVolUOM")}
                                value={modTank.NetVolumeUOM}
                                options={getOptionsWithSelect(
                                    listOptions.volumeUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("NetVolumeUOM", data)
                                }}
                                error={t(validationErrors.NetVolumeUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.NetVolume}
                            //indicator={modTank.NetVolume !== "" ? "required" : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.WaterVolume === null ? "" : modTank.WaterVolume.toLocaleString()}
                                onChange={(data) => onFieldChange("WaterVolume", data)}
                                label={t("TankInfo_WaterVol")}
                                error={t(validationErrors.WaterVolume)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.WaterVolume}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_WaterVolUOM")}
                                value={modTank.WaterVolumeUOM}
                                options={getOptionsWithSelect(
                                    listOptions.volumeUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("WaterVolumeUOM", data)
                                }}
                                error={t(validationErrors.WaterVolumeUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.WaterVolume}
                            //indicator={modTank.WaterVolume !== "" ? "required" : ""}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Level")}</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.TankLevel === null ? "" : modTank.TankLevel.toLocaleString()}
                                onChange={(data) => onFieldChange("TankLevel", data)}
                                label={t("TankInfo_TankLevel")}
                                error={t(validationErrors.TankLevel)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.TankLevel}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.WaterLevel === null ? "" : modTank.WaterLevel.toLocaleString()}
                                onChange={(data) => onFieldChange("WaterLevel", data)}
                                label={t("TankInfo_WaterLevel")}
                                error={t(validationErrors.WaterLevel)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.WaterLevel}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_LevelUOM")}
                                value={modTank.LevelUOM}
                                options={getOptionsWithSelect(
                                    listOptions.lengthUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("LevelUOM", data)
                                }}
                                error={t(validationErrors.LevelUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.WaterLevel}
                            // indicator={(modTank.TankLevel !== "" || modTank.WaterLevel !== "") ? "required" : ""}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Vapour")}</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.VapourGrossQuantity === null ? "" : modTank.VapourGrossQuantity.toLocaleString()}
                                onChange={(data) => onFieldChange("VapourGrossQuantity", data)}
                                label={t("TankInfo_VapGrs")}
                                error={t(validationErrors.VapourGrossQuantity)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.VapourGrossQuantity}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.VapourNetQuantity === null ? "" : modTank.VapourNetQuantity.toLocaleString()}
                                onChange={(data) => onFieldChange("VapourNetQuantity", data)}
                                label={t("TankInfo_VapNet")}
                                error={t(validationErrors.VapourNetQuantity)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.VapourNetQuantity}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_VapourUOM")}
                                value={modTank.VapourUOM}
                                options={getOptionsWithSelect(
                                    listOptions.volumeUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("VapourUOM", data)
                                }}
                                error={t(validationErrors.VapourUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.VapourNetQuantity}
                            // indicator={(modTank.VapourGrossQuantity !== "" || modTank.VapourNetQuantity !== "") ? "required" : ""}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Pressure")}</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Pressure === null ? "" : modTank.Pressure.toLocaleString()}
                                onChange={(data) => onFieldChange("Pressure", data)}
                                label={t("TankInfo_Pressure")}
                                error={t(validationErrors.Pressure)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.Pressure}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_PressureUOM")}
                                value={modTank.PressureUOM}
                                options={getOptionsWithSelect(
                                    listOptions.pressureUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("PressureUOM", data)
                                }}
                                error={t(validationErrors.PressureUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.Pressure}
                            // indicator={modTank.Pressure !== "" ? "required" : ""}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <div className="tank-form-header">{t("TankInfo_Temperature")}</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Temperature === null ? "" : modTank.Temperature.toLocaleString()}
                                onChange={(data) => onFieldChange("Temperature", data)}
                                label={t("TankInfo_Temperature")}
                                error={t(validationErrors.Temperature)}
                                reserveSpace={false}
                                disabled={atgInfoDisable.Temperature}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankInfo_TemperatureUOM")}
                                value={modTank.TemperatureUOM}
                                options={getOptionsWithSelect(
                                    listOptions.temperatureUOM,
                                    t("Common_Select")
                                )}
                                onChange={(data) => {
                                    onFieldChange("TemperatureUOM", data)
                                }}
                                error={t(validationErrors.TemperatureUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={atgInfoDisable.Temperature}
                            // indicator={modTank.Temperature !== "" ? "required" : ""}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankList_Status")}
                                value={modTank.Active}
                                options={[
                                    { text: t("ViewShipment_Ok"), value: true },
                                    { text: t("ViewShipmentStatus_Inactive"), value: false },
                                ]}
                                onChange={(data) => onActiveStatusChange(data)}
                                error={t(validationErrors.Active)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTank.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("TankInfo_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modTank.Active !== tank.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
                    </div>
                    {
                        modAttributeMetaDataList.length > 0 ?
                        modAttributeMetaDataList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={onAttributeDataChange}
                                                attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attribute.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null
                    }

                    {
                        isATGEnabled ? (<div className="row">
                            <div className="col col-md-8 col-lg-9 col col-xl-12" style={{ textAlign: "right" }}>
                            <Button
                                    type="primary"
                                   // onClick={()=>handleATGConfiguration}
                                    onClick={handleATGConfiguration}
                                    disabled={!isEnableATGConfigButton}
                                    content={t("TankList_ATGConfiguration")}
                                ></Button>
                                <Button
                                    type="primary"
                                    onClick={handleReadATGData}
                                    disabled={!isEnableATGButton}
                                    content={t("TankInfo_ReadATGData")}
                                ></Button>
                                <Button
                                    type="primary"
                                    onClick={handleSaveATGData}
                                    disabled={!isEnableATGButton}
                                    content={t("TankInfo_SaveData")}
                                ></Button>
                            </div>
                        </div>) : ("")
                    }

                </div>
            )}
        </TranslationConsumer>
    )
}