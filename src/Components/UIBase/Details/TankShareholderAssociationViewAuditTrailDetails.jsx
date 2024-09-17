import React, { useState } from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal, Icon } from "@scuf/common";
import { DataTable } from "@scuf/datatable";

TankShareholderAssociationViewAuditTrailDetails.propTypes = {
    auditTrailList: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
};

TankShareholderAssociationViewAuditTrailDetails.defaultProps = {};

export function TankShareholderAssociationViewAuditTrailDetails({
    auditTrailList,
    handleBack,
}) {

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
                                        {t("ViewTankShAuditTrail_Title")}
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
                                <DataTable data={auditTrailList}>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="ShareholderCode"
                                        field="ShareholderCode"
                                        header={t("AccessCardInfo_Shareholder")}

                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="TankCode"
                                        field="TankCode"
                                        header={t("AtgConfigure_TankCode")}

                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="BaseProductCode"
                                        field="BaseProductCode"
                                        header={t("BaseProductInfo_BaseProdCode")}

                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="LimitQuantity"
                                        field="LimitQuantity"
                                        header={t("TankShareholderAssn_LimitCapacity")}

                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="LastUpdatedTime"
                                        field="LastUpdatedTime"
                                        header={t("AccessCardInfo_LastUpdated")}

                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="LastUpdatedBy"
                                        field="LastUpdatedBy"
                                        header={t("AdditiveInjectorInfo_LastUpdatedBy")}

                                    ></DataTable.Column>
                                </DataTable>
                            </div>
                            <Modal.Footer>
                                <div style={{ marginBottom: "10px" }}>
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
                                            el = str1 + ' border="1" cellspacing="1"' + str2;
                                            doc.write(el);
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
                                </div>
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
                                            {t("ViewTankShAuditTrail_Title")}
                                        </h3>
                                    </div>
                                </div>
                                <div className="row marginRightZero tableScroll">
                                    <div className="col-12 detailsTable ">
                                        <DataTable data={auditTrailList} scrollable={true}>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="ShareholderCode"
                                                field="ShareholderCode"
                                                header={t("AccessCardInfo_Shareholder")}

                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankCode"
                                                field="TankCode"
                                                header={t("AtgConfigure_TankCode")}

                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="BaseProductCode"
                                                field="BaseProductCode"
                                                header={t("BaseProductInfo_BaseProdCode")}

                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="LimitQuantity"
                                                field="LimitQuantity"
                                                header={t("TankShareholderAssn_LimitCapacity")}

                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="LastUpdatedTime"
                                                field="LastUpdatedTime"
                                                header={t("AccessCardInfo_LastUpdated")}

                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="LastUpdatedBy"
                                                field="LastUpdatedBy"
                                                header={t("AdditiveInjectorInfo_LastUpdatedBy")}

                                            ></DataTable.Column>
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                            <div className="row" >
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
