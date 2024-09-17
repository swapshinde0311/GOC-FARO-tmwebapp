//import { Button } from "@scuf/common";
import { Icon } from "@scuf/common";
import React, { Component } from "react";
import SvgCircle from "../../UIBase/Common/svgCircle";
import lodash from "lodash";
import ErrorBoundary from "../../ErrorBoundary";
import { DataTable } from "@scuf/datatable";
import { TranslationConsumer } from "@scuf/localization";
import { kpiTerminalDashboardDetails } from "../../../JS/KPIPageName";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import PropTypes from "prop-types";
const mapOptions = window["runConfig"].mapOptions;

class ENDashboardDetailsComposite extends Component {
  state = {
    selectedMOT: "",
    expandedRows: [],
    kpiList: [],
  };
  componentDidMount() {
    try {
      this.getKPIList();
      this.startRefreshTimer();
    } catch (error) {
      console.log(
        "EnDashboarDetailsComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }
  componentWillUnmount() {
    this.stopRefreshTimer();
  }
  startRefreshTimer = () => {
    let refreshInterval = 5;
    if (
      mapOptions.refreshMinutes !== undefined &&
      mapOptions.refreshMinutes > 0
    ) {
      refreshInterval = mapOptions.refreshMinutes;
    }
    this.refreshTimer = setInterval(() => {
      console.log("Details Refreshing started " + refreshInterval + new Date()); //TODO:Remove after testing
      this.getKPIList();
    }, refreshInterval * 60 * 1000);
  };
  stopRefreshTimer = () => {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      console.log("Details Refreshing stopped " + new Date()); //TODO:Remove after testing
    }
  };
  getKPIList() {
    var notification = {
      message: "",
      messageType: "critical",
      messageResultDetails: [], //{keyFields: ["DriverInfo_Code"],
      //keyValues: [this.state.modDriver.Code],
      //isSuccess: false,
      //errorMessage: "",}
    };
    let objKPIRequestData = {
      PageName: kpiTerminalDashboardDetails,
      InputParameters: [
        {
          key: "TerminalCode",
          value: this.props.selectedTerminal.TerminalCode,
        },
      ],
    };
    axios(
      RestAPIs.GetKPI,
      Utilities.getAuthenticationObjectforPost(objKPIRequestData, null)
    )
      .then((response) => {
        var result = response.data;
        //console.log(result);
        if (result.IsSuccess === true) {
          this.setState({ kpiList: result.EntityResult.ListKPIDetails });
        } else {
          this.setState({ kpiList: [] });
          console.log("Error in Dashboard KPIList:", result.ErrorList);
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: result.ErrorList[0],
          });
        }
        if (notification.messageResultDetails.length > 0) {
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting Dashboard KPIList:", error);
      });
  }

  getTPIList() {
    //debugger;
    let selectedMOT = this.state.selectedMOT;
    //if (selectedMOT !== "") {
    let terminal = this.props.selectedTerminal;
    let motTPIDetails = [];

    let terminalTPis = this.props.tpiList.filter(
      (terminalTPI) => terminalTPI.Key === terminal.TerminalCode
    );

    try {
      if (terminalTPis.length > 0) {
        if (Array.isArray(terminalTPis[0].Value.MoTTPIDetails)) {
          let motList = [];
          if (selectedMOT !== "") {
            motList = terminalTPis[0].Value.MoTTPIDetails.filter(
              (mottpi) => mottpi.Key === selectedMOT
            );
          } else {
            motList = [{ Key: "Terminal", Value: [] }];
            terminalTPis[0].Value.MoTTPIDetails.forEach((mot) => {
              motList[0].Value = motList[0].Value.concat(mot.Value);
            });
          }
          if (motList.length > 0) {
            if (
              Array.isArray(motList[0].Value) &&
              motList[0].Value.length > 0
            ) {
              motList[0].Value.forEach((tpi) => {
                if (tpi.ParentTPIDetails.ChartType === "SingleValue") {
                  let tpiDetails = lodash.cloneDeep(tpi.ParentTPIDetails);

                  tpiDetails["childTPIs"] = lodash.cloneDeep(
                    tpi.ChildTPIDetails
                  );
                  motTPIDetails.push(tpiDetails);
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("error in format TPIs at DashboardDetails.getTPIList", error);
    }
    //console.log("selectedMOT", motTPIDetails);
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <DataTable
              data={motTPIDetails}
              reorderableColumns={true}
              resizableColumns={true}
              //search={true}
              expandedRows={this.state.expandedRows}
              rowExpansionTemplate={this.rowExpansionTemplate}
            //searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
            // rows={pageSize}
            >
              <DataTable.Column
                initialWidth="20%"
                key="TPICategory"
                field="TPICategory"
                header={t("tpi_Category")}
                sortable={true}
                renderer={(cellData) => {
                  return t("tpi_" + cellData.rowData["TPICategory"]);
                }}
              />
              <DataTable.Column
                initialWidth="20%"
                key="TPIName"
                //field="TPIName"
                header={t("tpi_Name")}
                // sortable={true}
                renderer={(cellData) => {
                  let configuration = JSON.parse(
                    cellData.rowData["JSONFormat"]
                  );
                  return t("tpi_" + configuration.reflocalekey + "_name");
                }}
              />

              <DataTable.Column
                //initialWidth={columnDetail.Width}
                key="Formula"
                // field="TPIName"
                header={t("tpi_Formula")}
                // sortable={true}
                renderer={(cellData) => {
                  //debugger;
                  let configuration = JSON.parse(
                    cellData.rowData["JSONFormat"]
                  );
                  let formulaColumn = configuration.item.formulaCol;
                  let itemData = cellData.rowData["TPIData"][0];
                  if (itemData[formulaColumn] === null) {
                    return "---";
                  } else {
                    return <span>{itemData[formulaColumn]}</span>;
                  }
                }}
              />
              <DataTable.Column
                initialWidth="12%"
                key="TPIValue"
                //field="TPIName"
                header={t("tpi_Value")}
                // sortable={true}
                renderer={(cellData) => {
                  //debugger;
                  let configuration = JSON.parse(
                    cellData.rowData["JSONFormat"]
                  );
                  let valueColumn = configuration.item.tpiValueCol;
                  let unit = configuration.item.unit;
                  let itemData = cellData.rowData["TPIData"][0];
                  if (itemData[valueColumn] === null) {
                    return "---";
                  } else {
                    return (
                      <span>
                        {itemData[valueColumn]} {unit}
                      </span>
                    );
                  }
                }}
              />
              <DataTable.Column
                initialWidth="10%"
                key="TPIIndex"
                field="TPIValue"
                header={t("tpi_Index")}
                sortable={true}
                renderer={(cellData) => {
                  let configuration = JSON.parse(
                    cellData.rowData["JSONFormat"]
                  );
                  let valueColumn = configuration.item.tpiValueCol;
                  let itemData = cellData.rowData["TPIData"][0];
                  let categories = configuration.item.categories;
                  let color = this.getTPIColorCode(
                    categories,
                    "tpiValue",
                    itemData[valueColumn]
                  );
                  return (
                    <span style={{ color: color }}>
                      {cellData.rowData["TPIValue"]}
                    </span>
                  );
                }}
              />
              <DataTable.Column
                initialWidth="5px"
                renderer={(data) => {
                  if (data.rowData["childTPIs"].length > 0) {
                    // const open = this.state.expandedRows.includes(data.rowData);
                    const open =
                      this.state.expandedRows.findIndex(
                        (x) =>
                          x.TransportationType ===
                          data.rowData.TransportationType &&
                          x.TPIName === data.rowData.TPIName
                      ) >= 0
                        ? true
                        : false;
                    return (
                      <div
                        onClick={() => this.toggleExpand(data.rowData, open)}
                      >
                        <Icon
                          root="common"
                          name={open ? "caret-down" : "caret-right"}
                        />
                      </div>
                    );
                  } else return "";
                }}
              />
            </DataTable>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    );
    // } else {
    //   return "";
    // }
  }
  getTPIColorCode(categories, indexColumn, tpiIndex) {
    let colorCode = "";
    try {
      let modifiedIndex = tpiIndex === null ? 0 : tpiIndex;
      if (Array.isArray(categories)) {
        for (const category of categories) {
          if (modifiedIndex >= category[indexColumn]) {
            colorCode = category.color;
            break;
          }
        }
      }
    } catch (error) {
      console.log("DashboardDetails-GetColor-Error:", error);
    }
    return colorCode;
  }
  rowExpansionTemplate(data) {
    return <div>childTPIS: {data["childTPIs"].length}</div>;
  }

  toggleExpand(data, open) {
    let expanded = this.state.expandedRows;
    if (open) {
      let index = expanded.findIndex(
        (item) =>
          item.TransportationType === data.TransportationType &&
          item.TPIName === data.TPIName //JSON.stringify(item) === JSON.stringify(data)
      );
      expanded.splice(index, 1);
    } else {
      expanded.push(data);
    }
    this.setState({ expandedRows: expanded });
  }

  handleMOTClick = (mot) => {
    this.setState({ selectedMOT: mot === this.state.selectedMOT ? "" : mot });
  };

  getTransportationTPIIndexes() {
    //debugger;
    let terminal = this.props.selectedTerminal;
    // let motTPIs = [];
    let motDivs = [];
    try {
      let terminalTPis = this.props.tpiList.filter(
        (terminalTPI) => terminalTPI.Key === terminal.TerminalCode
      );

      if (terminalTPis.length > 0) {
        if (Array.isArray(terminalTPis[0].Value.MoTTPIIndex)) {
          terminalTPis[0].Value.MoTTPIIndex.forEach((motTPI) => {
            let terminalConfig = JSON.parse(terminal.TerminalConfig);
            let categories = terminalConfig.TPIConfig[motTPI.Key];
            let motIconClass = motTPI.Key.toLowerCase();
            motIconClass =
              "icon-" +
              motIconClass.charAt(0).toUpperCase() +
              motIconClass.slice(1);
            let paneClassName = "tpiMotPane";
            let motSpanclassName = "tpiMOTType";
            if (motTPI.Key === this.state.selectedMOT) {
              paneClassName = "tpiSelectedMotPane";
              motSpanclassName = "selectedtpiMOTType";
            }
            motDivs.push(
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <ErrorBoundary>
                  <TranslationConsumer>
                    {(t) => (
                      <div className={paneClassName}>
                        <div
                          style={{
                            display: "flex",
                            padding: "8px",
                            paddingBottom: "0px",
                            borderBottom: "1.5px solid #f0f0f0",
                          }}
                        >
                          <div>
                            <span
                              className={
                                motIconClass +
                                " " +
                                motSpanclassName +
                                " font24"
                              }
                            ></span>
                          </div>

                          <div>
                            <span className={motSpanclassName}>
                              {t(motTPI.Key)}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{ height: "100px", cursor: "pointer" }}
                          onClick={() => this.handleMOTClick(motTPI.Key)}
                        >
                          <SvgCircle
                            progress={motTPI.Value}
                            size={95}
                            strokeWidth={5}
                            circleOneStroke={this.getTPIColorCode(
                              categories,
                              "tpiIndex",
                              motTPI.Value
                            )} //"#7ea9e1"
                          ></SvgCircle>
                        </div>
                      </div>
                    )}
                  </TranslationConsumer>
                </ErrorBoundary>
              </div>
            );
          });
        }

        // motTPIs = terminalTPis[0].Value.MoTTPIIndex;
      }
    } catch (error) {
      console.log(
        "error in DashboardDetails- getTransportationTPIIndexes",
        error
      );
    }
    return motDivs;
  }

  render() {
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div style={{ marginTop: "10px" }}>
              <div className=" ui breadcrumb">
                <div
                  className="section"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.props.onBackClick(1)}
                >
                  <Icon
                    root="common"
                    name="caret-left"
                    className="caretLeft"
                  ></Icon>
                </div>
                <div className="section pl-1">
                  <span>
                    {t("tpi_Benchmarking") +
                      " - " +
                      this.props.selectedTerminal.TerminalCode}
                  </span>
                </div>
                {/* <div>
            <span
              className="icon-Home section"
              onClick={() => this.props.onBackClick()}
            ></span>
          </div> */}
              </div>
              <ErrorBoundary>
                <KPIDashboardLayout
                  kpiList={this.state.kpiList}
                ></KPIDashboardLayout>
              </ErrorBoundary>

              <div className="row">{this.getTransportationTPIIndexes()}</div>

              <div>{this.getTPIList()}</div>
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    );
  }
}

export default ENDashboardDetailsComposite;
ENDashboardDetailsComposite.propTypes = {
  tpiList: PropTypes.array.isRequired,
  selectedTerminal: PropTypes.object.isRequired,
  onBackClick: PropTypes.func.isRequired,
};
