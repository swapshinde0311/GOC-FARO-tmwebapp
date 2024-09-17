import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import { TranslationConsumer } from "@scuf/localization";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { Select, Icon } from "@scuf/common";
import lodash from "lodash";
import moment from 'moment';
import BaySlotComposite from "../Common/SlotBook/BaySlotComposite";
import * as Constants from "../../../JS/Constants";
import dayjs from "dayjs";
import CommonLoadingModal from "../../UIBase/Common/CommonLoadingModal";
import CommonMessageModal from "../../UIBase/Common/CommonMessageModal";

class RoadSlotBookComposite extends Component {
  state = {
    transaction: this.props.transaction,
    terminalList: [],
    bayList: [],
    selectedTerminal: { Key: { Code: "" }, Value: [] },
    selectedDate: dayjs(),
    slotConfigurations: this.props.slotConfigutationList,
    slotTimeList: [],
    slotParameters: {
      slotStartTime: dayjs(), //LocalTerminalTime
      slotEndTime: dayjs(), //LocalTerminalTime
      slotDuration: 30,
      timeDifference: 0,
      minSlotMinutesToBook: 30,
      maxSlotDaysToBook: 7,
      minSlotChangeMinutes: 90,
      maxSlots: 1,
      refreshTime: 5,
      terminalCode: ""
    },
    baySlotList: [],
    isRefreshing: false,
    bookedSlotList: [],

    showTipModal: false,
    tipSuccess: false,
    tipMessage: ""
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    try {
      this.getTerminalList();

      this.refreshSlotState = this.refreshSlotState.bind(this);
    } catch (error) {
      console.log("RoadSlotBookComposite:Error occurred on componentDidMount", error);
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

  getTerminalList() {
    axios(RestAPIs.GetTerminalDetailsForFeature + "0", Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;

      if (result.IsSuccess === true) {
        if (Array.isArray(result.EntityResult) && result.EntityResult.length > 0) {
          let filterTerminalList = this.fiterTerminalList(result.EntityResult);

          if (filterTerminalList.length > 0) {
            let tmpSelectedTerminal = filterTerminalList.find(t => t.Key.Code === this.state.transaction.BookedTerminal);
            if (tmpSelectedTerminal === null || tmpSelectedTerminal === undefined) {
              tmpSelectedTerminal = filterTerminalList[0];
            }

            this.setDefaultSelectDate(tmpSelectedTerminal.Key.TimeZone);

            this.setState({
              terminalList: filterTerminalList,
              selectedTerminal: tmpSelectedTerminal
            }, () => {
              this.handleTerminalChange(this.state.selectedTerminal.Key.Code);
            });
          } else {
            this.failed("TerminalList_NotAvailable");
          }

        } else {
          console.log("Error while getting Terminal List:", result);
          this.failed("TerminalList_NotAvailable");
        }
      } else {
        console.log("Error while getting Terminal List:", result);
        this.failed("TerminalList_NotAvailable");
      }
    }).catch((error) => {
      this.failed("error");
      console.log("Error while getting Terminal List:", error);
    });
  }

  setDefaultSelectDate(timeZone) {
    let selectedDate=dayjs();
    if (this.props.isEditBook) {
      selectedDate = this.state.transaction.StartTime;
    }
    let currentDate = new Date();
    let currentTimeZone = currentDate.getTimezoneOffset() * -1;
    let timeDifference = currentTimeZone - timeZone;
    selectedDate = dayjs(selectedDate).add(-1 * timeDifference, "minutes").set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);
    this.setState({
      selectedDate: selectedDate
    });
  }

  fiterTerminalList(terminalList) {
    let newTerminalList = [];
    let plannedTerminalList = this.state.transaction.PlannedTerminal.split(',');

    terminalList.map(t => {
      if (plannedTerminalList.indexOf(t.Key.Code) !== -1) {
        newTerminalList.push(t);
      }
    });

    return newTerminalList;
  }

