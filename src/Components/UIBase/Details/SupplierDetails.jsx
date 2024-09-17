import React from "react";
import { Accordion, Select, Icon, Input } from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
//import * as Constants from "./../../../JS/Constants";
import { DataTable } from "@scuf/datatable";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

SupplierDetails.propTypes = {
  supplier: PropTypes.object.isRequired,
  modSupplier: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    transportationTypes: PropTypes.array,
    terminalCodes: PropTypes.array,
    customerOptions: PropTypes.array,
  }).isRequired,

  onFieldChange: PropTypes.func.isRequired,
  //compartmentColumns: PropTypes.array.isRequired,
  handleDCHCellDataEdit: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  selectedAssociations: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  modDCHAttributes: PropTypes.array.isRequired,
  isDCHEnabled: PropTypes.bool.isRequired,
  dchAttributeValidationErrors: PropTypes.object.isRequired,
};

SupplierDetails.defaultProps = {
  listOptions: {
    transportationTypes: [],
    terminalCodes: [],
  },
  isEnterpriseNode: false,
  isDCHEnabled: false,
};

export default function SupplierDetails({
  supplier,
  modSupplier,
  modDCHAttributes,
  modAssociations,
  validationErrors,
  listOptions,
  onFieldChange,
  onAllTerminalsChange,
  selectedAssociations,
  handleRowSelectionChange,
  handleCellDataEdit,
  handleAddAssociation,
  handleDeleteAssociation,
  onActiveStatusChange,
  isEnterpriseNode,
  modAttributeMetaDataList,
  attributeValidationErrors,
  onAttributeDataChange,
  isDCHEnabled,
  dchAttributeValidationErrors,
  handleDCHCellDataEdit,
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
  const handleCustomEditDropDown = (cellData, dropDownoptions) => {
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <Select
        className="selectDropwdown"
        placeholder="Select"
        value={modAssociations[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownoptions}
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
  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modAssociations[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  return (
    // <TranslationConsumer>
    //   {(t) => (
    <div className="detailsContainer">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modSupplier.Code}
            label={t("Supplier_Code")}
            indicator="required"
            disabled={supplier.Code !== ""}
            onChange={(data) => onFieldChange("Code", data)}
            error={t(validationErrors.Code)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modSupplier.Name}
            label={t("Supplier_Name")}
            indicator="required"
            onChange={(data) => onFieldChange("Name", data)}
            error={t(validationErrors.Name)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder="Select"
            multiple={true}
            label={t("Vehicle_Transport")}
            value={modSupplier.TransportationTypes}
            options={listOptions.transportationTypes}
            onChange={(data) => {
              onFieldChange("TransportationTypes", data);
            }}
            indicator="required"
            error={t(validationErrors.TransportationTypes)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modSupplier.Description === null ? "" : modSupplier.Description
            }
            onChange={(data) => onFieldChange("Description", data)}
            label={t("Supplier_Description")}
            error={t(validationErrors.Description)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modSupplier.ContactPerson === null
                ? ""
                : modSupplier.ContactPerson
            }
            onChange={(data) => onFieldChange("ContactPerson", data)}
            label={t("Supplier_ContactPerson")}
            error={t(validationErrors.ContactPerson)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modSupplier.Address === null ? "" : modSupplier.Address}
            onChange={(data) => onFieldChange("Address", data)}
            label={t("Supplier_Address")}
            error={t(validationErrors.Address)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modSupplier.Mobile === null ? "" : modSupplier.Mobile}
            label={t("Supplier_Mobile")}
            onChange={(data) => onFieldChange("Mobile", data)}
            error={t(validationErrors.Mobile)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modSupplier.Phone === null ? "" : modSupplier.Phone}
            label={t("Supplier_PhNum")}
            onChange={(data) => onFieldChange("Phone", data)}
            error={t(validationErrors.Phone)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modSupplier.Email === null ? "" : modSupplier.Email}
            label={t("Supplier_Email")}
            onChange={(data) => onFieldChange("Email", data)}
            error={t(validationErrors.Email)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("FinishedProductInfo_Select")}
            label={t("Cust_Status")}
            value={modSupplier.Status}
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
            value={modSupplier.Remarks === null ? "" : modSupplier.Remarks}
            label={t("Cust_Remarks")}
            onChange={(data) => onFieldChange("Remarks", data)}
            indicator={modSupplier.Status !== supplier.Status ? "required" : ""}
            error={t(validationErrors.Remarks)}
            reserveSpace={false}
          />
        </div>
        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modSupplier.TerminalCodes}
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
      {isDCHEnabled && modDCHAttributes && modDCHAttributes.length > 0 ? (
        <ErrorBoundary>
          <Accordion>
            <Accordion.Content
              className="attributeAccordian"
              title={t("External_System_Fields")}
            >
              {modDCHAttributes.map((dchAttribute) => (
                //console.log("dchAttributeValidationErrors[dchAttribute.EntityName]", dchAttribute.ID.toString()),
                <div className="col-12 col-md-6 col-lg-4">
                  <Input
                    fluid
                    label={t(dchAttribute.EntityName)}
                    value={
                      dchAttribute.Value === null ? "" : dchAttribute.Value
                    }
                    indicator={"required"}
                    onChange={(value) =>
                      handleDCHCellDataEdit(dchAttribute, value)
                    }
                    error={t(dchAttributeValidationErrors[dchAttribute.ID])}
                    reserveSpace={false}
                  />
                </div>
              ))}
            </Accordion.Content>
          </Accordion>
        </ErrorBoundary>
      ) : null}
      <div className="row">
        <div className="col-10 col-sm-6 col-md-6 col-lg-10 headerLabel">
          {t("Supplier_AssociatedOTs")}
        </div>
        <div className="col-1  col-sm-3 col-md-3 col-lg-1">
          <div
            onClick={handleAddAssociation}
            style={{
              display: "flex",
              cursor: "pointer",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "30%" }}>
              <Icon root="common" name="badge-plus" size="medium" />
            </div>
            <div style={{ width: "65%" }}>
              <span>{t("FinishedProductInfo_Add")}</span>
            </div>
          </div>
        </div>
        <div className="col-1 col-sm-3 col-md-3 col-lg-1">
          <div
            onClick={handleDeleteAssociation}
            style={{
              display: "flex",
              cursor: "pointer",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "30%" }}>
              <Icon root="common" name="delete" size="medium" />
            </div>
            <div style={{ width: "65%" }}>
              <span>{t("DestAdd_Delete")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row marginRightZero tableScroll">
        <div className="col-12 detailsTable">
          <DataTable
            data={modAssociations}
            selectionMode="multiple"
            selection={selectedAssociations}
            onSelectionChange={handleRowSelectionChange}
            scrollable={true}
            scrollHeight="320px"
          >
            <DataTable.Column
              className="compColHeight colminWidth"
              key="OriginTerminalCode"
              field="OriginTerminalCode"
              header={t("OriginTerminal_Code")}
              editable={true}
              //rowHeader={true}
              editFieldType="text"
              customEditRenderer={(celldata) =>
                handleCustomEditDropDown(celldata, listOptions.customerOptions)
              }
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="ContactPerson"
              field="ContactPerson"
              header={t("Cust_ContactPerson")}
              editable={true}
              // rowHeader={true}
              editFieldType="text"
              customEditRenderer={handleCustomEditTextBox}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="Email"
              field="Email"
              header={t("Cust_Email")}
              editable={true}
              // rowHeader={true}
              editFieldType="text"
              customEditRenderer={handleCustomEditTextBox}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="Mobile"
              field="Mobile"
              header={t("DriverInfo_Mobile")}
              editable={true}
              // rowHeader={true}
              editFieldType="text"
              customEditRenderer={handleCustomEditTextBox}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="Phone"
              field="Phone"
              header={t("Dest_PhNum")}
              editable={true}
              // rowHeader={true}
              editFieldType="text"
              customEditRenderer={handleCustomEditTextBox}
            ></DataTable.Column>
          </DataTable>
        </div>
      </div>
    </div>
    //   )}
    // </TranslationConsumer>
  );
}
