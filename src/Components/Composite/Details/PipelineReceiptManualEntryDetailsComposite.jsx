import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import * as KeyCodes from "../../../JS/KeyCodes";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import PropTypes from "prop-types";
import * as RestAPIs from "../../../JS/RestApis";
import { PipelineReceiptManualEntryDetails } from "../../UIBase/Details/PipelineReceiptManualEntryDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as Utilities from "../../../JS/Utilities";
import { TranslationConsumer } from "@scuf/localization";
import {
  emptyPipelineCommonTransactionSnapshotInfo,
  emptyPipelineSnapshotInfo,
} from "../../../JS/DefaultEntities";
import lodash from "lodash";
import { PipelineDispatchManualEntryValidationDef } from "../../../JS/ValidationDef";
import { pipelineTransactionsAttributeEntity } from "../../../JS/AttributeEntity";
import { functionGroups,fnPipelineReceiptManualEntry} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PipelineReceiptManualEntryDetailsComposite extends Component {
  state = {
    modPipelineSnapshotInfo: lodash.cloneDeep(emptyPipelineSnapshotInfo),
    modPipelineTankTransactionSnapshotInfo: lodash.cloneDeep(
      emptyPipelineCommonTransactionSnapshotInfo
    ),
    modPipelineMeterTransactionSnapshotInfo: lodash.cloneDeep(
      emptyPipelineCommonTransactionSnapshotInfo
    ),
    quantityUOMOptions: [],
    densityUOMS: [],
    temperatureUOMs: [],
    volumeUOMs: [],
    pressureUOMs: [],
    tankCodes: [],
    meterCodes: [],
    tankValidationErrors: Utilities.getInitialValidationErrors(
      PipelineDispatchManualEntryValidationDef
    ),
    meterValidationErrors: Utilities.getInitialValidationErrors(
      PipelineDispatchManualEntryValidationDef
    ),
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    activeIndex: 0,
    manualEntrySaveEnable: true,
    showAuthenticationLayout: false,
    tempPipelineSnapshotInfo: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetUOMList();
      this.getAttributes();
      this.setDefaultValues();
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite : Error occured on componentDidMount",
        error
      );
    }
  }

  setDefaultValues() {
    try {
      let modPipelineTankTransactionSnapshotInfo = lodash.cloneDeep(
        this.state.modPipelineTankTransactionSnapshotInfo
      );
      let modPipelineMeterTransactionSnapshotInfo = lodash.cloneDeep(
        this.state.modPipelineMeterTransactionSnapshotInfo
      );
      modPipelineTankTransactionSnapshotInfo.VolumeUOM =
        this.props.receipt.QuantityUOM;
      modPipelineTankTransactionSnapshotInfo.ScanStartTime = new Date();
      modPipelineTankTransactionSnapshotInfo.ScanEndTime = new Date();
      modPipelineMeterTransactionSnapshotInfo.TemperatureUOM =
        this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.TemperatureUOM;
      modPipelineMeterTransactionSnapshotInfo.DensityUOM =
        this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.DensityUOM;

      this.setState(
        {
          modPipelineTankTransactionSnapshotInfo,
          modPipelineMeterTransactionSnapshotInfo,
        },
        () => {
          this.getmeterCodes();
          this.getTankCodes();
        }
      );
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite : Error occured while setting default values",
        error
      );
    }
  }

  getTankDetails(modPipelineTankTransactionSnapshotInfo) {
    try {
      var keyCode = [
        {
          key: KeyCodes.tankCode,
          value: modPipelineTankTransactionSnapshotInfo.TankCode,
        },

        {
          key: KeyCodes.terminalCode,
          value:
            this.props.receipt.TerminalCodes !== null &&
            this.props.receipt.TerminalCodes.length > 0
              ? this.props.receipt.TerminalCodes[0]
              : null,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.tankCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetTank,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess) {
            let tank = result.EntityResult;
            modPipelineTankTransactionSnapshotInfo.PressureUOM =
              tank.PressureUOM;
            modPipelineTankTransactionSnapshotInfo.MassUOM = tank.GrossMassUOM;
            modPipelineTankTransactionSnapshotInfo.DensityUOM = tank.DensityUOM;
            modPipelineTankTransactionSnapshotInfo.TemperatureUOM =
              tank.TemperatureUOM;
            this.setState({ modPipelineTankTransactionSnapshotInfo });
          } else {
            this.setState({ modPipelineTankTransactionSnapshotInfo });
          }
        })
        .catch((error) => {
          console.log(
            "PipelineReceiptManualEntryDetailsComposite : Error while getting Tank Details",
            error
          );
        });
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite : Error in getting Tank Details",
        error
      );
    }
  }

  getmeterCodes() {
    try {
      let receipt = lodash.cloneDeep(this.props.receipt);
      this.setState({ meterCodes: [receipt.PipelineHeaderMeterCode] }, () => {
        if (this.props.isMeterRequired && this.state.meterCodes.length === 1) {
          let modPipelineMeterTransactionSnapshotInfo = lodash.cloneDeep(
            this.state.modPipelineMeterTransactionSnapshotInfo
          );

          modPipelineMeterTransactionSnapshotInfo.MeterCode =
            this.state.meterCodes[0];

          this.setState({ modPipelineMeterTransactionSnapshotInfo });
        }
      });
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite : Error in getting meter codes",
        error
      );
    }
  }

  getTankCodes() {
    try {
      let fpCode =
        this.props.receipt.FinishedProductCode === null ||
        this.props.receipt.FinishedProductCode === undefined
          ? ""
          : this.props.receipt.FinishedProductCode;
      let shCode = this.props.selectedShareholder;

      axios(
        RestAPIs.GetDispatchPlannedTanks +
          "?shCode=" +
          shCode +
          "&finishedProductCode=" +
          fpCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              let tankCodes = [];
              tankCodes = result.EntityResult;
              this.setState({ tankCodes }, () => {
                if (this.props.isTankRequired && tankCodes.length === 1) {
                  let modPipelineTankTransactionSnapshotInfo = lodash.cloneDeep(
                    this.state.modPipelineTankTransactionSnapshotInfo
                  );

                  modPipelineTankTransactionSnapshotInfo.TankCode =
                    tankCodes[0];

                  this.getTankDetails(modPipelineTankTransactionSnapshotInfo);
                }
              });
            }
          } else {
            console.log(
              "PipelineReceiptManualEntryDetailsComposite: Error in getTankCodes:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "PipelineReceiptManualEntryDetailsComposite: Error while getting getTankCodes:",
            error
          );
        });
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite : error in getting tank codes"
      );
    }
  }

  addUnLoadingDetails = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempPipelineSnapshotInfo = lodash.cloneDeep(this.state.tempPipelineSnapshotInfo);

      this.CreateManualEntry(tempPipelineSnapshotInfo);

    } catch (error) {
      console.log("Pipeline Receipt Manual Entry Composite : Error in addUnLoadingDetails");
    }
  };
  
  handleSave = () => {
    try {
     // this.setState({ manualEntrySaveEnable: false });
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(attributeList)) {
        let pipelineSnapShotInfo = this.fillDetails(attributeList);
        
        let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
        
        let tempPipelineSnapshotInfo = lodash.cloneDeep(pipelineSnapShotInfo);
        this.setState({ showAuthenticationLayout, tempPipelineSnapshotInfo }, () => {
          if (showAuthenticationLayout === false) {
            this.addUnLoadingDetails();
          }
      });
        
      } else this.setState({ manualEntrySaveEnable: true });
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  CreateManualEntry(request) {
    this.handleAuthenticationClose();
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: this.props.selectedShareholder,
      },
      {
        key: KeyCodes.receiptCode,
        value: this.props.receipt.PipelineReceiptCode,
      },
    ];
    var notification = {
      messageType: "critical",
      message: "PipelineReceipt_ManualEntryCreateStatus",
      messageResultDetails: [
        {
          keyFields: ["PipelineReceiptDetails_ReceiptCode"],
          keyValues: [this.props.receipt.PipelineReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.pipelineReceiptCode,
      KeyCodes: keyCode,
      Entity: request,
    };
    axios(
      RestAPIs.CreatePipelineReceiptManualEntry,
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
          this.setState(
            {
              manualEntrySaveEnable: true,
              modPipelineMeterTransactionSnapshotInfo: lodash.cloneDeep(
                emptyPipelineCommonTransactionSnapshotInfo
              ),
              modPipelineTankTransactionSnapshotInfo: lodash.cloneDeep(
                emptyPipelineCommonTransactionSnapshotInfo
              ),
            },
            () => {
              this.setDefaultValues();
              var attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList
              );
              this.formAttributesForUI(attributeMetaDataList);
            }
          );
        } else {
          notification.message = "MarineDispatchManualEntry_SaveFailure";
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState(
            {
              manualEntrySaveEnable: true,
              modPipelineMeterTransactionSnapshotInfo: lodash.cloneDeep(
                emptyPipelineCommonTransactionSnapshotInfo
              ),
              modPipelineTankTransactionSnapshotInfo: lodash.cloneDeep(
                emptyPipelineCommonTransactionSnapshotInfo
              ),
            },
            () => {
              this.setDefaultValues();
              var attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList
              );
              this.formAttributesForUI(attributeMetaDataList);
            }
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
        notification.messageResultDetails[0].errorMessage = error;
        console.log(
          "PipelineReceiptManualEntryDetailsComposite: Error while creating Manual Entry:",
          error
        );
      });
  }

  fillDetails(attributeList) {
    let request = {
      pipelineSnapshotInfoList: [],
      commonTransactionSnapshotInfoList: [],
    };
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      let Attributes = Utilities.fillAttributeDetails(attributeList);
      let modPipelineSnapshotInfo = lodash.cloneDeep(
        this.state.modPipelineSnapshotInfo
      );
      let pipelineSnapShotInfoList = [];
      modPipelineSnapshotInfo.PlanCode =
        this.props.receipt.PipelineReceiptCode === null ||
        this.props.receipt.PipelineReceiptCode === ""
          ? ""
          : this.props.receipt.PipelineReceiptCode;
      modPipelineSnapshotInfo.PipelineHeaderCode =
        this.props.receipt.PipelineHeaderCode === null ||
        this.props.receipt.PipelineHeaderCode === ""
          ? ""
          : this.props.receipt.PipelineHeaderCode;
      modPipelineSnapshotInfo.TransactionType = Constants.PipeLineType.RECEIPT;

      modPipelineSnapshotInfo.ShareholderCode =
        this.props.selectedShareholder === null ||
        this.props.selectedShareholder === ""
          ? ""
          : this.props.selectedShareholder;

      pipelineSnapShotInfoList.push(modPipelineSnapshotInfo);

      let commonTransactionSnapshotInfoList = [];
      let modPipelineTankTransactionSnapshotInfo = lodash.cloneDeep(
        this.state.modPipelineTankTransactionSnapshotInfo
      );
      //Fill Tank Details
      if (
        modPipelineTankTransactionSnapshotInfo.TankCode !== "" &&
        modPipelineTankTransactionSnapshotInfo.TankCode !== null
      ) {
        // request.tankCode = modPipelineTankTransactionSnapshotInfo.TankCode;

        let commonTransactionTankStartSnapShot = lodash.cloneDeep(
          emptyPipelineCommonTransactionSnapshotInfo
        );
        let commonTransactionTankEndSnapShot = lodash.cloneDeep(
          emptyPipelineCommonTransactionSnapshotInfo
        );

        commonTransactionTankStartSnapShot.TransactionType =
          Constants.PipeLineType.RECEIPT;
        commonTransactionTankEndSnapShot.TransactionType =
          Constants.PipeLineType.RECEIPT;

        commonTransactionTankStartSnapShot.ScanTime =
          modPipelineTankTransactionSnapshotInfo.ScanStartTime;
        commonTransactionTankEndSnapShot.ScanTime =
          modPipelineTankTransactionSnapshotInfo.ScanEndTime;

        if (
          modPipelineSnapshotInfo.PipelineHeaderCode !== null &&
          modPipelineSnapshotInfo.PipelineHeaderCode !== ""
        ) {
          commonTransactionTankStartSnapShot.PipelineHeaderCode =
            modPipelineSnapshotInfo.PipelineHeaderCode;
          commonTransactionTankEndSnapShot.PipelineHeaderCode =
            modPipelineSnapshotInfo.PipelineHeaderCode;
        }

        if (
          modPipelineTankTransactionSnapshotInfo.TankCode !== "" &&
          modPipelineTankTransactionSnapshotInfo.TankCode !== null
        ) {
          commonTransactionTankStartSnapShot.TankCode =
            modPipelineTankTransactionSnapshotInfo.TankCode;
          commonTransactionTankEndSnapShot.TankCode =
            modPipelineTankTransactionSnapshotInfo.TankCode;
        }

        if (
          modPipelineTankTransactionSnapshotInfo.MeterCode !== "" &&
          modPipelineTankTransactionSnapshotInfo.MeterCode !== null
        ) {
          commonTransactionTankStartSnapShot.MeterCode =
            modPipelineTankTransactionSnapshotInfo.MeterCode;
          commonTransactionTankEndSnapShot.MeterCode =
            modPipelineTankTransactionSnapshotInfo.MeterCode;
        }

        if (
          modPipelineTankTransactionSnapshotInfo.FlowRate !== "" &&
          modPipelineTankTransactionSnapshotInfo.FlowRate !== null
        ) {
          commonTransactionTankStartSnapShot.FlowRate =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.FlowRate
            );
          commonTransactionTankEndSnapShot.FlowRate =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.FlowRate
            );
        }

        commonTransactionTankStartSnapShot.FlowRateUOM =
          modPipelineTankTransactionSnapshotInfo.FlowRateUOM;
        commonTransactionTankEndSnapShot.FlowRateUOM =
          modPipelineTankTransactionSnapshotInfo.FlowRateUOM;

        if (
          modPipelineTankTransactionSnapshotInfo.GrossStartTotalizer !== "" &&
          modPipelineTankTransactionSnapshotInfo.GrossStartTotalizer !== null
        ) {
          commonTransactionTankStartSnapShot.GrossTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.GrossStartTotalizer
            );
          commonTransactionTankEndSnapShot.GrossTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.GrossEndTotalizer
            );
        }

        if (
          modPipelineTankTransactionSnapshotInfo.NetStartTotalizer !== "" &&
          modPipelineTankTransactionSnapshotInfo.NetStartTotalizer !== null
        ) {
          commonTransactionTankStartSnapShot.NetTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.NetStartTotalizer
            );
          commonTransactionTankEndSnapShot.NetTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.NetEndTotalizer
            );
        }
        if (
          modPipelineTankTransactionSnapshotInfo.NetEndTotalizer !== "" &&
          modPipelineTankTransactionSnapshotInfo.NetEndTotalizer !== null
        ) {
          commonTransactionTankEndSnapShot.NetTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.NetEndTotalizer
            );
        }

        if (
          modPipelineTankTransactionSnapshotInfo.GrossStartVolume !== "" &&
          modPipelineTankTransactionSnapshotInfo.GrossStartVolume !== null
        ) {
          commonTransactionTankStartSnapShot.GrossVolume =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.GrossStartVolume
            );
        }
        if (
          modPipelineTankTransactionSnapshotInfo.GrossEndVolume !== "" &&
          modPipelineTankTransactionSnapshotInfo.GrossEndVolume !== null
        ) {
          commonTransactionTankEndSnapShot.GrossVolume =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.GrossEndVolume
            );
        }

        if (
          modPipelineTankTransactionSnapshotInfo.NetStartVolume !== "" &&
          modPipelineTankTransactionSnapshotInfo.NetStartVolume !== null
        ) {
          commonTransactionTankStartSnapShot.NetVolume =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.NetStartVolume
            );
        }
        if (
          modPipelineTankTransactionSnapshotInfo.NetEndVolume !== "" &&
          modPipelineTankTransactionSnapshotInfo.NetEndVolume !== null
        ) {
          commonTransactionTankEndSnapShot.NetVolume =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.NetEndVolume
            );
        }

        if (
          modPipelineTankTransactionSnapshotInfo.Temperature !== "" &&
          modPipelineTankTransactionSnapshotInfo.Temperature !== null
        ) {
          commonTransactionTankStartSnapShot.Temperature =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.Temperature
            );
          commonTransactionTankEndSnapShot.Temperature =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.Temperature
            );
        }

        if (
          modPipelineTankTransactionSnapshotInfo.TemperatureUOM !== "" &&
          modPipelineTankTransactionSnapshotInfo.TemperatureUOM !== null
        ) {
          commonTransactionTankStartSnapShot.TemperatureUOM =
            modPipelineTankTransactionSnapshotInfo.TemperatureUOM;
          commonTransactionTankEndSnapShot.TemperatureUOM =
            modPipelineTankTransactionSnapshotInfo.TemperatureUOM;
        }

        if (
          modPipelineTankTransactionSnapshotInfo.Density !== "" &&
          modPipelineTankTransactionSnapshotInfo.Density !== null
        ) {
          commonTransactionTankStartSnapShot.Density =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.Density
            );
          commonTransactionTankEndSnapShot.Density =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.Density
            );
        }

        if (
          modPipelineTankTransactionSnapshotInfo.DensityUOM !== "" &&
          modPipelineTankTransactionSnapshotInfo.DensityUOM !== null
        ) {
          commonTransactionTankStartSnapShot.DensityUOM =
            modPipelineTankTransactionSnapshotInfo.DensityUOM;
          commonTransactionTankEndSnapShot.DensityUOM =
            modPipelineTankTransactionSnapshotInfo.DensityUOM;
        }

        if (
          modPipelineTankTransactionSnapshotInfo.GrossMass !== "" &&
          modPipelineTankTransactionSnapshotInfo.GrossMass !== null
        ) {
          commonTransactionTankStartSnapShot.GrossMass =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.GrossMass
            );
          commonTransactionTankEndSnapShot.GrossMass =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.GrossMass
            );

          commonTransactionTankStartSnapShot.MassUOM =
            modPipelineTankTransactionSnapshotInfo.MassUOM;
          commonTransactionTankEndSnapShot.MassUOM =
            modPipelineTankTransactionSnapshotInfo.MassUOM;
        }

        if (
          modPipelineTankTransactionSnapshotInfo.Pressure !== "" &&
          modPipelineTankTransactionSnapshotInfo.Pressure !== null
        ) {
          commonTransactionTankStartSnapShot.Pressure =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.Pressure
            );
          commonTransactionTankEndSnapShot.Pressure =
            Utilities.convertStringtoDecimal(
              modPipelineTankTransactionSnapshotInfo.Pressure
            );
        }

        if (
          modPipelineTankTransactionSnapshotInfo.PressureUOM !== "" &&
          modPipelineTankTransactionSnapshotInfo.PressureUOM !== null
        ) {
          commonTransactionTankStartSnapShot.PressureUOM =
            modPipelineTankTransactionSnapshotInfo.PressureUOM;
          commonTransactionTankEndSnapShot.PressureUOM =
            modPipelineTankTransactionSnapshotInfo.PressureUOM;
        }
        commonTransactionTankStartSnapShot.IsManualEntry = true;
        commonTransactionTankEndSnapShot.IsManualEntry = true;

        commonTransactionTankStartSnapShot.LastUpdatedBy =
          this.props.userDetails.EntityResult.Firstname +
          " " +
          this.props.userDetails.EntityResult.LastName;
        commonTransactionTankEndSnapShot.LastUpdatedBy =
          this.props.userDetails.EntityResult.Firstname +
          " " +
          this.props.userDetails.EntityResult.LastName;

        //Attributes : TODO
        commonTransactionTankStartSnapShot.Attributes = Attributes;
        commonTransactionTankEndSnapShot.Attributes = Attributes;

        if (
          modPipelineTankTransactionSnapshotInfo.VolumeUOM !== "" &&
          modPipelineTankTransactionSnapshotInfo.VolumeUOM !== null
        ) {
          commonTransactionTankStartSnapShot.IsStart = true;
          commonTransactionTankStartSnapShot.IsEnd = false;
          commonTransactionTankEndSnapShot.IsStart = false;
          commonTransactionTankEndSnapShot.IsEnd = true;

          commonTransactionTankStartSnapShot.VolumeUOM =
            modPipelineTankTransactionSnapshotInfo.VolumeUOM;
          commonTransactionTankEndSnapShot.VolumeUOM =
            modPipelineTankTransactionSnapshotInfo.VolumeUOM;
        }

        commonTransactionSnapshotInfoList.push(
          commonTransactionTankStartSnapShot
        );
        commonTransactionSnapshotInfoList.push(
          commonTransactionTankEndSnapShot
        );
      }

      //Fill Meter Details
      let modPipelineMeterTransactionSnapshotInfo = lodash.cloneDeep(
        this.state.modPipelineMeterTransactionSnapshotInfo
      );

      if (
        modPipelineMeterTransactionSnapshotInfo.MeterCode !== "" &&
        modPipelineMeterTransactionSnapshotInfo.MeterCode !== undefined
      ) {
        let commonTransactionMeterStartSnapshotInfo = lodash.cloneDeep(
          emptyPipelineCommonTransactionSnapshotInfo
        );
        let commonTransactionMeterEndSnapshotInfo = lodash.cloneDeep(
          emptyPipelineCommonTransactionSnapshotInfo
        );

        commonTransactionMeterStartSnapshotInfo.TransactionType =
          Constants.PipeLineType.RECEIPT;
        commonTransactionMeterEndSnapshotInfo.TransactionType =
          Constants.PipeLineType.RECEIPT;

        if (
          modPipelineSnapshotInfo.PipelineHeaderCode !== null &&
          modPipelineSnapshotInfo.PipelineHeaderCode !== ""
        ) {
          commonTransactionMeterStartSnapshotInfo.PipelineHeaderCode =
            modPipelineSnapshotInfo.PipelineHeaderCode;
          commonTransactionMeterEndSnapshotInfo.PipelineHeaderCode =
            modPipelineSnapshotInfo.PipelineHeaderCode;
        } else {
          commonTransactionMeterStartSnapshotInfo.PipelineHeaderCode = "";
          commonTransactionMeterEndSnapshotInfo.PipelineHeaderCode = "";
        }

        if (
          modPipelineMeterTransactionSnapshotInfo.Density !== "" &&
          modPipelineMeterTransactionSnapshotInfo.Density !== null
        ) {
          commonTransactionMeterStartSnapshotInfo.Density =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.Density
            );
          commonTransactionMeterEndSnapshotInfo.Density =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.Density
            );
        } else {
          commonTransactionMeterStartSnapshotInfo.Density = 0;
          commonTransactionMeterEndSnapshotInfo.Density = 0;
        }

        commonTransactionMeterStartSnapshotInfo.DensityUOM =
          modPipelineMeterTransactionSnapshotInfo.DensityUOM;
        commonTransactionMeterEndSnapshotInfo.DensityUOM =
          modPipelineMeterTransactionSnapshotInfo.DensityUOM;

        commonTransactionMeterStartSnapshotInfo.IsManualEntry = true;
        commonTransactionMeterEndSnapshotInfo.IsManualEntry = true;

        if (
          modPipelineMeterTransactionSnapshotInfo.MeterCode !== "" &&
          modPipelineMeterTransactionSnapshotInfo.MeterCode !== null
        ) {
          commonTransactionMeterStartSnapshotInfo.MeterCode =
            modPipelineMeterTransactionSnapshotInfo.MeterCode;
          commonTransactionMeterEndSnapshotInfo.MeterCode =
            modPipelineMeterTransactionSnapshotInfo.MeterCode;
        }

        if (
          modPipelineMeterTransactionSnapshotInfo.Temperature !== "" &&
          modPipelineMeterTransactionSnapshotInfo.Temperature !== null
        ) {
          commonTransactionMeterStartSnapshotInfo.Temperature =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.Temperature
            );
          commonTransactionMeterEndSnapshotInfo.Temperature =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.Temperature
            );
        }

        commonTransactionMeterStartSnapshotInfo.TemperatureUOM =
          modPipelineMeterTransactionSnapshotInfo.TemperatureUOM;
        commonTransactionMeterEndSnapshotInfo.TemperatureUOM =
          modPipelineMeterTransactionSnapshotInfo.TemperatureUOM;

        if (
          modPipelineMeterTransactionSnapshotInfo.GrossStartTotalizer !== "" &&
          modPipelineMeterTransactionSnapshotInfo.GrossEndTotalizer !== null
        ) {
          commonTransactionMeterStartSnapshotInfo.GrossTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.GrossStartTotalizer
            );
          commonTransactionMeterEndSnapshotInfo.GrossTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.GrossEndTotalizer
            );
        }

        if (
          modPipelineMeterTransactionSnapshotInfo.NetStartTotalizer !== "" &&
          modPipelineMeterTransactionSnapshotInfo.NetEndTotalizer !== null
        ) {
          commonTransactionMeterStartSnapshotInfo.NetTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.NetStartTotalizer
            );
          commonTransactionMeterEndSnapshotInfo.NetTotalizer =
            Utilities.convertStringtoDecimal(
              modPipelineMeterTransactionSnapshotInfo.NetEndTotalizer
            );
        }

        commonTransactionMeterStartSnapshotInfo.ScanTime =
          modPipelineTankTransactionSnapshotInfo.ScanStartTime;
        commonTransactionMeterEndSnapshotInfo.ScanTime =
          modPipelineTankTransactionSnapshotInfo.ScanEndTime;

        commonTransactionMeterStartSnapshotInfo.LastUpdatedBy =
          this.props.userDetails.EntityResult.Firstname +
          " " +
          this.props.userDetails.EntityResult.LastName;
        commonTransactionMeterEndSnapshotInfo.LastUpdatedBy =
          this.props.userDetails.EntityResult.Firstname +
          " " +
          this.props.userDetails.EntityResult.LastName;

        commonTransactionMeterStartSnapshotInfo.Attributes = Attributes;
        commonTransactionMeterEndSnapshotInfo.Attributes = Attributes;

        commonTransactionMeterStartSnapshotInfo.IsStart = true;
        commonTransactionMeterStartSnapshotInfo.IsEnd = false;

        commonTransactionMeterEndSnapshotInfo.IsStart = false;
        commonTransactionMeterEndSnapshotInfo.IsEnd = true;

        commonTransactionSnapshotInfoList.push(
          commonTransactionMeterStartSnapshotInfo
        );
        commonTransactionSnapshotInfoList.push(
          commonTransactionMeterEndSnapshotInfo
        );
      }

      request.pipelineSnapshotInfoList = pipelineSnapShotInfoList;
      request.commonTransactionSnapshotInfoList =
        commonTransactionSnapshotInfoList;
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite:Error occured on handleSave",
        error
      );
    }
    return request;
  }

  validateSave(attributeList) {
    const tankValidationErrors = { ...this.state.tankValidationErrors };
    const meterValidationErrors = { ...this.state.meterValidationErrors };

    let modPipelineTankTransactionSnapshotInfo = lodash.cloneDeep(
      this.state.modPipelineTankTransactionSnapshotInfo
    );
    let modPipelineMeterTransactionSnapshotInfo = lodash.cloneDeep(
      this.state.modPipelineMeterTransactionSnapshotInfo
    );

    Object.keys(PipelineDispatchManualEntryValidationDef).forEach(function (
      key
    ) {
      if (modPipelineTankTransactionSnapshotInfo[key] !== undefined)
        tankValidationErrors[key] = Utilities.validateField(
          PipelineDispatchManualEntryValidationDef[key],
          modPipelineTankTransactionSnapshotInfo[key]
        );
    });

    Object.keys(PipelineDispatchManualEntryValidationDef).forEach(function (
      key
    ) {
      if (modPipelineMeterTransactionSnapshotInfo[key] !== undefined)
        meterValidationErrors[key] = Utilities.validateField(
          PipelineDispatchManualEntryValidationDef[key],
          modPipelineMeterTransactionSnapshotInfo[key]
        );
    });
    //Date validation
    if (
      modPipelineTankTransactionSnapshotInfo.ScanStartTime >=
      modPipelineTankTransactionSnapshotInfo.ScanEndTime
    ) {
      tankValidationErrors["ScanStartTime"] =
        "MarineDispatchManualEntry_ErrorLoadTime";
    }
    if (
      (modPipelineMeterTransactionSnapshotInfo.MeterCode === "" ||
        modPipelineMeterTransactionSnapshotInfo.MeterCode === null ||
        modPipelineMeterTransactionSnapshotInfo.MeterCode === undefined) &&
      this.props.isMeterRequired
    )
      meterValidationErrors["MeterCode"] =
        "PipelineReceiptDetails_MandatoryHeaderMeterCode";

    if (
      modPipelineMeterTransactionSnapshotInfo.MeterCode !== "" &&
      modPipelineMeterTransactionSnapshotInfo.MeterCode !== null &&
      modPipelineMeterTransactionSnapshotInfo.MeterCode !== undefined
    ) {
      if (
        modPipelineMeterTransactionSnapshotInfo.GrossStartTotalizer === "" ||
        modPipelineMeterTransactionSnapshotInfo.GrossStartTotalizer === null ||
        modPipelineMeterTransactionSnapshotInfo.GrossStartTotalizer ===
          undefined
      )
        meterValidationErrors["GrossStartTotalizer"] =
          "PipelineEntry_MandatoryStartGrossTotalizer";
      if (
        modPipelineMeterTransactionSnapshotInfo.GrossEndTotalizer === "" ||
        modPipelineMeterTransactionSnapshotInfo.GrossEndTotalizer === null ||
        modPipelineMeterTransactionSnapshotInfo.GrossEndTotalizer === undefined
      )
        meterValidationErrors["GrossEndTotalizer"] =
          "PipelineEntry_MandatoryEndGrossTotalizer";
      if (
        modPipelineMeterTransactionSnapshotInfo.NetStartTotalizer === "" ||
        modPipelineMeterTransactionSnapshotInfo.NetStartTotalizer === null ||
        modPipelineMeterTransactionSnapshotInfo.NetStartTotalizer === undefined
      )
        meterValidationErrors["NetStartTotalizer"] =
          "PipelineEntry_MandatoryStartNetTotalizer";
      if (
        modPipelineMeterTransactionSnapshotInfo.NetEndTotalizer === "" ||
        modPipelineMeterTransactionSnapshotInfo.NetEndTotalizer === null ||
        modPipelineMeterTransactionSnapshotInfo.NetEndTotalizer === undefined
      )
        meterValidationErrors["NetEndTotalizer"] =
          "PipelineEntry_MandatoryEndNetTotalizer";
    }

    if (
      modPipelineMeterTransactionSnapshotInfo.Temperature !== "" &&
      modPipelineMeterTransactionSnapshotInfo.Temperature !== null &&
      modPipelineMeterTransactionSnapshotInfo.Temperature !== undefined &&
      (modPipelineMeterTransactionSnapshotInfo.TemperatureUOM === "" ||
        modPipelineMeterTransactionSnapshotInfo.TemperatureUOM === null ||
        modPipelineMeterTransactionSnapshotInfo.TemperatureUOM === undefined)
    )
      meterValidationErrors["TemperatureUOM"] = "BCU_TemperatureUOMRequired";
    if (
      modPipelineMeterTransactionSnapshotInfo.Density !== "" &&
      modPipelineMeterTransactionSnapshotInfo.Density !== null &&
      modPipelineMeterTransactionSnapshotInfo.Density !== undefined &&
      (modPipelineMeterTransactionSnapshotInfo.DensityUOM === "" ||
        modPipelineMeterTransactionSnapshotInfo.DensityUOM === null ||
        modPipelineMeterTransactionSnapshotInfo.DensityUOM === undefined)
    )
      meterValidationErrors["DensityUOM"] =
        "Reconciliation_DensityUOMMandatory";

    if (
      this.props.isTankRequired &&
      (modPipelineTankTransactionSnapshotInfo.TankCode === "" ||
        modPipelineTankTransactionSnapshotInfo.TankCode === null ||
        modPipelineTankTransactionSnapshotInfo.TankCode === undefined)
    )
      tankValidationErrors["TankCode"] = "PipelineEntry_MandatoryTankCode";

    if (
      modPipelineTankTransactionSnapshotInfo.TankCode !== "" &&
      modPipelineTankTransactionSnapshotInfo.TankCode !== null &&
      modPipelineTankTransactionSnapshotInfo.TankCode !== undefined
    ) {
      if (
        modPipelineTankTransactionSnapshotInfo.GrossStartVolume === "" ||
        modPipelineTankTransactionSnapshotInfo.GrossStartVolume === null ||
        modPipelineTankTransactionSnapshotInfo.GrossStartVolume === undefined
      )
        tankValidationErrors["GrossStartVolume"] =
          "PipelineEntry_MandatoryStartGrossVolume";
      if (
        modPipelineTankTransactionSnapshotInfo.GrossEndVolume === "" ||
        modPipelineTankTransactionSnapshotInfo.GrossEndVolume === null ||
        modPipelineTankTransactionSnapshotInfo.GrossEndVolume === undefined
      )
        tankValidationErrors["GrossEndVolume"] =
          "PipelineEntry_MandatoryEndGrossVolume";
      if (
        modPipelineTankTransactionSnapshotInfo.NetStartVolume === "" ||
        modPipelineTankTransactionSnapshotInfo.NetStartVolume === null ||
        modPipelineTankTransactionSnapshotInfo.NetStartVolume === undefined
      )
        tankValidationErrors["NetStartVolume"] =
          "PipelineEntry_MandatoryStartNetVolume";
      if (
        modPipelineTankTransactionSnapshotInfo.NetEndVolume === "" ||
        modPipelineTankTransactionSnapshotInfo.NetEndVolume === null ||
        modPipelineTankTransactionSnapshotInfo.NetEndVolume === undefined
      )
        tankValidationErrors["NetEndVolume"] =
          "PipelineEntry_MandatoryEndNetVolume";
      if (
        modPipelineTankTransactionSnapshotInfo.VolumeUOM === "" ||
        modPipelineTankTransactionSnapshotInfo.VolumeUOM === null ||
        modPipelineTankTransactionSnapshotInfo.VolumeUOM === undefined
      )
        tankValidationErrors["VolumeUOM"] =
          "PipelineEntry_MandatoryEndNetTotalizer";
    }

    if (
      modPipelineTankTransactionSnapshotInfo.GrossMass !== "" &&
      modPipelineTankTransactionSnapshotInfo.GrossMass !== null &&
      modPipelineTankTransactionSnapshotInfo.GrossMass !== undefined &&
      (modPipelineTankTransactionSnapshotInfo.MassUOM === "" ||
        modPipelineTankTransactionSnapshotInfo.MassUOM === null ||
        modPipelineTankTransactionSnapshotInfo.MassUOM === undefined)
    )
      tankValidationErrors["MassUOM"] = "PipelineEntry_MandatoryMassUOM";
    if (
      modPipelineTankTransactionSnapshotInfo.Temperature !== "" &&
      modPipelineTankTransactionSnapshotInfo.Temperature !== null &&
      modPipelineTankTransactionSnapshotInfo.Temperature !== undefined &&
      (modPipelineTankTransactionSnapshotInfo.TemperatureUOM === "" ||
        modPipelineTankTransactionSnapshotInfo.TemperatureUOM === null ||
        modPipelineTankTransactionSnapshotInfo.TemperatureUOM === undefined)
    )
      tankValidationErrors["TemperatureUOM"] = "BCU_TemperatureUOMRequired";
    if (
      modPipelineTankTransactionSnapshotInfo.Density !== "" &&
      modPipelineTankTransactionSnapshotInfo.Density !== null &&
      modPipelineTankTransactionSnapshotInfo.Density !== undefined &&
      (modPipelineTankTransactionSnapshotInfo.DensityUOM === "" ||
        modPipelineTankTransactionSnapshotInfo.DensityUOM === null ||
        modPipelineTankTransactionSnapshotInfo.DensityUOM === undefined)
    )
      tankValidationErrors["DensityUOM"] = "Reconciliation_DensityUOMMandatory";
    if (
      modPipelineTankTransactionSnapshotInfo.Pressure !== "" &&
      modPipelineTankTransactionSnapshotInfo.Pressure !== null &&
      modPipelineTankTransactionSnapshotInfo.Pressure !== undefined &&
      (modPipelineTankTransactionSnapshotInfo.PressureUOM === "" ||
        modPipelineTankTransactionSnapshotInfo.PressureUOM === null ||
        modPipelineTankTransactionSnapshotInfo.PressureUOM === undefined)
    )
      tankValidationErrors["PressureUOM"] =
        "PipelineEntry_MandatoryPressureUOM";
    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    attributeList.forEach((attribute) => {
      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attribute.attributeMetaDataList.forEach((attributeMetaData) => {
            attributeValidation.attributeValidationErrors[
              attributeMetaData.Code
            ] = Utilities.valiateAttributeField(
              attributeMetaData,
              attributeMetaData.DefaultValue
            );
          });
        }
      });
    });

    this.setState({
      tankValidationErrors,
      meterValidationErrors,
      attributeValidationErrors,
    });

    var returnValue = true;
    attributeValidationErrors.forEach((x) => {
      if (returnValue) {
        returnValue = Object.values(x.attributeValidationErrors).every(
          function (value) {
            return value === "";
          }
        );
      } else {
        return returnValue;
      }
    });

    if (returnValue)
      returnValue = Object.values(tankValidationErrors).every(function (value) {
        return value === "";
      });
    if (returnValue)
      returnValue = Object.values(meterValidationErrors).every(function (
        value
      ) {
        return value === "";
      });

    return returnValue;
  }

  handleReset = () => {
    try {
      let modPipelineTankTransactionSnapshotInfo = lodash.cloneDeep(
        emptyPipelineCommonTransactionSnapshotInfo
      );
      let modPipelineMeterTransactionSnapshotInfo = lodash.cloneDeep(
        emptyPipelineCommonTransactionSnapshotInfo
      );
      if (
        this.state.isMeterRequired &&
        this.state.meterCodes !== null &&
        this.state.meterCodes.length === 1
      ) {
        modPipelineMeterTransactionSnapshotInfo.MeterCode =
          this.state.meterCodes[0];
      }

      const tankValidationErrors = { ...this.state.tankValidationErrors };
      const meterValidationErrors = { ...this.state.meterValidationErrors };
      Object.keys(tankValidationErrors).forEach(function (key) {
        tankValidationErrors[key] = "";
      });

      Object.keys(meterValidationErrors).forEach(function (key) {
        meterValidationErrors[key] = "";
      });

      this.setState(
        {
          modPipelineMeterTransactionSnapshotInfo,
          modPipelineTankTransactionSnapshotInfo,
          tankValidationErrors,
          meterValidationErrors,
        },
        () => {
          this.setDefaultValues();
        }
      );
    } catch (error) {
      console.log("PipelineReceiptManualEntryDetailsComposite: Error in reset");
    }
  };

  formAttributesForUI(attributeMetaDataList) {
    try {
      if (attributeMetaDataList.PIPELINETRANSACTIONS.length > 0) {
        let modAttributeMetaDataList = [];
        let selectedTerminals =
          attributeMetaDataList.PIPELINETRANSACTIONS[0].TerminalCode;
        attributeMetaDataList.PIPELINETRANSACTIONS.forEach(function (
          attributeMetaData
        ) {
          if (attributeMetaData.TerminalCode === selectedTerminals) {
            modAttributeMetaDataList.push(attributeMetaData);
          }
        });
        this.setState({
          modAttributeMetaDataList,
        });
        let attributeValidationErrors = lodash.cloneDeep(
          this.state.attributeValidationErrors
        );
        attributeValidationErrors.forEach((attributeValidation) => {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        });
      }
    } catch (error) {
      console.log(
        "PipelineDispatchManualEntryDetails : Error in forming attributes for UI"
      );
    }
  }

  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [pipelineTransactionsAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.PIPELINETRANSACTIONS
                ),
            },
            () => {
              this.formAttributesForUI(result.EntityResult);
            }
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  GetUOMList() {
    try {
      if (this.props.UOMS !== null && this.props.UOMS !== undefined) {
        let UOMS = this.props.UOMS;
        let quantityUOMOptions = [];
        let densityUOMS = [];
        let temperatureUOMs = [];
        let volumeUOMs = [];
        let pressureUOMs = [];

        if (Array.isArray(UOMS.VOLUME)) {
          volumeUOMs = Utilities.transferListtoOptions(UOMS.VOLUME);
        }
        if (Array.isArray(UOMS.MASS)) {
          quantityUOMOptions = Utilities.transferListtoOptions(UOMS.MASS);
        }
        if (Array.isArray(UOMS.DENSITY)) {
          densityUOMS = Utilities.transferListtoOptions(UOMS.DENSITY);
        }
        if (Array.isArray(UOMS.TEMPERATURE)) {
          temperatureUOMs = Utilities.transferListtoOptions(UOMS.TEMPERATURE);
        }
        if (Array.isArray(UOMS.PRESSURE)) {
          pressureUOMs = Utilities.transferListtoOptions(UOMS.PRESSURE);
        }

        this.setState({
          quantityUOMOptions,
          densityUOMS,
          temperatureUOMs,
          volumeUOMs,
          pressureUOMs,
        });
      }
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite : Error in getting UOMS"
      );
    }
  }

  handleChange = (source = "", propertyName, data) => {
    try {
      if (source === "Tank") {
        let modPipelineTankTransactionSnapshotInfo = lodash.cloneDeep(
          this.state.modPipelineTankTransactionSnapshotInfo
        );
        const tankValidationErrors = lodash.cloneDeep(
          this.state.tankValidationErrors
        );
        modPipelineTankTransactionSnapshotInfo[propertyName] = data;
        if (propertyName === "TankCode") {
          this.getTankDetails(modPipelineTankTransactionSnapshotInfo);
        } else if (propertyName === "ScanEndTime") {
          tankValidationErrors.ScanStartTime = "";
          this.setState({ modPipelineTankTransactionSnapshotInfo });
        } else {
          this.setState({ modPipelineTankTransactionSnapshotInfo });
        }
        if (
          PipelineDispatchManualEntryValidationDef[propertyName] !== undefined
        ) {
          tankValidationErrors[propertyName] = Utilities.validateField(
            PipelineDispatchManualEntryValidationDef[propertyName],
            data
          );
          this.setState({ tankValidationErrors });
        }
      } else if (source === "Meter") {
        let modPipelineMeterTransactionSnapshotInfo = lodash.cloneDeep(
          this.state.modPipelineMeterTransactionSnapshotInfo
        );
        modPipelineMeterTransactionSnapshotInfo[propertyName] = data;
        const meterValidationErrors = lodash.cloneDeep(
          this.state.meterValidationErrors
        );
        if (
          PipelineDispatchManualEntryValidationDef[propertyName] !== undefined
        ) {
          meterValidationErrors[propertyName] = Utilities.validateField(
            PipelineDispatchManualEntryValidationDef[propertyName],
            data
          );
        }

        this.setState({
          modPipelineMeterTransactionSnapshotInfo,
          meterValidationErrors,
        });
      } else {
        let modPipelineSnapshotInfo = lodash.clone(
          this.state.modPipelineSnapshotInfo
        );
        modPipelineSnapshotInfo[propertyName] = data;

        const tankValidationErrors = lodash.cloneDeep(
          this.state.tankValidationErrors
        );
        if (
          PipelineDispatchManualEntryValidationDef[propertyName] !== undefined
        ) {
          tankValidationErrors[propertyName] = Utilities.validateField(
            PipelineDispatchManualEntryValidationDef[propertyName],
            data
          );

          this.setState({
            modPipelineSnapshotInfo,
            tankValidationErrors,
          });
        }
      }
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite : Error in handle change"
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      let modPipelineTankTransactionSnapshotInfo = lodash.cloneDeep(
        this.state.modPipelineTankTransactionSnapshotInfo
      );
      const tankValidationErrors = lodash.cloneDeep(
        this.state.tankValidationErrors
      );
      tankValidationErrors[propertyName] = error;
      modPipelineTankTransactionSnapshotInfo[propertyName] = value;
      this.setState({
        tankValidationErrors,
        modPipelineTankTransactionSnapshotInfo,
      });
    } catch (error) {
      console.log(
        "PipelineReceiptManualEntryDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleTabChange = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  handleAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modAttributeMetaDataList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );
      let matchedAttributesList = modAttributeMetaDataList.filter(
        (modattribute) => modattribute.TerminalCode === attribute.TerminalCode
      );
      if (
        matchedAttributesList.length > 0 &&
        Array.isArray(matchedAttributesList[0].attributeMetaDataList)
      ) {
        matchedAttributes =
          matchedAttributesList[0].attributeMetaDataList.filter(
            (modattribute) => modattribute.Code === attribute.Code
          );
      }
      if (matchedAttributes.length > 0) {
        matchedAttributes[0].DefaultValue = value;
      }
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "PipelineDispatchtManualEntryDetailsComposite:Error occured on handleAttributeCellDataEditFP",
        error
      );
    }
  };

  handleTabChange = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  
 

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      quantityUOMOptions: this.state.quantityUOMOptions,
      densityUOMS: this.state.densityUOMS,
      temperatureUOMs: this.state.temperatureUOMs,
      volumeUOMs: this.state.volumeUOMs,
      pressureUOMs: this.state.pressureUOMs,
      tankCodes: this.state.tankCodes,
      meterCodes: this.state.meterCodes,
    };
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              <PipelineReceiptManualEntryDetails
                onFieldChange={this.handleChange}
                onTabChange={this.handleTabChange}
                listOptions={listOptions}
                receipt={this.props.receipt}
                modPipelineSnapshotInfo={this.state.modPipelineSnapshotInfo}
                modPipelineTankTransactionSnapshotInfo={
                  this.state.modPipelineTankTransactionSnapshotInfo
                }
                modPipelineMeterTransactionSnapshotInfo={
                  this.state.modPipelineMeterTransactionSnapshotInfo
                }
                tankValidationErrors={this.state.tankValidationErrors}
                meterValidationErrors={this.state.meterValidationErrors}
                modAttributeMetaDataList={this.state.modAttributeMetaDataList}
                onAttributeDataChange={this.handleAttributeDataChange}
                attributeValidationErrors={this.state.attributeValidationErrors}
                activeIndex={this.state.activeIndex}
                isMeterRequired={this.props.isMeterRequired}
                isTankRequired={this.props.isTankRequired}
                onDateTextChange={this.handleDateTextChange}
              ></PipelineReceiptManualEntryDetails>
            </ErrorBoundary>
            <ErrorBoundary>
              <TMDetailsUserActions
                handleBack={this.props.handleBack}
                handleSave={this.handleSave}
                handleReset={this.handleReset}
                saveEnabled={this.state.manualEntrySaveEnable}
              ></TMDetailsUserActions>
            </ErrorBoundary>

            {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.add}
            functionGroup={fnPipelineReceiptManualEntry}
            handleOperation={this.addUnLoadingDetails}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}

          </div>
        )}
      </TranslationConsumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(
  PipelineReceiptManualEntryDetailsComposite
);

PipelineReceiptManualEntryDetailsComposite.propTypes = {
  handleBack: PropTypes.func.isRequired,
  receipt: PropTypes.string.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
};
