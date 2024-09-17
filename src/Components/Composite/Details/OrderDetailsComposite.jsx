import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import axios from "axios";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { emptyOrder } from "../../../JS/DefaultEntities";
import lodash from "lodash";
import { functionGroups, fnOrder, fnKPIInformation, fnOrderForceClose } from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import OrderDetails from "../../UIBase/Details/OrderDetails";
import { orderValidationDef } from "../../../JS/ValidationDef";
import { orderPlanValidationDef } from "../../../JS/DetailsTableValidationDef";
import {
  orderAttributeEntity,
  orderItemAttributeEntity,
} from "../../../JS/AttributeEntity";
import TruckShipmentProject from "../../Composite/Entity/TruckShipmentComposite";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiOrderDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class OrderDetailsComposite extends Component {
  state = {
    order: {},
    modOrder: {},
    modOrderItems: [],
    validationErrors: Utilities.getInitialValidationErrors(orderValidationDef),
    isReadyToRender: false,
    saveEnabled: false,
    terminalOptions: [],
    volumeUOMOptions: [],
    weightUOMOptions: [],
    selectedPlanRow: [],
    finishedProductOptions: [],
    customerOptions: [],
    attributeMetaDataList: [],
    compartmentAttributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    expandedRows: [],
    isShowTruckShipment: false,
    isShowBackButton: false,
    orderKPIList: [],
    enableForceClose:false,
    showAuthenticationLayout: false,
    showForceCloseAuthenticationLayout: false,
    tempOrder: {},
  };

  // terminalOptions = [];

  componentDidMount() {
    Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
    let isNewOrder = false;
    if (this.props.selectedRow.Common_Code === undefined) isNewOrder = true;
    //this.getOrder(isNewOrder);
    this.getAttributes(isNewOrder);
    this.getTerminalList();
    this.getUOMList();
    this.getFinishedProductList();
    this.getCustomerList();
  }

  getAttributes(isNewOrder) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [orderAttributeEntity, orderItemAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.ORDER
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.ORDER
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.ORDERITEM
              ),
            },
            () => this.getOrder(isNewOrder)
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }
  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.order.OrderCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getOrder(true);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "OrderDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getCustomerList() {
    axios(
      RestAPIs.GetCustomerDestinations +
      "?TransportationType=" +
      Constants.TransportationType.ROAD +
      "&ShareholderCode=" +
      this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    ).then((response) => {
      var result = response.data;
      if (result.IsSuccess === true) {
        if (Array.isArray(result.EntityResult)) {
          let shareholderCustomers = result.EntityResult.filter(
            (shareholderCust) =>
              shareholderCust.ShareholderCode === this.props.selectedShareholder
          );
          if (shareholderCustomers.length > 0) {
            let customerDestinationOptions =
              shareholderCustomers[0].CustomerDestinationsList;
            let customerOptions = Object.keys(customerDestinationOptions);
            customerOptions = Utilities.transferListtoOptions(customerOptions);
            this.setState({ customerOptions });
          } else {
            console.log("no customers identified for shareholder");
          }

          // let finishedProductOptions = Utilities.transferListtoOptions(
          //   result.EntityResult
          // );
          // this.setState({ finishedProductOptions });
        } else {
          console.log("customerdestinations not identified for shareholder");
        }
      }
    });
  }

  getFinishedProductList() {
    axios(
      RestAPIs.GetFinishedProductCodes +
      "?ShareholderCode=" +
      this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    ).then((response) => {
      var result = response.data;
      if (result.IsSuccess === true) {
        if (
          Array.isArray(result.EntityResult) &&
          result.EntityResult.length > 0
        ) {
          let finishedProductOptions = Utilities.transferListtoOptions(
            result.EntityResult
          );
          this.setState({ finishedProductOptions });
        }
      }
    });
  }
  getUOMList() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        // console.log(response);
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let weightUOMs = result.EntityResult.MASS;
            let weightUOMOptions = [];
            weightUOMs.forEach((weightOption) => {
              weightUOMOptions.push({
                text: weightOption,
                value: weightOption,
              });
            });

            let volumeUOMs = result.EntityResult.VOLUME;
            let volumeUOMOptions = [];
            volumeUOMs.forEach((volumeOption) => {
              volumeUOMOptions.push({
                text: volumeOption,
                value: volumeOption,
              });
            });

            // let lengthUOMs = result.EntityResult.LENGTH;
            // let lengthUOMOptions = [];
            // lengthUOMs.forEach((lengthOption) => {
            //   lengthUOMOptions.push({
            //     text: lengthOption,
            //     value: lengthOption,
            //   });
            // });

            this.setState({
              volumeUOMOptions,
              weightUOMOptions,
            });
          }
        } else {
          console.log("Error in getUOM:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getUOM:", error);
      });
  }

  getTerminalList() {
    try {
      axios(
        RestAPIs.GetTerminals,
        Utilities.getAuthenticationObjectforPost(
          [this.props.selectedShareholder],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          )
            this.setState({ terminalOptions: result.EntityResult });
        }
      });
    } catch (err) {
      console.log("OrderComposite:Error occured on getTerminalsList", err);
    }
  }

  handleChange = (propertyName, data) => {
    try {
      let modOrder = lodash.cloneDeep(this.state.modOrder);
      modOrder[propertyName] = data;
      //this.setState({ modOrder });

      const validationErrors = { ...this.state.validationErrors };
      if (modOrder.Active === this.state.order.Active) {
        if (
          this.state.order.Remarks === modOrder.Remarks ||
          modOrder.Remarks === ""
        ) {
          validationErrors.Remarks = "";
        }
        // if (modOrder.Remarks === "")
        //   modOrder.Remarks = this.state.order.Remarks;
      }
      if (propertyName === "Active") {
        if (modOrder.Active !== this.state.order.Active) {
          modOrder.Remarks = "";
        }
      }
      if (orderValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          orderValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modOrder }, () => {
        if (propertyName === "TerminalCodes") {
          this.terminalSelectionChange(data);
        }
      });
    } catch (error) {
      console.log("OrderDetailsComposite:Error occured on handleChange", error);
    }
  };

  handleRowSelectionChange = (planRow) => {
    this.setState({ selectedPlanRow: planRow });
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modOrderItems = lodash.cloneDeep(this.state.modOrderItems);

    modOrderItems[cellData.rowIndex][cellData.field] = newVal;

    this.setState({ modOrderItems });
  };

  handleAddPlan = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        let newPlan = {
          // primaryKey: null,
          Attributes: [],
          BlockedQuantity: null,
          FinishedProductCode: null,
          FinishdedProductType: null,
          ItemCode: null,
          LoadedQuantity: null,
          LotNumber: null,
          OrderCode: null,
          Quantity: null,
          QuantityUOM:
            this.props.userDetails.EntityResult.PageAttibutes
              .DefaultQtyUOMForTransactionUI.ROAD,
          RemainingQuantity: null,
          ShareholderCode: null,
        };
        let modOrderItems = lodash.cloneDeep(this.state.modOrderItems);

        newPlan.SeqNumber =
          Utilities.getMaxSeqNumberfromListObject(modOrderItems);

        modOrderItems.push(newPlan);

        this.setState(
          {
            modOrderItems,
            selectedPlanRow: [],
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
            } else
              this.formCompartmentAttributes(this.state.modOrder.TerminalCodes);
          }
        );
      } catch (error) {
        console.log(
          "OrderDetailsComposite:Error occured on handleAddCompartment",
          error
        );
      }
    }
  };

  handleDeletePlan = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedPlanRow != null &&
          this.state.selectedPlanRow.length > 0
        ) {
          if (this.state.modOrderItems.length > 0) {
            let modOrderItems = lodash.cloneDeep(this.state.modOrderItems);

            this.state.selectedPlanRow.forEach((obj, index) => {
              modOrderItems = modOrderItems.filter((plan, cindex) => {
                return plan.SeqNumber !== obj.SeqNumber;
              });
            });

            // let start = 1;
            // modOrder.OrderItems.forEach((plan) => {
            //   plan.primaryKey = start;
            //   ++start;
            // });

            this.setState({ modOrderItems });
          }
        }

        this.setState({ selectedPlanRow: [] });
      } catch (error) {
        console.log(
          "OrderDetailsComposite:Error occured on handleDeleteCompartment",
          error
        );
      }
    }
  };

  getOrder(isNewOrder) {
    if (isNewOrder) {
      //this.terminalOptions = [];
      emptyOrder.OrderStartDate = new Date();
      // emptyOrder.OrderEndDate = new Date();
      emptyOrder.TerminalCodes =
        this.state.terminalOptions.length === 1
          ? [...this.state.terminalOptions]
          : [];
      emptyOrder.OrderDate = new Date();
      this.handleResetAttributeValidationError();
      this.setState(
        {
          order: lodash.cloneDeep(emptyOrder),
          modOrder: lodash.cloneDeep(emptyOrder),
          modOrderItems: [],
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          orderKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnOrder
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );

      return;
    }

    let keyCode = [
      {
        key: KeyCodes.orderCode,
        value:
          this.props.selectedRow.Common_Code === undefined
            ? this.state.modOrder.OrderCode
            : this.props.selectedRow.Common_Code,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.orderCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetOrder,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;

        if (result.IsSuccess === true) {
          let modOrderItems = [];
          if (
            result.EntityResult !== null &&
            result.EntityResult.OrderItems !== null &&
            result.EntityResult.OrderItems.length > 0
          ) {
            modOrderItems = Utilities.addSeqNumberToListObject(
              lodash.cloneDeep(result.EntityResult.OrderItems)
            );
          }
          this.setState(
            {
              isReadyToRender: true,
              order: lodash.cloneDeep(result.EntityResult),
              modOrder: lodash.cloneDeep(result.EntityResult),
              modOrderItems: lodash.cloneDeep(modOrderItems),
              saveEnabled:
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnOrder
                ) &&
                result.EntityResult.OrderStatus !==
                Constants.orderStatus.CLOSED &&
                result.EntityResult.OrderStatus !==
                Constants.orderStatus.FULLY_DELIVERED,
              enableForceClose: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnOrder
              ),
            },
           
            () => {
              this.getKPIList(this.props.selectedShareholder, result.EntityResult.OrderCode)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            modOrder: lodash.cloneDeep(emptyOrder),
            order: lodash.cloneDeep(emptyOrder),
            isReadyToRender: true,
          });
          console.log("Error in GetOrder:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Order:", error);
      });
  }

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
        "OrderDetailsComposite:Error occured on handleResetAttributeValidationError",
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

      var modOrder = lodash.cloneDeep(this.state.modOrder);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modOrder.Attributes.find(
                (orderAttribute) => {
                  return orderAttribute.TerminalCode === terminal;
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

      this.formCompartmentAttributes(selectedTerminals);

      this.setState({ modAttributeMetaDataList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "OrderDetailsComposite:Error occured on terminalSelectionChange",
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
      let modOrderItems = lodash.cloneDeep(this.state.modOrderItems);

      modOrderItems.forEach((comp) => {
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
              MinValue: attribute.MinValue,
              MaxValue: attribute.MaxValue,
              ValidationFormat: attribute.ValidationFormat,
              compSequenceNo: "",
            });
          });
        });
        let attributesforNewComp = lodash.cloneDeep(compAttributes);

        if (
          comp.Code === null &&
          (comp.AttributesforUI === null || comp.AttributesforUI === undefined)
        ) {
          comp.AttributesforUI = [];
          attributesforNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.SeqNumber;
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
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesforUI.push(assignedAttributes);
            });
          } else {
            compAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo = comp.SeqNumber;
              comp.AttributesforUI.push(assignedAttributes);
            });
          }
        }
        this.toggleExpand(comp, true, true);
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI = Utilities.compartmentAttributesConvertoDecimal(
            comp.AttributesforUI
          );
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modOrderItems });
    } catch (error) {
      console.log(
        "OrderDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }

  fillAttributeDetails(modOrder, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modOrder.Attributes = Utilities.fillAttributeDetails(attributeList);

      // For Compartment Attributes
      modOrder.OrderItems.forEach((comp) => {
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesDatatypeConversion(
              comp.AttributesforUI
            );
        let selectedTerminals = [];
        if (this.props.userDetails.EntityResult.IsEnterpriseNode)
          selectedTerminals = lodash.cloneDeep(modOrder.TerminalCodes);
        else {
          var compAttributeMetaDataList = lodash.cloneDeep(
            this.state.compartmentAttributeMetaDataList
          );
          if (compAttributeMetaDataList.length > 0)
            selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
        }
        let terminalAttributes = [];
        comp.Attributes = [];
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
            //})
            //comp.Attributes.push(attribute);
          });
          if (
            attribute.ListOfAttributeData !== null &&
            attribute.ListOfAttributeData !== undefined &&
            attribute.ListOfAttributeData.length > 0
          )
            comp.Attributes.push(attribute);
        });
      });
      return modOrder;
    } catch (error) {
      console.log(
        "OrderDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList) &&
        attributeMetaDataList.length > 0
      )
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      else {
        var compAttributeMetaDataList = lodash.cloneDeep(
          this.state.compartmentAttributeMetaDataList
        );
        if (
          Array.isArray(compAttributeMetaDataList) &&
          compAttributeMetaDataList.length > 0
        )
          this.formCompartmentAttributes([
            compAttributeMetaDataList[0].TerminalCode,
          ]);
      }
    } catch (error) {
      console.log(
        "OrderDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleDateTextChange = (propertyName, value, error) => {
    try {
      let validationErrors = { ...this.state.validationErrors };
      let modOrder = { ...this.state.modOrder };
      validationErrors[propertyName] = error;
      modOrder[propertyName] = value;
      this.setState({ validationErrors, modOrder });
    } catch (error) {
      console.log(
        "OrderDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
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
        "OrderDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modOrderItems = lodash.cloneDeep(this.state.modOrderItems);
    let compIndex = modOrderItems.findIndex(
      (item) => item.SeqNumber === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0)
      modOrderItems[compIndex].AttributesforUI[
        //compAttribute.rowIndex
        compAttribute.rowData.SeqNumber - 1
      ].AttributeValue = value;
    this.setState({ modOrderItems });
    if (compIndex >= 0) this.toggleExpand(modOrderItems[compIndex], true, true);
  };

  handleAllTerminalsChange = (checked) => {
    try {
      const modOrder = lodash.cloneDeep(this.state.modOrder);
      if (checked) modOrder.TerminalCodes = [...this.state.terminalOptions];
      else modOrder.TerminalCodes = [];
      this.setState({ modOrder });
      this.terminalSelectionChange(modOrder.TerminalCodes);
    } catch (error) {
      console.log(
        "OrderComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  fillDetails() {
    try {
      let modOrder = lodash.cloneDeep(this.state.modOrder);

      modOrder.ShareholderCode = this.props.selectedShareholder;

      if (this.state.order.OrderCode === "") modOrder.OrderDate = new Date();

      modOrder.OrderItems = lodash.cloneDeep(this.state.modOrderItems);

      if (modOrder.OrderItems !== null && modOrder.OrderItems.length > 0) {
        modOrder.OrderItems.forEach((plan) => {
          plan.OrderCode = modOrder.OrderCode;
          plan.ShareholderCode = modOrder.ShareholderCode;
          if (plan.Quantity !== null && plan.Quantity !== "")
            plan.Quantity = plan.Quantity.toLocaleString();
          delete plan.SeqNumber;
          if (
            plan.AttributesforUI !== undefined &&
            plan.AttributesforUI != null
          )
            plan.AttributesforUI =
              Utilities.compartmentAttributesConverttoLocaleString(
                plan.AttributesforUI
              );
        });
      }
      return modOrder;
    } catch (err) {
      console.log("OrderDetailsComposite:Error occured on filldetails", err);
    }
  }
  convertStringtoDecimal(modOrder, attributeList) {
    try {
      modOrder.OrderItems.forEach((plan) => {
        plan.Quantity = Utilities.convertStringtoDecimal(plan.Quantity);
      });
      modOrder = this.fillAttributeDetails(modOrder, attributeList);
      return modOrder;
    } catch (err) {
      console.log("convertStringtoDecimal error order details", err);
    }
  }


  addUpdateOrder = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempOrder = lodash.cloneDeep(this.state.tempOrder);

      this.state.order.OrderCode === ""
      ? this.createOrder(tempOrder)
      : this.updateOrder(tempOrder);
    } catch (error) {
      console.log("Order Composite : Error in addUpdateOrder");
    }
  };

  

  handleSave = () => {
    try {
      let returnValue = Object.values(this.state.validationErrors).every(
        function (value) {
          return value === "";
        }
      );
      if (returnValue) {
       // this.setState({ saveEnabled: false });
        let modOrder = this.fillDetails();
        let attributeList = Utilities.attributesConverttoLocaleString(
          this.state.modAttributeMetaDataList
        );

        if (this.validateSave(modOrder, attributeList)) {
          modOrder = this.convertStringtoDecimal(modOrder, attributeList);
          //if (modOrder !== null)
          modOrder = Utilities.convertDatesToString(
            DateFieldsInEntities.DatesInEntity.Order,
            modOrder
          );
          

            let showAuthenticationLayout =
            this.props.userDetails.EntityResult.IsWebPortalUser !== true
              ? true
              : false;
          let tempOrder = lodash.cloneDeep(modOrder);
          this.setState({ showAuthenticationLayout, tempOrder }, () => {
            if (showAuthenticationLayout === false) {
              this.addUpdateOrder();
            }
        });


          modOrder = Utilities.convertStringToDates(
            DateFieldsInEntities.DatesInEntity.Order,
            modOrder
          );
          // else this.setState({ saveEnabled: true });
        } else {
          this.setState({ saveEnabled: true });
        }
      }
    } catch (error) {
      console.log("OrderDetailsComposite:Error occured on handleSave", error);
    }
  };

  validateSave(modOrder, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(orderValidationDef).forEach(function (key) {
      if (modOrder[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          orderValidationDef[key],
          modOrder[key]
        );
    });

    if (modOrder.Active !== this.state.order.Active) {
      if (modOrder.Remarks === "") {
        validationErrors["Remarks"] = "ShipmentOrder_RemarksRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "OrderInfo_SavedStatus",
      messageResultDetails: [],
    };

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

    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
    else return returnValue;

    if (modOrder.OrderItems.length > 0) {
      modOrder.OrderItems.forEach((com) => {
        orderPlanValidationDef.forEach((col) => {
          let err = "";

          if (col.validator !== undefined) {
            err = Utilities.validateField(col.validator, com[col.field]);
          }

          // if (col.field === "Quantity" && err === "") {
          //   let quantity = Utilities.convertStringtoDecimal(
          //     com.Quantity
          //   ).toString();
          //   if (quantity.length > 15) err = "Common_MaxLengthExceeded";
          // }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: [col.displayName],
              keyValues: [com[col.field]],
              isSuccess: false,
              errorMessage: err,
            });
          }
        });
        if (com.AttributesforUI !== null && com.AttributesforUI !== undefined) {
          com.AttributesforUI.forEach((item) => {
            let errMsg = Utilities.valiateAttributeField(
              item,
              item.AttributeValue
            );
            if (errMsg !== "") {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                notification.messageResultDetails.push({
                  keyFields: ["CompAttributeTerminal", item.AttributeName],
                  keyValues: [item.TerminalCode, item.AttributeValue],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              } else {
                notification.messageResultDetails.push({
                  keyFields: [item.AttributeName],
                  keyValues: [item.AttributeValue],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              }
            }
          });
        }
        this.toggleExpand(com, true, true);
      });
    } else {
      notification.messageResultDetails.push({
        keyFields: ["ShipmentOrder_OrderCode"],
        keyValues: [modOrder.OrderCode],
        isSuccess: false,
        errorMessage: "ShipmentOrder_MandatoryOrderPlan",
      });
    }

    this.setState({ validationErrors });
    returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modOrder, "update", notification);
      return false;
    }
    return returnValue;
  }

  toggleExpand = (data, open, isTerminalAdded = false) => {
    //console.log("Data in Toggle", data)
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
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

  handleViewShipments = () => {
    this.setState(
      {
        isShowTruckShipment: true,
        isShowBackButton: true,
      },
      () => this.props.handleOperationVisibility(false)
    );
  };

  handleBack = () => {
    this.setState(
      {
        isShowTruckShipment: false,
        isShowBackButton: false,
      },
      () => {
        this.props.handleOperationVisibility(true);
        this.getOrder(false);
      }
    );
  };

  handleShowBackButton = (status) => {
    this.setState({
      isShowBackButton: status,
    });
  };

  forceCloseOperation = () => {

    let modOrder = lodash.cloneDeep(this.state.tempOrder);
    
    let keyCode = [
      {
        key: KeyCodes.orderCode,
        value: modOrder.OrderCode,
      },
    ];

    let entity = {
      OrderCode: modOrder.OrderCode,
      ShareholderCode: this.props.selectedShareholder,
      ForceCloseReason: modOrder.Remarks,
      ForceClose: true,
    };

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.orderCode,
      KeyCodes: keyCode,
      Entity: entity,
    };

    let notification = {
      messageType: "critical",
      message: "OrderInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ShipmentOrder_OrderCode"],
          keyValues: [modOrder.OrderCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateOrderStatus,
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
          this.getOrder(false);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateOrderStatus:", result.ErrorList);
        }
        this.props.onSaved(modOrder, "add", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modOrder, "add", notification);
      });
  };


  handleForceClose = () => {
    let modOrder = lodash.cloneDeep(this.state.modOrder);

    if (modOrder.Remarks === "") {
      let validationErrors = this.state.validationErrors;
      validationErrors["Remarks"] = "ShipmentOrder_RemarksRequired";
      this.setState({ validationErrors });
    } else {

      let showForceCloseAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;
    let tempOrder = lodash.cloneDeep(modOrder);
    this.setState({ showForceCloseAuthenticationLayout, tempOrder }, () => {
      if (showForceCloseAuthenticationLayout === false) {
        this.forceCloseOperation();
      }
  });
    }
  };

  createOrder(modOrder) {
    this.handleAuthenticationClose();
    let keyCode = [
      {
        key: KeyCodes.orderCode,
        value: modOrder.OrderCode,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.orderCode,
      KeyCodes: keyCode,
      Entity: modOrder,
    };

    let notification = {
      messageType: "critical",
      message: "OrderInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ShipmentOrder_OrderCode"],
          keyValues: [modOrder.OrderCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateOrder,
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
              fnOrder
            ),
          });

          this.getOrder(false);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnOrder
            ),
          });
          console.log("Error in CreateOrder:", result.ErrorList);
        }

        this.props.onSaved(this.state.modOrder, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnOrder
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modOrder, "add", notification);
      });
  }

  updateOrder(modOrder) {
    this.handleAuthenticationClose();
    let keyCode = [
      {
        key: KeyCodes.orderCode,
        value: modOrder.OrderCode,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.orderCode,
      KeyCodes: keyCode,
      Entity: modOrder,
    };

    let notification = {
      messageType: "critical",
      message: "OrderInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ShipmentOrder_OrderCode"],
          keyValues: [modOrder.OrderCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateOrder,
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
              fnOrder
            ),
          });
          this.getOrder(false);
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnOrder
            ),
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateOrder:", result.ErrorList);
        }

        this.props.onSaved(this.state.modOrder, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modOrder, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnOrder
          ),
        });
      });
  }

  handleReset = () => {
    try {
      let modOrderItems = Utilities.addSeqNumberToListObject(
        lodash.cloneDeep(this.state.order.OrderItems)
      );
      this.setState(
        {
          modOrder: lodash.cloneDeep(this.state.order),
          modOrderItems: modOrderItems,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(this.state.order.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      // if (this.state.order.Code === "") {
      //   //let terminalOptions = { ...this.state.terminalOptions };
      //   let terminalOptions = [];
      //   this.setState({ terminalOptions });
      // }
      let validationErrors = { ...this.state.validationErrors };
      Object.keys(validationErrors).forEach((key) => {
        validationErrors[key] = "";
      });
      this.setState({ validationErrors });
    } catch (error) {
      console.log("OrderDetailsComposite:Error occured on handleReset", error);
    }
  };
  //Get KPI for order
  getKPIList(shareholder, orderCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiOrderDetail,
        TransportationType: Constants.TransportationType.ROAD,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "OrderCode", value: orderCode }],
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
            this.setState({ orderKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ orderKPIList: [] });
            console.log("Error in order KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Order KPIList:", error);
        });
    }
  }

  handleOperation() {
    if (this.state.showAuthenticationLayout)
      return this.addUpdateOrder;
    else if (this.state.showForceCloseAuthenticationLayout)
      return this.forceCloseOperation;
    
  }

  getFunctionGroupName() {
     if (this.state.showForceCloseAuthenticationLayout)
      return fnOrderForceClose;
    else if (this.state.showAuthenticationLayout)
      return fnOrder;
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
      showForceCloseAuthenticationLayout: false,
    });
  };
  
  render() {
    let listOptions = {
      terminalCodes: this.state.terminalOptions,
      // orderTypeOptions: Utilities.transferListtoOptions(
      //   Object.keys(Constants.orderType)
      // ),
      unitOfVolume: this.state.volumeUOMOptions,
      unitOfWeight: this.state.weightUOMOptions,
      finishedProductOptions: this.state.finishedProductOptions,
      customerOptions: this.state.customerOptions,
    };

    const popUpContents = [
      {
        fieldName: "ShipmentOrder_LastUpdated",
        fieldValue:
          new Date(this.state.modOrder.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modOrder.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "ShipmentOrder_LastActiveTime",
        fieldValue:
          this.state.modOrder.LastActiveTime !== undefined &&
            this.state.modOrder.LastActiveTime !== null
            ? new Date(
              this.state.modOrder.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(this.state.modOrder.LastActiveTime).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "ShipmentOrder_CreatedTime",
        fieldValue:
          new Date(this.state.modOrder.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modOrder.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        {this.state.isShowTruckShipment ? null : (
          <ErrorBoundary>
            <TMDetailsHeader
              // entityCode={this.state.isShowTruckShipment ? this.state.order.OrderCode + " - " + t("Shipment_OtherSource") : this.state.order.OrderCode}
              entityCode={this.state.order.OrderCode}
              newEntityName="ShipmentOrder_NewOrder"
              popUpContents={
                this.state.isShowTruckShipment ? "" : popUpContents
              }
            ></TMDetailsHeader>
          </ErrorBoundary>
        )}
        {this.state.isShowTruckShipment ? (
          <ErrorBoundary>
            <TruckShipmentProject
              shipmentSource={Constants.shipmentFrom.Order}
              shipmentSourceCode={this.state.modOrder.OrderCode}
              selectedShareholder={this.props.selectedShareholder}
              shipmentSourceCompartmentItems={this.state.modOrderItems}
              shipmentSourceDetails={this.state.modOrder}
              isShowBackButton={this.handleShowBackButton}
            />
          </ErrorBoundary>
        ) : (
          <><TMDetailsKPILayout KPIList={this.state.orderKPIList}> </TMDetailsKPILayout>
            <ErrorBoundary>
              <OrderDetails
                order={this.state.order}
                modOrder={this.state.modOrder}
                modOrderItems={this.state.modOrderItems}
                validationErrors={this.state.validationErrors}
                listOptions={listOptions}
                onFieldChange={this.handleChange}
                onDateTextChange={this.handleDateTextChange}
                onAllTerminalsChange={this.handleAllTerminalsChange}
                handleAddPlan={this.handleAddPlan}
                handleDeletePlan={this.handleDeletePlan}
                selectedPlanRow={this.state.selectedPlanRow}
                handleRowSelectionChange={this.handleRowSelectionChange}
                handleCellDataEdit={this.handleCellDataEdit}
                selectedShareholder={this.props.selectedShareholder}
                isEnterpriseNode={
                  this.props.userDetails.EntityResult.IsEnterpriseNode
                }
                attributeValidationErrors={this.state.attributeValidationErrors}
                onAttributeDataChange={this.handleAttributeDataChange}
                handleCompAttributeCellDataEdit={
                  this.handleCompAttributeCellDataEdit
                }
                modAttributeMetaDataList={this.state.modAttributeMetaDataList}
                toggleExpand={this.toggleExpand}
                expandedRows={this.state.expandedRows}
                compartmentDetailsPageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                handleForceClose={this.handleForceClose}
                  handleViewShipments={this.handleViewShipments}
                  enableForceClose={this.state.enableForceClose}
              ></OrderDetails>
            </ErrorBoundary></>
        )}
        {this.state.isShowTruckShipment ? (
          this.state.isShowBackButton ? (
            <div className="row">
              <div className="col col-lg-8" style={{ marginTop: "1%" }}>
                <TranslationConsumer>
                  {(t) => (
                    <Button
                      className="backButton"
                      onClick={this.handleBack}
                      content={t("Back")}
                    ></Button>
                  )}
                </TranslationConsumer>
              </div>
            </div>
          ) : null
        ) : (
          <ErrorBoundary>
            <TMDetailsUserActions
              handleBack={this.props.onBack}
              handleSave={this.handleSave}
              handleReset={this.handleReset}
              saveEnabled={this.state.saveEnabled}
            ></TMDetailsUserActions>
          </ErrorBoundary>
        )}

      {this.state.showAuthenticationLayout || this.state.showForceCloseAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.order.OrderCode   === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={this.getFunctionGroupName()}
            handleOperation={this.handleOperation()}
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

export default connect(mapStateToProps)(OrderDetailsComposite);
