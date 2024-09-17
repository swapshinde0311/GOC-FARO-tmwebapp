import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUIInstallType } from "../../../JS/Constants";

class SATruckViewTransactionsASPXComposite extends Component {
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
              //data="http://localhost/TMUI/UserAdmin.aspx"
              data={"/" + tmuiInstallType + "/SATruckViewTransactions.aspx"}
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

export default connect(mapStateToProps)(SATruckViewTransactionsASPXComposite);

SATruckViewTransactionsASPXComposite.propTypes = {
  activeItem: PropTypes.object,
};
