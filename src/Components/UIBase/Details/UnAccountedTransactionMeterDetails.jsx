import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select, DatePicker, Accordion } from "@scuf/common";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
UnAccountedTransactionMeterDetails.propTypes = {
  listOptions: PropTypes.shape({
    densityUOMOptions: PropTypes.array,
    quantityUOMOptions: PropTypes.array,
    meterCodeOptions: PropTypes.array,
    tankCodeOption: PropTypes.array,
    transactionTypeOptions: PropTypes.array,
    baseProdcutOptions: PropTypes.array,
    transportationTypeOptions: PropTypes.array,
  }).isRequired,
  validationErrors: PropTypes.object.isRequired,
  modAccountedMeterTransaction: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
};
UnAccountedTransactionMeterDetails.defaultProps = {
  listOptions: {
    quantityUOMOptions: [],
    densityUOMOptions: [],
    meterCodeOptions: [],
    transactionTypeOptions: [],
    baseProdcutOptions: [],
    tankCodeOptions: [],
    transportationTypeOptions: [],
  },
};

export function UnAccountedTransactionMeterDetails({
  modAccountedMeterTransaction,
  listOptions,
  validationErrors,
  onFieldChange,
  isEnterpriseNode,
  selectedAttributeList,
  attributeValidationErrors,
  handleCellDataEdit,
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
              <Select
                fluid
                placeholder="Select"
                label={t("Reconciliation_Meter")}
                indicator="required"
                value={modAccountedMeterTransaction.MeterCode}
                options={listOptions.meterCodeOptions}
                onChange={(data) => onFieldChange("MeterCode", data)}
                reserveSpace={false}
                error={t(validationErrors.MeterCode)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("Reconciliation_UnAccountedType")}
                indicator="required"
                options={listOptions.transactionTypeOptions}
                reserveSpace={false}
                onChange={(data) =>
                  onFieldChange("UnAccountedTransactionTypeCode", data)
                }
                value={
                  modAccountedMeterTransaction.UnAccountedTransactionTypeCode
                }
                error={t(validationErrors.UnAccountedTransactionTypeCode)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("Vehicle_Transport")}
                indicator="required"
                options={listOptions.transportationTypeOptions}
                onChange={(data) => onFieldChange("TransportationType", data)}
                value={modAccountedMeterTransaction.TransportationType}
                error={t(validationErrors.TransportationType)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("Reconciliation_QuantityUOM")}
                indicator="required"
                onChange={(data) => onFieldChange("QuantityUOM", data)}
                search={true}
                options={listOptions.quantityUOMOptions}
                reserveSpace={false}
                value={modAccountedMeterTransaction.QuantityUOM}
                error={t(validationErrors.QuantityUOM)}

                //error={t(validationErrors.ShipmentQuantityUOM)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("Reconciliation_Quantity")}
                onChange={(data) =>
                  onFieldChange("UnAccountedGrossQuantity", data)
                }
                reserveSpace={false}
                value={modAccountedMeterTransaction.UnAccountedGrossQuantity}
                error={t(validationErrors.UnAccountedGrossQuantity)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("Reconciliation_NetQuantity")}
                onChange={(data) =>
                  onFieldChange("UnAccountedNetQuantity", data)
                }
                reserveSpace={false}
                value={modAccountedMeterTransaction.UnAccountedNetQuantity}
                error={t(validationErrors.UnAccountedNetQuantity)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("Reconciliation_Density")}
                onChange={(data) => onFieldChange("Density", data)}
                reserveSpace={false}
                value={modAccountedMeterTransaction.Density}
                error={t(validationErrors.Density)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("Reconciliation_DensityUOM")}
                indicator="required"
                options={listOptions.densityUOMOptions}
                reserveSpace={false}
                search={true}
                onChange={(data) => onFieldChange("DensityUOM", data)}
                value={modAccountedMeterTransaction.DensityUOM}
                error={t(validationErrors.DensityUOM)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("Reconciliation_StartGrossTotalizer")}
                onChange={(data) => onFieldChange("GrossStartTotalizer", data)}
                reserveSpace={false}
                value={modAccountedMeterTransaction.GrossStartTotalizer}
                error={t(validationErrors.GrossStartTotalizer)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("Reconciliation_EndGrossTotalizer")}
                onChange={(data) => onFieldChange("GrossEndTotalizer", data)}
                reserveSpace={false}
                value={modAccountedMeterTransaction.GrossEndTotalizer}
                error={t(validationErrors.GrossEndTotalizer)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("Reconciliation_StartNetTotalizer")}
                onChange={(data) => onFieldChange("NetStartTotalizer", data)}
                reserveSpace={false}
                value={modAccountedMeterTransaction.NetStartTotalizer}
                error={t(validationErrors.NetStartTotalizer)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("Reconciliation_EndNetTotalizer")}
                onChange={(data) => onFieldChange("NetEndTotalizer", data)}
                reserveSpace={false}
                value={modAccountedMeterTransaction.NetEndTotalizer}
                error={t(validationErrors.NetEndTotalizer)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                //value={modRailWagon.LicenseExpiryDate === null ? "" : new Date(modRailWagon.LicenseExpiryDate)}
                label={t("Reconciliation_StartTime")}
                type="datetime"
                minuteStep="5"
                indicator="required"
                onChange={(data) => onFieldChange("TransactionStartTime", data)}
                displayFormat={getCurrentDateFormat()}
                reserveSpace={false}
                value={
                  modAccountedMeterTransaction.TransactionStartTime === null
                    ? ""
                    : modAccountedMeterTransaction.TransactionStartTime
                }
                error={t(validationErrors.TransactionStartTime)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                //value={modRailWagon.LicenseExpiryDate === null ? "" : new Date(modRailWagon.LicenseExpiryDate)}
                label={t("Reconciliation_EndTime")}
                type="datetime"
                minuteStep="5"
                indicator="required"
                onChange={(data) => onFieldChange("TransactionEndTime", data)}
                displayFormat={getCurrentDateFormat()}
                //error={t(validationErrors.LicenseExpiryDate)}
                reserveSpace={false}
                value={
                  modAccountedMeterTransaction.TransactionEndTime === null
                    ? ""
                    : modAccountedMeterTransaction.TransactionEndTime
                }
                error={t(validationErrors.TransactionEndTime)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("Reconciliation_Tank")}
                indicator="required"
                options={listOptions.tankCodeOptions}
                reserveSpace={false}
                onChange={(data) => onFieldChange("TankCode", data)}
                value={modAccountedMeterTransaction.TankCode}
                error={t(validationErrors.TankCode)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("Reconciliation_Comments")}
                onChange={(data) => onFieldChange("Comments", data)}
                reserveSpace={false}
                value={modAccountedMeterTransaction.Comments}
                error={t(validationErrors.Comments)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("Reconciliation_BaseProduct")}
                indicator="required"
                options={listOptions.baseProdcutOptions}
                reserveSpace={false}
                onChange={(data) => onFieldChange("BaseProductCode", data)}
                value={modAccountedMeterTransaction.BaseProductCode}
                error={t(validationErrors.BaseProductCode)}
              />
            </div>
          </div>
          {selectedAttributeList.length > 0
            ? selectedAttributeList.map((attribute) => (
                <ErrorBoundary>
                  <Accordion>
                    <Accordion.Content
                      className="attributeAccordian"
                      title={
                        isEnterpriseNode
                          ? attribute.TerminalCode +
                            " - " +
                            t("Attributes_Header")
                          : t("Attributes_Header")
                      }
                    >
                      <AttributeDetails
                        selectedAttributeList={attribute.attributeMetaDataList}
                        handleCellDataEdit={handleCellDataEdit}
                        attributeValidationErrors={handleValidationErrorFilter(
                          attributeValidationErrors,
                          attribute.TerminalCode
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
}
