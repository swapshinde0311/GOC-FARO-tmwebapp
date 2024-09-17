import React, { Component } from "react";
//import Root from "./Components/Root";
import { wizmoKey } from "./JS/Constants";
import * as RestAPIs from "./JS/RestApis";
import { getAuthenticationObjectforGet } from "./JS/Utilities";
import axios from "axios";
import Error from "./Components/Error"
import { connect } from "react-redux";
import * as getUserDetails from "./Redux/Actions/GetUserDetails";
import * as setTokenInfo from "./Redux/Actions/TokenInfo";
import { bindActionCreators } from "redux";
import {
  TranslationConsumer,
  LocalizationConfig,
  LocalizationProvider,
} from "@scuf/localization";
import { Modal, Button } from "@scuf/common";
import "./CSS/styles.css";
import { SignIn } from "./Signin";
import jwt_decode from "jwt-decode";
import crypto from "crypto";
import ErrorBoundary from "./Components/ErrorBoundary";
import LocalizationComponent from "./Components/LocalizationComponent";
import { LoadingPage } from "./Components/UIBase/Common/LoadingPage";
import * as wijmo from '@grapecity/wijmo'
const runtimeConfig = window["runConfig"];

const authroization_URL = runtimeConfig.authroization_URL;
const redirect_uri = runtimeConfig.redirect_uri;
const client_id = runtimeConfig.client_id;
const response_type = "code";
const response_mode = "query";
const scope = runtimeConfig.scope; //"openid";
const state = "12345";
const code_challenge_method = "S256";
const token_uri = runtimeConfig.token_uri;
//const graphEndPoint = runtimeConfig.validationEndPoint;
const logoutEndPoint = runtimeConfig.logoutEndPoint;
const refreshTokenTime = runtimeConfig.refreshTokenTime;
const warnSessionTimeout = runtimeConfig.warnSessionTimeout;
const sessionTimeout = runtimeConfig.sessionTimeout;
const authType = runtimeConfig.authType; //0:Windows, 1: OAuth


wijmo.setLicenseKey(wizmoKey);

class App extends Component {
  refreshTokenTimer = null;
  events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"];
  state = {
    modelOpen: false,
    error: null,
    AuthorizationMessage: "",
    accessToken: null,
    // idToken: null,
    refreshToken: null,
    accessCode: null,
    isWindowsAuthError: false,
    windowsAuthErrorMessage: null,
  };

  componentDidMount() {
    try {
      //OAUTH- redirect to sign in page
      if (authType === 1) {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let code = params.get("code");
        let error = params.get("error");
        console.log("error", error);
        this.setState({ accessCode: code, error: error });
        var accessToken = null;
        if (code !== null) {
          this.handleSignIn();
        } else if (error === null) {
          if (sessionStorage.getItem("AccessToken") !== null) {
            this.setState({ AuthorizationMessage: "Authorizing" });
            accessToken = sessionStorage.getItem("AccessToken");
            var refreshToken = sessionStorage.getItem("RefreshToken");
            //var idToken = sessionStorage.getItem("IDToken");
            this.validateToken(accessToken, refreshToken, false, false);
          }
        } else {
          sessionStorage.clear();
        }
      }
      //Windows authentication- No sign in required and directly load component
      else {
        this.windowsAuthSignIn();
      }
    } catch (error) {
      console.log(error);
    }
  }

