import React from "react";
import { Button, Header } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { Loader } from "@scuf/common";

export function SignIn({ error, AuthorizationMessage, onSignIn }) {
  const remarksExpression = "^[0-9a-zA-Z-_]+(s{0,1}[a-zA-Z-0-9-_ ])*$";
  return (
    <TranslationConsumer>
      {(t) => (
        <div>
          <div className="loadingContainer">
            <div style={{ width: "100%" }}>
              <Header
                title={t("Header_TerminalManager")}
                menu={false}
                reponsive="false"
                // onMenuToggle={() => {
                //   if (this.state.collapsed) {
                //     iconMargin = 20;
                //   } else iconMargin = 0;
                //   this.setState({ collapsed: !this.state.collapsed });
                // }}
              />
            </div>
            <div className="loadingPosition">
              {AuthorizationMessage === "" ? (
                <div>
                  <h5>{t("Welcome_WebPortal")}</h5>
                  <h5 className="signInFont">{t("Sign_In")}</h5>
                  <Button
                    content={t("SignIn")}
                    onClick={onSignIn}
                    disabled={AuthorizationMessage !== ""}
                  ></Button>
                </div>
              ) : (
                <div className="authLoading">
                  <h5>{t(AuthorizationMessage)}</h5>

                  <Loader text=" " className="loaderPosition"></Loader>
                </div>
              )}

              {error !== null ? (
                <div className="below-text">
                  <span className="ui error-message">
                    {error.match(remarksExpression) ? t(error) : ""}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}

// class SignIn extends Component {
//   //state = { isAuthorizing: false };
//   componentDidMount() {
//     //console.log(this.props);
//   }

//   // componentWillReceiveProps(nextProps) {
//   //   if (
//   //     nextProps.error !== null &&
//   //     nextProps.error !== "" &&
//   //     this.props.error !== nextProps.error
//   //   ) {
//   //     this.setState({ isAuthorizing: false });
//   //   } else if (
//   //     this.props.accessCode !== nextProps.accessCode ||
//   //     this.props.accessToken !== nextProps.accessToken
//   //   ) {
//   //     this.setState({ isAuthorizing: true });
//   //     this.props.onSignIn();
//   //   }
//   // }

//   render() {
//     return (
//       <div>
//         <Button content="SignIn" onClick={this.props.onSignIn}></Button>
//         {this.props.AuthorizationMessage !== "" ? (
//           <InputLabel label="Authorizing..."></InputLabel>
//         ) : (
//           ""
//         )}
//         {this.props.error !== null ? (
//           <div className="below-text">
//             <span className="ui error-message">{this.props.error}</span>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//     );
//   }
// }

// export default SignIn;
