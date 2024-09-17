import React, { Component } from "react";
import { COAAssignmentDetails } from "../../UIBase/Details/COAAssignmentDetails";
import { coaassignmentValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import {
  emptyCOAAssignment,
  COATransactionCompartmentDetailInfo,
  COATransactionCompartments,
} from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCOAAssignment } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { coaAssignmentAttributeEntity } from "../../../JS/AttributeEntity";
import { TMUserActionsForDeleteComposite } from "../Common/TMUserActionsForDeleteComposite";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import * as Constants from "../../../JS/Constants";
import ReportDetails from "../../UIBase/Details/ReportDetails";

class COAAssignmentDetailsComposite extends Component {
  state = {
    coaAssignment: lodash.cloneDeep(emptyCOAAssignment),
    modCOAAssignment: lodash.cloneDeep(emptyCOAAssignment),
    modvalidationErrorslist: [],
    selectvalidationErrorslist: [],
    isReadyToRender: false,
    saveEnabled: false,
    showAuthenticationLayout: false,
    attributeMetaData: [],
    attributeMetaDataLists: [],
    modAttributeMetaDataLists: [],
    attributeValidationListErrors: [],
    attributeValidationError: [],
    bayCodes: [],
    tankCodes: [],
    baseCOACodes: [],
    isShowDeleteComposite: false,
    deleteForIndex: -1,
    showReport: false,
    selectCompartment: lodash.cloneDeep(COATransactionCompartments),
  };

