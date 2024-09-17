import React from "react";
import { Input, Select, DatePicker } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";

LeakageManualEntryDetails.propTypes = {
  modLeakageManualEntry: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    productCategory: PropTypes.array,
    productCode: PropTypes.array,
    quantityUOM: PropTypes.array,
    densityUOM: PropTypes.array,
    tankCode: PropTypes.array,
    meterCode: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onTankSearchChange: PropTypes.func.isRequired,
  onMeterSearchChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
};
LeakageManualEntryDetails.defaultProps = { isEnterpriseNode: false };

export function LeakageManualEntryDetails({
  modLeakageManualEntry,
  validationErrors,
  listOptions,
  onFieldChange,
  onTankSearchChange,
  onMeterSearchChange,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                indicator="required"
                label={t("LoadingDetailsEntry_ProductCategory")}
                value={modLeakageManualEntry.ProductCategory}
                options={listOptions.productCategory}
                error={t(validationErrors.ProductCategory)}
                onChange={(data) => onFieldChange("ProductCategory", data)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                indicator="required"
                label={t("ProductCode")}
                value={modLeakageManualEntry.ProductCode}
                options={listOptions.productCode}
                error={t(validationErrors.ProductCode)}
                onChange={(data) => onFieldChange("ProductCode", data)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                indicator="required"
                label={t("LoadingDetailsEntry_QuantityUOM")}
                value={modLeakageManualEntry.LeakageQtyUom}
                options={listOptions.quantityUOM}
                error={t(validationErrors.LeakageQtyUom)}
                onChange={(data) => onFieldChange("LeakageQtyUom", data)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLeakageManualEntry.LeakageQty}
                label={t("GrossQuantity")}
                indicator="required"
                onChange={(data) => onFieldChange("LeakageQty", data)}
                error={t(validationErrors.LeakageQty)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLeakageManualEntry.NetQuantity}
                label={t("NetQuantity")}
                onChange={(data) => onFieldChange("NetQuantity", data)}
                error={t(validationErrors.NetQuantity)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLeakageManualEntry.Density}
                label={t("Density")}
                onChange={(data) => onFieldChange("Density", data)}
                error={t(validationErrors.Density)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("BaseProductInfox_UOM")}
                value={modLeakageManualEntry.DensityUOM}
                options={listOptions.densityUOM}
                onChange={(data) => onFieldChange("DensityUOM", data)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("TankCode")}
                indicator="required"
                value={modLeakageManualEntry.TankCode}
                error={t(validationErrors.TankCode)}
                options={getOptionsWithSelect(
                  listOptions.tankCode,
                  t("Common_Select")
                )}
                onChange={(data) => onFieldChange("TankCode", data)}
                search={true}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
                onSearch={onTankSearchChange}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("Meter_Code")}
                indicator="required"
                value={modLeakageManualEntry.MeterCode}
                error={t(validationErrors.MeterCode)}
                options={getOptionsWithSelect(
                  listOptions.meterCode,
                  t("Common_Select")
                )}
                onChange={(data) => onFieldChange("MeterCode", data)}
                search={true}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
                onSearch={onMeterSearchChange}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modLeakageManualEntry.StartTime === null
                    ? ""
                    : new Date(modLeakageManualEntry.StartTime)
                }
                label={t("StartTime")}
                type="datetime"
                minuteStep="5"
                displayFormat={getCurrentDateFormat()}
                indicator="required"
                onChange={(data) => onFieldChange("StartTime", data)}
                error={t(validationErrors.StartTime)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modLeakageManualEntry.EndTime === null
                    ? ""
                    : new Date(modLeakageManualEntry.EndTime)
                }
                label={t("EndTime")}
                type="datetime"
                minuteStep="5"
                displayFormat={getCurrentDateFormat()}
                indicator="required"
                onChange={(data) => onFieldChange("EndTime", data)}
                error={t(validationErrors.EndTime)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLeakageManualEntry.GrossStartTotalizer}
                label={t("StartTotalizer")}
                onChange={(data) => onFieldChange("GrossStartTotalizer", data)}
                error={t(validationErrors.GrossStartTotalizer)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLeakageManualEntry.GrossEndTotalizer}
                label={t("EndTotalizer")}
                onChange={(data) => onFieldChange("GrossEndTotalizer", data)}
                error={t(validationErrors.GrossEndTotalizer)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLeakageManualEntry.NetStartTotalizer}
                label={t("LoadingDetailsEntry_NetStartTotalizer")}
                onChange={(data) => onFieldChange("NetStartTotalizer", data)}
                error={t(validationErrors.NetStartTotalizer)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLeakageManualEntry.NetEndTotalizer}
                label={t("LoadingDetailsEntry_NetEndTotalizer")}
                onChange={(data) => onFieldChange("NetEndTotalizer", data)}
                error={t(validationErrors.NetEndTotalizer)}
                reserveSpace={false}
              />
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
