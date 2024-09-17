import React from "react";
import { Select, Input, DatePicker, Accordion, Checkbox } from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import * as Constants from "../../../JS/Constants";
import PropTypes from "prop-types";
import {
  getCurrentDateFormat,
  getOptionsWithSelect,
} from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import { convertStringToCommonDateFormat } from "../../../JS/Utilities";

VehicleBasicInputs.propTypes = {
  data: PropTypes.object.isRequired,
  modData: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    carriers: PropTypes.array,
    productType: PropTypes.array,
    unitOfWeight: PropTypes.array,
    unitOfVolume: PropTypes.array,
    unitOfDimension: PropTypes.array,
    terminalCodes: PropTypes.array,
    hazardousTankerCategoryOptions: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  onCarrierChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  isBonded: PropTypes.bool.isRequired,
  hazardousEnabled: PropTypes.bool,
};
VehicleBasicInputs.defaultProps = {
  listOptions: {
    carriers: [],
    productType: [],
    unitOfWeight: [],
    unitOfVolume: [],
    unitOfDimension: [],
    terminalCodes: [],
    hazardousTankerCategoryOptions: [],
  },
  isEnterpriseNode: false,
  hazardousEnabled: false,
};
export default function VehicleBasicInputs({
  data,
  modData,
  onFieldChange,
  validationErrors,
  listOptions,
  onDateTextChange,
  onAllTerminalsChange,
  onActiveStatusChange,
  onCarrierChange,
  children,
  isEnterpriseNode,
  modAttributeMetaDataList,
  attributeValidationErrors,
  onAttributeDataChange,
  isBonded,
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
  const [t] = useTranslation();
  // useEffect(() => {
  //   const unitOfDimension = listOptions.unitOfDimension;
  //   unitOfDimension.unshift({ text: t("Common_Select"), value: null });
  // }, [listOptions.unitOfDimension]);
  return (
    // <TranslationConsumer>
    //   {(t) => (
    <>
      <div className="col-12 col-md-6 col-lg-4">
        <Input
          fluid
          value={modData.Code}
          label={t("Vehicle_Code")}
          indicator="required"
          disabled={data.Code !== ""}
          onChange={(data) => onFieldChange("Code", data)}
          error={t(validationErrors.Code)}
          reserveSpace={false}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <Input
          fluid
          value={modData.Name}
          label={t("Vehicle_Name")}
          indicator="required"
          onChange={(data) => onFieldChange("Name", data)}
          error={t(validationErrors.Name, {
            label: t("Vehicle_Name"),
          })}
          reserveSpace={false}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <Input
          fluid
          value={modData.Description === null ? "" : modData.Description}
          label={t(`Vehicle_Desc`)}
          onChange={(data) => onFieldChange("Description", data)}
          error={t(validationErrors.Description)}
          reserveSpace={false}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <Select
          fluid
          placeholder={t("Common_Select")}
          label={t("Vehicle_CarrierCompany")}
          value={modData.CarrierCompanyCode}
          options={listOptions.carriers}
          onChange={(data) => {
            onCarrierChange(data);
          }}
          indicator="required"
          error={t(validationErrors.CarrierCompanyCode)}
          reserveSpace={false}
          disabled={data.Code !== ""}
          search={true}
          noResultsMessage={t("noResultsMessage")}
        />
      </div>
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_ProductType`)}
            value={modData.ProductType}
            options={listOptions.productType}
            onChange={(data) => {
              onFieldChange("ProductType", data);
            }}
            indicator="required"
            error={t(validationErrors.ProductType)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
      ) : (
        ""
      )}
      {children}

      <div className="col-12 col-md-6 col-lg-4">
        <Input
          fluid
          value={modData.LicenseNo === null ? "" : modData.LicenseNo}
          label={t(`Vehicle_LicenseNo`)}
          indicator={
            modData.VehicleType !== Constants.VehicleType.NonFillingVehicle
              ? "required"
              : ""
          }
          onChange={(data) => onFieldChange("LicenseNo", data)}
          error={t(validationErrors.LicenseNo)}
          reserveSpace={false}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <DatePicker
          fluid
          value={
            modData.LicenseNoExpiryDate === null
              ? ""
              : convertStringToCommonDateFormat(modData.LicenseNoExpiryDate)
          }
          displayFormat={getCurrentDateFormat()}
          label={t(`Vehicle_LicenseExpiry`)}
          showYearSelector="true"
          indicator={
            modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ||
            (modData.VehicleType === Constants.VehicleType.NonFillingVehicle &&
              modData.LicenseNo !== null &&
              modData.LicenseNo.trim() !== "")
              ? "required"
              : ""
          }
          disablePast={true}
          onChange={(data) => onFieldChange("LicenseNoExpiryDate", data)}
          onTextChange={(value, error) => {
            onDateTextChange("LicenseNoExpiryDate", value, error);
          }}
          error={t(validationErrors.LicenseNoExpiryDate)}
          reserveSpace={false}
        />
      </div>

      <div className="col-12 col-md-6 col-lg-4">
        <Input
          fluid
          value={modData.RoadTaxNo === null ? "" : modData.RoadTaxNo}
          label={t(`Vehicle_RoadTaxNo`)}
          indicator={
            (modData.RoadTaxNo !== null && modData.RoadTaxNo.trim() !== "") ||
            !isNaN(Date.parse(modData.RoadTaxNoIssueDate)) ||
            !isNaN(Date.parse(modData.RoadTaxNoExpiryDate))
              ? "required"
              : ""
          }
          onChange={(data) => onFieldChange("RoadTaxNo", data)}
          error={t(validationErrors.RoadTaxNo)}
          reserveSpace={false}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <DatePicker
          fluid
          value={
            modData.RoadTaxNoIssueDate === null
              ? ""
              : convertStringToCommonDateFormat(modData.RoadTaxNoIssueDate)
          }
          displayFormat={getCurrentDateFormat()}
          label={t(`Vehicle_RoadTaxIssue`)}
          showYearSelector="true"
          indicator={
            (modData.RoadTaxNo !== null && modData.RoadTaxNo.trim() !== "") ||
            !isNaN(Date.parse(modData.RoadTaxNoIssueDate)) ||
            !isNaN(Date.parse(modData.RoadTaxNoExpiryDate))
              ? "required"
              : ""
          }
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
            modData.RoadTaxNoExpiryDate === null
              ? ""
              : convertStringToCommonDateFormat(modData.RoadTaxNoExpiryDate)
          }
          displayFormat={getCurrentDateFormat()}
          label={t(`Vehicle_RoadTaxExpiry`)}
          showYearSelector="true"
          indicator={
            (modData.RoadTaxNo !== null && modData.RoadTaxNo.trim() !== "") ||
            !isNaN(Date.parse(modData.RoadTaxNoIssueDate)) ||
            !isNaN(Date.parse(modData.RoadTaxNoExpiryDate))
              ? "required"
              : ""
          }
          disablePast={true}
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
          value={modData.Owner === null ? "" : modData.Owner}
          label={t(`Vehicle_owner`)}
          onChange={(data) => onFieldChange("Owner", data)}
          error={t(validationErrors.Owner)}
          reserveSpace={false}
        />
      </div>
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modData.TareWeight === null
                ? ""
                : modData.TareWeight.toLocaleString()
            }
            label={t(`Vehicle_Tareweight`)}
            indicator={
              modData.VehicleType !== Constants.VehicleType.RigidTruck
                ? null
                : "required"
            }
            onChange={(data) => onFieldChange("TareWeight", data)}
            error={t(validationErrors.TareWeight, {
              label: t("Vehicle_Tareweight"),
            })}
            disabled={
              modData.VehicleType !== Constants.VehicleType.RigidTruck
                ? true
                : false
            }
            reserveSpace={false}
          />
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modData.MaxLoadableWeight === null
                ? ""
                : modData.MaxLoadableWeight.toLocaleString()
            }
            label={t(`Vehicle_MaxLoadWeight`)}
            indicator={
              modData.VehicleType !== Constants.VehicleType.RigidTruck
                ? null
                : "required"
            }
            onChange={(data) => onFieldChange("MaxLoadableWeight", data)}
            error={t(validationErrors.MaxLoadableWeight, {
              label: t("Vehicle_MaxLoadWeight"),
            })}
            disabled={
              modData.VehicleType !== Constants.VehicleType.RigidTruck
                ? true
                : false
            }
            reserveSpace={false}
          />
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_UOMWeight`)}
            value={modData.WeightUOM}
            options={listOptions.unitOfWeight}
            onChange={(data) => {
              onFieldChange("WeightUOM", data);
              // onCarrierChange(data);
            }}
            indicator={
              modData.VehicleType !== Constants.VehicleType.RigidTruck
                ? null
                : "required"
            }
            error={t(validationErrors.WeightUOM)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
            disabled={
              modData.VehicleType !== Constants.VehicleType.RigidTruck
                ? true
                : false
            }
          />
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modData.Height === null ? "" : modData.Height.toLocaleString()
            }
            label={t(`Vehicle_height`)}
            onChange={(data) => onFieldChange("Height", data)}
            error={t(validationErrors.Height, {
              label: t("Vehicle_height"),
            })}
            reserveSpace={false}
          />
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modData.Width === null ? "" : modData.Width.toLocaleString()}
            label={t(`Vehicle_Width`)}
            onChange={(data) => onFieldChange("Width", data)}
            error={t(validationErrors.Width, {
              label: t("Vehicle_Width"),
            })}
            reserveSpace={false}
          />
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modData.Length === null ? "" : modData.Length.toLocaleString()
            }
            label={t(`Vehicle_Length`)}
            onChange={(data) => onFieldChange("Length", data)}
            error={t(validationErrors.Length, {
              label: t("Vehicle_Length"),
            })}
            reserveSpace={false}
          />
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_UOMDimemsion`)}
            value={modData.LWHUOM}
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
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modData.MaxLoadableVolume === null
                ? ""
                : modData.MaxLoadableVolume.toLocaleString()
            }
            label={t(`Vehicle_MaxLoadVolume`)}
            onChange={(data) => onFieldChange("MaxLoadableVolume", data)}
            error={t(validationErrors.MaxLoadableVolume)}
            reserveSpace={false}
            disabled={true}
          />
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_UOMVolume`)}
            value={modData.VolumeUOM}
            options={listOptions.unitOfVolume}
            onChange={(data) => {
              onFieldChange("VolumeUOM", data);
              // onCarrierChange(data);
            }}
            error={t(validationErrors.VolumeUOM)}
            reserveSpace={false}
            //search={true}
            disabled={true}
          />
        </div>
      ) : (
        ""
      )}

      {isBonded &&
      modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <div
            className="ui single-input fluid disabled"
            style={{ width: "30%", float: "left" }}
          >
            <div class="ui input-label">
              <span className="input-label-message">
                {t("VehicleInfo_Bonded")}
              </span>
            </div>
            <div className="input-wrap">
              <Checkbox
                //className="LabelEnabled"
                //label={t("ViewShipment_IsForceClosed")}
                onChange={(data) => onFieldChange("IsBonded", data)}
                checked={modData.IsBonded}
              />
            </div>
          </div>
          {modData.IsBonded &&
          modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
            <div style={{ width: "70%", float: "right" }}>
              <Input
                fluid
                value={
                  modData.VehicleCustomsBondNo === null
                    ? ""
                    : modData.VehicleCustomsBondNo
                }
                onChange={(data) => onFieldChange("VehicleCustomsBondNo", data)}
                label={t("VehicleInfo_VehicleCustomsBondNo")}
                reserveSpace={false}
                error={t(validationErrors.VehicleCustomsBondNo)}
                indicator={modData.IsBonded ? "required" : ""}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {modData.IsBonded &&
      modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modData.BondExpiryDate === null
                ? ""
                : convertStringToCommonDateFormat(modData.BondExpiryDate)
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`VehicleInfo_BondExpiryDate`)}
            showYearSelector="true"
            indicator={modData.IsBonded ? "required" : ""}
            disablePast={true}
            onChange={(data) => onFieldChange("BondExpiryDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("BondExpiryDate", value, error);
            }}
            error={t(validationErrors.BondExpiryDate)}
            reserveSpace={false}
          />
        </div>
      ) : (
        ""
      )}
      {hazardousEnabled &&
      modData.VehicleType === Constants.VehicleType.RigidTruck ? (
        <div className="col-12 col-md-6 col-lg-4">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "48%" }}>
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("FP_HazardousCategory")}
                value={
                  modData.HazardousCategory === null
                    ? ""
                    : modData.HazardousCategory
                }
                options={getOptionsWithSelect(
                  listOptions.hazardousTankerCategoryOptions,
                  t("Common_Select")
                )}
                onChange={(data) => onFieldChange("HazardousCategory", data)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.HazardousCategory)}
              />
            </div>
            <div style={{ width: "48%" }}>
              <DatePicker
                fluid
                value={
                  modData.HazardousLicenseExpiry === null
                    ? ""
                    : convertStringToCommonDateFormat(
                        modData.HazardousLicenseExpiry
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
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="col-12 col-md-6 col-lg-4">
        <Select
          fluid
          placeholder={t("Common_Select")}
          label={t("Vehicle_Status")}
          value={modData.Active}
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
          value={modData.Remarks === null ? "" : modData.Remarks}
          label={t("Vehicle_Remarks")}
          onChange={(data) => onFieldChange("Remarks", data)}
          indicator={
            modData.Active !== data.Active ||
            (data.Code !== "" &&
              isBonded &&
              modData.IsBonded &&
              modData.IsBonded !== data.IsBonded)
              ? "required"
              : ""
          }
          error={t(validationErrors.Remarks)}
          reserveSpace={false}
        />
      </div>
      {isEnterpriseNode ? (
        <div className="col-12 col-md-6 col-lg-4">
          <AssociatedTerminals
            terminalList={listOptions.terminalCodes}
            selectedTerminal={modData.TerminalCodes}
            error={t(validationErrors.TerminalCodes)}
            onFieldChange={onFieldChange}
            onCheckChange={onAllTerminalsChange}
          ></AssociatedTerminals>
        </div>
      ) : (
        ""
      )}
      {modData.VehicleType !== Constants.VehicleType.NonFillingVehicle ? (
        <div></div>
      ) : (
        ""
      )}
      {modData.VehicleType === Constants.VehicleType.NonFillingVehicle ? (
        modAttributeMetaDataList.length > 0 ? (
          modAttributeMetaDataList.map((attribute) => (
            <ErrorBoundary>
              <div className="col-12 col-md-12 col-lg-12">
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
                      selectedAttributeList={attribute.attributeMetaDataList}
                      handleCellDataEdit={onAttributeDataChange}
                      attributeValidationErrors={handleValidationErrorFilter(
                        attributeValidationErrors,
                        attribute.TerminalCode
                      )}
                    ></AttributeDetails>
                  </Accordion.Content>
                </Accordion>
              </div>
            </ErrorBoundary>
          ))
        ) : null
      ) : modAttributeMetaDataList.length > 0 ? (
        <div className="col-12 col-md-12 col-lg-12">
          <Accordion>
            <Accordion.Content
              className="attributeAccordian"
              title={t("VEHICLE_Attributes")}
            >
              {modAttributeMetaDataList.length > 0
                ? modAttributeMetaDataList.map((attribute) => (
                    <ErrorBoundary>
                      <div className="col-12 col-md-12 col-lg-12">
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
                      </div>
                    </ErrorBoundary>
                  ))
                : null}
            </Accordion.Content>
          </Accordion>
        </div>
      ) : null}
    </>
    //   )}
    // </TranslationConsumer>
  );
}
