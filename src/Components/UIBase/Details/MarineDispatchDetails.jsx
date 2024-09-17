import React, { useState } from "react";
import { DataTable } from "@scuf/datatable";
import {
  DatePicker,
  Input,
  Select,
  Icon,
  Tab,
  Checkbox,
  Button,
  Modal,
  Accordion,
} from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
  handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
import {
  MarineDispatchCompartmentDetailType,
  Shipment_Status,
} from "../../../JS/Constants";
import { AttributeDetails } from "./AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import * as Constants from "../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";

MarineDispatchDetails.propTypes = {
  marineDispatch: PropTypes.object.isRequired,
  modMarineDispatch: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
    shipmentUOM: PropTypes.array,
    carrierCompany: PropTypes.array,
    compSeqOptions: PropTypes.array,
    vessels: PropTypes.array,
    FinishedProducts: PropTypes.object,
    customerDestinationOptions: PropTypes.object,
    shareholderCustomers: PropTypes.array,
  }).isRequired,

  selectedAssociations: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  handleAssociationSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  onVesselSearchChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  marineShipmentPlan: PropTypes.array.isRequired,
  handleInputDataEdit: PropTypes.func.isRequired,
  compartmentDetailsSave: PropTypes.func.isRequired,
  operationsVisibilty: PropTypes.object.isRequired,
  handleCellCheck: PropTypes.func.isRequired,
  viewTab: PropTypes.number.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  expandedRows: PropTypes.array.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  expandedCellRows: PropTypes.array.isRequired,
  modMarineCompartmentDetails: PropTypes.array.isRequired,
  onCarrierSearchChange: PropTypes.func.isRequired,
  isHSEInspectionEnable: PropTypes.bool.isRequired,
  isBondShow: PropTypes.bool.isRequired,
  onCarrierCompanyChange: PropTypes.func.isRequired,
  isSlotbookinginUI: PropTypes.bool.isRequired,
  updateEnableForConfigure: PropTypes.bool.isRequired,
};

MarineDispatchDetails.defaultProps = {
  isEnterpriseNode: false,
  isSlotbookinginUI: false,
};

