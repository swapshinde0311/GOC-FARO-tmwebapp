import React from "react";
import { DataTable } from "@scuf/datatable";
import { DatePicker, Input, Select, Icon, Tab, Accordion, Checkbox } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { AttributeDetails } from "../Details/AttributeDetails";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { getCurrentDateFormat, handleIsRequiredCompartmentCell } from "../../../JS/functionalUtilities";
import * as Utilities from "../../../JS/Utilities";
PipelineDispatchDetails.propTypes = {
  pipelineDispatch: PropTypes.object.isRequired,
  modPipelineDispatch: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    quantityUOM: PropTypes.array.isRequired,
    pipelineHeaderOptions: PropTypes.array.isRequired,
    pipelineHeaderMeterOptions: PropTypes.array.isRequired,
    tankCodeOptions: PropTypes.array.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    customerOptions: PropTypes.array.isRequired,
    destinationOptions: PropTypes.array.isRequired,
    finishedProductOptions: PropTypes.array.isRequired,
  }),
  selectedCompRow: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddCompartment: PropTypes.func.isRequired,
  handleDeleteCompartment: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  handleTerminalChange: PropTypes.func.isRequired,
  handlePipelineHeaderChange: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  loadingDetailsTab: PropTypes.array.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  loadingDetails: PropTypes.object.isRequired,
  isMeterRequired: PropTypes.bool.isRequired,
  isTankRequired: PropTypes.bool.isRequired,
  pipelineSnapShotInfo: PropTypes.array.isRequired,
  handleCellCheck: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
};

PipelineDispatchDetails.defaultProps = {
  listOptions: {
    quantityUOM: [],
    pipelineHeaderOptions: [],
    pipelineHeaderMeterOptions: [],
    tankCodeOptions: [],
    terminalCodes: [],
    customerOptions: [],
    destinationOptions: [],
    finishedProductOptions: [],
  },
  isEnterpriseNode: false,
}

