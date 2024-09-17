import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";
import { Icon } from "@scuf/common";
MarineTransloadingDetails.propTypes = {
  marineTransloading: PropTypes.object.isRequired,
  marineReceipt: PropTypes.object.isRequired,
  selectedCompRow: PropTypes.array.isRequired,
  marineTransloadingAssociatedShipmentsColumns: PropTypes.array.isRequired,
  marineTransloadingDetailsColumns: PropTypes.array.isRequired,
  dsCompartmentsBaseProduct: PropTypes.array.isRequired,
  dsTransloadingShipments: PropTypes.array.isRequired,
  dsTransloadingShipmentLoadingDetails: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  setCurrentList: PropTypes.func.isRequired,
  isSelect: PropTypes.number.isRequired,
  expandedRows: PropTypes.array.isRequired,
  toggleExpand: PropTypes.func.isRequired,

  compartmentDetailsPageSize: PropTypes.number.isRequired,
};

export function MarineTransloadingDetails({
  marineTransloading,
  marineReceipt,
  dsCompartmentsBaseProduct,
  dsTransloadingShipments,
  dsTransloadingShipmentLoadingDetails,
  marineTransloadingAssociatedShipmentsColumns,
  marineTransloadingDetailsColumns,
  handleRowSelectionChange,
  onRowClick,
  selectedCompRow,
  setCurrentList,
  isSelect,
  expandedRows,
  toggleExpand,
  compartmentDetailsPageSize,
}) {
  const [t] = useTranslation();
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
              <label>{marineReceipt.ReceiptCode}</label>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("BayAllocationReceiptSearch_ReceiptStatus")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{marineReceipt.ReceiptStatus}</label>
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_NoOfComps")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{marineTransloading.totalNoOfTransWagons}</label>
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_NoOfBps")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{marineTransloading.NoOfProducts}</label>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_TotalReceiptQty")}
              </label>
              <label>:</label>
              <label> </label>
              <label>
                {marineTransloading.receiptPlannedQty.toLocaleString() +
                  " " +
                  marineTransloading.PlanQuantityUOM}
              </label>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_ReceiptPlannedQty")}
              </label>
              <label>:</label>
              <label> </label>
              <label>
                {marineTransloading.totalPlannedQtyForTransloadingWagons.toLocaleString() +
                  " " +
                  marineTransloading.PlanQuantityUOM}
              </label>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("viewTransloading_ReceiptUnloadedQty")}
              </label>
              <label>:</label>
              <label> </label>
              <label>
                {marineTransloading.totalUnloadedQtyForTransloadingWagons.toLocaleString() +
                  " " +
                  marineTransloading.UnloadedQuantityUOM}
              </label>
            </div>
          </div>
          <div className="row" style={{ alignItems: "stretch" }}>
            <div
              className="col-12 col-md-6 col-lg-2"
              style={{ border: "1px solid #c8c8c8", minHeight: "400px" }}
            >
              <div>
                <label className="TransloadingheaderLabel">
                  {t("viewTransloading_Compartments")}
                </label>
              </div>
              <ul>
                {marineTransloading.lstCompartmentList.map((item, i) => {
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
                    {t("Marine_ReceiptCompDetail_CompartmentCode")}
                  </label>
                  <label>:</label>
                  <label> </label>
                  <label className="TransloadingheaderLabel">
                    {marineTransloading.selectCompartment.CompartmentCode}
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
                    {marineTransloading.selectCompartment.CompartmentProduct}
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
                    {marineTransloading.selectCompartment.PlannedQuantity.toLocaleString() +
                      " " +
                      marineTransloading.selectCompartment.PlanQuantityUOM}
                  </label>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <b>
                    <label>{t("UnLoadingInfo_UnloadQuantity")}</label>
                  </b>
                  <label>:</label>
                  <label> </label>
                  <label>
                    {marineTransloading.selectCompartment.UnloadedQuantity.toLocaleString() +
                      " " +
                      marineTransloading.selectCompartment.UnloadedQuantityUOM}
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
                      marineTransloading.selectCompartment
                        .ReceiptCompartmentStatus
                    }
                  </label>
                </div>
              </div>
              <br></br>
              <div
                className="row"
                style={{
                  display: marineTransloading.showShipment ? "block" : "none",
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
                  display: marineTransloading.showShipment ? "block" : "none",
                }}
              >
                <DataTable
                  data={dsTransloadingShipments}
                  selectionMode="multiple"
                  onCellClick={(data) =>
                    onRowClick !== undefined ? onRowClick(data.rowData) : {}
                  }
                  // onClick={(e) => setTransloadingShipmentLoadingDetailsList(e, item.shipmentCode)}
                  onSelectionChange={handleRowSelectionChange}
                >
                  {dsTransloadingShipments !== null &&
                  dsTransloadingShipments.length > 0
                    ? marineTransloadingAssociatedShipmentsColumns.map(
                        function (key) {
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
                        }
                      )
                    : ""}
                </DataTable>
              </div>
              <br></br>
              <div
                className="row"
                style={{
                  display: marineTransloading.showLoadingDetails
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
                  display: marineTransloading.showLoadingDetails
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
                      return (
                        new Date(cellData.value).toLocaleDateString() +
                        " " +
                        new Date(cellData.value).toLocaleTimeString()
                      );
                    }}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="endtime"
                    field="endtime"
                    header={t("EndTime")}
                    editable={false}
                    renderer={(cellData) => {
                      return (
                        new Date(cellData.value).toLocaleDateString() +
                        " " +
                        new Date(cellData.value).toLocaleTimeString()
                      );
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
