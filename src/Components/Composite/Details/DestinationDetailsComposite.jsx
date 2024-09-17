import React, { Component } from "react";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import ErrorBoundary from "../../ErrorBoundary";
import DestinationDetails from "../../UIBase/Details/DestinationDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { destinationValidationDef } from "../../../JS/ValidationDef";
import lodash from "lodash";
import { functionGroups, fnDestination, fnKPIInformation } from "../../../JS/FunctionGroups";
import { emptyDestination } from "../../../JS/DefaultEntities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import PropTypes from "prop-types";
import { customerDestinationValidationDef } from "../../../JS/DetailsTableValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { destinationAttributeEntity } from "../../../JS/AttributeEntity";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiDestinationDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class DestinationDetailsComposite extends Component {
  state = {
    destination: {},
    modDestination: {},
    modAssociations: [],
    validationErrors: Utilities.getInitialValidationErrors(
      destinationValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    selectedAssociations: [],
    customerOptions: [],
    isValidShareholderSysExtCode: false,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    destinationKPIList: [],
    showAuthenticationLayout: false,
    tempDestination: {},
  };
  handleChange = (propertyName, data) => {
    try {
      const modDestination = lodash.cloneDeep(this.state.modDestination);
      modDestination[propertyName] = data;
      this.setState({ modDestination });
      if (destinationValidationDef[propertyName] !== undefined) {
        var validationErrors = { ...this.state.validationErrors };
        validationErrors[propertyName] = Utilities.validateField(
          destinationValidationDef[propertyName],
          data
        );

        this.setState({ validationErrors });
      }

      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "DestinationDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

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
      var modDestination = lodash.cloneDeep(this.state.modDestination);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.destination.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modDestination.Attributes.find(
                (destinationAttribute) => {
                  return destinationAttribute.TerminalCode === terminal;
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
        "DestinationDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.destination) && attributeMetaDataList.destination.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.destination[0].TerminalCode,
        ]);
      }
     
    } catch (error) {
      console.log(
        "DestinationDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    modAssociations[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ modAssociations });
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
          attributeValidation.attributeValidationErrors[
            attribute.Code
          ] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "TerminalDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      //console.log(nextProps);

      if (
        this.state.destination.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        //console.log(nextProps);
        this.getDestination(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "DestinationDetailsComposite:Error occured on componentWillReceiveProps",
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
        attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
          attributeMetaDataList.destination
        ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  saveDestination = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempDestination = lodash.cloneDeep(this.state.tempDestination);

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      tempDestination.Attributes = Utilities.fillAttributeDetails(attributeList);
      this.state.destination.Code === ""
        ? this.createDestination(tempDestination)
        : this.updateDestination(tempDestination);
    } catch (error) {
      console.log("BaseProductDetailsComposite : Error in saveBaseProduct");
    }
  };
  handleSave = () => {
    try {
      let modDestination = lodash.cloneDeep(this.state.modDestination);
      let modAssociations = lodash.cloneDeep(this.state.modAssociations);
      modAssociations.forEach(
        (association) => (association.DestinationCode = modDestination.Code)
      );
      modDestination.ListCustomerDestinationInfo = Utilities.removeSeqNumberFromListObject(
        modAssociations
      );
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      // this.setState({ saveEnabled: false });
      
      if (this.validateSave(modDestination, attributeList)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempDestination = lodash.cloneDeep(modDestination);
        this.setState({ showAuthenticationLayout, tempDestination }, () => {
          if (showAuthenticationLayout === false) {
            this.saveDestination();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "DestinationDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave(modDestination,attributeList) {
    // const { modTrailer } = this.state;
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(destinationValidationDef).forEach(function (key) {
      if (modDestination[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          destinationValidationDef[key],
          modDestination[key]
        );
    });
    if (modDestination.Status !== this.state.destination.Status) {
      if (modDestination.Remarks === null || modDestination.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }
    if (
      modDestination.TransportationTypes === null ||
      modDestination.TransportationTypes.length === 0
    )
      validationErrors["TransportationTypes"] = "Vehicle_MandatoryTrasType";

    if (
      this.state.isValidShareholderSysExtCode &&
      this.props.userDetails.EntityResult.IsDCHEnabled
    ) {
      if (modDestination.State === null || modDestination.State.length === 0)
        validationErrors["State"] = "Terminal_State_required";
      if (
        modDestination.ZipCode === null ||
        modDestination.ZipCode.length === 0
      )
        validationErrors["ZipCode"] = "Terminal_ZipCode_required";
    }

    let notification = {
      messageType: "critical",
      message: "DestInfo_SavedStatus",
      messageResultDetails: [],
    };

    let uniqueRecords = [
      ...new Set(
        modDestination.ListCustomerDestinationInfo.map((a) => a.CustomerCode)
      ),
    ];
    if (
      uniqueRecords.length !== modDestination.ListCustomerDestinationInfo.length
    ) {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "Duplicate_Associated_Customers",
      });
      this.props.onSaved(this.state.modDestination, "update", notification);
      return false;
    }
    if (
      Array.isArray(modDestination.ListCustomerDestinationInfo) &&
      modDestination.ListCustomerDestinationInfo.length > 0
    ) {
      modDestination.ListCustomerDestinationInfo.forEach((association) => {
        customerDestinationValidationDef.forEach((col) => {
          let err = "";

          if (col.validator !== undefined) {
            err = Utilities.validateField(
              col.validator,
              association[col.field]
            );
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: ["Cust_Code", col.displayName],
              keyValues: [association.CustomerCode, association[col.field]],
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
        errorMessage: "Destination_Customer_Association_Require",
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
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modDestination, "update", notification);
      return false;
    }
    return returnValue;
  }
  updateDestination(modDestination) {
    let keyCode = [
      {
        key: KeyCodes.destinationCode,
        value: modDestination.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.destinationCode,
      KeyCodes: keyCode,
      Entity: modDestination,
    };

    let notification = {
      messageType: "critical",
      message: "DestInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Dest_Code1"],
          keyValues: [modDestination.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateDestination,
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
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDestination
              ),
              showAuthenticationLayout: false,

            },
            () => this.getDestination({ Common_Code: modDestination.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDestination
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in UpdateDestination:", result.ErrorList);
        }
        //console.log(notification);
        this.props.onSaved(modDestination, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnDestination
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modDestination, "add", notification);
      });
  }

  createDestination(modDestination) {
    let keyCode = [
      {
        key: KeyCodes.destinationCode,
        value: modDestination.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.destinationCode,
      KeyCodes: keyCode,
      Entity: modDestination,
    };

    let notification = {
      messageType: "critical",
      message: "DestInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Dest_Code1"],
          keyValues: [modDestination.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateDestination,
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
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDestination
              ),
              showAuthenticationLayout: false,

            },
            () => this.getDestination({ Common_Code: modDestination.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDestination
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in CreateDestination:", result.ErrorList);
        }
        //console.log(notification);
        this.props.onSaved(modDestination, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnDestination
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modDestination, "add", notification);
      });
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (this.props.userDetails.EntityResult.IsDCHEnabled)
        this.getShareholderDetail(this.props.selectedShareholder);
      this.getAttributes(this.props.selectedRow);
      // this.getDestination(this.props.selectedRow);
      this.getcustomerList(this.props.selectedShareholder);
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes(destinationRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [destinationAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.destination
              ),
            },
            () => this.getDestination(destinationRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getShareholderDetail(shareHolder) {
    //console.log("DCH", this.props.userDetails.EntityResult.IsDCHEnabled);
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shareHolder,
      },
    ];
    var obj = {
      ShareHolderCode: shareHolder,
      keyDataCode: KeyCodes.shareholderCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetShareholder,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isValidShareholderSysExtCode:
              result.EntityResult.ExternalSystemCode > 1 ? true : false,
          });
        } else {
          this.setState({
            isValidShareholderSysExtCode: false,
          });
          console.log("Error in GetDestination:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting Shareholder detail:",
          error,
          shareHolder
        );
      });
    //console.log("Shareholder state : ", this.state.isValidShareholderSysExtCode)
  }
  getDestination(destinationRow) {
    // let driver = props.selectedRow;
    emptyDestination.ShareholderCode = this.props.selectedShareholder;
    emptyDestination.TransportationTypes = this.props.userDetails.EntityResult.TransportationTypes;
    emptyDestination.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    //    var terminalCodes = [...this.state.terminalCodes];
    if (destinationRow.Common_Code === undefined) {
      // terminalCodes = [];
      this.setState(
        {
          destination: lodash.cloneDeep(emptyDestination),
          modDestination: lodash.cloneDeep(emptyDestination),
          modAttributeMetaDataList: [],
          isReadyToRender: true,
          modAssociations: [],
          destinationKPIList: [],
          // terminalCodes,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnDestination
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.destinationCode,
        value: destinationRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.destinationCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetDestination,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        // console.log(result);
        if (result.IsSuccess === true) {
          // this.getTerminalsForCarrier(result.EntityResult.CarrierCode);
          this.setState(
            {
              isReadyToRender: true,
              destination: result.EntityResult,
              modDestination: lodash.cloneDeep(result.EntityResult),
              modAssociations: Array.isArray(
                result.EntityResult.ListCustomerDestinationInfo
              )
                ? Utilities.addSeqNumberToListObject(
                    lodash.cloneDeep(
                      result.EntityResult.ListCustomerDestinationInfo
                    )
                  )
                : [],
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDestination
              ),
            },
            () => {
              // this.getTerminalsForCarrier(result.EntityResult.CarrierCode)
              this.getKPIList(this.props.selectedShareholder,result.EntityResult.Code)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            modDestination: lodash.cloneDeep(emptyDestination),
            destination: lodash.cloneDeep(emptyDestination),
            modAssociations: [],
            isReadyToRender: true,
          });
          console.log("Error in GetDestination:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Destination:", error, destinationRow);
      });
  }
  handleReset = () => {
    var modDestination = lodash.cloneDeep(this.state.destination);
    try {
      this.setState(
        {
          modDestination,
          validationErrors: [],
          modAttributeMetaDataList: [],
          modAssociations: Array.isArray(
            this.state.destination.ListCustomerDestinationInfo
          )
            ? Utilities.addSeqNumberToListObject(
                lodash.cloneDeep(
                  this.state.destination.ListCustomerDestinationInfo
                )
              )
            : [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modDestination.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.destination.Code === "") {
        var terminalCodes = [...this.state.terminalCodes];
        terminalCodes = [];
        this.setState({ terminalCodes });
      }
    } catch (error) {
      console.log(
        "DestinationDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.props.terminalCodes];
      var modDestination = lodash.cloneDeep(this.state.modDestination);

      if (checked) modDestination.TerminalCodes = [...terminalCodes];
      else modDestination.TerminalCodes = [];
      this.setState({ modDestination: modDestination });
      this.terminalSelectionChange(modDestination.TerminalCodes);
    } catch (error) {
      console.log(
        "DestinationDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.modAssociations.length < this.state.customerOptions.length
        ) {
          let modAssociations = lodash.cloneDeep(this.state.modAssociations);
          let newAssociation = {
            SeqNumber: null,
            CustomerCode: null,
            DestinationCode: null,
            ContactPerson: null,
            Email: null,
            Mobile: null,
            Phone: null,
            ShareholderCode: this.props.selectedShareholder,
          };
          newAssociation.SeqNumber = Utilities.getMaxSeqNumberfromListObject(
            modAssociations
          );

          if (this.state.customerOptions.length === 1) {
            newAssociation.CustomerCode = this.state.customerOptions[0].value;
          }

          modAssociations.push(newAssociation);

          this.setState({
            modAssociations,
            selectedAssociations: [],
          });
        }
      } catch (error) {
        console.log(
          "DestinationDetailsComposite:Error occured on handleAddAssociation",
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
              modAssociations = modAssociations.filter(
                (association, cindex) => {
                  return association.SeqNumber !== obj.SeqNumber;
                }
              );
            });

            this.setState({ modAssociations, selectedAssociations: [] });
          }
        }
      } catch (error) {
        console.log(
          "DestinationDetailsComposite:Error occured on handleDeleteAssociation",
          error
        );
      }
    }
  };
  handleAssociationSelectionChange = (associations) => {
    this.setState({ selectedAssociations: associations });
  };

  getcustomerList(shareholder) {
    axios(
      RestAPIs.GetCustomerDestinations +
        "?ShareholderCode=" +
        shareholder +
        "&TransportationType=",

      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        // console.log(response);

        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let shareholderCustomers = result.EntityResult.filter(
              (shareholderCust) =>
                shareholderCust.ShareholderCode === shareholder
            );
            if (shareholderCustomers.length > 0) {
              let customers = Object.keys(
                shareholderCustomers[0].CustomerDestinationsList
              );
              let customerOptions = Utilities.transferListtoOptions(customers);
              this.setState({ customerOptions });
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
  handleActiveStatusChange = (value) => {
    try {
      let modDestination = lodash.cloneDeep(this.state.modDestination);
      modDestination.Status = value;
      if (modDestination.Status !== this.state.destination.Status)
        modDestination.Remarks = "";
      this.setState({ modDestination });
    } catch (error) {
      console.log(error);
    }
  };
  //Get KPI for Destination
  getKPIList(shareholder,destinationCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      
      var transportationType = "";
      if (this.props.genericProps !== undefined) {
        if (this.props.genericProps.transportationType !== undefined) {
          transportationType = this.props.genericProps.transportationType;
        }
      }
      let objKPIRequestData = {
        PageName: kpiDestinationDetail,
        TransportationType: transportationType,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "DestinationCode", value: destinationCode }],
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
              destinationKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ destinationKPIList: [] });
            console.log("Error in destination KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Destination KPIList:", error);
        });
    }
  }
  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modDestination.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modDestination.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modDestination.LastActiveTime !== undefined &&
          this.state.modDestination.LastActiveTime !== null
            ? new Date(
                this.state.modDestination.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modDestination.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modDestination.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modDestination.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.destination.Code}
            newEntityName="DestAdd_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.destinationKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <DestinationDetails
            destination={this.state.destination}
            modDestination={this.state.modDestination}
            modAssociations={this.state.modAssociations}
            validationErrors={this.state.validationErrors}
            listOptions={{
              transportationTypes: Utilities.transferListtoOptions(
                this.props.userDetails.EntityResult.TransportationTypes
              ),
              terminalCodes: this.props.terminalCodes,
              customerOptions: this.state.customerOptions,
            }}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            selectedAssociations={this.state.selectedAssociations}
            handleRowSelectionChange={this.handleAssociationSelectionChange}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            handleAddAssociation={this.handleAddAssociation}
            handleDeleteAssociation={this.handleDeleteAssociation}
            handleCellDataEdit={this.handleCellDataEdit}
            onAttributeDataChange={this.handleAttributeDataChange} 
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            isDCHEnabled={this.props.userDetails.EntityResult.IsDCHEnabled}
            isValidShareholderSysExtCode={
              this.state.isValidShareholderSysExtCode
            }
          ></DestinationDetails>
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
              this.state.destination.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnDestination}
            handleOperation={this.saveDestination}
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

export default connect(mapStateToProps)(DestinationDetailsComposite);

DestinationDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
