import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import { DataTable } from "@scuf/datatable";
import { Select, Input, Button, Icon, Accordion } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import {
  getOptionsWithSelect,
} from "../../../JS/functionalUtilities";

COATemplateDetails.propTypes = {
  coaTemplate: PropTypes.object.isRequired,
  modCOATemplate: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    templateTankCodes: PropTypes.array,
    templateBaseProductCodes: PropTypes.array,
    templateUseType: PropTypes.array,
    templateFromTemplate: PropTypes.array,
    availableTemplates: PropTypes.array,
    selectedAvailableTemplates: PropTypes.array,
    associatedTemplates: PropTypes.array,
    selectedAssociatedTemplates: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onTankCodeChange: PropTypes.func.isRequired,
  onFromTemplateChange: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  onAvailableTemplateSelection: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  onTemplateAssociation: PropTypes.func.isRequired,
  onAssociatedTemplateSelection: PropTypes.func.isRequired,
  onTemplateDisassociation: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
};

COATemplateDetails.defaultProps = {
  isEnterpriseNode: false,
  availableTemplates: [],
  selectedAvailableTemplates: [],
  associatedTemplates: [],
  selectedAssociatedTemplates: []
};



export function COATemplateDetails({
  coaTemplate,
  modCOATemplate,
  validationErrors,
  listOptions,
  onFieldChange,
  onTankCodeChange,
  onFromTemplateChange,
  onActiveStatusChange,
  isEnterpriseNode,
  onAvailableTemplateSelection,
  pageSize,
  onTemplateAssociation,
  onAssociatedTemplateSelection,
  onTemplateDisassociation,
  handleCellDataEdit,
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
  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={cellData.rowData[cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row" style={{"align-items":"initial"}}>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOATemplate.COATemplateCode}
                label={t("COATemplateCode")}
                indicator="required"
                disabled={coaTemplate.COATemplateCode !== ""}
                onChange={(data) => onFieldChange("COATemplateCode", data)}
                error={t(validationErrors.COATemplateCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modCOATemplate.TankCode}
                label={t("COATemplateTankCode")}
                indicator="required"
                options={Utilities.transferListtoOptions(listOptions.templateTankCodes)}
                onChange={(data) => onTankCodeChange(data)}
                error={t(validationErrors.TankCode)}
                disabled={coaTemplate.TankCode !== null}
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOATemplate.BaseProductCode}
                label={t("COATemplateBaseProductCode")}
                disabled={true}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modCOATemplate.UseType}
                label={t("COATemplateUseType")}
                indicator="required"
                options={Utilities.transferListtoOptions(listOptions.templateUseType)}
                onChange={(data) => onFieldChange("UseType", data)}
                error={t(validationErrors.UseType)}
                disabled={coaTemplate.UseType !== null}
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
                value={modCOATemplate.FromTemplate}
                label={t("COAFromTemplate")}
                options={getOptionsWithSelect(
                  Utilities.transferListtoOptions(listOptions.templateFromTemplate),
                  t("Common_Select")
                )}
                onChange={(data) => onFromTemplateChange(data)}
                disabled={false}
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
                label={t("COATemplate_IsActive")}
                value={modCOATemplate.IsActive}
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
                value={modCOATemplate.Remarks === null ? "" : modCOATemplate.Remarks}
                label={t("COATemplate_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modCOATemplate.IsActive !== coaTemplate.IsActive ? "required" : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
          </div>
          {modAttributeMetaDataList.length > 0
            ? modAttributeMetaDataList.map((attire) => (
              <ErrorBoundary>
                <Accordion>
                  <Accordion.Content
                    className="attributeAccordian"
                    title={
                       t("Attributes_Header")
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
          <div className="row" style={{"align-items":"initial"}}>
            <div className="col-12 col-md-5 col-lg-7">
              <h4>{t("COATemplate_Configuration")}</h4>
              <div className="detailsTable">
                <DataTable
                  data={listOptions.availableTemplates}
                  search={true}
                  selectionMode="multiple"
                  selection={listOptions.selectedAvailableTemplates}
                  onSelectionChange={onAvailableTemplateSelection}
                  rows={pageSize}
                  searchPlaceholder={t("LoadingDetailsView_SearchGrid")}>
                  <DataTable.Column
                    className="compColHeight"
                    key="ParameterName"
                    field="ParameterName"
                    header={t("COATemplateDetail_ParameterName")}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="Specification"
                    field="Specification"
                    header={t("COATemplateDetail_Specification")}
                    editFieldType="text"
                    editable={true}
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(
                        cellData
                      )
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="Method"
                    field="Method"
                    header={t("COATemplateDetail_Method")}
                    editFieldType="text"
                    editable={true}
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(
                        cellData
                      )
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="SortIndex"
                    field="SortIndex"
                    header={t("COATemplateDetail_SortIndex")}
                    editFieldType="text"
                    editable={true}
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(
                        cellData
                      )
                    }
                  ></DataTable.Column>
                  {(Array.isArray(listOptions.availableTemplates) &&
                    listOptions.availableTemplates.length > pageSize) ? (
                    <DataTable.Pagination />
                  ) : (
                    ""
                  )
                  }
                </DataTable>
              </div>
            </div>

            <div className="col-12 col-md-2 col-lg-2">
              <br></br><br></br>
              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  icon={<Icon name="caret-right" root="common" />}
                  content=""
                  iconPosition="right"
                  onClick={onTemplateAssociation}
                  disabled={listOptions.availableTemplates.length > 0 ? false : true}
                /><br></br><br></br>

                <Button
                  type="primary"
                  icon={<Icon name="caret-left" root="common" />}
                  content=""
                  iconPosition="right"
                  onClick={onTemplateDisassociation}
                  disabled={listOptions.associatedTemplates.length > 0 ? false : true}
                />

              </div>
            </div>

            <div className="col-12 col-md-5 col-lg-3">
              <h4>{t("COATemplate_Configuration_AvailableParameter")}</h4>
              <div className="detailsTable">
                <DataTable
                  data={listOptions.associatedTemplates}
                  search={true}
                  selectionMode="multiple"
                  selection={listOptions.selectedAssociatedTemplates}
                  onSelectionChange={onAssociatedTemplateSelection}
                  rows={pageSize}
                  searchPlaceholder={t("LoadingDetailsView_SearchGrid")}>
                  <DataTable.Column
                    className="compColHeight"
                    key="ParameterName"
                    field="ParameterName"
                    header={t("COATemplateDetail_DisableParameterName")}
                  ></DataTable.Column>
                  {Array.isArray(listOptions.associatedTemplates) &&
                    (listOptions.associatedTemplates.length > pageSize) ? (
                    <DataTable.Pagination />) : ("")}
                </DataTable>
              </div>
            </div>

            <div>

            </div>

          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
