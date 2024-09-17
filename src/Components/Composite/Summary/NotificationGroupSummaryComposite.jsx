import React from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import { Icon,Input,Select,Button } from "@scuf/common";
import PropTypes from "prop-types";
NotificationGroupSummaryPageComposite.propTypes = {
    tableData: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    modNotificationData: PropTypes.object.isRequired,
    notificationData: PropTypes.object.isRequired,
    isDetails: PropTypes.bool.isRequired,
    handleSave: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    saveEnabled:PropTypes.bool.isRequired
};
export function NotificationGroupSummaryPageComposite({
    tableData,
    pageSize,
    onRowClick,
    modNotificationData,
    handleSave,
    onFieldChange,
    onActiveStatusChange,
    handleReset,
    validationErrors,
    notificationData,
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
      
        <div className="detailsContainer" style={{marginTop:"-2rem"}}>
            <div className="row">
            <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        fluid
                        value={modNotificationData.GroupCode}
                        indicator="required"
                        onChange={(data) => onFieldChange("GroupCode", data)}
                        label={t("NotificationGroup_GroupCode")}
                        error={t(validationErrors.GroupCode)}
                        reserveSpace={false}
                        disabled={notificationData.GroupCode !==""}
                    />
                </div>
            <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("Common_Select")}
                        label={t("NotificationGroup_Status")}
                        value={modNotificationData.Active === "" || 
                            modNotificationData.Active === undefined || 
                            modNotificationData.Active === null ? true : modNotificationData.Active}
                        options={[
                            { text: t("ViewShipment_Ok"), value: true },
                            { text: t("ViewShipmentStatus_Inactive"), value: false },
                        ]}
                        onChange={(data) => onFieldChange("Active",data)}
                    />
                </div>
            <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modNotificationData.Description}
                        onChange={(data) => onFieldChange("Description", data)}
                        label={t("NotificationGroup_Description")}
                        error={t(validationErrors.Description)}
                        reserveSpace={false}
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
                            className="compColHeight colminWidth notificationgroupstatus"
                        key="GroupCode"
                        field="GroupCode"
                        sortable={true}
                        header={t("NotificationGroup_GroupCode")}
                    ></DataTable.Column>
                    <DataTable.Column
                            className="compColHeight colminWidth notificationgroupstatus"
                        key="Active"
                        field="Active"
                        header={t("NotificationGroup_Status")}
                        renderer={(cellData) => displayValues(cellData)}
                    ></DataTable.Column>
                    <DataTable.Column
                        className="compColHeight colminWidth"
                        key="Description"
                        field="Description"
                        header={t("NotificationGroup_Description")}
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
