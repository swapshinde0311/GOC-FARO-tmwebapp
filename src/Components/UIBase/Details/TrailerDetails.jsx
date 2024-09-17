import React from "react";
import {
  Select,
  Input,
  Icon,
  Checkbox,
  DatePicker,
  Accordion,
} from "@scuf/common";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { useTranslation } from "@scuf/localization";
import { AttributeDetails } from "../Details/AttributeDetails";
import {
  getOptionsWithSelect,
  handleIsRequiredCompartmentCell,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";
import * as Constants from "../../../JS/Constants";
import { convertStringToCommonDateFormat } from "../../../JS/Utilities";

TrailerDetails.propTypes = {
  trailer: PropTypes.object.isRequired,
  modTrailer: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    carriers: PropTypes.array,
    productType: PropTypes.array,
    loadingType: PropTypes.array,
    unitOfWeight: PropTypes.array,
    unitOfVolume: PropTypes.array,
    unitOfDimension: PropTypes.array,
    terminalCodes: PropTypes.array,
    hazardousTankerCategoryOptions: PropTypes.array,
  }).isRequired,
  selectedCompRow: PropTypes.array.isRequired,
  expandedRows: PropTypes.array.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  handleAddCompartment: PropTypes.func.isRequired,
  handleDeleteCompartment: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  compartmentDetailsPageSize: PropTypes.number.isRequired,
  onCarrierSearchChange: PropTypes.func.isRequired,
  hazardousEnabled: PropTypes.bool,
};

