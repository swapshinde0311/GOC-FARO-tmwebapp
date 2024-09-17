import React, { Component } from "react";
import DeviceDetails from "../../UIBase/Details/DeviceDetails";
import { SiteDetailsUserActions } from "../../UIBase/Common/SiteDetailsUserActions";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import axios from "axios";
import { connect } from "react-redux";
import lodash from "lodash";
import ErrorBoundary from "../../ErrorBoundary";
import {
  emptyChannel,
  emptyBCUDeviceInfo,
  emptyCardReaderDeviceInfo,
  emptyDEUDeviceInfo,
  emptyWBDeviceInfo,
  emptyDeviceInfo,
} from "../../../JS/DefaultEntities";
import {
  functionGroups,
  fnDevice,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import {
  bcuAttributeEntity,
  cardReaderAttributeEntity,
  weighBridgeAttributeEntity,
  deuAttributeEntity,
} from "../../../JS/AttributeEntity";
import {
  deviceValidationDef,
  deviceChannelValidationDef,
} from "../../../JS/ValidationDef";
import PropTypes from "prop-types";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiDeviceDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class DeviceDetailsComposite extends Component {
  state = {
    device: emptyDeviceInfo,
    modDevice: emptyDeviceInfo,
    associatedChannel: [emptyChannel],
    modAssociatedChannel: [emptyChannel],
    isReadyToRender: false,
    saveEnabled: true,
    isDeleteEnabled: false,
    deviceType: "",
    deviceTypeOptions: [],
    deviceModelOptions: [],
    densityUOMOptions: [],
    volumeUOMOptions: [],
    massUOMOptions: [],
    temperatureUOMOptions: [],
    pressureUOMOptions: [],
    channelTypeOptions: [],
    channelCodeOptions: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    deuAttributeValidationErrors: [],
    bcuAttributeValidationErrors: [],
    crAttributeValidationErrors: [],
    wbAttributeValidationErrors: [],
    attributeValidationErrors: [],
    validationErrors: Utilities.getInitialValidationErrors(deviceValidationDef),
    channelValidationErrors: Utilities.getInitialValidationErrors(
      deviceChannelValidationDef
    ),
    IsTransloading: false,
    deviceModelsObject: {},
    isMarineTransLoading: false,
    isRailTransloading: false,
    deviceTypeChannels: [],
    isMultiDrop: false,
    deviceKPIList: [],
    showAuthenticationLayout: false,
    tempDevice: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      //this.getDevice(this.props.deviceType)
      this.getTransloadingDetails();
      this.getAttributeMetaData(this.props.deviceType);
      this.getDeviceTypes();
      this.getDeviceModels();
      this.getChannelType();
      this.getUOMList();
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  handleResetAttributeValidationError(deviceType) {
    try {
      var attributeMetaDataList =
        deviceType === Constants.deviceTypeCode.BCU
          ? this.state.attributeMetaDataList.bcu
          : deviceType === Constants.deviceTypeCode.CARD_READER
          ? this.state.attributeMetaDataList.cardreader
          : deviceType === Constants.deviceTypeCode.WEIGH_BRIDGE
          ? this.state.attributeMetaDataList.weighbridge
          : deviceType === Constants.deviceTypeCode.DEU
          ? this.state.attributeMetaDataList.deu
          : [];
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(attributeMetaDataList),
      });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  getDevice(type) {
    try {
      if (type === undefined || type === "" || type === null) {
        this.setState({
          device: emptyDeviceInfo,
          modDevice: emptyDeviceInfo,
          modAttributeMetaDataList: [],
          associatedChannel: [lodash.cloneDeep(emptyChannel)],
          modAssociatedChannel: [lodash.cloneDeep(emptyChannel)],
          deviceModelOptions: [],
          isReadyToRender: true,
          channelCodeOptions: [],
          deviceKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnDevice
          ),
        });
      } else {
        this.handleResetAttributeValidationError(type);
        if (type === Constants.deviceTypeCode.CARD_READER) {
          this.getCRDeviceDetails(this.props.deviceCode);
        } else if (type === Constants.deviceTypeCode.BCU) {
          this.getBCUDeviceDetails(this.props.deviceCode);
          this.getKPIList(Constants.deviceTypes.BCU, this.props.deviceCode);
        } else if (type === Constants.deviceTypeCode.DEU) {
          this.getDEUDeviceDetails(this.props.deviceCode);
        } else if (type === Constants.deviceTypeCode.WEIGH_BRIDGE) {
          this.getWBDeviceDetails(this.props.deviceCode);
        }
      }
    } catch (error) {
      console.log("Error in getDevice : ", error);
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      this.getDevice(nextProps.deviceType);
      this.getDeviceModels();
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributeMetaData(deviceType) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [
            bcuAttributeEntity,
            cardReaderAttributeEntity,
            weighBridgeAttributeEntity,
            deuAttributeEntity,
          ],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              modAttributeMetaDataList: [],
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              deuAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.deu
                ),
              bcuAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.bcu
                ),
              crAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.cardreader
                ),
              wbAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.weighbridge
                ),
            },
            () => this.getDevice(deviceType)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getUOMList() {
    try {
      axios(
        RestAPIs.GetUOMList,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let densityUOMOptions = [];
            let volumeUOMOptions = [];
            let massUOMOptions = [];
            let temperatureUOMOptions = [];
            let pressureUOMOptions = [];
            if (Array.isArray(result.EntityResult.DENSITY)) {
              densityUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.DENSITY
              );
            }
            if (Array.isArray(result.EntityResult.VOLUME)) {
              volumeUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.VOLUME
              );
            }
            if (Array.isArray(result.EntityResult.PRESSURE)) {
              pressureUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.PRESSURE
              );
            }
            if (Array.isArray(result.EntityResult.TEMPERATURE)) {
              temperatureUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.TEMPERATURE
              );
            }
            if (Array.isArray(result.EntityResult.MASS)) {
              massUOMOptions = Utilities.transferListtoOptions(
                result.EntityResult.MASS
              );
            }

            this.setState({
              volumeUOMOptions,
              densityUOMOptions,
              massUOMOptions,
              temperatureUOMOptions,
              pressureUOMOptions,
            });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("DeviceDetailsComposite:Error while getting GetUOMList");
    }
  }

  getCRDeviceDetails(deviceCode) {
    let terminalCode = this.props.selectedTerminal;
    try {
      var keyCode = [
        {
          key: KeyCodes.cardReaderCode,
          value: deviceCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: terminalCode,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.cardReaderCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetCRDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let device = lodash.cloneDeep(result.EntityResult);
          device.DeviceType = Constants.deviceTypeCode.CARD_READER;
          this.GetChannelsForDeviceTypes(Constants.deviceTypes.CARD_READER);
          this.setState(
            {
              device: lodash.cloneDeep(device),
              modDevice: lodash.cloneDeep(device),
              isReadyToRender: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
            },
            () => {
              this.formAttributes(
                Constants.deviceTypeCode.CARD_READER,
                result.EntityResult.TerminalCode
              );
              // this.getKPIList(this.props.deviceType,this.props.deviceCode)
            }
          );

          if (result.EntityResult.AssociatedChannels.length > 0) {
            let modAssociatedChannel = lodash.cloneDeep(
              result.EntityResult.AssociatedChannels
            );
            modAssociatedChannel[0].ChannelType = "TCP/IP";
            modAssociatedChannel[0].PrevChannelId =
              modAssociatedChannel[0].ChannelCode;
            modAssociatedChannel[0].PrevChnId =
              modAssociatedChannel[0].ChannelCode;
            modAssociatedChannel[0].IsPrevMultiDrop = result.EntityResult
              .MultiDrop
              ? "1"
              : "0";
            this.setState({
              modAssociatedChannel,
              associatedChannel: modAssociatedChannel,
            });
          } else {
            let modAssociatedChannel = lodash.cloneDeep(
              this.state.modAssociatedChannel
            );
            let channelInfo = lodash.cloneDeep(emptyChannel);
            channelInfo.ReceiveTimeOut = "";
            channelInfo.SendTimeOut = "";
            channelInfo.RetryInterval = "";
            channelInfo.ConnectionRetries = "";

            modAssociatedChannel = [channelInfo];
            this.setState({
              modAssociatedChannel: modAssociatedChannel,
              associatedChannel: modAssociatedChannel,
            });
          }
        } else {
          this.setState({
            device: emptyDeviceInfo,
            modDevice: emptyDeviceInfo,
            modAttributeMetaDataList: [],
            associatedChannel: [lodash.cloneDeep(emptyChannel)],
            modAssociatedChannel: [lodash.cloneDeep(emptyChannel)],
            deviceModelOptions: [],
            isReadyToRender: true,
          });
          console.log("Error in getDevice");
        }
      });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error while getting getCRDeviceDetails"
      );
    }
  }

  getBCUDeviceDetails(deviceCode) {
    let terminalCode = this.props.selectedTerminal;
    try {
      var keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: deviceCode,
        },
      ];
      if (this.props.source === undefined || this.props.source === null)
        keyCode.push({
          key: KeyCodes.terminalCode,
          value: terminalCode,
        });
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bcuCode,
        KeyCodes: keyCode,
      };

      axios(
        RestAPIs.GetBCUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let device = lodash.cloneDeep(result.EntityResult);
          device.DeviceType = Constants.deviceTypeCode.BCU;
          this.GetChannelsForDeviceTypes(Constants.deviceTypes.BCU);
          this.setState(
            {
              device: lodash.cloneDeep(device),
              modDevice: lodash.cloneDeep(device),
              isReadyToRender: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
            },
            () => {
              this.formAttributes(
                Constants.deviceTypeCode.BCU,
                result.EntityResult.TerminalCode
              );
              this.getKPIList(Constants.deviceTypes.BCU, this.props.deviceCode);
            }
          );
          if (result.EntityResult.AssociatedChannels.length > 0) {
            let modAssociatedChannel = lodash.cloneDeep(
              result.EntityResult.AssociatedChannels
            );
            modAssociatedChannel[0].ChannelType = "TCP/IP";
            modAssociatedChannel[0].PrevChannelId =
              modAssociatedChannel[0].ChannelCode;
            modAssociatedChannel[0].IsPrevMultiDrop = result.EntityResult
              .MultiDrop
              ? "1"
              : "0";
            modAssociatedChannel[0].PrevChnId =
              modAssociatedChannel[0].ChannelCode;
            this.setState({
              modAssociatedChannel,
              associatedChannel: modAssociatedChannel,
            });
          } else {
            let modAssociatedChannel = lodash.cloneDeep(
              this.state.modAssociatedChannel
            );

            let channelInfo = lodash.cloneDeep(emptyChannel);
            channelInfo.ReceiveTimeOut = "";
            channelInfo.SendTimeOut = "";
            channelInfo.RetryInterval = "";
            channelInfo.ConnectionRetries = "";

            modAssociatedChannel = [channelInfo];

            this.setState({
              modAssociatedChannel: modAssociatedChannel,
              associatedChannel: modAssociatedChannel,
            });
          }
        } else {
          this.setState({
            device: emptyDeviceInfo,
            modDevice: emptyDeviceInfo,
            modAttributeMetaDataList: [],
            associatedChannel: [lodash.cloneDeep(emptyChannel)],
            modAssociatedChannel: [lodash.cloneDeep(emptyChannel)],
            deviceModelOptions: [],
            isReadyToRender: true,
          });
          console.log("Error in getDevice");
        }
      });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error while getting getBCUDeviceDetails"
      );
    }
  }

  getDEUDeviceDetails(deviceCode) {
    try {
      var keyCode = [
        {
          key: KeyCodes.deuCode,
          value: deviceCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.selectedTerminal,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.deuCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetDEUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let device = lodash.cloneDeep(result.EntityResult);
          device.DeviceType = Constants.deviceTypeCode.DEU;
          this.GetChannelsForDeviceTypes(Constants.deviceTypes.DEU);
          this.setState(
            {
              device: lodash.cloneDeep(device),
              modDevice: lodash.cloneDeep(device),
              isReadyToRender: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
            },
            () => {
              this.formAttributes(
                Constants.deviceTypeCode.DEU,
                result.EntityResult.TerminalCode
              );
              // this.getKPIList(this.props.selectedShareholder, this.props, deviceCode);
            }
          );

          if (result.EntityResult.AssociatedChannels.length > 0) {
            let modAssociatedChannel = lodash.cloneDeep(
              result.EntityResult.AssociatedChannels
            );
            modAssociatedChannel[0].ChannelType = "TCP/IP";
            this.setState({
              modAssociatedChannel,
              associatedChannel: modAssociatedChannel,
            });
          } else {
            let modAssociatedChannel = lodash.cloneDeep(
              this.state.modAssociatedChannel
            );
            let channelInfo = lodash.cloneDeep(emptyChannel);
            channelInfo.ReceiveTimeOut = "";
            channelInfo.SendTimeOut = "";
            channelInfo.RetryInterval = "";
            channelInfo.ConnectionRetries = "";

            modAssociatedChannel = [channelInfo];
            this.setState({
              modAssociatedChannel: modAssociatedChannel,
              associatedChannel: modAssociatedChannel,
            });
          }
        } else {
          this.setState({
            device: emptyDeviceInfo,
            modDevice: emptyDeviceInfo,
            modAttributeMetaDataList: [],
            associatedChannel: [lodash.cloneDeep(emptyChannel)],
            modAssociatedChannel: [lodash.cloneDeep(emptyChannel)],
            deviceModelOptions: [],
            isReadyToRender: true,
          });
          console.log("Error in getDevice");
        }
      });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error while getting geDEUDeviceDetails"
      );
    }
  }

  getWBDeviceDetails(deviceCode) {
    try {
      var keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: deviceCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.selectedTerminal,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetWBDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          let device = lodash.cloneDeep(result.EntityResult);
          device.DeviceType = Constants.deviceTypeCode.WEIGH_BRIDGE;
          this.GetChannelsForDeviceTypes(Constants.deviceTypes.WEIGH_BRIDGE);
          this.setState(
            {
              device: lodash.cloneDeep(device),
              modDevice: lodash.cloneDeep(device),
              isReadyToRender: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
            },
            () => {
              //this.getKPIList(this.props.selectedShareholder, this.props.deviceCode)
              this.formAttributes(
                Constants.deviceTypeCode.WEIGH_BRIDGE,
                result.EntityResult.TerminalCode
              );
            }
          );
          let modAssociatedChannel = lodash.cloneDeep(
            this.state.modAssociatedChannel
          );
          let channelInfo = lodash.cloneDeep(emptyChannel);
          channelInfo.ReceiveTimeOut = "";
          channelInfo.SendTimeOut = "";
          channelInfo.RetryInterval = "";
          channelInfo.ConnectionRetries = "";

          modAssociatedChannel = [channelInfo];
          this.setState({
            modAssociatedChannel: modAssociatedChannel,
            associatedChannel: modAssociatedChannel,
          });
        } else {
          this.setState({
            device: emptyDeviceInfo,
            modDevice: emptyDeviceInfo,
            modAttributeMetaDataList: [],
            associatedChannel: [lodash.cloneDeep(emptyChannel)],
            modAssociatedChannel: [lodash.cloneDeep(emptyChannel)],
            deviceModelOptions: [],
            isReadyToRender: true,
          });
          console.log("Error in getDevice");
        }
      });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error while getting geDEUDeviceDetails"
      );
    }
  }

  getDeviceTypes() {
    try {
      axios(
        RestAPIs.GetDeviceTypes,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var deviceTypeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );

            this.setState({ deviceTypeOptions });
          }
        } else {
          console.log("Error in getDeviceTypes:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("DeviceDetailsComposite:Error while getting getDeviceTypes");
    }
  }

  getDeviceModels() {
    try {
      axios(
        RestAPIs.GetDeviceModels,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let deviceModelOptions = [];
          let deviceModelsObject = result.EntityResult;
          if (
            Array.isArray(result.EntityResult.CARD_READER) &&
            this.props.deviceType === Constants.deviceTypeCode.CARD_READER
          ) {
            deviceModelOptions = Utilities.transferListtoOptions(
              result.EntityResult.CARD_READER
            );
          }
          if (
            Array.isArray(result.EntityResult.BCU) &&
            this.props.deviceType === Constants.deviceTypeCode.BCU
          ) {
            deviceModelOptions = Utilities.transferListtoOptions(
              result.EntityResult.BCU
            );
          }
          if (
            this.props.deviceType === "" ||
            this.state.deviceTypeOptions === "BCU"
          ) {
            deviceModelOptions = Utilities.transferListtoOptions(
              result.EntityResult.BCU
            );
          }
          if (
            Array.isArray(result.EntityResult.DEU) &&
            this.props.deviceType === Constants.deviceTypeCode.DEU
          ) {
            deviceModelOptions = Utilities.transferListtoOptions(
              result.EntityResult.DEU
            );
          }
          if (
            Array.isArray(result.EntityResult.WEIGH_BRIDGE) &&
            this.props.deviceType === Constants.deviceTypeCode.WEIGH_BRIDGE
          ) {
            deviceModelOptions = Utilities.transferListtoOptions(
              result.EntityResult.WEIGH_BRIDGE
            );
          }
          this.setState({
            deviceModelOptions,
            deviceModelsObject,
          });
        } else {
          console.log(
            "Error in getDeviceModels:",
            this.state.deviceModelOptions
          );
        }
      });
    } catch (error) {
      console.log("DeviceDetailsComposite:Error while getting getDeviceModels");
    }
  }

  GetChannelsForDeviceTypes(deviceType) {
    try {
      axios(
        RestAPIs.GetChannelsForDeviceTypes + "?deviceType=" + deviceType,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let channelCodes = [];
            result.EntityResult.forEach((item) => {
              channelCodes.push(item.ChannelCode);
            });
            var channelCodeOptions =
              Utilities.transferListtoOptions(channelCodes);
            this.setState({
              channelCodeOptions,
              deviceTypeChannels: result.EntityResult,
            });
          }
        } else {
          console.log("Error in getChannelType:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("DeviceDetailsComposite:Error while getting getChannelType");
    }
  }

  getChannelType() {
    try {
      axios(
        RestAPIs.GetChannelType,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var channelTypeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ channelTypeOptions });
          }
        } else {
          console.log("Error in getChannelType:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("DeviceDetailsComposite:Error while getting getChannelType");
    }
  }

  handleAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modAttributeMetaDataList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );
      let matchedAttributesList = modAttributeMetaDataList.filter(
        (modattribute) => modattribute.TerminalCode === attribute.TerminalCode
      );
      if (
        matchedAttributesList.length > 0 &&
        Array.isArray(matchedAttributesList[0].attributeMetaDataList)
      ) {
        matchedAttributes =
          matchedAttributesList[0].attributeMetaDataList.filter(
            (modattribute) => modattribute.Code === attribute.Code
          );
      }
      if (matchedAttributes.length > 0) {
        matchedAttributes[0].DefaultValue = value;
      }
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleSetBCUSkipLocalLoadFetch = () => {
    try {
      let modDevice = lodash.cloneDeep(this.state.modDevice);
      let keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bcuCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["BCUSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["BCUCode"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "DeviceInfo_LOCALTRANSUPLOADSuccessMsg",
          },
        ],
      };

      axios(
        RestAPIs.SetBCUSkipLocalLoadFetch,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess !== true)
          notification.messageResultDetails[0].errorMessage =
            "DeviceInfo_LOCALTRANSUPLOADFailureMsg";
        else notification.message = ["DeviceInfo_LOCALTRANSUPLOADSuccessMsg"];

        this.props.onSaved(modDevice, "update", notification);
      });
    } catch (error) {
      console.log("Error in handleSetBCUSkipLocalLoadFetch");
    }
  };

  saveDevice = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempDevice = lodash.cloneDeep(this.state.tempDevice);

      if (tempDevice.DeviceType === Constants.deviceTypeCode.CARD_READER)
      this.state.device.Code !== ""
        ? this.UpdateCardReaderDevice(tempDevice)
        : this.CreateCardReaderDevice(tempDevice);
    else if (tempDevice.DeviceType === Constants.deviceTypeCode.BCU)
      this.state.device.Code !== ""
        ? this.UpdateBCUDevice(tempDevice)
        : this.CreateBCUDevice(tempDevice);
    else if (tempDevice.DeviceType === Constants.deviceTypeCode.DEU)
      this.state.device.Code !== ""
        ? this.UpdateDEUDevice(tempDevice)
        : this.CreateDEUDevice(tempDevice);
    else if (tempDevice.DeviceType === Constants.deviceTypeCode.WEIGH_BRIDGE)
      this.state.device.Code !== ""
        ? this.UpdateWBDevice(tempDevice)
        : this.CreateWBDevice(tempDevice);

    } catch (error) {
      console.log("DeviceComposite : Error in savePrimeMover");
    }
  };

  handleSave = () => {
    try {
   //   this.setState({ saveEnabled: false });
      let modDevice = this.fillDetails();

      let tempAttributeList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );
      let attributeList = lodash.cloneDeep(this.state.modAttributeMetaDataList);

      if (Array.isArray(attributeList)) {
        tempAttributeList.forEach((item) => {
          item.attributeMetaDataList = [];

          var index = attributeList.findIndex((x) => {
            return x.TerminalCode === item.TerminalCode;
          });

          if (index >= 0) {
            attributeList[index].attributeMetaDataList.forEach((attribute) => {
              if (attribute.IsVisible)
                item.attributeMetaDataList.push(attribute);
            });
          }
        });
      }

      attributeList =
        Utilities.attributesConverttoLocaleString(tempAttributeList);
      if (this.validateSave(modDevice, attributeList)) {
        attributeList = Utilities.attributesDatatypeConversion(attributeList);
        modDevice.Attributes = Utilities.fillAttributeDetails(attributeList);
        
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempDevice = lodash.cloneDeep(modDevice);
      this.setState({ showAuthenticationLayout, tempDevice }, () => {
        if (showAuthenticationLayout === false) {
          this.saveDevice();
        }
    });

      } else this.setState({ saveEnabled: true });
    } catch (error) {
      console.log("DeviceDetailsComposite:Error occured on handleSave", error);
    }
  };

  validateSave(modDevice, attributeList) {
    var returnValue = true;
    try {
      const validationErrors = { ...this.state.validationErrors };
      const channelValidationErrors = { ...this.state.channelValidationErrors };

      Object.keys(deviceValidationDef).forEach(function (key) {
        if (modDevice[key] !== undefined)
          validationErrors[key] = Utilities.validateField(
            deviceValidationDef[key],
            modDevice[key]
          );
      });

      if (
        modDevice.AssociatedChannels !== undefined &&
        modDevice.AssociatedChannels !== null &&
        modDevice.AssociatedChannels.length > 0
      ) {
        Object.keys(deviceChannelValidationDef).forEach(function (key) {
          if (modDevice.AssociatedChannels[0][key] !== undefined)
            channelValidationErrors[key] = Utilities.validateField(
              deviceChannelValidationDef[key],
              modDevice.AssociatedChannels[0][key]
            );
        });

        if (
          modDevice.AssociatedChannels[0].SecondaryAddress !== "" &&
          modDevice.AssociatedChannels[0].SecondaryAddress !== null &&
          (modDevice.AssociatedChannels[0].SecondaryPort === "" ||
            modDevice.AssociatedChannels[0].SecondaryPort === null)
        )
          channelValidationErrors["SecondaryPort"] = "Channel_MandatorySPNos";
        else if (
          (modDevice.AssociatedChannels[0].SecondaryAddress === "" ||
            modDevice.AssociatedChannels[0].SecondaryAddress === null) &&
          modDevice.AssociatedChannels[0].SecondaryPort !== "" &&
          modDevice.AssociatedChannels[0].SecondaryPort !== null
        )
          channelValidationErrors["SecondaryAddress"] =
            "Channel_MandatorySPRegex";
      }

      if (
        this.props.deviceType === Constants.deviceTypeCode.BCU ||
        modDevice.DeviceType === Constants.deviceTypeCode.BCU
      ) {
        if (
          modDevice.Model.toUpperCase() !==
            Constants.DeviceModels.AcculoadIII.toUpperCase() &&
          modDevice.Model.toUpperCase() !==
            Constants.DeviceModels.AcculoadIV.toUpperCase() &&
          modDevice.Model.toUpperCase() !==
            Constants.DeviceModels.DanLoad.toUpperCase() &&
          modDevice.Model.toUpperCase() !==
            Constants.DeviceModels.VirtualPreset.toUpperCase() &&
          (modDevice.NodeAddress === null || modDevice.NodeAddress === "")
        )
          validationErrors["NodeAddress"] = "DeviceInfo_NodeAddressRequired";
      } else if (
        this.props.deviceType === Constants.deviceTypeCode.CARD_READER ||
        modDevice.DeviceType === Constants.deviceTypeCode.CARD_READER
      ) {
        if (modDevice.NodeAddress === null || modDevice.NodeAddress === "")
          validationErrors["NodeAddress"] = "DeviceInfo_NodeAddressRequired";
      } else if (
        this.props.deviceType === Constants.deviceTypeCode.WEIGH_BRIDGE ||
        modDevice.DeviceType === Constants.deviceTypeCode.WEIGH_BRIDGE
      ) {
        if (modDevice.WeightUOM === null || modDevice.WeightUOM === "")
          validationErrors["WeightUOM"] = "WB_UOMRequired";
      }

      if (modDevice.Active !== this.state.device.Active) {
        if (modDevice.Remarks === null || modDevice.Remarks === "") {
          validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
        }
      }

      var attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeList.forEach((attribute) => {
        attributeValidationErrors.forEach((attributeValidation) => {
          if (attributeValidation.TerminalCode === attribute.TerminalCode) {
            attribute.attributeMetaDataList.forEach((attributeMetaData) => {
              if (attributeMetaData.IsVisible === true) {
                attributeValidation.attributeValidationErrors[
                  attributeMetaData.Code
                ] = Utilities.valiateAttributeField(
                  attributeMetaData,
                  attributeMetaData.DefaultValue
                );
              }
            });
          }
        });
      });

      this.setState({
        attributeValidationErrors,
        validationErrors,
        channelValidationErrors,
      });

      attributeValidationErrors.forEach((x) => {
        if (returnValue) {
          returnValue = Object.values(x.attributeValidationErrors).every(
            function (value) {
              return value === "";
            }
          );
        } else {
          return returnValue;
        }
      });

      if (returnValue)
        returnValue = Object.values(channelValidationErrors).every(function (
          value
        ) {
          return value === "";
        });

      if (returnValue)
        returnValue = Object.values(validationErrors).every(function (value) {
          return value === "";
        });
    } catch (error) {
      console.log("DeviceDetailsComposite : Error in validate save", error);
    }
    return returnValue;
  }

  getTransloadingDetails() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Transloading",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult != null) {
              this.setState({
                isMarineTransLoading:
                  result.EntityResult.MarineEnable.toUpperCase() === "TRUE"
                    ? true
                    : false,
                isRailTransloading:
                  result.EntityResult.RAILEnable.toUpperCase() === "TRUE"
                    ? true
                    : false,
              });
            } else {
              this.setState({
                isMarineTransLoading: false,
                isRailTransloading: false,
              });
            }
          } else {
            this.setState({
              isMarineTransLoading: false,
              isRailTransloading: false,
            });
            console.log("Error in getTransloadingDetails: ", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({
            productAllocationList: [],
            productShareholderAllocationList: [],
            ProdAllocEntity: "",
          });
          console.log(
            "DeviceDetailsComposite: Error occurred on getTransloadingDetails",
            error
          );
        });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite: Error occurred on getTransloadingDetails",
        error
      );
    }
  }

  fillDetails() {
    try {
      let modDevice = {};

      let modAssociatedChannel = lodash.cloneDeep(
        this.state.modAssociatedChannel
      );

      modDevice = lodash.cloneDeep(this.state.modDevice);
      modDevice.TerminalCode = this.props.selectedTerminal;
      modDevice.LastUpdatedBy =
        this.props.userDetails.EntityResult.Firstname +
        " " +
        this.props.userDetails.EntityResult.LastName;
      if (modDevice.DeviceType === Constants.deviceTypeCode.DEU) {
        if (modDevice.ResponseWaitTime <= 0) {
          modDevice.ResponseWaitTime = 3000;
        }
        if (modDevice.RefreshTime <= 0) {
          modDevice.RefreshTime = 3000;
        }
      }

      if (modDevice.DeviceType === Constants.deviceTypeCode.CARD_READER) {
        if (
          modDevice.Model === Constants.DeviceModels.Nedap ||
          modDevice.Model === Constants.DeviceModels.SIMATIC_BARCODE ||
          modDevice.Model === Constants.DeviceModels.MORPHO_BIOMETRIC
        )
          modDevice.NodeAddress = "0";
      }

      if (modDevice.DeviceType === Constants.deviceTypeCode.BCU) {
        if (
          modDevice.Model === Constants.DeviceModels.AcculoadIII ||
          modDevice.Model === Constants.DeviceModels.AcculoadIV ||
          modDevice.Model === Constants.DeviceModels.DanLoad ||
          modDevice.Model === Constants.DeviceModels.VirtualPreset
        )
          modDevice.NodeAddress = "0";
        modDevice.SCADAConfiguration = null;
      }

      if (
        modAssociatedChannel !== undefined &&
        modAssociatedChannel !== null &&
        modAssociatedChannel.length > 0 &&
        modAssociatedChannel[0].ChannelCode !== ""
      ) {
        modDevice.AssociatedChannels = modAssociatedChannel;
      }

      return modDevice;
    } catch (err) {
      console.log("DeviceDetailsComposite:Error occured on filldetails", err);
    }
  }

  CreateCardReaderDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.cardReaderCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.cardReaderCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["CARDREADERSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["DEU_CardReaderID"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateCRDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnDevice
                ),
                showAuthenticationLayout: false,
              },
              () => this.getCRDeviceDetails(modDevice.Code)
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
              showAuthenticationLayout: false,
            });
          }
          this.props.onSaved(this.state.modDevice, "add", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modDevice, "add", notification);
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  CreateDEUDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.deuCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.deuCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["DEUSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["DEUCode"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateDEUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess === true) {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnDevice
                ),
                showAuthenticationLayout: false,
              },
              () => this.getDEUDeviceDetails(modDevice.Code)
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnDevice
              ),
              showAuthenticationLayout: false,
            });
          }
          this.props.onSaved(this.state.modDevice, "add", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modDevice, "add", notification);
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  CreateWBDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["WeighBridgeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["WeighBridgeCode"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateWBDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess === true) {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnDevice
                ),
                showAuthenticationLayout: false,
              },
              () => this.getWBDeviceDetails(modDevice.Code)
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnDevice
              ),
              showAuthenticationLayout: false,
            });
          }
          this.props.onSaved(this.state.modDevice, "add", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modDevice, "add", notification);
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  UpdateCardReaderDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.cardReaderCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.cardReaderCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["CARDREADERSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["DEU_CardReaderID"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateCRDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
              showAuthenticationLayout: false,
            },
            () => this.getCRDeviceDetails(modDevice.Code)
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modDevice, "update", notification);
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  UpdateDEUDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.deuCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.deuCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["DEUSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["DEUCode"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateDEUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
              showAuthenticationLayout: false,
            },
            () => this.getDEUDeviceDetails(modDevice.Code)
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modDevice, "update", notification);
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  UpdateWBDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.weighBridgeCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.weighBridgeCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["WeighBridgeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["WeighBridgeCode"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateWBDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
              showAuthenticationLayout: false,
            },
            () => this.getWBDeviceDetails(modDevice.Code)
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modDevice, "update", notification);
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  UpdateBCUDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bcuCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["BCUSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["BCUCode"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.UpdateBCUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnDevice
              ),
              showAuthenticationLayout: false,
            },
            () => this.getBCUDeviceDetails(modDevice.Code)
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modDevice, "update", notification);
      });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on updateDevice",
        error
      );
    }
  }

  formAttributes(deviceType, receivedTerminal) {
    try {
      var attributeMetaDataList =
        deviceType === Constants.deviceTypeCode.BCU
          ? lodash.cloneDeep(this.state.attributeMetaDataList.bcu)
          : deviceType === Constants.deviceTypeCode.CARD_READER
          ? lodash.cloneDeep(this.state.attributeMetaDataList.cardreader)
          : deviceType === Constants.deviceTypeCode.WEIGH_BRIDGE
          ? lodash.cloneDeep(this.state.attributeMetaDataList.weighbridge)
          : deviceType === Constants.deviceTypeCode.DEU
          ? lodash.cloneDeep(this.state.attributeMetaDataList.deu)
          : [];

      var modAttributeMetaDataList = [];
      let attributesTerminalsList = [];

      if (attributeMetaDataList.length > 0) {
        modAttributeMetaDataList = lodash.cloneDeep(
          this.state.modAttributeMetaDataList
        );

        const attributeValidationErrors =
          deviceType === Constants.deviceTypeCode.BCU
            ? this.state.bcuAttributeValidationErrors
            : deviceType === Constants.deviceTypeCode.CARD_READER
            ? this.state.crAttributeValidationErrors
            : deviceType === Constants.deviceTypeCode.WEIGH_BRIDGE
            ? this.state.wbAttributeValidationErrors
            : deviceType === Constants.deviceTypeCode.DEU
            ? this.state.deuAttributeValidationErrors
            : [];

        let terminal =
          receivedTerminal === undefined ||
          receivedTerminal === null ||
          receivedTerminal === ""
            ? attributeMetaDataList[0].TerminalCode
            : receivedTerminal;

        var modDevice = lodash.cloneDeep(this.state.modDevice);

        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });
        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modDevice.Attributes.find(
                (trailerAttribute) => {
                  return trailerAttribute.TerminalCode === terminal;
                }
              );
              if (Attributevalue !== undefined) {
                attributeMetaData.attributeMetaDataList.forEach(function (
                  attributeMetaData
                ) {
                  var valueAttribute = Attributevalue.ListOfAttributeData.find(
                    (x) => {
                      return x.AttributeCode === attributeMetaData.Code;
                    }
                  );
                  if (valueAttribute !== undefined)
                    attributeMetaData.DefaultValue =
                      valueAttribute.AttributeValue;
                });
              }
              attributesTerminalsList.push(attributeMetaData);
            }
          });
        } else {
          attributesTerminalsList.push(existitem);
        }
        modAttributeMetaDataList = [];
        modAttributeMetaDataList = attributesTerminalsList;

        attributeValidationErrors.forEach((attributeValidation) => {
          var existTerminal = [terminal].find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });

          if (existTerminal === undefined) {
            Object.keys(attributeValidation.attributeValidationErrors).forEach(
              (key) => (attributeValidation.attributeValidationErrors[key] = "")
            );
          }
        });
        this.setState({ modAttributeMetaDataList, attributeValidationErrors });
      }
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleChange = (propertyName, data) => {
    try {
      let modDevice = lodash.cloneDeep(this.state.modDevice);
      let deviceModelOptions = lodash.cloneDeep(this.state.deviceModelOptions);
      modDevice[propertyName] = data;
      if (propertyName === "DeviceType") {
        modDevice =
          Constants.deviceTypeCode[data] === Constants.deviceTypeCode.BCU
            ? lodash.cloneDeep(emptyBCUDeviceInfo)
            : Constants.deviceTypeCode[data] ===
              Constants.deviceTypeCode.CARD_READER
            ? lodash.cloneDeep(emptyCardReaderDeviceInfo)
            : Constants.deviceTypeCode[data] ===
              Constants.deviceTypeCode.WEIGH_BRIDGE
            ? lodash.cloneDeep(emptyWBDeviceInfo)
            : Constants.deviceTypeCode[data] === Constants.deviceTypeCode.DEU
            ? lodash.cloneDeep(emptyDEUDeviceInfo)
            : emptyDeviceInfo;
        modDevice[propertyName] = Constants.deviceTypeCode[data];
        let channelInfo = lodash.cloneDeep(emptyChannel);
        channelInfo.ReceiveTimeOut =
          Constants.deviceTypeCode[data] === Constants.deviceTypeCode.DEU ||
          Constants.deviceTypeCode[data] ===
            Constants.deviceTypeCode.WEIGH_BRIDGE
            ? ""
            : "5000";
        channelInfo.SendTimeOut =
          Constants.deviceTypeCode[data] === Constants.deviceTypeCode.DEU ||
          Constants.deviceTypeCode[data] ===
            Constants.deviceTypeCode.WEIGH_BRIDGE
            ? ""
            : "5000";
        channelInfo.RetryInterval =
          Constants.deviceTypeCode[data] === Constants.deviceTypeCode.DEU ||
          Constants.deviceTypeCode[data] ===
            Constants.deviceTypeCode.WEIGH_BRIDGE
            ? ""
            : "10000";
        channelInfo.ConnectionRetries =
          Constants.deviceTypeCode[data] === Constants.deviceTypeCode.DEU ||
          Constants.deviceTypeCode[data] ===
            Constants.deviceTypeCode.WEIGH_BRIDGE
            ? ""
            : "5";

        this.setState(
          {
            modDevice,
            modAttributeMetaDataList: [],
            modAssociatedChannel: [channelInfo],
          },
          () => {
            this.handleResetAttributeValidationError(
              Constants.deviceTypeCode[data]
            );
            this.formAttributes(Constants.deviceTypeCode[data]);
          }
        );
        deviceModelOptions = Utilities.transferListtoOptions(
          this.state.deviceModelsObject[data]
        );
        this.GetChannelsForDeviceTypes(data);
        this.setState({ deviceModelOptions });
      }
      if (
        (propertyName === "Model" || propertyName === "DEUType") &&
        !this.state.isMultiDrop
      ) {
        modDevice.MultiDrop = false;
      }
      if (
        propertyName === "DEUType" &&
        modDevice.DeviceType === Constants.deviceTypeCode.DEU
      ) {
        let channelInfo = lodash.cloneDeep(emptyChannel);

        channelInfo.ReceiveTimeOut =
          data.toUpperCase() ===
          Constants.DeviceModels.TouchScreen.toUpperCase()
            ? ""
            : "3000";
        channelInfo.SendTimeOut =
          data.toUpperCase() ===
          Constants.DeviceModels.TouchScreen.toUpperCase()
            ? ""
            : "3000";
        channelInfo.RetryInterval =
          data.toUpperCase() ===
          Constants.DeviceModels.TouchScreen.toUpperCase()
            ? ""
            : "10000";
        channelInfo.ConnectionRetries =
          data.toUpperCase() ===
          Constants.DeviceModels.TouchScreen.toUpperCase()
            ? ""
            : "2";
        this.setState({
          modAssociatedChannel: [channelInfo],
        });
      }
      if (propertyName === "MultiDrop") {
        this.setState({ isMultiDrop: data });
        if (data) {
          let channelInfo = lodash.cloneDeep(emptyChannel);
          channelInfo.ReceiveTimeOut = "";
          channelInfo.SendTimeOut = "";
          channelInfo.RetryInterval = "";
          channelInfo.ConnectionRetries = "";

          this.setState({ modAssociatedChannel: [channelInfo] });
        } else
          this.setState({
            modAssociatedChannel: this.state.associatedChannel,
          });
      }
      this.setState({ modDevice });
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (deviceValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          deviceValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  GetChannel(ChannelCode) {
    let channelInfo = {};
    try {
      var keyCode = [
        {
          key: KeyCodes.channelCode,
          value: ChannelCode,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.channelCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetChannel,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          if (result.IsSuccess) {
            channelInfo = result.EntityResult;

            let modAssociatedChannel = lodash.cloneDeep(
              this.state.modAssociatedChannel
            );

            if (
              channelInfo !== undefined &&
              channelInfo.ChannelCode !== undefined
            ) {
              modAssociatedChannel = [channelInfo];
              modAssociatedChannel[0].ChannelType = "TCP/IP";
              modAssociatedChannel[0].PrevChannelId =
                modAssociatedChannel[0].ChannelCode;
              modAssociatedChannel[0].IsPrevMultiDrop = result.EntityResult
                .MultiDrop
                ? "1"
                : "0";
            }
            this.setState({ modAssociatedChannel });
          }
        })
        .catch((error) => {
          console.log("Error in getting channel information", error);
        });
    } catch (error) {
      console.log("Error in getting channelInfo", error);
    }
  }

  handleChannelChange = (propertyName, data) => {
    try {
      let modAssociatedChannel = lodash.cloneDeep(
        this.state.modAssociatedChannel
      );

      if (
        propertyName === "ChannelCode" &&
        data !== "" &&
        this.state.isMultiDrop === true
      )
        this.GetChannel(data);
      else {
        modAssociatedChannel.forEach((associatedChannel) => {
          if (propertyName === "PortType") data = data === true ? 1 : 0;
          associatedChannel[propertyName] = data;
        });

        this.setState({ modAssociatedChannel });
      }

      let channelValidationErrors = lodash.cloneDeep(
        this.state.channelValidationErrors
      );
      if (deviceChannelValidationDef[propertyName] !== undefined) {
        channelValidationErrors[propertyName] = Utilities.validateField(
          deviceChannelValidationDef[propertyName],
          data
        );

        if (propertyName === "ChannelCode" && data === "") {
          channelValidationErrors = Utilities.getInitialValidationErrors(
            deviceChannelValidationDef
          );
        }
        this.setState({ channelValidationErrors });
      }
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on handleChannelChange",
        error
      );
    }
  };

  handleReset = () => {
    try {
      let deviceType =
        this.props.deviceType !== undefined &&
        this.props.deviceType !== null &&
        this.props.deviceType !== ""
          ? this.props.deviceType
          : this.state.device.DeviceType;

      let deviceModelOptions =
        this.props.deviceType !== undefined &&
        this.props.deviceType !== null &&
        this.props.deviceType !== ""
          ? this.state.deviceModelOptions
          : [];

      this.setState(
        {
          modDevice: lodash.cloneDeep(this.state.device),
          validationErrors:
            Utilities.getInitialValidationErrors(deviceValidationDef),
          channelValidationErrors: Utilities.getInitialValidationErrors(
            deviceChannelValidationDef
          ),
          modAttributeMetaDataList: [],
          modAssociatedChannel: this.state.associatedChannel,
          deviceModelOptions,
        },
        () => {
          this.handleResetAttributeValidationError(deviceType);
          this.formAttributes(deviceType);
        }
      );
    } catch (error) {
      console.log(
        this.props.ShipmentType + ":Error occured on handleReset",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modDevice = lodash.cloneDeep(this.state.modDevice);
      modDevice.Active = value;
      if (modDevice.Active !== this.state.device.Active) modDevice.Remarks = "";
      this.setState({ modDevice });
    } catch (error) {
      console.log(
        "DeviceDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };
  CreateBCUDevice(modDevice) {
    try {
      let keyCode = [
        {
          key: KeyCodes.bcuCode,
          value: modDevice.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bcuCode,
        KeyCodes: keyCode,
        Entity: modDevice,
      };
      let notification = {
        messageType: "critical",
        message: ["BCUSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["BCUCode"],
            keyValues: [modDevice.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestAPIs.CreateBCUDevice,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnDevice
                ),
                showAuthenticationLayout: false,
              },
              () => this.getBCUDeviceDetails(modDevice.Code)
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                fnDevice
              ),
              showAuthenticationLayout: false,
            });
            console.log("Error in CreateDevice:", result.ErrorList);
          }
          this.props.onSaved(modDevice, "add", notification);
        })
        .catch((error) => {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnDevice
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage = error;
          this.props.onSaved(modDevice, "add", notification);
        });
    } catch (error) {
      console.log("error", error);
    }
  }
  getKPIList(deviceType, deviceCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiDeviceDetail,
        InputParameters: [
          { key: "DeviceType", value: deviceType },
          { key: "DeviceCode", value: deviceCode },
        ],
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
              deviceKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ deviceKPIList: [] });
            console.log("Error in device KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Driver KPIList:", error);
        });
    }
  }
  
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",

        fieldValue:
          this.props.deviceType === Constants.deviceTypeCode.CARD_READER
            ? new Date(this.state.modDevice.LastUpdated).toLocaleDateString() +
              " " +
              new Date(this.state.modDevice.LastUpdated).toLocaleTimeString()
            : new Date(
                this.state.modDevice.LastUpdatedTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modDevice.LastUpdatedTime
              ).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modDevice.LastActive !== undefined &&
          this.state.modDevice.LastActive !== null
            ? new Date(this.state.modDevice.LastActive).toLocaleDateString() +
              " " +
              new Date(this.state.modDevice.LastActive).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          this.props.deviceType === Constants.deviceTypeCode.CARD_READER
            ? new Date(this.state.modDevice.Created).toLocaleDateString() +
              " " +
              new Date(this.state.modDevice.Created).toLocaleTimeString()
            : new Date(this.state.modDevice.CreatedTime).toLocaleDateString() +
              " " +
              new Date(this.state.modDevice.CreatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "SealMasterList_LastUpdatedBy",
        fieldValue: this.state.modDevice.LastUpdatedBy,
      },
    ];

    let transloadingOptions = [];
    if (this.state.isMarineTransLoading) transloadingOptions.push("MARINE");
    if (this.state.isRailTransloading) transloadingOptions.push("RAIL");

    let deviceType =
      this.props.deviceType !== undefined &&
      this.props.deviceType !== null &&
      this.props.deviceType !== ""
        ? this.props.deviceType
        : this.state.modDevice.DeviceType;

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.device.Code}
            newEntityName="NewDevice"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.deviceKPIList}>
          {" "}
        </TMDetailsKPILayout>
        <ErrorBoundary>
          <DeviceDetails
            device={this.state.device}
            modDevice={this.state.modDevice}
            modAssociatedChannel={this.state.modAssociatedChannel}
            onFieldChange={this.handleChange}
            onChannelFieldChange={this.handleChannelChange}
            listOptions={{
              deviceTypeOptions: this.state.deviceTypeOptions,
              deviceModelOptions: this.state.deviceModelOptions,
              channelTypeOptions: this.state.channelTypeOptions,
              channelCodeOptions: this.state.channelCodeOptions,
              densityUOMOptions: this.state.densityUOMOptions,
              volumeUOMOptions: this.state.volumeUOMOptions,
              massUOMOptions: this.state.massUOMOptions,
              temperatureUOMOptions: this.state.temperatureUOMOptions,
              pressureUOMOptions: this.state.pressureUOMOptions,
              transloadingOptions: transloadingOptions,
            }}
            deviceType={deviceType}
            selectedCardReaderAttributeList={
              this.state.selectedCardReaderAttributeList
            }
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            onAttributeDataChange={this.handleAttributeDataChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            validationErrors={this.state.validationErrors}
            channelValidationErrors={this.state.channelValidationErrors}
            isMarineTransloading={this.state.isMarineTransLoading}
            isRailTransloading={this.state.isRailTransloading}
            isBCU={
              this.state.device.Code !== "" &&
              this.state.modDevice.DeviceType ===
                Constants.deviceTypeCode.BCU &&
              this.state.modDevice.Model.toUpperCase() ===
                Constants.DeviceModels.MSCL.toUpperCase()
            }
            handleSkipLocalLoadFetch={this.handleSetBCUSkipLocalLoadFetch}
            enableSkipLocalLoadFetch={this.state.saveEnabled}
          ></DeviceDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          {this.props.IsSiteView ? (
            <SiteDetailsUserActions
              isEnterpriseNode={
                this.props.userDetails.EntityResult.IsEnterpriseNode
              }
              handleSave={this.handleSave}
              handleDelete={this.handleDelete}
              saveEnabled={this.state.saveEnabled}
              isDeleteEnabled={this.state.isDeleteEnabled}
              isBCU={
                this.state.modDevice.DeviceType ===
                  Constants.deviceTypeCode.BCU &&
                this.state.modDevice.Model.toUpperCase() ===
                  Constants.DeviceModels.MSCL.toUpperCase()
              }
              handleSkipLocalLoadFetch={this.handleSetBCUSkipLocalLoadFetch}
            ></SiteDetailsUserActions>
          ) : (
            <ErrorBoundary>
              <TMDetailsUserActions
                handleBack={this.props.onBack}
                handleSave={this.handleSave}
                handleReset={this.handleReset}
                saveEnabled={this.state.saveEnabled}
              ></TMDetailsUserActions>
            </ErrorBoundary>
          )}
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.device.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnDevice}
            handleOperation={this.saveDevice}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
      </div>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};
DeviceDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
export default connect(mapStateToProps)(DeviceDetailsComposite);
