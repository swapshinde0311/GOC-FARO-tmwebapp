import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";
import { Input, Select, Checkbox, Button } from "@scuf/common";
import moment from "moment-timezone";
import { TimePickerMod as TimePicker } from "../Common/TimePicker";
import { emptyEodAdminInfo } from "../../../JS/DefaultEntities";
import PropTypes from "prop-types";

EODAdministrationDetails.propTypes = {
  onFieldChange: PropTypes.func.isRequired,
  modEodAdminDetails: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handCloseDay: PropTypes.func.isRequired,
  handOpenDay: PropTypes.func.isRequired,
  minutesError: PropTypes.string.isRequired,
  handReset: PropTypes.func.isRequired,
  OpenDayEnabled: PropTypes.bool.isRequired,
  CloseDayEnabled: PropTypes.bool.isRequired,
  saveEnabled: PropTypes.bool.isRequired,
};

export function EODAdministrationDetails({
  onFieldChange,
  modEodAdminDetails,
  validationErrors,
  handleSave,
  handCloseDay,
  handOpenDay,
  minutesError,
  handReset,
  OpenDayEnabled,
  CloseDayEnabled,
  saveEnabled,
}) {
  function showOpentime(openTime) {
    try {
      var hour = openTime.slice(0, 2);
      var minute = openTime.slice(2, 5);
      if (hour > 12 && hour < 22) {
        return "0" + (hour - 12) + minute + " PM";
      } else if(hour >= 22 && hour < 24){
        return (hour - 12) + minute + " PM";
      } else if (hour === "12") {
        return "12" + minute + " PM";
      } else if (hour === "00"){
        return "12" + minute + " AM";
      }else {
        return openTime + " AM";
      }
    } catch (error) {
      console.log(
        "EODAdministrationDetails:Error occured on showOpentime",
        error
      );
    }
  }

  function getMyDate(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + addZero(oMonth) + '-' + addZero(oDay) + ' ' + addZero(oHour) + ':' +
        addZero(oMin) + ':' + addZero(oSen);
    return oTime;
  }

  function addZero(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  }


  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                label={t("EOD_TerminalAction")}
                disabled={true}
                value={
                  modEodAdminDetails.ID === emptyEodAdminInfo.ID
                    ? "NOTSTARTED"
                    : modEodAdminDetails.CurrentAction
                }
                onChange={(data) => onFieldChange("CurrentAction", data)}
                options={getOptionsWithSelect(
                  [
                    { text: t("ShiftInfo_NotStarted"), value: "NOTSTARTED" },
                    { text: t("ShiftInfo_Open"), value: "OPEN" },
                    { text: t("ShiftInfo_Close"), value: "CLOSE" },
                  ],
                  t("Common_Select")
                )}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
              ></Select>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              {/* <TimePicker
                value={
                  modEodAdminDetails.ID === emptyEodAdminInfo.ID
                    ? null
                    : moment(
                        new Date(modEodAdminDetails.OpenTime).setSeconds(0)
                      )
                }
                label={t("EOD_ActionStartTime")}
                displayFormat={"hh:mm A"}
                disabled={true}
              /> */}
              <Input
                fluid
                value={
                  modEodAdminDetails.ID === emptyEodAdminInfo.ID 
                    ? ""
                    : showOpentime(modEodAdminDetails.OpenTime.slice(11, 16))
                }
                label={t("EOD_ActionStartTime")}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4" >
              <TimePicker 
                value={moment(
                  modEodAdminDetails.CloseTime === null ||
                    modEodAdminDetails.CloseTime === undefined ||
                    modEodAdminDetails.CloseTime === ""
                    ? new Date().setSeconds(0)
                    // : new Date(showClosetime(modEodAdminDetails.CloseTime)).setSeconds(0)
                    : new Date(modEodAdminDetails.CloseTime).setSeconds(0)
                )}
                label={t("EOD_EODTime")}
                displayFormat={"hh:mm A"}
                onChange={(data) =>
                  onFieldChange("CloseTime", getMyDate(data))
                }
                error={t(validationErrors.CloseTime)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="row" style={{ paddingLeft: "16px" }}>
                <Input
                  value={
                    modEodAdminDetails.DenyEntryTime === null
                      ? ""
                      : modEodAdminDetails.DenyEntryTime
                  }
                  label={t("EOD_DenyEntry")}
                  indicator="required"
                  onChange={(data) => onFieldChange("DenyEntryTime", data)}
                  reserveSpace={false}
                  error={t(validationErrors.DenyEntryTime)}
                />
                <span style={{ paddingTop: "35px", paddingLeft: "12px" }}>
                  {t("minutes")}
                </span>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="row" style={{ paddingLeft: "16px" }}>
                <Input
                  value={
                    modEodAdminDetails.DenyLoadTime === null
                      ? ""
                      : modEodAdminDetails.DenyLoadTime
                  }
                  label={t("EOD_DenyLoad")}
                  indicator="required"
                  onChange={(data) => onFieldChange("DenyLoadTime", data)}
                  reserveSpace={false}
                  className="denyLoadMinutes"
                  error={t(
                    validationErrors.DenyLoadTime !== ""
                      ? validationErrors.DenyLoadTime
                      : minutesError
                  )}
                />
                <span style={{ paddingTop: "35px", paddingLeft: "12px" }}>
                  {t("minutes")}
                </span>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modEodAdminDetails.Remarks === null
                    ? ""
                    : modEodAdminDetails.Remarks
                }
                label={t("EOD_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                reserveSpace={false}
                error={t(validationErrors.Remarks)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Checkbox
                fluid
                label={t("EOD_CloseAutomatic")}
                disabled={true}
                checked={modEodAdminDetails.IsCloseAutomatic}
              ></Checkbox>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Checkbox
                fluid
                label={t("EOD_OpenAutomatic")}
                disabled={true}
                checked={modEodAdminDetails.IsOpenAutomatic}
              ></Checkbox>
            </div>
          </div>
          <div className="row">
            <div className="col col-lg-12" style={{ textAlign: "right" }}>
              <Button
                className="OpenDayButton"
                onClick={handOpenDay}
                disabled={!OpenDayEnabled}
                content={t("EOD_OpenDay")}
              ></Button>
              <Button
                className="CloseDayButton"
                onClick={handCloseDay}
                disabled={!CloseDayEnabled}
                content={t("EOD_EOD")}
              ></Button>
              <Button
                className="ResetButton"
                onClick={handReset}
                content={t("EODAdministration_Reset")}
              ></Button>
              <Button
                className="saveButton"
                onClick={handleSave}
                disabled={!saveEnabled}
                content={t("Save")}
              ></Button>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
