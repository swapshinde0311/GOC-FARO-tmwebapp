import React from "react";
import { DatePicker, Input, Select, Accordion, Tab } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";

RailDispatchCompartmentManualEntryDetails.propTypes = {
  modLoadingDataInfo: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    wagonCodes: PropTypes.array,
    clusterCodes: PropTypes.array,
    BCUCodes: PropTypes.array,
    loadingArmCodes: PropTypes.array,
    quantityUOMs: PropTypes.array,
    densityUOMs: PropTypes.array,
    temperatureUOMs: PropTypes.array,
    tankCodes: PropTypes.array,
    meterCodes: PropTypes.array,
  }).isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  attributeValidationErrorList: PropTypes.array.isRequired,
  onAttributeCellDataEdit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onTankSearchChange: PropTypes.func.isRequired,
  onMeterSearchChange: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  tabActiveIndex: PropTypes.number.isRequired,
};

export function RailDispatchCompartmentManualEntryDetails({
  modLoadingDataInfo,
  validationErrors,
  listOptions,

  selectedAttributeList,
  attributeValidationErrorList,
  onAttributeCellDataEdit,

  onFieldChange,
  onDateTextChange,
  onTankSearchChange,
  onMeterSearchChange,
  onTabChange,
  tabActiveIndex,
}) {
  const [t] = useTranslation();

  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };

  const generateTabPane = (listIndex, isAdditive, errorIndex) => {
    let title, dataKeyName;
    if (isAdditive) {
      title =
        t("BaseProductInfo_Additive") +
        " - " +
        modLoadingDataInfo.ArrTransactionAdditive[listIndex]
          .AdditiveProductCode +
        " (" +
        t("BPCode") +
        " - " +
        modLoadingDataInfo.ArrTransactionAdditive[listIndex].BaseProductCode +
        ")";
      dataKeyName = "ArrTransactionAdditive";
    } else {
      title =
        t("BPCode") +
        " - " +
        modLoadingDataInfo.ArrTransactionBP[listIndex].BaseProductCode;
      dataKeyName = "ArrTransactionBP";
    }
    return (
      <Tab.Pane title={title}>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              indicator="required"
              value={modLoadingDataInfo[dataKeyName][listIndex].GrossQuantity}
              label={t("GrossQuantity")}
              onChange={(data) =>
                onFieldChange(
                  "GrossQuantity",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].GrossQuantity)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].NetQuantity}
              label={t("NetQuantity")}
              onChange={(data) =>
                onFieldChange(
                  "NetQuantity",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].NetQuantity)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].Temperature}
              label={t("Temperature")}
              onChange={(data) =>
                onFieldChange(
                  "Temperature",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].Temperature)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Select
              fluid
              placeholder={t("Common_Select")}
              label={t("MarineDispatchManualEntry_TemperatureUOM")}
              value={modLoadingDataInfo[dataKeyName][listIndex].TemperatureUOM}
              options={listOptions.temperatureUOMs}
              onChange={(data) =>
                onFieldChange(
                  "TemperatureUOM",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              reserveSpace={false}
              noResultsMessage={t("noResultsMessage")}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].ProductDensity}
              label={t("Density")}
              onChange={(data) =>
                onFieldChange(
                  "ProductDensity",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].ProductDensity)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Select
              fluid
              placeholder={t("Common_Select")}
              label={t("BCU_DensityUOM")}
              value={
                modLoadingDataInfo[dataKeyName][listIndex].ProductDensityUOM
              }
              options={listOptions.densityUOMs}
              onChange={(data) =>
                onFieldChange(
                  "ProductDensityUOM",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              reserveSpace={false}
              noResultsMessage={t("noResultsMessage")}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Select
              fluid
              placeholder={t("Common_Select")}
              label={t("MeterCode")}
              value={modLoadingDataInfo[dataKeyName][listIndex].MeterCode}
              options={getOptionsWithSelect(
                listOptions.meterCodes,
                t("Common_Select")
              )}
              onChange={(data) =>
                onFieldChange("MeterCode", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
              }
              search={true}
              reserveSpace={false}
              noResultsMessage={t("noResultsMessage")}
              onSearch={onMeterSearchChange}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Select
              fluid
              placeholder={t("Common_Select")}
              label={t("TankCode")}
              value={modLoadingDataInfo[dataKeyName][listIndex].TankCode}
              options={getOptionsWithSelect(
                listOptions.tankCodes,
                t("Common_Select")
              )}
              onChange={(data) =>
                onFieldChange("TankCode", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
              }
              search={true}
              reserveSpace={false}
              noResultsMessage={t("noResultsMessage")}
              onSearch={onTankSearchChange}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].StartTotalizer}
              label={t("StartTotalizer")}
              onChange={(data) =>
                onFieldChange(
                  "StartTotalizer",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].StartTotalizer)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].EndTotalizer}
              label={t("EndTotalizer")}
              onChange={(data) =>
                onFieldChange(
                  "EndTotalizer",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].EndTotalizer)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={
                modLoadingDataInfo[dataKeyName][listIndex].NetStartTotalizer
              }
              label={t("MarineReceiptManualEntry_NetStartTotalizer")}
              onChange={(data) =>
                onFieldChange(
                  "NetStartTotalizer",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].NetStartTotalizer)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].NetEndTotalizer}
              label={t("MarineReceiptManualEntry_NetEndTotalizer")}
              onChange={(data) =>
                onFieldChange(
                  "NetEndTotalizer",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].NetEndTotalizer)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].CalculatedGross}
              label={t("LoadingDetailsEntry_CalculatedGross")}
              onChange={(data) =>
                onFieldChange(
                  "CalculatedGross",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].CalculatedGross)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modLoadingDataInfo[dataKeyName][listIndex].CalculatedNet}
              label={t("LoadingDetailsEntry_CalculatedNet")}
              onChange={(data) =>
                onFieldChange(
                  "CalculatedNet",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              error={t(validationErrors.product[errorIndex].CalculatedNet)}
              reserveSpace={false}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <Select
              fluid
              placeholder={t("Common_Select")}
              label={t("LoadingDetails_CalculatedValueUOM")}
              value={
                modLoadingDataInfo[dataKeyName][listIndex].CalculatedValueUOM
              }
              multiple={false}
              options={listOptions.quantityUOMs}
              onChange={(data) =>
                onFieldChange(
                  "CalculatedValueUOM",
                  data,
                  { type: dataKeyName, index: listIndex },
                  { category: "product", index: errorIndex }
                )
              }
              reserveSpace={false}
              noResultsMessage={t("noResultsMessage")}
            />
          </div>
        </div>

        {selectedAttributeList[errorIndex].length > 0
          ? selectedAttributeList[errorIndex].map((attire) => (
              <ErrorBoundary>
                <Accordion>
                  <Accordion.Content
                    className="attributeAccordian"
                    title={t("Attributes_Header")}
                  >
                    <AttributeDetails
                      selectedAttributeList={attire.attributeMetaDataList}
                      handleCellDataEdit={(attribute, value) =>
                        onAttributeCellDataEdit(attribute, value, errorIndex)
                      }
                      attributeValidationErrors={handleValidationErrorFilter(
                        attributeValidationErrorList[errorIndex],
                        attire.TerminalCode
                      )}
                    />
                  </Accordion.Content>
                </Accordion>
              </ErrorBoundary>
            ))
          : null}
      </Tab.Pane>
    );
  };

  const tabPaneList = [];
  let errorIndex = 1;
  for (
    let index = 0;
    index < modLoadingDataInfo.ArrTransactionBP.length;
    index++
  ) {
    tabPaneList.push(generateTabPane(index, false, errorIndex));
    errorIndex += 1;
  }
  for (
    let index = 0;
    index < modLoadingDataInfo.ArrTransactionAdditive.length;
    index++
  ) {
    tabPaneList.push(generateTabPane(index, true, errorIndex));
    errorIndex += 1;
  }

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.CommonInfo.DispatchCode}
                disabled={true}
                label={t("RailDispatchPlanDetail_DispatchCode")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.CommonInfo.CarrierCode}
                disabled={true}
                label={t("Rail_Receipt_Carrier")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                placeholder={t("Common_Select")}
                label={t("Rail_Receipt_Wagon")}
                value={modLoadingDataInfo.CommonInfo.TrailerCode}
                options={listOptions.wagonCodes}
                onChange={(data) => onFieldChange("TrailerCode", data)}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                placeholder={t("Common_Select")}
                label={t("RailDispatchManualEntry_Cluster")}
                value={modLoadingDataInfo.CommonInfo.BayCode}
                onChange={(data) => onFieldChange("BayCode", data)}
                options={listOptions.clusterCodes}
                error={t(validationErrors.bayCode)}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("RailDispatchManualEntry_BCU")}
                value={modLoadingDataInfo.CommonInfo.BCUCode}
                onChange={(data) => onFieldChange("BCUCode", data)}
                options={listOptions.BCUCodes}
                reserveSpace={false}
                indicator="required"
                error={t(validationErrors.BCUCode)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("RailDispatchManualEntry_LoadingArm")}
                value={modLoadingDataInfo.TransactionFPinfo.ArmCode}
                onChange={(data) =>
                  onFieldChange("ArmCode", data, { type: "TransactionFPinfo" })
                }
                indicator="required"
                error={t(validationErrors.LoadingArm)}
                options={listOptions.loadingArmCodes}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.FinishedProductCode}
                disabled={true}
                label={t("Rail_Receipt_Product")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.TransactionID}
                label={t("RailDispatchManualEntry_TransactionNo")}
                onChange={(data) =>
                  onFieldChange(
                    "TransactionID",
                    data,
                    { type: "TransactionFPinfo" },
                    { category: "common" }
                  )
                }
                error={t(validationErrors.common.TransactionID)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.StartTime}
                label={t("RailDispatchManualEntry_MandatoryLoadStartTime")}
                onChange={(data) =>
                  onFieldChange(
                    "StartTime",
                    data,
                    { type: "TransactionFPinfo" },
                    { category: "common" }
                  )
                }
                type="datetime"
                disablePast={false}
                disableFuture={true}
                indicator="required"
                reserveSpace={false}
                minuteStep={5}
                showYearSelector={true}
                displayFormat={getCurrentDateFormat()}
                onTextChange={(value, error) => {
                  onDateTextChange("StartTime", value, error);
                }}
                error={t(validationErrors.common.StartTime)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.EndTime}
                label={t("RailDispatchManualEntry_MandatoryLoadEndTime")}
                onChange={(data) =>
                  onFieldChange(
                    "EndTime",
                    data,
                    { type: "TransactionFPinfo" },
                    { category: "common" }
                  )
                }
                type="datetime"
                disablePast={false}
                disableFuture={true}
                indicator="required"
                reserveSpace={false}
                minuteStep={5}
                showYearSelector={true}
                displayFormat={getCurrentDateFormat()}
                onTextChange={(value, error) => {
                  onDateTextChange("EndTime", value, error);
                }}
                error={t(validationErrors.common.EndTime)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("RailDispatchManualEntry_QuantityUOM")}
                value={modLoadingDataInfo.TransactionFPinfo.QuantityUOM}
                multiple={false}
                indicator="required"
                options={listOptions.quantityUOMs}
                // onChange={(data) => onFieldChange("QuantityUOM", data)}
                disabled={true}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.Remarks}
                label={t("RailDispatchManualEntry_Remarks")}
                onChange={(data) =>
                  onFieldChange(
                    "Remarks",
                    data,
                    { type: "TransactionFPinfo" },
                    { category: "common" }
                  )
                }
                error={t(validationErrors.common.Remarks)}
                reserveSpace={false}
              />
            </div>
          </div>

          <div className="shipmentTabAlignment">
            <Tab activeIndex={tabActiveIndex} onTabChange={onTabChange}>
              <Tab.Pane
                title={
                  modLoadingDataInfo.TransactionFPinfo.FinishedProductCode ===
                  ""
                    ? t("FinishedProduct")
                    : t("FinishedProduct") +
                      "-" +
                      modLoadingDataInfo.TransactionFPinfo.FinishedProductCode
                }
              >
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      indicator="required"
                      value={modLoadingDataInfo.TransactionFPinfo.GrossQuantity}
                      label={t("GrossQuantity")}
                      onChange={(data) =>
                        onFieldChange(
                          "GrossQuantity",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].GrossQuantity)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modLoadingDataInfo.TransactionFPinfo.NetQuantity}
                      label={t("NetQuantity")}
                      onChange={(data) =>
                        onFieldChange(
                          "NetQuantity",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].NetQuantity)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modLoadingDataInfo.TransactionFPinfo.Temperature}
                      label={t("Temperature")}
                      onChange={(data) =>
                        onFieldChange(
                          "Temperature",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].Temperature)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("MarineDispatchManualEntry_TemperatureUOM")}
                      value={
                        modLoadingDataInfo.TransactionFPinfo.TemperatureUOM
                      }
                      options={listOptions.temperatureUOMs}
                      onChange={(data) =>
                        onFieldChange(
                          "TemperatureUOM",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modLoadingDataInfo.TransactionFPinfo.ProductDensity
                      }
                      label={t("Density")}
                      onChange={(data) =>
                        onFieldChange(
                          "ProductDensity",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].ProductDensity)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("BCU_DensityUOM")}
                      value={
                        modLoadingDataInfo.TransactionFPinfo.ProductDensityUOM
                      }
                      options={listOptions.densityUOMs}
                      onChange={(data) =>
                        onFieldChange(
                          "ProductDensityUOM",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("MeterCode")}
                      value={modLoadingDataInfo.TransactionFPinfo.MeterCode}
                      options={getOptionsWithSelect(
                        listOptions.meterCodes,
                        t("Common_Select")
                      )}
                      onChange={(data) =>
                        onFieldChange("MeterCode", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      search={true}
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                      onSearch={onMeterSearchChange}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("TankCode")}
                      value={modLoadingDataInfo.TransactionFPinfo.TankCode}
                      options={getOptionsWithSelect(
                        listOptions.tankCodes,
                        t("Common_Select")
                      )}
                      onChange={(data) =>
                        onFieldChange("TankCode", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      search={true}
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                      onSearch={onTankSearchChange}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modLoadingDataInfo.TransactionFPinfo.StartTotalizer
                      }
                      label={t("StartTotalizer")}
                      onChange={(data) =>
                        onFieldChange(
                          "StartTotalizer",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].StartTotalizer)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modLoadingDataInfo.TransactionFPinfo.EndTotalizer}
                      label={t("EndTotalizer")}
                      onChange={(data) =>
                        onFieldChange(
                          "EndTotalizer",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].EndTotalizer)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer
                      }
                      label={t("MarineReceiptManualEntry_NetStartTotalizer")}
                      onChange={(data) =>
                        onFieldChange(
                          "NetStartTotalizer",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].NetStartTotalizer)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer
                      }
                      label={t("MarineReceiptManualEntry_NetEndTotalizer")}
                      onChange={(data) =>
                        onFieldChange(
                          "NetEndTotalizer",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].NetEndTotalizer)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modLoadingDataInfo.TransactionFPinfo.CalculatedGross
                      }
                      label={t("LoadingDetailsEntry_CalculatedGross")}
                      onChange={(data) =>
                        onFieldChange(
                          "CalculatedGross",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].CalculatedGross)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modLoadingDataInfo.TransactionFPinfo.CalculatedNet}
                      label={t("LoadingDetailsEntry_CalculatedNet")}
                      onChange={(data) =>
                        onFieldChange(
                          "CalculatedNet",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      error={t(validationErrors.product[0].CalculatedNet)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("LoadingDetails_CalculatedValueUOM")}
                      value={
                        modLoadingDataInfo.TransactionFPinfo.CalculatedValueUOM
                      }
                      options={listOptions.quantityUOMs}
                      onChange={(data) =>
                        onFieldChange(
                          "CalculatedValueUOM",
                          data,
                          { type: "TransactionFPinfo" },
                          { category: "product", index: 0 }
                        )
                      }
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                </div>

                {selectedAttributeList[0].length > 0
                  ? selectedAttributeList[0].map((attire) => (
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
                              handleCellDataEdit={(attribute, value) =>
                                onAttributeCellDataEdit(attribute, value, 0)
                              }
                              attributeValidationErrors={handleValidationErrorFilter(
                                attributeValidationErrorList[0],
                                attire.TerminalCode
                              )}
                            />
                          </Accordion.Content>
                        </Accordion>
                      </ErrorBoundary>
                    ))
                  : null}
              </Tab.Pane>
              {tabPaneList}
            </Tab>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
