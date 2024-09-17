import React, { useState } from "react";
import {
  Select,
  Icon,
  Input,
  DatePicker,
  Tab,
  Checkbox,
  Accordion,
  Button,
  Modal,
  Tooltip,
} from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";
import * as Utilities from "../../../JS/Utilities";
import * as Constants from "../../../JS/Constants";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

TruckReceiptDetails.propTypes = {
  receipt: PropTypes.object.isRequired,
  modReceipt: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  modCompartments: PropTypes.array.isRequired,
  modRecordWeight: PropTypes.array.isRequired,
  modCustomerInventory: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  modCustomValues: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    terminalCodes: PropTypes.array,
    quantityUOMOptions: PropTypes.array,
    vehicleOptions: PropTypes.array,
    driverOptions: PropTypes.array,
    compSeqOptions: PropTypes.array,
    finishedProductOptions: PropTypes.array,
    supplierOriginOptions: PropTypes.array,
    supplierOptions: PropTypes.array,
    baseProductOptions: PropTypes.array,
    customerOptions: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  selectedAssociations: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCustomerSelectionChange: PropTypes.func.isRequired,
  selectedCustomerInventory: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleCellCompartmentDataEdit: PropTypes.func.isRequired,
  handleCustomerInventory: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleAddCustomerInventory: PropTypes.func.isRequired,
  handleDeleteCustomerInventory: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  onVehicleChange: PropTypes.func.isRequired,
  onSupplierChange: PropTypes.func.isRequired,
  onVehicleSearchChange: PropTypes.func.isRequired,
  onDriverChange: PropTypes.func.isRequired,
  onDriverSearchChange: PropTypes.func.isRequired,
  onVehicleResultsClear: PropTypes.func.isRequired,
  onDriverResultsClear: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  IsWebPortalUser: PropTypes.bool.isRequired,
  onTabChange: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  expandedRows: PropTypes.array.isRequired,
  attributeToggleExpand: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  compartmentDetailsSave: PropTypes.func.isRequired,
  customerInventoryTab: PropTypes.bool.isRequired,
  compartmentTab: PropTypes.bool.isRequired,
  recordweightTab: PropTypes.bool.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  saveEnabled: PropTypes.bool,
  IsPastDisable: PropTypes.bool.isRequired,
  SupplierEnable: PropTypes.bool.isRequired,
  isHSEInspectionEnable: PropTypes.bool.isRequired,
  isSlotbookinginUI: PropTypes.bool.isRequired,
  compartmentDetailsPageSize: PropTypes.number.isRequired,
  isBonded: PropTypes.bool.isRequired,
  UpdateReceiptBondNo: PropTypes.func.isRequired,
  handleCellCheck: PropTypes.func.isRequired,
  ReceiptBay: PropTypes.string.isRequired,
  UpdateReceiptDriver: PropTypes.func.isRequired,
  isWebportalCarrierRoleUser: PropTypes.bool.isRequired,
};

