import React from "react";
import { useTranslation } from "@scuf/localization";
import {
  Select,
  Icon,
  Input,
  Checkbox,
  DatePicker,
  Accordion,
  Button,
} from "@scuf/common";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import * as Constants from "../../../JS/Constants";
import { getKeyByValue } from "../../../JS/Utilities";
import { AttributeDetails } from "../Details/AttributeDetails";
import { DataTable } from "@scuf/datatable";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { handleIsRequiredCompartmentCell } from "../../../JS/functionalUtilities";
import * as Utilities from "../../../JS/Utilities";

OrderDetails.propTypes = {
  order: PropTypes.object.isRequired,
  modOrder: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    //orderTypeOptions: PropTypes.array,
    unitOfWeight: PropTypes.array,
    unitOfVolume: PropTypes.array,
    terminalCodes: PropTypes.array,
    finishedProductOptions: PropTypes.array,
    customerOptions: PropTypes.array,
  }).isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  selectedPlanRow: PropTypes.array.isRequired,
  modOrderItems: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddPlan: PropTypes.func.isRequired,
  handleDeletePlan: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  expandedRows: PropTypes.array.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  compartmentDetailsPageSize: PropTypes.number.isRequired,
  handleForceClose: PropTypes.func.isRequired,
  handleViewShipments: PropTypes.func.isRequired,
  enableForceClose: PropTypes.bool.isRequired,
};

OrderDetails.defaultProps = {
  listOptions: {
    terminalCodes: [],
    //orderTypeOptions: [],
    unitOfVolume: [],
    unitOfWeight: [],
    finishedProductOptions: [],
    customerOptions: [],
  },
  modOrderItems: [],
  isEnterpriseNode: false,
};

