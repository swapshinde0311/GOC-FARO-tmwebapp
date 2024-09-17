import React, { Component } from "react";
import { PipelineReceiptDetails } from "../../UIBase/Details/PipelineReceiptDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { pipelineReceiptValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyPipelineReceipt, emptyPipelineSnapshotInfo } from "../../../JS/DefaultEntities";
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
import { functionGroups, fnPipelineReceipt, fnKPIInformation } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { pipelineReceiptTankInfoDef } from "../../../JS/DetailsTableValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import {
  pipelineReceiptEntity, pipelineReceiptStatusTimeAttributeEntity
} from "../../../JS/AttributeEntity";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import { TranslationConsumer } from "@scuf/localization";
import PipelineReceiptManualEntryDetailsComposite from "../Details/PipelineReceiptManualEntryDetailsComposite";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import { PipelineReceiptViewAuditTrailDetails } from "../../UIBase/Details/PipelineReceiptViewAuditTrailsDetail";
import { Modal, Button, Input } from "@scuf/common";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { KpiPipelineReceiptDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PipelineReceiptDetailsComposite extends Component {
  state = {
    pipelineReceipt: { ...emptyPipelineReceipt },
    modPipelineReceipt: {},
    modAssociations: [],
    loadingDetails: {},
    validationErrors: Utilities.getInitialValidationErrors(
      pipelineReceiptValidationDef
    ),
    isReadyToRender: false,
    listOptions: {
      quantityUOM: [],
      suppliers: [],
      originTerminals: [],
      finishedProducts: [],
      terminalCodes: this.props.terminalCodes
    },
    quantityUOMOptions: [],
    supplierOptions: [],
    originTerminalOptions: [],
    pipelineHeaderOptions: [],
    pipelineHeaderMeterOptions: [],
    finishedProductOptions: [],
    tankOptions: [],
    saveEnabled: false,
    selectedAssociations: [],
    attributeMetaDataList: [],
    attributeValidationErrors: [],
    modAttributeMetaDataList: [],
    activeTab: 0,
    isManualEntry: false,
    currentReceiptStatus: [],
    drawerStatus:
      this.props.userDetails.EntityResult.IsWebPortalUser === true
        ? true
        : false,
    isViewAuditTrail: false,
    modAuditTrailList: [],
    auditTrailList: [],
    Remarks: "",
    RemarksPopUp: false,
    UOMS: {},
    isMeterRequired: false,
    isTankRequired: true,
    pipelineSnapShotInfo: [],
    isSubmit: false,
    viewAuditTrailAttributeMetaDataList: [],
    shipmentNextOperations: [],
    pipelineReceiptKPIList: [],
    tempPipelineReceipt: {},
  };
  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.pipelineReceipt.PipelineReceiptCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined
      )
        this.setState({ isPlanned: false, activeTab: 0, isManualEntry: false });
      this.getPipelineReceipt(nextProps.selectedRow, 0,);
    } catch (error) {
      console.log(
        "PipelineReceiptDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getUoms();
      this.getRefrenceSource();
      this.getAttributes(this.props.selectedRow);
      if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getTank("");
        this.getHeaderLineCode("");
        this.getSupplierOriginTerminals(
          this.props.selectedShareholder,
          null, ""
        );
        this.getFinishedProductCodes(this.props.selectedShareholder, "");
        this.getPipelineMeter(this.props.selectedShareholder, "")
      }

    } catch (error) {
      console.log(
        "PipelineReceiptDetailsComposite:Error occured on componentDidMount",
        error
      );
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
              var listOptions = lodash.cloneDeep(this.state.listOptions);
              // result.EntityResult.VOLUME.forEach((UOM) => {
              //   listOptions.quantityUOM.push({
              //     text: UOM,
              //     value: UOM,
              //   });
              // });
              // result.EntityResult.MASS.forEach((UOM) => {
              //   listOptions.quantityUOM.push({
              //     text: UOM,
              //     value: UOM,
              //   });
              // });
              if (result.EntityResult !== null && Array.isArray(result.EntityResult.VOLUME)) {
                listOptions.quantityUOM = Utilities.transferListtoOptions(
                  result.EntityResult.VOLUME
                );
              }
              if (Array.isArray(result.EntityResult.MASS)) {
                let massUOMOptions = Utilities.transferListtoOptions(
                  result.EntityResult.MASS
                );
                massUOMOptions.forEach((massUOM) =>
                  listOptions.quantityUOM.push(massUOM)
                );
              }
              this.setState({ listOptions, UOMS: result.EntityResult });
            }

          } else {
            console.log("Error in GetUOMList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error in GetUOMList:", error);
        });
    } catch (error) {
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
              var listOptions = lodash.cloneDeep(this.state.listOptions);
              listOptions.finishedProducts = [];
              result.EntityResult.forEach((product) => {
                listOptions.finishedProducts.push({
                  text: product,
                  value: product,
                });
              });
              this.setState({ listOptions });
            }
          } else {
            console.log("Error in GetFinishedProductCodes:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while GetFinishedProductCodes List:", error);
        });
    } catch (error) {
      console.log('error in GetFinishProduct', error)
    }
  }
  getSupplierOriginTerminals(shareholder, supplierCode, terminalCode) {
    try {
      axios(
        RestAPIs.GetSupplierOriginTerminals +
        "?ShareholderCode=" +
        shareholder +
        "&Transportationtype=" +
        Constants.TransportationType.PIPELINE + "&TerminalCode=" +
        terminalCode,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess === true) {
            if (Array.isArray(result.EntityResult)) {
              let shareholderSuppliers = result.EntityResult.filter(
                (shareholderCust) =>
                  shareholderCust.ShareholderCode === shareholder
              );
              if (shareholderSuppliers.length > 0) {
                var listOptions = lodash.cloneDeep(this.state.listOptions);
                listOptions.supplierOriginTerminalOptions =
                  shareholderSuppliers[0].SupplierOriginTerminalsList;
                listOptions.suppliers = [];
                listOptions.originTerminals = [];
                for (let key in listOptions.supplierOriginTerminalOptions) {
                  listOptions.suppliers.push({
                    text: key,
                    value: key,
                  });
                }
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  listOptions.supplierOriginTerminalOptions =
                    shareholderSuppliers[0].SupplierOriginTerminalsList
                }
                this.setState({ listOptions });
                if (supplierCode) {
                  this.setOriginTerminals(supplierCode);
                }
              } else {
                console.log("no customers identified for shareholder");
              }
            } else {
              console.log("customerdestinations not identified for shareholder");
            }
          } else {
            console.log("Error in getOriginTerminals:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getOriginTerminals List:", error);
        });
    } catch (error) {
      console.log("Error in getOriginTermials", error)
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
    } catch (error) {
      console.log("Error in getHeaderLineCode", error)
    }
  }
  getAttributes(receiptRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [pipelineReceiptEntity, pipelineReceiptStatusTimeAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.PIPELINERECEIPT
              ),
              viewAuditTrailAttributeMetaDataList: lodash.cloneDeep(result.EntityResult.PIPELINERECEIPTCHSTATUSTIME),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.PIPELINERECEIPT
                ),
            },
            () => this.getPipelineReceipt(receiptRow)
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
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

      var modPipelineReceipt = lodash.cloneDeep(this.state.pipelineReceipt);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modPipelineReceipt.Attributes.find(
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
        "PipelineReceiptDetailsComposite:Error occured on handleAttributeCellDataEdit",
        error
      );
    }
  };
  fillAttributeDetails(modPipelineReceipt, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modPipelineReceipt.Attributes = Utilities.fillAttributeDetails(attributeList);;
      // attributeList.forEach((comp) => {
      //   let attribute = {
      //     ListOfAttributeData: [],
      //   };
      //   attribute.TerminalCode = comp.TerminalCode;
      //   comp.attributeMetaDataList.forEach((det) => {
      //     attribute.ListOfAttributeData.push({
      //       AttributeCode: det.Code,
      //       AttributeValue: det.DefaultValue,
      //     });
      //   });
      //   modPipelineReceipt.Attributes.push(attribute);
      // });

      this.setState({ modPipelineReceipt });
      return modPipelineReceipt;
    } catch (error) {
      console.log(
        "PipelineReceiptDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }
  convertStringtoDecimal(modPipelineReceipt, attributeList) {
    try {
      modPipelineReceipt = this.fillAttributeDetails(modPipelineReceipt, attributeList);
      return modPipelineReceipt;
    } catch (err) {
      console.log("convertStringtoDecimal error PipelineDetails Details", err);
    }
  }
  getPipelineReceipt(selectedRow) {
    try {
      let transportationType = Constants.TransportationType.PIPELINE;
      var { listOptions } = { ...this.state };
      // emptyPipelineReceipt.TerminalCodes =
      //   this.props.terminalCodes.length === 1
      //     ? [...this.props.terminalCodes]
      //     : [];
      if (selectedRow.Common_Code === undefined) {
        emptyPipelineReceipt.QuantityUOM = this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.PIPELINE;
        emptyPipelineReceipt.TransactionMode =
          Constants.TransportationType.PIPELINE;
        emptyPipelineReceipt.Quantity = "";
        emptyPipelineReceipt.ScheduledEndTime = new Date();
        emptyPipelineReceipt.ScheduledStartTime = new Date();
        this.setState({
          pipelineReceipt: { ...emptyPipelineReceipt },
          modPipelineReceipt: { ...emptyPipelineReceipt },
          listOptions,
          isReadyToRender: true,
          activeTab: 0,
          isPlanned: false,
          pipelineReceiptKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnPipelineReceipt
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
          key: KeyCodes.pipelineReceiptCode,
          value: selectedRow.Common_Code,
        },
        {
          key: KeyCodes.transportationType,
          value: transportationType,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineReceiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetPipelineReceipt,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          console.log(result);
          if (result.IsSuccess === true) {
            // this.getSupplierOriginTerminals(
            //   this.props.selectedShareholder,
            //   result.EntityResult.SupplierCode,
            // );
            result.EntityResult.code = selectedRow.Common_Code;
            if (result.EntityResult.PipelineReceiptTanks === null)
              result.EntityResult.PipelineReceiptTanks = []
            else
              result.EntityResult.PipelineReceiptTanks = Utilities.addSeqNumberToListObject(
                result.EntityResult.PipelineReceiptTanks
              );
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.getTank(result.EntityResult.TerminalCodes[0]);
              this.getHeaderLineCode(result.EntityResult.TerminalCodes[0]);
              this.getPipelineMeter(result.EntityResult.PipelineHeaderCode, result.EntityResult.TerminalCodes[0]);
              this.getSupplierOriginTerminals(
                this.props.selectedShareholder,
                result.EntityResult.SupplierCode, result.EntityResult.TerminalCodes[0]
              );
              this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              this.getFinishedProductCodes(this.props.selectedShareholder, result.EntityResult.TerminalCodes[0]);
            }
            else {
              this.localNodeAttribute();
              this.getPipelineMeter(result.EntityResult.PipelineHeaderCode, "");
            }
            // if (result.EntityResult.PipelineReceiptStatus === "READY") {
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              isReadyToRender: true,
              pipelineReceipt: result.EntityResult,
              modPipelineReceipt: { ...result.EntityResult },
              isPlanned: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineReceipt
              ),
            }, () => {
              this.GetSnapShotsForPlan(result.EntityResult);
              this.getSupplierOriginTerminals(
                this.props.selectedShareholder,
                result.EntityResult.SupplierCode, ""
              );

              this.getReciptStatuses(selectedRow);
              this.getReceiptOperations();
              this.getKPIList(this.props.selectedShareholder, result.EntityResult.PipelineReceiptCode)
            })
            // } else {
            //   this.setState({
            //     isReadyToRender: true,
            //     pipelineReceipt: result.EntityResult,
            //     modPipelineReceipt: { ...result.EntityResult },
            //     saveEnabled: false,
            //   });
            // }
          } else {
            this.setState({
              pipelineReceipt: { ...emptyPipelineReceipt },
              modPipelineReceipt: { ...emptyPipelineReceipt },
              isReadyToRender: true,
              // isPlanned:false
            });
            console.log("Error in getPipelineReceipt:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting pipelineReceipt:", error);
        });
    } catch (error) {
      console.log("Error while getting pipelineReceipt", error)
    }
  }
  fillDetails() {
    let { modPipelineReceipt } = { ...this.state };
    try {
      if (modPipelineReceipt.Quantity !== null && modPipelineReceipt.Quantity !== "")
        modPipelineReceipt.Quantity = Utilities.convertStringtoDecimal(
          modPipelineReceipt.Quantity
        );
      modPipelineReceipt.ShareholderCode = this.props.selectedShareholder;

      modPipelineReceipt.ScheduledStartTime.setSeconds(parseInt('00'), parseInt('000'))

      let tankComps = [];
      if (Array.isArray(modPipelineReceipt.PipelineReceiptTanks)) {
        modPipelineReceipt.PipelineReceiptTanks.forEach((item) => {
          if (!(item.TankCode === null || item.TankCode === "")
            || !(item.Quantity === null || item.Quantity === "")) {
            item.PipelineReceiptCode =
              modPipelineReceipt.PipelineReceiptCode;
            item.QuantityUOM =
              modPipelineReceipt.QuantityUOM;
            item.Quantity =
              Utilities.convertStringtoDecimal(
                item.Quantity
              );
            item.PlannedStartTime = item.PlannedStartTime === null ?
              modPipelineReceipt.ScheduledStartTime : item.PlannedStartTime
            item.PlannedEndTime = item.PlannedEndTime === null ?
              modPipelineReceipt.ScheduledEndTime : item.PlannedEndTime
            tankComps.push(item);
          }
        })
      }
      modPipelineReceipt.PipelineReceiptTanks = tankComps;
    } catch (error) {
      console.log("Error in fillDetails", error)
    }
    return modPipelineReceipt;
  }

  addUpdatePipelineReceipt = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempPipelineReceipt = lodash.cloneDeep(this.state.tempPipelineReceipt);

      this.state.pipelineReceipt.PipelineReceiptCode === ""
      ? this.createPipelineReceipt(tempPipelineReceipt)
      : this.updatePipelineReceipt(tempPipelineReceipt);
    } catch (error) {
      console.log("pipeline Receipt Composite : Error in addUpdatePipelineReceipt");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      let modPipelineReceipt = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(modPipelineReceipt, attributeList)) {
        modPipelineReceipt = this.convertStringtoDecimal(modPipelineReceipt, attributeList);
       
        let showAuthenticationLayout = this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
      let tempPipelineReceipt = lodash.cloneDeep(modPipelineReceipt);
      this.setState({ showAuthenticationLayout, tempPipelineReceipt }, () => {
        if (showAuthenticationLayout === false) {
          this.addUpdatePipelineReceipt();
        }
    });
        
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "PipelineReceiptDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave(modPipelineReceipt, attributeList) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);

      Object.keys(pipelineReceiptValidationDef).forEach(function (key) {
        if (modPipelineReceipt[key] !== undefined) {
          validationErrors[key] = Utilities.validateField(
            pipelineReceiptValidationDef[key],
            modPipelineReceipt[key]
          );
        }
      });

      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        if (modPipelineReceipt.TerminalCodes !== null && modPipelineReceipt.TerminalCodes.length === 0) {
          validationErrors["TerminalCodes"] = "Terminal_reqTerCode";
        }
      }
      if (this.state.isMeterRequired && (modPipelineReceipt.PipelineHeaderMeterCode === "" ||
        modPipelineReceipt.PipelineHeaderMeterCode === null ||
        modPipelineReceipt.PipelineHeaderMeterCode === undefined)) {
        validationErrors["PipelineHeaderMeterCode"] = "PipelineReceiptDetails_MandatoryHeaderMeterCode";
      }
      let notification = {
        messageType: "critical",
        message: "PipelineReceipt_SavedSuccess_msg",
        messageResultDetails: [],
      };

      if (
        Array.isArray(modPipelineReceipt.PipelineReceiptTanks) &&
        modPipelineReceipt.PipelineReceiptTanks.length > 0
      ) {
        let tankCodeList = [];
        let tankQuantity = 0;
        modPipelineReceipt.PipelineReceiptTanks.forEach((compart) => {
          if (tankCodeList.includes(compart.TankCode)) {
            notification.messageResultDetails.push({
              keyFields: [
                "PipelineReceiptDetails_ReceiptCode",
                "PipelineReceipt_TankCode",
              ],
              keyValues: [modPipelineReceipt.PipelineReceiptCode, compart.TankCode],
              isSuccess: false,
              errorMessage: "PIPELINEDISPATCH_TANKINFO_DUPLICATE",
            });
          } else if (compart.Quantity !== "" && compart.Quantity !== 0 && (compart.TankCode === "" || compart.TankCode === null ||
            compart.TankCode === undefined)) {
            notification.messageResultDetails.push({
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage:
                "TankCode_EMPTY",
            });
          }
          else {
            tankCodeList.push(compart.TankCode);
          }
          pipelineReceiptTankInfoDef.forEach((col) => {
            let err = "";
            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, compart[col.field]);
            }
            if (err !== "" && this.state.isTankRequired) {
              notification.messageResultDetails.push({
                keyFields: [
                  "PipelineReceiptDetails_ReceiptCode",
                  col.displayName,
                ],
                keyValues: [modPipelineReceipt.PipelineReceiptCode, compart[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });
          tankQuantity += compart.Quantity;
        });
        if (tankQuantity !== modPipelineReceipt.Quantity && this.state.isTankRequired) {
          notification.messageResultDetails.push({
            keyFields: [
              "PipelineReceiptDetails_ReceiptCode",
              "PipelineReceiptDetails_Quantity",
            ],
            keyValues: [modPipelineReceipt.PipelineReceiptCode, modPipelineReceipt.Quantity],
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
      this.setState({ validationErrors });
      var returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
      if (notification.messageResultDetails.length > 0) {
        this.props.onSaved(modPipelineReceipt, "update", notification);
        return false;
      }
      return returnValue;
    } catch (error) {
      console.log("error in validate save", error)
    }
  }
  createPipelineReceipt(modPipelineReceipt) {
    this.handleAuthenticationClose();
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineReceiptCode,
          value: modPipelineReceipt.PipelineReceiptCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.pipelineReceiptCode,
        KeyCodes: keyCode,
        Entity: modPipelineReceipt,
      };
      var notification = {
        messageType: "critical",
        message: "PipelineReceipt_SavedSuccess_msg",
        messageResultDetails: [
          {
            keyFields: ["PipelineReceipt_ReceiptCode"],
            keyValues: [modPipelineReceipt.PipelineReceiptCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.CreatePipelineReceipt,
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
            //   pipelineReceipt: lodash.cloneDeep(modPipelineReceipt),
            //   modPipelineReceipt: lodash.cloneDeep(modPipelineReceipt),
            //   saveEnabled: Utilities.isInFunction(
            //     this.props.userDetails.EntityResult.FunctionsList,
            //     functionGroups.modify,
            //     fnPipelineReceipt
            //   ),
            // }, () =>
            this.getPipelineReceipt({ Common_Code: modPipelineReceipt.PipelineReceiptCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnPipelineReceipt
              ),
            });
            console.log("Error in CreatePipelineReceipt:", result.ErrorList);
          }
          this.props.onSaved(modPipelineReceipt, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnPipelineReceipt
            ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modPipelineReceipt, "add", notification);
        });
    } catch (error) {
      console.log("error in create receipt", error)
    }
  }

  updatePipelineReceipt(modPipelineReceipt) {
    this.handleAuthenticationClose();
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineReceiptCode,
          value: modPipelineReceipt.code,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.pipelineReceiptCode,
        KeyCodes: keyCode,
        Entity: modPipelineReceipt,
      };
      var notification = {
        messageType: "critical",
        message: "PipelineReceipt_SavedSuccess_msg",
        messageResultDetails: [
          {
            keyFields: ["PipelineReceipt_ReceiptCode"],
            keyValues: [modPipelineReceipt.code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdatePipelineReceipt,
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
            //   pipelineReceipt: lodash.cloneDeep(modPipelineReceipt),
            //   modPipelineReceipt: lodash.cloneDeep(modPipelineReceipt),
            //   saveEnabled: Utilities.isInFunction(
            //     this.props.userDetails.EntityResult.FunctionsList,
            //     functionGroups.modify,
            //     fnPipelineReceipt
            //   ),
            // });
            this.getPipelineReceipt({ Common_Code: modPipelineReceipt.PipelineReceiptCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnPipelineReceipt
              ),
            });
            console.log("Error in updatePipelineReceipt:", result.ErrorList);
          }
          this.props.onSaved(modPipelineReceipt, "update", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnPipelineReceipt
            ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modPipelineReceipt, "modify", notification);
        });
    } catch (error) {
      console.log("error in update Receipt", error)
    }
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const pipelineReceipt = lodash.cloneDeep(this.state.pipelineReceipt);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modPipelineReceipt: { ...pipelineReceipt },
          modAssociations: [],
          validationErrors,
        })
    } catch (error) {
      console.log(
        "PipelineReceiptDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    try {
      const modPipelineReceipt = lodash.cloneDeep(
        this.state.modPipelineReceipt
      );
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      modPipelineReceipt[propertyName] = data;

      if (propertyName === "SupplierCode") {
        this.setOriginTerminals(data);
        if (
          this.state.listOptions.supplierOriginTerminalOptions[data].length ===
          1
        ) {
          modPipelineReceipt.OriginTerminalCode =
            this.state.listOptions.supplierOriginTerminalOptions[data][0];
        } else {
          modPipelineReceipt.OriginTerminalCode = "";
        }
      }

      this.setState({ modPipelineReceipt });


      if (pipelineReceiptValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          pipelineReceiptValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "PipelinReceiptDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  setOriginTerminals(supplierCode) {
    try {
      var listOptions = lodash.cloneDeep(this.state.listOptions);
      let originTermailList = [];
      this.state.listOptions.supplierOriginTerminalOptions[supplierCode].forEach(
        (originTerminal) => {
          originTermailList.push({ text: originTerminal, value: originTerminal });
        }
      );
      listOptions.originTerminals = originTermailList;
      this.setState({ listOptions });
    } catch (error) {
      console.log("Error in setOriginterminal", error)
    }
  }

  handleAssociationSelectionChange = (e) => {
    try {
      this.setState({ selectedAssociations: e });
    } catch (error) {
      console.log("error in handlAssociationselectionchange", error)
    }
  };
  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modPipelineReceipt = lodash.cloneDeep(this.state.modPipelineReceipt);
      modPipelineReceipt.PipelineReceiptTanks[cellData.rowIndex][
        cellData.field
      ] = newVal;
      this.setState({ modPipelineReceipt });
    } catch (error) {
      console.log("Error in handleCellDataEdit", error)
    }
  };

  handleDateTextChange = (cellData, value, error) => {
    try {
      // var validationErrors = { ...this.state.validationErrors };
      var modPipelineReceipt = lodash.cloneDeep(this.state.modPipelineReceipt);
      // validationErrors[propertyName] = error;
      let index = modPipelineReceipt.PipelineReceiptTanks.findIndex((item) => {
        return item.sequenceNo === cellData.rowData.sequenceNo
      }
      )
      if (index >= 0) {
        if (value === "")
          modPipelineReceipt.PipelineReceiptTanks[index][cellData.field] = null;
        else
          modPipelineReceipt.PipelineReceiptTanks[index][cellData.field] = value;
        this.setState({ modPipelineReceipt });
      }
    } catch (error) {
      console.log(
        "Error in DateTextChange : Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleAddAssociation = () => {
    try {
      if (!this.props.userDetails.EntityResult.IsArchived) {
        try {
          let modPipelineReceipt = lodash.cloneDeep(
            this.state.modPipelineReceipt
          );
          let newComp = {
            PipelineReceiptCode: "",
            TankCode: null,
            PipelineTankMeterCode: null,
            Quantity: 0,
            QuantityUOM: "",
            PlannedStartTime: null,
            PlannedEndTime: null,
            // PlannedStartTime: modPipelineReceipt.ScheduledStartTime,
            // PlannedEndTime: modPipelineReceipt.ScheduledEndTime,
            sequenceNo: Utilities.getMaxSeqNumberfromListObject(modPipelineReceipt.PipelineReceiptTanks)
          };
          modPipelineReceipt.PipelineReceiptTanks.push(newComp);

          this.setState({
            modPipelineReceipt,
            selectedAssociations: [],
          });
        } catch (error) {
          console.log(
            "PipelineReceiptDetailsComposite:Error occured on handleAddAssociation",
            error
          );
        }
      }
    } catch (error) {
      console.log("PipelineReceiptDetailsComposite: Error occured on handleAddAssociation",
        error)
    }
  };

  handleDeleteAssociation = () => {
    try {
      if (!this.props.userDetails.EntityResult.IsArchived) {
        try {
          if (
            this.state.selectedAssociations != null &&
            this.state.selectedAssociations.length > 0
          ) {
            if (
              this.state.modPipelineReceipt.PipelineReceiptTanks.length > 0
            ) {
              let modPipelineReceipt = lodash.cloneDeep(
                this.state.modPipelineReceipt
              );

              this.state.selectedAssociations.forEach((obj, index) => {
                modPipelineReceipt.PipelineReceiptTanks =
                  modPipelineReceipt.PipelineReceiptTanks.filter(
                    (com, cindex) => {
                      return com.sequenceNo !== obj.sequenceNo;
                    }
                  );
              });

              this.setState({ modPipelineReceipt });
            }
          }

          this.setState({ selectedAssociations: [] });
        } catch (error) {
          console.log(
            "PipelineReceiptDetailsComposite:Error occured on handleDeleteAssociation",
            error
          );
        }
      }
    } catch (error) {
      console.log("error in handle Delete Association", error)
    }
  };
  handlePipelineHeaderChange = (data) => {
    try {
      const modPipelineReceipt = lodash.cloneDeep(
        this.state.modPipelineReceipt
      );
      modPipelineReceipt["PipelineHeaderCode"] = data;
      this.setState({ modPipelineReceipt });
      this.getPipelineMeter(data, modPipelineReceipt.TerminalCodes[0]);
    } catch (error) {
      console.log("PipelineReceiptDetailsComposite:Error occured on handlePipelineHeaderChange", error);
    }
  }
  handleTerminalChange = (data) => {
    try {
      const modPipelineReceipt = lodash.cloneDeep(
        this.state.modPipelineReceipt
      );
      if (data === null) {
        modPipelineReceipt["TerminalCodes"] = [];
      } else {
        modPipelineReceipt["TerminalCodes"][0] = data;
        modPipelineReceipt["PipelineHeaderCode"] = "";
        modPipelineReceipt["PipelineHeaderMeterCode"] = null;
        modPipelineReceipt["FinishedProductCode"] = "";
      }
      this.setState({ modPipelineReceipt, pipelineHeaderMeterOptions: [] }, () => {
        this.getTank(data);
        this.getHeaderLineCode(data);
        this.getSupplierOriginTerminals(this.props.selectedShareholder, modPipelineReceipt.SupplierCode, data);
        this.getFinishedProductCodes(this.props.selectedShareholder, data);
      });
    } catch (error) {
      console.log("PipelineReceiptDetailsComposite:Error occured on handleTerminalChange", error);
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
          let modPipelineReceipt = lodash.cloneDeep(this.state.modPipelineReceipt)
          let validationErrors = lodash.cloneDeep(this.state.validationErrors)
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null && result.EntityResult.AssociatedMeterCodes !== null && Array.isArray(result.EntityResult.AssociatedMeterCodes)) {
              pipelineHeaderMeterOptions = Utilities.transferListtoOptions(
                result.EntityResult.AssociatedMeterCodes
              );

              if (this.state.isMeterRequired &&
                result.EntityResult.AssociatedMeterCodes.length === 1 &&
                (modPipelineReceipt.PipelineHeaderCode !== "" &&
                  modPipelineReceipt.PipelineHeaderCode !== null &&
                  modPipelineReceipt.PipelineHeaderCode !== undefined)) {
                modPipelineReceipt.PipelineHeaderMeterCode
                  = result.EntityResult.AssociatedMeterCodes[0]
                validationErrors.PipelineHeaderMeterCode = "";
              }
            }
          }
          this.setState({ pipelineHeaderMeterOptions, validationErrors, modPipelineReceipt });
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
    } catch (error) {
      console.log("Error in getTankList:", error);
    }
  }
  handleTabChange = (activeIndex) => {
    try {
      this.setState({ activeTab: activeIndex, expandedRows: [] });
    } catch (error) {
      console.log(
        "RailreceiptDetailsComposite: Error occurred on handleTabChange",
        error
      );
    }
  };
  GetSnapShotsForPlan(selectedRow) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelinePlanCode,
          value: selectedRow.PipelineReceiptCode,
        },
        {
          key: KeyCodes.pipelinePlanType,
          value: Constants.PipeLineType.RECEIPT
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetSnapShotsForPlan,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let loadingDetails = response.data.EntityResult
          let pipelineSnapShotInfo = [];
          let remarks = lodash.cloneDeep(this.state.Remarks)
          if (loadingDetails !== undefined && loadingDetails !== null) {
            if (loadingDetails.Table !== null && loadingDetails.Table.length > 0) {
              loadingDetails.Table.forEach((item) => {
                item.RationPending = item.RationPending !== null ? item.RationPending.toString().toUpperCase() === "FALSE" ? "False" : "True" : item.RationPending;
                item.ActualEndTime = item.ActualEndTime !== null ?
                  new Date(item.ActualEndTime).toLocaleDateString() + " " + new Date(item.ActualEndTime).toLocaleTimeString() : item.ActualEndTime;
                item.ActualStartTime = item.ActualStartTime !== null ?
                  new Date(item.ActualStartTime).toLocaleDateString() + " " + new Date(item.ActualStartTime).toLocaleTimeString() : item.ActualStartTime;
                item.PlannedEndTime = new Date(item.PlannedEndTime).toLocaleDateString() + " " + new Date(item.PlannedEndTime).toLocaleTimeString();
                item.PlannedStartTime = new Date(item.PlannedStartTime).toLocaleDateString() + " " + new Date(item.PlannedStartTime).toLocaleTimeString();
                pipelineSnapShotInfo.push(item)
                remarks = item.Remarks
              })
            }
            if (loadingDetails.Table2 !== null && loadingDetails.Table2.length > 0) {
              loadingDetails.Table2.forEach((item) => {
                item.EndGrossVolume = item.EndGrossVolume === null ? "" : item.EndGrossVolume.toString() + " " + item.VolumeUOM
                item.EndNetVolume = item.EndNetVolume === null ? "" : item.EndNetVolume.toString() + " " + item.VolumeUOM
                item.StartGrossVolume = item.StartGrossVolume === null ? "" : item.StartGrossVolume.toString() + " " + item.VolumeUOM
                item.StartNetVolume = item.StartNetVolume === null ? "" : item.StartNetVolume.toString() + " " + item.VolumeUOM
                item.Density = item.Density === null || item.Density === 0 ? "0" : item.Density.toString() + " " + item.DensityUOM
                item.Temperature = item.Temperature === null || item.Temperature === 0 ? "0" : item.Temperature.toString() + " " + item.TemperatureUOM
              })
            }
            if (loadingDetails.Table1 !== null && loadingDetails.Table1.length > 0) {
              loadingDetails.Table1.forEach((item) => {
                item.Density = item.Density === null || item.Density === 0 ? "0" : item.Density.toString() + " " + item.DensityUOM
                item.Temperature = item.Temperature === null || item.Temperature === 0 ? "0" : item.Temperature.toString() + " " + item.TemperatureUOM
              })
            }
          }
          if (pipelineSnapShotInfo !== null && pipelineSnapShotInfo !== undefined && pipelineSnapShotInfo.length > 0)
            pipelineSnapShotInfo = Utilities.addSeqNumberToListObject(pipelineSnapShotInfo);
          this.setState({ loadingDetails, pipelineSnapShotInfo });
        })
        .catch((error) => {
          console.log("Error while getting receipt compartment details:", error);
        });
    } catch (error) {
      console.log("Error while getting receipt getsnapshot:", error);
    }
  }
  fillTransactionPlanDetails(modTransactiondetails) {
    try {
      console.log("modLoadingDetails", modTransactiondetails);
      let ViewTransactiondetails = [];
      if (Array.isArray(modTransactiondetails)) {
        modTransactiondetails.forEach((comp) => {
          comp.adjustedquantity = 0;
          ViewTransactiondetails.push({
            ReceivedGrossQuantity: comp.ReceivedGrossQuantity,
            ReceivedNetQuantity: comp.ReceivedNetQuantity,
            RationPending: comp.RationPending,
            PlannedQuantityUOM: comp.PlannedQuantityUOM,
            PlannedStartTime: new Date(comp.PlannedStartTime).toLocaleDateString() +
              " " +
              new Date(comp.PlannedStartTime).toLocaleTimeString(),
            PlannedEndTime: new Date(comp.PlannedEndTime).toLocaleDateString() +
              " " +
              new Date(comp.PlannedEndTime).toLocaleTimeString(),
            ActualStartTime: new Date(comp.ActualStartTime).toLocaleDateString() +
              " " +
              new Date(comp.ActualStartTime).toLocaleTimeString(),
          });
        })
      }
      ViewTransactiondetails =
        Utilities.addSeqNumberToListObject(ViewTransactiondetails);

      return ViewTransactiondetails;
    } catch (error) {
      console.log("Error in FillTransactionPlan Details", error)
    }
  }
  fillTankDetails(modViewTankdetails) {
    try {
      let ViewTankdetails = [];
      if (Array.isArray(modViewTankdetails)) {
        modViewTankdetails.forEach((comp) => {
          comp.adjustedquantity = 0;
          ViewTankdetails.push({
            TankCode: comp.TankCode,
            StartGrossVolume: comp.StartGrossVolume,
            EndGrossVolume: comp.EndGrossVolume,
            StartNetVolume: comp.StartNetVolume,
            EndNetVolume: comp.EndNetVolume,
            Density: comp.Density,
            Temperature: comp.Temperature
          });
        })
      }
      ViewTankdetails =
        Utilities.addSeqNumberToListObject(ViewTankdetails);

      return ViewTankdetails;
    } catch (error) {
      console.log("error in fillTankDetails", error)
    }
  }
  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };
  fillMeterDetails(modMeterDetails) {
    try {
      let ViewMeterdetails = [];
      if (Array.isArray(modMeterDetails)) {
        modMeterDetails.forEach((comp) => {
          comp.adjustedquantity = 0;
          ViewMeterdetails.push({
            MeterCode: comp.TankCode,
            StartGrossTotalizer: comp.StartGrossTotalizer,
            EndGrossTotalizer: comp.EndGrossTotalizer,
            StartNetTotalizer: comp.StartNetTotalizer,
            EndNetTotalizer: comp.EndNetTotalizer,
            Density: comp.Density,
            Temperature: comp.Temperature
          });
        })
      }
      ViewMeterdetails =
        Utilities.addSeqNumberToListObject(ViewMeterdetails);

      return ViewMeterdetails;
    } catch (error) {
      console.log("eror in fill Tank Details")
    }
  }
  onBack = () => {
    let dispatchUpdateStates = this.getDispatchUpdateStates();
    this.setState({
      isManualEntry: false,
      // isPlanned: true,
      saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineReceipt.PipelineReceiptStatus)
        && Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.modify,
          fnPipelineReceipt
        ),
      isViewAuditTrail: false,
      // isViewUnloading: false,
      drawerStatus: false,

    });
    this.getPipelineReceipt({ Common_Code: this.state.pipelineReceipt.PipelineReceiptCode });
  };
  getReciptStatuses(receiptRow) {
    try {
      axios(
        RestAPIs.GetPipelineReceiptAllStatuses +
        "?shareholderCode=" +
        this.props.selectedShareholder +
        "&pipelineReceiptCode=" +
        receiptRow.Common_Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          this.setState({
            currentReceiptStatus: result.EntityResult,
          });
        })
        .catch((error) => {
          console.log("Error while getting getReceiptStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  handleCloseReceipttModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.RemarksPopUp} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewPipelineDispatch_CloseHeader") +
                    " : " +
                    this.state.modPipelineReceipt.PipelineReceiptCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.Remarks}
                    // label={t("ViewReceipt_Reason")}
                    reserveSpace={false}
                    onChange={(value) => {
                      this.setState({ Remarks: value });
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
                  if (this.state.Remarks === "") {
                    let notification = {
                      messageType: "critical",
                      message: "ViewPipelineReceipt_ShipmentClose",
                      messageResultDetails: [
                        {
                          keyFields: ["ReceiptCode"],
                          keyValues: [this.state.modPipelineReceipt.PipelineReceiptCode],
                          isSuccess: false,
                          errorMessage: "Enter_Receipt_ReasonForCloseure",
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
                    this.setState({ RemarksPopUp: false }, () => {
                      if (this.state.isSubmit)
                        this.handleSubmit();
                      else
                        this.handleReceiptClose();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    RemarksPopUp: false,
                    Remarks: "",
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };
  handleReceiptClose() {
    try {
      let notification = {
        messageType: "critical",
        message: "ViewPipelineReceipt_ShipmentClose",
        messageResultDetails: [
          {
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.modPipelineReceipt.PipelineReceiptCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      var keyCode = [
        {
          key: KeyCodes.pipelineReceiptCode,
          value: this.state.modPipelineReceipt.PipelineReceiptCode,
        },
        {
          key: "Remarks",
          value: this.state.Remarks,
        },

      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineReceiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.ClosePipelineReceipt,
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
            this.getPipelineReceipt({ Common_Code: this.state.modPipelineReceipt.PipelineReceiptCode }, 0);
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: dispatchUpdateStates.indexOf(result.EntityResult.PipelineReceiptStatus)
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnPipelineReceipt
                )
            });
            console.log("Error in closing the dispatch:", result.ErrorList);
          }
          this.props.onSaved(this.state.pipelineReceipt, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineReceipt.PipelineReceiptStatus)
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineReceipt
              )
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.pipelineReceipt, "add", notification)
        });
    } catch (error) {
      console.log("Error while closing the receipt:", error);
    }
  }
  getDispatchUpdateStates() {
    var dispatchUpdateStates = [];
    try {
      let dispatchUpdateInfo = this.props.activityInfo.filter((item) => {
        return (
          item.ActivityCode ===
          Constants.ShipmentActivityInfo.PIPELINE_RECEIPT_ENABLE_UPDATE &&
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
  getReceiptOperations() {
    try {
      // const activityInfo = lodash.cloneDeep(this.state.activityInfo)
      const receipt = lodash.cloneDeep(this.state.pipelineReceipt);
      let shipmentNextOperations = [];
      if (receipt.PipelineReceiptStatus.toUpperCase() === Constants.PipelineDispatchStatuses.READY ||
        receipt.PipelineReceiptStatus.toUpperCase() === Constants.PipelineDispatchStatuses.PARTIALLY_COMPLETED) {
        shipmentNextOperations.push("Authorize_ManualEntry_Update")
        shipmentNextOperations.push("Authorize_Scada_Update")
      }
      if (receipt.PipelineReceiptStatus.toUpperCase() === Constants.PipelineDispatchStatuses.CLOSED) {
        shipmentNextOperations.push("PipelineDispatchList_btnTransactionReport")
        shipmentNextOperations.push("PipelineDispatchList_btnViewTransactionReport")
      }
      shipmentNextOperations.push("PipelineDispatch_BtnAuditTrail");
      if (receipt.PipelineReceiptStatus.toUpperCase() !== Constants.PipelineDispatchStatuses.CLOSED &&
        receipt.PipelineReceiptStatus.toUpperCase() !== Constants.PipelineDispatchStatuses.READY) {
        shipmentNextOperations.push("PipelineDispatch_BtnManualEntry");
        shipmentNextOperations.push("PipelineDispatch_BtnClosed");
        shipmentNextOperations.push("PipelineDispatch_BtnSubmit");
      }

      this.setState({ shipmentNextOperations })
    } catch (error) {
      console.log("Error in getting receipt Current Operations")
    }
  }
  UpdatePipelineReceiptRationedQuantities(pipelineSnapShotInfoList) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineReceiptCode,
          value: this.state.pipelineReceipt.PipelineReceiptCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineReceiptCode,
        KeyCodes: keyCode,
        Entity: pipelineSnapShotInfoList,
      };

      var notification = {
        messageType: "critical",
        message: "PipelineReceiptTransaction_SavedMessage",
        messageResultDetails: [
          {
            keyFields: ["PipelineReceiptDetails_ReceiptCode"],
            keyValues: [this.state.pipelineReceipt.PipelineReceiptCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdatePipelineReceiptRationedQuantities,
        Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {

          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;

          if (result.IsSuccess === true) {
            this.getPipelineReceipt({ Common_Code: this.state.pipelineReceipt.PipelineReceiptCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineReceipt.PipelineReceiptStatus)
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.add,
                  fnPipelineReceipt
                ),
            });
            console.log("Error in  Update rationed quantities:", result.ErrorList);
          }
          this.props.onSaved(this.state.pipelineReceipt, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates();
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineReceipt.PipelineReceiptStatus)
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnPipelineReceipt
              ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.pipelineReceipt, "add", notification);
        });
    } catch (error) {
      console.log("eror in UpdatePipelineReceiptRationedQuantities", error)
    }
  }
  MarkInvalidPipelineReceiptRecords(pipelineSnapShotInfoList) {
    try {
      var keyCode = [
        {
          key: KeyCodes.pipelineReceiptCode,
          value: this.state.pipelineReceipt.PipelineReceiptCode,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.pipelineReceiptCode,
        KeyCodes: keyCode,
        Entity: pipelineSnapShotInfoList,
      };

      var notification = {
        messageType: "critical",
        message: "PipelineReceiptTransaction_SavedMessage",
        messageResultDetails: [
          {
            keyFields: ["PipelineReceiptDetails_ReceiptCode"],
            keyValues: [this.state.pipelineReceipt.PipelineReceiptCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.MarkInvalidPipelineReceiptRecords,
        Utilities.getAuthenticationObjectforPost(obj, this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {

          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;

          if (result.IsSuccess === true) {
            this.getPipelineReceipt({ Common_Code: this.state.pipelineReceipt.PipelineReceiptCode });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            let dispatchUpdateStates = this.getDispatchUpdateStates();
            this.setState({
              saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineReceipt.PipelineReceiptStatus)
                && Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.add,
                  fnPipelineReceipt
                ),
            });
            console.log("Error in  Update rationed quantities:", result.ErrorList);
          }
          this.props.onSaved(this.state.pipelineReceipt, "add", notification);
        })
        .catch((error) => {
          let dispatchUpdateStates = this.getDispatchUpdateStates()
          this.setState({
            saveEnabled: dispatchUpdateStates.indexOf(this.state.pipelineReceipt.PipelineReceiptStatus)
              && Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnPipelineReceipt
              ),
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(this.state.pipelineReceipt, "add", notification);
        });
    } catch (error) {
      console.log("Error in MarkInvalidPipelineReceiptRecords", error)
    }

  }
  handleCellCheck = (data, cellData) => {
    try {
      let pipelineSnapShotInfo = lodash.cloneDeep(this.state.pipelineSnapShotInfo);

      const index = pipelineSnapShotInfo.findIndex((item) => {
        return item.SeqNumber === data.rowData.SeqNumber;
      });
      if (index > -1) {
        pipelineSnapShotInfo[index].IsInvalid = cellData;
      }

      this.setState({ pipelineSnapShotInfo });
    } catch (error) {
      console.log("Error in handleCellcheck", error)
    }
  };
  handleSubmit() {
    try {
      let pipelineSnapShotInfoList = []
      let rationPending = false;
      let pipelineSnapShotInfo = lodash.cloneDeep(this.state.pipelineSnapShotInfo)

      pipelineSnapShotInfo.forEach((item) => {
        let modPipelineSnapShotInfo = lodash.cloneDeep(emptyPipelineSnapshotInfo);

        modPipelineSnapShotInfo.Remarks = this.state.Remarks;

        if (this.state.pipelineReceipt.PipelineReceiptCode !== null &&
          this.state.pipelineReceipt.PipelineReceiptCode !== "")
          modPipelineSnapShotInfo.PlanCode = this.state.pipelineReceipt.PipelineReceiptCode
        else
          modPipelineSnapShotInfo.PlanCode = ""

        modPipelineSnapShotInfo.TransactionType = Constants.PipeLineType.RECEIPT;
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
          this.UpdatePipelineReceiptRationedQuantities(pipelineSnapShotInfoList);
        else
          this.MarkInvalidPipelineReceiptRecords(pipelineSnapShotInfoList);
      }

    }
    catch (error) {
      console.log("PipelineDispatchDetailsComposite : Error in forming Submit request", error)
    }
  }
  getRefrenceSource() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=PipelineReceipt",
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
            "PipelineDispatchComposite: Error occurred on getLookUpData",
            error
          );
        });
    }
    catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on geting RefrenceSourceLookUp Value",
        error
      );
    }
  }
  // getUoms() {
  //   try {
  //     axios(
  //       RestAPIs.GetUOMList,
  //       Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
  //     )
  //       .then((response) => {
  //         var result = response.data;
  //         if (result.IsSuccess === true) {
  //           if (
  //             result.EntityResult !== null &&
  //             Array.isArray(result.EntityResult.VOLUME)
  //           ) {
  //             this.setState({ UOMS: result.EntityResult });
  //           }
  //         } else {
  //           console.log("Error in GetUOMList:", result.ErrorList);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Error in GetUOMList:", error);
  //       });
  //   }
  //   catch (error) {
  //     console.log("Error in GetUOMList", error)
  //   }
  // }
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
  handleOperationClick = (operation) => {
    let modPipelineReceipt = lodash.cloneDeep(this.state.pipelineReceipt);
    let notification = {
      messageType: "critical",
      message: operation + "_status",
      messageResultDetails: [
        {
          keyFields: ["ReceiptDetail_ReceiptNumber"],
          keyValues: [modPipelineReceipt.PipelineReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    switch (operation) {
      case Constants.ViewAllPipelineDispatchOperations.Authorize_ManualEntry_Update:
        this.props.handleAuthorizeToManualEntry(
          modPipelineReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineReceipt({ Common_Code: modPipelineReceipt.PipelineReceiptCode },
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
      case Constants.ViewAllPipelineDispatchOperations.Authorize_Scada_Update:
        this.props.handleAuthorizeToUpdateScada(
          modPipelineReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineReceipt({ Common_Code: modPipelineReceipt.PipelineReceiptCode },
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

      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnManualEntry:
        this.setState({ isManualEntry: true })
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnSubmit:
        this.setState({ RemarksPopUp: true, isSubmit: true })
        // this.handleSubmit();
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnClosed:
        this.setState({ RemarksPopUp: true, isSubmit: false })
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnViewTransactionReport:
        this.props.handleViewTransaction();
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnTransactionReport:
        this.props.handlePrintTransaction(
          modPipelineReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineReceipt({ Common_Code: modPipelineReceipt.PipelineReceiptCode },
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

      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnAuditTrail:
        this.props.handleViewAuditTrail(
          modPipelineReceipt,
          this.props.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            ;
            if (result.IsSuccess === true) {
              let modAuditTrailList = result.EntityResult;
              let attributeMetaDataList = lodash.cloneDeep(
                this.state.viewAuditTrailAttributeMetaDataList
              );
              for (let i = 0; i < modAuditTrailList.length; i++) {

                let receiptStatus = modAuditTrailList[i].PipelineReceiptStatus.toUpperCase();
                if (receiptStatus === Constants.PipelineReceiptstatus.CLOSED) {
                  receiptStatus = Constants.PipelineReceiptStatus.CLOSED;
                } else if (
                  receiptStatus === Constants.PipelineReceiptstatus.AUTHORIZED
                ) {
                  receiptStatus = Constants.PipelineReceiptStatus.AUTHORIZED;
                } else if (receiptStatus === Constants.PipelineReceiptstatus.READY) {
                  receiptStatus = Constants.PipelineReceiptStatus.READY;
                } else if (
                  receiptStatus === Constants.PipelineReceiptstatus.INPROGRESS
                ) {
                  receiptStatus = Constants.PipelineReceiptStatus.INPROGRESS;
                } else if (
                  receiptStatus === Constants.PipelineReceiptstatus.MANUALLY_COMPLETED
                ) {
                  receiptStatus = Constants.PipelineReceiptStatus.MANUALLY_COMPLETED;
                }
                modAuditTrailList[i].PipelineReceiptstatus = receiptStatus;
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
              this.setState({
                auditTrailList: result.EntityResult,
                modAuditTrailList: modAuditTrailList,
                isViewAuditTrail: true,
              });
              this.getPipelineReceipt({ Common_Code: modPipelineReceipt.PipelineReceiptCode });
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
      default:
        return;
    }
  };
  //Get KPI for Pipeline Receipt
  getKPIList(shareholder, receiptCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: KpiPipelineReceiptDetail,
        TransportationType: Constants.TransportationType.PIPELINE,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "ReceiptCode", value: receiptCode }],
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
              pipelineReceiptKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ pipelineReceiptKPIList: [] });
            console.log("Error in truck Receipt KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting truck Receipt KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const dropdownOptions = {
      pipelineHeaderOptions: this.state.pipelineHeaderOptions,
      pipelineHeaderMeterOptions: this.state.pipelineHeaderMeterOptions,
      tankCodeOptions: this.state.tankOptions,
      terminalCodes: this.props.terminalCodes
    };

    const popUpContents = [
      {
        fieldName: "Receipt_LastUpdated",
        fieldValue:
          new Date(
            this.state.modPipelineReceipt.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modPipelineReceipt.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "Receipt_CreatedTime",
        fieldValue:
          new Date(
            this.state.modPipelineReceipt.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modPipelineReceipt.CreatedTime
          ).toLocaleTimeString(),
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
                    ? this.state.pipelineReceipt.PipelineReceiptCode +
                    " - " +
                    t("LoadingDetailsEntry_Title")
                    : this.state.pipelineReceipt.PipelineReceiptCode
                }
                newEntityName="Receipt_NewReceiptByCompartment"
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            </ErrorBoundary>
          )}
        </TranslationConsumer>
        {this.state.isViewAuditTrail ? (
          <ErrorBoundary>
            <PipelineReceiptViewAuditTrailDetails
              ReceiptCode={this.state.modPipelineReceipt.PipelineReceiptCode}
              // selectedRow={this.state.selectedRow}
              auditTrailList={this.state.auditTrailList}
              modAuditTrailList={this.state.modAuditTrailList}
              handleBack={this.onBack}
              Attributes={
                this.state.auditTrailList !== undefined &&
                  this.state.auditTrailList.length > 0
                  ? this.state.auditTrailList[0].AttributesforUI
                  : []
              }
            ></PipelineReceiptViewAuditTrailDetails>
          </ErrorBoundary>
        ) : this.state.isManualEntry ? (
          <div>
            <ErrorBoundary>
              <PipelineReceiptManualEntryDetailsComposite
                receipt={this.state.modPipelineReceipt}
                handleBack={this.onBack}
                selectedShareholder={this.props.selectedShareholder}
                UOMS={this.state.UOMS}
                listOptions={this.state.listOptions}
                isMeterRequired={this.state.isMeterRequired}
                isTankRequired={this.state.isTankRequired}
              ></PipelineReceiptManualEntryDetailsComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <div>
            <TMDetailsKPILayout KPIList={this.state.pipelineReceiptKPIList}> </TMDetailsKPILayout>
            <div
              className={
                this.state.pipelineReceipt.PipelineReceiptCode !== ""
                  ? !this.state.drawerStatus
                    ? "showShipmentStatusRightPane"
                    : "drawerClose"
                  : ""
              }
            >
              <ErrorBoundary>
                <PipelineReceiptDetails
                  pipelineReceipt={this.state.pipelineReceipt}
                  modPipelineReceipt={this.state.modPipelineReceipt}
                  validationErrors={this.state.validationErrors}
                  selectedAssociations={this.state.selectedAssociations}
                  listOptions={this.state.listOptions}
                  dropdownOptions={dropdownOptions}
                  onFieldChange={this.handleChange}
                  handleAssociationSelectionChange={
                    this.handleAssociationSelectionChange
                  }
                  handleCellDataEdit={this.handleCellDataEdit}
                  handleAddAssociation={this.handleAddAssociation}
                  handleDeleteAssociation={this.handleDeleteAssociation}
                  handlePipelineHeaderChange={this.handlePipelineHeaderChange}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  handleTerminalChange={this.handleTerminalChange}
                  modAttributeMetaDataList={this.state.modAttributeMetaDataList}
                  attributeValidationErrors={
                    this.state.attributeValidationErrors
                  }
                  onAttributeDataChange={this.handleAttributeDataChange}
                  activeTab={this.state.activeTab}
                  onTabChange={this.handleTabChange}
                  loadingDetails={this.state.loadingDetails}
                  handleCellCheck={this.handleCellCheck}
                  pipelineSnapShotInfo={this.state.pipelineSnapShotInfo}
                  isMeterRequired={this.state.isMeterRequired}
                  isTankRequired={this.state.isTankRequired}
                  loadingDetailsTab={this.state.pipelineReceipt.PipelineReceiptCode !== "" ? [""] : []}
                  onDateTextChange={this.handleDateTextChange}
                ></PipelineReceiptDetails>
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
              this.state.pipelineReceipt.PipelineReceiptCode  === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnPipelineReceipt}
            handleOperation={this.addUpdatePipelineReceipt}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
            </div>

            <div>
              {this.state.pipelineReceipt.PipelineReceiptCode !== "" ? (
                <div
                  className={
                    this.state.drawerStatus ? "marineStatusLeftPane" : ""
                  }
                >
                  <TranslationConsumer>
                    {(t) => (
                      <TransactionSummaryOperations
                        selectedItem={[
                          { Common_Code: this.state.modPipelineReceipt.PipelineReceiptCode },
                        ]}
                        shipmentNextOperations={this.state.shipmentNextOperations}
                        handleOperationButtonClick={this.handleOperationClick}
                        currentStatuses={this.state.currentReceiptStatus}
                        handleDrawer={this.handleDrawer}
                        isDetails={true}
                        isEnterpriseNode={
                          this.props.userDetails.EntityResult.IsEnterpriseNode
                        }
                        webPortalAllowedOperations={[
                          "PipelineDispatchList_btnViewTransactionReport",
                          "PipelineDispatch_BtnAuditTrail"
                        ]}
                        isWebPortalUser={
                          this.props.userDetails.EntityResult.IsWebPortalUser
                        }
                        unAllowedOperations={[
                          "Authorize_ManualEntry_Update",
                          "Authorize_Scada_Update",
                          "PipelineDispatch_BtnManualEntry",
                          "PipelineDispatch_BtnClosed",
                          "PipelineDispatch_BtnSubmit"
                        ]}
                      />
                    )}
                  </TranslationConsumer>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
        {this.state.RemarksPopUp ? this.handleCloseReceipttModal() : null}
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

const mapReceiptToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapReceiptToProps
)(PipelineReceiptDetailsComposite);

PipelineReceiptDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
