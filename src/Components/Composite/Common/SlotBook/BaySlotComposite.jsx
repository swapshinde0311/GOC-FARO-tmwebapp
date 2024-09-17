import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Tooltip } from "@scuf/common";
import PropTypes from "prop-types";
import ErrorBoundary from "../../../ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "../../../../CSS/styles.css";
import { TranslationConsumer } from "@scuf/localization";
import axios from "axios";
import * as RestAPIs from "../../../../JS/RestApis";
import * as Utilities from "../../../../JS/Utilities";
import lodash from "lodash";
import dayjs from "dayjs";
import * as Constants from "../../../../JS/Constants";
import BookSlotComposite from "./BookSlotComposite";
import CommonMessageModal from "../../../UIBase/Common/CommonMessageModal";
import CommonConfirmModal from "../../../UIBase/Common/CommonConfirmModal";
import CommonLoadingModal from "../../../UIBase/Common/CommonLoadingModal";

class BaySlotComposite extends Component {
  state = {
    selectedSlot: {},

    slots: [],
    tempSlotInfo: {},
    showCancelModal: false,
    showUpdateModal: false,
    isRefreshing: false,

    showTipModal: false,
    tipSuccess: false,
    tipMessage: ""
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    try {
      this.generateSlots();
    } catch (error) {
      console.log("BaySlotComposite:Error occurred on componentDidUpdate", error);
    }
  }

  componentDidUpdate() {
    try {
      //scroll to the booked slot
      let el = window.document.getElementById(this.props.locationCode + "Div");
      if (el != null) {
        let bookedSlot = this.props.slotTimeList.find(s => s.booked);
        if (bookedSlot != null) {
          let index = this.props.slotTimeList.filter(s => s.isVisible).indexOf(bookedSlot);
          let postion = index * (100 + 2);
          el.scrollLeft = postion;
        }
      }
    } catch (error) {
      console.log("BaySlotComposite:Error occurred on componentDidUpdate", error);
    }
  }

  success(msg) {
    this.showMessage(true, true, msg);
  }

  failed(msg) {
    this.showMessage(true, false, msg);
  }

  showMessage(isShowTip, isSuccess, message) {
    this.setState({
      showTipModal: isShowTip,
      tipSuccess: isSuccess,
      tipMessage: message
    });
  }

  getBookSlotParam(slotTime) {
    let startTime = slotTime.startCurrentTime;
    let endTime = slotTime.endCurrentTime;
    let slotInfo = {
      Remarks: "Mobile Slot Booked",
      TransactionType: this.props.isShipment ? "1" : "2",
      TransactionCode: this.props.transaction.Code,
      Status: Constants.slotStatus.BOOKED,
      StartTime: startTime,
      EndTime: endTime,
      LocationCode: this.props.locationCode,
      ShareholderCode: this.props.transaction.ShareholderCode,
      TerminalCode: this.props.selectedTerminal.Key.Code,
      TransportationType: Constants.TransportationType.ROAD,
      Attributes: []
    };

    return slotInfo;
  }

  getCancelBookParam(slotTime) {
    let currentDate = new Date();
    let currentTimeZone = currentDate.getTimezoneOffset() * -1;
    let timeDifference = currentTimeZone - this.props.selectedTerminal.Key.TimeZone;
    let startTime = dayjs(slotTime.startLTTime);
    let endTime = dayjs(slotTime.endLTTime);

    let slotInfo = {
      Remarks: "Mobile Slot Canceled",
      TransactionType: this.props.isShipment ? "1" : "2",
      TransactionCode: this.props.transaction.Code,
      Status: Constants.slotStatus.BOOKED,
      StartTime: startTime.add(timeDifference, "minute").toDate(),
      EndTime: endTime.add(timeDifference, "minute").toDate(),
      LocationCode: this.props.locationCode,
      ShareholderCode: this.props.transaction.ShareholderCode,
      TerminalCode: this.props.selectedTerminal.Key.Code,
      TransportationType: Constants.TransportationType.ROAD,
      ReferenceNumber: this.props.transaction.ReferenceNumber,
      Attributes: []
    };

    return slotInfo;
  }

