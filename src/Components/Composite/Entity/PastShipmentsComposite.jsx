import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as Constants from "../../../JS/Constants";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { PastShipmentsDetail } from "../../UIBase/Details/PastShipmentsDetail";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import dayjs from "dayjs";
import { Icon } from '@scuf/common';
import { TranslationConsumer } from "@scuf/localization";
class PastShipmentsComposite extends Component {
  state = {

    data: [],
    searchList: [],
    searchText: "",
    viewBOLCode: "",
    viewBOLShareholder: "",
    showReport: false,
    selectedDate: dayjs()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0),
  };

  componentDidMount() {
    try {
      this.getPastShipmentsListForRole();

    } catch (error) {
      console.log(
        "PastShipmentsComposite:Error occured on ComponentDidMount",
        error
      );
    }

  }
  componentWillUnmount = () => {

  }

  getPastShipmentsListForRole = () => {
    try {
      axios(
        RestAPIs.GetPastShipmentListForRole,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {

          let data = response.data;
          if (data.IsSuccess === true) {
            this.setState({ data: data.EntityResult.Table }, () => { this.onSearchChange(""); });
          }

          //this.setState({ menu: json.menu},()=>this.updateMenu)
        })
        .catch((error) => {
          console.log("Error in getPastShipmentsListForRole API:", error);
        });
    } catch (error) {
      console.log(
        "PastShipmentsComposite:Error occured on getPastShipmentsListForRole",
        error
      );
    }
  }

  onSearchChange = (data) => {
    try {
      let dataset = this.state.data;
      let selectedDate = this.state.selectedDate.format("DD MMM YYYY");
      let results = [];
      if (data === "") {

        results = dataset.filter(element => {
          return dayjs(element.LoadedDate).format("DD MMM YYYY") === selectedDate;
        });

      } else {

        results = dataset.filter(element => {
          return dayjs(element.LoadedDate).format("DD MMM YYYY") === selectedDate && element.Code.toLowerCase().includes(data.toLowerCase());
        });
      }
      this.setState({ searchList: results, searchText: data });
    } catch (error) {
      console.log(
        "PastShipmentsComposite:Error occured on onSearchChange",
        error
      );
    }
  }

  handleDateChange = (duration) => {
    try {
      let selectedDate = this.state.selectedDate;
      selectedDate = selectedDate.add(duration, "day");
      this.setState({
        selectedDate
      }, () => { this.onSearchChange(this.state.searchText); });

    } catch (error) {
      console.log("error in handleDateChanage", error);
    }
  }

  handleViewBOL = (Code, ShareHolder) => {
    //this.handleAuthenticationClose();
    this.setState({ viewBOLCode: Code, viewBOLShareholder: ShareHolder });
    if (this.reportServiceURI === undefined) {
      axios(
        RestAPIs.GetReportServiceURI,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        if (response.data.IsSuccess) {
          this.reportServiceURI = response.data.EntityResult;
          this.setState({ showReport: true });
        }
      });
    } else {
      this.setState({ showReport: true });
    }
  };

  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/TMBOL";
    } else {
      path = "TM/" + Constants.TMReports + "/TMBOL";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      Shareholder: this.state.viewBOLShareholder,
      ShipmentCode: this.state.viewBOLCode,
    };

    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleModalBack}
        handleModalClose={this.handleModalBack}
        // proxyServerHost="http://epksr5115dit:3625/TMWebAPI/"
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }
  render() {

    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              <div className="ui breadcrumb pl-1 mobile-bread-crumb mobile-align-items-start">
                <div className="section pl-1 mt-sm-2 mt-lg-0">
                  <span>
                    {t("PastShipments")}
                  </span>
                </div>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <PastShipmentsDetail data={this.state.searchList}
                selectedDate={this.state.selectedDate}
                onSearchChange={this.onSearchChange}
                handleDateChange={this.handleDateChange}
                handleViewBOL={this.handleViewBOL}>
              </PastShipmentsDetail>
              {Object.keys(this.state.searchList).length > 0
                ? this.renderModal()
                : ""}
            </ErrorBoundary>
          </div >
        )}
      </TranslationConsumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(PastShipmentsComposite);

PastShipmentsComposite.propTypes = {
  activeItem: PropTypes.object,
};
