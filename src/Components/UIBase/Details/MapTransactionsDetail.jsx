import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";
import { Input, Select } from "@scuf/common";
import {
  getOptionsWithSelect,
  handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
import * as Constants from "../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";

MapTransactionsDetail.propTypes = {
  modMapTransactions: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  otherData: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    transportationTypes: PropTypes.array.isRequired,
    transactionTypes: PropTypes.array.isRequired,
    shareholderCodes: PropTypes.array.isRequired,
    dispatchReceiptCodes: PropTypes.array.isRequired,
    transactionCodes: PropTypes.array.isRequired,
    tankCodes: PropTypes.array.isRequired,
    railReceiptCodes: PropTypes.array.isRequired,
    railWagonCodes: PropTypes.array.isRequired,
    marineReceiptCodes: PropTypes.array.isRequired,
  }).isRequired,
  onTransactionSearchChange: PropTypes.func.isRequired,
  onReceiptSearchChange: PropTypes.func.isRequired,
  selectedCompRow: PropTypes.array.isRequired,
  handleComRowSelectionChange: PropTypes.func.isRequired,
  handleComRowClick: PropTypes.func.isRequired,
  selectLocalTransactionRow: PropTypes.array.isRequired,
  handleLocalTranRowSelectionChange: PropTypes.func.isRequired,
  handleLocalTranRowClick: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleGetTanksForMeter: PropTypes.func.isRequired,
};

