import React, { useState } from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal, Checkbox, Icon } from "@scuf/common";
import {
  ShipmentCompartmentStatus,
  ShipmentStatus,
  Shipment_Status,
} from "../../../JS/Constants";
import { DataTable } from "@scuf/datatable";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
import * as Constants from "../../../JS/Constants";
wjcCore.setLicenseKey(Constants.wizmoKey);

TruckShipmentViewAuditTrailDetails.propTypes = {
  auditTrailList: PropTypes.array.isRequired,
  handleBack: PropTypes.func.isRequired,
  ShipmentCode: PropTypes.string,
  modAuditTrailList: PropTypes.array.isRequired,
  Attributes: PropTypes.array.isRequired,
};

TruckShipmentViewAuditTrailDetails.defaultProps = {};

export function TruckShipmentViewAuditTrailDetails({
  ShipmentCode,
  auditTrailList,
  handleBack,
  modAuditTrailList,
  Attributes,
}) {
  const driverName =
    auditTrailList !== null &&
      auditTrailList !== undefined &&
      auditTrailList.length > 0 &&
      auditTrailList[0].DRIVERNAME !== null &&
      auditTrailList[0].DRIVERNAME !== undefined &&
      auditTrailList[0].DRIVERNAME !== ""
      ? auditTrailList[0].DRIVERNAME
      : "";
  const driverCode =
    auditTrailList !== null &&
      auditTrailList !== undefined &&
      auditTrailList.length > 0 &&
      auditTrailList[0].DRIVERCODE !== null &&
      auditTrailList[0].DRIVERCODE !== undefined &&
      auditTrailList[0].DRIVERCODE !== ""
      ? auditTrailList[0].DRIVERCODE
      : "";

  const handleStatus = (e) => {
    if (e === ShipmentCompartmentStatus.EMPTY) {
      return "EMPTY";
    } else if (e === ShipmentCompartmentStatus.LOADING) {
      return "LOADING";
    } else if (e === ShipmentCompartmentStatus.PART_FILLED) {
      return "PART_FILLED";
    } else if (e === ShipmentCompartmentStatus.OVER_FILLED) {
      return "OVER_FILLED";
    } else if (e === ShipmentCompartmentStatus.FORCE_COMPLETED) {
      return "FORCE_COMPLETED";
    } else if (e === ShipmentCompartmentStatus.COMPLETED) {
      return "COMPLETED";
    } else if (e === ShipmentCompartmentStatus.INTERRUPTED) {
      return "INTERRUPTED";
    } else {
      return "";
    }
  };

  const [modelOpen, setModelOpen] = useState(false);

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
    try {
      label.cls = null;
      engine.fontSize = "7px";
      if (label.val === ShipmentStatus.AUTO_LOADED) {
        label.text = Shipment_Status.AUTO_LOADED;
      } else if (label.val === ShipmentStatus.CHECKED_IN) {
        label.text = Shipment_Status.CHECKED_IN;
      } else if (label.val === ShipmentStatus.CLOSED) {
        label.text = Shipment_Status.CLOSED;
      } else if (label.val === ShipmentStatus.INTERRUPTED) {
        label.text = Shipment_Status.INTERRUPTED;
      } else if (label.val === ShipmentStatus.LOADING) {
        label.text = Shipment_Status.LOADING;
      } else if (label.val === ShipmentStatus.MANUALLY_LOADED) {
        label.text = Shipment_Status.MANUALLY_LOADED;
      } else if (label.val === ShipmentStatus.PARTIALLY_LOADED) {
        label.text = Shipment_Status.PARTIALLY_LOADED;
      } else if (label.val === ShipmentStatus.QUEUED) {
        label.text = Shipment_Status.QUEUED;
      } else if (label.val === ShipmentStatus.READY) {
        label.text = Shipment_Status.READY;
      } else if (label.val === ShipmentStatus.DE_QUEUED) {
        label.text = Shipment_Status.DE_QUEUED;
      } else if (label.val === ShipmentStatus.WEIGHED_IN) {
        label.text = Shipment_Status.WEIGHED_IN;
      } else if (label.val === ShipmentStatus.WEIGHED_OUT) {
        label.text = Shipment_Status.WEIGHED_OUT;
      } else if (label.val === ShipmentStatus.USER_DEFINED) {
        let x = modAuditTrailList.findIndex(
          (x) => x.ShipmentStatus === label.val
        );
        label.text =
          x !== -1 ? modAuditTrailList[x].Status : Shipment_Status.USER_DEFINED;
      } else if (label.val === ShipmentStatus.ASSIGNED) {
        label.text = Shipment_Status.ASSIGNED;
      } else if (label.val === ShipmentStatus.CANCELLED) {
        label.text = Shipment_Status.CANCELLED;
      } else if (label.val === ShipmentStatus.EXPIRED) {
        label.text = Shipment_Status.EXPIRED;
      } else if (label.val === ShipmentStatus.REJECTED) {
        label.text = Shipment_Status.REJECTED;
      }
    }
    catch (error) {
      console.log("Error in formatter", error)
    }
    return label;
  };

  function displayTMModalforPrintConfirm() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={modelOpen} className="marineModalPrint">
            <Modal.Content>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-8">
                  <h3>
                    {t("Transaction_AuditTrail_Heading") +
                      " : " +
                      ShipmentCode}
                  </h3>
                </div>
                <div className="col col-lg-4" style={{ textAlign: "right" }}>
                  <div
                    onClick={() => {
                      setModelOpen(false);
                    }}
                  >
                    <Icon root="common" name="close" />
                  </div>

                  {/* <Button
                                        type="primary"
                                        size="small"
                                        content={t("MarineEOD_Close")}
                                        onClick={() => {
                                            setModelOpen(false);
                                        }}
                                    /> */}
                </div>
              </div>
              <div className="col-md-10 container-fluid">
                <wjChart.FlexChart
                  itemsSource={modAuditTrailList}
                  chartType="Line"
                  bindingX="UpdatedTime"
                  palette={["red"]}
                  style={{ width: "100%", height: "450px" }}
                >
                  <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                  <wjChart.FlexChartAxis
                    wjProperty="axisY"
                    majorUnit={1}
                    max={16}
                    min={0}
                    itemFormatter={formatter}
                    axisLine={true}
                  ></wjChart.FlexChartAxis>
                  <wjChart.FlexChartSeries
                    binding="ShipmentStatus"
                    name="ShipmentStatus"
                  ></wjChart.FlexChartSeries>
                </wjChart.FlexChart>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <label>
                  {t("ViewAuditTrail_DriverCode") + " : " + driverCode}
                </label>
                {/* <Input
                                    fluid
                                    value={driverCode}
                                    label={t("ViewAuditTrail_DriverCode")}
                                    disabled={true}
                                    reserveSpace={false}
                                /> */}
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <label>{t("DriverInfo_DriverName") + " : " + driverName}</label>
                {/* <Input
                                    fluid
                                    value={driverName}
                                    label={t("DriverInfo_DriverName")}
                                    disabled={true}
                                    reserveSpace={false}
                                /> */}
              </div>
              <div className="col-12 detailsTable">
                <DataTable data={auditTrailList}>
                  <DataTable.Column
                    className="compColHeight"
                    key="Status"
                    field="Status"
                    header={t("ViewAuditTrail_ShipmentStatus")}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="UpdatedTime"
                    field="UpdatedTime"
                    header={t("ViewAuditTrail_UpdatedTime")}
                    editable={false}
                    editFieldType="text"
                  //renderer={(cellData) => disPlayValue(cellData)}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    header={t("ViewAuditTrail_ShipmentCompartmentSeq")}
                    field={"CompartmentSeqNoInVehicle"}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="ShipmentCompartmentStatus"
                    field="ShipmentCompartmentStatus"
                    header={t("ViewAuditTrail_ShipmentCompartmentStatus")}
                    editable={false}
                    renderer={(cellData) =>
                      handleStatus(cellData.rowData.ShipmentCompartmentStatus)
                    }
                    editFieldType="text"
                  ></DataTable.Column>
                  {/* <DataTable.Column
                                        className="compColHeight"
                                        header={t("ViewAuditTrail_DriverCode")}
                                        editable={false}
                                        field={"DRIVERCODE"}
                                        editFieldType="text"
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        header={t("DriverInfo_DriverName")}
                                        editable={false}
                                        field={"DRIVERNAME"}
                                        editFieldType="text"
                                    ></DataTable.Column> */}
                  <DataTable.Column
                    className="compColHeight"
                    header={t("ViewAuditTrail_DriverPIN")}
                    editable={false}
                    field={"DriverPin"}
                    editFieldType="text"
                  ></DataTable.Column>
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
              <Modal.Footer>
                <Button
                  type="primary"
                  size="small"
                  content={t("ViewAuditTrail_Print")}
                  onClick={() => {
                    let el =
                      window.document.getElementById("printTable").innerHTML;
                    const iframe = window.document.createElement("IFRAME");
                    let doc = null;
                    window.document.body.appendChild(iframe);
                    doc = iframe.contentWindow.document;
                    const str1 = el.substring(0, el.indexOf("<table") + 6);
                    const str2 = el.substring(
                      el.indexOf("<table") + 6,
                      el.length
                    );
                    // const str3 =
                    //     t("ViewAuditTrail_ViewAuditTrailForShipment") +
                    //     " : " +
                    //     ShipmentCode;
                    //el = str3 + str1 + ' border="1" cellspacing="0"' + str2;
                    el = str1 + ' border="1" cellspacing="1"' + str2;
                    //el = el.replace('<tfoot class="p-datatable-tfoot">', "");
                    //el = el.replace(
                    //    '<tr><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td></tr>',
                    //    ""
                    //);
                    doc.write(el);
                    // console.info(el);
                    doc.close();
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                    setTimeout(() => {
                      window.document.body.removeChild(iframe);
                    }, 2000);
                  }}
                />
                <Button
                  type="primary"
                  size="small"
                  content={t("MarineEOD_Close")}
                  onClick={() => {
                    setModelOpen(false);
                  }}
                />
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  return (
    <div>
      <TranslationConsumer>
        {(t) => (
          <div>
            <div className="detailsContainer">
              <div id="printTable">
                <div className="row">
                  <div className="col-12">
                    <h3>
                      {t("ViewAuditTrail_ViewAuditTrailForShipment") +
                        " : " +
                        ShipmentCode}
                    </h3>
                  </div>
                </div>

                <div className=" row marginRightZero tableScroll">
                  <div
                    className="col-12 container-fluid"
                  // style={{ overflowX: "auto" }}
                  >
                    <wjChart.FlexChart
                      itemsSource={modAuditTrailList}
                      chartType="Line"
                      bindingX="UpdatedTime"
                      palette={["red"]}
                      style={{
                        width: "100%",
                        minWidth: "800px",
                        height: "450px",
                      }}
                    >
                      <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                      <wjChart.FlexChartAxis
                        wjProperty="axisY"
                        majorUnit={1}
                        max={16}
                        min={0}
                        itemFormatter={formatter}
                        axisLine={true}
                      ></wjChart.FlexChartAxis>
                      <wjChart.FlexChartSeries
                        binding="ShipmentStatus"
                        name="ShipmentStatus"
                      ></wjChart.FlexChartSeries>
                    </wjChart.FlexChart>
                  </div>
                </div>

                <div className="row marginRightZero">
                  <div className="col-12 col-md-6 col-lg-4">
                    <label>
                      {t("ViewAuditTrail_DriverCode") + " : " + driverCode}
                    </label>
                    {/* <Input
                                        fluid
                                        value={driverCode}
                                        label={t("ViewAuditTrail_DriverCode")}
                                        disabled={true}
                                        reserveSpace={false}
                                    /> */}
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <label>
                      {t("DriverInfo_DriverName") + " : " + driverName}
                    </label>
                    {/* <Input
                                        fluid
                                        value={driverName}
                                        label={t("DriverInfo_DriverName")}
                                        disabled={true}
                                        reserveSpace={false}
                                    /> */}
                  </div>
                </div>

                <div className="row marginRightZero tableScroll">
                  <div className="col-12 detailsTable ">
                    <DataTable data={auditTrailList} scrollable={true}>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="Status"
                        field="Status"
                        header={t("ViewAuditTrail_ShipmentStatus")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="UpdatedTime"
                        field="UpdatedTime"
                        header={t("ViewAuditTrail_UpdatedTime")}
                        editable={false}
                        editFieldType="text"
                      //renderer={(cellData) => disPlayValue(cellData)}
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        header={t("ViewAuditTrail_ShipmentCompartmentSeq")}
                        field={"CompartmentSeqNoInVehicle"}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ShipmentCompartmentStatus"
                        field="ShipmentCompartmentStatus"
                        header={t("ViewAuditTrail_ShipmentCompartmentStatus")}
                        editable={false}
                        renderer={(cellData) =>
                          handleStatus(
                            cellData.rowData.ShipmentCompartmentStatus
                          )
                        }
                        editFieldType="text"
                      ></DataTable.Column>
                      {/* <DataTable.Column
                                            className="compColHeight"
                                            header={t("ViewAuditTrail_DriverCode")}
                                            editable={false}
                                            field={"DRIVERCODE"}
                                            editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                            className="compColHeight"
                                            header={t("DriverInfo_DriverName")}
                                            editable={false}
                                            field={"DRIVERNAME"}
                                            editFieldType="text"
                                        ></DataTable.Column> */}
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        header={t("ViewAuditTrail_DriverPIN")}
                        editable={false}
                        field={"DriverPin"}
                        editFieldType="text"
                      ></DataTable.Column>

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
              </div>
              <div className="row">
                <div className="col-12 col-sm-6 col-lg-8">
                  <Button
                    className="backButton"
                    onClick={handleBack}
                    content={t("Back")}
                  ></Button>
                </div>
                <div
                  className="col-12 col-sm-6 col-lg-4"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    className="printButton"
                    onClick={() => {
                      setModelOpen(true);
                    }}
                    content={t("ViewAuditTrail_PrintAuditTrail")}
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </TranslationConsumer>
      {displayTMModalforPrintConfirm()}
    </div>
  );
}
