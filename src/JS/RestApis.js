export const WebAPIURL = "/TMWebAPI/"; //use below line to use windows authentication
// export const WebAPIURL = "http://localhost/tmwebapi/";
//use below line to use OAUTH authentication
//export const WebAPIURL = "http://192.168.0.124/TMProxyAPI/";

// export const WebAPIURL = "http://localhost/TMProxyAPI/";

//export const GetMenuListForRole = WebAPIURL + "common/GetMenuListForRole";
export const GetTerminals = WebAPIURL + "common/GetTerminals";
export const GetCarrierCodes = WebAPIURL + "common/GetCarrierCodes";
export const GetProductType = WebAPIURL + "common/GetProductType";
export const GetUOMList = WebAPIURL + "common/GetUOMList";
export const GetLoadingType = WebAPIURL + "common/GetLoadingType";
export const GetVehicleAndTrailerTypes =
  WebAPIURL + "common/GetVehicleAndTrailerTypes";
export const GetVehicleCodes = WebAPIURL + "common/GetVehicleCodes";

export const GetVehiclesForLoggedInUser =
  WebAPIURL + "HSEInspection/GetVehiclesForLoggedInUser";

export const UpdateShipmentDriver = WebAPIURL + "Shipment/UpdateShipmentDriver";
export const UpdateReceiptDriver = WebAPIURL + "Receipt/UpdateReceiptDriver";

export const GetVehicleCodesByCarrier =
  WebAPIURL + "common/GetVehicleCodesByCarrier";
export const GetDriverCodes = WebAPIURL + "common/GetDriverCodes";
export const GetSupplierOriginTerminals =
  WebAPIURL + "common/GetSupplierOriginTerminals";
export const GetCustomerDestinations =
  WebAPIURL + "common/GetCustomerDestinations";
export const GetFinishedProductCodes =
  WebAPIURL + "common/GetFinishedProductCodes";
export const GetFinishedProductListForShareholder =
  WebAPIURL + "common/GetFinishedProductListForShareholder";
export const GetProdFamily =
  WebAPIURL + "common/GetProdFamily?ShareholderCode=";
export const GetTanks = WebAPIURL + "common/GetTanks";
export const GetMeters = WebAPIURL + "common/GetMeters";
export const GetLookUpData = WebAPIURL + "common/GetLookUpData";

export const GetCarrierListForRole =
  WebAPIURL + "CarrierCompany/GetCarrierListForRole";
//?ShareholderCode=&Transportationtype=";
export const GetCarrier = WebAPIURL + "CarrierCompany/GetCarrier";
export const CreateCarrier = WebAPIURL + "CarrierCompany/CreateCarrier";
export const UpdateCarrier = WebAPIURL + "CarrierCompany/UpdateCarrier";
export const DeleteCarrier = WebAPIURL + "CarrierCompany/DeleteCarrier";
export const GetDriverListForRole =
  WebAPIURL + "driver/GetDriverListForRole?ShareholderCode=";
export const GetDriver = WebAPIURL + "driver/GetDriver";
export const CreateDriver = WebAPIURL + "driver/CreateDriver";
export const UpdateDriver = WebAPIURL + "driver/UpdateDriver";
export const DeleteDriver = WebAPIURL + "driver/DeleteDriver";
export const Getloggedinuserdetails =
  WebAPIURL + "common/Getloggedinuserdetails?notificationType=";
export const GetCustomerListForRole =
  WebAPIURL + "Customer/GetCustomerListForRole";
export const GetCustomer = WebAPIURL + "Customer/GetCustomer";
export const CreateCustomer = WebAPIURL + "Customer/CreateCustomer";
export const UpdateCustomer = WebAPIURL + "Customer/UpdateCustomer";
export const DeleteCustomer = WebAPIURL + "Customer/DeleteCustomer";
export const GetFinishedProductForRole =
  WebAPIURL + "FinishedProduct/GetFinishedProductListForRole?ShareholderCode=";
export const GetFinishedProduct =
  WebAPIURL + "FinishedProduct/GetFinishedProduct";
export const CreateFinishedProduct =
  WebAPIURL + "FinishedProduct/CreateFinishedProduct";
export const UpdateFinishedProduct =
  WebAPIURL + "FinishedProduct/UpdateFinishedProduct";
export const DeleteFinishedProduct =
  WebAPIURL + "FinishedProduct/DeleteFinishedProduct";

export const GetLanguageList = WebAPIURL + "common/GetLanguageList";

export const GetOriginTerminalListForRole =
  WebAPIURL + "OriginTerminal/GetOriginTerminalListForRole";
export const GetOriginTerminal = WebAPIURL + "OriginTerminal/GetOriginTerminal";
export const CreateOriginTerminal =
  WebAPIURL + "OriginTerminal/CreateOriginTerminal";
export const UpdateOriginTerminal =
  WebAPIURL + "OriginTerminal/UpdateOriginTerminal";
export const DeleteOriginTerminal =
  WebAPIURL + "OriginTerminal/DeleteOriginTerminal";
export const GetAssociatedSupplierList =
  WebAPIURL + "OriginTerminal/GetAssociatedSupplierList";

export const GetTrailerListForRole =
  WebAPIURL + "Vehicle/GetTrailerListForRole";

export const GetTrailer = WebAPIURL + "Vehicle/GetTrailer";

export const CreateTrailer = WebAPIURL + "Vehicle/CreateTrailer";
export const UpdateTrailer = WebAPIURL + "Vehicle/UpdateTrailer";
export const DeleteTrailer = WebAPIURL + "Vehicle/DeleteTrailer";

export const GetDestinationListForRole =
  WebAPIURL + "Destination/GetDestinationListForRole?ShareholderCode=";
export const GetDestination = WebAPIURL + "Destination/GetDestination";
export const CreateDestination = WebAPIURL + "Destination/CreateDestination";
export const UpdateDestination = WebAPIURL + "Destination/UpdateDestination";
export const DeleteDestination = WebAPIURL + "Destination/DeleteDestination";

export const GetPrimeMoverListForRole =
  WebAPIURL + "Vehicle/GetPrimeMoverListForRole";
export const GetPrimeMover = WebAPIURL + "Vehicle/GetPrimeMover";
export const CreatePrimeMover = WebAPIURL + "Vehicle/CreatePrimeMover";
export const UpdatePrimeMover = WebAPIURL + "Vehicle/UpdatePrimeMover";
export const DeletePrimeMover = WebAPIURL + "Vehicle/DeletePrimeMover";

export const GetVehicleListForRole =
  WebAPIURL + "Vehicle/GetVehicleListForRole";

export const GetVehicle = WebAPIURL + "Vehicle/GetVehicle";
export const CreateVehicle = WebAPIURL + "Vehicle/CreateVehicle";
export const UpdateVehicle = WebAPIURL + "Vehicle/UpdateVehicle";
export const DeleteVehicle = WebAPIURL + "Vehicle/DeleteVehicle";

export const GetShipmentListForRole =
  WebAPIURL + "Shipment/GetShipmentListForRole";
export const GetShipment = WebAPIURL + "Shipment/GetShipment";
export const CreateShipment = WebAPIURL + "Shipment/CreateShipment";
export const UpdateShipment = WebAPIURL + "Shipment/UpdateShipment";
export const DeleteShipment = WebAPIURL + "Shipment/DeleteShipment";
export const GetShipmentOperations =
  WebAPIURL + "Shipment/GetShipmentOperations";
export const GetShipmentStatuses = WebAPIURL + "Shipment/GetAllStatuses";
export const GetTruckShipmentLoadingDetails =
  WebAPIURL + "Shipment/GetTruckShipmentLoadingDetails";
export const GetVehicleAccessDetails =
  WebAPIURL + "Shipment/GetVehicleAccessDetails";
export const AuthorizeToLoad = WebAPIURL + "Shipment/AuthorizeToLoad";
export const AllowToLoad = WebAPIURL + "Shipment/AllowToLoad";
export const GetCustomerInventory = WebAPIURL + "Shipment/GetCustomerInventory";
export const GetViewAllShipmentCustomData =
  WebAPIURL + "Shipment/GetViewAllShipmentCustomData";
export const getCompartmentSeqNo =
  WebAPIURL + "Shipment/GetCompartmentsforManualEntry";
export const GetTopUpRequestsOfShipment =
  WebAPIURL + "Shipment/GetTopUpRequestsOfShipment";
export const getFPReceipeDetails = WebAPIURL + "Shipment/GetFPReceipeDetails";
export const GetBaysandBCUs = WebAPIURL + "Common/GetBaysandBCUs";
export const TruckCreateManualEntry = WebAPIURL + "Shipment/CreateManualEntry";
export const GetCompartmentDetails =
  WebAPIURL + "Shipment/GetCompartmentDetails";
export const GetTruckAuditTrailInfo =
  WebAPIURL + "Shipment/GetTruckAuditTrailInfo";
export const GetProductAllocationDetails =
  WebAPIURL + "Shipment/GetProductAllocationDetails";
export const GetTrailerLoadingDetails =
  WebAPIURL + "Shipment/GetTrailerLoadingDetails";
export const GetLoadingDetails =
  WebAPIURL + "Shipment/GetLoadingDetails";
export const PrintFAN = WebAPIURL + "Shipment/PrintFAN";
export const PrintBOL = WebAPIURL + "Shipment/PrintBOL";
export const SendBOL = WebAPIURL + "Shipment/SendBOL";
export const BSIOutbound = WebAPIURL + "Shipment/BSIOutbound";
export const GetSealCompartmentsforShipment = WebAPIURL + "Shipment/GetSealCompartmentsforShipment";
export const GetSealCompartmentsforReceipt = WebAPIURL + "Receipt/GetSealCompartmentsforReceipt";
export const UpdateSealCompartments = WebAPIURL + "Shipment/UpdateSealCompartments";
export const GetWeighBridgeList = WebAPIURL + "Shipment/GetWeighBridgeList";
export const RecordShipmentTareWeight = WebAPIURL + "Shipment/ShipmentRecordTareWeight";
export const RecordShipmentLadenWeight = WebAPIURL + "Shipment/ShipmentRecordLadenWeight";
export const UpdateShipmentCompartmentDetails = WebAPIURL + "Shipment/UpdateShipmentCompartmentDetails";
export const CloseShipment = WebAPIURL + "Shipment/CloseShipment";
export const ApproveTopUpDecant = WebAPIURL + "Shipment/ApproveTopUpDecant";
export const GetMarineTransloadableReceipts = WebAPIURL + "Shipment/GetMarineTransloadableReceipts";
export const UpdateTransloadingShipmentData = WebAPIURL + "Shipment/UpdateTransloadingShipmentData";
export const GetRailTransloadableReceipts = WebAPIURL + "Shipment/GetRailTransloadableReceipts";
export const GetAutoGeneratedShipmentCode = WebAPIURL + "Shipment/GetAutoGeneratedShipmentCode";
export const GetVehicleTrCmptDetailsForShipment = WebAPIURL + "Shipment/GetVehicleTrCmptDetailsForShipment";
export const OverrideShipmentSequence = WebAPIURL + "Shipment/OverrideShipmentSequence";
export const UpdateShipmentBond = WebAPIURL + "Shipment/UpdateShipmentBond";
export const GetLadenWeightData = WebAPIURL + "Shipment/GetLadenWeightData";

