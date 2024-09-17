import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TruckShipmentSummaryPageComposite } from "../Summary/TruckShipmentSummaryComposite";
import TruckShipmentManualEntryDetailsComposite from "../Details/TruckShipmentManualEntryDetailsComposite";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import {
  functionGroups,
  fnSBC,
  fnSBP,
  fnKPIInformation,
  fnCloseShipment,
  fnShipmentStatus,
  fnPrintBOL,
  fnPrintFAN,
} from "../../../JS/FunctionGroups";
import * as Utilities from "../../../JS/Utilities";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import axios from "axios";
import NotifyEvent from "../../../JS/NotifyEvent";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import * as KeyCodes from "../../../JS/KeyCodes";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
//import { emptyShipment } from "../../../JS/DefaultEntities";
import TruckShipmentDetailsComposite from "../Details/TruckShipmentDetailsComposite";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import lodash from "lodash";
import { TranslationConsumer } from "@scuf/localization";
import { TruckShipmentViewAuditTrailDetails } from "../../UIBase/Details/TruckShipmentViewAuditTrailDetails";
import { TruckShipmentViewLoadingDetails } from "../../UIBase/Details/TruckShipmentViewLoadingDetails";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiTruckShipmentList } from "../../../JS/KPIPageName";
import { shipmentStatusTimeAttributeEntity } from "../../../JS/AttributeEntity";
import {
  Modal,
  Button,
  Select,
  Input,
  Checkbox,
  VerticalMenu,
  Popup,
} from "@scuf/common";
import OrderComposite from "./OrderComposite";
import ContractComposite from "./ContractComposite";
import TruckShipmentSealDetailsComposite from "../Details/TruckShipmentSealDetailsComposite";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { DataTable } from "@scuf/datatable";

class TruckShipmentComposite extends Component {
  state = {
    shipment: {},
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: true, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
        this.props.selectedShareholder === null ||
        this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    popUpContent: [],
    data: {},
    terminalCodes: [],
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    shipmentNextOperations: [],
    currentShipmentStatuses: [],
    //lastStatus: "",
    shipmentType: "",
    isOperation: false,
    isManualEntry: false,
    isViewAuditTrail: false,
    auditTrailList: [],
    modAuditTrailList: [],
    truckShipmentKPIList: [],
    attributeMetaDataList: [],
    isViewLoadingDetails: false,
    modViewLoadingDetails: [],
    loadingExpandedRows: [],
    nonConfigColumns: [],
    isSealCompartments: false,
    sealCompartments: [],
    isRecordWeight: false,
    recordWeightList: [],
    weighBridgeCode: "",
    scadaValue: "",
    allowOutofRangeTW: false,
    isNotRevised: false,
    staticLoadingDetails: [],
    showReport: false,
    isCloseShipment: false,
    isVehicleCrippled: false,
    reasonForClosure: "",
    modCustomValues: {},
    drawerStatus: false,
    popUpOpen: false,
    isGoBackToSource: false,
    isContractDisable: false,
    isOrderDisable: false,
    activityInfo: [],
    isLadenWeightValid: false,
    ladenWeightError: "",
    vehicleForRecordWeight: {},
    showDeleteAuthenticationLayout: false,
    showAuthorizeToLoadAuthenticationLayout: false,
    showAllowToLoadAuthenticationLayout: false,
    showCloseShipmentAuthenticationLayout: false,
    showViewBOLAuthenticationLayout: false,
    showPrintBOLAuthenticationLayout: false,
    showFANAuthenticationLayout: false,
    isAllocateBay: false,
    bayData: [],
    selectBay: "",
    isDeAllocateBay: false,
    ShipmentBay: "",
  };

  componentName = "TruckShipmentComponent";

