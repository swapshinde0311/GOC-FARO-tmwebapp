import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ProductReconciliationReportDetails } from "../../UIBase/Details/ProductReconciliationReportDetails";
import { ViewMeterUnAccountedTransactionsDetails } from "../../UIBase/Details/ViewMeterUnAccountedTransactionsDetails";
import { ViewTankUnAccountedTransactionsDetails } from "../../UIBase/Details/ViewTankUnAccountedTransactionsDetails";
import { emptyReconciliationInfo } from "../../../JS/DefaultEntities";
import { productReconciliationReportValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import { connect } from "react-redux";
import * as KeyCodes from "../../../JS/KeyCodes";
import PropTypes from "prop-types";
import lodash, { constant } from "lodash";
import { functionGroups, fnProductReconciliationReports } from "../../../JS/FunctionGroups";
import * as Constants from "../../../JS/Constants";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ProductReconciliationReportDetailsComposite extends Component {
  state = {
    reconciliationInfo: lodash.cloneDeep(emptyReconciliationInfo),
    modReconciliationInfo: {},
    validationErrors: Utilities.getInitialValidationErrors(
      productReconciliationReportValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: true,
    productReconciliationStatusOptions: [],
    showReport: false,
    reonciliationReportNames: { tank: '', meter: ''},
    showTankTransactions:false,
    showMeterTransactions: false,
    data: {},
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    showAuthenticationLayout: false,
    tempReconciliationInfo: {}
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getReconciliationReport(this.props.selectedRow);
      this.getLookUpData();
      this.getProductReconciliationStatus(this.props.selectedRow.Reconciliation_Status);
    } catch (error) {
      console.log(
        "ProductReconciliationDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      let ReconciliationCode = this.state.reconciliationInfo.reconciliationCode
      if (
        ReconciliationCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getReconciliationReport(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "ProductReconciliationDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

 

  getProductReconciliationStatus(reconStatus) {
    axios(
      RestAPIs.GetProductReconciliationStatus,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let productReconciliationStatusOptions = [];
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult).forEach((key) =>
            productReconciliationStatusOptions.push(result.EntityResult[key])
            );
             
            let filteredStatus = [];
          

            if (reconStatus.toUpperCase()===Constants.ProductReconciliationReportStatus.Open.toUpperCase())
            {
              filteredStatus = productReconciliationStatusOptions.filter(
                (objOption) => objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Open.toUpperCase()
              );
            }
            else if (reconStatus.toUpperCase() === Constants.ProductReconciliationReportStatus.In_Progress.toUpperCase())
            {
              filteredStatus = productReconciliationStatusOptions.filter(
                (objOption) => objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.In_Progress.toUpperCase()
              );
            }
            else if(reconStatus.toUpperCase()===Constants.ProductReconciliationReportStatus.Reconciled_NoDiff.toUpperCase() )
            {
              filteredStatus = productReconciliationStatusOptions.filter(
                (objOption) => (
                  objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Reconciled_NoDiff.toUpperCase()
                  ||
                  objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Approved.toUpperCase()
                  ||
                  objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Closed.toUpperCase()
                  )
              );
            }
            else if (reconStatus.toUpperCase() === Constants.ProductReconciliationReportStatus.Approved.toUpperCase())
            {
           
              filteredStatus = productReconciliationStatusOptions.filter(
                (objOption) => (
                  
                  objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Approved.toUpperCase()
                  ||
                  objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Closed.toUpperCase()
                  )

              );
            }
              
            else if (reconStatus.toUpperCase()===Constants.ProductReconciliationReportStatus.Reconciled_Diff.toUpperCase())
            {
                 filteredStatus = productReconciliationStatusOptions.filter(
                  (objOption) => (
                    objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Reconciled_Diff.toUpperCase()
                    ||
                    objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Approved.toUpperCase()
                    ||
                    objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Rejected.toUpperCase()
                    )
                );

              }
            else if (reconStatus.toUpperCase() ===Constants.ProductReconciliationReportStatus.Rejected.toUpperCase())
            {
              filteredStatus = productReconciliationStatusOptions.filter(
                (objOption) => (
              objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Rejected.toUpperCase()
              ||
              objOption.toUpperCase() === Constants.ProductReconciliationReportStatus.Closed.toUpperCase()  
              )
              );
            }

            if(filteredStatus.length>0)
             this.setState({ productReconciliationStatusOptions:filteredStatus });
             else
             this.setState({ productReconciliationStatusOptions });

          } else {
            console.log("No productReconciliationStatusOptions identified.");
          }
        } else {
          console.log("Error in GetProductReconciliationStatus:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting ProductReconciliationStatus:", error);
      });
  }

  updateProductReconciliationReport = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ saveEnabled: false });
      let tempReconciliationInfo = lodash.cloneDeep(this.state.tempReconciliationInfo);
      this.updateReconciliationReport(tempReconciliationInfo);

    } catch (error) {
      console.log("ProductReconciliationReport Details Composite : Error in updateProductReconciliationReport");
    }
  };


  handleSave = () => {
     
    try {
        let modReconciliationInfo = this.state.modReconciliationInfo;
        
    
        if (this.validateSave(modReconciliationInfo)) {
          
          let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempReconciliationInfo= lodash.cloneDeep(modReconciliationInfo);
        this.setState({ showAuthenticationLayout, tempReconciliationInfo }, () => {
          if (showAuthenticationLayout === false) {
            this.updateProductReconciliationReport();
          }
      });
       
        } else this.setState({ saveEnabled: true });
    }
    catch (error) {
        console.log("ProductReconciliationReportDetailsComposite:Error occured on handleSave", error);
    }
};
  

