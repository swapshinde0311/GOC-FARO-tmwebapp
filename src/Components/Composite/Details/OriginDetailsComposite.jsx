import React, { Component } from "react";
import { emptyOrigin } from "../../../JS/DefaultEntities";
import { OriginDetails } from "../../UIBase/Details/OriginDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { originValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnOriginTerminal,fnKPIInformation } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { originTerminalAttributeEntity } from "../../../JS/AttributeEntity";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiOriginTerminalDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class OriginDetailsComposite extends Component {
  state = {
    origin: lodash.cloneDeep(emptyOrigin),
    modOrigin: {},
    validationErrors: Utilities.getInitialValidationErrors(originValidationDef),
    isReadyToRender: false,
    saveEnabled: false,
    associatedSuppliers: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    originTerminalKPIList: [],
    tempOrigin: {},
    showAuthenticationLayout: false,
  };

  getTerminalList() {
    return this.props.terminalList;
  }

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  getOriginTerminal(props) {
    let selectedRow = props.selectedRow;
    emptyOrigin.TerminalCodes = [];
    emptyOrigin.TransportationTypes = this.props.userDetails.EntityResult.TransportationTypes;
    emptyOrigin.ShareholderCode = this.props.selectedShareholder;
    if (this.props.terminalList.length === 1) {
      emptyOrigin.TerminalCodes = [...this.props.terminalList];
    }

    var listOptions = lodash.cloneDeep(this.state.listOptions);
    if (selectedRow.Common_Code === undefined) {
      this.setState(
        {
          origin: lodash.cloneDeep(emptyOrigin),
          modOrigin: lodash.cloneDeep(emptyOrigin),
          modAttributeMetaDataList: [],
          listOptions,
          isReadyToRender: true,
          associatedSuppliers: [],
          originTerminalKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnOriginTerminal
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
        key: KeyCodes.originTerminalCode,
        value: selectedRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.originTerminalCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetOriginTerminal,
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
              isReadyToRender: true,
              origin: lodash.cloneDeep(result.EntityResult),
              modOrigin: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnOriginTerminal
              ),
            },
            () => {
              this.getKPIList(this.props.selectedShareholder, result.EntityResult.Code
              )
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
          this.getAssociatedSuppliers();
        } else {
          this.setState({
            origin: lodash.cloneDeep(emptyOrigin),
            modOrigin: lodash.cloneDeep(emptyOrigin),
            isReadyToRender: true,
          });
          console.log("Error in GetOriginTerminal:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting OriginTerminal:", error, props);
      });
  }

  getAssociatedSuppliers() {
    axios(
      RestAPIs.GetAssociatedSupplierList +
        "?ShareholderCode=" +
        this.props.selectedShareholder +
        "&OringinTerminalCode=" +
        this.state.modOrigin.Code,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        if (response.data.IsSuccess) {
          let associatedSuppliers = [];
          var data = response.data.EntityResult.Table;
          data.forEach((item) => {
            associatedSuppliers.push(item.Code);
          });
          this.setState({ associatedSuppliers });
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.origin.Code !== "" &&
        nextProps.selectedRow.OriginTerminal_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAttributes(nextProps);
        // this.getOriginTerminal(nextProps);
      }
    } catch (error) {
      console.log(
        "OriginDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      // this.getOriginTerminal(this.props);
      this.getAttributes(this.props);
    } catch (error) {
      console.log(
        "OriginDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  handleChange = (propertyName, data) => {
    try {
      const modOrigin = lodash.cloneDeep(this.state.modOrigin);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modOrigin[propertyName] = data;
      this.setState({ modOrigin });
      if (originValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          originValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "OriginTerminalComposite:Error occured on componentWillReceiveProps",
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
      var modOrigin = lodash.cloneDeep(this.state.modOrigin);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.originterminal.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modOrigin.Attributes.find(
                (originTerminalAttribute) => {
                  return originTerminalAttribute.TerminalCode === terminal;
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
        "OriginTerminalDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.originterminal) && attributeMetaDataList.originterminal.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.originterminal[0].TerminalCode,
        ]);
      }
      
    } catch (error) {
      console.log(
        "OriginTerminalDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getAttributes(props) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [originTerminalAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
            attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
              result.EntityResult.originterminal
            ),
          });
          let attributeMetaDataList = lodash.cloneDeep(
            this.state.attributeMetaDataList
          );
          this.setState(
            {
              attributeMetaDataList: attributeMetaDataList,
            },
            () => this.getOriginTerminal(props)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const origin = lodash.cloneDeep(this.state.origin);
      var modOrigin = lodash.cloneDeep(this.state.origin);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modOrigin: { ...origin },
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modOrigin.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.origin.Code === "") {
        var terminalCodes = [...this.state.terminalCodes];
        terminalCodes = [];
        this.setState({ terminalCodes });
      }
    } catch (error) {
      console.log("OriginDetailsComposite:Error occured on handleReset", error);
    }
  };
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  saveOriginTerminal = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempOriginTerminal = lodash.cloneDeep(this.state.tempOriginTerminal);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      tempOriginTerminal.Attributes = Utilities.fillAttributeDetails(attributeList);
      this.state.origin.Code === ""
        ? this.createOriginTerminal(tempOriginTerminal)
        : this.updateOriginTerminal(tempOriginTerminal);
    } catch (error) {
      console.log("OriginTerminalDetailsComposite : Error in saveOriginTerminal");
    }
  };
  handleSave = () => {
    try {
      // this.setState({ saveEnabled: false });
      let modOrigin = lodash.cloneDeep(this.state.modOrigin);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(attributeList)) {
        attributeList = Utilities.attributesDatatypeConversion(attributeList);
        modOrigin.Attributes = Utilities.fillAttributeDetails(attributeList);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempOriginTerminal = lodash.cloneDeep(modOrigin);
        this.setState({ showAuthenticationLayout, tempOriginTerminal }, () => {
          if (showAuthenticationLayout === false) {
            this.saveOriginTerminal();
          }
        })
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("OriginDetailsComposite:Error occured on handleSave", error);
    }
  };

  validateSave(attributeList) {
    const { modOrigin } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(originValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        originValidationDef[key],
        modOrigin[key]
      );
    });

    if (modOrigin.Status !== this.state.origin.Status) {
      if (modOrigin.Remarks === null || modOrigin.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
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
    return returnValue;
  }

  createOriginTerminal(modOrigin) {
    var keyCode = [
      {
        key: KeyCodes.originTerminalCode,
        value: modOrigin.Code,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.originTerminalCode,
      KeyCodes: keyCode,
      Entity: modOrigin,
    };
    var notification = {
      messageType: "critical",
      message: "OriginTerminal_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["OriginTerminal_Code"],
          keyValues: [this.state.modOrigin.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateOriginTerminal,
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
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnOriginTerminal
            ),
            showAuthenticationLayout: false,

          });
          this.getOriginTerminal({
            selectedRow: { Common_Code: this.state.modOrigin.Code },
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnOriginTerminal
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in CreateOrigin:", result.ErrorList);
        }
        this.props.onSaved(this.state.modOrigin, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnOriginTerminal
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modOrigin, "add", notification);
      });
  }

  updateOriginTerminal(modOrigin) {
    var keyCode = [
      {
        key: KeyCodes.originTerminalCode,
        value: modOrigin.Code,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.originTerminalCode,
      KeyCodes: keyCode,
      Entity: modOrigin,
    };
    var notification = {
      messageType: "critical",
      message: "OriginTerminal_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["OriginTerminal_Code"],
          keyValues: [this.state.modOrigin.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateOriginTerminal,
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
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnOriginTerminal
            ),
            showAuthenticationLayout: false,

          });
          this.getOriginTerminal({
            selectedRow: { Common_Code: this.state.modOrigin.Code },
          });
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnOriginTerminal
            ),
            showAuthenticationLayout: false,

          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateOrigin:", result.ErrorList);
        }
        this.props.onSaved(this.state.modOrigin, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modOrigin, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnOriginTerminal
          ),
          showAuthenticationLayout: false,

        });
      });
  }

  handleAllTerminalsChange = (checked) => {
    try {
      var modOrigin = lodash.cloneDeep(this.state.modOrigin);
      let terminalOptions = this.props.terminalList;
      if (checked) modOrigin.TerminalCodes = terminalOptions;
      else modOrigin.TerminalCodes = [];
      this.setState({ modOrigin });
      this.terminalSelectionChange(modOrigin.TerminalCodes);
    } catch (error) {
      console.log(
        "OriginDetailsComposite:Error occured on handleAllTerminalsChange",
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
          attributeValidation.attributeValidationErrors[
            attribute.Code
          ] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "OriginDetailsComposite:Error occured on handleAttributeDataChange",
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
          attributeMetaDataList.customer
        ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleActiveStatusChange = (value) => {
    try {
      let modOrigin = lodash.cloneDeep(this.state.modOrigin);
      modOrigin.Status = value;
      if (modOrigin.Status !== this.state.origin.Status) modOrigin.Remarks = "";
      this.setState({ modOrigin });
    } catch (error) {
      console.log(
        "OriginDetailsComposite:Error occured on handleActiveStatusChange:",
        error
      );
    }
  };
  //Get KPI for Origin Terminal
  getKPIList(shareholder,originTerminalCode) {
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
        PageName: kpiOriginTerminalDetail,
        TransportationType: transportationType,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "OriginTerminalCode", value: originTerminalCode }],
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
              originTerminalKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ originTerminalKPIList: [] });
            console.log("Error in origin terminal KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Origin Terminal KPIList:", error);
        });
    }
  }
  render() {
    const listOptions = {
      shareholders: this.getShareholders(),
      terminalCodes: this.getTerminalList(),
      transportTypes: this.props.userDetails.EntityResult.TransportationTypes,
      associatedSupplier: this.state.associatedSuppliers,
    };

    const popUpContents = [
      {
        fieldName: "OriginTerminal_LastUpdatedTime",
        fieldValue:
          new Date(this.state.modOrigin.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modOrigin.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "OriginTerminal_CreatedTime",
        fieldValue:
          new Date(this.state.modOrigin.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modOrigin.CreatedTime).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.origin.Code}
            newEntityName="OriginTerminalDetails_OriginHeader"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.originTerminalKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <OriginDetails
            origin={this.state.origin}
            modOrigin={this.state.modOrigin}
            validationErrors={this.state.validationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            onAttributeDataChange={this.handleAttributeDataChange} 
          ></OriginDetails>
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
              this.state.origin.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnOriginTerminal}
            handleOperation={this.saveOriginTerminal}
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

export default connect(mapStateToProps)(OriginDetailsComposite);

OriginDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
