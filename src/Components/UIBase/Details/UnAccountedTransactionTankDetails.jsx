import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select, DatePicker, Accordion } from "@scuf/common";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
UnAccountedTransactionTankDetails.propTypes = {
  listOptions: PropTypes.shape({
    languageOptions: PropTypes.array,
    terminalCodes: PropTypes.array,
    densityUOMOptions: PropTypes.array,
    customerOptions: PropTypes.array,
    quantityUOMOptions: PropTypes.array,
    tankCodeOptions: PropTypes.array,
    transactionTypeOptions: PropTypes.array,
    baseProdcutOptions: PropTypes.array,
    transportationTypeOptions: PropTypes.array,
  }).isRequired,
  validationErrors: PropTypes.object.isRequired,
  modAccountedTransaction: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onCustomerSearchChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
};
UnAccountedTransactionTankDetails.defaultProps = {
  listOptions: {
    quantityUOMOptions: [],
    densityUOMOptions: [],
    tankCodeOptions: [],
    customerOptions: [],
    transactionTypeOptions: [],
    baseProdcutOptions: [],
    transportationTypeOptions: [],
  },
};

export function UnAccountedTransactionTankDetails({
  modAccountedTransaction,
  listOptions,
  validationErrors,
  onFieldChange,
  onCustomerSearchChange,
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
                label={t("Reconciliation_Tank")}
                indicator="required"
                value={modAccountedTransaction.TankCode}
                options={listOptions.tankCodeOptions}
                onChange={(data) => onFieldChange("TankCode", data)}
                reserveSpace={false}
                error={t(validationErrors.TankCode)}
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
                value={modAccountedTransaction.UnAccountedTransactionTypeCode}
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
                value={modAccountedTransaction.TransportationType}
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
                value={modAccountedTransaction.QuantityUOM}
                error={t(validationErrors.QuantityUOM)}

                //error={t(validationErrors.ShipmentQuantityUOM)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                label={t("GrossQuantity")}
                onChange={(data) =>
                  onFieldChange("UnAccountedGrossQuantity", data)
                }
                reserveSpace={false}
                value={modAccountedTransaction.UnAccountedGrossQuantity}
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
                value={modAccountedTransaction.UnAccountedNetQuantity}
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
                value={modAccountedTransaction.Density}
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
                value={modAccountedTransaction.DensityUOM}
                error={t(validationErrors.DensityUOM)}
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
                value={modAccountedTransaction.TransactionStartTime}
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
                  modAccountedTransaction.TransactionEndTime === null
                    ? ""
                    : modAccountedTransaction.TransactionEndTime
                }
                error={t(validationErrors.TransactionEndTime)}
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
                value={modAccountedTransaction.BaseProductCode}
                error={t(validationErrors.BaseProductCode)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("Reconciliation_Comments")}
                onChange={(data) => onFieldChange("Comments", data)}
                reserveSpace={false}
                value={modAccountedTransaction.Comments}
                error={t(validationErrors.Comments)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                options={listOptions.customerOptions}
                label={t("ViewMarineShipmentList_Customer")}
                search={true}
                onChange={(data) => onFieldChange("CustomerCode", data)}
                onSearch={onCustomerSearchChange}
                reserveSpace={false}
                value={modAccountedTransaction.CustomerCode}
                error={t(validationErrors.CustomerCode)}
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
