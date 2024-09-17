import React, { Component } from "react";
import { emptyGantry } from "../../../JS/DefaultEntities";
import { SiteDetailsUserActions } from "../../UIBase/Common/SiteDetailsUserActions";
import axios from "axios";
import { connect } from "react-redux";
import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import GantryDetails from "../../UIBase/Details/GantryDetails";
import { gantryValidationDef } from "../../../JS/ValidationDef";
import { fnSiteView, fnRailSiteView, functionGroups } from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class GantryDetailsComposite extends Component {
  state = {
    gantry: {},
    modGantry: {},
    saveEnabled: false,
    isDeleteEnabled: false,
    selectedLocationType: "",
    isReadyToRender: false,
    validationErrors: Utilities.getInitialValidationErrors(gantryValidationDef),
    showDeleteAuthenticationLayout: false,
    showSaveAuthenticationLayout: false,
    tempGantry: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getGantry(this.props);
    } catch (error) {
      console.log(
        "GantryDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        nextProps.Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getGantry(nextProps);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "GantryDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  getGantry(propsResult) {
    try {
      let locationCode = propsResult.selectedlocation;
      let terminalCode = propsResult.selectedTerminal;
      if (propsResult.locationtype === "SPUR") {
        this.setState({
          selectedLocationType: Constants.siteViewLocationType.SPUR,
        });
        emptyGantry.LocationType = Constants.siteViewLocationType.SPUR;
      } else {
        this.setState({
          selectedLocationType: Constants.siteViewLocationType.GANTRY,
        });
        emptyGantry.LocationType = Constants.siteViewLocationType.GANTRY;
      }

      emptyGantry.ParentCode = propsResult.selectedTerminal;
      if (propsResult.isClone === true) {
        this.setState({
          gantry: lodash.cloneDeep(emptyGantry),
          modGantry: lodash.cloneDeep(emptyGantry),
          selectedLocationType: emptyGantry.LocationType,
          isReadyToRender: true,
          isDeleteEnabled: false,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
          ),
        });
        return;
      }
      if (locationCode === undefined || locationCode === "") {
        this.setState({
          gantry: lodash.cloneDeep(emptyGantry),
          modGantry: lodash.cloneDeep(emptyGantry),
          selectedLocationType: emptyGantry.LocationType,
          isReadyToRender: true,
          isDeleteEnabled: false,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
          ),
        });
        return;
      }
      var keyCode = [
        {
          key: KeyCodes.terminalCode,
          value: terminalCode,
        },
        {
          key: KeyCodes.entityCode,
          value: locationCode,
        },
        {
          key: KeyCodes.entityType,
          value: emptyGantry.LocationType,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetEntityDetails,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            gantry: lodash.cloneDeep(result.EntityResult),
            modGantry: lodash.cloneDeep(result.EntityResult),
            selectedLocationType: lodash.cloneDeep(
              result.EntityResult.EntityTypeCode
            ),
            isReadyToRender: true,
            isDeleteEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
          });
        } else {
          this.setState({
            gantry: lodash.cloneDeep(emptyGantry),
            modGantry: lodash.cloneDeep(emptyGantry),
            isReadyToRender: true,
            isDeleteEnabled: false,
          });
          console.log(
            "GantryDetailsComposite:Error in GetGantry",
            result.ErrorList
          );
        }
      });
    } catch (error) {
      console.log("GantryDetailsComposite:Error while getting gantry:", error);
    }
  }

  
  saveGantry = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempGantry = lodash.cloneDeep(this.state.tempGantry);
     
      this.state.gantry.Code === ""
        ? this.createGantry(tempGantry)
        : this.updateGantry(tempGantry);
    } catch (error) {
      console.log("GantryComposite : Error in saveGantry");
    }
  };

  handleSave = () => {
    try {
      //this.setState({ saveEnabled: false });
      let modGantry = this.fillDetails();
      if (this.validateSave(modGantry)) {
        
        let showSaveAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempGantry = lodash.cloneDeep(modGantry);
        this.setState({ showSaveAuthenticationLayout, tempGantry }, () => {
          if (showSaveAuthenticationLayout === false) {
            this.saveGantry();
          }
      });
        
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("GantryDetailsComposite:Error occured on handleSave", error);
    }
  };

  fillDetails() {
    try {
      let modGantry = lodash.cloneDeep(this.state.modGantry);
      modGantry.EntityTypeCode = this.state.selectedLocationType;
      modGantry.ParentCode = this.props.selectedTerminal;
      modGantry.TerminalCode = this.props.selectedTerminal;
      return modGantry;
    } catch (err) {
      console.log("GantryDetailsComposite:Error occured on filldetails", err);
    }
  }

  validateSave(modGantry) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(gantryValidationDef).forEach(function (key) {
      if (modGantry[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          gantryValidationDef[key],
          modGantry[key]
        );
    });
    if (modGantry.Active !== this.state.gantry.Active) {
      if (modGantry.EntityRemarks === null || modGantry.EntityRemarks === "") {
        validationErrors["EntityRemarks"] = "OriginTerminal_RemarksRequired";
      }
    }
    let notification = {
      messageType: "critical",
      message: [this.state.selectedLocationType + "SavedSuccess"],
      messageResultDetails: [],
    };
    this.setState({ validationErrors });
    var returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modGantry, "update", notification);
      return false;
    }
    return returnValue;
  }

  handleActiveStatusChange = (value) => {
    try {
      let modGantry = lodash.cloneDeep(this.state.modGantry);
      modGantry.Active = value;
      if (modGantry.Active !== this.state.gantry.Active)
        modGantry.EntityRemarks = "";
      this.setState({ modGantry });
    } catch (error) {
      console.log(
        "GantryDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    try {
      let modGantry = lodash.cloneDeep(this.state.modGantry);
      modGantry[propertyName] = data;
      const validationErrors = { ...this.state.validationErrors };
      if (modGantry.Active === this.state.gantry.Active) {
        if (
          this.state.gantry.EntityRemarks === modGantry.EntityRemarks ||
          modGantry.EntityRemarks === ""
        ) {
          validationErrors.EntityRemarks = "";
        }
        if (modGantry.EntityRemarks === "")
          modGantry.EntityRemarks = this.state.gantry.EntityRemarks;
      }
      if (propertyName === "Active") {
        if (modGantry.Active !== this.state.gantry.Active) {
          modGantry.EntityRemarks = "";
        }
      }
      if (gantryValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          gantryValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modGantry });
    } catch (error) {
      console.log(
        "GantryDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      var GantryCode = this.state.modGantry.Code;
      var keyData = {
        keyDataCode: 0,
        ShareHolderCode: "",
        KeyCodes: [
          {
            Key: KeyCodes.locationCode,
            Value: GantryCode,
          },
          {
            Key: KeyCodes.terminalCode,
            Value: this.props.selectedTerminal,
          },
        ],
      };

      if (this.state.selectedLocationType === "SPUR") {
        let notification = {
          messageType: "critical",
          message: [this.state.selectedLocationType + "DeletionStatus"],
          messageResultDetails: [
            {
              keyFields: [Constants.siteViewLocationType.SPUR + "Code"],
              keyValues: [GantryCode],
              isSuccess: false,
              errorMessage: "",
            },
          ],
        };
        axios(
          RestAPIs.DeleteIsland,
          Utilities.getAuthenticationObjectforPost(
            keyData,
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;

          if (result.IsSuccess === true) {
            this.setState({
              isDeleteEnabled: false,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.remove,
                Utilities.getSiteViewFunctionGroup(
                  this.props.transportationtype
                )
              ),
              showDeleteAuthenticationLayout: false,
            });
            this.getGantry({
              selectedlocation: this.state.modGantry.Code,
              selectedTerminal: this.props.selectedTerminal,
              isClone: true,
              locationtype: this.state.selectedLocationType,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              isDeleteEnabled: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.remove,
                Utilities.getSiteViewFunctionGroup(
                  this.props.transportationtype
                )
              ),
              showDeleteAuthenticationLayout: false,
            });
          }

          this.props.onDelete(this.state.modGantry, "delete", notification);
        });
      } else {
        let notification = {
          messageType: "critical",
          message: [this.state.selectedLocationType + "DeletionStatus"],
          messageResultDetails: [
            {
              keyFields: [Constants.siteViewLocationType.GANTRY + "Code"],
              keyValues: [GantryCode],
              isSuccess: false,
              errorMessage: "",
            },
          ],
        };
        axios(
          RestAPIs.DeleteGantry,
          Utilities.getAuthenticationObjectforPost(
            keyData,
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;

          if (result.IsSuccess === true) {
            this.setState({
              isDeleteEnabled: false,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.remove,
                Utilities.getSiteViewFunctionGroup(
                  this.props.transportationtype
                )
              ),
              showDeleteAuthenticationLayout: false,
            });
            this.getGantry({
              selectedlocation: this.state.modGantry.Code,
              selectedTerminal: this.props.selectedTerminal,
              isClone: true,
              locationtype: this.state.selectedLocationType,
            });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              isDeleteEnabled: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.remove,
                Utilities.getSiteViewFunctionGroup(
                  this.props.transportationtype
                )
              ),
              showDeleteAuthenticationLayout: false,
            });
          }

          this.props.onDelete(this.state.modGantry, "delete", notification);
        });
      }
    } catch (error) {
      console.log(
        "GantryDetailsComposite:Error occured on handleDelete",
        error
      );
    }
  };

  createGantry(modGantry) {
    try {
      let keyCode = [
        {
          key: KeyCodes.entityCode,
          value: modGantry.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
        Entity: modGantry,
      };
      let notification = {
        messageType: "critical",
        message: [this.state.selectedLocationType + "SavedSuccess"],
        messageResultDetails: [
          {
            keyFields: [this.state.selectedLocationType + "Code"],
            keyValues: [modGantry.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateEntity,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getGantry({
            selectedlocation: this.state.modGantry.Code,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
            locationtype: this.state.selectedLocationType,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modGantry, "add", notification);
      });
    } catch (error) {
      console.log(
        "GantryDetailsComposite:Error occured on createLocation",
        error
      );
    }
  }
  updateGantry(modGantry) {
    try {
      let keyCode = [
        {
          key: KeyCodes.entityCode,
          value: modGantry.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
        Entity: modGantry,
      };
      let notification = {
        messageType: "critical",
        message: [this.state.selectedLocationType + "SavedSuccess"],
        messageResultDetails: [
          {
            keyFields: [this.state.selectedLocationType + "Code"],
            keyValues: [modGantry.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateEntity,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getGantry({
            selectedlocation: this.state.modGantry.Code,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
            locationtype: this.state.selectedLocationType,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modGantry, "add", notification);
      });
    } catch (error) {
      console.log(
        "GantryDetailsComposite:Error occured on createLocation",
        error
      );
    }
  }

  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("GantryComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showSaveAuthenticationLayout: false,
      showDeleteAuthenticationLayout: false,
    });
  };
  
  handleOperation()  {
    return this.state.showDeleteAuthenticationLayout?this.handleDelete:this.saveGantry;
 };

 getFunctionGroupName() {
  if(this.state.selectedLocationType === Constants.siteViewLocationType.SPUR)
    return fnRailSiteView
  else  
    return fnSiteView

 };
 
 getFunctionName() {
  return this.state.showDeleteAuthenticationLayout? functionGroups.remove: 
        this.state.gantry.Code === ""
         ? functionGroups.add
         : functionGroups.modify
 };

  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(this.state.modGantry.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modGantry.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modGantry.LastActive !== undefined &&
          this.state.modGantry.LastActive !== null
            ? new Date(this.state.modGantry.LastActive).toLocaleDateString() +
              " " +
              new Date(this.state.modGantry.LastActive).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modGantry.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modGantry.CreatedTime).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.gantry.Code}
            newEntityName={"New" + this.state.selectedLocationType}
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <GantryDetails
            gantry={this.state.gantry}
            modGantry={this.state.modGantry}
            selectedLocationType={this.state.selectedLocationType}
            onActiveStatusChange={this.handleActiveStatusChange}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
          ></GantryDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <SiteDetailsUserActions
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            handleSave={this.handleSave}
            handleDelete={this.authenticateDelete}
            saveEnabled={this.state.saveEnabled}
            isDeleteEnabled={this.state.isDeleteEnabled}
          ></SiteDetailsUserActions>
        </ErrorBoundary>
        {this.state.showDeleteAuthenticationLayout || this.state.showSaveAuthenticationLayout ?  (
          <UserAuthenticationLayout
          Username={this.props.userDetails.EntityResult.UserName}
          functionName={this.getFunctionName()}
          functionGroup={this.getFunctionGroupName()}
          handleClose={this.handleAuthenticationClose}
          handleOperation={this.handleOperation()}
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

export default connect(mapStateToProps)(GantryDetailsComposite);
