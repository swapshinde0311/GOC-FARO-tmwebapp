import React, { Component } from "react";
import PropTypes from 'prop-types'
import ErrorBoundary from "../../../ErrorBoundary";
import SingleValueChart from "../Charts/SingleValueChart";
import EntityDetailsChart from "../Charts/EntityDetails";
import WithDetails from "../Charts/Wrappers/WithDetails";
import { Button, Icon } from "@scuf/common";
import * as wijmoPdf from "@grapecity/wijmo.pdf";
import { toPng } from "html-to-image";
import LACSeriesChart from "../Charts/LACSeriesChart";
import DonutPieChart from "../Charts/DonutPieChart";
import { ChartType } from "../../../../JS/Constants";
import LACDynamicSeriesChart from "../Charts/LACDynamicSeriesChart";
import { ExportChart } from '../../../../JS/DashboardUtilities';
import BulletChart from "../Charts/BulletChart";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import GaugeChart from "../Charts/GaugeChart";
import DashboardGrid from "../../../UIBase/Common/DashboardGrid";
import StackedBullet from "../Charts/StackedBullet";
import BlockChart from "../Charts/BlockChart";

class KPIDashboardLayout extends Component {
  state = {
    modalOpen: false,
    parentKpiName: null,
    chartRefs: {},
    modalContent: null,
    exportLoading: false,
  };

  // fetch data and show modal
  clickHandler = (parentKpiName) => {
    try {
      if (this.props.fullScreenHandler)
        this.props.fullScreenHandler(true);

      this.setState({
        modalOpen: true,
        parentKpiName: parentKpiName,
      });
      this.props
        .fetchData(parentKpiName)
        .then((response) => {
          if (response.data.IsSuccess) {
            this.setState({
              modalContent: (
                <TranslationConsumer>
                  {(t) => (
                    <KPIDashboardFunc
                      kpiList={response.data.EntityResult.ListKPIDetails}
                      fetchData={this.props.fetchData}
                      isDetails={true}
                      isDraggable={true}
                      isResizable={true}
                      rowHeight={125}
                      widgetHeight={2}
                      pageName={parentKpiName + "Dashboard"}
                      // modal header
                      customControlObject={
                        <div className="pl-1">
                          <span style={{ fontSize: "1.125rem" }}>{t(parentKpiName)}</span>
                        </div>
                      }
                      exportRequired={true}
                    />
                  )
                  }
                </TranslationConsumer >
              ),
            });
          }
        })
        .catch((error) => {
          console.log("Error in child KPI data:", error);
        });
    } catch (error) {
      console.log(error, "Error in KPIDashboard clickHandler");
    }
  };

  // set chart object references
  setChartRefs = (kpiName, ref, sequence) => {
    this.setState((prevState) => ({
      ...prevState,
      chartRefs: {
        ...prevState.chartRefs,
        [kpiName]: {
          ...prevState.chartRefs[kpiName],
          ref: ref,
          sequence: sequence
        }
      },
    }));
  };

  getKPIChart = (kpiInfo) => {
    //debugger;
    if (kpiInfo.ChartType === ChartType.SingleValue) {
      return (
        <ErrorBoundary>
          <SingleValueChart kpiInfo={kpiInfo}></SingleValueChart>
        </ErrorBoundary>
      );
    } else if (kpiInfo.ChartType === ChartType.EntityDetails) {
      return (
        <ErrorBoundary>
          <EntityDetailsChart kpiInfo={kpiInfo}></EntityDetailsChart>
        </ErrorBoundary>
      );
    } else if (
      kpiInfo.ChartType === ChartType.FlexSeries ||
      kpiInfo.ChartType === ChartType.FlexPie ||
      kpiInfo.ChartType === ChartType.FlexDynamicSeries ||
      kpiInfo.ChartType === ChartType.Bullet ||
      kpiInfo.ChartType === ChartType.Gauge ||
      kpiInfo.ChartType === ChartType.StackedBullet ||
      kpiInfo.ChartType === ChartType.BlockChart
    ) {
      return (
        <ErrorBoundary>
          <WithDetails
            cardHeader={kpiInfo.KPIName}
            handleClick={() => this.clickHandler(kpiInfo.KPIName)}
            childCount={kpiInfo.ChildCount}
            exportHandler={(kpiName, format) =>
              ExportChart(this.state.chartRefs[kpiName].ref, format, kpiName)
            }
            modalOpen={
              kpiInfo.KPIName === this.state.parentKpiName
                ? this.state.modalOpen
                : false
            }
            handleModalClose={() => {
              this.setState({ modalOpen: false, parentKpiName: null });
              if (this.props.fullScreenHandler)
                this.props.fullScreenHandler(false);
            }}
            modalContent={this.state.modalContent}
            fullScreenHandler={this.props.fullScreenHandler}
            isExportRequired={this.props.isChartExport}
            isFullScreenRequired={this.props.isChartFullscreen}
          >
            {this.getChart(kpiInfo)}
          </WithDetails>
        </ErrorBoundary>
      );
    } else {
      return "Chart Type not supported";
    }
  };

