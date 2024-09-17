import React from "react";
import { DataTable } from '@scuf/datatable';
import { Select, Icon, Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import lodash from "lodash";
import PropTypes from "prop-types";
import "../../../CSS/hseConfiguration.css";

RailDispatchRailWagonAssignmentDetails.propTypes = {
  listOptions: PropTypes.shape({
    carrierCodes: PropTypes.array,
    trailerCodes: PropTypes.array
  }).isRequired,
  modRailWagonList: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  selectedRow: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onAssignWagon: PropTypes.func.isRequired,
  onDeleteWagon: PropTypes.func.isRequired,
  onMoveWagon: PropTypes.func.isRequired,
  onReverseSelect: PropTypes.func.isRequired
}

export function RailDispatchRailWagonAssignmentDetails({
  listOptions,
  modRailWagonList,
  data,
  onFieldChange,
  selectedRow,
  onSelectionChange,
  onAssignWagon,
  onDeleteWagon,
  onMoveWagon,
  onReverseSelect
}) {
  const wagonOptionsFilter = () => {
    let newOptions = lodash.cloneDeep(listOptions.trailerCodes);
    for (let item of modRailWagonList) {
      newOptions = newOptions.filter((optionItem) => {
        return !(item.TrailerCode === optionItem.value && item.CarrierCompanyCode === data.CarrierCompanyCode)
      })
    }
    return newOptions;
  }

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("WagonList_CarrierCompany")}
                value={data.CarrierCode}
                onChange={(data) => onFieldChange("CarrierCompanyCode", data)}
                options={listOptions.carrierCodes}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                className="selectDropwdown"
                label={t("RailWagonSeqInfo_RailWagonCode")}
                value={data.TrailerCode}
                fluid
                options={wagonOptionsFilter()}
                onChange={(data) => onFieldChange("TrailerCode", data)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Button
                className="hse-configuration-button"
                content={t("RailWagonSeqInfo_Assigned")}
                onClick={onAssignWagon}
              />
            </div>
          </div>

          <div className="row compartmentRow">
            <div className="col col-md-8 col-lg-9 col col-xl-9">
              {/* <h4>{t("RailDispatchPlanDetail_PlanHeader")}</h4> */}
            </div>
            <div className="col col-md-4 col-lg-3 col-xl-3">
              <div className="compartmentIconContainer">
                <div onClick={() => onMoveWagon(true)} className="compartmentIcon">
                  <div>
                    <Icon root="common" name="arrow-up" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("RailWagonSeqInfo_MoveUp")}</h5>
                  </div>
                </div>
                
                <div onClick={() => onMoveWagon(false)} className="compartmentIcon margin_l30">
                  <div>
                    <Icon root="common" name="arrow-down" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("RailWagonSeqInfo_MoveDown")}</h5>
                  </div>
                </div>
                
                <div onClick={onReverseSelect} className="compartmentIcon margin_l30">
                  <div>
                    <Icon root="common" name="arrow-left-and-right" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("RailWagonSeqInfo_Reverse")}</h5>
                  </div>
                </div>

                <div onClick={onDeleteWagon} className="compartmentIcon margin_l30">
                  <div>
                    <Icon root="common" name="delete" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("RailWagonSeqInfo_DeAssign")}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 detailsTable">
              <DataTable
                data={modRailWagonList}
                selectionMode="multiple"
                selection={selectedRow}
                onSelectionChange={onSelectionChange}
              >
                <DataTable.Column
                  className="compColHeight"
                  key="SequenceNo"
                  field="SequenceNo"
                  header={t("RailRouteConfigurationDetails_Sequence")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="TrailerCode"
                  field="TrailerCode"
                  header={t("ViewRailLoadingDetails_RailWagonCode")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="CarrierCompanyCode"
                  field="CarrierCompanyCode"
                  header={t("ViewRailLoadingDetails_CarrierCompany")}
                />
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  )
}