import React from "react";
import { Select, Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import * as Utilities from "../../../JS/Utilities";

CustomerRecipeDetails.propTypes = {
  CustomerRecipe: PropTypes.object.isRequired,
  modCustomerRecipe: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  Customers: PropTypes.array,
  terminalCodes: PropTypes.array,
  finishedProducts: PropTypes.array,
  onFieldChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleFinishedProductChange: PropTypes.func.isRequired,
  handleActiveStatusChange: PropTypes.func.isRequired,
};

CustomerRecipeDetails.defaultProps = {
  isEnterpriseNode: false,
};

export function CustomerRecipeDetails({
  CustomerRecipe,
  modCustomerRecipe,
  validationErrors,
  onFieldChange,
  isEnterpriseNode,
  Customers,
  terminalCodes,
  finishedProducts,
  handleCellDataEdit,
  handleFinishedProductChange,
  handleActiveStatusChange,
  handleTerminalChange
}) {
  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={
          modCustomerRecipe.FinishedProduct.FinishedProductItems[
            cellData.rowIndex
          ][cellData.field]
        }
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
                value={modCustomerRecipe.Code}
                label={t("CustomerRecipe_Code")}
                indicator="required"
                disabled={CustomerRecipe.Code !== ""}
                onChange={(data) => onFieldChange("Code", data)}
                error={t(validationErrors.Code)}
                reserveSpace={false}
              />
            </div>
            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  value={modCustomerRecipe.TerminalCode}
                  disabled={CustomerRecipe.TerminalCode !== ""}
                  label={t("CustomerRecipe_AssociatedTerminal")}
                  indicator="required"
                  options={Utilities.transferListtoOptions(terminalCodes)}
                  onChange={(data) => {
                    onFieldChange("TerminalCode", data);
                    handleTerminalChange(data);
                  }}
                  error={t(validationErrors.TerminalCode)}
                  multiple={false}
                  reserveSpace={false}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={
                  modCustomerRecipe.FinishedProduct !== undefined &&
                  modCustomerRecipe.FinishedProduct !== null
                    ? modCustomerRecipe.FinishedProduct.Code
                    : ""
                }
                label={t("CustomerRecipe_FinishedProduct")}
                indicator="required"
                options={finishedProducts}
                onChange={(data) => {
                  onFieldChange("CustomerRecipefinishedProducts", data);
                  handleFinishedProductChange(data);
                }}
                disabled={CustomerRecipe.Code !== ""}
                multiple={false}
                reserveSpace={false}
                search={true}
                error={t(validationErrors.CustomerRecipefinishedProducts)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={modCustomerRecipe.CustomerCodes}
                label={t("CustomerRecipe_AssociatedCustomers")}
                indicator="required"
                options={Customers}
                onChange={(data) => onFieldChange("CustomerCodes", data)}
                multiple={true}
                reserveSpace={false}
                search={true}
                error={t(validationErrors.CustomerCodes)}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                label={t("CustomerRecipe_Status")}
                value={modCustomerRecipe.Status}
                options={[
                  { text: t("ViewShipment_Ok"), value: true },
                  { text: t("ViewShipmentStatus_Inactive"), value: false },
                ]}
                onChange={(data) => handleActiveStatusChange(data)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modCustomerRecipe.Remarks}
                label={t("CustomerRecipe_Remarks")}
                indicator={
                  modCustomerRecipe.Status !== CustomerRecipe.Status
                    ? "required"
                    : ""
                }
                error={t(validationErrors.Remarks)}
                onChange={(data) => onFieldChange("Remarks", data)}
                reserveSpace={false}
              />
            </div>            
          </div>
          <div className="row compartmentRow">
            <div className="col col-md-8 col-lg-9 col col-xl-9">
              <h4>{t("CustomerRecipe_AssociatedBaseProducts")}</h4>
            </div>
          </div>
          <div className="row marginRightZero tableScroll">
            <div className="col-12 detailsTable">
              <DataTable
                data={
                  modCustomerRecipe.FinishedProduct !== undefined &&
                  modCustomerRecipe.FinishedProduct !== null &&
                  modCustomerRecipe.FinishedProduct.FinishedProductItems !==
                    undefined &&
                  modCustomerRecipe.FinishedProduct.FinishedProductItems !==
                    null
                    ? modCustomerRecipe.FinishedProduct.FinishedProductItems
                    : []
                }
                scrollable={true}
                scrollHeight="320px"
              >
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="BaseProductCode"
                  renderer={(cellData) => {
                    if (
                      cellData.rowData.BaseProductCode !== null &&
                      cellData.rowData.BaseProductCode !== undefined &&
                      cellData.rowData.BaseProductCode !== "" &&
                      cellData.rowData.Version !== 0
                    ) {
                      return cellData.rowData.BaseProductCode;
                    } else {
                      return cellData.rowData.AdditiveCode;
                    }
                  }}
                  header={t("CustomerRecipe_BaseProductCode")}
                  editFieldType="text"
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="IsAdditive"
                  header={t("CustomerRecipe_IsAdditive")}
                  renderer={(cellData) => {
                    if (
                      cellData.rowData.BaseProductCode !== null &&
                      cellData.rowData.BaseProductCode !== undefined &&
                      cellData.rowData.BaseProductCode !== "" &&
                      cellData.rowData.Version !== 0
                    ) {
                      return "N";
                    } else {
                      return "Y";
                    }
                  }}
                  editFieldType="text"
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="Quantity"
                  field="Quantity"
                  header={t("CustomerRecipe_AbsoluteNumber")}
                  editable={true}
                  editFieldType="text"
                  // renderer={(cellData) => intDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
