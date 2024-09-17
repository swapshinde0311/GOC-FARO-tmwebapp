import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import { nonFillingVehicleValidationDef } from "../../../JS/ValidationDef";
import { connect } from "react-redux";
import axios from "axios";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { functionGroups, fnVehicle } from "../../../JS/FunctionGroups";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import lodash from "lodash";
import VehicleBasicFields from "../../UIBase/Details/VehicleBasicFields";
import { emptyNonFillingVehicle } from "../../../JS/DefaultEntities";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { vehicleAttributeEntity } from "../../../JS/AttributeEntity";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class NonFillingVehicleDetailsComposite extends Component {
  state = {
    nonFillingVehicle: {},
    modNonFillingVehicle: {},
    validationErrors: Utilities.getInitialValidationErrors(
      nonFillingVehicleValidationDef
    ),
    isReadyToRender: false,
    carrierOptions: [],
    terminalOptions: [],
    saveEnabled: false,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    showAuthenticationLayout: false,
    tempNonFillingVehicle: {},
  };
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      let isNewVehicle = false;
      if (this.props.selectedRow.Common_Code === undefined) isNewVehicle = true;
      this.getAttributes(isNewVehicle);
      this.getCarrierList(this.props.selectedShareholder);
    } catch (error) {
      console.log(
        "nonFillingVehicleDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
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
        this.state.nonFillingVehicle.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getNonFillingVehicle(true);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "nonFillingVehicleDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  handleCarrierChange = (carrier) => {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode)
      this.getTerminalsForCarrier(carrier);
    else {
      const modNonFillingVehicle = lodash.cloneDeep(
        this.state.modNonFillingVehicle
      );
      modNonFillingVehicle.CarrierCompanyCode = carrier;
      const terminalOptions = [];
      modNonFillingVehicle.TerminalCodes = [];
      this.setState({ terminalOptions, modNonFillingVehicle });
    }
    if (nonFillingVehicleValidationDef["CarrierCompanyCode"] !== undefined) {
      const validationErrors = { ...this.state.validationErrors };
      validationErrors["CarrierCompanyCode"] = Utilities.validateField(
        nonFillingVehicleValidationDef["CarrierCompanyCode"],
        carrier
      );

      this.setState({ validationErrors });
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modNonFillingVehicle = lodash.cloneDeep(
        this.state.modNonFillingVehicle
      );
      modNonFillingVehicle.Active = value;
      if (modNonFillingVehicle.Active !== this.state.nonFillingVehicle.Active)
        modNonFillingVehicle.Remarks = "";
      this.setState({ modNonFillingVehicle });
    } catch (error) {
      console.log(
        "nonFillingVehicleDetailsComposite:Error occured in handleActiveStatusChange",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    const modNonFillingVehicle = lodash.cloneDeep(
      this.state.modNonFillingVehicle
    );
    try {
      modNonFillingVehicle[propertyName] = data;
      const validationErrors = { ...this.state.validationErrors };

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

      if (nonFillingVehicleValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          nonFillingVehicleValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modNonFillingVehicle });

      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "nonFillingVehicleDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  getAttributes(isNewVehicle) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [vehicleAttributeEntity],
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
                  result.EntityResult.vehicle
                ),
            },
            () => this.getNonFillingVehicle(isNewVehicle)
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
        var modNonFillingVehicle = lodash.cloneDeep(
          this.state.modNonFillingVehicle
        );

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.vehicle.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modNonFillingVehicle.Attributes.find(
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
        "NonFillingVehicleDetailsComposite:Error occured on terminalSelectionChange",
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
        "NonFillingVehicleDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  getNonFillingVehicle(isNewVehicle) {
    if (isNewVehicle) {
      let terminalOptions = [];
      this.setState(
        {
          nonFillingVehicle: lodash.cloneDeep(emptyNonFillingVehicle),
          modNonFillingVehicle: lodash.cloneDeep(emptyNonFillingVehicle),
          isReadyToRender: true,
          terminalOptions,
          modAttributeMetaDataList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnVehicle
          ),
        },
        () => {
          if (!this.props.userDetails.EntityResult.IsEnterpriseNode)
            this.localNodeAttribute();
        }
      );
      return;
    }
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value:
          this.props.selectedRow.Common_Code === undefined
            ? this.state.modNonFillingVehicle.Code
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
          this.setState(
            {
              isReadyToRender: true,
              nonFillingVehicle: lodash.cloneDeep(result.EntityResult),
              modNonFillingVehicle: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnVehicle
              ),
            },
            () => {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
              this.getTerminalsForCarrier(
                result.EntityResult.CarrierCompanyCode
              );
            }
          );
        } else {
          emptyNonFillingVehicle.ShareholderCode =
            this.props.selectedShareholder;

          this.setState({
            modNonFillingVehicle: lodash.cloneDeep(emptyNonFillingVehicle),
            nonFillingVehicle: lodash.cloneDeep(emptyNonFillingVehicle),
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
      const modNonFillingVehicle = lodash.cloneDeep(
        this.state.modNonFillingVehicle
      );
      modNonFillingVehicle.CarrierCompanyCode = carrier;
      const terminalOptions = [];
      //modNonFillingVehicle.TerminalCodes = [];
      this.setState({ terminalOptions, modNonFillingVehicle });
    } else {
      const modNonFillingVehicle = lodash.cloneDeep(
        this.state.modNonFillingVehicle
      );
      let terminalOptions = [...this.state.terminalOptions];

      modNonFillingVehicle.CarrierCompanyCode = carrier;

      try {
        if (carrier === undefined) {
          terminalOptions = [];
          modNonFillingVehicle.TerminalCodes = [];
          this.setState({ terminalOptions, modNonFillingVehicle });
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
            let nonFillingVehicle = { ...this.state.nonFillingVehicle };
            if (
              nonFillingVehicle.Code === undefined ||
              nonFillingVehicle.Code === "" ||
              nonFillingVehicle.Code === null
            ) {
              if (terminalOptions.length === 1) {
                modNonFillingVehicle.TerminalCodes = [...terminalOptions];
                this.terminalSelectionChange(
                  modNonFillingVehicle.TerminalCodes
                );
              } else {
                modNonFillingVehicle.TerminalCodes = [];
                this.terminalSelectionChange([]);
              }
            }

            if (Array.isArray(modNonFillingVehicle.TerminalCodes)) {
              modNonFillingVehicle.TerminalCodes = terminalOptions.filter((x) =>
                modNonFillingVehicle.TerminalCodes.includes(x)
              );
            }

            this.setState({ modNonFillingVehicle });
          })
          .catch((error) => {
            terminalOptions = [];
            modNonFillingVehicle.TerminalCodes = [];
            this.setState({ terminalOptions, modNonFillingVehicle });
            console.log("Error while getting Carrier:", error, carrier);
            //throw error;
          });
      } catch (error) {
        terminalOptions = [];
        modNonFillingVehicle.TerminalCodes = [];
        this.setState({ terminalOptions, modNonFillingVehicle });
        console.log(
          "nonFillingVehicleDetailsComposite:Error occured on handleCarrierChange",
          error
        );
      }
    }
  }
  handleReset = () => {
    try {
      this.setState(
        {
          modNonFillingVehicle: lodash.cloneDeep(this.state.nonFillingVehicle),
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(
              this.state.modNonFillingVehicle.TerminalCodes
            );
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
      if (this.state.nonFillingVehicle.Code === "") {
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
        "nonFillingVehicleDetailsComposite:Error occured on handleReset",
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
            attributeMetaDataList.vehicle
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleAllTerminalsChange = (checked) => {
    try {
      let modNonFillingVehicle = lodash.cloneDeep(
        this.state.modNonFillingVehicle
      );
      let terminalOptions = [...this.state.terminalOptions];
      if (checked) modNonFillingVehicle.TerminalCodes = terminalOptions;
      else modNonFillingVehicle.TerminalCodes = [];
      this.setState({ modNonFillingVehicle });
      this.terminalSelectionChange(modNonFillingVehicle.TerminalCodes);
    } catch (error) {
      console.log(
        "nonFillingVehicleDetailsComposite:Error occured on handleAllTerminalsChange",
        error
      );
    }
  };

  saveNonFillingVehicle = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempNonFillingVehicle = lodash.cloneDeep(this.state.tempNonFillingVehicle);

    
      this.state.nonFillingVehicle.Code === ""
        ? this.createVehicle(tempNonFillingVehicle)
        : this.updateVehicle(tempNonFillingVehicle);
    } catch (error) {
      console.log("NonFillingVehicleComposite : Error in saveNonFillingVehicle");
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
       // this.setState({ saveEnabled: false });
        let attributeList = Utilities.attributesConverttoLocaleString(
          this.state.modAttributeMetaDataList
        );
        let modNonFillingVehicle = this.fillDetails();
        if (this.validateSave(modNonFillingVehicle, attributeList)) {
          modNonFillingVehicle = this.convertStringtoDecimal(
            modNonFillingVehicle,
            attributeList
            );
          modNonFillingVehicle = Utilities.convertDatesToString(
            DateFieldsInEntities.DatesInEntity.Vehicle,
            modNonFillingVehicle
           );

            let showAuthenticationLayout =
            this.props.userDetails.EntityResult.IsWebPortalUser !== true
              ? true
              : false;
          let tempNonFillingVehicle = lodash.cloneDeep(modNonFillingVehicle);
          this.setState({ showAuthenticationLayout, tempNonFillingVehicle }, () => {
            if (showAuthenticationLayout === false) {
              this.saveNonFillingVehicle();
            }
        });
        } else this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "nonFillingVehicle DetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  fillDetails() {
    try {
      let modNonFillingVehicle = lodash.cloneDeep(
        this.state.modNonFillingVehicle
      );
      modNonFillingVehicle.ShareholderCode = this.props.selectedShareholder;
      var licDate = new Date();
      modNonFillingVehicle.LicenseNoIssueDate = licDate.getUTCDate();
      //modNonFillingVehicle.LicenseNoIssueDate.setHours(0, 0, 0, 0);

      let vehiclePrimerInfo = {
        PrimeMoverCode: null,
        VehicleCode: null,
        ShareholderCode: null,
        CarrierCompanyCode: null,
        PrimeMoverSequence: null,
      };
      vehiclePrimerInfo.VehicleCode = modNonFillingVehicle.Code;
      vehiclePrimerInfo.ShareholderCode = this.props.selectedShareholder;
      vehiclePrimerInfo.CarrierCompanyCode =
        modNonFillingVehicle.CarrierCompanyCode;
      vehiclePrimerInfo.PrimeMoverSequence = 1;
      vehiclePrimerInfo.PrimeMoverCode = "";

      // modNonFillingVehicle.VehiclePrimeMovers.push(vehiclePrimerInfo);

      // modNonFillingVehicle.VehiclePrimeMovers[0].VehicleCode = modNonFillingVehicle.Code;
      // modNonFillingVehicle.VehiclePrimeMovers[0].PrimeMoverCode = "";
      // modNonFillingVehicle.VehiclePrimeMovers[0].ShareholderCode = this.props.selectedShareholder;
      // modNonFillingVehicle.VehiclePrimeMovers[0].CarrierCompanyCode =
      //     modNonFillingVehicle.CarrierCompanyCode;
      // modNonFillingVehicle.VehiclePrimeMovers[0].PrimeMoverSequence = 1;

      return modNonFillingVehicle;
    } catch (error) {
      console.log(
        "nonFillingVehicleDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  convertStringtoDecimal(modNonFillingVehicle, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modNonFillingVehicle.Attributes =
        Utilities.fillAttributeDetails(attributeList);
      return modNonFillingVehicle;
    } catch (err) {
      console.log(
        "convertStringtoDecimal error NonFillingVehicleDetailsComposite",
        err
      );
    }
  }

  validateSave(modNonFillingVehicle, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(nonFillingVehicleValidationDef).forEach(function (key) {
      if (modNonFillingVehicle[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          nonFillingVehicleValidationDef[key],
          modNonFillingVehicle[key]
        );
    });

    if (modNonFillingVehicle.Active !== this.state.nonFillingVehicle.Active) {
      if (
        modNonFillingVehicle.Remarks === null ||
        modNonFillingVehicle.Remarks === ""
      ) {
        validationErrors["Remarks"] = "Vehicle_RemarksRequired";
      }
    }

    if (
      modNonFillingVehicle.LicenseNo !== "" &&
      modNonFillingVehicle.LicenseNo !== null &&
      modNonFillingVehicle.LicenseNo !== undefined
    ) {
      if (isNaN(Date.parse(modNonFillingVehicle.LicenseNoExpiryDate))) {
        validationErrors["LicenseNoExpiryDate"] = "Vehicle_LicExpRequired";
      }
    }

    if (
      (modNonFillingVehicle.RoadTaxNo !== null &&
        modNonFillingVehicle.RoadTaxNo !== "") ||
      !isNaN(Date.parse(modNonFillingVehicle.RoadTaxNoIssueDate)) ||
      !isNaN(Date.parse(modNonFillingVehicle.RoadTaxNoExpiryDate))
    ) {
      if (
        modNonFillingVehicle.RoadTaxNo === null ||
        modNonFillingVehicle.RoadTaxNo === ""
      ) {
        validationErrors["RoadTaxNo"] = "Vehicle_RoadTaxNoRequired";
      }

      if (isNaN(Date.parse(modNonFillingVehicle.RoadTaxNoIssueDate))) {
        validationErrors["RoadTaxNoIssueDate"] = "Vehicle_RoadTaxIssRequired";
      }
      if (isNaN(Date.parse(modNonFillingVehicle.RoadTaxNoExpiryDate))) {
        validationErrors["RoadTaxNoExpiryDate"] = "Vehicle_RoadTaxExpRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
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

    if (returnValue)
      if (notification.messageResultDetails.length > 0) {
        this.props.onSaved(
          this.state.modNonFillingVehicle,
          "update",
          notification
        );
        return false;
      }
    return returnValue;
  }

  createVehicle(modNonFillingVehicle) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modNonFillingVehicle.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modNonFillingVehicle,
    };

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vehicle_Code"],
          keyValues: [modNonFillingVehicle.Code],
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
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          this.getNonFillingVehicle(false);
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

        this.props.onSaved(
          this.state.modNonFillingVehicle,
          "add",
          notification
        );
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
        this.props.onSaved(
          this.state.modNonFillingVehicle,
          "add",
          notification
        );
      });
  }
  updateVehicle(modNonFillingVehicle) {
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: modNonFillingVehicle.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.vehicleCode,
      KeyCodes: keyCode,
      Entity: modNonFillingVehicle,
    };

    let notification = {
      messageType: "critical",
      message: "VehicleInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Vehicle_Code"],
          keyValues: [modNonFillingVehicle.Code],
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
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnVehicle
            ),
            showAuthenticationLayout: false,
          });
          this.getNonFillingVehicle(false);
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
        this.props.onSaved(
          this.state.modNonFillingVehicle,
          "update",
          notification
        );
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(
          this.state.modNonFillingVehicle,
          "modify",
          notification
        );
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
      let modNonFillingVehicle = lodash.cloneDeep(
        this.state.modNonFillingVehicle
      );
      validationErrors[propertyName] = error;
      modNonFillingVehicle[propertyName] = value;
      this.setState({ validationErrors, modNonFillingVehicle });
    } catch (error) {
      console.log(
        "nonFillingVehicleDetailsComposite:Error occured on handleDateTextChange",
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
        "NonFillingVehicleDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const listOptions = {
      carriers: this.state.carrierOptions,
      terminalCodes: this.state.terminalOptions,
    };

    const popUpContents = [
      {
        fieldName: "Vehicle_LastUpdated",
        fieldValue:
          new Date(
            this.state.modNonFillingVehicle.LastUpdateTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modNonFillingVehicle.LastUpdateTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "Vehicle_LastActiveTime",
        fieldValue:
          this.state.modNonFillingVehicle.LastActiveTime !== undefined &&
          this.state.modNonFillingVehicle.LastActiveTime !== null
            ? new Date(
                this.state.modNonFillingVehicle.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modNonFillingVehicle.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "Vehicle_CreateTime",
        fieldValue:
          new Date(
            this.state.modNonFillingVehicle.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modNonFillingVehicle.CreatedTime
          ).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.nonFillingVehicle.Code}
            newEntityName="NFVehicle_title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="detailsContainer">
            <div className="row">
              <VehicleBasicFields
                data={this.state.nonFillingVehicle}
                modData={this.state.modNonFillingVehicle}
                validationErrors={this.state.validationErrors}
                listOptions={listOptions}
                onFieldChange={this.handleChange}
                onDateTextChange={this.handleDateTextChange}
                onAllTerminalsChange={this.handleAllTerminalsChange}
                onActiveStatusChange={this.handleActiveStatusChange}
                onCarrierChange={this.handleCarrierChange}
                isEnterpriseNode={
                  this.props.userDetails.EntityResult.IsEnterpriseNode
                }
                attributeValidationErrors={this.state.attributeValidationErrors}
                modAttributeMetaDataList={this.state.modAttributeMetaDataList}
                onAttributeDataChange={this.handleAttributeDataChange}
              ></VehicleBasicFields>
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
              this.state.nonFillingVehicle.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnVehicle}
            handleOperation={this.saveNonFillingVehicle}
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

export default connect(mapStateToProps)(NonFillingVehicleDetailsComposite);
