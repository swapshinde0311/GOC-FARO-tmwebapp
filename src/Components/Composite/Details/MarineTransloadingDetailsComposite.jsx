import React, { Component } from "react";
import { MarineTransloadingDetails } from "../../UIBase/Details/MarineTransloadingDetails";
import * as Utilities from "../../../JS/Utilities";
import {
  emptyMarineTransloading,
  emptyMarineReceipt,
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
  marineTransloadingDetailsColumns,
  marineTransloadingAssociatedShipmentsColumns,
} from "../../../JS/DetailsTableValidationDef";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { getKeyByValue } from "../../../JS/Utilities";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
class MarineTransloadingDetailsComposite extends Component {
  state = {
    marineReceipt: lodash.cloneDeep(emptyMarineReceipt),
    marineTransloading: lodash.cloneDeep(emptyMarineTransloading),
    modMarineReceipt: {},
    marineTransloadingAssociatedShipmentsColumns: lodash.cloneDeep(
      marineTransloadingAssociatedShipmentsColumns
    ),
    marineTransloadingDetailsColumns: lodash.cloneDeep(
      marineTransloadingDetailsColumns
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
    selectCompartmentCode: "",
    expandedRows: [],
  };
  handleRowSelectionChange = (e) => {
    this.setState({ selectedCompRow: e });
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
          if (selectCompartmentCode === element.CompartmentCode) {
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

  setCurrentList = (e, CompartmentCode) => {
    try {
      var marineTransloading = lodash.cloneDeep(this.state.marineTransloading);
      var marineReceipt = lodash.cloneDeep(this.state.marineReceipt);
      // marineTransloading.selectCompartment = {};
      var selectCompartmentCode = lodash.cloneDeep(
        this.state.selectCompartmentCode
      );
      if (selectCompartmentCode !== CompartmentCode) {
        marineTransloading.showLoadingDetails = false;

        marineReceipt.RailMarineReceiptCompartmentPlanList.forEach(
          (element) => {
            if (CompartmentCode === element.CompartmentCode) {
              marineTransloading.selectCompartment.CompartmentCode =
                element.CompartmentCode;
              marineTransloading.selectCompartment.CompartmentProduct =
                this.GetBaseProductForCompartment(
                  element.TrailerCode,
                  element.CompartmentCode
                );
              marineTransloading.selectCompartment.PlanQuantityUOM =
                element.PlanQuantityUOM;
              marineTransloading.selectCompartment.PlannedQuantity =
                element.PlannedQuantity.toLocaleString();
              if (
                element.UnloadedQuantityUOM !== undefined &&
                element.UnloadedQuantityUOM !== null
              )
                marineTransloading.selectCompartment.UnloadedQuantityUOM =
                  element.UnloadedQuantityUOM;
              else
                marineTransloading.selectCompartment.UnloadedQuantityUOM = "";
              if (
                element.UnloadedQuantity !== undefined &&
                element.UnloadedQuantity !== null
              )
                marineTransloading.selectCompartment.UnloadedQuantity =
                  element.UnloadedQuantity.toLocaleString();
              else marineTransloading.selectCompartment.UnloadedQuantity = "0";
              marineTransloading.selectCompartment.ReceiptCompartmentStatus =
                getKeyByValue(
                  Constants.ReceiptCompartmentStatus,
                  element.ReceiptCompartmentStatus
                );
              this.setState({
                isSelect: Number(e.currentTarget.getAttribute("index")),
                marineTransloading,
                selectCompartmentCode: CompartmentCode,
              });
              this.getReceiptShipments(
                element.TrailerCode,
                element.ReceiptCode,
                element.CompartmentCode,
                marineTransloading
              );
            }
          }
        );
      }
    } catch (error) {
      console.log(
        "MarineTransloadingDetailsComposite:Error occured on setCurrentList",
        error
      );
    }
  };
  getReceiptShipments = (
    TrailerCode,
    ReceiptCode,
    CompartmentCode,
    marineTransloading
  ) => {
    try {
      var dsTransloadingShipments = [];
      this.setState({
        dsTransloadingShipments: dsTransloadingShipments,
        marineTransloading,
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
              marineTransloading.showShipment = true;
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
                marineTransloading: marineTransloading,
                isReadyToRender: true,
              });
            }
          } else {
            marineTransloading.showShipment = false;
            this.setState({
              dsTransloadingShipments: dsTransloadingShipments,
              marineTransloading: marineTransloading,
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
        "GetTransloadingShipments:Error occured on GetTransloadingShipments",
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
      var marineTransloading = lodash.cloneDeep(this.state.marineTransloading);
      var dsTransloadingShipments = lodash.cloneDeep(
        this.state.dsTransloadingShipments
      );
      var dsTransloadingShipmentLoadingDetails = lodash.cloneDeep(
        this.state.dsTransloadingShipmentLoadingDetails
      );

      this.setState({
        dsTransloadingShipmentLoadingDetails:
          dsTransloadingShipmentLoadingDetails,
        marineTransloading: marineTransloading,
        dsTransloadingShipments: dsTransloadingShipments,
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
              marineTransloading.showLoadingDetails = true;
              this.setState({
                dsTransloadingShipmentLoadingDetails:
                  dsTransloadingShipmentLoadingDetails,
                marineTransloading: marineTransloading,
                isReadyToRender: true,
              });
            }
          } else {
            marineTransloading.showLoadingDetails = false;
            this.setState({
              dsTransloadingShipmentLoadingDetails:
                dsTransloadingShipmentLoadingDetails,
              marineTransloading: marineTransloading,
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
        "GetShipmentLoadingDetails:Error occured on GetShipmentLoadingDetails",
        error
      );
    }
  }
  //
  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.marineReceipt.ReceiptCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined
      )
        this.GetTransloadingReceiptCompartments(nextProps.selectedRow);
    } catch (error) {
      console.log(
        "MarineTransloadingDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  //
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetCompartmentsBaseProducts(this.props.selectedRow.ReceiptCode);
      //this.getMarineReceipt(this.props.selectedRow.ReceiptCode);
    } catch (error) {
      console.log(
        "MarineTransloadingDetailsComposite:Error occured on componentDidMount",
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
    emptyMarineTransloading.TransportationType = transportationType;
    var listOptions = lodash.cloneDeep(this.state.listOptions);
    emptyMarineTransloading.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.QuantityUOM;
    emptyMarineTransloading.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    if (ReceiptCode === undefined) {
      this.setState({
        marineTransloading: { ...emptyMarineTransloading },
        modmarineTransloading: { ...emptyMarineTransloading },
        listOptions,
        isReadyToRender: true,
      });
      return;
    }
    axios(
      RestAPIs.GetCompartmentsBaseProducts +
        "?ReceiptCode=" +
        ReceiptCode +
        "&TransportationType=MARINE",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var marineTransloading = lodash.cloneDeep(
            this.state.marineTransloading
          );
          var dsCompartmentsBaseProduct = lodash.cloneDeep(
            result.EntityResult.Table
          );
          if (
            Array.isArray(dsCompartmentsBaseProduct) &&
            dsCompartmentsBaseProduct.length > 0
          ) {
            dsCompartmentsBaseProduct.forEach((element) => {
              if (element.IsTransloading) {
                if (marineTransloading.lstCompartmentBPs.length === 0)
                  marineTransloading.lstCompartmentBPs.push(
                    element.BaseProductCode
                  );
                if (
                  marineTransloading.lstCompartmentBPs.filter((com, cindex) => {
                    return com.BaseProductCode !== element.BaseProductCode;
                  }).length === 0
                ) {
                  marineTransloading.lstCompartmentBPs.push(
                    element.BaseProductCode
                  );
                }
              }
            });
            
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

            marineTransloading.NoOfProducts = ltCompartmentBPs.length;

            marineTransloading.PlanQuantityUOM =
              dsCompartmentsBaseProduct[0].PlanQuantityUOM;
            if (
              dsCompartmentsBaseProduct[0].UnloadedQuantityUOM !== undefined &&
              dsCompartmentsBaseProduct[0].UnloadedQuantityUOM !== null
            )
              marineTransloading.UnloadedQuantityUOM =
                dsCompartmentsBaseProduct[0].UnloadedQuantityUOM;
            else
              marineTransloading.UnloadedQuantityUOM =
                dsCompartmentsBaseProduct[0].PlanQuantityUOM;
          }
          this.setState({
            isReadyToRender: true,
            marineTransloading: lodash.cloneDeep(marineTransloading),
            dsCompartmentsBaseProduct: lodash.cloneDeep(
              dsCompartmentsBaseProduct
            ),
          });
          this.getMarineReceipt(ReceiptCode);
        } else {
          this.setState({
            marineTransloading: lodash.cloneDeep(emptyMarineTransloading),
            modmarineTransloading: lodash.cloneDeep(emptyMarineTransloading),
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

  getMarineReceipt(ReceiptCode) {
    var transportationType = this.getTransportationType();
    emptyMarineTransloading.TransportationType = transportationType;
    emptyMarineTransloading.Active = true;
    emptyMarineTransloading.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.QuantityUOM;
    emptyMarineTransloading.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    var keyCode = [
      {
        key: KeyCodes.marineReceiptCode,
        value: ReceiptCode,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.marineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetMarineReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var marineTransloading = lodash.cloneDeep(
            this.state.marineTransloading
          );
          let marineReceipt = result.EntityResult;
          if (
            this.props.selectedRow != null &&
            this.props.selectedRow != undefined
          ) {
            marineReceipt.ReceiptStatus = this.props.selectedRow.ReceiptStatus;
          }

          if (
            marineReceipt != null &&
            marineReceipt.RailMarineReceiptCompartmentPlanList != null
          ) {
            marineReceipt.RailMarineReceiptCompartmentPlanList.forEach((rc) => {
              if (
                rc.IsTransloading !== null &&
                rc.IsTransloading !== "" &&
                rc.IsTransloading
              ) {
                var compartBP =
                  rc.CompartmentCode +
                  "(" +
                  this.GetBaseProductForCompartment(
                    rc.TrailerCode,
                    rc.CompartmentCode
                  ) +
                  ")";
                marineTransloading.lstCompartmentList.push({
                  compartBP: compartBP,
                  CompartmentCode: rc.CompartmentCode,
                });

                marineTransloading.totalNoOfTransWagons += 1;
                marineTransloading.totalPlannedQtyForTransloadingWagons +=
                  rc.PlannedQuantity;
                if (
                  rc.UnloadedQuantity !== undefined &&
                  rc.UnloadedQuantity !== null
                ) {
                  marineTransloading.totalUnloadedQtyForTransloadingWagons +=
                    rc.UnloadedQuantity;
                }
              }
              marineTransloading.receiptPlannedQty += rc.PlannedQuantity;
            });
          }
          this.setState({
            isReadyToRender: true,
            marineReceipt: lodash.cloneDeep(result.EntityResult),
            marineTransloading: lodash.cloneDeep(marineTransloading),
          });
        } else {
          this.setState({
            marineReceipt: lodash.cloneDeep(emptyMarineTransloading),
            modMarineReceipt: lodash.cloneDeep(emptyMarineTransloading),
            isReadyToRender: true,
          });
          console.log("Error in getMarineReceipt:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting marineReceipt:", error);
        //throw error;
      });
  }

  GetBaseProductForCompartment(trailerCode, Compcode) {
    let bp = "";
    var dsCompartmentsBaseProduct = lodash.cloneDeep(
      this.state.dsCompartmentsBaseProduct
    );
    if (
      Array.isArray(dsCompartmentsBaseProduct) &&
      dsCompartmentsBaseProduct.length > 0
    ) {
      var dataRows = dsCompartmentsBaseProduct.filter((com, cindex) => {
        return (
          com.TrailerCode === trailerCode && com.CompartmentCode === Compcode
        );
      });
      if (dataRows !== undefined && dataRows.length > 0) {
        bp = dataRows[0].BaseProductCode;
      }
    }
    return bp;
  }

  getTransportationType() {
    var transportationType = Constants.TransportationType.MARINE;
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
        "MarineTransloadingDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader newEntityName="viewTransloading_PageTitle"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <MarineTransloadingDetails
            marineReceipt={this.state.marineReceipt}
            marineTransloading={this.state.marineTransloading}
            selectedCompRow={this.state.selectedCompRow}
            dsCompartmentsBaseProduct={this.state.dsCompartmentsBaseProduct}
            dsTransloadingShipmentLoadingDetails={
              this.state.dsTransloadingShipmentLoadingDetails
            }
            dsTransloadingShipments={this.state.dsTransloadingShipments}
            marineTransloadingAssociatedShipmentsColumns={
              this.state.marineTransloadingAssociatedShipmentsColumns
            }
            marineTransloadingDetailsColumns={
              this.state.marineTransloadingDetailsColumns
            }
            handleRowSelectionChange={this.handleRowSelectionChange}
            onRowClick={this.handleRowClick}
            setCurrentList={this.setCurrentList}
            isSelect={this.state.isSelect}
            expandedRows={this.state.expandedRows}
            toggleExpand={this.toggleExpand}
          ></MarineTransloadingDetails>
        </ErrorBoundary>
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
)(MarineTransloadingDetailsComposite);

MarineTransloadingDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  genericProps: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
