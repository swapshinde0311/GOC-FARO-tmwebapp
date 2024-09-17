import React, { Component } from "react";
import {
  Modal,
  Button,
  Select,
  Radio,
  InputLabel,
  Input,
  Accordion,
} from "@scuf/common";
import lodash from "lodash";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { LoadingPage } from "../../../UIBase/Common/LoadingPage";
import * as Constants from "../../../../JS/Constants";
//import { getCurrentDateFormat } from "../../../../JS/functionalUtilities";
import dayjs from "dayjs";
import * as Utilities from "../../../../JS/Utilities";
import ErrorBoundary from "../../../ErrorBoundary";
import { AttributeDetails } from "../../../UIBase/Details/AttributeDetails";

class CreateSlotComposite extends Component {
  state = {
    //open: this.props.open,
  };
  //errors = "";
  getSlotTimings() {
    //debugger;
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
      console.log("CreateSlotComposite-> error in getSlotTimings", error);
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
      console.log("CreateSlotComposite-> error in getDurations", error);
    }
    return options;
  }
  getProductAvaiabilityList() {
    let productsList = []; ////{Code,Quantity,UOM,shCode,isAvailable}
    try {
      let bayProducts = []; //[shCode:Sh1,fpCodes:[]]
      let filteredBays = this.props.bayList.filter(
        (bay) => bay.bayCode === this.props.slotCreateFields.bayCode
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
        "CreateSlotComposite-> error in getProductAvaiabilityList",
        error
      );
    }
    return productsList;
  }
  getModalContent() {
    //debugger;
    let slotCreateFields = this.props.slotCreateFields;
    let slotParameters = this.props.slotParameters;
    // this.errors = dayjs()
    //   .add(slotParameters.minSlotMinutesToBook, "minute")
    //   .isBefore(
    //     slotCreateFields.slotTime.add(slotParameters.timeDifference, "minute")
    //   )
    //   ? ""
    //   : "invalid time for booking";
    if (!this.props.isRefreshing) {
      if (this.props.slotInfo !== null) {
        let slotInfo = this.props.slotInfo;
        return (
          <TranslationConsumer>
            {(t) => (
              <div className="slotBookSuccess">
                <div>
                  <span className="icon-accept productAvailable"></span>
                  <span className="slotDetailsSmallBoldSpan">
                    {t("Booking_Success")}
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
                        this.props.transportationType ===
                          Constants.TransportationType.ROAD
                          ? "HH:mm"
                          : "DD-MMM-YYYY HH:mm"
                      )}
                  </span>
                </div>
                <div>
                  <span className="slotDetailssmallSpan">
                    {this.props.transportationType ===
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
      } else {
        return (
          <TranslationConsumer>
            {(t) => (
              <div className="slotCreateDiv ">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-12 col-lg-12">
                    <span>
                      {this.props.transportationType ===
                      Constants.TransportationType.ROAD
                        ? t("BayGroupList_BayCode")
                        : t("LocationInfo_BerthCode")}
                    </span>
                    {": "}
                    <span>{slotCreateFields.bayCode}</span>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <InputLabel fluid label={t("Report_Date")} />
                    <InputLabel
                      fluid
                      label={slotCreateFields.slotTime.format("DD-MMM-YYYY")}
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    {/* <div style={{ width: "49%" }}> */}
                    <Select
                      fluid
                      label={t("StartTime")}
                      value={slotCreateFields.slotTime.format("HH:mm")}
                      options={this.getSlotTimings()}
                      onChange={(data) => {
                        this.props.onChange(data, "Time");
                      }}
                      reserveSpace={false}
                      // error={this.errors}
                      //noResultsMessage={t("noResultsMessage")}
                    />
                  </div>
                  <div className="col-12  col-sm-6 col-md-4 col-lg-4">
                    <Select
                      fluid
                      label={t("SlotDuration")}
                      value={slotCreateFields.slotDuration}
                      options={this.getDurations()}
                      reserveSpace={false}
                      onChange={(data) => {
                        this.props.onChange(data, "slotDuration");
                      }}
                    />
                  </div>
                  {this.props.transportationType ===
                  Constants.TransportationType.ROAD ? (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                      <Select
                        fluid
                        label={t("Header_Shareholder")}
                        value={slotCreateFields.shareholder}
                        options={this.props.shareholders}
                        onChange={(data) => {
                          this.props.onChange(data, "shareholder");
                        }}
                        reserveSpace={false}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {this.props.transportationType ===
                    Constants.TransportationType.ROAD &&
                  slotCreateFields.slotSource !==
                    Constants.slotSource.RECEIPT ? (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                      <div>
                        <Radio
                          label={t("Default_lblShipment")}
                          name="RadioGroup"
                          checked={
                            slotCreateFields.slotSource ===
                            Constants.slotSource.SHIPMENT
                          }
                          onChange={() => {
                            this.props.onChange(
                              Constants.slotSource.SHIPMENT,
                              "slotSource"
                            );
                          }}
                        />
                        <Radio
                          label={t("FeatureConfig_TrckOrder")}
                          name="RadioGroup"
                          checked={
                            slotCreateFields.slotSource ===
                            Constants.slotSource.ORDER
                          }
                          onChange={() => {
                            this.props.onChange(
                              Constants.slotSource.ORDER,
                              "slotSource"
                            );
                          }}
                        />
                        <Radio
                          label={t("FeatureConfig_TrckCon")}
                          name="RadioGroup"
                          checked={
                            slotCreateFields.slotSource ===
                            Constants.slotSource.CONTRACT
                          }
                          onChange={() => {
                            this.props.onChange(
                              Constants.slotSource.CONTRACT,
                              "slotSource"
                            );
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.props.transportationType ===
                    Constants.TransportationType.ROAD &&
                  slotCreateFields.slotSource === Constants.slotSource.ORDER ? (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                      <Select
                        fluid
                        label={t("ShipmentOrder_OrderCode")}
                        value={this.props.slotCreateFields.orderCode}
                        options={Utilities.transferListtoOptions(
                          this.props.slotCreateOptions.filteredorders
                        )}
                        onSearch={(query) =>
                          this.props.onSearchChange(query, "orders")
                        }
                        onChange={(data) => {
                          this.props.onChange(data, "orderCode");
                        }}
                        reserveSpace={false}
                        search={true}
                        noResultsMessage={t("noResultsMessage")}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {this.props.transportationType ===
                    Constants.TransportationType.ROAD &&
                  slotCreateFields.slotSource ===
                    Constants.slotSource.CONTRACT ? (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                      <Select
                        fluid
                        label={t("ContractInfo_ContractCode")}
                        value={this.props.slotCreateFields.contractCode}
                        options={Utilities.transferListtoOptions(
                          this.props.slotCreateOptions.filteredcontracts
                        )}
                        onSearch={(query) =>
                          this.props.onSearchChange(query, "contracts")
                        }
                        onChange={(data) => {
                          this.props.onChange(data, "contractCode");
                        }}
                        reserveSpace={false}
                        search={true}
                        noResultsMessage={t("noResultsMessage")}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {slotCreateFields.slotSource ===
                    Constants.slotSource.SHIPMENT ||
                  (slotCreateFields.slotSource === Constants.slotSource.ORDER &&
                    slotCreateFields.orderCode !== "") ||
                  (slotCreateFields.slotSource ===
                    Constants.slotSource.CONTRACT &&
                    slotCreateFields.contractCode !== "") ? (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                      <Select
                        fluid
                        label={t("Report_ShipmentCode")}
                        value={this.props.slotCreateFields.shipmentCode}
                        options={Utilities.transferListtoOptions(
                          this.props.slotCreateOptions.filteredshipments
                        )}
                        onChange={(data) => {
                          this.props.onChange(data, "shipmentCode");
                        }}
                        reserveSpace={false}
                        onSearch={(query) =>
                          this.props.onSearchChange(query, "shipments")
                        }
                        search={true}
                        noResultsMessage={t("noResultsMessage")}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {slotCreateFields.slotSource ===
                  Constants.slotSource.RECEIPT ? (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                      <Select
                        fluid
                        label={t("Receipt_Code")}
                        value={this.props.slotCreateFields.receiptCode}
                        options={Utilities.transferListtoOptions(
                          this.props.slotCreateOptions.filteredreceipts
                        )}
                        onSearch={(query) =>
                          this.props.onSearchChange(query, "receipts")
                        }
                        onChange={(data) => {
                          this.props.onChange(data, "receiptCode");
                        }}
                        reserveSpace={false}
                        search={true}
                        noResultsMessage={t("noResultsMessage")}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="col-12  col-sm-6 col-md-6 col-lg-6">
                    <Input
                      fluid
                      value={this.props.slotCreateFields.remarks}
                      onChange={(data) => this.props.onChange(data, "remarks")}
                      label={t("DriverInfo_Remarks")}
                      reserveSpace={false}
                    />
                  </div>
                </div>

                {this.props.slotCreateFields.receiptCode !== "" ||
                this.props.slotCreateFields.shipmentCode !== "" ? (
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
                          {this.props.transportationType ===
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
                          {this.props.transportationType ===
                          Constants.TransportationType.ROAD
                            ? t("DriverInfo_Driver")
                            : t("ViewMarineShipmentList_Captain")}{" "}
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
      }
    } else {
      return <LoadingPage loadingClass="nestedList" message=""></LoadingPage>;
    }
  }

  render() {
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
              <div className="createSlotHeader">
                <span>{this.props.slotParameters.terminalCode}</span> -{" "}
                <span>{this.props.transportationType}</span>
              </div>
            </Modal.Header>
            <Modal.Content>
              <ErrorBoundary> {this.getModalContent()}</ErrorBoundary>
            </Modal.Content>
            <Modal.Footer className="createSlotModalFooter">
              <ErrorBoundary>
                {(this.props.slotCreateFields.shipmentCode !== "" ||
                  this.props.slotCreateFields.receiptCode !== "") &&
                this.props.isRefreshing === false &&
                this.props.transactionData.status === "READY" &&
                this.props.slotInfo === null ? (
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="primary"
                        content={t("SlotBook_Book")}
                        onClick={() => this.props.onBook()}
                      />
                    </div>

                    {Array.isArray(this.props.validationErrors) &&
                    this.props.validationErrors.length > 0 ? (
                      <div className="below-text">
                        <span className="ui error-message">
                          {t(this.props.validationErrors[0])}
                        </span>
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

export default CreateSlotComposite;
CreateSlotComposite.propTypes = {
  modelOpen: PropTypes.bool.isRequired,
  slotCreateFields: PropTypes.shape({
    transactionType: PropTypes.string.isRequired,
    slotTime: PropTypes.object.isRequired,
    bayCode: PropTypes.string.isRequired,
    slotDuration: PropTypes.number.isRequired,
    slotSource: PropTypes.string.isRequired,
    shareholder: PropTypes.string,
    orderCode: PropTypes.string,
    contractCode: PropTypes.string,
    shipmentCode: PropTypes.string,
    receiptCode: PropTypes.string,
    remarks: PropTypes.string,
  }).isRequired,
  shareholders: PropTypes.array,
  slotInfo: PropTypes.object,
  slotCreateOptions: PropTypes.shape({
    orders: PropTypes.array.isRequired,
    filteredorders: PropTypes.array.isRequired,
    contracts: PropTypes.array.isRequired,
    filteredcontracts: PropTypes.array.isRequired,
    shipments: PropTypes.array.isRequired,
    filteredshipments: PropTypes.array.isRequired,
    receipts: PropTypes.array.isRequired,
    filteredreceipts: PropTypes.array.isRequired,
  }).isRequired,
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
  isRefreshing: PropTypes.bool.isRequired,
  transportationType: PropTypes.string.isRequired,
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
  bayList: PropTypes.array.isRequired,
  validationErrors: PropTypes.array.isRequired,
  attributesList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  transactionType: PropTypes.string,
  modelCloseEvent: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onBook: PropTypes.func.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
};
