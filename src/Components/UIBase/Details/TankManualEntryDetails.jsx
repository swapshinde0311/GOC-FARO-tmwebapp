import React from "react";
import { DataTable } from '@scuf/datatable';
import { Input, Select, DatePicker, Icon } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";

TankManualEntryDetails.propTypes = {
  entryDate: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  selectedAssociations: PropTypes.array.isRequired,
  listOptions: PropTypes.shape({
    tankCode: PropTypes.array,
    baseProductCode: PropTypes.array,
    quantityUOM: PropTypes.array,
    densityQuantityUOM: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onTankSearchChange: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  handleAssociationSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired
}
TankManualEntryDetails.defaultProps = { isEnterpriseNode: false };

export function TankManualEntryDetails({
  entryDate,
  modAssociations,
  selectedAssociations,
  listOptions,
  onFieldChange,
  onTankSearchChange,
  handleAddAssociation,
  handleDeleteAssociation,
  handleAssociationSelectionChange,
  handleCellDataEdit,
  isEnterpriseNode,
}) {

  const [t] = useTranslation();

  const handleCustomEditDropDown = (cellData, dropDownOptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modAssociations[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownOptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  const handleTankEditDropDown = (cellData) => {
    return (
      <Select
        fluid
        value={modAssociations[cellData.rowIndex][cellData.field]}
        options={getOptionsWithSelect(
          listOptions.tankCode,
          t("Common_Select")
        )}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        search={true}
        reserveSpace={false}
        noResultsMessage={t("noResultsMessage")}
        onSearch={onTankSearchChange}
      />
    );
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modAssociations[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
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
            <div style={{ padding: "0 15px 15px 15px" }}>
              <DatePicker
                fluid
                value={entryDate === null ? "" : new Date(entryDate)}
                label={t("TankEODEntry_EODEntryDate")}
                type="date"
                displayFormat={getCurrentDateFormat()}
                indicator="required"
                onChange={(data) => onFieldChange("EntryTime", data)}
                reserveSpace={false}
              />
            </div>
          </div>

          <div className="row compartmentRow">
            <div className="col col-md-8 col-lg-9 col col-xl-9">
              <h4>{t("TankEODEntry_PageTitle")}</h4>
            </div>
            <div className="col col-md-4 col-lg-3 col-xl-3">
              <div className="compartmentIconContainer">
                <div onClick={handleAddAssociation} className="compartmentIcon">
                  <div>
                    <Icon root="common" name="badge-plus" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("FinishedProductInfo_Add")}</h5>
                  </div>
                </div>

                <div
                  onClick={handleDeleteAssociation}
                  className="compartmentIcon margin_l30"
                >
                  <div>
                    <Icon root="common" name="delete" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("DestAdd_Delete")}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 detailsTable">
              <DataTable
                data={modAssociations}
                selectionMode="multiple"
                selection={selectedAssociations}
                onSelectionChange={handleAssociationSelectionChange}
              >
                <DataTable.Column
                  className="compColHeight"
                  key="TankCode"
                  field="TankCode"
                  header={t("TankEODEntry_TankCode")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) => handleTankEditDropDown(cellData)}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="BaseProductCode"
                  field="BaseProductCode"
                  header={t("TankEODEntry_Product")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(
                      cellData,
                      listOptions.baseProductCode
                    )
                  }
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="EOPGrossVolume"
                  field="EOPGrossVolume"
                  header={t("TankEODEntry_GrossQty")}
                  editable={true}
                  editFieldType="text"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="EOPNetVolume"
                  field="EOPNetVolume"
                  header={t("TankEODEntry_NetQty")}
                  editable={true}
                  editFieldType="text"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="QuantityUOM"
                  field="QuantityUOM"
                  header={t("TankUnaccountedTransaction_QuantityUOM")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(
                      cellData,
                      listOptions.quantityUOM
                    )
                  }
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="EOPMassVolume"
                  field="EOPMassVolume"
                  header={t("TankEODEntry_MassVolume")}
                  editable={true}
                  editFieldType="text"
                  renderer={(cellData) => decimalDisplayValues(cellData)}
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="MassQuantityUOM"
                  field="MassQuantityUOM"
                  header={t("TankEODEntry_MassQuantityUOM")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(
                      cellData,
                      listOptions.densityQuantityUOM
                    )
                  }
                ></DataTable.Column>
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
