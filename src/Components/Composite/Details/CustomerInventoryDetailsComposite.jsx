import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import { CustomerInventoryDetails } from "../../UIBase/Details/CustomerInventoryDetails";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
import { TRANTYPE_CUSTOMERTRANSFER } from "../../../JS/Constants";


class CustomerInventoryDetailsComposite extends Component {
    state = {
         isReadyToRender: false,
         inventorySummaryInfo:{},
         fromDate: new Date(),
         toDate: new Date(),
         dateError: "",
         closedReceipt: [],
         closedDispatch: [],
         activeDispatch:[],
        totalUnloadedQty: "",
        totalLoadedQty: "",
        totalBlockedQty: "",
    };
    
  componentDidMount() {
      try {
          this.getCustomerInventoryDetails();
    } catch (error) {
      console.log("CustomerInventoryDetailsComposite:Error occured on componentDidMount",error);
    }
    }
    
    getCustomerInventoryDetails() {
      try {
 let fromDate = new Date(this.state.fromDate);
      let toDate = new Date(this.state.toDate);
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);
let obj = {
        StartRange: fromDate,
        EndRange: toDate,
        BaseProductCode: this.props.baseproductCode,
        CustomerCode: this.props.customerCode,
        ShareholderCode: this.props.selectedShareholder,
      };
    axios(
      RestAPIs.GetCustomerInventoryDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
           var result = response.data;
          if (result.IsSuccess === true) {
              let summaryInfo = {};
              let closedReceipt = [];
              let closedDispatch = [];
              let activeDispatch = [];
              let totalUnloadedQty = 0;
              let totalLoadedQty = 0;
              let totalBlockedQty = 0;
              if (Array.isArray(result.EntityResult.Table)) {
                  summaryInfo = result.EntityResult.Table[0];
              }
               if (Array.isArray(result.EntityResult.Table1)) {
                   result.EntityResult.Table1.map(function (item) {
                        totalUnloadedQty += parseFloat(item.UnloadedQuantity);
                       item.UnloadedTime = new Date(item.UnloadedTime).toLocaleDateString();
                       item.PlannedQuantity = item.PlannedQuantity  + " " + item.QuantityUOM;
                       item.UnloadedQuantity = item.UnloadedQuantity + " " + item.QuantityUOM;
                       if (item.TransportationType === TRANTYPE_CUSTOMERTRANSFER)
                           item.ReceiptCode = item.ReceiptCode + " *";
                   })
                  closedReceipt = result.EntityResult.Table1;
              }
              if (Array.isArray(result.EntityResult.Table2)) {
                  result.EntityResult.Table2.map(function (item) {
                       totalLoadedQty += parseFloat(item.LoadedQuantity);
                       item.LoadedTime = new Date(item.LoadedTime).toLocaleDateString();
                       item.PlannedQuantity = item.PlannedQuantity + " " + item.QuantityUOM;
                       item.LoadedQuantity = item.LoadedQuantity + " " + item.QuantityUOM;
                       if (item.TransportationType === TRANTYPE_CUSTOMERTRANSFER)
                           item.DispatchCode = item.DispatchCode + " *";
                   })
                  closedDispatch = result.EntityResult.Table2;
              }
              if (Array.isArray(result.EntityResult.Table3)) {
                  result.EntityResult.Table3.map(function (item) {
                       totalBlockedQty += parseFloat(item.PlannedQuantity);
                       item.ScheduledDate = new Date(item.ScheduledDate).toLocaleDateString();
                       item.PlannedQuantity = item.PlannedQuantity + " " + item.QuantityUOM;
                   })
                  activeDispatch = result.EntityResult.Table3;
              }
               this.setState({ isReadyToRender: true,inventorySummaryInfo:summaryInfo,closedReceipt:closedReceipt,
                   closedDispatch: closedDispatch, activeDispatch: activeDispatch, totalUnloadedQty: totalUnloadedQty,
               totalLoadedQty:totalLoadedQty, totalBlockedQty:totalBlockedQty});
        } else {
           this.setState({ isReadyToRender: true,inventorySummaryInfo:[],closedReceipt:[],closedDispatch:[],activeDispatch:[] });
          console.log("Error in getCustomerInventoryDetails:", result.ErrorList);
        }
      }).catch((error) => {
        this.setState({ isReadyToRender: true,inventorySummaryInfo:[],closedReceipt:[],closedDispatch:[],activeDispatch:[] });
        console.log("Error while getCustomerInventoryDetails:", error);
      });
       } catch (error) {
        console.log("CustomerInventoryDetailsComposite:Error occured on getCustomerInventoryDetails",error);
      }
    }

     handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
    };
    
     handleDateTextChange = (value, error) => {
    if (value === "")
      this.setState({ dateError: "", toDate: "", fromDate: "" });
    if (error !== null && error !== "")
      this.setState({
        dateError: "Common_InvalidDate",
        toDate: "",
        fromDate: "",
      });
    else {
      this.setState({ dateError: "", toDate: value.to, fromDate: value.from });
    }
  };

    handleLoadInventory = () => {
        let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
        );
        if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "",isReadyToRender: false });
      this.getCustomerInventoryDetails();
    }
  }

    render() {
        return this.state.isReadyToRender ? (
            <div>
                <ErrorBoundary>
                    <CustomerInventoryDetails
                        customerCode={this.props.customerCode}
                        baseproductCode = {this.props.baseproductCode}
                        inventorySummaryInfo={this.state.inventorySummaryInfo}
                        dateRange = {{
                                from: this.state.fromDate,
                                to: this.state.toDate,
                        }}
                        dateError={this.state.dateError}
                        handleDateTextChange={this.handleDateTextChange}
                        handleRangeSelect={this.handleRangeSelect}
                        closedReceipt={this.state.closedReceipt}
                        closedDispatch={this.state.closedDispatch}
                        activeDispatch={this.state.activeDispatch}
                        handleLoadInventory={this.handleLoadInventory}
                        pageSize={this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize}
                        totalUnloadedQty={this.state.totalUnloadedQty}
                        totalLoadedQty={this.state.totalLoadedQty}
                        totalBlockedQty = {this.state.totalBlockedQty}
                    >
                    </CustomerInventoryDetails>
                    <div className="row">
              <div className="col col-lg-8" style={{ marginTop: "1%" }}>
                <TranslationConsumer>
                  {(t) => (
                    <Button
                      className="backButton"
                      onClick={this.props.onBack}
                      content={t("Back")}
                    ></Button>
                  )}
                </TranslationConsumer>
              </div>
            </div>
                </ErrorBoundary>
            </div>
        ): (
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

export default connect(mapStateToProps)(CustomerInventoryDetailsComposite);

CustomerInventoryDetailsComposite.propTypes = {
  noOfSignificantDigits :  PropTypes.number.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};