import React, { Component } from "react";
import {
  Modal,
  Button,
  Select,
  DatePicker,
  Input,
  Accordion,
} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import * as Constants from "../../../../JS/Constants";
import { getCurrentDateFormat } from "../../../../JS/functionalUtilities";
import dayjs from "dayjs";
import { LoadingPage } from "../../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import ErrorBoundary from "../../../ErrorBoundary";
import PropTypes from "prop-types";
import { AttributeDetails } from "../../../UIBase/Details/AttributeDetails";

class ModifySlotComposite extends Component {
  state = {};
  getSlotTimings() {
    let options = [];
    try {
      let slotParams = this.props.slotParameters;
      let dayStartTime = slotParams.slotStartTime;
      let dayEndTime = slotParams.slotEndTime;
      let slotDuration = slotParams.slotDuration;
      let tempStartTime = dayStartTime;
      while (tempStartTime.isBefore(dayEndTime)) {
        options.push({
          text: tempStartTime.format("HH:mm"),
          value: tempStartTime.format("HH:mm"),
        });
        tempStartTime = tempStartTime.add(slotDuration, "minute");
      }
    } catch (error) {
      console.log("ModifySlotComposite-> error in getSlotTimings", error);
    }
    return options;
  }
  getDurations() {
    // debugger;
    let options = [];
    try {
      let slotParams = this.props.slotParameters;
      let maxSlots = slotParams.maxSlots;
      let slotDuration = slotParams.slotDuration;
      for (let i = 1; i <= maxSlots; i++) {
        options.push({
          text: i * slotDuration,
          value: (i * slotDuration).toString(),
        });
      }
    } catch (error) {
      console.log("ModifySlotComposite-> error in getDurations", error);
    }
    return options;
  }
  getProductAvaiabilityList() {
    let productsList = []; ////{Code,Quantity,UOM,shCode,isAvailable}
    try {
      let bayProducts = []; //[shCode:Sh1,fpCodes:[]]
      let filteredBays = this.props.bayList.filter(
        (bay) => bay.bayCode === this.props.slotModifyFields.bayCode
      );
      if (filteredBays.length > 0) {
        bayProducts = filteredBays[0].shareholder;
      }
      productsList = lodash.cloneDeep(this.props.transactionData.products);
      productsList.forEach((product) => {
        product["isAvailable"] = false;
        bayProducts.forEach((shProd) => {
          if (shProd.shCode === product.shCode) {
            shProd.fpCodes.forEach((fp) => {
              if (fp === product.code) {
                product["isAvailable"] = true;
              }
            });
          }
        });
      });
    } catch (error) {
      console.log(
        "ModifySlotComposite-> error in getProductAvaiabilityList",
        error
      );
    }
    return productsList;
  }
  getFilteredBays() {
    //debugger;
    let options = [];
    try {
      let allBays = this.props.bayList; //[{bayCode:"",active: true, bayType: "LOADING",shareholder:[shCode:Sh1,fpCodes:[]]}]
      let transactionProducts = []; //[{Code,Quantity,UOM,shCode}]
      if (this.props.transactionData !== null) {
        transactionProducts = this.props.transactionData.products;
      }
      let activeBays = allBays.filter((bay) => bay.active === true);
      let filteredBays = activeBays.filter((bay) => {
        let shareholderMatchedArray = bay.shareholder.filter(
          (sh) =>
            transactionProducts.filter(
              (tpProduct) =>
                tpProduct.shCode === sh.shCode &&
                sh.fpCodes.filter((fp) => fp === tpProduct.code).length > 0
            ).length > 0
        );
        return shareholderMatchedArray.length > 0;
      });
      filteredBays.forEach((bay) => {
        options.push({ text: bay.bayCode, value: bay.bayCode });
      });
    } catch (error) {
      console.log("ModifySlotComposite-> error in getFilteredBays", error);
    }
    return options;
  }
  getModalContent() {
    //debugger;
    let slotModifyFields = this.props.slotModifyFields;
    let slotParameters = this.props.slotParameters;
    let slotInfo = this.props.slotInfo;

    if (!this.props.isRefreshing) {
      if (this.props.resultStatus.modify) {
        return (
          <TranslationConsumer>
            {(t) => (
              <div className="slotBookSuccess">
                <div>
                  <span className="slotDetailsSmallBoldSpan">
                    {t("Slot_Modify_Success")}
                  </span>
                </div>
                <div>
                  <span className="slotDetailssmallSpan">
                    {t("Slot_ReferenceNum")} :{" "}
                  </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {slotInfo.ReferenceNumber}
                  </span>
                </div>
                <div>
                  <span className="slotDetailssmallSpan">
                    {t("ViewShipmentTrailerStatus_Time")} :{" "}
                  </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {dayjs(slotInfo.StartTime)
                      .add(-1 * slotParameters.timeDifference, "minute")
                      .format("DD-MMM-YYYY HH:mm")}
                  </span>
                  <span className="slotDetailssmallSpan"> {t("To")} </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {dayjs(slotInfo.EndTime)
                      .add(-1 * slotParameters.timeDifference, "minute")
                      .format(
                        slotInfo.TransportationType ===
                          Constants.TransportationType.ROAD
                          ? "HH:mm"
                          : "DD-MMM-YYYY HH:mm"
                      )}
                  </span>
                </div>
                <div>
                  <span className="slotDetailssmallSpan">
                    {slotInfo.TransportationType ===
                    Constants.TransportationType.ROAD
                      ? t("BayGroupList_BayCode")
                      : t("LocationInfo_BerthCode")}{" "}
                    :{" "}
                  </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {slotInfo.LocationCode}
                  </span>
                </div>
                <div>
                  <span className="slotDetailssmallSpan">
                    {slotInfo.TransactionType.toString() ===
                    Constants.slotSource.SHIPMENT
                      ? t("Report_ShipmentCode")
                      : t("Receipt_Code")}{" "}
                    :{" "}
                  </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {slotInfo.TransactionCode}
                  </span>
                </div>
              </div>
            )}
          </TranslationConsumer>
        );
      } else if (this.props.resultStatus.cancel) {
        return (
          <TranslationConsumer>
            {(t) => (
              <div className="slotBookSuccess">
                <div>
                  <span className="slotDetailsSmallBoldSpan">
                    {t("Slot_Cancel_Success")}
                  </span>
                </div>
                <div>
                  <span className="slotDetailssmallSpan">
                    {t("Slot_ReferenceNum")} :{" "}
                  </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {slotInfo.ReferenceNumber}
                  </span>
                </div>

                <div>
                  <span className="slotDetailssmallSpan">
                    {slotInfo.TransportationType ===
                    Constants.TransportationType.ROAD
                      ? t("BayGroupList_BayCode")
                      : t("LocationInfo_BerthCode")}{" "}
                    :{" "}
                  </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {slotInfo.LocationCode}
                  </span>
                </div>
                <div>
                  <span className="slotDetailssmallSpan">
                    {slotInfo.TransactionType.toString() ===
                    Constants.slotSource.SHIPMENT
                      ? t("Report_ShipmentCode")
                      : t("Receipt_Code")}{" "}
                    :{" "}
                  </span>
                  <span className="slotDetailsSmallBoldSpan">
                    {slotInfo.TransactionCode}
                  </span>
                </div>
              </div>
            )}
          </TranslationConsumer>
        );
      }
      let disabled = dayjs()
        .add(slotParameters.minSlotChangeMinutes, "minute")
        .isBefore(dayjs(slotInfo.StartTime))
        ? false
        : true;
      return (
        <TranslationConsumer>
          {(t) => (
            <div className="slotCreateDiv ">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                  <DatePicker
                    fluid
                    value={slotModifyFields.slotTime.toDate()}
                    displayFormat={getCurrentDateFormat()}
                    label={t("Report_Date")}
                    showYearSelector="true"
                    onChange={(data) => this.props.onChange(data, "Date")}
                    onTextChange={(value, error) => {
                      this.props.onChange(value, "Date");
                    }}
                    disabled={disabled}
                    reserveSpace={false}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <Select
                    fluid
                    label={t("StartTime")}
                    value={slotModifyFields.slotTime.format("HH:mm")}
                    options={this.getSlotTimings()}
                    onChange={(data) => {
                      this.props.onChange(data, "Time");
                    }}
                    reserveSpace={false}
                    // error={this.errors}
                    disabled={disabled}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <Select
                    fluid
                    label={t("SlotDuration")}
                    value={slotModifyFields.slotDuration}
                    options={this.getDurations()}
                    reserveSpace={false}
                    onChange={(data) => {
                      this.props.onChange(data, "slotDuration");
                    }}
                    disabled={disabled}
                  />
                </div>

                <div className="col-12 col-md-12 col-lg-6">
                  <Select
                    fluid
                    label={
                      slotInfo.TransportationType ===
                      Constants.TransportationType.ROAD
                        ? t("BayGroupList_BayCode")
                        : t("LocationInfo_BerthCode")
                    }
                    value={slotModifyFields.bayCode}
                    options={this.getFilteredBays()}
                    onChange={(data) => {
                      this.props.onChange(data, "bayCode");
                    }}
                    reserveSpace={false}
                    disabled={disabled}
                  />
                </div>
                <div className="col-12 col-md-12 col-lg-6">
                  <Input
                    fluid
                    value={this.props.slotModifyFields.remarks}
                    onChange={(data) => this.props.onChange(data, "remarks")}
                    label={t("DriverInfo_Remarks")}
                    reserveSpace={false}
                    disabled={disabled}
                    indicator="required"
                  />
                </div>
              </div>

              {this.props.transactionData !== null ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <div>
                      <span className="icon-accept productAvailable"></span>
                      <span className="slotDetailssmallSpan">
                        {t("Product_Available")}
                      </span>
                    </div>
                    <div>
                      <span className="icon-denied noProduct"></span>
                      <span className="slotDetailssmallSpan">
                        {t("Product_not_available")}
                      </span>
                    </div>
                  </div>

                  <div className="slotModelSeparator">
                    <div style={{ width: "150px" }}>
                      <span className="slotDetailsSmallBoldSpan">
                        {t("productAllocation_Carrier")}
                      </span>
                      {" : "}
                      <span className="slotDetailssmallSpan">
                        {this.props.transactionData.carrier}
                      </span>
                    </div>
                    <div style={{ width: "150px" }}>
                      <span className="slotDetailsSmallBoldSpan">
                        {slotInfo.TransportationType ===
                        Constants.TransportationType.ROAD
                          ? t("ViewShipment_Vehicle")
                          : t("MarineShipmentList_Vessel")}
                      </span>
                      {" : "}
                      <span className="slotDetailssmallSpan">
                        {this.props.transactionData.vehicle}
                      </span>
                    </div>
                    <div style={{ width: "150px" }}>
                      <span className="slotDetailsSmallBoldSpan">
                        {slotInfo.TransportationType ===
                        Constants.TransportationType.ROAD
                          ? t("DriverInfo_Driver")
                          : t("ViewMarineShipmentList_Captain")}
                      </span>
                      {" : "}
                      <span className="slotDetailssmallSpan">
                        {this.props.transactionData.driver}
                      </span>
                    </div>
                  </div>
                  <div className="slotModelSeparator">
                    {this.getProductAvaiabilityList().map((product) => {
                      return (
                        <div style={{ width: "150px" }}>
                          <span
                            className={
                              product.isAvailable
                                ? "icon-accept productAvailable"
                                : "icon-denied noProduct"
                            }
                          ></span>
                          <span className={"slotDetailsSmallBoldSpan"}>
                            {product.code}
                          </span>
                          {" : "}
                          <span className="slotDetailssmallSpan">
                            {product.quantity}
                            {product.UOM}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.props.attributesList.length > 0
                ? this.props.attributesList.map((attribute) => (
                    <ErrorBoundary>
                      <Accordion>
                        <Accordion.Content
                          className="attributeAccordian"
                          title={t("Attributes_Header")}
                        >
                          <AttributeDetails
                            selectedAttributeList={
                              attribute.attributeMetaDataList
                            }
                            handleCellDataEdit={
                              this.props.onAttributeDataChange
                            }
                            attributeValidationErrors={
                              this.props.attributeValidationErrors
                            }
                          ></AttributeDetails>
                        </Accordion.Content>
                      </Accordion>
                    </ErrorBoundary>
                  ))
                : ""}
            </div>
          )}
        </TranslationConsumer>
      );
    } else {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    }
  }
  render() {
    let slotInfo = this.props.slotInfo;
    let disabled = false;
    if (slotInfo !== null && this.props.isRefreshing === false) {
      disabled = dayjs()
        .add(this.props.slotParameters.minSlotChangeMinutes, "minute")
        .isBefore(dayjs(slotInfo.StartTime))
        ? false
        : true;
    }
    // if (slotInfo !== null) console.log(slotInfo);
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal
            closeIcon={true}
            onClose={() => this.props.modelCloseEvent()}
            open={this.props.modelOpen}
            size="small"
            closeOnDimmerClick={false}
            className="createSlotModal"
          >
            <Modal.Header>
              {slotInfo === null ? (
                ""
              ) : (
                <div className="createSlotHeader">
                  <span>{slotInfo.TransactionCode}</span>
                  {slotInfo.TransportationType ===
                  Constants.TransportationType.ROAD
                    ? " - " + slotInfo.ShareholderCode
                    : ""}
                </div>
              )}
            </Modal.Header>
            <Modal.Content>
              <ErrorBoundary>{this.getModalContent()}</ErrorBoundary>
            </Modal.Content>
            <Modal.Footer className="modifySlotModalFooter">
              <ErrorBoundary>
                {slotInfo !== null &&
                this.props.isRefreshing === false &&
                disabled === false &&
                this.props.transactionData.status === "READY" &&
                this.props.resultStatus.modify === false &&
                this.props.resultStatus.cancel === false ? (
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {this.props.modifyAccess ? (
                        <Button
                          type="primary"
                          content={t("UOM_Update")}
                          onClick={() => this.props.onModify()}
                        />
                      ) : (
                        ""
                      )}
                      {this.props.cancelAccess ? (
                        <Button
                          type="primary"
                          content={t("SlotBook_Cancel")}
                          className="cancelButton"
                          onClick={() => this.props.onCancel()}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    {Array.isArray(this.props.validationErrors) &&
                    this.props.validationErrors.length > 0 ? (
                      <div className="below-text">
                        {" "}
                        <span className="ui error-message">
                          {t(this.props.validationErrors[0])}
                        </span>{" "}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </ErrorBoundary>
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }
}

export default ModifySlotComposite;
ModifySlotComposite.propTypes = {
  modelOpen: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  slotModifyFields: PropTypes.shape({
    slotTime: PropTypes.object.isRequired,
    bayCode: PropTypes.string.isRequired,
    slotDuration: PropTypes.number.isRequired,
    transactionCode: PropTypes.string,
    remarks: PropTypes.string,
  }).isRequired,
  slotInfo: PropTypes.object,

  transactionData: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        UOM: PropTypes.string.isRequired,
        shCode: PropTypes.string.isRequired,
      })
    ),
    driver: PropTypes.string,
    carrier: PropTypes.string.isRequired,
    vehicle: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  slotParameters: PropTypes.shape({
    slotStartTime: PropTypes.object.isRequired, //LocalTerminalTime
    slotEndTime: PropTypes.object.isRequired, //LocalTerminalTime
    slotDuration: PropTypes.number.isRequired,
    timeDifference: PropTypes.number.isRequired,
    minSlotMinutesToBook: PropTypes.number.isRequired,
    maxSlotDaysToBook: PropTypes.number.isRequired,
    minSlotChangeMinutes: PropTypes.number.isRequired,
    maxSlots: PropTypes.number.isRequired,
    terminalCode: PropTypes.string.isRequired,
  }).isRequired,
  modifyAccess: PropTypes.bool.isRequired,
  cancelAccess: PropTypes.bool.isRequired,
  bayList: PropTypes.array.isRequired,
  validationErrors: PropTypes.array.isRequired,
  attributesList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  resultStatus: PropTypes.shape({
    modify: PropTypes.bool.isRequired,
    cancel: PropTypes.bool.isRequired,
  }).isRequired,
  modelCloseEvent: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
};
