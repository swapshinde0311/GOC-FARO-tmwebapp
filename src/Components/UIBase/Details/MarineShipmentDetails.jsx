import React, {useState} from "react";
import {Button, Modal, Checkbox, DatePicker, Input, Tab} from "@scuf/common";
import {TranslationConsumer} from "@scuf/localization";
import {DataTable} from "@scuf/datatable";
import PropTypes from "prop-types";
import {MarineDispatchCompartmentDetailType, Shipment_Status} from "../../../JS/Constants";

MarineShipmentDetails.propTypes = {
  modMarineDispatch: PropTypes.object.isRequired,
  marineShipmentPlan: PropTypes.array.isRequired,
  marineCompartmentDetails: PropTypes.array.isRequired,
  handleAuthorizeToLoad: PropTypes.func.isRequired,
  handleCloseShipment: PropTypes.func.isRequired,
  handlePrintFAN: PropTypes.func.isRequired,
  handlePrintBOL: PropTypes.func.isRequired,
  handleBSIOutbound: PropTypes.func.isRequired,
  handleViewAuditTrail: PropTypes.func.isRequired,
  handleViewLoadingDetails: PropTypes.func.isRequired,
  shipmentNextOperations: PropTypes.array.isRequired,
  handleViewBOL: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
};

export default function MarineShipmentDetails({
  modMarineDispatch,
  marineShipmentPlan,
  marineCompartmentDetails,
  handleAuthorizeToLoad,
  handleCloseShipment,
  handlePrintFAN,
  handlePrintBOL,
  handleBSIOutbound,
  handleViewAuditTrail,
  handleViewLoadingDetails,
  handleViewBOL,
  handleBack,
  operationsVisibilty,
  onRowClick,
  handleCellDataEdit,
  handleCellCheck,
  compartmentDetailsSave,
  shipmentNextOperations,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [modCellData, setModCellData] = useState({});

  const handleStatus = (e) => {
    if (e === MarineDispatchCompartmentDetailType.EMPTY) {
      return "EMPTY";
    } else if (e === MarineDispatchCompartmentDetailType.LOADING) {
      return "LOADING";
    } else if (e === MarineDispatchCompartmentDetailType.PART_FILLED) {
      return "PART_FILLED";
    } else if (e === MarineDispatchCompartmentDetailType.OVER_FILLED) {
      return "OVER_FILLED";
    } else if (e === MarineDispatchCompartmentDetailType.FORCE_COMPLETED) {
      return "FORCE_COMPLETED";
    } else if (e === MarineDispatchCompartmentDetailType.COMPLETED) {
      return "COMPLETED";
    } else if (e === MarineDispatchCompartmentDetailType.INTERRUPTED) {
      return "INTERRUPTED";
    } else {
      return "";
    }
  };

  const handleQuantity = (e, UOM) => {
    if (e != null) {
      return e + UOM;
    } else {
      return "";
    }
  };

  const inputInDataTable = (cellData) => {
    return (
      <Input
        fluid
        disabled={
          operationsVisibilty.adjustPlanIsDisable ||
          modMarineDispatch.DispatchStatus !== Shipment_Status.QUEUED ||
          (cellData.rowData.DispatchCompartmentStatus === (MarineDispatchCompartmentDetailType.FORCE_COMPLETED || MarineDispatchCompartmentDetailType.LOADING || MarineDispatchCompartmentDetailType.COMPLETED || MarineDispatchCompartmentDetailType.OVER_FILLED))
        }
        onChange={(data) => handleCellDataEdit(data, cellData)}
        reserveSpace={false}
      />
    );
  };

  const checkBoxInDataTable = (cellData) => {
    return (
      <div style={{textAlign: "center"}}>
        <Checkbox
          style={{textAlign: "center"}}
          checked={marineCompartmentDetails[cellData.rowIndex][cellData.field]}
          disabled={
            operationsVisibilty.forceCompleteIsDisable ||
            cellData.rowData.DispatchCompartmentStatus === MarineDispatchCompartmentDetailType.LOADING ||
            (cellData.rowData.DispatchCompartmentStatus === (MarineDispatchCompartmentDetailType.FORCE_COMPLETED || MarineDispatchCompartmentDetailType.LOADING || MarineDispatchCompartmentDetailType.COMPLETED || MarineDispatchCompartmentDetailType.OVER_FILLED)) ||
            (modMarineDispatch.DispatchStatus === (Shipment_Status.PARTIALLY_LOADED || Shipment_Status.AUTO_LOADED || Shipment_Status.INTERRUPTED || Shipment_Status.MANUALLY_LOADED))
          }
          onClick={(e) => {
            e.stopPropagation();
            setModCellData(cellData);
            if (!marineCompartmentDetails[cellData.rowIndex][cellData.field]) {
              setModelOpen(true);
            } else {
              handleCellCheck(modCellData);
            }
          }}
        />
      </div>
    );
  };

  function displayTMModalforInValidConfirm() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={modelOpen} size="small">
            <Modal.Content>
              <div>
                <b>{t("ForceToComplete")}</b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                content={t("Cancel")}
                onClick={() => {
                  setModelOpen(false);
                }}
              />
              <Button
                type="primary"
                content={t("Confirm")}
                onClick={() => {
                  setModelOpen(false);
                  handleCellCheck(modCellData);
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  return (
    <div>
      <TranslationConsumer>
        {(t) => (
          <div className="detailsContainer">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modMarineDispatch.DispatchCode || '' }
                  disabled={true}
                  label={t("Marine_ShipmentCompDetail_ShipmentNumber")}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modMarineDispatch.TransportationType || '' }
                  disabled={true}
                  label={t("ViewMarineShipmentDetails_TransportType")}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  label={t("PCDET_Planning_gvVehicleCode")}
                  value={modMarineDispatch.VesselCode || '' }
                  reserveSpace={false}
                  disabled={true}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modMarineDispatch.CarrierCode || '' }
                  disabled={true}
                  label={t("Marine_ShipmentCompDetail_CarrierCompany")}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modMarineDispatch.DispatchStatus || '' }
                  label={t("Marine_ShipmentCompDetail_ShipmentStatus")}
                  reserveSpace={false}
                  disabled={true}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    modMarineDispatch.ScheduledDate === null
                      ? ""
                      : new Date(modMarineDispatch.ScheduledDate)
                  }
                  label={t("Marine_ShipmentCompDetail_ScheduledDate")}
                  type="datetime"
                  disabled={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  label={t("Marine_ShipmentCompDetail_UOM")}
                  value={modMarineDispatch.QuantityUOM || '' }
                  disabled={true}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  label={t("Cust_Status")}
                  value={modMarineDispatch.Active ? "Active" : "Locked"}
                  disabled={true}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modMarineDispatch.Remarks || '' }
                  label={t("Cust_Remarks")}
                  reserveSpace={false}
                  disabled={true}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 detailsTable">
                <Tab defaultActiveIndex={0}>
                  <Tab.Pane
                    title={t("ViewMarineShipmentList_ShipmentPlanInfo")}
                  >
                    <DataTable data={marineShipmentPlan}>
                      <DataTable.Column
                        field="CompartmentSeqNoInVehicle"
                        header={t("ViewMarineShipmentList_SeqNo")}
                        rowHeader={true}
                      />
                      <DataTable.Column
                        field="FinishedProductCode"
                        header={t("ViewShipmentCompartment_Product")}
                        rowHeader={true}
                      />
                      <DataTable.Column
                        field="DispatchCompartmentStatus"
                        header={t("ViewShipmentStatus_Status")}
                        rowHeader={true}
                        renderer={(cellData) =>
                          handleStatus(
                            cellData.rowData.DispatchCompartmentStatus
                          )
                        }
                      />
                      <DataTable.Column
                        field="PlannedQuantity"
                        header={t("ViewShipmentCompartment_PlannedQuantity")}
                        rowHeader={true}
                        renderer={(cellData) =>
                          handleQuantity(
                            cellData.rowData.PlannedQuantity,
                            cellData.rowData.PlanQuantityUOM
                          )
                        }
                      />
                      <DataTable.Column
                        field="AdjustedPlanQuantity"
                        header={t("ViewShipmentCompartment_AdjustedQuantity")}
                        rowHeader={true}
                        renderer={(cellData) =>
                          handleQuantity(
                            cellData.rowData.AdjustedPlanQuantity,
                            cellData.rowData.PlanQuantityUOM
                          )
                        }
                      />
                    </DataTable>
                  </Tab.Pane>
                  <Tab.Pane
                    title={t("ViewShipment_LoadingDetails_TopUpDecant")}
                  >
                    <DataTable
                      data={marineCompartmentDetails}
                      onRowClick={(data) =>
                        onRowClick !== undefined ? onRowClick(data) : {}
                      }
                    >
                      <DataTable.Column
                        className="compColHeight"
                        key="CompartmentSeqNoInVehicle"
                        field="CompartmentSeqNoInVehicle"
                        header={t("ViewMarineShipmentList_SeqNo")}
                        rowHeader={true}
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="FinishedProductCode"
                        field="FinishedProductCode"
                        header={t("ViewShipmentCompartment_Product")}
                        rowHeader={true}
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="DispatchCompartmentStatus"
                        field="DispatchCompartmentStatus"
                        header={t("ViewShipmentStatus_Status")}
                        rowHeader={true}
                        renderer={(celldata) =>
                          handleStatus(
                            celldata.rowData.DispatchCompartmentStatus
                          )
                        }
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="PlannedQuantity"
                        field="PlannedQuantity"
                        header={t("ViewShipmentCompartment_PlannedQuantity")}
                        rowHeader={true}
                        renderer={(cellData) =>
                          handleQuantity(
                            cellData.rowData.PlannedQuantity,
                            cellData.rowData.PlanQuantityUOM
                          )
                        }
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="AdjustedPlanQuantity"
                        field="AdjustedPlanQuantity"
                        header={t("ViewShipmentCompartment_AdjustedQuantity")}
                        rowHeader={true}
                        renderer={(cellData) =>
                          handleQuantity(
                            cellData.rowData.AdjustedPlanQuantity,
                            cellData.rowData.PlanQuantityUOM
                          )
                        }
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="ReturnQuantity"
                        field="ReturnQuantity"
                        header={t("ViewMarineShipmentList_ReturnQuantity")}
                        rowHeader={true}
                        renderer={(cellData) =>
                          handleQuantity(
                            cellData.rowData.ReturnQuantity,
                            cellData.rowData.PlanQuantityUOM
                          )
                        }
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="LoadedQuantity"
                        field="LoadedQuantity"
                        header={t("ViewMarineShipmentList_LoadedQuantity")}
                        rowHeader={true}
                        renderer={(cellData) =>
                          handleQuantity(
                            cellData.rowData.LoadedQuantity,
                            cellData.rowData.PlanQuantityUOM
                          )
                        }
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="AdjustmentToPlannedQuantity"
                        field="AdjustmentToPlannedQuantity"
                        header={t("ViewShipment_AdjustmentToPlannedQuantity")}
                        rowHeader={true}
                        renderer={(cellData) => inputInDataTable(cellData)}
                      />
                      <DataTable.Column
                        className="compColHeight"
                        key="forceComplete"
                        field="forceComplete"
                        header={t("ViewShipment_ForceComplete")}
                        rowHeader={true}
                        renderer={checkBoxInDataTable}
                      />
                    </DataTable>
                  </Tab.Pane>
                </Tab>
              </div>
            </div>

            <div className="row">
              <div className="col col-lg-4">
                <Button
                  className="backButton"
                  onClick={handleBack}
                  content={t("Back")}
                />
              </div>
              <div className="col col-lg-8" style={{textAlign: "right"}}>
                <Button content={t("Save")}
                        onClick={
                          compartmentDetailsSave
                        }
                />
              </div>
            </div>
            <div className="row">
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewMarineShipmentList_AuthorizeToLoad")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewMarineShipmentList_AuthorizeToLoad"
                    ) === -1
                  }
                  onClick={handleAuthorizeToLoad}
                />
              </div>
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewMarineShipmentList_CloseMarineShipment")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewMarineShipmentList_CloseMarineShipment"
                    ) === -1
                  }
                  onClick={handleCloseShipment}
                />
              </div>
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewMarineShipmentList_ViewAuditTrail")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewMarineShipmentList_ViewAuditTrail"
                    ) === -1
                  }
                  onClick={handleViewAuditTrail}
                />
              </div>
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewMarineShipmentList_ViewTransactions")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewMarineShipmentList_ViewTransactions"
                    ) === -1
                  }
                  onClick={handleViewLoadingDetails}
                />
              </div>
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewMarineShipmentList_PrintFAN")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewMarineShipmentList_PrintFAN"
                    ) === -1
                  }
                  onClick={handlePrintFAN}
                />
              </div>
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewMarineShipmentList_ViewBOL")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewMarineShipmentList_ViewBOL"
                    ) === -1
                  }
                  onClick={handleViewBOL}
                />
              </div>
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewMarineShipmentList_PrintBOL")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewMarineShipmentList_PrintBOL"
                    ) === -1
                  }
                  onClick={handlePrintBOL}
                />
              </div>
              <div className="col col-lg-3" style={{textAlign: "right"}}>
                <Button
                  content={t("ViewShipment_BSIOutbound")}
                  disabled={
                    shipmentNextOperations.indexOf(
                      "ViewShipment_BSIOutbound"
                    ) === -1
                  }
                  onClick={handleBSIOutbound}
                />
              </div>
            </div>
          </div>
        )}
      </TranslationConsumer>
      {displayTMModalforInValidConfirm()}
    </div>
  );
}