handleReopenReconciliation = () => {
  try {
      let modReconciliationInfo = this.state.modReconciliationInfo;
      modReconciliationInfo.RefreshWithLatestTransactions = true;

      this.setState({ saveEnabled: false });
      if (this.validateSave(modReconciliationInfo)) {
        
      this.reopenReconciliation(modReconciliationInfo);
      } else this.setState({ saveEnabled: true });
  }
  catch (error) {
      console.log("ProductReconciliationReportDetailsComposite:Error occured on handleReopenReconciliation", error);
  }
};

validateSave(modReconciliationInfo) {
  var validationErrors = lodash.cloneDeep(this.state.validationErrors);
  Object.keys(productReconciliationReportValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        productReconciliationReportValidationDef[key],
          modReconciliationInfo[key]
      );
  });
  if (modReconciliationInfo.Status !== this.state.reconciliationInfo.Status) {
    if (modReconciliationInfo.Remarks === null || modReconciliationInfo.Remarks === "") {
      validationErrors["Remarks"] = "CaptainInfo_RemarksRequired";
    }
  }

  this.setState({ validationErrors });

 
  var returnValue = true;


 
  if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
          return value === "";
      });


  return returnValue;
}
 

reopenReconciliation(modReconciliationInfo) {
  let keyCode = [
      {
          key: KeyCodes.reconciliationCode,
          value: modReconciliationInfo.Code,
      },
  ];
  let obj = {
      keyDataCode: KeyCodes.reconciliationCode,
      KeyCodes: keyCode,
      Entity: modReconciliationInfo,
  };

  let notification = {
      messageType: "critical",
      message: "ManualReconciliation_UpdateSuccessMsg",
      messageResultDetails: [
          {
              keyFields: ["ReconciliationReportDetail_RcCode"],
              keyValues: [modReconciliationInfo.ReconciliationCode],
              isSuccess: false,
              errorMessage: "",
          },
      ],
  };

  axios(
      RestAPIs.UpdateReconciliationReport,
      Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
      )
  ).then((response) => {
      let result = response.data;
      notification.messageType = result.IsSuccess ? "success" : "critical";
      notification.messageResultDetails[0].isSuccess = result.IsSuccess;
      if (result.IsSuccess === true) {
          this.setState(
              {
                  saveEnabled: Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.modify,
                      fnProductReconciliationReports
                  ),
              },
              () => this.getReconciliationReport({ Common_Code: modReconciliationInfo.ReconciliationCode })
          );
      } else {
          notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
          this.setState({
              saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnProductReconciliationReports
              ),
          });
          console.log("Error in update ReconciliationReport:", result.ErrorList);
      }
      this.props.onSaved(this.state.modReconciliationInfo, "update", notification);
  })
      .catch((error) => {
          this.setState({
              saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnProductReconciliationReports
              ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.modReconciliationInfo, "modify", notification);
      });
}

