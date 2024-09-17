import React, { Component } from "react";
import { Button, DatePicker, Icon } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { connect } from "react-redux";
import * as Constants from "../../../JS/Constants";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import "@grapecity/wijmo.styles/wijmo.css";
import { kpiTerminalDashboards } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import PropTypes from "prop-types";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

class ENDashboardOverviewComposite extends Component {
  state = {
    selectedMOT: this.props.selectedMOT,
    kpis: {}, //{ROAD:[],RAIL:[],MARINE}:[],PIPELINE:[]}
    //dashboards: [], //[{mot:"",tankInventory:null,fpLoadThroughPut:null,fpUnloadThroughput:null}]
    chartRefs: {},
    modalOpen: false,
    parentKpiName: null,
    rangeValue: {
      to: new Date(new Date().setHours(23, 59, 59, 0)),
      from: new Date(new Date().setHours(0, 0, 0, 0))
    },
    ErrorMsg: null,
    isRefreshing: false,
    refreshInterval: 15000,
    exportLoading: false
  };

  dashboardRef = React.createRef();

  componentDidMount() {
    try {
      let selectedMOT = "";
      if (
        this.state.selectedMOT !== undefined &&
        this.state.selectedMOT !== null
      ) {
        selectedMOT = this.state.selectedMOT;
      } else {
        if (
          Array.isArray(
            this.props.userDetails.EntityResult.TransportationTypes
          ) &&
          this.props.userDetails.EntityResult.TransportationTypes.length > 0
        ) {
          selectedMOT =
            this.props.userDetails.EntityResult.TransportationTypes[0];
          this.setState({ selectedMOT: selectedMOT });
        }
        if (selectedMOT !== undefined && selectedMOT !== null) {
          // this.getDashboards(selectedMOT);
          this.getKPIs(selectedMOT);
        }

        // get lookup value for auto refresh interval
        axios(
          RestAPIs.GetLookUpData + "?LookUpTypeCode=TerminalsDashboard",
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true &&
            Number.isInteger(parseInt(result.EntityResult.RefreshInterval))) {
            this.setState({ refreshInterval: Number(result.EntityResult.RefreshInterval) }, () => {
              // initiate auto refresh with interval from lookup
              this.autoRefreshData();
            });
          }
          else {
            console.log("Error in fetching LookupValue");
            // initiate auto refresh with default interval
            this.autoRefreshData();
          }
        }).catch(error => {
          // initiate auto refresh with default interval
          this.autoRefreshData();
          console.log("Error in fetching LookupValue: ", error);
        });
      }
    } catch (error) {
      console.log(
        "EnDashboardOverviewComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }

  componentWillUnmount = () => {
    // clear auto refresh on unmount
    if (this.interval) {
      this.interval = clearInterval(this.interval);
    }
  }

  // refresh dashboard data
  autoRefreshData() {
    this.interval = setInterval(() => {
      let error = Utilities.validateDateRange(
        this.state.rangeValue.to,
        this.state.rangeValue.from
      )

      if (error !== "") {
        this.setState({ ErrorMsg: error });
      }
      else {
        this.setState({ isRefreshing: true, ErrorMsg: null }, () => {
          this.getKPIs(this.state.selectedMOT);
        });
      }
    }, this.state.refreshInterval);
  }

  getKPIs(mot) {
    if (this.state.kpis[mot] === undefined || this.state.isRefreshing) {
      let kpis = lodash.cloneDeep(this.state.kpis);

      var notification = {
        message: "",
        messageType: "critical",
        messageResultDetails: [], //{keyFields: ["DriverInfo_Code"],
        //keyValues: [this.state.modDriver.Code],
        //isSuccess: false,
        //errorMessage: "",}
      };
      let objKPIRequestData = {
        PageName: kpiTerminalDashboards,
        TransportationType: mot,
        InputParameters: [
          {
            key: "TerminalCode",
            value: this.props.selectedTerminal.TerminalCode,
          },
          {
            key: "FromDate",
            value: this.state.rangeValue.from.toJSON()
          },
          {
            key: "ToDate",
            value: this.state.rangeValue.to.toJSON()
          }
        ],
      };
      axios(
        RestAPIs.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          // console.log(result);
          if (result.IsSuccess === true) {
            kpis[mot] = result.EntityResult.ListKPIDetails;
            this.setState({ kpis, isRefreshing: false });
          } else {
            // this.setState({ kpiList: [] });
            console.log("Error in Dashboard KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Dashboard KPIList:", error);
        });
    }
  }

  handleMOTChange = (mot) => {
    if (mot !== this.state.selectedMOT) {
      this.setState({ selectedMOT: mot });
      // this.getDashboards(mot);
      this.getKPIs(mot);
    }
  };
  BindTransportationTypes() {
    let MotDivs = [];
    //debugger;
    if (
      Array.isArray(this.props.userDetails.EntityResult.TransportationTypes)
    ) {
      let tranpsortationTypes = this.props.userDetails.EntityResult.RoleName.toLowerCase() === "carriercompany" ?
        // remove pipeline mot for carriercompany role
        this.props.userDetails.EntityResult.TransportationTypes.filter(mot => mot.toLowerCase() !== "pipeline") :
        [...this.props.userDetails.EntityResult.TransportationTypes]

      tranpsortationTypes.forEach((mot) => {
        let motIconClass = mot.toLowerCase();
        motIconClass =
          "icon-" +
          motIconClass.charAt(0).toUpperCase() +
          motIconClass.slice(1);
        MotDivs.push(
          <TranslationConsumer>
            {(t) => (
              // <div className="col-3 col-sm-1 col-md-2 col-lg-1 col-xl-1">
              <div
                onClick={() => this.handleMOTChange(mot)}
                className="dashboardTab"
              // className={
              //   this.state.selectedMOT === mot
              //     ? "dashboardTab active"
              //     : "dashboardTab"
              // }
              >
                <div
                  className={
                    this.state.selectedMOT === mot
                      ? "flexWrap active"
                      : "flexWrap"
                  }
                >
                  <span
                    className={motIconClass}
                    style={{
                      padding: "0",
                      paddingTop: "0.4rem",
                      paddingBottom: "0.25rem",
                      fontSize: "24px",
                    }}
                  ></span>
                  <a className="item">{t(mot)}</a>
                </div>
              </div>
            )}
          </TranslationConsumer>
        );
      });
    }
    return MotDivs;
  }

  //function to fetch data for KPIs
  getChildKpiData = (parentKPIName) => {
    return axios(
      RestAPIs.GetKPI,
      Utilities.getAuthenticationObjectforPost(
        {
          PageName: kpiTerminalDashboards,
          InputParameters: [
            {
              key: "TerminalCode",
              value: this.props.selectedTerminal.TerminalCode,
            },
            {
              key: "FromDate",
              value: this.state.rangeValue.from.toJSON()
            },
            {
              key: "ToDate",
              value: this.state.rangeValue.to.toJSON()
            }
          ],
          TransportationType: this.state.selectedMOT,
          ParentKPIName: parentKPIName,
        },
        this.props.tokenDetails.tokenInfo
      )
    );
  }

  // load widget charts for selected date range
  loadWidgets = () => {
    let error = Utilities.validateDateRange(
      this.state.rangeValue.to,
      this.state.rangeValue.from
    )
    if (error !== "") {
      this.setState({ ErrorMsg: error });
    }
    else {
      // clear data for selected MOT
      this.setState((prevState) => ({
        kpis: { ...prevState.kpis, [this.state.selectedMOT]: undefined },
        ErrorMsg: null
      }), () => {
        this.getKPIs(this.state.selectedMOT);
      });
    }
  }

  // validate text change in date component
  handleDateTextChange = (value, error) => {
    if (value === "")
      this.setState({ ErrorMsg: "", rangeValue: { ...this.state.rangeValue, to: "", from: "" } });
    if (error !== null && error !== "")
      this.setState({
        ErrorMsg: "Common_InvalidDate",
        rangeValue: { ...this.state.rangeValue, to: "", from: "" },
      });
    else {
      this.setState({
        dateError: "",
        rangeValue: { ...this.state.rangeValue, to: "", from: "" },
      });
    }
  }

  getDateControl = () => {
    return (
      <TranslationConsumer>
        {(t) =>
          <div className={"col-sm-12 " + (this.state.exportLoading ? "col-lg-8" : "col-lg-9") + " pl-1 pb-0"} style={{ "display": "flex" }}>
            <DatePicker
              type="daterange"
              className="dashboardDatePicker ml-sm-auto ml-lg-0"
              displayFormat={getCurrentDateFormat()}
              rangeValue={this.state.rangeValue}
              disableFuture={true}
              closeOnSelection={true}
              onTextChange={this.handleDateTextChange}
              onRangeSelect={(({ to, from }) => this.dateChange(to, from))}
              error={t(this.state.ErrorMsg)}
              reserveSpace={false}
            />
            <Button
              type="primary"
              actionType="button"
              onClick={this.loadWidgets}
              className="doneButton ml-2"
              disabled={this.state.exportLoading}>
              <Icon root="common" name="arrow-right" size="small" className="btnArrowRight" />
            </Button>
          </div>
        }
      </TranslationConsumer>
    );
  }

  // handle date change from date picker
  dateChange = (to, from) => {
    let toDate = new Date(to);
    let fromDate = new Date(from);
    if (toDate.toString() === "Invalid Date") {
      toDate = null;
    }
    else {
      // set end of the day time for toDate
      toDate.setHours(23, 59, 59, 0);

      // enable auto refresh if selected date is current date
      if (toDate.toDateString() === new Date().toDateString()) {
        if (!this.interval) {
          this.autoRefreshData();
        }
      }
      else if (this.interval) {
        // clear interval if to date is not current date 
        this.interval = clearInterval(this.interval);
      }
    }

    if (fromDate.toString() === "Invalid Date") {
      fromDate = null;
    }

    this.setState({ rangeValue: { to: toDate, from: fromDate } });
  }

  // abort auto-refresh when in full screen mode
  fullScreenView = (fullScreenState) => {
    if (fullScreenState) {
      if (this.interval) {
        this.interval = clearInterval(this.interval);
      }
    }
    else {
      if (!this.interval)
        this.autoRefreshData();
    }
  }

  render() {
    // console.log(this.props.userDetails);
    let userDetails = this.props.userDetails.EntityResult;

    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div style={{ marginTop: "10px" }}>
              <ErrorBoundary>
                <div className="ui breadcrumb pl-1" style={{ alignItems: "start" }}>
                  <div
                    className="section mt-sm-2 mt-lg-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.props.onBackClick(1)}
                  >
                    <Icon
                      root="common"
                      name="caret-left"
                      className="caretLeft"
                    //color="black"
                    ></Icon>
                  </div>
                  <div className="section pl-1 mt-sm-2 mt-lg-0" style={{ width: "50%" }}>
                    <span>
                      {t("tpi_Dashboard") +
                        " - " +
                        this.props.selectedTerminal.TerminalCode}
                    </span>
                  </div>
                  <div className="pr-3" style={{ marginLeft: "auto" }}>
                    <div className="row">
                      {this.getDateControl()}
                      <div
                        className={"col-sm-12 " + (!this.state.exportLoading ? "col-lg-3" : "col-lg-4") + " pl-3 pb-0 pt-sm-3 pt-lg-0"}
                        style={{ textAlign: "right" }}>
                        <Button
                          type="primary"
                          disabled={this.state.exportLoading}
                          className="dashboardExport"
                          onClick={() => {
                            // check if KPIDashboard reference is available
                            if (this.dashboardRef.current) {
                              this.setState({ exportLoading: true }, () => {
                                // call method in KPIDashboardLayout
                                this.dashboardRef.current.exportAllCharts();
                              });
                            }
                          }}
                          actionType="button">
                          {t("WijmoGridExport")}
                          {
                            this.state.exportLoading ?
                              <span className="pl-1">
                                <Icon name="redo" size="small" loading={true} />
                              </span> :
                              null
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard detailsContainer" style={{ paddingTop: "0px" }}>
                  <div
                    className=" ui pointing secondary ui scuf-tab menu "
                    style={{ minHeight: "0px", marginBottom: "20px" }}
                  >
                    {this.BindTransportationTypes()}
                    <div className="mt-2 pr-3" style={{ marginLeft: "auto", fontSize: "14px" }}>
                      {t("LastUpdatedTime")}: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
              <ErrorBoundary>
                {
                  this.state.kpis[this.state.selectedMOT] ?
                    <KPIDashboardLayout
                      ref={this.dashboardRef}
                      kpiList={this.state.kpis[this.state.selectedMOT]}
                      fetchData={this.getChildKpiData}
                      fullScreenHandler={this.fullScreenView}
                      isDraggable={true}
                      isResizable={true}
                      rowHeight={125}
                      widgetHeight={2}
                      exportCallback={() => this.setState({ exportLoading: false })}
                      pageName="Dashboard"
                    />
                    : <LoadingPage loadingClass="nestedList" message=""></LoadingPage>
                }
              </ErrorBoundary>
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(ENDashboardOverviewComposite);
ENDashboardOverviewComposite.propTypes = {
  selectedTerminal: PropTypes.object.isRequired,
  onBackClick: PropTypes.func.isRequired,
};
