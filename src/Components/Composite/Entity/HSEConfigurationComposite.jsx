import React, { Component } from "react";
import { HSEConfigurationSummaryPageComposite } from "../Summary/HSEConfigurationSummaryComposite";
import HSEConfigurationDetailsComposite from "../Details/HSEConfigurationDetailsComposite";
import axios from "axios";
import * as Constants from "./../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { functionGroups, fnHSEConfiguration, fnRoadHSEConfiguration, fnRailHSEConfiguration, fnMarineHSEConfiguration, fnPipelineHSEConfiguration } from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import Error from "../../Error";
import { HSEUserActionsComposite } from "../Common/HSEUserActionsComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class HSEConfigurationComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibility: { add: false, delete: false, terminal: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    selectedTerminal:"",
    data: {},
    isEnable: true,
    terminalVisible:false,
    showAuthenticationLayout: false,
  };

  componentName = "HSEConfigurationComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
    
      this.getTerminalList();
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.setState({ terminalVisible: true });
      } else {
        this.setState({ terminalVisible: false });
      }
    } catch (error) {
      console.log(
        "HSEConfigurationComposite: Error occurred on componentDidMount",
        error
      );
    }
      // clear session storage on window refresh event
      window.addEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }

  componentWillUnmount = () => {
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () => Utilities.clearSessionStorage(this.componentName + "GridState"));
  }
  

   getTerminalList() {
    try {

      let userShareholderList = [];
      let secondaryShareholders=this.props.userDetails.EntityResult.SecondaryShareholders;
  
      userShareholderList.push(this.props.userDetails.EntityResult.PrimaryShareholder);
      
      if (Array.isArray(secondaryShareholders)) {
        secondaryShareholders.forEach((sh) => {
        userShareholderList.push(sh);
      });
    }
      axios(
        RestAPIs.GetTerminals,
        Utilities.getAuthenticationObjectforPost(
          userShareholderList,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          )
            this.setState({ terminalOptions: result.EntityResult ,isReadyToRender:true});
          this.setState({ selectedTerminal: this.state.terminalOptions[0] });
          this.getLookUpData();
        }
      });
    } catch (err) {
      console.log("SiteViewComposite:Error occured on getTerminalsList", err);
    }
  }
  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=HSEInspection",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isEnable = true;
          switch (this.props.activeItem.itemProps.transportationType) {
            case Constants.TransportationType.ROAD:
              if (result.EntityResult.EnableRoad === "False") {
                isEnable = false;
              }
              break;
            case Constants.TransportationType.MARINE:
              if (result.EntityResult.EnableMarine === "False") {
                isEnable = false;
              }
              break;
            case Constants.TransportationType.RAIL:
              if (result.EntityResult.EnableRail === "False") {
                isEnable = false;
              }
              break;
            case Constants.TransportationType.PIPELINE:
              if (result.EntityResult.EnablePipeline === "False") {
                isEnable = false;
              }
              break;
            default:
              isEnable = true;
          }
          this.setState({ isEnable });
          if (isEnable) {
            const operationsVisibility = lodash.cloneDeep(
              this.state.operationsVisibility
            );
            operationsVisibility.add = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              this.props.activeItem.itemProps.transportationType +
                fnHSEConfiguration
            );
            this.setState({
              operationsVisibility,
              selectedShareholder:
                this.props.userDetails.EntityResult.PrimaryShareholder,
            });
            this.getHSEConfigurationList();
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  getHSEConfigurationList() {
    try {
      axios(
        RestAPIs.GetHSEConfigurationListForRole +
          "?TransportationType=" + 
          this.props.activeItem.itemProps.transportationType+ "&TerminalCode=" + this.state.selectedTerminal,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: {}, isReadyToRender: true });
            console.log("Error in getHSEConfigurationList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: {}, isReadyToRender: true });
          console.log("Error while getting HSEConfiguration List:", error);
        });
    } catch (error) {
      console.log(
        "HSEConfigurationComposite: Error occurred on getHSEConfigurationList",
        error
      );
    }
  }

  handleAdd = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.add = false;
      operationsVisibility.delete = false;
      operationsVisibility.terminal = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibility,
      });
    } catch (error) {
      console.log("HSEConfigurationComposite: Error occurred on handleAdd");
    }
  };

  handleBack = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        this.props.activeItem.itemProps.transportationType + fnHSEConfiguration
      );
      operationsVisibility.terminal= true;
      operationsVisibility.delete= false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibility,
        isReadyToRender: false,
      });
      this.getHSEConfigurationList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "HSEConfigurationComposite: Error occurred on Back click",
        error
      );
    }
  };

  handleRowClick = (item) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        this.props.activeItem.itemProps.transportationType + fnHSEConfiguration
      );
      operationsVisibility.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        this.props.activeItem.itemProps.transportationType + fnHSEConfiguration
      );
      operationsVisibility.terminal= false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibility,
      });
    } catch (error) {
      console.log(
        "HSEConfigurationComposite: Error occurred on handleRowClick",
        error
      );
    }
  };

  handleSelection = (items) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          this.props.activeItem.itemProps.transportationType +
            fnHSEConfiguration
        );

      this.setState({ selectedItems: items, operationsVisibility });
    } catch (error) {
      console.log(
        "HSEConfigurationComposite: Error occurred on handleSelection",
        error
      );
    }
  };

  handleTerminalSelectionChange = (terminal) => {
    try {
      this.setState({
        selectedTerminal: terminal,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: true,
      });
      this.getLookUpData();
    } catch (error) {
      console.log(
        "HSEConfigurationComposite:Error occured on handleTerminalSelectionChange",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      if (notification.messageType === "success") {
         operationsVisibility.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          this.props.activeItem.itemProps.transportationType +
                fnHSEConfiguration
        );
        operationsVisibility.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          this.props.activeItem.itemProps.transportationType +
                fnHSEConfiguration
        );
        this.setState({ isDetailsModified: true, operationsVisibility });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            HSE_TransportationUnit: data.TransportationUnit,
            HSE_TransportationUnitType: data.TransportationUnitType,
            LocationInfo_LocationType: data.LocationTypeCode,
            PipelineEntry_TransactionType: data.TransactionType,
            ViewReceipt_LastUpdatedTime: data.LastUpdatedTime,
          },
        ];
        this.setState({ selectedItems });
      }
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log(
        "HSEConfigurationComposite: Error occurred on savedEvent",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.delete = false;
      this.setState({ operationsVisibility });
      const deleteHSEConfigurationKeys = [];
      for (let selectItem of this.state.selectedItems) {
        const shCode = this.state.selectedShareholder;
        const KeyData = {
          ShareHolderCode: shCode,
          KeyCodes: [
            {
              key: "TransportationType",
              value: this.props.activeItem.itemProps.transportationType,
            },
            {
              key: "TransactionType",
              value: selectItem.PipelineEntry_TransactionType,
            },
            {
              key: "LocationType",
              value: selectItem.LocationInfo_LocationType,
            },
            {
              key: "TransportationUnit",
              value: selectItem.HSE_TransportationUnit,
            },
            {
              key: "TransportationUnitType",
              value: selectItem.HSE_TransportationUnitType,
            },
            {
              key: "TerminalCode",
              value: this.state.selectedTerminal,
            },
          ],
        };
        deleteHSEConfigurationKeys.push(KeyData);
      }

      axios(
        RestAPIs.DeleteHSEConfiguration,
        Utilities.getAuthenticationObjectforPost(
          deleteHSEConfigurationKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          let isRefreshDataRequire = result.isSuccess;
          if (
            response.ResultDataList !== null &&
            result.ResultDataList !== undefined
          ) {
            let failedResultsCount = result.ResultDataList.filter(function (
              res
            ) {
              return !res.IsSuccess;
            }).length;
            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else isRefreshDataRequire = true;
          }
          let notification = Utilities.convertResultsDatatoNotification(
            result,
            "HSE_Configuration_DeletionStatus",
            ["TransportationType"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false,showAuthenticationLayout: false });
            this.getHSEConfigurationList();
            operationsVisibility.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibility,
              selectedRow: {},
            });
          }

          // notification.messageResultDetails.forEach((messageResult) => {
          //   if (messageResult.KeyFields.length > 0) {
          //     messageResult.keyFields[0] = "RailReceipt_Code";
          //   }
          // });
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
          throw error;
        });
    } catch (error) {
      console.log("HSEConfigurationComposite: Error occurred on handleDelete");
    }
  };

  authenticateDelete = () => {
    try {
      let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showAuthenticationLayout });
      if (showAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("HSEConfigComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  
  
 getFunctionGroupName() {
  if(this.props.activeItem.itemProps.transportationType === Constants.TransportationType.RAIL)
    return fnRailHSEConfiguration;                   
  else  if(this.props.activeItem.itemProps.transportationType === Constants.TransportationType.MARINE)
    return fnMarineHSEConfiguration;
    else  if(this.props.activeItem.itemProps.transportationType === Constants.TransportationType.PIPELINE)
    return fnPipelineHSEConfiguration
  else  
    return fnRoadHSEConfiguration;
 };
 
  render() {
    let fillPage = true;
    let loadingClass = "globalLoader";
    return (
      <div>
        <ErrorBoundary>
          <HSEUserActionsComposite
            operationsVisibilty={this.state.operationsVisibility}
            breadcrumbItem={this.props.activeItem}
            onAdd={this.handleAdd}
            onDelete={this.authenticateDelete}
            terminalVisible={this.state.terminalVisible}
            terminals={this.state.terminalOptions}
            selectedTerminal={this.state.selectedTerminal}
            onTerminalChange={this.handleTerminalSelectionChange}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></HSEUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <HSEConfigurationDetailsComposite
              Key="HSEConfigurationDetails"
              transportationType={
                this.props.activeItem.itemProps.transportationType
              }
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              selectedShareholder={this.state.selectedShareholder}
              selectedTerminal={this.state.selectedTerminal}
            ></HSEConfigurationDetailsComposite>
          </ErrorBoundary>
        ) : (
          <div>
            {this.state.isReadyToRender ? (
              <ErrorBoundary>
                <div
                  className={
                    fillPage === true ? "compositeTransactionList" : ""
                  }
                >
                  <HSEConfigurationSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    exportFileName="HSEConfigurationList"
                    columnPickerRequired={true}
                    terminalsToShow={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .NoOfTerminalsToShow
                    }
                    selectionRequired={true}
                    columnGroupingRequired={true}
                    onSelectionChange={this.handleSelection}
                    onRowClick={this.handleRowClick}
                    parentComponent={this.componentName}
                  ></HSEConfigurationSummaryPageComposite>
                </div>
              </ErrorBoundary>
            ) : (
              <>
                {this.state.isEnable ? (
                  <LoadingPage
                    loadingClass={loadingClass}
                    message=""
                  ></LoadingPage>
                ) : (
                  <Error errorMessage="HSEConfigurationDisabled"></Error>
                )}
              </>
            )}
          </div>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={this.getFunctionGroupName()}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></UserAuthenticationLayout>
        ) : null}
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
const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HSEConfigurationComposite);
HSEConfigurationComposite.propTypes = {
  activeItem: PropTypes.object,
  shipmentSource: PropTypes.number,
  shipmentSourceCode: PropTypes.string,
  selectedShareholder: PropTypes.string,
};
