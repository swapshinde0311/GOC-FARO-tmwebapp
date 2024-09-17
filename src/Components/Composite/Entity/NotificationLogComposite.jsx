import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUIInstallType } from "../../../JS/Constants";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from 'axios';
import * as RestApis from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import WijmoGridComposite from "../Common/WijmoGridComposite";
import { Button, DatePicker, Icon, Tooltip } from "@scuf/common";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

class NotificationLogComposite extends Component {

  constructor(props) {
    super(props)
    this.tmuiInstallType = this.props.userDetails.EntityResult.IsArchived ? TMUIInstallType.ARCHIVE : TMUIInstallType.LIVE
    this.state = {
      data: null,
      columns: null,
      fromDate: new Date(new Date().setHours(0, 0, 0, 0)),
      toDate: null,
      isReadyToRender: false,
      fromDateErrorMsg: '',
      toDateErrorMsg: false,
      maxDateTimeDiff: 180,
      recordCount: 99999,
      refreshInterval: 9000
    }
    this.componentName = "NotificationLog";
  }

  loadData = () => {
    try {
      if (this.checkDateDiff()) {
        let obj = {
          StartTime: this.state.fromDate,
          EndTime: this.state.toDate,
        };
        axios(
          RestApis.GetNotificationList,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          ))
          .then((response) => {
            this.setState({
              data: response.data.EntityResult.Table,
              isReadyToRender: true,
              columns: response.data.EntityResult.Column,
              recordCount: response.data.EntityResult.PageFields[0].NoOfRecords
            });
          })
          .catch((error) => {
            this.setState({ data: [], isReadyToRender: false });
            console.log(error);
          })
      }
      else {
        this.setState({ isReadyToRender: true, data: [] });
      }
    }
    catch (error) {
      this.setState({ isReadyToRender: true, data: [] });
      console.log(error);
    }
  }

  autoRefreshData = () => {
    if (this.state.toDate === null || this.state.toDate === '') {
      this.loadData();
    }
  }

  componentDidMount() {
    this.loadData();
    this.getLookupValues();

    if (this.tmuiInstallType !== TMUIInstallType.ARCHIVE) {
      // add auto refresh
      this.timeoutID = setInterval(this.autoRefreshData, this.state.refreshInterval);
    }

    // clear storage on page refresh
    window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }

  componentWillUnmount() {
    if (this.timeoutID) {
      this.timeoutID = clearInterval(this.timeoutID);
    }

    // clear session storage
    Utilities.clearSessionStorage(this.componentName + "GridState");

    // remove event listener
    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }

  dateChange = (type, date) => {
    let updatedDate = new Date(date);
    if (updatedDate.toString() === "Invalid Date") {
      updatedDate = null;
    }

    if (type === "toDate") {
      if (updatedDate == null && !this.timeoutID && this.tmuiInstallType !== TMUIInstallType.ARCHIVE) {
        // enable auto refresh
        this.timeoutID = setInterval(this.autoRefreshData, this.state.refreshInterval);
      }
      else if (updatedDate != null && this.timeoutID) {
        // remove auto refresh
        this.timeoutID = clearInterval(this.timeoutID);
      }
    }

    this.setState({ [type]: updatedDate });
  }

  checkDateDiff = () => {
    if (this.state.fromDate !== null) {
      if (this.state.toDate !== null && Utilities.validateDateRange(this.state.toDate, this.state.fromDate) === "Common_InvalidDateRange") {
        this.setState({ fromDateErrorMsg: "Greater than To Date", toDateErrorMsg: false });
        return false;
      }
      else if (this.state.toDate != null
        && ((Math.abs(this.state.fromDate - this.state.toDate) / 1000) / 60) > 2160) {
        this.setState({ fromDateErrorMsg: "", toDateErrorMsg: true })
        return false;
      }

      this.setState({ fromDateErrorMsg: "", toDateErrorMsg: false });
      return true;
    }

    this.setState({ fromDateErrorMsg: "From Date cannot be empty" })
    return false;
  }

  goClick = () => {
    // clear session storage
    sessionStorage.clear();

    this.setState({ isReadyToRender: false, data: [] })
    this.loadData();
  }

  getLookupValues = () => {
    try {
      axios(
        RestApis.GetLookUpData + "?LookUpTypeCode=Notification",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ maxDateTimeDiff: parseInt(result.EntityResult["MaxDateDiff"]) / 60, refreshInterval: parseInt(result.EntityResult["AutoRefreshInterval"]) },
            () => {
              if (this.timeoutID) {
                clearInterval(this.timeoutID)
                this.timeoutID = setInterval(this.autoRefreshData, this.state.refreshInterval);
              }
            })
        }
      })
        .catch((error) => {
          this.setState({ maxDateTimeDiff: 180 });
          console.log(
            "NotificationLogComposite:Error occured on getLookUpData",
            error
          );
        })
    } catch (error) {
      console.log(
        "NotificationLogComposite:Error occured on getLookUpData",
        error
      );
    }
  }

  statusCheck = (row) => {
    if (row["NotificationGroup_Status"] !== null && row["NotificationGroup_Status"].toLowerCase() === "failure") {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            breadcrumbItem={this.props.activeItem}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {(this.state.isReadyToRender && this.state.data !== null) ?
          (
            <ErrorBoundary>
              <TranslationConsumer>
                {(t) => (
                  <div>
                    <div className="row" style={{ "maxWidth": "770px" }}>
                      <div className="col-12 col-sm-12 col-md-5">
                        <DatePicker
                          type="datetime"
                          className="logDateTime"
                          value={this.state.fromDate}
                          disableFuture={true}
                          onChange={(date) => this.dateChange("fromDate", date)}
                          onTextChange={(date) => this.dateChange("fromDate", date)}
                          error={this.state.fromDateErrorMsg}
                          reserveSpace={false} />
                      </div>
                      <div className="col-1 mt-md-2 pl-lg-0" style={{ "textAlign": "center" }} >
                        -
                      </div>
                      <div className="col-12 col-sm-12 col-md-5 pl-md-1">
                        <DatePicker
                          type="datetime"
                          displayFormat={getCurrentDateFormat()}
                          className="logDateTime"
                          value={this.state.toDate}
                          disableFuture={true}
                          onChange={(date) => this.dateChange("toDate", date)}
                          onTextChange={(date) => this.dateChange("toDate", date)}
                          error={this.state.toDateErrorMsg ? t("NotificationRangeValidationMessage", [this.state.maxDateTimeDiff]) : null}
                          reserveSpace={false} />
                      </div>
                      <div className="col-12 col-sm-12 col-md-1 pl-0">
                        <Tooltip
                          content={t("NotificationGoHover", [this.state.recordCount])}
                          element={
                            <Button type="primary" className="doneButton" actionType="button" onClick={this.goClick}>
                              <Icon root="common" name="arrow-right" size="small" className="btnArrowRight" />
                            </Button>
                          }
                          event="hover"
                          hoverable={true}
                          position="right center"
                        />
                      </div>
                    </div>
                    <WijmoGridComposite
                      data={this.state.data}
                      columns={this.state.columns}
                      rowsPerPage={10}
                      exportRequired={true}
                      exportFileName="NotificationLogs.xlsx"
                      selectionRequired={false}
                      columnPickerRequired={true}
                      columnGroupingRequired={true}
                      conditionalRowStyleCheck={this.statusCheck}
                      conditionalRowStyles={{ color: "red" }}
                      parentComponent={this.componentName}
                    />
                  </div>
                )}
              </TranslationConsumer>
            </ErrorBoundary>
          ) :
          (<LoadingPage message="Loading"></LoadingPage>)
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(NotificationLogComposite);

NotificationLogComposite.propTypes = {
  activeItem: PropTypes.object,
};
