import React, { Component } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ErrorBoundary from "../../ErrorBoundary";
import {
  Icon,
  Table,
  Checkbox,
  Input,
  Modal,
  Tooltip,
  InputLabel,
  Pagination,
} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import lodash from "lodash";
import * as Constants from "../../../JS/Constants";

class BayQueueComposite extends Component {
  state = {
    searchBayResult: "",
    pageIndex: 1,
    pageSize: 1,
  };

  componentDidMount() {
    this.getLookUpData();
  }

  getLookUpData() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=BayAllocation",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (!isNaN(parseInt(result.EntityResult["PageSize"]))) {
            this.setState({
              pageSize: parseInt(result.EntityResult["PageSize"]),
            });
          }
        }
      });
    } catch (error) {
      console.log(
        "BayAllocationDetailsComposite:Error occured on getLookUpData",
        error
      );
    }
  }

  onBaySearchChange = (value) => {
    this.setState({ searchBayResult: value });
  };

  onCheckboxChange = (bayCode, data) => {
    try {
      this.props.onBaySelect(bayCode, data);
    } catch (error) {
      console.log("BayQueueComposite:Error occured on onCheckboxChange", error);
    }
  };

  getBayTooltip(data) {
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            {t("BayGroupList_BayCode")} : {data.BayCode} {<br></br>}
            {t("BayGroupList_LoadingType")} : {data.LoadingType}
            {<br></br>}
            {t("BayTooltip_QueueSize")} : {data.MaximumQueue}
            {<br></br>}
            {t("BaySearch_BayMode")} : {data.IsManual ? "Manual Bay" : "Auto"}
            {<br></br>}
            {t("TankGroupInfo_Active")} : {data.Active ? "true" : "false"}
          </div>
        )}
      </TranslationConsumer>
    );
  }

  getBayShipmentTooltip(data) {
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            {data.ShipmentCode === null
              ? t("Receipt_Code")
              : t("ViewShipmentStatus_ShipmentCode")}{" "}
            : {data.Code} {<br></br>}
            {t("Receipt_Shareholder")} : {data.ShareholderCode}
            {<br></br>}
            {t("ViewReceipt_CarrierCompany")} : {data.CarrierCode}
            {<br></br>}
            {t("ViewReceipt_Vehicle")} : {data.VehicleCode}
            {<br></br>}
            {t("DriverInfo_Driver")} : {data.DriverCode}
            {<br></br>}
            {t("ScheduledDate")} :{" "}
            {new Date(data.ScheduledDate).toLocaleDateString()}
          </div>
        )}
      </TranslationConsumer>
    );
  }

  getBayTypeTooltip(data) {
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            {t("BayType_Title")} :{" "}
            {data.BayType === "BOTH" ? t("BayType_Both") : data.BayType}
          </div>
        )}
      </TranslationConsumer>
    );
  }
  getTransactionIdentifier(code, shareholder) {
    // let transaction = { code: code, shareholder: shareholder };
    // return JSON.stringify(transaction);
    return code + Constants.delimiter + shareholder;
  }

  render() {
    let { searchBayResult } = this.state;
    let bayData = this.props.bayData;
    let searchBayResults = bayData.filter((values) => {
      return (
        values.BayCode.toLowerCase().includes(searchBayResult.toLowerCase()) ||
        values.ShipmentReceiptItem.some(function (subElement) {
          return subElement.Code.toLowerCase().includes(
            searchBayResult.toLowerCase()
          );
        })
      );
    });
    let paginationBays = [];
    let pageIndex = lodash.cloneDeep(this.state.pageIndex);
    if (this.state.pageSize >= searchBayResults.length) {
      pageIndex = 1;
    }
    let firstIndexInPage = (pageIndex - 1) * this.state.pageSize;
    let lastIndexInPage = firstIndexInPage + this.state.pageSize;
    if (lastIndexInPage >= searchBayResults.length) {
      lastIndexInPage = searchBayResults.length;
    }
    paginationBays = searchBayResults.slice(firstIndexInPage, lastIndexInPage);
    return (
      <TranslationConsumer>
        {(t) => (
          <div className="detailsContainer">
            <div className="row">
              <div className="col-4">
                <Input
                  className="input-example"
                  placeholder={t("BayAllocation_SearchBay")}
                  search={true}
                  onChange={(data) => this.onBaySearchChange(data)}
                />
              </div>
              <div className="col-4">
                {searchBayResults.length > this.state.pageSize ? (
                  <Pagination
                    totalItems={searchBayResults.length}
                    itemsPerPage={this.state.pageSize}
                    activePage={this.state.pageIndex}
                    onPageChange={(page) => {
                      this.setState({ pageIndex: page });
                    }}
                  ></Pagination>
                ) : (
                  ""
                )}
              </div>

              <div className="col-4" style={{ marginTop: "1rem" }}>
                <div style={{ float: "right" }}>
                  {t("Common_LastUpdated") + " : " + this.props.updatedTime}
                  <span
                    style={{ marginLeft: "1rem", cursor: "pointer" }}
                    onClick={() => this.props.onRefresh()}
                  >
                    <img
                      style={{ width: "6%" }}
                      src="/Refresh.png"
                      alt=""
                    ></img>
                  </span>
                </div>
              </div>
            </div>
            <ErrorBoundary>
              {paginationBays.length > 0
                ? paginationBays.map((a, key) => (
                    <div style={{ overflowX: "auto" }}>
                      <Table>
                        <Table.Header>
                          <Table.HeaderCell
                            colSpan={a.MaximumQueue + 2}
                            content={a.BayCode}
                          >
                            <div
                              className="row"
                              style={{ marginBottom: "-1rem" }}
                            >
                              <div style={{ display: "flex" }}>
                                <div>
                                  {a.MaximumQueue > 0 &&
                                  a.Active === true &&
                                  this.props.isBayAllocation === true ? (
                                    <Checkbox
                                      label={a.BayCode}
                                      checked={
                                        a.SelectedBay === true ? true : false
                                      }
                                      onChange={(data) =>
                                        this.onCheckboxChange(a.BayCode, data)
                                      }
                                    ></Checkbox>
                                  ) : (
                                    <div style={{ whiteSpace: "pre" }}>
                                      <InputLabel
                                        label={a.BayCode + "   "}
                                      ></InputLabel>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <ErrorBoundary>
                                    <Tooltip
                                      element={
                                        <Icon
                                          style={{ paddingBottom: "5px" }}
                                          name="badge-info"
                                          root="common"
                                        />
                                      }
                                      content={this.getBayTooltip(a)}
                                      size="mini"
                                      position="right center"
                                    ></Tooltip>
                                  </ErrorBoundary>
                                </div>
                                <ErrorBoundary>
                                  <Tooltip
                                    element={
                                      <span className="bayTypeIconPosition">
                                        <icon
                                          style={{ fontSize: "25px" }}
                                          className={
                                            a.BayType === "BOTH"
                                              ? "icon-Loading-Unloading"
                                              : a.BayType === "LOADING"
                                              ? "icon-Loading"
                                              : "icon-Unloading"
                                          }
                                        ></icon>
                                      </span>
                                    }
                                    content={this.getBayTypeTooltip(a)}
                                    size="mini"
                                    position="right center"
                                  ></Tooltip>
                                </ErrorBoundary>
                                {this.props.isManualMode === false ? (
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "18px",
                                    }}
                                  >
                                    <span style={{ marginTop: "-0.3rem" }}>
                                      <Icon name="locked" root="Building" />
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </Table.HeaderCell>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Droppable droppableId={a.BayCode} type="Type1">
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  {a.ShipmentReceiptItem.length > 0 ? (
                                    a.ShipmentReceiptItem.map((b, index) => (
                                      <Table.Cell
                                        className={
                                          this.props.selectedShipmentReceiptItem
                                            .Code === b.Code
                                            ? "bayAllocationtd tdSelected"
                                            : "bayAllocationtd"
                                        }
                                        onClick={() =>
                                          this.props.isBayAllocation
                                            ? this.props.onCellClick(
                                                index,
                                                a.BayCode
                                              )
                                            : ""
                                        }
                                      >
                                        <ErrorBoundary>
                                          <Draggable
                                            draggableId={this.getTransactionIdentifier(
                                              b.Code,
                                              b.ShareholderCode
                                            )}
                                            // draggableId={b.code}
                                            isDragDisabled={
                                              this.props.isBayAllocation ===
                                              false
                                            }
                                          >
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                              >
                                                <div className="bayAllocationFontSize">
                                                  {b.Code}
                                                  <ErrorBoundary>
                                                    <Tooltip
                                                      element={
                                                        <span className="bayAllocationInfoIcon">
                                                          <Icon
                                                            name="badge-info"
                                                            root="common"
                                                          />
                                                        </span>
                                                      }
                                                      content={this.getBayShipmentTooltip(
                                                        b
                                                      )}
                                                      size="mini"
                                                      position="right center"
                                                    ></Tooltip>
                                                  </ErrorBoundary>
                                                </div>
                                                <div className="bayAllocationFontSize">
                                                  {b.VehicleCode}
                                                </div>
                                                {index > 0 ? (
                                                  <div>
                                                    <img
                                                      className="bayAllocationImagePosition"
                                                      src="/Vehicle.png"
                                                      alt=""
                                                      title={"Vehicle"}
                                                    ></img>
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <img
                                                      className="bayAllocationImagePosition"
                                                      src="/VehiclewithBay.png"
                                                      alt=""
                                                      title={"Vehicle"}
                                                    ></img>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </Draggable>
                                        </ErrorBoundary>
                                      </Table.Cell>
                                    ))
                                  ) : (
                                    <Table.Cell className="bayAllocationtd">
                                      <img
                                        className="bayAllocationImagePosition"
                                        src="/BayEmpty.png"
                                        alt=""
                                        title={"Bay"}
                                      ></img>
                                    </Table.Cell>
                                  )}

                                  {a.MaximumQueue > 0
                                    ? [
                                        ...Array.from(
                                          Array(
                                            a.MaximumQueue -
                                              (a.ShipmentReceiptItem.length ===
                                              0
                                                ? 1
                                                : a.ShipmentReceiptItem.length)
                                          ).keys()
                                        ),
                                      ].map((num, i) => (
                                        <Table.Cell className="bayAllocationtd"></Table.Cell>
                                      ))
                                    : ""}
                                  <Table.Cell></Table.Cell>
                                </div>
                              )}
                            </Droppable>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </div>
                  ))
                : t("BaySearch_NoResult")}
            </ErrorBoundary>
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(BayQueueComposite);

BayQueueComposite.propTypes = {
  onCellClick: PropTypes.func.isRequired,
  onBaySelect: PropTypes.func.isRequired,
  isManualMode: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isBayAllocation: PropTypes.bool.isRequired,
};
