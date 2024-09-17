import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select, DatePicker } from "@scuf/common";
import * as Utilities from "../../../JS/Utilities";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

MarineShipmentManualBaseDetails.propTypes = {
  railMarineFinishedProductInfo: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    compartmentSeqNoInVehicleList: PropTypes.array,
    berthList: PropTypes.array,
    bcuCodeList: PropTypes.array,
    loadingArmList: PropTypes.array,
    quantityUOMList: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  marineDispatchManualEntryEnabled: PropTypes.bool.isRequired,
};

MarineShipmentManualBaseDetails.defaultProps = {};

export function MarineShipmentManualBaseDetails({
  railMarineFinishedProductInfo,
  validationErrors,
  listOptions,
  onFieldChange,
  onDateTextChange,
  selectedCompartment,
  marineDispatchManualEntryEnabled,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div>
          <div className="detailsContainer">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={
                    railMarineFinishedProductInfo.CompartmentSeqNoInVehicle
                  }
                  label={t("MarineDispatchManualEntry_CompSeqNo")}
                  options={Utilities.transferListtoOptions(
                    listOptions.compartmentSeqNoInVehicleList
                  )}
                  onChange={(data) =>
                    onFieldChange("FP", "CompartmentSeqNoInVehicle", data)
                  }
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
                  error={t(validationErrors.CompartmentSeqNoInVehicle)}
                  disabled={
                    selectedCompartment.DispatchCompartmentStatus === null
                  }
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={railMarineFinishedProductInfo.BayCode}
                  label={t("MarineDispatchManualEntry_Bay")}
                  options={Utilities.transferListtoOptions(
                    listOptions.berthList
                  )}
                  onChange={(data) => onFieldChange("FP", "BayCode", data)}
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
                  error={t(validationErrors.BayCode)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={railMarineFinishedProductInfo.BCUCode}
                  label={t("BCU_Code")}
                  options={Utilities.transferListtoOptions(
                    listOptions.bcuCodeList
                  )}
                  onChange={(data) => onFieldChange("FP", "BCUCode", data)}
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
                  error={t(validationErrors.BCUCode)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={railMarineFinishedProductInfo.LoadingArm}
                  label={t("MarineDispatchManualEntry_LoadingArm")}
                  options={Utilities.transferListtoOptions(
                    listOptions.loadingArmList
                  )}
                  onChange={(data) => onFieldChange("FP", "LoadingArm", data)}
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
                  error={t(validationErrors.LoadingArm)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={new Date(railMarineFinishedProductInfo.StartTime)}
                  label={t("MarineDispatchManualEntry_MandatoryLoadStartTime")}
                  disablePast={false}
                  minuteStep={1}
                  type="datetime"
                  indicator="required"
                  onChange={(data) => onFieldChange("FP", "StartTime", data)}
                  displayFormat={getCurrentDateFormat()}
                  reserveSpace={false}
                  disableFuture={true}
                  onTextChange={(value, error) => {
                    onDateTextChange("StartTime", value, error);
                  }}
                  error={t(validationErrors.StartTime)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={new Date(railMarineFinishedProductInfo.EndTime)}
                  label={t("MarineDispatchManualEntry_MandatoryLoadEndTime")}
                  disablePast={false}
                  minuteStep={1}
                  type="datetime"
                  indicator="required"
                  onChange={(data) => onFieldChange("FP", "EndTime", data)}
                  displayFormat={getCurrentDateFormat()}
                  reserveSpace={false}
                  disableFuture={true}
                  onTextChange={(value, error) => {
                    onDateTextChange("EndTime", value, error);
                  }}
                  error={t(validationErrors.EndTime)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={railMarineFinishedProductInfo.FinishedProductCode}
                  label={t("MarineDispatchManualEntry_FinishedProduct")}
                  disabled={true}
                  onChange={(data) =>
                    onFieldChange("FP", "FinishedProductCode", data)
                  }
                  reserveSpace={false}
                  error={t(validationErrors.FinishedProductCode)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={railMarineFinishedProductInfo.QuantityUOM}
                  label={t("MarineDispatchManualEntry_QuantityUOM")}
                  options={Utilities.transferListtoOptions(
                    listOptions.quantityUOMList
                  )}
                  onChange={(data) => onFieldChange("FP", "QuantityUOM", data)}
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
                  error={t(validationErrors.QuantityUOM)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={railMarineFinishedProductInfo.TransactionID}
                  label={t("MarineDispatchManualEntry_TransactionNo")}
                  onChange={(data) =>
                    onFieldChange("FP", "TransactionID", data)
                  }
                  reserveSpace={false}
                  error={t(validationErrors.TransactionID)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={railMarineFinishedProductInfo.Remarks}
                  label={t("MarineDispatchManualEntry_Remarks")}
                  onChange={(data) => onFieldChange("FP", "Remarks", data)}
                  reserveSpace={false}
                  error={t(validationErrors.Remarks)}
                  disabled={!marineDispatchManualEntryEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
