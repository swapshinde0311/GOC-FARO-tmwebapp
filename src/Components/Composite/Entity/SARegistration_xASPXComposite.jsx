import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUIInstallType } from "../../../JS/Constants";

class SARegistration_xASPXComposite extends Component {
  render() {
    const user = this.props.userDetails.EntityResult;
    let tmuiInstallType = TMUIInstallType.LIVE;

    if (user.IsArchived) tmuiInstallType = TMUIInstallType.ARCHIVE;

    return (
      <div>
        <ErrorBoundary>
          <div className="detailsContainer">
            <object
              className="tmuiPlaceHolder"
              type="text/html"
              width="100%"
              height="880px"
              data={"/" + tmuiInstallType + "/SARegistration_x.aspx"}
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

export default connect(mapStateToProps)(SARegistration_xASPXComposite);

SARegistration_xASPXComposite.propTypes = {
  activeItem: PropTypes.object,
};
