import React from "react";
import PropTypes from "prop-types";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjChartAnimate from "@grapecity/wijmo.react.chart.animation";
import ErrorBoundary from "../../../ErrorBoundary";
import { TranslationConsumer } from "@scuf/localization";
import { ThemeType } from "@scuf/common";
import { connect } from "react-redux";

const DonutPieChart = (props) => {
  const chartInitialized = (flex) => {
    if (props.setChartRefs) {
      props.setChartRefs(props.kpiInfo.KPIName, flex, props.kpiInfo.Sequence);
    }

    if (props.isLiveCheck) {
      props.isLiveCheck(jsonData.Chart.ChartDetails.isLive);
    }
  };

  const jsonData = JSON.parse(props.kpiInfo.JSONFormat);

  // get palette based on the selected theme
  const getPalettes = (theme) => {
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
      return []
    }
  }

  return (
    <ErrorBoundary>
      <TranslationConsumer>
        {(t) => (
          <div className="wijmoCharts">
            <wjChart.FlexPie
              {...jsonData.Chart.ChartDetails.common}
              itemsSource={
                props.kpiInfo.KPIData[
                jsonData.Chart.ChartDetails.bindings.seriesSource
                ]
              }
              palette={getPalettes(props.theme)}
              header={t(jsonData.Chart.ChartDetails.header)}
              initialized={chartInitialized}
            >
              {jsonData.Chart.ChartDetails.chartLegend ? (
                <wjChart.FlexChartLegend
                  {...jsonData.Chart.ChartDetails.chartLegend}
                ></wjChart.FlexChartLegend>
              ) : (
                ""
              )}
              {jsonData.Chart.ChartDetails.dataLabel ? (
                <wjChart.FlexPieDataLabel
                  {...jsonData.Chart.ChartDetails.dataLabel}
                ></wjChart.FlexPieDataLabel>
              ) : null}
              <wjChartAnimate.FlexChartAnimation animationMode="Point"></wjChartAnimate.FlexChartAnimation>
            </wjChart.FlexPie>
          </div>
        )}
      </TranslationConsumer>
    </ErrorBoundary>
  );
};

DonutPieChart.propTypes = {
  kpiInfo: PropTypes.object.isRequired,
  setChartRefs: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    theme: state.appTheme.theme
  }
}

export default connect(mapStateToProps)(DonutPieChart);