import React from "react";
import { Input, Select, Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Constants from "./../../../JS/Constants";
import "../../../CSS/hseConfiguration.css";

HSEConfigurationDetails.propTypes = {
  HSEConfiguration: PropTypes.object.isRequired,
  modHSEConfiguration: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    TransactionType: PropTypes.array,
    TransportationUnit: PropTypes.array,
    TransportationUnitType: PropTypes.array,
    LocationTypeCode: PropTypes.array
  }).isRequired,
  downloadTemplate: PropTypes.func.isRequired,
  uploadToPreview: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isNewHSEConfiguration: PropTypes.bool.isRequired,
  transportationType: PropTypes.string.isRequired,
  fileSelectorValue: PropTypes.string.isRequired
};

export function HSEConfigurationDetails({
  HSEConfiguration,
  modHSEConfiguration,
  modAssociations,
  validationErrors,
  listOptions,
  downloadTemplate,
  uploadToPreview,
  onFieldChange,
  isNewHSEConfiguration,
  transportationType,
  fileSelectorValue
}) {

  const questionTable = {
    English: [],
    Localized: []
  }
  let key = 0;
  for (let question of modAssociations) {
    questionTable.English.push(
      <div className="hse-configuration-list-item" key={key}>
        <div className={`hse-configuration-list-item-severity ${question.Severity === "0" ? 'severity-0' : 'severity-1'}`}></div>
        <div className="hse-configuration-list-item-text">{question.EnglishText}</div>
      </div>
    );
    questionTable.Localized.push(
      <div className="hse-configuration-list-item" key={key}>
        <div className={`hse-configuration-list-item-severity ${question.Severity === "0" ? 'severity-0' : 'severity-1'}`}></div>
        <div className="hse-configuration-list-item-text">{question.LocalizedText}</div>
      </div>
    );
    key += 1;
  }
  
  const inputRef = React.createRef();

  const handleDownloadTemplate = () => {
    downloadTemplate(HSEConfiguration.Questions);
  };

  const handleSelectConfigFile = () => {
    inputRef.current.click()
  };

  const handleUploadToPreview = () => {
    const file = inputRef.current.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      uploadToPreview(fileReader.result)
    }
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div>
          <div className="detailsContainer">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("HSE_TransactionType")}
                  value={modHSEConfiguration.TransactionType}
                  onChange={(data) => onFieldChange("TransactionType", data)}
                  error={t(validationErrors.TransactionType)}
                  options={listOptions.TransactionType}
                  reserveSpace={false}
                  disabled={isNewHSEConfiguration === false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("HSE_TransportationUnit")}
                  value={modHSEConfiguration.TransportationUnit}
                  onChange={(data) => onFieldChange("TransportationUnit", data)}
                  error={t(validationErrors.TransportationUnit)}
                  options={listOptions.TransportationUnit}
                  reserveSpace={false}
                  disabled={isNewHSEConfiguration === false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
              {transportationType === Constants.TransportationType.ROAD || 
                transportationType === Constants.TransportationType.PIPELINE
                ? null 
                : <div className="col-12 col-md-6 col-lg-4">
                  <Select
                    fluid
                    indicator="required"
                    placeholder={t("Common_Select")}
                    label={t("HSE_TransportationUnitType")}
                    value={modHSEConfiguration.TransportationUnitType}
                    onChange={(data) => onFieldChange("TransportationUnitType", data)}
                    error={t(validationErrors.TransportationUnitType)}
                    options={listOptions.TransportationUnitType}
                    reserveSpace={false}
                    disabled={isNewHSEConfiguration === false}
                    noResultsMessage={t("noResultsMessage")}
                  />
                </div>}
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("LocationInfo_LocationType")}
                  value={modHSEConfiguration.LocationTypeCode}
                  onChange={(data) => onFieldChange("LocationTypeCode", data)}
                  error={t(validationErrors.LocationTypeCode)}
                  options={listOptions.LocationTypeCode}
                  reserveSpace={false}
                  disabled={isNewHSEConfiguration === false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modHSEConfiguration.Description}
                  onChange={(data) => onFieldChange("Description", data)}
                  label={t("Entity_Description")}
                  error={t(validationErrors.Description)}
                  reserveSpace={false}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Button
                  className="hse-configuration-button"
                  type="secondary"
                  content={t("HSE_DownloadQuestionsTemplate")}
                  onClick={handleDownloadTemplate}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Button
                  className="hse-configuration-button"
                  type="primary"
                  content={t("HSE_UploadToPreview")}
                  onClick={handleSelectConfigFile}
                />
                <input
                  ref={inputRef}
                  type="file"
                  accept="text/xml"
                  style={{ display: "none" }}
                  onChange={handleUploadToPreview}
                  value={fileSelectorValue}
                ></input>
              </div>
            </div>

            {modAssociations.length > 0 ? (
              <div className="row row-flex-start">
              <div className="col-12 col-md-6">
                <div className="hse-configuration-list">
                  <div className="hse-configuration-list-header">{t("HSE_QuestionsEnglishText")}</div>
                  <div className="hse-configuration-list-content">
                    {questionTable.English}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="hse-configuration-list">
                  <div className="hse-configuration-list-header">{t("HSE_QuestionsLocalizedText")}</div>
                  <div className="hse-configuration-list-content">
                    {questionTable.Localized}
                  </div>
                </div>
              </div>
            </div>
            ) : null}
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}