import React from "react";
import { DataTable } from "@scuf/datatable";
import { DatePicker, Input, Select, Checkbox } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

RailDispatchRecordWeightDetails.propTypes = {
  modWeightBridgeData: PropTypes.array.isRequired,
  listOptions: PropTypes.shape({
    weightBridges: PropTypes.array,
  }).isRequired,
  onCellDataEdit: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
};
RailDispatchRecordWeightDetails.defaultProps = {};

export function RailDispatchRecordWeightDetails({
  modWeightBridgeData,
  listOptions,
  onCellDataEdit,
  onDateTextChange
}) {
  const [t] = useTranslation();

  const handleCustomEditDropDown = (cellData, dropDownOptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modWeightBridgeData[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownOptions}
        onChange={(value) => onCellDataEdit(value, cellData)}
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
        value={modWeightBridgeData[cellData.rowIndex][cellData.field]}
        onChange={(value) => onCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };
  


  const handleCustomEditDateSelect = (cellData) => {
    return (
      <DatePicker
        fluid
        value={
          modWeightBridgeData[cellData.rowIndex][
            cellData.field
          ] === null
            ? ""
            : new Date(
              modWeightBridgeData[cellData.rowIndex][
              cellData.field
              ]
            )
        }
        type="datetime"
        minuteStep={5}
        displayFormat={getCurrentDateFormat()}
        indicator="required"
        disableFuture={true}
        onChange={(value) => onCellDataEdit(value, cellData)}
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

  const handleReceiptEdiCheckbox = (cellData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Checkbox
          style={{ textAlign: "center" }}
          fluid
          checked={modWeightBridgeData[cellData.rowIndex][cellData.field]}
          onChange={(value) => onCellDataEdit(value, cellData)}
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

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 detailsTable">
              <DataTable
                data={modWeightBridgeData}
                editable={true}
              >
                <DataTable.Column
                  className="compColHeight"
                  key="WagonCode"
                  field="WagonCode"
                  header={t("Rail_Wagon_Code")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="FinishedProductCode"
                  field="FinishedProductCode"
                  header={t("Receipt_Product")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeight"
                  field="TareWeight"
                  header={t("RailWagonConfigurationDetails_TareWeight")}
                  editable={true}
                  editFieldType="number"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeightUOM"
                  field="TareWeightUOM"
                  header={t("ViewReceiptStatus_QuantityUOM")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeightWeightBridgeCode"
                  field="TareWeightWeightBridgeCode"
                  header={t("weighBridge_tare")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(cellData, listOptions.weightBridges)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="TareWeightOperatorOverWritten"
                  field="TareWeightOperatorOverWritten"
                  header={t("Operator_OverWrite_Tare")}
                  renderer={(cellData) => handleReceiptEdiCheckbox(cellData)}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="LadenWeight"
                  field="LadenWeight"
                  header={t("PCDET_Planning_gvLadenWeight")}
                  editable={true}
                  editFieldType="number"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="LadenWeightUOM"
                  field="LadenWeightUOM"
                  header={t("ViewReceiptStatus_QuantityUOM")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="LadenWeightWeightBridgeCode"
                  field="LadenWeightWeightBridgeCode"
                  header={t("weighBridge_Laden")}
                  editable={true}
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(cellData, listOptions.weightBridges)
                  }
                />
                  <DataTable.Column
                        className="compColHeight"
                        key="StartTime"
                        field="StartTime"
                        displayFormat={getCurrentDateFormat()}
                        header={t("LoadingDetails_StartTime")}
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
                        displayFormat={getCurrentDateFormat()}
                        header={t("LoadingDetails_EndTime")}
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
                  renderer={(cellData) => handleReceiptEdiCheckbox(cellData)}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="LoadingType"
                  field="LoadingType"
                  header={t("Bay_LoadType")}
                  editable={false}
                  editFieldType="text"
                />
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
