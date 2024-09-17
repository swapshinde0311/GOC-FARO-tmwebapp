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
import { functionGroups, fnSlotInformation } from "../../../JS/FunctionGroups";
import { Input, Icon, Button, Modal, Grid } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import moment from 'moment';
import dayjs from 'dayjs';
import RoadSlotBookComposite from "../Details/RoadSlotBookComposite";
import CommonConfirmModal from "../../UIBase/Common/CommonConfirmModal";
import CommonMessageModal from "../../UIBase/Common/CommonMessageModal";
import * as Constants from "../../../JS/Constants";

class RoadSummaryComposite extends Component {
  state = {
    transactionList: [],
    allTransactionList: [],
    compartmentList: [],
    expandedRows: [],
    bookedTransactionList: [],
    driverBayQueueInfo: null,
    isSlotBooking: false,
    isEditBook: false,
    bookingTransaction: null,
    bookingFPList: [],
    modifyModalOpen: false,
    filterKeyword: "",
    slotConfigurations: [],
    operationsVisibilty: {
      add: false,
      modify: false,
      cancel: false
    },

    showTipModal: false,
    tipSuccess: false,
    tipMessage: ""
  };

  constructor(props) {
    super(props);

    this.terminalRender = this.terminalRender.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    this.editRender = this.editRender.bind(this);
    this.filterTransaction = this.filterTransaction.bind(this);
    this.dateRender = this.dateRender.bind(this);
    this.slotRender = this.slotRender.bind(this);
  }

  componentDidMount() {
    try {
      this.initAccessLevel();
      this.getTransactionList();
      this.getBayQueueInfoForUser();
      this.startBayQueueInfoTimer();
    } catch (error) {
      console.log("RoadSummaryComposite:Error occurred on componentDidMount", error);
    }
  }