export const GetVesselListForRole = WebAPIURL + "Vessel/GetVesselListForRole";
export const GetVessel = WebAPIURL + "Vessel/GetVessel";
export const CreateVessel = WebAPIURL + "Vessel/CreateVessel";
export const UpdateVessel = WebAPIURL + "Vessel/UpdateVessel";
export const DeleteVessel = WebAPIURL + "Vessel/DeleteVessel";

export const GetOrderListForRole = WebAPIURL + "Order/GetOrderListForRole";
export const GetOrder = WebAPIURL + "Order/GetOrder";
export const CreateOrder = WebAPIURL + "Order/CreateOrder";
export const UpdateOrder = WebAPIURL + "Order/UpdateOrder";
export const DeleteOrder = WebAPIURL + "Order/DeleteOrder";
export const UpdateOrderStatus = WebAPIURL + "Order/UpdateOrderStatus";
export const GetOrderList = WebAPIURL + "Order/GetOrderList";

export const GetContractListForRole =
  WebAPIURL + "Contract/GetContractListForRole";
export const GetContract = WebAPIURL + "Contract/GetContract";
export const CreateContract = WebAPIURL + "Contract/CreateContract";
export const UpdateContract = WebAPIURL + "Contract/UpdateContract";
export const DeleteContract = WebAPIURL + "Contract/DeleteContract";

//For TruckReceipt
export const GetReceiptListForRole =
  WebAPIURL + "Receipt/GetReceiptListForRole";
export const GetReceipt = WebAPIURL + "Receipt/GetReceipt";
export const CreateReceipt = WebAPIURL + "Receipt/CreateReceipt";
export const UpdateReceipt = WebAPIURL + "Receipt/UpdateReceipt";
export const DeleteReceipt = WebAPIURL + "Receipt/DeleteReceipt";
export const GetViewAllReceiptCustomData = WebAPIURL + "Receipt/GetViewAllReceiptCustomData";
export const UpdateReceiptSealCompartments = WebAPIURL + "Receipt/UpdateReceiptSealCompartments";
// export const CheckReceiptDeleteAllowed = WebAPIURL + "Receipt/CheckReceiptDeleteAllowed";
export const GetMarineDispatch = WebAPIURL + "MarineDispatch/GetMarineDispatch";
export const CreateMarineDispatch =
  WebAPIURL + "MarineDispatch/CreateMarineDispatch";
export const UpdateMarineDispatch =
  WebAPIURL + "MarineDispatch/UpdateMarineDispatch";
export const GetMarineDispatchListForRole =
  WebAPIURL + "MarineDispatch/GetMarineDispatchListForRole";

export const CreateMarineReceipt =
  WebAPIURL + "MarineReceipt/CreateMarineReceipt";
export const UpdateMarineReceipt =
  WebAPIURL + "MarineReceipt/UpdateMarineReceipt";
export const GetMarineReceipt = WebAPIURL + "MarineReceipt/GetMarineReceipt";
export const GetMarineReceiptListForRole =
  WebAPIURL + "MarineReceipt/GetMarineReceiptListForRole";

export const GetSupplierListForRole =
  WebAPIURL + "Supplier/GetSupplierListForRole?ShareholderCode=";
export const GetSupplier = WebAPIURL + "Supplier/GetSupplier";
export const CreateSupplier = WebAPIURL + "Supplier/CreateSupplier";
export const UpdateSupplier = WebAPIURL + "Supplier/UpdateSupplier";
export const DeleteSupplier = WebAPIURL + "Supplier/DeleteSupplier";

export const GetOriginTerminalsList =
  WebAPIURL + "common/GetOriginTerminalsList";

export const GetBaseProducts = WebAPIURL + "common/GetBaseProducts";
export const GetAdditives = WebAPIURL + "common/GetAdditives";

// ====

export const GetRailRouteCodes = WebAPIURL + "common/GetRailRouteCodes";
export const GetRailDispatch = WebAPIURL + "RailDispatch/GetRailDispatch";
export const GetRailPartialDispatchData = WebAPIURL + "RailDispatch/GetRailPartialDispatchData";
export const CreateRailDispatch = WebAPIURL + "RailDispatch/CreateRailDispatch";
export const UpdateRailDispatch = WebAPIURL + "RailDispatch/UpdateRailDispatch";
export const DeleteRailDispatch = WebAPIURL + "RailDispatch/DeleteRailDispatch";
export const GetRailDispatchListForRole =
  WebAPIURL + "RailDispatch/GetRailDispatchListForRole";

export const GetRailWagonCodes = WebAPIURL + "common/GetRailWagonCodes";

export const CreateRailReceipt = WebAPIURL + "RailReceipt/CreateRailReceipt";
export const UpdateRailReceipt = WebAPIURL + "RailReceipt/UpdateRailReceipt";
export const GetRailReceipt = WebAPIURL + "RailReceipt/GetRailReceipt";
export const DeleteRailReceipt = WebAPIURL + "RailReceipt/DeleteRailReceipt";
export const GetRailReceiptListForRole =
  WebAPIURL + "RailReceipt/GetRailReceiptListForRole";

export const GetRailRouteListForRole =
  WebAPIURL + "RailRoute/GetRailRouteListForRole";
export const GetRailRoute = WebAPIURL + "RailRoute/GetRailRoute";
export const CreateRailRoute = WebAPIURL + "RailRoute/CreateRailRoute";
export const UpdateRailRoute = WebAPIURL + "RailRoute/UpdateRailRoute";
export const DeleteRailRoute = WebAPIURL + "RailRoute/DeleteRailRoute";

export const GetRailWagon = WebAPIURL + "RailWagon/GetRailWagon";
export const CreateRailWagon = WebAPIURL + "RailWagon/CreateRailWagon";
export const UpdateRailWagon = WebAPIURL + "RailWagon/UpdateRailWagon";
export const DeleteRailWagon = WebAPIURL + "RailWagon/DeleteRailWagon";
export const GetRailWagonListForRole =
  WebAPIURL + "RailWagon/GetRailWagonListForRole";
export const GetRailWagonCategoryDetails =
  WebAPIURL + "RailWagon/GetRailWagonCategoryDetails";
export const GetRailWagonCategory = WebAPIURL + "common/GetRailWagonCategory";

export const GetMarineTransloadingForRole =
  WebAPIURL + "MarineTransloading/GetMarineTransloadingForRole";
export const GetCompartmentsBaseProducts =
  WebAPIURL + "MarineTransloading/GetCompartmentsBaseProducts";

export const GetRailTransloadingForRole =
  WebAPIURL + "RailTransloading/GetRailTransloadingListForRole";
export const GetRailCompartmentsBaseProducts =
  WebAPIURL + "RailTransloading/GetCompartmentsBaseProducts";

export const GetPipelineDispatch =
  WebAPIURL + "PipelineDispatch/GetPipelineDispatch";
export const CreatePipelineDispatch =
  WebAPIURL + "PipelineDispatch/CreatePipelineDispatch";
export const UpdatePipelineDispatch =
  WebAPIURL + "PipelineDispatch/UpdatePipelineDispatch";
export const GetPipelineDispatchListForRole =
  WebAPIURL + "PipelineDispatch/GetPipelineDispatchListForRole";
export const DeletePipelineDispatch =
  WebAPIURL + "PipelineDispatch/DeletePipelineDispatch";
export const GetPipelineLoadingDetails =
  WebAPIURL + "PipelineDispatch/GetSnapShotsForPlan";
export const GetPipelineDispatchAllStatuses =
  WebAPIURL + "PipelineDispatch/GetPipelineDispatchAllStatuses";
export const AuthorizePipelineDispatchManualEntry =
  WebAPIURL + "PipelineDispatch/AuthorizePipelineDispatchManualEntry";
export const AuthorizeUpadatePipelineDispatchScada =
  WebAPIURL + "PipelineDispatch/AuthorizeUpadatePipelineDispatchScada";
export const GetDispatchPlannedTanks =
  WebAPIURL + "PipelineDispatch/GetDispatchPlannedTanks";
export const CreatePipelineDispatchManualEntry =
  WebAPIURL + "PipelineDispatch/CreatePipelineDispatchSnapshot";
export const ClosePipelineDispatch =
  WebAPIURL + "PipelineDispatch/ClosePipelineDispatch";
export const UpdatePipelineRationedQuantities =
  WebAPIURL + "PipelineDispatch/UpdatePipelineRationedQuantities";
export const MarkInvalidPipelineRecords =
  WebAPIURL + "PipelineDispatch/MarkInvalidPipelineRecords";
export const GetPipelineDispatchtViewAuditTrailList =
  WebAPIURL + "PipelineDispatch/GetPipelineDispatchtViewAuditTrailList";
export const PipelineDispatchPrintBOLReport =
  WebAPIURL + "PipelineDispatch/PipelinePrintBOLReport";

export const GetPipelineReceipt =
  WebAPIURL + "PipelineReceipt/GetPipelineReceipt";
export const CreatePipelineReceipt =
  WebAPIURL + "PipelineReceipt/CreatePipelineReceipt";
export const UpdatePipelineReceipt =
  WebAPIURL + "PipelineReceipt/UpdatePipelineReceipt";
export const GetPipelineReceiptListForRole =
  WebAPIURL + "PipelineReceipt/GetPipelineReceiptListForRole";
export const DeletePipelineReceipt =
  WebAPIURL + "PipelineReceipt/DeletePipelineReceipt";
