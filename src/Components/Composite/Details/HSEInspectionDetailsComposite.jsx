import React, { Component } from "react";
import { HSEInspectionDetails } from "../../UIBase/Details/HSEInspectionDetails";

import { HSEInspectionValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyHSEInspection } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "./../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "./../../../JS/KeyCodes";
import { functionGroups, fnHSEInspection,  fnRailHSEInspection, fnMarineHSEInspection, fnPipelineHSEInspection, fnRoadHSEInspection } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { Button, Modal, FileDrop } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import { hseInspectionShipmentRigidTruckAttributeEntity ,
  hseInspectionShipmentTrailerAttributeEntity  ,              
  hseInspectionShipmentPrimeMoverAttributeEntity ,            
  hseInspectionShipmentNonFillingVehicleAttributeEntity  ,    
  hseInspectionMarineShipmentBargeAttributeEntity ,           
  hseInspectionMarineShipmentShipAttributeEntity  ,           
  hseInspectionShipmentRailWagonAttributeEntity ,             
  hseInspectionShipmentPipelineAttributeEntity ,              
  hseInspectionReceiptRigidTruckAttributeEntity ,             
  hseInspectionReceiptTrailerAttributeEntity ,                
  hseInspectionReceiptPrimeMoverAttributeEntity ,             
  hseInspectionReceiptNonFillingVehicleAttributeEntity,       
  hseInspectionMarineReceiptBargeAttributeEntity,             
  hseInspectionMarineReceiptShipAttributeEntity ,             
  hseInspectionReceiptRailWagonAttributeEntity ,              
  hseInspectionReceiptPipelineAttributeEntity   } from "../../../JS/AttributeEntity";

  import UserAuthenticationLayout from "../Common/UserAuthentication";

class HSEInspectionDetailsComposite extends Component {
  cardReaderTimer = null;

  state = {
    HSEInspection: lodash.cloneDeep(emptyHSEInspection),
    modHSEInspection: {},
    associations: [],
    modAssociations: [],
    validationErrors: Utilities.getInitialValidationErrors(
      HSEInspectionValidationDef
    ),
    isReadyToRender: false,
    cardReaderMap: {},
    cardReaderCodeOptions: [],
    cardReader: "",

    vehicleCodeOptions: [],
    vehicleTypeOptions: [],
    transactionTypeOptions: [],
    locationCodeOptions: [],
    locationTypeMap: {},
    dispatchReceiptCodeMap: {},
    dispatchReceiptCodeOptions: [],
    dispatchReceiptCodeSearchOptions: [],
    roadTransportationUnitOptions: [],
    roadTransportationUnit: "",
    railWagonCodeOptions: [],
    railWagonCarrierCompanyMap: {},
    railWagon: "",
    dispatchReceiptLabel: "",
    isManualEntry: false,
    saveEnabled: false,
    passFailAllEnabled: false,
    displayTransportationUnit: false,
    displayOverAllInspection: false,
    modalOpen: {
      pass: false,
      fail: false,
      passAll: false,
      failAll: false,
      attachments: false,
    },
    attachments: [],
    addFileEnabled: true,
    attachmentFileSetting: {
      FileTypesAllowedToUpload: [
        ".jpeg",
        ".jpg",
        ".pdf",
        ".png",
        ".gif",
        ".xlsx",
        ".xls",
        ".docx",
        ".doc",
        ".ppt",
        ".pptx",
      ],
      MaximumFileSize: 2048,
      NoOfFilesAllowedToUpload: 5,
    },
    isOverAllInspection: false,
    ReadStartTime: null,
    vehicleCodeSearchOptions: [],

    modAttributeList: [],
   // selectedAttributeList: [],
    attributeValidationErrors: [],
    hseUnitInspectionType: "",

    showAuthenticationLayout: false,
    showUpdateAuthenticationLayout: false,
    tempHSEInspection: {},
    tempHSEInspectionStatus: 0,
    tempIsOverAllInspection: false
  };

  componentWillReceiveProps(nextProps) {
    try {
      this.getHSEInspectionResult(nextProps.selectedRow);
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
    
      this.setLookUpData(this.props.lookUpData);
      this.getTransactionTypes();
      if (
        this.props.transportationType !== Constants.TransportationType.PIPELINE
      ) {
        this.getLocations();
      }
      //this.getAttributes(this.props.selectedRow);
      this.getHSEInspectionResult(this.props.selectedRow);
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on componentDidMount",
        error
      );
    }
  }

