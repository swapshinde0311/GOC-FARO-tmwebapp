import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import AutoAccessIDAssociationDetailsComposite from "../Details/AutoAccessIDAssociationDetailsComposite";
import { AutoACSetLocationDetails } from "../../UIBase/Details/AutoACSetLocationDetails";
import axios from "axios";
import * as RestApis from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import { Notification, Button, Modal } from "@scuf/common";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import * as Utilities from "../../../JS/Utilities";
import {
  fnAutoIDAssociation,
  functionGroups,
} from "../../../JS/FunctionGroups";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { TranslationConsumer } from "@scuf/localization";

class AutoAccessIDAssociationComposite extends Component {
  state = {
    open: false,
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, modify: false, shareholder: true },
    selectedShareholder: "",
    selectedItems: [],
    CardNumber: "",
    tableData: {},
    modLocation: [],
    caredReadTime: null,
    message: "",
    ReadStartTime: null,
  };

  getLocationList(shareholder) {
    try {
      if (shareholder !== undefined && shareholder !== "") {
        axios(
          RestApis.GetCardReaderLocations + "?ShareholderCode=" + shareholder,
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            var result = response.data;
            if (result.IsSuccess === true) {
              this.setState({
                tableData: result.EntityResult,
                isReadyToRender: true,
              });
            } else {
              this.setState({ tableData: [], isReadyToRender: true });
              console.log("Error in GetCardReaderLocations:", result.ErrorList);
            }
          })
          .catch((error) => {
            this.setState({ tableData: [] });
            console.log(
              "Error while getting get card reader locations:",
              error
            );
          });
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on getLocationList",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnAutoIDAssociation
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "AutoAccessIDAssociation_PermissionError",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "BSI_AutoAccessIDAssociationSecurityError",
            },
          ],
        };
        this.onSavedEvent(notification);
        return;
      }
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnAutoIDAssociation
      );
      operationsVisibilty.modify = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnAutoIDAssociation
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getLocationList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      let { operationsVisibilty } = { ...this.state };
      // operationsVisibilty.modify = false;
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
        operationsVisibilty,
      });
      this.getLocationList(shareholder);
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  handleDelete = () => {};
  handleAdd = () => {};
  handleSetLocation = () => {
    try {
      this.setState({ open: true, selectedItems: [] });
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on SetLocation click",
        error
      );
    }
  };

  handleSelection = (items) => {
    try {
      this.setState({ selectedItems: items });
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on handleSelection",
        error
      );
    }
  };

  handleOK = () => {
    if (
      this.state.selectedItems !== undefined &&
      this.state.selectedItems.length < 1
    ) {
      this.notify();
    } else {
      let modLocation = [];
      if (this.state.selectedItems !== undefined) {
        modLocation.push(Object.values(this.state.selectedItems[0]));
      }
      this.setState({ modLocation, open: false });
    }
  };

  notify() {
    ReactToastify.toast(<ToastNotification closeToast={false} />);
  }

  onSavedEvent = (notification) => {
    try {
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on savedEvent",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on savedEvent",
        error
      );
    }
  };

  render() {
    return (
      <div>
        {this.renderModal()}

        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            onDelete={this.handleDelete}
            onAdd={this.handleAdd}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <ErrorBoundary>
            <AutoAccessIDAssociationDetailsComposite
              CardNumber={this.state.CardNumber}
              location={this.state.modLocation}
              onSetLocation={this.handleSetLocation}
              onSaved={this.savedEvent}
              selectedShareholder={this.state.selectedShareholder}
            ></AutoAccessIDAssociationDetailsComposite>
          </ErrorBoundary>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        <ErrorBoundary>
          <ToastContainer
            hideProgressBar={true}
            closeOnClick={false}
            closeButton={true}
            newestOnTop={true}
            position="bottom-right"
            toastClassName="toast-notification-wrap"
          />
        </ErrorBoundary>
      </div>
    );
  }

  renderModal() {
    return (
      <div>
        <TranslationConsumer>
          {(t) => (
            <Modal
              closeIcon={true}
              onClose={() => this.setState({ open: false })}
              open={this.state.open}
              closeOnDimmerClick={false}
              className="setLocationModal"
            >
              <Modal.Header>
                <div style={{ textAlign: "center" }}>
                  {t("TemporaryCard_SetLocation")}
                </div>
              </Modal.Header>
              <Modal.Content>
                <ErrorBoundary>
                  <AutoACSetLocationDetails
                    tableData={this.state.tableData.Table}
                    columnDetails={this.state.tableData.Column}
                    selectedItems={this.state.selectedItems}
                    onSelectionChange={this.handleSelection}
                  ></AutoACSetLocationDetails>
                </ErrorBoundary>
              </Modal.Content>
              <Modal.Footer style={{ textAlign: "center" }}>
                <Button
                  type="secondary"
                  size="medium"
                  content={t("AccessCardInfo_Cancel")}
                  onClick={() => this.setState({ open: false })}
                />
                <Button
                  type="primary"
                  size="medium"
                  content={t("AccessCardInfo_Ok")}
                  onClick={this.handleOK}
                />
              </Modal.Footer>
            </Modal>
          )}
        </TranslationConsumer>
      </div>
    );
  }
}

const ReactToastify = require("react-toastify");
const ToastNotification = () => (
  <TranslationConsumer>
    {(t) => (
      <Notification
        className="toast-notification"
        hasIcon={true}
        title={t("TemporaryCard_SetLocation")}
        severity="important"
      >
        {t("CardReader_MandatoryLocation")}
      </Notification>
    )}
  </TranslationConsumer>
);

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(AutoAccessIDAssociationComposite);

AutoAccessIDAssociationComposite.propTypes = {
  activeItem: PropTypes.object,
};
