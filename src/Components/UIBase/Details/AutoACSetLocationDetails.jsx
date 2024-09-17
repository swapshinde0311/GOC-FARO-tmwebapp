import React from "react";
import { DataTable } from "@scuf/datatable";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
AutoACSetLocationDetails.propTypes = {
  tableData: PropTypes.array.isRequired,
  columnDetails: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};
AutoACSetLocationDetails.defaultProps = {
  tableData: [],
  columnDetails: [],
  selectedItems: [],
  selectionMode: "single",
};

export function AutoACSetLocationDetails({
  tableData,
  columnDetails,
  selectedItems,
  onSelectionChange,
  selectionMode,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className={"projectMasterList"}>
          <DataTable
            data={tableData}
            reorderableColumns={true}
            resizableColumns={true}
            selectionMode={selectionMode}
            selection={selectedItems}
            onSelectionChange={(e) => onSelectionChange(e)}
          >
            {columnDetails.map(function (columnDetail) {
              if (columnDetail.Name !== "PointName") {
                return (
                  <DataTable.Column
                    // initialWidth={columnDetail.Width}
                    key={columnDetail.Name}
                    field={columnDetail.Name}
                    header={t(columnDetail.Name)}
                    sortable={true}
                  />
                );
              } else return "";
            })}
          </DataTable>
        </div>
      )}
    </TranslationConsumer>
  );
}
