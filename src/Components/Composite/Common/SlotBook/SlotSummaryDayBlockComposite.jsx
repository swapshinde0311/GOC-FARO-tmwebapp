import React, { Component } from "react";
//import dayjs from "dayjs";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
class SlotSummaryDayBlockComposite extends Component {
  state = {};
  // isPastDate() {
  //   //debugger;
  //   let currentdate = dayjs();
  //   let slotEndTime = dayjs(new Date(this.props.slotObject.SlotEndTime));
  //   //if (this.props.date.isBefore(currentdate))
  //   if (slotEndTime.isBefore(currentdate)) return true;
  //   else return false;
  // }
  // getslotSummaryBlockStyle() {
  //   //debugger;
  //   let currentdate = dayjs();
  //   let slotEndTime = dayjs(new Date(this.props.slotObject.SlotEndTime));
  //   //if (this.props.date.isBefore(currentdate))
  //   if (slotEndTime.isBefore(currentdate)) return "slotSummaryBlockOlderDate";
  //   else return "slotSummaryBlock";
  // }
  render() {
    if (this.props.slotBlockType === "slotSummaryBlockWindowClosed") {
      return (
        <TranslationConsumer>
          {(t) => (
            <div className={this.props.slotBlockType}>
              <div className="slotBlockDateDiv">
                <span className="slotBlockDateSpan">
                  {this.props.date.get("date")}
                </span>
              </div>
              <div className="slotBlockBookingsDiv">
                <span className="slotBlockBookingsSpan">
                  {t("SlotBookingWindow")}{" "}
                  {this.props.date
                    .subtract(this.props.bookingWindow, "day")
                    .format("DD MMM")}
                </span>
              </div>
            </div>
          )}
        </TranslationConsumer>
      );
    } else {
      return (
        <TranslationConsumer>
          {(t) => (
            <div
              className={
                this.props.slotBlockType
                // this.isPastDate()
                //   ? "slotSummaryBlockOlderDate"
                //   : "slotSummaryBlock"
              }
              onClick={() => this.props.onslotBlockClik(this.props.date)}
            >
              <div className="slotBlockDateDiv">
                <span className="slotBlockDateSpan">
                  {this.props.date.get("date")}
                </span>
              </div>

              <div className="slotBlockBookingsDiv">
                <span className="slotBlockBookingsSpan">
                  {this.props.slotObject.BookingsDone} {t("SlotBookingsDone")}
                </span>
              </div>

              {this.props.slotBlockType === "slotSummaryBlockOlderDate" ? (
                <div className="slotBlockLoadingsDiv">
                  <span className="slotBlockLoadingsSpan">
                    {this.props.slotObject.LoadingsDone} {t("SlotLoadingsDone")}
                  </span>
                </div>
              ) : (
                <div className="slotBlockAvailableDiv">
                  <span className="slotBlockAvailableSpan">
                    {this.props.slotObject.AvailableSlots} {t("SlotsAvailable")}
                  </span>
                </div>
              )}
            </div>
          )}
        </TranslationConsumer>
      );
    }
  }
}

export default SlotSummaryDayBlockComposite;
SlotSummaryDayBlockComposite.propTypes = {
  date: PropTypes.object.isRequired,
  slotObject: PropTypes.object.isRequired,
  slotBlockType: PropTypes.string.isRequired,
};
