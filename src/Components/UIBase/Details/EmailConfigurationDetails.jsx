import React from "react";
import { Select, Input, Checkbox, Radio } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";


EmailConfigurationDetails.propTypes = {
    emailConfig: PropTypes.object.isRequired,
    modEmailConfig: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onEntityTypeChange: PropTypes.func.isRequired,
    handleCellDataEdit: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        priority: PropTypes.array,
        EntityTypeOptions: PropTypes.array,
    }).isRequired,
}

EmailConfigurationDetails.defaultProps = {
    listOptions: {
        priority: [],
        EntityTypeOptions: [],
    }
}

export function EmailConfigurationDetails({
    emailConfig,
    modEmailConfig,
    validationErrors,
    onFieldChange,
    listOptions,
    onEntityTypeChange,
    handleCellDataEdit,
    onActiveStatusChange
}) {

    const radioButton = (cellData) => {
        var recipient = modEmailConfig.Recipients.filter(x => x.Recipient === cellData.rowData.Recipient)
        return (
            <div>
                <Radio
                    checked={cellData.field === "To" ? recipient[0].To :
                        cellData.field === "CC" ? recipient[0].CC :
                            cellData.field === "BCC" ? recipient[0].BCC : recipient[0].None}
                    onChange={() => handleCellDataEdit(cellData)}
                />
            </div>
        );
    }



    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modEmailConfig.EmailMessageCode}
                                indicator="required"
                                disabled={emailConfig.EmailMessageCode !== ""}
                                onChange={(data) => onFieldChange("EmailMessageCode", data)}
                                label={t("EmailConfiguration_Code")}
                                error={t(validationErrors.EmailMessageCode)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t(`EmailConfiguration_EntityType`)}
                                value={modEmailConfig.EmailSMSEntityType}
                                options={listOptions.EntityTypeOptions}
                                onChange={(data) => {
                                    onEntityTypeChange(data);
                                }}
                                indicator="required"
                                error={t(validationErrors.EmailSMSEntityType)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modEmailConfig.Subject}
                                indicator="required"
                                onChange={(data) => onFieldChange("Subject", data)}
                                label={t("EmailConfiguration_Subject")}
                                error={t(validationErrors.Subject)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t(`EmailConfiguration_Priority`)}
                                value={modEmailConfig.Priority}
                                options={listOptions.priority}
                                onChange={(data) => {
                                    onFieldChange("Priority", data);
                                }}
                                indicator="required"
                                error={t(validationErrors.Priority)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modEmailConfig.MessageText}
                                indicator="required"
                                onChange={(data) => onFieldChange("MessageText", data)}
                                label={t("EmailConfiguration_EmailMessage")}
                                error={t(validationErrors.MessageText)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div
                                className="ui single-input fluid disabled"
                                style={{ width: "30%", float: "left" }}
                            >
                                <div class="ui input-label">
                                    <span className="input-label-message">
                                        {t("EmailConfiguration_Attachment")}
                                    </span>
                                </div>
                                <div className="input-wrap">
                                    <Checkbox
                                        fluid
                                        checked={modEmailConfig.Attachment}
                                        onChange={(data) => onFieldChange("Attachment", data)}
                                        value={modEmailConfig.Attachment}
                                    />
                                </div>
                                </div>
                    </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t(`EmailConfiguration_Status`)}
                                value={modEmailConfig.Active}
                                options={[
                                    { text: t("ViewShipment_Ok"), value: true },
                                    { text: t("ViewShipmentStatus_Inactive"), value: false },
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
                                value={modEmailConfig.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("EmailConfiguration_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modEmailConfig.Active !== emailConfig.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
                    </div>

                    <div className={modEmailConfig.EmailSMSEntityType !== "" && modEmailConfig.EmailSMSEntityType !== undefined ? "row" : "hidden"}>
                        <div className="col col-md-8 col-lg-9 col col-xl-9">
                            <h4>{t("EmailConfiguration_RecipientList")}</h4>
                        </div>
                        <div className="col-12 detailsTable">
                            <DataTable
                                data={modEmailConfig.Recipients}
                                onEdit={handleCellDataEdit}
                            >
                                <DataTable.Column
                                    className="compColHeight"
                                    key="Recipient"
                                    field="Recipient"
                                    header={t("EmailConfiguration_Recipient")}
                                    editFieldType="text"
                                >
                                </DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="To"
                                    field="To"
                                    header={t("EmailConfiguration_To")}
                                    renderer={radioButton}
                                >
                                </DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="CC"
                                    field="CC"
                                    header={t("EmailConfiguration_CC")}
                                    renderer={radioButton}
                                >
                                </DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="BCC"
                                    field="BCC"
                                    header={t("EmailConfiguration_BCC")}
                                    renderer={radioButton}
                                >
                                </DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight"
                                    key="None"
                                    field="None"
                                    header={t("EmailConfiguration_None")}
                                    renderer={radioButton}
                                >
                                </DataTable.Column>
                            </DataTable>
                        </div>
                    </div>
                </div>

            )}
        </TranslationConsumer>
    )
}
