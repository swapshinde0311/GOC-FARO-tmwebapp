import React, { Component } from "react";
import { MapContainer, GeoJSON, Popup, Marker } from "react-leaflet";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import ErrorBoundary from "../../ErrorBoundary";
import L from "leaflet";
import { connect } from "react-redux";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import Carousel from "../../UIBase/Common/Carousel";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { KpiHomePage } from "../../../JS/KPIPageName";
import DonutPieChart from "../Common/Charts/DonutPieChart";
import WithDetails from "../Common/Charts/Wrappers/WithDetails";
import { ChartType } from "../../../JS/Constants";
import LACSeriesChart from "../Common/Charts/LACSeriesChart";
import LACDynamicSeriesChart from "../Common/Charts/LACDynamicSeriesChart";
import { ExportChart } from "../../../JS/DashboardUtilities";

const mapOptions = window["runConfig"].mapOptions;

// const mapMarker = new L.icon({
//   iconUrl: markerIcon,
//   iconSize: 20,
//   className: "blinking",
// });
// const mapMarker = L.divIcon({
//   className: "icon-Transactions blinking mapIcon",
// });

class ENDashboardSummaryComposite extends Component {
  state = {
    mapData: null,
    carouselChartData: [],
    chartRefs: {},
    modalOpen: false,
    parentKpiName: null,
  };

