import React from "react";
import { Input, Select, Tab, DatePicker, Accordion } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import PropTypes from "prop-types";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";
RailReceiptManualEntryDetails.propTypes = {
  modLoadingDataInfo: PropTypes.object.isRequired,
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
  }),
  IsManEntryEnabled: PropTypes.bool.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onTankSearchChange: PropTypes.func.isRequired,
  onMeterSearchChange: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
  selectedFPAttributeList: PropTypes.array.isRequired,
  selectedBPAttributeList: PropTypes.array.isRequired,
  selectedAddAttributeList: PropTypes.array.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
};

export function RailReceiptManualEntryDetails({
  modLoadingDataInfo,
  IsManEntryEnabled,
  listOptions,
  validationErrors,
  onFieldChange,
  onTankSearchChange,
  onMeterSearchChange,
  onTabChange,
  tabActiveIndex,
  isEnterpriseNode,
  selectedFPAttributeList,
  selectedBPAttributeList,
  selectedAddAttributeList,
  handleAttributeCellDataEdit,
  attributeAddValidationErrors,
  attributeBPValidationErrors,
  attributeFPValidationErrors,
  onDateTextChange,
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
                onFieldChange("GrossQuantity", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("NetQuantity", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("Temperature", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("TemperatureUOM", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("ProductDensity", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("ProductDensityUOM", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("StartTotalizer", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("EndTotalizer", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("NetStartTotalizer", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("NetEndTotalizer", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("CalculatedGross", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("CalculatedNet", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
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
                onFieldChange("CalculatedValueUOM", data, {
                  type: dataKeyName,
                  index: listIndex,
                })
              }
              reserveSpace={false}
              noResultsMessage={t("noResultsMessage")}
            />
          </div>
        </div>
        {isAdditive ? (
          <>
            {selectedAddAttributeList.length > 0 &&
            selectedAddAttributeList[listIndex].length > 0
              ? selectedAddAttributeList[listIndex].map((attire) => (
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
                          handleCellDataEdit={(attribute, value) =>
                            handleAttributeCellDataEdit(attribute, value, {
                              type: dataKeyName,
                              index: listIndex,
                            })
                          }
                          attributeValidationErrors={handleValidationErrorFilter(
                            attributeAddValidationErrors,
                            attire.TerminalCode
                          )}
                        ></AttributeDetails>
                      </Accordion.Content>
                    </Accordion>
                  </ErrorBoundary>
                ))
              : null}
          </>
        ) : (
          <>
            {selectedBPAttributeList.length > 0 &&
            selectedBPAttributeList[listIndex].length > 0
              ? selectedBPAttributeList[listIndex].map((attire) => (
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
                          handleCellDataEdit={(attribute, value) =>
                            handleAttributeCellDataEdit(attribute, value, {
                              type: dataKeyName,
                              index: listIndex,
                            })
                          }
                          attributeValidationErrors={handleValidationErrorFilter(
                            attributeBPValidationErrors,
                            attire.TerminalCode
                          )}
                        ></AttributeDetails>
                      </Accordion.Content>
                    </Accordion>
                  </ErrorBoundary>
                ))
              : null}
          </>
        )}
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
                value={modLoadingDataInfo.CommonInfo.ReceiptCode}
                disabled={true}
                label={t("Receipt_Code")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.CommonInfo.CarrierCode}
                disabled={true}
                label={t("Entity_Carrier_Code")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                disabled={IsManEntryEnabled}
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
                label={t("BCU_Code")}
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
                label={t("UnloadingDetailsEntry_LoadingArm")}
                value={modLoadingDataInfo.TransactionFPinfo.ArmCode}
                onChange={(data) =>
                  onFieldChange("ArmCode", data, {
                    type: "TransactionFPinfo",
                  })
                }
                options={listOptions.loadingArmCodes}
                reserveSpace={false}
                indicator="required"
                error={t(validationErrors.LoadingArm)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.FinishedProductCode}
                label={t("RailDispatchManualEntry_FinishedProduct")}
                reserveSpace={false}
                disabled={IsManEntryEnabled}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.TransactionID}
                label={t("UnloadingDetailsEntry_TransactionNo")}
                onChange={(data) =>
                  onFieldChange("TransactionID", data, {
                    type: "TransactionFPinfo",
                  })
                }
                error={t(validationErrors.common.TransactionID)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.StartTime}
                label={t("LoadingDetailsEntry_loadStartTime")}
                onChange={(data) =>
                  onFieldChange("StartTime", data, {
                    type: "TransactionFPinfo",
                  })
                }
                type="datetime"
                disablePast={false}
                disableFuture={true}
                indicator="required"
                reserveSpace={false}
                minuteStep={5}
                showYearSelector={true}
                displayFormat={getCurrentDateFormat()}
                onTextChange={(data, error) => {
                  onDateTextChange("StartTime", data, error);
                }}
                error={t(validationErrors.common.StartTime)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.EndTime}
                label={t("LoadingDetailsEntry_loadEndTime")}
                onChange={(data) =>
                  onFieldChange("EndTime", data, { type: "TransactionFPinfo" })
                }
                type="datetime"
                disablePast={false}
                disableFuture={true}
                indicator="required"
                reserveSpace={false}
                minuteStep={5}
                showYearSelector={true}
                onTextChange={(data, error) => {
                  onDateTextChange("EndTime", data, error);
                }}
                error={t(validationErrors.common.EndTime)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("LoadingDetailsEntry_QuantityUOM")}
                value={modLoadingDataInfo.TransactionFPinfo.QuantityUOM}
                multiple={false}
                indicator="required"
                options={listOptions.quantityUOMs}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modLoadingDataInfo.TransactionFPinfo.Remarks}
                label={t("LoadingDetails_Remarks")}
                onChange={(data) =>
                  onFieldChange("Remarks", data, { type: "TransactionFPinfo" })
                }
                error={t(validationErrors.Remarks)}
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
                      label={t("Reconciliation_Quantity")}
                      onChange={(data) =>
                        onFieldChange("GrossQuantity", data, {
                          type: "TransactionFPinfo",
                        })
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
                        onFieldChange("NetQuantity", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      error={t(validationErrors.product[0].NetQuantity)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modLoadingDataInfo.TransactionFPinfo.Temperature}
                      label={t("LoadingDetails_Temperature")}
                      onChange={(data) =>
                        onFieldChange("Temperature", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      error={t(validationErrors.product[0].Temperature)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("BCU_TemperatureUOM")}
                      value={
                        modLoadingDataInfo.TransactionFPinfo.TemperatureUOM
                      }
                      options={listOptions.temperatureUOMs}
                      onChange={(data) =>
                        onFieldChange("TemperatureUOM", data, {
                          type: "TransactionFPinfo",
                        })
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
                      label={t("BaseProductInfo_Density")}
                      onChange={(data) =>
                        onFieldChange("ProductDensity", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      error={t(validationErrors.product[0].ProductDensity)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("Reconciliation_DensityUOM")}
                      value={
                        modLoadingDataInfo.TransactionFPinfo.ProductDensityUOM
                      }
                      options={listOptions.densityUOMs}
                      onChange={(data) =>
                        onFieldChange("ProductDensityUOM", data, {
                          type: "TransactionFPinfo",
                        })
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
                      onChange={(data) =>
                        onFieldChange("StartTotalizer", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      error={t(validationErrors.product[0].StartTotalizer)}
                      label={t("StartTotalizer")}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modLoadingDataInfo.TransactionFPinfo.EndTotalizer}
                      label={t("EndTotalizer")}
                      onChange={(data) =>
                        onFieldChange("EndTotalizer", data, {
                          type: "TransactionFPinfo",
                        })
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
                      label={t("ViewRailLoadingDetails_netstarttotalizer")}
                      onChange={(data) =>
                        onFieldChange("NetStartTotalizer", data, {
                          type: "TransactionFPinfo",
                        })
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
                      label={t("ViewRailLoadingDetails_netendtotalizer")}
                      onChange={(data) =>
                        onFieldChange("NetEndTotalizer", data, {
                          type: "TransactionFPinfo",
                        })
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
                      label={t("LoadingDetails_CalculatedGross")}
                      onChange={(data) =>
                        onFieldChange("CalculatedGross", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      error={t(validationErrors.product[0].CalculatedGross)}
                      reserveSpace={false}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modLoadingDataInfo.TransactionFPinfo.CalculatedNet}
                      label={t("LoadingDetails_CalculatedNet")}
                      onChange={(data) =>
                        onFieldChange("CalculatedNet", data, {
                          type: "TransactionFPinfo",
                        })
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
                        onFieldChange("CalculatedValueUOM", data, {
                          type: "TransactionFPinfo",
                        })
                      }
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                </div>
                {selectedFPAttributeList.length > 0
                  ? selectedFPAttributeList.map((attire) => (
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
                              selectedAttributeList={
                                attire.attributeMetaDataList
                              }
                              handleCellDataEdit={(attribute, value) =>
                                handleAttributeCellDataEdit(attribute, value, {
                                  type: "TransactionFPinfo",
                                  index: 0,
                                })
                              }
                              attributeValidationErrors={handleValidationErrorFilter(
                                attributeFPValidationErrors,
                                attire.TerminalCode
                              )}
                            ></AttributeDetails>
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
