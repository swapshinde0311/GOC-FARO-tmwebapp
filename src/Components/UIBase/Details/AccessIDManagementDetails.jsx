import React from "react";
import {
  Accordion,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Button,
} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import { AttributeDetails } from "./AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

AccessIDManagementDetails.propTypes = {
  accessCard: PropTypes.object.isRequired,
  modAccessCard: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    cardTypes: PropTypes.array,
    CarrierCompanies: PropTypes.array,
    EntityTypes: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  saveEnabled: PropTypes.bool,
  onFASCNBlur: PropTypes.func.isRequired,
  isTWICEnable: PropTypes.bool,

  modAttributeMetaDataList: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
};

AccessIDManagementDetails.defaultProps = {};

export function AccessIDManagementDetails({
  accessCard,
  modAccessCard,
  validationErrors,
  listOptions,
  onFieldChange,
  handleSave,
  handleReset,
  saveEnabled,
  onFASCNBlur,
  isTWICEnable,
  modAttributeMetaDataList,
  onAttributeDataChange,
  attributeValidationErrors,
  isEnterpriseNode,
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
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modAccessCard.PIN === "" ? "" : modAccessCard.PIN}
                label={t("AccessCardInfo_x_IDCode")}
                indicator="required"
                disabled={accessCard.PIN !== ""}
                onChange={(data) => onFieldChange("PIN", data)}
                error={t(validationErrors.PIN)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modAccessCard.CardType}
                label={t("AccessCardList_x_ID_Category")}
                indicator="required"
                options={Utilities.transferListtoOptions(listOptions.cardTypes)}
                onChange={(data) => onFieldChange("CardType", data)}
                error={t(validationErrors.CardType)}
                disabled={accessCard.CardType !== null}
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            {modAccessCard.CardType === "ELECTRONIC" &&
            isTWICEnable === true ? (
              <div
                className="col-12 col-md-6 col-lg-4"
                style={{ marginTop: 20 }}
              >
                <Checkbox
                  disabled={accessCard.PIN !== ""}
                  label={t("AccessCardInfo_IsTWICCard")}
                  checked={modAccessCard.ISTWICCARD}
                  onChange={(checked) => onFieldChange("ISTWICCARD", checked)}
                />
              </div>
            ) : (
              ""
            )}
            {modAccessCard.ISTWICCARD === true ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  onBlur={onFASCNBlur}
                  value={modAccessCard.FASCN === "" ? "" : modAccessCard.FASCN}
                  label={t("AccessCardInfo_FASCN")}
                  indicator="required"
                  disabled={accessCard.PIN !== ""}
                  onChange={(data) => onFieldChange("FASCN", data)}
                  error={t(validationErrors.FASCN)}
                  reserveSpace={false}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("AccessCardInfo_x_CardUsageStatus")}
                value={
                  modAccessCard.CardStatus === null
                    ? ""
                    : modAccessCard.CardStatus
                }
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("AccessCardInfo_Description")}
                value={
                  modAccessCard.Description === null
                    ? ""
                    : modAccessCard.Description
                }
                onChange={(data) => onFieldChange("Description", data)}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modAccessCard.ExpiryDate === null
                    ? ""
                    : new Date(modAccessCard.ExpiryDate)
                }
                label={t("AccessCardInfo_x_CardExpiry")}
                disablePast={true}
                indicator="required"
                onChange={(data) => onFieldChange("ExpiryDate", data)}
                displayFormat={getCurrentDateFormat()}
                error={t(validationErrors.ExpiryDate)}
                reserveSpace={false}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4" style={{ marginTop: 20 }}>
              <Checkbox
                label={t("AccessCardInfo_x_Locked")}
                checked={modAccessCard.Locked}
                disabled={
                  accessCard.PIN === "" || accessCard.CardStatus === "EXPIRED"
                }
                onChange={(checked) => onFieldChange("Locked", checked)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modAccessCard.Remarks === null ? "" : modAccessCard.Remarks
                }
                label={t("AccessCardInfo_Remarks")}
                disabled={accessCard.PIN === ""}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={modAccessCard.Locked !== accessCard.Locked ? "required" : ""}
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                label={t("AccessCardInfoDetails_LastLocking")}
                value={
                  accessCard.PIN === ""
                    ? ""
                    : modAccessCard.LastLockingTime === null
                    ? ""
                    : new Date(modAccessCard.LastLockingTime).toLocaleString()
                }
                disabled={true}
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
                        handleCellDataEdit={(attribute, value) => {
                          onAttributeDataChange(attribute, value);
                        }}
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
              content={t("LookUpData_btnReset")}
              className="cancelButton"
              onClick={handleReset}
            ></Button>
            <Button
              content={t("Save")}
              disabled={!saveEnabled}
              onClick={handleSave}
            ></Button>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
