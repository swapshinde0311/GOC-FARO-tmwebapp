import React, { useState } from "react";
import { DataTable } from "@scuf/datatable";
import {
  DatePicker,
  Input,
  Select,
  Icon,
  Tab,
  Modal,
  Button,
  Checkbox,
  Accordion,
} from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";
import * as Constants from "../../../JS/Constants";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "./AttributeDetails";
import { handleIsRequiredCompartmentCell } from "../../../JS/functionalUtilities";

MarineReceiptDetails.propTypes = {
  marineReceipt: PropTypes.object.isRequired,
  modMarineReceipt: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
    shipmentUOM: PropTypes.array,
    compSeqOptions: PropTypes.array,
    vessels: PropTypes.array,
    FinishedProducts: PropTypes.object,
    supplierDestinationOptions: PropTypes.object,
    shareholderSuppliers: PropTypes.array,
  }).isRequired,
  selectedAssociations: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  onVesselSearchChange: PropTypes.func.isRequired,
  onCarrierSearchChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  receiptCompartmentDetails: PropTypes.array.isRequired,
  operationsVisibilty: PropTypes.object.isRequired,
  viewTab: PropTypes.number.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  expandedRows: PropTypes.array.isRequired,
  expandedCompDetailRows: PropTypes.array.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  onCarrierCompanyChange: PropTypes.func.isRequired,
  isHSEInspectionEnable: PropTypes.bool.isRequired,
  isBondShow: PropTypes.bool.isRequired,
  isTransloading: PropTypes.bool.isRequired,
  compDetailsTab: PropTypes.array.isRequired,
  isSlotbookinginUI: PropTypes.bool.isRequired,
  updateEnableForConfigure: PropTypes.bool.isRequired,
};

MarineReceiptDetails.defaultProps = {
  isEnterpriseNode: false,
  isSlotbookinginUI: false,
};

