import React from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import { Input,  Button  } from "@scuf/common";
import PropTypes from "prop-types";
NotificationRestrictionSummaryPageComposite.propTypes = {
    tableData: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    modNotificationData: PropTypes.object.isRequired,
    isDetails: PropTypes.bool.isRequired,
    handleSave: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    saveEnabled:PropTypes.bool.isRequired
};
export function NotificationRestrictionSummaryPageComposite({
    tableData,
    pageSize,
    onRowClick,
    modNotificationData,
    handleSave,
    onFieldChange,
    handleReset,
    validationErrors,
    saveEnabled
}) {
    const [t] = useTranslation();
    return (

        <div className="detailsContainer" style={{ marginTop: "-2rem" }}>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4" >
                    <Input
                        // key={index}
                        fluid
                        value={modNotificationData.MessageSource}
                        indicator="required"
                        onChange={(data) => onFieldChange("MessageSource", data)}
                        label={t("NotificationRestriction_Source")}
                        error={t(validationErrors.MessageSource)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        // key={index}
                        fluid
                        value={ modNotificationData.MessageCode}
                        onChange={(data) => onFieldChange("MessageCode", data)}
                        indicator="required"
                        label={t("NotificationRestriction_MessageCode")}
                        error={t(validationErrors.MessageCode)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div style={{ float: "right" ,marginTop:"1.5rem"}}>
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
                            className="compColHeight colminWidth"
                            key="MessageSource"
                            field="MessageSource"
                            sortable={true}
                            header={t("NotificationRestriction_Source")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight colminWidth"
                            key="MessageCode"
                            field="MessageCode"
                            header={t("NotificationRestriction_MessageCode")}
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
        // <TMSummaryPageComposite
        //   tableData={tableData}
        //   columnDetails={columnDetails}
        //   pageSize={pageSize}
        //   terminalsToShow={terminalsToShow}
        //   selectedItems={selectedItems}
        //   onSelectionChange={onSelectionChange}
        //   onRowClick={onRowClick}
        // ></TMSummaryPageComposite>
    );
}
