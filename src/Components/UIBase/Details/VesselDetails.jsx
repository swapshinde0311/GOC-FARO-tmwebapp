import React from "react";
import {
  Select,
  Input,
  DatePicker,
  Icon,
  Accordion,
  Checkbox,
} from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { DataTable } from "@scuf/datatable";
import {
  getOptionsWithSelect,
  handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import * as Constants from "../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";

VesselDetails.propTypes = {
  vessel: PropTypes.object.isRequired,
  modVessel: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onCarrierCompanyChange: PropTypes.func.isRequired,
  onLoadingTypeChange: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  listOptions: PropTypes.shape({
    carriers: PropTypes.array,
    vesselType: PropTypes.array,
    productType: PropTypes.array,
    loadingType: PropTypes.array,
    unitOfVolume: PropTypes.array,
    unitOfDimension: PropTypes.array,
    terminalCodes: PropTypes.array,
  }).isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  handleAddCompartment: PropTypes.func.isRequired,
  handleDeleteCompartment: PropTypes.func.isRequired,
  selectedCompRow: PropTypes.array.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  expandedRows: PropTypes.array.isRequired,
  compartmentDetailsPageSize: PropTypes.number.isRequired,
  onCarrierSearchChange: PropTypes.func.isRequired,
};

VesselDetails.defaultProps = {
  listOptions: {
    carriers: [],
    vesselType: [],
    productType: [],
    loadingType: [],
    unitOfVolume: [],
    unitOfDimension: [],
    terminalCodes: [],
  },
  isEnterpriseNode: false,
};
export function VesselDetails({
  vessel,
  modVessel,
  validationErrors,
  onFieldChange,
  onCarrierCompanyChange,
  onLoadingTypeChange,
  onActiveStatusChange,
  listOptions,
  onDateTextChange,
  onAllTerminalsChange,
  handleAddCompartment,
  handleDeleteCompartment,
  selectedCompRow,
  handleCellDataEdit,
  handleRowSelectionChange,
  isEnterpriseNode,
  modAttributeMetaDataList,
  attributeValidationErrors,
  onAttributeDataChange,
  handleCompAttributeCellDataEdit,
  toggleExpand,
  expandedRows,
  compartmentDetailsPageSize,
  onCarrierSearchChange,
}) {
  const [t] = useTranslation();
  const handleTextEdit = (cellData) => {
    let val =
      modVessel.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex][
        cellData.field
      ];
    if (cellData.field === "Capacity" && val !== null && val !== "")
      val = val.toLocaleString();
    return (
      <Input
        fluid
        value={val}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
        disabled={cellData.field === "Code" ? true : false}
      />
    );
  };

  const handleDropdownEdit = (cellData) => {
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <Select
        className="selectDropwdown"
        value={
          modVessel.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex][
            cellData.field
          ]
        }
        fluid
        options={listOptions.unitOfVolume}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
      //   )}
      // </TranslationConsumer>
    );
  };
  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };

  const handleAttributeType = (data) => {
    const attribute = data.rowData;
    const handleAttributeDateValue = (dateval) => {
      var chars = dateval.split("-");
      return new Date(chars[0], chars[1] - 1, chars[2]);
    };
    const convertAttributeDatetoString = (attribute, value) => {
      var Dateval = new Date(value);
      value =
        Dateval.getFullYear() +
        "-" +
        ("0" + (Dateval.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + Dateval.getDate()).slice(-2);
      handleCompAttributeCellDataEdit(attribute, value);
    };
    try {
      return attribute.DataType.toLowerCase() ===
        Constants.DataType.STRING.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.INT.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
          Constants.DataType.FLOAT.toLowerCase() ||
        attribute.DataType.toLowerCase() ===
          Constants.DataType.LONG.toLowerCase() ||
        attribute.DataType.toLowerCase() ===
          Constants.DataType.DOUBLE.toLowerCase() ? (
        <Input
          fluid
          value={
            attribute.AttributeValue === null ||
            attribute.AttributeValue === undefined ||
            attribute.AttributeValue === ""
              ? ""
              : attribute.AttributeValue.toLocaleString()
          }
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.BOOL.toLowerCase() ? (
        <Checkbox
          checked={
            attribute.AttributeValue.toString().toLowerCase() === "true"
              ? true
              : false
          }
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
        ></Checkbox>
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.DATETIME.toLowerCase() ? (
        <DatePicker
          fluid
          value={
            attribute.AttributeValue === null ||
            attribute.AttributeValue === undefined ||
            attribute.AttributeValue === ""
              ? ""
              : handleAttributeDateValue(attribute.AttributeValue)
          }
          disabled={attribute.IsReadonly}
          showYearSelector="true"
          onChange={(value) => convertAttributeDatetoString(data, value)}
          onTextChange={(value) => {
            convertAttributeDatetoString(data, value);
          }}
          reserveSpace={false}
        />
      ) : null;
    } catch (error) {
      console.log("TrailerDetails:Error occured on handleAttributeType", error);
    }
  };

  const handleIsRequiredCompAttributes = (data) => {
    return data.rowData.IsMandatory ? (
      <div>
        <span>{data.rowData.AttributeName}</span>
        <div class="ui red circular empty label badge  circle-padding" />
      </div>
    ) : (
      <div>
        <span>{data.rowData.AttributeName}</span>
      </div>
    );
  };

  const expanderTemplate = (data) => {
    const open =
      expandedRows.findIndex(
        (x) =>
          x.CompartmentSeqNoInTrailer === data.rowData.CompartmentSeqNoInTrailer
      ) >= 0
        ? true
        : false;
    return (
      <div
        onClick={() => toggleExpand(data.rowData, open)}
        className="compartmentIcon gridButtonFontColor"
      >
        <span>{open ? t("Hide_Attributes") : t("View_Attributes")}</span>
        <Icon
          root="common"
          name={open ? "caret-up" : "caret-down"}
          className="margin_l10"
        />
      </div>
    );
  };

  function rowExpansionTemplate(data) {
    return Array.isArray(data.AttributesforUI) &&
      data.AttributesforUI.length > 0 ? (
      <div className="childTable">
        <DataTable
          data={data.AttributesforUI}
          row={1}
          rows={compartmentDetailsPageSize}
        >
          {isEnterpriseNode ? (
            <DataTable.Column
              className="compColHeight"
              key="TerminalCode"
              field="TerminalCode"
              header={t("CompartmentTerminal")}
              editable={false}
            ></DataTable.Column>
          ) : (
            ""
          )}
          <DataTable.Column
            className="compColHeight"
            key="AttributeName"
            header={t("CompartmentAttributeName")}
            renderer={handleIsRequiredCompAttributes}
            editable={false}
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            header={t("CompartmentAttributeValue")}
            renderer={handleAttributeType}
          />
          <DataTable.Pagination />
        </DataTable>
      </div>
    ) : (
      <div className="compartmentIcon">
        <div className="gridButtonAlignLeft">
          {t("CustomerInventory_NoRecordsFound")}
        </div>
      </div>
    );
  }

  return (
    // <TranslationConsumer>
    //   {(t) => (
    <div className="detailsContainer">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modVessel.Code}
            indicator="required"
            disabled={vessel.Code !== ""}
            onChange={(data) => onFieldChange("Code", data)}
            label={t("Vessel_Code")}
            error={t(validationErrors.Code)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modVessel.Name}
            label={t("Vessel_Name")}
            indicator="required"
            onChange={(data) => onFieldChange("Name", data)}
            error={t(validationErrors.Name, {
              label: t("Vessel_Name"),
            })}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modVessel.Description}
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
            value={modVessel.CarrierCompanyCode}
            options={listOptions.carriers}
            onChange={(data) => {
              onCarrierCompanyChange(data);
            }}
            indicator="required"
            error={t(validationErrors.CarrierCompanyCode)}
            reserveSpace={false}
            disabled={vessel.Code !== ""}
            search={true}
            noResultsMessage={t("noResultsMessage")}
            onSearch={onCarrierSearchChange}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vessel_Type`)}
            value={modVessel.VehicleType}
            options={listOptions.vesselType}
            onChange={(data) => {
              onFieldChange("VehicleType", data);
            }}
            indicator="required"
            error={t(validationErrors.VehicleType)}
            reserveSpace={false}
            disabled={vessel.Code !== ""}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_ProductType`)}
            value={modVessel.ProductType}
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
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_LoadingType`)}
            value={modVessel.VehicleTrailers[0].Trailer.LoadingType}
            options={listOptions.loadingType}
            onChange={(data) => {
              onLoadingTypeChange(data);
            }}
            indicator="required"
            error={t(validationErrors.LoadingType)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modVessel.LicenseNo}
            label={t(`Vehicle_LicenseNo`)}
            indicator="required"
            onChange={(data) => onFieldChange("LicenseNo", data)}
            error={t(validationErrors.LicenseNo)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modVessel.LicenseNoExpiryDate === null
                ? ""
                : Utilities.convertStringToCommonDateFormat(
                    modVessel.LicenseNoExpiryDate
                  )
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`Vehicle_LicenseExpiry`)}
            showYearSelector="true"
            indicator="required"
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
            value={modVessel.RegisteredInCountry}
            label={t("Vessel_Country")}
            onChange={(data) => onFieldChange("RegisteredInCountry", data)}
            error={t(validationErrors.RegisteredInCountry, {
              label: t("Vessel_Country"),
            })}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modVessel.Height === null ? "" : modVessel.Height.toLocaleString()
            }
            label={t(`Vehicle_height`)}
            onChange={(data) => onFieldChange("Height", data)}
            error={t(validationErrors.Height, {
              label: t("Vehicle_height"),
            })}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modVessel.Width === null ? "" : modVessel.Width.toLocaleString()
            }
            label={t(`Vehicle_Width`)}
            onChange={(data) => onFieldChange("Width", data)}
            error={t(validationErrors.Width, {
              label: t("Vehicle_Width"),
            })}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modVessel.Length === null ? "" : modVessel.Length.toLocaleString()
            }
            label={t(`Vehicle_Length`)}
            onChange={(data) => onFieldChange("Length", data)}
            error={t(validationErrors.Length, {
              label: t("Vehicle_Length"),
            })}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_UOMDimemsion`)}
            value={modVessel.LWHUOM}
            options={getOptionsWithSelect(
              listOptions.unitOfDimension,
              t("Common_Select")
            )}
            onChange={(data) => {
              onFieldChange("LWHUOM", data);
            }}
            error={t(validationErrors.LWHUOM)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modVessel.MaxLoadableVolume === null
                ? ""
                : modVessel.MaxLoadableVolume.toLocaleString()
            }
            label={t(`Vehicle_MaxLoadVolume`)}
            onChange={(data) => onFieldChange("MaxLoadableVolume", data)}
            error={t(validationErrors.MaxLoadableVolume)}
            reserveSpace={false}
            disabled={true}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Vehicle_UOMVolume`)}
            value={modVessel.VolumeUOM}
            options={listOptions.unitOfVolume}
            onChange={(data) => {
              onFieldChange("VolumeUOM", data);
            }}
            error={t(validationErrors.VolumeUOM)}
            reserveSpace={false}
            disabled={true}
          />
        </div>
        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modVessel.TerminalCodes}
              error={t(validationErrors.TerminalCodes)}
              onFieldChange={onFieldChange}
              onCheckChange={onAllTerminalsChange}
            ></AssociatedTerminals>
          </div>
        ) : (
          ""
        )}
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("Vehicle_Status")}
            value={modVessel.Active}
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
            value={modVessel.Remarks === null ? "" : modVessel.Remarks}
            label={t("Vehicle_Remarks")}
            onChange={(data) => onFieldChange("Remarks", data)}
            indicator={modVessel.Active !== vessel.Active ? "required" : ""}
            error={t(validationErrors.Remarks)}
          />
        </div>
      </div>
      {modAttributeMetaDataList.length > 0
        ? modAttributeMetaDataList.map((attribute) => (
            <ErrorBoundary>
              <Accordion>
                <Accordion.Content
                  className="attributeAccordian"
                  title={
                    isEnterpriseNode
                      ? attribute.TerminalCode + " - " + t("Attributes_Header")
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
            </ErrorBoundary>
          ))
        : null}

      <div className="row compartmentRow">
        <div className="col col-md-8 col-lg-9 col col-xl-9">
          <h4>{t("Trailer_CompartmentInfo")}</h4>
        </div>

        <div className="col col-md-4 col-lg-3 col-xl-3">
          <div className="compartmentIconContainer">
            <div onClick={handleAddCompartment} className="compartmentIcon">
              <div>
                <Icon root="common" name="badge-plus" size="medium" />
              </div>
              <div className="margin_l10">
                <h5 className="font14">{t("TrailerInfo_Add")}</h5>
              </div>
            </div>

            <div
              onClick={handleDeleteCompartment}
              className="compartmentIcon margin_l30"
            >
              <div>
                <Icon root="common" name="delete" size="medium" />
              </div>
              <div className="margin_l10">
                <h5 className="font14">{t("TrailerInfo_Delete")}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row marginRightZero tableScroll">
        <div className="col-12 detailsTable havingchildTable">
          <DataTable
            data={modVessel.VehicleTrailers[0].Trailer.Compartments}
            rowExpansionTemplate={rowExpansionTemplate}
            expandedRows={expandedRows}
            selectionMode="multiple"
            selection={selectedCompRow}
            onSelectionChange={handleRowSelectionChange}
            onEdit={handleCellDataEdit}
            scrollable={true}
            scrollHeight="320px"
          >
            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="Code"
              field="Code"
              header={t("Trailer_CompCode")}
              editFieldType="text"
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight colminWidth"
              key="Description"
              field="Description"
              header={t("Trailer_Desc")}
              editable={true}
              editFieldType="text"
              customEditRenderer={handleTextEdit}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="Capacity"
              field="Capacity"
              header={handleIsRequiredCompartmentCell(
                t("Trailer_CompCapacity")
              )}
              editable={true}
              renderer={(cellData) =>
                cellData.value === null ? "" : cellData.value.toLocaleString()
              }
              editFieldType="text"
              customEditRenderer={handleTextEdit}
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight colminWidth"
              key="UOM"
              field="UOM"
              header={handleIsRequiredCompartmentCell(t("Trailer_UOM"))}
              editable={true}
              editFieldType="text"
              customEditRenderer={handleDropdownEdit}
            ></DataTable.Column>
            <DataTable.Column
              className="expandedColumn"
              initialWidth="200px"
              renderer={expanderTemplate}
            />
          </DataTable>
        </div>
      </div>
    </div>
    //   )}
    // </TranslationConsumer>
  );
}