  // return Column, Bar, Line, Area, Pie, Donut, Gauge charts
  getChart = (chartInfo) => {
    if (chartInfo.ChartType === ChartType.FlexSeries) {
      return (
        <LACSeriesChart
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs} />
      );
    } else if (chartInfo.ChartType === ChartType.FlexDynamicSeries) {
      return (
        <LACDynamicSeriesChart
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs}
        />
      );
    } else if (chartInfo.ChartType === ChartType.FlexPie) {
      return (
        <DonutPieChart
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs} />
      );
    } else if (
      chartInfo.ChartType === ChartType.Bullet
    ) {
      return (
        <BulletChart
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs}
        />
      )
    } else if (
      chartInfo.ChartType === ChartType.Gauge
    ) {
      return (
        <GaugeChart
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs} />
      )
    }
    else if (
      chartInfo.ChartType === ChartType.StackedBullet
    ) {
      return (
        <StackedBullet
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs} />
      )
    }
    else if (
      chartInfo.ChartType === ChartType.BlockChart
    ) {
      return (
        <BlockChart
          kpiInfo={chartInfo}
          setChartRefs={this.setChartRefs} />
      )
    }
  };

  exportAllCharts = () => {
    this.setState({ exportLoading: true }, () => {
      let doc = new wijmoPdf.PdfDocument({
        // method to execute on end
        ended: (s, e) => {
          if (e.blob) {
            this.setState({ exportLoading: false }, () => {
              if (this.props.exportCallback) {
                this.props.exportCallback();
              }
              wijmoPdf.saveBlob(e.blob, "Dashboard.pdf");
            })
          }
        },
        pageSettings: {
          margins: {
            left: 5,
            top: 5,
            right: 5,
            bottom: 5,
          },
          layout: wijmoPdf.PdfPageOrientation.Portrait,
        },
      });

      try {
        let colWidth = 300, rowHeight = 150, y = 0;

        // sort chartRef keys based on sequence 
        let kpiSequence = Object.keys(this.state.chartRefs).sort((a, b) => {
          return this.state.chartRefs[a].sequence - this.state.chartRefs[b].sequence
        })

        let promises = [];

        // generate image for each chart
        kpiSequence.forEach((key, index) => {
          // store promise returned by toPng in object
          promises.push(toPng(
            (this.state.chartRefs[key].ref.current ?
              this.state.chartRefs[key].ref.current :
              this.state.chartRefs[key].ref.hostElement),
            {
              cacheBust: true
            }));
        });

        // wait for all promises to resolve
        Promise.all(promises)
          .then((urls) => {
            // for each url draw the image in pdf
            urls.forEach((url, index) => {
              let x = 0
              // if index is odd, place the image on the right side of the page
              if (index % 2 === 1) {
                x = colWidth;
              }
              // draw cell borders
              doc.paths.rect(x, y, colWidth, rowHeight).stroke()
              // draw line below the widget header
              doc.paths.moveTo(x, y + 19).lineTo(x + colWidth, y + 19).stroke()

              // draw localized KPI Name text to identify the image
              doc.drawText(this.props.translation(kpiSequence[index]), x + 5, y + 5)
              // draw image
              doc.drawImage(url, x, y + 20, {
                width: colWidth,
                height: rowHeight - 20,
                align: wijmoPdf.PdfImageHorizontalAlign.Center
              });

              // if index is odd, increase the y position
              if (index % 2 === 1) {
                y += rowHeight;
                // if y position is greater than document height, add a new page
                if (y >= doc.height) {
                  y = 0;
                  doc.addPage();
                }
              }
            });

            // once all images are drawn, call end() method of document
            doc.end();
          })
          .catch((error) => {
            console.log("Error in converting HTML to Image: ", error);
            this.setState({ exportLoading: false })
            if (this.props.exportCallback) {
              this.props.exportCallback();
            }
          });
      } catch (error) {
        console.log("Error in exportAllCharts: ", error);
        this.setState({ exportLoading: false })
        if (this.props.exportCallback) {
          this.props.exportCallback();
        }
      }
    });
  };

  render() {
    //debugger;
    let kpiList = Array.isArray(this.props.kpiList) ? this.props.kpiList : []; //.filter((kpi) => kpi.resultData.IsSuccess);
    let wijmoCharts = Object.values(ChartType).filter(
      (val) => val !== ChartType.SingleValue && val !== ChartType.EntityDetails
    );
    return (
      <TranslationConsumer>
        {(t) =>
          <div>
            {
              this.props.exportRequired || this.props.customControlObject ?
                <div className="row">
                  {
                    this.props.customControlObject ?
                      <div className="col-12 col-lg-7 pb-1">
                        {this.props.customControlObject}
                      </div>
                      : null
                  }
                  <div className={this.props.customControlObject ? "col-12 col-lg-5 pb-1" : "col-12 offset-lg-5 col-lg-7 pr-4 pb-1"}>
                    <span style={{ float: "right" }}>
                      <Button
                        type="primary"
                        className="dashboardExport"
                        actionType="button"
                        disabled={this.state.exportLoading}
                        onClick={this.exportAllCharts}>
                        {t("WijmoGridExport")}
                        {
                          this.state.exportLoading ?
                            <span className="pl-1">
                              <Icon name="redo" size="small" loading={true} />
                            </span> :
                            null
                        }
                      </Button>
                    </span>
                  </div>
                </div>
                : null
            }
            <div className="row pr-3 pl-2 kpiSummaryBottomSpace">
              {
                kpiList.filter(kpi => kpi.ChartType === "EntityDetails").length > 0 ?
                  kpiList.map((kpiInfo, index) => {
                    return (
                      <div key={index}>
                        {this.getKPIChart(kpiInfo)}
                      </div>
                    );
                  })
                  :
                  <DashboardGrid
                    isDraggable={this.props.isDraggable}
                    isResizable={this.props.isResizable}
                    rowHeight={this.props.rowHeight}
                    widgetHeight={
                      kpiList.length === 1 && this.props.isDetails
                        ? Number(window.screen.height / 240) < 1 ? 1 : Number(window.screen.height / 240)
                        : this.props.widgetHeight
                    }
                    pageName={this.props.pageName}
                    cols={kpiList.length === 1 && this.props.isDetails ? { lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 } : undefined}
                  >
                    {kpiList.map((kpiInfo, index) => {
                      let json = JSON.parse(kpiInfo.JSONFormat);
                      return (
                        <div
                          dimensions={json.Chart ? json.Chart.dimensions : null}
                          key={index}
                          style={{ height: "100%" }}
                          className={
                            !wijmoCharts.includes(kpiInfo.ChartType) ? "background ml-md-1 mt-1 mt-md-0" : ""
                          }
                        >
                          {this.getKPIChart(kpiInfo)}
                        </div>
                      )
                    }
                    )}
                  </DashboardGrid>
              }
            </div>
          </div>
        }
      </TranslationConsumer>
    );
  }
}

KPIDashboardLayout.propTypes = {
  kpiList: PropTypes.array.isRequired,
  fetchData: PropTypes.func,
  exportRequired: PropTypes.bool,
  fullScreenHandler: PropTypes.func,
  isDraggable: PropTypes.bool,
  isResizable: PropTypes.bool,
  rowHeight: PropTypes.number,
  widgetHeight: PropTypes.number,
  pageName: PropTypes.string.isRequired,
  isDetails: PropTypes.bool,
  isChartExport: PropTypes.bool,
  isChartFullscreen: PropTypes.bool
}

KPIDashboardLayout.defaultProps = {
  exportRequired: false,
  isDraggable: false,
  isResizable: false,
  rowHeight: 90,
  widgetHeight: 1,
  isDetails: false,
  isChartExport: true,
  isChartFullscreen: true
}

const KPIDashboardFunc = React.forwardRef((props, ref) => {
  const [t] = useTranslation();
  return <KPIDashboardLayout ref={ref} {...props} translation={t} />
});

export default KPIDashboardFunc;
