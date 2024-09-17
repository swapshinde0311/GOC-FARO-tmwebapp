import React, { Component } from "react";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import OperatorDashboardThroughputSummaryComposite from "../Summary/OperatorDashboardThroughputSummaryComposite";
import { TranslationConsumer } from "@scuf/localization";
import {
  functionGroups,
  fnPrintMarineBOL,
  fnPrintMarineBOD,
  fnCloseMarineShipment,
  fnCloseMarineReceipt,
  fnPrintBOL,
  fnPrintBOD,
  fnCloseShipment,
  fnCloseReceipt,
} from "../../../JS/FunctionGroups";
import {
  Button,
  Checkbox,
  Divider,
  Modal,
  Select,
  Slider,
  Input,
} from "@scuf/common";
import * as KeyCodes from "../../../JS/KeyCodes";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestApis from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import {
  emptyMarineOperatorDashboardFilterInfo,
  emptyOthersOperatorDashboardFilterInfo,
} from "../../../JS/DefaultEntities";
import lodash from "lodash";
import { marineReceiptValidationDef } from "../../../JS/ValidationDef";
import { OperatorDashboardOverviewDetails } from "../../UIBase/Details/OperatorDashboardOverviewDetails";

class OperatorDashboardDetailsComposite extends Component {
  state = {
    isPopupOpen: { key: null, value: false },
    hdnFGPrintBOL: null,
    hdnFGPrintBOD: null,
    hdnFGShipClose: null,
    hdnFGRecClose: null,
    openReceipt: false,
    reason: "",
    transactionCode: "",
    transactionType: "",
    validationErrors: Utilities.getInitialValidationErrors(
      marineReceiptValidationDef
    ),
    marineReceiptBtnCloseOK: false,
    marineOrderDetails: null,
    marineOrderProductDetails: [],
    marineOrderloadedPartCommpartmentList: [],
    marineOrderloadedOtherCommpartmentList: [],
    CurrentShift: {},
    timeScaleDuration: 4,
    marineTimeScaleDuration: 12,
    modFilter: {},
    isFilterOpen: false,
    selectList: [],
    webServiceName: "TMDashboardGet.asmx",
    filteredBayDetails: [],
    modFilteredBayDetails: [],
    BayDetails: [],
    buttonGroup: [
      { content: "View All", type: "primary" },
      { content: "Completed", type: "secondary" },
      { content: "Interrupted", type: "secondary" },
      { content: "With Alarms", type: "secondary" },
    ],
    DashboardConfig: {
      TimeDuration: 4,
      MassUOM: "Kg",
      VolUOM: "L",
      RefreshRate: 60000,
      RefreshRateOfCompartments: 60000,
      NoOfCompartments: 10,
      NoOfMarineCompartments: 30,
      PurgeInterval: 48,
    },
    ShiftsData: [],
    transactionAndDeviceStatus: [],
    timetaken: 0,
    graphDuration: 0,
    viewShipmentStatus: 0,
    isLive: true,
    QueueDetails: [],
    queueHoverHtml: [],
    objOrderDetails: [],
    selectedOption: [],
    railOptions: [],
  };

  GetCurrentShift() {
    let EndTime = new Date();
    let StartTime = new Date();
    let { transportationType } = this.props;
    let { marineTimeScaleDuration, timeScaleDuration } = this.state;

    if (transportationType === Constants.TransportationType.MARINE) {
      StartTime.setHours(StartTime.getHours() - marineTimeScaleDuration);
    } else {
      StartTime.setHours(StartTime.getHours() - timeScaleDuration);
    }
    let CurrentShift = { StartTime: StartTime, EndTime: EndTime };
    this.setState({ CurrentShift });
  }

  getShifts() {
    const { tokenDetails } = this.props;
    axios(
      RestApis.GetShifts,
      Utilities.getAuthenticationObjectforGet(tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let ShiftsData = result.EntityResult;

          if (ShiftsData !== null && ShiftsData !== undefined) {
            for (var i = 0; i < ShiftsData.length; i++) {
              if (ShiftsData[i].StartTime.length === 25) {
                ShiftsData[i].StartTime = new Date(
                  Date.parse(ShiftsData[i].StartTime.slice(0, -6))
                );
              } else {
                ShiftsData[i].StartTime = new Date(
                  Date.parse(ShiftsData[i].StartTime)
                );
              }
              if (ShiftsData[i].EndTime.length === 25) {
                ShiftsData[i].EndTime = new Date(
                  Date.parse(ShiftsData[i].EndTime.slice(0, -6))
                );
              } else {
                ShiftsData[i].EndTime = new Date(
                  Date.parse(ShiftsData[i].EndTime)
                );
              }
            }
          }

          this.setState({ ShiftsData });
        } else {
          console.log("Error in getShifts:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "OperatorDashboardDetailsComposite:Error occurred on getShifts",
          error
        );
      });
  }

