import React from "react";
import {Checkbox, Input} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";

import { MarineDispatchCompartmentStatus } from "../../../JS/Constants";

MarineDispatchCompartmentDetails.propTypes = {
    modMarineDispatch: PropTypes.object.isRequired,
};

MarineDispatchCompartmentDetails.defaultProps = { isEnterpriseNode: false }

export function MarineDispatchCompartmentDetails({
    modMarineDispatch,
}) {
    function handleStatus(e){
        if (e === MarineDispatchCompartmentStatus.EMPTY) {
            return "EMPTY"
        } else if (e === MarineDispatchCompartmentStatus.LOADING) {
            return "LOADING"
        } else if (e === MarineDispatchCompartmentStatus.PART_FILLED) {
            return "PART_FILLED"
        } else if (e === MarineDispatchCompartmentStatus.OVER_FILLED) {
            return "OVER_FILLED"
        } else if (e === MarineDispatchCompartmentStatus.FORCE_COMPLETED) {
            return "FORCE_COMPLETED"
        } else if (e === MarineDispatchCompartmentStatus.COMPLETED) {
            return "COMPLETED"
        } else if (e === MarineDispatchCompartmentStatus.INTERRUPTED) {
            return "INTERRUPTED"
        } else {
            return ""
        }
    }

    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-3 col-lg-3">
                            <Input
                                fluid
                                value={modMarineDispatch.CompartmentSeqNoInVehicle}
                                disabled={modMarineDispatch.CompartmentSeqNoInVehicle !== ""}
                                label={t("ViewMarineShipmentList_SeqNo")}
                            />
                        </div>
                        <div className="col-12 col-md-3 col-lg-3">
                            <Input
                                fluid
                                value={modMarineDispatch.FinishedProductCode}
                                label={t("ViewShipmentCompartment_Product")}
                                disabled={modMarineDispatch.FinishedProductCode !== ""}
                            />
                        </div>
                        <div className="col-12 col-md-3 col-lg-3">
                            <Input
                                fluid
                                value={handleStatus(modMarineDispatch.DispatchCompartmentStatus)}
                                label={t("ViewMarineShipmentList_CompartmentStatus")}
                                disabled={modMarineDispatch.DispatchCompartmentStatus !== ""}
                            />
                        </div>
                        <div className="col-12 col-md-3 col-lg-3">
                            <Input
                                fluid
                                value={modMarineDispatch.PlannedQuantity+modMarineDispatch.PlanQuantityUOM}
                                label={t("ViewShipmentCompartment_PlannedQuantity")}
                                disabled={modMarineDispatch.PlannedQuantity !== ""}
                            />
                        </div>
                        <div className="col-12 col-md-3 col-lg-3">
                            <Input
                                fluid
                                value={modMarineDispatch.AdjustedPlanQuantity+modMarineDispatch.PlanQuantityUOM}
                                label={t("ViewShipmentCompartment_AdjustedQuantity")}
                                disabled={modMarineDispatch.AdjustedPlanQuantity !== ""}
                            />
                        </div>


                        <div className="col-12 col-md-3 col-lg-3">
                            <Input
                                fluid
                                value={modMarineDispatch.ReturnQuantity+modMarineDispatch.PlanQuantityUOM}
                                label={t("ViewShipmentStatus_ReturnQuantity")}
                                disabled={modMarineDispatch.ReturnQuantity !== ""}
                            />
                        </div>
                        <div className="col-12 col-md-3 col-lg-3">
                            <Input
                                fluid
                                value={modMarineDispatch.NetLoadedQuantity}
                                label={t("ViewMarineShipmentList_LoadedQuantity")}
                                disabled={modMarineDispatch.NetLoadedQuantity !== ""}
                            />
                        </div>
                        <div className="col-12 col-md-3 col-lg-3" style={{marginTop:20}}>
                            <Checkbox
                                fluid
                                checked={modMarineDispatch.PurgingCompleted}
                                label={t("ViewMarineShipmentList_ForceComplete")}
                                disabled={modMarineDispatch.PurgingCompleted !== ""}
                            />
                        </div>
                    </div>
                </div>
            )}
        </TranslationConsumer>
    );
}

