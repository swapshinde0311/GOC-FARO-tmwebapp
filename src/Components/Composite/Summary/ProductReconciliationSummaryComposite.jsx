import React from "react";
import { DataTable } from "@scuf/datatable";
import { Icon } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { useTranslation } from "@scuf/localization";

ProductReconciliationSummaryComposite.propTypes = {
  tableData: PropTypes.array.isRequired,
  columnDetails: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  selectedItems: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
};
ProductReconciliationSummaryComposite.defaultProps = {
  pageSize: 10,
  tableData: [],
  columnDetails: [],
  selectedItems: [],
};

export function ProductReconciliationSummaryComposite({
  tableData,
  columnDetails,
  pageSize,
  selectedItems,
  onSelectionChange,
  onRowClick,
}) {
  const [t] = useTranslation();
  const ViewReportColumn = (data) => {
    try {
    return (
      <div  className="compartmentIcon gridButtonFontColor">
        <ErrorBoundary>
        <span className="gridButtonFontColor">{t('ReconciliationReportDetail_btnViewReconcile')}</span>
        </ErrorBoundary>
        </div>
    );
    } catch (error) {
      console.log("productReconciliationSummaryComposite :Error occured on ViewReportColumn", error);
    }
  };

  function displayValues(cellData, columnDetail) {
    const { value, field } = cellData;
    if (typeof value === "boolean" || field === "Active") {
      if (value) return <Icon name="check" size="small" color="green" />;
      else return <Icon name="close" size="small" color="red" />;
    } else if (value === "" || value === null || value === undefined) {
      return value;
    }  
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
               "tableScroll  flexRelative"
          }
        >
          <DataTable
            data={tableData}
            reorderableColumns={true}
            resizableColumns={true}
            selectionMode="multiple"
            onCellClick={(data) =>
              onRowClick !== undefined ? onRowClick(data) : {}
            }
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
            
            <DataTable.Column
                      className="colminWidth"
                      initialWidth="150px"
                      field={"ReconciliationReportDetail_btnViewReconcile"}
                  header={t("ReconciliationReportDetail_btnViewReconcile")}
            renderer={ViewReportColumn}
                    /> 
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
