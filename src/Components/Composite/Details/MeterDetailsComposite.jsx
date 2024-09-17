import React, { Component } from "react";
import { SiteDetailsUserActions } from "../../UIBase/Common/SiteDetailsUserActions";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import { connect } from "react-redux";
import axios from "axios";
import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { meterValidationDef } from "../../../JS/ValidationDef";
import { emptyMeter } from "../../../JS/DefaultEntities";
import {
  functionGroups,
  fnPipelineMeterSiteView,
  fnSiteView,
  fnRailSiteView,
  fnMarineSiteView
} from "../../../JS/FunctionGroups";
import MeterDetails from "../../UIBase/Details/MeterDetails";
import { meterAttributeEntity } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class MeterDetailsComposite extends Component {
  state = {
    meter: {},
    modMeter: {},
    isReadyToRender: false,
    saveEnabled: false,
    parentCode: "",
    isDeleteEnabled: false,
    mainlineTypeOptions: [],
    additiveTypeOptions: [],
    pipelineTypeOptions: [],
    tankGroupOptions: [],
    baseProductOptions: [],
    meterCodeOptions: [],
    meterLineType: "",
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    validationErrors: Utilities.getInitialValidationErrors(meterValidationDef),
    IsTransloading: false,
    loadingArm: {},
    FpMeterCodes: [],
    MeterBaseUOMs: [],
    showDeleteAuthenticationLayout: false,
    showSaveAuthenticationLayout: false,
    tempMeter: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      if (this.props.source === "PipelineSiteView") {
        this.getMeterTypes();
        this.getAttributes(this.props);
        this.getUOMList();
      } else {
        this.getLoadingArm(this.props.parentCode);
        this.getBCUDeviceDetails(this.props.deviceCode);
        this.getMeterTypes();
        this.getTankGroups(this.props.meterLineType);
        this.getMeterCodes(this.props.parentCode);
        //this.getMeter(this.props)
        this.getAttributes(this.props);
      }
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
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
            let volumeUOMs = result.EntityResult.VOLUME;
            let massUOMs = result.EntityResult.MASS;
            let MeterBaseUOMs = [];
            volumeUOMs.forEach((volumeOption) => {
              MeterBaseUOMs.push({
                text: volumeOption,
                value: volumeOption,
              });
            });
            massUOMs.forEach((massOption) => {
              MeterBaseUOMs.push({
                text: massOption,
                value: massOption,
              });
            });

            this.setState({
              MeterBaseUOMs,
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

  componentWillReceiveProps(nextProps) {
    try {
      if (this.props.source === "PipelineSiteView") {
        this.getPipelineMeter(nextProps);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      } else if (
        nextProps.LocationCode === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getTankGroups(nextProps.meterLineType);
        this.getMeterCodes(nextProps.parentCode);
        // this.getMeter(nextProps)
        this.getAttributes(nextProps);
        this.getLoadingArm(nextProps.parentCode);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getLoadingArm(parentCode) {
    try {
      var keyCode = [
        {
          key: KeyCodes.loadingArmCode,
          value: parentCode,
        },
        {
          key: KeyCodes.transportaionType,
          value: Constants.TransportationType.ROAD,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.selectedTerminal,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.loadingArmCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetLoadingArm,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({ loadingArm: result.EntityResult });
        } else {
        }
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured in getLoadingArm",
        error
      );
    }
  }

  getAttributes(props) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [meterAttributeEntity],
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
                  result.EntityResult.meter
                ),
            },
            () => {
              this.props.source === "PipelineSiteView"
                ? this.getPipelineMeter(props.selectedRow)
                : this.getMeter(props);
            }
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getMeterTypes() {
    try {
      axios(
        RestAPIs.GetMeterTypes,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;

        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult.MAINLINE != null
          ) {
            var mainlineTypeOptions = Utilities.transferDictionarytoOptions(
              result.EntityResult.MAINLINE
            );

            this.setState({ mainlineTypeOptions });
          }
          if (
            result.EntityResult !== null &&
            result.EntityResult.ADDITIVE != null
          ) {
            var additiveTypeOptions = Utilities.transferDictionarytoOptions(
              result.EntityResult.ADDITIVE
            );

            this.setState({ additiveTypeOptions });
          }
          if (
            result.EntityResult !== null &&
            result.EntityResult.PIPELINE != null
          ) {
            var pipelineTypeOptions = Utilities.transferDictionarytoOptions(
              result.EntityResult.PIPELINE
            );

            this.setState({ pipelineTypeOptions });
          }
        } else {
          console.log("Error in getDeviceTypes:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error while getting getBlendTypes"
      );
    }
  }

  getFPMeterTypes() {
    try {
      axios(
        RestAPIs.GetFPMeters + "?LoadingArmCode=" + this.props.parentCode,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;

        if (result.IsSuccess === true) {
          this.setState({
            FpMeterCodes: Utilities.transferDictionarytoOptions(
              result.EntityResult
            ),
          });
        } else {
          console.log("Error in getMeterTypes:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("MeterDetailsComposite:Error while getting getMeterTypes");
    }
  }

  getBaseProducts(terminalcode) {
    axios(
      RestAPIs.GetAllBaseProduct + "?TerminalCode=" + terminalcode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let baseProductOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ baseProductOptions });
          }
        } else {
          console.log("Error in getBaseProducts:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting BaseProducts:", error);
      });
  }

  getMeterCodes(loadingArmCode) {
    try {
      axios(
        RestAPIs.GetProductMeterCode +
          "?armCode=" +
          loadingArmCode +
          "&transportationType=" +
          this.props.transportationtype,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            var meterCodeOptions = Utilities.transferDictionarytoOptions(
              result.EntityResult.BASE_PRODUCT_METER
            );

            this.setState({ meterCodeOptions });
          }
        } else {
          console.log("Error in getDeviceTypes:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error while getting getBlendTypes"
      );
    }
  }

  getBCUDeviceDetails(deviceCode) {
    try {
      var keyCode = [
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
          this.setState({
            IsTransloading: result.EntityResult.IsTransloading,
          });
          this.getBaseProducts(this.props.selectedTerminal);
        }
      });
    } catch (error) {
      console.log(
        "MeterDetailsComposite:Error while getting getBCUDeviceDetails"
      );
    }
  }

  getPipelineMeter(selectedRow) {
    try {
      emptyMeter.MeterType = Constants.meterTypeConstants.PIPELINE_HEADER_METER;
      if (selectedRow.Common_Code === undefined) {
        emptyMeter.MeterBaseUOM =
          this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.QuantityUOM;
        this.setState(
          {
            meter: lodash.cloneDeep(emptyMeter),
            modMeter: lodash.cloneDeep(emptyMeter),
            modAttributeMetaDataList: [],
            isReadyToRender: true,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnPipelineMeterSiteView
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
          key: KeyCodes.meterCode,
          value: selectedRow.Common_Code,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.selectedTerminal,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.meterCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetPipelineMeter,
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
              meter: lodash.cloneDeep(result.EntityResult),
              modMeter: lodash.cloneDeep(result.EntityResult),
              isReadyToRender: true,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPipelineMeterSiteView
              ),
            },
            () => {
              this.terminalSelectionChange([result.EntityResult.TerminalCode]);
            }
          );
        } else {
          this.setState({
            meter: lodash.cloneDeep(emptyMeter),
            modMeter: lodash.cloneDeep(emptyMeter),
            isReadyToRender: true,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnPipelineMeterSiteView
            ),
          });
        }
      });
    } catch (error) {
      console.log(
        "MeterDetailsComposite:Error occured in getPipelinemeter",
        error
      );
    }
  }

  getMeter(propsResult) {
    let meterCode = propsResult.meterCode;
    let meterLineType = propsResult.meterLineType;
    if (meterLineType === Constants.meterLineType.MAINLINE) {
      emptyMeter.MeterLineType = Constants.meterLineType.MAINLINE;
      emptyMeter.MeterType = Constants.meterTypeConstants.BASE_PRODUCT_METER;
    } else {
      emptyMeter.MeterLineType = Constants.meterLineType.ADDITIVE;
      emptyMeter.MeterType = Constants.meterTypeConstants.ADDITIVE_METER;
    }
    try {
      if (meterCode === undefined || meterCode === "") {
        this.setState(
          {
            meter: lodash.cloneDeep(emptyMeter),
            modMeter: lodash.cloneDeep(emptyMeter),
            modAttributeMetaDataList: [],
            isDeleteEnabled: false,
            isReadyToRender: true,
            meterLineType: meterLineType,
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
      if (propsResult.isClone === true) {
        this.setState(
          {
            meter: lodash.cloneDeep(emptyMeter),
            modMeter: lodash.cloneDeep(emptyMeter),
            modAttributeMetaDataList: [],
            isDeleteEnabled: false,
            isReadyToRender: true,
            meterLineType: meterLineType,
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
          key: KeyCodes.meterCode,
          value: meterCode,
        },
        {
          key: KeyCodes.transportaionType,
          value: this.props.transportationtype,
        },
        {
          key: KeyCodes.terminalCode,
          value: this.props.selectedTerminal,
        },
      ];
      var obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.meterCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetMeter,
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
              meter: lodash.cloneDeep(result.EntityResult),
              modMeter: lodash.cloneDeep(result.EntityResult),
              isReadyToRender: true,
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
              if (
                this.state.loadingArm.BlendType === "SIDE_STREAM" &&
                result.EntityResult.MeterType !== "FINISHED_PRODUCT_METER"
              )
                this.getFPMeterTypes();
              this.terminalSelectionChange([result.EntityResult.TerminalCode]);
            }
          );

          let modMeter = lodash.cloneDeep(this.state.modMeter);
          this.setState({
            meterLineType: modMeter.MeterLineType,
          });
        } else {
          this.setState({
            meter: lodash.cloneDeep(emptyMeter),
            modMeter: lodash.cloneDeep(emptyMeter),
            isDeleteEnabled: false,
            isReadyToRender: true,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
          });
        }
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured in getLoadingArm",
        error
      );
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
      var modMeter = lodash.cloneDeep(this.state.modMeter);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.meter.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modMeter.Attributes.find((bayAttribute) => {
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
        "MeterDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      this.terminalSelectionChange([this.props.selectedTerminal]);
    } catch (error) {
      console.log(
        "MeterDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getTankGroups(meterLineType) {
    axios(
      RestAPIs.GetTankGroups + "?MeterLine=" + meterLineType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            var tankGroupOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ tankGroupOptions });
          }
        } else {
          console.log("Error in getLoadingTypes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getLoadingTypes:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      let modMeter = lodash.cloneDeep(this.state.modMeter);
      modMeter[propertyName] = data;
      const validationErrors = { ...this.state.validationErrors };
      if (modMeter.Active === this.state.meter.Active) {
        if (
          this.state.meter.Remarks === modMeter.Remarks ||
          modMeter.Remarks === ""
        ) {
          validationErrors.Remarks = "";
        }
        if (modMeter.Remarks === "")
          modMeter.Remarks = this.state.meter.Remarks;
      }
      if (propertyName === "MeterType") {
        if (
          this.state.loadingArm.BlendType === "SIDE_STREAM" &&
          data !== "FINISHED_PRODUCT_METER"
        ) {
          this.getFPMeterTypes();
        }

        if (data === "VIRTUAL_BASE_PRODUCT_METER") {
          modMeter.Virtual = true;
        }
      }

      if (propertyName === "Active") {
        if (modMeter.Active !== this.state.meter.Active) {
          modMeter.Remarks = "";
        }
      }
      if (meterValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          meterValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modMeter });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modMeter = lodash.cloneDeep(this.state.modMeter);
      modMeter.Active = value;
      if (modMeter.Active !== this.state.meter.Active) modMeter.Remarks = "";
      this.setState({ modMeter });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };

  saveMeter = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempMeter = lodash.cloneDeep(this.state.tempMeter);
     
      if (this.props.source === "PipelineSiteView")
          this.state.meter.Code === ""
            ? this.createPipelineMeter(tempMeter)
            : this.updatePipelineMeter(tempMeter);
        else
          this.state.meter.Code === ""
            ? this.createMeter(tempMeter)
            : this.updateMeter(tempMeter);

    } catch (error) {
      console.log("MeterComposite : Error in saveMeter");
    }
  };

  handleSave = () => {
    try {
    //  this.setState({ saveEnabled: false });
      let modMeter = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      if (this.validateSave(modMeter, attributeList)) {
        attributeList = Utilities.attributesDatatypeConversion(attributeList);
        modMeter.Attributes = Utilities.fillAttributeDetails(attributeList);
       
        let showSaveAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;

      let tempMeter = lodash.cloneDeep(modMeter);
      this.setState({ showSaveAuthenticationLayout, tempMeter }, () => {
        if (showSaveAuthenticationLayout === false) {
          this.saveMeter();
        }
    });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("MeterDetailsComposite:Error occured on handleSave", error);
    }
  };

  validateSave(modMeter, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(meterValidationDef).forEach(function (key) {
      if (modMeter[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          meterValidationDef[key],
          modMeter[key]
        );
    });
    if (modMeter.Active !== this.state.meter.Active) {
      if (modMeter.Remarks === null || modMeter.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }
    let meterLineType = this.state.meterLineType;
    if (this.state.IsTransloading === false) {
      if (
        modMeter.MeterType !== "FINISHED_PRODUCT_METER" &&
        this.state.loadingArm.BlendType !== "SEQUENTIAL" &&
        (modMeter.TankGroupCode === null || modMeter.TankGroupCode === "") &&
        this.props.source !== "PipelineSiteView"
      ) {
        validationErrors["TankGroupCode"] = "Meter_TankGrpSelect";
      }
      if (
        modMeter.MeteType !== "FINISHED_PRODUCT_METER" &&
        meterLineType === Constants.meterLineType.MAINLINE &&
        this.state.loadingArm === "SEQUENTIAL" &&
        this.props.source !== "PipelineSiteView"
      )
        validationErrors["TankGroupCode"] = "Meter_TankGrpSelect";
    }
    if (meterLineType === Constants.meterLineType.MAINLINE) {
      if (modMeter.MeterNumber === null || modMeter.MeterNumber === "") {
        validationErrors["MeterNumber"] = "Meter_BCUMeterRefNoMandatory";
      }

      if (
        this.state.loadingArm.BlendType === "SIDE_STREAM" &&
        modMeter.MeterType !== "FINISHED_PRODUCT_METER" &&
        (modMeter.ConjunctionNumber === null ||
          modMeter.ConjunctionNumber === "")
      ) {
        validationErrors["ConjunctionNumber"] = "siteView_meter_select_FPMeter";
      }
    }

    if (meterLineType === Constants.meterLineType.ADDITIVE) {
      if (modMeter.MeterNumber === null || modMeter.MeterNumber === "") {
        validationErrors["MeterNumber"] = "Meter_BCUInjPosNum";
      }
      if (
        modMeter.ConjunctionNumber === null ||
        modMeter.ConjunctionNumber === ""
      ) {
        validationErrors["ConjunctionNumber"] = "Meter_APMCMandatory";
      }
    }

    if (modMeter.MeterLineType === Constants.meterLineType.PIPELINE) {
      if (modMeter.MeterBaseUOM === null || modMeter.MeterBaseUOM === "") {
        validationErrors["MeterBaseUOM"] = "TankInfo_UOMRequired";
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

  fillDetails() {
    try {
      let modMeter = lodash.cloneDeep(this.state.modMeter);
      if (this.props.source === "PipelineSiteView") {
        modMeter.Duplicate = false;
        modMeter.MeterLineType = Constants.meterLineType.PIPELINE;
        modMeter.Virtual = false;
        modMeter.TankGroupCode = null;
      } else {
        modMeter.LoadingArmCode = this.props.parentCode;
        modMeter.TerminalCode = this.props.selectedTerminal;
      }
      return modMeter;
    } catch (err) {
      console.log("MeterDetailsComposite:Error occured on filldetails", err);
    }
  }

  handleDelete = () => {
    try {
      var deleteMeterKeys = [];
      var MeterCode = this.state.modMeter.Code;
      var keyData = {
        keyDataCode: 0,
        ShareHolderCode: "",
        KeyCodes: [
          { Key: KeyCodes.meterCode, Value: MeterCode },
          { Key: KeyCodes.loadingArmCode, Value: this.props.parentCode },
          {
            Key: KeyCodes.transportaionType,
            Value: this.props.transportationtype,
          },
          { Key: KeyCodes.terminalCode, Value: this.props.selectedTerminal },
          { Key: KeyCodes.meterLineType, Value: this.state.meterLineType },
        ],
      };
      deleteMeterKeys.push(keyData);
      axios(
        RestAPIs.DeleteMeter,
        Utilities.getAuthenticationObjectforPost(
          deleteMeterKeys,
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

        let notification = {
          messageType: "critical",
          message: "MeterDeletionStatus",
          messageResultDetails: [
            {
              keyFields: ["MeterCode"],
              keyValues: [MeterCode],
              isSuccess: false,
              errorMessage: "",
            },
          ],
        };
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (isRefreshDataRequire) {
          this.getMeter({
            meterCode: this.state.modMeter.Code,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
          });
          this.setState({
            isDeleteEnabled: false, showDeleteAuthenticationLayout: false,
          });
        } else {
          this.setState({ isDeleteEnabled: true, showDeleteAuthenticationLayout: false, });
        }

        notification.messageResultDetails[0].errorMessage = result.ErrorList[0];

        this.props.onDelete(this.state.modMeter, "delete", notification);
      });
    } catch (error) {
      console.log("MeterDetailsComposite:Error occured on handleDelete", error);
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
        "MeterDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  createMeter(modMeter) {
    try {
      let keyCode = [
        {
          key: KeyCodes.meterCode,
          value: modMeter.Code,
        },
        {
          key: KeyCodes.transportaionType,
          value: this.props.transportationtype,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.meterCode,
        KeyCodes: keyCode,
        Entity: modMeter,
      };
      let notification = {
        messageType: "critical",
        message: ["MeterCodeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["MeterCode"],
            keyValues: [modMeter.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateMeter,
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
          this.getMeter({
            meterCode: this.state.modMeter.Code,
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
        this.props.onSaved(this.state.modMeter, "add", notification);
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on createLoadingArm",
        error
      );
    }
  }

  createPipelineMeter(modMeter) {
    try {
      let keyCode = [
        {
          key: KeyCodes.meterCode,
          value: modMeter.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.meterCode,
        KeyCodes: keyCode,
        Entity: modMeter,
      };
      let notification = {
        messageType: "critical",
        message: ["MeterCodeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["MeterCode"],
            keyValues: [modMeter.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreatePipelineMeter,
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
              fnPipelineMeterSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getPipelineMeter({
            Common_Code: this.state.modMeter.Code,
            selectedTerminal: this.props.selectedTerminal,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnPipelineMeterSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modMeter, "add", notification);
      });
    } catch (error) {
      console.log(
        "MeterDetailsComposite:Error occured on createPipelineMeter",
        error
      );
    }
  }

  updatePipelineMeter(modMeter) {
    try {
      let keyCode = [
        {
          key: KeyCodes.meterCode,
          value: modMeter.Code,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.meterCode,
        KeyCodes: keyCode,
        Entity: modMeter,
      };
      let notification = {
        messageType: "critical",
        message: ["MeterCodeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["MeterCode"],
            keyValues: [modMeter.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdatePipelineMeter,
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
              fnPipelineMeterSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getPipelineMeter({
            Common_Code: this.state.modMeter.Code,
            selectedTerminal: this.props.selectedTerminal,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnPipelineMeterSiteView
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modMeter, "update", notification);
      });
    } catch (error) {
      console.log(
        "MeterDetailsComposite:Error occured on updatePipelineMeter",
        error
      );
    }
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modMeter: lodash.cloneDeep(this.state.meter),
          selectedCompRow: [],
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange([this.state.meter.TerminalCode]);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "PipelineMeterDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.meter
          ),
      });
    } catch (error) {
      console.log(
        "PipelineMeterDetailsComposite:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  updateMeter(modMeter) {
    try {
      let keyCode = [
        {
          key: KeyCodes.meterCode,
          value: modMeter.Code,
        },
        {
          key: KeyCodes.transportaionType,
          value: this.props.transportationtype,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.meterCode,
        KeyCodes: keyCode,
        Entity: modMeter,
      };
      let notification = {
        messageType: "critical",
        message: ["MeterCodeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["MeterCode"],
            keyValues: [modMeter.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateMeter,
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
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
          this.getMeter({
            meterCode: this.state.modMeter.Code,
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
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
            showSaveAuthenticationLayout: false,
          });
        }
        this.props.onSaved(this.state.modMeter, "update", notification);
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on updateLoadingArm",
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
      console.log("LoadingArmComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showSaveAuthenticationLayout: false,
      showDeleteAuthenticationLayout: false,
    });
  };
  
  handleOperation()  {
    return this.state.showDeleteAuthenticationLayout?this.handleDelete:this.saveMeter;
 };

 getFunctionGroupName() {
  if(this.props.source === "PipelineSiteView")
    return fnPipelineMeterSiteView
  else if(this.props.transportationtype === Constants.TransportationType.RAIL)
    return fnRailSiteView;
  else  if(this.props.transportationtype === Constants.TransportationType.MARINE)
    return fnMarineSiteView
  else  
    return fnSiteView
 };

 getFunctionName() {
  return this.state.showDeleteAuthenticationLayout? functionGroups.remove: 
        this.state.meter.Code === ""
         ? functionGroups.add
         : functionGroups.modify
 };

  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(this.state.meter.LastUpdatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modMeter.LastUpdatedTime).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modMeter.LastActiveTime !== undefined &&
          this.state.modMeter.LastActive !== null
            ? new Date(
                this.state.modMeter.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(this.state.modMeter.LastActiveTime).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modMeter.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modMeter.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.meter.Code}
            newEntityName="Meter_Headder"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <MeterDetails
            meter={this.state.meter}
            modMeter={this.state.modMeter}
            meterLineType={this.state.meterLineType}
            LABlendType={this.state.loadingArm.BlendType}
            listOptions={{
              mainlineTypeOptions: this.state.mainlineTypeOptions,
              additiveTypeOptions: this.state.additiveTypeOptions,
              pipelineTypeOptions: this.state.pipelineTypeOptions,
              tankGroupOptions: this.state.tankGroupOptions,
              meterCodeOptions: this.state.meterCodeOptions,
              baseProductOptions: this.state.baseProductOptions,
              FpMeterCodes: this.state.FpMeterCodes,
              MeterBaseUOMs: this.state.MeterBaseUOMs,
            }}
            validationErrors={this.state.validationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            attributeMetaDataList={this.state.attributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isTransloading={this.state.IsTransloading}
            source={this.props.source}
          ></MeterDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          {this.props.source !== "" && this.props.source !== undefined ? (
            <TMDetailsUserActions
              handleBack={this.props.onBack}
              handleSave={this.handleSave}
              handleReset={this.handleReset}
              saveEnabled={
                this.props.userDetails.EntityResult.IsEnterpriseNode
                  ? false
                  : this.state.saveEnabled
              }
            ></TMDetailsUserActions>
          ) : (
            <SiteDetailsUserActions
              isEnterpriseNode={
                this.props.userDetails.EntityResult.IsEnterpriseNode
              }
              handleSave={this.handleSave}
              handleDelete={this.authenticateDelete}
              saveEnabled={this.state.saveEnabled}
              isDeleteEnabled={this.state.isDeleteEnabled}
            ></SiteDetailsUserActions>
          )}
        </ErrorBoundary>
        {this.state.showDeleteAuthenticationLayout || this.state.showSaveAuthenticationLayout ?  (
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

export default connect(mapStateToProps)(MeterDetailsComposite);
