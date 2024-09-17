import React from "react";
import { TMSummaryPageComposite } from "../Common/TMSummaryPageComposite";

export function ReportScheduleSummaryPageComposite({
  tableData,
  columnDetails,
  pageSize,
  terminalsToShow,
  selectedItems,
  onSelectionChange,
  onRowClick,
}) {
  return (
    <TMSummaryPageComposite
      tableData={tableData}
      columnDetails={columnDetails}
      pageSize={pageSize}
      terminalsToShow={terminalsToShow}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      onRowClick={onRowClick}
    ></TMSummaryPageComposite>
  );
}
