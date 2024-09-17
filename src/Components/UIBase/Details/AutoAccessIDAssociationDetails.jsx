import React from "react";
import { Input, DatePicker, Checkbox, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { Button } from "@scuf/common";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import * as Constants from "../../../JS/Constants";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";

AutoAccessIDAssociationDetails.propTypes = {
  handleSave: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  temporaryCard: PropTypes.object.isRequired,
  modTemporaryCard: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  saveEnabled: PropTypes.bool.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  handleShowCard: PropTypes.func.isRequired,
  location: PropTypes.array.isRequired,
  TWICEnabled: PropTypes.string.isRequired,
  isValidateFASCN: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
};

AutoAccessIDAssociationDetails.defaultProps = {};

export function AutoAccessIDAssociationDetails({
  handleSave,
  handleReset,
  temporaryCard,
  modTemporaryCard,
  validationErrors,
  onFieldChange,
  saveEnabled,
  onDateTextChange,
  handleShowCard,
  location,
  TWICEnabled,
  isValidateFASCN,
  isEnterpriseNode,
  modAttributeMetaDataList,
  attributeValidationErrors,
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

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="autoDetailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modTemporaryCard.PIN === "" ? "" : modTemporaryCard.PIN}
                label={t("AccessCardInfo_x_IDCode")}
                indicator="required"
                onChange={(data) => onFieldChange("PIN", data)}
                error={t(validationErrors.PIN)}
                disabled={true}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-8" style={{ marginTop: 24 }}>
              {location.length === 0 ? (
                ""
              ) : (
                <Button
                  content={t("TempororyCard_ShowTempCard")}
                  className="backButton"
                  onClick={handleShowCard}
                ></Button>
              )}
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modTemporaryCard.Description === null
                    ? ""
                    : modTemporaryCard.Description
                }
                label={t("AccessCardInfo_Description")}
                onChange={(data) => onFieldChange("Description", data)}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modTemporaryCard.CardType}
                label={t("AccessCardList_x_ID_Category")}
                onChange={(data) => onFieldChange("CardType", data)}
                error={t(validationErrors.CardType)}
                disabled={true}
                indicator="required"
                reserveSpace={false}
              />
            </div>
            {modTemporaryCard.CardType === "ELECTRONIC" &&
            TWICEnabled === "1" ? (
              <div
                className="col-12 col-md-6 col-lg-4"
                style={{ marginTop: 21 }}
              >
                <Checkbox
                  label={t("AccessCardInfo_IsTWICCard")}
                  checked={modTemporaryCard.ISTWICCARD}
                  onChange={(checked) => onFieldChange("ISTWICCARD", checked)}
                  disabled={temporaryCard.PIN !== ""}
                ></Checkbox>
              </div>
            ) : (
              ""
            )}
            {modTemporaryCard.ISTWICCARD === true ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={
                    modTemporaryCard.FASCN === null
                      ? ""
                      : modTemporaryCard.FASCN
                  }
                  label={t("AccessCardInfo_FASCN")}
                  onChange={(data) => onFieldChange("FASCN", data)}
                  onBlur={isValidateFASCN}
                  error={t(validationErrors.FASCN)}
                  disabled={temporaryCard.PIN !== ""}
                  indicator="required"
                  reserveSpace={false}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modTemporaryCard.ExpiryDate === null
                    ? ""
                    : new Date(modTemporaryCard.ExpiryDate)
                }
                label={t("AccessCardInfo_x_CardExpiry")}
                disablePast={true}
                indicator="required"
                // onChange={(data) => onFieldChange("ExpiryDate", data)}
                error={t(validationErrors.ExpiryDate)}
                onTextChange={(value, error) => {
                  onDateTextChange("ExpiryDate", value, error);
                }}
                displayFormat={getCurrentDateFormat()}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4" style={{ marginTop: 21 }}>
              <Checkbox
                label={t("AccessCardInfo_x_Locked")}
                checked={modTemporaryCard.Locked}
                onChange={(checked) => onFieldChange("Locked", checked)}
                disabled={
                  temporaryCard.PIN === "" ||
                  modTemporaryCard.CardStatus === Constants.CardStatus.EXPIRED
                }
              ></Checkbox>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modTemporaryCard.CardStatus === null
                    ? ""
                    : modTemporaryCard.CardStatus
                }
                label={t("AccessCardInfo_x_CardUsageStatus")}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4 ">
              <Input
                fluid
                value={
                  temporaryCard.PIN === "" ||
                  modTemporaryCard.LastLockingTime === undefined ||
                  modTemporaryCard.LastLockingTime === null
                    ? ""
                    : new Date(
                        modTemporaryCard.LastLockingTime
                      ).toLocaleString()
                }
                label={t("DriverInfo_LastLocking")}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modTemporaryCard.Remarks === null
                    ? ""
                    : modTemporaryCard.Remarks
                }
                label={t("AccessCardInfo_Remarks")}
                disabled={temporaryCard.PIN === ""}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={modTemporaryCard.Locked ? "required" : ""}
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
          </div>
          {modAttributeMetaDataList.length > 0 && !isEnterpriseNode
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
          <div className="detailsButton">
            <Button
              content={t("Channel_Reset")}
              className="cancelButton"
              onClick={handleReset}
            ></Button>
            <Button
              content={t("AccessCardInfo_Save")}
              disabled={!saveEnabled}
              onClick={handleSave}
            ></Button>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
