import React from "react";
import { useTranslation } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";

EODAdministrationSummaryComposite.propTypes = {};

export function EODAdministrationSummaryComposite({ modEodSumary }) {
  const [t] = useTranslation();
  const formatDate = (e) => {
    if (e == null || e === "" || e === undefined) {
      return "";
    }
    return (
      new Date(e).toLocaleDateString() + " " + new Date(e).toLocaleTimeString()
    );
  };

  return (
    <div className="detailsContainer">
      <div className="row">
        <div className="col col-md-8 col-lg-9 col col-xl-9">
          <h3>{t("EODAdminInfo_EODSummary")}</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12 detailsTable">
          <DataTable data={modEodSumary} scrollable={true} value={""}>
            <DataTable.Column
              className="compColHeight"
              key="OpenTime"
              field="OpenTime"
              header={t("EOD_ActionStartTime")}
              renderer={(cellData) => formatDate(cellData.rowData.OpenTime)}
              editable={false}
              editFieldType="text"
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight"
              key="CloseTime"
              field="CloseTime"
              header={t("EOD_ActionEndTime")}
              renderer={(cellData) => formatDate(cellData.rowData.CloseTime)}
              editable={false}
              editFieldType="text"
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight"
              key="Action"
              field="Action"
              header={t("EOD_Status")}
              editable={false}
              editFieldType="text"
            ></DataTable.Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
