import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import { trailerValidationDef } from "../../../JS/ValidationDef";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import {
  trailerAttributeEntity,
  trailerCompAttributeEntity,
} from "../../../JS/AttributeEntity";
import { connect } from "react-redux";
import axios from "axios";
import { functionGroups, fnTrailer,fnKPIInformation } from "../../../JS/FunctionGroups";
import { emptyTrailer } from "../../../JS/DefaultEntities";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import TrailerDetails from "../../UIBase/Details/TrailerDetails";
import lodash from "lodash";
import { trailerCompartmentValidationDef } from "../../../JS/DetailsTableValidationDef";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiTrailerDetail } from "../../../JS/KPIPageName";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class TrailerDetailsComposite extends Component {
  state = {
    trailer: {},
    modTrailer: {},
    validationErrors:
      Utilities.getInitialValidationErrors(trailerValidationDef),
    isReadyToRender: false,
    carrierOptions: [],
    carrierSearchOptions: [],
    terminalOptions: [],
    lengthUOMOptions: [],
    volumeUOMOptions: [],
    weightUOMOptions: [],
    productTypeOptions: [],
    loadingTypeOptions: [],
    attributeMetaDataList: [],
    compartmentAttributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    saveEnabled: false,
    selectedCompRow: [],
    expandedRows: [],
    trailerKPIList:[],
    hazardousEnabled: false,
    hazardousTankerCategoryOptions: [],
    maxNumberOfCompartments: 12,
    showAuthenticationLayout: false,
    tempTrailer: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      //this.getTrailer(isNewTrailer);
      this.getHazardousLookup();
      this.getCarrierList(this.props.selectedShareholder);
      this.getUOMList();
      this.getProductTypes();
      this.getLoadingTypes();
      let isNewTrailer = false;
      if (this.props.selectedRow.Common_Code === undefined) isNewTrailer = true;
      this.getAttributes(isNewTrailer);
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on componentDidMount",
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
        "TrailerDetailsComposite:Error occured on getHazardousLookup",
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
      "TrailerDetailsComposite:Error occured on getHazardousCategories",
      error
    );
  }
  terminalSelectionChange(selectedTerminals) {
    try {
      if (Array.isArray(selectedTerminals)) {
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

        var modTrailer = lodash.cloneDeep(this.state.modTrailer);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.forEach(function (attributeMetaData) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modTrailer.Attributes.find(
                  (trailerAttribute) => {
                    return trailerAttribute.TerminalCode === terminal;
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
        "TrailerDetailsComposite:Error occured on terminalSelectionChange",
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
        Array.isArray(attributeMetaDataList) &&
        attributeMetaDataList.length > 0
      )
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      else {
        var compAttributeMetaDataList = lodash.cloneDeep(
          this.state.compartmentAttributeMetaDataList
        );
        if (
          Array.isArray(compAttributeMetaDataList) &&
          compAttributeMetaDataList.length > 0
        )
          this.formCompartmentAttributes([
            compAttributeMetaDataList[0].TerminalCode,
          ]);
      }
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.trailer.Code !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getTrailer(true);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes(isNewTrailer) {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [trailerAttributeEntity, trailerCompAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.TRAILER
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.TRAILER
                ),
              compartmentAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.TRAILERCOMPARTMENT
              ),
            },
            () => this.getTrailer(isNewTrailer)
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  formCompartmentAttributes(selectedTerminals) {
    try {
      let attributes = lodash.cloneDeep(
        this.state.compartmentAttributeMetaDataList
      );

      attributes = attributes.filter(function (attTerminal) {
        return selectedTerminals.some(function (selTerminal) {
          return attTerminal.TerminalCode === selTerminal;
        });
      });
      let modTrailer = lodash.cloneDeep(this.state.modTrailer);

      modTrailer.Compartments.forEach((comp) => {
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
      this.setState({ modTrailer });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error in forming Compartment Attributes",
        error
      );
    }
  }

  fillAttributeDetails(modTrailer, attributeList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);

      modTrailer.Attributes = Utilities.fillAttributeDetails(attributeList);

      // For Compartment Attributes
      modTrailer.Compartments.forEach((comp) => {
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesDatatypeConversion(
              comp.AttributesforUI
            );
        let selectedTerminals = [];
        if (this.props.userDetails.EntityResult.IsEnterpriseNode)
          selectedTerminals = lodash.cloneDeep(modTrailer.TerminalCodes);
        else {
          var compAttributeMetaDataList = lodash.cloneDeep(
            this.state.compartmentAttributeMetaDataList
          );
          if (compAttributeMetaDataList.length > 0)
            selectedTerminals = [compAttributeMetaDataList[0].TerminalCode];
        }
        let terminalAttributes = [];
        comp.Attributes = [];
        if (selectedTerminals !== null && selectedTerminals !== undefined && selectedTerminals.length > 0) {
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
            //})
            //comp.Attributes.push(attribute);
          });
          if (
            attribute.ListOfAttributeData !== null &&
            attribute.ListOfAttributeData !== undefined &&
            attribute.ListOfAttributeData.length > 0
          )
            comp.Attributes.push(attribute);
        });
      }

      });
      this.setState({ modTrailer });
      return modTrailer;
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on fillAttributeDetails",
        error
      );
    }
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

            //this.setState({ carrierOptions });
          }
        } else {
          console.log("Error in GetCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getCarrierSearchOptions() {
    let carrierSearchOptions = lodash.cloneDeep(
      this.state.carrierSearchOptions
    );
    let modCarrierCode = this.state.modTrailer.CarrierCompanyCode;
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

  getTrailer(isNewTrailer) {
    if (isNewTrailer) {
      let terminalOptions = [];
      emptyTrailer.WeightUOM =
        this.props.userDetails.EntityResult.PageAttibutes.DefaultUOMS.MassUOM;
      this.handleResetAttributeValidationError();
      this.setState(
        {
          trailer: lodash.cloneDeep(emptyTrailer),
          modTrailer: lodash.cloneDeep(emptyTrailer),
          isReadyToRender: true,
          terminalOptions,
          modAttributeMetaDataList: [],
          trailerKPIList:[],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTrailer
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
        //() => this.getOtherValues(null)
      );
      return;
    }

    let keyCode = [
      {
        key: KeyCodes.trailerCode,
        value:
          this.props.selectedRow.Common_Code === undefined
            ? this.state.modTrailer.Code
            : this.props.selectedRow.Common_Code,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetTrailer,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            // console.log("Trailer", result.EntityResult);
            // result.EntityResult.MaxLoadableWeight =
            //   result.EntityResult.MaxLoadableWeight +
            //   result.EntityResult.TareWeight;
            result.EntityResult.MaxLoadableWeight_UI =
              result.EntityResult.MaxLoadableWeight +
              result.EntityResult.TareWeight;
            if (
              result.EntityResult.Compartments !== null &&
              result.EntityResult.Compartments.length > 0
            )
              result.EntityResult.Compartments =
                result.EntityResult.Compartments.sort(
                  (a, b) =>
                    a.CompartmentSeqNoInTrailer - b.CompartmentSeqNoInTrailer
                );
          }
          this.setState(
            {
              isReadyToRender: true,
              trailer: lodash.cloneDeep(result.EntityResult),
              modTrailer: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnTrailer
              ),
            },
            () => {
              this.getTerminalsForCarrier(
                result.EntityResult.CarrierCompanyCode
              );
              this.getKPIList(result.EntityResult.ShareholderCode, result.EntityResult.TrailerCode);
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
        } else {
          emptyTrailer.ShareholderCode = this.props.selectedShareholder;
          emptyTrailer.TrailerType = Constants.TrailerType.NON_RIGID_TRAILER;
          this.setState({
            modTrailer: lodash.cloneDeep(emptyTrailer),
            trailer: lodash.cloneDeep(emptyTrailer),
            isReadyToRender: true,
          });
          console.log("Error in GetTrailer:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Trailer:", error);
      });
  }

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
        "TrailerDetailsComposite:Error occured on handleCarrierSearchChange",
        error
      );
    }
  };

  handleChange = (propertyName, data) => {
    try {
      let modTrailer = { ...this.state.modTrailer };
      if (propertyName === "CarrierCompanyCode") {
        this.handleCarrierChange(data);
      }
      modTrailer[propertyName] = data;

      const validationErrors = { ...this.state.validationErrors };
      if (modTrailer.Active === this.state.trailer.Active) {
        if (
          this.state.trailer.Remarks === modTrailer.Remarks ||
          modTrailer.Remarks === ""
        ) {
          validationErrors.Remarks = "";
        }
        if (modTrailer.Remarks === "")
          modTrailer.Remarks = this.state.trailer.Remarks;
      }
      if (propertyName === "Active") {
        if (modTrailer.Active !== this.state.trailer.Active) {
          modTrailer.Remarks = "";
        }
      }

      if (trailerValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          trailerValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modTrailer }, () => {
        if (propertyName === "TerminalCodes") {
          this.terminalSelectionChange(data);
        }
      });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleRowSelectionChange = (compRow) => {
    this.setState({ selectedCompRow: compRow });
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modTrailer = lodash.cloneDeep(this.state.modTrailer);
    if (cellData.field === "Description") {
      modTrailer.Compartments[cellData.rowIndex][cellData.field] = newVal;
    }
    if (cellData.field === "Capacity") {
      if (isNaN(parseFloat(newVal))) {
        newVal = "";
      }
      modTrailer.Compartments[cellData.rowIndex][cellData.field] = newVal;
    }
    if (cellData.field === "UOM") {
      modTrailer.Compartments.forEach((comp) => {
        comp.UOM = newVal;
      });
    }

    this.toggleExpand(modTrailer.Compartments[cellData.rowIndex], true, true);

    this.setState({ modTrailer });
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
      this.setState({ modAttributeMetaDataList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleCompAttributeCellDataEdit = (compAttribute, value) => {
    let modTrailer = lodash.cloneDeep(this.state.modTrailer);
    let compIndex = modTrailer.Compartments.findIndex(
      (item) =>
        item.CompartmentSeqNoInTrailer === compAttribute.rowData.compSequenceNo
    );
    if (compIndex >= 0)
      modTrailer.Compartments[compIndex].AttributesforUI[
        // compAttribute.rowIndex
        compAttribute.rowData.SeqNumber - 1
      ].AttributeValue = value;
    this.setState({ modTrailer });
    if (compIndex >= 0)
      this.toggleExpand(modTrailer.Compartments[compIndex], true, true);
  };

  handleAllTerminalsChange = (checked) => {
    try {
      let modTrailer = lodash.cloneDeep(this.state.modTrailer);
      let terminalOptions = [...this.state.terminalOptions];
      if (checked) modTrailer.TerminalCodes = terminalOptions;
      else modTrailer.TerminalCodes = [];

      this.setState({ modTrailer }, () =>
        this.terminalSelectionChange(modTrailer.TerminalCodes)
      );
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on handleAllTerminalsChange",
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
        let modTrailer = lodash.cloneDeep(this.state.modTrailer);

        if (modTrailer.Compartments !== null) {
          if (modTrailer.Compartments.length > 0)
            newComp.UOM = modTrailer.Compartments[0].UOM;

          let seqno = 1;
          modTrailer.Compartments.forEach((com) => {
            com.CompartmentSeqNoInTrailer = seqno;
            ++seqno;
          });
          newComp.CompartmentSeqNoInTrailer =
            modTrailer.Compartments.length + 1;
          modTrailer.Compartments.push(newComp);
        }

        this.setState(
          {
            modTrailer,
            selectedCompRow: [],
          },
          () => {
            if (
              this.props.userDetails.EntityResult.IsEnterpriseNode === false
            ) {
              var attributeMetaDataList = lodash.cloneDeep(
                this.state.compartmentAttributeMetaDataList
              );
              if (attributeMetaDataList.length > 0)
                this.formCompartmentAttributes([
                  attributeMetaDataList[0].TerminalCode,
                ]);
            } else this.formCompartmentAttributes(modTrailer.TerminalCodes);
          }
        );
        // }
      } catch (error) {
        console.log(
          "TrailerDetailsComposite:Error occured on handleAddCompartment",
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
          if (this.state.modTrailer.Compartments.length > 0) {
            let modTrailer = lodash.cloneDeep(this.state.modTrailer);

            this.state.selectedCompRow.forEach((obj, index) => {
              modTrailer.Compartments = modTrailer.Compartments.filter(
                (com, cindex) => {
                  return (
                    com.CompartmentSeqNoInTrailer !==
                    obj.CompartmentSeqNoInTrailer
                  );
                }
              );
            });

            let seqno = 1;
            modTrailer.Compartments.forEach((com) => {
              com.CompartmentSeqNoInTrailer = seqno;
              ++seqno;
            });

            this.setState({ modTrailer });
          }
        }

        this.setState({ selectedCompRow: [] });
      } catch (error) {
        console.log(
          "TrailerDetailsComposite:Error occured on handleDeleteCompartment",
          error
        );
      }
    }
  };

  handleCarrierChange = (carrier) => {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      this.getTerminalsForCarrier(carrier);
    } else {
      var modTrailer = lodash.cloneDeep(this.state.modTrailer);
      modTrailer.CarrierCompanyCode = carrier;
      var terminalCodes = [];
      modTrailer.TerminalCodes = [];
      this.setState({ terminalCodes, modTrailer });
    }
    if (trailerValidationDef["CarrierCompanyCode"] !== undefined) {
      const validationErrors = { ...this.state.validationErrors };
      validationErrors["CarrierCompanyCode"] = Utilities.validateField(
        trailerValidationDef["CarrierCompanyCode"],
        carrier
      );

      this.setState({ validationErrors });
    }
  };

  getTerminalsForCarrier(carrier) {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
      const modTrailer = lodash.cloneDeep(this.state.modTrailer);
      let terminalOptions = [...this.state.terminalOptions];
      modTrailer.CarrierCompanyCode = carrier;

      try {
        if (carrier === undefined) {
          terminalOptions = [];
          modTrailer.TerminalCodes = [];
          this.setState({ terminalOptions, modTrailer }, () =>
            this.formCompartmentAttributes([])
          );
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
            }
            let trailer = { ...this.state.trailer };
            if (
              trailer.Code === undefined ||
              trailer.Code === "" ||
              trailer.Code === null
            ) {
              if (terminalOptions.length === 1) {
                modTrailer.TerminalCodes = [...terminalOptions];
                //this.terminalSelectionChange(modTrailer.TerminalCodes);
              } else {
                modTrailer.TerminalCodes = [];
                //this.terminalSelectionChange([]);
              }
            }

            if (Array.isArray(modTrailer.TerminalCodes)) {
              modTrailer.TerminalCodes = terminalOptions.filter((x) =>
                modTrailer.TerminalCodes.includes(x)
              );
            }
            this.setState({ modTrailer }, () =>
              //this.formCompartmentAttributes());
              this.terminalSelectionChange(modTrailer.TerminalCodes)
            );
          })
          .catch((error) => {
            terminalOptions = [];
            modTrailer.TerminalCodes = [];
            this.setState({ terminalOptions, modTrailer }, () =>
              this.formCompartmentAttributes([])
            );
            console.log("Error while getting Carrier:", error, carrier);
            //throw error;
          });
      } catch (error) {
        terminalOptions = [];
        modTrailer.TerminalCodes = [];
        this.setState({ terminalOptions, modTrailer }, () =>
          this.formCompartmentAttributes([])
        );
        console.log(
          "TrailerDetailsComposite:Error occured on handleCarrierChange",
          error
        );
      }
    } else {
      this.formCompartmentAttributes([]);
    }
  }

  fillDetails() {
    try {
      let modTrailer = lodash.cloneDeep(this.state.modTrailer);
      modTrailer.ShareholderCode = this.props.selectedShareholder;
      modTrailer.TrailerType = Constants.TrailerType.NON_RIGID_TRAILER;
      modTrailer.TransportationType = Constants.TransportationType.ROAD;
      modTrailer.Compartments.forEach((comp) => {
        comp.TrailerCode = modTrailer.Code;
        comp.ShareholderCode = modTrailer.ShareholderCode;
        comp.CarrierCompanyCode = modTrailer.CarrierCompanyCode;
        if (comp.Capacity !== null && comp.Capacity !== "")
          comp.Capacity = comp.Capacity.toLocaleString();
        if (comp.Code === null || comp.Code === "") {
          comp.Code = Utilities.generateCompartmentCode(
            modTrailer.Compartments
          ).toString();
        }
        if (comp.AttributesforUI !== undefined && comp.AttributesforUI != null)
          comp.AttributesforUI =
            Utilities.compartmentAttributesConverttoLocaleString(
              comp.AttributesforUI
            );
      });

      if (modTrailer.Height === "") modTrailer.Height = null;
      if (modTrailer.Length === "") modTrailer.Length = null;
      if (modTrailer.Width === "") modTrailer.Width = null;
      if (modTrailer.TareWeight !== null && modTrailer.TareWeight !== "")
        modTrailer.TareWeight = modTrailer.TareWeight.toLocaleString();
      if (
        modTrailer.MaxLoadableWeight_UI !== null &&
        modTrailer.MaxLoadableWeight_UI !== ""
      )
        modTrailer.MaxLoadableWeight =
          modTrailer.MaxLoadableWeight_UI.toLocaleString();
      if (modTrailer.Height !== null && modTrailer.Height !== "")
        modTrailer.Height = modTrailer.Height.toLocaleString();
      if (modTrailer.Length !== null && modTrailer.Length !== "")
        modTrailer.Length = modTrailer.Length.toLocaleString();
      if (modTrailer.Width !== null && modTrailer.Width !== "")
        modTrailer.Width = modTrailer.Width.toLocaleString();

      return modTrailer;
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on fillDetails",
        error
      );
    }
  }

  convertStringtoDecimal(modTrailer, attributeList) {
    try {
      modTrailer.TareWeight = Utilities.convertStringtoDecimal(
        modTrailer.TareWeight
      );

      if (modTrailer.Height !== null && modTrailer.Height !== "") {
        modTrailer.Height = Utilities.convertStringtoDecimal(modTrailer.Height);
      }
      if (modTrailer.Length !== null && modTrailer.Length !== "") {
        modTrailer.Length = Utilities.convertStringtoDecimal(modTrailer.Length);
      }
      if (modTrailer.Width !== null && modTrailer.Width !== "") {
        modTrailer.Width = Utilities.convertStringtoDecimal(modTrailer.Width);
      }

      modTrailer.MaxLoadableWeight = parseFloat(
        Utilities.convertStringtoDecimal(modTrailer.MaxLoadableWeight_UI) -
          modTrailer.TareWeight
      );

      modTrailer.Compartments.forEach((com) => {
        com.Capacity = Utilities.convertStringtoDecimal(com.Capacity);
      });
      modTrailer = this.fillAttributeDetails(modTrailer, attributeList);
      return modTrailer;
    } catch (err) {
      console.log("convertStringtoDecimal on trailer details", err);
    }
  }

  saveTrailer = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempTrailer = lodash.cloneDeep(this.state.tempTrailer);

      this.state.trailer.Code === ""
        ? this.createTrailer(tempTrailer)
        : this.updateTrailer(tempTrailer);
    } catch (error) {
      console.log("TrailersComposite : Error in saveTrailer");
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
        let modTrailer = this.fillDetails();
        let attributeList = Utilities.attributesConverttoLocaleString(
          this.state.modAttributeMetaDataList
        );
        if (this.validateSave(modTrailer, attributeList)) {
          modTrailer = this.convertStringtoDecimal(modTrailer, attributeList);
          modTrailer = Utilities.convertDatesToString(
            DateFieldsInEntities.DatesInEntity.Trailer,
            modTrailer
          );
          let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempTrailer = lodash.cloneDeep(modTrailer);
        this.setState({ showAuthenticationLayout, tempTrailer }, () => {
          if (showAuthenticationLayout === false) {
            this.saveTrailer();
          }
      });
        } else {
          this.setState({ saveEnabled: true });
        }
      }
    } catch (error) {
      console.log("TrailerDetailsComposite:Error occured on handleSave", error);
    }
  };

  validateSave(modTrailer, attributeList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(trailerValidationDef).forEach(function (key) {
      if (modTrailer[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          trailerValidationDef[key],
          modTrailer[key]
        );
    });

    if (modTrailer.Active !== this.state.trailer.Active) {
      if (modTrailer.Remarks === "") {
        validationErrors["Remarks"] = "Trailer_RemarksRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "TrailerDetails_SavedStatus",
      messageResultDetails: [],
    };

    if (
      (modTrailer.Height !== null ||
        modTrailer.Width != null ||
        modTrailer.Length !== null) &&
      modTrailer.LWHUOM === null
    ) {
      notification.messageResultDetails.push({
        keyFields: ["Trailer_Code"],
        keyValues: [modTrailer.Code],
        isSuccess: false,
        errorMessage: "Trailer_UOMDimensionRequired",
      });
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

    let returnValue = true;
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

    if (modTrailer.Compartments.length > 0) {
      if (modTrailer.Compartments.length <= this.state.maxNumberOfCompartments) {
         modTrailer.Compartments.forEach((com) => {
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
        keyFields: ["Trailer_Code"],
        keyValues: [modTrailer.Code],
        isSuccess: false,
        errorMessage: "Compartment_limit_Exceeded",
      });
      }
     
    } else {
      notification.messageResultDetails.push({
        keyFields: ["Trailer_Code"],
        keyValues: [modTrailer.Code],
        isSuccess: false,
        errorMessage: "TrailerInfo_CompartmentRequired",
      });
    }

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modTrailer, "update", notification);
      return false;
    }

    return returnValue;
  }

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
        "TrailerDetailsComposite:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  createTrailer(modTrailer) {
    let keyCode = [
      {
        key: KeyCodes.trailerCode,
        value: modTrailer.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: keyCode,
      Entity: modTrailer,
    };

    let notification = {
      messageType: "critical",
      message: "TrailerDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Trailer_Code"],
          keyValues: [modTrailer.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateTrailer,
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
            // trailer: lodash.cloneDeep(modTrailer),
            // modTrailer: lodash.cloneDeep(modTrailer),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTrailer
            ),
            showAuthenticationLayout: false,
          });

          this.getTrailer(false);
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnTrailer
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateTrailer:", result.ErrorList);
        }
        //console.log(notification);
        this.props.onSaved(this.state.modTrailer, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnTrailer
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTrailer, "add", notification);
      });
  }
  updateTrailer(modTrailer) {
    let keyCode = [
      {
        key: KeyCodes.trailerCode,
        value: modTrailer.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: keyCode,
      Entity: modTrailer,
    };

    let notification = {
      messageType: "critical",
      message: "TrailerDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Trailer_Code"],
          keyValues: [modTrailer.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateTrailer,
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
            // trailer: lodash.cloneDeep(modTrailer),
            // modTrailer: lodash.cloneDeep(modTrailer),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTrailer
            ),
            showAuthenticationLayout: false,
          });
          this.getTrailer(false);
        } else {
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTrailer
            ),
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateTrailer:", result.ErrorList);
        }
        //console.log(notification);
        this.props.onSaved(this.state.modTrailer, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modTrailer, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnTrailer
          ),
          showAuthenticationLayout: false,
        });
      });
  }
  handleReset = () => {
    try {
      var modTrailer = lodash.cloneDeep(this.state.trailer);
      this.setState(
        {
          modTrailer,
          modAttributeMetaDataList: [],
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(modTrailer.TerminalCodes);
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );

      if (this.state.trailer.Code === "") {
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
        "TrailerDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };
  //Get KPI for Trailer details
  getKPIList(shareholder,trailerCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiTrailerDetail,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "TrailerCode", value: trailerCode }],
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
              trailerKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ trailerKPIList: [] });
            console.log("Error in Trailer KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting trailer KPIList:", error);
        });
    }
  }
  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationErrors = { ...this.state.validationErrors };
      var modTrailer = lodash.cloneDeep(this.state.modTrailer);
      validationErrors[propertyName] = error;
      modTrailer[propertyName] = value;
      this.setState({ validationErrors, modTrailer });
    } catch (error) {
      console.log(
        "TrailerDetailsComposite:Error occured on handleDateTextChange",
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
      //carriers: this.state.carrierOptions,
      carriers: this.getCarrierSearchOptions(),
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
        fieldName: "Trailer_LastUpdated",
        fieldValue:
          new Date(this.state.modTrailer.LastUpdateTime).toLocaleDateString() +
          " " +
          new Date(this.state.modTrailer.LastUpdateTime).toLocaleTimeString(),
      },
      {
        fieldName: "Trailer_LastActiveTime",
        fieldValue:
          this.state.modTrailer.LastActiveTime !== undefined &&
          this.state.modTrailer.LastActiveTime !== null
            ? new Date(
                this.state.modTrailer.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modTrailer.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "Trailer_CreateTime",
        fieldValue:
          new Date(this.state.modTrailer.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modTrailer.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.trailer.Code}
            newEntityName="Trailer_NewTrailer"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.trailerKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <TrailerDetails
            trailer={this.state.trailer}
            modTrailer={this.state.modTrailer}
            validationErrors={this.state.validationErrors}
            attributeValidationErrors={this.state.attributeValidationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            selectedCompRow={this.state.selectedCompRow}
            handleRowSelectionChange={this.handleRowSelectionChange}
            onCarrierSearchChange={this.handleCarrierSearchChange}
            handleCellDataEdit={this.handleCellDataEdit}
            onAttributeDataChange={this.handleAttributeDataChange}
            handleCompAttributeCellDataEdit={
              this.handleCompAttributeCellDataEdit
            }
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            handleAddCompartment={this.handleAddCompartment}
            handleDeleteCompartment={this.handleDeleteCompartment}
            toggleExpand={this.toggleExpand}
            expandedRows={this.state.expandedRows}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            compartmentDetailsPageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
            onDateTextChange={this.handleDateTextChange}
            hazardousEnabled={this.state.hazardousEnabled}
          ></TrailerDetails>
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
              this.state.trailer.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnTrailer}
            handleOperation={this.saveTrailer}
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

export default connect(mapStateToProps)(TrailerDetailsComposite);
