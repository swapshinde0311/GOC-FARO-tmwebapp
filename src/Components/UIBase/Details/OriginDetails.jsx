import React from "react";
import { Accordion, Select } from "@scuf/common";
import { Input } from "@scuf/common";
import * as Constants from "./../../../JS/Constants";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import * as Utilities from "../../../JS/Utilities";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

OriginDetails.propTypes = {
  origin: PropTypes.object.isRequired,
  modOrigin: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
    transportTypes: PropTypes.array,
    associatedSupplier: PropTypes.array,
  }).isRequired,
  genericProps: PropTypes.shape({
    transportationType: PropTypes.oneOf(
      Object.values(Constants.TransportationType)
    ),
  }),
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onCarrierIdentifierChange: PropTypes.func.isRequired,
  onShareholderChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired
};

OriginDetails.defaultProps = { genericProps: { transportationType: "ROAD" }, isEnterpriseNode: false };

export function OriginDetails({
  origin,
  modOrigin,
  validationErrors,
  listOptions,
  genericProps,
  onFieldChange,
  onAllTerminalsChange,
  onActiveStatusChange,
  isEnterpriseNode,
  modAttributeMetaDataList,
  onAttributeDataChange,
  attributeValidationErrors
}) {
  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
      return selectedAttribute.TerminalCode === terminal;
    })
    return attributeValidation.attributeValidationErrors;
  }

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modOrigin.Code}
                indicator="required"
                disabled={origin.Code !== ""}
                onChange={(data) => onFieldChange("Code", data)}
                label={t("OriginTerminal_Code")}
                error={t(validationErrors.Code)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modOrigin.Name}
                indicator="required"
                onChange={(data) => onFieldChange("Name", data)}
                label={t("OriginTerminal_Name")}
                error={t(validationErrors.Name)}
                reserveSpace={false}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                value={modOrigin.TransportationTypes}
                label={t("TransportationTypes")}
                indicator="required"
                options={Utilities.transferListtoOptions(
                  listOptions.transportTypes
                )}
                onChange={(data) => onFieldChange("TransportationTypes", data)}
                error={t(validationErrors.TransportationTypes)}
                disabled={listOptions.transportTypes.length === 0}
                multiple={true}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modOrigin.Address === null ? "" : modOrigin.Address}
                onChange={(data) => onFieldChange("Address", data)}
                label={t("OriginTerminal_Address")}
                error={t(validationErrors.Address)}
                reserveSpace={false}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                value={listOptions.associatedSupplier}
                label={t("OriginTerminal_AssociateSupplier")}
                options={Utilities.transferListtoOptions(
                  listOptions.associatedSupplier
                )}
                disabled
                multiple={true}
                reserveSpace={false}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("OriginTerminal_Status")}
                value={modOrigin.Status}
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
                value={modOrigin.Remarks === null ? "" : modOrigin.Remarks}
                onChange={(data) => onFieldChange("Remarks", data)}
                label={t("OriginTerminal_Remark")}
                indicator={modOrigin.Status !== origin.Status ? "required" : ""}
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>

            {isEnterpriseNode ?
              (<div className="col-12 col-md-6 col-lg-4">
                <AssociatedTerminals
                  terminalList={listOptions.terminalCodes}
                  selectedTerminal={modOrigin.TerminalCodes}
                  error={validationErrors.TerminalCodes}
                  onFieldChange={onFieldChange}
                  onCheckChange={onAllTerminalsChange}
                ></AssociatedTerminals>
              </div>) : ("")}
          </div>
          {
            modAttributeMetaDataList.length > 0 ?
            modAttributeMetaDataList.map((attribute) =>
                <ErrorBoundary>
                  <Accordion>
                    <Accordion.Content
                      className="attributeAccordian"
                      title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                    >
                      <AttributeDetails
                        selectedAttributeList={attribute.attributeMetaDataList}
                        handleCellDataEdit={onAttributeDataChange}
                        attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attribute.TerminalCode)}
                      ></AttributeDetails>
                    </Accordion.Content>
                  </Accordion>
                </ErrorBoundary>
              ) : null

          }
        </div>
      )}
    </TranslationConsumer>
  );
}