  handleModalBack = () => {
    this.setState({ showReport: false });
  };

  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/CertificateOfAnalysis";
    } else {
      path = "TM/" + Constants.TMReports + "/CertificateOfAnalysis";
    }
    let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      Shareholder: this.props.selectedShareholder,
      ShipmentCode: modCOAAssignment.TransactionCode,
      TransportType: "ROAD",
    };
    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleModalBack}
        handleModalClose={this.handleModalBack}
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }

  setCurrentList = (data, index) => {
    try {
      let modvalidationErrorslist = lodash.cloneDeep(
        this.state.modvalidationErrorslist
      );

      this.setState(
        {
          selectCompartment: data,
          selectvalidationErrorslist: modvalidationErrorslist[index],
          isReadyToRender: false,
        },
        () => {
          this.setState({ isReadyToRender: true });
          this.GetBayCode();
          this.GetTankCode();
        }
      );
    } catch (error) {
      console.log(
        "COAAssignmentDetailsComposite:Error occured on setCurrentList",
        error
      );
    }
  };

  handleAddCompartmentDetail = () => {
    try {
      let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
      let modvalidationErrorslist = lodash.cloneDeep(
        this.state.modvalidationErrorslist
      );
      let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
      let selectvalidationErrorslist = lodash.cloneDeep(
        this.state.selectvalidationErrorslist
      );
      if (
        selectCompartment.CompartmentSeqNumber !== undefined &&
        selectCompartment.CompartmentSeqNumber !== null
      ) {
        selectCompartment.COATransactionCompartmentDetails.push(
          lodash.clone(COATransactionCompartmentDetailInfo)
        );

        selectvalidationErrorslist.push(
          lodash.clone(
            Utilities.getInitialValidationErrors(coaassignmentValidationDef)
          )
        );
        var i = modCOAAssignment.COATransactionCompartments.findIndex((ele) => {
          return (
            ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
          );
        });

        modvalidationErrorslist[i] = selectvalidationErrorslist;

        modCOAAssignment.COATransactionCompartments[i] = selectCompartment;
        this.GetBayCode();
        this.GetTankCode();

        this.setState({
          selectCompartment,
          modCOAAssignment,
          selectvalidationErrorslist,
          modvalidationErrorslist,
        });
      }
    } catch (error) {
      console.log("Error in getting handleAddCompartmentDetail:" + error);
    }
  };

  GetTankCode = () => {
    let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
    let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
    let keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: modCOAAssignment.TransactionCode,
      },
      {
        key: KeyCodes.coaSeqNumber,
        value: selectCompartment.CompartmentSeqNumber,
      },
      {
        key: KeyCodes.transportaionType,
        value: modCOAAssignment.TransportationType,
      },
      {
        key: KeyCodes.TransactionType,
        value: modCOAAssignment.TransactionType,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetCOATransactionTankCodes,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let tempTankCodes = [];
          result.EntityResult.forEach((item) => {
            tempTankCodes.push(item.Code);
          });
          this.setState({
            tankCodes: tempTankCodes,
          });
        } else {
          this.setState({
            tankCodes: [],
          });
          console.log("Error in getting tankCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting tankCodes:", error);
      });
  };

  GetBayCode = () => {
    let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
    let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
    let keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: modCOAAssignment.TransactionCode,
      },
      {
        key: KeyCodes.coaSeqNumber,
        value: selectCompartment.CompartmentSeqNumber,
      },
      {
        key: KeyCodes.transportaionType,
        value: modCOAAssignment.TransportationType,
      },
      {
        key: KeyCodes.TransactionType,
        value: modCOAAssignment.TransactionType,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetCOATransactionBayCodes,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let tempBayCodes = [];
          result.EntityResult.forEach((item) => {
            tempBayCodes.push(item.Code);
          });
          this.setState({
            bayCodes: tempBayCodes,
          });
        } else {
          this.setState({
            bayCodes: [],
          });
          console.log("Error in getting bayCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting bayCodes:", error);
      });
  };

  handleDeleteCompartmentDetail = (index) => {
    this.setState({
      deleteForIndex: index,
      isShowDeleteComposite: true,
    });
  };

  handleDelete = (isDelete) => {
    try {
      if (isDelete) {
        let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
        let modvalidationErrorslist = lodash.cloneDeep(
          this.state.modvalidationErrorslist
        );
        let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
        let deleteForIndex = lodash.clone(this.state.deleteForIndex);
        let selectvalidationErrorslist = lodash.cloneDeep(
          this.state.selectvalidationErrorslist
        );

        selectCompartment.COATransactionCompartmentDetails.splice(
          deleteForIndex,
          1
        );

        selectvalidationErrorslist.splice(deleteForIndex, 1);

        var i = modCOAAssignment.COATransactionCompartments.findIndex((ele) => {
          return (
            ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
          );
        });

        modCOAAssignment.COATransactionCompartments[i] = selectCompartment;
        modvalidationErrorslist[i] = selectvalidationErrorslist;
        this.setState({
          selectCompartment,
          modCOAAssignment,
          selectvalidationErrorslist,
          isShowDeleteComposite: false,
          modvalidationErrorslist,
        });
      } else {
        this.setState({
          isShowDeleteComposite: false,
        });
      }
    } catch (error) {
      console.log("Error occured on handleDelete", error);
    }
  };

  terminalSelectionChange(selectedTerminals, index) {
    try {
      let attributeMetaDataLists = lodash.cloneDeep(
        this.state.attributeMetaDataLists
      );
      let modAttributeMetaDataLists = lodash.cloneDeep(
        this.state.modAttributeMetaDataLists
      );
      const attributeValidationListErrors = lodash.cloneDeep(
        this.state.attributeValidationListErrors
      );
      let attributeMetaDataList = attributeMetaDataLists[index];
      let attributesTerminalsList = [];
      let modAttributeMetaDataList = modAttributeMetaDataLists[index];

      const attributeValidationErrors = attributeValidationListErrors[index];
      let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);

      selectedTerminals.forEach((terminal) => {
        let existitem = modAttributeMetaDataList.COAASSIGNMENT.find(
          (selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          }
        );

        if (existitem === undefined) {
          attributeMetaDataList.COAASSIGNMENT.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              let Attributevalue = selectCompartment.Attributes.find(
                (coaAssignmentAttribute) => {
                  return coaAssignmentAttribute.TerminalCode === terminal;
                }
              );
              if (Attributevalue !== undefined) {
                attributeMetaData.attributeMetaDataList.COAASSIGNMENT.forEach(
                  function (attributeMetaData) {
                    let valueAttribute =
                      Attributevalue.ListOfAttributeData.find((x) => {
                        return x.AttributeCode === attributeMetaData.Code;
                      });
                    if (valueAttribute !== undefined)
                      attributeMetaData.DefaultValue =
                        valueAttribute.AttributeValue;
                  }
                );
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
        let existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        }
      });

      this.setState({
        modAttributeMetaDataLists,
        attributeValidationListErrors,
      });
    } catch (error) {
      console.log(
        "CoaAssignmentDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      let attributeMetaDataLists = lodash.cloneDeep(
        this.state.attributeMetaDataLists
      );
      if (attributeMetaDataLists.length > 0) {
        for (let i = 0; i < attributeMetaDataLists.length; i++) {
          let element = attributeMetaDataLists[i];
          if (
            Array.isArray(element.COAASSIGNMENT) &&
            element.COAASSIGNMENT.length > 0
          ) {
            this.terminalSelectionChange(
              [element.COAASSIGNMENT[0].TerminalCode],
              i
            );
          }
        }
      }
    } catch (error) {
      console.log(
        "COAAssignmentDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleAttributeDataChange = (attribute, value) => {
    try {
      let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
      let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
      let CompartmentIndex =
        modCOAAssignment.COATransactionCompartments.findIndex((ele) => {
          return (
            ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
          );
        });
      let modAttributeMetaDataLists = lodash.cloneDeep(
        this.state.modAttributeMetaDataLists
      );

      let matchedAttributes = [];
      let modAttributeMetaDataList =
        modAttributeMetaDataLists[CompartmentIndex];

      let matchedAttributesList = modAttributeMetaDataList.COAASSIGNMENT.filter(
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
      const attributeValidationListErrors = lodash.cloneDeep(
        this.state.attributeValidationListErrors
      );
      let attributeValidationErrors =
        attributeValidationListErrors[CompartmentIndex];

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({
        attributeValidationListErrors,
        modAttributeMetaDataLists,
      });
    } catch (error) {
      console.log(
        "CoaAssignmentDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      let attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.COAASSIGNMENT
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleTankCodeChange = (data, index) => {
    try {
      let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
      let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
      let selectvalidationErrorslist = lodash.cloneDeep(
        this.state.selectvalidationErrorslist
      );
      if (data !== undefined && data !== "") {
        selectvalidationErrorslist[index].TankCode = "";
      }

      if (selectCompartment.CompartmentSeqNumber >= 0) {
        selectCompartment.COATransactionCompartmentDetails[index].TankCode =
          data;

        selectCompartment.COATransactionCompartmentDetails[index].BaseCOACode =
          "";
        selectCompartment.COATransactionCompartmentDetails[
          index
        ].COATransactionCompartmentDetailParameterInfos = [];

        var i = modCOAAssignment.COATransactionCompartments.findIndex((ele) => {
          return (
            ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
          );
        });

        modCOAAssignment.COATransactionCompartments[i] = selectCompartment;

        this.setState({
          selectvalidationErrorslist,
          selectCompartment,
          modCOAAssignment,
        });

        axios(
          RestAPIs.GetTransactionBaseCOACodes + "?tankCode=" + data,
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            let result = response.data;
            if (result.IsSuccess === true) {
              let tempBaseCOACodes = [];
              result.EntityResult.forEach((item) => {
                tempBaseCOACodes.push(item.Code);
              });
              this.setState({
                baseCOACodes: tempBaseCOACodes,
              });
            } else {
              this.setState({
                baseCOACodes: [],
              });
              console.log(
                "Error in gettemplateFromTemplate:",
                result.ErrorList
              );
            }
          })
          .catch((error) => {
            console.log(
              "Error while getting Template FromTemplate List:",
              error
            );
          });

        this.setState({
          selectCompartment,
          modCOAAssignment,
        });
      }
    } catch (error) {
      console.log(
        "CoaAssignmentDetailsComposite:Error occured on handleTankCodeChange",
        error
      );
    }
  };

  handleBaseCOAChange = (data, index) => {
    let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
    let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
    let selectvalidationErrorslist = lodash.cloneDeep(
      this.state.selectvalidationErrorslist
    );

    if (data !== undefined && data !== "") {
      selectvalidationErrorslist[index].BaseCOACode = "";
    }

    if (selectCompartment.CompartmentSeqNumber >= 0) {
      selectCompartment.COATransactionCompartmentDetails[index].BaseCOACode =
        data;

      var i = modCOAAssignment.COATransactionCompartments.findIndex((ele) => {
        return (
          ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
        );
      });

      modCOAAssignment.COATransactionCompartments[i] = selectCompartment;

      this.setState(
        { selectvalidationErrorslist, isReadyToRender: false },
        () => {
          this.setState({ isReadyToRender: true });
        }
      );

      let customerCode = selectCompartment.CustomerCode;
      let fpCode = selectCompartment.FinishedProductCode;

      let keyCode = [
        {
          key: KeyCodes.customerCode,
          value: customerCode,
        },
        {
          key: KeyCodes.finishedProductCode,
          value: fpCode,
        },
        {
          key: KeyCodes.coaManagementCode,
          value: data,
        },
      ];
      let obj = {
        ShareHolderCode: this.props.selectedShareholder,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetParametersByAssignment,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess === true) {
            selectCompartment.COATransactionCompartmentDetails[
              index
            ].COATransactionCompartmentDetailParameterInfos =
              result.EntityResult;
            this.setState(
              {
                selectCompartment,
                modCOAAssignment,
                isReadyToRender: false,
              },
              () => {
                this.setState({ isReadyToRender: true });
              }
            );
          } else {
            let notification = {
              messageType: "critical",
              message: "COAAssignmentDetails_GetStatus",
              messageResultDetails: [
                {
                  keyFields: ["COAAssignmentCode"],
                  keyValues: [modCOAAssignment.TransactionCode],
                  isSuccess: false,
                  errorMessage: "",
                },
              ],
            };
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.props.onSaved(modCOAAssignment, "update", notification);
            selectCompartment.COATransactionCompartmentDetails[
              index
            ].COATransactionCompartmentDetailParameterInfos = [];

            this.setState({
              selectCompartment,
              modCOAAssignment,
            });
            console.log("Error in getting bayCodes:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting bayCodes:", error);
        });
    }
  };

  handleChange = (propertyName, data, index) => {
    try {
      let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);
      let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);

      selectCompartment.COATransactionCompartmentDetails[index][propertyName] =
        data;

      var i = modCOAAssignment.COATransactionCompartments.findIndex((ele) => {
        return (
          ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
        );
      });

      modCOAAssignment.COATransactionCompartments[i] = selectCompartment;

      this.setState({
        selectCompartment,
        modCOAAssignment,
      });
    } catch (error) {
      console.log(
        "COAAssignmentDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        nextProps.selectedRow.TransactionCode !== undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCOAAssignment(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "COAAssignmentDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
    } catch (error) {
      console.log(
        "COAAssignmentDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(coaAssignmentRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [coaAssignmentAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaData: lodash.cloneDeep(result.EntityResult),
              attributeValidationError:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.COAASSIGNMENT
                ),
            },
            () => this.getCOAAssignment(coaAssignmentRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getCOAAssignment(selectedRow) {
    let keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: selectedRow.TransactionCode,
      },
      {
        key: KeyCodes.transportaionType,
        value: selectedRow.TransportationType,
      },
      {
        key: KeyCodes.TransactionType,
        value: selectedRow.TransactionType,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
    };

    let saveEnabled = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnCOAAssignment
    );

    axios(
      RestAPIs.GetCOAAssignment,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          const attributeMetaData = lodash.cloneDeep(
            this.state.attributeMetaData
          );
          const attributeValidationError = lodash.cloneDeep(
            this.state.attributeValidationError
          );
          let selectCompartmentindex =
            result.EntityResult.COATransactionCompartments.findIndex((c) => {
              return c.COATransactionCompartmentDetails.length > 0;
            });

          let modvalidationErrorslist = [];
          let attributeMetaDataLists = [];
          let attributeValidationListErrors = [];

          for (
            let i = 0;
            i < result.EntityResult.COATransactionCompartments.length;
            i++
          ) {
            const ele = result.EntityResult.COATransactionCompartments[i];
            modvalidationErrorslist.push([]);
            attributeMetaDataLists.push(lodash.cloneDeep(attributeMetaData));
            if (ele.Attributes !== null && ele.Attributes !== undefined) {
              for (let n = 0; n < ele.Attributes.length; n++) {
                let attribute = attributeMetaDataLists[i].COAASSIGNMENT.find(
                  (att) => {
                    return att.TerminalCode === ele.Attributes[n].TerminalCode;
                  }
                );
                for (
                  let index = 0;
                  index < ele.Attributes[n].ListOfAttributeData.length;
                  index++
                ) {
                  let attributeMeta = attribute.attributeMetaDataList.find(
                    (arr) => {
                      return (
                        arr.Code ===
                        ele.Attributes[n].ListOfAttributeData[index]
                          .AttributeCode
                      );
                    }
                  );

                  if (attributeMeta !== null && attributeMeta !== undefined) {
                    attributeMeta.DefaultValue =
                      ele.Attributes[n].ListOfAttributeData[
                        index
                      ].AttributeValue;
                  }
                }
              }
            }
            attributeValidationListErrors.push(
              lodash.cloneDeep(attributeValidationError)
            );
            ele.COATransactionCompartmentDetails.forEach(() => {
              modvalidationErrorslist[i].push(
                Utilities.getInitialValidationErrors(coaassignmentValidationDef)
              );
            });
          }

          let selectCompartment =
            result.EntityResult.COATransactionCompartments[0];
          let selectvalidationErrorslist = modvalidationErrorslist[0];

          if (selectCompartmentindex > -1) {
            selectCompartment =
              result.EntityResult.COATransactionCompartments[
                selectCompartmentindex
              ];

            selectvalidationErrorslist =
              modvalidationErrorslist[selectCompartmentindex];
          }
          this.setState(
            {
              isReadyToRender: true,
              coaAssignment: result.EntityResult,
              modCOAAssignment: result.EntityResult,
              saveEnabled: saveEnabled,
              selectCompartment: selectCompartment,
              modvalidationErrorslist,
              selectvalidationErrorslist,
              attributeMetaDataLists,
              modAttributeMetaDataLists: attributeMetaDataLists,
              attributeValidationListErrors,
            },
            () => {
              this.localNodeAttribute();
            }
          );
        } else {
          this.setState({
            isReadyToRender: true,
            coaAssignment: lodash.cloneDeep(emptyCOAAssignment),
            modCOAAssignment: lodash.cloneDeep(emptyCOAAssignment),
            saveEnabled: saveEnabled,
          });
          console.log("Error in getCOAAssignment:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting coaAssignment:", error, selectedRow);
      });
  }

  validateSave() {
    let attributeList = [];
    this.state.modAttributeMetaDataLists.forEach((ele) => {
      let attribute = Utilities.attributesConverttoLocaleString(
        ele.COAASSIGNMENT
      );
      attributeList.push(attribute);
    });

    let selectvalidationErrorslist = lodash.cloneDeep(
      this.state.selectvalidationErrorslist
    );
    let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);

    selectCompartment.COATransactionCompartmentDetails.forEach((obj, i) => {
      Object.keys(coaassignmentValidationDef).forEach(function (key) {
        selectvalidationErrorslist[i][key] = Utilities.validateField(
          coaassignmentValidationDef[key],
          obj[key]
        );
      });
    });

    let modvalidationErrorslist = lodash.cloneDeep(
      this.state.modvalidationErrorslist
    );
    let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);
    modCOAAssignment.COATransactionCompartments.forEach((ele, m) => {
      modCOAAssignment.COATransactionCompartments[
        m
      ].COATransactionCompartmentDetails.forEach((obj, n) => {
        Object.keys(coaassignmentValidationDef).forEach(function (key) {
          modvalidationErrorslist[m][n][key] = Utilities.validateField(
            coaassignmentValidationDef[key],
            obj[key]
          );
        });
      });
    });

    this.setState({ selectvalidationErrorslist, modvalidationErrorslist });
    let returnValue = true;

    selectCompartment.COATransactionCompartmentDetails.forEach((obj) => {
      if (
        obj.BayCode === undefined ||
        obj.BayCode === null ||
        obj.BayCode === ""
      ) {
        return (returnValue = false);
      }
      if (
        obj.TankCode === undefined ||
        obj.TankCode === null ||
        obj.BayCode === ""
      ) {
        return (returnValue = false);
      }
      if (
        obj.BaseCOACode === undefined ||
        obj.BaseCOACode === null ||
        obj.BayCode === ""
      ) {
        return (returnValue = false);
      }
    });
    if (returnValue)
      modvalidationErrorslist.forEach((ele, m) => {
        modvalidationErrorslist[m].forEach((validationErrors, n) => {
          if (returnValue) {
            returnValue = Object.values(validationErrors).every(function (
              value
            ) {
              return value === "";
            });
          }
        });
      });

    let notification = {
      messageType: "critical",
      message: "COAAssignmentDetails_GetStatus",
      messageResultDetails: [
        {
          keyFields: ["COAAssignmentCode"],
          keyValues: [modCOAAssignment.TransactionCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    if (returnValue) {
      let attributeValidationListErrors = lodash.cloneDeep(
        this.state.attributeValidationListErrors
      );

      for (let i = 0; i < attributeValidationListErrors.length; i++) {
        attributeValidationListErrors[i].forEach(
          (attributeValidationErrors) => {
            attributeList[i].forEach((attribute) => {
              if (
                attributeValidationErrors.TerminalCode ===
                attribute.TerminalCode
              ) {
                attribute.attributeMetaDataList.forEach((attributeMetaData) => {
                  attributeValidationErrors.attributeValidationErrors[
                    attributeMetaData.Code
                  ] = Utilities.valiateAttributeField(
                    attributeMetaData,
                    attributeMetaData.DefaultValue
                  );
                });
              }
            });
          }
        );
      }
      this.setState({ modvalidationErrorslist, attributeValidationListErrors });

      let compart = [];

      for (let i = 0; i < attributeValidationListErrors.length; i++) {
        let compartNum = i + 1;
        attributeValidationListErrors[i].forEach((x) => {
          if (
            !Object.values(x.attributeValidationErrors).every(function (value) {
              return value === "" || value === null;
            }) &&
            compart.indexOf(compartNum) < 0
          ) {
            compart.push(compartNum);
          }
        });
      }

      if (compart.length > 0) {
        returnValue = false;
        notification.messageResultDetails[0].errorMessage =
          "ERRMSG_COAASSIGNMENT_VALIDATION" +
          Constants.delimiter +
          compart.toString();
        this.props.onSaved(modCOAAssignment, "update", notification);
      }
    }

    if (returnValue) {
      for (
        let m = 0;
        m < modCOAAssignment.COATransactionCompartments.length;
        m++
      ) {
        const compart = modCOAAssignment.COATransactionCompartments[m];

        for (
          let n = 0;
          n < compart.COATransactionCompartmentDetails.length;
          n++
        ) {
          const CompartmentDetail = compart.COATransactionCompartmentDetails[n];
          if (
            CompartmentDetail.COATransactionCompartmentDetailParameterInfos
              .length === 0
          ) {
            notification.messageResultDetails[0].errorMessage =
              "ERRMSG_COAASSIGNMENT_CUSTOMERCOA_EMPTY";
            this.props.onSaved(modCOAAssignment, "update", notification);
            returnValue = false;
            break;
          }
        }
        if (!returnValue) {
          break;
        }
      }
    }
    return returnValue;
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  saveCOAAssignment = () => {
    try {
      this.setState({ saveEnabled: false, isReadyToRender: false });
      let modCOAAssignment = lodash.cloneDeep(this.state.modCOAAssignment);

      let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);

      let selectindex = modCOAAssignment.COATransactionCompartments.findIndex(
        (ele) => {
          return (
            ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
          );
        }
      );

      modCOAAssignment.COATransactionCompartments[selectindex] =
        selectCompartment;

      for (
        let i = 0;
        i < modCOAAssignment.COATransactionCompartments.length;
        i++
      ) {
        let element = modCOAAssignment.COATransactionCompartments[i];

        let attributeList = Utilities.attributesConverttoLocaleString(
          this.state.modAttributeMetaDataLists[i].COAASSIGNMENT
        );

        attributeList = Utilities.attributesDatatypeConversion(attributeList);
        element.Attributes = Utilities.fillAttributeDetails(attributeList);
      }

      this.updateCOAAssignment(modCOAAssignment);
    } catch (error) {
      console.log("COAAssignmentDetailsComposite : Error in saveCOAAssignment");
    }
  };

  handleSave = () => {
    try {
      if (this.validateSave()) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCOAAssignment();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "COAAssignmentDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  updateCOAAssignment(modCOAAssignment) {
    let keyCode = [
      {
        key: KeyCodes.shipmentCode,
        value: modCOAAssignment.TransactionCode,
      },
    ];

    if (modCOAAssignment.ShareholderCode == null) {
      modCOAAssignment.ShareholderCode = this.props.selectedShareholder;
    }
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
      Entity: modCOAAssignment,
    };

    let notification = {
      messageType: "critical",
      message: "COAAssignmentDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["COAAssignmentCode"],
          keyValues: [modCOAAssignment.TransactionCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.COAAssignmentUpdate,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;

        if (!result.IsSuccess) {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in updateCOAAssignment:", result.ErrorList);
        }
        this.setState(
          {
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCOAAssignment
            ),
            showAuthenticationLayout: false,
            modCOAAssignment,
          },
          () => this.getCOAAssignment(modCOAAssignment)
        );
        this.props.onSaved(modCOAAssignment, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCOAAssignment, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnCOAAssignment
          ),
          showAuthenticationLayout: false,
        });
      });
  }

  handleReset = () => {
    try {
      const coaAssignment = lodash.cloneDeep(this.state.coaAssignment);

      let selectCompartmentIndex =
        coaAssignment.COATransactionCompartments.findIndex((c) => {
          return c.COATransactionCompartmentDetails.length > 0;
        });

      if (selectCompartmentIndex < 0) {
        selectCompartmentIndex = 0;
      }

      let modvalidationErrorslist = [];
      for (
        let i = 0;
        i < coaAssignment.COATransactionCompartments.length;
        i++
      ) {
        const ele = coaAssignment.COATransactionCompartments[i];
        modvalidationErrorslist.push([]);
        ele.COATransactionCompartmentDetails.forEach(() => {
          modvalidationErrorslist[i].push(
            Utilities.getInitialValidationErrors(coaassignmentValidationDef)
          );
        });
      }

      const selectvalidationErrorslist =
        modvalidationErrorslist[selectCompartmentIndex];

      this.setState(
        {
          modAttributeMetaDataList: [],
          modCOAAssignment: { ...coaAssignment },
          selectCompartment:
            coaAssignment.COATransactionCompartments[selectCompartmentIndex],
          selectvalidationErrorslist,
          modvalidationErrorslist,
        },
        () => {
          this.localNodeAttribute();
          this.handleResetAttributeValidationError();
        }
      );
    } catch (error) {
      console.log(
        "COAAssignmentDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleCellDataEdit = (newValue, cellData, index) => {
    try {
      let selectCompartment = lodash.cloneDeep(this.state.selectCompartment);

      selectCompartment.COATransactionCompartmentDetails[
        index
      ].COATransactionCompartmentDetailParameterInfos[cellData.rowIndex][
        cellData.field
      ] = newValue;

      this.setState({ selectCompartment });
    } catch (error) {
      console.log(":Error occured on handleCellDataEdit", error);
    }
  };

  handleViewProductCOAReport = () => {
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

  render() {
    const listOptions = {
      tankCodes: this.state.tankCodes,
      baseCOACodes: this.state.baseCOACodes,
      bayCodes: this.state.bayCodes,
    };

    const popUpContents = [
      {
        fieldName: "COAViewComapartment_LastUpdatedTime",
        fieldValue:
          this.state.selectCompartment.LastUpdatedTime !== undefined
            ? this.state.selectCompartment.LastUpdatedTime.toString().indexOf(
                "0001-01-01"
              ) >= 0
              ? ""
              : new Date(
                  this.state.selectCompartment.LastUpdatedTime
                ).toLocaleDateString() +
                " " +
                new Date(
                  this.state.selectCompartment.LastUpdatedTime
                ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "COAViewComapartment_LastUpdatedBy",
        fieldValue:
          this.state.selectCompartment.LastUpdatedBy == null
            ? ""
            : this.state.selectCompartment.LastUpdatedBy,
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <TranslationConsumer>
          {(t) => (
            <ErrorBoundary>
              <TMDetailsHeader
                newEntityName="COAAssignment_Title"
                entityCode={t("COAAssignment_Title")}
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            </ErrorBoundary>
          )}
        </TranslationConsumer>
        <ErrorBoundary>
          <TMUserActionsForDeleteComposite
            onDelete={this.handleDelete}
            isShowDeleteComposite={this.state.isShowDeleteComposite}
            confirmDeleteText="Confirm_Delete"
            cancelText="Cancel"
            submitText="PipelineDispatch_BtnSubmit"
          ></TMUserActionsForDeleteComposite>
        </ErrorBoundary>
        <ErrorBoundary>
          <COAAssignmentDetails
            coaAssignment={this.state.coaAssignment}
            modCOAAssignment={this.state.modCOAAssignment}
            selectCompartment={this.state.selectCompartment}
            selectvalidationErrorslist={this.state.selectvalidationErrorslist}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            setCurrentList={this.setCurrentList}
            handleCellDataEdit={this.handleCellDataEdit}
            attributeValidationListErrors={
              this.state.attributeValidationListErrors
            }
            modAttributeMetaDataLists={this.state.modAttributeMetaDataLists}
            attributeMetaDataLists={this.state.attributeMetaDataLists}
            onAttributeDataChange={this.handleAttributeDataChange}
            handleAddCompartmentDetail={this.handleAddCompartmentDetail}
            handleDeleteCompartmentDetail={this.handleDeleteCompartmentDetail}
            AddEnable={Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCOAAssignment
            )}
            DeleteEnable={Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              fnCOAAssignment
            )}
            handleTankCodeChange={this.handleTankCodeChange}
            handleBaseCOAChange={this.handleBaseCOAChange}
            pageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
          ></COAAssignmentDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row userActionPosition">
                <div className="col col-2">
                  <Button
                    className="backButton"
                    onClick={this.props.onBack}
                    content={t("Back")}
                  ></Button>
                </div>
                <div className="col col-10" style={{ textAlign: "right" }}>
                  {this.state.selectCompartment === undefined ||
                  this.state.selectCompartment.CompartmentSeqNumber ===
                    -1 ? null : (
                    <Button
                      content={t("COAAssignment_ViewCOAReport")}
                      onClick={() => this.handleViewProductCOAReport()}
                    ></Button>
                  )}
                  <Button
                    content={t("LookUpData_btnReset")}
                    className="cancelButton"
                    onClick={() => this.handleReset()}
                  ></Button>
                  <Button
                    content={t("Save")}
                    disabled={!this.state.saveEnabled}
                    onClick={() => this.handleSave()}
                  ></Button>
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnCOAAssignment}
            handleOperation={this.saveCOAAssignment}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
        {this.renderModal()}
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

export default connect(mapStateToProps)(COAAssignmentDetailsComposite);

COAAssignmentDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
