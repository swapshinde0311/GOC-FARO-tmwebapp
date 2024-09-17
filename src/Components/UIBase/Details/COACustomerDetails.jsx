import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { Select, Input, Button, Icon, Accordion } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";

COACustomerDetails.propTypes = {
  coaCustomer: PropTypes.object.isRequired,
  modCOACustomer: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    availableCustomerParameters: PropTypes.array,
    selectedAvailableCustomerParameters: PropTypes.array,
    associatedCustomerParameters: PropTypes.array,
    selectedAssociatedCustomerParameters: PropTypes.array,
    customerCodes: PropTypes.array,
    finishedProductCodes: PropTypes.array,
    baseProductCodes: PropTypes.array,
    templateCodes: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onFinishedProductCodeChange: PropTypes.func.isRequired,
  onBaseProductCodeChange: PropTypes.func.isRequired,
  onTemplateProductCodeChange: PropTypes.func.isRequired,
  onAvailableCustomerParameterSelection: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  onCustomerParameterAssociation: PropTypes.func.isRequired,
  onAssociatedCustomerParameterSelection: PropTypes.func.isRequired,
  onCustomerParameterDisassociation: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
};
export function COACustomerDetails({
  coaCustomer,
  modCOACustomer,
  validationErrors,
  listOptions,
  onFieldChange,
  onFinishedProductCodeChange,
  onBaseProductCodeChange,
  onTemplateProductCodeChange,
  onAvailableCustomerParameterSelection,
  pageSize,
  onCustomerParameterAssociation,
  onAssociatedCustomerParameterSelection,
  onCustomerParameterDisassociation,
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
              <Select
                fluid
                placeholder="Select"
                value={modCOACustomer.CustomerCode}
                label={t("COACustomerCode")}
                indicator="required"
                options={listOptions.customerCodes}
                onChange={(data) => onFieldChange("CustomerCode", data)}
                error={t(validationErrors.CustomerCode)}
                disabled={coaCustomer.CustomerCode !== ""}
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
                value={modCOACustomer.FinishedProductCode}
                label={t("COACustomerFPCode")}
                indicator="required"
                options={listOptions.finishedProductCodes}
                onChange={(data) => onFinishedProductCodeChange(data)}
                error={t(validationErrors.FinishedProductCode)}
                disabled={coaCustomer.FinishedProductCode !== ""}
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
                value={modCOACustomer.BaseProductCode}
                label={t("COACustomerBPCode")}
                options={getOptionsWithSelect(
                  listOptions.baseProductCodes,
                  t("Common_Select")
                )}
                onChange={(data) => onBaseProductCodeChange(data)}
                error={t(validationErrors.BaseProductCode)}
                disabled={false}
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                text={modCOACustomer.BaseProductCode}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modCOACustomer.TemplateCode}
                label={t("COACustomerTemplateCode")}
                options={getOptionsWithSelect(
                  listOptions.templateCodes,
                  t("Common_Select")
                )}
                onChange={(data) => onTemplateProductCodeChange(data)}
                error={t(validationErrors.TemplateCode)}
                disabled={false}
                multiple={false}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                text={modCOACustomer.TemplateCode}
              />
            </div>
          </div>
          {modAttributeMetaDataList.length > 0
            ? modAttributeMetaDataList.map((attire) => (
                <ErrorBoundary>
                  <Accordion>
                    <Accordion.Content
                      className="attributeAccordian"
                      title={t("Attributes_Header")}
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
              <h4>{t("COACustomer_Configuration")}</h4>
              <div className="detailsTable">
                <DataTable
                  data={listOptions.availableCustomerParameters}
                  search={true}
                  selectionMode="multiple"
                  selection={listOptions.selectedAvailableCustomerParameters}
                  onSelectionChange={onAvailableCustomerParameterSelection}
                  rows={pageSize}
                  searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                >
                  <DataTable.Column
                    className="compColHeight"
                    key="ParameterName"
                    field="ParameterName"
                    header={t("COACustomerDetail_ParameterName")}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="Specification"
                    field="Specification"
                    header={t("COACustomerDetail_Specification")}
                    editFieldType="text"
                    editable={true}
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(cellData)
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="Method"
                    field="Method"
                    header={t("COACustomerDetail_Method")}
                    editFieldType="text"
                    editable={true}
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(cellData)
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="SortIndex"
                    field="SortIndex"
                    header={t("COACustomerDetail_SortIndex")}
                    editFieldType="text"
                    editable={true}
                    customEditRenderer={(cellData) =>
                      handleCustomEditTextBox(cellData)
                    }
                  ></DataTable.Column>
                  {Array.isArray(listOptions.availableCustomerParameters) &&
                  listOptions.availableCustomerParameters.length > pageSize ? (
                    <DataTable.Pagination />
                  ) : (
                    ""
                  )}
                </DataTable>
              </div>
            </div>

            <div className="col-12 col-md-2 col-lg-2">
              <br></br>
              <br></br>
              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  icon={<Icon name="caret-right" root="common" />}
                  content=""
                  iconPosition="right"
                  onClick={onCustomerParameterAssociation}
                  disabled={
                    listOptions.availableCustomerParameters.length > 0
                      ? false
                      : true
                  }
                />
                <br></br>
                <br></br>

                <Button
                  type="primary"
                  icon={<Icon name="caret-left" root="common" />}
                  content=""
                  iconPosition="right"
                  onClick={onCustomerParameterDisassociation}
                  disabled={
                    listOptions.associatedCustomerParameters.length > 0
                      ? false
                      : true
                  }
                />
              </div>
            </div>

            <div className="col-12 col-md-5 col-lg-3">
              <h4>{t("COACustomer_Configuration_AvailableParameter")}</h4>
              <div className="detailsTable">
                <DataTable
                  data={listOptions.associatedCustomerParameters}
                  search={true}
                  selectionMode="multiple"
                  selection={listOptions.selectedAssociatedCustomerParameters}
                  onSelectionChange={onAssociatedCustomerParameterSelection}
                  rows={pageSize}
                  searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                >
                  <DataTable.Column
                    className="compColHeight"
                    key="ParameterName"
                    field="ParameterName"
                    header={t("COACustomerDetail_DisableParameterName")}
                    editFieldType="text"
                  ></DataTable.Column>
                  {Array.isArray(listOptions.associatedCustomerParameters) &&
                  listOptions.associatedCustomerParameters.length > pageSize ? (
                    <DataTable.Pagination />
                  ) : (
                    ""
                  )}
                </DataTable>
              </div>
            </div>

            <div></div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
