import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select, DatePicker, Accordion, Tab } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

TruckShipmentManualEntryDetails.propTypes = {
  modTruckManualEntryLoadingDetailsCommonInfo: PropTypes.object.isRequired,
  modTruckManualEntryLoadingFPInfo: PropTypes.object.isRequired,
  modRailMarineTransactionCommonInfo: PropTypes.object.isRequired,
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
    wagonCodes: PropTypes.array,
    receiptCodes: PropTypes.array,
    marineReceiptCompCodes: PropTypes.array,
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
  transloadSource: PropTypes.string.isRequired,
  isBCUTransload: PropTypes.bool.isRequired,
  // railReceipts: PropTypes.array.isRequired,
  // marineReceipts: PropTypes.array.isRequired,
};

TruckShipmentManualEntryDetails.defaultProps = {};

export function TruckShipmentManualEntryDetails({
  modTruckManualEntryLoadingDetailsCommonInfo,
  modTruckManualEntryLoadingFPInfo,
  modTruckManualEntryLoadingBPInfo,
  modTruckManualEntryLoadingAdvInfo,
  modRailMarineTransactionCommonInfo,
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
  transloadSource,
  isBCUTransload,

  // railReceipts,
  // marineReceipts
}) {
  console.log("In HTML", modTruckManualEntryLoadingFPInfo);
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
                  label={t("LoadingDetailsEntry_loadStartTime")}
                  disablePast={false}
                  type="datetime"
                  indicator="required"
                  onChange={(data) => onFieldChange("FP", "StartTime", data)}
                  displayFormat={getCurrentDateFormat()}
                  minuteStep={1}
                  reserveSpace={false}
                  disableFuture={true}
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
                  label={t("LoadingDetailsEntry_loadEndTime")}
                  disablePast={false}
                  type="datetime"
                  indicator="required"
                  onChange={(data) => onFieldChange("FP", "EndTime", data)}
                  displayFormat={getCurrentDateFormat()}
                  minuteStep={1}
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
                  noResultsMessage={t("noResultsMessage")}
                  indicator="required"
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
                  noResultsMessage={t("noResultsMessage")}
                  error={t(validationErrorsForFP.LoadingArmCode)}
                  indicator="required"
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
              {isBCUTransload ? (
                <div className="col-12 col-md-6 col-lg-4">
                  <Select
                    fluid
                    placeholder="Select"
                    value={modRailMarineTransactionCommonInfo.ReceiptCode}
                    label={
                      transloadSource === "RAIL"
                        ? t("Rail_Receipt_Code_ME")
                        : t("LD_Marine_ReceiptCode")
                    }
                    indicator="required"
                    options={listOptions.receiptCodes}
                    onChange={(data) =>
                      onFieldChange(
                        transloadSource === "RAIL"
                          ? "RailTransload"
                          : "MarineTransload",
                        "ReceiptCode",
                        data
                      )
                    }
                    multiple={false}
                    reserveSpace={false}
                    search={false}
                    noResultsMessage={t("noResultsMessage")}
                    error={t(validationErrors.ReceiptCode)}
                  />
                </div>
              ) : null}
              {isBCUTransload && transloadSource === "RAIL" ? (
                <div className="col-12 col-md-6 col-lg-4">
                  <Select
                    fluid
                    placeholder="Select"
                    value={modRailMarineTransactionCommonInfo.TrailerCode}
                    label={t("RailWagonConfigurationDetails_RailWagonCode")}
                    indicator="required"
                    options={listOptions.wagonCodes}
                    onChange={(data) =>
                      onFieldChange("RailTransload", "TrailerCode", data)
                    }
                    multiple={false}
                    reserveSpace={false}
                    search={false}
                    noResultsMessage={t("noResultsMessage")}
                    error={t(validationErrors.TrailerCode)}
                  />
                </div>
              ) : null}
              {isBCUTransload && transloadSource === "MARINE" ? (
                <div className="col-12 col-md-6 col-lg-4">
                  <Select
                    fluid
                    placeholder="Select"
                    value={
                      modRailMarineTransactionCommonInfo.CompartmentSeqNoInVehicle
                    }
                    label={t("LD_Marine_ReceiptCompCode")}
                    indicator="required"
                    options={listOptions.marineReceiptCompCodes}
                    onChange={(data) =>
                      onFieldChange(
                        "MarineTransload",
                        "CompartmentSeqNoInVehicle",
                        data
                      )
                    }
                    multiple={false}
                    reserveSpace={false}
                    search={false}
                    noResultsMessage={t("noResultsMessage")}
                    error={t(validationErrors.MarineReceiptCompCode)}
                  />{" "}
                </div>
              ) : null}
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
              <Tab.Pane
                title={
                  modTruckManualEntryLoadingFPInfo.FinishedProductCode === ""
                    ? t("FinishedProduct")
                    : t("FinishedProduct") +
                      "-" +
                      modTruckManualEntryLoadingFPInfo.FinishedProductCode
                }
              >
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.GrossQuantity}
                      label={t("GrossQuantity")}
                      indicator="required"
                      onChange={(data) =>
                        onFieldChange("FP", "GrossQuantity", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.GrossQuantity)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.NetQuantity}
                      label={t("NetQuantity")}
                      onChange={(data) =>
                        onFieldChange("FP", "NetQuantity", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.NetQuantity)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.Temperature}
                      label={t("Temperature")}
                      onChange={(data) =>
                        onFieldChange("FP", "Temperature", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.Temperature)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.TemperatureUOM}
                      options={listOptions.temperatureUOMs}
                      placeholder="Select"
                      label={t("MarineDispatchManualEntry_TemperatureUOM")}
                      onChange={(data) =>
                        onFieldChange("FP", "TemperatureUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(validationErrorsForFP.TemperatureUOM)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.ProductDensity}
                      indicator={
                        currentCompTopUpReq.IsWeightBased === "0"
                          ? null
                          : "required"
                      }
                      label={t("ViewShipment_Density")}
                      onChange={(data) =>
                        onFieldChange("FP", "ProductDensity", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.ProductDensity)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.ProductDensityUOM}
                      indicator={
                        currentCompTopUpReq.IsWeightBased === "0"
                          ? null
                          : "required"
                      }
                      options={listOptions.densityUOMS}
                      placeholder="Select"
                      label={t("ViewShipment_DensityUOM")}
                      onChange={(data) =>
                        onFieldChange("FP", "ProductDensityUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(validationErrorsForFP.ProductDensityUOM)}
                    />
                  </div>
                  {/* <div className="col-12 col-md-6 col-lg-4">
                                        <Select
                                            fluid
                                            value={modTruckManualEntryLoadingFPInfo.TankCode}
                                            options={Utilities.transferListtoOptions(
                                                listOptions.tankCodes
                                            )}
                                            placeholder="Select"
                                            label={t("TankCode")}
                                            onChange={(data) => onFieldChange("FP", "TankCode", data)}
                                            multiple={false}
                                            reserveSpace={false}
                                            search={false}
                                            noResultsMessage={t("noResultsMessage")}
                                            error={t(validationErrorsForFP.TankCode)}
                                        />
                                    </div> */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.MeterCode}
                      options={Utilities.transferListtoOptions(
                        listOptions.meterCodes
                      )}
                      placeholder="Select"
                      label={t("Meter_Code")}
                      onChange={(data) =>
                        onFieldChange("FP", "MeterCode", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(validationErrorsForFP.MeterCode)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.StartTotalizer}
                      label={t("StartTotalizer")}
                      onChange={(data) =>
                        onFieldChange("FP", "StartTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.StartTotalizer)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.EndTotalizer}
                      label={t("EndTotalizer")}
                      onChange={(data) =>
                        onFieldChange("FP", "EndTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.EndTotalizer)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.NetStartTotalizer}
                      label={t("MarineDispatchManualEntry_NetStartTotalizer")}
                      onChange={(data) =>
                        onFieldChange("FP", "NetStartTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.NetStartTotalizer)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.NetEndTotalizer}
                      label={t("MarineDispatchManualEntry_NetEndTotalizer")}
                      onChange={(data) =>
                        onFieldChange("FP", "NetEndTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.NetEndTotalizer)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.CalculatedGross}
                      label={t("LoadingDetails_CalculatedGross")}
                      onChange={(data) =>
                        onFieldChange("FP", "CalculatedGross", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.CalculatedGross)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modTruckManualEntryLoadingFPInfo.CalculatedNet}
                      label={t("LoadingDetails_CalculatedNet")}
                      onChange={(data) =>
                        onFieldChange("FP", "CalculatedNet", data)
                      }
                      reserveSpace={false}
                      error={t(validationErrorsForFP.CalculatedNet)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={
                        modTruckManualEntryLoadingFPInfo.CalculatedValueUOM
                      }
                      options={listOptions.calcValueUOM}
                      placeholder="Select"
                      label={t("LoadingDetails_CalculatedValueUOM")}
                      onChange={(data) =>
                        onFieldChange("FP", "CalculatedValueUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(validationErrorsForFP.CalculatedValueUOM)}
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
              </Tab.Pane>
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
                let advIndex = item.baseProductCode
                  ? modTruckManualEntryLoadingAdvInfo.findIndex(
                      (adv) => adv.AdditiveProductCode === item.code
                    )
                  : 0;
                return (
                  <Tab.Pane key={index} title={title}>
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .GrossQuantity
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .GrossQuantity
                          }
                          label={t("GrossQuantity")}
                          indicator="required"
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "GrossQuantity",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "GrossQuantity", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].GrossQuantity)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .NetQuantity
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .NetQuantity
                          }
                          label={t("NetQuantity")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "NetQuantity",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "NetQuantity", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].NetQuantity)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .Temperature
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .Temperature
                          }
                          label={t("Temperature")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "Temperature",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "Temperature", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].Temperature)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            modTruckManualEntryLoadingFPInfo.TemperatureUOM
                          }
                          options={listOptions.temperatureUOMs}
                          placeholder="Select"
                          label={t("MarineDispatchManualEntry_TemperatureUOM")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "TemperatureUOM",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "TemperatureUOM", data)
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
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .ProductDensity
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .ProductDensity
                          }
                          indicator={
                            currentCompTopUpReq.IsWeightBased === "0"
                              ? null
                              : "required"
                          }
                          label={t("ViewShipment_Density")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "ProductDensity",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "ProductDensity", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].ProductDensity)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            modTruckManualEntryLoadingFPInfo.ProductDensityUOM
                          }
                          indicator={
                            currentCompTopUpReq.IsWeightBased === "0"
                              ? null
                              : "required"
                          }
                          options={listOptions.densityUOMS}
                          placeholder="Select"
                          label={t("ViewShipment_DensityUOM")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "ProductDensityUOM",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "ProductDensityUOM", data)
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
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .MeterCode
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .MeterCode
                          }
                          options={Utilities.transferListtoOptions(
                            listOptions.meterCodes
                          )}
                          placeholder="Select"
                          label={t("Meter_Code")}
                          indicator="required"
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "MeterCode",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "MeterCode", data)
                          }
                          multiple={false}
                          reserveSpace={false}
                          search={false}
                          noResultsMessage={t("noResultsMessage")}
                          error={t(validationErrorsForBP[index].MeterCode)}
                        />
                      </div>

                      {!isBCUTransload ? (
                        <div className="col-12 col-md-6 col-lg-4">
                          <Select
                            fluid
                            value={
                              item.baseProductCode
                                ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                    .TankCode
                                : modTruckManualEntryLoadingBPInfo[index]
                                    .TankCode
                            }
                            options={Utilities.transferListtoOptions(
                              listOptions.tankCodes
                            )}
                            placeholder="Select"
                            label={t("TankCode")}
                            onChange={(data) =>
                              item.baseProductCode
                                ? onFieldChange(
                                    "Additive",
                                    "TankCode",
                                    data,
                                    item.code
                                  )
                                : onFieldChange("BP", "TankCode", data)
                            }
                            multiple={false}
                            reserveSpace={false}
                            search={false}
                            noResultsMessage={t("noResultsMessage")}
                            error={t(validationErrorsForBP[index].TankCode)}
                          />
                        </div>
                      ) : null}

                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .StartTotalizer
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .StartTotalizer
                          }
                          label={t("StartTotalizer")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "StartTotalizer",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "StartTotalizer", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].StartTotalizer)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .EndTotalizer
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .EndTotalizer
                          }
                          label={t("EndTotalizer")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "EndTotalizer",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "EndTotalizer", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].EndTotalizer)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          value={
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .NetStartTotalizer
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .NetStartTotalizer
                          }
                          label={t(
                            "MarineDispatchManualEntry_NetStartTotalizer"
                          )}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "NetStartTotalizer",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "NetStartTotalizer", data)
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
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .NetEndTotalizer
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .NetEndTotalizer
                          }
                          label={t("MarineDispatchManualEntry_NetEndTotalizer")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "NetEndTotalizer",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "NetEndTotalizer", data)
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
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .CalculatedGross
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .CalculatedGross
                          }
                          label={t("LoadingDetails_CalculatedGross")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "CalculatedGross",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "CalculatedGross", data)
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
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .CalculatedNet
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .CalculatedNet
                          }
                          label={t("LoadingDetails_CalculatedNet")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "CalculatedNet",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "CalculatedNet", data)
                          }
                          reserveSpace={false}
                          error={t(validationErrorsForBP[index].CalculatedNet)}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <Select
                          fluid
                          value={
                            item.baseProductCode
                              ? modTruckManualEntryLoadingAdvInfo[advIndex]
                                  .CalculatedValueUOM
                              : modTruckManualEntryLoadingBPInfo[index]
                                  .CalculatedValueUOM
                          }
                          options={listOptions.calcValueUOM}
                          placeholder="Select"
                          label={t("LoadingDetails_CalculatedValueUOM")}
                          onChange={(data) =>
                            item.baseProductCode
                              ? onFieldChange(
                                  "Additive",
                                  "CalculatedValueUOM",
                                  data,
                                  item.code
                                )
                              : onFieldChange("BP", "CalculatedValueUOM", data)
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
                    {item.baseProductCode
                      ? Array.isArray(selectedAttributeAdvList[advIndex]) &&
                        selectedAttributeAdvList[advIndex].length > 0
                        ? selectedAttributeAdvList[advIndex].map((attire) => (
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
                                      handleAttributeCellDataEditBPandAdditive
                                    }
                                    attributeValidationErrors={handleValidationErrorFilter(
                                      advAttributeValidationErrors[advIndex],
                                      attire.TerminalCode
                                    )}
                                  ></AttributeDetails>
                                </Accordion.Content>
                              </Accordion>
                            </ErrorBoundary>
                          ))
                        : null
                      : Array.isArray(selectedAttributeBPList[index]) &&
                        selectedAttributeBPList[index].length > 0
                      ? selectedAttributeBPList[index].map((attire) => (
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
                                    handleAttributeCellDataEditBPandAdditive
                                  }
                                  attributeValidationErrors={handleValidationErrorFilter(
                                    bpAttributeValidationErrors[index],
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
