import React from "react";
import { DataTable } from "@scuf/datatable";
import { Icon, Popup, Card } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
TMSummaryPage.propTypes = {
  tableData: PropTypes.array.isRequired,
  columnDetails: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  terminalsToShow: PropTypes.number,
  selectedItems: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  fillPage: PropTypes.bool,
};
TMSummaryPage.defaultProps = {
  pageSize: 10,
  terminalsToShow: 2,
  tableData: [],
  columnDetails: [],
  selectedItems: [],
  selectionMode: "multiple",
  fillPage: true,
};

export function TMSummaryPage({
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
  function terminalPopOver(terminalCodes) {
    if (terminalCodes.split(",").length > terminalsToShow) {
      return (
        <Popup
          className="popup-theme-wrap"
          on="hover"
          element={<span>{terminalCodes.split(",").length}</span>}
        >
          <Card>
            <Card.Content>{terminalCodes}</Card.Content>
          </Card>
        </Popup>
      );
    } else {
      return <span>{terminalCodes}</span>;
    }
  }

  function displayValues(cellData, columnDetail) {
    const { value, field } = cellData;
    if (typeof value === "boolean" || field === "Active") {
      if (value) return <Icon name="check" size="small" color="green" />;
      else return <Icon name="close" size="small" color="red" />;
    } else if (value === "" || value === null || value === undefined) {
      return value;
    } else if (field === "TerminalCodes" && value !== null) {
      return terminalPopOver(value);
    }
    // var columnType = columnDetails.find(function (detail) {
    //   if (detail.Name === field) {
    //     return detail;
    //   }
    // });
    else if (
      columnDetail !== undefined &&
      columnDetail !== null &&
      columnDetail.DataType !== undefined &&
      columnDetail.DataType === "DateTime"
    ) {
      return (
        new Date(value).toLocaleDateString() +
        " " +
        new Date(value).toLocaleTimeString()
      );
    } else if (
      columnDetail !== undefined &&
      columnDetail !== null &&
      columnDetail.DataType !== undefined &&
      columnDetail.DataType === "Date"
    ) {
      return new Date(value).toLocaleDateString();
    } else return value;
  }

  function getInitialWidth(columnDetails) {
    const windowWidth = window.screen.width;
    //debugger;
    if (windowWidth < 1024) {
      return columnDetails.WidthPx === undefined ||
        columnDetails.WidthPx === null ||
        columnDetails.WidthPx === ""
        ? columnDetails.Width
        : columnDetails.WidthPx;
    } else {
      return columnDetails.WidthPercentage === undefined ||
        columnDetails.WidthPercentage === null ||
        columnDetails.WidthPercentage === ""
        ? columnDetails.Width
        : columnDetails.WidthPercentage;
    }
  }

  return (
    <TranslationConsumer>
      {(t) => (
        <div
          className={
            fillPage === true
              ? "projectMasterList flexRelative tableScroll"
              : " tableScroll  flexRelative"
          }
        >
          <DataTable
            data={tableData}
            reorderableColumns={true}
            resizableColumns={true}
            onCellClick={(data) =>
              onRowClick !== undefined ? onRowClick(data.rowData) : {}
            }
            selectionMode={selectionMode}
            selection={selectedItems}
            onSelectionChange={(e) => onSelectionChange(e)}
            search={true}
            searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
            rows={pageSize}
          >
            <DataTable.ActionBar />
            {columnDetails.map(function (columnDetail) {
              return (
                <DataTable.Column
                  initialWidth={getInitialWidth(columnDetail)}
                  key={columnDetail.Name}
                  field={columnDetail.Name}
                  header={t(columnDetail.Name)}
                  sortable={true}
                  renderer={(cellData) => displayValues(cellData, columnDetail)}
                />
              );
            })}
            {/* {tableData.length > 0
            ? Object.keys(tableData[0]).map(function (key) {
                return (
                  <DataTable.Column
                    initialWidth={getInitialWidth(key)}
                    key={key}
                    field={key}
                    header={t(key)}
                    sortable={true}
                    renderer={displayValues}
                  />
                );
              })
            : ""} */}
            {Array.isArray(tableData) && tableData.length > pageSize ? (
              <DataTable.Pagination />
            ) : (
              ""
            )}
          </DataTable>
        </div>
      )}
    </TranslationConsumer>
  );
}
