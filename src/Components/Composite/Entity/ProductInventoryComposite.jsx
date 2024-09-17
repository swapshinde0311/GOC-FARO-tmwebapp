import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { Select, Icon } from '@scuf/common';
import { TranslationConsumer } from "@scuf/localization";
import DonutPieChart from "../Common/Charts/DonutPieChart";
import { kpiProductInventory } from "../../../JS/KPIPageName";
import * as Constants from "../../../JS/Constants";

class ProductInventoryComposite extends Component {
  state = {
    terminalList: [],
    selectedTerminal: "",
    kpiList: []
  };

  componentDidMount() {
    try {

      this.getTerminals();
    } catch (error) {
      console.log(
        "ProductInventoryComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }

  getKPIList() {
    let objKPIRequestData = {
      PageName: kpiProductInventory,
      TransportationType: Constants.TransportationType.ROAD,
      InputParameters: [
        {
          key: "TerminalCode",
          value: this.state.selectedTerminal,
        }
      ],
    };
    axios(
      RestAPIs.GetKPI,
      Utilities.getAuthenticationObjectforPost(objKPIRequestData, this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        //console.log(result);
        if (result.IsSuccess === true) {
          var total = 0;
          if (result.EntityResult.ListKPIDetails.length > 0) {
            result.EntityResult.ListKPIDetails[0].KPIData.Table.forEach(element => {
              total += element.AvailableQuantity;
              element.Product = element.Product + "    " + element.AvailableQuantity + " " + element.UOM;

            });
            result.EntityResult.ListKPIDetails[0].KPIData.Table.forEach(element => {
              element.AvailableQuantity = element.AvailableQuantity / total;
            });


          }
          this.setState({ kpiList: result.EntityResult.ListKPIDetails });
        } else {
          this.setState({ kpiList: [] });
          console.log("Error in Dashboard KPIList:", result.ErrorList);

        }

      })
      .catch((error) => {
        console.log("Error while getting Dashboard KPIList:", error);
      });
  }



  componentWillUnmount = () => {
  }



  getTerminals() {
    var tmCode = "";
    var terminals = [];
    //debugger;

    axios(
      RestAPIs.GetTerminalDetailsForUser,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        //console.log(response);
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            //debugger;
            tmCode = result.EntityResult[0].Key.Code;

            for (let i = 0; i < result.EntityResult.length; i++) {
              terminals.push(result.EntityResult[i].Key.Code);

            }

            this.setState(
              {
                terminalList: terminals,
                selectedTerminal: tmCode,
              },
              () => {
                this.getKPIList();
              }
            );
          } else {

          }
        } else {
          console.log("Error while getting Terminal List:", result);

        }
      })
      .catch((error) => {


        console.log("Error while getting Terminal List:", error);
      });
    return tmCode;
  }

  handleTerminalChange = (data) => {
    try {
      this.setState({
        selectedTerminal: data
      }, () => {
        this.getKPIList();
      });

    } catch (error) {
      console.log("ProductInventoryComposite:Error occured on handleTerminalChange", error);
    }
  }
  render() {
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div>
              <div className="ui breadcrumb pl-1 mobile-bread-crumb mobile-align-items-start">
                <div className="section pl-1 mt-sm-2 mt-lg-0">
                  <span>
                    {t("MobileProductInventory")}
                  </span>
                </div>
              </div>
              <div className="mobile-margin-top-20">
                <div className="row">
                  <div className="col-12 col-md-12 col-lg-12">
                    <Select
                      fluid
                      placeholder="Select"
                      value={this.state.selectedTerminal}
                      options={Utilities.transferListtoOptions(
                        this.state.terminalList
                      )}
                      onChange={(data) => this.handleTerminalChange(data)}
                      multiple={false}
                      reserveSpace={false}
                      search={false}
                      noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-12 col-lg-12">
                    <div className="mobileProductInventory">
                      {
                        this.state.kpiList.length > 0 && this.state.kpiList[0].KPIData.Table.length > 0 ?
                          <DonutPieChart
                            kpiInfo={this.state.kpiList[0]}
                            setChartRefs={null} /> : t("MarineDashboard_NoDataAvailable")}
                    </div>
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps)(ProductInventoryComposite);

ProductInventoryComposite.propTypes = {
  activeItem: PropTypes.object,
};



