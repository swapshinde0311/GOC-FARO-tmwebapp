import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select, DatePicker, Accordion, Tab } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

TruckReceiptManualEntryDetails.propTypes = {
  modTruckManualEntryLoadingDetailsCommonInfo: PropTypes.object.isRequired,
  modTruckManualEntryLoadingFPInfo: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  validationErrorsForFP: PropTypes.object.isRequired,
  currentCompTopUpReq: PropTypes.object.isRequired,
  selectedAttributeBPList: PropTypes.object.isRequired,
  bpAttributeValidationErrors: PropTypes.object.isRequired,
  selectedAttributeAdvList: PropTypes.object.isRequired,
  advAttributeValidationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    quantityUOMOptions: PropTypes.array,
    densityUOMS: PropTypes.array,
    temperatureUOMs: PropTypes.array,
    calcValueUOM: PropTypes.array,
    compartmentSeqNoInVehicleList: PropTypes.array,
    Bays: PropTypes.array,
    LoadingArms: PropTypes.array,
    BCUs: PropTypes.array,
  }).isRequired,
  modTruckManualEntryLoadingBPInfo: PropTypes.array.isRequired,
  modTruckManualEntryLoadingAdvInfo: PropTypes.array.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  productList: PropTypes.array.isRequired,
  validationErrorsForBP: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
  handleAttributeCellDataEditBPandAdditive: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
};

