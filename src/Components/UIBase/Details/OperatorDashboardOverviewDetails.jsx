import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@scuf/common";
import { Popup, List } from "@scuf/common";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";
import { Divider } from "@scuf/common";
import * as Constants from "../../../JS/Constants";
import { useTranslation } from "@scuf/localization";

OperatorDashboardOverviewDetails.propTypes = {
  transportationType: PropTypes.string.isRequired,
  filteredBayDetails: PropTypes.array.isRequired,
  btnGoLiveClick: PropTypes.func.isRequired,
  btnBackwardClick: PropTypes.func.isRequired,
  btnForwardClick: PropTypes.func.isRequired,
  ShiftsData: PropTypes.array.isRequired,
  CurrentShift: PropTypes.object.isRequired,
  DashboardConfig: PropTypes.object.isRequired,
  transactionAndDeviceStatus: PropTypes.array.isRequired,
  getQueuedTransaction: PropTypes.func.isRequired,
  objOrderDetails: PropTypes.array.isRequired,
  QueueDetails: PropTypes.array.isRequired,
  selectedOption: PropTypes.array.isRequired,
  onChangeSelectedOption: PropTypes.func.isRequired,
  railOptions: PropTypes.array.isRequired,
  heapClick: PropTypes.func.isRequired,
  timetaken: PropTypes.number.isRequired,
  viewShipmentStatus: PropTypes.number.isRequired,
};

OperatorDashboardOverviewDetails.defaultProps = {
  objOrderDetails: null,
};