  getBayDetails() {
    const { transportationType, userDetails, tokenDetails } = this.props;
    const keyCode = [
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetDashboardBayDetails,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          let filteredBayDetails = result.EntityResult;
          let BayDetails = response.data;

          this.setState(
            {
              filteredBayDetails,
              BayDetails,
              modFilteredBayDetails: filteredBayDetails,
            },
            () => {
              this.getLiveOrdersForBays(filteredBayDetails);
              let selectList = [];
              let modFilter =
                transportationType === Constants.TransportationType.MARINE
                  ? lodash.cloneDeep(emptyMarineOperatorDashboardFilterInfo)
                  : lodash.cloneDeep(emptyOthersOperatorDashboardFilterInfo);
              if (Array.isArray(filteredBayDetails)) {
                filteredBayDetails.forEach((bayDetail) => {
                  selectList.push(bayDetail.Code);
                });
              }
              modFilter.selectList = selectList;
              this.setState({
                selectList,
                modFilter,
              });
              // if (transportationType === Constants.TransportationType.ROAD) {
              //   if (
              //     filteredBayDetails !== undefined &&
              //     filteredBayDetails !== null
              //   ) {
              //     filteredBayDetails.forEach((bayDetail) => {
              //       selectList.push(bayDetail.Code);
              //     });
              //   }
              //   modFilter.selectList = selectList;
              //   this.setState({
              //     selectList,
              //     modFilter,
              //   });
              //   // this.roadBaysInfoSuccess(filteredBayDetails);
              // } else {
              //   // this.baysInfoSuccess(filteredBayDetails);
              //   if (
              //     filteredBayDetails !== undefined &&
              //     filteredBayDetails !== null
              //   ) {
              //     filteredBayDetails.forEach((bayDetail) => {
              //       selectList.push(bayDetail.Code);
              //     });
              //   }

              //   modFilter.selectList = selectList;
              //   this.setState({
              //     selectList,
              //     modFilter,
              //   });
              // }
              this.getTransactionAndDeviceStatus(filteredBayDetails);
              this.getTransactionAudit(filteredBayDetails);
              this.getDeviceStatus(filteredBayDetails);
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting BayDetails", error);
      });
  }

  getTransactionAndDeviceStatus = (filteredBayDetails) => {
    const { transportationType, userDetails, tokenDetails } = this.props;
    const {
      isLive,
      marineTimeScaleDuration,
      timeScaleDuration,
      DashboardConfig,
    } = this.state;
    let CurrentShift = {};
    try {
      if (isLive) {
        let EndTime = new Date();
        let StartTime = new Date();
        if (transportationType === Constants.TransportationType.MARINE) {
          StartTime.setHours(StartTime.getHours() - marineTimeScaleDuration);
        } else {
          StartTime.setHours(StartTime.getHours() - timeScaleDuration);
        }
        CurrentShift = { StartTime: StartTime, EndTime: EndTime };
        this.setState({ CurrentShift });
      } else {
        CurrentShift.StartTime = new Date(this.state.CurrentShift.EndTime);
        CurrentShift.EndTime = new Date(this.state.CurrentShift.EndTime);
        if (transportationType === Constants.TransportationType.MARINE) {
          CurrentShift.StartTime.setHours(
            CurrentShift.StartTime.getHours() - marineTimeScaleDuration
          );
        } else {
          CurrentShift.StartTime.setHours(
            CurrentShift.StartTime.getHours() - timeScaleDuration
          );
        }
        this.setState({ CurrentShift });
      }
      let baycode = [];
      filteredBayDetails.forEach((filteredBayDetail) => {
        baycode.push(filteredBayDetail.Code);
      });
      const obj = {
        ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.transportationType,
        Entity: {
          BayCodes: baycode,
          EndTime: CurrentShift.EndTime,
          StartTime: CurrentShift.StartTime,
          TransportationType: transportationType,
        },
      };
      axios(
        RestApis.GetTransactionAndDeviceStatus,
        Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess) {
            let transactionAndDeviceStatus = result.EntityResult;
            this.setState({ transactionAndDeviceStatus });
          } else {
            console.log(
              "Error in getTransactionAndDeviceStatus:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "Error while getting transaction and device status",
            error
          );
        });

      if (isLive) {
        this.shipmentsDataTimer = setTimeout(
          () => this.getTransactionAndDeviceStatus(filteredBayDetails),
          parseInt(DashboardConfig.RefreshRate)
        );
      }
    } catch (error) {
      console.log("error in getTransactionAndDeviceStatus " + error);
    }
  };

