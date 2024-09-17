import React, { Component } from "react";
import { PipelineDispatchDetails } from "../../UIBase/Details/PipelineDispatchDetails";

import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { pipelineDispatchValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyPipelineDispatch, emptyPipelineSnapshotInfo } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "./../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "./../../../JS/KeyCodes";
import { functionGroups, fnPipelineDispatch, fnKPIInformation } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { pipelineDispatchTankInfoDef } from "../../../JS/DetailsTableValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { pipelineDispatchAttributeEntity, pipelineDispatchStatusTimeAttributeEntity } from "../../../JS/AttributeEntity";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import PipelineDispatchManualEntryDetailsComposite from "../Details/PipelineDispatchManualEntryDetailsComposite";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Input, Button } from "@scuf/common";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { PipelineDispatchViewAuditTrailDetails } from "../../UIBase/Details/PipelineDispatchViewAuditTrailDetails";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiPipelineDispatchDetail } from "../../../JS/KPIPageName";
import dayjs from "dayjs";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class PipelineDispatchDetailsComposite extends Component {
  state = {
    pipelineDispatch: lodash.cloneDeep(emptyPipelineDispatch),
    modPipelineDispatch: {},
    validationErrors: Utilities.getInitialValidationErrors(
      pipelineDispatchValidationDef
    ),
    isReadyToRender: false,
    quantityUOMOptions: [],
    customerOptions: [],
    customerDestinationOptions: {},
    destinationOptions: [],
    pipelineHeaderOptions: [],
    pipelineHeaderMeterOptions: [],
    finishedProductOptions: [],
    tankOptions: [],
    saveEnabled: false,
    selectedCompRow: [],
    activeTab: 0,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    loadingDetails: {},
    currentDispatchStatus: {},
    shipmentNextOperations: [],
    drawerStatus: false,
    UOMS: {},
    isManualEntry: false,
    isViewAuditTrail: false,
    isMeterRequired: false,
    isTankRequired: true,
    pipelineSnapShotInfo: [],
    commentsPopUp: false,
    remarks: "",
    isSubmit: false,
    auditTrailAttributeMetaDataList: [],
    modAuditTrailList: [],
    auditTrailList: [],
    noOfSignificantDigits: "3",
    pipelineDispatchKPIList: [],
    showAuthenticationLayout: false,
    tempPipelineDispatch: {},
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.pipelineDispatch.PipelineDispatchCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined
      ) {
        this.getAttributes(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors, isManualEntry: false, activeTab: 0 });
        // this.getPipelineDispatch(nextProps.selectedRow);
      }

    } catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getUoms();
      this.getRefrenceSource();
      this.getSignificantDigits();
      if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getTank("");
        this.getHeaderLineCode("");
        this.getCustomerDestinations(
          this.props.selectedShareholder,
          null, ""
        );
        this.getFinishedProductCodes(this.props.selectedShareholder, "");
        //this.getPipelineMeter(this.props.selectedShareholder, "")
      }
      this.getAttributes(this.props.selectedRow);
      // this.getPipelineDispatch(this.props.selectedRow);
    } catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getSignificantDigits() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Common",
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.NumberOfSignificantDigits !== undefined &&
              result.EntityResult.NumberOfSignificantDigits !== null) {
              this.setState({
                noOfSignificantDigits: result.EntityResult.NumberOfSignificantDigits,
              });
            }

          } else {
            console.log("Error in getSignificantDigits: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "PipelineDispatchDetailsComposite: Error occurred on getSignificantDigits",
            error
          );
        });
    }
    catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on geting RefrenceSourceLookUp Value",
        error
      );
    }
  }

  getRefrenceSource() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=PipelineDispatch",
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.CustodyTransferReferenceSource === "0") {
              this.setState({
                isMeterRequired: true,
                isTankRequired: false
              });
            }
            else {
              this.setState({
                isMeterRequired: false,
                isTankRequired: true
              });
            }

          } else {
            console.log("Error in getLookUpData: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "PipelineDispatchDetailsComposite: Error occurred on getLookUpData",
            error
          );
        });
    }
    catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on geting RefrenceSourceLookUp Value",
        error
      );
    }
  }

  getAttributes(dispatchRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [pipelineDispatchAttributeEntity, pipelineDispatchStatusTimeAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult.PIPELINEDISPATCH),
              auditTrailAttributeMetaDataList: lodash.cloneDeep(result.EntityResult.PIPELINEDISPATCHSTATUSTIME),
              attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.PIPELINEDISPATCH
              ),
            },
            () => this.getPipelineDispatch(dispatchRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (attributeMetaDataList.length > 0)
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeMetaDataList = [];
      var modAttributeMetaDataList = [];

      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      modAttributeMetaDataList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );

      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      var modPipelineDispatch = lodash.cloneDeep(this.state.pipelineDispatch);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modPipelineDispatch.Attributes.find(
                (trailerAttribute) => {
                  return trailerAttribute.TerminalCode === terminal;
                }
              );
              if (Attributevalue !== undefined) {
                attributeMetaData.attributeMetaDataList.forEach(function (
                  attributeMetaData
                ) {
                  var valueAttribute = Attributevalue.ListOfAttributeData.find(
                    (x) => {
                      return x.AttributeCode === attributeMetaData.Code;
                    }
                  );
                  if (valueAttribute !== undefined)
                    attributeMetaData.DefaultValue =
                      valueAttribute.AttributeValue;
                });
              }
              attributesTerminalsList.push(attributeMetaData);
            }
          });
        } else {
          attributesTerminalsList.push(existitem);
        }
      });

      modAttributeMetaDataList = [];
      modAttributeMetaDataList = attributesTerminalsList;
      modAttributeMetaDataList = Utilities.attributesConvertoDecimal(
        modAttributeMetaDataList
      );
      attributeValidationErrors.forEach((attributeValidation) => {
        var existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        }
      });
      this.setState({ modAttributeMetaDataList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

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
      this.setState({
        modAttributeMetaDataList
      })
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on handleAttributeCellDataEdit",
        error
      );
    }
  };
  fillAttributeDetails(modPipelineDispatch, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modPipelineDispatch.Attributes = Utilities.fillAttributeDetails(attributeList);;

      this.setState({ modPipelineDispatch });
      return modPipelineDispatch;
    } catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }
  convertStringtoDecimal(modPipelineDispatch, attributeList) {
    try {

      modPipelineDispatch = this.fillAttributeDetails(modPipelineDispatch, attributeList);
      return modPipelineDispatch;
    } catch (err) {
      console.log("convertStringtoDecimal error Pipeline Dispatch Details", err);
    }
  }

  getUoms() {
    try {
      axios(
        RestAPIs.GetUOMList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult.VOLUME)
            ) {
              var quantityUOMOptions = lodash.cloneDeep(this.state.quantityUOMOptions);
              result.EntityResult.VOLUME.forEach((UOM) => {
                quantityUOMOptions.push({
                  text: UOM,
                  value: UOM,
                });
              });
              result.EntityResult.MASS.forEach((UOM) => {
                quantityUOMOptions.push({
                  text: UOM,
                  value: UOM,
                });
              });
              this.setState({ quantityUOMOptions, UOMS: result.EntityResult });
            }
          } else {
            console.log("Error in GetUOMList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error in GetUOMList:", error);
        });
    }
    catch (error) {
      console.log("Error in GetUOMList", error)
    }
  }

  getFinishedProductCodes(shareholder, terminal) {
    try {
      axios(
        RestAPIs.GetFinishedProductCodes +
        "?ShareholderCode=" +
        shareholder +
        "&TerminalCode=" +
        terminal,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult)
            ) {
              var finishedProductOptions = [];
              result.EntityResult.forEach((product) => {
                finishedProductOptions.push({
                  text: product,
                  value: product,
                });
              });
              this.setState({ finishedProductOptions });
            }
          } else {
            console.log("Error in GetFinishedProductCodes:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while GetFinishedProductCodes List:", error);
        });
    }
    catch (error) {
      console.log("Error in getting FinishedProduct")
    }
  }

  getCustomerDestinations(shareholder, customerCode, terminalCode) {
    try {
      axios(
        RestAPIs.GetCustomerDestinations +
        "?ShareholderCode=" +
        shareholder +
        "&TransportationType=" +
        Constants.TransportationType.PIPELINE + "&TerminalCode=" +
        terminalCode,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess === true) {
            if (Array.isArray(result.EntityResult)) {
              let shareholderCustomers = result.EntityResult.filter(
                (shareholderCust) =>
                  shareholderCust.ShareholderCode === shareholder
              );
              if (shareholderCustomers.length > 0) {
                let customerOptions = []
                let customerDestinationOptions = lodash.cloneDeep(this.state.customerDestinationOptions)
                customerDestinationOptions =
                  shareholderCustomers[0].CustomerDestinationsList;
                for (let key in customerDestinationOptions) {
                  customerOptions.push({
                    text: key,
                    value: key,
                  });
                }
                this.setState({ customerOptions, customerDestinationOptions });
                if (customerCode) {
                  this.setDestinations(customerCode);
                }
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
    }
    catch (error) {
      console.log("Error in getting CustomerDestination List", error)
    }
  }

  setDestinations(customerCode) {
    try {
      // let destinationOptions = lodash.cloneDeep(this.state.destinationOptions);
      let destinationList = [];
      this.state.customerDestinationOptions[customerCode].forEach(
        (destination) => {
          destinationList.push({ text: destination, value: destination });
        }
      );
      // listOptions.destinations = destinationList;
      this.setState({ destinationOptions: destinationList });
    }
    catch (error) {
      console.log("Errro in setting the destination options")
    }

  }

  getHeaderLineCode(terminalCode) {
    try {
      axios(
        RestAPIs.GetAllPipelineHeadersList + '?Terminal=' + terminalCode,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null && Array.isArray(result.EntityResult)) {
              let pipelineHeaderOptions = Utilities.transferListtoOptions(
                result.EntityResult
              );
              this.setState({ pipelineHeaderOptions });
            }
          } else {
            console.log("Error in getHeaderLineCode:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error in getHeaderLineCode:", error);
        });
    }
    catch (error) {
      console.log("Error in getting Header Code", error)
    }
  }

  getDispatchUpdateStates() {
    var dispatchUpdateStates = [];
    try {
      let dispatchUpdateInfo = this.props.activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.PIPELINE_DISPATCH_ENABLE_UPDATE &&
          item.ActionTypeCode === Constants.ActionTypeCode.CHECK
        );
      });
      if (dispatchUpdateInfo !== undefined &&
        dispatchUpdateInfo.length > 0)
        dispatchUpdateStates = dispatchUpdateInfo[0].ShipmentStates;
    }
    catch (error) {
      console.log("Error in gettingDispatchUpdateStates", error)
    }
    return dispatchUpdateStates
  }

  getPipelineDispatch(selectedRow) {
    try {
      let transportationType = Constants.TransportationType.PIPELINE;
      if (selectedRow.Common_Code === undefined) {
        emptyPipelineDispatch.TransactionMode =
          Constants.TransportationType.PIPELINE;
        emptyPipelineDispatch.QuantityUOM = this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.PIPELINE;
        emptyPipelineDispatch.Quantity = "";
        emptyPipelineDispatch.ScheduledEndTime = new Date();
        emptyPipelineDispatch.ScheduledStartTime = new Date();
        this.setState({
          pipelineDispatch: lodash.cloneDeep(emptyPipelineDispatch),
          modPipelineDispatch: lodash.cloneDeep(emptyPipelineDispatch),
          modAttributeMetaDataList: [],
          isReadyToRender: true,
          pipelineDispatchKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnPipelineDispatch
          ),
        },
          () => {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              if (this.props.terminalCodes.length === 1) {
                this.terminalSelectionChange(this.props.terminalCodes);
              } else {
                this.terminalSelectionChange([]);
              }
            } else {
              this.localNodeAttribute([]);
            }
          });
        return;
      }

      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: selectedRow.Common_Code,
        },
        {
          key: KeyCodes.transportationType,
          value: transportationType,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetPipelineDispatch,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.PipelineDispatchTanks === null)
              result.EntityResult.PipelineDispatchTanks = []
            else
              result.EntityResult.PipelineDispatchTanks = Utilities.addSeqNumberToListObject(
                result.EntityResult.PipelineDispatchTanks
              );
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.getTank(result.EntityResult.TerminalCodes[0]);
              this.getHeaderLineCode(result.EntityResult.TerminalCodes[0]);
              this.getPipelineMeter(result.EntityResult.PipelineHeaderCode, result.EntityResult.TerminalCodes[0]);
              this.getCustomerDestinations(
                this.props.selectedShareholder,
                result.EntityResult.CustomerCode,
                result.EntityResult.TerminalCodes[0]
              );
              this.getFinishedProductCodes(this.props.selectedShareholder, result.EntityResult.TerminalCodes[0]);
            }
            else {
              this.getPipelineMeter(result.EntityResult.PipelineHeaderCode, "");
              this.getCustomerDestinations(
                this.props.selectedShareholder,
                result.EntityResult.CustomerCode,
                ""
              );
            }
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              isReadyToRender: true,
              pipelineDispatch: result.EntityResult,
              modPipelineDispatch: { ...result.EntityResult },
              saveEnabled: dispatchUpdateStates.indexOf(result.EntityResult.PipelineDispatchStatus) > -1
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnPipelineDispatch
                ),
            }, () => {
              this.getLoadingDetails(result.EntityResult);
              this.getDispatchStatuses(selectedRow);
              this.getDispatchOperations();
              this.getKPIList(this.props.selectedShareholder, result.EntityResult.PipelineDispatchCode)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode)
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              else {
                this.localNodeAttribute();
              }
            });
          } else {
            this.setState({
              pipelineDispatch: lodash.cloneDeep(emptyPipelineDispatch),
              modPipelineDispatch: lodash.cloneDeep(emptyPipelineDispatch),
              isReadyToRender: true,
            });
            console.log("Error in GetPipelineDispatch:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting pipelineDispatch:", error);
        });
    }
    catch (error) {
      console.log("PipelineDispatchDetailsComposite : Error in getting pipeline dispatch")
    }
  }
  getDispatchOperations() {
    try {
      // const activityInfo = lodash.cloneDeep(this.state.activityInfo)
      const dispatch = lodash.cloneDeep(this.state.pipelineDispatch);
      let shipmentNextOperations = [];
      if (dispatch.PipelineDispatchStatus.toUpperCase() === Constants.PipelineDispatchStatuses.READY ||
        dispatch.PipelineDispatchStatus.toUpperCase() === Constants.PipelineDispatchStatuses.PARTIALLY_COMPLETED) {
        shipmentNextOperations.push("Authorize_ManualEntry_Update")
        shipmentNextOperations.push("Authorize_Scada_Update")
      }
      if (dispatch.PipelineDispatchStatus.toUpperCase() === Constants.PipelineDispatchStatuses.CLOSED) {
        shipmentNextOperations.push("PipelineDispatchList_btnTransactionReport")
        shipmentNextOperations.push("PipelineDispatchList_btnViewTransactionReport")
      }
      shipmentNextOperations.push("PipelineDispatch_BtnAuditTrail");
      if (dispatch.PipelineDispatchStatus.toUpperCase() !== Constants.PipelineDispatchStatuses.CLOSED &&
        dispatch.PipelineDispatchStatus.toUpperCase() !== Constants.PipelineDispatchStatuses.READY) {
        shipmentNextOperations.push("PipelineDispatch_BtnManualEntry");
        shipmentNextOperations.push("PipelineDispatch_BtnClosed");
        shipmentNextOperations.push("PipelineDispatch_BtnSubmit");
      }
      this.setState({ shipmentNextOperations })
    } catch (error) {
      console.log("Error in getting Dispatch Current Operations")
    }
  }
  getDispatchStatuses(selectedRow) {
    try {
      axios(
        RestAPIs.GetPipelineDispatchAllStatuses +
        "?shareholderCode=" +
        this.props.selectedShareholder +
        "&pipelineDispatchCode=" +
        selectedRow.Common_Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          this.setState({
            currentDispatchStatus: result.EntityResult,
          });
        })
        .catch((error) => {
          console.log("Error while getting getDispatchStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  getLoadingDetails(selectedRow) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelinePlanCode,
          value: selectedRow.PipelineDispatchCode,
        },
        {
          key: KeyCodes.pipelinePlanType,
          value: Constants.PipeLineType.DISPATCH,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetPipelineLoadingDetails,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let loadingDetails = response.data.EntityResult
          let pipelineSnapShotInfo = [];
          let remarks = lodash.cloneDeep(this.state.remarks)
          if (loadingDetails !== undefined && loadingDetails !== null) {
            let noOfSignificantDigits = lodash.cloneDeep(this.state.noOfSignificantDigits)
            if (loadingDetails.Table !== null && loadingDetails.Table.length > 0) {
              loadingDetails.Table.forEach((item) => {
                item.RationPending = item.RationPending !== null ? item.RationPending.toString().toUpperCase() === "FALSE" ? "False" : "True" : item.RationPending;
                item.ActualEndTime = item.ActualEndTime !== null ?
                  new Date(item.ActualEndTime).toLocaleDateString() + " " + new Date(item.ActualEndTime).toLocaleTimeString() : item.ActualEndTime;
                item.ActualStartTime = item.ActualStartTime !== null ?
                  new Date(item.ActualStartTime).toLocaleDateString() + " " + new Date(item.ActualStartTime).toLocaleTimeString() : item.ActualStartTime;
                item.PlannedEndTime = new Date(item.PlannedEndTime).toLocaleDateString() + " " + new Date(item.PlannedEndTime).toLocaleTimeString();
                item.PlannedStartTime = new Date(item.PlannedStartTime).toLocaleDateString() + " " + new Date(item.PlannedStartTime).toLocaleTimeString();
                pipelineSnapShotInfo.push(item);
                remarks = item.Remarks
              })
            }
            if (loadingDetails.Table2 !== null && loadingDetails.Table2.length > 0) {
              loadingDetails.Table2.forEach((item) => {
                item.EndGrossVolume = Math.round(
                  item.EndGrossVolume,
                  noOfSignificantDigits
                ).toString() + " " + item.VolumeUOM
                item.EndNetVolume = Math.round(
                  item.EndNetVolume,
                  noOfSignificantDigits
                ).toString() + " " + item.VolumeUOM
                item.StartGrossVolume = Math.round(
                  item.StartGrossVolume,
                  noOfSignificantDigits
                ).toString() + " " + item.VolumeUOM
                item.StartNetVolume = Math.round(
                  item.StartNetVolume,
                  noOfSignificantDigits
                ).toString() + " " + item.VolumeUOM
                item.Density = item.Density === null
                  || item.Density === 0 ? "0" :
                  Math.round(
                    item.Density,
                    noOfSignificantDigits
                  ).toString() + " " + item.DensityUOM
                item.Temperature = item.Temperature === null ||
                  item.Temperature === 0 ? "0" :
                  Math.round(
                    item.Temperature,
                    noOfSignificantDigits
                  ).toString() + " " + item.TemperatureUOM
              })
            }
            if (loadingDetails.Table1 !== null && loadingDetails.Table1.length > 0) {
              loadingDetails.Table1.forEach((item) => {
                item.Density = item.Density === null ||
                  item.Density === 0 ? "0" :
                  Math.round(
                    item.Density,
                    noOfSignificantDigits
                  ).toString() + " " + item.DensityUOM
                item.Temperature = item.Temperature === null ||
                  item.Temperature === 0 ? "0" :
                  Math.round(
                    item.Temperature,
                    noOfSignificantDigits
                  ).toString() + " " + item.TemperatureUOM
              })
            }
          }
          if (pipelineSnapShotInfo !== null && pipelineSnapShotInfo !== undefined && pipelineSnapShotInfo.length > 0)
            pipelineSnapShotInfo = Utilities.addSeqNumberToListObject(pipelineSnapShotInfo);

          this.setState({ loadingDetails, pipelineSnapShotInfo, remarks });
        })
        .catch((error) => {
          console.log("Error while getting dispatch compartment details:", error);
        });
    } catch (error) {
      console.log("Error in getLoadingDetails", error)
    }
  }


  addUpdatePipelineDispatch = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempPipelineDispatch = lodash.cloneDeep(this.state.tempPipelineDispatch);

      this.state.pipelineDispatch.PipelineDispatchCode === ""
      ? this.createPipelineDispatch(tempPipelineDispatch)
      : this.updatePipelineDispatch(tempPipelineDispatch);
    } catch (error) {
      console.log("pipeline Dispatch Composite : Error in addUpdatePipelineDispatch");
    }
  };

  handleSave = () => {
    try {

    //  this.setState({ saveEnabled: false });
      let modPipelineDispatch = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      if (this.validateSave(modPipelineDispatch, attributeList)) {
        modPipelineDispatch = this.convertStringtoDecimal(modPipelineDispatch, attributeList);
       
        let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
        
      let tempPipelineDispatch = lodash.cloneDeep(modPipelineDispatch);
      this.setState({ showAuthenticationLayout, tempPipelineDispatch }, () => {
        if (showAuthenticationLayout === false) {
          this.addUpdatePipelineDispatch();
        }
    });
        
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  handleOperationClick = (operation) => {
    let dispatch = lodash.cloneDeep(this.state.pipelineDispatch);

    let notification = {
      messageType: "critical",
      message: operation + "_status",
      messageResultDetails: [
        {
          keyFields: ["PipelineDispatch_DispatchCode"],
          keyValues: [dispatch.PipelineDispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    switch (operation) {
      case Constants.ViewAllPipelineDispatchOperations.Authorize_ManualEntry_Update:
        this.props.handleAuthorizeToManualEntry(
          dispatch.PipelineDispatchCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineDispatch(
                { Common_Code: dispatch.PipelineDispatchCode }
              );
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
            this.props.onSaved(dispatch, "update", notification);
          }
        );
        break;
      case Constants.ViewAllPipelineDispatchOperations.Authorize_Scada_Update:
        this.props.handleAuthorizeToScadaUpdate(
          dispatch.PipelineDispatchCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineDispatch(
                { Common_Code: dispatch.PipelineDispatchCode }
              );
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
            this.props.onSaved(dispatch, "update", notification);
          }
        );
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnTransactionReport:
        this.props.handlePrintTransaction(
          dispatch,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineDispatch({ Common_Code: dispatch.PipelineDispatchCode },
                1);
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
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
          }
        );
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnViewTransactionReport:
        this.props.handleViewTransaction();
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnAuditTrail:
        this.props.handleViewAuditTrail(
          dispatch.PipelineDispatchCode,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            ;
            if (result.IsSuccess === true) {
              let modAuditTrailList = lodash.cloneDeep(result.EntityResult);
              let attributeMetaDataList = lodash.cloneDeep(
                this.state.auditTrailAttributeMetaDataList
              );

              for (let i = 0; i < modAuditTrailList.length; i++) {

                let dispatchStatus = modAuditTrailList[i].PipelineDispatchStatus.toUpperCase();
                if (dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.CLOSED) {
                  dispatchStatus = Constants.PipelineDispatchStatus.CLOSED;
                } else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.AUTHORIZED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.AUTHORIZED;
                } else if (dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.READY) {
                  dispatchStatus = Constants.PipelineDispatchStatus.READY;
                } else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.INPROGRESS
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.INPROGRESS;
                } else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.MANUALLY_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.MANUALLY_COMPLETED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.INITIATED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.INITIATED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.INTERRUPTED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.INTERRUPTED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.AUTO_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.AUTO_COMPLETED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.PARTIALLY_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.PARTIALLY_COMPLETED;
                }
                else if (
                  dispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.EXCESSIVELY_COMPLETED
                ) {
                  dispatchStatus = Constants.PipelineDispatchStatus.EXCESSIVELY_COMPLETED;
                }
                modAuditTrailList[i].PipelineDispatchStatus = dispatchStatus;

                modAuditTrailList[i].UpdatedTime =
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
              }

              let auditTrailList = lodash.cloneDeep(result.EntityResult);
              for (let i = 0; i < auditTrailList.length; i++) {
                auditTrailList[i].UpdatedTime =
                  new Date(
                    auditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    auditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
                if (
                  auditTrailList[i].PipelineDispatchStatus === Constants.PipelineDispatchAuditTrailStatuses.AUTHORIZED
                )
                  auditTrailList[i].PipelineDispatchStatus = Constants.Pipeline_Dispatch_Status.AUTHORIZED
                auditTrailList[i].AttributesforUI =
                  this.formReadonlyCompAttributes(
                    auditTrailList[i].Attributes,
                    attributeMetaDataList
                  );
              }

              this.setState({
                auditTrailList: auditTrailList,
                modAuditTrailList: modAuditTrailList,
                isViewAuditTrail: true,
              });
              this.getPipelineDispatch({ Common_Code: dispatch.PipelineDispatchCode });
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
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnManualEntry:
        this.setState({ isManualEntry: true })
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnClosed:
        this.setState({ commentsPopUp: true, isSubmit: false })
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnSubmit:
        this.setState({ commentsPopUp: true, isSubmit: true })
        // this.handleSubmit();
        break;
      default:
        return;
    }
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

  handleCellCheck = (data, cellData) => {
    let pipelineSnapShotInfo = lodash.cloneDeep(this.state.pipelineSnapShotInfo);

    const index = pipelineSnapShotInfo.findIndex((item) => {
      return item.SeqNumber === data.rowData.SeqNumber;
    });
    if (index > -1) {
      pipelineSnapShotInfo[index].IsInvalid = cellData;
    }

    this.setState({ pipelineSnapShotInfo });
  };

  CloseDispatch() {
    try {
      let notification = {
        messageType: "critical",
        message: "PipelineTransaction_SavedMessage",
        messageResultDetails: [
          {
            keyFields: ["PipelineDispatch_DispatchCode"],
            keyValues: [this.state.pipelineDispatch.PipelineDispatchCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      let keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: this.state.pipelineDispatch.PipelineDispatchCode,
        },
        {
          key: "Remarks",
          value: this.state.remarks,
        },

      ];
      let obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.ClosePipelineDispatch , 
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
            this.getPipelineDispatch({ Common_Code: this.state.pipelineDispatch.PipelineDispatchCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            //let dispatchUpdateStates = this.getDispatchUpdateStates();
            // this.setState({
            //   saveEnabled: dispatchUpdateStates.indexOf(result.EntityResult.PipelineDispatchStatus) > -1
            //     && Utilities.isInFunction(
            //       this.props.userDetails.EntityResult.FunctionsList,
            //       functionGroups.modify,
            //       fnPipelineDispatch
            //     )
            // });
            console.log("Error in closing the dispatch:", result.ErrorList);
          }
          this.props.onSaved(this.state.pipelineDispatch, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineDispatch
              )
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.pipelineDispatch, "add", notification);
        });
    }
    catch (error) {
      console.log("PipelineDispatchDetails : Error in closing the dispatch")
    }
  }

  handleSubmit() {
    try {
      let pipelineSnapShotInfoList = []
      let rationPending = false;
      let pipelineSnapShotInfo = lodash.cloneDeep(this.state.pipelineSnapShotInfo)

      pipelineSnapShotInfo.forEach((item) => {
        let modPipelineSnapShotInfo = lodash.cloneDeep(emptyPipelineSnapshotInfo);

        modPipelineSnapShotInfo.Remarks = this.state.remarks;

        if (this.state.pipelineDispatch.PipelineDispatchCode !== null &&
          this.state.pipelineDispatch.PipelineDispatchCode !== "")
          modPipelineSnapShotInfo.PlanCode = this.state.pipelineDispatch.PipelineDispatchCode
        else
          modPipelineSnapShotInfo.PlanCode = ""

        modPipelineSnapShotInfo.TransactionType = Constants.PipeLineType.DISPATCH;
        modPipelineSnapShotInfo.ShareholderCode = this.props.selectedShareholder;


        if (item.PipelineTransactionID !== null && item.PipelineTransactionID !== "")
          modPipelineSnapShotInfo.PipelineTransactionID = Utilities.convertStringtoDecimal(item.PipelineTransactionID)

        if (item.ReceivedGrossQuantity !== null && item.ReceivedGrossQuantity !== "")
          modPipelineSnapShotInfo.GrossQuantity = Utilities.convertStringtoDecimal(item.ReceivedGrossQuantity)

        if (item.ReceivedNetQuantity !== null && item.ReceivedNetQuantity !== "")
          modPipelineSnapShotInfo.NetQuantity = Utilities.convertStringtoDecimal(item.ReceivedNetQuantity)

        if (item.RationPending !== null &&
          item.RationPending.toString().toUpperCase() === "TRUE") {
          rationPending = true;
          modPipelineSnapShotInfo.RationPending = true;
        }

        modPipelineSnapShotInfo.IsInvalid = item.IsInvalid

        pipelineSnapShotInfoList.push(modPipelineSnapShotInfo);
      })

      if (pipelineSnapShotInfoList !== null && pipelineSnapShotInfoList.length > 0) {
        if (rationPending)
          this.UpdatePipelineRationedQuantities(pipelineSnapShotInfoList);
        else
          this.MarkInvalidPipelineRecords(pipelineSnapShotInfoList);
      }

    }
    catch (error) {
      console.log("PipelineDispatchDetailsComposite : Error in forming Submit request", error)
    }
  }

  UpdatePipelineRationedQuantities(pipelineSnapShotInfoList) {
    try {

      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: this.state.pipelineDispatch.PipelineDispatchCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
        Entity: pipelineSnapShotInfoList,
      };

      var notification = {
        messageType: "critical",
        message: "PipelineTransaction_SavedMessage",
        messageResultDetails: [
          {
            keyFields: ["PipelineDispatch_DispatchCode"],
            keyValues: [this.state.pipelineDispatch.PipelineDispatchCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdatePipelineRationedQuantities,
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
            this.getPipelineDispatch({ Common_Code: this.state.pipelineDispatch.PipelineDispatchCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnPipelineDispatch
                )
            });
            console.log("Error in  Update rationed quantities:", result.ErrorList);
          }
          this.props.onSaved(this.state.pipelineDispatch, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineDispatch
              )
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.pipelineDispatch, "add", notification);
        });
    }
    catch (error) {
      console.log("PipelineDispatchDetailsComposite : Error in UpdatePipelineRationedQuantities", error)
    }
  }

  MarkInvalidPipelineRecords(pipelineSnapShotInfoList) {
    try {

      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: this.state.pipelineDispatch.PipelineDispatchCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
        Entity: pipelineSnapShotInfoList,
      };

      var notification = {
        messageType: "critical",
        message: "PipelineTransaction_SavedMessage",
        messageResultDetails: [
          {
            keyFields: ["PipelineDispatch_DispatchCode"],
            keyValues: [this.state.pipelineDispatch.PipelineDispatchCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.MarkInvalidPipelineRecords,
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
            this.getPipelineDispatch({ Common_Code: this.state.pipelineDispatch.PipelineDispatchCode });
          } else {

            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnPipelineDispatch
                )
            });

            console.log("Error in  Update invalid records:", result.ErrorList);
          }
          this.props.onSaved(this.state.pipelineDispatch, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineDispatch
              )
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.pipelineDispatch, "add", notification);
        });
    }
    catch (error) {
      console.log("PipelineDispatchDetailsComposite : Error in MarkInvalidPipelineRecords", error)
    }
  }


  onBack = () => {
    let dispatchUpdateStates = this.getDispatchUpdateStates();
    this.setState({
      isManualEntry: false,
      isViewAuditTrail: false,
      // isPlanned: true,
      saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
        && Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.modify,
          fnPipelineDispatch
        ),
      // expandedRows: [],
      // loadingExpandedRows: [],
      drawerStatus: false,
    });
    this.getPipelineDispatch({ Common_Code: this.state.modPipelineDispatch.PipelineDispatchCode });
  };

  fillDetails() {
    let { modPipelineDispatch } = { ...this.state };
    try {
      if (modPipelineDispatch.Quantity !== null && modPipelineDispatch.Quantity !== "")
        modPipelineDispatch.Quantity = Utilities.convertStringtoDecimal(
          modPipelineDispatch.Quantity
        );
      //modPipelineDispatch.ScheduledStartTime.setSeconds(parseInt('00'), parseInt('000'))
      let scheduledTime = dayjs(new Date(modPipelineDispatch.ScheduledStartTime))
        .set("second", 0).set("millisecond", 0).toDate();

      modPipelineDispatch.ScheduledStartTime = scheduledTime.toLocaleDateString() +
        " " +
        scheduledTime.toLocaleTimeString();

      modPipelineDispatch.ShareholderCode = this.props.selectedShareholder;
      let tankComps = [];//lodash.cloneDeep(modPipelineDispatch.PipelineDispatchTanks);
      if (Array.isArray(modPipelineDispatch.PipelineDispatchTanks)) {
        modPipelineDispatch.PipelineDispatchTanks.forEach((item) => {
          if (!(item.TankCode === null || item.TankCode === "")
            || !(item.Quantity === null || item.Quantity === "")) {
            item.PipelineDispatchCode =
              modPipelineDispatch.PipelineDispatchCode;
            item.QuantityUOM =
              modPipelineDispatch.QuantityUOM;
            item.Quantity =
              Utilities.convertStringtoDecimal(
                item.Quantity
              );
            item.PlannedStartTime = item.PlannedStartTime === null ?
              modPipelineDispatch.ScheduledStartTime : item.PlannedStartTime
            item.PlannedEndTime = item.PlannedEndTime === null ?
              modPipelineDispatch.ScheduledEndTime : item.PlannedEndTime
            tankComps.push(item);
          }
        })
      }
      modPipelineDispatch.PipelineDispatchTanks = tankComps;
      modPipelineDispatch.PipelineDispatchTankInfo = tankComps;
    } catch (error) {
      console.log("Error in fillDetails", error)
    }
    return modPipelineDispatch;
  }

  validateSave(modPipelineDispatch, attributeList) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);

      Object.keys(pipelineDispatchValidationDef).forEach(function (key) {
        if (modPipelineDispatch[key] !== undefined) {
          validationErrors[key] = Utilities.validateField(
            pipelineDispatchValidationDef[key],
            modPipelineDispatch[key]
          );
        }
      });

      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        if (modPipelineDispatch.TerminalCodes !== null && modPipelineDispatch.TerminalCodes.length === 0) {
          validationErrors["TerminalCodes"] = "Terminal_reqTerCode";
        }
      }

      if (this.state.isMeterRequired && (modPipelineDispatch.PipelineHeaderMeterCode === "" ||
        modPipelineDispatch.PipelineHeaderMeterCode === null ||
        modPipelineDispatch.PipelineHeaderMeterCode === undefined)) {
        validationErrors["PipelineHeaderMeterCode"] = "PipelineReceiptDetails_MandatoryHeaderMeterCode";
      }

      let notification = {
        messageType: "critical",
        message: "ShipmentCompDetail_SavedStatus",
        messageResultDetails: [],
      };

      if (
        Array.isArray(modPipelineDispatch.PipelineDispatchTanks) &&
        modPipelineDispatch.PipelineDispatchTanks.length > 0
      ) {
        let tankCodeList = [];
        let tankQuantity = 0;
        modPipelineDispatch.PipelineDispatchTanks.forEach((compart) => {
          if (tankCodeList.includes(compart.TankCode)) {
            notification.messageResultDetails.push({
              keyFields: [
                "PipelineDispatch_DispatchCode",
                "PipelineDispatch_TankCode",
              ],
              keyValues: [modPipelineDispatch.PipelineDispatchCode, compart.TankCode],
              isSuccess: false,
              errorMessage: "PIPELINEDISPATCH_TANKINFO_DUPLICATE",
            });
          } else {
            tankCodeList.push(compart.TankCode);
          }
          pipelineDispatchTankInfoDef.forEach((col) => {
            let err = "";
            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, compart[col.field]);
            }
            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: ["PipelineDispatch_DispatchCode", col.displayName],
                keyValues: [modPipelineDispatch.PipelineDispatchCode, compart[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });
          tankQuantity += compart.Quantity;
        });
        if (tankQuantity !== modPipelineDispatch.Quantity) {
          notification.messageResultDetails.push({
            keyFields: [
              "PipelineDispatch_DispatchCode",
              "PipelineDispatch_ExpectedQuantity",
            ],
            keyValues: [modPipelineDispatch.PipelineDispatchCode, modPipelineDispatch.Quantity],
            isSuccess: false,
            errorMessage: "PIPELINE_TANKPLAN_QUANTITY_INVALID_X",
          });
        }
      } else if (this.state.isTankRequired) {
        notification.messageResultDetails.push({
          keyFields: [],
          keyValues: [],
          isSuccess: false,
          errorMessage:
            "ERRMSG_PIPELINE_CUSTODYREFERENCE_TANKINFO_EMPTY",
        });
      }

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

      this.setState({ validationErrors, attributeValidationErrors });

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
        returnValue = Object.values(validationErrors).every(function (value) {
          return value === "";
        });

      if (returnValue) {
        if (notification.messageResultDetails.length > 0) {
          this.props.onSaved(modPipelineDispatch, "update", notification);
          return false;
        }
      }

      return returnValue;
    }
    catch (error) {
      console.log("Error in Validate save", error)
      return false;
    }

  }

  createPipelineDispatch(modPipelineDispatch) {
    this.handleAuthenticationClose();
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: modPipelineDispatch.PipelineDispatchCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
        Entity: modPipelineDispatch,
      };
      var notification = {
        messageType: "critical",
        message: "PipelineShipmentCompDetail_SavedSuccess",
        messageResultDetails: [
          {
            keyFields: ["PipelineDispatch_DispatchCode"],
            keyValues: [modPipelineDispatch.PipelineDispatchCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.CreatePipelineDispatch,
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
            this.getPipelineDispatch({ Common_Code: modPipelineDispatch.PipelineDispatchCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnPipelineDispatch
                ),
            });
            console.log("Error in CreatePipelineDispatch:", result.ErrorList);
          }
          this.props.onSaved(modPipelineDispatch, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineDispatch
              ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modPipelineDispatch, "add", notification);
        });
    } catch (error) {
      console.log("Error in Pipeline Create", error)
    }
  }

  handleCommentsModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.commentsPopUp} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewPipelineDispatch_CloseHeader") +
                    " : " +
                    this.state.pipelineDispatch.PipelineDispatchCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.remarks}
                    // label={t("ViewShipment_Reason")}
                    reserveSpace={false}
                    onChange={(value) => {
                      this.setState({ remarks: value });
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
                  if (this.state.remarks === "") {
                    let notification = {
                      messageType: "critical",
                      message: "ViewPipelineDispatch_ShipmentClose",
                      messageResultDetails: [
                        {
                          keyFields: ["PipelineDispatch_DispatchCode"],
                          keyValues: [this.state.pipelineDispatch.PipelineDispatchCode],
                          isSuccess: false,
                          errorMessage: "AdditiveInjectorInfo_RemarkRequired",
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
                    this.setState({ commentsPopUp: false }, () => {
                      if (this.state.isSubmit)
                        this.handleSubmit();
                      else
                        this.CloseDispatch();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    commentsPopUp: false,
                    remarks: lodash.cloneDeep(this.state.remarks),
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  updatePipelineDispatch(modPipelineDispatch) {
    this.handleAuthenticationClose();
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineDispatchCode,
          value: modPipelineDispatch.PipelineDispatchCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.pipelineDispatchCode,
        KeyCodes: keyCode,
        Entity: modPipelineDispatch,
      };
      var notification = {
        messageType: "critical",
        message: "PipelineShipmentCompDetail_SavedSuccess",
        messageResultDetails: [
          {
            keyFields: ["PipelineDispatch_DispatchCode"],
            keyValues: [modPipelineDispatch.PipelineDispatchCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdatePipelineDispatch,
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
            // this.setState({
            //   pipelineDispatch: lodash.cloneDeep(modPipelineDispatch),
            //   modPipelineDispatch: lodash.cloneDeep(modPipelineDispatch),
            //   saveEnabled: Utilities.isInFunction(
            //     this.props.userDetails.EntityResult.FunctionsList,
            //     functionGroups.modify,
            //     fnPipelineDispatch
            //   ),
            // });
            this.getPipelineDispatch({ Common_Code: modPipelineDispatch.PipelineDispatchCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnPipelineDispatch
                ),
            });
            console.log("Error in updatePipelineDispatch:", result.ErrorList);
          }
          this.props.onSaved(modPipelineDispatch, "update", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineDispatch.PipelineDispatchStatus) > -1
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineDispatch
              ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modPipelineDispatch, "modify", notification);
        });
    } catch (error) {
      console.log("Error in Pipeline Update", error)
    }
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const pipelineDispatch = lodash.cloneDeep(this.state.pipelineDispatch);

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modPipelineDispatch: { ...pipelineDispatch },
        validationErrors,
        modAttributeMetaDataList: [],
      },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(pipelineDispatch.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        });
    } catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
          attributeMetaDataList
        ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleChange = (propertyName, data) => {
    try {
      const modPipelineDispatch = lodash.cloneDeep(
        this.state.modPipelineDispatch
      );
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      modPipelineDispatch[propertyName] = data;
      if (propertyName === "CustomerCode") {
        this.setDestinations(data);
        if (
          this.state.customerDestinationOptions[data].length === 1
        ) {
          modPipelineDispatch.DestinationCode =
            this.state.customerDestinationOptions[data][0];
          validationErrors.DestinationCode = "";
        } else {
          modPipelineDispatch.DestinationCode = "";
        }
      }
      this.setState({ modPipelineDispatch });
      if (pipelineDispatchValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          pipelineDispatchValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleRowSelectionChange = (e) => {
    this.setState({ selectedCompRow: e });
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modPipelineDispatch = lodash.cloneDeep(this.state.modPipelineDispatch);

      modPipelineDispatch.PipelineDispatchTanks[cellData.rowIndex][
        cellData.field
      ] = newVal;
      this.setState({ modPipelineDispatch });
    }
    catch (error) {
      console.log("Error in handleCellDataEdit", error)
    }

  };
  handleDateTextChange = (cellData, value, error) => {
    try {
      // var validationErrors = { ...this.state.validationErrors };
      var modPipelineDispatch = lodash.cloneDeep(this.state.modPipelineDispatch);
      // validationErrors[propertyName] = error;
      let index = modPipelineDispatch.PipelineDispatchTanks.findIndex((item) => {
        return item.sequenceNo === cellData.rowData.sequenceNo
      }
      )
      if (index >= 0) {
        if (value === "")
          modPipelineDispatch.PipelineDispatchTanks[index][cellData.field] = null;
        else
          modPipelineDispatch.PipelineDispatchTanks[index][cellData.field] = value;
        this.setState({ modPipelineDispatch });
      }
    } catch (error) {
      console.log(
        "Error in DateTextChange : Error occured on handleDateTextChange",
        error
      );
    }
  };
  handleAddCompartment = () => {
    try {
      if (!this.props.userDetails.EntityResult.IsArchived) {
        try {
          let modPipelineDispatch = lodash.cloneDeep(
            this.state.modPipelineDispatch
          );
          let newComp = {
            PipelineDispatchCode: "",
            TankCode: "",
            PipelineTankMeterCode: null,
            Quantity: 0,
            QuantityUOM: "",
            PlannedStartTime: null,//todo
            PlannedEndTime: null,//todo
            SeqNumber: Utilities.getMaxSeqNumberfromListObject(modPipelineDispatch.PipelineDispatchTanks),
          };
          modPipelineDispatch.PipelineDispatchTanks.push(newComp);

          this.setState({
            modPipelineDispatch,
            selectedCompRow: [],
          });
        } catch (error) {
          console.log(
            "PipelineDispatchDetailsComposite:Error occured on handleAddCompartment",
            error
          );
        }
      }
    } catch (error) {
      console.log("PipelineDispatchDetailsComposite: Error in Add Compartment")
    }
  };

  handleDeleteCompartment = () => {
    try {
      if (!this.props.userDetails.EntityResult.IsArchived) {
        try {
          if (
            this.state.selectedCompRow != null &&
            this.state.selectedCompRow.length > 0
          ) {
            if (
              this.state.modPipelineDispatch.PipelineDispatchTanks.length > 0
            ) {
              let modPipelineDispatch = lodash.cloneDeep(
                this.state.modPipelineDispatch
              );

              this.state.selectedCompRow.forEach((obj, index) => {
                modPipelineDispatch.PipelineDispatchTanks =
                  modPipelineDispatch.PipelineDispatchTanks.filter(
                    (com, cindex) => {
                      return com.SeqNumber !== obj.SeqNumber;
                    }
                  );
              });

              this.setState({
                modPipelineDispatch,
                selectedCompRow: []
              });
            }
          }
        } catch (error) {
          console.log(
            "PipelineDispatchDetailsComposite:Error occured on handleDeleteCompartment",
            error
          );
        }
      }
    } catch (error) {
      console.log("PipelineDispatchDetailsComposite: Error in Delete Compartment")
    }
  };

  handlePipelineHeaderChange = (data) => {
    try {
      const modPipelineDispatch = lodash.cloneDeep(
        this.state.modPipelineDispatch
      );

      modPipelineDispatch["PipelineHeaderCode"] = data;
      let validationErrors = lodash.cloneDeep(this.state.validationErrors);
      validationErrors.PipelineHeaderCode = ""
      this.setState({ modPipelineDispatch, validationErrors },
        () => this.getPipelineMeter(data, modPipelineDispatch.TerminalCodes[0]));

    } catch (error) {
      console.log("PipelineDispatchDetailsComposite:Error occured on handlePipelineHeaderChange", error);
    }
  }

  handleTerminalChange = (data) => {
    try {
      const modPipelineDispatch = lodash.cloneDeep(
        this.state.modPipelineDispatch
      );
      if (data === null) {
        modPipelineDispatch["TerminalCodes"] = [];
      } else {
        modPipelineDispatch["TerminalCodes"][0] = data;
        modPipelineDispatch["PipelineHeaderCode"] = null;
        modPipelineDispatch["PipelineHeaderMeterCode"] = null;
      }
      this.setState({ modPipelineDispatch, pipelineHeaderMeterOptions: [] }, () => {
        this.getTank(data);
        this.getHeaderLineCode(data);
        this.getCustomerDestinations(this.props.selectedShareholder, modPipelineDispatch.CustomerCode, data)
        this.getFinishedProductCodes(this.props.selectedShareholder, data);
        this.terminalSelectionChange([data]);
      });
    } catch (error) {
      console.log("PipelineDispatchDetailsComposite:Error occured on handleTerminalChange", error);
    }
  }
  getPipelineMeter(headerCode, terminalCode) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineHeaderCode,
          value: headerCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.userDetails.EntityResult.IsEnterpriseNode ? terminalCode : null,
        }
      ];
      var obj = {
        keyDataCode: KeyCodes.pipelineHeaderCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.GetPipelineHeader,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          let pipelineHeaderMeterOptions = [];
          let modPipelineDispatch = lodash.cloneDeep(this.state.modPipelineDispatch)
          let validationErrors = lodash.cloneDeep(this.state.validationErrors)
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null &&
              result.EntityResult.AssociatedMeterCodes !== null &&
              Array.isArray(result.EntityResult.AssociatedMeterCodes)) {
              pipelineHeaderMeterOptions = result.EntityResult.AssociatedMeterCodes;
              if (this.state.isMeterRequired &&
                result.EntityResult.AssociatedMeterCodes.length === 1 &&
                (modPipelineDispatch.PipelineHeaderCode !== "" &&
                  modPipelineDispatch.PipelineHeaderCode !== null &&
                  modPipelineDispatch.PipelineHeaderCode !== undefined)) {
                modPipelineDispatch.PipelineHeaderMeterCode
                  = result.EntityResult.AssociatedMeterCodes[0]
                validationErrors.PipelineHeaderMeterCode = "";
              }
            }
          }
          this.setState({ pipelineHeaderMeterOptions, validationErrors, modPipelineDispatch });
        })
        .catch((error) => {
          console.log("Error while getPipelineMeter:", error);
        });

    } catch (error) {
      console.log("Error while getPipelineMeter:", error);
    }
  }

  getTank(terminal) {
    try {
      var Shareholder = this.props.userDetails.EntityResult.PrimaryShareholder;
      axios(
        RestAPIs.GetTankListForRole + "?ShareholderCode=" + Shareholder,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var tankCodeOptions = [];
            var tanks = result.EntityResult.Table;
            if (tanks !== null && Array.isArray(tanks)) {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                tanks = tanks.filter((tank) => {
                  return tank.TerminalCode === terminal;
                });
                for (let i = 0; i < tanks.length; i++) {
                  tankCodeOptions.push(tanks[i].Common_Code);
                }
              }
              else {
                for (let i = 0; i < tanks.length; i++) {
                  tankCodeOptions.push(tanks[i].Common_Code);
                }
              }
            }

            if (tankCodeOptions !== null && Array.isArray(tankCodeOptions)) {
              let tankOptions = Utilities.transferListtoOptions(
                tankCodeOptions
              );
              this.setState({ tankOptions });
            }
          } else {
            console.log("Error in getTankList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error in getTankList:", error);
        });
    }
    catch (error) {

    }
  }

  handleTabChange = (activeIndex) => {
    try {
      this.setState({ activeTab: activeIndex, expandedRows: [] });
    } catch (error) {
      console.log(
        "PipelineDispatchDetailsComposite: Error occurred on handleTabChange",
        error
      );
    }
  };

  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };
  //Get KPI for PipelineDispatchList
  getKPIList(shareholder, dispatchCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    )
    if (KPIView === true) {

      let objKPIRequestData = {
        PageName: kpiPipelineDispatchDetail,
        TransportationType: Constants.TransportationType.PIPELINE,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "ShipmentCode", value: dispatchCode }],
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
            this.setState({ pipelineDispatchKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ pipelineDispatchKPIList: [] });
            console.log("Error in pipeline KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting PipelineDispatch KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      quantityUOM: this.state.quantityUOMOptions,
      pipelineHeaderOptions: this.state.pipelineHeaderOptions,
      pipelineHeaderMeterOptions: this.state.pipelineHeaderMeterOptions,
      tankCodeOptions: this.state.tankOptions,
      terminalCodes: this.props.terminalCodes,
      customerOptions: this.state.customerOptions,
      destinationOptions: this.state.destinationOptions,
      finishedProductOptions: this.state.finishedProductOptions,
    }

    const popUpContents = [
      {
        fieldName: "PipelineDispatch_LastUpdatedTime",
        fieldValue:
          new Date(
            this.state.modPipelineDispatch.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modPipelineDispatch.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "PipelineDispatch_CreatedTime",
        fieldValue:
          new Date(
            this.state.modPipelineDispatch.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modPipelineDispatch.CreatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "PipelineDispatch_LastUpdatedBy",
        fieldValue: this.state.modPipelineDispatch.LastUpdatedBy
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <TranslationConsumer>
          {(t) => (
            <ErrorBoundary>
              <TMDetailsHeader
                entityCode={
                  this.state.isManualEntry
                    ? this.state.pipelineDispatch.PipelineDispatchCode +
                    " - " +
                    t("LoadingDetailsEntry_Title")
                    : this.state.pipelineDispatch.PipelineDispatchCode
                }
                newEntityName="PipelineDispatch_NewDispatch"
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            </ErrorBoundary>
          )}
        </TranslationConsumer>
        {this.state.isManualEntry ? (
          <div>
            <ErrorBoundary>
              <PipelineDispatchManualEntryDetailsComposite
                pipelineDispatch={this.state.modPipelineDispatch}
                handleBack={this.onBack}
                selectedShareholder={this.props.selectedShareholder}
                UOMS={this.state.UOMS}
                isMeterRequired={this.state.isMeterRequired}
                isTankRequired={this.state.isTankRequired}
                pipelineHeaderMeterOptions={this.state.pipelineHeaderMeterOptions}
              ></PipelineDispatchManualEntryDetailsComposite>
            </ErrorBoundary>
          </div>
        ) : this.state.isViewAuditTrail ? (
          <ErrorBoundary>
            <PipelineDispatchViewAuditTrailDetails
              DispatchCode={this.state.pipelineDispatch.PipelineDispatchCode}
              auditTrailList={this.state.auditTrailList}
              modAuditTrailList={this.state.modAuditTrailList}
              Attributes={
                this.state.auditTrailList !== undefined &&
                  this.state.auditTrailList.length > 0
                  ? this.state.auditTrailList[0].AttributesforUI
                  : []
              }
              handleBack={this.onBack}
            ></PipelineDispatchViewAuditTrailDetails>
          </ErrorBoundary>
        ) : (
          <div>
            <TMDetailsKPILayout KPIList={this.state.pipelineDispatchKPIList}> </TMDetailsKPILayout>
            <div
              className={
                this.state.pipelineDispatch.PipelineDispatchCode !== "" //&& this.props.shipmentSource === undefined
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <PipelineDispatchDetails
                  pipelineDispatch={this.state.pipelineDispatch}
                  modPipelineDispatch={this.state.modPipelineDispatch}
                  validationErrors={this.state.validationErrors}
                  selectedCompRow={this.state.selectedCompRow}
                  listOptions={listOptions}
                  onFieldChange={this.handleChange}
                  handleRowSelectionChange={this.handleRowSelectionChange}
                  handleCellDataEdit={this.handleCellDataEdit}
                  handleAddCompartment={this.handleAddCompartment}
                  handleDeleteCompartment={this.handleDeleteCompartment}
                  handlePipelineHeaderChange={this.handlePipelineHeaderChange}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  handleTerminalChange={this.handleTerminalChange}
                  activeTab={this.state.activeTab}
                  onTabChange={this.handleTabChange}
                  loadingDetailsTab={this.state.pipelineDispatch.PipelineDispatchCode !== "" &&
                    this.state.loadingDetails !== undefined && this.state.loadingDetails !== null ? [""] : []}
                  modAttributeMetaDataList={this.state.modAttributeMetaDataList}
                  attributeValidationErrors={
                    this.state.attributeValidationErrors
                  }
                  onAttributeDataChange={this.handleAttributeDataChange}
                  loadingDetails={this.state.loadingDetails}
                  isMeterRequired={this.state.isMeterRequired}
                  isTankRequired={this.state.isTankRequired}
                  pipelineSnapShotInfo={this.state.pipelineSnapShotInfo}
                  handleCellCheck={this.handleCellCheck}
                  onDateTextChange={this.handleDateTextChange}
                ></PipelineDispatchDetails>
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
            functionName={
              this.state.pipelineDispatch.PipelineDispatchCode  === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnPipelineDispatch}
            handleOperation={this.addUpdatePipelineDispatch}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}

            </div>
            {
              this.state.pipelineDispatch.PipelineDispatchCode !== "" ? (
                <div
                  className={
                    this.state.drawerStatus ? "marineStatusLeftPane" : ""
                  }
                >
                  <TransactionSummaryOperations
                    title={"ViewAllPipeline_Details"}
                    selectedItem={[
                      { Common_Code: this.state.pipelineDispatch.PipelineDispatchCode },
                    ]}
                    shipmentNextOperations={this.state.shipmentNextOperations}
                    handleOperationButtonClick={this.handleOperationClick}
                    currentStatuses={this.state.currentDispatchStatus}
                    unAllowedOperations={[
                      "Authorize_ManualEntry_Update",
                      "Authorize_Scada_Update",
                      "PipelineDispatch_BtnManualEntry",
                      "PipelineDispatch_BtnClosed",
                      "PipelineDispatch_BtnSubmit"
                    ]}
                    webPortalAllowedOperations={[
                      "PipelineDispatchList_btnViewTransactionReport",
                      "PipelineDispatch_BtnAuditTrail"
                    ]}
                    isDetails={true}
                    isEnterpriseNode={
                      this.props.userDetails.EntityResult.IsEnterpriseNode
                    }
                    isWebPortalUser={
                      this.props.userDetails.EntityResult.IsWebPortalUser
                    }
                    handleDrawer={this.handleDrawer}
                  />
                </div>
              ) : (
                ""
              )
            }
          </div >
        )}
        {this.state.commentsPopUp ? this.handleCommentsModal() : null}

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

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PipelineDispatchDetailsComposite);

PipelineDispatchDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
