import React from "react";
import { DataTable } from "@scuf/datatable";
import { DatePicker, Input, Select, Checkbox } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";


RailReceiptRecordWeightDetails.propTypes = {
  modRailReceipt: PropTypes.object.isRequired,
  modWeighBridgeData: PropTypes.array.isRequired,
  listOptions: PropTypes.shape({
    WeighBridges: PropTypes.array,
  }).isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
};

RailReceiptRecordWeightDetails.defaultProps = {};
export function RailReceiptRecordWeightDetails({
  modRailReceipt,
  modWeighBridgeData,
  listOptions,
  handleCellDataEdit,
  onDateTextChange
}) {
  const [t] = useTranslation();

  const handleCustomEditDropDown = (cellData, dropDownoptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modWeighBridgeData[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownoptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modWeighBridgeData[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };
  const handleReceiptEdiCheckbox = (cellData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Checkbox
          style={{ textAlign: "center" }}
          fluid
          checked={modWeighBridgeData[cellData.rowIndex][cellData.field]}
          onChange={(value) => handleCellDataEdit(value, cellData)}
          reserveSpace={false}
        />
      </div>
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

  const handleCustomEditDateSelect = (cellData) => {
    return (
      <DatePicker
        fluid
        value={
          modWeighBridgeData[cellData.rowIndex][
            cellData.field
          ] === null
            ? ""
            : new Date(
              modWeighBridgeData[cellData.rowIndex][
              cellData.field
              ]
            )
        }
        type="datetime"
        minuteStep={5}
        displayFormat={getCurrentDateFormat()}
        indicator="required"
        disableFuture={true}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        onTextChange={(value, error) => {
          onDateTextChange(cellData, value, error);
        }}
        reserveSpace={false}
      ></DatePicker>
    );
  };

 

  const dateDisplayValues = (cellData) => {
    const { value } = cellData;
    return value !== null ? new Date(value).toLocaleDateString() + " " + new Date(value).toLocaleTimeString() : "";
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailReceipt.ReceiptCode}
                disabled={true}
                label={t("Rail_Receipt_Code")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailReceipt.Description}
                label={t("Rail_Receipt_Desc")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modRailReceipt.ScheduledDate === null
                    ? ""
                    : new Date(modRailReceipt.ScheduledDate)
                }
                label={t("ViewShipment_ScheduleDate")}
                type="datetime"
                disablePast={true}
                disabled={true}
                minuteStep="5"
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailReceipt.ReceiptStatus}
                label={t("Rail_Receipt_ReceiptStatus")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailReceipt.Remark}
                label={t("Reconciliation_Remarks")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 detailsTable">
              <DataTable data={modWeighBridgeData} editable={true}>
                <DataTable.Column
                  className="compColHeight"
                  key="WagonCode"
                  field="WagonCode"
                  header={t("Rail_Wagon_Code")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="FinishedProductCode"
                  field="FinishedProductCode"
                  header={t("Receipt_Product")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeight"
                  field="TareWeight"
                  header={t("RailWagonConfigurationDetails_TareWeight")}
                  editable={true}
                  editFieldType="number"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeightUOM"
                  field="TareWeightUOM"
                  header={t("ViewReceiptStatus_QuantityUOM")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeightWeightBridgeCode"
                  field="TareWeightWeightBridgeCode"
                  header={t("weighBridge_tare")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(celldata) =>
                    handleCustomEditDropDown(celldata, listOptions.WeighBridges)
                  }
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeightOperatorOverWritten"
                  field="TareWeightOperatorOverWritten"
                  header={t("Operator_OverWrite_Tare")}
                  renderer={(celldata) => handleReceiptEdiCheckbox(celldata)}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="LadenWeight"
                  field="LadenWeight"
                  header={t("PCDET_Planning_gvLadenWeight")}
                  editable={true}
                  editFieldType="number"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="LadenWeightUOM"
                  field="LadenWeightUOM"
                  header={t("AtgConfigure_UOM")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="LadenWeightWeightBridgeCode"
                  field="LadenWeightWeightBridgeCode"
                  header={t("weighBridge_Laden")}
                  editable={true}
                  customEditRenderer={(celldata) =>
                    handleCustomEditDropDown(celldata, listOptions.WeighBridges)
                  }
                ></DataTable.Column>
                <DataTable.Column
                        className="compColHeight"
                        key="StartTime"
                        field="StartTime"
                        header={t("LoadingDetails_StartTime")}
                        displayFormat={getCurrentDateFormat()}
                        editable={true}
                        renderer={(cellData) => dateDisplayValues(cellData)}
                        customEditRenderer={(cellData) =>
                          handleCustomEditDateSelect(cellData)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="EndTime"
                        field="EndTime"
                        header={t("LoadingDetails_EndTime")}
                        displayFormat={getCurrentDateFormat()}
                        editable={true}
                        renderer={(cellData) => dateDisplayValues(cellData)}
                        customEditRenderer={(cellData) =>
                          handleCustomEditDateSelect(cellData)
                        }
                      ></DataTable.Column>

                <DataTable.Column
                  className="compColHeight"
                  key="LadenWeightOperatorOverWritten"
                  field="LadenWeightOperatorOverWritten"
                  header={t("Operator_OverWrite_Laden")}
                  renderer={(celldata) => handleReceiptEdiCheckbox(celldata)}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="LoadingType"
                  field="LoadingType"
                  header={t("Bay_LoadType")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
