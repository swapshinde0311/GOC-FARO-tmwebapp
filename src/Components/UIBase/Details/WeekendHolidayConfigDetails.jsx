import React from "react";
import { Button, Checkbox, DatePicker, Icon } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

WeekendHolidayConfigDetails.propTypes = {
  modWeekendHolidays: PropTypes.object.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleHolidaySave: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleHolidayReset: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  saveEnabled: PropTypes.bool.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
};

WeekendHolidayConfigDetails.defaultProps = {
  pageSize: 8,
  tableData: [],
  selectedItems: [],
};

export function WeekendHolidayConfigDetails({
  modWeekendHolidays,
  handleAdd,
  handleSave,
  handleReset,
  handleRemove,
  onFieldChange,
  holidaysList,
  saveEnabled,
  onDateChange,
  onSelectChange,
  selectItems,
  handleHolidaySave,
  pageSize,
  handleHolidayReset,
  holidaysSaveEnabled,
  addEnabled,
  removeEnabled,
}) {
  const [t] = useTranslation();
  const handleCustum = (cellData) => {
    return (
      <DatePicker
        fluid
        displayFormat={getCurrentDateFormat()}
        value={cellData.rowData.holiday !== "" ? cellData.rowData.holiday : ""}
        disabled={cellData.rowData.new === undefined}
        disablePast={true}
        reserveSpace={false}
        onChange={(data) => {
          onDateChange(cellData, data);
        }}
      ></DatePicker>
    );
  };

  return (
    <div>
      <div className="row">
        <div className="col-6 col-md-12 col-lg-6">
          <div className="weekend">
            <div className="detailsContainer">
              <div className="row">
                <div className="col col-md-8 col-lg-6 col col-xl-9">
                  <h3>{t("WeekendHolidayConfig_Weekend")}</h3>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-12 col-md-3 col-lg-5"
                  style={{ marginTop: 20 }}
                >
                  <Checkbox
                    checked={modWeekendHolidays.Sunday}
                    onChange={(data) => onFieldChange("Sunday", data)}
                    label={t("WeekendHolidayConfig_Sunday")}
                  />
                </div>
                <div
                  className="col-12 col-md-3 col-lg-5"
                  style={{ marginTop: 20 }}
                >
                  <Checkbox
                    checked={modWeekendHolidays.Monday}
                    onChange={(data) => onFieldChange("Monday", data)}
                    label={t("WeekendHolidayConfig_Monday")}
                  />
                </div>
                <div
                  className="col-12 col-md-3 col-lg-5"
                  style={{ marginTop: 20 }}
                >
                  <Checkbox
                    checked={modWeekendHolidays.Tuesday}
                    onChange={(data) => onFieldChange("Tuesday", data)}
                    label={t("WeekendHolidayConfig_Tuesday")}
                  />
                </div>
                <div
                  className="col-12 col-md-3 col-lg-5"
                  style={{ marginTop: 20 }}
                >
                  <Checkbox
                    checked={modWeekendHolidays.Wednesday}
                    onChange={(data) => onFieldChange("Wednesday", data)}
                    label={t("WeekendHolidayConfig_Wednesday")}
                  />
                </div>
                <div
                  className="col-12 col-md-3 col-lg-5"
                  style={{ marginTop: 20 }}
                >
                  <Checkbox
                    checked={modWeekendHolidays.Thursday}
                    onChange={(data) => onFieldChange("Thursday", data)}
                    label={t("WeekendHolidayConfig_Thursday")}
                  />
                </div>
                <div
                  className="col-12 col-md-3 col-lg-5"
                  style={{ marginTop: 20 }}
                >
                  <Checkbox
                    checked={modWeekendHolidays.Friday}
                    onChange={(data) => onFieldChange("Friday", data)}
                    label={t("WeekendHolidayConfig_Friday")}
                  />
                </div>
                <div
                  className="col-12 col-md-3 col-lg-5"
                  style={{ marginTop: 20 }}
                >
                  <Checkbox
                    checked={modWeekendHolidays.Saturday}
                    onChange={(data) => onFieldChange("Saturday", data)}
                    label={t("WeekendHolidayConfig_Saturday")}
                  />
                </div>
              </div>
            </div>
            <div className="weekendButton">
              <div className="col col-lg-12" style={{ textAlign: "right" }}>
                <Button
                  content={t("WeekendHolidayConfig_WeekendReset")}
                  className="cancelButton"
                  onClick={handleReset}
                ></Button>
                <Button
                  content={t("WeekendHolidayConfig_WeekendSave")}
                  disabled={!saveEnabled}
                  onClick={handleSave}
                ></Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-12 col-lg-6">
          <div className="holidays">
            <div className="detailsContainer">
              <div className="row">
                <div className="col col-md-8 col-lg-6 col col-xl-12">
                  <h3>{t("WeekendHolidayConfig_Holiday")}</h3>
                </div>
                <div className="col col-md-12 col-lg-12 col-xl-12" >
                  <div className="compartmentIconContainer" >
                    <div
                      onClick={addEnabled ? handleAdd : ""}
                      className="compartmentIcon" style={{"marginTop":"-4rem"}}
                    >
                      <div>
                        <Icon root="common" name="badge-plus" size="medium" />
                      </div>
                      <div className="margin_l10">
                        <h5 className="font14">
                          {t("WeekendHolidayConfig_Add")}
                        </h5>
                      </div>
                    </div>

                    <div
                      onClick={removeEnabled ? handleRemove : ""}
                      className="compartmentIcon margin_l30" style={{ "marginTop": "-4rem" }}
                    >
                      <div>
                        <Icon root="common" name="delete" size="medium" />
                      </div>
                      <div className="margin_l10">
                        <h5 className="font14">
                          {t("TerminalHolidays_Remove")}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 detailsTable">
                  <DataTable
                    data={holidaysList}
                    selectionMode="multiple"
                    selection={selectItems}
                    onSelectionChange={onSelectChange}
                    rows={pageSize}
                  >
                    <DataTable.Column
                      key="holiday"
                      className="compColHeight weekendDatePicker"
                      header={t("Holiday")}
                      field="holiday"
                      renderer={(cellData) => handleCustum(cellData)}
                    ></DataTable.Column>
                    <DataTable.Pagination />
                  </DataTable>
                </div>
              </div>
            </div>
            <div className="weekendButton">
              <div className="col col-lg-12" style={{ textAlign: "right" }}>
                <Button
                  content={t("WeekendHolidayConfig_HolidayReset")}
                  className="cancelButton"
                  onClick={handleHolidayReset}
                ></Button>
                <Button
                  content={t("WeekendHolidayConfig_HolidaySave")}
                  disabled={!holidaysSaveEnabled}
                  onClick={handleHolidaySave}
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