  generateSlots() {
    let slots = this.props.slotTimeList.map(s => {
      if (s.isVisible) {
        let isCanCancel = this.isCanCancelBook(s);
        return <BookSlotComposite slotTime={s} isCanCancel={isCanCancel}
          handleSlotBook={() => this.bookSlot(s)} handleCancelBook={() => this.cancelBook(s)}
          operationsVisibilty={this.props.operationsVisibilty} terminalZone={this.props.selectedTerminal.Key.TimeZone}></BookSlotComposite>;
      }
    });

    this.setState({
      slots: slots
    });
  }

  isCanCancelBook(slotTime) {
    if (this.props.operationsVisibilty.cancel === false) {
      return false;
    }
    let slotParams = this.props.slotParameters;
    let currentTime = dayjs();
    let ltCurrentTime = currentTime.add(-1 * slotParams.timeDifference, "minute");
    let minTimeForBook = ltCurrentTime.add(slotParams.minSlotMinutesToBook, "minute");
    let startCurrentTime = dayjs(slotTime.startCurrentTime).add(-1 * slotParams.timeDifference, "minutes");
    if (minTimeForBook.isBefore(startCurrentTime) === false) {
      return false;
    }
    return true;
  }

  bookSlot(slotTime) {
    if (this.props.transaction.SlotBooked) {
      this.updateBookSlot(slotTime);
    } else {
      this.createBookSlot(slotTime);
    }
  }

