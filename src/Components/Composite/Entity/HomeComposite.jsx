import React, { Component } from "react";
// import { TranslationConsumer } from "@scuf/localization";
import { connect } from "react-redux";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import ENDashboardComposite from "./ENDashboardComposite";
import ENDashboardOverviewComposite from "./ENDashboardOverviewComposite";

class HomeComposite extends Component {
  state = {};
  render() {
    let userDetails = this.props.userDetails.EntityResult;
    //console.log(userDetails);
    if (userDetails === undefined) {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    } else {
      return <ENDashboardComposite></ENDashboardComposite>;
    }
    // else if (userDetails.IsEnterpriseNode && !userDetails.IsWebPortalUser) {
    //   return <ENDashboardComposite></ENDashboardComposite>;
    // }
    // else if (userDetails.IsEnterpriseNode && userDetails.IsWebPortalUser) {
    //   return (
    //     <TranslationConsumer>
    //       {(t) => (
    //         <div className="welcomePosition">
    //           <h4>{t("Welcome_WebPortal")}</h4>
    //         </div>
    //       )}
    //     </TranslationConsumer>
    //   );
    // }
    // else if (!userDetails.IsEnterpriseNode) {
    //   let selectedTerminal = { TerminalCode: userDetails.TerminalCode };
    //   return (
    //     <ENDashboardOverviewComposite
    //       selectedTerminal={selectedTerminal}
    //       onBackClick={() => {}}
    //     ></ENDashboardOverviewComposite>
    //   );
    //   return <ENDashboardComposite></ENDashboardComposite>;
    // } 
    // else {
    //   return "";
    // }
  }
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(HomeComposite);
