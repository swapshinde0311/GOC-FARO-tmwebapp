import React from 'react';
import { Select, Input } from '@scuf/common';
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";

GantryDetails.propTypes = {
    gantry: PropTypes.object.isRequired,
    modGantry: PropTypes.object.isRequired,
};

export default function GantryDetails({
    gantry,
    modGantry,
    selectedLocationType,
    onFieldChange,
    validationErrors,
    onActiveStatusChange,

}) {
    const [t] = useTranslation();
    return (
        <div className="detailsContainer">
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modGantry.Code}
                        label={t(selectedLocationType + "Code")}
                        indicator="required"
                        disabled={gantry.Code !== ""}
                        onChange={(data) => onFieldChange("Code", data)}
                        error={t(validationErrors.Code)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modGantry.Name}
                        label={t(selectedLocationType + "Name")}
                        indicator="required"
                        onChange={(data) => onFieldChange("Name", data)}
                        error={t(validationErrors.Name)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modGantry.ParentCode}
                        label={t("Common_Terminal")}
                        disabled={true}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("Cust_Status")}
                        value={modGantry.Active}
                        options={[
                            { text: t("ViewShipment_Ok"), value: true },
                            { text: t("ViewShipmentStatus_Inactive"), value: false },
                        ]}
                        onChange={(data) => onActiveStatusChange(data)}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={
                            modGantry.EntityRemarks === null ? "" : modGantry.EntityRemarks
                        }
                        label={t("Cust_Remarks")}
                        onChange={(data) => onFieldChange("EntityRemarks", data)}
                        indicator={
                            modGantry.Active !== gantry.Active ? "required" : ""
                        }
                        error={t(validationErrors.EntityRemarks)}
                        reserveSpace={false}
                    />
                </div>
            </div>
        </div>
    );

}