import React from "react";
import { DataTable } from "@scuf/datatable";
import { Icon, Popup, Card } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Constants from "./../../../JS/Constants";
import { getKeyByValue } from "../../../JS/Utilities";

HSEInspectionSummaryPageInspection.propTypes = {
  tableData: PropTypes.array.isRequired,
  columnDetails: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  terminalsToShow: PropTypes.number,
  onRowClick: PropTypes.func.isRequired,
  fillPage: PropTypes.bool,
};

HSEInspectionSummaryPageInspection.defaultProps = {
  pageSize: 10,
  terminalsToShow: 2,
  tableData: [],
  columnDetails: [],
  fillPage: true,
};

export function HSEInspectionSummaryPageInspection({
  tableData,
  columnDetails,
  pageSize,
  terminalsToShow,
  onSelectionChange,
  onRowClick,
  fillPage
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
    } else if (field === "OverAllHSEInspectionStatus" || field === "HseInspectionStatus") {
      if (value !== null) {
        return getKeyByValue(Constants.HSEInspectionStatus, parseInt(value))
      }
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

  return (
    <TranslationConsumer>
      {(t) => (
        <div className={fillPage === true ? "projectMasterList" : ""}>
          <DataTable
            data={tableData}
            reorderableColumns={true}
            resizableColumns={true}
            onCellClick={(data) =>
              onRowClick !== undefined ? onRowClick(data.rowData) : {}
            }
            // selectionMode={selectionMode}
            // selection={selectedItems}
            onSelectionChange={(e) => onSelectionChange(e)}
            // search={true}
            searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
            rows={pageSize}
            scrollable={true}
            scrollHeight="300px"
          >
            <DataTable.ActionBar />
            {columnDetails.map(function (columnDetail) {
              return (
                <DataTable.Column
                  initialWidth={columnDetail.Width}
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