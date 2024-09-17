import React, { Component } from "react";
import { TranslationConsumer } from "@scuf/localization";

class SingleValueChart extends Component {
  state = {};
  render() {
    let kpiInfo = this.props.kpiInfo;
    let config = JSON.parse(kpiInfo.JSONFormat);
    //console.log("json configuration", config);
    let color = "Red";
    let kpiValue = "kpi_unabletoFetch";
    let secondaryValue = null;
    let resultStatus = false;
    try {
      resultStatus = kpiInfo.resultData.IsSuccess;
      if (resultStatus) {
        color = "#b0b0b0";
        kpiValue = kpiInfo.KPIData.Table[0][config.item.colName];
        if (config.item.secondaryColName) {
          secondaryValue = kpiInfo.KPIData.Table[0][config.item.secondaryColName];
        }
        // if (kpiValue !== undefined && kpiValue !== null) {
        //   kpiValue = kpiValue.toString();
        // }
        if (Object.keys(config.item.categories).length > 1) {
          for (const cat of Object.keys(config.item.categories)) {
            if (kpiValue >= config.item.categories[cat].value) {
              color = config.item.categories[cat].color;
              break;
            }
          }
        } else {
          color = config.item.categories["cat1"].color;
        }
      } else {
        console.log(
          "fetch KPI Data",
          kpiInfo.resultData.ErrorList[0].ErrorMessage
        );
      }
    } catch (error) {
      console.log("fetch KPI Data", error);
    }
    return (
      <TranslationConsumer>
        {(t) => (
          <div
            className="tile"
            style={{
              borderLeftColor: color,
            }}
          >
            <div className="tileValue">
              <span style={{ color: color }}>
                {resultStatus ? kpiValue : t(kpiValue)}
              </span>{" "}
              {
                resultStatus && secondaryValue ?
                  <span style={{ color: color, fontSize: "12px" }}>({secondaryValue})</span>
                  : null
              }
              <span>{resultStatus ? config.item.unit : ""}</span>
            </div>
            <div className="tileName">{t(config.item.localeKey)}</div>
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

export default SingleValueChart;