export const GetSnapShotsForPlan = WebAPIURL + "PipelineReceipt/GetSnapShotsForPlan";
export const GetPipelineReceiptAllStatuses = WebAPIURL + "PipelineReceipt/GetPipelineReceiptAllStatuses"
export const AuthorizePipelineReceiptManualEntry = WebAPIURL + "PipelineReceipt/AuthorizePipelineReceiptManualEntry";
export const CreatePipelineReceiptManualEntry = WebAPIURL + "PipelineReceipt/CreatePipelineReceiptSnapshot";
export const GetPipelineReceiptViewAuditTrailList = WebAPIURL + "PipelineReceipt/GetPipelineReceiptViewAuditTrailList";
export const AuthorizeUpadatePipelineReceiptScada = WebAPIURL + "PipelineReceipt/AuthorizeUpadatePipelineReceiptScada";
export const ClosePipelineReceipt = WebAPIURL + "PipelineReceipt/ClosePipelineReceipt";
export const PipelinePrintBOLReport = WebAPIURL + "PipelineReceipt/PipelinePrintBOLReport";
export const UpdatePipelineReceiptRationedQuantities = WebAPIURL + "PipelineReceipt/UpdatePipelineRationedQuantities";
export const MarkInvalidPipelineReceiptRecords = WebAPIURL + "PipelineReceipt/MarkInvalidPipelineRecords";
export const GetInprogressInspection =
  WebAPIURL + "HSEInspection/GetInprogressInspection";
export const GetTransactionScheduled =
  WebAPIURL + "HSEInspection/GetTransactionScheduled";
export const GetSMSConfigurationList =
  WebAPIURL + "SMSConfiguration/GetSMSConfigurationList";
export const CreateSMSConfiguration =
  WebAPIURL + "SMSConfiguration/CreateSMSConfiguration";
export const UpdateSMSConfiguration =
  WebAPIURL + "SMSConfiguration/UpdateSMSConfiguration";
export const GetSMSConfiguration =
  WebAPIURL + "SMSConfiguration/GetSMSConfiguration";
export const DeleteSMSConfiguration =
  WebAPIURL + "SMSConfiguration/DeleteSMSConfiguration";
export const GetEntityTypeRecipientList =
  WebAPIURL + "SMSConfiguration/GetEntityTypeRecipientList";
export const GetEntityParamFields =
  WebAPIURL + "SMSConfiguration/GetEntityParamFields?entityParamType=";
export const GetEmailConfigurationListForRole =
  WebAPIURL + "EmailConfiguration/GetEmailConfigurationListForRole";
export const GetEmailEntityTypeRecipientList =
  WebAPIURL + "EmailConfiguration/GetEntityTypeRecipientList";
export const GetEmailConfiguration =
  WebAPIURL + "EmailConfiguration/GetEmailConfiguration";
export const CreateEmailConfiguration =
  WebAPIURL + "EmailConfiguration/CreateEmailConfiguration";
export const UpdateEmailConfiguration =
  WebAPIURL + "EmailConfiguration/UpdateEmailConfiguration";
export const DeleteEmailConfiguration =
  WebAPIURL + "EmailConfiguration/DeleteEmailConfiguration";

export const GetHSEConfigurationListForRole =
  WebAPIURL + "HSEConfiguration/GetHseConfigurationListForRole";
export const GetHSEConfiguration =
  WebAPIURL + "HSEConfiguration/GetHseConfiguration";
export const CreateHSEConfiguration =
  WebAPIURL + "HSEConfiguration/CreateHSEConfiguration";
export const UpdateHSEConfiguration =
  WebAPIURL + "HSEConfiguration/UpdateHSEConfiguration";
export const DeleteHSEConfiguration =
  WebAPIURL + "HSEConfiguration/DeleteHSEConfiguration";
export const DownloadHSEQuestion =
  WebAPIURL + "HSEConfiguration/DownloadHSEQuestion";
export const HSEConfigurationCommonData =
  WebAPIURL + "HSEConfiguration/HSEConfigurationCommonData";
export const GetLocationDetails = WebAPIURL + "SiteView/GetLocationDetails";
export const GetSiteViewTree = WebAPIURL + "SiteView/GetSiteViewTree";
export const CreateLocation = WebAPIURL + "SiteView/CreateLocation";
export const UpdateLocation = WebAPIURL + "SiteView/UpdateLocation";
export const DeleteLocation = WebAPIURL + "SiteView/DeleteLocation";
export const DeleteGantry = WebAPIURL + "SiteView/DeleteGantry";
export const GetDeviceList = WebAPIURL + "SiteView/GetDeviceList";
export const GetEntityDetails = WebAPIURL + "SiteView/GetEntityDetails";
export const CreateEntity = WebAPIURL + "SiteView/CreateEntity";
export const UpdateEntity = WebAPIURL + "SiteView/UpdateEntity";
export const GetFPMeters = WebAPIURL + "SiteView/GetFPMeters";
export const GetCRDevice = WebAPIURL + "Device/GetCRDevice";
export const GetBCUDevice = WebAPIURL + "Device/GetBCUDevice";
export const GetDeviceTypes = WebAPIURL + "Device/GetDeviceTypes";
export const GetDeviceModels = WebAPIURL + "Device/GetDeviceModels";
export const GetChannelType = WebAPIURL + "Device/GetChannelType";
export const GetChannelsForDeviceTypes = WebAPIURL + "Device/GetChannelsForDeviceTypes";
export const GetChannel = WebAPIURL + "Device/GetChannel";
export const SetBCUSkipLocalLoadFetch = WebAPIURL + "Device/SetBCUSkipLocalLoadFetch"

export const GetShareholder = WebAPIURL + "Shareholder/GetShareholder";
export const CreateShareholder = WebAPIURL + "Shareholder/CreateShareholder";
export const UpdateShareholder = WebAPIURL + "Shareholder/UpdateShareholder";
export const DeleteShareholder = WebAPIURL + "Shareholder/DeleteShareholder";
export const GetShareholderListForRole =
  WebAPIURL + "Shareholder/GetShareholderListForRole";

export const GetExternalSystemInfo =
  WebAPIURL + "Shareholder/GetExternalSystemInfo";
export const GetSealCodes = WebAPIURL + "Shareholder/GetSealCodes";
export const GetBaseProductListForRole =
  WebAPIURL + "BaseProduct/GetBaseProductListForRole";

export const GetBaseProduct = WebAPIURL + "BaseProduct/GetBaseProduct";

export const CreateBaseProduct = WebAPIURL + "BaseProduct/CreateBaseProduct";

export const UpdateBaseProduct = WebAPIURL + "BaseProduct/UpdateBaseProduct";

export const DeleteBaseProduct = WebAPIURL + "BaseProduct/DeleteBaseProduct";

export const GetSlotConfigurations =
  WebAPIURL + "SlotConfiguration/GetSlotConfigurations?transportationType=";
export const GetTerminalDetailsForUser =
  WebAPIURL + "Common/GetTerminalDetailsForUser ";
export const GetTerminalDetailsForFeature =
  WebAPIURL + "Common/GetTerminalDetailsForFeature?LicensedFeature=";
export const GetBaysOfUser = WebAPIURL + "Common/GetBayDetailsForUser";
export const GetSlotsSummary = WebAPIURL + "SlotInformation/GetSlotsSummary";
export const GetSlotsList = WebAPIURL + "SlotInformation/GetSlots";
export const GetAvailableTransactionsForBooking =
  WebAPIURL + "SlotInformation/GetAvailableTransactionsForBooking";
export const BookSlot = WebAPIURL + "SlotInformation/BookSlot";
export const UpdateSlot = WebAPIURL + "SlotInformation/UpdateSlot";
export const CancelSlot = WebAPIURL + "SlotInformation/CancelSlot";

export const GetKPI = WebAPIURL + "KPI/GetKPI";

export const GetProductReconciliationListForRole =
  WebAPIURL + "ProductReconciliation/GetProductReconciliationListForRole";

export const GetReconciliationReport =
  WebAPIURL + "ProductReconciliation/GetReconciliationReport";

export const GetProductReconciliationStatus =
  WebAPIURL + "ProductReconciliation/GetProductReconciliationStatus";

export const UpdateReconciliationReport =
  WebAPIURL + "ProductReconciliation/UpdateReconciliationReport";

export const CreateReconciliationReport =
  WebAPIURL + "ProductReconciliation/CreateReconciliationReport";

export const GetReconciliationScheduleList =
  WebAPIURL + "ProductReconciliation/GetReconciliationScheduleList";

export const GetReconciliationSchedule =
  WebAPIURL + "ProductReconciliation/GetReconciliationSchedule";


export const CreateRecurrenceSchedule =
  WebAPIURL + "ProductReconciliation/CreateRecurrenceSchedule";


export const DisableRecurrenceSchedule =
  WebAPIURL + "ProductReconciliation/DisableRecurrenceSchedule";

export const GetEnTerminalsData = WebAPIURL + "Common/GetTerminalStatus";
export const GetTPIInfo = WebAPIURL + "TPI/GetTPI";
export const GetFinishedProductThroughput =
  WebAPIURL + "Common/GetFinishedProductThroughput";
export const HomeTankInventory =
  WebAPIURL + "Common/GetTankInventory";
export const UpdateBCUDevice = WebAPIURL + "Device/UpdateBCUDevice";
export const GetBCUViewTree = WebAPIURL + "SiteView/GetBCUViewTree";
export const UpdateCRDevice = WebAPIURL + "Device/UpdateCRDevice";
export const GetLoadingArm = WebAPIURL + "SiteView/GetLoadingArm";
export const GetBlendTypes = WebAPIURL + "SiteView/GetBlendTypes?deviceModel=";
export const GetDEUDevice = WebAPIURL + "Device/GetDEUDevice";
export const CreateLoadingArm = WebAPIURL + "SiteView/CreateLoadingArm";
export const UpdateLoadingArm = WebAPIURL + "SiteView/UpdateLoadingArm";
export const DeleteLoadingArm = WebAPIURL + "SiteView/DeleteLoadingArm";
export const GetAttributesMetaData = WebAPIURL + "Common/GetAttributesMetaData";
export const DeleteIsland = WebAPIURL + "SiteView/DeleteIsland";
export const GetBayDetails = WebAPIURL + "SiteView/GetBayDetails";
export const GetBayTypes = WebAPIURL + "SiteView/GetBayTypes";
export const CreateBay = WebAPIURL + "SiteView/CreateBay";
export const UpdateBay = WebAPIURL + "SiteView/UpdateBay";
export const DeleteBay = WebAPIURL + "SiteView/DeleteBay";

export const GetInprogressInspectionList =
  WebAPIURL + "HSEInspection/GetInprogressInspectionList";
export const GetTransactionScheduledList =
  WebAPIURL + "HSEInspection/GetTransactionScheduledList";
export const GetHSEInspectionResult =
  WebAPIURL + "HSEInspection/GetHSEInspectionResult";
export const GetShipmentLoadingDetails =
  WebAPIURL + "MarineTransloading/GetShipmentLoadingDetails";
export const GetTransloadingShipments =
  WebAPIURL + "MarineTransloading/GetTransloadingShipments";

export const GetDispatchOrReceiptCodes =
  WebAPIURL + "MapLocalTransactions/GetDispatchOrReceiptCodes";
