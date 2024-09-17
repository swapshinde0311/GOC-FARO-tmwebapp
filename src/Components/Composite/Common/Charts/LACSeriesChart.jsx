import React from "react";
import PropTypes from "prop-types";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjChartInteraction from "@grapecity/wijmo.react.chart.interaction";
import * as wjChartAnimate from "@grapecity/wijmo.react.chart.animation";
import * as wjChartAnalytics from '@grapecity/wijmo.react.chart.analytics';
import ErrorBoundary from "../../../ErrorBoundary";
import { TranslationConsumer } from "@scuf/localization";
import { ThemeType } from "@scuf/common";
import { connect } from 'react-redux'

const LACSeriesChart = (props) => {
  const flexRef = React.useRef();
  const jsonData = JSON.parse(props.kpiInfo.JSONFormat);
  const initGestures = (gestures) => {
    gestures.posX = jsonData.Chart.ChartDetails.initialPosition
      ? jsonData.Chart.ChartDetails.initialPosition.xPosition
      : 0;
    gestures.posY = jsonData.Chart.ChartDetails.initialPosition
      ? jsonData.Chart.ChartDetails.initialPosition.yPosition
      : 0;
    gestures.scaleX = jsonData.Chart.ChartDetails.initialPosition
      ? jsonData.Chart.ChartDetails.initialPosition.xScale
      : 0;
    gestures.scaleY = jsonData.Chart.ChartDetails.initialPosition
      ? jsonData.Chart.ChartDetails.initialPosition.yScale
      : 0;
  };

  // reset major unit for Y-axis
  React.useEffect(() => {
    if (flexRef) {
      setMajorUnitY();
    }
  }, [props.kpiInfo.KPIData]);

  // get palette based on the selected theme
  const getPalletes = (theme) => {
    try {
      const chartPalette = jsonData.Chart.ChartDetails.common.palette;
      if (chartPalette) {
        // if palette in JSON does not have separate colours for 'dark' & 'light' theme
        if (Array.isArray(chartPalette)) {
          return jsonData.Chart.ChartDetails.common.palette;
        }
        else {
          // select palette based on theme
          if (theme === ThemeType.Dark && chartPalette.dark) {
            return chartPalette.dark;
          }
          else {
            return chartPalette.default;
          }
        }
      }
      else if (
        jsonData.Chart.ChartDetails.bindings.colorsSource &&
        jsonData.Chart.ChartDetails.bindings.colorsSource.table &&
        jsonData.Chart.ChartDetails.bindings.colorsSource.columnName
      ) {
        if (
          Array.isArray(
            props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.colorsSource.table]
          )
        ) {
          return props.kpiInfo.KPIData[
            jsonData.Chart.ChartDetails.bindings.colorsSource.table
          ].map((item) => item[jsonData.Chart.ChartDetails.bindings.colorsSource.columnName]);
        }
      }
    }
    catch (error) {
      console.log("Error in getPalettes:", error);
      return [];
    }
  }

  // set Y-axis step and max value
  const setMajorUnitY = () => {
    let flex = flexRef.current;
    let data = props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.seriesSource]
    if (data && flex) {
      // get the list of series bindings
      let yBindings = jsonData.Chart.ChartDetails.seriesData.map((col) => col.binding);
      let maxs = [];
      // identify the max value for each series bindings
      yBindings.forEach((ybind) => {
        let max = 0;
        data.forEach((row, index) => {
          if (index === 0) {
            max = row[ybind]
          }
          else {
            if (row[ybind] > max) {
              max = row[ybind]
            }
          }
        })
        maxs.push(max);
      })

      if (maxs.filter(val => val <= 5).length === maxs.length) {
        // set majorUnit as 1 to avoid decimals
        flex.axisY.majorUnit = 1;
        flex.axisY.max = 5;
      }
      else {
        // set majorUnit to auto
        flex.axisY.majorUnit = undefined;
        flex.axisY.max = undefined;
      }
    }
  }

  const chartInitiliazed = (flex) => {
    flexRef.current = flex;

    setMajorUnitY();

    if (props.setChartRefs) {
      props.setChartRefs(props.kpiInfo.KPIName, flex, props.kpiInfo.Sequence);
    }

    if (props.isLiveCheck) {
      props.isLiveCheck(jsonData.Chart.ChartDetails.isLive);
    }
  };

  // const handleRender = (s) => {
  //   try {
  //     let elements = s.engine.element;
  //     let seriesDataLength = Array.isArray(jsonData.Chart.ChartDetails.seriesData) ? jsonData.Chart.ChartDetails.seriesData.length : 0;
  //     if (seriesDataLength <= 1) {
  //       let series = elements.querySelectorAll('.wj-series-group g');
  //       if (jsonData.Chart.ChartDetails.common.chartType === "Column") {
  //         // set the width for each column
  //         series.forEach((seriesItem, idx) => {
  //           seriesItem.querySelectorAll('rect').forEach((rect) => {
  //             // set the max width to 30
  //             if (Number(rect.getAttribute('width')) > 35) {
  //               let xTickLoc = 0;
  //               xTickLoc = (Number(rect.getAttribute('x')) + Number(rect.getAttribute('width')) / 2) - 17.5;
  //               // set 'width' to 30
  //               rect.setAttribute('width', '35');
  //               // set 'x' value
  //               rect.setAttribute('x', xTickLoc);
  //             }
  //           });
  //         });
  //       }
  //       else if (jsonData.Chart.ChartDetails.common.chartType === "Bar") {
  //         // set the width for each bar
  //         series.forEach((seriesItem, idx) => {
  //           seriesItem.querySelectorAll('rect').forEach((rect) => {
  //             // set the max height to 30
  //             if (Number(rect.getAttribute('height')) > 35) {
  //               // get new 'x' value for thebar 
  //               let xTickLoc = (Number(rect.getAttribute('y')) + Number(rect.getAttribute('height')) / 2) - 17.5;
  //               // set 'height' to 30
  //               rect.setAttribute('height', '35');
  //               // set 'y' value
  //               rect.setAttribute('y', xTickLoc);
  //             }
  //           });
  //         });
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.log("Error in handleRender: ", error)
  //   }
  // }

  return (
    <ErrorBoundary>
      <TranslationConsumer>
        {(t) => (
          <div className="wijmoCharts">
            <wjChart.FlexChart
              {...jsonData.Chart.ChartDetails.common}
              itemsSource={
                props.kpiInfo.KPIData[
                jsonData.Chart.ChartDetails.bindings.seriesSource
                ]
              }
              header={t(jsonData.Chart.ChartDetails.common.header_locale_key)}
              initialized={chartInitiliazed}
              palette={getPalletes(props.theme)}
            // onRendered={handleRender}
            >
              <wjChart.FlexChartLegend
                {
                ...(
                  jsonData.Chart.ChartDetails.chartLegend ?
                    jsonData.Chart.ChartDetails.chartLegend :
                    { position: "Bottom" }
                )
                }
              ></wjChart.FlexChartLegend>
              {jsonData.Chart.ChartDetails.seriesData.map((column) => {
                return (
                  <wjChart.FlexChartSeries {...column} name={t(column.name)}>
                    {Array.isArray(column.chartAxis)
                      ? column.chartAxis.map((axisFormat) => {
                        return (
                          <wjChart.FlexChartAxis
                            {...axisFormat}
                          ></wjChart.FlexChartAxis>
                        );
                      })
                      : null}
                  </wjChart.FlexChartSeries>
                );
              })}
              {Array.isArray(jsonData.Chart.ChartDetails.chartAxis)
                ? jsonData.Chart.ChartDetails.chartAxis.map((axis) => {
                  return (
                    <wjChart.FlexChartAxis
                      {...axis}
                      title={t(axis.title)}
                    ></wjChart.FlexChartAxis>
                  );
                })
                : null}
              {jsonData.Chart.ChartDetails.dataLabel ? (
                <wjChart.FlexChartDataLabel
                  {...jsonData.Chart.ChartDetails.dataLabel}
                ></wjChart.FlexChartDataLabel>
              ) : null}

              {
                Array.isArray(jsonData.Chart.Thresholds) ?
                  jsonData.Chart.Thresholds.map(threshold => {
                    return (
                      <wjChartAnalytics.FlexChartYFunctionSeries
                        {...threshold}
                        name={t(threshold.Name)}
                        style={{
                          ...threshold.Styles
                        }}
                        min={
                          threshold.Min ?
                            threshold.Min : 0
                        }
                        max={props.kpiInfo.KPIData[
                          jsonData.Chart.ChartDetails.bindings.seriesSource
                        ].length - 1}
                        sampleCount={props.kpiInfo.KPIData[
                          jsonData.Chart.ChartDetails.bindings.seriesSource
                        ].length - 1}
                        tooltipContent={threshold.tooltipContent ? t(threshold.tooltipContent.Label) + ": " + threshold.tooltipContent.Value : "{y}"}
                        func={(x) => {
                          return threshold.Value;
                        }}>
                      </wjChartAnalytics.FlexChartYFunctionSeries>
                    );
                  })
                  : null
              }
              <wjChartInteraction.FlexChartGestures
                initialized={initGestures}
                mouseAction="Pan"
              ></wjChartInteraction.FlexChartGestures>
              <wjChartAnimate.FlexChartAnimation></wjChartAnimate.FlexChartAnimation>
            </wjChart.FlexChart>
          </div>
        )}
      </TranslationConsumer>
    </ErrorBoundary>
  );
};

LACSeriesChart.propTypes = {
  kpiInfo: PropTypes.object.isRequired,
  setChartRefs: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    theme: state.appTheme.theme
  }
}

export default connect(mapStateToProps)(LACSeriesChart);