  componentWillUnmount() {
    this.stopBayQueueInfoTimer();
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

  initAccessLevel() {
    let operationsVisibilty = lodash.cloneDeep(this.state.operationsVisibilty);
    operationsVisibilty.add = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.add,
      fnSlotInformation
    );
    operationsVisibilty.modify = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnSlotInformation
    );
    operationsVisibilty.cancel = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.remove,
      fnSlotInformation
    );

    this.setState({ operationsVisibilty });
  }

  getTransactionList() {
    let json = {
      TransactionType: this.props.isShipment ? 0 : 1
    };

    axios(RestAPIs.GetPendingTransaction, Utilities.getAuthenticationObjectforPost(json, this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;
      if (result.IsSuccess === true) {
        let transList = this.handleTransactionList(result.EntityResult);
        this.setState({
          transactionList: transList,
          allTransactionList: transList,
          bookedTransactionList: transList.filter(t => t.SlotBooked)
        }, () => {
          this.filterTransaction(this.state.filterKeyword);
          this.getSlotConfigurations();
        });

      } else {
        this.setState({ transactionList: [], allTransactionList: [], bookedTransactionList: [] });
        this.failed(result.ErrorList[0]);
        console.log("Failed in RoadSummaryComposite getTransactionList:", result.ErrorList);
      }
    }).catch((error) => {
      this.failed("error");
      console.log("Error in RoadSummaryComposite getTransactionList:", error);
    });
  }

  startBayQueueInfoTimer() {
    let time = parseInt(this.props.bayQueueInfoRefreshInterval);
    this.bayQueueInfoTimer = setInterval(() => {
      this.getBayQueueInfoForUser();
    }, time * 1000);
  }

  stopBayQueueInfoTimer() {
    if (this.bayQueueInfoTimer != null) {
      clearInterval(this.bayQueueInfoTimer);
      this.bayQueueInfoTimer = null;
    }
  }

  getBayQueueInfoForUser() {
    let json = {
      TransactionType: this.props.isShipment ? 0 : 1
    };
    axios(RestAPIs.GetBayQueueInfoForUser, Utilities.getAuthenticationObjectforPost(json, this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;
      if (result.IsSuccess === true) {
        if (Array.isArray(result.EntityResult.Table) && result.EntityResult.Table.length > 0) {
          this.setState({ driverBayQueueInfo: result.EntityResult.Table[0] });
        }
      } else {
        this.setState({ driverBayQueueInfo: null });
        this.failed(result.ErrorList[0]);
        console.log("Failed in RoadSummaryComposite getBayQueueInfoForDriver:", result.ErrorList);
      }
    }).catch((error) => {
      this.setState({ driverBayQueueInfo: null });
      this.failed("error");
      console.log("Error in RoadSummaryComposite getBayQueueInfoForDriver:", error);
    });
  }

  handleTransactionList(transList) {
    //If Slot booked, then use booked terminal as terminal, or use all associated terminals
    let newTransList = [];
    transList.forEach(t => {
      if (t.SlotBooked) {
        t.TerminalCode = t.BookedTerminal;
      } else {
        t.TerminalCode = t.PlannedTerminal;
      }

      let newTrans = lodash.cloneDeep(t);
      newTransList.push(newTrans);
    });

    return newTransList;
  }

  packCompartmentParam(transaction) {
    let keyCode = [
      {
        key: this.props.isShipment ? KeyCodes.shipmentCode : KeyCodes.receiptCode,
        value: transaction.Code,
      },
    ];

    let obj = {
      ShareHolderCode: transaction.ShareholderCode,
      keyDataCode: this.props.isShipment ? KeyCodes.shipmentCode : KeyCodes.receiptCode,
      KeyCodes: keyCode,
    };

    return obj;
  }

  getCompartmentsInfo(transaction) {
    let compartList = lodash.cloneDeep(this.state.compartmentList);

    let existCompList = this.props.isShipment ? compartList.filter(c => c.ShipmentCode === transaction.Code)
      : compartList.filter(c => c.ReceiptCode === transaction.Code);

    if (existCompList.length !== 0) {
      return;
    }

    this.getTransactionDetail(transaction, result => {
      if (this.props.isShipment) {
        result.EntityResult.ShipmentDetailsInfo.map(item => {
          compartList.push(item);
        });
      } else {
        result.EntityResult.ReceiptCompartmentsInfo.map(item => {
          compartList.push(item);
        });
      }

      this.setState({
        compartmentList: compartList
      });
    });
  }

  terminalRender(data) {
    if (data.rowData.SlotBooked) {
      const open = this.state.expandedRows.includes(data.rowData);
      return <div className="terminal-icon" onClick={() => { this.toggleExpand(data.rowData, open) }}>
        <Icon root="common" name={open ? 'caret-up' : 'caret-down'} />
      </div>;
    } else {
      return <div className="terminal-text">{data.rowData.TerminalCode}</div>
    }
  }

  rowExpansionTemplate(data, terminalTitle) {
    try {
      let compartmentData = this.props.isShipment ? this.state.compartmentList.filter(c => c.ShipmentCode === data.Code)
        : this.state.compartmentList.filter(c => c.ReceiptCode === data.Code);

      return <ErrorBoundary>
        <div>
          <div className="mobile-pending-transaction-div-terminal">
            {terminalTitle + ": " + data.BookedTerminal}
          </div>
          <div className="mobile-pending-transaction-tr-datatable mobile-large-font-datable mobile-pending-transaction-product">
            <DataTable showHeader={false} data={compartmentData} selectionMode="single">
              <DataTable.Column field="FinishedProductCode" />
              <DataTable.Column className="text-align-center" />
              <DataTable.Column renderer={this.quantityRender} />
              <DataTable.Column renderer={p => this.editRender(p, data)} />
            </DataTable>
          </div>
        </div>
      </ErrorBoundary >
    } catch (error) {
      console.log("Error while rowExpansionTemplate:", error, data.Code);
    }
  }

  toggleExpand(data, open) {
    try {
      let expanded = this.state.expandedRows;
      let bookedList = lodash.cloneDeep(this.state.bookedTransactionList);

      if (open) {
        let index = expanded.findIndex((item) => JSON.stringify(item) === JSON.stringify(data));
        expanded.splice(index, 1);
        bookedList.push(data);
      } else {
        expanded.push(data);
        bookedList = bookedList.filter(b => b.Code !== data.Code);
        this.getCompartmentsInfo(data);
      }

      this.setState({ expandedRows: expanded, bookedTransactionList: bookedList }, () => {
        let nodeList = document.getElementById("transactionTable").querySelector("table").querySelectorAll("tr.p-datatable-row");

        [].forEach.call(nodeList, function (el) {
          let html = el.innerHTML;
          if (html.indexOf(data.Code) !== -1) {
            if (open) {
              el.classList.remove("mobile-expanded-tr");
            } else {
              el.classList.add("mobile-expanded-tr");
            }
          }
        });
      });
    } catch (error) {
      console.log("Error in toggleExpand:", error, data.Code);
    }
  }

  editRender(data, transaction) {
    try {
      if (this.state.operationsVisibilty.modify === false) {
        return "";
      }

      let compList = lodash.cloneDeep(this.state.compartmentList);
      compList = this.props.isShipment ? compList.filter(c => c.ShipmentCode === data.rowData.ShipmentCode) : compList.filter(c => c.ReceiptCode === data.rowData.ReceiptCode);
      if (data.rowData.CompartmentCode === compList[compList.length - 1].CompartmentCode) {
        //validate book condition
        let isPastTime = this.isPastTimeForBookSlot(transaction);
        return <div className="terminal-icon" onClick={() => this.confirmEditBooking(data.rowData, isPastTime)}>
          {
            isPastTime ? <span className="icon-BookInfo-view" size="small"></span> : <Icon root="common" name="edit" size="small" />
          }
        </div>;
      }
    } catch (error) {
      console.log("Error in RoadSummaryComposite editRender", error);
    }
  }

  getSlotConfigurations() {
    axios(RestAPIs.GetSlotConfigurations + Constants.TransportationType.ROAD, Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;
      if (result.IsSuccess === true) {
        if (Array.isArray(result.EntityResult) && result.EntityResult.length > 0) {
          this.setState({
            slotConfigurations: result.EntityResult,
          });
        } else {
          console.log("Error while getting getSlotConfigurations:", result);
        }
      } else {
        console.log("Error while getting getSlotConfigurations:", result);
      }
    }).catch((error) => {
      console.log("Error while getting getSlotConfigurations:", error);
    });
  }

  isPastTimeForBookSlot(data) {
    let selectedConfig = this.state.slotConfigurations.filter(
      (sc) => sc.TerminalCode === data.BookedTerminal
    );
    if (selectedConfig.length == 0) {
      return false;
    }
    let operationalParams = selectedConfig[0].SlotParams.filter(
      (sp) => sp.Name === "BookAdvSlotMinutes"
    );
    if (operationalParams.length > 0) {
      let minSlotMinutesToBook = operationalParams[0].Value;
      let currentTime = new Date();
      let currentTimeZone = currentTime.getTimezoneOffset() * -1;
      let timeDifference = currentTimeZone - data.TimeZone;
      let startTime = dayjs(data.StartTime).add(-1 * timeDifference, "minute");
      let ltCurrentTime =  dayjs(currentTime).add(-1 * timeDifference, "minute");
      let minTimeForBook = dayjs(ltCurrentTime).add(minSlotMinutesToBook, "minute");
      //booked and past time
      if (minTimeForBook.isBefore(startTime) === false) {
        return true;
      }
    }
    return false;
  }


  quantityRender(data) {
    return data.rowData.Quantity + " " + data.rowData.QuantityUOM;
  }

  slotRender(data, btnContent) {
    if (!data.rowData.SlotBooked) {
      if (this.state.operationsVisibilty.add === false) {
        return "";
      } else {
        return <Button className="border-radius-20" type="primary" size="small" content={btnContent} onClick={() => this.startSlotBooking(data.rowData)}></Button>;
      }
    } else {
      return <Icon root="common" name="badge-check" size="medium" />;
    }
  }

  dateRender(data) {
    if (data.rowData.SlotBooked) {
      let startTime = dayjs(data.rowData.StartTime);
      let endTime = dayjs(data.rowData.EndTime);
      let terminalTimeZone = data.rowData.TimeZone;
      let currentDate = new Date();
      let currentTimeZone = currentDate.getTimezoneOffset() * -1;
      let timeDifference = currentTimeZone - terminalTimeZone;
      let currentStartTime = startTime.add(-1 * timeDifference, "minutes");
      return <div>{currentStartTime.format("DD MMM YY")}<br />{currentStartTime.format("HH:mm")
        + " - "
        + endTime.add(-1 * timeDifference, "minutes").format("HH:mm")}</div>;
    } else {
      let date = dayjs(data.rowData.Date);
      return date.format("DD MMM YY");
    }
  }

  filterTransaction(value) {
    this.setState({ filterKeyword: value });
    let transList = lodash.cloneDeep(this.state.allTransactionList);
    if (value != '') {
      transList = transList.filter(t => t.Code.toUpperCase().indexOf(value.toUpperCase()) != -1);
    }

    this.setState({
      transactionList: transList
    });
  }

  startEditBooking() {
    this.setState({
      isSlotBooking: true
    });

    this.showModifyConfirmModal(false);
  }

  confirmEditBooking(compartment, isPastTime) {
    try {
      let compList = lodash.cloneDeep(this.state.compartmentList);
      compList = this.props.isShipment ? compList.filter(c => c.ShipmentCode === compartment.ShipmentCode) :
        compList.filter(c => c.ReceiptCode === compartment.ReceiptCode);

      let transactionList = this.props.isShipment ? this.state.allTransactionList.filter(t => t.Code === compartment.ShipmentCode) :
        this.state.allTransactionList.filter(t => t.Code === compartment.ReceiptCode);

      let transaction = transactionList.length === 0 ? null : transactionList[0];

      this.setState({
        bookingTransaction: transaction,
        bookingFPList: compList,
        isEditBook: true
      }, () => this.stopBayQueueInfoTimer());
      if (isPastTime == false) {
        this.showModifyConfirmModal(true);
      }
      else
      {
        this.setState({
          isSlotBooking: true
        });

      }
    } catch (error) {
      console.log("Error in confirmEditBooking:", error);
    }
  }

  startSlotBooking(transaction) {
    this.getTransactionDetail(transaction, result => {
      this.setState({
        isSlotBooking: true,
        bookingTransaction: transaction,
        bookingFPList: this.props.isShipment ? result.EntityResult.ShipmentDetailsInfo : result.EntityResult.ReceiptCompartmentsInfo,
        isEditBook: false
      }, () => this.stopBayQueueInfoTimer());
    });
  }

  getTransactionDetail(transaction, successCallback, failedCallback) {
    const api = this.props.isShipment ? RestAPIs.GetShipment : RestAPIs.GetReceipt;
    axios(api, Utilities.getAuthenticationObjectforPost(this.packCompartmentParam(transaction), this.props.tokenDetails.tokenInfo)).then((response) => {
      let result = response.data;
      if (result.IsSuccess === true) {
        successCallback(result);
      } else {
        if (failedCallback !== undefined && failedCallback !== null) {
          failedCallback(result);
        }
        this.failed(result.ErrorList[0]);
      }
    }).catch((error) => {
      this.failed("error");
      console.log("Error while getTransactionDetail:", error, transaction.Code);
    });
  }

  endSlotBooking() {
    this.setState({
      isSlotBooking: false,
      expandedRows: []
    }, () => {
      this.getTransactionList();
      this.startBayQueueInfoTimer();
    });
  }

  showModifyConfirmModal(flag) {
    this.setState({
      modifyModalOpen: flag
    });
  }

  render() {
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div>
              {this.state.isSlotBooking ? (
                <RoadSlotBookComposite isShipment={this.props.isShipment} transaction={this.state.bookingTransaction} slotConfigutationList={this.state.slotConfigurations}
                  productList={this.state.bookingFPList} isEditBook={this.state.isEditBook}
                  handleBackClick={() => this.endSlotBooking()} operationsVisibilty={this.state.operationsVisibilty}></RoadSlotBookComposite>
              ) : ""}

              {this.state.isSlotBooking ? "" :
                (
                  <div>
                    <div className="ui breadcrumb pl-1 mobile-bread-crumb mobile-align-items-start">
                      <div className="section mt-sm-2 mt-lg-0"
                        style={{ cursor: "pointer" }}
                        onClick={this.props.backToHomePage}>
                        <Icon root="common" name="caret-left" className="caretLeft"></Icon>
                      </div>
                      <div className="section pl-1 mt-sm-2 mt-lg-0">
                        <span>
                          {this.props.isShipment ? t("SHIPMENT_SUMMARY") : t("RECEIPT_SUMMARY")}
                        </span>
                      </div>
                    </div>
                    <div id="content" className="mobile-padding-0-30 mobile-margin-top-30">
                      {this.state.driverBayQueueInfo === null ? "" : (
                        <div className="row">
                          <div className="mobile-half-width-card mobile-half-width-card-borderRight mobile-left-card-radius">
                            <div className="mobile-bay-queueinfo-baycode">
                              {this.state.driverBayQueueInfo.BayCode}
                            </div>
                            <div className="mobile-bay-queueinfo-transactioncode">
                              {this.state.driverBayQueueInfo.TransactionCode}
                            </div>
                          </div>
                          <div className="mobile-half-width-card mobile-right-card-radius">
                            <div className="mobile-bay-queueinfo-queuenumber">
                              {t("COMMON_QUEUE")} - {this.state.driverBayQueueInfo.QueueNumber}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mobile-find-your-transaction">
                        <span>{this.props.isShipment ? t("FIND_YOUR_SHIPMENT") : t("FIND_YOUR_RECEIPT")}</span>
                      </div>
                      <div>
                        <Input style={{ border: "none" }} className="input-example mobile-input" placeholder={this.props.isShipment ? t("COMMON_ENTER_SHIPMENT_CODE") : t("COMMON_ENTER_RECEIPT_CODE")}
                          icon={<Icon name="search" root="common" size="small" />} value={this.state.filterKeyword} onChange={this.filterTransaction} fluid={true} />
                      </div>
                      <div className="mobile-pending-transaction-text">
                        <span>{this.props.isShipment ? t("kpi_dashboardPendingShip") : t("kpi_dashboardPendingReceipts")}</span>
                      </div>
                    </div>
                    <div className="mobile-pending-transaction-datatable">
                      <DataTable data={this.state.transactionList} search={false} globalFilterValue="" selection={this.state.bookedTransactionList}
                        searchPlaceholder={this.props.isShipment ? t("COMMON_ENTER_SHIPMENT_CODE") : t("COMMON_ENTER_RECEIPT_CODE")}
                        expandedRows={this.state.expandedRows} rowExpansionTemplate={data => this.rowExpansionTemplate(data, t("Booked_Terminal"))} selectionMode="multiple"
                        onSelectionChange={this.selectionChanged} id="transactionTable">
                        <DataTable.Column header={t("Common_Code")} field="Code" className="header-transaction-code" />
                        <DataTable.Column header={t("COMMON_SLOT")} renderer={d => this.slotRender(d, t("SlotBook_Book"))} className="text-align-center" />
                        <DataTable.Column header={t("Rpt_Date")} renderer={this.dateRender} />
                        <DataTable.Column header={t("Common_Terminal")} renderer={this.terminalRender} />
                      </DataTable>
                    </div>
                  </div>
                )}

              <CommonConfirmModal isOpen={this.state.modifyModalOpen} confirmMessage="BOOKING_MODIFY_CONFIRM"
                handleNo={() => this.showModifyConfirmModal(false)} handleYes={() => this.startEditBooking()}></CommonConfirmModal>
              <CommonMessageModal isSuccess={this.state.tipSuccess} isOpen={this.state.showTipModal} message={this.state.tipMessage}
                handleClose={() => { this.setState({ showTipModal: false }) }}></CommonMessageModal>
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(RoadSummaryComposite);

RoadSlotBookComposite.propTypes = {
  isShipment: PropTypes.bool.isRequired,
  backToHomePage: PropTypes.func
};