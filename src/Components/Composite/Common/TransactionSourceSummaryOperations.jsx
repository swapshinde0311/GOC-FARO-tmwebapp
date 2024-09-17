import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "@scuf/localization";
import { Divider, Button } from '@scuf/common';

TransactionSourceSummaryOperations.propTypes = {
    transportationType: PropTypes.string.isRequired,
    handleShipmentByCompartmentPageClick: PropTypes.func.isRequired,
    handleShipmentByProductPageClick: PropTypes.func.isRequired,
    handleDispatchPageClick: PropTypes.func.isRequired,
    isSBCEnable: PropTypes.bool.isRequired,
    isSBPEnable: PropTypes.bool.isRequired,
    isRailDispatchEnable: PropTypes.bool.isRequired,
};

export default function TransactionSourceSummaryOperations({
    transportationType,
    handleShipmentByCompartmentPageClick,
    handleShipmentByProductPageClick,
    handleDispatchPageClick,
    isSBCEnable,
    isSBPEnable,
    isRailDispatchEnable
}) {
    const [t] = useTranslation();
    return (
        <div className={"ViewShipmentStatusDetails "}>
            <div className="ViewShipmentStatusHeader">
                <h4>{transportationType === "ROAD" ? t("ShipmentContract_CreateShipment") : t("ContractInfo_CreateDispatch")}</h4>
            </div>
            <Divider />
            {
                transportationType === "ROAD" ? (
                    <div>
                        <div style={{ marginLeft: "10%" }}>
                            <Button
                                type="secondary"
                                className="ViewShipmentButton"
                                disabled={!isSBCEnable}
                                //className="ViewShipmentDetailsButton"
                                onClick={() => handleShipmentByCompartmentPageClick()}
                            >{t("ContractInfo_ShipByComp")}</Button>
                        </div>
                        <div style={{ marginLeft: "10%" }}>
                            <Button
                                type="secondary"
                                className="ViewShipmentButton"
                                disabled={!isSBPEnable}
                                // className="ViewShipmentDetailsButton"
                                onClick={() => handleShipmentByProductPageClick()}
                            >{t("ContractInfo_ShipByProduct")}</Button>
                        </div>
                    </div>
                ) : (
                    <div style={{ marginLeft: "10%" }}>
                        <Button
                            type="secondary"
                            className="ViewShipmentButton"
                            disabled={!isRailDispatchEnable}
                            // className="ViewShipmentDetailsButton"
                            onClick={() => handleDispatchPageClick()}
                        >{t("ContractInfo_CreateDispatch")}</Button>
                    </div>
                )
            }

        </div>
    )
}