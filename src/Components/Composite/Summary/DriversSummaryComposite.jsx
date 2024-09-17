import React from "react";
import WijmoGridComposite from "../Common/WijmoGridComposite";

export function DriversSummaryPageComposite({
  tableData,
  columnDetails,
  exportRequired,
  exportFileName,
  columnPickerRequired,
  columnGroupingRequired,
  selectionRequired,
  pageSize,
  terminalsToShow,
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
      selectionRequired={selectionRequired}
      onSelectionHandle={onSelectionChange}
      onRowClick={onRowClick}
      parentComponent={parentComponent}
      terminalsToShow={terminalsToShow}>
    </WijmoGridComposite>
  );
}
