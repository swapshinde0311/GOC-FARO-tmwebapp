import React from "react";
import { Select } from "@scuf/common";
import { Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { Button } from "@scuf/common";
import * as Utilities from "../../../JS/Utilities";
import * as Constants from "../../../JS/Constants";

AutoACDetailsSectionDetails.propTypes = {
  temporaryCard: PropTypes.object.isRequired,
  modTemporaryCard: PropTypes.object.isRequired,
  handleIssueID: PropTypes.func.isRequired,
  handleActivateID: PropTypes.func.isRequired,
  handleRevoleID: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  listOptions: PropTypes.shape({
    carrierCompanies: PropTypes.array,
    entityTypes: PropTypes.array,
    entityValues: PropTypes.array,
  }).isRequired,
  issueEnabled: PropTypes.bool,
  activateEnable: PropTypes.bool,
  revokeEnable: PropTypes.bool,
};

AutoACDetailsSectionDetails.defaultProps = {};

export function AutoACDetailsSectionDetails({
  temporaryCard,
  modTemporaryCard,
  handleIssueID,
  handleRevoleID,
  handleActivateID,
  validationErrors,
  listOptions,
  onFieldChange,
  issueEnabled,
  activateEnable,
  revokeEnable,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="autoDetailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator={
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.Visitor ||
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.TMUser ||
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.Staff
                    ? ""
                    : "required"
                }
                value={
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.Visitor ||
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.TMUser ||
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.Staff
                    ? ""
                    : modTemporaryCard.CarrierCode
                }
                label={t("AccessCardInfo_x_Carrier")}
                options={Utilities.transferListtoOptions(
                  listOptions.carrierCompanies
                )}
                onChange={(data) => onFieldChange("CarrierCode", data)}
                error={t(validationErrors.CarrierCode)}
                disabled={
                  modTemporaryCard.CardStatus !==
                    Constants.CardStatus.AVAILABLE ||
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.Visitor ||
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.TMUser ||
                  modTemporaryCard.EntityName ===
                    Constants.CommonEntityType.Staff
                }
                reserveSpace={false}
                multiple={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                value={modTemporaryCard.EntityName}
                label={t("AccessCardInfo_x_IssuedTo")}
                options={Utilities.transferListtoOptions(
                  listOptions.entityTypes
                )}
                onChange={(data) => onFieldChange("EntityName", data)}
                error={t(validationErrors.EntityName)}
                disabled={
                  modTemporaryCard.CardStatus !== Constants.CardStatus.AVAILABLE
                }
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                value={modTemporaryCard.EntityValue}
                label={t("AccessCardInfo_x_Details")}
                options={Utilities.transferListtoOptions(
                  listOptions.entityValues
                )}
                onChange={(data) => onFieldChange("EntityValue", data)}
                error={t(validationErrors.EntityValue)}
                disabled={
                  modTemporaryCard.CardStatus !== Constants.CardStatus.AVAILABLE
                }
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  temporaryCard.PIN === "" ||
                  modTemporaryCard.IssueDate === null
                    ? ""
                    : new Date(modTemporaryCard.IssueDate).toLocaleString()
                }
                label={t("AccessCardInfo_x_IssueDate")}
                disabled={temporaryCard.IssueDate !== ""}
                onChange={(data) => onFieldChange("IssueDate", data)}
                error={t(validationErrors.IssueDate)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  temporaryCard.PIN === "" ||
                  modTemporaryCard.ActivationTime === null
                    ? ""
                    : new Date(modTemporaryCard.ActivationTime).toLocaleString()
                }
                label={t("AccessCardList_ActivationTime")}
                disabled={temporaryCard.ActivationTime !== ""}
                onChange={(data) => onFieldChange("ActivationTime", data)}
                error={t(validationErrors.ActivationTime)}
                reserveSpace={false}
              />
            </div>
          </div>
          <div className="detailsButton">
            <Button
              disabled={!issueEnabled ? true : modTemporaryCard.CardStatus !== Constants.CardStatus.AVAILABLE ? true : false}
              content={t("AccessCardInfo_x_IssueCard")}
              onClick={handleIssueID}
            ></Button>
            <Button
              disabled={!activateEnable ? true : modTemporaryCard.CardStatus !== Constants.CardStatus.ISSUED ? true : false}
              content={t("AccessCardInfo_x_ActivateCard")}
              onClick={handleActivateID}
            ></Button>
            <Button
              disabled={!revokeEnable ? true : (modTemporaryCard.CardStatus !== Constants.CardStatus.ISSUED && modTemporaryCard.CardStatus !== Constants.CardStatus.ACTIVATED) ? true : false}
              content={t("AccessCardInfo_x_RevokeID")}
              onClick={handleRevoleID}
            ></Button>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
