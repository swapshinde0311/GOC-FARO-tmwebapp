import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import { rigidTruckValidationDef } from "../../../JS/ValidationDef";
import { connect } from "react-redux";
import axios from "axios";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import {
  functionGroups,
  fnVehicle,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import lodash from "lodash";
import RigidTruckDetails from "../../UIBase/Details/RigidTruckDetails";
import { trailerCompartmentValidationDef } from "../../../JS/DetailsTableValidationDef";
import { emptyRigidTruck } from "../../../JS/DefaultEntities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import {
  vehicleAttributeEntity,
  vehicleTrailerAttributeEntity,
  trailerAttributeEntity,
  trailerCompAttributeEntity,
} from "../../../JS/AttributeEntity";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import { kpiVehicleDetail } from "../../../JS/KPIPageName";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RigidTruckDetailsComposite extends Component {
  state = {
    rigidTruck: {},
    modRigidTruck: {},
    validationErrors: Utilities.getInitialValidationErrors(
      rigidTruckValidationDef
    ),
    isReadyToRender: false,
    carrierOptions: [],
    terminalOptions: [],
    volumeUOMOptions: [],
    weightUOMOptions: [],
    lengthUOMOptions: [],
    productTypeOptions: [],
    loadingTypeOptions: [],
    saveEnabled: false,
    selectedCompRow: [],
    attributeMetaDataList: [],
    modVehicleAttributeMetaDataList: [],
    modVehicleTrailerAttributeMetaDataList: [],
    modTrailerAttributeMetaDataList: [],
    vehicleAttributeValidationErrors: [],
    vehicleTrailerAttributeValidationErrors: [],
    trailerAttributeValidationErrors: [],
    expandedRows: [],
    isBonded: false,
    vehicleKPIList: [],
    hazardousEnabled: false,
    hazardousTankerCategoryOptions: [],
    maxNumberOfCompartments: 12,
    showAuthenticationLayout: false,
    tempVehicle: {},
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      let isNewTruck = false;
      if (this.props.selectedRow.Common_Code === undefined) isNewTruck = true;
      this.getHazardousLookup();
      this.getAttributes(isNewTruck);
      this.getCarrierList(this.props.selectedShareholder);
      this.getUOMList();
      this.getProductTypes();
      this.getLoadingTypes();
      this.IsBonded();
      
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  getHazardousLookup() {
    try {
      axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=HazardousMaterial",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult["RoadEnabled"] &&
            result.EntityResult["RoadEnabled"].toLowerCase() === "true"
          ) {
            this.setState({ hazardousEnabled: true });
            this.getHazardousCategories();
          }
        }
      });
       axios(
        RestAPIs.GetLookUpData + "?LookUpTypeCode=VirtualPreset",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (!isNaN(parseInt(result.EntityResult["RoadMaximumNumberOfCompartments"]))) {
            this.setState({maxNumberOfCompartments:parseInt(result.EntityResult["RoadMaximumNumberOfCompartments"])})
          }
        }
      });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on getHazardousLookup",
        error
      );
    }
  }
  getHazardousCategories() {
    axios(
      RestAPIs.GetHazardousTankerCategories,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    ).then((response) => {
      var result = response.data;
      if (result.IsSuccess === true) {
        if (
          result.EntityResult !== null &&
          Array.isArray(result.EntityResult)
        ) {
          let categoryOptions = Utilities.transferListtoOptions(
            result.EntityResult
          );
          this.setState({ hazardousTankerCategoryOptions: categoryOptions });
        }
      } else {
        console.log("Error in getHazardousCategories:", result.ErrorList);
      }
    });
  }
  catch(error) {
    console.log(
      "RigidTruckDetailsComposite:Error occured on getHazardousCategories",
      error
    );
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

  IsBonded() {
    axios(
      RestAPIs.GetLookUpData + "?LookUpTypeCode=Bonding",
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          let bonded = result.EntityResult["EnableBondingNon-Bonding"];
          this.setState({
            isBonded: bonded.toUpperCase() === "TRUE" ? true : false,
          });
        } else {
          this.setState({
            isBonded: false,
          });
          console.log("Error in get IsBonded: ", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({
          isBonded: false,
        });
        console.log(
          "SealMasterDetailsComposite: Error occurred on get IsBonded",
          error
        );
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
  getUOMList() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        // console.log(response);
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            let weightUOMs = result.EntityResult.MASS;
            let weightUOMOptions = [];
            weightUOMs.forEach((weightOption) => {
              weightUOMOptions.push({
                text: weightOption,
                value: weightOption,
              });
            });

            let volumeUOMs = result.EntityResult.VOLUME;
            let volumeUOMOptions = [];
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
              weightUOMOptions,
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
  getCarrierList(shareholder) {
    axios(
      RestAPIs.GetCarrierCodes +
        "?ShareholderCode=" +
        shareholder +
        "&Transportationtype=" +
        Constants.TransportationType.ROAD,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            // const carrierOptions = [];
            // result.EntityResult.Table.forEach((carrier) => {
            //   carrierOptions.push({
            //     text: carrier.Common_Code,
            //     value: carrier.Common_Name,
            //   });
            // });
            let carrierOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );

            this.setState({ carrierOptions });
          }
        } else {
          console.log("Error while getting Carrier List:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }
  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.rigidTruck.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getRigidTruck(true);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  handleCarrierChange = (carrier) => {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode)
      this.getTerminalsForCarrier(carrier);
    else {
      const modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
      modRigidTruck.CarrierCompanyCode = carrier;
      const terminalOptions = [];
      modRigidTruck.TerminalCodes = [];
      this.setState({ terminalOptions, modRigidTruck });
    }
    if (rigidTruckValidationDef["CarrierCompanyCode"] !== undefined) {
      const validationErrors = { ...this.state.validationErrors };
      validationErrors["CarrierCompanyCode"] = Utilities.validateField(
        rigidTruckValidationDef["CarrierCompanyCode"],
        carrier
      );

      this.setState({ validationErrors });
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
      modRigidTruck.Active = value;
      if (modRigidTruck.Active !== this.state.rigidTruck.Active)
        modRigidTruck.Remarks = "";
      this.setState({ modRigidTruck });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured in handleActiveStatusChange",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
    try {
      if (propertyName === "LoadingType") {
        modRigidTruck.VehicleTrailers[0].Trailer.LoadingType = data;
        this.setState({ modRigidTruck });
      } else {
        modRigidTruck[propertyName] = data;
        // this.setState({ modRigidTruck });
      }
      const validationErrors = { ...this.state.validationErrors };
      if (modRigidTruck.Active === this.state.rigidTruck.Active) {
        if (
          this.state.rigidTruck.Remarks === modRigidTruck.Remarks ||
          modRigidTruck.Remarks === ""
        ) {
          if (
            this.state.rigidTruck.IsBonded === modRigidTruck.IsBonded &&
            this.state.isBonded
          )
            validationErrors.Remarks = "";
        }
        if (modRigidTruck.Remarks === "")
          modRigidTruck.Remarks = this.state.rigidTruck.Remarks;
      }

      if (propertyName === "IsBonded") {
        modRigidTruck.VehicleCustomsBondNo = null;
        modRigidTruck.BondExpiryDate = null;
        validationErrors.VehicleCustomsBondNo = "";
        validationErrors.BondExpiryDate = "";
      }
      // if (propertyName === "Active") {
      //   if (modRigidTruck.Active !== this.state.rigidTruck.Active) {
      //     modRigidTruck.Remarks = "";
      //   }
      // }

      if (
        propertyName === "RoadTaxNo" ||
        propertyName === "RoadTaxNoIssueDate" ||
        propertyName === "RoadTaxNoExpiryDate"
      ) {
        //validationErrors[propertyName] = "";
        validationErrors.RoadTaxNo = "";
        validationErrors.RoadTaxNoIssueDate = "";
        validationErrors.RoadTaxNoExpiryDate = "";
      }
      if (
        propertyName === "Height" ||
        propertyName === "Length" ||
        propertyName === "Width" ||
        propertyName === "LWHUOM"
      ) {
        validationErrors.LWHUOM = "";
      }

      if (rigidTruckValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          rigidTruckValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modRigidTruck }, () => {
        if (propertyName === "TerminalCodes") {
          this.terminalSelectionChange(data);
        }
      });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  getAttributes(isNewTruck) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [
            vehicleAttributeEntity,
            vehicleTrailerAttributeEntity,
            trailerAttributeEntity,
            trailerCompAttributeEntity,
          ],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
              vehicleAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.vehicle
                ),
              vehicleTrailerAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.vehicletrailer
                ),
              trailerAttributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.TRAILER
                ),
            },
            () => this.getRigidTruck(isNewTruck)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var modVehicleAttributeMetaDataList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        modVehicleAttributeMetaDataList = lodash.cloneDeep(
          this.state.modVehicleAttributeMetaDataList
        );
        const vehicleAttributeValidationErrors = lodash.cloneDeep(
          this.state.vehicleAttributeValidationErrors
        );
        var modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

        selectedTerminals.forEach((terminal) => {
          var existitem = modVehicleAttributeMetaDataList.find(
            (selectedAttribute) => {
              return selectedAttribute.TerminalCode === terminal;
            }
          );

          if (existitem === undefined) {
            attributeMetaDataList.vehicle.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modRigidTruck.Attributes.find(
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
        modVehicleAttributeMetaDataList = [];
        modVehicleAttributeMetaDataList = attributesTerminalsList;
        modVehicleAttributeMetaDataList = Utilities.attributesConvertoDecimal(
          modVehicleAttributeMetaDataList
        );
        vehicleAttributeValidationErrors.forEach((attributeValidation) => {
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
        this.setState({
          modVehicleAttributeMetaDataList,
          vehicleAttributeValidationErrors,
        });
        this.setVehicleTrailerAttributes(selectedTerminals);
      }
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  setVehicleTrailerAttributes(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeMetaDataList = [];
      var modVehicleTrailerAttributeMetaDataList = [];
      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      modVehicleTrailerAttributeMetaDataList = lodash.cloneDeep(
        this.state.modVehicleTrailerAttributeMetaDataList
      );
      const vehicleTrailerAttributeValidationErrors = lodash.cloneDeep(
        this.state.vehicleTrailerAttributeValidationErrors
      );
      var modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

      selectedTerminals.forEach((terminal) => {
        var existitem = modVehicleTrailerAttributeMetaDataList.find(
          (selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          }
        );

        if (existitem === undefined) {
          attributeMetaDataList.vehicletrailer.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue =
                modRigidTruck.VehicleTrailers[0].Attributes.find(
                  (baseproductAttribute) => {
                    return baseproductAttribute.TerminalCode === terminal;
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
      modVehicleTrailerAttributeMetaDataList = [];
      modVehicleTrailerAttributeMetaDataList = attributesTerminalsList;
      modVehicleTrailerAttributeMetaDataList =
        Utilities.attributesConvertoDecimal(
          modVehicleTrailerAttributeMetaDataList
        );
      vehicleTrailerAttributeValidationErrors.forEach((attributeValidation) => {
        var existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        }
      });
      this.setState({
        modVehicleTrailerAttributeMetaDataList,
        vehicleTrailerAttributeValidationErrors,
      });
      this.setTrailerAttributes(selectedTerminals);
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on setVehicleTrailerAttributes",
        error
      );
    }
  }

  setTrailerAttributes(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeMetaDataList = [];
      var modTrailerAttributeMetaDataList = [];
      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      modTrailerAttributeMetaDataList = lodash.cloneDeep(
        this.state.modTrailerAttributeMetaDataList
      );
      const trailerAttributeValidationErrors = lodash.cloneDeep(
        this.state.trailerAttributeValidationErrors
      );
      var modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

      selectedTerminals.forEach((terminal) => {
        var existitem = modTrailerAttributeMetaDataList.find(
          (selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          }
        );

        if (existitem === undefined) {
          attributeMetaDataList.TRAILER.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue =
                modRigidTruck.VehicleTrailers[0].Trailer.Attributes.find(
                  (baseproductAttribute) => {
                    return baseproductAttribute.TerminalCode === terminal;
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
      modTrailerAttributeMetaDataList = [];
      modTrailerAttributeMetaDataList = attributesTerminalsList;
      modTrailerAttributeMetaDataList = Utilities.attributesConvertoDecimal(
        modTrailerAttributeMetaDataList
      );
      trailerAttributeValidationErrors.forEach((attributeValidation) => {
        var existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        }
      });
      this.setState({
        modTrailerAttributeMetaDataList,
        trailerAttributeValidationErrors,
      });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on setTrailerAttributes",
        error
      );
    }
  }

  formCompartmentAttributes(selectedTerminals) {
    try {
      let attributes = lodash.cloneDeep(this.state.attributeMetaDataList);

      attributes = attributes.TRAILERCOMPARTMENT.filter(function (attTerminal) {
        return selectedTerminals.some(function (selTerminal) {
          return attTerminal.TerminalCode === selTerminal;
        });
      });
      var modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

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
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
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
      this.setState({ modRigidTruck });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }

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
    var modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

    let compIndex =
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments.findIndex(
        (item) =>
          item.CompartmentSeqNoInTrailer ===
          compAttribute.rowData.compSequenceNo
      );
    if (compIndex >= 0)
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments[
        compIndex
      ].AttributesforUI[
        // compAttribute.rowIndex
        compAttribute.rowData.SeqNumber - 1
      ].AttributeValue = value;
    this.setState({ modRigidTruck });
    if (compIndex >= 0)
      this.toggleExpand(
        modRigidTruck.VehicleTrailers[0].Trailer.Compartments[compIndex],
        true,
        true
      );
  };

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList.vehicle) &&
        attributeMetaDataList.vehicle.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.vehicle[0].TerminalCode,
        ]);
      } else {
        if (
          Array.isArray(attributeMetaDataList.TRAILERCOMPARTMENT) &&
          attributeMetaDataList.TRAILERCOMPARTMENT.length > 0
        )
          this.formCompartmentAttributes([
            attributeMetaDataList.TRAILERCOMPARTMENT[0].TerminalCode,
          ]);
      }
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getRigidTruck(isNewTruck) {
    if (isNewTruck) {
      let terminalOptions = [];
      emptyRigidTruck.WeightUOM =
        this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.MassUOM;
      this.setState(
        {
          rigidTruck: lodash.cloneDeep(emptyRigidTruck),
          modRigidTruck: lodash.cloneDeep(emptyRigidTruck),
          isReadyToRender: true,
          terminalOptions,
          modVehicleAttributeMetaDataList: [],
          modVehicleTrailerAttributeMetaDataList: [],
          modTrailerAttributeMetaDataList: [],
          vehicleKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnVehicle
          ),
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
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value:
          this.props.selectedRow.Common_Code === undefined
            ? this.state.modRigidTruck.Code
            : this.props.selectedRow.Common_Code,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetVehicle,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        // console.log(response);
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            console.log("result.EntityResult", result.EntityResult);
            result.EntityResult.MaxLoadableWeight =
              result.EntityResult.MaxLoadableWeight +
              result.EntityResult.TareWeight;
            if (
              result.EntityResult.VehicleTrailers[0].Trailer.Compartments !==
                null &&
              result.EntityResult.VehicleTrailers[0].Trailer.Compartments
                .length > 0
            )
              result.EntityResult.VehicleTrailers[0].Trailer.Compartments =
                result.EntityResult.VehicleTrailers[0].Trailer.Compartments.sort(
                  (a, b) =>
                    a.CompartmentSeqNoInTrailer - b.CompartmentSeqNoInTrailer
                );
          }
          this.setState(
            {
              isReadyToRender: true,
              rigidTruck: lodash.cloneDeep(result.EntityResult),
              modRigidTruck: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnVehicle
              ),
            },
            () => {
              this.getTerminalsForCarrier(
                result.EntityResult.CarrierCompanyCode
              );
              this.getKPIList(
                this.props.selectedShareholder,
                result.EntityResult.Code
              );
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          emptyRigidTruck.ShareholderCode = this.props.selectedShareholder;

          this.setState({
            modRigidTruck: lodash.cloneDeep(emptyRigidTruck),
            rigidTruck: lodash.cloneDeep(emptyRigidTruck),
            isReadyToRender: true,
          });
          console.log("Error in GetVehicle:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Vehicle:", error);
      });
  }

  getTerminalsForCarrier(carrier) {
    if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
      const modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
      modRigidTruck.CarrierCompanyCode = carrier;
      const terminalOptions = [];
      //modRigidTruck.TerminalCodes = [];
      this.setState({ terminalOptions, modRigidTruck });
    } else {
      const modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
      let terminalOptions = [...this.state.terminalOptions];

      modRigidTruck.CarrierCompanyCode = carrier;

      try {
        if (carrier === undefined) {
          terminalOptions = [];
          modRigidTruck.TerminalCodes = [];
          this.setState({ terminalOptions, modRigidTruck }, () => {
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
            value: Constants.TransportationType.ROAD,
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
            //console.log(result);
            //console.log("IsSuccess-", result.IsSuccess);

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
              console.log("Error in GetCarrier:", result.ErrorList);
            }
            let rigidTruck = { ...this.state.rigidTruck };
            if (
              rigidTruck.Code === undefined ||
              rigidTruck.Code === "" ||
              rigidTruck.Code === null
            ) {
              if (terminalOptions.length === 1) {
                modRigidTruck.TerminalCodes = [...terminalOptions];
              } else {
                modRigidTruck.TerminalCodes = [];
              }
            }

            if (Array.isArray(modRigidTruck.TerminalCodes)) {
              modRigidTruck.TerminalCodes = terminalOptions.filter((x) =>
                modRigidTruck.TerminalCodes.includes(x)
              );
            }

            this.setState({ modRigidTruck }, () => {
              this.terminalSelectionChange(modRigidTruck.TerminalCodes);
            });
          })
          .catch((error) => {
            terminalOptions = [];
            modRigidTruck.TerminalCodes = [];
            this.setState({ terminalOptions, modRigidTruck });
            console.log("Error while getting Carrier:", error, carrier);
            //throw error;
          });
      } catch (error) {
        terminalOptions = [];
        modRigidTruck.TerminalCodes = [];
        this.setState({ terminalOptions, modRigidTruck });
        console.log(
          "RigidTruckDetailsComposite:Error occured on handleCarrierChange",
          error
        );
      }
    }
  }

  handleReset = () => {
    try {
      this.setState(
        {
          modRigidTruck: lodash.cloneDeep(this.state.rigidTruck),
          modVehicleAttributeMetaDataList: [],
          modVehicleTrailerAttributeMetaDataList: [],
          modTrailerAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(
              this.state.modRigidTruck.TerminalCodes
            );
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.rigidTruck.Code === "") {
        //let terminalOptions = { ...this.state.terminalOptions };
        let terminalOptions = [];
        this.setState({ terminalOptions });
      }
      let validationErrors = { ...this.state.validationErrors };
      Object.keys(validationErrors).forEach((key) => {
        validationErrors[key] = "";
      });
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on handleReset",
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
        vehicleAttributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.vehicle
          ),
        vehicleTrailerAttributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.vehicletrailer
          ),
        trailerAttributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.TRAILER
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleAddCompartment = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        // let modRigidTruck = this.state.modRigidTruck;
        // if (
        //   modRigidTruck.VehicleTrailers[0].Trailer.Compartments !== null &&
        //   Array.isArray(modRigidTruck.VehicleTrailers[0].Trailer.Compartments) &&
        //   modRigidTruck.VehicleTrailers[0].Trailer.Compartments.length < 73
        // ) {
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

        let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

        if (modRigidTruck.VehicleTrailers[0].Trailer.Compartments !== null) {
          if (modRigidTruck.VehicleTrailers[0].Trailer.Compartments.length > 0)
            newComp.UOM =
              modRigidTruck.VehicleTrailers[0].Trailer.Compartments[0].UOM;

          let seqno = 1;
          modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach(
            (com) => {
              com.CompartmentSeqNoInTrailer = seqno;
              ++seqno;
            }
          );
          newComp.CompartmentSeqNoInTrailer =
            modRigidTruck.VehicleTrailers[0].Trailer.Compartments.length + 1;
          modRigidTruck.VehicleTrailers[0].Trailer.Compartments.push(newComp);
        }

        this.setState(
          {
            modRigidTruck,
            selectedCompRow: [],
          },
          () => {
            if (
              this.props.userDetails.EntityResult.IsEnterpriseNode === false
            ) {
              var attributeMetaDataList = lodash.cloneDeep(
                this.state.attributeMetaDataList.TRAILERCOMPARTMENT
              );
              if (attributeMetaDataList.length > 0)
                this.formCompartmentAttributes([
                  attributeMetaDataList[0].TerminalCode,
                ]);
            } else this.formCompartmentAttributes(modRigidTruck.TerminalCodes);
          }
        );
        // }
      } catch (error) {
        console.log(
          "RigidTruckDetailsComposite:Error occured on handleAddCompartment",
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
            this.state.modRigidTruck.VehicleTrailers[0].Trailer.Compartments
              .length > 0
          ) {
            let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

            this.state.selectedCompRow.forEach((obj, index) => {
              modRigidTruck.VehicleTrailers[0].Trailer.Compartments =
                modRigidTruck.VehicleTrailers[0].Trailer.Compartments.filter(
                  (com, cindex) => {
                    return (
                      com.CompartmentSeqNoInTrailer !==
                      obj.CompartmentSeqNoInTrailer
                    );
                  }
                );
            });

            let seqno = 1;
            modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach(
              (com) => {
                com.CompartmentSeqNoInTrailer = seqno;
                ++seqno;
              }
            );

            this.setState({ modRigidTruck });
          }
        }

        this.setState({ selectedCompRow: [] });
      } catch (error) {
        console.log(
          "RigidtruckDetailsComposite:Error occured on handleDeleteCompartment",
          error
        );
      }
    }
  };
  handleRowSelectionChange = (e) => {
    this.setState({ selectedCompRow: e });
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);

    if (cellData.field === "Description") {
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex][
        cellData.field
      ] = newVal;
    }

    if (cellData.field === "Capacity") {
      if (isNaN(parseInt(newVal))) {
        newVal = "";
      }
      // else {
      //   newVal = parseInt(newVal);
      // }
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex][
        cellData.field
      ] = newVal;
    }

    if (cellData.field === "UOM") {
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
        comp.UOM = newVal;
      });
    }

    this.toggleExpand(
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments[cellData.rowIndex],
      true,
      true
    );
    this.setState({ modRigidTruck });
  };
  handleAllTerminalsChange = (checked) => {
    try {
      let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
      let terminalOptions = [...this.state.terminalOptions];
      if (checked) modRigidTruck.TerminalCodes = terminalOptions;
      else modRigidTruck.TerminalCodes = [];
      this.setState({ modRigidTruck }, () => {
        this.terminalSelectionChange(modRigidTruck.TerminalCodes);
      });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on handleAllTerminalsChange",
        error
      );
    }
  };

  convertStringtoDecimal(modRigidTruck, attributesList) {
    try {
      if (modRigidTruck.Height !== null && modRigidTruck.Height !== "") {
        modRigidTruck.Height = Utilities.convertStringtoDecimal(
          modRigidTruck.Height
        );
      }
      if (modRigidTruck.Length !== null && modRigidTruck.Length !== "") {
        modRigidTruck.Length = Utilities.convertStringtoDecimal(
          modRigidTruck.Length
        );
      }
      if (modRigidTruck.Width !== null && modRigidTruck.Width !== "") {
        modRigidTruck.Width = Utilities.convertStringtoDecimal(
          modRigidTruck.Width
        );
      }

      modRigidTruck.TareWeight = Utilities.convertStringtoDecimal(
        modRigidTruck.TareWeight
      );

      modRigidTruck.MaxLoadableWeight = parseFloat(
        Utilities.convertStringtoDecimal(modRigidTruck.MaxLoadableWeight) -
          modRigidTruck.TareWeight
      );

      modRigidTruck.VehicleTrailers[0].Trailer.TareWeight =
        modRigidTruck.TareWeight;
      modRigidTruck.VehicleTrailers[0].Trailer.MaxLoadableWeight =
        modRigidTruck.MaxLoadableWeight;

      modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
        com.Capacity = Utilities.convertStringtoDecimal(com.Capacity);
      });
      modRigidTruck = this.fillAttributeDetails(modRigidTruck, attributesList);
      return modRigidTruck;
    } catch (err) {
      console.log("convertStringtoDecimal error rigidtruckdetails", err);
    }
  }

  saveVehicle = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempVehicle = lodash.cloneDeep(this.state.tempVehicle);

    
      this.state.rigidTruck.Code === ""
        ? this.createVehicle(tempVehicle)
        : this.updateVehicle(tempVehicle);
    } catch (error) {
      console.log("RigidTruckDetailsComposite : Error in saveVehicle");
    }
  };


  handleSave = () => {
    try {
      let returnValue = Object.values(this.state.validationErrors).every(
        function (value) {
          return value === "";
        }
      );
      if (returnValue) {
     //   this.setState({ saveEnabled: false });
        let modRigidTruck = this.fillDetails();
        let attributesList = [];
        let vehicleAttributeList = Utilities.attributesConverttoLocaleString(
          this.state.modVehicleAttributeMetaDataList
        );
        let vehicleTrailerAttributeList =
          Utilities.attributesConverttoLocaleString(
            this.state.modVehicleTrailerAttributeMetaDataList
          );
        let trailerAttributeList = Utilities.attributesConverttoLocaleString(
          this.state.modTrailerAttributeMetaDataList
        );

        attributesList.push({ vehilceAttributeList: vehicleAttributeList });
        attributesList.push({
          vehicleTrailerAttributeList: vehicleTrailerAttributeList,
        });
        attributesList.push({ trailerAttributeList: trailerAttributeList });

        if (this.validateSave(modRigidTruck, attributesList)) {
          modRigidTruck = this.convertStringtoDecimal(
            modRigidTruck,
            attributesList
          );
         
          modRigidTruck = Utilities.convertDatesToString(
            DateFieldsInEntities.DatesInEntity.Vehicle,
            modRigidTruck
          );
          
          let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempVehicle = lodash.cloneDeep(modRigidTruck);
        this.setState({ showAuthenticationLayout, tempVehicle }, () => {
          if (showAuthenticationLayout === false) {
            this.saveVehicle();
          }
      });

        } else this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RigidTruck DetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillDetails() {
    try {
      let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
      modRigidTruck.ShareholderCode = this.props.selectedShareholder;
      modRigidTruck.VehicleType = Constants.VehicleType.RigidTruck;
      modRigidTruck.TransportationType = Constants.TransportationType.ROAD;
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
        comp.TrailerCode = modRigidTruck.Code;
        comp.ShareholderCode = modRigidTruck.ShareholderCode;
        comp.CarrierCompanyCode = modRigidTruck.CarrierCompanyCode;
        if (comp.Capacity !== null && comp.Capacity !== "")
          comp.Capacity = comp.Capacity.toLocaleString();
        if (comp.Code === null || comp.Code === "") {
          comp.Code = Utilities.generateCompartmentCode(
            modRigidTruck.VehicleTrailers[0].Trailer.Compartments
          ).toString();
        }
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesConverttoLocaleString(
              comp.AttributesforUI
            );
      });

      if (modRigidTruck.Height === "") modRigidTruck.Height = null;
      if (modRigidTruck.Length === "") modRigidTruck.Length = null;
      if (modRigidTruck.Width === "") modRigidTruck.Width = null;
      if (modRigidTruck.TareWeight !== null && modRigidTruck.TareWeight !== "")
        modRigidTruck.TareWeight = modRigidTruck.TareWeight.toLocaleString();
      if (
        modRigidTruck.MaxLoadableWeight !== null &&
        modRigidTruck.MaxLoadableWeight !== ""
      )
        modRigidTruck.MaxLoadableWeight =
          modRigidTruck.MaxLoadableWeight.toLocaleString();
      if (modRigidTruck.Height !== null && modRigidTruck.Height !== "")
        modRigidTruck.Height = modRigidTruck.Height.toLocaleString();
      if (modRigidTruck.Length !== null && modRigidTruck.Length !== "")
        modRigidTruck.Length = modRigidTruck.Length.toLocaleString();
      if (modRigidTruck.Width !== null && modRigidTruck.Width !== "")
        modRigidTruck.Width = modRigidTruck.Width.toLocaleString();
      var c = new Date();
      modRigidTruck.LicenseNoIssueDate = c.getUTCDate();
      //modRigidTruck.LicenseNoIssueDate.setHours(0, 0, 0, 0);
      // modRigidTruck.LicenseNoIssueDate = modRigidTruck.LicenseNoIssueDate.toISOString();
      modRigidTruck.VehicleTrailers[0].TrailerCode = modRigidTruck.Code;
      modRigidTruck.VehicleTrailers[0].VehicleCode = modRigidTruck.Code;
      modRigidTruck.VehicleTrailers[0].ShareholderCode =
        modRigidTruck.ShareholderCode;
      modRigidTruck.VehicleTrailers[0].CarrierCompanyCode =
        modRigidTruck.CarrierCompanyCode;
      modRigidTruck.VehicleTrailers[0].TrailerSeq = 1;
      modRigidTruck.VehicleTrailers[0].Trailer.Code = modRigidTruck.Code;
      modRigidTruck.VehicleTrailers[0].Trailer.Name = modRigidTruck.Name;
      modRigidTruck.VehicleTrailers[0].Trailer.ShareholderCode =
        modRigidTruck.ShareholderCode;
      modRigidTruck.VehicleTrailers[0].Trailer.TransportationType =
        Constants.TransportationType.ROAD;
      modRigidTruck.VehicleTrailers[0].Trailer.CarrierCompanyCode =
        modRigidTruck.CarrierCompanyCode;
      modRigidTruck.VehicleTrailers[0].Trailer.TrailerType =
        Constants.TrailerType.RIGID_TRAILER;
      modRigidTruck.VehicleTrailers[0].Trailer.ProductType =
        modRigidTruck.ProductType;

      modRigidTruck.VehicleTrailers[0].Trailer.WeightUOM =
        modRigidTruck.WeightUOM;
      modRigidTruck.VehicleTrailers[0].Trailer.Active = modRigidTruck.Active;
      modRigidTruck.VehicleTrailers[0].Trailer.HazardousCategory =
        modRigidTruck.HazardousCategory;
      modRigidTruck.VehicleTrailers[0].Trailer.HazardousLicenseExpiry =
        modRigidTruck.HazardousLicenseExpiry;
      modRigidTruck.VehicleTrailers[0].Trailer = Utilities.convertDatesToString(
        DateFieldsInEntities.DatesInEntity.Trailer,
        modRigidTruck.VehicleTrailers[0].Trailer
      );
      //modRigidTruck = this.fillAttributeDetails(modRigidTruck);
      return modRigidTruck;
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  fillAttributeDetails(modRigidTruck, attributesList) {
    try {
      let attributeData1 = attributesList.find(function (item) {
        return item["vehilceAttributeList"] !== undefined;
      });
      let attributeData2 = attributesList.find(function (item) {
        return item["vehicleTrailerAttributeList"] !== undefined;
      });
      let attributeData3 = attributesList.find(function (item) {
        return item["trailerAttributeList"] !== undefined;
      });

      let modVehicleAttributeMetaDataList =
        Utilities.attributesDatatypeConversion(
          attributeData1.vehilceAttributeList
        );
      modRigidTruck.Attributes = Utilities.fillAttributeDetails(
        modVehicleAttributeMetaDataList
      );
      let modVehicleTrailerAttributeMetaDataList =
        Utilities.attributesDatatypeConversion(
          attributeData2.vehicleTrailerAttributeList
        );
      modRigidTruck.VehicleTrailers[0].Attributes =
        Utilities.fillAttributeDetails(modVehicleTrailerAttributeMetaDataList);

      let modTrailerAttributeMetaDataList =
        Utilities.attributesDatatypeConversion(
          attributeData3.trailerAttributeList
        );
      modRigidTruck.VehicleTrailers[0].Trailer.Attributes =
        Utilities.fillAttributeDetails(modTrailerAttributeMetaDataList);

      // For Compartment
      modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach((comp) => {
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesDatatypeConversion(
              comp.AttributesforUI
            );
        let selectedTerminals = [];
        if (this.props.userDetails.EntityResult.IsEnterpriseNode)
          selectedTerminals = lodash.cloneDeep(modRigidTruck.TerminalCodes);
        else {
          var compAttributeMetaDataList = lodash.cloneDeep(
            this.state.attributeMetaDataList.TRAILERCOMPARTMENT
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
      return modRigidTruck;
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  validateSave(modRigidTruck, attributesList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(rigidTruckValidationDef).forEach(function (key) {
      if (modRigidTruck[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          rigidTruckValidationDef[key],
          modRigidTruck[key]
        );
    });

    // if (
    //   validationErrors.MaxLoadableWeight === "" &&
    //   validationErrors.TareWeight === "" &&
    //   Utilities.convertStringtoDecimal(modRigidTruck.MaxLoadableWeight) -
    //     Utilities.convertStringtoDecimal(modRigidTruck.TareWeight) <
    //     0
    // )
    //   validationErrors.MaxLoadableWeight =
    //     "Trailerinfo_MaxAllowableGreater_thanTare";

    if (modRigidTruck.Active !== this.state.rigidTruck.Active) {
      if (modRigidTruck.Remarks === "") {
        validationErrors["Remarks"] = "Vehicle_RemarksRequired";
      }
    }

    if (this.state.isBonded && modRigidTruck.IsBonded) {
      if (
        modRigidTruck.VehicleCustomsBondNo === "" ||
        modRigidTruck.VehicleCustomsBondNo === null
      ) {
        validationErrors["VehicleCustomsBondNo"] =
          "VehicleInfo_VehicleCustomsBondNoError";
      }
      if (
        modRigidTruck.BondExpiryDate === "" ||
        modRigidTruck.BondExpiryDate === null
      ) {
        validationErrors["BondExpiryDate"] = "VehicleInfo_BondExpiryDateError";
      }
      if (
        modRigidTruck.IsBonded !== this.state.rigidTruck.IsBonded &&
        this.state.rigidTruck.Code !== ""
      ) {
        if (modRigidTruck.Remarks === "") {
          validationErrors["Remarks"] = "Vehicle_RemarksRequired";
        }
      }
    }

    if (
      (modRigidTruck.RoadTaxNo !== null && modRigidTruck.RoadTaxNo !== "") ||
      !isNaN(Date.parse(modRigidTruck.RoadTaxNoIssueDate)) ||
      !isNaN(Date.parse(modRigidTruck.RoadTaxNoExpiryDate))
    ) {
      if (modRigidTruck.RoadTaxNo === null || modRigidTruck.RoadTaxNo === "") {
        validationErrors["RoadTaxNo"] = "Vehicle_RoadTaxNoRequired";
      }

      if (isNaN(Date.parse(modRigidTruck.RoadTaxNoIssueDate))) {
        validationErrors["RoadTaxNoIssueDate"] = "Vehicle_RoadTaxIssRequired";
      }
      if (isNaN(Date.parse(modRigidTruck.RoadTaxNoExpiryDate))) {
        validationErrors["RoadTaxNoExpiryDate"] = "Vehicle_RoadTaxExpRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [],
    };

    if (
      (modRigidTruck.Height !== null ||
        modRigidTruck.Width != null ||
        modRigidTruck.Length !== null) &&
      modRigidTruck.LWHUOM === null
    ) {
      validationErrors.LWHUOM = "PrimeMover_UOMRequired";
    }

    var vehicleAttributeValidationErrors = lodash.cloneDeep(
      this.state.vehicleAttributeValidationErrors
    );
    let attributeData1 = attributesList.find(function (item) {
      return item["vehilceAttributeList"] !== undefined;
    });

    attributeData1.vehilceAttributeList.forEach((attribute) => {
      vehicleAttributeValidationErrors.forEach((attributeValidation) => {
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
    var vehicleTrailerAttributeValidationErrors = lodash.cloneDeep(
      this.state.vehicleTrailerAttributeValidationErrors
    );
    let attributeData2 = attributesList.find(function (item) {
      return item["vehicleTrailerAttributeList"] !== undefined;
    });

    attributeData2.vehicleTrailerAttributeList.forEach((attribute) => {
      vehicleTrailerAttributeValidationErrors.forEach((attributeValidation) => {
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

    var trailerAttributeValidationErrors = lodash.cloneDeep(
      this.state.trailerAttributeValidationErrors
    );
    let attributeData3 = attributesList.find(function (item) {
      return item["trailerAttributeList"] !== undefined;
    });

    attributeData3.trailerAttributeList.forEach((attribute) => {
      trailerAttributeValidationErrors.forEach((attributeValidation) => {
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

    // if (modRigidTruck.VehicleTrailers[0].Trailer.Compartments.length > 0) {
    //   modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
    //     trailerCompartmentValidationDef.forEach((col) => {
    //       let err = "";

    //       if (col.validator !== undefined) {
    //         err = Utilities.validateField(col.validator, com[col.field]);
    //       }

    //       // if (col.field === "Capacity" && err === "") {
    //       //   let capacity = Utilities.convertStringtoDecimal(
    //       //     com.Capacity
    //       //   ).toString();
    //       //   if (capacity.length > 0) err = "Common_MaxLengthExceeded";
    //       // }
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
    //     keyFields: ["Vehicle_Code"],
    //     keyValues: [modRigidTruck.Code],
    //     isSuccess: false,
    //     errorMessage: "TrailerInfo_CompartmentRequired",
    //   });
    // }

    this.setState({
      validationErrors,
      vehicleAttributeValidationErrors,
      vehicleTrailerAttributeValidationErrors,
      trailerAttributeValidationErrors,
    });

    var returnValue = true;
    vehicleAttributeValidationErrors.forEach((x) => {
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
      vehicleTrailerAttributeValidationErrors.forEach((x) => {
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

    if (modRigidTruck.VehicleTrailers[0].Trailer.Compartments.length > 0) {
      if (modRigidTruck.VehicleTrailers[0].Trailer.Compartments.length <= this.state.maxNumberOfCompartments) {
         modRigidTruck.VehicleTrailers[0].Trailer.Compartments.forEach((com) => {
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
        keyFields: ["Vehicle_Code"],
        keyValues: [modRigidTruck.Code],
        isSuccess: false,
        errorMessage: "Compartment_limit_Exceeded",
      });
      }
     
    } else {
      notification.messageResultDetails.push({
        keyFields: ["Vehicle_Code"],
        keyValues: [modRigidTruck.Code],
        isSuccess: false,
        errorMessage: "TrailerInfo_CompartmentRequired",
      });
    }

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modRigidTruck, "update", notification);
      return false;
    }
    return returnValue;
  }

  createVehicle(modRigidTruck) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modRigidTruck.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modRigidTruck,
    };

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vehicle_Code"],
          keyValues: [modRigidTruck.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateVehicle,
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
          this.setState({
            // rigidTruck: lodash.cloneDeep(modRigidTruck),
            // modRigidTruck: lodash.cloneDeep(modRigidTruck),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          this.getRigidTruck(false);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateVehicle:", result.ErrorList);
        }

        this.props.onSaved(this.state.modRigidTruck, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnVehicle
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modRigidTruck, "add", notification);
      });
  }
  updateVehicle(modRigidTruck) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modRigidTruck.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modRigidTruck,
    };

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vehicle_Code"],
          keyValues: [modRigidTruck.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateVehicle,
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
          this.setState({
            // rigidTruck: lodash.cloneDeep(modRigidTruck),
            // modRigidTruck: lodash.cloneDeep(modRigidTruck),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          this.getRigidTruck(false);
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateVehicle:", result.ErrorList);
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
            fnVehicle
          ),
          showAuthenticationLayout: false,
        });
      });
  }
  handleDateTextChange = (propertyName, value, error) => {
    try {
      let validationErrors = { ...this.state.validationErrors };
      let modRigidTruck = lodash.cloneDeep(this.state.modRigidTruck);
      validationErrors[propertyName] = error;
      modRigidTruck[propertyName] = value;
      this.setState({ validationErrors, modRigidTruck });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };
  handleVehicleAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modVehicleAttributeMetaDataList = lodash.cloneDeep(
        this.state.modVehicleAttributeMetaDataList
      );
      let matchedAttributesList = modVehicleAttributeMetaDataList.filter(
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

      const vehicleAttributeValidationErrors = lodash.cloneDeep(
        this.state.vehicleAttributeValidationErrors
      );

      vehicleAttributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({
        vehicleAttributeValidationErrors,
        modVehicleAttributeMetaDataList,
      });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on handleVehicleAttributeDataChange",
        error
      );
    }
  };
  handleVehicleTrailerAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modVehicleTrailerAttributeMetaDataList = lodash.cloneDeep(
        this.state.modVehicleTrailerAttributeMetaDataList
      );
      let matchedAttributesList = modVehicleTrailerAttributeMetaDataList.filter(
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

      const vehicleTrailerAttributeValidationErrors = lodash.cloneDeep(
        this.state.vehicleTrailerAttributeValidationErrors
      );

      vehicleTrailerAttributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({
        vehicleTrailerAttributeValidationErrors,
        modVehicleTrailerAttributeMetaDataList,
      });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on handleVehicleTrailerAttributeDataChange",
        error
      );
    }
  };

  handleTrailerAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modTrailerAttributeMetaDataList = lodash.cloneDeep(
        this.state.modTrailerAttributeMetaDataList
      );
      let matchedAttributesList = modTrailerAttributeMetaDataList.filter(
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

      const trailerAttributeValidationErrors = lodash.cloneDeep(
        this.state.trailerAttributeValidationErrors
      );

      trailerAttributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({
        trailerAttributeValidationErrors,
        modTrailerAttributeMetaDataList,
      });
    } catch (error) {
      console.log(
        "RigidTruckDetailsComposite:Error occured on handleTrailerAttributeDataChange",
        error
      );
    }
  };
  getKPIList(shareholder, vehicleCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiVehicleDetail,
        InputParameters: [
          { key: "ShareholderCode", value: shareholder },
          {
            key: "VehicleCode",
            value: vehicleCode,
          },
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
              vehicleKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ vehicleKPIList: [] });
            console.log("Error in vehicle KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Vehicle KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      carriers: this.state.carrierOptions,
      productType: this.state.productTypeOptions,
      loadingType: this.state.loadingTypeOptions,
      unitOfWeight: this.state.weightUOMOptions,
      unitOfVolume: this.state.volumeUOMOptions,
      unitOfDimension: this.state.lengthUOMOptions,
      terminalCodes: this.state.terminalOptions,
      hazardousTankerCategoryOptions: this.state.hazardousTankerCategoryOptions,
    };

    const popUpContents = [
      {
        fieldName: "Vehicle_LastUpdated",
        fieldValue:
          new Date(
            this.state.modRigidTruck.LastUpdateTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modRigidTruck.LastUpdateTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "Vehicle_LastActiveTime",
        fieldValue:
          this.state.modRigidTruck.LastActiveTime !== undefined &&
          this.state.modRigidTruck.LastActiveTime !== null
            ? new Date(
                this.state.modRigidTruck.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modRigidTruck.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "Vehicle_CreateTime",
        fieldValue:
          new Date(this.state.modRigidTruck.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modRigidTruck.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.rigidTruck.Code}
            newEntityName="RigidTruck_title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.vehicleKPIList}>
          {" "}
        </TMDetailsKPILayout>
        <ErrorBoundary>
          <RigidTruckDetails
            rigidTruck={this.state.rigidTruck}
            modRigidTruck={this.state.modRigidTruck}
            validationErrors={this.state.validationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onDateTextChange={this.handleDateTextChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            selectedCompRow={this.state.selectedCompRow}
            handleRowSelectionChange={this.handleRowSelectionChange}
            handleCellDataEdit={this.handleCellDataEdit}
            handleAddCompartment={this.handleAddCompartment}
            handleDeleteCompartment={this.handleDeleteCompartment}
            onCarrierChange={this.handleCarrierChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            vehicleAttributeValidationErrors={
              this.state.vehicleAttributeValidationErrors
            }
            modVehicleAttributeMetaDataList={
              this.state.modVehicleAttributeMetaDataList
            }
            onVehicleAttributeDataChange={this.handleVehicleAttributeDataChange}
            vehicleTrailerAttributeValidationErrors={
              this.state.vehicleTrailerAttributeValidationErrors
            }
            modVehicleTrailerAttributeMetaDataList={
              this.state.modVehicleTrailerAttributeMetaDataList
            }
            onVehicleTrailerAttributeDataChange={
              this.handleVehicleTrailerAttributeDataChange
            }
            trailerAttributeValidationErrors={
              this.state.trailerAttributeValidationErrors
            }
            modTrailerAttributeMetaDataList={
              this.state.modTrailerAttributeMetaDataList
            }
            onTrailerAttributeDataChange={this.handleTrailerAttributeDataChange}
            expandedRows={this.state.expandedRows}
            compartmentDetailsPageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            toggleExpand={this.toggleExpand}
            handleCompAttributeCellDataEdit={
              this.handleCompAttributeCellDataEdit
            }
            isBonded={this.state.isBonded}
            hazardousEnabled={this.state.hazardousEnabled}
          ></RigidTruckDetails>
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
              this.state.rigidTruck.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnVehicle}
            handleOperation={this.saveVehicle}
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

export default connect(mapStateToProps)(RigidTruckDetailsComposite);