  createBookSlot(slotTime) {
    try {
      let tempSlotInfo = this.getBookSlotParam(slotTime);

      let obj = {
        ShareHolderCode: "",
        keyDataCode: 0,
        KeyCodes: null,
        Entity: tempSlotInfo,
      };

      axios(RestAPIs.BookSlot, Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.props.refreshSlotState("COMMON_BOOKING_SUCCESSFUL", "CREATE", result.EntityResult);
        } else {
          this.failed(result.ErrorList[0]);
          console.log("Error while Booking Slot:", result);
        }
      }).catch((error) => {
        this.failed("error");
        console.log("Error while Booking Slot:", error);
      });
    } catch (error) {
      this.failed("error");
      console.log("Error while Booking Slot", error);
    }
  }

  updateBookSlot(slotTime) {
    try {
      this.setState({
        selectedSlot: slotTime,
      }, () => this.showUpdateConfirmModal(true));
    } catch (error) {
      console.log("Error while Update Book Slot", error);
    }
  }

  confirmUpdateBook() {
    try {
      let slotTime = lodash.cloneDeep(this.state.selectedSlot);
      let tempSlotInfo = this.getCancelBookParam(slotTime);

      let obj = {
        ShareHolderCode: "",
        keyDataCode: 0,
        KeyCodes: null,
        Entity: tempSlotInfo,
      };

      axios(RestAPIs.UpdateSlot, Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)).then((response) => {
        this.showUpdateConfirmModal(false);
        let result = response.data;
        if (result.IsSuccess === true) {
          this.props.refreshSlotState("COMMON_UPDATE_BOOKING_SUCCESSFUL", "UPDATE", result.EntityResult);
        } else {
          this.failed(result.ErrorList[0]);
          console.log("Error while Booking Slot:", result);
        }
      }).catch((error) => {
        this.failed("error");
        console.log("Error while Booking Slot:", error);
      });
    } catch (error) {
      this.failed("error");
      console.log("Error while Booking Slot", error);
    }
  }

  showUpdateConfirmModal(flag) {
    this.setState({
      showUpdateModal: flag
    });
  }

  showCancelConfirmModal(flag) {
    this.setState({
      showCancelModal: flag
    });
  }

  cancelBook(slotTime) {
    try {
      this.setState({
        selectedSlot: slotTime
      }, () => this.showCancelConfirmModal(true));
    } catch (error) {
      console.log("Error while Cancel Book Slot", error);
    }
  }

  confirmCancelBook() {
    try {
      let slotTime = lodash.cloneDeep(this.state.selectedSlot);
      let tempSlotInfo = this.getCancelBookParam(slotTime);

      let obj = {
        ShareHolderCode: "",
        keyDataCode: 0,
        KeyCodes: null,
        Entity: tempSlotInfo,
      };

      this.showCancelConfirmModal(false);
      axios(RestAPIs.CancelSlot, Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.props.refreshSlotState("COMMON_CANCEL_BOOKING_SUCCESSFUL", "CANCEL", result.EntityResult);
        } else {
          this.failed(result.ErrorList[0]);
          console.log("Error while  Cancle Slot:", result);
        }
      }).catch((error) => {
        this.showCancelConfirmModal(false);
        this.failed("error");
        console.log("Error while  Cancel Slot:", error);
      });
    } catch (error) {
      this.showCancelConfirmModal(false);
      this.failed("error");
      console.log("Error while Cancel Slot", error);
    }
  }

  render() {
    try {
      let notSupportProducts = [];
      this.props.productList.map(p => {
        let tmpList = this.props.bayFPList.filter(bfp => bfp === p.FinishedProductCode);
        if (tmpList.length === 0) {
          notSupportProducts.push((
            <div style={{ marginBottom: "5px", display: "flex" }}>
              <div style={{ marginRight: "10px", fontSize: "1.75rem" }}>
                <Icon root="common" name="close" size="small" />
              </div>
              <div>
                {p.FinishedProductCode}
              </div>
            </div>
          ))
        }
      });

      let slots = lodash.cloneDeep(this.state.slots);

      let bayFPStr = this.props.bayFPList.map(fp => {
        return fp + " "
      });
      bayFPStr = "Support Products:" + bayFPStr;

      return (
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div>
                <div className="slotBlocksDispaly">
                  <div>
                    <div className="mobile-bay-card">
                      {notSupportProducts.length === 0 ?
                        <div className="mobile-bay-fp-list">
                          <Tooltip
                            content={bayFPStr}
                            element={
                              <span>
                                {this.props.locationCode}
                              </span>
                            }
                            position="top center"
                            event="focus"
                            hoverable={true}
                          />
                        </div>
                        :
                        <div className="mobile-horizontal-center">
                          <div className="mobile-bay-not-compatible-tooltip">
                            <span style={{ marginRight: "5px" }}>
                              <Icon root="common" name="badge-warning" size="small" />
                            </span>
                            <Tooltip
                              content={bayFPStr}
                              element={
                                <span>
                                  {this.props.locationCode}
                                </span>
                              }
                              position="top center"
                              event="focus"
                              hoverable={true}
                            />
                          </div>
                          <div className="mobile-bay-not-compatible-fp">
                            {notSupportProducts}
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                  <div id={this.props.locationCode + "Div"} className="slotBlocksDispaly mobile-slot">
                    {slots}
                  </div>
                </div>

                <CommonLoadingModal isOpen={this.state.isRefreshing} loadingMessage="Loading"></CommonLoadingModal>
                <CommonConfirmModal isOpen={this.state.showCancelModal} confirmMessage="COMMON_CANCEL_CONFIRM"
                  handleNo={() => this.showCancelConfirmModal(false)} handleYes={() => this.confirmCancelBook()}></CommonConfirmModal>
                <CommonMessageModal isSuccess={this.state.tipSuccess} isOpen={this.state.showTipModal} message={this.state.tipMessage}
                  handleClose={() => { this.setState({ showTipModal: false }) }}></CommonMessageModal>

                <CommonConfirmModal isOpen={this.state.showUpdateModal} confirmMessage="BOOKING_MODIFY_CONFIRM"
                  handleNo={() => this.showUpdateConfirmModal(false)} handleYes={() => this.confirmUpdateBook()}></CommonConfirmModal>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary >
      );
    }
    catch (error) {
      console.log("Error while render BaySlotComposite:", error);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(BaySlotComposite);

BaySlotComposite.propTypes = {
  isShipment: PropTypes.bool.isRequired,
  locationCode: PropTypes.string,
  slotList: PropTypes.array,
  refreshSlotState: PropTypes.func
};