getAttributeEntityKey()
{
  let attributeKey="";
let modHSEInspection= lodash.cloneDeep(this.state.modHSEInspection);
if(modHSEInspection===undefined)
return attributeKey;
if(modHSEInspection.TransportationType.toUpperCase()==="ROAD")
{
  const transportationUnit = this.state.roadTransportationUnit.split(" - ");
  if(modHSEInspection.TransactionType.toUpperCase()==="SHIPMENT") 
  {
    if(transportationUnit.length===0)
    return attributeKey;
    let tranUnit= transportationUnit[0];

    if(tranUnit==='')
    tranUnit=modHSEInspection.TransportationUnit;
   
    if(this.state.hseUnitInspectionType === "RIGID_TRUCK" || tranUnit=== "RIGID_TRUCK") 
    attributeKey=hseInspectionShipmentRigidTruckAttributeEntity;
    else if(tranUnit=== "TRAILER")
    attributeKey=hseInspectionShipmentTrailerAttributeEntity;
    else if(tranUnit=== "PRIMEMOVER")
    attributeKey=hseInspectionShipmentPrimeMoverAttributeEntity;
    else if(tranUnit=== "NON_FILLING_VEHICLE")
    attributeKey=hseInspectionShipmentNonFillingVehicleAttributeEntity;
     
  }
  else if(modHSEInspection.TransactionType.toUpperCase()==="RECEIPT")
  {
    if(transportationUnit.length===0)
    return attributeKey;
    let tranUnit= transportationUnit[0];
    
    if(tranUnit==='')
    tranUnit=modHSEInspection.TransportationUnit;

    if(this.state.hseUnitInspectionType === "RIGID_TRUCK" || tranUnit=== "RIGID_TRUCK") 
    attributeKey=hseInspectionReceiptRigidTruckAttributeEntity; 
    else if(tranUnit=== "TRAILER")
    attributeKey=hseInspectionReceiptTrailerAttributeEntity;
    else if(tranUnit=== "PRIMEMOVER")
    attributeKey=hseInspectionReceiptPrimeMoverAttributeEntity
    else if(tranUnit=== "NON_FILLING_VEHICLE")
    attributeKey=hseInspectionReceiptNonFillingVehicleAttributeEntity
     
  }
}
else if(modHSEInspection.TransportationType.toUpperCase()==="MARINE")
{
  if(modHSEInspection.TransactionType.toUpperCase()==="SHIPMENT" || modHSEInspection.TransactionType.toUpperCase()==="DISPATCH")
  {
    if(this.state.hseUnitInspectionType==="BARGE" || modHSEInspection.TransportationUnitType==="BARGE" )
    attributeKey=hseInspectionMarineShipmentBargeAttributeEntity;
    else  if(this.state.hseUnitInspectionType==="SHIP" || modHSEInspection.TransportationUnitType==="SHIP")
    attributeKey=hseInspectionMarineShipmentShipAttributeEntity;
  }
  else if(modHSEInspection.TransactionType.toUpperCase()==="RECEIPT")
  {
    if(this.state.hseUnitInspectionType==="BARGE" || modHSEInspection.TransportationUnitType==="BARGE" )
    attributeKey=hseInspectionMarineReceiptBargeAttributeEntity;
    else  if(this.state.hseUnitInspectionType==="SHIP" || modHSEInspection.TransportationUnitType==="SHIP")
    attributeKey=hseInspectionMarineReceiptShipAttributeEntity;
  }
}
else if(modHSEInspection.TransportationType.toUpperCase()==="RAIL")
{
  if(modHSEInspection.TransactionType.toUpperCase()==="SHIPMENT" || modHSEInspection.TransactionType.toUpperCase()==="DISPATCH")
  {
    attributeKey=hseInspectionShipmentRailWagonAttributeEntity;
  }
  else if(modHSEInspection.TransactionType.toUpperCase()==="RECEIPT")
  {
    attributeKey=hseInspectionReceiptRailWagonAttributeEntity;
  }
}
else if(modHSEInspection.TransportationType.toUpperCase()==="PIPELINE")
{
  if(modHSEInspection.TransactionType.toUpperCase()==="SHIPMENT" || modHSEInspection.TransactionType.toUpperCase()==="DISPATCH")
  {
    attributeKey=hseInspectionShipmentPipelineAttributeEntity;
  }
  else if(modHSEInspection.TransactionType.toUpperCase()==="RECEIPT")
  {
    attributeKey=hseInspectionReceiptPipelineAttributeEntity;
  }
}
return attributeKey;
}

  getAttributesMetaData() {
    try {
     
      this.setState({
        modAttributeList: [],
      })

      let attributeEntityKey="";

  attributeEntityKey=this.getAttributeEntityKey()
  if( attributeEntityKey==="")
  {
   
  return;
  }
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [attributeEntityKey],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
           
          let modHSEInspection= lodash.cloneDeep(this.state.modHSEInspection);
          let modAttributeList=[];

          if(attributeEntityKey===hseInspectionShipmentRigidTruckAttributeEntity )
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONSHIPMENTRIGIDTRUCK);
          else if(attributeEntityKey===hseInspectionShipmentTrailerAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONSHIPMENTTRAILER);
          else if(attributeEntityKey===hseInspectionShipmentPrimeMoverAttributeEntity )
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONSHIPMENTPRIMEMOVER);
            else if(attributeEntityKey===hseInspectionShipmentNonFillingVehicleAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONSHIPMENTNONFILLINGVEHICLE);
            else if(attributeEntityKey===hseInspectionMarineShipmentBargeAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONMARINESHIPMENTBARGE);
            else if(attributeEntityKey===hseInspectionMarineShipmentShipAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONMARINESHIPMENTSHIP);
            else if(attributeEntityKey===hseInspectionShipmentRailWagonAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONSHIPMENTRAILWAGON);
            else if(attributeEntityKey===hseInspectionShipmentPipelineAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONSHIPMENTPIPELINE);
            else if(attributeEntityKey===hseInspectionReceiptRigidTruckAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONRECEIPTRIGIDTRUCK);
            else if(attributeEntityKey===hseInspectionReceiptTrailerAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONRECEIPTTRAILER);
            else if(attributeEntityKey===hseInspectionReceiptPrimeMoverAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONRECEIPTPRIMEMOVER);
            else if(attributeEntityKey===hseInspectionReceiptNonFillingVehicleAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONRECEIPTNONFILLINGVEHICLE);
            else if(attributeEntityKey===hseInspectionMarineReceiptBargeAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONMARINERECEIPTBARGE);
            else if(attributeEntityKey===hseInspectionMarineReceiptShipAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONMARINERECEIPTSHIP);
            else if(attributeEntityKey===hseInspectionReceiptRailWagonAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONRECEIPTRAILWAGON);
            else if(attributeEntityKey===hseInspectionReceiptPipelineAttributeEntity)
            modAttributeList= lodash.cloneDeep(result.EntityResult.HSEINSPECTIONRECEIPTPIPELINE);

          if(modHSEInspection.Attributes.length>0)
          {
            modHSEInspection.Attributes[0].ListOfAttributeData.forEach((att) => {
             
              if (att !== undefined) {
                if(modAttributeList.length>0)
                modAttributeList[0].attributeMetaDataList.forEach(function (
                  attributeMetaData
                ) {
                  if( att.AttributeCode === attributeMetaData.Code)
                  attributeMetaData.DefaultValue=att.AttributeValue;
               
                });
              }
            })

          }
          
          

          if(attributeEntityKey===hseInspectionShipmentRigidTruckAttributeEntity )
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONSHIPMENTRIGIDTRUCK
                ),
            
          });
        else if(attributeEntityKey===hseInspectionShipmentTrailerAttributeEntity)
        this.setState({
          modAttributeList: modAttributeList,
          attributeValidationErrors:
              Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.HSEINSPECTIONSHIPMENTTRAILER
              ),
          
        });
          
        else if(attributeEntityKey===hseInspectionShipmentPrimeMoverAttributeEntity )
        this.setState({
          modAttributeList: modAttributeList,
          attributeValidationErrors:
              Utilities.getAttributeInitialValidationErrors(
                result.EntityResult.HSEINSPECTIONSHIPMENTPRIMEMOVER
              ),
          
        });
          
          else if(attributeEntityKey===hseInspectionShipmentNonFillingVehicleAttributeEntity)
          
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONSHIPMENTNONFILLINGVEHICLE
                ),
            
          });
          else if(attributeEntityKey===hseInspectionMarineShipmentBargeAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONMARINESHIPMENTBARGE
                ),
            
          });
         
          else if(attributeEntityKey===hseInspectionMarineShipmentShipAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONMARINESHIPMENTSHIP
                ),
            
          });
          else if(attributeEntityKey===hseInspectionShipmentRailWagonAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONSHIPMENTRAILWAGON
                ),
            
          });
           
          else if(attributeEntityKey===hseInspectionShipmentPipelineAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONSHIPMENTPIPELINE
                ),
            
          });
           
          else if(attributeEntityKey===hseInspectionReceiptRigidTruckAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONRECEIPTRIGIDTRUCK
                ),
            
          });
         
          else if(attributeEntityKey===hseInspectionReceiptTrailerAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONRECEIPTTRAILER
                ),
            
          });
           
          else if(attributeEntityKey===hseInspectionReceiptPrimeMoverAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONRECEIPTPRIMEMOVER
                ),
            
          });
         
          else if(attributeEntityKey===hseInspectionReceiptNonFillingVehicleAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONRECEIPTNONFILLINGVEHICLE
                ),
            
          });
          
          else if(attributeEntityKey===hseInspectionMarineReceiptBargeAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONMARINERECEIPTBARGE
                ),
            
          });
         
          else if(attributeEntityKey===hseInspectionMarineReceiptShipAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONMARINERECEIPTSHIP
                ),
            
          });
          
          else if(attributeEntityKey===hseInspectionReceiptRailWagonAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONRECEIPTRAILWAGON
                ),
            
          });
          
          else if(attributeEntityKey===hseInspectionReceiptPipelineAttributeEntity)
          this.setState({
            modAttributeList: modAttributeList,
            attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.HSEINSPECTIONRECEIPTPIPELINE
                ),
            
          });
           
           

        } else {
          this.setState({
            modAttributeList: []
        
          })
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  updateAttributeInfo(entityAttributeData)
  {
    let modAttributeList=[];
    entityAttributeData.forEach((item) => {
      modAttributeList.push(item);
    });    
    
    return modAttributeList;
  }

  setLookUpData(lookUpData) {
    try {
      const attachmentFileSetting = {};
      const fileTypes =
        lookUpData.FileTypesAllowedToUpload.toLowerCase().split(",");
      for (let i = 0; i < fileTypes.length; i++) {
        fileTypes[i] = "." + fileTypes[i];
      }
      attachmentFileSetting.FileTypesAllowedToUpload = fileTypes;
      attachmentFileSetting.MaximumFileSize = parseInt(
        lookUpData.MaximumFileSize
      );
      if (lookUpData.MaximumFileSize > 1024 * 5) {
        lookUpData.MaximumFileSize = 5120;
      }
      attachmentFileSetting.NoOfFilesAllowedToUpload = parseInt(
        lookUpData.NoOfFilesAllowedToUpload
      );
      this.setState({ attachmentFileSetting });
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on setLookUpData",
        error
      );
    }
  }

  isNodeEnterpriseOrWebortal()
  {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode || this.props.userDetails.EntityResult.IsWebPortalUser) {
     return true;
    } else {
      return false;
    }
  }

  getTransactionTypes() {
    const data =
      this.props.transportationType === Constants.TransportationType.ROAD
        ? {
            shipment: "SHIPMENT",
            receipt: "RECEIPT",
          }
        : {
            shipment: "DISPATCH",
            receipt: "RECEIPT",
          };
    const transactionTypeOptions = [];
    for (let key in data) {
      transactionTypeOptions.push({ text: key, value: data[key] });
    }
    this.setState({ transactionTypeOptions });
  }

  getLocations() {
    axios(
      RestAPIs.GetLocations +
        "?TransportationType=" +
        this.props.transportationType,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          const locationCodeList = [];
          const locationTypeMap = {};
          if (Array.isArray(result.EntityResult.Table)) {
            result.EntityResult.Table.forEach((item) => {
              locationCodeList.push(item.LocationCode);
              locationTypeMap[item.LocationCode] = item.LocationType;
            });
          }
          this.setState({
            locationCodeOptions:
              Utilities.transferListtoOptions(locationCodeList),
            locationTypeMap,
          });
        } else {
          console.log("Error in getLocations: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getLocations",
          error
        );
      });
  }

  getCardReaderLocations(shareholder) {
    axios(
      RestAPIs.GetCardReaderLocations + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult.Table)) {
            const cardReaderMap = {};
            for (let item of result.EntityResult.Table) {
              if (cardReaderMap[item.WB_LocationCode] === undefined) {
                cardReaderMap[item.WB_LocationCode] = [];
              }
              cardReaderMap[item.WB_LocationCode].push(item.PointName);
            }
            this.setState({ cardReaderMap });
          }
        } else {
          console.log("Error in getCardReaderLocations:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting card reader locations:", error);
      });
  }

  mapCardReader(locationCode, validationErrors) {
    validationErrors.TransactionType = "";
    validationErrors.LocationCode = "";
    validationErrors.CardReader = "";
    if (this.state.cardReaderMap[locationCode]) {
      const cardReaderCodeOptions = Utilities.transferListtoOptions(
        this.state.cardReaderMap[locationCode]
      );
      this.setState({
        cardReader: "",
        cardReaderCodeOptions,
      });
    } else {
      this.setState({
        cardReader: "",
        cardReaderCodeOptions: [],
      });
    }
  }

  componentWillUnmount() {
    this.handleCancelDetect();
  }

  handleDetectVehicle = () => {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (
        this.state.modHSEInspection.TransactionType === null ||
        this.state.modHSEInspection.TransactionType === ""
      ) {
        validationErrors.TransactionType = Utilities.validateField(
          HSEInspectionValidationDef.TransactionType,
          this.state.modHSEInspection.TransactionType
        );
      } else {
        validationErrors.TransactionType = "";
      }
      if (
        this.state.modHSEInspection.LocationCode === null ||
        this.state.modHSEInspection.LocationCode === ""
      ) {
        validationErrors.LocationCode = Utilities.validateField(
          HSEInspectionValidationDef.LocationCode,
          this.state.modHSEInspection.LocationCode
        );
      } else {
        validationErrors.LocationCode = "";
      }
      if (this.state.cardReader === null || this.state.cardReader === "") {
        validationErrors.CardReader = Utilities.validateField(
          HSEInspectionValidationDef.CardReader,
          this.state.cardReader
        );
      } else {
        validationErrors.CardReader = "";
      }
      this.setState({ validationErrors });
      if (
        validationErrors.TransactionType !== "" ||
        validationErrors.LocationCode !== "" ||
        validationErrors.CardReader !== ""
      ) {
        return;
      }
      var ReadStartTime = this.state.ReadStartTime;
      ReadStartTime = new Date();
      this.setState({ ReadStartTime: ReadStartTime });
      if (this.cardReaderTimer === null) {
        this.cardReaderTimer = setInterval(() => {
          this.readCardData();
        }, 3000);
      }
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on handleDetectVehicle",
        error
      );
    }
  };

  readCardData() {
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [
        {
          key: KeyCodes.cardReaderCode,
          value: this.state.cardReader,
        },
        {
          key: "ReadStartTime",
          value: this.state.ReadStartTime,
        },
      ],
    };
    axios(
      RestAPIs.ReadCardData,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (
          result.IsSuccess === true &&
          result.EntityResult.CardNumber !== undefined &&
          result.EntityResult.CardNumber !== null
        ) {
          this.handleCancelDetect();
          this.getAccessCard(result.EntityResult.CardNumber);
        }
      })
      .catch((error) => {
        console.log("Error while read card data: ", error);
      });
  }

  getAccessCard(accessCardCode) {
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: [
        {
          key: KeyCodes.accessCardCode,
          value: accessCardCode,
        },
      ],
    };
    axios(
      RestAPIs.GetAccessCard,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.EntityName === "Vehicle" &&
            result.EntityResult.EntityValue !== null &&
            result.EntityResult.EntityValue !== ""
          ) {
            this.handleChange("VehicleCode", result.EntityResult.EntityValue + '['+result.EntityResult.ShareholderCode +']');
            
            // refresh Shipment/Receipt the drop down after vehicle is selected
            this.getRoadShipmentReceiptCodes(this.state.modHSEInspection.TransactionType,result.EntityResult.ShareholderCode,result.EntityResult.EntityValue + '['+result.EntityResult.ShareholderCode +']');
          }
        } else {
          console.log("Error in GetAccessCard:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting AccessCard:", error);
      });
  }

  handleCancelDetect = () => {
    try {
      if (this.cardReaderTimer !== null) {
        clearInterval(this.cardReaderTimer);
        this.cardReaderTimer = null;
      }
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on handleCancelDetect",
        error
      );
    }
  };

  getVehicleCode(shareholder) {
    if(this.props.transportationType===Constants.TransportationType.MARINE)
    {
      axios(
        RestAPIs.GetVehicleCodes +
          "?ShareholderCode=" +
          shareholder +
          "&TransportationType=" +
          this.props.transportationType,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const vehicleCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let vehicleCodeSearchOptions = lodash.cloneDeep(vehicleCodeOptions);
            if (
              vehicleCodeSearchOptions.length > Constants.filteredOptionsCount
            ) {
              vehicleCodeSearchOptions = vehicleCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ vehicleCodeOptions, vehicleCodeSearchOptions });
          }
        } else {
          console.log("Error in getVehicleCodes:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Vessel List:", error);
      });
    }
    else if(this.props.transportationType===Constants.TransportationType.ROAD)
    {

      axios(
        RestAPIs.GetVehiclesForLoggedInUser,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
  
          if (result.IsSuccess === true) {
            var vehArray=[];
            var dict= result.EntityResult;
            for (var sh in dict) {
             
             let vehicleCodes=dict[sh];
             vehicleCodes.forEach((vehCode) =>
              {
              vehArray.push(vehCode+ '[' + sh +']')
             }
             )
             
            }
            const vehicleCodeOptions = Utilities.transferListtoOptions(
              vehArray
            );
            let vehicleCodeSearchOptions = lodash.cloneDeep(vehicleCodeOptions);
            if (
              vehicleCodeSearchOptions.length > Constants.filteredOptionsCount
            ) {
              vehicleCodeSearchOptions = vehicleCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({ vehicleCodeOptions, vehicleCodeSearchOptions });

          } else {
            console.log(
              "HSE inspection:Error in GetVehiclesForLoggedInUser:",
              result.ErrorList
            );
          }
        })
        .catch((error) => {
          console.log(
            "HSE inspection:Error in GetVehiclesForLoggedInUser:",
            error
          );
        });

    }
  }

  getEntityAndShareholder(entitySh)
  {
    let obj = {
      ShareHolderCode: '',
      entityCode: '',
    };

    const arr= entitySh.split(/\[/);

    obj.entityCode= arr[0];

    if(arr.length>1 && arr[1]!== null && arr[1]!=='')
    obj.ShareHolderCode= arr[1].substring(0, arr[1].length - 1); 
    
    if(obj.ShareHolderCode==='')
    obj.ShareHolderCode=this.props.userDetails.EntityResult.PrimaryShareholder;

    return obj;
  }
  
  getVehicleDetail(modHSEInspection, callback) {

    this.setState({
      modAttributeList: [],
      hseUnitInspectionType:""
    })

    let vehicleShareholder = this.getEntityAndShareholder(modHSEInspection.VehicleCode) 

    
    let keyCode = [
      {
        key: KeyCodes.vehicleCode,
        value: vehicleShareholder.entityCode,
      },
      {
        key: KeyCodes.transportationType,
        value: this.props.transportationType,
      },
    ];
    let obj = {
      ShareHolderCode: (modHSEInspection.ShareholderCode===null ||modHSEInspection.ShareholderCode===''  || modHSEInspection.ShareholderCode===undefined )? vehicleShareholder.ShareHolderCode:modHSEInspection.ShareholderCode,
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
        const result = response.data;
       
        if (result.IsSuccess === true) {
          this.setState({
            hseUnitInspectionType:response.data.EntityResult.VehicleType
          })
          callback(result);
        } else {
          console.log("Error in getVehicleDetail:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getVehicleDetail:", error);
      });
  }

  setRoadTransportationUnit(result) {
    const transportationUnitList = [];
    if (
      result.EntityResult.VehicleType ===
      Constants.VehicleType.RigidTruckWithTrailer
    ) {
     
      if (Array.isArray(result.EntityResult.VehicleTrailers)) {
        for (let trailerData of result.EntityResult.VehicleTrailers) {
          if (
            trailerData.Trailer.TrailerType ===
            Constants.TrailerType.RIGID_TRAILER
          ) {
            transportationUnitList.push("RIGID_TRUCK - " + trailerData.TrailerCode);
          }

        }

        for (let trailerData of result.EntityResult.VehicleTrailers) {
           if (
            trailerData.Trailer.TrailerType ===
            Constants.TrailerType.NON_RIGID_TRAILER
          ) {
            transportationUnitList.push("TRAILER - " + trailerData.TrailerCode);
          }
        }
      }
    } else if (
      result.EntityResult.VehicleType ===
      Constants.VehicleType.TractorWithTrailer
    ) {
      if (
        Array.isArray(result.EntityResult.VehiclePrimeMovers) &&
        result.EntityResult.VehiclePrimeMovers.length > 0
      ) {
        transportationUnitList.push(
          "PRIMEMOVER - " +
            result.EntityResult.VehiclePrimeMovers[0].PrimeMoverCode
        );
      }
      if (Array.isArray(result.EntityResult.VehicleTrailers)) {
        for (let trailerData of result.EntityResult.VehicleTrailers) {
          transportationUnitList.push("TRAILER - " + trailerData.TrailerCode);
        }
      }
    }
    this.setState({
      roadTransportationUnitOptions: Utilities.transferListtoOptions(
        transportationUnitList
      ),
      roadTransportationUnit: "",
    });
  }

  getRailWagonDetail(railWagonCode, callback) {
    var keyCode = [
      {
        key: KeyCodes.trailerCode,
        value: railWagonCode,
      },
      {
        key: KeyCodes.transportationType,
        value: Constants.TransportationType.RAIL,
      },
      {
        key: KeyCodes.carrierCode,
        value: this.state.railWagonCarrierCompanyMap[railWagonCode],
      },
    ];
    var obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.trailerCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailWagon,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callback(result.EntityResult);
        }
      })
      .catch((error) => {
        console.log("Error while getting railWagon:", error);
      });
  }

  getRoadShipmentReceiptCodes(transactionType,shareholderCode, vehicleCode )
  {
    
    const obj = {
      TransportationType: this.props.transportationType,
      TransactionType: transactionType,
      ShareholderCode: shareholderCode,
    };
    axios(
      RestAPIs.GetDispatchOrReceiptCodes,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.Table !== undefined &&
            result.EntityResult.Table !== null &&
            result.EntityResult.Table.length > 0
          ) {
            const dispatchReceiptCodeMap = {};
            let dispatchReceiptCodeOptions = [];
            // if (Array.isArray(result.EntityResult.Table)){
            //   dispatchReceiptCodeOptions=result.EntityResult.Table.map((item) => ({ text: item.Code +'[' + obj.ShareholderCode +']',value: item.Code + '[' + obj.ShareholderCode +']' }));
            
            // }
           for (let item of result.EntityResult.Table) {
             // if (item.VehicleCode !== undefined && item.VehicleCode !== null && vehicleCode===item.VehicleCode + '[' + obj.ShareholderCode +']') {
              if (item.VehicleCode !== undefined && item.VehicleCode !== null ) {
               
             if (dispatchReceiptCodeMap[item.VehicleCode+ '[' + obj.ShareholderCode +']'] === undefined) {
                  dispatchReceiptCodeMap[item.VehicleCode+ '[' + obj.ShareholderCode +']'] = [];
                }
                dispatchReceiptCodeMap[item.VehicleCode+ '[' + obj.ShareholderCode +']'].push({
                  text: item.Code+ '[' + obj.ShareholderCode +']',
                  value: item.Code + '[' + obj.ShareholderCode +']',
                });
                if (
                  vehicleCode===item.VehicleCode + '[' + obj.ShareholderCode +']'
                ) {
                  dispatchReceiptCodeOptions.push({
                    text: item.Code + '[' + obj.ShareholderCode +']',
                    value: item.Code + '[' + obj.ShareholderCode +']',
                  });
                }
              }  
            }
            let dispatchReceiptCodeSearchOptions = lodash.cloneDeep(
              dispatchReceiptCodeOptions
            );
            if (
              dispatchReceiptCodeSearchOptions.length >
              Constants.filteredOptionsCount
            ) {
              dispatchReceiptCodeSearchOptions =
                dispatchReceiptCodeSearchOptions.slice(
                  0,
                  Constants.filteredOptionsCount
                );
            }
            this.setState({
              dispatchReceiptCodeMap,
              dispatchReceiptCodeOptions,
              dispatchReceiptCodeSearchOptions,
            });
          } else {
            this.setState({
              dispatchReceiptCodeMap: {},
              dispatchReceiptCodeOptions: [],
              dispatchReceiptCodeSearchOptions: [],
            });
          }
        } else {
          console.log(
            "Error while getting getRoadShipmentReceiptCodes:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting getRoadShipmentReceiptCodes:", error);
      });

  }
  getDispatchReceiptCode(transactionType) {

    if(this.props.transportationType === Constants.TransportationType.ROAD)
    {
    
      this.setState({
        dispatchReceiptCodeMap: {},
        dispatchReceiptCodeOptions: [],
        dispatchReceiptCodeSearchOptions: [],
      });

      if(this.state.modHSEInspection.VehicleCode!==undefined && this.state.modHSEInspection.VehicleCode!==null )
      this.getDispatchReceiptCodeByVehicle(this.state.modHSEInspection.VehicleCode,transactionType);

      return;
    }
    
    const obj = {
      TransportationType: this.props.transportationType,
      TransactionType: transactionType,
      ShareholderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
    };
    axios(
      RestAPIs.GetDispatchOrReceiptCodes,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.Table !== undefined &&
            result.EntityResult.Table !== null &&
            result.EntityResult.Table.length > 0
          ) {
            const dispatchReceiptCodeMap = {};
            let dispatchReceiptCodeOptions = [];
            // if (Array.isArray(result.EntityResult.Table)){
            //   dispatchReceiptCodeOptions=result.EntityResult.Table.map((item) => ({ text: item.Code +'[' + obj.ShareholderCode +']',value: item.Code + '[' + obj.ShareholderCode +']' }));
            
            // }
           for (let item of result.EntityResult.Table) {
              if (item.VehicleCode !== undefined && item.VehicleCode !== null) {
                if (dispatchReceiptCodeMap[item.VehicleCode] === undefined) {
                  dispatchReceiptCodeMap[item.VehicleCode] = [];
                }
                dispatchReceiptCodeMap[item.VehicleCode].push({
                  text: item.Code,
                  value: item.Code ,
                });
                if (
                  this.state.modHSEInspection.VehicleCode === item.VehicleCode
                ) {
                  dispatchReceiptCodeOptions.push({
                    text: item.Code,
                    value: item.Code,
                  });
                }
              } else {
                if(this.props.transportationType === Constants.TransportationType.PIPELINE)
                {
                  dispatchReceiptCodeOptions.push({
                    text: item.Code + '[' + item.ShareholderCode +']',
                    value: item.Code + '[' + item.ShareholderCode +']',
                  });
                }
                else
                {
                  dispatchReceiptCodeOptions.push({
                    text: item.Code,
                    value: item.Code,
                  });
                }
              }
            }
            let dispatchReceiptCodeSearchOptions = lodash.cloneDeep(
              dispatchReceiptCodeOptions
            );
            if (
              dispatchReceiptCodeSearchOptions.length >
              Constants.filteredOptionsCount
            ) {
              dispatchReceiptCodeSearchOptions =
                dispatchReceiptCodeSearchOptions.slice(
                  0,
                  Constants.filteredOptionsCount
                );
            }
            this.setState({
              dispatchReceiptCodeMap,
              dispatchReceiptCodeOptions,
              dispatchReceiptCodeSearchOptions,
            });
          } else {
            this.setState({
              dispatchReceiptCodeMap: {},
              dispatchReceiptCodeOptions: [],
              dispatchReceiptCodeSearchOptions: [],
            });
          }
        } else {
          console.log(
            "Error while getting getDispatchReceiptCode:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log("Error while getting getDispatchReceiptCode:", error);
      });
  }

  getDispatchReceiptCodeByVehicle(vehicleCode, TransactionType) {

    if(this.props.transportationType === Constants.TransportationType.ROAD)
    {
      let selectedVehicleShareholder = this.getEntityAndShareholder(vehicleCode);
      
      let existingShareholder= ''
      if(this.state.modHSEInspection.VehicleCode!==undefined && this.state.modHSEInspection.VehicleCode!==null )
      {
       let existingVehicleShareholder =this.getEntityAndShareholder(this.state.modHSEInspection.VehicleCode)
        existingShareholder=existingVehicleShareholder.ShareHolderCode;
      }
      if(selectedVehicleShareholder.ShareHolderCode!==existingShareholder || (this.state.modHSEInspection.TransactionType!==TransactionType))
        this.getRoadShipmentReceiptCodes(TransactionType,selectedVehicleShareholder.ShareHolderCode,vehicleCode)
        else
        {
          this.setDispatchReceiptFilterOptions(vehicleCode);
        }
    }
    else
    {
      this.setDispatchReceiptFilterOptions(vehicleCode);
    }
   
  }

  setDispatchReceiptFilterOptions(vehicleCode)
  {
    if (
      this.state.dispatchReceiptCodeMap[vehicleCode] !== undefined &&
      Array.isArray(this.state.dispatchReceiptCodeMap[vehicleCode])
    ) {
      const dispatchReceiptCodeOptions =
        this.state.dispatchReceiptCodeMap[vehicleCode];
      let dispatchReceiptCodeSearchOptions = lodash.cloneDeep(
        dispatchReceiptCodeOptions
      );
      if (
        dispatchReceiptCodeSearchOptions.length > Constants.filteredOptionsCount
      ) {
        dispatchReceiptCodeSearchOptions =
          dispatchReceiptCodeSearchOptions.slice(
            0,
            Constants.filteredOptionsCount
          );
      }
      this.setState({
        dispatchReceiptCodeOptions,
        dispatchReceiptCodeSearchOptions,
      });
    } else {
      this.setState({
        dispatchReceiptCodeOptions: [],
        dispatchReceiptCodeSearchOptions: [],
      });
    }
  }

  getDispatchReceiptSearchOptions() {
    const dispatchReceiptCodeSearchOptions = lodash.cloneDeep(
      this.state.dispatchReceiptCodeSearchOptions
    );
    const modDispatchReceiptCode =
      this.state.modHSEInspection.DispatchReceiptCode;
    if (
      modDispatchReceiptCode !== null &&
      modDispatchReceiptCode !== "" &&
      modDispatchReceiptCode !== undefined
    ) {
      const selectedCode = dispatchReceiptCodeSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modDispatchReceiptCode.toLowerCase()
      );
      if (selectedCode === undefined) {
        dispatchReceiptCodeSearchOptions.push({
          text: modDispatchReceiptCode,
          value: modDispatchReceiptCode,
        });
      }
    }
    return dispatchReceiptCodeSearchOptions;
  }

  

  getRailWagonCode(modHSEInspection) {
    if (modHSEInspection.TransactionType === "DISPATCH") {
      const keyCode = [
        {
          key: KeyCodes.railDispatchCode,
          value: modHSEInspection.DispatchReceiptCode,
        },
        {
          key: KeyCodes.transportationType,
          value: Constants.TransportationType.RAIL,
        },
      ];
      const obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.railDispatchCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetRailDispatch,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            this.processRailDispatchReceiptData(
              result.EntityResult.DispatchCompartmentPlanList
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting getRailWagonCode:", error);
        });
    } else {
      const keyCode = [
        {
          key: KeyCodes.railReceiptCode,
          value: modHSEInspection.DispatchReceiptCode,
        },
        {
          key: KeyCodes.transportationType,
          value: Constants.TransportationType.RAIL,
        },
      ];
      const obj = {
        ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
        keyDataCode: KeyCodes.railReceiptCode,
        KeyCodes: keyCode,
      };
      axios(
        RestAPIs.GetRailReceipt,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          const result = response.data;
          if (result.IsSuccess === true) {
            this.processRailDispatchReceiptData(
              result.EntityResult.RailMarineReceiptCompartmentPlanList
            );
          }
        })
        .catch((error) => {
          console.log("Error while getting RailWagonCode:", error);
        });
    }
  }

  processRailDispatchReceiptData(planList) {
    if (planList !== null) {
      const wagonCodeList = [];
      const railWagonCarrierCompanyMap = {};
      for (let item of planList) {
        wagonCodeList.push(item.TrailerCode);
        railWagonCarrierCompanyMap[item.TrailerCode] = item.CarrierCompanyCode;
      }
      this.setState({
        railWagonCodeOptions: Utilities.transferListtoOptions(wagonCodeList),
        railWagonCarrierCompanyMap,
        isReadyToRender: true,
      });
    } else {
      this.setState({
        railWagonCodeOptions: [],
        railWagonCarrierCompanyMap: {},
        isReadyToRender: true,
      });
    }
  }

  getHSEInspectionResult(selectedRow) {

    // setting default Shareholder
    let shareholder=this.props.userDetails.EntityResult.PrimaryShareholder;

    if((this.props.transportationType === Constants.TransportationType.ROAD || this.props.transportationType === Constants.TransportationType.PIPELINE) && (selectedRow.Shareholder!==undefined) )
    {
      shareholder=selectedRow.Shareholder;
    }
    emptyHSEInspection.TransportationType = this.props.transportationType;
     
    emptyHSEInspection.ShareholderCode = shareholder;
    this.getCardReaderLocations(shareholder);
    if (selectedRow.TransactionCode === undefined) {
      this.setState({
        HSEInspection: lodash.cloneDeep(emptyHSEInspection),
        modHSEInspection: lodash.cloneDeep(emptyHSEInspection),
        associations: [],
        modAssociations: [],
        attachments: [],
        isReadyToRender: true,
        //selectedAttributeList: [],
        modAttributeList: [],
        attributeValidationErrors: [],
        hseUnitInspectionType: "",

        isManualEntry: true,
        cardReaderCodeOptions: [],
        roadTransportationUnitOptions: [],
        roadTransportationUnit: "",
        railWagonCodeOptions: [],
        dispatchReceiptCodeOptions: [],
        dispatchReceiptCodeSearchOptions: [],
        railWagonCarrierCompanyMap: {},
        railWagon: "",
        displayTransportationUnit: false,
        displayOverAllInspection: false,
        isOverAllInspection: false,
      });
      this.setDispatchReceiptLabel(emptyHSEInspection);
      if (this.props.transportationType === Constants.TransportationType.ROAD) {
        this.getVehicleCode(shareholder);
      } else if (
        this.props.transportationType === Constants.TransportationType.MARINE
      ) {
        this.getVehicleCode(shareholder);
      }
      return;
    } else if (selectedRow.OverAllHSEInspectionStatus === null) {
      const HSEInspection = lodash.cloneDeep(emptyHSEInspection);
      HSEInspection.TransactionType = selectedRow.TransactionType;
      HSEInspection.VehicleCode = selectedRow.VehicleCode;
      HSEInspection.DispatchReceiptCode = selectedRow.TransactionCode;

      if(this.props.transportationType === Constants.TransportationType.ROAD)
      {
        HSEInspection.VehicleCode = selectedRow.VehicleCode +'[' + shareholder +']' ;
        HSEInspection.DispatchReceiptCode = selectedRow.TransactionCode +'[' + shareholder +']' ;
      }

      let displayTransportationUnit = false;
      if (
        this.props.transportationType === Constants.TransportationType.ROAD &&
        (selectedRow.VehicleType ===
          Constants.VehicleType.RigidTruckWithTrailer ||
          selectedRow.VehicleType === Constants.VehicleType.TractorWithTrailer)
      ) {
        displayTransportationUnit = true;
      }

      const vehicleCodeOptions = [];
      if (selectedRow.VehicleCode !== null && selectedRow.VehicleCode !== "") {
        vehicleCodeOptions.push({
          text: (this.props.transportationType === Constants.TransportationType.ROAD)? selectedRow.VehicleCode+'[' + shareholder +']': selectedRow.VehicleCode,
          value: (this.props.transportationType === Constants.TransportationType.ROAD)? selectedRow.VehicleCode+'[' + shareholder +']': selectedRow.VehicleCode,
        });
      }

      const vehicleCodeSearchOptions = lodash.cloneDeep(vehicleCodeOptions);

      const dispatchReceiptCodeOptions = [];
      if (
        selectedRow.TransactionCode !== null &&
        selectedRow.TransactionCode !== ""
      ) {
        dispatchReceiptCodeOptions.push({
          text: (this.props.transportationType === Constants.TransportationType.ROAD)? selectedRow.TransactionCode +'[' + shareholder +']': selectedRow.TransactionCode,
          value: (this.props.transportationType === Constants.TransportationType.ROAD)? selectedRow.TransactionCode +'[' + shareholder +']': selectedRow.TransactionCode,
        });
      }
      const state = {
        HSEInspection: lodash.cloneDeep(HSEInspection),
        modHSEInspection: lodash.cloneDeep(HSEInspection),
        associations: [],
        modAssociations: [],
        isManualEntry: false,
        vehicleCodeOptions,
        vehicleCodeSearchOptions,
        dispatchReceiptCodeOptions,
        dispatchReceiptCodeSearchOptions: lodash.cloneDeep(
          dispatchReceiptCodeOptions
        ),
        displayTransportationUnit,
      };
      if (this.props.transportationType !== Constants.TransportationType.RAIL) {
        state.isReadyToRender = true;
      }
      this.setState(state);
      this.setDispatchReceiptLabel(HSEInspection);
      if (displayTransportationUnit) {
        this.getVehicleDetail(HSEInspection, (result) => {
          this.setRoadTransportationUnit(result);
          this.getAttributesMetaData();
        });
      } else if (
        this.props.transportationType === Constants.TransportationType.RAIL
      ) {
        this.getRailWagonCode(HSEInspection);
      } else if (
        this.props.transportationType === Constants.TransportationType.PIPELINE
      ) {
        this.getHSEInspectionItems(
          HSEInspection,
          Constants.TransportationType.PIPELINE
        );
      }
      return;
    } else if (
      selectedRow.TransportationType === Constants.TransportationType.ROAD
    ) {
      if (
        selectedRow.VehicleType ===
          Constants.VehicleType.RigidTruckWithTrailer ||
        selectedRow.VehicleType === Constants.VehicleType.TractorWithTrailer
      ) {
        const HSEInspection = lodash.cloneDeep(emptyHSEInspection);
        HSEInspection.TransactionType = selectedRow.TransactionType;
        HSEInspection.DispatchReceiptCode = (selectedRow.TransactionCode===null || selectedRow.TransactionCode==='')?'' :  selectedRow.TransactionCode +  '[' + shareholder +']';
        HSEInspection.LocationCode = selectedRow.LocationCode;
        HSEInspection.VehicleCode = selectedRow.VehicleCode  + '[' + shareholder +']';
        if (
          selectedRow.OverAllHSEInspectionStatus !== undefined &&
          selectedRow.OverAllHSEInspectionStatus !== null
        ) {
          HSEInspection.OverAllHSEInspectionStatus =
            selectedRow.OverAllHSEInspectionStatus;
        } else {
          HSEInspection.OverAllHSEInspectionStatus = 0;
        }

        if (this.state.roadTransportationUnit === "") {
          const vehicleCodeOptions = [];
          if (
            selectedRow.VehicleCode !== null &&
            selectedRow.VehicleCode !== ""
          ) {
            vehicleCodeOptions.push({
              text: selectedRow.VehicleCode + '[' + shareholder + ']' ,
              value: selectedRow.VehicleCode + '[' + shareholder + ']',
            });
          }

          const vehicleCodeSearchOptions = lodash.cloneDeep(vehicleCodeOptions);

          const dispatchReceiptCodeOptions = [];
          if (
            selectedRow.TransactionCode !== null &&
            selectedRow.TransactionCode !== ""
          ) {
            dispatchReceiptCodeOptions.push({
              text: selectedRow.TransactionCode + '[' + shareholder + ']' ,
              value: selectedRow.TransactionCode + '[' + shareholder + ']' ,
            });
          }

          this.setState({
            HSEInspection: lodash.cloneDeep(HSEInspection),
            modHSEInspection: lodash.cloneDeep(HSEInspection),
            associations: [],
            modAssociations: [],
            isManualEntry: false,
            dispatchReceiptCodeOptions,
            dispatchReceiptCodeSearchOptions: lodash.cloneDeep(
              dispatchReceiptCodeOptions
            ),
            vehicleCodeOptions,
            vehicleCodeSearchOptions,
            displayTransportationUnit: true,
            displayOverAllInspection: true,
            isOverAllInspection:
              selectedRow.OverAllHSEInspectionStatus ===
                Constants.HSEInspectionStatus.PASS ||
              selectedRow.OverAllHSEInspectionStatus ===
                Constants.HSEInspectionStatus.FAIL,
          });
          this.getVehicleDetail(HSEInspection, (result) => {
            this.setRoadTransportationUnit(result);
            this.setState({ isReadyToRender: true });
          });
          this.setDispatchReceiptLabel(HSEInspection);
          return;
        }
      }
    } else if (
      selectedRow.TransportationType === Constants.TransportationType.RAIL
    ) {
      const HSEInspection = lodash.cloneDeep(emptyHSEInspection);
      HSEInspection.TransactionType = selectedRow.TransactionType;
      HSEInspection.DispatchReceiptCode = selectedRow.TransactionCode;
      HSEInspection.LocationCode = selectedRow.LocationCode;
      if (
        selectedRow.OverAllHSEInspectionStatus !== undefined &&
        selectedRow.OverAllHSEInspectionStatus !== null
      ) {
        HSEInspection.OverAllHSEInspectionStatus =
          selectedRow.OverAllHSEInspectionStatus;
      } else {
        HSEInspection.OverAllHSEInspectionStatus = 0;
      }
      const locationTypeMap = {};
      locationTypeMap[selectedRow.LocationCode] = selectedRow.LocationType;

      if (this.state.railWagon === "") {
        const dispatchReceiptCodeOptions = [];
        if (
          selectedRow.TransactionCode !== null &&
          selectedRow.TransactionCode !== ""
        ) {
          dispatchReceiptCodeOptions.push({
            text: selectedRow.TransactionCode,
            value: selectedRow.TransactionCode,
          });
        }

        this.setState({
          HSEInspection: lodash.cloneDeep(HSEInspection),
          modHSEInspection: lodash.cloneDeep(HSEInspection),
          associations: [],
          modAssociations: [],
          isManualEntry: false,
          dispatchReceiptCodeOptions,
          dispatchReceiptCodeSearchOptions: lodash.cloneDeep(
            dispatchReceiptCodeOptions
          ),
          locationTypeMap,
        });
        this.getRailWagonCode(HSEInspection);
        this.setDispatchReceiptLabel(HSEInspection);
        return;
      } else {
        this.getRailWagonDetail(this.state.railWagon, (railWagonDetail) => {
          this.getRailHSEInspectionResult(
            HSEInspection,
            railWagonDetail.RailWagonCategory,
            this.state.railWagon
          );
        },
        // ()=> {
        //     this.localNodeAttribute();
        // }
        );
        return;
      }
    }

    const data = {
      TransportationType: this.props.transportationType,
      TransactionType: selectedRow.TransactionType,
      Location: selectedRow.LocationCode,
      VehicleCode: selectedRow.VehicleCode,
      VehicleType: selectedRow.VehicleType,
      EntityCode: selectedRow.TransactionCode,
      TransportationUnitType:
        selectedRow.VehicleType === null ? "" : selectedRow.VehicleType,
      TransportationUnitTypeCode: selectedRow.VehicleCode,
      OverAllHSEInspectionStatus: selectedRow.OverAllHSEInspectionStatus,
      HSEInspectionResultsMasterId: selectedRow.HseinspectionResultsMasterId,
      ShareholderCode: shareholder,
    };
    if (
      this.props.transportationType === Constants.TransportationType.PIPELINE
    ) {
      data.TransportationUnitType = Constants.TransportationType.PIPELINE;
      data.TransportationUnitTypeCode = Constants.TransportationType.PIPELINE;
      data.VehicleType = "Pipeline";
    }
    axios(
      RestAPIs.GetHSEInspectionResult,
      Utilities.getAuthenticationObjectforPost(
        data,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true && result.EntityResult !== null) {
          this.processResponse(result);
        } else {
          this.setState({
            HSEInspection: lodash.cloneDeep(emptyHSEInspection),
            modHSEInspection: lodash.cloneDeep(emptyHSEInspection),
            associations: [],
            modAssociations: [],
            attachments: [],
            isReadyToRender: true,
            isManualEntry: false,
          });
          this.setDispatchReceiptLabel(emptyHSEInspection);
          console.log("Error in getHSEInspectionResult: ", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getHSEInspectionResult",
          error
        );
      });
  }

  processResponse(result) {

    if(result.EntityResult.ShareholderCode===null || result.EntityResult.ShareholderCode==='')
    result.EntityResult.ShareholderCode = this.props.selectedShareholder;

    const vehicleCodeOptions = [];
    if (
      result.EntityResult.VehicleCode !== null &&
      result.EntityResult.VehicleCode !== ""
    ) {
      if(result.EntityResult.TransportationType===Constants.TransportationType.ROAD)
      {
        vehicleCodeOptions.push({
          text: result.EntityResult.VehicleCode + '[' + result.EntityResult.ShareholderCode + ']',
          value: result.EntityResult.VehicleCode + '[' + result.EntityResult.ShareholderCode + ']',
        });
        result.EntityResult.VehicleCode=result.EntityResult.VehicleCode + '[' + result.EntityResult.ShareholderCode + ']';
      }
      else 
      {
      vehicleCodeOptions.push({
        text: result.EntityResult.VehicleCode ,
        value: result.EntityResult.VehicleCode,
      });
    }
    }
    const vehicleCodeSearchOptions = lodash.cloneDeep(vehicleCodeOptions);
    const dispatchReceiptCodeOptions = [];
    if (
      result.EntityResult.DispatchReceiptCode !== null &&
      result.EntityResult.DispatchReceiptCode !== ""
    ) {
      if(result.EntityResult.TransportationType===Constants.TransportationType.ROAD)
      {
        dispatchReceiptCodeOptions.push({
          text: result.EntityResult.DispatchReceiptCode + '[' + result.EntityResult.ShareholderCode + ']',
          value: result.EntityResult.DispatchReceiptCode + '[' + result.EntityResult.ShareholderCode + ']',
        });
      }
      else if(result.EntityResult.TransportationType===Constants.TransportationType.PIPELINE)
      {
        dispatchReceiptCodeOptions.push({
          text: result.EntityResult.DispatchReceiptCode + '[' + result.EntityResult.ShareholderCode + ']',
          value: result.EntityResult.DispatchReceiptCode + '[' + result.EntityResult.ShareholderCode + ']',
        });
        result.EntityResult.DispatchReceiptCode =
        result.EntityResult.DispatchReceiptCode + '[' + result.EntityResult.ShareholderCode + ']'
      }
      else
      {
      dispatchReceiptCodeOptions.push({
        text: result.EntityResult.DispatchReceiptCode,
        value: result.EntityResult.DispatchReceiptCode,
      });
    }
    } else if (
      result.EntityResult.ShipmentCode !== null &&
      result.EntityResult.ShipmentCode !== ""
    ) {
      if(result.EntityResult.TransportationType===Constants.TransportationType.ROAD)
      {
      dispatchReceiptCodeOptions.push({
        text: result.EntityResult.ShipmentCode + '[' + result.EntityResult.ShareholderCode + ']',
        value: result.EntityResult.ShipmentCode + '[' + result.EntityResult.ShareholderCode + ']',
      });
      result.EntityResult.DispatchReceiptCode =
        result.EntityResult.ShipmentCode + '[' + result.EntityResult.ShareholderCode + ']'
    }
    else
    {
      dispatchReceiptCodeOptions.push({
        text: result.EntityResult.ShipmentCode,
        value: result.EntityResult.ShipmentCode,
      });
      result.EntityResult.DispatchReceiptCode =
        result.EntityResult.ShipmentCode;
    }
      
    }
   
    this.setState({
      HSEInspection: lodash.cloneDeep(result.EntityResult),
      modHSEInspection: lodash.cloneDeep(result.EntityResult),
      associations: this.getAssociationsFromXMLString(
        result.EntityResult.InspectedItems
      ),
      modAssociations: this.getAssociationsFromXMLString(
        result.EntityResult.InspectedItems
      ),
      attachments: this.documentsInfoToAttachments(
        result.EntityResult.HSEDocumentsInfo
      ),
      isReadyToRender: true,
      saveEnabled:
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          this.props.transportationType + fnHSEInspection
        ) &&
        (result.EntityResult.HSEInspectionStatus ===
          Constants.HSEInspectionStatus.NOT_DONE ||
          result.EntityResult.HSEInspectionStatus ===
            Constants.HSEInspectionStatus.INPROGRESS),
      passFailAllEnabled:
        result.EntityResult.OverAllHSEInspectionStatus === 0 &&
        result.EntityResult.HSEInspectionStatus !==
          Constants.HSEInspectionStatus.INPROGRESS,
      vehicleCodeOptions,
      vehicleCodeSearchOptions,
      dispatchReceiptCodeOptions,
      dispatchReceiptCodeSearchOptions: lodash.cloneDeep(
        dispatchReceiptCodeOptions
      ),
      isOverAllInspection:
        result.EntityResult.OverAllHSEInspectionStatus ===
          Constants.HSEInspectionStatus.PASS ||
        result.EntityResult.OverAllHSEInspectionStatus ===
          Constants.HSEInspectionStatus.FAIL,
        modAttributeList: []// this.updateAttributeInfo(result.EntityResult.Attributes),
          
    }
    ,
             
            )
            ;
    this.getAttributesMetaData();         
    this.setDispatchReceiptLabel(result.EntityResult);
  }

  getRoadHSEInspectionResult(
    modHSEInspection,
    vehicleType,
    transportationUnitType,
    transportationUnitTypeCode
  ) {
    let vehicleShareholder = this.getEntityAndShareholder(modHSEInspection.VehicleCode);
    modHSEInspection.VehicleCode= vehicleShareholder.entityCode;
    modHSEInspection.ShareholderCode= vehicleShareholder.ShareHolderCode;

    const data = {
      TransportationType: this.props.transportationType,
      TransactionType: modHSEInspection.TransactionType,
      Location: modHSEInspection.LocationCode,
      EntityCode: modHSEInspection.DispatchReceiptCode,
      TransportationUnitType:
        transportationUnitType === null ? "" : transportationUnitType,
      TransportationUnitTypeCode: transportationUnitTypeCode,
      OverAllHSEInspectionStatus: modHSEInspection.OverAllHSEInspectionStatus,
      VehicleCode: modHSEInspection.VehicleCode,
      VehicleType: vehicleType,
      HSEInspectionResultsMasterId:
        this.props.selectedRow.HseinspectionResultsMasterId === undefined
          ? this.state.modHSEInspection.MasterInpsectionResultsRefId
          : this.props.selectedRow.HseinspectionResultsMasterId,

          ShareholderCode: (modHSEInspection.ShareholderCode===undefined||modHSEInspection.ShareholderCode===''||modHSEInspection.ShareholderCode===null)?this.props.userDetails.EntityResult.PrimaryShareholder:modHSEInspection.ShareholderCode,
    };
    axios(
      RestAPIs.GetHSEInspectionResult,
      Utilities.getAuthenticationObjectforPost(
        data,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true && result.EntityResult !== null) {
          this.processResponse(result);
        } else {
          this.getHSEInspectionItems(modHSEInspection, transportationUnitType);
        }
      })
      .catch((error) => {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getRailHSEInspectionResult",
          error
        );
      });
  }

  getRailHSEInspectionResult(modHSEInspection, railWagonCategory, railWagon) {
    const data = {
      TransportationType: this.props.transportationType,
      TransactionType: modHSEInspection.TransactionType,
      Location: modHSEInspection.LocationCode,
      EntityCode: modHSEInspection.DispatchReceiptCode,
      TransportationUnitType:
        railWagonCategory === null ? "" : railWagonCategory,
      TransportationUnitTypeCode: railWagon,
      OverAllHSEInspectionStatus: modHSEInspection.OverAllHSEInspectionStatus,
      WagonCode: railWagon,
      HSEInspectionResultsMasterId:
        this.props.selectedRow.HseinspectionResultsMasterId,
        ShareholderCode: this.props.selectedShareholder===null?this.props.userDetails.EntityResult.PrimaryShareholder:this.props.selectedShareholder,
    };
    axios(
      RestAPIs.GetHSEInspectionResult,
      Utilities.getAuthenticationObjectforPost(
        data,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true && result.EntityResult !== null) {
          this.processRailResponse(result);
        } else {
          this.getHSEInspectionItems(modHSEInspection, railWagonCategory);
        }
      })
      .catch((error) => {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getRailHSEInspectionResult",
          error
        );
      });
  }

  processRailResponse(result) {
    const dispatchReceiptCodeOptions = [];
    if (
      result.EntityResult.DispatchReceiptCode !== null &&
      result.EntityResult.DispatchReceiptCode !== ""
    ) {
      dispatchReceiptCodeOptions.push({
        text: result.EntityResult.DispatchReceiptCode,
        value: result.EntityResult.DispatchReceiptCode,
      });
    }
    
    result.EntityResult.ShareholderCode = this.props.userDetails.EntityResult.PrimaryShareholder;
    let saveEnabled = true;
    if (result.EntityResult.OverAllHSEInspectionStatus === 0) {
      if (result.EntityResult.HSEInspectionStatus !== 3) {
        saveEnabled = false;
      }
    } else {
      saveEnabled = false;
    }
    this.setState({
      HSEInspection: lodash.cloneDeep(result.EntityResult),
      modHSEInspection: lodash.cloneDeep(result.EntityResult),
      associations: this.getAssociationsFromXMLString(
        result.EntityResult.InspectedItems
      ),
      modAssociations: this.getAssociationsFromXMLString(
        result.EntityResult.InspectedItems
      ),
      attachments: this.documentsInfoToAttachments(
        result.EntityResult.HSEDocumentsInfo
      ),
      isReadyToRender: true,
      saveEnabled:
        Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          this.props.transportationType + fnHSEInspection
        ) && saveEnabled,
      dispatchReceiptCodeOptions,
      dispatchReceiptCodeSearchOptions: lodash.cloneDeep(
        dispatchReceiptCodeOptions
      ),
    });

    this.getAttributesMetaData();
  }

  getHSEInspectionItems(modHSEInspection, vehicleType) {
    let transportationUnit;
    let locationType;
    switch (this.props.transportationType) {
      case Constants.TransportationType.ROAD:
        transportationUnit = vehicleType;
        locationType =
          this.state.locationTypeMap[modHSEInspection.LocationCode];
        break;
      case Constants.TransportationType.MARINE:
        transportationUnit = "VESSEL";
        locationType =
          this.state.locationTypeMap[modHSEInspection.LocationCode];
        break;
      case Constants.TransportationType.RAIL:
        transportationUnit = "RAILWAGON";
        locationType =
          this.state.locationTypeMap[modHSEInspection.LocationCode];
        break;
      case Constants.TransportationType.PIPELINE:
        transportationUnit = "PIPELINE";
        locationType = "Pipeline";
        break;
      default:
        return;
    }

    this.setState({
      modAttributeList: [],
    })
     
    if(this.props.transportationType===Constants.TransportationType.ROAD || this.props.transportationType===Constants.TransportationType.MARINE )
    {
      this.setState({
        hseUnitInspectionType:vehicleType,
      });
    }
    const keyCode = [
      {
        key: "TransportationType",
        value: this.props.transportationType,
      },
      {
        key: "TransactionType",
        value: modHSEInspection.TransactionType,
      },
      {
        key: "LocationType",
        value: locationType,
      },
      {
        key: "TransportationUnit",
        value: transportationUnit,
      },
      {
        key: "TransportationUnitType",
        value: vehicleType,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetHSEConfiguration,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (!result.EntityResult) {
            let errorMessage;
            if (
              this.props.transportationType ===
              Constants.TransportationType.PIPELINE
            ) {
              if (this.state.modHSEInspection.TransactionType === "DISPATCH") {
                errorMessage =
                  "HSE_Inspection_NoInspectionConfiguredForPipelineDispatch";
              } else {
                errorMessage =
                  "HSE_Inspection_NoInspectionConfiguredForPipelineReceipt";
              }
            } else {
              errorMessage = "HSE_Inspection_NoInspectionConfiguredForLocation";
            }
            const notification = {
              messageType: "critical",
              message: "HSE_Inspection_GetInspectionConfiguredStatus",
              messageResultDetails: [
                {
                  keyFields: [],
                  keyValues: [],
                  isSuccess: false,
                  errorMessage: errorMessage,
                },
              ],
            };
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
            const modHSEInspection = lodash.cloneDeep(
              this.state.modHSEInspection
            );
            modHSEInspection.HSEInspectionStatus = null;
            this.setState({
              modHSEInspection,
              associations: [],
              modAssociations: [],
              saveEnabled: false,
              passFailAllEnabled: false,
            });
          } else {
            const questions = this.getAssociationsFromXMLString(
              result.EntityResult.Questions
            );
            const associations = [];
            for (let question of questions) {
              associations.push({
                Severity: question.Severity,
                LocalizedText: question.LocalizedText,
                Status: false,
                LastUpdatedTime: "",
                Remarks: "",
                ID: question.ID,
              });
            }
            const modHSEInspection = lodash.cloneDeep(
              this.state.modHSEInspection
            );
            modHSEInspection.HSEInspectionStatus = null;
            this.setState({
              modHSEInspection,
              associations,
              modAssociations: lodash.cloneDeep(associations),
              attachments: [],
              saveEnabled:
                Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.add,
                  this.props.transportationType + fnHSEInspection
                ) && !this.state.isOverAllInspection,
              passFailAllEnabled: !this.state.isOverAllInspection,
            },
            );
          }
        } 
          this.getAttributesMetaData();
    }
      )
      .catch((error) => {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getHSEConfiguration",
          error
        );
      });
  }

  handleChange = (propertyName, data) => {
    try {
      const modHSEInspection = lodash.cloneDeep(this.state.modHSEInspection);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      let roadTransportationUnit = this.state.roadTransportationUnit;
      let railWagon = this.state.railWagon;

      if (propertyName === "CardReader") {
        this.setState({ cardReader: data });
        return;
      } else if (propertyName === "transportationUnit") {
        roadTransportationUnit = data;
        this.setState({ roadTransportationUnit });
        if (modHSEInspection.OverAllHSEInspectionStatus !== null) {
          this.getVehicleDetail(modHSEInspection, (result) => {
            const transportationUnit = roadTransportationUnit.split(" - ");
            this.getRoadHSEInspectionResult(
              modHSEInspection,
              result.EntityResult.VehicleType,
              transportationUnit[0],
              transportationUnit[1]
            );
          }
        
        );
          this.getAttributesMetaData();
          return;
        }
      } else if (propertyName === "railWagon") {
        railWagon = data;
        this.setState({ railWagon });
        if (modHSEInspection.OverAllHSEInspectionStatus !== null) {
          this.getRailWagonDetail(railWagon, (railWagonDetail) => {
            this.getRailHSEInspectionResult(
              modHSEInspection,
              railWagonDetail.RailWagonCategory,
              railWagon
            );
          });
          return;
        }
      } else {
        modHSEInspection[propertyName] = data;
      }
      if (propertyName === "TransactionType") {
        modHSEInspection.DispatchReceiptCode = null;
        railWagon = "";
        this.setState({ railWagon, railWagonCodeOptions: [] });
        this.setDispatchReceiptLabel(modHSEInspection);
        if (data === "DISPATCH") {
          this.getDispatchReceiptCode("SHIPMENT");
        } else {
          this.getDispatchReceiptCode(data);
        }
      } else if (propertyName === "LocationCode") {
        this.mapCardReader(data, validationErrors);
      }

      if (HSEInspectionValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          HSEInspectionValidationDef[propertyName],
          data
        );
      }
      this.setState({ modHSEInspection, validationErrors });

      if (propertyName === "Remarks") {
        return;
      } else if (propertyName === "VehicleCode") {
        this.getDispatchReceiptCodeByVehicle(data, modHSEInspection.TransactionType);
        modHSEInspection.DispatchReceiptCode = null;
      }

      if (
        modHSEInspection.TransportationType ===
        Constants.TransportationType.ROAD
      ) {
        if (propertyName === "VehicleCode") {
          this.getVehicleDetail(modHSEInspection, (result) => {
            if (
              result.EntityResult.VehicleType ===
                Constants.VehicleType.RigidTruckWithTrailer ||
              result.EntityResult.VehicleType ===
                Constants.VehicleType.TractorWithTrailer
            ) {
              this.setRoadTransportationUnit(result);
              this.setState({
                displayTransportationUnit: true,
                displayOverAllInspection: true,
                passFailAllEnabled: false,
                saveEnabled: false,
                associations: [],
                modAssociations: [],
              });
            } else {
              this.setState({
                displayTransportationUnit: false,
                displayOverAllInspection: false,
                passFailAllEnabled: false,
              });
              if (
                modHSEInspection.TransactionType !== null &&
                modHSEInspection.LocationCode !== null &&
                modHSEInspection.VehicleCode !== null
              ) {
                this.getHSEInspectionItems(
                  modHSEInspection,
                  result.EntityResult.VehicleType
                );
              }
            }
          });
        } else {
          if (this.state.displayTransportationUnit === true) {
            if (
              modHSEInspection.TransactionType !== null &&
              modHSEInspection.LocationCode !== null &&
              modHSEInspection.VehicleCode !== null &&
              roadTransportationUnit !== ""
            ) {
              const transportationUnit = roadTransportationUnit.split(" - ");
              this.getHSEInspectionItems(
                modHSEInspection,
                transportationUnit[0]
              );
              // this.setState({ passFailAllEnabled: true });
            } else {
              this.setState({ associations: [], modAssociations: [] });
            }
          } else {
            if (
              modHSEInspection.TransactionType !== null &&
              modHSEInspection.LocationCode !== null &&
              modHSEInspection.VehicleCode !== null
            ) {
              if (this.props.selectedRow.VehicleType !== undefined) {
                this.getHSEInspectionItems(
                  modHSEInspection,
                  this.props.selectedRow.VehicleType
                );
              } else {
                this.getVehicleDetail(modHSEInspection, (result) => {
                  this.getHSEInspectionItems(
                    modHSEInspection,
                    result.EntityResult.VehicleType
                  );
                });
              }
            }
          }
        }
      } else if (
        modHSEInspection.TransportationType ===
        Constants.TransportationType.MARINE
      ) {
        if (
          modHSEInspection.TransactionType !== null &&
          modHSEInspection.LocationCode !== null &&
          modHSEInspection.VehicleCode !== null
        ) {
          if (this.props.selectedRow.VehicleType !== undefined) {
            this.getHSEInspectionItems(
              modHSEInspection,
              this.props.selectedRow.VehicleType
            );
          } else {
            this.getVehicleDetail(modHSEInspection, (result) => {
              this.getHSEInspectionItems(
                modHSEInspection,
                result.EntityResult.VehicleType
              );
            });
          }
        }
      } else if (
        modHSEInspection.TransportationType ===
        Constants.TransportationType.RAIL
      ) {
        if (
          modHSEInspection.TransactionType !== null &&
          modHSEInspection.LocationCode !== null &&
          modHSEInspection.DispatchReceiptCode !== null &&
          railWagon !== ""
        ) {
          this.getRailWagonDetail(railWagon, (railWagonDetail) => {
            this.getHSEInspectionItems(
              modHSEInspection,
              railWagonDetail.RailWagonCategory
            );
          });
        } else if (propertyName === "DispatchReceiptCode") {
          if (data !== null && data !== "") {
            this.getRailWagonCode(modHSEInspection);
          } else {
            railWagon = "";
            this.setState({ railWagon, railWagonCodeOptions: [] });
          }
        }
      } else if (
        modHSEInspection.TransportationType ===
        Constants.TransportationType.PIPELINE
      ) {
        if (
          modHSEInspection.TransactionType !== null &&
          modHSEInspection.DispatchReceiptCode !== null
        ) {
          this.getHSEInspectionItems(modHSEInspection, "PIPELINE");
        }
      }
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on handleChange",
        error
      );
    }
  };

  handleInspectionItemChange = (id, field, newValue) => {
    const modAssociations = lodash.cloneDeep(this.state.modAssociations);
    modAssociations[id][field] = newValue;
    this.setState({ modAssociations });
  };

  convertStringtoDecimal(modHSEInspection, attributeList) {
    try {
      
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modHSEInspection.Attributes = Utilities.fillAttributeDetails(attributeList);
      return modHSEInspection;
    } catch (err) {
      console.log("convertStringtoDecimal error HseInspection Details", err);
    }
  }

  getAssociationsFromXMLString(xmlString) {
    let questionsDoc = null;
    let isTransferSuccess = true;
    if (!!xmlString) {
      try {
        if (window.ActiveXObject) {
          const xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = false;
          xmlDoc.loadXML(xmlString);
          questionsDoc = xmlDoc;
        } else {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, "text/xml");
          questionsDoc = xmlDoc.getElementsByTagName("Questions")[0];
        }
      } catch (error) {
        console.log(
          "HSEInspectionDetailsComposite: Error occurred on getAssociationsFromXMLString",
          error
        );
        isTransferSuccess = false;
      }
    } else {
      isTransferSuccess = false;
    }
    if (!isTransferSuccess) {
      return [];
    }
    const associations = [];
    let id = 0;
    for (let questionNode of questionsDoc.childNodes) {
      if (questionNode.nodeName !== "Question") {
        continue;
      }
      let questionTemp = {
        ID: id,
      };
      for (let item of questionNode.childNodes) {
        if (
          item.nodeName !== "Severity" &&
          item.nodeName !== "LocalizedText" &&
          item.nodeName !== "Status" &&
          item.nodeName !== "LastUpdatedTime" &&
          item.nodeName !== "Remarks"
        ) {
          continue;
        }
        if (item.textContent === "True" || item.textContent === "true") {
          questionTemp[item.nodeName] = true;
        } else if (
          item.textContent === "False" ||
          item.textContent === "false"
        ) {
          questionTemp[item.nodeName] = false;
        } else {
          questionTemp[item.nodeName] = item.textContent;
        }
      }
      associations.push(questionTemp);
      id += 1;
    }
    return associations;
  }

  getXMLStringFromAssociations(modAssociations, lastUpdatedTime) {
    let xmlString = "<Questions>";
    for (let i in modAssociations) {
      xmlString += "<Question>";
      let question = this.state.associations[i];
      let modQuestion = modAssociations[i];
      for (let key in modQuestion) {
        if (key === "LastUpdatedTime") {
          if (
            modQuestion[key] === "" ||
            (question["Status"] === true ? "True" : "False") !==
              modQuestion["Status"] ||
            question["Remarks"] !== modQuestion["Remarks"]
          ) {
            modQuestion[key] = lastUpdatedTime.toISOString();
          }
        } else if (key === "Status") {
          modQuestion[key] = modQuestion[key] === true ? "True" : "False";
        } else if (key === "ID") {
          continue;
        }
        xmlString += `<${key}>${modQuestion[key]}</${key}>`;
      }
      xmlString += "</Question>";
    }
    xmlString += "</Questions>";
    return xmlString;
  }

  setDispatchReceiptLabel(modHSEInspection) {
    let dispatchReceiptLabel;
    if (modHSEInspection.TransactionType === "RECEIPT") {
      dispatchReceiptLabel = "ReceiptCode";
    } else {
      dispatchReceiptLabel = "Report_ShipmentCode";
    }
    this.setState({ dispatchReceiptLabel });
  }


  saveHSEInspection = () => {
    try {

      this.setState({ saveEnabled: false });

      let tempHSEInspection = lodash.cloneDeep(this.state.tempHSEInspection);


      if (this.props.transportationType === Constants.TransportationType.ROAD) {

         
        let vehicleShareholder = this.getEntityAndShareholder(tempHSEInspection.VehicleCode);
        tempHSEInspection.VehicleCode= vehicleShareholder.entityCode;
        tempHSEInspection.ShareholderCode= vehicleShareholder.ShareHolderCode;

        if(tempHSEInspection.ShipmentCode!==null)
          {
                  let transactionShareholder = this.getEntityAndShareholder(tempHSEInspection.ShipmentCode);
                  tempHSEInspection.ShipmentCode= transactionShareholder.entityCode;
          }

          if(tempHSEInspection.DispatchReceiptCode!==null)
          {
                  let transactionShareholder = this.getEntityAndShareholder(tempHSEInspection.DispatchReceiptCode);
                  tempHSEInspection.DispatchReceiptCode= transactionShareholder.entityCode;
          }

          if(tempHSEInspection.TransportationUnitTypeCode!==null)
          {
          let tranUnitCodeShareholder = this.getEntityAndShareholder(tempHSEInspection.TransportationUnitTypeCode);
          tempHSEInspection.TransportationUnitTypeCode= tranUnitCodeShareholder.entityCode;
          }

        if (this.state.displayTransportationUnit) {
          const transportationUnit =
            this.state.roadTransportationUnit.split(" - ");
          this.setTransportationUnit(
            tempHSEInspection,
            transportationUnit[0],
            transportationUnit[1]
          );
          this.updateHSEInspection(tempHSEInspection, 3, false);
        } else {
          this.getVehicleDetail(tempHSEInspection, (result) => {
            this.setTransportationUnit(
              tempHSEInspection,
              result.EntityResult.VehicleType,
              tempHSEInspection.VehicleCode
            );
            this.updateHSEInspection(tempHSEInspection, 3, false);
          });
        }
      } else if (
        this.props.transportationType === Constants.TransportationType.RAIL
      ) {
        this.getRailWagonDetail(this.state.railWagon, (railWagonDetail) => {
          this.setTransportationUnit(
            tempHSEInspection,
            railWagonDetail.RailWagonCategory
          );
          this.updateHSEInspection(tempHSEInspection, 3, false, [
            { key: "CarrierCode", value: railWagonDetail.CarrierCompanyCode },
          ]);
        });
      } else if (
        this.props.transportationType === Constants.TransportationType.MARINE
      ) {
        this.getVehicleDetail(tempHSEInspection, (result) => {
          this.setTransportationUnit(
            tempHSEInspection,
            result.EntityResult.VehicleType
          );
          this.updateHSEInspection(tempHSEInspection, 3, false);
        });
      } else {
        this.setTransportationUnit(tempHSEInspection);
        this.updateHSEInspection(tempHSEInspection, 3, false);
      }
    } catch (error) {
      console.log("PrimeMoversComposite : Error in savePrimeMover");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      const modHSEInspection = lodash.cloneDeep(this.state.modHSEInspection);
      const modAssociations = lodash.cloneDeep(this.state.modAssociations);
      modHSEInspection.LastUpdatedTime = new Date();
      modHSEInspection.LastInspectedTime = new Date();
      modHSEInspection.TerminalCode= this.props.selectedTerminal;
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeList
      );
      modHSEInspection.InspectedItems = this.getXMLStringFromAssociations(
        modAssociations,
        modHSEInspection.LastUpdatedTime
      );

      if (!this.validateSave(modHSEInspection,attributeList)) {
        this.setState({ saveEnabled: true });
        return;
      }

      let tmphseInspection = this.convertStringtoDecimal(
        modHSEInspection,
        attributeList
    )
    modHSEInspection.Attributes= tmphseInspection.Attributes;
    
    let showAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
  let tempHSEInspection= lodash.cloneDeep(modHSEInspection);
  this.setState({ showAuthenticationLayout, tempHSEInspection }, () => {
    if (showAuthenticationLayout === false) {
      this.saveHSEInspection();
    }
});
      
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on handleSave",
        error
      );
    }
  };

  setTransportationUnit(
    modHSEInspection,
    transportationUnitType = "",
    transportationUnitTypeCode = ""
  ) {
    switch (modHSEInspection.TransportationType) {
      case Constants.TransportationType.ROAD:
        modHSEInspection.TransportationUnit = transportationUnitType;
        modHSEInspection.TransportationUnitType = transportationUnitType;
        modHSEInspection.TransportationUnitTypeCode =
          transportationUnitTypeCode;
        if (modHSEInspection.TransactionType === "SHIPMENT") {
          modHSEInspection.ShipmentCode = modHSEInspection.DispatchReceiptCode;
          modHSEInspection.DispatchReceiptCode = "";
        } else {
          modHSEInspection.ShipmentCode = "";
        }
        break;
      case Constants.TransportationType.MARINE:
        modHSEInspection.TransportationUnit = "VESSEL";
        modHSEInspection.TransportationUnitType = transportationUnitType;
        modHSEInspection.TransportationUnitTypeCode =
          modHSEInspection.VehicleCode;
        modHSEInspection.ShipmentCode = "";
        break;
      case Constants.TransportationType.RAIL:
        modHSEInspection.TransportationUnit = "RAILWAGON";
        modHSEInspection.TransportationUnitType = transportationUnitType;
        modHSEInspection.TransportationUnitTypeCode = this.state.railWagon;
        modHSEInspection.ShipmentCode = "";
        break;
      case Constants.TransportationType.PIPELINE:
        modHSEInspection.TransportationUnit =
          Constants.TransportationType.PIPELINE;
        modHSEInspection.TransportationUnitType =
          Constants.TransportationType.PIPELINE;
        modHSEInspection.TransportationUnitTypeCode =
          modHSEInspection.DispatchReceiptCode;
        modHSEInspection.ShipmentCode = "";
        break;
      default:
    }
  }

  validateSave(modHSEInspection, attributeList) {
    const validationErrors = lodash.cloneDeep(this.state.validationErrors);

    Object.keys(HSEInspectionValidationDef).forEach(function (key) {
      if (modHSEInspection[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          HSEInspectionValidationDef[key],
          modHSEInspection[key]
        );
      }
    });

    if (
      modHSEInspection.TransportationType ===
      Constants.TransportationType.PIPELINE
    ) {
      validationErrors.LocationCode = "";
    }

    let notification = {
      messageType: "critical",
      message: "HSE_Inspection_UpdateStatus",
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

    var returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });

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

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(modHSEInspection, "update", notification);
      return false;
    }
    return returnValue;
  }

  updateHSE= (HSEInspectionStatus, isOverAllInspection) => {
    let showUpdateAuthenticationLayout =
    this.props.userDetails.EntityResult.IsWebPortalUser !== true
      ? true
      : false;
    let tempHSEInspection= HSEInspectionStatus;
    let tempIsOverAllInspection= isOverAllInspection;

    this.setState({ showUpdateAuthenticationLayout,tempHSEInspection,tempIsOverAllInspection }, () => {
      if (showUpdateAuthenticationLayout === false) {
        this.handleUpdate();
      }})
     
    }


  handleUpdate = () => {
    try {

      this.setState({ showUpdateAuthenticationLayout:false});

      const HSEInspectionStatus= lodash.cloneDeep(this.state.tempHSEInspection); 
      const isOverAllInspection= lodash.cloneDeep(this.state.tempIsOverAllInspection);

      const modHSEInspection = lodash.cloneDeep(this.state.modHSEInspection);
      const modAssociations = lodash.cloneDeep(this.state.modAssociations);
      modHSEInspection.LastUpdatedTime = new Date();
      modHSEInspection.LastInspectedTime = new Date();

      if(this.props.transportationType === Constants.TransportationType.ROAD)
      {
        if(modHSEInspection.DispatchReceiptCode!==null)
        {
                let transactionShareholder = this.getEntityAndShareholder(modHSEInspection.DispatchReceiptCode);
                modHSEInspection.DispatchReceiptCode= transactionShareholder.entityCode;
        }

        if(modHSEInspection.ShipmentCode!==null)
        {
                let transactionShareholder = this.getEntityAndShareholder(modHSEInspection.ShipmentCode);
                modHSEInspection.ShipmentCode= transactionShareholder.entityCode;
        }
  
        if(modHSEInspection.VehicleCode!==null)
        {
                let vehShareholder = this.getEntityAndShareholder(modHSEInspection.VehicleCode);
                modHSEInspection.VehicleCode= vehShareholder.entityCode;
                modHSEInspection.ShareholderCode=vehShareholder.ShareHolderCode;
        }
  
        
      }
      


      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeList
      );
      
      modHSEInspection.InspectedItems = this.getXMLStringFromAssociations(
        modAssociations,
        modHSEInspection.LastUpdatedTime
      );

      if (!this.validateSave(modHSEInspection, attributeList)) {
        this.setState({ saveEnabled: true });
        return;
      }

      let tmphseInspection = this.convertStringtoDecimal(
        modHSEInspection,
        attributeList
    )
    modHSEInspection.Attributes= tmphseInspection.Attributes;
    
      if (isOverAllInspection) {
        modHSEInspection.OverAllHSEInspectionStatus = HSEInspectionStatus;
        if (
          modHSEInspection.HSEInspectionStatus !==
            Constants.HSEInspectionStatus.PASS &&
          modHSEInspection.HSEInspectionStatus !==
            Constants.HSEInspectionStatus.FAIL
        ) {
          modHSEInspection.HSEInspectionStatus = HSEInspectionStatus;
        }
      } else {
        modHSEInspection.HSEInspectionStatus = HSEInspectionStatus;
      }
      if (this.props.transportationType === Constants.TransportationType.ROAD) {
        if (this.state.displayTransportationUnit) {
          const transportationUnit =
            this.state.roadTransportationUnit.split(" - ");
          this.setTransportationUnit(
            modHSEInspection,
            transportationUnit[0],
            transportationUnit[1]
          );
          this.updateHSEInspection(
            modHSEInspection,
            HSEInspectionStatus,
            isOverAllInspection
          );
        } else {
          this.getVehicleDetail(modHSEInspection, (result) => {
            this.setTransportationUnit(
              modHSEInspection,
              result.EntityResult.VehicleType,
              modHSEInspection.VehicleCode
            );
            this.updateHSEInspection(
              modHSEInspection,
              HSEInspectionStatus,
              isOverAllInspection
            );
          });
        }
      } else if (
        this.props.transportationType === Constants.TransportationType.RAIL
      ) {
        this.getRailWagonDetail(this.state.railWagon, (railWagonDetail) => {
          this.setTransportationUnit(
            modHSEInspection,
            railWagonDetail.RailWagonCategory
          );
          this.updateHSEInspection(
            modHSEInspection,
            HSEInspectionStatus,
            isOverAllInspection,
            [{ key: "CarrierCode", value: railWagonDetail.CarrierCompanyCode }]
          );
        });
      } else if (
        this.props.transportationType === Constants.TransportationType.MARINE
      ) {
        this.getVehicleDetail(modHSEInspection, (result) => {
          this.setTransportationUnit(
            modHSEInspection,
            result.EntityResult.VehicleType
          );
          this.updateHSEInspection(
            modHSEInspection,
            HSEInspectionStatus,
            isOverAllInspection
          );
        });
      } else {
        this.setTransportationUnit(modHSEInspection);
        this.updateHSEInspection(
          modHSEInspection,
          HSEInspectionStatus,
          isOverAllInspection
        );
      }
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite: Error occurred on handleUpdate",
        error
      );
    }
  };

  updateHSEInspection(
    modHSEInspection,
    HSEInspectionStatus,
    isOverAllInspection,
    keyCode = []
  ) {
    modHSEInspection.HSEDocumentsInfo = this.attachmentsToDocumentsInfo(
      lodash.cloneDeep(this.state.attachments)
    );
    if (
      this.props.selectedRow.HseinspectionResultsMasterId !== null ||
      this.props.selectedRow.HseinspectionResultsMasterId !== undefined
    ) {
      modHSEInspection.MasterInpsectionResultsRefId =
        this.props.selectedRow.HseinspectionResultsMasterId;
    }

    if(this.props.transportationType === Constants.TransportationType.ROAD)
    {
      if(modHSEInspection.DispatchReceiptCode!==null)
      {
              let transactionShareholder = this.getEntityAndShareholder(modHSEInspection.DispatchReceiptCode);
              modHSEInspection.DispatchReceiptCode= transactionShareholder.entityCode;
      }

      if(modHSEInspection.ShipmentCode!==null)
      {
              let transactionShareholder = this.getEntityAndShareholder(modHSEInspection.ShipmentCode);
              modHSEInspection.ShipmentCode= transactionShareholder.entityCode;
      }

      if(modHSEInspection.VehicleCode!==null)
      {
              let vehShareholder = this.getEntityAndShareholder(modHSEInspection.VehicleCode);
              modHSEInspection.VehicleCode= vehShareholder.entityCode;
      }

      if(modHSEInspection.TransportationUnitTypeCode!==null)
      {
              let vehUnitShareholder = this.getEntityAndShareholder(modHSEInspection.TransportationUnitTypeCode);
              modHSEInspection.TransportationUnitTypeCode= vehUnitShareholder.entityCode;
      }
    }
    else   if(this.props.transportationType === Constants.TransportationType.PIPELINE)
    {
      if(modHSEInspection.DispatchReceiptCode!==null)
      {
              let transactionShareholder = this.getEntityAndShareholder(modHSEInspection.DispatchReceiptCode);
              modHSEInspection.DispatchReceiptCode= transactionShareholder.entityCode;
              modHSEInspection.ShareholderCode=transactionShareholder.ShareHolderCode;

              modHSEInspection.TransportationUnitTypeCode=null;
      }
      
    }

    modHSEInspection.ShareholderCode= (modHSEInspection.ShareholderCode===undefined||modHSEInspection.ShareholderCode===''||modHSEInspection.ShareholderCode===null)?this.props.userDetails.EntityResult.PrimaryShareholder:modHSEInspection.ShareholderCode;
    modHSEInspection.TerminalCode= this.props.selectedTerminal;

    // prior release fix
    // if(this.props.transportationType === Constants.TransportationType.PIPELINE && modHSEInspection.TransactionType.toUpperCase()==="DISPATCH") 
    //     modHSEInspection.TransactionType="SHIPMENT";
    
    keyCode = keyCode.concat([
      {
        key: "HseInspectionStatus",
        value: HSEInspectionStatus,
      },
      {
        key: "isOverAllInspection",
        value: isOverAllInspection,
      },
    ]);
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: keyCode,
      Entity: modHSEInspection,
    };
    const notification = {
      messageType: "critical",
      message: "HSE_Inspection_UpdateStatus",
      messageResultDetails: [
        {
          keyFields: ["HSE_Inspection"],
          keyValues: [this.props.transportationType],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateHSEInspectionStatus,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        this.setState({  showAuthenticationLayout: false, });
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          if (result.EntityResult.HSEInspectionStatus === -1) {
            result.EntityResult.HSEInspectionStatus =
              modHSEInspection.HSEInspectionStatus;
          }
          if (
            this.props.transportationType === Constants.TransportationType.RAIL
          ) {
            this.processRailResponse(result);
          } else {
            this.processResponse(result);
          }
        } else {
          if (
            result.ErrorList[0] !== null &&
            result.ErrorList[0] !== "" &&
            (result.ErrorList[0].split(Constants.delimiter)[0] ===
              "INVALID_FILENAME_X" ||
              result.ErrorList[0].split(Constants.delimiter)[0] ===
                "UPLOADED_FILE_NOT_IMAGE")
          ) {
            this.setState({ saveEnabled: true });
          }
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
        }
        this.props.onSaved(notification);
      })
      .catch((error) => {
        this.setState({ saveEnabled: true, showAuthenticationLayout: false, });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(notification);
      });
  }
  
 
  handleDispatchReceiptSearchChange = (dispatchReceiptCode) => {
    try {
      let dispatchReceiptCodeSearchOptions =
        this.state.dispatchReceiptCodeOptions.filter((item) =>
          item.value.toLowerCase().includes(dispatchReceiptCode.toLowerCase())
        );
      if (
        dispatchReceiptCodeSearchOptions.length > Constants.filteredOptionsCount
      ) {
        dispatchReceiptCodeSearchOptions =
          dispatchReceiptCodeSearchOptions.slice(
            0,
            Constants.filteredOptionsCount
          );
      }

      this.setState({
        dispatchReceiptCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite:Error occurred on handleDispatchReceiptSearchChange",
        error
      );
    }
  };

  handleVehicleSearchChange = (VehicleCode) => {
    try {
      let vehicleCodeSearchOptions = this.state.vehicleCodeOptions.filter(
        (item) => item.value.toLowerCase().includes(VehicleCode.toLowerCase())
      );
      if (vehicleCodeSearchOptions.length > Constants.filteredOptionsCount) {
        vehicleCodeSearchOptions = vehicleCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        vehicleCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite:Error occurred on handleVehicleSearchChange",
        error
      );
    }
  };

  handleOpenAttachmentsModal = () => {
    try {
      const modalOpen = this.state.modalOpen;
      modalOpen.attachments = true;
      this.setState({ modalOpen });
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite:Error occurred on handleOpenAttachmentsModal",
        error
      );
    }
  };

  handleAddAttachment = (file) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let fileType, fileBase64;
        [fileType, fileBase64] = reader.result.split(";", 2);
        fileType = fileType.split(":")[1];
        fileBase64 = fileBase64.split(",")[1];
        const fileNameArray = file.name.split(".");
        const fileExtension =
          "." + fileNameArray[fileNameArray.length - 1].toLowerCase();
        if (
          this.state.attachmentFileSetting.FileTypesAllowedToUpload.indexOf(
            fileExtension
          ) !== -1
        ) {
          let fileName = file.name;
          let recordFileName = fileName + Constants.delimiter + fileType;
          while (this.checkFileName(recordFileName)) {
            let fileNameArray = fileName.split(".");
            if (fileNameArray.length > 1) {
              fileNameArray[fileNameArray.length - 2] += "_new";
            } else {
              fileNameArray[0] += "_new";
            }
            fileName = fileNameArray.join(".");
            recordFileName = fileName + Constants.delimiter + fileType;
          }
          if (fileName.length > 40) {
            const notification = {
              messageType: "critical",
              message: "HSE_Inspection_UpdateStatus",
              messageResultDetails: [
                {
                  keyFields: [],
                  keyValues: [],
                  isSuccess: false,
                  errorMessage: "FileNameTooLong",
                },
              ],
            };
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
            return;
          }
          const attachment = {
            blob: this.base64ToBlob(fileBase64, fileType),
            doc: {
              FileMode: Constants.FileMode.ADD,
              FileName: recordFileName,
              FileContent: fileBase64,
            },
          };
          const attachments = lodash.cloneDeep(this.state.attachments);
          attachments.push(attachment);
          let addFileEnabled = this.state.addFileEnabled;
          if (
            this.checkAttachmentsNumber(attachments) >=
            this.state.attachmentFileSetting.NoOfFilesAllowedToUpload
          ) {
            addFileEnabled = false;
          }
          this.setState({ attachments, addFileEnabled });
        }
      };
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite:Error occurred on handleAddAttachment",
        error
      );
    }
  };

  checkFileName(recordFileName) {
    for (let item of this.state.attachments) {
      if (item.doc.FileName === recordFileName) {
        return true;
      }
    }
    return false;
  }

  handleDeleteAttachments = (attachment) => {
    try {
      if (!this.state.saveEnabled) {
        return;
      }
      let attachments;
      if (attachment.doc.FileMode === null) {
        attachments = lodash.cloneDeep(this.state.attachments);
        for (let i = 0; i < attachments.length; i++) {
          if (attachments[i].doc.FileName === attachment.doc.FileName) {
            attachments[i].doc.FileMode = Constants.FileMode.DELETE;
          }
        }
      } else {
        attachments = this.state.attachments.filter((item) => {
          return item.doc.FileName !== attachment.doc.FileName;
        });
      }
      let addFileEnabled = this.state.addFileEnabled;
      if (
        this.checkAttachmentsNumber(attachments) <
        this.state.attachmentFileSetting.NoOfFilesAllowedToUpload
      ) {
        addFileEnabled = true;
      }
      this.setState({ attachments, addFileEnabled });
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite:Error occurred on handleDeleteAttachments",
        error
      );
    }
  };

  handleResetAttachments = () => {
    try {
      const attachments = lodash.cloneDeep(this.state.attachments);
      const newAttachments = [];
      for (let attachment of attachments) {
        if (attachment.doc.FileMode === null) {
          attachment.doc.FileMode = Constants.FileMode.DELETE;
          newAttachments.push(attachment);
        }
      }
      this.setState({ attachments: newAttachments, addFileEnabled: true });
    } catch (error) {
      console.log(
        "HSEInspectionDetailsComposite:Error occurred on handleResetAttachments",
        error
      );
    }
  };

  checkAttachmentsNumber(attachments) {
    let number = 0;
    for (let attachment of attachments) {
      if (attachment.doc.FileMode !== Constants.FileMode.DELETE) {
        number += 1;
      }
    }
    return number;
  }

  documentsInfoToAttachments(documentsInfo) {
    if (documentsInfo === null) {
      return [];
    }
    const attachments = [];
    for (let document of documentsInfo) {
      if (document.FileMode !== Constants.FileMode.DELETE) {
        document.FileMode = null;
      }
      attachments.push({
        blob: null,
        doc: document,
      });
    }
    return attachments;
  }

  attachmentsToDocumentsInfo(attachments) {
    const documentsInfo = [];
    for (let attachment of attachments) {
      documentsInfo.push(attachment.doc);
    }
    return documentsInfo;
  }

  handleOpenAttachment = (attachment) => {
    const fileDescription = attachment.doc.FileName.split(
      Constants.delimiter,
      2
    );
    if (attachment.blob === null) {
      this.getHSEInspectionResultsDoc(
        this.state.modHSEInspection.ID,
        attachment.doc.FileName,
        (result) => {
          const fileBlob = this.base64ToBlob(
            result.EntityResult.FileContent,
            fileDescription[1]
          );
          const attachments = lodash.cloneDeep(this.state.attachments);
          for (let i = 0; i < attachments.length; i++) {
            if (attachments[i].doc.FileName === attachment.doc.FileName) {
              attachments[i].blob = fileBlob;
            }
          }
          this.setState({ attachments });
          this.downloadBlob(fileBlob, fileDescription[0]);
        }
      );
    } else {
      this.downloadBlob(attachment.blob, fileDescription[0]);
    }
  };

 

  getHSEInspectionResultsDoc(HSEInspectionResultId, fileName, callback) {
    const obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      KeyCodes: [],
      Entity: {
        HSEInspectionResultsId: HSEInspectionResultId,
        FileName: fileName,
      },
    };
    axios(
      RestAPIs.GetHSEDocumentInfo,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          callback(result);
        }
      })
      .catch((error) => {
        console.log("Error while getting HSEInspectionResultsDoc:", error);
      });
  }

  base64ToBlob(base64String, fileType) {
    const fileBin = atob(base64String);
    let n = fileBin.length;
    const uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = fileBin.charCodeAt(n);
    }
    return new Blob([uint8Array], { type: fileType });
  }

  downloadBlob(blob, fileName) {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const saveLink = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      const urlObject = window.URL || window.webkitURL || window;
      saveLink.href = urlObject.createObjectURL(blob);
      saveLink.download = fileName;
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      saveLink.dispatchEvent(event);
    }
  }


  handleCellDataEdit = (attribute, value) => {
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
          attributeValidation.attributeValidationErrors[
            attribute.Code
          ] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors });
    } catch (error) {
      console.log(
        "HseInspectionDetailsComposite:Error occured on handleCellDataEdit",
        error
      );
    }
  };


  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
      showUpdateAuthenticationLayout : false,
    });
  };

  getFunctionGroupName() {
    if(this.props.transportationType === Constants.TransportationType.RAIL)
      return fnRailHSEInspection;                   
    else  if(this.props.transportationType === Constants.TransportationType.MARINE)
      return fnMarineHSEInspection;
      else  if(this.props.transportationType === Constants.TransportationType.PIPELINE)
      return fnPipelineHSEInspection;
    else  
      return fnRoadHSEInspection;
   };
   
   handleOperation()  {
  
    if(this.state.showAuthenticationLayout)
      return this.saveHSEInspection
    else if(this.state.showUpdateAuthenticationLayout)
      return this.handleUpdate
    
 };

  render() {
    const modalOpen = this.state.modalOpen;
    const attachmentsList = [];
    for (let attachment of this.state.attachments) {
      if (attachment.doc.FileMode !== Constants.FileMode.DELETE) {
        attachmentsList.push(
          <div
            className="hse-inspection-attachments-item"
            key={attachment.doc.FileName}
          >
            <div
              className="hse-inspection-attachments-name"
              onClick={() => this.handleOpenAttachment(attachment)}
            >
              {attachment.doc.FileName.split(Constants.delimiter)[0]}
            </div>
            <div
              className="hse-inspection-attachments-delete"
              onClick={() => this.handleDeleteAttachments(attachment)}
            >
              ×
            </div>
          </div>
        );
      }
    }
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            newEntityName={"HSE Inspection - " + this.props.transportationType}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <HSEInspectionDetails
            HSEInspection={this.state.HSEInspection}
            modHSEInspection={this.state.modHSEInspection}
            modAssociations={this.state.modAssociations}
            validationErrors={this.state.validationErrors}

            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeList={this.state.modAttributeList}
            handleCellDataEdit={this.handleCellDataEdit}

            listOptions={{
              transactionType: this.state.transactionTypeOptions,
              vehicleCode: this.state.vehicleCodeSearchOptions,
              locationCode: this.state.locationCodeOptions,
              dispatchReceiptCode: this.getDispatchReceiptSearchOptions(),
              roadTransportationUnit: this.state.roadTransportationUnitOptions,
              railWagonCode: this.state.railWagonCodeOptions,
              cardReaderCode: this.state.cardReaderCodeOptions,
            }}
            cardReader={this.state.cardReader}
            railWagon={this.state.railWagon}
            roadTransportationUnit={this.state.roadTransportationUnit}
            onFieldChange={this.handleChange}
            onInspectionItemChange={this.handleInspectionItemChange}
            onDetectVehicle={this.handleDetectVehicle}
            onCancelDetect={this.handleCancelDetect}
            transportationType={this.props.transportationType}
            dispatchReceiptLabel={this.state.dispatchReceiptLabel}
            isManualEntry={this.state.isManualEntry}
            handleUpdate={this.handleUpdate}
            displayTransportationUnit={this.state.displayTransportationUnit}
            onDispatchReceiptSearchChange={
              this.handleDispatchReceiptSearchChange
            }
            onVehicleSearchChange={this.handleVehicleSearchChange}
            handleOpenAttachmentsModal={this.handleOpenAttachmentsModal}
            numberOfAttachments={this.checkAttachmentsNumber(
              this.state.attachments
            )}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row">
                <div className="col col-2">
                  <Button
                    className="backButton"
                    onClick={this.props.onBack}
                    content={t("Back")}
                  ></Button>
                </div>
                <div className="col col-10" style={{ textAlign: "right" }}>
                  <Button
                    content={t("Save")}
                    disabled={!this.state.saveEnabled || this.isNodeEnterpriseOrWebortal()}
                    onClick={() => this.handleSave()}
                  ></Button>
                  <Button
                    content={t("VehHSE_Pass")}
                    disabled={!this.state.saveEnabled || this.isNodeEnterpriseOrWebortal()}
                    onClick={() => {
                      modalOpen.pass = true;
                      this.setState({ modalOpen });
                    }}
                  ></Button>
                  <Button
                    content={t("VehHSE_Fail")}
                    className={
                      (this.state.saveEnabled === true && !this.isNodeEnterpriseOrWebortal() )? "cancelButton" : ""
                    }
                    disabled={!this.state.saveEnabled || this.isNodeEnterpriseOrWebortal()}
                    onClick={() => {
                      modalOpen.fail = true;
                      this.setState({ modalOpen });
                    }}
                  ></Button>
                  {this.state.displayOverAllInspection ? (
                    <Button
                      content={t("HSE_PassAll")}
                      disabled={!this.state.passFailAllEnabled || this.isNodeEnterpriseOrWebortal()}
                      onClick={() => {
                        modalOpen.passAll = true;
                        this.setState({ modalOpen });
                      }}
                    ></Button>
                  ) : null}
                  {this.state.displayOverAllInspection ? (
                    <Button
                      content={t("HSE_FailAll")}
                      className={
                        (this.state.passFailAllEnabled === true &&  !this.isNodeEnterpriseOrWebortal() )
                          ? "cancelButton"
                          : ""
                      }
                      disabled={!this.state.passFailAllEnabled || this.isNodeEnterpriseOrWebortal()}
                      onClick={() => {
                        modalOpen.failAll = true;
                        this.setState({ modalOpen });
                      }}
                    ></Button>
                  ) : null}
                </div>
                <div>
                  <Modal
                    size="mini"
                    open={this.state.modalOpen.pass}
                    closeOnDimmerClick={false}
                  >
                    <Modal.Content>
                      {t("HSE_PassInspection")}
                    </Modal.Content>
                    <Modal.Footer>
                      <Button
                        content={t("AccessCardInfo_Ok")}
                        onClick={() => {
                          modalOpen.pass = false;
                          this.setState({ modalOpen });
                          this.updateHSE(1, false);
                        }}
                      ></Button>
                      <Button
                        content={t("AccessCardInfo_Cancel")}
                        onClick={() => {
                          modalOpen.pass = false;
                          this.setState({ modalOpen });
                        }}
                      ></Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal
                    size="mini"
                    open={this.state.modalOpen.fail}
                    closeOnDimmerClick={false}
                  >
                    <Modal.Content>
                    {t("HSE_FailInspection")}
                    </Modal.Content>
                    <Modal.Footer>
                      <Button
                        content={t("AccessCardInfo_Ok")}
                        onClick={() => {
                          modalOpen.fail = false;
                          this.setState({ modalOpen });
                          this.updateHSE(2, false);
                        }}
                      ></Button>
                      <Button
                        content={t("AccessCardInfo_Cancel")}
                        onClick={() => {
                          modalOpen.fail = false;
                          this.setState({ modalOpen });
                        }}
                      ></Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal
                    size="mini"
                    open={this.state.modalOpen.passAll}
                    closeOnDimmerClick={false}
                  >
                    <Modal.Content>
                    {t("HSE_PassInspection")}
                    </Modal.Content>
                    <Modal.Footer>
                      <Button
                        content={t("AccessCardInfo_Ok")}
                        onClick={() => {
                          modalOpen.passAll = false;
                          this.setState({ modalOpen });
                          this.updateHSE(1, true);
                        }}
                      ></Button>
                      <Button
                        content={t("AccessCardInfo_Cancel")}
                        onClick={() => {
                          modalOpen.passAll = false;
                          this.setState({ modalOpen });
                        }}
                      ></Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal
                    size="mini"
                    open={this.state.modalOpen.failAll}
                    closeOnDimmerClick={false}
                  >
                    <Modal.Content>
                    {t("HSE_FailInspection")}
                    </Modal.Content>
                    <Modal.Footer>
                      <Button
                        content={t("AccessCardInfo_Ok")}
                        onClick={() => {
                          modalOpen.failAll = false;
                          this.setState({ modalOpen });
                          this.updateHSE(2, true);
                        }}
                      ></Button>
                      <Button
                        content={t("AccessCardInfo_Cancel")}
                        onClick={() => {
                          modalOpen.failAll = false;
                          this.setState({ modalOpen });
                        }}
                      ></Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal
                    size="small"
                    open={this.state.modalOpen.attachments}
                    closeOnDimmerClick={false}
                    placeholder="Drop or Upload Any Image File"
                  >
                    <Modal.Content>
                      <FileDrop
                        label="File Upload"
                        maxSize={
                          this.state.attachmentFileSetting.MaximumFileSize *
                          1024
                        }
                        multiple={false}
                        acceptedTypes={
                          this.state.attachmentFileSetting
                            .FileTypesAllowedToUpload
                        }
                        disabled={
                          !this.state.addFileEnabled || !this.state.saveEnabled
                        }
                        onAccepted={(files) =>
                          this.handleAddAttachment(files[0])
                        }
                        onReset={() => this.handleResetAttachments()}
                      />
                      <div>{attachmentsList}</div>
                    </Modal.Content>
                    <Modal.Footer>
                      <Button
                        content={t("Done")}
                        onClick={() => {
                          modalOpen.attachments = false;
                          this.setState({ modalOpen });
                        }}
                      ></Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>

        {this.state.showAuthenticationLayout || this.state.showUpdateAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={this.getFunctionGroupName()}
            handleOperation={this.handleOperation()}
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

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(getUserDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HSEInspectionDetailsComposite);

HSEInspectionDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
