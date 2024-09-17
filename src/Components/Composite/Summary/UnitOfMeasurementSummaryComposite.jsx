import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";
export function UnitOfMeasurementSummaryComposite({
    tableData,
    columnDetails,
    pageSize,
}) {

    return (
            <TranslationConsumer>
              {(t) => (
                <div className={"projectMasterList"}>
                  <DataTable
                    data={tableData}
                    reorderableColumns={true}
                    resizableColumns={true}
                    search={true}
                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                    rows={pageSize}
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
                         
                        />
                      );
                    })}
                    {}
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
