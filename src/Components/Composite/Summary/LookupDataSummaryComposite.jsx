import React, { useState } from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import {
    Icon, Input, 
} from "@scuf/common";
import ErrorBoundary from "../../ErrorBoundary";

LookupDataSummaryComposite.propTypes = {
    tableData: PropTypes.array.isRequired,
    toggleExpand: PropTypes.func.isRequired,
    expandedRows: PropTypes.array.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    results: PropTypes.string,
    totalItem: PropTypes.array.isRequired
};
LookupDataSummaryComposite.defaultProps = {
    pageSize: 10,
}
export function LookupDataSummaryComposite({
    tableData,
    pageSize,
    onSelectionChange,
    onRowClick,
    expandedRows,
    toggleExpand,
    handleSearchChange,
    results,
    totalItem

}) {
    const [t] = useTranslation();
    const expanderTemplate = (data) => {
        const open = expandedRows.findIndex(x => x.Code === data.rowData.Code) >= 0 ? true : false;
        
        return (
            <div onClick={() => toggleExpand(data.rowData, open,false)}
                className="compartmentIcon gridButtonFontColor">
                <Icon
                    root="common"
                    name={open ? "slidercontrols-minus" : "ellipsis-horizontal"}
                    className="margin_l10"
                />
            </div>
        );
    };
    const handleReadonly = (celldata) => {
        return(
            celldata.rowData.readonly === "true" ? "True" : "False"
        )
    }
    function rowExpansionTemplate(data) {
        
        return Array.isArray(data.value) &&
            data.value.length >= 0 ? (
            <div className="ChildGridViewAllShipmentLoadingDetails secondarytable">
                <DataTable
                        data={data.value}
                         onCellClick={(data) =>
                        onRowClick !== undefined ? onRowClick(data) : {}
                    }
                >
                    <DataTable.Column
                        className="compColHeight"
                        key="name"
                        field="name"
                            header={t("LookUpData_Name")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="value"
                            field="value"
                            header={t("LookUpData_Value")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight lookupdataexpandtabledescription"
                            key="description"
                            field="description"
                            header={t("LookUpData_Description")}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight lookupdataexpandtablereadonly"
                            key="readonly"
                            field="readonly"
                            header={t("LookUpData_ReadOnly")}
                            renderer={handleReadonly}
                        ></DataTable.Column>
                </DataTable>

            </div>
        ) : ("")
    }
    
    return (
        <div className="row">
            <div className={"projectMasterList "} >
                <Input type="text" className="searchbar" onChange={(data)=>handleSearchChange(data)} value={results}
                    placeholder="Search..." /><span style={{
                        marginLeft: "14px",
                        lineHeight : "2.4rem"
                }}>{totalItem.length} Total</span>
                {tableData.length >= 0 ? 
                        <ErrorBoundary>
                            <DataTable
                            data={tableData}
                                selectionMode={false}
                                onSelectionChange={onSelectionChange}
                                scrollHeight="320px"
                                expandedRows={expandedRows}
                                rowExpansionTemplate={rowExpansionTemplate}
                                rows={pageSize}
                            >
                                <DataTable.ActionBar />
                                <DataTable.Column
                                    className="compColHeight Lookupdatacode"
                                    key="Code"
                                    field="Code"
                                    sortable={true}
                                    header={t("LookUpType_Code")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="compColHeight colminWidth"
                                    key="Description"
                                    field="Description"
                                    header={t("LookUpType_Description")}
                                ></DataTable.Column>
                                <DataTable.Column
                                    className="expandedColumn"
                                    initialWidth="100px"
                                    renderer={expanderTemplate}
                            />
                        </DataTable>
                        </ErrorBoundary>
                        : <div style={{ marginLeft: "1px" }}>{(t("CustomerInventory_NoRecordsFound"))}</div>}
            </div>
               
           
        </div>
        // <TMSummaryPageComposite
        //     tableData={tableData}
        //     columnDetails={columnDetails}
        //     pageSize={pageSize}
        //     terminalsToShow={terminalsToShow}
        //     selectedItems={selectedItems}
        //     onSelectionChange={onSelectionChange}
        //     onRowClick={onRowClick}
        // ></TMSummaryPageComposite>
    );
}