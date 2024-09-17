import React, { Component } from "react";
import VehicleComposite from "../Entity/VehicleComposite";
import TrailerComposite from "../Entity/TrailerComposite";
import { Accordion, Icon, Popup, Card, Button, Loader } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import { emptyVehicle } from "../../../JS/DefaultEntities";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import lodash from "lodash";
import { connect } from "react-redux";
import axios from "axios";
import ErrorBoundary from "../../ErrorBoundary";
import { vehicleValidationDef } from "../../../JS/ValidationDef";
import { functionGroups, fnVehicle } from "../../../JS/FunctionGroups";
import VehicleBasicFields from "../../UIBase/Details/VehicleBasicFields";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TranslationConsumer } from "@scuf/localization";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import {
  vehicleAttributeEntity,
  vehicleTrailerAttributeEntity,
} from "../../../JS/AttributeEntity";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import UserAuthenticationLayout from "../Common/UserAuthentication";

let rigidTruckColumns = null;
let trailerColumns = null;
let rigidtruckWithTrailer = true;

let vehicleWithTrailer = true;
let vehicleTrailers = [];
class RigidTruckWithTrailerDetailsComposite extends Component {
  state = {
    isReadyToRender: false,
    vehicle: {},
    modVehicle: {},
    validationErrors:
      Utilities.getInitialValidationErrors(vehicleValidationDef),
    carrierOptions: [],
    terminalOptions: [],
    volumeUOMOptions: [],
    weightUOMOptions: [],
    lengthUOMOptions: [],
    productTypeOptions: [],
    step1Active:
      this.props.selectedRow.Common_Code === undefined ? true : false,
    step2Active: false,
    step3Active:
      this.props.selectedRow.Common_Code === undefined ? false : true,
    //step1Data: [],
    // step2Data: [],
    rigidTruckSelection: [],
    trailerSelection: [],
    attributeMetaDataList: [],
    modVehicleAttributeMetaDataList: [],
    vehicleAttributeValidationErrors: [],
    modVehicleTrailerAttributeMetaDataList: [],
    vehicleTrailerAttributeValidationErrors: [],
    isBonded: false,
    isRigidLoaded: false,
    isTrailerLoaded: false,
     maxNumberOfCompartments: 12,
     showAuthenticationLayout: false,
     tempVehicle: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      let isNewVehicle = false;
      if (this.props.selectedRow.Common_Code === undefined) isNewVehicle = true;
      this.getAttributes(isNewVehicle);
      this.getCarrierList(this.props.selectedShareholder);
      this.getUOMList();
      this.IsBonded();
      this.getProductTypes();
    } catch (error) {
      console.log(
        "TractorWithTrailerDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
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
          console.log("Error in GetCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }
  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.vehicle.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getVehicle(true);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "TractorWithTrailerDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  displayValues(cellData, columnDetail) {
    const { value, field } = cellData;
    if (typeof value === "boolean" || field === "Active") {
      if (value) return <Icon name="check" size="small" color="green" />;
      else return <Icon name="close" size="small" color="red" />;
    } else if (value === "" || value === null || value === undefined) {
      return value;
    } else if (field === "TerminalCodes" && value !== null) {
      return this.terminalPopOver(value);
    }
    // var columnType = columnDetails.find(function (detail) {
    //   if (detail.Name === field) {
    //     return detail;
    //   }
    // });
    else if (
      columnDetail !== undefined &&
      columnDetail !== null &&
      columnDetail.DataType !== undefined &&
      columnDetail.DataType === "DateTime"
    ) {
      return (
        new Date(value).toLocaleDateString() +
        " " +
        new Date(value).toLocaleTimeString()
      );
    } else if (
      columnDetail !== undefined &&
      columnDetail !== null &&
      columnDetail.DataType !== undefined &&
      columnDetail.DataType === "Date"
    ) {
      return new Date(value).toLocaleDateString();
    } else return value;
  }
  terminalPopOver(terminalCodes) {
    if (terminalCodes.split(",").length > 2) {
      return (
        <Popup
          className="popup-theme-wrap"
          on="hover"
          element={<span>{terminalCodes.split(",").length}</span>}
        >
          <Card>
            <Card.Content>{terminalCodes}</Card.Content>
          </Card>
        </Popup>
      );
    } else {
      return <span>{terminalCodes}</span>;
    }
  }

  getAttributes(isNewTruck) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [vehicleAttributeEntity, vehicleTrailerAttributeEntity],
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
            },
            () => this.getVehicle(isNewTruck)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  getVehicle(isNewVehicle) {
    if (isNewVehicle) {
      let terminalOptions = [];
      vehicleTrailers = [];
      emptyVehicle.VehicleType = Constants.VehicleType.RigidTruckWithTrailer;

      this.setState(
        {
          vehicle: lodash.cloneDeep(emptyVehicle),
          modVehicle: lodash.cloneDeep(emptyVehicle),
          trailerSelection: [],
          rigidTruckSelection: [],
          isReadyToRender: true,
          terminalOptions,
          modVehicleAttributeMetaDataList: [],
          modVehicleTrailerAttributeMetaDataList: [],
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
            ? this.state.modVehicle.Code
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

        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            result.EntityResult.MaxLoadableWeight =
              result.EntityResult.MaxLoadableWeight +
              result.EntityResult.TareWeight;
            vehicleTrailers = result.EntityResult.VehicleTrailers;
          }
          this.setState(
            {
              isReadyToRender: true,
              vehicle: lodash.cloneDeep(result.EntityResult),
              modVehicle: lodash.cloneDeep(result.EntityResult),
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
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          emptyVehicle.ShareholderCode = this.props.selectedShareholder;

          this.setState({
            modVehicle: lodash.cloneDeep(emptyVehicle),
            vehicle: lodash.cloneDeep(emptyVehicle),
            isReadyToRender: true,
          });
          console.log("Error in GetVehicle:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Vehicle:", error);
      });
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
        var modVehicle = lodash.cloneDeep(this.state.modVehicle);

        selectedTerminals.forEach((terminal) => {
          var existitem = modVehicleAttributeMetaDataList.find(
            (selectedAttribute) => {
              return selectedAttribute.TerminalCode === terminal;
            }
          );

          if (existitem === undefined) {
            attributeMetaDataList.vehicle.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modVehicle.Attributes.find(
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
        this.setState({
          modVehicleAttributeMetaDataList,
          vehicleAttributeValidationErrors,
        });
        this.setVehicleTrailerAttributes(selectedTerminals);
      }
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on terminalSelectionChange",
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
      var modVehicle = lodash.cloneDeep(this.state.modVehicle);

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
              if (
                (modVehicle.VehicleTrailers !== null) &
                (modVehicle.VehicleTrailers.length > 0)
              ) {
                var Attributevalue =
                  modVehicle.VehicleTrailers[0].Attributes.find(
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
      modVehicleTrailerAttributeMetaDataList = Utilities.attributesConvertoDecimal(
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
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on setVehicleTrailerAttributes",
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
        Array.isArray(attributeMetaDataList.vehicle) &&
        attributeMetaDataList.vehicle.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.vehicle[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on localNodeAttribute",
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
        vehicleAttributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.vehicle
          ),
        vehicleTrailerAttributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(
            attributeMetaDataList.vehicletrailer
          ),
      });
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on handleReset",
        error
      );
    }
  }

  getTerminalsForCarrier(carrier) {
    if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
      const modVehicle = lodash.cloneDeep(this.state.modVehicle);
      modVehicle.CarrierCompanyCode = carrier;
      const terminalOptions = [];
      //modVehicle.TerminalCodes = [];
      this.setState({ terminalOptions, modVehicle });
    } else {
      const modVehicle = lodash.cloneDeep(this.state.modVehicle);
      let terminalOptions = [...this.state.terminalOptions];

      modVehicle.CarrierCompanyCode = carrier;

      try {
        if (carrier === undefined) {
          terminalOptions = [];
          modVehicle.TerminalCodes = [];
          this.setState({ terminalOptions, modVehicle });
          this.terminalSelectionChange([]);
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
            let vehicle = { ...this.state.vehicle };
            if (
              vehicle.Code === undefined ||
              vehicle.Code === "" ||
              vehicle.Code === null
            ) {
              if (terminalOptions.length === 1) {
                modVehicle.TerminalCodes = [...terminalOptions];
                this.terminalSelectionChange(modVehicle.TerminalCodes);
              } else {
                modVehicle.TerminalCodes = [];
                this.terminalSelectionChange([]);
              }
            }

            if (Array.isArray(modVehicle.TerminalCodes)) {
              modVehicle.TerminalCodes = terminalOptions.filter((x) =>
                modVehicle.TerminalCodes.includes(x)
              );
            }

            this.setState({ modVehicle });
          })
          .catch((error) => {
            terminalOptions = [];
            modVehicle.TerminalCodes = [];
            this.setState({ terminalOptions, modVehicle });
            console.log("Error while getting Carrier:", error, carrier);
            //throw error;
          });
      } catch (error) {
        terminalOptions = [];
        modVehicle.TerminalCodes = [];
        this.setState({ terminalOptions, modVehicle });
        console.log(
          "TractowWithTrailerDetailsComposite:Error occured on handleCarrierChange",
          error
        );
      }
    }
  }

  handleReset = () => {
    try {
      this.setState(
        {
          modVehicle: lodash.cloneDeep(this.state.vehicle),
          modVehicleAttributeMetaDataList: [],
          modVehicleTrailerAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(this.state.modVehicle.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.vehicle.Code === "") {
        //let terminalOptions = { ...this.state.terminalOptions };
        let terminalOptions = [];
        this.setState({ terminalOptions });
      }
      vehicleTrailers = lodash.clone(this.state.vehicle.VehicleTrailers);
      let validationErrors = { ...this.state.validationErrors };
      Object.keys(validationErrors).forEach((key) => {
        validationErrors[key] = "";
      });
      this.setState({ validationErrors });
    } catch (error) {
      console.log(
        "TractorWithTrailerDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleCarrierChange = (carrier) => {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode)
      this.getTerminalsForCarrier(carrier);
    else {
      const modVehicle = lodash.cloneDeep(this.state.modVehicle);
      modVehicle.CarrierCompanyCode = carrier;
      const terminalOptions = [];
      modVehicle.TerminalCodes = [];
      this.setState({ terminalOptions, modVehicle });
    }
    if (vehicleValidationDef["CarrierCompanyCode"] !== undefined) {
      const validationErrors = { ...this.state.validationErrors };
      validationErrors["CarrierCompanyCode"] = Utilities.validateField(
        vehicleValidationDef["CarrierCompanyCode"],
        carrier
      );

      this.setState({ validationErrors });
    }
    //this.getTerminalsForCarrier(carrier);
  };

  handleActiveStatusChange = (value) => {
    try {
      let modVehicle = lodash.cloneDeep(this.state.modVehicle);
      modVehicle.Active = value;
      if (modVehicle.Active !== this.state.vehicle.Active)
        modVehicle.Remarks = "";
      this.setState({ modVehicle });
    } catch (error) {
      console.log(
        "TractorWithTrailerDetailsComposite:Error occured in handleActiveStatusChange",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    let modVehicle = lodash.cloneDeep(this.state.modVehicle);
    try {
      modVehicle[propertyName] = data;

      const validationErrors = { ...this.state.validationErrors };
      if (modVehicle.Active === this.state.vehicle.Active) {
        if (
          this.state.vehicle.Remarks === modVehicle.Remarks ||
          modVehicle.Remarks === ""
        ) {
          if (
            this.state.vehicle.IsBonded === modVehicle.IsBonded &&
            this.state.isBonded
          )
            validationErrors.Remarks = "";
        }
        if (modVehicle.Remarks === "")
          modVehicle.Remarks = this.state.vehicle.Remarks;
      }
      // if (propertyName === "Active") {
      //   if (modVehicle.Active !== this.state.vehicle.Active) {
      //     modVehicle.Remarks = "";
      //   }
      // }
      if (propertyName === "IsBonded") {
        modVehicle.VehicleCustomsBondNo = null;
        modVehicle.BondExpiryDate = null;
        validationErrors.VehicleCustomsBondNo = "";
        validationErrors.BondExpiryDate = "";
      }

      if (
        propertyName === "RoadTaxNo" ||
        propertyName === "RoadTaxNoIssueDate" ||
        propertyName === "RoadTaxNoExpiryDate"
      ) {
        //validationErrors[propertyName] = "";
        validationErrors.RoadTaxNo = "";
        validationErrors.RoadTaxNoExpiryDate = "";
        validationErrors.RoadTaxNoIssueDate = "";
      }
      if (
        propertyName === "Height" ||
        propertyName === "Length" ||
        propertyName === "Width" ||
        propertyName === "LWHUOM"
      ) {
        validationErrors.LWHUOM = "";
      }
      if (vehicleValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          vehicleValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modVehicle });

      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "TractorWithTrailerDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      let modVehicle = lodash.cloneDeep(this.state.modVehicle);
      let terminalOptions = [...this.state.terminalOptions];
      if (checked) modVehicle.TerminalCodes = terminalOptions;
      else modVehicle.TerminalCodes = [];
      this.setState({ modVehicle });
      this.terminalSelectionChange(modVehicle.TerminalCodes);
    } catch (error) {
      console.log(
        "TractorWithTrailerDetailsComposite:Error occured on handleAllTerminalsChange",
        error
      );
    }
  };
  validateSave(modVehicle, attributesList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(vehicleValidationDef).forEach(function (key) {
      if (modVehicle[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          vehicleValidationDef[key],
          modVehicle[key]
        );
    });

    if (modVehicle.Active !== this.state.vehicle.Active) {
      if (modVehicle.Remarks === "") {
        validationErrors["Remarks"] = "Vehicle_RemarksRequired";
      }
    }

    if (this.state.isBonded && modVehicle.IsBonded) {
      if (
        modVehicle.VehicleCustomsBondNo === "" ||
        modVehicle.VehicleCustomsBondNo === null
      ) {
        validationErrors["VehicleCustomsBondNo"] =
          "VehicleInfo_VehicleCustomsBondNoError";
      }
      if (
        modVehicle.BondExpiryDate === "" ||
        modVehicle.BondExpiryDate === null
      ) {
        validationErrors["BondExpiryDate"] = "VehicleInfo_BondExpiryDateError";
      }

      if (
        modVehicle.IsBonded !== this.state.vehicle.IsBonded &&
        this.state.vehicle.Code !== ""
      ) {
        if (modVehicle.Remarks === "") {
          validationErrors["Remarks"] = "Vehicle_RemarksRequired";
        }
      }
    }

    if (
      (modVehicle.RoadTaxNo !== null && modVehicle.RoadTaxNo !== "") ||
      !isNaN(Date.parse(modVehicle.RoadTaxNoIssueDate)) ||
      !isNaN(Date.parse(modVehicle.RoadTaxNoExpiryDate))
    ) {
      if (modVehicle.RoadTaxNo === null || modVehicle.RoadTaxNo === "") {
        validationErrors["RoadTaxNo"] = "Vehicle_RoadTaxNoRequired";
      }

      if (isNaN(Date.parse(modVehicle.RoadTaxNoIssueDate))) {
        validationErrors["RoadTaxNoIssueDate"] = "Vehicle_RoadTaxIssRequired";
      }
      if (isNaN(Date.parse(modVehicle.RoadTaxNoExpiryDate))) {
        validationErrors["RoadTaxNoExpiryDate"] = "Vehicle_RoadTaxExpRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [],
    };
    if (
      (modVehicle.Height !== null ||
        modVehicle.Width != null ||
        modVehicle.Length !== null) &&
      modVehicle.LWHUOM === null
    ) {
      validationErrors.LWHUOM = "PrimeMover_UOMRequired";
    }
    let compartmentCount = 0;
    if (this.state.rigidTruckSelection.length <= 0) {
      notification.messageResultDetails.push({
        keyFields: ["Vehicle_Code"],
        keyValues: [modVehicle.Code],
        isSuccess: false,
        errorMessage: "Vehicle_RigTrRequired",
      });
    }
    else {
      compartmentCount = this.state.rigidTruckSelection[0].CompCount;
    }
    if (this.state.trailerSelection.length <= 0) {
      notification.messageResultDetails.push({
        keyFields: ["Vehicle_Code"],
        keyValues: [modVehicle.Code],
        isSuccess: false,
        errorMessage: "Vehicle_TrailerRequired",
      });
    }
    else {
      this.state.trailerSelection.map((item) => {
        compartmentCount = compartmentCount + item.CompCount;
      })
    }
    if (this.state.maxNumberOfCompartments < compartmentCount) {
       notification.messageResultDetails.push({
        keyFields: ["Vehicle_Code"],
        keyValues: [modVehicle.Code],
        isSuccess: false,
        errorMessage: "Compartment_limit_Exceeded",
      });
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

    this.setState({
      validationErrors,
      vehicleAttributeValidationErrors,
      vehicleTrailerAttributeValidationErrors,
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

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modVehicle, "update", notification);
      return false;
    }
    return returnValue;
  }
  convertStringtoDecimal(modVehicle, attributesList) {
    try {
      if (modVehicle.Height !== null && modVehicle.Height !== "") {
        modVehicle.Height = Utilities.convertStringtoDecimal(modVehicle.Height);
      }
      if (modVehicle.Length !== null && modVehicle.Length !== "") {
        modVehicle.Length = Utilities.convertStringtoDecimal(modVehicle.Length);
      }
      if (modVehicle.Width !== null && modVehicle.Width !== "") {
        modVehicle.Width = Utilities.convertStringtoDecimal(modVehicle.Width);
      }
      modVehicle = this.fillAttributeDetails(modVehicle, attributesList);
      return modVehicle;
    } catch (err) {
      console.log(
        "convertStringtoDecimal error rigidtruckwithtrailer details",
        err
      );
    }
  }

  saveVehicle = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempVehicle = lodash.cloneDeep(this.state.tempVehicle);

    
      this.state.vehicle.Code === ""
        ? this.createVehicle(tempVehicle)
        : this.updateVehicle(tempVehicle);
    } catch (error) {
      console.log("RigidTruckWithTrailerComposite : Error in save Rigid truck with trailer");
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
        let modVehicle = this.fillDetails();
        let attributesList = [];
        let vehicleAttributeList = Utilities.attributesConverttoLocaleString(
          this.state.modVehicleAttributeMetaDataList
        );
        let vehicleTrailerAttributeList =
          Utilities.attributesConverttoLocaleString(
            this.state.modVehicleTrailerAttributeMetaDataList
          );
        attributesList.push({ vehilceAttributeList: vehicleAttributeList });
        attributesList.push({
          vehicleTrailerAttributeList: vehicleTrailerAttributeList,
        });
     //   this.setState({ saveEnabled: false });

        if (this.validateSave(modVehicle, attributesList)) {
          modVehicle = this.convertStringtoDecimal(modVehicle, attributesList);

          modVehicle = Utilities.convertDatesToString(
            DateFieldsInEntities.DatesInEntity.Vehicle,
            modVehicle
          );
          modVehicle.VehiclePrimeMovers.forEach(
            (vp) =>
            (vp.Primemover = Utilities.convertDatesToString(
              DateFieldsInEntities.DatesInEntity.PrimeMover,
              vp.Primemover
            ))
          );
         
          let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempVehicle = lodash.cloneDeep(modVehicle);
        this.setState({ showAuthenticationLayout, tempVehicle }, () => {
          if (showAuthenticationLayout === false) {
            this.saveVehicle();
          }
      });

         
        } else this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "Tractor With Trailer DetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  createVehicle(modVehicle) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modVehicle.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modVehicle,
    };

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vehicle_Code"],
          keyValues: [modVehicle.Code],
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
            // vehicle: lodash.cloneDeep(modVehicle),
            // modVehicle: lodash.cloneDeep(modVehicle),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          this.getVehicle(false);
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

        this.props.onSaved(this.state.modVehicle, "add", notification);
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
        this.props.onSaved(this.state.modVehicle, "add", notification);
      });
  }

  updateVehicle(modVehicle) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modVehicle.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modVehicle,
    };

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vehicle_Code"],
          keyValues: [modVehicle.Code],
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
            // vehicle: lodash.cloneDeep(modVehicle),
            // modVehicle: lodash.cloneDeep(modVehicle),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          this.getVehicle(false);
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
        this.props.onSaved(this.state.modVehicle, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modVehicle, "modify", notification);
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

  fillDetails() {
    try {
      let modVehicle = lodash.cloneDeep(this.state.modVehicle);
      modVehicle.ShareholderCode = this.props.selectedShareholder;

      modVehicle.VehicleType = Constants.VehicleType.RigidTruckWithTrailer;

      if (modVehicle.Height === "") modVehicle.Height = null;
      if (modVehicle.Length === "") modVehicle.Length = null;
      if (modVehicle.Width === "") modVehicle.Width = null;
      if (modVehicle.Height !== null && modVehicle.Height !== "")
        modVehicle.Height = modVehicle.Height.toLocaleString();
      if (modVehicle.Length !== null && modVehicle.Length !== "")
        modVehicle.Length = modVehicle.Length.toLocaleString();
      if (modVehicle.Width !== null && modVehicle.Width !== "")
        modVehicle.Width = modVehicle.Width.toLocaleString();

      modVehicle.TransportationType = Constants.TransportationType.ROAD;
      var licDate = new Date();
      modVehicle.LicenseNoIssueDate = licDate.getUTCDate();
      //modVehicle.LicenseNoIssueDate.setHours(0, 0, 0, 0);
      // modVehicle.VehiclePrimeMovers[0].VehicleCode = modVehicle.Code;
      // modVehicle.VehiclePrimeMovers[0].PrimeMoverCode = this.state.tractorSelection.Common_Code;
      // modVehicle.VehiclePrimeMovers[0].ShareholderCode =
      //   modVehicle.ShareholderCode;
      // modVehicle.VehiclePrimeMovers[0].CarrierCompanyCode =
      //   modVehicle.CarrierCompanyCode;
      // modVehicle.VehiclePrimeMovers[0].PrimeMoverSequence = 1;
      modVehicle.VehicleTrailers = [];
      let trailerSeq = 0;
      if (this.state.rigidTruckSelection.length > 0) {
        this.state.rigidTruckSelection.forEach((rigidTruck) => {
          let vehicleTrailerInfo = {
            TrailerCode: null,
            VehicleCode: null,
            ShareholderCode: null,
            CarrierCompanyCode: null,
            TrailerSeq: null,
            Trailer: {},
          };
          vehicleTrailerInfo.TrailerCode = rigidTruck.Common_Code;

          vehicleTrailerInfo.VehicleCode = modVehicle.Code;
          vehicleTrailerInfo.ShareholderCode = modVehicle.ShareholderCode;
          vehicleTrailerInfo.CarrierCompanyCode = modVehicle.CarrierCompanyCode;
          vehicleTrailerInfo.TrailerSeq = ++trailerSeq;
          vehicleTrailerInfo.Trailer.Code = rigidTruck.Common_Code;
          vehicleTrailerInfo.Trailer.Name = rigidTruck.Common_Name;
          vehicleTrailerInfo.Trailer.ShareholderCode =
            modVehicle.ShareholderCode;
          vehicleTrailerInfo.Trailer.TransportationType =
            Constants.TransportationType.ROAD;
          vehicleTrailerInfo.Trailer.CarrierCompanyCode =
            modVehicle.CarrierCompanyCode;
          vehicleTrailerInfo.Trailer.TrailerType =
            Constants.TrailerType.RIGID_TRAILER;

          modVehicle.VehicleTrailers.push(vehicleTrailerInfo);
        });
      }

      if (this.state.trailerSelection.length > 0) {
        this.state.trailerSelection.forEach((trailer) => {
          let vehicleTrailerInfo = {
            TrailerCode: null,
            VehicleCode: null,
            ShareholderCode: null,
            CarrierCompanyCode: null,
            TrailerSeq: null,
            Trailer: {},
          };
          vehicleTrailerInfo.TrailerCode = trailer.Common_Code;

          vehicleTrailerInfo.VehicleCode = modVehicle.Code;
          vehicleTrailerInfo.ShareholderCode = modVehicle.ShareholderCode;
          vehicleTrailerInfo.CarrierCompanyCode = modVehicle.CarrierCompanyCode;
          vehicleTrailerInfo.TrailerSeq = ++trailerSeq;
          vehicleTrailerInfo.Trailer.Code = trailer.Common_Code;
          vehicleTrailerInfo.Trailer.Name = trailer.Common_Name;
          vehicleTrailerInfo.Trailer.ShareholderCode =
            modVehicle.ShareholderCode;
          vehicleTrailerInfo.Trailer.TransportationType =
            Constants.TransportationType.ROAD;
          vehicleTrailerInfo.Trailer.CarrierCompanyCode =
            modVehicle.CarrierCompanyCode;
          vehicleTrailerInfo.Trailer.TrailerType =
            Constants.TrailerType.NON_RIGID_TRAILER;

          modVehicle.VehicleTrailers.push(vehicleTrailerInfo);
        });
      }
      return modVehicle;
    } catch (error) {
      console.log(
        "TractorWithTrailerDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  fillAttributeDetails(modVehicle, attributesList) {
    try {
      let attributeData1 = attributesList.find(function (item) {
        return item["vehilceAttributeList"] !== undefined;
      });
      let attributeData2 = attributesList.find(function (item) {
        return item["vehicleTrailerAttributeList"] !== undefined;
      });
      let modVehicleAttributeMetaDataList = Utilities.attributesDatatypeConversion(attributeData1.vehilceAttributeList);
      modVehicle.Attributes = Utilities.fillAttributeDetails(modVehicleAttributeMetaDataList);

      let modVehicleTrailerAttributeMetaDataList =
        Utilities.attributesDatatypeConversion(
          attributeData2.vehicleTrailerAttributeList
        );

      if (
        (modVehicle.VehicleTrailers !== null) &
        (modVehicle.VehicleTrailers.length > 0)
      )
        modVehicle.VehicleTrailers.forEach((trailer) => {
          trailer.Attributes = Utilities.fillAttributeDetails(modVehicleTrailerAttributeMetaDataList);
        });
      return modVehicle;
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
  }

  handleNextClick = (entity, data, columns) => {
    if (entity === "rigidTruck") {
      this.setState({
        step1Active: false,
        step2Active: true,
      });
      rigidTruckColumns = columns;
    }

    if (entity === "trailer") {
      this.setState({
        step2Active: false,
        step3Active: true,
      });
      trailerColumns = columns;
    }
  };

  handleSelectClick = (entity, data, columns) => {
    if (entity === "rigidTruck") {
      this.setState({
        rigidTruckSelection: [...data],
      });
      rigidTruckColumns = columns;
    }

    if (entity === "trailer") {
      this.setState({
        trailerSelection: [...data],
      });
      trailerColumns = columns;
    }

  }

  handleRigidTruckList = (rigidTruckSelection, columns) => {
    rigidTruckColumns = columns;

    this.setState({
      rigidTruckSelection: rigidTruckSelection,
      isRigidLoaded: true
      // step1Data: rigidTruckSelection,
    });
  };

  handleTrailerList = (trailerSelection, columns) => {
    trailerColumns = columns;

    this.setState({
      trailerSelection: trailerSelection,
      isTrailerLoaded: true
      // step2Data: trailerSelection,
    });
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      let validationErrors = { ...this.state.validationErrors };
      let modVehicle = lodash.cloneDeep(this.state.modVehicle);
      validationErrors[propertyName] = error;
      modVehicle[propertyName] = value;
      this.setState({ validationErrors, modVehicle });
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on handleDateTextChange",
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
      this.setState({ vehicleAttributeValidationErrors, modVehicleAttributeMetaDataList });
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on handleVehicleAttributeDataChange",
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
      this.setState({ vehicleTrailerAttributeValidationErrors, modVehicleTrailerAttributeMetaDataList });
    } catch (error) {
      console.log(
        "RigidTruckWithTrailerDetailsComposite:Error occured on handleVehicleTrailerAttributeDataChange",
        error
      );
    }
  };

  handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      carriers: this.state.carrierOptions,
      productType: this.state.productTypeOptions,
      unitOfWeight: this.state.weightUOMOptions,
      unitOfVolume: this.state.volumeUOMOptions,
      unitOfDimension: this.state.lengthUOMOptions,
      terminalCodes: this.state.terminalOptions,
    };

    const popUpContents = [
      {
        fieldName: "Vehicle_LastUpdated",
        fieldValue:
          new Date(this.state.modVehicle.LastUpdateTime).toLocaleDateString() +
          " " +
          new Date(this.state.modVehicle.LastUpdateTime).toLocaleTimeString(),
      },
      {
        fieldName: "Vehicle_LastActiveTime",
        fieldValue:
          this.state.modVehicle.LastActiveTime !== undefined &&
            this.state.modVehicle.LastActiveTime !== null
            ? new Date(
              this.state.modVehicle.LastActiveTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modVehicle.LastActiveTime
            ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "Vehicle_CreateTime",
        fieldValue:
          new Date(this.state.modVehicle.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modVehicle.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <TranslationConsumer>
        {(t) => (
          <>
            <Accordion>
              <Accordion.Content
                title={t("Step1_RigidTruck")}
                active={this.state.step1Active}
                onClick={() =>
                  this.setState({ step1Active: !this.state.step1Active })
                }
              >
                <div className="borderTable">
                  <VehicleComposite
                    key="rigidTruck"
                    rigidTruckWithTrailer={rigidtruckWithTrailer}
                    rigidTruckSelection={vehicleTrailers}
                    handleNextClick={this.handleNextClick}
                    getRigidTruckList={this.handleRigidTruckList}
                    handleSelectClick={this.handleSelectClick}
                    rigidTruckShareholder={this.props.selectedShareholder}
                  />
                </div>
              </Accordion.Content>
            </Accordion>
            {this.state.rigidTruckSelection.length > 0 &&
              !this.state.step1Active ? (
              <DataTable
                data={this.state.rigidTruckSelection}
                selection={this.state.rigidTruckSelection}
                selectionMode="multiple"
                showHeader={true}
              // onSelectionChange={(e) => this.setState({ tractorSelection: e })}
              >
                {rigidTruckColumns.map((key) => (
                  <DataTable.Column
                    key={key.Name}
                    initialWidth={key.Width}
                    field={key.Name}
                    header={t(key.Name)}
                    renderer={(cellData) => this.displayValues(cellData, key)}
                  />
                ))}
              </DataTable>
            ) : (
              ""
            )}
            {this.state.vehicle.Code !== "" &&
              !this.state.isRigidLoaded ? (
              <div className="authLoading" style={{ height: "80px" }}>
                <Loader style={{ top: "10px" }} text=" "></Loader>
              </div>
            ) : (
              ""
            )}

            <Accordion>
              <Accordion.Content
                title={t("Step2_Trailer")}
                active={this.state.step2Active}
                onClick={() =>
                  this.setState({ step2Active: !this.state.step2Active })
                }
              >
                <div className="borderTable">
                  <TrailerComposite
                    vehicleWithTrailer={vehicleWithTrailer}
                    handleNextClick={this.handleNextClick}
                    getTrailerList={this.handleTrailerList}
                    trailerSelection={vehicleTrailers}
                    vehicleShareholder={this.props.selectedShareholder}
                    handleSelectClick={this.handleSelectClick}
                  />
                </div>
              </Accordion.Content>
            </Accordion>
            {this.state.trailerSelection.length > 0 &&
              !this.state.step2Active ? (
              <DataTable
                data={this.state.trailerSelection}
                selection={this.state.trailerSelection}
                selectionMode="multiple"
                showHeader={true}
              // onSelectionChange={(e) => this.setState({ trailerSelection: e })}
              >
                {trailerColumns.map((key) => (
                  <DataTable.Column
                    key={key.Name}
                    initialWidth={key.Width}
                    field={key.Name}
                    header={t(key.Name)}
                    renderer={(cellData) => this.displayValues(cellData, key)}
                  />
                ))}
              </DataTable>
            ) : (
              ""
            )}
            {this.state.vehicle.Code !== "" &&
              !this.state.isTrailerLoaded ? (
              <div className="authLoading" style={{ height: "80px" }}>
                <Loader style={{ top: "10px" }} text=" "></Loader>
              </div>
            ) : (
              ""
            )}

            <Accordion>
              <Accordion.Content
                title={t("Step3_Vehicle")}
                active={this.state.step3Active}
                onClick={() =>
                  this.setState({ step3Active: !this.state.step3Active })
                }
              >
                <div className="borderTable">
                  {/* {this.state.isReadyToRender ? ( */}
                  <div>
                    <ErrorBoundary>
                      <TMDetailsHeader
                        entityCode={this.state.vehicle.Code}
                        newEntityName="VehicleList_title"
                        popUpContents={popUpContents}
                      ></TMDetailsHeader>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <div className="detailsContainer">
                        <div className="row">
                          <VehicleBasicFields
                            data={this.state.vehicle}
                            modData={this.state.modVehicle}
                            validationErrors={this.state.validationErrors}
                            listOptions={listOptions}
                            onFieldChange={this.handleChange}
                            onDateTextChange={this.handleDateTextChange}
                            onAllTerminalsChange={this.handleAllTerminalsChange}
                            onCarrierChange={this.handleCarrierChange}
                            onActiveStatusChange={this.handleActiveStatusChange}
                            isEnterpriseNode={
                              this.props.userDetails.EntityResult
                                .IsEnterpriseNode
                            }
                            attributeValidationErrors={
                              this.state.vehicleAttributeValidationErrors
                            }
                            modAttributeMetaDataList={
                              this.state.modVehicleAttributeMetaDataList
                            }
                            onAttributeDataChange={this.handleVehicleAttributeDataChange}
                            isBonded={this.state.isBonded}
                          ></VehicleBasicFields>

                          {this.state.modVehicleTrailerAttributeMetaDataList
                            .length > 0 ? (
                            <div className="col-12 col-md-12 col-lg-12">
                              <Accordion>
                                <Accordion.Content
                                  className="attributeAccordian"
                                  title={t("VEHICLETRAILER_Attributes")}
                                >
                                  {this.state
                                    .modVehicleTrailerAttributeMetaDataList
                                    .length > 0
                                    ? this.state.modVehicleTrailerAttributeMetaDataList.map(
                                      (attribute) => (
                                        <ErrorBoundary>
                                          <div className="col-12 col-md-12 col-lg-12">
                                            <Accordion>
                                              <Accordion.Content
                                                className="attributeAccordian"
                                                title={
                                                  this.props.userDetails
                                                    .EntityResult
                                                    .IsEnterpriseNode
                                                    ? attribute.TerminalCode +
                                                    " - " +
                                                    t("Attributes_Header")
                                                    : t("Attributes_Header")
                                                }
                                              >
                                                <AttributeDetails
                                                  selectedAttributeList={
                                                    attribute.attributeMetaDataList
                                                  }
                                                  handleCellDataEdit={
                                                    this.handleVehicleTrailerAttributeDataChange
                                                  }
                                                  attributeValidationErrors={this.handleValidationErrorFilter(
                                                    this.state
                                                      .vehicleTrailerAttributeValidationErrors,
                                                    attribute.TerminalCode
                                                  )}
                                                ></AttributeDetails>
                                              </Accordion.Content>
                                            </Accordion>
                                          </div>
                                        </ErrorBoundary>
                                      )
                                    )
                                    : null}
                                </Accordion.Content>
                              </Accordion>
                            </div>
                          ) : null}
                        </div>
                      </div>
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
                          this.state.vehicle.Code === ""
                            ? functionGroups.add
                            : functionGroups.modify
                        }
                        functionGroup={fnVehicle}
                        handleOperation={this.saveVehicle}
                        handleClose={this.handleAuthenticationClose}
                      ></UserAuthenticationLayout>
                    ) : null}
                  </div>
                  {/* ) : (
                      <div>Loading...</div>
                    )} */}
                </div>
              </Accordion.Content>
            </Accordion>
            {this.state.step3Active ? (
              ""
            ) : (
              <div className="vehicleBackbtn">
                <Button
                  className="backButton"
                  content={t("Back")}
                  onClick={this.props.onBack}
                ></Button>
              </div>
            )}
          </>
        )}
      </TranslationConsumer>
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

export default connect(mapStateToProps)(RigidTruckWithTrailerDetailsComposite);
