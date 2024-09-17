import React, { Component } from "react";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { functionGroups, fnShareholder } from "../../../JS/FunctionGroups";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as KeyCodes from "../../../JS/KeyCodes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { ExchangePartnerSummaryPageComposite } from "../Summary/ExchangePartnerSummaryComposite";
import ExchangePartnerDetailsComposite from "../Details/ExchangePartnerDetailsComposite";
import ShowAuthenticationLayout from "../Common/UserAuthentication";

class ExchangePartnerComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: true, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
      this.props.selectedShareholder === null ||
      this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    showAuthenticationLayout: false

  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.GetExchangePartnerList();
    } catch (error) {
      console.log(
        "BayGroupComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        data: {},
        operationsVisibilty,
        selectedItems: [],
      });
    } catch (error) {
      console.log("ExchangePartnerComposite:Error occured on handleAdd", error);
    }
  };
  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnShareholder
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnShareholder
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Name: data.Name,
          },
        ];
        this.setState({ selectedItems });
      }
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
        "ExchangePartnerComposite:Error occured on savedEvent",
        error
      );
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShareholder
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.GetExchangePartnerList();
    } catch (error) {
      console.log("baygroupComposite:Error occured on Back click", error);
    }
  };
  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteExchangePartnerKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var PartnerName = this.state.selectedItems[i]["Name"];
        var keyData = {
          ShareHolderCode: PartnerName,
          KeyCodes: [{ Key: KeyCodes.exchangePartnerName, Value: PartnerName }],
        };
        deleteExchangePartnerKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteExchangePartner,
        Utilities.getAuthenticationObjectforPost(
          deleteExchangePartnerKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.IsSuccess;

          if (
            result.ResultDataList !== null &&
            result.ResultDataList !== undefined
          ) {
            var failedResultsCount = result.ResultDataList.filter(function (
              res
            ) {
              return !res.IsSuccess;
            }).length;

            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else isRefreshDataRequire = true;
          }
          var notification = Utilities.convertResultsDatatoNotification(
            result,
            "ExchangePart_Deletesucess",
            ["ShareHolderCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.GetExchangePartnerList();
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
              showAuthenticationLayout: false,

            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({
              operationsVisibilty,
              showAuthenticationLayout: false,
            });
          }

          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0)
              messageResult.keyFields[0] = "Exchange_Partner_Name";
          });

          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          console.log("Error occured while deleting:" + error);
          var { operationsVisibilty } = { ...this.state };
          operationsVisibilty.delete = true;
          this.setState({ operationsVisibilty,
            showAuthenticationLayout: false,
           });
        });
    } catch (error) {
      console.log(
        "ExchangePartnerComposite:Error occured on handleDelete",
        error
      );
    }
  };
  handleSelection = (items) => {
    try {
      var { operationsVisibilty } = { ...this.state };

      operationsVisibilty.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnShareholder
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "ExchangePartnerComposite:Error occured on handleSelection",
        error
      );
    }
  };
  handleRowClick = (item) => {
    try {
      if (item.Name !== undefined) {
        var { operationsVisibilty } = { ...this.state };
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnShareholder
        );
        if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
          operationsVisibilty.delete = false;
        } else {
          operationsVisibilty.delete = Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.remove,
            fnShareholder
          );
        }
        operationsVisibilty.shareholder = false;
        this.setState({
          isDetails: true,
          selectedRow: item,
          selectedItems: [item],
          operationsVisibilty,
        });
      }
    } catch (error) {
      console.log("ExchangePartnerComposite:Error occured on Row click", error);
    }
  };
  GetExchangePartnerList() {
    try {
      axios(
        RestAPIs.GetExchangePartnerList,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var { operationsVisibilty } = { ...this.state };
            operationsVisibilty.add = Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnShareholder
            );
            this.setState({
              data: result.EntityResult,
              isReadyToRender: true,
              operationsVisibilty,

            });
          } else {
            this.setState({ data: [], isReadyToRender: true,
             });
            console.log("Error in getexchangepartnerList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({
            data: [], isReadyToRender: true,
          });
          console.log("Error while getting getexchangepartnerList:", error);
        });
    } catch (error) {
      console.log("Error in getexchangepartnerList ", error);
    }
  }
  authenticateDelete = () => {
    try {
      let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showAuthenticationLayout });
      if (showAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("ShareholderComposite : Error in authenticateDelete");
    }
  };
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  render() {
    // const user = this.props.userDetails.EntityResult;
    // let tmuiInstallType=TMUIInstallType.LIVE;

    // if(user.IsArchived)
    // tmuiInstallType=TMUIInstallType.ARCHIVE;

    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            onAdd={this.handleAdd}
            onDelete={this.authenticateDelete}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <ExchangePartnerDetailsComposite
              key="Exchange_Partner_NewDetail"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
            ></ExchangePartnerDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <ErrorBoundary>
            <ExchangePartnerSummaryPageComposite
              tableData={this.state.data.Table}
              columnDetails={this.state.data.Column}
              pageSize={
                this.props.userDetails.EntityResult.PageAttibutes
                  .WebPortalListPageSize
              }
              terminalsToShow={
                this.props.userDetails.EntityResult.PageAttibutes
                  .NoOfTerminalsToShow
              }
              selectedItems={this.state.selectedItems}
              selectedBays={this.state.selectedBays}
              expandedRows={this.state.expandedRows}
              toggleExpand={this.toggleExpand}
              onRowClick={this.handleRowClick}
              onSelectionChange={this.handleSelection}
            ></ExchangePartnerSummaryPageComposite>
          </ErrorBoundary>
        ) : (
          <>
            <LoadingPage message="Loading"></LoadingPage>
          </>
        )}
        {this.state.showAuthenticationLayout ? (
          <ShowAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnShareholder}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></ShowAuthenticationLayout>
        ) : null}
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
        {/* <ErrorBoundary>
          <div className="detailsContainer">
            <object
              className="tmuiPlaceHolder"
              type="text/html"
              width="100%"
              height="880px"
              //data="http://localhost/TMUI/ExchangePartnerList_x.aspx"
              data={"/"+ tmuiInstallType +"/ExchangePartnerList_x.aspx"}
            ></object>
          </div>
        </ErrorBoundary> */}
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

export default connect(mapStateToProps)(ExchangePartnerComposite);

ExchangePartnerComposite.propTypes = {
  activeItem: PropTypes.object,
  selectedShareholder: PropTypes.string,
};
