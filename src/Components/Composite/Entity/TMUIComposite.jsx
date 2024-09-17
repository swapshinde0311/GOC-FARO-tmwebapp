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
import { TMUIInstallType } from "../../../JS/Constants";

class TMUIComposite extends Component {
  render() {

    const user = this.props.userDetails.EntityResult;
    let tmuiInstallType=TMUIInstallType.LIVE;
    
    if(user.IsArchived)
    tmuiInstallType=TMUIInstallType.ARCHIVE;

    return (
      <div>
        <ErrorBoundary>
          <div className="detailsContainer">
            <object
              className="tmuiPlaceHolder"
              type="text/html"
              width="100%"
              height="600px"
              //data="http://localhost/TMUI/"
              data={"/"+ tmuiInstallType +"/"}
            ></object>
          </div>
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

export default connect(mapStateToProps)(TMUIComposite);

TMUIComposite.propTypes = {
  activeItem: PropTypes.object,
};
