import React, { useState } from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal, Icon } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
ShareholderAgreementViewAuditTrailDetails.propTypes = {
    handleBack: PropTypes.func.isRequired,
    modViewAuditTrail: PropTypes.array.isRequired,
    RequestCode:PropTypes.string
}
export function ShareholderAgreementViewAuditTrailDetails({ 
    handleBack,
    modViewAuditTrail,
    RequestCode
})

{
    const [modelOpen, setModelOpen] = useState(false);
    function displayTMModalforPrintConfirm() {
        return (
            <TranslationConsumer>
                {(t) => (
                    <Modal open={modelOpen} className="marineModalPrint">
                        <Modal.Content>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                <div className="col col-lg-8">
                                    <h3>
                                        {t("ViewEAAuditTrail_ViewAuditTrailForEA") +
                                            " : " +
                                            RequestCode}
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
                                   
                                </div>
                            </div>
                            <div className="col-12 detailsTable">
                                <DataTable data={modViewAuditTrail}>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="RequestCode"
                                        field="RequestCode"
                                        header={t("ViewEAAuditTrail_EACode")}
                                       
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="UpdatedTime"
                                        field="UpdatedTime"
                                        header={t("ViewEAAuditTrail_UpdatedTime")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="ShareholderAgreementStatus"
                                        field="ShareholderAgreementStatus"
                                        header={t("ViewEAAuditTrail_Status")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="LenderShareholderCode"
                                        field="LenderShareholderCode"
                                        header={t("ViewEAAuditTrail_LenderShareholderCode")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="RequestorShareholderCode"
                                        field="RequestorShareholderCode"
                                        header={t("ViewEAAuditTrail_RequestorShareholderCode")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="LastUpdatedBy"
                                        field="LastUpdatedBy"
                                        header={t("ViewEAAuditTrail_LastUpdatedBy")}
                                    ></DataTable.Column>
                                </DataTable>
                            </div>
                            <Modal.Footer>
                                <Button
                                    type="primary"
                                    size="small"
                                    content={t("ViewEAAuditTrail_Print")}
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
                                        //     RequestCode;
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
                                                {t("ViewEAAuditTrail_ViewAuditTrailForEA") +
                                                    " : " +
                                                    RequestCode}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="row marginRightZero tableScroll">
                                        <div className="col-12 detailsTable">
                                            <DataTable data={modViewAuditTrail}>
                                                <DataTable.Column
                                                    className="compColHeight"
                                                    key="RequestCode"
                                                    field="RequestCode"
                                                    header={t("ViewEAAuditTrail_EACode")}
                                                ></DataTable.Column>
                                                <DataTable.Column
                                                    className="compColHeight"
                                                    key="UpdatedTime"
                                                    field="UpdatedTime"
                                                    header={t("ViewEAAuditTrail_UpdatedTime")}
                                                ></DataTable.Column>
                                                <DataTable.Column
                                                    className="compColHeight"
                                                    key="ShareholderAgreementStatus"
                                                    field="ShareholderAgreementStatus"
                                                    header={t("ViewEAAuditTrail_Status")}
                                                ></DataTable.Column>
                                                <DataTable.Column
                                                    className="compColHeight"
                                                    key="LenderShareholderCode"
                                                    field="LenderShareholderCode"
                                                    header={t("ViewEAAuditTrail_LenderShareholderCode")}
                                                    
                                                ></DataTable.Column>
                                                <DataTable.Column
                                                    className="compColHeight"
                                                    key="RequestorShareholderCode"
                                                    field="RequestorShareholderCode"
                                                    header={t("ViewEAAuditTrail_RequestorShareholderCode")}
                                                   
                                                ></DataTable.Column>
                                                <DataTable.Column
                                                    className="compColHeight"
                                                    key="LastUpdatedBy"
                                                    field="LastUpdatedBy"
                                                    header={t("ViewEAAuditTrail_LastUpdatedBy")}
                                                    
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
                                            content={t("ViewEAAuditTrail_Back")}
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