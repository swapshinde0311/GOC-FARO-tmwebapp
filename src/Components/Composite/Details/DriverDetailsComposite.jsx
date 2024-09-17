import React, { Component } from "react";
import { DriverDetails } from "../../UIBase/Details/DriverDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import {
  driverValidationDef,
  dchAttributeValidationDef,
} from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyDriver } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnDriver,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { driverAttributeEntity } from "../../../JS/AttributeEntity";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiDriverDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class DriverDetailsComposite extends Component {
  state = {
    driver: {},
    attribute: [],
    modDriver: {},
    validationErrors: Utilities.getInitialValidationErrors(driverValidationDef),
    isReadyToRender: false,
    carrierOptions: [],
    carrierSearchOptions: [],
    languageOptions: [],
    terminalCodes: [],
    //listOptions: { carriers: [], languageOptions: [], terminalCodes: [] },
    saveEnabled: false,
    entityType: "driver",
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    isDCHEnabled: false,
    modDCHAttributes: [],
    dchAttribute: [],
    dchAttributeValidationErrors: {},
    hazardousEnabled: false,
    driverDetailsKPIList: [],
    showAuthenticationLayout: false,
    tempDriver: {},
  };

  handleChange = (propertyName, data) => {
    try {
      const modDriver = lodash.cloneDeep(this.state.modDriver);
      modDriver[propertyName] = data;

      this.setState({ modDriver });
      if (driverValidationDef[propertyName] !== undefined) {
        const validationErrors = { ...this.state.validationErrors };
        validationErrors[propertyName] = Utilities.validateField(
          driverValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }

      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

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
          this.setState(
            {
              isDCHEnabled:
                result.EntityResult.ExternalSystemCode > 1 ? true : false,
            },
            () => {
              if (this.state.isDCHEnabled) this.GetDCHAttributeInfoList();
            }
          );
        } else {
          this.setState({
            isDCHEnabled: false,
          });
          console.log("Error in getShareholderDetail:", result.ErrorList);
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

  GetDCHAttributeInfoList() {
    try {
      let modDriver = lodash.cloneDeep(this.state.modDriver);
      let dcAttributeConfig = {
        Shareholdercode: this.props.selectedShareholder,
        EntityCode: modDriver.Code,
        EntityType: Constants.ExtendEntity.DRIVER,
      };
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.shareholderCode,
        Entity: dcAttributeConfig,
      };
      axios(
        RestAPIs.GetDCHAttributeInfoList,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              modDCHAttributes: result.EntityResult,
              dchAttribute: result.EntityResult,
            });
          } else {
            console.log("Error in GetDCHAttributeInfoList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting DCHAttributeInfoList:", error);
        });
    } catch (error) {
      console.log("Error while getting DCHAttributeInfoList:", error);
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
        var modDriver = lodash.cloneDeep(this.state.modDriver);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.driver.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modDriver.Attributes.find(
                  (driverAttribute) => {
                    return driverAttribute.TerminalCode === terminal;
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
        "DriverDetailsComposite:Error occured on terminalSelectionChange",
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
        Array.isArray(attributeMetaDataList.driver) &&
        attributeMetaDataList.driver.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.driver[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      //console.log(nextProps);

      if (
        this.state.driver.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        //console.log(nextProps);
        this.getDriver(nextProps);
      }
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getTerminalsForCarrier(carrier) {
    var modDriver = lodash.cloneDeep(this.state.modDriver);
    var terminalCodes = [];
    if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
      modDriver.CarrierCode = carrier;
      modDriver.TerminalCodes = [];
      this.setState({ terminalCodes, modDriver });
    } else {
      terminalCodes = [...this.state.terminalCodes];
      //var listOptions = lodash.cloneDeep(this.state.listOptions);
      modDriver.CarrierCode = carrier;
      try {
        if (carrier === undefined) {
          terminalCodes = [];
          modDriver.TerminalCodes = [];
          this.setState({ terminalCodes, modDriver });
          return;
        }
        var keyCode = [
          {
            key: KeyCodes.carrierCode,
            value: carrier,
          },
          {
            key: KeyCodes.transportationType,
            value: Constants.TransportationType.ROAD,
          },
        ];
        var obj = {
          ShareHolderCode: this.props.selectedShareholder,
          keyDataCode: KeyCodes.carrierCode,
          KeyCodes: keyCode,
        };
        axios(
          RestAPIs.GetCarrier,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            var result = response.data;
            //console.log(result);
            //console.log("IsSuccess-", result.IsSuccess);
            if (
              result.IsSuccess === true &&
              result.EntityResult !== null &&
              result.EntityResult.TerminalCodes !== null
            ) {
              terminalCodes = [...result.EntityResult.TerminalCodes];
              this.setState({ terminalCodes });
            } else {
              terminalCodes = [];

              this.setState({ terminalCodes });
              console.log("Error in GetCarrier:", result.ErrorList);
            }
            var driver = lodash.cloneDeep(this.state.driver);
            if (
              driver.Code === undefined ||
              driver.Code === "" ||
              driver.Code === null
            ) {
              if (terminalCodes.length === 1) {
                modDriver.TerminalCodes = [...terminalCodes];
                this.terminalSelectionChange(modDriver.TerminalCodes);
              } else {
                modDriver.TerminalCodes = [];
                this.terminalSelectionChange([]);
              }

              if (Array.isArray(modDriver.TerminalCodes)) {
                modDriver.TerminalCodes = terminalCodes.filter((x) =>
                  modDriver.TerminalCodes.includes(x)
                );
              }
              this.setState({ modDriver });
            }
          })
          .catch((error) => {
            terminalCodes = [];
            modDriver.TerminalCodes = [];
            this.setState({ terminalCodes, modDriver });
            console.log("Error while getting Carrier:", error, carrier);
            //throw error;
          });
      } catch (error) {
        terminalCodes = [];
        modDriver.TerminalCodes = [];
        this.setState({ terminalCodes, modDriver });
        console.log(
          "DriverDetailsComposite:Error occured on handleCarrierChange",
          error
        );
      }
    }
  }

  handleCarrierChange = (carrier) => {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode)
      this.getTerminalsForCarrier(carrier);
    else {
      var modDriver = lodash.cloneDeep(this.state.modDriver);
      modDriver.CarrierCode = carrier;
      var terminalCodes = [];
      modDriver.TerminalCodes = [];
      this.setState({ terminalCodes, modDriver });
    }
    if (driverValidationDef["CarrierCode"] !== undefined) {
      const validationErrors = { ...this.state.validationErrors };
      validationErrors["CarrierCode"] = Utilities.validateField(
        driverValidationDef["CarrierCode"],
        carrier
      );

      this.setState({ validationErrors });
    }
  };
  handleSave = () => {
    try {
      // this.setState({ saveEnabled: false });
      let modDriver = lodash.cloneDeep(this.state.modDriver);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(modDriver, attributeList)) {
        // modDriver = this.fillAttributeDetails(modDriver, attributeList);

        // modDriver = Utilities.convertDatesToString(
        //   DateFieldsInEntities.DatesInEntity.Driver,
        //   modDriver
        // );
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempDriver = lodash.cloneDeep(modDriver);
        this.setState({ showAuthenticationLayout, tempDriver }, () => {
          if (showAuthenticationLayout === false) {
            this.saveDriver();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("DriverDetailsComposite:Error occured on handleSave", error);
    }
  };
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  saveDriver = () => {
    //debugger
    try {
      this.setState({ saveEnabled: false });
      let tempDriver = lodash.cloneDeep(this.state.tempDriver);

      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      tempDriver = this.fillAttributeDetails(tempDriver, attributeList);

      tempDriver = Utilities.convertDatesToString(
        DateFieldsInEntities.DatesInEntity.Driver,
        tempDriver
      );
      this.state.driver.Code === ""
        ? this.CreateDriver(tempDriver)
        : this.UpdateDriver(tempDriver);
    } catch (error) {
      console.log("DriverDetailsComposite : Error in saveDriver");
    }
  };
  fillAttributeDetails(modDriver, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modDriver.Attributes = Utilities.fillAttributeDetails(attributeList);

      if (this.state.isDCHEnabled) {
        let modDCHAttributes = lodash.cloneDeep(this.state.modDCHAttributes);
        modDriver.IsDCHEnabled = true;
        if (
          modDCHAttributes !== null &&
          modDCHAttributes !== undefined &&
          modDCHAttributes.length > 0
        ) {
          let dchAttributeInfo = {
            EntityCode: modDriver.Code,
            EntityType: Constants.ExtendEntity.DRIVER,
            Shareholdercode: this.props.selectedShareholder,
            TabAttributeDataList: [],
          };

          modDCHAttributes.forEach((attribute) => {
            dchAttributeInfo.TabAttributeDataList.push(attribute);
          });
          modDriver.DCHAttribute = dchAttributeInfo;
        }
      } else {
        modDriver.IsDCHEnabled = false;
        modDriver.DCHAttribute = null;
      }

      return modDriver;
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  validateSave(modDriver, attributeList) {
    //const { modDriver } = this.state;
    var validationErrors = { ...this.state.validationErrors };
    Object.keys(driverValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        driverValidationDef[key],
        modDriver[key]
      );
    });

    if (modDriver.Active !== this.state.driver.Active) {
      if (modDriver.Remarks === null || modDriver.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }
    if (
      (modDriver.License2 !== null && modDriver.License2 !== "") ||
      !isNaN(Date.parse(modDriver.License2ExpiryDate)) ||
      !isNaN(Date.parse(modDriver.License2IssueDate))
    ) {
      if (modDriver.License2 === null || modDriver.License2 === "") {
        validationErrors["License2"] = "DriverInfo_License2Required";
      }

      if (isNaN(Date.parse(modDriver.License2ExpiryDate))) {
        validationErrors["License2ExpiryDate"] =
          "DriverInfo_Lic2ExpiryRequired";
      }
      if (isNaN(Date.parse(modDriver.License2IssueDate))) {
        validationErrors["License2IssueDate"] = "DriverInfo_Lic2IssueRequired";
      }
    }

    if (
      (modDriver.License3 !== null && modDriver.License3 !== "") ||
      !isNaN(Date.parse(modDriver.License3ExpiryDate)) ||
      !isNaN(Date.parse(modDriver.License3IssueDate))
    ) {
      if (modDriver.License3 === null || modDriver.License3 === "") {
        validationErrors["License3"] = "DriverInfo_License3Required";
      }
      if (isNaN(Date.parse(modDriver.License3ExpiryDate))) {
        validationErrors["License3ExpiryDate"] =
          "DriverInfo_Lic3ExpiryRequired";
      }
      if (isNaN(Date.parse(modDriver.License3IssueDate))) {
        validationErrors["License3IssueDate"] = "DriverInfo_Lic3IssueRequired";
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

    let dchAttributeValidationErrors = lodash.cloneDeep(
      this.state.dchAttributeValidationErrors
    );

    let modDCHAttributes = lodash.cloneDeep(this.state.modDCHAttributes);

    //dchAttributeValidationErrors = getDCHAttributeErrors(modDCHAttributes, dchAttributeValidationDef);
    modDCHAttributes.forEach((attributes) => {
      dchAttributeValidationErrors[attributes.ID] = Utilities.validateField(
        dchAttributeValidationDef["attribute"],
        attributes.Value
      );
    });

    this.setState({ dchAttributeValidationErrors });

    if (returnValue)
      returnValue = Object.values(dchAttributeValidationErrors).every(function (
        value
      ) {
        return value === "";
      });

    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
    return returnValue;
  }

  CreateDriver(modDriver) {
    var keyCode = [
      {
        key: KeyCodes.driverCode,
        value: this.state.modDriver.Code,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.driverCode,
      KeyCodes: keyCode,
      Entity: modDriver,
    };

    var notification = {
      messageType: "critical",
      message: "DriverInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["DriverInfo_Code"],
          keyValues: [this.state.modDriver.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateDriver,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        // modDriver = Utilities.convertStringToDates(
        //   DateFieldsInEntities.DatesInEntity.Driver,
        //   modDriver
        // );
        var result = response.data;
        //console.log(result);
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            // driver: lodash.cloneDeep(this.state.modDriver),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnDriver
            ),
            showAuthenticationLayout: false,
          });
          this.getDriver({
            selectedRow: { Common_Code: this.state.modDriver.Code },
          });
          //this.props.onSaved(this.state.modDriver, "DriverAddition", true, "");
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDriver
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateDriver:", result.ErrorList);
        }
        this.props.onSaved(this.state.modDriver, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnDriver
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modCarrier, "add", notification);
      });
  }

  UpdateDriver(modDriver) {
    var keyCode = [
      {
        key: KeyCodes.driverCode,
        value: this.state.modDriver.Code,
      },
    ];

    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.driverCode,
      KeyCodes: keyCode,
      Entity: modDriver,
    };

    var notification = {
      messageType: "critical",
      message: "DriverInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["DriverInfo_Code"],
          keyValues: [this.state.modDriver.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateDriver,
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
            //driver: lodash.cloneDeep(this.state.modDriver),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnDriver
            ),
            showAuthenticationLayout: false,
          });
          this.getDriver({
            selectedRow: { Common_Code: this.state.modDriver.Code },
          });
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnDriver
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateDriver:", result.ErrorList);
        }
        this.props.onSaved(this.state.modDriver, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modCarrier, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnDriver
          ),
          showAuthenticationLayout: false,
        });
      });
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getHazardousLookup();
      this.getLanguages();
      this.getCarriers(this.props.selectedShareholder);
      this.getAttributes(this.props);
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  getCarriers(shareholder) {
    axios(
      RestAPIs.GetCarrierCodes +
        "?Transportationtype=" +
        Constants.TransportationType.ROAD +
        "&ShareholderCode=" +
        shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        // console.log(response);
        var result = response.data;
        if (result.IsSuccess === true) {
          // console.log(result.EntityResult);
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var carrierOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let carrierSearchOptions = lodash.cloneDeep(carrierOptions);
            if (carrierSearchOptions.length > Constants.filteredOptionsCount) {
              carrierSearchOptions = carrierSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ carrierOptions, carrierSearchOptions });
          }
        } else {
          console.log("Error in GetCarrierCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetCarrierCodes:", error);
      });
  }

  getAttributes(props) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [driverAttributeEntity],
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
                  result.EntityResult.driver
                ),
            },
            () => this.getDriver(props)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getLanguages() {
    axios(
      RestAPIs.GetLanguageList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          // console.log(result);
          let languageOptions = [];
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult).forEach((key) =>
              languageOptions.push({
                text: result.EntityResult[key],
                value: key,
              })
            );
            this.setState({ languageOptions });
          } else {
            console.log("No languages identified.");
          }
        } else {
          console.log("Error in getLanguages:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Languages:", error);
      });
  }

  getDriver(props) {
    let driver = props.selectedRow;
    emptyDriver.ShareholderCode = this.props.selectedShareholder;
    emptyDriver.LanguageCode = this.props.userDetails.EntityResult.UICulture;
    var terminalCodes = [...this.state.terminalCodes];
    if (driver.Common_Code === undefined) {
      terminalCodes = [];

      this.setState(
        {
          driver: lodash.cloneDeep(emptyDriver),
          modDriver: lodash.cloneDeep(emptyDriver),
          isReadyToRender: true,
          terminalCodes,
          modAttributeMetaDataList: [],
          driverDetailsKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnDriver
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsDCHEnabled)
            this.getShareholderDetail(this.props.selectedShareholder);
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.driverCode,
        value: driver.Common_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.driverCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetDriver,
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
              driver: result.EntityResult,
              modDriver: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDriver
              ),
            },
            () => {
              this.getKPIList(
                this.props.selectedShareholder,
                result.EntityResult.Code,
                result.EntityResult.CarrierCode
              );
              if (this.props.userDetails.EntityResult.IsDCHEnabled)
                this.getShareholderDetail(this.props.selectedShareholder);
              this.getTerminalsForCarrier(result.EntityResult.CarrierCode);
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState(
            {
              modDriver: lodash.cloneDeep(emptyDriver),
              driver: lodash.cloneDeep(emptyDriver),
              isReadyToRender: true,
            },
            () => {
              if (this.props.userDetails.EntityResult.IsDCHEnabled)
                this.getShareholderDetail(this.props.selectedShareholder);
            }
          );
          console.log("Error in GetDriver:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Driver:", error, props);
      });
  }

  handleImageChange = (event) => {
    try {
      var modDriver = lodash.cloneDeep(this.state.modDriver);

      if (
        event.target.files[0].type.includes("image") &&
        event.target.files[0].size <= 500 * 1024
      ) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // converts the blob to base64 and calls onload
        reader.onloadend = () => {
          modDriver.DriverImage = reader.result.split(";base64,")[1];
          this.setState({ modDriver });
        };
      } else {
        console.log("wrong type of image");
        event.target.value = null;
        modDriver.DriverImage = null;
        this.setState({ modDriver });
      }
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on handleImageChange",
        error
      );
    }
  };

  handleReset = () => {
    try {
      var modDriver = lodash.cloneDeep(this.state.driver);
      this.setState(
        {
          modDriver,
          validationErrors: [],
          modAttributeMetaDataList: [],
          dchAttributeValidationErrors: {},
          modDCHAttributes: lodash.cloneDeep(this.state.dchAttribute),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modDriver.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.driver.Code === "") {
        var terminalCodes = [...this.state.terminalCodes];
        terminalCodes = [];
        this.setState({ terminalCodes });
      }
    } catch (error) {
      console.log("DriverDetailsComposite:Error occured on handleReset", error);
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
        "DriverDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleDCHCellDataEdit = (attribute, value) => {
    try {
      attribute.Value = value;
      this.setState({
        attribute: attribute,
      });
      const dchAttributeValidationErrors = lodash.cloneDeep(
        this.state.dchAttributeValidationErrors
      );

      dchAttributeValidationErrors[attribute.ID.toString()] =
        Utilities.validateField(dchAttributeValidationDef["attribute"], value);
      this.setState({ dchAttributeValidationErrors });
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on handleDCHCellDataEdit",
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
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.driver
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleClick = () => {
    this.setState({
      showMe: !this.state.showMe,
      hideShowContent:
        this.state.hideShowContent === "HIDE ATTRIBUTES"
          ? "SHOW ATTRIBUTES"
          : "HIDE ATTRIBUTES",
    });
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = { ...this.state.validationErrors };
      var modDriver = lodash.cloneDeep(this.state.modDriver);
      validationErrors[propertyName] = error;
      modDriver[propertyName] = value;
      this.setState({ validationErrors, modDriver });
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };
  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.state.terminalCodes];
      var modDriver = lodash.cloneDeep(this.state.modDriver);

      if (checked) modDriver.TerminalCodes = [...terminalCodes];
      else modDriver.TerminalCodes = [];
      this.setState({ modDriver });
      this.terminalSelectionChange(modDriver.TerminalCodes);
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };
  handleActiveStatusChange = (value) => {
    try {
      let modDriver = lodash.cloneDeep(this.state.modDriver);
      modDriver.Active = value;
      if (modDriver.Active !== this.state.driver.Active) modDriver.Remarks = "";
      this.setState({ modDriver });
    } catch (error) {
      console.log(error);
    }
  };

  handleCarrierSearchChange = (carrierCode) => {
    try {
      let carrierSearchOptions = this.state.carrierOptions.filter((item) =>
        item.value.toLowerCase().includes(carrierCode.toLowerCase())
      );
      if (carrierSearchOptions.length > Constants.filteredOptionsCount) {
        carrierSearchOptions = carrierSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        carrierSearchOptions,
      });
    } catch (error) {
      console.log(
        "DriverDetailsCompositeComposite:Error occured on handleCarrierSearchChange",
        error
      );
    }
  };
  getHazardousLookup() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=HazardousMaterial",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult["RoadEnabled"]) {
            if (result.EntityResult["RoadEnabled"].toLowerCase() === "true") {
              this.setState({ hazardousEnabled: true });
            }
          }
        }
      });
    } catch (error) {
      console.log(
        "DriverDetailsComposite:Error occured on getHazardousLookup",
        error
      );
    }
  }
  getCarrierSearchOptions() {
    let carrierSearchOptions = lodash.cloneDeep(
      this.state.carrierSearchOptions
    );
    let modCarrierCode = this.state.modDriver.CarrierCode;
    if (
      modCarrierCode !== null &&
      modCarrierCode !== "" &&
      modCarrierCode !== undefined
    ) {
      let selectedCarrierCode = carrierSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modCarrierCode.toLowerCase()
      );
      if (selectedCarrierCode === undefined) {
        carrierSearchOptions.push({
          text: modCarrierCode,
          value: modCarrierCode,
        });
      }
    }
    return carrierSearchOptions;
  }
  getKPIList(shareholder, driverCode, CarrierCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiDriverDetail,
        InputParameters: [
          { key: "ShareholderCode", value: shareholder },
          { key: "DriverCode", value: driverCode },
          { key: "CarrierCode", value: CarrierCode },
        ],
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
              driverDetailsKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ driverDetailsKPIList: [] });
            console.log("Error in driver KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Driver KPIList:", error);
        });
    }
  }
  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(this.state.modDriver.LastUpdatedDate).toLocaleDateString() +
          " " +
          new Date(this.state.modDriver.LastUpdatedDate).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modDriver.CreatedDate).toLocaleDateString() +
          " " +
          new Date(this.state.modDriver.CreatedDate).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modDriver.LastActiveDate !== undefined &&
          this.state.modDriver.LastActiveDate !== null
            ? new Date(
                this.state.modDriver.LastActiveDate
              ).toLocaleDateString() +
              " " +
              new Date(this.state.modDriver.LastActiveDate).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_LastReported",
        fieldValue:
          this.state.modDriver.LastReportTime !== undefined &&
          this.state.modDriver.LastReportTime !== null
            ? new Date(
                this.state.modDriver.LastReportTime
              ).toLocaleDateString() +
              " " +
              new Date(this.state.modDriver.LastReportTime).toLocaleTimeString()
            : "",
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.driver.Code}
            newEntityName="DriverInfo_NewDriver"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.driverDetailsKPIList}>
          {" "}
        </TMDetailsKPILayout>
        <ErrorBoundary>
          <DriverDetails
            driver={this.state.driver}
            modDriver={this.state.modDriver}
            modDCHAttributes={this.state.modDCHAttributes}
            validationErrors={this.state.validationErrors}
            attributeValidationErrors={this.state.attributeValidationErrors}
            listOptions={{
              carriers: this.getCarrierSearchOptions(),
              languageOptions: this.state.languageOptions,
              terminalCodes: this.state.terminalCodes,
            }}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            onActiveStatusChange={this.handleActiveStatusChange}
            onFieldChange={this.handleChange}
            onDateTextChange={this.handleDateTextChange}
            onCarrierChange={this.handleCarrierChange}
            onImageChange={this.handleImageChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            onAttributeDataChange={this.handleAttributeDataChange}
            onCarrierSearchChange={this.handleCarrierSearchChange}
            isDCHEnabled={this.state.isDCHEnabled}
            dchAttributeValidationErrors={
              this.state.dchAttributeValidationErrors
            }
            handleDCHCellDataEdit={this.handleDCHCellDataEdit}
            isWebPortalUser={
              this.props.userDetails.EntityResult.IsWebPortalUser
            }
            hazardousEnabled={this.state.hazardousEnabled}
          ></DriverDetails>
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
              this.state.driver.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnDriver}
            handleOperation={this.saveDriver}
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

export default connect(mapStateToProps)(DriverDetailsComposite);

DriverDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
