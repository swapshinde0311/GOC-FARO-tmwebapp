import React from "react";
import { DataTable } from "@scuf/datatable";
import { Icon } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";

RailDispatchViewLoadingDetailsDetails.propTypes = {
  loadingDetailsList: PropTypes.array,
  hideColumnList: PropTypes.array,
};

export function RailDispatchViewLoadingDetailsDetails({
  loadingDetailsList,
  hideColumnList,
}) {
  const columnDisplaySetting = {
    BCUCode: true,
    BaseProductCode: true,
    BayCode: true,
    CalculatedGross: true,
    CalculatedNet: true,
    CalculatedValueUOM: true,
    CarrierCode: true,
    CompartmentSeqNoInVehicle: true,
    Density: true,
    EndTime: true,
    EndTotalizer: true,
    EndWeightInAir: true,
    EndWeightInVacuum: true,
    GeneralTMUserID: true,
    GrossQuantity: true,
    IsBonded: true,
    IsBonded1: true,
    Mass: true,
    MeterCode: true,
    Netendtotalizer: true,
    NetQuantity: true,
    Netstarttotalizer: true,
    OfficerID: true,
    PresetQuantity: true,
    Pressure: true,
    ProductCategoryType: true,
    ProductCode: true,
    ReferenceDensity: true,
    Remarks: true,
    StartTime: true,
    StartTotalizer: true,
    StartWeightInAir: true,
    TankCode: true,
    Temperature: true,
    TrailerCode: true,
    TransactionID: true,
    WeighInAir: true,
    WeightInVacuum: true,
    resetQuantity: true,
  };
  for (let item of hideColumnList) {
    if (columnDisplaySetting[item] !== undefined) {
      columnDisplaySetting[item] = false;
    }
  }

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
      console.log("Error in convertNumberWithUOM  : " + quantityString);
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
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="detailsTable loadingTable">
              <DataTable
                data={loadingDetailsList}
                scrollable={true}
                resizableColumns={true}
              >
                {columnDisplaySetting.CompartmentSeqNoInVehicle ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="CompartmentSeqNoInVehicle"
                    field="CompartmentSeqNoInVehicle"
                    header={t("ViewRailLoadingDetails_SequenceNo")}
                  />
                ) : null}
                {columnDisplaySetting.TrailerCode ? (
                  <DataTable.Column
                    initialWidth="160px"
                    className="compColHeight"
                    key="TrailerCode"
                    field="TrailerCode"
                    header={t("ViewRailLoadingDetails_RailWagonCode")}
                  />
                ) : null}
                {columnDisplaySetting.CarrierCode ? (
                  <DataTable.Column
                    initialWidth="160px"
                    className="compColHeight"
                    key="CarrierCode"
                    field="CarrierCode"
                    header={t("ViewRailLoadingDetails_CarrierCompany")}
                  />
                ) : null}
                {columnDisplaySetting.ProductCode ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="ProductCode"
                    field="ProductCode"
                    header={t("ViewRailLoadingDetails_ProductCode")}
                  />
                ) : null}
                {columnDisplaySetting.BaseProductCode ? (
                  <DataTable.Column
                    initialWidth="160px"
                    className="compColHeight"
                    key="BaseProductCode"
                    field="BaseProductCode"
                    header={t("ViewRailLoadingDetails_BaseProductCode")}
                  />
                ) : null}
                {columnDisplaySetting.TankCode ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="TankCode"
                    field="TankCode"
                    header={t("ViewRailLoadingDetails_TankCode")}
                  />
                ) : null}
                {columnDisplaySetting.BayCode ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="BayCode"
                    field="BayCode"
                    header={t("ViewRailLoadingDetails_BayCode")}
                  />
                ) : null}
                {columnDisplaySetting.BCUCode ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="BCUCode"
                    field="BCUCode"
                    header={t("ViewRailLoadingDetails_BCUCode")}
                  />
                ) : null}
                {columnDisplaySetting.MeterCode ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="MeterCode"
                    field="MeterCode"
                    header={t("ViewRailLoadingDetails_MeterCode")}
                  />
                ) : null}
                {columnDisplaySetting.GrossQuantity ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="GrossQuantity"
                    field="GrossQuantity"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_GrossQuantity")}
                  />
                ) : null}
                {columnDisplaySetting.NetQuantity ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="NetQuantity"
                    field="NetQuantity"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_NetQuantity")}
                  />
                ) : null}
                {columnDisplaySetting.Density ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="Density"
                    field="Density"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_Density")}
                  />
                ) : null}
                {columnDisplaySetting.Pressure ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="Pressure"
                    field="Pressure"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_Pressure")}
                  />
                ) : null}
                {columnDisplaySetting.Temperature ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="Temperature"
                    field="Temperature"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_Temperature")}
                  />
                ) : null}
                {columnDisplaySetting.Mass ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="Mass"
                    field="Mass"
                    header={t("ViewRailLoadingDetails_Mass")}
                  />
                ) : null}
                {columnDisplaySetting.StartTime ? (
                  <DataTable.Column
                    initialWidth="200px"
                    className="compColHeight"
                    key="StartTime"
                    field="StartTime"
                    header={t("ViewRailLoadingDetails_StartTime")}
                    renderer={(cellData) => {
                      return (
                        new Date(cellData.value).toLocaleDateString() +
                        " " +
                        new Date(cellData.value).toLocaleTimeString()
                      );
                    }}
                  />
                ) : null}
                {columnDisplaySetting.EndTime ? (
                  <DataTable.Column
                    initialWidth="200px"
                    className="compColHeight"
                    key="EndTime"
                    field="EndTime"
                    header={t("ViewRailLoadingDetails_EndTime")}
                    renderer={(cellData) => {
                      return (
                        new Date(cellData.value).toLocaleDateString() +
                        " " +
                        new Date(cellData.value).toLocaleTimeString()
                      );
                    }}
                  />
                ) : null}
                {columnDisplaySetting.StartTotalizer ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="StartTotalizer"
                    field="StartTotalizer"
                    renderer={(celldata) => changeNoSpaceNumber(celldata)}
                    header={t("ViewRailLoadingDetails_StartTotalizer")}
                  />
                ) : null}
                {columnDisplaySetting.EndTotalizer ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="EndTotalizer"
                    field="EndTotalizer"
                    renderer={(celldata) => changeNoSpaceNumber(celldata)}
                    header={t("ViewRailLoadingDetails_EndTotalizer")}
                  />
                ) : null}
                {columnDisplaySetting.TransactionID ? (
                  <DataTable.Column
                    initialWidth="160px"
                    className="compColHeight"
                    key="TransactionID"
                    field="TransactionID"
                    header={t("ViewRailLoadingDetails_TransactionNo")}
                  />
                ) : null}
                {columnDisplaySetting.ReferenceDensity ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="ReferenceDensity"
                    field="ReferenceDensity"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_ReferenceDensity")}
                  />
                ) : null}
                {columnDisplaySetting.Remarks ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="Remarks"
                    field="Remarks"
                    header={t("ViewRailLoadingDetails_Remarks")}
                  />
                ) : null}
                {columnDisplaySetting.PresetQuantity ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="PresetQuantity"
                    field="PresetQuantity"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_PresetQuantity")}
                  />
                ) : null}
                {columnDisplaySetting.resetQuantity ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="resetQuantity"
                    field="resetQuantity"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_resetQuantity")}
                  />
                ) : null}
                {columnDisplaySetting.Netstarttotalizer ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="NetStartTotalizer"
                    field="NetStartTotalizer"
                    header={t("ViewRailLoadingDetails_netstarttotalizer")}
                  />
                ) : null}
                {columnDisplaySetting.NetEndtoTalizer ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="NetEndtoTalizer"
                    field="NetEndtoTalizer"
                    header={t("ViewRailLoadingDetails_netendtotalizer")}
                  />
                ) : null}
                {columnDisplaySetting.WeightInAir ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="WeightInAir"
                    field="WeightInAir"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_WeightInAir")}
                  />
                ) : null}
                {columnDisplaySetting.WeightInVacuum ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="WeightInVacuum"
                    field="WeightInVacuum"
                    renderer={(cellData) =>
                      convertNumberWithUOM(cellData.value)
                    }
                    header={t("ViewRailLoadingDetails_WeightInVacuum")}
                  />
                ) : null}
                {columnDisplaySetting.IsBonded ? (
                  <DataTable.Column
                    initialWidth="90px"
                    className="compColHeight"
                    key="IsBonded"
                    field="IsBonded"
                    header={t("ViewRailLoadingDetails_IsBonded")}
                    renderer={(cellData) => {
                      if (cellData.value) {
                        return <Icon name="check" size="small" color="green" />;
                      } else {
                        return <Icon name="close" size="small" color="red" />;
                      }
                    }}
                  />
                ) : null}
                {columnDisplaySetting.CalculatedGross ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="CalculatedGross"
                    field="CalculatedGross"
                    header={t("ViewRailLoadingDetails_CalculatedGross")}
                  />
                ) : null}
                {columnDisplaySetting.CalculatedNet ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="CalculatedNet"
                    field="CalculatedNet"
                    header={t("ViewRailLoadingDetails_CalculatedNet")}
                  />
                ) : null}
                {columnDisplaySetting.CalculatedValueUOM ? (
                  <DataTable.Column
                    initialWidth="130px"
                    className="compColHeight"
                    key="CalculatedValueUOM"
                    field="CalculatedValueUOM"
                    header={t("ViewRailLoadingDetails_CalculatedValueUOM")}
                  />
                ) : null}
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