export const GetLocalTransactions =
  WebAPIURL + "MapLocalTransactions/GetLocalTransactions";
export const GetBatchDetails =
  WebAPIURL + "MapLocalTransactions/GetBatchDetails";
export const MatchMapTransactions =
  WebAPIURL + "MapLocalTransactions/MatchMapTransactions";
export const GetLocations = WebAPIURL + "HSEInspection/GetLocations";
export const UpdateHSEInspectionStatus =
  WebAPIURL + "HSEInspection/UpdateHSEInspectionStatus";
export const GetHSEDocumentInfo =
  WebAPIURL + "HSEInspection/GetHSEDocumentInfo";
export const GetUnmatchedLocalTransactionsListForRole =
  WebAPIURL + "MapLocalTransactions/GetUnmatchedLocalTransactionsListForRole";

export const GetHistoryInspectionList =
  WebAPIURL + "HSEInspection/GetHistoryInspectionList";
export const UpdateLeakageInfo =
  WebAPIURL + "LeakageManualEntry/UpdateLeakageInfo";
export const GetUnAccountedTransactionTankList =
  WebAPIURL + "UnAccountedTransactionTank/GetUnAccountedTransactionTankList";
export const CreateUnAccountedTankTransaction =
  WebAPIURL + "UnAccountedTransactionTank/CreateUnAccountedTankTransaction";
export const GetUnAccountedTransactionTypes =
  WebAPIURL + "common/GetUnAccountedTransactionTypes";

export const GetTanksForMeter =
  WebAPIURL + "MapLocalTransactions/GetTanksForMeter";

export const GetTerminalListForRole =
  WebAPIURL + "Terminal/GetTerminalListForRole";
export const GetUnAccountedTransactionMeterList =
  WebAPIURL + "UnAccountedTransactionMeter/GetUnAccountedTransactionMeterList";
export const CreateUnAccountedMeterTransaction =
  WebAPIURL + "UnAccountedTransactionMeter/CreateUnAccountedMeterTransaction";

export const GetTerminal = WebAPIURL + "Terminal/GetTerminal";
export const CreateTerminal = WebAPIURL + "Terminal/CreateTerminal";
export const UpdateTerminal = WebAPIURL + "Terminal/UpdateTerminal";
export const GetTerminalEnterpriseProcesses =
  WebAPIURL + "Terminal/GetTerminalEnterpriseProcesses";

export const GetTankEODData = WebAPIURL + "TankManualEntry/GetTankEODData";
export const CreateTankManualEntry =
  WebAPIURL + "TankManualEntry/CreateTankManualEntry";
export const UpdateTankManualEntry =
  WebAPIURL + "TankManualEntry/UpdateTankManualEntry";
export const MarkUnMatchLocalTransactionInValid =
  WebAPIURL + "MapLocalTransactions/MarkUnMatchLocalTransactionInValid";
export const GetTankGroup = WebAPIURL + "Tank/GetTankGroup";
export const CreateTankGroup = WebAPIURL + "Tank/CreateTankGroup";
export const UpdateTankGroup = WebAPIURL + "Tank/UpdateTankGroup";
export const DeleteTankGroup = WebAPIURL + "Tank/DeleteTankGroup";
export const GetTankGroupListForRole =
  WebAPIURL + "Tank/GetTankGroupListForRole";
export const GetAllBaseProduct = WebAPIURL + "Tank/GetAllBaseProduct";
export const ActivateTank = WebAPIURL + "Tank/ActivateTank";

export const UpdateDEUDevice = WebAPIURL + "Device/UpdateDEUDevice";
export const GetTankGroups = WebAPIURL + "Common/GetTankGroups";
export const GetMeter = WebAPIURL + "SiteView/GetMeter";
export const GetMeterTypes = WebAPIURL + "Common/GetMeterTypes";
export const CreateMeter = WebAPIURL + "SiteView/CreateMeter";
export const UpdateMeter = WebAPIURL + "SiteView/UpdateMeter";

export const GetProductMeterCode = WebAPIURL + "SiteView/GetProductMeterCode";
export const DeleteMeter = WebAPIURL + "SiteView/DeleteMeter";
export const GetTank = WebAPIURL + "Tank/GetTank";
export const CreateTank = WebAPIURL + "Tank/CreateTank";
export const UpdateTank = WebAPIURL + "Tank/UpdateTank";
export const DeleteTank = WebAPIURL + "Tank/DeleteTank";
export const GetTankListForRole = WebAPIURL + "Tank/GetTankListForRole";
export const GetTankMode = WebAPIURL + "Tank/GetTankMode";
export const GetTankGroupData = WebAPIURL + "Tank/GetTankGroup";
export const GetProductData = WebAPIURL + "Tank/GetProductData";
export const GetATGData = WebAPIURL + "Tank/GetATGData";
export const GetTankATGConfiguration =
  WebAPIURL + "Tank/GetTankATGConfiguration";
export const UpdateATGConfiguration = WebAPIURL + "Tank/UpdateATGConfiguration"
export const SaveATGData = WebAPIURL + "Tank/SaveATGData";
export const GetWBDevice = WebAPIURL + "Device/GetWBDevice";
export const UpdateWBDevice = WebAPIURL + "Device/UpdateWBDevice";

export const GetAllTerminals = WebAPIURL + "Shareholder/GetAllTerminals";

export const GetAccessCardListForRole =
  WebAPIURL + "AccessCard/getAccessCardListForRole";
export const CreateAccessCard = WebAPIURL + "AccessCard/CreateAccessCard";
export const UpdateAccessCard = WebAPIURL + "AccessCard/UpdateAccessCard";
export const DeleteAccessCard = WebAPIURL + "AccessCard/DeleteAccessCard";
export const GetAccessCard = WebAPIURL + "AccessCard/GetAccessCard";
export const GetAllCarrierListForRole =
  WebAPIURL + "AccessCard/GetAllCarrierListForRole";
export const GetEntityCodesByCarrierAndEntityType =
  WebAPIURL + "Common/GetEntityCodesByCarrierAndEntityType";
export const IssueAccessCard = WebAPIURL + "AccessCard/IssueAccessCard";
export const ActivateAccessCard = WebAPIURL + "AccessCard/ActivateAccessCard";
export const RevokeAccessCard = WebAPIURL + "AccessCard/RevokeAccessCard";
export const ChangePasswordForAccessCard =
  WebAPIURL + "AccessCard/ChangePasswordForAccessCard";
export const ResetPasswordForAccessCard =
  WebAPIURL + "AccessCard/ResetPasswordForAccessCard";
export const GetEntityTypeList = WebAPIURL + "Common/GetEntityTypeList";
export const GeEntityValues =
  WebAPIURL + "Common/GetEntityCodesByCarrierAndEntityType";
export const GetCardReaderLocations =
  WebAPIURL + "AccessCard/GetCardReaderLocations";
export const IssueAccessCardAutoID =
  WebAPIURL + "AccessCard/IssueAccessCardAutoIDAssociation";
export const ActivateAccessCardAutoID =
  WebAPIURL + "AccessCard/ActivateAccessCardAutoIDAssociation";
export const RevokeAccessCardAutoID =
  WebAPIURL + "AccessCard/RevokeAccessCardAutoIDAssociation";
export const ReadCardData = WebAPIURL + "AccessIDReader/ReadCardData";
export const WritePoint = WebAPIURL + "AccessIDReader/WritePoint";
export const ValidateFASCN = WebAPIURL + "AccessCard/ValidateFASCN";
export const GetTWICEnabled = WebAPIURL + "Device/GetTWICEnabled";
export const ModifyReadByWorkflow =
  WebAPIURL + "AccessIDReader/ModifyReadByWorkflow";

export const GetRailReceiptOperations =
  WebAPIURL + "RailReceipt/GetRailReceiptOperations";

export const GetRailReceiptAllChangeStatus =
  WebAPIURL + "RailReceipt/GetRailReceiptAllChangeStatusNew";
export const GetRailReceiptUnLoadingDetails =
  WebAPIURL + "RailReceipt/GetRailReceiptUnLoadingDetails";
export const RailReceiptAuthorizeToUnLoad =
  WebAPIURL + "RailReceipt/RailReceiptAuthorizeToUnLoad";
export const ForceCloseRailReceipt =
  WebAPIURL + "RailReceipt/ForceCloseRailReceipt";
export const RailReceiptRecordWeight =
  WebAPIURL + "RailReceipt/RailReceiptRecordWeight";
export const GetRailMarineDispatchReceiptWeighBridgeData =
  WebAPIURL + "common/GetRailMarineDispatchReceiptWeighBridgeData";
export const GetWeightBridgeData = WebAPIURL + "common/GetWeightBridgeData";
export const GetRailReceiptAuditTrailList =
  WebAPIURL + "RailReceipt/GetReceiptAuditTrailList";
export const RailReceiptManualEntry =
  WebAPIURL + "RailReceipt/RailReceiptManualEntry";
export const GetWeightBridgeCodes =
  WebAPIURL + "RailReceipt/GetWeightBridgeCodes";

export const GetRailDispatchOperations =
  WebAPIURL + "RailDispatch/GetRailDispatchOperations";
export const GetRailDispatchAllChangeStatus =
  WebAPIURL + "RailDispatch/GetRailDispatchAllChangeStatusNew";
export const ForceCloseRailDispatch =
  WebAPIURL + "RailDispatch/ForceCloseRailDispatch";
export const RailDispatchAuthorizeToLoad =
  WebAPIURL + "RailDispatch/RailDispatchAuthorizeToLoad";
export const GetRailDispatchLoadingDetails =
  WebAPIURL + "RailDispatch/GetRailDispatchLoadingDetails";
export const RailDispatchManualEntry =
  WebAPIURL + "RailDispatch/RailDispatchManualEntry";
export const GetRailDispatchAuditTrail =
  WebAPIURL + "RailDispatch/GetRailDispatchAuditTrail";

export const GetRailBayAndBcuList = WebAPIURL + "common/GetRailBayAndBcuList";
export const GetLoadingArms = WebAPIURL + "common/GetLoadingArms";
export const GetMarineDispatchAllStatuses =
  WebAPIURL + "MarineDispatch/GetMarineDispatchAllStatuses";
export const MarineShipmentAuthorizeToLoad =
  WebAPIURL + "MarineDispatch/AuthorizeToLoad";
export const GetMarineShipmentPlan =
  WebAPIURL + "MarineDispatch/GetMarineShipmentPlan";
export const GetMarineCompartmentDetails =
  WebAPIURL + "MarineDispatch/GetMarineCompartmentDetails";
export const GetMarineDispatchOperations =
  WebAPIURL + "MarineDispatch/GetMarineDispatchOperations";
