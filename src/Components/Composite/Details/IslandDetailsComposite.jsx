import React, { Component } from "react";
import { emptyLocation } from "../../../JS/DefaultEntities";
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
import IslandDetails from "../../UIBase/Details/IslandDetails";
import { islandValidationDef } from "../../../JS/ValidationDef";
import { locationValidationDef } from "../../../JS/ValidationDef";
import { functionGroups, fnSiteView } from "../../../JS/FunctionGroups";
import { getKeyByValue } from "../../../JS/Utilities";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class IslandDetailsComposite extends Component {
  state = {
    island: {},
    modIsland: {},
    location: {},
    modLocation: {},
    saveEnabled: false,
    isDeleteEnabled: false,
    selectedLocationType: "",
    isReadyToRender: false,
    modAvailableDevices: [],
    modAssociatedDevices: [],
    checkedDevices: [],
    validationErrors: Utilities.getInitialValidationErrors(islandValidationDef),
    showDeleteAuthenticationLayout: false,
    showSaveAuthenticationLayout: false,
    tempIsland: {},
    tempLocation: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getDeviceList(this.props);
      // this.getIsland(this.props);
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        nextProps.Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getDeviceList(nextProps);
        // this.getIsland(nextProps);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getDeviceList(props) {
    let locationType = props.locationtype;
    let terminalCode = this.props.selectedTerminal;
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
              this.getIsland(props);
            });
          else this.getIsland(props);
        } else {
          this.getIsland(props);
        }
      });
    } catch (err) {
      console.log("IslandDetailsComposite:Error occured on getDeviceList", err);
    }
  }

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
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on handleCheckboxChanged",
        error
      );
    }
  };

  getIsland(propsResult) {
    try {
      let locationCode = propsResult.selectedlocation;
      let terminalCode = propsResult.selectedTerminal;
      this.setState({
        selectedLocationType: Constants.siteViewLocationType.ISLAND,
      });
      emptyLocation.LocationType = Constants.siteViewLocationType.ISLAND;
      emptyLocation.AvailableDevices = this.state.modAvailableDevices;
      if (propsResult.isClone === true) {
        this.setState({
          selectedLocationType: Constants.siteViewLocationType.ISLAND,
          location: lodash.cloneDeep(emptyLocation),
          modLocation: lodash.cloneDeep(emptyLocation),
          isReadyToRender: true,
          modAssociatedDevices: [],
          modAvailableDevices: lodash.cloneDeep(this.state.modAvailableDevices),
          checkedDevices: [],
          isDeleteEnabled: false,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnSiteView
          ),
        });
        return;
      }
      if (locationCode === undefined || locationCode === "") {
        this.setState({
          location: lodash.cloneDeep(emptyLocation),
          modLocation: lodash.cloneDeep(emptyLocation),
          selectedLocationType: emptyLocation.LocationType,
          modAssociatedDevices: [],
          modAvailableDevices: lodash.cloneDeep(emptyLocation.AvailableDevices),
          checkedDevices: [],
          isDeleteEnabled: false,
          isReadyToRender: true,
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnSiteView
          ),
        });
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

          if (Array.isArray(modAssociatedDevices))
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
            isDeleteEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              fnSiteView
            ),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnSiteView
            ),
          });
        } else {
          this.setState({
            selectedLocationType: emptyLocation.LocationType,
            location: lodash.cloneDeep(emptyLocation),
            modLocation: lodash.cloneDeep(emptyLocation),
            isReadyToRender: true,
            modAssociatedDevices: [],
            modAvailableDevices: [],
            checkedDevices: [],
            isDeleteEnabled: false,
          });
        }
      });
    } catch (error) {
      console.log("IslandDetailsComposite:Error occured on getIsland", error);
    }
  }

  handleChange = (propertyName, data) => {
    try {
      let modLocation = lodash.cloneDeep(this.state.modLocation);
      modLocation[propertyName] = data;
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
      this.setState({ validationErrors, modLocation });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    try {
      let modAssociatedDevices = lodash.cloneDeep(
        this.state.modAssociatedDevices
      );
      modAssociatedDevices[cellData.rowIndex][cellData.field] = newVal;
      this.setState({ modAssociatedDevices });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on handleCellDataEdit",
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
        "LocationDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };


  saveIsland = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempIsland = lodash.cloneDeep(this.state.tempIsland);
      let tempLocation = lodash.cloneDeep(this.state.tempLocation);
      this.state.location.LocationCode === ""
          ? this.createIsland(tempIsland, tempLocation)
          : this.updateIsland(tempIsland, tempLocation);
    } catch (error) {
      console.log("IslandComposite : Error in saveIsland");
    }
  };


  handleSave = () => {
    try {
   //   this.setState({ saveEnabled: false });
      let modLocation = this.fillLocationDetails();
      let modIsland = this.fillDetails();

      if (this.validateSave(modLocation)) {
        
        let showSaveAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempIsland = lodash.cloneDeep(modIsland);
      let tempLocation = lodash.cloneDeep(modLocation);
      this.setState({ showSaveAuthenticationLayout, tempIsland, tempLocation}, () => {
        if (showSaveAuthenticationLayout === false) {
          this.saveIsland();
        }
    });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("IslandDetailsComposite:Error occured on handleSave", error);
    }
  };

  fillLocationDetails() {
    try {
      let modLocation = lodash.cloneDeep(this.state.modLocation);
      let checkedDevices = lodash.cloneDeep(this.state.checkedDevices);
      checkedDevices.forEach((item) => {
        item.TerminalCode = this.props.selectedTerminal;
      });
      modLocation.LocationType = this.state.selectedLocationType;
      modLocation.TerminalCode = this.props.selectedTerminal;
      modLocation.AssociatedDevices = checkedDevices;
      return modLocation;
    } catch (err) {
      console.log(
        "IslandDetailsComposite:Error occured on fillLocationDetails",
        err
      );
    }
  }

  fillDetails() {
    try {
      let modLocation = lodash.cloneDeep(this.state.modLocation);
      let modIsland = lodash.cloneDeep(this.state.modIsland);
      modIsland.Code = modLocation.LocationCode;
      modIsland.Name = modLocation.LocationName;
      modIsland.EntityTypeCode = this.state.selectedLocationType;
      modIsland.ParentCode = this.props.parentCode;
      modIsland.TerminalCode = this.props.selectedTerminal;
      modIsland.Active = modLocation.Active;
      modIsland.Description = modLocation.Description;
      modIsland.Remarks = modLocation.Remarks;
      return modIsland;
    } catch (err) {
      console.log("IslandDetailsComposite:Error occured on filldetails", err);
    }
  }

  validateSave(modLocation) {
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
    this.setState({ validationErrors });
    var returnValue = Object.values(validationErrors).every(function (value) {
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
      var IslandCode = this.state.modLocation.LocationCode;
      var keyData = {
        keyDataCode: 0,
        ShareHolderCode: "",
        KeyCodes: [
          {
            Key: KeyCodes.locationCode,
            Value: IslandCode,
          },
          {
            Key: KeyCodes.terminalCode,
            Value: this.props.selectedTerminal,
          },
        ],
      };
      let notification = {
        messageType: "critical",
        message: [this.state.selectedLocationType + "DeletionStatus"],
        messageResultDetails: [
          {
            keyFields: [Constants.siteViewLocationType.ISLAND + "Code"],
            keyValues: [IslandCode],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.DeleteIsland,
        Utilities.getAuthenticationObjectforPost(
          keyData,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;

        if (result.IsSuccess === true) {
          this.deleteLocation();
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            isDeleteEnabled: true,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.remove,
              fnSiteView
            ),
            showDeleteAuthenticationLayout: false,
          });

          this.props.onDelete(this.state.modLocation, "delete", notification);
        }
      });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on handleDelete",
        error
      );
    }
  };

  deleteLocation() {
    try {
      var deleteLocationKeys = [];
      var LocationCode = this.state.modLocation.LocationCode;
      var keyData = {
        keyDataCode: 0,
        ShareHolderCode: "",
        KeyCodes: [
          {
            Key: KeyCodes.locationCode,
            Value: LocationCode,
          },
          {
            Key: KeyCodes.terminalCode,
            Value: this.props.selectedTerminal,
          },
        ],
      };
      deleteLocationKeys.push(keyData);
      axios(
        RestAPIs.DeleteLocation,
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
          [this.state.selectedLocationType + "DeletionStatus"],
          ["LocationCode"]
        );
        if (isRefreshDataRequire) {
          this.getIsland({
            selectedlocation: this.state.modLocation.LocationCode,
            selectedTerminal: this.props.selectedTerminal,
            isClone: true,
          });
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
              this.state.selectedLocationType + "Code",
            ];
        });

        this.props.onDelete(this.state.modLocation, "delete", notification);
      });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on handleDelete",
        error
      );
    }
  }

  createIsland(modIsland, modLocation) {
    try {
      let keyCode = [
        {
          key: KeyCodes.entityCode,
          value: modIsland.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
        Entity: modIsland,
      };
      let notification = {
        messageType: "critical",
        message: [this.state.selectedLocationType + "SavedSuccess"],
        messageResultDetails: [
          {
            keyFields: [this.state.selectedLocationType + "Code"],
            keyValues: [modIsland.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateEntity,
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
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.createLocation(modLocation);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.props.onSaved(this.state.modGantry, "add", notification);
        }
      });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on createIsland",
        error
      );
    }
  }

  createLocation(modLocation) {
    try {
      let keyCode = [
        {
          key: KeyCodes.locationCode,
          value: modLocation.LocationCode,
        },
      ];

      let req = {
        LocationInfo: modLocation,
        BayInfo: null,
        isBayRequest: false,
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
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getIsland({
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
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modLocation, "add", notification);
      });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on createLocation",
        error
      );
    }
  }

  updateIsland(modIsland, modLocation) {
    try {
      let keyCode = [
        {
          key: KeyCodes.entityCode,
          value: modIsland.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.locationCode,
        KeyCodes: keyCode,
        Entity: modIsland,
      };
      let notification = {
        messageType: "critical",
        message: [this.state.selectedLocationType + "SavedSuccess"],
        messageResultDetails: [
          {
            keyFields: [this.state.selectedLocationType + "Code"],
            keyValues: [modIsland.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateEntity,
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
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.updateLocation(modLocation);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.props.onSaved(this.state.modGantry, "add", notification);
        }
      });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on updateIsland",
        error
      );
    }
  }

  updateLocation(modLocation) {
    try {
      let keyCode = [
        {
          key: KeyCodes.locationCode,
          value: modLocation.LocationCode,
        },
      ];

      let req = {
        LocationInfo: modLocation,
        BayInfo: null,
        isBayRequest: false,
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
              functionGroups.modify,
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getIsland({
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
              functionGroups.modify,
              fnSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modLocation, "update", notification);
      });
    } catch (error) {
      console.log(
        "IslandDetailsComposite:Error occured on updateLocation",
        error
      );
    }
  }

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
      console.log("IslandComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showSaveAuthenticationLayout: false,
      showDeleteAuthenticationLayout: false,
    });
  };

  handleOperation()  {
    return this.state.showDeleteAuthenticationLayout?this.handleDelete:this.saveIsland;
 };

 getFunctionName() {
  return this.state.showDeleteAuthenticationLayout? functionGroups.remove: 
        this.state.island.Code === ""
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
          this.state.modLocation.LastActive !== undefined &&
          this.state.modLocation.LastActive !== null
            ? new Date(this.state.modLocation.LastActive).toLocaleDateString() +
              " " +
              new Date(this.state.modLocation.LastActive).toLocaleTimeString()
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
          <TMDetailsHeader
            entityCode={this.state.location.LocationCode}
            newEntityName={"New" + this.state.selectedLocationType}
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <IslandDetails
            location={this.state.location}
            modLocation={this.state.modLocation}
            modAvailableDevices={this.state.modAvailableDevices}
            modAssociatedDevices={this.state.modAssociatedDevices}
            selectedLocationType={this.state.selectedLocationType}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            checkBoxChanged={this.handleCheckboxChanged}
            handleCellDataEdit={this.handleCellDataEdit}
            onActiveStatusChange={this.handleActiveStatusChange}
          ></IslandDetails>
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
        {this.state.showDeleteAuthenticationLayout || this.state.showSaveAuthenticationLayout ?  (
          <UserAuthenticationLayout
          Username={this.props.userDetails.EntityResult.UserName}
          functionName={this.getFunctionName()}
          functionGroup={fnSiteView}
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

export default connect(mapStateToProps)(IslandDetailsComposite);
