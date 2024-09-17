import React, { useState } from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal, Icon, Checkbox } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
import * as Constants from "../../../JS/Constants";
import { getKeyByValue } from "../../../JS/Utilities";
wjcCore.setLicenseKey(Constants.wizmoKey);

PipelineReceiptViewAuditTrailDetails.propTypes = {
    auditTrailList: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    ReceiptCode: PropTypes.string,
    modAuditTrailList: PropTypes.array.isRequired,
    Attributes: PropTypes.array.isRequired,
};

PipelineReceiptViewAuditTrailDetails.defaultProps = {};

export function PipelineReceiptViewAuditTrailDetails({
    ReceiptCode,
    auditTrailList,
    handleBack,
    modAuditTrailList,
    Attributes
}) {

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
            engine.fontSize = "10px";
            label.text = getKeyByValue(
                Constants.PipelineReceiptStatus,
                label.val
            );
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
                                    palette={["blue"]}
                                    style={{
                                        width: "100%",
                                        minWidth: "1000px",
                                        height: "550px",
                                    }}
                                    plotMargin="50 10 155 150 "
                                >
                                    <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                                    <wjChart.FlexChartAxis
                                        wjProperty="axisY"
                                        majorUnit={1}
                                        max={9}
                                        min={0}
                                        itemFormatter={formatter}
                                        axisLine={true}
                                    ></wjChart.FlexChartAxis>
                                    <wjChart.FlexChartSeries
                                        binding="PipelineReceiptstatus"
                                        name={t("Receipt_ReceiptStatus")}
                                    ></wjChart.FlexChartSeries>
                                </wjChart.FlexChart>
                            </div>
                            <div className="col-12 detailsTable">
                                <DataTable data={auditTrailList}>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="PipelineReceiptStatus"
                                        field="PipelineReceiptStatus"
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
                                            {t("Transaction_AuditTrail_Heading")
                                            }
                                        </h3>
                                    </div>
                                </div>
                                <div className="row marginRightZero tableScroll">
                                    <div className="col-12 container-fluid">
                                        <wjChart.FlexChart
                                            itemsSource={modAuditTrailList}
                                            chartType="Line"
                                            bindingX="UpdatedTime"
                                            palette={["blue"]}
                                            style={{
                                                width: "100%",
                                                minWidth: "1000px",
                                                height: "550px",
                                            }}
                                            plotMargin="50 10 155 150 "
                                        // style={{ width: "100%", height: "450px" }}
                                        >
                                            <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                                            <wjChart.FlexChartAxis
                                                wjProperty="axisY"
                                                majorUnit={1}
                                                max={9}
                                                min={0}
                                                itemFormatter={formatter}
                                                axisLine={true}
                                            ></wjChart.FlexChartAxis>
                                            <wjChart.FlexChartSeries
                                                binding="PipelineReceiptstatus"
                                                name={t("Receipt_ReceiptStatus")}
                                            ></wjChart.FlexChartSeries>
                                        </wjChart.FlexChart>
                                    </div>
                                </div>

                                <div className="row marginRightZero tableScroll">
                                    <div className="col-12 detailsTable">
                                        <DataTable data={auditTrailList} scrollable={true}>
                                            <DataTable.Column
                                                className="compColHeight colminWidth"
                                                key="PipelineReceiptStatus"
                                                field="PipelineReceiptStatus"
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
