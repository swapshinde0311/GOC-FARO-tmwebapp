import React from "react";
import { Input, Select, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import * as Utilities from "../../../JS/Utilities";
import PropTypes from "prop-types";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";

MarineReceiptManualEntryFPTransactionsDetails.propTypes = {
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  railMarineTransactionCommonInfo: PropTypes.object.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
};

export function MarineReceiptManualEntryFPTransactionsDetails({
  validationErrors,
  listOptions,
  onFieldChange,
  railMarineTransactionCommonInfo,
  selectedAttributeList,
  handleAttributeCellDataEdit,
  attributeValidationErrors,
  isEnterpriseNode,
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
                indicator="required"
                label={t("GrossQuantity")}
                value={railMarineTransactionCommonInfo.GrossQuantity}
                onChange={(data) => onFieldChange("GrossQuantity", data)}
                reserveSpace={false}
                error={t(validationErrors.GrossQuantity)}
              ></Input>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_NetQuantity")}
                value={railMarineTransactionCommonInfo.NetQuantity}
                onChange={(data) => onFieldChange("NetQuantity", data)}
                reserveSpace={false}
                error={t(validationErrors.NetQuantity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_Temperature")}
                value={railMarineTransactionCommonInfo.Temperature}
                onChange={(data) => onFieldChange("Temperature", data)}
                reserveSpace={false}
                error={t(validationErrors.Temperature)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("MarineReceiptManualEntry_TemperatureUOM")}
                value={railMarineTransactionCommonInfo.TemperatureUOM}
                onChange={(data) => onFieldChange("TemperatureUOM", data)}
                options={getOptionsWithSelect(
                  listOptions.temperatureUOMList,
                  t("Common_Select")
                )}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.TemperatureUOM)}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("Density")}
                value={railMarineTransactionCommonInfo.ProductDensity}
                onChange={(data) => onFieldChange("ProductDensity", data)}
                reserveSpace={false}
                error={t(validationErrors.ProductDensity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("BaseProductInfox_UOM")}
                value={railMarineTransactionCommonInfo.ProductDensityUOM}
                onChange={(data) => onFieldChange("ProductDensityUOM", data)}
                options={getOptionsWithSelect(
                  listOptions.densityUOMList,
                  t("Common_Select")
                )}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.ProductDensityUOM)}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineDispatchManualEntry_ReferenceDensity")}
                value={railMarineTransactionCommonInfo.ReferenceDensity}
                onChange={(data) => onFieldChange("ReferenceDensity", data)}
                reserveSpace={false}
                error={t(validationErrors.ReferenceDensity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("MeterCode")}
                value={railMarineTransactionCommonInfo.MeterCode}
                onChange={(data) => onFieldChange("MeterCode", data)}
                options={getOptionsWithSelect(
                  listOptions.meterCodeList,
                  t("Common_Select")
                )}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.MeterCode)}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_StartTotalizer")}
                value={railMarineTransactionCommonInfo.StartTotalizer}
                onChange={(data) => onFieldChange("StartTotalizer", data)}
                reserveSpace={false}
                error={t(validationErrors.StartTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("EndTotalizer")}
                value={railMarineTransactionCommonInfo.EndTotalizer}
                onChange={(data) => onFieldChange("EndTotalizer", data)}
                reserveSpace={false}
                error={t(validationErrors.EndTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_NetStartTotalizer")}
                value={railMarineTransactionCommonInfo.NetStartTotalizer}
                onChange={(data) => onFieldChange("NetStartTotalizer", data)}
                reserveSpace={false}
                error={t(validationErrors.NetStartTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_NetEndTotalizer")}
                value={railMarineTransactionCommonInfo.NetEndTotalizer}
                onChange={(data) => onFieldChange("NetEndTotalizer", data)}
                reserveSpace={false}
                error={t(validationErrors.NetEndTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("ViewMarineUnloadingDetails_Mass")}
                value={railMarineTransactionCommonInfo.GrossMass}
                onChange={(data) => onFieldChange("GrossMass", data)}
                reserveSpace={false}
                error={t(validationErrors.GrossMass)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("BCU_MassUOM")}
                value={railMarineTransactionCommonInfo.MassUOM}
                onChange={(data) => onFieldChange("MassUOM", data)}
                options={getOptionsWithSelect(
                  listOptions.massUOMList,
                  t("Common_Select")
                )}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.MassUOM)}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_Pressure")}
                value={railMarineTransactionCommonInfo.Pressure}
                onChange={(data) => onFieldChange("Pressure", data)}
                reserveSpace={false}
                error={t(validationErrors.Pressure)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("BCU_PressureUOM")}
                value={railMarineTransactionCommonInfo.PressureUOM}
                onChange={(data) => onFieldChange("PressureUOM", data)}
                options={getOptionsWithSelect(
                  listOptions.pressureUOMList,
                  t("Common_Select")
                )}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.PressureUOM)}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("LoadingDetailsEntry_CalculatedGross")}
                value={railMarineTransactionCommonInfo.CalculatedGross}
                onChange={(data) => onFieldChange("CalculatedGross", data)}
                reserveSpace={false}
                error={t(validationErrors.CalculatedGross)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("LoadingDetailsEntry_CalculatedNet")}
                value={railMarineTransactionCommonInfo.CalculatedNet}
                onChange={(data) => onFieldChange("CalculatedNet", data)}
                reserveSpace={false}
                error={t(validationErrors.CalculatedNet)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("LoadingDetailsEntry_CalculatedValueUOM")}
                value={railMarineTransactionCommonInfo.CalculatedValueUOM}
                onChange={(data) => onFieldChange("CalculatedValueUOM", data)}
                options={Utilities.transferListtoOptions(
                  listOptions.calculatedValueUOMList
                )}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.CalculatedValueUOM)}
              ></Select>
            </div>
            {selectedAttributeList.length > 0
              ? selectedAttributeList.map((attire) => (
                  <ErrorBoundary>
                    <Accordion>
                      <Accordion.Content
                        className="attributeAccordian"
                        title={
                          isEnterpriseNode
                            ? attire.TerminalCode +
                              " - " +
                              t("Attributes_Header")
                            : t("Attributes_Header")
                        }
                      >
                        <AttributeDetails
                          selectedAttributeList={attire.attributeMetaDataList}
                          handleCellDataEdit={handleAttributeCellDataEdit}
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
        </div>
      )}
    </TranslationConsumer>
  );
}
