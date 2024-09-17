import React, { Component } from "react";
import { emptyRigidTruck } from "../../../JS/DefaultEntities";
import { VesselDetails } from "../../UIBase/Details/VesselDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { vesselValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnVessel ,fnKPIInformation} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { trailerCompartmentValidationDef } from "../../../JS/DetailsTableValidationDef";
import {
  vesselAttributeEntity,
  vesselCompartmentAttributeEntity,
} from "../../../JS/AttributeEntity";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiVesselDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class VesselDetailsComposite extends Component {
  state = {
    vessel: lodash.cloneDeep(emptyRigidTruck),
    modVessel: {},
    validationErrors: Utilities.getInitialValidationErrors(vesselValidationDef),
    isReadyToRender: false,
    saveEnabled: false,
    carrierOptions: [],
    carrierSearchOptions: [],
    terminalOptions: [],
    selectedCompRow: [],
    productTypeOptions: [],
    loadingTypeOptions: [],
    vesselTypeOptions: [],
    volumeUOMOptions: [],
    weightUOMOptions: [],
    lengthUOMOptions: [],
    attributeMetaDataList: [],
    //compartmentAttributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    expandedRows: [],
    vesselKPIList: [],
    maxNumberOfCompartments: 30,
    showAuthenticationLayout: false,
    tempVessel: {},
  };

  getAttributes(vesselRow) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [vesselAttributeEntity, vesselCompartmentAttributeEntity],
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
                  result.EntityResult.marine_vessel
                ),
            },
            () => this.getVessel(vesselRow)
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  getVessel(vesselRow) {
    emptyRigidTruck.TerminalCodes = [];
    emptyRigidTruck.VehicleType = Constants.VehicleType.Ship;
    emptyRigidTruck.ShareholderCode = this.props.selectedShareholder;
    emptyRigidTruck.ProductType = "ALLPROD";
    emptyRigidTruck.VehicleTrailers[0].Trailer.LoadingType = "BOTTOM";
    if (vesselRow.Common_Code === undefined) {
      this.setState(
        {
          vessel: lodash.cloneDeep(emptyRigidTruck),
          modVessel: lodash.cloneDeep(emptyRigidTruck),
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          vesselKPIList:[],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnVessel
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: vesselRow.Common_Code,
      },
      {
        key: KeyCodes.carrierCode,
        value: vesselRow.Vehicle_CarrierCompany,
      },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.MARINE,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetVessel,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.VehicleTrailers[0].Trailer.Compartments !==
              null &&
            result.EntityResult.VehicleTrailers[0].Trailer.Compartments.length >
              0
          )
            result.EntityResult.VehicleTrailers[0].Trailer.Compartments =
              result.EntityResult.VehicleTrailers[0].Trailer.Compartments.sort(
                (a, b) =>
                  a.CompartmentSeqNoInTrailer - b.CompartmentSeqNoInTrailer
              );
          this.setState(
            {
              isReadyToRender: true,
              vessel: lodash.cloneDeep(result.EntityResult),
              modVessel: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnVessel
              ),
            },
            () => {
              this.getTerminalsForCarrier(
                result.EntityResult.CarrierCompanyCode
              );
              this.getKPIList(this.props.selectedShareholder,result.EntityResult.Code)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            vessel: lodash.cloneDeep(emptyRigidTruck),
            modVessel: lodash.cloneDeep(emptyRigidTruck),
            isReadyToRender: true,
          });
          console.log("Error in GetVessel:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Vessel:", error, vesselRow);
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
        var modVessel = lodash.cloneDeep(this.state.modVessel);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.marine_vessel.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modVessel.Attributes.find(
                  (vesselAttribute) => {
                    return vesselAttribute.TerminalCode === terminal;
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

        this.formCompartmentAttributes(selectedTerminals);

        this.setState({ modAttributeMetaDataList, attributeValidationErrors });
      }
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  formCompartmentAttributes(selectedTerminals) {
    try {
      let attributes = lodash.cloneDeep(this.state.attributeMetaDataList);

      attributes = attributes.marine_trailercompartment.filter(function (
        attTerminal
      ) {
        return selectedTerminals.some(function (selTerminal) {
          return attTerminal.TerminalCode === selTerminal;
        });
      });
      var modVessel = lodash.cloneDeep(this.state.modVessel);
      let compAttributes = [];
      attributes.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName,
            AttributeValue: attribute.DefaultValue,
            TerminalCode: attribute.TerminalCode,
            IsMandatory: attribute.IsMandatory,
            DataType: attribute.DataType,
            IsReadonly: attribute.IsReadonly,
            MinValue: attribute.MinValue,
            MaxValue: attribute.MaxValue,
            ValidationFormat: attribute.ValidationFormat,
            compSequenceNo: "",
          });
        });
      });
      let attributesforNewComp = lodash.cloneDeep(compAttributes);
      modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
        if (
          comp.Code === null &&
          (comp.AttributesforUI === null || comp.AttributesforUI === undefined)
        ) {
          comp.AttributesforUI = [];
          attributesforNewComp.forEach((assignedAttributes) => {
            assignedAttributes.compSequenceNo = comp.CompartmentSeqNoInTrailer;
            comp.AttributesforUI.push(assignedAttributes);
          });
        } else {
          if (
            comp.AttributesforUI !== null &&
            comp.AttributesforUI !== undefined
          ) {
            comp.AttributesforUI = comp.AttributesforUI.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });

            compAttributes = compAttributes.filter(function (attTerminal) {
              return !comp.AttributesforUI.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal.TerminalCode;
              });
            });
          } else comp.AttributesforUI = [];

          let tempCompAttributes = lodash.cloneDeep(compAttributes);
          if (
            Array.isArray(comp.Attributes) &&
            comp.Attributes !== null &&
            comp.Attributes !== undefined &&
            comp.Attributes.length > 0
          ) {
            let selectedTerminalAttributes = comp.Attributes.filter(function (
              attTerminal
            ) {
              return selectedTerminals.some(function (selTerminal) {
                return attTerminal.TerminalCode === selTerminal;
              });
            });
            selectedTerminalAttributes.forEach((att) => {
              att.ListOfAttributeData.forEach((attData) => {
                let tempAttIndex = tempCompAttributes.findIndex(
                  (item) =>
                    item.TerminalCode === att.TerminalCode &&
                    item.AttributeCode === attData.AttributeCode
                );
                if (tempAttIndex >= 0)
                  tempCompAttributes[tempAttIndex].AttributeValue =
                    attData.AttributeValue;
              });
            });
            tempCompAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo =
                comp.CompartmentSeqNoInTrailer;
              comp.AttributesforUI.push(assignedAttributes);
            });
          } else {
            compAttributes.forEach((assignedAttributes) => {
              assignedAttributes.compSequenceNo =
                comp.CompartmentSeqNoInTrailer;
              comp.AttributesforUI.push(assignedAttributes);
            });
          }
        }
        this.toggleExpand(comp, true, true);
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI = Utilities.compartmentAttributesConvertoDecimal(
            comp.AttributesforUI
          );
        comp.AttributesforUI = Utilities.addSeqNumberToListObject(
          comp.AttributesforUI
        );
      });
      this.setState({ modVessel });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }

  getCarrierList() {
    axios(
      RestAPIs.GetCarrierCodes +
        "?ShareholderCode=" +
        "&Transportationtype=" +
        Constants.TransportationType.MARINE,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let carrierOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let carrierSearchOptions = lodash.cloneDeep(carrierOptions);
            if (carrierSearchOptions.length > Constants.filteredOptionsCount) {
              carrierSearchOptions = carrierSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ carrierOptions, carrierSearchOptions });
          }
        } else {
          console.log("Error in GetCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
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
            let loadingTypeOptions = Utilities.transferListtoOptions(
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

  getProductTypes() {
    axios(
      RestAPIs.GetProductType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            let productTypeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            this.setState({ productTypeOptions });
          }
        } else {
          console.log("Error in getProductTypes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getProductTypes:", error);
      });
  }

  getVesselTypes() {
    axios(
      RestAPIs.GetVehicleAndTrailerTypes,
      Utilities.getAuthenticationObjectforPost(
        [Constants.TransportationType.MARINE],
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult.Table !== null) {
            let vesselTypes = result.EntityResult.Table;
            let vesselTypeOptions = [];
            vesselTypes.forEach((vesselType) => {
              vesselTypeOptions.push({
                text: vesselType.VehicleTypeCode,
                value: vesselType.VehicleTypeCode,
              });
            });
            this.setState({ vesselTypeOptions });
          }
        } else {
          console.log("Error in getVesselTypes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting getVesselTypes:", error);
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
            weightUOMs.forEach((weightOption) => {
              volumeUOMOptions.push({
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

  getTerminalsForCarrier(carrier) {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      const modVessel = lodash.cloneDeep(this.state.modVessel);
      let terminalOptions = [...this.state.terminalOptions];

      modVessel.CarrierCompanyCode = carrier;

      try {
        if (carrier === undefined) {
          terminalOptions = [];
          modVessel.TerminalCodes = [];
          this.setState({ terminalOptions, modVessel }, () => {
            this.formCompartmentAttributes([]);
          });
          return;
        }
        let keyCode = [
          {
            key: KeyCodes.carrierCode,
            value: carrier,
          },
          {
            key: KeyCodes.transportationType,
            value: Constants.TransportationType.MARINE,
          },
        ];
        let obj = {
          ShareHolderCode: this.props.selectedShareholder,
          keyDataCode: KeyCodes.carrierCode,
          KeyCodes: keyCode,
        };
        axios(
          RestAPIs.GetCarrier,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            let result = response.data;
            if (
              result.IsSuccess === true &&
              result.EntityResult !== null &&
              result.EntityResult.TerminalCodes !== null
            ) {
              terminalOptions = [...result.EntityResult.TerminalCodes];
              this.setState({ terminalOptions });
            } else {
              terminalOptions = [];

              this.setState({ terminalOptions });
              console.log("Error in getTerminalsForCarrier:", result.ErrorList);
            }
            let vessel = { ...this.state.vessel };
            if (
              vessel.Code === undefined ||
              vessel.Code === "" ||
              vessel.Code === null
            ) {
              if (terminalOptions.length === 1) {
                modVessel.TerminalCodes = [...terminalOptions];
                // this.terminalSelectionChange(modVessel.TerminalCodes);
              } else {
                modVessel.TerminalCodes = [];
                //this.terminalSelectionChange([]);
              }
            }

            if (Array.isArray(modVessel.TerminalCodes)) {
              modVessel.TerminalCodes = terminalOptions.filter((x) =>
                modVessel.TerminalCodes.includes(x)
              );
            }

            this.setState({ modVessel }, () => {
              this.terminalSelectionChange(modVessel.TerminalCodes);
            });
          })
          .catch((error) => {
            terminalOptions = [];
            modVessel.TerminalCodes = [];
            this.setState({ terminalOptions, modVessel });
            console.log("Error while getting Carrier:", error, carrier);
          });
      } catch (error) {
        terminalOptions = [];
        modVessel.TerminalCodes = [];
        this.setState({ terminalOptions, modVessel });
        console.log(
          "VesselDetailsComposite:Error occured on getTerminalsForCarrier",
          error
        );
      }
    }
  }

  handleAllTerminalsChange = (checked) => {
    try {
      let modVessel = lodash.cloneDeep(this.state.modVessel);
      let terminalOptions = [...this.state.terminalOptions];
      if (checked) modVessel.TerminalCodes = terminalOptions;
      else modVessel.TerminalCodes = [];
      this.setState({ modVessel }, () => {
        this.terminalSelectionChange(modVessel.TerminalCodes);
      });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on handleAllTerminalsChange",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      let validationErrors = { ...this.state.validationErrors };
      let modVessel = lodash.cloneDeep(this.state.modVessel);
      validationErrors[propertyName] = error;
      modVessel[propertyName] = value;
      this.setState({ validationErrors, modVessel });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes(this.props.selectedRow);
      //this.getVessel(this.props.selectedRow);
      this.getCarrierList();
      this.getLoadingTypes();
      this.getProductTypes();
      this.getVesselTypes();
      this.getUOMList();
      this.getLookupValue();
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.vessel.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getVessel(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  handleChange = (propertyName, data) => {
    try {
      const modVessel = lodash.cloneDeep(this.state.modVessel);
      modVessel[propertyName] = data;

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (vesselValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          vesselValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
      this.setState({ modVessel }, () => {
        if (propertyName === "TerminalCodes") {
          this.terminalSelectionChange(data);
        }
      });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  onCarrierCompanyChange = (data) => {
    try {
      const modVessel = lodash.cloneDeep(this.state.modVessel);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modVessel.CarrierCompanyCode = data;
      this.setState({ modVessel });
      if (this.props.userDetails.EntityResult.IsEnterpriseNode)
        this.getTerminalsForCarrier(data);

      validationErrors.CarrierCompanyCode = "";
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on onCarrierCompanyChange",
        error
      );
    }
  };

  handleLoadingTypeChange = (data) => {
    try {
      const modVessel = lodash.cloneDeep(this.state.modVessel);

      modVessel.VehicleTrailers[0].Trailer.LoadingType = data;
      this.setState({ modVessel });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on handleLoadingTypeChange",
        error
      );
    }
  };

  handleActiveStatusChange = (data) => {
    try {
      const modVessel = lodash.cloneDeep(this.state.modVessel);

      modVessel.Active = data;
      if (modVessel.Active !== this.state.vessel.Active) modVessel.Remarks = "";
      this.setState({ modVessel });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (modVessel.Active === this.state.vessel.Active) {
        if (modVessel.Remarks === null || modVessel.Remarks === "") {
          validationErrors.Remarks = "";
        }
      }
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on handleActiveStatusChange",
        error
      );
    }
  };

  handleAddCompartment = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        let newComp = {
          Attributes: [],
          Capacity: null,
          Code: null,
          CompartmentSeqNoInTrailer: 0,
          TrailerCode: null,
          ShareholderCode: null,
          CarrierCompanyCode: null,
          Description: "",
          FRUOM: null,
          FlangeNo: null,
          MaxFR: null,
          Name: "",
          NoofSeals: null,
          UOM: null,
        };
        let modVessel = lodash.cloneDeep(this.state.modVessel);

        if (modVessel.VehicleTrailers[0].Trailer.Compartments !== null) {
          if (modVessel.VehicleTrailers[0].Trailer.Compartments.length > 0)
            newComp.UOM =
              modVessel.VehicleTrailers[0].Trailer.Compartments[0].UOM;

          let seqno = 1;
          modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
            com.CompartmentSeqNoInTrailer = seqno;
            ++seqno;
          });
          newComp.CompartmentSeqNoInTrailer =
            modVessel.VehicleTrailers[0].Trailer.Compartments.length + 1;
          modVessel.VehicleTrailers[0].Trailer.Compartments.push(newComp);
        }

        this.setState(
          {
            modVessel,
            selectedCompRow: [],
          },
          () => {
            if (
              this.props.userDetails.EntityResult.IsEnterpriseNode === false
            ) {
              var attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList.marine_trailercompartment
              );
              if (attributeMetaDataList.length > 0)
                this.formCompartmentAttributes([
                  attributeMetaDataList[0].TerminalCode,
                ]);
            } else this.formCompartmentAttributes(modVessel.TerminalCodes);
          }
        );
      } catch (error) {
        console.log(
          "VesselDetailsComposite:Error occured on handleAddCompartment",
          error
        );
      }
    }
  };
  handleDeleteCompartment = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedCompRow != null &&
          this.state.selectedCompRow.length > 0
        ) {
          if (
            this.state.modVessel.VehicleTrailers[0].Trailer.Compartments
              .length > 0
          ) {
            let modVessel = lodash.cloneDeep(this.state.modVessel);

            this.state.selectedCompRow.forEach((obj, index) => {
              modVessel.VehicleTrailers[0].Trailer.Compartments =
                modVessel.VehicleTrailers[0].Trailer.Compartments.filter(
                  (com, cindex) => {
                    return (
                      com.CompartmentSeqNoInTrailer !==
                      obj.CompartmentSeqNoInTrailer
                    );
                  }
                );
            });

            let seqno = 1;
            modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
              com.CompartmentSeqNoInTrailer = seqno;
              ++seqno;
            });

            this.setState({ modVessel });
          }
        }

        this.setState({ selectedCompRow: [] });
      } catch (error) {
        console.log(
          "VesselDetailsComposite:Error occured on handleDeleteCompartment",
          error
        );
      }
    }
  };
  handleRowSelectionChange = (e) => {
    this.setState({ selectedCompRow: e });
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modVessel = lodash.cloneDeep(this.state.modVessel);

    if (cellData.field === "Description") {
      modVessel.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex][
        cellData.field
      ] = newVal;
    }
    if (cellData.field === "Capacity") {
      if (isNaN(parseInt(newVal))) {
        newVal = "";
      }
      modVessel.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex][
        cellData.field
      ] = newVal;
    }

    if (cellData.field === "UOM") {
      modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
        comp.UOM = newVal;
      });
    }
    this.toggleExpand(
      modVessel.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex],
      true,
      true
    );

    this.setState({ modVessel });
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const vessel = lodash.cloneDeep(this.state.vessel);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modVessel: { ...vessel },
          selectedCompRow: [],
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(vessel.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log("VesselDetailsComposite:Error occured on handleReset", error);
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
            attributeMetaDataList.marine_vessel
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList.marine_vessel) &&
        attributeMetaDataList.marine_vessel.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.marine_vessel[0].TerminalCode,
        ]);
      } else {
        if (
          Array.isArray(attributeMetaDataList.marine_trailercompartment) &&
          attributeMetaDataList.marine_trailercompartment.length > 0
        )
          this.formCompartmentAttributes([
            attributeMetaDataList.marine_trailercompartment[0].TerminalCode,
          ]);
      }
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  convertStringtoDecimal(modVessel, attributeList) {
    try {
      if (modVessel.Height !== null && modVessel.Height !== "") {
        modVessel.Height = Utilities.convertStringtoDecimal(modVessel.Height);
      }
      if (modVessel.Length !== null && modVessel.Length !== "") {
        modVessel.Length = Utilities.convertStringtoDecimal(modVessel.Length);
      }
      if (modVessel.Width !== null && modVessel.Width !== "") {
        modVessel.Width = Utilities.convertStringtoDecimal(modVessel.Width);
      }
      modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
        com.Capacity = Utilities.convertStringtoDecimal(com.Capacity);
      });

      modVessel = this.fillAttributeDetails(modVessel, attributeList);

      return modVessel;
    } catch (err) {
      console.log("convertStringtoDecimal error Vesseldetails", err);
    }
  }

  saveVessel = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempVessel = lodash.cloneDeep(this.state.tempVessel);

      this.state.vessel.Code === ""
          ? this.createVessel(tempVessel)
          : this.updateVessel(tempVessel);
    } catch (error) {
      console.log("VesselDetailsComposite : Error in saveVessel");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      let modVessel = this.fillDetails();
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );

      if (this.validateSave(modVessel, attributeList)) {
        modVessel = this.convertStringtoDecimal(modVessel, attributeList);
        modVessel = Utilities.convertDatesToString(
          DateFieldsInEntities.DatesInEntity.Vehicle,
          modVessel
        );

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempVessel = lodash.cloneDeep(modVessel);
      this.setState({ showAuthenticationLayout, tempVessel }, () => {
        if (showAuthenticationLayout === false) {
          this.saveVessel();
        }
    });
        
      } else this.setState({ saveEnabled: true });
    } catch (error) {
      console.log("VesselDetailsComposite:Error occured on handleSave", error);
    }
  };

  fillDetails() {
    try {
      let modVessel = lodash.cloneDeep(this.state.modVessel);

      modVessel.ShareholderCode =
        this.props.userDetails.EntityResult.PrimaryShareholder;
      modVessel.TransportationType = Constants.TransportationType.MARINE;
      modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
        comp.TrailerCode = modVessel.Code;
        comp.ShareholderCode = modVessel.ShareholderCode;
        comp.CarrierCompanyCode = modVessel.CarrierCompanyCode;
        if (comp.Capacity !== null && comp.Capacity !== "")
          comp.Capacity = comp.Capacity.toLocaleString();
        if (comp.Code === null || comp.Code === "") {
          comp.Code = Utilities.generateCompartmentCode(
            modVessel.VehicleTrailers[0].Trailer.Compartments
          ).toString();
        }
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesConverttoLocaleString(
              comp.AttributesforUI
            );
      });

      if (modVessel.Height === "") modVessel.Height = null;
      if (modVessel.Length === "") modVessel.Length = null;
      if (modVessel.Width === "") modVessel.Width = null;

      if (modVessel.Height !== null && modVessel.Height !== "")
        modVessel.Height = modVessel.Height.toLocaleString();
      if (modVessel.Length !== null && modVessel.Length !== "")
        modVessel.Length = modVessel.Length.toLocaleString();
      if (modVessel.Width !== null && modVessel.Width !== "")
        modVessel.Width = modVessel.Width.toLocaleString();
      var licDate = new Date();
      modVessel.LicenseNoIssueDate = licDate.getUTCDate();
      //modVessel.LicenseNoIssueDate = new Date();
      modVessel.VehicleTrailers[0].TrailerCode = modVessel.Code;
      modVessel.VehicleTrailers[0].VehicleCode = modVessel.Code;
      modVessel.VehicleTrailers[0].ShareholderCode = modVessel.ShareholderCode;
      modVessel.VehicleTrailers[0].CarrierCompanyCode =
        modVessel.CarrierCompanyCode;
      modVessel.VehicleTrailers[0].TrailerSeq = 1;
      modVessel.VehicleTrailers[0].Trailer.Code = modVessel.Code;
      modVessel.VehicleTrailers[0].Trailer.Name = modVessel.Name;
      modVessel.VehicleTrailers[0].Trailer.ShareholderCode =
        modVessel.ShareholderCode;
      modVessel.VehicleTrailers[0].Trailer.TransportationType =
        Constants.TransportationType.MARINE;
      modVessel.VehicleTrailers[0].Trailer.CarrierCompanyCode =
        modVessel.CarrierCompanyCode;
      modVessel.VehicleTrailers[0].Trailer.TrailerType = modVessel.VehicleType;
      modVessel.VehicleTrailers[0].Trailer.ProductType = modVessel.ProductType;
      modVessel.VehicleTrailers[0].Trailer.TareWeight = modVessel.TareWeight;
      modVessel.VehicleTrailers[0].Trailer.MaxLoadableWeight =
        modVessel.MaxLoadableWeight;
      modVessel.VehicleTrailers[0].Trailer.WeightUOM = modVessel.WeightUOM;
      modVessel.VehicleTrailers[0].Trailer.Active = modVessel.Active;

      // modVessel = this.fillAttributeDetails(modVessel);

      return modVessel;
    } catch (error) {
      console.log("VesselDetailsComposite:Error occured on fillDetails", error);
    }
  }

  fillAttributeDetails(modVessel, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modVessel.Attributes = Utilities.fillAttributeDetails(attributeList);

      // For Compartment
      modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesDatatypeConversion(
              comp.AttributesforUI
            );
        let selectedTerminals = [];
        if (this.props.userDetails.EntityResult.IsEnterpriseNode)
          selectedTerminals = lodash.cloneDeep(modVessel.TerminalCodes);
        else {
          var compAttributeMetaDataList = lodash.cloneDeep(
            this.state.attributeMetaDataList.marine_trailercompartment
          );
          if (compAttributeMetaDataList.length > 0)
            selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
        }
        let terminalAttributes = [];
        comp.Attributes = [];
        if (selectedTerminals !== undefined && selectedTerminals !== null)
          selectedTerminals.forEach((terminal) => {
            if (
              comp.AttributesforUI !== null &&
              comp.AttributesforUI !== undefined
            )
              terminalAttributes = comp.AttributesforUI.filter(function (
                attTerminal
              ) {
                return attTerminal.TerminalCode === terminal;
              });

            let attribute = {
              ListOfAttributeData: [],
            };

            attribute.TerminalCode = terminal;
            terminalAttributes.forEach((termAtt) => {
              if (termAtt.AttributeValue !== "" || termAtt.IsMandatory === true)
                attribute.ListOfAttributeData.push({
                  AttributeCode: termAtt.AttributeCode,
                  AttributeValue: termAtt.AttributeValue,
                });
            });
            if (
              attribute.ListOfAttributeData !== null &&
              attribute.ListOfAttributeData !== undefined &&
              attribute.ListOfAttributeData.length > 0
            )
              comp.Attributes.push(attribute);
          });
      });
      return modVessel;
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  validateSave(modVessel, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(vesselValidationDef).forEach(function (key) {
      if (modVessel[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          vesselValidationDef[key],
          modVessel[key]
        );
    });

    if (modVessel.Active !== this.state.vessel.Active) {
      if (modVessel.Remarks === null || modVessel.Remarks === "") {
        validationErrors["Remarks"] = "Vehicle_RemarksRequired";
      }
    }
    if (
      modVessel.VehicleTrailers[0].Trailer.LoadingType === null ||
      modVessel.VehicleTrailers[0].Trailer.LoadingType === ""
    ) {
      validationErrors["LoadingType"] =
        "RailWagonConfigurationDetails_MandatoryLoadingType";
    }

    let notification = {
      messageType: "critical",
      message: "VesselDetail_SavedStatus",
      messageResultDetails: [],
    };

    if (
      (modVessel.Height !== null ||
        modVessel.Width != null ||
        modVessel.Length !== null) &&
      modVessel.LWHUOM === null
    ) {
      validationErrors["LWHUOM"] = "Vessel_UFDRequired";
    } else {
      validationErrors["LWHUOM"] = "";
    }

    // if (modVessel.VehicleTrailers[0].Trailer.Compartments.length > 0) {
    //   modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
    //     trailerCompartmentValidationDef.forEach((col) => {
    //       let err = "";

    //       if (col.validator !== undefined) {
    //         err = Utilities.validateField(col.validator, com[col.field]);
    //       }

    //       if (err !== "") {
    //         notification.messageResultDetails.push({
    //           keyFields: ["Trailer_CompCode", col.displayName],
    //           keyValues: [com.Code, com[col.field]],
    //           isSuccess: false,
    //           errorMessage: err,
    //         });
    //       }
    //     });
    //   });
    // } else {
    //   notification.messageResultDetails.push({
    //     keyFields: ["Vessel_Code"],
    //     keyValues: [modVessel.Code],
    //     isSuccess: false,
    //     errorMessage: "TrailerInfo_CompartmentRequired",
    //   });
    // }

    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    //let attributeList = lodash.cloneDeep(this.state.modAttributeMetaDataList);

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
    else return returnValue;
    if (modVessel.VehicleTrailers[0].Trailer.Compartments.length > 0) {
      if (modVessel.VehicleTrailers[0].Trailer.Compartments.length <= this.state.maxNumberOfCompartments) {
         modVessel.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
        trailerCompartmentValidationDef.forEach((col) => {
          let err = "";

          if (col.validator !== undefined) {
            err = Utilities.validateField(col.validator, com[col.field]);
          }

          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: ["Trailer_CompCode", col.displayName],
              keyValues: [com.Code, com[col.field]],
              isSuccess: false,
              errorMessage: err,
            });
          }
        });
        // let updatedAttributes = [];
        // if (com.AttributesforUI !== null && com.AttributesforUI !== undefined)
        //   updatedAttributes = com.AttributesforUI.filter(function (
        //     uIAttributes
        //   ) {
        //     return com.Attributes.some(function (selAttribute) {
        //       let isPresent =
        //         selAttribute.ListOfAttributeData.findIndex(
        //           (item) => item.AttributeCode === uIAttributes.AttributeCode
        //         ) >= 0
        //           ? true
        //           : false;
        //       return (
        //         uIAttributes.TerminalCode === selAttribute.TerminalCode &&
        //         isPresent
        //       );
        //     });
        //   });

        if (com.AttributesforUI !== null && com.AttributesforUI !== undefined) {
          com.AttributesforUI.forEach((item) => {
            let errMsg = Utilities.valiateAttributeField(
              item,
              item.AttributeValue
            );
            if (errMsg !== "") {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                notification.messageResultDetails.push({
                  keyFields: [
                    "CompAttributeComp",
                    "CompAttributeTerminal",
                    item.AttributeName,
                  ],
                  keyValues: [com.Code, item.TerminalCode, item.AttributeValue],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              } else {
                notification.messageResultDetails.push({
                  keyFields: ["CompAttributeComp", item.AttributeName],
                  keyValues: [com.Code, item.AttributeValue],
                  isSuccess: false,
                  errorMessage: errMsg,
                });
              }
            }
          });
        }
        this.toggleExpand(com, true, true);
      });
      }
      else {
         notification.messageResultDetails.push({
        keyFields: ["Vessel_Code"],
        keyValues: [modVessel.Code],
        isSuccess: false,
        errorMessage: "Compartment_limit_Exceeded",
      });
      }
    } else {
      notification.messageResultDetails.push({
        keyFields: ["Vessel_Code"],
        keyValues: [modVessel.Code],
        isSuccess: false,
        errorMessage: "TrailerInfo_CompartmentRequired",
      });
    }

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modVessel, "update", notification);
      return false;
    }
    return returnValue;
  }

  createVessel(modVessel) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modVessel.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modVessel,
    };

    let notification = {
      messageType: "critical",
      message: "VesselDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vessel_Code"],
          keyValues: [modVessel.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateVessel,
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
                fnVessel
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getVessel({
                Common_Code: modVessel.Code,
                Vehicle_CarrierCompany: modVessel.CarrierCompanyCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnVessel
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateVessel:", result.ErrorList);
        }
        this.props.onSaved(this.state.modVessel, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnVessel
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modRigidTruck, "add", notification);
      });
  }

  updateVessel(modVessel) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modVessel.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modVessel,
    };

    let notification = {
      messageType: "critical",
      message: "VesselDetail_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vessel_Code"],
          keyValues: [modVessel.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateVessel,
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
                fnVessel
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getVessel({
                Common_Code: modVessel.Code,
                Vehicle_CarrierCompany: modVessel.CarrierCompanyCode,
              })
          );
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVessel
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateVessel:", result.ErrorList);
        }
        //console.log(notification);
        this.props.onSaved(this.state.modRigidTruck, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modRigidTruck, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnVessel
          ),
          showAuthenticationLayout: false,
        });
      });
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
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "VesselDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  toggleExpand = (data, open, isTerminalAdded = false) => {
    let expandedRows = this.state.expandedRows;
    let expandedRowIndex = expandedRows.findIndex(
      (item) =>
        item.CompartmentSeqNoInTrailer === data.CompartmentSeqNoInTrailer
    );
    if (open) {
      if (isTerminalAdded && expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
        expandedRows.push(data);
      } else if (expandedRowIndex >= 0) {
        expandedRows.splice(expandedRowIndex, 1);
      }
    } else {
      if (expandedRowIndex >= 0) {
        expandedRows = expandedRows.filter(
          (x) =>
            x.Code !== data.Code &&
            x.CompartmentSeqNoInTrailer !== data.CompartmentSeqNoInTrailer
        );
      } else expandedRows.push(data);
    }
    this.setState({ expandedRows });
  };

  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modVessel = lodash.cloneDeep(this.state.modVessel);
    let compIndex = modVessel.VehicleTrailers[0].Trailer.Compartments.findIndex(
      (item) =>
        item.CompartmentSeqNoInTrailer === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0)
      modVessel.VehicleTrailers[0].Trailer.Compartments[
        compIndex
      ].AttributesforUI[
        // compAttribute.rowIndex
        compAttribute.rowData.SeqNumber - 1
      ].AttributeValue = value;
    this.setState({ modVessel });
    if (compIndex >= 0)
      this.toggleExpand(
        modVessel.VehicleTrailers[0].Trailer.Compartments[compIndex],
        true,
        true
      );
  };

  handleCarrierSearchChange = (carrierCode) => {
    try {
      let carrierSearchOptions = this.state.carrierOptions.filter((item) =>
        item.value.toLowerCase().includes(carrierCode.toLowerCase())
      );
      if (carrierSearchOptions.length > Constants.filteredOptionsCount) {
        carrierSearchOptions = carrierSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        carrierSearchOptions,
      });
    } catch (error) {
      console.log(
        "VesselDetailsCompositeComposite:Error occured on handleCarrierSearchChange",
        error
      );
    }
  };

  getCarrierSearchOptions() {
    let carrierSearchOptions = lodash.cloneDeep(
      this.state.carrierSearchOptions
    );
    let modCarrierCode = this.state.modVessel.CarrierCompanyCode;
    if (
      modCarrierCode !== null &&
      modCarrierCode !== "" &&
      modCarrierCode !== undefined
    ) {
      let selectedCarrierCode = carrierSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modCarrierCode.toLowerCase()
      );
      if (selectedCarrierCode === undefined) {
        carrierSearchOptions.push({
          text: modCarrierCode,
          value: modCarrierCode,
        });
      }
    }
    return carrierSearchOptions;
  }
  //Get KPI for vessel
  getKPIList(shareholder,vesselCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiVesselDetail,
        InputParameters: [{ key: "VesselCode", value: vesselCode }],
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
              vesselKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ vesselKPIList: [] });
            console.log("Error in vessel KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Vessel KPIList:", error);
        });
    }
  }

  getLookupValue() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=VirtualPreset",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (!isNaN(parseInt(result.EntityResult["MarineMaximumNumberOfCompartments"]))) {
            this.setState({maxNumberOfCompartments:parseInt(result.EntityResult["MarineMaximumNumberOfCompartments"])})
          }
        }
      });
    } catch (error) {
      console.log("Error while getting LookupValue:", error);
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      // carriers: this.state.carrierOptions,
      carriers: this.getCarrierSearchOptions(),
      vesselType: this.state.vesselTypeOptions,
      productType: this.state.productTypeOptions,
      loadingType: this.state.loadingTypeOptions,
      unitOfVolume: this.state.volumeUOMOptions,
      unitOfDimension: this.state.lengthUOMOptions,
      terminalCodes: this.state.terminalOptions,
    };
    const popUpContents = [
      {
        fieldName: "Vessel_LastUpdated",
        fieldValue:
          new Date(this.state.modVessel.LastUpdateTime).toLocaleDateString() +
          " " +
          new Date(this.state.modVessel.LastUpdateTime).toLocaleTimeString(),
      },
      {
        fieldName: "Vessel_LastActiveTime",
        fieldValue:
          this.state.modVessel.LastActiveTime !== undefined &&
          this.state.modVessel.LastActiveTime !== null
            ? new Date(
                this.state.modVessel.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(this.state.modVessel.LastActiveTime).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "Vessel_CreateTime",
        fieldValue:
          new Date(this.state.modVessel.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modVessel.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.vessel.Code}
            newEntityName="VesselDetails_VesselHeader"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.vesselKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <VesselDetails
            vessel={this.state.vessel}
            modVessel={this.state.modVessel}
            validationErrors={this.state.validationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onCarrierCompanyChange={this.onCarrierCompanyChange}
            onLoadingTypeChange={this.handleLoadingTypeChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            onDateTextChange={this.handleDateTextChange}
            handleAddCompartment={this.handleAddCompartment}
            handleDeleteCompartment={this.handleDeleteCompartment}
            handleCellDataEdit={this.handleCellDataEdit}
            handleRowSelectionChange={this.handleRowSelectionChange}
            selectedCompRow={this.state.selectedCompRow}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            onAttributeDataChange={this.handleAttributeDataChange} 
            expandedRows={this.state.expandedRows}
            compartmentDetailsPageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            toggleExpand={this.toggleExpand}
            handleCompAttributeCellDataEdit={
              this.handleCompAttributeCellDataEdit
            }
            onCarrierSearchChange={this.handleCarrierSearchChange}
          ></VesselDetails>
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
              this.state.vessel.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnVessel}
            handleOperation={this.saveVessel}
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

export default connect(mapStateToProps)(VesselDetailsComposite);

VesselDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
