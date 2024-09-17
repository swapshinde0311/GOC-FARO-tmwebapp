import React, { Component } from "react";
import { RailReceiptRecordWeightDetails } from "../../UIBase/Details/RailReceiptRecordWeightDetails";
import { emptyRailReceipt } from "../../../JS/DefaultEntities";
import { TranslationConsumer } from "@scuf/localization";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import { Button } from "@scuf/common";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { railRecordWeightDef } from "../../../JS/DetailsTableValidationDef";
class RailReceiptRecordWeightDetailsComposite extends Component {
  state = {
    modRailWagon: {},
    isReadyToRender: true,
    selectedWagonRow: [],
    modWeighBridgeData: [],
    modRailReceipt: {},
    WeighBridges: [],
    WeighBridgesWithUOM: [],
  };
  componentWillReceiveProps(nextProps) {
    try {
      // this.setState({modRailReceipt:lodash.cloneDeep(this.props.RailReceipt)});
      //this.getRailReceipt(nextProps.selectedRow);
    } catch (error) {
      console.log(
        "RailReceiptRecordWeightComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  getShareholder() {
    return this.props.shareholderCode;
  }
  getRailReceipt(selectedRow) {
    var transportationType = this.getTransportationType();
    emptyRailReceipt.TransportationType = transportationType;

    if (selectedRow.Common_Code === undefined) {
      this.setState({
        modRailReceipt: { ...emptyRailReceipt },
        modWeighBridgeData: [],
        isReadyToRender: true,
      });
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.shareholderCode,
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
          this.setState({
            isReadyToRender: true,
            modRailReceipt: lodash.cloneDeep(result.EntityResult),

            saveEnabled: false,
          });
        } else {
          this.setState({
            modRailReceipt: lodash.cloneDeep(emptyRailReceipt),
            isReadyToRender: true,
          });
          console.log("Error in GetRailReceipt:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railReceipt:", error);
      });
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getRailReceipt(this.props.selectedRow);
      this.GetWeightBridgeCodes();
      this.GetRailMarineDispatchReceiptWeighBridgeData();
    } catch (error) {
      console.log(
        "RailReceiptRecordWeightComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  GetWeightBridgeCodes() {
    axios(
      RestAPIs.GetWeightBridgeData +
        "?Transportationtype=" +
        Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            var WeighBridges = [];

            result.EntityResult.Table.forEach((element) => {
              WeighBridges.push({ text: element.Code, value: element.Code });
            });
            this.setState({
              WeighBridges: WeighBridges,
              WeighBridgesWithUOM: result.EntityResult.Table,
            });
          }
        } else {
          this.setState({ WeighBridges: [], WeighBridgesWithUOM: [] });
          console.log("Error in GetWeightBridgeData:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while GetWeightBridgeData List:", error);
      });
  }