handleViewUnAccountedTransactions = () => {
 try {
  let modReconciliationInfo = lodash.cloneDeep(this.state.modReconciliationInfo);
 
  if(modReconciliationInfo.EntityTypeCode==="Meter")
  {
  this.GetUnAccountedTransactionMeterList(this.props.shareholerCode)
  this.setState({
    showTankTransactions: false, showMeterTransactions: true,
 } )
    }
    else
    {
      this.GetUnAccountedTransactionTankList(this.props.shareholerCode)
  this.setState({
    showTankTransactions: true, showMeterTransactions: false,
 } )
    }
  }
    catch (error) {
        console.log("Error in handleViewUnAccountedTransactions", error)
    }
};

handleRangeSelect = ({ to, from }) => {
  if (to !== undefined) this.setState({ toDate: to });
  if (from !== undefined) this.setState({ fromDate: from });
};
handleLoadOrders = () => {
  //debugger;
  let error = Utilities.validateDateRange(
    this.state.toDate,
    this.state.fromDate
  );

  if (error !== "") {
    this.setState({ dateError: error });
  } else {
    this.setState({ dateError: "" });
    let kk=this.props.userDetails;
    if(this.state.showMeterTransactions)
    this.GetUnAccountedTransactionMeterList(this.props.shareholerCode);
    else
    this.GetUnAccountedTransactionTankList(this.props.shareholerCode);

  }
};

GetUnAccountedTransactionTankList(shareholder) {
  let fromDate = new Date(this.state.fromDate);
  let toDate = new Date(this.state.toDate);
  fromDate.setHours(0, 0, 0);
  toDate.setHours(23, 59, 59);
  let obj = {
    ShareholderCode: shareholder,
    startRange: fromDate,
    endRange: toDate,
  };
  if (shareholder !== undefined && shareholder !== "") {
    axios(
      RestAPIs.GetUnAccountedTransactionTankList,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            data: this.fillTankDetails(result.EntityResult),
            isReadyToRender: true,
          });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error in GetUnAccountedTransactionTankList:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log(
          "Error while getting UnAccountedTransactionTank List:",
          error
        );
      });
  }
}

fillTankDetails(data) {
  try {
    data.Table.forEach((p) => {
      if (
        p.TankUnaccountedTransaction_UnAccountedGrossQuantity !== null &&
        p.TankUnaccountedTransaction_UnAccountedGrossQuantity !== ""
      )
        p.TankUnaccountedTransaction_UnAccountedGrossQuantity =
          p.TankUnaccountedTransaction_UnAccountedGrossQuantity.toLocaleString();
      if (
        p.TankUnaccountedTransaction_UnAccountedNetQuantity !== null &&
        p.TankUnaccountedTransaction_UnAccountedNetQuantity !== ""
      )
        p.TankUnaccountedTransaction_UnAccountedNetQuantity =
          p.TankUnaccountedTransaction_UnAccountedNetQuantity.toLocaleString();
      if (
        p.TankUnaccountedTransaction_Density !== null &&
        p.TankUnaccountedTransaction_Density !== ""
      )
        p.TankUnaccountedTransaction_Density =
          p.TankUnaccountedTransaction_Density.toLocaleString();
    });

    this.setState({ data });
    return data;
  } catch (error) {
    console.log(
      "UnAccountedTransactionMeterDetailsComposite:Error occured on fillDetails",
      error
    );
  }
}