TrailerDetails.defaultProps = {
  listOptions: {
    carriers: [],
    productType: [],
    loadingType: [],
    unitOfWeight: [],
    unitOfVolume: [],
    unitOfDimension: [],
    terminalCodes: [],
    hazardousTankerCategoryOptions: [],
  },
  isEnterpriseNode: false,
  hazardousEnabled: false,
};
export default function TrailerDetails({
  trailer,
  modTrailer,
  validationErrors,
  attributeValidationErrors,
  listOptions,
  onFieldChange,
  onDateTextChange,
  onAllTerminalsChange,
  selectedCompRow,
  modAttributeMetaDataList,
  expandedRows,
  handleRowSelectionChange,
  handleCellDataEdit,
  onAttributeDataChange,
  handleCompAttributeCellDataEdit,
  handleAddCompartment,
  handleDeleteCompartment,
  isEnterpriseNode,
  toggleExpand,
  compartmentDetailsPageSize,
  onCarrierSearchChange,
  hazardousEnabled,
}) {
  const [t] = useTranslation();

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
    //debugger;
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
    //const open = expandedRows.includes(data.rowData);
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
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable
          data={data.AttributesforUI}
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
          {Array.isArray(data.AttributesforUI) &&
          data.AttributesforUI.length > compartmentDetailsPageSize ? (
            <DataTable.Pagination />
          ) : (
            ""
          )}
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

  const handleTextEdit = (cellData) => {
    let val = modTrailer.Compartments[cellData.rowIndex][cellData.field];
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
    let dropDownOptions = [
      ...listOptions.unitOfVolume,
      ...listOptions.unitOfWeight,
    ];
    return (
      <Select
        className="selectDropwdown"
        placeholder={t("Common_Select")}
        value={modTrailer.Compartments[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownOptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  return (
    //<TranslationConsumer>
    // {(t) => (
    <div className="detailsContainer">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modTrailer.Code}
            label={t("Trailer_Code")}
            indicator="required"
            disabled={trailer.Code !== ""}
            onChange={(data) => onFieldChange("Code", data)}
            error={t(validationErrors.Code)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modTrailer.Name}
            label={t("TrailerList_Name")}
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
              modTrailer.Description === null ? "" : modTrailer.Description
            }
            label={t("Trailer_Desc")}
            onChange={(data) => onFieldChange("Description", data)}
            error={t(validationErrors.Description)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("TrailerList_Carrier")}
            //value={modTrailer.CarrierCompanyCode}
            value={
              modTrailer.CarrierCompanyCode === null
                ? ""
                : modTrailer.CarrierCompanyCode
            }
            options={listOptions.carriers}
            onChange={(data) => {
              onFieldChange("CarrierCompanyCode", data);
            }}
            indicator="required"
            error={t(validationErrors.CarrierCompanyCode)}
            reserveSpace={false}
            disabled={trailer.Code !== ""}
            search={true}
            noResultsMessage={t("noResultsMessage")}
            onSearch={onCarrierSearchChange}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Trailer_ProductType`)}
            value={modTrailer.ProductType}
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
            label={t(`Trailer_LoadingType`)}
            value={modTrailer.LoadingType}
            options={listOptions.loadingType}
            onChange={(data) => {
              onFieldChange("LoadingType", data);
              //onCarrierChange(data);
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
            value={
              modTrailer.TareWeight === null
                ? ""
                : modTrailer.TareWeight.toLocaleString()
            }
            label={t(`Trailer_Tareweight`)}
            indicator="required"
            onChange={(data) => onFieldChange("TareWeight", data)}
            error={t(validationErrors.TareWeight)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modTrailer.MaxLoadableWeight_UI === null
                ? ""
                : modTrailer.MaxLoadableWeight_UI.toLocaleString()
            }
            label={t(`Trailer_MaxLoadWeight`)}
            indicator="required"
            onChange={(data) => onFieldChange("MaxLoadableWeight_UI", data)}
            error={t(validationErrors.MaxLoadableWeight_UI)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Trailer_WeightUOM`)}
            value={modTrailer.WeightUOM}
            options={listOptions.unitOfWeight}
            onChange={(data) => {
              onFieldChange("WeightUOM", data);
              // onCarrierChange(data);
            }}
            indicator="required"
            error={t(validationErrors.WeightUOM)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modTrailer.Height === null
                ? ""
                : modTrailer.Height.toLocaleString()
            }
            label={t(`Trailer_height`)}
            onChange={(data) => onFieldChange("Height", data)}
            error={t(validationErrors.Height)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modTrailer.Width === null ? "" : modTrailer.Width.toLocaleString()
            }
            label={t(`Trailer_Width`)}
            onChange={(data) => onFieldChange("Width", data)}
            error={t(validationErrors.Width)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modTrailer.Length === null
                ? ""
                : modTrailer.Length.toLocaleString()
            }
            label={t(`Trailer_Length`)}
            onChange={(data) => onFieldChange("Length", data)}
            error={t(validationErrors.Length)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t(`Trailer_UOMDimemsion`)}
            value={modTrailer.LWHUOM}
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
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modTrailer.MaxLoadableVolume === null
                ? ""
                : modTrailer.MaxLoadableVolume.toLocaleString()
            }
            label={t(`Trailer_MaxLoadVolume`)}
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
            label={t(`Trailer_VolumeUOM`)}
            value={modTrailer.VolumeUOM}
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
        {hazardousEnabled ? (
          <div className="col-12 col-md-6 col-lg-4">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "48%" }}>
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("FP_HazardousCategory")}
                  value={
                    modTrailer.HazardousCategory === null
                      ? ""
                      : modTrailer.HazardousCategory
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
                    modTrailer.HazardousLicenseExpiry === null
                      ? ""
                      : convertStringToCommonDateFormat(
                          modTrailer.HazardousLicenseExpiry
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
            label={t("Trailer_Status")}
            value={modTrailer.Active}
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
            value={modTrailer.Remarks === null ? "" : modTrailer.Remarks}
            label={t("Trailer_Remarks")}
            onChange={(data) => onFieldChange("Remarks", data)}
            indicator={modTrailer.Active !== trailer.Active ? "required" : ""}
            error={t(validationErrors.Remarks)}
            reserveSpace={false}
          />
        </div>
        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modTrailer.TerminalCodes}
              error={t(validationErrors.TerminalCodes)}
              onFieldChange={onFieldChange}
              onCheckChange={onAllTerminalsChange}
            ></AssociatedTerminals>
          </div>
        ) : (
          ""
        )}
      </div>
      {modAttributeMetaDataList.length > 0
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
            data={modTrailer.Compartments}
            rowExpansionTemplate={rowExpansionTemplate}
            expandedRows={expandedRows}
            scrollable={true}
            scrollHeight="320px"
            selectionMode="multiple"
            selection={selectedCompRow}
            onSelectionChange={handleRowSelectionChange}
          >
            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="Code"
              field="Code"
              header={t("Trailer_CompCode")}
              // rowHeader={true}
              editFieldType="text"
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight colminWidth"
              key="Description"
              field="Description"
              header={t("Trailer_Desc")}
              editable={true}
              // rowHeader={true}
              editFieldType="text"
              customEditRenderer={handleTextEdit}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="Capacity"
              field="Capacity"
              header={handleIsRequiredCompartmentCell(
                t("Trailer_CompCapacity")
              )} //{t("Trailer_CompCapacity")}
              editable={true}
              // rowHeader={true}
              editFieldType="text"
              renderer={(cellData) =>
                cellData.value === null ? "" : cellData.value.toLocaleString()
              }
              customEditRenderer={handleTextEdit}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="UOM"
              field="UOM"
              header={handleIsRequiredCompartmentCell(t("Trailer_UOM"))}
              editable={true}
              // rowHeader={true}
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
    // )}
    //</TranslationConsumer>
  );
}