  windowsAuthSignIn() {
    let accessToken = "dummy";
    this.setState({ accessToken });

    axios(
      RestAPIs.Getloggedinuserdetails + "1",
      getAuthenticationObjectforGet(accessToken)
    )
      .then((response) => {
        //console.log("userdetails", response);
        try {
          if (response.data.IsSuccess) {
            if (this.props.userDetails.EntityResult === undefined) {
              if (response.data.EntityResult.IsDemoLicenseExpired === true) {
                this.setState({
                  isWindowsAuthError: true,
                  windowsAuthErrorMessage: "license_Expired",
                });
                return;
              }

              this.props.userActions.getUserDetails(response.data);
            }

            for (var i in this.events) {
              // console.log("added event", this.events[i]);
              window.addEventListener(this.events[i], this.resetSessionTimeout);
            }
            this.setSessionTimeout();
          } else {
            ///Put Error component
            this.setState({
              isWindowsAuthError: true,
              windowsAuthErrorMessage: "invalid_User",
            });
            console.log(response);

          }
        }
        catch (error) {
          console.log(error);
          this.setState({
            isWindowsAuthError: true,
            windowsAuthErrorMessage: "authorization_error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isWindowsAuthError: true,
          windowsAuthErrorMessage: "authentication_error",
        });
        // window.location.href = redirect_uri + "?error=authorization_error";
      });
  }
  base64URLEncode(str) {
    return str
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }
  sha256(buffer) {
    return crypto.createHash("sha256").update(buffer).digest();
  }
  handleSignIn = () => {
    try {
      this.setState({ error: null });

      this.setState({ AuthorizationMessage: "Redirect_Microsoft" });

      if (sessionStorage.getItem("AccessToken") === null) {
        let search = window.location.search;
        let codeparams = new URLSearchParams(search);
        let _authcode = codeparams.get("code");
        //if (window.location.href.indexOf("?code=") === -1) {
        if (_authcode === null) {
          var codeVerifier = this.base64URLEncode(crypto.randomBytes(32));
          var codeChallenger = this.base64URLEncode(this.sha256(codeVerifier));
          sessionStorage.setItem("codeVerifier", codeVerifier);
          window.location.href = this._getAzureURL(codeChallenger);
        } else {
          if (
            _authcode !== -1 &&
            sessionStorage.getItem("codeVerifier") !== null
          ) {
            this.setState({ AuthorizationMessage: "Authorizing" });

            var params = new URLSearchParams();
            params.append("client_id", client_id);
            params.append("grant_type", "authorization_code");
            params.append("code", _authcode);
            // params.append("scope", "https://graph.microsoft.com/User.Read");
            // params.append("scope", "User.Read");
            params.append("scope", scope);
            params.append("redirect_uri", redirect_uri);
            params.append(
              "code_verifier",
              sessionStorage.getItem("codeVerifier")
            );
            sessionStorage.removeItem("codeVerifier");

            const requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: params,
            };
            fetch(token_uri, requestOptions)
              .then((response) => response.json())
              .then((data) => {
                if (data.error !== undefined) {
                  window.location.href =
                    redirect_uri +
                    "?error=" +
                    data.error +
                    "&error_description=" +
                    data.error_description;
                }

                let id_token = jwt_decode(data.id_token)

                // check if login_hint is returned
                if (id_token.login_hint) {
                  // store login_hint to automatically logout the user without prompting user for account selection
                  sessionStorage.setItem("logoutHint", id_token.login_hint);
                }

                //sessionStorage.setItem("AccessToken", data.access_token);
                //this.setState({ accessToken: data.access_token });
                //console.log("token acquired");
                this.validateToken(
                  data.access_token,
                  data.refresh_token,
                  true,
                  false
                );
                //window.location.href = "http://localhost:3000/";
              })
              .catch((error) => {
                console.log(error);
                window.location.href =
                  redirect_uri + "?error=authentication_error";
              });
          }
        }
      }
      //Below block is require if we use localStorage in that case we need refreshtoken not to be cleared from localstorage as long as accestoken available
      // else {
      //   console.log("state:", this.state);
      //   var accessToken = sessionStorage.getItem("AccessToken");
      //   var refreshToken = sessionStorage.getItem("RefreshToken");
      //   //this.setState({ accessToken: accessToken });
      //   this.validateToken(accessToken, refreshToken, true);
      //   // window.location.href = "http://localhost:3000/";
      // }
    } catch (error) {
      console.log(error);
      window.location.href = redirect_uri + "?error=Authentication_Error";
    }
  };
  refreshToken = () => {
    //debugger;
    var params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", this.state.refreshToken);
    //params.append("scope", "User.Read");
    params.append("scope", scope);
    params.append("redirect_uri", redirect_uri);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    };
    fetch(token_uri, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error !== undefined) {
          window.location.href =
            redirect_uri +
            "?error=" +
            data.error +
            "&error_description=" +
            data.error_description;
        } else {
          // console.log("refresh token ", data);
          console.log("refresh token acquired");
          this.validateToken(
            data.access_token,
            data.refresh_token,
            false,
            true
          );
        }
      })
      .catch((error) => {
        console.log(error);
        window.location.href = redirect_uri + "?error=authentication_error";
      });
    // console.log("refresh token hit");
    // refreshTokenTimer = setTimeout(
    //   () => this.refreshToken(),
    //   refreshTokenInterval
    // );
  };

  validatejwtToken(decodedToken) {
    //debugger;
    let errorCode = "";
    try {
      let currentDateTIme = new Date();
      let currentTime = currentDateTIme.getTime() / 1000;

      if (decodedToken.exp - currentTime <= 0) {
        errorCode = "invalid_authentication";
      }
      if (errorCode !== "") {
        window.location.href = redirect_uri + "?error=" + errorCode;
        return;
      }
      if (Array.isArray(decodedToken.amr)) {
        if (!decodedToken.amr.includes("mfa")) {
          errorCode = "mobile_not_verified";
          //window.location.href = redirect_uri + "?error=mobile_not_verified";
        }
      } else errorCode = "mobile_not_verified";

      if (errorCode !== "") {
        window.location.href = redirect_uri + "?error=" + errorCode;
        return;
      }
    } catch (error) {
      console.log(error);
      window.location.href = redirect_uri + "?error=invalid_token";
    }
  }

  validateToken(accessToken, refreshToken, urlSet, isRefreshing) {
    try {
      //debugger;
      //console.log(accessToken);
      var decodedToken = null;
      try {
        decodedToken = jwt_decode(accessToken);
        this.validatejwtToken(decodedToken);
      } catch (error) {
        console.log(error);
        window.location.href =
          redirect_uri + "?error=invalid_token&error_desc" + error;
      }
      // const requestOptions = {
      //   method: "GET",
      //   headers: {
      //     Authorization: "Bearer " + accessToken,
      //   },
      // };

      // console.log("decoded :", decodedToken);

      // fetch(graphEndPoint, requestOptions)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log(data);
      //     if (data.error !== undefined) {
      //       window.location.href = redirect_uri + "?error=" + data.error.code;
      //     }
      // window.location.href = "http://localhost:3000/?error=Test";
      axios(
        RestAPIs.Getloggedinuserdetails + (urlSet ? "1" : "0"),
        getAuthenticationObjectforGet(accessToken)
      )
        .then((response) => {
          //console.log("userdetails", response);
          if (response.data.IsSuccess) {
            if (this.props.userDetails.EntityResult === undefined) {
              if (response.data.EntityResult.IsDemoLicenseExpired === true) {
                window.location.href = redirect_uri + "?error=license_Expired";
                return;
              }
              // console.log("updated redux");
              if (!isRefreshing)
                this.props.userActions.getUserDetails(response.data);
            }

            sessionStorage.setItem("AccessToken", accessToken);
            sessionStorage.setItem("RefreshToken", refreshToken);
            //sessionStorage.setItem("IDToken", idToken);
            this.setState({
              accessToken: accessToken,
              refreshToken: refreshToken,
              //idToken: idToken,
            });
            this.props.setTokenAction.setTokenInfo({
              tokenInfo: accessToken,
              refreshTokenInfo: refreshToken,
              // idTokenInfo: idToken,
            });
            if (urlSet) {
              window.location.href = redirect_uri;
            }
            if (!isRefreshing) {
              //Setup session time out on first time
              for (var i in this.events) {
                // console.log("added event", this.events[i]);
                window.addEventListener(
                  this.events[i],
                  this.resetSessionTimeout
                );
              }
              this.setSessionTimeout();
            }
            /////////Refresh token timer setup/////////////////////////////////
            var currentDateTIme = new Date();
            var currentTime = currentDateTIme.getTime() / 1000;
            //console.log("currentTime", currentTime);
            var refreshTokenIntervalsec = decodedToken.exp - currentTime;
            console.log("refresh Interval in seconds", refreshTokenIntervalsec);
            if (refreshTokenIntervalsec <= refreshTokenTime) {
              this.refreshToken();
            } else {
              this.refreshTokenTimer = setTimeout(
                () => this.refreshToken(),
                // 60000
                parseInt((refreshTokenIntervalsec - refreshTokenTime) * 1000)
              );
            }
            /////////Refresh token timer setup/////////////////////////////////
            this.setState({ AuthorizationMessage: "" });
          } else {
            // if user is not mapped in TM, sign out the user from Microsoft automatically
            this.handleSignOut("invalid_user");
          }
        })
        .catch((error) => {
          console.log(error);
          window.location.href = redirect_uri + "?error=authorization_error";
        });
      //});
    } catch (error) {
      console.log(error);
      window.location.href =
        redirect_uri + "?error=invalid_token&error_desc" + error;
    }
  }

  resetSessionTimeout = () => {
    this.clearSessionTimeout();
    this.setSessionTimeout();
  };

  clearSessionTimeout() {
    // console.log("entered to clear session timeout");
    if (this.warnTimeout) clearTimeout(this.warnTimeout);

    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }

  setSessionTimeout() {
    // console.log("entered to set session timeout");

    this.warnTimeout = setTimeout(
      () => this.warn(),
      warnSessionTimeout * 60 * 1000
    );
    this.logoutTimeout = setTimeout(() => {
      this.setState({ modelOpen: false });
      this.handleSignOut();
    }, sessionTimeout * 60 * 1000);
  }
  warn = () => {
    // console.log("Warning");
    this.setState({ modelOpen: true });
    //alert("You will be logged out automatically in 1 minute.");
  };

  _getAzureURL(codeChallenger) {
    return (
      authroization_URL +
      "?" +
      "client_id=" +
      client_id +
      "&response_type=" +
      response_type +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri) +
      "&response_mode=" +
      response_mode +
      "&scope=" +
      encodeURIComponent(scope) +
      "&state=" +
      state +
      "&code_challenge=" +
      codeChallenger +
      "&code_challenge_method=" +
      code_challenge_method
      // +
      // "&nonce=" +
      // codeChallenger
    );
  }

  handleSignOut = (errorMsg = null) => {
    try {
      if (authType === 1) {
        if (this.refreshTokenTimer !== null) {
          clearTimeout(this.refreshTokenTimer);
        }
        let accessToken = this.state.accessToken;
        // fetch logoutHint to logout automatically without account selection window
        let logoutHint = sessionStorage.getItem("logoutHint");

        this.setState({
          accessToken: null,
          refreshToken: null,
          accessCode: null,
          AuthorizationMessage: "Sign_Out",
        });
        sessionStorage.clear();
        this.props.userActions.getUserDetails({});
        this.props.setTokenAction.setTokenInfo({
          tokenInfo: "",
          refreshTokenInfo: "",
        });

        this.clearSessionTimeout();

        axios(
          RestAPIs.Getloggedinuserdetails + "2",
          getAuthenticationObjectforGet(accessToken)
        )
          .then((response) => {
            console.log(
              "Signed Out from Terminal Manager. Signing out from Microsoft",
              response
            );
            window.location.href =
              logoutEndPoint +
              "?post_logout_redirect_uri=" +
              encodeURIComponent(redirect_uri + (errorMsg ? "?error=" + errorMsg : "")) +
              (logoutHint ? "&logout_hint=" + logoutHint : "");
          })
          .catch((error) => {
            console.log(
              "error occured during signout Terminal Manager. Signing out from Microsoft",
              error
            );
            window.location.href =
              logoutEndPoint +
              "?post_logout_redirect_uri=" +
              encodeURIComponent(redirect_uri + (errorMsg ? "?error=" + errorMsg : "")) +
              (logoutHint ? "&logout_hint=" + logoutHint : "");
          });
      } else {
        this.clearSessionTimeout();
        this.setState({
          isWindowsAuthError: true,
          windowsAuthErrorMessage: "SignOutFromPortal",
        });
        for (var i in this.events) {
          window.removeEventListener(this.events[i], this.resetSessionTimeout);
        }
      }
    } catch (error) {
      console.log("handleSignOut error", error);
    }
  };

  displayTMModalforSignOut() {
    //console.log("entered to display modal actions");
    //console.log("EntityResult in displayTMModalforSignOut :" + this.props.userDetails.EntityResult);
    if (this.props.userDetails.EntityResult !== undefined) {
      return (
        // <React.Suspense fallback={<LoadingPage message=""></LoadingPage>}>

        <LocalizationConfig
          languageCode={this.props.userDetails.EntityResult.UICulture.substring(
            0,
            2
          )}
        >
          <LocalizationProvider useXhr={true} fallbackLanguages={["en"]}>
            <TranslationConsumer>
              {(t) => (
                <Modal open={this.state.modelOpen} className="session-timeout-popup" size="mini">
                  <Modal.Content>
                    <div style={{ textAlign: "center" }}>
                      <b>{t("Session_ExpiryMessage")}</b>
                    </div>
                  </Modal.Content>
                  <Modal.Footer>
                    <div className="row p-0" style={{ width: "100%" }}>
                      <div className="col-6 col-md-12 col-lg-6 pl-0 px-md-3 pl-lg-0" style={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          type="primary"
                          content={t("Stay")}
                          onClick={() => {
                            this.resetSessionTimeout(false);
                            this.setState({ modelOpen: false });
                          }}
                        /></div>
                      <div className="col-6 col-md-12 col-lg-6 pl-0 px-md-3 pl-lg-0" style={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          type="secondary"
                          content={t("SignOut")}
                          onClick={() => {
                            this.setState({ modelOpen: false });
                            this.handleSignOut();
                          }}
                        /></div></div>
                  </Modal.Footer>
                </Modal>
              )}
            </TranslationConsumer>
          </LocalizationProvider>
        </LocalizationConfig>
        // </React.Suspense>
      );
    } else {
      return "";
    }
  }

  render() {
    return (
      <div>
        {this.state.accessToken === null ? (
          <ErrorBoundary>
            <SignIn
              // accessCode={this.state.accessCode}
              // accessToken={this.state.accessToken}
              error={this.state.error}
              AuthorizationMessage={this.state.AuthorizationMessage}
              onSignIn={this.handleSignIn}
            ></SignIn>
          </ErrorBoundary>
        ) : (
          <div>
            {this.props.userDetails.EntityResult !== undefined ? (
              <React.Suspense fallback={<LoadingPage message=""></LoadingPage>}>
                <ErrorBoundary>
                  <LocalizationComponent
                    onSignout={(obj) => this.handleSignOut()}
                    isWindowsAuthError={this.state.isWindowsAuthError}
                    windowsAuthErrorMessage={this.state.windowsAuthErrorMessage}
                  ></LocalizationComponent>
                </ErrorBoundary>
                <ErrorBoundary>{this.displayTMModalforSignOut()}</ErrorBoundary>
              </React.Suspense>
            ) : (

              <div>{this.state.isWindowsAuthError ? <Error
                errorMessage={this.state.windowsAuthErrorMessage}
              ></Error> : ""}</div>
            )}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  //debugger;
  return {
    userDetails: state.getUserDetails.userDetails,
    //tokenInfo: state.getUserDetails.TokenAuth,
  };
};

const mapDispatchToProps = (dispatch) => {
  //debugger;
  //console.log(state.userDetailsReducer);
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
    setTokenAction: bindActionCreators(setTokenInfo, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
