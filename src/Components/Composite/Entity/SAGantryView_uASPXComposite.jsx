import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUIInstallType } from "../../../JS/Constants";

class SAGantryView_uASPXComposite extends Component {
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
              height="880px"
              data={"/"+ tmuiInstallType +"/SAGantryView_u.aspx"}
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

export default connect(mapStateToProps)(SAGantryView_uASPXComposite);

SAGantryView_uASPXComposite.propTypes = {
  activeItem: PropTypes.object,
};
