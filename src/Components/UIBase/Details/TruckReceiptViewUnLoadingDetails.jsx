import React from "react";
import { DataTable } from "@scuf/datatable";
import PropTypes from "prop-types";
import { useTranslation } from "@scuf/localization";
import { Button, Icon } from "@scuf/common";

TruckReceiptViewUnLoadingDetails.propTypes = {
  ModViewUnloadDetails: PropTypes.array.isRequired,
  handleBack: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  expandedRows: PropTypes.array.isRequired,
};

TruckReceiptViewUnLoadingDetails.defaultProps = {};

export function TruckReceiptViewUnLoadingDetails({
  ModViewUnloadDetails,
  handleBack,
  toggleExpand,
  expandedRows,
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
    let thirdRow = [data];
    return Array.isArray(secondRow) && secondRow.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={secondRow}>
          <DataTable.Column
            className="compColHeight"
            key="baycode"
            field="baycode"
            header={t("LoadingDetails_BayCode")}
            initialWidth="107px"
            editable={false}
          ></DataTable.Column>

          <DataTable.Column
            className="compColHeight"
            key="bcucode"
            field="bcucode"
            header={t("BCU_Code")}
            initialWidth="107px"
            editable={false}
          />

          <DataTable.Column
            className="compColHeight"
            key="grossquantity"
            field="grossquantity"
            header={t("LoadingDetails_GrossQuantity")}
            initialWidth="107px"
            editable={false}
          />

          <DataTable.Column
            className="compColHeight"
            key="netquantity"
            field="netquantity"
            header={t("LoadingDetails_NetQuantity")}
            initialWidth="107px"
            editable={false}
          />
          <DataTable.Column
            className="compColHeight"
            key="starttime"
            field="starttime"
            header={t("LoadingDetails_StartTime")}
            editable={false}
            // initialWidth="72px"
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            key="endtime"
            field="endtime"
            header={t("LoadingDetails_EndTime")}
            editable={false}
            // initialWidth="72px"
          />
          <DataTable.Column
            className="compColHeight"
            key="productdensity"
            field="productdensity"
            header={t("LoadingDetails_ProductDensity")}
            editable={false}
            initialWidth="95px"
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            key="metercode"
            field="metercode"
            header={t("LoadingDetails_MeterCode")}
            editable={false}
            initialWidth="77px"
          />
        </DataTable>
        <DataTable data={thirdRow}>
          <DataTable.Column
            className="compColHeight"
            key="starttotalizer"
            field="starttotalizer"
            header={t("StartTotalizer")}
            editable={false}
            initialWidth="90px"
          ></DataTable.Column>

          <DataTable.Column
            className="compColHeight"
            key="endtotalizer"
            field="endtotalizer"
            header={t("EndTotalizer")}
            editable={false}
            initialWidth="90px"
          />
          <DataTable.Column
            className="compColHeight"
            key="weightinvacuum"
            field="weightinvacuum"
            header={t("UnloadingDetails_WeightInVacuum")}
            editable={false}
            initialWidth="98px"
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            key="weightinair"
            field="weightinair"
            header={t("UnloadingDetails_WeightInAir")}
            editable={false}
            initialWidth="84px"
          />

          <DataTable.Column
            className="compColHeight"
            key="temperature"
            field="temperature"
            header={t("LoadingDetails_Temperature")}
            editable={false}
            initialWidth="116px"
          ></DataTable.Column>

          <DataTable.Column
            className="compColHeight"
            key="pressure"
            field="pressure"
            header={t("LoadingDetails_Pressure")}
            editable={false}
            initialWidth="93px"
          />
        </DataTable>
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
    <div className="detailsContainer">
      <div className="row marginRightZero tableScroll">
        <div className="detailsTable loadingTable">
          <DataTable
            data={ModViewUnloadDetails}
            scrollable={true}
            bAutoWidth={true}
            scrollHeight="450px"
            resizableColumns={true}
            rowExpansionTemplate={rowExpansionTemplate}
            expandedRows={expandedRows}
          >
            <DataTable.Column
              className="compColHeight"
              key="trailercode "
              field="trailercode"
              initialWidth="125px"
              header={t("ViewReceipt_TrailerCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="CompartmentSeqNoInVehicle"
              field="CompartmentSeqNoInVehicle"
              initialWidth="146px"
              header={t("Receipt_CompSeqInVehicle")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="compartmentcode"
              field="compartmentcode"
              initialWidth="165px"
              header={t("Receipt_CompartmentCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="FinishedProductcode"
              field="FinishedProductcode"
              initialWidth="130px"
              header={t("Report_ProductCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="baseProductcode"
              field="baseProductcode"
              initialWidth="155px"
              header={t("BaseProductCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="Unloadingdetailstype"
              field="Unloadingdetailstype"
              initialWidth="190px"
              header={t("UnloadingDetails_UnloadingDetailsType")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="TankCode"
              field="TankCode"
              initialWidth="105px"
              header={t("TankList_Code")}
            ></DataTable.Column>
            <DataTable.Column
              className="expandedColumn"
              initialWidth="22px"
              renderer={expanderTemplate}
            />
          </DataTable>
        </div>
      </div>
      <div className="col col-lg-8">
        <Button
          className="backButton"
          onClick={handleBack}
          content={t("Back")}
        ></Button>
      </div>
    </div>
  );
}
