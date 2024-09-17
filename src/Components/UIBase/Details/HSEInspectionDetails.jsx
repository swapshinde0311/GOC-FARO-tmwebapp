import React from "react";
import { Select, Input, Button, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import HSEInspectionDrawer from "../Common/HSEInspectionDrawer";
import * as Constants from "./../../../JS/Constants";
import { AttributeDetails } from "../Details/AttributeDetails";
import {
  getOptionsWithSelect,
} from "../../../JS/functionalUtilities";

export function HSEInspectionDetails(
  {
  HSEInspection,
  modHSEInspection,
  modAssociations,
  validationErrors,
  modAttributeList,
  attributeValidationErrors,
  handleCellDataEdit,
  listOptions,
  cardReader,
  railWagon,
  roadTransportationUnit,
  onFieldChange,
  onInspectionItemChange,
  onDetectVehicle,
  onCancelDetect,
  transportationType,
  dispatchReceiptLabel,
  isManualEntry,
  handleUpdate,
  displayTransportationUnit,
  onDispatchReceiptSearchChange,
  handleOpenAttachmentsModal,
  numberOfAttachments,
  onVehicleSearchChange,
  
}) 
{
  let hseInspectionItemTitle;
  if (transportationType === Constants.TransportationType.ROAD || 
    transportationType === Constants.TransportationType.MARINE) {
    hseInspectionItemTitle = modHSEInspection.VehicleCode;
  } else {
    hseInspectionItemTitle = modHSEInspection.DispatchReceiptCode;
  }

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
              <Select
                fluid
                indicator="required"
                placeholder={t("Common_Select")}
                label={t("HSE_TransactionType")}
                value={modHSEInspection.TransactionType}
                onChange={(data) => onFieldChange("TransactionType", data)}
                error={t(validationErrors.TransactionType)}
                options={listOptions.transactionType}
                reserveSpace={false}
                disabled={HSEInspection.OverAllHSEInspectionStatus !== null || isManualEntry === false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            {transportationType === Constants.TransportationType.PIPELINE ? null : (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("PrinterConfig_LocationCode")}
                  value={modHSEInspection.LocationCode}
                  onChange={(data) => onFieldChange("LocationCode", data)}
                  error={t(validationErrors.LocationCode)}
                  options={listOptions.locationCode}
                  reserveSpace={false}
                  disabled={HSEInspection.OverAllHSEInspectionStatus !== null}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            )}
            {transportationType === Constants.TransportationType.ROAD ? (
              <>
                <div className="col-12 col-md-6 col-lg-4">
                  <Select
                    fluid
                    placeholder={t("Common_Select")}
                    label={t("CardReader_Title")}
                    value={cardReader}
                    onChange={(data) => onFieldChange("CardReader", data)}
                    error={t(validationErrors.CardReader)}
                    options={listOptions.cardReaderCode}
                    reserveSpace={false}
                    disabled={
                      HSEInspection.OverAllHSEInspectionStatus !== null || 
                      isManualEntry === false ||
                      listOptions.cardReaderCode.length === 0
                    }
                    noResultsMessage={t("noResultsMessage")}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <Button
                    className="hse-inspection-card-reader-button"
                    content={t("VehHSE_DetectVehicle")}
                    disabled={
                      HSEInspection.OverAllHSEInspectionStatus !== null || 
                      isManualEntry === false ||
                      listOptions.cardReaderCode.length === 0
                    }
                    onClick={onDetectVehicle}
                  />
                  <Button
                    className={
                      (
                        HSEInspection.OverAllHSEInspectionStatus !== null || 
                        isManualEntry === false ||
                        listOptions.cardReaderCode.length === 0
                      ) ? 
                      "hse-inspection-card-reader-button" : "hse-inspection-card-reader-button cancelButton"
                    }
                    content={t("LookUpInfo_Cancel")}
                    disabled={
                      HSEInspection.OverAllHSEInspectionStatus !== null || 
                      isManualEntry === false ||
                      listOptions.cardReaderCode.length === 0
                    }
                    onClick={onCancelDetect}
                  />
                </div>
              </>
            ) : null}
            {transportationType === Constants.TransportationType.ROAD || 
              transportationType === Constants.TransportationType.MARINE ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t(transportationType === Constants.TransportationType.MARINE ? 
                    "Vessel_Code" : "Vehicle_Code")}
                  value={modHSEInspection.VehicleCode}
                  onChange={(data) => onFieldChange("VehicleCode", data)}
                  error={t(validationErrors.VehicleCode)}
                  options={listOptions.vehicleCode}
                  reserveSpace={false}
                  disabled={HSEInspection.OverAllHSEInspectionStatus !== null || isManualEntry === false}
                  noResultsMessage={t("noResultsMessage")}
                  search={true}
                  onSearch={onVehicleSearchChange}
                />
              </div>
            ) : null}
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator={transportationType === Constants.TransportationType.RAIL || 
                  transportationType === Constants.TransportationType.PIPELINE ? "required" : ""}
                placeholder={t("Common_Select")}
                label={t(dispatchReceiptLabel)}
                value={modHSEInspection.DispatchReceiptCode}
                onChange={(data) => onFieldChange("DispatchReceiptCode", data)}
                error={t(validationErrors.DispatchReceiptCode)}
                options={getOptionsWithSelect(
                  listOptions.dispatchReceiptCode,
                  t("Common_Select")
                )}
                reserveSpace={false}
                disabled={HSEInspection.OverAllHSEInspectionStatus !== null || isManualEntry === false}
                noResultsMessage={t("noResultsMessage")}
                search={true}
                onSearch={onDispatchReceiptSearchChange}
              />
            </div>
            {transportationType === Constants.TransportationType.ROAD && 
            displayTransportationUnit === true ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("HSE_TransportationUnit")}
                  value={roadTransportationUnit}
                  onChange={(data) => onFieldChange("transportationUnit", data)}
                  error={t(validationErrors.TransportationUnit)}
                  options={listOptions.roadTransportationUnit}
                  reserveSpace={false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            ) : null}
            {transportationType === Constants.TransportationType.RAIL ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  indicator="required"
                  placeholder={t("Common_Select")}
                  label={t("Report_WagonCode")}
                  value={railWagon}
                  onChange={(data) => onFieldChange("railWagon", data)}
                  error={t(validationErrors.VehicleCode)}
                  options={listOptions.railWagonCode}
                  reserveSpace={false}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            ) : null}
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modHSEInspection.Remarks}
                onChange={(data) => onFieldChange("Remarks", data)}
                label={t("AccessCardInfo_Remarks")}
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
                <Button
                  className="hse-inspection-attachment"
                  type="primary"
                  content={t("Attachments") + (numberOfAttachments > 0 ? ` (${numberOfAttachments})` : "")}
                  onClick={handleOpenAttachmentsModal}
                />
            </div>
          </div>
          {
                        modAttributeList.length > 0 ?
                        modAttributeList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={(t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={handleCellDataEdit}
                                                attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attribute.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null
                    }
          {modAssociations.length === 0 ? null : (
            <HSEInspectionDrawer
              title={hseInspectionItemTitle}
              inspectedItems={modAssociations}
              onChange={onInspectionItemChange}
              isEditable={modHSEInspection.HSEInspectionStatus === 3 || 
                modHSEInspection.HSEInspectionStatus === null}
              handleUpdate={handleUpdate}
              transportationType={transportationType}
              status={modHSEInspection.HSEInspectionStatus}
            />
          )}



        </div>
      )}
    </TranslationConsumer>
  )
}