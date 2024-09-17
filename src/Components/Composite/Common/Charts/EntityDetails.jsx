import React, { Component } from "react";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import ErrorBoundary from "../../../ErrorBoundary";
import { LoadingPage } from "../../../UIBase/Common/LoadingPage";
import { Search, Pagination } from "@scuf/common";
import lodash from "lodash";

const pageSize = 9;
class EntityDetailsChart extends Component {
  state = {
    entityDetails: [], //this.props.kpiInfo,
    searchResult: [], //this.props.kpiInfo,
    pageResult: [],
    value: "",
    results: [],
    pageIndex: 1,
    //pageSize:9
    //results: [],
  };
  buildPaging() {
    let filteredEntityDetails = this.state.searchResult;
    if (
      filteredEntityDetails !== null &&
      filteredEntityDetails !== undefined &&
      filteredEntityDetails.KPIData !== undefined &&
      filteredEntityDetails.KPIData.Table !== undefined &&
      filteredEntityDetails.KPIData.Table !== null &&
      filteredEntityDetails.KPIData.Table.length > pageSize
    ) {
      return (
        <ErrorBoundary>
          <div>
            <Pagination
              totalItems={filteredEntityDetails.KPIData.Table.length}
              itemsPerPage={pageSize}
              activePage={this.state.pageIndex}
              onPageChange={(page) => {
                this.setState({ pageIndex: page }, () =>
                  this.fillEntityDetails()
                );
              }}
            ></Pagination>
          </div>
        </ErrorBoundary>
      );
    } else return "";
  }
  fillEntityDetails() {
    let filteredEntityDetails = this.state.searchResult;
    let tkInventorys = null;
    if (
      filteredEntityDetails !== null &&
      filteredEntityDetails !== undefined &&
      filteredEntityDetails.KPIData !== undefined
    ) {
      tkInventorys = filteredEntityDetails.KPIData.Table;
    }
    if (filteredEntityDetails == null) {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    } else if (
      tkInventorys !== undefined &&
      Array.isArray(tkInventorys) &&
      tkInventorys.length > 0
    ) {
      // debugger;
      let firstIndexInPage = (this.state.pageIndex - 1) * pageSize;
      let lastIndexInPage = firstIndexInPage + pageSize;
      if (lastIndexInPage >= tkInventorys.length) {
        lastIndexInPage = tkInventorys.length;
      }
      return (
        <div className="flexWrap">
          {tkInventorys
            .slice(firstIndexInPage, lastIndexInPage)
            .map((inventory) => this.fillEntityInfo(inventory))}
        </div>
      );
    } else {
      return (
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div>
                <span></span>{" "}
                <span>{t("ATG_Tank_PointName_NotAvailable")}</span>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
      );
    }
  }

