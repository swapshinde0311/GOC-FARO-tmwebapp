import React from "react";
import { Input, Select, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import * as Utilities from "../../../JS/Utilities";
import PropTypes from "prop-types";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";

MarineReceiptManualEntryBaseProductDetails.propTypes = {
  validationErrors: PropTypes.object,
  listOptions: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  railMarineTransactionBPInfo: PropTypes.object,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
};

MarineReceiptManualEntryBaseProductDetails.defaultProps = {
  isEnterpriseNode: false,
};

export function MarineReceiptManualEntryBaseProductDetails({
  validationErrors,
  listOptions,
  index,
  onFieldChange,
  railMarineTransactionBPInfo,
  code,
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
                value={railMarineTransactionBPInfo.GrossQuantity}
                onChange={(data) => onFieldChange("GrossQuantity", data, code)}
                reserveSpace={false}
                error={t(validationErrors.GrossQuantity)}
              ></Input>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_NetQuantity")}
                value={railMarineTransactionBPInfo.NetQuantity}
                onChange={(data) => onFieldChange("NetQuantity", data, code)}
                reserveSpace={false}
                error={t(validationErrors.NetQuantity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_Temperature")}
                value={railMarineTransactionBPInfo.Temperature}
                onChange={(data) => onFieldChange("Temperature", data, code)}
                reserveSpace={false}
                error={t(validationErrors.Temperature)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("MarineReceiptManualEntry_TemperatureUOM")}
                value={railMarineTransactionBPInfo.TemperatureUOM}
                onChange={(data) => onFieldChange("TemperatureUOM", data, code)}
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
                value={railMarineTransactionBPInfo.ProductDensity}
                onChange={(data) => onFieldChange("ProductDensity", data, code)}
                reserveSpace={false}
                error={t(validationErrors.ProductDensity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("BaseProductInfox_UOM")}
                value={railMarineTransactionBPInfo.ProductDensityUOM}
                onChange={(data) =>
                  onFieldChange("ProductDensityUOM", data, code)
                }
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
                value={railMarineTransactionBPInfo.ReferenceDensity}
                onChange={(data) =>
                  onFieldChange("ReferenceDensity", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.ReferenceDensity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("MeterCode")}
                value={railMarineTransactionBPInfo.MeterCode}
                onChange={(data) => onFieldChange("MeterCode", data, code)}
                options={getOptionsWithSelect(
                  listOptions.meterCodeList,
                  t("Common_Select")
                )}
                indicator="required"
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
                value={railMarineTransactionBPInfo.StartTotalizer}
                onChange={(data) => onFieldChange("StartTotalizer", data, code)}
                reserveSpace={false}
                error={t(validationErrors.StartTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("EndTotalizer")}
                value={railMarineTransactionBPInfo.EndTotalizer}
                onChange={(data) => onFieldChange("EndTotalizer", data, code)}
                reserveSpace={false}
                error={t(validationErrors.EndTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_NetStartTotalizer")}
                value={railMarineTransactionBPInfo.NetStartTotalizer}
                onChange={(data) =>
                  onFieldChange("NetStartTotalizer", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.NetStartTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_NetEndTotalizer")}
                value={railMarineTransactionBPInfo.NetEndTotalizer}
                onChange={(data) =>
                  onFieldChange("NetEndTotalizer", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.NetEndTotalizer)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("ViewMarineUnloadingDetails_Mass")}
                value={railMarineTransactionBPInfo.GrossMass}
                onChange={(data) => onFieldChange("GrossMass", data, code)}
                reserveSpace={false}
                error={t(validationErrors.GrossMass)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("BCU_MassUOM")}
                value={railMarineTransactionBPInfo.MassUOM}
                onChange={(data) => onFieldChange("MassUOM", data, code)}
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
              <Select
                fluid
                placeholder="Select"
                label={t("Marine_ReceiptCompDetail_Tank")}
                value={railMarineTransactionBPInfo.TankCode}
                options={getOptionsWithSelect(
                  listOptions.tankList[index],
                  t("Common_Select")
                )}
                onChange={(data) => onFieldChange("TankCode", data, code)}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
              ></Select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("MarineReceiptManualEntry_Pressure")}
                value={railMarineTransactionBPInfo.Pressure}
                onChange={(data) => onFieldChange("Pressure", data, code)}
                reserveSpace={false}
                error={t(validationErrors.Pressure)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("BCU_PressureUOM")}
                value={railMarineTransactionBPInfo.PressureUOM}
                onChange={(data) => onFieldChange("PressureUOM", data, code)}
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
                label={t("ViewMarineUnloadingDetails_TankStartGrossQuantity")}
                value={railMarineTransactionBPInfo.TankStartGrossQuantity}
                onChange={(data) =>
                  onFieldChange("TankStartGrossQuantity", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.TankStartGrossQuantity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("ViewMarineUnloadingDetails_TankEndGrossQuantity")}
                value={railMarineTransactionBPInfo.TankEndGrossQuantity}
                onChange={(data) =>
                  onFieldChange("TankEndGrossQuantity", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.TankEndGrossQuantity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("ViewMarineUnloadingDetails_TankStartNetQuantity")}
                value={railMarineTransactionBPInfo.TankStartNetQuantity}
                onChange={(data) =>
                  onFieldChange("TankStartNetQuantity", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.TankStartNetQuantity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("ViewMarineUnloadingDetails_TankEndNetQuantity")}
                value={railMarineTransactionBPInfo.TankEndNetQuantity}
                onChange={(data) =>
                  onFieldChange("TankEndNetQuantity", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.TankEndNetQuantity)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("ViewMarineUnloadingDetails_TankStartGrossMass")}
                value={railMarineTransactionBPInfo.TankStartGrossMass}
                onChange={(data) =>
                  onFieldChange("TankStartGrossMass", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.TankStartGrossMass)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("ViewMarineUnloadingDetails_TankEndGrossMass")}
                value={railMarineTransactionBPInfo.TankEndGrossMass}
                onChange={(data) =>
                  onFieldChange("TankEndGrossMass", data, code)
                }
                reserveSpace={false}
                error={validationErrors.TankEndGrossMass}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("LoadingDetailsEntry_TankStartPressure")}
                value={railMarineTransactionBPInfo.TankStartPressure}
                onChange={(data) =>
                  onFieldChange("TankStartPressure", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.TankStartPressure)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("LoadingDetailsEntry_TankEndPressure")}
                value={railMarineTransactionBPInfo.TankEndPressure}
                onChange={(data) =>
                  onFieldChange("TankEndPressure", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.TankEndPressure)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("LoadingDetailsEntry_CalculatedGross")}
                value={railMarineTransactionBPInfo.CalculatedGross}
                onChange={(data) =>
                  onFieldChange("CalculatedGross", data, code)
                }
                reserveSpace={false}
                error={t(validationErrors.CalculatedGross)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("LoadingDetailsEntry_CalculatedNet")}
                value={railMarineTransactionBPInfo.CalculatedNet}
                onChange={(data) => onFieldChange("CalculatedNet", data, code)}
                reserveSpace={false}
                error={t(validationErrors.CalculatedNet)}
              ></Input>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("LoadingDetailsEntry_CalculatedValueUOM")}
                value={railMarineTransactionBPInfo.CalculatedValueUOM}
                onChange={(data) =>
                  onFieldChange("CalculatedValueUOM", data, code)
                }
                options={Utilities.transferListtoOptions(
                  listOptions.calculatedValueUOMList
                )}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.CalculatedValueUOM)}
              ></Select>
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
}
