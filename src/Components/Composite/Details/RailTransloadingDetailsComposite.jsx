import React, { Component } from "react";
import { RailTransloadingDetails } from "../../UIBase/Details/RailTransloadingDetails";
import * as Utilities from "../../../JS/Utilities";
import {
  emptyMarineTransloading as emptyRailTransloading,
  emptyRailReceipt,
} from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  marineTransloadingDetailsColumns as railTransloadingDetailsColumns,
  marineTransloadingAssociatedShipmentsColumns as railTransloadingAssociatedShipmentsColumns,
} from "../../../JS/DetailsTableValidationDef";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { getKeyByValue } from "../../../JS/Utilities";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
class RailTransloadingDetailsComposite extends Component {
  state = {
    railReceipt: lodash.cloneDeep(emptyRailReceipt),
    railTransloading: lodash.cloneDeep(emptyRailTransloading),
    modMarineReceipt: {},
    railTransloadingAssociatedShipmentsColumns: lodash.cloneDeep(
      railTransloadingAssociatedShipmentsColumns
    ),
    railTransloadingDetailsColumns: lodash.cloneDeep(
      railTransloadingDetailsColumns
    ),
    isReadyToRender: false,
    listOptions: {
      shareholders: this.getShareholders(),
      terminalCodes: this.props.terminalCodes,
    },
    dsCompartmentsBaseProduct: [],
    dsTransloadingShipments: [],
    dsTransloadingShipmentLoadingDetails: [],
    saveEnabled: false,
    selectedCompRow: [],
    selectedAll: false,
    isSelect: -1,
    expandedRows: [],
    selectCompartmentCode: "",
  };
  handleRowSelectionChange = (e) => {
    this.setState({ selectedCompRow: e });
  };
  setCurrentList = (e, CompartmentCode) => {
    try {
      var selectCompartmentCode = lodash.cloneDeep(
        this.state.selectCompartmentCode
      );
      var railTransloading = lodash.cloneDeep(this.state.railTransloading);
      var railReceipt = lodash.cloneDeep(this.state.railReceipt);
      if (selectCompartmentCode !== CompartmentCode) {
        railTransloading.showLoadingDetails = false;
        railReceipt.RailMarineReceiptCompartmentPlanList.forEach((element) => {
          if (CompartmentCode === element.TrailerCode) {
            railTransloading.selectCompartment.CompartmentCode =
              element.TrailerCode;
            railTransloading.selectCompartment.CompartmentProduct =
              this.GetBaseProductForCompartment(element.SequenceNo);
            railTransloading.selectCompartment.PlanQuantityUOM =
              element.PlanQuantityUOM;
            railTransloading.selectCompartment.PlannedQuantity =
              element.PlannedQuantity.toLocaleString();
            if (
              element.UnloadedQuantityUOM !== undefined &&
              element.UnloadedQuantityUOM !== null
            )
              railTransloading.selectCompartment.UnloadedQuantityUOM =
                element.UnloadedQuantityUOM;
            else railTransloading.selectCompartment.UnloadedQuantityUOM = "";
            if (
              element.UnloadedQuantity !== undefined &&
              element.UnloadedQuantity !== null
            )
              railTransloading.selectCompartment.UnloadedQuantity =
                element.UnloadedQuantity.toLocaleString();
            else railTransloading.selectCompartment.UnloadedQuantity = "0";
            railTransloading.selectCompartment.ReceiptCompartmentStatus =
              getKeyByValue(
                Constants.ReceiptCompartmentStatus,
                element.ReceiptCompartmentStatus
              );
            this.setState({
              isSelect: Number(e.currentTarget.getAttribute("index")),
              railTransloading: railTransloading,
              selectCompartmentCode: CompartmentCode,
            });
            this.getReceiptShipments(
              element.TrailerCode,
              element.ReceiptCode,
              element.CompartmentCode,
              railTransloading
            );
          }
        });
      }
    } catch (error) {
      console.log(
        "RailTransloadingDetailsComposite:Error occured on setCurrentList",
        error
      );
    }
  };
  getReceiptShipments = (
    TrailerCode,
    ReceiptCode,
    CompartmentCode,
    railTransloading
  ) => {
    try {
      var dsTransloadingShipments = [];
      this.setState({
        dsTransloadingShipments: dsTransloadingShipments,
        railTransloading: railTransloading,
      });
      let obj = {
        trailerCode: TrailerCode,
        receiptCode: ReceiptCode,
        compartmentCode: CompartmentCode,
        transportationType: this.getTransportationType(),
      };
      axios(
        RestAPIs.GetTransloadingShipments,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let dsTransloadingShipmentTable = result.EntityResult.Table;

            if (
              dsTransloadingShipmentTable != null &&
              dsTransloadingShipmentTable.length > 0
            ) {
              railTransloading.showShipment = true;
              dsTransloadingShipmentTable.forEach((element) => {
                var loadedQuantity;
                if (
                  element.LoadedQty !== null &&
                  element.LoadedQty !== undefined
                ) {
                  loadedQuantity =
                    element.LoadedQty.toLocaleString() +
                    " " +
                    element.LoadedQuantityUOM;
                }
                var Quantity;
                if (
                  element.quantity !== null &&
                  element.quantity !== undefined
                ) {
                  Quantity =
                    element.quantity.toLocaleString() +
                    " " +
                    element.QuantityUOM;
                }
                dsTransloadingShipments.push({
                  driver: element.driver,
                  id: element.id,
                  id1: element.id1,
                  LoadedQty: loadedQuantity,
                  LoadedQuantityUOM: element.LoadedQuantityUOM,
                  quantity: Quantity,
                  QuantityUOM: element.QuantityUOM,
                  shipmentCode: element.shipmentCode,
                  shipmentStatus: element.shipmentStatus,
                  vehicle: element.vehicle,
                });
              });
              this.setState({
                dsTransloadingShipments: dsTransloadingShipments,
                railTransloading: railTransloading,
                isReadyToRender: true,
              });
            }
          } else {
            railTransloading.showShipment = false;
            this.setState({
              dsTransloadingShipments: dsTransloadingShipments,
              railTransloading: railTransloading,
              isReadyToRender: true,
            });
            console.log("Error in GetTransloadingShipments:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error while geting GetTransloadingShipments List:",
            error
          );
        });
    } catch (error) {
      console.log(
        "RailTransloadingDetailsComposite:Error occured on getReceiptShipments",
        error
      );
    }
  };
  getShipmentLoadingDetails(
    ShipmentCode,
    ReceiptCode,
    TrailerCode,
    CompartmentCode
  ) {
    try {
      var railTransloading = lodash.cloneDeep(this.state.railTransloading);
      var dsTransloadingShipmentLoadingDetails = lodash.cloneDeep(
        this.state.dsTransloadingShipmentLoadingDetails
      );
      var dsTransloadingShipments = lodash.cloneDeep(
        this.state.dsTransloadingShipments
      );
      this.setState({
        dsTransloadingShipmentLoadingDetails:
          dsTransloadingShipmentLoadingDetails,
        railTransloading: railTransloading,
        dsTransloadingShipments,
      });
      let obj = {
        shipmentCode: ShipmentCode,
        trailerCode: TrailerCode,
        receiptCode: ReceiptCode,
        compartmentCode: CompartmentCode,
        transportationType: this.getTransportationType(),
      };
      axios(
        RestAPIs.GetShipmentLoadingDetails,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            dsTransloadingShipmentLoadingDetails = lodash.cloneDeep(
              result.EntityResult.Table
            );
            if (
              dsTransloadingShipmentLoadingDetails != null &&
              dsTransloadingShipmentLoadingDetails.length > 0
            ) {
              railTransloading.showLoadingDetails = true;
              this.setState({
                dsTransloadingShipmentLoadingDetails:
                  dsTransloadingShipmentLoadingDetails,
                marineTransloading: railTransloading,
                isReadyToRender: true,
              });
            }
          } else {
            railTransloading.showLoadingDetails = false;
            this.setState({
              dsTransloadingShipmentLoadingDetails:
                dsTransloadingShipmentLoadingDetails,
              marineTransloading: railTransloading,
              isReadyToRender: true,
            });
            console.log(
              "Error in GetShipmentLoadingDetails:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error while geting GetShipmentLoadingDetails List:",
            error
          );
        });
    } catch (error) {
      console.log(
        "RailTransloadingDetailsComposite:Error occured on getShipmentLoadingDetails",
        error
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.railReceipt.ReceiptCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined
      )
        this.GetTransloadingReceiptCompartments(nextProps.selectedRow);
    } catch (error) {
      console.log(
        "RailTransloadingDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetCompartmentsBaseProducts(this.props.selectedRow.ReceiptCode);
      //this.getMarineReceipt(this.props.selectedRow.ReceiptCode);
    } catch (error) {
      console.log(
        "RailTransloadingDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  GetCompartmentsBaseProducts(ReceiptCode) {
    var transportationType = this.getTransportationType();
    emptyRailTransloading.TransportationType = transportationType;
    var listOptions = lodash.cloneDeep(this.state.listOptions);
    emptyRailTransloading.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.QuantityUOM;
    emptyRailTransloading.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    if (ReceiptCode === undefined) {
      this.setState({
        railTransloading: { ...emptyRailTransloading },
        modrailTransloading: { ...emptyRailTransloading },
        listOptions,
        isReadyToRender: true,
      });
      return;
    }
    axios(
      RestAPIs.GetRailCompartmentsBaseProducts +
        "?ReceiptCode=" +
        ReceiptCode +
        "&TransportationType=RAIL",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var railTransloading = lodash.cloneDeep(this.state.railTransloading);
          var dsCompartmentsBaseProduct = lodash.cloneDeep(
            result.EntityResult.Table
          );
          if (
            Array.isArray(dsCompartmentsBaseProduct) &&
            dsCompartmentsBaseProduct.length > 0
          ) {
            dsCompartmentsBaseProduct.forEach((element) => {
              if (element.IsTransloading) {
                if (railTransloading.lstCompartmentBPs.length === 0)
                  railTransloading.lstCompartmentBPs.push(
                    element.BaseProductCode
                  );
                if (
                  railTransloading.lstCompartmentBPs.filter((com) => {
                    return com.BaseProductCode !== element.BaseProductCode;
                  }).length === 0
                ) {
                  railTransloading.lstCompartmentBPs.push(
                    element.BaseProductCode
                  );
                }
              }
            });
            railTransloading.PlanQuantityUOM =
              dsCompartmentsBaseProduct[0].PlanQuantityUOM;
            if (
              dsCompartmentsBaseProduct[0].UnloadedQuantityUOM !== undefined &&
              dsCompartmentsBaseProduct[0].UnloadedQuantityUOM !== null
            )
              railTransloading.UnloadedQuantityUOM =
                dsCompartmentsBaseProduct[0].UnloadedQuantityUOM;
            else
              railTransloading.UnloadedQuantityUOM =
                dsCompartmentsBaseProduct[0].PlanQuantityUOM;

            let ltCompartmentBPs = [];
            dsCompartmentsBaseProduct.forEach((dr) => {
              if (dr.IsTransloading) {
                let i = ltCompartmentBPs.findIndex(el => 
                  el === dr.BaseProductCode
                );

                if (i < 0) {
                  ltCompartmentBPs.push(dr.BaseProductCode);
                }
              }
            });
            railTransloading.NoOfProducts = ltCompartmentBPs.length;
          }
          this.setState({
            isReadyToRender: true,
            railTransloading: lodash.cloneDeep(railTransloading),
            dsCompartmentsBaseProduct: lodash.cloneDeep(
              dsCompartmentsBaseProduct
            ),
          });
          this.getRailReceipt(ReceiptCode);
        } else {
          this.setState({
            railTransloading: lodash.cloneDeep(emptyRailTransloading),
            modrailTransloading: lodash.cloneDeep(emptyRailTransloading),
            isReadyToRender: true,
          });
          console.log(
            "Error in GetCompartmentsBaseProducts:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting GetCompartmentsBaseProducts:", error);
        //throw error;
      });
  }

  getRailReceipt(ReceiptCode) {
    var transportationType = this.getTransportationType();
    emptyRailTransloading.TransportationType = transportationType;
    emptyRailTransloading.Active = true;
    emptyRailTransloading.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.QuantityUOM;
    emptyRailTransloading.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    var keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: ReceiptCode,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var railTransloading = lodash.cloneDeep(this.state.railTransloading);
          let railReceipt = result.EntityResult;
          if (
            this.props.selectedRow != null &&
            this.props.selectedRow != undefined
          ) {
            railReceipt.ReceiptStatus = this.props.selectedRow.ReceiptStatus;
          }
          if (
            railReceipt !== null &&
            railReceipt.RailMarineReceiptCompartmentPlanList !== null
          ) {
            railReceipt.RailMarineReceiptCompartmentPlanList.forEach(
              (element) => {
                if (
                  element.IsTransloading !== null &&
                  element.IsTransloading !== "" &&
                  element.IsTransloading
                ) {
                  var compartBP =
                    element.TrailerCode +
                    "(" +
                    this.GetBaseProductForCompartment(element.SequenceNo) +
                    ")";
                  railTransloading.lstCompartmentList.push({
                    compartBP: compartBP,
                    CompartmentCode: element.TrailerCode,
                  });
                  railTransloading.totalNoOfTransWagons += 1;
                  railTransloading.totalPlannedQtyForTransloadingWagons +=
                    element.PlannedQuantity;
                  if (
                    element.UnloadedQuantity !== undefined &&
                    element.UnloadedQuantity !== null
                  ) {
                    railTransloading.totalUnloadedQtyForTransloadingWagons +=
                      element.UnloadedQuantity;
                  }
                }
                railTransloading.receiptPlannedQty += element.PlannedQuantity;
              }
            );
          }
          this.setState({
            isReadyToRender: true,
            railReceipt: lodash.cloneDeep(result.EntityResult),
            railTransloading: lodash.cloneDeep(railTransloading),
          });
        } else {
          this.setState({
            railReceipt: lodash.cloneDeep(emptyRailTransloading),
            modMarineReceipt: lodash.cloneDeep(emptyRailTransloading),
            isReadyToRender: true,
          });
          console.log("Error in getRailReceipt:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railReceipt:", error);
        //throw error;
      });
  }

  GetBaseProductForCompartment(seqNO) {
    let bp = "";
    var dsCompartmentsBaseProduct = lodash.cloneDeep(
      this.state.dsCompartmentsBaseProduct
    );
    if (
      Array.isArray(dsCompartmentsBaseProduct) &&
      dsCompartmentsBaseProduct.length > 0
    ) {
      var dataRows = dsCompartmentsBaseProduct.filter((com, cindex) => {
        return com.SequenceNo === seqNO;
      });
      if (dataRows !== undefined && dataRows.length > 0) {
        bp = dataRows[0].BaseProductCode;
      }
    }
    return bp;
  }

  getTransportationType() {
    var transportationType = Constants.TransportationType.RAIL;
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transportationType = genericProps.transportationType;
    }
    return transportationType;
  }

  handleReset = () => {
    try {
    } catch (error) {
      console.log(
        "RailTransloadingDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  handleRowClick = (e) => {
    try {
      var dsCompartmentsBaseProduct = lodash.cloneDeep(
        this.state.dsCompartmentsBaseProduct
      );
      let selectCompartmentCode = lodash.cloneDeep(
        this.state.selectCompartmentCode
      );
      if (e.shipmentCode != null || e.shipmentCode.length > 0) {
        dsCompartmentsBaseProduct.forEach((element) => {
          if (selectCompartmentCode === element.TrailerCode) {
            this.getShipmentLoadingDetails(
              e.shipmentCode,
              element.ReceiptCode,
              element.TrailerCode,
              element.CompartmentCode
            );
          }
        });
      }
      this.setState({
        dsCompartmentsBaseProduct: dsCompartmentsBaseProduct,
      });
    } catch (error) {
      console.log("CarrierCompanyComposite:Error occured on Row click", error);
    }
  };
  toggleExpand = (data, open) => {
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.compSeqNo === data.compSeqNo
    );
    if (open) {
      expandedRows.splice(expandedRowIndex, 1);
    } else {
      expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };
  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader newEntityName="viewTransloading_PageTitle"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <RailTransloadingDetails
            railReceipt={this.state.railReceipt}
            railTransloading={this.state.railTransloading}
            selectedCompRow={this.state.selectedCompRow}
            dsCompartmentsBaseProduct={this.state.dsCompartmentsBaseProduct}
            dsTransloadingShipmentLoadingDetails={
              this.state.dsTransloadingShipmentLoadingDetails
            }
            dsTransloadingShipments={this.state.dsTransloadingShipments}
            railTransloadingAssociatedShipmentsColumns={
              this.state.railTransloadingAssociatedShipmentsColumns
            }
            railTransloadingDetailsColumns={
              this.state.railTransloadingDetailsColumns
            }
            handleRowSelectionChange={this.handleRowSelectionChange}
            setCurrentList={this.setCurrentList}
            onRowClick={this.handleRowClick}
            isSelect={this.state.isSelect}
            expandedRows={this.state.expandedRows}
            toggleExpand={this.toggleExpand}
          ></RailTransloadingDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <ErrorBoundary>
            <TranslationConsumer>
              {(t) => (
                <div className="row">
                  <div className="col col-2">
                    <Button
                      className="backButton"
                      onClick={this.props.onBack}
                      content={t("Back")}
                    ></Button>
                  </div>
                </div>
              )}
            </TranslationConsumer>
          </ErrorBoundary>
        </ErrorBoundary>
      </div>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

const mapReceiptToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapReceiptToProps
)(RailTransloadingDetailsComposite);

RailTransloadingDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  genericProps: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
