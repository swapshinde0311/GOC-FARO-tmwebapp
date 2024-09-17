import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as Constants from "../../../JS/Constants";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { emptyReconciliationScheduleInfo,emptyReconciliationInfo } from "../../../JS/DefaultEntities";
import { productReconciliationScheduleValidationDef } from "../../../JS/ValidationDef";
import ProductReconciliationScheduleDetails from "../../UIBase/Details/ProductReconciliationScheduleDetails";
import { functionGroups, fnProductReconciliationReports } from "../../../JS/FunctionGroups";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ProductReconciliationScheduleDetailsComposite extends Component {
  state = {
    reportSchedule: {},
    modReportSchedule: {},
    saveEnabled: false,
    isDeleteEnabled: false,
    isReadyToRender: false,
    modReconciliationSchedules: [],
    validationErrors: Utilities.getInitialValidationErrors(
      productReconciliationScheduleValidationDef
    ),
    addNewSchedule:false,
    showAuthenticationLayout: false,
    tempReportSchedule: {}
    
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getReconciliationSchedules();

      this.setState(
        {
          reportSchedule: lodash.cloneDeep(emptyReconciliationScheduleInfo),
          modReportSchedule: lodash.cloneDeep(emptyReconciliationScheduleInfo),
        //  addNewSchedule: false,
        });
    } catch (error) {
      console.log(
        "ProductReconciliationScheduleDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      
      if(nextProps.refreshScheduleUIRequired===true)
      {
        this.handleReset();
      }
      
      if (nextProps.addSchedule===true)
      {
      
        this.handleReset();
        this.setState({addNewSchedule:true,saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnProductReconciliationReports
      ),})
      }

    } catch (error) {
      console.log(
        "ProductReconciliationScheduleDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

 
  getReconciliationSchedules() {
    axios(
      RestAPIs.GetReconciliationScheduleList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ modReconciliationSchedules: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ modReconciliationSchedules: [], isReadyToRender: true });
          console.log("Error in GetReconciliationScheduleList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ modReconciliationSchedules: [], isReadyToRender: true });
        console.log("Error while getting GetReconciliationScheduleList:", error);
      });
  }
  
 

  validateSave(modSchedInfo) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(productReconciliationScheduleValidationDef).forEach(function (key) {
      if (modSchedInfo[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          productReconciliationScheduleValidationDef[key],
          modSchedInfo[key]
        );
    });

    if(modSchedInfo.EntityTypeCode==="")
    {
      validationErrors["ScheduleName"] = "ReconciliationSchedule_EntityMandatory";
    }
    else
    if(modSchedInfo.IsRecurrent==="")
    {
      validationErrors["ScheduleName"] = "ReconciliationSchedule_ScheduleMandatory";
    }
    else
    if(modSchedInfo.IsRecurrent===true &&  modSchedInfo.IsEOS=== false && modSchedInfo.IsEOD===false)
    {
      validationErrors["ScheduleName"] = "ReconciliationSchedule_EODEOSMandatory";
    }
    else
    if((modSchedInfo.IsRecurrent==="" || modSchedInfo.IsRecurrent===false) && modSchedInfo.ScheduleName==="")
    {
       
      validationErrors["ScheduleName"] = "ReconciliationSchedule_FolioNameMandatory";
    }
    if(modSchedInfo.IsRecurrent===false && modSchedInfo.StartDateTime===null)
    {
      validationErrors["StartDateTime"] = "ReconciliationSchedule_StartDateMandatory";
    }
    
    if(modSchedInfo.IsRecurrent===false && modSchedInfo.EndDateTime===null)
    {
      validationErrors["EndDateTime"] = "ReconciliationSchedule_EndDateMandatory";
    }

    this.setState({ validationErrors });

    var returnValue = true;

    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });

    return returnValue;
  }



  handleRowClick = (row) => {
    try {


      var keyCode = [
        {
            key: KeyCodes.reconciliationCode,
            value: row.ScheduleName,
        },
        {
          key: KeyCodes.entityType,
          value: row.EntityCode,
      },
    ];
    var obj = {
        reconciliationCode: row.ScheduleName,
        keyDataCode: KeyCodes.reconciliationCode,
        KeyCodes: keyCode,
    };
    axios(
        RestAPIs.GetReconciliationSchedule,
        Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
        )
    ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
            
          let rptSchedule= lodash.cloneDeep(result.EntityResult);
        
          rptSchedule.ScheduleName=row.ScheduleName;
          this.props.onScheduleSelect(rptSchedule);

            this.setState(
                {
                    addNewSchedule:false,
                    isReadyToRender: true,
                    reportSchedule: lodash.cloneDeep(result.EntityResult),
                    modReportSchedule: lodash.cloneDeep(result.EntityResult),
                    saveEnabled:  false,
                }, 
                 
            );
        } else {
            this.setState({
              reportSchedule: lodash.cloneDeep(emptyReconciliationScheduleInfo),
              modReportSchedule: lodash.cloneDeep(emptyReconciliationScheduleInfo),
                isReadyToRender: true,
            });
            console.log("Error in get ReconciliationReport:", result.ErrorList);
        }
   
    })
        .catch((error) => {
            console.log("Error while get ReconciliationReport:", error, row);
        });
 
      
    } catch (error) {
      console.log("CarrierCompanyComposite:Error occured on Row click", error);
    }
  };


  handleChange = (propertyName, data) => {
    try {
      const modReportSchedule = lodash.cloneDeep(
        this.state.modReportSchedule
      );
      
      if(propertyName==="IsEOD")
      {
       modReportSchedule.IsEOD=!modReportSchedule.IsEOD;
      }
      else if(propertyName==="IsEOS")
      {
       modReportSchedule.IsEOS=!modReportSchedule.IsEOS;
      }
      else if(propertyName==="IsRecurrent" && data === false)
      {
        modReportSchedule.IsEOD= false;
        modReportSchedule.IsEOS=false;
        modReportSchedule[propertyName] = data;
        
      }
      else if(propertyName==="IsRecurrent" && data === true)
      {
        modReportSchedule.ScheduleName='';
        modReportSchedule[propertyName] = data;
        
      }
      else 
      modReportSchedule[propertyName] = data;

      const validationErrors = { ...this.state.validationErrors };
      if (productReconciliationScheduleValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          productReconciliationScheduleValidationDef[propertyName],
          data
        );
      }
       
        this.setState({ validationErrors, modReportSchedule, });

    
    } catch (error) {
      console.log(
        "ProductReconciliationScheduleDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };


  
  handleReset = () => {
    try {
      
      const { validationErrors } = { ...this.state };

      this.getReconciliationSchedules();
      
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });

      this.props.onUnScheduleSelect(null);
      this.setState(
        {
          reportSchedule: lodash.cloneDeep(emptyReconciliationScheduleInfo),
          modReportSchedule: lodash.cloneDeep(emptyReconciliationScheduleInfo),
        },
      );
    } catch (error) {
      console.log(
        "ProductReconciliationScheduleDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  addProductReconciliationSchedule = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ saveEnabled: false });
      let tempReportSchedule = lodash.cloneDeep(this.state.tempReportSchedule);
     
      if(tempReportSchedule.IsRecurrent===false)
       {
        let modReconRepInfo= this.prepareReconciliationReportDetails(tempReportSchedule);
        modReconRepInfo.Status =  Constants.ProductReconciliationReportStatus.Open;
        this.CreateOneTimeReconciliationSchedule(modReconRepInfo);
       }
       else
       {
        tempReportSchedule.Active=true;
        this.CreateRecurrenceSchedule(tempReportSchedule);
       }

    } catch (error) {
      console.log("ProductReconciliation Details Composite : Error in addProductReconciliationSchedule");
    }
  };


  handleSave = () => {
    try {
     
      let modReportSchedule = lodash.cloneDeep(this.state.modReportSchedule);
      
      if (this.validateSave(modReportSchedule)) {
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempReportSchedule = lodash.cloneDeep(modReportSchedule);
      this.setState({ showAuthenticationLayout, tempReportSchedule }, () => {
        if (showAuthenticationLayout === false) {
          this.addProductReconciliationSchedule();
        }
    });
         
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("ProductReconciliationScheduleDetailsComposite:Error occured on handleSave", error);
    }
  };
  
  prepareReconciliationReportDetails= (schedInfo) => {
    let modReconRepInfo= lodash.cloneDeep(emptyReconciliationInfo);
    try {
     
     modReconRepInfo.ReconciliationCode=schedInfo.ScheduleName;
     modReconRepInfo.EntityTypeCode=schedInfo.EntityTypeCode;
     modReconRepInfo.StartDate=schedInfo.StartDateTime;
     modReconRepInfo.EndDate=schedInfo.EndDateTime;
     modReconRepInfo.LastUpdatedTime= new Date();
     modReconRepInfo.LastUpdatedBy=this.props.userDetails.EntityResult.Firstname + " " + this.props.userDetails.EntityResult.LastName;
   
    } catch (error) {
      console.log("ProductReconciliationReportComposite:Error occured on prepareReconciliationReportDetails", error);
    }
    return modReconRepInfo;
  };


  CreateRecurrenceSchedule (modReportSchedule) {

    let keyCode = [
        {
            key: KeyCodes.reconciliationCode,
            value: modReportSchedule.ScheduleName,
        },
    ];

    let obj = {
        keyDataCode: KeyCodes.reconciliationCode,
        KeyCodes: keyCode,
        Entity: modReportSchedule,
    };
  
    let notification = {
        messageType: "critical",
        message: "ReconciliationSchedule_SavedMsg",
        messageResultDetails: [
            {
                keyFields: ["ReconciliationSchedule_Entity"],
                keyValues: [modReportSchedule.EntityTypeCode],
                isSuccess: false,
                errorMessage: "",
            },
        ],
    };
  
    
    axios(
        RestAPIs.CreateRecurrenceSchedule,
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
                  saveEnabled:false,
                  addNewSchedule:false,
                },
              
            );
            this.getReconciliationSchedules();
        } else {
            notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            this.setState({
                saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.add,
                    fnProductReconciliationReports
                ),
            });
            console.log("Error in Add ReconciliationReport:", result.ErrorList);
        }
        this.props.onSaved(modReportSchedule, "add", notification);
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
            this.props.onSaved(modReportSchedule, "add", notification);
        });
  }


  CreateOneTimeReconciliationSchedule(modReconciliationInfo) {

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
        message: "ReconciliationSchedule_SavedMsg",
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
        RestAPIs.CreateReconciliationReport,
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
                  saveEnabled:false,
                  addNewSchedule:false,
                },
              
            );
            this.getReconciliationSchedules();
        } else {
            notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            this.setState({
                saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.add,
                    fnProductReconciliationReports
                ),
            });
            console.log("Error in Add ReconciliationReport:", result.ErrorList);
        }
        this.props.onSaved(modReconciliationInfo, "add", notification);
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
            this.props.onSaved(modReconciliationInfo, "add", notification);
        });
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
        <TranslationConsumer>
                  {(t) => (
          <TMDetailsHeader
           entityCode={t("ReconciliationSchedule_Title")}
          ></TMDetailsHeader>)}</TranslationConsumer>
        </ErrorBoundary>
        <ErrorBoundary>
          <ProductReconciliationScheduleDetails
            modReportSchedule={this.state.modReportSchedule}
            modReconciliationSchedules={this.state.modReconciliationSchedules!=null?this.state.modReconciliationSchedules.Table:null}
            validationErrors={this.state.validationErrors}
            columnDetails={this.state.modReconciliationSchedules!=null?this.state.modReconciliationSchedules.Column:null}
            onFieldChange={this.handleChange}
            onRowClick={this.handleRowClick}
            addNewSchedule={this.state.addNewSchedule}
          ></ProductReconciliationScheduleDetails>
        </ErrorBoundary>
        <ErrorBoundary>
        <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.add}
            functionGroup={fnProductReconciliationReports}
            handleOperation={this.addProductReconciliationSchedule}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
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


ProductReconciliationScheduleDetailsComposite.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  refreshScheduleUIRequired:PropTypes.func.isRequired,
  addSchedule:PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(ProductReconciliationScheduleDetailsComposite);