export const DeleteMarineDispatch =
  WebAPIURL + "MarineDispatch/DeleteMarineDispatch";
export const GetAuditTrailList = WebAPIURL + "MarineDispatch/GetAuditTrailList";
export const GetPartialMarineDispatchData =
  WebAPIURL + "MarineDispatch/GetPartialMarineDispatchData";
export const GetUOMListByType = WebAPIURL + "MarineCommon/GetUOMListByType";
export const GetBerthList = WebAPIURL + "MarineCommon/GetBerthList";
export const GetBCUListByBerth = WebAPIURL + "MarineCommon/GetBCUListByBerth";
export const GetLoadingArmListByBCU =
  WebAPIURL + "MarineCommon/GetLoadingArmListByBCU";
export const GetMeterList = WebAPIURL + "MarineCommon/GetMeterList";
export const GetTankList = WebAPIURL + "MarineCommon/GetTankList";
export const MarineDispatchManualEntrySave =
  WebAPIURL + "MarineDispatch/MarineDispatchManualEntrySave";
export const GetMarineLoadingDetails =
  WebAPIURL + "MarineDispatch/GetMarineLoadingDetails";
export const GetMarineCompartmentDetailsBySeqNo =
  WebAPIURL + "MarineDispatch/GetMarineCompartmentDetailsBySeqNo";
export const SetValid = WebAPIURL + "MarineDispatch/SetValid";
export const CompartmentDetailsSave =
  WebAPIURL + "MarineDispatch/CompartmentDetailsSave";

export const GetMarineReceiptCompartmentDetails =
  WebAPIURL + "MarineReceipt/GetReceiptCompartmentDetails";
export const GetMarineReceiptCompartmentDetailsBySeqNo =
  WebAPIURL + "MarineReceipt/GetReceiptCompartmentDetailsBySeqNo";
export const GetReceiptAuditTrailList =
  WebAPIURL + "MarineReceipt/GetReceiptAuditTrailList";
export const GetMarineReceiptCompartmentDetailsOperations =
  WebAPIURL + "MarineReceipt/GetMarineReceiptCompartmentDetailsOperations";
export const GetMarineReceiptAllStatuses =
  WebAPIURL + "MarineReceipt/GetMarineReceiptAllStatuses";
export const GetMarineReceiptUnLoadingDetails =
  WebAPIURL + "MarineReceipt/GetMarineUnLoadingDetails";
export const GetMarineUnLoadingDetailConfigFields =
  WebAPIURL + "MarineReceipt/GetMarineUnLoadingDetailConfigFields";
export const GetMarineReceiptOperations =
  WebAPIURL + "MarineReceipt/GetMarineReceiptOperations";
export const MarineReceiptSetValidReceipt =
  WebAPIURL + "MarineReceipt/SetValidReceipt";
export const GetMarineReceiptPlan = WebAPIURL + "MarineReceipt/GetReceiptPlan";
export const MarineReceiptCompartmentDetailsSave =
  WebAPIURL + "MarineReceipt/ReceiptCompartmentDetailsSave";
export const MarineReceiptAuthorizeToUnLoad =
  WebAPIURL + "MarineReceipt/AuthorizeToUnLoad";
export const GetPartialMarineReceiptData =
  WebAPIURL + "MarineReceipt/GetPartialMarineReceiptData";
export const GetMarineBerthList = WebAPIURL + "MarineCommon/GetBerthList";
export const GetMarineUOMListByType =
  WebAPIURL + "MarineCommon/GetUOMListByType";
export const GetMarineMeterList = WebAPIURL + "MarineCommon/GetMeterList";
export const GetMarineBCUListByBerth =
  WebAPIURL + "MarineCommon/GetBCUListByBerth";
export const GetMarineLoadingArmListByBCU =
  WebAPIURL + "MarineCommon/GetLoadingArmListByBCU";
export const GetMarineTankList = WebAPIURL + "MarineCommon/GetTankList";
export const MarineReceiptManualEntrySave =
  WebAPIURL + "MarineReceipt/MarineReceiptManualEntrySave";
export const MarineReceiptPrintRAN = WebAPIURL + "MarineReceipt/PrintRAN";
export const MarineReceiptDeleteMarineReceipt =
  WebAPIURL + "MarineReceipt/DeleteMarineReceipt";
export const MarineReceiptCloseReceipt =
  WebAPIURL + "MarineReceipt/CloseReceipt";
export const MarineReceiptPrintBOD = WebAPIURL + "MarineReceipt/PrintBOD";
export const MarineReceiptBSIOutboundReceipt =
  WebAPIURL + "MarineReceipt/BSIOutboundReceipt";
export const GetSealMaster = WebAPIURL + "SealMaster/GetSealMaster";
export const CreateSealMaster = WebAPIURL + "SealMaster/CreateSealMaster";
export const UpdateSealMaster = WebAPIURL + "SealMaster/UpdateSealMaster";
export const DeleteSealMaster = WebAPIURL + "SealMaster/DeleteSealMaster";
export const GetSealMastersList = WebAPIURL + "SealMaster/GetSealMastersList";
export const GetMarineDispatchAuditTrailList =
  WebAPIURL + "MarineDispatch/GetAuditTrailList";

export const MarineDispatchAuthorizeToLoad =
  WebAPIURL + "MarineDispatch/AuthorizeToLoad";
export const MarineDispatchPrintFAN = WebAPIURL + "MarineDispatch/PrintFAN";
export const MarineDispatchPrintBOL = WebAPIURL + "MarineDispatch/PrintBOL";
export const MarineDispatchBSIOutbound =
  WebAPIURL + "MarineDispatch/BSIOutbound";
export const MarineDispatchCloseShipment =
  WebAPIURL + "MarineDispatch/CloseShipment";
export const GetMarineLoadingDetailConfigFields =
  WebAPIURL + "MarineDispatch/GetMarineLoadingDetailConfigFields";
export const MarineDispatchSetValid = WebAPIURL + "MarineDispatch/SetValid";
export const GetMarineDispatchCompartmentDetails =
  WebAPIURL + "MarineDispatch/GetMarineCompartmentDetails";

export const GetMarineDispatchPlan =
  WebAPIURL + "MarineDispatch/GetMarineShipmentPlan";
export const GetMarineDispatchCompartmentDetailsOperations =
  WebAPIURL + "MarineDispatch/GetMarineDispatchCompartmentDetailsOperations";
export const MarineDispatchCompartmentDetailsSave =
  WebAPIURL + "MarineDispatch/CompartmentDetailsSave";

export const RailDispatchValidateWagonToAssign =
  WebAPIURL + "RailDispatch/RailDispatchValidateWagonToAssign";
export const UpdateRailDispatchPlanWithWagon =
  WebAPIURL + "RailDispatch/UpdateRailDispatchPlanWithWagon";
export const UpdateRailDispatchProductAssignment =
  WebAPIURL + "RailDispatch/UpdateRailDispatchProductAssignment";
export const GetSlotConfiguration =
  WebAPIURL + "SlotConfiguration/GetSlotConfiguration?TransportationType=";

export const CreateSlotConfiguration = WebAPIURL + "SlotConfiguration/Create";
export const UpdateRailReceiptCompartInfo =
  WebAPIURL + "RailReceipt/UpdateRailReceiptCompartInfo";

export const GetRailLoadSpotDevices =
  WebAPIURL + "common/GetRailLoadSpotDevices";
export const GetRailDispatchBatchPlanDetails =
  WebAPIURL + "RailDispatch/GetRailDispatchBatchPlanDetails";
export const UpdateRailDispatchBatchPlan =
  WebAPIURL + "RailDispatch/UpdateRailDispatchBatchPlan";
export const RailDispatchPrintFAN = WebAPIURL + "RailDispatch/PrintFAN";
export const RailDispatchPrintBOL = WebAPIURL + "RailDispatch/PrintBOL";
export const RailDispatchBSIOutbound = WebAPIURL + "RailDispatch/BSIOutbound";

export const RailDispatchRecordWeight =
  WebAPIURL + "RailDispatch/RailDispatchRecordWeight";
export const RailDispatchAuthorizeRailWagonPlan =
  WebAPIURL + "RailDispatch//RailDispatchAuthorizeRailWagonPlan";
export const UpdateRailDispatchCompartInfo =
  WebAPIURL + "RailDispatch/UpdateRailDispatchCompartInfo";
export const CheckRailDispatchDeleteAllowed = WebAPIURL + "RailDispatch/CheckRailDispatchDeleteAllowed";
export const CheckRailReceiptDeleteAllowed = WebAPIURL + "RailReceipt/CheckRailReceiptDeleteAllowed";
export const GetMarineProductAllocationDetails =
  WebAPIURL + "MarineDispatch/GetProductAllocationDetails";
export const GetRailReceiptBatchPlanDetails =
  WebAPIURL + "RailReceipt/GetRailReceiptBatchPlanDetails";
export const UpdateRailReceiptBatchPlan =
  WebAPIURL + "RailReceipt/UpdateRailReceiptBatchPlan";
export const RailReceiptAuthorizeRailWagonPlan =
  WebAPIURL + "RailReceipt/RailReceiptAuthorizeRailWagonPlan";
export const GetRailLoadSpot = WebAPIURL + "Common/GetRailLoadSpot";
export const GetLanguages = WebAPIURL + "Languages/GetLanguages";
export const UpdateLanguages = WebAPIURL + "Languages/UpdateLanguages";
export const GetWagonHseInspectionStatus =
  WebAPIURL + "common/GetWagonHseInspectionStatus";
export const GetContractCodes = WebAPIURL + "common/GetContractCodes";
export const GetOrderCodes = WebAPIURL + "common/GetOrderCodes";
export const RailReceiptPrintRAN = WebAPIURL + "RailReceipt/PrintRAN";
export const RailReceiptPrintBOD = WebAPIURL + "RailReceipt/PrintBOD";
export const RailReceiptBSIOutbound = WebAPIURL + "RailReceipt/BSIOutbound";
export const GetShifts = WebAPIURL + "OperatorDashboard/GetShifts";
export const GetDashboardOrderStatesCount = WebAPIURL + "OperatorDashboard/GetDashboardOrderStatesCount";
export const GetDashboardBayDetails = WebAPIURL + "OperatorDashboard/GetBayDetails";
export const GetTransactionAndDeviceStatus = WebAPIURL + "OperatorDashboard/GetTransactionAndDeviceStatus";
export const GetLiveOrdersForBays = WebAPIURL + "OperatorDashboard/GetLiveOrdersForBays";