  fillEntityInfo(inventory) {
    // debugger;
    //let kpiInfo = this.props.kpiInfo;
    let config = JSON.parse(this.props.kpiInfo.JSONFormat);
    let fillingColumn = "GrossVolume";

    let productColor = "#9e9e9e";
    let tkDisplayCols = null;
    if (
      config.entityWidget.ChartDetails.PercentFillColumn !== undefined &&
      config.entityWidget.ChartDetails.PercentFillColumn !== null
    ) {
      fillingColumn = config.entityWidget.ChartDetails.PercentFillColumn;
      if (
        inventory[config.entityWidget.ChartDetails.ColorColumn] !== null &&
        inventory[config.entityWidget.ChartDetails.ColorColumn] !== ""
      ) {
        productColor = inventory[config.entityWidget.ChartDetails.ColorColumn];
      }

      //console.log("fillerValue", inventory[fillingColumn]);
    }
    if (
      config.entityWidget.Columns !== undefined &&
      config.entityWidget.Columns !== null
    ) {
      tkDisplayCols = config.entityWidget.Columns.sort(
        (a, b) => a.Position - b.Position
      ).filter((col) => col.IsVisible === "true");
    }
    //let test = this.getDetailsFromJSON(tkDisplayCols, inventory);
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div
              className={
                inventory[config.entityWidget.ChartDetails.StatusColumn] ===
                  true
                  ? "dbtankForMonitor"
                  : "dbtankForMonitorDisabled"
              }
            >
              <div
                className={
                  inventory[config.entityWidget.ChartDetails.StatusColumn] ===
                    true
                    ? "dbTankName"
                    : "dbTankNameDisabled"
                }
              >
                <span>
                  {inventory[config.entityWidget.ChartDetails.TitleColumn]}
                </span>
              </div>
              <div className="flexWrap">
                <div className="dbtankWidthForMonitor">
                  <div className="tankFilledForMonitor">
                    <div
                      className="tankFillingWithoutColor"
                      style={{
                        height:
                          (inventory[fillingColumn] * 100) /
                          (inventory[
                            config.entityWidget.ChartDetails.TotalFillColumn
                          ] *
                            1.18) +
                          "%",
                        backgroundColor: productColor,
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {" "}
                        {Math.round(
                          (inventory[fillingColumn] * 100) /
                          inventory[
                          config.entityWidget.ChartDetails.TotalFillColumn
                          ]
                        ) + "%"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="dbtankDetailsForMonitor">
                  {this.getDetailsFromJSON(tkDisplayCols, inventory)}
                </div>
              </div>
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    );
  }

  getDetailsFromJSON(columns, inventory) {
    let config = JSON.parse(this.props.kpiInfo.JSONFormat);
    return (
      <div className="flexWrapTankMonitor">
        {columns.map((col) => (
          <TranslationConsumer>
            {(t) => (
              <div className="flexWrapTankMonitor">
                <div
                  className={
                    col.IsHighlight === "true"
                      ? "tankIsHighLight"
                      : "flexWrapTankMonitor"
                  }
                >
                  <span
                    className={
                      inventory[
                        config.entityWidget.ChartDetails.StatusColumn
                      ] === true
                        ? "dbTankDetails"
                        : "dbTankDetailsDisabled"
                    }
                  >
                    {t(col.localeKey)}:
                  </span>
                  <span
                    className={
                      inventory[
                        config.entityWidget.ChartDetails.StatusColumn
                      ] === true
                        ? "dbTankDetails"
                        : "dbTankDetailsDisabled"
                    }
                  >
                    &nbsp;&nbsp;
                    {inventory[col.ColName] !== null &&
                      inventory[col.ColName] !== undefined
                      ? inventory[col.ColName].toString()
                      : inventory[col.ColName]}{" "}
                    {col.UOMColumn !== null && col.UOMColumn !== ""
                      ? inventory[col.UOMColumn]
                      : ""}
                  </span>
                </div>
              </div>
            )}
          </TranslationConsumer>
        ))}
      </div>
    );
  }
  handleSearchChange(value) {
    let entityDetails = [];
    try {
      entityDetails = lodash.cloneDeep(this.props.kpiInfo); //this.state.searchResult;

      if (value !== undefined &&
        value !== null &&
        value !== "") {
        if (entityDetails !== undefined &&
          entityDetails !== null &&
          entityDetails !== "") {
          //console.log("entityDetails", entityDetails);
          let config = JSON.parse(entityDetails.JSONFormat);
          let tkDisplayCols = null;
          if (
            config.entityWidget.Columns !== undefined &&
            config.entityWidget.Columns !== null
          ) {
            tkDisplayCols = config.entityWidget.Columns.filter(
              (col) => col.IsVisible === "true"
            );
          }
          //console.log("tkDisplayCols", tkDisplayCols);
          let validRow = false;
          let filt = [];
          if (value !== undefined) {
            entityDetails.KPIData.Table.forEach((k) => {
              let rowvalues = Object.values(k);
              rowvalues.every((cellvalue) => {
                if (
                  cellvalue !== null &&
                  cellvalue
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                ) {
                  filt.push(k);
                  return false;
                } else {
                  return true;
                }
              });
            });
            entityDetails.KPIData.Table = filt;
            this.setState({ searchResult: entityDetails, pageIndex: 1 }, () =>
              this.fillEntityDetails()
            );
            this.buildPaging(this.state.searchResult);
          }
        }
      } else {
        if (this.props.kpiInfo !== undefined) {
          let n = lodash.cloneDeep(this.props.kpiInfo);
          this.setState({ searchResult: n }, () => this.fillEntityDetails());
          this.buildPaging(this.state.searchResult);
        }
      }
    } catch (error) {
      console.log("EntityDetais-> error in handleSearchChange", error);
    }
  }
  getValues(data) {
    let arr = [];
    arr = Object.keys(data).forEach((key) => {
      <div key={data[key]} className="row">
        <div className="col-xs-6">{key}</div>
        <div className="col-xs-6">{data[key]}</div>
      </div>;
    });
    return arr;
  }
  handleSearchSelect(result) {
    // debugger;
    // this.setState({
    //   searchResult: this.state.entityDetails,
    // });
  }
  render() {
    // this.state.entityDetails = lodash.cloneDeep(this.props.kpiInfo);
    //this.state.searchResult = lodash.cloneDeep(this.props.kpiInfo);
    return (
      <TranslationConsumer>
        {(t) => (
          <div className="dbTankPane">
            <div className="dbTankPane">
              {" "}
              <Search
                //results={this.state.searchResult}
                results={this.state.results}
                value={this.state.value}
                //onResultSelect={(value) => this.handleSearchSelect(value)}
                onSearchChange={(value) => this.handleSearchChange(value)}
              />
              {this.fillEntityDetails()}
            </div>
            <div>{this.buildPaging(this.state.searchResult)}</div>
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

export default EntityDetailsChart;

// EntityDetailsChart.propTypes = {
//   entityDetails: PropTypes.object.isRequired,
// };