export function TruckReceiptManualEntryDetails({
  modTruckManualEntryLoadingDetailsCommonInfo,
  modTruckManualEntryLoadingFPInfo,
  modTruckManualEntryLoadingBPInfo,
  modTruckManualEntryLoadingAdvInfo,
  validationErrors,
  validationErrorsForFP,
  validationErrorsForBP,
  listOptions,
  onFieldChange,
  onTabChange,
  productList,
  activeIndex,
  onDateTextChange,
  selectedAttributeList,
  attributeValidationErrors,
  selectedAttributeBPList,
  bpAttributeValidationErrors,
  selectedAttributeAdvList,
  advAttributeValidationErrors,
  handleAttributeCellDataEdit,
  handleAttributeCellDataEditBPandAdditive,
  currentCompTopUpReq,
}) {
  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    if (attributeValidationErrors !== undefined)
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
        <div>
          <div className="detailsContainer">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={
                    modTruckManualEntryLoadingDetailsCommonInfo.CompartmentSeqNoInVehicle
                  }
                  label={t("LoadingDetailsEntry_CompSeqNo")}
                  options={Utilities.transferListtoOptions(
                    listOptions.compartmentSeqNoInVehicleList
                  )}
                  onChange={(data) =>
                    onFieldChange("Common", "CompartmentSeqNoInVehicle", data)
                  }
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
                  error={t(validationErrors.CompartmentSeqNoInVehicle)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={new Date(modTruckManualEntryLoadingFPInfo.StartTime)}
                  label={t("UnloadingDetailsEntry_unloadStartTime")}
                  disablePast={false}
                  type="datetime"
                  indicator="required"
                  onChange={(data) => onFieldChange("FP", "StartTime", data)}
                  displayFormat={getCurrentDateFormat()}
                  reserveSpace={false}
                  disableFuture={true}
                  minuteStep={1}
                  onTextChange={(value, error) => {
                    onDateTextChange("StartTime", value, error);
                  }}
                  error={t(validationErrorsForFP.StartTime)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={new Date(modTruckManualEntryLoadingFPInfo.EndTime)}
                  label={t("UnloadingDetailsEntry_unloadEndTime")}
                  minuteStep={1}
                  disablePast={false}
                  type="datetime"
                  indicator="required"
                  onChange={(data) => onFieldChange("FP", "EndTime", data)}
                  displayFormat={getCurrentDateFormat()}
                  reserveSpace={false}
                  disableFuture={true}
                  onTextChange={(value, error) => {
                    onDateTextChange("EndTime", value, error);
                  }}
                  error={t(validationErrorsForFP.EndTime)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={modTruckManualEntryLoadingDetailsCommonInfo.BayCode}
                  label={t("Bay_Bay")}
                  options={Utilities.transferListtoOptions(listOptions.Bays)}
                  onChange={(data) => onFieldChange("Common", "BayCode", data)}
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
                  error={t(validationErrors.BayCode)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={modTruckManualEntryLoadingDetailsCommonInfo.BCUCode}
                  label={t("LoadingDetails_BCUCode")}
                  options={Utilities.transferListtoOptions(listOptions.BCUs)}
                  onChange={(data) => onFieldChange("Common", "BCUCode", data)}
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  indicator="required"
                  noResultsMessage={t("noResultsMessage")}
                  error={t(validationErrors.BCUCode)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={modTruckManualEntryLoadingFPInfo.LoadingArmCode}
                  label={t("Loadingarm_Loadingarm")}
                  options={Utilities.transferListtoOptions(
                    listOptions.LoadingArms
                  )}
                  onChange={(data) =>
                    onFieldChange("FP", "LoadingArmCode", data)
                  }
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  indicator="required"
                  noResultsMessage={t("noResultsMessage")}
                  error={t(validationErrorsForFP.LoadingArmCode)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modTruckManualEntryLoadingFPInfo.FinishedProductCode}
                  label={t("MarineDispatchManualEntry_FinishedProduct")}
                  disabled={true}
                  onChange={(data) =>
                    onFieldChange("FP", "FinishedProductCode", data)
                  }
                  reserveSpace={false}
                  error={t(validationErrorsForFP.FinishedProductCode)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={modTruckManualEntryLoadingFPInfo.QuantityUOM}
                  label={t("LoadingDetailsEntry_QuantityUOM")}
                  indicator="required"
                  options={listOptions.quantityUOMOptions}
                  onChange={(data) => onFieldChange("FP", "QuantityUOM", data)}
                  multiple={false}
                  reserveSpace={false}
                  search={false}
                  noResultsMessage={t("noResultsMessage")}
                  error={t(validationErrorsForFP.QuantityUOM)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modTruckManualEntryLoadingFPInfo.TransactionID}
                  label={t("LoadingDetailsEntry_TransactionNo")}
                  onChange={(data) =>
                    onFieldChange("FP", "TransactionID", data)
                  }
                  reserveSpace={false}
                  error={t(validationErrorsForFP.TransactionID)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modTruckManualEntryLoadingFPInfo.Remarks}
                  label={t("LoadingDetailsEntry_Remarks")}
                  onChange={(data) => onFieldChange("FP", "Remarks", data)}
                  reserveSpace={false}
                  error={t(validationErrorsForFP.Remarks)}
                />
              </div>
            </div>

            <Tab
              activeIndex={activeIndex}
              onTabChange={(index) => onTabChange(index)}
            >
              {productList.map((item, index) => {
                let title = item.baseProductCode
                  ? t(item.productType) +
                    "-" +
                    item.code +
                    "(" +
                    t("BPCode") +
                    "-" +
                    item.baseProductCode +
                    ")"
                  : t(item.productType) + "-" + item.code;
                return (
                  <Tab.Pane key={index} title={title}>
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .GrossQuantity
                          }
                          label={t("GrossQuantity")}
                          indicator="required"
                          onChange={(data) =>
                            onFieldChange("BP", "GrossQuantity", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].GrossQuantity)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index].NetQuantity
                          }
                          label={t("NetQuantity")}
                          onChange={(data) =>
                            onFieldChange("BP", "NetQuantity", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].NetQuantity)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index].Temperature
                          }
                          label={t("Temperature")}
                          onChange={(data) =>
                            onFieldChange("BP", "Temperature", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].Temperature)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .TemperatureUOM
                          }
                          options={listOptions.temperatureUOMs}
                          placeholder="Select"
                          label={t("MarineDispatchManualEntry_TemperatureUOM")}
                          onChange={(data) =>
                            onFieldChange("BP", "TemperatureUOM", data)
                          }
                          multiple={false}
                          reserveSpace={false}
                          search={false}
                          noResultsMessage={t("noResultsMessage")}
                          error={t(validationErrorsForBP[index].TemperatureUOM)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .ProductDensity
                          }
                          label={t("ViewShipment_Density")}
                          onChange={(data) =>
                            onFieldChange("BP", "ProductDensity", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].ProductDensity)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .ProductDensityUOM
                          }
                          options={listOptions.densityUOMS}
                          placeholder="Select"
                          label={t("ViewShipment_DensityUOM")}
                          onChange={(data) =>
                            onFieldChange("BP", "ProductDensityUOM", data)
                          }
                          multiple={false}
                          reserveSpace={false}
                          search={false}
                          noResultsMessage={t("noResultsMessage")}
                          error={t(
                            validationErrorsForBP[index].ProductDensityUOM
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index].MeterCode
                          }
                          options={Utilities.transferListtoOptions(
                            listOptions.meterCodes
                          )}
                          placeholder="Select"
                          label={t("Meter_Code")}
                          onChange={(data) =>
                            onFieldChange("BP", "MeterCode", data)
                          }
                          multiple={false}
                          reserveSpace={false}
                          search={false}
                          indicator="required"
                          noResultsMessage={t("noResultsMessage")}
                          error={t(validationErrorsForBP[index].MeterCode)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index].TankCode
                          }
                          options={Utilities.transferListtoOptions(
                            listOptions.tankCodes
                          )}
                          placeholder="Select"
                          label={t("TankCode")}
                          onChange={(data) =>
                            onFieldChange("BP", "TankCode", data)
                          }
                          multiple={false}
                          reserveSpace={false}
                          search={false}
                          noResultsMessage={t("noResultsMessage")}
                          error={t(validationErrorsForBP[index].TankCode)}
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .StartTotalizer
                          }
                          label={t("StartTotalizer")}
                          onChange={(data) =>
                            onFieldChange("BP", "StartTotalizer", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].StartTotalizer)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index].EndTotalizer
                          }
                          label={t("EndTotalizer")}
                          onChange={(data) =>
                            onFieldChange("BP", "EndTotalizer", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].EndTotalizer)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .NetStartTotalizer
                          }
                          label={t(
                            "MarineDispatchManualEntry_NetStartTotalizer"
                          )}
                          onChange={(data) =>
                            onFieldChange("BP", "NetStartTotalizer", data)
                          }
                          reserveSpace={false}
                          error={t(
                            validationErrorsForBP[index].NetStartTotalizer
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .NetEndTotalizer
                          }
                          label={t("MarineDispatchManualEntry_NetEndTotalizer")}
                          onChange={(data) =>
                            onFieldChange("BP", "NetEndTotalizer", data)
                          }
                          reserveSpace={false}
                          error={t(
                            validationErrorsForBP[index].NetEndTotalizer
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .CalculatedGross
                          }
                          label={t("LoadingDetails_CalculatedGross")}
                          onChange={(data) =>
                            onFieldChange("BP", "CalculatedGross", data)
                          }
                          reserveSpace={false}
                          error={t(
                            validationErrorsForBP[index].CalculatedGross
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .CalculatedNet
                          }
                          label={t("LoadingDetails_CalculatedNet")}
                          onChange={(data) =>
                            onFieldChange("BP", "CalculatedNet", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].CalculatedNet)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            modTruckManualEntryLoadingBPInfo[index]
                              .CalculatedValueUOM
                          }
                          options={listOptions.calcValueUOM}
                          placeholder="Select"
                          label={t("LoadingDetails_CalculatedValueUOM")}
                          onChange={(data) =>
                            onFieldChange("BP", "CalculatedValueUOM", data)
                          }
                          multiple={false}
                          reserveSpace={false}
                          search={false}
                          noResultsMessage={t("noResultsMessage")}
                          error={t(
                            validationErrorsForBP[index].CalculatedValueUOM
                          )}
                        />
                      </div>
                    </div>
                    {selectedAttributeList.length > 0
                      ? selectedAttributeList.map((attire) => (
                          <ErrorBoundary>
                            <Accordion>
                              <Accordion.Content
                                className="attributeAccordian"
                                title={t("Attributes_Header")}
                              >
                                <AttributeDetails
                                  selectedAttributeList={
                                    attire.attributeMetaDataList
                                  }
                                  handleCellDataEdit={
                                    handleAttributeCellDataEdit
                                  }
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
                  </Tab.Pane>
                );
              })}
            </Tab>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
