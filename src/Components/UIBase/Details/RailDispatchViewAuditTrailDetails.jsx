import React from "react";
import { DataTable } from "@scuf/datatable";
import { Button, Modal, Checkbox } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Constants from "../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";
import lodash from "lodash";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
wjcCore.setLicenseKey(Constants.wizmoKey);

RailDispatchViewAuditTrailDetails.propTypes = {
  modRailDispatch: PropTypes.object.isRequired,
  auditTrailList: PropTypes.array.isRequired,
  modalData: PropTypes.object.isRequired,
  onModalDataChange: PropTypes.func.isRequired,
  Attributes: PropTypes.array.isRequired,
  onPrint: PropTypes.func.isRequired,
};

export function RailDispatchViewAuditTrailDetails({
  modRailDispatch,
  auditTrailList,
  modalData,
  onModalDataChange,
  Attributes,
  onPrint,
}) {
  const handleAttributeType = (data) => {
    const attribute = data.rowData.AttributesforUI.filter(
      (att) => att.AttributeName === data.name
    )[0];

    return attribute.DataType.toLowerCase() ===
      Constants.DataType.STRING.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
      Constants.DataType.INT.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
      Constants.DataType.LONG.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
      Constants.DataType.FLOAT.toLowerCase() ? (
      <label>{attribute.AttributeValue}</label>
    ) : attribute.DataType.toLowerCase() ===
      Constants.DataType.BOOL.toLowerCase() ? (
      <Checkbox
        checked={
          attribute.AttributeValue.toString().toLowerCase() === "true"
            ? true
            : false
        }
        disabled={true}
      ></Checkbox>
    ) : (
      <label>{new Date(attribute.AttributeValue).toLocaleDateString()}</label>
    );
  };

  const formatter = (engine, label) => {
    label.cls = null;
    engine.fontSize = "7px";
    label.text =
      Constants.Shipment_Status[
      Utilities.getKeyByValue(Constants.ShipmentStatus, label.val)
      ];
    return label;
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row marginRightZero tableScroll">
            <div className="col-12 detailsTable container-fluid">
              <wjChart.FlexChart
                itemsSource={auditTrailList}
                chartType="Line"
                bindingX="UpdatedTime"
                palette={["red"]}
                style={{ width: "100%", minWidth: "800px", height: "450px" }}
              >
                <wjChart.FlexChartLegend position="Bottom" />
                <wjChart.FlexChartAxis
                  wjProperty="axisY"
                  majorUnit={1}
                  max={16}
                  min={0}
                  itemFormatter={formatter}
                  axisLine={true}
                />
                <wjChart.FlexChartSeries
                  binding="DispatchStatusInNumber"
                  name={t("RailDispatchPlanDetail_RailStatus")}
                />
              </wjChart.FlexChart>
            </div>
          </div>
          <div className="row marginRightZero tableScroll">
            <div className="col-12 detailsTable" id="printTable">
              <DataTable data={auditTrailList}>
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="DispatchCode"
                  field="DispatchCode"
                  header={t("RailDispatchPlanDetail_DispatchCode")}
                />
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="DispatchStatus"
                  field="DispatchStatus"
                  header={t("RailDispatchPlanDetail_RailStatus")}
                />
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="TrailerCode"
                  field="TrailerCode"
                  header={t("Rail_Receipt_Wagon")}
                />
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="CarrierCompanyCode"
                  field="CarrierCompanyCode"
                  header={t("Rail_Receipt_Carrier")}
                />
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="DispatchCompartmentStatus"
                  field="DispatchCompartmentStatus"
                  header={t("Rail_Wagon_Status")}
                  renderer={(cellData) => {
                    if (cellData.value !== null) {
                      return Utilities.getKeyByValue(
                        Constants.ShipmentCompartmentStatus,
                        cellData.value
                      );
                    }
                  }}
                />
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="UserPIN"
                  field="UserPIN"
                  header={t("PIN")}
                />
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="UpdatedTime"
                  field="UpdatedTime"
                  header={t("SAAuditTrial_UpdatedTime")}
                // renderer={(cellData) => {
                //   return new Date(cellData.value).toLocaleString()
                // }}
                />
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="OfficerName"
                  field="OfficerName"
                  header={t("ViewAuditTrail_OfficerName")}
                />
                {Attributes.map((att) => {
                  return (
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      header={t(att.AttributeName)}
                      editable={false}
                      renderer={handleAttributeType}
                    ></DataTable.Column>
                  );
                })}
              </DataTable>
            </div>
          </div>

          <Modal
            open={modalData.printAuditTrail.isOpen}
            closeOnDimmerClick={false}
            className="marineModalPrint"
          >
            <Modal.Content>
              <div className="col col-md-8 col-lg-9 col col-xl-9">
                <h3>
                  {modRailDispatch.DispatchCode +
                    " - " +
                    t("Transaction_AuditTrail_Heading")}
                </h3>
              </div>
              <div className="row">
                <div className="col-md-10 container-fluid">
                  <wjChart.FlexChart
                    itemsSource={auditTrailList}
                    chartType="Line"
                    bindingX="UpdatedTime"
                    palette={["red"]}
                    style={{ width: "100%", height: "450px" }}
                  >
                    <wjChart.FlexChartLegend position="Bottom" />
                    <wjChart.FlexChartAxis
                      wjProperty="axisY"
                      majorUnit={1}
                      max={16}
                      min={0}
                      itemFormatter={formatter}
                      axisLine={true}
                    />
                    <wjChart.FlexChartSeries
                      binding="DispatchStatusInNumber"
                      name={t("RailDispatchPlanDetail_RailStatus")}
                    />
                  </wjChart.FlexChart>
                </div>
              </div>
              <div className="col-12 detailsTable">
                <DataTable data={auditTrailList}>
                  <DataTable.Column
                    className="compColHeight"
                    key="DispatchCode"
                    field="DispatchCode"
                    header={t("RailDispatchPlanDetail_DispatchCode")}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    key="DispatchStatus"
                    field="DispatchStatus"
                    header={t("RailDispatchPlanDetail_RailStatus")}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    key="TrailerCode"
                    field="TrailerCode"
                    header={t("Rail_Receipt_Wagon")}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    key="CarrierCompanyCode"
                    field="CarrierCompanyCode"
                    header={t("Rail_Receipt_Carrier")}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    key="DispatchCompartmentStatus"
                    field="DispatchCompartmentStatus"
                    header={t("Rail_Wagon_Status")}
                    renderer={(cellData) => {
                      if (cellData.value !== null) {
                        return Utilities.getKeyByValue(
                          Constants.ShipmentCompartmentStatus,
                          cellData.value
                        );
                      }
                    }}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    key="UserPIN"
                    field="UserPIN"
                    header={t("PIN")}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    key="UpdatedTime"
                    field="UpdatedTime"
                    header={t("SAAuditTrial_UpdatedTime")}
                  // renderer={(cellData) => {
                  //   return new Date(cellData.value).toLocaleString()
                  // }}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    key="OfficerName"
                    field="OfficerName"
                    header={t("ViewAuditTrail_OfficerName")}
                  />
                  {Attributes.map((att) => {
                    return (
                      <DataTable.Column
                        className="compColHeight"
                        header={t(att.AttributeName)}
                        editable={false}
                        renderer={handleAttributeType}
                      ></DataTable.Column>
                    );
                  })}
                </DataTable>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("ViewAuditTrail_Print")}
                onClick={() => {
                  onPrint(
                    modRailDispatch.DispatchCode +
                    " - " +
                    t("ViewRailDispatchList_ViewAuditTrail")
                  );
                }}
              />
              <Button
                type="secondary"
                content={t("AccessCardInfo_Cancel")}
                onClick={() => {
                  const modModalData = lodash.cloneDeep(modalData);
                  modModalData.printAuditTrail.isOpen = false;
                  onModalDataChange(modModalData);
                }}
              />
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </TranslationConsumer>
  );
}
