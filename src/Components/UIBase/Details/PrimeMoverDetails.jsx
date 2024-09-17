import React from "react";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { useTranslation } from "@scuf/localization";
import { Accordion, Select, Input, DatePicker } from "@scuf/common";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import {
  getCurrentDateFormat,
  getOptionsWithSelect,
} from "../../../JS/functionalUtilities";

PrimeMoverDetails.propTypes = {
  primeMover: PropTypes.object.isRequired,
  modPrimeMover: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    carriers: PropTypes.array,
    unitOfWeight: PropTypes.array,
    unitOfDimension: PropTypes.array,
    terminalCodes: PropTypes.array,
  }).isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired
};

PrimeMoverDetails.defaultProps = {
  listOptions: {
    carriers: [],
    unitOfWeight: [],
    unitOfDimension: [],
    terminalCodes: [],
  },
  isEnterpriseNode: false
};
export default function PrimeMoverDetails({
  primeMover,
  modPrimeMover,
  attributeValidationErrors,
  onFieldChange,
  validationErrors,
  onDateTextChange,
  onAllTerminalsChange,
  listOptions,
  isEnterpriseNode,
  modAttributeMetaDataList,
  onAttributeDataChange
}) {

  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
      return selectedAttribute.TerminalCode === terminal;
    })
    return attributeValidation.attributeValidationErrors;
  }
  const [t] = useTranslation();
  // useEffect(() => {
  //   const unitOfDimension = listOptions.unitOfDimension;
  //   unitOfDimension.unshift({ text: t("Common_Select"), value: null });
  // }, [listOptions.unitOfDimension]);

  return (
    // <TranslationConsumer>
    //   {(t) => (
    <div className="detailsContainer">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modPrimeMover.Code}
            label={t(`PrimeMover_Code`)}
            indicator="required"
            disabled={primeMover.Code !== ""}
            onChange={(data) => onFieldChange("Code", data)}
            error={t(validationErrors.Code)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modPrimeMover.Name}
            label={t(`PrimeMoverList_Name`)}
            indicator="required"
            onChange={(data) => onFieldChange("Name", data)}
            error={t(validationErrors.Name)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modPrimeMover.Description === null
                ? ""
                : modPrimeMover.Description
            }
            label={t(`PrimeMover_Desc`)}
            onChange={(data) => onFieldChange("Description", data)}
            error={t(validationErrors.Description)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`PrimeMoverList_Carrier`)}
            value={modPrimeMover.CarrierCompanyCode}
            options={listOptions.carriers}
            onChange={(data) => {
              onFieldChange("CarrierCompanyCode", data);
            }}
            indicator="required"
            error={t(validationErrors.CarrierCompanyCode)}
            reserveSpace={false}
            disabled={primeMover.Code !== ""}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modPrimeMover.LicensceNo === null ? "" : modPrimeMover.LicensceNo
            }
            label={t(`PrimeMover_LicenseNo`)}
            onChange={(data) => onFieldChange("LicensceNo", data)}
            error={t(validationErrors.LicensceNo)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modPrimeMover.licenseExpiryDate === null
                ? ""
                : new Date(modPrimeMover.licenseExpiryDate)
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`PrimeMover_LicenseExpiry`)}
            showYearSelector="true"
            disablePast={true}
            onChange={(data) => onFieldChange("licenseExpiryDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("licenseExpiryDate", value, error);
            }}
            error={t(validationErrors.licenseExpiryDate)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modPrimeMover.RoadTaxNo === null ? "" : modPrimeMover.RoadTaxNo
            }
            label={t(`PrimeMover_RoadTaxNo`)}
            onChange={(data) => onFieldChange("RoadTaxNo", data)}
            error={t(validationErrors.RoadTaxNo)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modPrimeMover.RoadTaxNoIssueDate === null
                ? ""
                : new Date(modPrimeMover.RoadTaxNoIssueDate)
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`PrimeMover_RoadTaxIssue`)}
            showYearSelector="true"
            onChange={(data) => onFieldChange("RoadTaxNoIssueDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("RoadTaxNoIssueDate", value, error);
            }}
            error={t(validationErrors.RoadTaxNoIssueDate)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modPrimeMover.RoadTaxNoExpiryDate === null
                ? ""
                : new Date(modPrimeMover.RoadTaxNoExpiryDate)
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`PrimeMover_RoadTaxExpiry`)}
            disablePast={true}
            showYearSelector="true"
            onChange={(data) => onFieldChange("RoadTaxNoExpiryDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("RoadTaxNoExpiryDate", value, error);
            }}
            error={t(validationErrors.RoadTaxNoExpiryDate)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modPrimeMover.TareWeight === null
                ? ""
                : modPrimeMover.TareWeight.toLocaleString()
            }
            label={t(`PrimeMover_Tareweight`)}
            indicator="required"
            onChange={(data) => onFieldChange("TareWeight", data)}
            error={t(validationErrors.TareWeight)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`PrimeMover_UOMWeight`)}
            value={modPrimeMover.TareWeightUOM}
            options={listOptions.unitOfWeight}
            onChange={(data) => {
              onFieldChange("TareWeightUOM", data);
              // onCarrierChange(data);
            }}
            indicator="required"
            error={t(validationErrors.TareWeightUOM)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modPrimeMover.Height === null
                ? ""
                : modPrimeMover.Height.toLocaleString()
            }
            label={t(`PrimeMover_Height`)}
            onChange={(data) => onFieldChange("Height", data)}
            error={t(validationErrors.Height)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modPrimeMover.Width === null
                ? ""
                : modPrimeMover.Width.toLocaleString()
            }
            label={t(`PrimeMover_Width`)}
            onChange={(data) => onFieldChange("Width", data)}
            error={t(validationErrors.Width)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modPrimeMover.Length === null
                ? ""
                : modPrimeMover.Length.toLocaleString()
            }
            label={t(`PrimeMover_Length`)}
            onChange={(data) => onFieldChange("Length", data)}
            error={t(validationErrors.Length)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`PrimeMover_UOMDimemsion`)}
            value={modPrimeMover.LWHUOM}
            options={getOptionsWithSelect(
              listOptions.unitOfDimension,
              t("Common_Select")
            )}
            onChange={(data) => {
              onFieldChange("LWHUOM", data);
              // onCarrierChange(data);
            }}
            error={t(validationErrors.LWHUOM)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modPrimeMover.TerminalCodes}
              error={t(validationErrors.TerminalCodes)}
              onFieldChange={onFieldChange}
              onCheckChange={onAllTerminalsChange}
            ></AssociatedTerminals>
          </div>
        ) : ("")
        }

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("PrimeMover_Status")}
            value={modPrimeMover.Active}
            options={[
              { text: t("ViewShipment_Ok"), value: true },
              { text: t("ViewShipmentStatus_Inactive"), value: false },
            ]}
            onChange={(data) => onFieldChange("Active", data)}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modPrimeMover.Remarks === null ? "" : modPrimeMover.Remarks}
            label={t("Trailer_Remarks")}
            indicator={
              modPrimeMover.Active !== primeMover.Active ? "required" : ""
            }
            onChange={(data) => onFieldChange("Remarks", data)}
            error={t(validationErrors.Remarks)}
          />
        </div>
        {
          modAttributeMetaDataList.length > 0 ?
          modAttributeMetaDataList.map((attire) =>
              <ErrorBoundary>
                <Accordion>
                  <Accordion.Content
                    className="attributeAccordian"
                    title={isEnterpriseNode ? (attire.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                  >
                    <AttributeDetails
                      selectedAttributeList={attire.attributeMetaDataList}
                      handleCellDataEdit={onAttributeDataChange}
                      attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attire.TerminalCode)}
                    ></AttributeDetails>
                  </Accordion.Content>
                </Accordion>
              </ErrorBoundary>
            ) : null

        }
      </div>
    </div>
    //   )}
    // </TranslationConsumer>
  );
}
