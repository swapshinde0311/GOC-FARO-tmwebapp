import React from "react";
import { Accordion, Select } from "@scuf/common";
import { Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import * as Utilities from "../../../JS/Utilities";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

CustomerDetails.propTypes = {
  customer: PropTypes.object.isRequired,
  modCustomer: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    languageOptions: PropTypes.array,
    terminalCodes: PropTypes.array,
    transportTypes: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleDCHCellDataEdit: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  modDCHAttributes: PropTypes.array.isRequired,
  isDCHEnabled: PropTypes.bool.isRequired,
  dchAttributeValidationErrors: PropTypes.object.isRequired
};

CustomerDetails.defaultProps = {
  isEnterpriseNode: false,
  isDCHEnabled: false
};

export function CustomerDetails({
  customer,
  modCustomer,
  modDCHAttributes,
  validationErrors,
  attributeValidationErrors,
  listOptions,
  onFieldChange,
  onAllTerminalsChange,
  onActiveStatusChange,
  isEnterpriseNode,
  modAttributeMetaDataList,
  onAttributeDataChange,
  isDCHEnabled,
  dchAttributeValidationErrors,
  handleDCHCellDataEdit
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
                value={modCustomer.Code}
                label={t("Cust_Code")}
                indicator="required"
                disabled={customer.Code !== ""}
                onChange={(data) => onFieldChange("Code", data)}
                error={t(validationErrors.Code)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCustomer.Name}
                label={t("Cust_Name")}
                indicator="required"
                onChange={(data) => onFieldChange("Name", data)}
                error={t(validationErrors.Name)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modCustomer.TransportationTypes}
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
                value={
                  modCustomer.Description === null
                    ? ""
                    : modCustomer.Description
                }
                onChange={(data) => onFieldChange("Description", data)}
                label={t("Cust_Description")}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modCustomer.LanguageCode}
                label={t("CustomerInfo_Language")}
                indicator="required"
                options={listOptions.languageOptions}
                onChange={(data) => onFieldChange("LanguageCode", data)}
                error={t(validationErrors.LanguageCode)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modCustomer.ContactPerson === null
                    ? ""
                    : modCustomer.ContactPerson
                }
                onChange={(data) => onFieldChange("ContactPerson", data)}
                label={t("Cust_ContactPerson")}
                error={t(validationErrors.ContactPerson)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCustomer.Address === null ? "" : modCustomer.Address}
                onChange={(data) => onFieldChange("Address", data)}
                label={t("Cust_Address")}
                error={t(validationErrors.Address)}
                reserveSpace={false}
              />
            </div>
           
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCustomer.Mobile === null ? "" : modCustomer.Mobile}
                label={t("Cust_Mobile")}
                onChange={(data) => onFieldChange("Mobile", data)}
                error={t(validationErrors.Mobile)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCustomer.Phone === null ? "" : modCustomer.Phone}
                label={t("Cust_PhNum")}
                onChange={(data) => onFieldChange("Phone", data)}
                error={t(validationErrors.Phone)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCustomer.Email === null ? "" : modCustomer.Email}
                label={t("Cust_Email")}
                onChange={(data) => onFieldChange("Email", data)}
                error={t(validationErrors.Email)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("FinishedProductInfo_Select")}
                label={t("Cust_Status")}
                value={modCustomer.Status}
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
                value={modCustomer.Remarks === null ? "" : modCustomer.Remarks}
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modCustomer.Status !== customer.Status ? "required" : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
            {isEnterpriseNode ?
              (<div className="col-12 col-md-6 col-lg-4">
                <AssociatedTerminals
                  terminalList={listOptions.terminalCodes}
                  selectedTerminal={modCustomer.TerminalCodes}
                  error={t(validationErrors.TerminalCodes)}
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
          {
            isDCHEnabled && modDCHAttributes && modDCHAttributes.length > 0 ?
              <ErrorBoundary>
                <Accordion>
                  <Accordion.Content
                    className="attributeAccordian"
                    title={t("External_System_Fields")}
                  >
                    {
                      modDCHAttributes.map((dchAttribute) =>
                        //console.log("dchAttributeValidationErrors[dchAttribute.EntityName]", dchAttribute.ID.toString()),
                        <div className="col-12 col-md-6 col-lg-4" >
                          <Input
                            fluid
                            label={t(dchAttribute.EntityName)}
                            value={dchAttribute.Value === null ? "" : dchAttribute.Value}
                            indicator={"required"}
                            onChange={(value) => handleDCHCellDataEdit(dchAttribute, value)}
                            error={t(dchAttributeValidationErrors[dchAttribute.ID])}
                            reserveSpace={false}
                          />
                        </div>
                      )
                    }
                  </Accordion.Content>
                </Accordion>
              </ErrorBoundary> : null
          }

        </div>
      )}
    </TranslationConsumer>
  );
}