export const GetSpurDetails = WebAPIURL + "OperatorDashboard/GetSpurDetails";
export const GetTransactionAudit = WebAPIURL + "OperatorDashboard/GetTransactionAudit";
export const GetOrderDetails = WebAPIURL + "OperatorDashboard/GetOrderDetails";
export const GetMarineOrderDetails = WebAPIURL + "OperatorDashboard/GetMarineOrderDetails";
export const GetRailLiveOrderDetails = WebAPIURL + "OperatorDashboard/GetRailLiveOrderDetails";
export const GetRailOrderDetails = WebAPIURL + "OperatorDashboard/GetRailOrderDetails";
export const GetTankInventory = WebAPIURL + "OperatorDashboard/GetTankInventory";
export const GetDeviceStatus = WebAPIURL + "OperatorDashboard/GetDeviceStatus";
export const GetQueuedTransaction = WebAPIURL + "OperatorDashboard/GetQueuedTransaction";
export const GetAlarmList = WebAPIURL + "OperatorDashboard/GetAlarmList";
export const GetProductsThroughput = WebAPIURL + "OperatorDashboard/GetProductsThroughput";
export const Print = WebAPIURL + "OperatorDashboard/Print";
export const ForceClose = WebAPIURL + "OperatorDashboard/ForceClose";
export const GetWeekEnds = WebAPIURL + "WeekendHolidayConfig/GetWeekEnds";
export const SaveConfigureWeekend =
  WebAPIURL + "WeekendHolidayConfig/SaveConfigureWeekend";
export const GetHolidays = WebAPIURL + "WeekendHolidayConfig/GetHolidays";
export const AddHoliday = WebAPIURL + "WeekendHolidayConfig/AddHoliday";
export const DeleteHoliday = WebAPIURL + "WeekendHolidayConfig/DeleteHoliday";
export const GetEODAdminDetails =
  WebAPIURL + "EODAdministration/GetEODAdminDetails";
export const GetEODSummary = WebAPIURL + "EODAdministration/GetEODSummary";
export const IsTerminalEntryTimeValid =
  WebAPIURL + "EODAdministration/IsTerminalEntryTimeValid";
export const IsNextWorkingDay =
  WebAPIURL + "EODAdministration/IsNextWorkingDay";
export const EODOpenDay = WebAPIURL + "EODAdministration/EODOpenDay";
export const EODCloseDay = WebAPIURL + "EODAdministration/EODCloseDay";
export const EODSave = WebAPIURL + "EODAdministration/EODSave";

export const GetUOMDetailsList = WebAPIURL + "common/GetUOMDetailsList";
export const GetDCHAttributeInfoList =
  WebAPIURL + "Common/GetDCHAttributeInfoList";

export const GetReceiptOperations = WebAPIURL + "Receipt/GetReceiptOperations";
export const GetReceiptAllStatuses =
  WebAPIURL + "Receipt/GetReceiptAllStatuses";
export const ReceiptAuthorizeToUnload =
  WebAPIURL + "Receipt/ReceiptAuthorizeToUnload";
export const ReceiptAllowToUnLoad = WebAPIURL + "Receipt/ReceiptAllowToUnLoad";
export const ReadWBScadaValue = WebAPIURL + "Receipt/ReadWBScadaValue";
export const GetReceiptCustomerInventoryDetails = WebAPIURL + "Receipt/GetReceiptCustomerInventoryDetails";
export const ReceiptUnloadingTransactions = WebAPIURL + "Receipt/ReceiptUnloadingTransactions";
export const GetTruckReceiptAuditTrailList = WebAPIURL + "Receipt/GetTruckReceiptAuditTrailList";
export const ViewReceiptUnloading = WebAPIURL + "Receipt/ViewReceiptUnloading";
export const ReceiptClose = WebAPIURL + "Receipt/ReceiptClose";
export const UpdateReceiptCompartmentDetails = WebAPIURL + "Receipt/UpdateReceiptCompartmentDetails";
export const GetReceiptCompartmentDetails = WebAPIURL + "Receipt/GetReceiptCompartmentDetails";
export const GetReceiptRecordWeight = WebAPIURL + "Receipt/GetReceiptRecordWeight";
export const GetWeighBridgeForReceipt = WebAPIURL + "Receipt/GetWeighBridgeForReceipt";
export const ReceiptPrintRAN = WebAPIURL + "Receipt/ReceiptPrintRAN";
export const ReceiptPrintBOD = WebAPIURL + "Receipt/ReceiptPrintBOD";
export const ReceiptSendBOD = WebAPIURL + "Receipt/ReceiptSendBOD";
export const ReceiptBSIOutboundRegenerate = WebAPIURL + "Receipt/ReceiptBSIOutboundRegenerate";
export const ReceiptRecordLadenWeight = WebAPIURL + "Receipt/ReceiptRecordLadenWeight";
export const ReceiptRecordTareWeight = WebAPIURL + "Receipt/ReceiptRecordTareWeight";
export const GetBondLookUpSetting = WebAPIURL + "MarineCommon/GetBondLookUpSetting";
export const GetTMVersion = WebAPIURL + "Common/GetTMVersion";
export const GetReportParams = WebAPIURL + "Reports/GetReportDetails";
export const ReportPrint = WebAPIURL + "Reports/ReportPrint";
export const GetReportList = WebAPIURL + "Reports/GetReportList";

export const GetReportServiceURI = WebAPIURL + "Reports/GetReportServiceURI";

export const OpenTimeIsEqualNow =
  WebAPIURL + "EODAdministration/OpenTimeIsEqualNow";
export const GetSystemDeviceStatus = WebAPIURL + "ViewSystemStatus/GetDeviceStatus";
export const GetExternalSystemStatusList = WebAPIURL + "ViewSystemStatus/GetExternalSystemStatusList";
export const GetArchiveSystemStatus = WebAPIURL + "ViewSystemStatus/GetArchiveSystemStatus";
export const IsTWICEnabled = WebAPIURL + "ViewSystemStatus/IsTWICEnabled";
export const GetTwicServiceStatus = WebAPIURL + "ViewSystemStatus/GetTwicServiceStatus";
export const GetServerStatus = WebAPIURL + "ViewSystemStatus/GetServerStatus";
export const CheckDeviceStaus = WebAPIURL + "ViewSystemStatus/CheckDeviceStaus";
export const GetTerminalCommunicationStatus = WebAPIURL + "ViewSystemStatus/GetTerminalCommunicationStatus";
export const UpdateContractStatus = WebAPIURL + "Contract/UpdateContractStatus";
export const GetContractList = WebAPIURL + "Contract/GetContractList";
export const GetAllDevices = WebAPIURL + "Device/GetAllDevices";
export const GetCaptainList = WebAPIURL + "Captain/GetCaptainList";
export const CreateTMUser = WebAPIURL + "Captain/CreateTMUser";
export const GetGeneralTMUser = WebAPIURL + "Captain/GetGeneralTMUser";
export const UpdateTMUser = WebAPIURL + "Captain/UpdateTMUser";
export const DeleteTMUsers = WebAPIURL + "Captain/DeleteTMUsers";
export const GetAutoGeneratedContractCode = WebAPIURL + "Contract/GetAutoGeneratedContractCode";
export const UpdateReceiptBond = WebAPIURL + "Receipt/UpdateReceiptBond";
export const GetTankShareholderAssociation = WebAPIURL + "TankShareholderAssociation/GetTankShareholderAssociation";
export const GetTankShareholderAuditTrial = WebAPIURL + "TankShareholderAssociation/GetTankShareholderAuditTrial";
export const GetViewAllMarineDispatchCustomData = WebAPIURL + "MarineDispatch/GetViewAllMarineDispatchCustomData";
export const GetViewAllMarineReceiptCustomData = WebAPIURL + "MarineReceipt/GetViewAllMarineReceiptCustomData";

