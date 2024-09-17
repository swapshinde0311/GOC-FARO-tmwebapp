import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { PipelineHeaderSiteViewDetails } from "../../UIBase/Details/PipelineHeaderSiteViewDetails";
import { emptyPipelineHeader } from "../../../JS/DefaultEntities";
import { pipelineHeaderValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import { connect } from "react-redux";
import * as KeyCodes from "../../../JS/KeyCodes";
import PropTypes from "prop-types";
import lodash from "lodash";
import {
  functionGroups,
  fnPipelineHeaderSiteView,
} from "../../../JS/FunctionGroups";
import { pipelineHeaderAttributeEntity } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PipelineHeaderSiteViewDetailsComposite extends Component {
  state = {
    pipelineHeader: lodash.cloneDeep(emptyPipelineHeader),
    modPipelineHeader: {},
    validationErrors: Utilities.getInitialValidationErrors(
      pipelineHeaderValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    attributeValidationErrors: [],
    modAttributeMetaDataList: [],
    pipelineHeaderTypeOptions: [],
    lengthUOMOptions: [],
    volumeUOMOptions: [],
    pipelineMeterList: [],
    showAuthenticationLayout: false,
    tempPipelineHeader: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
      this.getPipelineHeaderType();
      this.getUOMList();
      this.getMeterList();
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.pipelineHeader.Code !== "" &&
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
        "PipelineHeaderSiteViewDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(pipelineHeaderRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [pipelineHeaderAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.PIPELINEHEADER
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.PIPELINEHEADER
                ),
            },
            () => this.getPipelineHeader(pipelineHeaderRow)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }
  getPipelineHeader(pipelineHeaderRow) {
    emptyPipelineHeader.PipelineHeaderType = "BOTH";
    if (pipelineHeaderRow.Common_Code === undefined) {
      this.setState(
        {
          pipelineHeader: lodash.cloneDeep(emptyPipelineHeader),
          modPipelineHeader: lodash.cloneDeep(emptyPipelineHeader),
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnPipelineHeaderSiteView
          ),
        },
        () => {
          if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.localNodeAttribute();
          }
        }
      );
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.pipelineHeaderCode,
        value: pipelineHeaderRow.Common_Code,
      },
      {
        key: KeyCodes.terminalCode,
        value:
          this.props.selectedTerminal !== ""
            ? this.props.selectedTerminal
            : null,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.pipelineHeaderCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetPipelineHeader,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              isReadyToRender: true,
              pipelineHeader: lodash.cloneDeep(result.EntityResult),
              modPipelineHeader: lodash.cloneDeep(result.EntityResult),
              saveEnabled:
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.modify,
                  fnPipelineHeaderSiteView
                ) && !this.props.userDetails.EntityResult.IsEnterpriseNode,
            },
            () => {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange([this.props.selectedTerminal]);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            pipelineHeader: lodash.cloneDeep(emptyPipelineHeader),
            modPipelineHeader: lodash.cloneDeep(emptyPipelineHeader),
            isReadyToRender: true,
          });
          console.log("Error in getPipelineHeader:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting PipelineHeader:",
          error,
          pipelineHeaderRow
        );
      });
  }
  getPipelineHeaderType() {
    axios(
      RestAPIs.GetPipelineHeaderType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let pipelineHeaderTypeOptions = [];
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult).forEach((key) =>
              pipelineHeaderTypeOptions.push({
                text: key,
                value: result.EntityResult[key],
              })
            );
            this.setState({ pipelineHeaderTypeOptions });
          }
        } else {
          console.log("Error in getPipelineHeaderType:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getPipelineHeaderType:", error);
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
            let volumeUOMOptions = [];

            let flowrateVolumeUOMs = result.EntityResult.FLOWRATE_VOLUME;
            let flowrateMassUOMs = result.EntityResult.FLOWRATE_MASS;

            flowrateVolumeUOMs.forEach((volumeOption) => {
              volumeUOMOptions.push({
                text: volumeOption,
                value: volumeOption,
              });
            });
            flowrateMassUOMs.forEach((massOption) => {
              volumeUOMOptions.push({
                text: massOption,
                value: massOption,
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

            this.setState({
              volumeUOMOptions,
              lengthUOMOptions,
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
  getMeterList() {
    axios(
      RestAPIs.GetAllPipelineMeterList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let pipelineMeterList = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ pipelineMeterList });
          }
        } else {
          console.log("Error in getMeterList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getMeterList:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modPipelineHeader = lodash.cloneDeep(this.state.modPipelineHeader);

      modPipelineHeader[propertyName] = data;
      this.setState({ modPipelineHeader });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (pipelineHeaderValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          pipelineHeaderValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modPipelineHeader = lodash.cloneDeep(this.state.modPipelineHeader);
      modPipelineHeader.Active = value;
      if (modPipelineHeader.Active !== this.state.pipelineHeader.Active)
        modPipelineHeader.Description = "";
      this.setState({ modPipelineHeader });
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };

  savePipelineHeader = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempPipelineHeader = lodash.cloneDeep(this.state.tempPipelineHeader);

      this.state.pipelineHeader.Code === ""
          ? this.createPipelineHeader(tempPipelineHeader)
          : this.updatePipelineHeader(tempPipelineHeader);
    } catch (error) {
      console.log("pipelineheaderComposite : Error in savePrimeMover");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      let modPipelineHeader = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      if (this.validateSave(modPipelineHeader, attributeList)) {
        modPipelineHeader = this.convertStringtoDecimal(
          modPipelineHeader,
          attributeList
        );

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempPipelineHeader = lodash.cloneDeep(modPipelineHeader);
      this.setState({ showAuthenticationLayout, tempPipelineHeader }, () => {
        if (showAuthenticationLayout === false) {
          this.savePipelineHeader();
        }
    });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillDetails() {
    try {
      let modPipelineHeader = lodash.cloneDeep(this.state.modPipelineHeader);

      if (
        modPipelineHeader.OuterDiameter !== null &&
        modPipelineHeader.OuterDiameter !== ""
      )
        modPipelineHeader.OuterDiameter =
          modPipelineHeader.OuterDiameter.toLocaleString();

      if (
        modPipelineHeader.WallThickness !== null &&
        modPipelineHeader.WallThickness !== ""
      )
        modPipelineHeader.WallThickness =
          modPipelineHeader.WallThickness.toLocaleString();

      if (
        modPipelineHeader.TypicalFlowRatePerHour !== null &&
        modPipelineHeader.TypicalFlowRatePerHour !== ""
      )
        modPipelineHeader.TypicalFlowRatePerHour =
          modPipelineHeader.TypicalFlowRatePerHour.toLocaleString();

      if (
        modPipelineHeader.OuterDiameter === null ||
        modPipelineHeader.OuterDiameter === ""
      )
        modPipelineHeader.OuterDiameterUOM = null;

      if (
        modPipelineHeader.WallThickness === null ||
        modPipelineHeader.WallThickness === ""
      )
        modPipelineHeader.WallThicknessUOM = null;

      if (
        modPipelineHeader.TypicalFlowRatePerHour === null ||
        modPipelineHeader.TypicalFlowRatePerHour === ""
      )
        modPipelineHeader.FlowRateUOM = null;

      this.setState({ modPipelineHeader });
      return modPipelineHeader;
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }
  validateSave(modPipelineHeader, attributeList) {
    try {
      const validationErrors = { ...this.state.validationErrors };
      Object.keys(pipelineHeaderValidationDef).forEach(function (key) {
        if (modPipelineHeader[key] !== undefined)
          validationErrors[key] = Utilities.validateField(
            pipelineHeaderValidationDef[key],
            modPipelineHeader[key]
          );
      });

      if (modPipelineHeader.Active !== this.state.pipelineHeader.Active) {
        if (
          modPipelineHeader.Description === null ||
          modPipelineHeader.Description === ""
        ) {
          validationErrors["Description"] = "BaseProductInfo_EnterRemarks";
        }
      }

      if (
        modPipelineHeader.OuterDiameter !== null &&
        modPipelineHeader.OuterDiameter !== ""
      ) {
        if (
          modPipelineHeader.OuterDiameterUOM === null ||
          modPipelineHeader.OuterDiameterUOM === ""
        ) {
          validationErrors["OuterDiameterUOM"] = "PipelineHeader_UOM_Required";
        }
      }
      if (
        modPipelineHeader.WallThickness !== null &&
        modPipelineHeader.WallThickness !== ""
      ) {
        if (
          modPipelineHeader.WallThicknessUOM === null ||
          modPipelineHeader.WallThicknessUOM === ""
        ) {
          validationErrors["WallThicknessUOM"] = "PipelineHeader_UOM_Required";
        }
      }
      if (
        modPipelineHeader.TypicalFlowRatePerHour !== null &&
        modPipelineHeader.TypicalFlowRatePerHour !== ""
      ) {
        if (
          modPipelineHeader.FlowRateUOM === null ||
          modPipelineHeader.FlowRateUOM === ""
        ) {
          validationErrors["FlowRateUOM"] = "PipelineHeader_UOM_Required";
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
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on validateSave",
        error
      );
    }
  }

  convertStringtoDecimal(modPipelineHeader, attributeList) {
    try {
      if (
        modPipelineHeader.OuterDiameter !== null &&
        modPipelineHeader.OuterDiameter !== ""
      ) {
        modPipelineHeader.OuterDiameter = Utilities.convertStringtoDecimal(
          modPipelineHeader.OuterDiameter
        );
      }
      if (
        modPipelineHeader.WallThickness !== null &&
        modPipelineHeader.WallThickness !== ""
      ) {
        modPipelineHeader.WallThickness = Utilities.convertStringtoDecimal(
          modPipelineHeader.WallThickness
        );
      }
      if (
        modPipelineHeader.TypicalFlowRatePerHour !== null &&
        modPipelineHeader.TypicalFlowRatePerHour !== ""
      ) {
        modPipelineHeader.TypicalFlowRatePerHour =
          Utilities.convertStringtoDecimal(
            modPipelineHeader.TypicalFlowRatePerHour
          );
      }
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modPipelineHeader.Attributes =
        Utilities.fillAttributeDetails(attributeList);
      return modPipelineHeader;
    } catch (error) {
      console.log("convertStringtoDecimal error Pipline Header Details", error);
    }
  }

  createPipelineHeader(modPipelineHeader) {
    let keyCode = [
      {
        key: KeyCodes.pipelineHeaderCode,
        value: modPipelineHeader.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.pipelineHeaderCode,
      KeyCodes: keyCode,
      Entity: modPipelineHeader,
    };

    let notification = {
      messageType: "critical",
      message: "PipeLineHeaderInfo_AddUpdateStatus",
      messageResultDetails: [
        {
          keyFields: ["PipeLineHeaderInfo_Code"],
          keyValues: [modPipelineHeader.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreatePipelineHeader,
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
                fnPipelineHeaderSiteView
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getPipelineHeader({ Common_Code: modPipelineHeader.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnPipelineHeaderSiteView
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createPipelineHeader:", result.ErrorList);
        }
        this.props.onSaved(this.state.modPipelineHeader, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnPipelineHeaderSiteView
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modPipelineHeader, "add", notification);
      });
  }
  updatePipelineHeader(modPipelineHeader) {
    let keyCode = [
      {
        key: KeyCodes.pipelineHeaderCode,
        value: modPipelineHeader.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.pipelineHeaderCode,
      KeyCodes: keyCode,
      Entity: modPipelineHeader,
    };

    let notification = {
      messageType: "critical",
      message: "PipeLineHeaderInfo_AddUpdateStatus",
      messageResultDetails: [
        {
          keyFields: ["PipeLineHeaderInfo_Code"],
          keyValues: [modPipelineHeader.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdatePipelineHeader,
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
                fnPipelineHeaderSiteView
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getPipelineHeader({ Common_Code: modPipelineHeader.Code })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnPipelineHeaderSiteView
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in update PipelineHeader:", result.ErrorList);
        }
        this.props.onSaved(
          this.state.modPipelineHeader,
          "update",
          notification
        );
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnPipelineHeaderSiteView
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(
          this.state.modPipelineHeader,
          "modify",
          notification
        );
      });
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const pipelineHeader = lodash.cloneDeep(this.state.pipelineHeader);

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modPipelineHeader: { ...pipelineHeader },
          selectedCompRow: [],
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange([this.props.selectedTerminal]);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on handleReset",
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
        Array.isArray(attributeMetaDataList) &&
        attributeMetaDataList.length > 0
      ) {
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      }
    } catch (error) {
      console.log(
        "PipelineHeaderSiteViewDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
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
        var modPipelineHeader = lodash.cloneDeep(this.state.modPipelineHeader);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modPipelineHeader.Attributes.find(
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
        "PipelineHeaderSiteViewDetailsComposite:Error occured on terminalSelectionChange",
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
        "PipelineHeaderSiteViewDetailsComposite:Error occured on handleAttributeDataChange",
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
          Utilities.getAttributeInitialValidationErrors(attributeMetaDataList),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      pipelineHeaderTypeOptions: this.state.pipelineHeaderTypeOptions,
      volumeUOMOptions: this.state.volumeUOMOptions,
      lengthUOMOptions: this.state.lengthUOMOptions,
      pipelineMeterList: this.state.pipelineMeterList,
    };

    const popUpContents = [
      {
        fieldName: "PipeLineHeaderInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modPipelineHeader.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modPipelineHeader.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "PipeLineHeaderInfo_CreatedTime",
        fieldValue:
          new Date(
            this.state.modPipelineHeader.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modPipelineHeader.CreatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "PipeLineHeaderInfo_LastActive",
        fieldValue:
          this.state.modPipelineHeader.LastActive !== undefined &&
          this.state.modPipelineHeader.LastActive !== null
            ? new Date(
                this.state.modPipelineHeader.LastActive
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modPipelineHeader.LastActive
              ).toLocaleTimeString()
            : "",
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.pipelineHeader.Code}
            newEntityName={"PipeLineHeaderInfo_NewPipeLineHeader"}
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <PipelineHeaderSiteViewDetails
            pipelineHeader={this.state.pipelineHeader}
            modPipelineHeader={this.state.modPipelineHeader}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange}
          ></PipelineHeaderSiteViewDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.pipelineHeader.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnPipelineHeaderSiteView}
            handleOperation={this.savePipelineHeader}
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

export default connect(mapStateToProps)(PipelineHeaderSiteViewDetailsComposite);

PipelineHeaderSiteViewDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  selectedTerminal: PropTypes.string.isRequired,
};