TruckReceiptDetails.defaultProps = {
  listOptions: {
    quantityUOMOptions: [],
    vehicleOptions: [],
    terminalCodes: [],
    driverOptions: [],
    supplierOriginOptions: [],
    originalterminalOptions: [],
    compSeqOptions: [],
    finishedProductOptions: [],
    baseProductCode: [],
    supplierOptions: [],
    customerCode: [],
    baseProductOptions: [],
    customerOptions: [],
  },
  isEnterpriseNode: false,
  IsWebPortalUser: false,
  isSlotbookinginUI: false,
  isBonded: false,
  ReceiptBay: "",
};
export default function TruckReceiptDetails({
  receipt,
  modReceipt,
  modAssociations,
  validationErrors,
  listOptions,
  searchResults,
  onFieldChange,
  onDateTextChange,
  onAllTerminalsChange,
  selectedAssociations,
  handleRowSelectionChange,
  handleCustomerSelectionChange,
  selectedCustomerInventory,
  handleCellDataEdit,
  handleCellCompartmentDataEdit,
  handleCustomerInventory,
  handleAddCustomerInventory,
  handleAddAssociation,
  handleDeleteAssociation,
  handleDeleteCustomerInventory,
  onActiveStatusChange,
  onVehicleChange,
  onSupplierChange,
  onVehicleSearchChange,
  onDriverChange,
  onDriverSearchChange,
  onVehicleResultsClear,
  onDriverResultsClear,
  isEnterpriseNode,
  IsWebPortalUser,
  onTabChange,
  activeTab,
  expandedRows,
  toggleExpand,
  attributeToggleExpand,
  modCompartments,
  customerInventoryTab,
  modCustomerInventory,
  // customerInventory,
  compartmentTab,
  recordweightTab,
  selectedAttributeList,
  attributeValidationErrors,
  handleAttributeCellDataEdit,
  handleCompAttributeCellDataEdit,
  handleCellCheck,
  compartmentDetailsSave,
  saveEnabled,
  IsPastDisable,
  SupplierEnable,
  isHSEInspectionEnable,
  isSlotbookinginUI,
  compartmentDetailsPageSize,
  isBonded,
  UpdateReceiptBondNo,
  modRecordWeight,
  modCustomValues,
  ReceiptBay,
  UpdateReceiptDriver,
  isWebportalCarrierRoleUser
}) {
  const [t] = useTranslation();
  const [modelOpen, setModelOpen] = useState(false);
  const [modCellData, setModCellData] = useState({});
  // const handleSupplierEditDropDown = (cellData) => {
  //   let supplierOptions = [];
  //       if (
  //           listOptions.supplierOriginOptions !== undefined &&
  //           listOptions.supplierOriginOptions !== null
  //       ) {
  //           Object.keys(listOptions.supplierOriginOptions).forEach((supplier) =>
  //               supplierOptions.push({ text: supplier, value: supplier })
  //           );
  //       }
  //       return handleCustomEditDropDown(cellData, supplierOptions);
  //   };

  const handleEnableOriginTerminalEditDropDown = (cellData) => {
    let originalterminalOptions = [];
    if (
      listOptions.supplierOriginOptions !== undefined &&
      listOptions.supplierOriginOptions !== null
    ) {
      if (
        listOptions.supplierOriginOptions[cellData.rowData.SupplierCode] !==
          undefined &&
        Array.isArray(
          listOptions.supplierOriginOptions[cellData.rowData.SupplierCode]
        )
      ) {
        listOptions.supplierOriginOptions[
          cellData.rowData.SupplierCode
        ].forEach((origins) =>
          originalterminalOptions.push({ text: origins, value: origins })
        );
      }
    }
    return handleCustomEditDropDown(cellData, originalterminalOptions);
  };
  const handleOriginTerminalEditDropDown = (cellData) => {
    let originalterminalOptions = [];
    if (
      listOptions.supplierOriginOptions !== undefined &&
      listOptions.supplierOriginOptions !== null
    ) {
      if (
        listOptions.supplierOriginOptions[modReceipt.SupplierCode] !==
          undefined &&
        Array.isArray(
          listOptions.supplierOriginOptions[modReceipt.SupplierCode]
        )
      ) {
        listOptions.supplierOriginOptions[modReceipt.SupplierCode].forEach(
          (origins) =>
            originalterminalOptions.push({ text: origins, value: origins })
        );
      }
    }
    return handleCustomEditDropDown(cellData, originalterminalOptions);
  };

  const handleCustomEditDropDown = (cellData, dropDownoptions) => {
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <Select
        className="selectDropwdown"
        value={modAssociations[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownoptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
      //   )}
      // </TranslationConsumer>
    );
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      // <TranslationConsumer>
      //   {(t) => (

      <Input
        fluid
        value={modAssociations[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
      //   )}
      // </TranslationConsumer>
    );
  };
  const handleCustomerInvetoryEditDropDown = (cellData, dropDownoptions) => {
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <Select
        className="selectDropwdown"
        value={modCustomerInventory[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownoptions}
        onChange={(value) => handleCustomerInventory(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
      //   )}
      // </TranslationConsumer>
    );
  };
  const handleCustomerInvetoryEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modCustomerInventory[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCustomerInventory(value, cellData)}
        reserveSpace={false}
      />
    );
  };
  const decimalDisplayValues = (cellData) => {
    const { value } = cellData;
    if (typeof value === "number") {
      return value.toLocaleString();
    } else {
      return value;
    }
  };
  function displayTMModalForceCompleteConfirm() {
    return (
      <Modal open={modelOpen} size="small">
        <Modal.Content>
          <div>
            <b>{t("ForceToComplete")}</b>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Button
            type="secondary"
            content={t("Cancel")}
            onClick={() => {
              setModelOpen(false);
              handleCellCheck(modCellData, false);
            }}
          />
          <Button
            type="primary"
            content={t("Confirm")}
            onClick={() => {
              setModelOpen(false);
              handleCellCheck(modCellData, true);
            }}
          />
        </Modal.Footer>
      </Modal>
    );
  }
  const handleForceComplete = (cellData) => {
    let chkForceCompleted = false;
    if (
      cellData.rowData.CompartmentStaus !== null ||
      cellData.rowData.CompartmentStaus !== undefined
    )
      chkForceCompleted =
        Constants.Receipt_Status[modReceipt.ReceiptStatus] ===
          Constants.Receipt_Status.CLOSED ||
        Constants.ReceiptCompartment_Status[
          cellData.rowData.CompartmentStaus
        ] === Constants.ReceiptCompartment_Status.COMPLETED ||
        Constants.ReceiptCompartment_Status[
          cellData.rowData.CompartmentStaus
        ] === Constants.ReceiptCompartment_Status.UNLOADING ||
        Constants.ReceiptCompartment_Status[
          cellData.rowData.CompartmentStaus
        ] === Constants.ReceiptCompartment_Status.FORCE_COMPLETED
          ? true
          : false;
    return (
      <div style={{ textAlign: "center" }}>
        <Checkbox
          className="forceCompleteChkBox"
          checked={cellData.rowData.ForceCompleted}
          disabled={
            cellData.rowData.CompartmentStaus !== null ||
            cellData.rowData.CompartmentStaus !== undefined
              ? chkForceCompleted
              : false
          }
          onChange={(data) => {
            setModCellData(cellData);
            if (data) {
              setModelOpen(true);
            } else {
              handleCellCheck(cellData, data);
            }
          }}
        />
      </div>
    );
  };
  const handleStatus = (e) => {
    if (e === Constants.ReceiptCompartment_Status.EMPTY) {
      return "EMPTY";
    } else if (e === Constants.ReceiptCompartment_Status.UNLOADING) {
      return "UNLOADING";
    } else if (e === Constants.ReceiptCompartment_Status.PART_UNLOADED) {
      return "PART_UNLOADED";
    } else if (e === Constants.ReceiptCompartment_Status.OVER_UNLOADED) {
      return "OVER_UNLOADED";
    } else if (e === Constants.ReceiptCompartment_Status.FORCE_COMPLETED) {
      return "FORCE_COMPLETED";
    } else if (e === Constants.ReceiptCompartment_Status.COMPLETED) {
      return "COMPLETED";
    } else if (e === Constants.ReceiptCompartment_Status.UNLOAD_NOTSTARTED) {
      return "UNLOAD_NOTSTARTED";
    } else {
      return "";
    }
  };
  //  const handleQuantity = (e, UOM) => {
  //   if (e != null) {
  //     return e + UOM;
  //   } else {
  //     return "";
  //   }
  // };

  const expanderTemplate = (data) => {
    const open =
      expandedRows.findIndex((x) => x.SeqNumber === data.rowData.SeqNumber) >= 0
        ? true
        : false;
    return (
      <div
        onClick={() => toggleExpand(data.rowData, open)}
        className="compartmentIcon gridButtonFontColor"
      >
        {/* <span>{open ? t("Hide_Attributes") : t("View_Attributes")}</span> */}
        <Icon
          root="common"
          name={open ? "slidercontrols-minus" : "ellipsis-horizontal"}
          className="margin_l10"
        />
      </div>
    );
  };
  const expanderAttributeTemplate = (data) => {
    //const open = expandedRows.includes(data.rowData);
    const open =
      expandedRows.findIndex(
        (x) =>
          x.CompartmentSeqNoInTrailer === data.rowData.CompartmentSeqNoInTrailer
      ) >= 0
        ? true
        : false;
    return (
      <div
        onClick={() => attributeToggleExpand(data.rowData, open)}
        className="compartmentIcon gridButtonFontColor"
      >
        <span>{open ? t("Hide_Attributes") : t("View_Attributes")}</span>
        <Icon
          root="common"
          name={open ? "caret-up" : "caret-down"}
          className="margin_l10"
        />
      </div>
    );
  };
  const handleInputTextBox = (data) => {
    let field = data.field;
    return (
      <Input
        fluid
        disabled={
          // modReceipt.ReceiptStatus !== Constants.Receipt_Status.QUEUED ||
          // (data.rowData.CompartmentStaus !== (Constants.ReceiptCompartment_Status.FORCE_COMPLETED || Constants.ReceiptCompartment_Status.UNLOADING || Constants.ReceiptCompartment_Status.COMPLETED || Constants.ReceiptCompartment_Status.OVER_UNLOADED || Constants.Receipt_Status.MANUALLY_UNLOADED))
          modReceipt.ReceiptStatus === Constants.Receipt_Status.CLOSED ||
          modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ||
          modReceipt.ReceiptStatus ===
            Constants.Receipt_Status.MANUALLY_UNLOADED
        }
        value={data.rowData[field]}
        onChange={(value) => handleCellCompartmentDataEdit(value, data)}
        reserveSpace={false}
      />
    );
  };
  function rowExpansionTemplate(data) {
    let compData = [];
    compData.push(data);
    return Array.isArray(compData) && compData.length > 0 ? (
      <div className="ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={compData}>
          <DataTable.Column
            className="compColHeight"
            key="revisedplannedquantity"
            field="revisedplannedquantity"
            header={t("ViewReceiptList_AdjustPlannedQuantity")}
            editable={false}
            renderer={(cellData) => decimalDisplayValues(cellData)}
            customEditRenderer={handleCustomEditTextBox}
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            // editable={true}
            field="AdjustedQuantity"
            key="AdjustedQuantity"
            header={t("ViewShipment_AdjustmentToPlannedQuantity")}
            renderer={handleInputTextBox}
          />
          <DataTable.Column
            className="compColHeight"
            key="UnLoadedQuantity"
            field="UnLoadedQuantity"
            header={t("ViewMarineReceiptList_UnloadedQuantity")}
            editable={false}
            editFieldType="text"
            renderer={(cellData) => decimalDisplayValues(cellData)}
            customEditRenderer={handleCustomEditTextBox}
          ></DataTable.Column>
        </DataTable>
      </div>
    ) : (
      ""
      // <div className="compartmentIcon">
      //     <div className="gridButtonAlignLeft">
      //         {t("CustomerInventory_NoRecordsFound")}
      //     </div>
      // </div>
    );
  }
  const handleAttributeType = (data) => {
    const attribute = data.rowData;
    const handleAttributeDateValue = (dateval) => {
      var chars = dateval.split("-");
      return new Date(chars[0], chars[1] - 1, chars[2]);
    };
    const convertAttributeDatetoString = (attribute, value) => {
      var Dateval = new Date(value);
      value =
        Dateval.getFullYear() +
        "-" +
        ("0" + (Dateval.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + Dateval.getDate()).slice(-2);
      handleCompAttributeCellDataEdit(attribute, value);
    };
    try {
      return attribute.DataType.toLowerCase() ===
        Constants.DataType.STRING.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.INT.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
          Constants.DataType.FLOAT.toLowerCase() ||
        attribute.DataType.toLowerCase() ===
          Constants.DataType.LONG.toLowerCase() ||
        attribute.DataType.toLowerCase() ===
          Constants.DataType.DOUBLE.toLowerCase() ? (
        <Input
          fluid
          value={
            attribute.AttributeValue === null ||
            attribute.AttributeValue === undefined ||
            attribute.AttributeValue === ""
              ? ""
              : attribute.AttributeValue.toLocaleString()
          }
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.BOOL.toLowerCase() ? (
        <Checkbox
          checked={
            attribute.AttributeValue.toString().toLowerCase() === "true"
              ? true
              : false
          }
          disabled={attribute.IsReadonly}
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
        ></Checkbox>
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.DATETIME.toLowerCase() ? (
        <DatePicker
          fluid
          value={
            attribute.AttributeValue === null ||
            attribute.AttributeValue === undefined ||
            attribute.AttributeValue === ""
              ? ""
              : handleAttributeDateValue(attribute.AttributeValue)
          }
          disabled={attribute.IsReadonly}
          showYearSelector="true"
          onChange={(value) => convertAttributeDatetoString(data, value)}
          onTextChange={(value) => {
            convertAttributeDatetoString(data, value);
          }}
          minuteStep={1}
          reserveSpace={false}
        />
      ) : null;
    } catch (error) {
      console.log("OrderDetails:Error occured on handleAttributeType", error);
    }
  };
  const handleIsRequiredCompAttributes = (data) => {
    return data.rowData.IsMandatory ? (
      <div>
        <span>{data.rowData.AttributeName}</span>
        <div className="ui red circular empty label badge  circle-padding" />
      </div>
    ) : (
      <div>
        <span>{data.rowData.AttributeName}</span>
      </div>
    );
  };
  function rowExpansionAtributeTemplate(data) {
    let compData = [];
    compData.push("rowExpansionAtributeTemplate", data);
    return Array.isArray(data.AttributesforUI) &&
      data.AttributesforUI.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable
          data={data.AttributesforUI}
          //  rows={5}
          rows={compartmentDetailsPageSize}
        >
          {isEnterpriseNode ? (
            <DataTable.Column
              className="compColHeight"
              key="TerminalCode"
              field="TerminalCode"
              header={t("CompartmentTerminal")}
              editable={false}
            ></DataTable.Column>
          ) : (
            ""
          )}
          <DataTable.Column
            className="compColHeight"
            key="AttributeName"
            header={t("CompartmentAttributeName")}
            renderer={handleIsRequiredCompAttributes}
            editable={false}
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            header={t("CompartmentAttributeValue")}
            renderer={handleAttributeType}
          />
          {Array.isArray(data.AttributesforUI) &&
          data.AttributesforUI.length > compartmentDetailsPageSize ? (
            <DataTable.Pagination />
          ) : (
            ""
          )}
        </DataTable>
      </div>
    ) : (
      <div className="compartmentIcon">
        <div className="gridButtonAlignLeft">
          {t("CustomerInventory_NoRecordsFound")}
        </div>
      </div>
    );
  }
  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };
  return (
    // <TranslationConsumer>
    //   {(t) => (
    <div className="detailsContainer">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modReceipt.ReceiptCode}
            label={t("Receipt_Code")}
            indicator="required"
            disabled={receipt.ReceiptCode !== ""}
            onChange={(data) => onFieldChange("ReceiptCode", data)}
            error={t(validationErrors.ReceiptCode)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4 planneddate">
          <DatePicker
            fluid
            value={new Date(modReceipt.ScheduledDate)}
            initialWidth="160px"
            label={t("Receipt_ArrivalDateTime")}
            displayFormat={getCurrentDateFormat()}
            type="datetime"
            showYearSelector="true"
            disablePast={IsPastDisable === true ? false : true}
            indicator="required"
            minuteStep={1}
            onChange={(data) => onFieldChange("ScheduledDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("ScheduledDate", value, error);
            }}
            error={t(validationErrors.ScheduledDate)}
            reserveSpace={false}
            // disabled={receipt.ReceiptStatus !== "READY"}
            disabled={
              receipt.ReceiptCode !== "" &&
              modCustomValues["ReceiptUpdateAllow"] !== "TRUE"
            }
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modReceipt.ReceiptStatus === null ? "" : modReceipt.ReceiptStatus
            }
            label={t("Receipt_ReceiptStatus")}
            disabled={true}
          />
        </div>
        {!(
          receipt.ReceiptStatus === Constants.Receipt_Status.READY &&
          receipt.ReceiptCode === ""
        ) &&
        !isEnterpriseNode &&
        isHSEInspectionEnable ? (
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              //  value={getVehicleHSEValue()}
              value={modReceipt.HSEInspectionStatus}
              label={t("Marine_ShipmentCompDetail_InspectionStatus")}
              reserveSpace={false}
              disabled={true}
            />
          </div>
        ) : (
          ""
        )}
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("FinishedProductInfo_Select")}
            label={t("Receipt_Vehicle")}
            value={
              modReceipt.VehicleCode === null ? "" : modReceipt.VehicleCode
            }
            options={listOptions.vehicleOptions}
            onChange={(data) => {
              onVehicleChange(data);
            }}
            indicator="required"
            search={true}
            noResultsMessage={t("noResultsMessage")}
            error={t(validationErrors.VehicleCode)}
            onSearch={onVehicleSearchChange}
            reserveSpace={false}
            // disabled={receipt.ReceiptStatus !== "READY"}
            disabled={
              receipt.ReceiptCode !== "" &&
              modCustomValues["ReceiptUpdateAllow"] !== "TRUE"
            }
          />
        </div>

        {/* <div className="col-12 col-md-6 col-lg-4">
          <div className="ui fluid">
            <InputLabel
              label={t("Receipt_Vehicle")}
              indicator="required"
            ></InputLabel>
            <Search
              results={searchResults.vehicleOptions}
              value={
                modReceipt.VehicleCode === null ? "" : modReceipt.VehicleCode
              }
              disabled={receipt.ReceiptStatus !== "READY"}
              onResultSelect={(result) => onVehicleChange(result.title)}
              onSearchChange={(value) => onVehicleSearchChange(value)}
              onResultClear={onVehicleResultsClear}
              error={t(validationErrors.VehicleCode)}
              reserveSpace={false}
              noResultsMessage={t("noResultsMessage")}
            />
          </div> */}
        {/* </div> */}

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modReceipt.CarrierCode === null ? "" : modReceipt.CarrierCode
            }
            label={t("Receipt_CarrierCompany")}
            disabled={true}
            error={t(validationErrors.CarrierCode)}
            reserveSpace={false}
          />
        </div>
       
        <div className="col-12 col-md-6 col-lg-4">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Select className={isWebportalCarrierRoleUser?"pr-2":""}
            fluid
            placeholder={t("FinishedProductInfo_Select")}
            label={t("Receipt_Driver")}
            value={modReceipt.DriverCode === null ? "" : modReceipt.DriverCode}
            options={getOptionsWithSelect(
              listOptions.driverOptions,
              t("Common_Select")
            )}
            onChange={(data) => {
              onFieldChange("DriverCode", data);
            }}
            search={true}
            noResultsMessage={t("noResultsMessage")}
            // disabled={receipt.ReceiptStatus !== "READY"}
           

            disabled={ (isWebportalCarrierRoleUser && modCustomValues["ReceiptUpdateAllow"] === "TRUE")?false:(receipt.ReceiptCode !== ""
            ? modCustomValues["ReceiptUpdateAllow"] !== "TRUE"
            : false) }

            onSearch={onDriverSearchChange}
          />
               {isWebportalCarrierRoleUser ? (

            <Tooltip
            content={t("ShipmentCompDetail_BtnSave")}
            element={
              <Button  className="iconBtn mt-auto"
              type="primary"

              onClick={() => {
                UpdateReceiptDriver();
              }}
              disabled={ receipt.ReceiptStatus === Constants.Receipt_Status.READY  ? false : true}
            ><Icon root="building" name="save" size="large" className="mt-auto"/>

            </Button>
            }
            position="left center"
            event="hover"
            hoverable={true}
            />

                ) : (
                  ""
                )}
        </div>
        </div>
        {!SupplierEnable ? (
          <div className="col-12 col-md-6 col-lg-4">
            <Select
              fluid
              placeholder={t("FinishedProductInfo_Select")}
              label={t("Receipt_Supplier")}
              value={modReceipt.SupplierCode}
              options={listOptions.supplierOptions}
              onChange={(data) => {
                onSupplierChange(data);
                //onFieldChange("SupplierCode", data);
              }}
              indicator="required"
              search={true}
              noResultsMessage={t("noResultsMessage")}
              error={t(validationErrors.SupplierCode)}
              reserveSpace={false}
              // disabled={receipt.ReceiptStatus !== "READY"}
              disabled={
                receipt.ReceiptCode !== "" &&
                modCustomValues["ReceiptUpdateAllow"] !== "TRUE"
              }
            />
          </div>
        ) : (
          ""
        )}
        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("FinishedProductInfo_Select")}
            label={t("Receipt_QuantityUOM")}
            value={
              modReceipt.ReceiptQuantityUOM === null
                ? ""
                : modReceipt.ReceiptQuantityUOM
            }
            options={listOptions.quantityUOMOptions}
            onChange={(data) => onFieldChange("ReceiptQuantityUOM", data)}
            indicator="required"
            error={t(validationErrors.ReceiptQuantityUOM)}
            reserveSpace={false}
            // disabled={receipt.ReceiptStatus !== "READY"}
            disabled={
              receipt.ReceiptCode !== "" &&
              modCustomValues["ReceiptUpdateAllow"] !== "TRUE"
            }
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>
        {receipt.ReceiptCode !== "" &&
        receipt.ReceiptStatus !== Constants.Receipt_Status.READY ? (
          <div className="col-12 col-md-6 col-lg-4">
            <Input
              fluid
              value={modReceipt.ActualTerminalCode}
              label={t("Shipment_LoadedTerminal")}
              options={Utilities.transferListtoOptions([
                modReceipt.ActualTerminalCode,
              ])}
              reserveSpace={false}
              disabled={true}
              multiple={true}
            />
          </div>
        ) : (
          ""
        )}
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              modReceipt.Description === null ? "" : modReceipt.Description
            }
            onChange={(data) => onFieldChange("Description", data)}
            label={t("Receipt_Desc")}
            error={t(validationErrors.Description)}
            reserveSpace={false}
            // disabled={receipt.ReceiptStatus !== "READY"}
            disabled={
              receipt.ReceiptCode !== "" &&
              modCustomValues["ReceiptUpdateAllow"] !== "TRUE"
            }
          />
        </div>
        {/* <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("FinishedProductInfo_Select")}
                label={t("Receipt_Driver")}
                value={
                  modReceipt.DriverCode === null ? "" : modReceipt.DriverCode
                }
                options={getOptionsWithSelect(
                  listOptions.driverOptions,
                  t("Common_Select")
                )}
                onChange={(data) => {
                  onFieldChange("DriverCode", data);
                }}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                disabled={receipt.ReceiptStatus !== "READY"}
              />
            </div> */}

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("FinishedProductInfo_Select")}
            label={t("Receipt_Status")}
            value={modReceipt.Active}
            options={[
              { text: t("Receipt_Active"), value: true },
              { text: t("Receipt_InActive"), value: false },
            ]}
            onChange={(data) => onActiveStatusChange(data)}
            disabled={receipt.ReceiptStatus !== "READY"}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modReceipt.Remarks === null ? "" : modReceipt.Remarks}
            label={t("Receipt_Remarks")}
            onChange={(data) => onFieldChange("Remarks", data)}
            indicator={modReceipt.Active !== receipt.Active ? "required" : ""}
            error={t(validationErrors.Remarks)}
            reserveSpace={false}
            disabled={
              receipt.ReceiptCode !== "" &&
              modCustomValues["ReceiptUpdateAllow"] !== "TRUE"
            }
          />
        </div>
        {receipt.ReceiptCode !== "" && isSlotbookinginUI ? (
          <div className="col-12 col-md-6 col-lg-4 ddlSelectAll">
            <div className="ui single-input fluid disabled">
              <div className="ui input-label">
                <span className="input-label-message">
                  {t("ViewShipment_IsSlotBooked")}
                </span>
              </div>
              <div className="input-wrap">
                <label style={{ fontWeight: "bold" }}>
                  {modReceipt.SlotBooked ? "Booked" : "Not Booked"}
                </label>
                {/* <Checkbox
                                            //className="LabelEnabled"
                                            //label={t("ViewShipment_IsSlotBooked")}
                                            checked={modShipment.SlotBooked}
                                            disabled={true}
                                        /> */}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {receipt.ReceiptCode !== "" &&
        receipt.ReceiptStatus !== "READY" &&
        receipt.ReceiptStatus !== "CLOSE" &&
        ReceiptBay !== null &&
        ReceiptBay !== "" &&
        ReceiptBay !== undefined ? (
          <div className="col-12 col-md-6 col-lg-4 ddlSelectAll">
            <div className="ui single-input fluid disabled">
              <div className="ui input-label">
                <span className="input-label-message">
                  {t("ViewAllocateBay_AllocateBay")}
                  {":"}
                </span>
              </div>
              <div className="input-wrap">
                <label style={{ fontWeight: "bold" }}>{ReceiptBay}</label>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {isBonded ? (
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="ui single-input fluid disabled"
              style={{ width: "30%", float: "left" }}
            >
              <div class="ui input-label">
                <span className="input-label-message">
                  {t("VehicleInfo_Bonded")}
                </span>
              </div>
              <div className="input-wrap">
                <Checkbox
                  onChange={(data) => onFieldChange("IsBonded", data)}
                  checked={modReceipt.IsBonded}
                  disabled={receipt.ReceiptStatus !== "READY"}
                />
              </div>
            </div>
            {modReceipt.IsBonded ? (
              <div style={{ width: "70%", float: "right" }}>
                <Input
                  fluid
                  value={modReceipt.BondNo === null ? "" : modReceipt.BondNo}
                  onChange={(data) => onFieldChange("BondNo", data)}
                  label={t("RailDispatchPlanDetail_BondedNumber")}
                  reserveSpace={false}
                  // disabled={
                  //   modReceipt.ReceiptCode !== ""
                  //   // && modCustomValues["BondUpdateAllow"] !== "TRUE"
                  // }
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {receipt.ReceiptCode !== "" && modReceipt.IsBonded && isBonded ? (
          <div className="col-12 col-md-6 col-lg-4">
            <Button
              content={t("ReceiptViewDetail_SaveReceiptBondNo")}
              // disabled={
              //     // modCustomValues["BondUpdateAllow"] !== "TRUE"
              // }
              onClick={UpdateReceiptBondNo}
            ></Button>
          </div>
        ) : (
          ""
        )}
        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modReceipt.TerminalCodes}
              error={t(validationErrors.TerminalCodes)}
              onFieldChange={onFieldChange}
              onCheckChange={onAllTerminalsChange}
            ></AssociatedTerminals>
          </div>
        ) : (
          ""
        )}
      </div>
      {selectedAttributeList.length > 0
        ? selectedAttributeList.map((attire) => (
            <ErrorBoundary>
              <Accordion>
                <Accordion.Content
                  className="attributeAccordian"
                  title={
                    isEnterpriseNode
                      ? attire.TerminalCode + " - " + t("Attributes_Header")
                      : t("Attributes_Header")
                  }
                >
                  <AttributeDetails
                    selectedAttributeList={attire.attributeMetaDataList}
                    handleCellDataEdit={handleAttributeCellDataEdit}
                    attributeValidationErrors={handleValidationErrorFilter(
                      attributeValidationErrors,
                      attire.TerminalCode
                    )}
                  ></AttributeDetails>
                </Accordion.Content>
              </Accordion>
            </ErrorBoundary>
          ))
        : null}
      {/* {IsWebPortalUser ? ( */}
      <div className="shipmentTabAlignment">
        <Tab
          activeIndex={activeTab}
          onTabChange={(activeIndex) => {
            onTabChange(activeIndex);
          }}
        >
          <Tab.Pane title={t("Receipt_PlanHeader")}>
            <div className="row compartmentRow">
              <div className="col ">
                <div className="compartmentIconContainer">
                  <div
                    onClick={handleAddAssociation}
                    className="compartmentIcon"
                  >
                    <div>
                      <Icon root="common" name="badge-plus" size="medium" />
                    </div>
                    <div className="margin_l10">
                      <h5 className="font14">{t("TrailerInfo_Add")}</h5>
                    </div>
                  </div>

                  <div
                    onClick={handleDeleteAssociation}
                    className="compartmentIcon margin_l30"
                  >
                    <div>
                      <Icon root="common" name="delete" size="medium" />
                    </div>
                    <div className="margin_l10">
                      <h5 className="font14">{t("TrailerInfo_Delete")}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row marginRightZero tableScroll">
              <div className="col-12 detailsTable">
                <DataTable
                  data={modAssociations}
                  selectionMode="multiple"
                  selection={selectedAssociations}
                  onSelectionChange={handleRowSelectionChange}
                  scrollable={true}
                  scrollHeight="320px"
                  expandedRows={expandedRows}
                  rowExpansionTemplate={rowExpansionAtributeTemplate}
                >
                  <DataTable.Column
                    className="compColHeight colminWidth"
                    key="CompartmentSeqNoInVehicle"
                    field="CompartmentSeqNoInVehicle"
                    header={t("Receipt_CompSeqInVehicle")}
                    // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                    editable={
                      receipt.ReceiptCode !== "" &&
                      modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                        ? true
                        : false
                    }
                    editFieldType="text"
                    customEditRenderer={(celldata) =>
                      handleCustomEditDropDown(
                        celldata,
                        listOptions.compSeqOptions
                      )
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight colminWidth"
                    key="CompartmentCode"
                    field="CompartmentCode"
                    header={t("Receipt_CompartmentCode")}
                    // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                    editable={
                      modReceipt.ReceiptStatus ===
                        Constants.Receipt_Status.READY ||
                      modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                        ? true
                        : false
                    }
                    editFieldType="text"
                    customEditRenderer={(celldata) =>
                      handleCustomEditDropDown(
                        celldata,
                        listOptions.compSeqOptions
                      )
                    }
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight colminWidth"
                    key="FinishedProductCode"
                    field="FinishedProductCode"
                    header={t("Receipt_Product")}
                    // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                    editable={
                      modReceipt.ReceiptStatus ===
                        Constants.Receipt_Status.READY ||
                      modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                        ? true
                        : false
                    }
                    editFieldType="text"
                    customEditRenderer={(celldata) =>
                      handleCustomEditDropDown(
                        celldata,
                        listOptions.finishedProductOptions
                      )
                    }
                  ></DataTable.Column>
                  {SupplierEnable ? (
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="SupplierCode"
                      field="SupplierCode"
                      header={t("Receipt_Supplier")}
                      // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                      editable={
                        modReceipt.ReceiptStatus ===
                          Constants.Receipt_Status.READY ||
                        modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                          ? true
                          : false
                      }
                      editFieldType="text"
                      customEditRenderer={(celldata) =>
                        handleCustomEditDropDown(
                          celldata,
                          listOptions.supplierOptions
                        )
                      }
                    ></DataTable.Column>
                  ) : (
                    ""
                  )}
                  {SupplierEnable ? (
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="OriginTerminalCode"
                      field="OriginTerminalCode"
                      header={t("OriginTerminal")}
                      // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                      editable={
                        modReceipt.ReceiptStatus ===
                          Constants.Receipt_Status.READY ||
                        modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                          ? true
                          : false
                      }
                      editFieldType="text"
                      customEditRenderer={(celldata) =>
                        handleEnableOriginTerminalEditDropDown(
                          celldata,
                          listOptions.originalterminalOptions
                        )
                      }
                    ></DataTable.Column>
                  ) : (
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="OriginTerminalCode"
                      field="OriginTerminalCode"
                      header={t("OriginTerminal")}
                      // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                      editable={
                        modReceipt.ReceiptStatus ===
                          Constants.Receipt_Status.READY ||
                        modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                          ? true
                          : false
                      }
                      editFieldType="text"
                      customEditRenderer={(celldata) =>
                        handleOriginTerminalEditDropDown(
                          celldata,
                          listOptions.originalterminalOptions
                        )
                      }
                    ></DataTable.Column>
                  )}
                  <DataTable.Column
                    className="compColHeight colminWidth"
                    key="Quantity"
                    field="Quantity"
                    header={t("Receipt_Quantity")}
                    // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                    editable={
                      modReceipt.ReceiptStatus ===
                        Constants.Receipt_Status.READY ||
                      modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                        ? true
                        : false
                    }
                    editFieldType="text"
                    renderer={(cellData) => decimalDisplayValues(cellData)}
                    customEditRenderer={handleCustomEditTextBox}
                  ></DataTable.Column>
                  <DataTable.Column
                    className="expandedColumn"
                    initialWidth="200px"
                    renderer={expanderAttributeTemplate}
                  />
                </DataTable>
              </div>
            </div>
          </Tab.Pane>

          {compartmentTab ? (
            <Tab.Pane title={t("ViewReceiptList_CompartmentDetails")}>
              {" "}
              <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable">
                  <DataTable
                    data={modCompartments}
                    rowExpansionTemplate={rowExpansionTemplate}
                    scrollable={true}
                    scrollHeight="320px"
                    expandedRows={expandedRows}
                  >
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="TrailerCode"
                      field="TrailerCode"
                      header={t("ViewReceipt_TrailerCode")}
                      editable={true}
                      editFieldType="text"
                    ></DataTable.Column>
                    {/* <DataTable.Column
                                      className="compColHeight"
                                      key="CompartmentSeqNoInVehicle"
                                      field="CompartmentSeqNoInVehicle"
                                      header={t("Receipt_CompSeqInVehicle")}
                                      editable={true}
                                      editFieldType="text"
                                      customEditRenderer={(celldata) =>
                                        handleCustomEditDropDown(celldata, listOptions.compSeqOptions)
                                      }
                                    ></DataTable.Column> */}
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="CompartmentCode"
                      field="CompartmentCode"
                      header={t("Receipt_CompartmentCode")}
                      editable={
                        modReceipt.ReceiptStatus ===
                        Constants.Receipt_Status.READY
                          ? true
                          : false
                      }
                      editFieldType="text"
                      customEditRenderer={(celldata) =>
                        handleCustomEditDropDown(
                          celldata,
                          listOptions.compSeqOptions
                        )
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="FinishedProductCode"
                      field="FinishedProductCode"
                      header={t("Receipt_Product")}
                      editable={
                        modReceipt.ReceiptStatus ===
                        Constants.Receipt_Status.READY
                          ? true
                          : false
                      }
                      editFieldType="text"
                    ></DataTable.Column>

                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="Quantity"
                      field="Quantity"
                      header={t("ViewReceipt_Quantity")}
                      editable={
                        modReceipt.ReceiptStatus ===
                        Constants.Receipt_Status.READY
                          ? true
                          : false
                      }
                      editFieldType="text"
                      renderer={(cellData) => decimalDisplayValues(cellData)}
                      customEditRenderer={handleCustomEditTextBox}
                    ></DataTable.Column>

                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="CompartmentStaus"
                      field="CompartmentStaus"
                      header={t("ViewCompartment_Status")}
                      editable={false}
                      renderer={(celldata) =>
                        handleStatus(celldata.rowData.CompartmentStaus)
                      }
                      customEditRenderer={handleCustomEditTextBox}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      initialWidth="100px"
                      //  key="ForceCompleted"
                      //  field="ForceCompleted"
                      header={t("ViewShipment_ForceComplete")}
                      renderer={handleForceComplete}
                    />
                    <DataTable.Column
                      className="expandedColumn"
                      initialWidth="50px"
                      renderer={expanderTemplate}
                    />
                  </DataTable>
                </div>
              </div>
              <div className="row">
                <div className="col col-lg-4"></div>
              </div>
            </Tab.Pane>
          ) : (
            []
          )}

          {customerInventoryTab ? (
            <Tab.Pane title={t("CustomerInventory_Plan")}>
              <div>
                <div className="row compartmentRow">
                  <div className="col ">
                    <div className="compartmentIconContainer">
                      <div
                        onClick={handleAddCustomerInventory}
                        className="compartmentIcon"
                      >
                        <div>
                          <Icon root="common" name="badge-plus" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">{t("TrailerInfo_Add")}</h5>
                        </div>
                      </div>

                      <div
                        onClick={handleDeleteCustomerInventory}
                        className="compartmentIcon margin_l30"
                      >
                        <div>
                          <Icon root="common" name="delete" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">{t("TrailerInfo_Delete")}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row marginRightZero">
                  <div className="col-12 detailsTable">
                    <DataTable
                      data={modCustomerInventory}
                      scrollable={true}
                      scrollHeight="320px"
                      selectionMode="multiple"
                      selection={selectedCustomerInventory}
                      onSelectionChange={handleCustomerSelectionChange}
                    >
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="CustomerCode"
                        field="CustomerCode"
                        header={t("Customer_Code")}
                        //  editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                        editable={
                          modReceipt.ReceiptStatus ===
                            Constants.Receipt_Status.READY ||
                          modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                            ? true
                            : false
                        }
                        editFieldType="text"
                        renderer={(cellData) => decimalDisplayValues(cellData)}
                        customEditRenderer={(celldata) =>
                          handleCustomerInvetoryEditDropDown(
                            celldata,
                            listOptions.customerOptions
                          )
                        }
                      ></DataTable.Column>
                      {/* {modReceipt.ReceiptCode == "" && modReceipt.ReceiptStatus === Constants.Receipt_Status.READY  ? */}
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="FinishedProductCode"
                        field="FinishedProductCode"
                        header={t("Receipt_Product")}
                        // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                        editable={
                          modReceipt.ReceiptStatus ===
                            Constants.Receipt_Status.READY ||
                          modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                            ? true
                            : false
                        }
                        editFieldType="text"
                        renderer={(cellData) => decimalDisplayValues(cellData)}
                        customEditRenderer={(celldata) =>
                          handleCustomerInvetoryEditDropDown(
                            celldata,
                            listOptions.finishedProductOptions
                          )
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="PlannedQuantity"
                        field="PlannedQuantity"
                        // editable={modReceipt.ReceiptStatus === Constants.Receipt_Status.READY ? true : false}
                        editable={
                          modReceipt.ReceiptStatus ===
                            Constants.Receipt_Status.READY ||
                          modCustomValues["ReceiptUpdateAllow"] === "TRUE"
                            ? true
                            : false
                        }
                        editFieldType="text"
                        renderer={(cellData) => decimalDisplayValues(cellData)}
                        customEditRenderer={handleCustomerInvetoryEditTextBox}
                        header={t("ViewShipmentCompartment_PlannedQuantity")}
                      ></DataTable.Column>
                    </DataTable>
                  </div>
                </div>
              </div>
            </Tab.Pane>
          ) : (
            []
          )}
          {recordweightTab ? (
            <Tab.Pane title={t("ViewReceiptList_RecordWeight")}>
              {" "}
              <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable">
                  <DataTable
                    data={modRecordWeight}
                    scrollable={true}
                    scrollHeight="320px"
                  >
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="WeighbridgeCode"
                      field="WeighbridgeCode"
                      header={t("ReceiptByCompartmentList_WeightBridgeCode")}
                      editable={false}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="MeasuredWeight"
                      field="MeasuredWeight"
                      header={t("ReceiptByCompartmentList_Weight")}
                      editable={false}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="weight"
                      field="weight"
                      header={t("ReceiptByCompartmentList_WeightType")}
                      editable={false}
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="MeasuredWeightTime"
                      field="MeasuredWeightTime"
                      header={t("ReceiptByCompartmentList_WeightDatetime")}
                      editable={false}
                    ></DataTable.Column>
                  </DataTable>
                </div>
              </div>
              <div className="row">
                <div className="col col-lg-4"></div>
              </div>
            </Tab.Pane>
          ) : (
            []
          )}
        </Tab>
      </div>
      {displayTMModalForceCompleteConfirm()}
    </div>
  );
}
