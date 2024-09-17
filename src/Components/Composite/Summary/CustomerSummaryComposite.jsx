import React from "react";
import WijmoGridComposite from "../Common/WijmoGridComposite";

export function CustomerSummaryPageComposite({
  tableData,
  columnDetails,
  pageSize,
  exportRequired,
  exportFileName,
  columnPickerRequired,
  columnGroupingRequired,
  terminalsToShow,
  //selectedItems,
  selectionRequired,
  onSelectionChange,
  onRowClick,
  parentComponent
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
    terminalsToShow={terminalsToShow}
    selectionRequired={selectionRequired}
    onSelectionHandle={onSelectionChange}
    onRowClick={onRowClick}
    parentComponent={parentComponent}
    ></WijmoGridComposite>
  );
}
