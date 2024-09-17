import React, { Component } from "react";
import axios from "axios";
import * as RestApis from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import { connect } from "react-redux";
import { Tab } from "@scuf/common";
import ErrorBoundary from "../../ErrorBoundary";
import { TranslationConsumer } from "@scuf/localization";
import { Divider } from "@scuf/common";
import { List } from "@scuf/common";
import { Icon } from "@scuf/common";
import "@grapecity/wijmo.styles/wijmo.css";
import * as wijmo from "@grapecity/wijmo";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
import * as Constants from "../../../JS/Constants";
wjcCore.setLicenseKey(Constants.wizmoKey);

class OperatorDashboardThroughputSummaryComposite extends Component {
  state = {
    drawerClassName: "",
    tankInventory: [],
    dispatchProductsThroughput: [],
    dispatchPalette: [],
    receiptProductsThroughput: [],
    receiptPalette: [],
  };

  getDispatchProductsThroughput() {
    const keyCode = [
      {
        key: "Date",
        value: new Date(),
      },
      {
        key: "TransactionType",
        value: "DISPATCH",
      },
      {
        key: KeyCodes.transportationType,
        value: this.props.transportationType,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetProductsThroughput,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult === null) {
            this.setState({ dispatchProductsThroughput: result.EntityResult });
          } else {
            let list = result.EntityResult.ProductThroughputItems;
            let dispatchProductsThroughput = [];
            let dispatchPalette = [];
            list.forEach((item) => {
              let data = {
                name: item.ProductCode,
                volQty: item.VolQty,
                volumeUOM: result.EntityResult.VolumeUOM,
                massQty: item.MassQty,
                massUOM: result.EntityResult.MassUOM,
              };
              let color = "#" + item.Color;
              dispatchProductsThroughput.push(data);
              dispatchPalette.push(color);
            });
            this.setState({ dispatchProductsThroughput, dispatchPalette });
          }
        } else {
          console.log("Error in getProductsThroughput: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "OperatorDashboardDetailsComposite: Error occurred on getProductsThroughput",
          error
        );
      });
  }

  getReceiptProductsThroughput() {
    const keyCode = [
      {
        key: "Date",
        value: new Date(),
      },
      {
        key: "TransactionType",
        value: "RECEIPT",
      },
      {
        key: KeyCodes.transportationType,
        value: this.props.transportationType,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetProductsThroughput,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult === null) {
            this.setState({ receiptProductsThroughput: result.EntityResult });
          } else {
            let list = result.EntityResult.ProductThroughputItems;
            let receiptProductsThroughput = [];
            let receiptPalette = [];
            list.forEach((item) => {
              let data = {
                name: item.ProductCode,
                volQty: item.VolQty,
                volumeUOM: result.EntityResult.VolumeUOM,
                massQty: item.MassQty,
                massUOM: result.EntityResult.MassUOM,
              };
              let color = "#" + item.Color;
              receiptPalette.push(color);
              receiptProductsThroughput.push(data);
            });
            this.setState({ receiptProductsThroughput, receiptPalette });
          }
        } else {
          console.log("Error in getProductsThroughput: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "OperatorDashboardDetailsComposite: Error occurred on getProductsThroughput",
          error
        );
      });
  }

  getTankInventory() {
    axios(
      RestApis.GetTankInventory,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ tankInventory: result.EntityResult });
        } else {
          console.log("Error in getShifts: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "OperatorDashboardDetailsComposite: Error occurred on gerShifts",
          error
        );
      });
  }

  isDisplayDrawer = () => {
    let drawerClassName = this.state.drawerClassName;
    if (drawerClassName === "") {
      drawerClassName = "marineDashboardDrawerShow";
    } else {
      drawerClassName = "";
    }
    this.setState({ drawerClassName });
  };

  componentDidMount() {
    this.getTankInventory();
    this.getDispatchProductsThroughput();
    this.getReceiptProductsThroughput();
  }

  render() {
    const {
      tankInventory,
      dispatchProductsThroughput,
      dispatchPalette,
      receiptProductsThroughput,
      receiptPalette,
      drawerClassName,
    } = this.state;

    return (
      <div>
        <TranslationConsumer>
          {(t) => (
            <div className={"marineDashboardDrawer " + drawerClassName}>
              <div
                className="marineDashboardDrawerButton"
                onClick={this.isDisplayDrawer}
              >
                <Icon
                  name={drawerClassName === "" ? "menu-icon" : "close"}
                  size="medium"
                />
              </div>

              <ErrorBoundary>
                <h3 style={{ marginTop: -10, fontWeight: 630 }}>
                  {t("MarineDashboard_ThroughputSummary")}
                </h3>
                <Divider fitted></Divider>
                <Tab>
                  <Tab.Pane
                    className="marineDashboardThroughputSummaryTab"
                    title={t("MarineDashboard_Loading")}
                  >
                    {dispatchProductsThroughput === null ? (
                      <div className="marineDashboardNoDataAvailable">
                        {t("MarineDashboard_NoDataAvailable")}
                      </div>
                    ) : (
                      <div>
                        <div
                          className="container-fluid"
                          style={{ paddingLeft: 0 }}
                        >
                          <wjChart.FlexPie
                            header=""
                            style={{ height: 369 }}
                            bindingName="name"
                            binding="volQty"
                            innerRadius={0.9}
                            itemsSource={dispatchProductsThroughput}
                            palette={dispatchPalette}
                            plotMargin="0 100 0 100 "
                          >
                            <wjChart.FlexPieDataLabel
                              position="Outside"
                              offset={3}
                              content={(ht) => {
                                return wijmo.format("{val} ", {
                                  val:
                                    ht.item.massQty > 0
                                      ? ht.item.massQty.toLocaleString() +
                                        " " +
                                        ht.item.massUOM
                                      : ht.value.toLocaleString() +
                                        " " +
                                        ht.item.volumeUOM,
                                });
                              }}
                            ></wjChart.FlexPieDataLabel>
                            <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                          </wjChart.FlexPie>
                        </div>
                      </div>
                    )}
                  </Tab.Pane>
                  <Tab.Pane
                    className="marineDashboardThroughputSummaryTab"
                    title={t("MarineDashboard_Unloading")}
                  >
                    {receiptProductsThroughput === null ? (
                      <div className="marineDashboardNoDataAvailable">
                        {t("MarineDashboard_NoDataAvailable")}
                      </div>
                    ) : (
                      <div>
                        <div
                          className="container-fluid"
                          style={{ paddingLeft: 0 }}
                        >
                          <wjChart.FlexPie
                            header=""
                            style={{ height: 369 }}
                            bindingName="name"
                            binding="volQty"
                            innerRadius={0.9}
                            itemsSource={receiptProductsThroughput}
                            palette={receiptPalette}
                            plotMargin="0 100 0 100 "
                          >
                            <wjChart.FlexPieDataLabel
                              position="Outside"
                              content={(ht) => {
                                try {
                                  return wijmo.format("{val} ", {
                                    val:
                                      ht.item.massQty > 0
                                        ? ht.item.massQty.toLocaleString() +
                                          " " +
                                          ht.item.massUOM
                                        : ht.value.toLocaleString() +
                                          " " +
                                          ht.item.volumeUOM,
                                  });
                                } catch (error) {
                                  console.log(
                                    "error in wjChart.FlexPieDataLabel " + error
                                  );
                                  return wijmo.format("{val} ", {
                                    val:
                                      ht.item.massQty > 0
                                        ? ht.item.massQty +
                                          " " +
                                          ht.item.massUOM
                                        : ht.value + " " + ht.item.volumeUOM,
                                  });
                                }
                              }}
                            ></wjChart.FlexPieDataLabel>
                            <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                          </wjChart.FlexPie>
                        </div>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab>
              </ErrorBoundary>
              <Divider fitted></Divider>
              <h3 style={{ marginTop: 12, fontWeight: 630 }}>
                {t("MarineDashboard_CurrentTankInventory")}
              </h3>
              <ErrorBoundary>
                <List horizontal={true}>
                  <List.Content>
                    <div className="marineDashboardThroughputSummaryListTitle">
                      {t("MarineDashboard_ProductName")}
                    </div>
                    {tankInventory.map((item) => {
                      return (
                        <div className="marineDashboardThroughputSummaryListContent">
                          {item.ProductCode}
                        </div>
                      );
                    })}
                  </List.Content>
                  <List.Content>
                    <div className="marineDashboardThroughputSummaryListTitle">
                      {t("MarineDashboard_ActiveTank")}
                    </div>
                    {tankInventory.map((item) => {
                      return (
                        <div className="marineDashboardThroughputSummaryListContent">
                          {item.TankCode}
                        </div>
                      );
                    })}
                  </List.Content>
                  <List.Content>
                    <div className="marineDashboardThroughputSummaryListTitle">
                      {t("MarineDashboard_CurrentStock")}
                    </div>
                    {tankInventory.map((item) => {
                      try {
                        return (
                          <div className="marineDashboardThroughputSummaryListContent">
                            {item.GrossVolume === null
                              ? "null"
                              : item.GrossVolume.toLocaleString()}
                          </div>
                        );
                      } catch (error) {
                        console.log("error in List.Content " + error);
                        return null;
                      }
                    })}
                  </List.Content>
                </List>
              </ErrorBoundary>
            </div>
          )}
        </TranslationConsumer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(
  OperatorDashboardThroughputSummaryComposite
);