export function MarineDispatchDetails({
  allocationDetails,
  marineDispatch,
  modMarineDispatch,
  modAssociations,
  modTankAssociations,
  validationErrors,
  listOptions,
  selectedAssociations,
  selectedTankAssociations,
  onFieldChange,
  onDateTextChange,
  handleAssociationSelectionChange,
  handleTankAssociationSelectionChange,
  handleCellDataEdit,
  handleTankCellDataEdit,
  handleAddAssociation,
  handleAddTankAssociation,
  handleDeleteAssociation,
  handleDeleteTankAssociation,
  onVesselSearchChange,
  isEnterpriseNode,
  handleInputDataEdit,
  operationsVisibilty,
  handleCellCheck,
  viewTab,
  onTabChange,
  handleAttributeCellDataEdit,
  attributeValidationErrors,
  selectedAttributeList,
  handleCompAttributeCellDataEdit,
  expandedRows,
  toggleExpand,
  expandedCellRows,
  modMarineCompartmentDetails,
  onCarrierSearchChange,
  isHSEInspectionEnable,
  isBondShow,
  onCarrierCompanyChange,
  compDetailsTab,
  allocationTab,
  isSlotbookinginUI,
  updateEnableForConfigure,
}) {
  const [t] = useTranslation();
  const [isBondNoShow, setBondNoShow] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [modCellData, setModCellData] = useState({});

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

  const handleTankCodeEditDropDown = (cellData) => {
    return handleTankPlanEditDropDown(cellData, listOptions.tankCodeOptions);
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modAssociations[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
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

  const handleCustomerEditDropDown = (cellData) => {
    let customerOptions = [];
    if (
      listOptions.shareholderCustomers !== undefined &&
      listOptions.shareholderCustomers !== null
    ) {
      let customers = listOptions.shareholderCustomers.filter(
        (shareholderCust) =>
          shareholderCust.ShareholderCode === cellData.rowData.ShareholderCode
      );
      if (
        customers.length > 0 &&
        customers[0].CustomerDestinationsList !== null
      ) {
        Object.keys(customers[0].CustomerDestinationsList).forEach((customer) =>
          customerOptions.push({ text: customer, value: customer })
        );
      }
    }
    return handleCustomEditDropDown(cellData, customerOptions);
  };

  const handleBaseProductEditDropDown = (cellData) => {
    let baseProductOptions = [];
    if (
      listOptions.baseProductDetails.ALLPROD !== undefined &&
      listOptions.baseProductDetails.ALLPROD !== null
    ) {
      var baseProductDetails = listOptions.baseProductDetails.ALLPROD.concat(
        listOptions.additiveDetails.ALLPROD
      );
    }
    if (baseProductDetails !== undefined && baseProductDetails !== null) {
      if (baseProductDetails.length > 0) {
        Object.values(baseProductDetails).forEach((baseProduct) =>
          baseProductOptions.push({ text: baseProduct, value: baseProduct })
        );
      }
    }
    return handleTankPlanEditDropDown(cellData, baseProductOptions);
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

  const handleDestinationEditDropDown = (cellData) => {
    let destinationOptions = [];
    let customerDestinationOptions = [];
    if (
      listOptions.shareholderCustomers !== undefined &&
      listOptions.shareholderCustomers !== null
    ) {
      let customers = listOptions.shareholderCustomers.filter(
        (shareholderCust) =>
          shareholderCust.ShareholderCode === cellData.rowData.ShareholderCode
      );
      if (
        customers.length > 0 &&
        customers[0].CustomerDestinationsList !== null
      ) {
        customerDestinationOptions = customers[0].CustomerDestinationsList;
      }
      if (
        customerDestinationOptions[cellData.rowData.CustomerCode] !==
        undefined &&
        Array.isArray(customerDestinationOptions[cellData.rowData.CustomerCode])
      ) {
        customerDestinationOptions[cellData.rowData.CustomerCode].forEach(
          (destination) =>
            destinationOptions.push({ text: destination, value: destination })
        );
      }
    }
    return handleCustomEditDropDown(cellData, destinationOptions);
  };

  const decimalDisplayValues = (cellData) => {
    const { value } = cellData;
    try {
      if (typeof value === "number") {
        return value.toLocaleString();
      } else {
        return value;
      }
    } catch (error) {
      return value;
    }
  };

  const handleQuantity = (e, UOM) => {
    if (e !== null && e !== "") {
      return e + UOM;
    } else {
      return "";
    }
  };

  const handleStatus = (e) => {
    if (e === MarineDispatchCompartmentDetailType.EMPTY) {
      return "EMPTY";
    } else if (e === MarineDispatchCompartmentDetailType.LOADING) {
      return "LOADING";
    } else if (e === MarineDispatchCompartmentDetailType.PART_FILLED) {
      return "PART_FILLED";
    } else if (e === MarineDispatchCompartmentDetailType.OVER_FILLED) {
      return "OVER_FILLED";
    } else if (e === MarineDispatchCompartmentDetailType.FORCE_COMPLETED) {
      return "FORCE_COMPLETED";
    } else if (e === MarineDispatchCompartmentDetailType.COMPLETED) {
      return "COMPLETED";
    } else if (e === MarineDispatchCompartmentDetailType.INTERRUPTED) {
      return "INTERRUPTED";
    } else {
      return "";
    }
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

  const changeBondNo = (checked) => {
    setBondNoShow(checked);
    this.props.onFieldChange("Bonded");
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

  const inputInDataTable = (rowData) => {
    let rowIndex = modMarineCompartmentDetails.findIndex(
      (item) =>
        item.CompartmentSeqNoInVehicle === rowData.CompartmentSeqNoInVehicle
    );
    return (
      <div>
        {operationsVisibilty.adjustPlanIsDisable ||
          (modMarineDispatch.DispatchStatus !== Shipment_Status.QUEUED &&
            modMarineDispatch.DispatchStatus !==
            Shipment_Status.PARTIALLY_LOADED &&
            modMarineDispatch.DispatchStatus !== Shipment_Status.AUTO_LOADED &&
            modMarineDispatch.DispatchStatus !== Shipment_Status.INTERRUPTED &&
            modMarineDispatch.DispatchStatus !==
            Shipment_Status.MANUALLY_LOADED) ||
          rowData.DispatchCompartmentStatus === 1 ||
          rowData.DispatchCompartmentStatus === 4 ||
          rowData.DispatchCompartmentStatus === 5 ||
          rowData.DispatchCompartmentStatus === 3 ||
          isEnterpriseNode ? (
          <Input fluid disabled={true} />
        ) : (
          <Input
            fluid
            disabled={false}
            value={
              modMarineCompartmentDetails[rowIndex].AdjustmentToPlannedQuantity
            }
            onChange={(value) => {
              handleInputDataEdit(value, rowData);
            }}
            reserveSpace={false}
          />
        )}
      </div>

      // <Input
      //   fluid
      //   onChange={(value) => {
      //     handleInputDataEdit(value, rowData);
      //     setModSaveCompartmentDetails(false);
      //   }}
      //   type="number"
      //   disabled={
      //     operationsVisibilty.adjustPlanIsDisable ||
      //     modMarineDispatch.DispatchStatus !==
      //       (Shipment_Status.PARTIALLY_LOADED ||
      //         Shipment_Status.AUTO_LOADED ||
      //         Shipment_Status.INTERRUPTED ||
      //         Shipment_Status.MANUALLY_LOADED) ||
      //     rowData.DispatchCompartmentStatus ===
      //       ShipmentCompartmentStatus.LOADING ||
      //     rowData.DispatchCompartmentStatus ===
      //       ShipmentCompartmentStatus.FORCE_COMPLETED ||
      //     rowData.DispatchCompartmentStatus ===
      //       ShipmentCompartmentStatus.COMPLETED ||
      //     rowData.DispatchCompartmentStatus ===
      //       ShipmentCompartmentStatus.OVER_FILLED
      //   }
      //   reserveSpace={false}
      // />
    );
  };

  const checkBoxInDataTable = (cellData) => {
    let isChecked = cellData.rowData.forceComplete;
    modMarineCompartmentDetails.forEach((x) => {
      if (
        x.CompartmentSeqNoInVehicle ===
        cellData.rowData.CompartmentSeqNoInVehicle
      ) {
        isChecked = x.forceComplete;
      }
    });
    return (
      <div>
        {operationsVisibilty.forceCompleteIsDisable ||
          (modMarineDispatch.DispatchStatus !== Shipment_Status.QUEUED &&
            modMarineDispatch.DispatchStatus !==
            Shipment_Status.PARTIALLY_LOADED &&
            modMarineDispatch.DispatchStatus !== Shipment_Status.AUTO_LOADED &&
            modMarineDispatch.DispatchStatus !== Shipment_Status.INTERRUPTED &&
            modMarineDispatch.DispatchStatus !==
            Shipment_Status.MANUALLY_LOADED) ||
          cellData.rowData.DispatchCompartmentStatus === 1 ||
          cellData.rowData.DispatchCompartmentStatus === 4 ||
          cellData.rowData.DispatchCompartmentStatus === 5 ||
          cellData.rowData.DispatchCompartmentStatus === 3 ||
          isEnterpriseNode ? (
          <Checkbox disabled={true} />
        ) : (
          <Checkbox
            checked={isChecked}
            disabled={false}
            onClick={(e) => {
              e.stopPropagation();
              if (!cellData.rowData.forceComplete) {
                setModCellData(cellData);
                setModelOpen(true);
              } else {
                handleCellCheck(cellData);
              }
            }}
          />
        )}
      </div>
    );
  };

  const disPlayValue = (cellData) => {
    try {
      const field = cellData.rowData[cellData.field];
      if (field === undefined || field === null || field === "") {
        return "";
      }
      return (
        new Date(field).toLocaleDateString() +
        " " +
        new Date(field).toLocaleTimeString()
      );
    } catch (error) {
      const field = cellData.rowData[cellData.field];
      console.log("error in disPlayValue", error);
      return new Date(field) + " " + new Date(field);
    }
  };

  const disPlayQuantityValue = (cellData) => {
    const field = cellData.rowData[cellData.field];
    if (field === undefined || field === null || field === "") {
      return "";
    }
    return field + " " + allocationDetails[0].uom;
  };

  function displayTMModalforInValidConfirm() {
    return (
      <TranslationConsumer>
        {(t) => (
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
                }}
              />
              <Button
                type="primary"
                content={t("Confirm")}
                onClick={() => {
                  setModelOpen(false);
                  handleCellCheck(modCellData);
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  const rowExpansionCellTemplate = (data) => {
    let compData = [];
    compData.push(data);
    return (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={compData}>
          <DataTable.Column
            className="compColHeight"
            field="AdjustmentToPlannedQuantity"
            header={t("ViewShipment_AdjustmentToPlannedQuantity")}
            renderer={(cellData) => inputInDataTable(cellData.rowData)}
          />
          <DataTable.Column
            className="compColHeight"
            field="forceComplete"
            header={t("ViewShipment_ForceComplete")}
            renderer={(cellData) => checkBoxInDataTable(cellData)}
          />
        </DataTable>
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
                value={modMarineDispatch.DispatchCode}
                indicator="required"
                disabled={marineDispatch.DispatchCode !== ""}
                onChange={(data) => onFieldChange("DispatchCode", data)}
                label={t("Marine_ShipmentCompDetail_ShipmentNumber")}
                error={t(validationErrors.DispatchCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                disabled={
                  !(
                    updateEnableForConfigure ||
                    marineDispatch.DispatchCode === ""
                  )
                }
                label={t("Marine_ShipmentCompDetail_CarrierCompany")}
                value={modMarineDispatch.CarrierCode}
                options={listOptions.carrierCompany}
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
                disabled={
                  !(
                    updateEnableForConfigure ||
                    marineDispatch.DispatchCode === ""
                  )
                }
                label={t("Marine_ShipmentCompDetail_Vehicle")}
                value={modMarineDispatch.VesselCode}
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
                  modMarineDispatch.ScheduledDate === null
                    ? ""
                    : new Date(modMarineDispatch.ScheduledDate)
                }
                label={t("Marine_ShipmentCompDetail_ScheduledDate")}
                type="datetime"
                disablePast={false}
                indicator="required"
                disabled={
                  !(
                    updateEnableForConfigure ||
                    marineDispatch.DispatchCode === ""
                  )
                }
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
                value={modMarineDispatch.DispatchStatus}
                onChange={(data) => onFieldChange("DispatchStatus", data)}
                label={t("Marine_ShipmentCompDetail_ShipmentStatus")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("MarineDispatchManualEntry_LASelect")}
                label={t("Marine_ShipmentCompDetail_UOM")}
                value={modMarineDispatch.QuantityUOM}
                multiple={false}
                indicator="required"
                options={listOptions.shipmentUOM}
                onChange={(data) => onFieldChange("QuantityUOM", data)}
                error={t(validationErrors.QuantityUOM)}
                disabled={
                  !(
                    updateEnableForConfigure ||
                    marineDispatch.DispatchCode === ""
                  )
                }
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modMarineDispatch.Description}
                disabled={
                  !(
                    updateEnableForConfigure ||
                    marineDispatch.DispatchCode === ""
                  )
                }
                onChange={(data) => onFieldChange("Description", data)}
                label={t("CarrierDetails_Desc")}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            {marineDispatch.DispatchCode !== "" && isSlotbookinginUI ? (
              <div className="col-12 col-md-6 col-lg-4 ddlSelectAll">
                <div className="ui single-input fluid disabled">
                  <div class="ui input-label">
                    <span className="input-label-message">
                      {t("ViewShipment_IsSlotBooked")}
                    </span>
                  </div>
                  <div className="input-wrap">
                    <label style={{ fontWeight: "bold" }}>
                      {modMarineDispatch.SlotBooked ? "Booked" : "Not Booked"}
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {!(
              updateEnableForConfigure && marineDispatch.DispatchCode === ""
            ) &&
              !isEnterpriseNode &&
              isHSEInspectionEnable ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  value={modMarineDispatch.HSEInspectionStatus}
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
                value={modMarineDispatch.Active}
                options={[
                  { text: t("ViewShipment_Ok"), value: true },
                  { text: t("ViewShipmentStatus_Inactive"), value: false },
                ]}
                onChange={(data) => onFieldChange("Active", data)}
                disabled={
                  !(
                    updateEnableForConfigure ||
                    marineDispatch.DispatchCode === ""
                  )
                }
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modMarineDispatch.Remarks}
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modMarineDispatch.Active !== marineDispatch.Active
                    ? "required"
                    : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
                disabled={
                  !(
                    updateEnableForConfigure ||
                    marineDispatch.DispatchCode === ""
                  )
                }
              />
            </div>
            {/*{isEnterpriseNode ? (*/}
            {/*    <div className="col-12 col-md-6 col-lg-4">*/}
            {/*      <AssociatedTerminals*/}
            {/*          terminalList={listOptions.terminalCodes}*/}
            {/*          selectedTerminal={modMarineDispatch.TerminalCodes}*/}
            {/*          error={validationErrors.TerminalCodes}*/}
            {/*          onFieldChange={onFieldChange}*/}
            {/*          onCheckChange={onAllTerminalsChange}*/}
            {/*      ></AssociatedTerminals>*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    ""*/}
            {/*)}*/}
            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder="Select"
                  indicator="required"
                  label={t("TerminalCodes")}
                  value={
                    modMarineDispatch.TerminalCodes === null
                      ? ""
                      : modMarineDispatch.TerminalCodes.length === 0
                        ? ""
                        : modMarineDispatch.TerminalCodes[0]
                  }
                  disabled={
                    !(
                      updateEnableForConfigure ||
                      marineDispatch.DispatchCode === ""
                    )
                  }
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
            {!(
              updateEnableForConfigure && marineDispatch.DispatchCode === ""
            ) && isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  placeholder=""
                  label={t("Shipment_LoadedTerminal")}
                  value={marineDispatch.ActualTerminalCode}
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
                  label={t("ViewShipmentStatus_ShipmentBond")}
                  checked={isBondNoShow || marineDispatch.BondNumber !== null}
                  onChange={(checked) => changeBondNo(checked)}
                  disabled={!updateEnableForConfigure}
                />
              </div>
            ) : (
              ""
            )}
            {isBondShow &&
              (isBondNoShow || marineDispatch.BondNumber !== null) ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  fluid
                  indicator="required"
                  label={t("Shipment_BondedNo")}
                  value={marineDispatch.BondNumber}
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
          <div>
            <Tab
              defaultActiveIndex={viewTab}
              onTabChange={onTabChange}
              className="col-12"
            >
              <Tab.Pane title={t("Shipment_Compartment_Planning_Tab_Header")}>
                <div className="row compartmentRow">
                  <div className="col col-md-12 col-lg-12 col-xl-12">
                    {updateEnableForConfigure ? (
                      <div className="compartmentIconContainer">
                        <div
                          onClick={handleAddAssociation}
                          className="compartmentIcon"
                        >
                          <div>
                            <Icon
                              root="common"
                              name="badge-plus"
                              size="medium"
                            />
                          </div>
                          <div className="margin_l10">
                            <h5 className="font14">
                              {t("FinishedProductInfo_Add")}
                            </h5>
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
                            <h5 className="font14">{t("DestAdd_Delete")}</h5>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="compartmentIconContainer">
                        <div className="compartmentIcon">
                          <div>
                            <Icon
                              root="common"
                              name="badge-plus"
                              size="medium"
                            />
                          </div>
                          <div className="margin_l10">
                            <h5 className="font14">
                              {t("FinishedProductInfo_Add")}
                            </h5>
                          </div>
                        </div>

                        <div className="compartmentIcon margin_l30">
                          <div>
                            <Icon root="common" name="delete" size="medium" />
                          </div>
                          <div className="margin_l10">
                            <h5 className="font14">{t("DestAdd_Delete")}</h5>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row marginRightZero tableScroll">
                  <div className="col-12 detailsTable">
                    <DataTable
                      data={modAssociations}
                      selectionMode="multiple"
                      selection={selectedAssociations}
                      onSelectionChange={handleAssociationSelectionChange}
                      rowExpansionTemplate={rowExpansionTemplate}
                      expandedRows={expandedRows}
                    >
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ShareholderCode"
                        field="ShareholderCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ShipmentCompDetail_Shareholder")
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
                        key="CustomerCode"
                        field="CustomerCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ShipmentCompDetail_Customer")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleCustomerEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="DestinationCode"
                        field="DestinationCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Marine_ShipmentCompDetail_Destination")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleDestinationEditDropDown(celldata)
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
                    {updateEnableForConfigure ? (
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
                            <Icon
                              root="common"
                              name="badge-plus"
                              size="medium"
                            />
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
                    ) : (
                      <div className="compartmentIconContainer">
                        <div className="compartmentIcon">
                          <div>
                            <Icon
                              root="common"
                              name="badge-plus"
                              size="medium"
                            />
                          </div>
                          <div className="margin_l10">
                            <h5 className="font14">
                              {t("FinishedProductInfo_Add")}
                            </h5>
                          </div>
                        </div>

                        <div className="compartmentIcon margin_l30">
                          <div>
                            <Icon root="common" name="delete" size="medium" />
                          </div>
                          <div className="margin_l10">
                            <h5 className="font14">{t("DestAdd_Delete")}</h5>
                          </div>
                        </div>
                      </div>
                    )}
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
                          t("Marine_ShipmentCompDetail_Shareholder")
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
                          t("Marine_ShipmentCompDetail_CompSeqInVehicle")
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
                          t("Marine_ShipmentCompDetail_ProductCode")
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
                          t("Marine_ShipmentCompDetail_BaseProduct")
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
                          t("Marine_ShipmentCompDetail_Tank")
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
                          t("Marine_ShipmentCompDetail_Quantity")
                        )}
                        editable={updateEnableForConfigure}
                        editFieldType="text"
                        renderer={(cellData) => decimalDisplayValues(cellData)}
                        customEditRenderer={handleTankPlanEditTextBox}
                      ></DataTable.Column>
                    </DataTable>
                  </div>
                </div>
              </Tab.Pane>
              {compDetailsTab.map(() => {
                return (
                  <Tab.Pane
                    title={t("ViewShipment_LoadingDetails_TopUpDecant")}
                    disabled={
                      marineDispatch.DispatchCode === "" &&
                      updateEnableForConfigure
                    }
                  >
                    <div className="row marginRightZero tableScroll">
                      <div className="col-12 detailsTable">
                        <DataTable
                          data={modMarineCompartmentDetails}
                          rowExpansionTemplate={rowExpansionCellTemplate}
                          expandedRows={expandedCellRows}
                        >
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="CompartmentSeqNoInVehicle"
                            header={t("ViewMarineShipmentList_SeqNo")}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="FinishedProductCode"
                            header={t("ViewShipmentCompartment_Product")}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="DispatchCompartmentStatus"
                            header={t("ViewShipmentStatus_Status")}
                            renderer={(celldata) =>
                              handleStatus(
                                celldata.rowData.DispatchCompartmentStatus
                              )
                            }
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="PlannedQuantity"
                            header={t(
                              "ViewShipmentCompartment_PlannedQuantity"
                            )}
                            renderer={(cellData) =>
                              handleQuantity(
                                cellData.rowData.PlannedQuantity,
                                cellData.rowData.PlanQuantityUOM
                              )
                            }
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="AdjustedPlanQuantity"
                            header={t(
                              "ViewShipmentCompartment_AdjustedQuantity"
                            )}
                            renderer={(cellData) =>
                              handleQuantity(
                                cellData.rowData.AdjustedPlanQuantity,
                                cellData.rowData.PlanQuantityUOM
                              )
                            }
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="ReturnQuantity"
                            header={t("ViewMarineShipmentList_ReturnQuantity")}
                            renderer={(cellData) =>
                              handleQuantity(
                                cellData.rowData.ReturnQuantity,
                                cellData.rowData.PlanQuantityUOM
                              )
                            }
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="LoadedQuantity"
                            header={t("ViewMarineShipmentList_LoadedQuantity")}
                            renderer={(cellData) =>
                              handleQuantity(
                                cellData.rowData.LoadedQuantity,
                                cellData.rowData.PlanQuantityUOM
                              )
                            }
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="AdjustmentToPlannedQuantity"
                            header={t(
                              "ViewShipment_AdjustmentToPlannedQuantity"
                            )}
                            renderer={(cellData) =>
                              inputInDataTable(cellData.rowData)
                            }
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field="forceComplete"
                            header={t("ViewShipment_ForceComplete")}
                            renderer={(cellData) =>
                              checkBoxInDataTable(cellData)
                            }
                          />
                        </DataTable>
                      </div>
                    </div>
                  </Tab.Pane>
                );
              })}
              {allocationTab.map(() => {
                return (
                  <Tab.Pane
                    title={t("ViewMarineShipmentProductAllocation_Item")}
                    disabled={
                      marineDispatch.DispatchCode === "" &&
                      updateEnableForConfigure
                    }
                  >
                    <div className="row marginRightZero tableScroll">
                      <div className="col-12 detailsTable">
                        <DataTable data={allocationDetails} scrollable={true}>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="EntityCode"
                            field="EntityCode"
                            header={t(
                              "MarineShipmentProductAllocationDetails_CustomerCode"
                            )}
                            editable={false}
                            editFieldType="text"
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="productcode"
                            field="productcode"
                            header={t(
                              "MarineShipmentProductAllocationDetails_ProductCode"
                            )}
                            editable={false}
                            editFieldType="text"
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            header={t(
                              "MarineShipmentProductAllocationDetails_AllocationType"
                            )}
                            field="allocationtype"
                            key="allocationtype"
                            editable={false}
                            editFieldType="text"
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="allocationperiod"
                            field="allocationperiod"
                            header={t(
                              "MarineShipmentProductAllocationDetails_AllocationFrequency"
                            )}
                            editable={false}
                            editFieldType="text"
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            header={t(
                              "MarineShipmentProductAllocationDetails_StartDate"
                            )}
                            editable={false}
                            key="startdate"
                            field="startdate"
                            editFieldType="text"
                            renderer={(cellData) => disPlayValue(cellData)}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            header={t(
                              "MarineShipmentProductAllocationDetails_EndDate"
                            )}
                            editable={false}
                            key="enddate"
                            field="enddate"
                            editFieldType="text"
                            renderer={(cellData) => disPlayValue(cellData)}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            header={t(
                              "MarineShipmentProductAllocationDetails_AllocatedQuantity"
                            )}
                            editable={false}
                            key="allocatedqty"
                            field="allocatedqty"
                            editFieldType="text"
                            renderer={(cellData) =>
                              disPlayQuantityValue(cellData)
                            }
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            header={t(
                              "MarineShipmentProductAllocationDetails_BlockedQuantity"
                            )}
                            editable={false}
                            key="blockedqty"
                            field="blockedqty"
                            editFieldType="text"
                            renderer={(cellData) =>
                              disPlayQuantityValue(cellData)
                            }
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            header={t(
                              "MarineShipmentProductAllocationDetails_LoadedQuantity"
                            )}
                            editable={false}
                            key="loadedqty"
                            field="loadedqty"
                            editFieldType="text"
                            renderer={(cellData) =>
                              disPlayQuantityValue(cellData)
                            }
                          ></DataTable.Column>
                        </DataTable>
                      </div>
                    </div>
                  </Tab.Pane>
                );
              })}
            </Tab>
            {displayTMModalforInValidConfirm()}
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