  GetRailMarineDispatchReceiptWeighBridgeData() {
    var transportationType = this.getTransportationType();
    var keyCode = [
      {
        key: "TransactionType",
        value: "Receipt",
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
      {
        key: "DispatchReceiptCode",
        value: this.props.selectedRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.getShareholder(),
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailMarineDispatchReceiptWeighBridgeData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isReadyToRender: true,
            modWeighBridgeData: result.EntityResult.Table,
            saveEnabled: false,
          });
        } else {
          this.setState({
            isReadyToRender: true,
            modWeighBridgeData: [],
            saveEnabled: false,
          });
          console.log(
            "Error in GetRailMarineDispatchReceiptWeighBridgeData:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting GetRailMarineDispatchReceiptWeighBridgeData:",
          error
        );
      });
  }

  getTransportationType() {
    var transportationType = Constants.TransportationType.RAIL;
    return transportationType;
  }

  handleDateTextChange = (propertyName, value, error) => {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      const modWeighBridgeData = lodash.cloneDeep(this.state.modWeighBridgeData);
      validationErrors[propertyName] = error;
      modWeighBridgeData[propertyName] = value;
      this.setState({ validationErrors, modWeighBridgeData });
    } catch (error) {
      console.log(
        "Error in RailReceiptRecordDetailsComposite: Error occurred on handleDateTextChange",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modWeighBridgeData = lodash.cloneDeep(this.state.modWeighBridgeData);

    if (cellData.field === "TareWeightWeightBridgeCode") {
      let WeighBridgesWithUOM = this.state.WeighBridgesWithUOM;
      WeighBridgesWithUOM.forEach((element) => {
        if (element.Code === newVal) {
          modWeighBridgeData[cellData.rowIndex]["TareWeightUOM"] =
            element.WeightUOM;
          return;
        }
      });
    }
    if (cellData.field === "LadenWeightWeightBridgeCode") {
      let WeighBridgesWithUOM = this.state.WeighBridgesWithUOM;
      WeighBridgesWithUOM.forEach((element) => {
        if (element.Code === newVal) {
          modWeighBridgeData[cellData.rowIndex]["LadenWeightUOM"] =
            element.WeightUOM;
          return;
        }
      });
    }

    modWeighBridgeData[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ modWeighBridgeData });
  };

  validateSave() {
    let notification = {
      messageType: "critical",
      message: "ViewRailReceipt_RecordWeight_status",
      messageResultDetails: [],
    };
    if (
      Array.isArray(this.state.modWeighBridgeData) &&
      this.state.modWeighBridgeData.length > 0
    ) {
      this.state.modWeighBridgeData.forEach((compart) => {
        railRecordWeightDef.forEach((col) => {
          let err = "";

          if (col.validator !== undefined) {
            err = Utilities.validateField(col.validator, compart[col.field]);
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: err,
            });
          }
        });
      });
    } else {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_RAIL_RECEIPT_WAGON_WEIGHBRIDGE_INFO_EMPTY",
      });
    }
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modRailReceipt, "update", notification);
      return false;
    }
    return true;
  }

  fillDetails() {
    try {
      let modWeighBridgeData = lodash.cloneDeep(this.state.modWeighBridgeData);
      let i = 0;
      modWeighBridgeData.forEach((e) => {
        if (e.LadenWeight !== null && e.LadenWeight !== "")
          modWeighBridgeData[i].LadenWeight = e.LadenWeight.toLocaleString();
        if (e.TareWeight !== null && e.TareWeight !== "")
          modWeighBridgeData[i].TareWeight = e.TareWeight.toLocaleString();
        if (e.maxTolLadenWeight !== null && e.maxTolLadenWeight !== "")
          modWeighBridgeData[
            i
          ].maxTolLadenWeight = e.maxTolLadenWeight.toLocaleString();
        if (e.maxTolTareWeight !== null && e.maxTolTareWeight !== "")
          modWeighBridgeData[
            i
          ].maxTolTareWeight = e.maxTolTareWeight.toLocaleString();
        if (e.minTolLadenWeight !== null && e.minTolLadenWeight !== "")
          modWeighBridgeData[
            i
          ].minTolLadenWeight = e.minTolLadenWeight.toLocaleString();
        if (e.minTolTareWeight !== null && e.minTolTareWeight !== "")
          modWeighBridgeData[
            i
          ].minTolTareWeight = e.minTolTareWeight.toLocaleString();
      });
      //attributeList = Utilities.attributesConverttoLocaleString(attributeList);
      this.setState({ modWeighBridgeData });
      return modWeighBridgeData;
    } catch (error) {
      console.log(
        "RailReceiptRecordWeightDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }
  handleRecordWeight = () => {
    let modWeighBridgeData = this.fillDetails();
    if (!this.validateSave()) {
      return;
    }
    let lstReceiptTrailerWeighBridgeInfo = [];
    let wagonCode = "";
    let tareweightBridgeCode = "";
    let ladenweightBridgeCode = "";

    let notification = {
      messageType: "critical",
      message: "ViewRailReceipt_RecordWeight_status",
      messageResultDetails: [],
    };
    modWeighBridgeData.forEach((weighbridgeinfo) => {
      tareweightBridgeCode = "";
      ladenweightBridgeCode = "";

      let dblTareWeight = 0.0;
      let dblLadenWeight = 0.0;
      wagonCode = weighbridgeinfo.WagonCode;

      if (
        weighbridgeinfo.TareWeight !== null &&
        weighbridgeinfo.TareWeight !== undefined &&
        weighbridgeinfo.TareWeight !== ""
      ) {
        dblTareWeight = Utilities.convertStringtoDecimal(
          weighbridgeinfo.TareWeight
        );
        if (dblTareWeight < 0.0) {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "Tareweight_Cannot_Be_less_than_Zero",
          });
        }
      }

     
    
      
      if (
        weighbridgeinfo.LadenWeight !== null &&
        weighbridgeinfo.LadenWeight !== undefined &&
        weighbridgeinfo.LadenWeight !== ""
      ) {
        dblLadenWeight = Utilities.convertStringtoDecimal(
          weighbridgeinfo.LadenWeight
        );
        if (dblLadenWeight < 0.0) {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "ladenweight_Cannot_Be_less_than_Zero",
          });
        }
      }

      if (
        weighbridgeinfo.TareWeightWeightBridgeCode !== null &&
        weighbridgeinfo.TareWeightWeightBridgeCode !== undefined &&
        weighbridgeinfo.TareWeightWeightBridgeCode !== ""
      ) {
        tareweightBridgeCode = weighbridgeinfo.TareWeightWeightBridgeCode;
      }
      if (
        weighbridgeinfo.LadenWeightWeightBridgeCode !== null &&
        weighbridgeinfo.LadenWeightWeightBridgeCode !== undefined &&
        weighbridgeinfo.LadenWeightWeightBridgeCode !== ""
      ) {
        ladenweightBridgeCode = weighbridgeinfo.LadenWeightWeightBridgeCode;
      }

      if (dblTareWeight > 0.0 && tareweightBridgeCode === "") {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "ViewReceipt_WBMandatory",
        });
      }
      if (dblLadenWeight > 0.0 && ladenweightBridgeCode === "") {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "ViewReceipt_WBMandatory",
        });
      }

      if (
        weighbridgeinfo.StartTime >= weighbridgeinfo.EndTime
      ) {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "MarineReceiptManualEntry_ErrorUnloadTime",
          });
      }
      

      if (notification.messageResultDetails.length > 0) {
        this.props.onSaved(this.state.modRailReceipt, "update", notification);
        return false;
      }

      if (dblTareWeight > 0.0) {
        let receiptTrailerWeighBridgeInfo = {};
        receiptTrailerWeighBridgeInfo.ReceiptCode = this.state.modRailReceipt.ReceiptCode;
        receiptTrailerWeighBridgeInfo.TrailerCode = wagonCode;
        receiptTrailerWeighBridgeInfo.MeasuredWeight = dblTareWeight;
        receiptTrailerWeighBridgeInfo.MeasuredWeightTime = new Date();
        receiptTrailerWeighBridgeInfo.IsTareWeight = true;
        receiptTrailerWeighBridgeInfo.IsOperatorOverWritable =
          weighbridgeinfo.TareWeightOperatorOverWritten;
        receiptTrailerWeighBridgeInfo.WeighbridgeCode = tareweightBridgeCode;
        receiptTrailerWeighBridgeInfo.WeightUOM = weighbridgeinfo.TareWeightUOM;
        receiptTrailerWeighBridgeInfo.ShareholderCode = this.getShareholder();
        receiptTrailerWeighBridgeInfo.StartTime= weighbridgeinfo.StartTime;
        receiptTrailerWeighBridgeInfo.EndTime= weighbridgeinfo.EndTime;
        lstReceiptTrailerWeighBridgeInfo.push(receiptTrailerWeighBridgeInfo);
      }
      if (dblLadenWeight > 0.0) {
        let receiptTrailerWeighBridgeLadenInfo = {};
        receiptTrailerWeighBridgeLadenInfo.ReceiptCode = this.state.modRailReceipt.ReceiptCode;
        receiptTrailerWeighBridgeLadenInfo.TrailerCode = wagonCode;
        receiptTrailerWeighBridgeLadenInfo.MeasuredWeight = dblLadenWeight;
        receiptTrailerWeighBridgeLadenInfo.MeasuredWeightTime = new Date();
        receiptTrailerWeighBridgeLadenInfo.IsTareWeight = false;
        receiptTrailerWeighBridgeLadenInfo.IsOperatorOverWritable =
          weighbridgeinfo.LadenWeightOperatorOverWritten;
        receiptTrailerWeighBridgeLadenInfo.WeighbridgeCode = ladenweightBridgeCode;
        receiptTrailerWeighBridgeLadenInfo.WeightUOM =
          weighbridgeinfo.LadenWeightUOM;
          receiptTrailerWeighBridgeLadenInfo.StartTime= weighbridgeinfo.StartTime
          receiptTrailerWeighBridgeLadenInfo.EndTime= weighbridgeinfo.EndTime
        receiptTrailerWeighBridgeLadenInfo.ShareholderCode = this.getShareholder();
        lstReceiptTrailerWeighBridgeInfo.push(
          receiptTrailerWeighBridgeLadenInfo
        );
      }
    });
    if (lstReceiptTrailerWeighBridgeInfo.length === 0) {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_RAIL_RECEIPT_WAGON_WEIGHBRIDGE_INFO_EMPTY",
      });
      this.props.onSaved(this.state.modRailReceipt, "update", notification);
      return false;
    }
    var obj = {
      ShareHolderCode: this.props.shareholderCode,
      Entity: lstReceiptTrailerWeighBridgeInfo,
    };
    notification = {
      messageType: "critical",
      message: "ViewRailReceipt_RecordWeight_status",
      messageResultDetails: [
        {
          keyFields: ["RailReceiptManualEntry_ReceiptCode"],
          keyValues: [this.state.modRailReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.RailReceiptRecordWeight,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === false) {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in RailReceiptRecordWeight:", result.ErrorList);
        }
        this.props.onSaved(this.state.modRailReceipt, "add", notification);
      })
      .catch((error) => {
        console.log("Error while getting RailReceiptRecordWeight:", error);
      });
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      this.setState({
        isWagonDetail: "false",
        isRDetails: "true",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "RailReceiptViewAllComposite:Error occured on Back click",
        error
      );
    }
  };

  render() {
    const popUpContents = [
      {
        fieldName: "RailWagonConfigurationDetails_LastUpdatedTime",
        fieldValue:
          new Date(
            this.state.modRailWagon.LastUpdateTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modRailWagon.LastUpdateTime).toLocaleTimeString(),
      },
      {
        fieldName: "RailWagonConfigurationDetails_LastActiveTime",
        fieldValue:
          this.state.modRailWagon.LastActiveTime !== undefined &&
          this.state.modRailWagon.LastActiveTime !== null
            ? new Date(
                this.state.modRailWagon.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modRailWagon.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "RailWagonConfigurationDetails_CreatedTime",
        fieldValue:
          new Date(this.state.modRailWagon.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modRailWagon.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        {
          <div>
            <ErrorBoundary>
              <TMDetailsHeader
                newEntityName="ViewRailReceiptsDetails_PageTitle"
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            </ErrorBoundary>
            <ErrorBoundary>
              <RailReceiptRecordWeightDetails
                modRailReceipt={this.state.modRailReceipt}
                modWeighBridgeData={this.state.modWeighBridgeData}
                listOptions={{ WeighBridges: this.state.WeighBridges }}
                handleRecordWeight={this.handleRecordWeight}
                handleCellDataEdit={this.handleCellDataEdit}
                onDateTextChange={this.handleDateTextChange}
              ></RailReceiptRecordWeightDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              <TranslationConsumer>
                {(t) => (
                  <div className="row">
                    <div className="col col-lg-8">
                      <Button
                        className="backButton"
                        onClick={this.props.handleBack}
                        content={t("Back")}
                      ></Button>
                    </div>
                    <div
                      className="col col-lg-4"
                      style={{ textAlign: "right" }}
                    >
                      <Button
                        content={t("btnRecordWeight")}
                        className="saveButton"
                        onClick={this.handleRecordWeight}
                      ></Button>
                    </div>
                  </div>
                )}
              </TranslationConsumer>
            </ErrorBoundary>
          </div>
        }
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

const mapWagonToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapWagonToProps
)(RailReceiptRecordWeightDetailsComposite);

RailReceiptRecordWeightDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  shareholderCode: PropTypes.string.isRequired,
};
