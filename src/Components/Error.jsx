import React, { Component } from "react";
import { TranslationConsumer } from "@scuf/localization";
class Error extends Component {
  state = {};
  render() {
    return (
      <TranslationConsumer>
        {(t) => (
          <h2>
            {this.props.errorMessage === undefined
              ? t("Error_Component")
              : t(this.props.errorMessage)}
          </h2>
        )}
      </TranslationConsumer>
    );
  }
}

export default Error;
