import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import ErrorBoundary from "../../ErrorBoundary";
import { TranslationConsumer } from "@scuf/localization";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { InputLabel } from "@scuf/common";
import axios from "axios";
import * as Utilities from "../../../JS/Utilities";
import * as RestAPIs from "../../../JS/RestApis";

class AboutComposite extends Component {
  state = {
    model: null,
    version: null,
  };
  componentDidMount() {
    try {
      let modelStr = null;
      if (this.props.userDetails.EntityResult.IsArchived)
        modelStr = "Archive System";
      else if (this.props.userDetails.EntityResult.IsWebPortalUser)
        modelStr = "Web Portal";
      else {
        if (this.props.userDetails.EntityResult.IsEnterpriseNode)
          modelStr = "Enterprise";
        else modelStr = "Local";
      }
      this.setState({
        model: modelStr,
      });
      this.getTMVersion();
    } catch (error) {
      console.log("AboutComposite:Error occured on componentDidMount", error);
    }
  }

  getTMVersion() {
    axios(
      RestAPIs.GetTMVersion,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            version: result.EntityResult,
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting getTMVersion:", error);
      });
  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            breadcrumbItem={this.props.activeItem}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
          <TMDetailsHeader newEntityName="Honeywell Terminal Manager"></TMDetailsHeader>
          <TranslationConsumer>
            {(t) => (
              <div className="detailsContainer">
                <div className="col-12 col-md-6 col-lg-4">
                  <InputLabel
                    fluid
                    label={t("AboutPageModel") + this.state.model}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <InputLabel
                    fluid
                    label={t("AboutPage_TMVersion") + this.state.version}
                  />
                </div>
                <br></br>
                {this.props.userDetails.EntityResult.PageAttibutes
                  .IsNTEPCertificateValid ? (
                  <div className="col-12 col-md-6 col-lg-4">
                    <p className="border-bottom-1 pb-2 deviceheaderLabel">
                      {t("AboutPage_CertificationInfoText")}
                    </p>
                    <InputLabel
                      fluid
                      label={
                        t("AboutPage_CCNoDesc") +
                        this.props.userDetails.EntityResult.PageAttibutes
                          .NTEP_CCNumber
                      }
                    />
                    <div>
                      <img src="/NTEP_Big.jpg" alt=""></img>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="col-12 col-md-6 col-lg-4">
                  <InputLabel fluid label={t("AboutPage_CopyrightInfo")} />
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
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

export default connect(mapStateToProps)(AboutComposite);

AboutComposite.propTypes = {
  activeItem: PropTypes.object,
};
