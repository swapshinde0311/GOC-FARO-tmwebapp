import React, { Component } from "react";
import { connect } from "react-redux";
import * as Utilities from "../../../JS/Utilities";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import ErrorBoundary from "../../ErrorBoundary";
import axios from "axios";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { UnmatchedLocalTransactionsSummaryComposite } from "../Summary/UnmatchedLocalTransactionsSummaryComposite";
import UnmatchedLocalTransactionsDetailsComposite from "../Details/UnmatchedLocalTransactionsDetailsComposite";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { Select, Modal, Button, Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import {
  functionGroups,
  fnUnmatchedLocalTransactions,
} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import PropTypes from "prop-types";

class UnmatchedLocalTransactionsComposite extends Component {
  state = {
    operationsVisibility: { add: false, delete: false, shareholder: false },
    selectedShareholder: this.props.userDetails.EntityResult.PrimaryShareholder,
    isReadyToRender: false,
    isDetails: false,
    transportationTypeOptions: [],
    transportationType:
      this.props.activeItem.itemProps.transportationType.toUpperCase(),
    data: {},
    selectedRow: {},
    selectedItems: [],
    isOpenDeleteConfirm: false,
    deleteReason: "",
    deleteReasonError: "",
  };

  componentName = "UnMatchedLocalTransactionsComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getTransportationTypes();
      this.getUnmatchedLocalTransactionsList(this.state.transportationType);
    } catch (error) {
      console.log(
        "UnmatchedLocalTransactionsComposite: Error occurred on componentDidMount",
        error
      );
    }
  }

  getTransportationTypes() {
    try {
      const transportationTypeList = [
        Constants.TransportationType.ROAD,
        Constants.TransportationType.RAIL,
      ];
      this.setState({
        transportationTypeOptions: Utilities.transferListtoOptions(
          transportationTypeList
        ),
      });
    } catch (error) {
      console.log(
        "UnmatchedLocalTransactionsDetailsComposite: Error occurred on componentDidMount",
        error
      );
    }
  }

  getUnmatchedLocalTransactionsList(transportationType) {
    let obj = {
      TransactionType: "All",
      TransportationType: transportationType,
      ProductCode: "",
      ShareholderCode: this.state.selectedShareholder,
      LocationCode: "",
    };
    axios(
      RestAPIs.GetUnmatchedLocalTransactionsListForRole,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            data: result.EntityResult,
            isReadyToRender: true,
          });
        } else {
          this.setState({
            data: {},
            isReadyToRender: true,
          });
          console.log(
            "Error in GetUnmatchedLocalTransactionsList: ",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log(
          "Error while getting GetUnmatchedLocalTransactionsList: ",
          error
        );
      });
  }

  handleChange = (data) => {
    const transportationType = data;
    this.getUnmatchedLocalTransactionsList(data);
    this.setState({
      transportationType,
      selectedRow: {},
      selectedItems: [],
    });
  };

  handleRowClick = (item) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnUnmatchedLocalTransactions
      );
      operationsVisibility.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibility,
      });
    } catch (error) {
      console.log(
        "UnmatchedLocalTransactionsDetailsComposite: Error occurred on handleRowClick",
        error
      );
    }
  };

  handleSelection = (items) => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnUnmatchedLocalTransactions
        );
      this.setState({ selectedItems: items, operationsVisibility });
    } catch (error) {
      console.log(
        "UnmatchedLocalTransactionsDetailsComposite: Error occurred on handleSelection",
        error
      );
    }
  };

  handleBack = () => {
    try {
      const operationsVisibility = lodash.cloneDeep(
        this.state.operationsVisibility
      );
      operationsVisibility.delete = false;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibility,
        isReadyToRender: false,
      });
      this.getUnmatchedLocalTransactionsList(this.state.transportationType);
    } catch (error) {
      console.log(
        "UnmatchedLocalTransactionsDetailsComposite: Error occurred on Back click",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      const { operationsVisibility } = { ...this.state };
      operationsVisibility.delete = false;
      this.setState({ operationsVisibility });
      const deleteUnmatchedTransactionsKeys = [];
      for (let item of this.state.selectedItems) {
        deleteUnmatchedTransactionsKeys.push({
          ShareHolderCode: this.state.selectedShareholder,
          KeyCodes: [
            {
              Key: KeyCodes.TransactionNumber,
              Value: item.RailDispatchManualEntry_TransactionNo,
            },
            { Key: KeyCodes.bcuCode, Value: item.BCU_Code },
            {
              Key: KeyCodes.BatchNumber,
              Value: item.UnmatchedLocalTrans_BatchNo,
            },
          ],
        });
      }
      const requestEntity = {
        Reason: this.state.deleteReason,
        LstRequests: deleteUnmatchedTransactionsKeys,
      };
      axios(
        RestAPIs.MarkUnMatchLocalTransactionInValid,
        Utilities.getAuthenticationObjectforPost(
          requestEntity,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          let isRefreshDataRequire = result.IsSuccess;
          if (
            response.ResultDataList !== null &&
            result.ResultDataList !== undefined
          ) {
            var failedResultsCount = result.ResultDataList.filter(function (
              res
            ) {
              return !res.IsSuccess;
            }).length;
            if (failedResultsCount === result.ResultDataList.length) {
              isRefreshDataRequire = false;
            } else {
              isRefreshDataRequire = true;
            }
          }
          var notification = Utilities.convertResultsDatatoNotification(
            result,
            "UnmatchedLocalTrans_ModalHeader",
            []
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getUnmatchedLocalTransactionsList(
              this.state.transportationType
            );
            this.setState({
              selectedItems: [],
              selectedRow: {},
              isDetails: false,
              deleteReason: "",
            });
          } else {
            operationsVisibility.delete = true;
            this.setState({ operationsVisibility });
          }

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
      console.log(
        "UnmatchedLocalTransactionsDetailsComposite: Error occurred on handleDelete",
        error
      );
    }
  };

  render() {
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            operationsVisibilty={this.state.operationsVisibility}
            breadcrumbItem={this.props.activeItem}
            // onDelete={() => {
            //   this.setState({ isOpenDeleteConfirm: true });
            // }}
            addVisible={false}
            deleteVisible={false}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isDetails ? (
          <UnmatchedLocalTransactionsDetailsComposite
            key="UnmatchedLocalTransactionsDetails"
            selectedRow={this.state.selectedRow}
            selectedShareholder={this.state.selectedShareholder}
            onBack={this.handleBack}
          />
        ) : this.state.isReadyToRender ? (
          <div>
            {/* <ErrorBoundary>
              <TranslationConsumer>
                {(t) => (
                  <Select
                    fluid
                    placeholder="Select"
                    multiple={false}
                    value={this.state.transportationType}
                    options={this.state.transportationTypeOptions}
                    onChange={(data) => {
                      this.handleChange(data);
                    }}
                    reserveSpace={false}
                    search={false}
                    noResultsMessage={t("noResultsMessage")}
                  />
                )}
              </TranslationConsumer>
            </ErrorBoundary> */}
            <ErrorBoundary>
              <UnmatchedLocalTransactionsSummaryComposite
                tableData={this.state.data.Table}
                columnDetails={this.state.data.Column}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                exportRequired={true}
                exportFileName="UnMatchedLocalTransactionsList"
                columnPickerRequired={true}
  
                terminalsToShow={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .NoOfTerminalsToShow
                }
                selectionRequired={true}
                columnGroupingRequired={true}
                onSelectionChange={this.handleSelection}
                onRowClick={this.handleRowClick}
                parentComponent={this.componentName}
              ></UnmatchedLocalTransactionsSummaryComposite>
            </ErrorBoundary>
          </div>
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

        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <Modal
                size="mini"
                open={this.state.isOpenDeleteConfirm}
                closeOnDimmerClick={false}
              >
                <Modal.Content>
                  <Input
                    fluid
                    label={t("UnmatchedLocalTrans_MarkInvalidReason")}
                    reserveSpace={false}
                    value={this.state.deleteReason}
                    onChange={(data) => {
                      this.setState({ deleteReason: data });
                    }}
                    error={t(this.state.deleteReasonError)}
                  />
                </Modal.Content>
                <Modal.Footer>
                  <Button
                    content={t("AccessCardInfo_Ok")}
                    onClick={() => {
                      if (this.state.deleteReason !== "") {
                        this.handleDelete();
                        this.setState({
                          isOpenDeleteConfirm: false,
                          deleteReasonError: "",
                        });
                      } else {
                        this.setState({
                          deleteReasonError:
                            "LocalTransaction_ReasonForInvalid_Required",
                        });
                      }
                    }}
                  ></Button>
                  <Button
                    content={t("AccessCardInfo_Cancel")}
                    onClick={() => {
                      this.setState({
                        isOpenDeleteConfirm: false,
                        deleteReason: "",
                        deleteReasonError: "",
                      });
                    }}
                  ></Button>
                </Modal.Footer>
              </Modal>
            )}
          </TranslationConsumer>
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

export default connect(mapStateToProps)(UnmatchedLocalTransactionsComposite);

UnmatchedLocalTransactionsComposite.propTypes = {
  activeItem: PropTypes.object,
};
