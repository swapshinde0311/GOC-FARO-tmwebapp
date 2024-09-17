import React, { Component } from "react";
import { COAParameterDetails } from "../../UIBase/Details/COAParameterDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { coaparameterValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyCOAParameter } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCOAParameter } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import NotifyEvent from "../../../JS/NotifyEvent";
import { ToastContainer, toast } from "react-toastify";

class COAParameterDetailsComposite extends Component {
  state = {
    coaParameter: lodash.cloneDeep(emptyCOAParameter),
    modCOAParameter: {},
    validationErrors: Utilities.getInitialValidationErrors(
      coaparameterValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    showAuthenticationLayout: false,
    tempCOAParameter: {},
  };

  handleChange = (propertyName, data) => {
    try {
      const modCOAParameter = lodash.cloneDeep(this.state.modCOAParameter);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modCOAParameter[propertyName] = data;
      this.setState({ modCOAParameter });
      if (coaparameterValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          coaparameterValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "COAParameterDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.coaParameter.Name !== "" &&
        nextProps.selectedRow.Common_Name === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCOAParameter(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "COAParameterDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getCOAParameter(this.props.selectedRow);
    } catch (error) {
      console.log(
        "COAParameterDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getCOAParameter(selectedRow) {
    if (selectedRow.Common_Name === undefined) {
      this.setState(
        {
          coaParameter: lodash.cloneDeep(emptyCOAParameter),
          modCOAParameter: lodash.cloneDeep(emptyCOAParameter),
          //listOptions,
          isReadyToRender: true,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCOAParameter
          ),
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.coaParameterCode,
        value: selectedRow.Common_Name,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.coaParameterCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetCOAParameter,
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
              coaParameter: lodash.cloneDeep(result.EntityResult),
              modCOAParameter: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCOAParameter
              ),
            }
          );
        } else {
          this.setState({
            coaParameter: lodash.cloneDeep(emptyCOAParameter),
            modCOAParameter: lodash.cloneDeep(emptyCOAParameter),
            isReadyToRender: true,
          }, () => {
          });
          console.log("Error in getCOAParameter:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting coaParameter:", error, selectedRow);
      });
  }

  validateSave() {
    const { modCOAParameter } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(coaparameterValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        coaparameterValidationDef[key],
        modCOAParameter[key]
      );
    });
    if (modCOAParameter.IsActive !== this.state.coaParameter.IsActive) {
      if (modCOAParameter.Remarks === null || modCOAParameter.Remarks === "") {
        validationErrors["Remarks"] = "COA_RemarksRequired";
      }
    }

    this.setState({ validationErrors });
    var returnValue = true;

    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
    return returnValue;
  }
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  saveCOAParameter = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempCOAParameter = lodash.cloneDeep(this.state.tempCOAParameter);
      this.state.coaParameter.Name === ""
        ? this.createCOAParameter(tempCOAParameter)
        : this.updateCOAParameter(tempCOAParameter);
    } catch (error) {
      console.log("COAParameterDetailsComposite : Error in saveCOAParameter");
    }
  };
  handleSave = () => {
    try {
      let modCOAParameter = lodash.cloneDeep(this.state.modCOAParameter);
      if (this.validateSave()) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempCOAParameter = lodash.cloneDeep(modCOAParameter);
        this.setState({ showAuthenticationLayout, tempCOAParameter }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCOAParameter();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "COAParameterDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  createCOAParameter(modCOAParameter) {
    var keyCode = [
      {
        key: KeyCodes.coaParameterCode,
        value: "",
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.coaParameterCode,
      KeyCodes: keyCode,
      Entity: modCOAParameter,
    };
    var notification = {
      messageType: "critical",
      message: "COAParameterDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["COAParameter_Name"],
          keyValues: [modCOAParameter.Name],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateCOAParameter,
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
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCOAParameter
              ),
              showAuthenticationLayout: false,

            },
            () => this.getCOAParameter({ Common_Name: modCOAParameter.Name })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCOAParameter
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in createCOAParameter:", result.ErrorList);
        }
        this.props.onSaved(modCOAParameter, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCOAParameter
          ),
          showAuthenticationLayout: false,

        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCOAParameter, "add", notification);
      });
  }

  updateCOAParameter(modCOAParameter) {
    let keyCode = [
      {
        key: KeyCodes.coaParameterCode,
        value: modCOAParameter.Name,
      },
    ];

    let obj = {
      keyDataCode: KeyCodes.coaParameterCode,
      KeyCodes: keyCode,
      Entity: modCOAParameter,
    };

    let notification = {
      messageType: "critical",
      message: "COAParameterDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["COAParameter_Name"],
          keyValues: [modCOAParameter.Name],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateCOAParameter,
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
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnCOAParameter
              ),
              showAuthenticationLayout: false,

            },
            () => this.getCOAParameter({ Common_Name: modCOAParameter.Name })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCOAParameter
            ),
            showAuthenticationLayout: false,

          });
          console.log("Error in updateCOAParameter:", result.ErrorList);
        }
        this.props.onSaved(modCOAParameter, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCOAParameter, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnCOAParameter
          ),
          showAuthenticationLayout: false,

        });
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const coaParameter = lodash.cloneDeep(this.state.coaParameter);

      var modCOAParameter = lodash.cloneDeep(this.state.coaParameter);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modCOAParameter: { ...coaParameter },
          validationErrors,
        }
      );
    } catch (error) {
      console.log(
        "COAParameterDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modCOAParameter = lodash.cloneDeep(this.state.modCOAParameter);
      modCOAParameter.IsActive = value;
      if (modCOAParameter.IsActive !== this.state.coaParameter.IsActive)
      modCOAParameter.Remarks = "";
      this.setState({ modCOAParameter });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const popUpContents = [
      {
        fieldName: "COAParameter_LastUpDt",
        fieldValue:
          new Date(
            this.state.modCOAParameter.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modCOAParameter.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "COAParameter_LastUpdatedBy",
        fieldValue:this.state.modCOAParameter.LastUpdatedUser
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.coaParameter.Name}
            newEntityName="COAParameter_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>

        <ErrorBoundary>
          <COAParameterDetails
            coaParameter={this.state.coaParameter}
            modCOAParameter={this.state.modCOAParameter}
            genericProps={this.props.genericProps}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
          ></COAParameterDetails>
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
              this.state.coaParameter.Name === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnCOAParameter}
            handleOperation={this.saveCOAParameter}
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

export default connect(mapStateToProps)(COAParameterDetailsComposite);

COAParameterDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
