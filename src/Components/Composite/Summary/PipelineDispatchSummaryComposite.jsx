import React from "react";
import WijmoGridComposite from "../Common/WijmoGridComposite";

export function PipelineDispatchSummaryPageComposite({
    tableData,
    columnDetails,
    pageSize,
    exportRequired,
    exportFileName,
    columnPickerRequired,
    columnGroupingRequired,
    selectionRequired,
    terminalsToShow,
    selectedItems,
    onSelectionChange,
    onRowClick,
    parentComponent,
}) {
    return (
    <WijmoGridComposite
    data={tableData}
    columns={columnDetails}
    rowsPerPage={pageSize}
    exportRequired={exportRequired}
    exportFileName={exportFileName}
    columnPickerRequired={columnPickerRequired}
    columnGroupingRequired={columnGroupingRequired}
    selectionRequired={selectionRequired}
    selectedItems={selectedItems}
    onSelectionHandle={onSelectionChange}
    onRowClick={onRowClick}
    parentComponent={parentComponent}
    terminalsToShow={terminalsToShow}
    ></WijmoGridComposite>
    );
}