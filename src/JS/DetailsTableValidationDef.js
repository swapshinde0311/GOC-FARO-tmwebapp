const codeExpression = "^[0-9a-zA-Z-_]+$";
const nameExpression = /^[^!%<>?\[\]^`{}|~=*]+$/;

//const remarksExpression = "^[0-9a-zA-Z-_]+(s{0,1}[a-zA-Z-0-9-_ ])*$";
// const emailExpression =
//   "^([a-zA-Z0-9])+([.a-zA-Z0-9_-])*@([a-zA-Z0-9])+(.[a-zA-Z0-9_-]+)+$";
  //Suchitra- allowed email address valid characters
const emailExpression = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
//const emailExpression =
// "^[0-9a-zA-Z-_]+([0-9a-zA-Z-_+.']+)*[@]([0-9a-zA-Z-_])+([0-9a-zA-Z-_.]+)*[.]([0-9a-zA-Z-_]+)([0-9a-zA-Z-_.]+)*$";
const numberExpression = "^[0-9]+$";
//const absoluteNumExpression = "^[1-9]+$"
const codeError = "Code_ValidInputCharacters";
const nameError = "Name_ValidInputCharacters";
export const trailerCompartmentValidationDef = [
  {
    field: "Code",
    displayName: "Trailer_CompCode",
    validator: [
      { minLength: 1, errorCode: "Trailer_MandatoryCode" },
      { maxLength: 50, errorCode: "TrailerInfo_CodeExceedsMaxLength" },
      { expression: codeExpression, errorCode: codeError },
    ],
  },
  {
    field: "Description",
    displayName: "Trailer_Desc",
    validator: [
      { maxLength: 300, errorCode: "TrailerInfo_DescriptionExceedsMaxLength" },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    field: "Capacity",
    displayName: "Trailer_CompCapacity",
    validator: [
      { minLength: 1, errorCode: "Trailer_CapacityRequired" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { isDecimal: true, errorCode: "Trailer_CapacityInvalid" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },
  {
    field: "UOM",
    displayName: "Trailer_VolumeUOM",
    validator: [{ minLength: 1, errorCode: "Trailer_UOMRequired" }],
  },
];
export const customerDestinationValidationDef = [
  {
    field: "CustomerCode",
    displayName: "Cust_Code",
    validator: [
      { minLength: 1, errorCode: "CustomerDetails_reqCustomerCode" },
      { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
      { expression: codeExpression, errorCode: codeError },
    ],
  },
  {
    field: "ContactPerson",
    displayName: "Cust_ContactPerson",
    validator: [
      { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
      {
        expression: nameExpression,
        errorCode: nameError,
      },
    ],
  },
  {
    field: "Mobile",
    displayName: "DriverInfo_Mobile",
    validator: [
      { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
      { expression: numberExpression, errorCode: "CustomerDetails_regMobile" },
    ],
  },
  {
    field: "Email",
    displayName: "Cust_Email",
    validator: [
      { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
      {
        expression: emailExpression,
        errorCode: "CustomerDetails_regEmail",
      },
    ],
  },
  {
    field: "Phone",
    displayName: "Dest_PhNum",
    validator: [
      { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
      { expression: numberExpression, errorCode: "CustomerDetails_regPhone" },
    ],
  },
];

export const shipmentCompartmentValidationDef = [
  {
    field: "CompartmentSeqNoInVehicle",
    displayName: "ShipmentCompDetail_CompSeqInVehicle",
    validator: [
      { minLength: 1, errorCode: "ShipmentCompDetail_InvalidSequence" },
    ],
  },
  {
    field: "FinishedProductCode",
    displayName: "ContractInfo_Product",
    validator: [
      { minLength: 1, errorCode: "PipelineDispatch_MandatoryFinishedProduct" },
    ],
  },
  {
    field: "CustomerCode",
    displayName: "ShipmentCompDetail_Customer",
    validator: [{ minLength: 1, errorCode: "CustomerDetails_reqCustomerCode" }],
  },
  {
    field: "DestinationCode",
    displayName: "ContractInfo_Destination",
    validator: [
      { minLength: 1, errorCode: "PipelineDispatch_MandatoryDestination" },
    ],
  },
  {
    field: "Quantity",
    displayName: "ShipmentCompDetail_Quantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },
];

export const receiptCompartmentValidationDef = [
  {
    field: "CompartmentSeqNoInVehicle",
    displayName: "Receipt_CompSeqInVehicle",
    validator: [{ minLength: 1, errorCode: "Receipt_InvalidSequence" }],
  },
  {
    field: "FinishedProductCode",
    displayName: "Receipt_Product",
    validator: [{ minLength: 1, errorCode: "FINISHEDPRODUCT_EMPTY_X" }],
  },
  {
    field: "OriginTerminalCode",
    displayName: "OriginTerminal",
    validator: [{ minLength: 1, errorCode: "ORIGINTERMINAL_EMPTY_X" }],
  },
  {
    field: "Quantity",
    displayName: "Receipt_Quantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },
];

export const shipmentProductValidationDef = [
  {
    field: "FinishedProductCode",
    displayName: "ContractInfo_Product",
    validator: [
      { minLength: 1, errorCode: "PipelineDispatch_MandatoryFinishedProduct" },
    ],
  },
  {
    field: "CustomerCode",
    displayName: "ShipmentCompDetail_Customer",
    validator: [{ minLength: 1, errorCode: "CustomerDetails_reqCustomerCode" }],
  },
  {
    field: "DestinationCode",
    displayName: "ContractInfo_Destination",
    validator: [
      { minLength: 1, errorCode: "PipelineDispatch_MandatoryDestination" },
    ],
  },
  {
    field: "Quantity",
    displayName: "ShipmentCompDetail_Quantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },
];

export const orderPlanValidationDef = [
  {
    field: "FinishedProductCode",
    displayName: "ShipmentOrder_ProductCode",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryProductCode" },
      { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
      { expression: codeExpression, errorCode: codeError },
    ],
  },

  {
    field: "Quantity",
    displayName: "ShipmentOrder_Quantity",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryQuantity" },
      {
        isDecimal: true,
        errorCode: "ShipmentOrder_InvalidQuantity",
      },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },

  {
    field: "QuantityUOM",
    displayName: "ShipmentOrder_UOM",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryQuantityUOM" },
    ],
  },
];

export const contractPlanValidationDef = [
  {
    field: "FinishedProductCode",
    displayName: "ContractInfo_Product",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryProductCode" },
      { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
      { expression: codeExpression, errorCode: codeError },
    ],
  },

  {
    field: "DestinationCode",
    displayName: "ContractInfo_Destination",
    validator: [
      //{ minLength: 1, errorCode: "ContractInfo_DestinationRequired" },
      { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
      { expression: codeExpression, errorCode: codeError },
    ],
  },

  {
    field: "StartDate",
    displayName: "ContractInfo_StartDate",
    validator: [
      //{ minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
      { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
      // { denyPastDate: true, errorCode: "ContractInfo_StartDateLater" },
    ],
  },

  {
    field: "EndDate",
    displayName: "ContractInfo_EndDate",
    validator: [
      // { minLength: 1, errorCode: "ContractInfo_EndDateRequired" },
      { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
      { denyPastDate: true, errorCode: "ContractInfo_EndDateEarlier" },
    ],
  },

  {
    field: "Quantity",
    displayName: "ContractInfo_Quantity",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryQuantity" },
      {
        isDecimal: true,
        errorCode: "ShipmentOrder_InvalidQuantity",
      },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },

  {
    field: "QuantityUOM",
    displayName: "ShipmentOrder_UOM",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryQuantityUOM" },
    ],
  },
];

export const marineDispatchCompartDef = [
  {
    displayName: "Marine_ShipmentCompDetail_Shareholder",
    field: "ShareholderCode",
    validator: [
      { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
      {
        maxLength: 50,
        errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength",
      },
      { expression: codeExpression, errorCode: codeError },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_CompSeqInVehicle",
    field: "CompartmentSeqNoInVehicle",
    validator: [
      { minLength: 1, errorCode: "CompartmentNo_Required" },
      { expression: numberExpression, errorCode: "CompartmentNo_Required" },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_ProductCode",
    field: "FinishedProductCode",
    validator: [
      { minLength: 1, errorCode: "FinishedProductCode_Required" },
      {
        maxLength: 50,
        errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength",
      },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_Customer",
    field: "CustomerCode",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryCustomer" },
      {
        maxLength: 50,
        errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength",
      },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_Destination",
    field: "DestinationCode",
    validator: [
      { minLength: 1, errorCode: "DESTINATION_EMPTY_X" },
      { maxLength: 50, errorCode: "DESTINATION_EXCEEDS_LENGTH" },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_Quantity",
    field: "Quantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },
  { displayName: "Receipt_SFL", field: "Capacity" },
  { displayName: "Receipt_CompQuantityUOM", field: "QuantityUOM" },
];

export const marineReceiptCompartDef = [
  {
    displayName: "Receipt_Shareholder",
    field: "ShareholderCode",
    validator: [
      { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
      {
        maxLength: 50,
        errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength",
      },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_CompSeqInVehicle",
    field: "CompartmentSeqNoInVehicle",
    validator: [
      { minLength: 1, errorCode: "CompartmentNo_Required" },
      { expression: numberExpression, errorCode: "CompartmentNo_Required" },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_ProductCode",
    field: "FinishedProductCode",
    validator: [
      { minLength: 1, errorCode: "FinishedProductCode_Required" },
      {
        maxLength: 50,
        errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength",
      },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    displayName: "Receipt_Supplier",
    field: "SupplierCode",
    validator: [
      { minLength: 1, errorCode: "Supplier_Code_Empty" },
      {
        maxLength: 50,
        errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength",
      },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    displayName: "Marine_ReceiptCompDetail_Origin",
    field: "OriginTerminalCode",
    validator: [
      {
        minLength: 1,
        errorCode: "PipelineReceiptDetails_MandatoryDestination",
      },
      {
        maxLength: 50,
        errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength",
      },
      { expression: nameExpression, errorCode: nameError },
    ],
  },
  {
    displayName: "Marine_ShipmentCompDetail_Quantity",
    field: "Quantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },
  {
    displayName: "Receipt_SFL",
    field: "Capacity",
  },
  {
    displayName: "Receipt_CompQuantityUOM",
    field: "QuantityUOM",
  },
];

export const supplierOriginTerminalValidationDef = [
  {
    field: "OriginTerminalCode",
    displayName: "Associated_OT_Code",
    validator: [
      { minLength: 1, errorCode: "OriginTerminal_CodeRequired" },
      { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
      { expression: codeExpression, errorCode: codeError },
    ],
  },
  {
    field: "ContactPerson",
    displayName: "Supplier_ContactPerson",
    validator: [
      { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
      {
        expression: nameExpression,
        errorCode: nameError,
      },
    ],
  },
  {
    field: "Mobile",
    displayName: "DriverInfo_Mobile",
    validator: [
      { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
      { expression: numberExpression, errorCode: "CustomerDetails_regMobile" },
    ],
  },
  {
    field: "Email",
    displayName: "Cust_Email",
    validator: [
      { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
      {
        expression: emailExpression,
        errorCode: "CustomerDetails_regEmail",
      },
    ],
  },
  {
    field: "Phone",
    displayName: "Dest_PhNum",
    validator: [
      { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
      { expression: numberExpression, errorCode: "CustomerDetails_regPhone" },
    ],
  },
];

// ====

export const marineTransloadingAssociatedShipmentsColumns =
  [
    {
      displayName: "BayAllocationShipmentSearch_ShipmentCode",
      field: "shipmentCode"
    },
    {
      displayName: "BayAllocationShipmentSearch_Status",
      field: "shipmentStatus"
    },
    {
      displayName: "LocalTransactionsMapping_PlannedQuantity",
      field: "quantity"
    },
    {
      displayName: "LocalTransactionsMapping_LoadedQuantity",
      field: "LoadedQty"
    },
    {
      displayName: "ViewShipmentStatus_Driver",
      field: "driver"
    },
    {
      displayName: "ViewShipmentStatus_Vehicle",
      field: "vehicle"
    },

  ]

export const marineTransloadingDetailsColumns =
  [
    {
      displayName: "Marine_ShipmentCompDetail_TrailerCode",
      field: "trailercode"
    },
    {
      displayName: "ViewMarineLoadingDetails_CompartmentSeqNo",
      field: "compSeqNo"
    },
    {
      displayName: "ViewShipment_CompartmentCode",
      field: "compartmentcode"
    },
    {
      displayName: "viewTransloading_BPCode",
      field: "productcode"
    }
    , {
      displayName: "BCU_BCU",
      field: "bcuCode"
    },
    {
      displayName: "Meter_Meter",
      field: "meterCode"
    },
    {
      displayName: "PipelineEntry_StartTotalizer",
      field: "starttotalizer"
    },
    {
      displayName: "PipelineMeter_EndTotalizer",
      field: "endtotalizer"
    }, {
      displayName: "Reconciliation_Quantity",
      field: "grossquantity"
    },
    {
      displayName: "SATruckOrderManualEntry_NetQty",
      field: "netquantity"
    },
    {
      displayName: "TankInfo_Density",
      field: "productdensity"
    },
    {
      displayName: "TankInfo_Temperature",
      field: "Temperature"
    },
    {
      displayName: "TankTransaction_Pressure",
      field: "pressure"
    },
    {
      displayName: "UnLoadingInfo_StartTime",
      field: "starttime"
    },
    {
      displayName: "ViewMarineLoadingDetails_EndTime",
      field: "endtime"
    },
  ];
export const railDispatchCompartmentDef = [
  {
    displayName: "RailDispatchPlanDetail_ShareHolderCode",
    field: "ShareholderCode",
    validator: [
      { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
      { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "RailDispatchPlanDetail_FinishedProductCode",
    field: "FinishedProductCode",
    validator: [
      { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryFinishedProductCode" },
      { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "RailDispatchPlanDetail_Customer",
    field: "CustomerCode",
    validator: [
      { minLength: 1, errorCode: "ShipmentOrder_MandatoryCustomer" },
      { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "RailDispatchPlanDetail_Destination",
    field: "DestinationCode",
    validator: [
      { minLength: 1, errorCode: "DESTINATION_EMPTY_X" },
      { maxLength: 50, errorCode: "DESTINATION_EXCEEDS_LENGTH" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "RailDispatchPlanDetail_Quantity",
    field: "PlannedQuantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
  },
];

export const railDispatchCompartmentAdjustmentDef = {
  displayName: "ViewMarineShipmentList_AdjustPlan",
  field: "AdjustedQuantity",
  validator: [
    { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
  ],
}

export const railDispatchCompartmentContractDef = {
  displayName: "RailDispatchPlanDetail_ContractCode",
  field: "ContractCode",
  validator: [
    { minLength: 1, errorCode: "ERRMSG_RAILDISPATCH_ITEMPLAN_CONTRACT_REQUIRED" },
    { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
    { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
  ],
}

export const railReceiptCompartDef = [
  {
    displayName: "ViewRailReceiptDetails_CarrierCompany",
    field: "CarrierCompanyCode",
    validator: [
      { minLength: 1, errorCode: "CarrierCompany_MandatoryCode" },
      { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "Rail_Receipt_Wagon",
    field: "TrailerCode",
    validator: [
      { minLength: 1, errorCode: "RailWagonConfigurationDetails_MandatoryCode" },
      { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "Rail_Receipt_Shareholder",
    field: "ShareholderCode",
    validator: [
      { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
      { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "Rail_Receipt_Product",
    field: "FinishedProductCode",
    validator: [
      { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryFinishedProductCode" },
      { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "Rail_Receipt_Supplier",
    field: "SupplierCode",
    validator: [
      { minLength: 1, errorCode: "Supplier_Code_Empty" },
      { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "Rail_Receipt_OriginCode",
    field: "OriginTerminalCode",
    validator: [
      { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryDestination" },
      { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "Rail_Receipt_Quantity",
    field: "Quantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
  },
];

export const railRouteDestinationListDef = [
  {
    displayName: "RailRouteConfigurationList_Shareholder",
    field: "ShareholderCode",
    validator: [
      { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
      { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "RailRouteConfigurationDetails_DestinationCode",
    field: "DestinationCode",
    validator: [
      { minLength: 1, errorCode: "DESTINATION_EMPTY_X" },
      { maxLength: 50, errorCode: "DESTINATION_EXCEEDS_LENGTH" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "RailRouteConfigurationDetails_Remarks",
    field: "Remarks",
    validator: [
      { maxLength: 300, errorCode: "COMMENTS_EXCEEDS_LENGTH" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
];

export const pipelineDispatchTankInfoDef = [
  {
    displayName: "PipelineDispatch_TankCode",
    field: "TankCode",
    validator: [
      { minLength: 1, errorCode: "ERRMSG_TANK_MODE_CODE_EMPTY" },
      { maxLength: 50, errorCode: "PipelineDispatch_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "PipelineDispatch_ExpectedQuantity",
    field: "Quantity",
    validator: [
      { minLength: 1, errorCode: "ERRMSG_PIPELINEDISPATCH_TANKPLAN_EXPECTED_QTY_SHOULD_NOT_BE_ZERO" },
      { maxLength: 23, errorCode: "PipelineDispatch_ExceedsMaxLength" },
      {
        isDecimal: true,
        errorCode: "ShipmentOrder_InvalidQuantity",
      },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
  },
  {
    displayName: "PipelineDispatch_ExpectedStartTime",
    field: "PlannedStartTime",
    validator: [
      { minLength: 1, errorCode: "" },
      { isDate: true, errorCode: "" },
    ],
  },
  {
    displayName: "PipelineDispatch_ExpectedEndTime",
    field: "PlannedEndTime",
    validator: [
      { minLength: 1, errorCode: "" },
      { isDate: true, errorCode: "" },
    ],
  },
];

export const pipelineReceiptTankInfoDef = [
  {
    displayName: "PipelineReceipt_TankCode",
    field: "TankCode",
    validator: [
      { minLength: 1, errorCode: "ERRMSG_TANK_MODE_CODE_EMPTY" },
      { maxLength: 50, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "PipelineReceiptDetails_Quantity",
    field: "Quantity",
    validator: [
      { minLength: 1, errorCode: "ERRMSG_PIPELINERECEIPT_TANKPLAN_EXPECTED_QTY_SHOULD_NOT_BE_ZERO" },
      { maxLength: 23, errorCode: "PipelineDispatch_ExceedsMaxLength" },
      {
        isDecimal: true,
        errorCode: "ShipmentOrder_InvalidQuantity",
      },
      { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
  },
  {
    displayName: "PipelineReceiptDetails_ExpectedStartTime",
    field: "PlannedStartTime",
    validator: [
      { minLength: 1, errorCode: "" },
      { isDate: true, errorCode: "" },
    ],
  },
  {
    displayName: "PipelineReceiptDetails_ExpectedEndTime",
    field: "PlannedEndTime",
    validator: [
      { minLength: 1, errorCode: "" },
      { isDate: true, errorCode: "" },
    ],
  },
];
export const fPAssociationInfoValidationDef = [
  {
    field: "Quantity",
    displayName: "FinishedProductInfo_Quantity",
    validator: [
      { minLength: 1, errorCode: "FP_Absolute_Num_Requirred" },
      { isInt: true, errorCode: "CustomerDetails_regMobile" },
      { minIntValue: 1, errorCode: "FP_Absolute_Num_Requirred" },
      { maxIntValue: 9999999999, errorCode: "Absolute_Num_INVALID_X" },
      { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
      //{ expression: numberExpression, errorCode: "CustomerDetails_regMobile" },
    ],
  },
  {
    field: "BaseProductCode",
    displayName: "FinishedProductInfo_BaseProduct",
    validator: [
      { minLength: 1, errorCode: "BaseProductCode_ISMANDATORY_X" },
      { maxLength: 50, errorCode: "FPITEM_BASEPRODUCT_CODE_EXCEEDS_LENGTH" },
      { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    field: "AdditiveCode",
    displayName: "UnmatchedLocalTrans_Additive",
    validator: [
      { minLength: 1, errorCode: "AdditiveCode_ISMANDATORY_X" },
      { maxLength: 50, errorCode: "ADDITIVEPRODUCT_CODE_EXCEEDS_LENGTH" },
      { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
];

export const tankManualEntryDetailsDef = [
  {
    field: "TankCode",
    displayName: "TankEODEntry_TankCode",
    validator: [
      { minLength: 1, errorCode: "TankInfo_CodeRequired" },
      { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    field: "BaseProductCode",
    displayName: "TankEODEntry_Product",
    validator: [
      { minLength: 1, errorCode: "BaseProductInfo_CodeRequired" },
      { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    field: "EOPGrossVolume",
    displayName: "TankEODEntry_GrossQty",
    validator: [
      { minLength: 1, errorCode: "GrossVolume_Required" },
      { maxLength: 10, errorCode: "GrossVolume_ExceedsLength" },
      { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
      { minDecimalValue: 0, errorCode: "TankManualEntry_GrossQtyZero" }
    ],
  },
  {
    field: "EOPNetVolume",
    displayName: "TankEODEntry_NetQty",
    validator: [
      { minLength: 1, errorCode: "NetVolume_Required" },
      { maxLength: 10, errorCode: "NetVolume_ExceedsLength" },
      { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
      { minDecimalValue: 0, errorCode: "TankManualEntry_NetQtyZero" }
    ],
  },
  {
    field: "QuantityUOM",
    displayName: "TankUnaccountedTransaction_QuantityUOM",
    validator: [
      { minLength: 1, errorCode: "BaseProductInfo_UOMRequired" },
      { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    field: "EOPMassVolume",
    displayName: "TankEODEntry_MassVolume",
    validator: [
      { maxLength: 10, errorCode: "TankManualEntry_MassQtyExceedsLength" },
      { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" }
    ],
  }
]
export const railDispatchLoadSpotAssignmentDef = [
  {
    displayName: "Spur_Code",
    field: "SpurCode",
    validator: [
      { minLength: 1, errorCode: "Spur_CodeRequired" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "RailDispatchManualEntry_Cluster",
    field: "ClusterCode",
    validator: [
      { minLength: 1, errorCode: "Cluster_CodeRequired" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "ViewRailLoadingDetails_BCUCode",
    field: "BCUCode",
    validator: [
      { minLength: 1, errorCode: "BCU_CodeRequired" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "LoadingArmInfo_ArmNoInBCU",
    field: "ArmNoInBCU",
    validator: [
      { minLength: 1, errorCode: "ArmNoInBCU_Required" },
      { maxLength: 50, errorCode: "ArmNoInBCU_EXCEEDS_LENGTH" },
      { expression: numberExpression, errorCode: "ArmNoInBCU_InvalidValue" },
    ],
  },
  {
    displayName: "RailDispatchLoadSpotAssign_LoadingSeq",
    field: "LoadingSequenceNo",
    validator: [
      { minLength: 1, errorCode: "LoadingSequenceNo_Required" },
      { maxLength: 15, errorCode: "LoadingSequenceNo_EXCEEDS_LENGTH" },
      { expression: numberExpression, errorCode: "LoadingSequenceNo_InvalidValue" },
    ],
  },
  {
    displayName: "ViewRailReceiptList_ReturnQuantity",
    field: "ReturnQuantity",
    validator: [
      { minLength: 1, errorCode: "ReturnQuantity_Required" },
      { maxLength: 10, errorCode: "ReturnQuantity_EXCEEDS_LENGTH" },
      {
        isDecimal: true,
        errorCode: "ReturnQuantity_InvalidValue",
      }
    ],
  }
];
export const railReceiptLoadSpotAssignmentDef = [
  {
    displayName: "Spur_Code",
    field: "SpurCode",
    validator: [
      { minLength: 1, errorCode: "Spur_CodeRequired" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "ViewRailUnloadingDetails_BayCode",
    field: "ClusterCode",
    validator: [
      { minLength: 1, errorCode: "Cluster_CodeRequired" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" }
    ],
  },
  {
    displayName: "ViewRailLoadingDetails_BCUCode",
    field: "BCUCode",
    validator: [
      { minLength: 1, errorCode: "BCU_CodeRequired" },
      { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
  {
    displayName: "LoadingArmInfo_ArmNoInBCU",
    field: "ArmNoInBCU",
    validator: [
      { minLength: 1, errorCode: "ArmNoInBCU_Required" },
      { maxLength: 50, errorCode: "ArmNoInBCU_EXCEEDS_LENGTH" },
      {
        isDecimal: true,
        errorCode: "ArmNoInBCU_InvalidValue",
      }
    ],
  },
  {
    displayName: "RailDispatchLoadSpotAssign_LoadingSeq",
    field: "LoadingSequenceNo",
    validator: [
      { minLength: 1, errorCode: "LoadingSequenceNo_Required" },
      { maxLength: 15, errorCode: "LoadingSequenceNo_EXCEEDS_LENGTH" },
      {
        isDecimal: true,
        errorCode: "LoadingSequenceNo_InvalidValue",
      }
    ],
  },
];
export const railRecordWeightDef = [
  {
    displayName: "RailWagonConfigurationDetails_TareWeight",
    field: "TareWeight",
    validator: [
      {
        isDecimal: true, errorCode: "TAREWEIGHT_INVALID",
      },
      { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
    ],
  },
  {
    displayName: "PCDET_Planning_gvLadenWeight",
    field: "LadenWeight",
    validator: [
      {
        isDecimal: true, errorCode: "LADEN_WEIGHT_INVALID",
      },
      { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
    ],
  },
];

export const productAllocationEntityItemsDef = [
  {
    displayName: "ContractInfo_Product",
    field: "FinishedProductCode",
    validator: [
      { minLength: 1, errorCode: "ERRMSG_FINISHEDPRODUCT_INFO_EMPTY" },
      { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
    ],
  },
  {
    displayName: "ProductAllocationItemInfo_AllocationType",
    field: "AllocationType",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_AllocationType_Empty" },
    ],
  },
  {
    displayName: "ProductAllocationItemInfo_AllocationFrequency",
    field: "AllocationPeriod",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_AllocationPeriod_Empty" },
    ],
  },
  {
    displayName: "ContractInfo_StartDate",
    field: "StartDate",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_StartDate_Req" },
      { isDate: true, errorCode: "DateFormatInvalid" },
    ],
  },
  {
    displayName: "ContractInfo_EndDate",
    field: "EndDate",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_EndDate_Req" },
      { isDate: true, errorCode: "DateFormatInvalid" },
    ],
  },
  {
    displayName: "ViewShipment_UOM",
    field: "QuantityUOM",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_QtyUOM_Empty" },
    ],
  },
  {
    displayName: "ProductAllocationItemInfo_AllocatedQty",
    field: "Quantity",
    validator: [
      { minLength: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
      {
        isDecimal: true, errorCode: "ErrMsg_PAItem_Qty_Invalid",
      },
      { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
    ],
  },
  {
    displayName: "ProductAllocationItemInfo_MinimumQuantity",
    field: "MinimumQuantity",
    validator: [
      {
        isDecimal: true, errorCode: "ERRMSG_PAITEM_MINQTY_INVALID",
      },
      { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
    ],
  },
  {
    displayName: "ProductAllocationItemInfo_Deviation",
    field: "DeviationPercentOfQty",
    validator: [
      {
        isDecimal: true, errorCode: "ERRMSG_PAITEM_DEVIATIONPERCENT_INVALID",
      },
      { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
    ],
  },
]
export const BayAllocationScadaPointTableValidation = [
  {
    field: "PointName",
    displayName: "AtgConfigure_PointName",
    validator: [{
      // minLength: 1, errorCode: "DeviceInfo_PointNameRequired"
    },
    { maxLength: 50, errorCode: "DriverInfo_ExceedsMaxLength" },
    { expression: nameExpression, errorCode: nameError },],

  },
]
export const BayAllocationScadaParameterValidation = [
  {
    displayName: "AtgConfigure_ParameterName",
    field: "ParameterName",
    validator: [
      // { minLength: 1, errorCode: "DriverInfo_DriverNameRequired" },
      { maxLength: 100, errorCode: "DriverInfo_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: nameError },
    ],
  }
]
export const ATGMasterPointTableValidation = [
  {
    field: "PointName",
    displayName: "AtgConfigure_PointName",
    validator: [{
      // minLength: 1, errorCode: "DeviceInfo_PointNameRequired"
    },
    { maxLength: 50, errorCode: "DriverInfo_ExceedsMaxLength" },
    { expression: nameExpression, errorCode: nameError },],

  },
]

export const sealCompValidationDef = [
  {
    displayName: "SealMaster_SealNo",
    field: "SealNo",
    validator: [
      { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
      { expression: codeExpression, errorCode: codeError },
    ],
  },
]

export const ATGMasterParameterValidation = [
  {
    displayName: "AtgConfigure_ParameterName",
    field: "ParameterName",
    validator: [
      // { minLength: 1, errorCode: "DriverInfo_DriverNameRequired" },
      { maxLength: 100, errorCode: "DriverInfo_ExceedsMaxLength" },
      { expression: nameExpression, errorCode: nameError },
    ],
  }
]
export const ExchangeAgreementItemsPlanValidation = [
  {
    field: "StartDate",
    displayName: "ExchangeAgreementDetailsItem_StartDate",
    validator: [
      { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
    ],
  },

  {
    field: "EndDate",
    displayName: "ExchangeAgreementDetailsItem_EndDate",
    validator: [
      { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
      { denyPastDate: true, errorCode: "ExchangeAgreement_EndDateEarlier" },
    ],
  },
]

export const tankShAsscVolumeValidationDef = [
  {
    field: "Volume",
    displayName: "TankShareholderAssn_PercentageLimitQuantity",
    validator: [
      { maxLength: 15, errorCode: "Common_MaxLengthExceeded" },
      { isDecimal: true, errorCode: "VolumeInvalid" },
      { maxDecimalValue: 999999, errorCode: "Common_MaxValueExceeded" },
    ],
  }
]

export const tankShNewQtyValidationDef = [
  {
    field: "NewLimitQuantity",
    displayName: "TankShareholderAssn_ProposedLimitCapacity",
    validator: [
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { isDecimal: true, errorCode: "LimitQuantityInvalid" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  }
]
export const CustmerInittialTableValidation = [
  {
    field: "GrossAvailableQuantity",
    displayName: "CustIntialConfig_Quantity",
    validator: [
      { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
      { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
      { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
  },
  {
    field: "QuantityUOM",
    displayName: "CustInitialConfig_QuantityUOM",
    validator: [
      { minLength: 1, errorCode: "BaseProductInfo_UOMRequired" },
      { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
  },
]
export const CustomerRecipeAssociatedBPValidationDef = [
  {
    displayName: "ABSOLUTE_NUMBER",
    field: "Quantity",
    validator: [
      { minLength: 1, errorCode: "CompartmentNo_Required" },
      { expression: numberExpression, errorCode: "CUSTOMERRECIPE_ABSOLUTE_NUMBER" },
    ],
  },
];
