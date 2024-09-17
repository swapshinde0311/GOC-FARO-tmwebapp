import React from "react";
import PropTypes from "prop-types";
import { Button, Icon } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";

TruckShipmentViewLoadingDetails.propTypes = {
  handleBack: PropTypes.func.isRequired,
  ShipmentCode: PropTypes.string,
  modLoadingDetails: PropTypes.array.isRequired,
  expandedRows: PropTypes.array.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  nonConfigColumns: PropTypes.array.isRequired,
};

TruckShipmentViewLoadingDetails.defaultProps = {};

export function TruckShipmentViewLoadingDetails({
  ShipmentCode,
  modLoadingDetails,
  handleBack,
  expandedRows,
  toggleExpand,
  nonConfigColumns,
}) {
  const [t] = useTranslation();

  const expanderTemplate = (data) => {
    const open =
      expandedRows.findIndex((x) => x.seqNo === data.rowData.seqNo) >= 0
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

  function rowExpansionTemplate(data) {
    let secondRow = [data];
    let thirdRow = [];
    if (
      !nonConfigColumns.includes(
        "CalculatedGross",
        "CalculatedNet",
        "CalculatedValueUOM",
        "FlowRate",
        "NetStartTotalizer",
        "NetEndTotalizer",
        "LeakageTotalizer",
        "DriverCode",
        "VapourGrossQuantity",
        "VapourNetQuantity",
        "LoadingArmCode",
        "PresetQuantity",
        "ResetQuantity",
        "Remarks"
      )
    )
      thirdRow = [data];

    return Array.isArray(secondRow) && secondRow.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={secondRow}>
          {!nonConfigColumns.includes("productdensity") ? (
            <DataTable.Column
              className="compColHeight"
              key="productdensity"
              field="productdensity"
              header={t("LoadingDetails_ProductDensity")}
              editable={false}
            ></DataTable.Column>
          ) : null}
          {!nonConfigColumns.includes("weightinair") ? (
            <DataTable.Column
              className="compColHeight"
              key="weightinair"
              field="weightinair"
              header={t("LoadingDetails_WeightInAir")}
              editable={false}
            />
          ) : null}
          {!nonConfigColumns.includes("weightinvacuum") ? (
            <DataTable.Column
              className="compColHeight"
              key="weightinvacuum"
              field="weightinvacuum"
              header={t("LoadingDetails_WeightInVacuum")}
              editable={false}
            ></DataTable.Column>
          ) : null}
          {!nonConfigColumns.includes("metercode") ? (
            <DataTable.Column
              className="compColHeight"
              key="metercode"
              field="metercode"
              header={t("LoadingDetails_MeterCode")}
              editable={false}
            />
          ) : null}
          {!nonConfigColumns.includes("starttotalizer") ? (
            <DataTable.Column
              className="compColHeight"
              key="starttotalizer"
              field="starttotalizer"
              header={t("LoadingDetails_StartTotalizer")}
              editable={false}
            ></DataTable.Column>
          ) : null}
          {!nonConfigColumns.includes("endtotalizer") ? (
            <DataTable.Column
              className="compColHeight"
              key="endtotalizer"
              field="endtotalizer"
              header={t("LoadingDetails_EndTotalizer")}
              editable={false}
            />
          ) : null}
          {!nonConfigColumns.includes("starttime") ? (
            <DataTable.Column
              className="compColHeight"
              key="starttime"
              field="starttime"
              header={t("LoadingDetails_StartTime")}
              editable={false}
            ></DataTable.Column>
          ) : null}
          {!nonConfigColumns.includes("endtime") ? (
            <DataTable.Column
              className="compColHeight"
              key="endtime"
              field="endtime"
              header={t("LoadingDetails_EndTime")}
              editable={false}
            />
          ) : null}
          {!nonConfigColumns.includes("temperature") ? (
            <DataTable.Column
              className="compColHeight"
              key="temperature"
              field="temperature"
              header={t("LoadingDetails_Temperature")}
              editable={false}
            ></DataTable.Column>
          ) : null}
          {!nonConfigColumns.includes("pressure") ? (
            <DataTable.Column
              className="compColHeight"
              key="pressure"
              field="pressure"
              header={t("LoadingDetails_Pressure")}
              editable={false}
            />
          ) : null}
        </DataTable>
        {thirdRow.map((item) => {
          return (
            <>
              <DataTable data={item}>
                {!nonConfigColumns.includes("CalculatedGross") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="CalculatedGross"
                    field="CalculatedGross"
                    header={t("LoadingDetails_CalculatedGross")}
                    editable={false}
                  ></DataTable.Column>
                ) : null}
                {!nonConfigColumns.includes("CalculatedNet") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="CalculatedNet"
                    field="CalculatedNet"
                    header={t("LoadingDetails_CalculatedNet")}
                    editable={false}
                  />
                ) : null}
                {!nonConfigColumns.includes("CalculatedValueUOM") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="CalculatedValueUOM"
                    field="CalculatedValueUOM"
                    header={t("LoadingDetails_CalculatedValueUOM")}
                    editable={false}
                  />
                ) : null}
                {!nonConfigColumns.includes("FlowRate") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="FlowRate"
                    field="FlowRate"
                    header={t("LoadingDetails_FlowRate")}
                    editable={false}
                  ></DataTable.Column>
                ) : null}
                {!nonConfigColumns.includes("NetStartTotalizer") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="NetStartTotalizer"
                    field="NetStartTotalizer"
                    header={t("LoadingDetails_NetStartTotalizer")}
                    editable={false}
                  />
                ) : null}
                {!nonConfigColumns.includes("NetEndTotalizer") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="NetEndTotalizer"
                    field="NetEndTotalizer"
                    header={t("LoadingDetails_NetEndTotalizer")}
                    editable={false}
                  ></DataTable.Column>
                ) : null}
                {!nonConfigColumns.includes("LeakageTotalizer") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="LeakageTotalizer"
                    field="LeakageTotalizer"
                    header={t("LoadingDetails_LeakageTotalizer")}
                    editable={false}
                  />
                ) : null}
                {!nonConfigColumns.includes("DriverCode") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="DriverCode"
                    field="DriverCode"
                    header={t("LoadingDetails_DriverCode")}
                    editable={false}
                  ></DataTable.Column>
                ) : null}
                {!nonConfigColumns.includes("VapourGrossQuantity") ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="VapourGrossQuantity"
                    field="VapourGrossQuantity"
                    header={t("LoadingDetails_VapourGrossQuantity")}
                    editable={false}
                  />
                ) : null}
              </DataTable>
            </>
          );
        })}
      </div>
    ) : (
      <div className="compartmentIcon">
        <div className="gridButtonAlignLeft">
          {t("CustomerInventory_NoRecordsFound")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="detailsContainer">
        <div className="row">
          <div className="col col-md-8 col-lg-9 col col-xl-9">
            <h3>
              {t("ViewShipment_ViewLoadingDetails") + " : " + ShipmentCode}
            </h3>
          </div>
        </div>
        <div className="row marginRightZero tableScroll">
          <div className="col-12 detailsTable">
            <DataTable
              data={modLoadingDetails.Table}
              scrollable={true}
              rowExpansionTemplate={rowExpansionTemplate}
              scrollHeight="320px"
              expandedRows={expandedRows}
            >
              {!nonConfigColumns.includes("trailercode") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="trailercode"
                  field="trailercode"
                  header={t("TrailerList_Code")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("compartmentcode") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="compartmentcode"
                  field="compartmentcode"
                  header={t("ShipmentCompDetail_wcCompartmentCode")}
                  editable={false}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("CompartmentSeqNoInVehicle") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  header={t("LoadingDetailsEntry_CompSeqNo")}
                  field={"CompartmentSeqNoInVehicle"}
                  key={"CompartmentSeqNoInVehicle"}
                  editable={false}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("productcode") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="productcode"
                  field="productcode"
                  header={t("ProductAllocation_Product_Code")}
                  editable={false}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("loadingdetailstype") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  header={t("LoadingDetails_LoadingDetailsType")}
                  editable={false}
                  field={"loadingdetailstype"}
                  key={"loadingdetailstype"}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("tankcode") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  header={t("LoadingDetails_TankCode")}
                  editable={false}
                  field={"tankcode"}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("baycode") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  header={t("LoadingDetails_BayCode")}
                  editable={false}
                  field={"baycode"}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("bcucode") ? (
                <DataTable.Column
                  className="compColHeight colminWidth"
                  header={t("LoadingDetails_BCUCode")}
                  editable={false}
                  field={"bcucode"}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("grossquantity") ? (
                <DataTable.Column
                  key={"grossquantity"}
                  className="compColHeight colminWidth"
                  header={t("LoadingDetails_GrossQuantity")}
                  editable={false}
                  field={"grossquantity"}
                ></DataTable.Column>
              ) : null}
              {!nonConfigColumns.includes("netquantity") ? (
                <DataTable.Column
                  key={"netquantity"}
                  className="compColHeight colminWidth"
                  header={t("LoadingDetails_NetQuantity")}
                  editable={false}
                  field={"netquantity"}
                ></DataTable.Column>
              ) : null}
              <DataTable.Column
                className="expandedColumn"
                initialWidth="50px"
                renderer={expanderTemplate}
              />
            </DataTable>
          </div>
        </div>
        <div className="row">
          <div className="col col-lg-8">
            <Button
              className="backButton"
              onClick={handleBack}
              content={t("Back")}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
