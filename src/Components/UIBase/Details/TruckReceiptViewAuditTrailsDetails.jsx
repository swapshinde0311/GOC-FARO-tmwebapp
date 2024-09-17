import React, { useState } from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal, Icon } from "@scuf/common";
import {
    ReceiptCompartment_Status,
    ReceiptStatus,
    Receipt_Status,
} from "../../../JS/Constants";
import { DataTable } from "@scuf/datatable";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
import * as Constants from "../../../JS/Constants";
wjcCore.setLicenseKey(Constants.wizmoKey);

TruckReceiptViewAuditTrailDetails.propTypes = {
    auditTrailList: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    ReceiptCode: PropTypes.string,
    modAuditTrailList: PropTypes.array.isRequired,
};

TruckReceiptViewAuditTrailDetails.defaultProps = {};

export function TruckReceiptViewAuditTrailDetails({
    ReceiptCode,
    auditTrailList,
    handleBack,
    modAuditTrailList,
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
        if (e === ReceiptCompartment_Status.EMPTY) {
            return "EMPTY";
        } else if (e === ReceiptCompartment_Status.UNLOADING) {
            return "UNLOADING";
        } else if (e === ReceiptCompartment_Status.PART_UNLOADED) {
            return "PART_UNLOADED";
        } else if (e === ReceiptCompartment_Status.OVER_UNLOADED) {
            return "OVER_UNLOADED";
        } else if (e === ReceiptCompartment_Status.FORCE_COMPLETED) {
            return "FORCE_COMPLETED";
        } else if (e === ReceiptCompartment_Status.COMPLETED) {
            return "COMPLETED";
        } else if (e === ReceiptCompartment_Status.INTERRUPTED) {
            return "INTERRUPTED";
        } else if (e === ReceiptCompartment_Status.UNLOAD_NOTSTARTED) {
            return "UNLOAD_NOTSTARTED";
        } else {
            return "";
        }
    };
    const [modelOpen, setModelOpen] = useState(false);
    const formatter = (engine, label) => {
        try {
            label.cls = null;
            engine.fontSize = "7px";
            if (label.val === ReceiptStatus.AUTO_LOADED) {
                label.text = Receipt_Status.AUTO_UNLOADED;
            } else if (label.val === ReceiptStatus.CHECKED_IN) {
                label.text = Receipt_Status.CHECKED_IN;
            } else if (label.val === ReceiptStatus.CLOSED) {
                label.text = Receipt_Status.CLOSED;
            } else if (label.val === ReceiptStatus.INTERRUPTED) {
                label.text = Receipt_Status.INTERRUPTED;
            } else if (label.val === ReceiptStatus.UNLOADING) {
                label.text = Receipt_Status.UNLOADING;
            } else if (label.val === ReceiptStatus.MANUALLY_UNLOADED) {
                label.text = Receipt_Status.MANUALLY_UNLOADED;
            } else if (label.val === ReceiptStatus.PARTIALLY_UNLOADED) {
                label.text = Receipt_Status.PARTIALLY_UNLOADED;
            } else if (label.val === ReceiptStatus.QUEUED) {
                label.text = Receipt_Status.QUEUED;
            } else if (label.val === ReceiptStatus.READY) {
                label.text = Receipt_Status.READY;
            } else if (label.val === ReceiptStatus.DE_QUEUED) {
                label.text = Receipt_Status.DE_QUEUED;
            } else if (label.val === ReceiptStatus.WEIGHED_IN) {
                label.text = Receipt_Status.WEIGHED_IN;
            } else if (label.val === ReceiptStatus.WEIGHED_OUT) {
                label.text = Receipt_Status.WEIGHED_OUT;
            } else if (label.val === ReceiptStatus.USER_DEFINED) {
                let x = modAuditTrailList.findIndex(
                    (x) => x.Receipt_Status === label.val
                );
                label.text =
                    x !== -1
                        ? modAuditTrailList[x].ReceiptStatus
                        : Receipt_Status.USER_DEFINED;
            } else if (label.val === ReceiptStatus.ASSIGNED) {
                label.text = Receipt_Status.ASSIGNED;
            } else if (label.val === ReceiptStatus.CANCELLED) {
                label.text = Receipt_Status.CANCELLED;
            } else if (label.val === ReceiptStatus.EXPIRED) {
                label.text = Receipt_Status.EXPIRED;
            } else if (label.val === ReceiptStatus.REJECTED) {
                label.text = Receipt_Status.REJECTED;
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
                            {/* <div className="col col-md-8 col-lg-9 col col-xl-9">
                                <h3>
                                    {t("ViewAuditTrail_ViewAuditTrailForReceipt") +
                                        " : " +
                                        ReceiptCode}
                                </h3>
                            </div> */}
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                <div className="col col-lg-8">
                                    <h3>
                                        {t("Transaction_AuditTrail_Heading") +
                                            " : " +
                                            ReceiptCode}
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
                                        binding="Receipt_Status"
                                        name="Receipt_Status"
                                    ></wjChart.FlexChartSeries>
                                </wjChart.FlexChart>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label>
                                    {t("ViewAuditTrail_DriverCode") + " : " + driverCode}
                                </label>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label>{t("DriverInfo_DriverName") + " : " + driverName}</label>
                            </div>
                            <div className="col-12 detailsTable">
                                <DataTable data={auditTrailList}>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="ReceiptStatus"
                                        field="ReceiptStatus"
                                        header={t("ViewReceiptAuditTrail_ReceiptStatus")}
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
                                    // renderer={(cellData) => disPlayValue(cellData)}
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
                                        key="ReceiptCompartmentStatus"
                                        field="ReceiptCompartmentStatus"
                                        header={t("ViewAuditTrail_ShipmentCompartmentStatus")}
                                        editable={false}
                                        renderer={(cellData) =>
                                            handleStatus(cellData.rowData.ReceiptCompartmentStatus)
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
                                        header={t("ViewAuditTrail_DriverName")}
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
                                        //     t("ViewAuditTrail_ViewAuditTrailForReceipt") +
                                        //     " : " +
                                        //     ReceiptCode;
                                        // el = str3 + str1 + ' border="1" cellspacing="0"' + str2;
                                        el = str1 + ' border="1" cellspacing="1"' + str2;

                                        // el = el.replace('<tfoot class="p-datatable-tfoot">', "");
                                        // el = el.replace(
                                        //     '<tr><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td></tr>',
                                        //     ""
                                        // );
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
                                            {t("ViewAuditTrail_ViewAuditTrailForReceipt") +
                                                " : " +
                                                ReceiptCode}
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
                                                max={16}
                                                min={0}
                                                itemFormatter={formatter}
                                                axisLine={true}
                                            ></wjChart.FlexChartAxis>
                                            <wjChart.FlexChartSeries
                                                binding="Receipt_Status"
                                                name="Receipt_Status"
                                            ></wjChart.FlexChartSeries>
                                        </wjChart.FlexChart>
                                    </div>
                                </div>
                                <div className="row marginRightZero">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label>
                                            {t("ViewAuditTrail_DriverCode") + " : " + driverCode}
                                        </label>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label>
                                            {t("DriverInfo_DriverName") + " : " + driverName}
                                        </label>
                                    </div>
                                </div>

                                <div className="row marginRightZero tableScroll">
                                    <div className="col-12 detailsTable">
                                        <DataTable data={auditTrailList} scrollable={true}>
                                            <DataTable.Column
                                                className="compColHeight colminWidth"
                                                key="ReceiptStatus"
                                                field="ReceiptStatus"
                                                header={t("ViewReceiptAuditTrail_ReceiptStatus")}
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
                                            // renderer={(cellData) => disPlayValue(cellData)}
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
                                                key="ReceiptCompartmentStatus"
                                                field="ReceiptCompartmentStatus"
                                                header={t("ViewAuditTrail_ShipmentCompartmentStatus")}
                                                editable={false}
                                                renderer={(cellData) =>
                                                    handleStatus(
                                                        cellData.rowData.ReceiptCompartmentStatus
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
                                            header={t("ViewAuditTrail_DriverName")}
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
