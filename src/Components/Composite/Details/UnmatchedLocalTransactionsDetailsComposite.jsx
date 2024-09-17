import React, { Component } from "react";
import { UnmatchedLocalTransactionsDetails } from "../../UIBase/Details/UnmatchedLocalTransactionsDetails";

import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import * as KeyCodes from "./../../../JS/KeyCodes";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";

class UnmatchedLocalTransactionsDetailsComposite extends Component {
  state = {
    batchDetailsList: [],
    isReadyToRender: false,
    transportationTypeOptions: [],
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getBatchDetails(this.props.selectedRow);
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occurred on componentDidMount",
        error
      );
    }
  }

  getBatchDetails(transaction) {
    const keyCode = [
      {
        key: KeyCodes.bcuCode,
        value: transaction.BCU_Code,
      },
      {
        key: KeyCodes.TransactionNumber,
        value: transaction.RailDispatchManualEntry_TransactionNo,
      },
      {
        key: KeyCodes.BatchNumber,
        value: transaction.UnmatchedLocalTrans_BatchNo,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetBatchDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          const batchDetailsList = this.getBatchDetailsForUI(
            result.EntityResult
          );
          this.setState({ batchDetailsList, isReadyToRender: true });
        } else {
          this.setState({ batchDetailsList: [], isReadyToRender: true });
        }
      })
      .catch((error) => {
        console.log("Error while getting GetLocalTransactions:", error);
      });
  }

  getBatchDetailsForUI(loadingInfoList) {
    let detailList = [];
    try {
      let recordID = 1;
      loadingInfoList.forEach((loadingInfo) => {
        detailList.push(
          this.getBatchInfoFromLoadingDetails(
            loadingInfo.LoadingDetailFPinfo,
            0 /*ProductTypeForUI.FinishedProduct*/,
            recordID++
          )
        );
        if (
          loadingInfo.ArrLoadingDetailBP !== null &&
          loadingInfo.ArrLoadingDetailBP !== undefined &&
          Array.isArray(loadingInfo.ArrLoadingDetailBP)
        ) {
          loadingInfo.ArrLoadingDetailBP.forEach((baseProductInfo) => {
            detailList.push(
              this.getBatchInfoFromLoadingDetails(
                baseProductInfo,
                1 /*ProductTypeForUI.BaseProduct*/,
                recordID++
              )
            );
          });
        }
        if (
          loadingInfo.ArrLoadingDetailAdditive !== null &&
          loadingInfo.ArrLoadingDetailAdditive !== undefined &&
          Array.isArray(loadingInfo.ArrLoadingDetailAdditive)
        ) {
          loadingInfo.ArrLoadingDetailAdditive.forEach((additiveInfo) => {
            detailList.push(
              this.getBatchInfoFromLoadingDetails(
                additiveInfo,
                2 /*ProductTypeForUI.Additive*/,
                recordID++
              )
            );
          });
        }
      });
    } catch (error) {
      console.log("Error while getting GetBatchDetailsForUI:", error);
    }
    return detailList;
  }

  getBatchInfoFromLoadingDetails(loading, productType, recordID) {
    const batchInfo = {
      ID: recordID,
      ProductCode: "",
      ProductType: "",
      TankCode: "",
      MeterCode: loading.MeterCode,
      GrossQuantity:
        loading.GrossQuantity === null
          ? "0 " + loading.QuantityUOM
          : loading.GrossQuantity.toLocaleString() + " " + loading.QuantityUOM,
      NetQuantity:
        loading.NetQuantity === null
          ? "0 " + loading.QuantityUOM
          : loading.NetQuantity.toLocaleString() + " " + loading.QuantityUOM,
      StartTotalizer:
        loading.StartTotalizer === null
          ? ""
          : loading.StartTotalizer.toLocaleString(),
      EndTotalizer:
        loading.EndTotalizer === null
          ? ""
          : loading.EndTotalizer.toLocaleString(),
      Density:
        loading.ProductDensity === null
          ? ""
          : loading.ProductDensity.toLocaleString() +
            " " +
            loading.ProductDensityUOM,
      Pressure:
        loading.Pressure === null
          ? ""
          : loading.Pressure.toLocaleString() + " " + loading.PressureUOM,
      Temperature:
        loading.Temperature === null
          ? ""
          : loading.Temperature.toLocaleString() + " " + loading.TemperatureUOM,
      StartTime: loading.StartTime,
      EndTime: loading.EndTime,
    };
    switch (productType) {
      case 0: //ProductTypeForUI.FinishedProduct:
        batchInfo.ProductCode = loading.FinishedProductCode;
        batchInfo.ProductType = "RailDispatchManualEntry_FinishedProduct";
        break;

      case 1: //ProductTypeForUI.BaseProduct:
        batchInfo.ProductCode = loading.BaseProductCode;
        batchInfo.ProductType = "Report_BaseProduct";
        break;

      case 2: //ProductTypeForUI.Additive:
        batchInfo.ProductCode = loading.AdditiveProductCode;
        batchInfo.ProductType = "ViewShipment_Additive";
        break;

      default:
        break;
    }
    return batchInfo;
  }

  handleChange = (propertyName, data) => {
    try {
      const localData = lodash.cloneDeep(this.state.localData);
      localData[propertyName] = data;
    } catch (error) {
      console.log(
        "UnmatchedLocalTransactionsDetailsComposite: Error occurred on handleChange",
        error
      );
    }
  };

  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader newEntityName="LocalTransactions_BatchDetails"></TMDetailsHeader>
        </ErrorBoundary>

        <ErrorBoundary>
          <UnmatchedLocalTransactionsDetails
            batchDetailsList={this.state.batchDetailsList}
          />
        </ErrorBoundary>

        <TranslationConsumer>
          {(t) => (
            <div className="row">
              <div className="col col-lg-8">
                <Button
                  className="backButton"
                  onClick={this.props.onBack}
                  content={t("Back")}
                ></Button>
              </div>
            </div>
          )}
        </TranslationConsumer>
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

export default connect(mapStateToProps)(
  UnmatchedLocalTransactionsDetailsComposite
);
