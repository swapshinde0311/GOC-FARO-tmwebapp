import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { PipelineReceiptSummaryPageComposite } from "../Summary/PipelineReceiptSummaryComposite";
import PipelineReceiptDetailsComposite from "../Details/PipelineReceiptDetailsComposite";
import axios from "axios";
import * as Constants from "./../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { TranslationConsumer } from "@scuf/localization";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import {
  functionGroups,
  fnPipelineReceipt,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { TMTransactionFilters } from "../../UIBase/Common/TMTransactionFilters";
import { KpiPipelineReceiptList } from "../../../JS/KPIPageName";
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import TransactionSummaryOperations from "../Common/TransactionSummaryOperations";
import { PipelineReceiptViewAuditTrailDetails } from "../../UIBase/Details/PipelineReceiptViewAuditTrailsDetail";
import { Modal, Button, Input } from "@scuf/common";
import PipelineReceiptManualEntryDetailsComposite from "../Details/PipelineReceiptManualEntryDetailsComposite";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import { pipelineReceiptStatusTimeAttributeEntity } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class PipelineReceiptComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, delete: false, shareholder: true },
    selectedRow: {},
    receipt: {},
    selectedItems: [],
    selectedShareholder:
      this.props.selectedShareholder === undefined ||
        this.props.selectedShareholder === null ||
        this.props.selectedShareholder === ""
        ? this.props.userDetails.EntityResult.PrimaryShareholder
        : this.props.selectedShareholder,
    data: {},
    fromDate: new Date(),
    toDate: new Date(),
    dateError: "",
    terminalCodes: [],
    pipelineReceiptKPIList: [],
    drawerStatus: false,
    currentReceiptStatus: [],
    isManualEntry: false,
    isViewAuditTrail: false,
    modAuditTrailList: [],
    auditTrailList: [],
    attributeMetaDataList: [],
    shipmentNextOperations: [],
    Remarks: "",
    isCloseReceipt: false,
    UOMS: {},
    isMeterRequired: false,
    isTankRequired: true,
    activityInfo: [],
    showReport: false,
    showDeleteAuthenticationLayout: false,
  };

  componentName = "PipelineReceiptComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      let { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineReceipt
      );
      this.setState({
        operationsVisibilty,
        selectedShareholder:
          this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.getTerminalsList(this.state.selectedShareholder);
      this.getPipelineReceiptList(
        this.props.userDetails.EntityResult.PrimaryShareholder
      );
      this.getKPIList(this.state.selectedShareholder);
      this.GetShipmentActivityInfo();
      console.log(this.props);
    } catch (error) {
      console.log(
        "PipelineReceiptComposite:Error occured on componentDidMount",
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

  GetShipmentActivityInfo() {
    try {
      axios(
        RestAPIs.GetShipmentActivityInfo,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          if (response.data.IsSuccess) {
            this.setState({ activityInfo: response.data.EntityResult });
          }
        })
        .catch((error) => {
          console.log("Error while getting shipment activityInfo:", error);
        });
    } catch (error) {
      console.log("Error in GetShipmentActivityInfo:", error);
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
        "PipelineReceiptComposite:Error occured on getTerminalsList",
        error
      );
    }
  }
  getPipelineReceiptList(shareholder) {
    try {
      this.setState({ isReadyToRender: false });
      let fromDate = new Date(this.state.fromDate);
      let toDate = new Date(this.state.toDate);
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);
      let obj = {
        startRange: fromDate,
        endRange: toDate,
        TransportationType: Constants.TransportationType.PIPELINE,
        ShareHolderCode: shareholder,
      };
      axios(
        RestAPIs.GetPipelineReceiptListForRole,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          ;
          var result = response.data;
          console.log(result);
          if (result.IsSuccess === true) {
            this.setState({ data: result.EntityResult, isReadyToRender: true },
              () => {
                if (
                  this.state.isOperation === true &&
                  this.state.selectedItems.length === 1
                ) {
                  let selectedItem = this.state.selectedItems[0];
                  var updatedselectedItem = result.EntityResult.Table.filter(
                    function (item) {
                      return item.Common_Code === selectedItem.Common_Code;
                    }
                  )
                  let { operationsVisibilty } = { ...this.state };
                  this.setState({
                    selectedItems: updatedselectedItem,
                    operationsVisibilty,
                  });
                  this.getPipelineReceipt(updatedselectedItem[0]);
                }
              }
            );
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getPipelineReceiptList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getPipelineReceiptList:", error);
        });
    } catch (error) {
      this.setState({ isReadyToRender: true });
      console.log(error);
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
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
        isManualEntry: false,
        isViewAuditTrail: false,
      });
      this.getPipelineReceiptList(this.state.selectedShareholder);
    } catch (error) {
      console.log("PipelineReceiptComposite:Error occured on handleAdd");
    }
  };
  handleDelete = () => {
    this.handleAuthenticationClose();
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.delete = false;
      this.setState({ operationsVisibilty });
      var deletePipelineReceiptKeys = [];
      for (var i = 0; i < this.state.selectedItems.length; i++) {
        var pipelineReceiptCode = this.state.selectedItems[i]["Common_Code"];
        var shCode = this.state.selectedShareholder;
        var KeyData = {
          ShareHolderCode: shCode,
          KeyCodes: [
            { Key: KeyCodes.pipelineReceiptCode, Value: pipelineReceiptCode },
          ],
        };
      }
      deletePipelineReceiptKeys.push(KeyData);

      axios(
        RestAPIs.DeletePipelineReceipt,
        Utilities.getAuthenticationObjectforPost(
          deletePipelineReceiptKeys,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          console.log(result);
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
            "PipelineReceiptList_ModalHeader",
            ["PipelineReceiptCode"]
          );

          if (isRefreshDataRequire) {
            this.setState({ isReadyToRender: false });
            this.getPipelineReceiptList(shCode);
            this.getKPIList(this.state.selectedShareholder);
            operationsVisibilty.delete = false;
            this.setState({
              selectedItems: [],
              operationsVisibilty,
              selectedRow: {},
            });
          } else {
            operationsVisibilty.delete = true;
            this.setState({ operationsVisibilty });
          }

          console.log(notification.messageResultDetails);
          notification.messageResultDetails.forEach((messageResult) => {
            if (messageResult.keyFields.length > 0) {
              messageResult.keyFields[0] = "PipelineReceipt_ReceiptCode";
            }
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
          this.setState({ operationsVisibilty });
        });
    } catch (error) {
      console.log("PipelineReceiptComposite:Error occured on handleDelete");
    }
  };
  handleBack = () => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineReceipt
      );
      operationsVisibilty.delete = false;
      operationsVisibilty.shareholder = true;
      this.setState({
        isDetails: false,
        selectedRow: {},
        selectedItems: [],
        operationsVisibilty,
        isReadyToRender: false,
      });
      this.getPipelineReceiptList(this.state.selectedShareholder);
      this.getKPIList(this.state.selectedShareholder);
    } catch (error) {
      console.log(
        "PipelineReceiptComposite:Error occured on Back click",
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
          fnPipelineReceipt
        );
        operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPipelineReceipt
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.PipelineReceiptCode,
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
        "PipelineReceiptComposite:Error occured on savedEvent",
        error
      );
    }
  };
  handleRangeSelect = ({ to, from }) => {
    if (to !== undefined) this.setState({ toDate: to });
    if (from !== undefined) this.setState({ fromDate: from });
  };
  handleDateTextChange = (value, error) => {
    if (value === "")
      this.setState({ dateError: "", toDate: "", fromDate: "" });
    if (error !== null && error !== "")
      this.setState({
        dateError: "Common_InvalidDate",
        toDate: "",
        fromDate: "",
      });
    else {
      this.setState({ dateError: "", toDate: value.to, fromDate: value.from });
    }
  };
  handleLoadOrders = () => {
    //;
    let error = Utilities.validateDateRange(
      this.state.toDate,
      this.state.fromDate
    );

    if (error !== "") {
      this.setState({ dateError: error });
    } else {
      this.setState({ dateError: "" });
      this.getPipelineReceiptList(this.state.selectedShareholder);
    }
  };
  handleRowClick = (item) => {
    try {
      var { operationsVisibilty } = { ...this.state };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnPipelineReceipt
      );
      operationsVisibilty.delete = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.remove,
        fnPipelineReceipt
      );
      operationsVisibilty.shareholder = false;
      this.setState({
        isDetails: true,
        selectedRow: item,
        selectedItems: [item],
        operationsVisibilty,
      });
    } catch (error) {
      console.log(
        "PipelineReceiptComposite:Error occured on handleRowClick",
        error
      );
    }
  };
  handleSelection = (items) => {
    try {
      var { operationsVisibilty, drawerStatus } = { ...this.state };

      operationsVisibilty.delete =
        items.length > 0 &&
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnPipelineReceipt
        );
      if (
        items.length === 1
        // this.props.userDetails.EntityResult.IsEnterpriseNode === false
      ) {
        this.getPipelineReceipt(items[0]);
        if (items.length !== 1) {
          drawerStatus = true;
        } else {
          drawerStatus = false;
        }
        this.setState({ isOperation: true, drawerStatus });
      }
      this.setState({ selectedItems: items, operationsVisibilty });
    } catch (error) {
      console.log(
        "PipelineReceiptComposite:Error occured on handleSelection",
        error
      );
    }
  };
  handleShareholderSelectionChange = (shareholder) => {
    try {
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
      });
      this.getPipelineReceiptList(shareholder);
      this.getTerminalsList(shareholder);
      this.getKPIList(shareholder);
    } catch (error) {
      console.log(
        "PipelineReceiptComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  //Get KPI for Pipeline Receipt
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
        PageName: KpiPipelineReceiptList,
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
              pipelineReceiptKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ pipelineReceiptKPIList: [] });
            console.log("Error in truck Receipt KPIList:", result.ErrorList);
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
          console.log("Error while getting truck Receipt KPIList:", error);
        });
    }
  }
  getReceiptStatuses(receiptRow) {
    try {
      axios(
        RestAPIs.GetPipelineReceiptAllStatuses +
        "?shareholderCode=" +
        this.state.selectedShareholder +
        "&pipelineReceiptCode=" +
        receiptRow.Common_Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          console.log("result.EntityResult", result.EntityResult);
          this.setState({
            currentReceiptStatus: result.EntityResult,
          });
        })
        .catch((error) => {
          console.log("Error while getting getReceiptStatuses:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  handleAuthorizeToManualEntry(receiptItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.pipelineReceiptCode,
        value: receiptItem.PipelineReceiptCode,
      },

    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.pipelineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.AuthorizePipelineReceiptManualEntry,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
        // this.setState({isAuthorizedManualEntry:true})
      })
      .catch((error) => {
        console.log("Error while AuthorizeToLoad:", error);
      });
  }
  handleAuthorizeToUpdateScada(receiptItem, shCode, token, callback) {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.pipelineReceiptCode,
        value: receiptItem.PipelineReceiptCode,
      },

    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.pipelineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.AuthorizeUpadatePipelineReceiptScada,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while AuthorizeToLoad:", error);
      });
  }
  getPipelineReceipt(selectedRow) {
    let transportationType = Constants.TransportationType.PIPELINE;
    var keyCode = [
      {
        key: KeyCodes.pipelineReceiptCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    var obj = {
      ShareHolderCode: this.state.selectedShareholder,
      keyDataCode: KeyCodes.pipelineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetPipelineReceipt,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        ;
        var result = response.data;
        console.log(result);
        if (result.IsSuccess === true) {
          this.setState(
            {
              receipt: result.EntityResult,
            },
            () => {
              // this.getReciptsStatusOperations(result.EntityResult);
              this.getReceiptStatuses(selectedRow);
              this.getReceiptOperations();
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting receipt:", error, selectedRow);
      });

  }
  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [pipelineReceiptStatusTimeAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
          });
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }
  formReadonlyCompAttributes(attributes, attributeMetaDataList) {
    let compAttributes = [];
    if (
      attributeMetaDataList !== null &&
      attributeMetaDataList !== undefined &&
      attributeMetaDataList.length > 0
    ) {
      attributeMetaDataList.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          //if (attribute.TerminalCode)
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName
              ? attribute.DisplayName
              : attribute.Code,
            AttributeValue: attribute.DefaultValue,
            TerminalCode: attribute.TerminalCode,
            IsMandatory: attribute.IsMandatory,
            DataType: attribute.DataType,
            IsReadonly: attribute.IsReadonly,
            MinValue: attribute.MinValue,
            MaxValue: attribute.MaxValue,
            ValidationFormat: attribute.ValidationFormat,
            compSequenceNo: "",
          });
        });
      });
    }

    if (
      attributes !== null &&
      attributes !== undefined &&
      attributes.length > 0
    ) {
      attributes.forEach((att) => {
        compAttributes.forEach((compAtt) => {
          if (compAtt.TerminalCode === att.TerminalCode) {
            att.ListOfAttributeData.forEach((selAtt) => {
              if (compAtt.AttributeCode === selAtt.AttributeCode)
                compAtt.AttributeValue = selAtt.AttributeValue;
            });
          }
        });
      });
    }
    return compAttributes;
  }
  handleViewAuditTrail(receiptItem, shCode, token, callback) {

    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },
      {
        key: KeyCodes.pipelineReceiptCode,
        value: receiptItem.PipelineReceiptCode,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.pipelineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetPipelineReceiptViewAuditTrailList,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        ;
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while getting handleViewAuditTrail:", error);
      });
  }
  handleCloseReceipttModal = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isCloseReceipt} size="mini">
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("Receipt_ForceCloseHeader") +
                    " : " +
                    this.state.receipt.PipelineReceiptCode}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.Remarks}
                    label={t("ViewReceipt_Reason")}
                    reserveSpace={false}
                    onChange={(value) => {
                      this.setState({ Remarks: value });
                    }}
                  />
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  if (this.state.Remarks === "") {
                    let notification = {
                      messageType: "critical",
                      message: "ViewReceipt_CloseSuccess",
                      messageResultDetails: [
                        {
                          keyFields: ["ReceiptCode"],
                          keyValues: [this.state.receipt.PipelineReceiptCode],
                          isSuccess: false,
                          errorMessage: "Enter_Receipt_ReasonForCloseure",
                        },
                      ],
                    };

                    toast(
                      <ErrorBoundary>
                        <NotifyEvent
                          notificationMessage={notification}
                        ></NotifyEvent>
                      </ErrorBoundary>,
                      {
                        autoClose:
                          notification.messageType === "success"
                            ? 10000
                            : false,
                      }
                    );
                  } else
                    this.setState({ isCloseReceipt: false }, () => {
                      this.handleReceiptClose();
                    });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({
                    isCloseReceipt: false,
                    Remarks: "",
                  });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };
  handleReceiptClose() {
    try {
      let notification = {
        messageType: "critical",
        message: "ViewReceipt_CloseSuccess",
        messageResultDetails: [
          {
            keyFields: ["ReceiptCode"],
            keyValues: [this.state.receipt.PipelineReceiptCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      var keyCode = [
        {
          key: KeyCodes.pipelineReceiptCode,
          value: this.state.receipt.PipelineReceiptCode,
        },
        {
          key: "Remarks",
          value: this.state.Remarks,
        },

      ];
      var obj = {
        ShareHolderCode: this.state.selectedShareholder,
        keyDataCode: KeyCodes.pipelineReceiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.ClosePipelineReceipt,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.getPipelineReceiptList(this.state.selectedShareholder);
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
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
          console.log("Error while ReceiptClose:", error);
        });
    } catch (error) {
      console.log("Error while closing the shipment:", error);
    }
  }
  onBack = () => {
    let operationsVisibilty = { ...this.state.operationsVisibilty };
    this.setState({
      isManualEntry: false,
      isViewAuditTrail: false,
      isDetails: false,
      operationsVisibilty,
      isViewUnloading: false,
      isReadyToRender: false,
    });
    this.getPipelineReceiptList(this.state.selectedShareholder);
  };
  getReceiptOperations() {
    try {
      const receipt = lodash.cloneDeep(this.state.receipt);
      let updateEnable = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnPipelineReceipt
      );
      let shipmentNextOperations = [];
      if (
        (receipt.PipelineReceiptStatus.toUpperCase() ===
          Constants.PipelineDispatchStatuses.READY ||
          receipt.PipelineReceiptStatus.toUpperCase() ===
            Constants.PipelineDispatchStatuses.PARTIALLY_COMPLETED) &&
        updateEnable
      ) {
        shipmentNextOperations.push("Authorize_ManualEntry_Update");
        shipmentNextOperations.push("Authorize_Scada_Update");
      }
      if (
        receipt.PipelineReceiptStatus.toUpperCase() ===
        Constants.PipelineDispatchStatuses.CLOSED
      ) {
        shipmentNextOperations.push(
          "PipelineDispatchList_btnTransactionReport"
        );
        shipmentNextOperations.push(
          "PipelineDispatchList_btnViewTransactionReport"
        );
      }
      shipmentNextOperations.push("PipelineDispatch_BtnAuditTrail");
      if (
        receipt.PipelineReceiptStatus.toUpperCase() !==
          Constants.PipelineDispatchStatuses.CLOSED &&
        receipt.PipelineReceiptStatus.toUpperCase() !==
          Constants.PipelineDispatchStatuses.READY &&
        updateEnable
      ) {
        shipmentNextOperations.push("PipelineDispatch_BtnManualEntry");
        shipmentNextOperations.push("PipelineDispatch_BtnClosed");
        // shipmentNextOperations.push("PipelineDispatch_BtnSubmit");
      }

      this.setState({ shipmentNextOperations });
    } catch (error) {
      console.log("Error in getting receipt Current Operations");
    }
  }
  handlePrintTransaction = (receiptItem, shCode, token, callback) => {
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: shCode,
      },

      {
        key: KeyCodes.pipelinePlanCode,
        value: receiptItem.PipelineReceiptCode,
      },
      {
        key: KeyCodes.pipelinePlanType,
        value: Constants.PipeLineType.RECEIPT,
      },
    ];
    var obj = {
      ShareHolderCode: shCode,
      keyDataCode: KeyCodes.pipelineReceiptCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.PipelinePrintBOLReport,
      Utilities.getAuthenticationObjectforPost(obj, token)
    )
      .then((response) => {
        var result = response.data;
        callback(result);
      })
      .catch((error) => {
        console.log("Error while Print BOL Report:", error);
      });
  };
  getRefrenceSource() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=PipelineReceipt",
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.CustodyTransferReferenceSource === "0") {
              this.setState({
                isMeterRequired: true,
                isTankRequired: false,
                isManualEntry: true,
                isDetails: false
              });
            }
            else {
              this.setState({
                isMeterRequired: false,
                isTankRequired: true,
                isManualEntry: true,
                isDetails: false
              });
            }

          } else {
            console.log("Error in getLookUpData: ", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log(
            "PipelineDispatchComposite: Error occurred on getLookUpData",
            error
          );
        });
    }
    catch (error) {
      console.log(
        "PipelineDispatchComposite:Error occured on geting RefrenceSourceLookUp Value",
        error
      );
    }
  }
  getUoms() {
    try {
      axios(
        RestAPIs.GetUOMList,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              Array.isArray(result.EntityResult.VOLUME)
            ) {
              this.setState({ UOMS: result.EntityResult }, () => {
                this.getRefrenceSource()
              });
            }
          } else {
            console.log("Error in GetUOMList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error in GetUOMList:", error);
        });
    }
    catch (error) {
      console.log("Error in GetUOMList", error)
    }
  }
  handleViewTransaction = () => {
    if (this.reportServiceURI === undefined) {
      axios(
        RestAPIs.GetReportServiceURI,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        if (response.data.IsSuccess) {
          this.reportServiceURI = response.data.EntityResult;
          this.setState({ showReport: true });
        }
      });
    } else {
      this.setState({ showReport: true });
    }
  };
  handleModalBack = () => {
    this.setState({ showReport: false });
  };
  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/PipelineReceipt";
    } else {
      path = "TM/" + Constants.TMReports + "/PipelineReceipt";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      ShareholderCode: this.state.selectedShareholder,
      PipelinePlanCode:
        this.state.selectedItems.length === 1
          ? this.state.selectedItems[0].Common_Code
          : this.state.selectedRow.Common_Code,
      TransactionType: Constants.PipeLineType.RECEIPT,
    };

    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleModalBack}
        handleModalClose={this.handleModalBack}
        // proxyServerHost="http://epksr5115dit:3625/TMWebAPI/"
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }
  handleOperationClick = (operation) => {
    ;
    let receipt = lodash.cloneDeep(this.state.receipt);
    let notification = {
      messageType: "critical",
      message: operation + "_status",
      messageResultDetails: [
        {
          keyFields: ["ReceiptDetail_ReceiptNumber"],
          keyValues: [receipt.PipelineReceiptCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    switch (operation) {
      case Constants.ViewAllPipelineDispatchOperations.Authorize_ManualEntry_Update:
        this.handleAuthorizeToManualEntry(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineReceiptList(this.state.selectedShareholder);
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
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
        );
        break;

      case Constants.ViewAllPipelineDispatchOperations.Authorize_Scada_Update:
        this.handleAuthorizeToUpdateScada(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineReceiptList(this.state.selectedShareholder);
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
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
        );
        break;

      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnManualEntry:
        this.getUoms();
        // this.setState({ isManualEntry: true, isDetails: false })
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnClosed:
        this.setState({ isCloseReceipt: true });
        break;

      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnTransactionReport:
        this.handlePrintTransaction(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.getPipelineReceiptList(this.state.selectedShareholder);
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
            }
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
        );
        break;


      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatchList_btnViewTransactionReport:
        this.handleViewTransaction();
        break;
      case Constants.ViewAllPipelineDispatchOperations.PipelineDispatch_BtnAuditTrail:
        this.handleViewAuditTrail(
          lodash.cloneDeep(this.state.receipt),
          this.state.selectedShareholder,
          this.props.tokenDetails.tokenInfo,
          (result) => {
            if (result.IsSuccess === true) {
              ;
              let modAuditTrailList = result.EntityResult;
              let attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList.PIPELINERECEIPTCHSTATUSTIME
              );
              for (let i = 0; i < modAuditTrailList.length; i++) {
                let receiptStatus = modAuditTrailList[i].PipelineReceiptStatus.toUpperCase();
                if (receiptStatus === Constants.PipelineReceiptstatus.CLOSED) {
                  receiptStatus = Constants.PipelineReceiptStatus.CLOSED;
                } else if (
                  receiptStatus === Constants.PipelineReceiptstatus.AUTHORIZED
                ) {
                  receiptStatus = Constants.PipelineReceiptStatus.AUTHORIZED;
                } else if (receiptStatus === Constants.PipelineReceiptstatus.READY) {
                  receiptStatus = Constants.PipelineReceiptStatus.READY;
                } else if (
                  receiptStatus === Constants.PipelineReceiptstatus.INPROGRESS
                ) {
                  receiptStatus = Constants.PipelineReceiptStatus.INPROGRESS;
                } else if (
                  receiptStatus === Constants.PipelineReceiptstatus.MANUALLY_COMPLETED
                ) {
                  receiptStatus = Constants.PipelineReceiptStatus.MANUALLY_COMPLETED;
                }
                modAuditTrailList[i].PipelineReceiptstatus = receiptStatus;
                modAuditTrailList[i].UpdatedTime =
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleDateString() +
                  " " +
                  new Date(
                    modAuditTrailList[i].UpdatedTime
                  ).toLocaleTimeString();
              }
              let auditTrailList = result.EntityResult;
              for (let i = 0; i < auditTrailList.length; i++) {
                auditTrailList[i].AttributesforUI =
                  this.formReadonlyCompAttributes(
                    auditTrailList[i].Attributes,
                    attributeMetaDataList
                  );
              }
              var { operationsVisibilty } = { ...this.state };
              operationsVisibilty.add = false;
              operationsVisibilty.delete = false;
              this.setState({
                operationsVisibilty,
                auditTrailList: result.EntityResult,
                modAuditTrailList: modAuditTrailList,
                isViewAuditTrail: true,
              });
            } else {
              notification.messageType = result.IsSuccess
                ? "success"
                : "critical";
              notification.messageResultDetails[0].isSuccess = result.IsSuccess;
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
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
          }
        );
        break;
      default:
        return;
    }
  };
  handleDrawer = () => {
    var drawerStatus = lodash.cloneDeep(this.state.drawerStatus);
    this.setState({
      drawerStatus: !drawerStatus,
    });
  };

  
 

  handleAuthenticationClose = () => {
    
    this.setState({
      showDeleteAuthenticationLayout: false,
    });
  };

  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout = this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
      
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("Pipeline Receipt Composite : Error in authenticateDelete");
    }
  };


  
  getFunctionGroupName() {
    if(this.state.showDeleteAuthenticationLayout )
      return fnPipelineReceipt
    
   };

   getDeleteorEditMode() {
    if(this.state.showDeleteAuthenticationLayout)
      return functionGroups.remove;
    else  
      return functionGroups.modify;
   };

   handleOperation()  {
  
    if(this.state.showDeleteAuthenticationLayout)
      return this.handleDelete
    
 };

  render() {
    let reciptSelected = this.state.selectedItems.length === 1;
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
        {this.state.isDetails ? (
          <ErrorBoundary>
            <PipelineReceiptDetailsComposite
              Key="PipelineReceiptDetails_PageTitle"
              selectedRow={this.state.selectedRow}
              onBack={this.handleBack}
              onSaved={this.savedEvent}
              terminalCodes={this.state.terminalCodes}
              selectedShareholder={this.state.selectedShareholder}
              handleAuthorizeToManualEntry={this.handleAuthorizeToManualEntry}
              handleAuthorizeToUpdateScada={this.handleAuthorizeToUpdateScada}
              handlePrintTransaction={this.handlePrintTransaction}
              handleViewAuditTrail={this.handleViewAuditTrail}
              handleViewTransaction={this.handleViewTransaction}
              activityInfo={this.state.activityInfo}
            ></PipelineReceiptDetailsComposite>
          </ErrorBoundary>
        ) : this.state.isViewAuditTrail ? (
          <ErrorBoundary>
            <PipelineReceiptViewAuditTrailDetails
              ReceiptCode={this.state.selectedItems[0].Common_Code}
              selectedRow={this.state.selectedRow}
              auditTrailList={this.state.auditTrailList}
              modAuditTrailList={this.state.modAuditTrailList}
              handleBack={this.onBack}
              Attributes={
                this.state.auditTrailList !== undefined &&
                  this.state.auditTrailList.length > 0
                  ? this.state.auditTrailList[0].AttributesforUI
                  : []
              }
            ></PipelineReceiptViewAuditTrailDetails>
          </ErrorBoundary>
        ) : this.state.isManualEntry ? (
          <ErrorBoundary>
            <TranslationConsumer>
              {(t) => (
                <TMDetailsHeader
                  entityCode={
                    this.state.isManualEntry
                      ? this.state.receipt.PipelineReceiptCode +
                      " - " +
                      t("LoadingDetailsEntry_Title")
                      : this.state.receipt.PipelineReceiptCode
                  }
                  newEntityName="Receipt_NewReceiptByCompartment"
                // popUpContents={popUpContents}
                ></TMDetailsHeader>
              )}
            </TranslationConsumer>
            <PipelineReceiptManualEntryDetailsComposite
              receipt={this.state.receipt}
              handleBack={this.onBack}
              selectedShareholder={this.state.selectedShareholder}
              UOMS={this.state.UOMS}
              isMeterRequired={this.state.isMeterRequired}
              isTankRequired={this.state.isTankRequired}
            ></PipelineReceiptManualEntryDetailsComposite>
          </ErrorBoundary>
        ) : (
          <div>
            <ErrorBoundary>
              <div className="kpiSummaryContainer">
                <KPIDashboardLayout
                  kpiList={this.state.pipelineReceiptKPIList}
                  pageName="PipelineReceipt"
                ></KPIDashboardLayout>
              </div>
            </ErrorBoundary>
            <div className={
              reciptSelected
                ? !this.state.drawerStatus
                  ? "showShipmentStatusRightPane"
                  : "drawerClose"
                : ""
            }>
              <ErrorBoundary>
                <TMTransactionFilters
                  dateRange={{ from: this.state.fromDate, to: this.state.toDate }}
                  dateError={this.state.dateError}
                  handleDateTextChange={this.handleDateTextChange}
                  handleRangeSelect={this.handleRangeSelect}
                  handleLoadOrders={this.handleLoadOrders}
                  filterText="LoadReceipts"
                ></TMTransactionFilters>
              </ErrorBoundary>
              {this.state.isReadyToRender ? (
                <ErrorBoundary>
                  <PipelineReceiptSummaryPageComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    exportFileName="PipelineReceiptList"
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
                  ></PipelineReceiptSummaryPageComposite>
                </ErrorBoundary>

              ) : (
                <LoadingPage message="Loading"></LoadingPage>
              )}
            </div>
            {reciptSelected ? (
              <div
                className={
                  this.state.drawerStatus ? "marineStatusLeftPane" : ""
                }
              >
                <TransactionSummaryOperations
                  selectedItem={this.state.selectedItems}
                  shipmentNextOperations={this.state.shipmentNextOperations}
                  handleDetailsPageClick={this.handleRowClick}

                  handleOperationButtonClick={this.handleOperationClick}
                  currentStatuses={this.state.currentReceiptStatus}
                  handleDrawer={this.handleDrawer}
                  isDetails={false}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  webPortalAllowedOperations={[
                    "PipelineDispatchList_btnViewTransactionReport",
                    "PipelineDispatch_BtnAuditTrail"
                  ]}
                  isWebPortalUser={
                    this.props.userDetails.EntityResult.IsWebPortalUser
                  }
                  unAllowedOperations={[
                    "Authorize_ManualEntry_Update",
                    "Authorize_Scada_Update",
                    "PipelineDispatch_BtnManualEntry",
                    "PipelineDispatch_BtnClosed"
                  ]}
                  title={"ViewAllReceipt_Details"}
                />
              </div>
            ) : (
              ""
            )}
          </div>

        )}
        {Object.keys(this.state.selectedRow).length > 0 ||
          this.state.selectedItems.length === 1
          ? this.renderModal()
          : ""}
        {/* </div> */}
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
        {this.state.isCloseReceipt ? this.handleCloseReceipttModal() : null}

        {this.state.showDeleteAuthenticationLayout  ||
           this.state.showAuthorizeToLoadAuthenticationLayout  
          ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getDeleteorEditMode()}
            functionGroup={this.getFunctionGroupName()}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleOperation()}
          ></UserAuthenticationLayout>
        ) : null}
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

const mapReceiptToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapReceiptToProps
)(PipelineReceiptComposite);

PipelineReceiptComposite.propTypes = {
  activeItem: PropTypes.object,
  selectedShareholder: PropTypes.string,
};
