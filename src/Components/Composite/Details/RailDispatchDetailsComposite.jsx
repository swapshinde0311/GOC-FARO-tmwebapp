import React, { Component } from "react";
import { RailDispatchDetails } from "../../UIBase/Details/RailDispatchDetails";
import { RailDispatchCompartmentManualEntryDetails } from "../../UIBase/Details/RailDispatchCompartmentManualEntryDetails";
import { RailDispatchViewAuditTrailDetails } from "../../UIBase/Details/RailDispatchViewAuditTrailDetails";
import { RailDispatchViewLoadingDetailsDetails } from "../../UIBase/Details/RailDispatchViewLoadingDetailsDetails";
import { RailDispatchRailWagonAssignmentDetails } from "../../UIBase/Details/RailDispatchRailWagonAssignmentDetails";
import { RailDispatchProductAssignmentDetails } from "../../UIBase/Details/RailDispatchProductAssignmentDetails";
import { RailDispatchLoadSpotAssignmentDetails } from "../../UIBase/Details/RailDispatchLoadSpotAssignmentDetails";
import { RailDispatchRecordWeightDetails } from "../../UIBase/Details/RailDispatchRecordWeightDetails";

import {
  railDispatchPlanAttributeEntity,
  railDispatchItemAttributeEntity,
  railDispatchStatusChangeAttributeEntity,
  railDispatchWagonAttributeEntity,
  railDispatchWagonDetailPlanAttributeEntity,
  railDispatchWagonWeightBridgeAttributeEntity,
  railDispatchWagonCompAttributeEntity,
  railLoadingDetailsFPAttributeEntity,
  railLoadingDetailsBPAttributeEntity,
  railLoadingDetailsAdditiveAttributeEntity,
  MARINEDISPATCHSTATUSTIME,
} from "../../../JS/AttributeEntity";

import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import {
  railDispatchValidationDef,
  railDispatchCompartmentManualEntryValidationDef,
} from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import {
  emptyRailDispatch,
  emptyRailMarineTransactionCommonInfo,
  emptyRailMarineTransactionProductInfo,
} from "../../../JS/DefaultEntities";
import axios from "axios";
import * as Constants from "./../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "./../../../JS/KeyCodes";
import { functionGroups, fnRailDispatch, fnKPIInformation,
  fnRailDispatchLoadSpotAssignment,
  fnRailDispatchProductAssignment,
  fnViewRailLoadingDetails,
} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import {
  railDispatchCompartmentDef,
  railDispatchLoadSpotAssignmentDef,
  railDispatchCompartmentAdjustmentDef,
} from "../../../JS/DetailsTableValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal } from "@scuf/common";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiRailShipmentDetails } from "../../../JS/KPIPageName";

import UserAuthenticationLayout from "../Common/UserAuthentication";
import CommonConfirmModal from "../../UIBase/Common/CommonConfirmModal"

class RailDispatchDetailsComposite extends Component {
  state = {
    railDispatch: lodash.cloneDeep(emptyRailDispatch),
    modRailDispatch: {},
    modAssociations: [],
    modWagonDetails: [],
    loadingDataInfo: {},
    modLoadingDataInfo: {},
    dispatchStatusChangeList: [],
    auditTrailList: [],
    loadingDetailsList: [],
    weightBridgeData: [],
    modWeightBridgeData: [],
    validationErrors: Utilities.getInitialValidationErrors(
      railDispatchValidationDef
    ),
    manualEntryValidationDict: {},
    isReadyToRender: false,
    shareholders: this.getShareholders(),
    terminalCodes: [],
    railWagonCategoryOptions: [],
    contractCodeOptions: [],
    quantityUOMOptions: [],
    densityUOMOptions: [],
    temperatureUOMOptions: [],
    routeCodeOptions: [],
    routeCodeSearchOptions: [],
    finishedProductOptions: {},
    customerDestinationOptions: {},
    weightBridgeOptions: [],
    weightBridgeSetting: {},
    expandedRows: [],
    expandedWagonRows: [],

    attribute: [],
    attributeMetaDataList: [],
    compartmentAttributeMetaDataList: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],

    productAssignmentExpandedRows: [],
    wagonDetailPlanAttributeMetaDataList: [],

    meterCodeOptions: [],
    meterCodeSearchOptions: [],
    tankCodeOptions: [],
    tankCodeSearchOptions: [],
    wagonCodeOptions: [],
    clusterCodeOptions: [],
    clusterBCUOptions: {},
    BCUCodeOptions: [],
    loadingArmCodeOptions: [],
    compartmentManualEntrySaveEnabled: false,
    recordWeightSaveEnabled: false,

    FPAttributeMetaDataList: [],
    BPAttributeMetaDataList: [],
    additiveAttributeMetaDataList: [],
    manualEntrySelectedAttributeList: [],
    manualEntryAttributeValidationErrorList: [],
    auditTrailAttributeMetaDataList: [],

    carrierCodeOptions: [],
    trailerCodeOptions: [],
    railWagonAssignmentData: {
      CarrierCompanyCode: "",
      TrailerCode: "",
    },
    modRailWagonList: [],
    selectedRailWagons: [],
    railWagonAssignmentSaveEnabled: false,
    productAssignmentSaveEnabled: false,
    loadSpotAssignmentSaveEnabled: false,
    railWagonBatchPlanList: [],
    modRailWagonBatchPlanList: [],
    spurCodeOptions: [],
    loadSpotClusterCodeOptions: [],
    loadSpotBCUCodeOptions: [],