export function MarineReceiptDetails({
  marineReceipt,
  modMarineReceipt,
  modAssociations,
  modTankAssociations,
  validationErrors,
  listOptions,
  selectedAssociations,
  onFieldChange,
  onDateTextChange,
  handleRowSelectionChange,
  handleCellDataEdit,
  handleTankCellDataEdit,
  handleAddAssociation,
  handleDeleteAssociation,
  onVesselSearchChange,
  onCarrierSearchChange,
  isEnterpriseNode,
  receiptCompartmentDetails,
  modReceiptCompartment,
  operationsVisibilty,
  viewTab,
  handleDeleteTankAssociation,
  handleAddTankAssociation,
  onTabChange,
  selectedTankAssociations,
  handleTankAssociationSelectionChange,
  selectedAttributeList,
  handleAttributeCellDataEdit,
  attributeValidationErrors,
  expandedRows,
  expandedCompDetailRows,
  toggleExpand,
  handleCompAttributeCellDataEdit,
  onCarrierCompanyChange,
  isHSEInspectionEnable,
  isBondShow,
  isTransloading,
  compDetailsTab,
  isSlotbookinginUI,
  updateEnableForConfigure,
}) {
  const [t] = useTranslation();
  const [isBondNoShow, setBondNoShow] = useState(false);
  const handleCustomEditDropDown = (cellData, dropDownoptions) => {
    return (
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
    );
  };

  const handleTankPlanEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modTankAssociations[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleTankCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        editable={false}
        value={modAssociations[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  const changeBondNo = (checked) => {
    setBondNoShow(checked);
    this.props.onFieldChange("Bonded");
  };

  const handleTankPlanEditDropDown = (cellData, dropDownoptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modTankAssociations[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownoptions}
        onChange={(value) => handleTankCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  const handleBaseProductEditDropDown = (cellData) => {
    let baseProductOptions = [];
    var baseProductDetails = [];
    if (
      listOptions.baseProductDetails !== null &&
      listOptions.baseProductDetails !== undefined
    ) {
      baseProductDetails = listOptions.baseProductDetails.ALLPROD;
    }
    if (
      listOptions.additiveDetails !== null &&
      listOptions.additiveDetails !== undefined
    ) {
      baseProductDetails = baseProductDetails.concat(
        listOptions.additiveDetails.ALLPROD
      );
    }
    if (
      listOptions.baseProductDetails !== undefined &&
      listOptions.baseProductDetails !== null
    ) {
      if (baseProductDetails.length > 0) {
        Object.values(baseProductDetails).forEach((baseProduct) =>
          baseProductOptions.push({ text: baseProduct, value: baseProduct })
        );
      }
    }
    return handleTankPlanEditDropDown(cellData, baseProductOptions);
  };

  const handleTankCodeEditDropDown = (cellData) => {
    return handleTankPlanEditDropDown(cellData, listOptions.tankCodeOptions);
  };

  const handleTankProductEditDropDown = (cellData) => {
    let productOptions = [];
    if (
      listOptions.FinishedProducts !== undefined &&
      listOptions.FinishedProducts !== null
    ) {
      if (
        listOptions.FinishedProducts[cellData.rowData.ShareholderCode] !==
        undefined &&
        Array.isArray(
          listOptions.FinishedProducts[cellData.rowData.ShareholderCode]
        )
      ) {
        listOptions.FinishedProducts[cellData.rowData.ShareholderCode].forEach(
          (productcode) =>
            productOptions.push({ text: productcode, value: productcode })
        );
      }
    }
    return handleTankPlanEditDropDown(cellData, productOptions);
  };

  const handleProductEditDropDown = (cellData) => {
    let productOptions = [];
    if (
      listOptions.FinishedProducts !== undefined &&
      listOptions.FinishedProducts !== null
    ) {
      if (
        listOptions.FinishedProducts[cellData.rowData.ShareholderCode] !==
        undefined &&
        Array.isArray(
          listOptions.FinishedProducts[cellData.rowData.ShareholderCode]
        )
      ) {
        listOptions.FinishedProducts[cellData.rowData.ShareholderCode].forEach(
          (productcode) =>
            productOptions.push({ text: productcode, value: productcode })
        );
      }
    }
    return handleCustomEditDropDown(cellData, productOptions);
  };

  const handleCustomerEditDropDown = (cellData) => {
    let supplierOptions = [];
    if (
      listOptions.shareholderSuppliers !== undefined &&
      listOptions.shareholderSuppliers !== null
    ) {
      let suppliers = listOptions.shareholderSuppliers.filter(
        (shareholderCust) =>
          shareholderCust.ShareholderCode === cellData.rowData.ShareholderCode
      );
      if (
        suppliers.length > 0 &&
        suppliers[0].SupplierOriginTerminalsList !== null
      ) {
        Object.keys(suppliers[0].SupplierOriginTerminalsList).forEach(
          (customer) =>
            supplierOptions.push({ text: customer, value: customer })
        );
      }
    }

    return handleCustomEditDropDown(cellData, supplierOptions);
  };
  const handleOriginalTerminalEditDropDown = (cellData) => {
    let destinationOptions = [];
    let supplierDestinationOptions = [];
    if (
      listOptions.shareholderSuppliers !== undefined &&
      listOptions.shareholderSuppliers !== null
    ) {
      let suppliers = listOptions.shareholderSuppliers.filter(
        (shareholderCust) =>
          shareholderCust.ShareholderCode === cellData.rowData.ShareholderCode
      );
      if (
        suppliers.length > 0 &&
        suppliers[0].SupplierOriginTerminalsList !== null
      ) {
        supplierDestinationOptions = suppliers[0].SupplierOriginTerminalsList;
      }

      if (
        supplierDestinationOptions[cellData.rowData.SupplierCode] !==
        undefined &&
        Array.isArray(supplierDestinationOptions[cellData.rowData.SupplierCode])
      ) {
        supplierDestinationOptions[cellData.rowData.SupplierCode].forEach(
          (destination) =>
            destinationOptions.push({ text: destination, value: destination })
        );
      }
    }

    return handleCustomEditDropDown(cellData, destinationOptions);
  };
  const decimalDisplayValues = (cellData) => {
    const { value } = cellData;
    if (typeof value === "number" && value !== null) {
      return value.toLocaleString();
    } else {
      return value;
    }
  };

  const [modelOpen, setModelOpen] = useState(false);
  const [modCellData, setModCellData] = useState([]);
  const statusDisplayValues = (cellData) => {
    if (cellData.value === 0 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.COMPLETED.toLocaleString();
    }
    if (cellData.value === 1 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.EMPTY.toLocaleString();
    }
    if (cellData.value === 2 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.FORCE_COMPLETED;
    }
    if (cellData.value === 3 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.INTERRUPTED.toLocaleString();
    }
    if (cellData.value === 4 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.OVER_UNLOADED.toLocaleString();
    }
    if (cellData.value === 5 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.PART_UNLOADED.toLocaleString();
    }
    if (cellData.value === 6 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.UNLOAD_NOTSTARTED.toLocaleString();
    }
    if (cellData.value === 7 && cellData.value !== null) {
      return Constants.ReceiptCompartment_Status.UNLOADING.toLocaleString();
    } else {
      return cellData.value;
    }
  };

  const quantityplayValues = (cellData) => {
    if (cellData.value !== null && cellData.value !== "") {
      return cellData.value + " " + cellData.rowData.PlanQuantityUOM;
    } else {
      return cellData.value;
    }
  };

  const handleReceiptEditTextBox = (cellData) => {
    let rowIndex = modReceiptCompartment.findIndex(
      (item) =>
        item.CompartmentSeqNoInVehicle ===
        cellData.rowData.CompartmentSeqNoInVehicle
    );
    return (
      <div>
        {operationsVisibilty.adjustPlan &&
          (marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.PARTIALLY_UNLOADED ||
            marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.INTERRUPTED ||
            marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.MANUALLY_UNLOADED ||
            marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.AUTO_UNLOADED ||
            marineReceipt.ReceiptStatus === Constants.Receipt_Status.QUEUED) &&
          cellData.rowData.ReceiptCompartmentStatus !== 0 &&
          cellData.rowData.ReceiptCompartmentStatus !== 2 &&
          cellData.rowData.ReceiptCompartmentStatus !== 7 &&
          cellData.rowData.ReceiptCompartmentStatus !== 4 &&
          !isEnterpriseNode ? (
          <Input
            fluid
            value={modReceiptCompartment[rowIndex].AdjustPlan}
            disabled={false}
            onChange={(value) => handleCellDataEdit(value, cellData)}
            reserveSpace={false}
          />
        ) : (
          <Input fluid disabled={true} reserveSpace={false} />
        )}
      </div>
    );
  };

  const handleReceiptEdiCheckbox = (cellData) => {
    let rowIndex = modReceiptCompartment.findIndex(
      (item) =>
        item.CompartmentSeqNoInVehicle ===
        cellData.rowData.CompartmentSeqNoInVehicle
    );
    return (
      <div>
        {operationsVisibilty.forceComplete &&
          (marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.PARTIALLY_UNLOADED ||
            marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.INTERRUPTED ||
            marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.MANUALLY_UNLOADED ||
            marineReceipt.ReceiptStatus ===
            Constants.Receipt_Status.AUTO_UNLOADED ||
            marineReceipt.ReceiptStatus === Constants.Receipt_Status.QUEUED) &&
          cellData.rowData.ReceiptCompartmentStatus !== 0 &&
          cellData.rowData.ReceiptCompartmentStatus !== 2 &&
          cellData.rowData.ReceiptCompartmentStatus !== 7 &&
          cellData.rowData.ReceiptCompartmentStatus !== 4 &&
          !isEnterpriseNode ? (
          <Checkbox
            checked={modReceiptCompartment[rowIndex][cellData.field]}
            disabled={false}
            onClick={() => {
              if (!modReceiptCompartment[rowIndex][cellData.field]) {
                setModCellData(cellData);
                setModelOpen(true);
              } else {
                handleCellDataEdit("", cellData);
              }
            }}
          />
        ) : (
          <Checkbox
            checked={modReceiptCompartment[rowIndex][cellData.field]}
            disabled={true}
          />
        )}
      </div>
    );
  };

  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };

  const expanderTemplate = (data) => {
    const open =
      expandedRows.findIndex(
        (x) =>
          x.CompartmentSeqNoInVehicle === data.rowData.CompartmentSeqNoInVehicle
      ) >= 0
        ? true
        : false;
    return (
      <div
        onClick={() => toggleExpand(data.rowData, open)}
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

  const handleIsRequiredCompAttributes = (data) => {
    return data.rowData.IsMandatory ? (
      <div>
        <span>{data.rowData.AttributeName}</span>
        <div class="ui red circular empty label badge  circle-padding" />
      </div>
    ) : (
      <div>
        <span>{data.rowData.AttributeName}</span>
      </div>
    );
  };

  function rowExpansionTemplate(data) {
    return Array.isArray(data.AttributesforUI) &&
      data.AttributesforUI.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={data.AttributesforUI}>
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
        </DataTable>
      </div>
    ) : (
      <div className="compartmentIcon">
        <div style={{ paddingRight: "87%" }}>
          {t("CustomerInventory_NoRecordsFound")}
        </div>
      </div>
    );
  }

  const handleAttributeType = (data) => {
    const attribute = data.rowData;
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
          value={attribute.AttributeValue}
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
          minuteStep="5"
          value={
            attribute.AttributeValue === null ||
              attribute.AttributeValue === undefined ||
              attribute.AttributeValue === ""
              ? ""
              : new Date(attribute.AttributeValue)
          }
          disabled={attribute.IsReadonly}
          showYearSelector="true"
          onChange={(value) => handleCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : null;
    } catch (error) {
      console.log("TrailerDetails:Error occured on handleAttributeType", error);
    }
  };

  function rowExpansionTemplateDetail(data) {
    let compData = [];
    compData.push(data);
    return Array.isArray(compData) && compData.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={compData}>
          <DataTable.Column
            className="compColHeight"
            key="AdjustPlan"
            field="AdjustPlan"
            header={t("ViewMarineReceiptList_AdjustPlan")}
            renderer={(cellData) => handleReceiptEditTextBox(cellData)}
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            key="ForceComplete"
            field="ForceComplete"
            header={t("ViewMarineReceiptList_ForceComplete")}
            renderer={(cellData) => handleReceiptEdiCheckbox(cellData)}
          ></DataTable.Column>
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

  const handleIsTransloadingCheckbox = (cellData) => {
    return (
      <div>
        <Checkbox
          onChange={(data) => handleCellDataEdit(data, cellData)}
          disabled={!updateEnableForConfigure}
          checked={cellData.rowData.IsTransloading}
        ></Checkbox>
      </div>
    );
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modMarineReceipt.ReceiptCode}
                indicator="required"
                disabled={marineReceipt.ReceiptCode !== ""}
                onChange={(data) => onFieldChange("ReceiptCode", data)}
                label={t("Marine_ReceiptCompDetail_ShipmentNumber")}
                error={t(validationErrors.ReceiptCode)}
                reserveSpace={false}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                label={t("Marine_ShipmentCompDetail_CarrierCompany")}
                value={modMarineReceipt.CarrierCode}
                disabled={!updateEnableForConfigure}
                options={listOptions.carriers}
                onChange={(data) => {
                  onCarrierCompanyChange(data);
                }}
                error={t(validationErrors.CarrierCode)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                onSearch={onCarrierSearchChange}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                label={t("Marine_ShipmentCompDetail_Vehicle")}
                value={modMarineReceipt.VesselCode}
                disabled={!updateEnableForConfigure}
                options={getOptionsWithSelect(
                  listOptions.vessels,
                  t("Common_Select")
                )}
                onChange={(data) => {
                  onFieldChange("VesselCode", data);
                }}
                error={t(validationErrors.VesselCode)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                onSearch={onVesselSearchChange}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                minuteStep="5"
                value={
                  modMarineReceipt.ScheduledDate === null
                    ? ""
                    : new Date(modMarineReceipt.ScheduledDate)
                }
                disabled={!updateEnableForConfigure}
                label={t("Marine_ShipmentCompDetail_ScheduledDate")}
                type="datetime"
                disablePast={false}
                indicator="required"
                onChange={(data) => onFieldChange("ScheduledDate", data)}
                displayFormat={getCurrentDateFormat()}
                error={t(validationErrors.ScheduledDate)}
                onTextChange={(value, error) => {
                  onDateTextChange("ScheduledDate", value, error);
                }}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modMarineReceipt.ReceiptStatus}
                onChange={(data) => onFieldChange("ReceiptStatus", data)}
                label={t("Receipt_ReceiptStatus")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                label={t("Receipt_QuantityUOM")}
                value={modMarineReceipt.QuantityUOM}
                disabled={!updateEnableForConfigure}
                options={listOptions.shipmentUOM}
                onChange={(data) => {
                  onFieldChange("QuantityUOM", data);
                }}
                error={t(validationErrors.QuantityUOM)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modMarineReceipt.Description}
                disabled={!updateEnableForConfigure}
                onChange={(data) => onFieldChange("Description", data)}
                label={t("CarrierDetails_Desc")}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            {marineReceipt.ReceiptCode !== "" && isSlotbookinginUI ? (
              <div className="col-12 col-md-6 col-lg-4 ddlSelectAll">
                <div className="ui single-input fluid disabled">
                  <div class="ui input-label">
                    <span className="input-label-message">
                      {t("ViewShipment_IsSlotBooked")}
                    </span>
                  </div>
                  <div className="input-wrap">
                    <label style={{ fontWeight: "bold" }}>
                      {modMarineReceipt.SlotBooked ? "Booked" : "Not Booked"}
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {!(updateEnableForConfigure && marineReceipt.ReceiptCode === "") &&
              !isEnterpriseNode &&
              isHSEInspectionEnable ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modMarineReceipt.HSEInspectionStatus}
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
                label={t("Cust_Status")}
                value={modMarineReceipt.Active}
                options={[
                  { text: t("ViewShipment_Ok"), value: true },
                  { text: t("ViewShipmentStatus_Inactive"), value: false },
                ]}
                onChange={(data) => onFieldChange("Active", data)}
                disabled={
                  !updateEnableForConfigure || marineReceipt.ReceiptCode === ""
                }
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modMarineReceipt.Remarks}
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modMarineReceipt.Active !== marineReceipt.Active
                    ? "required"
                    : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
                disabled={!updateEnableForConfigure}
              />
            </div>
            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  indicator="required"
                  label={t("TerminalCodes")}
                  value={
                    modMarineReceipt.TerminalCodes === null
                      ? ""
                      : modMarineReceipt.TerminalCodes.length === 0
                        ? ""
                        : modMarineReceipt.TerminalCodes[0]
                  }
                  disabled={!updateEnableForConfigure}
                  options={getOptionsWithSelect(
                    Utilities.transferListtoOptions(listOptions.terminalCodes),
                    t("Common_Select")
                  )}
                  onChange={(data) => onFieldChange("TerminalCodes", data)}
                  error={t(validationErrors.TerminalCodes)}
                  reserveSpace={false}
                />
              </div>
            ) : (
              ""
            )}
            {!(updateEnableForConfigure && marineReceipt.ReceiptCode === "") &&
              isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  placeholder=""
                  label={t("Shipment_LoadedTerminal")}
                  value={marineReceipt.ActualTerminalCode}
                  disabled={true}
                />
              </div>
            ) : (
              ""
            )}
            {isBondShow ? (
              <div
                className="col-12 col-md-6 col-lg-4"
                style={{ paddingTop: "25px" }}
              >
                <Checkbox
                  label={t("ViewReceiptStatus_ReceiptBond")}
                  checked={isBondNoShow || marineReceipt.BondNumber !== null}
                  onChange={(checked) => changeBondNo(checked)}
                  disabled={!updateEnableForConfigure}
                />
              </div>
            ) : (
              ""
            )}
            {isBondShow &&
              (isBondNoShow || marineReceipt.BondNumber !== null) ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  indicator="required"
                  label={t("Receipt_BondedNo")}
                  value={marineReceipt.BondNumber}
                  error={t(validationErrors.BondNumber)}
                  disabled={!updateEnableForConfigure}
                  onChange={(data) => onFieldChange("BondNumber", data)}
                  reserveSpace={false}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {selectedAttributeList.length > 0
            ? selectedAttributeList.map((attire) => (
              <ErrorBoundary key={attire}>
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
          <div>
            <Tab
              defaultActiveIndex={viewTab}
              className="col-12"
              onTabChange={onTabChange}
            >
              <Tab.Pane title={t("Shipment_Compartment_Planning_Tab_Header")}>
                <div className="row compartmentRow">
                  <div className="col col-md-12 col-lg-12 col-xl-12">
                    <div className="compartmentIconContainer">
                      <div
                        onClick={
                          updateEnableForConfigure ? handleAddAssociation : ""
                        }
                        className="compartmentIcon"
                      >
                        <div>
                          <Icon root="common" name="badge-plus" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">
                            {t("FinishedProductInfo_Add")}
                          </h5>
                        </div>
                      </div>

                      <div
                        onClick={
                          updateEnableForConfigure
                            ? handleDeleteAssociation
                            : ""
                        }
                        className="compartmentIcon margin_l30"
                      >
                        <div>
                          <Icon root="common" name="delete" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">{t("DestAdd_Delete")}</h5>
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
                      expandedRows={expandedRows}
                      rowExpansionTemplate={rowExpansionTemplate}
                      onSelectionChange={handleRowSelectionChange}
                    >
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ShareholderCode"
                        field="ShareholderCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Receipt_Shareholder")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleCustomEditDropDown(
                            celldata,
                            listOptions.shareholders
                          )
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="CompartmentSeqNoInVehicle"
                        field="CompartmentSeqNoInVehicle"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ShipmentCompDetail_CompSeqInVehicle")
                        )}
                        editable={updateEnableForConfigure}
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
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ShipmentCompDetail_ProductCode")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleProductEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="SupplierCode"
                        field="SupplierCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Receipt_Supplier")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleCustomerEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="OriginTerminalCode"
                        field="OriginTerminalCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ReceiptCompDetail_Origin")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleOriginalTerminalEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="Quantity"
                        field="Quantity"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ShipmentCompDetail_Quantity")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        renderer={(cellData) => decimalDisplayValues(cellData)}
                        customEditRenderer={handleCustomEditTextBox}
                      ></DataTable.Column>
                      {isTransloading ? (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          key="IsTransloading"
                          field="IsTransloading"
                          header={t("Marine_ReceiptCompDetail_Transloading")}
                          renderer={(cellData) =>
                            handleIsTransloadingCheckbox(cellData)
                          }
                        ></DataTable.Column>
                      ) : (
                        ""
                      )}
                      <DataTable.Column
                        className="compColHeight"
                        initialWidth="170px"
                        renderer={expanderTemplate}
                      />
                    </DataTable>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane title={t("ShipmentTankPlanning")}>
                <div className="row compartmentRow">
                  <div className="col col-md-12 col-lg-12 col-xl-12">
                    <div className="compartmentIconContainer">
                      <div
                        onClick={
                          updateEnableForConfigure
                            ? handleAddTankAssociation
                            : ""
                        }
                        className="compartmentIcon"
                      >
                        <div>
                          <Icon root="common" name="badge-plus" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">
                            {t("FinishedProductInfo_Add")}
                          </h5>
                        </div>
                      </div>

                      <div
                        onClick={
                          updateEnableForConfigure
                            ? handleDeleteTankAssociation
                            : ""
                        }
                        className="compartmentIcon margin_l30"
                      >
                        <div>
                          <Icon root="common" name="delete" size="medium" />
                        </div>
                        <div className="margin_l10">
                          <h5 className="font14">{t("DestAdd_Delete")}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row marginRightZero tableScroll">
                  <div className="col-12 detailsTable">
                    <DataTable
                      data={modTankAssociations}
                      selectionMode="multiple"
                      selection={selectedTankAssociations}
                      onSelectionChange={handleTankAssociationSelectionChange}
                    >
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ShareholderCode"
                        field="ShareholderCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Receipt_Shareholder")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleTankPlanEditDropDown(
                            celldata,
                            listOptions.shareholders
                          )
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="CompartmentSeqNoInVehicle"
                        field="CompartmentSeqNoInVehicle"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ReceiptCompDetail_CompSeqInVehicle")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleTankPlanEditDropDown(
                            celldata,
                            listOptions.compSeqOptions
                          )
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="FinishedProductCode"
                        field="FinishedProductCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Receipt_Product")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleTankProductEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="BaseProductCode"
                        field="BaseProductCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ReceiptCompDetail_BaseProduct")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleBaseProductEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="TankCode"
                        field="TankCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ReceiptCompDetail_Tank")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleTankCodeEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="PlannedQuantity"
                        field="PlannedQuantity"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ReceiptCompDetail_Quantity")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={handleTankPlanEditTextBox}
                      ></DataTable.Column>
                    </DataTable>
                  </div>
                </div>
              </Tab.Pane>
              {compDetailsTab.map(() => {
                return (
                  <Tab.Pane
                    title={t("ViewReceiptList_CompartmentDetails")}
                    disabled={
                      updateEnableForConfigure &&
                      marineReceipt.ReceiptCode === ""
                    }
                  >
                    <div className="row marginRightZero tableScroll">
                      <div className="col-12 detailsTable">
                        <DataTable
                          data={receiptCompartmentDetails}
                          expandedRows={expandedCompDetailRows}
                          rowExpansionTemplate={rowExpansionTemplateDetail}
                        >
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="CompartmentSeqNoInVehicle"
                            field="CompartmentSeqNoInVehicle"
                            header={t("ViewMarineReceiptList_SeqNo")}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="FinishedProductCode"
                            field="FinishedProductCode"
                            header={t("ViewMarineReceiptList_ProductCode")}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="ReceiptCompartmentStatus"
                            field="ReceiptCompartmentStatus"
                            header={t("ViewMarineReceiptList_Status")}
                            renderer={(cellData) =>
                              statusDisplayValues(cellData)
                            }
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="PlannedQuantity"
                            field="PlannedQuantity"
                            header={t("ViewMarineReceiptList_PlannedQuantity")}
                            renderer={(cellData) =>
                              quantityplayValues(cellData)
                            }
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="AdjustedPlanQuantity"
                            field="AdjustedPlanQuantity"
                            header={t(
                              "ViewMarineReceiptList_RevisedPlannedQuantity"
                            )}
                            renderer={(cellData) =>
                              quantityplayValues(cellData)
                            }
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="UnloadedQuantity"
                            field="UnloadedQuantity"
                            header={t("ViewMarineReceiptList_UnloadedQuantity")}
                            renderer={(cellData) =>
                              quantityplayValues(cellData)
                            }
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="AdjustPlan"
                            field="AdjustPlan"
                            header={t("ViewMarineReceiptList_AdjustPlan")}
                            renderer={(cellData) =>
                              handleReceiptEditTextBox(cellData)
                            }
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="ForceComplete"
                            field="ForceComplete"
                            header={t("ViewMarineReceiptList_ForceComplete")}
                            renderer={(cellData) =>
                              handleReceiptEdiCheckbox(cellData)
                            }
                          ></DataTable.Column>
                        </DataTable>
                      </div>
                    </div>
                  </Tab.Pane>
                );
              })}
            </Tab>
          </div>
          <TranslationConsumer>
            {(t) => (
              <Modal open={modelOpen} size="small">
                <Modal.Content>
                  <div>
                    <b>{t("ViewMarineReceipt_ForceCompleteConfirm")}</b>
                  </div>
                </Modal.Content>
                <Modal.Footer>
                  <Button
                    type="secondary"
                    content={t("Cancel")}
                    onClick={() => setModelOpen(false)}
                  />
                  <Button
                    type="primary"
                    content={t("PipelineReceipt_BtnSubmit")}
                    onClick={() => {
                      setModelOpen(false);
                      handleCellDataEdit("", modCellData);
                    }}
                  />
                </Modal.Footer>
              </Modal>
            )}
          </TranslationConsumer>
        </div>
      )}
    </TranslationConsumer>
  );
}