export default function OrderDetails({
  order,
  modOrder,
  onFieldChange,
  validationErrors,
  attributeValidationErrors,
  onDateTextChange,
  listOptions,
  onAllTerminalsChange,
  onAttributeDataChange,
  handleCompAttributeCellDataEdit,
  handleAddPlan,
  handleDeletePlan,
  selectedPlanRow,
  modAttributeMetaDataList,
  expandedRows,
  handleRowSelectionChange,
  handleCellDataEdit,
  selectedShareholder,
  modOrderItems,
  toggleExpand,
  compartmentDetailsPageSize,
  isEnterpriseNode,
  handleForceClose,
  handleViewShipments,
  enableForceClose
}) {
  const [t] = useTranslation();

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
    //debugger;
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
        <div class="ui red circular empty label badge  circle-padding" />
      </div>
    ) : (
      <div>
        <span>{data.rowData.AttributeName}</span>
      </div>
    );
  };

  const expanderTemplate = (data) => {
    //const open = expandedRows.includes(data.rowData);
    //debugger
    const open =
      expandedRows.findIndex((x) => x.SeqNumber === data.rowData.SeqNumber) >= 0
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
        <DataTable
          data={data.AttributesforUI}
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

  const handleTextEdit = (cellData) => {
    let val = modOrderItems[cellData.rowIndex][cellData.field];
    if (cellData.field === "Quantity" && val !== null && val !== "")
      val = val.toLocaleString();
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <Input
        fluid
        value={val}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
        // error={t(validationErrors.Description)}
        // disabled={cellData.field === "Code" ? true : false}
      />
      //   )}
      // </TranslationConsumer>
    );
  };

  const handleDropdownEdit = (cellData) => {
    let dropDownOptions = [];
    if (cellData.field === "QuantityUOM") {
      dropDownOptions = [
        ...listOptions.unitOfVolume,
        ...listOptions.unitOfWeight,
      ];
    }
    if (cellData.field === "FinishedProductCode")
      dropDownOptions = listOptions.finishedProductOptions;
    return (
      <Select
        className="selectDropwdown"
        placeholder={t("Common_Select")}
        value={modOrderItems[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownOptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        // indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  return (
    // <TranslationConsumer>
    //   {(t) => (
    <div className="detailsContainer">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modOrder.OrderCode}
            label={t("ShipmentOrder_OrderCode")}
            indicator="required"
            disabled={order.OrderCode !== ""}
            onChange={(data) => onFieldChange("OrderCode", data)}
            error={t(validationErrors.OrderCode)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("Customer_Code")}
            indicator="required"
            value={modOrder.CustomerCode}
            options={listOptions.customerOptions}
            onChange={(data) => onFieldChange("CustomerCode", data)}
            error={t(validationErrors.CustomerCode)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modOrder.Description}
            label={t("ShipmentOrder_Desc")}
            onChange={(data) => onFieldChange("Description", data)}
            error={t(validationErrors.Description)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modOrder.OrderStartDate === null
                ? ""
                : Utilities.convertStringToCommonDateFormat(
                    modOrder.OrderStartDate
                  )
            }
            displayFormat={getCurrentDateFormat()}
            //type="datetime"
            label={t(`ShipmentOrder_StartDate`)}
            showYearSelector="true"
            indicator="required"
            // disablePast={true}
            onChange={(data) => onFieldChange("OrderStartDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("OrderStartDate", value, error);
            }}
            error={t(validationErrors.OrderStartDate)}
            reserveSpace={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modOrder.OrderEndDate === null
                ? ""
                : Utilities.convertStringToCommonDateFormat(
                    modOrder.OrderEndDate
                  )
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`ShipmentOrder_EndDate`)}
            showYearSelector="true"
            indicator="required"
            //type="datetime"
            disablePast={true}
            onChange={(data) => onFieldChange("OrderEndDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("OrderEndDate", value, error);
            }}
            error={t(validationErrors.OrderEndDate)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              getKeyByValue(Constants.orderStatus, modOrder.OrderStatus) ===
              undefined
                ? ""
                : getKeyByValue(Constants.orderStatus, modOrder.OrderStatus)
            }
            label={t("ShipmentOrder_OrderStatus")}
            disabled={true}
            //onChange={(data) => onFieldChange("Description", data)}
            //error={t(validationErrors.Description)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modOrder.OrderDate === null
                ? ""
                : Utilities.convertStringToCommonDateFormat(modOrder.OrderDate)
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`ShipmentOrder_OrderDate`)}
            showYearSelector="true"
            indicator="required"
            // disablePast={true}
            disabled={true}
            //type="datetime"
            //onChange={(data) => onFieldChange("OrderEndDate", data)}
            // onTextChange={(value, error) => {
            //  onDateTextChange("OrderEndDate", value, error);
            // }}
            // error={t(validationErrors.OrderEndDate)}
            reserveSpace={false}
          />
        </div>

        {/* <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("ShipmentOrder_OrderType")}
            value={getKeyByValue(Constants.orderType, modOrder.OrderType)}
            options={listOptions.orderTypeOptions}
            disabled={true}
          // onChange={(data) => onFieldChange("Active", data)}
          />
        </div> */}

        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modOrder.TerminalCodes}
              error={t(validationErrors.TerminalCodes)}
              onFieldChange={onFieldChange}
              onCheckChange={onAllTerminalsChange}
            ></AssociatedTerminals>
          </div>
        ) : (
          ""
        )}

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("ShipmentOrder_Status")}
            value={modOrder.Active}
            options={[
              { text: t("ViewShipment_Ok"), value: true },
              { text: t("ViewShipmentStatus_Inactive"), value: false },
            ]}
            onChange={(data) => onFieldChange("Active", data)}
            disabled={order.OrderCode === "" ? true : false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modOrder.Remarks === null ? "" : modOrder.Remarks}
            label={t("ShipmentOrder_Remarks")}
            onChange={(data) => onFieldChange("Remarks", data)}
            indicator={modOrder.Active !== order.Active ? "required" : ""}
            error={t(validationErrors.Remarks)}
            reserveSpace={false}
          />
        </div>
      </div>
      {modAttributeMetaDataList.length > 0
        ? modAttributeMetaDataList.map((attire) => (
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
                    handleCellDataEdit={onAttributeDataChange}
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
      <div className="row compartmentRow">
        <div className="col col-md-8 col-lg-9 col col-xl-9">
          <h4>{t("ShipmentOrder_PlanHeader")}</h4>
        </div>
        <div className="col col-md-4 col-lg-3 col-xl-3">
          <div className="compartmentIconContainer">
            <div onClick={handleAddPlan} className="compartmentIcon">
              <div>
                <Icon root="common" name="badge-plus" size="medium" />
              </div>
              <div className="margin_l10">
                <h5 className="font14">{t("TrailerInfo_Add")}</h5>
              </div>
            </div>

            <div
              onClick={handleDeletePlan}
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
            data={modOrderItems}
            rowExpansionTemplate={rowExpansionTemplate}
            expandedRows={expandedRows}
            selectionMode="multiple"
            selection={selectedPlanRow}
            onSelectionChange={handleRowSelectionChange}
            scrollable={true}
            scrollHeight="320px"
          >
            <DataTable.Column
              className="compColHeight colminWidth"
              key="FinishedProductCode"
              field="FinishedProductCode"
              header={handleIsRequiredCompartmentCell(
                t("ShipmentOrder_ProductCode")
              )}
              // rowHeader={true}
              editable={true}
              editFieldType="text"
              customEditRenderer={handleDropdownEdit}
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight colminWidth"
              key="Quantity"
              field="Quantity"
              header={handleIsRequiredCompartmentCell(
                t("ShipmentOrder_Quantity")
              )}
              // rowHeader={true}
              editable={true}
              editFieldType="text"
              renderer={(cellData) =>
                cellData.value === null ? "" : cellData.value.toLocaleString()
              }
              customEditRenderer={handleTextEdit}
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight colminWidth"
              key="QuantityUOM"
              field="QuantityUOM"
              header={handleIsRequiredCompartmentCell(t("ShipmentOrder_UOM"))}
              // rowHeader={true}
              editable={true}
              editFieldType="text"
              customEditRenderer={handleDropdownEdit}
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="BlockedQuantity"
              field="BlockedQuantity"
              header={t("ShipmentOrder_ScheduledQuantity")}
              // rowHeader={true}
              renderer={(cellData) =>
                cellData.value === null ? "" : cellData.value.toLocaleString()
              }
              editFieldType="text"
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="LoadedQuantity"
              field="LoadedQuantity"
              header={t("ShipmentOrder_LoadedQuantity")}
              // rowHeader={true}
              renderer={(cellData) =>
                cellData.value === null ? "" : cellData.value.toLocaleString()
              }
              editFieldType="text"
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="ReaminingQuantity"
              field="RemainingQuantity"
              header={t("ShipmentOrder_RemainingQuantity")}
              // rowHeader={true}
              renderer={(cellData) =>
                cellData.value === null ? "" : cellData.value.toLocaleString()
              }
              editFieldType="text"
            ></DataTable.Column>
            <DataTable.Column
              className="expandedColumn"
              initialWidth="200px"
              renderer={expanderTemplate}
            />
          </DataTable>
        </div>
      </div>

      <div className="row">
        <div
          className="col col-md-8 col-lg-9 col col-xl-12"
          style={{ textAlign: "right" }}
        >
          <Button
            content={t("ShipmentOrder_BtnForceClose")}
            disabled={
              order.OrderCode === "" ||
              modOrder.OrderStatus === Constants.orderStatus.CLOSED ||
              modOrder.OrderStatus === Constants.orderStatus.FULLY_DELIVERED||!enableForceClose
                ? true
                : false
            }
            onClick={handleForceClose}
          ></Button>
          {order.OrderCode !== "" ? (
            <Button
              content={t("ShipmentOrder_ViewShipments")}
              // disabled={order.OrderCode === "" || modOrder.OrderStatus === Constants.orderStatus.CLOSED
              //   || modOrder.OrderStatus === Constants.orderStatus.FULLY_DELIVERED ? true : false}
              onClick={handleViewShipments}
            ></Button>
          ) : null}
        </div>
      </div>
    </div>
    //   )}
    // </TranslationConsumer>
  );
}
