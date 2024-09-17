import React from "react";
import { Select, Checkbox, InputLabel } from "@scuf/common";
import { Accordion, Input, DatePicker } from "@scuf/common";
import * as Constants from "./../../../JS/Constants";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { AttributeDetails } from "../Details/AttributeDetails";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import * as Utilities from "../../../JS/Utilities";
CarrierDetails.propTypes = {
  carrier: PropTypes.object.isRequired,
  modCarrier: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
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
  onActiveStatusChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
};
CarrierDetails.defaultProps = {
  genericProps: { transportationType: "ROAD" },
  isEnterpriseNode: false,
};

export function CarrierDetails({
  carrier,
  modCarrier,
  validationErrors,
  attributeValidationErrors,
  modAttributeMetaDataList,
  listOptions,
  genericProps,
  onFieldChange,
  onDateTextChange,
  onCarrierIdentifierChange,
  onShareholderChange,
  onAllTerminalsChange,
  onActiveStatusChange,
  isEnterpriseNode,
  onAttributeDataChange,
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
  //console.log(Date.parse("2020-06-05T11:04:13.717"));
  // console.log("details product", listOptions);
  var transportationType =
    genericProps.transportationType === undefined
      ? Constants.TransportationType.ROAD
      : genericProps.transportationType;
  //throw new Error("Test");
  function getCarrierIdentityType(identityNumber) {
    // console.log(identityNumber);
    var corectedIdentity = identityNumber;
    if (
      identityNumber === undefined ||
      identityNumber === "" ||
      identityNumber === null
    ) {
      corectedIdentity = "000000000U";
    }
    var lastChar = corectedIdentity[corectedIdentity.length - 1];
    //console.log(lastChar);
    if (lastChar !== "U" && lastChar !== "F" && lastChar !== "S")
      lastChar = "U";
    // console.log(lastChar);
    return lastChar;
  }
  function getCarrierIdentifierNumber(identityNumber) {
    var corectedIdentity = identityNumber;
    if (
      identityNumber === undefined ||
      identityNumber === "" ||
      identityNumber === null
    ) {
      corectedIdentity = "000000000U";
    }
    return corectedIdentity.substring(0, corectedIdentity.length - 1);
  }
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCarrier.Code}
                indicator="required"
                disabled={carrier.Code !== ""}
                onChange={(data) => onFieldChange("Code", data)}
                label={t("CarrierDetails_CarrierCode")}
                error={t(validationErrors.Code)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCarrier.Name}
                onChange={(data) => onFieldChange("Name", data)}
                indicator="required"
                label={t("CarrierDetails_Name")}
                error={t(validationErrors.Name)}
                reserveSpace={false}
              />
            </div>
            {transportationType === Constants.TransportationType.ROAD ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("CarrierDetails_ShareHolder")}
                  value={modCarrier.ShareholderCode}
                  options={listOptions.shareholders}
                  onChange={(data) => {
                    //onFieldChange("ShareholderCode", data);
                    onShareholderChange([data], "ShareholderCode");
                  }}
                  indicator="required"
                  error={t(validationErrors.ShareholderCode)}
                  reserveSpace={false}
                  disabled={carrier.Code !== ""}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            ) : (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("CarrierDetails_ShareHolder")}
                  value={modCarrier.ShareholderCodes}
                  multiple={true}
                  options={listOptions.shareholders}
                  onChange={(data) => {
                    // onFieldChange("ShareholderCodes", data);
                    onShareholderChange(data, "ShareholderCodes");
                  }}
                  indicator="required"
                  error={t(validationErrors.ShareholderCodes)}
                  reserveSpace={false}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            )}
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modCarrier.PermitNumber === null
                    ? ""
                    : modCarrier.PermitNumber
                }
                onChange={(data) => onFieldChange("PermitNumber", data)}
                label={t("CarrierDetails_PermitNumber")}
                error={t(validationErrors.PermitNumber)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                //value={modCarrier.PermitExpiryDate.toISOString()}
                value={
                  modCarrier.PermitExpiryDate === null
                    ? ""
                    : Utilities.convertStringToCommonDateFormat(
                        modCarrier.PermitExpiryDate
                      )
                }
                displayFormat={getCurrentDateFormat()}
                label={t("CarrierDetails_PermitExpiry")}
                showYearSelector="true"
                disablePast={true}
                indicator="required"
                onChange={(data) => onFieldChange("PermitExpiryDate", data)}
                onTextChange={(value, error) => {
                  onDateTextChange("PermitExpiryDate", value, error);
                }}
                error={t(validationErrors.PermitExpiryDate)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <InputLabel
                label={t("Carrier_Identification_Number")}
              ></InputLabel>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Select
                    fluid
                    //placeholder="Select"
                    // label={t("Carrier_Identification_Number")}
                    value={getCarrierIdentityType(modCarrier.IdentityNumber)}
                    options={Constants.carrierIdentifierOptions}
                    onChange={(data) =>
                      onCarrierIdentifierChange(
                        "IdentityNumber",
                        "identifier",
                        data
                      )
                    }
                    //indicator="required"
                    //error={t(validationErrors.IdentityNumber)}
                    reserveSpace={false}
                    search={true}
                    noResultsMessage={t("noResultsMessage")}
                  />
                </div>
                <div style={{ width: "48%" }}>
                  <Input
                    placeholder="Input"
                    fluid
                    value={getCarrierIdentifierNumber(
                      modCarrier.IdentityNumber
                    )}
                    onChange={(data) =>
                      onCarrierIdentifierChange(
                        "IdentityNumber",
                        "IdentifierNumber",
                        data
                      )
                    }
                    disabled={
                      getCarrierIdentityType(modCarrier.IdentityNumber) === "U"
                    }
                  />
                </div>
              </div>
              {validationErrors.IdentityNumber !== "" ? (
                <div className="below-text">
                  <span className="ui error-message">
                    {t(validationErrors.IdentityNumber)}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modCarrier.ContactPerson === null
                    ? ""
                    : modCarrier.ContactPerson
                }
                onChange={(data) => onFieldChange("ContactPerson", data)}
                label={t("CarrierDetails_ContactPerson")}
                error={t(validationErrors.ContactPerson)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCarrier.Address === null ? "" : modCarrier.Address}
                onChange={(data) => onFieldChange("Address", data)}
                label={t("CarrierDetails_Address")}
                error={t(validationErrors.Address)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4 checkboxSelect">
              <Checkbox
                label={t("CarrierDetails_AllowWeighIn")}
                checked={modCarrier.AllowOnlyWeighIn}
                onChange={(checked) =>
                  onFieldChange("AllowOnlyWeighIn", checked)
                }
              />
              <Checkbox
                label={t("CarrierDetails_EnforceSeq")}
                checked={modCarrier.EnforceSequence}
                onChange={(checked) =>
                  onFieldChange("EnforceSequence", checked)
                }
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCarrier.Phone === null ? "" : modCarrier.Phone}
                onChange={(data) => onFieldChange("Phone", data)}
                label={t("CarrierDetails_Phone")}
                error={t(validationErrors.Phone)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCarrier.Mobile === null ? "" : modCarrier.Mobile}
                onChange={(data) => onFieldChange("Mobile", data)}
                label={t("CarrierDetails_MobileNumber")}
                error={t(validationErrors.Mobile)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCarrier.Email === null ? "" : modCarrier.Email}
                onChange={(data) => onFieldChange("Email", data)}
                label={t("CarrierDetails_Email")}
                error={t(validationErrors.Email)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modCarrier.Description === null ? "" : modCarrier.Description
                }
                onChange={(data) => onFieldChange("Description", data)}
                label={t("CarrierDetails_Desc")}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("FinishedProductInfo_Select")}
                label={t("DriverInfo_Status")}
                value={modCarrier.Status}
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
                value={modCarrier.Remarks === null ? "" : modCarrier.Remarks}
                label={t("DriverInfo_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modCarrier.Status !== carrier.Status ? "required" : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <AssociatedTerminals
                  terminalList={listOptions.terminalCodes}
                  selectedTerminal={modCarrier.TerminalCodes}
                  error={validationErrors.TerminalCodes}
                  onFieldChange={onFieldChange}
                  onCheckChange={onAllTerminalsChange}
                ></AssociatedTerminals>
                {/* <Select
                fluid
                placeholder="Select"
                label={t("TerminalCodes")}
                value={modCarrier.TerminalCodes}
                multiple={true}
                options={listOptions.terminalCodes}
                onChange={(data) => onFieldChange("ShareholderCodes", data)}
                indicator="required"
                error={t(validationErrors.ShareholderCodes)}
                reserveSpace={false}
              /> */}
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
                          ? attire.TerminalCode + " - " + t("Attributes_Header")
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
        </div>
      )}
    </TranslationConsumer>
  );
}
