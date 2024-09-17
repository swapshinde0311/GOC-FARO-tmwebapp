import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TankGroupDetails } from "../../UIBase/Details/TankGroupDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyTankGroup } from "../../../JS/DefaultEntities";
import { tankGroupValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import {
  functionGroups,
  fnTankGroup,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiTankGroupDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class TankGroupDetailsComposite extends Component {
  state = {
    tankGroup: lodash.cloneDeep(emptyTankGroup),
    modTankGroup: {},
    validationErrors: Utilities.getInitialValidationErrors(
      tankGroupValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    baseProductOptions: [],
    terminalOptions: [],
    tankGroupKPIList: [],
    showAuthenticationLayout: false,
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getTankGroup(this.props.selectedRow);
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getTerminal();
      } else {
        this.getBaseProducts("");
      }
    } catch (error) {
      console.log(
        "TankGroupDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.tankGroup.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getTankGroup(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "TankGroupDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getTankGroup(tankGroupRow) {
    if (tankGroupRow.Common_Code === undefined) {
      this.setState({
        tankGroup: lodash.cloneDeep(emptyTankGroup),
        modTankGroup: lodash.cloneDeep(emptyTankGroup),
        isReadyToRender: true,
        tankGroupKPIList: [],
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnTankGroup
        ),
      });
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.tankGroupCode,
        value: tankGroupRow.Common_Code,
      },
      {
        key: KeyCodes.terminalCode,
        value:
          tankGroupRow.TerminalCode !== "" ? tankGroupRow.TerminalCode : null,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.tankGroupCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetTankGroup,
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
              tankGroup: lodash.cloneDeep(result.EntityResult),
              modTankGroup: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnTankGroup
              ),
            },
            () => {
              this.getKPIList(result.EntityResult.Code);
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.getBaseProducts(result.EntityResult.TerminalCode);
              }
            }
          );
        } else {
          this.setState({
            tankGroup: lodash.cloneDeep(emptyTankGroup),
            modTankGroup: lodash.cloneDeep(emptyTankGroup),
            isReadyToRender: true,
          });
          console.log("Error in getTankGroup:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting TankGroup:", error, tankGroupRow);
      });
  }

  getBaseProducts(terminalcode) {
    axios(
      RestAPIs.GetAllBaseProduct + "?TerminalCode=" + terminalcode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let baseProductOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ baseProductOptions });
          }
        } else {
          console.log("Error in getBaseProducts:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting BaseProducts:", error);
      });
  }

  getTerminal() {
    axios(
      RestAPIs.GetTerminals,
      Utilities.getAuthenticationObjectforPost(
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let terminalOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ terminalOptions });
          }
        } else {
          console.log("Error in getTerminal:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Terminal:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modTankGroup = lodash.cloneDeep(this.state.modTankGroup);

      modTankGroup[propertyName] = data;
      this.setState({ modTankGroup });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (tankGroupValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          tankGroupValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "TankGroupDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleTerminalChange = (data) => {
    try {
      const modTankGroup = lodash.cloneDeep(this.state.modTankGroup);
      const validationErrors = { ...this.state.validationErrors };
      modTankGroup["TerminalCode"] = data;
      validationErrors["TerminalCode"] = "";
      this.setState({ modTankGroup, validationErrors });
      this.getBaseProducts(data);
    } catch (error) {
      console.log(
        "TankGroupDetailsComposite:Error occured on handleTerminalChange",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modTankGroup = lodash.cloneDeep(this.state.modTankGroup);
      modTankGroup.Active = value;
      if (modTankGroup.Active !== this.state.tankGroup.Active)
        modTankGroup.Remarks = "";
      this.setState({ modTankGroup });
    } catch (error) {
      console.log(error);
    }
  };

  handleSelectTankCode = (value) => {
    try {
      let modTankGroup = lodash.cloneDeep(this.state.modTankGroup);
      let notification = {
        messageType: "critical",
        message: "TankGroupInfo_TankActivateSuccess",
        messageResultDetails: [
          {
            keyFields: ["TankGroupInfo_Code"],
            keyValues: [modTankGroup.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      var keyCode = [
        {
          key: KeyCodes.tankGroupCode,
          value: modTankGroup.Code,
        },
        {
          key: KeyCodes.tankCode,
          value: value,
        },
        {
          key: KeyCodes.terminalCode,
          value:
            modTankGroup.TerminalCode !== "" ? modTankGroup.TerminalCode : null,
        },
      ];
      var obj = {
        keyDataCode: KeyCodes.tankGroupCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.ActivateTank,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getTankGroup({
            Common_Code: modTankGroup.Code,
            TerminalCode: modTankGroup.TerminalCode,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleSave = () => {
    try {
      let modTankGroup = lodash.cloneDeep(this.state.modTankGroup);
      if (this.validateSave(modTankGroup)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout }, () => {
          if (showAuthenticationLayout === false) {
            this.saveTankGroup();
          }
        });
       
      }
    } catch (error) {
      console.log(
        "TankGroupDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  saveTankGroup = () => {
    this.setState({ saveEnabled: false });
    let modTankGroup = lodash.cloneDeep(this.state.modTankGroup);
    this.state.tankGroup.Code === ""
      ? this.createTankGroup(modTankGroup)
      : this.updateTankGroup(modTankGroup);
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  validateSave(modTankGroup) {
    const validationErrors = { ...this.state.validationErrors };

    Object.keys(tankGroupValidationDef).forEach(function (key) {
      if (modTankGroup[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          tankGroupValidationDef[key],
          modTankGroup[key]
        );
    });

    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      if (
        modTankGroup.TerminalCode === null ||
        modTankGroup.TerminalCode === ""
      ) {
        validationErrors["TerminalCode"] = "TankGroupInfo_TerminalRequired";
      } else {
        validationErrors["TerminalCode"] = "";
      }
    }

    this.setState({ validationErrors });

    var returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    return returnValue;
  }

  createTankGroup(modTankGroup) {
    let keyCode = [
      {
        key: KeyCodes.tankGroupCode,
        value: modTankGroup.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.tankGroupCode,
      KeyCodes: keyCode,
      Entity: modTankGroup,
    };

    let notification = {
      messageType: "critical",
      message: "TankGroupInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["TankGroupInfo_Code"],
          keyValues: [modTankGroup.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateTankGroup,
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
                fnTankGroup
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getTankGroup({
                Common_Code: modTankGroup.Code,
                TerminalCode: modTankGroup.TerminalCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnTankGroup
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createTankGroup:", result.ErrorList);
        }
        this.props.onSaved(this.state.modTankGroup, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTankGroup
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTankGroup, "add", notification);
      });
  }

  updateTankGroup(modTankGroup) {
    let keyCode = [
      {
        key: KeyCodes.tankGroupCode,
        value: modTankGroup.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.tankGroupCode,
      KeyCodes: keyCode,
      Entity: modTankGroup,
    };

    let notification = {
      messageType: "critical",
      message: "TankGroupInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["TankGroupInfo_Code"],
          keyValues: [modTankGroup.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateTankGroup,
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
                fnTankGroup
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getTankGroup({
                Common_Code: modTankGroup.Code,
                TerminalCode: modTankGroup.TerminalCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTankGroup
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in updateTankGroup:", result.ErrorList);
        }
        this.props.onSaved(this.state.modTankGroup, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnTankGroup
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTankGroup, "modify", notification);
      });
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const tankGroup = lodash.cloneDeep(this.state.tankGroup);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modTankGroup: { ...tankGroup },
        selectedCompRow: [],
        validationErrors,
      });
    } catch (error) {
      console.log(
        "TankGroupDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  //Get KPI for Tank Group
  getKPIList(tankGroupCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiTankGroupDetail,
        InputParameters: [{ key: "TankGroupCode", value: tankGroupCode }],
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
              tankGroupKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ tankGroupKPIList: [] });
            console.log("Error in tank group KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting tank group KPIList:", error);
        });
    }
  }
  render() {
    const listOptions = {
      baseProduct: this.state.baseProductOptions,
      terminalCode: this.state.terminalOptions,
    };
    const popUpContents = [
      {
        fieldName: "BaseProductInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modTankGroup.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modTankGroup.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "BaseProductInfo_Created",
        fieldValue:
          new Date(this.state.modTankGroup.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modTankGroup.CreatedTime).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.tankGroup.Code}
            newEntityName="TankGroupInfo_NewTankGroup"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.tankGroupKPIList}>
          {" "}
        </TMDetailsKPILayout>
        <ErrorBoundary>
          <TankGroupDetails
            tankGroup={this.state.tankGroup}
            modTankGroup={this.state.modTankGroup}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            listOptions={listOptions}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            handleSelectTankCode={this.handleSelectTankCode}
            onTerminalChange={this.handleTerminalChange}
          ></TankGroupDetails>
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
              this.state.tankGroup.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnTankGroup}
            handleOperation={this.saveTankGroup}
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

export default connect(mapStateToProps)(TankGroupDetailsComposite);

TankGroupDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  terminalCodes: PropTypes.array.isRequired,
};
