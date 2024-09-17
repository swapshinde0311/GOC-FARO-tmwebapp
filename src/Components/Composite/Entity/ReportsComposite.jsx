import React, { Component } from "react";
import {
  Breadcrumb,
  Button,
  Table,
  Select,
  DatePicker,
  Input,
} from "@scuf/common";
import * as Constants from "../../../JS/Constants";
import { TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import * as RestAPIs from "../../../JS/RestApis";
import axios from "axios";
import NotifyEvent from "../../../JS/NotifyEvent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import * as Utilities from "../../../JS/Utilities";
import lodash from "lodash";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { Loader } from "@scuf/common";
import "bootstrap/dist/css/bootstrap-grid.css";
import moment from "moment";

class ReportsComposite extends Component {
  state = {
    showReport: false,
    reportList: [],
    showReportParams: false,
    parameters: [],
    paramValues: {},
    paramOptions: {},
    disabledParams: {},
    listLoading: true,
    parameterLoading: false,
  };

  componentDidMount() {
    axios(
      RestAPIs.GetReportList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        if (response.data.IsSuccess) {
          let reportList = response.data.EntityResult.ReportListCategories;
          axios(
            RestAPIs.GetReportServiceURI,
            Utilities.getAuthenticationObjectforGet(
              this.props.tokenDetails.tokenInfo
            )
          )
            .then((response) => {
              if (response.data.IsSuccess) {
                this.reportServiceURI = response.data.EntityResult;
                this.setState({ reportList: reportList, listLoading: false });
              } else {
                console.log(
                  "Error in fetching ReportServiceURI: ",
                  response.data.ErrorList
                );
              }
            })
            .catch((error) => {
              console.log("Error in fetching ReportServiceURI: ", error);
            });
        } else {
          console.log(
            "Error in fetching ReportList: ",
            response.data.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error in fetching ReportList: ", error);
      });
  }

  validateParams = (paramValues) => {
    let cloneValidationErrors = { ...this.state.validationErrors };

    let validationDef = this.validationDef;

    Object.keys(validationDef).forEach(function (key) {
      if (paramValues[key] !== undefined)
        cloneValidationErrors[key] = Utilities.validateField(
          validationDef[key],
          paramValues[key]
        );
    });
    this.setState({ validationErrors: cloneValidationErrors });
    let returnValue = Object.values(cloneValidationErrors).every(function (
      value
    ) {
      return value === "";
    });

    return returnValue;
  };
  handleShowReportClick = () => {
    try {
      let returnValue = Object.values(this.state.validationErrors).every(
        function (value) {
          return value === "";
        }
      );
      if (returnValue) {
        if (this.validateParams(this.state.paramValues)) {
          this.setState({ showReport: true });
        }
      }
    } catch (error) {
      console.log(
        "ReportsComposite: Error occured onhandleShowReportClick",
        error
      );
    }
  };

  buildBreadcrumb = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Breadcrumb>
            {this.props.activeItem.parents.map((parentitem) => {
              return (
                <Breadcrumb.Item key={parentitem.itemCode}>
                  {t(parentitem.localizedKey)}
                </Breadcrumb.Item>
              );
            })}
            <Breadcrumb.Item key={this.props.activeItem.itemCode}>
              {t(this.props.activeItem.localizedKey)}
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
      </TranslationConsumer>
    );
  };

  handleReportClick = (report) => {
    this.setState({ parameterLoading: true });
    axios(
      RestAPIs.GetReportParams + "?ReportName=" + report,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        //console.log(response);
        if (response.data.IsSuccess) {
          let params = response.data.EntityResult.Parameters;
          this.paramTables = response.data.EntityResult.ReportsData;
          let cloneParamOptions = lodash.cloneDeep(this.state.paramOptions);
          let cloneDisabledParams = lodash.cloneDeep(this.state.disabledParams);
          let cloneParamValues = {
            Culture: this.props.userDetails.EntityResult.UICulture,
          };
          this.validationDef = {};
          this.reportName = response.data.EntityResult.ReportName;
          if (
            response.data.EntityResult.UserName !== undefined &&
            response.data.EntityResult.UserName !== "" &&
            response.data.EntityResult.UserName !== null
          ) {
            cloneParamValues["UserName"] = response.data.EntityResult.UserName;
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
                params[i].DependentControls.length === 0
              ) {
                let tableName = params[i].TableName;
                let fieldName = params[i].FieldName;
                let list = this.paramTables[tableName];
                let optionsSet = new Set(list.map((row) => row[fieldName]));
                optionsSet = [...optionsSet];
                let optionsValues = Utilities.transferListtoOptions(optionsSet);
                cloneParamValues[params[i].ParamName] = null;
                if (!params[i].IsOnlyForEnterprise && !params[i].Required) {
                  optionsValues.unshift({ text: "All", value: 0 });
                  cloneParamValues[params[i].ParamName] = 0;
                }
                cloneParamOptions[params[i].ParamName] = optionsValues;
                cloneDisabledParams[params[i].ParamName] = false;
              } else {
                if (!params[i].IsOnlyForEnterprise && !params[i].Required) {
                  let optionsValues = [{ text: "All", value: 0 }];
                  cloneParamOptions[params[i].ParamName] = optionsValues;
                  cloneDisabledParams[params[i].ParamName] = true;
                  cloneParamValues[params[i].ParamName] = 0;
                }
                else if (params[i].Required) {
                  let optionsValues = [{ text: "Select", value: "" }];
                  cloneParamOptions[params[i].ParamName] = optionsValues;
                  cloneDisabledParams[params[i].ParamName] = true;
                  cloneParamValues[params[i].ParamName] = "";
                }
                else {
                  cloneParamValues[params[i].ParamName] = 0;
                }
              }
            } else if (
              params[i].ControlType === "DateTime" ||
              params[i].ControlType === "Date"
            ) {
              //this.validationDef[params[i].ParamName] = [];
              if (params[i].Required === true) {
                let def = [
                  { minLength: 1, errorCode: "Select_Date" },
                  { isDate: true, errorCode: "Valid_Date" },
                ];

                this.validationDef[params[i].ParamName] = def;
              }
              if (!this.props.userDetails.EntityResult.IsWebPortalUser) {
                cloneParamValues[params[i].ParamName] = new Date();
              } else {
                // UTC offset difference between enNode and Web Portal
                // Note: offSet from API will be positive for timezones ahead of UTC and negative for timezones behind UTC
                // Note: offSet from JS will be negative for timezones ahead of UTC and positive for timezones behind UTC
                let enNodeOffset =
                  this.props.userDetails.EntityResult.TimeZoneOffset +
                  new Date().getTimezoneOffset();

                cloneParamValues[params[i].ParamName] = moment(new Date())
                  .add(enNodeOffset, "m")
                  .toDate();
              }
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

          this.setState({
            parameters: [...response.data.EntityResult.Parameters],
            paramOptions: cloneParamOptions,
            disabledParams: cloneDisabledParams,
            paramValues: cloneParamValues,
            showReportParams: true,
            validationErrors: Utilities.getInitialValidationErrors(
              this.validationDef
            ),
            parameterLoading: false,
          });
        } else {
          console.log("Get Report Params error:", response.data.ErrorList);
          this.setState({ parameterLoading: false, showReportParams: false });
        }

        // console.log(this.state);

        // console.log(response);
      })
      .catch((err) => {
        console.log("Error occured on handleReportClick", err);
        this.setState({ parameterLoading: false, showReportParams: false });
      });
  };

  handleBack = () => {
    this.setState({ showReport: false });
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
        //console.log("paramtable", paramTable);
        //console.log("depenedentControls", dependentControls);
        for (let j = 0; j < dependentControls.length; ++j) {
          let dependantParam = this.state.parameters.find(
            ({ ParamName }) => ParamName === dependentControls[j]
          );

          if (cloneParamValues[dependentControls[j]] !== 0) {
            paramTable = paramTable.filter(
              (obj) => obj[dependantParam.FieldName] ===
                cloneParamValues[dependentControls[j]]
            );
          }
        }

        let optionsSet = new Set(
          paramTable.map((row) => row[refreshParameter.FieldName])
        );
        // console.log("optionset", optionsSet);
        optionsSet = [...optionsSet];

        let optionsValues = Utilities.transferListtoOptions(optionsSet);
        if (!refreshParameter.Required && !refreshParameter.IsOnlyForEnterprise) {
          optionsValues.unshift({ text: "All", value: 0 });
        }
        else if (refreshParameter.Required) {
          optionsValues.unshift({ text: "Select", value: "" });
          cloneParamValues[refreshParameter.ParamName] = "";
        }
        else {
          cloneParamValues[refreshParameter.ParamName] = 0;
        }
        cloneParamOptions[refreshParameter.ParamName] = optionsValues;
      }
    }

    this.setState({
      paramValues: cloneParamValues,
      disabledParams: cloneDisabledParams,
      paramOptions: cloneParamOptions,
      validationErrors: cloneValidationErrors,
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
  buildReportParams = () => {
    return this.state.parameters.map((parameter) => {
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
                    this.state.paramValues[parameter.ParamName] === undefined
                      ? ""
                      : this.state.paramValues[parameter.ParamName]
                  }
                  disabled={this.state.disabledParams[parameter.ParamName]}
                  options={
                    this.state.paramOptions[parameter.ParamName] === undefined
                      ? []
                      : this.state.paramOptions[parameter.ParamName]
                  }
                  onChange={(data) => this.onDropDownChange(data, parameter)}
                  error={t(this.state.validationErrors[parameter.ParamName])}
                  reserveSpace={false}
                />
              )}
            </TranslationConsumer>
          </div>
        );
      } else if (parameter.ControlType === "DateTime") {
        return (
          <div className="col-12 col-md-6 col-lg-4">
            <TranslationConsumer>
              {(t) => (
                <DatePicker
                  fluid
                  //value={modCarrier.PermitExpiryDate.toISOString()}
                  value={
                    this.state.paramValues[parameter.ParamName] === null
                      ? ""
                      : new Date(this.state.paramValues[parameter.ParamName])
                  }
                  type="datetime"
                  displayFormat={getCurrentDateFormat()}
                  label={t(parameter.LocalisedParamName)}
                  showYearSelector="true"
                  //disablePast={true}
                  indicator={parameter.Required ? "required" : ""}
                  onChange={(data) =>
                    this.onFieldChange(parameter.ParamName, data)
                  }
                  onTextChange={(value, error) => {
                    this.onDateTextChange(parameter.ParamName, value, error);
                  }}
                  error={t(this.state.validationErrors[parameter.ParamName])}
                  reserveSpace={false}
                />
              )}
            </TranslationConsumer>
          </div>
        );
      } else if (parameter.ControlType === "Text") {
        return (
          <div className="col-12 col-md-6 col-lg-4">
            <TranslationConsumer>
              {(t) => (
                <Input
                  fluid
                  value={
                    this.state.paramValues[parameter.ParamName] === null
                      ? ""
                      : this.state.paramValues[parameter.ParamName]
                  }
                  onChange={(data) =>
                    this.onFieldChange(parameter.ParamName, data)
                  }
                  indicator={parameter.Required ? "required" : ""}
                  label={t(parameter.LocalisedParamName)}
                  error={t(this.state.validationErrors[parameter.ParamName])}
                  reserveSpace={false}
                />
              )}
            </TranslationConsumer>
          </div>
        );
      } else if (parameter.ControlType === "Date") {
        return (
          <div className="col-12 col-md-6 col-lg-4">
            <TranslationConsumer>
              {(t) => (
                <DatePicker
                  fluid
                  //value={modCarrier.PermitExpiryDate.toISOString()}
                  value={
                    this.state.paramValues[parameter.ParamName] === null
                      ? ""
                      : new Date(this.state.paramValues[parameter.ParamName])
                  }
                  // type="datetime"
                  displayFormat={getCurrentDateFormat()}
                  label={t(parameter.LocalisedParamName)}
                  showYearSelector="true"
                  //disablePast={true}
                  indicator={parameter.Required ? "required" : ""}
                  onChange={(data) =>
                    this.onFieldChange(parameter.ParamName, data.toISOString())
                  }
                  onTextChange={(value, error) => {
                    this.onDateTextChange(parameter.ParamName, value, error);
                  }}
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

  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/" + this.reportName;
    } else {
      path = "TM/" + Constants.TMReports + "/" + this.reportName;
    }

    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleBack}
        handleModalClose={this.handleBack}
        // proxyServerHost="http://epksr5115dit:3625/TMWebAPI/"
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={this.getChangedReportParameters()}
      />
    );
  }

  getChangedReportParameters = () => {
    let modParamValues = lodash.cloneDeep(this.state.paramValues);
    try {
      Object.keys(modParamValues).forEach((paramKey) => {
        if (modParamValues[paramKey] instanceof Date) {
          if (!this.props.userDetails.EntityResult.IsWebPortalUser) {
            modParamValues[paramKey] = modParamValues[paramKey]
              .toISOString()
              .replace("Z", "");
          } else {
            // UTC offset difference between enNode and Web Portal
            // Note: offSet from API will be positive for timezones ahead of UTC and negative for timezones behind UTC
            // Note: offSet from JS will be negative for timezones ahead of UTC and positive for timezones behind UTC
            let enNodeOffset =
              this.props.userDetails.EntityResult.TimeZoneOffset +
              new Date().getTimezoneOffset();

            // subtract EN Node offset from UTC time.
            modParamValues[paramKey] = moment(
              moment(modParamValues[paramKey]).utc().format()
            )
              .subtract(enNodeOffset, "m")
              .toISOString()
              .replace("Z", "");
          }
        }
      });
    } catch (error) {
      console.log("error while getChangedReportParameters", error);
    }

    return modParamValues;
  };

  handleReportPrintClick = () => {
    try {
      let returnValue = Object.values(this.state.validationErrors).every(
        function (value) {
          return value === "";
        }
      );
      if (returnValue) {
        if (this.validateParams(this.state.paramValues)) {
          let paramKeys = Object.keys(this.state.paramValues);
          let reportParams = [];
          for (let i = 0; i < paramKeys.length; ++i) {
            reportParams.push(paramKeys[i]);
            reportParams.push(this.state.paramValues[paramKeys[i]]);
          }
          let obj = {
            Entity: {
              ReportName: this.reportName,
              ReportParams: reportParams,
            },
          };
          let notification = {
            messageType: "critical",
            message: "ReportPrintStatus",
            messageResultDetails: [
              {
                keyFields: [],
                keyValues: [],
                isSuccess: false,
                errorMessage: "",
              },
            ],
          };

          axios(
            RestAPIs.ReportPrint,
            Utilities.getAuthenticationObjectforPost(
              obj,
              this.props.tokenDetails.tokenInfo
            )
          ).then((response) => {
            notification.messageType = response.data.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess =
              response.data.IsSuccess;
            if (response.data.IsSuccess) {
            } else {
              notification.messageResultDetails[0].errorMessage =
                response.data.ErrorList[0];
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
          });
        }
      }
    } catch (error) {
      console.log(
        "ReportsComposite: Error occured onhandleReportPrintClick",
        error
      );
    }
  };
  render() {
    return (
      <div>
        {" "}
        <TranslationConsumer>
          {(t) => (
            <div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-7">
                  <ErrorBoundary> {this.buildBreadcrumb()}</ErrorBoundary>
                </div>
              </div>
              {this.state.parameterLoading ? (
                <div className={`authLoading parameterLoader`}>
                  <Loader
                    text=" "
                    className={`globalLoaderPositionPosition`}
                  ></Loader>
                </div>
              ) : (
                ""
              )}

              {this.state.listLoading ? (
                <LoadingPage message="Loading"></LoadingPage>
              ) : (
                <>
                  <div className="detailsContainer">
                    <div className="row  reportTable">
                      {this.state.reportList.map((reportCategoryList) => {
                        if (reportCategoryList.ReportListItems.Table.length > 0)
                          return (
                            <div className="col-12 col-md-6 col-lg-4 fixed-top">
                              <Table>
                                <Table.Header>
                                  <Table.HeaderCell
                                    content={t(
                                      reportCategoryList.ReportCategory
                                    )}
                                  />
                                </Table.Header>
                                <Table.Body>
                                  {reportCategoryList.ReportListItems.Table.map(
                                    (reportItem) => {
                                      return (
                                        <Table.Row>
                                          <Table.Cell
                                            onClick={() =>
                                              this.handleReportClick(
                                                reportItem.ReportName
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                              fontWeight:
                                                this.reportName ===
                                                  reportItem.ReportName
                                                  ? "bold"
                                                  : "normal",
                                              borderLeft:
                                                this.reportName ===
                                                  reportItem.ReportName
                                                  ? "5px solid #1274B7"
                                                  : "",
                                            }}
                                          >
                                            {t(reportItem.ReportName)}
                                          </Table.Cell>
                                        </Table.Row>
                                      );
                                    }
                                  )}
                                </Table.Body>
                              </Table>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                  {this.state.showReportParams ? (
                    <div className="detailsContainer">
                      <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                          <h5> {t(this.reportName)}</h5>
                        </div>
                      </div>
                      <div className="row">{this.buildReportParams()}</div>
                      {this.renderModal()}
                      <div
                        className="row"
                        style={{
                          // display: "flex",
                          justifyContent: "center",
                          // flexWrap: "wrap",
                        }}
                      >
                        {!this.props.userDetails.EntityResult
                          .IsWebPortalUser ? (
                          <div className="col-12 col-md-6 col-lg-3">
                            <Button
                              onClick={this.handleReportPrintClick}
                              content={t("EOD_Print")}
                            ></Button>
                          </div>
                        ) : null}
                        <div className="col-12 col-md-6 col-lg-3">
                          <Button
                            onClick={this.handleShowReportClick}
                            content={t("Report_Show")}
                          ></Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          )}
        </TranslationConsumer>
        <ErrorBoundary>
          <ToastContainer
            hideProgressBar={true}
            closeOnClick={false}
            closeButton={true}
            newestOnTop={true}
            position="bottom-right"
            toastClassName="toast-notification-wrap"
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(ReportsComposite);
