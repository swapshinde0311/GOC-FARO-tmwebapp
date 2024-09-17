import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUIInstallType } from "../../../JS/Constants";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { ShareholderInventorySummaryComposite } from "../Summary/ShareholderInventorySummaryComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import Error from "../../Error"
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";

class ShareholderInventoryComposite extends Component {
  state = {
    data: [],
    isEnable: true,
    isReadyToRender: false,
    noOfSignificantDigits: 0,

  }
  componentName = "ShareholderInventoryComponent";

  componentDidMount() {
    try {
      this.getLookUpData();
      this.getSignificantDigits();

    } catch (error) {
      console.log("ShareholderInventoryComposite:Error occured on ComponentDidMount", error);
    }
  }
  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=CustomerInventory",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isEnable = true;
          if (result.EntityResult.Enabled === "False") {
            isEnable = false;
          }
          this.setState({ isEnable });
          if (isEnable) {
            this.GetAllShareholderInventory();
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("ShareholderInventoryComposite: Error occurred on getLookUpData", error);
      });
  }
  getSignificantDigits() {
    try{
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Common",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult.NumberOfSignificantDigits !== undefined &&
            result.EntityResult.NumberOfSignificantDigits !== null) {
            this.setState({
              noOfSignificantDigits: Utilities.convertStringtoDecimal(result.EntityResult.NumberOfSignificantDigits),
            });
          }
        } else {
          console.log("Error in getSignificantDigits: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("ShareholderInventoryComposite: Error occurred on getSignificantDigits", error);
      });
    } catch (error) {
      console.log("Error occurred on getSignificantDigits", error);
    }
  }
  GetAllShareholderInventory = () => {
    try {
      axios(
        RestAPIs.GetAllShareholderInventory ,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          try {
            if (result.IsSuccess === true) {
              if (result.EntityResult !== null && result.EntityResult !== undefined) {
                let list = result.EntityResult;
                let noOfSignificantDigits = this.state.noOfSignificantDigits;
                if (Array.isArray(list.Table)) {
                  list.Table.forEach((item) => {
                    item.CustomerInventory_AvailableQty = item.CustomerInventory_AvailableQty !== null ?
                      Math.round(
                        item.CustomerInventory_AvailableQty
                      ).toFixed(noOfSignificantDigits) + " " + item.QuantityUOM : "0 " + item.QuantityUOM;
                    item.ContractInfo_LoadedQty = item.CustomerInventory_AvailableQty !== null ?
                      Math.round(
                        item.ContractInfo_LoadedQty
                      ).toFixed(noOfSignificantDigits) + " " + item.QuantityUOM : "0 " + item.QuantityUOM;
                    item.UnLoadingInfo_UnloadQuantity = item.UnLoadingInfo_UnloadQuantity !== null ?
                      Math.round(
                        item.UnLoadingInfo_UnloadQuantity
                      ).toFixed(noOfSignificantDigits) + " " + item.QuantityUOM : "0 " + item.QuantityUOM;
                    item.ProductAllocationItemInfo_BlockedQty = item.ProductAllocationItemInfo_BlockedQty !== null ?
                      Math.round(
                        item.ProductAllocationItemInfo_BlockedQty
                      ).toFixed(noOfSignificantDigits) + " " + item.QuantityUOM : "0 " + item.QuantityUOM;
                  })
                }
                this.setState({ data: list, isReadyToRender: true });
              }
            }
            else {
              this.setState({ data: [], isReadyToRender: true });
              console.log("Error in GetAllShareholderInventory:", result.ErrorList);
            }
          } catch (err) {
            console.log("Error in GetAllShareholderInventory:", err);
          } 
        }).catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while GetAllShareholderInventory:", error);
        });
    }
    catch (err) {
      console.log("Error in GetAllShareholderInventory:", err);
    }
  }
  render() {
    return (
      <div>
        {this.state.isEnable ? (
          <ErrorBoundary>
            <TMUserActionsComposite
              operationsVisibilty={this.state.operationsVisibilty}
              breadcrumbItem={this.props.activeItem}
              addVisible={false}
              deleteVisible={false}
              shrVisible={false}
              handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            ></TMUserActionsComposite>
          </ErrorBoundary>
        ) : ""}
        
        {this.state.isReadyToRender ? (
          <ErrorBoundary>
            <ShareholderInventorySummaryComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              exportRequired={true}
              exportFileName="ShareholderInventoryList"
              columnPickerRequired={true}
              parentComponent={this.componentName}
              columnGroupingRequired={true}
            >
            </ShareholderInventorySummaryComposite>
          </ErrorBoundary>
        ) : (<>
          {this.state.isEnable ? (
            <LoadingPage message="Loading"></LoadingPage>
          ) : (
            <Error errorMessage="CustomerInventoryFeatureNotEnabled"></Error>
          )}
        </>)
        }
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

export default connect(mapStateToProps)(ShareholderInventoryComposite);

ShareholderInventoryComposite.propTypes = {
  activeItem: PropTypes.object,
};
