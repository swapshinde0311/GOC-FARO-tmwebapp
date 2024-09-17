import React, { Component } from "react";
import { Tree, Icon, Tooltip, Button } from "@scuf/common";
import { connect } from "react-redux";
import LocationDetailsComposite from "../../Details/LocationDetailsComposite";
import { SidebarLayout } from "@scuf/common";
import { Tab } from "@scuf/common";
import NotifyEvent from "../../../../JS/NotifyEvent";
import DeviceDetailsComposite from "../../Details/DeviceDetailsComposite";
import GantryDeatilsComposite from "../../Details/GantryDeatilsComposite";
import * as Constants from "../../../../JS/Constants";
import * as RestAPIs from "../../../../JS/RestApis";
import * as Utilities from "../../../../JS/Utilities";
import * as KeyCodes from "../../../../JS/KeyCodes";
import axios from "axios";
import lodash from "lodash";
import ErrorBoundary from "../../../ErrorBoundary";
import { TranslationConsumer } from "@scuf/localization";
import { toast } from "react-toastify";
import LoadingArmDetailsComposite from "../../Details/LoadingArmDetailsComposite";
import IslandDetailsComposite from "../../Details/IslandDetailsComposite";
import BayDetailsComposite from "../../Details/BayDetailsComposite";
import MeterDetailsComposite from "../../Details/MeterDetailsComposite";
import "../../../../CSS/iconStyles.css";
import { getKeyByValue } from "../../../../JS/Utilities";

const Item = Tree.Content.Item;

