import React, { useState } from "react";
import PropTypes from "prop-types";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import { Button, Modal, Input, Checkbox, DatePicker } from "@scuf/common";
import {
  MarineDispatchCompartmentDetailType,
  ViewDispatchStatus,
  ViewDispatch_Status,
} from "../../../JS/Constants";
import { DataTable } from "@scuf/datatable";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
import * as Constants from "../../../JS/Constants";
wjcCore.setLicenseKey(Constants.wizmoKey);

MarineShipmentViewAuditTrailDetails.propTypes = {
  auditTrailList: PropTypes.array.isRequired,
  handleBack: PropTypes.func.isRequired,
  DispatchCode: PropTypes.string,
  modAuditTrailList: PropTypes.array.isRequired,
  Attributes: PropTypes.array.isRequired,
  isWebPortalUser: PropTypes.bool.isRequired,
};

export function MarineShipmentViewAuditTrailDetails({
  DispatchCode,
  auditTrailList,
  handleBack,
  modAuditTrailList,
  auditExpandedRows,
  Attributes,
  isWebPortalUser,
}) {
  const [t] = useTranslation();
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

  const [modelOpen, setModelOpen] = useState(false);

  const formatter = (engine, label) => {
    label.cls = null;
    engine.fontSize = "7px";
    if (label.val === ViewDispatchStatus.AUTO_LOADED) {
      label.text = ViewDispatch_Status.AUTO_LOADED;
    } else if (label.val === ViewDispatchStatus.CLOSED) {
      label.text = ViewDispatch_Status.CLOSED;
    } else if (label.val === ViewDispatchStatus.INTERRUPTED) {
      label.text = ViewDispatch_Status.INTERRUPTED;
    } else if (label.val === ViewDispatchStatus.LOADING) {
      label.text = ViewDispatch_Status.LOADING;
    } else if (label.val === ViewDispatchStatus.MANUALLY_LOADED) {
      label.text = ViewDispatch_Status.MANUALLY_LOADED;
    } else if (label.val === ViewDispatchStatus.PARTIALLY_LOADED) {
      label.text = ViewDispatch_Status.PARTIALLY_LOADED;
    } else if (label.val === ViewDispatchStatus.QUEUED) {
      label.text = ViewDispatch_Status.QUEUED;
    } else if (label.val === ViewDispatchStatus.READY) {
      label.text = ViewDispatch_Status.READY;
    }
    return label;
  };

  const disPlayValue = (cellData) => {
    try {
      const field = cellData.rowData[cellData.field];
      if (field === undefined || field === null || field === "") {
        return "";
      }
      return (
        new Date(field).toLocaleDateString() +
        " " +
        new Date(field).toLocaleTimeString()
      );
    } catch (error) {
      return "";
    }
  };

  function displayTMModalforPrintConfirm() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={modelOpen} className="marineModalPrint">
            <Modal.Content>
              <div className="col col-md-8 col-lg-9 col col-xl-9">
                <h3>
                  {t("Transaction_AuditTrail_Heading") +
                    " : " +
                    DispatchCode}
                </h3>
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
                    max={7}
                    min={0}
                    itemFormatter={formatter}
                    axisLine={true}
                  ></wjChart.FlexChartAxis>
                  <wjChart.FlexChartSeries
                    binding="DispatchStatus"
                    name={t("MarineShipmentByCompartmentList_ShipmentStatus")}
                  ></wjChart.FlexChartSeries>
                </wjChart.FlexChart>
              </div>
              <div className="col-12 detailsTable">
                <DataTable data={auditTrailList}>
                  <DataTable.Column
                    className="compColHeight"
                    key="DispatchStatus"
                    field="DispatchStatus"
                    header={t("MarineShipmentByCompartmentList_ShipmentStatus")}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="DispatchCompartmentStatus"
                    field="UpdatedTime"
                    header={t("ViewMarineReceiptAuditTrail_UpdatedTime")}
                    editable={false}
                    editFieldType="text"
                    renderer={(cellData) => disPlayValue(cellData)}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    header={t(
                      "ViewMarineReceiptAuditTrail_ReceiptCompartmentSeq"
                    )}
                    field={"CompartmentSeqNoInVehicle"}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="CompartmentSeqNoInVehicle"
                    field="DispatchCompartmentStatus"
                    header={t(
                      "ViewMarineReceiptAuditTrail_ReceiptCompartmentStatus"
                    )}
                    editable={false}
                    renderer={(cellData) =>
                      handleStatus(cellData.rowData.DispatchCompartmentStatus)
                    }
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    header={t("PIN")}
                    editable={false}
                    field={"UserPIN"}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    header={t("ViewAuditTrail_OfficerName")}
                    editable={false}
                    field={"OfficerName"}
                    editFieldType="text"
                  ></DataTable.Column>
                  {Attributes.map((att) => {
                    return (
                      <DataTable.Column
                        className="compColHeight"
                        header={t(att.AttributeName)}
                        editable={false}
                      ></DataTable.Column>
                    );
                  })}
                </DataTable>
              </div>
              <Modal.Footer>
                <div className="viewPrint">
                  <Button
                    type="secondary"
                    size="small"
                    content={t("MarineEOD_Close")}
                    onClick={() => {
                      setModelOpen(false);
                    }}
                  />
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
                      const str3 =
                        t("ViewAuditTrail_ViewAuditTrailForShipment") +
                        " : " +
                        DispatchCode;
                      el = str3 + str1 + ' border="1" cellspacing="0"' + str2;
                      el = el.replace('<tfoot class="p-datatable-tfoot">', "");
                      el = el.replace(
                        '<tr><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td></tr>',
                        ""
                      );
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
                </div>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  function rowExpansionTemplate(data) {
    return Array.isArray(data.AttributesforUI) &&
      data.AttributesforUI.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={data.AttributesforUI}>
          <DataTable.Column
            className="compColHeight"
            key="AttributeName"
            header={t("CompartmentAttributeName")}
            renderer={handleIsRequiredAuditAttributes}
            editable={false}
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            header={t("CompartmentAttributeValue")}
            renderer={handleAttributeType}
          />
        </DataTable>
      </div>
    ) : (
      <div className="compartmentIcon">
        <div style={{ paddingRight: "87%" }}>
          {t("CustomerInventory_NoRecordsFound")}
        </div>
      </div>
    );
  }

  const handleIsRequiredAuditAttributes = (data) => {
    return (
      <div>
        <span>{data.rowData.AttributeName}</span>
      </div>
    );
  };

  const handleAttributeType = (data) => {
    const attribute = data.rowData;
    try {
      return attribute.DataType.toLowerCase() ===
        Constants.DataType.STRING.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={true}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.INT.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={true}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.FLOAT.toLowerCase() ||
        attribute.DataType.toLowerCase() ===
        Constants.DataType.LONG.toLowerCase() ||
        attribute.DataType.toLowerCase() ===
        Constants.DataType.DOUBLE.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={true}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.BOOL.toLowerCase() ? (
        <Checkbox
          checked={attribute.AttributeValue.toString().toLowerCase() === "true"}
          disabled={true}
        ></Checkbox>
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.DATETIME.toLowerCase() ? (
        <DatePicker
          fluid
          minuteStep="5"
          value={
            attribute.AttributeValue === null ||
              attribute.AttributeValue === undefined ||
              attribute.AttributeValue === ""
              ? ""
              : new Date(attribute.AttributeValue)
          }
          disabled={true}
          showYearSelector="true"
          reserveSpace={false}
        />
      ) : null;
    } catch (error) {
      console.log("TrailerDetails:Error occured on handleAttributeType", error);
    }
  };

  return (
    <div>
      <TranslationConsumer>
        {(t) => (
          <div>
            <div className="detailsContainer">
              <div className="row">
                <div className="col-12">
                  <h3>
                    {t("Transaction_AuditTrail_Heading") +
                      " : " +
                      DispatchCode}
                  </h3>
                </div>
              </div>
              <div className="row marginRightZero tableScroll">
                <div className="col-12 container-fluid">
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
                      max={7}
                      min={0}
                      itemFormatter={formatter}
                      axisLine={true}
                    ></wjChart.FlexChartAxis>
                    <wjChart.FlexChartSeries
                      binding="DispatchStatus"
                      name={t("MarineShipmentByCompartmentList_ShipmentStatus")}
                    ></wjChart.FlexChartSeries>
                  </wjChart.FlexChart>
                </div>
              </div>
              <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable" id="printTable">
                  <DataTable
                    data={auditTrailList}
                    scrollable={true}
                    rowExpansionTemplate={rowExpansionTemplate}
                    expandedRows={auditExpandedRows}
                  >
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="DispatchStatus"
                      field="DispatchStatus"
                      header={t(
                        "MarineShipmentByCompartmentList_ShipmentStatus"
                      )}
                      editable={false}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="DispatchCompartmentStatus"
                      field="UpdatedTime"
                      header={t("ViewMarineReceiptAuditTrail_UpdatedTime")}
                      editable={false}
                      editFieldType="text"
                      renderer={(cellData) => disPlayValue(cellData)}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      header={t(
                        "ViewMarineReceiptAuditTrail_ReceiptCompartmentSeq"
                      )}
                      field={"CompartmentSeqNoInVehicle"}
                      editable={false}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="CompartmentSeqNoInVehicle"
                      field="DispatchCompartmentStatus"
                      header={t(
                        "ViewMarineReceiptAuditTrail_ReceiptCompartmentStatus"
                      )}
                      editable={false}
                      renderer={(cellData) =>
                        handleStatus(cellData.rowData.DispatchCompartmentStatus)
                      }
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      header={t("PIN")}
                      editable={false}
                      field={"UserPIN"}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      header={t("ViewAuditTrail_OfficerName")}
                      editable={false}
                      field={"OfficerName"}
                      editFieldType="text"
                    ></DataTable.Column>
                    {Attributes.map((att) => {
                      return (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          header={t(att.AttributeName)}
                          editable={false}
                        ></DataTable.Column>
                      );
                    })}
                  </DataTable>
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

                {isWebPortalUser ? (
                  ""
                ) : (
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
                )}
              </div>
            </div>
          </div>
        )}
      </TranslationConsumer>
      {displayTMModalforPrintConfirm()}
    </div>
  );
}