  componentDidMount() {
    try {
      this.getMapData();
      // fetch carousel details only for Enterprise
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getCarouselChartData();
        this.autoRefreshTimer();
      }
    } catch (error) {
      console.log(
        "ENDashboardSummary:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillUnmount = () => {
    if (this.timer) {
      this.timer = clearInterval(this.timer);
    }
  };

  autoRefreshTimer = () => {
    let refreshInterval = 5;
    if (
      mapOptions.refreshMinutes !== undefined &&
      mapOptions.refreshMinutes > 0
    ) {
      refreshInterval = mapOptions.refreshMinutes;
    }

    this.timer = setInterval(() => {
      this.getCarouselChartData();
    }, refreshInterval * 60 * 1000);
  };

  getMapData = () => {
    axios("map.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        let mapData = response.data;
        // console.log(mapData);
        this.setState({ mapData });
      })
      .catch((error) => {
        console.log("Error while getting Map data:", error);
      });
  };
  getTPIColorCode(categories, indexColumn, tpiIndex) {
    let colorCode = "";
    try {
      if (Array.isArray(categories)) {
        for (const category of categories) {
          if (tpiIndex >= category[indexColumn]) {
            colorCode = category.color;
            break;
          }
        }
      }
    } catch (error) {
      console.log("DashboardSummary-GetColor-Error:", error);
    }
    return colorCode;
  }
  getTerminalPopupDetails(terminal) {
    let terminalTPIList = this.props.tpiList.filter(
      (terminalTPI) => terminalTPI.Key === terminal.TerminalCode
    );
    let tpiIndex = null;
    let motTPIIndex = [];
    if (terminalTPIList.length > 0) {
      tpiIndex = terminalTPIList[0].Value.TerminalTPIIndex;
      if (Array.isArray(terminalTPIList[0].Value.MoTTPIIndex)) {
        terminalTPIList[0].Value.MoTTPIIndex.forEach((mot) => {
          motTPIIndex.push(mot);
        });
      }
    }
    let terminalConfig = JSON.parse(terminal.TerminalConfig);
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div style={{ width: "100%" }}>
              <div>
                <div className="row">
                  <div className="col-12 col-md-12 col-lg-12">
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {terminal.TerminalCode + " " + t("tpi_Overview")}
                    </span>
                  </div>
                </div>
                {tpiIndex !== null ? (
                  <div className="row">
                    <div className="col-8 col-md-8 col-lg-8">
                      <span style={{ fontSize: "16px" }}>
                        {t("tpi_Terminal_Index")}
                      </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4">
                      <span
                        style={{
                          //color: "white",
                          fontSize: "18px",

                          color: this.getTPIColorCode(
                            terminalConfig.TPIConfig["Terminal"],
                            "tpiIndex",
                            tpiIndex
                          ),
                          // border:
                          //   "1px solid " +
                          //   this.getTPIColorCode(
                          //     terminalConfig.TPIConfig["Terminal"],
                          //     "tpiIndex",
                          //     tpiIndex
                          //   ),
                          // borderRadius: "5px",
                        }}
                      >
                        {tpiIndex}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {motTPIIndex.map((mot) => (
                  <div className="row">
                    <div className="col-8 col-md-8 col-lg-8">
                      <span style={{ fontSize: "16px" }}>
                        {t("tpi_" + mot.Key + "_Index")}{" "}
                      </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4">
                      <span
                        style={{
                          fontSize: "18px",
                          // color: "white",
                          color: this.getTPIColorCode(
                            terminalConfig.TPIConfig[mot.Key],
                            "tpiIndex",
                            mot.Value
                          ),
                          // border:
                          //   "1px solid " +
                          //   this.getTPIColorCode(
                          //     terminalConfig.TPIConfig[mot.Key],
                          //     "tpiIndex",
                          //     mot.Value
                          //   ),
                          // borderRadius: "5px",
                        }}
                      >
                        {mot.Value}
                      </span>
                    </div>
                  </div>
                ))}
                {terminal.IsAlive ||
                !this.props.userDetails.EntityResult.IsEnterpriseNode ? (
                  ""
                ) : (
                  <div className="row">
                    <div className="col-6 col-md-6 col-lg-6">
                      <span style={{ fontSize: "16px" }}>
                        {t("tpi_LastAliveTime")}
                      </span>
                    </div>
                    <div className="col-6 col-md-6 col-lg-6">
                      <span style={{ fontSize: "13px" }}>
                        {new Date(terminal.LastAliveTime).toLocaleDateString() +
                          " " +
                          new Date(terminal.LastAliveTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
                <div className="row">
                  {motTPIIndex.length > 0 ? (
                    <div className="col-6 col-md-6 col-lg-6 mapButtondiv">
                      <Button
                        className="mapButton"
                        content={t("AccessCardInfo_Details")}
                        onClick={() => this.props.onDetailsClick(terminal, 2)}
                      ></Button>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="col-6 col-md-6 col-lg-6 mapButtondiv">
                    <Button
                      className="mapButton"
                      content={t("tpi_Dashboard")}
                      onClick={() => this.props.onDashboardClick(terminal, 3)}
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    );
  }
  getTerminalMarker(terminal) {
    return (
      <ErrorBoundary>
        <Marker
          position={[terminal.Latitude, terminal.Longitude]}
          icon={L.divIcon({
            className: this.props.userDetails.EntityResult.IsEnterpriseNode
              ? terminal.IsAlive
                ? "icon-Location-pin blinking  mapAliveIcon"
                : "icon-Location-pin mapDeadIcon"
              : "icon-Location-pin mapAliveIcon",
          })}
          //icon={mapMarker}
          // pathOptions={{
          //   color: terminal.IsAlive ? "green" : "red",
          //   fillColor: terminal.IsAlive ? "green" : "red",
          //   fillOpacity: "1",
          //   weight: 2,
          //   className: "blinking",
          // }}
          // center={[terminal.Longitude, terminal.Latitude]}
          // radius={10}
        >
          <Popup>
            {this.getTerminalPopupDetails(terminal)}
            {/* <h1>{terminal.TerminalCode}</h1> */}
          </Popup>
        </Marker>
      </ErrorBoundary>
    );
  }

  getCarouselChartData = () => {
    try {
      axios(
        RestAPIs.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          {
            PageName: KpiHomePage,
            InputParameters: [],
            TransportationType: "All",
          },
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;

          if (result.IsSuccess) {
            this.setState({
              carouselChartData: result.EntityResult.ListKPIDetails,
            });
          } else {
            console.log("Error in carousel KPIList", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("Error in carousel chart data:", error);
    }
  };

  getGenericChart = (chartInfo) => {
    if (
      chartInfo.ChartType === ChartType.FlexSeries ||
      chartInfo.ChartType === ChartType.FlexPie ||
      chartInfo.ChartType === ChartType.FlexDynamicSeries
    ) {
      return (
        <ErrorBoundary>
          <WithDetails
            cardHeader={chartInfo.KPIName}
            childCount={chartInfo.ChildCount}
            exportHandler={(kpiName, format) =>
              ExportChart(this.state.chartRefs[kpiName], format, kpiName)
            }
            handleClick={() => this.cardClick(chartInfo.KPIName, null)}
            modalOpen={
              chartInfo.KPIName === this.state.parentKpiName
                ? this.state.modalOpen
                : false
            }
            handleModalClose={() => {
              this.setState({
                modalOpen: false,
                parentKpiName: null,
                modalContent: null,
              });
              // restart auto-refresh
              if (!this.timer) {
                this.autoRefreshTimer();
              }
            }}
            modalContent={this.state.modalContent}
            fullScreenHandler={this.fullScreenView}
          >
            {this.getChart(chartInfo)}
          </WithDetails>
        </ErrorBoundary>
      );
    } else {
      return "Chart Type not supported";
    }
  };

  // abort auto-refresh when in full screen mode
  fullScreenView = (fullScreenState) => {
    if (fullScreenState) {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
    } else {
      if (!this.timer) this.autoRefreshTimer();
    }
  };

  // return Column, Bar, Line, Area, Pie, Donut charts
  getChart = (chartInfo) => {
    if (chartInfo.ChartType === ChartType.FlexSeries) {
      return (
        <LACSeriesChart kpiInfo={chartInfo} setChartRefs={this.setChartRefs} />
      );
    }
    if (chartInfo.ChartType === ChartType.FlexDynamicSeries) {
      return (
        <LACDynamicSeriesChart
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs}
        />
      );
    } else if (chartInfo.ChartType === ChartType.FlexPie) {
      return (
        <DonutPieChart kpiInfo={chartInfo} setChartRefs={this.setChartRefs} />
      );
    }
  };

  // set chart refs for export functionality
  setChartRefs = (kpiName, ref) => {
    this.setState((prevState) => ({
      ...prevState,
      chartRefs: { ...prevState.chartRefs, [kpiName]: ref },
    }));
  };

  // handle card more details click
  cardClick = async (parentKpiName) => {
    if (this.timer) {
      this.timer = clearInterval(this.timer);
    }
    this.setState({ modalOpen: true, parentKpiName: parentKpiName });

    try {
      // axios(
      //   RestAPIs.GetKPI,
      //   Utilities.getAuthenticationObjectforPost(
      //     {
      //       PageName: KpiHomePage,
      //       InputParameters: [
      //         {
      //           key: "FromDate",
      //           value: new Date(
      //             new Date().setDate(new Date().getDate() - 1)
      //           ).toJSON(),
      //         },
      //         {
      //           key: "ToDate",
      //           value: new Date().toJSON(),
      //         },
      //       ],
      //       TransportationType: "All",
      //       ParentKPIName: parentKpiName,
      //     },
      //     null
      //   )
      // )
      this.getChildKpiData(parentKpiName)
        .then((response) => {
          let result = response.data;

          if (result.IsSuccess) {
            this.setState({
              modalContent: (
                <TranslationConsumer>
                  {(t) => (
                    <KPIDashboardLayout
                      kpiList={result.EntityResult.ListKPIDetails}
                      fetchData={this.getChildKpiData}
                      isDetails={true}
                      isDraggable={true}
                      isResizable={true}
                      rowHeight={125}
                      widgetHeight={2}
                      pageName={parentKpiName + "Map"}
                      customControlObject={
                        <span className="pl-1" style={{ fontSize: "1.125rem" }}>
                          {t(parentKpiName)}
                        </span>
                      }
                      exportRequired={true}
                    />
                  )}
                </TranslationConsumer>
              ),
            });
          } else {
            console.log("Error in carousel KPIList", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("Error in carousel chart data:", error);
    }
  };

  // fetch data for child KPIs
  getChildKpiData = (parentKPIName) => {
    return axios(
      RestAPIs.GetKPI,
      Utilities.getAuthenticationObjectforPost(
        {
          PageName: KpiHomePage,
          InputParameters: [],
          TransportationType: "All",
          ParentKPIName: parentKPIName,
        },
        this.props.tokenDetails.tokenInfo
      )
    );
  };

  render() {
    if (this.state.mapData !== null) {
      return (
        <div style={{ height: "90vh", position: "relative" }}>
          <ErrorBoundary>
            <MapContainer
              style={{ height: "100%" }}
              //zoom={2}
              zoom={mapOptions.zoom}
              center={mapOptions.center}
              //center={[64.69734, -6.71326]}
            >
              <GeoJSON
                style={{
                  //fillColor: "#cccccc",
                  opacity: "1",
                  //color: "#9e9e9e",
                  weight: 1,
                }}
                className="mapCountry"
                // style={{ className: "CountryStyle" }}
                data={this.state.mapData.features}
              ></GeoJSON>
              {this.props.terminals.map((terminal) =>
                this.getTerminalMarker(terminal)
              )}
            </MapContainer>
            <ErrorBoundary>
              {this.state.carouselChartData &&
              this.props.userDetails.EntityResult.IsEnterpriseNode &&
              this.state.carouselChartData.length > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    zIndex: 400,
                    width: "100%",
                  }}
                >
                  <div className="row">
                    <div className="col-12">
                      <Carousel
                        items={this.state.carouselChartData}
                        slideWidth={100}
                        visibleSlides={{ tablet: 2, laptop: 3, desktop: 4 }}
                        renderItem={this.getGenericChart}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </ErrorBoundary>
          </ErrorBoundary>
        </div>
      );
    } else {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    }
  }
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};
export default connect(mapStateToProps)(ENDashboardSummaryComposite);
ENDashboardSummaryComposite.propTypes = {
  terminals: PropTypes.array.isRequired,
  tpiList: PropTypes.array.isRequired,
  onDetailsClick: PropTypes.func.isRequired,
  onDashboardClick: PropTypes.func.isRequired,
};
