import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { ShareholderDetails } from "../../UIBase/Details/ShareholderDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyShareholder } from "../../../JS/DefaultEntities";
import { shareholderValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnShareholder, fnKPIInformation } from "../../../JS/FunctionGroups";
import { shareholderAttributeEntity } from "../../../JS/AttributeEntity";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiShareholderDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class ShareholderDetailsComposite extends Component {
  state = {
    shareholder: lodash.cloneDeep(emptyShareholder),
    modShareholder: {},
    validationErrors: Utilities.getInitialValidationErrors(
      shareholderValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    ExternalSystemList: [],
    SealCodeOptions: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    shareholderKPIList: [],
    showAuthenticationLayout: false,
    tempShareholder: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
      if (this.props.userDetails.EntityResult.IsDCHEnabled)
        this.getExternalSystemInfo();
      this.getSealCodesInfo();
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.shareholder.ShareholderCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAttributes(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(shareholderRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [shareholderAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.shareholder
              ),
            },
            () => this.getShareholder(shareholderRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
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
        var modShareholder = lodash.cloneDeep(this.state.modShareholder);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.shareholder.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modShareholder.Attributes.find(
                  (shareholderAttribute) => {
                    return shareholderAttribute.TerminalCode === terminal;
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
      }
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList.shareholder) && attributeMetaDataList.shareholder.length > 0) {
        this.terminalSelectionChange([
          attributeMetaDataList.shareholder[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getShareholder(shareholderRow) {
    emptyShareholder.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];

    if (shareholderRow.Common_Code === undefined) {
      this.setState(
        {
          shareholder: lodash.cloneDeep(emptyShareholder),
          modShareholder: lodash.cloneDeep(emptyShareholder),
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          shareholderKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnShareholder
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            if (this.props.terminalCodes.length === 1) {
              this.terminalSelectionChange(this.props.terminalCodes);
            } else {
              this.terminalSelectionChange([]);
            }
          }
          else {
            this.localNodeAttribute();
          }
        }
      );
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shareholderRow.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: shareholderRow.Common_Code,
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
          result.EntityResult.ExternalSystemCode = result.EntityResult.ExternalSystemCode.toString();
          this.setState(
            {
              isReadyToRender: true,
              shareholder: lodash.cloneDeep(result.EntityResult),
              modShareholder: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnShareholder
              ),
            },
            () => {
              this.getKPIList(result.EntityResult.ShareholderCode);
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            shareholder: lodash.cloneDeep(emptyShareholder),
            modShareholder: lodash.cloneDeep(emptyShareholder),
            isReadyToRender: true,
          });
          console.log("Error in getShareholder:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getShareholder:", error, shareholderRow);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modShareholder = lodash.cloneDeep(this.state.modShareholder);
      modShareholder[propertyName] = data;
      this.setState({ modShareholder });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (shareholderValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          shareholderValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }

      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleExternalSystemCodeChange = (data) => {
    try {
      const modShareholder = lodash.cloneDeep(this.state.modShareholder);
      modShareholder["ExternalSystemCode"] = data;
      if (data === "1") {
        modShareholder["IsBypass"] = false;
      } else {
        modShareholder["IsBypass"] = true;
      }
      this.setState({ modShareholder });
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on handleExternalSystemCodeChange",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      validationErrors["TerminalCodes"] = "";
      var terminalCodes = [...this.props.terminalCodes];
      let modShareholder = lodash.cloneDeep(this.state.modShareholder);
      if (checked) modShareholder.TerminalCodes = [...terminalCodes];
      else modShareholder.TerminalCodes = [];
      this.setState({ modShareholder, validationErrors });
      this.terminalSelectionChange(modShareholder.TerminalCodes);
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on handleAllTerminalsChange",
        error
      );
    }
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const shareholder = lodash.cloneDeep(this.state.shareholder);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modShareholder: { ...shareholder },
          selectedCompRow: [],
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(shareholder.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on handleReset",
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
          attributeMetaDataList.shareholder
        ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleActiveStatusChange = (data) => {
    try {
      const modShareholder = lodash.cloneDeep(this.state.modShareholder);

      modShareholder.Active = data;
      if (modShareholder.Active !== this.state.shareholder.Active)
        modShareholder.Remarks = "";
      this.setState({ modShareholder });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (modShareholder.Active === this.state.shareholder.Active) {
        if (modShareholder.Remarks === null || modShareholder.Remarks === "") {
          validationErrors.Remarks = "";
        }
      }
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };
  saveShareholder = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempShareholder = lodash.cloneDeep(this.state.tempShareholder);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      tempShareholder.Attributes = Utilities.fillAttributeDetails(attributeList);
      this.state.shareholder.ShareholderCode === ""
        ? this.createShareholder(tempShareholder)
        : this.updateShareholder(tempShareholder);
    } catch (error) {
      console.log("ShareholderDetailsComposite : Error in saveShareholder" )
    }
}
  handleSave = () => {
    try {
      //let modShareholder = this.fillAttributeDetails();
      let modShareholder = lodash.cloneDeep(this.state.modShareholder);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      // this.setState({ saveEnabled: false });
      if (this.validateSave(modShareholder, attributeList)) {
        let tempShareholder = lodash.cloneDeep(modShareholder);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout, tempShareholder }, () => {
          if (showAuthenticationLayout === false) {
            this.saveShareholder();
          }
        });
      } else this.setState({ saveEnabled: true });
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave(modShareholder, attributeList) {
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(shareholderValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        shareholderValidationDef[key],
        modShareholder[key]
      );
    });

    if (modShareholder.Active !== this.state.shareholder.Active) {
      if (modShareholder.Remarks === null || modShareholder.Remarks === "") {
        validationErrors["Remarks"] = "ShareholderDetails_RemarksRequired";
      }
    }

    if (
      this.props.userDetails.EntityResult.IsEnterpriseNode &&
      this.state.shareholder.ShareholderCode !== ""
    ) {
      var isPresent = true;
      let existTermincalCodes = this.state.shareholder.TerminalCodes;
      let newTermincalCodes = modShareholder.TerminalCodes;
      if (existTermincalCodes !== null)
        existTermincalCodes.forEach(function (value) {
          if (isPresent)
            isPresent = newTermincalCodes.some((item) => value === item);
          else return isPresent;
        });
      if (!isPresent) {
        validationErrors["TerminalCodes"] =
          "ShareholderInfo_TerminalDisassociation";
      } else {
        validationErrors["TerminalCodes"] = "";
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

  createShareholder(modShareholder) {
    let keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: modShareholder.ShareholderCode,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.shareholderCode,
      KeyCodes: keyCode,
      Entity: modShareholder,
    };

    let notification = {
      messageType: "critical",
      message: "ShareholderDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ShareholderDetails_Code"],
          keyValues: [modShareholder.ShareholderCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateShareholder,
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
                fnShareholder
              ),
              showAuthenticationLayout: false,

            },
            () =>
              this.getShareholder({
                Common_Code: modShareholder.ShareholderCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnShareholder
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in createShareholder:", result.ErrorList);
        }
        this.props.onSaved(this.state.modShareholder, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnShareholder
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modShareholder, "add", notification);
      });
  }

  updateShareholder(modShareholder) {
    let keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: modShareholder.ShareholderCode,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.shareholderCode,
      KeyCodes: keyCode,
      Entity: modShareholder,
    };

    let notification = {
      messageType: "critical",
      message: "ShareholderDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ShareholderDetails_Code"],
          keyValues: [modShareholder.ShareholderCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateShareholder,
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
                fnShareholder
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getShareholder({
                Common_Code: modShareholder.ShareholderCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnShareholder
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in update Shareholder:", result.ErrorList);
        }
        this.props.onSaved(this.state.modShareholder, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnShareholder
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modShareholder, "modify", notification);
      });
  }

  getExternalSystemInfo() {
    try {
      axios(
        RestAPIs.GetExternalSystemInfo,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          let ExternalSystemList = this.state.ExternalSystemList;
          Object.keys(result.EntityResult).forEach(function (key) {
            ExternalSystemList.push({
              text: result.EntityResult[key],
              value: key,
            });
          });
          this.setState({ ExternalSystemList: ExternalSystemList });
        } else {
          this.setState({ ExternalSystemList: [] });
        }
      });
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on get ExternalSystemInfo List",
        error
      );
    }
  }

  getSealCodesInfo() {
    try {
      axios(
        RestAPIs.GetSealCodes,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let SealCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ SealCodeOptions });
          }
        } else {
          console.log("Error in getSealCodesInfo:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on getSealCodesInfo List",
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
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "ShareholderDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  //Get KPI for Shareholder
  getKPIList(shareholderCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiShareholderDetail,
        InputParameters: [{ key: "ShareholderCode", value: shareholderCode }],
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
              shareholderKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ shareholderKPIList: [] });
            console.log("Error in shareholder KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Shareholder KPIList:", error);
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
      terminalCodes: this.props.terminalCodes,
      ExternalSystemInfo: this.state.ExternalSystemList,
      SealCodes: this.state.SealCodeOptions,
    };

    const popUpContents = [
      {
        fieldName: "ShareholderDetails_LastUpdated",
        fieldValue:
          new Date(
            this.state.modShareholder.LastUpdatedDate
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modShareholder.LastUpdatedDate
          ).toLocaleTimeString(),
      },
      {
        fieldName: "ShareholderDetails_LastActive",
        fieldValue:
          this.state.modShareholder.LastActiveTime !== undefined &&
            this.state.modShareholder.LastActiveTime !== null
            ? new Date(
              this.state.modShareholder.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modShareholder.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "ShareholderDetails_CreatedDate",
        fieldValue:
          new Date(this.state.modShareholder.CreatedDate).toLocaleDateString() +
          " " +
          new Date(this.state.modShareholder.CreatedDate).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.shareholder.ShareholderCode}
            newEntityName="ShareholderDetails_Header"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout
          KPIList={this.state.shareholderKPIList}
          pageName="ShareholderDetails"
          rowHeight={175}>
        </TMDetailsKPILayout>
        <ErrorBoundary>
          <ShareholderDetails
            shareholder={this.state.shareholder}
            modShareholder={this.state.modShareholder}
            validationErrors={this.state.validationErrors}
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            listOptions={listOptions}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            onExternalSystemCodeChange={this.handleExternalSystemCodeChange}
            isDCHEnabled={this.props.userDetails.EntityResult.IsDCHEnabled}
            isSealingEnabled={
              this.props.userDetails.EntityResult.IsSealingEnabled
            }
            onAttributeDataChange={this.handleAttributeDataChange}
          ></ShareholderDetails>
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
              this.state.shareholder.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnShareholder}
            handleOperation={this.saveShareholder}
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

export default connect(mapStateToProps)(ShareholderDetailsComposite);

ShareholderDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
