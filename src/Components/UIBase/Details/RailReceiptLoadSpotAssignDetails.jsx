import React from "react";
import { DataTable } from "@scuf/datatable";
import { Input, Select, DatePicker } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

RailReceiptLoadSpotAssignDetails.propTypes = {
  listOptions: PropTypes.shape({
    spurCodes: PropTypes.array,
    clusterCodes: PropTypes.array,
    BCUCodes: PropTypes.array,
  }).isRequired,
  IsAuthorizeEnable: PropTypes.bool,
  modRailWagonBatchPlanList: PropTypes.array,
  onCellDataEdit: PropTypes.func.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  railReceipt: PropTypes.object.isRequired,
};

export function RailReceiptLoadSpotAssignDetails({
  listOptions,
  modRailWagonBatchPlanList,
  onCellDataEdit,
  onAuthorize,
  railReceipt,
}) {
  const [t] = useTranslation();

  const handleCustomEditDropDown = (cellData, dropDownOptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modRailWagonBatchPlanList[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownOptions}
        onChange={(value) => onCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modRailWagonBatchPlanList[cellData.rowIndex][cellData.field]}
        onChange={(value) => onCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };
  const AuthorizeButton = (cellData) => {
    // let rowIndex = modRailWagonBatchPlanList.findIndex(
    //   (item) => item.UniqueID === cellData.rowData.UniqueID
    // );
    return (
      <div
        className={
          "compartmentIconContainer" +
          (cellData.value ? " gridButtonFontColor" : "")
        }
      >
        <div
          onClick={() => onAuthorize(cellData.rowData)}
          className="compartmentIcon"
        >
          <div className="margin_l10">
            <h5 className="font14">{t("RailDispatchPlanInfo_Authorize")}</h5>
          </div>
        </div>
      </div>
    );
  };

  const decimalDisplayValues = (cellData) => {
    const { value } = cellData;
    if (typeof value === "number") {
      return value.toLocaleString();
    } else {
      return value;
    }
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                value={railReceipt.ReceiptCode}
                label={t("ViewReceiptList_ReceiptCode")}
                editable={false}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                indicator="required"
                // value={railReceipt.ScheduledDate}
                value={
                  railReceipt.ScheduledDate === null ||
                  railReceipt.ScheduledDate === undefined ||
                  railReceipt.ScheduledDate === ""
                    ? ""
                    : new Date(railReceipt.ScheduledDate)
                }
                label={t("UnLoadingInfo_ScheduledDate")}
                // editable={false}
                type="datetime"
                minuteStep="5"
                displayFormat={getCurrentDateFormat()}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                indicator="required"
                value={railReceipt.ReceiptStatus}
                label={t("Receipt_ReceiptStatus")}
                editable={false}
                reserveSpace={false}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 detailsTable">
              <DataTable data={modRailWagonBatchPlanList}>
                <DataTable.Column
                  className="compColHeight"
                  key="RailWagonCode"
                  field="RailWagonCode"
                  header={t("ViewRailLoadingDetails_RailWagonCode")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="CarrierCompanyCode"
                  field="CarrierCompanyCode"
                  header={t("ViewRailLoadingDetails_CarrierCompany")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="FinishedProduct"
                  field="FinishedProduct"
                  header={t("ViewRailDispatchList_FinishedProductCode")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="PresetQuantity"
                  field="PresetQuantity"
                  header={t("RailDispatchTrainAssignment_PresetQuantity")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="SpurCode"
                  field="SpurCode"
                  header={t("Spur_Code")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(cellData, listOptions.spurCodes)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="ClusterCode"
                  field="ClusterCode"
                  header={t("RailDispatchManualEntry_Cluster")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(cellData, listOptions.clusterCodes)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="BCUCode"
                  field="BCUCode"
                  header={t("ViewRailLoadingDetails_BCUCode")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(cellData, listOptions.BCUCodes)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="ArmNoInBCU"
                  field="ArmNoInBCU"
                  header={t("LoadingArmInfo_ArmNoInBCU")}
                  editable={true}
                  editFieldType="text"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={(cellData) =>
                    handleCustomEditTextBox(cellData)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="LoadingSequenceNo"
                  field="LoadingSequenceNo"
                  header={t("RailDispatchLoadSpotAssign_LoadingSeq")}
                  editable={true}
                  editFieldType="text"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={(cellData) =>
                    handleCustomEditTextBox(cellData)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="AllowAuthorize"
                  field="AllowAuthorize"
                  header={t("RailDispatchPlanInfo_Authorize")}
                  renderer={(cellData) => AuthorizeButton(cellData)}
                />
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
