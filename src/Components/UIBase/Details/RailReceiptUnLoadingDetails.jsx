import React from "react";
import { DataTable } from "@scuf/datatable";
import PropTypes from "prop-types";
import { useTranslation } from "@scuf/localization";

RailReceiptUnLoadingDetails.propTypes = {
  tableData: PropTypes.array,
  handleBack: PropTypes.func.isRequired,
};

RailReceiptUnLoadingDetails.defaultProps = {};

export function RailReceiptUnLoadingDetails({ tableData, handleBack }) {
  const [t] = useTranslation();
  const convertNumberWithUOM = (quantityString) => {
    try {
      if (
        quantityString === null ||
        quantityString === undefined ||
        quantityString === " "
      ) {
        return "";
      }
      const quantityList = quantityString.split(" ", 2);
      if (quantityList.length !== 2) {
        return "";
      }
      if (quantityList[0] === "") {
        return "";
      }
      return (
        parseFloat(quantityList[0]).toLocaleString() + " " + quantityList[1]
      );
    } catch (error) {
      console.log("Error in convertNumberWithUOM " + quantityString);
      return quantityString;
    }
  };
  const changeNoSpaceNumber = (e) => {
    const { value } = e;
    if (value != null && value !== "") {
      return value.toLocaleString();
    }
    return "";
  };

  return (
    <div className="detailsContainer">
      <div className="row">
        <div className="detailsTable loadingTable">
          <DataTable
            data={tableData}
            scrollable={true}
            bAutoWidth={true}
            scrollHeight="450px"
            resizableColumns={true}
          >
            <DataTable.Column
              className="compColHeight"
              key="CompartmentSeqNoInVehicle"
              field="CompartmentSeqNoInVehicle"
              initialWidth="125px"
              header={t("RailDispatchTrainAssignment_SequenceNo")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="TrailerCode"
              field="TrailerCode"
              initialWidth="146px"
              header={t("Rail_Wagon_Code")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="CarrierCode"
              field="CarrierCode"
              initialWidth="140px"
              header={t("ViewReceipt_CarrierCompany")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="ProductCode"
              field="ProductCode"
              initialWidth="130px"
              header={t("Report_ProductCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="BaseProductCode"
              field="BaseProductCode"
              initialWidth="155px"
              header={t("BaseProductCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="TankCode"
              field="TankCode"
              initialWidth="105px"
              header={t("TankList_Code")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="BayCode"
              field="BayCode"
              initialWidth="120px"
              header={t("ViewRailLoadingDetails_BayCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="BCUCode"
              field="BCUCode"
              initialWidth="110px"
              header={t("BCU_Code")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="MeterCode"
              field="MeterCode"
              initialWidth="110px"
              header={t("LoadingDetails_MeterCode")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="GrossQuantity"
              field="GrossQuantity"
              initialWidth="130px"
              renderer={(cellData) => convertNumberWithUOM(cellData.value)}
              header={t("LoadingDetailsEntry_GrossQuantity")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="NetQuantity"
              field="NetQuantity"
              initialWidth="130px"
              renderer={(cellData) => convertNumberWithUOM(cellData.value)}
              header={t("LoadingDetailsEntry_NetQuantity")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="Density"
              field="Density"
              initialWidth="150px"
              renderer={(cellData) => convertNumberWithUOM(cellData.value)}
              header={t("UnLoadingInfo_ProductDensity")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="Pressure"
              field="Pressure"
              initialWidth="100px"
              renderer={(cellData) => convertNumberWithUOM(cellData.value)}
              header={t("UnloadingDetailsEntry_Pressure")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="Temperature"
              field="Temperature"
              initialWidth="120px"
              renderer={(cellData) => convertNumberWithUOM(cellData.value)}
              header={t("LoadingDetailsEntry_Temperature")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="StartTime"
              field="StartTime"
              initialWidth="190px"
              header={t("Reconciliation_StartTime")}
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
              key="EndTime"
              field="EndTime"
              initialWidth="190px"
              type="datetime"
              renderer={(cellData) => {
                return (
                  new Date(cellData.value).toLocaleDateString() +
                  " " +
                  new Date(cellData.value).toLocaleTimeString()
                );
              }}
              header={t("Reconciliation_EndTime")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="StartTotalizer"
              field="StartTotalizer"
              initialWidth="125px"
              renderer={(celldata) => changeNoSpaceNumber(celldata)}
              header={t("StartTotalizer")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="EndTotalizer"
              initialWidth="125px"
              field="EndTotalizer"
              renderer={(celldata) => changeNoSpaceNumber(celldata)}
              header={t("EndTotalizer")}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="TransactionID"
              field="TransactionID"
              initialWidth="140px"
              header={t("ViewRailUnloadingDetails_TransactionNo")}
            ></DataTable.Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
