import React, { Component } from "react";
import { configureLocalization, TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "./ErrorBoundary";
import { connect } from "react-redux";
import Root from "./Root";
import Error from "./Error";
//import { LoadingPage } from "./Product/Common/LoadingPage";
class LocalizationComponent extends Component {
  state = {};
  render() {
    let lngCode;
    if (this.props.userDetails.EntityResult !== undefined) {
      lngCode = this.props.userDetails.EntityResult.UICulture.substring(0, 2);
      //console.log("Suchitra:Language-", lngCode);
      configureLocalization({
        languageCode: lngCode, //this.state.lngCode, // "es",//,
        useXhr: true,
        fallbackLanguages: [lngCode, "en"],
      });
    }
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <ErrorBoundary>
              {this.props.isWindowsAuthError ? (
                <Error
                  errorMessage={this.props.windowsAuthErrorMessage}
                ></Error>
              ) : (
                <Root collapsed="true" onSignout={this.props.onSignout}></Root>
              )}
            </ErrorBoundary>
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
  };
};

export default connect(mapStateToProps)(LocalizationComponent);
