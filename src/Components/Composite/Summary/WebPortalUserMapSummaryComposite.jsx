import React from "react";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { Icon } from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";

WebPortalUserMapSummaryComposite.propTypes = {
  tableData: PropTypes.array.isRequired,
  columnDetails: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  selectedItems: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  fillPage: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
  expandedRows: PropTypes.array.isRequired,
}

export function WebPortalUserMapSummaryComposite({ 
  tableData,
  columnDetails,
  pageSize,
  selectedItems,
  onSelectionChange,
  onRowClick,
  toggleExpand,
  expandedRows
}) {
  const [t] = useTranslation();
  const expanderTemplate = (data) => {
    try {
      const open = expandedRows.findIndex(x => x.WebPortal_UserName === data.rowData.WebPortal_UserName) >= 0 ? true : false;
    return (
      <div onClick={() => toggleExpand(data.rowData, open)} className="compartmentIcon gridButtonFontColor">
        <ErrorBoundary>
          <Icon root="common" name={open ? "slidercontrols-minus" : "ellipsis-horizontal"} className="margin_l10" />
        </ErrorBoundary>
        </div>
    );
    } catch (error) {
      console.log("WebPortalUserMapSummaryComposite:Error occured on expanderTemplate", error);
    }
  };
  
  function rowExpansionTemplate(data) {
    return Array.isArray(data.EntityList) &&
      data.EntityList.length > 0 ? (
        <div className="ChildGridViewAllShipmentLoadingDetails secondarytable">
          <ErrorBoundary>
            <DataTable
                data={data.EntityList}
          >
             <DataTable.Column
                        className="compColHeight"
                        key="Code"
                        field="Code"
                        header={t("Common_Code")}
                      ></DataTable.Column>
                        <DataTable.Column
                      className="compColHeight"
                      field="Shareholder"
                      key="Shareholder"
                      header={t("Shareholder")}
                        />
            </DataTable>
            </ErrorBoundary>
        </div>
    ) : ( ""
    );
    }


  return (
    <div>
          <div className={"projectMasterList"}>
            <DataTable
               data={tableData}
              //  reorderableColumns={true}
              //  resizableColumns={true}
               onCellClick={(data) =>
                 onRowClick !== undefined ? onRowClick(data) : {}
               }
               selectionMode={"multiple"}
               selection={selectedItems}
               onSelectionChange={(e) => onSelectionChange(e)}
               search={true}
               searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
              rows={pageSize}
          rowExpansionTemplate={rowExpansionTemplate}
          expandedRows={expandedRows}
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
                  renderer={(cellData) => cellData.value}
                />
              );
              })}
              <DataTable.Column
                      className="expandedColumn"
                      initialWidth="50px"
            renderer={expanderTemplate}
                    />
                {Array.isArray(tableData) && tableData.length > pageSize ? (
              <DataTable.Pagination />
            ) : (
              ""
            )}
             </DataTable>
          </div>
      </div>
  );
}
