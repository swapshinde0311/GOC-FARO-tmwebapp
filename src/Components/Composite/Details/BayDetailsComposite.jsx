import React, { Component } from "react";
import { emptyLocation, emptyBay } from "../../../JS/DefaultEntities";
import { SiteDetailsUserActions } from "../../UIBase/Common/SiteDetailsUserActions";
import axios from "axios";
import { connect } from "react-redux";
import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { locationValidationDef } from "../../../JS/ValidationDef";
import { fnSiteView, fnRailSiteView, fnMarineSiteView, functionGroups } from "../../../JS/FunctionGroups";
import BayDetails from "../../UIBase/Details/BayDetails";
import { getKeyByValue } from "../../../JS/Utilities";
import { bayAttributeEntity } from "../../../JS/AttributeEntity";
import { TranslationConsumer } from "@scuf/localization";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class BayDetailsComposite extends Component {
  state = {
    location: {},
    modLocation: {},
    bay: {},
    modBay: {},
    modAssociatedDevices: [],
    modAvailableDevices: [],
    isReadyToRender: false,
    saveEnabled: false,
    isDeleteEnabled: false,
    selectedLocationType: "",
    checkedDevices: [],
    loadingTypeOptions: [],
    bayTypeOptions: [],
    validationErrors: Utilities.getInitialValidationErrors(
      locationValidationDef
    ),
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    showDeleteAuthenticationLayout: false,
    showSaveAuthenticationLayout: false,
    tempBay: {},
    tempLocation: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLoadingTypes();
      this.getBayTypes();
      //this.getDeviceList(this.props.locationtype);
      // this.getLocation(this.props);
      this.getAttributes(this.props);
    } catch (error) {
      console.log(
        "BayDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        nextProps.LocationCode === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        // this.getLocation(nextProps);
        this.getAttributes(nextProps);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "BayDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(props) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [bayAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.bay
                ),
            },
            () => this.getDeviceList(props) //this.getLocation(props)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getDeviceList(props) {
    let locationType = props.locationtype;
    locationType =
      locationType === "Bay"
        ? Constants.siteViewLocationType.BAY
        : locationType === "Cluster"
          ? Constants.siteViewLocationType.CLUSTER
          : Constants.siteViewLocationType.BERTH;
    var terminalCode = this.props.selectedTerminal;
    try {
      axios(
        RestAPIs.GetDeviceList +
        "?locationType=" +
        locationType +
        "&locationInfo=" +
        "&terminalCode=" +
        terminalCode,

        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            Array.isArray(result.EntityResult) &&
            result.EntityResult.length > 0
          )
            this.setState({ modAvailableDevices: result.EntityResult }, () => {
              this.getLocation(props);
            });
          else this.getLocation(props);
        } else {
          this.getLocation(props);
        }
      });
    } catch (err) {
      console.log("BayDetailsComposite:Error occured on getDeviceList", err);
    }
  }

  getLocation(propsResult) {
    try {
      let locationCode = propsResult.selectedlocation;
      let terminalCode = this.props.selectedTerminal;
      if (propsResult.locationtype === "MarineBay") {
        this.setState({
          selectedLocationType: Constants.siteViewLocationType.BERTH,
        });
        emptyLocation.LocationType = Constants.siteViewLocationType.BERTH;
        emptyBay.IslandCode = "";
        emptyLocation.AvailableDevices = this.state.modAvailableDevices;
      }
      if (propsResult.locationtype === "Bay") {
        this.setState({
          selectedLocationType: Constants.siteViewLocationType.BAY,
        });
        emptyLocation.LocationType = Constants.siteViewLocationType.BAY;
        emptyBay.IslandCode = this.props.parentCode;
        emptyLocation.AvailableDevices = this.state.modAvailableDevices;
      }
      if (propsResult.locationtype === "Cluster") {
        this.setState({
          selectedLocationType: Constants.siteViewLocationType.CLUSTER,
        });
        emptyLocation.LocationType = Constants.siteViewLocationType.CLUSTER;
        emptyBay.IslandCode = this.props.parentCode;
        emptyLocation.AvailableDevices = this.state.modAvailableDevices;
      }

      if (propsResult.isClone === true) {
        this.setState(
          {
            modAttributeMetaDataList: [],
            selectedLocationType: emptyLocation.LocationType,
            location: lodash.cloneDeep(emptyLocation),
            modLocation: lodash.cloneDeep(emptyLocation),
            bay: lodash.cloneDeep(emptyBay),
            modBay: lodash.cloneDeep(emptyBay),
            isReadyToRender: true,
            modAssociatedDevices: [],
            modAvailableDevices: lodash.cloneDeep(
              this.state.modAvailableDevices
            ),
            checkedDevices: [],
            isDeleteEnabled: false,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
          },
          () => {
            this.localNodeAttribute();
          }
        );
        return;
      }
      if (locationCode === undefined || locationCode === "") {
        this.setState(
          {
            modAttributeMetaDataList: [],
            location: lodash.cloneDeep(emptyLocation),
            modLocation: lodash.cloneDeep(emptyLocation),
            bay: lodash.cloneDeep(emptyBay),
            modBay: lodash.cloneDeep(emptyBay),
            selectedLocationType: emptyLocation.LocationType,
            modAssociatedDevices: [],
            modAvailableDevices: lodash.cloneDeep(
              emptyLocation.AvailableDevices
            ),
            checkedDevices: [],
            isDeleteEnabled: false,
            isReadyToRender: true,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
          },
          () => {
            this.localNodeAttribute();
          }
        );
        return;
      }
      var keyCode = [
        {
          key: KeyCodes.locationCode,
          value: locationCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: terminalCode,
        },
        {
          Key: KeyCodes.locationtype,
          Value: this.props.locationtype,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetLocationDetails,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let modAssociatedDevices = lodash.cloneDeep(
            result.EntityResult.AssociatedDevices
          );

          modAssociatedDevices.forEach((item) => {
            item.DeviceType = getKeyByValue(
              Constants.deviceTypeCode,
              item.DeviceType
            );
          });

          this.setState({
            selectedLocationType: lodash.cloneDeep(
              result.EntityResult.LocationType
            ),
            isReadyToRender: true,
            location: result.EntityResult,
            modLocation: lodash.cloneDeep(result.EntityResult),
            modAssociatedDevices,
            modAvailableDevices: lodash.cloneDeep(
              result.EntityResult.AvailableDevices
            ),
            checkedDevices: lodash.cloneDeep(
              result.EntityResult.AssociatedDevices
            ),
            isDeleteEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
          });
          this.getBay(locationCode);
        } else {
          this.setState({
            selectedLocationType: emptyLocation.LocationType,
            location: lodash.cloneDeep(emptyLocation),
            modLocation: lodash.cloneDeep(emptyLocation),
            bay: lodash.cloneDeep(emptyBay),
            modBay: lodash.cloneDeep(emptyBay),
            isReadyToRender: true,
            modAssociatedDevices: [],
            modAvailableDevices: [],
            checkedDevices: [],
            isDeleteEnabled: false,
          });
        }
      });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on getLocation", error);
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeMetaDataList = [];
      var modAttributeMetaDataList = [];
      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      modAttributeMetaDataList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );
      var modBay = lodash.cloneDeep(this.state.modBay);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.bay.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modBay.Attributes.find((bayAttribute) => {
                return bayAttribute.TerminalCode === terminal;
              });
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
      });
      modAttributeMetaDataList = [];
      modAttributeMetaDataList = attributesTerminalsList;
      modAttributeMetaDataList = Utilities.attributesConvertoDecimal(
        modAttributeMetaDataList
      );
      attributeValidationErrors.forEach((attributeValidation) => {
        var existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        }
      });

      this.setState({ modAttributeMetaDataList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "BayDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      this.terminalSelectionChange([this.props.selectedTerminal]);
    } catch (error) {
      console.log(
        "BayDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getBay(locationCode) {
    let terminalCode = this.props.selectedTerminal;
    try {
      var keyCode = [
        {
          key: KeyCodes.bayCode,
          value: locationCode,
        },
        {
          key: KeyCodes.terminalCode,
          value: terminalCode,
        },
        {
          Key: KeyCodes.locationtype,
          Value: this.props.locationtype,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bayCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetBayDetails,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              modAttributeMetaDataList: [],
              isReadyToRender: true,
              bay: lodash.cloneDeep(result.EntityResult),
              modBay: lodash.cloneDeep(result.EntityResult),
              isDeleteEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.remove,
                Utilities.getSiteViewFunctionGroup(
                  this.props.transportationtype
                )
              ),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                Utilities.getSiteViewFunctionGroup(
                  this.props.transportationtype
                )
              ),
            },
            () => {
              this.terminalSelectionChange([result.EntityResult.TerminalCode]);
            }
          );
        } else {
          this.setState({
            isReadyToRender: true,
            bay: lodash.cloneDeep(emptyBay),
            modBay: lodash.cloneDeep(emptyBay),
            isDeleteEnabled: false,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
          });
        }
      });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on getBay", error);
    }
  }
  getLoadingTypes() {
    axios(
      RestAPIs.GetLoadingType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var loadingTypeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ loadingTypeOptions });
          }
        } else {
          console.log("Error in getLoadingTypes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getLoadingTypes:", error);
      });
  }

  getBayTypes() {
    axios(
      RestAPIs.GetBayTypes,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var bayTypeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ bayTypeOptions });
          }
        } else {
          console.log("Error in getBayTypes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getBayTypes:", error);
      });
  }

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modAssociatedDevices = lodash.cloneDeep(
        this.state.modAssociatedDevices
      );
      modAssociatedDevices[cellData.rowIndex][cellData.field] = newVal;
      this.setState({ modAssociatedDevices });
    } catch (error) {
      console.log(
        "BayDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };

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
        "BayDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    try {
      let modLocation = lodash.cloneDeep(this.state.modLocation);
      modLocation[propertyName] = data;
      let modBay = lodash.cloneDeep(this.state.modBay);
      modBay[propertyName] = data;
      const validationErrors = { ...this.state.validationErrors };
      if (modLocation.Active === this.state.location.Active) {
        if (
          this.state.location.Remarks === modLocation.Remarks ||
          modLocation.Remarks === ""
        ) {
          validationErrors.Remarks = "";
        }
        if (modLocation.Remarks === "")
          modLocation.Remarks = this.state.location.Remarks;
      }
      if (propertyName === "Active") {
        if (modLocation.Active !== this.state.location.Active) {
          modLocation.Remarks = "";
        }
      }
      if (locationValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          locationValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modLocation, modBay });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on handleChange", error);
    }
  };

  handleCheckboxChanged = (deviceCode, deviceType, checked) => {
    try {
      let modAvailableDevices = lodash.cloneDeep(
        this.state.modAvailableDevices
      );
      var devTypeIndx = modAvailableDevices.findIndex(
        (dev) => dev.DeviceType === deviceType
      );
      if (devTypeIndx !== undefined) {
        var devCodeIndx = modAvailableDevices[devTypeIndx].DeviceList.findIndex(
          (dvCode) => dvCode.DeviceCode === deviceCode
        );
      }
      if (devCodeIndx !== undefined) {
        modAvailableDevices[devTypeIndx].DeviceList[devCodeIndx].IsAssociated =
          checked;
      }
      this.setState({
        modAvailableDevices,
      });

      let dv = {
        DeviceType: deviceType,
        DeviceCode: deviceCode,
        DeviceModel: null,
      };

      let checkedDevices = lodash.cloneDeep(this.state.checkedDevices);

      if (
        checked === true &&
        checkedDevices.filter((dv1) => dv1.DeviceCode === deviceCode).length ===
        0
      ) {
        checkedDevices.push(dv);
        this.setState({
          checkedDevices,
        });
      } else if (
        checked === false &&
        this.state.checkedDevices.filter((dv1) => dv1.DeviceCode === deviceCode)
          .length > 0
      ) {
        checkedDevices = checkedDevices.filter(
          (dv1) => dv1.DeviceCode !== deviceCode
        );
        this.setState({
          checkedDevices,
        });
      }

      console.log("checkeddevices", this.state.checkedDevices);
    } catch (error) {
      console.log(
        "BayDetailsComposite:Error occured on handleCheckboxChanged",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modLocation = lodash.cloneDeep(this.state.modLocation);
      modLocation.Active = value;
      if (modLocation.Active !== this.state.location.Active)
        modLocation.Remarks = "";
      this.setState({ modLocation });
    } catch (error) {
      console.log(
        "BayDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };


  saveBay = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempBay = lodash.cloneDeep(this.state.tempBay);
      let tempLocation = lodash.cloneDeep(this.state.tempLocation);


      this.state.location.LocationCode === ""
        ? this.createLocation(tempLocation, tempBay)
        : this.updateLocation(tempLocation, tempBay);

    } catch (error) {
      console.log("BayCompositeDetails : Error in saveBay");
    }
  };


  handleSave = () => {
    try {
      //   this.setState({ saveEnabled: false });
      let modLocation = this.fillDetails();
      let modBay = this.fillBayDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(modLocation, attributeList)) {
        attributeList = Utilities.attributesDatatypeConversion(attributeList);
        modBay.Attributes = Utilities.fillAttributeDetails(attributeList);

        let showSaveAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempBay = lodash.cloneDeep(modBay);
        let tempLocation = lodash.cloneDeep(modLocation);
        this.setState({ showSaveAuthenticationLayout, tempBay, tempLocation }, () => {
          if (showSaveAuthenticationLayout === false) {
            this.saveBay();
          }
        });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on handleSave", error);
    }
  };

  createLocation(modLocation, modBay) {
    try {
      let keyCode = [
        {
          key: KeyCodes.locationCode,
          value: modLocation.LocationCode,
        },
      ];

      let req = {
        LocationInfo: modLocation,
        BayInfo: modBay,
        isBayRequest: true,
      };

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
        Entity: req,
      };
      let notification = {
        messageType: "critical",
        message: [
          this.state.selectedLocationType === "Bay" ||
            this.state.selectedLocationType === "Cluster"
            ? this.state.selectedLocationType + "SavedSuccess"
            : "LocationInfo_BerthSaveSuccess",
        ],
        messageResultDetails: [
          {
            keyFields: [this.state.selectedLocationType + "Code"],
            keyValues: [modLocation.LocationCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateLocation,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getLocation({
            selectedlocation: this.state.modLocation.LocationCode,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
        }

        this.props.onSaved(this.state.modLocation, "add", notification);
      });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on createLocation", error);
    }
  }

  createBay(modBay) {
    try {
      let keyCode = [
        {
          key: KeyCodes.bayCode,
          value: modBay.BayCode,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bayCode,
        KeyCodes: keyCode,
        Entity: modBay,
      };
      let notification = {
        messageType: "critical",
        message: [
          this.state.selectedLocationType === "Bay" ||
            this.state.selectedLocationType === "Cluster"
            ? this.state.selectedLocationType + "SavedSuccess"
            : "LocationInfo_BerthSaveSuccess",
        ],
        messageResultDetails: [
          {
            keyFields: [
              this.state.selectedLocationType === "Bay" ||
                this.state.selectedLocationType === "Cluster"
                ? this.state.selectedLocationType + "Code"
                : "LocationInfo_BerthCode",
            ],
            keyValues: [modBay.BayCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateBay,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getLocation({
            selectedlocation: this.state.modLocation.LocationCode,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modLocation, "add", notification);
      });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on createBay", error);
    }
  }

  updateLocation(modLocation, modBay) {
    try {
      let keyCode = [
        {
          key: KeyCodes.locationCode,
          value: modLocation.LocationCode,
        },
      ];

      let req = {
        LocationInfo: modLocation,
        BayInfo: modBay,
        isBayRequest: true,
      };

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
        Entity: req,
      };

      let notification = {
        messageType: "critical",
        message: [this.state.selectedLocationType + "SavedSuccess"],
        messageResultDetails: [
          {
            keyFields: [this.state.selectedLocationType + "Code"],
            keyValues: [modLocation.LocationCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateLocation,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getLocation({
            selectedlocation: this.state.modLocation.LocationCode,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modLocation, "update", notification);
      });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on updateLocation", error);
    }
  }

  updateBay(modBay) {
    try {
      let keyCode = [
        {
          key: KeyCodes.bayCode,
          value: modBay.BayCode,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.bayCode,
        KeyCodes: keyCode,
        Entity: modBay,
      };
      let notification = {
        messageType: "critical",
        message: [
          this.state.selectedLocationType === "Bay" ||
            this.state.selectedLocationType === "Cluster"
            ? this.state.selectedLocationType + "SavedSuccess"
            : "LocationInfo_BerthSaveSuccess",
        ],
        messageResultDetails: [
          {
            keyFields: [
              this.state.selectedLocationType === "Bay" ||
                this.state.selectedLocationType === "Cluster"
                ? this.state.selectedLocationType + "Code"
                : "LocationInfo_BerthCode",
            ],
            keyValues: [modBay.BayCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateBay,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getLocation({
            selectedlocation: this.state.modLocation.LocationCode,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modLocation, "update", notification);
      });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on updateBay", error);
    }
  }

  fillDetails() {
    try {
      let modLocation = lodash.cloneDeep(this.state.modLocation);
      let checkedDevices = lodash.cloneDeep(this.state.checkedDevices);
      checkedDevices.forEach((item) => {
        item.TerminalCode = this.props.selectedTerminal;
      });
      modLocation.LocationType = this.state.selectedLocationType;
      modLocation.TerminalCode = this.props.selectedTerminal;
      modLocation.AssociatedDevices = checkedDevices;

      // modLocation.TerminalCode = this.props.selectedTerminal;
      return modLocation;
    } catch (err) {
      console.log("BayDetailsComposite:Error occured on filldetails", err);
    }
  }

  fillBayDetails() {
    try {
      let modLocation = lodash.cloneDeep(this.state.modLocation);
      let modBay = lodash.cloneDeep(this.state.modBay);
      modBay.BayCode = modLocation.LocationCode;
      modBay.Name = modLocation.LocationName;
      modBay.TerminalCode = this.props.selectedTerminal;

      return modBay;
    } catch (err) {
      console.log("BayDetailsComposite:Error occured on filldetails", err);
    }
  }

  validateSave(modLocation, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(locationValidationDef).forEach(function (key) {
      if (modLocation[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          locationValidationDef[key],
          modLocation[key]
        );
    });
    if (modLocation.Active !== this.state.location.Active) {
      if (modLocation.Remarks === null || modLocation.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }
    let notification = {
      messageType: "critical",
      message: [this.state.selectedLocationType + "SavedSuccess"],
      messageResultDetails: [],
    };
    if (modLocation.AssociatedDevices.length === 0) {
      notification.messageResultDetails.push({
        keyFields: [this.state.selectedLocationType + "Code"],
        keyValues: [modLocation.LocationCode],
        isSuccess: false,
        errorMessage: "LocationInfo_DeviceRequired",
      });
    }
    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );

    attributeList.forEach((attribute) => {
      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attribute.attributeMetaDataList.forEach((attributeMetaData) => {
            attributeValidation.attributeValidationErrors[
              attributeMetaData.Code
            ] = Utilities.valiateAttributeField(
              attributeMetaData,
              attributeMetaData.DefaultValue
            );
          });
        }
      });
    });

    this.setState({ validationErrors, attributeValidationErrors });
    var returnValue = true;
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
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modLocation, "update", notification);
      return false;
    }
    return returnValue;
  }

  handleDelete = () => {
    try {
      var deleteLocationKeys = [];
      var BayCode = this.state.modLocation.LocationCode;
      var keyData = {
        keyDataCode: 0,
        ShareHolderCode: "",
        KeyCodes: [
          { Key: KeyCodes.bayCode, Value: BayCode },
          { Key: KeyCodes.terminalCode, Value: this.props.selectedTerminal },
          { Key: KeyCodes.locationtype, Value: this.props.locationtype },
        ],
      };
      deleteLocationKeys.push(keyData);
      axios(
        RestAPIs.DeleteBay,
        Utilities.getAuthenticationObjectforPost(
          deleteLocationKeys,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        var isRefreshDataRequire = result.IsSuccess;
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
          [
            (this.state.selectedLocationType === "Bay" ||
              this.state.selectedLocationType === "Cluster"
              ? this.state.selectedLocationType
              : "Berth  ") + " DeletionStatus",
          ],
          ["LocationCode", "BayCode"]
        );

        if (isRefreshDataRequire) {
          this.getLocation({
            selectedlocation: this.state.modLocation.LocationCode,
            selectedTerminal: this.props.selectedTerminal,
            isClone: true,
          });
          // this.deleteLocation();
          this.setState({
            isDeleteEnabled: false,
            showDeleteAuthenticationLayout: false,
          });
        } else {
          this.setState({ isDeleteEnabled: true, showDeleteAuthenticationLayout: false, });
        }

        notification.messageResultDetails.forEach((messageResult) => {
          if (messageResult.keyFields.length > 0)
            messageResult.keyFields[0] = [
              this.state.selectedLocationType === "Bay" ||
                this.state.selectedLocationType === "Cluster"
                ? this.state.selectedLocationType + "Code"
                : "LocationInfo_BerthCode",
            ];
        });

        this.props.onDelete(this.state.modLocation, "delete", notification);
      });
    } catch (error) {
      console.log("BayDetailsComposite:Error occured on handleDelete", error);
    }
  };

  authenticateDelete = () => {
    try {
      let showDeleteAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      this.setState({ showDeleteAuthenticationLayout });
      if (showDeleteAuthenticationLayout === false) {
        this.handleDelete();
      }
    } catch (error) {
      console.log("BayDetailsComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showSaveAuthenticationLayout: false,
      showDeleteAuthenticationLayout: false,
    });
  };

  handleOperation() {
    return this.state.showDeleteAuthenticationLayout ? this.handleDelete : this.saveBay;
  };

  getFunctionGroupName() {
    if (this.state.selectedLocationType === Constants.siteViewLocationType.CLUSTER)
      return fnRailSiteView;
    else if (this.state.selectedLocationType === Constants.siteViewLocationType.BERTH)
      return fnMarineSiteView
    else
      return fnSiteView
  };

  getFunctionName() {
    return this.state.showDeleteAuthenticationLayout ? functionGroups.remove :
      this.state.bay.Code === ""
        ? functionGroups.add
        : functionGroups.modify
  };

  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modLocation.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(this.state.modLocation.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modLocation.LastActiveTime !== undefined &&
            this.state.modLocation.LastActiveTime !== null
            ? new Date(
              this.state.modLocation.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modLocation.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modLocation.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modLocation.CreatedTime).toLocaleTimeString(),
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <TMDetailsHeader
                entityCode={this.state.location.LocationCode}
                newEntityName={
                  this.state.selectedLocationType === "Bay" ||
                    this.state.selectedLocationType === "Cluster"
                    ? "New" + this.state.selectedLocationType
                    : t("LocationInfo_NewBerth")
                }
                popUpContents={popUpContents}
              ></TMDetailsHeader>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        <ErrorBoundary>
          <BayDetails
            location={this.state.location}
            modLocation={this.state.modLocation}
            bay={this.state.bay}
            modBay={this.state.modBay}
            selectedLocationType={this.state.selectedLocationType}
            modAvailableDevices={this.state.modAvailableDevices}
            modAssociatedDevices={this.state.modAssociatedDevices}
            listOptions={{
              loadingTypeOptions: this.state.loadingTypeOptions,
              bayTypeOptions: this.state.bayTypeOptions,
            }}
            validationErrors={this.state.validationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            attributeMetaDataList={this.state.attributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
            onFieldChange={this.handleChange}
            checkBoxChanged={this.handleCheckboxChanged}
            handleCellDataEdit={this.handleCellDataEdit}
            onActiveStatusChange={this.handleActiveStatusChange}
          ></BayDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <SiteDetailsUserActions
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            handleSave={this.handleSave}
            handleDelete={this.authenticateDelete}
            saveEnabled={this.state.saveEnabled}
            isDeleteEnabled={this.state.isDeleteEnabled}
          ></SiteDetailsUserActions>
        </ErrorBoundary>
        {this.state.showDeleteAuthenticationLayout || this.state.showSaveAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getFunctionName()}
            functionGroup={this.getFunctionGroupName()}
            handleClose={this.handleAuthenticationClose}
            handleOperation={this.handleOperation()}
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

export default connect(mapStateToProps)(BayDetailsComposite);
