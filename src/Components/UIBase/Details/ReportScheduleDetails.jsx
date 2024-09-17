import React from "react";
import { Select, Checkbox } from "@scuf/common";
import { Accordion, Input, DatePicker } from "@scuf/common";
//import * as Constants from "./../../../JS/Constants";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import { Loader } from "@scuf/common";

ReportScheduleDetails.propTypes = {
  reportScheduleDetails: PropTypes.object.isRequired,
  modreportScheduleDetails: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onReportNameChange: PropTypes.func.isRequired,
  onCheckChange: PropTypes.func.isRequired,
  onPrinterChange: PropTypes.func.isRequired,
  //onReportNameSearchChange: PropTypes.func.isRequired,
  //loadParamDetails: PropTypes.func.isRequired,
  onParamLoad: PropTypes.func.isRequired,
  //renderParam: PropTypes.func.isRequired,
  showReportParams: PropTypes.bool.isRequired,
  parameterLoading: PropTypes.bool.isRequired,
  paramValues: PropTypes.object.isRequired,
  savedparamValues: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    reportNames: PropTypes.array,
    printers: PropTypes.array,
  }).isRequired,
};
ReportScheduleDetails.defaultProps = {
  listOptions: {
    reportNames: [],
    printers: [],
  },
  isEnterpriseNode: false,
  isWebPortalUser: false,
};

export function ReportScheduleDetails({
  reportScheduleDetails,
  modreportScheduleDetails,
  validationErrors,
  listOptions,
  onReportNameChange,
  onPrinterChange,
  isEnterpriseNode,
  isWebPortalUser,
  //onReportNameSearchChange,
  onCheckChange,
  showReportParams,
  onParamLoad,
  paramValues,
  savedparamValues,
  parameterLoading,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div>
          <div className="detailsContainer">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("ReportSchedule_ReportName")}
                  value={modreportScheduleDetails.ReportName}
                  options={listOptions.reportNames}
                  onChange={(data) => {
                    //onFieldChange("CarrierCode", data);
                    onReportNameChange(data);
                  }}
                  indicator="required"
                  //error={t(validationErrors.)}
                  error={t(validationErrors.ReportName)}
                  reserveSpace={false}
                  disabled={
                    reportScheduleDetails.ReportName !== "" &&
                    reportScheduleDetails.ReportName !== undefined
                  }
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                  // onSearch={onReportNameSearchChange}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={
                    modreportScheduleDetails.ScheduleName === null
                      ? ""
                      : modreportScheduleDetails.ScheduleName
                  }
                  label={t("ReportSchedules_ScheduleName")}
                  disabled={true}
                  indicator="required"
                  //onChange={(data) => onFieldChange("License1", data)}
                  reserveSpace={false}
                />
              </div>

              <div className="col-12 col-md-6 col-lg-4 checkboxSelect">
                <Checkbox
                  className="LabelEnabled"
                  label={t("ReportSchedules_IsEOS")}
                  checked={modreportScheduleDetails.IsEOS}
                  onChange={(eoschecked) => {
                    onCheckChange("IsEOS", eoschecked);
                  }}
                  disabled={false}
                />
                <Checkbox
                  className="LabelEnabled"
                  label={t("ReportSchedules_IsEOD")}
                  checked={modreportScheduleDetails.IsEOD}
                  onChange={(eodchecked) => {
                    onCheckChange("IsEOD", eodchecked);
                  }}
                  disabled={false}
                />
                <Checkbox
                  className="LabelEnabled"
                  label={t("ReportSchedules_IsMonthly")}
                  checked={modreportScheduleDetails.IsMonthly}
                  onChange={(isMonthlychecked) => {
                    onCheckChange("IsMonthly", isMonthlychecked);
                  }}
                  disabled={false}
                />
                <Checkbox
                  className="LabelEnabled"
                  label={t("ReportSchedules_IsWeekly")}
                  checked={modreportScheduleDetails.IsWeekly}
                  onChange={(isWeeklychecked) => {
                    onCheckChange("IsWeekly", isWeeklychecked);
                  }}
                  disabled={false}
                />
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <table width="100%">
                  <tbody>
                    {" "}
                    <tr width="100%">
                      <td width="100%" valign="top">
                        <Checkbox
                          className="LabelEnabled"
                          label={t("ReportSchedule_IsPrint")}
                          checked={modreportScheduleDetails.IsPrint}
                          onChange={(isPrint) => {
                            onCheckChange("IsPrint", isPrint);
                          }}
                          disabled={false}
                        />
                      </td>
                    </tr>
                    <tr>
                      {" "}
                      <td width="100%">
                        <Select
                          fluid
                          placeholder="Select"
                          value={
                            modreportScheduleDetails.Printer === undefined ||
                            modreportScheduleDetails.Printer === "" ||
                            !modreportScheduleDetails.IsPrint
                              ? []
                              : Utilities.transferCommaStringtoOptions(
                                  modreportScheduleDetails.Printer
                                )
                          }
                          disabled={!modreportScheduleDetails.IsPrint}
                          //label={t("ReportSchedule_Printer")}
                          indicator={
                            modreportScheduleDetails.IsPrint ? "required" : ""
                          }
                          options={Utilities.transferListtoOptions(
                            listOptions.printerList
                          )}
                          onChange={(data) => onPrinterChange(data)}
                          error={t(validationErrors.Printer)}
                          //disabled={listOptions.printers.length === 0}
                          multiple={true}
                          reserveSpace={false}
                          search={true}
                          noResultsMessage={t("noResultsMessage")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="col-12 col-md-6 col-lg-4"></div>
              </div>
              <div className="col-12 col-md-6 col-lg-4"> </div>
            </div>
          </div>
          {parameterLoading ? (
            <div className={`authLoading parameterLoader`}>
              <Loader
                text=" "
                className={`globalLoaderPositionPosition`}
              ></Loader>
            </div>
          ) : (
            ""
          )}

          {showReportParams ? (
            <div className="detailsContainer">
              <div className="row">{onParamLoad()}</div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </TranslationConsumer>
  );
}
