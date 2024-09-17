import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import { connect } from "react-redux";
import axios from "axios";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { functionGroups, fnPrimeMover,fnKPIInformation } from "../../../JS/FunctionGroups";
import { emptyPrimeMover } from "../../../JS/DefaultEntities";
import PrimeMoverDetails from "../../UIBase/Details/PrimeMoverDetails";
import {
  primeMoverValidationDef,
} from "../../../JS/ValidationDef";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { primeMoverAttributeEntity } from "../../../JS/AttributeEntity";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiPrimeMoverDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PrimeMoverDetailsComposite extends Component {
  state = {
    primeMover: {},
    modPrimeMover: {},
    validationErrors: Utilities.getInitialValidationErrors(
      primeMoverValidationDef
    ),
    isReadyToRender: false,
    carrierOptions: [],
    terminalOptions: [],
    weightUOMOptions: [],
    lengthUOMOptions: [],
    saveEnabled: false,
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    primeMoverKPIList: [],
    showAuthenticationLayout: false,
    tempPrimeMover: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      let isNewPrimeMover = false;
      if (this.props.selectedRow.Common_Code === undefined)
        isNewPrimeMover = true;
      // this.getPrimeMover(isNewPrimeMover);
      this.getAttributes(isNewPrimeMover);
      this.getCarrierList(this.props.selectedShareholder);
      this.getUOMList();
    } catch (error) {
      console.log(
        "PrimeMoverDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.primeMover.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAttributes(true);
        //this.getPrimeMover(true);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "PrimeMoverDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(isNewPrimeMover) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [primeMoverAttributeEntity],
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
                  result.EntityResult.primemover
                ),
            },
            () => this.getPrimeMover(isNewPrimeMover)
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
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

            // let volumeUOMs = result.EntityResult.VOLUME;
            // let volumeUOMOptions = [];
            // volumeUOMs.forEach((volumeOption) => {
            //   volumeUOMOptions.push({
            //     text: volumeOption,
            //     value: volumeOption,
            //   });
            // });

            let lengthUOMs = result.EntityResult.LENGTH;
            let lengthUOMOptions = [];
            lengthUOMs.forEach((lengthOption) => {
              lengthUOMOptions.push({
                text: lengthOption,
                value: lengthOption,
              });
            });

            this.setState({
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
          console.log("Error in GetCarrierList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getPrimeMover(isNewPrimeMover) {
    // let primeMover = props.selectedRow;

    if (isNewPrimeMover) {
      let terminalOptions = [];
      emptyPrimeMover.TareWeightUOM =
        this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.MassUOM;
      this.setState(
        {
          primeMover: lodash.cloneDeep(emptyPrimeMover),
          modPrimeMover: lodash.cloneDeep(emptyPrimeMover),

          isReadyToRender: true,
          terminalOptions,
          primeMoverKPIList:[],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnPrimeMover
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    let keyCode = [
      {
        key: KeyCodes.primeMoverCode,
        value:
          this.props.selectedRow.Common_Code === undefined
            ? this.state.modPrimeMover.Code
            : this.props.selectedRow.Common_Code,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.primeMoverCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetPrimeMover,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        //console.log(result);
        if (result.IsSuccess === true) {
          // this.getTerminalsForCarrier(result.EntityResult.CarrierCode);

          this.setState(
            {
              isReadyToRender: true,
              primeMover: lodash.cloneDeep(result.EntityResult),
              modPrimeMover: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnPrimeMover
              ),
            },
            () => {
              this.getTerminalsForCarrier(
                result.EntityResult.CarrierCompanyCode
              );
              this.getKPIList(this.props.selectedShareholder,result.EntityResult.PrimeMoverCode)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          this.setState({
            modPrimeMover: lodash.cloneDeep(emptyPrimeMover),
            primeMover: lodash.cloneDeep(emptyPrimeMover),
            isReadyToRender: true,
          });
          console.log("Error in GetPrimeMover:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting PrimeMover:", error);
      });
  }

  handleChange = (propertyName, data) => {
    let modPrimeMover = lodash.cloneDeep(this.state.modPrimeMover);
    try {
      if (propertyName === "CarrierCompanyCode") {
        this.handleCarrierChange(data);
      } else {
        modPrimeMover[propertyName] = data;
        // this.setState({ modPrimeMover });
      }

      const validationErrors = { ...this.state.validationErrors };
      if (modPrimeMover.Active === this.state.primeMover.Active) {
        if (
          this.state.primeMover.Remarks === modPrimeMover.Remarks ||
          modPrimeMover.Remarks === ""
        ) {
          validationErrors.Remarks = "";
        }
        if (modPrimeMover.Remarks === "")
          modPrimeMover.Remarks = this.state.primeMover.Remarks;
      }
      if (propertyName === "Active") {
        if (modPrimeMover.Active !== this.state.primeMover.Active) {
          modPrimeMover.Remarks = "";
        }
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
        propertyName === "LicensceNo" ||
        propertyName === "licenseExpiryDate"
      ) {
        //validationErrors[propertyName] = "";
        validationErrors.licenseExpiryDate = "";
        validationErrors.LicensceNo = "";
      }

      if (
        propertyName === "Height" ||
        propertyName === "Length" ||
        propertyName === "Width" ||
        propertyName === "LWHUOM"
      ) {
        validationErrors.LWHUOM = "";
      }

      if (primeMoverValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          primeMoverValidationDef[propertyName],
          data
        );
      }

      this.setState({ validationErrors, modPrimeMover });
      if (propertyName === "TerminalCodes") {
        this.terminalSelectionChange(data);
      }
    } catch (error) {
      console.log(
        "PrimeMoverDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

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
      var modPrimeMover = lodash.cloneDeep(this.state.modPrimeMover);

      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });

        if (existitem === undefined) {
          attributeMetaDataList.primemover.forEach(function (
            attributeMetaData
          ) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modPrimeMover.Attributes.find(
                (customerAttribute) => {
                  return customerAttribute.TerminalCode === terminal;
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
        "CustomerDetailsComposite:Error occured on terminalSelectionChange",
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
        Array.isArray(attributeMetaDataList.primemover) &&
        attributeMetaDataList.primemover.length > 0
      ) {
        this.terminalSelectionChange([
          attributeMetaDataList.primemover[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "CustomerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  handleDateTextChange = (propertyName, value, error) => {
    try {
      let validationErrors = { ...this.state.validationErrors };
      let modPrimeMover = { ...this.state.modPrimeMover };
      validationErrors[propertyName] = error;
      modPrimeMover[propertyName] = value;
      this.setState({ validationErrors, modPrimeMover });
    } catch (error) {
      console.log(
        "PrimeMoverDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      const modPrimeMover = lodash.cloneDeep(this.state.modPrimeMover);
      let terminalOptions = [...this.state.terminalOptions];
      if (checked) modPrimeMover.TerminalCodes = terminalOptions;
      else modPrimeMover.TerminalCodes = [];
      this.setState({ modPrimeMover });
      this.terminalSelectionChange(modPrimeMover.TerminalCodes);
    } catch (error) {
      console.log(
        "CarrierDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleCarrierChange = (carrier) => {
    // if (this.props.userDetails.EntityResult.IsEnterpriseNode)
    this.getTerminalsForCarrier(carrier);
    // else {
    //   var modPrimeMover = lodash.cloneDeep(this.state.modPrimeMover);
    //   modPrimeMover.CarrierCompanyCode = carrier;
    //   var terminalCodes = [];
    //   modPrimeMover.TerminalCodes = [];
    //   this.setState({ terminalCodes, modPrimeMover });
    // }
    // if (primeMoverValidationDef["CarrierCompanyCode"] !== undefined) {
    //   const validationErrors = { ...this.state.validationErrors };
    //   validationErrors["CarrierCompanyCode"] = Utilities.validateField(
    //     primeMoverValidationDef["CarrierCompanyCode"],
    //     carrier
    //   );

    //   this.setState({ validationErrors, modPrimeMover });
    // }
  };
  getTerminalsForCarrier(carrier) {
    //if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
    const modPrimeMover = lodash.cloneDeep(this.state.modPrimeMover);
    let terminalOptions = [...this.state.terminalOptions];
    modPrimeMover.CarrierCompanyCode = carrier;

    try {
      if (carrier === undefined) {
        terminalOptions = [];
        modPrimeMover.TerminalCodes = [];
        this.setState({ terminalOptions, modPrimeMover });
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
          let primeMover = { ...this.state.primeMover };
          if (
            primeMover.Code === undefined ||
            primeMover.Code === "" ||
            primeMover.Code === null
          ) {
            if (terminalOptions.length === 1) {
              modPrimeMover.TerminalCodes = [...terminalOptions];
              this.terminalSelectionChange(modPrimeMover.TerminalCodes);
            } else {
              modPrimeMover.TerminalCodes = [];
              this.localNodeAttribute();
            }
          }
          if (Array.isArray(modPrimeMover.TerminalCodes)) {
            modPrimeMover.TerminalCodes = terminalOptions.filter((x) =>
              modPrimeMover.TerminalCodes.includes(x)
            );
          }

          this.setState({ modPrimeMover });
        })
        .catch((error) => {
          terminalOptions = [];
          modPrimeMover.TerminalCodes = [];
          this.setState({ terminalOptions, modPrimeMover });
          console.log("Error while getting Carrier:", error, carrier);
          //throw error;
        });
    } catch (error) {
      terminalOptions = [];
      modPrimeMover.TerminalCodes = [];
      this.setState({ terminalOptions, modPrimeMover });
      console.log(
        "PrimeMoverDetailsComposite:Error occured on handleCarrierChange",
        error
      );
    }
    // }
  }

  fillDetails() {
    try {
      const modPrimeMover = { ...this.state.modPrimeMover };
      modPrimeMover.ShareholderCode = this.props.selectedShareholder;
      if (modPrimeMover.Height === "") modPrimeMover.Height = null;
      if (modPrimeMover.Length === "") modPrimeMover.Length = null;
      if (modPrimeMover.Width === "") modPrimeMover.Width = null;

      if (modPrimeMover.TareWeight !== null && modPrimeMover.TareWeight !== "")
        modPrimeMover.TareWeight = modPrimeMover.TareWeight.toLocaleString();
      if (modPrimeMover.Height !== null && modPrimeMover.Height !== "")
        modPrimeMover.Height = modPrimeMover.Height.toLocaleString();
      if (modPrimeMover.Length !== null && modPrimeMover.Length !== "")
        modPrimeMover.Length = modPrimeMover.Length.toLocaleString();
      if (modPrimeMover.Width !== null && modPrimeMover.Width !== "")
        modPrimeMover.Width = modPrimeMover.Width.toLocaleString();
      modPrimeMover.PrimeMoverType =
        Constants.PrimeMoverType.NON_RIGID_PRIMEMOVER;

      return modPrimeMover;
    } catch (err) {
      console.log("PrimeMoverDetails error on fill details", err);
    }
  }

  convertStringtoDecimal(modPrimeMover, attributeList) {
    try {
      if (modPrimeMover.Height !== null && modPrimeMover.Height !== "") {
        modPrimeMover.Height = Utilities.convertStringtoDecimal(
          modPrimeMover.Height
        );
      }
      if (modPrimeMover.Length !== null && modPrimeMover.Length !== "") {
        modPrimeMover.Length = Utilities.convertStringtoDecimal(
          modPrimeMover.Length
        );
      }
      if (modPrimeMover.Width !== null && modPrimeMover.Width !== "") {
        modPrimeMover.Width = Utilities.convertStringtoDecimal(
          modPrimeMover.Width
        );
      }

      if (
        modPrimeMover.TareWeight !== null &&
        modPrimeMover.TareWeight !== ""
      ) {
        modPrimeMover.TareWeight = Utilities.convertStringtoDecimal(
          modPrimeMover.TareWeight
        );
      }
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modPrimeMover.Attributes = Utilities.fillAttributeDetails(attributeList);
      return modPrimeMover;
    } catch (err) {
      console.log("convertStringtoDecimal error primemover details", err);
    }
  }
  savePrimeMover = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempPrimeMover = lodash.cloneDeep(this.state.tempPrimeMover);

      this.state.primeMover.Code === ""
        ? this.createPrimeMover(tempPrimeMover)
        : this.updatePrimeMover(tempPrimeMover);
    } catch (error) {
      console.log("PrimeMoversComposite : Error in savePrimeMover");
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
        //this.setState({ saveEnabled: false });
        let modPrimeMover = this.fillDetails();
        let attributeList = Utilities.attributesConverttoLocaleString(
          this.state.modAttributeMetaDataList
        );

        if (this.validateSave(modPrimeMover, attributeList)) {
          modPrimeMover = this.convertStringtoDecimal(
            modPrimeMover,
            attributeList
          );

          modPrimeMover = Utilities.convertDatesToString(
            DateFieldsInEntities.DatesInEntity.PrimeMover,
            modPrimeMover
          );
          
          let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempPrimeMover = lodash.cloneDeep(modPrimeMover);
        this.setState({ showAuthenticationLayout, tempPrimeMover }, () => {
          if (showAuthenticationLayout === false) {
            this.savePrimeMover();
          }
      });
        
        } else {
          this.setState({ saveEnabled: true });
        }
      }
    } catch (error) {
      console.log(
        "PrimeMoverDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };
  validateSave(modPrimeMover, attributeList) {
    //const modPrimeMover = this.state.modPrimeMover;
    let validationErrors = { ...this.state.validationErrors };
    Object.keys(primeMoverValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        primeMoverValidationDef[key],
        modPrimeMover[key]
      );
    });

    if (modPrimeMover.Active !== this.state.primeMover.Active) {
      if (modPrimeMover.Remarks === "") {
        validationErrors["Remarks"] = "PrimeMover_RemarksRequired";
      }
    }

    if (
      (modPrimeMover.LicensceNo !== null && modPrimeMover.LicensceNo !== "") ||
      !isNaN(Date.parse(modPrimeMover.licenseExpiryDate))
    ) {
      if (isNaN(Date.parse(modPrimeMover.licenseExpiryDate)))
        validationErrors.licenseExpiryDate = "LICENSEEXPIRYDATE_REQUIRED";

      if (modPrimeMover.LicensceNo === null || modPrimeMover.LicensceNo === "")
        validationErrors.LicensceNo = "Vessel_LicNoRequired";
    }

    if (
      (modPrimeMover.RoadTaxNo !== null && modPrimeMover.RoadTaxNo !== "") ||
      !isNaN(Date.parse(modPrimeMover.RoadTaxNoIssueDate)) ||
      !isNaN(Date.parse(modPrimeMover.RoadTaxNoExpiryDate))
    ) {
      if (modPrimeMover.RoadTaxNo === null || modPrimeMover.RoadTaxNo === "") {
        validationErrors["RoadTaxNo"] = "Vehicle_RoadTaxNoRequired";
      }

      if (isNaN(Date.parse(modPrimeMover.RoadTaxNoIssueDate))) {
        validationErrors["RoadTaxNoIssueDate"] = "Vehicle_RoadTaxIssRequired";
      }
      if (isNaN(Date.parse(modPrimeMover.RoadTaxNoExpiryDate))) {
        validationErrors["RoadTaxNoExpiryDate"] = "Vehicle_RoadTaxExpRequired";
      }
    }

    // let notification = {
    //   messageType: "critical",
    //   message: "PrimeMoverDetails_SavedStatus",
    //   messageResultDetails: [],
    // };

    if (
      (modPrimeMover.Height !== null ||
        modPrimeMover.Width != null ||
        modPrimeMover.Length !== null) &&
      modPrimeMover.LWHUOM === null
    ) {
      // if (modPrimeMover.Height === null)
      //   validationErrors.Height = "Common_HeightRequired";
      // if (modPrimeMover.Length === null)
      //   validationErrors.Length = "Common_LengthRequired";
      // if (modPrimeMover.Width === null)
      //   validationErrors.Width = "Common_WidthRequired";
      // if (validationErrors.LWHUOM === null)
      validationErrors.LWHUOM = "PrimeMover_UOMRequired";

      // notification.messageResultDetails.push({
      //   keyFields: ["PrimeMover_Code"],
      //   keyValues: [modPrimeMover.Code],
      //   isSuccess: false,
      //   errorMessage: "PrimeMover_UOMRequired",
      // });
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
    // if (notification.messageResultDetails.length > 0) {
    //   this.props.onSaved(this.state.modPrimeMover, "update", notification);
    //   return false;
    // }
    //return returnValue;
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
        "DriverDetailsComposite:Error occured on handleAttributeDataChange",
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
            attributeMetaDataList.driver
          ),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }
  createPrimeMover(modPrimeMover) {
    let keyCode = [
      {
        key: KeyCodes.primeMoverCode,
        value: modPrimeMover.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.primeMoverCode,
      KeyCodes: keyCode,
      Entity: modPrimeMover,
    };

    let notification = {
      messageType: "critical",
      message: "PrimeMoverDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["PrimeMover_Code"],
          keyValues: [modPrimeMover.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreatePrimeMover,
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
            // modPrimeMover: lodash.cloneDeep(modPrimeMover),
            // primeMover: lodash.cloneDeep(modPrimeMover),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnPrimeMover
            ),
            showAuthenticationLayout: false,
          });
          this.getPrimeMover(false);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnPrimeMover
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in CreatePrimeMover:", result.ErrorList);
        }

        this.props.onSaved(modPrimeMover, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnPrimeMover
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modPrimeMover, "add", notification);
      });
  }
  updatePrimeMover(modPrimeMover) {
    let keyCode = [
      {
        key: KeyCodes.primeMoverCode,
        value: modPrimeMover.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.primeMoverCode,
      KeyCodes: keyCode,
      Entity: modPrimeMover,
    };

    let notification = {
      messageType: "critical",
      message: "PrimeMoverDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["PrimeMover_Code"],
          keyValues: [modPrimeMover.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdatePrimeMover,
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
            // modPrimeMover: lodash.cloneDeep(modPrimeMover),
            // primeMover: lodash.cloneDeep(modPrimeMover),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnPrimeMover
            ),
            showAuthenticationLayout: false,
          });
          this.getPrimeMover(false);
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnPrimeMover
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdatePrimeMover:", result.ErrorList);
        }
        //console.log(notification);
        this.props.onSaved(modPrimeMover, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modPrimeMover, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnPrimeMover
          ),
          showAuthenticationLayout: false,
        });
      });
  }

  handleReset = () => {
    try {
      let modPrimeMover = lodash.cloneDeep(this.state.primeMover);
      this.setState({ modPrimeMover });
      if (this.state.primeMover.Code === "") {
        // let terminalOptions = [ ...this.state.terminalOptions ];
        let terminalOptions = [];
        this.setState({ terminalOptions });
      }
      let validationErrors = { ...this.state.validationErrors };
      Object.keys(validationErrors).forEach((key) => {
        validationErrors[key] = "";
      });
      this.setState(
        {
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modPrimeMover.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "PrimeMoverDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  //Get KPI for Prime Mover
  getKPIList(shareholder, primeMoverCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiPrimeMoverDetail,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "PrimemoverCode", value: primeMoverCode }],
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
              primeMoverKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ primeMoverKPIList: [] });
            console.log("Error in Prime Mover KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Prime Mover KPIList:", error);
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
      unitOfWeight: this.state.weightUOMOptions,
      unitOfDimension: this.state.lengthUOMOptions,
      terminalCodes: this.state.terminalOptions,
    };

    const popUpContents = [
      {
        fieldName: "PrimeMover_LastUpdated",
        fieldValue:
          new Date(
            this.state.modPrimeMover.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modPrimeMover.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "PrimeMover_LastActiveTime",
        fieldValue:
          this.state.modPrimeMover.LastActiveTime !== undefined &&
          this.state.modPrimeMover.LastActiveTime !== null
            ? new Date(
                this.state.modPrimeMover.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modPrimeMover.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "PrimeMover_CreatedTime",
        fieldValue:
          new Date(this.state.modPrimeMover.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modPrimeMover.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.primeMover.Code}
            newEntityName="PrimeMover_NewPrimeMover"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.primeMoverKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <PrimeMoverDetails
            primeMover={this.state.primeMover}
            modPrimeMover={this.state.modPrimeMover}
            validationErrors={this.state.validationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeMetaDataList={this.state.attributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onDateTextChange={this.handleDateTextChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            onAttributeDataChange={this.handleAttributeDataChange} 
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
          ></PrimeMoverDetails>
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
              this.state.primeMover.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnPrimeMover}
            handleOperation={this.savePrimeMover}
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

export default connect(mapStateToProps)(PrimeMoverDetailsComposite);
