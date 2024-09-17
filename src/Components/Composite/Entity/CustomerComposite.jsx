import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { CustomerSummaryPageComposite } from "../Summary/CustomerSummaryComposite";
import CustomerDetailsComposite from "../Details/CustomerDetailsComposite";
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
import {
  functionGroups,
  fnCustomer,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { kpiCustomerList } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class CustomerComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    customerKPIList: [],
    showAuthenticationLayout: false,

  };

  componentName = "CustomersList";

  terminalList = [];

  handleAdd = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      operationsVisibilty.add = false;
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: {},
        operationsVisibilty,
      });
    } catch (error) {
      console.log("CustomerComposite:Error occured on handleAdd", error);
    }
  };

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deleteCustomerKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var shCode = this.state.selectedShareholder;
        var CustomerCode = this.state.selectedItems[i]["Common_Code"];
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.customerCode, Value: CustomerCode }],
        };
        keyData.KeyCodes.push({
          Key: KeyCodes.shareholderCode,
          Value: shCode,
        });

        deleteCustomerKeys.push(keyData);
      }

      axios(
        RestAPIs.DeleteCustomer,
        Utilities.getAuthenticationObjectforPost(
          deleteCustomerKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          // console.log(response.data);
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
            "CustomerDetails_DeletionStatus",
            ["CustomerCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({
              isReadyToRender: false,
              showAuthenticationLayout: false,
            });
            this.getcustomerList(this.state.selectedShareholder);
            this.getKPIList(this.state.selectedShareholder);
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
              messageResult.keyFields[0] = "Cust_Code";
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
          throw error;
        });
    } catch (error) {
      console.log("CustomerComposite:Error occured on handleDelete", error);
    }
  };

  //Get KPI for Customers
  getKPIList(shareholder) {
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
        PageName: kpiCustomerList,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }],
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
              customerKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ customerKPIList: [] });
            console.log("Error in customer KPIList:", result.ErrorList);
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
          console.log("Error while getting Customer KPIList:", error);
        });
    }
  }
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCustomer
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: "false",
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getcustomerList(this.state.selectedShareholder);
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log("CustomerComposite:Error occured on Back click", error);
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCustomer
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnCustomer
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log("CustomerComposite:Error occured on handleRowClick", error);
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
          fnCustomer
        );

      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log("CustomerComposite:Error occured on handleSelection", error);
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnCustomer
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnCustomer
        );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.Code,
            Common_Status: data.Status,
            Common_Shareholder: data.ShareholderCode,
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
      console.log("CustomerComposite:Error occured on savedEvent", error);
    }
  };

  getcustomerList(shareholder) {
    if (shareholder !== undefined && shareholder !== "") {
      axios(
        RestAPIs.GetCustomerListForRole + "?ShareholderCode=" + shareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in GetCustomerListForRole:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting Customer List:", error);
        });
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnCustomer
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getcustomerList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getTerminalsList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log(
        "CustomerComposite:Error occured on ComponentDidMount",
        error
      );
    }

    // clear session storage on window refresh event
    window.addEventListener("beforeunload", this.clearStorage)

  }

  componentWillUnmount = () => {
    // clear session storage
    this.clearStorage();

    // remove event listener
    window.removeEventListener("beforeunload", this.clearStorage)
  }

  clearStorage = () => {
    sessionStorage.removeItem(this.componentName + "GridState");
  }

  handleShareholderSelectionChange = (shareholder) => {
    try {
      let { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
        operationsVisibilty,
      });
      this.getcustomerList(shareholder);
      this.getTerminalsList(shareholder);
      this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "CustomerComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  getTerminalsList(shareholder) {
    try {
      if (shareholder !== undefined && shareholder !== "") {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(
            [shareholder],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          if (response.data.IsSuccess) {
            var data = response.data.EntityResult;
            if (Array.isArray(data)) {
              this.terminalList = data;
            } else {
              this.terminalList = [];
            }
          } else {
            this.terminalList = [];
          }
        });
      } else {
        this.terminalList = [];
      }
    } catch (error) {
      console.log("CustomerComposite:Error occured on getTerminalsList", error);
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
      console.log("CustomerComposite : Error in authenticateDelete");
    }
  };
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibilty}
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            selectedShareholder={this.state.selectedShareholder}
            onShareholderChange={this.handleShareholderSelectionChange}
            onDelete={this.authenticateDelete}
            onAdd={this.handleAdd}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails === "true" ? (
          <ErrorBoundary>
            <CustomerDetailsComposite
              key="CustomerDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              genericProps={this.props.activeItem.itemProps}
              terminalList={this.terminalList}
            ></CustomerDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.customerKPIList}
                  pageName="Customer"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <CustomerSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="CustomersList"
                columnPickerRequired={true}

                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectionRequired={true}
                columnGroupingRequired={true}

                //selectedItems={this.state.selectedItems}
                onRowClick={this.handleRowClick}
                onSelectionChange={this.handleSelection}
                parentComponent={this.componentName}
              ></CustomerSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnCustomer}
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

export default connect(mapStateToProps)(CustomerComposite);

CustomerComposite.propTypes = {
  activeItem: PropTypes.object,
};
