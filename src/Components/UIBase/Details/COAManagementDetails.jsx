import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import { DataTable } from "@scuf/datatable";
import { Select, Input, Accordion } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

COAManagementDetails.propTypes = {
  coaManagement: PropTypes.object.isRequired,
  modCOAManagement: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    managementTankCodes: PropTypes.array,
    managementTemplateCodes: PropTypes.array,
    templateParameters: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onTankCodeChange: PropTypes.func.isRequired,
  onTemplateCodeChange: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  pageSize: PropTypes.number,
  handleCellDataEdit: PropTypes.func.isRequired,
};

COAManagementDetails.defaultProps = {
  isEnterpriseNode: false,
  templateParameters: [],
  managementTankCodes: [],
  managementTemplateCodes: []
};



export function COAManagementDetails({
  coaManagement,
  modCOAManagement,
  validationErrors,
  listOptions,
  onFieldChange,
  onTankCodeChange,
  onTemplateCodeChange,
  onActiveStatusChange,
  isEnterpriseNode,
  pageSize,
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
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOAManagement.COACode}
                label={t("COAManagementCode")}
                indicator="required"
                disabled={coaManagement.COACode !== ""}
                onChange={(data) => onFieldChange("COACode", data)}
                error={t(validationErrors.COACode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modCOAManagement.TankCode}
                label={t("COAManagementTankCode")}
                indicator="required"
                options={Utilities.transferListtoOptions(listOptions.managementTankCodes)}
                onChange={(data) => onTankCodeChange(data)}
                error={t(validationErrors.TankCode)}
                disabled={coaManagement.TankCode !== ""}
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
                value={modCOAManagement.TemplateCode}
                label={t("COAManagementTemplateCode")}
                indicator="required"
                options={Utilities.transferListtoOptions(listOptions.managementTemplateCodes)}
                onChange={(data) => onTemplateCodeChange(data)}
                error={t(validationErrors.TemplateCode)}
                disabled={coaManagement.TemplateCode !== ""}
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                text={modCOAManagement.TemplateCode}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOAManagement.BaseProductCode}
                label={t("COAManagementBaseProductCode")}
                disabled={true}
                onChange={(data) => onFieldChange("COAManagementBaseProductCode", data)}
                error={t(validationErrors.BaseProductCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOAManagement.BaseProductName}
                label={t("COAManagementBaseProductName")}
                disabled={true}
                onChange={(data) => onFieldChange("COAManagementBaseProductName", data)}
                error={t(validationErrors.BaseProductName)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCOAManagement.LOTNumber}
                label={t("COAManagementLOTNumber")}
                onChange={(data) => onFieldChange("LOTNumber", data)}
                error={t(validationErrors.LOTNumber)}
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
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <h4>{t("COAManagement_Configuration")}</h4>
              <div className="detailsTable">
                <DataTable
                  data={listOptions.templateParameters}
                  search={true}
                  rows={pageSize}
                  searchPlaceholder={t("LoadingDetailsView_SearchGrid")}>
                  <DataTable.Column
                    className="compColHeight"
                    key="ParameterName"
                    field="ParameterName"
                    header={t("COAManagementDetail_ParameterName")}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="Specification"
                    field="Specification"
                    header={t("COAManagementDetail_Specification")}
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
                    header={t("COAManagementDetail_Method")}
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
                    key="Result"
                    field="Result"
                    header={t("COAManagementDetail_Result")}
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
                    header={t("COAManagementDetail_SortIndex")}
                    editFieldType="text"
                    editable={true}
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(
                        cellData
                      )
                    }
                  ></DataTable.Column>
                  {Array.isArray(listOptions.templateParameters) &&
                    listOptions.templateParameters.length > pageSize ? (
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
