import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TankDetails } from "../../UIBase/Details/TankDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyTank } from "../../../JS/DefaultEntities";
import { tankValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import {
  functionGroups,
  fnTank,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { tankAttributeEntity } from "../../../JS/AttributeEntity";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Button } from "@scuf/common";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiTankDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";
class TankDetailsComposite extends Component {
  state = {
    tank: lodash.cloneDeep(emptyTank),
    modTank: {},
    validationErrors: Utilities.getInitialValidationErrors(tankValidationDef),
    isReadyToRender: false,
    saveEnabled: false,
    terminalOptions: [],
    tankModeOptions: [],
    tankGroupOptions: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    tankGroupBaseProduts: {},
    volumeUOMOptions: [],
    weightUOMOptions: [],
    lengthUOMOptions: [],
    densityUOMOptions: [],
    massUOMOptions: [],
    temperatureUOMOptions: [],
    pressureUOMOptions: [],
    isEnableATGButton: false,
    isEnableATGConfigButton: false,
    isBondingEnable: false,
    isATGEnabled: false,
    atgInfoDisable: lodash.cloneDeep(Utilities.atgDisableInfo),
    isChangeBondedStatus: false,
    tankKPIList: [],
    showAuthenticationLayout: false,
    tempTank: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
      this.GetTankMode();
      if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.getTerminal();
      } else {
        this.getLocalNodeTankGroup();
      }
      this.getUOMList();
      this.getLookUpData();
    } catch (error) {
      console.log(
        "TankDetailsCompositeComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.tank.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAttributes(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(tankRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [tankAttributeEntity],
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
                  result.EntityResult.tank
                ),
            },
            () => this.getTank(tankRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getTank(tankRow) {
    if (tankRow.Common_Code === undefined) {
      this.setState(
        {
          tank: lodash.cloneDeep(emptyTank),
          modTank: lodash.cloneDeep(emptyTank),
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          tankKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTank
          ),
          atgInfoDisable: lodash.cloneDeep(Utilities.atgDisableInfo),
          isEnableATGButton: false,
          isEnableATGConfigButton: false,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange([]);
          } else {
            this.localNodeAttribute();
          }
        }
      );
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.tankCode,
        value: tankRow.Common_Code,
      },

      {
        key: KeyCodes.terminalCode,
        value: tankRow.TerminalCode !== "" ? tankRow.TerminalCode : null,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.tankCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetTank,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult.GrossVolume === null)
            result.EntityResult.GrossVolumeUOM = null;
          if (result.EntityResult.NetVolume === null)
            result.EntityResult.NetVolumeUOM = null;
          this.setState(
            {
              isReadyToRender: true,
              tank: lodash.cloneDeep(result.EntityResult),
              modTank: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnTank
              ),
            },
            () => {
              this.handleTankGroupChange(result.EntityResult.TankGroupCode);
              this.getKPIList(result.EntityResult.Code);
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.handleTerminalChange(result.EntityResult.TerminalCode);
                this.terminalSelectionChange([
                  result.EntityResult.TerminalCode,
                ]);
              } else {
                this.localNodeAttribute();
              }
              this.GetTankATGConfiguration(result.EntityResult.Code);
            }
          );
        } else {
          this.setState({
            tank: lodash.cloneDeep(emptyTank),
            modTank: lodash.cloneDeep(emptyTank),
            isReadyToRender: true,
          });
          console.log("Error in getTank:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Tank:", error, tankRow);
      });
  }

  GetTankATGConfiguration(TankCode) {
    const atgInfoDisable = lodash.cloneDeep(this.state.atgInfoDisable);
    const isATGEnabled = lodash.cloneDeep(this.state.isATGEnabled);

    try {
      axios(
        RestAPIs.GetTankATGConfiguration + "?TankCode=" + TankCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult.EnableTankScan && isATGEnabled === true) {
              result.EntityResult.AtgAttributeConfigurationData.forEach(
                (atgconfig) => {
                  if (atgconfig.EnableScan === true) {
                    if (atgconfig.TankAttributeCode === "TankMode")
                      atgInfoDisable["TankMode"] = true;
                    else if (atgconfig.TankAttributeCode === "Density")
                      atgInfoDisable["Density"] = true;
                    else if (atgconfig.TankAttributeCode === "AvailableRoom")
                      atgInfoDisable["AvailableRoom"] = true;
                    else if (atgconfig.TankAttributeCode === "Temperature")
                      atgInfoDisable["Temperature"] = true;
                    else if (atgconfig.TankAttributeCode === "TankLevel")
                      atgInfoDisable["TankLevel"] = true;
                    else if (atgconfig.TankAttributeCode === "GrossVolume")
                      atgInfoDisable["GrossVolume"] = true;
                    else if (atgconfig.TankAttributeCode === "NetVolume")
                      atgInfoDisable["NetVolume"] = true;
                    else if (
                      atgconfig.TankAttributeCode === "VapourGrossQuantity"
                    )
                      atgInfoDisable["VapourGrossQuantity"] = true;
                    else if (
                      atgconfig.TankAttributeCode === "VapourNetQuantity"
                    )
                      atgInfoDisable["VapourNetQuantity"] = true;
                    else if (atgconfig.TankAttributeCode === "Pressure")
                      atgInfoDisable["Pressure"] = true;
                    else if (atgconfig.TankAttributeCode === "WaterLevel")
                      atgInfoDisable["WaterLevel"] = true;
                    else if (atgconfig.TankAttributeCode === "WaterVolume")
                      atgInfoDisable["WaterVolume"] = true;
                    else if (atgconfig.TankAttributeCode === "Mass")
                      atgInfoDisable["Mass"] = true;
                    else if (atgconfig.TankAttributeCode === "NetMass")
                      atgInfoDisable["NetMass"] = true;
                  }
                }
              );
            }
            this.setState({
              isEnableATGButton: result.EntityResult.EnableTankScan,
              atgInfoDisable,
            });
          } else {
            console.log("Error in GetTankATGConfiguration:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting GetTankATGConfiguration:", error);
        });
    } catch (error) {
      console.log("Error while getting GetTankATGConfiguration:", error);
    }
  }

  getTerminal() {
    axios(
      RestAPIs.GetTerminals,
      Utilities.getAuthenticationObjectforPost(
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let terminalOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ terminalOptions });
          }
        } else {
          console.log("Error in getTerminal:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Terminal:", error);
      });
  }

  GetTankMode() {
    axios(
      RestAPIs.GetTankMode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let tankModeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ tankModeOptions });
          }
        } else {
          console.log("Error in GetTankMode:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting TankMode:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modTank = lodash.cloneDeep(this.state.modTank);
      const tank = lodash.cloneDeep(this.state.tank);

      if (propertyName === "IsBonded") {
        if (tank.Code !== "") {
          if (tank.IsBonded !== data)
            this.setState({ isChangeBondedStatus: true });
        } else {
          this.setState({ isChangeBondedStatus: true });
        }
      }

      modTank[propertyName] = data;
      this.setState({ modTank });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (tankValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          tankValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log("TankDetailsComposite:Error occured on handleChange", error);
    }
  };

  handleTerminalChange = (data) => {
    try {
      const modTank = lodash.cloneDeep(this.state.modTank);
      const validationErrors = { ...this.state.validationErrors };
      modTank["TerminalCode"] = data;
      // modTank["TankGroupCode"] = "";
      //modTank["BaseProductCode"] = "";
      modTank["BPDensityUOM"] = "";
      modTank["BPMinDensity"] = "";
      modTank["BPMaxDensity"] = "";

      validationErrors["TerminalCode"] = "";
      this.terminalSelectionChange([data]);
      this.setState({ modTank, validationErrors }, () =>
        this.getTankGroup(data)
      );
    } catch (error) {
      console.log(
        "TankGroupDetailsComposite:Error occured on handleTerminalChange",
        error
      );
    }
  };

  handleTankGroupChange = (data) => {
    try {
      const modTank = lodash.cloneDeep(this.state.modTank);
      const tankGroupBaseProduts = lodash.cloneDeep(
        this.state.tankGroupBaseProduts
      );

      const validationErrors = { ...this.state.validationErrors };
      modTank["TankGroupCode"] = data;
      modTank["BaseProductCode"] = tankGroupBaseProduts[data];
      modTank["BPDensityUOM"] = "";
      modTank["BPMinDensity"] = "";
      modTank["BPMaxDensity"] = "";
      validationErrors["TankGroupCode"] = "";
      this.setState({ modTank, validationErrors }, () =>
        this.GetProductData(data)
      );
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on handleTankGroupChange",
        error
      );
    }
  };

  GetProductData(TankGroupCode) {
    try {
      const modTank = lodash.cloneDeep(this.state.modTank);

      axios(
        RestAPIs.GetProductData + "?TankGroupCode=" + TankGroupCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (
              result.EntityResult !== null &&
              result.EntityResult !== undefined
            ) {
              modTank["BPDensityUOM"] = result.EntityResult.DensityUOM;
              if (
                result.EntityResult.MinDensity !== null &&
                result.EntityResult.MinDensity !== ""
              )
                modTank["BPMinDensity"] = parseFloat(
                  result.EntityResult.MinDensity
                );
              if (
                result.EntityResult.MaxDensity !== null &&
                result.EntityResult.MaxDensity !== ""
              )
                modTank["BPMaxDensity"] = parseFloat(
                  result.EntityResult.MaxDensity
                );
              this.setState({ modTank });
            }
          } else {
            console.log("Error in GetProductData:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting ProductData:", error);
        });
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on GetProductData",
        error
      );
    }
  }

  getTankGroup(terminalcode) {
    axios(
      RestAPIs.GetTankGroupData + "?terminalcode=" + terminalcode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        let tankGroupOptions = [];
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            Object.keys(result.EntityResult).forEach((element) => {
              tankGroupOptions.push({ text: element, value: element });
            });
          }
          this.setState({
            tankGroupOptions,
            tankGroupBaseProduts: result.EntityResult,
          });
        } else {
          console.log("Error in getTankGroup:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting TankGroup:", error);
      });
  }

  getLocalNodeTankGroup() {
    axios(
      RestAPIs.GetTankGroupData,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        let tankGroupOptions = [];
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            Object.keys(result.EntityResult).forEach((element) => {
              tankGroupOptions.push({ text: element, value: element });
            });
          }
          this.setState({
            tankGroupOptions,
            tankGroupBaseProduts: result.EntityResult,
          });
        } else {
          console.log("Error in getLocalNodeTankGroup:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting LocalNodeTankGroup:", error);
      });
  }

  getUOMList() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let weightUOMs = result.EntityResult.MASS;
            let volumeUOMOptions = [];
            let massUOMOptions = [];
            weightUOMs.forEach((weightOption) => {
              massUOMOptions.push({
                text: weightOption,
                value: weightOption,
              });
            });

            let volumeUOMs = result.EntityResult.VOLUME;

            volumeUOMs.forEach((volumeOption) => {
              volumeUOMOptions.push({
                text: volumeOption,
                value: volumeOption,
              });
            });

            let lengthUOMs = result.EntityResult.LENGTH;
            let lengthUOMOptions = [];
            lengthUOMs.forEach((lengthOption) => {
              lengthUOMOptions.push({
                text: lengthOption,
                value: lengthOption,
              });
            });
            let densityUOMs = result.EntityResult.DENSITY;
            let densityUOMOptions = [];
            densityUOMs.forEach((densityOption) => {
              densityUOMOptions.push({
                text: densityOption,
                value: densityOption,
              });
            });

            let temperatureUOMs = result.EntityResult.TEMPERATURE;
            let temperatureUOMOptions = [];
            temperatureUOMs.forEach((temperatureOption) => {
              temperatureUOMOptions.push({
                text: temperatureOption,
                value: temperatureOption,
              });
            });

            let pressureUOMs = result.EntityResult.PRESSURE;
            let pressureUOMOptions = [];
            pressureUOMs.forEach((pressureOption) => {
              pressureUOMOptions.push({
                text: pressureOption,
                value: pressureOption,
              });
            });

            this.setState({
              volumeUOMOptions,
              lengthUOMOptions,
              densityUOMOptions,
              massUOMOptions,
              temperatureUOMOptions,
              pressureUOMOptions,
            });
          }
        } else {
          console.log("Error in getUOM:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getUOM:", error);
      });
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const tank = lodash.cloneDeep(this.state.tank);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modTank: { ...tank },
          selectedCompRow: [],
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange([tank.TerminalCode]);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log("TankDetailsComposite:Error occured on handleReset", error);
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };
  handleSave = () => {
    try {
      let modTank = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(modTank, attributeList)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempTank = lodash.cloneDeep(modTank);
        this.setState({ showAuthenticationLayout, tempTank }, () => {
          if (showAuthenticationLayout === false) {
            this.saveTank();
          }
});

        
      }
    } catch (error) {
      console.log("TankDetailsComposite:Error occured on handleSave", error);
    }
  };

  saveTank = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempTank = lodash.cloneDeep(this.state.tempTank);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      tempTank = this.convertStringtoDecimal(tempTank, attributeList);
      this.state.tank.Code === ""
        ? this.createTank(tempTank)
        : this.updateTank(tempTank);
    } catch (error) {
      console.log("TankDetailsComposite : Error in saveTank");
    }
  };

  fillDetails() {
    try {
      let modTank = lodash.cloneDeep(this.state.modTank);

      modTank.Capacity =
        modTank.Capacity !== null && modTank.Capacity !== ""
          ? modTank.Capacity.toLocaleString()
          : null;
      modTank.AvailableRoom =
        modTank.AvailableRoom !== null && modTank.AvailableRoom !== ""
          ? modTank.AvailableRoom.toLocaleString()
          : null;
      modTank.Density =
        modTank.Density !== null && modTank.Density !== ""
          ? modTank.Density.toLocaleString()
          : null;
      modTank.GrossMass =
        modTank.GrossMass !== null && modTank.GrossMass !== ""
          ? modTank.GrossMass.toLocaleString()
          : null;
      modTank.GrossVolume =
        modTank.GrossVolume !== null && modTank.GrossVolume !== ""
          ? modTank.GrossVolume.toLocaleString()
          : null;
      modTank.NetVolume =
        modTank.NetVolume !== null && modTank.NetVolume !== ""
          ? modTank.NetVolume.toLocaleString()
          : null;
      modTank.WaterVolume =
        modTank.WaterVolume !== null && modTank.WaterVolume !== ""
          ? modTank.WaterVolume.toLocaleString()
          : null;
      modTank.TankLevel =
        modTank.TankLevel !== null && modTank.TankLevel !== ""
          ? modTank.TankLevel.toLocaleString()
          : null;
      modTank.WaterLevel =
        modTank.WaterLevel !== null && modTank.WaterLevel !== ""
          ? modTank.WaterLevel.toLocaleString()
          : null;
      modTank.Temperature =
        modTank.Temperature !== null && modTank.Temperature !== ""
          ? modTank.Temperature.toLocaleString()
          : null;
      modTank.Pressure =
        modTank.Pressure !== null && modTank.Pressure !== ""
          ? modTank.Pressure.toLocaleString()
          : null;
      modTank.VapourGrossQuantity =
        modTank.VapourGrossQuantity !== null &&
        modTank.VapourGrossQuantity !== ""
          ? modTank.VapourGrossQuantity.toLocaleString()
          : null;
      modTank.VapourNetQuantity =
        modTank.VapourNetQuantity !== null && modTank.VapourNetQuantity !== ""
          ? modTank.VapourNetQuantity.toLocaleString()
          : null;

      if (modTank.GrossMass === null || modTank.GrossMass === "")
        modTank.GrossMassUOM = "";
      if (modTank.GrossVolume === null || modTank.GrossVolume === "")
        modTank.GrossVolumeUOM = "";
      if (modTank.NetVolume === null || modTank.NetVolume === "")
        modTank.NetVolumeUOM = "";
      if (modTank.WaterVolume === null || modTank.WaterVolume === "")
        modTank.WaterVolumeUOM = "";
      if (modTank.Pressure === null || modTank.Pressure === "")
        modTank.PressureUOM = "";

      return modTank;
    } catch (error) {
      console.log("TankDetailsComposite:Error occured on fillDetails", error);
    }
  }

  validateSave(modTank, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(tankValidationDef).forEach(function (key) {
      if (modTank[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          tankValidationDef[key],
          modTank[key]
        );
    });

    if (modTank.Active !== this.state.tank.Active) {
      if (modTank.Remarks === null || modTank.Remarks === "") {
        validationErrors["Remarks"] = "BaseProductInfo_EnterRemarks";
      }
    }

    if (
      modTank.GrossMass !== null &&
      (modTank.GrossMassUOM === null || modTank.GrossMassUOM === "")
    ) {
      validationErrors["GrossMassUOM"] = "TankInfo_UOMRequired";
    }
    if (
      modTank.GrossVolume !== null &&
      (modTank.GrossVolumeUOM === null || modTank.GrossVolumeUOM === "")
    ) {
      validationErrors["GrossVolumeUOM"] = "TankInfo_UOMRequired";
    }
    if (
      modTank.NetVolume !== null &&
      (modTank.NetVolumeUOM === null || modTank.NetVolumeUOM === "")
    ) {
      validationErrors["NetVolumeUOM"] = "TankInfo_UOMRequired";
    }
    if (
      modTank.WaterVolume !== null &&
      (modTank.WaterVolumeUOM === null || modTank.WaterVolumeUOM === "")
    ) {
      validationErrors["WaterVolumeUOM"] = "TankInfo_UOMRequired";
    }
    if (
      (modTank.TankLevel !== null || modTank.WaterLevel !== null) &&
      (modTank.LevelUOM === null || modTank.LevelUOM === "")
    ) {
      validationErrors["LevelUOM"] = "TankInfo_UOMRequired";
    }
    if (
      modTank.Temperature !== null &&
      (modTank.TemperatureUOM === null || modTank.TemperatureUOM === "")
    ) {
      validationErrors["TemperatureUOM"] = "TankInfo_UOMRequired";
    }
    if (
      modTank.Pressure !== null &&
      (modTank.PressureUOM === null || modTank.PressureUOM === "")
    ) {
      validationErrors["PressureUOM"] = "TankInfo_UOMRequired";
    }
    if (
      (modTank.VapourGrossQuantity !== null ||
        modTank.VapourNetQuantity !== null) &&
      (modTank.VapourUOM === null || modTank.VapourUOM === "")
    ) {
      validationErrors["VapourUOM"] = "TankInfo_UOMRequired";
    }

    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      if (modTank.TerminalCode === null || modTank.TerminalCode === "") {
        validationErrors["TerminalCode"] = "TankGroupInfo_TerminalRequired";
      } else {
        validationErrors["TerminalCode"] = "";
      }
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

    return returnValue;
  }

  convertStringtoDecimal(modTank, attributeList) {
    try {
      if (modTank.Capacity !== null && modTank.Capacity !== "") {
        modTank.Capacity = Utilities.convertStringtoDecimal(modTank.Capacity);
      }
      if (modTank.AvailableRoom !== null && modTank.AvailableRoom !== "") {
        modTank.AvailableRoom = Utilities.convertStringtoDecimal(
          modTank.AvailableRoom
        );
      }
      if (modTank.Density !== null && modTank.Density !== "") {
        modTank.Density = Utilities.convertStringtoDecimal(modTank.Density);
      }
      if (modTank.GrossMass !== null && modTank.GrossMass !== "") {
        modTank.GrossMass = Utilities.convertStringtoDecimal(modTank.GrossMass);
      }
      if (modTank.GrossVolume !== null && modTank.GrossVolume !== "") {
        modTank.GrossVolume = Utilities.convertStringtoDecimal(
          modTank.GrossVolume
        );
      }
      if (modTank.NetVolume !== null && modTank.NetVolume !== "") {
        modTank.NetVolume = Utilities.convertStringtoDecimal(modTank.NetVolume);
      }
      if (modTank.WaterVolume !== null && modTank.WaterVolume !== "") {
        modTank.WaterVolume = Utilities.convertStringtoDecimal(
          modTank.WaterVolume
        );
      }
      if (modTank.TankLevel !== null && modTank.TankLevel !== "") {
        modTank.TankLevel = Utilities.convertStringtoDecimal(modTank.TankLevel);
      }
      if (modTank.WaterLevel !== null && modTank.WaterLevel !== "") {
        modTank.WaterLevel = Utilities.convertStringtoDecimal(
          modTank.WaterLevel
        );
      }
      if (modTank.Temperature !== null && modTank.Temperature !== "") {
        modTank.Temperature = Utilities.convertStringtoDecimal(
          modTank.Temperature
        );
      }
      if (modTank.Pressure !== null && modTank.Pressure !== "") {
        modTank.Pressure = Utilities.convertStringtoDecimal(modTank.Pressure);
      }
      if (
        modTank.VapourGrossQuantity !== null &&
        modTank.VapourGrossQuantity !== ""
      ) {
        modTank.VapourGrossQuantity = Utilities.convertStringtoDecimal(
          modTank.VapourGrossQuantity
        );
      }
      if (
        modTank.VapourNetQuantity !== null &&
        modTank.VapourNetQuantity !== ""
      ) {
        modTank.VapourNetQuantity = Utilities.convertStringtoDecimal(
          modTank.VapourNetQuantity
        );
      }
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modTank.Attributes = Utilities.fillAttributeDetails(attributeList);
      return modTank;
    } catch (err) {
      console.log("convertStringtoDecimal error Tank Details", err);
    }
  }

  createTank(modTank) {
    let keyCode = [
      {
        key: KeyCodes.tankCode,
        value: modTank.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.tankCode,
      KeyCodes: keyCode,
      Entity: modTank,
    };

    let notification = {
      messageType: "critical",
      message: "TankInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["TankTransaction_TankCode"],
          keyValues: [modTank.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateTank,
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
                fnTank
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getTank({
                Common_Code: modTank.Code,
                TerminalCode: modTank.TerminalCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnTank
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createTank:", result.ErrorList);
        }
        this.props.onSaved(this.state.modTank, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTank
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTank, "add", notification);
      });
  }

  updateTank(modTank) {
    let keyCode = [
      {
        key: KeyCodes.tankCode,
        value: modTank.Code,
      },
      {
        key: KeyCodes.terminalCode,
        value: modTank.TerminalCode,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.tankCode,
      KeyCodes: keyCode,
      Entity: modTank,
    };

    let notification = {
      messageType: "critical",
      message: "TankInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["TankTransaction_TankCode"],
          keyValues: [modTank.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateTank,
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
                fnTank
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getTank({
                Common_Code: modTank.Code,
                TerminalCode: modTank.TerminalCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTank
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in update Tank:", result.ErrorList);
        }
        this.props.onSaved(this.state.modTank, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnTank
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTank, "modify", notification);
      });
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
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
        var modTank = lodash.cloneDeep(this.state.modTank);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.tank.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modTank.Attributes.find(
                  (baseproductAttribute) => {
                    return baseproductAttribute.TerminalCode === terminal;
                  }
                );
                if (Attributevalue !== undefined) {
                  attributeMetaData.attributeMetaDataList.forEach(function (
                    attributeMetaData
                  ) {
                    var valueAttribute =
                      Attributevalue.ListOfAttributeData.find((x) => {
                        return x.AttributeCode === attributeMetaData.Code;
                      });
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
      }
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
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
        "TankDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList.tank) &&
        attributeMetaDataList.tank.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.tank[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.tank
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleReadATGData = () => {
    try {
      let modTank = lodash.cloneDeep(this.state.modTank);
      let notification = {
        messageType: "critical",
        message: "TankInfo_ATGDataUpdateSuccess",
        messageResultDetails: [
          {
            keyFields: ["TankTransaction_TankCode"],
            keyValues: [modTank.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.GetATGData + "?TankCode=" + modTank.Code,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              modTank: lodash.cloneDeep(result.EntityResult),
            },
            () => {
              this.handleUOMValues();
            }
          );
        } else {
          if (result.EntityResult !== null) {
            this.setState(
              {
                modTank: lodash.cloneDeep(result.EntityResult),
              },
              () => {
                this.handleUOMValues();
              }
            );
          }
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
      });
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on handleReadATGData",
        error
      );
    }
  };

  handleUOMValues() {
    const modTank = lodash.cloneDeep(this.state.modTank);
    if (modTank.GrossMass === null || modTank.GrossMass === "")
      modTank.GrossMassUOM = "";
    if (modTank.GrossVolume === null || modTank.GrossVolume === "")
      modTank.GrossVolumeUOM = "";
    if (modTank.NetVolume === null || modTank.NetVolume === "")
      modTank.NetVolumeUOM = "";
    if (modTank.WaterVolume === null || modTank.WaterVolume === "")
      modTank.WaterVolumeUOM = "";
    if (modTank.Pressure === null || modTank.Pressure === "")
      modTank.PressureUOM = "";
    if (modTank.Temperature === null || modTank.Temperature === "")
      modTank.TemperatureUOM = "";
    if (
      (modTank.VapourGrossQuantity === null ||
        modTank.VapourGrossQuantity === "") &&
      (modTank.VapourNetQuantity === null || modTank.VapourNetQuantity === "")
    )
      modTank.VapourUOM = "";
    if (
      (modTank.WaterLevel === null || modTank.WaterLevel === "") &&
      (modTank.TankLevel === null || modTank.TankLevel === "")
    )
      modTank.LevelUOM = "";
    this.setState({ modTank });
  }

  handleSaveATGData = () => {
    try {
      let modTank = lodash.cloneDeep(this.state.modTank);
      let obj = {
        keyDataCode: KeyCodes.tankCode,
        Entity: modTank,
      };
      let notification = {
        messageType: "critical",
        message: "TankInfo_ReadATGDataSuccess",
        messageResultDetails: [
          {
            keyFields: ["TankTransaction_TankCode"],
            keyValues: [modTank.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.SaveATGData,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
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
      });
    } catch (error) {
      console.log(
        "TankDetailsComposite:Error occured on handleSaveATGData",
        error
      );
    }
  };

  getLookUpData() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=Bonding",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isBondingEnable:
              result.EntityResult["EnableBondingNon-Bonding"] === "True"
                ? true
                : false,
          });
        }
      });

      if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
        axios(
          RestAPIs.GetLookUpData + "?LookUpTypeCode=ATG",
          Utilities.getAuthenticationObjectforGet(
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              isATGEnabled:
                result.EntityResult["ATGEnabled"] === "True" ? true : false,
            });
            if (result.EntityResult["ATGEnabled"] === "True") {
              if (
                this.props.selectedRow.TankList_ATGConfiguration !==
                  undefined &&
                this.props.selectedRow.TankList_ATGConfiguration !== null
              ) {
                this.setState({ isEnableATGConfigButton: true });
              }
            }
          }
        });
      }
    } catch (error) {
      console.log("TankDetailsComposite:Error occured on getLookUpData", error);
    }
  }

  handleActiveStatusChange = (value) => {
    try {
      let modTank = lodash.cloneDeep(this.state.modTank);
      modTank.Active = value;
      if (modTank.Active !== this.state.tank.Active) modTank.Remarks = "";
      this.setState({ modTank });
    } catch (error) {
      console.log(error);
    }
  };
  handleATGConfig = () => {
    try {
      let modTank = lodash.cloneDeep(this.state.modTank);
      this.props.handleATGConfiguration(modTank, this.props.selectedRow);
    } catch (error) {
      console.log(error);
    }
  };

  confirmChangeBondedStatus = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isChangeBondedStatus} size="small">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{t("Tank_ChangeBondedStatus")}</h5>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("AccessCardInfo_Ok")}
                onClick={() => {
                  this.setState({ isChangeBondedStatus: false }, () => {
                    this.bondedStatusChanged();
                  });
                }}
              />
              <Button
                type="primary"
                content={t("Cancel")}
                onClick={() => {
                  this.setState({ isChangeBondedStatus: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  bondedStatusChanged = () => {
    try {
      let modTank = lodash.cloneDeep(this.state.modTank);
      modTank.Remarks = "";
      this.setState({ modTank });
    } catch (error) {
      console.log(error);
    }
  };
  //Get KPI for Tanks
  getKPIList(tankCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiTankDetail,
        InputParameters: [{ key: "TankCode", value: tankCode }],
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
            this.setState({ tankKPIList: result.EntityResult.ListKPIDetails });
          } else {
            this.setState({ tankKPIList: [] });
            console.log("Error in tank KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Tank KPIList:", error);
        });
    }
  }
  render() {
    const listOptions = {
      terminalCode: this.state.terminalOptions,
      tankMode: this.state.tankModeOptions,
      tankGroup: this.state.tankGroupOptions,
      volumeUOM: this.state.volumeUOMOptions,
      densityUOM: this.state.densityUOMOptions,
      massUOM: this.state.massUOMOptions,
      lengthUOM: this.state.lengthUOMOptions,
      temperatureUOM: this.state.temperatureUOMOptions,
      pressureUOM: this.state.pressureUOMOptions,
    };
    const popUpContents = [
      {
        fieldName: "BaseProductInfo_LastUpdated",
        fieldValue:
          new Date(this.state.modTank.UpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modTank.UpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "BaseProductInfo_LastActivatedTime",
        fieldValue:
          this.state.modTank.LastActive !== undefined &&
          this.state.modTank.LastActive !== null
            ? new Date(this.state.modTank.LastActive).toLocaleDateString() +
              " " +
              new Date(this.state.modTank.LastActive).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "BaseProductInfo_Created",
        fieldValue:
          new Date(this.state.modTank.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modTank.CreatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "TankInfo_ATGLastUpdatedTime",
        fieldValue:
          this.state.modTank.AtgLastUpdatedTime !== undefined &&
          this.state.modTank.AtgLastUpdatedTime !== null
            ? new Date(
                this.state.modTank.AtgLastUpdatedTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modTank.AtgLastUpdatedTime
              ).toLocaleTimeString()
            : "",
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.tank.Code}
            newEntityName="TankInfo_NewTank"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.tankKPIList}>
          {" "}
        </TMDetailsKPILayout>
        <ErrorBoundary>
          <TankDetails
            tank={this.state.tank}
            modTank={this.state.modTank}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
            onTerminalChange={this.handleTerminalChange}
            onTankGroupChange={this.handleTankGroupChange}
            isEnableATGButton={this.state.isEnableATGButton}
            atgInfoDisable={this.state.atgInfoDisable}
            handleReadATGData={this.handleReadATGData}
            handleSaveATGData={this.handleSaveATGData}
            isBondingEnable={this.state.isBondingEnable}
            isATGEnabled={this.state.isATGEnabled}
            onActiveStatusChange={this.handleActiveStatusChange}
            handleATGConfiguration={this.handleATGConfig}
            isEnableATGConfigButton={this.state.isEnableATGConfigButton}
          ></TankDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.isChangeBondedStatus
          ? this.confirmChangeBondedStatus()
          : null}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.tank.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnTank}
            handleOperation={this.saveTank}
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

export default connect(mapStateToProps)(TankDetailsComposite);

TankDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  handleATGConfiguration: PropTypes.func.isRequired,
};
