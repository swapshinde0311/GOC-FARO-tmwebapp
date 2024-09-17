import React, { Component } from "react";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Button, Select, Checkbox, Input, Icon } from "@scuf/common";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { userAuthenticationValidationDef } from "../../../JS/ValidationDef";
import axios from "axios";
import lodash from "lodash";
import cryptojs from "crypto-js";

class UserAuthenticationLayout extends Component {
  state = {
    isPasswordRequired: false,
    Password: "",
    validationErrors: Utilities.getInitialValidationErrors(
      userAuthenticationValidationDef
    ),
    authenticationResponse: "",
    btnAuthenticateEnabled: true,
  };

  componentDidMount() {
    try {
      this.IsPasswordRequired();
    } catch (error) {
      console.log(
        "BaseProductDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  IsPasswordRequired() {
    try {
      let isPasswordRequired = Utilities.isPasswordEnabled(
        this.props.userDetails.EntityResult.roleFunctionInfo,
        this.props.functionName,
        this.props.functionGroup
      );
      this.setState({ isPasswordRequired });

      if (isPasswordRequired === false) this.props.handleOperation();
    } catch (error) {
      console.log("Error in IsPasswordRequired method:", error);
    }
  }

  onFieldChange = (propertyName, data) => {
    this.setState({ Password: data });
    const validationErrors = lodash.cloneDeep(this.state.validationErrors);
    if (userAuthenticationValidationDef[propertyName] !== undefined) {
      validationErrors[propertyName] = Utilities.validateField(
        userAuthenticationValidationDef[propertyName],
        data
      );
      this.setState({ validationErrors, authenticationResponse: "" });
    }

  };

  validatePassword = (Password) => {
    this.setState({ btnAuthenticateEnabled: false });
    const validationErrors = { ...this.state.validationErrors };
    if (Password === null || Password === "") {
      validationErrors["Password"] = "UserValidationForm_ReqfldValPassword";
    }
    this.setState({ validationErrors });
    var returnValue = true;
    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });

    return returnValue;
  };

  // AuthenticateUser = () => {
  //     if (this.validatePassword(this.state.Password)) {
  //         this.props.parentCallBack();
  //     }
  // }
  onCloseClick = () => {
    this.setState(
      {
        isPasswordRequired: false,
        authenticationResponse: "",
        btnAuthenticateEnabled: true,
      },
      () => this.props.handleClose()
    );
  };

  // unescapeBase64Url = function (key) {
  //   return key.replace(/-/g, "+").replace(/_/g, "/");
  // };

  // escapeBase64Url = function (key) {
  //   return key.replace(/\+/g, "-").replace(/\//g, "_");
  // };

  AuthenticateUser = () => {
    if (this.validatePassword(this.state.Password)) {
      this.setState({ authenticationResponse: "" });
      // this.props.parentCallBack();
      try {
        var keySize = 256;
        var iterations = 100;
        //assign the entered password
        var msg = this.state.Password;
        //assign the username from GetLoggedInUserDetails
        var pass = this.props.Username;
        var salt = cryptojs.lib.WordArray.random(128 / 8);

        var key = cryptojs.PBKDF2(pass, salt, {
          keySize: keySize / 32,
          iterations: iterations,
        });

        var iv = cryptojs.lib.WordArray.random(128 / 8);

        var encrypted = cryptojs.AES.encrypt(msg, key, {
          iv: iv,
          padding: cryptojs.pad.Pkcs7,
          mode: cryptojs.mode.CBC,
        });
        var transitmessage =
          salt.toString() + iv.toString() + encrypted.toString();
        //console.log("EncryptedPWD", transitmessage);

        axios(
          RestAPIs.ValidateUserCredentials +
          "?encryptedPassword=" +
          encodeURIComponent(transitmessage),
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            var result = response.data;
            if (result.IsSuccess === true) {
              if (result.EntityResult.toLowerCase() === "true") {
                this.setState({ isPasswordRequired: false });
                this.props.handleOperation();
              } else {
                this.setState({
                  authenticationResponse: result.ErrorList[0],
                  btnAuthenticateEnabled: true,
                });
              }
            } else {
              this.setState({
                authenticationResponse: result.ErrorList[0],
                btnAuthenticateEnabled: true,
              });
            }
          })
          .catch((error) => {
            this.setState({
              authenticationResponse: error,
              btnAuthenticateEnabled: true,
            });
          });
      } catch (error) {
        this.setState({
          authenticationResponse: error,
          btnAuthenticateEnabled: true,
        });
      }
    } else {
      this.setState({ btnAuthenticateEnabled: true });
    }
  };
  render() {
    return (
      <div>
        {this.state.isPasswordRequired === true ? (
          <TranslationConsumer>
            {(t) => (
              <Modal open={true} size="mini">
                <Modal.Content>
                  <div className="row">
                    <div
                      className="col col-lg-8"
                      style={{ marginLeft: "10px" }}
                    >
                      <h4>{t("User_Authentication")}</h4>
                    </div>
                    <div
                      className="col-12 col-lg-3"
                      style={{ textAlign: "right" }}
                      onClick={this.onCloseClick}
                    >
                      <Icon root="common" name="close" />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div className="col col-lg-12">
                      <label>
                        <h5>
                          {t("UserValidation_Form_AccountName")}:
                          {this.props.Username}
                        </h5>
                      </label>
                    </div>
                    <div className="col col-lg-12">
                      <Input
                        fluid
                        type="password"
                        disablePasswordToggle={false}
                        value={this.state.Password}
                        indicator="required"
                        onChange={(data) =>
                          this.onFieldChange("Password", data)
                        }
                        label={t("AccessCardInfo_x_Pwd")}
                        error={t(this.state.validationErrors.Password)}
                        reserveSpace={false}
                      />
                    </div>
                  </div>
                </Modal.Content>
                <Modal.Footer>
                  <span className="ui error-message autherrormsg">
                    {t(this.state.authenticationResponse)}
                  </span>
                  <Button
                    type="primary"
                    disabled={!this.state.btnAuthenticateEnabled}
                    content={t("UserValidationForm_Authentication")}
                    onClick={this.AuthenticateUser}
                  />
                </Modal.Footer>
              </Modal>
            )}
          </TranslationConsumer>
        ) : null}
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

export default connect(mapStateToProps)(UserAuthenticationLayout);

UserAuthenticationLayout.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  terminalCodes: PropTypes.array.isRequired,
};
