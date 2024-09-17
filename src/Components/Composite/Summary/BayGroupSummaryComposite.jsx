import React from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";


BayGroupSummaryComposite.propTypes = {
  tableData: PropTypes.object.isRequired,
  toggleExpand: PropTypes.func.isRequired,
    expandedRows: PropTypes.array.isRequired,
    selectedBay: PropTypes.array.isRequired,
  selectedBays:PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired,
};


export function BayGroupSummaryComposite({
  tableData,
  pageSize,
  selectedItems,
  onSelectionChange,
 onRowClick,
  expandedRows,
    toggleExpand,
}) {
    const [t] = useTranslation();
     const expanderTemplate = (data) => {
    const open = expandedRows.findIndex(x => x.GroupName === data.rowData.GroupName) >= 0 ? true : false;
    return (
      <div onClick={() => toggleExpand(data.rowData, open)} className="compartmentIcon gridButtonFontColor">
        <span>{open ? t("Hide_AssociateBay(s)") : t("View_AssociateBay(s)")}</span>
        {/* <Icon root="common" name={open ? "slidercontrols-minus" : "ellipsis-horizontal"} className="margin_l10" /> */}
      </div>
    );
    };
    function rowExpansionTemplate(data) {
        let compData = []
        compData.push(data)
        return Array.isArray(data.BayList) &&
            data.BayList.length > 0 ? (
            <div className="ChildGridViewAllShipmentLoadingDetails secondarytable">
                <DataTable
                    data={data.BayList}
                >
                     <DataTable.Column  
                    className="compColHeight"
                    key="BayCode"
                    field="BayCode"
                    header={t("BayGroupList_AssociatedBays")}
                    ></DataTable.Column>
                </DataTable>

            </div>
        ) : ("")
    }
    return (
        <div className="row">
              <div  className= {"projectMasterList"} >
                <DataTable
                  data={tableData}
                  selectionMode="multiple"
                  selectedItems={selectedItems}
                    onSelectionChange={onSelectionChange}
                    selection={selectedItems}
                    // scrollable={true}
                    // scrollHeight="320px"
                    search={true}
                    expandedRows={expandedRows}
                    
                    rowExpansionTemplate={rowExpansionTemplate}
                onCellClick={(data) =>
              onRowClick !== undefined ? onRowClick(data) : {}
            }
                >
                   <DataTable.ActionBar />
                    <DataTable.Column
              className="compColHeight colminWidth"
                    key="GroupName"
                    field="GroupName"
                    sortable={true}
                    header={t("BayGroupList_Name")}
                    ></DataTable.Column>
                     <DataTable.Column
              className="compColHeight colminWidth"
                    key="Description"
                    field="Description"
                    header={t("BayGroupList_Description")}
                    ></DataTable.Column>
                     <DataTable.Column
                 className="compColHeight colminWidth"
                    key="CreatedTime"
                        field="CreatedTime"
                    header={t("BayGroupList_CreatedTime")}
                    ></DataTable.Column>
                     <DataTable.Column
                 className="compColHeight colminWidth"
                    key="LastUpdatedTime"
                    field="LastUpdatedTime"
                    header={t("BayGroupList_LastUpdated")}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="expandedColumn"
                      initialWidth="100px"
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
    // <TMSummaryPageComposite
    //   tableData={tableData}
    //   columnDetails={columnDetails}
    //   pageSize={pageSize}
    //   terminalsToShow={terminalsToShow}
    //   selectedItems={selectedItems}
    //   onSelectionChange={onSelectionChange}
    //   onRowClick={onRowClick}
    // ></TMSummaryPageComposite>
  );
}
