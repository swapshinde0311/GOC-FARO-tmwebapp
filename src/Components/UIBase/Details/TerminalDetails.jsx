import React from "react";
import { Accordion, Select, Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { DataTable } from '@scuf/datatable';
import * as Constants from "../../../JS/Constants";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";

TerminalDetails.propTypes = {
    selectedEnterpriseProcess: PropTypes.array.isRequired,
    modEnterpriseProcess:PropTypes.array.isRequired
}

TerminalDetails.defaultProps = {
    isEnterpriseNode: false,
     isDCHEnabled: false
}

export function TerminalDetails({
    terminal,
    modTerminal,
    validationErrors,
    modDCHAttributes,
    onFieldChange,
    modEnterpriseProcess,
    selectedEnterpriseProcess,
    handleCellDataEdit,
    onAttributeDataChange,
    handleRowSelectionChange,
    attributeValidationErrors,
    isEnterpriseNode,
    modAttributeMetaDataList,
    isDCHEnabled,
    dchAttributeValidationErrors,
    handleDCHCellDataEdit,
    dchAttribute,
    dchAttributeMetaDataList,
}) {
    const handleDCHTextEdit = (cellData) => {
        let val =
        dchAttributeMetaDataList[cellData.rowIndex][cellData.field];
        return (
          <Input
            fluid
            value={val}
            onChange={(value) => handleDCHCellDataEdit(value, cellData)}
            reserveSpace={false}
          />
        );
      };
    
    const handleCustomEditTextBox = (cellData) => {
        return (
            <Input
                fluid
                value={modEnterpriseProcess[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }

    return (
        < TranslationConsumer >
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Code}
                                indicator="required"
                                disabled={terminal.Code !== ""}
                                onChange={(data) => onFieldChange("Code", data)}
                                label={t("Terminal_Code")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Name}
                                indicator="required"
                                onChange={(data) => onFieldChange("Name", data)}
                                label={t("Terminal_Name")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.City}
                                indicator="required"
                                label={t("TerminalList_City")}
                                onChange={(data) => onFieldChange("City", data)}
                                error={t(validationErrors.City)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.State}
                                indicator="required"
                                label={t("Terminal_State")}
                                onChange={(data) => onFieldChange("State", data)}
                                error={t(validationErrors.State)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.ZipCode}
                                indicator="required"
                                label={t("Terminal_ZipCode")}
                                onChange={(data) => onFieldChange("ZipCode", data)}
                                error={t(validationErrors.ZipCode)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Country}
                                indicator="required"
                                label={t("Terminal_Country")}
                                onChange={(data) => onFieldChange("Country", data)}
                                error={t(validationErrors.Country)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Longitude}
                                indicator="required"
                                label={t("Terminal_Langitude")}
                                onChange={(data) => onFieldChange("Longitude", data)}
                                error={t(validationErrors.Longitude)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Latitude}
                                indicator="required"
                                label={t("Terminal_Latitude")}
                                onChange={(data) => onFieldChange("Latitude", data)}
                                error={t(validationErrors.Latitude)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("Terminal_TimeZone")}
                                value={modTerminal.TimeZone}
                                options={Constants.utcTimeZones}
                                onChange={(data) => onFieldChange("TimeZone", data)}
                                indicator="required"
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={
                                    modTerminal.ContactPerson === null
                                        ? ""
                                        : modTerminal.ContactPerson
                                }
                                onChange={(data) => onFieldChange("ContactPerson", data)}
                                label={t("Cust_ContactPerson")}
                                error={t(validationErrors.ContactPerson)}
                                reserveSpace={false}
                            />

                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Address === null ? "" : modTerminal.Address}
                                onChange={(data) => onFieldChange("Address", data)}
                                label={t("Cust_Address")}
                                error={t(validationErrors.Address)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Phone === null ? "" : modTerminal.Phone}
                                label={t("Cust_PhNum")}
                                onChange={(data) => onFieldChange("Phone", data)}
                                error={t(validationErrors.Phone)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTerminal.Email === null ? "" : modTerminal.Email}
                                label={t("Cust_Email")}
                                onChange={(data) => onFieldChange("Email", data)}
                                error={t(validationErrors.Email)}
                                reserveSpace={false}
                            />
                        </div>
                        {/* <div className="col-12 col-md-6 col-lg-4 ">
                            <Checkbox className="deviceCheckBox"

                                label={t("TerminalList_IsRedundant")}
                                defaultChecked={true}
                                checked={modTerminal.IsRedundant}
                                disabled={false}
                                onChange={(data) => onFieldChange("IsRedundant", data)}
                            >
                            </Checkbox>

                        </div> */}
                    </div>
                    {
                        modAttributeMetaDataList.length > 0 ?
                        modAttributeMetaDataList.map((attire) =>
                                <ErrorBoundary>
                                    <Accordion>
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={t("Attributes_Header")}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attire.attributeMetaDataList}
                                                handleCellDataEdit={onAttributeDataChange}
                                                attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attire.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null

                    }

                    {isEnterpriseNode ? (
                        <div className="row">
                            <div className="col-12 detailsTable">
                                <DataTable
                                    data={modEnterpriseProcess}
                                    selectionMode="multiple"
                                    selection={selectedEnterpriseProcess}
                                    onSelectionChange={handleRowSelectionChange}
                                    scrollable={true}
                                    scrollHeight="320px"
                                >
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="ProcessName"
                                        field="ProcessName"
                                        header={t("TerminalInfo_EnterpriseProcessName")}
                                        //editable={true}
                                        sortable={true}
                                        editFieldType="text"
                                        customEditRenderer={handleCustomEditTextBox}
                                    ></DataTable.Column>
                                </DataTable>
                            </div>
                        </div>
                    ) : ("")
                    }
                    {
                        isDCHEnabled ? (
                            <div className="row">
                                <div className="col-12 detailsTable">
                                <DataTable
                                    data={dchAttributeMetaDataList}
                                    scrollable={true}
                                    scrollHeight="320px"
                                    >
                                        <DataTable.Column
                                        className="compColHeight"
                                        key="ExternalSystem"
                                        field="ExternalSystem"
                                        header={t("ShareholderDetails_ExternalSystem")}
                                    ></DataTable.Column>
                                        {dchAttribute.map(function (dchAttribute) {
                                            return (
                                                <DataTable.Column
                                                className="compColHeight"
                                                key={dchAttribute.EntityName}
                                                field={dchAttribute.EntityName}
                                                    header={t(dchAttribute.EntityName)}
                                                    editable={true}
                                                    editFieldType="text"
                                                    customEditRenderer={handleDCHTextEdit}
                                                />
                                            )
                                        })}
                                </DataTable>
                                </div>
                            </div>
                        ):("")
}

                </div>
            )
            }
        </TranslationConsumer >
    )
}