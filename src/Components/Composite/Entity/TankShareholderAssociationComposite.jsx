import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { TankShareholderAssociationSummaryComposite } from "../Summary/TankShareholderAssociationSummaryComposite";
import { TankShareholderAssociationViewAuditTrailDetails } from "../../UIBase/Details/TankShareholderAssociationViewAuditTrailDetails";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiTankShareholderAssociationList } from "../../../JS/KPIPageName";
import {
  functionGroups,
  fnKPIInformation,
  fnTankShareholderPrimeFunction,
} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import "react-toastify/dist/ReactToastify.css";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import * as Constants from "../../../JS/Constants";
import {
  tankShAsscVolumeValidationDef,
  tankShNewQtyValidationDef,
} from "../../../JS/DetailsTableValidationDef";
import Error from "../../Error";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Button } from "@scuf/common";

import UserAuthenticationLayout from "../Common/UserAuthentication";

class TankShareholderAssociationComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    operationsVisibilty: { shareholder: true },
    selectedItems: [],
    data: {},
    lookUpData: null,
    selectedShareholder: "",
    noOfSignificantDigits: "3", //To be used later
    isViewAuditTrail: false,
    auditTrailList: [],
    tankShareholderAssociationKPIList: [],
    allShareholder: [],
    shareholderList: [],
    modShareholderList: [],
    selectedTankShareholderDetails: [],
    modSelectedTankShareholderDetails: [],
    saveEnabled: false,
    showReport: false,
    isEnable: true,
    OverwriteGrossNetValues: false,
    isValidVolume: true,
    errorMsg: "",
    showAuthenticationLayout: false,
    tempSelectedTankShareholderDetails: {},

  };

  componentName = "TankShareholderAssociationComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLookUpData();
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite:Error occured on componentDidMount",
        error
      );
    }
    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage);
  }

  getLookUpData() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Commingling",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isEnable = true;

          if (result.EntityResult.EnableCommingling.toUpperCase() === "FALSE")
            isEnable = false;

          this.setState({
            isEnable,
            OverwriteGrossNetValues:
              result.EntityResult.OverwriteGrossNetValues.toUpperCase() ===
              "FALSE"
                ? false
                : true,
          });

          if (isEnable) {
            let allShareholder = lodash.cloneDeep(
              this.props.userDetails.EntityResult.ShareholderList
            );
            allShareholder.splice(0, 0, "All");

            let shareholderList = [];

            this.props.userDetails.EntityResult.ShareholderList.forEach(
              (item) => {
                shareholderList.push({
                  ShareholderCode: item,
                  Volume: null,
                });
              }
            );

            this.setState({
              selectedShareholder: allShareholder[0],
              allShareholder,
              shareholderList,
              modShareholderList: shareholderList,
            });

            this.GetTankShareholderList("");

            this.getKPIList(
              this.props.userDetails.EntityResult.PrimaryShareholder
            );
          }
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "TankShareholderAssociationComposite: Error occurred on getLookUpData",
          error
        );
      });
  }

  handleModalBack = () => {
    this.setState({ showReport: false });
  };

  renderModal() {
    let path = null;
    let ShareholderList =
      this.props.userDetails.EntityResult.ShareholderList.join(
        Constants.delimiter
      );
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/TankCominglingReport";
    } else {
      path = "TM/" + Constants.TMReports + "/TankCominglingReport";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      ShareholderList: ShareholderList,
      readonly: 1,
    };

    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleModalBack}
        handleModalClose={this.handleModalBack}
        // proxyServerHost="http://epksr5115dit:3625/TMWebAPI/"
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }

  handleViewReport = () => {
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
      this.setState({ showReport: true });
    }
  };

  getKPIList(shareholder) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      var notification = {
        message: "",
        messageType: "critical",
        messageResultDetails: [],
      };
      let objKPIRequestData = {
        PageName: kpiTankShareholderAssociationList,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }],
      };
      axios(
        RestAPIs.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              tankShareholderAssociationKPIList:
                result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ tankShareholderAssociationKPIList: [] });
            console.log(
              "Error in tank shareholder association KPIList:",
              result.ErrorList
            );
            notification.messageResultDetails.push({
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: result.ErrorList[0],
            });
          }
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
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting tank shareholder association KPIList:",
            error
          );
        });
    }
  }

  GetSignificantDigits() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Common",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult.NumberOfSignificantDigits !== undefined &&
              result.EntityResult.NumberOfSignificantDigits !== null
            ) {
              this.setState({
                noOfSignificantDigits:
                  result.EntityResult.NumberOfSignificantDigits,
              });
            }
          } else {
            console.log("Error in getSignificantDigits: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "TankShareholderAssociationComposite: Error occurred on getSignificantDigits",
            error
          );
        });
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite:Error occured on geting RefrenceSourceLookUp Value",
        error
      );
    }
  }

  componentWillUnmount = () => {
    // clear session storage
    Utilities.clearSessionStorage(this.componentName + "GridState");
    window.removeEventListener("beforeunload", () =>
      Utilities.clearSessionStorage(this.componentName + "GridState")
    );
  };

  GetTankShareholderList(shareholder) {
    try {
      axios(
        RestAPIs.GetTankShareholderBySearchFilter +
          "?shareholderCode=" +
          shareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              data: result.EntityResult,
              isReadyToRender: true,
            });
          } else {
            this.setState({
              data: [],
              isReadyToRender: true,
            });
            console.log("Error in getTankshareholder:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting getTankshareholder:", error);
        });
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite : Error while getting getTankshareholder list:",
        error
      );
    }
  }

  handleSelection = (items) => {
    if (items.length == 0)
      this.setState({
        isDetails: false,
        selectedItems: items,
        modShareholderList: this.state.shareholderList,
      });
    else
      this.setState({
        selectedItems: items,
        modShareholderList: this.state.shareholderList,
      });
  };

  ValidateShareHolderVolume(
    modShareholderList,
    value,
    cellData,
    modSelectedTankShareholderDetails
  ) {
    let noOfSignificantDigits = lodash.cloneDeep(
      this.state.noOfSignificantDigits
    );

    var notification = {
      message: "",
      messageType: "critical",
      messageResultDetails: [],
    };

    let validation = true;
    modShareholderList.forEach((shareholder) => {
      tankShAsscVolumeValidationDef.forEach((item) => {
        let err = "";
        if (item.validator !== undefined) {
          err = Utilities.validateField(
            item.validator,
            shareholder[item.field]
          );
        }
        if (err !== "") {
          validation = false;
          notification.messageResultDetails.push({
            keyFields: ["AccessCardInfo_Shareholder", item.displayName],
            keyValues: [shareholder.ShareholderCode, shareholder[item.field]],
            isSuccess: false,
            errorMessage: err,
          });

          let index = modShareholderList.findIndex((item) => {
            return item.ShareholderCode === cellData.rowData.ShareholderCode;
          });
          modShareholderList[index].Volume = null;

          this.setState({
            modShareholderList,
          });
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        }
      });
    });
    if (validation) {
      let errorMsg = "";
      if (parseFloat(value) > 100.0)
        errorMsg = "Commingling_IndividualStakeError";
      else {
        let total_stake = 0;
        modShareholderList.forEach((shareholder) => {
          if (shareholder.Volume !== null && shareholder.Volume !== undefined)
            total_stake += parseFloat(shareholder.Volume);
        });

        if (parseFloat(total_stake) > 100)
          errorMsg = "Commingling_CombinedStakeError";
        else {
          modSelectedTankShareholderDetails.forEach((item) => {
            if (item.ShareholderCode === cellData.rowData.ShareholderCode) {
              item.NewLimitQuantity = Math.round(
                item.TankCapacity * (value / 100),
                noOfSignificantDigits
              );

              if (
                item.TankGrossVolume !== 0 &&
                item.TankGrossVolume !== null &&
                item.TankGrossVolume !== undefined &&
                item.TankGrossVolume !== ""
              )
                item.CalculatedGrossVolume = Math.round(
                  (item.NewLimitQuantity / item.TankCapacity) *
                    item.TankGrossVolume,
                  noOfSignificantDigits
                );

              if (
                item.TankNetVolume !== 0 &&
                item.TankNetVolume !== null &&
                item.TankNetVolume !== undefined &&
                item.TankNetVolume !== ""
              )
                item.CalculatedNetVolume = Math.round(
                  (item.NewLimitQuantity / item.TankCapacity) *
                    item.TankNetVolume,
                  noOfSignificantDigits
                );
            }
          });
          this.setState({
            modSelectedTankShareholderDetails,
          });
        }
      }

      if (errorMsg !== "") {
        let index = modShareholderList.findIndex((item) => {
          return item.ShareholderCode === cellData.rowData.ShareholderCode;
        });
        modShareholderList[index].Volume = null;
        this.setState({
          isValidVolume: false,
          errorMsg,
          modShareholderList,
        });
      }
    }
  }

  handleFieldChange = (value, cellData, type) => {
    try {
      let modSelectedTankShareholderDetails = lodash.cloneDeep(
        this.state.modSelectedTankShareholderDetails
      );

      let modShareholderList = lodash.cloneDeep(this.state.modShareholderList);

      if (type === "shareholder") {
        let index = modShareholderList.findIndex((item) => {
          return item.ShareholderCode === cellData.rowData.ShareholderCode;
        });
        modShareholderList[index].Volume = value;

        this.setState(
          {
            modShareholderList,
          },
          () =>
            this.ValidateShareHolderVolume(
              modShareholderList,
              value,
              cellData,
              modSelectedTankShareholderDetails
            )
        );
      } else if (type === "grossQuantity") {
        let index = modSelectedTankShareholderDetails.findIndex((item) => {
          return (
            item.ShareholderCode === cellData.rowData.ShareholderCode &&
            item.TankCode === cellData.rowData.TankCode
          );
        });
        modSelectedTankShareholderDetails[index].CalculatedGrossVolume = value;
        this.setState({
          modSelectedTankShareholderDetails,
        });
      } else {
        let index = modSelectedTankShareholderDetails.findIndex((item) => {
          return (
            item.ShareholderCode === cellData.rowData.ShareholderCode &&
            item.TankCode === cellData.rowData.TankCode
          );
        });

        modSelectedTankShareholderDetails[index].NewLimitQuantity = value;

        this.setState({
          modSelectedTankShareholderDetails,
        });
      }
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite : Error in handleFieldChange"
      );
    }
  };

  UpdateTankShareholderAssociate(tankShareholderInfoList) {
    this.handleAuthenticationClose();
    try {
      let obj = {
        Entity: tankShareholderInfoList,
      };

      let notification = {
        messageType: "critical",
        message: "TankShareholderInfo_SavedStatus",
        messageResultDetails: [
          {
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateTankShareholderAssociate,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnTankShareholderPrimeFunction
              ),
              modShareholderList: lodash.cloneDeep(this.state.shareholderList),
            });
            this.GetTankShareholderAssociation();
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnTankShareholderPrimeFunction
              ),
            });
            console.log(
              "Error in Update Tank Shareholder Info:",
              result.ErrorList
            );
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
              functionGroups.add,
              fnTankShareholderPrimeFunction
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
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite : Error in UpdateTankShareholderAssociate"
      );
    }
  }

  handleReset = () => {
    try {
      this.setState({
        modSelectedTankShareholderDetails: lodash.cloneDeep(
          this.state.selectedTankShareholderDetails
        ),
        modShareholderList: lodash.cloneDeep(this.state.shareholderList),
      });
    } catch (error) {
      console.log("TankShareholderAssociationComposite : Error in handleReset");
    }
  };

  ValidateSave(modSelectedTankShareholderDetails) {
    let returnValue = true;
    try {
      let notification = {
        messageType: "critical",
        message: "TankShareholderInfo_SavedStatus",
        messageResultDetails: [],
      };
      if (modSelectedTankShareholderDetails.length > 0) {
        modSelectedTankShareholderDetails.forEach((item) => {
          tankShNewQtyValidationDef.forEach((col) => {
            let err = "";
            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, item[col.field]);
            }

            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: ["AtgConfigure_TankCode", col.displayName],
                keyValues: [item.TankCode, item[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });
        });
      } else {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage: "TankShareholderAssn_EnterProposedQtyMessage",
        });
      }

      if (notification.messageResultDetails.length > 0) {
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
        return false;
      }
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite : Error in ValidateSave"
      );
    }
    return returnValue;
  }

  handleUpdate = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempSelectedTankShareholderDetails = lodash.cloneDeep(this.state.tempSelectedTankShareholderDetails);

      this.UpdateTankShareholderAssociate(tempSelectedTankShareholderDetails);

    } catch (error) {
      console.log("Tank shareholder Association Composite : Error in UpdateTankShareholderAssociation");
    }
  };

  handleSave = () => {
    try {
      let modSelectedTankShareholderDetails = lodash.cloneDeep(
        this.state.modSelectedTankShareholderDetails
      );

      let tempmodSelectedTankShareholderDetails = [];

      modSelectedTankShareholderDetails.forEach((item) => {
        if (
          item.NewLimitQuantity !== null &&
          item.NewLimitQuantity !== undefined &&
          item.NewLimitQuantity !== ""
        ) {
          item.Active = true;
          item.NewLimitQuantity = Utilities.convertStringtoDecimal(
            item.NewLimitQuantity
          );
          tempmodSelectedTankShareholderDetails.push(item);
          item.LimitQuantity = item.NewLimitQuantity;
        }
      });

      if (this.ValidateSave(tempmodSelectedTankShareholderDetails))
        {
          let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
        
          let tempSelectedTankShareholderDetails = lodash.cloneDeep(tempmodSelectedTankShareholderDetails);
          this.setState({ showAuthenticationLayout, tempSelectedTankShareholderDetails }, () => {
            if (showAuthenticationLayout === false) {
              this.handleUpdate();
            }
        });
        }
      else
        this.setState({
          saveEnabled: true,
        });
    } catch (error) {
      console.log("TankShareholderAssociationComposite : Error in handleSave");
    }
  };

  GetTankShareholderAssociation() {
    try {
      axios(
        RestAPIs.GetTankShareholderAssociation,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let tankShareholderDetails = lodash.cloneDeep(result.EntityResult);
            let selectedItems = lodash.cloneDeep(this.state.selectedItems);
            let selectedShareholder = lodash.cloneDeep(
              this.state.selectedShareholder
            );
            let selectedTankShareholderDetails = lodash.cloneDeep(
              result.EntityResult
            );
            let selectedTanks = [];
            let dummyTankShareholderDetails = [];

            selectedItems.forEach((item) => {
              selectedTanks.push(item.Common_Code);
              this.props.userDetails.EntityResult.ShareholderList.forEach(
                (sh) => {
                  dummyTankShareholderDetails.push({
                    TankCode: item.Common_Code,
                    ShareholderCode: sh,
                    BaseProductCode: item.TankList_BaseProduct,
                    LimitQuantity: 0,
                    LimitQuantityPercentage: 0,
                    VolumeUOM: item.TankList_Units,
                    TankCapacity: item.TankList_Capacity,
                    TankGrossVolume: item.TankList_GrossVolume,
                    TankNetVolume: item.TankList_NetVolume,
                  });
                }
              );
            });

            selectedTankShareholderDetails =
              selectedTankShareholderDetails.filter((item) =>
                selectedTanks.includes(item.TankCode)
              );

            dummyTankShareholderDetails.forEach((selectedTank) => {
              let existing_tank_index =
                selectedTankShareholderDetails.findIndex((tank) => {
                  return (
                    tank.TankCode === selectedTank.TankCode &&
                    tank.BaseProductCode === selectedTank.BaseProductCode &&
                    tank.ShareholderCode === selectedTank.ShareholderCode
                  );
                });

              if (existing_tank_index < 0) {
                selectedTank.CalculatedGrossVolume = 0;
                selectedTank.CalculatedNetVolume = 0;
                selectedTankShareholderDetails.push(selectedTank);
              }
            });
            selectedTankShareholderDetails.forEach((item) => {
              if (selectedShareholder !== "All") {
                if (!selectedShareholder.includes(item.ShareholderCode)) {
                  item.LimitQuantity = 0;
                  item.CalculatedGrossVolume = 0;
                }
              } else {
                let userShareholders =
                  this.props.userDetails.EntityResult.ShareholderList;
                if (userShareholders.indexOf(item.ShareholderCode) === -1) {
                  item.LimitQuantity = 0;
                  item.CalculatedGrossVolume = 0;
                }
              }
              item.NewLimitQuantity = null;
              item.LimitQuantityPercentage = parseFloat(
                (item.LimitQuantity / item.TankCapacity) * 100
              ).toFixed(this.state.noOfSignificantDigits);
            });

            this.setState({
              tankShareholderDetails,
              isDetails: true,
              selectedTankShareholderDetails,
              modSelectedTankShareholderDetails: lodash.cloneDeep(
                selectedTankShareholderDetails
              ),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnTankShareholderPrimeFunction
              ),
            });
          } else {
            this.setState({
              tankShareholderDetails: [],
              isDetails: false,
              saveEnabled: false,
            });
            console.log(
              "Error in getTankShareholderAssociationDetails:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          this.setState({
            tankShareholderDetails: [],
            isDetails: false,
          });
          console.log(
            "Error while getting TankShareholderAssociationDetails:",
            error
          );
        });
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite: Error in GetTankShareholderAssociation"
      );
    }
  }

  handleEditTank = () => {
    this.GetTankShareholderAssociation();
  };

  handleViewAuditTrail = () => {
    try {
      let notification = {
        messageType: "critical",
        message: "TankShareholderAssociationViewAuditTrailStatus",
        messageResultDetails: [
          {
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.GetTankShareholderAuditTrial,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let auditTrailList = result.EntityResult.Table;

            if (Array.isArray(auditTrailList) && auditTrailList.length > 0) {
              auditTrailList.forEach((item) => {
                let time =
                  new Date(item.LastUpdatedTime).toLocaleDateString() +
                  " " +
                  new Date(item.LastUpdatedTime).toLocaleTimeString();

                item.LastUpdatedTime = time;
              });
            }
            let operationsVisibilty = { ...this.state.operationsVisibility };
            operationsVisibilty.shareholder = false;

            this.setState({
              auditTrailList: auditTrailList,
              isReadyToRender: false,
              isViewAuditTrail: true,
              operationsVisibilty,
            });
          } else {
            this.setState(
              {
                auditTrailList: [],
                isReadyToRender: true,
              },
              () => {
                notification.messageType = result.IsSuccess
                  ? "success"
                  : "critical";
                notification.messageResultDetails[0].isSuccess =
                  result.IsSuccess;
                notification.messageResultDetails[0].errorMessage =
                  result.ErrorList[0];
                toast(
                  <ErrorBoundary>
                    <NotifyEvent
                      notificationMessage={notification}
                    ></NotifyEvent>
                  </ErrorBoundary>,
                  {
                    autoClose:
                      notification.messageType === "success" ? 10000 : false,
                  }
                );
              }
            );
            console.log("Error in handleViewAuditTrail:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while handleViewAuditTrail:", error);
        });
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite:Error occured on getting view audit trail",
        error
      );
    }
  };

  inValidVolumePopUp = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={!this.state.isValidVolume} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t(this.state.errorMsg)}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isValidVolume: true });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  handleBack = () => {
    try {
      let operationsVisibilty = { ...this.state.operationsVisibility };
      operationsVisibilty.shareholder = true;

      this.setState(
        {
          isDetails: false,
          selectedItems: [],
          isViewAuditTrail: false,
          isReadyToRender: true,
          operationsVisibilty,
        },
        () => {
          this.GetTankShareholderList(
            this.state.selectedShareholder === "All"
              ? ""
              : this.state.selectedShareholder
          );
          this.getKPIList(
            this.state.selectedShareholder === "All"
              ? this.props.userDetails.EntityResult.PrimaryShareholder
              : this.state.selectedShareholder
          );
        }
      );
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite:Error occured on Back click",
        error
      );
    }
  };

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState(
        {
          selectedShareholder: shareholder,
          isReadyToRender: false,
          selectedItems: [],
          isDetails: false,
        },
        () => {
          this.GetTankShareholderList(shareholder === "All" ? "" : shareholder);
          this.getKPIList(
            shareholder === "All"
              ? this.props.userDetails.EntityResult.PrimaryShareholder
              : shareholder
          );
        }
      );
    } catch (error) {
      console.log(
        "TankShareholderAssociationComposite:Error occured on handleShareholderSelectionChange",
        error
      );
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
            operationsVisibilty={this.state.operationsVisibilty}
            shareholders={this.state.allShareholder}
            breadcrumbItem={this.props.activeItem}
            onShareholderChange={this.handleShareholderSelectionChange}
            selectedShareholder={this.state.selectedShareholder}
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isViewAuditTrail ? (
          <TankShareholderAssociationViewAuditTrailDetails
            auditTrailList={this.state.auditTrailList}
            handleBack={this.handleBack}
          ></TankShareholderAssociationViewAuditTrailDetails>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <KPIDashboardLayout
                kpiList={this.state.tankShareholderAssociationKPIList}
                pageName="TankShareholderAssociation"
              ></KPIDashboardLayout>
            </ErrorBoundary>
            <ErrorBoundary>
              <TankShareholderAssociationSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectedItems={this.state.selectedItems}
                onSelectionChange={this.handleSelection}
                handleViewAuditTrail={this.handleViewAuditTrail}
                exportRequired={true}
                exportFileName="TankShareholderAssociationList"
                columnPickerRequired={true}
                selectionRequired={true}
                columnGroupingRequired={true}
                parentComponent={this.componentName}
                isDetails={this.state.isDetails}
                handleEditTank={this.handleEditTank}
                isEnableModify={Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnTankShareholderPrimeFunction
                )}
                shareholderList={this.state.shareholderList}
                modShareholderList={this.state.modShareholderList}
                handleFieldChange={this.handleFieldChange}
                selectedTankShareholderDetails={
                  this.state.selectedTankShareholderDetails
                }
                modSelectedTankShareholderDetails={
                  this.state.modSelectedTankShareholderDetails
                }
                handleSave={this.handleSave}
                saveEnabled={this.state.saveEnabled}
                handleReset={this.handleReset}
                handleViewReport={this.handleViewReport}
                selectedShareholder={this.state.selectedShareholder}
                OverwriteGrossNetValues={this.state.OverwriteGrossNetValues}
              ></TankShareholderAssociationSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : this.state.isEnable ? (
          <LoadingPage message="Loading"></LoadingPage>
        ) : (
          <Error errorMessage="Commingling_Enable"></Error>
        )}
        {this.state.showReport ? this.renderModal() : ""}
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
        {!this.state.isValidVolume ? this.inValidVolumePopUp() : null}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnTankShareholderPrimeFunction}
            handleOperation={this.handleUpdate}
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

export default connect(mapStateToProps)(TankShareholderAssociationComposite);

TankShareholderAssociationComposite.propTypes = {
  activeItem: PropTypes.object,
};
