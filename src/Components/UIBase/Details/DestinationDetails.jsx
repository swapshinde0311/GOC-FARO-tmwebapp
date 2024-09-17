import React from "react";
import { Accordion, Select, Icon, Input } from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
//import * as Constants from "./../../../JS/Constants";
import { DataTable } from "@scuf/datatable";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

DestinationDetails.propTypes = {
  destination: PropTypes.object.isRequired,
  modDestination: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    transportationTypes: PropTypes.array,
    terminalCodes: PropTypes.array,
    customerOptions: PropTypes.array,
  }).isRequired,

  onFieldChange: PropTypes.func.isRequired,
  //compartmentColumns: PropTypes.array.isRequired,

  onAllTerminalsChange: PropTypes.func.isRequired,
  selectedAssociations: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  isDCHEnabled: PropTypes.bool.isRequired,
  isValidShareholderSysExtCode: PropTypes.bool.isRequired,
};

DestinationDetails.defaultProps = {
  listOptions: {
    transportationTypes: [],
    terminalCodes: [],
  },
  isEnterpriseNode: false,
  isDCHEnabled: false,
  isValidShareholderSysExtCode: false,
};
export default function DestinationDetails({
  destination,
  modDestination,
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
  isDCHEnabled,
  isValidShareholderSysExtCode,
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
  const [t] = useTranslation();
  const handleCustomEditDropDown = (cellData, dropDownoptions) => {
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <Select
        className="selectDropwdown"
        //placeholder="Select"
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
            value={modDestination.Code}
            label={t("Dest_Code1")}
            indicator="required"
            disabled={destination.Code !== ""}
            onChange={(data) => onFieldChange("Code", data)}
            error={t(validationErrors.Code)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modDestination.Name}
            label={t("Dest_Name1")}
            indicator="required"
            onChange={(data) => onFieldChange("Name", data)}
            error={t(validationErrors.Name)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            multiple={true}
            label={t("Vehicle_Transport")}
            value={modDestination.TransportationTypes}
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
              modDestination.Address === null ? "" : modDestination.Address
            }
            label={t("Dest_Address")}
            onChange={(data) => onFieldChange("Address", data)}
            indicator="required"
            error={t(validationErrors.Address)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modDestination.City === null ? "" : modDestination.City}
            label={t("Terminal_City")}
            onChange={(data) => onFieldChange("City", data)}
            error={t(validationErrors.City)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modDestination.State === null ? "" : modDestination.State}
            label={t("Terminal_State")}
            onChange={(data) => onFieldChange("State", data)}
            indicator={
              isDCHEnabled && isValidShareholderSysExtCode ? "required" : ""
            }
            error={t(validationErrors.State)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modDestination.Country === null ? "" : modDestination.Country
            }
            label={t("Terminal_Country")}
            onChange={(data) => onFieldChange("Country", data)}
            error={t(validationErrors.Country)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modDestination.ZipCode === null ? "" : modDestination.ZipCode
            }
            label={t("Terminal_ZipCode")}
            onChange={(data) => onFieldChange("ZipCode", data)}
            error={t(validationErrors.ZipCode)}
            indicator={
              isDCHEnabled && isValidShareholderSysExtCode ? "required" : ""
            }
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("FinishedProductInfo_Select")}
            label={t("Cust_Status")}
            value={modDestination.Status}
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
            value={
              modDestination.Remarks === null ? "" : modDestination.Remarks
            }
            label={t("Cust_Remarks")}
            onChange={(data) => onFieldChange("Remarks", data)}
            indicator={
              modDestination.Status !== destination.Status ? "required" : ""
            }
            error={t(validationErrors.Remarks)}
            reserveSpace={false}
          />
        </div>
        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modDestination.TerminalCodes}
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
          <h4>{t("Destination_AssociatedCusts")}</h4>
        </div>
        <div className="col col-md-4 col-lg-3 col-xl-3">
          <div className="compartmentIconContainer">
            <div onClick={handleAddAssociation} className="compartmentIcon">
              <div>
                <Icon root="common" name="badge-plus" size="medium" />
              </div>
              <div className="margin_l10">
                <h5 className="font14">{t("FinishedProductInfo_Add")}</h5>
              </div>
            </div>

            <div
              onClick={handleDeleteAssociation}
              className="compartmentIcon margin_l30"
            >
              <div>
                <Icon root="common" name="delete" size="medium" />
              </div>
              <div className="margin_l10">
                <h5 className="font14">{t("DestAdd_Delete")}</h5>
              </div>
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
              key="CustomerCode"
              field="CustomerCode"
              header={t("Cust_Code")}
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
