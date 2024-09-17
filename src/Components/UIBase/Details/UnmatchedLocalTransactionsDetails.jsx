import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";

UnmatchedLocalTransactionsDetails.propTypes = {
  batchDetailsList: PropTypes.array.isRequired
}
UnmatchedLocalTransactionsDetails.defaultProps = { batchDetailsList: [] }

export function UnmatchedLocalTransactionsDetails({ batchDetailsList }) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 detailsTable">
              <DataTable
                data={batchDetailsList}
              >
                <DataTable.Column
                  className="compColHeight"
                  key="ProductCode"
                  field="ProductCode"
                  header={t("ContractInfo_Product")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="ProductType"
                  field="ProductType"
                  header={t("ProductType_Title")}
                  renderer={(cellData) => {
                    return t(
                      batchDetailsList[cellData.rowIndex][
                        cellData.field
                      ]
                    );
                  }}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="MeterCode"
                  field="MeterCode"
                  header={t("Meter_Code")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="GrossQuantity"
                  field="GrossQuantity"
                  header={t("GrossQuantity")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="NetQuantity"
                  field="NetQuantity"
                  header={t("NetQuantity")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="StartTotalizer"
                  field="StartTotalizer"
                  header={t("StartTotalizer")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="EndTotalizer"
                  field="EndTotalizer"
                  header={t("EndTotalizer")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="Density"
                  field="Density"
                  header={t("Density")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="Pressure"
                  field="Pressure"
                  header={t("Pressure")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="Temperature"
                  field="Temperature"
                  header={t("Temperature")}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="StartTime"
                  field="StartTime"
                  header={t("StartTime")}
                  renderer={(cellData) => {
                    if (
                      batchDetailsList[cellData.rowIndex][
                        cellData.field
                      ]
                    ) {
                      return new Date(
                        batchDetailsList[cellData.rowIndex][
                          cellData.field
                        ]
                      ).toLocaleString();
                    }
                  }}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="EndTime"
                  field="EndTime"
                  header={t("EndTime")}
                  renderer={(cellData) => {
                    if (
                      batchDetailsList[cellData.rowIndex][
                        cellData.field
                      ]
                    ) {
                      return new Date(
                        batchDetailsList[cellData.rowIndex][
                          cellData.field
                        ]
                      ).toLocaleString();
                    }
                  }}
                ></DataTable.Column>
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
