import React from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import { Icon, Input, Select, Button, Checkbox} from "@scuf/common";
import PropTypes from "prop-types";
import * as Constants from "./../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";
NotificationMessageSummaryPageComposite.propTypes = {
    tableData: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    modNotificationMessage: PropTypes.object.isRequired,
    isDetails: PropTypes.bool.isRequired,
    handleSave: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    notificationMessage: PropTypes.object.isRequired,
    listOptions: PropTypes.shape({
        notificationMessage: PropTypes.array,
    }).isRequired,
    onGroupSearchOption: PropTypes.func.isRequired,
    saveEnabled:PropTypes.bool.isRequired
};
NotificationMessageSummaryPageComposite.defaultProps = {
    listOptions: {
        notificationMessage: [],
    },
    saveEnabled:false
}
export function NotificationMessageSummaryPageComposite({
    tableData,
    pageSize,
    onRowClick,
    modNotificationMessage,
    handleSave,
    onFieldChange,
    handleReset,
    validationErrors,
    listOptions,
    notificationMessage,
    onGroupSearchOption,
    saveEnabled

}) {
    const [t] = useTranslation();
    function displayValues(cellData) {
        const { value, field } = cellData;
        if (typeof value === "boolean" || field === "Active") {
            if (value) return <Icon name="check" size="small" color="green" />;
            else return <Icon name="close" size="small" color="red" />;
        } else if (value === "" || value === null || value === undefined) {
            return value;
        }
    }
    
    return (

        <div className="detailsContainer" style={{ marginTop: "-2rem" }}>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                        value={modNotificationMessage.MessageCode}
                        indicator="required"
                        disabled={notificationMessage.MessageCode !== ""}
                        onChange={(data) => onFieldChange("MessageCode", data)}
                        label={t("NotificationConfig_MessageCode")}
                        error={t(validationErrors.MessageCode)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modNotificationMessage.GroupCode}
                        onChange={(data) => onFieldChange("GroupCode", data)}
                        label={t("NotificationConfig_GroupCode")}
                        indicator="required"
                        options={listOptions.notificationGroup}
                        error={t(validationErrors.GroupCode)}
                        reserveSpace={false}
                        onSearch={onGroupSearchOption}
                        search={true}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modNotificationMessage.NotificationType}
                        onChange={(data) => onFieldChange("NotificationType", data)}
                        label={t("NotificationConfig_NotificationType")}
                        options={[
                            { text: t("NotificationList_AUDIT"), value: "AUDIT" },
                            { text: t("NotificationList_EVENT"), value: "EVENT" },
                            { text: t("NotificationList_ALARM"), value: "ALARM" },
                        ]}
                        indicator="required"
                        error={t(validationErrors.NotificationType)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modNotificationMessage.MessageType}
                        onChange={(data) => onFieldChange("MessageType", data)}
                        label={t("NotificationConfig_MessageType")}
                        options={[
                            { text: t("SUCCESS"), value: "SUCCESS" },
                            { text: t("FAILURE"), value: "FAILURE" },
                            { text: "PARTIAL SUCCESS", value: "PARTIAL SUCCESS" },
                            { text: "PARTIAL FAILURE", value: "PARTIAL FAILURE" }
                        ]}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={modNotificationMessage.Priority} 
                        onChange={(data) => onFieldChange("Priority", data)}
                        label={t("NotificationConfig_Priority")}
                        indicator="required"
                        options={listOptions.notificationPriority}
                        error={t(validationErrors.Priority)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        value={Utilities.getKeyByValue(
                            Constants.NotificationMessage, modNotificationMessage.NotificationLocation) === undefined ?"": Utilities.getKeyByValue(
                                Constants.NotificationMessage, modNotificationMessage.NotificationLocation) }
                        onChange={(data) => onFieldChange("NotificationLocation", data)}
                        label={t("NotificationConfig_NotificationLocation")}
                        options={Utilities.transferListtoOptions(Object.keys(Constants.NotificationMessage))}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modNotificationMessage.PointName}
                        onChange={(data) => onFieldChange("PointName", data)}
                        label={t("AtgConfigure_ParameterName")}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4 ">
                    <div class="ui input-label">
                        <span className="input-label-message">
                            {t("NotificationConfig_ReturnToNormal")}
                        </span>
                    </div>
                    <div className="input-wrap">
                        <Checkbox
                            onChange={(data) => onFieldChange("ReturnToNormal", data)}
                            checked={modNotificationMessage.ReturnToNormal===true}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modNotificationMessage.Condition}
                        onChange={(data) => onFieldChange("Condition", data)}
                        label={t("NotificationConfig_Condition")}
                        indicator="required"
                        error={t(validationErrors.Condition)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modNotificationMessage.Message}
                        onChange={(data) => onFieldChange("Message", data)}
                        label={t("NotificationConfig_Message")}
                        indicator="required"
                        error={t(validationErrors.Message)}
                        reserveSpace={false}
                    />
                </div>
               
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("Common_Select")}
                        label={t("NotificationConfig_Status")}
                        value={modNotificationMessage.Active === "" ||
                            modNotificationMessage.Active === undefined ||
                            modNotificationMessage.Active === null ? true : modNotificationMessage.Active}
                        options={[
                            { text: t("ViewShipment_Ok"), value: true },
                            { text: t("ViewShipmentStatus_Inactive"), value: false },
                        ]}
                        onChange={(data) => onFieldChange("Active", data)}
                    />
                </div>
               
                <div className="col-12 col-md-9 col-lg-12">
                    <div style={{ float: "right" }}>
                        <Button
                            content={t("NotificationGroup_Reset")}
                            className="cancelButton"
                            onClick={() => handleReset()}
                        />
                        <Button
                            type="primary"
                            content={t("NotificationGroup_Save")}
                            disabled={!saveEnabled}
                            onClick={() => handleSave()}
                        />
                    </div>
                </div>
            </div>
            <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable" >
                    <DataTable
                        data={tableData}
                        search={true}
                        onCellClick={(data) =>
                            onRowClick !== undefined ? onRowClick(data) : {}
                        }
                    >
                        <DataTable.ActionBar />
                        <DataTable.Column
                            className="compColHeight colminWidth "
                            key="MessageCode"
                            field="MessageCode"
                            sortable={true}
                            header={t("NotificationConfig_MessageCode")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth "
                            key="GroupCode"
                            field="GroupCode"
                            header={t("NotificationConfig_GroupCode")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="NotificationType"
                            field="NotificationType"
                            header={t("NotificationConfig_NotificationType")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth columnsize"
                            key="MessageType"
                            field="MessageType"
                            header={t("NotificationConfig_MessageType")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth columnsize"
                            key="Priority"
                            field="Priority"
                            header={t("NotificationConfig_Priority")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth "
                            key="NotificationLocation"
                            field="NotificationLocation"
                            header={t("NotificationConfig_NotificationLocation")}
                            renderer={(cellData) => {
                                return Utilities.getKeyByValue(
                                    Constants.NotificationMessage,
                                    parseInt(cellData.value)
                                );
                            }}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth ReturnToNormal"
                            key="PointName"
                            field="PointName"
                            header={t("NotificationConfig_PointName")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth ReturnToNormal"
                            key="ReturnToNormal"
                            field="ReturnToNormal"
                            header={t("NotificationConfig_ReturnToNormal")}
                            renderer={(cellData) => displayValues(cellData)}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth "
                            key="Condition"
                            field="Condition"
                            header={t("NotificationConfig_Condition")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth  "
                            key="Message"
                            field="Message"
                            header={t("NotificationConfig_Message")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth ReturnToNormal"
                            key="Active"
                            field="Active"
                            header={t("NotificationConfig_Status")}
                            renderer={(cellData) => displayValues(cellData)}
                        ></DataTable.Column>
                        {Array.isArray(tableData) && tableData.length > pageSize ? (
                            <DataTable.Pagination />
                        ) : (
                            ""
                        )}
                    </DataTable>
                </div>

            </div>
        </div>
    );
}
