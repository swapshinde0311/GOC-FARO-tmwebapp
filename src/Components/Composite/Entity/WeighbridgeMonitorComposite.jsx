import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { WeighbridgeMonitorSummaryPageComposite } from "../Summary/WeighbridgeMonitorSummaryComposite";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { WeighbridgeValidationDef } from "../../../JS/ValidationDef";
import { functionGroups, fnAllowWeighBridgeManualEntry } from "../../../JS/FunctionGroups";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import { toast, ToastContainer } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import "react-toastify/dist/ReactToastify.css";
import { emptyWeighBridge } from "../../../JS/DefaultEntities";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class WeighbridgeMonitorComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    data: [],
    WeighbridgeData: lodash.cloneDeep(emptyWeighBridge),
    modWeighbridgeData: {},
    WeightStabledata: [],
    refeshData:{},
    validationErrors: Utilities.getInitialValidationErrors(WeighbridgeValidationDef),
    AllowEnableButton: false,
    manualEntryWeight: false,
    saveEnabled: false,
    locationCode:"",
    showAuthenticationLayout: false,
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      
      this.GetWeighBridgeDeviceList();
    } catch (error) {
      console.log(
        "WeighBridgeComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  handleRowClick = (item) => {
    try {
      this.setState({
        isDetails: true,
        WeighbridgeData: item.rowData,
        modWeighbridgeData: item.rowData,
        refeshData: item.rowData,
        locationCode: item.rowData.Locationcode,
        AllowEnableButton: true,
        manualEntryWeight: false,
        saveEnabled: false
      }, () =>  this.GetWeighBridge(item.rowData));
        this.setDefaultValues();
    } catch (error) {
      console.log("WeigghbridgeComposite:Error occured on Row click", error);
    }
  };
  GetWeighBridgeDeviceList() {
    
    try {
      axios(
        RestAPIs.GetWeighBridgeDeviceList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          
          var result = response.data;
          if (result.IsSuccess === true) {
           
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in GetWeighBridgeDeviceList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting GetWeighBridgeDeviceList:", error);
        });
    } catch (error) {
      console.log("Error while GetWeighBridgeDeviceList", error)
    }
  }
  GetWeighBridge(weighbridgeRow) {
    
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: weighbridgeRow.code,
        }
      ];
      var obj = {
        // ShareHolderCode: weighbridgeRow.code,
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetWeighBridge,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        
        var result = response.data;
        if (result.IsSuccess === true) {
          
          let modWeighbridgeData = result.EntityResult
          modWeighbridgeData.LastUpdatedTime =
              new Date(
                modWeighbridgeData.LastUpdatedTime
              ).toLocaleDateString() +
              " " +
              new Date(
                modWeighbridgeData.LastUpdatedTime
              ).toLocaleTimeString();
          this.setState(
            {
              isReadyToRender: true,
              WeighbridgeData: result.EntityResult,
              modWeighbridgeData,
            }, () => this.GetWeightStableStatus(result.EntityResult.PointName)
          );
          
        } else {
          this.setState({
            
            isReadyToRender: true,
          });
          console.log("Error in GetWeighBridge:", result.ErrorList);
        }
      })
        .catch((error) => {
          console.log("Error while GetWeighBridge:", error, weighbridgeRow);
        });
    } catch (error) {
      console.log("Error in get GetWeighBridge", error)
    }
  }
  GetWeightStableStatus(PointName) {
    
    try {
      axios(
        RestAPIs.GetWeightStableStatus +"?pointName=" +
        PointName,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          
          var result = response.data;
          if (result.IsSuccess === true) { 
            if (
              result.EntityResult !== null
            ) {
          this.setState({ WeightStabledata:result.EntityResult, isReadyToRender: true });
            }
          } else {
            this.setState({ WeightStabledata: [], isReadyToRender: true });
            console.log("Error in GetweightStableStatus:", result.ErrorList);
          }
        })
    }catch(error){
      console.log("Error in Get weightStableStatus",error)
    }
    
  
  }
  validateSave(modWeighbridgeData) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(WeighbridgeValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          WeighbridgeValidationDef[key],
          modWeighbridgeData[key]
        );
      });
      this.setState({
        validationErrors
      })
      var returnValue = true;
      if (returnValue)
        returnValue = Object.values(validationErrors).every(function (value) {
          return value === "";
        });
      return returnValue;
    }
    catch (error) {
      console.log("error in validate save",error)
    }
  }

  handleUpdateWeighBridgeConfig = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ saveEnabled: false });
      this.UpdateWeighBridgeConfig();

    } catch (error) {
      console.log("WeidgeBridgemonitorComposite:Error occured on handleUpdateWeighBridgeConfig", error);
    }
  };

  
  handleSave = () => {
    try {
      let WeighBridgeDeviceInfo = lodash.cloneDeep(this.state.modWeighbridgeData);
    //  this.setState({ saveEnabled: false });
      if (this.validateSave(WeighBridgeDeviceInfo)) {

        let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;

        this.setState({ showAuthenticationLayout  }, () => {
          if (showAuthenticationLayout === false) {
            this.UpdateWeighBridgeConfig();
          }
      });
       
      } else this.setState({ saveEnabled: true });
    }
    catch (error) {
      console.log("WeidgeBridgemonitorComposite:Error occured on handleSave", error);
    }
  };

  UpdateWeighBridgeConfig = () => {
    try {
      this.handleAuthenticationClose();
      let modWeighbridgeData = lodash.cloneDeep(this.state.modWeighbridgeData);
      var notification = {
        messageType: "critical",
        message: "WB_UpdateSuccessMsg",
        messageResultDetails: [
          {
            keyFields: ["WB_Code"],
            keyValues: [modWeighbridgeData.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      var obj = {
        Entity: modWeighbridgeData,
      };
      axios(
        RestAPIs.UpdateWeighBridgeConfig,
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
            this.setState({
              modWeighbridgeData,
              manualEntryWeight: false,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAllowWeighBridgeManualEntry
              ),
            }, () => {
              this.GetWeighBridgeDeviceList();
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAllowWeighBridgeManualEntry
              ),
            });
            console.log("Error in updateWeighBridgeMonitor:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnAllowWeighBridgeManualEntry
            ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        });


      this.setState({
        modWeighbridgeData: this.state.modWeighbridgeData,
      });
    } catch (error) {
      console.log("error in updateWeighBridgeMonitor",error)
    }
  }
  handleAllowclick =() =>{
    
    this.setState({
      manualEntryWeight: true,
      saveEnabled:true
    })
  }
  handleChange = (propertyName, data) => {

    try {
      const modWeighbridgeData = lodash.cloneDeep(this.state.modWeighbridgeData);
      modWeighbridgeData[propertyName] = data;
      this.setState({ modWeighbridgeData });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (WeighbridgeValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          WeighbridgeValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "weightbridgemonitorComposite:Error occured on handleChange",
        error
      );
    }
  };
  setDefaultValues() {
    this.setState({
      modWeighbridgeData: lodash.cloneDeep(emptyWeighBridge),
      WeighbridgeData: lodash.cloneDeep(emptyWeighBridge)
    })
  }
  handleRefresh = () => {
    
    try {
      let refeshData = lodash.cloneDeep(this.state.refeshData);
      if (refeshData !== null && refeshData !== undefined) {
        this.setState({
          manualEntryWeight: false,
        })
        this.GetWeighBridge(refeshData)
      }
      else {
        console.log("error in getting pointname")
      }
    } catch (error) {
      console.log("WeighBridgeComposite:Error occured on handleRefresh", error);
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            deleteVisible={false}
            addVisible={false}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <ErrorBoundary>
            <WeighbridgeMonitorSummaryPageComposite
              tableData={this.state.data.Table}
            pageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            onRowClick={this.handleRowClick}
              modWeighbridgeData={this.state.modWeighbridgeData}
              WeightStabledata={this.state.WeightStabledata}
            notificationData={this.state.notificationData}
              isDetails={this.state.isDetails}
              AllowEnableButton={this.state.AllowEnableButton}
              manualEntryWeight={this.state.manualEntryWeight}
              saveEnabled={this.state.saveEnabled}
              locationCode={this.state.locationCode}
              handleAllowclick={this.handleAllowclick}
            handleSave={this.handleSave}
            onFieldChange={this.handleChange}
            handleRefresh={this.handleRefresh}
            validationErrors={this.state.validationErrors}>

            </WeighbridgeMonitorSummaryPageComposite>
          </ErrorBoundary>
        ) : (
          <>
            <LoadingPage message="Loading"></LoadingPage>
          </>
        )}
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
        {/* <ErrorBoundary>
          <div className="detailsContainer">
            <object
              className="tmuiPlaceHolder"
              type="text/html"
              width="100%"
              height="880px"
              //data="http://localhost/TMUI/WeighBridgeList.aspx"
              data={"/"+ tmuiInstallType +"/WeighBridgeList.aspx"}
            ></object>
          </div>
        </ErrorBoundary> */}
            {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnAllowWeighBridgeManualEntry}
            handleOperation={this.handleUpdateWeighBridgeConfig}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
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

export default connect(mapStateToProps)(WeighbridgeMonitorComposite);

WeighbridgeMonitorComposite.propTypes = {
  activeItem: PropTypes.object,
};
