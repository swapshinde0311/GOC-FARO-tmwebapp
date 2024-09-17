import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ErrorBoundary from "../../../ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "../../../../CSS/styles.css";
import { TranslationConsumer } from "@scuf/localization";
import { Icon, Button } from "@scuf/common";

class BookSlotComposite extends Component {
  state = {
    timeSpan: "",
    time: "",
    isBooked: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    try {
      let startTime = this.props.slotTime.startLTTime.format("HH:mm");
      let timeSpan = startTime + " - " + this.props.slotTime.endLTTime.format("HH:mm");

      this.setState({
        time: startTime,
        timeSpan: timeSpan,
        isBooked: this.props.slotTime.booked
      });
    } catch (error) {
      console.log("BookSlotComposite:Error occurred on componentDidMount", error);
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <div>
              {this.state.isBooked ? "" : (
                <div className="mobile-tobebook-slot-card">
                  <div className="mobile-slot-time-text">
                    <span>{this.state.time}</span>
                  </div>
                  {this.props.operationsVisibilty.add === false ? "" : (
                    <div className="mobile-slot-button-div">
                      <Button type="primary" size="small" content={t("COMMON_BOOK_NOW")} onClick={this.props.handleSlotBook}></Button>
                    </div>
                  )}
                </div>
              )}

              {this.state.isBooked ? (
                <div className="mobile-booked-slot-card">
                  {this.props.isCanCancel === false ? "" : (
                    <div className="mobile-cancel-slot-icon" onClick={this.props.handleCancelBook}>
                      <Icon root="common" name="close" size="small" />
                    </div>
                  )}
                  <div className="mobile-booked-slot-icon">
                    <Icon root="common" name="badge-check" size="large" />
                  </div>
                  <div className="mobile-booked-slot-timespan">
                    <span>{this.state.timeSpan}</span>
                  </div>
                </div>
              ) : ""}
            </div>
          )}
        </TranslationConsumer>
      </ErrorBoundary >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(BookSlotComposite);

BookSlotComposite.propTypes = {
  locationCode: PropTypes.string,
  slotList: PropTypes.array,
  handleSlotBook: PropTypes.func,
  handleCancelBook: PropTypes.func,
};