  populatePopupContents() {
    let popUpContent = [...this.state.popUpContent];
    let sbcfnAdd = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.add,
      fnSBC
    );
    let sbpfnAdd = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.add,
      fnSBP
    );
    if (sbcfnAdd) {
      popUpContent.push({
        fieldName: "ShipmentByCompartment",
        fieldValue: "ContractInfo_ShipByComp",
      });
    }
    if (sbpfnAdd) {
      popUpContent.push({
        fieldName: "ShipmentByProduct",
        fieldValue: "ContractInfo_ShipByProduct",
      });
    }
    const operationsVisibilty = { ...this.state.operationsVisibilty };
    operationsVisibilty.add = popUpContent.length > 0;
    this.setState({
      popUpContent,
      operationsVisibilty,
    });
  }

  handleAdd = (itemName) => {
    try {
      let shipmentType = "";
      if (itemName !== null) {
        shipmentType = itemName;
      } else {
        shipmentType = this.state.popUpContent[0].fieldName;
      }
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.shareholder = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        isManualEntry: false,
        isViewAuditTrail: false,
        isViewLoadingDetails: false,
        selectedRow: {},
        operationsVisibilty,
        shipmentType: shipmentType,
      });

      if (this.props.shipmentSource !== undefined)
        this.props.isShowBackButton(false);
    } catch (error) {
      console.log("TruckShipmentComposite:Error occured on handleAdd", error);
    }
  };

  getTerminalsList(shareholder) {
    try {
      if (shareholder !== null && shareholder !== "") {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(
            [shareholder],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ terminalCodes: response.data.EntityResult });
          }
        });
      } else {
        this.setState({ terminalCodes: [] });
      }
    } catch (error) {
      console.log(
        "DestinationComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  getVehicle(vehicleCode) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: vehicleCode,
      },
    ];
    let obj = {
      ShareHolderCode: this.state.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetVehicle,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            this.setState({
              vehicleForRecordWeight: result.EntityResult,
            });
          }
        } else {
          this.setState({
            vehicleForRecordWeight: {},
          });
          console.log("Error in GetVehicle:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ vehicleForRecordWeight: {} });
        console.log("Error while getting Vehicle:", error);
      });
  }

  GetViewAllShipmentCustomData(shipmentRow) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentRow.ShipmentCode,
      },
      {
        key: KeyCodes.shipmentStatus,
        value: shipmentRow.Status,
      },
      {
        key: KeyCodes.vehicleCode,
        value: shipmentRow.VehicleCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetViewAllShipmentCustomData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        if (response.data.IsSuccess) {
          this.setState({ modCustomValues: response.data.EntityResult });
        } else this.setState({ modCustomValues: {} });
        //this.setState({ modLoadingDetails: this.formLoadingCompartments(response.data.EntityResult) })
      })
      .catch((error) => {
        console.log(
          "Error while getting shipment custom details:",
          error,
          shipmentRow
        );
      });
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
      });
      this.getShipmentList(shareholder);
      this.getTerminalsList(shareholder);
      this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "TruckShipmentComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  //Get KPI for Truck Shipment
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
        PageName: kpiTruckShipmentList,
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
              truckShipmentKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ truckShipmentKPIList: [] });
            console.log("Error in truck shipment KPIList:", result.ErrorList);
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
          console.log("Error while getting truck shipment KPIList:", error);
        });
    }
  }

  getShipment(shipmentRow) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetShipment,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              shipment: result.EntityResult,
            },
            () => {
              this.getAttributes();
              this.getLoadingDetails(shipmentRow);
              this.getShipmentStatusOperations(result.EntityResult);
              this.getShipmentStatuses(shipmentRow);
              this.getVehicle(result.EntityResult.VehicleCode);
              this.GetBayByTrnsaction(
                result.EntityResult.ShipmentCode,
                "SHIPMENT",
                result.EntityResult.ShareholderCode
              );
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting Shipment:", error, shipmentRow);
      });
  }

  getLoadingDetails(shipmentRow) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentRow.ShipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetTruckShipmentLoadingDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        response.data.IsSuccess
          ? this.setState({ staticLoadingDetails: response.data.EntityResult })
          : this.setState({ staticLoadingDetails: [] });
      })
      .catch((error) => {
        console.log(
          "Error while getting Shipment Loading Details:",
          error,
          shipmentRow
        );
      });
  }

  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [shipmentStatusTimeAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
          });
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  getShipmentStatusOperations(shipmentItem) {
    try {
      //var shipmentStatus = shipmentItem.Status;
      //var isVolumneBased = shipmentItem.IsVolumeBased;

      let obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: 0,
        KeyCodes: null,
        Entity: shipmentItem,
      };

      axios(
        RestAPIs.GetShipmentOperations,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          let nextOperations = [];
          Object.keys(result.EntityResult).forEach((operation) => {
            if (result.EntityResult[operation]) nextOperations.push(operation);
          });

          // const index = nextOperations.indexOf(Constants.ViewAllShipmentOperations.ViewShipment_CloseShipment);
          // if (index > -1) {
          //   nextOperations.splice(index, 1);
          // }
          this.setState({ shipmentNextOperations: nextOperations });
        })
        .catch((error) => {
          console.log(
            "Error while getting getShipmentStatusOperations:",
            error
          );
        });
    } catch (error) {
      console.log(error);
    }
  }

  getShipmentStatuses(shipmentRow) {
    try {
      axios(
        RestAPIs.GetShipmentStatuses +
        "?shCode=" +
        this.state.selectedShareholder +
        "&shipmentCode=" +
        shipmentRow.Common_Code +
        "&shipmentType=" +
        shipmentRow.ViewShipmentStatus_ShipmentType,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          //let lastStatus = result.EntityResult.pop();
          this.setState({
            currentShipmentStatuses: result.EntityResult,
            //lastStatus: lastStatus,
          });
        })
        .catch((error) => {
          console.log("Error while getting getShipmentStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  handleSelection = (items) => {
    try {
      var { operationsVisibilty, drawerStatus, activityInfo } = {
        ...this.state,
      };
      let shipmentDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.SHIPMENT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });
      var shipmentDeleteStates = [];
      if (shipmentDeleteInfo !== undefined && shipmentDeleteInfo.length > 0)
        shipmentDeleteStates = shipmentDeleteInfo[0].ShipmentStates;

      let isReady =
        items.findIndex(
          (x) =>
            shipmentDeleteStates.indexOf(
              x.ViewShipmentStatus_ShipmentStatus.toUpperCase()
            ) < 0
        ) >= 0
          ? false
          : true;

      let productCount = items.filter(function (x) {
        return (
          x.ViewShipmentStatus_ShipmentType === Constants.shipmentType.PRODUCT
        );
      }).length;

      let compCount = items.filter(function (x) {
        return (
          x.ViewShipmentStatus_ShipmentType ===
          Constants.shipmentType.COMPARTMENT
        );
      }).length;

      let productFunctionGroup = true;
      if (productCount > 0)
        productFunctionGroup = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnSBP
        );
      let compartmentFunctionGroup = true;
      if (compCount > 0)
        compartmentFunctionGroup = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnSBC
        );

      operationsVisibilty.delete = this.props.userDetails.EntityResult
        .IsWebPortalUser
        ? false
        : isReady &&
        items.length > 0 &&
        compartmentFunctionGroup &&
        productFunctionGroup;

      if (items.length !== 1) {
        drawerStatus = true;
      } else {
        drawerStatus = false;
      }

      this.setState({
        selectedItems: items,
        operationsVisibilty,
        isOperation: false,
        drawerStatus,
        shipment: {}
      }, () => {
        if (items.length === 1) {
          this.getShipment(items[0]);
          this.setState({ isOperation: true, shipmentType:items[0].ViewShipmentStatus_ShipmentType, });
        }
      })
    } catch (error) {
      console.log(
        "TruckShipmentComposite:Error occured on handleSelection",
        error
      );
    }
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (this.props.shipmentSourceFromSummary) {
        const operationsVisibilty = { ...this.state.operationsVisibilty };
        operationsVisibilty.shareholder = false;
        operationsVisibilty.add = false;
        this.setState({
          isDetails: true,
          isManualEntry: false,
          isViewAuditTrail: false,
          isViewLoadingDetails: false,
          selectedRow: {},
          operationsVisibilty,
          shipmentType: this.props.shipmentType,
          selectedShareholder: this.props.selectedShareholder,
        });
      }
      this.populatePopupContents();
      this.GetShipmentActivityInfo();
      // this.CheckShipmentDeleteAllowed();
      this.getTerminalsList(this.state.selectedShareholder);
      this.getShipmentList(this.state.selectedShareholder);
      this.getKPIList(this.state.selectedShareholder);
      this.getlookupValues();
    } catch (error) {
      console.log(
        "TruckShipmentComposite:Error occured on ComponentDidMount",
        error
      );
    }

    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage);
  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage);
  };

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  };

  GetShipmentActivityInfo() {
    try {
      axios(
        RestAPIs.GetShipmentActivityInfo,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ activityInfo: response.data.EntityResult });
          }
        })
        .catch((error) => {
          console.log("Error while getting shipment activityInfo:", error);
        });
    } catch (error) {
      console.log("Error in GetShipmentActivityInfo:", error);
    }
  }

  getShipmentList(shareholder) {
    try {
      this.setState({ isReadyToRender: false });
      let obj = {
        ShareholderCode: shareholder,
        TransportationType: null,
        ScheduledFrom: null,
        ScheduledTo: null,
        ShipmentType: null,
        ShipmentFrom: null,
        ShipmentTypeCode: null,
      };
      if (this.props.shipmentSource !== undefined) {
        obj.ShipmentFrom = this.props.shipmentSource;
        obj.ShipmentType = Constants.shipmentTypeOptions.All;
        obj.ShipmentTypeCode = this.props.shipmentSourceCode;
      } else {
        let fromDate = new Date(this.state.fromDate);
        let toDate = new Date(this.state.toDate);
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);
        obj.ScheduledFrom = fromDate;
        obj.ScheduledTo = toDate;
        obj.ShipmentType = Constants.shipmentTypeOptions.All;
        obj.ShipmentFrom = Constants.shipmentFrom.All;
      }

      axios(
        RestAPIs.GetShipmentListForRole,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (this.props.shipmentSource !== undefined) {
            }
            this.setState(
              {
                data: result.EntityResult,
                isReadyToRender: true,
              },
              () => {
                if (
                  this.state.isOperation === true &&
                  this.state.selectedItems.length === 1
                ) {
                  let selectedItem = this.state.selectedItems[0];
                  var updatedselectedItem = result.EntityResult.Table.filter(
                    function (item) {
                      return item.Common_Code === selectedItem.Common_Code;
                    }
                  );

                  if (updatedselectedItem.length > 0) {
                    let { operationsVisibilty, activityInfo } = { ...this.state };
                    let shipmentDeleteInfo = activityInfo.filter((item) => {
                      return (
                        item.ActivityCode ===
                        Constants.ShipmentActivityInfo.SHIPMENT_ENABLE_DELETE &&
                        item.ActionTypeCode === Constants.ActionTypeCode.CHECK
                      );
                    });

                    var shipmentDeleteStates = [];
                    if (
                      shipmentDeleteInfo !== undefined &&
                      shipmentDeleteInfo.length > 0
                    )
                      shipmentDeleteStates = shipmentDeleteInfo[0].ShipmentStates;

                    operationsVisibilty.delete = this.props.userDetails
                      .EntityResult.IsWebPortalUser
                      ? false
                      : shipmentDeleteStates.indexOf(
                        updatedselectedItem[0].ViewShipmentStatus_ShipmentStatus.toUpperCase()
                      ) > -1 &&
                      Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.remove,
                        updatedselectedItem[0]
                          .ViewShipmentStatus_ShipmentType ===
                          Constants.shipmentType.PRODUCT
                          ? fnSBP
                          : fnSBC
                      );

                    this.setState({
                      selectedItems: updatedselectedItem,
                      operationsVisibilty,
                    });
                    this.getShipment(updatedselectedItem[0]);
                  }
                }
              }
            );
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in GetShipmentListForRole:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting Shipment List:", error);
        });
    } catch (error) {
      this.setState({ isReadyToRender: true });
      console.log(error);
    }
  }

  handleAuthorizeToLoad(shipmentItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.shipmentStatus,
        value: shipmentItem.Status,
      },
      {
        key: KeyCodes.shipmentCode,
        value: shipmentItem.ShipmentCode,
      },
      {
        key: KeyCodes.driverCode,
        value: shipmentItem.DriverCode,
      },
      {
        key: KeyCodes.vehicleCode,
        value: shipmentItem.VehicleCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.AuthorizeToLoad,
      Utilities.getAuthenticationObjectforPost(
        obj,
        token
        //this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AuthorizeToLoad:", error);
      });
  }

  getlookupValues() {
    try {
      let sbcAdd = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnSBC
      );
      if (sbcAdd) {
        axios(
          RestAPIs.GetLookUpData + "?LookUpTypeCode=Contract",
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              isContractDisable:
                result.EntityResult["EnableContract"] === "0" ? false : true,
            });
          }
        });
        axios(
          RestAPIs.GetLookUpData + "?LookUpTypeCode=Order",
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              isOrderDisable:
                result.EntityResult["EnableOrder"] === "0" ? false : true,
            });
          }
        });
      }
    } catch (error) {
      console.log(
        "TruckShipmentComposite:Error occured on getLookUpData",
        error
      );
    }
  }

  handleAllowToLoad(shipmentItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.shipmentStatus,
        value: shipmentItem.Status,
      },
      {
        key: KeyCodes.shipmentCode,
        value: shipmentItem.ShipmentCode,
      },
      {
        key: KeyCodes.driverCode,
        value: shipmentItem.DriverCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.AllowToLoad,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AllowToLoad:", error);
      });
  }

  closeShipment = () => {
    let showCloseShipmentAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showCloseShipmentAuthenticationLayout }, () => {
      if (showCloseShipmentAuthenticationLayout === false) {
        this.handleShipmentClose();
      }
    });
  };

  handleShipmentClose = () => {
    this.handleAuthenticationClose();
    try {
      let notification = {
        messageType: "critical",
        message: "ViewAllShipment_ShipmentClose",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      let entity = this.formCloseShipmentRequest();
      var keyCode = [
        {
          key: KeyCodes.shareholderCode,
          value: this.state.selectedShareholder,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.shipment.ShipmentCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: KeyCodes.shipmentCode,
        KeyCodes: keyCode,
        Entity: entity,
      };
      axios(
        RestAPIs.CloseShipment,
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
            this.getShipmentList(this.state.selectedShareholder);
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
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
          console.log("Error while shipment close:", error);
        });
    } catch (error) {
      console.log("Error while closing the shipment:", error);
    }
  };

  formCloseShipmentRequest() {
    try {
      //let loadingDetails = lodash.cloneDeep(this.state.staticLoadingDetails)
      let ViewAllTruckShipmentLoadingDetails = {
        topUpDecantApprovalStatus: "",
        topUpDecantEnabled: "",
        Remarks: "",
        listShipmentCompartmentInfo: [],
        listShipmentLoadingCompData: [],
      };
      ViewAllTruckShipmentLoadingDetails.topUpDecantApprovalStatus =
        this.state.modCustomValues.TopUpDecantStatusText;
      ViewAllTruckShipmentLoadingDetails.topUpDecantEnabled =
        this.state.modCustomValues.EnableTopUpDecant;
      ViewAllTruckShipmentLoadingDetails.Remarks = this.state.reasonForClosure;

      return ViewAllTruckShipmentLoadingDetails;
    } catch (error) {
      console.log(
        "Error while forming request for closing the shipment:",
        error
      );
    }
  }

  handleCloseShipmentModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isCloseShipment} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewShipment_CloseHeader") +
                    " : " +
                    this.state.shipment.ShipmentCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-9">
                  <label>{t("CloseShipment_VehicleCrippled")}</label>
                </div>
                <div>
                  <Checkbox
                    checked={this.state.isVehicleCrippled}
                    onChange={(cellData) => {
                      this.setState({ isVehicleCrippled: cellData }, () => {
                        if (cellData)
                          this.setState({ reasonForClosure: "Crippled" });
                        else this.setState({ reasonForClosure: "" });
                      });
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.reasonForClosure}
                    label={t("ViewShipment_Reason")}
                    disbaled={this.state.isVehicleCrippled ? true : false}
                    reserveSpace={false}
                    onChange={(value) => {
                      this.setState({ reasonForClosure: value });
                    }}
                  />
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  if (this.state.reasonForClosure === "") {
                    let notification = {
                      messageType: "critical",
                      message: "ViewAllShipment_ShipmentClose",
                      messageResultDetails: [
                        {
                          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
                          keyValues: [this.state.shipment.ShipmentCode],
                          isSuccess: false,
                          errorMessage: "Enter_ReasonForCloseure",
                        },
                      ],
                    };

                    toast(
                      <ErrorBoundary>
                        <NotifyEvent
                          notificationMessage={notification}
                        ></NotifyEvent>
                      </ErrorBoundary>,
                      {
                        autoClose:
                          notification.messageType === "success"
                            ? 10000
                            : false,
                      }
                    );
                  } else
                    this.setState({ isCloseShipment: false }, () => {
                      this.closeShipment();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    isCloseShipment: false,
                    isVehicleCrippled: false,
                    reasonForClosure: "",
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmRecordLadenWeight = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isLadenWeightValid} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>
                  {t(this.state.ladenWeightError) +
                    t("ConfirmCaptureLadenWeight")}
                </h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isLadenWeightValid: false }, () => {
                    this.RecordLadenWeight();
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isLadenWeightValid: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmAllowToLoad = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isNotRevised} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("ViewShipment_ConfirmAllowToLoad")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isNotRevised: false }, () => {
                    this.allowToLoad();
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isNotRevised: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  printBOLClick = () => {
    let showPrintBOLAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showPrintBOLAuthenticationLayout }, () => {
      if (showPrintBOLAuthenticationLayout === false) {
        this.printBOL();
      }
    });
  };

  printBOL = () => {
    this.handleAuthenticationClose();
    let shipment = lodash.cloneDeep(this.state.shipment);

    let notification = {
      messageType: "critical",
      message: "ViewShipmentStatus_PrintBOL_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [shipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    this.handlePrintBOL(
      shipment.ShipmentCode,
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        // if (result.IsSuccess === true) {
        //   this.getShipmentList(this.state.selectedShareholder);
        // }
        // else {
        notification.messageResultDetails[0].errorMessage = result.ErrorList[0];
        //}
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    );
  };

  printFANClick = () => {
    let showFANAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showFANAuthenticationLayout }, () => {
      if (showFANAuthenticationLayout === false) {
        this.printFAN();
      }
    });
  };

  printFAN = () => {
    this.handleAuthenticationClose();
    let shipment = lodash.cloneDeep(this.state.shipment);

    let notification = {
      messageType: "critical",
      message: "ViewShipmentStatus_PrintFAN_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [shipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    this.handlePrintFAN(
      shipment.ShipmentCode,
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;

        notification.messageResultDetails[0].errorMessage = result.ErrorList[0];

        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    );
  };

  allowToLoad = () => {
    let showAllowToLoadAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showAllowToLoadAuthenticationLayout }, () => {
      if (showAllowToLoadAuthenticationLayout === false) {
        this.ConfirmedAllowToLoad();
      }
    });
  };

  ConfirmedAllowToLoad = () => {
    let shipment = lodash.cloneDeep(this.state.shipment);
    let notification = {
      messageType: "critical",
      message: "ViewShipment_AllowToLoad_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [shipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    this.handleAllowToLoad(
      lodash.cloneDeep(this.state.shipment),
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getShipmentList(this.state.selectedShareholder);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    );
  };

  handlePrintFAN(shipmentCode, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.PrintFAN,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while handlePrintFAN:", error);
      });
  }

  handleSendBOL(shipmentCode, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.SendBOL,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while handleSendBOL:", error);
      });
  }

  handlePrintBOL(shipmentCode, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.PrintBOL,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while handlePrintBOL:", error);
      });
  }

  handleBSIOutbound(shipmentCode, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.BSIOutbound,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while handleBSIOutbound:", error);
      });
  }

  handleSealCompartments(shipmentCode, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetSealCompartmentsforShipment,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while handleBSIOutbound:", error);
      });
  }

  handleSealClose = () => {
    this.setState({
      isSealCompartments: false,
      sealCompartments: [],
    });
  };

  handleViewAuditTrail(shCode, shipmentCode, shipmentType, token, callback) {
    axios(
      RestAPIs.GetTruckAuditTrailInfo +
      "?shCode=" +
      shCode +
      "&shipmentCode=" +
      shipmentCode +
      "&shipmentType=" +
      shipmentType,
      //shipmentRow.ViewShipmentStatus_ShipmentType,
      Utilities.getAuthenticationObjectforGet(token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while getting handleViewAuditTrail:", error);
      });
  }

  handleViewLoadingDetails(shipmentCode, shCode, token, callback) {
    axios(
      RestAPIs.GetLoadingDetails +
      "?shipmentCode=" +
      shipmentCode +
      "&shCode=" +
      shCode,
      Utilities.getAuthenticationObjectforGet(token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while getting handleViewLoadingDetails:", error);
      });
  }

  formReadonlyCompAttributes(attributes, attributeMetaDataList) {
    let compAttributes = [];
    if (
      attributeMetaDataList !== null &&
      attributeMetaDataList !== undefined &&
      attributeMetaDataList.length > 0
    ) {
      attributeMetaDataList.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          //if (attribute.TerminalCode)
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName
              ? attribute.DisplayName
              : attribute.Code,
            AttributeValue: attribute.DefaultValue,
            TerminalCode: attribute.TerminalCode,
            IsMandatory: attribute.IsMandatory,
            DataType: attribute.DataType,
            IsReadonly: attribute.IsReadonly,
            MinValue: attribute.MinValue,
            MaxValue: attribute.MaxValue,
            ValidationFormat: attribute.ValidationFormat,
            compSequenceNo: "",
          });
        });
      });
    }

    if (
      attributes !== null &&
      attributes !== undefined &&
      attributes.length > 0
    ) {
      attributes.forEach((att) => {
        compAttributes.forEach((compAtt) => {
          if (compAtt.TerminalCode === att.TerminalCode) {
            att.ListOfAttributeData.forEach((selAtt) => {
              if (compAtt.AttributeCode === selAtt.AttributeCode)
                compAtt.AttributeValue = selAtt.AttributeValue;
            });
          }
        });
      });
    }
    return compAttributes;
  }

  getRecordWeightList() {
    axios(
      RestAPIs.GetWeighBridgeList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        this.setState({
          isRecordWeight: true,
          recordWeightList: result.EntityResult,
        });
      })
      .catch((error) => {
        console.log("Error while getting RecordWeightList:", error);
      });
  }

  handleModalBack = () => {
    this.setState({ showReport: false });
  };

  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/TMBOL";
    } else {
      path = "TM/" + Constants.TMReports + "/TMBOL";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      Shareholder: this.state.selectedShareholder,
      ShipmentCode:
        this.state.selectedItems.length === 1
          ? this.state.selectedItems[0].Common_Code
          : this.state.selectedRow.Common_Code,
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

  handleViewBOL = () => {
    this.handleAuthenticationClose();
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

  authorizeToLoadOnClick = () => {
    let showAuthorizeToLoadAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showAuthorizeToLoadAuthenticationLayout }, () => {
      if (showAuthorizeToLoadAuthenticationLayout === false) {
        this.authorizeToLoad();
      }
    });
  };

  authorizeToLoad = () => {
    this.handleAuthenticationClose();

    let shipment = lodash.cloneDeep(this.state.shipment);

    let notification = {
      messageType: "critical",
      message: "ViewShipment_AuthorizeLoad_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [shipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    this.handleAuthorizeToLoad(
      lodash.cloneDeep(this.state.shipment),
      this.state.selectedShareholder,
      this.props.tokenDetails.tokenInfo,
      (result) => {
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getShipmentList(this.state.selectedShareholder);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      }
    );
  };

  handleOperationClick = (operation) => {
    let shipment = lodash.cloneDeep(this.state.shipment);

    let notification = {
      messageType: "critical",
      message: operation + "_status",
      messageResultDetails: [
        {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [shipment.ShipmentCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    switch (operation) {
      case Constants.ViewAllShipmentOperations.ViewShipment_AuthorizeLoad:
        this.authorizeToLoadOnClick();

        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_AllowToLoad:
        let staticLoadingDetails = lodash.cloneDeep(
          this.state.staticLoadingDetails
        );
        let rows = staticLoadingDetails.filter((item) => {
          return item.Planned_Quantity !== item.Revised_Planned_Quantity;
        });
        if (rows.length <= 0) this.setState({ isNotRevised: true });
        else {
          this.allowToLoad();
        }
        break;
      case Constants.ViewAllShipmentOperations.ManualEntry:
        this.setState({ isManualEntry: true, isDetails: false }, () => {
          if (this.props.shipmentSource !== undefined)
            this.props.isShowBackButton(false);
        });
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_RecordWeight:
        this.getRecordWeightList();
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_CloseShipment:
        this.setState({ isCloseShipment: true });
        break;
      case Constants.ViewAllShipmentOperations.ViewShipmentStatus_PrintFAN:
        this.printFANClick();
        break;
      case Constants.ViewAllShipmentOperations.ViewShipmentStatus_PrintBOL:
        this.printBOLClick();
        break;
      case Constants.ViewAllShipmentOperations.ViewShipmentStatus_ViewBOL:
        let showViewBOLAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;

        this.setState({ showViewBOLAuthenticationLayout }, () => {
          if (showViewBOLAuthenticationLayout === false) {
            this.handleViewBOL();
          }
        });

        break;
      case Constants.ViewAllShipmentOperations.ViewAllShipment_SendBOL:
        this.handleSendBOL(
          shipment.ShipmentCode,
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            // if (result.IsSuccess === true) {
            //   this.getShipmentList(this.state.selectedShareholder);
            // }
            // else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            //}
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
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewAllShipment_BSIOutbound:
        this.handleBSIOutbound(
          shipment.ShipmentCode,
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            // if (result.IsSuccess === true) {
            //   this.getShipmentList(this.state.selectedShareholder);
            // }
            // else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            //}
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
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_ViewAuditTrail:
        this.handleViewAuditTrail(
          this.state.selectedShareholder,
          shipment.ShipmentCode,
          this.state.selectedItems[0].ViewShipmentStatus_ShipmentType,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              let modAuditTrailList = result.EntityResult;
              let attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList.SHIPMENTSTATUSTIME
              );

              for (let i = 0; i < modAuditTrailList.length; i++) {
                modAuditTrailList[i].UpdatedTime =
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
              }
              let auditTrailList = result.EntityResult;
              for (let i = 0; i < auditTrailList.length; i++) {
                auditTrailList[i].AttributesforUI =
                  this.formReadonlyCompAttributes(
                    auditTrailList[i].Attributes,
                    attributeMetaDataList
                  );
              }

              var { operationsVisibilty } = { ...this.state };
              operationsVisibilty.add = false;
              operationsVisibilty.delete = false;
              this.setState({
                operationsVisibilty,
                auditTrailList: auditTrailList,
                modAuditTrailList: modAuditTrailList,
                isViewAuditTrail: true,
              });
              if (this.props.shipmentSource !== undefined)
                this.props.isShowBackButton(false);
            } else {
              notification.messageType = result.IsSuccess
                ? "success"
                : "critical";
              notification.messageResultDetails[0].isSuccess = result.IsSuccess;
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
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
          }
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewShipment_ViewLoadingDetails:
        this.handleViewLoadingDetails(
          shipment.ShipmentCode,
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              let modViewLoadingDetails = result.EntityResult;
              let nonConfigColumns = [];
              if (
                modViewLoadingDetails !== null &&
                modViewLoadingDetails.Table !== null &&
                modViewLoadingDetails.Table.length > 0
              ) {
                let count = 0;
                modViewLoadingDetails.Table.forEach((item) => {
                  item.seqNo = count;
                  item.endtime =
                    new Date(item.endtime).toLocaleDateString() +
                    " " +
                    new Date(item.endtime).toLocaleTimeString();
                  item.starttime =
                    new Date(item.starttime).toLocaleDateString() +
                    " " +
                    new Date(item.starttime).toLocaleTimeString();
                  count++;
                  item.productcode = item.productcode.split("&nbsp;").join(" ");
                });
              }

              if (
                modViewLoadingDetails !== null &&
                modViewLoadingDetails.Table1 !== null &&
                modViewLoadingDetails.Table1.length > 0
              ) {
                nonConfigColumns =
                  modViewLoadingDetails.Table1[0].NonConfiguredColumns.split(
                    ","
                  );
              }

              var { operationsVisibilty } = { ...this.state };
              operationsVisibilty.add = false;
              operationsVisibilty.delete = false;
              this.setState({
                operationsVisibilty,
                modViewLoadingDetails: modViewLoadingDetails,
                isViewLoadingDetails: true,
                nonConfigColumns: nonConfigColumns,
              });

              if (this.props.shipmentSource !== undefined)
                this.props.isShowBackButton(false);
            } else {
              notification.messageType = result.IsSuccess
                ? "success"
                : "critical";
              notification.messageResultDetails[0].isSuccess = result.IsSuccess;
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
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
          }
        );
        break;
      case Constants.ViewAllShipmentOperations.ViewAllShipment_SealCompartments:
        this.handleSealCompartments(
          shipment.ShipmentCode,
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              //let sealCompartments = []
              this.setState({
                isSealCompartments: true,
                sealCompartments: result.EntityResult,
              });
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
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
          }
        );
        break;
      case "ViewAllocateBay_AllocateBay":
        this.getBays();
        break;
      case "ViewAllocateBay_DeallocateBay":
        this.setState({
          isDeAllocateBay: true,
        });
        break;
      default:
        return;
    }
  };

  getBays = () => {
    let shipment = lodash.cloneDeep(this.state.shipment);
    let products = [];
    shipment.ShipmentCompartments.forEach((element) => {
      products.push(element.FinishedProductCode);
    });

    const obj = {
      ShareHolderCode: this.state.selectedShareholder,
      KeyCodes: [
        {
          key: "TransactionType",
          value: "SHIPMENT",
        },
        {
          key: "TransportationType",
          value: "ROAD",
        },
        {
          key: "TerminalCode",
          value: this.state.shipment.ActualTerminalCode,
        },
        {
          key: "FinishedProductCode",
          value: products.toString(),
        },
      ],
    };

    axios(
      RestAPIs.GetAllValidBays,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let bayAllocation = result.EntityResult;
          bayAllocation.forEach((element) => {
            element.SupportedProducts.forEach((ele) => {
              if (
                element.AssociatedProduct === "" ||
                element.AssociatedProduct === undefined
              ) {
                element.AssociatedProduct = ele.Code;
              } else {
                element.AssociatedProduct += "," + ele.Code;
              }
            });
          });

          this.setState({
            bayData: bayAllocation,
            isAllocateBay: true,
          });
        } else {
          this.setState({
            bayData: [],
            isAllocateBay: true,
          });
          console.log("Error in getBays:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ bayData: [], isReadyToRender: true });
        console.log("Error while getBays:", error);
      });
  };

  handleRowClick = (item) => {
    try {
      let { operationsVisibilty, activityInfo } = { ...this.state };
      let shipmentDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.SHIPMENT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var shipmentDeleteStates = [];
      if (shipmentDeleteInfo !== undefined && shipmentDeleteInfo.length > 0)
        shipmentDeleteStates = shipmentDeleteInfo[0].ShipmentStates;

      operationsVisibilty.add = this.state.popUpContent.length > 0;
      let shipmentType = "";

      if (
        item.ViewShipmentStatus_ShipmentType ===
        Constants.shipmentType.COMPARTMENT
      ) {
        shipmentType = fnSBC;
        operationsVisibilty.delete = this.props.userDetails.EntityResult
          .IsWebPortalUser
          ? false
          : shipmentDeleteStates.indexOf(
            item.ViewShipmentStatus_ShipmentStatus.toUpperCase()
          ) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnSBC
          );
      }

      if (
        item.ViewShipmentStatus_ShipmentType === Constants.shipmentType.PRODUCT
      ) {
        shipmentType = fnSBP;
        operationsVisibilty.delete = this.props.userDetails.EntityResult
          .IsWebPortalUser
          ? false
          : shipmentDeleteStates.indexOf(
            item.ViewShipmentStatus_ShipmentStatus.toUpperCase()
          ) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnSBP
          );
      }
      operationsVisibilty.shareholder = false;

      if (this.props.shipmentSource !== undefined)
        this.props.isShowBackButton(false);
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
        shipmentType: shipmentType,
      });
    } catch (error) {
      console.log("TruckShipmentComposite:Error occured on Row click", error);
    }
  };

  handleDelete = () => {
    // console.log("Clicked Delete", this.state.selectedItems);
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteShipmentsKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var shCode = this.state.selectedShareholder;
        var shipmentCode = this.state.selectedItems[i]["Common_Code"];
        var shipmentType =
          this.state.selectedItems[i]["ViewShipmentStatus_ShipmentType"];
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [
            { Key: KeyCodes.shipmentCode, Value: shipmentCode },
            { Key: KeyCodes.shipmentType, Value: shipmentType },
          ],
        };
        deleteShipmentsKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteShipment,
        Utilities.getAuthenticationObjectforPost(
          deleteShipmentsKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.IsSuccess;
          if (
            result.ResultDataList !== null &&
            result.ResultDataList !== undefined
          ) {
            var failedResultsCount = result.ResultDataList.filter(function (
              res
            ) {
              return !res.IsSuccess;
            }).length;
            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else isRefreshDataRequire = true;
          }
          var notification = Utilities.convertResultsDatatoNotification(
            result,
            "Shipment_DeletionStatus",
            ["ShipmentCode"]
          );
          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.handleAuthenticationClose();
            this.getShipmentList(this.state.selectedShareholder);
            this.getKPIList(this.state.selectedShareholder);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
            });
            this.handleAuthenticationClose();
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty });
            this.handleAuthenticationClose();
          }
          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] =
                "ShipmentByCompartmentList_ShipmentCode";
          });
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
          console.log(
            "TruckShipmentComposite:Error occured on handleDelete",
            error
          );
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({ operationsVisibilty });
          this.handleAuthenticationClose();
        });
    } catch (error) {
      console.log(
        "TruckShipmentComposite:Error occured on handleDelete",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      let { operationsVisibilty, activityInfo } = { ...this.state };
      let shipmentDeleteInfo = activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.SHIPMENT_ENABLE_DELETE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });

      var shipmentDeleteStates = [];
      if (shipmentDeleteInfo !== undefined && shipmentDeleteInfo.length > 0)
        shipmentDeleteStates = shipmentDeleteInfo[0].ShipmentStates;

      if (notification.messageType === "success") {
        operationsVisibilty.add = this.state.popUpContent.length > 0;
        operationsVisibilty.delete = this.props.userDetails.EntityResult
          .IsWebPortalUser
          ? false
          : shipmentDeleteStates.indexOf(data.Status.toUpperCase()) > -1 &&
          Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            data.ShipmentType === 0 ? fnSBC : fnSBP
          );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.ShipmentCode,
            Common_Shareholder: this.state.selectedShareholder,
            ViewShipmentStatus_ShipmentType:
              data.ShipmentType === 0
                ? Constants.shipmentType.COMPARTMENT
                : Constants.shipmentType.PRODUCT,
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
      console.log("TruckShipmentComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      if (
        this.props.shipmentSource !== undefined &&
        this.props.shipmentSourceFromSummary
      ) {
        let operationsVisibilty = { ...this.state.operationsVisibilty };
        operationsVisibilty.add = this.state.popUpContent.length > 0;
        operationsVisibilty.delete = false;
        operationsVisibilty.shareholder = true;
        this.setState({
          isManualEntry: false,
          isViewAuditTrail: false,
          isDetails: false,
          selectedRow: {},
          selectedItems: [],
          operationsVisibilty,
          isViewLoadingDetails: false,
          isSealCompartments: false,
          drawerStatus: false,
          isGoBackToSource: true,
          isReadyToRender: false,
        });
      } else {
        let operationsVisibilty = { ...this.state.operationsVisibilty };
        operationsVisibilty.add = this.state.popUpContent.length > 0;
        operationsVisibilty.delete = false;
        operationsVisibilty.shareholder = true;
        this.setState({
          isManualEntry: false,
          isViewAuditTrail: false,
          isDetails: false,
          selectedRow: {},
          selectedItems: [],
          operationsVisibilty,
          isViewLoadingDetails: false,
          isSealCompartments: false,
          drawerStatus: false,
          isReadyToRender: false,
        });
        this.getShipmentList(this.state.selectedShareholder);
        this.getKPIList(this.state.selectedShareholder);
        this.props.isShowBackButton(true);
      }
    } catch (error) {
      console.log("TruckShipmentComposite:Error occured on Back click", error);
    }
  };

  handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
  };

  RecordLadenWeight() {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
        {
          key: KeyCodes.weight,
          value: this.state.scadaValue,
        },
        {
          key: KeyCodes.vehicleCode,
          value: this.state.shipment.VehicleCode,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.shipment.ShipmentCode,
        },
        {
          key: KeyCodes.outOfToleranceAllowed,
          value: this.state.allowOutofRangeTW,
        },
      ];

      let notification = {
        messageType: "critical",
        message: "ViewAllShipment_Record_Weight",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      var obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.RecordShipmentLadenWeight,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          notification.messageType = response.data.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess =
            response.data.IsSuccess;
          if (response.data.IsSuccess) {
            this.setState({ isRecordWeight: false }, () => {
              this.getShipmentList(this.state.selectedShareholder);
            });
          }
          notification.messageResultDetails[0].errorMessage =
            response.data.ErrorList[0];
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
          console.log("Error while recording laden weight:", error);
        });
    } catch (error) {
      console.log("Error in GetScadaValue");
    }
  }

  RecordTareWeight = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
        {
          key: KeyCodes.weight,
          value: this.state.scadaValue,
        },
        {
          key: KeyCodes.vehicleCode,
          value: this.state.shipment.VehicleCode,
        },
        {
          key: KeyCodes.shipmentCode,
          value: this.state.shipment.ShipmentCode,
        },
        {
          key: KeyCodes.outOfToleranceAllowed,
          value: this.state.allowOutofRangeTW,
        },
      ];

      let notification = {
        messageType: "critical",
        message: "ViewAllShipment_Record_Weight",
        messageResultDetails: [
          {
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      var obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.RecordShipmentTareWeight,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          notification.messageType = response.data.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess =
            response.data.IsSuccess;
          if (response.data.IsSuccess) {
            this.setState({ isRecordWeight: false }, () => {
              this.getShipmentList(this.state.selectedShareholder);
            });
          }
          notification.messageResultDetails[0].errorMessage =
            response.data.ErrorList[0];

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
          console.log("Error while recording tare weight:", error);
        });
    } catch (error) {
      console.log("Error in GetScadaValue");
    }
  };

  getScadaValue = () => {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.ReadWBScadaValue,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let notification = {
            messageType: "critical",
            message: "ViewAllShipment_Record_Weight",
            messageResultDetails: [
              {
                keyFields: ["ShipmentCompDetail_ShipmentNumber"],
                keyValues: [this.state.shipment.ShipmentCode],
                isSuccess: false,
                errorMessage: "",
              },
            ],
          };

          notification.messageType = response.data.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess =
            response.data.IsSuccess;

          if (response.data.IsSuccess) {
            this.setState({ scadaValue: response.data.EntityResult });
          } else {
            notification.messageResultDetails[0].errorMessage =
              response.data.ErrorList[0];

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
          console.log("Error while getting weigh brdige Scada value:", error);
        });
    } catch (error) {
      console.log("Error in GetScadaValue");
    }
  };

  handleStatus = (e) => {
    if (e === Constants.ShipmentCompartmentStatus.EMPTY) {
      return "EMPTY";
    } else if (e === Constants.ShipmentCompartmentStatus.LOADING) {
      return "LOADING";
    } else if (e === Constants.ShipmentCompartmentStatus.PART_FILLED) {
      return "PART_FILLED";
    } else if (e === Constants.ShipmentCompartmentStatus.OVER_FILLED) {
      return "OVER_FILLED";
    } else if (e === Constants.ShipmentCompartmentStatus.FORCE_COMPLETED) {
      return "FORCE_COMPLETED";
    } else if (e === Constants.ShipmentCompartmentStatus.COMPLETED) {
      return "COMPLETED";
    } else if (e === Constants.ShipmentCompartmentStatus.INTERRUPTED) {
      return "INTERRUPTED";
    } else {
      return "";
    }
  };

  getSiteConfigurationLookUP = () => {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=SiteConfiguration",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            let siteConfiguration = result.EntityResult;
            this.getWeighBridge(siteConfiguration);
          } else {
            console.log(
              "Error in getSiteConfigurationLookUP: ",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "TruckShipmentComposite: Error occurred on getSiteConfigurationLookUP",
            error
          );
        });
    } catch (error) {
      console.log(
        "TruckShipmentComposite: Error occurred on getSiteConfigurationLookUP",
        error
      );
    }
  };

  getWeighBridge(siteConfiguration) {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: this.state.weighBridgeCode,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetWeighBridge,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let weighBridge = result.EntityResult;

            this.getLadenWeightData(
              this.state.vehicleForRecordWeight.TareWeight, //RegisteredTareWeight
              this.state.vehicleForRecordWeight.WeightUOM, //VehicleWeightUOM
              weighBridge.WeightUOM,
              this.state.vehicleForRecordWeight.MaxLoadableWeight, // MaxLoadableWeight
              this.state.scadaValue, //Weight
              siteConfiguration
            );
          } else {
            console.log("Error in GetWeighBridge:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while GetWeighBridge:", error);
        });
    } catch (error) {
      console.log("Error in get GetWeighBridge", error);
    }
  }

  ValidateLadenWeight(ladenWeighData, siteConfiguration) {
    let notification = {
      messageType: "critical",
      message: "ViewAllShipment_Record_Weight",
      messageResultDetails: [],
    };

    var returnValue = true;

    try {
      let minLadenWeightTolerance =
        siteConfiguration.MinLadenweightQuantityTolerance;
      let maxLadenWeightTolerance =
        siteConfiguration.MaxLadenweightQuantityTolerance;

      var error = "";
      var minLadenWeightTol = 0;
      var maxLadenWeightTol = 0;

      if (isNaN(parseFloat(this.state.scadaValue))) {
        error = "MesuredWeight_Improper";
        returnValue = false;
      } else if (
        isNaN(parseFloat(ladenWeighData["ConvertedRegisteredTareWeight"]))
      ) {
        error = "Improper_Tare_Weight";
        returnValue = false;
      } else if (
        isNaN(parseFloat(ladenWeighData["ConvertedMaxLoadableWeight"]))
      ) {
        error = "Improper_Max_Weight";
        returnValue = false;
      } else if (
        isNaN(parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]))
      ) {
        error = "TareWeight_Not_Captured";
        returnValue = false;
      }
      if (returnValue === true) {
        minLadenWeightTol =
          ((parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
            parseFloat(ladenWeighData["ConvertedLoadedQty"])) *
            parseFloat(minLadenWeightTolerance)) /
          100;

        maxLadenWeightTol =
          ((parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
            parseFloat(ladenWeighData["ConvertedLoadedQty"])) *
            parseFloat(maxLadenWeightTolerance)) /
          100;

        if (
          (parseFloat(ladenWeighData["ConvertedLoadedQty"]) >
            parseFloat(ladenWeighData["ConvertedMaxLoadableWeight"])) |
          (parseFloat(this.state.scadaValue) >
            parseFloat(ladenWeighData["ConvertedMaxLoadableWeight"]) +
            parseFloat(ladenWeighData["ConvertedRegisteredTareWeight"]))
        ) {
          error = "ShipmentWeight_GreaterThan_MaxLoadableWeight";
        } else if (
          parseFloat(this.state.scadaValue) <
          parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
          parseFloat(ladenWeighData["ConvertedLoadedQty"]) -
          minLadenWeightTol
        ) {
          error = "MeasuredWeight_LessThan_ExpectedLoadedWeight";
        } else if (
          parseFloat(this.state.scadaValue) >
          parseFloat(ladenWeighData["ConvertedMeasuredTareWeight"]) +
          parseFloat(ladenWeighData["ConvertedLoadedQty"]) +
          maxLadenWeightTol
        ) {
          error = "MeasuredWeight_MoreThan_ExpectedLoadedWeight";
        }
      } else {
        if (error !== "") {
          notification.messageResultDetails.push({
            keyFields: ["ShipmentCompDetail_ShipmentNumber"],
            keyValues: [this.state.shipment.ShipmentCode],
            isSuccess: false,
            errorMessage: error,
          });
          this.setState({
            isLadenWeightValid: false,
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
      }

      if (error !== "") {
        this.setState({
          isLadenWeightValid: true,
          ladenWeightError: error,
        });
      } else this.RecordLadenWeight();
    } catch (error) {
      console.log("Error while validating laden weight : ", error);
    }
    return returnValue;
  }

  getLadenWeightData(
    RegisteredTareWeight,
    VehicleWeightUOM,
    WeightUOM,
    MaxLoadableWeight,
    Weight,
    siteConfiguration
  ) {
    let trailerWeighData = {};
    try {
      axios(
        RestAPIs.GetLadenWeightData +
        "?shipmentCode=" +
        this.state.shipment.ShipmentCode +
        "&shCode=" +
        this.state.selectedShareholder +
        "&vehicleTareWeight=" +
        RegisteredTareWeight +
        "&vehicleWeightUOM=" +
        VehicleWeightUOM +
        "&weightUOM=" +
        WeightUOM +
        "&maxLoadableWeight=" +
        MaxLoadableWeight +
        "&weight=" +
        Weight,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            trailerWeighData = response.data.EntityResult;
            this.ValidateLadenWeight(trailerWeighData, siteConfiguration);
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting Shipment trailer weigh data Details:",
            error,
            this.state.shipment
          );
        });
    } catch (error) {
      console.log("Error in getLadenWeightData:", error);
    }
  }

  handleRecordWeight = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isRecordWeight} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewAllShipment_RecordWeightShipment") +
                    " : " +
                    this.state.shipment.ShipmentCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-9">
                  <Select
                    fluid
                    placeholder={t("Select_WB")}
                    label={t("ViewShipment_WeighBridgeCode")}
                    value={this.state.weighBridgeCode}
                    options={Utilities.transferListtoOptions(
                      this.state.recordWeightList
                    )}
                    onChange={(cellData) => {
                      this.setState({ weighBridgeCode: cellData }, () =>
                        this.getScadaValue()
                      );
                    }}
                  />
                </div>
                <div className="shipmentRecordWeightButtonDiv">
                  <Button
                    type="primary"
                    size="small"
                    className="shipmentRecordWeightButton"
                    content={t("ViewShipment_ReadWeight")}
                    onClick={() => this.getScadaValue()}
                    disabled={
                      this.state.weighBridgeCode === null ||
                        this.state.weighBridgeCode === "" ||
                        this.state.weighBridgeCode === undefined
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.scadaValue}
                    label={t("ViewShipment_Weight")}
                    reserveSpace={false}
                    disabled={true}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Checkbox
                    className="LabelEnabled"
                    label={t("Allow_Out_of_Tolerance_for_TW")}
                    checked={this.state.allowOutofRangeTW}
                    onChange={(cellData) => {
                      this.setState({ allowOutofRangeTW: cellData });
                    }}
                    disabled={false}
                  />
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                className="shipmentRecordWeightOtherbuttons"
                content={t("ViewShipment_RecordTareWeight")}
                onClick={() => this.RecordTareWeight()}
                disabled={
                  this.state.scadaValue === null ||
                    this.state.scadaValue === "" ||
                    this.state.scadaValue === undefined
                    ? true
                    : false
                }
              />
              <Button
                type="primary"
                content={t("ViewShipment_RecordLadenWeight")}
                className="shipmentRecordWeightOtherbuttons"
                onClick={() => this.getSiteConfigurationLookUP()}
                disabled={
                  this.state.scadaValue === null ||
                    this.state.scadaValue === "" ||
                    this.state.scadaValue === undefined
                    ? true
                    : false
                }
              />
              <Button
                type="primary"
                content={t("Cancel")}
                className="shipmentRecordWeightOtherbuttons"
                onClick={() => {
                  this.setState({
                    isRecordWeight: false,
                    weighBridgeCode: "",
                    scadaValue: "",
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
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

  handleLoadOrders = () => {
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getShipmentList(this.state.selectedShareholder);
    }
  };

  onBack = () => {
    let operationsVisibilty = { ...this.state.operationsVisibilty };
    operationsVisibilty.add = this.state.popUpContent.length > 0;
    operationsVisibilty.shareholder = true;
    this.setState({
      isManualEntry: false,
      isViewAuditTrail: false,
      isDetails: false,
      isViewLoadingDetails: false,
      operationsVisibilty,
      loadingExpandedRows: [],
      isReadyToRender: false,
    });
    if (this.props.shipmentSource !== undefined)
      this.props.isShowBackButton(true);
    this.getShipmentList(this.state.selectedShareholder);
  };

  toggleExpand = (data, open) => {
    let loadingExpandedRows = this.state.loadingExpandedRows;
    let expandedRowIndex = loadingExpandedRows.findIndex(
      (item) => item.seqNo === data.seqNo
    );
    if (open) {
      loadingExpandedRows.splice(expandedRowIndex, 1);
    } else {
      loadingExpandedRows.push(data);
    }
    this.setState({ loadingExpandedRows });
  };

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

  isNodeEnterpriseOrWebortal() {
    if (
      this.props.userDetails.EntityResult.IsEnterpriseNode ||
      this.props.userDetails.EntityResult.IsWebPortalUser
    ) {
      return true;
    } else {
      return false;
    }
  }

  handlePopUpClick = () => {
    if (this.state.operationsVisibilty.add) {
      if (this.state.popUpContent.length > 0) {
        if (this.state.popUpOpen === false) this.setState({ popUpOpen: true });
        else this.setState({ popUpOpen: false });
      }
    }
  };

  popUpMenuClick = (menuItem) => {
    this.setState({ popUpOpen: false });
    this.handleAdd(menuItem);
  };

  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("Shipment Composite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showDeleteAuthenticationLayout: false,
      showAuthorizeToLoadAuthenticationLayout: false,
      showAllowToLoadAuthenticationLayout: false,
      showCloseShipmentAuthenticationLayout: false,
      showViewBOLAuthenticationLayout: false,
      showPrintBOLAuthenticationLayout: false,
      showFANAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    if (
      this.state.showDeleteAuthenticationLayout &&
      (this.state.shipmentType.toLowerCase() === fnSBP || this.state.shipmentType.toLowerCase() === Constants.shipmentType.PRODUCT.toLowerCase())
    )
      return fnSBP;

    if (
      this.state.showDeleteAuthenticationLayout &&
      (this.state.shipmentType.toLowerCase() === fnSBC || this.state.shipmentType.toLowerCase() === Constants.shipmentType.COMPARTMENT.toLowerCase())
    )
      return fnSBC;

    else if (this.state.showCloseShipmentAuthenticationLayout)
      return fnCloseShipment;
    else if (
      this.state.showAllowToLoadAuthenticationLayout ||
      this.state.showAuthorizeToLoadAuthenticationLayout
    )
      return fnShipmentStatus;
    else if (
      this.state.showViewBOLAuthenticationLayout ||
      this.state.showPrintBOLAuthenticationLayout
    )
      return fnPrintBOL;
    else if (this.state.showFANAuthenticationLayout) return fnPrintFAN;
  }

  getDeleteorEditMode() {
    if (this.state.showDeleteAuthenticationLayout) return functionGroups.remove;
    else return functionGroups.modify;
  }

  handleOperation() {
    if (this.state.showDeleteAuthenticationLayout) return this.handleDelete;
    else if (this.state.showAuthorizeToLoadAuthenticationLayout)
      return this.authorizeToLoad;
    else if (this.state.showAllowToLoadAuthenticationLayout)
      return this.ConfirmedAllowToLoad;
    else if (this.state.showCloseShipmentAuthenticationLayout)
      return this.handleShipmentClose;
    else if (this.state.showFANAuthenticationLayout) return this.printFAN;
    else if (this.state.showViewBOLAuthenticationLayout)
      return this.handleViewBOL;
    else if (this.state.showPrintBOLAuthenticationLayout) return this.printBOL;
  }

  confirmAllocateBay = () => {
    let bayData = lodash.cloneDeep(this.state.bayData);
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isAllocateBay} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewAllocateBay_AllocateBay")} -{" "}
                  {this.state.shipment.ShipmentCode}
                </h3>
              </div>
              <div className="col-12 detailsTable">
                <DataTable
                  className="iconblock"
                  data={bayData}
                  selection={this.state.selectBay}
                  selectionMode="single"
                  showHeader={true}
                  onSelectionChange={(e) => this.setState({ selectBay: e })}
                  rows={
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize
                  }
                  resizableColumns={true}
                >
                  {/* <DataTable.ActionBar /> */}
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field={"BayCode"}
                    header={t("ViewAllocateBay_BayCode")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field={"AssociatedProduct"}
                    header={t("ViewAllocateBay_FinishProduct")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field="CurrentQueue"
                    header={t("ViewAllocateBay_CurrentQueue")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight compColmiddle"
                    field="MaximumQueue"
                    header={t("ViewAllocateBay_MaximumQueue")}
                    editable={false}
                  />
                  {Array.isArray(bayData) &&
                    bayData.length >
                    this.props.userDetails.EntityResult.PageAttibutes
                      .WebPortalListPageSize ? (
                    <DataTable.Pagination />
                  ) : (
                    ""
                  )}
                </DataTable>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("MarineEOD_Close")}
                className="cancelButton"
                onClick={() => this.setState({ isAllocateBay: false })}
              />
              <Button
                type="primary"
                content={t("ViewAllocateBay_Allocate")}
                onClick={() => {
                  if (
                    this.state.selectBay === null ||
                    this.state.selectBay === undefined ||
                    this.state.selectBay.length === 0
                  ) {
                    let notification = {
                      messageType: "critical",
                      message: "ViewAllocateBay_Allocate",
                      messageResultDetails: [
                        {
                          keyFields: ["BayCode"],
                          keyValues: [],
                          isSuccess: false,
                          errorMessage: "ViewAllocateBay_bayrequired",
                        },
                      ],
                    };

                    toast(
                      <ErrorBoundary>
                        <NotifyEvent
                          notificationMessage={notification}
                        ></NotifyEvent>
                      </ErrorBoundary>,
                      {
                        autoClose:
                          notification.messageType === "success"
                            ? 10000
                            : false,
                      }
                    );
                  } else {
                    this.AllocateBay(
                      this.state.shipment.ShipmentCode,
                      this.state.selectBay[0].BayCode,
                      "SHIPMENT"
                    );
                  }
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  confirmDeAllocateBay = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isDeAllocateBay} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>
                  {t("ViewAllocateBay_ConfirmDeallocateBay", [
                    this.state.ShipmentBay,
                    "Shipment",
                  ])}
                </h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                className="cancelButton"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isDeAllocateBay: false });
                }}
              />
              <Button
                type="primary"
                content={t("ViewAllocateBay_Deallocate")}
                onClick={() => {
                  this.setState({ isDeAllocateBay: false }, () => {
                    this.DeAllocateBay(
                      this.state.shipment.ShipmentCode,
                      "SHIPMENT",
                      this.state.ShipmentBay
                    );
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  GetBayByTrnsaction(TrnsactionCode, TrnsactionType, shareholder) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: TrnsactionCode,
      },
      {
        key: KeyCodes.TransactionType,
        value: TrnsactionType,
      },
    ];
    var obj = {
      ShareHolderCode: shareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetBayAllocatedInfoByTransaction,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      ),
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          this.setState({
            ShipmentBay: result.EntityResult.BayCode,
          });
        }
      })
      .catch((error) => {
        console.log("Error while GetBayByTrnsaction:", error);
      });
  }

  /**
   *
   * @param {*} shipmentCode
   * @param {*} bayCode
   * @param {*} entityType ：shipment or receipt
   */
  AllocateBay(shipmentCode, bayCode, entityType) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
      {
        key: KeyCodes.bayCode,
        value: bayCode,
      },
      {
        key: KeyCodes.entityType,
        value: entityType,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
    };
    let notification = {
      messageType: "critical",
      message: "BayAllocation_SaveStatus",
      messageResultDetails: [
        {
          keyFields: ["BayCode"],
          keyValues: [bayCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.AllocateBay,
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
          this.getShipmentList(this.state.selectedShareholder);
          this.setState({ isAllocateBay: false });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ResultDataList[0].ErrorList[0];
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
        console.log("Error while AllocateBay:", error);
      });
  }

  DeAllocateBay(shipmentCode, entityType, bayCode) {
    var keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: shipmentCode,
      },
      {
        key: KeyCodes.entityType,
        value: entityType,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedShareholder,
      KeyCodes: keyCode,
    };
    let notification = {
      messageType: "critical",
      message: "BayDeAllocation_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["BayCode"],
          keyValues: [bayCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.DeallocateShipment,
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
          this.getShipmentList(this.state.selectedShareholder);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
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
        console.log("Error while DeAllocateBay:", error);
      });
  }

  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(this.state.shipment.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.shipment.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.shipment.LastActiveTime !== undefined &&
            this.state.shipment.LastActiveTime !== null
            ? new Date(
              this.state.shipment.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(this.state.shipment.LastActiveTime).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.shipment.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.shipment.CreatedTime).toLocaleTimeString(),
      },
    ];
    let fillPage = true;
    let shipmentSelected = this.state.selectedItems.length === 1;
    // && this.props.userDetails.EntityResult.IsEnterpriseNode === false;
    let loadingClass = "globalLoader";
    if (
      this.props.shipmentSource !== undefined &&
      this.props.shipmentSource !== "" &&
      this.props.shipmentSource !== null
    ) {
      fillPage = false;
      loadingClass = "nestedList";
    }

    return (
      <div>
        {this.props.shipmentSource === undefined ||
          this.props.shipmentSource === "" ||
          this.props.shipmentSource === null ? (
          <ErrorBoundary>
            <TMUserActionsComposite
              operationsVisibilty={this.state.operationsVisibilty}
              breadcrumbItem={this.props.activeItem}
              shareholders={this.props.userDetails.EntityResult.ShareholderList}
              selectedShareholder={this.state.selectedShareholder}
              onShareholderChange={this.handleShareholderSelectionChange}
              //onDelete={() => { }}
              onDelete={this.authenticateDelete}
              onAdd={this.handleAdd}
              popUpContent={
                this.state.popUpContent.length > 0
                  ? this.state.popUpContent
                  : []
              }
              handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            ></TMUserActionsComposite>
          </ErrorBoundary>
        ) : (
          <>
            {this.state.isDetails ? (
              ""
            ) : (
              <>
                {!this.state.isGoBackToSource ? (
                  <TranslationConsumer>
                    {(t) => (
                      <div className="headerContainer">
                        <div className="row headerSpacing">
                          <div className="col paddingHeaderItemLeft">
                            <span
                              style={{ margin: "auto" }}
                              className="headerLabel"
                            >
                              {this.props.shipmentSourceCode +
                                " - " +
                                t("Shipment_OtherSource")}
                            </span>
                          </div>
                          <div className="headerItemRight">
                            {/* <div> */}
                            {/* <div className="col col-md-8 col-lg-9 col col-xl-12" style={{ textAlign: "right" }}> */}
                            <Popup
                              element={
                                <div>
                                  <Button
                                    type="primary"
                                    content={t("Add_Shipment")}
                                    disabled={
                                      this.props.shipmentSource ===
                                        Constants.shipmentFrom.Contract
                                        ? !this.state.isContractDisable
                                        : this.props.shipmentSource ===
                                          Constants.shipmentFrom.Order
                                          ? !this.state.isOrderDisable
                                          : false
                                    }
                                    onClick={this.handlePopUpClick}
                                  />
                                </div>
                              }
                              on="click"
                              open={this.state.popUpOpen}
                            >
                              <div
                                onMouseLeave={() =>
                                  this.setState({ popUpOpen: false })
                                }
                              >
                                <VerticalMenu style={{ textAlign: "right" }}>
                                  <VerticalMenu>
                                    <VerticalMenu.Header>
                                      {t("Common_Create")}
                                    </VerticalMenu.Header>
                                    {this.state.popUpContent.map((item) => {
                                      return (
                                        <VerticalMenu.Item
                                          onClick={() =>
                                            this.popUpMenuClick(item.fieldName)
                                          }
                                        >
                                          {t(item.fieldValue)}
                                        </VerticalMenu.Item>
                                      );
                                    })}
                                  </VerticalMenu>
                                </VerticalMenu>
                              </div>
                            </Popup>
                          </div>
                          {/* </div> */}
                        </div>
                      </div>
                    )}
                  </TranslationConsumer>
                ) : null}
              </>
            )}
          </>
        )}
        {this.state.isGoBackToSource ? (
          <ErrorBoundary>
            {this.props.shipmentSource === Constants.shipmentFrom.Order ? (
              <OrderComposite
                shipmentSource={this.props.shipmentSource}
              ></OrderComposite>
            ) : this.props.shipmentSource ===
              Constants.shipmentFrom.Contract ? (
              <ContractComposite
                shipmentSource={this.props.shipmentSource}
                activeItem={this.props.activeItem}
              ></ContractComposite>
            ) : null}
          </ErrorBoundary>
        ) : (
          ""
        )}

        {this.state.isDetails && this.state.shipmentType ? (
          <ErrorBoundary>
            <TruckShipmentDetailsComposite
              key="ShipmentDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              terminalCodes={this.state.terminalCodes}
              selectedShareholder={this.state.selectedShareholder}
              ShipmentType={this.state.shipmentType}
              handleAuthorizeToLoad={this.handleAuthorizeToLoad}
              handleAllowToLoad={this.handleAllowToLoad}
              handleViewAuditTrail={this.handleViewAuditTrail}
              handleViewLoadingDetails={this.handleViewLoadingDetails}
              handlePrintFAN={this.handlePrintFAN}
              handlePrintBOL={this.handlePrintBOL}
              handleSendBOL={this.handleSendBOL}
              handleBSIOutbound={this.handleBSIOutbound}
              handleSealCompartments={this.handleSealCompartments}
              handleViewBOL={this.handleViewBOL}
              shipmentSource={this.props.shipmentSource}
              shipmentSourceCode={this.props.shipmentSourceCode}
              shipmentSourceCompartmentItems={
                this.props.shipmentSourceCompartmentItems
              }
              shipmentSourceDetails={this.props.shipmentSourceDetails}
              shipmentSourceFromSummary={this.props.shipmentSourceFromSummary}
              selectedSourceCode={this.props.selectedSourceCode}
            ></TruckShipmentDetailsComposite>
          </ErrorBoundary>
        ) : (
          <div>
            {this.state.isViewAuditTrail ? (
              <ErrorBoundary>
                <TruckShipmentViewAuditTrailDetails
                  ShipmentCode={this.state.selectedItems[0].Common_Code}
                  auditTrailList={this.state.auditTrailList}
                  modAuditTrailList={this.state.modAuditTrailList}
                  Attributes={
                    this.state.auditTrailList !== undefined &&
                      this.state.auditTrailList.length > 0
                      ? this.state.auditTrailList[0].AttributesforUI
                      : []
                  }
                  handleBack={this.onBack}
                ></TruckShipmentViewAuditTrailDetails>
              </ErrorBoundary>
            ) : this.state.isViewLoadingDetails ? (
              <ErrorBoundary>
                <TruckShipmentViewLoadingDetails
                  ShipmentCode={this.state.selectedItems[0].Common_Code}
                  modLoadingDetails={this.state.modViewLoadingDetails}
                  handleBack={this.onBack}
                  expandedRows={this.state.loadingExpandedRows}
                  toggleExpand={this.toggleExpand}
                  nonConfigColumns={this.state.nonConfigColumns}
                ></TruckShipmentViewLoadingDetails>
              </ErrorBoundary>
            ) : this.state.isManualEntry ? (
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      entityCode={
                        this.state.shipment.ShipmentCode +
                        " - " +
                        t("LoadingDetailsEntry_Title")
                      }
                      popUpContents={popUpContents}
                    ></TMDetailsHeader>
                  )}
                </TranslationConsumer>
                <TruckShipmentManualEntryDetailsComposite
                  shipment={this.state.shipment}
                  handleBack={this.onBack}
                  selectedShareholder={this.state.selectedShareholder}
                ></TruckShipmentManualEntryDetailsComposite>
              </ErrorBoundary>
            ) : (
              <div>
                {this.props.shipmentSource === undefined ||
                  this.props.shipmentSource === "" ||
                  this.props.shipmentSource === null ? (
                  <ErrorBoundary>
                    <div className="kpiSummaryContainer">
                      <KPIDashboardLayout
                        kpiList={this.state.truckShipmentKPIList}
                        pageName="TruckShipment"
                      ></KPIDashboardLayout>
                    </div>
                  </ErrorBoundary>
                ) : (
                  ""
                )}
                <div
                  // className={
                  //   shipmentSelected ? "showShipmentStatusRightPane" : ""
                  // }
                  className={
                    (shipmentSelected &&
                      Array.isArray(this.state.shipment.ShipmentCompartments) &&
                      this.state.shipment.ShipmentCompartments.length > 0) //&& this.props.shipmentSource === undefined
                      ? !this.state.drawerStatus
                        ? "showShipmentStatusRightPane"
                        : "drawerClose"
                      : ""
                  }
                >
                  {this.props.shipmentSourceFromSummary === undefined ||
                    this.props.shipmentSourceFromSummary === "" ||
                    this.props.shipmentSourceFromSummary === null ? (
                    <div>
                      <ErrorBoundary>
                        {this.props.shipmentSource === undefined ? (
                          <div>
                            <TMTransactionFilters
                              dateRange={{
                                from: this.state.fromDate,
                                to: this.state.toDate,
                              }}
                              dateError={this.state.dateError}
                              handleDateTextChange={this.handleDateTextChange}
                              handleRangeSelect={this.handleRangeSelect}
                              handleLoadOrders={this.handleLoadOrders}
                              filterText="LoadShipments"
                            ></TMTransactionFilters>
                          </div>
                        ) : null}
                      </ErrorBoundary>
                      {this.state.isReadyToRender ? (
                        <ErrorBoundary>
                          <div
                            className={
                              fillPage === true
                                ? "compositeTransactionList"
                                : ""
                            }
                          >
                            <TruckShipmentSummaryPageComposite
                              tableData={this.state.data.Table}
                              columnDetails={this.state.data.Column}
                              pageSize={
                                this.props.userDetails.EntityResult
                                  .PageAttibutes.WebPortalListPageSize
                              }
                              exportRequired={true}
                              exportFileName="TruckShipmentList"
                              columnPickerRequired={true}
                              terminalsToShow={
                                this.props.userDetails.EntityResult
                                  .PageAttibutes.NoOfTerminalsToShow
                              }
                              selectionRequired={true}
                              columnGroupingRequired={true}
                              onSelectionChange={this.handleSelection}
                              onRowClick={this.handleRowClick}
                              fillPage={fillPage}
                              parentComponent={this.componentName}
                              selectedItems={this.state.selectedItems}
                            ></TruckShipmentSummaryPageComposite>
                          </div>
                        </ErrorBoundary>
                      ) : (
                        <LoadingPage
                          loadingClass={loadingClass}
                          message=""
                        ></LoadingPage>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {
                  (shipmentSelected &&
                    Array.isArray(this.state.shipment.ShipmentCompartments) &&
                    this.state.shipment.ShipmentCompartments.length > 0) ? ( //&& this.props.shipmentSource === undefined
                    <div
                      // className="showShipmentStatusLeftPane"
                      className={
                        this.state.drawerStatus ? "marineStatusLeftPane" : ""
                      }
                    >
                      <TransactionSummaryOperations
                        selectedItem={this.state.selectedItems}
                        shipmentNextOperations={this.state.shipmentNextOperations}
                        handleDetailsPageClick={this.handleRowClick}
                        handleOperationButtonClick={this.handleOperationClick}
                        currentStatuses={this.state.currentShipmentStatuses}
                        unAllowedOperations={[
                          "ManualEntry",
                          "ViewShipment_AuthorizeLoad",
                          "ViewShipment_AllowToLoad",
                          "ViewShipment_RecordWeight",
                          "ViewAllocateBay_AllocateBay",
                          "ViewAllocateBay_DeallocateBay",
                          "ViewShipment_CloseShipment",
                          "ViewShipmentStatus_PrintFAN",
                        ]}
                        webPortalAllowedOperations={[
                          "ViewShipment_ViewLoadingDetails",
                          "ViewShipmentStatus_ViewBOL",
                          "ViewShipment_ViewAuditTrail",
                        ]}
                        isWebPortalUser={
                          this.props.userDetails.EntityResult.IsWebPortalUser
                        }
                        isDetails={false}
                        isEnterpriseNode={
                          this.props.userDetails.EntityResult.IsEnterpriseNode
                        }
                        handleDrawer={this.handleDrawer}
                        title={"ViewAllShipment_Details"}
                      />
                    </div>
                  ) : (
                    ""
                  )}
              </div>
            )}
          </div>
        )}
        {Object.keys(this.state.selectedRow).length > 0 ||
          this.state.selectedItems.length === 1
          ? this.renderModal()
          : ""}
        {this.state.showDeleteAuthenticationLayout ||
          this.state.showAllowToLoadAuthenticationLayout ||
          this.state.showAuthorizeToLoadAuthenticationLayout ||
          this.state.showCloseShipmentAuthenticationLayout ||
          this.state.showViewBOLAuthenticationLayout ||
          this.state.showPrintBOLAuthenticationLayout ||
          this.state.showFANAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getDeleteorEditMode()}
            functionGroup={this.getFunctionGroupName()}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleOperation()}
          ></UserAuthenticationLayout>
        ) : null}

        {this.props.shipmentSource === undefined ? (
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
        ) : (
          ""
        )}
        {this.state.isRecordWeight ? this.handleRecordWeight() : null}
        {this.state.isSealCompartments ? (
          <ErrorBoundary>
            <TruckShipmentSealDetailsComposite
              transactionCode={this.state.shipment.ShipmentCode}
              selectedShareholder={this.state.selectedShareholder}
              sealCompartments={this.state.sealCompartments}
              handleSealClose={this.handleSealClose}
            ></TruckShipmentSealDetailsComposite>
          </ErrorBoundary>
        ) : null}
        {this.state.isNotRevised ? this.confirmAllowToLoad() : null}
        {this.state.isCloseShipment ? this.handleCloseShipmentModal() : null}
        {this.state.isLadenWeightValid ? this.confirmRecordLadenWeight() : null}
        {this.state.isAllocateBay ? this.confirmAllocateBay() : null}
        {this.state.isDeAllocateBay ? this.confirmDeAllocateBay() : null}
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

export default connect(mapStateToProps)(TruckShipmentComposite);

TruckShipmentComposite.propTypes = {
  activeItem: PropTypes.object,
  shipmentSource: PropTypes.number,
  shipmentSourceCode: PropTypes.string,
  selectedShareholder: PropTypes.string,
  shipmentSourceCompartmentItems: PropTypes.array,
  shipmentSourceDetails: PropTypes.object,
  shipmentSourceFromSummary: PropTypes.bool,
  shipmentType: PropTypes.string,
  selectedSourceCode: PropTypes.array,
};
