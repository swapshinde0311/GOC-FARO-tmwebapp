import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Input, Select, DatePicker, Accordion, Tab } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

PipelineDispatchManualEntryDetails.propTypes = {
  modPipelineSnapshotInfo: PropTypes.object.isRequired,
  modPipelineTankTransactionSnapshotInfo: PropTypes.object.isRequired,
  modPipelineMeterTransactionSnapshotInfo: PropTypes.object.isRequired,
  modDispatch: PropTypes.object.isRequired,
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

PipelineDispatchManualEntryDetails.defaultProps = {};

export function PipelineDispatchManualEntryDetails({
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
  modDispatch,
  isMeterRequired,
  isTankRequired,
  onDateTextChange
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
                  value={modDispatch.FinishedProductCode}
                  label={t("PipelineDispatch_FinishedProductCode")}
                  disabled={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDispatch.PipelineDispatchCode}
                  label={t("PipelineEntry_PipelineHeaderDispatchCode")}
                  disabled={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDispatch.PipelineHeaderCode}
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
                  value={[modDispatch.PipelineHeaderMeterCode]}
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
                  value={modPipelineTankTransactionSnapshotInfo.ScanStartTime}
                  label={t("PipelineEntry_CaptureStartTime")}
                  type="datetime"
                  displayFormat={getCurrentDateFormat()}
                  disablePast={false}
                  disableFuture={true}
                  indicator="required"
                  onChange={(data) =>
                    onFieldChange("ScanStartTime", data, "Tank")
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
                  value={modPipelineTankTransactionSnapshotInfo.ScanEndTime}
                  label={t("PipelineEntry_CaptureEndTime")}
                  type="datetime"
                  displayFormat={getCurrentDateFormat()}
                  disablePast={false}
                  disableFuture={true}
                  indicator="required"
                  onChange={(data) =>
                    onFieldChange("ScanEndTime", data, "Tank")
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
                        onFieldChange("MeterCode", data, "Meter")
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
                        onFieldChange("GrossStartTotalizer", data, "Meter")
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
                        onFieldChange("NetStartTotalizer", data, "Meter")
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
                        onFieldChange("GrossEndTotalizer", data, "Meter")
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
                        onFieldChange("NetEndTotalizer", data, "Meter")
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
                        onFieldChange("Temperature", data, "Meter")
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
                        onFieldChange("TemperatureUOM", data, "Meter")
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
                        onFieldChange("Density", data, "Meter")
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
                        onFieldChange("DensityUOM", data, "Meter")
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
                        onFieldChange("TankCode", data, "Tank")
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
                        onFieldChange("GrossMass", data, "Tank")
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
                        onFieldChange("MassUOM", data, "Tank")
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
                        onFieldChange("GrossStartVolume", data, "Tank")
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
                        onFieldChange("NetStartVolume", data, "Tank")
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
                        onFieldChange("GrossEndVolume", data, "Tank")
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
                        onFieldChange("NetEndVolume", data, "Tank")
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
                        onFieldChange("VolumeUOM", data, "Tank")
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
                        onFieldChange("Temperature", data, "Tank")
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
                        onFieldChange("TemperatureUOM", data, "Tank")
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
                        onFieldChange("Density", data, "Tank")
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
                        onFieldChange("DensityUOM", data, "Tank")
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
                        onFieldChange("Pressure", data, "Tank")
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
                        onFieldChange("PressureUOM", data, "Tank")
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
