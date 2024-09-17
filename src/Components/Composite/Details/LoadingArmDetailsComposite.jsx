import React, { Component } from "react";
import LoadingArmDetails from "../../UIBase/Details/LoadingArmDetails";
import { SiteDetailsUserActions } from "../../UIBase/Common/SiteDetailsUserActions";
import ErrorBoundary from "../../ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import axios from "axios";
import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { loadingArmValidationDef } from "../../../JS/ValidationDef";
import { emptyLoadingArm } from "../../../JS/DefaultEntities";
import { fnSiteView, fnRailSiteView, fnMarineSiteView, functionGroups } from "../../../JS/FunctionGroups";
import { loadingArmAttributeEntity } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class LoadingArmDetailsComposite extends Component {
  state = {
    loadingArm: {},
    modLoadingArm: {},
    isReadyToRender: false,
    saveEnabled: false,
    isDeleteEnabled: false,
    selectedLocationType: "",
    checkedDevices: [],
    deviceBlendOptions: [],
    loadingTypeOptions: [],
    deviceModel: "",
    IsTransloading: false,
    densityUOMOptions: [],
    modAssociations: [],
    selectedRows: [],
    unselectedRows: [],
    attributeMetaDataList: [],
    selectedAttributeList: [],
    attributeValidationErrors: [],
    validationErrors: Utilities.getInitialValidationErrors(
      loadingArmValidationDef
    ),
    IsDualBay: false,
    possibleFps: [],
    deniedFPs: [],
    showDeleteAuthenticationLayout: false,
    showSaveAuthenticationLayout: false,
    tempLoadingArm: {},
    possibleSwingArmAssociations: [],
    selectedSwingArmAssociations: []
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getBCUDeviceDetails(this.props.deviceCode);
      //this.getLoadingArm(this.props
      this.getLoadingTypes();
      this.getBlendTypes(this.state.deviceModel);
      this.getUOMList();
      this.getAttributes(this.props);
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on componentDidMount",
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
        // this.getLoadingArm(nextProps)
        this.getAttributes(nextProps);
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

  getAttributes(props) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [loadingArmAttributeEntity],
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
                  result.EntityResult.loadingArm
                ),
            },
            () => this.getLoadingArm(props)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getBlendTypes(deviceModel) {
    try {
      axios(
        RestAPIs.GetBlendTypes + deviceModel,
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
            var deviceBlendOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ deviceBlendOptions });
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
            deviceModel: result.EntityResult.Model,
            IsTransloading: result.EntityResult.IsTransloading,
            IsDualBay: result.EntityResult.IsDualBay,
          });

          this.getBlendTypes(this.state.deviceModel);
        }
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error while getting getBCUDeviceDetails"
      );
    }
  }

  getLoadingArm(propsResult) {
    let loadingArmCode = propsResult.loadingArmCode;
    let isTransloading = lodash.cloneDeep(this.state.IsTransloading);
    if (isTransloading === true) {
      emptyLoadingArm.BlendType = Constants.IsTransloading.NONE;
      emptyLoadingArm.ArmLoadingType = Constants.IsTransloading.LOADING;
    } else {
      emptyLoadingArm.BlendType = "";
      emptyLoadingArm.ArmLoadingType = "";
    }
    try {
      if (propsResult.isClone === true) {
        this.setState(
          {
            selectedAttributeList: [],
            loadingArm: lodash.cloneDeep(emptyLoadingArm),
            modLoadingArm: lodash.cloneDeep(emptyLoadingArm),
            isReadyToRender: true,
            modAssociations: [],
            selectedRows: [],
            isDeleteEnabled: false,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              Utilities.getSiteViewFunctionGroup(this.props.transportationtype)
            ),
          },
          () => {
            this.localNodeAttribute();
            if (!this.state.IsDualBay)
              this.fetchPossibleSwingArmAssociation();
          }
        );
        return;
      }
      if (loadingArmCode === undefined || loadingArmCode === "") {
        this.setState(
          {
            selectedAttributeList: [],
            loadingArm: lodash.cloneDeep(emptyLoadingArm),
            modLoadingArm: lodash.cloneDeep(emptyLoadingArm),
            modAssociations: [],
            selectedRows: [],
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
            if (!this.state.IsDualBay)
              this.fetchPossibleSwingArmAssociation();
          }
        );
        return;
      }
      var keyCode = [
        {
          key: KeyCodes.loadingArmCode,
          value: loadingArmCode,
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
        let modAssociations = [];
        let selectedRows = [];

        if (result.IsSuccess === true) {
          this.setState(
            {
              selectedAttributeList: [],
              loadingArm: lodash.cloneDeep(result.EntityResult),
              modLoadingArm: lodash.cloneDeep(result.EntityResult),
              isReadyToRender: true,
              modAssociations: [],
              selectedRows: [],
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
              if (this.state.loadingArm.Swingable && !this.state.IsDualBay) {
                this.fetchPossibleSwingArmAssociation();
              }

              this.terminalSelectionChange([result.EntityResult.TerminalCode]);
            }
          );
          let modLoadingArm = this.state.modLoadingArm;
          var deviceModel = this.state.deviceModel;
          let possibleFps = [];
          let deniedFPs = [];
          if (
            deviceModel === Constants.LoadingArmConstants.MSC_L &&
            modLoadingArm.BlendType === Constants.LoadingArmConstants.RATIO
          ) {
            modLoadingArm.BlendType =
              Constants.LoadingArmConstants.RATIO_SEQUENTIAL;
          }
          if (result.EntityResult.DeniedFPs != null) {
            deniedFPs = result.EntityResult.DeniedFPs;

            deniedFPs.forEach((deniedFp) => {
              modAssociations.push({
                Code: deniedFp.Code,
                Shareholdercode: deniedFp.Shareholdercode,
              });
            });
          }
          if (result.EntityResult.PossibleFPs != null) {
            possibleFps = result.EntityResult.PossibleFPs;
            possibleFps.forEach((possibleFp) => {
              modAssociations.push({
                Code: possibleFp.Code,
                Shareholdercode: possibleFp.Shareholdercode,
              });
            });

            possibleFps.forEach((possibleFp) => {
              selectedRows.push({
                Code: possibleFp.Code,
                Shareholdercode: possibleFp.Shareholdercode,
              });
            });
          }
          this.setState({
            modLoadingArm,
            modAssociations,
            selectedRows: selectedRows,
            possibleFps: possibleFps,
            deniedFPs: deniedFPs,
          });
        } else {
          this.setState({
            loadingArm: lodash.cloneDeep(emptyLoadingArm),
            modLoadingArm: lodash.cloneDeep(emptyLoadingArm),
            isReadyToRender: true,
            modAssociations: [],
            selectedRows: [],
            isDeleteEnabled: false,
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
      var selectedAttributeList = [];
      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      selectedAttributeList = lodash.cloneDeep(
        this.state.selectedAttributeList
      );
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );
      var modLoadingArm = lodash.cloneDeep(this.state.modLoadingArm);

      selectedTerminals.forEach((terminal) => {
        var existitem = selectedAttributeList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.loadingArm.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modLoadingArm.Attributes.find(
                (bayAttribute) => {
                  return bayAttribute.TerminalCode === terminal;
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
      });
      selectedAttributeList = [];
      selectedAttributeList = attributesTerminalsList;
      selectedAttributeList = Utilities.attributesConvertoDecimal(
        selectedAttributeList
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

      this.setState({ selectedAttributeList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      this.terminalSelectionChange([this.props.selectedTerminal]);
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    modAssociations[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ modAssociations });
  };

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
            let uomOptions = [];
            if (
              Array.isArray(result.EntityResult.VOLUME) &&
              Array.isArray(result.EntityResult.MASS)
            ) {
              uomOptions = result.EntityResult.VOLUME.concat(
                result.EntityResult.MASS
              );
            }

            densityUOMOptions = Utilities.transferListtoOptions(uomOptions);
            this.setState({ densityUOMOptions });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      });
    } catch (error) {
      console.log("LoadingArmDetailsComposite:Error while getting GetUOMList");
    }
  }

  handleRowSelectionChange = (associationRow) => {
    this.setState({ selectedRows: associationRow });
  };

  handleChange = (propertyName, data) => {
    try {
      let modLoadingArm = lodash.cloneDeep(this.state.modLoadingArm);
      modLoadingArm[propertyName] = data;
      const validationErrors = { ...this.state.validationErrors };
      if (modLoadingArm.Status === this.state.loadingArm.Status) {
        if (
          this.state.loadingArm.Remarks === modLoadingArm.Remarks ||
          modLoadingArm.Remarks === ""
        ) {
          validationErrors.Remarks = "";
        }
        if (modLoadingArm.Remarks === "")
          modLoadingArm.Remarks = this.state.loadingArm.Remarks;
      }
      if (modLoadingArm.Swingable === true) {
        modLoadingArm.AssociatedBay = 0;
      }
      if (propertyName === "Status") {
        if (modLoadingArm.Status !== this.state.loadingArm.Status) {
          modLoadingArm.Remarks = "";
        }
      }
      if (loadingArmValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          loadingArmValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modLoadingArm });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modLoadingArm = lodash.cloneDeep(this.state.modLoadingArm);
      modLoadingArm.Status = value;
      if (modLoadingArm.Status !== this.state.loadingArm.Status)
        modLoadingArm.Remarks = "";
      this.setState({ modLoadingArm });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };

  saveLoadingArm = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempLoadingArm = lodash.cloneDeep(this.state.tempLoadingArm);

      this.state.loadingArm.Code === ""
        ? this.createLoadingArm(tempLoadingArm)
        : this.updateLoadingArm(tempLoadingArm);

    } catch (error) {
      console.log("GantryComposite : Error in saveGantry");
    }
  };

  handleSave = () => {
    try {
      //  this.setState({ saveEnabled: false });
      let modLoadingArm = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.selectedAttributeList
      );
      if (this.validateSave(modLoadingArm, attributeList)) {
        modLoadingArm = this.fillAttributeDetails(modLoadingArm, attributeList);

        let showSaveAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempLoadingArm = lodash.cloneDeep(modLoadingArm);
        this.setState({ showSaveAuthenticationLayout, tempLoadingArm }, () => {
          if (showSaveAuthenticationLayout === false) {
            this.saveLoadingArm();
          }
        });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  handleDelete = () => {
    try {
      var deleteLocationKeys = [];
      var LoadingArmCode = this.state.modLoadingArm.Code;
      var keyData = {
        keyDataCode: 0,
        ShareHolderCode: "",
        KeyCodes: [
          { Key: KeyCodes.loadingArmCode, Value: LoadingArmCode },
          {
            Key: KeyCodes.transportaionType,
            Value: this.props.transportationtype,
          },
          { Key: KeyCodes.terminalCode, Value: this.props.selectedTerminal },
        ],
      };
      deleteLocationKeys.push(keyData);
      axios(
        RestAPIs.DeleteLoadingArm,
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
          ["LoadingArmDeletionSuccess"],
          ["LoadingArmCode"]
        );
        if (isRefreshDataRequire) {
          this.getLoadingArm({
            loadingArmCode: this.state.modLoadingArm.Code,
            selectedTerminal: this.props.selectedTerminal,
            isClone: false,
          });
          this.setState({
            isDeleteEnabled: false, showDeleteAuthenticationLayout: false,
          });
        } else {
          this.setState({ isDeleteEnabled: true, showDeleteAuthenticationLayout: false });
        }
        notification.messageResultDetails.forEach((messageResult) => {
          if (messageResult.keyFields.length > 0)
            messageResult.keyFields[0] = ["Loadingrm_Code"];
        });

        this.props.onDelete(this.state.modLoadingArm, "delete", notification);
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on handleDelete",
        error
      );
    }
  };

  fillDetails() {
    try {
      let modLoadingArm = lodash.cloneDeep(this.state.modLoadingArm);
      let IsDualBay = lodash.cloneDeep(this.state.IsDualBay);
      if (
        modLoadingArm.BlendType ===
        Constants.LoadingArmConstants.RATIO_SEQUENTIAL
      ) {
        modLoadingArm.BlendType = Constants.LoadingArmConstants.RATIO;
      }
      modLoadingArm.BcuCode = this.props.deviceCode;
      modLoadingArm.TerminalCode = this.props.selectedTerminal;
      if (IsDualBay !== true) {
        modLoadingArm.AssociatedBay = 0;
      }

      if (IsDualBay === true && modLoadingArm.Swingable === true) {
        modLoadingArm.AssociatedBay = 0;
      }
      let possibleFps = lodash.cloneDeep(this.state.possibleFps);
      let selectedRows = lodash.cloneDeep(this.state.selectedRows);
      let deniedFPs = lodash.cloneDeep(this.state.deniedFPs);
      let modAssociations = lodash.cloneDeep(this.state.modAssociations);

      if (modAssociations.length === 1) {
        if (
          possibleFps.length === 1 &&
          selectedRows.length === 0 &&
          deniedFPs.length === 0
        ) {
          possibleFps.forEach((possibleFp) => {
            modLoadingArm.DeniedFPs.push({
              Code: possibleFp.Code,
              Shareholdercode: possibleFp.Shareholdercode,
            });
          });

          modLoadingArm.PossibleFPs = [];
        } else if (
          possibleFps.length === 0 &&
          selectedRows.length === 1 &&
          deniedFPs.length === 1
        ) {
          deniedFPs.forEach((possibleFp) => {
            modLoadingArm.PossibleFPs.push({
              Code: possibleFp.Code,
              Shareholdercode: possibleFp.Shareholdercode,
            });
          });

          modLoadingArm.DeniedFPs = [];
        }
      } else if (modAssociations.length === selectedRows.length) {
        modLoadingArm.PossibleFPs = [];

        selectedRows.forEach((possibleFp) => {
          modLoadingArm.PossibleFPs.push({
            Code: possibleFp.Code,
            Shareholdercode: possibleFp.Shareholdercode,
          });
        });

        modLoadingArm.DeniedFPs = [];
      } else {
        if (selectedRows.length === 0) {
          modLoadingArm.DeniedFPs = [];

          modAssociations.forEach((possibleFp) => {
            modLoadingArm.DeniedFPs.push({
              Code: possibleFp.Code,
              Shareholdercode: possibleFp.Shareholdercode,
            });
          });

          modLoadingArm.PossibleFPs = [];
        } else {
          modLoadingArm.DeniedFPs = [];
          modLoadingArm.PossibleFPs = [];
          modAssociations.forEach((var2) => {
            if (selectedRows.filter(row => row.Code === var2.Code && row.Shareholdercode === var2.Shareholdercode).length === 0) {
              modLoadingArm.DeniedFPs.push({
                Code: var2.Code,
                Shareholdercode: var2.Shareholdercode
              })
            }
          });

          selectedRows.forEach((var2) => {
            modLoadingArm.PossibleFPs.push({
              Code: var2.Code,
              Shareholdercode: var2.Shareholdercode,
            });
          });
        }
      }

      if (modLoadingArm.Swingable && !IsDualBay) {
        let associatedArmCollection = []
        this.state.possibleSwingArmAssociations.forEach(arm => {
          if (this.state.selectedSwingArmAssociations.filter(selectedRow => selectedRow.LoadArmCode === arm.LoadArmCode).length > 0) {
            associatedArmCollection.push(arm.LoadArmCode);
          }
        });

        modLoadingArm.AssociatedArmCollection = [...associatedArmCollection];
      }

      return modLoadingArm;
    } catch (err) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on filldetails",
        err
      );
    }
  }

  fillAttributeDetails(modLoadingArm, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modLoadingArm.Attributes = [];
      attributeList.forEach((comp) => {
        let attribute = {
          ListOfAttributeData: [],
        };
        attribute.TerminalCode = comp.TerminalCode;
        comp.attributeMetaDataList.forEach((det) => {
          attribute.ListOfAttributeData.push({
            AttributeCode: det.Code,
            AttributeValue: det.DefaultValue,
          });
        });
        modLoadingArm.Attributes.push(attribute);
      });
      return modLoadingArm;
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  validateSave(modLoadingArm, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(loadingArmValidationDef).forEach(function (key) {
      if (modLoadingArm[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          loadingArmValidationDef[key],
          modLoadingArm[key]
        );
    });
    if (modLoadingArm.Status !== this.state.loadingArm.Status) {
      if (modLoadingArm.Remarks === null || modLoadingArm.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }

    if (this.state.deviceModel === "Accuload-IV") {
      if (
        modLoadingArm.NodeAddress === null ||
        modLoadingArm.NodeAddress === ""
      ) {
        validationErrors["NodeAddress"] = "CardReader_MandatoryAddress";
      }
    }
    if (
      modLoadingArm.CleanLineFinishQuantity === null ||
      modLoadingArm.CleanLineFinishQuantity === ""
    ) {
      validationErrors["CleanLineFinishQuantity"] =
        "CleanLineFinishQuantity_Empty_x";
    }
    if (
      modLoadingArm.MinimumLoadableQuantity === null ||
      modLoadingArm.MinimumLoadableQuantity === ""
    ) {
      validationErrors["MinimumLoadableQuantity"] =
        "MinimumLoadableQuantity_Empty_x";
    }

    let notification = {
      messageType: "critical",
      message: ["LoadingArmSavedSuccess"],
      messageResultDetails: [],
    };
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

  createLoadingArm(modLoadingArm) {
    try {
      let keyCode = [
        {
          key: KeyCodes.loadingArmCode,
          value: modLoadingArm.Code,
        },
        {
          key: KeyCodes.transportaionType,
          value: this.props.transportationtype,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.loadingArmCode,
        KeyCodes: keyCode,
        Entity: modLoadingArm,
      };
      let notification = {
        messageType: "critical",
        message: ["LoadingArmCodeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["LoadingArmCode"],
            keyValues: [modLoadingArm.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.CreateLoadingArm,
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
          this.getLoadingArm({
            loadingArmCode: this.state.modLoadingArm.Code,
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
        this.props.onSaved(this.state.modLoadingArm, "add", notification);
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on createLoadingArm",
        error
      );
    }
  }

  updateLoadingArm(modLoadingArm) {
    try {
      let keyCode = [
        {
          key: KeyCodes.loadingArmCode,
          value: modLoadingArm.Code,
        },
        {
          key: KeyCodes.transportaionType,
          value: this.props.transportationtype,
        },
      ];

      let obj = {
        ShareHolderCode: "",
        keyDataCode: KeyCodes.loadingArmCode,
        KeyCodes: keyCode,
        Entity: modLoadingArm,
      };
      let notification = {
        messageType: "critical",
        message: ["LoadingArmCodeSavedSuccess"],
        messageResultDetails: [
          {
            keyFields: ["LoadingArmCode"],
            keyValues: [modLoadingArm.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.UpdateLoadingArm,
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
          this.getLoadingArm({
            loadingArmCode: this.state.modLoadingArm.Code,
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
        this.props.onSaved(this.state.modLocation, "update", notification);
      });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on updateLoadingArm",
        error
      );
    }
  }

  handleAttributeCellDataEdit = (attribute, value) => {
    try {
      attribute.DefaultValue = value;
      this.setState({
        attribute: attribute,
      });
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors });
    } catch (error) {
      console.log(
        "LoadingArmDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
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
      console.log("LoadingArmComposite : Error in authenticateDelete");
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showSaveAuthenticationLayout: false,
      showDeleteAuthenticationLayout: false,
    });
  };

  handleOperation() {
    return this.state.showDeleteAuthenticationLayout ? this.handleDelete : this.saveLoadingArm;
  };

  getFunctionGroupName() {
    if (this.props.transportationtype === Constants.TransportationType.RAIL)
      return fnRailSiteView;
    else if (this.props.transportationtype === Constants.TransportationType.MARINE)
      return fnMarineSiteView
    else
      return fnSiteView
  };

  getFunctionName() {
    return this.state.showDeleteAuthenticationLayout ? functionGroups.remove :
      this.state.loadingArm.Code === ""
        ? functionGroups.add
        : functionGroups.modify
  };

  fetchPossibleSwingArmAssociation = () => {
    let swingArmRequestObj = {
      ShareHolderCode: "",
      keyDataCode: KeyCodes.loadingArmCode,
      KeyCodes: [{
        key: KeyCodes.loadingArmCode,
        value: this.state.loadingArm.Code,
      },
      {
        key: KeyCodes.transportaionType,
        value: this.props.transportationtype,
      },
      {
        key: KeyCodes.terminalCode,
        value: this.props.selectedTerminal,
      },
      {
        key: KeyCodes.bcuCode,
        value: this.props.deviceCode,
      }]
    };

    axios(
      RestAPIs.GetLoadingArmSwingArmList,
      Utilities.getAuthenticationObjectforPost(
        swingArmRequestObj,
        this.props.tokenDetails.tokenInfo
      )
    ).then(response => {
      if (response.data.IsSuccess) {
        let selectedSwingArms = [];
        if (Array.isArray(this.state.loadingArm.AssociatedArmCollection) && Array.isArray(response.data.EntityResult)) {
          response.data.EntityResult.forEach(row => {
            if (this.state.loadingArm.AssociatedArmCollection.includes(row.LoadArmCode)) {
              selectedSwingArms.push(row);
            }
          })
        }

        this.setState({
          possibleSwingArmAssociations: response.data.EntityResult,
          selectedSwingArmAssociations: selectedSwingArms
        });
      }
    }).catch(error => {
      this.setState({
        possibleSwingArmAssociations: [],
        selectedSwingArmAssociations: []
      });
      console.log("Error fetching possible swing arm associations: ", error);
    });
  }

  handleSwingArmAssociationSelectionChange = (selectedArms) => {
    this.setState({
      selectedSwingArmAssociations: selectedArms
    });
  }

  render() {
    const popUpContents = [
      {
        fieldName: "DriverInfo_LastUpdated",
        fieldValue:
          new Date(this.state.loadingArm.LastUpdated).toLocaleDateString() +
          " " +
          new Date(this.state.modLoadingArm.LastUpdated).toLocaleTimeString(),
      },
      {
        fieldName: "DriverInfo_LastActive",
        fieldValue:
          this.state.modLoadingArm.LastActive !== undefined &&
            this.state.modLoadingArm.LastActive !== null
            ? new Date(
              this.state.modLoadingArm.LastActive
            ).toLocaleDateString() +
            " " +
            new Date(this.state.modLoadingArm.LastActive).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "DriverInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modLoadingArm.Created).toLocaleDateString() +
          " " +
          new Date(this.state.modLoadingArm.Created).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.loadingArm.Code}
            newEntityName="Loadingrm_Headder"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <LoadingArmDetails
            loadingArm={this.state.loadingArm}
            modLoadingArm={this.state.modLoadingArm}
            modAssociations={this.state.modAssociations}
            handleCellDataEdit={this.handleCellDataEdit}
            IsDualBay={this.state.IsDualBay}
            deviceModel={this.state.deviceModel}
            listOptions={{
              deviceBlendOptions: this.state.deviceBlendOptions,
              loadingTypeOptions: this.state.loadingTypeOptions,
              densityUOMOptions: this.state.densityUOMOptions,
            }}
            selectedRows={this.state.selectedRows}
            handleRowSelectionChange={this.handleRowSelectionChange}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            selectedAttributeList={this.state.selectedAttributeList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            attributeMetaDataList={this.state.attributeMetaDataList}
            handleAttributeCellDataEdit={this.handleAttributeCellDataEdit}
            onActiveStatusChange={this.handleActiveStatusChange}
            possibleSwingArmList={this.state.possibleSwingArmAssociations}
            selectedSwingArmAssociations={this.state.selectedSwingArmAssociations}
            onSwingArmAssociationSelectionChange={this.handleSwingArmAssociationSelectionChange}
          />
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

export default connect(mapStateToProps)(LoadingArmDetailsComposite);
