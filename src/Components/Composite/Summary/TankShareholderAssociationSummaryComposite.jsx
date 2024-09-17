import React from "react";
import WijmoGridComposite from "../Common/WijmoGridComposite";
import { useTranslation } from "@scuf/localization";
import { Button, Input, Label } from "@scuf/common";
import { DataTable } from "@scuf/datatable";

export function TankShareholderAssociationSummaryComposite({
  tableData,
  columnDetails,
  pageSize,
  exportRequired,
  exportFileName,
  columnPickerRequired,
  columnGroupingRequired,
  terminalsToShow,
  selectionRequired,
  onSelectionChange,
  parentComponent,
  handleViewAuditTrail,
  selectedItems,
  isDetails,
  handleEditTank,
  isEnableModify,
  modShareholderList,
  handleFieldChange,
  modSelectedTankShareholderDetails,
  handleSave,
  saveEnabled,
  handleReset,
  handleViewReport,
  selectedShareholder,
  OverwriteGrossNetValues
}) {
  const [t] = useTranslation();

  const decimalDisplayValues = (cellData) => {
    const { value } = cellData;
    if (typeof value === "number" && value !== null) {
      return value.toLocaleString();
    } else {
      return value;
    }
  };

  const handleCustomEditTextBox = (cellData, type) => {
    if (type === "grossQuantity") {
      // if (selectedShareholder !== "All" && selectedShareholder.includes(cellData.rowData.ShareholderCode)) {
      return (<Input
        fluid
        value={modSelectedTankShareholderDetails[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleFieldChange(value, cellData, type)}
        reserveSpace={false}
        disabled={(cellData.rowData.CalculatedGrossVolume !== null
          && (cellData.rowData.CalculatedGrossVolume >= 0)
          && !OverwriteGrossNetValues && cellData.rowData.LimitQuantity > 0) ? true : false}
      />)
      //}
    }
    else
      return (
        <Input
          fluid
          value={type === "shareholder" ?
            modShareholderList[cellData.rowIndex][cellData.field]
            : modSelectedTankShareholderDetails[cellData.rowIndex][cellData.field]}
          onChange={(value) => handleFieldChange(value, cellData, type)}
          reserveSpace={false}
        />
      );
  };

  return (
    <div>
      <WijmoGridComposite
        data={tableData}
        columns={columnDetails}
        rowsPerPage={pageSize}
        exportRequired={exportRequired}
        exportFileName={exportFileName}
        columnPickerRequired={columnPickerRequired}
        columnGroupingRequired={columnGroupingRequired}
        terminalsToShow={terminalsToShow}
        selectionRequired={selectionRequired}
        onSelectionHandle={onSelectionChange}
        parentComponent={parentComponent}
      ></WijmoGridComposite>

      <div className="row userActionPosition">
        {selectedItems.length > 0 ?
          <div className="col-12 col-md-3 col-lg-6">
            <Button
              content={isEnableModify ? t("TankShareholderAssn_EditCommingleButton") : t("TankShareholderAssn_ViewCommingleButton")}
              onClick={handleEditTank}
            ></Button>
          </div> : <div className="col-12 col-md-3 col-lg-6" />}
        <div className="col-12 col-md-9 col-lg-6">
          <div style={{ float: "right" }}>
            <Button
              content={t("ViewShipmentStatus_ViewAuditTrail")}
              onClick={handleViewAuditTrail}
            ></Button>
            <Button
              content={t("TankShareholderAssn_ViewComminglingReport")}
              onClick={handleViewReport}
            ></Button>
          </div>
        </div>
      </div>
      {
        isDetails && selectedItems.length > 0 ?
          <>
            <div style={{ display: "flex", flexWrap: "wrap" }} >
              <div className="col col-lg-3">
                <h5>{t("TankShareholderAssn_ProposedPercentageQuantity")}</h5>
                {/* <fieldset className="fieldset" style={{ "width": "95%" }}>
                  <legend className="legend">{t("TankShareholderAssn_ProposedPercentageQuantity")}</legend>
                </fieldset> */}
                <DataTable data={modShareholderList}>
                  <DataTable.Column
                    className="compColHeight"
                    key="ShareholderCode"
                    field="ShareholderCode"
                    header={t("AccessCardInfo_Shareholder")}

                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="Volume"
                    field="Volume"
                    header={t("TankShareholderAssn_PercentageLimitQuantity")}
                    editFieldType="text"
                    renderer={(cellData) =>
                      decimalDisplayValues(cellData)
                    }
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(
                        cellData, "shareholder"
                      )
                    }
                    editable={true}
                    initialWidth='100px'
                  ></DataTable.Column>
                </DataTable>
              </div>
              <div className="col col-lg-9">
                {/* <fieldset className="fieldset">
                  <legend className="legend">{t("TankShareholderAssn_ComminglingDetails")}</legend>
                </fieldset> */}
                <h5>{t("TankShareholderAssn_ComminglingDetails")}</h5>
                <DataTable data={modSelectedTankShareholderDetails}>
                  <DataTable.Column
                    className="compColHeight"
                    key="TankCode"
                    field="TankCode"
                    header={t("AtgConfigure_TankCode")}
                    initialWidth='120px'
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="ShareholderCode"
                    field="ShareholderCode"
                    header={t("AccessCardInfo_Shareholder")}

                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="BaseProductCode"
                    field="BaseProductCode"
                    header={t("BaseProductInfo_BaseProdCode")}

                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="LimitQuantity"
                    field="LimitQuantity"
                    header={t("TankShareholderAssn_CurrentLimitCapacity")}

                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="LimitQuantityPercentage"
                    field="LimitQuantityPercentage"
                    header={t("TankShareholderAssn_PercentageCurrentLimitCapacity")}

                  ></DataTable.Column>
                  {/* {<>{handleTableColumn()}</>} */}
                  <DataTable.Column
                    className="compColHeight"
                    key="CalculatedGrossVolume"
                    field="CalculatedGrossVolume"
                    header={t("TankShareholderAssn_CalculatedGrossQuantity")}
                    renderer={(cellData) =>
                      decimalDisplayValues(cellData)
                    }
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(
                        cellData, "grossQuantity"
                      )
                    }
                    editable={true}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="VolumeUOM"
                    field="VolumeUOM"
                    header={t("ExchangeAgreementDetailsItem_UOM")}
                    initialWidth='80px'
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="NewLimitQuantity"
                    field="NewLimitQuantity"
                    header={t("TankShareholderAssn_ProposedLimitCapacity")}
                    renderer={(cellData) =>
                      decimalDisplayValues(cellData)
                    }
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(
                        cellData, "newQuantity"
                      )
                    }
                    editable={true}
                    editFieldType="text"
                  ></DataTable.Column>
                </DataTable>
              </div>
            </div>
            <div className="col-12 col-md-9 col-lg-12">
              <div style={{ float: "right" }}>
                <Button
                  content={t("LookUpData_btnReset")}
                  className="cancelButton"
                  onClick={handleReset}
                ></Button>
                <Button
                  content={t("Save")}
                  disabled={!saveEnabled}
                  onClick={handleSave}
                ></Button>
              </div>
            </div>
          </> : null
      }
    </div>
  );
}
