import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select } from "@scuf/common";
import * as Utilities from "../../../JS/Utilities";


MarineShipmentManualTransactionsDetails.propTypes = {
    railMarineFinishedProductInfo: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        temperatureUOMs: PropTypes.array,
        densityUOMs: PropTypes.array,
        meterCodes: PropTypes.array,
        massUOMs: PropTypes.array,
        pressureUOMs: PropTypes.array,
        calculatedValueUOMs: PropTypes.array,
    }).isRequired,
    validationErrors: PropTypes.object.isRequired
};

MarineShipmentManualTransactionsDetails.defaultProps = {

};

export function MarineShipmentManualTransactionsDetails({
    railMarineFinishedProductInfo,
    onFieldChange,
    listOptions,
    validationErrors
}) {
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.GrossQuantity}
                                label={t("GrossQuantity")}
                                indicator="required"
                                onChange={(data) => onFieldChange("FP", "GrossQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.GrossQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.NetQuantity}
                                label={t("NetQuantity")}
                                onChange={(data) => onFieldChange("FP", "NetQuantity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.NetQuantity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.Temperature}
                                label={t("Temperature")}
                                onChange={(data) => onFieldChange("FP", "Temperature", data)}
                                reserveSpace={false}
                                error={t(validationErrors.Temperature)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineFinishedProductInfo.TemperatureUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.temperatureUOMs
                                )}
                                placeholder="Select"
                                label={t("MarineDispatchManualEntry_TemperatureUOM")}
                                onChange={(data) => onFieldChange("FP", "TemperatureUOM", data)}
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
                                value={railMarineFinishedProductInfo.ProductDensity}
                                label={t("ViewShipment_Density")}
                                onChange={(data) => onFieldChange("FP", "ProductDensity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.ProductDensity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineFinishedProductInfo.ProductDensityUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.densityUOMs
                                )}
                                placeholder="Select"
                                label={t("ViewShipment_DensityUOM")}
                                onChange={(data) => onFieldChange("FP", "ProductDensityUOM", data)}
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
                                value={railMarineFinishedProductInfo.ReferenceDensity}
                                label={t("MarineDispatchManualEntry_ReferenceDensity")}
                                onChange={(data) => onFieldChange("FP", "ReferenceDensity", data)}
                                reserveSpace={false}
                                error={t(validationErrors.ReferenceDensity)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineFinishedProductInfo.MeterCode}
                                options={Utilities.transferListtoOptions(
                                    listOptions.meterCodes
                                )}
                                placeholder="Select"
                                label={t("Meter_Code")}
                                onChange={(data) => onFieldChange("FP", "MeterCode", data)}
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
                                value={railMarineFinishedProductInfo.StartTotalizer}
                                label={t("StartTotalizer")}
                                onChange={(data) => onFieldChange("FP", "StartTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.StartTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.EndTotalizer}
                                label={t("EndTotalizer")}
                                onChange={(data) => onFieldChange("FP", "EndTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.EndTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.NetStartTotalizer}
                                label={t("MarineDispatchManualEntry_NetStartTotalizer")}
                                onChange={(data) => onFieldChange("FP", "NetStartTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.NetStartTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.NetEndTotalizer}
                                label={t("MarineDispatchManualEntry_NetEndTotalizer")}
                                onChange={(data) => onFieldChange("FP", "NetEndTotalizer", data)}
                                reserveSpace={false}
                                error={t(validationErrors.NetEndTotalizer)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.GrossMass}
                                label={t("LoadingDetailsEntry_GrossMass")}
                                onChange={(data) => onFieldChange("FP", "GrossMass", data)}
                                reserveSpace={false}
                                error={t(validationErrors.GrossMass)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineFinishedProductInfo.MassUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.massUOMs
                                )}
                                placeholder="Select"
                                label={t("LoadingDetailsEntry_MassUom")}
                                onChange={(data) => onFieldChange("FP", "MassUOM", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.MassUOM)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.Pressure}
                                label={t("Pressure")}
                                onChange={(data) => onFieldChange("FP", "Pressure", data)}
                                reserveSpace={false}
                                error={t(validationErrors.Pressure)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineFinishedProductInfo.PressureUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.pressureUOMs
                                )}
                                placeholder="Select"
                                label={t("LoadingDetailsEntry_PressureUOM")}
                                onChange={(data) => onFieldChange("FP", "PressureUOM", data)}
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
                                value={railMarineFinishedProductInfo.CalculatedGross}
                                label={t("LoadingDetails_CalculatedGross")}
                                onChange={(data) => onFieldChange("FP", "CalculatedGross", data)}
                                reserveSpace={false}
                                error={t(validationErrors.CalculatedGross)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={railMarineFinishedProductInfo.CalculatedNet}
                                label={t("LoadingDetails_CalculatedNet")}
                                onChange={(data) => onFieldChange("FP", "CalculatedNet", data)}
                                reserveSpace={false}
                                error={t(validationErrors.CalculatedNet)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={railMarineFinishedProductInfo.CalculatedValueUOM}
                                options={Utilities.transferListtoOptions(
                                    listOptions.calculatedValueUOMs
                                )}
                                placeholder="Select"
                                label={t("LoadingDetails_CalculatedValueUOM")}
                                onChange={(data) => onFieldChange("FP", "CalculatedValueUOM", data)}
                                multiple={false}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                error={t(validationErrors.CalculatedValueUOM)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </TranslationConsumer>
    );
}
