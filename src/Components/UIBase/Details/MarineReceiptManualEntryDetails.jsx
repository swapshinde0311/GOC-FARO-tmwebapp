import React from "react";
import { Select } from "@scuf/common";
import { Input, DatePicker } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import {
  getCurrentDateFormat,
  getOptionsWithSelect,
} from "../../../JS/functionalUtilities";

MarineReceiptManualEntryDetails.propTypes = {
  listOptions: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  railMarineTransactionCommonInfo: PropTypes.object.isRequired,
  marineReceiptManualEntryEnabled: PropTypes.bool.isRequired,
};

export function MarineReceiptManualEntryDetails({
  listOptions,
  validationErrors,
  railMarineTransactionCommonInfo,
  onFieldChange,
  onDateTextChange,
  selectedCompartment,
  marineReceiptManualEntryEnabled,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={
                  railMarineTransactionCommonInfo.CompartmentSeqNoInVehicle
                }
                label={t("MarineReceiptManualEntry_CompSeqNo")}
                onChange={(data) =>
                  onFieldChange("CompartmentSeqNoInVehicle", data)
                }
                indicator="required"
                options={listOptions.compartmentSeqNoInVehicleList}
                reserveSpace={false}
                search={false}
                multiple={false}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.CompartmentSeqNoInVehicle)}
                disabled={selectedCompartment.ReceiptCompartmentStatus === null}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={railMarineTransactionCommonInfo.BayCode}
                label={t("MarineReceiptManualEntry_Bay")}
                indicator="required"
                options={listOptions.berthList}
                onChange={(data) => onFieldChange("BayCode", data)}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.BayCode)}
                disabled={!marineReceiptManualEntryEnabled}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("BCU_Code")}
                value={railMarineTransactionCommonInfo.BCUCode}
                indicator="required"
                options={listOptions.bcuCodeList}
                onChange={(data) => onFieldChange("BCUCode", data)}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.BCUCode)}
                disabled={!marineReceiptManualEntryEnabled}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={railMarineTransactionCommonInfo.UnLoadingArm}
                label={t("MarineReceiptManualEntry_UnloadingArm")}
                options={listOptions.unLoadingArmList}
                onChange={(data) => onFieldChange("UnLoadingArm", data)}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.UnLoadingArm)}
                disabled={!marineReceiptManualEntryEnabled}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                label={t("MarineReceiptManualEntry_UnloadStartTime")}
                value={new Date(railMarineTransactionCommonInfo.StartTime)}
                onChange={(data) => onFieldChange("StartTime", data)}
                type="datetime"
                disablePast={false}
                indicator="required"
                reserveSpace={false}
                disableFuture={true}
                minuteStep={1}
                displayFormat={getCurrentDateFormat()}
                onTextChange={(value, error) => {
                  onDateTextChange("StartTime", value, error);
                }}
                error={t(validationErrors.StartTime)}
                disabled={!marineReceiptManualEntryEnabled}
              ></DatePicker>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                label={t("MarineReceiptManualEntry_UnloadEndTime")}
                value={new Date(railMarineTransactionCommonInfo.EndTime)}
                onChange={(data) => onFieldChange("EndTime", data)}
                type="datetime"
                disablePast={false}
                indicator="required"
                reserveSpace={false}
                disableFuture={true}
                minuteStep={1}
                displayFormat={getCurrentDateFormat()}
                onTextChange={(value, error) => {
                  onDateTextChange("EndTime", value, error);
                }}
                error={t(validationErrors.EndTime)}
                disabled={!marineReceiptManualEntryEnabled}
              ></DatePicker>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_FinishedProduct")}
                value={railMarineTransactionCommonInfo.FinishedProductCode}
                disabled={true}
                onChange={(data) => onFieldChange("FinishedProductCode", data)}
                reserveSpace={false}
                error={t(validationErrors.FinishedProductCode)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                label={t("MarineReceiptManualEntry_QuantityUOM")}
                value={railMarineTransactionCommonInfo.QuantityUOM}
                onChange={(data) => onFieldChange("QuantityUOM", data)}
                options={getOptionsWithSelect(
                  listOptions.quantityUOMList,
                  t("Common_Select")
                )}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.QuantityUOM)}
                disabled={!marineReceiptManualEntryEnabled}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_TransactionNo")}
                value={railMarineTransactionCommonInfo.TransactionID}
                onChange={(data) => onFieldChange("TransactionID", data)}
                reserveSpace={false}
                error={t(validationErrors.TransactionID)}
                disabled={!marineReceiptManualEntryEnabled}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_Remarks")}
                value={railMarineTransactionCommonInfo.Remarks}
                onChange={(data) => onFieldChange("Remarks", data)}
                reserveSpace={false}
                error={t(validationErrors.Remarks)}
                disabled={!marineReceiptManualEntryEnabled}
              ></Input>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
