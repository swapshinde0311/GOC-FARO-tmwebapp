import React from "react";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";
import PropTypes from "prop-types";
import { Icon } from "@scuf/common";
RailTransloadingDetails.propTypes = {
  railTransloading: PropTypes.object.isRequired,
  railReceipt: PropTypes.object.isRequired,
  selectedCompRow: PropTypes.array.isRequired,
  railTransloadingAssociatedShipmentsColumns: PropTypes.array.isRequired,
  railTransloadingDetailsColumns: PropTypes.array.isRequired,
  dsCompartmentsBaseProduct: PropTypes.array.isRequired,
  dsTransloadingShipments: PropTypes.array.isRequired,
  dsTransloadingShipmentLoadingDetails: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  setCurrentList: PropTypes.func.isRequired,
  isSelect: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
  expandedRows: PropTypes.array.isRequired,
  toggleExpand: PropTypes.func.isRequired,
};
export function RailTransloadingDetails({
  railTransloading,
  railReceipt,
  dsCompartmentsBaseProduct,
  dsTransloadingShipments,
  dsTransloadingShipmentLoadingDetails,
  railTransloadingAssociatedShipmentsColumns,
  railTransloadingDetailsColumns,
  handleRowSelectionChange,
  selectedCompRow,
  setCurrentList,
  isSelect,
  onRowClick,
  expandedRows,
  toggleExpand,
}) {
  const [t] = useTranslation();
  // const decimalDisplayValues = (cellData) => {
  //   const { value } = cellData;
  //   if (typeof value === "number") {
  //     return value.toLocaleString();
  //   } else {
  //     return value;
  //   }
  // };
  const expanderTemplate = (data) => {
    const open =
      expandedRows.findIndex((x) => x.compSeqNo === data.rowData.compSeqNo) >= 0
        ? true
        : false;
    return (
      <div
        onClick={() => toggleExpand(data.rowData, open)}
        className="compartmentIcon gridButtonFontColor"
      >
        <Icon
          root="common"
          name={open ? "slidercontrols-minus" : "ellipsis-horizontal"}
          className="margin_l10"
        />
      </div>
    );
  };
  const rowExpansionTemplate = (data) => {
    let CompData = [];
    CompData.push(data);
    return (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={CompData}>
          <DataTable.Column
            className="starttotalizer"
            key="starttotalizer"
            field="starttotalizer"
            header={t("StartTotalizer")}
            editable={false}
          ></DataTable.Column>
          <DataTable.Column
            className="endtotalizer"
            key="endtotalizer"
            field="endtotalizer"
            header={t("EndTotalizer")}
            editable={false}
          ></DataTable.Column>
          <DataTable.Column
            className="productdensity"
            key="productdensity"
            field="productdensity"
            header={t("Density")}
            editable={false}
            renderer={(cellData) => convertNumberWithUOM(cellData.value)}
          ></DataTable.Column>
          <DataTable.Column
            className="temperature"
            key="temperature"
            field="temperature"
            header={t("Temperature")}
            editable={false}
          ></DataTable.Column>
          <DataTable.Column
            className="pressure"
            key="pressure"
            field="pressure"
            header={t("Pressure")}
            editable={false}
          ></DataTable.Column>
        </DataTable>
      </div>
    );
  };
  const convertNumberWithUOM = (quantityString) => {
    if (quantityString === null || quantityString === undefined) {
      return "";
    }
    const quantityList = quantityString.split(" ", 2);
    if (quantityList.length !== 2) {
      return "";
    }
    if (quantityList[0] === "") {
      return "";
    }
    return parseFloat(quantityList[0]).toLocaleString() + " " + quantityList[1];
  };
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("BayAllocationReceiptSearch_ReceiptCode")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{railReceipt.ReceiptCode}</label>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("BayAllocationReceiptSearch_ReceiptStatus")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{railReceipt.ReceiptStatus}</label>
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_NoOfComps")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{railTransloading.totalNoOfTransWagons}</label>
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_NoOfBps")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{railTransloading.NoOfProducts}</label>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_TotalReceiptQty")}
              </label>
              <label>:</label>
              <label> </label>
              <label>
                {railTransloading.receiptPlannedQty.toLocaleString() +
                  " " +
                  railTransloading.PlanQuantityUOM}
              </label>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_ReceiptPlannedQty")}
              </label>
              <label>:</label>
              <label> </label>
              <label>
                {railTransloading.totalPlannedQtyForTransloadingWagons.toLocaleString() +
                  " " +
                  railTransloading.PlanQuantityUOM}
              </label>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_ReceiptUnloadedQty")}
              </label>
              <label>:</label>
              <label> </label>
              <label>
                {railTransloading.totalUnloadedQtyForTransloadingWagons.toLocaleString() +
                  " " +
                  railTransloading.UnloadedQuantityUOM}
              </label>
            </div>
          </div>

          <div className="row" style={{ alignItems: "stretch" }}>
            <div
              className="col-12 col-md-6 col-lg-2"
              style={{ border: "1px solid #c8c8c8", minHeight: "400px" }}
            >
              <div>
                <label className="headerLabel">
                  {t("viewTransloading_Compartments")}
                </label>
              </div>

              <ul>
                {railTransloading.lstCompartmentList.map((item, i) => {
                  return (
                    <li
                      index={i}
                      className={isSelect === i ? "activeted" : ""}
                      onClick={(e) => setCurrentList(e, item.CompartmentCode)}
                      key={item.CompartmentCode}
                    >
                      {item.compartBP}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-12 col-md-6 col-lg-10">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-10">
                  <br></br>
                  <br></br>
                  <label className="TransloadingheaderLabel">
                    {t("ViewShipment_Compartment")}
                  </label>
                  <label>:</label>
                  <label> </label>
                  <label className="TransloadingheaderLabel">
                    {railTransloading.selectCompartment.CompartmentCode}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-3">
                  <b>
                    <label>{t("viewTransloading_BPCode")}</label>
                  </b>
                  <label>:</label>
                  <label> </label>
                  <label>
                    {railTransloading.selectCompartment.CompartmentProduct}
                  </label>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <b>
                    <label>
                      {t("LocalTransactionsMapping_PlannedQuantity")}
                    </label>
                  </b>
                  <label>:</label>
                  <label> </label>
                  <label>
                    {railTransloading.selectCompartment.PlannedQuantity.toLocaleString() +
                      " " +
                      railTransloading.selectCompartment.PlanQuantityUOM}
                  </label>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <b>
                    <label>{t("UnLoadingInfo_UnloadQuantity")}</label>
                  </b>
                  <label>:</label>
                  <label> </label>
                  <label>
                    {railTransloading.selectCompartment.UnloadedQuantity.toLocaleString() +
                      " " +
                      railTransloading.selectCompartment.UnloadedQuantityUOM}
                  </label>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <b>
                    <label>{t("UserAdmin_Status")}</label>
                  </b>
                  <label>:</label>
                  <label> </label>
                  <label>
                    {
                      railTransloading.selectCompartment
                        .ReceiptCompartmentStatus
                    }
                  </label>
                </div>
              </div>
              <br></br>
              <div
                className="row"
                style={{
                  display: railTransloading.showShipment ? "block" : "none",
                }}
              >
                <label className="TransloadingheaderLabel">
                  {t("viewTransloading_AssocShips")}
                </label>
                <label>:</label>
                <label> </label>
              </div>
              <div
                className="row"
                style={{
                  display: railTransloading.showShipment ? "block" : "none",
                }}
              >
                <DataTable
                  data={dsTransloadingShipments}
                  selectionMode="multiple"
                  onCellClick={(data) =>
                    onRowClick !== undefined ? onRowClick(data.rowData) : {}
                  }
                  onSelectionChange={handleRowSelectionChange}
                >
                  {dsTransloadingShipments !== null &&
                  dsTransloadingShipments.length > 0
                    ? railTransloadingAssociatedShipmentsColumns.map(function (
                        key
                      ) {
                        return (
                          <DataTable.Column
                            className="compColHeight"
                            key={key.displayName}
                            field={key.field}
                            header={t(key.displayName)}
                            editable={false}
                            rowHeader={false}
                            editFieldType="text"
                          ></DataTable.Column>
                        );
                      })
                    : ""}
                </DataTable>
              </div>
              <br></br>
              <div
                className="row"
                style={{
                  display: railTransloading.showLoadingDetails
                    ? "block"
                    : "none",
                }}
              >
                <label className="TransloadingheaderLabel">
                  {t("viewTransloading_ShipLoadingDetails")}
                </label>
                <label>:</label>
                <label>{""}</label>
              </div>
              <div
                className="row"
                style={{
                  display: railTransloading.showLoadingDetails
                    ? "block"
                    : "none",
                }}
              >
                <DataTable
                  data={dsTransloadingShipmentLoadingDetails}
                  selectionMode="multiple"
                  rowExpansionTemplate={rowExpansionTemplate}
                  expandedRows={expandedRows}
                >
                  <DataTable.Column
                    className="compColHeight"
                    key="trailercode"
                    field="trailercode"
                    header={t("Trailer")}
                    editable={false}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="compSeqNo"
                    field="compSeqNo"
                    header={t("ViewMarineLoadingDetails_CompartmentSeqNo")}
                    editable={false}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="compartmentcode"
                    field="compartmentcode"
                    header={t("ViewShipment_CompartmentCode")}
                    editable={false}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="productcode"
                    field="productcode"
                    header={t("UnloadingDetails_BaseProductCode")}
                    editable={false}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="bcuCode"
                    field="bcuCode"
                    header={t("BCU_BCU")}
                    editable={false}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="meterCode"
                    field="meterCode"
                    header={t("Meter_Meter")}
                    editable={false}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="grossquantity"
                    field="grossquantity"
                    header={t("GrossQuantity")}
                    editable={false}
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="netquantity"
                    field="netquantity"
                    header={t("NetQuantity")}
                    editable={false}
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="starttime"
                    field="starttime"
                    header={t("StartTime")}
                    editable={false}
                    renderer={(cellData) => {
                      return new Date(cellData.value).toLocaleString();
                    }}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="endtime"
                    field="endtime"
                    header={t("EndTime")}
                    editable={false}
                    renderer={(cellData) => {
                      return new Date(cellData.value).toLocaleString();
                    }}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    renderer={expanderTemplate}
                  />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
