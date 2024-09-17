import React, { Component } from "react";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { RoleDetails } from "../../UIBase/Details/RoleDetails";
import { emptyRole } from "../../../JS/DefaultEntities";
import lodash from "lodash";
import { roleValidationDef } from "../../../JS/ValidationDef";
import { functionGroups, fnRoleAdmin } from "../../../JS/FunctionGroups";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Button } from "@scuf/common";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RoleDetailsComposite extends Component {
  state = {
    role: lodash.cloneDeep(emptyRole),
    modRole: {},
    isReadyToRender: false,
    validationErrors: Utilities.getInitialValidationErrors(roleValidationDef),
    saveEnabled: false,
    roleOptions: [],
    menuItems: [],
    modMenuItems: [],
    functionGroupItems: [],
    modFunctionGroupItems: [],
    copyPermissionFromRole: "",
    isConfirmToSave: false,
    allMenuItems: [],
    showAuthenticationLayout: false,
    tempRole: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getSecurityRoles();
      this.getRole(this.props.selectedRow);
    } catch (error) {
      console.log(
        "RoleDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.role.RoleName !== "" &&
        nextProps.selectedRow.RoleAdmin_RoleName === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getRole(nextProps.selectedRow);
        this.getSecurityRoles();
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors, copyPermissionFromRole: "" });
      }
    } catch (error) {
      console.log(
        "RoleDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getRole(roleRow) {
    try {
      if (roleRow.RoleAdmin_RoleName === undefined) {
        axios(
          RestAPIs.GetSecurityRole + "?roleName=",
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let menuList = [];
            let functionGroupsList = [];
            if (result.EntityResult !== null) {
              if (
                result.EntityResult.MenuItems.length > 0 &&
                Array.isArray(result.EntityResult.MenuItems)
              )
                menuList = result.EntityResult.MenuItems.filter(
                  (item) => item.IsComponent === true
                );
              if (
                result.EntityResult.FunctionGroupItems.length > 0 &&
                Array.isArray(result.EntityResult.FunctionGroupItems)
              ) {
                result.EntityResult.FunctionGroupItems.forEach(
                  (functionGroup) => {
                    var existitem = functionGroupsList.find((item) => {
                      return (
                        item.FunctionGroupName ===
                        functionGroup.FunctionGroupName
                      );
                    });
                    if (existitem === undefined) {
                      let fgItem = {
                        FunctionGroupName: functionGroup.FunctionGroupName,
                        FunctionInfoList: functionGroup.FunctionInfoList,
                        MenuGroup: [functionGroup.MenuGroup],
                      };
                      functionGroupsList.push(fgItem);
                    } else {
                      existitem.MenuGroup.push(functionGroup.MenuGroup);
                    }
                  }
                );
              }
            }
            this.setState({
              allMenuItems: result.EntityResult.MenuItems,
              menuItems: menuList,
              modMenuItems: menuList,
              isReadyToRender: true,
              role: lodash.cloneDeep(emptyRole),
              modRole: lodash.cloneDeep(emptyRole),
              functionGroupItems: functionGroupsList,
              modFunctionGroupItems: functionGroupsList,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnRoleAdmin
              ),
            });
          } else {
            this.setState({
              role: lodash.cloneDeep(emptyRole),
              modRole: lodash.cloneDeep(emptyRole),
              isReadyToRender: true,
            });
          }
        });
        return;
      }
      axios(
        RestAPIs.GetSecurityRole + "?roleName=" + roleRow.RoleAdmin_RoleName,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let menuList = [];
          let functionGroupsList = [];
          if (result.EntityResult !== null) {
            if (
              result.EntityResult.MenuItems.length > 0 &&
              Array.isArray(result.EntityResult.MenuItems)
            )
              menuList = result.EntityResult.MenuItems.filter(
                (item) => item.IsComponent === true
              );
            if (
              result.EntityResult.FunctionGroupItems.length > 0 &&
              Array.isArray(result.EntityResult.FunctionGroupItems)
            ) {
              result.EntityResult.FunctionGroupItems.forEach(
                (functionGroup) => {
                  var existitem = functionGroupsList.find((item) => {
                    return (
                      item.FunctionGroupName === functionGroup.FunctionGroupName
                    );
                  });
                  if (existitem === undefined) {
                    let fgItem = {
                      FunctionGroupName: functionGroup.FunctionGroupName,
                      FunctionInfoList: functionGroup.FunctionInfoList,
                      MenuGroup: [functionGroup.MenuGroup],
                    };
                    functionGroupsList.push(fgItem);
                  } else {
                    existitem.MenuGroup.push(functionGroup.MenuGroup);
                  }
                }
              );
            }
          }
          this.setState(
            {
              isReadyToRender: true,
              role: lodash.cloneDeep(result.EntityResult),
              modRole: lodash.cloneDeep(result.EntityResult),
              allMenuItems: result.EntityResult.MenuItems,
              menuItems: menuList,
              modMenuItems: menuList,
              functionGroupItems: functionGroupsList,
              modFunctionGroupItems: functionGroupsList,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnRoleAdmin
              ),
            },
            () => {
              this.updateCopyPermissionRole(result.EntityResult.RoleName);
            }
          );
        } else {
          this.setState({
            role: lodash.cloneDeep(emptyRole),
            modRole: lodash.cloneDeep(emptyRole),
            menuItems: [],
            modMenuItems: [],
            isReadyToRender: true,
          });
        }
      });
    } catch (error) {
      console.log("RoleDetailsComposite:Error occured on getRole", error);
    }
  }

  updateCopyPermissionRole = (roleName) => {
    try {
      const roleOptions = lodash.cloneDeep(this.state.roleOptions);
      let roles = roleOptions.filter((item) => item.text !== roleName);
      this.setState({ roleOptions: roles });
    } catch (error) {
      console.log(
        "RoleDetailsComposite:Error occured on updateCopyPermissionRole",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    try {
      const modRole = lodash.cloneDeep(this.state.modRole);
      modRole[propertyName] = data;
      this.setState({ modRole });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (roleValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          roleValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log("RoleDetailsComposite:Error occured on handleChange", error);
    }
  };

  handleCopyPermission = (data) => {
    this.setState({ copyPermissionFromRole: data });
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const role = lodash.cloneDeep(this.state.role);
      const menuItems = lodash.cloneDeep(this.state.menuItems);
      const functionGroupItems = lodash.cloneDeep(
        this.state.functionGroupItems
      );
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });

      this.setState({
        modRole: { ...role },
        validationErrors,
        modMenuItems: menuItems,
        modFunctionGroupItems: functionGroupItems,
        copyPermissionFromRole: "",
      });
    } catch (error) {
      console.log("RoleDetailsComposite:Error occured on handleReset", error);
    }
  };

  getSecurityRoles() {
    axios(
      RestAPIs.GetSecurityRoles,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let roleOptions = [];
            roleOptions = Utilities.transferListtoOptions(result.EntityResult);
            this.setState({ roleOptions });
          }
        } else {
          console.log("Error in getSecurityRoles:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getSecurityRoles:", error);
      });
  }

  handleCopyRoleAccess = () => {
    let copyPermissionFromRole = lodash.cloneDeep(
      this.state.copyPermissionFromRole
    );
    if (copyPermissionFromRole !== "" || copyPermissionFromRole !== null) {
      axios(
        RestAPIs.GetSecurityRole + "?roleName=" + copyPermissionFromRole,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let menuList = [];
          let functionGroupsList = [];
          if (result.EntityResult !== null) {
            if (
              result.EntityResult.MenuItems.length > 0 &&
              Array.isArray(result.EntityResult.MenuItems)
            )
              menuList = result.EntityResult.MenuItems.filter(
                (item) => item.IsComponent === true
              );
            if (
              result.EntityResult.FunctionGroupItems.length > 0 &&
              Array.isArray(result.EntityResult.FunctionGroupItems)
            ) {
              result.EntityResult.FunctionGroupItems.forEach(
                (functionGroup) => {
                  var existitem = functionGroupsList.find((item) => {
                    return (
                      item.FunctionGroupName === functionGroup.FunctionGroupName
                    );
                  });
                  if (existitem === undefined) {
                    let fgItem = {
                      FunctionGroupName: functionGroup.FunctionGroupName,
                      FunctionInfoList: functionGroup.FunctionInfoList,
                      MenuGroup: [functionGroup.MenuGroup],
                    };
                    functionGroupsList.push(fgItem);
                  } else {
                    existitem.MenuGroup.push(functionGroup.MenuGroup);
                  }
                }
              );
            }
          }
          this.setState({
            allMenuItems: result.EntityResult.MenuItems,
            modMenuItems: menuList,
            modFunctionGroupItems: functionGroupsList,
          });
        }
      });
    }
  };

  confirmToSave = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isConfirmToSave} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("Role_ConfirmToSave")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isConfirmToSave: false }, () => {
                    this.handleSave();
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isConfirmToSave: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  handleSave = () => {
    try {
      let modRole = this.fillDetails();
      if (this.validateSave(modRole)) {
        let tempRole = lodash.cloneDeep(modRole);
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout, tempRole }, () => {
          if (showAuthenticationLayout === false) {
            this.saveRole();
          }
          })
      ;
        
      }
    } catch (error) {
      console.log("RoleDetailsComposite:Error occured on handleSave", error);
    }
  };

  saveRole = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempRole = lodash.cloneDeep(this.state.tempRole);
      this.state.role.RoleName === ""
        ? this.createRole(tempRole)
        : this.updateRole(tempRole);
    } catch (error) {
      console.log("RoleDetailsComposite:Error occured on saveRole", error);
    }
  };

  handleSaveModal = () => {
    this.setState({ isConfirmToSave: true });
  };

  fillDetails() {
    try {
      let modRole = lodash.cloneDeep(this.state.modRole);
      let modMenuItems = lodash.cloneDeep(this.state.modMenuItems);
      let allMenuItems = lodash.cloneDeep(this.state.allMenuItems);
      let modFunctionGroupItems = lodash.cloneDeep(
        this.state.modFunctionGroupItems
      );
      let menuList = [];
      let functionGroupList = [];
      modMenuItems.forEach((item) => {
        let menu = {
          MenuCode: item.MenuCode,
          Visible: item.Visible,
        };
        menuList.push(menu);
      });
      allMenuItems
        .filter((item) => item.IsComponent === false)
        .forEach((item) => {
          let menu = {
            MenuCode: item.MenuCode,
            Visible: 1,
          };
          menuList.push(menu);
        });
      modFunctionGroupItems.forEach((item) => {
        let selectedData = item.FunctionInfoList.filter(
          (functionGroupItem) =>
            functionGroupItem.FunctionProperties.FunctionEnabled === true
        );
        let functionGroup = {
          FunctionGroupName: item.FunctionGroupName,
          FunctionInfoList: selectedData,
        };
        functionGroupList.push(functionGroup);
      });
      modRole.MenuItems = menuList;
      modRole.FunctionGroupItems = functionGroupList;
      this.setState({ modRole });
      return modRole;
    } catch (error) {
      console.log("RoleDetailsComposite:Error occured on fillDetailss", error);
    }
  }

  validateSave(modRole) {
    try {
      const validationErrors = { ...this.state.validationErrors };
      Object.keys(roleValidationDef).forEach(function (key) {
        if (modRole[key] !== undefined)
          validationErrors[key] = Utilities.validateField(
            roleValidationDef[key],
            modRole[key]
          );
      });
      this.setState({ validationErrors });

      let returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
      return returnValue;
    } catch (error) {
      console.log("RoleDetailsComposite:Error occured on validateSave", error);
    }
  }

  createRole(modRole) {
    let obj = {
      Entity: modRole,
    };
    let notification = {
      messageType: "critical",
      message: "RoleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RoleAdmin_RoleName"],
          keyValues: [modRole.RoleName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateSecurityRole,
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
                fnRoleAdmin
              ),
              showAuthenticationLayout: false,
            },
            () => this.getRole({ RoleAdmin_RoleName: modRole.RoleName })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnRoleAdmin
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createRole:", result.ErrorList);
        }
        this.props.onSaved(this.state.modRole, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRoleAdmin
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modRole, "add", notification);
      });
  }

  updateRole(modRole) {
    let obj = {
      Entity: modRole,
    };
    let notification = {
      messageType: "critical",
      message: "RoleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RoleAdmin_RoleName"],
          keyValues: [modRole.RoleName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateSecurityRole,
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
                fnRoleAdmin
              ),
              showAuthenticationLayout: false,
            },
            () => this.getRole({ RoleAdmin_RoleName: modRole.RoleName })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnRoleAdmin
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in updateRole:", result.ErrorList);
        }
        this.props.onSaved(this.state.modRole, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnRoleAdmin
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modRole, "update", notification);
      });
  }

  handleVisibilityChange = (newValue, data) => {
    try {
      let modMenuItems = lodash.cloneDeep(this.state.modMenuItems);
      let menuItems = lodash.cloneDeep(this.state.menuItems);
      let role = lodash.cloneDeep(this.state.role);
      let matchedData = modMenuItems.filter(
        (item) => item.MenuCode === data.rowData.MenuCode
      );
      if (matchedData.length > 0) {
        matchedData[0].Visible = newValue;
        if (role.RoleName !== "") {
          let matchedOldData = menuItems.filter(
            (item) => item.MenuCode === data.rowData.MenuCode
          );
          if (matchedData[0].Visible !== matchedOldData[0].Visible)
            matchedData[0].IsModified = true;
          else matchedData[0].IsModified = false;
        }
      }
      this.setState({ modMenuItems });
    } catch (error) {
      console.log(
        "RoleDetailsComposite:Error occured on handleVisibilityChange",
        error
      );
    }
  };

  handleFunctionGroupChange = (
    functionGroupName,
    type,
    data,
    operationType
  ) => {
    try {
      let modFunctionGroupItems = lodash.cloneDeep(
        this.state.modFunctionGroupItems
      );
      let functionGroupItems = lodash.cloneDeep(this.state.functionGroupItems);
      let role = lodash.cloneDeep(this.state.role);

      let matchedData = modFunctionGroupItems.filter(
        (item) => item.FunctionGroupName === functionGroupName
      );
      if (matchedData.length > 0) {
        let functionInfo = matchedData[0].FunctionInfoList.filter(
          (item) => item.FunctionName === type
        );

        if (functionInfo.length > 0) {
          if (operationType === "Password") {
            functionInfo[0].PasswordEnabled = data;
            if (role.RoleName !== "") {
              let mactchedOldGroupItems = functionGroupItems.filter(
                (item) => item.FunctionGroupName === functionGroupName
              );
              let matchedOldFunctionInfo =
                mactchedOldGroupItems[0].FunctionInfoList.filter(
                  (item) => item.FunctionName === type
                );
              if (
                functionInfo[0].PasswordEnabled !==
                matchedOldFunctionInfo[0].PasswordEnabled
              )
                functionInfo[0].IsPasswordModified = true;
              else functionInfo[0].IsPasswordModified = false;
            }
          } else {
            functionInfo[0].FunctionProperties.FunctionEnabled = data;
            if (role.RoleName !== "") {
              let mactchedOldGroupItems = functionGroupItems.filter(
                (item) => item.FunctionGroupName === functionGroupName
              );
              let matchedOldFunctionInfo =
                mactchedOldGroupItems[0].FunctionInfoList.filter(
                  (item) => item.FunctionName === type
                );
              if (
                functionInfo[0].FunctionProperties.FunctionEnabled !==
                matchedOldFunctionInfo[0].FunctionProperties.FunctionEnabled
              )
                functionInfo[0].FunctionProperties.IsModified = true;
              else functionInfo[0].FunctionProperties.IsModified = false;
            }
          }
          this.setState({ modFunctionGroupItems });
        }
      }
    } catch (error) {
      console.log(
        "RoleDetailsComposite:Error occured on handleFunctionGroupChange",
        error
      );
    }
  };

  render() {
    const popUpContents = [
      {
        fieldName: "BaseProductInfo_LastUpdated",
        fieldValue:
          new Date(this.state.modRole.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modRole.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "BaseProductInfo_Created",
        fieldValue:
          new Date(this.state.modRole.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modRole.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.role.RoleName}
            newEntityName="RoleAdmin_NewRole"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <RoleDetails
            role={this.state.role}
            modRole={this.state.modRole}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            onVisibilityChange={this.handleVisibilityChange}
            roleOptions={this.state.roleOptions}
            handleCopyRoleAccess={this.handleCopyRoleAccess}
            modMenuItems={this.state.modMenuItems}
            modFunctionGroupItems={this.state.modFunctionGroupItems}
            copyPermissionFromRole={this.state.copyPermissionFromRole}
            onCopyPermissionChange={this.handleCopyPermission}
            onFunctionGroupChange={this.handleFunctionGroupChange}
          ></RoleDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSaveModal}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.isConfirmToSave ? this.confirmToSave() : null}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.role.RoleName === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnRoleAdmin}
            handleOperation={this.saveRole}
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

export default connect(mapStateToProps)(RoleDetailsComposite);

RoleDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
