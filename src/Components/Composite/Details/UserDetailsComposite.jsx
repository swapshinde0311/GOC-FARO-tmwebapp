import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { UserDetails } from "../../UIBase/Details/UserDetails";
import { emptyUser } from "../../../JS/DefaultEntities";
import { userValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import { connect } from "react-redux";
import * as KeyCodes from "../../../JS/KeyCodes";
import PropTypes from "prop-types";
import lodash from "lodash";
import { functionGroups, fnUser } from "../../../JS/FunctionGroups";

class UserDetailsComposite extends Component {
  state = {
    user: lodash.cloneDeep(emptyUser),
    modUser: {},
    validationErrors: Utilities.getInitialValidationErrors(userValidationDef),
    isReadyToRender: false,
    saveEnabled: false,
    attributeValidationErrors: [],
    languageOptions: [],
    domainNameOptions: [],
    isDisableGroupANDMakeRoleMandatory: false,
    roleOptions: [],
    shareholderOptions: [],
    secondaryShareholderOptions: [],
    inheritedRolesOptions: [],
    inheritedRoles: []
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLanguages();
      this.getDomainNames();
      this.getLookUpData();
      this.getSecurityRoles();
      this.getShareholdersList();
      this.getUser(this.props.selectedRow);
    } catch (error) {
      console.log("UserDetailsComposite:Error occured on componentDidMount", error);
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.user.FirstName !== "" &&
        nextProps.selectedRow.PersonId === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getUser(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "UserDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getUser(userRow) {
    emptyUser.Culture = this.props.userDetails.EntityResult.UICulture;
    emptyUser.DomainName = "0";
    if (userRow.PersonId === undefined) {
      this.setState({
        user: lodash.cloneDeep(emptyUser),
        modUser: lodash.cloneDeep(emptyUser),
        isReadyToRender: true,
        selectedAttributeList: [],
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnUser
        ),
      })
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.personID,
        value: userRow.PersonId,
      }
    ];
    var obj = {
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetSecurityUser,
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
              user: lodash.cloneDeep(result.EntityResult),
              modUser: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnUser
              )
            }, () => {
              this.removeSecondaryShareholderItem(result.EntityResult.PrimaryShareholder);
              this.getInheritedRoles(userRow.PersonId);
              this.populateNewDomainName();
            });
        } else {
          this.setState({
            user: lodash.cloneDeep(emptyUser),
            modUser: lodash.cloneDeep(emptyUser),
            isReadyToRender: true,
          });
          console.log("Error in getUser:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting User:", error, userRow);
      });
  }

  populateNewDomainName() {
    try {
      const modUser = lodash.cloneDeep(this.state.modUser);
      modUser.NewDomainName = modUser.DomainName;
      if (modUser.NewDomainName === "0")
        modUser.NewDomainName = "Select";
      modUser.DomainName = "1";
      this.setState({ modUser });
    } catch (error) {
      console.log("Error while populateNewDomainName", error);
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

  getDomainNames() {
    axios(
      RestAPIs.GetDomainNames,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        let domainNameOptions = [];
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null && Array.isArray(result.EntityResult)) {
            domainNameOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            domainNameOptions.unshift(
              {
                text: "Select",
                value: "0",
              }, {
              text: "New Domain?",
              value: "1",
            })
            this.setState({ domainNameOptions });
          }
          else {
            domainNameOptions.push(
              {
                text: "Select",
                value: "0",
              }, {
              text: "New Domain?",
              value: "1",
            })
            this.setState({ domainNameOptions });
          }
        }
        else {
          domainNameOptions.push(
            {
              text: "Select",
              value: "0",
            }, {
            text: "New Domain?",
            value: "1",
          })
          this.setState({ domainNameOptions });
        }
      })
      .catch((error) => {
        console.log("Error while getting DomainNames:", error);
      });
  }

  getLookUpData() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Security",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isDisableGroupANDMakeRoleMandatory:
              result.EntityResult["DisableGroupANDMakeRoleMandatory"] === "False" ? false : true,
          });
        }
      });
    } catch (error) {
      console.log("UserDetailsComposite:Error occured on getLookUpData", error);
    }
  }

  getSecurityRoles() {
    axios(
      RestAPIs.GetSecurityRoles,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null && Array.isArray(result.EntityResult)) {
            let roleOptions = [];
            roleOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
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

  getShareholdersList() {
    axios(
      RestAPIs.GetShareholdersList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let shareholderOptions = [];
            let secondaryShareholderOptions = [];
            Object.keys(result.EntityResult).forEach((element) => {
              shareholderOptions.push({ text: result.EntityResult[element], value: element });
            });
            Object.keys(result.EntityResult).forEach((element) => {
              secondaryShareholderOptions.push({ text: result.EntityResult[element], value: element });
            });
            this.setState({ shareholderOptions, secondaryShareholderOptions });
          }
        } else {
          console.log("Error in getShareholdersList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getShareholdersList:", error);
      });
  }

  getInheritedRoles(PersonId) {
    axios(
      RestAPIs.GetInheritedRoles + "?personID=" + PersonId,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null && Array.isArray(result.EntityResult)) {
            let inheritedRolesOptions = [];
            inheritedRolesOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ inheritedRolesOptions, inheritedRoles: result.EntityResult });
          }
        } else {
          console.log("Error in getInheritedRoles:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getInheritedRoles:", error);
      });
  }


  handleChange = (propertyName, data) => {
    try {
      const modUser = lodash.cloneDeep(this.state.modUser);

      modUser[propertyName] = data;

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (userValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          userValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      this.setState({ modUser }, () => {
        if (propertyName === "PrimaryShareholder") {
          this.removeSecondaryShareholderItem(data);
        }
      });
    } catch (error) {
      console.log(
        "UserDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };


  removeSecondaryShareholderItem(shareholderId) {
    try {
      let shareholderOptions = lodash.cloneDeep(this.state.shareholderOptions);
      const modUser = lodash.cloneDeep(this.state.modUser);
      if (modUser.SecondaryShareholders !== null && Array.isArray(modUser.SecondaryShareholders)) {
        modUser.SecondaryShareholders = modUser.SecondaryShareholders.filter(function (shareholder) {
          return shareholder !== shareholderId
        });
      }
      this.setState({
        secondaryShareholderOptions: shareholderOptions.filter(function (shareholder) {
          return shareholder.value !== shareholderId
        }), modUser
      });
    } catch (error) {
      console.log("removeSecondaryShareholderItem:Error occured on handleChange", error);
    }
  }

  handleActiveStatusChange = (value) => {
    try {
      let modUser = lodash.cloneDeep(this.state.modUser);
      modUser.Status = value;
      if (modUser.Status !== this.state.user.Status)
        modUser.Remarks = "";
      this.setState({ modUser });
    } catch (error) {
      console.log("UserDetailsComposite:Error occured on handleActiveStatusChange", error);
    }
  };

  handleSave = () => {
    try {
      this.setState({ saveEnabled: false });
      let modUser = this.fillDetails();
      if (this.validateSave(modUser)) {
        this.state.user.FirstName === ""
          ? this.createUser(modUser)
          : this.updateUser(modUser);
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("UserDetailsComposite:Error occured on handleSave", error);
    }
  }

  fillDetails() {
    try {
      let modUser = lodash.cloneDeep(this.state.modUser);

      if (modUser.DomainName === "1") {
        modUser.DomainName = modUser.NewDomainName;
      }
      if (modUser.DomainName === "Select" || modUser.DomainName === undefined || modUser.DomainName === "")
        modUser.DomainName = 0;

      return modUser;
    } catch (error) {
      console.log("UserDetailsComposite:Error occured on fillDetails", error);
    }
  }

  validateSave(modUser) {
    try {
      const validationErrors = { ...this.state.validationErrors };
      Object.keys(userValidationDef).forEach(function (key) {
        if (modUser[key] !== undefined)
          validationErrors[key] = Utilities.validateField(
            userValidationDef[key],
            modUser[key]
          );
      });

      if (modUser.Status !== this.state.user.Status) {
        if (modUser.Remarks === null || modUser.Remarks === "") {
          validationErrors["Remarks"] = "BaseProductInfo_EnterRemarks";
        }
      }
      if (this.state.isDisableGroupANDMakeRoleMandatory) {
        if (modUser.RoleName === undefined || modUser.RoleName === null || modUser.RoleName.toString().trim() === "") {
          validationErrors["RoleName"] = "UserInfo_RoleRequired";
        }
      }

      if (modUser.RoleName.toLowerCase() === "bsiadmin") {
        if ((modUser.Email === "" || modUser.Email === null || modUser.Email === undefined) &&
          (modUser.ApplicationID === "" || modUser.ApplicationID === null || modUser.ApplicationID === undefined)) {
          validationErrors["Email"] = "ERRMSG_SECURITYUSER_EMAIL_APPLICATIONID_EMPTY";
          validationErrors["ApplicationID"] = "ERRMSG_SECURITYUSER_EMAIL_APPLICATIONID_EMPTY";
        }
      }

      this.setState({ validationErrors });
      var returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
      return returnValue;
    } catch (error) {
      console.log("UserDetailsComposite:Error occured on validateSave", error);
    }
  }

  createUser(modUser) {
    let obj = {
      Entity: modUser,
    };

    let notification = {
      messageType: "critical",
      message: "UserInfo_Savedstatus",
      messageResultDetails: [
        {
          keyFields: ["UserAdmin_FirstName"],
          keyValues: [modUser.FirstName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateSecurityUser,
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
                fnUser
              ),
            },
            () => this.getUser({ PersonId: result.EntityResult.PersonID })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnUser
            ),
          });
          console.log("Error in createUser:", result.ErrorList);
        }
        this.props.onSaved(result.EntityResult, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnUser
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modUser, "add", notification);
      });
  }

  updateUser(modUser) {
    let obj = {
      Entity: modUser,
    };

    let notification = {
      messageType: "critical",
      message: "UserInfo_Savedstatus",
      messageResultDetails: [
        {
          keyFields: ["UserAdmin_FirstName"],
          keyValues: [modUser.FirstName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateUser,
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
                fnUser
              ),
            },
            () => this.getUser({ PersonId: modUser.PersonID })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnUser
            ),
          });
          console.log("Error in updateUser:", result.ErrorList);
        }
        this.props.onSaved(this.state.modUser, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnUser
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modUser, "modify", notification);
      });
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const user = lodash.cloneDeep(this.state.user);


      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });

      this.setState(
        {
          modUser: { ...user },
          selectedCompRow: [],
          validationErrors,
        });
    } catch (error) {
      console.log("UserDetailsComposite:Error occured on handleReset", error);
    }
  };

  render() {
    const listOptions = {
      languageOptions: this.state.languageOptions,
      domainNameOptions: this.state.domainNameOptions,
      roleOptions: this.state.roleOptions,
      shareholderOptions: this.state.shareholderOptions,
      secondaryShareholderOptions: this.state.secondaryShareholderOptions,
      inheritedRolesOptions: this.state.inheritedRolesOptions,
      inheritedRoles: this.state.inheritedRoles
    };
    const popUpContents = [
      {
        fieldName: "PipeLineHeaderInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modUser.LastUpdated
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modUser.LastUpdated
          ).toLocaleTimeString(),
      },
      {
        fieldName: "PipeLineHeaderInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modUser.CreationTime).toLocaleDateString() +
          " " +
          new Date(this.state.modUser.CreationTime).toLocaleTimeString(),
      },
      {
        fieldName: "PipeLineHeaderInfo_LastActive",
        fieldValue: this.state.modUser.LastActive !== undefined &&
          this.state.modUser.LastActive !== null
          ?
          new Date(this.state.modUser.LastActive).toLocaleDateString() +
          " " +
          new Date(this.state.modUser.LastActive).toLocaleTimeString() : "",
      }
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.user.FirstName}
            newEntityName={"UserInfo_NewUser"}
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <UserDetails
            user={this.state.user}
            modUser={this.state.modUser}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            isDisableGroupANDMakeRoleMandatory={this.state.isDisableGroupANDMakeRoleMandatory}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}>
          </UserDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
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

export default connect(mapStateToProps)(UserDetailsComposite);

UserDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
