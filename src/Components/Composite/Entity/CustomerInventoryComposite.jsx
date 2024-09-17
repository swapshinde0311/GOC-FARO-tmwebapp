import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { CustomerInventorySummaryComposite } from "../Summary/CustomerInventorySummaryComposite";
import  CustomerInventoryDetailsComposite from "../Details/CustomerInventoryDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import Error from "../../Error";

const pageSize = 6;
class CustomerInventoryComposite extends Component {
  state = {
    data:[],
    selectedShareholder: "",
    customerCode: "",
    baseproductCode:"",
    isReadyToRender: false,
    isDetails: "false",
    operationsVisibilty: { shareholder: true },
    searchResult: "",
    noOfSignificantDigits: 0,
    isEnable: true,
    pageIndex: 1,
  }

  componentDidMount() {
    try {
       this.getLookUpData();
      this.setState({ selectedShareholder: this.props.userDetails.EntityResult.PrimaryShareholder });
      this.getSignificantDigits();
      
    } catch (error) {
      console.log("CustomerInventoryComposite:Error occured on ComponentDidMount",error);
    }
  }
  getCustomerInventoryList(shareholder) {
     axios(
        RestAPIs.GetCustomerInventoryList + "?ShareholderCode=" + shareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
       .then((response) => {
          let noOfSignificantDigits = lodash.cloneDeep(this.state.noOfSignificantDigits)
          var result = response.data;
         if (result.IsSuccess === true) {
           if (Array.isArray(result.EntityResult)) {
             result.EntityResult.map(function (product) {
               product.ProductList.map(function(item) {
                 item.Quantity = Math.round(item.Quantity, noOfSignificantDigits).toString()+" "+item.QuantityUOM;
               })
             })
                this.setState({ data: result.EntityResult, isReadyToRender: true });
            }
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getCustomerInventoryList:", result.ErrorList);
          }
        }) .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getCustomerInventoryList:", error);
        });
  }

   handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({ selectedShareholder: shareholder,isReadyToRender: false});
      this.getCustomerInventoryList(shareholder);
    } catch (error) {
      console.log(
        "CustomerInventoryComposite:Error occured on handleShareholderSelectionChange",error);
    }
  };

  detailsExpand = (customerCode, data) => {
    var { operationsVisibilty } = { ...this.state };
     operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        customerCode: customerCode,
        baseproductCode: data.rowData.BaseProductCode,
        operationsVisibilty
      });
  }

   handleSearchChange = lodash.debounce((value) => {
    const searchResult = value;
    this.setState({ searchResult });
  },100
  )

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
       operationsVisibilty.shareholder = true;
        this.setState({
        isDetails: "false",
        isReadyToRender: false,
      });
      this.getCustomerInventoryList(this.state.selectedShareholder);
    } catch (error) {
      console.log("CustomerInventoryComposite:Error occured on handleBack", error);
    }
  }

   getSignificantDigits() {
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
          console.log("CustomerInventoryComposite: Error occurred on getSignificantDigits",error);
        });
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
            this.getCustomerInventoryList(this.props.userDetails.EntityResult.PrimaryShareholder);
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("CustomerInventoryComposite: Error occurred on getLookUpData",error);
      });
  }
  
  pageChange = (page) => {
    this.setState({ pageIndex: page });
  }

  render() {
    let { searchResult, data } = this.state;
    let searchResults = data.filter(values => {
      return values.CustomerCode.toLowerCase().includes(searchResult.toLowerCase()) || values.ProductList.some(function (subElement) {
        return subElement.BaseProductCode.toLowerCase().includes(searchResult.toLowerCase())
      });
    });

    let customerInventoryData = [];
     let pageIndex = lodash.cloneDeep(this.state.pageIndex);
    if (pageSize >= searchResults.length) {
      pageIndex = 1;
    }
     let firstIndexInPage = (pageIndex - 1) * pageSize;
    let lastIndexInPage = firstIndexInPage + pageSize;
    if (lastIndexInPage >= searchResults.length) {
      lastIndexInPage = searchResults.length;
    }
    customerInventoryData = searchResults.slice(firstIndexInPage,lastIndexInPage);

    return (
      <div>
        {this.state.isEnable ? (
          <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            addVisible={false}
            deleteVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        ):""
        }
        {
          this.state.isDetails === "true" ? (
            <ErrorBoundary>
              <CustomerInventoryDetailsComposite
               customerCode={this.state.customerCode}
               baseproductCode={this.state.baseproductCode}
                selectedShareholder={this.state.selectedShareholder}
                onBack={this.handleBack}
                noOfSignificantDigits = {this.state.noOfSignificantDigits}
              >
              </CustomerInventoryDetailsComposite>
            </ErrorBoundary>
          ) : this.state.isReadyToRender ? (
              <ErrorBoundary>
                <CustomerInventorySummaryComposite
                  inventoryData={customerInventoryData}
                  detailsExpand={this.detailsExpand}
                  handleSearchChange={this.handleSearchChange}
                  pageSize={this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize}
                  itemsPerPage={pageSize}
                  pageIndex={this.state.pageIndex}
                  totalItem={searchResults.length}
                pageChange={this.pageChange}>
                </CustomerInventorySummaryComposite>
              </ErrorBoundary>
          ):( <>
            {this.state.isEnable ? (
              <LoadingPage message="Loading"></LoadingPage>
            ) : (
              <Error errorMessage="CustomerInventoryFeatureNotEnabled"></Error>
            )}
          </>)
        }

      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(CustomerInventoryComposite);

CustomerInventoryComposite.propTypes = {
  activeItem: PropTypes.object,
};