  getBaysforTerminal() {
    axios(RestAPIs.GetBaysOfUser + "?TransportationType=" + Constants.TransportationType.ROAD + "&TerminalCode=" + this.state.selectedTerminal.Key.Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult) && result.EntityResult.length > 0) {
            let resultList = this.props.isShipment ? result.EntityResult.filter(b => b.BayType === "BOTH" || b.BayType === "LOADING") :
              result.EntityResult.filter(b => b.BayType === "BOTH" || b.BayType === "UNLOADING");
            let bayList = [];
            resultList.forEach((bay) => {
              let bayItem = {
                bayCode: bay.BayCode,
                active: bay.Active,
                bayType: bay.BayType,
                shareholder: [],
              };

              if (Array.isArray(bay.SupportedProducts)) {
                bay.SupportedProducts.forEach((product) => {
                  if (product.Active) {
                    let shareholderArray = bayItem.shareholder.filter(
                      (sh) => sh.shCode === product.Shareholdercode
                    );
                    if (shareholderArray.length > 0) {
                      shareholderArray[0].fpCodes.push(product.Code);
                    } else {
                      bayItem.shareholder.push({
                        shCode: product.Shareholdercode,
                        fpCodes: [product.Code],
                      });
                    }
                  }
                });
              }
              bayList.push(bayItem);
            });

            this.setState({
              bayList
            }, () => {
              this.setSlotParam();
            });
          } else {
            this.failed("BaySearch_NoResult");
            console.log("No Bays found:", result);
          }
        } else {
          this.failed("BaySearch_NoResult");
          console.log("Error while getting bays:", result);
        }
      }).catch((error) => {
        this.failed("BaySearch_NoResult");
        console.log("Error while getting getBaysforTerminal:", error);
      });
  }

  getTerminalDropdownOptions() {
    let list = this.state.terminalList.map(function (a) {
      return a.Key.Code;
    });
    return Utilities.transferListtoOptions(list);
  }

  handleTerminalChange = (terminalCode) => {
    try {
      let terminals = this.state.terminalList;
      let filteredTerminals = terminals.filter(t => t.Key.Code === terminalCode);
      if (filteredTerminals.length == 0) {
        return;
      }

      let slotConfigurations = this.state.slotConfigurations;
      let selectedSlotConfigurations = slotConfigurations.filter((sc) => sc.TerminalCode === terminalCode);
      if (selectedSlotConfigurations.length > 0 && selectedSlotConfigurations[0].SlotParams.length > 0) {
        this.setState({
          selectedTerminal: filteredTerminals[0]
        }, () => { this.getBaysforTerminal(); });
      } else {
        this.failed("SlotConfigurationsEmpty");
      }
    } catch (error) {
      this.failed("error");
      console.log("SlotBookComposite:Error occured on handleTerminalChange", error);
    }
  }

  handleDateChange = (duration) => {
    try {
      let selectedDate = this.state.selectedDate;
      selectedDate = selectedDate.add(duration, "day");
      this.setState({
        selectedDate
      }, () => {
        this.setSlotParam();
      });
    } catch (error) {
      console.log("error in handleDateChanage", error);
    }
  }

  getBookedSlotList() {
    let slotParams = this.state.slotParameters;
    let slotRequestInfo = {
      TerminalCode: slotParams.terminalCode,
      TransportationType: Constants.TransportationType.ROAD,
      TransactionSource: this.props.isShipment ? Constants.slotSource.SHIPMENT : Constants.slotSource.RECEIPT,
      FromDate: slotParams.slotStartTime.add(slotParams.timeDifference, "minute").toDate(),
      ToDate: slotParams.slotEndTime.add(slotParams.timeDifference, "minute").toDate(),
    };

    axios(RestAPIs.GetSlotsList, Utilities.getAuthenticationObjectforPost(slotRequestInfo, this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;
      let tmpBookedSlotList = [];
      if (result.IsSuccess === true) {
        if (Array.isArray(result.EntityResult)) {
          tmpBookedSlotList = result.EntityResult;
        }
      } else {
        this.failed(result.ErrorList[0]);
      }

      this.setState({
        bookedSlotList: tmpBookedSlotList
      }, () => {
        this.setBaySlotList();
      });
    }).catch((error) => {
      this.setState({
        bookedSlotList: []
      }, () => {
        this.setBaySlotList();
      });
      this.failed(error);
    });
  }

  isSelectedDateOutofRange(selectedDate) {
    let slotParams = this.state.slotParameters;
    if (slotParams === null || slotParams.timeDifference <= 0) {
      return true;
    }

    let currentTime = dayjs();
    let ltCurrentTime = currentTime.add(-1 * slotParams.timeDifference, "minute");
    // let minTimeForBook = currentTime.add(slotParams.minSlotMinutesToBook,"minute");
    return selectedDate.diff(ltCurrentTime, "day") < 0 || selectedDate.diff(ltCurrentTime, "day") >= slotParams.maxSlotDaysToBook;
  }

  isProductCompatibleWithBay(bayFPList) {
    let fpList = this.props.productList;
    if (fpList.length === 0 || bayFPList.length === 0) {
      return false;
    }

    //Make sure Bay products contains at least one shipment Products
    for (let i = 0; i < fpList.length; i++) {
      if (bayFPList.filter(p => p === fpList[i].FinishedProductCode).length !== 0) {
        return true;
      }
    }

    return false;
  }

  getBaySupportProductList(bay, shareholder) {
    let baySHList = bay.shareholder.filter(s => s.shCode === shareholder);
    if (baySHList.length === 0) {
      return [];
    }

    return baySHList[0].fpCodes;
  }

  setSlotParam() {
    let terminalTimeZone = this.state.selectedTerminal.Key.TimeZone;
    let selectedConfig = this.state.slotConfigurations.filter(
      (sc) => sc.TerminalCode === this.state.selectedTerminal.Key.Code
    );

    if (selectedConfig.length === 0) {
      this.failed("SlotConfigurationsEmpty");
      return;
    }

    let currentDate = new Date();
    let currentTimeZone = currentDate.getTimezoneOffset() * -1;
    let timeDifference = currentTimeZone - terminalTimeZone;
    let slotStartTime = this.state.selectedDate;
    let slotEndTime = this.state.selectedDate;
    let startTime = "00:00";
    let endTime = "23:59";
    let slotDuration = "30";
    let maxNoOfSlots = 1;
    let minSlotMinutesToBook = 30;
    let maxSlotDaysToBook = 7;
    let minSlotChangeMinutes = 90;
    let refreshTime = 5;

    let operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "SlotStartTime"
    );
    if (operationalParams.length > 0) {
      startTime = operationalParams[0].Value;
    }
    operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "SlotEndTime"
    );
    if (operationalParams.length > 0) {
      endTime = operationalParams[0].Value;
    }
    operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "SlotDuration"
    );
    if (operationalParams.length > 0) {
      slotDuration = operationalParams[0].Value;
    }
    operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "MaxNoOfSlots"
    );
    if (operationalParams.length > 0) {
      maxNoOfSlots = operationalParams[0].Value;
    }
    operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "AdvanceSlotBookMaxDays"
    );
    if (operationalParams.length > 0) {
      maxSlotDaysToBook = operationalParams[0].Value;
    }
    operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "BookAdvSlotMinutes"
    );
    if (operationalParams.length > 0) {
      minSlotMinutesToBook = operationalParams[0].Value;
    }
    operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "ChangeAdvSlotMinutes"
    );
    if (operationalParams.length > 0) {
      minSlotChangeMinutes = operationalParams[0].Value;
    }
    operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "RefreshInterval"
    );
    if (operationalParams.length > 0) {
      refreshTime = operationalParams[0].Value;
    }


    slotStartTime = slotStartTime.set("hour", startTime.split(":")[0]).set("minute", startTime.split(":")[1]);
    slotEndTime = slotEndTime.set("hour", endTime.split(":")[0]).set("minute", endTime.split(":")[1]);

    if (slotStartTime.diff(slotEndTime, "minute") >= 0) {
      slotEndTime = slotEndTime.add(1, "day");
    }

    let tempSlotStartTime = lodash.cloneDeep(slotStartTime);
    let tmpSlNo = 1;

    let slotTimeList = [];
    while (tempSlotStartTime < slotEndTime) {
      let tempSlotEndTime = tempSlotStartTime.add(slotDuration, "minute");
      slotTimeList.push({
        slNo: tmpSlNo,
        startLTTime: tempSlotStartTime,
        startCurrentTime: tempSlotStartTime.add(timeDifference, "minute"),
        endLTTime: tempSlotEndTime,
        endCurrentTime: tempSlotEndTime.add(timeDifference, "minute"),
        booked: false,
        isVisible: true
      });

      tempSlotStartTime = tempSlotEndTime;
      tmpSlNo += 1;
    }

    let slotParameters = {
      slotStartTime: slotStartTime,
      slotEndTime: slotEndTime,
      slotDuration: slotDuration,
      timeDifference: timeDifference,
      terminalCode: this.state.selectedTerminal.Key.Code,
      maxSlots: maxNoOfSlots,
      minSlotChangeMinutes: minSlotChangeMinutes,
      minSlotMinutesToBook: minSlotMinutesToBook,
      maxSlotDaysToBook: maxSlotDaysToBook,
      refreshTime: refreshTime,
    };

    this.setState({
      slotTimeList,
      slotParameters,
    }, () => {
      this.getBookedSlotList();
    });
  }

  handleSlotTimeList(bay) {
    let slotTimeList = lodash.cloneDeep(this.state.slotTimeList);
    if (bay.bayCode !== this.state.transaction.BookedBay) {
      return slotTimeList;
    }

    let slotParams = lodash.cloneDeep(this.state.slotParameters);
    let startTime = this.state.transaction.StartTime;
    let endTime = this.state.transaction.EndTime;
    let bookedStartTime = dayjs(startTime).add(-1 * slotParams.timeDifference, "minutes");
    let bookedEndTime = dayjs(endTime).add(-1 * slotParams.timeDifference, "minutes");
    if (this.state.selectedDate.diff(bookedStartTime, "day") != 0) {
      return slotTimeList;
    }

    if (this.state.transaction.SlotBooked === false) {
      return slotTimeList;
    }

    if (this.state.transaction.BookedTerminal !== this.state.selectedTerminal.Key.Code) {
      return slotTimeList;
    }

    slotTimeList.forEach(s => {
      let tmpStartTime = dayjs(s.startLTTime);
      let tmpEndTime = dayjs(s.endLTTime);
      if (tmpStartTime >= bookedStartTime && tmpEndTime <= bookedEndTime) {
        s.booked = true;
      }
    });

    //if has more than 1 booked slots, then display those slots together
    let tmpContinuousSlots = slotTimeList.filter(s => s.booked);
    if (tmpContinuousSlots.length <= 1) {
      return slotTimeList;
    }

    let tmpStartSlot = tmpContinuousSlots[0];
    let tmpEndSlot = tmpContinuousSlots[tmpContinuousSlots.length - 1];
    tmpStartSlot.endCurrentTime = tmpEndSlot.endCurrentTime;
    tmpStartSlot.endLTTime = tmpEndSlot.endLTTime;

    slotTimeList = slotTimeList.filter(s => s.booked === false);
    slotTimeList.push(tmpStartSlot);
    slotTimeList.sort((s1, s2) => { return s1.slNo >= s2.slNo ? 1 : -1 });

    return slotTimeList;
  }

  setBaySlotList() {
    try {
      let fpList = this.props.productList;
      let shareholder = fpList.length === 0 ? "" : fpList[0].ShareholderCode;

      let baySlotList = [];
      this.state.bayList.forEach(b => {
        let bayFPList = this.getBaySupportProductList(b, shareholder);
        let isCompatible = this.isProductCompatibleWithBay(bayFPList);

        if (isCompatible) {
          let slotTimeList = this.handleSlotTimeList(b);
          slotTimeList.forEach(s => {
            s.isVisible = this.isSlotVisible(b,s, isCompatible);
          });

          if (slotTimeList.filter(s => s.isVisible).length !== 0) {
            baySlotList.push((
              <div style={{ marginBottom: "16px", height: "100px" }} className="mobile-bay-slot-div-content">
                <BaySlotComposite isShipment={this.props.isShipment} slotTimeList={slotTimeList} locationCode={b.bayCode} isBayCompatible={isCompatible}
                  productList={fpList} bayFPList={bayFPList} isEditBook={this.props.isEditBook} transaction={this.state.transaction}
                  selectedDate={this.state.selectedDate} selectedTerminal={this.state.selectedTerminal} operationsVisibilty={this.props.operationsVisibilty}
                  slotParameters={this.state.slotParameters} refreshSlotState={this.refreshSlotState}></BaySlotComposite>
              </div>
            ));
          }
        }
      });

      this.setState({
        baySlotList: baySlotList
      });
    } catch (error) {
      console.log("RoadSlotBookComposite::setBaySlotList:" + error);
    }
  }

  isSlotVisible(bayInfo,slotTime, isBayCompatible) {
    if (slotTime.booked) {
      return true;
    }

    if (!isBayCompatible) {
      return false;
    }

    if (this.props.operationsVisibilty.add === false) {
      return false;
    }
    let slotParams = lodash.cloneDeep(this.state.slotParameters);
    let currentTime = dayjs();
    let ltCurrentTime = currentTime.add(-1 * slotParams.timeDifference, "minute");
    let minTimeForBook = ltCurrentTime.add(slotParams.minSlotMinutesToBook, "minute");
    //booked and past time
    let bookedStartTime = dayjs(this.state.transaction.StartTime).add(-1 * slotParams.timeDifference, "minutes");
    if (this.state.transaction.SlotBooked ===true && minTimeForBook.isBefore(bookedStartTime) === false) {
      return false;
    }
    if (minTimeForBook.isBefore(slotTime.startLTTime) === false) {
      return false;
    }

    if (this.state.selectedDate.diff(ltCurrentTime, "day") >= slotParams.maxSlotDaysToBook) {
      return false;
    }

    //if current slot is alreay been booked, then it's invisible
    let bookedSlotList = lodash.cloneDeep(this.state.bookedSlotList);
    if (bookedSlotList.length === 0) {
      return true;
    }


    bookedSlotList = bookedSlotList.filter(s => s.TerminalCode === this.state.selectedTerminal.Key.Code && s.TransactionCode !== this.state.transaction.Code
      && s.TransportationType + "" === Constants.TransportationType.ROAD && s.LocationCode === bayInfo.bayCode);

    if (bookedSlotList.length === 0) {
      return true;
    }
    bookedSlotList.forEach(s => {
      s.StartTime = dayjs(s.StartTime).add(-1 * slotParams.timeDifference, "minute");
      s.EndTime = dayjs(s.EndTime).add(-1 * slotParams.timeDifference, "minute");
    });
    if (bookedSlotList.filter(b => b.StartTime <= slotTime.startLTTime && b.EndTime >= slotTime.endLTTime).length !== 0) {
      return false;
    }
    return true;
  }

  refreshSlotState(message, actionType, result) {
    let transaction = lodash.cloneDeep(this.state.transaction);

    if (actionType === "CREATE" || actionType === "UPDATE") {
      transaction.ReferenceNumber = result.ReferenceNumber;
      transaction.StartTime = result.StartTime;
      transaction.EndTime = result.EndTime;
      transaction.BookedTerminal = result.TerminalCode;
      transaction.BookedBay = result.LocationCode;
      transaction.SlotBooked = true;
    } else if (actionType === "CANCEL") {
      transaction.ReferenceNumber = "";
      transaction.StartTime = "";
      transaction.EndTime = "";
      transaction.BookedTerminal = "";
      transaction.BookedBay = "";
      transaction.SlotBooked = false;
    }

    this.setState({
      transaction: transaction
    }, () => {
      this.getBookedSlotList();
      this.success(message);
    });
  }

  render() {
    try {
      let terminalOptions = this.getTerminalDropdownOptions();
      let baySlotList = lodash.cloneDeep(this.state.baySlotList);

      return (
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div>
                <div className="ui breadcrumb pl-1 mobile-bread-crumb mobile-align-items-start">
                  <div className="section mt-sm-2 mt-lg-0"
                    style={{ cursor: "pointer" }}
                    onClick={this.props.handleBackClick}>
                    <Icon root="common" name="caret-left" className="caretLeft"></Icon>
                  </div>
                  <div className="section pl-1 mt-sm-2 mt-lg-0">
                    <span>
                      {this.props.isShipment ? t("TruckShipment") + " - " + this.props.transaction.Code : t("TruckReceipt") + " - " + this.props.transaction.Code}
                    </span>
                  </div>
                </div>
                <div id="terminal">
                  <div className="mobile-terminal-select">
                    <span>{t("Common_Terminal")}</span>
                    <Select className="mobile-select"
                      placeholder={t("Common_Terminal")}
                      value={this.state.selectedTerminal.Key.Code}
                      options={terminalOptions}
                      fluid={true}
                      onChange={(value) => this.handleTerminalChange(value)}
                      disabled={this.state.transaction.SlotBooked}
                    />
                  </div>
                </div>
                <div id="Date" className="mobile-date-selector">
                  <div className="slotBlocksDispaly" style={{ justifyContent: "center" }}>
                    <div>
                      <Icon
                        onClick={() => this.handleDateChange(-1)}
                        style={{ cursor: "pointer" }}
                        root="common"
                        name="caret-left"
                        exactSize={24}
                      ></Icon>
                    </div>
                    <div className="mobile-slot-date-span">
                      <span>{this.state.selectedDate.format("DD MMM YYYY")}</span>
                    </div>

                    <div>
                      <Icon
                        onClick={() => this.handleDateChange(1)}
                        style={{ cursor: "pointer" }}
                        root="common"
                        name="caret-right"
                        exactSize={24}
                      ></Icon>
                    </div>
                  </div>
                </div>

                {baySlotList.length !== 0 ? (
                  <div id="content" className="mobile-bay-slot-div">
                    {baySlotList}
                  </div>
                ) : (
                  <div className="col-12 col-md-12 col-lg-12" style={{ textAlign: "center" }}>
                    {t("MarineDashboard_NoDataAvailable")}
                  </div>
                )}

                <CommonLoadingModal isOpen={this.state.isRefreshing} loadingMessage="Loading"></CommonLoadingModal>
                <CommonMessageModal isSuccess={this.state.tipSuccess} isOpen={this.state.showTipModal} message={this.state.tipMessage}
                  handleClose={() => { this.setState({ showTipModal: false }) }}></CommonMessageModal>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary >
      );
    } catch (error) {
      console.log("Error while render RoadSlotBookComposite:", error);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(RoadSlotBookComposite);

RoadSlotBookComposite.propTypes = {
  isShipment: PropTypes.bool.isRequired,
  transaction: PropTypes.object,
  handleBackClick: PropTypes.func,
  productList: PropTypes.array,
  operationsVisibilty: PropTypes.object.isRequired
};