export const CreateBCUDevice = WebAPIURL + "Device/CreateBCUDevice";
export const CreateCRDevice = WebAPIURL + "Device/CreateCRDevice";
export const CreateDEUDevice = WebAPIURL + "Device/CreateDEUDevice";
export const CreateWBDevice = WebAPIURL + "Device/CreateWBDevice";
export const DeleteDevice = WebAPIURL + "Device/DeleteDevice";
export const GetMarineDispatchManualEntryEnabled = WebAPIURL + "MarineDispatch/GetMarineDispatchManualEntryEnabled";
export const GetMarineReceiptManualEntryEnabled = WebAPIURL + "MarineReceipt/GetMarineReceiptManualEntryEnabled";
export const GetBayGroupList = WebAPIURL + "BayGroupConfiguration/GetBayGroupList";
export const DeleteBayGroup = WebAPIURL + "BayGroupConfiguration/DeleteBayGroup";
export const GetBayGroup = WebAPIURL + "BayGroupConfiguration/GetBayGroup";
export const CreateBayGroup = WebAPIURL + "BayGroupConfiguration/CreateBayGroup";
export const UpdateBayGroup = WebAPIURL + "BayGroupConfiguration/UpdateBayGroup";
export const GetBayList = WebAPIURL + "BayGroupConfiguration/GetBayList"
export const GetAllStaffVisitor = WebAPIURL + "Captain/GetAllStaffVisitor";
export const GetAllCheckInCheckOut = WebAPIURL + "Captain/GetAllCheckInCheckOut";
export const StaffVisitorCheckInCheckOut = WebAPIURL + "Captain/StaffVisitorCheckInCheckOut";
export const GetLastCheckInCheckOutInfo = WebAPIURL + "Captain/GetLastCheckInCheckOutInfo";
export const GetAllWebPortalUser = WebAPIURL + "SecurityUserAssociation/GetAllWebPortalSecurityUsers";
export const GetSecurityUsers = WebAPIURL + "SecurityUserAssociation/GetSecurityUsersForWebPortal";
export const GetEntityForPortalUser = WebAPIURL + "SecurityUserAssociation/GetAllEntityInfoForPortalUser";
export const CreateWebPortalUser = WebAPIURL + "SecurityUserAssociation/AddSecurityUser";
export const UpdateWebPortalUser = WebAPIURL + "SecurityUserAssociation/UpdateSecurityUser";
export const GetWebPortalUser = WebAPIURL + "SecurityUserAssociation/GetWebPortalUser";
export const DeleteWebPortalUser = WebAPIURL + "SecurityUserAssociation/DeleteSecurityUser";
export const GetPipelineHeaderList = WebAPIURL + "SiteView/GetPipelineHeaderList";
export const GetPipelineHeaderType = WebAPIURL + "SiteView/GetHeaderType";
export const GetAllPipelineMeterList = WebAPIURL + "SiteView/GetAllPipelineMeterList";
export const CreatePipelineHeader = WebAPIURL + "SiteView/CreatePipelineHeader";
export const UpdatePipelineHeader = WebAPIURL + "SiteView/UpdatePipelineHeader";
export const GetPipelineHeader = WebAPIURL + "SiteView/GetPipelineHeader";
export const DeletePipelineHeader = WebAPIURL + "SiteView/DeletePipelineHeader";
export const GetPipelineMeterList = WebAPIURL + "SiteView/GetPipelineMeterList";
export const CreatePipelineMeter = WebAPIURL + "SiteView/CreatePipelineMeter";
export const UpdatePipelineMeter = WebAPIURL + "SiteView/UpdatePipelineMeter";
export const GetPipelineMeter = WebAPIURL + "SiteView/GetPipelineMeter";
export const DeletePipelineMeter = WebAPIURL + "SiteView/DeletePipelineMeter";
export const GetExchangePartnerList = WebAPIURL + "ExchangePartner/GetExchangePartnerList";
export const DeleteExchangePartner = WebAPIURL + "ExchangePartner/DeleteExchangePartner";
export const GetExchangePartner = WebAPIURL + "ExchangePartner/GetExchangePartner";
export const CreateExchangePartner = WebAPIURL + "ExchangePartner/CreateExchangePartner";
export const UpdateExchangePartner = WebAPIURL + "ExchangePartner/UpdateExchangePartner";
export const GetShareholdersList = WebAPIURL + "ExchangePartner/GetShareholdersList";
export const GetAllPipelineHeadersList = WebAPIURL + "PipelineReceipt/GetAllPipelineHeadersList";
export const GetShipmentActivityInfo = WebAPIURL + "common/getShipmentActivityInfo";
export const GetReceiptActivityInfo = WebAPIURL + "common/getReceiptActivityInfo";
export const GetAllSecurityUsers = WebAPIURL + "Security/GetAllSecurityUsers";
export const GetDomainNames = WebAPIURL + "Security/GetDomainNames";
export const GetSecurityRoles = WebAPIURL + "Security/GetSecurityRoles";
export const GetSecurityUser = WebAPIURL + "Security/GetSecurityUser";
export const DeleteSecurityUsers = WebAPIURL + "Security/DeleteSecurityUsers";
export const CreateSecurityUser = WebAPIURL + "Security/CreateSecurityUser";
export const GetInheritedRoles = WebAPIURL + "Security/GetInheritedRoles";
export const UpdateUser = WebAPIURL + "Security/UpdateUser";
export const GetProcessConfigurationListForRole = WebAPIURL + "ProcessConfiguration/GetProcessConfigurationListForRole";
export const GetWorkflowTypes = WebAPIURL + "ProcessConfiguration/GetWorkflowTypes";
export const GetProcessConfigDeviceType = WebAPIURL + "ProcessConfiguration/GetDeviceType";
export const GetProcessConfigDeviceCodes = WebAPIURL + "ProcessConfiguration/GetDeviceCodes";
export const CreateProcessConfiguration = WebAPIURL + "ProcessConfiguration/CreateProcessConfiguration";
export const UpdateProcessConfiguration = WebAPIURL + "ProcessConfiguration/UpdateProcessConfiguration";
export const GetProcessConfiguration = WebAPIURL + "ProcessConfiguration/GetProcessConfiguration";
export const DeleteProcessConfiguration = WebAPIURL + "ProcessConfiguration/DeleteProcessConfiguration";
export const GetMultiDropDevices = WebAPIURL + "ProcessConfiguration/GetMultiDropDevices";
export const GetLookupData = WebAPIURL + "LookUp/GetLookupData";
export const UpdateLookupData = WebAPIURL + "LookUp/UpdateLookupData";
export const DeleteShareholderAllocation = WebAPIURL + "ShareholderAllocation/DeleteShareholderAllocation";
export const GetShareholderAllocationList = WebAPIURL + "ShareholderAllocation/GetShareholderAllocationList";
export const GetShareholderAllocation = WebAPIURL + "ShareholderAllocation/GetShareholderAllocation";
export const CreateShareholderAllocation = WebAPIURL + "ShareholderAllocation/CreateShareholderAllocation";
export const UpdateShareholderAllocation = WebAPIURL + "ShareholderAllocation/UpdateShareholderAllocation";
export const GetAllocationItemDetails = WebAPIURL + "ShareholderAllocation/GetAllocationItemDetails";
export const GetShipmentAllocationDetails = WebAPIURL + "ShareholderAllocation/GetShipmentAllocationDetails";
export const GetAllocationTypes = WebAPIURL + "ShareholderAllocation/GetAllocationTypes";
export const GetSCADAParameterMapping = WebAPIURL + "BayAllocationScadaConfiguration/GetSCADAParameterMapping";
export const GetPointConfig = WebAPIURL + "BayAllocationScadaConfiguration/GetPointConfig";
export const CreateConfig = WebAPIURL + "BayAllocationScadaConfiguration/CreateConfig";
export const GetNotificationList = WebAPIURL + "Notification/GetLogs";
export const GetNotificationGroup = WebAPIURL + "Notification/GetNotificationGroup";
export const GetNotificationGroupDetails = WebAPIURL + "Notification/GetNotificationGroupDetails";
export const CreateNotificationGroup = WebAPIURL + "Notification/CreateNotificationGroup";
export const UpdateNotificationGroup = WebAPIURL + "Notification/UpdateNotificationGroup";
export const DeleteNotificationGroup = WebAPIURL + "Notification/DeleteNotificationGroup";
export const GetNotificationRestriction = WebAPIURL + "Notification/GetNotificationRestriction";
export const CreateNotificationRestriction = WebAPIURL + "Notification/CreateNotificationRestriction";
export const UpdateNotificationRestriction = WebAPIURL + "Notification/UpdateNotificationRestriction";
export const DeleteNotificationRestriction = WebAPIURL + "Notification/DeleteNotificationRestriction";

export const GetNotification = WebAPIURL + "Notification/GetNotification";
export const GetPriorityForNotification = WebAPIURL + "Notification/GetPriorityForNotification";
export const GetNotificationGroupForDropdown = WebAPIURL + "Notification/GetNotificationGroupForDropdown";
export const CreateNotification = WebAPIURL + "Notification/CreateNotification";
export const UpdateNotification = WebAPIURL + "Notification/UpdateNotification";
export const DeleteNotification = WebAPIURL + "Notification/DeleteNotification"
export const GetUnallocatedShipmentsandReceipts = WebAPIURL + "BayAllocation/GetUnallocatedShipmentsandReceipts";
export const GetBays = WebAPIURL + "BayAllocation/GetBays";
export const AllocateBay = WebAPIURL + "BayAllocation/AllocateBay";
export const DeallocateShipment = WebAPIURL + "BayAllocation/DeallocateShipment";
export const SuggestBayForShipment = WebAPIURL + "BayAllocation/SuggestBayForShipment";
export const ClearBay = WebAPIURL + "BayAllocation/ClearBay";
export const ChangePosition = WebAPIURL + "BayAllocation/ChangeAllocatedItemPosition";
export const GetBayAllocationType = WebAPIURL + "BayAllocation/GetBayAllocationType";
export const SwitchBayType = WebAPIURL + "BayAllocation/SwitchBayType";
export const AutoBayAllocate = WebAPIURL + "BayAllocation/AutoBayAllocate";
export const GetATGMasterConfiguration = WebAPIURL + "ATGConfiguration/GetATGMasterConfiguration";
export const GetAttributeDataTypes = WebAPIURL + "Common/GetAttributeDataTypes";
export const GenerateATGConfiguration = WebAPIURL + "ATGConfiguration/GenerateATGConfiguration";
export const UpdateATGMasterConfiguration = WebAPIURL + "ATGConfiguration/UpdateATGMasterConfiguration";
export const GetLocationTypesandDeviceList = WebAPIURL + "MasterDeviceConfiguration/GetLocationTypesandDeviceList";
export const GetDeviceTypesandModels = WebAPIURL + "MasterDeviceConfiguration/GetDeviceTypesandModels";
export const GetPrinters = WebAPIURL + "common/GetPrinters";
export const GetReportScheduleDetails = WebAPIURL + "ReportSchedule/GetReportScheduleDetails";
export const GetAllReportNames = WebAPIURL + "ReportSchedule/GetAllReportNames";
export const CreateReportSchedule = WebAPIURL + "ReportSchedule/Create";
export const UpdateReportSchedule = WebAPIURL + "ReportSchedule/Update";
export const DeleteReportSchedule = WebAPIURL + "ReportSchedule/Delete";
export const GetReportsScheduledList = WebAPIURL + "ReportSchedule/GetReportsScheduledList";
export const GetWeighBridgeDeviceList = WebAPIURL + "WeighBridgeMonitor/GetWeighBridgeDeviceList";
export const GetWeighBridge = WebAPIURL + "WeighBridgeMonitor/GetWeighBridge";
export const GetWeightStableStatus = WebAPIURL + "WeighBridgeMonitor/GetWeightStableStatus";
export const UpdateWeighBridgeConfig = WebAPIURL + "WeighBridgeMonitor/UpdateWeighBridgeConfig";
export const SaveDeviceConfig = WebAPIURL + "MasterDeviceConfiguration/SaveDeviceConfiguration";
export const GetTankShareholderBySearchFilter = WebAPIURL + "TankShareholderAssociation/GetTanksBySearchFilter";
export const GetCustomerInventoryList = WebAPIURL + "CustomerInventory/GetCustomerInventoryList";
export const GetCustomerInventoryDetails = WebAPIURL + "CustomerInventory/GetCustomerInventoryDetails";
export const GetSecurityRolesList = WebAPIURL + "Security/GetSecurityRolesList";
export const GetSecurityRole = WebAPIURL + "Security/GetSecurityRole";
export const DeleteSecurityRole = WebAPIURL + "Security/DeleteSecurityRole";
export const CreateSecurityRole = WebAPIURL + "Security/CreateSecurityRole";
export const UpdateSecurityRole = WebAPIURL + "Security/UpdateSecurityRole";
export const GetShareholderAgreementsForRole = WebAPIURL + "ShareholderAgreement/GetShareholderAgreementsForRole";
export const GetExchangeAgreement = WebAPIURL + "ShareholderAgreement/GetExchangeAgreement";
export const CreateExchangeAgreement = WebAPIURL + "ShareholderAgreement/CreateExchangeAgreement";
export const UpdateExchangeAgreement = WebAPIURL + "ShareholderAgreement/UpdateExchangeAgreement";
export const GetEAAuditTrailInfo = WebAPIURL + "ShareholderAgreement/GetEAAuditTrailInfo"
export const GetExchangeAgreementShipmentItemDetails = WebAPIURL + "ShareholderAgreement/GetExchangeAgreementShipmentItemDetails"
export const GetShareholderAgreementTypes = WebAPIURL + "ShareholderAgreement/GetShareholderAgreementTypes";
export const UpdateExchangeAgreementStatus = WebAPIURL + "ShareholderAgreement/UpdateExchangeAgreementStatus";
export const CreateProductTransferAgreement = WebAPIURL + "ProductTransferAgreement/CreateProductTransferAgreement";
export const UpdateProductTransferAgreement = WebAPIURL + "ProductTransferAgreement/UpdateProductTransferAgreement";
export const GetProductTransferAgreement = WebAPIURL + "ProductTransferAgreement/GetProductTransferAgreement"
export const GetHazardousTankerCategories = WebAPIURL + "Common/GetHazardousTankerCategories";
export const GetHazardousProductCategories = WebAPIURL + "Common/GetHazardousProductCategories";
export const UpdateProductTransferAgreementStatus = WebAPIURL + "ProductTransferAgreement/UpdateProductTransferAgreementStatus";
export const UpdateTankShareholderAssociate = WebAPIURL + "TankShareholderAssociation/UpdateTankShareholderAssociate";
export const GetMasterPageMenu = WebAPIURL + "Common/GetMasterMenu";
export const GetServerStorageStatus = WebAPIURL + "ViewSystemStatus/GetStorageStatus";
export const GetShiftList = WebAPIURL + "Shift/GetShiftList";
export const GetShift = WebAPIURL + "Shift/GetShift";
export const AddUpdateShift = WebAPIURL + "Shift/AddUpdateShift";
export const DeleteShift = WebAPIURL + "Shift/DeleteShift";
export const GetAllShareholderInventory = WebAPIURL + "CustomerInventory/GetAllShareholderInventory";
export const GetPrinterConfigurationList = WebAPIURL + "PrinterConfiguration/GetPrinterConfigurationList";
export const GetAllLocationsForPrinterConfig = WebAPIURL + "PrinterConfiguration/GetAllLocationsForPrinterConfig";
export const GetAllPrinters = WebAPIURL + "PrinterConfiguration/GetAllPrinters";
export const GetPrintersForLocation = WebAPIURL + "PrinterConfiguration/GetPrintersForLocation";
export const GetLocationPrinterConfig = WebAPIURL + "PrinterConfiguration/GetLocationPrinterConfig";
export const UpdateReportPrinterConfig = WebAPIURL + "PrinterConfiguration/UpdateReportPrinterConfig";
export const UpdateLocationPrinterConfig = WebAPIURL + "PrinterConfiguration/UpdateLocationPrinterConfig";
export const UpdateBackUpPrinterConfig = WebAPIURL + "PrinterConfiguration/UpdateBackUpPrinterConfig";
export const GetAllAvailableReports = WebAPIURL + "PrinterConfiguration/GetAllAvailableReports";
export const GetAssociatedReports = WebAPIURL + "PrinterConfiguration/GetAssociatedReports";
export const GetInitialCustomerInventory = WebAPIURL + "CustomerInventory/GetInitialCustomerInventory";
export const CreateInitialInventory = WebAPIURL + "CustomerInventory/CreateInitialInventory";
export const GetCustomerStockTransferList = WebAPIURL + "CustomerStockTransfer/GetCustomerStockTransferList";
export const GetCustomerStockTransfer = WebAPIURL + "CustomerStockTransfer/GetCustomerStockTransfer";
export const CreateCustomerStockTransfer = WebAPIURL + "CustomerStockTransfer/CreateCustomerStockTransfer";
export const GetShareholderAgreementStatus = WebAPIURL + "ShareholderAgreement/GetShareholderAgreementStatus"

