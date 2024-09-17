import React from "react";
import { Select, Input, Button, TextArea, Radio } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";

SMSConfigurationDetails.propTypes = {
    smsConfiguration: PropTypes.object.isRequired,
    modSMSConfiguration: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    listOptions: PropTypes.shape({
        entityTypeOptions: PropTypes.array.isRequired,
        entityParamTypeOptions: PropTypes.array.isRequired,
        entityParamFieldOptions: PropTypes.array.isRequired,
    }).isRequired,
    RecipientDetails: PropTypes.array.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onAddParamClick: PropTypes.func.isRequired,
    handleParamField: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired
};

SMSConfigurationDetails.defaultProps = {
    listOptions: {
        entityTypeOptions: [],
        entityParamTypeOptions: [],
        entityParamFieldOptions: [],
    },
};

export default function SMSConfigurationDetails({
    smsConfiguration,
    modSMSConfiguration,
    validationErrors,
    listOptions,
    RecipientDetails,
    onFieldChange,
    onAddParamClick,
    handleParamField,
    onActiveStatusChange
}) {
    const radioButton = (data) => {
        var recipient = RecipientDetails.filter(x => x.Recipient === data.rowData.Recipient)
        return (
            <div>
                <Radio
                    checked={data.field === "To" ? recipient[0].To : recipient[0].None}
                    onChange={() => onFieldChange(data.field === "To" ? "To" : "None", recipient[0].Recipient)}
                />
            </div>
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
                                value={modSMSConfiguration.SMSMessageCode}
                                indicator="required"
                                disabled={smsConfiguration.SMSMessageCode !== ""}
                                onChange={(data) => onFieldChange("SMSMessageCode", data)}
                                label={t("SMSConfiguration_Code")}
                                error={t(validationErrors.SMSMessageCode)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("SMSConfiguration_EntityType")}
                                value={modSMSConfiguration.EmailSMSEntityType}
                                options={listOptions.entityTypeOptions}
                                onChange={(data) => onFieldChange("EmailSMSEntityType", data)}
                                indicator="required"
                                error={t(validationErrors.EmailSMSEntityType)}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                                disabled={smsConfiguration.EmailSMSEntityType !== "" && smsConfiguration.EmailSMSEntityType !== undefined ? true : false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("SMSConfiguration_EntityParamType")}
                                value={modSMSConfiguration.EntityParamType}
                                options={listOptions.entityParamTypeOptions}
                                onChange={(data) => onFieldChange("EntityParamType", data)}
                                error={t(validationErrors.EntityParamType)}
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="rect-box listbox">
                                <div>{t("SMSConfiguration_EntityParamField")}</div>
                                <ul>
                                    {
                                        listOptions.entityParamFieldOptions !== undefined && listOptions.entityParamFieldOptions.length > 0 &&
                                        listOptions.entityParamFieldOptions.map((list, index) => {
                                            return (
                                                <li
                                                    className={list.value === modSMSConfiguration.SelectedParamField ? 'selected-list' : ''}
                                                    key={index}
                                                    onClick={() => handleParamField(list.value)}
                                                >
                                                    {list.text}
                                                </li>)
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Button
                                className="associateParamFieldBtn"
                                content={t("SMSConfig_AddParamField")}
                                onClick={() => onAddParamClick()}
                                disabled={modSMSConfiguration.SelectedParamField === "" ||
                                    modSMSConfiguration.SelectedParamField === undefined ? true : false}
                            ></Button>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <TextArea
                                fluid={true}
                                label={t("SMSConfiguration_SMSMessage")}
                                value={modSMSConfiguration.MessageText}
                                onChange={(data) => onFieldChange("MessageText", data)}
                                error={t(validationErrors.MessageText)}
                                indicator="required"
                            >
                            </TextArea>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("Cust_Status")}
                                value={modSMSConfiguration.Active}
                                options={[
                                    { text: t("ViewShipment_Ok"), value: true },
                                    { text: t("ViewShipmentStatus_Inactive"), value: false },
                                ]}
                                onChange={(data) => onActiveStatusChange(data)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={
                                    modSMSConfiguration.Remarks === null
                                        ? ""
                                        : modSMSConfiguration.Remarks
                                }
                                label={t("Cust_Remarks")}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                reserveSpace={false}
                                error={t(validationErrors.Remarks)}
                                indicator={modSMSConfiguration.Active !== smsConfiguration.Active ? "required" : ""}
                            />
                        </div>
                    </div>
                    <div className={modSMSConfiguration.EmailSMSEntityType !== "" && modSMSConfiguration.EmailSMSEntityType !== undefined ? "row" : "hidden"}>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label>
                                {t("SMSConfiguration_RecipientList")}
                            </label>
                        </div>
                        <div className="col-12 detailsTable">
                            <DataTable
                                data={RecipientDetails}
                                scrollable={true}
                                scrollHeight="320px"
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="Recipient"
                                    field="Recipient"
                                    header={t("SMSConfiguration_Recipient")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="To"
                                    field="To"
                                    header={t("SMSConfiguration_To")}
                                    renderer={radioButton}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="None"
                                    field="None"
                                    header={t("SMSConfiguration_None")}
                                    renderer={radioButton}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            )}
        </TranslationConsumer>
    );
}