import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
// import { TranslationConsumer } from "@scuf/localization";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { functionGroups, fnTankMonitor } from "../../../JS/FunctionGroups";
import { SiteTreeViewUserActionsComposite } from "../Common/SiteTreeViewUserActionsComposite";
import { TranslationConsumer } from "@scuf/localization";
import { kpiTankMonitor } from "../../../JS/KPIPageName";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
class TankMonitorComposite extends Component {
  state = {
    tankMonitorDetails: [],
    isReadyToRender: false,
    operationsVisibilty: {
      add: false,
      delete: false,
      shareholder: false,
      terminal: true,
    },
    terminalOptions: [],
    selectedTerminal: "",
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      //this.BindTransportationTypes();
      this.getTerminalList();

      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnTankMonitor
      );
      this.setState({
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "TankMonitorComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getKPIList(terminal) {
    if (this.state.selectedMOT === undefined || this.state.selectedMOT === "") {
      this.setState({
        selectedMOT: this.props.userDetails.EntityResult.TransportationTypes[0],
      });
      //   this.state.selectedMOT =
      //     this.props.userDetails.EntityResult.TransportationTypes[0];
      // }
    }
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnTankMonitor
    );
    if (KPIView === true) {
      var notification = {
        message: "",
        messageType: "critical",
        messageResultDetails: [],
      };
      let objKPIRequestData = {
        PageName: kpiTankMonitor,
        TransportationType: this.state.selectedMOT,
        InputParameters: [
          {
            key: "TerminalCode",
            value: terminal, //this.state.selectedTerminal,
          },
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
          if (
            result.IsSuccess === true &&
            result.EntityResult.ListKPIDetails !== null
          ) {
            //console.log("ListKPIDetails", result.EntityResult.ListKPIDetails);
            this.setState(
              {
                tankMonitorDetails: result.EntityResult.ListKPIDetails,
              },
              () => {
                this.fillTankInventory();
              }
            );
          } else {
            this.setState({ tankMonitorDetails: [] });
            console.log("Error in tank monitor KPIList:", result.ErrorList);
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
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting tank monitor KPIList:", error);
        });
    }
  }
  getTerminalList() {
    try {
      axios(
        RestAPIs.GetTerminals,
        Utilities.getAuthenticationObjectforPost(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          )
            this.setState(
              {
                terminalOptions: result.EntityResult,
                selectedTerminal: result.EntityResult[0],
              },
              () => {
                this.getKPIList(result.EntityResult[0]);
              }
            );
        }
      });
    } catch (err) {
      console.log("TankMonitor:Error occured on getTerminalsList", err);
    }
  }
  handleTerminalSelectionChange = (terminal) => {
    try {
      this.setState(
        {
          selectedTerminal: terminal,
          isReadyToRender: true,
          tankMonitorDetails: [],
        },
        this.getKPIList(terminal)
      );
    } catch (error) {
      console.log(
        "SiteViewComposite:Error occured on handleTerminalSelectionChange",
        error
      );
    }
  };
  handleMOTChange = (mot) => {
    if (mot !== this.state.selectedMOT) {
      this.setState({ selectedMOT: mot, tankMonitorDetails: null }, () => {
        this.getKPIList(this.state.selectedTerminal);
      });
    }
  };
  BindTransportationTypes() {
    let MotDivs = [];
    if (
      Array.isArray(this.props.userDetails.EntityResult.TransportationTypes)
    ) {
      this.props.userDetails.EntityResult.TransportationTypes.forEach((mot) => {
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
      if (
        this.state.selectedMOT === undefined ||
        this.state.selectedMOT === ""
      ) {
        this.state.selectedMOT =
          this.props.userDetails.EntityResult.TransportationTypes[0];
      }
    }
    return MotDivs;
  }
  fillTankInventory() {
    let tkInventorys = this.state.tankMonitorDetails;

    if (
      tkInventorys === undefined ||
      tkInventorys === null ||
      this.state.selectedTerminal === undefined ||
      this.state.selectedTerminal === "" ||
      this.state.tankMonitorDetails === null ||
      this.state.tankMonitorDetails === undefined
    ) {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    } else if (Array.isArray(tkInventorys) && tkInventorys.length > 0) {
      return this.fillTankInfo();
    }
  }
  fillTankInfo() {
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div>
              <KPIDashboardLayout
                kpiList={this.state.tankMonitorDetails}
                pageName="TankMonitor"
              ></KPIDashboardLayout>
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    );
  }
  render() {
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div>
              <ErrorBoundary>
                {this.props.userDetails.EntityResult.IsEnterpriseNode ? (
                  <SiteTreeViewUserActionsComposite
                    breadcrumbItem={this.props.activeItem}
                    operationsVisibilty={this.state.operationsVisibilty}
                    terminals={this.state.terminalOptions}
                    selectedTerminal={this.state.selectedTerminal}
                    onTerminalChange={this.handleTerminalSelectionChange}
                    handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                  ></SiteTreeViewUserActionsComposite>
                ) : (
                  <TMUserActionsComposite
                    operationsVisibilty={this.state.operationsVisibilty}
                    breadcrumbItem={this.props.activeItem}
                    onDelete={this.handleDelete}
                    onAdd={this.handleAdd}
                    shrVisible={false}
                    handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                  ></TMUserActionsComposite>
                )}
              </ErrorBoundary>
              <ErrorBoundary>
                <div className="detailsContainer" style={{ paddingTop: "0px" }}>
                  <div
                    className=" ui pointing secondary ui scuf-tab menu "
                    style={{ minHeight: "0px", marginBottom: "20px" }}
                  >
                    {this.BindTransportationTypes()}
                  </div>
                </div>
              </ErrorBoundary>
              <ErrorBoundary>
                <div className="detailsContainer" style={{ paddingTop: "0px" }}>
                  {this.fillTankInventory()}
                </div>
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

export default connect(mapStateToProps)(TankMonitorComposite);
