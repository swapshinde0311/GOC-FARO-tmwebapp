import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import lodash from "lodash";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { emptyInitialConfig } from "../../../JS/DefaultEntities";
import CustomerInventoryConfigSummaryComposite from "../Summary/CustomerInventoryConfigSummaryComposite";
import { CustmerInittialTableValidation } from "../../../JS/DetailsTableValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as Utilities from "../../../JS/Utilities";
import Error from "../../Error";

class CustomerInventoryConfigComposite extends Component {
  state = {
    modCustomerconfig: {},
    customerConfig: lodash.cloneDeep(emptyInitialConfig),
    selectedShareholder: "",
    customerCode: true,
    baseproductCode: false,
    isReadyToRender: false,
    operationsVisibilty: { shareholder: true },
    searchResult: "",
    customerOptions: [],
    baseProductOptions: [],
    isEnable: true,
    densityUOMOptions: [],
    saveEnabled:false,
  }

  componentDidMount() {
    try {
      var { operationsVisibilty } = { ...this.state };
      this.getLookUpData();
      this.setState({ operationsVisibilty, selectedShareholder: this.props.userDetails.EntityResult.PrimaryShareholder });
      this.getcustomerList(this.props.userDetails.EntityResult.PrimaryShareholder);
      this.getBaseProducts();
      this.getUOMList();
   } catch (error) {
      console.log("CustomerInventoryComposite:Error occured on ComponentDidMount", error);
    }

  }
  handleShareholderSelectionChange = (shareholder) => {
    try {
      let { operationsVisibilty } = { ...this.state };
      this.setState(
        {
          selectedShareholder: shareholder,
          isReadyToRender: false,
          operationsVisibilty,
          saveEnabled: false,
        },
        () => {
          this.getcustomerList(shareholder);
          this.getInitialCustomerInventoryList(this.state.selectedShareholder,"")
        }
      );
    } catch (error) {
      console.log(
        "customerinventoryconfigcomposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  handleChange = (propertyName, data) => {

    try {
      const modCustomerconfig = lodash.cloneDeep(this.state.modCustomerconfig);
      if (propertyName === "CustomerCode" ) {
        this.setState({
          customerCode: true, baseproductCode: false, 
        })
        // modCustomerconfig[propertyName] = data;
      }
     else if (propertyName === "BaseProductCode" ) {
        this.setState({ baseproductCode: true, customerCode
          : false
        })
        // modCustomerconfig[propertyName] = data;
      }
      modCustomerconfig[propertyName] = data;
      this.setState({ modCustomerconfig,saveEnabled:true });
      this.getInitialCustomerInventoryList(this.state.selectedShareholder, data);
    } catch (error) {
      console.log(
        "CustomerInventoryDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modCustomerconfig = lodash.cloneDeep(
        this.state.modCustomerconfig
      );
      modCustomerconfig[cellData.rowIndex][cellData.field] = newVal;
      this.setState({ modCustomerconfig });
    } catch (error) {
      console.log(
        "CustomerinventoryconfigComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };
  
  getUOMList() {
    try {
      axios(
        RestAPIs.GetUOMList,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let densityUOMOptions = [];
            let uomOptions = [];
            if ((Array.isArray(result.EntityResult.VOLUME)) && (Array.isArray(result.EntityResult.MASS))) {
              uomOptions = result.EntityResult.VOLUME.concat(result.EntityResult.MASS);
            }

            densityUOMOptions = Utilities.transferListtoOptions(
              uomOptions
            );
            this.setState({ densityUOMOptions });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("customerinvetoryconfigComposite:Error while getting GetUOMList");
    }
  }

  getInitialCustomerInventoryList(shareholder,data) {
    try {
      if (data === undefined || data === null || data === "") {
        this.setState({
          isReadyToRender: true,
          modCustomerconfig: {},
        })
        return;

      }
      if (this.state.customerCode === true) {
        var keyCode = [
          {
            key: KeyCodes.customerCode,
            value: data,
          },
        ];
      } else {
        var keyCode = [
          {
            key: KeyCodes.baseProductCode,
            value: data,
          },
        ];
      }
      
      var obj = {
        ShareHolderCode: shareholder,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetInitialCustomerInventory,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          
          var result = response.data;
          if (result.IsSuccess === true) {
            let modCustomerconfig = result.EntityResult;
            this.setState({ modCustomerconfig, customerConfig: result.EntityResult, isReadyToRender: true });

          } else {
            this.setState({ modCustomerconfig: [], isReadyToRender: true });
            console.log("Error in GetInitialCustomerInventory:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ modCustomerconfig: [], isReadyToRender: true });
          console.log("Error while getting GetInitialCustomerInventory:", error);
        });
    } catch (error) {
      console.log("Error while getting GetInitialCustomerInventory:", error);
    }
  }
  
  getLookUpData() {
    try {
      
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
              this.getInitialCustomerInventoryList(this.state.selectedShareholder, "");
            }
          } else {
            console.log("Error in getLookUpData: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("CustomerInventoryComposite: Error occurred on getLookUpData", error);
        });
    } catch (err) {
      console.log("CustomerInventoryComposite: Error occurred on getLookUpData", err);

    }
  }
  getBaseProducts(){
    try {
      axios(
        RestAPIs.GetAllBaseProduct + "?TerminalCode",
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult)
            ) {
              let baseProductOptions = Utilities.transferListtoOptions(
                result.EntityResult
              );
              this.setState({ baseProductOptions });
            }
          } else {
            console.log("Error in getBaseProducts:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting BaseProducts:", error);
        });
    } catch (error) {
      console.log("Error while getting BaseProducts:", error);

    }
  }
  getcustomerList(shareholder) {
    try {
      axios(
        RestAPIs.GetCustomerDestinations +
        "?ShareholderCode=" +
        shareholder +
        "&TransportationType=",

        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (Array.isArray(result.EntityResult)) {
              let shareholderCustomers = result.EntityResult.filter(
                (shareholderCust) =>
                  shareholderCust.ShareholderCode === shareholder
              );
              if (shareholderCustomers.length > 0) {
                let customers = Object.keys(
                  shareholderCustomers[0].CustomerDestinationsList
                );
                let customerOptions = Utilities.transferListtoOptions(customers);
                this.setState({ customerOptions });
              } else {
                console.log("no customers identified for shareholder");
              }
            } else {
              console.log("customerdestinations not identified for shareholder");
            }
          }
        })
        .catch((error) => {
          console.log("Error while getting Customer List:", error);
        });
    } catch (error) {
      console.log("Error while getting Customer List:", error);

    }
  }
  validateSave() {

    try {
      let modCustomerconfig = lodash.cloneDeep(this.state.modCustomerconfig);
      
      let notification = {
        messageType: "critical",
        message: "CustInitial_SavedStatus",
        messageResultDetails: [],
      };

      if (modCustomerconfig.length > 0) {
        modCustomerconfig.forEach((com) => {
          CustmerInittialTableValidation.forEach((col) => {
            let err = "";

            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, com[col.field]);
            }

            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: [col.displayName],
                keyValues: [com[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });
        })
      }
     
      var returnValue = true;
      
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
        return false;
      }
      return returnValue;
    } catch (error) {
      console.log("Error while Validate Save", error)
    }
  }
  handleSave = () => {

    try {
      this.setState({ saveEnabled: true });
      let customerintioalconfig = lodash.cloneDeep(this.state.modCustomerconfig)
      if (this.validateSave()) {
        this.CreateInitialInventory(customerintioalconfig);
      }
    } catch (error) {
      console.log(
        "CustomerinventoryConfigComposite:Error occured on handleSave",
        error
      );
    }
  }
  CreateInitialInventory = (customerintioalconfig) => {
    try {
      var notification = {
        messageType: "critical",
        message: "CustInitial_SavedStatus",
        messageResultDetails: [
          {
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      var obj = {
        Entity: customerintioalconfig,
      };
      axios(
        RestAPIs.CreateInitialInventory,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {

          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            if (this.state.customerCode === true) {
              this.getInitialCustomerInventoryList(this.state.selectedShareholder, customerintioalconfig[0].CustomerCode);
            } else if (this.state.baseproductCode === true) {
              this.getInitialCustomerInventoryList(this.state.selectedShareholder, customerintioalconfig[0].BaseProductCode);
            }
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: true
            });
            console.log("Error in CreateInitialInventory:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          this.setState({
            saveEnabled: true
          });
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        });
    } catch (error) {
      console.log("Error in createcustomerinventory",error)
    }
  }
  handleReset = () => {

    try {
      let customerConfig = lodash.cloneDeep(this.state.customerConfig)
      this.setState({
        modCustomerconfig: customerConfig ,
      });
    } catch (error) {
      console.log("customerinventoryComposite:Error occured on handleReset", error);
    }
  }
  render() {
    const listOptions = {
      baseProduct: this.state.baseProductOptions,
      customerCode: this.state.customerOptions,
      densityUOMOptions: this.state.densityUOMOptions,

    };
    return (
            <div>
              {this.state.isEnable ? (
              <ErrorBoundary>
                <TMUserActionsComposite
                    breadcrumbItem={this.props.activeItem}
                    operationsVisibilty={this.state.operationsVisibilty}
                  handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                  addVisible={false}
                  deleteVisible={false}
                  shareholders={this.props.userDetails.EntityResult.ShareholderList}
                  selectedShareholder={this.state.selectedShareholder}
                  onShareholderChange={this.handleShareholderSelectionChange}

                />
                </ErrorBoundary>): ""
              }
              <ErrorBoundary>
                {this.state.isReadyToRender ? (
                  <CustomerInventoryConfigSummaryComposite
                    customerCode={this.state.customerCode}
                    baseproductCode={this.state.baseproductCode}
                    onFieldChange={this.handleChange}
                    modCustomerconfig={this.state.modCustomerconfig}
                    listOptions={listOptions}
                    handleCellDataEdit={this.handleCellDataEdit}
                    CreateInitialInventory={this.handleSave}
                    saveEnabled={this.state.saveEnabled}
                    handleReset={this.handleReset}
                  >
                  </CustomerInventoryConfigSummaryComposite>
                ) : (<>
                  {this.state.isEnable ? (
                    <LoadingPage message="Loading"></LoadingPage>
                  ) : (
                    <Error errorMessage="CustomerInventoryFeatureNotEnabled"></Error>
                  )}
                </>)}
              </ErrorBoundary>
              <ErrorBoundary>
                <ToastContainer
                  hideProgressBar={true}
                  closeOnClick={false}
                  closeButton={true}
                  newestOnTop={true}
                  position="bottom-right"
                  toastClassName="toast-notification-wrap"
                />
              </ErrorBoundary>
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

export default connect(mapStateToProps)(CustomerInventoryConfigComposite);

CustomerInventoryConfigComposite.propTypes = {
  activeItem: PropTypes.object,
};