export function OperatorDashboardOverviewDetails({
  getRailLiveOrderDetails,
  getRailOrderDetails,
  handleOpen,
  openBoolean,
  hdnFGPrintBOL,
  hdnFGPrintBOD,
  hdnFGShipClose,
  hdnFGRecClose,
  orderDetails,
  orderProductDetails,
  orderloadedPartCommpartmentList,
  orderloadedOtherCommpartmentList,
  getOrderDetails,
  print,
  forceClose,
  transportationType,
  filteredBayDetails,
  btnGoLiveClick,
  btnForwardClick,
  btnBackwardClick,
  ShiftsData,
  CurrentShift,
  DashboardConfig,
  transactionAndDeviceStatus,
  getQueuedTransaction,
  objOrderDetails,
  QueueDetails,
  selectedOption,
  onChangeSelectedOption,
  railOptions,
  heapClick,
  timetaken,
  viewShipmentStatus,
}) {
  // const [selectedTransaction, setSelectedTransaction] = useState(-1);
  // const [railOptions, setRailOptions] = useState([]);
  //const [selectedOption, setSelectedOption] = useState("select");
  const [t] = useTranslation();
  var [isDeviceStatusHover] = useState(false);
  function timeGraphHTML() {
    var timeGraphHtml = [];
    var minsdiff = Math.floor(
      (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
    );
    var GraphPercentage = 100.0 / minsdiff;
    var graphDuration = 0;

    var requiredGraphPoints = minsdiff / 5;
    var StartGraphTime = new Date(CurrentShift.StartTime);
    var startwidth = Math.floor(StartGraphTime / 1000 / 60) % 5;
    if (startwidth !== 0) {
      requiredGraphPoints += 1;
    }
    for (var i = 1; i <= requiredGraphPoints; i++) {
      if (i === 1) {
        if (startwidth !== 0) {
          if ((StartGraphTime.getMinutes() + (5 - startwidth)) % 30 !== 0) {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeShort"
                style={{
                  borderRight: "solid 1px #D0D0D0",
                  width: (5 - startwidth) * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          } else {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeLong"
                style={{
                  borderRight: "solid 1px #D0D0D0",
                  width: (5 - startwidth) * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          }
          graphDuration += StartGraphTime.getMinutes() + (10 - startwidth);
        } else {
          if ((StartGraphTime.getMinutes() + 5) % 30 !== 0) {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeShort"
                style={{
                  borderRight: "solid 1px #D0D0D0",
                  width: 5 * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          } else {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeLong"
                style={{
                  borderRight: "solid 1px #D0D0D0",
                  width: 5 * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          }
          graphDuration += StartGraphTime.getMinutes() + 10;
        }
      } else if (i === requiredGraphPoints) {
        if (startwidth !== 0) {
          if ((StartGraphTime.getMinutes() - startwidth) % 30 !== 0) {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeShort"
                style={{
                  width: startwidth * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          } else {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeLong"
                style={{
                  width: startwidth * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          }
          graphDuration += StartGraphTime.getMinutes() + (5 - startwidth);
        } else {
          if (StartGraphTime.getMinutes() % 30 !== 0) {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeShort"
                style={{
                  borderRight: "solid 1px #D0D0D0",
                  width: 5 * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          } else {
            timeGraphHtml.push(
              <div
                className="marineGraphTimeLong"
                style={{
                  borderRight: "solid 1px #D0D0D0",
                  width: 5 * GraphPercentage + "%",
                }}
              >
                &nbsp;
              </div>
            );
          }
          graphDuration += StartGraphTime.getMinutes() + 5;
        }
      } else {
        if (graphDuration % 30 === 0) {
          timeGraphHtml.push(
            <div
              className="marineGraphTimeLong"
              style={{
                borderRight: "solid 1px #D0D0D0",
                width: 5 * GraphPercentage + "%",
              }}
            >
              &nbsp;
            </div>
          );
        } else {
          timeGraphHtml.push(
            <div
              className="marineGraphTimeShort"
              style={{
                borderRight: "solid 1px #D0D0D0",
                width: 5 * GraphPercentage + "%",
              }}
            >
              &nbsp;
            </div>
          );
        }
        graphDuration += 5;
      }
    }
    return timeGraphHtml;
  }

  function baysInfoSuccess() {
    if (filteredBayDetails !== undefined && filteredBayDetails.length !== 0) {
      var resultshtml = [];
      for (let j = 0; j < filteredBayDetails.length; j++) {
        var loadingType = "Dashboard_ShipmentReceipt";
        if (filteredBayDetails[j].LoadingType === "LOADING")
          loadingType = "Dashboard_Shipments";
        else if (filteredBayDetails[j].LoadingType === "UNLOADING")
          loadingType = "Dashboard_Receipts";
        else loadingType = "Dashboard_ShipmentReceipt";
        if (
          transactionAndDeviceStatus !== undefined &&
          transactionAndDeviceStatus !== null
        ) {
          resultshtml.push(
            baysComposition(
              filteredBayDetails[j],
              j,
              loadingType,
              transactionAndDeviceStatus[j]
            )
          );
        }

        // if (transportationType === Constants.TransportationType.ROAD) {
        //   if (j !== 0) {
        //     resultshtml.push(<div className="roadDashboardInQueueBac"></div>);
        //   }
        //   // resultshtml.push(getQueueHTML(filteredBayDetails[j]));
        //   // resultshtml += divQueueHtml;
        // }
      }
      let marineDashboardDiv11Width = {};
      if (transportationType === Constants.TransportationType.ROAD) {
        marineDashboardDiv11Width = { width: "77%" };
      } else {
        marineDashboardDiv11Width = { width: "86%" };
      }
      resultshtml.push(
        <div
          id="divShiftBox"
          className="marineDashboardDiv11"
          style={marineDashboardDiv11Width}
        >
          {shiftLines()}
        </div>
      );
      return resultshtml;
    }
  }

  function baysComposition(
    filteredBayDetail,
    j,
    loadingType,
    transactionAndDeviceStatus
  ) {
    if (j !== 0) {
      return (
        <TranslationConsumer>
          {(t) => (
            <table
              cellSpacing="0"
              cellPadding="0"
              className="marineDashboardTable1"
            >
              <tbody>
                <tr>
                  {transportationType === Constants.TransportationType.RAIL ? (
                    <td className="railDashboardLeftTd">
                      <div className="marineDashboardDiv1"></div>
                      <div
                        id={"divBayWagon" + j}
                        className="railDashboardShiftmentHtmlSelect1"
                      >
                        <select
                          value={selectedOption[j]}
                          onChange={(e) => {
                            onChangeSelectedOption(e.target.value, j);
                          }}
                        >
                          <option value="select">{t("Dest_Select")}</option>
                          {railOptions[j].map((railOption) => (
                            <option value={railOption.value}>
                              {railOption.innerHTML}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardLeftTd">
                      <div className="marineDashboardDiv1"></div>
                      <div className="marineDashboardDiv2">
                        {t(loadingType)}
                      </div>
                    </td>
                  )}

                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td className="roadDashboardTd2">
                      <div className="marineDashboardDiv1"></div>
                      <div
                        id={"divShipment" + j}
                        className="marineDashboardDiv3"
                      >
                        {getShipmentHTML(transactionAndDeviceStatus, j)}
                      </div>
                    </td>
                  ) : transportationType ===
                    Constants.TransportationType.RAIL ? (
                    <td className="marineDashboardTd2">
                      <div className="marineDashboardDiv1"></div>
                      <div
                        id={"divShipment" + j}
                        className="marineDashboardDiv3"
                      >
                        {getRailShipmentHTML(transactionAndDeviceStatus)}
                        {selectedOption[j] !== "select"
                          ? getTransactionHTML(
                            transactionAndDeviceStatus,
                            selectedOption[j]
                          )
                          : null}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardTd2">
                      <div className="marineDashboardDiv1"></div>
                      <div
                        id={"divShipment" + j}
                        className="marineDashboardDiv3"
                      >
                        {getShipmentHTML(transactionAndDeviceStatus, j)}
                      </div>
                    </td>
                  )}
                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td
                      id={"tdQueue" + j}
                      className="roadDashboardInQueue"
                      style={{ rowspan: "3" }}
                    >
                      <div className="marineDashboardDiv1"></div>
                      {getQueueHTML(transactionAndDeviceStatus)}
                    </td>
                  ) : null}
                </tr>
                <tr>
                  {transportationType === Constants.TransportationType.RAIL ? (
                    <td className="railDashboardLeftTd">
                      <div className="railDashboardDeviceStatusDiv1">
                        {t("DeviceList_Status")}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardLeftTd">
                      <div className="marineDashboardDiv2">
                        {t("DeviceList_Status")}
                      </div>
                    </td>
                  )}
                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td className="roadDashboardTd2">
                      <div id={"divDevice" + j} className="marineDashboardDiv4">
                        {getDeviceHTMLNew(transactionAndDeviceStatus)}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardTd2">
                      <div id={"divDevice" + j} className="marineDashboardDiv4">
                        {getDeviceHTMLNew(transactionAndDeviceStatus)}
                      </div>
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="marineDashboardLeftTd">
                    <div className="marineDashboardDiv9">
                      {filteredBayDetail.Code}
                    </div>
                  </td>
                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td className="roadDashboardTd2">
                      <div
                        id={"divTimeGraph" + j}
                        className="marineDashboardDiv10"
                      >
                        {timeGraphHTML()}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardTd2">
                      <div
                        id={"divTimeGraph" + j}
                        className="marineDashboardDiv10"
                      >
                        {timeGraphHTML()}
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          )}
        </TranslationConsumer>
      );
    } else {
      return (
        <TranslationConsumer>
          {(t) => (
            <table
              cellSpacing="0"
              cellPadding="0"
              className="marineDashboardTable1"
            >
              <tbody>
                <tr>
                  {transportationType === Constants.TransportationType.RAIL ? (
                    <td className="railDashboardLeftTd">
                      <div
                        id={"divBayWagon" + j}
                        className="railDashboardShiftmentHtmlSelect1"
                      >
                        <select
                          value={selectedOption[j]}
                          onChange={(e) => {
                            onChangeSelectedOption(e.target.value, j);
                          }}
                        >
                          <option value="select">{t("Dest_Select")}</option>
                          {railOptions[j].map((railOption) => (
                            <option value={railOption.value}>
                              {railOption.innerHTML}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardLeftTd">
                      <div className="marineDashboardDiv2">
                        {t(loadingType)}
                      </div>
                    </td>
                  )}
                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td className="roadDashboardTd2">
                      <div
                        id={"divShipment" + j}
                        className="marineDashboardDiv3"
                      >
                        {getShipmentHTML(transactionAndDeviceStatus, j)}
                      </div>
                    </td>
                  ) : transportationType ===
                    Constants.TransportationType.RAIL ? (
                    <td className="marineDashboardTd2">
                      <div
                        id={"divShipment" + j}
                        className="marineDashboardDiv3"
                      >
                        {getRailShipmentHTML(transactionAndDeviceStatus, j)}
                        {selectedOption[j] !== "select"
                          ? getTransactionHTML(
                            transactionAndDeviceStatus,
                            selectedOption[j]
                          )
                          : ""}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardTd2">
                      <div
                        id={"divShipment" + j}
                        className="marineDashboardDiv3"
                      >
                        {getShipmentHTML(transactionAndDeviceStatus, j)}
                      </div>
                    </td>
                  )}
                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td
                      id={"tdQueue" + j}
                      className="roadDashboardInQueue"
                      style={{ rowspan: "3" }}
                    >
                      {getQueueHTML(transactionAndDeviceStatus)}
                    </td>
                  ) : null}
                </tr>
                <tr>
                  {transportationType === Constants.TransportationType.RAIL ? (
                    <td className="railDashboardLeftTd">
                      <div className="railDashboardDeviceStatusDiv1">
                        {t("DeviceList_Status")}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardLeftTd">
                      <div className="marineDashboardDiv2">
                        {t("DeviceList_Status")}
                      </div>
                    </td>
                  )}
                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td className="roadDashboardTd2">
                      <div id={"divDevice" + j} className="marineDashboardDiv4">
                        {getDeviceHTMLNew(transactionAndDeviceStatus)}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardTd2">
                      <div id={"divDevice" + j} className="marineDashboardDiv4">
                        {getDeviceHTMLNew(transactionAndDeviceStatus)}
                      </div>
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="marineDashboardLeftTd">
                    <div className="marineDashboardDiv9">
                      {filteredBayDetail.Code}
                    </div>
                  </td>
                  {transportationType === Constants.TransportationType.ROAD ? (
                    <td className="roadDashboardTd2">
                      <div
                        id={"divTimeGraph" + j}
                        className="marineDashboardDiv10"
                      >
                        {timeGraphHTML()}
                      </div>
                    </td>
                  ) : (
                    <td className="marineDashboardTd2">
                      <div
                        id={"divTimeGraph" + j}
                        className="marineDashboardDiv10"
                      >
                        {timeGraphHTML()}
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          )}
        </TranslationConsumer>
      );
    }
  }

  function shiftLines() {
    var shiftLines = [];
    var TodayShifts = getCurrentShifts(CurrentShift);
    if (TodayShifts.length !== 0) {
      var shiftDuration = Math.floor(
        (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
      );
      var GraphPercentage = 100.0 / shiftDuration;

      for (var i = 0; i < TodayShifts.length; i++) {
        var shift = TodayShifts[i];
        if (
          shift.StartTime > CurrentShift.StartTime &&
          shift.StartTime < CurrentShift.EndTime
        ) {
          var minsdiff = Math.floor(
            (shift.StartTime - CurrentShift.StartTime) / 1000 / 60
          );
          var gap = (minsdiff + 0.8) * GraphPercentage;
          shiftLines.push(
            <div
              className="marineDashboardShiftLines1"
              style={{
                left: gap + "%",
              }}
            ></div>
          );
        }
        if (
          shift.EndTime > CurrentShift.StartTime &&
          shift.EndTime < CurrentShift.EndTime
        ) {
          var minsdiffs = Math.floor(
            (CurrentShift.EndTime - shift.EndTime) / 1000 / 60
          );
          gap = (minsdiffs - 0.5) * GraphPercentage;
          shiftLines.push(
            <div
              className="marineDashboardShiftLines2"
              style={{
                right: gap + "%",
              }}
            ></div>
          );
        }
        if (
          CurrentShift.StartTime > shift.StartTime &&
          CurrentShift.EndTime < shift.EndTime
        ) {
          shiftLines.push(<div className="marineDashboardShiftLines3"></div>);
        }
      }
    }
    return shiftLines;
  }

  function shiftNames() {
    var shiftName = [];
    var TodayShifts = getCurrentShifts(CurrentShift);
    if (TodayShifts.length !== 0) {
      var shiftDuration = Math.floor(
        (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
      );
      var GraphPercentage = 100.0 / shiftDuration;

      for (var i = 0; i < TodayShifts.length; i++) {
        var shift = TodayShifts[i];
        if (
          shift.StartTime > CurrentShift.StartTime &&
          shift.StartTime < CurrentShift.EndTime
        ) {
          var minsdiff = Math.floor(
            (shift.StartTime - CurrentShift.StartTime) / 1000 / 60
          );
          var gap = (minsdiff + 0.8) * GraphPercentage;
          shiftName.push(
            <div
              className="marineDashboardShiftName1"
              style={{
                left: gap + "%",
              }}
            >
              {/* {100 - gap > 10 ? `| Shift : ${shift.Name}` : "|"} */}
              {100 - gap > 10
                ? "| " + t("Dashboard_Shift") + " : " + shift.Name
                : "|"}
            </div>
          );
        }
        if (
          shift.EndTime > CurrentShift.StartTime &&
          shift.EndTime < CurrentShift.EndTime
        ) {
          var minsdiffs = Math.floor(
            (CurrentShift.EndTime - shift.EndTime) / 1000 / 60
          );
          gap = (minsdiffs - 0.5) * GraphPercentage;
          shiftName.push(
            <div
              className="marineDashboardShiftName2"
              style={{
                right: gap + "%",
              }}
            >
              {/* {100 - gap > 10 ? `Shift : ${shift.Name}  |` : "|"} */}
              {100 - gap > 10
                ? t("Dashboard_Shift") + " : " + shift.Name + " |"
                : "|"}
            </div>
          );
        }
        if (
          CurrentShift.StartTime > shift.StartTime &&
          CurrentShift.EndTime < shift.EndTime
        ) {
          shiftName.push(
            <div className="marineDashboardShiftName3">
              {/* {"|" + "Shift" + " : " + shift.Name} */}
              {`| Shift : ${shift.Name} `}
            </div>
          );
        }
      }
    }
    return shiftName;
  }

  function getCurrentShifts() {
    var todayShifts = [];
    var interDayShift = null;
    if (ShiftsData !== null && ShiftsData !== "") {
      for (var i = 0; i < ShiftsData.length; i++) {
        var shiftInfo = {
          Name: ShiftsData[i].Name,
          StartTime: ShiftsData[i].StartTime,
          EndTime: ShiftsData[i].EndTime,
        };
        shiftInfo.StartTime.setDate(CurrentShift.StartTime.getDate());
        shiftInfo.StartTime.setMonth(CurrentShift.StartTime.getMonth());
        shiftInfo.StartTime.setYear(CurrentShift.StartTime.getFullYear());
        shiftInfo.EndTime.setDate(CurrentShift.StartTime.getDate());
        shiftInfo.EndTime.setMonth(CurrentShift.StartTime.getMonth());
        shiftInfo.EndTime.setYear(CurrentShift.StartTime.getFullYear());
        if (shiftInfo.StartTime > shiftInfo.EndTime) {
          shiftInfo.EndTime.setDate(CurrentShift.StartTime.getDate() + 1);
          interDayShift = shiftInfo;
        }

        todayShifts.push(shiftInfo);
      }

      if (ShiftsData.length > 0) {
        var firstShift = {
          Name: ShiftsData[0].Name,
          StartTime: new Date(ShiftsData[0].StartTime),
          EndTime: new Date(ShiftsData[0].EndTime),
        };
        firstShift.EndTime.setDate(firstShift.EndTime.getDate() + 1);
        firstShift.StartTime.setDate(firstShift.StartTime.getDate() + 1);
        todayShifts.push(firstShift);
      }
      if (interDayShift !== null) {
        var interShifPrevObj = {
          Name: interDayShift.Name,
          StartTime: new Date(interDayShift.StartTime),
          EndTime: new Date(interDayShift.EndTime),
        };
        interShifPrevObj.EndTime.setDate(interShifPrevObj.EndTime.getDate() - 1);
        interShifPrevObj.StartTime.setDate(
          interShifPrevObj.StartTime.getDate() - 1
        );
        todayShifts.push(interShifPrevObj);

        var interShiftNextObj = {
          Name: interDayShift.Name,
          StartTime: new Date(interDayShift.StartTime),
          EndTime: new Date(interDayShift.EndTime),
        };
        interShiftNextObj.EndTime.setDate(
          interShiftNextObj.EndTime.getDate() + 1
        );
        interShiftNextObj.StartTime.setDate(
          interShiftNextObj.StartTime.getDate() + 1
        );
        todayShifts.push(interShiftNextObj);
      }
    }
    return todayShifts;
  }

  function timeGraphHtml() {
    return {
      ...(transportationType === Constants.TransportationType.ROAD ? (
        <table
          cellSpacing="0"
          cellPadding="0"
          id="tblFooter"
          className="roadTimeGraphHtml"
        >
          <tbody>
            <tr>
              <td className="timeGraphHtmlTd1" style={{ width: "13%" }}>
                <div style={{ float: "right" }}>
                  <span>
                    <Icon
                      id="spanGoLive"
                      name="redo"
                      size="medium"
                      onClick={btnGoLiveClick}
                    />
                  </span>
                  &nbsp;
                  <span>
                    <Icon
                      id="btnBackward"
                      name="caret-left"
                      size="medium"
                      onClick={btnBackwardClick}
                    />
                  </span>
                </div>
              </td>
              <td className="timeGraphHtmlTd2" style={{ width: "82.5%" }}>
                <div id="divFooter" className="timeGraphHtmlDiv1">
                  {timeGraphHtmlComposition()}
                </div>
              </td>
              <td style={{ width: "4.5%" }}>
                <div className="timeGraphHtmlDiv2">
                  <span>
                    <Icon
                      id="btnForward"
                      name="caret-right"
                      size="medium"
                      onClick={btnForwardClick}
                    />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (transportationType === Constants.TransportationType.RAIL ? (
        <table
          cellSpacing="0"
          cellPadding="0"
          id="tblFooter"
          className="timeGraphHtmlTable1"
        >
          <tbody>
            <tr>
              <td className="timeGraphHtmlTd1" style={{ width: "12%" }}>
                <div style={{ float: "right" }}>
                  <span>
                    <Icon
                      id="spanGoLive"
                      name="undo"
                      size="medium"
                      onClick={btnGoLiveClick}
                    />
                  </span>
                  &nbsp;
                  <span>
                    <Icon
                      id="btnBackward"
                      name="caret-left"
                      size="medium"
                      onClick={btnBackwardClick}
                    />
                  </span>
                </div>
              </td>
              <td className="timeGraphHtmlTd2">
                <div id="divFooter" className="timeGraphHtmlDiv1">
                  {timeGraphHtmlComposition()}
                </div>
              </td>
              <td style={{ width: "2%" }}>
                <div className="timeGraphHtmlDiv2" style={{ margineLeft: "-4px" }}>
                  <span>
                    <Icon
                      id="btnForward"
                      name="caret-right"
                      size="medium"
                      onClick={btnForwardClick}
                    />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table
          cellSpacing="0"
          cellPadding="0"
          id="tblFooter"
          className="timeGraphHtmlTable1"
          style={{ width: "100%" }}
        >
          <tbody>
            <tr>
              <td className="timeGraphHtmlTd1" style={{ width: "12%" }}>
                <div style={{ float: "right" }}>
                  <span>
                    <Icon
                      id="spanGoLive"
                      name="undo"
                      size="medium"
                      onClick={btnGoLiveClick}
                    />
                  </span>
                  &nbsp;
                  <span>
                    <Icon
                      id="btnBackward"
                      name="caret-left"
                      size="medium"
                      onClick={btnBackwardClick}
                    />
                  </span>
                </div>
              </td>
              <td className="timeGraphHtmlTd2" style={{ width: "88%" }}>
                <div id="divFooter" className="timeGraphHtmlDiv1">
                  {timeGraphHtmlComposition()}
                </div>
              </td>
              <td style={{ width: "2%" }}>
                <div className="timeGraphHtmlDiv2">
                  <span>
                    <Icon
                      id="btnForward"
                      name="caret-right"
                      size="medium"
                      onClick={btnForwardClick}
                    />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )))
    };
  }

  function timeGraphHtmlComposition() {
    var timeGraphHtml = [];
    try {
      var minsdiff = Math.floor(
        (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
      );
      var GraphPercentage = 100.0 / minsdiff;
      var graphDuration = 0;
      var requiredGraphPoints = minsdiff / 5;
      var time = new Date(CurrentShift.StartTime);

      var StartGraphTime = new Date(CurrentShift.StartTime);
      var startwidth = StartGraphTime.getMinutes() % 5;
      if (startwidth !== 0) {
        requiredGraphPoints += 1;
      }
      var longWidth = parseInt(time.getMinutes() % 30);
      if (longWidth !== 0) {
        time.setMinutes(time.getMinutes() - parseInt(longWidth));
      }
      for (var i = 1; i <= requiredGraphPoints; i++) {
        if (i === 1) {
          if (longWidth === 0) {
            timeGraphHtml.push(
              <div
                className="marineFooterTimeDiv1"
                style={{ width: 5 * GraphPercentage + "%", textIndent: "50%" }}
              >
                {("0" + time.getHours()).slice(-2) +
                  ":" +
                  ("0" + time.getMinutes()).slice(-2)}
              </div>
            );
            graphDuration += 5;
          } else {
            if (startwidth !== 0) {
              if ((StartGraphTime.getMinutes() + (5 - startwidth)) % 30 !== 0) {
                timeGraphHtml.push(
                  <div
                    className="marineFooterTimeDiv1"
                    style={{ width: (5 - startwidth) * GraphPercentage + "%" }}
                  ></div>
                );
              } else {
                time.setMinutes(time.getMinutes() + 30);
                timeGraphHtml.push(
                  <div
                    className="marineFooterTimeDiv1"
                    style={{ width: (5 - startwidth) * GraphPercentage + "%", textIndent: "50%" }}
                  >
                    {("0" + time.getHours()).slice(-2) +
                      ":" +
                      ("0" + time.getMinutes()).slice(-2)}
                  </div>
                );
              }
              graphDuration += StartGraphTime.getMinutes() + (10 - startwidth);
            } else {
              if ((StartGraphTime.getMinutes() + 5) % 30 !== 0) {
                timeGraphHtml.push(
                  <div
                    className="marineFooterTimeDiv1"
                    style={{ width: 5 * GraphPercentage + "%" }}
                  ></div>
                );
              } else {
                time.setMinutes(time.getMinutes() + 30);
                timeGraphHtml.push(
                  <div
                    className="marineFooterTimeDiv1"
                    style={{ width: 5 * GraphPercentage + "%", textIndent: "50%" }}
                  >
                    {("0" + time.getHours()).slice(-2) +
                      ":" +
                      ("0" + time.getMinutes()).slice(-2)}
                  </div>
                );
              }
              graphDuration += StartGraphTime.getMinutes() + 10;
            }
          }
        } else if (i === requiredGraphPoints) {
          if (startwidth !== 0) {
            if ((StartGraphTime.getMinutes() - startwidth) % 30 !== 0) {
              timeGraphHtml.push(
                <div
                  className="marineFooterTimeDiv1"
                  style={{ width: startwidth * GraphPercentage + "%" }}
                ></div>
              );
            } else {
              time.setMinutes(time.getMinutes() + 30);
              timeGraphHtml.push(
                <div
                  className="marineFooterTimeDiv1"
                  style={{ width: startwidth * GraphPercentage + "%" }}
                ></div>
              );
            }
            graphDuration += StartGraphTime.getMinutes() + (5 - startwidth);
          } else {
            if (StartGraphTime.getMinutes() % 30 !== 0) {
              timeGraphHtml.push(
                <div
                  className="marineFooterTimeDiv1"
                  style={{ width: 5 * GraphPercentage + "%" }}
                ></div>
              );
            } else {
              time.setMinutes(time.getMinutes() + 30);
              timeGraphHtml.push(
                <div
                  className="marineFooterTimeDiv1"
                  style={{ width: 5 * GraphPercentage + "%", textIndent: "50%" }}
                >
                  {("0" + time.getHours()).slice(-2) +
                    ":" +
                    ("0" + time.getMinutes()).slice(-2)}
                </div>
              );
            }
            graphDuration += StartGraphTime.getMinutes() + 5;
          }
        } else {
          if (graphDuration % 30 === 0) {
            time.setMinutes(time.getMinutes() + 30);
            timeGraphHtml.push(
              <div
                className="marineFooterTimeDiv1"
                style={{ width: 5 * GraphPercentage + "%", textIndent: "50%" }}
              >
                {("0" + time.getHours()).slice(-2) +
                  ":" +
                  ("0" + time.getMinutes()).slice(-2)}
              </div>
            );
          } else {
            timeGraphHtml.push(
              <div
                className="marineFooterTimeDiv1"
                style={{ width: 5 * GraphPercentage + "%" }}
              ></div>
            );
          }
          graphDuration += 5;
        }
      }
      timeGraphHtml.push(
        <table width="100%">
          <tbody>
            <tr>
              <td align="left">
                {CurrentShift.StartTime.getDate() +
                  "-" +
                  (CurrentShift.StartTime.getMonth() + 1) +
                  "-" +
                  CurrentShift.StartTime.getFullYear()}
              </td>
              <td align="right">
                {CurrentShift.EndTime.getDate() +
                  "-" +
                  (CurrentShift.EndTime.getMonth() + 1) +
                  "-" +
                  CurrentShift.EndTime.getFullYear()}
              </td>
            </tr>
          </tbody>
        </table>
      );
      return timeGraphHtml;
    } catch (error) {
      console.log("error in timeGraphHtmlComposition " + error);
      return timeGraphHtml;
    }
  }

  function getCompartmentsHTML() {
    var compartmentsHTML = [];
    for (var j = 0; j < filteredBayDetails.length; j++) {
      if (j !== 0) {
        compartmentsHTML.push(
          <div
            id={"divCompartment" + j}
            className="MarineDashboardCompartmentsDiv1"
          >
            <div className="MarineDashboardCompartmentsDiv2"></div>
            <div className="MarineDashboardCompartmentsDiv3">
              {getCompartmentsHTMLComposition(objOrderDetails[j])}
            </div>
          </div>
        );
      } else {
        compartmentsHTML.push(
          <div
            id={"divCompartment" + j}
            className="MarineDashboardCompartmentsDiv1"
          >
            <div className="MarineDashboardCompartmentsDiv3">
              {getCompartmentsHTMLComposition(objOrderDetails[j])}
            </div>
          </div>
        );
      }
    }
    return compartmentsHTML;
  }

  function getCompartmentsHTMLComposition(orderDetails) {
    var resultshtml = [];
    try {
      if (orderDetails === undefined || orderDetails === null) {
        if (transportationType === Constants.TransportationType.MARINE) {
          for (var i = 0; i < DashboardConfig.NoOfMarineCompartments; i++) {
            resultshtml.push(
              <div className="marineDashboardCompartmentDiv">
                <div className="filled"></div>
                <span className="LiveCompartmentFont">{i + 1}</span>
              </div>
            );
          }
        } else {
          for (var j = 0; j < DashboardConfig.NoOfCompartments; j++) {
            resultshtml.push(
              <div className="roadDashboardCompartmentDiv">
                <div className="filled"></div>
                <span className="LiveCompartmentFont">{j + 1}</span>
              </div>
            );
          }
        }

        resultshtml.push(
          <table cellSpacing="0" cellPadding="0" width="100%">
            <tbody>
              <tr>
                <td align="left" className="LiveCompartmentFont">
                  {t("Dashboard_ActiveTransctions")}
                </td>
              </tr>
            </tbody>
          </table>
        );
      } else {
        for (var k = 0; k < orderDetails.CompartmentInfoList.length; k++) {
          var compartment = orderDetails.CompartmentInfoList[k];
          var percentage =
            (compartment.LoadedQty / compartment.PlannedQty) * 100;
          percentage =
            (orderDetails.IsShipment ? percentage : 100.0 - percentage) + "%";
          var isDispatch = orderDetails.IsShipment ? 1 : 0;

          var compOuterStyle = {};
          var gradientCOlor =
            compartment.Product == null
              ? "transparent"
              : "#" + compartment.Color;
          switch (compartment.Status) {
            case "EMPTY":
            case "UNLOAD_NOTSTARTED":
            case "LOADING":
            case "PART_FILLED":
            case "INTERRUPTED":
            case "PART_UNLOADED":
            case "UNLOADING":
            case "FORCE_COMPLETED":
            case "COMPLETED":
            case "DECANTED":
              compOuterStyle = {
                cursor: "pointer",
                backgroundColor: "transparent",
                backgroundImage:
                  "linear-gradient(135deg, transparent 24%, " +
                  gradientCOlor +
                  " 25%, " +
                  gradientCOlor +
                  " 26%, transparent 27%, transparent 74%, " +
                  gradientCOlor +
                  " 75%, " +
                  gradientCOlor +
                  " 76%, transparent 77%, transparent)",
                backgroundSize: "10px 10px",
              };
              break;
            case "OVER_FILLED":
              compOuterStyle = {
                borderTop: "1px solid #EE3124",
                cursor: "pointer",
                backgroundColor: "transparent",
                backgroundImage:
                  "linear-gradient(135deg, transparent 24%," +
                  gradientCOlor +
                  " 25%, " +
                  gradientCOlor +
                  " 26%, transparent 27%, transparent 74%, " +
                  gradientCOlor +
                  " 75%, " +
                  gradientCOlor +
                  " 76%, transparent 77%, transparent)",
                backgroundSize: "10px 10px",
              };
              break;
            case "OVER_UNLOADED":
              compOuterStyle = {
                borderBootom: "1px solid #EE3124",
                cursor: "pointer",
                backgroundColor: "transparent",
                backgroundImage:
                  "linear-gradient(135deg, transparent 24%, " +
                  gradientCOlor +
                  " 25%, rgba(0, 0, 0, .3) 26%, transparent 27%, transparent 74%, " +
                  gradientCOlor +
                  " 75%, " +
                  gradientCOlor +
                  " 76%, transparent 77%, transparent)",
                backgroundSize: "10px 10px",
              };
              break;
            default:
              compOuterStyle = {};
              break;
          }
          resultshtml.push(
            <div>
              <div className="marineDashboardCompartmentDiv">
                <Popup
                  className="popup-theme-wrap operatorDBPopup"
                  style={{ width: 160, padding: 15 }}
                  element={
                    <div style={compOuterStyle} className="filled">
                      <div
                        className="filling"
                        style={{
                          bottom: "0",
                          backgroundColor:
                            compartment.Product == null
                              ? "transparent"
                              : "#" + compartment.Color + "",
                          height: percentage + "",
                        }}

                      // ref={(node) => {
                      //   if (node) {
                      //     node.style.setProperty(
                      //       "background-color",
                      //       compartment.Product == null
                      //         ? "transparent"
                      //         : "#" + compartment.Color + "",
                      //       "important"
                      //     );
                      //     node.style.setProperty(
                      //       "height",
                      //       percentage + "",
                      //       "important"
                      //     );
                      //   }
                      // }}
                      ></div>
                    </div>
                  }
                  hoverable={false}
                  on="click"
                >
                  {CompartmentHoverDetails(
                    compartment.Code,
                    compartment.Customer,
                    compartment.SFL.toLocaleString() + " " + orderDetails.UOM,
                    compartment.PlannedQty.toLocaleString() +
                    " " +
                    orderDetails.UOM,
                    compartment.LoadedQty.toLocaleString() +
                    " " +
                    orderDetails.UOM,
                    isDispatch
                  )}
                </Popup>

                <span className="LiveCompartmentFont">{compartment.Code}</span>
              </div>
            </div>
          );
        }
        resultshtml.push(
          <TranslationConsumer>
            {(t) => (
              <table
                cellSpacing="0"
                cellPadding="0"
                width="100%"
                className="LiveCompartmentFont"
              >
                <tbody>
                  <tr style={{ fontWeight: "bold" }}>
                    <td align="left">
                      {orderDetails.IsShipment
                        ? t("RoadDashboard_CurrentShipment")
                        : t("RoadDashboard_CurrentReceipt")}
                    </td>
                    <td align="right">
                      {t(
                        transportationType === Constants.TransportationType.ROAD
                          ? "DriverInfo_Code"
                          : "CaptainInfo_Code"
                      ) +
                        "- " +
                        (orderDetails.Driver == null
                          ? "      "
                          : orderDetails.Driver)}
                    </td>
                  </tr>
                  <tr style={{ fontWeight: "bold" }}>
                    <td align="left">{orderDetails.Code} </td>
                    <td align="right">
                      {t(
                        transportationType === Constants.TransportationType.ROAD
                          ? "Vehicle_Code"
                          : transportationType ===
                            Constants.TransportationType.RAIL
                            ? "Wagon_Code"
                            : "Vessel_Code"
                      ) +
                        "- " +
                        orderDetails.Vehicle}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </TranslationConsumer>
        );
      }
      return resultshtml;
    } catch (error) {
      console.log("error in getCompartmentsHTMLComposition" + error);
      return "";
    }
  }

  function getQueueHTML(objShipment) {
    try {
      if (objShipment !== undefined) {
        var shipmentHtml = [];
        var QueueCount =
          objShipment.QueueCount > 3 ? 3 : objShipment.QueueCount;
        if (QueueCount > 0) {
          var divHeight = QueueCount * 15 + "px";
          var divMarginTop =
            parseInt(divHeight) / parseInt(QueueCount - 1) + 10 + "px";
          divMarginTop = "3px";

          var IsOdd = QueueCount % 2;

          var shipmentHtmlComposeQueueCount1 = [];
          for (var i = 0; i < QueueCount; i++) {
            if (i === 0) {
              shipmentHtmlComposeQueueCount1.push(
                <div className="roadDashboardDiv1"></div>
              );
            } else if (i === QueueCount - 1) {
              shipmentHtmlComposeQueueCount1.push(
                <div className="roadDashboardDiv2"></div>
              );
            } else {
              shipmentHtmlComposeQueueCount1.push(
                <div className="roadDashboardDiv3"></div>
              );
            }
          }

          divMarginTop = "1px";
          // var bCode = "'" + objShipment.BayCode + "'";
          var shipmentHtmlComposeQueueCount2 = [];
          for (var j = 0; j < QueueCount; j++) {
            if (IsOdd === 0 && j === 1) {
              shipmentHtmlComposeQueueCount2.push(
                <div className="roadDashboardDiv8"></div>
              );
            } else {
              shipmentHtmlComposeQueueCount2.push(
                <div className="roadDashboardDiv9"></div>
              );
            }
          }

          if (objShipment.QueueCount > 3) {
            shipmentHtmlComposeQueueCount2.push(
              <div className="roadDashboardDiv10"></div>
            );
          }
          shipmentHtml.push(
            <div className="roadDashboardDiv4">
              <div className="roadDashboardDiv5">&nbsp;</div>
              <div className="roadDashboardDiv6"></div>
              <div className="roadDashboardDiv7"></div>
              <div
                style={{
                  display: "inline-block",
                  height: divHeight,
                  marginTop: divMarginTop,
                  float: "left",
                  width: "20px",
                }}
              >
                {shipmentHtmlComposeQueueCount1}
              </div>
              <Popup
                style={{ padding: 15 }}
                className="popup-theme-wrap operatorDBPopup"
                element={
                  <div
                    style={{
                      display: "inline-block",
                      height: "1px",
                      marginTop: divMarginTop,
                      float: "left",
                      width: "60px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      getQueuedTransaction(objShipment.BayCode);
                    }}
                  >
                    {shipmentHtmlComposeQueueCount2}
                  </div>
                }
                hoverable={false}
                on="click"
              >
                {drawQueuedTransactions()}
              </Popup>
            </div>
          );
        } else {
          shipmentHtml.push(
            <div className="roadDashboardDiv11">
              <div className="roadDashboardDiv12">&nbsp;</div>
              <div className="roadDashboardDiv13"></div>
              <div className="roadDashboardDiv14">
                <Icon
                  root="building"
                  name="close-circled"
                  size="small"
                  className="roadDashboardDiv15"
                />
              </div>
            </div>
          );
        }

        return shipmentHtml;
      }
    } catch (error) {
      console.log("error in getQueueHTML " + error);
      return "";
    }
  }

  function drawQueuedTransactions() {
    var hoverHtml = [];
    if (QueueDetails !== null && QueueDetails.length > 0) {
      hoverHtml.push(
        <div className="roadDashboardQueuedTitle">
          <h4>
            {t("RoadDashboard_Total_in_queue") + " - " + QueueDetails.length}
          </h4>
        </div>
      );
      var hoverHtmlCompose = [];
      for (var i = 0; i < QueueDetails.length; i++) {
        if (i !== QueueDetails.length - 1 && QueueDetails.length > 1) {
          hoverHtmlCompose.push(
            <div
              className="marineDashboardQueuedTransactionsDiv2"
              style={{ left: i * 195 + "px", height: "130px" }}
            >
              <div style={{ marginBottom: "10px" }}>
                {`${t("RoadDashboard_QueueTranNo")} -  ${QueueDetails[i].TransactionCode
                  }`}
              </div>
              <div style={{ marginBottom: "10px" }}>
                {t("RoadDashboard_Driver_Code") +
                  " - " +
                  (QueueDetails[i].Driver === null
                    ? "     - "
                    : QueueDetails[i].Driver)}
              </div>
              <div style={{ marginBottom: "10px" }}>
                {`${t("RoadDashboard_Vehicle_Code")} - ${QueueDetails[i].vehicle
                  }`}
              </div>
            </div>
          );
        } else {
          hoverHtmlCompose.push(
            <div
              className="marineDashboardQueuedTransactionsDiv3"
              style={{ left: i * 195 + "px" }}
            >
              <div style={{ marginBottom: "10px" }}>
                {`${t("RoadDashboard_QueueTranNo")} - ${QueueDetails[i].TransactionCode
                  }`}
              </div>
              <div style={{ marginBottom: "10px" }}>
                {t("RoadDashboard_Driver_Code") +
                  " - " +
                  (QueueDetails[i].Driver === null
                    ? "     - "
                    : QueueDetails[i].Driver)}
              </div>
              <div style={{ marginBottom: "10px" }}>
                {`${t("RoadDashboard_Vehicle_Code")} - ${QueueDetails[i].vehicle
                  }`}
              </div>
            </div>
          );
        }
      }
      hoverHtml.push(
        <div
          style={{ width: QueueDetails.length * 195 + "px", height: "130px" }}
        >
          <div>
            <span style={{ font: "normal bold 18px Arial" }}></span>
          </div>
          <div style={{ fontSize: "13px" }}>{hoverHtmlCompose}</div>
        </div>
      );
    }
    return hoverHtml;
  }

  function CompartmentHoverDetails(
    code,
    customer,
    SFL,
    PlanQty,
    CurrentQty,
    isDispatch
  ) {
    return (
      <div className="marineDashboardCompartmentLiveDetailsDiv">
        <div className="marineDashboardCompartmentHoverDetailsDiv1">
          <span className="marineDashboardCompartmentHoverDetailsSpan1">
            {t("MarineDashboard_Compartment") + " - " + code}
          </span>
          <br />
          <span className="marineDashboardCompartmentHoverDetailsSpan2">
            {(isDispatch === 1
              ? t("MarineDashboard_Customer")
              : t("MarineDashboard_Supplier")) +
              " : " +
              customer}
          </span>
          <br />
        </div>
        <div className="marineDashboardCompartmentHoverDetailsDiv2">
          <span className="marineDashboardCompartmentHoverDetailsSpan3">
            {t("MarineDashboard_SFL") + " : " + SFL}
          </span>
          <br />
        </div>
        <div className="marineDashboardCompartmentHoverDetailsDiv2">
          <span className="marineDashboardCompartmentHoverDetailsSpan3">
            {t("MarineDashboard_Planned_Quantity") + " : "}
          </span>
          <br />
          <span className="marineDashboardCompartmentHoverDetailsSpan1">
            {PlanQty}
          </span>
          <br />
          <span className="marineDashboardCompartmentHoverDetailsSpan3">
            {t("MarineDashboard_Current_Quantity") + " : "}
          </span>
          <br />
          <span className="marineDashboardCompartmentHoverDetailsSpan1">
            {CurrentQty}
          </span>
          <br />
        </div>
      </div>
    );
  }

  function getShipmentHTML(objShipment, parentid) {
    try {
      if (objShipment !== undefined) {
        var leakageObjects = [];
        var shipmentHtml = [];
        var shiftDuration = Math.floor(
          (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
        );
        var GraphPercentage = 100.0 / shiftDuration;
        for (var i = 0; i < objShipment.TransactionAuditList.length; i++) {
          let shipment = objShipment.TransactionAuditList[i];
          var gap = 0;
          var shipmentStartTime = "";
          if (shipment.StartTime != null)
            shipmentStartTime = new Date(shipment.StartTime);
          var shipmentEndTime = null;
          if (shipment.EndTime != null)
            shipmentEndTime = new Date(shipment.EndTime);
          if (shipmentStartTime > CurrentShift.StartTime) {
            var minsdiff = Math.floor(
              (shipmentStartTime - CurrentShift.StartTime) / 1000 / 60
            );
            gap = minsdiff * GraphPercentage;
          }
          var ShipmentGraphPercentage = 0;
          if (shipmentEndTime != null) {
            if (
              shipmentEndTime < CurrentShift.EndTime &&
              shipmentStartTime < CurrentShift.StartTime
            ) {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((shipmentEndTime - CurrentShift.StartTime) / 1000 / 60);
            } else if (
              shipmentEndTime > CurrentShift.EndTime &&
              shipmentStartTime < CurrentShift.StartTime
            ) {
              ShipmentGraphPercentage = 100;
            } else if (
              shipmentStartTime > CurrentShift.StartTime &&
              shipmentEndTime < CurrentShift.EndTime
            ) {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((shipmentEndTime - shipmentStartTime) / 1000 / 60);
            } else if (
              shipmentEndTime > CurrentShift.EndTime &&
              shipmentStartTime > CurrentShift.StartTime
            ) {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((CurrentShift.EndTime - shipmentStartTime) / 1000 / 60);
            }
          } else {
            if (shipmentStartTime < CurrentShift.StartTime) {
              ShipmentGraphPercentage = 100;
            } else {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((CurrentShift.EndTime - shipmentStartTime) / 1000 / 60);
            }
          }
          let shipDevID = "Bay_" + parentid + "Transaction_" + i;
          // var objShipmentCode = "'" + shipment.TransactionCode + "'";
          // var objBayCode = "'" + parentid + "'";
          // var objType = "'" + shipment.TransactionType + "'";
          // var objTimeTaken = "'" + shipment.TotalTime + "'";

          if (
            shipment.TransactionType === 0 ||
            shipment.TransactionType === 1
          ) {
            if (
              (timetaken === 0 ||
                (shipment.TotalTime <= timetaken && timetaken !== 75) ||
                (timetaken === 75 && shipment.TotalTime > 60)) &&
              (viewShipmentStatus === 0 ||
                (viewShipmentStatus === 1 && shipment.IsCompleted) ||
                (viewShipmentStatus === 2 && shipment.EndIndicator === 3) ||
                (viewShipmentStatus === 3 && shipment.HasAlarmOccured))
            ) {
              var radiusstyle = {};
              if (
                shipment.StartIndicator === 1 &&
                shipmentStartTime > CurrentShift.StartTime
              )
                radiusstyle = {
                  borderTopLeftRadius: "12px",
                  borderBottomLeftRadius: "12px",
                };
              else if (shipment.StartIndicator === 2) {
                radiusstyle = {};
              } else if (
                shipment.StartIndicator === 3 &&
                shipmentStartTime < CurrentShift.StartTime
              )
                radiusstyle = {
                  borderLeftColor: "red",
                  borderLeftWidth: "10px",
                  borderLeftStyle: "solid",
                };
              if (
                shipment.EndIndicator === 1 &&
                !(
                  shipmentEndTime === null ||
                  shipmentEndTime > CurrentShift.EndTime
                )
              ) {
                radiusstyle["borderTopRightRadius"] = "12px";
                radiusstyle["borderBottomRightRadius"] = "12px";
              } else if (shipment.StartIndicator === 2) {
              } else if (
                shipment.EndIndicator === 3 &&
                !(
                  shipmentEndTime === null ||
                  shipmentEndTime > CurrentShift.EndTime
                )
              ) {
                radiusstyle["borderRightColor"] = "red";
                radiusstyle["borderRightWidth"] = "10px";
                radiusstyle["borderRightStyle"] = "solid";
              }
              var shipBackColor = shipment.HasAlarmOccured
                ? "marineDashboardShipmentDiv2Red"
                : "marineDashboardShipmentDiv2";
              var shipClass =
                shipmentEndTime === null ? "LiveShipmentBar" : "ShipmentBar";

              var shipstyle =
                shipmentEndTime === null
                  ? {
                    zIndex: "1",
                    width: ShipmentGraphPercentage + "%",
                    borderBottom: "dashed 1px #D0D0D0",
                    position: "absolute",
                    left: gap + "%",
                  }
                  : {
                    zIndex: "1",
                    width: ShipmentGraphPercentage + "%",
                    cursor: "pointer",
                    borderBottom: "dashed 1px #D0D0D0",
                    position: "absolute",
                    left: gap + "%",
                  };

              var shipmentHtmlCompose = [];
              if (shipmentEndTime !== null) {
              }
              shipmentHtmlCompose.push(
                <div className="marineDashboardShipmentDiv4">
                  {shipmentStartTime < CurrentShift.StartTime ||
                    shipmentEndTime === null ||
                    shipmentEndTime > CurrentShift.EndTime
                    ? ""
                    : ("0" + shipmentEndTime.getHours()).slice(-2) +
                    ":" +
                    ("0" + shipmentEndTime.getMinutes()).slice(-2)}
                </div>
              );

              shipmentHtml.push(
                <div>
                  <Popup
                    position="top left"
                    hoverable={false}
                    open={openBoolean.key === shipDevID ? openBoolean.value : false}
                    element={
                      <div
                        id={shipDevID}
                        className={
                          shipment.HasAlarmOccured
                            ? "failureship "
                            : "shipment "
                        }
                        data-toggle="popover"
                        style={shipstyle}
                        onClick={() => {
                          getOrderDetails(
                            shipment.TransactionCode,
                            shipment.TransactionType === 0
                              ? "Dispatch"
                              : shipment.TransactionType === 1
                                ? "Receipt"
                                : "",
                            shipment.TotalTime
                          );
                          handleOpen(shipDevID, true);
                        }}
                      >
                        <div className="marineDashboardShipmentDiv1">
                          {shipmentStartTime < CurrentShift.StartTime ||
                            shipmentEndTime == null ||
                            shipmentEndTime > CurrentShift.EndTime
                            ? ""
                            : shipment.TransactionCode}
                        </div>
                        <div className={shipClass} style={radiusstyle}></div>
                        <div className={shipBackColor}>
                          <div className="marineDashboardShipmentDiv3">
                            {shipmentStartTime < CurrentShift.StartTime ||
                              shipmentEndTime == null ||
                              shipmentEndTime > CurrentShift.EndTime
                              ? ""
                              : ("0" + shipmentStartTime.getHours()).slice(-2) +
                              ":" +
                              ("0" + shipmentStartTime.getMinutes()).slice(
                                -2
                              )}
                          </div>
                          {shipmentHtmlCompose}
                        </div>
                      </div>
                    }
                    on="click"
                  >
                    {orderDetails !== null &&
                      orderDetails.CompartmentInfoList !== null ? (
                      <TranslationConsumer>
                        {(t) => (
                          <div
                            className="operatorOrder"
                            onMouseEnter={() => {
                              handleOpen(shipDevID, true);
                            }}
                            onMouseLeave={() => {
                              handleOpen(shipDevID, false);
                            }}
                            style={{
                              width: (
                                orderloadedPartCommpartmentList.length < 4 ? "720px" : (
                                  orderloadedPartCommpartmentList.length === 4 ? "800px" : "930px"
                                )
                              )
                            }}
                          >
                            <div className="operatorOrderButtonColumn">
                              <div
                                className={
                                  "operatorOrderForceClose " +
                                  (orderDetails.Status !== "CLOSED" &&
                                    orderDetails.Status !== "LOADING" &&
                                    orderDetails.Status !== "UNLOADING" &&
                                    ((orderDetails.TransactionType === 0 &&
                                      hdnFGShipClose) ||
                                      (orderDetails.TransactionType === 1 &&
                                        hdnFGRecClose))
                                    ? "operatorOrderForceCloseEnable"
                                    : "operatorOrderForceCloseDisable")
                                }
                                // style={
                                //   orderDetails.Status !== "CLOSED" &&
                                //   orderDetails.Status !== "LOADING" &&
                                //   orderDetails.Status !== "UNLOADING" &&
                                //   ((orderDetails.TransactionType === 0 &&
                                //     hdnFGShipClose) ||
                                //     (orderDetails.TransactionType === 1 &&
                                //       hdnFGRecClose))
                                //     ? {
                                //         backgroundColor: "#F0F0F0",
                                //         cursor: "pointer",
                                //       }
                                //     : { color: "#D3D3D3" }
                                // }
                                onClick={() => {
                                  if (
                                    orderDetails.Status !== "CLOSED" &&
                                    orderDetails.Status !== "LOADING" &&
                                    orderDetails.Status !== "UNLOADING" &&
                                    ((orderDetails.TransactionType === 0 &&
                                      hdnFGShipClose) ||
                                      (orderDetails.TransactionType === 1 &&
                                        hdnFGRecClose))
                                  ) {
                                    forceClose(
                                      orderDetails.Code,
                                      orderDetails.TransactionType === 0
                                        ? "Dispatch"
                                        : orderDetails.TransactionType === 1
                                          ? "Receipt"
                                          : ""
                                    );
                                  }
                                }}
                              >
                                {t("OperatorDashboard_OrderForceClosure")}
                              </div>
                              <div
                                className={
                                  "operatorOrderPrint " +
                                  (orderDetails.Status === "CLOSED" &&
                                    ((orderDetails.TransactionType === 0 &&
                                      hdnFGPrintBOL) ||
                                      (orderDetails.TransactionType === 1 &&
                                        hdnFGPrintBOD))
                                    ? "operatorOrderPrintClosed"
                                    : "operatorOrderPrintOpen")
                                }
                                // style={

                                //     ? {
                                //         backgroundColor: "#F0F0F0",
                                //         fontWeight: "bold",
                                //         cursor: "pointer",
                                //       }
                                //     : { color: "#D3D3D3" }
                                // }
                                onClick={() => {
                                  if (
                                    orderDetails.Status === "CLOSED" &&
                                    ((orderDetails.TransactionType === 0 &&
                                      hdnFGPrintBOL) ||
                                      (orderDetails.TransactionType === 1 &&
                                        hdnFGPrintBOD))
                                  ) {
                                    print(
                                      orderDetails.Code,
                                      orderDetails.TransactionType === 0
                                        ? "Dispatch"
                                        : orderDetails.TransactionType === 1
                                          ? "Receipt"
                                          : ""
                                    );
                                  }
                                }}
                              >
                                {orderDetails.TransactionType === 0
                                  ? t("OperatorDashboard_OrderPrintBOL")
                                  : t("OperatorDashboard_OrderPrintBOD")}
                              </div>
                            </div>

                            <div
                              className="operatorOrdertransactionInfo"
                              style={
                                transportationType ===
                                  Constants.TransportationType.ROAD
                                  ? { paddingBottom: 0 }
                                  : {}
                              }
                            >
                              <div style={{ fontWeight: "bold" }}>
                                {orderDetails.TransactionType === 0
                                  ? "Shipment"
                                  : orderDetails.TransactionType === 1
                                    ? "Receipt"
                                    : ""}
                                {" No - " + orderDetails.Code}
                              </div>
                              <Divider></Divider>
                              <div
                                style={{
                                  borderBottom: "1px dashed #A0A0A0",
                                  paddingBottom: 15,
                                  marginBottom: 15,
                                }}
                              >
                                {transportationType ===
                                  Constants.TransportationType.ROAD ? (
                                  <div style={{ marginBottom: 5 }}>
                                    {t("OperatorDashboard_OrderDriverCode") +
                                      " - "}
                                    <span style={{ fontWeight: "bold" }}>
                                      {orderDetails.Driver === null
                                        ? "- "
                                        : orderDetails.Driver}
                                    </span>
                                  </div>
                                ) : (
                                  <div></div>
                                )}

                                <div>
                                  {t(
                                    transportationType ===
                                      Constants.TransportationType.ROAD
                                      ? "Vehicle_Code"
                                      : transportationType ===
                                        Constants.TransportationType.RAIL
                                        ? "Wagon_Code"
                                        : "OperatorDashboard_OrderVesselCode"
                                  ) + " - "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {orderDetails.Vehicle}
                                  </span>
                                </div>
                              </div>
                              <List horizontal={true}>
                                <List.Content>
                                  <div className="operatorOrdertransactionInfoTitle">
                                    {t("OperatorDashboard_OrderStatus") + ":"}
                                  </div>
                                  <div className="operatorOrdertransactionInfoTitle">
                                    {t("OperatorDashboard_OrderAlarmsOccured") +
                                      ":"}
                                  </div>
                                  <div className="operatorOrdertransactionInfoTitle">
                                    {t("OperatorDashboard_OrderTimeTakne") +
                                      ":"}
                                  </div>
                                </List.Content>
                                <List.Content>
                                  <div className="operatorOrdertransactionInfoContent">
                                    {orderDetails.Status}
                                  </div>
                                  <div
                                    className="operatorOrdertransactionInfoContent"
                                    style={
                                      orderDetails.AlarmCount > 0
                                        ? { color: "red" }
                                        : {}
                                    }
                                  >
                                    {orderDetails.AlarmCount.toLocaleString()}
                                  </div>
                                  <div className="operatorOrdertransactionInfoContent">
                                    {orderDetails.TotalTime.toLocaleString() +
                                      " " +
                                      t("OperatorDashboard_OrderMin")}
                                  </div>
                                </List.Content>
                              </List>
                              <Divider direction="vertical"></Divider>
                            </div>

                            <div className="operatorOrderProductAndCompartmentDetails">
                              <div
                                className="operatorOrderProductAndCompartmentDetailsTitle"
                                style={
                                  orderloadedOtherCommpartmentList.length > 0
                                    ? { paddingTop: 2, paddingBottom: 12 }
                                    : {}
                                }
                              >
                                {t(
                                  "OperatorDashboard_OrderProductAndCompartment"
                                )}
                              </div>
                              <div style={{ display: "flex" }}>
                                <div
                                  className="operatorOrderProduct"
                                >
                                  {orderProductDetails.map((item) => {
                                    let prodColor =
                                      item.Color !== ""
                                        ? "#" + item.Color
                                        : "#000000";
                                    return (
                                      <div
                                        style={{
                                          color: prodColor,
                                          marginBottom: 5,
                                        }}
                                      >
                                        <div
                                          className="operatorOrderCircle"
                                          style={{
                                            float: "left",
                                            marginTop: 2,
                                            marginLeft: 3,
                                            backgroundColor: prodColor,
                                          }}
                                        ></div>
                                        <div style={{ textAlign: "center" }}>
                                          {item.Product}
                                        </div>
                                        <div style={{ fontWeight: "bold" }}>
                                          {item.LoadedQty.toLocaleString() +
                                            " " +
                                            orderDetails.UOM}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="operatorOrderCompartmentDetails">
                                  <div
                                    style={{
                                      borderBottom: "1px dashed #A0A0A0",
                                      paddingBottom: 8,
                                      marginBottom: 8,
                                    }}
                                  >
                                    <List horizontal={true}>
                                      <List.Content>
                                        <div className="operatorOrderCompartmentDetailsListTitle"></div>
                                        <div className="operatorOrderCompartmentDetailsListTitle">
                                          {t("OperatorDashboard_OrderProduct")}
                                        </div>
                                        <div className="operatorOrderCompartmentDetailsListTitle">
                                          {t("OperatorDashboard_OrderPlanned")}
                                        </div>
                                        <div className="operatorOrderCompartmentDetailsListTitle">
                                          {t("OperatorDashboard_OrderActual")}
                                        </div>
                                        <div className="operatorOrderCompartmentDetailsListTitle">
                                          {orderDetails.TransactionType === 0
                                            ? t("OperatorDashboard_OrderCustomer")
                                            : t(
                                              "OperatorDashboard_OrderSupplier"
                                            )}
                                        </div>
                                      </List.Content>
                                      {orderloadedPartCommpartmentList.map(
                                        (item) => {
                                          let prodColor =
                                            item.Color !== ""
                                              ? "#" + item.Color
                                              : "#000000";
                                          return (
                                            <List.Content>
                                              <div className="operatorOrderCompartmentDetailsListContent">
                                                {item.Code}
                                              </div>
                                              <div className="operatorOrderCompartmentDetailsListContent">
                                                <div
                                                  className="operatorOrderCircle"
                                                  style={{
                                                    float: "right",
                                                    backgroundColor: prodColor,
                                                  }}
                                                ></div>
                                              </div>
                                              <div className="operatorOrderCompartmentDetailsListContent">
                                                {item.PlannedQty.toLocaleString() +
                                                  " " +
                                                  orderDetails.UOM}
                                              </div>
                                              <div className="operatorOrderCompartmentDetailsListContent">
                                                {item.LoadedQty.toLocaleString() +
                                                  " " +
                                                  orderDetails.UOM}
                                              </div>
                                              <div className="operatorOrderCompartmentDetailsListContent">
                                                {item.Customer}
                                              </div>
                                            </List.Content>
                                          );
                                        }
                                      )}
                                    </List>
                                  </div>

                                  {orderloadedOtherCommpartmentList.length > 0 ? (
                                    <div>
                                      <List horizontal={true}>
                                        <List.Content>
                                          <div className="operatorOrderCompartmentDetailsListTitle"></div>
                                          <div className="operatorOrderCompartmentDetailsListTitle">
                                            {t("OperatorDashboard_OrderProduct")}
                                          </div>
                                          <div className="operatorOrderCompartmentDetailsListTitle">
                                            {t("OperatorDashboard_OrderPlanned")}
                                          </div>
                                          <div className="operatorOrderCompartmentDetailsListTitle">
                                            {t("OperatorDashboard_OrderActual")}
                                          </div>
                                          <div className="operatorOrderCompartmentDetailsListTitle">
                                            {orderDetails.TransactionType === 0
                                              ? t(
                                                "OperatorDashboard_OrderCustomer"
                                              )
                                              : t(
                                                "OperatorDashboard_OrderSupplier"
                                              )}
                                          </div>
                                        </List.Content>
                                        {orderloadedOtherCommpartmentList.map(
                                          (item) => {
                                            let prodColor =
                                              item.Color !== ""
                                                ? "#" + item.Color
                                                : "#000000";
                                            return (
                                              <List.Content>
                                                <div className="operatorOrderCompartmentDetailsListContent">
                                                  {item.Code}
                                                </div>
                                                <div className="operatorOrderCompartmentDetailsListContent">
                                                  <div
                                                    className="operatorOrderCircle"
                                                    style={{
                                                      float: "right",
                                                      backgroundColor: prodColor,
                                                    }}
                                                  ></div>
                                                </div>
                                                <div className="operatorOrderCompartmentDetailsListContent">
                                                  {item.PlannedQty.toLocaleString() +
                                                    " " +
                                                    orderDetails.UOM}
                                                </div>
                                                <div className="operatorOrderCompartmentDetailsListContent">
                                                  {item.LoadedQty.toLocaleString() +
                                                    " " +
                                                    orderDetails.UOM}
                                                </div>
                                                <div className="operatorOrderCompartmentDetailsListContent">
                                                  {item.Customer}
                                                </div>
                                              </List.Content>
                                            );
                                          }
                                        )}
                                      </List>
                                    </div>
                                  ) : (
                                    <div></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </TranslationConsumer>
                    ) : (
                      <div className="operatorOrder">
                        <LoadingPage
                          message="Loading"
                          loadingClass="operatorOrderLoader"
                        ></LoadingPage>
                      </div>
                    )}
                  </Popup>
                </div>
              );
            }
          } else if (shipment.TransactionType === 2) {
            if (shipmentStartTime > CurrentShift.StartTime)
              gap =
                GraphPercentage *
                ((shipmentStartTime - CurrentShift.StartTime) / 1000 / 60);
            else gap = 0;
            leakageObjects = addLekageIntoConsolidatedList(
              leakageObjects,
              shipment.StartTotalizer,
              shipment.EndTotalizer,
              shipment.Quantity,
              shipmentStartTime,
              gap
            );
          } else {
            var shipmentHtmlCompose1 = [];
            if (shipmentEndTime !== null)
              shipmentHtmlCompose1.push(
                <div className="marineDashboardShipmentDiv8">
                  {shipmentStartTime < CurrentShift.StartTime ||
                    shipmentEndTime === null ||
                    shipmentEndTime > CurrentShift.EndTime
                    ? ""
                    : ("0" + shipmentEndTime.getHours()).slice(-2) +
                    ":" +
                    ("0" + shipmentEndTime.getMinutes()).slice(-2)}
                </div>
              );
            shipmentHtml.push(
              <div
                id={shipDevID}
                className="marineDashboardShipmentDiv5"
                style={{
                  width: ShipmentGraphPercentage + "%",
                  left: gap + "%",
                }}
              >
                <span className="LiveCompartmentFont">Inactive</span>
                <div className="marineDashboardShipmentDiv6">
                  <div className="marineDashboardShipmentDiv7">
                    {shipmentStartTime < CurrentShift.StartTime ||
                      shipmentEndTime === null ||
                      shipmentEndTime > CurrentShift.EndTime
                      ? ""
                      : ("0" + shipmentStartTime.getHours()).slice(-2) +
                      ":" +
                      ("0" + shipmentStartTime.getMinutes()).slice(-2)}
                  </div>
                  {shipmentHtmlCompose1}
                </div>
              </div>
            );
          }
        }
        for (var j = 0; j < leakageObjects.length; j++) {
          shipmentHtml.push(
            <span
              className="marineDashboardShipmentSpan1"
              style={{ left: leakageObjects[j].Gap + "%" }}
            >
              <Popup
                style={{ padding: 15 }}
                className="popup-theme-wrap"
                element={<Icon root="common" name="tint" size="small" />}
                hoverable={false}
                on="click"
              >
                {showConsolidateLeakageHover(leakageObjects[j].leakInfo)}
              </Popup>
            </span>
          );
        }
        return shipmentHtml;
      }
    } catch (error) {
      console.log("error in getShipmentHTML" + error);
      return "";
    }
  }

  function addLekageIntoConsolidatedList(
    leakageObjects,
    startTotalizer,
    endTotalizer,
    Quantity,
    shipmentStartTime,
    gap
  ) {
    var isFound = false;
    for (var i = 0; i < leakageObjects.length; i++) {
      var leakObject = leakageObjects[i];
      if (
        leakObject.StartTime.getHours() === shipmentStartTime.getHours() &&
        leakObject.StartTime.getMinutes() === shipmentStartTime.getMinutes()
      ) {
        leakObject.leakInfo =
          leakObject.leakInfo +
          ";" +
          startTotalizer +
          "," +
          endTotalizer +
          "," +
          Quantity;
        isFound = true;
        break;
      }
    }
    if (isFound === false) {
      var obj = {
        StartTime: shipmentStartTime,
        Gap: gap,
        leakInfo: startTotalizer + "," + endTotalizer + "," + Quantity,
      };
      leakageObjects.push(obj);
    }
    return leakageObjects;
  }

  function showConsolidateLeakageHover(leakInfo) {
    try {
      var consolidateLeakageHover = [];
      var leakageList = leakInfo.split(";");
      for (var i = 0; i < leakageList.length; i++) {
        var leak = leakageList[i].split(",");
        var leakageQuantity = parseFloat(leak[2]);
        var leakageQuantityUnit = leak[2].substr(
          leakageQuantity.toString().length
        );

        if (i !== leakageList.length - 1 && leakageList.length > 1) {
          consolidateLeakageHover.push(
            <div
              className="dashboardLeakageHoverDiv1"
              style={{ left: i * 195 + "px" }}
            >
              <div style={{ marginTop: "5px" }}>
                {t("RoadDashboard_Start_Totalizer") +
                  " : " +
                  leak[0].toLocaleString()}
              </div>
              <div className="dashboardLeakageHoverDiv3">
                {t("RoadDashboard_End_Totalizer") +
                  " : " +
                  leak[1].toLocaleString()}
              </div>
              <div>
                <div className="dashboardLeakageHoverDiv4">
                  {t("RoadDashboard_Total_Leakage_Quantity")}
                </div>
                <div className="dashboardLeakageHoverDiv5">
                  {leakageQuantity.toLocaleString() + leakageQuantityUnit}
                </div>
              </div>
            </div>
          );
        } else {
          consolidateLeakageHover.push(
            <div
              className="dashboardLeakageHoverDiv2"
              style={{ left: i * 195 + "px" }}
            >
              <div style={{ marginTop: "5px" }}>
                {t("RoadDashboard_Start_Totalizer") +
                  " : " +
                  leak[0].toLocaleString()}
              </div>
              <div className="dashboardLeakageHoverDiv3">
                {t("RoadDashboard_End_Totalizer") +
                  " : " +
                  leak[1].toLocaleString()}
              </div>
              <div>
                <div className="dashboardLeakageHoverDiv4">
                  {t("RoadDashboard_Total_Leakage_Quantity")}
                </div>
                <div className="dashboardLeakageHoverDiv5">
                  {leakageQuantity.toLocaleString() + leakageQuantityUnit}
                </div>
              </div>
            </div>
          );
        }
      }
      return (
        <div
          style={{
            marginRight: "10px",
            color: "#707070",
            width: leakageList.length * 195 + "px",
            height: "130px",
          }}
        >
          <div
            style={{
              height: "40px",
              borderBottom: "1px solid grey",
              marginLeft: "15px",
            }}
          >
            <span
            // style={{ fontSize: "30px" }}
            // className="icon-SPECIFICATIONS-30"
            >
              <Icon root="common" name="tint" size="small" />
            </span>
            <div
              style={{
                font: "normal bold 14px Arial",
                padding: "5px 5px 0 0",
                float: "left",
              }}
            >
              {t("RoadDashboard_Leakage")}
            </div>
          </div>
          <div style={{ fontSize: "13px" }}>{consolidateLeakageHover}</div>
        </div>
      );
    } catch (error) {
      console.log("error in showConsolidateLeakageHover" + error);
      return "";
    }
  }

  function getRailShipmentHTML(objShipment, parentid) {
    try {
      if (objShipment !== undefined && objShipment !== null) {
        var shipmentHtml = [];
        var shiftDuration = Math.floor(
          (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
        );
        var GraphPercentage = 100.0 / shiftDuration;
        var HeapList = [];
        for (var i = 0; i < objShipment.TransactionAuditList.length; i++) {
          if (
            objShipment.TransactionAuditList[i].TransactionType === 0 ||
            objShipment.TransactionAuditList[i].TransactionType === 1
          ) {
            if (
              (timetaken === 0 ||
                (objShipment.TransactionAuditList[i].TotalTime <= timetaken &&
                  timetaken !== 75) ||
                (timetaken === 75 &&
                  objShipment.TransactionAuditList[i].TotalTime > 60)) &&
              (viewShipmentStatus === 0 ||
                (viewShipmentStatus === 1 &&
                  objShipment.TransactionAuditList[i].IsCompleted) ||
                (viewShipmentStatus === 2 &&
                  objShipment.TransactionAuditList[i].EndIndicator === 3) ||
                (viewShipmentStatus === 3 &&
                  objShipment.TransactionAuditList[i].HasAlarmOccured))
            )
              HeapList = GetHeapList(
                HeapList,
                objShipment.TransactionAuditList[i]
              );
          }
        }
        for (var j = 0; j < HeapList.length; j++) {
          let Heap = HeapList[j];
          var gap = 0;
          var shipmentStartTime = "";
          if (Heap.StartTime != null)
            shipmentStartTime = new Date(Heap.StartTime);
          let shipmentEndTime = null;
          if (Heap.EndTime != null) shipmentEndTime = new Date(Heap.EndTime);
          if (shipmentStartTime > CurrentShift.StartTime) {
            var minsdiff = Math.floor(
              (shipmentStartTime - CurrentShift.StartTime) / 1000 / 60
            );
            gap = minsdiff * GraphPercentage;
          }
          var ShipmentGraphPercentage = 0;

          if (shipmentEndTime != null) {
            if (
              shipmentEndTime < CurrentShift.EndTime &&
              shipmentStartTime < CurrentShift.StartTime
            ) {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((shipmentEndTime - CurrentShift.StartTime) / 1000 / 60);
            } else if (
              shipmentEndTime > CurrentShift.EndTime &&
              shipmentStartTime < CurrentShift.StartTime
            ) {
              ShipmentGraphPercentage = 100;
            } else if (
              shipmentStartTime > CurrentShift.StartTime &&
              shipmentEndTime < CurrentShift.EndTime
            ) {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((shipmentEndTime - shipmentStartTime) / 1000 / 60);
            } else if (
              shipmentEndTime > CurrentShift.EndTime &&
              shipmentStartTime > CurrentShift.StartTime
            ) {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((CurrentShift.EndTime - shipmentStartTime) / 1000 / 60);
            }
          } else {
            if (shipmentStartTime < CurrentShift.StartTime) {
              ShipmentGraphPercentage = 100;
            } else {
              ShipmentGraphPercentage =
                GraphPercentage *
                ((CurrentShift.EndTime - shipmentStartTime) / 1000 / 60);
            }
          }

          if (Heap.AuditItems.length > 1) {
            var HeapDevId = "Bay_" + parentid + "Heap_" + i;
            shipmentHtml.push(
              <div
                id={HeapDevId}
                className="heap railDashboardShiftmentHtmlDiv1"
                style={{
                  width: ShipmentGraphPercentage + "%",
                  left: gap + "%",
                }}
                onClick={() => {
                  heapClick(Heap, parentid);
                }}
              >
                <div className="railDashboardShiftmentHtmlDiv2"></div>
                <div className="HeapBar"></div>
                <div className="railDashboardShiftmentHtmlDiv3">
                  <div className="railDashboardShiftmentHtmlDiv4"></div>
                </div>
              </div>
            );
          } else {
            var shipDevID = "Bay_" + parentid + "Transaction_" + i;
            // var objShipmentCode = "'" + Heap.AuditItems[0].TransactionCode + "'";
            // var objBayCode = "'" + parentid + "'";
            // var objType = "'" + Heap.AuditItems[0].TransactionType + "'";
            // var objTimeTaken = "'" + Heap.AuditItems[0].TotalTime + "'";
            // var objBCU = "'" + Heap.AuditItems[0].BCUPoint + "'";

            var shipStyle =
              shipmentEndTime === null
                ? {
                  zIndex: "1",
                  width: ShipmentGraphPercentage + "%",
                  borderBottom: "dashed 1px #D0D0D0",
                  position: "absolute",
                  left: gap + "%",
                }
                : {
                  zIndex: "1",
                  width: ShipmentGraphPercentage + "%",
                  cursor: "pointer",
                  borderBottom: "dashed 1px #D0D0D0",
                  position: "absolute",
                  left: gap + "%",
                };

            var radiusstyle = {};
            if (
              Heap.AuditItems[0].StartIndicator === 1 &&
              shipmentStartTime > CurrentShift.StartTime
            )
              radiusstyle = {
                borderTopLeftRadius: "12px",
                borderBottomLeftRadius: "12px",
              };
            else if (Heap.AuditItems[0].StartIndicator === 2) {
              radiusstyle = {};
            } else if (
              Heap.AuditItems[0].StartIndicator === 3 &&
              shipmentStartTime < CurrentShift.StartTime
            )
              radiusstyle = {
                borderLeftColor: "red",
                borderLeftWidth: "10px",
                borderLeftStyle: "solid",
              };
            if (
              Heap.AuditItems[0].EndIndicator === 1 &&
              !(
                shipmentEndTime == null ||
                shipmentEndTime > CurrentShift.EndTime
              )
            ) {
              radiusstyle["borderTopRightRadius"] = "12px";
              radiusstyle["borderBottomRightRadius"] = "12px";
            } else if (Heap.AuditItems[0].StartIndicator === 2) {
            } else if (
              Heap.AuditItems[0].EndIndicator === 3 &&
              !(
                shipmentEndTime == null ||
                shipmentEndTime > CurrentShift.EndTime
              )
            ) {
              radiusstyle["borderRightColor"] = "red";
              radiusstyle["borderRightWidth"] = "10px";
              radiusstyle["borderRightStyle"] = "solid";
            }

            var shipBackColor = Heap.AuditItems[0].HasAlarmOccured
              ? "railDashboardShiftmentHtmlDiv6Red"
              : "railDashboardShiftmentHtmlDiv6";
            var shipClass =
              shipmentEndTime == null ? "LiveShipmentBar" : "ShipmentBar";

            var shipmentHtmlCompose = [];
            if (shipmentEndTime != null)
              shipmentHtmlCompose.push(
                <div className="railDashboardShiftmentHtmlDiv8">
                  {shipmentStartTime < CurrentShift.StartTime ||
                    shipmentEndTime == null ||
                    shipmentEndTime > CurrentShift.EndTime
                    ? ""
                    : ("0" + shipmentEndTime.getHours()).slice(-2) +
                    ":" +
                    ("0" + shipmentEndTime.getMinutes()).slice(-2)}
                </div>
              );

            let railTransactionType =
              Heap.AuditItems[0].TransactionType === 0 ? "DISPATCH" : "RECEIPT";
            shipmentHtml.push(
              <Popup
                position="top left"
                hoverable={false}
                className="operatorOrderDetails"
                element={
                  <div
                    id={shipDevID}
                    className={
                      Heap.AuditItems[0].HasAlarmOccured
                        ? "failureship "
                        : "shipment "
                    }
                    data-toggle="popover"
                    style={shipStyle}
                    onClick={() => {
                      try {
                        let arr =
                          Heap.AuditItems[0].TransactionCode.split("::");
                        if (shipmentEndTime === null) {
                          getRailLiveOrderDetails(
                            arr[0],
                            railTransactionType,
                            arr[1],
                            Heap.AuditItems[0].BCUPoint
                          );
                        } else {
                          getRailOrderDetails(
                            arr[0],
                            railTransactionType,
                            arr[1]
                          );
                        }
                      } catch (error) {
                        console.log(
                          "error in Popup of RailShipmentHTML",
                          error
                        );
                      }
                    }}
                  >
                    <div className="railDashboardShiftmentHtmlDiv5">
                      {shipmentStartTime < CurrentShift.StartTime ||
                        shipmentEndTime == null ||
                        shipmentEndTime > CurrentShift.EndTime
                        ? ""
                        : Heap.AuditItems[0].TransactionCode}
                    </div>
                    <div className={shipClass} style={radiusstyle}></div>
                    <div className={shipBackColor}>
                      <div className="railDashboardShiftmentHtmlDiv7">
                        {shipmentStartTime < CurrentShift.StartTime ||
                          shipmentEndTime == null ||
                          shipmentEndTime > CurrentShift.EndTime
                          ? ""
                          : ("0" + shipmentStartTime.getHours()).slice(-2) +
                          ":" +
                          ("0" + shipmentStartTime.getMinutes()).slice(-2)}
                      </div>
                      {shipmentHtmlCompose}
                    </div>
                  </div>
                }
                on="click"
              >
                {orderDetails !== null &&
                  orderDetails.CompartmentInfoList !== null ? (
                  <TranslationConsumer>
                    {(t) => (
                      <div className="operatorRailOrder">
                        <div className="operatorRailOrdertransactionInfo">
                          <div style={{ fontWeight: "bold" }}>
                            {orderDetails.railTransactionType === "DISPATCH"
                              ? "Shipment"
                              : "Receipt"}
                            {" No - " + orderDetails.Code}
                          </div>
                          <Divider></Divider>
                          <List horizontal={true}>
                            <List.Content>
                              <div className="operatorOrdertransactionInfoTitle">
                                {t("OperatorDashboard_OrderAlarmsOccured") +
                                  ":"}
                              </div>
                              <div className="operatorOrdertransactionInfoTitle">
                                {t("OperatorDashboard_OrderTimeTakne") + ":"}
                              </div>
                            </List.Content>
                            <List.Content>
                              <div
                                className="operatorOrdertransactionInfoContent"
                                style={
                                  orderDetails.AlarmCount > 0
                                    ? { color: "red" }
                                    : {}
                                }
                              >
                                {orderDetails.AlarmCount.toLocaleString()}
                              </div>
                              <div className="operatorOrdertransactionInfoContent">
                                {Heap.AuditItems[0].TotalTime.toLocaleString() +
                                  " " +
                                  t("OperatorDashboard_OrderMin")}
                              </div>
                            </List.Content>
                          </List>
                          <Divider direction="vertical"></Divider>
                        </div>

                        <div className="operatorOrderProductAndCompartmentDetails">
                          <div
                            className="operatorOrderProductAndCompartmentDetailsTitle"
                            style={
                              orderloadedOtherCommpartmentList.length > 0
                                ? { paddingTop: 2, paddingBottom: 12 }
                                : {}
                            }
                          >
                            {t("OperatorDashboard_OrderProductAndWagon")}
                          </div>
                          <div
                            className="operatorOrderProduct"
                            style={
                              orderloadedOtherCommpartmentList.length > 0
                                ? { height: 175 }
                                : {}
                            }
                          >
                            {orderProductDetails.map((item) => {
                              let prodColor =
                                item.Color !== ""
                                  ? "#" + item.Color
                                  : "#000000";
                              return (
                                <div
                                  style={{
                                    color: prodColor,
                                    marginBottom: 5,
                                  }}
                                >
                                  <div
                                    className="operatorOrderCircle"
                                    style={{
                                      float: "left",
                                      marginTop: 2,
                                      marginLeft: 3,
                                      backgroundColor: prodColor,
                                    }}
                                  ></div>
                                  <div style={{ marginLeft: -3 }}>
                                    {item.Product}
                                  </div>
                                  <div style={{ fontWeight: "bold" }}>
                                    {item.LoadedQty.toLocaleString() +
                                      " " +
                                      orderDetails.UOM}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="operatorOrderCompartmentDetails">
                            <div
                              style={{
                                borderBottom: "1px dashed #A0A0A0",
                                paddingBottom: 8,
                                marginBottom: 8,
                              }}
                            >
                              <List horizontal={true}>
                                <List.Content>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {""}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {t("OperatorDashboard_OrderProduct")}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {t("OperatorDashboard_OrderPlanned")}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {t("OperatorDashboard_OrderActual")}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {t("OperatorDashboard_OrderStatus")}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {orderDetails.railTransactionType ===
                                      "DISPATCH"
                                      ? t("OperatorDashboard_OrderCustomer")
                                      : t("OperatorDashboard_OrderSupplier")}
                                  </div>
                                </List.Content>
                                {orderloadedPartCommpartmentList.map((item) => {
                                  let prodColor =
                                    item.Color !== ""
                                      ? "#" + item.Color
                                      : "#000000";
                                  return (
                                    <List.Content>
                                      <div className="operatorOrderCompartmentDetailsListContent">
                                        {item.Code}
                                      </div>
                                      <div className="operatorOrderCompartmentDetailsListContent">
                                        <div
                                          className="operatorOrderCircle"
                                          style={{
                                            float: "right",
                                            backgroundColor: prodColor,
                                          }}
                                        ></div>
                                      </div>
                                      <div className="operatorOrderCompartmentDetailsListContent">
                                        {item.PlannedQty.toLocaleString() +
                                          " " +
                                          orderDetails.UOM}
                                      </div>
                                      <div className="operatorOrderCompartmentDetailsListContent">
                                        {item.LoadedQty.toLocaleString() +
                                          " " +
                                          orderDetails.UOM}
                                      </div>
                                      <div className="operatorOrderCompartmentDetailsListContent">
                                        {item.Status}
                                      </div>
                                      <div className="operatorOrderCompartmentDetailsListContent">
                                        {item.Customer}
                                      </div>
                                    </List.Content>
                                  );
                                })}
                              </List>
                            </div>

                            {orderloadedOtherCommpartmentList.length > 0 ? (
                              <div>
                                <List horizontal={true}>
                                  <List.Content>
                                    <div className="operatorOrderCompartmentDetailsListTitle">
                                      {""}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListTitle">
                                      {t("OperatorDashboard_OrderProduct")}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListTitle">
                                      {t("OperatorDashboard_OrderPlanned")}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListTitle">
                                      {t("OperatorDashboard_OrderActual")}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListTitle">
                                      {orderDetails.railTransactionType ===
                                        "DISPATCH"
                                        ? t("OperatorDashboard_OrderCustomer")
                                        : t("OperatorDashboard_OrderSupplier")}
                                    </div>
                                  </List.Content>
                                  {orderloadedOtherCommpartmentList.map(
                                    (item) => {
                                      let prodColor =
                                        item.Color !== ""
                                          ? "#" + item.Color
                                          : "#000000";
                                      return (
                                        <List.Content>
                                          <div className="operatorOrderCompartmentDetailsListContent">
                                            {item.Code}
                                          </div>
                                          <div className="operatorOrderCompartmentDetailsListContent">
                                            <div
                                              className="operatorOrderCircle"
                                              style={{
                                                float: "right",
                                                backgroundColor: prodColor,
                                              }}
                                            ></div>
                                          </div>
                                          <div className="operatorOrderCompartmentDetailsListContent">
                                            {item.PlannedQty.toLocaleString() +
                                              " " +
                                              orderDetails.UOM}
                                          </div>
                                          <div className="operatorOrderCompartmentDetailsListContent">
                                            {item.LoadedQty.toLocaleString() +
                                              " " +
                                              orderDetails.UOM}
                                          </div>
                                          <div className="operatorOrderCompartmentDetailsListContent">
                                            {item.Customer}
                                          </div>
                                        </List.Content>
                                      );
                                    }
                                  )}
                                </List>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </TranslationConsumer>
                ) : (
                  <div className="operatorOrder">
                    <LoadingPage
                      message="Loading"
                      loadingClass="operatorOrderLoader"
                    ></LoadingPage>
                  </div>
                )}
              </Popup>
            );
          }
        }
        return shipmentHtml;
      }
    } catch (error) {
      console.log("error in getRailShipmentHTML" + error);
      return "";
    }
  }

  function GetHeapList(HeapList, TransactionAuditItem) {
    var isFound = false;
    var foundItem = -1;
    var transactionStartTime = new Date(TransactionAuditItem.StartTime);
    var transactionEndTime =
      TransactionAuditItem.EndTime == null
        ? null
        : new Date(TransactionAuditItem.EndTime);
    if (transactionStartTime < CurrentShift.EndTime) {
      if (HeapList.length > 0) {
        for (var i = 0; i < HeapList.length; i++) {
          var itemStartTime = new Date(HeapList[i].StartTime);
          var itemEndTime =
            HeapList[i].EndTime == null ? null : new Date(HeapList[i].EndTime);

          if (transactionStartTime <= itemStartTime) {
            if (transactionEndTime == null) {
              HeapList[i].EndTime = null;
              HeapList[i].StartTime = TransactionAuditItem.StartTime;
              isFound = true;
              foundItem = i;
              break;
            } else if (
              transactionEndTime != null &&
              transactionEndTime > itemStartTime
            ) {
              HeapList[i].StartTime = TransactionAuditItem.StartTime;
              if (itemEndTime != null && transactionEndTime > itemEndTime) {
                HeapList[i].EndTime = TransactionAuditItem.EndTime;
              }
              isFound = true;
              foundItem = i;
              break;
            }
          } else {
            if (itemEndTime == null) {
              isFound = true;
              foundItem = i;
              break;
            } else if (transactionStartTime < itemEndTime) {
              isFound = true;
              foundItem = i;
              if (transactionEndTime == null)
                HeapList[i].EndTime = TransactionAuditItem.EndTime;
              else if (transactionEndTime > itemEndTime)
                HeapList[i].EndTime = TransactionAuditItem.EndTime;
              break;
            }
          }
        }
        if (isFound) {
          HeapList[foundItem].AuditItems.push(TransactionAuditItem);
        } else {
          var obj = {
            StartTime: TransactionAuditItem.StartTime,
            EndTime: TransactionAuditItem.EndTime,
            AuditItems: [TransactionAuditItem],
          };
          HeapList.push(obj);
        }
      } else {
        var objs = {
          StartTime: TransactionAuditItem.StartTime,
          EndTime: TransactionAuditItem.EndTime,
          AuditItems: [TransactionAuditItem],
        };
        HeapList.push(objs);
      }
    }
    return HeapList;
  }

  function getTransactionHTML(transactionAndDeviceStatus, selectedOption) {
    try {
      if (
        transactionAndDeviceStatus !== undefined &&
        transactionAndDeviceStatus !== null
      ) {
        var shipment = {};
        transactionAndDeviceStatus.TransactionAuditList.forEach((element) => {
          if (element.TransactionCode === selectedOption) {
            shipment = element;
          }
        });
        var shiftDuration = Math.floor(
          (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
        );
        var GraphPercentage = 100.0 / shiftDuration;
        var gap = 0;
        var shipmentStartTime = "";
        if (shipment.StartTime != null)
          shipmentStartTime = new Date(shipment.StartTime);
        var shipmentEndTime = null;
        if (shipment.EndTime != null)
          shipmentEndTime = new Date(shipment.EndTime);
        if (shipmentStartTime > CurrentShift.StartTime) {
          var minsdiff = Math.floor(
            (shipmentStartTime - CurrentShift.StartTime) / 1000 / 60
          );
          gap = minsdiff * GraphPercentage;
        }
        var ShipmentGraphPercentage = 0;

        if (shipmentEndTime != null) {
          if (
            shipmentEndTime < CurrentShift.EndTime &&
            shipmentStartTime < CurrentShift.StartTime
          ) {
            ShipmentGraphPercentage =
              GraphPercentage *
              ((shipmentEndTime - CurrentShift.StartTime) / 1000 / 60);
          } else if (
            shipmentEndTime > CurrentShift.EndTime &&
            shipmentStartTime < CurrentShift.StartTime
          ) {
            ShipmentGraphPercentage = 100;
          } else if (
            shipmentStartTime > CurrentShift.StartTime &&
            shipmentEndTime < CurrentShift.EndTime
          ) {
            ShipmentGraphPercentage =
              GraphPercentage *
              ((shipmentEndTime - shipmentStartTime) / 1000 / 60);
          } else if (
            shipmentEndTime > CurrentShift.EndTime &&
            shipmentStartTime > CurrentShift.StartTime
          ) {
            ShipmentGraphPercentage =
              GraphPercentage *
              ((CurrentShift.EndTime - shipmentStartTime) / 1000 / 60);
          }
        } else {
          if (shipmentStartTime < CurrentShift.StartTime) {
            ShipmentGraphPercentage = 100;
          } else {
            ShipmentGraphPercentage =
              GraphPercentage *
              ((CurrentShift.EndTime - shipmentStartTime) / 1000 / 60);
          }
        }
        var shipStyle = {
          zIndex: "1",
          width: ShipmentGraphPercentage + "%",
          cursor: "pointer",
          borderBottom: "dashed 1px #D0D0D0",
          position: "absolute",
          left: gap + "%",
        };
        // shipmentEndTime === null
        //   ? {
        //       zIndex: "1",
        //       width: ShipmentGraphPercentage + "%",
        //       cursor: "pointer",
        //       borderBottom: "dashed 1px #D0D0D0",
        //       position: "absolute",
        //       left: gap + "%",
        //     }
        //   : {
        //       zIndex: "1",
        //       width: ShipmentGraphPercentage + "%",
        //       cursor: "pointer",
        //       borderBottom: "dashed 1px #D0D0D0",
        //       position: "absolute",
        //       left: gap + "%",
        //     };
        var radiusstyle = {};
        if (
          shipment.StartIndicator === 1 &&
          shipmentStartTime > CurrentShift.StartTime
        )
          radiusstyle = {
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
          };
        else if (shipment.StartIndicator === 2) {
          radiusstyle = {};
        } else if (
          shipment.StartIndicator === 3 &&
          shipmentStartTime < CurrentShift.StartTime
        )
          radiusstyle = {
            borderLeftColor: "red",
            borderLeftWidth: "10px",
            borderLeftStyle: "solid",
          };
        if (
          shipment.StartIndicator === 1 &&
          !(shipmentEndTime == null || shipmentEndTime > CurrentShift.EndTime)
        ) {
          radiusstyle["borderTopRightRadius"] = "12px";
          radiusstyle["borderBottomRightRadius"] = "12px";
        } else if (shipment.StartIndicator === 2) {
        } else if (
          shipment.StartIndicator === 3 &&
          !(shipmentEndTime == null || shipmentEndTime > CurrentShift.EndTime)
        ) {
          radiusstyle["borderRightColor"] = "red";
          radiusstyle["borderRightWidth"] = "10px";
          radiusstyle["borderRightStyle"] = "solid";
        }

        var shipBackColor = shipment.HasAlarmOccured
          ? "#FBD5D2"
          : "transparent";
        var shipClass =
          shipmentEndTime == null ? "LiveShipmentBar" : "ShipmentBar";

        var TransactionHTMLCompose = [];
        if (shipmentEndTime != null)
          TransactionHTMLCompose.push(
            <div className="railDashboardTransactionHTMLDiv4">
              {shipmentStartTime < CurrentShift.StartTime ||
                shipmentEndTime == null ||
                shipmentEndTime > CurrentShift.EndTime
                ? ""
                : ("0" + shipmentEndTime.getHours()).slice(-2) +
                ":" +
                ("0" + shipmentEndTime.getMinutes()).slice(-2)}
            </div>
          );
        let railTransactionType =
          shipment.TransactionType === 0 ? "DISPATCH" : "RECEIPT";

        return (
          <div>
            <Popup
              position="top left"
              hoverable={false}
              className="operatorOrderDetails"
              on="click"
              element={
                <div
                  className={
                    shipment.HasAlarmOccured
                      ? "Heapfailureship "
                      : "Heapshipment "
                  }
                  data-toggle="popover"
                  style={shipStyle}
                  onClick={() => {
                    try {
                      let arr = shipment.TransactionCode.split("::");
                      let newIsLive = shipmentEndTime === null ? true : false;
                      if (newIsLive) {
                        getRailLiveOrderDetails(
                          arr[0],
                          railTransactionType,
                          arr[1],
                          shipment.BCUPoint
                        );
                      } else {
                        getRailOrderDetails(
                          arr[0],
                          railTransactionType,
                          arr[1]
                        );
                      }
                    } catch (error) {
                      console.log("error in Popup of TransactionHTML", error);
                    }
                  }}
                >
                  <div className="railDashboardTransactionHTMLDiv1">
                    {shipmentStartTime < CurrentShift.StartTime ||
                      shipmentEndTime == null ||
                      shipmentEndTime > CurrentShift.EndTime
                      ? ""
                      : shipment.TransactionCode}
                  </div>
                  <div className={shipClass} style={radiusstyle}></div>
                  <div
                    className="railDashboardTransactionHTMLDiv2"
                    style={{ backgroundColor: shipBackColor }}
                  >
                    <div className="railDashboardTransactionHTMLDiv3">
                      {shipmentStartTime < CurrentShift.StartTime ||
                        shipmentEndTime == null ||
                        shipmentEndTime > CurrentShift.EndTime
                        ? ""
                        : ("0" + shipmentStartTime.getHours()).slice(-2) +
                        ":" +
                        ("0" + shipmentStartTime.getMinutes()).slice(-2)}
                    </div>
                    {TransactionHTMLCompose}
                  </div>
                </div>
              }
            >
              {orderDetails !== null &&
                orderDetails.CompartmentInfoList !== null ? (
                <TranslationConsumer>
                  {(t) => (
                    <div className="operatorRailOrder">
                      <div className="operatorRailOrdertransactionInfo">
                        <div style={{ fontWeight: "bold" }}>
                          {orderDetails.railTransactionType === "DISPATCH"
                            ? "Shipment"
                            : "Receipt"}
                          {" No - " + orderDetails.Code}
                        </div>
                        <Divider></Divider>
                        <List horizontal={true}>
                          <List.Content>
                            <div className="operatorOrdertransactionInfoTitle">
                              {t("OperatorDashboard_OrderAlarmsOccured") + ":"}
                            </div>
                            <div className="operatorOrdertransactionInfoTitle">
                              {t("OperatorDashboard_OrderTimeTakne") + ":"}
                            </div>
                          </List.Content>
                          <List.Content>
                            <div
                              className="operatorOrdertransactionInfoContent"
                              style={
                                orderDetails.AlarmCount > 0
                                  ? { color: "red" }
                                  : {}
                              }
                            >
                              {orderDetails.AlarmCount.toLocaleString()}
                            </div>
                            <div className="operatorOrdertransactionInfoContent">
                              {shipment.TotalTime.toLocaleString() +
                                " " +
                                t("OperatorDashboard_OrderMin")}
                            </div>
                          </List.Content>
                        </List>
                        <Divider direction="vertical"></Divider>
                      </div>

                      <div className="operatorOrderProductAndCompartmentDetails">
                        <div
                          className="operatorOrderProductAndCompartmentDetailsTitle"
                          style={
                            orderloadedOtherCommpartmentList.length > 0
                              ? { paddingTop: 2, paddingBottom: 12 }
                              : {}
                          }
                        >
                          {t("OperatorDashboard_OrderProductAndWagon")}
                        </div>
                        <div
                          className="operatorOrderProduct"
                          style={
                            orderloadedOtherCommpartmentList.length > 0
                              ? { height: 175 }
                              : {}
                          }
                        >
                          {orderProductDetails.map((item) => {
                            let prodColor =
                              item.Color !== "" ? "#" + item.Color : "#000000";
                            return (
                              <div
                                style={{
                                  color: prodColor,
                                  marginBottom: 5,
                                }}
                              >
                                <div
                                  className="operatorOrderCircle"
                                  style={{
                                    float: "left",
                                    marginTop: 2,
                                    marginLeft: 3,
                                    backgroundColor: prodColor,
                                  }}
                                ></div>
                                <div style={{ marginLeft: -3 }}>
                                  {item.Product}
                                </div>
                                <div style={{ fontWeight: "bold" }}>
                                  {item.LoadedQty.toLocaleString() +
                                    " " +
                                    orderDetails.UOM}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="operatorOrderCompartmentDetails">
                          <div
                            style={{
                              borderBottom: "1px dashed #A0A0A0",
                              paddingBottom: 8,
                              marginBottom: 8,
                            }}
                          >
                            <List horizontal={true}>
                              <List.Content>
                                <div className="operatorOrderCompartmentDetailsListTitle">
                                  {""}
                                </div>
                                <div className="operatorOrderCompartmentDetailsListTitle">
                                  {t("OperatorDashboard_OrderProduct")}
                                </div>
                                <div className="operatorOrderCompartmentDetailsListTitle">
                                  {t("OperatorDashboard_OrderPlanned")}
                                </div>
                                <div className="operatorOrderCompartmentDetailsListTitle">
                                  {t("OperatorDashboard_OrderActual")}
                                </div>
                                <div className="operatorOrderCompartmentDetailsListTitle">
                                  {t("OperatorDashboard_OrderStatus")}
                                </div>
                                <div className="operatorOrderCompartmentDetailsListTitle">
                                  {orderDetails.railTransactionType ===
                                    "DISPATCH"
                                    ? t("OperatorDashboard_OrderCustomer")
                                    : t("OperatorDashboard_OrderSupplier")}
                                </div>
                              </List.Content>
                              {orderloadedPartCommpartmentList.map((item) => {
                                let prodColor =
                                  item.Color !== ""
                                    ? "#" + item.Color
                                    : "#000000";
                                return (
                                  <List.Content>
                                    <div className="operatorOrderCompartmentDetailsListContent">
                                      {item.Code}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListContent">
                                      <div
                                        className="operatorOrderCircle"
                                        style={{
                                          float: "right",
                                          backgroundColor: prodColor,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListContent">
                                      {item.PlannedQty.toLocaleString() +
                                        " " +
                                        orderDetails.UOM}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListContent">
                                      {item.LoadedQty.toLocaleString() +
                                        " " +
                                        orderDetails.UOM}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListContent">
                                      {item.Status}
                                    </div>
                                    <div className="operatorOrderCompartmentDetailsListContent">
                                      {item.Customer}
                                    </div>
                                  </List.Content>
                                );
                              })}
                            </List>
                          </div>

                          {orderloadedOtherCommpartmentList.length > 0 ? (
                            <div>
                              <List horizontal={true}>
                                <List.Content>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {""}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {t("OperatorDashboard_OrderProduct")}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {t("OperatorDashboard_OrderPlanned")}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {t("OperatorDashboard_OrderActual")}
                                  </div>
                                  <div className="operatorOrderCompartmentDetailsListTitle">
                                    {orderDetails.railTransactionType ===
                                      "DISPATCH"
                                      ? t("OperatorDashboard_OrderCustomer")
                                      : t("OperatorDashboard_OrderSupplier")}
                                  </div>
                                </List.Content>
                                {orderloadedOtherCommpartmentList.map(
                                  (item) => {
                                    let prodColor =
                                      item.Color !== ""
                                        ? "#" + item.Color
                                        : "#000000";
                                    return (
                                      <List.Content>
                                        <div className="operatorOrderCompartmentDetailsListContent">
                                          {item.Code}
                                        </div>
                                        <div className="operatorOrderCompartmentDetailsListContent">
                                          <div
                                            className="operatorOrderCircle"
                                            style={{
                                              float: "right",
                                              backgroundColor: prodColor,
                                            }}
                                          ></div>
                                        </div>
                                        <div className="operatorOrderCompartmentDetailsListContent">
                                          {item.PlannedQty.toLocaleString() +
                                            " " +
                                            orderDetails.UOM}
                                        </div>
                                        <div className="operatorOrderCompartmentDetailsListContent">
                                          {item.LoadedQty.toLocaleString() +
                                            " " +
                                            orderDetails.UOM}
                                        </div>
                                        <div className="operatorOrderCompartmentDetailsListContent">
                                          {item.Customer}
                                        </div>
                                      </List.Content>
                                    );
                                  }
                                )}
                              </List>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              ) : (
                <div className="operatorOrder">
                  <LoadingPage
                    message="Loading"
                    loadingClass="operatorOrderLoader"
                  ></LoadingPage>
                </div>
              )}
            </Popup>
          </div>
        );
      }
    } catch (error) {
      console.log("error in getTransactionHTML " + error);
    }
  }

  // function heapClick(selectedHeap) {
  //   var railOptions = [];
  //   for (var i = 0; i < selectedHeap.AuditItems.length; i++) {
  //     var option = {};
  //     option.innerHTML = selectedHeap.AuditItems[i].TransactionCode;
  //     option.value = selectedHeap.AuditItems[i].TransactionCode;
  //     railOptions.push(option);
  //   }
  //   setRailOptions(railOptions);
  // }

  function AddConsolidatedDeviceList(ConsolidatedDeviceList, DeviceItem) {
    var isFound = false;
    var foundItem = -1;
    var deviceItemStartTime =
      DeviceItem.StartTime == null ? null : new Date(DeviceItem.StartTime);
    var deviceItemEndTime =
      DeviceItem.EndTime == null ? null : new Date(DeviceItem.EndTime);
    if (ConsolidatedDeviceList.length > 0) {
      for (var i = 0; i < ConsolidatedDeviceList.length; i++) {
        var itemStartTime = new Date(ConsolidatedDeviceList[i].StartTime);
        var itemEndTime =
          ConsolidatedDeviceList[i].EndTime == null
            ? null
            : new Date(ConsolidatedDeviceList[i].EndTime);

        if (deviceItemStartTime <= itemStartTime) {
          if (DeviceItem.EndTime == null) {
            ConsolidatedDeviceList[i].EndTime = null;
            ConsolidatedDeviceList[i].StartTime = DeviceItem.StartTime;
            isFound = true;
            foundItem = i;
            break;
          } else if (
            deviceItemEndTime != null &&
            deviceItemEndTime > itemStartTime
          ) {
            ConsolidatedDeviceList[i].StartTime = DeviceItem.StartTime;
            if (itemEndTime != null && deviceItemEndTime > itemEndTime) {
              ConsolidatedDeviceList[i].EndTime = DeviceItem.EndTime;
            }
            isFound = true;
            foundItem = i;
            break;
          }
        } else {
          if (itemEndTime == null) {
            isFound = true;
            foundItem = i;
            break;
          } else if (deviceItemStartTime < itemEndTime) {
            isFound = true;
            foundItem = i;
            if (deviceItemEndTime == null)
              ConsolidatedDeviceList[i].EndTime = DeviceItem.EndTime;
            else if (deviceItemEndTime > itemEndTime)
              ConsolidatedDeviceList[i].EndTime = DeviceItem.EndTime;
            break;
          }
        }
      }
      if (isFound) {
        ConsolidatedDeviceList[foundItem].DeviceInfo +=
          ";" +
          DeviceItem.DeviceCode +
          "," +
          (deviceItemStartTime == null
            ? "--"
            : deviceItemStartTime.getDate() +
            "-" +
            (deviceItemStartTime.getMonth() + 1) +
            "-" +
            deviceItemStartTime.getFullYear() +
            "  " +
            ("0" + deviceItemStartTime.getHours()).slice(-2) +
            ":" +
            ("0" + deviceItemStartTime.getMinutes()).slice(-2)) +
          "," +
          (deviceItemEndTime == null
            ? "--"
            : deviceItemEndTime.getDate() +
            "-" +
            (deviceItemEndTime.getMonth() + 1) +
            "-" +
            deviceItemEndTime.getFullYear() +
            "  " +
            ("0" + deviceItemEndTime.getHours()).slice(-2) +
            ":" +
            ("0" + deviceItemEndTime.getMinutes()).slice(-2));
      } else {
        var obj = {
          StartTime: DeviceItem.StartTime,
          EndTime: DeviceItem.EndTime,
          DeviceInfo:
            DeviceItem.DeviceCode +
            "," +
            (deviceItemStartTime == null
              ? "--"
              : deviceItemStartTime.getDate() +
              "-" +
              (deviceItemStartTime.getMonth() + 1) +
              "-" +
              deviceItemStartTime.getFullYear() +
              "  " +
              ("0" + deviceItemStartTime.getHours()).slice(-2) +
              ":" +
              ("0" + deviceItemStartTime.getMinutes()).slice(-2)) +
            "," +
            (deviceItemEndTime == null
              ? "--"
              : deviceItemEndTime.getDate() +
              "-" +
              (deviceItemEndTime.getMonth() + 1) +
              "-" +
              deviceItemEndTime.getFullYear() +
              "  " +
              ("0" + deviceItemEndTime.getHours()).slice(-2) +
              ":" +
              ("0" + deviceItemEndTime.getMinutes()).slice(-2)),
        };
        ConsolidatedDeviceList.push(obj);
      }
    } else {
      var objs = {
        StartTime: DeviceItem.StartTime,
        EndTime: DeviceItem.EndTime,
        DeviceInfo:
          DeviceItem.DeviceCode +
          "," +
          (deviceItemStartTime == null
            ? "--"
            : deviceItemStartTime.getDate() +
            "-" +
            (deviceItemStartTime.getMonth() + 1) +
            "-" +
            deviceItemStartTime.getFullYear() +
            "  " +
            ("0" + deviceItemStartTime.getHours()).slice(-2) +
            ":" +
            ("0" + deviceItemStartTime.getMinutes()).slice(-2)) +
          "," +
          (deviceItemEndTime == null
            ? "--"
            : deviceItemEndTime.getDate() +
            "-" +
            (deviceItemEndTime.getMonth() + 1) +
            "-" +
            deviceItemEndTime.getFullYear() +
            "  " +
            ("0" + deviceItemEndTime.getHours()).slice(-2) +
            ":" +
            ("0" + deviceItemEndTime.getMinutes()).slice(-2)),
      };
      ConsolidatedDeviceList.push(objs);
    }
    return ConsolidatedDeviceList;
  }

  function getDeviceHTMLNew(objShipment) {
    if (objShipment !== undefined && objShipment !== null) {
      var deviceHtml = [];
      var shiftDuration = Math.floor(
        (CurrentShift.EndTime - CurrentShift.StartTime) / 1000 / 60
      );
      var GraphPercentage = 100.0 / shiftDuration;
      var ConsolidatedDeviceList = [];

      deviceHtml.push(
        <div className="marineDashboardDeviceHtmlDiv5">
          <div className="marineDashboardDeviceHtmlDiv6">&nbsp;</div>
          <div className="marineDashboardDeviceHtmlDiv7"></div>
          <div className="marineDashboardDeviceHtmlDiv8">&nbsp;</div>
        </div>
      );

      for (var i = 0; i < objShipment.DeviceHealthAuditList.length; i++) {
        ConsolidatedDeviceList = AddConsolidatedDeviceList(
          ConsolidatedDeviceList,
          objShipment.DeviceHealthAuditList[i]
        );
      }
      for (var j = 0; j < ConsolidatedDeviceList.length; j++) {
        var gap = 0;
        var device = ConsolidatedDeviceList[j];
        var DeviceStartTime = null;

        if (device.StartTime != null)
          DeviceStartTime = new Date(device.StartTime);
        var DeviceEndTime = null;
        if (device.EndTime != null) DeviceEndTime = new Date(device.EndTime);

        var minsdiff = Math.floor(
          (DeviceStartTime - CurrentShift.StartTime) / 1000 / 60
        );
        if (CurrentShift.StartTime < DeviceStartTime)
          gap = minsdiff * GraphPercentage;
        var DeviceGraphPercentage = 0;

        if (DeviceEndTime != null) {
          if (
            DeviceEndTime < CurrentShift.EndTime &&
            DeviceStartTime < CurrentShift.StartTime
          ) {
            DeviceGraphPercentage =
              GraphPercentage *
              ((DeviceEndTime - CurrentShift.StartTime) / 1000 / 60);
          } else if (
            DeviceEndTime > CurrentShift.EndTime &&
            DeviceStartTime < CurrentShift.StartTime
          ) {
            DeviceGraphPercentage = 100;
          } else if (
            DeviceStartTime > CurrentShift.StartTime &&
            DeviceEndTime < CurrentShift.EndTime
          ) {
            DeviceGraphPercentage =
              GraphPercentage * ((DeviceEndTime - DeviceStartTime) / 1000 / 60);
          } else if (
            DeviceEndTime > CurrentShift.EndTime &&
            DeviceStartTime > CurrentShift.StartTime
          ) {
            DeviceGraphPercentage =
              GraphPercentage *
              ((CurrentShift.EndTime - DeviceStartTime) / 1000 / 60);
          }
        } else {
          if (DeviceStartTime < CurrentShift.StartTime) {
            DeviceGraphPercentage = 100;
          } else {
            DeviceGraphPercentage =
              GraphPercentage *
              ((CurrentShift.EndTime - DeviceStartTime) / 1000 / 60);
          }
        }
        var endCircleClass =
          device.EndTime == null || DeviceEndTime > CurrentShift.EndTime
            ? "circle_red_right"
            : "circle_green_right";
        var circleRedStyle = isDeviceStatusHover
          ? "circleRedHover"
          : "circleRed";
        deviceHtml.push(
          <div
            className="marineDashboardDeviceHtmlDiv1"
            style={{ width: DeviceGraphPercentage + "%", left: gap + "%" }}
          >
            <div className="marineDashboardDeviceHtmlDiv2">&nbsp;</div>

            <Popup
              className="operatorDBPopup"
              element={
                <div className="marineDashboardDeviceHtmlDiv3">
                  <div
                    // style={{ padding: 15 }}
                    className={circleRedStyle}
                    data-toggle="popover"
                  // style={{ circleRedStyle }}
                  // id="circleRed"
                  // onClick={() => {
                  //   changeCircleStyle(device);
                  // }}
                  ></div>
                  <div
                    className={endCircleClass}
                    data-toggle="popover"
                    style={{ cursor: "pointer" }}
                  ></div>
                </div>
              }
              hoverable={false}
              on="click"
            >
              {deviceStatusHover(device.DeviceInfo)}
            </Popup>

            <div className="marineDashboardDeviceHtmlDiv4">&nbsp;</div>
          </div>
        );
      }

      return deviceHtml;
    }
  }

  // function changeCircleStyle(device) {
  //   if (!isDeviceStatusHover) {
  //     setIsDeviceStatusHover(true);
  //     // document.getElementById("circleRed").style.backgroundColor = "#ee3124";
  //   }
  // }

  function deviceStatusHover(deviceDetails) {
    var hoverHTML = [];
    try {
      var deviceList = deviceDetails.split(";");
      for (var i = 0; i < deviceList.length; i++) {
        var deviceInfo = deviceList[i].split(",");
        var hoverHTMLCompose = [];
        for (var j = 0; j < deviceInfo.length; j++) {
          hoverHTMLCompose.push(<td>{deviceInfo[j]}</td>);
        }
        hoverHTML.push(<tr>{hoverHTMLCompose}</tr>);
      }
      return (
        <div>
          <div className="marineDashboardDeviceStatusHoverDiv1">
            <div style={{ paddingTop: "5px" }}>
              <span>{t("MarineDashboard_Device_Status")}</span>
            </div>
          </div>
          <div style={{ paddingTop: "5px" }}>
            <table
              cellSpacing="1"
              cellPadding="1"
              width="300px"
              className="marineDashboardDeviceStatusHoverTable1"
            >
              <tbody>
                <tr style={{ fontWeight: "bold" }}>
                  <td>{t("MarineDashboard_Device")}</td>
                  <td>{t("MarineDashboard_Stopped_Time")}</td>
                  <td>{t("MarineDashboard_Started_Time")}</td>
                </tr>
                {hoverHTML}
              </tbody>
            </table>
          </div>
        </div>
      );
    } catch (error) {
      console.log("error in deviceStatusHover", error);
      return "";
    }
  }

  return (
    <TranslationConsumer>
      {(t) => (
        <div>
          {transportationType === Constants.TransportationType.RAIL ? (
            <div>
              <table style={{ width: "99%" }} cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td className="railDashboardIdentification">
                      <table
                        style={{ width: "100%" }}
                        cellPadding="0"
                        cellSpacing="0"
                      >
                        <tbody>
                          <tr>
                            <td style={{ width: "12%" }}>
                              <div
                                style={{ width: "100%", height: "15px" }}
                              ></div>
                            </td>
                            <td className="railTableIdentification">
                              <div
                                id="divShiftNames"
                                style={{ width: "100%", height: "15px" }}
                              >
                                {shiftNames()}
                              </div>
                            </td>
                            <td style={{ width: "1.2%" }}>
                              <div
                                style={{ width: "100%", height: "15px" }}
                              ></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{ width: "1%", verticalAlign: "top" }}></td>
                  </tr>
                </tbody>
              </table>
              <div className="railTableResults">
                <table id="tblResults" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td className="railDivResults">
                        <div id="divResults">{baysInfoSuccess()}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table style={{ width: "100%" }} cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ width: "99%", position: "relative" }}>
                      <div id="divFooterTime">{timeGraphHtml()}</div>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : transportationType === Constants.TransportationType.ROAD ? (
            <div>
              <table style={{ width: "99%" }} cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td className="truckDashboardIdentification">
                      <table
                        style={{ width: "100%" }}
                        cellPadding="0"
                        cellSpacing="0"
                      >
                        <tbody>
                          <tr>
                            <td style={{ width: "12%" }}>
                              <div
                                style={{ width: "100%", height: "15px" }}
                              ></div>
                            </td>
                            <td className="truckTableIdentification">
                              <div
                                id="divShiftNames"
                                style={{ width: "100%", height: "15px" }}
                              >
                                {shiftNames()}
                              </div>
                            </td>
                            <td style={{ width: "11.3%" }}>
                              <div
                                id="divQueueListHeader"
                                className="truckDivQueueListHeader"
                              >
                                {"| " + t("RoadDashboard_InQueue")}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{ width: "20%", verticalAlign: "top" }}>
                      <div
                        id="divLiveCompHeader"
                        className="truckDivLiveCompHeader"
                      >
                        {"| " + t("Dashboard_Live_Comp_Header")}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="truckTableResults">
                <table id="tblResults" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td className="truckDivResults">
                        <div id="divResults">{baysInfoSuccess()}</div>
                      </td>
                      <td style={{ width: "20%", verticalAlign: "top" }}>
                        <div>
                          <div id="divcompartments">
                            {getCompartmentsHTML()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table style={{ width: "100%" }} cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ width: "80%", position: "relative" }}>
                      <div id="divFooterTime">{timeGraphHtml()}</div>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <table style={{ width: "99%" }} cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td className="marineDashboardFrameTd1">
                      <table
                        style={{ width: "100%" }}
                        cellPadding="0"
                        cellSpacing="0"
                      >
                        <tbody>
                          <tr>
                            <td style={{ width: "12%" }}>
                              <div
                                style={{ width: "100%", height: "15px" }}
                              ></div>
                            </td>
                            <td className="marineDashboardFrameTd2">
                              <div
                                id="divShiftNames"
                                style={{ width: "100%", height: "15px" }}
                              >
                                {shiftNames()}
                              </div>
                            </td>
                            <td style={{ width: "2.1%" }}>
                              <div
                                style={{ width: "100%", height: "15px" }}
                              ></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="marineDashboardFrameTd3">
                      <div
                        id="divLiveCompHeader"
                        className="marineDashboardFrameDiv1"
                      >
                        {"| " + t("Dashboard_Live_Comp_Header")}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="marineDashboardFrameDiv2">
                <table id="tblResults" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td className="marineDashboardFrameTd4">
                        <div id="divResults">{baysInfoSuccess()}</div>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        <div>
                          <div id="divcompartments">
                            {getCompartmentsHTML()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table width="99%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td className="marineDashboardFrameTd5">
                      <div id="divFooterTime">{timeGraphHtml()}</div>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </TranslationConsumer>
  );
}