GetUnAccountedTransactionMeterList(shareholder) {
  let fromDate = new Date(this.state.fromDate);
  let toDate = new Date(this.state.toDate);
  fromDate.setHours(0, 0, 0);
  toDate.setHours(23, 59, 59);
  let obj = {
    ShareholderCode: shareholder,
    startRange: fromDate,
    endRange: toDate,
  };
  if (shareholder !== undefined && shareholder !== "") {
    axios(
      RestAPIs.GetUnAccountedTransactionMeterList,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            data: this.fillMeterDetails(result.EntityResult),
            isReadyToRender: true,
          });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log(
            "Error in GetUnAccountedTransactionMeterList:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log(
          "Error while getting UnAccountedTransactionMeter List:",
          error
        );
      });
  }
}

fillMeterDetails(data) {
  try {
    data.Table.forEach((p) => {
      if (
        p.MeterUnaccountedTransaction_UnAccountedGrossQuantity !== null &&
        p.MeterUnaccountedTransaction_UnAccountedGrossQuantity !== ""
      )
        p.MeterUnaccountedTransaction_UnAccountedGrossQuantity =
          p.MeterUnaccountedTransaction_UnAccountedGrossQuantity.toLocaleString();
      if (
        p.MeterUnaccountedTransaction_UnAccountedNetQuantity !== null &&
        p.MeterUnaccountedTransaction_UnAccountedNetQuantity !== ""
      )
        p.MeterUnaccountedTransaction_UnAccountedNetQuantity =
          p.MeterUnaccountedTransaction_UnAccountedNetQuantity.toLocaleString();
    });
    this.setState({ data });
    return data;
  } catch (error) {
    console.log(
      "UnAccountedTransactionMeterDetailsComposite:Error occured on fillDetails",
      error
    );
  }
}


 