export function PipelineDispatchDetails({
  pipelineDispatch,
  modPipelineDispatch,
  validationErrors,
  attributeValidationErrors,
  listOptions,
  selectedCompRow,
  onFieldChange,
  handleRowSelectionChange,
  handleCellDataEdit,
  handleAddCompartment,
  handleDeleteCompartment,
  isEnterpriseNode,
  handleTerminalChange,
  handlePipelineHeaderChange,
  onTabChange,
  activeTab,
  loadingDetailsTab,
  modAttributeMetaDataList,
  onAttributeDataChange,
  loadingDetails,
  pipelineSnapShotInfo,
  isMeterRequired,
  isTankRequired,
  handleCellCheck,
  onDateTextChange,
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

  const handleCustomEditDropDown = (cellData, dropDownoptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={
          modPipelineDispatch.PipelineDispatchTanks[cellData.rowIndex][
          cellData.field
          ]
        }
        fluid
        options={dropDownoptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
      />
    );
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={
          modPipelineDispatch.PipelineDispatchTanks[cellData.rowIndex][
          cellData.field
          ]
        }
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  const handleCustomEditDateSelect = (cellData) => {
    return (
      <DatePicker
        fluid
        value={
          modPipelineDispatch.PipelineDispatchTanks[cellData.rowIndex][
            cellData.field
          ] === null
            ? ""
            : new Date(
              modPipelineDispatch.PipelineDispatchTanks[cellData.rowIndex][
              cellData.field
              ]
            )
        }
        type="datetime"
        displayFormat={getCurrentDateFormat()}
        indicator="required"
        onChange={(value) => handleCellDataEdit(value, cellData)}
        onTextChange={(value, error) => {
          onDateTextChange(cellData, value, error);
        }}
        reserveSpace={false}
      ></DatePicker>
    );
  };

  const decimalDisplayValues = (cellData) => {
    const { value } = cellData;
    if (typeof value === "number") {
      return value.toLocaleString();
    } else {
      return value;
    }
  };

  const dateDisplayValues = (cellData) => {
    const { value } = cellData;
    return value !== null ? new Date(value).toLocaleDateString() + " " + new Date(value).toLocaleTimeString() : "";
  };

  const handleCheckBox = (data) => {
    return (
      <Checkbox
        className="forceCompleteChkBox"
        checked={data.value}
        onChange={(cellData) => {
          handleCellCheck(data, cellData);
        }}
      />
    );
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modPipelineDispatch.PipelineDispatchCode}
                indicator="required"
                disabled={pipelineDispatch.PipelineDispatchCode !== ""}
                onChange={(data) => onFieldChange("PipelineDispatchCode", data)}
                label={t("PipelineDispatch_DispatchCode")}
                error={t(validationErrors.PipelineDispatchCode)}
                reserveSpace={false}
              />
            </div>
            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("TerminalCode")}
                  value={
                    modPipelineDispatch.TerminalCodes === null
                      ? ""
                      : modPipelineDispatch.TerminalCodes.length === 0
                        ? ""
                        : modPipelineDispatch.TerminalCodes[0]
                  }
                  disabled={pipelineDispatch.PipelineDispatchCode !== ""}
                  onChange={(data) => handleTerminalChange(data)}
                  indicator="required"
                  error={t(validationErrors.TerminalCodes)}
                  options={Utilities.transferListtoOptions(listOptions.terminalCodes)}
                  reserveSpace={false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                label={t("PipelineDispatch_CustomerCode")}
                value={modPipelineDispatch.CustomerCode}
                onChange={(data) => onFieldChange("CustomerCode", data)}
                options={listOptions.customerOptions}
                error={t(validationErrors.CustomerCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                label={t("PipelineDispatch_Destination")}
                value={modPipelineDispatch.DestinationCode}
                onChange={(data) => onFieldChange("DestinationCode", data)}
                options={listOptions.destinationOptions}
                error={t(validationErrors.DestinationCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modPipelineDispatch.PipelineDispatchStatus}
                label={t("PipelineDispatch_DispatchStatus")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                label={t("PipelineDispatch_HeaderLineCode")}
                value={modPipelineDispatch.PipelineHeaderCode}
                onChange={(data) => handlePipelineHeaderChange(data)}
                options={listOptions.pipelineHeaderOptions}
                error={t(validationErrors.PipelineHeaderCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                label={t("PipelineDispatch_HeaderLineMeter")}
                value={modPipelineDispatch.PipelineHeaderMeterCode}
                onChange={(data) =>
                  onFieldChange("PipelineHeaderMeterCode", data)
                }
                options={Utilities.transferListtoOptions(listOptions.pipelineHeaderMeterOptions)}
                error={t(validationErrors.PipelineHeaderMeterCode)}
                indicator={isMeterRequired ? "required" : ""}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modPipelineDispatch.Quantity}
                indicator="required"
                onChange={(data) => onFieldChange("Quantity", data)}
                label={t("PipelineDispatch_Quantity")}
                error={t(validationErrors.Quantity)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <ErrorBoundary>
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("PipelineDispatch_UOM")}
                  value={modPipelineDispatch.QuantityUOM}
                  multiple={false}
                  indicator="required"
                  options={listOptions.quantityUOM}
                  disabled={listOptions.quantityUOM.length === 0}
                  error={t(validationErrors.QuantityUOM)}
                  onChange={(data) => onFieldChange("QuantityUOM", data)}
                  reserveSpace={false}
                />
              </ErrorBoundary>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                label={t("PipelineDispatch_FinishedProductCode")}
                value={modPipelineDispatch.FinishedProductCode}
                onChange={(data) => onFieldChange("FinishedProductCode", data)}
                options={listOptions.finishedProductOptions}
                error={t(validationErrors.FinishedProductCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4 starttime">
              <DatePicker
                fluid
                value={
                  modPipelineDispatch.ScheduledStartTime === null
                    ? ""
                    : new Date(modPipelineDispatch.ScheduledStartTime)
                }
                label={t("PipelineDispatch_ExpectedStartTime")}
                type="datetime"
                displayFormat={getCurrentDateFormat()}
                disablePast={false}
                indicator="required"
                onChange={(data) => onFieldChange("ScheduledStartTime", data)}
                error={t(validationErrors.ScheduledStartTime)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modPipelineDispatch.ScheduledEndTime === null
                    ? ""
                    : new Date(modPipelineDispatch.ScheduledEndTime)
                }
                label={t("PipelineDispatch_ExpectedEndTime")}
                type="datetime"
                displayFormat={getCurrentDateFormat()}
                disablePast={false}
                indicator="required"
                onChange={(data) => onFieldChange("ScheduledEndTime", data)}
                error={t(validationErrors.ScheduledEndTime)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modPipelineDispatch.Remarks}
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                reserveSpace={false}
              />
            </div>
          </div>
          {modAttributeMetaDataList.length > 0
            ? modAttributeMetaDataList.map((attire) => (
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
          <div className="shipmentTabAlignment">
            <Tab
              activeIndex={activeTab}
              onTabChange={(activeIndex) => {
                onTabChange(activeIndex);
              }}>
              <Tab.Pane
                title={t("Dispatch_Plan")}
              >
                <div className="row compartmentRow">
                  <div className="col col-md-8 col-lg-9 col col-xl-9">
                    {/* <h4>{t("PipelineDispatch_TankInfoHeader")}</h4> */}
                  </div>
                  <div className="col col-md-4 col-lg-3 col-xl-3">
                    <div className="compartmentIconContainer">
                      <div onClick={handleAddCompartment} className="compartmentIcon">
                        <div>
                          <Icon root="common" name="badge-plus" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">{t("FinishedProductInfo_Add")}</h5>
                        </div>
                      </div>

                      <div
                        onClick={handleDeleteCompartment}
                        className="compartmentIcon margin_l30"
                      >
                        <div>
                          <Icon root="common" name="delete" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">{t("DestAdd_Delete")}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row marginRightZero tableScroll">
                  <div className="col-12 detailsTable">
                    <DataTable
                      data={modPipelineDispatch.PipelineDispatchTanks}
                      selectionMode="multiple"
                      selection={selectedCompRow}
                      onSelectionChange={handleRowSelectionChange}
                    >
                      <DataTable.Column
                        className="compColHeight"
                        key="TankCode"
                        field="TankCode"
                        header={isTankRequired ? handleIsRequiredCompartmentCell(
                          t("PipelineDispatch_TankCode")) : t("PipelineDispatch_TankCode")}
                        editable={true}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleCustomEditDropDown(celldata, listOptions.tankCodeOptions)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="Quantity"
                        field="Quantity"
                        header={t("PipelineDispatch_ExpectedQuantity")}
                        editable={true}
                        editFieldType="text"
                        renderer={(cellData) => decimalDisplayValues(cellData)}
                        customEditRenderer={handleCustomEditTextBox}
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="PlannedStartTime"
                        field="PlannedStartTime"
                        header={t("PipelineDispatch_ExpectedStartTime")}
                        editable={true}
                        // editFieldType="text"
                        renderer={(cellData) => dateDisplayValues(cellData)}
                        customEditRenderer={(cellData) =>
                          handleCustomEditDateSelect(cellData)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="PlannedEndTime"
                        field="PlannedEndTime"
                        header={t("PipelineDispatch_ExpectedEndTime")}
                        editable={true}
                        // editFieldType="text"
                        renderer={(cellData) => dateDisplayValues(cellData)}
                        customEditRenderer={(cellData) =>
                          handleCustomEditDateSelect(cellData)
                        }
                      ></DataTable.Column>
                    </DataTable>
                  </div>
                </div>
              </Tab.Pane>
              {loadingDetailsTab.map((index) => {
                return (
                  <Tab.Pane
                    title={t("ViewShipment_LoadingDetails")}>
                    <ErrorBoundary>
                      <Accordion>
                        <Accordion.Content
                          className="attributeAccordian"
                          title={t("PipelineDispatchDetails_TransactionSummary")}
                        >
                          <div className="row marginRightZero tableScroll">
                            <div className="col-12 detailsTable">
                              <DataTable
                                data={pipelineSnapShotInfo}
                              >
                                <DataTable.Column
                                  className="compColHeight"
                                  key="ReceivedGrossQuantity"
                                  field="ReceivedGrossQuantity"
                                  header={t("PipelineDispatchTransaction_ActualGrossQuantity")}
                                  initialWidth="120px"
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="ReceivedNetQuantity"
                                  field="ReceivedNetQuantity"
                                  header={t("PipelineDispatchTransaction_ActualNetQuantity")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="RationPending"
                                  field="RationPending"
                                  header={t("PipelineDispatchTransaction_RationPending")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="ReceivedQuantityUOM"
                                  field="ReceivedQuantityUOM"
                                  header={t("PipelineDispatchTransaction_ActualQuantityUOM")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="PlannedStartTime"
                                  field="PlannedStartTime"
                                  header={t("PipelineDispatchTransaction_ExpectedStartDateTime")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="PlannedEndTime"
                                  field="PlannedEndTime"
                                  header={t("PipelineDispatchTransaction_ExpectedEndDateTime")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="ActualStartTime"
                                  field="ActualStartTime"
                                  header={t("PipelineDispatchTransaction_ActualStartDateTime")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="ActualEndTime"
                                  field="ActualEndTime"
                                  header={t("PipelineDispatchTransaction_ActualEndDateTime")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="IsInvalid"
                                  field="IsInvalid"
                                  header={t("PipelineDispatchTransaction_Ignore")}
                                  renderer={handleCheckBox}
                                ></DataTable.Column>
                              </DataTable>
                            </div>
                          </div>
                        </Accordion.Content>
                      </Accordion>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Accordion>
                        <Accordion.Content
                          className="attributeAccordian"
                          title={t("PipelineDispatchDetails_TankTransactionSummary")}
                        >
                          <div className="row marginRightZero tableScroll">
                            <div className="col-12 detailsTable">
                              <DataTable
                                data={loadingDetails.Table2}
                              >
                                <DataTable.Column
                                  className="compColHeight"
                                  key="TankCode"
                                  field="TankCode"
                                  header={t("TankVolume_TankCode")}
                                  initialWidth="150px"
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="StartGrossVolume"
                                  field="StartGrossVolume"
                                  header={t("TankVolume_StartGrossVolume")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="EndGrossVolume"
                                  field="EndGrossVolume"
                                  header={t("TankVolume_EndGrossVolume")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="StartNetVolume"
                                  field="StartNetVolume"
                                  header={t("TankVolume_StartNetVolume")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="EndNetVolume"
                                  field="EndNetVolume"
                                  header={t("TankVolume_EndNetVolume")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="Density"
                                  field="Density"
                                  header={t("TankVolume_Density")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="Temperature"
                                  field="Temperature"
                                  header={t("TankVolume_Temprature")}
                                ></DataTable.Column>
                              </DataTable>
                            </div>
                          </div>
                        </Accordion.Content>
                      </Accordion>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Accordion>
                        <Accordion.Content
                          className="attributeAccordian"
                          title={t("PipelineDispatchDetails_MeterTransactionSummary")}
                        >
                          <div className="row marginRightZero tableScroll">
                            <div className="col-12 detailsTable">
                              <DataTable
                                data={loadingDetails.Table1}
                              >
                                <DataTable.Column
                                  className="compColHeight"
                                  key="MeterCode"
                                  field="MeterCode"
                                  header={t("PipelineReceipt_MeterCode")}
                                  initialWidth="150px"
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="StartGrossTotalizer"
                                  field="StartGrossTotalizer"
                                  header={t("TankTransaction_StartGrossTotalizer")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="EndGrossTotalizer"
                                  field="EndGrossTotalizer"
                                  header={t("TankMeter_EndGrossTotalizer")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="StartNetTotalizer"
                                  field="StartNetTotalizer"
                                  header={t("TankTransaction_StartNetTotalizer")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="EndNetTotalizer"
                                  field="EndNetTotalizer"
                                  header={t("TankMeter_EndNetTotalizer")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="Density"
                                  field="Density"
                                  header={t("TankMeter_Density")}
                                ></DataTable.Column>
                                <DataTable.Column
                                  className="compColHeight"
                                  key="Temperature"
                                  field="Temperature"
                                  header={t("TankMeter_Temperature")}
                                ></DataTable.Column>
                              </DataTable>
                            </div>
                          </div>
                        </Accordion.Content>
                      </Accordion>
                    </ErrorBoundary>
                  </ Tab.Pane>
                )
              })}
            </Tab>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
