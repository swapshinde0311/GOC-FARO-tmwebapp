import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "@scuf/localization";
import { Button, Modal, Icon } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
ExchangeAgreementShipmentDetails.propTypes = {
    handleBack: PropTypes.func.isRequired,
    modEAShipmentDetails: PropTypes.array.isRequired,
}
export function ExchangeAgreementShipmentDetails ({
    handleBack,
    modEAShipmentDetails
})
{
    const [t] = useTranslation();
    return (
        <div className="detailsContainer">
            <div className="row">
                <div className="col-12">
                    <h3>
                        {t("ExagShipment_HeaderText")}
                    </h3>
                </div>
            </div>
            <div className="row marginRightZero tableScroll">
                <h5>{t("ExagShipment_ExAgDetails")}</h5>
                <div className="detailsTable loadingTable">
                    <DataTable
                        data={modEAShipmentDetails.EADetails}
                        scrollable={true}
                        bAutoWidth={true}
                        scrollHeight="450px"
                        resizableColumns={true}
                    >
                        <DataTable.Column
                            className="compColHeight"
                            key="trailercode "
                            field="trailercode"
                            initialWidth="125px"
                            header={t("ExagItem_Product")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="CompartmentSeqNoInVehicle"
                            field="CompartmentSeqNoInVehicle"
                            initialWidth="146px"
                            header={t("ExagItem_RequestQty")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="compartmentcode"
                            field="compartmentcode"
                            initialWidth="165px"
                            header={t("ExagItem_ConsumedQty")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="FinishedProductcode"
                            field="FinishedProductcode"
                            initialWidth="130px"
                            header={t("ExagItem_RemainingQty")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="baseProductcode"
                            field="baseProductcode"
                            initialWidth="155px"
                            header={t("ExagItem_UOM")}
                        ></DataTable.Column>
                    </DataTable>
                </div>
            </div>
            <div className="row marginRightZero tableScroll">
                <h5>{t("ExagShipment_ExAgShipmentDetails")}</h5>
                <div className="detailsTable loadingTable">
                    <DataTable
                        data={modEAShipmentDetails.EALoadedShipments}
                        scrollable={true}
                        bAutoWidth={true}
                        scrollHeight="450px"
                        resizableColumns={true}
                    >
                        <DataTable.Column
                            className="compColHeight"
                            key="trailercode "
                            field="trailercode"
                            initialWidth="125px"
                            header={t("ExagShipment_TransportationType")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="CompartmentSeqNoInVehicle"
                            field="CompartmentSeqNoInVehicle"
                            initialWidth="146px"
                            header={t("ExagShipment_ShipmentCode")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="compartmentcode"
                            field="compartmentcode"
                            initialWidth="165px"
                            header={t("ExagShipment_ConsumedDate")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="FinishedProductcode"
                            field="FinishedProductcode"
                            initialWidth="130px"
                            header={t("ExagShipment_ProductCode")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="baseProductcode"
                            field="baseProductcode"
                            initialWidth="155px"
                            header={t("ExagShipment_GrossQty")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="Unloadingdetailstype"
                            field="Unloadingdetailstype"
                            initialWidth="190px"
                            header={t("ExagShipment_NetQty")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="TankCode"
                            field="TankCode"
                            initialWidth="105px"
                            header={t("ExagShipment_UOM")}
                        ></DataTable.Column>
                    </DataTable>
                </div>
            </div>
            <div className="col col-lg-8">
                <Button
                    className="backButton"
                    onClick={handleBack}
                    content={t("Back")}
                ></Button>
            </div>
        </div>
    );
}