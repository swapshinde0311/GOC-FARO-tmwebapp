import React from "react";
import { Input, Select, Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";

AccessIDManagementSectionDetails.propTypes = {
  accessCard: PropTypes.object.isRequired,
  modAccessCard: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    cardTypes: PropTypes.array,
    CarrierCompanies: PropTypes.array,
    EntityTypes: PropTypes.array,
    EntityValues: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onChangePasswordClicked: PropTypes.func.isRequired,
  onIssueClicked: PropTypes.func.isRequired,
  onActivateClick: PropTypes.func.isRequired,
  onRevokeClick: PropTypes.func.isRequired,
  onResetPasswordClick: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  issueEnabled: PropTypes.bool,
  activateEnable: PropTypes.bool,
  revokeEnable: PropTypes.bool,
  passwordEnable: PropTypes.bool,
  CarrierCodeEnable: PropTypes.bool,
};

AccessIDManagementSectionDetails.defaultProps = {};

export function AccessIDManagementSectionDetails({
  accessCard,
  modAccessCard,
  validationErrors,
  listOptions,
  onFieldChange,
  onChangePasswordClicked,
  onIssueClicked,
  onActivateClick,
  onRevokeClick,
  onResetPasswordClick,
  handleBack,
  issueEnabled,
  activateEnable,
  revokeEnable,
  passwordEnable,
  CarrierCodeEnable,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col col-md-8 col-lg-9 col col-xl-9">
              <h4>{t("Section")}</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modAccessCard.CarrierCode}
                label={t("AccessCardInfo_x_Carrier")}
                options={Utilities.transferListtoOptions(
                  listOptions.CarrierCompanies
                )}
                onChange={(data) => onFieldChange("CarrierCode", data)}
                error={t(validationErrors.CarrierCode)}
                disabled={
                  modAccessCard.CardStatus !== "AVAILABLE" || CarrierCodeEnable
                }
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                indicator="required"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modAccessCard.EntityName}
                label={t("AccessCardInfo_x_IssuedTo")}
                options={Utilities.transferListtoOptions(
                  listOptions.EntityTypes
                )}
                onChange={(data) => onFieldChange("EntityName", data)}
                error={t(validationErrors.EntityName)}
                disabled={modAccessCard.CardStatus !== "AVAILABLE"}
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                indicator="required"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modAccessCard.EntityValue}
                label={t("AccessCardInfo_x_Details")}
                options={Utilities.transferListtoOptions(
                  listOptions.EntityValues
                )}
                disabled={modAccessCard.CardStatus !== "AVAILABLE"}
                onChange={(data) => onFieldChange("EntityValue", data)}
                error={t(validationErrors.EntityValue)}
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                indicator="required"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modAccessCard.Password === null ? "" : modAccessCard.Password
                }
                label={t("AccessCardInfo_x_Pwd")}
                disabled={
                  !passwordEnable || modAccessCard.CardType === "ELECTRONIC"
                }
                onChange={(data) => onFieldChange("Password", data)}
                error={t(validationErrors.Password)}
                reserveSpace={false}
                type="password"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modAccessCard.ConfirmPassword === null
                    ? ""
                    : modAccessCard.ConfirmPassword
                }
                label={t("AccessCardInfo_x_ConfirmPassword")}
                disabled={
                  !passwordEnable || modAccessCard.CardType === "ELECTRONIC"
                }
                onChange={(data) => onFieldChange("ConfirmPassword", data)}
                error={t(validationErrors.ConfirmPassword)}
                reserveSpace={false}
                type="password"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4" style={{ marginTop: 25 }}>
              <Button
                type="primary"
                disabled={
                  !passwordEnable || modAccessCard.CardType === "ELECTRONIC"
                }
                content={t("AccessCardInfo_x_ChangePwd")}
                onClick={onChangePasswordClicked}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  accessCard.PIN === ""
                    ? ""
                    : modAccessCard.IssueDate === null
                    ? ""
                    : new Date(modAccessCard.IssueDate).toLocaleString()
                }
                label={t("AccessCardInfo_x_IssueDate")}
                disabled={accessCard.IssueDate !== ""}
                onChange={(data) => onFieldChange("IssueDate", data)}
                error={t(validationErrors.IssueDate)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  accessCard.PIN === ""
                    ? ""
                    : modAccessCard.ActivationTime === null
                    ? ""
                    : new Date(modAccessCard.ActivationTime).toLocaleString()
                }
                label={t("AccessCardList_ActivationTime")}
                disabled={accessCard.ActivationTime !== ""}
                onChange={(data) => onFieldChange("ActivationTime", data)}
                error={t(validationErrors.ActivationTime)}
                reserveSpace={false}
              />
            </div>
          </div>
          <div className="row">
            <div className="col col-lg-2" style={{ float: "left" }}>
              <Button
                className="backButton"
                onClick={handleBack}
                content={t("Back")}
              ></Button>
            </div>
            <div className="col col-lg-10" style={{ textAlign: "right" }}>
              <Button
                disabled={!issueEnabled ? true : modAccessCard.CardStatus !== "AVAILABLE" ? true : false}
                onClick={onIssueClicked}
                content={t("AccessCardInfo_x_IssueCard")}
              ></Button>
              <Button
                disabled={!activateEnable ? true : modAccessCard.CardStatus !== "ISSUED" ? true : false}
                content={t("AccessCardInfo_x_ActivateCard")}
                onClick={onActivateClick}
              ></Button>
              <Button
                disabled={!revokeEnable ? true : (modAccessCard.CardStatus !== "ISSUED" && modAccessCard.CardStatus !== "ACTIVATED") ? true : false}
                content={t("AccessCardInfo_x_RevokeID")}
                onClick={onRevokeClick}
              ></Button>
              <Button
                disabled={!passwordEnable}
                content={t("AccessCardInfo_x_ResetPwd")}
                onClick={onResetPasswordClick}
              ></Button>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