    selectedAssociations: [],
    railRouteData: {
      DestinationCode: "",
      DepartureTime: "",
    },
    isOpenSubPage: false,
    saveEnabled: false,
    compartmentSaveEnabled: false,
    tabActiveIndex: 0,
    manualEntryTabActiveIndex: 0,
    loadingDetailsHideColumnList: [],
    modalData: {
      forceCompleteCompartment: {
        isOpen: false,
        data: {
          trailerCode: "",
        },
      },
      printAuditTrail: {
        isOpen: false,
      },
    },
    contractData: [],
    railDispatchKPIList: [],
    maxNumberOfCompartments: 60,
    showAuthenticationLayout: false,
    showWagonAssignmentAuthenticationLayout: false,
    showProductAssignmentAuthenticationLayout: false,
    showLoadSpotAssignmentAuthenticationLayout: false,
    showManualEntryAuthenticationLayout: false,
    tempRailDispatch: {},
    tempLoadingInfo: {},
    isShowMultipleSpurs:false,
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getUOMs();
      this.getRailRouteCodes();
      this.getRailWagonCategory();
      this.getFinishedProductCodes();
      this.getCustomerDestinations();
      this.getTankCode(this.props.selectedShareholder);
      this.getMeterCode();
      this.getRailBayAndBcuList();
      this.getRailLoadSpotDevices("", "SPUR");
      this.getCarrierCompanyCodes("");
      this.getWeightBridgeData();
      this.getContractCodes(this.props.selectedShareholder);
      this.getAttributes(() => this.getRailDispatch(this.props.selectedRow));
      this.getMaxCompartments();
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occurred on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.subPageName !== this.props.subPageName) {
        this.handleOpenSubPage(nextProps.subPageName);
      } else if (
        (this.state.railDispatch.DispatchCode !== "" &&
          nextProps.selectedRow.Common_Code === undefined) ||
        nextProps.selectedRow.ViewRailDispatchDetails_ShipmentStatus !==
        this.props.selectedRow.ViewRailDispatchDetails_ShipmentStatus
      ) {
        this.getRailDispatch(nextProps.selectedRow, true);
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occurred on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(callBack) {
    const obj = [
      railDispatchPlanAttributeEntity,
      railDispatchItemAttributeEntity,
      railDispatchStatusChangeAttributeEntity,
      railDispatchWagonAttributeEntity,
      railDispatchWagonDetailPlanAttributeEntity,
      railDispatchWagonWeightBridgeAttributeEntity,
      railDispatchWagonCompAttributeEntity,
      railLoadingDetailsFPAttributeEntity,
      railLoadingDetailsBPAttributeEntity,
      railLoadingDetailsAdditiveAttributeEntity,
      MARINEDISPATCHSTATUSTIME,
    ];
    axios(
      RestAPIs.GetAttributesMetaData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RAILDISPATCHPLAN
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.RAILDISPATCHPLAN
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RAILDISPATCHITEM
              ),
              wagonDetailPlanAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RAILDISPATCHWAGONDETAILPLAN
              ),
              FPAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RAILLOADINGDETAILSFP
              ),
              BPAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RAILLOADINGDETAILSBP
              ),
              additiveAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.RAILLOADINGDETAILSADDITIVE
              ),
              auditTrailAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.MARINEDISPATCHSTATUSTIME
              ),
            },
            () => callBack()
          );
        } else {
          console.log("Failed to get Attributes");
        }
      })
      .catch((error) => {
        console.log("Error in getAttributes: ", error);
      });
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals == null) {
        selectedTerminals = [];
      }
      const attributesTerminalsList = [];

      const attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      let selectedAttributeList = lodash.cloneDeep(
        this.state.selectedAttributeList
      );
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      const modRailDispatch = lodash.cloneDeep(this.state.modRailDispatch);

      for (let terminal of selectedTerminals) {
        const existItem = selectedAttributeList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existItem === undefined) {
          for (let item of attributeMetaDataList) {
            if (item.TerminalCode === terminal) {
              const attributeValue = modRailDispatch.Attributes.find(
                (attribute) => {
                  return attribute.TerminalCode === terminal;
                }
              );
              if (attributeValue !== undefined) {
                item.attributeMetaDataList.forEach((attributeMetaData) => {
                  const valueAttribute =
                    attributeValue.ListOfAttributeData.find((data) => {
                      return data.AttributeCode === attributeMetaData.Code;
                    });
                  if (valueAttribute !== undefined) {
                    attributeMetaData.DefaultValue =
                      valueAttribute.AttributeValue;
                  }
                });
              }
              attributesTerminalsList.push(item);
            }
          }
        } else {
          attributesTerminalsList.push(existItem);
        }
      }

      selectedAttributeList = Utilities.attributesConvertoDecimal(
        attributesTerminalsList
      );
      attributeValidationErrors.forEach((attributeValidation) => {
        const existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          for (let key in attributeValidation.attributeValidationErrors) {
            attributeValidation.attributeValidationErrors[key] = "";
          }
        }
      });

      this.formCompartmentAttributes(selectedTerminals);
      this.formProductAssignmentAttributes(selectedTerminals);

      this.setState({ selectedAttributeList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      const attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList) && attributeMetaDataList.length > 0) {
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      } else {
        const compAttributeMetaDataList = lodash.cloneDeep(
          this.state.compartmentAttributeMetaDataList
        );
        if (Array.isArray(compAttributeMetaDataList) && compAttributeMetaDataList.length > 0) {
          this.formCompartmentAttributes([
            compAttributeMetaDataList[0].TerminalCode,
          ]);
        }

        const wagonDetailPlanAttributeMetaDataList = lodash.cloneDeep(
          this.state.wagonDetailPlanAttributeMetaDataList
        );
        if (Array.isArray(wagonDetailPlanAttributeMetaDataList) && wagonDetailPlanAttributeMetaDataList.length > 0) {
          this.formProductAssignmentAttributes([
            wagonDetailPlanAttributeMetaDataList[0].TerminalCode,
          ]);
        }
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on localNodeAttribute",
        error
      );
    }
  }

  formCompartmentAttributes(selectedTerminals) {
    try {
      const attributes = this.state.compartmentAttributeMetaDataList.filter(
        (attTerminal) => {
          return selectedTerminals.some((selTerminal) => {
            return attTerminal.TerminalCode === selTerminal;
          });
        }
      );
      const modAssociations = lodash.cloneDeep(this.state.modAssociations);
      let compAttributes = [];
      attributes.forEach((item) => {
        item.attributeMetaDataList.forEach((attribute) => {
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName,
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
      modAssociations.forEach((comp) => {
        let attributesForNewComp = lodash.cloneDeep(compAttributes);
        if (
          comp.SeqNumber === null &&
          (comp.AttributesForUI === undefined || comp.AttributesForUI === null)
        ) {
          comp.AttributesForUI = [];
          attributesForNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.SeqNumber;
            comp.AttributesForUI.push(assignedAttributes);
          });
        } else {
          if (
            comp.AttributesForUI !== undefined &&
            comp.AttributesForUI !== null
          ) {
            comp.AttributesForUI = comp.AttributesForUI.filter(
              (attTerminal) => {
                return selectedTerminals.some((selTerminal) => {
                  return attTerminal.TerminalCode === selTerminal;
                });
              }
            );

            attributesForNewComp = attributesForNewComp.filter(
              (attTerminal) => {
                return !comp.AttributesForUI.some((selTerminal) => {
                  return attTerminal.TerminalCode === selTerminal.TerminalCode;
                });
              }
            );
          } else {
            comp.AttributesForUI = [];
          }

          const tempCompAttributes = lodash.cloneDeep(attributesForNewComp);
          if (
            comp.Attributes !== undefined &&
            comp.Attributes !== null &&
            Array.isArray(comp.Attributes) &&
            comp.Attributes.length > 0
          ) {
            const selectedTerminalAttributes = comp.Attributes.filter(
              (attTerminal) => {
                return selectedTerminals.some((selTerminal) => {
                  return attTerminal.TerminalCode === selTerminal;
                });
              }
            );
            selectedTerminalAttributes.forEach((att) => {
              att.ListOfAttributeData.forEach((attData) => {
                const tempAttIndex = tempCompAttributes.findIndex((item) => {
                  return (
                    item.TerminalCode === att.TerminalCode &&
                    item.AttributeCode === attData.AttributeCode
                  );
                });
                if (tempAttIndex >= 0) {
                  tempCompAttributes[tempAttIndex].AttributeValue =
                    attData.AttributeValue;
                }
              });
            });
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesForUI.push(assignedAttributes);
            });
          } else {
            attributesForNewComp.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesForUI.push(assignedAttributes);
            });
          }
        }
        this.toggleExpand(comp, true, true);
        comp.AttributesForUI = Utilities.compartmentAttributesConvertoDecimal(
          comp.AttributesForUI
        );
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modAssociations });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error in forming Compartment Attributes",
        error
      );
    }
  }

  formProductAssignmentAttributes(selectedTerminals) {
    try {
      const attributes = this.state.wagonDetailPlanAttributeMetaDataList.filter(
        (attTerminal) => {
          return selectedTerminals.some((selTerminal) => {
            return attTerminal.TerminalCode === selTerminal;
          });
        }
      );
      const modRailWagonList = lodash.cloneDeep(this.state.modRailWagonList);
      let compAttributes = [];
      attributes.forEach((item) => {
        item.attributeMetaDataList.forEach((attribute) => {
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName,
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
      modRailWagonList.forEach((comp) => {
        let attributesForNewComp = lodash.cloneDeep(compAttributes);
        if (
          comp.SequenceNo === null &&
          (comp.AttributesForUI === undefined || comp.AttributesForUI === null)
        ) {
          comp.AttributesForUI = [];
          attributesForNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.SequenceNo;
            comp.AttributesForUI.push(assignedAttributes);
          });
        } else {
          if (
            comp.AttributesForUI !== undefined &&
            comp.AttributesForUI !== null
          ) {
            comp.AttributesForUI = comp.AttributesForUI.filter(
              (attTerminal) => {
                return selectedTerminals.some((selTerminal) => {
                  return attTerminal.TerminalCode === selTerminal;
                });
              }
            );

            attributesForNewComp = attributesForNewComp.filter(
              (attTerminal) => {
                return !comp.AttributesForUI.some((selTerminal) => {
                  return attTerminal.TerminalCode === selTerminal.TerminalCode;
                });
              }
            );
          } else {
            comp.AttributesForUI = [];
          }

          const tempCompAttributes = lodash.cloneDeep(attributesForNewComp);
          if (
            comp.Attributes !== undefined &&
            comp.Attributes !== null &&
            Array.isArray(comp.Attributes) &&
            comp.Attributes.length > 0
          ) {
            const selectedTerminalAttributes = comp.Attributes.filter(
              (attTerminal) => {
                return selectedTerminals.some((selTerminal) => {
                  return attTerminal.TerminalCode === selTerminal;
                });
              }
            );
            selectedTerminalAttributes.forEach((att) => {
              att.ListOfAttributeData.forEach((attData) => {
                const tempAttIndex = tempCompAttributes.findIndex((item) => {
                  return (
                    item.TerminalCode === att.TerminalCode &&
                    item.AttributeCode === attData.AttributeCode
                  );
                });
                if (tempAttIndex >= 0) {
                  tempCompAttributes[tempAttIndex].AttributeValue =
                    attData.AttributeValue;
                }
              });
            });
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SequenceNo;
              comp.AttributesForUI.push(assignedAttributes);
            });
          } else {
            attributesForNewComp.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SequenceNo;
              comp.AttributesForUI.push(assignedAttributes);
            });
          }
        }
        this.toggleExpand(comp, true, true);
        comp.AttributesForUI = Utilities.compartmentAttributesConvertoDecimal(
          comp.AttributesForUI
        );
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modRailWagonList });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error in forming Compartment Attributes",
        error
      );
    }
  }

  fillAttributeDetails(modRailDispatch, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modRailDispatch.Attributes = [];
      attributeList.forEach((comp) => {
        const attribute = {
          ListOfAttributeData: [],
        };
        attribute.TerminalCode = comp.TerminalCode;
        comp.attributeMetaDataList.forEach((det) => {
          attribute.ListOfAttributeData.push({
            AttributeCode: det.Code,
            AttributeValue: det.DefaultValue,
          });
        });
        modRailDispatch.Attributes.push(attribute);
      });
      return modRailDispatch;
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on fillAttributeDetails",
        error
      );
    }
  }

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  getTransportationType() {
    let transportationType = Constants.TransportationType.RAIL;
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transportationType = genericProps.transportationType;
    }
    return transportationType;
  }

  getUOMs() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            if (
              Array.isArray(result.EntityResult.VOLUME) &&
              Array.isArray(result.EntityResult.MASS)
            ) {
              const quantityUOMList = [];
              result.EntityResult.VOLUME.forEach((UOM) => {
                quantityUOMList.push(UOM);
              });
              result.EntityResult.MASS.forEach((UOM) => {
                quantityUOMList.push(UOM);
              });
              this.setState({
                quantityUOMOptions:
                  Utilities.transferListtoOptions(quantityUOMList),
              });
            }
            if (Array.isArray(result.EntityResult.DENSITY)) {
              const densityUOMList = [];
              result.EntityResult.DENSITY.forEach((UOM) => {
                densityUOMList.push(UOM);
              });
              this.setState({
                densityUOMOptions:
                  Utilities.transferListtoOptions(densityUOMList),
              });
            }
            if (Array.isArray(result.EntityResult.TEMPERATURE)) {
              const temperatureUOMList = [];
              result.EntityResult.TEMPERATURE.forEach((UOM) => {
                temperatureUOMList.push(UOM);
              });
              this.setState({
                temperatureUOMOptions:
                  Utilities.transferListtoOptions(temperatureUOMList),
              });
            }
          }
        } else {
          console.log("Error in GetUOMList: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in GetUOMList: ", error);
      });
  }

  getRailRouteCodes() {
    axios(
      RestAPIs.GetRailRouteCodes,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const routeCodeOptions = lodash.cloneDeep(
              this.state.routeCodeOptions
            );
            result.EntityResult.forEach((railRouteCode) => {
              routeCodeOptions.push({
                text: railRouteCode,
                value: railRouteCode,
              });
            });
            let routeCodeSearchOptions = lodash.cloneDeep(routeCodeOptions);
            if (
              routeCodeSearchOptions.length > Constants.filteredOptionsCount
            ) {
              routeCodeSearchOptions = routeCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ routeCodeOptions, routeCodeSearchOptions });
          }
        } else {
          console.log("Error in getRailRouteCodes: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getRailRouteCodes: ", error);
      });
  }

  getRailWagonCategory() {
    axios(
      RestAPIs.GetRailWagonCategory,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let railWagonCategoryOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ railWagonCategoryOptions });
          }
        } else {
          console.log("Error in getRailWagonCategory:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getRailWagonCategory:", error);
      });
  }

  getRailWagonCategoryDetails(railWagonCategoryCode, productType, callBack) {
    axios(
      RestAPIs.GetRailWagonCategoryDetails +
      "?RailWagonCategoryCode=" +
      railWagonCategoryCode +
      "&ProductType=" +
      productType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callBack(result.EntityResult);
        } else {
          console.log("Error in getRailWagonCategory: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getRailWagonCategory: ", error);
      });
  }

  getRailWagon(trailerCode, carrierCode, shareholderCode, callBack) {
    const obj = {
      ShareHolderCode: shareholderCode,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: [
        {
          key: KeyCodes.trailerCode,
          value: trailerCode,
        },
        {
          key: KeyCodes.transportationType,
          value: Constants.TransportationType.RAIL,
        },
        {
          key: KeyCodes.carrierCode,
          value: carrierCode,
        },
      ],
    };
    axios(
      RestAPIs.GetRailWagon,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callBack(result.EntityResult);
        } else {
          console.log("Error in GetRailWagon:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railWagon:", error);
      });
  }

  getFinishedProductCodes() {
    axios(
      RestAPIs.GetFinishedProductListForShareholder +
      "?ShareholderCode=" +
      "&TransportationType=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            const finishedProductOptions = result.EntityResult;
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

  getCustomerDestinations() {
    axios(
      RestAPIs.GetCustomerDestinations +
      "?ShareholderCode=" +
      "&TransportationType=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            const customerDestinationOptions = {};
            result.EntityResult.forEach((entity) => {
              customerDestinationOptions[entity.ShareholderCode] =
                entity.CustomerDestinationsList;
            });
            this.setState({ customerDestinationOptions });
          } else {
            console.log("CustomerDestinations not identified for shareholder");
          }
        }
      })
      .catch((error) => {
        console.log("Error while getting Customer List:", error);
      });
  }

  getTankCode(shareholder) {
    axios(
      RestAPIs.GetTanks + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const tankCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let tankCodeSearchOptions = lodash.cloneDeep(tankCodeOptions);
            if (tankCodeSearchOptions.length > Constants.filteredOptionsCount) {
              tankCodeSearchOptions = tankCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({
              tankCodeOptions,
              tankCodeSearchOptions,
            });
          }
        } else {
          console.log("Error in getTankCode:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getTankCode:", error);
      });
  }

  getMeterCode() {
    axios(
      RestAPIs.GetMeters,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const meterCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let meterCodeSearchOptions = lodash.cloneDeep(meterCodeOptions);
            if (
              meterCodeSearchOptions.length > Constants.filteredOptionsCount
            ) {
              meterCodeSearchOptions = meterCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({
              meterCodeOptions,
              meterCodeSearchOptions,
            });
          }
        } else {
          console.log("Error in getMeterCode:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getMeterCode:", error);
      });
  }

  getFinishedProduct(finishedProductCode, shareHolderCode, callback) {
    var keyCode = [
      {
        key: KeyCodes.finishedProductCode,
        value: finishedProductCode,
      },
    ];
    var obj = {
      ShareHolderCode: shareHolderCode,
      keyDataCode: KeyCodes.finishedProductCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetFinishedProduct,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess) {
          callback(result.EntityResult);
        } else {
          console.log("Error in getFinishedProduct:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Finished Product:", error);
      });
  }

  getRailBayAndBcuList() {
    axios(
      RestAPIs.GetRailBayAndBcuList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          const clusterBCUOptions = {};
          const clusterCodeList = [];
          if (
            Array.isArray(result.EntityResult.Table) &&
            result.EntityResult.Table.length > 0
          ) {
            for (let cluster of result.EntityResult.Table) {
              clusterBCUOptions[cluster.Code] = [];
              clusterCodeList.push(cluster.Code);
            }
          }
          if (
            Array.isArray(result.EntityResult.Table1) &&
            result.EntityResult.Table1.length > 0
          ) {
            for (let BCU of result.EntityResult.Table1) {
              if(clusterBCUOptions[BCU.locationCode]!==undefined)
              clusterBCUOptions[BCU.locationCode].push(BCU.Code);
            }
          }
          this.setState({
            clusterBCUOptions,
            clusterCodeOptions:
              Utilities.transferListtoOptions(clusterCodeList),
          });
        } else {
          console.log("Error in getRailBayAndBcuList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getRailBayAndBcuList:", error);
      });
  }

  getLoadingArms(BCUCode, callback) {
    axios(
      RestAPIs.GetLoadingArms + "?bcuCode=" + BCUCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callback(result.EntityResult);
        } else {
          console.log("Error in getLoadingArms:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getLoadingArms:", error);
      });
  }

  getRailLoadSpot(EntityCode, EntityType, callBack) {
    axios(
      RestAPIs.GetRailLoadSpot +
      "?EntityCode=" +
      EntityCode +
      "&EntityType=" +
      EntityType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callBack(result.EntityResult);
        } else {
          console.log("Error in getRailLoadSpot: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getRailLoadSpot: ", error);
      });
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
        } else {
          console.log("Error in getRailLoadSpotDevices: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getRailLoadSpotDevices: ", error);
      });
  }

  getCarrierCompanyCodes(shareholderCode) {
    axios(
      RestAPIs.GetCarrierCodes +
      "?ShareholderCode=" +
      shareholderCode +
      "&TransportationType=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            this.setState({
              carrierCodeOptions: Utilities.transferListtoOptions(
                result.EntityResult
              ),
            });
          }
        } else {
          console.log("Error in getCarrierCompanyCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getTrailerCodes(carrierCode) {
    axios(
      RestAPIs.GetRailWagonCodes +
      "?CarrierCompanyCode=" +
      carrierCode +
      "&TransportationType=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult.RailWagonList)
          ) {
            this.setState({
              trailerCodeOptions: Utilities.transferListtoOptions(
                result.EntityResult.RailWagonList
              ),
            });
          } else {
            this.setState({ trailerCodeOptions: [] });
          }
        } else {
          console.log("Error in getTrailerCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getTrailerCodes: ", error);
      });
  }

  getWeightBridgeData() {
    axios(
      RestAPIs.GetWeightBridgeData +
      "?TransportationType=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.Table !== undefined &&
            Array.isArray(result.EntityResult.Table)
          ) {
            const weightBridgeList = [];
            const weightBridgeSetting = {};
            for (let item of result.EntityResult.Table) {
              weightBridgeList.push(item.Code);
              weightBridgeSetting[item.Code] = item;
            }
            this.setState({
              weightBridgeOptions:
                Utilities.transferListtoOptions(weightBridgeList),
              weightBridgeSetting,
            });
          } else {
            this.setState({
              weightBridgeOptions: [],
              weightBridgeSetting: {},
            });
          }
        } else {
          console.log("Error in getWeightBridgeData: ", result.ErrorList);
          this.setState({
            weightBridgeOptions: [],
            weightBridgeSetting: {},
          });
        }
      })
      .catch((error) => {
        console.log("Error while getWeightBridgeData: ", error);
      });
  }

  getRailDispatchWeighBridgeData(railDispatch, callBack) {
    const keyCode = [
      {
        key: "TransactionType",
        value: "Dispatch",
      },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.RAIL,
      },
      {
        key: "DispatchReceiptCode",
        value: railDispatch.DispatchCode,
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
          this.setWagonDetailsFromDispatch(
            railDispatch,
            result.EntityResult.Table,
            callBack
          );
        } else {
          this.setState({
            weightBridgeData: [],
            modWeightBridgeData: [],
          });
          this.setWagonDetailsFromDispatch(railDispatch, [], callBack);
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

  getWagonHseInspectionStatus(dispatchCode, shareholder) {
    axios(
      RestAPIs.GetWagonHseInspectionStatus +
      "?TransactionType=Dispatch" +
      "&DispatchReceiptCode=" +
      dispatchCode +
      "&ShareholderCode=" +
      shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (
          result.IsSuccess === true ||
          result.EntityResult !== null ||
          Array.isArray(result.EntityResult.Table)
        ) {
          const modWagonDetails = lodash.cloneDeep(this.state.modWagonDetails);
          for (let item of result.EntityResult.Table) {
            for (let wagonDetail of modWagonDetails) {
              if (wagonDetail.TrailerCode === item.Code) {
                wagonDetail.HSEInspectionStatus = item.HseInspectionStatus;
                break;
              }
            }
          }
          this.setState({ modWagonDetails });
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

  getContractCodes(shareholder) {
    axios(
      RestAPIs.GetContractCodes +
      "?ShareholderCode=" +
      shareholder +
      "&TransportationType=" +
      Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true || Array.isArray(result.EntityResult)) {
          this.setState({
            contractCodeOptions: Utilities.transferListtoOptions(
              result.EntityResult
            ),
          });
        } else {
          console.log("Error in getContractCodes: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getContractCodes: ", error);
      });
  }

  getRailDispatch(selectedRow, isUpdateOperation = false) {
    const transportationType = this.getTransportationType();
    emptyRailDispatch.TransportationType = transportationType;
    const emptyLoadingDataInfo = {
      CommonInfo: lodash.cloneDeep(emptyRailMarineTransactionCommonInfo),
      TransactionFPinfo: lodash.cloneDeep(
        emptyRailMarineTransactionProductInfo
      ),
      ArrTransactionBP: [],
      ArrTransactionAdditive: [],
      IsLocalLoaded: false,
    };

    emptyRailDispatch.QuantityUOM =
      this.props.userDetails.EntityResult.PageAttibutes.DefaultQtyUOMForTransactionUI.RAIL;

    if (selectedRow.Common_Code === undefined) {
      if (this.props.shipmentSource !== undefined) {
        emptyRailDispatch.CreatedFromEntity = this.props.shipmentSource;
      } else emptyRailDispatch.CreatedFromEntity = 0;
      let modAssociations = [];
      if (
        this.props.shipmentSource !== undefined &&
        !this.props.shipmentSourceFromSummary
      ) {
        modAssociations = this.getDispatchCompartmentDetails();
      }
      if (
        this.props.shipmentSource !== undefined &&
        this.props.shipmentSourceFromSummary
      )
        this.getCompartmentFromOtherSource(this.props.selectedSourceCode);

      this.setState(
        {
          railDispatch: lodash.cloneDeep(emptyRailDispatch),
          modRailDispatch: lodash.cloneDeep(emptyRailDispatch),
          modAssociations: modAssociations,
          loadingDataInfo: lodash.cloneDeep(emptyLoadingDataInfo),
          isReadyToRender: true,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRailDispatch
          ),
          compartmentSaveEnabled: false,
          railRouteData: {
            DestinationCode: "",
            DepartureTime: "",
          },
          expandedWagonRows: [],
          tabActiveIndex: 0,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false) {
            this.localNodeAttribute();
          }
          if (this.state.isOpenSubPage) {
            this.handleSubPageBackOnClick();
          }
        }
      );
      return;
    }
    const keyCode = [
      {
        key: KeyCodes.railDispatchCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailDispatch,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (isUpdateOperation) {
            this.props.onUpdateStatusOperation(result.EntityResult);
          }
          emptyLoadingDataInfo.CommonInfo.LoadingType = Utilities.getKeyByValue(
            Constants.LoadingDetailsType,
            1
          );
          emptyLoadingDataInfo.CommonInfo.TransactionType = "DISPATCH";
          emptyLoadingDataInfo.CommonInfo.TransportationType =
            Constants.TransportationType.RAIL;
          emptyLoadingDataInfo.CommonInfo.DispatchCode =
            result.EntityResult.DispatchCode;
          emptyLoadingDataInfo.CommonInfo.IsBonded =
            result.EntityResult.IsBonded;
          // this.props.saveAcutalTerminalCode(
          //   result.EntityResult.ActualTerminalCode
          // );
          this.getRailDispatchWeighBridgeData(result.EntityResult, () => {
            this.getWagonHseInspectionStatus(
              selectedRow.Common_Code,
              this.props.selectedShareholder
            );
            this.setState(
              {
                isReadyToRender: this.props.subPageName === "",
                railDispatch: result.EntityResult,
                modRailDispatch: lodash.cloneDeep(result.EntityResult),
                modAssociations: this.getAssociationsFromDispatch(
                  result.EntityResult
                ),
                loadingDataInfo: lodash.cloneDeep(emptyLoadingDataInfo),
                saveEnabled:
                  (Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.modify,
                    fnRailDispatch
                  ) &&
                    result.EntityResult.DispatchStatus ===
                    Constants.Shipment_Status.READY) ||
                  this.props.currentAccess.ViewRailDispatch_Update,
                compartmentSaveEnabled: this.checkCompartmentSaveEnabled(
                  result.EntityResult.DispatchCompartmentPlanList
                ),
                expandedWagonRows: [],
                tabActiveIndex: this.props.isDisplayDetails
                  ? 1
                  : this.state.tabActiveIndex,
              },
              () => {
                this.getKPIList(result.EntityResult.DispatchCode)
                if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                  this.terminalSelectionChange(
                    result.EntityResult.TerminalCodes
                  );
                } else {
                  this.localNodeAttribute();
                }
                if (this.props.subPageName === "") {
                  this.getRailRoute(result.EntityResult.RouteCode);
                } else {
                  this.handleOpenSubPage(this.props.subPageName, true);
                }
              }
            );
          });
        } else {
          this.setState({
            railDispatch: lodash.cloneDeep(emptyRailDispatch),
            modRailDispatch: lodash.cloneDeep(emptyRailDispatch),
            loadingDataInfo: lodash.cloneDeep(emptyLoadingDataInfo),
            isReadyToRender: true,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnRailDispatch
            ),
          });
          console.log("Error in railDispatch: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railDispatch: ", error);
      });
  }

  getDispatchCompartmentDetails() {
    let dispatchAssociations = [];
    if (
      this.props.shipmentSource !== undefined &&
      !this.props.shipmentSourceFromSummary
    ) {
      let cusCode = this.props.shipmentSourceDetails.CustomerCode;
      if (Array.isArray(this.props.shipmentSourceCompartmentItems)) {
        for (
          let i = 0;
          i < this.props.shipmentSourceCompartmentItems.length;
          i++
        ) {
          let dispatchCompartment = {};
          let item = this.props.shipmentSourceCompartmentItems[i];
          if (item.RemainingQuantity !== null && item.RemainingQuantity > 0) {
            dispatchCompartment = {
              PlannedQuantity:
                item.RemainingQuantity !== null && item.RemainingQuantity !== ""
                  ? item.RemainingQuantity.toLocaleString()
                  : null,
              UOM: item.QuantityUOM,
              ContractCode: this.props.shipmentSourceDetails.ContractCode,
              CustomerCode: cusCode,
              DestinationCode: item.DestinationCode,
              FinishedProductCode: item.FinishedProductCode,
              ShareholderCode: this.props.selectedShareholder,
              PlannedNoOfRailWagons: null,
            };
            dispatchAssociations.push(dispatchCompartment);
          }
        }
        dispatchAssociations =
          Utilities.addSeqNumberToListObject(dispatchAssociations);
      }
    } else if (
      this.props.shipmentSource !== undefined &&
      this.props.shipmentSourceFromSummary
    ) {
      let contractData = lodash.cloneDeep(this.state.contractData);
      if (Array.isArray(contractData)) {
        contractData.forEach((data) => {
          let cusCode = data.CustomerCode;
          for (let i = 0; i < data.ContractItems.length; i++) {
            let dispatchCompartment = {};
            let item = data.ContractItems[i];
            if (item.RemainingQuantity !== null && item.RemainingQuantity > 0) {
              dispatchCompartment = {
                PlannedQuantity:
                  item.RemainingQuantity !== null &&
                    item.RemainingQuantity !== ""
                    ? item.RemainingQuantity.toLocaleString()
                    : null,
                UOM: item.QuantityUOM,
                ContractCode: data.ContractCode,
                CustomerCode: cusCode,
                DestinationCode: item.DestinationCode,
                FinishedProductCode: item.FinishedProductCode,
                ShareholderCode: this.props.selectedShareholder,
                PlannedNoOfRailWagons: null,
              };
              dispatchAssociations.push(dispatchCompartment);
            }
          }
        });
        dispatchAssociations =
          Utilities.addSeqNumberToListObject(dispatchAssociations);
        this.setState({ modAssociations: dispatchAssociations });
      }
    }
    return dispatchAssociations;
  }

  getCompartmentFromOtherSource(items) {
    var obj = [];
    var shCode = this.props.selectedShareholder;
    items.forEach((code) => {
      var keyData = {
        keyDataCode: 0,
        ShareHolderCode: shCode,
        KeyCodes: [{ Key: KeyCodes.contractCode, Value: code }],
      };
      obj.push(keyData);
    });

    axios(
      RestAPIs.GetContractList,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    ).then((response) => {
      let result = response.data;
      if (result.IsSuccess === true) {
        this.setState({ contractData: result.EntityResult }, () => {
          this.getDispatchCompartmentDetails();
        });
      } else {
        this.setState({ contractData: [] });
      }
    });
  }

  checkManualEntryEnabled(wagonDetails) {
    for (let item of wagonDetails) {
      if (
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.EMPTY ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.PART_FILLED ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.INTERRUPTED
      ) {
        return item.TrailerCode;
      }
    }
    return "";
  }

  checkCompartmentSaveEnabled(compartmentPlanList) {
    if (compartmentPlanList === null) {
      return false;
    }
    for (let item of compartmentPlanList) {
      const adjustedQtyEnable = !(
        this.props.currentAccess.ViewRailDispatch_EditAccess === false ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.LOADING ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.FORCE_COMPLETED ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.COMPLETED ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.OVER_FILLED ||
        this.props.currentAccess.ViewRailDispatch_DisableAdjustPlanQty ||
        item.FinishedProductCode === null ||
        item.FinishedProductCode === ""
      );
      const forceCompleteEnable = !(
        this.props.currentAccess.ViewRailDispatch_EditAccess === false ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.LOADING ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.FORCE_COMPLETED ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.COMPLETED ||
        item.DispatchCompartmentStatus ===
        Constants.ShipmentCompartmentStatus.OVER_FILLED ||
        this.props.currentAccess.ViewRailDispatch_DisableWagonForceClose ||
        item.FinishedProductCode === null ||
        item.FinishedProductCode === ""
      );
      if (adjustedQtyEnable && forceCompleteEnable) {
        return true;
      }
    }
    return false;
  }

  getRailRoute(routeCode) {
    const transportationType = this.getTransportationType();
    const keyCode = [
      {
        key: KeyCodes.railRouteCode,
        value: routeCode,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.railRouteCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailRoute,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            const railRouteData = lodash.cloneDeep(this.state.railRouteData);
            railRouteData.DestinationCode = result.EntityResult.DestinationCode;
            railRouteData.DepartureTime = new Date(
              result.EntityResult.DepartureTime
            ).toLocaleTimeString();
            this.setState({ railRouteData });
          }
        } else {
          console.log("Error in GetRailRoute:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railRoute:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modRailDispatch = lodash.cloneDeep(this.state.modRailDispatch);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      modRailDispatch[propertyName] = data;
      if (propertyName === "Active") {
        if (data !== this.state.railDispatch.Active) {
          modRailDispatch.Remarks = "";
        }
        // this.handleActiveStatusChange(data);
      } else if (propertyName === "RouteCode") {
        this.getRailRoute(data);
      }
      this.setState({ modRailDispatch });
      if (railDispatchValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          railDispatchValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occurred on handleChange",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      const modRailDispatch = lodash.cloneDeep(this.state.modRailDispatch);
      validationErrors[propertyName] = error;
      modRailDispatch[propertyName] = value;
      this.setState({ validationErrors, modRailDispatch });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleDateTextChange",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    const modAssociations = lodash.cloneDeep(this.state.modAssociations);

    modAssociations[cellData.rowIndex][cellData.field] = newVal;

    if (cellData.field === "ShareholderCode") {
      modAssociations[cellData.rowIndex].FinishedProductCode = "";
      modAssociations[cellData.rowIndex].CustomerCode = "";
      modAssociations[cellData.rowIndex].DestinationCode = "";
    } else if (cellData.field === "CustomerCode") {
      const customerDestinationOptions = lodash.cloneDeep(
        this.state.customerDestinationOptions
      );
      if (
        customerDestinationOptions[
        modAssociations[cellData.rowIndex].ShareholderCode
        ] !== undefined &&
        customerDestinationOptions[
        modAssociations[cellData.rowIndex].ShareholderCode
        ] !== null
      ) {
        const customerDestinationList =
          customerDestinationOptions[
          modAssociations[cellData.rowIndex].ShareholderCode
          ];
        if (
          customerDestinationList[newVal] !== undefined &&
          Array.isArray(customerDestinationList[newVal]) &&
          customerDestinationList[newVal].length === 1
        ) {
          modAssociations[cellData.rowIndex].DestinationCode =
            customerDestinationList[newVal][0];
        } else {
          modAssociations[cellData.rowIndex].DestinationCode = "";
        }
      }
    } else if (
      (cellData.field === "FinishedProductCode" ||
        cellData.field === "RailWagonCategory") &&
      modAssociations[cellData.rowIndex].FinishedProductCode !== null &&
      modAssociations[cellData.rowIndex].RailWagonCategory !== null
    ) {
      this.getFinishedProduct(
        modAssociations[cellData.rowIndex].FinishedProductCode,
        modAssociations[cellData.rowIndex].ShareholderCode,
        (entityResult) => {
          this.getRailWagonCategoryDetails(
            modAssociations[cellData.rowIndex].RailWagonCategory,
            entityResult.ProductType,
            (entityResult) => {
              modAssociations[cellData.rowIndex].PlannedQuantity = parseFloat(
                entityResult.MaxLoadableWeight
              );
              this.setState({ modAssociations });
            }
          );
        }
      );
      return;
    }

    this.setState({ modAssociations });
  };

  handleWagonCellDataEditOld = (newVal, fieldName, rowData) => {
    const modWagonDetails = lodash.cloneDeep(this.state.modWagonDetails);
    const expandedWagonRows = lodash.cloneDeep(this.state.expandedWagonRows);
    let isSave = "";
    if (fieldName === "ForceComplete" && newVal === true) {
      const modalData = lodash.cloneDeep(this.state.modalData);
      modalData.forceCompleteCompartment.isOpen = true;
      modalData.forceCompleteCompartment.data.trailerCode = rowData.TrailerCode;
      isSave = true;
      this.setState({ modalData });
      //return;
    } else {
      isSave = false;
    }

    for (let item of modWagonDetails) {
      if (item.TrailerCode === rowData.TrailerCode) {
        item[fieldName] = newVal;
        if (isSave !== "") {
          item.isSave = isSave;
        }
        break;
      }
    }
    for (let item of expandedWagonRows) {
      if (item.TrailerCode === rowData.TrailerCode) {
        item[fieldName] = newVal;
        break;
      }
    }

    this.setState({ modWagonDetails, expandedWagonRows });
  };

  handleWagonCellDataEdit = (newVal, cellData) => {
    const modWagonDetails = lodash.cloneDeep(this.state.modWagonDetails);
    const expandedWagonRows = lodash.cloneDeep(this.state.expandedWagonRows);
    let isSave = "";
    if (cellData.field === "ForceComplete" && newVal === true) {
      const modalData = lodash.cloneDeep(this.state.modalData);
      modalData.forceCompleteCompartment.isOpen = true;
      modalData.forceCompleteCompartment.data.trailerCode =
        cellData.rowData.TrailerCode;
      isSave = true;
      this.setState({ modalData });
      //return;
    } else {
      isSave = false;
    }

    for (let item of modWagonDetails) {
      if (item.TrailerCode === cellData.rowData.TrailerCode) {
        item[cellData.field] = newVal;
        if (isSave !== "") {
          item.isSave = isSave;
        }
        break;
      }
    }
    for (let item of expandedWagonRows) {
      if (item.TrailerCode === cellData.rowData.TrailerCode) {
        item[cellData.field] = newVal;
        break;
      }
    }

    this.setState({ modWagonDetails, expandedWagonRows });
  };

  handleForceCompleteCompartment = () => {
    const modWagonDetails = lodash.cloneDeep(this.state.modWagonDetails);
    const expandedWagonRows = lodash.cloneDeep(this.state.expandedWagonRows);
    const modalData = lodash.cloneDeep(this.state.modalData);

    for (let item of modWagonDetails) {
      if (
        item.TrailerCode === modalData.forceCompleteCompartment.data.trailerCode
      ) {
        item.ForceComplete = true;
        break;
      }
    }
    for (let item of expandedWagonRows) {
      if (
        item.TrailerCode === modalData.forceCompleteCompartment.data.trailerCode
      ) {
        item.ForceComplete = true;
        break;
      }
    }
    modalData.forceCompleteCompartment.isOpen = false;

    this.setState({ modWagonDetails, expandedWagonRows, modalData });
  };

  handleAssociationSelectionChange = (e) => {
    this.setState({ selectedAssociations: e });
  };

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        const modAssociations = lodash.cloneDeep(this.state.modAssociations);
        const newComp = {
          LoadedQuantity: null,
          LoadedQuantityUOM: null,
          DispatchCode: null,
          ShareholderCode: null,
          CustomerCode: null,
          ContractCode: null,
          DestinationCode: null,
          FinishedProductCode: null,
          RailWagonCategory: null,
          PlannedNoOfRailWagons: null,
          PlannedQuantity: 0,
          AdjustedPlanQuantity: null,
          QuantityUOM: null,
          AssociatedOrderItems: null,
          AssociatedContractItems: null,
          Attributes: [],
        };
        newComp.SeqNumber = Utilities.getMaxSeqNumberfromListObject(
          this.state.modAssociations
        );
        newComp.ShareholderCode = this.props.selectedShareholder;
        modAssociations.push(newComp);

        this.setState(
          {
            modAssociations,
            selectedAssociations: [],
          },
          () => {
            if (
              this.props.userDetails.EntityResult.IsEnterpriseNode === false
            ) {
              const attributeMetaDataList = lodash.cloneDeep(
                this.state.compartmentAttributeMetaDataList
              );
              if (attributeMetaDataList.length > 0)
                this.formCompartmentAttributes([
                  attributeMetaDataList[0].TerminalCode,
                ]);
            } else {
              this.formCompartmentAttributes(
                this.state.modRailDispatch.TerminalCodes
              );
            }
          }
        );
      } catch (error) {
        console.log(
          "RailDispatchDetailsComposite:Error occurred on handleAddAssociation",
          error
        );
      }
    }
  };

  handleDeleteAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedAssociations != null &&
          this.state.selectedAssociations.length > 0
        ) {
          if (this.state.modAssociations.length > 0) {
            let modAssociations = lodash.cloneDeep(this.state.modAssociations);

            this.state.selectedAssociations.forEach((obj, index) => {
              modAssociations = modAssociations.filter((com, cindex) => {
                return com.SeqNumber !== obj.SeqNumber;
              });
            });

            this.setState({ modAssociations });
          }
        }

        this.setState({ selectedAssociations: [] });
      } catch (error) {
        console.log(
          "RailDispatchDetailsComposite:Error occurred on handleDeleteAssociation",
          error
        );
      }
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      const terminalCodes = lodash.cloneDeep(this.props.terminalCodes);
      const modRailDispatch = lodash.cloneDeep(this.state.modRailDispatch);
      if (checked) modRailDispatch.TerminalCodes = [...terminalCodes];
      else modRailDispatch.TerminalCodes = [];
      this.terminalSelectionChange(modRailDispatch.TerminalCodes);
      this.setState({ modRailDispatch });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occurred on handleAllTerminalsChange",
        error
      );
    }
  };

  validateSave(modRailDispatch, attributeList) {
    const validationErrors = lodash.cloneDeep(this.state.validationErrors);

    Object.keys(railDispatchValidationDef).forEach(function (key) {
      if (modRailDispatch[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          railDispatchValidationDef[key],
          modRailDispatch[key]
        );
      }
    });

    if (modRailDispatch.Active !== this.state.railDispatch.Active) {
      if (modRailDispatch.Remarks === null || modRailDispatch.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      } else {
        validationErrors["Remarks"] = "";
      }
    }

    const attributeValidationErrors = lodash.cloneDeep(
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

    let returnValue = true;
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

    if (returnValue) {
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
    } else {
      return returnValue;
    }

    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [],
    };

    if (
      Array.isArray(modRailDispatch.DispatchItemPlanList) &&
      modRailDispatch.DispatchItemPlanList.length > 0
    ) {
      const railDispatchCompartmentDefMod = lodash.cloneDeep(
        railDispatchCompartmentDef
      );

      modRailDispatch.DispatchItemPlanList.forEach((railDispatchComp) => {
        if (
          modRailDispatch.CreatedFromEntity === Constants.shipmentFrom.Contract
        ) {
          let err = "";
          if (
            Array.isArray(railDispatchComp.AssociatedContractItems) &&
            railDispatchComp.AssociatedContractItems.length > 0
          ) {
            const shipOrder = railDispatchComp.AssociatedContractItems[0];
            if (
              shipOrder === null ||
              shipOrder.ContractCode === undefined ||
              shipOrder.ContractCode === null ||
              shipOrder.ContractCode === ""
            ) {
              err = "Contract_Code_Empty";
            }
          } else {
            err = "Contract_Code_Empty";
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: [
                "RailDispatchPlanDetail_DispatchCode",
                "RailDispatchPlanDetail_ContractCode",
              ],
              keyValues: [
                modRailDispatch.DispatchCode,
                railDispatchComp.ContractCode,
              ],
              isSuccess: false,
              errorMessage: err,
            });
          }
        }

        railDispatchCompartmentDefMod.forEach((col) => {
          let err = "";
          if (
            col.field === "PlannedQuantity" &&
            this.props.railLookUpData.PlanType === "2"
          )
            return;
          if (col.validator !== undefined) {
            err = Utilities.validateField(
              col.validator,
              railDispatchComp[col.field]
            );
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: [
                "RailDispatchPlanDetail_DispatchCode",
                col.displayName,
              ],
              keyValues: [
                modRailDispatch.DispatchCode,
                railDispatchComp[col.field],
              ],
              isSuccess: false,
              errorMessage: err,
            });
          }
        });

        let updatedAttributes = [];
        if (
          railDispatchComp.AttributesForUI !== null &&
          railDispatchComp.AttributesForUI !== undefined
        ) {
          updatedAttributes = railDispatchComp.AttributesForUI.filter(
            (uIAttributes) => {
              return railDispatchComp.Attributes.some((selAttribute) => {
                const isPresent =
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
            }
          );
        }

        updatedAttributes.forEach((item) => {
          const errMsg = Utilities.valiateAttributeField(
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
                  railDispatchComp.SeqNumber,
                  item.TerminalCode,
                  item.AttributeValue,
                ],
                isSuccess: false,
                errorMessage: errMsg,
              });
            } else {
              notification.messageResultDetails.push({
                keyFields: ["CompAttributeComp", item.AttributeName],
                keyValues: [railDispatchComp.SeqNumber, item.AttributeValue],
                isSuccess: false,
                errorMessage: errMsg,
              });
            }
          }
        });
        this.toggleExpand(railDispatchComp, true, true);

        delete railDispatchComp.AttributesForUI;
        delete railDispatchComp.SeqNumber;
      });
    } else {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRORMSG_RAILDISPATCH_PLAN_EMPTY",
      });
    }

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(modRailDispatch, "update", notification);
      return false;
    }
    return returnValue;
  }

  saveRailDispatch = () => {
    this.handleAuthenticationClose();
    try {
      this.setState({ saveEnabled: false });
      let tempRailDispatch = lodash.cloneDeep(this.state.tempRailDispatch);

      this.state.railDispatch.DispatchCode === ""
      ? this.createRailDispatch(tempRailDispatch)
      : this.updateRailDispatch(tempRailDispatch);
    } catch (error) {
      console.log("RailShipComposite : Error in addUpdateRailDispatch");
    }
  };

  handleSave = () => {
    try {
    //  this.setState({ saveEnabled: false });
      let modRailDispatch = lodash.cloneDeep(this.state.modRailDispatch);
      modRailDispatch.DispatchItemPlanList =
        this.getCompartmentsFromAssociations(this.state.modAssociations);

      const attributeList = Utilities.attributesConverttoLocaleString(
        this.state.selectedAttributeList
      );
      if (this.validateSave(modRailDispatch, attributeList)) {
        modRailDispatch = this.fillAttributeDetails(
          modRailDispatch,
          attributeList
        );
        modRailDispatch.DispatchItemPlanList.forEach((compart) => {
          compart.PlannedNoOfRailWagons =
            compart.PlannedNoOfRailWagons === null
              ? null
              : Utilities.convertStringtoDecimal(compart.PlannedNoOfRailWagons);
          compart.PlannedQuantity = Utilities.convertStringtoDecimal(
            compart.PlannedQuantity
          );
          compart.AdjustedPlanQuantity = Utilities.convertStringtoDecimal(
            compart.PlannedQuantity
          );
          if (
            compart.AssociatedContractItems !== null &&
            compart.AssociatedContractItems !== undefined &&
            compart.AssociatedContractItems.length > 0
          ) {
            if (Array.isArray(compart.AssociatedContractItems)) {
              compart.AssociatedContractItems.forEach((contract) => {
                contract.ContractItemQuantity =
                  compart.PlannedQuantity !== null &&
                    compart.PlannedQuantity !== ""
                    ? Utilities.convertStringtoDecimal(compart.PlannedQuantity)
                    : null;
                contract.PlannedNoOfRailWagons = compart.PlannedNoOfRailWagons;
              });
            }
          }
          if (
            compart.AttributesForUI !== undefined &&
            compart.AttributesForUI != null
          ) {
            compart.AttributesForUI =
              Utilities.compartmentAttributesDatatypeConversion(
                compart.AttributesForUI
              );
          }
          if (
            compart.Attributes !== undefined &&
            compart.Attributes != null &&
            compart.Attributes.length > 0
          ) {
            compart.Attributes =
              Utilities.compartmentAttributesDatatypeConversion(
                compart.Attributes
              );
          }
        });
       
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempRailDispatch = lodash.cloneDeep(modRailDispatch);
      this.setState({ showAuthenticationLayout, tempRailDispatch }, () => {
        if (showAuthenticationLayout === false) {
          this.saveRailDispatch();
        }
    });
    
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleSave",
        error
      );
    }
  };

  handleReset = () => {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      const railDispatch = lodash.cloneDeep(this.state.railDispatch);

      if (railDispatch.DispatchStatus !== "READY") {
        this.getRailDispatch({ Common_Code: railDispatch.DispatchCode }, true);
        return;
      }

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });

      if (railDispatch.RouteCode) {
        this.setState(
          {
            modRailDispatch: railDispatch,
            modAssociations: this.getAssociationsFromDispatch(railDispatch),
            validationErrors,
          },
          () => {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.terminalSelectionChange(railDispatch.TerminalCodes);
              this.handleResetAttributeValidationError();
            } else {
              this.localNodeAttribute();
              this.handleResetAttributeValidationError();
            }
          }
        );
        this.getRailRoute(railDispatch.RouteCode);
      } else {
        this.setState(
          {
            modRailDispatch: railDispatch,
            modAssociations: this.getAssociationsFromDispatch(railDispatch),
            validationErrors,
            railRouteData: {
              DestinationCode: "",
              DepartureTime: "",
            },
          },
          () => {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              this.terminalSelectionChange(railDispatch.TerminalCodes);
              this.handleResetAttributeValidationError();
            } else {
              this.localNodeAttribute();
              this.handleResetAttributeValidationError();
            }
          }
        );
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleReset",
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
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(attributeMetaDataList),
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleResetAttributeValidationError",
        error
      );
    }
  }

  toggleExpand = (data, open, isTerminalAdded = false) => {
    let expandedRows = lodash.cloneDeep(this.state.expandedRows);
    const expandedRowIndex = expandedRows.findIndex(
      (item) => item.SeqNumber === data.SeqNumber
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
          (x) => x.Code !== data.Code && x.SeqNumber !== data.SeqNumber
        );
      } else expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };

  toggleWagonExpand = (data, open) => {
    let expandedWagonRows = lodash.cloneDeep(this.state.expandedWagonRows);
    let expandedRowIndex = expandedWagonRows.findIndex(
      (item) => item.TrailerCode === data.TrailerCode
    );
    if (open) {
      expandedWagonRows.splice(expandedRowIndex, 1);
    } else {
      expandedWagonRows.push(data);
    }
    this.setState({ expandedWagonRows });
  };

  createRailDispatch(modRailDispatch) {
    const keyCode = [
      {
        key: KeyCodes.railDispatchCode,
        value: modRailDispatch.DispatchCode,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: keyCode,
      Entity: modRailDispatch,
    };
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateRailDispatch,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getRailDispatch(
            { Common_Code: modRailDispatch.DispatchCode },
            true
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
        }
        this.props.onSaved(this.state.modRailDispatch, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRailDispatch
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailDispatch, "add", notification);
      });
  }

  updateRailDispatch(modRailDispatch) {
    const keyCode = [
      {
        key: KeyCodes.railDispatchCode,
        value: modRailDispatch.DispatchCode,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: keyCode,
      Entity: modRailDispatch,
    };
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateRailDispatch,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getRailDispatch({ Common_Code: modRailDispatch.DispatchCode });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
          //console.log("Error in CreateRailDispatch:", result.ErrorList);
        }
        this.props.onSaved(modRailDispatch, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRailDispatch
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailDispatch, "modify", notification);
      });
  }

  updateRailDispatchCompartmentInfo(dispatchCompartmentDataList) {
    const keyCode = [
      {
        key: "DispatchCode",
        value: this.state.modRailDispatch.DispatchCode,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: "DispatchCode",
      KeyCodes: keyCode,
      Entity: dispatchCompartmentDataList,
    };
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [this.state.modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateRailDispatchCompartInfo,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getRailDispatch(
            { Common_Code: this.state.modRailDispatch.DispatchCode },
            true
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true, // TODO
          });
          //console.log("Error in CreateRailDispatch:", result.ErrorList);
        }
        this.props.onNotify(notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true, // TODO
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onNotify(notification);
      });
  }

  getAssociationsFromDispatch(railDispatch) {
    let dispatchAssociations = [];
    if (Array.isArray(railDispatch.DispatchItemPlanList)) {
      railDispatch.DispatchItemPlanList.forEach((dispatchCompartment) => {
        dispatchAssociations.push({
          LoadedQuantity: dispatchCompartment.LoadedQuantity,
          LoadedQuantityUOM: dispatchCompartment.LoadedQuantityUOM,
          DispatchCode: dispatchCompartment.DispatchCode,
          ShareholderCode: dispatchCompartment.ShareholderCode,
          CustomerCode: dispatchCompartment.CustomerCode,
          DestinationCode: dispatchCompartment.DestinationCode,
          FinishedProductCode: dispatchCompartment.FinishedProductCode,
          RailWagonCategory: dispatchCompartment.RailWagonCategory,
          PlannedNoOfRailWagons: dispatchCompartment.PlannedNoOfRailWagons,
          PlannedQuantity:
            dispatchCompartment.PlannedQuantity !== null &&
              dispatchCompartment.PlannedQuantity !== ""
              ? dispatchCompartment.PlannedQuantity.toLocaleString()
              : null,
          AdjustedPlanQuantity:
            dispatchCompartment.AdjustedPlanQuantity !== null &&
              dispatchCompartment.AdjustedPlanQuantity !== ""
              ? dispatchCompartment.AdjustedPlanQuantity.toLocaleString()
              : null,
          QuantityUOM: dispatchCompartment.QuantityUOM,
          ContractCode:
            dispatchCompartment.AssociatedContractItems != null
              ? dispatchCompartment.AssociatedContractItems[0].ContractCode
              : null,
          AssociatedOrderItems: dispatchCompartment.AssociatedOrderItems,
          AssociatedContractItems: dispatchCompartment.AssociatedContractItems,
          Attributes: dispatchCompartment.Attributes,
        });
      });
    }
    dispatchAssociations =
      Utilities.addSeqNumberToListObject(dispatchAssociations);
    return dispatchAssociations;
  }

  getCompartmentsFromAssociations(modAssociations) {
    const dispatchCompartments = [];
    if (Array.isArray(modAssociations)) {
      modAssociations.forEach((modAssociation) => {
        if (
          !(
            modAssociation.FinishedProductCode === null ||
            modAssociation.FinishedProductCode === ""
          ) ||
          !(
            modAssociation.CustomerCode === null ||
            modAssociation.CustomerCode === ""
          ) ||
          !(
            modAssociation.DestinationCode === null ||
            modAssociation.DestinationCode === ""
          )
        ) {
          let selectedTerminals = [];
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            selectedTerminals = lodash.cloneDeep(
              this.state.modRailDispatch.TerminalCodes
            );
            if (selectedTerminals == null) {
              selectedTerminals = [];
            }
          } else {
            const compAttributeMetaDataList = lodash.cloneDeep(
              this.state.compartmentAttributeMetaDataList
            );
            if (compAttributeMetaDataList.length > 0) {
              selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
            }
          }
          let terminalAttributes = [];
          modAssociation.Attributes = [];
          selectedTerminals.forEach((terminal) => {
            if (
              modAssociation.AttributesForUI !== null &&
              modAssociation.AttributesForUI !== undefined
            ) {
              terminalAttributes = modAssociation.AttributesForUI.filter(
                (attTerminal) => {
                  return attTerminal.TerminalCode === terminal;
                }
              );
            }

            const attribute = {
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
            ) {
              modAssociation.Attributes.push(attribute);
            }
          });

          dispatchCompartments.push({
            LoadedQuantity: modAssociation.LoadedQuantity,
            LoadedQuantityUOM: modAssociation.LoadedQuantityUOM,
            DispatchCode: this.state.modRailDispatch.DispatchCode,
            ShareholderCode: modAssociation.ShareholderCode,
            CustomerCode: modAssociation.CustomerCode,
            DestinationCode: modAssociation.DestinationCode,
            FinishedProductCode: modAssociation.FinishedProductCode,
            RailWagonCategory: modAssociation.RailWagonCategory,
            PlannedNoOfRailWagons: modAssociation.PlannedNoOfRailWagons,
            PlannedQuantity: modAssociation.PlannedQuantity,
            AdjustedPlanQuantity: modAssociation.PlannedQuantity,
            QuantityUOM: this.state.modRailDispatch.QuantityUOM,
            AssociatedContractItems:
              modAssociation.ContractCode === null
                ? null
                : [
                  {
                    ContractCode: modAssociation.ContractCode,
                    ShareholderCode: modAssociation.ShareholderCode,
                    ContractItemQuantity:
                      modAssociation.PlannedQuantity !== null &&
                        modAssociation.PlannedQuantity !== ""
                        ? modAssociation.PlannedQuantity
                        : null,
                    QuantityUOM: this.state.modRailDispatch.QuantityUOM,
                    FinishedProductCode: modAssociation.FinishedProductCode,
                    Destination: modAssociation.DestinationCode,
                    RailWagonCategory: modAssociation.RailWagonCategory,
                    PlannedNoOfRailWagons:
                      modAssociation.PlannedNoOfRailWagons,
                  },
                ],
            AssociatedOrderItems: modAssociation.AssociatedOrderItems,
            Attributes: modAssociation.Attributes,
            AttributesForUI: modAssociation.AttributesForUI,
            // SeqNumber: modAssociation.SeqNumber
          });
        }
      });
    }
    return dispatchCompartments;
  }

  setWagonDetailsFromDispatch(railDispatch, weightBridgeDataList, callBack) {
    const modWagonDetails = [];
    const wagonCodeList = [];
    if (Array.isArray(railDispatch.DispatchCompartmentPlanList)) {
      railDispatch.DispatchCompartmentPlanList.forEach((item) => {
        if (
          item.DispatchCompartmentStatus ===
          Constants.ShipmentCompartmentStatus.EMPTY ||
          item.DispatchCompartmentStatus ===
          Constants.ShipmentCompartmentStatus.PART_FILLED ||
          item.DispatchCompartmentStatus ===
          Constants.ShipmentCompartmentStatus.INTERRUPTED
        ) {
          wagonCodeList.push(item.TrailerCode);
        }
        let weightBridgeData;
        for (let weightBridgeDataItem of weightBridgeDataList) {
          if (weightBridgeDataItem.WagonCode === item.TrailerCode) {
            weightBridgeData = weightBridgeDataItem;
            break;
          }
        }
        const wagonDetail = {
          TrailerCode: item.TrailerCode,
          CarrierCompanyCode: item.CarrierCompanyCode,
          FinishedProductCode: item.FinishedProductCode,
          DispatchCompartmentStatus: item.DispatchCompartmentStatus,
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
          LoadedQuantity:
            item.LoadedQuantity !== null && item.LoadedQuantity !== ""
              ? item.LoadedQuantity.toLocaleString() +
              (item.LoadedQuantityUOM ? " " + item.LoadedQuantityUOM : "")
              : "",
          ReturnQuantity:
            item.ReturnQuantity !== null && item.ReturnQuantity !== ""
              ? item.ReturnQuantity.toLocaleString() +
              (item.PlanQuantityUOM ? " " + item.PlanQuantityUOM : "")
              : "",
          TareWeight: "",
          LadenWeight: "",
          DiffWeight: "",
          HSEInspectionStatus: "",
          AdjustedQty: "",
          ForceComplete: false,
        };
        if (weightBridgeData !== undefined) {
          let tareWeightFlag = false;
          let ladenWeightFlag = false;
          if (
            weightBridgeData.TareWeightInDispatchReceiptUOM !== "" &&
            weightBridgeData.TareWeightInDispatchReceiptUOM !== null
          ) {
            tareWeightFlag = true;
            wagonDetail.TareWeight =
              Math.round(
                weightBridgeData.TareWeightInDispatchReceiptUOM
              ).toLocaleString() +
              " " +
              weightBridgeData.DispatchReceiptUOM;
          }
          if (
            weightBridgeData.LadenWeightInDispatchReceiptUOM !== "" &&
            weightBridgeData.LadenWeightInDispatchReceiptUOM !== null
          ) {
            ladenWeightFlag = true;
            wagonDetail.LadenWeight =
              Math.round(
                weightBridgeData.LadenWeightInDispatchReceiptUOM
              ).toLocaleString() +
              " " +
              weightBridgeData.DispatchReceiptUOM;
          }

          if (tareWeightFlag && ladenWeightFlag) {
            wagonDetail.DiffWeight =
              Math.round(
                weightBridgeData.LadenWeightInDispatchReceiptUOM -
                weightBridgeData.TareWeightInDispatchReceiptUOM
              ).toLocaleString() +
              " " +
              weightBridgeData.DispatchReceiptUOM;
          } else if (!tareWeightFlag && ladenWeightFlag) {
            wagonDetail.DiffWeight = wagonDetail.LadenWeight;
          } else if (tareWeightFlag && !ladenWeightFlag) {
            if (
              Math.round(weightBridgeData.TareWeightInDispatchReceiptUOM) === 0
            ) {
              wagonDetail.DiffWeight = wagonDetail.TareWeight;
            } else {
              wagonDetail.DiffWeight = "-" + wagonDetail.TareWeight;
            }
          }
        }
        modWagonDetails.push(wagonDetail);
      });
    }
    this.setState(
      {
        modWagonDetails,
        wagonCodeOptions: Utilities.transferListtoOptions(wagonCodeList),
      },
      () => callBack()
    );
  }

  handleCompartmentSave = () => {
    try {
      this.setState({ compartmentSaveEnabled: false });
      const dispatchCompDataList = [];
      for (let item of this.state.modWagonDetails) {
        if (
          item.isSave === true ||
          (item.AdjustedQty !== null &&
            item.AdjustedQty !== undefined &&
            item.AdjustedQty !== "")
        ) {
          dispatchCompDataList.push({
            TrailerCode: item.TrailerCode,
            CarrierCompanyCode: item.CarrierCompanyCode,
            AdjustedQuantity: item.AdjustedQty,
            ForceCompleted: item.ForceComplete,
          });
        }
      }
      if (this.validateCompartmentSave(dispatchCompDataList)) {
        this.updateRailDispatchCompartInfo(dispatchCompDataList);
      } else {
        this.setState({ compartmentSaveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleCompartmentSave",
        error
      );
    }
  };

  validateCompartmentSave(dispatchCompDataList) {
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [],
    };
    let hasAdjustments = false;
    const railDispatchCompartmentAdjustmentDefMod = lodash.cloneDeep(
      railDispatchCompartmentAdjustmentDef
    );
    for (let item of dispatchCompDataList) {
      if (item.AdjustedQuantity !== "") {
        hasAdjustments = true;
        const error = Utilities.validateField(
          railDispatchCompartmentAdjustmentDefMod.validator,
          item.AdjustedQuantity
        );
        if (error !== "") {
          notification.messageResultDetails.push({
            keyFields: [
              "RailDispatchPlanDetail_DispatchCode",
              railDispatchCompartmentAdjustmentDefMod.displayName,
            ],
            keyValues: [
              this.state.modRailDispatch.DispatchCode,
              item.AdjustedQuantity,
            ],
            isSuccess: false,
            errorMessage: error,
          });
        }
      }
      if (item.ForceCompleted === true) {
        hasAdjustments = true;
      }
    }
    if (!hasAdjustments) {
      notification.messageResultDetails.push({
        keyFields: ["RailDispatchPlanDetail_DispatchCode"],
        keyValues: [this.state.modRailDispatch.DispatchCode],
        isSuccess: false,
        errorMessage: "ViewRailDispatchList_NoAdjustments",
      });
    }
    if (notification.messageResultDetails.length > 0) {
      this.props.onNotify(notification);
      return false;
    } else {
      return true;
    }
  }

  updateRailDispatchCompartInfo(dispatchCompDataList) {
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: "DispatchCode",
      KeyCodes: [
        {
          key: "DispatchCode",
          value: this.state.modRailDispatch.DispatchCode,
        },
      ],
      Entity: dispatchCompDataList,
    };
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [this.state.modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateRailDispatchCompartInfo,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getRailDispatch({
            Common_Code: this.state.modRailDispatch.DispatchCode,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            compartmentSaveEnabled: true,
          });
          console.log(
            "Error in updateRailDispatchCompartInfo: ",
            result.ErrorList
          );
        }
        this.props.onNotify(notification);
      })
      .catch((error) => {
        this.setState({
          compartmentSaveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onNotify(notification);
      });
  }

  handleRouteSearchChange = (routeCode) => {
    try {
      let routeCodeSearchOptions = this.state.routeCodeOptions.filter((item) =>
        item.value.toLowerCase().includes(routeCode.toLowerCase())
      );

      if (routeCodeSearchOptions.length > Constants.filteredOptionsCount) {
        routeCodeSearchOptions = routeCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        routeCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleRouteSearchChange",
        error
      );
    }
  };

  getRouteCodeSearchOptions() {
    let routeCodeSearchOptions = lodash.cloneDeep(
      this.state.routeCodeSearchOptions
    );
    let modRouteCode = this.state.modRailDispatch.RouteCode;
    if (
      modRouteCode !== null &&
      modRouteCode !== "" &&
      modRouteCode !== undefined
    ) {
      let selectedRouteCode = routeCodeSearchOptions.find(
        (element) => element.value.toLowerCase() === modRouteCode.toLowerCase()
      );
      if (selectedRouteCode === undefined) {
        routeCodeSearchOptions.push({
          text: modRouteCode,
          value: modRouteCode,
        });
      }
    }
    return routeCodeSearchOptions;
  }

  handleManualDateTextChange = (propertyName, value, error) => {
    try {
      const manualEntryValidationDict = lodash.cloneDeep(
        this.state.manualEntryValidationDict
      );
      const modLoadingDataInfo = lodash.cloneDeep(
        this.state.modLoadingDataInfo
      );
      manualEntryValidationDict.common[propertyName] = error;
      modLoadingDataInfo.TransactionFPinfo[propertyName] = value;
      this.setState({ manualEntryValidationDict, modLoadingDataInfo });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleDateTextChange",
        error
      );
    }
  };

  handleTankSearchChange = (tankCode) => {
    try {
      let tankCodeSearchOptions = this.state.tankCodeOptions.filter((item) =>
        item.value.toLowerCase().includes(tankCode.toLowerCase())
      );

      if (tankCodeSearchOptions.length > Constants.filteredOptionsCount) {
        tankCodeSearchOptions = tankCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        tankCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleRouteSearchChange",
        error
      );
    }
  };

  getTankCodeSearchOptions() {
    let tankCodeSearchOptions = lodash.cloneDeep(
      this.state.tankCodeSearchOptions
    );
    let modTankCode = ""; //this.state.modLeakageManualEntry.TankCode;
    if (
      modTankCode !== null &&
      modTankCode !== "" &&
      modTankCode !== undefined
    ) {
      let selectedTankCode = tankCodeSearchOptions.find(
        (element) => element.value.toLowerCase() === modTankCode.toLowerCase()
      );
      if (selectedTankCode === undefined) {
        tankCodeSearchOptions.push({
          text: modTankCode,
          value: modTankCode,
        });
      }
    }
    return tankCodeSearchOptions;
  }

  handleMeterSearchChange = (meterCode) => {
    try {
      let meterCodeSearchOptions = this.state.meterCodeOptions.filter((item) =>
        item.value.toLowerCase().includes(meterCode.toLowerCase())
      );

      if (meterCodeSearchOptions.length > Constants.filteredOptionsCount) {
        meterCodeSearchOptions = meterCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        meterCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleMeterSearchChange",
        error
      );
    }
  };

  getMeterCodeSearchOptions() {
    let meterCodeSearchOptions = lodash.cloneDeep(
      this.state.meterCodeSearchOptions
    );
    let modMeterCode = ""; //this.state.modLeakageManualEntry.MeterCode;
    if (
      modMeterCode !== null &&
      modMeterCode !== "" &&
      modMeterCode !== undefined
    ) {
      let selectedMeterCode = meterCodeSearchOptions.find(
        (element) => element.value.toLowerCase() === modMeterCode.toLowerCase()
      );
      if (selectedMeterCode === undefined) {
        meterCodeSearchOptions.push({
          text: modMeterCode,
          value: modMeterCode,
        });
      }
    }
    return meterCodeSearchOptions;
  }

  handleAttributeCellDataEdit = (attribute, value) => {
    try {
      attribute.DefaultValue = value;

      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );
      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attribute, attributeValidationErrors });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleAttributeCellDataEdit",
        error
      );
    }
  };

  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    const modAssociations = lodash.cloneDeep(this.state.modAssociations);
    let compIndex = modAssociations.findIndex(
      (item) => item.SeqNumber === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0) {
      modAssociations[compIndex].AttributesForUI[
        // compAttribute.rowIndex
        compAttribute.rowData.compSequenceNo - 1
      ].AttributeValue = value;
    }
    this.setState({ modAssociations });
    if (compIndex >= 0) {
      this.toggleExpand(modAssociations[compIndex], true, true);
    }
  };

  handleOpenSubPage(subPageName, setReadyToRender = false) {
    if (subPageName === "RailDispatchViewAuditTrailDetails") {
      this.getAuditTrail(setReadyToRender);
    } else if (subPageName === "RailDispatchViewLoadingDetailsDetails") {
      this.handleViewLoadingDetails(setReadyToRender);
    } else if (subPageName === "RailDispatchCompartmentManualEntryDetails") {
      this.handleManualEntry(setReadyToRender);
    } else if (subPageName === "RailDispatchRailWagonAssignmentDetails") {
      this.handleOpenRailWagonAssignment(setReadyToRender);
    } else if (subPageName === "RailDispatchProductAssignmentDetails") {
      this.handleOpenProductAssignment(setReadyToRender);
    } else if (subPageName === "RailDispatchLoadSpotAssignmentDetails") {
      this.handleOpenLoadSpotAssignment(setReadyToRender);
    } else if (subPageName === "RailDispatchRecordWeightDetails") {
      this.handleOpenRecordWeight(setReadyToRender);
    }
  }

  handleSubPageBackOnClick = () => {
    try {
      this.setState({ isOpenSubPage: false });
      this.props.onSubPageBack();
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleSubPageBackOnClick",
        error
      );
    }
  };

  handleTabChange = (activeIndex) => {
    try {
      this.setState({ tabActiveIndex: activeIndex });
      if (activeIndex === 0) {
        this.setState({
          saveEnabled:
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnRailDispatch
            ) && this.state.modRailDispatch.DispatchStatus === "READY",
        });
      }
      if (activeIndex === 1) {
        this.setState({
          compartmentSaveEnabled: this.checkCompartmentSaveEnabled(
            this.state.modWagonDetails
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

  handleModalDataChange = (modalData) => {
    this.setState({ modalData });
  };

  // Manual Entry

  handleManualEntry = (setReadyToRender = false) => {
    try {
      const notification = {
        messageType: "critical",
        message: "CompartmentManualEntry_OpenStatus",
        messageResultDetails: [
          {
            keyFields: ["RailDispatchPlanDetail_DispatchCode"],
            keyValues: [this.state.modRailDispatch.DispatchCode],
            isSuccess: false,
            errorMessage: "WagonStatusForManualEntryInvalid",
          },
        ],
      };
      if (this.state.modWagonDetails.length > 0) {
        const trailerCode = this.checkManualEntryEnabled(
          this.state.modWagonDetails
        );
        if (trailerCode === "" && !this.state.isOpenSubPage) {
          this.props.onNotify(notification);
          this.props.onSubPageBack();
        } else {
          this.preprocessManualEntryData(trailerCode, (saveEnabled) => {
            if (setReadyToRender) {
              this.setState(
                {
                  isOpenSubPage: true,
                  compartmentManualEntrySaveEnabled:
                    trailerCode !== "" && saveEnabled,
                  isReadyToRender: true,
                  manualEntryTabActiveIndex: 0,
                },
                () => this.props.onSetRightPaneDisplay(false)
              );
            } else {
              this.setState(
                {
                  isOpenSubPage: true,
                  compartmentManualEntrySaveEnabled:
                    trailerCode !== "" && saveEnabled,
                  manualEntryTabActiveIndex: 0,
                },
                () => this.props.onSetRightPaneDisplay(false)
              );
            }
          });
        }
      } else {
        this.handleSubPageBackOnClick();
        this.props.onNotify(notification);
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleManualEntry",
        error
      );
    }
  };

  preprocessManualEntryData(trailerCode, callback = () => { }) {
    let compartmentPlan = null;
    let compartmentDetailPlan = null;
    if (trailerCode !== "") {
      for (let item of this.state.modRailDispatch.DispatchCompartmentPlanList) {
        if (item.TrailerCode === trailerCode) {
          compartmentPlan = item;
          break;
        }
      }
      for (let item of this.state.modRailDispatch
        .DispatchCompartmentDetailPlanList) {
        if (item.TrailerCode === trailerCode) {
          compartmentDetailPlan = item;
          break;
        }
      }
    }
    if (compartmentPlan !== null && compartmentDetailPlan !== null) {
      if (!compartmentPlan.FinishedProductCode) {
        const notification = {
          messageType: "critical",
          message: "ViewRailDispatchManualEntry_status",
          messageResultDetails: [
            {
              keyFields: ["Rail_Receipt_Wagon"],
              keyValues: [trailerCode],
              isSuccess: false,
              errorMessage: "RailDispatchManualEntry_ProductNotAssigned",
            },
          ],
        };
        this.props.onNotify(notification);
        const loadingDataInfo = lodash.cloneDeep(this.state.loadingDataInfo);
        const [
          manualEntrySelectedAttributeList,
          manualEntryAttributeValidationErrorList,
        ] = this.initialManualEntrySelectedAttribute(loadingDataInfo);
        this.setState({
          loadingDataInfo,
          modLoadingDataInfo: lodash.cloneDeep(loadingDataInfo),
          manualEntryValidationDict:
            this.initialManualEntryValidationErrors(loadingDataInfo),
          manualEntrySelectedAttributeList,
          manualEntryAttributeValidationErrorList,
        });
        callback(false);
        return;
      }

      const loadingDataInfo = lodash.cloneDeep(this.state.loadingDataInfo);
      loadingDataInfo.CommonInfo.TrailerCode = trailerCode;
      loadingDataInfo.CommonInfo.CarrierCode =
        compartmentPlan.CarrierCompanyCode;
      loadingDataInfo.TransactionFPinfo.FinishedProductCode =
        compartmentPlan.FinishedProductCode;
      loadingDataInfo.TransactionFPinfo.QuantityUOM =
        this.state.modRailDispatch.QuantityUOM;
      loadingDataInfo.TransactionFPinfo.StartTime = new Date();
      loadingDataInfo.TransactionFPinfo.EndTime = new Date();


      this.getFinishedProduct(
        compartmentPlan.FinishedProductCode,
        compartmentPlan.ShareholderCode,
        (entityResult) => {
          loadingDataInfo.ArrTransactionBP = [];
          loadingDataInfo.ArrTransactionAdditive = [];
          if (
            Array.isArray(entityResult.FinishedProductItems) &&
            entityResult.FinishedProductItems.length > 0
          ) {
            for (let item of entityResult.FinishedProductItems) {
              const productInfo = lodash.cloneDeep(
                emptyRailMarineTransactionProductInfo
              );
              productInfo.FinishedProductCode = item.FinishedProductCode;
              productInfo.BaseProductCode = item.BaseProductCode;
              productInfo.AdditiveProductCode = item.AdditiveCode;
              if (item.AdditiveCode !== null && item.AdditiveCode !== "") {
                loadingDataInfo.ArrTransactionAdditive.push(productInfo);
              } else {
                loadingDataInfo.ArrTransactionBP.push(productInfo);
              }
            }
          }

          const [
            manualEntrySelectedAttributeList,
            manualEntryAttributeValidationErrorList,
          ] = this.initialManualEntrySelectedAttribute(loadingDataInfo);
          this.setState({
            loadingDataInfo,
            modLoadingDataInfo: lodash.cloneDeep(loadingDataInfo),
            manualEntryValidationDict:
              this.initialManualEntryValidationErrors(loadingDataInfo),
            manualEntrySelectedAttributeList,
            manualEntryAttributeValidationErrorList,
          });
          callback(true);
        }
      );
    } else {
      const loadingDataInfo = lodash.cloneDeep(this.state.loadingDataInfo);
      const [
        manualEntrySelectedAttributeList,
        manualEntryAttributeValidationErrorList,
      ] = this.initialManualEntrySelectedAttribute(loadingDataInfo);
      this.setState({
        loadingDataInfo,
        modLoadingDataInfo: lodash.cloneDeep(loadingDataInfo),
        manualEntrySelectedAttributeList,
        manualEntryAttributeValidationErrorList,
      });
      callback(false);
    }
  }

  getDefaultUOMs(bcuCode) {



    let densityUOM = '';
    let temperatureUOM = ''

    if (bcuCode === '' || bcuCode === undefined)
      return;

    try {
      var keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: bcuCode,
        }
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bcuCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetBCUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {

          let bcu = result.EntityResult

          temperatureUOM = bcu.TemperatureUOM;
          densityUOM = bcu.DensityUOM;

          let modLoadingDataInfo = lodash.cloneDeep(this.state.modLoadingDataInfo);
          modLoadingDataInfo.TransactionFPinfo.TemperatureUOM = temperatureUOM;
          modLoadingDataInfo.TransactionFPinfo.ProductDensityUOM = densityUOM;

          modLoadingDataInfo.ArrTransactionAdditive.map(item => { item.TemperatureUOM = temperatureUOM; item.ProductDensityUOM = densityUOM; })
          modLoadingDataInfo.ArrTransactionBP.map(item => { item.TemperatureUOM = temperatureUOM; item.ProductDensityUOM = densityUOM; })

          this.setState({ modLoadingDataInfo });


        }
      });
    } catch (error) {
      console.log(
        "TruckShipmentManualEntryDetailsComposite:Error while getting getBCUDeviceDetails"
      );
    }

  }

  GetMetersForLA(bcuCode, loadingArmCode) {


    try {
      var keyCode = [
        {
          key: KeyCodes.siteViewType,
          value: Constants.siteViewType.RAIL_BCUVIEW,
        },
        {
          key: KeyCodes.bcuCode,
          value: bcuCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.state.modRailDispatch.ActualTerminalCode,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.siteViewType,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetBCUViewTree,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {

            let loadingArm = result.EntityResult[0].AssociatedArmsList.find(larm => larm.Code === loadingArmCode);
            if (loadingArm !== null) {
              let modLoadingDataInfo = lodash.cloneDeep(this.state.modLoadingDataInfo);

              let mainLineMeters = [];
              let additiveMeters = [];
              mainLineMeters = loadingArm.AssociatedMeterList.find(meter => meter.MeterLineType === "MAINLINE");
              additiveMeters = loadingArm.AssociatedMeterList.find(meter => meter.MeterLineType === "ADDITIVE");
              let bpMeterCode = '';
              let additiveMeterCode = '';
              if (mainLineMeters.MeterList.length === 1) {
                bpMeterCode = mainLineMeters.MeterList[0].Code;
              }
              if (additiveMeters.MeterList.length === 1) {
                additiveMeterCode = additiveMeters.MeterList[0].Code;
              }


              if (bpMeterCode !== '') {

                modLoadingDataInfo.ArrTransactionBP.map(item => { item.MeterCode = bpMeterCode; })

              }

              if (additiveMeterCode !== '') {
                modLoadingDataInfo.ArrTransactionAdditive.map(item => { item.MeterCode = additiveMeterCode; })
              }

              this.setState({ modLoadingDataInfo });

            }

          }
        }
      });
    } catch (error) {
      console.log("SiteTreeView:Error occured in GetMetersForLA", error);
    }
  }

  initialManualEntrySelectedAttribute(loadingDataInfo) {
    let selectedFPAttributeList = [];
    let selectedBPAttributeList = [];
    let selectedAdditiveAttributeList = [];

    if (this.state.FPAttributeMetaDataList[0] !== undefined) {
      selectedFPAttributeList = Utilities.attributesConvertoDecimal([
        lodash.cloneDeep(this.state.FPAttributeMetaDataList[0]),
      ]);
    }
    if (this.state.BPAttributeMetaDataList[0] !== undefined) {
      selectedBPAttributeList = Utilities.attributesConvertoDecimal([
        lodash.cloneDeep(this.state.BPAttributeMetaDataList[0]),
      ]);
    }
    if (this.state.additiveAttributeMetaDataList[0] !== undefined) {
      selectedAdditiveAttributeList = Utilities.attributesConvertoDecimal([
        lodash.cloneDeep(this.state.additiveAttributeMetaDataList[0]),
      ]);
    }

    const manualEntrySelectedAttributeList = [selectedFPAttributeList];
    const manualEntryAttributeValidationErrorList = [
      Utilities.getAttributeInitialValidationErrors(
        this.state.FPAttributeMetaDataList
      ),
    ];
    for (let i = 0; i < loadingDataInfo.ArrTransactionBP.length; i++) {
      manualEntrySelectedAttributeList.push(
        lodash.cloneDeep(selectedBPAttributeList)
      );
      manualEntryAttributeValidationErrorList.push(
        Utilities.getAttributeInitialValidationErrors(
          this.state.BPAttributeMetaDataList
        )
      );
    }
    for (let i = 0; i < loadingDataInfo.ArrTransactionAdditive.length; i++) {
      manualEntrySelectedAttributeList.push(
        lodash.cloneDeep(selectedAdditiveAttributeList)
      );
      manualEntryAttributeValidationErrorList.push(
        Utilities.getAttributeInitialValidationErrors(
          this.state.additiveAttributeMetaDataList
        )
      );
    }

    return [
      manualEntrySelectedAttributeList,
      manualEntryAttributeValidationErrorList,
    ];
  }

  initialManualEntryValidationErrors(loadingDataInfo) {
    const commonValidation = {};
    const productValidation = {};
    for (let key in railDispatchCompartmentManualEntryValidationDef) {
      if (key === "BayCode" || key === "BCUCode" || key === "LoadingArm") {
        continue;
      } else if (
        key === "TransactionID" ||
        key === "StartTime" ||
        key === "EndTime" ||
        key === "Remarks"
      ) {
        commonValidation[key] = "";
      } else {
        productValidation[key] = "";
      }
    }
    const manualEntryValidationDict = {
      bayCode: "",
      BCUCode: "",
      LoadingArm: "",
      common: commonValidation,
      product: [productValidation],
    };
    for (let i = 0; i < loadingDataInfo.ArrTransactionBP.length; i++) {
      manualEntryValidationDict.product.push(
        lodash.cloneDeep(productValidation)
      );
    }
    for (let i = 0; i < loadingDataInfo.ArrTransactionAdditive.length; i++) {
      manualEntryValidationDict.product.push(
        lodash.cloneDeep(productValidation)
      );
    }
    return manualEntryValidationDict;
  }

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

  handleCompartmentManualEntryChange = (
    propertyName,
    data,
    dataPosition = {},
    errorPosition = {}
  ) => {
    try {
      if (propertyName === "TrailerCode") {
        this.preprocessManualEntryData(data, () => {
          this.setState({ compartmentManualEntrySaveEnabled: true });
        });
        return;
      }

      const modLoadingDataInfo = lodash.cloneDeep(
        this.state.modLoadingDataInfo
      );
      const manualEntryValidationDict = lodash.cloneDeep(
        this.state.manualEntryValidationDict
      );

      if (dataPosition.type !== undefined) {
        if (dataPosition.index !== undefined) {
          modLoadingDataInfo[dataPosition.type][dataPosition.index][
            propertyName
          ] = data;
        } else {
          modLoadingDataInfo[dataPosition.type][propertyName] = data;
        }
      } else {
        modLoadingDataInfo.CommonInfo[propertyName] = data;
      }

      if (errorPosition.category !== undefined) {
        if (errorPosition.category === "common") {
          if (
            railDispatchCompartmentManualEntryValidationDef[propertyName] !==
            undefined
          ) {
            manualEntryValidationDict.common[propertyName] =
              Utilities.validateField(
                railDispatchCompartmentManualEntryValidationDef[propertyName],
                data
              );
            this.setState({ manualEntryValidationDict });
          }
        } else if (errorPosition.category === "product") {
          if (
            railDispatchCompartmentManualEntryValidationDef[propertyName] !==
            undefined
          ) {
            manualEntryValidationDict.product[errorPosition.index][
              propertyName
            ] = Utilities.validateField(
              railDispatchCompartmentManualEntryValidationDef[propertyName],
              data
            );
            this.setState({ manualEntryValidationDict });
          }
        }
      }

      let triggerToGetLoadingArmCode = false;
      if (propertyName === "BayCode") {
        manualEntryValidationDict.bayCode = Utilities.validateField(
          railDispatchCompartmentManualEntryValidationDef.BayCode,
          data
        );
        let bcuCodeList = Utilities.transferListtoOptions(
          this.state.clusterBCUOptions[data]
        )
        this.setState({
          manualEntryValidationDict,
          BCUCodeOptions: bcuCodeList,
        });

        if (bcuCodeList.length === 1) {
          triggerToGetLoadingArmCode = true;
          modLoadingDataInfo.CommonInfo.BCUCode = this.state.clusterBCUOptions[data][0];

          this.getDefaultUOMs(modLoadingDataInfo.CommonInfo.BCUCode);
        }
      } else if (propertyName === "BCUCode") {
        this.getDefaultUOMs(modLoadingDataInfo.CommonInfo.BCUCode);
        triggerToGetLoadingArmCode = true;
      }

      this.setState({ modLoadingDataInfo });

      if (triggerToGetLoadingArmCode) {
        this.getLoadingArms(
          modLoadingDataInfo.CommonInfo.BCUCode,
          (entityResult) => {
            const loadingArmCodeList = [];
            if (Array.isArray(entityResult)) {
              for (let item of entityResult) {
                loadingArmCodeList.push(item);
              }
              if (loadingArmCodeList.length === 1) {
                modLoadingDataInfo.TransactionFPinfo.ArmCode =
                  loadingArmCodeList[0];
                this.GetMetersForLA(modLoadingDataInfo.CommonInfo.BCUCode, loadingArmCodeList[0]);
                this.setState({ modLoadingDataInfo });
              }
            }
            this.setState({
              loadingArmCodeOptions:
                Utilities.transferListtoOptions(loadingArmCodeList),
            });
          }
        );
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleCompartmentManualEntryChange",
        error
      );
    }
  };

  handleManualEntryDateTextChange = (
    propertyName,
    value,
    error,
    dataPosition
  ) => {
    try {
      const manualEntryValidationDict = lodash.cloneDeep(
        this.state.manualEntryValidationDict
      );
      const modLoadingDataInfo = lodash.cloneDeep(
        this.state.modLoadingDataInfo
      );
      manualEntryValidationDict.common[propertyName] = error;
      modLoadingDataInfo[dataPosition.type][propertyName] = value;
      this.setState({ manualEntryValidationDict, modLoadingDataInfo });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleManualEntryDateTextChange",
        error
      );
    }
  };

  handleManualEntryAttributeCellDataEdit = (attribute, value, index) => {
    try {
      attribute.DefaultValue = value;
      const manualEntryAttributeValidationErrorList = lodash.cloneDeep(
        this.state.manualEntryAttributeValidationErrorList
      );
      manualEntryAttributeValidationErrorList[index].forEach(
        (attributeValidation) => {
          if (attributeValidation.TerminalCode === attribute.TerminalCode) {
            attributeValidation.attributeValidationErrors[attribute.Code] =
              Utilities.valiateAttributeField(attribute, value);
          }
        }
      );
      this.setState({ manualEntryAttributeValidationErrorList });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleManualEntryAttributeCellDataEdit",
        error
      );
    }
  };

  handleCompartmentManualEntryReset = () => {
    try {
      const loadingDataInfo = lodash.cloneDeep(this.state.loadingDataInfo);
      const [
        manualEntrySelectedAttributeList,
        manualEntryAttributeValidationErrorList,
      ] = this.initialManualEntrySelectedAttribute(loadingDataInfo);
      this.setState({
        modLoadingDataInfo: loadingDataInfo,
        manualEntryValidationDict:
          this.initialManualEntryValidationErrors(loadingDataInfo),
        manualEntrySelectedAttributeList,
        manualEntryAttributeValidationErrorList,
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occurred on handleReset",
        error
      );
    }
  };

  handleCompartmentManualEntrySave = () => {
    try {
     // this.setState({ compartmentManualEntrySaveEnabled: false });
      const modLoadingDataInfo = lodash.cloneDeep(
        this.state.modLoadingDataInfo
      );

      if (this.validateManualEntry(modLoadingDataInfo)) {
        modLoadingDataInfo.TransactionFPinfo.GrossQuantity =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.GrossQuantity
          );
        modLoadingDataInfo.TransactionFPinfo.NetQuantity =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.NetQuantity
          );
        modLoadingDataInfo.TransactionFPinfo.Temperature =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.Temperature
          );
        modLoadingDataInfo.TransactionFPinfo.ProductDensity =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.ProductDensity
          );
        modLoadingDataInfo.TransactionFPinfo.StartTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.StartTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.EndTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.EndTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.NetStartTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.NetEndTotalizer
          );
        modLoadingDataInfo.TransactionFPinfo.CalculatedGross =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.CalculatedGross
          );
        modLoadingDataInfo.TransactionFPinfo.CalculatedNet =
          Utilities.convertStringtoDecimal(
            modLoadingDataInfo.TransactionFPinfo.CalculatedNet
          );
        for (let index in modLoadingDataInfo.ArrTransactionBP) {
          modLoadingDataInfo.ArrTransactionBP[index].StartTime =
            modLoadingDataInfo.TransactionFPinfo.StartTime;
          modLoadingDataInfo.ArrTransactionBP[index].EndTime =
            modLoadingDataInfo.TransactionFPinfo.EndTime;
          modLoadingDataInfo.ArrTransactionBP[index].ArmCode =
            modLoadingDataInfo.TransactionFPinfo.ArmCode;
          modLoadingDataInfo.ArrTransactionBP[index].QuantityUOM =
            modLoadingDataInfo.TransactionFPinfo.QuantityUOM;
          modLoadingDataInfo.ArrTransactionBP[index].TransactionID =
            modLoadingDataInfo.TransactionFPinfo.TransactionID;
          modLoadingDataInfo.ArrTransactionBP[index].FinishedProductCode =
            modLoadingDataInfo.TransactionFPinfo.FinishedProductCode;

          modLoadingDataInfo.ArrTransactionBP[index].GrossQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].GrossQuantity
            );
          modLoadingDataInfo.ArrTransactionBP[index].NetQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].NetQuantity
            );
          modLoadingDataInfo.ArrTransactionBP[index].Temperature =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].Temperature
            );
          modLoadingDataInfo.ArrTransactionBP[index].ProductDensity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].ProductDensity
            );
          modLoadingDataInfo.ArrTransactionBP[index].StartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].StartTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].EndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].EndTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].NetStartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].NetStartTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].NetEndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].NetEndTotalizer
            );
          modLoadingDataInfo.ArrTransactionBP[index].CalculatedGross =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].CalculatedGross
            );
          modLoadingDataInfo.ArrTransactionBP[index].CalculatedNet =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionBP[index].CalculatedNet
            );
        }
        for (let index in modLoadingDataInfo.ArrTransactionAdditive) {
          modLoadingDataInfo.ArrTransactionAdditive[index].StartTime =
            modLoadingDataInfo.TransactionFPinfo.StartTime;
          modLoadingDataInfo.ArrTransactionAdditive[index].EndTime =
            modLoadingDataInfo.TransactionFPinfo.EndTime;
          modLoadingDataInfo.ArrTransactionAdditive[index].ArmCode =
            modLoadingDataInfo.TransactionFPinfo.ArmCode;
          modLoadingDataInfo.ArrTransactionAdditive[index].QuantityUOM =
            modLoadingDataInfo.TransactionFPinfo.QuantityUOM;
          modLoadingDataInfo.ArrTransactionAdditive[index].TransactionID =
            modLoadingDataInfo.TransactionFPinfo.TransactionID;
          modLoadingDataInfo.ArrTransactionAdditive[index].FinishedProductCode =
            modLoadingDataInfo.TransactionFPinfo.FinishedProductCode;

          modLoadingDataInfo.ArrTransactionAdditive[index].GrossQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].GrossQuantity
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].NetQuantity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].NetQuantity
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].Temperature =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].Temperature
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].ProductDensity =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].ProductDensity
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].StartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].StartTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].EndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].EndTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].NetStartTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].NetStartTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].NetEndTotalizer =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].NetEndTotalizer
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedGross =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedGross
            );
          modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedNet =
            Utilities.convertStringtoDecimal(
              modLoadingDataInfo.ArrTransactionAdditive[index].CalculatedNet
            );
        }
        this.fillManualEntryAttributeDetails(modLoadingDataInfo);
        let tempLoadingInfo = lodash.cloneDeep(modLoadingDataInfo);
        
        let showManualEntryAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
          
      this.setState({ showManualEntryAuthenticationLayout, tempLoadingInfo }, () => {
        if (showManualEntryAuthenticationLayout === false) {
          this.addLoadingDetails();
          }
        });

       
      } else {
        this.setState({ compartmentManualEntrySaveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occurred on handleSave",
        error
      );
    }
  };

  
  addLoadingDetails = () => {
    try {
      this.handleAuthenticationClose();
      this.setState({ compartmentManualEntrySaveEnabled: false });
      let tempLoadingInfo = lodash.cloneDeep(this.state.tempLoadingInfo);
      this.saveManualEntry(tempLoadingInfo);
    } catch (error) {
      console.log("Rail Loading DetailsComposite : Error in save Rail Loading details");
    }
  };

  validateManualEntry(modLoadingDataInfo) {
    const manualEntryValidationDict = lodash.cloneDeep(
      this.state.manualEntryValidationDict
    );
    let validateFlag = true;

    manualEntryValidationDict.bayCode = Utilities.validateField(
      railDispatchCompartmentManualEntryValidationDef.BayCode,
      modLoadingDataInfo.CommonInfo.BayCode
    );

    manualEntryValidationDict.BCUCode = Utilities.validateField(
      railDispatchCompartmentManualEntryValidationDef.BCUCode,
      modLoadingDataInfo.CommonInfo.BCUCode
    );

    manualEntryValidationDict.LoadingArm = Utilities.validateField(
      railDispatchCompartmentManualEntryValidationDef.LoadingArm,
      modLoadingDataInfo.TransactionFPinfo.ArmCode
    );


    if (manualEntryValidationDict.bayCode !== "") {
      validateFlag = false;
    }

    if (manualEntryValidationDict.BCUCode !== "") {
      validateFlag = false;
    }

    if (manualEntryValidationDict.LoadingArm !== "") {
      validateFlag = false;
    }

    for (let key in manualEntryValidationDict.common) {
      manualEntryValidationDict.common[key] = Utilities.validateField(
        railDispatchCompartmentManualEntryValidationDef[key],
        modLoadingDataInfo.TransactionFPinfo[key]
      );
      if (manualEntryValidationDict.common[key] !== "") {
        validateFlag = false;
      }
    }

    if (
      modLoadingDataInfo.TransactionFPinfo.StartTime >=
      modLoadingDataInfo.TransactionFPinfo.EndTime
    ) {
      manualEntryValidationDict.common["StartTime"] =
        "MarineDispatchManualEntry_ErrorLoadTime";

      validateFlag = false;
    }


    let tabIndex;
    let index = 0;
    for (let key in manualEntryValidationDict.product[index]) {
      manualEntryValidationDict.product[index][key] = Utilities.validateField(
        railDispatchCompartmentManualEntryValidationDef[key],
        modLoadingDataInfo.TransactionFPinfo[key]
      );
      if (manualEntryValidationDict.product[index][key] !== "") {
        validateFlag = false;
        if (tabIndex === undefined) {
          tabIndex = index;
        }
      }
    }
    for (let item of modLoadingDataInfo.ArrTransactionBP) {
      index += 1;
      for (let key in manualEntryValidationDict.product[index]) {
        manualEntryValidationDict.product[index][key] = Utilities.validateField(
          railDispatchCompartmentManualEntryValidationDef[key],
          item[key]
        );
        if (manualEntryValidationDict.product[index][key] !== "") {
          validateFlag = false;
          if (tabIndex === undefined) {
            tabIndex = index;
          }
        }
      }
    }
    for (let item of modLoadingDataInfo.ArrTransactionAdditive) {
      index += 1;
      for (let key in manualEntryValidationDict.product[index]) {
        manualEntryValidationDict.product[index][key] = Utilities.validateField(
          railDispatchCompartmentManualEntryValidationDef[key],
          item[key]
        );
        if (manualEntryValidationDict.product[index][key] !== "") {
          validateFlag = false;
          if (tabIndex === undefined) {
            tabIndex = index;
          }
        }
      }
    }

    const manualEntrySelectedAttributeList = lodash.cloneDeep(
      this.state.manualEntrySelectedAttributeList
    );
    const manualEntryAttributeValidationErrorList = lodash.cloneDeep(
      this.state.manualEntryAttributeValidationErrorList
    );
    for (let i = 0; i < manualEntrySelectedAttributeList.length; i++) {
      for (let attribute of manualEntrySelectedAttributeList[i]) {
        for (let attributeValidation of manualEntryAttributeValidationErrorList[
          i
        ]) {
          if (attributeValidation.TerminalCode === attribute.TerminalCode) {
            for (let attributeMetaData of attribute.attributeMetaDataList) {
              let errorMsg = Utilities.valiateAttributeField(
                attributeMetaData,
                attributeMetaData.DefaultValue
              );
              if (errorMsg !== "") {
                validateFlag = false;
                if (tabIndex === undefined) {
                  tabIndex = i;
                }
              }
              attributeValidation.attributeValidationErrors[
                attributeMetaData.Code
              ] = errorMsg;
            }
          }
        }
      }
    }

    if (tabIndex !== undefined) {
      this.handleManualEntryTabChange(tabIndex);
    }
    this.setState({
      manualEntryValidationDict,
      manualEntryAttributeValidationErrorList,
    });

    return validateFlag;
  }

  fillManualEntryAttributeDetails(modLoadingDataInfo) {
    const manualEntrySelectedAttributeList = lodash.cloneDeep(
      this.state.manualEntrySelectedAttributeList
    );

    const fillItem = (item, rowAttributeList) => {
      const attributeList =
        Utilities.attributesDatatypeConversion(rowAttributeList);
      item.Attributes = [];
      attributeList.forEach((comp) => {
        const attribute = {
          ListOfAttributeData: [],
        };
        attribute.TerminalCode = comp.TerminalCode;
        comp.attributeMetaDataList.forEach((det) => {
          attribute.ListOfAttributeData.push({
            AttributeCode: det.Code,
            AttributeValue: det.DefaultValue,
          });
        });
        item.Attributes.push(attribute);
      });
    };

    let index = 0;
    fillItem(
      modLoadingDataInfo.TransactionFPinfo,
      manualEntrySelectedAttributeList[index]
    );
    for (let BPItem of modLoadingDataInfo.ArrTransactionBP) {
      index += 1;
      fillItem(BPItem, manualEntrySelectedAttributeList[index]);
    }
    for (let additiveItem of modLoadingDataInfo.ArrTransactionAdditive) {
      index += 1;
      fillItem(additiveItem, manualEntrySelectedAttributeList[index]);
    }
  }

  saveManualEntry(modLoadingDataInfo) {
    const keyCode = [
      {
        key: KeyCodes.railDispatchCode,
        value: modLoadingDataInfo.CommonInfo.DispatchCode,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: keyCode,
      Entity: [modLoadingDataInfo],
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatchManualEntry_status",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [modLoadingDataInfo.CommonInfo.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.RailDispatchManualEntry,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          // this.getRailDispatch({
          //   Common_Code: modLoadingDataInfo.CommonInfo.DispatchCode,
          // });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in saveManualEntry: ", result.ErrorList);
        }
        this.setState({ compartmentManualEntrySaveEnabled: true });
        this.props.onNotify(notification);
      })
      .catch((error) => {
        this.setState({ compartmentManualEntrySaveEnabled: true });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onNotify(notification);
      });
  }

  // View Audit Trail

  handleViewAuditTrail = () => {
    try {
      this.getAuditTrail();
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleViewAuditTrail",
        error
      );
    }
  };

  getAuditTrail(setReadyToRender = false) {
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: "DispatchCode",
          value: this.state.modRailDispatch.DispatchCode,
        },
      ],
    };
    axios(
      RestAPIs.GetRailDispatchAuditTrail,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          for (let i = 0; i < result.EntityResult.length; i++) {
            result.EntityResult[i].UpdatedTime = new Date(
              result.EntityResult[i].UpdatedTime
            ).toLocaleString();
            result.EntityResult[i].DispatchStatusInNumber =
              Constants.ShipmentStatus[result.EntityResult[i].DispatchStatus];
          }
          let attributeMetaDataList = lodash.cloneDeep(
            this.state.auditTrailAttributeMetaDataList
          );
          for (let i = 0; i < result.EntityResult.length; i++) {
            result.EntityResult[i].AttributesforUI =
              this.formReadonlyCompAttributes(
                result.EntityResult[i].Attributes,
                attributeMetaDataList
              );
          }
          if (setReadyToRender) {
            this.setState(
              {
                isOpenSubPage: true,
                auditTrailList: result.EntityResult,
                isReadyToRender: true,
              },
              () => this.props.onSetRightPaneDisplay(false)
            );
          } else {
            this.setState(
              {
                isOpenSubPage: true,
                auditTrailList: result.EntityResult,
              },
              () => this.props.onSetRightPaneDisplay(false)
            );
          }
        } else {
          console.log("Error in getAuditTrail: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getAuditTrail: ", error);
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

  handleOpenPrintAuditTrailPreview = () => {
    const modalData = lodash.cloneDeep(this.state.modalData);
    modalData.printAuditTrail.isOpen = true;
    this.setState({ modalData });
  };

  handlePrintAuditTrail = (title) => {
    let el = window.document.getElementById("printTable").innerHTML;
    const iframe = window.document.createElement("iframe");
    let doc = null;
    window.document.body.appendChild(iframe);
    doc = iframe.contentWindow.document;
    const str1 = el.substring(0, el.indexOf("<table") + 6);
    const str2 = el.substring(el.indexOf("<table") + 6, el.length);
    const str3 = title;
    el = str3 + str1 + ' border="1" cellspacing="0"' + str2;
    el = el.replace('<tfoot class="p-datatable-tfoot">', "");
    el = el.replace(
      '<tr><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td></tr>',
      ""
    );
    doc.write(el);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      window.document.body.removeChild(iframe);
    }, 2000);
    const modalData = lodash.cloneDeep(this.state.modalData);
    modalData.printAuditTrail.isOpen = false;
    this.setState({ modalData });
  };

  // View Loading Details

  handleViewLoadingDetails = (setReadyToRender = false) => {
    try {
      this.props.getLookUpData("ViewRailDispatch", (entityResult) => {
        const configFieldsString =
          entityResult.ViewRailLoadingDetailsFields1 +
          Constants.delimiter +
          entityResult.ViewRailLoadingDetailsFields2;
        const configFieldsList = configFieldsString.split(Constants.delimiter);
        const loadingDetailsHideColumnList = [];
        for (let item of configFieldsList) {
          const itemList = item.split(":");
          if (itemList.length === 2 && itemList[1] === "0") {
            loadingDetailsHideColumnList.push(itemList[0]);
          }
        }
        this.setState({ loadingDetailsHideColumnList });
        this.getLoadingDetails(setReadyToRender);
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleViewLoadingDetails",
        error
      );
    }
  };

  getLoadingDetails(setReadyToRender = false) {
    const obj = {
      DispatchCode: this.state.modRailDispatch.DispatchCode,
      TMWebApiRequest: {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        KeyCodes: [
          {
            key: "RailDispatchCode",
            value: this.state.modRailDispatch.DispatchCode,
          },
        ],
      },
    };
    axios(
      RestAPIs.GetRailDispatchLoadingDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          for (let i = 0; i < result.EntityResult.Table.length; i++) {
            result.EntityResult.Table[i].ProductCode =
              result.EntityResult.Table[i].ProductCode.replace(/&nbsp;/g, " ");
          }
          if (setReadyToRender) {
            this.setState(
              {
                isOpenSubPage: true,
                loadingDetailsList: result.EntityResult.Table,
                isReadyToRender: true,
              },
              () => this.props.onSetRightPaneDisplay(false)
            );
          } else {
            this.setState(
              {
                isOpenSubPage: true,
                loadingDetailsList: result.EntityResult.Table,
              },
              () => this.props.onSetRightPaneDisplay(false)
            );
          }
        } else {
          console.log("Error in getLoadingDetails: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getLoadingDetails: ", error);
      });
  }

  // Rail Wagon Assignment

  handleOpenRailWagonAssignment = (setReadyToRender = false) => {
    try {
      this.initialRailWagonAssignmentList();
      if (setReadyToRender) {
        this.setState(
          {
            isOpenSubPage: true,
            isReadyToRender: true,
            railWagonAssignmentSaveEnabled: true,
          },
          () => this.props.onSetRightPaneDisplay(false)
        );
      } else {
        this.setState(
          {
            isOpenSubPage: true,
            railWagonAssignmentSaveEnabled: true,
          },
          () => this.props.onSetRightPaneDisplay(false)
        );
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleOpenRailWagonAssignment",
        error
      );
    }
  };

  initialRailWagonAssignmentList() {
    const railWagonAssignmentData = {
      CarrierCompanyCode: "",
      TrailerCode: "",
    };
    if (
      Array.isArray(
        this.state.modRailDispatch.DispatchCompartmentDetailPlanList
      )
    ) {
      const modRailWagonList = [];
      for (let item of this.state.modRailDispatch
        .DispatchCompartmentDetailPlanList) {
        modRailWagonList.push({
          SequenceNo: modRailWagonList.length + 1,
          AssociatedOrderItems: "",
          CompartmentSeqNoInVehicle: "",
          QuantityUOM: "",
          Quantity: "",
          TrailerCode: item.TrailerCode,
          CarrierCompanyCode: item.CarrierCompanyCode,
          CompartmentCode: "",
          ShareholderCode: "",
          FinishedProductCode: "",
          CustomerCode: "",
          DestinationCode: "",
          DispatchCode: "",
          AssociatedContractItems: [],
          Attributes: [],
        });
      }
      this.setState({
        railWagonAssignmentData,
        modRailWagonList,
        trailerCodeOptions: [],
        selectedRailWagons: [],
      });
    } else {
      this.setState({
        railWagonAssignmentData,
        modRailWagonList: [],
        trailerCodeOptions: [],
        selectedRailWagons: [],
      });
    }
  }

  handleRailWagonAssignmentChange = (propertyName, data) => {
    const railWagonAssignmentData = lodash.cloneDeep(
      this.state.railWagonAssignmentData
    );
    railWagonAssignmentData[propertyName] = data;
    if (propertyName === "CarrierCompanyCode") {
      this.getTrailerCodes(data);
    } else if (propertyName === "TrailerCode") {
    }
    this.setState({ railWagonAssignmentData });
  };

  handleRailWagonSelectionChange = (selectedRailWagons) => {
    this.setState({ selectedRailWagons });
  };

  handleRailWagonAssignmentAdd = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        const notification = {
          messageType: "critical",
          message: "ShipmentCompDetail_SavedStatus",
          messageResultDetails: [],
        };

        if (this.state.railWagonAssignmentData.CarrierCompanyCode === "") {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "RailDispatchWagonAssignment_CarrierEmpty",
          });
          this.props.onNotify(notification);
          return;
        } else if (this.state.railWagonAssignmentData.TrailerCode === "") {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "RailDispatchWagonAssignment_RailWagonEmpty",
          });
          this.props.onNotify(notification);
          return;
        }

        const obj = {
          DispatchCode: this.state.modRailDispatch.DispatchCode,
          WagonCode: this.state.railWagonAssignmentData.TrailerCode,
          CarrierCode: this.state.railWagonAssignmentData.CarrierCompanyCode,
          TMWebApiRequest: {
            ShareHolderCode:
              this.props.userDetails.EntityResult.PrimaryShareholder,
            KeyCodes: [
              {
                key: "RailDispatchCode",
                value: this.state.modRailDispatch.DispatchCode,
              },
            ],
          },
        };
        notification.messageResultDetails.push({
          keyFields: ["ViewRailLoadingDetails_RailWagonCode"],
          keyValues: [this.state.railWagonAssignmentData.TrailerCode],
          isSuccess: false,
          errorMessage: "",
        });
        axios(
          RestAPIs.RailDispatchValidateWagonToAssign,
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
              const railWagonAssignmentData = lodash.cloneDeep(
                this.state.railWagonAssignmentData
              );
              const modRailWagonList = lodash.cloneDeep(
                this.state.modRailWagonList
              );
              const newComp = {
                SequenceNo: modRailWagonList.length + 1,
                AssociatedOrderItems: "",
                CompartmentSeqNoInVehicle: "",
                QuantityUOM: "",
                Quantity: "",
                TrailerCode: railWagonAssignmentData.TrailerCode,
                CarrierCompanyCode: railWagonAssignmentData.CarrierCompanyCode,
                CompartmentCode: "",
                ShareholderCode: "",
                FinishedProductCode: "",
                CustomerCode: "",
                DestinationCode: "",
                DispatchCode: this.state.modRailDispatch.DispatchCode,
                AssociatedContractItems: [],
                Attributes: [],
              };
              modRailWagonList.push(newComp);
              railWagonAssignmentData.TrailerCode = "";

              this.setState({
                modRailWagonList,
                selectedRailWagons: [],
                railWagonAssignmentData,
              });
            } else {
              console.log(
                "Error in RailDispatchValidateWagonToAssign: ",
                result.ErrorList
              );
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              this.props.onNotify(notification);
            }
          })
          .catch((error) => {
            console.log(
              "Error while RailDispatchValidateWagonToAssign: ",
              error
            );
            notification.messageResultDetails[0].errorMessage = error;
            this.props.onNotify(notification);
          });
      } catch (error) {
        console.log(
          "RailDispatchDetailsComposite: Error occurred on handleRailWagonAssignmentAdd",
          error
        );
      }
    }
  };

  handleRailWagonAssignmentDelete = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (this.state.selectedRailWagons.length > 0) {
          if (this.state.modRailWagonList.length > 0) {
            let modRailWagonList = lodash.cloneDeep(
              this.state.modRailWagonList
            );

            this.state.selectedRailWagons.forEach((obj, index) => {
              modRailWagonList = modRailWagonList.filter((item, cindex) => {
                return item.SequenceNo !== obj.SequenceNo;
              });
            });

            for (let index = 0; index < modRailWagonList.length; index++) {
              modRailWagonList[index].SequenceNo = index + 1;
            }

            this.setState({ modRailWagonList });
          }
        }
        this.setState({ selectedRailWagons: [] });
      } catch (error) {
        console.log(
          "RailDispatchDetailsComposite: Error occurred on handleRailWagonAssignmentDelete",
          error
        );
      }
    }
  };

  handleRailWagonAssignmentMove = (isMoveUp) => {
    try {
      if (
        this.state.modRailWagonList.length > 0 &&
        this.state.selectedRailWagons.length === 1
      ) {
        const modRailWagonList = lodash.cloneDeep(this.state.modRailWagonList);
        let index;
        for (index = 0; index < modRailWagonList.length; index++) {
          if (
            modRailWagonList[index].SequenceNo ===
            this.state.selectedRailWagons[0].SequenceNo
          ) {
            break;
          }
        }
        if (isMoveUp) {
          if (index === 0) {
            return;
          }
          const temp = modRailWagonList[index - 1].TrailerCode;
          modRailWagonList[index - 1].TrailerCode =
            modRailWagonList[index].TrailerCode;
          modRailWagonList[index].TrailerCode = temp;
          this.setState({
            modRailWagonList,
            selectedRailWagons: [lodash.cloneDeep(modRailWagonList[index - 1])],
          });
        } else {
          if (index === modRailWagonList.length - 1) {
            return;
          }
          const temp = modRailWagonList[index + 1].TrailerCode;
          modRailWagonList[index + 1].TrailerCode =
            modRailWagonList[index].TrailerCode;
          modRailWagonList[index].TrailerCode = temp;
          this.setState({
            modRailWagonList,
            selectedRailWagons: [lodash.cloneDeep(modRailWagonList[index + 1])],
          });
        }
      } else {
        const notification = {
          messageType: "critical",
          message: "ShipmentCompDetail_SavedStatus",
          messageResultDetails: [
            {
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: "ERRMSG_RAILWAGONSEQUENCE",
            },
          ],
        };
        this.props.onNotify(notification);
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleRailWagonAssignmentMove",
        error
      );
    }
  };

  handleRailWagonAssignmentReverseSelect = () => {
    try {
      const newSelectedRailWagons = [];
      for (let item of this.state.modRailWagonList) {
        let searchFlag = false;
        for (let selectedItem of this.state.selectedRailWagons) {
          if (item.SequenceNo === selectedItem.SequenceNo) {
            searchFlag = true;
            break;
          }
        }
        if (!searchFlag) {
          newSelectedRailWagons.push(item);
        }
      }
      this.setState({ selectedRailWagons: newSelectedRailWagons });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleRailWagonAssignmentReverseSelect",
        error
      );
    }
  };

  handleRailWagonAssignReset = () => {
    try {
      this.initialRailWagonAssignmentList();
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleRailWagonAssignReset",
        error
      );
    }
  };

  handleRailWagonAssignSave = () => {
    try {
      const modRailDispatch = lodash.cloneDeep(this.state.modRailDispatch);
      modRailDispatch.DispatchCompartmentDetailPlanList =
        this.getCompartmentsFromRailWagonList(this.state.modRailWagonList);

      let notification = {
        messageType: "critical",
        message: "ViewRailDispatch_WagonAssign_status",
        messageResultDetails: [],
      };
      if (this.state.maxNumberOfCompartments < this.state.modRailWagonList.length) {
        notification.messageResultDetails.push({
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "Wagon_limit_Exceeded",
        });
        this.props.onNotify(notification);
      }
      else {
        
        let showWagonAssignmentAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
        let tempRailDispatch = lodash.cloneDeep(modRailDispatch);
        this.setState({ showWagonAssignmentAuthenticationLayout, tempRailDispatch }, () => {
          if (showWagonAssignmentAuthenticationLayout === false) {
            this.railWagonSave();
          }
      });
        
       
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleRailWagonAssignSave",
        error
      );
    }
  };


  railWagonSave= () => {
    this.handleAuthenticationClose();
    const modRailDispatch = lodash.cloneDeep(this.state.tempRailDispatch);
    
    this.setState({ railWagonAssignmentSaveEnabled: false });
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: [
        {
          key: KeyCodes.railDispatchCode,
          value: modRailDispatch.DispatchCode,
        },
      ],
      Entity: modRailDispatch,
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_WagonAssign_status",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateRailDispatchPlanWithWagon,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getRailDispatch(
            { Common_Code: modRailDispatch.DispatchCode },
            true
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            railWagonAssignmentSaveEnabled: true,
          });
          console.log(
            "Error in UpdateRailDispatchPlanWithWagon: ",
            result.ErrorList
          );
        }
        this.props.onNotify(notification);
      })
      .catch((error) => {
        this.setState({
          railWagonAssignmentSaveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onNotify(notification);
      });
  }

  getCompartmentsFromRailWagonList(railWagonList) {
    const compartmentList = [];
    for (let item of railWagonList) {
      if (item.AttributesForUI !== undefined && item.AttributesForUI != null) {
        item.AttributesForUI =
          Utilities.compartmentAttributesDatatypeConversion(
            item.AttributesForUI
          );
      }
      let selectedTerminals = [];
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        selectedTerminals = lodash.cloneDeep(
          this.state.modRailDispatch.TerminalCodes
        );
        if (selectedTerminals == null) {
          selectedTerminals = [];
        }
      } else {
        const wagonDetailPlanAttributeMetaDataList = lodash.cloneDeep(
          this.state.compartmentAttributeMetaDataList
        );
        if (wagonDetailPlanAttributeMetaDataList.length > 0) {
          selectedTerminals = [
            wagonDetailPlanAttributeMetaDataList[0].TerminalCode,
          ];
        }
      }
      let terminalAttributes = [];
      item.Attributes = [];
      selectedTerminals.forEach((terminal) => {
        if (
          item.AttributesForUI !== null &&
          item.AttributesForUI !== undefined
        ) {
          terminalAttributes = item.AttributesForUI.filter((attTerminal) => {
            return attTerminal.TerminalCode === terminal;
          });
        }

        const attribute = {
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
        ) {
          item.Attributes.push(attribute);
        }
      });

      compartmentList.push({
        AssociatedContractItems:
          item.ContractCode === null
            ? null
            : [
              {
                ContractCode: item.ContractCode,
                ShareholderCode: item.ShareholderCode,
                ContractItemQuantity:
                  item.Quantity !== null && item.Quantity !== ""
                    ? Utilities.convertStringtoDecimal(item.Quantity)
                    : null,
                QuantityUOM: this.state.modRailDispatch.QuantityUOM,
                FinishedProductCode: item.FinishedProductCode,
                Destination: item.DestinationCode,
              },
            ],
        AssociatedOrderItems: item.AssociatedOrderItems,
        Attributes: item.Attributes,
        AttributesForUI: item.AttributesForUI,
        CarrierCompanyCode: item.CarrierCompanyCode,
        CompartmentCode: item.CompartmentCode,
        CompartmentSeqNoInVehicle: item.CompartmentSeqNoInVehicle,
        CustomerCode: item.CustomerCode,
        DestinationCode: item.DestinationCode,
        DispatchCode: item.DispatchCode,
        FinishedProductCode: item.FinishedProductCode,
        Quantity: Utilities.convertStringtoDecimal(item.Quantity),
        QuantityUOM: item.QuantityUOM,
        SequenceNo: item.SequenceNo,
        ShareholderCode: item.ShareholderCode,
        TrailerCode: item.TrailerCode,
      });
    }
    return compartmentList;
  }

  // Product Assignment

  handleOpenProductAssignment = (setReadyToRender = false) => {
    try {
      this.initialProductAssignmentList(() => {
        if (setReadyToRender) {
          this.setState(
            {
              isOpenSubPage: true,
              isReadyToRender: true,
              productAssignmentExpandedRows: [],
            },
            () => this.props.onSetRightPaneDisplay(false)
          );
        } else {
          this.setState(
            {
              isOpenSubPage: true,
              productAssignmentExpandedRows: [],
            },
            () => this.props.onSetRightPaneDisplay(false)
          );
        }
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleOpenProductAssignment",
        error
      );
    }
  };

  initialProductAssignmentList(callBack = () => { }) {
    const keyCode = [
      {
        key: KeyCodes.railDispatchCode,
        value: this.state.modRailDispatch.DispatchCode,
      },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.RAIL,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailPartialDispatchData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult.DispatchCompartmentDetailPlanList)
          ) {
            const modRailWagonList = [];
            for (let item of result.EntityResult
              .DispatchCompartmentDetailPlanList) {
              modRailWagonList.push({
                SequenceNo: item.SequenceNo,
                AssociatedOrderItems: item.AssociatedOrderItems,
                CompartmentSeqNoInVehicle: item.CompartmentSeqNoInVehicle,
                QuantityUOM: item.QuantityUOM,
                Quantity: item.Quantity,
                TrailerCode: item.TrailerCode,
                CarrierCompanyCode: item.CarrierCompanyCode,
                CompartmentCode: item.CompartmentCode,
                ShareholderCode: item.ShareholderCode,
                FinishedProductCode: item.FinishedProductCode,
                CustomerCode: item.CustomerCode,
                DestinationCode: item.DestinationCode,
                DispatchCode: item.DispatchCode,
                AssociatedContractItems: item.AssociatedContractItems,
                Attributes: item.Attributes,
                ContractCode:
                  item.AssociatedContractItems != null
                    ? item.AssociatedContractItems[0].ContractCode
                    : null,
              });
            }
            this.setState(
              {
                modRailWagonList,
                productAssignmentSaveEnabled: modRailWagonList.length > 0,
              },
              () =>
                this.getProductAssignmentQuantity(modRailWagonList, callBack)
            );
          } else {
            this.setState({
              modRailWagonList: [],
              productAssignmentSaveEnabled: false,
            });
          }
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting initialProductAssignmentList: ",
          error
        );
      });
  }

  getProductAssignmentQuantity = (
    modRailWagonList,
    callBack,
    currentIndex = 0
  ) => {
    /*if (currentIndex < modRailWagonList.length) {
      if (!modRailWagonList[currentIndex].Quantity) {
        this.getRailWagon(
          modRailWagonList[currentIndex].TrailerCode,
          modRailWagonList[currentIndex].CarrierCompanyCode,
          modRailWagonList[currentIndex].ShareHolderCode,
          (entityResult) => {
            modRailWagonList[currentIndex].Quantity =
              entityResult.MaxLoadableVolume;
            this.getProductAssignmentQuantity(
              modRailWagonList,
              callBack,
              currentIndex + 1
            );
          }
        );
      } else {
        this.getProductAssignmentQuantity(
          modRailWagonList,
          callBack,
          currentIndex + 1
        );
      }
    } else {
      this.setState({ modRailWagonList }, () => {
        if (this.props.userDetails.EntityResult.IsEnterpriseNode === false) {
          const attributeMetaDataList = lodash.cloneDeep(
            this.state.wagonDetailPlanAttributeMetaDataList
          );
          if (attributeMetaDataList.length > 0)
            this.formProductAssignmentAttributes([
              attributeMetaDataList[0].TerminalCode,
            ]);
        } else {
          this.formProductAssignmentAttributes(
            this.state.modRailDispatch.TerminalCodes
          );
        }
        callBack();
      });
    }*/
    this.setState({ modRailWagonList }, () => {
      if (this.props.userDetails.EntityResult.IsEnterpriseNode === false) {
        const attributeMetaDataList = lodash.cloneDeep(
          this.state.wagonDetailPlanAttributeMetaDataList
        );
        if (attributeMetaDataList.length > 0)
          this.formProductAssignmentAttributes([
            attributeMetaDataList[0].TerminalCode,
          ]);
      } else {
        this.formProductAssignmentAttributes(
          this.state.modRailDispatch.TerminalCodes
        );
      }
      callBack();
    });
  };

  handleProductAssignmentCellDataEdit = (newVal, cellData) => {
    const modRailWagonList = lodash.cloneDeep(this.state.modRailWagonList);

    modRailWagonList[cellData.rowIndex][cellData.field] = newVal;

    if (cellData.field === "ShareholderCode") {
      modRailWagonList[cellData.rowIndex]["FinishedProductCode"] = "";
      modRailWagonList[cellData.rowIndex]["CustomerCode"] = "";
      modRailWagonList[cellData.rowIndex]["DestinationCode"] = "";
    } else if (cellData.field === "CustomerCode") {
      const customerDestinationOptions = lodash.cloneDeep(
        this.state.customerDestinationOptions
      );
      if (
        customerDestinationOptions[
        modRailWagonList[cellData.rowIndex]["ShareholderCode"]
        ] !== undefined &&
        customerDestinationOptions[
        modRailWagonList[cellData.rowIndex]["ShareholderCode"]
        ] !== null
      ) {
        const customerDestinationList =
          customerDestinationOptions[
          modRailWagonList[cellData.rowIndex]["ShareholderCode"]
          ];
        if (
          customerDestinationList[newVal] !== undefined &&
          Array.isArray(customerDestinationList[newVal]) &&
          customerDestinationList[newVal].length === 1
        ) {
          modRailWagonList[cellData.rowIndex]["DestinationCode"] =
            customerDestinationList[newVal][0];
        } else {
          modRailWagonList[cellData.rowIndex]["DestinationCode"] = "";
        }
      }
    }

    this.setState({ modRailWagonList });
  };

  productAssignmentToggleExpand = (data, open, isTerminalAdded = false) => {
    let productAssignmentExpandedRows = lodash.cloneDeep(
      this.state.productAssignmentExpandedRows
    );
    const expandedRowIndex = productAssignmentExpandedRows.findIndex(
      (item) => item.SequenceNo === data.SequenceNo
    );
    if (open) {
      if (isTerminalAdded && expandedRowIndex >= 0) {
        productAssignmentExpandedRows.splice(expandedRowIndex, 1);
        productAssignmentExpandedRows.push(data);
      } else if (expandedRowIndex >= 0) {
        productAssignmentExpandedRows.splice(expandedRowIndex, 1);
      }
    } else {
      if (expandedRowIndex >= 0) {
        productAssignmentExpandedRows = productAssignmentExpandedRows.filter(
          (x) =>
            x.TrailerCode !== data.TrailerCode &&
            x.SequenceNo !== data.SequenceNo
        );
      } else productAssignmentExpandedRows.push(data);
    }
    this.setState({ productAssignmentExpandedRows });
  };

  handleProductAssignmentAttributeCellDataEdit = (compAttribute, value) => {
    const modRailWagonList = lodash.cloneDeep(this.state.modRailWagonList);
    let compIndex = modRailWagonList.findIndex(
      (item) => item.SequenceNo === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0) {
      modRailWagonList[compIndex].AttributesForUI[
        // compAttribute.rowIndex
        compAttribute.rowData.compSequenceNo - 1
      ].AttributeValue = value;
    }
    this.setState({ modRailWagonList });
    if (compIndex >= 0) {
      this.productAssignmentToggleExpand(
        modRailWagonList[compIndex],
        true,
        true
      );
    }
  };

  handleProductAssignReset = () => {
    try {
      this.initialProductAssignmentList();
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleProductAssignReset",
        error
      );
    }
  };

  handleProductAssignSave = () => {
    try {
    //  this.setState({ productAssignmentSaveEnabled: false });
      const modRailDispatch = lodash.cloneDeep(this.state.modRailDispatch);
      modRailDispatch.DispatchCompartmentDetailPlanList =
        this.getCompartmentsFromRailWagonList(this.state.modRailWagonList);
      if (
        this.validateProductAssignSave(
          modRailDispatch.DispatchCompartmentDetailPlanList
        )
      ) {
       
        let showProductAssignmentAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
        let tempRailDispatch = lodash.cloneDeep(modRailDispatch);
        this.setState({ showProductAssignmentAuthenticationLayout, tempRailDispatch }, () => {
          if (showProductAssignmentAuthenticationLayout === false) {
            this.productAssignmentSave();
          }
      });

      } else {
        this.setState({ productAssignmentSaveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleProductAssignSave",
        error
      );
    }
  };

  productAssignmentSave= () => {
    this.handleAuthenticationClose();
    this.setState({ productAssignmentSaveEnabled: false });
    const modRailDispatch = lodash.cloneDeep(this.state.tempRailDispatch);

    const obj = {
      ShareHolderCode:
        this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: [
        {
          key: KeyCodes.railDispatchCode,
          value: modRailDispatch.DispatchCode,
        },
      ],
      Entity: modRailDispatch,
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_ProductAssignment_status",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateRailDispatchProductAssignment,
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
          this.getRailDispatch(
            { Common_Code: modRailDispatch.DispatchCode },
            true
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            productAssignmentSaveEnabled: true,
          });
          console.log(
            "Error in UpdateRailDispatchPlanWithWagon: ",
            result.ErrorList
          );
        }
        this.props.onNotify(notification);
      })
      .catch((error) => {
        this.setState({
          productAssignmentSaveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onNotify(notification);
      });

  }
  validateProductAssignSave(modRailWagonList) {
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_ProductAssignment_status",
      messageResultDetails: [],
    };

    const railDispatchCompartmentDefMod = lodash.cloneDeep(
      railDispatchCompartmentDef
    );



    for (let modRailWagon of modRailWagonList) {
      railDispatchCompartmentDefMod.forEach((col) => {
        if (col.field === "PlannedQuantity") {
          col.field = "Quantity";
        }
        let error = "";
        if (col.validator !== undefined) {
          error = Utilities.validateField(
            col.validator,
            modRailWagon[col.field]
          );
        }
        if (error !== "") {
          notification.messageResultDetails.push({
            keyFields: ["RailDispatchPlanDetail_DispatchCode", col.displayName],
            keyValues: [
              this.state.modRailDispatch.DispatchCode,
              modRailWagon[col.field],
            ],
            isSuccess: false,
            errorMessage: error,
          });
        }
      });

      let updatedAttributes = [];
      if (
        modRailWagon.AttributesForUI !== null &&
        modRailWagon.AttributesForUI !== undefined
      ) {
        updatedAttributes = modRailWagon.AttributesForUI.filter(
          (uIAttributes) => {
            return modRailWagon.Attributes.some((selAttribute) => {
              const isPresent =
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
          }
        );
      }

      updatedAttributes.forEach((item) => {
        const errMsg = Utilities.valiateAttributeField(
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
                modRailWagon.SequenceNo,
                item.TerminalCode,
                item.AttributeValue,
              ],
              isSuccess: false,
              errorMessage: errMsg,
            });
          } else {
            notification.messageResultDetails.push({
              keyFields: ["CompAttributeComp", item.AttributeName],
              keyValues: [modRailWagon.SequenceNo, item.AttributeValue],
              isSuccess: false,
              errorMessage: errMsg,
            });
          }
        }
      });
      this.toggleExpand(modRailWagon, true, true);

      delete modRailWagon.AttributesForUI;
    }
    if (notification.messageResultDetails.length > 0) {
      this.props.onNotify(notification);
      return false;
    } else {
      return true;
    }
  }

  // Load Sport Assignment

  handleOpenLoadSpotAssignment = (setReadyToRender = false) => {
    try {
      this.initialLoadSpotAssignmentList(() => {
        if (setReadyToRender) {
          this.setState(
            {
              isOpenSubPage: true,
              isReadyToRender: true,
            },
            () => this.props.onSetRightPaneDisplay(false)
          );
        } else {
          this.setState(
            {
              isOpenSubPage: true,
            },
            () => this.props.onSetRightPaneDisplay(false)
          );
        }
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleOpenLoadSpotAssignment",
        error
      );
    }
  };

  initialLoadSpotAssignmentList(callback = () => { }) {
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: [
        {
          key: "DispatchCode",
          value: this.state.modRailDispatch.DispatchCode,
        },
      ],
    };
    axios(
      RestAPIs.GetRailDispatchBatchPlanDetails,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true && Array.isArray(result.EntityResult)) {
          for (let item of result.EntityResult) {
            item.ReturnQuantityUOM = this.state.modRailDispatch.QuantityUOM;
            if (item.SpurCode !== undefined && item.SpurCode !== "" && item.SpurCode !== null) {
              this.getRailLoadSpotDevices(item.SpurCode, "CLUSTER");
              this.getRailLoadSpotDevices(item.ClusterCode, "BCU");
            }
          }
          this.setState({
            railWagonBatchPlanList: result.EntityResult,
            modRailWagonBatchPlanList: lodash.cloneDeep(result.EntityResult),
            loadSpotAssignmentSaveEnabled: true,
          });
        } else {
          this.setState({
            railWagonBatchPlanList: [],
            modRailWagonBatchPlanList: [],
            loadSpotAssignmentSaveEnabled: false,
          });
          console.log(
            "Error in GetRailDispatchBatchPlanDetails: ",
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
          "Error while getting GetRailDispatchBatchPlanDetails: ",
          error
        );
      });
  }

  handleLoadSpotAssignmentCellDataEdit = (newVal, cellData) => {
    const modRailWagonBatchPlanList = lodash.cloneDeep(
      this.state.modRailWagonBatchPlanList
    );

    modRailWagonBatchPlanList[cellData.rowIndex][cellData.field] = newVal;

    if (cellData.field === "SpurCode") {
      this.getRailLoadSpotDevices(newVal, "CLUSTER");
      this.getRailLoadSpot(newVal, "SPUR", (entityResult) => {
        modRailWagonBatchPlanList[cellData.rowIndex].ClusterCode =
          entityResult.ClusterCode;
        modRailWagonBatchPlanList[cellData.rowIndex].BCUCode =
          entityResult.BCUCode;
        modRailWagonBatchPlanList[cellData.rowIndex].ArmNoInBCU =
          entityResult.ArmNoInBCU;
        this.getRailLoadSpotDevices(entityResult.ClusterCode, "BCU");
        this.setState({ modRailWagonBatchPlanList });
      });
      return;
    } else if (cellData.field === "ClusterCode") {
      this.getRailLoadSpotDevices(newVal, "BCU");
    }

    this.setState({ modRailWagonBatchPlanList });
  };

  handleLoadSpotAssignmentAssignWagon = (railWagonBatchPlan) => {
    try {
      if (railWagonBatchPlan.AllowAuthorize) {
        const obj = {
          ShareHolderCode:
            this.props.userDetails.EntityResult.PrimaryShareholder,
          keyDataCode: KeyCodes.railDispatchCode,
          KeyCodes: [
            {
              key: KeyCodes.railDispatchCode,
              value: this.state.modRailDispatch.DispatchCode,
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
          RestAPIs.RailDispatchAuthorizeRailWagonPlan,
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
              console.log(
                "Error in handleLoadSpotAssignmentAssignWagon: ",
                result.ErrorList
              );
            }
            this.props.onNotify(notification);
          })
          .catch((error) => {
            notification.messageResultDetails[0].errorMessage = error;
            this.props.onNotify(notification);
          });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleLoadSpotAssignmentAssignWagon",
        error
      );
    }
  };

  handleLoadSpotAssignReset = () => {
    this.setState({
      modRailWagonBatchPlanList: lodash.cloneDeep(
        this.state.railWagonBatchPlanList
      ),
    });
  };

  handleLoadSpotAssignSave = () => {
    try {
    //  this.setState({ loadSpotAssignmentSaveEnabled: false });
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
        this.setState({ loadSpotAssignmentSaveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleLoadSpotAssignSave",
        error
      );
    }
  };

  saveLoadSpotAfterConfirm  = () => {
    
    this.setState({ isShowMultipleSpurs: false });

    let showLoadSpotAssignmentAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
    
    this.setState({ showLoadSpotAssignmentAuthenticationLayout }, () => {
      if (showLoadSpotAssignmentAuthenticationLayout === false) {
        this.railLoadSpotSave();
      }
  });
  }

  railLoadSpotSave= () => {

    this.handleAuthenticationClose();
    this.setState({ loadSpotAssignmentSaveEnabled: false });
     
    const modRailWagonBatchPlanList = lodash.cloneDeep(
      this.state.modRailWagonBatchPlanList
    );
   
        
    const obj = {
      ShareHolderCode:
        this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railDispatchCode,
      KeyCodes: [
        {
          key: KeyCodes.railDispatchCode,
          value: this.state.modRailDispatch.DispatchCode,
        },
      ],
      Entity: modRailWagonBatchPlanList,
    };
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_LoadSportAssignment_status",
      messageResultDetails: [
        {
          keyFields: ["RailDispatchPlanDetail_DispatchCode"],
          keyValues: [this.state.modRailDispatch.DispatchCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateRailDispatchBatchPlan,
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
          // this.initialLoadSpotAssignmentList();
          this.getRailDispatch({
            Common_Code: this.state.modRailDispatch.DispatchCode,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            loadSpotAssignmentSaveEnabled: true,
          });
          console.log(
            "Error in handleLoadSpotAssignSave: ",
            result.ErrorList
          );
        }
        this.props.onNotify(notification);
      })
      .catch((error) => {
        this.setState({
          loadSpotAssignmentSaveEnabled: true,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onNotify(notification);
      });
  }

  validateLoadSpotAssignSave(modRailWagonBatchPlanList) {
    const notification = {
      messageType: "critical",
      message: "ViewRailDispatch_LoadSportAssignment_status",
      messageResultDetails: [],
    };

    const railDispatchLoadSpotAssignmentDefMod = lodash.cloneDeep(
      railDispatchLoadSpotAssignmentDef
    );
    for (let item of modRailWagonBatchPlanList) {
      railDispatchLoadSpotAssignmentDefMod.forEach((col) => {
        let error = "";
        if (col.validator !== undefined) {
          error = Utilities.validateField(col.validator, item[col.field]);
        }
        if (error !== "") {
          notification.messageResultDetails.push({
            keyFields: ["RailDispatchPlanDetail_DispatchCode", col.displayName],
            keyValues: [
              this.state.modRailDispatch.DispatchCode,
              item[col.field],
            ],
            isSuccess: false,
            errorMessage: error,
          });
        }
      });
    }
    if (notification.messageResultDetails.length > 0) {
      this.props.onNotify(notification);
      return false;
    } else {
      return true;
    }
  }

  // Record Weight

  handleOpenRecordWeight = (setReadyToRender = false) => {
    try {
      if (setReadyToRender) {
        this.setState(
          {
            isOpenSubPage: true,
            isReadyToRender: true,
            recordWeightSaveEnabled: true,
          },
          () => this.props.onSetRightPaneDisplay(false)
        );
      } else {
        this.setState(
          {
            isOpenSubPage: true,
            recordWeightSaveEnabled: true,
          },
          () => this.props.onSetRightPaneDisplay(false)
        );
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleOpenRecordWeight",
        error
      );
    }
  };

  handleRecordWeightCellDataEdit = (newVal, cellData) => {
    const modWeightBridgeData = lodash.cloneDeep(
      this.state.modWeightBridgeData
    );

    modWeightBridgeData[cellData.rowIndex][cellData.field] = newVal;

    if (cellData.field === "TareWeightWeightBridgeCode") {
      modWeightBridgeData[cellData.rowIndex].TareWeightUOM =
        this.state.weightBridgeSetting[newVal].WeightUOM;
    } else if (cellData.field === "LadenWeightWeightBridgeCode") {
      modWeightBridgeData[cellData.rowIndex].LadenWeightUOM =
        this.state.weightBridgeSetting[newVal].WeightUOM;
    }

    this.setState({ modWeightBridgeData });
  };

  handleRecordWeightReset = () => {
    this.setState({
      modWeightBridgeData: lodash.cloneDeep(this.state.weightBridgeData),
    });
  };

  handleRecordWeightSave = () => {
    try {
      this.setState({ recordWeightSaveEnabled: false });
      const modWeightBridgeData = lodash.cloneDeep(
        this.state.modWeightBridgeData
      );
      for (let item of modWeightBridgeData) {
        if (item.TareWeight !== null) {
          item.TareWeight = Utilities.convertStringtoDecimal(item.TareWeight);
        }
        if (item.LadenWeight !== null) {
          item.LadenWeight = Utilities.convertStringtoDecimal(item.LadenWeight);
        }
      }
      if (this.validateRecordWeightSave(modWeightBridgeData)) {
        const dispatchTrailerWeighBridgeInfoList = [];
        const currentTime = new Date();
        let sequenceNo = 1;
        for (let item of modWeightBridgeData) {
          if (item.TareWeight !== null && item.TareWeight > 0) {
            dispatchTrailerWeighBridgeInfoList.push({
              DispatchCode: this.state.modRailDispatch.DispatchCode,
              TrailerCode: item.WagonCode,
              MeasuredWeight: item.TareWeight,
              WeighedTime: currentTime,
              IsTareWeight: true,
              IsOperatorOverWritable: item.TareWeightOperatorOverWritten,
              WeighbridgeCode: item.TareWeightWeightBridgeCode,
              WeightUOM: item.TareWeightUOM,
              ShareholderCode: this.props.selectedShareholder,
              IsWeighInOnly: false,
              Remarks: "",
              SequenceNo: sequenceNo,
              Attributes: [],
              FinishedProductCode: item.FinishedProductCode,
              CarrierCompanyCode: item.CarrierCompanyCode,
              TransportationType: Constants.TransportationType.RAIL,
              StartTime: item.StartTime,
              EndTime: item.EndTime
            });
            sequenceNo += 1;
          }
          if (item.LadenWeight !== null && item.LadenWeight > 0) {
            dispatchTrailerWeighBridgeInfoList.push({
              DispatchCode: this.state.modRailDispatch.DispatchCode,
              TrailerCode: item.WagonCode,
              MeasuredWeight: item.LadenWeight,
              WeighedTime: currentTime,
              IsTareWeight: false,
              IsOperatorOverWritable: item.LadenWeightOperatorOverWritten,
              WeighbridgeCode: item.LadenWeightWeightBridgeCode,
              WeightUOM: item.LadenWeightUOM,
              ShareholderCode: this.props.selectedShareholder,
              IsWeighInOnly: false,
              Remarks: "",
              SequenceNo: sequenceNo,
              Attributes: [],
              FinishedProductCode: item.FinishedProductCode,
              CarrierCompanyCode: item.CarrierCompanyCode,
              TransportationType: Constants.TransportationType.RAIL,
              StartTime: item.StartTime,
              EndTime: item.EndTime
            });
            sequenceNo += 1;
          }
        }
        const obj = {
          ShareHolderCode:
            this.props.userDetails.EntityResult.PrimaryShareholder,
          keyDataCode: KeyCodes.railDispatchCode,
          KeyCodes: [
            {
              key: KeyCodes.railDispatchCode,
              value: this.state.modRailDispatch.DispatchCode,
            },
          ],
          Entity: dispatchTrailerWeighBridgeInfoList,
        };
        const notification = {
          messageType: "critical",
          message: "ShipmentCompDetail_SavedStatus",
          messageResultDetails: [
            {
              keyFields: ["RailDispatchPlanDetail_DispatchCode"],
              keyValues: [this.state.modRailDispatch.DispatchCode],
              isSuccess: false,
              errorMessage: "",
            },
          ],
        };
        axios(
          RestAPIs.RailDispatchRecordWeight,
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
              this.getRailDispatch({
                Common_Code: this.state.modRailDispatch.DispatchCode,
              });
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              this.setState({
                recordWeightSaveEnabled: true,
              });
              console.log(
                "Error in UpdateRailDispatchPlanWithWagon: ",
                result.ErrorList
              );
            }
            this.props.onNotify(notification);
          })
          .catch((error) => {
            this.setState({
              recordWeightSaveEnabled: true,
            });
            notification.messageResultDetails[0].errorMessage = error;
            this.props.onNotify(notification);
          });
      } else {
        this.setState({ recordWeightSaveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite: Error occurred on handleRecordWeightSave",
        error
      );
    }
  };

  validateRecordWeightSave(modWeightBridgeData) {
    const notification = {
      messageType: "critical",
      message: "ShipmentCompDetail_SavedStatus",
      messageResultDetails: [],
    };
    let weightCheckFlag = false;
    for (let item of modWeightBridgeData) {
      if (item.TareWeight !== null && item.TareWeight !== "") {
        weightCheckFlag = true;
        if (
          item.TareWeightWeightBridgeCode === null ||
          item.TareWeightWeightBridgeCode === ""
        ) {
          notification.messageResultDetails.push({
            keyFields: ["Rail_Wagon_Code"],
            keyValues: [item.WagonCode],
            isSuccess: false,
            errorMessage: "ViewShipment_WBMandatory",
          });
        }
      }
      if (item.LadenWeight !== null && item.LadenWeight !== "") {
        weightCheckFlag = true;
        if (
          item.LadenWeightWeightBridgeCode === null ||
          item.LadenWeightWeightBridgeCode === ""
        ) {
          notification.messageResultDetails.push({
            keyFields: ["Rail_Wagon_Code"],
            keyValues: [item.WagonCode],
            isSuccess: false,
            errorMessage: "ViewShipment_WBMandatory",
          });
        }
      }

      if (
        item.StartTime >=
        item.EndTime
      ) {
        notification.messageResultDetails.push({
          keyFields: ["Rail_Wagon_Code"],
          keyValues: [item.WagonCode],
          isSuccess: false,
          errorMessage: "MarineDispatchManualEntry_ErrorLoadTime",
        });

      }
    }
    if (!weightCheckFlag) {
      notification.messageResultDetails.push({
        keyFields: ["RailDispatchPlanDetail_DispatchCode"],
        keyValues: [this.state.modRailDispatch.DispatchCode],
        isSuccess: false,
        errorMessage: "ERRMSG_RAIL_DISPATCH_WAGON_WEIGHBRIDGE_INFO_EMPTY",
      });
    }
    if (notification.messageResultDetails.length > 0) {
      this.props.onNotify(notification);
      return false;
    } else {
      return true;
    }
  }
  getKPIList(railDispatchCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    )
    if (KPIView === true) {

      let objKPIRequestData = {
        PageName: kpiRailShipmentDetails,
        TransportationType: Constants.TransportationType.RAIL,
        InputParameters: [{ key: "ShipmentCode", value: railDispatchCode }],
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
            this.setState({ railDispatchKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ railDispatchKPIList: [] });
            console.log("Error in pipeline KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting PipelineDispatch KPIList:", error);
        });
    }
  }
  getMaxCompartments() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=VirtualPreset",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (!isNaN(parseInt(result.EntityResult["RailMaximumNumberOfWagonsPerTrain "]))) {
            this.setState({ maxNumberOfCompartments: parseInt(result.EntityResult["RailMaximumNumberOfWagonsPerTrain "]) })
          }
        }
      });
    } catch (error) {
      console.log("Error while getting RailDispatchDetailsComposite getMaxCompartments:", error);
    }
  }
  // Render

  
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
      showWagonAssignmentAuthenticationLayout: false,
      showProductAssignmentAuthenticationLayout: false,
      showLoadSpotAssignmentAuthenticationLayout : false,
      showManualEntryAuthenticationLayout : false,
    });
  };


  getFunctionGroupName() {
    if(this.state.showAuthenticationLayout  || this.state.showWagonAssignmentAuthenticationLayout )
      return fnRailDispatch
      else if(this.state.showProductAssignmentAuthenticationLayout)
      return fnRailDispatchProductAssignment
      else if(this.state.showLoadSpotAssignmentAuthenticationLayout)
      return fnRailDispatchLoadSpotAssignment
      else if(this.state.showManualEntryAuthenticationLayout)
      return fnViewRailLoadingDetails
    
   };

   getDeleteorEditMode() {
    if(this.state.showAuthenticationLayout || this.state.showWagonAssignmentAuthenticationLayout)
  return this.state.railDispatch.DispatchCode  === ""
    ? functionGroups.add
    : functionGroups.modify
    else if(this.state.showManualEntryAuthenticationLayout)
      return functionGroups.add;
    else
      return functionGroups.modify;
   };

   handleOperation()  {
  
    if(this.state.showAuthenticationLayout)
      return this.saveRailDispatch
    else if(this.state.showWagonAssignmentAuthenticationLayout)
      return this.railWagonSave
    else if(this.state.showProductAssignmentAuthenticationLayout)
      return this.productAssignmentSave
    else if(this.state.showLoadSpotAssignmentAuthenticationLayout)
      return this.railLoadSpotSave
    else if(this.state.showManualEntryAuthenticationLayout)
      return this.addLoadingDetails
   
 };

 showPasswordCheckPopupModal()
 {
 return this.state.showAuthenticationLayout 
            || this.state.showWagonAssignmentAuthenticationLayout 
            || this.state.showProductAssignmentAuthenticationLayout
            || this.state.showLoadSpotAssignmentAuthenticationLayout
            || this.state.showManualEntryAuthenticationLayout
            ? (
          <UserAuthenticationLayout
          Username={this.props.userDetails.EntityResult.UserName}
          functionName={this.getDeleteorEditMode()}
          functionGroup={this.getFunctionGroupName()}
          handleClose={this.handleAuthenticationClose}
          handleOperation={this.handleOperation()}
            ></UserAuthenticationLayout>
          ) : null
 }
 
 

  render() {
     
    const popUpContents = [
      {
        fieldName: "RailDispatchPlanList_DateLastModified",
        fieldValue:
          new Date(
            this.state.modRailDispatch.UpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modRailDispatch.UpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "RailDispatchPlanDetail_LastActiveTime",
        fieldValue:
          this.state.modRailDispatch.LastActiveTime !== undefined &&
            this.state.modRailDispatch.LastActiveTime !== null
            ? new Date(
              this.state.modRailDispatch.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modRailDispatch.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "RailDispatchPlanDetail_CreateTime",
        fieldValue:
          new Date(
            this.state.modRailDispatch.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modRailDispatch.CreatedTime).toLocaleTimeString(),
      },
    ];
    const shipmentFrom = [];
    Object.keys(Constants.shipmentFrom).forEach((element) => {
      if (element === "None" || element === "Contract")
        shipmentFrom.push({
          text: element,
          value: Constants.shipmentFrom[element],
        });
    });
    const modalData = this.state.modalData;
    const isDispatchSave = this.state.tabActiveIndex === 0;

    if (!this.state.isReadyToRender) {
      return <LoadingPage message="Loading"></LoadingPage>;
    } else {
      if (!this.state.isOpenSubPage) {
        return (
          <div>
            <ErrorBoundary>
              <TMDetailsHeader
                entityCode={this.state.railDispatch.DispatchCode}
                newEntityName="RailDispatchPlanDetail_NewRailDispatch"
                popUpContents={popUpContents}
              />
            </ErrorBoundary>
            <TMDetailsKPILayout KPIList={this.state.railDispatchKPIList}> </TMDetailsKPILayout>
            <ErrorBoundary>
              <RailDispatchDetails
                railDispatch={this.state.railDispatch}
                modRailDispatch={this.state.modRailDispatch}
                modAssociations={this.state.modAssociations}
                modWagonDetails={this.state.modWagonDetails}
                validationErrors={this.state.validationErrors}
                selectedAssociations={this.state.selectedAssociations}
                listOptions={{
                  shareholders: this.state.shareholders,
                  terminalCodes: this.props.terminalCodes,
                  quantityUOMs: this.state.quantityUOMOptions,
                  routeCodes: this.getRouteCodeSearchOptions(),
                  railWagonCategories: this.state.railWagonCategoryOptions,
                  contractCodes: this.state.contractCodeOptions,
                  createdFromEntities: shipmentFrom,
                  finishedProducts: this.state.finishedProductOptions,
                  customerDestinations: this.state.customerDestinationOptions,
                }}
                attributeValidationErrors={this.state.attributeValidationErrors}
                onAttributeCellDataEdit={this.handleAttributeCellDataEdit}
                onCompAttributeCellDataEdit={
                  this.handleCompAttributeCellDataEdit
                }
                selectedAttributeList={this.state.selectedAttributeList}
                toggleExpand={this.toggleExpand}
                expandedRows={this.state.expandedRows}
                tabActiveIndex={this.state.tabActiveIndex}
                railRouteData={this.state.railRouteData}
                onFieldChange={this.handleChange}
                onDateTextChange={this.handleDateTextChange}
                onAllTerminalsChange={this.handleAllTerminalsChange}
                onAssociationSelectionChange={
                  this.handleAssociationSelectionChange
                }
                onCellDataEdit={this.handleCellDataEdit}
                onWagonCellDataEdit={this.handleWagonCellDataEdit}
                onAddAssociation={this.handleAddAssociation}
                onDeleteAssociation={this.handleDeleteAssociation}
                onRouteSearchChange={this.handleRouteSearchChange}
                toggleWagonExpand={this.toggleWagonExpand}
                expandedWagonRows={this.state.expandedWagonRows}
                onTabChange={this.handleTabChange}
                currentAccess={this.props.currentAccess}
                isEnterpriseNode={
                  this.props.userDetails.EntityResult.IsEnterpriseNode
                }
                compartmentDetailsPageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                enableHSEInspection={this.props.enableHSEInspection}
                railLookUpData={this.props.railLookUpData}
                WagonDetailTab={
                  this.state.railDispatch.DispatchCode === "" ||
                    this.state.railDispatch.DispatchCode === null ||
                    this.state.railDispatch.DispatchCode === undefined
                    ? []
                    : [""]
                }
                shipmentSource={this.props.shipmentSource}
              />
            </ErrorBoundary>

            <ErrorBoundary>
              <TMDetailsUserActions
                handleBack={this.props.onBack}
                handleSave={
                  isDispatchSave ? this.handleSave : this.handleCompartmentSave
                }
                handleReset={this.handleReset}
                saveEnabled={
                  isDispatchSave
                    ? this.state.saveEnabled
                    : this.state.compartmentSaveEnabled
                }
              />
            </ErrorBoundary>
            {this.showPasswordCheckPopupModal()}
            <ErrorBoundary>
              <TranslationConsumer>
                {(t) => (
                  <>
                    <Modal
                      size="mini"
                      open={
                        this.state.modalData.forceCompleteCompartment.isOpen
                      }
                      closeOnDimmerClick={false}
                    >
                      <Modal.Content>
                        <p>{t("ForceToComplete")}</p>
                      </Modal.Content>
                      <Modal.Footer>
                        <Button
                          content={t("AccessCardInfo_Ok")}
                          onClick={this.handleForceCompleteCompartment}
                        />
                        <Button
                          content={t("AccessCardInfo_Cancel")}
                          onClick={() => {
                            modalData.forceCompleteCompartment.isOpen = false;
                            this.setState({ modalData });
                          }}
                        />
                      </Modal.Footer>
                    </Modal>
                  </>
                )}
              </TranslationConsumer>
            </ErrorBoundary>
          </div>
        );
      } else {
        if (
          this.props.subPageName === "RailDispatchCompartmentManualEntryDetails"
        ) {
          return (
            <div>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      newEntityName={
                        this.state.modRailDispatch.DispatchCode +
                        " - " +
                        t("ManualEntry")
                      }
                    />
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
              {
              this.showPasswordCheckPopupModal()
              }
              <ErrorBoundary>
                <RailDispatchCompartmentManualEntryDetails
                  modLoadingDataInfo={this.state.modLoadingDataInfo}
                  validationErrors={this.state.manualEntryValidationDict}
                  listOptions={{
                    wagonCodes: this.state.wagonCodeOptions,
                    clusterCodes: this.state.clusterCodeOptions,
                    BCUCodes: this.state.BCUCodeOptions,
                    loadingArmCodes: this.state.loadingArmCodeOptions,
                    quantityUOMs: this.state.quantityUOMOptions,
                    densityUOMs: this.state.densityUOMOptions,
                    temperatureUOMs: this.state.temperatureUOMOptions,
                    tankCodes: this.getTankCodeSearchOptions(),
                    meterCodes: this.getMeterCodeSearchOptions(),
                  }}
                  selectedAttributeList={
                    this.state.manualEntrySelectedAttributeList
                  }
                  attributeValidationErrorList={
                    this.state.manualEntryAttributeValidationErrorList
                  }
                  onAttributeCellDataEdit={
                    this.handleManualEntryAttributeCellDataEdit
                  }
                  onFieldChange={this.handleCompartmentManualEntryChange}
                  onDateTextChange={this.handleManualDateTextChange}
                  //onDateTextChange={this.handleManualEntryDateTextChange}
                  onTankSearchChange={this.handleTankSearchChange}
                  onMeterSearchChange={this.handleMeterSearchChange}
                  onTabChange={this.handleManualEntryTabChange}
                  tabActiveIndex={this.state.manualEntryTabActiveIndex}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div className="row">
                      <div className="col col-lg-4">
                        <Button
                          className="backButton"
                          onClick={this.handleSubPageBackOnClick}
                          content={t("Back")}
                        />
                      </div>
                      <div
                        className="col col-lg-8"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          content={t("LookUpData_btnReset")}
                          className="cancelButton"
                          onClick={this.handleCompartmentManualEntryReset}
                        />
                        <Button
                          content={t("Save")}
                          onClick={this.handleCompartmentManualEntrySave}
                          disabled={
                            !this.state.compartmentManualEntrySaveEnabled
                          }
                        />
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            </div>
          );
        } else if (
          this.props.subPageName === "RailDispatchViewAuditTrailDetails"
        ) {
          return (
            <div>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      newEntityName={
                        this.state.modRailDispatch.DispatchCode +
                        " - " +
                        t("ViewRailDispatchList_ViewAuditTrail")
                      }
                    />
                  )}
                </TranslationConsumer>
              </ErrorBoundary>

              <ErrorBoundary>
                <RailDispatchViewAuditTrailDetails
                  modRailDispatch={this.state.modRailDispatch}
                  auditTrailList={this.state.auditTrailList}
                  modalData={this.state.modalData}
                  onModalDataChange={this.handleModalDataChange}
                  onPrint={this.handlePrintAuditTrail}
                  Attributes={
                    this.state.auditTrailList !== undefined &&
                      this.state.auditTrailList.length > 0
                      ? this.state.auditTrailList[0].AttributesforUI
                      : []
                  }
                />
              </ErrorBoundary>

              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div className="row">
                      <div className="col col-lg-4">
                        <Button
                          className="backButton"
                          onClick={this.handleSubPageBackOnClick}
                          content={t("Back")}
                        />
                      </div>
                      <div
                        className="col col-lg-8"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          content={t("ViewAuditTrail_PrintAuditTrail")}
                          onClick={this.handleOpenPrintAuditTrailPreview}
                        />
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            </div>
          );
        } else if (
          this.props.subPageName === "RailDispatchViewLoadingDetailsDetails"
        ) {
          return (
            <div>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      newEntityName={
                        this.state.modRailDispatch.DispatchCode +
                        " - " +
                        t("ViewRailDispatchList_ViewTransactions")
                      }
                    />
                  )}
                </TranslationConsumer>
              </ErrorBoundary>

              <ErrorBoundary>
                <RailDispatchViewLoadingDetailsDetails
                  loadingDetailsList={this.state.loadingDetailsList}
                  hideColumnList={this.state.loadingDetailsHideColumnList}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div className="row">
                      <div className="col col-lg-4">
                        <Button
                          className="backButton"
                          onClick={this.handleSubPageBackOnClick}
                          content={t("Back")}
                        />
                      </div>
                      <div
                        className="col col-lg-8"
                        style={{ textAlign: "right" }}
                      ></div>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            </div>
          );
        } else if (
          this.props.subPageName === "RailDispatchRailWagonAssignmentDetails"
        ) {
          return (
            <div>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      newEntityName={
                        this.state.modRailDispatch.DispatchCode +
                        " - " +
                        t("RailDispatchList_WagonAssignment")
                      }
                    />
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
              {
              this.showPasswordCheckPopupModal()
              }
              <ErrorBoundary>
                <RailDispatchRailWagonAssignmentDetails
                  listOptions={{
                    carrierCodes: this.state.carrierCodeOptions,
                    trailerCodes: this.state.trailerCodeOptions,
                  }}
                  modRailWagonList={this.state.modRailWagonList}
                  data={this.state.railWagonAssignmentData}
                  onFieldChange={this.handleRailWagonAssignmentChange}
                  selectedRow={this.state.selectedRailWagons}
                  onSelectionChange={this.handleRailWagonSelectionChange}
                  onAssignWagon={this.handleRailWagonAssignmentAdd}
                  onDeleteWagon={this.handleRailWagonAssignmentDelete}
                  onMoveWagon={this.handleRailWagonAssignmentMove}
                  onReverseSelect={this.handleRailWagonAssignmentReverseSelect}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div className="row">
                      <div className="col col-lg-4">
                        <Button
                          className="backButton"
                          onClick={this.handleSubPageBackOnClick}
                          content={t("Back")}
                        />
                      </div>
                      <div
                        className="col col-lg-8"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          content={t("LookUpData_btnReset")}
                          className="cancelButton"
                          onClick={this.handleRailWagonAssignReset}
                        />
                        <Button
                          content={t("Save")}
                          onClick={this.handleRailWagonAssignSave}
                          disabled={!this.state.railWagonAssignmentSaveEnabled}
                        />
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            </div>
          );
        } else if (
          this.props.subPageName === "RailDispatchProductAssignmentDetails"
        ) {
          return (
            <div>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      newEntityName={
                        this.state.modRailDispatch.DispatchCode +
                        " - " +
                        t("RailDispatchList_ProductAssignment")
                      }
                    />
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
              {
              this.showPasswordCheckPopupModal()
              }
              <ErrorBoundary>
                <RailDispatchProductAssignmentDetails
                  listOptions={{
                    shareholderCodes: this.state.shareholders,
                    contractCodes: this.state.contractCodeOptions,
                    finishedProductCodes: this.state.finishedProductOptions,
                    customerDestinations: this.state.customerDestinationOptions,
                  }}
                  modRailWagonList={this.state.modRailWagonList}
                  onCellDataEdit={this.handleProductAssignmentCellDataEdit}
                  createdFromEntity={
                    this.state.modRailDispatch.CreatedFromEntity
                  }
                  expandedRows={this.state.productAssignmentExpandedRows}
                  toggleExpand={this.productAssignmentToggleExpand}
                  onCompAttributeCellDataEdit={
                    this.handleProductAssignmentAttributeCellDataEdit
                  }
                  railLookUpData={this.props.railLookUpData}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div className="row">
                      <div className="col col-lg-4">
                        <Button
                          className="backButton"
                          onClick={this.handleSubPageBackOnClick}
                          content={t("Back")}
                        />
                      </div>
                      <div
                        className="col col-lg-8"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          content={t("LookUpData_btnReset")}
                          className="cancelButton"
                          onClick={this.handleProductAssignReset}
                        />
                        <Button
                          content={t("Save")}
                          onClick={this.handleProductAssignSave}
                          disabled={!this.state.productAssignmentSaveEnabled}
                        />
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            </div>
          );
        } else if (
          this.props.subPageName === "RailDispatchLoadSpotAssignmentDetails"
        ) {
          return (
            <div>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      newEntityName={
                        this.state.modRailDispatch.DispatchCode +
                        " - " +
                        t("RailDispatchList_LoadSpotAssignment")
                      }
                    />
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
              {
              this.showPasswordCheckPopupModal()
              }
              <ErrorBoundary>
                <RailDispatchLoadSpotAssignmentDetails
                  listOptions={{
                    spurCodes: this.state.spurCodeOptions,
                    clusterCodes: this.state.loadSpotClusterCodeOptions,
                    BCUCodes: this.state.loadSpotBCUCodeOptions,
                  }}
                  modRailWagonBatchPlanList={
                    this.state.modRailWagonBatchPlanList
                  }
                  onCellDataEdit={this.handleLoadSpotAssignmentCellDataEdit}
                  onAuthorize={this.handleLoadSpotAssignmentAssignWagon}
                />
              </ErrorBoundary>
              <ErrorBoundary>
              <CommonConfirmModal isOpen={this.state.isShowMultipleSpurs} confirmMessage="Confirm_LoadSpot"
                  handleNo={() => { this.setState({ isShowMultipleSpurs:false });
                }} handleYes={() => this.saveLoadSpotAfterConfirm()}></CommonConfirmModal>
                </ErrorBoundary>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div className="row">
                      <div className="col col-lg-4">
                        <Button
                          className="backButton"
                          onClick={this.handleSubPageBackOnClick}
                          content={t("Back")}
                        />
                      </div>
                      <div
                        className="col col-lg-8"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          content={t("LookUpData_btnReset")}
                          className="cancelButton"
                          onClick={this.handleLoadSpotAssignReset}
                        />
                        <Button
                          content={t("Save")}
                          onClick={this.handleLoadSpotAssignSave}
                          disabled={!this.state.loadSpotAssignmentSaveEnabled}
                        />
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            </div>
          );
        } else if (
          this.props.subPageName === "RailDispatchRecordWeightDetails"
        ) {
          return (
            <div>
              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <TMDetailsHeader
                      newEntityName={
                        this.state.modRailDispatch.DispatchCode +
                        " - " +
                        t("ViewRailDispatch_RecordWeight")
                      }
                    />
                  )}
                </TranslationConsumer>
              </ErrorBoundary>

              <ErrorBoundary>
                <RailDispatchRecordWeightDetails
                  listOptions={{
                    weightBridges: this.state.weightBridgeOptions,
                  }}
                  modWeightBridgeData={this.state.modWeightBridgeData}
                  onCellDataEdit={this.handleRecordWeightCellDataEdit}
                  onDateTextChange={this.handleDateTextChange}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                <TranslationConsumer>
                  {(t) => (
                    <div className="row">
                      <div className="col col-lg-4">
                        <Button
                          className="backButton"
                          onClick={this.handleSubPageBackOnClick}
                          content={t("Back")}
                        />
                      </div>
                      <div
                        className="col col-lg-8"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          content={t("LookUpData_btnReset")}
                          className="cancelButton"
                          onClick={this.handleRecordWeightReset}
                        />
                        <Button
                          content={t("Save")}
                          onClick={this.handleRecordWeightSave}
                          disabled={!this.state.recordWeightSaveEnabled}
                        />
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              </ErrorBoundary>
            </div>
          );
        } else {
          return null;
        }
      }
    }
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
)(RailDispatchDetailsComposite);

RailDispatchDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
