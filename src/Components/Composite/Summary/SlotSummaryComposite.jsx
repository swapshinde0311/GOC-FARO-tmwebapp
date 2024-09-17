import dayjs from "dayjs";
import React, { Component } from "react";
import * as localeData from "dayjs/plugin/localeData";
import SlotSummaryDayBlockComposite from "../Common/SlotBook/SlotSummaryDayBlockComposite";
import { Icon, Tab } from "@scuf/common";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";
import * as Constants from "../../../JS/Constants";
import PropTypes from "prop-types";
class SlotSummaryComposite extends Component {
  state = {};
  getOperationalHours() {
    //console.log(this.props.slotConfigurations);
    let operationalHours = "";
    let selectedConfigurations = this.props.slotConfigurations.filter(
      (sc) => sc.TerminalCode === this.props.terminal.Code
    );
    if (selectedConfigurations.length > 0) {
      let operationalParams = selectedConfigurations[0].SlotParams.filter(
        (sp) => sp.Name === "SlotStartTime"
      );
      if (operationalParams.length > 0) {
        operationalHours = operationalHours + operationalParams[0].Value;
      }
      operationalParams = selectedConfigurations[0].SlotParams.filter(
        (sp) => sp.Name === "SlotEndTime"
      );
      operationalHours = operationalHours + " - ";
      if (operationalParams.length > 0) {
        operationalHours = operationalHours + operationalParams[0].Value;
      }
    }

    return operationalHours;
  }
  getslotBlockObject(dateObj, slotSummary) {
    let selectedSlotBlocks = slotSummary.filter(
      (ss) => ss.SlotDate === dateObj.format("YYYY-MM-DD")
    );
    if (selectedSlotBlocks.length > 0) return selectedSlotBlocks[0];
    else return null;
  }
  getSlotBlockType(dateObj, slotSummary, advanceSlotBookMaxDays) {
    //debugger;
    let slotObject = this.getslotBlockObject(dateObj, slotSummary);
    let slotBlockType = "slotSummaryBlock";
    let currentDate = new Date();
    let currentTimeZone = currentDate.getTimezoneOffset() * -1;
    let terminalTimeZone = this.props.terminal.TimeZone;
    let timeDifference = currentTimeZone - terminalTimeZone;
    let currentLTTime = dayjs().subtract(timeDifference, "minute");
    let currentTime = dayjs();
    // let advanceSlotBookMaxDays = 7;
    // let selectedConfigurations = this.props.slotConfigurations.filter(
    //   (sc) => sc.TerminalCode === this.props.terminal.Code
    // );
    // if (selectedConfigurations.length > 0) {
    //   let operationalParams = selectedConfigurations[0].SlotParams.filter(
    //     (sp) => sp.Name === "AdvanceSlotBookMaxDays"
    //   );
    //   if (operationalParams.length > 0) {
    //     advanceSlotBookMaxDays = operationalParams[0].Value;
    //   }
    // }
    // let slotDate = dayjs(slotObject.SlotDate);
    // let slotdiff = slotDate.diff(currentLTTime, "day");

    if (dayjs(slotObject.SlotEndTime).isBefore(currentTime)) {
      slotBlockType = "slotSummaryBlockOlderDate";
    } else if (
      dayjs(slotObject.SlotDate).diff(currentLTTime, "day") >=
      advanceSlotBookMaxDays
    ) {
      slotBlockType = "slotSummaryBlockWindowClosed";
    } else {
      slotBlockType = "slotSummaryBlock";
    }
    return slotBlockType;
  }

