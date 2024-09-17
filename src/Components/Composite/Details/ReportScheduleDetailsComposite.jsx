import React, { Component } from "react";
import { ReportScheduleDetails } from "../../UIBase/Details/ReportScheduleDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as Utilities from "../../../JS/Utilities";
import { emptyReportSchedule } from "../../../JS/DefaultEntities";
import axios from "axios";
import PropTypes from "prop-types";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import dayjs from "dayjs";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";
import { Select, DatePicker, Input } from "@scuf/common";
import { reportScheduleValidationDef } from "../../../JS/ValidationDef";
import {
  functionGroups,
  fnReportConfiguration,
} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class ReportScheduleDetailsComposite extends Component {
  state = {
    reportScheduleDetails: {},
    modreportScheduleDetails: {},
    validationErrors: Utilities.getInitialValidationErrors(
      reportScheduleValidationDef
    ),
    isReadyToRender: false,
    //listOptions: { carriers: [], languageOptions: [], terminalCodes: [] },
    saveEnabled: false,
    entityType: "reportSchedule",
    printerList: [],
    reportNames: [],
    selectedShareholer: this.props.selectedShareholder,
    showReportParams: false,
    parameters: [],
    displayParameters: [],
    paramValues: {},
    savedparamValues: {},
    paramOptions: {},
    disabledParams: {},
    listLoading: true,
    parameterLoading: false,
    showAuthenticationLayout: false,
    tempReportScheduleDetails: {},

  };
  componentDidMount() {
    try {
      // this.setState({ isReadyToRender: true });
      let isNew = false;
      if (this.props.selectedRow.ReportSchedules_ReportName === undefined)
        isNew = true;
      this.getReportSchedule(isNew);
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.reportScheduleDetails.ReportName !== "" &&
        nextProps.selectedRow.ReportSchedules_ReportName === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getReportSchedule(true);
      }
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  validateParams = (paramValues) => {
    let cloneValidationErrors = { ...this.state.validationErrors };
    let cloneModreportScheduleDetails = {
      ...this.state.modreportScheduleDetails,
    };
    if (
      cloneModreportScheduleDetails.IsPrint &&
      (cloneModreportScheduleDetails.Printer === undefined ||
        cloneModreportScheduleDetails.Printer === null ||
        cloneModreportScheduleDetails.Printer === "")
    ) {
      cloneValidationErrors["Printer"] = "ReportSchedule_PrinterRequired";
    } else {
      cloneValidationErrors["Printer"] = "";
    }
    if (
      cloneModreportScheduleDetails.ReportName === "" ||
      cloneModreportScheduleDetails.ReportName == null
    ) {
      cloneValidationErrors["ReportName"] = "ReportSchedule_ReportNameRequired";
    }
    let validationDef = this.validationDef;
    if (validationDef !== undefined && validationDef != null) {
      Object.keys(validationDef).forEach(function (key) {
        if (paramValues[key] !== undefined)
          cloneValidationErrors[key] = Utilities.validateField(
            validationDef[key],
            paramValues[key]
          );
      });
    }

    this.setState({ validationErrors: cloneValidationErrors });
    let returnValue = Object.values(cloneValidationErrors).every(function (
      value
    ) {
      return value === "";
    });

    return returnValue;
  };

  getReportSchedule(isNew) {
    this.getReportNames(isNew);
    this.getPrintersNames();
    let modreportScheduleDetails;

    if (isNew) {
      this.setState({
        reportScheduleDetails: lodash.cloneDeep(emptyReportSchedule),
        modreportScheduleDetails: lodash.cloneDeep(emptyReportSchedule),
        showReportParams: false,
        parameters: [],
        displayParameters: [],
        paramValues: {},
        savedparamValues: {},
        paramOptions: {},
        disabledParams: {},
        isReadyToRender: true,
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnReportConfiguration
        ),
      });

      return;
    } else {
      modreportScheduleDetails = this.state.modreportScheduleDetails;
      if (
        modreportScheduleDetails.ShareholderCode === undefined ||
        modreportScheduleDetails.ShareholderCode === null ||
        modreportScheduleDetails.ShareholderCode === ""
      )
        modreportScheduleDetails.ShareholderCode =
          this.props.selectedShareholder;
      if (
        modreportScheduleDetails.ReportName === undefined ||
        modreportScheduleDetails.ReportName === null ||
        modreportScheduleDetails.ReportName === ""
      )
        modreportScheduleDetails.ReportName =
          this.props.selectedRow.ReportSchedules_ReportName;
    }
    axios(
      RestAPIs.GetReportScheduleDetails +
      "?ShareholderCode=" +
      modreportScheduleDetails.ShareholderCode +
      "&ReportName=" +
      modreportScheduleDetails.ReportName,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          //fill all the values of various params
          this.getReportParams(
            result.EntityResult.ReportName,
            result.EntityResult.ParamData
          );
          this.FillParamValuesFromDetails(result.EntityResult.ParamData);
          this.setState({
            isReadyToRender: true,
            reportScheduleDetails: result.EntityResult,
            modreportScheduleDetails: lodash.cloneDeep(result.EntityResult),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnReportConfiguration
            ),
          });
        } else {
          this.setState({
            modreportScheduleDetails: lodash.cloneDeep(emptyReportSchedule),
            reportScheduleDetails: lodash.cloneDeep(emptyReportSchedule),
            isReadyToRender: true,
          });
          console.log("Error in GetReportScheduleDetails:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting report schedule:", error);
      });
  }

  getReportParams = (report, passedParamdata) => {
    axios(
      RestAPIs.GetReportParams + "?ReportName=" + report,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        if (response.data.IsSuccess) {
          let params = response.data.EntityResult.Parameters;
          let cloneDisplayParams = response.data.EntityResult.Parameters;
          this.paramTables = response.data.EntityResult.ReportsData;
          let cloneParamOptions = lodash.cloneDeep(this.state.paramOptions);
          let cloneDisabledParams = lodash.cloneDeep(this.state.disabledParams);
          let cloneParamValues = {
            Culture: this.props.userDetails.EntityResult.UICulture,
          };

          this.validationDef = {};
          this.reportName = response.data.EntityResult.ReportName;
          if (response.data.EntityResult.UserName !== undefined && response.data.EntityResult.UserName !== null) {
            cloneParamValues["UserName"] = response.data.EntityResult.UserName;
          }


          if (params !== undefined && params !== null) {
            for (let j = 0; j < params.length; ++j) {
              if (params[j].ControlType === "DateTime") {
                cloneDisplayParams = cloneDisplayParams.filter(
                  (obj) => obj.ParamName !== params[j].ParamName
                );
              } else if (
                !this.props.userDetails.EntityResult.IsEnterpriseNode &&
                params[j].IsOnlyForEnterprise
              ) {
                cloneDisplayParams = cloneDisplayParams.filter(
                  (obj) => obj.ParamName !== params[j].ParamName
                );
              } else if (params[j].ParamName === "Shareholder") {
                cloneDisplayParams = cloneDisplayParams.filter(
                  (obj) => obj.ParamName !== params[j].ParamName
                );
              }
            }
            for (let i = 0; i < params.length; ++i) {
              if (params[i].ControlType === "DropDownList") {
                this.validationDef[params[i].ParamName] = [];
                if (params[i].Required === true) {
                  this.validationDef[params[i].ParamName].push({
                    minLength: 1,
                    errorCode: "Select_Value",
                  });
                }
                if (
                  params[i].DependentControls === null ||
                  params[i].DependentControls.length === 0 ||
                  (params[i].DependentControls.length === 1 &&
                    params[i].DependentControls[0] === "Shareholder") ||
                  (params[i].DependentControls.length === 1 &&
                    params[i].DependentControls[0] === "Terminal" &&
                    !this.props.userDetails.EntityResult.IsEnterpriseNode)
                ) {
                  let tableName = params[i].TableName;
                  let fieldName = params[i].FieldName;
                  let list = this.paramTables[tableName];
                  let optionsSet = new Set(list.map((row) => row[fieldName]));
                  optionsSet = [...optionsSet];
                  let optionsValues = Utilities.transferListtoOptions(optionsSet);

                  cloneParamValues[params[i].ParamName] = null;

                  if (!params[i].IsOnlyForEnterprise && !params[i].Required) {
                    optionsValues.unshift({ text: "All", value: "0" });
                    cloneParamValues[params[i].ParamName] = 0;
                  }
                  cloneParamOptions[params[i].ParamName] = optionsValues;
                  cloneDisabledParams[params[i].ParamName] = false;
                } else {
                  let optionsValues = [{ text: "All", value: "0" }];
                  cloneParamOptions[params[i].ParamName] = optionsValues;
                  cloneDisabledParams[params[i].ParamName] = true;
                  cloneParamValues[params[i].ParamName] = 0;
                  if (!params[i].IsOnlyForEnterprise && !params[i].Required) {
                    optionsValues.unshift({ text: "All", value: "0" });
                    cloneParamValues[params[i].ParamName] = 0;
                  }
                }
              } else if (params[i].ControlType === "DateTime") {
                //this.validationDef[params[i].ParamName] = [];
                if (params[i].Required === true) {
                  let def = [
                    { minLength: 1, errorCode: "Select_Date" },
                    { isDate: true, errorCode: "Valid_Date" },
                  ];

                  this.validationDef[params[i].ParamName] = def;
                }
                cloneParamValues[params[i].ParamName] = null;
              } else if (params[i].ControlType === "Date") {
                //this.validationDef[params[i].ParamName] = [];
                if (params[i].Required === true) {
                  let def = [
                    { minLength: 1, errorCode: "Select_Date" },
                    { isDate: true, errorCode: "Valid_Date" },
                  ];

                  this.validationDef[params[i].ParamName] = def;
                }
                cloneParamValues[params[i].ParamName] = null;
              } else if (params[i].ControlType === "Text") {
                if (params[i].Required === true) {
                  const codeExpression = "^[0-9a-zA-Z-_]+$";
                  const codeError = "Code_ValidInputCharacters";
                  let def = [
                    { minLength: 1, errorCode: "Mandatory_Field" },
                    { expression: codeExpression, errorCode: codeError },
                  ];

                  this.validationDef[params[i].ParamName] = def;
                }
                cloneParamValues[params[i].ParamName] = null;
              }
            }
            if (
              !this.props.userDetails.EntityResult.IsEnterpriseNode &&
              cloneParamValues !== undefined &&
              cloneParamValues !== null &&
              cloneParamOptions.Terminal !== undefined &&
              cloneParamOptions.Terminal !== null
            ) {
              cloneParamValues.Terminal = cloneParamOptions.Terminal[0].value;
            }
            if (
              cloneParamValues !== undefined &&
              cloneParamValues !== null &&
              (cloneParamOptions.Shareholder !== undefined &&
                cloneParamOptions.Shareholder !== null)
            ) {
              cloneParamValues.Shareholder = this.props.selectedShareholder;
            }

            let paramDatefields = params.filter(
              (ob) => ob.ControlType === "DateTime" || ob.ControlType === "Date"
            );
            if (
              paramDatefields !== undefined &&
              paramDatefields !== null &&
              paramDatefields.length > 0
            ) {
              for (let i = 0; i < paramDatefields.length; ++i) {
                cloneParamValues[paramDatefields[i].ParamName] = dayjs(
                  new Date()
                ).format("YYYY-MM-DD");
              }
            }

            if (
              passedParamdata === undefined ||
              passedParamdata === null ||
              passedParamdata === ""
            ) {
              this.setState({
                parameters: [...response.data.EntityResult.Parameters],
                paramOptions: cloneParamOptions,
                disabledParams: cloneDisabledParams,
                paramValues: cloneParamValues,
                showReportParams: true, //trying
                validationErrors: Utilities.getInitialValidationErrors(
                  this.validationDef
                ),
                parameterLoading: false,
                displayParameters: cloneDisplayParams,
              });
            } else {
              this.setState({
                parameters: [...response.data.EntityResult.Parameters],
                paramOptions: cloneParamOptions,
                disabledParams: cloneDisabledParams,
                showReportParams: true, //trying
                validationErrors: Utilities.getInitialValidationErrors(
                  this.validationDef
                ),
                parameterLoading: false,
                displayParameters: cloneDisplayParams,
              });
            }
          }
        } else {
          console.log("Get Report Params error:", response.data.ErrorList);
          this.setState({ parameterLoading: false, showReportParams: false });
        }
      })
      .catch((err) => {
        console.log("Error occured on get report params", err);
        this.setState({ parameterLoading: false, showReportParams: false });
      });
  };
  handleReportChange = (reportName) => {
    try {
      this.setState({ parameterLoading: true });
      let modreportScheduleDetails = this.state.modreportScheduleDetails;
      modreportScheduleDetails.ReportName = reportName;
      modreportScheduleDetails.ScheduleName =
        reportName + this.props.selectedShareholder;
      this.setState({ modreportScheduleDetails: modreportScheduleDetails });
      this.getReportParams(reportName, null);
      this.buildReportParams();
      // let returnValue = Object.values(this.state.validationErrors).every(
      //   function (value) {
      //     return value === "";
      //   }
      // );
      // if (returnValue) {
      //   this.getReportParams(reportName);
      //   this.buildReportParams();
      // }
    } catch (error) {
      console.log(
        "ReportsComposite: Error occured onhandleShowReportClick",
        error
      );
    }
  };
  handlePrinterChange = (printers) => {
    try {
      const modreportScheduleDetails = lodash.cloneDeep(
        this.state.modreportScheduleDetails
      );
      modreportScheduleDetails.Printer = printers.join(",");
      this.setState({ modreportScheduleDetails: modreportScheduleDetails });
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on handlePrinterChange",
        error
      );
    }
  };
  handleCheckChange = (propertyName, value) => {
    try {
      const modreportScheduleDetails = lodash.cloneDeep(
        this.state.modreportScheduleDetails
      );
      modreportScheduleDetails[propertyName] = value;
      if (propertyName === "IsPrint" && !value) {
        modreportScheduleDetails["Printer"] = "";
      }
      this.setState({ modreportScheduleDetails: modreportScheduleDetails });
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on handleCheckChange",
        error
      );
    }
  };
  buildReportParams = () => {
    let isSavedReportSchedule = false;
    if (
      this.state.savedparamValues !== "" &&
      this.state.savedparamValues !== undefined
    ) {
      isSavedReportSchedule = true;
    }
    return this.state.displayParameters.map((parameter) => {
      if (parameter.ControlType === "DropDownList") {
        return (
          <div className="col-12 col-md-6 col-lg-4">
            <TranslationConsumer>
              {(t) => (
                <Select
                  fluid
                  placeholder={t("FinishedProductInfo_Select")}
                  indicator={parameter.Required ? "required" : ""}
                  label={t(parameter.LocalisedParamName)}
                  value={
                    !isSavedReportSchedule &&
                      (this.state.paramValues[parameter.ParamName] ===
                        undefined ||
                        this.state.paramValues[parameter.ParamName] === null)
                      ? ""
                      : isSavedReportSchedule
                        ? this.state.savedparamValues[parameter.ParamName]
                        : this.state.paramValues[parameter.ParamName]
                  }
                  disabled={this.state.disabledParams[parameter.ParamName]}
                  options={this.state.paramOptions[parameter.ParamName]}
                  onChange={(data) => this.onDropDownChange(data, parameter)}
                  error={t(this.state.validationErrors[parameter.ParamName])}
                  reserveSpace={false}
                />
              )}
            </TranslationConsumer>
          </div>
        );
      } else if (parameter.ControlType === "DateTime") {
        return "";
        // return (
        //   <div className="col-12 col-md-6 col-lg-4">
        //     <TranslationConsumer>
        //       {(t) => (
        //         <DatePicker
        //           fluid
        //           //value={modCarrier.PermitExpiryDate.toISOString()}
        //           value={
        //             !isSavedReportSchedule &&
        //             this.state.paramValues[parameter.ParamName] === null
        //               ? new Date()
        //               : isSavedReportSchedule
        //               ? new Date(
        //                   this.state.savedparamValues[parameter.ParamName]
        //                 )
        //               : new Date(this.state.paramValues[parameter.ParamName])
        //           }
        //           displayFormat={getCurrentDateFormat()}
        //           label={t(parameter.LocalisedParamName)}
        //           showYearSelector="true"
        //           //indicator={parameter.Required ? "required" : ""}
        //           // onChange={(data) =>
        //           //   this.onFieldChange(parameter.ParamName, data.toISOString())
        //           // }
        //           // onTextChange={(value, error) => {
        //           //   this.onDateTextChange(parameter.ParamName, value, error);
        //           // }}
        //           // error={t(this.state.validationErrors[parameter.ParamName])}
        //           // reserveSpace={false}
        //         />
        //       )}

        //     </TranslationConsumer>
        //   </div>
        // );
      } else if (parameter.ControlType === "Text") {
        return (
          <div className="col-12 col-md-6 col-lg-4">
            <TranslationConsumer>
              {(t) => (
                <Input
                  fluid
                  value={
                    !isSavedReportSchedule &&
                      this.state.paramValues[parameter.ParamName] === null
                      ? ""
                      : isSavedReportSchedule
                        ? this.state.savedparamValues[parameter.ParamName]
                        : this.state.paramValues[parameter.ParamName]
                  }
                  onChange={(data) =>
                    this.onFieldChange(parameter.ParamName, data)
                  }
                  label={t(parameter.LocalisedParamName)}
                  error={t(this.state.validationErrors[parameter.ParamName])}
                  reserveSpace={false}
                />
              )}
            </TranslationConsumer>
          </div>
        );
      }
    });
  };
  onFieldChange = (ParamName, date) => {
    let cloneParamValues = lodash.cloneDeep(this.state.paramValues);
    let cloneValidationErrors = lodash.cloneDeep(this.state.validationErrors);
    cloneParamValues[ParamName] = date;

    if (this.validationDef[ParamName] !== undefined) {
      cloneValidationErrors[ParamName] = Utilities.validateField(
        this.validationDef[ParamName],
        date
      );
    }

    this.setState({
      paramValues: cloneParamValues,
      validationErrors: cloneValidationErrors,
    });
  };

  onDateTextChange = (ParamName, value, error) => {
    let cloneParamValues = lodash.cloneDeep(this.state.paramValues);
    let cloneValidationErrors = lodash.cloneDeep(this.state.validationErrors);

    cloneValidationErrors[ParamName] = error;
    cloneParamValues[ParamName] = value;

    this.setState({
      paramValues: cloneParamValues,
      validationErrors: cloneValidationErrors,
    });
  };
  onDropDownChange = (data, parameter) => {
    let cloneParamValues = lodash.cloneDeep(this.state.paramValues);
    let cloneDisabledParams = lodash.cloneDeep(this.state.disabledParams);
    let cloneParamOptions = lodash.cloneDeep(this.state.paramOptions);
    let cloneValidationErrors = lodash.cloneDeep(this.state.validationErrors);
    if (data !== undefined && data !== null) {
      cloneParamValues[parameter.ParamName] = data;
      if (this.validationDef[parameter.ParamName] !== undefined) {
        cloneValidationErrors[parameter.ParamName] = Utilities.validateField(
          this.validationDef[parameter.ParamName],
          data
        );
      }

      let refreshControls = parameter.RefreshControls;

      for (let i = 0; i < refreshControls.length; ++i) {
        cloneDisabledParams[refreshControls[i]] = false;
        let refreshParameter = this.state.parameters.find(
          ({ ParamName }) => ParamName === refreshControls[i]
        );

        let paramTable = this.paramTables[refreshParameter.TableName];
        let dependentControls = refreshParameter.DependentControls;
        for (let j = 0; j < dependentControls.length; ++j) {
          let dependantParam = this.state.parameters.find(
            ({ ParamName }) => ParamName === dependentControls[j]
          );

          paramTable = paramTable.filter(
            (obj) =>
              obj[dependantParam.FieldName] ===
              cloneParamValues[dependentControls[j]]
          );
        }

        let optionsSet = new Set(
          paramTable.map((row) => row[refreshParameter.FieldName])
        );
        optionsSet = [...optionsSet];

        let optionsValues = Utilities.transferListtoOptions(optionsSet);
        optionsValues.unshift({ text: "All", value: "0" });
        cloneParamOptions[refreshParameter.ParamName] = optionsValues;
      }
    }

    this.setState({
      paramValues: cloneParamValues,
      //tocheck
      savedparamValues: cloneParamValues,
      disabledParams: cloneDisabledParams,
      paramOptions: cloneParamOptions,
      validationErrors: cloneValidationErrors,
    });
  };


  AddUpdateReportConfig = () => {
    try {
      this.setState({ saveEnabled: false });
      this.handleAuthenticationClose();

      let tempReportScheduleDetails = lodash.cloneDeep(this.state.tempReportScheduleDetails);

      tempReportScheduleDetails = this.FillParams(tempReportScheduleDetails);
     
      this.state.reportScheduleDetails.ReportName === ""
        ? this.CreateReportSchedule(tempReportScheduleDetails)
        : this.UpdateReportSchedule(tempReportScheduleDetails);

    } catch (error) {
      console.log("Report config Composite : Error in AddUpdateReportConfig");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      //let modDriver = this.fillAttributeDetails();
      let modreportScheduleDetails = lodash.cloneDeep(
        this.state.modreportScheduleDetails
      );
      if (this.validateParams(this.state.paramValues)) {
       
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempReportScheduleDetails = lodash.cloneDeep(modreportScheduleDetails);
      this.setState({ showAuthenticationLayout, tempReportScheduleDetails }, () => {
        if (showAuthenticationLayout === false) {
          this.AddUpdateReportConfig();
        }
    });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };
  FillParamValuesFromDetails(ParamData) {
    try {
      let savedparamValues = {};
      if (
        ParamData !== undefined &&
        ParamData !== "" &&
        ParamData.split(",").length > 2
      ) {
        let paramSavedValues = ParamData.split(",");
        paramSavedValues.pop();
        //for (let i = 0; i < (paramSavedValues.length - 1) / 2; i = i + 2) {
        for (let i = 0; i < paramSavedValues.length - 1; i = i + 2) {
          // if (paramSavedValues[i] !== "Culture") {
          //   savedparamValues[paramSavedValues[i]] = paramSavedValues[i + 1];
          // }
          savedparamValues[paramSavedValues[i]] = paramSavedValues[i + 1];
        }
        this.setState(
          { savedparamValues: savedparamValues, paramValues: savedparamValues },
          () => {
            this.setState({ showReportParams: true });
            this.buildReportParams();
          }
        );
      }
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on handleSave",
        error
      );
    }
  }
  FillParams(modreportScheduleDetails) {
    let paramKeys = Object.keys(this.state.paramValues);
    // if (
    //   this.state.savedparamValues !== null &&
    //   this.state.savedparamValues !== undefined &&
    //   this.state.savedparamValues !== ""
    // ) {
    //   paramKeys = Object.keys(this.state.savedparamValues);
    // }

    // let reportParams = [];
    let reportParams = "";
    for (let i = 0; i < paramKeys.length; ++i) {
      //reportParams.push(paramKeys[i]);
      //reportParams.push(this.state.paramValues[paramKeys[i]]);
      reportParams =
        reportParams +
        paramKeys[i] +
        "," +
        this.state.paramValues[paramKeys[i]] +
        ",";
    }
    modreportScheduleDetails.ParamData = reportParams;
    return modreportScheduleDetails;
  }
  CreateReportSchedule(modreportScheduleDetails) {
    modreportScheduleDetails.ShareholderCode = this.props.selectedShareholder;
    var notification = {
      messageType: "critical",
      message: "ReportSchedule_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ReportSchedule_Title"],
          keyValues: [modreportScheduleDetails.ReportName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateReportSchedule,
      Utilities.getAuthenticationObjectforPost(
        modreportScheduleDetails,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getReportSchedule(false);
          ///call get
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
          console.log("Error in CreateReportSchedule:", result.ErrorList);
        }
        this.props.onSaved(modreportScheduleDetails, "add", notification);
      })
      .catch((error) => {
        console.log("Error while getting GetReportList:", error);
      });
  }

  UpdateReportSchedule(modreportScheduleDetails) {
    modreportScheduleDetails.ShareholderCode = this.props.selectedShareholder;
    var notification = {
      messageType: "critical",
      message: "ReportSchedule_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ReportSchedule_Title"],
          keyValues: [modreportScheduleDetails.ReportName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateReportSchedule,
      Utilities.getAuthenticationObjectforPost(
        modreportScheduleDetails,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getReportSchedule(false);
          ///call get
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
          });
          console.log("Error in CreateReportSchedule:", result.ErrorList);
        }
        this.props.onSaved(modreportScheduleDetails, "add", notification);
      })
      .catch((error) => {
        console.log("Error while getting CreateReportSchedule:", error);
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const reportScheduleDetails = lodash.cloneDeep(
        this.state.reportScheduleDetails
      );
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modreportScheduleDetails: { ...reportScheduleDetails },
        validationErrors,
        displayParameters: [],
        paramValues: {},
        savedparamValues: {},
        paramOptions: {},
        disabledParams: {},
      });
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  getReportNames(isNew) {
    let shareHolder = null;
    if (isNew === true) {
      shareHolder = this.props.selectedShareholder;
    }
    let reportNames = [];
    axios(
      RestAPIs.GetAllReportNames + "?ShareholderCode=" + shareHolder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          reportNames = result.EntityResult;
          this.setState({ reportNames: reportNames });
        } else {
          console.log("Error in GetAllReportNames:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting GetAllReportNames:", error);
      });
    //return reportNames;
  }
  getPrintersNames() {
    let printerList = [];
    try {
      axios(
        RestAPIs.GetPrinters,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        if (response.data.IsSuccess) {
          printerList = response.data.EntityResult;
          this.setState({ printerList: printerList });
        } else {
          console.log("Error:In getPrintersNames", response);
        }
      });
    } catch (error) {
      console.log(
        "ReportScheduleDetailsComposite:Error occured on getPrintersNames",
        error
      );
      //let printerList = ["printer1", "printer2"];
      //return printerList;
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const popUpContents = [];
    const listOptions = {
      printerList: this.state.printerList,
      reportNames: Utilities.transferDictionarytoOptions(
        this.state.reportNames
      ),
    };
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.reportScheduleDetails.ReportName}
            newEntityName="DriverInfo_NewReportSchedule"
          //popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <ReportScheduleDetails
            reportScheduleDetails={this.state.reportScheduleDetails}
            modreportScheduleDetails={this.state.modreportScheduleDetails}
            validationErrors={this.state.validationErrors}
            listOptions={listOptions}
            onReportNameChange={this.handleReportChange}
            onPrinterChange={this.handlePrinterChange}
            onCheckChange={this.handleCheckChange}
            onParamLoad={this.buildReportParams}
            showReportParams={this.state.showReportParams}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            isWebPortalUser={
              this.props.userDetails.EntityResult.IsWebPortalUser
            }
            paramValues={this.state.paramValues}
            savedparamValues={this.state.savedparamValues}
            parameterLoading={this.state.parameterLoading}
          ></ReportScheduleDetails>
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
              this.state.reportScheduleDetails.ReportName === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnReportConfiguration}
            handleOperation={this.AddUpdateReportConfig}
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

export default connect(mapStateToProps)(ReportScheduleDetailsComposite);

ReportScheduleDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
