const codeExpression = "^[0-9a-zA-Z-_]+$";
//const nameExpression = "^[0-9a-zA-Z-_ ]+$";
const nameExpression = /^[^!%<>?\[\]^`{}|~=*]+$/;
const normalExpression = "^[0-9a-zA-Z-_ ]+$";
const cityExpression = "^[0-9a-zA-Z-, ]+$";
const contactExpression = /^[^!%<>?\[\]^`{}|~=*]+$/;
//const remarksExpression = "^[0-9a-zA-Z-_'&\"]+(s{0,1}[a-zA-Z-0-9-_ '&\"])*$";
// const emailExpression =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const emailExpression =
/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// "^([a-zA-Z0-9])+([.a-zA-Z0-9_-])*@([a-zA-Z0-9])+(.[a-zA-Z0-9_-]+)+$";
const channelAddressExpression =
    "^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])([.]([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$";

//const emailExpression =
// "^[0-9a-zA-Z-_]+([0-9a-zA-Z-_+.']+)*[@]([0-9a-zA-Z-_])+([0-9a-zA-Z-_.]+)*[.]([0-9a-zA-Z-_]+)([0-9a-zA-Z-_.]+)*$";
const numberExpression = "^[0-9]+$";
const decimalExpression = "^[0-9]+[.]*[0-9]*$";
const addressExpression = "^[^<>=*]+$";
const codeError = "Code_ValidInputCharacters";
const nameError = "Name_ValidInputCharacters";
const normalError = "Normal_ValidInputCharacters";
const cityError = "City_ValidInputCharacters";
const contactError = "Contact_ValidInputCharacters";
const addressError = "Address_ValidInputCharacters";
const timeExpression = "^(?:[01][0-9]|2[0-3]):[0-5][0-9]$"; //"([01]?[0-9]|2[0-3]):[0-5][0-9]"//"^[0-2][0-9]:[0-5][0-9]$";
const minutesExpression = "^[0-9]$|^[1-5]{1}[0-9]{1}$";
const applicationIDExpression = "^[0-9a-zA-Z-]+$";
const applicationIdError = "ApplicationID_ValidInputCharacters";

