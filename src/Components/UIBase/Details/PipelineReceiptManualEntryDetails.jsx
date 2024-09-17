import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select, DatePicker, Tab, Accordion } from "@scuf/common";
import * as Utilities from "../../../JS/Utilities";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

PipelineReceiptManualEntryDetails.propTypes = {
  modPipelineSnapshotInfo: PropTypes.object.isRequired,
  modPipelineTankTransactionSnapshotInfo: PropTypes.object.isRequired,
  modPipelineMeterTransactionSnapshotInfo: PropTypes.object.isRequired,
  receipt: PropTypes.object.isRequired,
  tankValidationErrors: PropTypes.object.isRequired,
  meterValidationErrors: PropTypes.object.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  listOptions: PropTypes.shape({
    quantityUOMOptions: PropTypes.array,
    densityUOMS: PropTypes.array,
    temperatureUOMs: PropTypes.array,
    volumeUOMs: PropTypes.array,
    pressureUOMs: PropTypes.array,
    tankCodes: PropTypes.array,
    meterCodes: PropTypes.array,
  }).isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  isMeterRequired: PropTypes.bool.isRequired,
  isTankRequired: PropTypes.bool.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
};

export function PipelineReceiptManualEntryDetails({
  modPipelineSnapshotInfo,
  modPipelineTankTransactionSnapshotInfo,
  modPipelineMeterTransactionSnapshotInfo,
  tankValidationErrors,
  meterValidationErrors,
  listOptions,
  modAttributeMetaDataList,
  attributeValidationErrors,
  onFieldChange,
  onTabChange,
  onAttributeDataChange,
  activeIndex,
  receipt,
  isMeterRequired,
  isTankRequired,
  onDateTextChange,
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
                <Input
                  fluid
                  value={receipt.FinishedProductCode}
                  label={t("PipelineDispatch_FinishedProductCode")}
                  disabled={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={receipt.PipelineReceiptCode}
                  label={t("PipelineEntry_PipelineReceiptCode")}
                  disabled={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={receipt.PipelineHeaderCode}
                  label={t("PipelineEntry_PipelineHeaderCode")}
                  disabled={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  value={listOptions.tankCodes}
                  label={t("PipelineEntry_PlanedTank")}
                  options={Utilities.transferListtoOptions(
                    listOptions.tankCodes
                  )}
                  disabled={true}
                  multiple={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  value={listOptions.meterCodes}
                  label={t("PipelineEntry_PlanedMeter")}
                  options={Utilities.transferListtoOptions(
                    listOptions.meterCodes
                  )}
                  disabled={true}
                  multiple={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    new Date(
                      modPipelineTankTransactionSnapshotInfo.ScanStartTime
                    )
                  }
                  label={t("PipelineEntry_CaptureStartTime")}
                  type="datetime"
                  displayFormat={getCurrentDateFormat()}
                  disablePast={false}
                  disableFuture={true}
                  indicator="required"
                  onChange={(data) =>
                    onFieldChange("Tank", "ScanStartTime", data)
                  }
                  onTextChange={(value, error) => {
                    onDateTextChange("ScanStartTime", value, error);
                  }}
                  error={t(tankValidationErrors.ScanStartTime)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    new Date(modPipelineTankTransactionSnapshotInfo.ScanEndTime)
                  }
                  label={t("PipelineEntry_CaptureEndTime")}
                  type="datetime"
                  displayFormat={getCurrentDateFormat()}
                  disablePast={false}
                  disableFuture={true}
                  indicator="required"
                  onChange={(data) =>
                    onFieldChange("Tank", "ScanEndTime", data)
                  }
                  onTextChange={(value, error) => {
                    onDateTextChange("ScanEndTime", value, error);
                  }}
                  error={t(tankValidationErrors.ScanEndTime)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modPipelineSnapshotInfo.Remarks}
                  label={t("LoadingDetailsEntry_Remarks")}
                  onChange={(data) => onFieldChange("Remarks", data)}
                  reserveSpace={false}
                  error={t(tankValidationErrors.Remarks)}
                />
              </div>
            </div>

            {modAttributeMetaDataList.length > 0
              ? modAttributeMetaDataList.map((attire) => (
                  <ErrorBoundary>
                    <Accordion>
                      <Accordion.Content
                        className="attributeAccordian"
                        title={t("Attributes_Header")}
                      >
                        <AttributeDetails
                          selectedAttributeList={attire.attributeMetaDataList}
                          handleCellDataEdit={onAttributeDataChange}
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

            <Tab
              activeIndex={activeIndex}
              onTabChange={(index) => onTabChange(index)}
            >
              <Tab.Pane title={t("Pipeline_Header_meter_Level_Trasaction")}>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("PipelineEntry_PipelineMeterCode")}
                      value={modPipelineMeterTransactionSnapshotInfo.MeterCode}
                      onChange={(data) =>
                        onFieldChange("Meter", "MeterCode", data)
                      }
                      indicator={isMeterRequired ? "required" : null}
                      error={t(meterValidationErrors.MeterCode)}
                      options={Utilities.transferListtoOptions(
                        listOptions.meterCodes
                      )}
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineMeterTransactionSnapshotInfo.GrossStartTotalizer
                      }
                      label={t("PipelineMeter_StartGrossTotalizer")}
                      onChange={(data) =>
                        onFieldChange("Meter", "GrossStartTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(meterValidationErrors.GrossStartTotalizer)}
                      indicator={
                        modPipelineMeterTransactionSnapshotInfo.MeterCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineMeterTransactionSnapshotInfo.NetStartTotalizer
                      }
                      label={t("PipelineMeter_StartNetTotalizer")}
                      onChange={(data) =>
                        onFieldChange("Meter", "NetStartTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(meterValidationErrors.NetStartTotalizer)}
                      indicator={
                        modPipelineMeterTransactionSnapshotInfo.MeterCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineMeterTransactionSnapshotInfo.GrossEndTotalizer
                      }
                      label={t("PipelineMeter_EndGrossTotalizer")}
                      onChange={(data) =>
                        onFieldChange("Meter", "GrossEndTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(meterValidationErrors.GrossEndTotalizer)}
                      indicator={
                        modPipelineMeterTransactionSnapshotInfo.MeterCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineMeterTransactionSnapshotInfo.NetEndTotalizer
                      }
                      label={t("TankMeter_EndNetTotalizer")}
                      onChange={(data) =>
                        onFieldChange("Meter", "NetEndTotalizer", data)
                      }
                      reserveSpace={false}
                      error={t(meterValidationErrors.NetEndTotalizer)}
                      indicator={
                        modPipelineMeterTransactionSnapshotInfo.MeterCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineMeterTransactionSnapshotInfo.Temperature
                      }
                      label={t("LoadingDetailsEntry_Temperature")}
                      onChange={(data) =>
                        onFieldChange("Meter", "Temperature", data)
                      }
                      reserveSpace={false}
                      error={t(meterValidationErrors.Temperature)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={
                        modPipelineMeterTransactionSnapshotInfo.TemperatureUOM
                      }
                      options={listOptions.temperatureUOMs}
                      placeholder="Select"
                      label={t("MarineDispatchManualEntry_TemperatureUOM")}
                      onChange={(data) =>
                        onFieldChange("Meter", "TemperatureUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(meterValidationErrors.TemperatureUOM)}
                      indicator={
                        modPipelineMeterTransactionSnapshotInfo.Temperature !==
                        ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modPipelineMeterTransactionSnapshotInfo.Density}
                      label={t("Density")}
                      onChange={(data) =>
                        onFieldChange("Meter", "Density", data)
                      }
                      reserveSpace={false}
                      error={t(meterValidationErrors.Density)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modPipelineMeterTransactionSnapshotInfo.DensityUOM}
                      options={listOptions.densityUOMS}
                      placeholder="Select"
                      label={t("BaseProductInfox_UOM")}
                      onChange={(data) =>
                        onFieldChange("Meter", "DensityUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(meterValidationErrors.DensityUOM)}
                      indicator={
                        modPipelineMeterTransactionSnapshotInfo.Density !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane title={t("Pipeline_Tank_Level_Trasaction")}>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("AtgConfigure_TankCode")}
                      value={modPipelineTankTransactionSnapshotInfo.TankCode}
                      onChange={(data) =>
                        onFieldChange("Tank", "TankCode", data)
                      }
                      indicator={isTankRequired ? "required" : null}
                      error={t(tankValidationErrors.TankCode)}
                      options={Utilities.transferListtoOptions(
                        listOptions.tankCodes
                      )}
                      reserveSpace={false}
                      noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.GrossMass}
                      label={t("TankInfo_GrossMass")}
                      onChange={(data) =>
                        onFieldChange("Tank", "GrossMass", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.GrossMass)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.MassUOM}
                      options={listOptions.quantityUOMOptions}
                      placeholder="Select"
                      label={t("TankEODEntry_MassQuantityUOM")}
                      onChange={(data) =>
                        onFieldChange("Tank", "MassUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(tankValidationErrors.MassUOM)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.GrossMass !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineTankTransactionSnapshotInfo.GrossStartVolume
                      }
                      label={t("Gross_start_Volume")}
                      onChange={(data) =>
                        onFieldChange("Tank", "GrossStartVolume", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.GrossStartVolume)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.TankCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineTankTransactionSnapshotInfo.NetStartVolume
                      }
                      label={t("Net_start_Volume")}
                      onChange={(data) =>
                        onFieldChange("Tank", "NetStartVolume", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.NetStartVolume)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.TankCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineTankTransactionSnapshotInfo.GrossEndVolume
                      }
                      label={t("Gross_end_Volume")}
                      onChange={(data) =>
                        onFieldChange("Tank", "GrossEndVolume", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.GrossEndVolume)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.TankCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={
                        modPipelineTankTransactionSnapshotInfo.NetEndVolume
                      }
                      label={t("Net_end_Volume")}
                      onChange={(data) =>
                        onFieldChange("Tank", "NetEndVolume", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.NetEndVolume)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.TankCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.VolumeUOM}
                      options={listOptions.volumeUOMs}
                      placeholder="Select"
                      label={t("TankTransaction_VolumeUom")}
                      onChange={(data) =>
                        onFieldChange("Tank", "VolumeUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(tankValidationErrors.VolumeUOM)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.TankCode !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.Temperature}
                      label={t("LoadingDetailsEntry_Temperature")}
                      onChange={(data) =>
                        onFieldChange("Tank", "Temperature", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.Temperature)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={
                        modPipelineTankTransactionSnapshotInfo.TemperatureUOM
                      }
                      options={listOptions.temperatureUOMs}
                      placeholder="Select"
                      label={t("MarineDispatchManualEntry_TemperatureUOM")}
                      onChange={(data) =>
                        onFieldChange("Tank", "TemperatureUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(tankValidationErrors.TemperatureUOM)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.Temperature !==
                        ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.Density}
                      label={t("Density")}
                      onChange={(data) =>
                        onFieldChange("Tank", "Density", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.Density)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.DensityUOM}
                      options={listOptions.densityUOMS}
                      placeholder="Select"
                      label={t("BaseProductInfox_UOM")}
                      onChange={(data) =>
                        onFieldChange("Tank", "DensityUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(tankValidationErrors.DensityUOM)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.Density !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Input
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.Pressure}
                      label={t("LoadingDetailsEntry_Pressure")}
                      onChange={(data) =>
                        onFieldChange("Tank", "Pressure", data)
                      }
                      reserveSpace={false}
                      error={t(tankValidationErrors.Pressure)}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <Select
                      fluid
                      value={modPipelineTankTransactionSnapshotInfo.PressureUOM}
                      options={listOptions.pressureUOMs}
                      placeholder="Select"
                      label={t("BCU_PressureUOM")}
                      onChange={(data) =>
                        onFieldChange("Tank", "PressureUOM", data)
                      }
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(tankValidationErrors.PressureUOM)}
                      indicator={
                        modPipelineTankTransactionSnapshotInfo.Pressure !== ""
                          ? "required"
                          : null
                      }
                    />
                  </div>
                </div>
              </Tab.Pane>
            </Tab>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