class SiteTreeView extends Component {
  state = {
    isLoading: false,
    isChildLoadDevice: false,
    isLoadingMeter: false,
    isLoadingArm: false,
    terminalList: [],
    bcuDeviceList: [],
    locationCode: "",
    isClone: false,
    locationType: "",
    deviceType: "",
    selectedLocationCode: "",
    selectedDeviceCode: "",
    deviceCode: "",
    loadingArmCode: "",
    deviceModel: "",
    parentCode: "",
    meterLineType: "",
    siteExpandedItems: [],
    bcuExpandedItems: [],
  };
  getBCUTreeView(deviceCode) {
    try {
      var keyCode = [
        {
          key: KeyCodes.siteViewType,
          value: Constants.siteViewType.ROAD_BCUVIEW,
        },
        {
          key: KeyCodes.bcuCode,
          value: deviceCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.selectedTerminal,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.siteViewType,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetBCUViewTree,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          ) {
            this.setState({
              isReadyToRender: true,
              bcuDeviceList: lodash.cloneDeep(result.EntityResult),
            });
          }
        } else {
          this.setState({
            isReadyToRender: false,
            bcuDeviceList: [],
          });
        }
      });
    } catch (error) {
      console.log("SiteTreeView:Error occured in getBCUTreeView", error);
    }
  }

  setTitle(locationCode, locationType, parentCode) {
    this.setState({
      isLoading: true,
      isChildLoadDevice: false,
      isLoadingArm: false,
      isLoadingMeter: false,
      locationCode: locationCode,
      isClone: false,
      locationType: locationType,
      selectedLocationCode: locationCode,
      parentCode: parentCode,
    });
  }

  setArmTitle(loadingArmCode) {
    this.setState({
      isLoading: false,
      isChildLoadDevice: false,
      isLoadingArm: true,
      isLoadingMeter: false,
      isClone: false,
      loadingArmCode: loadingArmCode,
    });
  }

  setMeterTitle(meterCode, meterLineType, parentCode) {
    this.setState({
      isLoading: false,
      isChildLoadDevice: false,
      isLoadingArm: false,
      isLoadingMeter: true,
      isClone: false,
      meterCode: meterCode,
      meterLineType: meterLineType,
      parentCode: parentCode,
    });
  }

  childComponent(deviceCode, deviceType, deviceModel) {
    this.setState(
      {
        isChildLoadDevice: false,
        deviceType: deviceType,
        deviceModel: deviceModel,
        deviceCode: deviceCode,
        selectedDeviceCode: deviceCode,
        isReadyToRender: false,
      },
      () => {
        this.setState({
          isChildLoadDevice: true,
          isLoading: false,
          isLoadingArm: false,
          isLoadingMeter: false,
          isReadyToRender: true,
        });
      }
    );
    if (deviceCode !== undefined) {
      this.getBCUTreeView(deviceCode);
    }
  }

  parentComponentClick() {
    this.setState({
      isChildLoadDevice: false,
      isLoading: false,
      isLoadingArm: false,
      isLoadingMeter: false,
    });
  }

  isAddClick(locationCode, locationType, parentCode) {
    this.setState({
      isLoading: true,
      isClone: true,
      locationType: locationType,
      locationCode: locationCode,
      parentCode: parentCode,
    });
  }
  isNewClick(code) {
    this.setState({
      isLoading: false,
      isChildLoadDevice: false,
      isLoadingArm: true,
      isLoadingMeter: false,
      isClone: true,
      loadingArmCode: code,
    });
  }
  isNewMeterClick(code, meterLineType, parentCode) {
    this.setState({
      isLoading: false,
      isChildLoadDevice: false,
      isLoadingArm: false,
      isLoadingMeter: true,
      isClone: true,
      meterCode: code,
      meterLineType: meterLineType,
      parentCode: parentCode,
    });
  }
  buildDevices(deviceList) {
    try {
      return deviceList.map(
        (myList) =>
          myList.DeviceCode.length > 8 ? (
            // <div>
            <Tooltip
              content={myList.DeviceCode}
              element={
                <Item
                  icon={
                    <span
                      style={{
                        fontSize: "24px",
                        marginRight: "6px",
                        // color:
                        //   myList.Active !== null && myList.Active
                        //     ? "#000000"
                        //     : "#ff0000",
                      }}
                      className={
                        (myList.Active !== null && myList.Active
                          ? ""
                          : "redIcon ") +
                        (myList.DeviceType ===
                          Constants.deviceTypeCode.WEIGH_BRIDGE
                          ? "icon-Weigh-Bridge"
                          : "icon-" +
                          getKeyByValue(
                            Constants.deviceTypeCode,
                            myList.DeviceType
                          ))
                      }
                    ></span>
                  }
                  title={this.getSelectedDeviceCode(myList.DeviceCode)}
                  onTitleClick={() =>
                    this.childComponent(
                      myList.DeviceCode,
                      myList.DeviceType,
                      myList.DeviceModel
                    )
                  }
                />
              }
              position="bottom right"
              size="mini"
              hoverable={true}
            />
          ) : (
            <Item
              icon={
                <span
                  style={{
                    fontSize: "24px",
                    marginRight: "6px",
                    // color:
                    //   myList.Active !== null && myList.Active
                    //     ? "#000000"
                    //     : "#ff0000",
                  }}
                  className={
                    (myList.Active !== null && myList.Active
                      ? ""
                      : "redIcon ") +
                    (myList.DeviceType === Constants.deviceTypeCode.WEIGH_BRIDGE
                      ? "icon-Weigh-Bridge"
                      : "icon-" +
                      getKeyByValue(
                        Constants.deviceTypeCode,
                        myList.DeviceType
                      ))
                  }
                ></span>
              }
              title={this.getSelectedDeviceCode(myList.DeviceCode)}
              onTitleClick={() =>
                this.childComponent(
                  myList.DeviceCode,
                  myList.DeviceType,
                  myList.DeviceModel
                )
              }
            />
          )
        // </div>
      );
    } catch (error) {
      console.log("SiteViewTree: Error occured in buildDevices");
    }
  }
  getSelectedDeviceCode(deviceCode) {
    try {
      if (this.state.selectedDeviceCode === deviceCode) {
        if (deviceCode.length > 8)
          return (
            <span className="active">{deviceCode.substring(0, 8) + "..."}</span>
          );
        else return <span className="active">{deviceCode}</span>;
      } else {
        if (deviceCode.length > 8)
          return <span>{deviceCode.substring(0, 8) + "..."}</span>;
        else return <span>{deviceCode}</span>;
      }
    } catch (error) {
      console.log("SiteViewTree: Error occured in getSelectedDeviceCode");
    }
  }
  getSelectedLocationCode(locationCode) {
    try {
      if (this.state.selectedLocationCode === locationCode) {
        if (locationCode.length > 8)
          return (
            <span className="active">
              {locationCode.substring(0, 8) + "..."}
            </span>
          );
        else return <span className="active">{locationCode}</span>;
      } else {
        if (locationCode.length > 8)
          return <span>{locationCode.substring(0, 8) + "..."}</span>;
        else return <span>{locationCode}</span>;
      }
    } catch (error) {
      console.log("SiteViewTree: Error occured in getSelectedLocatioCode");
    }
  }
  getLocalisedTooltip(data) {
    return (
      <TranslationConsumer>
        {(t) => <span> {t(data)}</span>}
      </TranslationConsumer>
    );
  }

  buildTree(locationlist) {
    try {
      return locationlist.LocationCode.length > 8 ? (
        // <div>
        <Tooltip
          content={locationlist.LocationCode}
          element={
            <Item
              onClick={() =>
                this.handleMenuExpandCollapse(locationlist.LocationCode)
              }
              icon={
                <span
                  style={{
                    fontSize: "24px",
                    marginRight: "6px",
                    // color:
                    //   locationlist.Active !== null && locationlist.Active
                    //     ? "#000000"
                    //     : "#ff0000",
                  }}
                  className={
                    (locationlist.Active !== null && locationlist.Active
                      ? ""
                      : "redIcon ") +
                    (locationlist.LocationType ===
                      Constants.siteViewLocationType.ISLAND
                      ? "icon-Island"
                      : locationlist.LocationType === "MarineBay"
                        ? "icon-Berth"
                        : "icon-Bay")
                  }
                ></span>
              }
              title={this.getSelectedLocationCode(locationlist.LocationCode)}
              actionRenderer={
                <Tooltip
                  content={this.getLocalisedTooltip("Siteview_New")}
                  position="bottom left"
                  size="mini"
                  element={
                    <Icon
                      root="common"
                      name="duplicate"
                      size="medium"
                      onClick={(e) =>
                        this.isAddClick(
                          locationlist.LocationCode,
                          locationlist.LocationType,
                          locationlist.AssociatedLocationCode
                        )
                      }
                    />
                  }
                />
              }
              expanded={this.state.siteExpandedItems.includes(
                locationlist.LocationCode
              )}
              // expanded={true}
              onTitleClick={() =>
                this.setTitle(
                  locationlist.LocationCode,
                  locationlist.LocationType,
                  locationlist.AssociatedLocationCode
                )
              }
            >
              {locationlist.AssociatedLocationsList.length > 0 &&
                locationlist.AssociatedDevices.length > 0 ? (
                this.buildIslandTree(locationlist)
              ) : locationlist.LocationType ===
                Constants.siteViewLocationType.ISLAND &&
                locationlist.AssociatedDevices.length > 0 ? (
                this.buildIslandTree(locationlist)
              ) : locationlist.AssociatedLocationsList.length > 0 ? (
                locationlist.AssociatedLocationsList.map((ascLocation) =>
                  this.buildTree(ascLocation)
                )
              ) : locationlist.AssociatedDevices.length > 0 ? (
                this.buildDevices(locationlist.AssociatedDevices)
              ) : locationlist.LocationType ===
                Constants.siteViewLocationType.ISLAND ? (
                <TranslationConsumer>
                  {(t) => (
                    <Button
                      type="secondary"
                      className="dotted-botton"
                      content={t("SiteView_AddBay")}
                      onClick={() =>
                        this.isAddClick(
                          "",
                          Constants.siteViewLocationType.BAY,
                          locationlist.LocationCode
                        )
                      }
                    ></Button>
                  )}
                </TranslationConsumer>
              ) : (
                <TranslationConsumer>
                  {(t) => (
                    <Button
                      type="secondary"
                      className="dotted-botton"
                      content={t("SiteView_AddIsland")}
                      onClick={() =>
                        this.isAddClick(
                          "",
                          Constants.siteViewLocationType.ISLAND,
                          locationlist.LocationCode
                        )
                      }
                    ></Button>
                  )}
                </TranslationConsumer>
              )}
            </Item>
          }
          position="top right"
          size="mini"
          hoverable={true}
        />
      ) : (
        <Item
          onClick={() =>
            this.handleMenuExpandCollapse(locationlist.LocationCode)
          }
          icon={
            <span
              style={{
                fontSize: "24px",
                marginRight: "6px",
                // color:
                //   locationlist.Active !== null && locationlist.Active
                //     ? "#000000"
                //     : "#ff0000",
              }}
              className={
                (locationlist.Active !== null && locationlist.Active
                  ? ""
                  : "redIcon ") +
                (locationlist.LocationType ===
                  Constants.siteViewLocationType.ISLAND
                  ? "icon-Island"
                  : locationlist.LocationType === "MarineBay"
                    ? "icon-Berth"
                    : "icon-Bay")
              }
            ></span>
          }
          title={this.getSelectedLocationCode(locationlist.LocationCode)}
          actionRenderer={
            <Tooltip
              content={this.getLocalisedTooltip("Siteview_New")}
              position="bottom left"
              size="mini"
              element={
                <Icon
                  root="common"
                  name="duplicate"
                  size="medium"
                  onClick={(e) =>
                    this.isAddClick(
                      locationlist.LocationCode,
                      locationlist.LocationType,
                      locationlist.AssociatedLocationCode
                    )
                  }
                />
              }
            />
          }
          expanded={this.state.siteExpandedItems.includes(
            locationlist.LocationCode
          )}
          // expanded={true}
          onTitleClick={() =>
            this.setTitle(
              locationlist.LocationCode,
              locationlist.LocationType,
              locationlist.AssociatedLocationCode
            )
          }
        >
          {locationlist.AssociatedLocationsList.length > 0 &&
            locationlist.AssociatedDevices.length > 0 ? (
            this.buildIslandTree(locationlist)
          ) : locationlist.LocationType ===
            Constants.siteViewLocationType.ISLAND &&
            locationlist.AssociatedDevices.length > 0 ? (
            this.buildIslandTree(locationlist)
          ) : locationlist.AssociatedLocationsList.length > 0 ? (
            locationlist.AssociatedLocationsList.map((ascLocation) =>
              this.buildTree(ascLocation)
            )
          ) : locationlist.AssociatedDevices.length > 0 ? (
            this.buildDevices(locationlist.AssociatedDevices)
          ) : locationlist.LocationType ===
            Constants.siteViewLocationType.ISLAND ? (
            <TranslationConsumer>
              {(t) => (
                <Button
                  type="secondary"
                  className="dotted-botton"
                  content={t("SiteView_AddBay")}
                  onClick={() =>
                    this.isAddClick(
                      "",
                      Constants.siteViewLocationType.BAY,
                      locationlist.LocationCode
                    )
                  }
                ></Button>
              )}
            </TranslationConsumer>
          ) : (
            <TranslationConsumer>
              {(t) => (
                <Button
                  type="secondary"
                  className="dotted-botton"
                  content={t("SiteView_AddIsland")}
                  onClick={() =>
                    this.isAddClick(
                      "",
                      Constants.siteViewLocationType.ISLAND,
                      locationlist.LocationCode
                    )
                  }
                ></Button>
              )}
            </TranslationConsumer>
          )}
        </Item>
      );
    } catch (error) {
      console.log("SiteViewTree: Error occured in buildTree");
    }
  }
  buildIslandTree(locationlist) {
    let lll = [];
    try {
      lll.push(this.buildDevices(locationlist.AssociatedDevices));
      locationlist.AssociatedLocationsList.length > 0
        ? lll.push(
          locationlist.AssociatedLocationsList.map((ascLocation) =>
            this.buildTree(ascLocation)
          )
        )
        : lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddBay")}
                onClick={() =>
                  this.isAddClick(
                    "",
                    Constants.siteViewLocationType.BAY,
                    locationlist.LocationCode
                  )
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      return lll;
    } catch (error) {
      console.log("SiteViewTree: Error occured in buildIslandTree");
    }
  }
  handleMenuExpandCollapse = (data) => {
    let siteExpandedItems = this.state.siteExpandedItems;
    if (siteExpandedItems.includes(data)) {
      let index = siteExpandedItems.findIndex((item) => item === data);
      //Remove from this array
      siteExpandedItems.splice(index, 1);
    } else {
      //add the item
      siteExpandedItems.push(data);
    }
    //set the state
    this.setState({ siteExpandedItems });
  };
  handleLocationTree(items) {
    let lll = [];
    let avLocations = [];
    items.forEach((locationlist) => {
      var locationType = locationlist.LocationType.replace(/ /g, "");
      avLocations.push(locationlist);
      if (locationlist.LocationCode !== null) {
        lll.push(
          locationlist.LocationCode.length > 8 ? (
            <Tooltip
              content={locationlist.LocationCode}
              element={
                <Item
                  onClick={() =>
                    this.handleMenuExpandCollapse(locationlist.LocationCode)
                  }
                  icon={
                    <span
                      style={{
                        fontSize: "24px",
                        marginRight: "6px",
                        // color:
                        //   locationlist.Active !== null && locationlist.Active
                        //     ? "#000000"
                        //     : "#ff0000",
                      }}
                      className={
                        (locationlist.Active !== null && locationlist.Active
                          ? ""
                          : "redIcon ") +
                        "icon-" +
                        locationType
                      }
                    ></span>
                  }
                  title={this.getSelectedLocationCode(
                    locationlist.LocationCode
                  )}
                  actionRenderer={
                    <Tooltip
                      content={this.getLocalisedTooltip("Siteview_New")}
                      position="bottom left"
                      size="mini"
                      element={
                        <Icon
                          root="common"
                          name="duplicate"
                          size="medium"
                          onClick={(e) =>
                            this.isAddClick(
                              locationlist.LocationCode,
                              locationlist.LocationType,
                              locationlist.AssociatedLocationCode
                            )
                          }
                        />
                      }
                    />
                  }
                  expanded={this.state.siteExpandedItems.includes(
                    locationlist.LocationCode
                  )}
                  // expanded={true}
                  onTitleClick={() =>
                    this.setTitle(
                      locationlist.LocationCode,
                      locationlist.LocationType,
                      locationlist.AssociatedLocationCode
                    )
                  }
                >
                  {locationlist.AssociatedLocationsList.length > 0 ? (
                    locationlist.AssociatedLocationsList.map((ascLocation) =>
                      this.buildTree(ascLocation)
                    )
                  ) : locationlist.AssociatedDevices.length > 0 ? (
                    this.buildDevices(locationlist.AssociatedDevices)
                  ) : locationlist.LocationType ===
                    Constants.siteViewLocationType.ISLAND ? (
                    <TranslationConsumer>
                      {(t) => (
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddBay")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.BAY,
                              locationlist.LocationCode
                            )
                          }
                        ></Button>
                      )}
                    </TranslationConsumer>
                  ) : locationlist.LocationType ===
                    Constants.siteViewLocationType.SPUR ? (
                    <TranslationConsumer>
                      {(t) => (
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("LocationInfo_AddCluster")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.CLUSTER,
                              locationlist.LocationCode
                            )
                          }
                        ></Button>
                      )}
                    </TranslationConsumer>
                  ) : (
                    <TranslationConsumer>
                      {(t) => (
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddIsland")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.ISLAND,
                              locationlist.LocationCode
                            )
                          }
                        ></Button>
                      )}
                    </TranslationConsumer>
                  )}
                </Item>
              }
              position="top right"
              size="mini"
              hoverable={true}
            />
          ) : (
            <Item
              onClick={() =>
                this.handleMenuExpandCollapse(locationlist.LocationCode)
              }
              icon={
                <span
                  style={{
                    fontSize: "24px",
                    marginRight: "6px",
                    // color:
                    //   locationlist.Active !== null && locationlist.Active
                    //     ? "#000000"
                    //     : "#ff0000",
                  }}
                  className={
                    (locationlist.Active !== null && locationlist.Active
                      ? ""
                      : "redIcon ") +
                    (locationlist.LocationType === "MarineBay"
                      ? "icon-Berth"
                      : "icon-" + locationType)
                  }
                ></span>
              }
              title={this.getSelectedLocationCode(locationlist.LocationCode)}
              actionRenderer={
                <Tooltip
                  content={this.getLocalisedTooltip("Siteview_New")}
                  position="bottom left"
                  size="mini"
                  element={
                    <Icon
                      root="common"
                      name="duplicate"
                      size="medium"
                      onClick={(e) =>
                        this.isAddClick(
                          locationlist.LocationCode,
                          locationlist.LocationType,
                          locationlist.AssociatedLocationCode
                        )
                      }
                    />
                  }
                />
              }
              expanded={this.state.siteExpandedItems.includes(
                locationlist.LocationCode
              )}
              // expanded={true}
              onTitleClick={() =>
                this.setTitle(
                  locationlist.LocationCode,
                  locationlist.LocationType,
                  locationlist.AssociatedLocationCode
                )
              }
            >
              {locationlist.AssociatedLocationsList.length > 0 ? (
                locationlist.AssociatedLocationsList.map((ascLocation) =>
                  this.buildTree(ascLocation)
                )
              ) : locationlist.AssociatedDevices.length > 0 ? (
                this.buildDevices(locationlist.AssociatedDevices)
              ) : locationlist.LocationType ===
                Constants.siteViewLocationType.ISLAND ? (
                <TranslationConsumer>
                  {(t) => (
                    <Button
                      type="secondary"
                      className="dotted-botton"
                      content={t("SiteView_AddBay")}
                      onClick={() =>
                        this.isAddClick(
                          "",
                          Constants.siteViewLocationType.BAY,
                          locationlist.LocationCode
                        )
                      }
                    ></Button>
                  )}
                </TranslationConsumer>
              ) : locationlist.LocationType ===
                Constants.siteViewLocationType.SPUR ? (
                <TranslationConsumer>
                  {(t) => (
                    <Button
                      type="secondary"
                      className="dotted-botton"
                      content={t("LocationInfo_AddCluster")}
                      onClick={() =>
                        this.isAddClick(
                          "",
                          Constants.siteViewLocationType.CLUSTER,
                          locationlist.LocationCode
                        )
                      }
                    ></Button>
                  )}
                </TranslationConsumer>
              ) : (
                <TranslationConsumer>
                  {(t) => (
                    <Button
                      type="secondary"
                      className="dotted-botton"
                      content={t("SiteView_AddIsland")}
                      onClick={() =>
                        this.isAddClick(
                          "",
                          Constants.siteViewLocationType.ISLAND,
                          locationlist.LocationCode
                        )
                      }
                    ></Button>
                  )}
                </TranslationConsumer>
              )}
            </Item>
          )
        );
      }
      if (
        locationlist.LocationType === "EntryGate" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddEntryGate")}
                onClick={() =>
                  this.isAddClick("", Constants.siteViewLocationType.ENTRYGATE)
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "Bay" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddGantry")}
                onClick={() =>
                  this.isAddClick("", Constants.siteViewLocationType.GANTRY)
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "ExitGate" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddExitGate")}
                onClick={() =>
                  this.isAddClick("", Constants.siteViewLocationType.EXITGATE)
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "ReportingOffice" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddReportingOffice")}
                onClick={() =>
                  this.isAddClick(
                    "",
                    Constants.siteViewLocationType.REPORTINGOFFICE
                  )
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "BOLOffice" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddBOLOffice")}
                onClick={() =>
                  this.isAddClick("", Constants.siteViewLocationType.BOLOFFICE)
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "MarineBay" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("LocationInfo_AddBerth")}
                onClick={() => this.isAddClick("", locationlist.LocationType)}
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "RailEntryGate" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddRailEntryGate")}
                onClick={() =>
                  this.isAddClick(
                    "",
                    Constants.siteViewLocationType.RAILENTRYGATE
                  )
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "RailExitGate" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddRailExitGate")}
                onClick={() =>
                  this.isAddClick(
                    "",
                    Constants.siteViewLocationType.RAILEXITGATE
                  )
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "RailLoadingArea" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("SiteView_AddSpur")}
                onClick={() =>
                  this.isAddClick("", Constants.siteViewLocationType.SPUR)
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
      if (
        locationlist.LocationType === "Cluster" &&
        locationlist.LocationCode === null
      )
        lll.push(
          <TranslationConsumer>
            {(t) => (
              <Button
                type="secondary"
                className="dotted-botton"
                content={t("LocationInfo_AddCluster")}
                onClick={() =>
                  this.isAddClick("", Constants.siteViewLocationType.CLUSTER)
                }
              ></Button>
            )}
          </TranslationConsumer>
        );
    });
    return lll;
  }
  buildBcuTree(associatedArmsList) {
    try {
      return associatedArmsList.length > 0 ? (
        associatedArmsList.map((armsList) =>
          armsList.Code.length > 8 ? (
            <Tooltip
              content={armsList.Code}
              element={
                <Item
                  icon={
                    <span
                      style={{
                        fontSize: "24px",
                        marginRight: "6px",
                        // color:
                        //   armsList.Status !== null && armsList.Status
                        //     ? "#000000"
                        //     : "#ff0000",
                      }}
                      className={
                        (armsList.Status !== null && armsList.Status
                          ? ""
                          : "redIcon ") + "icon-LoadingArm"
                      }
                    ></span>
                  }
                  title={armsList.Code.substring(0, 8) + "..."}
                  actionRenderer={
                    <Tooltip
                      content={this.getLocalisedTooltip("Siteview_New")}
                      position="bottom left"
                      size="mini"
                      element={
                        <Icon
                          root="common"
                          name="duplicate"
                          size="medium"
                          onClick={(e) => this.isNewClick(armsList.Code)}
                        />
                      }
                    />
                  }
                  expanded={true}
                  onTitleClick={() => this.setArmTitle(armsList.Code)}
                >
                  {armsList.AssociatedMeterList.map((metersList) => (
                    <Item
                      title={metersList.MeterLineType}
                      expanded={true}
                      onTitleClick={() => this.parentComponentClick()}
                    >
                      {metersList.MeterList.length > 0 ? (
                        metersList.MeterList.map((meters) =>
                          meters.Code.length > 8 ? (
                            <Tooltip
                              content={meters.Code}
                              element={
                                <Item
                                  icon={
                                    <span
                                      style={{
                                        fontSize: "24px",
                                        marginRight: "6px",
                                        // color:
                                        //   meters.Active !== null &&
                                        //   meters.Active
                                        //     ? "#000000"
                                        //     : "#ff0000",
                                      }}
                                      className={
                                        (meters.Active !== null && meters.Active
                                          ? ""
                                          : "redIcon ") + "icon-Meter"
                                      }
                                    ></span>
                                  }
                                  title={meters.Code.substring(0, 8) + "..."}
                                  actionRenderer={
                                    <Tooltip
                                      content={this.getLocalisedTooltip(
                                        "Siteview_New"
                                      )}
                                      position="bottom left"
                                      size="mini"
                                      element={
                                        <Icon
                                          root="common"
                                          name="duplicate"
                                          size="medium"
                                          onClick={(e) =>
                                            this.isNewMeterClick(
                                              meters.Code,
                                              meters.MeterLineType,
                                              meters.LoadingArmCode
                                            )
                                          }
                                        />
                                      }
                                    />
                                  }
                                  expanded={true}
                                  onTitleClick={() =>
                                    this.setMeterTitle(
                                      meters.Code,
                                      meters.MeterLineType,
                                      meters.LoadingArmCode
                                    )
                                  }
                                />
                              }
                              position="bottom right"
                              size="mini"
                              hoverable={true}
                            />
                          ) : (
                            <Item
                              icon={
                                <span
                                  style={{
                                    fontSize: "24px",
                                    marginRight: "6px",
                                    // color:
                                    //   meters.Active !== null && meters.Active
                                    //     ? "#000000"
                                    //     : "#ff0000",
                                  }}
                                  className={
                                    (meters.Active !== null && meters.Active
                                      ? ""
                                      : "redIcon ") + "icon-Meter"
                                  }
                                ></span>
                              }
                              title={meters.Code}
                              actionRenderer={
                                <Tooltip
                                  content={this.getLocalisedTooltip(
                                    "Siteview_New"
                                  )}
                                  position="bottom left"
                                  size="mini"
                                  element={
                                    <Icon
                                      root="common"
                                      name="duplicate"
                                      size="medium"
                                      onClick={(e) =>
                                        this.isNewMeterClick(
                                          meters.Code,
                                          meters.MeterLineType,
                                          meters.LoadingArmCode
                                        )
                                      }
                                    />
                                  }
                                />
                              }
                              expanded={true}
                              onTitleClick={() =>
                                this.setMeterTitle(
                                  meters.Code,
                                  meters.MeterLineType,
                                  meters.LoadingArmCode
                                )
                              }
                              position="bottom right"
                              size="mini"
                              hoverable={true}
                            />
                          )
                        )
                      ) : (
                        <TranslationConsumer>
                          {(t) => (
                            <Button
                              type="secondary"
                              className="dotted-botton"
                              content={t("SiteView_AddMeter")}
                              onClick={(e) =>
                                this.isNewMeterClick(
                                  "",
                                  metersList.MeterLineType,
                                  armsList.Code
                                )
                              }
                            ></Button>
                          )}
                        </TranslationConsumer>
                      )}
                    </Item>
                  ))}
                </Item>
              }
            />
          ) : (
            <Item
              icon={
                <span
                  style={{
                    fontSize: "24px",
                    marginRight: "6px",
                    // color:
                    //   armsList.Status !== null && armsList.Status
                    //     ? "#000000"
                    //     : "#ff0000",
                  }}
                  className={
                    (armsList.Status !== null && armsList.Status
                      ? ""
                      : "redIcon ") + "icon-LoadingArm"
                  }
                ></span>
              }
              title={armsList.Code}
              actionRenderer={
                <Tooltip
                  content={this.getLocalisedTooltip("Siteview_New")}
                  position="bottom left"
                  size="mini"
                  element={
                    <Icon
                      root="common"
                      name="duplicate"
                      size="medium"
                      onClick={(e) => this.isNewClick(armsList.Code)}
                    />
                  }
                />
              }
              expanded={true}
              onTitleClick={() => this.setArmTitle(armsList.Code)}
            >
              {armsList.AssociatedMeterList.map((metersList) => (
                <Item
                  title={metersList.MeterLineType}
                  expanded={true}
                  onTitleClick={() => this.parentComponentClick()}
                >
                  {metersList.MeterList.length > 0 ? (
                    metersList.MeterList.map((meters) =>
                      meters.Code.length > 8 ? (
                        <Tooltip
                          content={meters.Code}
                          element={
                            <Item
                              icon={
                                <span
                                  style={{
                                    fontSize: "24px",
                                    marginRight: "6px",
                                    // color:
                                    //   meters.Active !== null && meters.Active
                                    //     ? "#000000"
                                    //     : "#ff0000",
                                  }}
                                  className={
                                    (meters.Active !== null && meters.Active
                                      ? ""
                                      : "redIcon ") + "icon-Meter"
                                  }
                                ></span>
                              }
                              title={meters.Code.substring(0, 8) + "..."}
                              actionRenderer={
                                <Tooltip
                                  content={this.getLocalisedTooltip(
                                    "Siteview_New"
                                  )}
                                  position="bottom left"
                                  size="mini"
                                  element={
                                    <Icon
                                      root="common"
                                      name="duplicate"
                                      size="medium"
                                      onClick={(e) =>
                                        this.isNewMeterClick(
                                          meters.Code,
                                          meters.MeterLineType,
                                          meters.LoadingArmCode
                                        )
                                      }
                                    />
                                  }
                                />
                              }
                              expanded={true}
                              onTitleClick={() =>
                                this.setMeterTitle(
                                  meters.Code,
                                  meters.MeterLineType,
                                  meters.LoadingArmCode
                                )
                              }
                            />
                          }
                          position="bottom right"
                          size="mini"
                          hoverable={true}
                        />
                      ) : (
                        <Item
                          icon={
                            <span
                              style={{
                                fontSize: "24px",
                                marginRight: "6px",
                                //   color:
                                //     meters.Active !== null && meters.Active
                                //       ? "#000000"
                                //       : "#ff0000",
                              }}
                              className={
                                (meters.Active !== null && meters.Active
                                  ? ""
                                  : "redIcon ") + "icon-Meter"
                              }
                            ></span>
                          }
                          title={meters.Code}
                          actionRenderer={
                            <Tooltip
                              content={this.getLocalisedTooltip("Siteview_New")}
                              position="bottom left"
                              size="mini"
                              element={
                                <Icon
                                  root="common"
                                  name="duplicate"
                                  size="medium"
                                  onClick={(e) =>
                                    this.isNewMeterClick(
                                      meters.Code,
                                      meters.MeterLineType,
                                      meters.LoadingArmCode
                                    )
                                  }
                                />
                              }
                            />
                          }
                          expanded={true}
                          onTitleClick={() =>
                            this.setMeterTitle(
                              meters.Code,
                              meters.MeterLineType,
                              meters.LoadingArmCode
                            )
                          }
                        />
                      )
                    )
                  ) : (
                    <TranslationConsumer>
                      {(t) => (
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddMeter")}
                          onClick={(e) =>
                            this.isNewMeterClick(
                              "",
                              metersList.MeterLineType,
                              armsList.Code
                            )
                          }
                        ></Button>
                      )}
                    </TranslationConsumer>
                  )}
                </Item>
              ))}
            </Item>
          )
        )
      ) : (
        <TranslationConsumer>
          {(t) => (
            <Button
              type="secondary"
              className="dotted-botton"
              content={t("SiteView_AddLoadingArm")}
              onClick={() => this.isNewClick("")}
            ></Button>
          )}
        </TranslationConsumer>
      );
    } catch (error) {
      console.log("SiteViewTree: Error occured in buildBcuTree");
    }
  }
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

      this.getBCUTreeView(this.state.deviceCode);
    } catch (error) {
      console.log("SiteTreeView:Error occured on savedEvent", error);
    }
  };
  deleteEvent = (data, saveType, notification) => {
    try {
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );

      this.getBCUTreeView(this.state.deviceCode);
    } catch (error) {
      console.log("SiteTreeView:Error occured on deleteEvent", error);
    }
  };

  render() {
    const sitetree = (
      <Tree>
        <Tree.Content>
          {this.props.terminalList.map((myList) => (
            <Item
              title={myList.TerminalNode}
              expanded={true}
              onTitleClick={() => this.parentComponentClick()}
            >
              {myList.LocationDetailsList.length > 0 ? (
                <>{this.handleLocationTree(myList.LocationDetailsList)}</>
              ) : (
                <TranslationConsumer>
                  {(t) => (
                    <div className="button-group">
                      <div>
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddEntryGate")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.ENTRYGATE
                            )
                          }
                        ></Button>
                      </div>
                      <div>
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddReportingOffice")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.REPORTINGOFFICE
                            )
                          }
                        ></Button>
                      </div>
                      <div>
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddGantry")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.GANTRY
                            )
                          }
                        ></Button>
                      </div>
                      <div>
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddBOLOffice")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.BOLOFFICE
                            )
                          }
                        ></Button>
                      </div>
                      <div>
                        <Button
                          type="secondary"
                          className="dotted-botton"
                          content={t("SiteView_AddExitGate")}
                          onClick={() =>
                            this.isAddClick(
                              "",
                              Constants.siteViewLocationType.EXITGATE
                            )
                          }
                        ></Button>
                      </div>
                    </div>
                  )}
                </TranslationConsumer>
              )}
            </Item>
          ))}
        </Tree.Content>
      </Tree>
    );
    const bcutree = (
      <Tree>
        <Tree.Content>
          {this.state.bcuDeviceList.map((armsList) => (
            <Item
              title={armsList.DeviceCode}
              expanded={true}
              onTitleClick={() =>
                this.childComponent(
                  armsList.DeviceCode,
                  this.state.deviceType,
                  this.state.deviceModel
                )
              }
            >
              {this.buildBcuTree(armsList.AssociatedArmsList)}
            </Item>
          ))}
        </Tree.Content>
      </Tree>
    );
    return (
      <React.Fragment>
        <TranslationConsumer>
          {(t) => (
            // <div className="row ml--10">
            <div style={{ display: "flex" }}>
              {/* <div className="col-sm-2 pr-0 pl-0 pb-0 treeview-container"> */}
              <div className="treeview-container">
                <SidebarLayout className="sideBarHeight treeSidebarWidget">
                  <div className="sidebar">
                    <Tab
                      activeIndex={this.props.activeTab}
                      onTabChange={(activeIndex) =>
                        this.props.onTabChange(activeIndex)
                      }
                    >
                      <Tab.Pane title={t("SiteView_Title")}>
                        {sitetree}
                      </Tab.Pane>
                      <Tab.Pane title={t("SiteView_BCUView")}>
                        {bcutree}
                      </Tab.Pane>
                    </Tab>
                  </div>
                </SidebarLayout>
              </div>

              <div className="main-content-container">
                <div className="treeviewContent">
                  {this.state.isLoading ? (
                    this.state.locationType ===
                      Constants.siteViewLocationType.GANTRY ||
                      this.state.locationType === "RailLoadingArea" ||
                      this.state.locationType ===
                      Constants.siteViewLocationType.SPUR ? (
                      <ErrorBoundary>
                        <GantryDeatilsComposite
                          selectedlocation={this.state.locationCode}
                          locationtype={this.state.locationType}
                          selectedTerminal={this.props.selectedTerminal}
                          isClone={this.state.isClone}
                          onSaved={this.props.onSaved}
                          onDelete={this.props.onDelete}
                          transportationtype={this.props.transportationtype}
                        />
                      </ErrorBoundary>
                    ) : this.state.locationType ===
                      Constants.siteViewLocationType.ISLAND ||
                      this.state.locationType === "Island" ? (
                      <ErrorBoundary>
                        <IslandDetailsComposite
                          selectedlocation={this.state.locationCode}
                          locationtype={this.state.locationType}
                          selectedTerminal={this.props.selectedTerminal}
                          parentCode={this.state.parentCode}
                          isClone={this.state.isClone}
                          onSaved={this.props.onSaved}
                          onDelete={this.props.onDelete}
                          transportationtype={this.props.transportationtype}
                        />
                      </ErrorBoundary>
                    ) : this.state.locationType ===
                      Constants.siteViewLocationType.BAY ||
                      this.state.locationType === "Bay" ||
                      this.state.locationType === "MarineBay" ||
                      this.state.locationType ===
                      Constants.siteViewLocationType.BERTH ||
                      this.state.locationType ===
                      Constants.siteViewLocationType.CLUSTER ? (
                      <ErrorBoundary>
                        <BayDetailsComposite
                          selectedlocation={this.state.locationCode}
                          locationtype={this.state.locationType}
                          selectedTerminal={this.props.selectedTerminal}
                          parentCode={this.state.parentCode}
                          isClone={this.state.isClone}
                          onSaved={this.props.onSaved}
                          onDelete={this.props.onDelete}
                          transportationtype={this.props.transportationtype}
                        />
                      </ErrorBoundary>
                    ) : (
                      <ErrorBoundary>
                        <LocationDetailsComposite
                          selectedlocation={this.state.locationCode}
                          locationtype={this.state.locationType}
                          selectedTerminal={this.props.selectedTerminal}
                          isClone={this.state.isClone}
                          onSaved={this.props.onSaved}
                          onDelete={this.props.onDelete}
                          transportationtype={this.props.transportationtype}
                        />
                      </ErrorBoundary>
                    )
                  ) : this.state.isChildLoadDevice ? (
                    <ErrorBoundary>
                      <DeviceDetailsComposite
                        deviceCode={this.state.deviceCode}
                        deviceType={this.state.deviceType}
                        selectedTerminal={this.props.selectedTerminal}
                        onSaved={this.props.onSaved}
                        IsSiteView={true}
                      />
                    </ErrorBoundary>
                  ) : this.state.isLoadingArm ? (
                    <ErrorBoundary>
                      <LoadingArmDetailsComposite
                        loadingArmCode={this.state.loadingArmCode}
                        deviceCode={this.state.deviceCode}
                        selectedTerminal={this.props.selectedTerminal}
                        isClone={this.state.isClone}
                        onSaved={this.savedEvent}
                        onDelete={this.deleteEvent}
                        transportationtype={this.props.transportationtype}
                      />
                    </ErrorBoundary>
                  ) : this.state.isLoadingMeter ? (
                    <ErrorBoundary>
                      <MeterDetailsComposite
                        meterCode={this.state.meterCode}
                        parentCode={this.state.parentCode}
                        meterLineType={this.state.meterLineType}
                        isClone={this.state.isClone}
                        onSaved={this.savedEvent}
                        onDelete={this.deleteEvent}
                        selectedTerminal={this.props.selectedTerminal}
                        deviceCode={this.state.deviceCode}
                        transportationtype={this.props.transportationtype}
                      />
                    </ErrorBoundary>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </TranslationConsumer>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(SiteTreeView);
