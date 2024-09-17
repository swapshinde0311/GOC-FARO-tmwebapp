import React from "react";
import {
  Select,
  Input,
  Icon,
  Accordion,
  DatePicker,
  Checkbox,
} from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";

import VehicleBasicFields from "./VehicleBasicFields";
import { DataTable } from "@scuf/datatable";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import * as Constants from "../../../JS/Constants";

RigidTruckDetails.propTypes = {
  rigidTruck: PropTypes.object.isRequired,
  modRigidTruck: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
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
  onFieldChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  selectedCompRow: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddCompartment: PropTypes.func.isRequired,
  handleDeleteCompartment: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  onCarrierChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  modVehicleAttributeMetaDataList: PropTypes.array.isRequired,
  vehicleAttributeValidationErrors: PropTypes.array.isRequired,
  onVehicleAttributeDataChange: PropTypes.func.isRequired,
  modVehicleTrailerAttributeMetaDataList: PropTypes.array.isRequired,
  vehicleTrailerAttributeValidationErrors: PropTypes.array.isRequired,
  onVehicleTrailerAttributeDataChange: PropTypes.func.isRequired,
  modTrailerAttributeMetaDataList: PropTypes.array.isRequired,
  trailerAttributeValidationErrors: PropTypes.array.isRequired,
  onTrailerAttributeDataChange: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  expandedRows: PropTypes.array.isRequired,
  compartmentDetailsPageSize: PropTypes.number.isRequired,
  isBonded: PropTypes.bool.isRequired,
  hazardousEnabled: PropTypes.bool,
};

RigidTruckDetails.defaultProps = {
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
export default function RigidTruckDetails({
  rigidTruck,
  modRigidTruck,
  validationErrors,
  onFieldChange,
  onDateTextChange,
  onAllTerminalsChange,
  onActiveStatusChange,
  onCarrierChange,
  selectedCompRow,
  listOptions,
  handleAddCompartment,
  handleCellDataEdit,
  handleDeleteCompartment,
  handleRowSelectionChange,
  isEnterpriseNode,
  modVehicleAttributeMetaDataList,
  vehicleAttributeValidationErrors,
  onVehicleAttributeDataChange,
  modVehicleTrailerAttributeMetaDataList,
  vehicleTrailerAttributeValidationErrors,
  onVehicleTrailerAttributeDataChange,
  handleCompAttributeCellDataEdit,
  toggleExpand,
  expandedRows,
  compartmentDetailsPageSize,
  modTrailerAttributeMetaDataList,
  trailerAttributeValidationErrors,
  onTrailerAttributeDataChange,
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
  const handleTextEdit = (cellData) => {
    let val =
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex][
        cellData.field
      ];
    if (cellData.field === "Capacity" && val !== null && val !== "")
      val = val.toLocaleString();
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <Input
        fluid
        value={val}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
        //error={t(validationErrors.Description)}
        disabled={cellData.field === "Code" ? true : false}
      />
      //   )}
      // </TranslationConsumer>
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
        value={
          modRigidTruck.VehicleTrailers[0].Trailer.Compartments[
            cellData.rowIndex
          ][cellData.field]
        }
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
          onChange={(value) => {
            convertAttributeDatetoString(data, value);
          }}
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
        <VehicleBasicFields
          data={rigidTruck}
          modData={modRigidTruck}
          onFieldChange={onFieldChange}
          onDateTextChange={onDateTextChange}
          listOptions={listOptions}
          validationErrors={validationErrors}
          onAllTerminalsChange={onAllTerminalsChange}
          onCarrierChange={onCarrierChange}
          onActiveStatusChange={onActiveStatusChange}
          isEnterpriseNode={isEnterpriseNode}
          attributeValidationErrors={vehicleAttributeValidationErrors}
          modAttributeMetaDataList={modVehicleAttributeMetaDataList}
          onAttributeDataChange={onVehicleAttributeDataChange}
          isBonded={isBonded}
          hazardousEnabled={hazardousEnabled}
        >
          <div className="col-12 col-md-6 col-lg-4">
            <Select
              fluid
              placeholder={t("Common_Select")}
              label={t(`Vehicle_LoadingType`)}
              value={modRigidTruck.VehicleTrailers[0].Trailer.LoadingType}
              options={listOptions.loadingType}
              onChange={(data) => {
                onFieldChange("LoadingType", data);
              }}
              indicator="required"
              error={t(validationErrors.LoadingType)}
              reserveSpace={false}
              search={true}
              noResultsMessage={t("noResultsMessage")}
            />
          </div>
        </VehicleBasicFields>

        {modTrailerAttributeMetaDataList.length > 0 ? (
          <div className="col-12 col-md-12 col-lg-12">
            <Accordion>
              <Accordion.Content
                className="attributeAccordian"
                title={t("TRAILER_Attributes")}
              >
                {modTrailerAttributeMetaDataList.length > 0
                  ? modTrailerAttributeMetaDataList.map((attribute) => (
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
                                handleCellDataEdit={
                                  onTrailerAttributeDataChange
                                }
                                attributeValidationErrors={handleValidationErrorFilter(
                                  trailerAttributeValidationErrors,
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

        {modVehicleTrailerAttributeMetaDataList.length > 0 ? (
          <div className="col-12 col-md-12 col-lg-12">
            <Accordion>
              <Accordion.Content
                className="attributeAccordian"
                title={t("VEHICLETRAILER_Attributes")}
              >
                {modVehicleTrailerAttributeMetaDataList.length > 0
                  ? modVehicleTrailerAttributeMetaDataList.map((attribute) => (
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
                                handleCellDataEdit={
                                  onVehicleTrailerAttributeDataChange
                                }
                                attributeValidationErrors={handleValidationErrorFilter(
                                  vehicleTrailerAttributeValidationErrors,
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
      </div>

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
            data={modRigidTruck.VehicleTrailers[0].Trailer.Compartments}
            rowExpansionTemplate={rowExpansionTemplate}
            expandedRows={expandedRows}
            selectionMode="multiple"
            selection={selectedCompRow}
            onSelectionChange={handleRowSelectionChange}
            scrollable={true}
            scrollHeight="320px"
            // onEdit={handleCellDataEdit}
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
              header={t("Trailer_CompCapacity")}
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
              header={t("Trailer_UOM")}
              editable={true}
              //rowHeader={true}
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
