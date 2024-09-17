import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import {Accordion, Input, Select} from "@scuf/common";
import * as Utilities from "../../../JS/Utilities";
import {AttributeDetails} from "./AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

MarineShipmentManualBaseProductDetails.propTypes = {
    railMarineBaseProductInfo: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        temperatureUOMs: PropTypes.array,
        densityUOMs: PropTypes.array,
        meterCodes: PropTypes.array,
        massUOMs: PropTypes.array,
        pressureUOMs: PropTypes.array,
        calculatedValueUOMs: PropTypes.array,
        tankList: PropTypes.array,
    }).isRequired,
    validationErrors: PropTypes.object.isRequired,
    handleAttributeCellDataEdit: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
};

MarineShipmentManualBaseProductDetails.defaultProps = {

};

export function MarineShipmentManualBaseProductDetails({
    railMarineBaseProductInfo,
    onFieldChange,
    listOptions,
    code,
    selectedAttributeList,
    handleAttributeCellDataEdit,
    attributeValidationErrors,
    isEnterpriseNode,
    validationErrors
}) {
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find(
            (selectedAttribute) => {
                return selectedAttribute.TerminalCode === terminal;
            }
        );
        return attributeValidation.attributeValidationErrors;
    };
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.GrossQuantity}
                                label={t("GrossQuantity")}
                                indicator="required"
                                onChange={(data) => onFieldChange("BaseProduct", "GrossQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.GrossQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.NetQuantity}
                                label={t("NetQuantity")}
                                onChange={(data) => onFieldChange("BaseProduct", "NetQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.NetQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.Temperature}
                                label={t("Temperature")}
                                onChange={(data) => onFieldChange("BaseProduct", "Temperature", data)}
                                reserveSpace={false}
                                error={t(validationErrors.Temperature)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineBaseProductInfo.TemperatureUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.temperatureUOMs
                                )}
                                placeholder="Select"
                                label={t("MarineDispatchManualEntry_TemperatureUOM")}
                                onChange={(data) => onFieldChange("BaseProduct", "TemperatureUOM", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.TemperatureUOM)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.ProductDensity}
                                label={t("ViewShipment_Density")}
                                onChange={(data) => onFieldChange("BaseProduct", "ProductDensity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.ProductDensity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineBaseProductInfo.ProductDensityUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.densityUOMs
                                )}
                                placeholder="Select"
                                label={t("ViewShipment_DensityUOM")}
                                onChange={(data) => onFieldChange("BaseProduct", "ProductDensityUOM", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.ProductDensityUOM)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.ReferenceDensity}
                                label={t("MarineDispatchManualEntry_ReferenceDensity")}
                                onChange={(data) => onFieldChange("BaseProduct", "ReferenceDensity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.ReferenceDensity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineBaseProductInfo.MeterCode}
                                options={Utilities.transferListtoOptions(
                                    listOptions.meterCodes
                                )}
                                placeholder="Select"
                                label={t("Meter_Code")}
                                onChange={(data) => onFieldChange("BaseProduct", "MeterCode", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.MeterCode)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.StartTotalizer}
                                label={t("StartTotalizer")}
                                onChange={(data) => onFieldChange("BaseProduct", "StartTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.StartTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.EndTotalizer}
                                label={t("EndTotalizer")}
                                onChange={(data) => onFieldChange("BaseProduct", "EndTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.EndTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.NetStartTotalizer}
                                label={t("MarineDispatchManualEntry_NetStartTotalizer")}
                                onChange={(data) => onFieldChange("BaseProduct", "NetStartTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.NetStartTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.NetEndTotalizer}
                                label={t("MarineDispatchManualEntry_NetEndTotalizer")}
                                onChange={(data) => onFieldChange("BaseProduct", "NetEndTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.NetEndTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.GrossMass}
                                label={t("LoadingDetailsEntry_GrossMass")}
                                onChange={(data) => onFieldChange("BaseProduct", "GrossMass", data)}
                                reserveSpace={false}
                                error={t(validationErrors.GrossMass)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineBaseProductInfo.MassUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.massUOMs
                                )}
                                placeholder="Select"
                                label={t("LoadingDetailsEntry_MassUom")}
                                onChange={(data) => onFieldChange("BaseProduct", "MassUOM", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.MassUOM)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineBaseProductInfo.TankCode}
                                options={Utilities.transferListtoOptions(
                                    listOptions.tankList
                                )}
                                placeholder="Select"
                                label={t("TankCode")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankCode", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.TankCode)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.Pressure}
                                label={t("Pressure")}
                                onChange={(data) => onFieldChange("BaseProduct", "Pressure", data)}
                                reserveSpace={false}
                                error={t(validationErrors.Pressure)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineBaseProductInfo.PressureUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.pressureUOMs
                                )}
                                placeholder="Select"
                                label={t("LoadingDetailsEntry_PressureUOM")}
                                onChange={(data) => onFieldChange("BaseProduct", "PressureUOM", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.PressureUOM)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankStartGrossQuantity}
                                label={t("LoadingDetailsEntry_TankStartGrossQuantity")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankStartGrossQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankStartGrossQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankEndGrossQuantity}
                                label={t("LoadingDetailsEntry_TankEndGrossQuantity")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankEndGrossQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankEndGrossQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankStartNetQuantity}
                                label={t("LoadingDetailsEntry_TankStartNetQuantity")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankStartNetQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankStartNetQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankEndNetQuantity}
                                label={t("LoadingDetailsEntry_TankEndNetQuantity")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankEndNetQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankEndNetQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankStartGrossMass}
                                label={t("LoadingDetailsEntry_TankStartGrossMass")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankStartGrossMass", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankStartMass)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankEndGrossMass}
                                label={t("LoadingDetailsEntry_TankEndGrossMass")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankEndGrossMass", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankEndMass)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankStartPressure}
                                label={t("LoadingDetailsEntry_TankStartPressure")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankStartPressure", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankStartPressure)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.TankEndPressure}
                                label={t("LoadingDetailsEntry_TankEndPressure")}
                                onChange={(data) => onFieldChange("BaseProduct", "TankEndPressure", data)}
                                reserveSpace={false}
                                error={t(validationErrors.TankEndPressure)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.CalculatedGross}
                                label={t("LoadingDetails_CalculatedGross")}
                                onChange={(data) => onFieldChange("BaseProduct", "CalculatedGross", data)}
                                reserveSpace={false}
                                error={t(validationErrors.CalculatedGross)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineBaseProductInfo.CalculatedNet}
                                label={t("LoadingDetails_CalculatedNet")}
                                onChange={(data) => onFieldChange("BaseProduct", "CalculatedNet", data)}
                                reserveSpace={false}
                                error={t(validationErrors.CalculatedNet)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineBaseProductInfo.CalculatedValueUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.calculatedValueUOMs
                                )}
                                placeholder="Select"
                                label={t("LoadingDetails_CalculatedValueUOM")}
                                onChange={(data) => onFieldChange("BaseProduct", "CalculatedValueUOM", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.CalculatedValueUOM)}
                            />
                        </div>
                    </div>
                    {selectedAttributeList.length > 0
                        ? selectedAttributeList.map((attire) => (
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
                                            handleCellDataEdit={(attribute, value) => {handleAttributeCellDataEdit(attribute,value,code)}}
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
                </div>
            )}
        </TranslationConsumer>
    );
};