export const ComminglingTankShareholderAssociation = WebAPIURL + "Commingling/GetTankshareholderAssociation";
export const ValidateUserCredentials = WebAPIURL + "AuthenticateUser/ValidateUserCredentials";
export const GetAllValidBays = WebAPIURL + "BayAllocation/GetAllValidBays";
export const GetBayAllocatedInfoByTransaction = WebAPIURL + "BayAllocation/GetBayAllocatedInfoByTransaction";
export const GetCustomerRecipe = WebAPIURL + "CustomerRecipe/GetCustomerRecipe";
export const CreateCustomerRecipe = WebAPIURL + "CustomerRecipe/CreateCustomerRecipe";
export const DeleteCustomerRecipe = WebAPIURL + "CustomerRecipe/DeleteCustomerRecipe";
export const UpdateCustomerRecipe = WebAPIURL + "CustomerRecipe/UpdateCustomerRecipe";
export const GetCustomerRecipeListForRole = WebAPIURL + "CustomerRecipe/GetCustomerRecipeListForRole";

export const DeleteCOAParameter = WebAPIURL + "COA/DeleteCOAParameter";
export const GetCOAParameterListForRole =
  WebAPIURL + "COA/GetCOAParametersListForRole";
export const GetCOAParameter = WebAPIURL + "COA/GetCOAParameter";
export const CreateCOAParameter = WebAPIURL + "COA/CreateCOAParameter";
export const UpdateCOAParameter = WebAPIURL + "COA/UpdateCOAParameter";

export const DeleteCOATemplate = WebAPIURL + "COA/DeleteCOATemplate";
export const GetCOATemplateListForRole =
  WebAPIURL + "COA/GetCOATemplatesListForRole";
export const GetCOATemplate = WebAPIURL + "COA/GetCOATemplate";
export const GetAllParameters = WebAPIURL + "COA/GetAllParameters";
export const CreateCOATemplate = WebAPIURL + "COA/CreateCOATemplate";
export const UpdateCOATemplate = WebAPIURL + "COA/UpdateCOATemplate";
export const GetTemplateFromTemplate = WebAPIURL + "COA/GetTemplateCodeList";

export const DeleteCOAManagement = WebAPIURL + "COA/DeleteCOAManagement";
export const DeleteCOAManagementFinishedProduct = WebAPIURL + "COA/DeleteCOAManagementFP";
export const GetCOAManagementListForRole =
  WebAPIURL + "COA/GetCOAManagementsListForRole";
export const GetCOAManagementFinishedProductListForRole =
  WebAPIURL + "COA/GetCOAManagementFPListForRole";
export const GetCOAManagement = WebAPIURL + "COA/GetCOAManagement";
export const GetCOAManagementFinishedProduct = WebAPIURL + "COA/GetCOAManagementFP";
export const CreateCOAManagement = WebAPIURL + "COA/CreateCOAManagement";
export const UpdateCOAManagement = WebAPIURL + "COA/UpdateCOAManagement";
export const CreateCOAManagementFinishedProduct = WebAPIURL + "COA/CreateCOAManagementFP";
export const UpdateCOAManagementFinishedProduct = WebAPIURL + "COA/UpdateCOAManagementFP";
export const GetTemplateFromTank = WebAPIURL + "COA/GetTemplateFromTank";
export const GetCOAManagementInfoFromTank = WebAPIURL + "COA/GetCOAManagementInfoFromTank";
export const GetCOATemplateForManagement = WebAPIURL + "COA/GetCOATemplateForManagement";

export const GetCOACustomerListForRole =
  WebAPIURL + "COA/GetCOACustomersListForRole";
export const DeleteCOACustomer = WebAPIURL + "COA/DeleteCOACustomer";
export const GetCOACustomer = WebAPIURL + "COA/GetCOACustomer";
export const CreateCOACustomer = WebAPIURL + "COA/CreateCOACustomer";
export const UpdateCOACustomer = WebAPIURL + "COA/UpdateCOACustomer";
export const GetCustomerDisabledParameter = WebAPIURL + "COA/GetCustomerDisabledParameter";
export const GetTemplateCodeForCOACustomer = WebAPIURL + "COA/GetTemplateCodeForCOACustomer";
export const GetCOATemplateForCustomer = WebAPIURL + "COA/GetCOATemplateForCustomer";
export const GetTDisableParametersForCustomer = WebAPIURL + "COA/GetTDisableParametersForCustomer";

export const GetCOAAssignment = WebAPIURL + "COA/GetCOAAssignment";
export const GetCOATransactionBayCodes = WebAPIURL + "COA/GetCOATransactionBayCodes";
export const GetCOATransactionTankCodes = WebAPIURL + "COA/GetCOATransactionTankCodes";
export const GetTransactionBaseCOACodes = WebAPIURL + "COA/GetTransactionBaseCOACodes";
export const GetParametersByAssignment = WebAPIURL + "COA/GetParametersByAssignment";
export const COAAssignmentUpdate = WebAPIURL + "COA/COAAssignmentUpdate";
export const COAAssignmentCreate = WebAPIURL + "COA/COAAssignmentCreate";
export const GetCOAAssignmentListForRole = WebAPIURL + "COA/GetCOAAssignmentsListForRole";
export const GetCOATransactionCompartment = WebAPIURL + "COA/GetCOATransactionCompartment";
export const GetAllFinishedProducts = WebAPIURL + "Common/GetAllFinishedProducts";
export const GetTemplateofBaseProduct = WebAPIURL + "COA/GetTemplateofBaseProduct";
export const GetProductForecastConfiguration = WebAPIURL + "ProductForecastConfiguration/GetProductForecastConfiguration";
export const CreateProductForecastConfiguration = WebAPIURL + "ProductForecastConfiguration/Create";
export const UpdateProductForecastConfiguration = WebAPIURL + "ProductForecastConfiguration/Update";
export const GetProductForecastConfigurationCustomData = WebAPIURL + "ProductForecastConfiguration/ProductForecastConfigurationCustomData";
export const GetPastShipmentListForRole = WebAPIURL + "RoadSummary/GetPastShipmentListForRole";
export const GetPastReceiptListForRole = WebAPIURL + "RoadSummary/GetPastReceiptListForRole";
export const GetPendingTransaction = WebAPIURL + "RoadSummary/GetPendingTransaction";
export const GetPendingTransactionCount = WebAPIURL + "RoadSummary/GetPendingTransactionCount";
export const GetBayQueueInfoForUser = WebAPIURL + "Common/GetBayQueueInfoForUser";
export const GetTanksForProductForecast = WebAPIURL + "ProductForecast/GetTankInfoForProductForecasting";
export const GetBaseProductsForTerminal = WebAPIURL + "Common/GetAllBaseProduct";
export const GetProductForecastDetails = WebAPIURL + "ProductForecast/GetProductForecastDetails";
export const GetLoadingArmSwingArmList = WebAPIURL + "SiteView/GetLoadingArmSwingArmList";

//Omkar 20June24
export const ProjectPost = WebAPIURL + "Project/ProjectPost";
export const ProjectGet = WebAPIURL + "Project/ProjectGet";