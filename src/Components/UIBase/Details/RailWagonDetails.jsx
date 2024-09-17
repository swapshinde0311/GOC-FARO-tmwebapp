import React from "react";
import { DatePicker, Input, Select, Checkbox, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import * as Utilities from "../../../JS/Utilities";

RailWagonDetails.propTypes = {
  railWagon: PropTypes.object.isRequired,
  modRailWagon: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
    carrierCompanyOptions: PropTypes.array,
    railWagonCategoryOptions: PropTypes.array,
    productTypeOptions: PropTypes.array,
    loadingTypeOptiongs: PropTypes.array,
    volumeUOMOptions: PropTypes.array,
    weightUOMOptions: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onCheckChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
};

RailWagonDetails.defaultProps = {
  isEnterpriseNode: false,
};

export function RailWagonDetails({
  railWagon,
  modRailWagon,
  validationErrors,
  listOptions,
  onFieldChange,
  onCheckChange,
  onAllTerminalsChange,
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
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailWagon.Code}
                indicator="required"
                disabled={railWagon.Code !== ""}
                onChange={(data) => onFieldChange("Code", data)}
                label={t("RailWagonConfigurationDetails_RailWagonCode")}
                error={t(validationErrors.Code)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailWagon.Name}
                indicator="required"
                onChange={(data) => onFieldChange("Name", data)}
                label={t("RailWagonConfigurationDetails_RailWagonName")}
                error={t(validationErrors.Name)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailWagon.Description}
                onChange={(data) => onFieldChange("Description", data)}
                label={t("RailWagonConfigurationDetails_Description")}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("RailWagonConfigurationDetails_Select")}
                indicator="required"
                value={modRailWagon.CarrierCompanyCode}
                options={listOptions.carrierCompanyOptions}
                onChange={(data) => onFieldChange("CarrierCompanyCode", data)}
                label={t("RailWagonConfigurationDetails_CarrierCompany")}
                error={t(validationErrors.CarrierCompanyCode)}
                disabled={railWagon.Code !== ""}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("RailWagonConfigurationDetails_Select")}
                indicator="required"
                value={modRailWagon.RailWagonCategory}
                options={listOptions.railWagonCategoryOptions}
                onChange={(data) => onFieldChange("RailWagonCategory", data)}
                label={t("RailWagonConfigurationDetails_RailWagonCategory")}
                error={t(validationErrors.RailWagonCategory)}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("RailWagonConfigurationDetails_Select")}
                indicator="required"
                value={modRailWagon.ProductType}
                options={listOptions.productTypeOptions}
                onChange={(data) => onFieldChange("ProductType", data)}
                label={t("RailWagonConfigurationDetails_ProductType")}
                error={t(validationErrors.ProductType)}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("RailWagonConfigurationDetails_Select")}
                indicator="required"
                value={modRailWagon.LoadingType}
                options={listOptions.loadingTypeOptiongs}
                onChange={(data) => onFieldChange("LoadingType", data)}
                label={t("RailWagonConfigurationDetails_LoadingType")}
                error={t(validationErrors.LoadingType)}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modRailWagon.NoOfSeals === null
                    ? ""
                    : modRailWagon.NoOfSeals.toLocaleString()
                }
                onChange={(data) => onFieldChange("NoOfSeals", data)}
                label={t("Trailer_NoOfSeals")}
                error={t(validationErrors.NoOfSeals)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modRailWagon.LicenseExpiryDate === null
                    ? ""
                    : Utilities.convertStringToCommonDateFormat(
                        modRailWagon.LicenseExpiryDate
                      )
                }
                label={t("RailWagonConfigurationDetails_LicenseExpiryDate")}
                type="date"
                disablePast={true}
                indicator="required"
                onChange={(data) => onFieldChange("LicenseExpiryDate", data)}
                displayFormat={getCurrentDateFormat()}
                error={t(validationErrors.LicenseExpiryDate)}
                reserveSpace={false}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                value={
                  modRailWagon.TareWeight === null
                    ? "0"
                    : modRailWagon.TareWeight
                }
                onChange={(data) => onFieldChange("TareWeight", data)}
                label={t("RailWagonConfigurationDetails_TareWeight")}
                error={t(validationErrors.TareWeight)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modRailWagon.MaxLoadableVolume === null
                    ? ""
                    : modRailWagon.MaxLoadableVolume
                }
                label={t("RailWagonConfigurationDetails_MaxSFL")}
                disabled={true}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                value={
                  modRailWagon.MaxLoadableWeight === null
                    ? ""
                    : modRailWagon.MaxLoadableWeight
                }
                onChange={(data) => onFieldChange("MaxLoadableWeight", data)}
                label={t("RailWagonConfigurationDetails_MaxLoadableWeight")}
                error={t(validationErrors.MaxLoadableWeight)}
                disabled={railWagon.Code ? true : false}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("RailWagonConfigurationDetails_Select")}
                value={modRailWagon.VolumeUOM}
                options={listOptions.volumeUOMOptions}
                onChange={(data) => onFieldChange("VolumeUOM", data)}
                label={t("RailWagonConfigurationDetails_UnitOfMeasure")}
                error={t(validationErrors.VolumeUOM)}
                disabled={true}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                placeholder={t("RailWagonConfigurationDetails_Select")}
                value={modRailWagon.WeightUOM}
                options={listOptions.weightUOMOptions}
                onChange={(data) => onFieldChange("WeightUOM", data)}
                label={t("RailWagonConfigurationDetails_UnitforWeight")}
                error={t(validationErrors.WeightUOM)}
                disabled={true}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4 checkboxSelect">
              <Checkbox
                label={t("RailWagonConfigurationDetails_OnSite")}
                checked={modRailWagon.InUse}
                onChange={(checked) => onCheckChange("InUse", checked)}
                disabled={true}
              ></Checkbox>
              <Checkbox
                label={t("RailWagonConfigurationDetails_Crippled")}
                checked={modRailWagon.Crippled}
                onChange={(checked) => onCheckChange("Crippled", checked)}
                disabled={railWagon.Code ? false : true}
              ></Checkbox>
              <Checkbox
                label={t("RailWagonConfigurationDetails_Abandoned")}
                checked={modRailWagon.Abandoned}
                onChange={(checked) => onCheckChange("Abandoned", checked)}
                disabled={true}
              ></Checkbox>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailWagon.RemarksForCripple}
                onChange={(data) => onFieldChange("RemarksForCripple", data)}
                label={t("RailWagonConfigurationDetails_RemarksForCripple")}
                indicator={modRailWagon.Crippled ? "required" : ""}
                error={t(validationErrors.RemarksForCripple)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("RailWagonConfigurationDetails_Select")}
                label={t("Cust_Status")}
                value={modRailWagon.Active}
                options={[
                  {
                    text: t("RailWagonConfigurationDetails_Active"),
                    value: true,
                  },
                  {
                    text: t("RailWagonConfigurationDetails_Inactive"),
                    value: false,
                  },
                ]}
                onChange={(data) => onFieldChange("Active", data)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailWagon.Remarks}
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modRailWagon.Active !== railWagon.Active ? "required" : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <AssociatedTerminals
                  terminalList={listOptions.terminalCodes}
                  selectedTerminal={modRailWagon.TerminalCodes}
                  error={validationErrors.TerminalCodes}
                  onFieldChange={onFieldChange}
                  onCheckChange={onAllTerminalsChange}
                ></AssociatedTerminals>
              </div>
            ) : (
              ""
            )}
            <div className="col-12 col-md-12 col-lg-12">
              {modAttributeMetaDataList.length > 0
                ? modAttributeMetaDataList.map((attribute) => (
                    <ErrorBoundary>
                      <Accordion>
                        <Accordion.Content
                          className="attributeAccordian"
                          title={
                            isEnterpriseNode
                              ? attribute.TerminalCode +
                                " - " +
                                t("Attributes_Header")
                              : t("Attributes_Header")
                          }
                        >
                          <AttributeDetails
                            selectedAttributeList={
                              attribute.attributeMetaDataList
                            }
                            handleCellDataEdit={onAttributeDataChange}
                            attributeValidationErrors={handleValidationErrorFilter(
                              attributeValidationErrors,
                              attribute.TerminalCode
                            )}
                          ></AttributeDetails>
                        </Accordion.Content>
                      </Accordion>
                    </ErrorBoundary>
                  ))
                : null}
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
