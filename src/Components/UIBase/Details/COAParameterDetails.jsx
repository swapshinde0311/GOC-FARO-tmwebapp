import React from "react";
import { Accordion, Select } from "@scuf/common";
import { Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";

COAParameterDetails.propTypes = {
  coaParameter: PropTypes.object.isRequired,
  modCOAParameter: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired
};

COAParameterDetails.defaultProps = {
  isEnterpriseNode: false,
};

export function COAParameterDetails({
  coaParameter,
  modCOAParameter,
  validationErrors,
  onFieldChange,
  onActiveStatusChange,
  isEnterpriseNode,
}) {

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOAParameter.Name}
                label={t("Common_Name")}
                indicator="required"
                disabled={coaParameter.Name !== ""}
                onChange={(data) => onFieldChange("Name", data)}
                error={t(validationErrors.Name)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOAParameter.Specification}
                label={t("COAPara_Specification")}
                onChange={(data) => onFieldChange("Specification", data)}
                error={t(validationErrors.Specification)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modCOAParameter.Method
                }
                onChange={(data) => onFieldChange("Method", data)}
                label={t("COAPara_Method")}
                error={t(validationErrors.Method)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modCOAParameter.Description
                }
                onChange={(data) => onFieldChange("Description", data)}
                label={t("COAParameter_Description")}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("FinishedProductInfo_Select")}
                label={t("COAParameter_IsActive")}
                value={modCOAParameter.IsActive}
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
                value={modCOAParameter.Remarks === null ? "" : modCOAParameter.Remarks}
                label={t("COAParameter_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modCOAParameter.IsActive !== coaParameter.IsActive ? "required" : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