  getTransactionAudit(filteredBayDetails) {
    var baycode = [];
    const { CurrentShift } = this.state;
    // const filteredBayDetails = this.state.filteredBayDetails;
    filteredBayDetails.forEach((filteredBayDetail) => {
      baycode.push(filteredBayDetail.Code);
    });
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      Entity: {
        BayCodes: baycode,
        EndTime: CurrentShift.EndTime,
        StartTime: CurrentShift.StartTime,
        TransportationType: this.props.transportationType,
      },
    };
    axios(
      RestApis.GetTransactionAudit,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          // console.info("getTransactionAudit", result);
        }
      })
      .catch((error) => {
        console.log("Error while getting transactionAudit");
      });
  }

  // getLiveOrdersForBays(filteredBayDetails) {
  //   const { userDetails, tokenDetails, transportationType } = this.props;
  //   const { CurrentShift } = this.state;
  //   var baycode = [];
  //   if (filteredBayDetails !== null)
  //     filteredBayDetails.forEach((filteredBayDetail) => {
  //       baycode.push(filteredBayDetail.Code);
  //     });
  //   // const keyCode = [
  //   //   {
  //   //     key: KeyCodes.transportationType,
  //   //     value: this.props.transportationType,
  //   //   },
  //   // ];
  //   const obj = {
  //     ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
  //     keyDataCode: KeyCodes.transportationType,
  //     Entity: {
  //       BayCodes: baycode,
  //       EndTime: CurrentShift.EndTime,
  //       StartTime: CurrentShift.StartTime,
  //       TransportationType: transportationType,
  //     },
  //   };
  //   axios(
  //     RestApis.GetTransactionAudit,
  //     Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
  //   )
  //     .then((response) => {
  //       const result = response.data;
  //       if (result.IsSuccess) {
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error while getting transactionAudit", error);
  //     });
  // }

  getDeviceStatus(filteredBayDetails) {
    const { userDetails, transportationType, tokenDetails } = this.props;
    const { CurrentShift } = this.state;
    let baycode = [];
    filteredBayDetails.forEach((filteredBayDetail) => {
      baycode.push(filteredBayDetail.Code);
    });
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      Entity: {
        BayCodes: baycode,
        EndTime: CurrentShift.EndTime,
        StartTime: CurrentShift.StartTime,
        TransportationType: transportationType,
      },
    };
    axios(
      RestApis.GetDeviceStatus,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          // console.info("getDeviceStatus", result);
        }
      })
      .catch((error) => {
        console.log("Error while getting DeviceStatus", error);
      });
  }

  getSpurDetails() {
    const { transportationType, tokenDetails } = this.props;
    axios(
      RestApis.GetSpurDetails,
      Utilities.getAuthenticationObjectforGet(tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          let filteredBayDetails = result.EntityResult;
          let BayDetails = response.data;
          let selectList = [];
          let selectedOption = [];
          let railOptions = [];
          if (filteredBayDetails !== undefined && filteredBayDetails !== null) {
            filteredBayDetails.forEach((bayDetail) => {
              selectList.push(bayDetail.Code);
              selectedOption.push("select");
              railOptions.push([]);
            });
          }
          let modFilter =
            transportationType === Constants.TransportationType.MARINE
              ? lodash.cloneDeep(emptyMarineOperatorDashboardFilterInfo)
              : lodash.cloneDeep(emptyOthersOperatorDashboardFilterInfo);
          modFilter.selectList = selectList;
          this.setState(
            {
              filteredBayDetails,
              modFilteredBayDetails: filteredBayDetails,
              BayDetails,
              selectList,
              modFilter,
              selectedOption,
              railOptions,
            },
            () => {
              this.getLiveOrdersForBays(filteredBayDetails);
              // if (
              //   this.props.transportationType===
              //   Constants.TransportationType.RAIL
              // ) {
              //   this.railBaysInfoSuccess(filteredBayDetails);
              // }
              this.getTransactionAndDeviceStatus(filteredBayDetails);
              this.getTransactionAudit(filteredBayDetails);
              this.getDeviceStatus(filteredBayDetails);
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting spurDetails", error);
      });
  }

  getLiveOrdersForBays(filteredBayDetails) {
    const { userDetails, transportationType, tokenDetails } = this.props;
    const { DashboardConfig } = this.state;
    let baycode = [];
    try {
      filteredBayDetails.forEach((filteredBayDetail) => {
        baycode.push(filteredBayDetail.Code);
      });
      const keyCode = [
        {
          key: KeyCodes.transportationType,
          value: transportationType,
        },
      ];
      const obj = {
        ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.transportationType,
        KeyCodes: keyCode,
        Entity: baycode,
      };
      axios(
        RestApis.GetLiveOrdersForBays,
        Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess) {
            this.setState({
              objOrderDetails: result.EntityResult,
            });
          } else {
            this.setState({
              objOrderDetails: [],
            });
          }
        })
        .catch((error) => {
          console.log("Error while getting LiveOrdersForBays", error);
        });
      this.liveCompartmentsTimer = setTimeout(
        () => this.getLiveOrdersForBays(filteredBayDetails),
        parseInt(DashboardConfig.RefreshRateOfCompartments)
      );
    } catch (error) {
      console.log("error in getLiveOrdersForBays", error);
    }
  }

  getRailOrderDetails = (transactionCode, transactionType, wagonCode) => {
    const { userDetails, tokenDetails } = this.props;
    const keyCode = [
      {
        key: "TransactionCode",
        value: transactionCode,
      },
      {
        key: "TransactionType",
        value: transactionType,
      },
      {
        key: "WagonCode",
        value: wagonCode,
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetRailOrderDetails,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        let marineOrderDetails = result.EntityResult;
        let marineOrderProductDetails = [];
        let marineOrderloadedPartCommpartmentList = [];
        let marineOrderloadedOtherCommpartmentList = [];
        let length = marineOrderDetails.CompartmentInfoList.length;
        let CompBlocks = parseInt(length / 2) + (length % 2);

        for (let i = 0; i < length; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderProductDetails = this.addProductDetailsObject(
              marineOrderProductDetails,
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }

        for (let i = 0; i < CompBlocks; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderloadedPartCommpartmentList.push(
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }
        for (let i = CompBlocks; i < length; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderloadedOtherCommpartmentList.push(
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }

        marineOrderDetails.railTransactionType = transactionType;

        this.setState({
          marineOrderDetails,
          marineOrderProductDetails,
          marineOrderloadedPartCommpartmentList,
          marineOrderloadedOtherCommpartmentList,
        });
      })
      .catch((error) => {
        console.log("Error while getting OrderDetails: ", error);
      });
  };

  getRailLiveOrderDetails = (
    transactionCode,
    transactionType,
    wagonCode,
    BCUPoint
  ) => {
    const { userDetails, tokenDetails } = this.props;
    const keyCode = [
      {
        key: "TransactionCode",
        value: transactionCode,
      },
      {
        key: "TransactionType",
        value: transactionType,
      },
      {
        key: "WagonCode",
        value: wagonCode,
      },
      {
        key: "BCUPoint",
        value: BCUPoint,
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetRailLiveOrderDetails,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        let marineOrderDetails = result.EntityResult;

        let marineOrderProductDetails = [];
        // let marineOrderloadedCommpartmentList = [];
        let marineOrderloadedPartCommpartmentList = [];
        let marineOrderloadedOtherCommpartmentList = [];
        let length = marineOrderDetails.CompartmentInfoList.length;
        let CompBlocks = parseInt(length / 2) + (length % 2);

        for (let i = 0; i < length; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            // marineOrderloadedCommpartmentList.push(marineOrderDetails.CompartmentInfoList[i]);
            marineOrderProductDetails = this.addProductDetailsObject(
              marineOrderProductDetails,
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }

        for (let i = 0; i < CompBlocks; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderloadedPartCommpartmentList.push(
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }
        for (let i = CompBlocks; i < length; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderloadedOtherCommpartmentList.push(
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }

        marineOrderDetails.railTransactionType = transactionType;

        this.setState({
          marineOrderDetails,
          marineOrderProductDetails,
          marineOrderloadedPartCommpartmentList,
          marineOrderloadedOtherCommpartmentList,
        });
      })
      .catch((error) => {
        console.log("Error while getting OrderDetails: ", error);
      });
  };

  getMarineOrderDetails = (transactionCode, transactionType, totalTime) => {
    const { userDetails, transportationType, tokenDetails } = this.props;
    const keyCode = [
      {
        key: "TransactionCode",
        value: transactionCode,
      },
      {
        key: "TransactionType",
        value: transactionType.toUpperCase(),
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    let webAPI =
      transportationType.toUpperCase() === "MARINE"
        ? RestApis.GetMarineOrderDetails
        : transportationType.toUpperCase() === "ROAD"
          ? RestApis.GetOrderDetails
          : "";

    axios(
      webAPI,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        let marineOrderDetails = result.EntityResult;
        let marineOrderProductDetails = [];
        let marineOrderloadedPartCommpartmentList = [];
        let marineOrderloadedOtherCommpartmentList = [];
        let length = marineOrderDetails.CompartmentInfoList.length;
        let CompBlocks = parseInt(length / 2) + (length % 2);

        for (let i = 0; i < length; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderProductDetails = this.addProductDetailsObject(
              marineOrderProductDetails,
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }

        for (let i = 0; i < CompBlocks; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderloadedPartCommpartmentList.push(
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }
        for (let i = CompBlocks; i < length; i++) {
          if (marineOrderDetails.CompartmentInfoList[i].Product != null) {
            marineOrderloadedOtherCommpartmentList.push(
              marineOrderDetails.CompartmentInfoList[i]
            );
          }
        }

        if (transactionType === "Dispatch") {
          marineOrderDetails.TransactionType = 0;
        } else {
          marineOrderDetails.TransactionType = 1;
        }
        marineOrderDetails.TotalTime = totalTime;

        this.setState({
          marineOrderDetails,
          marineOrderProductDetails,
          marineOrderloadedPartCommpartmentList,
          marineOrderloadedOtherCommpartmentList,
          hdnFGPrintBOL: Utilities.isInFunction(
            userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            transportationType === Constants.TransportationType.MARINE
              ? fnPrintMarineBOL
              : fnPrintBOL
          ),
          hdnFGPrintBOD: Utilities.isInFunction(
            userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            transportationType === Constants.TransportationType.MARINE
              ? fnPrintMarineBOD
              : fnPrintBOD
          ),
          hdnFGShipClose: Utilities.isInFunction(
            userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            transportationType === Constants.TransportationType.MARINE
              ? fnCloseMarineShipment
              : fnCloseShipment
          ),
          hdnFGRecClose: Utilities.isInFunction(
            userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            transportationType === Constants.TransportationType.MARINE
              ? fnCloseMarineReceipt
              : fnCloseReceipt
          ),
        });
      })
      .catch((error) => {
        console.log("Error while getting MarineOrderDetails : ", error);
      });
  };

  addProductDetailsObject(productDetails, objProductInfo) {
    var isFound = false;
    for (var i = 0; i < productDetails.length; i++) {
      if (productDetails[i].Product === objProductInfo.Product) {
        isFound = true;
        productDetails[i].LoadedQty += objProductInfo.LoadedQty;
        break;
      }
    }
    if (!isFound) {
      var obj = {
        Product: objProductInfo.Product,
        Color: objProductInfo.Color,
        LoadedQty: objProductInfo.LoadedQty,
      };
      productDetails.push(obj);
    }
    return productDetails;
  }

  print = (transactionCode, transactionType) => {
    const { transportationType, userDetails, tokenDetails } = this.props;
    const keyCode = [
      {
        key: "TransportationType",
        value: transportationType.toUpperCase(),
      },
      {
        key: "TransactionType",
        value: transactionType.toUpperCase(),
      },
      {
        key: "Code",
        value: transactionCode,
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: keyCode,
    };
    let notification = {
      messageType: "critical",
      message:
        transactionType === "Dispatch"
          ? "OperatorDashboard_OrderPrintBOLSuccessfully"
          : "OperatorDashboard_OrderPrintBODSuccessfully",
      messageResultDetails: [
        {
          keyFields: [
            this.state.transactionType === "DISPATCH"
              ? "MarineShipmentList_ShipmentCode"
              : "Marine_ReceiptCompDetail_ShipmentNumber",
          ],
          keyValues: [transactionCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.Print,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
        } else {
          notification.message =
            transactionType === "Dispatch"
              ? "OperatorDashboard_OrderPrintBOLfailed"
              : "OperatorDashboard_OrderPrintBODfailed";
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
        notification.messageResultDetails[0].errorMessage = error;
        console.log("Error while getting OrderDetails: ", error);
      });
  };

  forceCloseOK() {
    const { transportationType, userDetails, tokenDetails } = this.props;
    const { transactionCode, transactionType, reason } = this.state;
    this.setState({ marineReceiptBtnCloseOK: true });
    setTimeout(() => {
      this.setState({ marineReceiptBtnCloseOK: false });
    }, 1800);
    const keyCode = [
      {
        key: "TransactionCode",
        value: transactionCode,
      },
      {
        key: "TransactionType",
        value: transactionType,
      },
      {
        key: "TransportationType",
        value: transportationType.toUpperCase(),
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: keyCode,
      Entity: {
        Reason: reason,
      },
    };
    let notification = {
      messageType: "success",
      message:
        this.state.transactionType === "DISPATCH"
          ? "OperatorDashboard_OrderShipmentForceClosureSuccessfull"
          : "OperatorDashboard_OrderReceiptForceClosureSuccessfull",
      messageResultDetails: [
        {
          keyFields: [
            this.state.transactionType === "DISPATCH"
              ? "MarineShipmentList_ShipmentCode"
              : "Marine_ReceiptCompDetail_ShipmentNumber",
          ],
          keyValues: [transactionCode],
          isSuccess: true,
          errorMessage: "",
        },
      ],
    };
    if (this.onFieldChange("Reason", reason)) {
      axios(
        RestApis.ForceClose,
        Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          this.setState({ openReceipt: false, reason: "" });
          if (result.IsSuccess === true) {
            if (this.shipmentsDataTimer) clearTimeout(this.shipmentsDataTimer);
            this.getTransactionAndDeviceStatus(this.state.filteredBayDetails);
          } else {
            notification.messageType = "critical";
            notification.message =
              this.state.transactionType === "DISPATCH"
                ? "OperatorDashboard_OrderShipmentForceClosurefailed"
                : "OperatorDashboard_OrderReceiptForceClosurefailed";
            notification.messageResultDetails[0].isSuccess = false;
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
          console.log("Error while getting OrderDetails: ", error);
        });
    }
  }

  handleOpen = (key, boolean) => {
    this.setState({ isPopupOpen: { key: (boolean ? key : null), value: boolean } });
  };

  forceClose = (transactionCode, transactionType) => {
    this.setState({
      openReceipt: true,
      transactionCode,
      transactionType: transactionType.toUpperCase(),
      isPopupOpen: { key: null, value: false },
    });
  };

  renderModal() {
    const { openReceipt, validationErrors, marineReceiptBtnCloseOK } =
      this.state;
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal
            onClose={() => this.setState({ openReceipt: false })}
            size="small"
            open={openReceipt}
            closeOnDimmerClick={false}
          >
            <Modal.Content>
              <div className="ViewMarineReceiptCloseHeader">
                <b>
                  {" "}
                  {this.state.transactionType === "DISPATCH"
                    ? t("OperatorDashboard_OrderDispatchForceClosureHeader")
                    : t("OperatorDashboard_OrderReceiptForceClosureHeader")}
                </b>
              </div>
              <div>
                <Input
                  fluid
                  value={this.state.reason}
                  indicator="required"
                  onChange={(data) => this.onFieldChange("Reason", data)}
                  label={t("ViewMarineReceiptList_Reason")}
                  error={t(validationErrors.Reason)}
                />
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                size="small"
                content={t("ViewMarineReceiptList_Cancel")}
                onClick={() =>
                  this.setState({
                    openReceipt: false,
                    validationErrors: [],
                    reason: "",
                  })
                }
              />
              <Button
                type="primary"
                size="small"
                content={t("ViewMarineReceiptList_Ok")}
                onClick={() => {
                  this.forceCloseOK();
                }}
                disabled={marineReceiptBtnCloseOK}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  onFieldChange(propertyName, data) {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      this.setState({ reason: data });
      if (marineReceiptValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          marineReceiptValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
        if (
          validationErrors.Reason === "" ||
          validationErrors.Reason === undefined
        ) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log(
        "MarineReceiptDetailsComposite:Error occured on handleChange",
        error
      );
    }
  }

  getQueuedTransaction = (bayCode) => {
    const { userDetails, tokenDetails } = this.props;
    const keyCode = [
      {
        key: "BayCode",
        value: bayCode,
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetQueuedTransaction,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          this.setState({
            QueueDetails: result.EntityResult,
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting QueuedTransaction", error);
      });
  };

  getAlarmList = (orderCode) => {
    const { userDetails, tokenDetails } = this.props;
    const keyCode = [
      {
        key: "OrderCode",
        value: "mjtest668",
      },
      {
        key: "TransactionType",
        value: "DISPATCH", //or RECEIPT
      },
    ];
    const obj = {
      ShareHolderCode: userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.transportationType,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetAlarmList,
      Utilities.getAuthenticationObjectforPost(obj, tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          // console.info("getAlarmList", result);
        }
      })
      .catch((error) => {
        console.log("Error while getting AlarmList", error);
      });
  };

  componentDidMount() {
    var modFilter =
      this.props.transportationType === Constants.TransportationType.MARINE
        ? lodash.cloneDeep(emptyMarineOperatorDashboardFilterInfo)
        : lodash.cloneDeep(emptyOthersOperatorDashboardFilterInfo);
    this.setState({
      modFilter,
    });
    if (this.props.transportationType === Constants.TransportationType.RAIL) {
      this.getSpurDetails();
    } else {
      this.getBayDetails();
    }
    this.getShifts();
    // this.getOrderDetails();
    // this.getQueuedTransaction();
    // this.getAlarmList();
  }

  componentWillMount() {
    this.GetCurrentShift();
  }

  componentWillUnmount() {
    this.timerStop();
  }

  timerStop = () => {
    if (this.shipmentsDataTimer) clearTimeout(this.shipmentsDataTimer);
    if (this.liveCompartmentsTimer) clearTimeout(this.liveCompartmentsTimer);
  };

  onSelectChange = (data) => {
    let { modFilter } = this.state;
    let { selectList } = this.state;
    let selectlist = [];
    selectList.forEach((element) => {
      let i = data.findIndex(function (el) {
        return el === element;
      });
      if (i > -1) {
        selectlist.push(element);
      }
    });
    modFilter.selectList = selectlist;
    this.setState({ modFilter });
  };

  onCheckChange = (data) => {
    let modFilter = lodash.cloneDeep(this.state.modFilter);
    if (data) {
      modFilter.selectList = this.state.selectList;
      this.setState({ modFilter });
    } else {
      modFilter.selectList = [];
      this.setState({ modFilter });
    }
  };

  onTimeTakenChange = (data) => {
    let { modFilter } = this.state;
    modFilter.timeTaken = data;
    this.setState({ modFilter });
  };

  onGraphDurationChange = (data) => {
    let { modFilter } = this.state;
    modFilter.graphDuration = data;
    this.setState({ modFilter });
  };

  clearRailSelect = () => {
    let selectedOption = lodash.cloneDeep(this.state.selectedOption);
    let railOptions = lodash.cloneDeep(this.state.railOptions);
    selectedOption.forEach((value, index) => {
      selectedOption[index] = "select";
      railOptions[index] = [];
    });
    this.setState({ railOptions, selectedOption });
  };

  handleApply = () => {
    this.timerStop();
    this.clearRailSelect();
    let { buttonGroup, modFilter, modFilteredBayDetails } = this.state;
    let timetaken = 0;
    let viewShipmentStatus = 0;
    let filteredBayDetails = [];
    if (modFilter.timeTaken !== 1) {
      timetaken = modFilter.timeTaken;
    }
    buttonGroup.forEach((button, index) => {
      if (button.type === "primary") {
        viewShipmentStatus = index;
      }
    });
    modFilter.selectList.forEach((filteredBay, index) => {
      modFilteredBayDetails.forEach((filteredBayDetail) => {
        if (filteredBay === filteredBayDetail.Code) {
          filteredBayDetails.push(filteredBayDetail);
        }
      });
    });
    if (this.props.transportationType === Constants.TransportationType.MARINE) {
      var marineTimeScaleDuration = this.state.modFilter.graphDuration;
      this.setState(
        {
          timetaken,
          marineTimeScaleDuration,
          viewShipmentStatus,
          isFilterOpen: false,
          filteredBayDetails,
        },
        () => {
          this.getLiveOrdersForBays(filteredBayDetails);
          this.getTransactionAndDeviceStatus(filteredBayDetails);
        }
      );
    } else {
      var timeScaleDuration = this.state.modFilter.graphDuration;
      this.setState(
        {
          timetaken,
          timeScaleDuration,
          viewShipmentStatus,
          isFilterOpen: false,
          filteredBayDetails,
        },
        () => {
          this.getLiveOrdersForBays(filteredBayDetails);
          this.getTransactionAndDeviceStatus(filteredBayDetails);
        }
      );
    }
  };

  openFilter = () => {
    this.setState({ isFilterOpen: true });
  };

  handleReset() {
    var filteredBays = this.state.modFilteredBayDetails;
    this.toggleButton(0);
    var modFilter =
      this.props.transportationType === Constants.TransportationType.MARINE
        ? lodash.cloneDeep(emptyMarineOperatorDashboardFilterInfo)
        : lodash.cloneDeep(emptyOthersOperatorDashboardFilterInfo);
    modFilter.selectList = this.state.selectList;

    if (this.props.transportationType === Constants.TransportationType.MARINE) {
      this.setState(
        {
          modFilter,
          timeTaken: modFilter.timeTaken,
          marineTimeScaleDuration: modFilter.graphDuration,
          viewShipmentStatus: 0,
          isFilterOpen: false,
          filteredBayDetails: filteredBays,
        },
        () => {
          this.getLiveOrdersForBays(filteredBays);
          this.getTransactionAndDeviceStatus(filteredBays);
        }
      );
    } else {
      this.setState(
        {
          modFilter,
          timeTaken: modFilter.timeTaken,
          timeScaleDuration: modFilter.graphDuration,
          viewShipmentStatus: 0,
          isFilterOpen: false,
          filteredBayDetails: filteredBays,
        },
        () => {
          this.getLiveOrdersForBays(filteredBays);
          this.getTransactionAndDeviceStatus(filteredBays);
        }
      );
    }
  }

  toggleButton(clickedButtonIndex, buttonData) {
    const buttons = this.state.buttonGroup;
    buttons.forEach((button, index) => {
      if (clickedButtonIndex !== index) {
        buttons[index].type = "secondary";
      } else {
        buttons[index].type = "primary";
      }
    });
    this.setState({ buttonGroup: buttons });
  }

  getCurrentShifts(CurrentShift) {
    var todayShifts = [];
    var interDayShift = null;
    const { ShiftsData } = this.state;
    for (var i = 0; i < ShiftsData.length; i++) {
      var shiftInfo = {
        Name: ShiftsData[i].Name,
        StartTime: ShiftsData[i].StartTime,
        EndTime: ShiftsData[i].EndTime,
      };
      shiftInfo.StartTime.setDate(CurrentShift.StartTime.getDate());
      shiftInfo.StartTime.setMonth(CurrentShift.StartTime.getMonth());
      shiftInfo.StartTime.setYear(CurrentShift.StartTime.getFullYear());
      shiftInfo.EndTime.setDate(CurrentShift.StartTime.getDate());
      shiftInfo.EndTime.setMonth(CurrentShift.StartTime.getMonth());
      shiftInfo.EndTime.setYear(CurrentShift.StartTime.getFullYear());
      if (shiftInfo.StartTime > shiftInfo.EndTime) {
        shiftInfo.EndTime.setDate(CurrentShift.StartTime.getDate() + 1);
        interDayShift = shiftInfo;
      }

      todayShifts.push(shiftInfo);
    }

    if (ShiftsData.length > 0) {
      var firstShift = {
        Name: ShiftsData[0].Name,
        StartTime: new Date(ShiftsData[0].StartTime),
        EndTime: new Date(ShiftsData[0].EndTime),
      };
      firstShift.EndTime.setDate(firstShift.EndTime.getDate() + 1);
      firstShift.StartTime.setDate(firstShift.StartTime.getDate() + 1);
      todayShifts.push(firstShift);
    }
    if (interDayShift !== null) {
      var interShifPrevObj = {
        Name: interDayShift.Name,
        StartTime: new Date(interDayShift.StartTime),
        EndTime: new Date(interDayShift.EndTime),
      };
      interShifPrevObj.EndTime.setDate(interShifPrevObj.EndTime.getDate() - 1);
      interShifPrevObj.StartTime.setDate(
        interShifPrevObj.StartTime.getDate() - 1
      );
      todayShifts.push(interShifPrevObj);

      var interShiftNextObj = {
        Name: interDayShift.Name,
        StartTime: new Date(interDayShift.StartTime),
        EndTime: new Date(interDayShift.EndTime),
      };
      interShiftNextObj.EndTime.setDate(
        interShiftNextObj.EndTime.getDate() + 1
      );
      interShiftNextObj.StartTime.setDate(
        interShiftNextObj.StartTime.getDate() + 1
      );
      todayShifts.push(interShiftNextObj);
    }
    return todayShifts;
  }

  btnGoLiveClick = () => {
    if (!this.state.isLive) {
      document.getElementById("spanGoLive").style.cursor = "pointer";
      this.setState({ isLive: true }, () => {
        this.getTransactionAndDeviceStatus(this.state.filteredBayDetails);
      });
    }
    this.clearRailSelect();
  };

  btnBackwardClick = () => {
    try {
      var CurrentShift = this.state.CurrentShift;
      var { DashboardConfig } = this.state;
      var PurgedTime = new Date();
      PurgedTime.setHours(
        PurgedTime.getHours() - parseInt(DashboardConfig.PurgeInterval)
      );
      var proposedTime = new Date(CurrentShift.StartTime);
      proposedTime.setMinutes(proposedTime.getMinutes() - 30);
      if (PurgedTime < proposedTime) {
        this.setState({ isLive: false });
        document.getElementById("btnBackward").style.cursor = "pointer";
        CurrentShift.StartTime.setMinutes(
          CurrentShift.StartTime.getMinutes() - 30
        );
        CurrentShift.EndTime.setMinutes(CurrentShift.EndTime.getMinutes() - 30);
        this.setState({ CurrentShift });
        if (this.shipmentsDataTimer) clearTimeout(this.shipmentsDataTimer);
        this.getTransactionAndDeviceStatus(this.state.filteredBayDetails);
      }
      this.clearRailSelect();
    } catch (error) {
      console.log("error in btnBackwardClick", error);
    }
  };

  btnForwardClick = () => {
    if (!this.state.isLive) {
      var CurrentShift = this.state.CurrentShift;
      var currentTime = new Date();
      var proposedTime = new Date(CurrentShift.EndTime);
      proposedTime.setMinutes(proposedTime.getMinutes() + 30);
      if (proposedTime < currentTime) {
        this.setState({ isLive: false });
        document.getElementById("btnForward").style.cursor = "pointer";
        CurrentShift.StartTime.setMinutes(
          CurrentShift.StartTime.getMinutes() + 30
        );
        CurrentShift.EndTime.setMinutes(CurrentShift.EndTime.getMinutes() + 30);
        this.setState({ CurrentShift });
        if (this.shipmentsDataTimer) clearTimeout(this.shipmentsDataTimer);
        this.getTransactionAndDeviceStatus(this.state.filteredBayDetails);
      }
    }
    this.clearRailSelect();
  };

  onChangeSelectedOption = (data, value) => {
    let selectedOption = lodash.cloneDeep(this.state.selectedOption);
    selectedOption[value] = data;
    this.setState({ selectedOption });
  };

  heapClick = (selectedHeap, index) => {
    let railOptions = lodash.cloneDeep(this.state.railOptions);
    railOptions[index] = [];
    for (var i = 0; i < selectedHeap.AuditItems.length; i++) {
      var option = {};
      option.innerHTML = selectedHeap.AuditItems[i].TransactionCode;
      option.value = selectedHeap.AuditItems[i].TransactionCode;
      railOptions[index].push(option);
    }
    this.setState({ railOptions });
  };

  render() {
    return (
      <div>
        {this.renderModal()}
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div
                className="row"
                style={{ paddingTop: "10px", paddingBottom: "15px" }}
              >
                <OperatorDashboardThroughputSummaryComposite
                  transportationType={this.props.transportationType}
                ></OperatorDashboardThroughputSummaryComposite>
                <div className="marineDashboardHeader">
                  {this.props.transportationType ===
                    Constants.TransportationType.MARINE
                    ? t("MarineDashboard_LoadingUnloadingOverview")
                    : this.props.transportationType ===
                      Constants.TransportationType.ROAD
                      ? t("TruckDashboard_LoadingUnloadingOverview")
                      : t("RailDashboard_LoadingUnloadingOverview")}
                </div>
                <div className="marineDashboardFilter">
                  <Button
                    content={t("MarineDashboard_FilterOptions")}
                    onClick={this.openFilter}
                  ></Button>
                  <Modal
                    className="dashboardFilterModal"
                    onClose={() => this.setState({ isFilterOpen: false })}
                    open={this.state.isFilterOpen}
                    closeOnDimmerClick={true}
                    closeOnDocumentClick={true}
                    style={{ width: "50%" }}
                    closeIcon={true}
                  >
                    <Modal.Content>
                      <div className="berthFilter">
                        {this.props.transportationType ===
                          Constants.TransportationType.MARINE ? (
                          <span className="filterOrderStatus">
                            {t("MarineDispatchManualEntry_Bay")}
                          </span>
                        ) : this.props.transportationType ===
                          Constants.TransportationType.RAIL ? (
                          <span className="filterOrderStatus">
                            {t("OperatorDashboard_Spur")}
                          </span>
                        ) : (
                          <span className="filterOrderStatus">
                            {t("OperatorDashboard_Bay")}
                          </span>
                        )}
                        <div className="berthSelectFilter">
                          <Select
                            fluid
                            placeholder={t("Common_Select")}
                            options={Utilities.transferListtoOptions(
                              this.state.selectList
                            )}
                            multiple={true}
                            value={this.state.modFilter.selectList}
                            onChange={(data) => this.onSelectChange(data)}
                          />
                        </div>
                        <div className="berthCheckboxFilter">
                          <Checkbox
                            label={t("Common_All")}
                            checked={
                              Array.isArray(this.state.modFilter.selectList) &&
                              this.state.modFilter.selectList.length ===
                              this.state.selectList.length
                            }
                            onChange={(checked) => this.onCheckChange(checked)}
                          ></Checkbox>
                        </div>
                      </div>
                      <Slider
                        label={t("OperatorDashboard_TimeTaken")}
                        value={this.state.modFilter.timeTaken}
                        step={15}
                        max={75}
                        style={{
                          width: "700px",
                          marginLeft: "10px",
                          marginTop: "5px",
                        }}
                        fluid={true}
                        onChange={(data) => this.onTimeTakenChange(data)}
                      />
                      <div style={{ width: "100%", display: "flex" }}>
                        <div style={{ textAlign: "end", width: "90px" }}>|</div>
                        <div className="timeTakenSliderDescription">
                          <div className="timeTakenDescriptionItem">|</div>
                          <div className="timeTakenDescriptionItem">|</div>
                          <div className="timeTakenDescriptionItem">|</div>
                          <div className="timeTakenDescriptionItem">|</div>
                          <div className="timeTakenDescriptionItem">|</div>
                        </div>
                      </div>
                      <div style={{ width: "100%", display: "flex" }}>
                        <div className="timeTakenDescriptionText">
                          {t("OperatorDashboard_ViewAll")}
                        </div>
                        <div style={{ display: "flex", width: "calc(100% - 105px)" }}>
                          <div className="timeTakenDescriptionTextItem">
                            {t("OperatorDashboard_TimeTakenOne")}
                          </div>
                          <div className="timeTakenDescriptionTextItem">
                            {t("OperatorDashboard_TimeTakenTwo")}
                          </div>
                          <div className="timeTakenDescriptionTextItem">
                            {t("OperatorDashboard_TimeTakenThree")}
                          </div>
                          <div className="timeTakenDescriptionTextItem">
                            {t("OperatorDashboard_TimeTakenFour")}
                          </div>
                          <div className="timeTakenDescriptionTextItem">
                            {t("OperatorDashboard_TimeTakenFive")}
                          </div>
                        </div>
                      </div>
                      <Divider />
                      <span className="row" style={{ width: "99%" }}>
                        <span className="filterOrderStatus">
                          {t("OperatorDashboard_TransactionStatus")}
                        </span>
                        <Button.Group>
                          {this.state.buttonGroup.map((buttonData, index) => {
                            return (
                              <Button
                                key={index}
                                size="small"
                                content={t(buttonData.content)}
                                type={buttonData.type}
                                onClick={() =>
                                  this.toggleButton(index, buttonData)
                                }
                              />
                            );
                          })}
                        </Button.Group>
                      </span>
                      <Divider />
                      {this.props.transportationType ===
                        Constants.TransportationType.MARINE ? (
                        <div>
                          <Slider
                            label={t("OperatorDashboard_GraphDuration")}
                            step={6}
                            min={6}
                            max={24}
                            style={{
                              width: "700px",
                              marginLeft: "10px",
                              marginTop: "5px",
                            }}
                            fluid={true}
                            onChange={(data) =>
                              this.onGraphDurationChange(data)
                            }
                            value={this.state.modFilter.graphDuration}
                          />

                          <div style={{ width: "100%", display: "flex" }}>
                            <div className="graphDurationDescription">
                              |
                            </div>
                            <div className="marineDurationMarker">
                              <div className="graphDurationDescriptionItem">
                                |
                              </div>
                              <div className="graphDurationDescriptionItem">
                                |
                              </div>
                              <div className="graphDurationDescriptionItem">
                                |
                              </div>
                            </div>
                          </div>
                          <div style={{ width: "100%", display: "flex" }}>
                            <div className="graphDurationDescriptionText">
                              {t("OperatorDashboard_GraphDurationOne")}
                            </div>
                            <div className="marineDurationDesc">
                              <div className="graphDurationDescriptionTextItem">
                                {t("OperatorDashboard_GraphDurationTwo")}
                              </div>
                              <div className="graphDurationDescriptionTextItem">
                                {t("OperatorDashboard_GraphDurationThree")}
                              </div>
                              <div className="graphDurationDescriptionTextItem">
                                {t("OperatorDashboard_GraphDurationFour")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Slider
                            label={t("OperatorDashboard_GraphDuration")}
                            step={1}
                            min={2}
                            max={4}
                            style={{
                              width: "700px",
                              marginLeft: "10px",
                              marginTop: "5px",
                            }}
                            fluid={true}
                            onChange={(data) =>
                              this.onGraphDurationChange(data)
                            }
                            value={this.state.modFilter.graphDuration}
                          />
                          <div style={{ width: "100%", display: "flex" }}>
                            <div className="roadGraphDurationDescription">
                              |
                            </div>
                            <div className="roadGraphMarkerDesc">
                              <div className="roadGraphDurationDescriptionItem">
                                |
                              </div>
                              <div className="roadGraphDurationDescriptionLastItem">
                                |
                              </div>
                            </div>
                          </div>
                          <div style={{ width: "100%", display: "flex" }}>
                            <div className="roadGraphDurationDescriptionText">
                              {t("OperatorDashboard_OthersGraphDurationOne")}
                            </div>
                            <div className="roadGraphDurationDesc">
                              <div className="roadGraphDurationDescriptionTextItem">
                                {t("OperatorDashboard_OthersGraphDurationTwo")}
                              </div>
                              <div className="roadGraphDurationDescriptionTextItem">
                                {t("OperatorDashboard_OthersGraphDurationThree")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <Divider />
                    </Modal.Content>
                    <Modal.Footer>
                      <div
                        className="filterButton"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          content={t("LookUpData_btnReset")}
                          className="cancelButton"
                          size="small"
                          onClick={() => this.handleReset()}
                        ></Button>
                        <Button
                          content={t("RoleAdminEdit_Apply")}
                          size="small"
                          onClick={() => this.handleApply()}
                        ></Button>
                      </div>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        <ErrorBoundary>
          <OperatorDashboardOverviewDetails
            handleOpen={this.handleOpen}
            openBoolean={this.state.isPopupOpen}
            hdnFGPrintBOL={this.state.hdnFGPrintBOL}
            hdnFGPrintBOD={this.state.hdnFGPrintBOD}
            hdnFGShipClose={this.state.hdnFGShipClose}
            hdnFGRecClose={this.state.hdnFGRecClose}
            orderDetails={this.state.marineOrderDetails}
            orderProductDetails={this.state.marineOrderProductDetails}
            orderloadedPartCommpartmentList={
              this.state.marineOrderloadedPartCommpartmentList
            }
            orderloadedOtherCommpartmentList={
              this.state.marineOrderloadedOtherCommpartmentList
            }
            getOrderDetails={this.getMarineOrderDetails}
            getRailLiveOrderDetails={this.getRailLiveOrderDetails}
            getRailOrderDetails={this.getRailOrderDetails}
            isLive={this.state.isLive}
            print={this.print}
            forceClose={this.forceClose}
            btnGoLiveClick={this.btnGoLiveClick}
            btnBackwardClick={this.btnBackwardClick}
            btnForwardClick={this.btnForwardClick}
            getQueuedTransaction={this.getQueuedTransaction}
            transportationType={this.props.transportationType}
            filteredBayDetails={this.state.filteredBayDetails}
            ShiftsData={this.state.ShiftsData}
            CurrentShift={this.state.CurrentShift}
            DashboardConfig={this.state.DashboardConfig}
            transactionAndDeviceStatus={this.state.transactionAndDeviceStatus}
            QueueDetails={this.state.QueueDetails}
            viewShipmentStatus={this.state.viewShipmentStatus}
            timetaken={this.state.timetaken}
            objOrderDetails={this.state.objOrderDetails}
            selectedOption={this.state.selectedOption}
            onChangeSelectedOption={this.onChangeSelectedOption}
            heapClick={this.heapClick}
            railOptions={this.state.railOptions}
          ></OperatorDashboardOverviewDetails>
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

export default connect(mapStateToProps)(OperatorDashboardDetailsComposite);

OperatorDashboardDetailsComposite.propTypes = {
  activeItem: PropTypes.object,
  transportationType: PropTypes.string,
};
