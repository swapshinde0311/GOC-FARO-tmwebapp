import React from 'react';
import { Select, Input, Button, Icon, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";

ProcessConfigDetails.propTypes = {
    processConfig: PropTypes.object.isRequired,
    modProcessConfig: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        workFlowTypeOptions: PropTypes.array,
        deviceTypeOptions: PropTypes.array,
        deviceCodeOptions: PropTypes.array,
        availableDevices: PropTypes.array,
        associatedDevices: PropTypes.array,
        selectedAvailableDevices: PropTypes.array,
        selectedAssociatedDevices: PropTypes.array,
    }),
    pageSize: PropTypes.number,
    onAvailableDeviceSelection: PropTypes.func.isRequired,
    onAssociatedDeviceSelection: PropTypes.func.isRequired,
    onDeviceAssociation: PropTypes.func.isRequired,
    onDeviceDisassociation: PropTypes.func.isRequired,
    modAttributeMetaDataList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    onAttributeDataChange: PropTypes.func.isRequired,
    isMultidrop: PropTypes.bool
}

ProcessConfigDetails.defaultProps = {
    listOptions: {
        workFlowTypeOptions: [],
        deviceTypeOptions: [],
        deviceCodeOptions: [],
        availableDevices: [],
        associatedDevices: [],
        selectedAvailableDevices: [],
        selectedAssociatedDevices: []
    }
}

export function ProcessConfigDetails({
    processConfig,
    modProcessConfig,
    validationErrors,
    onFieldChange,
    onActiveStatusChange,
    listOptions,
    pageSize,
    onAvailableDeviceSelection,
    onAssociatedDeviceSelection,
    onDeviceAssociation,
    onDeviceDisassociation,
    modAttributeMetaDataList,
    attributeValidationErrors,
    onAttributeDataChange,
    isMultidrop
}) {
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modProcessConfig.ProcessName}
                                indicator="required"
                                disabled={processConfig.ProcessName !== ""}
                                onChange={(data) => onFieldChange("ProcessName", data)}
                                label={t("ProcessConfig_ProcessName")}
                                error={t(validationErrors.ProcessName)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modProcessConfig.WorkFlowType}
                                label={t("ExeConfiguration_WorkFlow")}
                                indicator="required"
                                options={listOptions.workFlowTypeOptions}
                                onChange={(data) => {
                                    onFieldChange("WorkFlowType", data);
                                }}
                                error={t(validationErrors.WorkFlowType)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modProcessConfig.PrimaryDeviceType}
                                label={t("ProcessConfig_DeviceType")}
                                indicator="required"
                                options={listOptions.deviceTypeOptions}
                                onChange={(data) => {
                                    onFieldChange("PrimaryDeviceType", data);
                                }}
                                error={t(validationErrors.PrimaryDeviceType)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modProcessConfig.PrimaryDeviceCode}
                                label={t("ProcessConfig_PrimaryDeviceCode")}
                                indicator="required"
                                options={listOptions.deviceCodeOptions}
                                onChange={(data) => {
                                    onFieldChange("PrimaryDeviceCode", data);
                                }}
                                error={t(validationErrors.PrimaryDeviceCode)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("ProcessConfig_Status")}
                                value={modProcessConfig.Active}
                                options={[
                                    { text: t("PipeLineHeaderInfo_Active"), value: true },
                                    { text: t("PipeLineHeaderInfo_Inactive"), value: false },
                                ]}
                                onChange={(data) => onActiveStatusChange(data)}
                                error={t(validationErrors.Active)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modProcessConfig.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("ProcessConfig_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modProcessConfig.Active !== processConfig.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-5">
                            <h4>{t("ProcessConfig_AvlDevices")}</h4>
                            <div className="detailsTable">
                                <DataTable
                                    data={listOptions.availableDevices}
                                    search={true}
                                    selectionMode="multiple"
                                    selection={listOptions.selectedAvailableDevices}
                                    onSelectionChange={onAvailableDeviceSelection}
                                    rows={pageSize}
                                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="DeviceCode"
                                        field="DeviceCode"
                                        header={t("ProcessConfig_BCU")}
                                        editFieldType="text"
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="ChannelCode"
                                        field="ChannelCode"
                                        header={t("ProcessConfig_Channel")}
                                        editFieldType="text"
                                    ></DataTable.Column>
                                    {Array.isArray(listOptions.availableDevices) &&
                                        listOptions.availableDevices.length > pageSize ? (
                                        <DataTable.Pagination />) : ("")}
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
                                    onClick={onDeviceAssociation}
                                    disabled={listOptions.availableDevices.length > 0 ? false : true}
                                /><br></br><br></br>

                                <Button
                                    type="primary"
                                    icon={<Icon name="caret-left" root="common" />}
                                    content=""
                                    iconPosition="right"
                                    onClick={onDeviceDisassociation}
                                    disabled={listOptions.associatedDevices.length > 0 ? false : true}
                                />

                            </div>
                        </div>

                        <div className="col-12 col-md-5 col-lg-5">
                            <h4>{t("ProcessConfig_AssociatedDevices")}</h4>
                            <div className="detailsTable">
                                <DataTable
                                    data={listOptions.associatedDevices}
                                    search={true}
                                    selectionMode="multiple"
                                    selection={listOptions.selectedAssociatedDevices}
                                    onSelectionChange={onAssociatedDeviceSelection}
                                    rows={pageSize}
                                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="DeviceCode"
                                        field="DeviceCode"
                                        header={t("ProcessConfig_BCU")}
                                        editFieldType="text"
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="ChannelCode"
                                        field="ChannelCode"
                                        header={t("ProcessConfig_Channel")}
                                        editFieldType="text"
                                    ></DataTable.Column>
                                    {Array.isArray(listOptions.associatedDevices) &&
                                        listOptions.associatedDevices.length > pageSize ? (
                                        <DataTable.Pagination />) : ("")}
                                </DataTable>
                            </div>
                        </div>

                        <div>

                        </div>

                    </div>

                    {
                        modAttributeMetaDataList.length > 0 ?
                            modAttributeMetaDataList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={(t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={onAttributeDataChange}
                                                attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attribute.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null
                    }

                </div>
            )}
        </TranslationConsumer>
    )
}