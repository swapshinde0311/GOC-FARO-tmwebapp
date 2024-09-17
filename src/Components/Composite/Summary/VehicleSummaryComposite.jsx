import React from "react";
import WijmoGridComposite from "../Common/WijmoGridComposite";

export function VehicleSummaryPageComposite({
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
  selectionMode,
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
      selectionRequired={selectionRequired}
      onSelectionHandle={onSelectionChange}
      columnGroupingRequired={columnGroupingRequired}
      onRowClick={onRowClick}
      parentComponent={parentComponent}
      terminalsToShow={terminalsToShow}
      singleSelection={selectionMode === 'single'}
      selectedItems={selectedItems}
    ></WijmoGridComposite>
  );
}