export function MapTransactionsDetail({
  modMapTransactions,
  validationErrors,
  otherData,
  listOptions,
  onTransactionSearchChange,
  onReceiptSearchChange,
  selectedCompRow,
  handleComRowSelectionChange,
  handleComRowClick,
  selectLocalTransactionRow,
  handleLocalTranRowSelectionChange,
  handleLocalTranRowClick,
  onFieldChange,
  handleCellDataEdit,
  handleGetTanksForMeter,
}) {
  const [t] = useTranslation();

  const handleBatchTankCodeDropDown = (cellData) => {
    return (
      <Select
        className="selectDropwdown"
        value={otherData.BatchInfoForUI[cellData.rowIndex][cellData.field]}
        fluid
        options={listOptions.tankCodes}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  const handleTankEditDropDown = (cellData) => {
    if (
      modMapTransactions.TransLoadBcu === false &&
      otherData.BatchInfoForUI[cellData.rowIndex].ProductType ===
        "Report_BaseProduct"
    ) {
      handleGetTanksForMeter(
        otherData.BatchInfoForUI[cellData.rowIndex].MeterCode
      );
      return handleBatchTankCodeDropDown(cellData);
    }
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                placeholder={t("Common_Select")}
                label={t("MeterUnaccountedTransaction_Type")}
                options={listOptions.transactionTypes}
                value={modMapTransactions.TransactionType}
                onChange={(data) => onFieldChange("TransactionType", data)}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                placeholder={t("Common_Select")}
                label={t("Common_TransactionCode")}
                options={getOptionsWithSelect(
                  listOptions.transactionCodes,
                  t("Common_Select")
                )}
                value={modMapTransactions.TransactionCode}
                onChange={(data) => onFieldChange("TransactionCode", data)}
                reserveSpace={false}
                search={true}
                onSearch={onTransactionSearchChange}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            {modMapTransactions.TransportationType ===
            Constants.TransportationType.ROAD ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("RailDispatchPlanDetail_ShareHolderCode")}
                  options={listOptions.shareholderCodes}
                  value={modMapTransactions.ShareholderCode}
                  onChange={(data) => onFieldChange("ShareholderCode", data)}
                  reserveSpace={false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            ) : null}
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("RailDispatchLoadSpotAssign_ScheduledDate")}
                value={
                  otherData.ScheduledDate === ""
                    ? ""
                    : new Date(otherData.ScheduledDate).toLocaleDateString()
                }
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("Common_TransactionStatus")}
                value={otherData.Status}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            {modMapTransactions.TransportationType ===
            Constants.TransportationType.ROAD ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  label={t("Report_DriverCode")}
                  value={otherData.DriverCode}
                  reserveSpace={false}
                  disabled={true}
                />
              </div>
            ) : null}
            {(modMapTransactions.TransportationType === Constants.TransportationType.ROAD
            || modMapTransactions.TransportationType === Constants.TransportationType.MARINE)
              ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  label={ modMapTransactions.TransportationType ===
                    Constants.TransportationType.ROAD
                      ? t("Vehicle_Code")
                      : t("Vessel_Code")  
                    } 
                  reserveSpace={false}
                  value={otherData.VehicleCode}
                  disabled={true}
                />
              </div>
            ) : null}
          </div>

          {otherData.DispatchReceiptInfoForUI.length > 0 ? (
            <div>
              <div className="col col-md-8 col-lg-9 col col-xl-9">
                <h4>{t("PCDET_SHPDetailsPopup_Title")}</h4>
              </div>
              <div className="row">
                <div className="col-12 detailsTable">
                  <DataTable
                    data={otherData.DispatchReceiptInfoForUI}
                    selectionMode="single"
                    selection={selectedCompRow}
                    onSelectionChange={handleComRowSelectionChange}
                    onCellClick={(data) => handleComRowClick(data.rowData)}
                    scrollable={true}
                    scrollHeight="300px"
                  >
                    <DataTable.Column
                      className="compColHeight"
                      key="CompartmentSeqNoInVehicle"
                      field="CompartmentSeqNoInVehicle"
                      header={
                        modMapTransactions.TransportationType ===
                        Constants.TransportationType.ROAD
                          ? t("ShipmentProdDetail_CompSeqInVehicle")
                          : t("ViewShipmentStatus_PlannedTripNo")
                      }
                    ></DataTable.Column>
                     {modMapTransactions.TransportationType ===
                    (Constants.TransportationType.ROAD || Constants.TransportationType.RAIL) ? (
                    <DataTable.Column
                      className="compColHeight"
                      key="TrailerCode"
                      field="TrailerCode"
                      header={
                        modMapTransactions.TransportationType ===
                        Constants.TransportationType.ROAD
                          ? t("Marine_ShipmentCompDetail_wcTrailerCode")
                          : t("RailWagonConfigurationDetails_RailWagonCode")
                      }
                    ></DataTable.Column>
                    ) : null}
                    {modMapTransactions.TransportationType ===
                    Constants.TransportationType.RAIL ? (
                      <DataTable.Column
                        className="compColHeight"
                        key="ShareholderCode"
                        field="ShareholderCode"
                        header={t("Report_Shareholder")}
                      ></DataTable.Column>
                    ) : null}
                    <DataTable.Column
                      className="compColHeight"
                      key="FinishedProductCode"
                      field="FinishedProductCode"
                      header={t("FinishedProductList_Code")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="CustomerOrSupplierCode"
                      field="CustomerOrSupplierCode"
                      header={
                        modMapTransactions.TransactionType === "RECEIPT"
                          ? t("Supplier_Code")
                          : t("Customer_Code")
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="DestinationOrOriginTerminalCode"
                      field="DestinationOrOriginTerminalCode"
                      header={
                        modMapTransactions.TransactionType === "RECEIPT"
                          ? t("OriginTerminal_Code")
                          : t("ShipmentProdDetail_DestinationCode")
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="PlannedQuantity"
                      field="PlannedQuantity"
                      header={t("ViewMarineShipmentList_PlannedQuantity")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="ActualQuantity"
                      field="ActualQuantity"
                      header={
                        modMapTransactions.TransactionType === "RECEIPT"
                          ? t("UnLoadingInfo_UnloadQuantity")
                          : t("ShipmentOrder_LoadedQuantity")
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="Status"
                      field="Status"
                      header={t("ShipmentProdDetail_Status")}
                      renderer={(cellData) => {
                        if (
                          otherData.DispatchReceiptInfoForUI[cellData.rowIndex][
                            cellData.field
                          ] !== null
                        ) {
                          return Utilities.getKeyByValue(
                            modMapTransactions.TransactionType === "RECEIPT"? Constants.ReceiptCompartmentStatus: Constants.ShipmentCompartmentStatus,
                            otherData.DispatchReceiptInfoForUI[
                              cellData.rowIndex
                            ][cellData.field]
                          );
                        }
                      }}
                    ></DataTable.Column>
                  </DataTable>
                </div>
              </div>
            </div>
          ) : null}

          {otherData.LocalTranInfoForUI.length > 0 ? (
            <div>
              <div className="col col-md-8 col-lg-9 col col-xl-9">
                <h4>{t("UnmatchedLocalTrans_PageTitle")}</h4>
              </div>
              <div className="row">
                <div className="col-12 detailsTable">
                  <DataTable
                    data={otherData.LocalTranInfoForUI}
                    selectionMode="single"
                    selection={selectLocalTransactionRow}
                    onSelectionChange={handleLocalTranRowSelectionChange}
                    onCellClick={(data) =>
                      handleLocalTranRowClick(data.rowData)
                    }
                    scrollable={true}
                    scrollHeight="300px"
                    search={true}
                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                  >
                    <DataTable.Column
                      className="compColHeight"
                      key="LocationCode"
                      field="LocationCode"
                      header= { modMapTransactions.TransportationType ===
                      Constants.TransportationType.MARINE
                        ? t("LocationInfo_BerthCode")
                        : t("Bay_Code")  
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="BCUCode"
                      field="BCUCode"
                      header={t("BCU_Code")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="TransactionID"
                      field="TransactionID"
                      header={t("ViewRailLoadingDetails_TransactionNo")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="BatchID"
                      field="BatchID"
                      header={t("UnmatchedLocalTrans_BatchNo")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="VehicleCode"
                      field="VehicleCode"
                      header= { modMapTransactions.TransportationType ===
                        Constants.TransportationType.ROAD
                          ? t("Vehicle_Code")
                          : t("Vessel_Code")  
                        } 
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="CompartmentNo"
                      field="CompartmentNo"
                      header={t("ViewShipmentStatus_SeqNo")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="ArmNo"
                      field="ArmNo"
                      header={t("Meter_ArmNo")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="LoadNumber"
                      field="LoadNumber"
                      header={t("LocalTransactionsMapping_LoadNumber")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="GrossQuantity"
                      field="GrossQuantity"
                      header={t("GrossQuantity")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="StartTime"
                      field="StartTime"
                      header={t("ViewShipmentTrailer_StartTime")}
                      renderer={(cellData) => {
                        if (
                          otherData.LocalTranInfoForUI[cellData.rowIndex][
                            cellData.field
                          ]
                        ) {
                          return new Date(
                            otherData.LocalTranInfoForUI[cellData.rowIndex][
                              cellData.field
                            ]
                          ).toLocaleString();
                        }
                      }}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="EndTime"
                      field="EndTime"
                      header={t("ViewShipmentTrailer_EndTime")}
                      renderer={(cellData) => {
                        if (
                          otherData.LocalTranInfoForUI[cellData.rowIndex][
                            cellData.field
                          ]
                        ) {
                          return new Date(
                            otherData.LocalTranInfoForUI[cellData.rowIndex][
                              cellData.field
                            ]
                          ).toLocaleString();
                        }
                      }}
                    ></DataTable.Column>
                  </DataTable>
                </div>
              </div>
            </div>
          ) : null}

          {otherData.BatchInfoForUI.length > 0 ? (
            <div>
              <div className="col col-md-8 col-lg-9 col col-xl-9">
                <h4>{t("LocalTransactions_BatchDetails")}</h4>
              </div>
              <div className="row">
                <div className="col-12 detailsTable">
                  <DataTable
                    data={otherData.BatchInfoForUI}
                    scrollable={true}
                    scrollHeight="300px"
                  >
                    <DataTable.Column
                      className="compColHeight"
                      key="ProductCode"
                      field="ProductCode"
                      header={t("ContractInfo_Product")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="ProductType"
                      field="ProductType"
                      header={t("ProductType_Title")}
                      renderer={(cellData) => {
                        return t(
                          otherData.BatchInfoForUI[cellData.rowIndex][
                            cellData.field
                          ]
                        );
                      }}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="MeterCode"
                      field="MeterCode"
                      header={t("Meter_Code")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="TankCode"
                      field="TankCode"
                      header={handleIsRequiredCompartmentCell(t("TankCode"))}
                      editable={true}
                      editFieldType="text"
                      customEditRenderer={(cellData) =>
                        handleTankEditDropDown(cellData)
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="GrossQuantity"
                      field="GrossQuantity"
                      header={t("GrossQuantity")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="NetQuantity"
                      field="NetQuantity"
                      header={t("NetQuantity")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="StartTotalizer"
                      field="StartTotalizer"
                      header={t("StartTotalizer")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="EndTotalizer"
                      field="EndTotalizer"
                      header={t("EndTotalizer")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="Density"
                      field="Density"
                      header={t("Density")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="Pressure"
                      field="Pressure"
                      header={t("Pressure")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="Temperature"
                      field="Temperature"
                      header={t("Temperature")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="StartTime"
                      field="StartTime"
                      header={t("StartTime")}
                      renderer={(cellData) => {
                        if (
                          otherData.BatchInfoForUI[cellData.rowIndex][
                            cellData.field
                          ]
                        ) {
                          return new Date(
                            otherData.BatchInfoForUI[cellData.rowIndex][
                              cellData.field
                            ]
                          ).toLocaleString();
                        }
                      }}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="EndTime"
                      field="EndTime"
                      header={t("EndTime")}
                      renderer={(cellData) => {
                        if (
                          otherData.BatchInfoForUI[cellData.rowIndex][
                            cellData.field
                          ]
                        ) {
                          return new Date(
                            otherData.BatchInfoForUI[cellData.rowIndex][
                              cellData.field
                            ]
                          ).toLocaleString();
                        }
                      }}
                    ></DataTable.Column>
                  </DataTable>
                </div>
              </div>
            </div>
          ) : null}

          {modMapTransactions.TransLoadBcu === true &&
          modMapTransactions.TransLoadSource ===
            Constants.TransportationType.RAIL ? (
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("Rail_Receipt_Code")}
                  options={getOptionsWithSelect(
                    listOptions.receiptCodes,
                    t("Common_Select")
                  )}
                  value={modMapTransactions.EntityCode}
                  onChange={(data) => onFieldChange("EntityCode", data)}
                  error={t(validationErrors.EntityCode)}
                  reserveSpace={false}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                  onSearch={onReceiptSearchChange}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("RailWagonConfigurationDetails_RailWagonCode")}
                  options={listOptions.railWagonCodes}
                  value={modMapTransactions.WagonCode}
                  onChange={(data) => onFieldChange("WagonCode", data)}
                  error={t(validationErrors.WagonCode)}
                  reserveSpace={false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            </div>
          ) : null}

          {modMapTransactions.TransLoadBcu === true &&
          modMapTransactions.TransLoadSource ===
            Constants.TransportationType.MARINE ? (
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("LD_Marine_ReceiptCode")}
                  options={getOptionsWithSelect(
                    listOptions.receiptCodes,
                    t("Common_Select")
                  )}
                  value={modMapTransactions.EntityCode}
                  onChange={(data) => onFieldChange("EntityCode", data)}
                  error={t(validationErrors.EntityCode)}
                  reserveSpace={false}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                  onSearch={onReceiptSearchChange}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </TranslationConsumer>
  );
}