updateReconciliationReport(modReconciliationInfo) {
  let keyCode = [
      {
          key: KeyCodes.reconciliationCode,
          value: modReconciliationInfo.Code,
      },
  ];
  let obj = {
      keyDataCode: KeyCodes.reconciliationCode,
      KeyCodes: keyCode,
      Entity: modReconciliationInfo,
  };

  let notification = {
      messageType: "critical",
      message: "ProductReconciliation_UpdateMsg",
      messageResultDetails: [
          {
              keyFields: ["ReconciliationReportDetail_RcCode"],
              keyValues: [modReconciliationInfo.ReconciliationCode],
              isSuccess: false,
              errorMessage: "",
          },
      ],
  };

  axios(
      RestAPIs.UpdateReconciliationReport,
      Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
      )
  ).then((response) => {
      let result = response.data;
      notification.messageType = result.IsSuccess ? "success" : "critical";
      notification.messageResultDetails[0].isSuccess = result.IsSuccess;
      if (result.IsSuccess === true) {
          this.setState(
              {
                  saveEnabled: Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.modify,
                      fnProductReconciliationReports
                  ),
              },
              () => this.getReconciliationReport({ Common_Code: modReconciliationInfo.ReconciliationCode })
          );
      } else {
          notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
          this.setState({
              saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnProductReconciliationReports
              ),
          });
          console.log("Error in update ReconciliationReport:", result.ErrorList);
      }
      this.props.onSaved(this.state.modReconciliationInfo, "update", notification);
  })
      .catch((error) => {
          this.setState({
              saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnProductReconciliationReports
              ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.modReconciliationInfo, "modify", notification);
      });
}

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const reconciliationInfo = lodash.cloneDeep(this.state.reconciliationInfo);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modReconciliationInfo: { ...reconciliationInfo },
          selectedCompRow: [],
          validationErrors,
        } 
      );
    } catch (error) {
      console.log(
        "ProductReconciliationDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  getReconciliationReport(prodReconReportRow) {
        
    if (prodReconReportRow.Common_Code === undefined) {
        this.setState({
            reconciliationInfo: lodash.cloneDeep(emptyReconciliationInfo),
            modReconciliationInfo: lodash.cloneDeep(emptyReconciliationInfo),
            isReadyToRender: true,
            
            saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnProductReconciliationReports
            ),
        },
         
        );
        return;
    }
    var keyCode = [
        {
            key: KeyCodes.reconciliationCode,
            value: prodReconReportRow.Common_Code,
        }
    ];
    var obj = {
        reconciliationCode: prodReconReportRow.Common_Code,
        keyDataCode: KeyCodes.reconciliationCode,
        KeyCodes: keyCode,
    };
    axios(
        RestAPIs.GetReconciliationReport,
        Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
        )
    ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
            result.EntityResult.ReconciliationCode = result.EntityResult.ReconciliationCode.toString();
            this.setState(
                {
                    isReadyToRender: true,
                    reconciliationInfo: lodash.cloneDeep(result.EntityResult),
                    modReconciliationInfo: lodash.cloneDeep(result.EntityResult),
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.modify,
                        fnProductReconciliationReports
                    ),
                }, 
            );
        } else {
            this.setState({
              reconciliationInfo: lodash.cloneDeep(emptyReconciliationInfo),
              modReconciliationInfo: lodash.cloneDeep(emptyReconciliationInfo),
                isReadyToRender: true,
            });
            console.log("Error in get ReconciliationReport:", result.ErrorList);
        }
    })
        .catch((error) => {
            console.log("Error while get ReconciliationReport:", error, prodReconReportRow);
        });
}



  handleChange = (propertyName, data) => {
    try {
      const modReconciliationInfo = lodash.cloneDeep(this.state.modReconciliationInfo);

      modReconciliationInfo[propertyName] = data;
      this.setState({ modReconciliationInfo });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (productReconciliationReportValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          productReconciliationReportValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
 
    } catch (error) {
      console.log(
        "ProductReconciliationDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=ReportConfig",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          var { reonciliationReportNames } = { ...this.state };
          reonciliationReportNames.tank = result.EntityResult.TankFolio;
          reonciliationReportNames.meter = result.EntityResult.MeterReconciliation;

          this.setState({ reonciliationReportNames });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "ProductReconciliationDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  handleModalBack = () => {
    this.setState({ showReport: false });
  };

  renderModal() {
   
    var { reonciliationReportNames } = { ...this.state };
     
    let path = null;
    let reportName = '';
   if(this.state.reconciliationInfo.EntityTypeCode === "Meter")
    reportName = reonciliationReportNames.meter;
    else
    reportName= reonciliationReportNames.tank;
   
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/" + reportName;
    } else {
      path = "TM/" + Constants.TMReports + "/" + reportName;
    }
    let paramValues = {};

      paramValues = {
        Culture: this.props.userDetails.EntityResult.UICulture,
        ReconciliationCode: this.state.reconciliationInfo.ReconciliationCode,
        readonly: 1
      };
   
    return (
      <ErrorBoundary>
        <ReportDetails
          showReport={this.state.showReport}
          handleBack={this.handleModalBack}
          handleModalClose={this.handleModalBack}
          proxyServerHost={RestAPIs.WebAPIURL}
          reportServiceHost={this.reportServiceURI}
          filePath={path}
          parameters={paramValues}
        />
      </ErrorBoundary>
    );
  }

  handleViewReport = () => {
    try {
      if (this.reportServiceURI === undefined) {
        axios(
          RestAPIs.GetReportServiceURI,
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.reportServiceURI = response.data.EntityResult;
            this.setState({ showReport: true });
          }
        });
      } else {
        this.setState({ showReport: true});
      }
    }
    catch (error) {
      console.log(
        "ProductReconciliationDetailsComposite:Error occured on handleView Report",
        error
      );
    }
  };
  
  BackEvent = () => {
    try {
        this.setState({
           showTankTransactions: false,showMeterTransactions: false,
        }, )
    }
    catch (error) {
        console.log("Error in BackEvent", error)
    }
}



  handleReconciliationStatusChange = (value) => {
    try {
      let modReconciliationInfo = lodash.cloneDeep(this.state.modReconciliationInfo);
      modReconciliationInfo.Status = value;
      if (modReconciliationInfo.Status !== this.state.reconciliationInfo.Status)
      modReconciliationInfo.Remarks = "";
      this.setState({ modReconciliationInfo });
    } catch (error) {
      console.log(error);
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      productReconciliationStatusOptions: this.state.productReconciliationStatusOptions,
    };

    const popUpContents = [
      {
        fieldName: "CaptainInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modReconciliationInfo.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modReconciliationInfo.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "CaptainInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modReconciliationInfo.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modReconciliationInfo.CreatedTime).toLocaleTimeString(),
      },
 
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.reconciliationInfo.ReconciliationCode}
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        {this.state.showTankTransactions || this.state.showMeterTransactions ? (
          this.state.showMeterTransactions?(
          <ErrorBoundary>
          <TMTransactionFilters
            dateRange={{ from: this.state.fromDate, to: this.state.toDate }}
            dateError={this.state.dateError}
            handleRangeSelect={this.handleRangeSelect}
            handleLoadOrders={this.handleLoadOrders}
            filterText="LoadTransactionMeter"
          ></TMTransactionFilters>
      
                      <ViewMeterUnAccountedTransactionsDetails
                          transactionData={this.state.data.Table}
                          handleBack={this.BackEvent}
                          pageSize={this.props.userDetails.EntityResult.PageAttibutes
                              .WebPortalListPageSize}
                      >
                      </ViewMeterUnAccountedTransactionsDetails>
                  </ErrorBoundary>) :
                   <ErrorBoundary>
                   <TMTransactionFilters
                     dateRange={{ from: this.state.fromDate, to: this.state.toDate }}
                     dateError={this.state.dateError}
                     handleRangeSelect={this.handleRangeSelect}
                     handleLoadOrders={this.handleLoadOrders}
                     filterText="LoadTransactionTank"
                   ></TMTransactionFilters>
                      <ViewTankUnAccountedTransactionsDetails
                          transactionData={this.state.data.Table}
                          handleBack={this.BackEvent}
                          pageSize={this.props.userDetails.EntityResult.PageAttibutes
                              .WebPortalListPageSize}
                      >
                      </ViewTankUnAccountedTransactionsDetails>
                  </ErrorBoundary>
                        ):
      this.state.showReport === false ? (
        <ErrorBoundary>
          <ProductReconciliationReportDetails
            reconciliationInfo={this.state.reconciliationInfo}
            modReconciliationInfo={this.state.modReconciliationInfo}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            handleReconciliationStatusChange={this.handleReconciliationStatusChange}
            handleReopenReconciliation={this.handleReopenReconciliation}
            handleViewReport={this.handleViewReport}
            handleViewUnAccountedTransactions= {this.handleViewUnAccountedTransactions}
          ></ProductReconciliationReportDetails>
        <TMDetailsUserActions
          handleBack={this.props.onBack}
          handleSave={this.handleSave}
          handleReset={this.handleReset}
          saveEnabled={this.state.saveEnabled}
        ></TMDetailsUserActions>
          
      </ErrorBoundary>
      
          ) : (this.renderModal())
        }
         
         {
           
         this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnProductReconciliationReports}
            handleOperation={this.updateProductReconciliationReport}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
      </div>
    ) : (
      <LoadingPage message=""></LoadingPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(ProductReconciliationReportDetailsComposite);

ProductReconciliationReportDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  shareholerCode: PropTypes.func.isRequired
};