  getSlotSummaryLayout(isRefreshing, slotSummary, slotSource) {
    if (isRefreshing) {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    } else if (slotSummary.length > 0) {
      let advanceSlotBookMaxDays = 7;

      let selectedConfigurations = this.props.slotConfigurations.filter(
        (sc) => sc.TerminalCode === this.props.terminal.Code
      );
      if (selectedConfigurations.length > 0) {
        let operationalParams = selectedConfigurations[0].SlotParams.filter(
          (sp) => sp.Name === "AdvanceSlotBookMaxDays"
        );
        if (operationalParams.length > 0) {
          advanceSlotBookMaxDays = operationalParams[0].Value;
        }
      }

      //debugger;
      let dateObj = this.props.selectedDate;

      dateObj = dateObj.set("date", 1);
      dateObj = dateObj.set("hour", 0);
      dateObj = dateObj.set("minute", 0);
      dateObj = dateObj.set("second", 0);
      dateObj = dateObj.set("millisecond", 0);

      let startDayofMonth = dateObj.day();
      let daysInMonth = dateObj.daysInMonth();
      let daysArray = [];
      let emptyBlocks = [];
      dayjs.extend(localeData);
      let weekdayslong = dayjs.weekdays();
      //for(let i=0;i<)
      let pDateObj = dateObj.set("month", dateObj.month() - 1);

      let pDaysInMonth = pDateObj.daysInMonth();
      //console.log(pDaysInMonth);

      for (let i = 0; i < startDayofMonth; ++i) {
        emptyBlocks.push(pDaysInMonth - startDayofMonth + i + 1);
      }
      for (let i = 1; i <= daysInMonth; ++i) {
        daysArray.push({ date: dateObj.set("date", i) });
      }

      return (
        <div className="tableScroll">
          <div className="slotBlocksDispalyTablet">
            <div className="slotBlocksDispaly">
              {weekdayslong.map((day) => {
                return (
                  <div
                    style={{
                      width: "14%",
                      // minWidth: "100px",
                      textAlign: "center",
                    }}
                  >
                    <span>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="slotSummaryTable">
              {emptyBlocks.map((e) => {
                return (
                  <div className="slotSummaryEmptyTableBlock">
                    <div className="slotSummaryEmptyBlock"></div>
                  </div>
                );
              })}

              {daysArray.map((d) => {
                return (
                  <div
                    className="slotSummaryFilledTableBlock"
                    // onClick={() => {
                    //   this.props.onslotBlockClik(d.date);
                    // }}
                  >
                    <ErrorBoundary>
                      <SlotSummaryDayBlockComposite
                        date={d.date}
                        slotObject={this.getslotBlockObject(
                          d.date,
                          slotSummary
                        )}
                        slotBlockType={this.getSlotBlockType(
                          d.date,
                          slotSummary,
                          advanceSlotBookMaxDays
                        )}
                        bookingWindow={advanceSlotBookMaxDays}
                        onslotBlockClik={this.props.onslotBlockClik}
                        //slots="15 available"
                      />
                    </ErrorBoundary>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <TranslationConsumer>
          {(t) => (
            <div>
              {slotSource === Constants.slotSource.SHIPMENT
                ? t("ShipmentSlotSummaryEmpty")
                : t("ReceiptSlotSummaryEmpty")}
            </div>
          )}
        </TranslationConsumer>
      );
    }
  }
  getTabControl() {
    if (
      this.props.operationsVisibilty.shipments &&
      this.props.operationsVisibilty.receipts
    ) {
      return (
        <TranslationConsumer>
          {(t) => (
            <Tab
              activeIndex={this.props.defaultTabIndex}
              onTabChange={(activeIndex) => {
                this.props.onTabChange(activeIndex);
              }}
            >
              <Tab.Pane title={t("Common_Shipments")}>
                {this.getSlotSummaryLayout(
                  this.props.isShipmentsRefreshing,
                  this.props.shipmentsSummary,
                  Constants.slotSource.SHIPMENT
                )}
              </Tab.Pane>

              <Tab.Pane title={t("Common_Receipts")}>
                {this.getSlotSummaryLayout(
                  this.props.isReceiptsRefreshing,
                  this.props.receiptsSummary,
                  Constants.slotSource.RECEIPT
                )}
              </Tab.Pane>
            </Tab>
          )}
        </TranslationConsumer>
      );
    } else if (this.props.operationsVisibilty.shipments) {
      return (
        <TranslationConsumer>
          {(t) => (
            <Tab
              activeIndex={this.props.defaultTabIndex}
              onTabChange={(activeIndex) => {
                this.props.onTabChange(activeIndex);
              }}
            >
              <Tab.Pane title={t("Common_Shipments")}>
                {this.getSlotSummaryLayout(
                  this.props.isShipmentsRefreshing,
                  this.props.shipmentsSummary,
                  Constants.slotSource.SHIPMENT
                )}
              </Tab.Pane>
            </Tab>
          )}
        </TranslationConsumer>
      );
    } else if (this.props.operationsVisibilty.receipts) {
      return (
        <TranslationConsumer>
          {(t) => (
            <Tab
              activeIndex={this.props.defaultTabIndex}
              onTabChange={(activeIndex) => {
                this.props.onTabChange(activeIndex);
              }}
            >
              <Tab.Pane title={t("Common_Receipts")}>
                {this.getSlotSummaryLayout(
                  this.props.isReceiptsRefreshing,
                  this.props.receiptsSummary,
                  Constants.slotSource.RECEIPT
                )}
              </Tab.Pane>
            </Tab>
          )}
        </TranslationConsumer>
      );
    }
  }

  render() {
    // console.log(this.props);
    //debugger;
    let selectedDate = this.props.selectedDate;
    // );
    return (
      <TranslationConsumer>
        {(t) => (
          <div className="slotSummaryPane">
            <div className="row lightBackground">
              <div
                className="col-12 col-md-7 col-lg-8 slotDateColHeader"
                //style={{ fontSize: "24PX", fontWeight: "bold" }}
              >
                <div className="slotBlocksDispaly">
                  <div>
                    <Icon
                      onClick={() => this.props.onDateChange("month", -1)}
                      style={{ cursor: "pointer" }}
                      root="common"
                      name="double-caret-left"
                      exactSize={24}
                    ></Icon>
                  </div>
                  <div className="slotDateSpan">
                    <span>{selectedDate.format("DD-MMM-YYYY")}</span>
                  </div>

                  <div>
                    <Icon
                      onClick={() => this.props.onDateChange("month", 1)}
                      style={{ cursor: "pointer" }}
                      root="common"
                      name="double-caret-right"
                      exactSize={24}
                    ></Icon>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-md-5 col-lg-4 below-text"
                style={{ textAlign: "right" }}
              >
                <span className="ui error-message">
                  {this.props.terminal.Code} {t("SlotOpHours")}
                  {this.getOperationalHours()}
                </span>
              </div>
            </div>
            {this.getTabControl()}
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

export default SlotSummaryComposite;

SlotSummaryComposite.propTypes = {
  terminal: PropTypes.object.isRequired,
  transportationType: PropTypes.string.isRequired,
  shipmentsSummary: PropTypes.array,
  receiptsSummary: PropTypes.array,
  selectedDate: PropTypes.object.isRequired,
  operationsVisibilty: PropTypes.shape({
    add: PropTypes.bool,
    shipments: PropTypes.bool,
    receipts: PropTypes.bool,
    terminal: PropTypes.bool,
  }).isRequired,
  isShipmentsRefreshing: PropTypes.bool.isRequired,
  isReceiptsRefreshing: PropTypes.bool.isRequired,
  slotConfigurations: PropTypes.array.isRequired,
  defaultTabIndex: PropTypes.number.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onslotBlockClik: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