export const carrierValidationDef = {
    Code: [
        { minLength: 1, errorCode: "CarrierDetails_reqCarrierCode" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "CarrierDetails_reqCompanyName" },
        { maxLength: 100, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    PermitNumber: [
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: normalExpression, errorCode: normalError },
    ],
    Phone: [
        { maxLength: 20, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
    Mobile: [
        { maxLength: 20, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CarrierDetails_regMobile" },
    ],
    Email: [
        { maxLength: 100, errorCode: "CarrierDetails_MaxLengthExceeded" },
        {
            expression: emailExpression,
            errorCode: "CarrierDetails_regEmail",
        },
    ],
    PermitExpiryDate: [
        { minLength: 1, errorCode: "CarrierDetails_reqfldPermitExpiryDate" },
        { isDate: true, errorCode: "CarrierDetails_regexpPermitExpiryDate" },
        { denyPastDate: true, errorCode: "CarrierDetails_regexpPermitExpiryDate2" },
    ],
    Description: [
        { maxLength: 300, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    ContactPerson: [
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: contactExpression, errorCode: contactError },
    ],
    Address: [
        { maxLength: 200, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],
    ShareholderCode: [],
    ShareholderCodes: [],
    IdentityNumber: [],
    TerminalCodes: [],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression, //"^[0-9a-zA-Z-_]+(s{0,1}[a-zA-Z-0-9-_ ])*$",
            errorCode: nameError,
        },
    ],
};

export const driverValidationDef = {
    Code: [
        { minLength: 1, errorCode: "DriverInfo_DriverCodeRequired" },
        { maxLength: 50, errorCode: "DriverInfo_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "DriverInfo_DriverNameRequired" },
        { maxLength: 100, errorCode: "DriverInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CarrierCode: [
        { minLength: 1, errorCode: "DriverInfo_CarrierAssociationRequired" },
    ],
    License1: [
        { minLength: 1, errorCode: "DriverInfo_License1Required" },
        { maxLength: 50, errorCode: "DriverInfo_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],
    LanguageCode: [{ minLength: 1, errorCode: "DriverInfo_LanguageRequired" }],
    License2: [
        { maxLength: 50, errorCode: "DriverInfo_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],

    License3: [
        { maxLength: 50, errorCode: "DriverInfo_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],

    Phone: [
        { maxLength: 20, errorCode: "DriverInfo_ExceedsMaxLength" },
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
    Mobile: [
        { maxLength: 20, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "DriverInfo_MobileInvalid" },
    ],

    MailID: [
        { maxLength: 100, errorCode: "CarrierDetails_MaxLengthExceeded" },
        {
            expression: emailExpression,
            errorCode: "DriverInfo_EmailInvalid",
        },
    ],
    License1IssueDate: [
        { minLength: 1, errorCode: "DriverInfo_Lic1IssueRequired" },
        { isDate: true, errorCode: "DriverInfo_Lic1IssueFormatMsg" },
        { denyFutureDate: true, errorCode: "DriverInfo_Lic1IssueMsg" },
    ],

    License1ExpiryDate: [
        { minLength: 1, errorCode: "DriverInfo_Lic1ExpiryRequired" },
        { isDate: true, errorCode: "DriverInfo_Lic1ExpiryFormatMsg" },
        { denyPastDate: true, errorCode: "DriverInfo_Lic1ExpiryMsg" },
    ],
    License2IssueDate: [
        { isDate: true, errorCode: "DriverInfo_Lic2IssueFormatMsg" },
        { denyFutureDate: true, errorCode: "DriverInfo_Lic2IssueMsg" },
    ],
    License2ExpiryDate: [
        { isDate: true, errorCode: "DriverInfo_Lic2ExpiryFormatMsg" },
        { denyPastDate: true, errorCode: "DriverInfo_Lic2ExpiryMsg" },
    ],
    License3IssueDate: [
        { isDate: true, errorCode: "DriverInfo_Lic3IssueFormatMsg1" },
        { denyFutureDate: true, errorCode: "DriverInfo_Lic3IssueMsg" },
    ],
    License3ExpiryDate: [
        { isDate: true, errorCode: "DriverInfo_Lic3ExpiryFormatMsg" },
        { denyPastDate: true, errorCode: "DriverInfo_Lic3ExpiryMsg" },
    ],
    DateOfBirth: [
        { isDate: true, errorCode: "DriverInfo_DOBFormatMsg" },
        { denyFutureDate: true, errorCode: "DriverInfo_DOBMsg" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    HazardousLicenseExpiry: [
        { isDate: true, errorCode: "Common_InvalidDate" },
        { denyPastDate: true, errorCode: "Common_PastDate_Not_Allowed" },
    ],
};

export const customerValidationDef = {
    Code: [
        { minLength: 1, errorCode: "CustomerDetails_reqCustomerCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "CustomerDetails_reqCustomerName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Phone: [
        { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CustomerDetails_regPhone" },
    ],
    Mobile: [
        { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CustomerDetails_regMobile" },
    ],
    Email: [
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: emailExpression,
            errorCode: "CustomerDetails_regEmail",
        },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Address: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],
    ShareholderCode: [],
    TerminalCodes: [],
    TransportationTypes: [{
        minLength: 1,
        errorCode: "CustomerDetails_TransportationTypeRequired",
    }, ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    ContactPerson: [
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: contactExpression,
            errorCode: contactError,
        },
    ],
};

export const trailerValidationDef = {
    Code: [
        { minLength: 1, errorCode: "Trailer_MandatoryCode" },
        { maxLength: 50, errorCode: "TrailerInfo_CodeExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "TrailerInfo_NameRequired" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "TrailerInfo_DescriptionExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CarrierCompanyCode: [
        { minLength: 1, errorCode: "TrailerInfo_CarrierCodeRequired" },
    ],
    ProductType: [{ minLength: 1, errorCode: "TrailerInfo_ProductTypeRequired" }],
    LoadingType: [{ minLength: 1, errorCode: "TrailerInfo_LoadingTypeRequired" }],
    TareWeight: [
        { minLength: 1, errorCode: "Trailer_MandatoryTareWeight" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TrailerInfo_InvalidTareWeight" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        // {
        //   expression: decimalExpression,
        //   errorCode: "TrailerInfo_InvalidTareWeight",
        // },
    ],
    MaxLoadableWeight_UI: [
        { minLength: 1, errorCode: "TrailerInfo_MandatoryMaxAllowableWeight" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        {
            isDecimal: true,
            errorCode: "TrailerInfo_InvalidMaxAllowableWeight",
        },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    WeightUOM: [{ minLength: 1, errorCode: "Trailer_MandatoryWeightUOM" }],
    Height: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TrailerInfo_InvalidHeight" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Width: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TrailerInfo_InvalidWidth" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Length: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TrailerInfo_InvalidLength" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    HazardousLicenseExpiry: [
        { isDate: true, errorCode: "Common_InvalidDate" },
        { denyPastDate: true, errorCode: "Common_PastDate_Not_Allowed" },
    ],
};

export const originValidationDef = {
    Code: [
        { minLength: 1, errorCode: "OriginTerminal_CodeRequired" },
        { maxLength: 50, errorCode: "OriginTerminal_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "OriginTerminal_NameRequired" },
        { maxLength: 100, errorCode: "OriginTerminal_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Address: [
        { maxLength: 300, errorCode: "OriginTerminal_ExceedsMaxLength" },
        { expression: addressExpression, errorCode: addressError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "OriginTerminal_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],

    TerminalCodes: [],
    TransportationTypes: [{
        minLength: 1,
        errorCode: "OriginTerminalDetails_TransportationTypeRequired",
    }, ],
};

export const primeMoverValidationDef = {
    Code: [
        { minLength: 1, errorCode: "PrimeMover_MandatoryCode" },
        { maxLength: 50, errorCode: "PRIMEMOVER_EXCEEDS_LENGTH" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "PrimeMover_MandatoryName" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "TrailerInfo_DescriptionExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CarrierCompanyCode: [
        { minLength: 1, errorCode: "TrailerInfo_CarrierCodeRequired" },
    ],
    LicensceNo: [
        { maxLength: 50, errorCode: "PrimeMover_LicExpiryFormatMsg" },
        { expression: addressExpression, errorCode: addressError },
    ],

    licenseExpiryDate: [
        { isDate: true, errorCode: "PrimeMover_LicExpiryFormatMsg" },
        { denyPastDate: true, errorCode: "PrimeMover_LicenseExpiryMsg" },
    ],
    RoadTaxNo: [
        { maxLength: 50, errorCode: "PrimeMover_LicExpiryFormatMsg" },
        { expression: normalExpression, errorCode: normalError },
    ],
    RoadTaxNoIssueDate: [
        { isDate: true, errorCode: "PrimeMover_RoadTaxIssueFormatMsg" },
        { denyFutureDate: true, errorCode: "PrimeMover_RoadTaxIssueMsg" },
    ],
    RoadTaxNoExpiryDate: [
        { isDate: true, errorCode: "PrimeMover_RoadTaxExpFormatMsg" },
        { denyPastDate: true, errorCode: "PrimeMover_RoadTaxExpiryMsg" },
    ],
    TareWeight: [
        { minLength: 1, errorCode: "PrimeMover_MandatoryTareWeight" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        {
            isDecimal: true,
            errorCode: "TrailerInfo_InvalidTareWeight",
        },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],

    TareWeightUOM: [{ minLength: 1, errorCode: "PrimeMover_MandatoryWeightUOM" }],
    Height: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "PrimeMover_HeightInvalid" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Width: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "PrimeMover_WidthInvalid" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Length: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "PrimeMover_LengthInvalid" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    LWHUOM: [],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const rigidTruckValidationDef = {
    Code: [
        { minLength: 1, errorCode: "Vehicle_MandatoryCode" },
        { maxLength: 50, errorCode: "VEHICLE_EXCEEDS_LENGTH" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "Vehicle_MandatoryName" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "VehicleInfo_DescriptionExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CarrierCompanyCode: [
        { minLength: 1, errorCode: "VehicleInfo_CarrierCodeRequired" },
    ],

    ProductType: [{ minLength: 1, errorCode: "VehicleInfo_ProductTypeRequired" }],
    LoadingType: [{ minLength: 1, errorCode: "TrailerInfo_LoadingTypeRequired" }],
    LicenseNo: [
        { minLength: 1, errorCode: "Vehicle_LicNoRequired" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],

    LicenseNoExpiryDate: [
        { minLength: 1, errorCode: "Vehicle_LicExpRequired" },
        { isDate: true, errorCode: "Vehicle_LicExpFormatInvalid" },
        { denyPastDate: true, errorCode: "Vehicle_LicExpEarlierMsg" },
    ],

    RoadTaxNo: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: normalExpression, errorCode: normalError },
    ],
    RoadTaxNoExpiryDate: [
        { isDate: true, errorCode: "Vehicle_RoadTaxExpFormat" },
        { denyPastDate: true, errorCode: "Vehicle_RoadTaxExpEarlier" },
    ],
    RoadTaxNoIssueDate: [
        { isDate: true, errorCode: "Vehicle_RoadTaxIssueFormat" },
        { denyFutureDate: true, errorCode: "Vehicle_RoadTaxIssLater" },
    ],
    Owner: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    TareWeight: [
        { minLength: 1, errorCode: "Vehicle_MandatoryTareWeight" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        {
            isDecimal: true,
            errorCode: "VehicleInfo_InvalidTareWeight",
        },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],

    MaxLoadableWeight: [
        { minLength: 1, errorCode: "Vehicle_MandatoryMaxLoadWeight" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        {
            isDecimal: true,
            errorCode: "VehicleInfo_MandatoryMaxAllowableWeight",
        },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    WeightUOM: [{ minLength: 1, errorCode: "Vehicle_MandatoryWeightUOM" }],
    Height: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VehicleInfo_InvalidHeight" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Width: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VehicleInfo_InvalidWidth" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Length: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VehicleInfo_InvalidLength" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    LWHUOM: [],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    VehicleCustomsBondNo: [],
    BondExpiryDate: [],
};

export const vehicleValidationDef = {
    Code: [
        { minLength: 1, errorCode: "Vehicle_MandatoryCode" },
        { maxLength: 50, errorCode: "VEHICLE_EXCEEDS_LENGTH" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "Vehicle_MandatoryName" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "VehicleInfo_DescriptionExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CarrierCompanyCode: [
        { minLength: 1, errorCode: "VehicleInfo_CarrierCodeRequired" },
    ],

    ProductType: [{ minLength: 1, errorCode: "VehicleInfo_ProductTypeRequired" }],
    LicenseNo: [
        { minLength: 1, errorCode: "Vehicle_LicNoRequired" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],

    LicenseNoExpiryDate: [
        { minLength: 1, errorCode: "Vehicle_LicExpRequired" },
        { isDate: true, errorCode: "Vehicle_LicExpFormatInvalid" },
        { denyPastDate: true, errorCode: "Vehicle_LicExpEarlierMsg" },
    ],

    RoadTaxNo: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: normalExpression, errorCode: normalError },
    ],
    RoadTaxNoExpiryDate: [
        { isDate: true, errorCode: "Vehicle_RoadTaxExpFormat" },
        { denyPastDate: true, errorCode: "Vehicle_RoadTaxExpEarlier" },
    ],
    RoadTaxNoIssueDate: [
        { isDate: true, errorCode: "Vehicle_RoadTaxIssueFormat" },
        { denyFutureDate: true, errorCode: "Vehicle_RoadTaxIssLater" },
    ],
    Owner: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    Height: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VehicleInfo_InvalidHeight" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Width: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VehicleInfo_InvalidWidth" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Length: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VehicleInfo_InvalidLength" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    LWHUOM: [],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    VehicleCustomsBondNo: [],
    BondExpiryDate: [],
};

export const destinationValidationDef = {
    Code: [
        { minLength: 1, errorCode: "Dest_Code_Empty" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "Dest_Name_Empty" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Address: [
        { minLength: 1, errorCode: "Dest_Address_Empty" },
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],
    City: [
        { maxLength: 30, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: cityExpression,
            errorCode: cityError,
        },
    ],
    State: [
        //{ minLength: 1, errorCode: "Terminal_State_required" },
        { maxLength: 2, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: cityExpression,
            errorCode: cityError,
        },
    ],
    Country: [
        { maxLength: 30, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: cityExpression,
            errorCode: cityError,
        },
    ],
    ZipCode: [
        //{ minLength: 1, errorCode: "Terminal_ZipCode_required" },
        { maxLength: 9, errorCode: "Common_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CarrierDetails_regMobile" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],

    TransportationTypes: [],
};

export const shipmentValidationDef = {
    ShipmentCode: [
        { minLength: 1, errorCode: "ShipmentCompDetail_MandatoryCode" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    VehicleCode: [
        { minLength: 1, errorCode: "ShipmentCompDetail_MandatoryVehicle" },
    ],
    CarrierCode: [{ minLength: 1, errorCode: "TrailerInfo_InvalidCarrierCode" }],
    DriverCode: [],

    ScheduledDate: [
        { minLength: 1, errorCode: "ShipmentCompDetail_MandatoryScheduledDate" },
        { isDate: true, errorCode: "ShipmentCompDetail_ScheduledDateFormatMsg" },
    ],

    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    ShipmentQuantityUOM: [
        { minLength: 1, errorCode: "ShipmentCompDetail_MandatoryUOM" },
    ],

    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const finishedProductValidationDef = {
    Code: [
        { minLength: 1, errorCode: "FinishedProduct_Code_Empty" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "FinishedProduct_Name_Empty" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    ProductIndex: [
        { maxLength: 3, errorcode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "FinishedProductInfo_ProdIndexInvalid",
        },
    ],
    ProductType: [
        { minLength: 1, errorCode: "ERRMSG_BASEPRODUCT_PRODUCTTYPE_EMPTY" },
    ],
    AliasName: [
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Density: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minDecimalValue: 0, errorCode: "DENSITY_INVALID" },
        { maxLength: 18, errorCode: "BaseProductInfo_DensityInvalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    DensityUOM: [],

    ToleranceQuantity: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],

    ToleranceQuantityForMarine: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    ToleranceQuantityForPipeline: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    ToleranceQuantityForRail: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    ToleranceQuantityUOM: [],
    Color: [{ maxLength: 7, errorCode: "Common_MaxLengthExceeded" }],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    ProductFamilyCode: [],
    SFLPercent: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 100, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: 0, errorCode: "Common_InvalidValue" },
    ],
    HazardousNumber: [
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const vesselValidationDef = {
    Code: [
        { minLength: 1, errorCode: "Marine_ReceiptCompDetail_MandatoryVehicle" },
        { maxLength: 50, errorCode: "Vessel_Code_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "Vessel_MandatoryName" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CarrierCompanyCode: [
        { minLength: 1, errorCode: "Vessel_MandatoryCarrierCompany" },
    ],

    ProductType: [{ minLength: 1, errorCode: "Vessel_MandatoryProductType" }],
    LoadingType: [{ minLength: 1, errorCode: "TrailerInfo_LoadingTypeRequired" }],
    VehicleType: [{ minLength: 1, errorCode: "Vessel_MandatoryVehType" }],
    RegisteredInCountry: [
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: cityExpression, errorCode: cityError },
    ],
    LicenseNo: [
        { minLength: 1, errorCode: "Vessel_LicNoRequired" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],

    LicenseNoExpiryDate: [
        { minLength: 1, errorCode: "Vehicle_LicExpRequired" },
        { isDate: true, errorCode: "Vehicle_LicExpFormatInvalid" },
        { denyPastDate: true, errorCode: "Vehicle_LicExpEarlierMsg" },
    ],
    Height: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VesselInfo_InvalidHeight" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Width: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VesselInfo_InvalidWidth" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Length: [
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "VesselInfo_InvalidLength" },
        { minDecimalValue: 1, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    LWHUOM: [],
};

export const receiptValidationDef = {
    ReceiptCode: [
        { minLength: 1, errorCode: "Receipt_MandatoryCode" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    VehicleCode: [{ minLength: 1, errorCode: "Receipt_MandatoryVehicle" }],
    ScheduledDate: [
        { minLength: 1, errorCode: "Receipt_MandatoryArrivalDate" },
        { isDate: true, errorCode: "ShipmentCompDetail_ScheduledDateFormatMsg" },
        // { denyPastDate: true, errorCode: "ShipmentCompDetail_ScheduledDateMsg" },
    ],

    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    ReceiptQuantityUOM: [{ minLength: 1, errorCode: "Receipt_MandatoryUOM" }],

    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    // SupplierCode: [{ minLength: 1, errorCode: "Receipt_MandatorySupplier" }],
    CarrierCode: [{ minLength: 1, errorCode: "TrailerInfo_InvalidCarrierCode" }],
    DriverCode: [],
};

export const orderValidationDef = {
    OrderCode: [
        { minLength: 1, errorCode: "ShipmentOrder_MandatoryCode" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    CustomerCode: [
        { minLength: 1, errorCode: "ShipmentOrder_MandatoryCustomer" },
    ],

    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    OrderStartDate: [
        { minLength: 1, errorCode: "ShipmentOrder_MandatoryStartDate" },
        { isDate: true, errorCode: "ShipmentOrdertarttList_ToDateFormatInvalid" },
    ],

    OrderEndDate: [
        { minLength: 1, errorCode: "ShipmentOrder_MandatoryEndDate" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        { denyPastDate: true, errorCode: "ShipmentOrder_EndDateLaterThanToday" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const contractValidationDef = {
    ContractCode: [
        { minLength: 1, errorCode: "ContractInfo_CodeReq" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    CustomerCode: [{ minLength: 1, errorCode: "ContractInfo_CustomerRequired" }],

    Description: [
        { maxLength: 200, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    StartDate: [
        { minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        // { denyPastDate: true, errorCode: "ContractInfo_StartDateLater" },
    ],

    EndDate: [
        { minLength: 1, errorCode: "ContractInfo_EndDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        { denyPastDate: true, errorCode: "End date cannot be earlier than today" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const marineDispatchValidationDef = {
    DispatchCode: [
        { minLength: 1, errorCode: "Marine_ShipmentCompDetail_MandatoryCode" },
        { maxLength: 100, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    VesselCode: [
        { minLength: 1, errorCode: "Marine_ShipmentCompDetail_MandatoryVehicle" },
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    CarrierCode: [
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    QuantityUOM: [{ minLength: 1, errorCode: "ShipmentCompDetail_MandatoryUOM" }],
    GeneralTMUser: [
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],
    Description: [
        { maxLength: 300, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    ScheduledDate: [{
            minLength: 1,
            errorCode: "Marine_ShipmentCompDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Reason: [
        { minLength: 1, errorCode: "ViewShipment_MandatoryReason" },
        //{ expression: codeExpression, errorCode: codeError },
    ],
    BondNumber: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    TerminalCodes: [{ minLength: 1, errorCode: "Terminal_reqTerCode" }],
};
export const marineReceiptValidationDef = {
    ReceiptCode: [
        { minLength: 1, errorCode: "Marine_ReceiptCompDetail_MandatoryCode" },
        { maxLength: 100, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    VesselCode: [
        { minLength: 1, errorCode: "Marine_ShipmentCompDetail_MandatoryVehicle" },
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    QuantityUOM: [{ minLength: 1, errorCode: "ShipmentCompDetail_MandatoryUOM" }],
    ScheduledDate: [{
            minLength: 1,
            errorCode: "Marine_ReceiptCompDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
    CarrierCode: [
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    GeneralTMUser: [
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],
    Description: [
        { maxLength: 300, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Reason: [
        { minLength: 1, errorCode: "ViewShipment_MandatoryReason" },
        //{ expression: codeExpression, errorCode: codeError },
    ],
    BondNumber: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    TerminalCodes: [{ minLength: 1, errorCode: "Terminal_reqTerCode" }],
};

export const railDispatchValidationDef = {
    DispatchCode: [
        { minLength: 1, errorCode: "RailDispatchPlanDetail_CodeReq" },
        { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    RouteCode: [{
            minLength: 1,
            errorCode: "RailRouteConfigurationDetails_MandatoryRailRouteCode",
        },
        { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],
    ScheduledDate: [{
            minLength: 1,
            errorCode: "RailDispatchPlanDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
    Description: [
        { maxLength: 300, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CreatedFromEntity: [{
            minLength: 1,
            errorCode: "RailRouteConfigurationDetails_MandatoryRailRouteCode",
        },
        { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],
    CompartmentSeqNoInVehicle: [
        { minLength: 1, errorCode: "CompartmentNo_Required" },
        { expression: numberExpression, errorCode: "CompartmentNo_Required" },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const railReceiptValidationDef = {
    ReceiptCode: [
        { minLength: 1, errorCode: "Marine_ReceiptCompDetail_MandatoryCode" },
        { maxLength: 50, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],

    ScheduledDate: [{
            minLength: 1,
            errorCode: "Marine_ReceiptCompDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
    Description: [
        { maxLength: 300, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    Name: [
        { minLength: 1, errorCode: "CustomerDetails_reqCustomerName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const supplierValidationDef = {
    Code: [
        { minLength: 1, errorCode: "Supplier_Code_Empty" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "Supplier_Name_Empty" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Phone: [
        { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CustomerDetails_regPhone" },
    ],
    Mobile: [
        { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CustomerDetails_regMobile" },
    ],
    Email: [
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: emailExpression,
            errorCode: "CustomerDetails_regEmail",
        },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Address: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    ContactPerson: [
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: contactExpression,
            errorCode: contactError,
        },
    ],
    TransportationTypes: [],
};

export const railRouteValidationDef = {
    RouteCode: [{
            minLength: 1,
            errorCode: "RailRouteConfigurationDetails_MandatoryRailRouteCode",
        },
        { maxLength: 50, errorCode: "RailDispatchPlanDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const railWagonValidationDef = {
    Code: [
        { minLength: 1, errorCode: "RailWagonConfigurationDetails_MandatoryCode" },
        { maxLength: 50, errorCode: "OriginTerminal_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    Name: [
        { minLength: 1, errorCode: "RailWagonConfigurationDetails_MandatoryName" },
        { maxLength: 100, errorCode: "OriginTerminal_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    CarrierCompanyCode: [{
        minLength: 1,
        errorCode: "RailWagonConfigurationDetails_MandatoryCategory",
    }, ],
    RailWagonCategory: [{
        minLength: 1,
        errorCode: "RailWagonConfigurationDetails_MandatoryCategory",
    }, ],
    ProductType: [{
        minLength: 1,
        errorCode: "RailWagonConfigurationDetails_MandatoryProductType",
    }, ],
    LoadingType: [{
        minLength: 1,
        errorCode: "RailWagonConfigurationDetails_MandatoryLoadingType",
    }, ],
    NoOfSeals: [
        { expression: numberExpression, errorCode: "SealMaster_Startseal_integer" },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
    ],
    RemarksForCripple: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    TareWeight: [
        { minLength: 1, errorCode: "Trailer_MandatoryTareWeight" },
        { maxLength: 30, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TrailerInfo_InvalidTareWeight" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    MaxLoadableWeight: [{
            minLength: 1,
            errorCode: "RailWagonConfigurationDetails_MandatoryMaxLoadableWeight",
        },
        { maxLength: 30, errorCode: "OriginTerminal_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "TrailerInfo_InvalidTareWeight" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    WeightUOM: [{
        minLength: 1,
        errorCode: "RailWagonConfigurationDetails_MandatoryUnitforWeight",
    }, ],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const pipelineDispatchValidationDef = {
    PipelineDispatchCode: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryCode" },
        { maxLength: 100, errorCode: "PipelineDispatch_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    CustomerCode: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryCustomer" },
        { maxLength: 50, errorCode: "PipelineDispatch_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    DestinationCode: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryDestination" },
        { maxLength: 50, errorCode: "PipelineDispatch_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    PipelineHeaderCode: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryHeader" },
        { maxLength: 50, errorCode: "PipelineDispatch_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    PipelineHeaderMeterCode: [
        { maxLength: 50, errorCode: "PipelineDispatch_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    Quantity: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryQuantity" },
        { maxLength: 18, errorCode: "PipelineDispatch_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    QuantityUOM: [{ minLength: 1, errorCode: "PipelineDispatch_MandatoryUOM" }],
    FinishedProductCode: [{
        minLength: 1,
        errorCode: "PipelineDispatch_MandatoryFinishedProduct",
    }, ],
    ScheduledStartTime: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryExpectedStartTime" },
        { isDate: true, errorCode: "" },
    ],
    ScheduledEndTime: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryExpectedEndTime" },
        { isDate: true, errorCode: "" },
    ],
};

export const pipelineReceiptValidationDef = {
    PipelineReceiptCode: [
        { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryCode" },
        { maxLength: 100, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    SupplierCode: [
        { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryCustomerCode" },
        { maxLength: 50, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    OriginTerminalCode: [
        { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryDestination" },
        { maxLength: 50, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    PipelineHeaderCode: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryHeader" },
        { maxLength: 50, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    Quantity: [
        { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryQuantity" },
        { maxLength: 18, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    QuantityUOM: [
        { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryUOM" },
        { maxLength: 50, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    FinishedProductCode: [{
            minLength: 1,
            errorCode: "PipelineReceiptDetails_MandatoryFinishedProductCode",
        },
        { maxLength: 50, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    ScheduledStartTime: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryExpectedStartTime" },
        { isDate: true, errorCode: "" },
    ],
    ScheduledEndTime: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryExpectedEndTime" },
        { isDate: true, errorCode: "" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    TerminalCodes: [],
};

export const smsConfigurationValidationDef = {
    SMSMessageCode: [
        { minLength: 1, errorCode: "SMSConfig_Code_Empty" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    EmailSMSEntityType: [
        { minLength: 1, errorCode: "SMSConfig_EntityType_Empty" },
    ],
    EntityParamType: [{ maxLength: 50, errorCode: "Common_MaxLengthExceeded" }],
    MessageText: [{
            minLength: 1,
            errorCode: "SMSMESSAGE_MESSAGE_EMPTY_X",
        },
        { maxLength: 500, errorCode: "Common_MaxLengthExceeded" },
    ],
    RecipientList: [],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const emailConfigurationValidationDef = {
    EmailMessageCode: [
        { minLength: 1, errorCode: "EmailConfiguration_EnterCode" },
        { maxLength: 50, errorCode: "EmailConfiguration_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    EmailSMSEntityType: [
        { minLength: 1, errorCode: "SMSConfiguration_EntityType_Empty" },
    ],
    Subject: [
        { minLength: 1, errorCode: "EmailConfiguration_Subject_Empty" },
        { maxLength: 256, errorCode: "EmailConfiguration_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    MessageText: [
        { minLength: 1, errorCode: "EMAILMESSAGE_MESSAGE_EMPTY_X" },
        { maxLength: 256, errorCode: "EmailConfiguration_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const HSEConfigurationValidationDef = {
    TransactionType: [
        { minLength: 1, errorCode: "HSE_TransactionType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    TransportationUnit: [
        { minLength: 1, errorCode: "HSE_TransportationUnit_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    TransportationUnitType: [
        { minLength: 1, errorCode: "HSE_TransportationUnitType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    LocationTypeCode: [
        { minLength: 1, errorCode: "HSE_LocationType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    Description: [
        { maxLength: 300, errorCode: "VehicleInfo_DescriptionExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const nonFillingVehicleValidationDef = {
    Code: [
        { minLength: 1, errorCode: "Vehicle_MandatoryCode" },
        { maxLength: 50, errorCode: "VEHICLE_EXCEEDS_LENGTH" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "Vehicle_MandatoryName" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "VehicleInfo_DescriptionExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    CarrierCompanyCode: [
        { minLength: 1, errorCode: "VehicleInfo_CarrierCodeRequired" },
    ],
    LicenseNo: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],

    LicenseNoExpiryDate: [
        { isDate: true, errorCode: "Vehicle_LicExpFormatInvalid" },
        { denyPastDate: true, errorCode: "Vehicle_LicExpEarlierMsg" },
    ],

    RoadTaxNo: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: normalExpression, errorCode: normalError },
    ],
    RoadTaxNoExpiryDate: [
        { isDate: true, errorCode: "Vehicle_RoadTaxExpFormat" },
        { denyPastDate: true, errorCode: "Vehicle_RoadTaxExpEarlier" },
    ],
    RoadTaxNoIssueDate: [
        { isDate: true, errorCode: "Vehicle_RoadTaxIssueFormat" },
        { denyFutureDate: true, errorCode: "Vehicle_RoadTaxIssLater" },
    ],
    Owner: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const shareholderValidationDef = {
    ShareholderCode: [
        { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],

    ShareholderName: [
        { minLength: 1, errorCode: "ShareholderDetails_ShareholderNameRequired" },
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    TerminalCodes: [],
};

export const locationValidationDef = {
    LocationCode: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    LocationName: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Code: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    BayPriority: [
        { expression: numberExpression, errorCode: "SealMaster_Startseal_integer" },
        { maxLength: 2, errorCode: "CustomerDetails_MaxLengthExceeded" },
    ],
    MaximumQueue: [
        { expression: numberExpression, errorCode: "SealMaster_Startseal_integer" },
        { maxLength: 2, errorCode: "CustomerDetails_MaxLengthExceeded" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
};

export const gantryValidationDef = {
    Code: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    EntityRemarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
};
export const baseProductValidationDef = {
    Code: [
        { minLength: 1, errorCode: "BaseProductInfo_CodeRequired" },
        { maxLength: 100, errorCode: "BASEPRODUCTCODE_EXCEEDS_LENGTH" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "BaseProductInfo_NameReq" },
        { maxLength: 100, errorCode: "BaseProductInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "BaseProductInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    MinDensity: [
        { minLength: 1, errorCode: "BaseProductInfo_MinDensityRequired" },
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "BaseProductInfo_DensityInvalid" },
        { minDecimalValue: 0, errorCode: "BaseProductInfo_MinDensityRequired" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    MaxDensity: [
        { minLength: 1, errorCode: "BaseProductInfo_MaxDensityRequired" },
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "BaseProductInfo_DensityInvalid" },
        { minDecimalValue: 0, errorCode: "BaseProductInfo_MaxDensityRequired" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    AliasName: [
        { maxLength: 100, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    HazchemCode: [
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
};

export const loadingArmValidationDef = {
    Code: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    ArmNumberInBCU: [
        { minLength: 1, errorCode: "LoadingArmInfo_ArmNoInBCURequired" },
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
    BlendType: [
        { minLength: 1, errorCode: "FinishedProductInfo_BlendTypeRequired" },
    ],
    ArmLoadingType: [
        { minLength: 1, errorCode: "LoadingArm_ArmLoadingTypeRequired" },
    ],
    NodeAddress: [
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
    CleanLineFinishQuantity: [
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
    MinimumLoadableQuantity: [
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
};

export const islandValidationDef = {
    Code: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    EntityRemarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
};
export const terminalValidationDef = {
    Code: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Longitude: [
        { minLength: 1, errorCode: "Longitude_reqCode" },
        { maxLength: 10, errorCode: "Common_MaxValueExceeded" },
        { isDecimal: true, errorCode: "TerminalInfo_InvalidLongitude" },
        { minDecimalValue: -180.1, errorCode: "Longitude_MinValue" },
        { maxDecimalValue: 180, errorCode: "Common_MaxValueExceeded" },
    ],
    Latitude: [
        { minLength: 1, errorCode: "Latitude_reqCode" },
        { maxLength: 10, errorCode: "Common_MaxValueExceeded" },
        { isDecimal: true, errorCode: "TerminalInfo_InvalidLatitude" },
        { minDecimalValue: -90.1, errorCode: "Latitude_MinValue" },
        { maxDecimalValue: 90, errorCode: "Common_MaxValueExceeded" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    City: [
        { minLength: 1, errorCode: "Terminal_City_required" },
        { maxLength: 30, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: cityExpression,
            errorCode: cityError,
        },
    ],
    State: [
        { minLength: 1, errorCode: "Terminal_State_required" },
        { maxLength: 2, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: cityExpression,
            errorCode: cityError,
        },
    ],
    Country: [
        { minLength: 1, errorCode: "Terminal_Country_required" },
        { maxLength: 30, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: cityExpression,
            errorCode: cityError,
        },
    ],
    ZipCode: [
        { minLength: 1, errorCode: "Terminal_ZipCode_required" },
        { maxLength: 9, errorCode: "Common_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CarrierDetails_regMobile" },
    ],
    ContactPerson: [
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: contactExpression,
            errorCode: contactError,
        },
    ],
    Address: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],
    Phone: [
        { maxLength: 20, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CustomerDetails_regPhone" },
    ],
    Email: [
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: emailExpression,
            errorCode: "CustomerDetails_regEmail",
        },
    ],
};

export const leakageManualEntryValidationDef = {
    MeterCode: [
        { minLength: 1, errorCode: "HSE_TransactionType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    LeakageQty: [
        { minLength: 1, errorCode: "PipelineReceiptDetails_MandatoryQuantity" },
        { maxLength: 10, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    LeakageQtyUom: [
        { minLength: 1, errorCode: "HSE_TransactionType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    ProductCode: [
        { minLength: 1, errorCode: "HSE_TransactionType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    ProductCategory: [
        { minLength: 1, errorCode: "HSE_TransactionType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    TankCode: [
        { minLength: 1, errorCode: "HSE_TransactionType_MandatoryCode" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    GrossStartTotalizer: [
        { maxLength: 10, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    GrossEndTotalizer: [
        { maxLength: 10, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    NetStartTotalizer: [
        { maxLength: 10, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    NetEndTotalizer: [
        { maxLength: 10, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    Density: [
        { maxLength: 10, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "PipelineReceiptDetails_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "ShipmentOrder_InvalidQuantity" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    UpdatedTime: [{
            minLength: 1,
            errorCode: "Marine_ReceiptCompDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
    StartTime: [{
            minLength: 1,
            errorCode: "Marine_ReceiptCompDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
    EndTime: [{
            minLength: 1,
            errorCode: "Marine_ReceiptCompDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
};
export const UnAccountedTransactionTankValidationDef = {
    TankCode: [{ minLength: 1, errorCode: "ERRMSG_TANK_CODE_EMPTY" }],
    UnAccountedTransactionTypeCode: [
        { minLength: 1, errorCode: "TankTransactionType_CODE_EMPTY" },
    ],

    TransportationType: [
        { minLength: 1, errorCode: "TRANSPORTATIONTYPE_EMPTY_X" },
    ],
    QuantityUOM: [{
        minLength: 1,
        errorCode: "Trailer_MandatoryWeightUOM",
    }, ],
    UnAccountedGrossQuantity: [
        { minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryGrossQuantity" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minDecimalValue: 0, errorCode: "LoadingDetailsEntry_GrossQuantityZero" },
    ],
    UnAccountedNetQuantity: [
        { minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryNetQuantity" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    Density: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minLength: 1, errorCode: "DENSITY_EMPTY_X" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    DensityUOM: [{ minLength: 1, errorCode: "Reconciliation_selectDensityUOM" }],
    TransactionStartTime: [
        { minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
    ],

    TransactionEndTime: [
        { minLength: 1, errorCode: "ContractInfo_EndDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        { denyPastDate: true, errorCode: "End date cannot be earlier than today" },
    ],
    BaseProductCode: [{ minLength: 1, errorCode: "BASEPRODUCTCODE_EMPTY_X" }],
    Comments: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const UnAccountedTransactionMeterValidationDef = {
    MeterCode: [{ minLength: 1, errorCode: "ERRMSG_KEYDATA_METER_EMPTY" }],
    TankCode: [{ minLength: 1, errorCode: "ERRMSG_TANK_CODE_EMPTY" }],
    TransactionStartTime: [
        { minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
    ],
    TransactionEndTime: [
        { minLength: 1, errorCode: "ContractInfo_EndDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        { denyPastDate: true, errorCode: "End date cannot be earlier than today" },
    ],
    DensityUOM: [{ minLength: 1, errorCode: "Reconciliation_selectDensityUOM" }],
    Density: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minLength: 1, errorCode: "DENSITY_EMPTY_X" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    QuantityUOM: [{
        minLength: 1,
        errorCode: "Trailer_MandatoryWeightUOM",
    }, ],
    UnAccountedNetQuantity: [
        { minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryNetQuantity" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minDecimalValue: 0, errorCode: "ErrMsg_PAItem_Qty_Invalid" },
    ],
    UnAccountedGrossQuantity: [
        { minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryGrossQuantity" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minDecimalValue: 0, errorCode: "LoadingDetailsEntry_GrossQuantityZero" },
    ],
    GrossStartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minLength: 1, errorCode: "Reconciliation_EnterStartGrossTotalizer" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { minDecimalValue: 0, errorCode: "Reconciliation_QtyToBeGrtrThanZero" },
    ],
    GrossEndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minLength: 1, errorCode: "Reconciliation_EnterEndGrossTotalizer" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { minDecimalValue: 0, errorCode: "Reconciliation_QtyToBeGrtrThanZero" },
    ],
    NetStartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minLength: 1, errorCode: "Reconciliation_EnterStartNetTotalizer" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { minDecimalValue: 0, errorCode: "Reconciliation_QtyToBeGrtrThanZero" },
    ],
    NetEndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minLength: 1, errorCode: "Reconciliation_EnterEndNetTotalizer" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { minDecimalValue: 0, errorCode: "Reconciliation_QtyToBeGrtrThanZero" },
    ],
    BaseProductCode: [{ minLength: 1, errorCode: "BASEPRODUCTCODE_EMPTY_X" }],
    TransportationType: [
        { minLength: 1, errorCode: "TRANSPORTATIONTYPE_EMPTY_X" },
    ],
    UnAccountedTransactionTypeCode: [
        { minLength: 1, errorCode: "Reconciliation_SelectUnAccountedType" },
    ],
    Comments: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const HSEInspectionValidationDef = {
    TransactionType: [
        { minLength: 1, errorCode: "TransactionTypeRequired" },
        { expression: codeExpression, errorCode: codeError },
    ],
    LocationCode: [
        { minLength: 1, errorCode: "SAOrderRegistration_LocationRequired" },
        { expression: codeExpression, errorCode: codeError },
    ],
    CardReader: [
        { minLength: 1, errorCode: "BCU_reqCardreader" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const tankGroupValidationDef = {
    Code: [
        { minLength: 1, errorCode: "TankGroupInfo_CodeRequired" },
        { maxLength: 50, errorCode: "TANKGROUPCODE_EXCEEDS_LENGTH_X" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { maxLength: 100, errorCode: "BaseProductInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 100, errorCode: "BaseProductInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    BaseProductCode: [{ minLength: 1, errorCode: "TankGroupInfo_BPRequired" }],
};

export const meterValidationDef = {
    Code: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationCode" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "LocationDetails_reqLocationName" },
        { maxLength: 100, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    MeterNumber: [
        { expression: numberExpression, errorCode: "SealMaster_Startseal_integer" },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    TankGroupCode: [],
    ProductDensityInput: [
        { expression: numberExpression, errorCode: "SealMaster_Startseal_integer" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    ConjunctionNumber: [],
    MeterBaseUOM: [],
    // MeterBaseUOM: [{
    //   minLength: 1, errorCode: "TankInfo_UOMRequired"
    // }]
};

export const mapTransactionsValidationDef = {
    EntityCode: [{
        minLength: 1,
        errorCode: "ERRMSG_RECEIPT_TRAILER_WEIGH_BRIDGE_DATA_UNLOAD_CODE_EMPTY",
    }, ],
    WagonCode: [{
        minLength: 1,
        errorCode: "ERRMSG_RAILDISPATCH_COMPDETAILPLAN_TRAILER_EMPTY",
    }, ],
};

export const tankValidationDef = {
    Code: [
        { minLength: 1, errorCode: "TankInfo_CodeRequired" },
        { maxLength: 50, errorCode: "TANKCODE_EXCEEDS_LENGTH" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { maxLength: 100, errorCode: "BaseProductInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "BaseProductInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    TankGroupCode: [{ minLength: 1, errorCode: "TankInfo_TankGroupRequired" }],
    Capacity: [
        { minLength: 1, errorCode: "TankInfo_CapacityRequired" },
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    CapacityUOM: [{ minLength: 1, errorCode: "TankInfo_CapacityRequiredUOM" }],
    Density: [
        { minLength: 1, errorCode: "TankInfo_DensityRequired" },
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    DensityUOM: [{ minLength: 1, errorCode: "TankInfo_DensityUOMRequired" }],
    AvailableRoom: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    GrossVolume: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    NetVolume: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    WaterVolume: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    TankLevel: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    WaterLevel: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    Temperature: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    Pressure: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    VapourGrossQuantity: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    VapourNetQuantity: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    GrossMassUOM: [],
    GrossVolumeUOM: [],
    NetVolumeUOM: [],
    WaterVolumeUOM: [],
    LevelUOM: [],
    TemperatureUOM: [],
    PressureUOM: [],
    VapourUOM: [],
};

export const temporaryCardValidationDef = {
    PIN: [{ minLength: 1, errorCode: "AccessCardInfo_x_CodeRequired" }],
    CardType: [
        { minLength: 1, errorCode: "AccessCardInfo_x_SelectCardCategory" },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    ExpiryDate: [
        { minLength: 1, errorCode: "AccessCardInfo_x_CardExpRequired" },
        { isDate: true, errorCode: "AccessCardInfo_ExpirydateMsg" },
    ],
    FASCN: [{ minLength: 1, errorCode: "AccessCardInfo_InvalidFASCN" }],
};
export const accessIDValidationDef = {
    PIN: [{ minLength: 1, errorCode: "AccessCardInfo_x_CodeRequired" }],
    CardType: [
        { minLength: 1, errorCode: "AccessCardInfo_x_SelectCardCategory" },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    ExpiryDate: [
        { minLength: 1, errorCode: "AccessCardInfo_x_CardExpRequired" },
        { isDate: true, errorCode: "AccessCardInfo_ExpirydateMsg" },
    ],
    FASCN: [{ minLength: 1, errorCode: "AccessCardInfo_InvalidFASCN" }],
};

export const accessIDSectionValidationDef = {
    CarrierCode: [{ minLength: 1, errorCode: "AccessCardInfo_CarrierRequired" }],
    EntityName: [{ minLength: 1, errorCode: "AccessCardInfo_IssuedToRequired" }],
    EntityValue: [
        { minLength: 1, errorCode: "AccessCardInfo_EntityCodeRequire" },
    ],
};

export const marineReceiptCompartmentValidationDef = {
    ReceiptCode: [
        { minLength: 1, errorCode: "Marine_ReceiptCompDetail_MandatoryCode" },
        { maxLength: 100, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    VesselCode: [
        { minLength: 1, errorCode: "Marine_ShipmentCompDetail_MandatoryVehicle" },
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    QuantityUOM: [{ minLength: 1, errorCode: "ShipmentCompDetail_MandatoryUOM" }],
    ScheduledDate: [{
            minLength: 1,
            errorCode: "Marine_ReceiptCompDetail_MandatoryScheduledDate",
        },
        {
            isDate: true,
            errorCode: "Marine_ShipmentCompDetail_ScheduledDateFormatMsg",
        },
    ],
    CarrierCode: [
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    GeneralTMUser: [
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: normalExpression, errorCode: normalError },
    ],
    Description: [
        { maxLength: 300, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const marineReceiptManualEntryValidationDef = {
    CompartmentSeqNoInVehicle: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryCompartmentSeqno",
    }, ],
    BayCode: [
        { minLength: 1, errorCode: "MarineReceiptManualEntry_MandatoryBay" },
    ],
    BCUCode: [{ minLength: 1, errorCode: "BCU_reqBCUCode" }],
    UnLoadingArm: [{ minLength: 1, errorCode: "LOADINGARM_EMPTY_X" }],
    StartTime: [{
            minLength: 1,
            errorCode: "MarineReceiptManualEntry_MandatoryUnLoadStartTime",
        },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_Starttime_Future_Error",
        },
    ],
    EndTime: [{
            minLength: 1,
            errorCode: "MarineReceiptManualEntry_MandatoryUnLoadEndTime",
        },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_End_Future_Error",
        },
    ],
    FinishedProductCode: [],
    QuantityUOM: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryQuantityUOM",
    }, ],
    TransactionID: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "Meter_NumbersOnly" },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineReceiptManualEntry_MandatoryGrossQuantity",
        },
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Temperature: [
        { maxLength: 5, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        { maxLength: 6, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    ProductDensityUOM: [],
    ReferenceDensity: [
        { maxLength: 50, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    MeterCode: [],
    StartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    MassUOM: [],
    Pressure: [
        { maxLength: 8, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    PressureUOM: [],
    CalculatedGross: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    CalculatedValueUOM: [],
};

export const marineReceiptManualEntryBPValidationDef = {
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineReceiptManualEntry_MandatoryGrossQuantity",
        },
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Temperature: [
        { maxLength: 5, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        { maxLength: 6, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    ProductDensityUOM: [],
    ReferenceDensity: [
        { maxLength: 50, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    MeterCode: [],
    StartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    MassUOM: [],
    Pressure: [
        { maxLength: 8, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    PressureUOM: [],
    CalculatedGross: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    CalculatedValueUOM: [],

    TankCode: [],
    TankStartGrossQuantity: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    TankEndGrossQuantity: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    TankStartNetQuantity: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    TankEndNetQuantity: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    TankStartGrossMass: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    TankEndGrossMass: [
        { maxLength: 12, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    TankStartPressure: [
        { maxLength: 8, errorCode: "Marine_ReceiptCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineReceiptManualEntry_DecimalFormat" },
    ],
    TankEndPressure: [
        { maxLength: 8, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
};

export const accessCardValidationDef = {
    PIN: [
        { minLength: 1, errorCode: "AccessCardInfo_x_CodeRequired" },
        { expression: codeExpression, errorCode: "AccessCardInfo_PINRequire" },
    ],
    CardType: [
        { minLength: 1, errorCode: "AccessCardInfo_x_SelectCardCategory" },
    ],
    ExpiryDate: [
        { minLength: 1, errorCode: "AccessCardInfo_x_CardExpRequired" },
        { isDate: true, errorCode: "AccessCardInfo_x_CardExpRequired" },
    ],
    CarrierCode: [{ minLength: 1, errorCode: "AccessCardInfo_CarrierRequired" }],
    EntityName: [{ minLength: 1, errorCode: "AccessCardInfo_IssuedToRequired" }],
    EntityValue: [
        { minLength: 1, errorCode: "AccessCardInfo_EntityCodeRequire" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    Description: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    FASCN: [{ minLength: 1, errorCode: "Common_MaxLengthExceeded" }],
};
export const sealMasterValidationDef = {
    Code: [
        { minLength: 1, errorCode: "SealMaster_Code_Errormsg" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Prefix: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Suffix: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    CurrentSealNo: [
        { minLength: 1, errorCode: "SealMaster_Current_Errormsg" },
        { maxLength: 6, errorCode: "Common_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "SealMaster_Startseal_integer" },
    ],
    EndSealNo: [
        { maxLength: 6, errorCode: "Common_MaxLengthExceeded" },
        { minLength: 1, errorCode: "SealMaster_End_Errormsg" },
        { expression: numberExpression, errorCode: "SealMaster_Startseal_integer" },
    ],
    StartSealNo: [
        { maxLength: 6, errorCode: "Common_MaxLengthExceeded" },
        { minLength: 1, errorCode: "SealMaster_Start_Errormsg" },
        {
            expression: numberExpression,
            errorCode: "SealMaster_Startseal_integer",
        },
    ],
};

export const marineShipmentManualEntryValidationDef = {
    CompartmentSeqNoInVehicle: [{
        minLength: 1,
        errorCode: "MarineDispatchManualEntry_MandatoryCompartmentSeqno",
    }, ],
    BayCode: [
        { minLength: 1, errorCode: "MarineDispatchManualEntry_MandatoryBay" },
    ],
    BCUCode: [{ minLength: 1, errorCode: "BCU_reqBCUCode" }],
    LoadingArm: [{ minLength: 1, errorCode: "LOADINGARM_EMPTY_X" }],
    StartTime: [{
            minLength: 1,
            errorCode: "MarineDispatchManualEntry_MandatoryLoadStartTime",
        },
        {
            isDate: true,
            errorCode: "MarineDispatchManualEntry_MandatoryLoadStartTime",
        },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_Starttime_Future_Error",
        },
    ],
    EndTime: [{
            minLength: 1,
            errorCode: "MarineDispatchManualEntry_MandatoryLoadEndTime",
        },
        {
            isDate: true,
            errorCode: "MarineDispatchManualEntry_MandatoryLoadEndTime",
        },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_End_Future_Error",
        },
    ],
    FinishedProductCode: [],
    QuantityUOM: [{
        minLength: 1,
        errorCode: "MarineDispatchManualEntry_MandatoryQuantityUOM",
    }, ],
    TransactionID: [],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineDispatchManualEntry_MandatoryGrossQuantity",
        },
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    Temperature: [
        { maxLength: 5, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        { maxLength: 6, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    ProductDensityUOM: [],
    ReferenceDensity: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    MeterCode: [],
    StartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    MassUOM: [],
    Pressure: [
        { maxLength: 8, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    PressureUOM: [],
    CalculatedGross: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    CalculatedValueUOM: [],
};

export const marineShipmentManualEntryBPValidationDef = {
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineDispatchManualEntry_MandatoryGrossQuantity",
        },
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Temperature: [
        { maxLength: 5, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        { maxLength: 6, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    ProductDensityUOM: [],
    ReferenceDensity: [
        { maxLength: 50, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    MeterCode: [],
    StartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    MassUOM: [],
    Pressure: [
        { maxLength: 8, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    PressureUOM: [],
    CalculatedGross: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    CalculatedValueUOM: [],

    TankCode: [],
    TankStartGrossQuantity: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TankEndGrossQuantity: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TankStartNetQuantity: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TankEndNetQuantity: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TankStartMass: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TankEndMass: [
        { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TankStartPressure: [
        { maxLength: 8, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
    TankEndPressure: [
        { maxLength: 8, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "MarineDispatchManualEntry_DecimalFormat" },
    ],
};

export const railDispatchCompartmentManualEntryValidationDef = {
    BayCode: [
        { minLength: 1, errorCode: "ERRMSG_TRANSACTIONAUDITINFO_BAYCODE_EMPTY" },
        { expression: codeExpression, errorCode: codeError },
    ],
    BCUCode: [
        { minLength: 1, errorCode: "BCU_reqBCUCode" },
        { expression: codeExpression, errorCode: codeError },
    ],
    LoadingArm: [
        { minLength: 1, errorCode: "LOADINGARM_EMPTY_X" },
        { expression: codeExpression, errorCode: codeError },
    ],
    TransactionID: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "SAManualEntry_OnlyNumber" },
    ],
    StartTime: [
        { minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_Starttime_Future_Error",
        },
    ],
    EndTime: [
        { minLength: 1, errorCode: "ContractInfo_EndDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_End_Future_Error",
        },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    GrossQuantity: [
        { minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryGrossQuantity" },
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Temperature: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    ProductDensity: [
        { maxLength: 6, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    StartTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    CalculatedGross: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
};

export const mapSlotParameterValidationDef = {
    AdvanceSlotBookMaxDays: [{
            minLength: 1,
            errorCode: "SlotConfiguration_AdvanceSlotBookMaxDays_required",
        },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    BookAdvSlotMinutes: [{
            minLength: 1,
            errorCode: "SlotConfiguration_BookAdvSlotMinutes_required",
        },
        { maxLength: 4, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    ChangeAdvSlotMinutes: [{
            minLength: 1,
            errorCode: "SlotConfiguration_ChangeAdvSlotMinutes_required",
        },
        { maxLength: 4, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    MaxNoOfSlots: [
        { minLength: 1, errorCode: "SlotConfiguration_MaxNoOfSlots_required" },
        { maxLength: 4, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    PostLoadingDuration: [{
            minLength: 1,
            errorCode: "SlotConfiguration_PostLoadingDuration_required",
        },
        { maxLength: 4, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    PreLoadingDuration: [{
            minLength: 1,
            errorCode: "SlotConfiguration_PreLoadingDuration_required",
        },
        { maxLength: 4, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    RefreshInterval: [
        { minLength: 1, errorCode: "SlotConfiguration_RefreshInterval_required" },
        { maxLength: 4, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    SlotDuration: [
        { minLength: 1, errorCode: "SlotConfiguration_SlotDuration_required" },
        { maxLength: 4, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    SlotEndTime: [
        { minLength: 1, errorCode: "SlotConfiguration_SlotEndTime_required" },
        {
            expression: timeExpression,
            errorCode: "SlotConfiguration_SlotParam_TimeValidation",
        },
    ],
    SlotStartTime: [
        { minLength: 1, errorCode: "SlotConfiguration_SlotStartTime_required" },
        {
            expression: timeExpression,
            errorCode: "SlotConfiguration_SlotParam_TimeValidation",
        },
    ],
};

export const railReceiptCompartmentManualEntryValidationDef = {
    BayCode: [
        { minLength: 1, errorCode: "ERRMSG_TRANSACTIONAUDITINFO_BAYCODE_EMPTY" },
        { expression: codeExpression, errorCode: codeError },
    ],
    BCUCode: [
        { minLength: 1, errorCode: "BCU_reqBCUCode" },
        { expression: codeExpression, errorCode: codeError },
    ],
    LoadingArm: [
        { minLength: 1, errorCode: "LOADINGARM_EMPTY_X" },
        { expression: codeExpression, errorCode: codeError },
    ],
    TransactionID: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "SAManualEntry_OnlyNumber" },
    ],
    StartTime: [
        { minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_Starttime_Future_Error",
        },
    ],
    EndTime: [
        { minLength: 1, errorCode: "ContractInfo_EndDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_End_Future_Error",
        },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],

    GrossQuantity: [
        { minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryGrossQuantity" },
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    Temperature: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    ProductDensity: [
        { maxLength: 6, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    StartTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    CalculatedGross: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
    ],
};

export const railReceiptManualEntryValidationDef = {
    CompartmentSeqNoInVehicle: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryCompartmentSeqno",
    }, ],
    BayCode: [
        { minLength: 1, errorCode: "MarineReceiptManualEntry_MandatoryBay" },
    ],
    BCUCode: [],
    UnLoadingArm: [],
    StartTime: [
        { minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
    ],
    EndTime: [
        { minLength: 1, errorCode: "ContractInfo_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
    ],
    FinishedProductCode: [],
    QuantityUOM: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryQuantityUOM",
    }, ],
    TransactionID: [],
    Remarks: [],
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineReceiptManualEntry_MandatoryGrossQuantity",
        },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    Temperature: [
        { maxLength: 5, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        { maxLength: 6, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    ProductDensityUOM: [],
    ReferenceDensity: [
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    MeterCode: [],
    StartTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    MassUOM: [],
    Pressure: [
        { maxLength: 8, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    PressureUOM: [],
    CalculatedGross: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    CalculatedValueUOM: [],
};

export const railReceiptManualEntryBPValidationDef = {
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineReceiptManualEntry_MandatoryGrossQuantity",
        },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    NetQuantity: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    Temperature: [
        { maxLength: 5, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        { maxLength: 6, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    ProductDensityUOM: [],
    ReferenceDensity: [
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    MeterCode: [],
    StartTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    EndTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    NetStartTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    NetEndTotalizer: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    MassUOM: [],
    Pressure: [
        { maxLength: 8, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    PressureUOM: [],
    CalculatedGross: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    CalculatedNet: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    CalculatedValueUOM: [],

    TankCode: [],
    TankStartGrossQuantity: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TankEndGrossQuantity: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TankStartNetQuantity: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TankEndNetQuantity: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TankStartGrossMass: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TankEndGrossMass: [
        { maxLength: 12, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TankStartPressure: [
        { maxLength: 8, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
    TankEndPressure: [
        { maxLength: 8, errorCode: "CustomerDetails_MaxLengthExceeded" },
        {
            expression: decimalExpression,
            errorCode: "MarineReceiptManualEntry_DecimalFormat",
        },
    ],
};

export const EODAdminInfoCompositeValidationDef = {
    OpenTime: [],
    CloseTime: [
        { minLength: 1, errorCode: "EOD_EnterEODTime" },
        { isDate: true, errorCode: "EOD_EnterEODTime" },
    ],
    DenyEntryTime: [
        { minLength: 1, errorCode: "EODAdministration_DenyTimeExceeded" },
        {
            expression: minutesExpression,
            errorCode: "EODAdministration_DenyTimeExceeded",
        },
    ],
    Remarks: [{ expression: nameExpression, errorCode: nameError }],
    DenyLoadTime: [
        { minLength: 1, errorCode: "EODAdministration_DenyTimeExceeded" },
        {
            expression: minutesExpression,
            errorCode: "EODAdministration_DenyTimeExceeded",
        },
    ],
};

export const truckShipmentManualEntryCommonValidationDef = {
    CompartmentSeqNoInVehicle: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryCompartmentSeqno",
    }, ],
    BayCode: [{ minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryBay" }],
    BCUCode: [{ minLength: 1, errorCode: "BCU_reqBCUCode" }],

    ShipmentCode: [
        { minLength: 1, errorCode: "SHIPMENT_EMPTY_X" },
        { maxLength: 100, errorCode: "SHIPMENT_EXCEEDS_LENGTH" },
    ],
    ShareHolderCode: [],
    ReceiptCode: [],
    TrailerCode: [],
    MarineReceiptCompCode: [],
};

export const truckShipmentManualEntryProdValidationDef = {
    LoadingArmCode: [{ minLength: 1, errorCode: "LOADINGARM_EMPTY_X" }],

    StartTime: [
        { minLength: 1, errorCode: "Load_Start_Time_is_Mandatory" },
        { isDate: true, errorCode: "Load_Start_Time_is_Mandatory" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_Starttime_Future_Error",
        },
    ],
    EndTime: [
        { minLength: 1, errorCode: "Load_End_Time_is_Mandatory" },
        { isDate: true, errorCode: "Load_End_Time_is_Mandatory" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_End_Future_Error",
        },
    ],
    FinishedProductCode: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryFinishedProduct" },
    ],
    QuantityUOM: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryQuantityUOM",
    }, ],
    TransactionID: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
    ],
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineDispatchManualEntry_MandatoryGrossQuantity",
        },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        //{ expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    NetQuantity: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Temperature: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 5, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 99999, errorCode: "Common_MaxValueExceeded" },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        //{ minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryDensity" },
        { maxLength: 6, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minDecimalValue: 0, errorCode: "ErrMsg_Decimal_Value_Invalid" },
    ],
    ProductDensityUOM: [
        //{ minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryDensityUOM" }
    ],
    TankCode: [],
    MeterCode: [],
    StartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: -0.1, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    EndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: -0.1, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    NetStartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: -0.1, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    NetEndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: -0.1, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    CalculatedGross: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        // { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    CalculatedNet: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        // { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    CalculatedValueUOM: [],
};

export const dchAttributeValidationDef = {
    attribute: [
        { minLength: 1, errorCode: "DCHAttribute_Mandatory" },
        { maxLength: 20, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: normalExpression, errorCode: normalError },
    ],
};

export const deviceValidationDef = {
    NodeAddress: [
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "DeviceInfo_NodeAddressNos" },
    ],
    DeviceType: [{ minLength: 1, errorCode: "DeviceInfo_DeviceTypeRequired" }],
    Code: [
        { minLength: 1, errorCode: "DeviceInfo_DeviceCodeRequired" },
        { maxLength: 50, errorCode: "DeviceInfo_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    Model: [{ minLength: 1, errorCode: "DeviceInfo_DeviceModelRequired" }],
    Name: [
        { minLength: 1, errorCode: "DeviceInfo_DeviceNameRequired" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    PointName: [
        { minLength: 1, errorCode: "DeviceInfo_PointNameRequired" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [
        { maxLength: 300, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    WeightUOM: [],
};
export const truckReceiptManualEntryCommonValidationDef = {
    CompartmentSeqNoInVehicle: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryCompartmentSeqno",
    }, ],
    BayCode: [{ minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryBay" }],
    BCUCode: [{ minLength: 1, errorCode: "BCU_reqBCUCode" }],
    ReceiptCode: [
        { minLength: 1, errorCode: "SHIPMENT_EMPTY_X" },
        { maxLength: 100, errorCode: "SHIPMENT_EXCEEDS_LENGTH" },
    ],
    ShareHolderCode: [],
};
export const truckReceiptManualEntryProdValidationDef = {
    LoadingArmCode: [{ minLength: 1, errorCode: "LOADINGARM_EMPTY_X" }],
    StartTime: [
        { minLength: 1, errorCode: "Load_Start_Time_is_Mandatory" },
        { isDate: true, errorCode: "Load_Start_Time_is_Mandatory" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_Starttime_Future_Error",
        },
    ],
    EndTime: [
        { minLength: 1, errorCode: "Load_End_Time_is_Mandatory" },
        { isDate: true, errorCode: "Load_End_Time_is_Mandatory" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_End_Future_Error",
        },
    ],
    FinishedProductCode: [
        { minLength: 1, errorCode: "PipelineDispatch_MandatoryFinishedProduct" },
    ],
    QuantityUOM: [{
        minLength: 1,
        errorCode: "MarineReceiptManualEntry_MandatoryQuantityUOM",
    }, ],
    TransactionID: [
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        {
            expression: numberExpression,
            errorCode: "SlotConfiguration_SlotParam_NumericValidation",
        },
    ],
    Remarks: [
        { maxLength: 300, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
    ],
};
export const truckReceiptManualEntryBaseProdValidationDef = {
    GrossQuantity: [{
            minLength: 1,
            errorCode: "MarineDispatchManualEntry_MandatoryGrossQuantity",
        },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        //{ expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    NetQuantity: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    Temperature: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 5, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 99999, errorCode: "Common_MaxValueExceeded" },
    ],
    TemperatureUOM: [],
    ProductDensity: [
        //{ minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryDensity" },
        { maxLength: 6, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { minDecimalValue: 0, errorCode: "ErrMsg_Decimal_Value_Invalid" },
    ],
    ProductDensityUOM: [
        //{ minLength: 1, errorCode: "LoadingDetailsEntry_MandatoryDensityUOM" }
    ],
    TankCode: [],
    MeterCode: [],
    StartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: 0, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    EndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: 0, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    NetStartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: 0, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    NetEndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 20, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 999999999999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: 0, errorCode: "ErrMsg_Decimal_Value_Invalid" },
        // { maxLength: 12, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    CalculatedGross: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        // { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    CalculatedNet: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        // { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        // { expression: decimalExpression, errorCode: "MarineDispatchManualEntry_DecimalFormat" }
    ],
    CalculatedValueUOM: [],
};
export const captainValidationDef = {
    Code: [
        { minLength: 1, errorCode: "CaptainInfo_CaptainCodeRequired" },
        { maxLength: 100, errorCode: "CAPTAINCODE_EXCEEDS_LENGTH" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Name: [
        { minLength: 1, errorCode: "CaptainInfo_CaptainNameRequired" },
        { maxLength: 100, errorCode: "CaptainInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    // ShareholderCodes: [
    //   { minLength: 1, errorCode: "ShareholderList_SelectShareholder" },
    // ],
    ShareholderCodes: [],
    UserType: [],
    Description: [
        { maxLength: 300, errorCode: "CaptainInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Phone: [
        { maxLength: 20, errorCode: "CaptainInfo_ExceedsMaxLength" },
        { expression: numberExpression, errorCode: "CaptainInfo_PhoneInvalid" },
    ],
    Mobile: [
        { maxLength: 20, errorCode: "CaptainDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CaptainInfo_MobileInvalid" },
    ],

    MailID: [
        { maxLength: 100, errorCode: "CaptainDetails_MaxLengthExceeded" },
        {
            expression: emailExpression,
            errorCode: "CaptainInfo_EmailInvalid",
        },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const bayGroupValidationDef = {
    GroupName: [
        { minLength: 1, errorCode: "BayGroupList_BayGroupNameRequired" },
        { maxLength: 100, errorCode: "BayGroupListBayGroupName_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Description: [{
            maxLength: 300,
            errorCode: "BayGroupListBayGroupDescription_ExceedsMaxLength",
        },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const deviceChannelValidationDef = {
    ChannelCode: [
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: "Code_ValidInputCharacters" },
    ],
    ChannelType: [{ minLength: 1, errorCode: "DeviceInfo_ChannelTypeRequired" }],
    ConnectionRetries: [
        { minLength: 1, errorCode: "Channel_MandatoryConnRetry" },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "Channel_ConnRetryNos" },
    ],
    ReceiveTimeOut: [
        { minLength: 1, errorCode: "Channel_MandatoryRecTimeOut" },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "Channel_RecTimeOut" },
    ],
    RetryInterval: [
        { minLength: 1, errorCode: "Channel_MandatoryRetry" },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "Channel_RetryNos" },
    ],
    SendTimeOut: [
        { minLength: 1, errorCode: "Channel_MandatorySendTimeOut" },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "Channel_SendTimeNos" },
    ],
    SecondaryPort: [
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "Channel_SPNos" },
    ],
    PrimaryPort: [
        { minLength: 1, errorCode: "DeviceInfo_PrimaryPortRequired" },
        { maxLength: 10, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "Channel_PPNos" },
    ],
    SecondaryAddress: [
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: channelAddressExpression, errorCode: "Channel_SPRegex" },
    ],
    PrimaryAddress: [
        { minLength: 1, errorCode: "DeviceInfo_PrimaryAddressRequired" },
        { maxLength: 50, errorCode: "CustomerDetails_MaxLengthExceeded" },
        { expression: channelAddressExpression, errorCode: "Channel_PARegex" },
    ],
};
export const webPortalUserValidationDef = {
    UserName: [{ minLength: 1, errorCode: "WebPortal_Userrequired" }],
    UserPrincipal: [
        { minLength: 1, errorCode: "WebPortal_Principalrequired" },
        { maxLength: 100, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: contactExpression, errorCode: contactError },
    ],
};

export const pipelineHeaderValidationDef = {
    Code: [
        { minLength: 1, errorCode: "PipeLineHeaderInfo_CodeRequired" },
        { maxLength: 50, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Name: [
        { minLength: 1, errorCode: "PipeLineHeaderInfo_NameRequired" },
        { maxLength: 100, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    PipelineHeaderType: [
        { minLength: 1, errorCode: "PipeLineHeaderInfo_NameRequired" },
    ],
    PointName: [
        { minLength: 1, errorCode: "DeviceInfo_PointNameRequired" },
        { maxLength: 50, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    OuterDiameter: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        { isDecimal: true, errorCode: "DIAMETER_INVALID" },
    ],
    WallThickness: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        { isDecimal: true, errorCode: "WALL_THICKNESS_INVALID" },
    ],
    TypicalFlowRatePerHour: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
        { isDecimal: true, errorCode: "FLOW_RATE_INVALID" },
    ],
    Description: [
        { maxLength: 4000, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    OuterDiameterUOM: [],
    WallThicknessUOM: [],
    FlowRateUOM: [],
};
export const exchangePartnerValidationDef = {
    ExchangePartnerName: [
        { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
        {
            maxLength: 100,
            errorCode: "UnLoadingInfo_ShareholderCode_Exceeds_MaxLen",
        },
        { expression: nameExpression, errorCode: nameError },
    ],
    SellerId: [{ minLength: 1, errorCode: "Exchange_MandatorySellerID" }],
    FinalShipperID: [{ minLength: 1, errorCode: "Exchange_MandatoryShipperID" }],
};

export const userValidationDef = {
    FirstName: [
        { minLength: 1, errorCode: "UserInfo_FirstNameRequired" },
        { maxLength: 500, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    LastName: [
        { minLength: 1, errorCode: "UserInfo_LastNameRequired" },
        { maxLength: 500, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Phone: [
        { maxLength: 20, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
    Mobile: [
        { maxLength: 20, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CarrierDetails_regMobile" },
    ],
    Email: [
        { maxLength: 100, errorCode: "CarrierDetails_MaxLengthExceeded" },
        {
            expression: emailExpression,
            errorCode: "CarrierDetails_regEmail",
        },
    ],
    Description: [
        { maxLength: 2000, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 2000, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    UserAccount: [
        { minLength: 1, errorCode: "UserInfo_AccountNameRequired" },
        { maxLength: 255, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: normalExpression, errorCode: normalError },
    ],
    RoleName: [],
    NewDomainName: [
        { maxLength: 100, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    PrimaryShareholder: [
        { minLength: 1, errorCode: "UserInfo_PrimaryShareholderRequired" },
    ],
    ApplicationID: [
        { maxLength: 100, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: applicationIDExpression, errorCode: applicationIdError }
    ]
};

export const PipelineDispatchManualEntryValidationDef = {
    TankCode: [],
    MeterCode: [],
    ScanStartTime: [
        { isDate: true, errorCode: "Load_Start_Time_is_Mandatory" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_Starttime_Future_Error",
        },
    ],
    ScanEndTime: [
        { isDate: true, errorCode: "Load_End_Time_is_Mandatory" },
        {
            denyFutureDate: true,
            errorCode: "ManualEntry_End_Future_Error",
        },
    ],
    GrossStartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    GrossEndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetStartTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetEndTotalizer: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetStartVolume: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    GrossStartVolume: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    NetEndVolume: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    GrossEndVolume: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 10, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    VolumeUOM: [],
    Temperature: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 5, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 99999, errorCode: "Common_MaxValueExceeded" },
    ],
    TemperatureUOM: [],
    Density: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    DensityUOM: [],
    Remarks: [
        { maxLength: 2000, errorCode: "PipeLineHeaderInfo_ExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
    GrossMass: [
        { maxLength: 10, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    Pressure: [
        { maxLength: 8, errorCode: "Common_MaxLengthExceeded" },
        { isDecimal: true, errorCode: "TankInfo_CapacityInvalid" },
    ],
    PressureUOM: [],
};
export const processConfigValidationDef = {
    ProcessName: [
        { minLength: 1, errorCode: "ExeConfiguration_MandatoryName" },
        { maxLength: 100, errorCode: "Common_MaxValueExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxValueExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    WorkFlowType: [{ minLength: 1, errorCode: "ExeConfiguration_MandatoryWF" }],
    PrimaryDeviceType: [
        { minLength: 1, errorCode: "ExeConfiguration_MandatoryDeviceType" },
    ],
    PrimaryDeviceCode: [
        { minLength: 1, errorCode: "DeviceChannelAssociation_MandatoryDeviceCode" },
    ],
};

export const productReconciliationReportValidationDef = {
    Remarks: [
        { maxLength: 300, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};

export const productReconciliationScheduleValidationDef = {
    ScheduleName: [],
    EntityTypeCode: [
        // { minLength: 1, errorCode: "ReconciliationSchedule_EntitySelect" }
    ],
    ScheduleType: [],
    EOSEOD: [],
    StartDateTime: [],
    //   { minLength: 1, errorCode: "ReconciliationSchedule_StartDateRequired" },
    //   { isDate: true, errorCode: "" },
    // ],
    EndDateTime: [],
    //   { minLength: 1, errorCode: "ReconciliationSchedule_EndDateRequired" },
    //   { isDate: true, errorCode: "" },
    // ],
};

export const lookupDataValidationDef = {
    value: [
        { minLength: 1, errorCode: "LookUpInfovalue_valuemandatory" },
        { maxLength: 4000, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const productAllocationEntityDef = {
    ShareholderCode: [
        { minLength: 1, errorCode: "ShareholderDetails_ShareholderCodeRequired" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    EntityCode: [
        { minLength: 1, errorCode: "SealMaster_CodeRequired" },
        { maxLength: 50, errorCode: "Common_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Description: [
        { maxLength: 300, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const BayAllocationScadaValidationDef = {
    MonitoringRate: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 5, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 99999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: -0.1, errorCode: "ErrMsg_Decimal_Value_Invalid" },
    ],
};
export const notificationGroupValidationDef = {
    GroupCode: [
        { minLength: 1, errorCode: "NotificationGroup_reqGroupCode" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Description: [
        { maxLength: 300, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const notificationRestrictionValidationDef = {
    MessageCode: [
        { minLength: 1, errorCode: "NotificationRes_reqMessageCode" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    MessageSource: [
        { minLength: 1, errorCode: "NotificationRes_reqMessageSource" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
};
export const WeighbridgeValidationDef = {
    Weight: [
        { minLength: 1, errorCode: "WB_MandatoryEntry" },
        { maxLength: 30, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: numberExpression, errorCode: "CarrierDetails_regPhone" },
    ],
};
export const notificationMessageValidationDef = {
    MessageCode: [
        { minLength: 1, errorCode: "NotificationRes_reqMessageCode" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    GroupCode: [
        { minLength: 1, errorCode: "NotificationGroup_reqGroupCode" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    NotificationType: [
        { minLength: 1, errorCode: "Notificationmsg_reqNotificationType" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Priority: [
        { minLength: 1, errorCode: "NotificationMsg_reqPriority" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],

    Condition: [
        { minLength: 1, errorCode: "Notificationmsg_reqcondition" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],
    Message: [
        { minLength: 1, errorCode: "NotificationRes_reqMessage" },
        { maxLength: 300, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: addressExpression, errorCode: addressError },
    ],
};
export const AtgMasterValidationDef = {
    AtgScanPeriod: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 5, errorCode: "Marine_ShipmentCompDetail_ExceedsMaxLength" },
        { maxDecimalValue: 99999, errorCode: "Common_MaxValueExceeded" },
        { minDecimalValue: 0, errorCode: "ErrMsg_Decimal_Value_Invalid" },
    ],
};

export const reportScheduleValidationDef = {
    ReportName: [
        { minLength: 1, errorCode: "ReportSchedule_ReportName" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    ScheduleName: [
        { minLength: 1, errorCode: "ReportSchedule_ReportSchedule" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    ShareholderCode: [
        { minLength: 1, errorCode: "ReportSchedule_ShareholderCode" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Printer: [],
};

export const roleValidationDef = {
    RoleName: [
        { minLength: 1, errorCode: "RoleInfo_RoleNameRequired" },
        { maxLength: 150, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    Description: [
        { maxLength: 300, errorCode: "TrailerInfo_DescriptionExceedsMaxLength" },
        { expression: nameExpression, errorCode: nameError },
    ],
};
export const exchangeAgreementValidationDef = {
    RequestCode: [{
            minLength: 1,
            errorCode: "ExchangeAgreementDetails_MandatoryRequestCode",
        },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    StartDate: [
        // { minLength: 1, errorCode: "ExchangeAgreement_StartDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        // { denyPastDate: true, errorCode: "ContractInfo_StartDateLater" },
    ],

    EndDate: [
        // { minLength: 1, errorCode: "ExchangeAgreement_EndDateRequired" },
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        { denyPastDate: true, errorCode: "End date cannot be earlier than today" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    AcceptedQuantity: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    ReceivedGrossQty: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    ReceivedNetQty: [
        { isDecimal: true, errorCode: "Invalid_Decimal_Format" },
        { maxLength: 18, errorCode: "Common_MaxLengthExceeded" },
        { maxDecimalValue: 9999999999, errorCode: "Common_MaxValueExceeded" },
    ],
    QuantityUOM: [],
    ReceivedDate: [
        { isDate: true, errorCode: "ShipmentOrdertList_ToDateFormatInvalid" },
        {
            denyPastDate: true,
            errorCode: "ProductTranferAgreementDetails_ReceivedDateCurrentError",
        },
    ],
};
export const CustomerStockTransferValidationDef = {
    Code: [
        { minLength: 1, errorCode: "CustomerAgreement_EnterTransferRefCode" },
        { maxLength: 50, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    LenderShareholderCode: [
        { minLength: 1, errorCode: "CustomerAgreement_EnterLendingShareholder" },
    ],
    RequestorShareholderCode: [
        { minLength: 1, errorCode: "CustomerAgreement_EnterRequestorShareholder" },
    ],
    LenderCustomerCode: [
        { minLength: 1, errorCode: "CustomerAgreement_EnterLendingCustomer" },
    ],
    RequestorCustomerCode: [
        { minLength: 1, errorCode: "CustomerAgreement_EnterRequestingCustomer" },
    ],
};
export const ShiftconfigurationValidationDef = {
    Name: [
        { minLength: 1, errorCode: "ShiftInfo_ShiftNameRequired" },
        { maxLength: 100, errorCode: "CarrierDetails_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        { expression: nameExpression, errorCode: nameError },
    ],
    StartTime: [
        { minLength: 1, errorCode: "ShiftInfo_StartTimeRequired" },
        { isDate: true, errorCode: "ShiftInfo_StartTimeRequired" },
    ],

    EndTime: [
        { minLength: 1, errorCode: "ShiftInfo_EndTimeRequired" },
        { isDate: true, errorCode: "ShiftInfo_EndTimeRequired" },
    ],
    TerminalCodes: [],
};

export const PrinterConfigurationValidationDef = {
    LocationCode: [{ minLength: 1, errorCode: "ERRMSG_KEYDATA_LOCATION_EMPTY" }],
    PrinterName: [{ minLength: 1, errorCode: "PrinterConfig_PrinterRequired" }],
    Location: [{ minLength: 1, errorCode: "ERRMSG_KEYDATA_LOCATION_EMPTY" }],
};

export const userAuthenticationValidationDef = {
    Password: [
        { minLength: 1, errorCode: "UserValidationForm_ReqfldValPassword" },
        { maxLength: 100, errorCode: "BASEPRODUCTCODE_EXCEEDS_LENGTH" }
    ],
};

export const CustomerRecipeValidationDef = {
    Code: [
        { minLength: 1, errorCode: "CustomerRecipeDetails_reqCustomerRecipeCode" },
        { maxLength: 50, errorCode: "CustomerRecipeDetails_MaxLengthExceeded" },
        { expression: codeExpression, errorCode: codeError },
    ],
    TerminalCode: [
        { minLength: 1, errorCode: "CustomerRecipeDetails_reqTerminalCode" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "Common_MaxLengthExceeded" },
        {
            expression: nameExpression,
            errorCode: nameError,
        },
    ],
    CustomerRecipefinishedProducts: [
        { minLength: 1, errorCode: "CustomerRecipeDetails_reqFinishedProduct" }
    ],
    CustomerCodes: [
        { minLength: 1, errorCode: "CustomerRecipeDetails_reqCustomer" }
    ],
};

export const coaparameterValidationDef = {
    Name: [
        { minLength: 1, errorCode: "COAParameterDetails_reqName" },
        { maxLength: 100, errorCode: "COAParameterDetails_MaxLengthExceeded" },
    ],
    Specification: [
        { maxLength: 200, errorCode: "COAParameterDetails_MaxLengthExceeded" },
    ],
    Method: [
        { maxLength: 200, errorCode: "COAParameterDetails_MaxLengthExceeded" },
    ],
    Description: [
        { maxLength: 1000, errorCode: "COAParameterDetails_MaxLengthExceeded" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "COAParameterDetails_MaxLengthExceeded" },
    ]
};

export const coatemplateValidationDef = {
    COATemplateCode: [
        { minLength: 1, errorCode: "COATemplateDetails_reqCode" },
        { maxLength: 50, errorCode: "COATemplateDetails_MaxLengthExceeded" },
    ],
    TankCode: [
        { minLength: 1, errorCode: "COATemplateDetails_reqTankCode" },
    ],
    UseType: [
        { minLength: 1, errorCode: "COATemplateDetails_reqUseType" },
    ],
    Remarks: [
        { maxLength: 4000, errorCode: "COATemplateDetails_MaxLengthExceeded" },
    ]
};

export const coamanagementValidationDef = {
    COACode: [
        { minLength: 1, errorCode: "COAManagementDetails_reqCode" },
        { maxLength: 50, errorCode: "COAManagementDetails_MaxLengthExceeded" },
    ],
    TankCode: [
        { minLength: 1, errorCode: "COAManagementDetails_reqTankCode" },
    ],
    TemplateCode: [
        { minLength: 1, errorCode: "COAManagementDetails_reqTemplateCode" },
    ],
    LOTNumber: [
        { maxLength: 50, errorCode: "COAManagementDetails_MaxLengthExceeded" },
    ]
};

export const coacustomerValidationDef = {
    CustomerCode: [
        { minLength: 1, errorCode: "COACustomerDetails_reqCode" },
    ],
    FinishedProductCode: [
        { minLength: 1, errorCode: "COACustomerDetails_reqFPCode" },
    ]
};
export const coamanagementFinishedProductValidationDef = {};
export const coaassignmentValidationDef = {
    BayCode: [
        { minLength: 1, errorCode: "COAAssignmentDetails_reqBayCode" },
    ],
    TankCode: [
        { minLength: 1, errorCode: "COAAssignmentDetails_reqTankCode" },
    ],
    BaseCOACode: [
        { minLength: 1, errorCode: "COAAssignmentDetails_reqBaseCOACode" },
    ],
    FinishedProductCOACode: [
        { maxLength: 100, errorCode: "COAAssignment_FinishedProductCOACodeMaxLengthExceeded" },
    ],
    FinishedProductCOANumber: [
        { maxLength: 100, errorCode: "COAAssignment_FinishedProductCOANumberMaxLengthExceeded" },
    ]
};

export const productForecastParameterValidationDef = {
  MassUOM: [
    {
      minLength: 1,
      errorCode: "ProductForecastConfiguration_MassUOM_Required",
    }
  ],
  MaxDuration: [
    {
      minLength: 1,
      errorCode: "ProductForecastConfiguration_MaxDuration_Required",
    },
    { maxLength: 3, errorCode: "Common_MaxLengthExceeded" },
    {
      expression: numberExpression,
      errorCode: "ProductForecastConfiguration_Param_NumericValidation",
    },
    { isInt: true, errorCode: "MaxDuration_Invalid" },
    { minIntValue: 1, errorCode: "ErrMsg_ProductForecastConfiguration_Min_Duration_Invalid" },
    { maxIntValue: 180, errorCode: "ErrMsg_ProductForecastConfiguration_Max_Duration_Invalid" },
  ],
  Tanks: [
    {
      minLength: 1,
      errorCode: "ProductForecastConfiguration_Tanks_Required",
    }
  ],
  ToleranceLimitMass: [
    { minLength: 1, errorCode: "ProductForecastConfiguration_ToleranceMass_Required" },
    { maxLength: 8, errorCode: "Common_MaxLengthExceeded" },
    {
      expression: decimalExpression,
      errorCode: "ProductForecastConfiguration_Param_NumericValidation",
    },
    { isDecimal: true, errorCode: "ProductForecastConfiguration_Decimal_Invalid" },
    { minDecimalValue: 0, errorCode: "ErrMsg_ProductForecastConfiguration_Min_Tolerance_Invalid" },
    { maxDecimalValue: 99999, errorCode: "ErrMsg_ProductForecastConfiguration_Max_Tolerance_Invalid" },
  ],
  ToleranceLimitVolume: [
    { minLength: 1, errorCode: "ProductForecastConfiguration_ToleranceVolume_Required" },
    { maxLength: 8, errorCode: "Common_MaxLengthExceeded" },
    {
      expression: decimalExpression,
      errorCode: "ProductForecastConfiguration_Param_NumericValidation",
    },
    { isDecimal: true, errorCode: "ProductForecastConfiguration_Decimal_Invalid" },
    { minDecimalValue: 0, errorCode: "ErrMsg_ProductForecastConfiguration_Min_Tolerance_Invalid" },
    { maxDecimalValue: 99999, errorCode: "ErrMsg_ProductForecastConfiguration_Max_Tolerance_Invalid" },
  ],
  VolumeUOM: [
    {
      minLength: 1,
      errorCode: "ProductForecastConfiguration_VolumeUOM_Required",
    }
  ]
};