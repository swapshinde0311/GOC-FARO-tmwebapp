import React, { Component } from "react";
import axios from "axios";
import lodash from "lodash";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import "react-toastify/dist/ReactToastify.css";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import "../../../CSS/styles.css";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as RestApis from "../../../JS/RestApis";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnRailReceipt, fnKPIInformation } from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { railReceiptValidationDef } from "../../../JS/ValidationDef";
import { emptyRailReceipt } from "../../../JS/DefaultEntities";
import { RailReceiptDetails } from "../../UIBase/Details/RailReceiptDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import "bootstrap/dist/css/bootstrap-grid.css";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { railReceiptCompartDef } from "../../../JS/DetailsTableValidationDef";
import {
  railReceiptAttributeEntity,
  railReceiptComAttributeEntity,
} from "../../../JS/AttributeEntity";
import { getKeyByValue } from "../../../JS/Utilities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiRailReceiptDetails } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RailReceiptDetailsComposite extends Component {
  state = {
    isWagonDetail: "false",
    modRailReceiptCompartmentPlanList: [],
    railReceipt: lodash.cloneDeep(emptyRailReceipt),
    modRailReceipt: {},
    modAssociations: [],
    weightBridgeData: [],
    modWeightBridgeData: [],
    validationErrors: Utilities.getInitialValidationErrors(
      railReceiptValidationDef
    ),
    selectedCompRow: [],
    isDetail: "false",
    selectedShareholder: "",
    selectedRow: {},
    selectedItems: [],
    shareholders: this.getShareholders(),
    quantityUOMOptions: [],
    carrierCompanyOptions: [],
    railWagonOptions: {},
    finishedProductOptions: {},
    supplierDestinationOptions: [],
    ViewUnloadingData: [],
    saveEnabled: false,
    isViewAuditTrail: "false",
    tabActiveIndex: 0,
    operationsVisibilty: {
      add: false,
      save: false,
      authorizeToLoad: false,
      closeReceipt: false,
      viewAuditTrail: false,
      viewUnloadingDetails: false,
      printRAN: false,
      viewBOD: false,
      printBOD: false,
      bSIOutbound: false,
      manualEntry: false,
      adjustPlan: false,
      forceComplete: false,
    },
    attribute: [],
    attributeMetaDataList: [],
    compartmentAttributeMetaDataList: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],
    expandedRows: [],
    expandedCompDetailRows: [],
    additiveDetails: [],
    saveCompartmentEnable: false,
    isTransloading: false,
    railReceiptKPIList: [],
    maxNumberOfCompartments: 60,
    showAuthenticationLayout: false,
    tempRailReceipt: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
      this.getUoms();
      this.getCarrierCompanyCodes();
      this.getFinishedProductCodes();
      this.getSupplierOriginTerminals();
      //this.getForceCompletenPermission(this.props.selectedRow);
      //this.GetReceiptStatusOperations(this.props.selectedRow);
      this.getTransloading();
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getTransloading() {
    try {
       axios(
      RestApis.GetLookUpData + "?LookUpTypeCode=Transloading",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let isTransloading = false;
          if (result.EntityResult.RAILEnable === "True") {
            isTransloading = true;
          }
          this.setState({ isTransloading });
        } else {
          console.log("Error in getLookUpData: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "MarineReceiptDetailsComposite: Error occurred on getLookUpData",
          error
        );
      });
       axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=VirtualPreset",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (!isNaN(parseInt(result.EntityResult["RailMaximumNumberOfWagonsPerTrain "]))) {
            this.setState({maxNumberOfCompartments:parseInt(result.EntityResult["RailMaximumNumberOfWagonsPerTrain "])})
          }
        }
      });
    } catch (error) {
      console.log("RailReceiptDetailsComposite: Error occurred on getTransloading",error);
    }
   
  }

  operationPermissionControl = (receiptOperations) => {
    var { operationsVisibilty } = { ...this.state };
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_AuthorizeToUnload
      ) > -1
    ) {
      operationsVisibilty.authorizeToLoad = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_RecordWeight
      ) > -1
    ) {
      operationsVisibilty.recordWeight = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_CloseReceipt
      ) > -1
    ) {
      operationsVisibilty.closeReceipt = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_ViewAuditTrail
      ) > -1
    ) {
      operationsVisibilty.viewAuditTrail = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations
          .ViewRailReceipt_ViewLoadingDetails
      ) > -1
    ) {
      operationsVisibilty.viewUnloadingDetails = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_PrintRAN
      ) > -1
    ) {
      operationsVisibilty.printRAN = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_ViewBOD
      ) > -1
    ) {
      operationsVisibilty.viewBOD = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_PrintBOD
      ) > -1
    ) {
      operationsVisibilty.printBOD = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_BISOutbound
      ) > -1
    ) {
      operationsVisibilty.bSIOutbound = true;
    }
    if (
      receiptOperations.indexOf(
        Constants.ViewAllRailReceiptOperations.ViewRailReceipt_ManualEntry
      ) > -1
    ) {
      operationsVisibilty.manualEntry = true;
    }
    this.setState({ operationsVisibilty });
  };

  handleChange = (propertyName, data) => {
    try {
      const modRailReceipt = lodash.cloneDeep(this.state.modRailReceipt);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      modRailReceipt[propertyName] = data;
      if (propertyName === "Active") {
        if (data !== this.state.railReceipt.Active) {
          modRailReceipt.Remarks = "";
        }
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
      this.setState({ modRailReceipt });
      if (railReceiptValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          railReceiptValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }
  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const railReceipt = lodash.cloneDeep(this.state.railReceipt);
      //var transportationType = this.getTransportationType();

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modRailReceipt: { ...railReceipt },
          modAssociations: this.getAssociationsFromReceipt(railReceipt),
          validationErrors,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange([]);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  fillDetails() {
    try {
      let modRailReceipt = lodash.cloneDeep(this.state.modRailReceipt);
      let i = 0;
      modRailReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
        (compart) => {
          if (compart.Quantity !== null || compart.Quantity !== "") {
            modRailReceipt.RailMarineReceiptCompartmentPlanList[
              i
            ].PlannedQuantity = compart.Quantity.toLocaleString();
          }
        }
      );
      //attributeList = Utilities.attributesConverttoLocaleString(attributeList);
      this.setState({ modRailReceipt });
      return modRailReceipt;
    } catch (error) {
      console.log(
        "RailReceiptRecordWeightDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }


  
    saveRailReceipt = () => {
      this.handleAuthenticationClose();
      try {
        this.setState({ saveEnabled: false });
        let tempRailReceipt = lodash.cloneDeep(this.state.tempRailReceipt);
  
        this.state.railReceipt.ReceiptCode === ""
        ? this.createRailReceipt(tempRailReceipt)
        : this.updateRailReceipt(tempRailReceipt);
      } catch (error) {
        console.log("RailShipComposite : Error in addUpdateRailDispatch");
      }
    };
   


  handleSave = () => {
    try {
      
      let modRailReceipt = lodash.cloneDeep(this.state.modRailReceipt);
      if (this.state.tabActiveIndex === 0) {
        modRailReceipt.RailMarineReceiptCompartmentDetailPlanList =
          this.getCompartmentsFromAssociations(this.state.modAssociations);
        let attributeList = Utilities.attributesConverttoLocaleString(
          this.state.selectedAttributeList
        );
        if (this.validateSave(modRailReceipt, attributeList)) {
          modRailReceipt = this.fillAttributeDetails(
            modRailReceipt,
            attributeList
          );
          for (let i in modRailReceipt.RailMarineReceiptCompartmentDetailPlanList) {
            modRailReceipt.RailMarineReceiptCompartmentDetailPlanList[
              i
            ].Quantity = Utilities.convertStringtoDecimal(
              modRailReceipt.RailMarineReceiptCompartmentDetailPlanList[i]
                .Quantity
            );
          }
           
          let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempRailReceipt = lodash.cloneDeep(modRailReceipt);
        this.setState({ showAuthenticationLayout, tempRailReceipt }, () => {
          if (showAuthenticationLayout === false) {
            this.saveRailReceipt();
          }
      });
        } else {
          this.setState({ saveEnabled: true });
        }
      } else {
        let modRailReceiptCompartmentPlanList = lodash.cloneDeep(
          this.state.modRailReceiptCompartmentPlanList
        );
        var { operationsVisibilty } = { ...this.state };
        operationsVisibilty.save = false;
        this.setState({ operationsVisibilty });
        var CompartmentDatas = [];
        for (var i = 0; i < modRailReceiptCompartmentPlanList.length; i++) {
          var railReceiptCode =
            modRailReceiptCompartmentPlanList[i]["ReceiptCode"];
          var ForceComplete =
            modRailReceiptCompartmentPlanList[i]["ForceComplete"];
          var shCode = this.props.selectedShareholder;
          // var  SequenceNo=modRailReceiptCompartmentPlanList[i]["SequenceNo"];

          if (ForceComplete !== false) {
            var compartmentRow = {
              ForceCompleted:
                modRailReceiptCompartmentPlanList[i]["ForceComplete"],
              CarrierCompanyCode:
                modRailReceiptCompartmentPlanList[i]["CarrierCompanyCode"],
              TrailerCode: modRailReceiptCompartmentPlanList[i]["TrailerCode"],
            };

            CompartmentDatas.push(compartmentRow);
          }
        }
        var KeyData = {
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: "ReceiptCode", Value: railReceiptCode }],
          Entity: CompartmentDatas,
        };
        var notification = {
          messageType: "critical",
          message: "Receipt_SavedStatus",
          messageResultDetails: [
            {
              keyFields: ["Marine_ReceiptCompDetail_ShipmentNumber"],
              keyValues: [this.props.selectedRow.Common_Code],
              isSuccess: false,
              errorMessage: "",
            },
          ],
        };
        axios(
          RestApis.UpdateRailReceiptCompartInfo,
          Utilities.getAuthenticationObjectforPost(
            KeyData,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            var result = response.data;
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              operationsVisibilty.save = true;
              this.getRailReceipt(this.props.selectedRow);

              for (
                var i = 0;
                i < modRailReceiptCompartmentPlanList.length;
                i++
              ) {
                if (
                  modRailReceiptCompartmentPlanList[i]["AdjustPlan"] !== null
                ) {
                  modRailReceiptCompartmentPlanList[i]["AdjustPlan"] = null;
                }
              }
              this.setState({
                operationsVisibilty,
                modRailReceiptCompartmentPlanList,
              });
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              operationsVisibilty.save = false;
              this.setState({
                operationsVisibilty,
              });
              console.log(
                "Error in Save Compartment Details:",
                result.ErrorList
              );
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
          })
          .catch((error) => {
            throw error;
          });
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        let newComp = {
          AssociatedContractItems: null,
          AssociatedOrderItems: null,
          Attributes: [],
          CarrierCompanyCode: "",
          CompartmentCode: "1",
          CompartmentSeqNoInVehicle: null,
          FinishedProductCode: "",
          OriginTerminalCode: "",
          Quantity: 0,
          QuantityUOM: "",
          ReceiptCode: "",
          SequenceNo: 0,
          ShareholderCode: "",
          SupplierCode: "",
          TrailerCode: "",
        };
        let modAssociations = lodash.cloneDeep(this.state.modAssociations);
        newComp.ShareholderCode = this.props.selectedShareholder;
        newComp.SequenceNo = modAssociations.length + 1;
        modAssociations.push(newComp);
        let modRailReceipt = lodash.cloneDeep(this.state.modRailReceipt);
        this.setState(
          {
            modAssociations,
            selectedCompRow: [],
          },
          () => {
            if (
              this.props.userDetails.EntityResult.IsEnterpriseNode === false
            ) {
              var attributeMetaDataList = lodash.cloneDeep(
                this.state.compartmentAttributeMetaDataList
              );
              if (attributeMetaDataList.length > 0)
                this.formCompartmentAttributes([
                  attributeMetaDataList[0].TerminalCode,
                ]);
            } else this.formCompartmentAttributes(modRailReceipt.TerminalCodes);
          }
        );
      } catch (error) {
        console.log(
          "RailReceiptDetailsComposite:Error occured on handleAddAssociation",
          error
        );
      }
    }
  };
  handleDeleteAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedCompRow != null &&
          this.state.selectedCompRow.length > 0
        ) {
          if (this.state.modAssociations.length > 0) {
            let modAssociations = lodash.cloneDeep(this.state.modAssociations);

            this.state.selectedCompRow.forEach((obj, index) => {
              modAssociations = modAssociations.filter((com, cindex) => {
                return com.SequenceNo !== obj.SequenceNo;
              });
            });

            for (let i = 0; i < modAssociations.length; i++) {
              modAssociations[i].SequenceNo = i + 1;
            }

            this.setState({ modAssociations });
          }
        }

        this.setState({ selectedCompRow: [] });
      } catch (error) {
        console.log(
          "RailReceiptDetailsComposite:Error occured on handleDeleteAssociation",
          error
        );
      }
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var { validationErrors } = { ...this.state.validationErrors };
      var modRailReceipt = lodash.cloneDeep(this.state.modRailReceipt);
      validationErrors[propertyName] = error;
      modRailReceipt[propertyName] = value;
      this.setState({ validationErrors, modRailReceipt });
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };
  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    let modRailReceiptCompartmentPlanList = lodash.cloneDeep(
      this.state.modRailReceiptCompartmentPlanList
    );
    modAssociations[cellData.rowIndex][cellData.field] = newVal;

    if (cellData.field === "CarrierCompanyCode") {
      let carrierCompanyCodeOptions = this.state.carrierCompanyOptions;
      if (
        carrierCompanyCodeOptions !== undefined &&
        carrierCompanyCodeOptions !== null
      ) {
        if (
          this.state.railWagonOptions[newVal] !== undefined &&
          Array.isArray(this.state.railWagonOptions[newVal]) &&
          this.state.railWagonOptions[newVal].length === 1
        ) {
          modAssociations[cellData.rowIndex]["TrailerCode"] =
            this.state.railWagonOptions[newVal][0];
        } else {
          modAssociations[cellData.rowIndex]["TrailerCode"] = "";
        }
      }
    } else if (cellData.field === "SupplierCode") {
      let supplierDestinationOptions = lodash.cloneDeep(
        this.state.supplierDestinationOptions
      );
      if (
        supplierDestinationOptions[
        modAssociations[cellData.rowIndex]["ShareholderCode"]
        ] !== undefined &&
        supplierDestinationOptions[
        modAssociations[cellData.rowIndex]["ShareholderCode"]
        ] !== null
      ) {
        let supplierDestinationList =
          supplierDestinationOptions[
          modAssociations[cellData.rowIndex]["ShareholderCode"]
          ];
        if (
          supplierDestinationList[newVal] !== undefined &&
          Array.isArray(supplierDestinationList[newVal]) &&
          supplierDestinationList[newVal].length === 1
        ) {
          modAssociations[cellData.rowIndex]["OriginTerminalCode"] =
            supplierDestinationList[newVal][0];
        } else {
          modAssociations[cellData.rowIndex]["OriginTerminalCode"] = "";
        }
      }
    } else if (cellData.field === "ForceComplete") {
      let rowIndex = modRailReceiptCompartmentPlanList.findIndex(
        (item) => item.SequenceNo === cellData.rowData.SequenceNo
      );
      modRailReceiptCompartmentPlanList[rowIndex][cellData.field] =
        !modRailReceiptCompartmentPlanList[rowIndex][cellData.field];
    } else if (cellData.field === "IsTransloading") {
      modAssociations[cellData.rowIndex][cellData.field] =
        !cellData.rowData.IsTransloading;
    }

    this.setState({ modAssociations, modRailReceiptCompartmentPlanList });
  };
  handleAssociationSelectionChange = (e) => {
    this.setState({ selectedCompRow: e });
  };
  componentWillReceiveProps(nextProps) {
    try {
      if (
        (this.state.railReceipt.ReceiptCode !== "" &&
          nextProps.selectedRow.Common_Code === undefined &&
          this.props.tokenDetails.tokenInfo ===
          nextProps.tokenDetails.tokenInfo) ||
        (nextProps.selectedRow.ReceiptStatus !==
          this.props.selectedRow.ReceiptStatus &&
          this.props.selectedRow.ReceiptStatus !== undefined)
      ) {
        this.getRailReceipt(nextProps.selectedRow);
      }
      let validationErrors = { ...this.state.validationErrors };
      Object.keys(validationErrors).forEach((key) => {
        validationErrors[key] = "";
      });
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "MarineDispatchDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  validateSave(modRailReceipt, attributeList) {
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);

    Object.keys(railReceiptValidationDef).forEach(function (key) {
      if (modRailReceipt[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          railReceiptValidationDef[key],
          modRailReceipt[key]
        );
      }
    });

    if (modRailReceipt.Active !== this.state.railReceipt.Active) {
      if (modRailReceipt.Remarks === null || modRailReceipt.Remarks === "") {
        validationErrors["Remarks"] = "Rail_Receipt_RemarksRequired";
      } else {
        delete validationErrors["Remarks"];
      }
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

    let notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [],
    };

    if (
      Array.isArray(
        modRailReceipt.RailMarineReceiptCompartmentDetailPlanList
      ) &&
      modRailReceipt.RailMarineReceiptCompartmentDetailPlanList.length > 0
    ) {
      if (modRailReceipt.RailMarineReceiptCompartmentDetailPlanList.length <= this.state.maxNumberOfCompartments) {
         modRailReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
        (compart) => {
          railReceiptCompartDef.forEach((col) => {
            let err = "";

            if (
              col.field === "Quantity" &&
              this.props.railLookUpData.PlanType === "2"
            )
              return;
            if (col.validator !== undefined) {
              err = Utilities.validateField(col.validator, compart[col.field]);
            }
            if (err !== "") {
              notification.messageResultDetails.push({
                keyFields: [
                  "RailReceiptManualEntry_ReceiptCode",
                  col.displayName,
                ],
                keyValues: [modRailReceipt.ReceiptCode, compart[col.field]],
                isSuccess: false,
                errorMessage: err,
              });
            }
          });
          let updatedAttributes = [];
          if (
            compart.AttributesforUI !== null &&
            compart.AttributesforUI !== undefined
          )
            updatedAttributes = compart.AttributesforUI.filter(function (
              uIAttributes
            ) {
              return compart.Attributes.some(function (selAttribute) {
                let isPresent =
                  selAttribute.ListOfAttributeData.findIndex(
                    (item) => item.AttributeCode === uIAttributes.AttributeCode
                  ) >= 0
                    ? true
                    : false;
                return (
                  uIAttributes.TerminalCode === selAttribute.TerminalCode &&
                  isPresent
                );
              });
            });

          updatedAttributes.forEach((item) => {
            let errMsg = Utilities.valiateAttributeField(
              item,
              item.AttributeValue
            );
            if (errMsg !== "") {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                notification.messageResultDetails.push({
                  keyFields: [
                    "CompAttributeComp",
                    "CompAttributeTerminal",
                    item.AttributeName,
                  ],
                  keyValues: [
                    compart.Code,
                    item.TerminalCode,
                    item.AttributeValue,
                  ],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              } else {
                notification.messageResultDetails.push({
                  keyFields: ["CompAttributeComp", item.AttributeName],
                  keyValues: [compart.Code, item.AttributeValue],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              }
            }
          });
          this.toggleExpand(compart, true, true);
        }
      );
      }
      else {
        notification.messageResultDetails.push({
        keyFields: ["RailReceiptManualEntry_ReceiptCode"],
        keyValues: [modRailReceipt.ReceiptCode],
        isSuccess: false,
        errorMessage: "Wagon_limit_Exceeded",
      });
      }
    } else {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_RAILRECEIPT_COMP_PLAN_LIST_EMPTY",
      });
    }

    this.setState({ validationErrors });
    var returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modRailReceipt, "update", notification);
      return false;
    }
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
    return returnValue;
  }
  createRailReceipt(modRailReceipt) {
    var keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: modRailReceipt.ReceiptCode,
      },
    ];
    modRailReceipt.RailMarineReceiptCompartmentPlanList = [];
    modRailReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
      (compart) => {
        modRailReceipt.RailMarineReceiptCompartmentPlanList.push({
          ShareHolderCode: compart.ShareholderCode,
          FinishedProductCode: compart.FinishedProductCode,
          CompartmentCode: compart.CompartmentCode,
          TrailerCode: compart.TrailerCode,
          PlannedQuantity: compart.Quantity,
          PlanQuantityUOM: compart.QuantityUOM,
          CompartmentSeqNoInVehicle: null,
          Attributes: [],
          AssociatedContractItems: null,
          ReceiptCompartmentTanks: null,
        });
      }
    );
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: keyCode,
      Entity: modRailReceipt,
    };
    var notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailReceiptManualEntry_ReceiptCode"],
          keyValues: [modRailReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateRailReceipt,
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
          this.getRailReceipt({ Common_Code: modRailReceipt.ReceiptCode });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
          console.log("Error in CreateRailReceipt:", result.ErrorList);
        }
        this.props.onUpdateStatusOperation(modRailReceipt);
        this.props.onSaved(modRailReceipt, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailReceipt, "add", notification);
      });
  }
  updateRailReceipt(modRailReceipt) {
    var keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: this.state.modRailReceipt.ReceiptCode,
      },
    ];
    let i = 0;
    modRailReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
      (compart) => {
        modRailReceipt.RailMarineReceiptCompartmentPlanList[i].ShareholderCode =
          compart.ShareholderCode;
        modRailReceipt.RailMarineReceiptCompartmentPlanList[
          i
        ].FinishedProductCode = compart.FinishedProductCode;
        modRailReceipt.RailMarineReceiptCompartmentPlanList[i].CompartmentCode =
          compart.CompartmentCode;
        modRailReceipt.RailMarineReceiptCompartmentPlanList[i].TrailerCode =
          compart.TrailerCode;
        modRailReceipt.RailMarineReceiptCompartmentPlanList[i].PlannedQuantity =
          compart.Quantity;
        modRailReceipt.RailMarineReceiptCompartmentPlanList[i].PlanQuantityUOM =
          compart.QuantityUOM;
        modRailReceipt.RailMarineReceiptCompartmentPlanList[i].Attributes =
          compart.Attributes;
      }
    );
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: keyCode,
      Entity: modRailReceipt,
    };
    var notification = {
      messageType: "critical",
      message: "Receipt_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailReceiptManualEntry_ReceiptCode"],
          keyValues: [modRailReceipt.ReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateRailReceipt,
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
          this.getRailReceipt({ Common_Code: modRailReceipt.ReceiptCode });
        } else {
          this.setState({
            saveEnabled: true,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
        }
        this.props.onSaved(modRailReceipt, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailReceipt, "modify", notification);
        this.setState({
          saveEnabled: true,
        });
      });
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

  handleAllTerminalsChange = (checked) => {
    try {
      var modRailReceipt = lodash.cloneDeep(this.state.modRailReceipt);
      if (checked) modRailReceipt.TerminalCodes = [...this.props.terminalCodes];
      else modRailReceipt.TerminalCodes = [];
      this.terminalSelectionChange(modRailReceipt.TerminalCodes);
      this.setState({ modRailReceipt });
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  getUoms() {
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
            var quantityUOMOptions = lodash.cloneDeep(
              this.state.quantityUOMOptions
            );
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
            this.setState({ quantityUOMOptions });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in GetUOMList:", error);
      });
  }

  getCarrierCompanyCodes() {
    axios(
      RestAPIs.GetCarrierCodes +
      "?ShareholderCode=" +
      "&Transportationtype=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let carrierCompanyOptions = lodash.cloneDeep(
              this.state.carrierCompanyOptions
            );
            result.EntityResult.forEach((carrier) => {
              carrierCompanyOptions.push({
                text: carrier,
                value: carrier,
              });
            });
            this.setState({ carrierCompanyOptions });
            this.getTrailerCodes(result.EntityResult);
          }
        } else {
          console.log("Error in GetCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getTrailerCodes(carrierCompanyCodeList) {
    carrierCompanyCodeList.forEach((carrierCompanyCode) =>
      axios(
        RestAPIs.GetRailWagonCodes +
        "?CarrierCompanyCode=" +
        carrierCompanyCode +
        "&Transportationtype=" +
        Constants.TransportationType.RAIL,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult.RailWagonList)
            ) {
              let railWagonOptions = lodash.cloneDeep(
                this.state.railWagonOptions
              );
              railWagonOptions[carrierCompanyCode] =
                result.EntityResult.RailWagonList;
              this.setState({ railWagonOptions });
            }
          } else {
            console.log("Error in GetCarrierListForRole:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Carrier List:", error);
        })
    );
  }

  getFinishedProductCodes() {
    axios(
      RestAPIs.GetFinishedProductListForShareholder +
      "?ShareholderCode=" +
      "&Transportationtype=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let finishedProductOptions = result.EntityResult;
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

  getSupplierOriginTerminals() {
    axios(
      RestAPIs.GetSupplierOriginTerminals +
      "?ShareholderCode=" +
      "&Transportationtype=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let supplierDestinationOptions = {};
            result.EntityResult.forEach((entity) => {
              supplierDestinationOptions[entity.ShareholderCode] =
                entity.SupplierOriginTerminalsList;
            });
            this.setState({ supplierDestinationOptions });
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
  }

  getRailReceipt(selectedRow) {
    var transportationType = this.getTransportationType();
    emptyRailReceipt.TransportationType = transportationType;

    emptyRailReceipt.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.RAIL;

    if (selectedRow.Common_Code === undefined) {
      this.handleResetAttributeValidationError();
      this.setState(
        {
          railReceipt: { ...emptyRailReceipt },
          modRailReceipt: { ...emptyRailReceipt },
          modAssociations: [],
          modRailReceiptCompartmentPlanList: [],
          selectedAttributeList: [],
          isDetail: "true",
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRailReceipt
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange([]);
          } else {
            this.localNodeAttribute();
          }
        }
      );
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
          this.props.onUpdateStatusOperation(result.EntityResult);
          if (result.EntityResult.ReceiptStatus === "READY") {
            this.setState(
              {
                isDetail: "true",
                railReceipt: lodash.cloneDeep(result.EntityResult),
                modRailReceipt: lodash.cloneDeep(result.EntityResult),
                modAssociations: this.getAssociationsFromReceipt(
                  result.EntityResult
                ),
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnRailReceipt
                ),
              },
              () => {
                this.getKPIList(result.EntityResult.ReceiptCode)
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  this.terminalSelectionChange(
                    this.state.modRailReceipt.TerminalCodes
                  );
                } else {
                  this.localNodeAttribute();
                }
              }
            );
          } else {
            this.setState(
              {
                isDetail: "true",
                railReceipt: lodash.cloneDeep(result.EntityResult),
                modRailReceipt: lodash.cloneDeep(result.EntityResult),
                modAssociations: this.getAssociationsFromReceipt(
                  result.EntityResult
                ),
                saveEnabled: this.props.currentAccess.ViewRailReceipt_Update,
              },
              () => {
                this.getKPIList(result.EntityResult.ReceiptCode)
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  this.terminalSelectionChange([
                    result.EntityResult.TerminalCode,
                  ]);
                } else {
                  this.localNodeAttribute();
                }
              }
            );
          }
          this.getRailReceiptWeighBridgeData(result.EntityResult);
        } else {
          this.setState({
            railReceipt: lodash.cloneDeep(emptyRailReceipt),
            modRailReceipt: lodash.cloneDeep(emptyRailReceipt),
            isDetail: "true",
          });
          console.log("Error in GetRailReceipt:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railReceipt:", error);
      });
  }

  getWagonHseInspectionStatus(ReceiptCode) {
    axios(
      RestAPIs.GetWagonHseInspectionStatus +
      "?TransactionType=Receipt" +
      "&DispatchReceiptCode=" +
      ReceiptCode +
      "&ShareholderCode=" +
      this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (
          result.IsSuccess === true &&
          result.EntityResult !== null &&
          Array.isArray(result.EntityResult.Table)
        ) {
          const modRailReceiptCompartmentPlanList = lodash.cloneDeep(
            this.state.modRailReceiptCompartmentPlanList
          );
          for (let item of result.EntityResult.Table) {
            for (let railReceiptCompartmentdata of modRailReceiptCompartmentPlanList) {
              if (railReceiptCompartmentdata.TrailerCode === item.Code) {
                if (
                  item.HseInspectionStatus ===
                  Constants.HSEInspectionStatus.NOT_DONE
                )
                  railReceiptCompartmentdata.HSEInspectionStatus = "NOT_DONE";
                if (
                  item.HseInspectionStatus ===
                  Constants.HSEInspectionStatus.PASS
                )
                  railReceiptCompartmentdata.HSEInspectionStatus = "PASS";
                if (
                  item.HseInspectionStatus ===
                  Constants.HSEInspectionStatus.FAIL
                )
                  railReceiptCompartmentdata.HSEInspectionStatus = "FAIL";
                if (
                  item.HseInspectionStatus ===
                  Constants.HSEInspectionStatus.INPROGRESS
                )
                  railReceiptCompartmentdata.HSEInspectionStatus = "INPROGRESS";
                break;
              }
            }
          }
          this.setState({ modRailReceiptCompartmentPlanList });
        } else {
          console.log(
            "Error in getWagonHseInspectionStatus: ",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getWagonHseInspectionStatus: ", error);
      });
  }
  getRailReceiptWeighBridgeData(railReceipt) {
    const keyCode = [
      {
        key: "TransactionType",
        value: "Receipt",
      },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.RAIL,
      },
      {
        key: "DispatchReceiptCode",
        value: railReceipt.ReceiptCode,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.railReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailMarineDispatchReceiptWeighBridgeData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (
          result.IsSuccess === true &&
          result.EntityResult !== null &&
          Array.isArray(result.EntityResult.Table)
        ) {
          this.setState({
            weightBridgeData: result.EntityResult.Table,
            modWeightBridgeData: lodash.cloneDeep(result.EntityResult.Table),
          });
          this.setmodRailReceiptCompartmentPlanListFromReceipt(
            railReceipt,
            result.EntityResult.Table
          );
        } else {
          this.setState({
            weightBridgeData: [],
            modWeightBridgeData: [],
          });
          this.setmodRailReceiptCompartmentPlanListFromReceipt(
            railReceipt,
            result.EntityResult.Table
          );
        }
      })
      .catch((error) => {
        this.setState({
          weightBridgeData: [],
          modWeightBridgeData: [],
        });
        console.log(
          "Error while getting GetRailMarineDispatchReceiptWeighBridgeData:",
          error
        );
      });
  }
  setmodRailReceiptCompartmentPlanListFromReceipt(
    railReceipt,
    weightBridgeDataList
  ) {
    const modRailReceiptCompartmentPlanList = [];
    if (Array.isArray(railReceipt.RailMarineReceiptCompartmentPlanList)) {
      railReceipt.RailMarineReceiptCompartmentPlanList.forEach((item) => {
        let weightBridgeData;
        for (let weightBridgeDataItem of weightBridgeDataList) {
          if (weightBridgeDataItem.WagonCode === item.TrailerCode) {
            weightBridgeData = weightBridgeDataItem;
            break;
          }
        }
        const modRailReceiptCompartmentPlan = {
          ReceiptCode: item.ReceiptCode,
          TrailerCode: item.TrailerCode,
          CarrierCompanyCode: item.CarrierCompanyCode,
          FinishedProductCode: item.FinishedProductCode,
          ReceiptCompartmentStatus: getKeyByValue(
            Constants.ReceiptCompartmentStatus,
            item.ReceiptCompartmentStatus
          ),

          SequenceNo: item.SequenceNo,
          PlannedQuantity:
            item.PlannedQuantity !== null && item.PlannedQuantity !== ""
              ? item.PlannedQuantity.toLocaleString() +
              (item.PlanQuantityUOM ? " " + item.PlanQuantityUOM : "")
              : "",
          RevisedQuantity:
            item.AdjustedPlanQuantity !== null &&
              item.AdjustedPlanQuantity !== ""
              ? item.AdjustedPlanQuantity.toLocaleString() +
              (item.PlanQuantityUOM ? " " + item.PlanQuantityUOM : "")
              : "",
          UnloadedQuantity:
            item.UnloadedQuantity !== null && item.UnloadedQuantity !== ""
              ? item.UnloadedQuantity.toLocaleString() +
              (item.UnloadedQuantityUOM ? " " + item.UnloadedQuantityUOM : "")
              : "",

          TareWeight: "",
          LadenWeight: "",
          DiffWeight: "",
          HSEInspectionStatus: "",
          ForceComplete: false,
        };
        if (
          modRailReceiptCompartmentPlan.ReceiptCompartmentStatus !==
          Constants.ReceiptCompartment_Status.FORCE_COMPLETED
        ) {
          if (this.state.tabActiveIndex === 1) {
            this.setState({ saveEnabled: true });
          }
        }
        if (weightBridgeData !== undefined) {
          let tareWeightFlag = false;
          let ladenWeightFlag = false;
          if (
            weightBridgeData.TareWeight !== "" &&
            weightBridgeData.TareWeight !== null
          ) {
            tareWeightFlag = true;
            modRailReceiptCompartmentPlan.TareWeight =
              Math.round(weightBridgeData.TareWeight).toLocaleString() +
              " " +
              weightBridgeData.TareWeightUOM;
          }
          if (
            weightBridgeData.LadenWeightInDispatchReceiptUOM !== "" &&
            weightBridgeData.LadenWeightInDispatchReceiptUOM !== null
          ) {
            ladenWeightFlag = true;
            modRailReceiptCompartmentPlan.LadenWeight =
              Math.round(weightBridgeData.LadenWeight).toLocaleString() +
              " " +
              weightBridgeData.LadenWeightUOM;
          }

          if (tareWeightFlag && ladenWeightFlag) {
            modRailReceiptCompartmentPlan.DiffWeight =
              Math.round(
                weightBridgeData.LadenWeight - weightBridgeData.TareWeight
              ).toLocaleString() +
              " " +
              weightBridgeData.DispatchReceiptUOM;
          } else if (!tareWeightFlag && ladenWeightFlag) {
            modRailReceiptCompartmentPlan.DiffWeight =
              modRailReceiptCompartmentPlan.LadenWeight;
          } else if (tareWeightFlag && !ladenWeightFlag) {
            if (Math.round(weightBridgeData.TareWeight) === 0) {
              modRailReceiptCompartmentPlan.DiffWeight =
                modRailReceiptCompartmentPlan.TareWeight;
            } else {
              modRailReceiptCompartmentPlan.DiffWeight =
                "-" + modRailReceiptCompartmentPlan.TareWeight;
            }
          }
        }
        this.getWagonHseInspectionStatus(item.ReceiptCode);
        modRailReceiptCompartmentPlanList.push(modRailReceiptCompartmentPlan);
      });
    }
    this.setState({
      modRailReceiptCompartmentPlanList,
    });
  }

  generateCompartmentCode(compartments) {
    var maxnumber = 0;
    if (compartments === null || compartments.length === 0) return 1;
    compartments.forEach((comp) => {
      var compCode = comp.CompartmentCode;
      if (compCode !== null || compCode !== "") {
        if (!isNaN(parseInt(compCode))) {
          let val = parseInt(compCode);

          if (val > maxnumber) maxnumber = val;
        }
      }
    });
    return maxnumber + 1;
  }

  getAssociationsFromReceipt(railReceipt) {
    let receiptAssociations = [];
    if (Array.isArray(railReceipt.RailMarineReceiptCompartmentDetailPlanList)) {
      railReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
        (receiptCompartment) => {
          receiptAssociations.push({
            AssociatedContractItems: receiptCompartment.AssociatedContractItems,
            AssociatedOrderItems: receiptCompartment.AssociatedOrderItems,
            Attributes: receiptCompartment.Attributes,
            CarrierCompanyCode: receiptCompartment.CarrierCompanyCode,
            CompartmentCode: receiptCompartment.CompartmentCode,
            CompartmentSeqNoInVehicle:
              receiptCompartment.CompartmentSeqNoInVehicle,
            FinishedProductCode: receiptCompartment.FinishedProductCode,
            OriginTerminalCode: receiptCompartment.OriginTerminalCode,
            Quantity:
              receiptCompartment.Quantity !== null &&
                receiptCompartment.Quantity !== ""
                ? receiptCompartment.Quantity.toLocaleString()
                : null,
            IsTransloading: receiptCompartment.IsTransloading,
            QuantityUOM: receiptCompartment.QuantityUOM,
            ReceiptCode: receiptCompartment.ReceiptCode,
            SequenceNo: receiptCompartment.SequenceNo,
            ShareholderCode: receiptCompartment.ShareholderCode,
            SupplierCode: receiptCompartment.SupplierCode,
            TrailerCode: receiptCompartment.TrailerCode,
          });
        }
      );
    }
    // receiptAssociations = Utilities.addSeqNumberToListObject(
    //     receiptAssociations
    // );
    return receiptAssociations;
  }
  getCompartmentsFromAssociations(modAssociations) {
    let receiptCompartments = [];
    if (Array.isArray(modAssociations)) {
      modAssociations.forEach((modAssociation) => {
        if (
          !(
            modAssociation.FinishedProductCode === null ||
            modAssociation.FinishedProductCode === ""
          ) ||
          !(
            modAssociation.SupplierCode === null ||
            modAssociation.SupplierCode === ""
          ) ||
          !(
            modAssociation.OriginTerminalCode === null ||
            modAssociation.OriginTerminalCode === ""
          )
        ) {
          receiptCompartments.push({
            AssociatedContractItems: modAssociation.AssociatedContractItems,
            AssociatedOrderItems: modAssociation.AssociatedOrderItems,
            Attributes: modAssociation.Attributes,
            AttributesforUI: modAssociation.AttributesforUI,
            CarrierCompanyCode: modAssociation.CarrierCompanyCode,
            CompartmentCode: modAssociation.CompartmentCode,
            CompartmentSeqNoInVehicle: modAssociation.CompartmentSeqNoInVehicle,
            FinishedProductCode: modAssociation.FinishedProductCode,
            OriginTerminalCode: modAssociation.OriginTerminalCode,
            Quantity: modAssociation.Quantity,
            IsTransloading: modAssociation.IsTransloading,
            QuantityUOM: this.state.modRailReceipt.QuantityUOM,
            ReceiptCode: this.state.modRailReceipt.ReceiptCode,
            SequenceNo: modAssociation.SequenceNo,
            ShareholderCode: modAssociation.ShareholderCode,
            SupplierCode: modAssociation.SupplierCode,
            TrailerCode: modAssociation.TrailerCode,
          });
        }
      });
    }
    return receiptCompartments;
  }

  checkCompartmentSaveEnabled(compartmentPlanList) {
    if (compartmentPlanList === null) {
      return false;
    }
    for (let item of compartmentPlanList) {
      const forceCompleteEnable =
        item.ReceiptCompartmentStatus !==
        Constants.ReceiptCompartment_Status.FORCE_COMPLETED;
      if (forceCompleteEnable) {
        return true;
      }
    }
    return false;
  }

  handleTabChange = (activeIndex) => {
    try {
      this.setState({ tabActiveIndex: activeIndex });
      if (activeIndex === 0) {
        this.setState({
          saveEnabled:
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnRailReceipt
            ) &&
            (this.state.modRailReceipt.ReceiptStatus === "READY" ||
              this.props.currentAccess.ViewRailReceipt_Update),
        });
      }
      if (activeIndex === 1) {
        this.setState({
          saveEnabled:
            this.checkCompartmentSaveEnabled(
              this.state.modRailReceiptCompartmentPlanList
            ) &&
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnRailReceipt
            ),
        });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleTabChange",
        error
      );
    }
  };

  handleBack = () => {
    try {
      this.setState({
        isReadyToRender: true,
        isDetail: "false",
        ViewUnloadingData: [],
      });
    } catch (error) {
      console.log(
        "ViewMarineReceiptDetailsComposite:Error occured on handleBack",
        error
      );
    }
  };

  handleManualEntryTabChange = (activeIndex) => {
    try {
      this.setState({ manualEntryTabActiveIndex: activeIndex });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleManualEntryTabChange",
        error
      );
    }
  };
  handleAttributeCellDataEdit = (attribute, value) => {
    try {
      attribute.DefaultValue = value;
      this.setState({
        attribute: attribute,
      });
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
        "TankDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };
  getAttributes(selectRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [railReceiptAttributeEntity, railReceiptComAttributeEntity],
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
                  result.EntityResult.RAILRECEIPTPLAN
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RAILRECEIPTWAGONDETAILPLAN
              ),
            },
            () => this.getRailReceipt(selectRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }
  fillAttributeDetails(modRailReceipt, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modRailReceipt.Attributes = [];
      attributeList.forEach((comp) => {
        let attribute = {
          ListOfAttributeData: [],
        };
        attribute.TerminalCode = comp.TerminalCode;
        comp.attributeMetaDataList.forEach((det) => {
          attribute.ListOfAttributeData.push({
            AttributeCode: det.Code,
            AttributeValue: det.DefaultValue,
          });
        });
        modRailReceipt.Attributes.push(attribute);
      });
      // For Compartment Attributes
      modRailReceipt.RailMarineReceiptCompartmentDetailPlanList.forEach(
        (comp) => {
          let selectedTerminals = [];
          if (this.props.userDetails.EntityResult.IsEnterpriseNode)
            selectedTerminals = lodash.cloneDeep(modRailReceipt.TerminalCodes);
          else {
            var compAttributeMetaDataList = lodash.cloneDeep(
              this.state.compartmentAttributeMetaDataList
            );
            if (compAttributeMetaDataList.length > 0)
              selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
          }
          let terminalAttributes = [];
          comp.Attributes = [];
          if (selectedTerminals === null) selectedTerminals = [];
          selectedTerminals.forEach((terminal) => {
            if (
              comp.AttributesforUI !== null &&
              comp.AttributesforUI !== undefined
            )
              terminalAttributes = comp.AttributesforUI.filter(function (
                attTerminal
              ) {
                return attTerminal.TerminalCode === terminal;
              });

            let attribute = {
              ListOfAttributeData: [],
            };
            attribute.TerminalCode = terminal;
            terminalAttributes.forEach((termAtt) => {
              if (termAtt.AttributeValue !== "" || termAtt.IsMandatory === true)
                attribute.ListOfAttributeData.push({
                  AttributeCode: termAtt.AttributeCode,
                  AttributeValue: termAtt.AttributeValue,
                });
            });
            if (
              attribute.ListOfAttributeData !== null &&
              attribute.ListOfAttributeData !== undefined &&
              attribute.ListOfAttributeData.length > 0
            )
              comp.Attributes.push(attribute);
          });
        }
      );
      this.setState({ modRailReceipt });
      return modRailReceipt;
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }
  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals == null) {
        selectedTerminals = [];
      }
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var selectedAttributeList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        selectedAttributeList = lodash.cloneDeep(
          this.state.selectedAttributeList
        );
        const attributeValidationErrors = lodash.cloneDeep(
          this.state.attributeValidationErrors
        );
        var modReceipt = lodash.cloneDeep(this.state.modRailReceipt);

        selectedTerminals.forEach((terminal) => {
          var existitem = selectedAttributeList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.RAILRECEIPTPLAN.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modReceipt.Attributes.find(
                  (baseproductAttribute) => {
                    return baseproductAttribute.TerminalCode === terminal;
                  }
                );
                if (Attributevalue !== undefined) {
                  attributeMetaData.attributeMetaDataList.forEach(function (
                    attributeMetaData
                  ) {
                    var valueAttribute =
                      Attributevalue.ListOfAttributeData.find((x) => {
                        return x.AttributeCode === attributeMetaData.Code;
                      });
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
        selectedAttributeList = [];
        selectedAttributeList = attributesTerminalsList;
        selectedAttributeList = Utilities.attributesConvertoDecimal(
          selectedAttributeList
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
        this.formCompartmentAttributes(selectedTerminals);
        this.setState({ selectedAttributeList, attributeValidationErrors });
      }
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }
  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.RAILRECEIPTPLAN) && attributeMetaDataList.RAILRECEIPTPLAN.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.RAILRECEIPTPLAN[0].TerminalCode,
        ]);
      }
      var compAttributeMetaDataList = lodash.cloneDeep(
        this.state.compartmentAttributeMetaDataList
      );
      if (Array.isArray(compAttributeMetaDataList) && compAttributeMetaDataList.length > 0)
        this.formCompartmentAttributes([
          compAttributeMetaDataList[0].TerminalCode,
        ]);
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }
  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.RAILRECEIPTPLAN
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }
  formCompartmentAttributes(selectedTerminals) {
    try {
      let attributes = lodash.cloneDeep(
        this.state.compartmentAttributeMetaDataList
      );

      attributes = attributes.filter(function (attTerminal) {
        return selectedTerminals.some(function (selTerminal) {
          return attTerminal.TerminalCode === selTerminal;
        });
      });
      let modAssociations = lodash.cloneDeep(this.state.modAssociations);
      let compAttributes = [];
      attributes.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName,
            AttributeValue: attribute.DefaultValue,
            TerminalCode: attribute.TerminalCode,
            IsMandatory: attribute.IsMandatory,
            DataType: attribute.DataType,
            IsReadonly: attribute.IsReadonly,
            compSequenceNo: "",
          });
        });
      });
      let attributesforNewComp = lodash.cloneDeep(compAttributes);
      modAssociations.forEach((comp) => {
        if (
          (comp.ReceiptCode === null || comp.ReceiptCode === "") &&
          (comp.AttributesforUI === null || comp.AttributesforUI === undefined)
        ) {
          comp.AttributesforUI = [];
          attributesforNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.SequenceNo;
            comp.AttributesforUI.push(assignedAttributes);
          });
        } else {
          if (
            comp.AttributesforUI !== null &&
            comp.AttributesforUI !== undefined
          ) {
            comp.AttributesforUI = comp.AttributesforUI.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });

            compAttributes = compAttributes.filter(function (attTerminal) {
              return !comp.AttributesforUI.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal.TerminalCode;
              });
            });
          } else comp.AttributesforUI = [];

          let tempCompAttributes = lodash.cloneDeep(compAttributes);
          if (
            Array.isArray(comp.Attributes) &&
            comp.Attributes !== null &&
            comp.Attributes !== undefined &&
            comp.Attributes.length > 0
          ) {
            let selectedTerminalAttributes = comp.Attributes.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });
            selectedTerminalAttributes.forEach((att) => {
              att.ListOfAttributeData.forEach((attData) => {
                let tempAttIndex = tempCompAttributes.findIndex(
                  (item) =>
                    item.TerminalCode === att.TerminalCode &&
                    item.AttributeCode === attData.AttributeCode
                );
                if (tempAttIndex >= 0)
                  tempCompAttributes[tempAttIndex].AttributeValue =
                    attData.AttributeValue;
              });
            });
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SequenceNo;
              comp.AttributesforUI.push(assignedAttributes);
            });
          } else {
            let temp = lodash.cloneDeep(compAttributes);
            temp.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SequenceNo;
              comp.AttributesforUI.push(assignedAttributes);
            });
          }
        }
        this.toggleExpand(comp, true, true);
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modAssociations });
    } catch (error) {
      console.log(
        "RailReceiptDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }
  toggleExpand = (data, open, isTerminalAdded = false) => {
    //console.log("Data in Toggle", data)
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
      (item) => item.SequenceNo === data.SequenceNo
    );
    if (open) {
      if (isTerminalAdded && expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
        expandedRows.push(data);
      } else if (expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
      }
    } else {
      if (expandedRowIndex >= 0) {
        expandedRows = expandedRows.filter(
          (x) => x.Code !== data.Code && x.SequenceNo !== data.SequenceNo
        );
      } else expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };
  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    let compIndex = modAssociations.findIndex(
      (item) => item.SequenceNo === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0) {
      if (compAttribute.rowData.DataType === "Bool") {
        if (compAttribute.rowData.AttributeValue === "true") {
          modAssociations[compIndex].AttributesforUI[
            // compAttribute.rowIndex
            compAttribute.rowData.SeqNumber - 1
          ].AttributeValue = "false";
        } else {
          modAssociations[compIndex].AttributesforUI[
            // compAttribute.rowIndex
            compAttribute.rowData.SeqNumber - 1
          ].AttributeValue = "true";
        }
      } else {
        modAssociations[compIndex].AttributesforUI[
          // compAttribute.rowIndex
          compAttribute.rowData.SeqNumber - 1
        ].AttributeValue = value;
      }
    }
    this.setState({ modAssociations });
    if (compIndex >= 0)
      this.toggleExpand(modAssociations[compIndex], true, true);
  };
  getKPIList(railReceiptCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    )
    if (KPIView === true) {

      let objKPIRequestData = {
        PageName: kpiRailReceiptDetails,
        TransportationType: Constants.TransportationType.RAIL,
        InputParameters: [{ key: "ReceiptCode", value: railReceiptCode }],
      };
      axios(
        RestApis.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ railReceiptKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ railReceiptKPIList: [] });
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
    const popUpContents = [
      {
        fieldName: "ViewRailReceiptDetails_LastUpdatedTime",
        fieldValue:
          new Date(
            this.state.modRailReceipt.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modRailReceipt.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "ViewRailReceiptDetails_LastActiveTime",
        fieldValue:
          this.state.modRailReceipt.LastActiveTime !== undefined &&
            this.state.modRailReceipt.LastActiveTime !== null
            ? new Date(
              this.state.modRailReceipt.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modRailReceipt.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "ViewRailReceiptDetails_CreatedTime",
        fieldValue:
          new Date(this.state.modRailReceipt.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modRailReceipt.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isDetail === "true" ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.railReceipt.ReceiptCode}
            newEntityName="Rail_Receipt_NewReceipt"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.railReceiptKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <RailReceiptDetails
            operationsVisibilty={this.state.operationsVisibilty}
            modRailReceiptCompartmentPlanList={
              this.state.modRailReceiptCompartmentPlanList
            }
            selectedCompRow={this.state.selectedCompRow}
            railReceipt={this.state.railReceipt}
            modRailReceipt={this.state.modRailReceipt}
            modAssociations={this.state.modAssociations}
            validationErrors={this.state.validationErrors}
            listOptions={{
              shareholders: this.state.shareholders,
              terminalCodes: this.props.terminalCodes,
              quantityUOMOptions: this.state.quantityUOMOptions,
              carrierCompanyOptions: this.state.carrierCompanyOptions,
              railWagonOptions: this.state.railWagonOptions,
              finishedProductOptions: this.state.finishedProductOptions,
              supplierDestinationOptions: this.state.supplierDestinationOptions,
            }}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            handleAssociationSelectionChange={
              this.handleAssociationSelectionChange
            }
            handleCellDataEdit={this.handleCellDataEdit}
            handleAttributeCellDataEdit={this.handleAttributeCellDataEdit}
            handleAddAssociation={this.handleAddAssociation}
            handleDeleteAssociation={this.handleDeleteAssociation}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            selectedAttributeList={this.state.selectedAttributeList}
            viewTab={this.props.viewTab}
            onTabChange={this.handleTabChange}
            handleCompAttributeCellDataEdit={
              this.handleCompAttributeCellDataEdit
            }
            toggleExpand={this.toggleExpand}
            expandedRows={this.state.expandedRows}
            compartmentDetailsPageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            enableHSEInspection={this.props.enableHSEInspection}
            railLookUpData={this.props.railLookUpData}
            WagonDetailTab={
              this.state.railReceipt.ReceiptCode === "" ||
                this.state.railReceipt.ReceiptCode === null ||
                this.state.railReceipt.ReceiptCode === undefined
                ? []
                : [""]
            }
            isTransloading={this.state.isTransloading}
            currentAccess={this.props.currentAccess}
          ></RailReceiptDetails>
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
                this.state.railReceipt.ReceiptCode  === ""
                  ? functionGroups.add
                  : functionGroups.modify
              }
              functionGroup={fnRailReceipt}
              handleOperation={this.saveRailReceipt}
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

const mapDispatchToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RailReceiptDetailsComposite);

RailReceiptDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  viewTab: PropTypes.number.isRequired,
  railReceipt: PropTypes.object.isRequired,
  handleOperationButtonClick: PropTypes.func,
};
