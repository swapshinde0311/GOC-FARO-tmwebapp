import React, { Component } from "react";
import { RailReceiptLoadSpotAssignDetails } from "../../UIBase/Details/RailReceiptLoadSpotAssignDetails";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { emptyRailReceipt } from "../../../JS/DefaultEntities";
import { railReceiptLoadSpotAssignmentDef } from "../../../JS/DetailsTableValidationDef";
import { functionGroups, fnRailReceiptUnloadSpotAssignment } from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import CommonConfirmModal from "../../UIBase/Common/CommonConfirmModal"

class RailReceiptLoadSpotAssignmentComposite extends Component {
  state = {
    spurCodeOptions: [],
    loadSpotClusterCodeOptions: [],
    loadSpotBCUCodeOptions: [],
    railWagonBatchPlanList: {},
    modRailWagonBatchPlanList: {},
    loadSpotAssignmentSaveEnabled: false,
    isReadyToRender: false,
    railReceipt: {},
    showAuthenticationLayout: false,
    isShowMultipleSpurs:false,
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.selectedWagonRow.TrailerCode === undefined)
        this.getRailWagon(nextProps.selectedWagonRow);
    } catch (error) {
      console.log(
        "RailReceiptLoadSpotAssignmentComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  getRailLoadSpotDevices(ParentEntityCode, EntityType) {
    axios(
      RestAPIs.GetRailLoadSpotDevices +
      "?ParentEntityCode=" +
      ParentEntityCode +
      "&EntityType=" +
      EntityType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true && Array.isArray(result.EntityResult)) {
          if (EntityType === "SPUR") {
            this.setState({
              spurCodeOptions: Utilities.transferListtoOptions(
                result.EntityResult
              ),
            });
          } else if (EntityType === "CLUSTER") {
            this.setState({
              loadSpotClusterCodeOptions: Utilities.transferListtoOptions(
                result.EntityResult
              ),
            });
          } else if (EntityType === "BCU") {
            this.setState({
              loadSpotBCUCodeOptions: Utilities.transferListtoOptions(
                result.EntityResult
              ),
            });
          }
          this.setState({ isReadyToRender: true });
        } else {
          console.log("Error in getRailLoadSpotDevices: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getRailLoadSpotDevices: ", error);
      });
  }

  GetRailLoadSpot(rowindx, EntityCode, EntityType) {
    axios(
      RestAPIs.GetRailLoadSpot +
      "?EntityCode=" +
      EntityCode +
      "&EntityType=" +
      EntityType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((Loadresponse) => {
        const result = Loadresponse.data;
        var modRailWagonBatchPlanList = lodash.cloneDeep(
          this.state.modRailWagonBatchPlanList
        );
        if (result.IsSuccess === true) {
          modRailWagonBatchPlanList[rowindx].BCUCode =
            result.EntityResult.BCUCode;
          modRailWagonBatchPlanList[rowindx].ClusterCode =
            result.EntityResult.ClusterCode;
          modRailWagonBatchPlanList[rowindx].ArmNoInBCU =
            result.EntityResult.ArmNoInBCU;
          if (
            modRailWagonBatchPlanList[rowindx].ClusterCode !== null ||
            modRailWagonBatchPlanList[rowindx].ClusterCode !== ""
          ) {
            this.getRailLoadSpotDevices(
              modRailWagonBatchPlanList[rowindx].ClusterCode,
              "BCU"
            );
          }
          this.setState({
            modRailWagonBatchPlanList,
            isReadyToRender: true,
          });
        } else {
          console.log("Error in GetRailLoadSpot: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in GetRailLoadSpot: ", error);
      });
  }
  getRailReceipt(selectedRow) {
    var transportationType = this.getTransportationType();
    emptyRailReceipt.TransportationType = transportationType;
    if (selectedRow.Common_Code === undefined) {
      this.setState({
        railReceipt: { ...emptyRailReceipt },
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
      ShareHolderCode: this.props.selectedShareholder,
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
          // if (result.EntityResult.ReceiptStatus === "READY") {
          //   this.setState({
          //     isReadyToRender: true,
          //     railReceipt: lodash.cloneDeep(result.EntityResult),
          //   });
          // } else {
          //   this.setState({
          //     isReadyToRender: true,
          //     railReceipt: lodash.cloneDeep(result.EntityResult),
          //   });
          // }
          this.setState({
            isReadyToRender: true,
            railReceipt: lodash.cloneDeep(result.EntityResult),
          });
        } else {
          this.setState({
            railReceipt: lodash.cloneDeep(emptyRailReceipt),
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
      this.initialLoadSpotAssignmentList();
      this.getRailLoadSpotDevices("", "SPUR");
    } catch (error) {
      console.log(
        "RailReceiptLoadSpotAssignmentComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getTransportationType() {
    var transportationType = Constants.TransportationType.RAIL;
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transportationType = genericProps.transportationType;
    }
    return transportationType;
  }

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  handleshareholderChange = (shareholderList) => {
    try {
      this.getTerminalsList(shareholderList);
    } catch (error) {
      console.log(
        "RailReceiptLoadSpotAssignmentComposite:Error occured on handleshareholderChange",
        error
      );
    }
  };

  initialLoadSpotAssignmentList(callback = () => { }) {
    var KeyCode = [
      {
        key: KeyCodes.receiptCode,
        value: this.props.selectedRow.Common_Code,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: KeyCode,
      keyDataCode: KeyCodes.railReceiptCode,
    };
    axios(
      RestAPIs.GetRailReceiptBatchPlanDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true && Array.isArray(result.EntityResult)) {
          this.setState({
            railWagonBatchPlanList: result.EntityResult,
            modRailWagonBatchPlanList: lodash.cloneDeep(result.EntityResult),
            loadSpotAssignmentSaveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnRailReceiptUnloadSpotAssignment
          ),
          });
        } else {
          this.setState({
            railWagonBatchPlanList: [],
            modRailWagonBatchPlanList: [],
            loadSpotAssignmentSaveEnabled: false,
          });
          console.log(
            "Error in GetRailReceiptBatchPlanDetails: ",
            result.ErrorList
          );
        }
        callback();
      })
      .catch((error) => {
        this.setState({
          railWagonBatchPlanList: [],
          modRailWagonBatchPlanList: [],
          loadSpotAssignmentSaveEnabled: false,
        });
        console.log(
          "Error while getting GetRailReceiptBatchPlanDetails: ",
          error
        );
      });
  }
  handleLoadSpotAssignmentAssignWagon = (railWagonBatchPlan) => {
    try {
      if (railWagonBatchPlan.AllowAuthorize) {
        const obj = {
          ShareHolderCode:
            this.props.userDetails.EntityResult.PrimaryShareholder,
          keyDataCode: KeyCodes.railReceiptCode,
          KeyCodes: [
            {
              key: KeyCodes.railReceiptCode,
              value: this.props.selectedRow.Common_Code,
            },
          ],
          Entity: railWagonBatchPlan,
        };
        const notification = {
          messageType: "critical",
          message: "ShipmentCompDetail_SavedStatus",
          messageResultDetails: [
            {
              keyFields: ["Rail_Receipt_Wagon"],
              keyValues: [railWagonBatchPlan.RailWagonCode],
              isSuccess: false,
              errorMessage: "",
            },
          ],
        };
        axios(
          RestAPIs.RailReceiptAuthorizeRailWagonPlan,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            const result = response.data;
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              notification.message = "RailReceipt_BatchAuthorize_Success";
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              console.log(
                "Error in handleLoadSpotAssignmentAssignWagon: ",
                result.ErrorList
              );
            }
            this.props.onSaved(this.props.selectedRow, "Authorize", notification);
          })
          .catch((error) => {
            notification.messageResultDetails[0].errorMessage = error;
            this.props.onSaved(this.props.selectedRow, "Authorize", notification);
          });
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite: Error occurred on handleLoadSpotAssignmentAssignWagon",
        error
      );
    }
  };
  handleLoadSpotAssignmentCellDataEdit = (newVal, cellData) => {
    const modRailWagonBatchPlanList = lodash.cloneDeep(
      this.state.modRailWagonBatchPlanList
    );

    modRailWagonBatchPlanList[cellData.rowIndex][cellData.field] = newVal;

    if (cellData.field === "SpurCode") {
      this.getRailLoadSpotDevices(newVal, "CLUSTER");
      this.GetRailLoadSpot(cellData.rowIndex, newVal, "SPUR");
    } else if (cellData.field === "ClusterCode") {
      this.getRailLoadSpotDevices(newVal, "BCU");
    }
    this.setState({ modRailWagonBatchPlanList });
  };
  handleLoadSpotAssignReset = () => {
    this.setState({
      modRailWagonBatchPlanList: lodash.cloneDeep(
        this.state.railWagonBatchPlanList
      ),
    });
  };

  saveLoadSpotAssign = () => {
    this.handleAuthenticationClose();
    const modRailWagonBatchPlanList = lodash.cloneDeep(
      this.state.modRailWagonBatchPlanList
    );

    this.setState({ loadSpotAssignmentSaveEnabled: false });
    const obj = {
      ShareHolderCode:
        this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: [
        {
          key: KeyCodes.railReceiptCode,
          value: this.props.selectedRow.Common_Code,
        },
      ],
      Entity: modRailWagonBatchPlanList,
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailReceipt_LoadSportAssignment_status",
      messageResultDetails: [
        {
          keyFields: ["ViewReceipt_ReceiptCode"],
          keyValues: [this.props.selectedRow.Common_Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateRailReceiptBatchPlan,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess
          ? "success"
          : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.initialLoadSpotAssignmentList();
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
        loadSpotAssignmentSaveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnRailReceiptUnloadSpotAssignment
      ),
          });
          console.log(
            "Error in handleLoadSpotAssignSave: ",
            result.ErrorList
          );
        }
        this.props.onSaved(
          this.props.selectedRow,
          "Update",
          notification
        );
      })
      .catch((error) => {
        this.setState({
          loadSpotAssignmentSaveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(
          this.props.selectedRow,
          "Update",
          notification
        );
      });

  }

  handleLoadSpotAssignSave = () => {
    try {
     
      const modRailWagonBatchPlanList = lodash.cloneDeep(
        this.state.modRailWagonBatchPlanList
      );
      if (this.validateLoadSpotAssignSave(modRailWagonBatchPlanList)) {
       
        let differentSpurs= false;
        modRailWagonBatchPlanList.forEach(function(item){
          let resArr  = modRailWagonBatchPlanList.filter(x => x.SpurCode != item.SpurCode);
          if(resArr.length>0)
          {
            differentSpurs= true;
          }
           
        });
        
     if(differentSpurs)
     {
      this.setState({ isShowMultipleSpurs: true });
     }
     else
     {
        this.saveLoadSpotAfterConfirm()
     }

      } else {
        this.setState({ loadSpotAssignmentSaveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnRailReceiptUnloadSpotAssignment
          ) });
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite: Error occurred on handleLoadSpotAssignSave",
        error
      );
    }
  };

  saveLoadSpotAfterConfirm  = () => {
    
    this.setState({ isShowMultipleSpurs: false });
    
    let showAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  
    this.setState({ showAuthenticationLayout, }, () => {
      if (showAuthenticationLayout === false) {
        this.saveLoadSpotAssign();
      }})

  }

  validateLoadSpotAssignSave(modRailWagonBatchPlanList) {
    const notification = {
      messageType: "critical",
      message: "ViewRailReceipt_LoadSportAssignment_status",
      messageResultDetails: [],
    };

    const railReceiptLoadSpotAssignmentDefMod = lodash.cloneDeep(
      railReceiptLoadSpotAssignmentDef
    );
    for (let item of modRailWagonBatchPlanList) {
      railReceiptLoadSpotAssignmentDefMod.forEach((col) => {
        let error = "";
        if (col.validator !== undefined) {
          error = Utilities.validateField(col.validator, item[col.field]);
        }
        if (error !== "") {
          notification.messageResultDetails.push({
            keyFields: ["Receipt_Code", col.displayName],
            keyValues: [this.props.selectedRow.Common_Code, item[col.field]],
            isSuccess: false,
            errorMessage: error,
          });
        }
      });
    }
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.props.selectedRow, "Validate", notification);
      return false;
    } else {
      return true;
    }
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
          <TMDetailsHeader
            entityCode={this.state.railReceipt.ReceiptCode}
            newEntityName="RailReceiptLoadSpotAssign_PageTitle"
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <RailReceiptLoadSpotAssignDetails
            listOptions={{
              spurCodes: this.state.spurCodeOptions,
              clusterCodes: this.state.loadSpotClusterCodeOptions,
              BCUCodes: this.state.loadSpotBCUCodeOptions,
            }}
            railReceipt={this.state.railReceipt}
            modRailWagonBatchPlanList={this.state.modRailWagonBatchPlanList}
            onCellDataEdit={this.handleLoadSpotAssignmentCellDataEdit}
            onAuthorize={this.handleLoadSpotAssignmentAssignWagon}
          ></RailReceiptLoadSpotAssignDetails>
        </ErrorBoundary>
        <ErrorBoundary>
              <CommonConfirmModal isOpen={this.state.isShowMultipleSpurs} confirmMessage="Confirm_RailReceiptSave"
                  handleNo={() => { this.setState({ isShowMultipleSpurs:false });
                }} handleYes={() => this.saveLoadSpotAfterConfirm()}></CommonConfirmModal>
          </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleLoadSpotAssignSave}
            handleReset={this.handleLoadSpotAssignReset}
            saveEnabled={this.state.loadSpotAssignmentSaveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>

        {this.state.showAuthenticationLayout  
          ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnRailReceiptUnloadSpotAssignment}
             handleClose={this.handleAuthenticationClose}
            handleOperation={this.saveLoadSpotAssign}
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

const mapWagonToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapWagonToProps
)(RailReceiptLoadSpotAssignmentComposite);

RailReceiptLoadSpotAssignmentComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
