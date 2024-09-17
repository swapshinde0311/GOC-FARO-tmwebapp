import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { BaseProductSummaryComposite } from "../Summary/BaseProductSummaryComposite";
import BaseProductDetailsComposite from "../Details/BaseProductDetailsComposite";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import { kpiBaseProductList } from "../../../JS/KPIPageName";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import {
  functionGroups,
  fnBaseProduct,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class BaseProductComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: false },
    selectedRow: {},
    selectedItems: [],
    data: {},
    terminalCodes: [],
    baseProductKPIList: [],
    showAuthenticationLayout: false,
  };

  componentName = "BaseProductComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnBaseProduct
      );
      this.setState({
        operationsVisibilty,
      });
      this.getBaseProductList();
      if (this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.getTerminalsList(
          this.props.userDetails.EntityResult.PrimaryShareholder
        );
      this.getKPIList();
    } catch (error) {
      console.log(
        "BaseProductComposite:Error occured on componentDidMount",
        error
      );
    }

    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage);
  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage);
  };

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  };

  getBaseProductList() {
    axios(
      RestAPIs.GetBaseProductListForRole,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ data: result.EntityResult, isReadyToRender: true });
        } else {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error in getBaseProductList:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ data: [], isReadyToRender: true });
        console.log("Error while getting BaseProduct List:", error);
      });
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
        operationsVisibilty,
      });
    } catch (error) {
      console.log("BaseProductComposite:Error occured on handleAdd", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnBaseProduct
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnBaseProduct
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            Common_Status: data.Active,
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
      console.log("BaseProductComposite:Error occured on savedEvent", error);
    }
  };

  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnBaseProduct
      );
      operationsVisibilty.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        isReadyToRender: false,
      });
      this.getBaseProductList();
      this.getKPIList();
    } catch (error) {
      console.log("BaseProductComposite:Error occured on Back click", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnBaseProduct
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnBaseProduct
      );
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("BaseProductComposite:Error occured on Row click", error);
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
          fnBaseProduct
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "BaseProductComposite:Error occured on handleSelection",
        error
      );
    }
  };

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
      console.log("BaseProductComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deleteBaseProductKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var BaseProductCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          KeyCodes: [{ Key: KeyCodes.baseProductCode, Value: BaseProductCode }],
        };
        deleteBaseProductKeys.push(keyData);
      }
      axios(
        RestAPIs.DeleteBaseProduct,
        Utilities.getAuthenticationObjectforPost(
          deleteBaseProductKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          var isRefreshDataRequire = result.isSuccess;

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
            "BaseProductInfo_DeletionStatus",
            ["BaseProductCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getBaseProductList();
            this.getKPIList();
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
              messageResult.keyFields[0] = "BaseProductInfo_BaseProdCode";
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
          this.setState({
            operationsVisibilty,
            showAuthenticationLayout: false,
          });
        });
    } catch (error) {
      console.log("BaseProductComposite:Error occured on handleDelet", error);
    }
  };

  //Get KPI for Base Product
  getKPIList() {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      var notification = {
        message: "",
        messageType: "critical",
        messageResultDetails: [],
      };
      let objKPIRequestData = {
        PageName: kpiBaseProductList,
        InputParameters: [],
      };
      axios(
        RestAPIs.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              baseProductKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ baseProductKPIList: [] });
            console.log("Error in base product KPIList:", result.ErrorList);
            notification.messageResultDetails.push({
              keyFields: [],
              keyValues: [],
              isSuccess: false,
              errorMessage: result.ErrorList[0],
            });
          }
          if (notification.messageResultDetails.length > 0) {
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting Base Product KPIList:", error);
        });
    }
  }
  getTerminalsList(shareholder) {
    try {
      if (shareholder !== null && shareholder !== "") {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(
            [shareholder],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ terminalCodes: response.data.EntityResult });
          }
        });
      } else {
        this.setState({ terminalCodes: [] });
      }
    } catch (error) {
      console.log(
        "BaseProductComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === true ? (
          <ErrorBoundary>
            <BaseProductDetailsComposite
              key="BaseProductDetails"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              terminalCodes={this.state.terminalCodes}
            ></BaseProductDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.baseProductKPIList}
                  pageName="BaseProduct"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <BaseProductSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="BaseProductList"
                columnPickerRequired={true}
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectionRequired={true}
                columnGroupingRequired={true}
                onSelectionChange={this.handleSelection}
                // selectedItems={this.state.selectedItems}
                onRowClick={this.handleRowClick}
                parentComponent={this.componentName}
              ></BaseProductSummaryComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnBaseProduct}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleDelete}
          ></UserAuthenticationLayout>
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

export default connect(mapStateToProps)(BaseProductComposite);

BaseProductComposite.propTypes = {
  activeItem: PropTypes.object,
};
