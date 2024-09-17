import React from "react";
import { Select, InputLabel } from "@scuf/common";
import { Accordion, Input, DatePicker, Checkbox } from "@scuf/common";
//import * as Constants from "./../../../JS/Constants";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { AttributeDetails } from "../Details/AttributeDetails";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";

DriverDetails.propTypes = {
  driver: PropTypes.object.isRequired,
  modDriver: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    carriers: PropTypes.array,
    languageOptions: PropTypes.array,
    terminalCodes: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleDCHCellDataEdit: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onCarrierChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  handleTerminalSelectionChange: PropTypes.func.isRequired,
  onCarrierSearchChange: PropTypes.func.isRequired,
  modDCHAttributes: PropTypes.array.isRequired,
  isDCHEnabled: PropTypes.bool.isRequired,
  dchAttributeValidationErrors: PropTypes.object.isRequired,
  hazardousEnabled: PropTypes.bool,
};
DriverDetails.defaultProps = {
  listOptions: {
    carriers: [],
    languageOptions: [],
    terminalCodes: [],
  },
  isEnterpriseNode: false,
  isDCHEnabled: false,
  hazardousEnabled: false,
};

export function DriverDetails({
  driver,
  modDriver,
  modDCHAttributes,
  validationErrors,
  attributeValidationErrors,
  listOptions,

  modAttributeMetaDataList,
  onFieldChange,
  onDateTextChange,
  onCarrierChange,
  onImageChange,
  onAllTerminalsChange,
  onActiveStatusChange,
  isEnterpriseNode,
  onAttributeDataChange,
  onCarrierSearchChange,
  isDCHEnabled,
  dchAttributeValidationErrors,
  handleDCHCellDataEdit,
  isWebPortalUser,
  hazardousEnabled,
}) {
  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div>
          <div className="detailsContainer">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <InputLabel label={t("DriverInfo_Image")} />
                {modDriver !== undefined &&
                modDriver.DriverImage !== undefined &&
                modDriver.DriverImage !== null &&
                modDriver.DriverImage.length > 0 ? (
                  <img
                    height="100"
                    width="100"
                    alt=""
                    src={"data:image/jpg;base64," + modDriver.DriverImage}
                  />
                ) : (
                  <img alt="" height="100" width="100" />
                )}
                <br />
                {isWebPortalUser === false ? (
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="file"
                    onChange={onImageChange}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDriver.Code}
                  label={t("DriverInfo_Code")}
                  indicator="required"
                  disabled={driver.Code !== ""}
                  onChange={(data) => onFieldChange("Code", data)}
                  error={t(validationErrors.Code)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDriver.Name}
                  label={t("DriverInfo_DriverName")}
                  indicator="required"
                  onChange={(data) => onFieldChange("Name", data)}
                  error={t(validationErrors.Name)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("DriverInfo_Carrier")}
                  value={modDriver.CarrierCode}
                  options={listOptions.carriers}
                  onChange={(data) => {
                    //onFieldChange("CarrierCode", data);
                    onCarrierChange(data);
                  }}
                  indicator="required"
                  error={t(validationErrors.CarrierCode)}
                  reserveSpace={false}
                  disabled={driver.Code !== ""}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                  onSearch={onCarrierSearchChange}
                />
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDriver.License1 === null ? "" : modDriver.License1}
                  label={t("DriverInfo_Lic1")}
                  indicator="required"
                  onChange={(data) => onFieldChange("License1", data)}
                  error={t(validationErrors.License1)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    modDriver.License1IssueDate === null
                      ? ""
                      : Utilities.convertStringToCommonDateFormat(
                          modDriver.License1IssueDate
                        )
                  }
                  displayFormat={getCurrentDateFormat()}
                  label={t("DriverInfo_Lic1Issue")}
                  showYearSelector="true"
                  indicator="required"
                  onChange={(data) => onFieldChange("License1IssueDate", data)}
                  onTextChange={(value, error) => {
                    onDateTextChange("License1IssueDate", value, error);
                  }}
                  error={t(validationErrors.License1IssueDate)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    modDriver.License1ExpiryDate === null
                      ? ""
                      : Utilities.convertStringToCommonDateFormat(
                          modDriver.License1ExpiryDate
                        )
                  }
                  displayFormat={getCurrentDateFormat()}
                  label={t("DriverInfo_Lic1Expiry")}
                  disablePast={true}
                  indicator="required"
                  showYearSelector="true"
                  onChange={(data) => onFieldChange("License1ExpiryDate", data)}
                  onTextChange={(value, error) => {
                    onDateTextChange("License1ExpiryDate", value, error);
                  }}
                  error={t(validationErrors.License1ExpiryDate)}
                  reserveSpace={false}
                />
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDriver.License2 === null ? "" : modDriver.License2}
                  label={t("DriverInfo_Lic2")}
                  onChange={(data) => onFieldChange("License2", data)}
                  error={t(validationErrors.License2)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    modDriver.License2IssueDate === null
                      ? ""
                      : Utilities.convertStringToCommonDateFormat(
                          modDriver.License2IssueDate
                        )
                  }
                  displayFormat={getCurrentDateFormat()}
                  label={t("DriverInfo_Lic2Issue")}
                  showYearSelector="true"
                  onChange={(data) => onFieldChange("License2IssueDate", data)}
                  onTextChange={(value, error) => {
                    onDateTextChange("License2IssueDate", value, error);
                  }}
                  error={t(validationErrors.License2IssueDate)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    modDriver.License2ExpiryDate === null
                      ? ""
                      : Utilities.convertStringToCommonDateFormat(
                          modDriver.License2ExpiryDate
                        )
                  }
                  displayFormat={getCurrentDateFormat()}
                  label={t("DriverInfo_Lic2Expiry")}
                  disablePast={true}
                  showYearSelector="true"
                  onChange={(data) => onFieldChange("License2ExpiryDate", data)}
                  onTextChange={(value, error) => {
                    onDateTextChange("License2ExpiryDate", value, error);
                  }}
                  error={t(validationErrors.License2ExpiryDate)}
                  reserveSpace={false}
                />
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDriver.License3 === null ? "" : modDriver.License3}
                  label={t("DriverInfo_Lic3")}
                  onChange={(data) => onFieldChange("License3", data)}
                  error={t(validationErrors.License3)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    modDriver.License3IssueDate === null
                      ? ""
                      : Utilities.convertStringToCommonDateFormat(
                          modDriver.License3IssueDate
                        )
                  }
                  displayFormat={getCurrentDateFormat()}
                  label={t("DriverInfo_Lic3Issue")}
                  showYearSelector="true"
                  onChange={(data) => onFieldChange("License3IssueDate", data)}
                  onTextChange={(value, error) => {
                    onDateTextChange("License3IssueDate", value, error);
                  }}
                  error={t(validationErrors.License3IssueDate)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <DatePicker
                  fluid
                  value={
                    modDriver.License3ExpiryDate === null
                      ? ""
                      : Utilities.convertStringToCommonDateFormat(
                          modDriver.License3ExpiryDate
                        )
                  }
                  displayFormat={getCurrentDateFormat()}
                  label={t("DriverInfo_Lic3Expiry")}
                  disablePast={true}
                  showYearSelector="true"
                  onChange={(data) => onFieldChange("License3ExpiryDate", data)}
                  onTextChange={(value, error) => {
                    onDateTextChange("License3ExpiryDate", value, error);
                  }}
                  error={t(validationErrors.License3ExpiryDate)}
                  reserveSpace={false}
                />
              </div>
              {hazardousEnabled ? (
                <div className="col-12 col-md-6 col-lg-4 checkboxSelect">
                  <Checkbox
                    label={t("DriverInfo_AllowHazardous")}
                    checked={modDriver.IsHazardousAllowed}
                    onChange={(checked) =>
                      onFieldChange("IsHazardousAllowed", checked)
                    }
                  />
                </div>
              ) : (
                ""
              )}
              {hazardousEnabled ? (
                <div className="col-12 col-md-6 col-lg-4 ">
                  <DatePicker
                    fluid
                    value={
                      modDriver.HazardousLicenseExpiry === null
                        ? ""
                        : Utilities.convertStringToCommonDateFormat(
                            modDriver.HazardousLicenseExpiry
                          )
                    }
                    displayFormat={getCurrentDateFormat()}
                    label={t("DriverInfo_HazardousLicExpiry")}
                    disablePast={true}
                    showYearSelector="true"
                    onChange={(data) =>
                      onFieldChange("HazardousLicenseExpiry", data)
                    }
                    onTextChange={(value, error) => {
                      onDateTextChange("HazardousLicenseExpiry", value, error);
                    }}
                    error={t(validationErrors.HazardousLicenseExpiry)}
                    reserveSpace={false}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  value={modDriver.LanguageCode}
                  label={t("DriverInfo_Language")}
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
                  value={modDriver.Mobile === null ? "" : modDriver.Mobile}
                  label={t("DriverInfo_Mobile")}
                  onChange={(data) => onFieldChange("Mobile", data)}
                  error={t(validationErrors.Mobile)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDriver.Phone === null ? "" : modDriver.Phone}
                  label={t("DriverInfo_Phone")}
                  onChange={(data) => onFieldChange("Phone", data)}
                  error={t(validationErrors.Phone)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modDriver.MailID === null ? "" : modDriver.MailID}
                  label={t("DriverInfo_EMail")}
                  onChange={(data) => onFieldChange("MailID", data)}
                  error={t(validationErrors.MailID)}
                  reserveSpace={false}
                />
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("FinishedProductInfo_Select")}
                  label={t("DriverInfo_Status")}
                  value={modDriver.Active}
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
                  value={modDriver.Remarks === null ? "" : modDriver.Remarks}
                  label={t("DriverInfo_Remarks")}
                  onChange={(data) => onFieldChange("Remarks", data)}
                  indicator={
                    modDriver.Active !== driver.Active ? "required" : ""
                  }
                  error={t(validationErrors.Remarks)}
                  reserveSpace={false}
                />
              </div>
              {isEnterpriseNode ? (
                <div className="col-12 col-md-6 col-lg-4">
                  <AssociatedTerminals
                    terminalList={listOptions.terminalCodes}
                    selectedTerminal={modDriver.TerminalCodes}
                    error={t(validationErrors.TerminalCodes)}
                    onFieldChange={onFieldChange}
                    onCheckChange={onAllTerminalsChange}
                  ></AssociatedTerminals>
                </div>
              ) : (
                ""
              )}
            </div>
            {modAttributeMetaDataList.length > 0
              ? modAttributeMetaDataList.map((attire) => (
                  <ErrorBoundary>
                    <Accordion>
                      <Accordion.Content
                        className="attributeAccordian"
                        title={
                          isEnterpriseNode
                            ? attire.TerminalCode +
                              " - " +
                              t("Attributes_Header")
                            : t("Attributes_Header")
                        }
                      >
                        <AttributeDetails
                          selectedAttributeList={attire.attributeMetaDataList}
                          handleCellDataEdit={onAttributeDataChange}
                          attributeValidationErrors={handleValidationErrorFilter(
                            attributeValidationErrors,
                            attire.TerminalCode
                          )}
                        ></AttributeDetails>
                      </Accordion.Content>
                    </Accordion>
                  </ErrorBoundary>
                ))
              : null}
            {isDCHEnabled && modDCHAttributes && modDCHAttributes.length > 0 ? (
              <ErrorBoundary>
                <Accordion>
                  <Accordion.Content
                    className="attributeAccordian"
                    title={t("External_System_Fields")}
                  >
                    {modDCHAttributes.map((dchAttribute) => (
                      //console.log("dchAttributeValidationErrors[dchAttribute.EntityName]", dchAttribute.ID.toString()),
                      <div className="col-12 col-md-6 col-lg-4">
                        <Input
                          fluid
                          label={t(dchAttribute.EntityName)}
                          value={
                            dchAttribute.Value === null
                              ? ""
                              : dchAttribute.Value
                          }
                          indicator={"required"}
                          onChange={(value) =>
                            handleDCHCellDataEdit(dchAttribute, value)
                          }
                          error={t(
                            dchAttributeValidationErrors[dchAttribute.ID]
                          )}
                          reserveSpace={false}
                        />
                      </div>
                    ))}
                  </Accordion.Content>
                </Accordion>
              </ErrorBoundary>
            ) : null}
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
