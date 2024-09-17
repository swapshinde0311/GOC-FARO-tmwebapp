import React, { Component } from "react";
import axios from "axios";
import * as RestApis from "../../../JS/RestApis";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import ErrorBoundary from "../../ErrorBoundary";
import AccessIDManagementDetailsComposite from "../Details/AccessIDManagementDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ToastContainer, toast } from "react-toastify";
import * as Utilities from "../../../JS/Utilities";
import {
  fnAccessCard,
  functionGroups,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { AccessIDManagementSummaryPageComposite } from "../Summary/AccessIDManagementSummaryComposite";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as KeyCodes from "../../../JS/KeyCodes";
import "../../../CSS/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { kpiAccessCardList } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class AccessIDManagementComposite extends Component {
  state = {
    isDetails: "false",
    isReadyToRender: false,
    isDetailsModified: "false",
    operationsVisibilty: {
      add: false,
      delete: false,
      shareholder: true,
      view: false,
      modify: false,
    },
    selectedRow: {},
    selectedItems: [],
    selectedShareholder: "",
    data: {},
    accessCardKPIList: [],
    showAuthenticationLayout: false,
  };

  componentName = "AccessIDComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnAccessCard
      );
      // operationsVisibilty.delete = Utilities.isInFunction(
      //   this.props.userDetails.EntityResult.FunctionsList,
      //   functionGroups.remove,
      //   fnAccessCard
      // );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getAccessCardList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder);
    } catch (error) {
      console.log(
        "AccessIDManagementComposite:Error occured on ComponentDidMount",
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
      console.log("PrimeMoverComposite : Error in authenticateDelete");
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
            <AccessIDManagementDetailsComposite
              key="AccessIDManagementDetails"
              selectedRow={this.state.selectedRow}
              selectedShareholder={this.state.selectedShareholder}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              genericProps={this.props.activeItem.itemProps}
              deleteCallBack={this.deleteCallBack}
            ></AccessIDManagementDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isReadyToRender ? (
          <div>
            <ErrorBoundary>
              <KPIDashboardLayout
                kpiList={this.state.truckReceiptKPIList}
                pageName="AccessIDManagement"
              ></KPIDashboardLayout>
            </ErrorBoundary>
            <ErrorBoundary>
              <AccessIDManagementSummaryPageComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }

                exportRequired={true}
                exportFileName="AccessCardList"
                columnPickerRequired={true}

                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectionRequired={true}
                columnGroupingRequired={true}
                onSelectionChange={this.handleSelection}

                //selectedItems={this.state.selectedItems}
                onRowClick={this.handleRowClick}
                // onSelectionChange={this.handleSelection}
                parentComponent={this.componentName}
              ></AccessIDManagementSummaryPageComposite>
            </ErrorBoundary>
          </div>
        ) : (
          <LoadingPage message="Loading"></LoadingPage>
        )}
          {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.remove}
            functionGroup={fnAccessCard}
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
      this.getAccessCardList(shareholder);
      this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "AccessIDManagementComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };

  getAccessCardList(shareholder) {
    if (shareholder !== undefined && shareholder !== "") {
      axios(
        RestApis.GetAccessCardListForRole + "?ShareholderCode=" + shareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            var columnNames = [];
            result.EntityResult.Column.forEach((item) => {
              if (item.DataType === "DateTime") {
                columnNames.push(item.Name);
              }
            });
            result.EntityResult.Table.forEach((item) => {
              Object.keys(item).forEach((key) => {
                if (item[key] === "" || item[key] === null) {
                  if (columnNames.indexOf(key) === -1) {
                    item[key] = "None";
                  }
                }
              });
            });
            this.setState({ data: result.EntityResult, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in GetAccessCardListForRole:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting AccessCard List:", error);
        });
    }
  }

  //Get KPI for Access Card
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
        PageName: kpiAccessCardList,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }],
      };
      axios(
        RestApis.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              truckReceiptKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ truckReceiptKPIList: [] });
            console.log("Error in Access Card KPIList:", result.ErrorList);
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
          console.log("Error while getting Access Card KPIList:", error);
        });
    }
  }

  handleDelete = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });

      var deleteCustomerKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var shCode = this.state.selectedShareholder;
        var accessCardCode =
          this.state.selectedItems[i]["AccessCardList_x_IDCode"];
        var keyData = {
          keyDataCode: 0,
          ShareHolderCode: shCode,
          KeyCodes: [{ Key: KeyCodes.accessCardCode, Value: accessCardCode }],
        };
        keyData.KeyCodes.push({
          Key: KeyCodes.shareholderCode,
          Value: shCode,
        });

        deleteCustomerKeys.push(keyData);
      }

      /*if(this.state.isDetails === "true") {
                var shCode = this.state.selectedShareholder;
                var accessCardCode = this.state.selectedRow["AccessCardList_x_IDCode"];
                var keyData = {
                    keyDataCode: 0,
                    ShareHolderCode: shCode,
                    KeyCodes: [{ Key: KeyCodes.accessCardCode, Value: accessCardCode}]
                };
                keyData.KeyCodes.push({
                    Key: KeyCodes.shareholderCode,
                    Value: shCode,
                });
                deleteCustomerKeys.push(keyData);
            }*/

      axios(
        RestApis.DeleteAccessCard,
        Utilities.getAuthenticationObjectforPost(
          deleteCustomerKeys,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        var isRefreshDataRequire = result.isSuccess;

        if (
          result.ResultDataList !== null &&
          result.ResultDataList !== undefined
        ) {
          var failedResultsCount = result.ResultDataList.filter(function (res) {
            return !res.IsSuccess;
          }).length;

          if (failedResultsCount === result.ResultDataList.length) {
            isRefreshDataRequire = false;
          } else isRefreshDataRequire = true;
        }

        var notification = Utilities.convertResultsDatatoNotification(
          result,
          "AccessCardList_DelModalHeader",
          ["AccessCardCode"]
        );

        if (isRefreshDataRequire) {
          this.setState({ isReadyToRender: false, showAuthenticationLayout:false, });
          this.getAccessCardList(this.state.selectedShareholder);
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
          this.setState({ operationsVisibilty,
            showAuthenticationLayout: false, });
        }

        notification.messageResultDetails.forEach((messageResult) => {
          if (messageResult.keyFields.length > 0)
            messageResult.keyFields[0] = "AccessCardInfo_x_Title";
        });

        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      });
    } catch (error) {
      console.log(
        "AccessIDManagementComposite:Error occured on handleDelete",
        error
      );
    }
  };

  handleAdd = () => {
    try {
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnAccessCard
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "AccessCardDetail_Permission",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "BSI_AccessIdSecurityError",
            },
          ],
        };
        this.savedEvent("item", "Permission", notification);
        return;
      } else {
        var { operationsVisibilty } = { ...this.state };
        operationsVisibilty.delete = false;
        operationsVisibilty.add = false;
        operationsVisibilty.shareholder = false;
        this.setState({
          isDetails: "true",
          selectedRow: {},
          selectedItems: [],
          operationsVisibilty,
        });
      }
    } catch (error) {
      console.log(
        "AccessIDManagementComposite:Error occured on handleAdd",
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
        fnAccessCard
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
      this.getAccessCardList(this.state.selectedShareholder);
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "AccessIDManagementComposite:Error occured on Back click",
        error
      );
    }
  };

  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (
        !Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.view,
          fnAccessCard
        )
      ) {
        var notification = {
          messageType: "critical",
          message: "AccessCardDetail_Permission",
          messageResultDetails: [
            {
              keyFields: "",
              keyValues: "",
              isSuccess: false,
              errorMessage: "BSI_AccessIdSecurityError",
            },
          ],
        };
        this.savedEvent("item", "Permission", notification);
        return;
      }
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnAccessCard
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnAccessCard
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: "true",
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "AccessIDManagementComposite:Error occured on handleRowClick",
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
          fnAccessCard
        );
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "AccessIDManagementComposite:Error occured on handleSelection",
        error
      );
    }
  };

  savedEvent = (data, saveType, notification) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      if (notification.messageType === "success") {
        operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnAccessCard
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnAccessCard
        );
        this.setState({ isDetailsModified: "true", operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
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
        "AccessIDManagementComposite:Error occured on savedEvent",
        error
      );
    }
  };

  deleteCallBack = (data) => {
    this.state.selectedItems.push(data);
  };
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(AccessIDManagementComposite);

AccessIDManagementComposite.propTypes = {
  activeItem: PropTypes.object,
};
