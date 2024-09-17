import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { TMUIInstallType } from "../../../JS/Constants";
import ErrorBoundary from "../../ErrorBoundary";

class SAGantryViewASPXComposite extends Component {
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
              data={"/" + tmuiInstallType + "/SAGantryView.aspx"}
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

export default connect(mapStateToProps)(SAGantryViewASPXComposite);

SAGantryViewASPXComposite.propTypes = {
  activeItem: PropTypes.object,
};
