import React from "react";
import { TMSummaryPage } from "../../UIBase/Common/TMSummaryPage";

export function TMSummaryPageComposite({
  tableData,
  columnDetails,
  pageSize,
  terminalsToShow,
  selectedItems,
  onSelectionChange,
  onRowClick,
  selectionMode,
  fillPage,
}) {
  return (
    <TMSummaryPage
      tableData={tableData}
      columnDetails={columnDetails}
      pageSize={pageSize}
      terminalsToShow={terminalsToShow}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      onRowClick={onRowClick}
      selectionMode={selectionMode}
      fillPage={fillPage}
    ></TMSummaryPage>
  );
}
